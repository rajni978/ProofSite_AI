import Link from "next/link";
import Image from "next/image";
import { dashboardPreviewData } from "@/data/dashboard-mock-data";
import { DashboardIcon } from "@/components/dashboard/DashboardIcon";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionHeading } from "./SectionHeading";

const features = [
  {
    icon: "attendance",
    title: "GPS attendance",
    description: "A site check-in workflow designed to connect attendance records with the right project and crew.",
  },
  {
    icon: "safety",
    title: "AI safety verification",
    description: "A concept for reviewing safety evidence and surfacing items that need a closer look.",
  },
  {
    icon: "reports",
    title: "Daily progress tracking",
    description: "Keep planned work, field updates, and project progress in one clear view.",
  },
  {
    icon: "milestones",
    title: "Milestone verification",
    description: "Create a review step between reported completion and the next project decision.",
  },
  {
    icon: "payments",
    title: "Payment approvals",
    description: "Connect verified progress with a more informed payment review process.",
  },
] as const;

const workflowSteps = [
  {
    number: "01",
    title: "Set up the project",
    description: "Bring the contractor, project, and site team into one shared workflow.",
    icon: "projects",
  },
  {
    number: "02",
    title: "Capture field progress",
    description: "Give crews a clear path for attendance, safety, and daily work updates.",
    icon: "attendance",
  },
  {
    number: "03",
    title: "Review the evidence",
    description: "Help supervisors and project teams see what needs attention before sign-off.",
    icon: "verification",
  },
  {
    number: "04",
    title: "Approve with context",
    description: "Keep milestone and payment decisions connected to project progress.",
    icon: "payments",
  },
] as const;

const benefits = [
  "See project activity without chasing updates across disconnected channels.",
  "Give field teams and office teams a shared view of the work.",
  "Make review steps visible before milestone or payment decisions.",
  "Build a clearer record of project progress as work moves forward.",
];

const faqs = [
  {
    question: "Is ProofSite AI connected to live construction projects?",
    answer: "Not yet. The landing-page dashboard is an illustrative preview using sample data. Project records, attendance, verification, and payment workflows are not connected to live services.",
  },
  {
    question: "Are GPS attendance and AI safety verification available today?",
    answer: "They are planned workflow capabilities, not active integrations. The current preview does not request location, analyze evidence, or submit records.",
  },
  {
    question: "Who can create a main contractor account?",
    answer: "Main contractor administrator accounts are provisioned through a restricted operator process. Public registration remains for worker accounts; use the login link if your administrator account has already been provisioned.",
  },
  {
    question: "Can I explore the dashboard?",
    answer: "The public page includes an illustrative dashboard preview. Authenticated workspaces require an existing account.",
  },
];

