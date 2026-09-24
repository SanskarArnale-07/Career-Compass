"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import {
  buildCurrentCareerContext,
  type CareerCoachContext,
} from "@/lib/career-details/career-context";
import {
  SUGGESTED_QUESTIONS,
  generateLocalCoachResponse,
} from "@/lib/coach/coach-engine";
import { getAllCareerIntelligence } from "@/lib/career-intelligence";
import { CoachMarkdown } from "@/components/coach/CoachMarkdown";
import { setSelectedCareer } from "@/lib/persistence";

interface ChatMessage {
  id: string;
  role: "user" | "coach";
  content: string;
  timestamp: number;
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getTimestamp(): number {
  return Date.now();
}

function createMessageId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

export default function CoachPage() {
  const isClient = useIsClient();
  const [context, setContext] = useState<CareerCoachContext | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showContextDrawer, setShowContextDrawer] = useState(false);
  const [showCareerSwitcher, setShowCareerSwitcher] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const allCareers = getAllCareerIntelligence();

  // 1. Initialize context on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const initialContext = buildCurrentCareerContext();
      setContext(initialContext);

      // Initial welcome message
      setMessages([
        {
          id: "welcome",
          role: "coach",
          content: `### 👋 Welcome to your Career Compass AI Coach!

I'm synced with your actual progress toward becoming a **${initialContext.career.title}**.

- **Current Readiness**: **${initialContext.readiness.overallScore}%** (Level ${initialContext.readiness.tierLevel}: ${initialContext.readiness.tierName})
- **Active Phase**: **Phase ${initialContext.roadmap.currentPhaseNumber}: ${initialContext.roadmap.currentPhaseTitle}**
- **Recommended Next Step**: **${initialContext.nextAction.title}**

Click any suggested question below or ask me about your roadmap, skill gaps, projects, or week planning!`,
          timestamp: getTimestamp(),
        },
      ]);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // 2. Handle sending message
  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isThinking || !context) return;

    const userMsg: ChatMessage = {
      id: createMessageId("user"),
      role: "user",
      content: text,
      timestamp: getTimestamp(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsThinking(true);

    try {
      // Try API route first, fallback gracefully to local generator
      let coachReply = "";
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
          coachReply = data.response;
        }
      } catch (networkErr) {
        console.warn("API route unreachable, using local engine", networkErr);
      }

      if (!coachReply) {
        coachReply = await generateLocalCoachResponse(text, context);
      }

      const coachMsg: ChatMessage = {
        id: createMessageId("coach"),
        role: "coach",
        content: coachReply,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (e) {
      console.error("Coach error:", e);
      setMessages((prev) => [
        ...prev,
        {
          id: createMessageId("error"),
          role: "coach",
          content: "I ran into a temporary issue evaluating your request. Please try asking again!",
          timestamp: getTimestamp(),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSelectCareer = (slug: string) => {
    setSelectedCareer(slug);
    const updated = buildCurrentCareerContext(slug);
    setContext(updated);
    setShowCareerSwitcher(false);

    setMessages((prev) => [
      ...prev,
      {
        id: `switch_${Date.now()}`,
        role: "coach",
        content: `🔄 **Target Career Switched**: I am now advising you for **${updated.career.title}** (${updated.career.category}). Your current readiness for this track is **${updated.readiness.overallScore}%** (Level ${updated.readiness.tierLevel}: ${updated.readiness.tierName}).`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleClearChat = () => {
    if (!context) return;
    setMessages([
      {
        id: `reset_${Date.now()}`,
        role: "coach",
        content: `### 🔄 Chat Cleared\n\nI am ready with your context for **${context.career.title}** (${context.readiness.overallScore}% Readiness). How can I assist you today?`,
        timestamp: Date.now(),
      },
    ]);
  };

  if (!isClient || !context) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground font-mono">
            Loading Career Compass Coach...
          </p>
        </div>
      </div>
    );
  }

  const IconComponent =
    (context.career.icon &&
      (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
        context.career.icon
      ]) ||
    Sparkles;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 1. Header Bar */}
      <header className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <div className="h-4 w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/15 border border-primary/25 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h1 className="font-heading text-sm font-bold text-foreground leading-none">
                  Career Compass AI
                </h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                  Personal career coach powered by your journey
                </p>
              </div>
            </div>
          </div>

          {/* Active Career Badge & Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCareerSwitcher(!showCareerSwitcher)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/25 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-all cursor-pointer truncate max-w-50 sm:max-w-none"
            >
              <IconComponent className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{context.career.title}</span>
              {context.career.matchPercentage !== undefined && (
                <span className="text-[10px] font-mono opacity-80">
                  ({context.career.matchPercentage}%)
                </span>
              )}
              <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
            </button>

            <button
              onClick={handleClearChat}
              title="Clear conversation"
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Career Switcher Drawer */}
        <AnimatePresence>
          {showCareerSwitcher && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-[#12100E]/98 backdrop-blur-md px-4 py-4"
            >
              <div className="container mx-auto max-w-5xl">
                <p className="text-xs font-mono font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Select Career to Coach:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allCareers.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleSelectCareer(c.slug)}
                      className={`text-left p-2 rounded-lg border text-xs font-medium transition-all ${
                        c.slug === context.career.slug
                          ? "bg-primary/20 border-primary text-primary font-bold"
                          : "border-border bg-[#10141A] text-foreground hover:bg-[#141920]"
                      }`}
                    >
                      <div className="truncate">{c.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {c.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Context Grounding Bar */}
      <div className="border-b border-border/60 bg-[#10141A]/70 text-xs">
        <div className="container mx-auto px-4 py-2 max-w-5xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" />
              Live Grounding:
            </span>
            <span className="text-foreground font-medium">
              Phase {context.roadmap.currentPhaseNumber}:{" "}
              <span className="text-muted-foreground">
                {context.roadmap.currentPhaseTitle}
              </span>
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="text-foreground font-medium">
              Readiness:{" "}
              <span className="text-primary font-mono font-bold">
                {context.readiness.overallScore}%
              </span>{" "}
              ({context.readiness.tierName})
            </span>
            <span className="text-border hidden sm:inline">•</span>
            <span className="text-foreground font-medium">
              Target:{" "}
              <span className="text-primary font-mono font-semibold">
                {context.studyPace.targetMonthYear}
              </span>
            </span>
          </div>

          <button
            onClick={() => setShowContextDrawer(!showContextDrawer)}
            className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            {showContextDrawer ? "Hide Details" : "View Coach Context"}
          </button>
        </div>

        {/* Detailed Context Drawer */}
        <AnimatePresence>
          {showContextDrawer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-[#12100E] p-4 text-xs space-y-3"
            >
              <div className="container mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-border bg-card/80">
                  <span className="font-mono text-muted-foreground uppercase text-[10px] block mb-1">
                    Priority Skill Gap
                  </span>
                  <p className="font-semibold text-foreground">
                    {context.skills.priorityGaps[0]?.name || "None identified"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {context.skills.priorityGaps[0]?.whyItMatters || "Core roadmap coverage"}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card/80">
                  <span className="font-mono text-muted-foreground uppercase text-[10px] block mb-1">
                    Next Project Milestone
                  </span>
                  <p className="font-semibold text-foreground">
                    {context.projects.nextToBuild?.title || "All completed"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {context.projects.completed.length} of {context.projects.total} projects built
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-border bg-card/80">
                  <span className="font-mono text-muted-foreground uppercase text-[10px] block mb-1">
                    Internship Readiness
                  </span>
                  <p className="font-semibold text-foreground">
                    {context.jobPrep.isInternshipReady ? "Ready to apply" : "Building required proof"}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {context.jobPrep.completedTasksCount} of {context.jobPrep.totalTasks} prep items checked
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Main Chat Conversation Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3.5 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-[#10141A] border border-primary/30 text-primary"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 sm:p-5 max-w-[88%] sm:max-w-[82%] text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none shadow-md shadow-primary/10"
                    : "bg-card border border-border rounded-tl-none text-foreground shadow-sm"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="font-medium whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <CoachMarkdown content={msg.content} />
                )}

                <div
                  className={`mt-2 text-[10px] font-mono ${
                    msg.role === "user"
                      ? "text-primary-foreground/75 text-right font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3.5"
            >
              <div className="h-9 w-9 rounded-xl bg-[#10141A] border border-primary/30 text-primary flex items-center justify-center shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border rounded-tl-none flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  Evaluating your roadmap context...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* 4. Bottom Input Bar & Suggested Questions */}
      <footer className="border-t border-border/80 bg-background/95 backdrop-blur-md p-4 sticky bottom-0 z-20">
        <div className="container mx-auto max-w-4xl space-y-3">
          {/* Horizontal Suggested Questions Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              Suggested:
            </span>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isThinking}
                className="px-3 py-1.5 rounded-full border border-border/80 bg-[#10141A] text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary hover:bg-[#141920] shrink-0 transition-colors cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Coach about your ${context.career.title} roadmap, skill gaps, or schedule...`}
              disabled={isThinking}
              className="flex-1 px-4 py-3.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="px-5 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary/20 flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
