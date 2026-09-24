import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Coach AI | Career Compass",
  description:
    "Ask your AI career coach anything about your learning roadmap, skill gaps, weekly sprint, and career readiness. Powered by your real progress data.",
};

export default function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
