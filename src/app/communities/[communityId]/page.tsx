import { Metadata } from 'next';
import { createSupabaseServerAction, createSupabaseServerClient } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';
import { DiscussionsService } from '@/services/discussions-service';
import CommunityHeader from '@/components/communities/community-header';
import CommunityTabs from '@/components/communities/community-tabs';
import { SupabaseClient } from '@supabase/supabase-js';
import { PageContainer } from '@/components/page-container';

interface CommunityPageProps {
  params: Promise<{
    communityId: string;
  }>;
}

export async function generateMetadata({ params }: CommunityPageProps): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const communitiesService = new CommunitiesService(supabase);
  const { communityId } = await params;

  try {
    const community = await communitiesService.getCommunityById(communityId);

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

async function getCommunityPageData(supabase: SupabaseClient, communityId: string) {
  const communitiesService = new CommunitiesService(supabase);
  const discussionsService = new DiscussionsService(supabase);

  const [community, members, discussions] = await Promise.all([
    communitiesService.getCommunityById(communityId),
    communitiesService.getCommunityMembers(communityId),
    discussionsService.getDiscussionsByCommunity(communityId)
  ]);

  return { community, members, discussions }
}
export default async function CommunityPage({ params }: CommunityPageProps) {
  const { communityId } = await params
  const supabase = await createSupabaseServerAction()
  const communityService = new CommunitiesService(supabase);
  const { data: { user } } = await supabase.auth.getUser();
  const { community, members, discussions } = await getCommunityPageData(supabase, communityId);
  const isMember = user?.id ? await communityService.checkUserMembership(communityId, user.id) : false;

  return (
    <PageContainer>
      <div className="min-h-screen">
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
    </PageContainer>
  );
}
