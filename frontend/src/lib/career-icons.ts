import {
  Cpu,
  Brain,
  Lightbulb,
  Heart,
  FlaskConical,
  DollarSign,
  Rocket,
  Briefcase,
  Megaphone,
  Palette,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";

export const CAREER_ICON_MAP: Record<string, LucideIcon> = {
  "Software / App Development": Cpu,
  "AI / Machine Learning / Data Science": Brain,
  "Engineering": Lightbulb,
  "Medicine / Healthcare": Heart,
  "Scientific Research": FlaskConical,
  "Finance / Investment Banking": DollarSign,
  "Entrepreneurship": Rocket,
  "Management / Product Management": Briefcase,
  "Marketing / Media / Communications": Megaphone,
  "Design / Creative Arts": Palette,
  "Law / Public Policy": Scale,
  "Psychology / Social Impact": Users,
};

export function getCareerIcon(careerName: string): LucideIcon {
  return CAREER_ICON_MAP[careerName] || Briefcase;
}
