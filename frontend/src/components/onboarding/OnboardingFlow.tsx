"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth/AuthButton";
import { FormError } from "@/components/auth/FormError";
import { FormInput } from "@/components/auth/FormInput";
import { ApiRequestError } from "@/services/api";
import { completeOnboarding, getOnboarding, saveOnboardingDraft } from "@/services/onboarding.service";
import type {
  OnboardingAddress,
  OnboardingCompany,
  OnboardingContact,
  OnboardingDraft,
  OnboardingDraftRequest,
  OnboardingProject,
  OnboardingStep,
} from "@/types/onboarding";

const steps: { id: OnboardingStep; label: string }[] = [
  { id: "company", label: "Company" },
  { id: "contact", label: "Contact" },
  { id: "firstProject", label: "First project" },
  { id: "review", label: "Review" },
];

const emptyAddress: OnboardingAddress = {
  street: "",
  city: "",
  region: "",
  postalCode: "",
  country: "",
};

const emptyCompany: OnboardingCompany = {
  companyName: "",
  businessEmail: "",
  phone: "",
  address: emptyAddress,
};

const emptyContact: OnboardingContact = { name: "", designation: "" };
const emptyProject: OnboardingProject = {
  name: "",
  siteAddress: "",
  location: "",
  startDate: "",
  endDate: "",
};

function stepIndex(step: OnboardingStep): number {
  return steps.findIndex((item) => item.id === step);
}

function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return <FormInput label={label} {...props} />;
}

