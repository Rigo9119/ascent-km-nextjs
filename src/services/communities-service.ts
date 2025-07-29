import type { SupabaseClient } from '@supabase/supabase-js';

export class CommunitiesService {
	constructor(private supabase: SupabaseClient) {}

	async getAllCommunities() {
		try {
			const { data: communities, error: sbError } = await this.supabase
				.from('communities')
				.select('*');

			if (sbError) throw new Error(`getAllCommunities error: ${sbError.message}`);
			return communities;
		} catch (error) {
			throw new Error(`getAllCommunities-services-error: ${error}`);
		}
	}

	async getFeaturedCommunities() {
		try {
			const { data: featuredCommunities, error: sbError } = await this.supabase
				.from('communities')
				.select('*')
				.eq('is_public', true)
				.eq('is_featured', true)
				.order('member_count', { ascending: false })
				.limit(4);

			if (sbError) throw new Error(`getFeaturedCommunities error: ${sbError.message}`);
			return featuredCommunities;
		} catch (error) {
			throw new Error(`getFeaturedCommunities-services-error: ${error}`);
		}
	}

	async getPublicCommunities() {
		try {
			const { data: communities, error: sbError } = await this.supabase
				.from('communities')
				.select('*')
				.eq('is_public', true)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`getPublicCommunities error: ${sbError.message}`);
			return communities;
		} catch (error) {
			throw new Error(`getPublicCommunities-services-error: ${error}`);
		}
	}

	async getPublicFeaturedCommunities() {
		try {
			const { data: communities, error: sbError } = await this.supabase
				.from('communities')
				.select('*')
				.eq('is_public', true)
				.eq('is_featured', true)
				.order('member_count', { ascending: false })
				.limit(6);

			if (sbError) throw new Error(`getPublicCommunities error: ${sbError.message}`);
			return communities;
		} catch (error) {
			throw new Error(`getPublicCommunities-services-error: ${error}`);
		}
	}

	async getCommunityById(communityId: string) {
		try {
			const { data: community, error: sbError } = await this.supabase
				.from('communities')
				.select('*')
				.eq('id', communityId)
				.single();

			if (sbError) throw new Error(`getCommunityById error: ${sbError.message}`);

			return community;
		} catch (error) {
			throw new Error(`getCommunityById-services-error: ${error}`);
		}
	}

	async getUserCommunities(userId: string) {
		try {
			const { data: userCommunities, error: sbError } = await this.supabase
				.from('communities')
				.select('*')
				.eq('organizer_id', userId)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`user communities error: ${sbError.message}`);

			return userCommunities;
		} catch (error) {
			throw new Error(`getUserCommunities-service-error: ${error}`);
		}
	}

	async createCommunity(communityData: unknown) {
		try {
			const { data: community, error: sbError } = await this.supabase
				.from('communities')
				.insert(communityData)
				.select()
				.single();

			if (sbError) throw new Error(`community error: ${sbError.message}`);

			return community;
		} catch (error) {
			throw new Error(`createCommunity-service-error: ${error}`);
		}
	}

	async deleteCommunity(communityId: string) {
		try {
			const { error: sbError } = await this.supabase
				.from('communities')
				.delete()
				.eq('id', communityId);

			if (sbError) throw new Error(`delete community error: ${sbError.message}`);

			return { success: true };
		} catch (error) {
			throw new Error(`deleteCommunity-service-error: ${error}`);
		}
	}

	async getAllCommunityTypes() {
		try {
			const { data: communityTypes, error: sbError } = await this.supabase
				.from('community_types')
				.select('*');
			if (sbError) throw new Error(`getAllCommunityTypes error: ${sbError.message}`);
			return communityTypes;
		} catch (error) {
			throw new Error(`getAllCommunityTypes-service-error: ${error}`);
		}
	}
}
