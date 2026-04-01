import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Document",
};

// Defer to client component for editor interactivity
export { default } from "@/components/editor/new-document-page";
