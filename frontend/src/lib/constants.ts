// frontend/src/lib/constants.ts

export const SITE_NAME = "Digi Pexel";
export const TAGLINE = "Building the future of AI automation.";
export const DESCRIPTION = "Transforming businesses through intelligent agents and seamless workflows.";

export const NAV_LINKS = [
  {
    label: 'Services',
    links: [
      { title: 'Custom AI Solutions', href: '/services/custom-ai-solutions' },
      { title: 'AI SEO Services', href: '/services/ai-seo' },
      { title: 'YouTube Automation', href: '/services/youtube-automation' },
      { title: 'Instagram Automation', href: '/services/instagram-automation' },
      { title: 'LinkedIn Automation', href: '/services/linkedin-automation' },
      { title: 'Automation Flows', href: '/services/automation-flows' },
      { title: 'AI Workflows', href: '/services/ai-workflows' },
      { title: 'Workflow Creation', href: '/services/workflow-creation' },
      { title: 'Accounting & Bookkeeping', href: '/services/accounting-bookkeeping' },
      { title: 'Hiring & Recruitment', href: '/services/hiring-recruitment' },
      { title: 'Sales Automation', href: '/services/sales-automation' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'Testimonials', href: '/testimonials' },
      { title: 'Contact Us', href: '/contact-us' },
      { title: 'Privacy Policy', href: '/privacy-policy' },
      { title: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Blogs', href: '/blog' },
      { title: 'Case Studies', href: '/case-studies' },
      { title: 'Guides', href: '/guides' },
    ],
  },
];

export const SOCIAL_LINKS = [
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
  { label: 'LinkedIn', href: '#' },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cluxn.com/backend/api";
