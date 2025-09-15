import { Community } from '@/types/community';
import type { SupabaseClient } from '@supabase/supabase-js';

export class CommunitiesService {
  constructor(private supabase: SupabaseClient) { }

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
      console.log(`getPublicCommunities-services-error: ${error}`)
      //throw new Error(`getPublicCommunities-services-error: ${error}`);
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
        .eq('admin_id', userId)
        .order('created_at', { ascending: false });

      if (sbError) throw new Error(`user communities error: ${sbError.message}`);

      return userCommunities;
    } catch (error) {
      throw new Error(`getUserCommunities-service-error: ${error}`);
    }
  }

  async getUserMemberships(userId: string) {

    const { data: memberships, error } = await this.supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (error) throw Error(`user memberships error: ${error.message}`);

    const result = {
      memberships,
      membershipsIds: memberships?.map(membership => membership.community_id) || []
    };

    return result;
  }

  async createCommunity(communityData: Community) {
    console.log('communityData', communityData)
    try {
      // Clean the data - convert empty strings to null for UUID fields
      const cleanedData = {
        ...communityData,
        community_type_id: communityData.community_type_id === '' ? null : communityData.community_type_id
      };

      const { data: community, error: sbError } = await this.supabase
        .from('communities')
        .insert(cleanedData)
        .select()
        .single();

      if (sbError) throw new Error(`community error: ${sbError.message}`);

      // Automatically add the creator as a member of the community
      if (community && communityData.admin_id) {
        console.log('Adding creator as member:', {
          community_id: community.id,
          user_id: communityData.admin_id,
          role: 'organizer'
        });

        const { data: memberData, error: memberError } = await this.supabase
          .from('community_members')
          .insert({
            community_id: community.id,
            user_id: communityData.admin_id,
            joined_at: new Date().toISOString(),
            role: 'admin'
          })
          .select();

        if (memberError) {
          console.error('Error adding creator as member:', memberError);
          // Don't throw here, community creation succeeded
        } else {
          console.log('Successfully added creator as member:', memberData);
        }
      } else {
        console.log('Skipping member addition:', {
          hasCommunity: !!community,
          hasAdminId: !!communityData.admin_id
        });
      }

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
      console.log(`getAllCommunityTypes-service-error: ${error}`)
      //throw new Error(`getAllCommunityTypes-service-error: ${error}`);
    }
  }

  async getCommunityMembers(communityId: string) {
    try {
      const { data: members, error: sbError } = await this.supabase
        .from('community_members')
        .select(`
					*
				`)
        .eq('community_id', communityId)
        .order('joined_at', { ascending: false });

      if (sbError) throw new Error(`getCommunityMembers error: ${sbError.message}`);
      return members;
    } catch (error) {
      throw new Error(`getCommunityMembers-service-error: ${error}`);
    }
  }

  async joinCommunity(communityId: string, userId: string) {
    try {
      // Add the user to community_members (trigger will update member_count automatically)
      const { data: membership, error: sbError } = await this.supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_id: userId,
          joined_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sbError) throw new Error(`joinCommunity error: ${sbError.message}`);

      return membership;
    } catch (error) {
      throw new Error(`joinCommunity-service-error: ${error}`);
    }
  }

  async leaveCommunity(communityId: string, userId: string) {
    try {
      // Remove the user from community_members (trigger will update member_count automatically)
      const { error: sbError } = await this.supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', userId);

      if (sbError) throw new Error(`leaveCommunity error: ${sbError.message}`);

      return { success: true };
    } catch (error) {
      throw new Error(`leaveCommunity-service-error: ${error}`);
    }
  }

  async checkUserMembership(communityId: string, userId: string) {
    try {
      const { data: membership, error: sbError } = await this.supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .single();

      if (sbError && sbError.code !== 'PGRST116') {
        throw new Error(`checkUserMembership error: ${sbError.message}`);
      }

      return !!membership;
    } catch (error) {
      throw new Error(`checkUserMembership-service-error: ${error}`);
    }
  }
}
