import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile | Career Compass",
  description:
    "View your career assessment results, track your roadmap progress, and manage your personal learning journey on Career Compass.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
