import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | Career Compass",
  description:
    "Create your free Career Compass account to save your assessment results, unlock your personalized learning roadmap, and track career milestones.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
