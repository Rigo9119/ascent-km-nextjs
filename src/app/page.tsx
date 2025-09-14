import { PageContainer } from "@/components/page-container";
import RecentDiscussions from "@/components/home/recent-discussions";
import { getHomePageData } from "@/data/home";
import { User } from "@supabase/supabase-js";

export default async function Home() {
  const {
    recentDiscussions,
    userRecentDiscussions,
    currentUser
  } = await getHomePageData();

  return (
    <PageContainer>
      {currentUser ? (
        <div className="space-y-8">
          {userRecentDiscussions && userRecentDiscussions.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Discusiones Recientes de tus Comunidades
              </h2>
              <RecentDiscussions
                discussions={userRecentDiscussions}
                currentUser={currentUser}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Discusiones Recientes de tus Comunidades
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                No hay discusiones recientes en tus comunidades. Únete a una comunidad
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <RecentDiscussions
            discussions={recentDiscussions || []}
            currentUser={currentUser as unknown as User}
          />
        </div>
      )}

    </PageContainer>
  );
}
