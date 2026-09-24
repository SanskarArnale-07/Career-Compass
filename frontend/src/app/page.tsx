import { CareerGlobeExperience } from "@/components/home/globe/CareerGlobeExperience";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full bg-[#080A0D]">
      {/* ── 3D Career Globe Experience: THE GLOBE IS THE HERO ── */}
      <CareerGlobeExperience />
    </div>
  );
}
