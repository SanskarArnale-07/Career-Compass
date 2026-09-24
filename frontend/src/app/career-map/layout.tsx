import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Hierarchy Map | Career Compass",
  description:
    "Explore how broad career domains branch into specialized paths, disciplines, and roles. Navigate the full interactive career hierarchy tree.",
};

export default function CareerMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
