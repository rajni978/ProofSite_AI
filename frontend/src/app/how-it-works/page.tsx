import type { Metadata } from "next";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "How It Works | ProofSite AI",
  description: "See the planned ProofSite AI workflow from construction project setup through evidence-informed review.",
};

const workflow = [
  {
    number: "01",
    icon: "projects",
    title: "Create a construction project",
    description: "Set up a project workspace with its site details, dates, and the people responsible for delivery.",
    outcome: "A clear home for project context.",
  },
  {
    number: "02",
    icon: "workers",
    title: "Assign subcontractors and workers",
    description: "Organize the project team so the right crews and supervisors can be associated with the work.",
    outcome: "People and responsibilities in view.",
  },
  {
    number: "03",
    icon: "attendance",
    title: "Collect attendance and safety evidence",
    description: "The planned flow connects site attendance and safety review to the project and its assigned team.",
    outcome: "Field evidence tied to project context.",
  },
  {
    number: "04",
    icon: "reports",
    title: "Submit daily progress reports",
    description: "Capture reported work in a structured update that helps project teams understand progress and blockers.",
    outcome: "A more consistent daily picture.",
  },
  {
    number: "05",
    icon: "milestones",
    title: "Verify milestone completion",
    description: "Review reported milestone work and supporting context before recording a sign-off decision.",
    outcome: "A defined review point before approval.",
  },
  {
    number: "06",
    icon: "payments",
    title: "Review payment requests",
    description: "Give reviewers a proposed view of related project progress and evidence as they consider payment requests.",
    outcome: "Decisions with relevant context at hand.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <MarketingLayout>
      <main id="main-content" className="marketing-subpage">
        <section className="marketing-page-hero marketing-page-hero-compact">
          <div className="landing-container">
            <p className="landing-eyebrow">HOW IT WORKS</p>
            <h1>A clearer path from site activity to project decisions.</h1>
            <p>ProofSite AI is designed around a sequence of connected steps, so field updates and review decisions can share the same project context.</p>
            <div className="marketing-status-note" role="note">
              <DashboardIcon name="analytics" />
              Proposed workflow · The integrations described are not currently connected to live services.
            </div>
          </div>
        </section>

        <section className="marketing-workflow-section">
          <div className="landing-container">
            <SectionHeading
              eyebrow="A SIX-STEP PROJECT FLOW"
              title="Keep the sequence clear for every team."
              description="A conceptual workflow for main contractors, supervisors, and field teams."
            />
            <ol className="marketing-timeline">
              {workflow.map((step) => (
                <li className="marketing-timeline-step" key={step.number}>
                  <span className="marketing-timeline-marker" aria-hidden="true">{step.number}</span>
                  <article>
                    <span className="marketing-timeline-icon"><DashboardIcon name={step.icon} /></span>
                    <p className="marketing-feature-category">STEP {step.number}</p>
                    <h2>{step.title}</h2>
                    <p className="marketing-feature-description">{step.description}</p>
                    <p className="marketing-step-outcome"><span aria-hidden="true">→</span>{step.outcome}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="marketing-workflow-note">
          <div className="landing-container">
            <DashboardIcon name="verification" />
            <p><strong>People stay in control.</strong> Verification and payment decisions require authorized human review; the workflow is not an automated approval promise.</p>
          </div>
        </section>
        <section className="marketing-page-bridge">
          <div className="landing-container marketing-page-bridge-inner">
            <div>
              <p className="landing-eyebrow">BUILT FOR FIELD AND OFFICE TEAMS</p>
              <h2>Learn more about the problem we’re focused on.</h2>
              <p>ProofSite AI aims to make construction verification easier to understand across the project team.</p>
            </div>
            <Link className="landing-secondary-button" href="/about">About ProofSite AI</Link>
          </div>
        </section>
        <MarketingCTA
          title="Bring more context to the next project decision."
          description="Sign in to your ProofSite AI workspace to continue."
        />
      </main>
    </MarketingLayout>
  );
}
