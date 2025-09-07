import { Metadata } from 'next';
import { createSupabaseServerAction } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';
import { PageContainer } from '@/components/page-container';
import { redirect } from 'next/navigation';
import CommunityManagement from '@/components/communities/community-management';

interface CommunityManagePageProps {
  params: Promise<{
    communityId: string;
  }>;
}

export async function generateMetadata({ params }: CommunityManagePageProps): Promise<Metadata> {
  const { communityId } = await params;
  
  return {
    title: `Manage Community`,
    description: 'Manage your community settings and members',
  };
}

export default async function CommunityManagePage({ params }: CommunityManagePageProps) {
  const { communityId } = await params;
  const supabase = await createSupabaseServerAction();
  const communitiesService = new CommunitiesService(supabase);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const community = await communitiesService.getCommunityById(communityId);
    
    // Check if user is the organizer/creator
    if (community.organizer_id !== user.id) {
      redirect(`/communities/${communityId}`);
    }

    const members = await communitiesService.getCommunityMembers(communityId);
    
    return (
      <PageContainer>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Community</h1>
            <p className="text-gray-600 mt-2">Manage settings and members for {community.name}</p>
          </div>
          
          <CommunityManagement
            community={community}
            members={members}
            currentUser={user}
          />
        </div>
      </PageContainer>
    );
  } catch (error) {
    console.error('Error loading community:', error);
    redirect('/communities');
  }
}