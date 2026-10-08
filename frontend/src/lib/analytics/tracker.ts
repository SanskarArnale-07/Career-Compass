/**
 * Career Compass — Privacy-Conscious Analytics Client
 *
 * Batched, asynchronous, client-side event tracking.
 * Respects student privacy: anonymous session IDs only, zero PII, zero keystroke recording.
 */

export interface AnalyticsEvent {
  event_name: string;
  session_id: string;
  timestamp: number;
  properties: Record<string, any>;
}

const SESSION_STORAGE_KEY = "cc_analytics_session_id";
const QUEUE_STORAGE_KEY = "cc_analytics_queue";
const MAX_BATCH_SIZE = 15;
const FLUSH_INTERVAL_MS = 5000;

let eventQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let isInitialized = false;

/**
 * Returns or generates a deterministic client session ID.
 */
export function getAnalyticsSessionId(): string {
  if (typeof window === "undefined") return "server-session";
  try {
    let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!id) {
      id = `cc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `cc_anon_${Date.now()}`;
  }
}

/**
 * Sends a batch of events to the backend analytics endpoint.
 */
async function sendBatch(events: AnalyticsEvent[]): Promise<boolean> {
  if (!events || events.length === 0) return true;

  const payload = {
    events: events.map((e) => ({
      event_name: e.event_name,
      session_id: e.session_id,
      timestamp: e.timestamp,
      properties: e.properties || {},
    })),
  };

  try {
    const res = await fetch("/api/v1/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch (err) {
    // Silently handle offline/failure; events remain safe in local queue fallback
    return false;
  }
}

/**
 * Flushes all queued analytics events.
 */
export async function flushEvents(): Promise<void> {
  if (eventQueue.length === 0) return;

  const toSend = [...eventQueue];
  eventQueue = [];

  const success = await sendBatch(toSend);
  if (!success && typeof window !== "undefined") {
    // If failed, preserve in localStorage so they can be re-tried later
    try {
      const persisted: AnalyticsEvent[] = JSON.parse(
        localStorage.getItem(QUEUE_STORAGE_KEY) || "[]"
      );
      const combined = [...persisted, ...toSend].slice(-50); // cap to 50
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(combined));
    } catch {
      // ignore
    }
  }
}

/**
 * Tracks an analytics event with automatic batching and privacy scrubbing.
 */
export function trackEvent(
  eventName: string,
  properties: Record<string, any> = {}
): void {
  if (typeof window === "undefined") return;

  // Initialize listeners once
  if (!isInitialized) {
    isInitialized = true;
    window.addEventListener("beforeunload", () => {
      flushEvents();
    });

    // Try to send any offline-saved events on startup
    try {
      const persistedStr = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (persistedStr) {
        const persisted: AnalyticsEvent[] = JSON.parse(persistedStr);
        if (persisted.length > 0) {
          localStorage.removeItem(QUEUE_STORAGE_KEY);
          sendBatch(persisted);
        }
      }
    } catch {
      // ignore
    }
  }

  // Scrub any accidental sensitive fields
  const safeProps = { ...properties };
  delete safeProps.password;
  delete safeProps.token;
  delete safeProps.email;

  const event: AnalyticsEvent = {
    event_name: eventName,
    session_id: getAnalyticsSessionId(),
    timestamp: Date.now(),
    properties: safeProps,
  };

  eventQueue.push(event);

  if (eventQueue.length >= MAX_BATCH_SIZE) {
    if (flushTimer) clearTimeout(flushTimer);
    flushEvents();
  } else if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushTimer = null;
      flushEvents();
    }, FLUSH_INTERVAL_MS);
  }
}

// ── Canonical Event Helpers ──────────────────────────────────────────

export function trackPageView(path: string, title?: string): void {
  trackEvent("PAGE_VIEW", {
    path,
    title: title || (typeof document !== "undefined" ? document.title : ""),
  });
}

export function trackAssessmentStarted(questionCount: number): void {
  trackEvent("ASSESSMENT_STARTED", {
    question_count: questionCount,
    started_at: Date.now(),
  });
}

export function trackAssessmentCompleted(topCareer?: string, archetype?: string): void {
  trackEvent("ASSESSMENT_COMPLETED", {
    top_career: topCareer,
    archetype: archetype,
    completed_at: Date.now(),
  });
}

export function trackProfileViewed(archetype?: string, topCareer?: string): void {
  trackEvent("PROFILE_VIEWED", {
    archetype,
    top_career: topCareer,
  });
}

export function trackCareerExplored(careerSlug: string, domain?: string): void {
  trackEvent("CAREER_EXPLORED", {
    career_slug: careerSlug,
    domain,
  });
}

export function trackRoadmapStageViewed(careerSlug: string, stage: number): void {
  trackEvent("ROADMAP_STAGE_VIEWED", {
    career_slug: careerSlug,
    stage,
  });
}

export function trackSkillCompleted(careerSlug: string, skillId: string): void {
  trackEvent("SKILL_COMPLETED", {
    career_slug: careerSlug,
    skill_id: skillId,
  });
}

export function trackResourceClicked(
  resourceId: string,
  category: string,
  title: string
): void {
  trackEvent("RESOURCE_CLICKED", {
    resource_id: resourceId,
    category,
    title,
  });
}

export function trackFeedbackSubmitted(overallScore: number): void {
  trackEvent("FEEDBACK_SUBMITTED", {
    overall_score: overallScore,
  });
}
