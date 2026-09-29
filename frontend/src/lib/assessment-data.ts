export type QuestionType = "single-choice" | "multiple-choice";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  explanation?: string;
  options: QuestionOption[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // ── 1. ANALYTICAL (AN) — 3 Core Questions ─────────────────────────────
  {
    id: "q1",
    type: "single-choice",
    question: "You want to buy a new study lamp or gadget with your saved allowance, and there are many models available. How do you typically decide which one is the best choice?",
    explanation: "Reflects how you evaluate information and make everyday consumer comparisons.",
    options: [
      {
        value: "Read customer reviews and look for recurring complaints or praises",
        label: "Read customer reviews and look for recurring complaints or praises",
      },
      {
        value: "Build a comparison checklist comparing exact technical specifications, warranty, and price-to-feature ratios",
        label: "Build a comparison checklist comparing exact technical specifications, warranty, and price-to-feature ratios",
      },
      {
        value: "Ask friends or older siblings who already own one for their personal recommendation",
        label: "Ask friends or older siblings who already own one for their personal recommendation",
      },
      {
        value: "Pick the one that looks and feels best to you in person at the local store",
        label: "Pick the one that looks and feels best to you in person at the local store",
      },
    ],
  },
  {
    id: "q2",
    type: "single-choice",
    question: "When working on a multi-step group presentation, something goes unexpectedly wrong with the final file right before the deadline. What is your first instinct?",
    explanation: "Reveals your instinctive approach to troubleshooting and root-cause analysis.",
    options: [
      {
        value: "Redo the last few steps quickly from memory to see if that clears up the problem",
        label: "Redo the last few steps quickly from memory to see if that clears up the problem",
      },
      {
        value: "Ask a classmate or teacher immediately for advice or a workaround",
        label: "Ask a classmate or teacher immediately for advice or a workaround",
      },
      {
        value: "Step through each slide and element one by one to isolate the exact component causing the failure",
        label: "Step through each slide and element one by one to isolate the exact component causing the failure",
      },
      {
        value: "Look up common error codes or check recent changes to figure out what was modified last",
        label: "Look up common error codes or check recent changes to figure out what was modified last",
      },
    ],
  },
  {
    id: "q3",
    type: "single-choice",
    question: "You have three major school assignments due in the same week, plus exam revision and extracurricular commitments. How do you prefer to tackle the week?",
    explanation: "Shows how you prioritize competing tasks and structure your execution plan.",
    options: [
      {
        value: "Estimate the hours needed for each task, rank them by urgency and difficulty, and schedule dedicated time blocks",
        label: "Estimate the hours needed for each task, rank them by urgency and difficulty, and schedule dedicated time blocks",
      },
      {
        value: "Make a priority checklist and finish the hardest assignment first so the rest of the week is lighter",
        label: "Make a priority checklist and finish the hardest assignment first so the rest of the week is lighter",
      },
      {
        value: "Work on whichever assignment you feel most motivated to do in the moment until it's finished",
        label: "Work on whichever assignment you feel most motivated to do in the moment until it's finished",
      },
      {
        value: "Team up with classmates so you can study together and keep each other accountable through the week",
        label: "Team up with classmates so you can study together and keep each other accountable through the week",
      },
    ],
  },

  // ── 2. TECHNICAL (TE) — 3 Core Questions ──────────────────────────────
  {
    id: "q4",
    type: "single-choice",
    question: "You come across a new digital tool, software application, or electronic device introduced at school or by a friend. What is the first thing you naturally want to do?",
    explanation: "Measures your curiosity toward underlying system mechanics and configuration.",
    options: [
      {
        value: "Use it right away for its intended main purpose without worrying about how it works",
        label: "Use it right away for its intended main purpose without worrying about how it works",
      },
      {
        value: "Explore the settings, shortcuts, and advanced configuration options to see what it can customize or automate",
        label: "Explore the settings, shortcuts, and advanced configuration options to see what it can customize or automate",
      },
      {
        value: "Share it with friends or classmates to see how they use it",
        label: "Share it with friends or classmates to see how they use it",
      },
      {
        value: "Follow a tutorial or video guide to learn all the recommended features step by step",
        label: "Follow a tutorial or video guide to learn all the recommended features step by step",
      },
    ],
  },
  {
    id: "q5",
    type: "single-choice",
    question: "For a school exhibition, your class needs to create an interactive learning model for younger students. Which contribution would you personally enjoy most?",
    explanation: "Explores hands-on building, practical hardware assembly, and digital construction.",
    options: [
      {
        value: "Wiring up sensors, assembling moving parts, or coding interactive buttons for the display",
        label: "Wiring up sensors, assembling moving parts, or coding interactive buttons for the display",
      },
      {
        value: "Designing the illustrations, color schemes, and poster layouts for the exhibit",
        label: "Designing the illustrations, color schemes, and poster layouts for the exhibit",
      },
      {
        value: "Setting up the display equipment, screens, and audio-visual connections so everything runs smoothly",
        label: "Setting up the display equipment, screens, and audio-visual connections so everything runs smoothly",
      },
      {
        value: "Writing the explanatory story and script that explains the concepts to the children",
        label: "Writing the explanatory story and script that explains the concepts to the children",
      },
    ],
  },
  {
    id: "q6",
    type: "single-choice",
    question: "You find yourself doing the same repetitive task every week—like formatting study notes, organizing downloaded files, or copying homework links. How do you handle it?",
    explanation: "Captures your instinct toward workflow automation and technical efficiency.",
    options: [
      {
        value: "Get through it as quickly as possible by focusing and doing it in one continuous sprint",
        label: "Get through it as quickly as possible by focusing and doing it in one continuous sprint",
      },
      {
        value: "Spend time finding a script, keyboard shortcut, or automation tool to handle it automatically in the future",
        label: "Spend time finding a script, keyboard shortcut, or automation tool to handle it automatically in the future",
      },
      {
        value: "Alternate tasks or listen to music to keep yourself refreshed while finishing it",
        label: "Alternate tasks or listen to music to keep yourself refreshed while finishing it",
      },
      {
        value: "Create a standardized reusable template or checklist that cuts down the manual steps each time",
        label: "Create a standardized reusable template or checklist that cuts down the manual steps each time",
      },
    ],
  },

  // ── 3. SCIENTIFIC (SC) — 3 Core Questions ─────────────────────────────
  {
    id: "q7",
    type: "single-choice",
    question: "During a science class lab demonstration, an unexpected chemical reaction or physical effect occurs that contradicts what you anticipated. What goes through your mind?",
    explanation: "Reflects theoretical curiosity and the desire to discover fundamental principles.",
    options: [
      {
        value: "I immediately want to isolate what caused the unexpected outcome and test a new hypothesis",
        label: "I immediately want to isolate what caused the unexpected outcome and test a new hypothesis",
      },
      {
        value: "I want to read the textbook or ask the teacher about the underlying chemical or physical law that explains it",
        label: "I want to read the textbook or ask the teacher about the underlying chemical or physical law that explains it",
      },
      {
        value: "I think it's a cool visual effect and remember what it looked like for future reference",
        label: "I think it's a cool visual effect and remember what it looked like for future reference",
      },
      {
        value: "I focus on writing down the exact observation required for the exam notes so I don't lose marks",
        label: "I focus on writing down the exact observation required for the exam notes so I don't lose marks",
      },
    ],
  },
  {
    id: "q8",
    type: "single-choice",
    question: "You are testing whether different amounts of natural sunlight or water affect how fast plant seedlings sprout for a school biology project. How do you set up your test?",
    explanation: "Tests your understanding and application of controlled experimentation and variable isolation.",
    options: [
      {
        value: "Plant several seeds in different spots around the house and observe which ones grow best overall",
        label: "Plant several seeds in different spots around the house and observe which ones grow best overall",
      },
      {
        value: "Look up the standard growing conditions in a gardening book and follow the recommended advice",
        label: "Look up the standard growing conditions in a gardening book and follow the recommended advice",
      },
      {
        value: "Keep one group under standard conditions as a baseline while varying sunlight for the other pots",
        label: "Keep one group under standard conditions as a baseline while varying sunlight for the other pots",
      },
      {
        value: "Keep soil, temperature, and container identical, change only one variable, and measure daily growth in millimeters",
        label: "Keep soil, temperature, and container identical, change only one variable, and measure daily growth in millimeters",
      },
    ],
  },
  {
    id: "q9",
    type: "single-choice",
    question: "You read a sensational claim on social media saying a common everyday food has an incredible hidden medical benefit. What is your natural reaction?",
    explanation: "Assesses empirical skepticism and evidence verification habits.",
    options: [
      {
        value: "Check whether reputable news outlets or known science communicators have verified the claim",
        label: "Check whether reputable news outlets or known science communicators have verified the claim",
      },
      {
        value: "Look for the original scientific study to inspect sample size, methodology, and whether the data actually supports the claim",
        label: "Look for the original scientific study to inspect sample size, methodology, and whether the data actually supports the claim",
      },
      {
        value: "Mention it to family or friends in casual conversation to see what they think about it",
        label: "Mention it to family or friends in casual conversation to see what they think about it",
      },
      {
        value: "Wait to see if the claim is widely accepted over time before deciding whether to believe it",
        label: "Wait to see if the claim is widely accepted over time before deciding whether to believe it",
      },
    ],
  },

  // ── 4. BUSINESS (BU) — 3 Core Questions ───────────────────────────────
  {
    id: "q10",
    type: "single-choice",
    question: "Your student club is given a fixed budget of ₹3,000 to organize an end-of-term activity for 40 students. What is your primary focus when managing the funds?",
    explanation: "Evaluates cost-benefit analysis and resource allocation instincts.",
    options: [
      {
        value: "Compare vendors, negotiate discounts, and calculate cost-per-student to deliver maximum experience within budget",
        label: "Compare vendors, negotiate discounts, and calculate cost-per-student to deliver maximum experience within budget",
      },
      {
        value: "Prioritize fun entertainment and decorations first, and adjust remaining items if funds run short",
        label: "Prioritize fun entertainment and decorations first, and adjust remaining items if funds run short",
      },
      {
        value: "Create an itemized expense ledger with a reserve buffer for unexpected last-minute costs",
        label: "Create an itemized expense ledger with a reserve buffer for unexpected last-minute costs",
      },
      {
        value: "Brainstorm memorable themes and let someone else keep track of the receipts and bills",
        label: "Brainstorm memorable themes and let someone else keep track of the receipts and bills",
      },
    ],
  },
  {
    id: "q11",
    type: "single-choice",
    question: "Your class is setting up a food or game stall for the school carnival to raise funds for charity. How do you decide what item or activity your stall should offer?",
    explanation: "Measures audience research, customer insight, and understanding real market demand.",
    options: [
      {
        value: "Pick something you and your close friends really enjoy doing or eating",
        label: "Pick something you and your close friends really enjoy doing or eating",
      },
      {
        value: "Survey students across different grades to identify what is missing from other stalls and what they are willing to spend money on",
        label: "Survey students across different grades to identify what is missing from other stalls and what they are willing to spend money on",
      },
      {
        value: "Create something elaborate and artistic that will stand out visually from every other stall",
        label: "Create something elaborate and artistic that will stand out visually from every other stall",
      },
      {
        value: "Look at what stalls made the highest profit in previous years and improve on their format",
        label: "Look at what stalls made the highest profit in previous years and improve on their format",
      },
    ],
  },
  {
    id: "q12",
    type: "single-choice",
    question: "A small handmade craft or study-aid tool you made becomes unexpectedly popular among classmates, and other sections start asking for copies. What do you think about?",
    explanation: "Tests enterprise growth thinking, scaling, and supply coordination.",
    options: [
      {
        value: "Keep it small and only make a few for your closest friends so it doesn't feel like work",
        label: "Keep it small and only make a few for your closest friends so it doesn't feel like work",
      },
      {
        value: "Pre-order raw materials in bulk to lower costs and set up a clear delivery schedule",
        label: "Pre-order raw materials in bulk to lower costs and set up a clear delivery schedule",
      },
      {
        value: "Partner with classmates to streamline production, price items properly, and expand to other sections or grades",
        label: "Partner with classmates to streamline production, price items properly, and expand to other sections or grades",
      },
      {
        value: "Focus on making each individual piece unique and handcrafted even if it takes much longer",
        label: "Focus on making each individual piece unique and handcrafted even if it takes much longer",
      },
    ],
  },

  // ── 5. CREATIVE (CR) — 3 Core Questions ───────────────────────────────
  {
    id: "q13",
    type: "single-choice",
    question: "You are designing a slide deck or physical poster for an important history or science presentation. How much attention do you naturally pay to its visual aesthetics?",
    explanation: "Assesses visual sensitivity, design balance, and typography harmony.",
    options: [
      {
        value: "Use a default template and make sure the text is readable and correctly spelled",
        label: "Use a default template and make sure the text is readable and correctly spelled",
      },
      {
        value: "Carefully select colors, font pairings, visual balance, and custom imagery so the design looks professional and cohesive",
        label: "Carefully select colors, font pairings, visual balance, and custom imagery so the design looks professional and cohesive",
      },
      {
        value: "Focus almost entirely on the factual bullet points; design matters very little as long as information is accurate",
        label: "Focus almost entirely on the factual bullet points; design matters very little as long as information is accurate",
      },
      {
        value: "Add relevant illustrations and neat headings to break up large paragraphs of text",
        label: "Add relevant illustrations and neat headings to break up large paragraphs of text",
      },
    ],
  },
  {
    id: "q14",
    type: "single-choice",
    question: "You have to present a factual topic to the whole class, such as an ancient civilization or the impact of climate change. What presentation style feels most natural to you?",
    explanation: "Captures your preference for narrative storytelling and emotional resonance.",
    options: [
      {
        value: "Use real-world examples and interactive questions to keep the audience engaged",
        label: "Use real-world examples and interactive questions to keep the audience engaged",
      },
      {
        value: "Read through clear, structured bullet points covering all required curriculum facts",
        label: "Read through clear, structured bullet points covering all required curriculum facts",
      },
      {
        value: "Frame the facts as a dramatic story with relatable characters, suspense, and emotional resonance",
        label: "Frame the facts as a dramatic story with relatable characters, suspense, and emotional resonance",
      },
      {
        value: "Present charts, timelines, and quantitative maps that clearly display the timeline of events",
        label: "Present charts, timelines, and quantitative maps that clearly display the timeline of events",
      },
    ],
  },
  {
    id: "q15",
    type: "single-choice",
    question: "Your teacher gives an open-ended essay prompt: 'Imagine society 50 years in the future.' What kind of concept are you most excited to explore?",
    explanation: "Explores divergent ideation and unconventional world-building.",
    options: [
      {
        value: "Explore how today's emerging gadgets and transport will evolve into everyday appliances",
        label: "Explore how today's emerging gadgets and transport will evolve into everyday appliances",
      },
      {
        value: "Research current statistical forecasts and write a grounded, realistic summary of expected changes",
        label: "Research current statistical forecasts and write a grounded, realistic summary of expected changes",
      },
      {
        value: "Invent a completely novel cultural custom, architecture style, or artistic movement that doesn't exist today",
        label: "Invent a completely novel cultural custom, architecture style, or artistic movement that doesn't exist today",
      },
      {
        value: "Focus on the political governance structures and legal policies that will be needed",
        label: "Focus on the political governance structures and legal policies that will be needed",
      },
    ],
  },

  // ── 6. SOCIAL (SO) — 3 Core Questions ─────────────────────────────────
  {
    id: "q16",
    type: "single-choice",
    question: "A teammate in your project group has become unusually quiet and isn't participating in group discussions. What is your natural impulse?",
    explanation: "Measures emotional attunement, active listening, and interpersonal empathy.",
    options: [
      {
        value: "Focus on your own assigned portion of the work so the project doesn't fall behind",
        label: "Focus on your own assigned portion of the work so the project doesn't fall behind",
      },
      {
        value: "Reach out to them privately after the meeting to see if they're doing okay and listen to what's on their mind",
        label: "Reach out to them privately after the meeting to see if they're doing okay and listen to what's on their mind",
      },
      {
        value: "Mention to the group that everyone needs to speak up equally so the work is distributed fairly",
        label: "Mention to the group that everyone needs to speak up equally so the work is distributed fairly",
      },
      {
        value: "Offer to share your notes or pair up on a task so they don't feel overwhelmed by themselves",
        label: "Offer to share your notes or pair up on a task so they don't feel overwhelmed by themselves",
      },
    ],
  },
  {
    id: "q17",
    type: "single-choice",
    question: "Two of your close peers strongly disagree on how to divide project credit or choose a direction for an assignment. What role do you naturally find yourself playing?",
    explanation: "Evaluates conflict mediation and interpersonal harmony skills.",
    options: [
      {
        value: "Suggest a fair compromise where both sides get a portion of what they want",
        label: "Suggest a fair compromise where both sides get a portion of what they want",
      },
      {
        value: "Step back and let them figure it out between themselves so you don't get caught in the middle",
        label: "Step back and let them figure it out between themselves so you don't get caught in the middle",
      },
      {
        value: "Help each person articulate their perspective calmly so both sides feel genuinely heard and understood",
        label: "Help each person articulate their perspective calmly so both sides feel genuinely heard and understood",
      },
      {
        value: "Vote for whichever idea has stronger objective merits so the group can move forward quickly",
        label: "Vote for whichever idea has stronger objective merits so the group can move forward quickly",
      },
    ],
  },
  {
    id: "q18",
    type: "single-choice",
    question: "You have a free afternoon during a school community development day. Which activity would leave you with the deepest sense of satisfaction?",
    explanation: "Captures your service orientation and joy in helping others flourish.",
    options: [
      {
        value: "Organizing the library books or lab equipment so the school spaces are orderly",
        label: "Organizing the library books or lab equipment so the school spaces are orderly",
      },
      {
        value: "Helping a younger student who is struggling with basic reading or math understand a difficult concept",
        label: "Helping a younger student who is struggling with basic reading or math understand a difficult concept",
      },
      {
        value: "Working independently on your own personal project or study goals in a quiet room",
        label: "Working independently on your own personal project or study goals in a quiet room",
      },
      {
        value: "Participating in a collaborative campus cleanup drive with a team of classmates",
        label: "Participating in a collaborative campus cleanup drive with a team of classmates",
      },
    ],
  },

  // ── 7. LEADERSHIP (LE) — 3 Core Questions ─────────────────────────────
  {
    id: "q19",
    type: "single-choice",
    question: "Your project team is sitting in a meeting for 15 minutes, but nobody is speaking up or knowing where to begin. What do you usually do?",
    explanation: "Assesses proactive initiative and setting direction during ambiguous situations.",
    options: [
      {
        value: "Quietly start brainstorming your own ideas on paper while waiting for someone to take charge",
        label: "Quietly start brainstorming your own ideas on paper while waiting for someone to take charge",
      },
      {
        value: "Speak up, summarize the goal, suggest an initial starting step, and invite others to build on it",
        label: "Speak up, summarize the goal, suggest an initial starting step, and invite others to build on it",
      },
      {
        value: "Wait patiently for the teacher or supervisor to come by and clarify the instructions",
        label: "Wait patiently for the teacher or supervisor to come by and clarify the instructions",
      },
      {
        value: "Ask an open question to the group to see if anyone has a preference on how to proceed",
        label: "Ask an open question to the group to see if anyone has a preference on how to proceed",
      },
    ],
  },
  {
    id: "q20",
    type: "single-choice",
    question: "Your class has to organize a school celebration or welcoming event, and there are many different jobs to be done. How do you prefer to distribute tasks?",
    explanation: "Measures talent mobilization and empowering team delegation.",
    options: [
      {
        value: "Find out what each person enjoys and is best at, and assign roles that play to their individual strengths",
        label: "Find out what each person enjoys and is best at, and assign roles that play to their individual strengths",
      },
      {
        value: "Write down all tasks on slips of paper and draw names randomly so no one feels favored",
        label: "Write down all tasks on slips of paper and draw names randomly so no one feels favored",
      },
      {
        value: "Ask for volunteers for each task and step in to take whatever difficult jobs remain unassigned",
        label: "Ask for volunteers for each task and step in to take whatever difficult jobs remain unassigned",
      },
      {
        value: "Let everyone grab whatever task they want and work on whatever you feel like doing",
        label: "Let everyone grab whatever task they want and work on whatever you feel like doing",
      },
    ],
  },
  {
    id: "q21",
    type: "single-choice",
    question: "A critical piece of equipment or display material fails just a few hours before a major school showcase presentation. What is your reaction?",
    explanation: "Evaluates composure, decisiveness, and accountability under sudden pressure.",
    options: [
      {
        value: "Feel stressed and wait for someone with more authority to tell you what to do",
        label: "Feel stressed and wait for someone with more authority to tell you what to do",
      },
      {
        value: "Look for a quick substitute material that is already available nearby",
        label: "Look for a quick substitute material that is already available nearby",
      },
      {
        value: "Gather the team calmly, make a swift decision on an alternative backup plan, and reassign tasks to meet the deadline",
        label: "Gather the team calmly, make a swift decision on an alternative backup plan, and reassign tasks to meet the deadline",
      },
      {
        value: "Figure out why the equipment failed so the error isn't repeated in the future",
        label: "Figure out why the equipment failed so the error isn't repeated in the future",
      },
    ],
  },

  // ── 8. EXPLORATION (EX) — 3 Core Questions ────────────────────────────
  {
    id: "q22",
    type: "single-choice",
    question: "You have an hour of free internet time in the school computer lab after finishing your classwork early. What kind of content do you find yourself clicking on?",
    explanation: "Tests intellectual breadth and curiosity toward unfamiliar frontiers.",
    options: [
      {
        value: "Watching a tutorial or video about a skill or sport you are currently trying to improve",
        label: "Watching a tutorial or video about a skill or sport you are currently trying to improve",
      },
      {
        value: "Checking your usual favorite gaming or entertainment channels that you watch every day",
        label: "Checking your usual favorite gaming or entertainment channels that you watch every day",
      },
      {
        value: "Reading or watching a documentary about a culture, planet, historical event, or technology you know almost nothing about",
        label: "Reading or watching a documentary about a culture, planet, historical event, or technology you know almost nothing about",
      },
      {
        value: "Reading updates and news about topics you are already familiar with",
        label: "Reading updates and news about topics you are already familiar with",
      },
    ],
  },
  {
    id: "q23",
    type: "single-choice",
    question: "You are invited to participate in a weekend inter-school workshop held at another campus where you do not know any of the other students. How do you feel?",
    explanation: "Assesses adaptability and excitement in novel, unfamiliar environments.",
    options: [
      {
        value: "A bit hesitant at first, but comfortable once I find one person to sit with",
        label: "A bit hesitant at first, but comfortable once I find one person to sit with",
      },
      {
        value: "Excited by the novelty—I look forward to discovering a new place and hearing fresh perspectives",
        label: "Excited by the novelty—I look forward to discovering a new place and hearing fresh perspectives",
      },
      {
        value: "Prefer sticking to familiar environments where I already know the routines and expectations",
        label: "Prefer sticking to familiar environments where I already know the routines and expectations",
      },
      {
        value: "Curious about the workshop topic itself and ready to dive into the activities regardless of who is there",
        label: "Curious about the workshop topic itself and ready to dive into the activities regardless of who is there",
      },
    ],
  },
  {
    id: "q24",
    type: "single-choice",
    question: "When learning about an intriguing topic in school (like historical trade routes or animal migration), what kind of connections do you naturally make?",
    explanation: "Measures cross-disciplinary synthesis and connecting divergent fields.",
    options: [
      {
        value: "Focus strictly on memorizing the specific facts and definitions that will be tested on the exam",
        label: "Focus strictly on memorizing the specific facts and definitions that will be tested on the exam",
      },
      {
        value: "Wonder how this connects to completely different fields—like how trade shaped culinary recipes, music, or language",
        label: "Wonder how this connects to completely different fields—like how trade shaped culinary recipes, music, or language",
      },
      {
        value: "Compare it to another chapter or subject you studied recently to see similarities in patterns",
        label: "Compare it to another chapter or subject you studied recently to see similarities in patterns",
      },
      {
        value: "Think about how this concept applies directly to your own city or daily routine",
        label: "Think about how this concept applies directly to your own city or daily routine",
      },
    ],
  },

  // ── 9. DIFFERENTIATION SCENARIOS — 4 Scenario Questions ───────────────
  {
    id: "q25",
    type: "single-choice",
    question: "Scenario 1: Your school is hosting an annual public exhibition. Your team is given an empty booth and 3 days to build a standout visitor experience. Which core role do you choose?",
    explanation: "Differentiates hands-on engineering, creative direction, operational management, and leadership coordination.",
    options: [
      {
        value: "Build the interactive working demonstration—assembling hardware, wiring components, or coding the digital display",
        label: "Build the interactive working demonstration—assembling hardware, wiring components, or coding the digital display",
      },
      {
        value: "Design the creative identity—painting banners, curating the visual theme, and crafting visitor storytelling boards",
        label: "Design the creative identity—painting banners, curating the visual theme, and crafting visitor storytelling boards",
      },
      {
        value: "Manage the booth operations—tracking the materials budget, calculating visitor throughput, and promoting the booth to maximize turnout",
        label: "Manage the booth operations—tracking the materials budget, calculating visitor throughput, and promoting the booth to maximize turnout",
      },
      {
        value: "Coordinate team roles, facilitate daily check-ins, keep energy high, and troubleshoot unexpected roadblocks on event day",
        label: "Coordinate team roles, facilitate daily check-ins, keep energy high, and troubleshoot unexpected roadblocks on event day",
      },
    ],
  },
  {
    id: "q26",
    type: "single-choice",
    question: "Scenario 2: Your school cafeteria generates massive single-use plastic and food waste each week. If you were invited to spearhead a solution, which angle excites you most?",
    explanation: "Differentiates data modeling, peer-led social campaigns, biological research, and global policy innovation.",
    options: [
      {
        value: "Conduct a systematic waste audit—weighing discards by category, charting peak hours, and building an automated tracking sheet",
        label: "Conduct a systematic waste audit—weighing discards by category, charting peak hours, and building an automated tracking sheet",
      },
      {
        value: "Run an engaging peer-led awareness initiative—organizing classroom discussions, student interviews, and visual story campaigns that inspire real habit change",
        label: "Run an engaging peer-led awareness initiative—organizing classroom discussions, student interviews, and visual story campaigns that inspire real habit change",
      },
      {
        value: "Experiment with biological recycling solutions—testing cafeteria composting methods and analyzing soil decomposition rates with the biology lab",
        label: "Experiment with biological recycling solutions—testing cafeteria composting methods and analyzing soil decomposition rates with the biology lab",
      },
      {
        value: "Research zero-waste models used in schools worldwide and pitch a proposal to school leadership for bulk reusable food containers",
        label: "Research zero-waste models used in schools worldwide and pitch a proposal to school leadership for bulk reusable food containers",
      },
    ],
  },
  {
    id: "q27",
    type: "single-choice",
    question: "Scenario 3: You have a long weekend with complete freedom to work on any self-directed project for an upcoming school showcase. What do you dedicate two full days to?",
    explanation: "Differentiates empirical scientific inquiry, technical prototyping, micro-venture economics, and creative arts.",
    options: [
      {
        value: "Designing and running a home science experiment on water filtration, plant genetics, or aerodynamics, documenting every observation",
        label: "Designing and running a home science experiment on water filtration, plant genetics, or aerodynamics, documenting every observation",
      },
      {
        value: "Coding a useful mini-game or productivity web tool, or assembling a mechanical device from recycled electronic parts",
        label: "Coding a useful mini-game or productivity web tool, or assembling a mechanical device from recycled electronic parts",
      },
      {
        value: "Creating a student guide to saving and investing, or organizing a micro-fundraiser selling custom study planners to peers",
        label: "Creating a student guide to saving and investing, or organizing a micro-fundraiser selling custom study planners to peers",
      },
      {
        value: "Writing and illustrating an original speculative fiction comic, producing a short musical piece, or creating a digital concept art series",
        label: "Writing and illustrating an original speculative fiction comic, producing a short musical piece, or creating a digital concept art series",
      },
    ],
  },
  {
    id: "q28",
    type: "single-choice",
    question: "Scenario 4: Exactly 24 hours remain before your team presents your capstone project to a panel of evaluators. Time is short. How do you advise the team to spend the final 24 hours?",
    explanation: "Differentiates rigorous quality verification, delivery coaching, team empathy/support, and bold differentiation.",
    options: [
      {
        value: "Stress-test all data tables, check calculations, and eliminate any logical inconsistencies or weak arguments in the report",
        label: "Stress-test all data tables, check calculations, and eliminate any logical inconsistencies or weak arguments in the report",
      },
      {
        value: "Rehearse the live presentation with strict timing, make sure every speaker is confident, and sharpen how the practical value is conveyed to the judges",
        label: "Rehearse the live presentation with strict timing, make sure every speaker is confident, and sharpen how the practical value is conveyed to the judges",
      },
      {
        value: "Check in with teammates who are stressed or falling behind, redistribute the final slide-review duties, and ensure the team presents a united front",
        label: "Check in with teammates who are stressed or falling behind, redistribute the final slide-review duties, and ensure the team presents a united front",
      },
      {
        value: "Add a bold, surprising live demonstration or creative interactive element that will make the judges remember your project above all others",
        label: "Add a bold, surprising live demonstration or creative interactive element that will make the judges remember your project above all others",
      },
    ],
  },
];
