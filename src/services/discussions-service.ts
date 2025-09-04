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

			if (sbError) {
				// If the error is "not found", return null instead of throwing
				if (sbError.code === 'PGRST116') {
					return null;
				}
				throw new Error(`getDiscussionById error: ${sbError.message}`);
			}
			return discussion;
		} catch (error) {
			// Re-throw if it's already a known error, otherwise wrap it
			if (error instanceof Error && error.message.includes('getDiscussionById error:')) {
				throw error;
			}
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

	async getMostRecentDiscussionPerCommunity() {
		try {
			// Get the most recent discussion for each community
			const { data: discussions, error: sbError } = await this.supabase
				.rpc('get_latest_discussion_per_community');

			if (sbError) {
				// Fallback to manual query if RPC doesn't exist
				const { data: fallbackDiscussions, error: fallbackError } = await this.supabase
					.from('discussions')
					.select(`
						*,
						communities(id, name, image_url),
						profiles(id, full_name, username, avatar_url)
					`)
					.order('created_at', { ascending: false });

				if (fallbackError) throw new Error(`getMostRecentDiscussionPerCommunity error: ${fallbackError.message}`);
				
				// Group by community and take the first (most recent) for each
				const groupedByCommunity = new Map();
				fallbackDiscussions?.forEach(discussion => {
					if (!groupedByCommunity.has(discussion.community_id)) {
						groupedByCommunity.set(discussion.community_id, discussion);
					}
				});
				
				return Array.from(groupedByCommunity.values());
			}

			return discussions;
		} catch (error) {
			throw new Error(`getMostRecentDiscussionPerCommunity-service-error: ${error}`);
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

	async getRecentDiscussionsFromUserCommunities(userId: string, limit: number = 10) {
		try {
			// First get the community IDs the user is a member of
			const { data: memberships, error: membershipError } = await this.supabase
				.from('community_members')
				.select('community_id')
				.eq('user_id', userId);

			if (membershipError) throw new Error(`getRecentDiscussionsFromUserCommunities memberships error: ${membershipError.message}`);

			if (!memberships || memberships.length === 0) {
				return [];
			}

			const communityIds = memberships.map(m => m.community_id);

			// Get recent discussions from those communities
			const { data: discussions, error: sbError } = await this.supabase
				.from('discussions')
				.select(`
					*,
					communities(id, name, image_url),
					profiles(id, full_name, username, avatar_url)
				`)
				.in('community_id', communityIds)
				.order('created_at', { ascending: false })
				.limit(limit);

			if (sbError) throw new Error(`getRecentDiscussionsFromUserCommunities error: ${sbError.message}`);
			return discussions;
		} catch (error) {
			throw new Error(`getRecentDiscussionsFromUserCommunities-service-error: ${error}`);
		}
	}
}