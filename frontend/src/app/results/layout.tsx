import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Career Matches | Career Compass",
  description:
    "See your personalized career matches based on your assessment results. Explore strong matches, skill gaps, and a custom learning roadmap.",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
