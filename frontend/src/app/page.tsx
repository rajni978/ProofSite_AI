import type { Metadata } from "next";
import { LandingPage } from "@/components/marketing/LandingPage";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";

export const metadata: Metadata = {
  title: "Verify the Work Before Approving the Payment | ProofSite AI",
  description: "A clearer construction workflow concept for project progress, site evidence, review, and payment decisions.",
};

export default function HomePage() {
  return (
    <MarketingLayout>
      <LandingPage />
    </MarketingLayout>
  );
}
