import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Assessment | Career Compass",
  description:
    "Discover your career direction. Answer 20 questions across 8 cognitive dimensions to get personalized career matches aligned to your strengths and values.",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
