"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Send,
  X,
  RotateCcw,
  BarChart3,
  BookOpen,
  Home,
  Loader2,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import {
  buildCurrentCareerContext,
  type CareerCoachContext,
} from "@/lib/career-details/career-context";
import {
  generateLocalCoachResponse,
  isGreeting,
  isAcknowledgement,
  isGoodbye,
} from "@/lib/coach/coach-engine";
import { CoachMarkdown } from "@/components/coach/CoachMarkdown";
import { assessmentQuestions } from "@/lib/assessment-data";

/* ─── Types ────────────────────────────────────────────────────────────── */

interface ChatMessage {
  id: string;
  role: "user" | "companion";
  content: string;
  timestamp: number;
}

interface PageContext {
  pageName: string;
  pageIcon: React.ComponentType<{ className?: string }>;
  greeting: string;
  quickActions: string[];
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Build a greeting line that uses match % (from assessment) instead of
 * the internal readiness score, avoiding a confusing second number.
 */
function buildCareerGreeting(ctx: CareerCoachContext): string {
  const title = ctx.career.title;
  const match = ctx.career.matchPercentage;
  if (match && match > 0) {
    const formattedMatch = Math.round(match);
    return `\n\nI can see you're exploring **${title}**, which currently has a **${formattedMatch}% match** from your assessment. I can help you understand the career, skills, and roadmap.`;
  }
  return `\n\nYou're exploring **${title}**. I can help you understand the career, skills, and roadmap.`;
}

function getPageContext(pathname: string): PageContext {
  if (pathname.startsWith("/dashboard")) {
    return {
      pageName: "Dashboard",
      pageIcon: BarChart3,
      greeting: "You're on your dashboard. I can help explain any of the metrics you see here.",
      quickActions: [
        "What should I focus on this week?",
        "How do I read my progress?",
        "What's my next milestone?",
      ],
    };
  }
  if (pathname.startsWith("/assessment")) {
    return {
      pageName: "Assessment",
      pageIcon: Sparkles,
      greeting: "You're taking the assessment. There are no right or wrong answers — just pick what feels most like you.",
      quickActions: [
        "How does this assessment work?",
        "Can I retake it later?",
        "What are the questions based on?",
      ],
    };
  }
  if (pathname.startsWith("/results")) {
    return {
      pageName: "Results",
      pageIcon: BarChart3,
      greeting: "You're viewing your results. I can help explain your career matches and trait scores.",
      quickActions: [
        "Why was this career recommended?",
        "What do my trait scores mean?",
        "How are matches calculated?",
      ],
    };
  }
  if (pathname.startsWith("/career")) {
    return {
      pageName: "Career Details",
      pageIcon: BookOpen,
      greeting: "You're exploring a career. Ask me anything about what it involves.",
      quickActions: [
        "What does this career involve?",
        "What skills does it need?",
        "What subjects should I focus on?",
      ],
    };
  }
  if (pathname.startsWith("/coach")) {
    return {
      pageName: "Career Coach",
      pageIcon: MessageCircle,
      greeting: "You're on the coaching page. Feel free to ask me questions here too.",
      quickActions: [
        "What should I learn next?",
        "Am I on the right track?",
      ],
    };
  }
  return {
    pageName: "Home",
    pageIcon: Home,
    greeting: "Welcome to Career Compass. I'm here to help you explore careers that match your interests.",
    quickActions: [
      "What is Career Compass?",
      "How does the assessment work?",
      "What careers can I explore?",
    ],
  };
}

/* ─── Companion Mascot SVG ─────────────────────────────────────────────── */

/**
 * Distinctive companion mascot visual: friendly guide bot with a curiosity beacon.
 * Clearly distinct from the main Career Compass navigation compass icon.
 */
function CompanionIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* Top antenna & beacon spark */}
      <path d="M12 2.5V5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="2.5" r="1.2" fill="currentColor" />
      {/* Cute rounded bot head */}
      <rect x="4" y="6" width="16" height="13" rx="4.5" stroke="currentColor" strokeWidth="1.8" />
      {/* Friendly glowing eyes */}
      <circle cx="9" cy="12" r="1.6" fill="currentColor" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" />
      {/* Gentle curved smile */}
      <path d="M10 15C10.6 15.8 13.4 15.8 14 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Side headphone/ear nubs */}
      <path d="M2.5 10.5C2.5 9.5 3.2 9 4 9V16C3.2 16 2.5 15.5 2.5 14.5V10.5Z" fill="currentColor" fillOpacity="0.7" />
      <path d="M21.5 10.5C21.5 9.5 20.8 9 20 9V16C20.8 16 21.5 15.5 21.5 14.5V10.5Z" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

/* ─── Component ────────────────────────────────────────────────────────── */

