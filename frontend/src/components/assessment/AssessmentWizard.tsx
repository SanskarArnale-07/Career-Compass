"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { assessmentQuestions } from "@/lib/assessment-data";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { BlurText } from "@/components/interactive/BlurText";

export function AssessmentWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  
  const currentQuestion = assessmentQuestions[currentStepIndex];
  const isLastQuestion = currentStepIndex === assessmentQuestions.length - 1;
  const progressPercentage = ((currentStepIndex + 1) / assessmentQuestions.length) * 100;

  const getSectionName = (index: number) => {
    if (index >= 0 && index <= 3) return "About You"; // Q1-Q4
    if (index >= 4 && index <= 7) return "Your Interests"; // Q5-Q8
    if (index >= 8 && index <= 11) return "Your Personality"; // Q9-Q12
    if (index >= 12 && index <= 15) return "Your Future Vision"; // Q13-Q16
    return "Career DNA"; // Q17-Q20
  };

  // Scroll to top when the question changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStepIndex]);

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
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        <SpotlightCard 
          spotlightColor={isSelected ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.05)"}
          className={`transition-all duration-300 flex items-center justify-between py-2.5 px-3.5 sm:py-3 sm:px-4 border-2 ${
            isSelected 
              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
              : "border-border/40 bg-card/60 hover:border-primary/40 hover:bg-muted/40"
          }`}
        >
          <span className={`font-sans font-medium text-base sm:text-lg transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
            {option.label}
          </span>
          
          <div className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ml-4 ${
            isSelected ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "border-muted-foreground/30"
          }`}>
            {isSelected && <Check className="h-3 w-3" />}
          </div>
        </SpotlightCard>
      </button>
    );
  };

  return (
    <div className="relative w-full pb-8">
      
      {/* Subtle Background */}
      <div className="fixed inset-0 z-0 bg-radial from-transparent to-background via-background/90 pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Progress Bar & Header */}
        <div className="mb-3 w-full pt-2 sm:pt-3">
          <div className="text-center mb-2">
            <h1 className="font-heading text-xs font-bold tracking-widest text-primary mb-1 uppercase">
              Career-Compass Assessment
            </h1>
            
            <div className="h-7 overflow-hidden flex justify-center items-center">
              <BlurText 
                key={getSectionName(currentStepIndex)} 
                text={getSectionName(currentStepIndex)}
                className="font-heading text-lg font-bold tracking-wide text-foreground"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-1 text-xs font-medium font-sans">
            <span className="text-muted-foreground">Question {currentStepIndex + 1} of {assessmentQuestions.length}</span>
            <span className="text-primary font-bold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden border border-border/40 p-0.5">
            <div 
              className="h-full bg-primary transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Container */}
        <div>
          <div className="mb-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight mb-2 leading-snug">
              {currentQuestion.question}
            </h2>
            {currentQuestion.explanation && (
              <p className="font-sans text-muted-foreground text-sm sm:text-base">
                {currentQuestion.explanation}
              </p>
            )}
            {currentQuestion.type === "multiple-choice" && (
              <p className="font-sans text-primary/80 text-xs mt-2 font-medium flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/80"></span>
                Select all that apply (up to 3)
              </p>
            )}
          </div>

          <div className="space-y-2 mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {currentQuestion.options.map(renderOption)}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-2 pt-4 pb-8 sm:pb-10 border-t border-border/20 flex items-center justify-between w-full">
          <button
            onClick={handleBack}
            className="inline-flex h-10 sm:h-12 items-center justify-center rounded-lg px-4 sm:px-6 text-sm font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canContinue()}
            className={`inline-flex h-10 sm:h-12 items-center justify-center rounded-lg px-5 sm:px-8 text-sm font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              canContinue() 
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5" 
                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            }`}
          >
            {isLastQuestion ? "Discover My Career Path" : "Continue"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