function BrandMark() {
  return (
    <span className="onboarding-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <path d="M4.5 18.5V9.2L12 5l7.5 4.2v9.3H4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 18.5v-5h6v5m.7-11.4 1.4 1.4 2.6-2.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function OnboardingFlow({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("company");
  const [company, setCompany] = useState<OnboardingCompany>(emptyCompany);
  const [contact, setContact] = useState<OnboardingContact>(emptyContact);
  const [project, setProject] = useState<OnboardingProject>(emptyProject);
  const [draft, setDraft] = useState<OnboardingDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    let active = true;
    getOnboarding()
      .then(({ onboarding }) => {
        if (!active || !onboarding) return;
        setDraft(onboarding);
        if (onboarding.company) setCompany(onboarding.company);
        if (onboarding.contact) setContact(onboarding.contact);
        if (onboarding.firstProject) setProject(onboarding.firstProject);
        setStep(onboarding.currentStep);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setLoadingError(
          requestError instanceof ApiRequestError
            ? requestError.message
            : "Your onboarding information could not be loaded. Please try again.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reload]);

  function updateAddress(field: keyof OnboardingAddress, value: string) {
    setCompany((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  }

  async function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    let input: OnboardingDraftRequest;
    if (step === "company") {
      input = { step: "company", data: company };
    } else if (step === "contact") {
      input = { step: "contact", data: contact };
    } else if (step === "firstProject") {
      input = { step: "firstProject", data: project };
    } else {
      return;
    }

    setSaving(true);
    try {
      const response = await saveOnboardingDraft(input);
      setDraft(response.onboarding);
      setStep(response.onboarding.currentStep);
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "This step could not be saved. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleComplete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await completeOnboarding();
      router.replace("/dashboard/admin");
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Onboarding could not be completed. Your saved information is still available.",
      );
    } finally {
      setSaving(false);
    }
  }

  function goBack() {
    const index = stepIndex(step);
    if (index > 0) setStep(steps[index - 1].id);
    setError("");
  }

  function retryLoading() {
    setError("");
    setLoadingError("");
    setLoading(true);
    setReload((count) => count + 1);
  }

  const stepHeading: Record<OnboardingStep, { title: string; description: string }> = {
    company: {
      title: "Tell us about your company",
      description: "Add the main contractor details for your ProofSite AI workspace.",
    },
    contact: {
      title: "Who should we contact?",
      description: "Add the primary person responsible for this workspace.",
    },
    firstProject: {
      title: "Set up your first project",
      description: "Add the site details your team will use to get started.",
    },
    review: {
      title: "Review your information",
      description: "Check the company, contact, and project details before finishing setup.",
    },
  };

  const currentStepIndex = stepIndex(step);

  return (
    <main className="onboarding-shell">
      <header className="onboarding-header">
        <Link className="onboarding-brand" href="/" aria-label="ProofSite AI home">
          <BrandMark />
          <span>ProofSite <strong>AI</strong></span>
        </Link>
        <div className="onboarding-user">
          <span><strong>{fullName}</strong><small>{email}</small></span>
          <AuthButton variant="quiet" logoutAction>Sign out</AuthButton>
        </div>
      </header>

      <section className="onboarding-main" aria-labelledby="onboarding-title">
        <div className="onboarding-welcome">
          <p className="onboarding-eyebrow">CUSTOMER ONBOARDING</p>
          <h1 id="onboarding-title">Welcome to ProofSite AI</h1>
          <p>Let&apos;s set up your company workspace and first project. Your progress is saved as you continue.</p>
        </div>

        <ol className="onboarding-stepper" aria-label="Onboarding progress">
          {steps.map((item, index) => (
            <li
              key={item.id}
              className={index === currentStepIndex ? "is-current" : index < currentStepIndex ? "is-complete" : ""}
              aria-current={index === currentStepIndex ? "step" : undefined}
            >
              <span>{index < currentStepIndex ? "✓" : `0${index + 1}`}</span>
              <strong>{item.label}</strong>
            </li>
          ))}
        </ol>

        <section className="onboarding-card">
          {loading ? (
            <div className="onboarding-loading" role="status" aria-live="polite">
              <span className="dashboard-loading-spinner" aria-hidden="true" />
              Loading your saved onboarding details…
            </div>
          ) : loadingError ? (
            <div className="onboarding-load-error" role="alert">
              <h2>We couldn&apos;t load your setup</h2>
              <p>{loadingError}</p>
              <button type="button" className="onboarding-primary-button" onClick={retryLoading}>
                Try again
              </button>
            </div>
          ) : (
            <>
              <div className="onboarding-card-heading">
                <span>STEP {String(currentStepIndex + 1).padStart(2, "0")} OF 04</span>
                <h2>{stepHeading[step].title}</h2>
                <p>{stepHeading[step].description}</p>
              </div>

              {error && <FormError message={error} />}

              {step !== "review" ? (
                <form className="onboarding-form" onSubmit={handleContinue}>
                  {step === "company" && (
                    <>
                      <Field
                        id="onboarding-company-name"
                        name="companyName"
                        label="Company name"
                        autoComplete="organization"
                        maxLength={160}
                        required
                        value={company.companyName}
                        onChange={(event) => setCompany((current) => ({ ...current, companyName: event.target.value }))}
                      />
                      <div className="onboarding-form-grid">
                        <Field
                          id="onboarding-business-email"
                          name="businessEmail"
                          label="Business email"
                          type="email"
                          autoComplete="email"
                          maxLength={254}
                          required
                          value={company.businessEmail}
                          onChange={(event) => setCompany((current) => ({ ...current, businessEmail: event.target.value }))}
                        />
                        <Field
                          id="onboarding-phone"
                          name="phone"
                          label="Business phone"
                          type="tel"
                          autoComplete="tel"
                          maxLength={30}
                          minLength={7}
                          required
                          value={company.phone}
                          onChange={(event) => setCompany((current) => ({ ...current, phone: event.target.value }))}
                        />
                      </div>
                      <div className="onboarding-address-heading">
                        <h3>Company address</h3>
                        <span>Business contact address</span>
                      </div>
                      <Field
                        id="onboarding-company-street"
                        name="street"
                        label="Street address"
                        autoComplete="street-address"
                        maxLength={180}
                        required
                        value={company.address.street}
                        onChange={(event) => updateAddress("street", event.target.value)}
                      />
                      <div className="onboarding-form-grid">
                        <Field
                          id="onboarding-company-city"
                          name="city"
                          label="City"
                          autoComplete="address-level2"
                          maxLength={100}
                          required
                          value={company.address.city}
                          onChange={(event) => updateAddress("city", event.target.value)}
                        />
                        <Field
                          id="onboarding-company-region"
                          name="region"
                          label="State, province, or region"
                          autoComplete="address-level1"
                          maxLength={100}
                          required
                          value={company.address.region}
                          onChange={(event) => updateAddress("region", event.target.value)}
                        />
                      </div>
                      <div className="onboarding-form-grid">
                        <Field
                          id="onboarding-company-postal"
                          name="postalCode"
                          label="Postal code"
                          autoComplete="postal-code"
                          maxLength={20}
                          required
                          value={company.address.postalCode}
                          onChange={(event) => updateAddress("postalCode", event.target.value)}
                        />
                        <Field
                          id="onboarding-company-country"
                          name="country"
                          label="Country"
                          autoComplete="country-name"
                          maxLength={80}
                          required
                          value={company.address.country}
                          onChange={(event) => updateAddress("country", event.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {step === "contact" && (
                    <>
                      <Field
                        id="onboarding-contact-name"
                        name="contactName"
                        label="Contact person&apos;s name"
                        autoComplete="name"
                        maxLength={100}
                        required
                        value={contact.name}
                        onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
                      />
                      <Field
                        id="onboarding-contact-designation"
                        name="designation"
                        label="Designation"
                        autoComplete="organization-title"
                        maxLength={100}
                        required
                        value={contact.designation}
                        onChange={(event) => setContact((current) => ({ ...current, designation: event.target.value }))}
                      />
                    </>
                  )}

                  {step === "firstProject" && (
                    <>
                      <Field
                        id="onboarding-project-name"
                        name="projectName"
                        label="Project name"
                        maxLength={160}
                        required
                        value={project.name}
                        onChange={(event) => setProject((current) => ({ ...current, name: event.target.value }))}
                      />
                      <Field
                        id="onboarding-site-address"
                        name="siteAddress"
                        label="Site address"
                        autoComplete="street-address"
                        maxLength={240}
                        required
                        value={project.siteAddress}
                        onChange={(event) => setProject((current) => ({ ...current, siteAddress: event.target.value }))}
                      />
                      <Field
                        id="onboarding-project-location"
                        name="location"
                        label="City, state, or project location"
                        maxLength={160}
                        required
                        value={project.location}
                        onChange={(event) => setProject((current) => ({ ...current, location: event.target.value }))}
                      />
                      <div className="onboarding-form-grid">
                        <Field
                          id="onboarding-project-start"
                          name="startDate"
                          label="Project start date"
                          type="date"
                          required
                          value={project.startDate}
                          onChange={(event) => setProject((current) => ({ ...current, startDate: event.target.value }))}
                        />
                        <Field
                          id="onboarding-project-end"
                          name="endDate"
                          label="Target end date"
                          type="date"
                          min={project.startDate || undefined}
                          required
                          value={project.endDate}
                          onChange={(event) => setProject((current) => ({ ...current, endDate: event.target.value }))}
                        />
                      </div>
                    </>
                  )}

                  <div className="onboarding-form-actions">
                    {currentStepIndex > 0 ? (
                      <button type="button" className="onboarding-back-button" onClick={goBack} disabled={saving}>
                        Back
                      </button>
                    ) : <span />}
                    <button className="onboarding-primary-button" type="submit" disabled={saving}>
                      {saving ? "Saving…" : "Save and continue"}
                      {!saving && <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                  </div>
                </form>
              ) : (
                <form className="onboarding-review" onSubmit={handleComplete}>
                  <ReviewGroup
                    title="Company"
                    onEdit={() => setStep("company")}
                    items={[
                      ["Company", draft?.company?.companyName],
                      ["Business email", draft?.company?.businessEmail],
                      ["Phone", draft?.company?.phone],
                      ["Address", draft?.company ? `${draft.company.address.street}, ${draft.company.address.city}, ${draft.company.address.region} ${draft.company.address.postalCode}, ${draft.company.address.country}` : undefined],
                    ]}
                  />
                  <ReviewGroup
                    title="Primary contact"
                    onEdit={() => setStep("contact")}
                    items={[
                      ["Name", draft?.contact?.name],
                      ["Designation", draft?.contact?.designation],
                    ]}
                  />
                  <ReviewGroup
                    title="First project"
                    onEdit={() => setStep("firstProject")}
                    items={[
                      ["Project", draft?.firstProject?.name],
                      ["Site address", draft?.firstProject?.siteAddress],
                      ["Location", draft?.firstProject?.location],
                      ["Dates", draft?.firstProject ? `${draft.firstProject.startDate} – ${draft.firstProject.endDate}` : undefined],
                    ]}
                  />
                  <p className="onboarding-review-note">Finishing setup creates your organization and first project in the workspace.</p>
                  <div className="onboarding-form-actions">
                    <button type="button" className="onboarding-back-button" onClick={goBack} disabled={saving}>Back</button>
                    <button className="onboarding-primary-button" type="submit" disabled={saving}>
                      {saving ? "Finishing setup…" : "Complete onboarding"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </section>
        <p className="onboarding-footer-note">Your information is saved securely to your ProofSite AI account.</p>
      </section>
    </main>
  );
}

function ReviewGroup({
  title,
  items,
  onEdit,
}: {
  title: string;
  items: [string, string | undefined][];
  onEdit: () => void;
}) {
  return (
    <section className="onboarding-review-group">
      <div className="onboarding-review-heading">
        <h3>{title}</h3>
        <button type="button" onClick={onEdit}>Edit</button>
      </div>
      <dl>
        {items.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || "Not provided"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
