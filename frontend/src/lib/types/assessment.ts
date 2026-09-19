/**
 * Unified Assessment & Scoring Types
 * Canonical frontend definitions matching backend FastAPI models.
 */

export interface TraitProfile {
  AN: number;
  TE: number;
  SC: number;
  BU: number;
  CR: number;
  SO: number;
  LE: number;
  EX: number;
  [key: string]: number;
}

export interface StreamScores {
  science: number;
  commerce: number;
  arts: number;
}

export interface StreamResult {
  scores: StreamScores;
  recommendation: string;
  descriptions: Record<string, string>;
}

export interface CareerMatch {
  career_name: string;
  match_percentage: number;
  top_traits: string[];
  explanation: string;
  skill_gaps: string[];
  next_steps: string[];
}

export interface AssessmentResponse {
  trait_profile: TraitProfile;
  streams: StreamResult;
  top_careers: CareerMatch[];
}

export interface AssessmentRequest {
  answers: Record<string, string>;
}
