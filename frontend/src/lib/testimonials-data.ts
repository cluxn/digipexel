// Single source of truth for all testimonials shown across the site.
// Used by: public Testimonials block (homepage), Testimonials page, service pages,
// and the Admin testimonials panel as its offline fallback.

export interface FallbackTestimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  image_url: string;
  category: string;
  position: number;
  star_rating: number;
  video_url: string;
  logo_url: string;
  display_context: string; // comma-separated: homepage | testimonials-page | service
  // When display_context includes "service": which section on the service page
  service_section?: "testimonials" | "impact" | "";
}

// ── 1. Homepage testimonials (scrolling columns) ───────────────────────────
const HOMEPAGE_TESTIMONIALS: FallbackTestimonial[] = [
  {
    name: "Aarav Mehta", role: "COO", company: "Lumina Health",
    content: "Digi Pexel replaced manual handoffs with AI workflows. Our operations now run in half the time with clear ownership.",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
    category: "Healthcare", position: 0, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Priya Nair", role: "Head of Ops", company: "Arrow Logistics",
    content: "The automation system removed our QA bottleneck. We ship faster and miss fewer deadlines.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    category: "Logistics", position: 1, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Kabir Singh", role: "VP Growth", company: "Northbridge SaaS",
    content: "AI-driven lead workflows turned our response time from hours to minutes. Pipeline quality improved immediately.",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    category: "SaaS", position: 2, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Neha Joshi", role: "Director", company: "FinOps Hub",
    content: "Reconciliation workflows now run nightly without human intervention. We trust the numbers every morning.",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150",
    category: "Finance", position: 3, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Zara Sheikh", role: "Product Lead", company: "CloudNorth",
    content: "The AI workflows reduced escalation volume by 60%. Our support team focuses on high-value cases now.",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150",
    category: "SaaS", position: 4, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Rahul Verma", role: "Head of RevOps", company: "Signalstack",
    content: "We finally have a clean pipeline and predictable follow-up. The automation stack just works.",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
    category: "SaaS", position: 5, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Anika Roy", role: "Operations Manager", company: "Crest Labs",
    content: "Our onboarding workflows went from chaotic to repeatable. New hires ramp in days, not weeks.",
    image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
    category: "Healthcare", position: 6, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Vikram Patel", role: "CEO", company: "Atlas Retail",
    content: "Digi Pexel delivered a complete automation roadmap and executed it on time. The results are visible weekly.",
    image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    category: "Retail", position: 7, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
  {
    name: "Amit Saxena", role: "CEO", company: "TechFlow",
    content: "The automation workflows implemented by Digi Pexel save our team dozens of hours every week.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    category: "Technology", position: 8, star_rating: 5, video_url: "", logo_url: "",
    display_context: "homepage,testimonials-page",
  },
];

// ── 2. Testimonials page (full-page grid with images) ─────────────────────
const TESTIMONIALS_PAGE: FallbackTestimonial[] = [
  {
    name: "Sarah Chen", role: "Product Manager", company: "Stripe",
    content: "The AI workflows implemented by Digi Pexel transformed our support operations. We reduced response times by 70% while improving customer satisfaction scores.",
    image_url: "https://i.pravatar.cc/150?u=sarah",
    category: "Fintech", position: 9, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Marcus Rodriguez", role: "Founder", company: "GrowthLoop",
    content: "We tried building internal AI systems for 6 months with no luck. Digi Pexel delivered a production-ready lead scoring agent in 3 weeks.",
    image_url: "https://i.pravatar.cc/150?u=marcus",
    category: "SaaS", position: 10, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Emma Watson", role: "Director of Marketing", company: "Adobe",
    content: "Their AI SEO strategy is light years ahead. We went from zero AI citations to being the top result for critical industry prompts.",
    image_url: "https://i.pravatar.cc/150?u=emma",
    category: "Enterprise", position: 11, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "David Miller", role: "COO", company: "NexGen Logistics",
    content: "Automating our route optimization with AI Agents has cut fuel costs by 18% and saved countless manual planning hours.",
    image_url: "https://i.pravatar.cc/150?u=david",
    category: "Logistics", position: 12, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Lisa Wong", role: "Head of Success", company: "ScaleFlow",
    content: "Digi Pexel didn't just give us tools; they gave us a complete automation architecture that scales as we grow.",
    image_url: "https://i.pravatar.cc/150?u=lisa",
    category: "Technology", position: 13, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "James Anderson", role: "Managing Director", company: "Apex Capital",
    content: "Zero-touch accounting workflows have revolutionized our month-end close. No more manual data entry errors.",
    image_url: "https://i.pravatar.cc/150?u=james",
    category: "Finance", position: 14, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Sophie Bennett", role: "CTO", company: "DataVise",
    content: "The reliability of the agents Digi Pexel built is unprecedented. We've had zero downtime in 6 months of operation.",
    image_url: "https://i.pravatar.cc/150?u=sophie",
    category: "Cloud", position: 15, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Thomas Wright", role: "VP Marketing", company: "Vividly",
    content: "Our content production quadrupled without adding a single head to the team. The AI coordination is seamless.",
    image_url: "https://i.pravatar.cc/150?u=thomas",
    category: "Marketing", position: 16, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
  {
    name: "Elena Petrova", role: "Strategy Lead", company: "GlobalNet",
    content: "Digi Pexel is the only agency we've found that actually understands how to make LLMs safe for enterprise data.",
    image_url: "https://i.pravatar.cc/150?u=elena",
    category: "Security", position: 17, star_rating: 5, video_url: "", logo_url: "",
    display_context: "testimonials-page",
  },
];

// ── 3. Service page inline quotes ─────────────────────────────────────────
// These appear inside each service page's testimonial strip.
// name is empty because the originals only store role + company.
const SERVICE_TESTIMONIALS: FallbackTestimonial[] = [
  // AI SEO
  { name: "", role: "CEO", company: "Nexus Tech", content: "Our brand citations in Perplexity and ChatGPT increased by 140% in just two months.", image_url: "", category: "AI SEO", position: 18, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Marketing Director", company: "Aura Media", content: "The zero-click search visibility we've gained has been a game-changer for our organic traffic.", image_url: "", category: "AI SEO", position: 19, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of Growth", company: "ThinkSaaS", content: "Digi Pexel mapped our entity authority gaps and closed them systematically. We now rank in AI answers we never appeared in before.", image_url: "", category: "AI SEO", position: 20, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Content Lead", company: "MarketVault", content: "GEO strategy turned our evergreen content into a citation engine. We're referenced in more AI answers than any of our direct competitors.", image_url: "", category: "AI SEO", position: 21, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Custom AI Solutions
  { name: "", role: "Head of Operations", company: "Fortress Law", content: "Digi Pexel built a custom RAG system that cut our document analysis time from hours to seconds.", image_url: "", category: "Custom AI", position: 22, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Founder", company: "ScaleUp", content: "Our proprietary AI agent now handles 80% of our initial client intake with perfect accuracy.", image_url: "", category: "Custom AI", position: 23, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "CTO", company: "DataBridge", content: "The AI architecture they designed fit perfectly into our legacy stack. Zero disruption to existing operations.", image_url: "", category: "Custom AI", position: 24, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "VP Engineering", company: "CoreLogic", content: "We launched a production AI system in 6 weeks. Every other vendor said 6 months minimum.", image_url: "", category: "Custom AI", position: 25, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // YouTube Automation
  { name: "", role: "Channel Manager", company: "MediaFlow", content: "Closing 8 channels a week used to be impossible. Now we do 12 with a smaller team.", image_url: "", category: "YouTube", position: 26, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Creative Director", company: "TubeFoundry", content: "The AI scripting tool understands our audience better than we did. Retention is up 35%.", image_url: "", category: "YouTube", position: 27, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Growth Director", company: "ViewLab", content: "Our upload consistency went from 40% to 92% the month we deployed the automation pipeline.", image_url: "", category: "YouTube", position: 28, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Founder", company: "WaveContent", content: "Scripts, thumbnails, and scheduling all run on autopilot. Our team focuses entirely on on-camera performance now.", image_url: "", category: "YouTube", position: 29, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Instagram Automation
  { name: "", role: "Social Lead", company: "Vibe Marketing", content: "Our engagement rate spiked 25% after automating our DM triage system.", image_url: "", category: "Instagram", position: 30, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Founder", company: "GlowUp", content: "We finally have an 'always-on' presence without hiring 3 more community managers.", image_url: "", category: "Instagram", position: 31, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Brand Manager", company: "PulseMedia", content: "Reels scheduling, caption creation, and analytics tracking now happen without anyone lifting a finger.", image_url: "", category: "Instagram", position: 32, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "CMO", company: "NovaBrand", content: "The automation is invisible to our followers — but the consistency and reach are unmistakable.", image_url: "", category: "Instagram", position: 33, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // LinkedIn Automation
  { name: "", role: "B2B Founder", company: "SaaS Rocket", content: "My LinkedIn profile views went from 200 to 5,000 a week. The authority we've built is massive.", image_url: "", category: "LinkedIn", position: 34, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Sales Director", company: "Prime Edge", content: "The outreach automation is so subtle—nobody knows it's a system, but the results are very real.", image_url: "", category: "LinkedIn", position: 35, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "CEO", company: "BridgePoint", content: "Thought leadership content we used to spend 3 days writing now gets drafted and scheduled in under an hour.", image_url: "", category: "LinkedIn", position: 36, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Growth Lead", company: "NorthStar", content: "LinkedIn went from a low-priority channel to our number one inbound pipeline source in 60 days.", image_url: "", category: "LinkedIn", position: 37, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Automation Flows
  { name: "", role: "CTO", company: "DataFirst", content: "Our data syncing issues used to cost us $10k a month. Now everything is perfectly in sync.", image_url: "", category: "Automation Flows", position: 38, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "IT Manager", company: "SwiftCore", content: "The observability dashboards give us total peace of mind for our critical business flows.", image_url: "", category: "Automation Flows", position: 39, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of Ops", company: "FlowGrid", content: "We connected 8 tools that had never talked to each other. The whole stack now runs as one system.", image_url: "", category: "Automation Flows", position: 40, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Director of Engineering", company: "LinkOps", content: "Downtime alerts are resolved before we even notice. The automation is proactive, not reactive.", image_url: "", category: "Automation Flows", position: 41, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // AI Workflows
  { name: "", role: "Operations Director", company: "InsurePlus", content: "The AI decision chains now handle 70% of our complex claims approvals.", image_url: "", category: "AI Workflows", position: 42, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Process Architect", company: "LogiNext", content: "Bridging human insight with AI reasoning has halved our processing time.", image_url: "", category: "AI Workflows", position: 43, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "COO", company: "PolicyBridge", content: "Our approval cycle that used to take 3 days now completes in under 4 hours with full audit trails.", image_url: "", category: "AI Workflows", position: 44, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of Compliance", company: "TrustFlow", content: "The human-in-the-loop design is exactly right — AI handles volume, humans handle the exceptions.", image_url: "", category: "AI Workflows", position: 45, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Workflow Creation
  { name: "", role: "COO", company: "Atlas Studio", content: "The blueprints Digi Pexel mapped out revealed bottlenecks we never knew existed.", image_url: "", category: "Workflow Creation", position: 46, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Founder", company: "LaunchPoint", content: "We finally have a scalable workflow architecture that doesn't break under pressure.", image_url: "", category: "Workflow Creation", position: 47, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of Delivery", company: "Catalyze", content: "Every process now has a defined owner, a measurable output, and an automation hook. It changed how we operate.", image_url: "", category: "Workflow Creation", position: 48, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Director of Ops", company: "PeakFlow", content: "For the first time, our documentation actually reflects how the business runs — not how we think it runs.", image_url: "", category: "Workflow Creation", position: 49, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Accounting & Bookkeeping
  { name: "", role: "CFO", company: "Global Ledger", content: "Closing our month-end now takes 3 days instead of 12. Total transformation.", image_url: "", category: "Finance", position: 50, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Controller", company: "FinPath", content: "The accuracy and speed of our automated reconciliation is beyond what we expected.", image_url: "", category: "Finance", position: 51, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Finance Director", company: "Momentum Corp", content: "AP approvals that used to require 4 sign-offs now route themselves. The team is free for strategic work.", image_url: "", category: "Finance", position: 52, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of Finance", company: "ClearCount", content: "I can close the books without touching a spreadsheet. The automation is thorough, accurate, and fully auditable.", image_url: "", category: "Finance", position: 53, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Hiring & Recruitment
  { name: "", role: "HR Director", company: "ScaleRecruit", content: "Our cost-per-hire dropped 40% while our candidate quality actually improved.", image_url: "", category: "Hiring", position: 54, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Talent Lead", company: "Innovate Hub", content: "The AI screening process has saved our team hundreds of hours in top-of-funnel work.", image_url: "", category: "Hiring", position: 55, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Head of HR", company: "Buildfast", content: "We used to take 45 days to fill a role. Now we're averaging 28 days with a better calibre of hire.", image_url: "", category: "Hiring", position: 56, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Talent Acquisition Manager", company: "RisePath", content: "Candidate communication is consistent and professional at high volume. Applicants love the experience.", image_url: "", category: "Hiring", position: 57, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  // Sales Automation
  { name: "", role: "VP Sales", company: "CloudScale", content: "Our sales reps are spending 90% of their time on 'hot' leads now. Conversion is at an all-time high.", image_url: "", category: "Sales", position: 58, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Founder", company: "Apex Systems", content: "Automating our follow-up sequences has ensured no lead ever falls through the cracks again.", image_url: "", category: "Sales", position: 59, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Sales Ops Manager", company: "ProPipe", content: "CRM hygiene used to be a quarterly nightmare. Now it's clean in real-time and the pipeline is always accurate.", image_url: "", category: "Sales", position: 60, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
  { name: "", role: "Revenue Lead", company: "GrowthStack", content: "We launched a 12-step nurture sequence in a single day. What used to take weeks now deploys instantly.", image_url: "", category: "Sales", position: 61, star_rating: 5, video_url: "", logo_url: "", display_context: "service", service_section: "testimonials" },
];

// Combined export — all 54 testimonials from every page of the site
export const FALLBACK_TESTIMONIALS: FallbackTestimonial[] = [
  ...HOMEPAGE_TESTIMONIALS,
  ...TESTIMONIALS_PAGE,
  ...SERVICE_TESTIMONIALS,
];

// Convenience filter helpers
export const homepageTestimonials = () =>
  FALLBACK_TESTIMONIALS.filter((t) =>
    t.display_context.split(",").map((s) => s.trim()).includes("homepage")
  );

export const testimonialsPageItems = () =>
  FALLBACK_TESTIMONIALS.filter((t) =>
    t.display_context.split(",").map((s) => s.trim()).includes("testimonials-page")
  );

export const serviceTestimonials = (category?: string) =>
  FALLBACK_TESTIMONIALS.filter((t) => {
    const inService = t.display_context.split(",").map((s) => s.trim()).includes("service");
    return category ? inService && t.category === category : inService;
  });
