"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "./AuthButton";
import { FormError } from "./FormError";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { ApiRequestError } from "@/services/api";
import { register } from "@/services/auth.service";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  level: string;
} {
  if (!password) return { score: 0, label: "", level: "" };
  const checks = [
    password.length >= 8,
    password.length >= 12,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password) && /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const levels = ["", "weak", "fair", "good", "strong"];
  const labels = ["", "Needs work", "Fair", "Good", "Strong"];
  return { score, label: labels[score], level: levels[score] };
}

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const strength = getPasswordStrength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedName.length < 2 || normalizedName.length > 100) {
      setError("Your name must be between 2 and 100 characters.");
      return;
    }
    if (
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8 || new TextEncoder().encode(password).length > 72) {
      setError("Password must be at least 8 characters and no more than 72 bytes.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (!acceptedTerms) {
      setError("Please accept the terms to create an account.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await register({
        fullName: normalizedName,
        email: normalizedEmail,
        password,
      });
      router.replace(`/dashboard/${user.role.toLowerCase()}`);
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Your account could not be created. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormInput
          id="register-full-name"
          name="fullName"
          label="Full name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          maxLength={100}
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
        <FormInput
          id="register-email"
          name="email"
          label="Work email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div>
          <PasswordInput
            id="register-password"
            name="password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <div className="strength-meter" aria-label={`Password strength: ${strength.label || "not entered"}`}>
            {[1, 2, 3, 4].map((segment) => (
              <span
                key={segment}
                className={`strength-segment${segment <= strength.score ? ` is-active ${strength.level}` : ""}`}
              />
            ))}
          </div>
          {strength.label && (
            <p className="strength-label" aria-live="polite">
              Password strength: {strength.label}
            </p>
          )}
        </div>
        <PasswordInput
          id="register-confirm-password"
          name="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
        <label className="terms-row">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            required
          />
          <span>
            I agree to the terms of service and acknowledge the privacy policy.
          </span>
        </label>
        {error && <FormError message={error} />}
        <AuthButton loading={loading} loadingLabel="Creating account...">
          Create account
          <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
            <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AuthButton>
      </form>
      <p className="auth-switch">
        Already have an account?{" "}
        <Link className="auth-link" href="/login">
          Sign in
        </Link>
      </p>
    </>
  );
}
