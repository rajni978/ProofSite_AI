import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a ProofSite AI account for your project team.",
};

export default function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  );
}