const previewStats = dashboardPreviewData.adminStats.slice(0, 3);
const previewProjects = dashboardPreviewData.projects.slice(0, 2);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ConstructionVisual() {
  return (
    <div className="hero-visual">
      <Image
        className="construction-photo"
        src="/images/construction-site.jpg"
        alt="Construction workers in protective equipment preparing materials at a site"
        fill
        priority
        sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1200px) 50vw, 600px"
      />
      <div className="hero-visual-grid" aria-hidden="true" />
      <div className="hero-visual-label">
        <span className="hero-visual-live-dot" />
        FIELD WORKFLOW PREVIEW
      </div>
      <div className="hero-float-card hero-float-check">
        <span><DashboardIcon name="safety" /></span>
        <div><strong>Safety evidence</strong><small>For supervisor review</small></div>
      </div>
      <div className="hero-float-card hero-float-project">
        <span><DashboardIcon name="attendance" /></span>
        <div><strong>Crew attendance</strong><small>Project-linked check-in concept</small></div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
      <main id="main-content">
        <section className="landing-hero">
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow"><span /> CONSTRUCTION WORKFLOW VISIBILITY</p>
              <h1>Verify the Work Before <span>Approving the Payment.</span></h1>
              <p className="landing-hero-description">
                Bring field updates, project progress, and review workflows into a clearer view—so your team can understand the work before the next approval.
              </p>
              <div className="landing-hero-actions">
                <Link className="landing-secondary-button" href="/features">Explore features <ArrowIcon /></Link>
              </div>
              <p className="landing-hero-note">
                <DashboardIcon name="verification" />
                A workflow preview for construction teams. Live project integrations are not connected yet.
              </p>
            </div>
            <ConstructionVisual />
          </div>
          <div className="landing-hero-bottom" aria-hidden="true">
            <span>BUILT FOR FIELD AND OFFICE TEAMS</span>
            <span />
            <span>PROJECT PROGRESS · EVIDENCE · REVIEW</span>
          </div>
        </section>

        <section className="landing-problem landing-section" id="about">
          <div className="landing-container landing-problem-grid">
            <div className="landing-problem-intro">
              <p className="landing-eyebrow">THE CHALLENGE</p>
              <h2>Work happens on site. Decisions happen everywhere.</h2>
              <p>When updates are scattered, teams spend time finding context instead of moving the project forward.</p>
            </div>
            <div className="landing-problem-cards">
              <article>
                <span className="problem-icon"><DashboardIcon name="reports" /></span>
                <div><h3>Progress is hard to piece together</h3><p>Daily updates can live across messages, spreadsheets, and conversations.</p></div>
              </article>
              <article>
                <span className="problem-icon"><DashboardIcon name="verification" /></span>
                <div><h3>Review lacks a shared trail</h3><p>Without clear context, confirming completed work can take extra coordination.</p></div>
              </article>
              <article>
                <span className="problem-icon"><DashboardIcon name="payments" /></span>
                <div><h3>Approvals need confidence</h3><p>Teams need a clearer connection between reported progress and the decisions that follow.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="landing-features landing-section" id="features">
          <div className="landing-container">
            <SectionHeading
              eyebrow="ONE CLEARER WORKFLOW"
              title="Designed to connect the work to the decision."
              description="Explore the capabilities ProofSite AI is being built around. The integrations below are concepts and are not currently connected to live services."
            />
            <div className="landing-capability-note">
              <span><DashboardIcon name="analytics" /></span>
              Product direction · Not connected integrations
            </div>
            <div className="landing-feature-grid">
              {features.map((feature, index) => (
                <article className={`landing-feature-card landing-feature-${index + 1}`} key={feature.title}>
                  <span className="landing-feature-icon"><DashboardIcon name={feature.icon} /></span>
                  <span className="landing-feature-tag">PLANNED WORKFLOW</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <Link className="landing-feature-link" href="/features">Explore workflow <ArrowIcon /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-workflow landing-section" id="how-it-works">
          <div className="landing-container">
            <SectionHeading
              eyebrow="HOW IT WORKS"
              title="A practical path from field update to approval."
              description="A proposed end-to-end workflow that keeps each team oriented around the same project context."
            />
            <div className="landing-workflow-grid">
              {workflowSteps.map((step) => (
                <article className="landing-workflow-step" key={step.number}>
                  <div className="workflow-step-top"><span>{step.number}</span><DashboardIcon name={step.icon} /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
            <p className="landing-workflow-disclaimer">Workflow illustration only. Live attendance, AI verification, payment, and project services are not connected.</p>
          </div>
        </section>

        <section className="landing-preview landing-section" aria-labelledby="landing-preview-title">
          <div className="landing-container landing-preview-grid">
            <div className="landing-preview-copy">
              <p className="landing-eyebrow">PRODUCT PREVIEW</p>
              <h2 id="landing-preview-title">A clearer view of your project portfolio.</h2>
              <p>See how project progress, team activity, and review context can come together in one workspace.</p>
              <ul>
                <li><DashboardIcon name="projects" /> Portfolio-level project snapshots</li>
                <li><DashboardIcon name="verification" /> Review status at a glance</li>
                <li><DashboardIcon name="analytics" /> Activity and progress in context</li>
              </ul>
              <span className="landing-sample-disclaimer">Illustrative interface · Uses sample data · Not connected to live projects</span>
            </div>
            <div className="landing-dashboard-preview">
              <div className="preview-window-bar">
                <div className="preview-window-brand"><span className="preview-window-mark"><DashboardIcon name="projects" /></span><strong>ProofSite <em>AI</em></strong></div>
                <span className="preview-window-label">SAMPLE WORKSPACE</span>
              </div>
              <div className="preview-window-content">
                <div className="preview-heading">
                  <div><span>MAIN CONTRACTOR · PREVIEW</span><h3>Project overview</h3></div>
                  <span className="preview-date">Sample data</span>
                </div>
                <div className="preview-stat-grid">
                  {previewStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
                </div>
                <div className="preview-project-heading"><h4>Projects</h4><span>Illustrative preview</span></div>
                <div className="preview-project-grid">
                  {previewProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
                </div>
                <div className="preview-bottom-note"><span /> No live site activity or project records shown</div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-benefits landing-section">
          <div className="landing-container landing-benefits-grid">
            <div>
              <p className="landing-eyebrow">FOR MAIN CONTRACTORS</p>
              <h2>Spend less time chasing context. Keep the work moving.</h2>
              <p className="landing-benefits-copy">ProofSite AI is being designed to give project leaders a shared operational picture—from field activity through review.</p>
              <Link className="landing-button" href="/login">Get started <ArrowIcon /></Link>
            </div>
            <ul className="landing-benefit-list">
              {benefits.map((benefit) => (
                <li key={benefit}><span><svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>{benefit}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="landing-faq landing-section" aria-labelledby="landing-faq-title">
          <div className="landing-container landing-faq-grid">
            <div>
              <p className="landing-eyebrow">FAQ</p>
              <h2 id="landing-faq-title">Good questions, clear answers.</h2>
              <p>Here’s what to know about the current product preview.</p>
            </div>
            <div className="landing-faq-list">
              {faqs.map((faq, index) => (
                <details className="landing-faq-item" key={faq.question} open={index === 0}>
                  <summary>{faq.question}<span aria-hidden="true" /></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-final-cta">
          <div className="landing-container landing-final-cta-inner">
            <span className="landing-cta-mark"><DashboardIcon name="verification" /></span>
            <p className="landing-eyebrow">BUILD WITH MORE CLARITY</p>
            <h2>Verify the work before approving the payment.</h2>
            <p>Sign in to your ProofSite AI workspace to continue.</p>
            <Link className="landing-button landing-button-light" href="/login">Get started <ArrowIcon /></Link>
            <span className="landing-cta-footnote">Main contractor accounts are provisioned by an administrator. Public registration remains worker-only.</span>
          </div>
        </section>
      </main>
  );
}
