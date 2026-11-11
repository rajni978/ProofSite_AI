import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/lib/auth-proxy";

export default async function DashboardPage() {
  const user = await getServerCurrentUser();
  if (!user) redirect("/login");

  if (user.role === "ADMIN" && user.onboardingStatus !== "COMPLETED") {
    redirect("/onboarding");
  }

  redirect(`/dashboard/${user.role.toLowerCase()}`);
}
