"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assessmentQuestions, AssessmentQuestion } from "@/lib/assessment-data";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export function AssessmentWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  
  const currentQuestion = assessmentQuestions[currentStepIndex];
  const isLastQuestion = currentStepIndex === assessmentQuestions.length - 1;
  const progressPercentage = ((currentStepIndex + 1) / assessmentQuestions.length) * 100;

  const getSectionName = (index: number) => {
    if (index >= 0 && index <= 3) return "ABOUT YOU"; // Q1-Q4
    if (index >= 4 && index <= 7) return "YOUR INTERESTS"; // Q5-Q8
    if (index >= 8 && index <= 11) return "YOUR PERSONALITY"; // Q9-Q12
    if (index >= 12 && index <= 15) return "YOUR FUTURE VISION"; // Q13-Q16
    return "CAREER DNA"; // Q17-Q20
  };

  // Handle single choice selection
  const handleSingleSelect = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // Handle multiple choice selection
  const handleMultiSelect = (value: string) => {
    setAnswers((prev) => {
      const currentSelection = (prev[currentQuestion.id] as string[]) || [];
      
      if (currentSelection.includes(value)) {
        return {
          ...prev,
          [currentQuestion.id]: currentSelection.filter((v) => v !== value),
        };
      }
      
      // Limit to 3 for interests (based on data definition)
      if (currentQuestion.id === "q3_interests" && currentSelection.length >= 3) {
        return prev;
      }

      return {
        ...prev,
        [currentQuestion.id]: [...currentSelection, value],
      };
    });
  };

  // Validation
  const canContinue = () => {
    const currentAnswer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple-choice") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    return currentAnswer !== undefined && currentAnswer !== "";
  };

  // Navigation
  const handleNext = () => {
    if (!canContinue()) return;
    
    if (isLastQuestion) {
      // Save to sessionStorage and route
      sessionStorage.setItem("careerCompassAssessment", JSON.stringify(answers));
      router.push("/results");
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else {
      router.push("/assessment");
    }
  };

  // Render option card
  const renderOption = (option: { value: string; label: string }) => {
    const isMulti = currentQuestion.type === "multiple-choice";
    const currentAnswer = answers[currentQuestion.id];
    
    const isSelected = isMulti 
      ? Array.isArray(currentAnswer) && currentAnswer.includes(option.value)
      : currentAnswer === option.value;

    return (
      <button
        key={option.value}
        onClick={() => isMulti ? handleMultiSelect(option.value) : handleSingleSelect(option.value)}
        className={`w-full text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${
          isSelected 
            ? "border-primary bg-primary/5 shadow-sm" 
            : "border-border/60 bg-card hover:border-primary/40 hover:bg-muted/30"
        }`}
      >
        <span className={`font-medium ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
          {option.label}
        </span>
        
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
        }`}>
          {isSelected && <Check className="h-3.5 w-3.5" />}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-8rem)]">
      
      {/* Progress Bar & Header */}
      <div className="mb-10 w-full pt-8">
        <div className="text-center mb-6">
          <p className="text-sm font-semibold tracking-wider text-primary mb-2 uppercase">Career Compass Assessment</p>
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
            {getSectionName(currentStepIndex)}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4 text-sm font-medium">
          <span className="text-muted-foreground">Question {currentStepIndex + 1} of {assessmentQuestions.length}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Container */}
      <div className="flex-1 flex flex-col">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
            {currentQuestion.question}
          </h2>
          {currentQuestion.explanation && (
            <p className="text-muted-foreground">
              {currentQuestion.explanation}
            </p>
          )}
        </div>

        <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {currentQuestion.options.map(renderOption)}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto pt-6 border-t border-border/40 flex items-center justify-between bg-background sticky bottom-0 pb-8">
        <button
          onClick={handleBack}
          className="inline-flex h-12 items-center justify-center rounded-lg px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!canContinue()}
          className={`inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
            canContinue() 
              ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90" 
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
          }`}
        >
          {isLastQuestion ? "Discover My Career Path" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
