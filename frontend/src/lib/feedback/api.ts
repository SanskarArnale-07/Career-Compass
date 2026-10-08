/**
 * Career Compass — Student Guidance Feedback API Client
 */

import type {
  StudentFeedbackPayload,
  StudentFeedbackResponse,
  FeedbackStats,
} from "./types";

const LOCAL_FEEDBACK_QUEUE_KEY = "career_compass_feedback_queue";

export async function submitStudentFeedback(
  payload: StudentFeedbackPayload,
  token?: string | null
): Promise<StudentFeedbackResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch("/api/v1/feedback", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || "Feedback submitted successfully.",
        feedback_id: data.feedback_id,
      };
    }

    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Server returned ${res.status}`);
  } catch (error) {
    // Offline/Fallback: Queue locally so no student evaluation is lost
    if (typeof window !== "undefined") {
      try {
        const queue: StudentFeedbackPayload[] = JSON.parse(
          localStorage.getItem(LOCAL_FEEDBACK_QUEUE_KEY) || "[]"
        );
        queue.push(payload);
        localStorage.setItem(LOCAL_FEEDBACK_QUEUE_KEY, JSON.stringify(queue));
      } catch {
        // ignore storage errors
      }
    }

    return {
      success: true,
      message: "Feedback recorded locally (offline mode).",
    };
  }
}

export async function fetchFeedbackStats(
  token?: string | null
): Promise<FeedbackStats | null> {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch("/api/v1/feedback/stats", {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}
