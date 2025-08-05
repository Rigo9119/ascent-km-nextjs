import { createSupabaseClient } from "@/lib/supabase/server";
import { EventsService } from "@/services/events-service";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import MyEventsContent from "./components/my-events-page";
import { SupabaseClient } from "@supabase/supabase-js";

async function getUserEventsData(supabase: SupabaseClient, userId: string) {
  const eventsService = new EventsService(supabase);

  const userEvents = await eventsService.getUserEvents(userId);

  return {
    events: userEvents || []
  };
}

export default async function MyEventsPage() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { events } = await getUserEventsData(supabase, user?.id as unknown as string);

  if (!user) {
    redirect('/auth');
  }

  return (
    <PageContainer>
      <MyEventsContent
        events={events}
        userId={user.id}
      />
    </PageContainer>
  );
}
