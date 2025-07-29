import { PageContainer } from "@/components/page-container";

export default function Home() {
  return (
    <PageContainer>
      <h1 className="mb-2 text-2xl font-bold text-emerald-500 sm:mb-4 sm:text-3xl md:text-4xl">
        NextRoots
      </h1>
      <section>search bar</section>
      <section>Carrusels</section>
      <section>locations</section>
      <section>events</section>
      <section>communities</section>
    </PageContainer>
  );
}
