/**
 * Career Compass — Student Guidance Feedback Types
 */

export interface StudentFeedbackPayload {
  session_id: string;
  profile_clarity_score: number; // 1-5
  career_relevance_score: number; // 1-5
  strengths_understanding_score: number; // 1-5
  career_exploration_usefulness_score: number; // 1-5
  confidence_before: number; // 1-5
  confidence_after: number; // 1-5
  recommendation_explanation_score: number; // 1-5
  discovered_new_career: boolean;
  recommend_to_others: boolean;
  most_useful?: string;
  improvement_suggestion?: string;
}

export interface StudentFeedbackResponse {
  success: boolean;
  message: string;
  feedback_id?: string;
}

export interface FeedbackStats {
  total_responses: number;
  avg_profile_clarity: number | null;
  avg_career_relevance: number | null;
  avg_strengths_understanding: number | null;
  avg_career_exploration_usefulness: number | null;
  avg_confidence_before: number | null;
  avg_confidence_after: number | null;
  avg_recommendation_explanation: number | null;
  pct_discovered_new_career: number | null;
  pct_recommend_to_others: number | null;
}
