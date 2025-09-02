import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerAction()
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { targetId, targetType, voteType } = body

    // Validate input
    if (!targetId || !targetType || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['discussion', 'comment'].includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid target type' },
        { status: 400 }
      )
    }

    if (!['upvote', 'downvote'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type' },
        { status: 400 }
      )
    }

    // Check if user already voted on this item
    const existingVoteQuery = supabase
      .from('interactions')
      .select('id, vote_type')
      .eq('user_id', user.id)
      .eq('vote_type', voteType)

    if (targetType === 'discussion') {
      existingVoteQuery.eq('discussion_id', targetId)
    } else {
      existingVoteQuery.eq('comment_id', targetId)
    }

    const { data: existingVote } = await existingVoteQuery.single()

    // If user already voted the same way, remove the vote (toggle off)
    if (existingVote) {
      const { error: deleteError } = await supabase
        .from('interactions')
        .delete()
        .eq('id', existingVote.id)

      if (deleteError) {
        return NextResponse.json(
          { error: 'Failed to remove vote' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        success: true, 
        action: 'removed',
        voteType 
      })
    }

    // Check for opposite vote to replace it
    const oppositeVoteType = voteType === 'upvote' ? 'downvote' : 'upvote'
    const oppositeVoteQuery = supabase
      .from('interactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('vote_type', oppositeVoteType)

    if (targetType === 'discussion') {
      oppositeVoteQuery.eq('discussion_id', targetId)
    } else {
      oppositeVoteQuery.eq('comment_id', targetId)
    }

    const { data: oppositeVote } = await oppositeVoteQuery.single()

    // Remove opposite vote if it exists
    if (oppositeVote) {
      await supabase
        .from('interactions')
        .delete()
        .eq('id', oppositeVote.id)
    }

    // Add the new vote
    const insertData: {
      user_id: string
      vote_type: string
      value: number
      created_at: string
      discussion_id?: string
      comment_id?: string
    } = {
      user_id: user.id,
      vote_type: voteType,
      value: voteType === 'upvote' ? 1 : -1,
      created_at: new Date().toISOString()
    }

    if (targetType === 'discussion') {
      insertData.discussion_id = targetId
    } else {
      insertData.comment_id = targetId
    }

    const { error: insertError } = await supabase
      .from('interactions')
      .insert(insertData)

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to add vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      action: oppositeVote ? 'changed' : 'added',
      voteType 
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
    const supabase = await createSupabaseServerAction()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({})
    }

    const searchParams = request.nextUrl.searchParams
    const targetId = searchParams.get('targetId')
    const targetType = searchParams.get('targetType')

    if (!targetId || !targetType) {
      return NextResponse.json({})
    }

    // Get user's current vote for this item
    const voteQuery = supabase
      .from('interactions')
      .select('vote_type')
      .eq('user_id', user.id)
      .in('vote_type', ['upvote', 'downvote'])

    if (targetType === 'discussion') {
      voteQuery.eq('discussion_id', targetId)
    } else {
      voteQuery.eq('comment_id', targetId)
    }

    const { data: userVote } = await voteQuery.single()

    return NextResponse.json({
      userVote: userVote?.vote_type || null
    })

  } catch (error) {
    console.error('Get vote API error:', error)
    return NextResponse.json({})
  }
}