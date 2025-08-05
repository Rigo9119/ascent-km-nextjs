import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';
import { DiscussionsService } from '@/services/discussions-service';
import CommunityHeader from '@/components/communities/community-header';
import CommunityTabs from '@/components/communities/community-tabs';

interface CommunityPageProps {
  params: {
    communityId: string;
  };
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const communitiesService = new CommunitiesService(supabase);

  try {
    const community = await communitiesService.getCommunityById(params.communityId);

    return {
      title: community.name,
      description: community.description || `Join the ${community.name} community`,
    };
  } catch (error) {
    console.log(error)
    return {
      title: 'Community Not Found',
    };
  }
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const supabase = await createSupabaseServerClient();
  const communitiesService = new CommunitiesService(supabase);
  const discussionsService = new DiscussionsService(supabase);

  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch community data
    const [community, members, discussions] = await Promise.all([
      communitiesService.getCommunityById(params.communityId),
      communitiesService.getCommunityMembers(params.communityId),
      discussionsService.getDiscussionsByCommunity(params.communityId)
    ]);

    // Check if user is a member (if logged in)
    let isMember = false;
    if (user) {
      isMember = await communitiesService.checkUserMembership(params.communityId, user.id);
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CommunityHeader
            community={community}
            members={members}
            isMember={isMember}
            currentUser={user}
          />

          <div className="mt-8">
            <CommunityTabs
              community={community}
              discussions={discussions}
              members={members}
              isMember={isMember}
              currentUser={user}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading community:', error);
    notFound();
  }
}
