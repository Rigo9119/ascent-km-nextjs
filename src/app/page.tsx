import { PageContainer } from "@/components/page-container";
import { ContentSection } from "@/components/content-section";
import { HomeSearch } from "@/components/home-search";
import { FeaturedCarousel } from "@/components/featured-carousel";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { EventsService } from "@/services/events-service";
import { LocationsService } from "@/services/locations-service";
import { CommunitiesService } from "@/services/communities-service";

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic'

async function getHomePageData() {
  try {
    const supabase = await createSupabaseServerAction();
    
    // Initialize services
    const eventsService = new EventsService(supabase);
    const locationsService = new LocationsService(supabase);
    const communitiesService = new CommunitiesService(supabase);
    
    // Fetch data in parallel for better performance
    const [trendingEvents, featuredLocations, featuredCommunities] = await Promise.all([
      eventsService.getTrendingEvents().catch(() => []),
      locationsService.getFeaturedLocations().catch(() => []),
      communitiesService.getFeaturedCommunities().catch(() => [])
    ]);
    
    return {
      events: trendingEvents || [],
      locations: featuredLocations || [],
      communities: featuredCommunities || []
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      events: [],
      locations: [],
      communities: []
    };
  }
}

export default async function Home() {
  const { events, locations, communities } = await getHomePageData();

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-emerald-500 sm:mb-4 sm:text-3xl md:text-4xl">
          NextRoots
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Discover events, explore locations, and connect with communities near you.
        </p>
        <HomeSearch />
      </div>

      {/* Featured Carousels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <FeaturedCarousel
          title="Featured Events"
          items={events.slice(0, 6).map(event => ({
            id: event.id,
            name: event.title || event.name,
            image_url: event.image_url || event.image || '/placeholder-event.svg',
            href: `/events/${event.id}`
          }))}
          autoplayDelay={4000}
        />
        
        <FeaturedCarousel
          title="Popular Locations"
          items={locations.slice(0, 6).map(location => ({
            id: location.id,
            name: location.name,
            image_url: location.image_url || location.image || '/placeholder-location.svg',
            href: `/locations/${location.id}`
          }))}
          autoplayDelay={6000}
        />
      </div>

      <ContentSection
        title="Trending Events"
        items={events.map(event => ({
          id: event.id,
          title: event.title || event.name,
          description: event.description,
          image: event.image_url || event.image || '/placeholder-event.svg'
        }))}
        viewAllHref="/events"
        getItemHref={(id) => `/events/${id}`}
      />

      <ContentSection
        title="Featured Locations"
        items={locations.map(location => ({
          id: location.id,
          title: location.name,
          description: location.description,
          image: location.image_url || location.image || '/placeholder-location.svg'
        }))}
        viewAllHref="/locations"
        getItemHref={(id) => `/locations/${id}`}
      />

      <ContentSection
        title="Featured Communities"
        items={communities.map(community => ({
          id: community.id,
          title: community.name,
          description: community.description,
          image: community.image_url || community.image || '/placeholder-community.svg'
        }))}
        viewAllHref="/communities"
        getItemHref={(id) => `/communities/${id}`}
      />
    </PageContainer>
  );
}
