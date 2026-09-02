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
  {
    "id": "q1",
    "type": "single-choice",
    "question": "Imagine you wake up tomorrow and money is no longer a problem. What would you spend most of your time doing?",
    "options": [
      {
        "value": "Building apps or websites",
        "label": "Building apps or websites"
      },
      {
        "value": "Creating art, music, or content",
        "label": "Creating art, music, or content"
      },
      {
        "value": "Helping people",
        "label": "Helping people"
      },
      {
        "value": "Starting a business",
        "label": "Starting a business"
      },
      {
        "value": "Exploring science or technology",
        "label": "Exploring science or technology"
      },
      {
        "value": "Traveling and discovering new places",
        "label": "Traveling and discovering new places"
      }
    ]
  },
  {
    "id": "q2",
    "type": "single-choice",
    "question": "Which activity makes you lose track of time?",
    "options": [
      {
        "value": "Solving problems",
        "label": "Solving problems"
      },
      {
        "value": "Creating something",
        "label": "Creating something"
      },
      {
        "value": "Talking with people",
        "label": "Talking with people"
      },
      {
        "value": "Playing games",
        "label": "Playing games"
      },
      {
        "value": "Learning new things",
        "label": "Learning new things"
      },
      {
        "value": "Organizing or planning",
        "label": "Organizing or planning"
      }
    ]
  },
  {
    "id": "q3",
    "type": "single-choice",
    "question": "What kind of success excites you the most?",
    "options": [
      {
        "value": "Becoming financially free",
        "label": "Becoming financially free"
      },
      {
        "value": "Making a positive impact",
        "label": "Making a positive impact"
      },
      {
        "value": "Being recognized worldwide",
        "label": "Being recognized worldwide"
      },
      {
        "value": "Loving what I do every day",
        "label": "Loving what I do every day"
      },
      {
        "value": "Building something meaningful",
        "label": "Building something meaningful"
      },
      {
        "value": "Constantly learning and growing",
        "label": "Constantly learning and growing"
      }
    ]
  },
  {
    "id": "q4",
    "type": "single-choice",
    "question": "Which compliment would make you smile the most?",
    "options": [
      {
        "value": "You're incredibly smart.",
        "label": "You're incredibly smart."
      },
      {
        "value": "You're so creative.",
        "label": "You're so creative."
      },
      {
        "value": "You're an amazing leader.",
        "label": "You're an amazing leader."
      },
      {
        "value": "You're kind and helpful.",
        "label": "You're kind and helpful."
      },
      {
        "value": "You always find solutions.",
        "label": "You always find solutions."
      },
      {
        "value": "You're inspiring.",
        "label": "You're inspiring."
      }
    ]
  },
  {
    "id": "q5",
    "type": "single-choice",
    "question": "If you had to spend an entire day in one place, where would you choose?",
    "options": [
      {
        "value": "AI & Robotics Lab",
        "label": "AI & Robotics Lab"
      },
      {
        "value": "Creative Studio",
        "label": "Creative Studio"
      },
      {
        "value": "Startup Office",
        "label": "Startup Office"
      },
      {
        "value": "Hospital",
        "label": "Hospital"
      },
      {
        "value": "Research Center",
        "label": "Research Center"
      },
      {
        "value": "Outdoor Adventure Camp",
        "label": "Outdoor Adventure Camp"
      }
    ]
  },
  {
    "id": "q6",
    "type": "single-choice",
    "question": "What motivates you the most every day?",
    "options": [
      {
        "value": "Learning new skills",
        "label": "Learning new skills"
      },
      {
        "value": "Solving difficult challenges",
        "label": "Solving difficult challenges"
      },
      {
        "value": "Earning money",
        "label": "Earning money"
      },
      {
        "value": "Helping others",
        "label": "Helping others"
      },
      {
        "value": "Creating something unique",
        "label": "Creating something unique"
      },
      {
        "value": "Becoming the best version of myself",
        "label": "Becoming the best version of myself"
      }
    ]
  },
  {
    "id": "q7",
    "type": "single-choice",
    "question": "Your friends usually come to you for...",
    "options": [
      {
        "value": "Advice",
        "label": "Advice"
      },
      {
        "value": "Tech help",
        "label": "Tech help"
      },
      {
        "value": "Funny conversations",
        "label": "Funny conversations"
      },
      {
        "value": "Creative ideas",
        "label": "Creative ideas"
      },
      {
        "value": "Planning things",
        "label": "Planning things"
      },
      {
        "value": "Solving problems",
        "label": "Solving problems"
      }
    ]
  },
  {
    "id": "q8",
    "type": "single-choice",
    "question": "Which school/college activity do you enjoy the most?",
    "options": [
      {
        "value": "Science projects",
        "label": "Science projects"
      },
      {
        "value": "Coding",
        "label": "Coding"
      },
      {
        "value": "Debates",
        "label": "Debates"
      },
      {
        "value": "Drawing or designing",
        "label": "Drawing or designing"
      },
      {
        "value": "Sports",
        "label": "Sports"
      },
      {
        "value": "Organizing events",
        "label": "Organizing events"
      }
    ]
  },
  {
    "id": "q9",
    "type": "single-choice",
    "question": "What kind of problems do you enjoy solving?",
    "options": [
      {
        "value": "Technical problems",
        "label": "Technical problems"
      },
      {
        "value": "Business problems",
        "label": "Business problems"
      },
      {
        "value": "Human problems",
        "label": "Human problems"
      },
      {
        "value": "Creative challenges",
        "label": "Creative challenges"
      },
      {
        "value": "Scientific mysteries",
        "label": "Scientific mysteries"
      },
      {
        "value": "Real-world issues",
        "label": "Real-world issues"
      }
    ]
  },
  {
    "id": "q10",
    "type": "single-choice",
    "question": "Which work environment feels perfect to you?",
    "options": [
      {
        "value": "Remote from anywhere",
        "label": "Remote from anywhere"
      },
      {
        "value": "Corporate office",
        "label": "Corporate office"
      },
      {
        "value": "Startup",
        "label": "Startup"
      },
      {
        "value": "Creative workspace",
        "label": "Creative workspace"
      },
      {
        "value": "Laboratory",
        "label": "Laboratory"
      },
      {
        "value": "Traveling frequently",
        "label": "Traveling frequently"
      }
    ]
  },
  {
    "id": "q11",
    "type": "single-choice",
    "question": "If you could instantly master ONE skill, what would it be?",
    "options": [
      {
        "value": "Coding",
        "label": "Coding"
      },
      {
        "value": "Public Speaking",
        "label": "Public Speaking"
      },
      {
        "value": "Designing",
        "label": "Designing"
      },
      {
        "value": "Business & Marketing",
        "label": "Business & Marketing"
      },
      {
        "value": "Artificial Intelligence",
        "label": "Artificial Intelligence"
      },
      {
        "value": "Medicine",
        "label": "Medicine"
      }
    ]
  },
  {
    "id": "q12",
    "type": "single-choice",
    "question": "Which statement sounds most like you?",
    "options": [
      {
        "value": "I enjoy building things.",
        "label": "I enjoy building things."
      },
      {
        "value": "I enjoy helping people.",
        "label": "I enjoy helping people."
      },
      {
        "value": "I enjoy leading people.",
        "label": "I enjoy leading people."
      },
      {
        "value": "I enjoy creating things.",
        "label": "I enjoy creating things."
      },
      {
        "value": "I enjoy discovering new ideas.",
        "label": "I enjoy discovering new ideas."
      },
      {
        "value": "I enjoy improving existing things.",
        "label": "I enjoy improving existing things."
      }
    ]
  },
  {
    "id": "q13",
    "type": "single-choice",
    "question": "Which type of YouTube videos do you watch the most?",
    "options": [
      {
        "value": "Technology",
        "label": "Technology"
      },
      {
        "value": "Finance",
        "label": "Finance"
      },
      {
        "value": "Gaming",
        "label": "Gaming"
      },
      {
        "value": "Travel",
        "label": "Travel"
      },
      {
        "value": "Educational",
        "label": "Educational"
      },
      {
        "value": "Art & Entertainment",
        "label": "Art & Entertainment"
      }
    ]
  },
  {
    "id": "q14",
    "type": "single-choice",
    "question": "If someone gave you \u20b910 crore today, what would you do first?",
    "options": [
      {
        "value": "Invest it",
        "label": "Invest it"
      },
      {
        "value": "Start a company",
        "label": "Start a company"
      },
      {
        "value": "Travel the world",
        "label": "Travel the world"
      },
      {
        "value": "Support my family",
        "label": "Support my family"
      },
      {
        "value": "Donate to a cause",
        "label": "Donate to a cause"
      },
      {
        "value": "Buy my dream gadgets",
        "label": "Buy my dream gadgets"
      }
    ]
  },
  {
    "id": "q15",
    "type": "single-choice",
    "question": "Which quality describes you best?",
    "options": [
      {
        "value": "Curious",
        "label": "Curious"
      },
      {
        "value": "Creative",
        "label": "Creative"
      },
      {
        "value": "Practical",
        "label": "Practical"
      },
      {
        "value": "Ambitious",
        "label": "Ambitious"
      },
      {
        "value": "Compassionate",
        "label": "Compassionate"
      },
      {
        "value": "Confident",
        "label": "Confident"
      }
    ]
  },
  {
    "id": "q16",
    "type": "single-choice",
    "question": "What kind of life do you dream of?",
    "options": [
      {
        "value": "Running my own company",
        "label": "Running my own company"
      },
      {
        "value": "Working in a top global company",
        "label": "Working in a top global company"
      },
      {
        "value": "Helping thousands of people",
        "label": "Helping thousands of people"
      },
      {
        "value": "Becoming famous for my talent",
        "label": "Becoming famous for my talent"
      },
      {
        "value": "Inventing something revolutionary",
        "label": "Inventing something revolutionary"
      },
      {
        "value": "Living a peaceful and balanced life",
        "label": "Living a peaceful and balanced life"
      }
    ]
  },
  {
    "id": "q17",
    "type": "single-choice",
    "question": "Which challenge sounds exciting instead of scary?",
    "options": [
      {
        "value": "Speaking in front of 1,000 people",
        "label": "Speaking in front of 1,000 people"
      },
      {
        "value": "Building an app from scratch",
        "label": "Building an app from scratch"
      },
      {
        "value": "Starting a business",
        "label": "Starting a business"
      },
      {
        "value": "Leading a team",
        "label": "Leading a team"
      },
      {
        "value": "Solving a global problem",
        "label": "Solving a global problem"
      },
      {
        "value": "Creating a viral project",
        "label": "Creating a viral project"
      }
    ]
  },
  {
    "id": "q18",
    "type": "single-choice",
    "question": "What matters the MOST when choosing a career?",
    "options": [
      {
        "value": "High salary",
        "label": "High salary"
      },
      {
        "value": "Job satisfaction",
        "label": "Job satisfaction"
      },
      {
        "value": "Flexibility",
        "label": "Flexibility"
      },
      {
        "value": "Respect",
        "label": "Respect"
      },
      {
        "value": "Work-life balance",
        "label": "Work-life balance"
      },
      {
        "value": "Opportunity to grow",
        "label": "Opportunity to grow"
      }
    ]
  },
  {
    "id": "q19",
    "type": "single-choice",
    "question": "Imagine you're 35 years old. What achievement would make you feel truly proud?",
    "options": [
      {
        "value": "Owning a successful company",
        "label": "Owning a successful company"
      },
      {
        "value": "Becoming an expert in my field",
        "label": "Becoming an expert in my field"
      },
      {
        "value": "Changing people's lives",
        "label": "Changing people's lives"
      },
      {
        "value": "Inventing something useful",
        "label": "Inventing something useful"
      },
      {
        "value": "Building financial freedom",
        "label": "Building financial freedom"
      },
      {
        "value": "Creating something remembered for years",
        "label": "Creating something remembered for years"
      }
    ]
  },
  {
    "id": "q20",
    "type": "single-choice",
    "question": "\"At the end of my career, I want people to remember me because...\"",
    "options": [
      {
        "value": "I made life better for others.",
        "label": "I made life better for others."
      },
      {
        "value": "I built something incredible.",
        "label": "I built something incredible."
      },
      {
        "value": "I inspired millions.",
        "label": "I inspired millions."
      },
      {
        "value": "I solved important problems.",
        "label": "I solved important problems."
      },
      {
        "value": "I created unforgettable experiences.",
        "label": "I created unforgettable experiences."
      },
      {
        "value": "I never stopped learning and growing.",
        "label": "I never stopped learning and growing."
      }
    ]
  }
];
