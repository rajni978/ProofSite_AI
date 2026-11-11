import type { Metadata } from "next";
import Link from "next/link";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { MarketingCTA } from "@/components/marketing/MarketingCTA";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SectionHeading } from "@/components/marketing/SectionHeading";

export const metadata: Metadata = {
  title: "About | ProofSite AI",
  description: "Learn about ProofSite AI's focus on clearer construction verification and project review workflows.",
};

const principles = [
  {
    icon: "projects",
    title: "Start with the project context",
    description: "Keep field activity, reported progress, and review connected to the project and the people responsible for it.",
  },
  {
    icon: "verification",
    title: "Make evidence part of review",
    description: "Give teams a workflow designed to make it easier to understand what is reported and what still needs attention.",
  },
  {
    icon: "workers",
    title: "Keep people in control",
    description: "Support human review and clear responsibility rather than implying that consequential site or payment decisions happen automatically.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingLayout>
      <main id="main-content" className="marketing-subpage">
        <section className="marketing-page-hero marketing-about-hero">
          <div className="landing-container">
            <p className="landing-eyebrow">ABOUT PROOFSITE AI</p>
            <h1>Construction work deserves clear, connected verification.</h1>
            <p>ProofSite AI is being shaped around a practical challenge: project teams need a clearer way to understand reported work before the decisions that follow.</p>
            <Link className="landing-button" href="/how-it-works">See the proposed workflow</Link>
          </div>
          <div className="marketing-about-aside">
            <span><DashboardIcon name="verification" /></span>
            <p>Verify the work<br />before approving<br />the payment.</p>
          </div>
        </section>

        <section className="marketing-about-section">
          <div className="landing-container marketing-about-grid">
            <div className="marketing-about-label">
              <p className="landing-eyebrow">THE PROBLEM</p>
              <h2>Project information can become fragmented.</h2>
            </div>
            <div className="marketing-about-copy">
              <p>Construction work happens across active sites, teams, and schedules. Updates, attendance, progress reports, and review conversations may be spread across different tools or channels.</p>
              <p>When project context is difficult to piece together, it takes extra coordination to understand what has been reported, what evidence is available, and what needs review before moving forward.</p>
            </div>
          </div>
        </section>

        <section className="marketing-principles-section">
          <div className="landing-container">
            <SectionHeading
              eyebrow="OUR APPROACH"
              title="A more understandable verification workflow."
              description="ProofSite AI is designed to bring project context, field updates, evidence, and human review closer together."
            />
            <div className="marketing-principles-grid">
              {principles.map((principle) => (
                <article className="marketing-principle-card" key={principle.title}>
                  <span><DashboardIcon name={principle.icon} /></span>
                  <h2>{principle.title}</h2>
                  <p>{principle.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="marketing-audience-section">
          <div className="landing-container marketing-audience-panel">
            <div>
              <p className="landing-eyebrow">WHO IT’S FOR</p>
              <h2>Designed for construction teams working across the site and the office.</h2>
              <p>The intended audience includes main contractors, supervisors, subcontractors, and workers who need shared visibility into project activity and review.</p>
            </div>
            <ul>
              <li><DashboardIcon name="projects" />Main contractors coordinating projects</li>
              <li><DashboardIcon name="overview" />Supervisors reviewing reported work</li>
              <li><DashboardIcon name="workers" />Subcontractors and workers contributing updates</li>
            </ul>
          </div>
        </section>

        <MarketingCTA
          eyebrow="PROOFSITE AI"
          title="Verify the work before approving the payment."
          description="Explore the planned workflow, or sign in to your ProofSite AI workspace."
        />
      </main>
    </MarketingLayout>
  );
}
