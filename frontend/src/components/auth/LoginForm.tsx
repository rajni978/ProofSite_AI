"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthButton } from "./AuthButton";
import { FormError } from "./FormError";
import { FormInput } from "./FormInput";
import { PasswordInput } from "./PasswordInput";
import { login } from "@/services/auth.service";
import { ApiRequestError } from "@/services/api";

function destinationForRole(role: string): string {
  return `/dashboard/${role.toLowerCase()}`;
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);
    try {
      const { user } = await login({ email: normalizedEmail, password });
      router.replace(destinationForRole(user.role));
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof ApiRequestError
          ? requestError.message
          : "Sign-in could not be completed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormInput
          id="login-email"
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
        <PasswordInput
          id="login-password"
          name="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        {error && <FormError message={error} />}
        <AuthButton loading={loading} loadingLabel="Signing in...">
          Sign in
          <svg viewBox="0 0 20 20" width="17" height="17" fill="none" aria-hidden="true">
            <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </AuthButton>
      </form>
      <p className="auth-switch">
        New to ProofSite AI?{" "}
        <Link className="auth-link" href="/register">
          Create an account
        </Link>
      </p>
    </>
  );
}
