import type { CareerDetail } from "../types";

export const aiMlDataScience: CareerDetail = {
  slug: "ai-ml-data-science",
  careerName: "Artificial Intelligence & Data",
  title: "Artificial Intelligence & Data",
  tagline: "Develop intelligent systems that learn from data and automate decisions.",
  category: "Technology & Research",
  icon: "Brain",
  primaryTraits: ["TE", "SC", "AN"],
  relatedSlugs: ["software-development", "scientific-research", "engineering"],

  snapshot: [
    { label: "What You Do", value: "Build predictive models, analyze datasets, design neural networks, and create systems that learn and improve from data.", icon: "BrainCircuit" },
    { label: "Entry-Level Roles", value: "Data Analyst, Junior Data Scientist, ML Engineer Intern, Research Assistant, AI Associate", icon: "Briefcase" },
    { label: "Industries", value: "Tech, healthcare, finance, autonomous vehicles, e-commerce, research labs, government", icon: "Building2" },
    { label: "Work Environment", value: "Office or remote, research-oriented teams, experimentation cycles, Jupyter notebooks, GPU clusters", icon: "Monitor" },
    { label: "Difficulty to Enter", value: "High — requires strong math foundation (statistics, linear algebra) plus programming skills", icon: "Signal" },
    { label: "Growth Potential", value: "Exceptional — AI is transforming every industry with very high demand for skilled practitioners", icon: "TrendingUp" },
  ],

  skills: [
    { id: "math-stats", name: "Mathematics & Statistics", category: "Foundation", relevantTraits: ["AN", "SC"], whyItMatters: "ML is built on math. Understanding statistics, probability, and linear algebra is essential to understanding how models work.", whatToKnow: "Descriptive statistics, probability distributions, hypothesis testing, linear algebra (vectors, matrices), calculus basics.", recommendedLevel: "Comfortable with Class 12 math + basic statistics" },
    { id: "python-ml", name: "Python for Data Science", category: "Foundation", relevantTraits: ["TE", "AN"], whyItMatters: "Python is the dominant language in AI/ML. Libraries like NumPy, Pandas, and scikit-learn are industry standard.", whatToKnow: "Python programming, NumPy arrays, Pandas DataFrames, data cleaning, Matplotlib/Seaborn for visualization.", recommendedLevel: "Analyze and visualize a dataset independently" },
    { id: "ml-fundamentals", name: "Machine Learning Fundamentals", category: "Core", relevantTraits: ["SC", "AN"], whyItMatters: "Understanding core ML algorithms is the foundation of the field — from linear regression to decision trees and neural networks.", whatToKnow: "Supervised vs unsupervised learning, regression, classification, clustering, model evaluation metrics, overfitting/underfitting.", recommendedLevel: "Train and evaluate models on standard datasets" },
    { id: "deep-learning", name: "Deep Learning & Neural Networks", category: "Advanced", relevantTraits: ["SC", "TE", "AN"], whyItMatters: "Deep learning powers modern AI — from image recognition to natural language processing and generative AI.", whatToKnow: "Neural network architecture, CNNs, RNNs/LSTMs, transformers, backpropagation, PyTorch or TensorFlow.", recommendedLevel: "Build and train a neural network for a real task" },
    { id: "data-eng", name: "Data Engineering & SQL", category: "Tools", relevantTraits: ["TE"], whyItMatters: "Real-world ML starts with real-world data. You need to collect, clean, store, and query large datasets.", whatToKnow: "SQL queries, data pipelines, ETL basics, data warehousing concepts, working with APIs for data collection.", recommendedLevel: "Write complex SQL queries and build a data pipeline" },
    { id: "mlops", name: "MLOps & Model Deployment", category: "Operations", relevantTraits: ["TE", "EX"], whyItMatters: "A model is only useful when deployed. MLOps covers the lifecycle of ML models in production.", whatToKnow: "Model serialization, REST API serving, Docker, monitoring model performance, A/B testing, cloud ML services.", recommendedLevel: "Deploy a trained model as an API endpoint" },
  ],

  roadmap: [
    { id: "ai-phase-1", phase: 1, title: "Math & Programming Foundations", description: "Build the mathematical intuition and Python skills that underpin all of AI/ML.", estimatedDuration: "3–4 weeks", skills: ["Mathematics & Statistics", "Python for Data Science"], learn: ["Statistics fundamentals", "Linear algebra essentials", "Python programming", "NumPy and Pandas basics", "Data visualization with Matplotlib"], practice: ["Complete Khan Academy statistics module", "Analyze 3 datasets using Pandas"], build: "An exploratory data analysis project on a public dataset (e.g., your school's exam results)", resources: [
      { name: "Khan Academy — Statistics & Probability", type: "course", difficulty: "beginner", estimatedTime: "3 weeks", url: "https://www.khanacademy.org/math/statistics-probability" },
      { name: "Python for Data Science (Kaggle Learn)", type: "course", difficulty: "beginner", estimatedTime: "5 hours", url: "https://www.kaggle.com/learn/python" },
      { name: "3Blue1Brown — Essence of Linear Algebra", type: "video", difficulty: "beginner", estimatedTime: "3 hours", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab" },
    ]},
    { id: "ai-phase-2", phase: 2, title: "Core Machine Learning", description: "Learn the fundamental ML algorithms and how to apply them to real problems.", estimatedDuration: "4–6 weeks", skills: ["Machine Learning Fundamentals"], learn: ["Linear & logistic regression", "Decision trees & random forests", "K-nearest neighbors", "Support vector machines", "Model evaluation & cross-validation", "Feature engineering"], practice: ["Complete 5 Kaggle beginner competitions", "Build models for classification and regression"], build: "A predictive model (e.g., house price predictor or student performance classifier)", resources: [
      { name: "Andrew Ng — Machine Learning Specialization", type: "course", difficulty: "intermediate", estimatedTime: "8 weeks", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { name: "Kaggle Intro to Machine Learning", type: "course", difficulty: "beginner", estimatedTime: "3 hours", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
      { name: "Hands-On ML with Scikit-Learn (book)", type: "book", difficulty: "intermediate", estimatedTime: "6 weeks", url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125974/" },
    ]},
    { id: "ai-phase-3", phase: 3, title: "Deep Learning & Neural Networks", description: "Dive into neural networks, CNNs, and transformers that power modern AI.", estimatedDuration: "4–6 weeks", skills: ["Deep Learning & Neural Networks"], learn: ["Neural network fundamentals", "CNNs for image tasks", "RNNs and sequence models", "Attention mechanisms & transformers", "Transfer learning", "PyTorch or TensorFlow"], practice: ["Implement 5 neural network architectures from scratch", "Fine-tune a pre-trained model"], build: "An image classifier or text sentiment analyzer using deep learning", resources: [
      { name: "Fast.ai — Practical Deep Learning", type: "course", difficulty: "intermediate", estimatedTime: "7 weeks", url: "https://course.fast.ai/" },
      { name: "PyTorch Official Tutorials", type: "documentation", difficulty: "intermediate", estimatedTime: "2 weeks", url: "https://pytorch.org/tutorials/" },
      { name: "Deep Learning by Ian Goodfellow (book)", type: "book", difficulty: "advanced", estimatedTime: "8 weeks", url: "https://www.deeplearningbook.org/" },
    ]},
    { id: "ai-phase-4", phase: 4, title: "Data Engineering & MLOps", description: "Learn to work with real-world data at scale and deploy models to production.", estimatedDuration: "3–4 weeks", skills: ["Data Engineering & SQL", "MLOps & Model Deployment"], learn: ["SQL for data analysis", "Data pipeline design", "Model serialization (pickle, ONNX)", "REST API for model serving", "Docker basics", "Cloud ML services (AWS SageMaker, GCP Vertex AI)"], practice: ["Build an end-to-end ML pipeline", "Deploy a model as a web API"], build: "A deployed ML application with a web interface (e.g., recommendation system)", resources: [
      { name: "Made With ML — MLOps Course", type: "course", difficulty: "intermediate", estimatedTime: "4 weeks", url: "https://madewithml.com/" },
      { name: "SQLBolt Interactive Tutorial", type: "practice", difficulty: "beginner", estimatedTime: "4 hours", url: "https://sqlbolt.com/" },
      { name: "Docker for Data Scientists", type: "video", difficulty: "intermediate", estimatedTime: "2 hours", url: "https://www.youtube.com/watch?v=0qG_0CPQhpg" },
    ]},
  ],

  projects: [
    { title: "Exploratory Data Analysis Dashboard", difficulty: "beginner", skills: ["Python", "Pandas", "Visualization"], description: "Analyze a public dataset and create an interactive visualization dashboard that reveals insights.", features: ["Data cleaning pipeline", "Statistical summaries", "Interactive charts", "Key insights report", "Export as HTML"], portfolioValue: "Shows you can work with real data, find patterns, and communicate findings clearly." },
    { title: "Movie Recommendation Engine", difficulty: "intermediate", skills: ["ML Algorithms", "Collaborative Filtering", "APIs"], description: "Build a recommendation system that suggests movies based on user preferences and viewing history.", features: ["Content-based and collaborative filtering", "User preference input", "API integration for movie data", "Web interface", "Model evaluation metrics"], portfolioValue: "Demonstrates core ML concepts applied to a well-understood problem that interviewers recognize." },
    { title: "Real-Time Object Detection App", difficulty: "advanced", skills: ["Deep Learning", "Computer Vision", "Deployment"], description: "Build an application that detects and classifies objects in real-time using a webcam or uploaded images.", features: ["Pre-trained model fine-tuning", "Real-time video processing", "Bounding box visualization", "Multi-class detection", "Web deployment with live demo"], portfolioValue: "A visually impressive project that showcases deep learning, computer vision, and deployment skills." },
  ],

  progression: [
    { title: "Data Analyst / Research Intern", yearsRange: "0–1 year", responsibilities: ["Clean and explore datasets", "Create visualizations and reports", "Assist senior researchers", "Learn domain knowledge"], skills: ["Python", "SQL", "Statistics", "Communication"], deltaFromPrevious: "Entry point — learning to work with data professionally." },
    { title: "Junior Data Scientist", yearsRange: "1–3 years", responsibilities: ["Build and evaluate ML models", "Feature engineering", "A/B test analysis", "Present findings to stakeholders"], skills: ["ML algorithms", "Statistical modeling", "Experiment design"], deltaFromPrevious: "Shift from analysis to building predictive models." },
    { title: "Data Scientist / ML Engineer", yearsRange: "3–5 years", responsibilities: ["Design ML pipelines", "Deploy models to production", "Optimize model performance", "Mentor junior team members"], skills: ["Deep learning", "MLOps", "System design", "Technical leadership"], deltaFromPrevious: "Own the full lifecycle from data to deployed model." },
    { title: "Senior Data Scientist", yearsRange: "5–8 years", responsibilities: ["Lead research initiatives", "Define ML strategy", "Drive cross-team projects", "Evaluate new techniques"], skills: ["Research methodology", "Advanced ML", "Strategic thinking", "Domain expertise"], deltaFromPrevious: "Transition from execution to defining what to build and why." },
    { title: "Principal Scientist / ML Architect", yearsRange: "8+ years", responsibilities: ["Set technical direction for AI/ML org", "Publish research", "Build ML platforms", "Advise on AI strategy"], skills: ["Org-level architecture", "Research leadership", "Industry vision"], deltaFromPrevious: "Shape the AI direction for the entire organization or industry." },
  ],

  preparation: [
    { id: "ai-prep-1", category: "GitHub", task: "Build a data science portfolio on GitHub", details: "Include Jupyter notebooks with clear explanations, clean code, and visualizations." },
    { id: "ai-prep-2", category: "Kaggle", task: "Complete 3+ Kaggle competitions", details: "Start with beginner competitions, write detailed solution notebooks, aim for top 50%." },
    { id: "ai-prep-3", category: "Math", task: "Solidify math foundations", details: "Complete Khan Academy statistics + 3Blue1Brown linear algebra. Be comfortable with derivatives and matrices." },
    { id: "ai-prep-4", category: "Portfolio", task: "Build 2 end-to-end ML projects", details: "From data collection to deployed model. Include clear README with results and methodology." },
    { id: "ai-prep-5", category: "Resume", task: "Create a data science resume", details: "Highlight projects, tools (Python, SQL, PyTorch), and quantified results. Keep to one page." },
    { id: "ai-prep-6", category: "Interview", task: "Practice ML interview questions", details: "Review bias-variance tradeoff, regularization, model selection, and case study questions." },
    { id: "ai-prep-7", category: "Internship", task: "Apply to ML/data internships", details: "Target research labs, AI startups, and data teams at larger companies. Apply to 10+ positions." },
  ],
};
