import { AssessmentWizard } from "@/components/assessment/AssessmentWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Assessment | Career Compass",
  description: "Map your cognitive strengths, problem-solving style, and career directions with Career Compass.",
};

export default function TakeAssessmentPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center px-4 py-8 sm:py-12">
      <AssessmentWizard />
    </div>
  );
}
