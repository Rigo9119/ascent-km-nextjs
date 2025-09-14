import { Metadata } from 'next';
import { createSbServerClient } from '@/lib/supabase/server';
import { CommunitiesService } from '@/services/communities-service';
import { PageContainer } from '@/components/page-container';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import CommunityManagement from '@/components/communities/community-management';

interface CommunityManagePageProps {
  params: Promise<{
    communityId: string;
  }>;
}

export async function generateMetadata({ params }: CommunityManagePageProps): Promise<Metadata> {
  const { communityId } = await params;
  
  return {
    title: `Gestionar Comunidad`,
    description: 'Gestiona la configuración y miembros de tu comunidad',
  };
}

export default async function CommunityManagePage({ params }: CommunityManagePageProps) {
  const { communityId } = await params;
  const supabase = await createSbServerClient();
  const communitiesService = new CommunitiesService(supabase);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  try {
    const community = await communitiesService.getCommunityById(communityId);
    
    // Check if user is the admin/creator
    if (community.admin_id !== user.id) {
      redirect(`/communities/${communityId}`);
    }

    const members = await communitiesService.getCommunityMembers(communityId);
    
    return (
      <PageContainer>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href={`/communities/${communityId}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver a la Comunidad
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionar Comunidad</h1>
            <p className="text-gray-600 mt-2">Gestiona la configuración y miembros de {community.name}</p>
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