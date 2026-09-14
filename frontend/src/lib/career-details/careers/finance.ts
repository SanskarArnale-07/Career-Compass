import type { CareerDetail } from "../types";

export const financeInvestment: CareerDetail = {
  slug: "finance-investment",
  careerName: "Finance / Investment Banking",
  title: "Finance & Investment Professional",
  tagline: "Manage money, assess risk, and grow wealth across markets and institutions.",
  category: "Business & Finance",
  icon: "DollarSign",
  primaryTraits: ["BU", "AN"],
  relatedSlugs: ["entrepreneurship", "management-product", "ai-ml-data-science"],

  snapshot: [
    { label: "What You Do", value: "Analyze markets, build financial models, manage portfolios, advise on investments, and drive financial strategy.", icon: "LineChart" },
    { label: "Entry-Level Roles", value: "Financial Analyst, Investment Banking Analyst, Equity Research Associate, Risk Analyst, Auditor", icon: "Briefcase" },
    { label: "Industries", value: "Banking, asset management, insurance, fintech, consulting, private equity, venture capital", icon: "Building2" },
    { label: "Work Environment", value: "Corporate offices, trading floors, high-pressure deadlines, long hours in banking, remote in fintech", icon: "Monitor" },
    { label: "Difficulty to Enter", value: "High — competitive field requiring strong academic record, certifications (CFA/CA), and networking", icon: "Signal" },
    { label: "Growth Potential", value: "Very high — finance offers some of the highest compensation in any profession, especially in IB/PE", icon: "TrendingUp" },
  ],

  skills: [
    { id: "financial-literacy", name: "Financial Literacy", category: "Foundation", relevantTraits: ["BU"], whyItMatters: "Understanding how money works — interest, compounding, inflation, and basic accounting — is the starting point of any finance career.", whatToKnow: "Time value of money, compound interest, income statements, balance sheets, cash flow statements.", recommendedLevel: "Read and interpret basic financial statements" },
    { id: "excel-modeling", name: "Excel & Financial Modeling", category: "Tools", relevantTraits: ["AN", "TE"], whyItMatters: "Excel is the backbone of finance. Financial models are used for valuations, forecasting, and investment decisions.", whatToKnow: "Advanced Excel (VLOOKUP, INDEX-MATCH, pivot tables), DCF modeling, comparable company analysis, LBO models.", recommendedLevel: "Build a complete DCF model from scratch" },
    { id: "valuation", name: "Valuation & Analysis", category: "Core", relevantTraits: ["AN", "BU"], whyItMatters: "Knowing how to value a company or asset is the central skill of investment banking, equity research, and private equity.", whatToKnow: "DCF analysis, comparable company analysis, precedent transactions, enterprise value, multiples (P/E, EV/EBITDA).", recommendedLevel: "Value a public company using multiple methods" },
    { id: "markets", name: "Capital Markets & Economics", category: "Core", relevantTraits: ["BU", "SC"], whyItMatters: "Understanding how markets work — equities, bonds, forex, derivatives — is essential for any finance professional.", whatToKnow: "Stock markets, bond pricing, supply/demand, monetary policy, macroeconomic indicators, market cycles.", recommendedLevel: "Explain market movements and their economic drivers" },
    { id: "risk-mgmt", name: "Risk Management", category: "Advanced", relevantTraits: ["AN", "BU"], whyItMatters: "Every financial decision involves risk. Quantifying and managing risk is critical for institutional finance.", whatToKnow: "Types of risk (market, credit, operational), Value at Risk, hedging strategies, stress testing, regulatory frameworks.", recommendedLevel: "Assess risk profiles and suggest mitigation strategies" },
    { id: "fintech", name: "FinTech & Data Analytics", category: "Emerging", relevantTraits: ["TE", "AN"], whyItMatters: "Finance is being transformed by technology. Python, SQL, and data analytics are increasingly required in modern finance roles.", whatToKnow: "Python for finance, SQL for data, algorithmic trading basics, blockchain fundamentals, data visualization.", recommendedLevel: "Automate a financial analysis workflow with Python" },
  ],

  roadmap: [
    { id: "fin-phase-1", phase: 1, title: "Financial Foundations", description: "Build core understanding of money, markets, and accounting principles.", estimatedDuration: "2–3 weeks", skills: ["Financial Literacy"], learn: ["Time value of money", "Compound interest", "Income statements & balance sheets", "Cash flow analysis", "Basic accounting principles"], practice: ["Analyze financial statements of 3 public companies"], build: "A personal budget tracker with investment growth projections", resources: [
      { name: "Khan Academy — Finance & Capital Markets", type: "course", difficulty: "beginner", estimatedTime: "4 weeks", url: "https://www.khanacademy.org/economics-finance-domain" },
      { name: "Zerodha Varsity — Stock Markets", type: "course", difficulty: "beginner", estimatedTime: "3 weeks", url: "https://zerodha.com/varsity/" },
      { name: "Investopedia Financial Terms", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://www.investopedia.com/financial-term-dictionary-4769738" },
    ]},
    { id: "fin-phase-2", phase: 2, title: "Excel & Financial Modeling", description: "Master Excel and learn to build financial models used in real investment decisions.", estimatedDuration: "3–4 weeks", skills: ["Excel & Financial Modeling"], learn: ["Advanced Excel formulas", "Financial statement modeling", "DCF model construction", "Sensitivity analysis", "Comparable company analysis"], practice: ["Build 3 complete financial models for public companies"], build: "A full DCF valuation model for a company of your choice", resources: [
      { name: "Wall Street Prep — Financial Modeling", type: "course", difficulty: "intermediate", estimatedTime: "6 weeks", url: "https://www.wallstreetprep.com/" },
      { name: "Aswath Damodaran — Valuation (YouTube)", type: "video", difficulty: "intermediate", estimatedTime: "20 hours", url: "https://www.youtube.com/@AswathDamodaranonValuation" },
      { name: "Corporate Finance Institute — Excel", type: "course", difficulty: "beginner", estimatedTime: "2 weeks", url: "https://corporatefinanceinstitute.com/resources/excel/" },
    ]},
    { id: "fin-phase-3", phase: 3, title: "Markets, Valuation & Risk", description: "Deepen understanding of capital markets, valuation methods, and risk assessment.", estimatedDuration: "4–6 weeks", skills: ["Valuation & Analysis", "Capital Markets & Economics", "Risk Management"], learn: ["Equity and debt markets", "Macroeconomic analysis", "Advanced valuation techniques", "Risk metrics & management", "Regulatory environment"], practice: ["Write 3 equity research reports", "Track a virtual portfolio for 4 weeks"], build: "A comprehensive equity research report on an Indian company", resources: [
      { name: "Aswath Damodaran — Corporate Finance (NYU)", type: "course", difficulty: "intermediate", estimatedTime: "Semester course", url: "https://pages.stern.nyu.edu/~adamodar/" },
      { name: "The Intelligent Investor (book)", type: "book", difficulty: "intermediate", estimatedTime: "3 weeks", url: "https://www.harpercollins.com/products/the-intelligent-investor-benjamin-graham" },
      { name: "Morning Star — Investment Research", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://www.morningstar.com/" },
    ]},
    { id: "fin-phase-4", phase: 4, title: "FinTech & Career Preparation", description: "Add technical skills and prepare for competitive finance roles.", estimatedDuration: "3–4 weeks", skills: ["FinTech & Data Analytics"], learn: ["Python for financial analysis", "SQL for data querying", "Algorithmic trading basics", "Blockchain fundamentals", "Data visualization for finance"], practice: ["Automate 3 financial analyses with Python", "Build a stock screener"], build: "A Python-powered financial dashboard that analyzes and visualizes market data", resources: [
      { name: "Python for Finance (Coursera)", type: "course", difficulty: "intermediate", estimatedTime: "4 weeks", url: "https://www.coursera.org/learn/python-for-finance" },
      { name: "QuantConnect — Algorithmic Trading", type: "practice", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://www.quantconnect.com/learning" },
      { name: "Bloomberg Market Concepts", type: "course", difficulty: "beginner", estimatedTime: "8 hours", url: "https://www.bloomberg.com/professional/product/bloomberg-market-concepts/" },
    ]},
  ],

  projects: [
    { title: "Personal Finance Dashboard", difficulty: "beginner", skills: ["Excel", "Financial Literacy", "Data Viz"], description: "Build a spreadsheet or app that tracks income, expenses, savings goals, and investment returns over time.", features: ["Income/expense tracking", "Budget categories", "Savings goal tracker", "Investment growth projections", "Monthly summary charts"], portfolioValue: "Shows practical financial literacy and analytical thinking — great for finance internship applications." },
    { title: "Equity Research Report", difficulty: "intermediate", skills: ["Valuation", "Financial Modeling", "Market Analysis"], description: "Write a professional equity research report for a publicly traded company with buy/sell recommendation.", features: ["Company overview & industry analysis", "Financial statement analysis", "DCF and comparable valuation", "Risk assessment", "Investment thesis & price target"], portfolioValue: "The single most valued portfolio piece for investment banking and equity research applications." },
    { title: "Algorithmic Trading Bot", difficulty: "advanced", skills: ["Python", "Markets", "Risk Management", "Data"], description: "Build a trading strategy backtester that tests investment strategies against historical market data.", features: ["Historical data fetching", "Technical indicator calculation", "Strategy backtesting engine", "Performance metrics (Sharpe ratio, drawdown)", "Visualization of results"], portfolioValue: "Demonstrates quantitative skills at the intersection of finance and technology — highly valued in fintech." },
  ],

  progression: [
    { title: "Analyst / Intern", yearsRange: "0–2 years", responsibilities: ["Build financial models", "Create presentations and pitch books", "Conduct industry research", "Support deal teams"], skills: ["Excel", "Financial modeling", "Attention to detail", "Work ethic"], deltaFromPrevious: "Entry point — intense learning period with heavy workload." },
    { title: "Associate", yearsRange: "2–4 years", responsibilities: ["Lead model building and analysis", "Manage analyst work", "Client interaction", "Due diligence"], skills: ["Advanced modeling", "Client management", "Deal execution", "Presentation"], deltaFromPrevious: "Shift from executing tasks to managing processes and people." },
    { title: "Vice President", yearsRange: "4–7 years", responsibilities: ["Own client relationships", "Source deals", "Lead transactions", "Mentor juniors"], skills: ["Business development", "Negotiation", "Industry expertise", "Leadership"], deltaFromPrevious: "Transition from execution to revenue generation and relationship building." },
    { title: "Director / Senior VP", yearsRange: "7–10 years", responsibilities: ["Drive strategy", "Manage P&L", "Senior client advisory", "Team leadership"], skills: ["Strategic thinking", "P&L management", "Executive communication"], deltaFromPrevious: "Become a revenue leader and trusted advisor to senior clients." },
    { title: "Managing Director / Partner", yearsRange: "10+ years", responsibilities: ["Set firm strategy", "Manage large teams", "Lead major transactions", "Industry thought leadership"], skills: ["Executive leadership", "Business strategy", "Network & reputation"], deltaFromPrevious: "Shape the direction of the firm and industry. Compensation reaches highest levels." },
  ],

  preparation: [
    { id: "fin-prep-1", category: "Knowledge", task: "Read financial news daily", details: "Follow Economic Times, Bloomberg, or Mint. Understand how global events affect markets." },
    { id: "fin-prep-2", category: "Skills", task: "Master Excel for finance", details: "Learn VLOOKUP, INDEX-MATCH, pivot tables, and build at least 2 financial models." },
    { id: "fin-prep-3", category: "Portfolio", task: "Write 2 equity research reports", details: "Pick companies you know. Include financial analysis, valuation, and investment recommendation." },
    { id: "fin-prep-4", category: "Education", task: "Prepare for entrance exams", details: "If targeting CA: prepare for CPT/Foundation. If targeting MBA: strengthen quant fundamentals." },
    { id: "fin-prep-5", category: "Resume", task: "Create a finance-focused resume", details: "Highlight analytical skills, Excel proficiency, coursework, and any finance projects." },
    { id: "fin-prep-6", category: "Networking", task: "Connect with finance professionals", details: "Attend finance webinars, join LinkedIn finance groups, reach out for informational interviews." },
    { id: "fin-prep-7", category: "Internship", task: "Apply to finance internships", details: "Target banks, NBFCs, fintech startups, and CA firms. Apply early — these are competitive." },
  ],
};
