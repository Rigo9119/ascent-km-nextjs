import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FavoritesService } from "@/services/favorites-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import FavoritesContent from "./components/favourites-page";
import { SupabaseClient } from "@supabase/supabase-js";

async function getUserFavoritesData(supabase: SupabaseClient, userId: string) {
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
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { events, communities, locations } = await getUserFavoritesData(supabase, user?.id as unknown as string);

  if (!user) {
    redirect('/auth');
  }

  return (
    <PageContainer>
      <FavoritesContent
        events={events}
        communities={communities}
        locations={locations}
      />
    </PageContainer>
  );
}
