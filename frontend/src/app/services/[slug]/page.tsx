"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  Target, 
  Clock, 
  Users2,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/blocks/floating-icons-hero-demo";
import { Footer } from "@/components/ui/footer-section";
import { Connect } from "@/components/blocks/connect-cta";
import { Search, Workflow } from "lucide-react";

type ServiceData = {
  name: string;
  badge: string;
  heroLine1: string;
  heroLine2: string;
  heroCopy: string;
  ctaPrimary: string;
  ctaSecondary: string;
  pills: [string, string, string];
  snapshotTitle: string;
  snapshotRows: string[];
  statLabel1: string;
  statValue1: string;
  statLabel2: string;
  statValue2: string;
  gapHeading: string;
  gapLeftTitle: string;
  gapLeftItems: string[];
  gapRightTitle: string;
  gapRightItems: string[];
  features?: { title: string; description: string; icon: any }[];
  testimonials?: { quote: string; role: string; company?: string }[];
};

const SERVICES: Record<string, ServiceData> = {
  "ai-seo": {
    name: "AI SEO Services",
    badge: "AI SEO Automation",
    heroLine1: "Stop optimizing for bots.",
    heroLine2: "Start winning AI answers.",
    heroCopy:
      "We build AI-ready content systems that make your brand the default citation across search assistants, copilots, and LLM-driven research.",
    ctaPrimary: "Book a Strategy Call",
    ctaSecondary: "See How We Work",
    pills: ["GEO Strategy", "Entity Authority", "RAG Readiness"],
    snapshotTitle: "Live Visibility Snapshot",
    snapshotRows: ["Model citations: 68%", "Entity coverage: 92%", "Prompt intent match: 84%", "Trust signals: 76%"],
    statLabel1: "Visibility Delta",
    statValue1: "+41%",
    statLabel2: "AI Answer Rate",
    statValue2: "3.2x",
    gapHeading: "The gap between AI hype and AI results",
    gapLeftTitle: "Traditional SEO",
    gapLeftItems: [
      "Keyword-first content that ignores intent chains",
      "Pages optimized for rankings, not AI summarization",
      "Fragmented entity coverage across the site",
      "No feedback loop for AI visibility",
    ],
    gapRightTitle: "AI SEO Automation",
    gapRightItems: [
      "Intent graphs built from real prompt behavior",
      "Answer-native content blocks for LLMs",
      "Entity authority and knowledge graph mapping",
      "Automated visibility testing across models",
    ],
    features: [
      { title: "GEO Optimization", description: "Optimize for Generative Engine Results to ensure your brand is cited by LLMs.", icon: Target },
      { title: "Entity Authority", description: "Map your content to semantic entities to build topical authority that AI understands.", icon: Layers },
      { title: "Automated Content Loop", description: "A system that continuously updates content based on AI search trends and intent.", icon: Zap }
    ],
    testimonials: [
      { quote: "Our brand citations in Perplexity and ChatGPT increased by 140% in just two months.", role: "CEO", company: "Nexus Tech" },
      { quote: "The zero-click search visibility we've gained has been a game-changer for our organic traffic.", role: "Marketing Director", company: "Aura Media" }
    ]
  },
  "custom-ai-solutions": {
    name: "Custom AI Solutions",
    badge: "Custom AI Solutions",
    heroLine1: "Build AI that fits",
    heroLine2: "your business logic.",
    heroCopy:
      "We design bespoke AI solutions that integrate with your data, workflows, and proprietary processes. From copilots to autonomous systems, we make AI operational.",
    ctaPrimary: "Plan a Discovery Call",
    ctaSecondary: "See Case Studies",
    pills: ["AI Architecture", "Data Pipelines", "Workflow Integration"],
    snapshotTitle: "Solution Readiness",
    snapshotRows: ["Use-case clarity: 88%", "Data availability: 79%", "Model fit score: 86%", "Security readiness: 82%"],
    statLabel1: "Delivery speed",
    statValue1: "3x",
    statLabel2: "Ops uplift",
    statValue2: "+45%",
    gapHeading: "The gap between AI ideas and AI delivery",
    gapLeftTitle: "Typical AI Projects",
    gapLeftItems: ["Generic models with shallow context", "Disconnected data sources", "Manual retraining cycles", "No operational ownership"],
    gapRightTitle: "Custom AI Systems",
    gapRightItems: ["Domain-tuned architectures", "Unified data foundation", "Automated monitoring and iteration", "Clear operational accountability"],
    features: [
      { title: "Custom Agent Design", description: "Build autonomous agents specialized in your unique business operations.", icon: Zap },
      { title: "Proprietary RAG", description: "Securely connect your private data to LLMs for accurate, context-aware answers.", icon: ShieldCheck },
      { title: "Legacy Integration", description: "Seamlessly bridge modern AI capabilities with your existing software stack.", icon: Layers }
    ],
    testimonials: [
      { quote: "Digi Pexel built a custom RAG system that cut our document analysis time from hours to seconds.", role: "Head of Operations", company: "Fortress Law" },
      { quote: "Our proprietary AI agent now handles 80% of our initial client intake with perfect accuracy.", role: "Founder", company: "ScaleUp" }
    ]
  },
  "youtube-automation": {
    name: "YouTube Automation",
    badge: "YouTube Automation",
    heroLine1: "Scale your channel",
    heroLine2: "without the bottlenecks.",
    heroCopy:
      "We automate scripting, production coordination, publishing, and analytics so your YouTube engine runs every week without burnout.",
    ctaPrimary: "Audit My Channel",
    ctaSecondary: "See Our Process",
    pills: ["Content Engine", "Publishing Ops", "Audience Growth"],
    snapshotTitle: "Channel Momentum",
    snapshotRows: ["Upload consistency: 92%", "Retention lift: +28%", "Topic velocity: 3.4x", "Revenue mix: 47%"],
    statLabel1: "Time saved",
    statValue1: "12 hrs/wk",
    statLabel2: "Output lift",
    statValue2: "3x",
    gapHeading: "The gap between great ideas and consistent publishing",
    gapLeftTitle: "Manual YouTube Ops",
    gapLeftItems: ["Inconsistent upload cadence", "Manual scripting and editing", "Fragmented thumbnail workflows", "Little feedback loop"],
    gapRightTitle: "Automated Channel System",
    gapRightItems: ["Weekly content pipeline", "AI-assisted scripting and QA", "Standardized creative kits", "Performance-informed iterations"],
    features: [
      { title: "AI Scripting Engine", description: "Generate data-backed scripts that maximize viewer retention and engagement.", icon: FileText },
      { title: "Production Pipeline", description: "Automated coordination between editors, designers, and upload managers.", icon: Layers },
      { title: "Topic Velocity", description: "Rapidly identify and execute on trending topics before the competition.", icon: TrendingUp }
    ],
    testimonials: [
      { quote: "Closing 8 channels a week used to be impossible. Now we do 12 with a smaller team.", role: "Channel Manager", company: "MediaFlow" },
      { quote: "The AI scripting tool understands our audience better than we did. Retention is up 35%.", role: "Creative Director", company: "TubeFoundry" }
    ]
  },
  "instagram-automation": {
    name: "Instagram Automation",
    badge: "Instagram Automation",
    heroLine1: "Grow consistently",
    heroLine2: "without manual grind.",
    heroCopy:
      "Automate content scheduling, engagement workflows, and performance tracking so your brand stays always-on and on-strategy.",
    ctaPrimary: "Get an IG Audit",
    ctaSecondary: "See Playbooks",
    pills: ["Content System", "Engagement Ops", "Brand Voice"],
    snapshotTitle: "Social Pulse",
    snapshotRows: ["Posting rhythm: 90%", "Engagement rate: +22%", "DM response time: 3h", "Content reuse: 2.6x"],
    statLabel1: "Engagement lift",
    statValue1: "+22%",
    statLabel2: "Time saved",
    statValue2: "9 hrs/wk",
    gapHeading: "The gap between posting and real growth",
    gapLeftTitle: "Manual IG Workflow",
    gapLeftItems: ["Inconsistent posting", "One-off creative assets", "Slow engagement response", "No performance feedback loop"],
    gapRightTitle: "Automated Growth System",
    gapRightItems: ["Editorial calendar automation", "Reusable creative kits", "DM triage + routing", "Iterative content testing"],
    features: [
      { title: "Engagement Automator", description: "AI-powered DM and comment handling that maintains authentic brand voice.", icon: Users2 },
      { title: "Visual Content Hub", description: "Centralized system for generating and scheduling Reels, Carousels, and Stories.", icon: Layers },
      { title: "Pattern Analysis", description: "Automatically identify what content drives the most follows and sales.", icon: TrendingUp }
    ],
    testimonials: [
      { quote: "Our engagement rate spiked 25% after automating our DM triage system.", role: "Social Lead", company: "Vibe Marketing" },
      { quote: "We finally have an 'always-on' presence without hiring 3 more community managers.", role: "Founder", company: "GlowUp" }
    ]
  },
  "linkedin-automation": {
    name: "LinkedIn Automation",
    badge: "LinkedIn Automation",
    heroLine1: "Build authority",
    heroLine2: "at scale.",
    heroCopy:
      "We automate content publishing, audience engagement, and lead capture so your LinkedIn presence drives pipeline consistently.",
    ctaPrimary: "Book a LinkedIn Audit",
    ctaSecondary: "See Our Framework",
    pills: ["Authority Building", "Outbound Assist", "Lead Capture"],
    snapshotTitle: "Authority Scorecard",
    snapshotRows: ["Post cadence: 4x", "Profile views: +58%", "Inbound leads: +36%", "Engagement rate: 6.1%"],
    statLabel1: "Lead lift",
    statValue1: "+36%",
    statLabel2: "Authority growth",
    statValue2: "+58%",
    gapHeading: "The gap between posting and pipeline",
    gapLeftTitle: "Manual LinkedIn",
    gapLeftItems: ["Irregular posting", "No content repurposing", "Manual outreach follow-up", "Sparse analytics"],
    gapRightTitle: "LinkedIn Automation",
    gapRightItems: ["Consistent thought leadership", "Repurposed content systems", "Automated lead follow-up", "Clear performance dashboards"],
    features: [
      { title: "Thought Leadership Ops", description: "Scale your professional voice with AI-assisted post generation and scheduling.", icon: FileText },
      { title: "Social Selling Flows", description: "Automated lead nurturing and profile visit follow-ups that feel personal.", icon: Target },
      { title: "Network Growth", description: "Strategic connection automation to build a highly targeted industry network.", icon: Users2 }
    ],
    testimonials: [
      { quote: "My LinkedIn profile views went from 200 to 5,000 a week. The authority we've built is massive.", role: "B2B Founder", company: "SaaS Rocket" },
      { quote: "The outreach automation is so subtle—nobody knows it's a system, but the results are very real.", role: "Sales Director", company: "Prime Edge" }
    ]
  },
  "automation-flows": {
    name: "Automation Flows",
    badge: "Automation Flows",
    heroLine1: "Connect your stack",
    heroLine2: "without friction.",
    heroCopy:
      "We build automation flows that move data and actions across your tools with reliability, observability, and scale.",
    ctaPrimary: "Map My Workflows",
    ctaSecondary: "See Integrations",
    pills: ["System Orchestration", "Data Sync", "Reliability"],
    snapshotTitle: "Workflow Health",
    snapshotRows: ["Success rate: 99.2%", "Latency: 1.8s", "Manual touches: -64%", "Error recovery: 92%"],
    statLabel1: "Ops time saved",
    statValue1: "-64%",
    statLabel2: "Flow uptime",
    statValue2: "99.2%",
    gapHeading: "The gap between tools and outcomes",
    gapLeftTitle: "Disconnected Ops",
    gapLeftItems: ["Siloed tools", "Manual handoffs", "Hidden errors", "No monitoring"],
    gapRightTitle: "Automated Flows",
    gapRightItems: ["Unified system logic", "Event-driven automation", "Error handling and retries", "Visibility and alerts"],
    features: [
      { title: "Event Orchestration", description: "Build complex multi-step flows that trigger based on specific data events.", icon: Zap },
      { title: "Data Synchronization", description: "Keep your entire tech stack in sync with zero-latency data transfers.", icon: Layers },
      { title: "Observability Hub", description: "Real-time monitoring and alerting for every automated process you run.", icon: ShieldCheck }
    ],
    testimonials: [
      { quote: "Our data syncing issues used to cost us $10k a month. Now everything is perfectly in sync.", role: "CTO", company: "DataFirst" },
      { quote: "The observability dashboards give us total peace of mind for our critical business flows.", role: "IT Manager", company: "SwiftCore" }
    ]
  },
  "ai-workflows": {
    name: "AI Workflows",
    badge: "AI Workflows",
    heroLine1: "Let AI run",
    heroLine2: "the complex decisions.",
    heroCopy:
      "We build AI workflows that chain decisions, approvals, and actions across your business with auditability and control.",
    ctaPrimary: "Design My Workflow",
    ctaSecondary: "View Examples",
    pills: ["Decision Chains", "Human-in-Loop", "24/7 Ops"],
    snapshotTitle: "Workflow Intelligence",
    snapshotRows: ["Decision accuracy: 93%", "Escalation rate: 7%", "Automation coverage: 68%", "Cycle time: -41%"],
    statLabel1: "Cycle time",
    statValue1: "-41%",
    statLabel2: "Decision accuracy",
    statValue2: "93%",
    gapHeading: "The gap between automation and intelligence",
    gapLeftTitle: "Basic Automation",
    gapLeftItems: ["Rigid if/then rules", "No reasoning layer", "Limited context access", "Poor exception handling"],
    gapRightTitle: "AI Workflows",
    gapRightItems: ["Context-aware decisions", "LLM + tool orchestration", "Structured approvals", "Fallback paths"],
    features: [
      { title: "Decision Intelligence", description: "AI that reasons through complex scenarios and takes the right action.", icon: Zap },
      { title: "Human-in-Loop QA", description: "Smart checkpoints that escalate complex cases to humans while automating the rest.", icon: ShieldCheck },
        { title: "Context Chain", description: "Maintain business context across multiple automation steps for smarter outcomes.", icon: Layers }
    ],
    testimonials: [
      { quote: "The AI decision chains now handle 70% of our complex claims approvals.", role: "Operations Director", company: "InsurePlus" },
      { quote: "Bridging human insight with AI reasoning has halved our processing time.", role: "Process Architect", company: "LogiNext" }
    ]
  },
  "workflow-creation": {
    name: "Workflow Creation",
    badge: "Workflow Creation",
    heroLine1: "Architect workflows",
    heroLine2: "that never break.",
    heroCopy:
      "We design dependable business workflows with clear ownership, automation hooks, and measurable performance.",
    ctaPrimary: "Build My Workflow",
    ctaSecondary: "See Architecture",
    pills: ["Process Design", "Automation Ready", "Reliability"],
    snapshotTitle: "Workflow Readiness",
    snapshotRows: ["Process clarity: 88%", "Automation fit: 74%", "Error rate: 6%", "Cycle time: -32%"],
    statLabel1: "Cycle time",
    statValue1: "-32%",
    statLabel2: "Automation fit",
    statValue2: "74%",
    gapHeading: "The gap between process and performance",
    gapLeftTitle: "Ad-hoc Workflows",
    gapLeftItems: ["Undefined ownership", "Manual approvals", "No standard operating steps", "Hidden bottlenecks"],
    gapRightTitle: "Designed Workflows",
    gapRightItems: ["Clear roles and handoffs", "Automated checkpoints", "Documented SOPs", "Measured performance"],
    features: [
      { title: "System Mapping", description: "Detailed blueprints of your business operations to identify automation points.", icon: Target },
      { title: "Performance Benchmarking", description: "Measure every step of your workflow to find and fix hidden bottlenecks.", icon: TrendingUp },
      { title: "Fail-safe Design", description: "Workflows built with built-in redundancies and error handling protocols.", icon: ShieldCheck }
    ],
    testimonials: [
      { quote: "The blueprints Digi Pexel mapped out revealed bottlenecks we never knew existed.", role: "COO", company: "Atlas Studio" },
      { quote: "We finally have a scalable workflow architecture that doesn't break under pressure.", role: "Founder", company: "LaunchPoint" }
    ]
  },
  "accounting-bookkeeping": {
    name: "Accounting & Bookkeeping",
    badge: "Accounting Automation",
    heroLine1: "Close books faster",
    heroLine2: "with zero-touch workflows.",
    heroCopy:
      "We automate reconciliation, reporting, and financial workflows so your team focuses on analysis, not manual cleanup.",
    ctaPrimary: "Book an Accounting Audit",
    ctaSecondary: "See Our Approach",
    pills: ["Reconciliation", "Reporting", "Compliance"],
    snapshotTitle: "Finance Health",
    snapshotRows: ["Close time: -40%", "Reconciliation accuracy: 99%", "AP cycle time: -32%", "Manual entries: -70%"],
    statLabel1: "Close time",
    statValue1: "-40%",
    statLabel2: "Manual entries",
    statValue2: "-70%",
    gapHeading: "The gap between finance data and decisions",
    gapLeftTitle: "Manual Accounting",
    gapLeftItems: ["Spreadsheet-heavy workflows", "Late reconciliations", "Inconsistent reporting", "High error rates"],
    gapRightTitle: "Automated Finance",
    gapRightItems: ["Daily reconciliations", "Real-time dashboards", "Audit-ready reporting", "Error prevention"],
    features: [
      { title: "Zero-touch Reconciliation", description: "Automatically match bank statements with your ledger using AI pattern recognition.", icon: Zap },
      { title: "Real-time P&L", description: "Live financial dashboards that update instantly as transactions occur.", icon: TrendingUp },
      { title: "Compliance Guard", description: "Automated audits that flag inconsistencies and ensure tax readiness year-round.", icon: ShieldCheck }
    ],
    testimonials: [
      { quote: "Closing our month-end now takes 3 days instead of 12. Total transformaton.", role: "CFO", company: "Global Ledger" },
      { quote: "The accuracy and speed of our automated reconciliation is beyond what we expected.", role: "Controller", company: "FinPath" }
    ]
  },
  "hiring-recruitment": {
    name: "Hiring & Recruitment",
    badge: "Hiring Automation",
    heroLine1: "Hire faster",
    heroLine2: "with AI-driven pipelines.",
    heroCopy:
      "We automate sourcing, screening, and outreach to help you scale hiring without sacrificing quality.",
    ctaPrimary: "Audit My Hiring Flow",
    ctaSecondary: "See Our Playbook",
    pills: ["Sourcing", "Screening", "Candidate Experience"],
    snapshotTitle: "Hiring Velocity",
    snapshotRows: ["Time-to-hire: -35%", "Qualified applicants: +48%", "Response time: 2h", "Offer acceptance: 82%"],
    statLabel1: "Time-to-hire",
    statValue1: "-35%",
    statLabel2: "Qualified leads",
    statValue2: "+48%",
    gapHeading: "The gap between openings and hires",
    gapLeftTitle: "Manual Hiring",
    gapLeftItems: ["Slow sourcing cycles", "Inconsistent screening", "Delayed outreach", "Limited analytics"],
    gapRightTitle: "Automated Hiring",
    gapRightItems: ["Always-on sourcing", "Structured screening", "Automated outreach", "Pipeline visibility"],
    features: [
      { title: "AI Candidate Sourcing", description: "Find top talent across platforms automatically with intelligent search agents.", icon: Users2 },
      { title: "Automated Screening", description: "Smart interviews and skill assessments that filter for quality at scale.", icon: ShieldCheck },
      { title: "Engagement Engine", description: "Personalized candidate outreach that maintains high response rates.", icon: Target }
    ],
    testimonials: [
      { quote: "Our cost-per-hire dropped 40% while our candidate quality actually improved.", role: "HR Director", company: "ScaleRecruit" },
      { quote: "The AI screening process has saved our team hundreds of hours in top-of-funnel work.", role: "Talent Lead", company: "Innovate Hub" }
    ]
  },
  "sales-automation": {
    name: "Sales Automation",
    badge: "Sales Automation",
    heroLine1: "Convert faster",
    heroLine2: "with automated follow-up.",
    heroCopy:
      "We automate lead scoring, nurturing, and pipeline hygiene so sales teams focus on closing, not chasing.",
    ctaPrimary: "Audit My Sales Ops",
    ctaSecondary: "See Sales System",
    pills: ["Lead Scoring", "Follow-up", "Pipeline Hygiene"],
    snapshotTitle: "Pipeline Health",
    snapshotRows: ["Response time: -45%", "Conversion lift: +29%", "Lead scoring: 94%", "Stale deals: -38%"],
    statLabel1: "Conversion lift",
    statValue1: "+29%",
    statLabel2: "Response time",
    statValue2: "-45%",
    gapHeading: "The gap between leads and revenue",
    gapLeftTitle: "Manual Sales Ops",
    gapLeftItems: ["Slow follow-ups", "Inconsistent lead scoring", "Messy CRM data", "Limited visibility"],
    gapRightTitle: "Automated Sales",
    gapRightItems: ["Instant follow-ups", "Predictive lead scoring", "Clean pipeline hygiene", "Actionable dashboards"],
    features: [
      { title: "Predictive Lead Scoring", description: "AI that identifies your highest-value leads before you even contact them.", icon: TrendingUp },
      { title: "Multi-channel Follow-up", description: "Automated nurturing across Email, LinkedIn, and SMS that never misses a beat.", icon: Zap },
      { title: "CRM Hygiene Bots", description: "Autonomous agents that keep your sales data accurate and pipeline clean.", icon: ShieldCheck }
    ],
    testimonials: [
      { quote: "Our sales reps are spending 90% of their time on 'hot' leads now. Conversion is at an all-time high.", role: "VP Sales", company: "CloudScale" },
      { quote: "Automating our follow-up sequences has ensured no lead ever falls through the cracks again.", role: "Founder", company: "Apex Systems" }
    ]
  },
};

