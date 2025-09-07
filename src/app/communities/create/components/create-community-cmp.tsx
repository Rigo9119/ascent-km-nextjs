'use client'

import CreateCommunityForm from "@/components/forms/create-community-form";
import { Tables } from "@/lib/types/supabase";

interface CreateCommunityCmpProps {
  user: {
    id: string;
  };
  profile: Tables<'profiles'>;
  communityTypes: Tables<'community_types'>[];
}

export function CreateCommunityCmp({ user }: CreateCommunityCmpProps) {

  return (
    <>
      <CreateCommunityForm userId={user.id} />
    </>
  );
}
