"""
Career cluster definitions for the V1 (Class 10) scoring engine.

Each cluster has:
  - A human-readable name
  - Trait weights that determine how strongly each dimension contributes
    to the cluster's match score
  - A short description
  - Skill gaps typical for a Class 10 student entering this field
  - Concrete next steps a Class 10 student can take right now
"""

from __future__ import annotations

from dataclasses import dataclass, field


@dataclass(frozen=True)
class CareerCluster:
    name: str
    trait_weights: dict[str, float]       # Trait code → relative weight
    description: str
    skill_gaps: list[str]                 # Typical gaps for a Class 10 student
    next_steps: list[str]                 # Actionable advice


# ── 12 Career Clusters ───────────────────────────────────────────────

CAREER_CLUSTERS: list[CareerCluster] = [
    # 1. Software / App Development
    CareerCluster(
        name="Software / App Development",
        trait_weights={"TE": 0.55, "AN": 0.45},
        description=(
            "Build applications, websites, and digital tools that power "
            "everyday life — from mobile apps to cloud platforms."
        ),
        skill_gaps=[
            "Programming fundamentals (variables, loops, functions)",
            "Version control (Git/GitHub basics)",
            "Problem-solving with data structures",
        ],
        next_steps=[
            "Start learning Python or JavaScript through free platforms like freeCodeCamp or Codecademy.",
            "Build a small personal project — a calculator, to-do app, or portfolio website.",
            "Join your school's coding club or participate in a hackathon.",
        ],
    ),

    # 2. AI / ML / Data
    CareerCluster(
        name="AI / Machine Learning / Data Science",
        trait_weights={"TE": 0.35, "SC": 0.35, "AN": 0.30},
        description=(
            "Develop intelligent systems that learn from data — from "
            "recommendation engines to self-driving technology."
        ),
        skill_gaps=[
            "Strong mathematics foundation (statistics, linear algebra)",
            "Python programming and data libraries",
            "Understanding of how algorithms learn from data",
        ],
        next_steps=[
            "Strengthen your Class 10 math — especially statistics and algebra.",
            "Explore beginner AI/ML courses on Kaggle Learn or Google's AI Experiments.",
            "Try a simple data project: analyze your school's exam results in a spreadsheet.",
        ],
    ),

    # 3. Engineering
    CareerCluster(
        name="Engineering",
        trait_weights={"AN": 0.35, "TE": 0.35, "SC": 0.30},
        description=(
            "Design, build, and optimize systems — from civil structures "
            "and electronics to aerospace and robotics."
        ),
        skill_gaps=[
            "Advanced mathematics (calculus, trigonometry)",
            "Physics concepts (mechanics, electricity)",
            "Technical drawing and spatial reasoning",
        ],
        next_steps=[
            "Choose Science (PCM) in Class 11 and focus on Physics and Mathematics.",
            "Start preparing for engineering entrance exams (JEE) early.",
            "Build small DIY projects — circuits, model bridges, or Arduino kits.",
        ],
    ),

    # 4. Medicine / Healthcare
    CareerCluster(
        name="Medicine / Healthcare",
        trait_weights={"SC": 0.50, "SO": 0.50},
        description=(
            "Diagnose, treat, and care for patients — from general medicine "
            "and surgery to psychology and public health."
        ),
        skill_gaps=[
            "Biology fundamentals (human anatomy, cell biology)",
            "Chemistry (organic chemistry basics)",
            "Empathy and patient communication skills",
        ],
        next_steps=[
            "Choose Science (PCB) in Class 11 with a strong focus on Biology.",
            "Start learning about the NEET exam syllabus and preparation strategy.",
            "Volunteer at a local hospital or health camp to gain exposure.",
        ],
    ),

    # 5. Scientific Research
    CareerCluster(
        name="Scientific Research",
        trait_weights={"SC": 0.55, "AN": 0.45},
        description=(
            "Push the boundaries of human knowledge through experimentation, "
            "observation, and analysis in any branch of science."
        ),
        skill_gaps=[
            "Scientific method and experimental design",
            "Data analysis and interpretation",
            "Academic writing and research paper reading",
        ],
        next_steps=[
            "Participate in science fairs and Olympiads (NTSE, Science Olympiad).",
            "Read popular science books or channels to build curiosity (Veritasium, Kurzgesagt).",
            "Choose Science in Class 11 and aim for research-oriented programs (IISER, IISc).",
        ],
    ),

    # 6. Finance / Investment
    CareerCluster(
        name="Finance / Investment Banking",
        trait_weights={"BU": 0.55, "AN": 0.45},
        description=(
            "Manage money, assess risk, and grow wealth — from stock markets "
            "and banking to financial planning and fintech."
        ),
        skill_gaps=[
            "Financial literacy (interest, compounding, budgeting)",
            "Excel/spreadsheet skills",
            "Basic accounting principles",
        ],
        next_steps=[
            "Choose Commerce in Class 11 with Mathematics as an elective.",
            "Start following financial news and learn stock market basics.",
            "Practice mental math and learn to use spreadsheets for calculations.",
        ],
    ),

    # 7. Entrepreneurship
    CareerCluster(
        name="Entrepreneurship",
        trait_weights={"BU": 0.50, "LE": 0.50},
        description=(
            "Launch and grow your own ventures — turning ideas into products, "
            "building teams, and creating value in the market."
        ),
        skill_gaps=[
            "Business model thinking",
            "Basic marketing and sales concepts",
            "Team management and delegation",
        ],
        next_steps=[
            "Start a small side project or school business (tutoring, crafts, digital services).",
            "Read 'Zero to One' by Peter Thiel or watch Y Combinator's Startup School videos.",
            "Join or start an entrepreneurship club at school.",
        ],
    ),

    # 8. Management / Product
    CareerCluster(
        name="Management / Product Management",
        trait_weights={"LE": 0.40, "BU": 0.35, "AN": 0.25},
        description=(
            "Lead teams, manage operations, and drive product strategy — "
            "the bridge between business goals and execution."
        ),
        skill_gaps=[
            "Communication and presentation skills",
            "Basic project planning and organization",
            "Analytical thinking for decision-making",
        ],
        next_steps=[
            "Take leadership roles in school — class monitor, club president, event organizer.",
            "Learn to plan and execute a small event or project from start to finish.",
            "Choose Commerce or Science in Class 11 depending on the industry you want to manage in.",
        ],
    ),

    # 9. Marketing / Media
    CareerCluster(
        name="Marketing / Media / Communications",
        trait_weights={"CR": 0.40, "SO": 0.35, "LE": 0.25},
        description=(
            "Craft compelling stories, build brands, and connect with "
            "audiences — from digital marketing to journalism and PR."
        ),
        skill_gaps=[
            "Writing and storytelling skills",
            "Social media strategy basics",
            "Visual communication and branding concepts",
        ],
        next_steps=[
            "Start a blog, YouTube channel, or Instagram page about something you love.",
            "Join your school's magazine, newspaper, or media club.",
            "Learn basic graphic design tools like Canva or Figma.",
        ],
    ),

    # 10. Design / Creative
    CareerCluster(
        name="Design / Creative Arts",
        trait_weights={"CR": 0.60, "EX": 0.40},
        description=(
            "Create visual and experiential design — from UI/UX and graphic "
            "design to fashion, architecture, and film."
        ),
        skill_gaps=[
            "Visual design principles (color theory, typography, layout)",
            "Digital design tools (Figma, Adobe Suite)",
            "Portfolio building and creative process",
        ],
        next_steps=[
            "Start sketching, designing, or creating digital art regularly.",
            "Learn Figma or Canva and redesign something you use daily (an app, a poster).",
            "Explore design programs at NID, NIFT, or Srishti for future admission.",
        ],
    ),

    # 11. Law / Public Policy
    CareerCluster(
        name="Law / Public Policy",
        trait_weights={"SO": 0.40, "LE": 0.35, "AN": 0.25},
        description=(
            "Shape rules and justice — from courtroom advocacy and corporate "
            "law to public policy and governance."
        ),
        skill_gaps=[
            "Critical reading and logical argumentation",
            "Current affairs and constitutional awareness",
            "Debate and public speaking skills",
        ],
        next_steps=[
            "Join your school's debate or Model UN club.",
            "Start reading newspapers daily — focus on editorials and legal news.",
            "Look into 5-year integrated law programs (CLAT, AILET) and their preparation.",
        ],
    ),

    # 12. Psychology / Social Impact
    CareerCluster(
        name="Psychology / Social Impact",
        trait_weights={"SO": 0.55, "AN": 0.45},
        description=(
            "Understand human behaviour and drive social change — from "
            "clinical psychology and counselling to NGOs and social work."
        ),
        skill_gaps=[
            "Active listening and empathy skills",
            "Basic psychology concepts (human behaviour, mental health)",
            "Research and data interpretation",
        ],
        next_steps=[
            "Volunteer with an NGO or community service project.",
            "Read introductory psychology books ('Thinking, Fast and Slow', 'The Man Who Mistook His Wife for a Hat').",
            "Choose Arts or Science in Class 11 (Psychology as a subject if available).",
        ],
    ),
]
