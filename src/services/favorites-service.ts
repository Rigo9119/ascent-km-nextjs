import type { SupabaseClient } from '@supabase/supabase-js';

export class FavoritesService {
	constructor(private supabase: SupabaseClient) {}

	async getUserFavoriteEvents(userId: string) {
		try {
			const { data: favoriteEvents, error: sbError } = await this.supabase
				.rpc('get_user_favorite_events', { user_uuid: userId });

			if (sbError) throw new Error(`getUserFavoriteEvents error: ${sbError.message}`);
			return favoriteEvents;
		} catch (error) {
			throw new Error(`getUserFavoriteEvents-service-error: ${error}`);
		}
	}

	async getUserFavoriteCommunities(userId: string) {
		try {
			const { data: favoriteCommunities, error: sbError } = await this.supabase
				.rpc('get_user_favorite_communities', { user_uuid: userId });

			if (sbError) throw new Error(`getUserFavoriteCommunities error: ${sbError.message}`);
			return favoriteCommunities;
		} catch (error) {
			throw new Error(`getUserFavoriteCommunities-service-error: ${error}`);
		}
	}

	async getUserFavoriteLocations(userId: string) {
		try {
			const { data: favoriteLocations, error: sbError } = await this.supabase
				.rpc('get_user_favorite_locations', { user_uuid: userId });

			if (sbError) throw new Error(`getUserFavoriteLocations error: ${sbError.message}`);
			return favoriteLocations;
		} catch (error) {
			throw new Error(`getUserFavoriteLocations-service-error: ${error}`);
		}
	}

	async toggleFavoriteEvent(userId: string, eventId: string) {
		try {
			const { data: isNowFavorite, error: sbError } = await this.supabase
				.rpc('toggle_favorite_event', { 
					user_uuid: userId, 
					event_uuid: eventId 
				});

			if (sbError) throw new Error(`toggleFavoriteEvent error: ${sbError.message}`);
			return isNowFavorite;
		} catch (error) {
			throw new Error(`toggleFavoriteEvent-service-error: ${error}`);
		}
	}

	async toggleFavoriteCommunity(userId: string, communityId: string) {
		try {
			const { data: isNowFavorite, error: sbError } = await this.supabase
				.rpc('toggle_favorite_community', { 
					user_uuid: userId, 
					community_uuid: communityId 
				});

			if (sbError) throw new Error(`toggleFavoriteCommunity error: ${sbError.message}`);
			return isNowFavorite;
		} catch (error) {
			throw new Error(`toggleFavoriteCommunity-service-error: ${error}`);
		}
	}

	async toggleFavoriteLocation(userId: string, locationId: string) {
		try {
			const { data: isNowFavorite, error: sbError } = await this.supabase
				.rpc('toggle_favorite_location', { 
					user_uuid: userId, 
					location_uuid: locationId 
				});

			if (sbError) throw new Error(`toggleFavoriteLocation error: ${sbError.message}`);
			return isNowFavorite;
		} catch (error) {
			throw new Error(`toggleFavoriteLocation-service-error: ${error}`);
		}
	}
}