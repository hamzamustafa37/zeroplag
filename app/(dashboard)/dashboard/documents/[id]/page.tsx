import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Document ${id}` };
}

// Defer to client component for editor interactivity
export { default } from "@/components/editor/document-page";
