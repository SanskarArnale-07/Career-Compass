import { Bot, MessageSquare, Compass } from "lucide-react";

export function AiAssistant() {
  return (
    <section className="py-24 sm:py-32 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-muted/30 border border-border/50 rounded-3xl p-8 md:p-16 relative overflow-hidden backdrop-blur-sm">
          
          {/* Subtle background element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="flex flex-col items-start text-left">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                <Bot className="mr-2 h-4 w-4" />
                <span>Always-On Guidance</span>
              </div>
              
              <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Your personal career co-pilot.
              </h2>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Navigating a career change is hard. Our AI assistant is trained on real-world industry data to answer your specific questions, review your resume, and provide contextual advice whenever you get stuck.
              </p>
            </div>
            
            <div className="w-full flex justify-center lg:justify-end">
              <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-lg overflow-hidden flex flex-col">
                <div className="h-12 border-b border-border bg-muted/30 flex items-center px-4 gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Compass className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Career Compass AI</span>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-muted rounded-2xl rounded-tr-none px-4 py-2 max-w-[85%] text-sm text-foreground">
                      Should I learn React or Vue if I want to work in finance tech?
                    </div>
                  </div>
                  
                  <div className="flex justify-start">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] text-sm text-foreground">
                      <p className="mb-2">Based on current market data for FinTech, <strong>React</strong> is significantly more dominant.</p>
                      <p className="text-muted-foreground text-xs">Major companies like Stripe and Plaid use React heavily. I recommend adjusting your roadmap to prioritize it.</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-t border-border mt-auto">
                  <div className="h-10 rounded-full bg-muted flex items-center px-4 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 mr-2 opacity-50" />
                    Ask about your career...
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
