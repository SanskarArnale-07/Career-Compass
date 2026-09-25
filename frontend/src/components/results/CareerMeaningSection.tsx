"use client";

import { useMemo } from "react";
import { Sparkles, Laptop, Building2, Briefcase } from "lucide-react";
import { resolveCareerIntelligence } from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";

interface CareerMeaningSectionProps {
  careerName: string;
  careerTitle: string;
  careerSlug: string;
  matchPercentage: number;
  isStrong: boolean;
  explanation: string;
}

export function CareerMeaningSection({
  careerName,
  careerTitle,
  careerSlug,
  matchPercentage: _matchPercentage,
  isStrong,
  explanation,
}: CareerMeaningSectionProps) {
  // Resolve rich intelligence and hierarchy for realistic student-friendly context
  const intelligence = useMemo(() => {
    return resolveCareerIntelligence(careerSlug) || resolveCareerIntelligence(careerName);
  }, [careerSlug, careerName]);

  const hierarchy = useMemo(() => {
    return getCareerHierarchy(careerName) || getCareerHierarchy(careerSlug);
  }, [careerName, careerSlug]);

  // Meaning: What people in this career actually do
  const whatPeopleDo = useMemo(() => {
    // 1. Check snapshot for explicit "What You Do"
    const snapWhat = intelligence?.snapshot?.find(
      (s) => s.label.toLowerCase().includes("what you do") || s.label.toLowerCase().includes("overview")
    )?.value;
    if (snapWhat) return snapWhat;

    // 2. Check intelligence description
    if (intelligence?.description) {
      return intelligence.description;
    }

    // 3. Fallback to tagline or synthesized explanation
    if (hierarchy?.path.tagline) {
      return hierarchy.path.tagline;
    }

    if (intelligence?.tagline) {
      return intelligence.tagline;
    }

    return `Professionals in ${careerTitle} design, build, and manage solutions that address real-world challenges across modern organizations.`;
  }, [intelligence, hierarchy, careerTitle]);

  // Contextual student connection
  const studentConnection = useMemo(() => {
    if (explanation) return explanation;

    if (isStrong) {
      return `Your assessment responses demonstrate a strong natural orientation toward the structured problem-solving and core skills needed in ${careerTitle}.`;
    }
    return `Your assessment pattern shows curiosity and potential in this direction, making ${careerTitle} a promising area to explore.`;
  }, [explanation, isStrong, careerTitle]);

  // Snapshot: What you could work on
  const whatYouWorkOn = useMemo(() => {
    if (intelligence?.recommendedProjects?.length) {
      return intelligence.recommendedProjects.map((p) => p.title).slice(0, 3).join(", ");
    }
    if (hierarchy?.path.specializations?.length) {
      return hierarchy.path.specializations.map((s) => s.name).slice(0, 3).join(", ");
    }
    return "Real-world projects, modern systems, and innovative digital solutions";
  }, [intelligence, hierarchy]);

  // Snapshot: Typical work areas / environments
  const workAreas = useMemo(() => {
    if (intelligence?.industryInfo?.sectors?.length) {
      return intelligence.industryInfo.sectors.slice(0, 3).join(", ");
    }
    const snapInd = intelligence?.snapshot?.find(
      (s) => s.label.toLowerCase().includes("industries") || s.label.toLowerCase().includes("work environment")
    )?.value;
    if (snapInd) {
      return snapInd.split(",").slice(0, 3).join(", ");
    }
    if (hierarchy?.domain.name) {
      return `${hierarchy.domain.name}, startups, labs, and enterprise systems`;
    }
    return "Technology companies, creative agencies, enterprises, and research organizations";
  }, [intelligence, hierarchy]);

  // Snapshot: Possible roles
  const possibleRoles = useMemo(() => {
    if (hierarchy?.path.specializations?.length) {
      const roles = hierarchy.path.specializations.flatMap((s) => s.roles.map((r) => r.title));
      if (roles.length) {
        return roles.slice(0, 3).join(", ") + (roles.length > 3 ? ", and more" : "");
      }
    }
    const snapRoles = intelligence?.snapshot?.find(
      (s) => s.label.toLowerCase().includes("roles") || s.label.toLowerCase().includes("entry-level")
    )?.value;
    if (snapRoles) {
      return snapRoles.split(",").slice(0, 3).join(", ") + ", and more";
    }
    return "Specialized practitioners, team contributors, and domain specialists";
  }, [intelligence, hierarchy]);

  return (
    <section className="w-full max-w-280 mx-auto space-y-4 sm:space-y-5 select-none" id="career-meaning-section">
      {/* ── 1. WHAT IS THIS CAREER? (Large Prominent Explanation Card) ─ */}
      <div className="rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-[#0E1217]/95 p-7 sm:p-9 md:p-10 shadow-xl shadow-cyan-950/25">
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <Sparkles className="h-6 w-6 text-cyan-400 shrink-0" />
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
            What is {careerTitle}?
          </h2>
        </div>

        <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed mb-6 sm:mb-7">
          {whatPeopleDo}
        </p>

        {/* Student Connection Callout with generous vertical breathing room */}
        <div className="p-5 sm:p-6 rounded-2xl bg-cyan-950/35 border border-cyan-500/25 text-base sm:text-lg text-cyan-200/90 leading-relaxed flex items-start gap-3.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
          <div>
            <span className="font-bold text-cyan-300">Connection to your result: </span>
            <span className="text-slate-200 font-normal">{studentConnection}</span>
          </div>
        </div>
      </div>

      {/* ── 2. CONCISE CAREER SNAPSHOT (Smaller Supporting Cards) ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 items-stretch">
        {/* What You Could Work On */}
        <div className="p-4 sm:p-4.5 rounded-xl border border-border/70 bg-[#10141A]/90 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Laptop className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                What You Work On
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {whatYouWorkOn}
            </p>
          </div>
        </div>

        {/* Typical Work Areas */}
        <div className="p-4 sm:p-4.5 rounded-xl border border-border/70 bg-[#10141A]/90 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                Typical Work Areas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {workAreas}
            </p>
          </div>
        </div>

        {/* Possible Roles */}
        <div className="p-4 sm:p-4.5 rounded-xl border border-border/70 bg-[#10141A]/90 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-400">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                Possible Roles
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              {possibleRoles}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
