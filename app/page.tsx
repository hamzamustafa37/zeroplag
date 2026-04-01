import { redirect } from "next/navigation";

// Root redirects to marketing home page
export default function RootPage() {
  redirect("/home");
}
