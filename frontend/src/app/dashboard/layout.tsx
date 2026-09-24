import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Command Center | Career Compass",
  description:
    "Your personal learning workspace. Track your roadmap progress, manage sprints, master skills, and advance toward career readiness.",
  robots: { index: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
