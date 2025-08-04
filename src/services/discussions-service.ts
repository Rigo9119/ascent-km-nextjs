import type { SupabaseClient } from '@supabase/supabase-js';

export class DiscussionsService {
	constructor(private supabase: SupabaseClient) {}

	async getAllDiscussions() {
		try {
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`getAllDiscussions error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getAllDiscussions-service-error: ${error}`);
		}
	}

	async getDiscussionsByCommunity(communityId: string) {
		try {
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.eq('community_id', communityId)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`getDiscussionsByCommunit error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getDiscussionsByCommunit-service-error: ${error}`);
		}
	}

	async getDiscussionById(discussionId: string) {
		try {
			const { data: discussion, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.eq('id', discussionId)
				.single();

			if (sbError) throw new Error(`getDiscussionById error: ${sbError.message}`);
			return discussion;
		} catch (error) {
			throw new Error(`getDiscussionById-service-error: ${error}`);
		}
	}

	async getDiscussionComments(discussionId: string) {
		try {
			const { data: comments, error: sbError } = await this.supabase
				.from('comments')
				.select(`
					*,
					profiles(id, full_name, username, avatar_url)
				`)
				.eq('discussion_id', discussionId)
				.order('created_at', { ascending: true });

			if (sbError) throw new Error(`getDiscussionComments error: ${sbError.message}`);
			return comments;
		} catch (error) {
			throw new Error(`getDiscussionComments-service-error: ${error}`);
		}
	}

	async createDiscussion(discussionData: {
		title: string;
		content: string;
		community_id: string;
		user_id: string;
	}) {
		try {
			const { data: discussion, error: sbError } = await this.supabase
				.from('discussions')
				.insert(discussionData)
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.single();

			if (sbError) throw new Error(`createDiscussion error: ${sbError.message}`);
			return discussion;
		} catch (error) {
			throw new Error(`createDiscussion-service-error: ${error}`);
		}
	}

	async updateDiscussion(discussionId: string, updates: {
		title?: string;
		content?: string;
	}) {
		try {
			const { data: discussion, error: sbError } = await this.supabase
				.from('discussions')
				.update(updates)
				.eq('id', discussionId)
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.single();

			if (sbError) throw new Error(`updateDiscussion error: ${sbError.message}`);
			return discussion;
		} catch (error) {
			throw new Error(`updateDiscussion-service-error: ${error}`);
		}
	}

	async deleteDiscussion(discussionId: string) {
		try {
			const { error: sbError } = await this.supabase
				.from('discussions')
				.delete()
				.eq('id', discussionId);

			if (sbError) throw new Error(`deleteDiscussion error: ${sbError.message}`);
			return { success: true };
		} catch (error) {
			throw new Error(`deleteDiscussion-service-error: ${error}`);
		}
	}

	async getRecentDiscussions(limit: number = 10) {
		try {
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.order('created_at', { ascending: false })
				.limit(limit);

			if (sbError) throw new Error(`getRecentDiscussions error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getRecentDiscussions-service-error: ${error}`);
		}
	}

	async searchDiscussions(query: string) {
		try {
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.or(`title.ilike.%${query}%,content.ilike.%${query}%`)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`searchDiscussions error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`searchDiscussions-service-error: ${error}`);
		}
	}

	async getUserDiscussions(userId: string) {
		try {
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.eq('user_id', userId)
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`getUserDiscussions error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getUserDiscussions-service-error: ${error}`);
		}
	}

	async getUserParticipatedDiscussions(userId: string) {
		try {
			// Get discussions where user has commented
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url),
					comments!inner(user_id)
				`)
				.eq('comments.user_id', userId)
				.neq('user_id', userId) // Exclude discussions created by the user
				.order('created_at', { ascending: false });

			if (sbError) throw new Error(`getUserParticipatedDiscussions error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getUserParticipatedDiscussions-service-error: ${error}`);
		}
	}
}