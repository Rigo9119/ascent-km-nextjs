import { NextRequest, NextResponse } from 'next/server'
import { createSbServerClient } from '@/lib/supabase/server'
import { voteSchema } from '@/lib/validations/api'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSbServerClient()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Transform body to match schema expectations
    const transformedBody = {
      target_id: body.targetId,
      target_type: body.targetType,
      vote_type: body.voteType === 'upvote' ? 'up' : 'down'
    }

    // Validate input using Zod schema
    const validationResult = voteSchema.safeParse(transformedBody)
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.issues[0]?.message || 'Invalid input'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { target_id: targetId, target_type: targetType, vote_type } = validationResult.data
    const voteType = vote_type === 'up' ? 'upvote' : 'downvote'

    // Check if user has already voted on this target
    const { data: existingVote, error: fetchError } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_id', targetId)
      .eq('target_type', targetType)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching existing vote:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    let result
    let action: 'added' | 'removed' | 'changed'

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Same vote type - remove the vote
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id)

        if (deleteError) {
          console.error('Error removing vote:', deleteError)
          return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
        }

        action = 'removed'
      } else {
        // Different vote type - update the vote
        const { data: updatedVote, error: updateError } = await supabase
          .from('votes')
          .update({ vote_type: voteType, updated_at: new Date().toISOString() })
          .eq('id', existingVote.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating vote:', updateError)
          return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
        }

        result = updatedVote
        action = 'changed'
      }
    } else {
      // No existing vote - create new vote
      const { data: newVote, error: insertError } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          target_id: targetId,
          target_type: targetType,
          vote_type: voteType
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating vote:', insertError)
        return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 })
      }

      result = newVote
      action = 'added'
    }

    return NextResponse.json({
      success: true,
      action,
      voteType,
      vote: result
    })

  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSbServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')
    const targetType = searchParams.get('targetType')

    if (!targetId || !targetType) {
      return NextResponse.json({ error: 'Missing targetId or targetType' }, { status: 400 })
    }

    if (!['discussion', 'comment'].includes(targetType)) {
      return NextResponse.json({ error: 'Invalid target type' }, { status: 400 })
    }

    // Get user's vote if authenticated
    let userVote = null
    if (user && !authError) {
      const { data: vote, error: voteError } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user.id)
        .eq('target_id', targetId)
        .eq('target_type', targetType)
        .single()

      if (!voteError && vote) {
        userVote = vote.vote_type
      }
    }

    // Get vote counts from the target table
    const tableName = targetType === 'discussion' ? 'discussions' : 'comments'
    const { data: targetData, error: targetError } = await supabase
      .from(tableName)
      .select('score, upvotes, downvotes')
      .eq('id', targetId)
      .single()

    if (targetError) {
      console.error('Error fetching target data:', targetError)
      return NextResponse.json({ error: 'Target not found' }, { status: 404 })
    }

    return NextResponse.json({
      userVote,
      score: targetData.score || 0,
      upvotes: targetData.upvotes || 0,
      downvotes: targetData.downvotes || 0
    })

  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}