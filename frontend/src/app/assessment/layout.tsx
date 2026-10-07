import type { Metadata } from "next";
import { assessmentQuestions } from "@/lib/assessment-data";

export const metadata: Metadata = {
  title: "Career Assessment | Career Compass",
  description:
    `Discover your career direction. Answer ${assessmentQuestions.length} questions across 8 cognitive dimensions to get personalized career matches aligned to your strengths and values.`,
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
