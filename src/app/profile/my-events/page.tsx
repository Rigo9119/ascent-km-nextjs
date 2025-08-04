import { createSupabaseClient } from "@/lib/supabase/server";
import { EventsService } from "@/services/events-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import MyEventsContent from "./components/MyEventsContent";

async function getUserEventsData(supabase: any, userId: string) {
  const eventsService = new EventsService(supabase);
  
  const userEvents = await eventsService.getUserEvents(userId);
  
  return {
    events: userEvents || []
  };
}

export default async function MyEventsPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  try {
    const { events } = await getUserEventsData(supabase, user.id);

    return (
      <PageContainer>
        <MyEventsContent 
          events={events}
          userId={user.id}
        />
      </PageContainer>
    );
  } catch (error) {
    return (
      <PageContainer>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Events</h1>
            <p className="text-gray-600 mb-4">There was an error loading your events.</p>
            <a 
              href="/profile" 
              className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              Back to Profile
            </a>
          </div>
        </div>
      </PageContainer>
    );
  }
}