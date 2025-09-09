import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'
import { createDiscussionSchema } from '@/lib/validations/api'
import { sanitizeTitle, sanitizeUserContent, sanitizeUrl } from '@/lib/utils/sanitization'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const supabase = await createSupabaseServerAction()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate and sanitize input using Zod schema
    const validationResult = createDiscussionSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors[0]?.message || 'Invalid input'
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    const { title, content, community_id, link_url, link_title } = validationResult.data

    // Sanitize content to prevent XSS
    const sanitizedTitle = sanitizeTitle(title)
    const sanitizedContent = sanitizeUserContent(content)
    const sanitizedLinkUrl = link_url ? sanitizeUrl(link_url) : null
    const sanitizedLinkTitle = link_title ? sanitizeTitle(link_title) : null

    // Validate URL if provided
    if (link_url && !sanitizedLinkUrl) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Verify community exists and user has access
    const { data: community, error: communityError } = await supabase
      .from('communities')
      .select('id')
      .eq('id', community_id)
      .single()

    if (communityError || !community) {
      return NextResponse.json({ error: 'Community not found' }, { status: 404 })
    }

    // Create the discussion with sanitized data
    const discussionData = {
      id: crypto.randomUUID(),
      community_id,
      user_id: user.id, // Use authenticated user ID
      title: sanitizedTitle,
      content: sanitizedContent,
      link_url: sanitizedLinkUrl,
      link_title: sanitizedLinkTitle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: discussion, error: discussionError } = await supabase
      .from('discussions')
      .insert(discussionData)
      .select(`
        *,
        profiles(id, full_name, username, avatar_url),
        communities(id, name)
      `)
      .single()

    if (discussionError) {
      console.error('Discussion creation error:', discussionError)
      return NextResponse.json({ error: 'Failed to create discussion' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Discussion created successfully',
      discussion
    })

  } catch (error) {
    console.error('Create discussion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const community_id = searchParams.get('community_id')
    
    const supabase = await createSupabaseServerAction()

    let query = supabase
      .from('discussions')
      .select(`
        *,
        profiles(id, full_name, username, avatar_url),
        communities(id, name),
        _count:comments(count)
      `)
      .order('created_at', { ascending: false })

    // Filter by community if provided
    if (community_id) {
      query = query.eq('community_id', community_id)
    }

    const { data: discussions, error } = await query

    if (error) {
      console.error('Fetch discussions error:', error)
      return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 })
    }

    return NextResponse.json({ discussions })

  } catch (error) {
    console.error('Get discussions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}