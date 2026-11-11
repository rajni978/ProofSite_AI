import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { getServerCurrentUser } from "@/lib/auth-proxy";

export const metadata: Metadata = {
  title: "Company onboarding",
  description: "Set up your ProofSite AI company workspace and first project.",
};

export default async function OnboardingPage() {
  const user = await getServerCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect(`/dashboard/${user.role.toLowerCase()}`);
  if (user.onboardingStatus === "COMPLETED") redirect("/dashboard/admin");

  return <OnboardingFlow fullName={user.fullName} email={user.email} />;
}
