import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Career Compass",
  description:
    "Sign in to your Career Compass account to access your personalized learning roadmap, track progress, and continue your career journey.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