export default function CareerCompanion() {
  const isClient = useIsClient();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [context, setContext] = useState<CareerCoachContext | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pageCtx = useMemo(() => getPageContext(pathname), [pathname]);
  const prevCareerSlugRef = useRef<string | undefined>(undefined);

  // Build / update context dynamically when pathname or client changes
  useEffect(() => {
    if (!isClient) return;
    const careerSlugFromPath = pathname.startsWith("/career/")
      ? pathname.split("/")[2]?.split("?")[0]
      : undefined;

    try {
      const ctx = buildCurrentCareerContext(careerSlugFromPath);
      setContext(ctx);

      // If switching between career pages and no dialogue occurred yet, sync greeting
      if (ctx?.career.slug && prevCareerSlugRef.current && prevCareerSlugRef.current !== ctx.career.slug) {
        setMessages((prev) => {
          if (prev.length <= 1) {
            return [
              {
                id: `greeting_${Date.now()}`,
                role: "companion",
                content: `${getPageContext(pathname).greeting}${buildCareerGreeting(ctx)}`,
                timestamp: Date.now(),
              },
            ];
          }
          return prev;
        });
      }
      prevCareerSlugRef.current = ctx?.career.slug;
    } catch {
      // Basic fallback
    }
  }, [isClient, pathname]);

  // Initial greeting — uses match % (not readiness)
  useEffect(() => {
    if (isOpen && !hasGreeted && context) {
      const careerInfo = buildCareerGreeting(context);

      setMessages([
        {
          id: "greeting",
          role: "companion",
          content: `${pageCtx.greeting}${careerInfo}`,
          timestamp: Date.now(),
        },
      ]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, context, pageCtx]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    const timer = setTimeout(
      () => document.addEventListener("mousedown", handleClick),
      100
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    async (messageToSend?: string) => {
      const text = (messageToSend || inputValue).trim();
      if (!text || isThinking) return;

      const userMsg: ChatMessage = {
        id: `u_${Date.now()}`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsThinking(true);

      try {
        let reply = "";

        // Fast-path natural conversation (greetings, thanks, acknowledgements)
        if (isGreeting(text)) {
          reply = "Hey! 👋 What can I help you with?";
        } else if (isAcknowledgement(text)) {
          reply = "You're welcome! Want to explore anything else?";
        } else if (isGoodbye(text)) {
          reply = "Bye! Come back anytime you want to explore more careers. 👋";
        } else {
          // Try API first
          try {
            const res = await fetch("/api/coach", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: text,
                context,
                history: messages.slice(-4).map((m) => ({
                  role: m.role === "user" ? "user" : "assistant",
                  content: m.content,
                })),
              }),
            });
            if (res.ok) {
              const data = await res.json();
              reply = data.response;
            }
          } catch {
            // API unavailable — use local engine
          }

          if (!reply && context) {
            reply = await generateLocalCoachResponse(text, context);
          }

          if (!reply) {
            reply = getFallbackResponse(text, pageCtx);
          }
        }

        const companionMsg: ChatMessage = {
          id: `c_${Date.now()}`,
          role: "companion",
          content: reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, companionMsg]);

        if (!isOpen) {
          setHasUnread(true);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: "companion",
            content: "I ran into a temporary issue. Please try asking again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [inputValue, isThinking, context, messages, isOpen, pageCtx]
  );

  const handleClearChat = useCallback(() => {
    setMessages([
      {
        id: `reset_${Date.now()}`,
        role: "companion",
        content: `${pageCtx.greeting}\n\nHow can I help?`,
        timestamp: Date.now(),
      },
    ]);
  }, [pageCtx.greeting]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    setHasUnread(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!isClient) return null;

  return (
    <>
      {/* ─── Floating Mascot Button ─────────────────────────────── */}
      <motion.button
        id="career-companion-trigger"
        onClick={handleToggle}
        className="fixed bottom-5 right-5 z-[9990] group cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 1 }}
        aria-label="Open Career Companion"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <div className={`relative flex items-center justify-center h-13 w-13 rounded-full bg-gradient-to-br from-[#0E1923] to-[#0B0E12] border-2 border-primary/40 shadow-[0_0_20px_rgba(0,229,255,0.15),0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:border-primary/70 group-hover:shadow-[0_0_28px_rgba(0,229,255,0.25),0_6px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 ${isOpen ? "border-primary/70" : ""}`}>
          <CompanionIcon className={`h-6 w-6 text-primary transition-transform duration-500 ${isOpen ? "scale-90" : "group-hover:scale-110"}`} />
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-pulse-slow pointer-events-none" />
        </div>

        {hasUnread && !isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background"
          />
        )}
        <span className="sr-only">Career Companion</span>
      </motion.button>

      {/* ─── Chat Panel (compact: ~320px) ─────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            id="career-companion-panel"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed z-[9991] bottom-22 right-5 w-[calc(100vw-2.5rem)] max-w-[320px] h-[min(430px,60vh)] flex flex-col rounded-2xl overflow-hidden bg-[#0B0E12] border border-border/80 shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_1px_rgba(0,229,255,0.12)]"
          >
            {/* Header — compact */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60 bg-[#10141A]/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center">
                  <CompanionIcon className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-[11px] font-heading font-bold text-foreground leading-none">Career Companion</h3>
                  <span className="text-[9px] text-muted-foreground">{pageCtx.pageName}{context ? ` · ${context.career.title}` : ""}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={handleClearChat} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer" title="Clear chat">
                  <RotateCcw className="h-3 w-3" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer" title="Close">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Messages — tighter spacing */}
            <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2.5 companion-scroll">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "companion" ? (
                    <div className="max-w-[94%] flex gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CompanionIcon className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <div className="bg-[#10141A] border border-border/50 rounded-xl rounded-tl-sm px-2.5 py-2 text-[11px] text-foreground/95 leading-relaxed">
                        <CoachMarkdown content={msg.content} />
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[82%] bg-primary/12 border border-primary/20 rounded-xl rounded-tr-sm px-2.5 py-1.5 text-[11px] text-foreground leading-relaxed">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Thinking indicator */}
              {isThinking && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-primary/12 border border-primary/20 flex items-center justify-center shrink-0">
                      <CompanionIcon className="h-2.5 w-2.5 text-primary animate-spin" />
                    </div>
                    <div className="bg-[#10141A] border border-border/50 rounded-xl rounded-tl-sm px-2.5 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
                          <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
                          <span className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
                        </div>
                        <span className="text-[9px] text-muted-foreground">thinking…</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Actions — clearly tappable, prominent, conversational */}
            {messages.length <= 1 && !isThinking && (
              <div className="px-3 pb-2 shrink-0">
                <div className="flex flex-col gap-1.5">
                  {pageCtx.quickActions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-[#121720] border border-border/70 hover:border-primary/50 text-foreground/85 hover:text-foreground hover:bg-primary/10 transition-all cursor-pointer flex items-center justify-between group shadow-sm active:scale-[0.99]"
                    >
                      <span className="leading-snug">{q}</span>
                      <span className="text-muted-foreground/50 group-hover:text-primary transition-colors text-xs ml-1 shrink-0">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input — compact */}
            <div className="px-2.5 py-2 border-t border-border/60 bg-[#10141A]/60 shrink-0">
              <div className="flex items-center gap-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything…"
                  disabled={isThinking}
                  className="flex-1 bg-[#0B0E12] border border-border/60 rounded-lg px-2.5 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isThinking}
                  className="p-1.5 rounded-lg bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 hover:border-primary/40 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                  title="Send"
                >
                  {isThinking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Fallback for no-context scenarios ────────────────────────────────── */

function getFallbackResponse(question: string, pageCtx: PageContext): string {
  const q = question.toLowerCase();

  if (isGreeting(question)) {
    return "Hey! 👋 What can I help you with?";
  }

  if (isAcknowledgement(question)) {
    return "You're welcome! Want to explore anything else?";
  }

  if (isGoodbye(question)) {
    return "Bye! Come back anytime you want to explore more careers. 👋";
  }

  if (q.includes("how are you")) {
    return "I'm doing great, thanks for asking! Ready to help you explore careers and roadmaps. What's on your mind?";
  }

  if (q.includes("career compass") || q.includes("what is")) {
    return "Career Compass helps Class 9–10 students discover careers that match their natural interests and abilities. You take a short assessment, get matched with careers, and receive a personalized learning roadmap.";
  }

  if (q.includes("assessment") && q.includes("work")) {
    return `The assessment has ${assessmentQuestions.length} questions. Each question presents options that relate to different thinking styles and interests. There are no right or wrong answers — just pick what sounds most like you. Your responses are used to match you with careers.`;
  }

  if (q.includes("retake") || q.includes("again")) {
    return "You can retake the assessment at any time. Your previous results will be replaced with the new ones. This also resets your roadmap progress, so keep that in mind.";
  }

  if (q.includes("accurate") || q.includes("how accurate")) {
    return "The assessment identifies your natural thinking patterns and interests. It's a starting point for exploration, not a definitive answer. Use your results as a guide, and explore careers that interest you.";
  }

  if (q.includes("right answer") || q.includes("correct answer") || q.includes("which option")) {
    return "There isn't a right answer. Choose the option that sounds most like you. The assessment works best when you answer honestly rather than trying to aim for a specific career.";
  }

  if (q.includes("involve") || q.includes("what does this career")) {
    return "Each career page details what professionals do day-to-day, their key responsibilities, and industry impact. Explore the Overview and Responsibilities sections on this page for full details.";
  }

  if (q.includes("after 10th") || q.includes("subject") || q.includes("focus on") || q.includes("stream")) {
    return "In Class 9–10, prioritize strong foundations in science, mathematics, and analytical reasoning. In Class 11–12, choose the academic stream (Science, Commerce, or Arts/Humanities) recommended for your target pathway.";
  }

  if (q.includes("skill")) {
    return "This career involves both foundational competencies and specialized tools. Explore the Skills and Roadmap tabs on this page to see the full phased breakdown.";
  }

  return `I'm your Career Companion. ${pageCtx.greeting}\n\nYou can ask me about how Career Compass works, what your results mean, or what to learn next.`;
}
