import { NextResponse } from "next/server";
import { createSupabaseServerAction } from "@/lib/supabase/server";
import { CommunitiesService } from "@/services/communities-service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerAction();
    const communitiesService = new CommunitiesService(supabase);

    const community = await communitiesService.getCommunityById(id);

    return NextResponse.json(community);
  } catch (error) {
    console.error("Community by ID API error:", error);
    return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 });
  }
}
