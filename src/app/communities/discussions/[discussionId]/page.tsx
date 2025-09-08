import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSupabaseServerAction } from '@/lib/supabase/server';
import { DiscussionsService } from '@/services/discussions-service';
import { PageContainer } from '@/components/page-container';
import DiscussionDetail from './components/discussion-detail';

interface DiscussionPageProps {
  params: Promise<{
    discussionId: string;
  }>;
}

async function getDiscussionData(discussionId: string) {
  const supabase = await createSupabaseServerAction();
  const discussionsService = new DiscussionsService(supabase);

  try {
    const [discussion, comments] = await Promise.all([
      discussionsService.getDiscussionById(discussionId),
      discussionsService.getDiscussionComments(discussionId)
    ]);

    return { discussion, comments };
  } catch (error) {
    console.error('Error fetching discussion data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const { discussionId } = await params;
  const data = await getDiscussionData(discussionId);

  if (!data?.discussion) {
    return {
      title: 'Discussion Not Found',
    };
  }

  return {
    title: data.discussion.title,
    description: data.discussion.content?.slice(0, 160) || `Discussion in ${data.discussion.communities?.name}`,
  };
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { discussionId } = await params;
  const supabase = await createSupabaseServerAction();
  const { data: { user } } = await supabase.auth.getUser();

  const data = await getDiscussionData(discussionId);

  if (!data?.discussion) {
    notFound();
  }
  const { discussion, comments } = data;


  return (
    <PageContainer>
      <DiscussionDetail
        discussion={discussion}
        comments={comments}
        currentUser={user}
      />
    </PageContainer>
  );
}