const DEFAULT_SECTIONS = {
  platformTitle: "Everything you need to",
  platformTitleAccent: "scale this service",
  platformCopy: "A connected system that removes manual friction and keeps performance visible through every stage of growth.",
  platformCards: [
    {
      title: "Strategy + System Design",
      description: "We audit your current tech debt and process friction to build a 12-month automation roadmap mapped to ROI.",
      icon: Layers
    },
    {
      title: "Execution + Automation",
      description: "Full-scale deployment of custom agents, RAG systems, and autonomous workflows with 24/7 monitoring.",
      icon: Zap
    },
    {
      title: "Optimization + Scale",
      description: "Continuous performance tuning and governance to ensure your AI systems evolve with your data and logic.",
      icon: TrendingUp
    },
  ],
  roadmapTitle: "The 6-step delivery",
  roadmapTitleAccent: "roadmap",
  roadmapCopy: "A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.",
  roadmapItems: [
    { step: "01", title: "Discovery", desc: "Process auditing & feasibility" },
    { step: "02", title: "Architecture", desc: "Logic mapping & tool selection" },
    { step: "03", title: "Engineering", desc: "Build & data integration" },
    { step: "04", title: "Validation", desc: "Security audit & QA testing" },
    { step: "05", title: "Deployment", desc: "Live launch & pilot monitoring" },
    { step: "06", title: "Scale", desc: "Performance tuning & expansion" },
  ],
  roadmapPills: ["Discovery", "Automation", "QA", "Optimization"],
  outcomesTitle: "Partnering for",
  outcomesTitleAccent: "high-velocity growth",
  outcomesCopy: "We help modern teams ship faster without increasing headcount or complexity.",
  outcomesCards: [
    ["We removed the manual bottlenecks and shipped weekly.", "Atlas Studio", "Operations", "2x", "Throughput"],
    ["Quality improved while cycle time dropped.", "Signal Ops", "Delivery", "-38%", "Cycle time"],
  ] as [string, string, string, string, string][],
  outcomesStats: [["2x", "Throughput"], ["38%", "Faster cycles"], ["6", "Weeks to launch"], ["24/7", "Monitoring"]] as [
    string,
    string
  ][],
  testimonialsCopy: "Built for teams that need reliable delivery.",
  testimonialsItems: [
    ["We finally have a system that runs itself.", "Ops Lead"],
    ["The workflow is consistent and measurable.", "Program Manager"],
    ["Automation removed the manual overhead.", "Director of Operations"],
    ["We can scale without chaos now.", "Founder"],
  ] as [string, string][],
  ctaBadge: "Deployment Ready",
  ctaTitle: "Ship faster with automation.",
  ctaCopy: "Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.",
  ctaSecondaryAlt: "Request a Proposal",
};

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params);
  const service = SERVICES[unwrappedParams.slug];
  if (!service) return notFound();

  return (
    <main className="min-h-screen bg-base">
      <Navbar className="top-0" darkHero={false} />
      
      {/* Hero Section - Standardized for Single Screen Fit */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.1),transparent_50%)]" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <Badge variant="outline" className="section-eyebrow mb-6">
                {service.badge}
              </Badge>
              <h1 className="hero-title mb-6 leading-[1.05]">
                {service.heroLine1} <br />
                <span className="hero-title-accent">{service.heroLine2}</span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl leading-relaxed text-secondary opacity-70 mb-10 font-medium">
                {service.heroCopy}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="h-14 px-10 rounded-2xl text-lg font-bold bg-brand text-white hover:bg-brand/90 shadow-xl shadow-brand/20 transition-all hover:scale-105 active:scale-95">
                  <Link href="/contact-us">{service.ctaPrimary}</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {service.pills.map((pill) => (
                  <div key={pill} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-highlight border border-border-subtle text-[10px] font-bold uppercase tracking-widest text-secondary/70">
                    <CheckCircle2 className="w-3 h-3 text-brand" />
                    {pill}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="absolute -inset-10 bg-brand/10 blur-[100px] rounded-full opacity-50" />
              <div className="relative bg-surface/80 backdrop-blur-xl border border-white/20 rounded-[3rem] p-8 shadow-2xl shadow-black/5 overflow-hidden">
                <div className="absolute top-0 right-0 p-6 text-brand/20">
                    <Target className="w-16 h-16" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-brand mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                  {service.snapshotTitle}
                </div>
                <div className="space-y-3">
                  {service.snapshotRows.map((item, idx) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-border-subtle bg-white/50 px-5 py-3.5 transition-all hover:border-brand/30 group"
                    >
                      <span className="text-sm font-bold text-primary group-hover:text-brand transition-colors">{item}</span>
                      <ArrowRight className="w-4 h-4 text-brand/30 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="p-5 rounded-3xl bg-brand/5 border border-brand/10">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-brand/60 mb-0.5">{service.statLabel1}</div>
                      <div className="text-2xl font-display font-black text-primary">{service.statValue1}</div>
                   </div>
                   <div className="p-5 rounded-3xl bg-brand/5 border border-brand/10">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-brand/60 mb-0.5">{service.statLabel2}</div>
                      <div className="text-2xl font-display font-black text-primary">{service.statValue2}</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 bg-surface/40 border-y border-border-subtle/50 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="section-eyebrow mx-auto mb-4">
              The Reality Check
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary max-w-3xl mx-auto leading-tight">
               {service.gapHeading}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-[2.5rem] border border-border-subtle bg-slate-50 p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck className="w-24 h-24 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-slate-300" />
                 {service.gapLeftTitle}
              </h3>
              <ul className="space-y-5">
                {service.gapLeftItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium text-secondary/70">
                    <span className="text-slate-300">—</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2.5rem] border border-brand/20 bg-brand/5 p-10 relative overflow-hidden shadow-xl shadow-brand/5 group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Zap className="w-24 h-24 text-brand" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                 {service.gapRightTitle}
              </h3>
              <ul className="space-y-5">
                {service.gapRightItems.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold text-primary/80">
                    <CheckCircle2 className="w-5 h-5 text-brand shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-32 bg-base relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand/[0.02] -skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <Badge variant="outline" className="section-eyebrow mx-auto mb-4">
              The Platform
            </Badge>
            <h2 className="section-title">
              {DEFAULT_SECTIONS.platformTitle} <br />
              <span className="section-title-accent">{DEFAULT_SECTIONS.platformTitleAccent}</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">{DEFAULT_SECTIONS.platformCopy}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(service.features || DEFAULT_SECTIONS.platformCards).map((card, idx) => (
              <div key={card.title} className="group relative rounded-[3rem] border border-border-subtle bg-surface p-10 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 hover:-translate-y-2">
                <div className="mb-8 w-16 h-16 rounded-2xl bg-brand/5 flex items-center justify-center text-brand transition-all group-hover:bg-brand group-hover:text-white group-hover:scale-110">
                   {card.icon && <card.icon className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{card.title}</h3>
                <p className="text-secondary text-sm leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{card.description}</p>
                <div className="mt-8 pt-6 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-all">
                    <Link href="/contact-us" className="text-sm font-bold text-brand flex items-center gap-2">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-32 bg-surface/30 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
             <Badge variant="outline" className="section-eyebrow mx-auto mb-4">
              The Delivery Process
            </Badge>
            <h2 className="section-title">
              {DEFAULT_SECTIONS.roadmapTitle} <br />
              <span className="section-title-accent">{DEFAULT_SECTIONS.roadmapTitleAccent}</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              {DEFAULT_SECTIONS.roadmapCopy}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_SECTIONS.roadmapItems.map((item) => (
              <div key={item.step} className="p-8 rounded-[2.5rem] border border-border-subtle bg-white relative group hover:border-brand/30 transition-colors">
                <div className="text-5xl font-display font-black text-slate-50 absolute top-4 right-8 group-hover:text-brand/5 transition-colors">
                    {item.step}
                </div>
                <div className="relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center font-black text-xs mb-6 group-hover:bg-brand group-hover:text-white transition-all">
                        {item.step}
                    </div>
                    <h4 className="text-lg font-bold text-primary mb-2 uppercase tracking-wide">{item.title}</h4>
                    <p className="text-sm text-secondary/70 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* After-launch: continuous improvement system */}
          <div className="mt-20 pt-16 border-t border-border-subtle relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-border-subtle to-brand/20" />

            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-primary mb-3">
                Your system never stops <span className="text-brand">improving</span>
              </h3>
              <p className="text-secondary/60 text-sm max-w-lg mx-auto leading-relaxed">
                After launch, we stay engaged — monitoring performance, refining logic, and scaling coverage as your business evolves.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "01", label: "Monitor", icon: ShieldCheck, desc: "Real-time visibility into every workflow run, error rate, and performance metric across your stack." },
                { step: "02", label: "Analyse", icon: TrendingUp,  desc: "Weekly performance reviews with data-driven recommendations on where to improve ROI." },
                { step: "03", label: "Refine",  icon: Zap,         desc: "Targeted updates to workflows, prompts, and integrations based on real production outcomes." },
                { step: "04", label: "Scale",   icon: Layers,      desc: "Systematic expansion into new use cases, higher coverage, and additional data sources." },
              ].map((item) => (
                <div key={item.label} className="group p-6 rounded-3xl border border-border-subtle bg-white hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all duration-400 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-brand/8 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-slate-50 group-hover:text-brand/8 transition-colors">{item.step}</span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-[0.15em] text-primary mb-2 group-hover:text-brand transition-colors">{item.label}</h4>
                  <p className="text-xs text-secondary/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes Section */}
      <section className="py-32 bg-base">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-24">
            <Badge variant="outline" className="section-eyebrow mx-auto mb-4">
              Market Impact
            </Badge>
            <h2 className="section-title">
              {DEFAULT_SECTIONS.outcomesTitle} <br />
              <span className="section-title-accent">{DEFAULT_SECTIONS.outcomesTitleAccent}</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">{DEFAULT_SECTIONS.outcomesCopy}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {DEFAULT_SECTIONS.outcomesCards.map(([quote, company, sector, value, label]) => (
              <div key={quote} className="group rounded-[3rem] border border-border-subtle bg-surface p-12 transition-all hover:border-brand/20 shadow-sm hover:shadow-2xl">
                <div className="mb-8 p-3 rounded-full bg-slate-50 w-fit">
                    <FileText className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-xl font-medium text-secondary leading-relaxed italic">"{quote}"</p>
                <div className="mt-10 flex items-center justify-between border-t border-slate-50 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-brand/5 flex items-center justify-center text-brand font-black text-xl">
                        {company.slice(0,1)}
                    </div>
                    <div>
                        <p className="text-primary font-bold">{company}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">{sector}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-display font-black text-brand">{value}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">{label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {DEFAULT_SECTIONS.outcomesStats.map(([value, label], idx) => (
              <div key={value} className="bg-white/50 border border-border-subtle rounded-3xl p-8 text-center group hover:bg-brand hover:border-brand transition-all duration-500">
                <p className="text-4xl font-display font-black text-primary group-hover:text-white transition-colors">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 mt-2 mt-2 group-hover:text-white/60 transition-colors">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-surface/50 border-t border-border-subtle/40">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
             <Badge variant="outline" className="section-eyebrow mx-auto mb-4">
              Real Intelligence
            </Badge>
            <h2 className="section-title">
              What our clients <span className="section-title-accent">say</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">{DEFAULT_SECTIONS.testimonialsCopy}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(service.testimonials || DEFAULT_SECTIONS.testimonialsItems.map(([quote, role]) => ({ quote, role, company: "" }))).map((t: any, idx) => (
              <div key={idx} className="group relative rounded-[3rem] border border-border-subtle bg-white p-10 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-500 flex flex-col h-full overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative mb-8">
                    <div className="flex gap-1.5 mb-6">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-brand/20 group-hover:bg-brand transition-colors" />
                        ))}
                    </div>
                    <p className="text-lg font-medium text-primary leading-relaxed italic line-clamp-4 group-hover:text-brand transition-colors">
                        &quot;{t.quote}&quot;
                    </p>
                </div>
                
                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-primary group-hover:text-brand transition-colors">{t.role}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40 mt-1">
                            {t.company || "Client Pioneer"}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand/10 group-hover:text-brand transition-all">
                        <Users2 className="w-5 h-5" />
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Connect variant="light" />

      <Footer />
    </main>
  );
}
