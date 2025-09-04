'use client'

import { PageContainer } from "@/components/page-container";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateCommunityForm from "@/components/forms/create-community-form";

export default function CreateCommunityPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <CreateCommunityForm userId={user.id} />
    </PageContainer>
  );
}