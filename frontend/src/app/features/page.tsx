import type { Metadata } from "next";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "Features | ProofSite AI",
  description: "Explore ProofSite AI's planned construction attendance, safety, progress, milestone, and payment review workflows.",
};

const features = [
  {
    icon: "attendance",
    category: "FIELD ATTENDANCE",
    title: "GPS-based worker attendance",
    description: "A proposed site check-in workflow that can associate attendance records with the correct project and crew.",
    detail: "Attendance capture is not connected to a live location service. No location is requested or recorded in this preview.",
  },
  {
    icon: "checkin",
    category: "SITE VALIDATION",
    title: "Geofence validation",
    description: "A planned geofence check can help confirm that a check-in is associated with a defined project site.",
    detail: "Geofence boundaries and location validation are planned capabilities, not currently active.",
  },
  {
    icon: "safety",
    category: "SAFETY REVIEW",
    title: "AI-assisted PPE and safety verification",
    description: "An envisioned review aid for surfacing safety evidence that may need a human supervisor's attention.",
    detail: "There is no active AI evidence analysis. Safety decisions remain with qualified people on site.",
  },
  {
    icon: "reports",
    category: "DAILY REPORTING",
    title: "Construction progress reports",
    description: "A structured way to bring daily work updates into the context of a project, its schedule, and its team.",
    detail: "Live daily reporting and project integrations are not connected in this release.",
  },
  {
    icon: "milestones",
    category: "MILESTONE REVIEW",
    title: "Milestone verification",
    description: "A review step designed to connect a reported milestone with evidence and project context before sign-off.",
    detail: "Milestone submission and approval workflows are planned and not operational yet.",
  },
  {
    icon: "payments",
    category: "PAYMENT CONTEXT",
    title: "Evidence-based payment approval",
    description: "A proposed workflow that gives reviewers a clearer view of reported work before payment decisions.",
    detail: "ProofSite AI does not initiate, process, or approve payments. This capability is not connected to payment systems.",
  },
] as const;

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <main id="main-content" className="marketing-subpage">
        <section className="marketing-page-hero">
          <div className="landing-container">
            <p className="landing-eyebrow">THE PROOFSITE AI WORKFLOW</p>
            <h1>Make the work easier to see, review, and trust.</h1>
            <p>Explore the construction workflows ProofSite AI is being designed to support—from site activity through project and payment review.</p>
            <div className="marketing-status-note" role="note">
              <DashboardIcon name="analytics" />
              Product direction · These capabilities are planned and are not connected to live site services.
            </div>
          </div>
        </section>

        <section className="marketing-feature-section" aria-label="Planned product capabilities">
          <div className="landing-container">
            <SectionHeading
              eyebrow="PLANNED CAPABILITIES"
              title="One connected view of the project workflow."
              description="Each capability is a proposed part of a clearer evidence and review process. Availability depends on future integrations."
            />
            <div className="marketing-feature-grid">
              {features.map((feature, index) => (
                <article className={`marketing-feature-card marketing-feature-tone-${index % 3}`} key={feature.title}>
                  <span className="marketing-feature-icon"><DashboardIcon name={feature.icon} /></span>
                  <p className="marketing-feature-category">{feature.category}</p>
                  <h2>{feature.title}</h2>
                  <p className="marketing-feature-description">{feature.description}</p>
                  <p className="marketing-feature-detail">{feature.detail}</p>
                  <span className="marketing-planned-label">PLANNED · NOT CONNECTED</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-page-bridge">
          <div className="landing-container marketing-page-bridge-inner">
            <div>
              <p className="landing-eyebrow">FROM FIELD ACTIVITY TO REVIEW</p>
              <h2>Capabilities make more sense as one shared process.</h2>
              <p>See how project setup, field updates, evidence, and review fit together in the proposed workflow.</p>
            </div>
            <Link className="landing-button" href="/how-it-works">Explore how it works</Link>
          </div>
        </section>
        <MarketingCTA
          title="Start with a clearer view of your projects."
          description="Sign in to your ProofSite AI workspace to continue."
        />
      </main>
    </MarketingLayout>
  );
}
