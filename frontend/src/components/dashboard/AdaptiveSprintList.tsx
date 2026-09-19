"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import type { SprintTask } from "@/lib/career-details/roadmap-intelligence";

interface CustomTask {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

interface AdaptiveSprintListProps {
  tasks: SprintTask[];
  customTasks: CustomTask[];
  onToggleTask: (taskId: string) => void;
  onAddCustomTask: (text: string) => void;
  onToggleCustomTask: (id: string) => void;
  onDeleteCustomTask: (id: string) => void;
}

const PRIORITY_BADGES: Record<
  SprintTask["priority"],
  { label: string; bg: string; text: string; border: string }
> = {
  Urgent: {
    label: "Urgent",
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  "High Impact": {
    label: "High Impact",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  Recommended: {
    label: "Recommended",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
};

export default function AdaptiveSprintList({
  tasks,
  customTasks,
  onToggleTask,
  onAddCustomTask,
  onToggleCustomTask,
  onDeleteCustomTask,
}: AdaptiveSprintListProps) {
  const [newInput, setNewInput] = useState("");

  const completedCount =
    tasks.filter((t) => t.done).length + customTasks.filter((t) => t.done).length;
  const totalCount = tasks.length + customTasks.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInput.trim()) return;
    onAddCustomTask(newInput.trim());
    setNewInput("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/70">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Adaptive Weekly Sprint
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Personalized milestones prioritized by your active phase and assessment gaps.
          </p>
        </div>

        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
          <CountUp value={completedCount} duration={0.8} />/<CountUp value={totalCount} duration={0.8} /> Done
        </span>
      </div>

      {/* Adaptive Task List */}
      <div className="space-y-3">
        {tasks.map((task, idx) => {
          const priority = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Recommended;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.25) }}
              onClick={() => onToggleTask(task.id)}
              className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer select-none ${
                task.done
                  ? "border-emerald-500/25 bg-emerald-500/5"
                  : "border-border bg-[#0F172A] hover:border-primary/40 hover:bg-card-hover"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 transition-transform active:scale-90"
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    {task.category}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${priority.bg} ${priority.text} ${priority.border}`}
                  >
                    {priority.label}
                  </span>
                </div>

                <p
                  className={`text-xs sm:text-sm font-medium leading-snug transition-colors ${
                    task.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {task.title}
                </p>

                <p className="text-[11px] text-muted-foreground mt-1">
                  {task.reason}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Custom User Tasks */}
        {customTasks.map((task) => (
          <motion.div
            key={task.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${
              task.done
                ? "border-emerald-500/25 bg-emerald-500/5"
                : "border-border bg-[#0F172A] hover:border-primary/40"
            }`}
          >
            <button
              onClick={() => onToggleCustomTask(task.id)}
              className="mt-0.5 shrink-0 cursor-pointer"
            >
              {task.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            <div
              onClick={() => onToggleCustomTask(task.id)}
              className="flex-1 min-w-0 cursor-pointer select-none"
            >
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                Personal Goal
              </span>
              <p
                className={`text-xs sm:text-sm font-medium leading-snug ${
                  task.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {task.text}
              </p>
            </div>

            <button
              onClick={() => onDeleteCustomTask(task.id)}
              className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1"
              title="Delete goal"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Add Custom Goal Input */}
      <form onSubmit={handleSubmit} className="pt-2 border-t border-border/60">
        <div className="flex gap-2">
          <input
            type="text"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder="Add a personalized sprint task or study goal..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0F172A] border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>
    </div>
  );
}
