import { createSupabaseClient } from "@/lib/supabase/server";
import { FavoritesService } from "@/services/favorites-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import FavoritesContent from "./components/FavoritesContent";

async function getUserFavoritesData(supabase: any, userId: string) {
  const favoritesService = new FavoritesService(supabase);

  const [favoriteEvents, favoriteCommunities, favoriteLocations] = await Promise.all([
    favoritesService.getUserFavoriteEvents(userId),
    favoritesService.getUserFavoriteCommunities(userId),
    favoritesService.getUserFavoriteLocations(userId)
  ]);

  return {
    events: favoriteEvents || [],
    communities: favoriteCommunities || [],
    locations: favoriteLocations || []
  };
}

export default async function FavouritesPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const { events, communities, locations } = await getUserFavoritesData(supabase, user.id);

    return (
      <PageContainer>
        <FavoritesContent 
          events={events}
          communities={communities}
          locations={locations}
          userId={user.id}
        />
      </PageContainer>
    );
  } catch (error) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Favorites</h1>
            <p className="text-gray-600 mb-4">There was an error loading your favorite items.</p>
            <a 
              href="/profile" 
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }
}