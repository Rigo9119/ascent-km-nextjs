import { Blog, BlogCategory } from "@/types/blog";

export const mockBlogCategories: BlogCategory[] = [
  {
    id: "1",
    name: "Technology",
    description: "Latest tech trends and innovations",
    slug: "technology",
    count: 8
  },
  {
    id: "2", 
    name: "Community",
    description: "Community stories and updates",
    slug: "community",
    count: 12
  },
  {
    id: "3",
    name: "Events",
    description: "Event recaps and announcements",
    slug: "events", 
    count: 6
  },
  {
    id: "4",
    name: "Tips & Guides",
    description: "Helpful tips and how-to guides",
    slug: "tips-guides",
    count: 10
  },
  {
    id: "5",
    name: "News",
    description: "Industry news and updates",
    slug: "news",
    count: 15
  }
];

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Building Stronger Communities Through Technology",
    slug: "building-stronger-communities-through-technology",
    excerpt: "Discover how modern technology platforms are revolutionizing the way communities connect, share knowledge, and support each other in meaningful ways.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      bio: "Community manager and tech enthusiast"
    },
    category: "Technology",
    tags: ["community", "technology", "connection"],
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop",
    publishedAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    isFeatured: true,
    isPublished: true
  },
  {
    id: "2", 
    title: "The Ultimate Guide to Community Event Planning",
    slug: "ultimate-guide-community-event-planning",
    excerpt: "Everything you need to know about organizing successful community events, from initial planning to post-event follow-up.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      bio: "Event coordinator with 10+ years experience"
    },
    category: "Tips & Guides",
    tags: ["events", "planning", "community"],
    featuredImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop",
    publishedAt: "2024-01-12T14:30:00Z",
    readTime: 12,
    isFeatured: true,
    isPublished: true
  },
  {
    id: "3",
    title: "Community Spotlight: Local Artists Collective",
    slug: "community-spotlight-local-artists-collective",
    excerpt: "Meet the incredible artists who are bringing creativity and color to our community through collaborative projects and workshops.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Emma Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      bio: "Arts journalist and community advocate"
    },
    category: "Community",
    tags: ["spotlight", "artists", "creativity"],
    featuredImage: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop",
    publishedAt: "2024-01-10T09:15:00Z",
    readTime: 6,
    isFeatured: true,
    isPublished: true
  },
  {
    id: "4",
    title: "Breaking: New Community Center Opens Downtown",
    slug: "new-community-center-opens-downtown",
    excerpt: "The highly anticipated downtown community center has officially opened its doors, offering new spaces for meetings, events, and activities.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      bio: "Local news reporter"
    },
    category: "News",
    tags: ["news", "community center", "opening"],
    featuredImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
    publishedAt: "2024-01-08T16:45:00Z",
    readTime: 4,
    isFeatured: false,
    isPublished: true
  },
  {
    id: "5",
    title: "5 Ways to Get More Involved in Your Local Community",
    slug: "5-ways-get-involved-local-community",
    excerpt: "Looking to make a difference in your neighborhood? Here are five practical ways to get started and become an active community member.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      bio: "Community organizer and volunteer coordinator"
    },
    category: "Tips & Guides",
    tags: ["involvement", "volunteer", "community"],
    featuredImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop",
    publishedAt: "2024-01-05T11:20:00Z",
    readTime: 7,
    isFeatured: false,
    isPublished: true
  },
  {
    id: "6",
    title: "Tech Meetup Recap: AI and Machine Learning in 2024",
    slug: "tech-meetup-recap-ai-machine-learning-2024",
    excerpt: "A comprehensive recap of our recent tech meetup covering the latest developments in AI and machine learning technologies.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face",
      bio: "Software engineer and AI researcher"
    },
    category: "Events",
    tags: ["tech meetup", "AI", "machine learning"],
    featuredImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
    publishedAt: "2024-01-03T13:10:00Z",
    readTime: 10,
    isFeatured: false,
    isPublished: true
  },
  {
    id: "7",
    title: "Sustainable Living Workshop Series Announcement",
    slug: "sustainable-living-workshop-series-announcement",
    excerpt: "Join us for a comprehensive workshop series focused on sustainable living practices and environmental consciousness in our community.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Rachel Green",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      bio: "Environmental activist and educator"
    },
    category: "Events",
    tags: ["sustainability", "workshop", "environment"],
    featuredImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    publishedAt: "2024-01-01T08:00:00Z",
    readTime: 5,
    isFeatured: false,
    isPublished: true
  },
  {
    id: "8",
    title: "How to Start Your Own Community Garden",
    slug: "how-to-start-community-garden",
    excerpt: "A step-by-step guide to organizing and maintaining a community garden that brings neighbors together while promoting healthy living.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    author: {
      name: "Tom Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      bio: "Urban farmer and community garden coordinator"
    },
    category: "Tips & Guides",
    tags: ["gardening", "community", "health"],
    featuredImage: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    publishedAt: "2023-12-28T15:30:00Z",
    readTime: 9,
    isFeatured: false,
    isPublished: true
  }
];