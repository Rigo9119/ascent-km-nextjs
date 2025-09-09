import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { createCommentSchema } from '@/lib/validations/api'
import { sanitizeUserContent } from '@/lib/utils/sanitization'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const body = await request.json()
    
    const supabase = await createSupabaseServerAction()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate discussion ID format
    if (!discussionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(discussionId)) {
      return NextResponse.json({ error: 'Invalid discussion ID format' }, { status: 400 })
    }

    // Validate and sanitize input using Zod schema
    const validationResult = createCommentSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Invalid input'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { content, parent_comment_id } = validationResult.data

    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeUserContent(content)

    // Check if discussion exists
    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .select('id')
      .eq('id', discussionId)
      .single()

    if (discussionError || !discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    // If replying to a comment, verify parent comment exists
    if (parent_comment_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parent_comment_id)
        .eq('discussion_id', discussionId)
        .single()

      if (parentError || !parentComment) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }
    }

    // Create the comment with sanitized data
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert({
        content: sanitizedContent,
        discussion_id: discussionId,
        user_id: user.id,
        parent_comment_id: parent_comment_id || null,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        profiles(id, full_name, username, avatar_url)
      `)
      .single()

    if (commentError) {
      console.error('Comment creation error:', commentError)
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Comment created successfully',
      comment
    })

  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ discussionId: string }> }
) {
  try {
    const { discussionId } = await params
    const supabase = await createSupabaseServerAction()

    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles(id, full_name, username, avatar_url)
      `)
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Fetch comments error:', error)
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }

    return NextResponse.json({ comments })

  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}