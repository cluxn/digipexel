'use client';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const navLinks = [
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

const socialLinks = [
	{
		label: 'Facebook',
		href: '#',
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
			</svg>
		),
	},
	{
		label: 'Instagram',
		href: '#',
		svg: (
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
				<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
				<circle cx="12" cy="12" r="4" />
				<circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
			</svg>
		),
	},
	{
		label: 'YouTube',
		href: '#',
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
				<polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
			</svg>
		),
	},
	{
		label: 'LinkedIn',
		href: '#',
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
				<rect x="2" y="9" width="4" height="12" />
				<circle cx="4" cy="4" r="2" />
			</svg>
		),
	},
];

export function Footer() {
	return (
		<footer className="relative w-full border-t border-border-subtle bg-surface mt-24">
			{/* Top brand glow — 10% accent, very subtle */}
			<div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/5 max-w-xs -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

			{/* ── Main content — 60% breathing room via padding ── */}
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-8 lg:pt-20 lg:pb-16">
				<div className="flex flex-col gap-12 lg:flex-row lg:gap-16 xl:gap-24">

					{/* Brand column — 40% of width on desktop */}
					<AnimatedContainer className="lg:w-[38%] shrink-0 space-y-6">
						<div className="space-y-4">
							<a href="/" className="group inline-block">
								<span className="text-2xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
									Digi Pexel
								</span>
							</a>
							<p className="text-secondary text-sm leading-relaxed max-w-[28ch]">
								Building the future of AI automation. Transforming businesses through intelligent agents and seamless workflows.
							</p>
						</div>

						{/* Social icons — 10% accent on hover */}
						<div className="flex items-center gap-3">
							{socialLinks.map((social) => (
								<a
									key={social.label}
									href={social.href}
									aria-label={social.label}
									className="w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 hover:text-brand hover:border-brand/40 hover:bg-brand/5 transition-all duration-300"
								>
									{social.svg}
								</a>
							))}
						</div>
					</AnimatedContainer>

					{/* Nav columns — 3 clean columns, 60% of width on desktop */}
					<div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:flex-1 lg:gap-12">
						{navLinks.map((section, index) => (
							<AnimatedContainer key={section.label} delay={0.1 + index * 0.08}>
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/50 mb-5">
									{section.label}
								</p>
								<ul className="space-y-3">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="text-sm text-secondary/70 hover:text-brand transition-colors duration-200"
											>
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</AnimatedContainer>
						))}
					</div>
				</div>

				{/* ── Bottom bar — clean divider, copyright + legal ── */}
				<div className="mt-14 pt-6 border-t border-border-subtle/60 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-xs text-secondary/50">
						© {new Date().getFullYear()} Digi Pexel. All rights reserved.
					</p>
					<div className="flex items-center gap-5">
						<a href="/privacy-policy" className="text-xs text-secondary/50 hover:text-brand transition-colors duration-200">
							Privacy Policy
						</a>
						<a href="/terms-and-conditions" className="text-xs text-secondary/50 hover:text-brand transition-colors duration-200">
							Terms & Conditions
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', y: 16, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.7, ease: 'easeOut' }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
