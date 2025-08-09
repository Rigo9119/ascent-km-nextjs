import { NextResponse } from 'next/server'
import { createSupabaseServerAction } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      id, 
      community_id, 
      user_id, 
      title, 
      content, 
      link_url, 
      link_title 
    } = body
    
    const supabase = await createSupabaseServerAction()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate required fields
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (!community_id) {
      return NextResponse.json({ error: 'Community ID is required' }, { status: 400 })
    }

    // Validate title and content length
    if (title.length > 200) {
      return NextResponse.json({ error: 'Title too long (max 200 characters)' }, { status: 400 })
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: 'Content too long (max 5000 characters)' }, { status: 400 })
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

    // Create the discussion
    const discussionData = {
      id: id || crypto.randomUUID(),
      community_id,
      user_id: user.id, // Use authenticated user ID
      title: title.trim(),
      content: content.trim(),
      link_url: link_url?.trim() || null,
      link_title: link_title?.trim() || null,
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