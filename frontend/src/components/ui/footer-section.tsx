'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { safeFetch, fireWebhook } from '@/lib/utils';
import { API_BASE_URL, WEBHOOK_NEWSLETTER } from '@/lib/constants';

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
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
			</svg>
		),
	},
	{
		label: 'Instagram',
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
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
				<polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
			</svg>
		),
	},
	{
		label: 'LinkedIn',
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
				<rect x="2" y="9" width="4" height="12" />
				<circle cx="4" cy="4" r="2" />
			</svg>
		),
	},
	{
		label: 'WhatsApp',
		svg: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
				<path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.272-.099-.47-.148-.669.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.024-.521-.075-.149-.669-1.612-.916-2.207-.243-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.793.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.066 2.875 1.214 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347zM12.001 2C6.478 2 2 6.478 2 12c0 1.852.502 3.587 1.38 5.079L2.05 21.95l4.991-1.31A9.955 9.955 0 0012.001 22C17.523 22 22 17.522 22 12S17.523 2 12.001 2zm0 18.18a8.165 8.165 0 01-4.164-1.14l-.299-.177-3.096.812.826-3.018-.195-.31A8.14 8.14 0 013.82 12c0-4.512 3.67-8.18 8.181-8.18 4.512 0 8.18 3.668 8.18 8.18 0 4.511-3.668 8.18-8.18 8.18z"/>
			</svg>
		),
	},
];

export function Footer() {
	const [email, setEmail] = useState("");
	const [subStatus, setSubStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");
	const [subLoading, setSubLoading] = useState(false);
	const [socialUrls, setSocialUrls] = useState<{
		facebook_url: string;
		instagram_url: string;
		youtube_url: string;
		linkedin_url: string;
		whatsapp_url: string;
	}>({ facebook_url: '', instagram_url: '', youtube_url: '', linkedin_url: '', whatsapp_url: '' });

	useEffect(() => {
		safeFetch(`${API_BASE_URL}/settings.php`).then(json => {
			if (json?.status === "success" && json.data) {
				const sd = json.data as { whatsapp_number?: string; facebook_url?: string; instagram_url?: string; youtube_url?: string; linkedin_url?: string };
				const num = (sd.whatsapp_number || '').replace(/\D/g, '');
				setSocialUrls({
					facebook_url: sd.facebook_url || '',
					instagram_url: sd.instagram_url || '',
					youtube_url: sd.youtube_url || '',
					linkedin_url: sd.linkedin_url || '',
					whatsapp_url: num ? `https://wa.me/${num}` : '',
				});
			}
		}).catch(() => {});
	}, []);

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || subLoading) return;
		setSubLoading(true);
		const res = await safeFetch(`${API_BASE_URL}/newsletter.php`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "subscribe", email }),
		});
		if (res.status === "success") {
			fireWebhook(WEBHOOK_NEWSLETTER, { email, source: "footer" });
			setSubStatus("success");
			setEmail("");
		} else if ((res.message as string | undefined)?.toLowerCase().includes("already")) {
			setSubStatus("duplicate");
		} else {
			setSubStatus("error");
		}
		setSubLoading(false);
	};

	return (
		<footer className="relative w-full border-t border-border-subtle bg-surface mt-24">
			{/* Top brand glow — 10% accent, very subtle */}
			<div className="pointer-events-none absolute top-0 left-1/2 h-px w-2/5 max-w-xs -translate-x-1/2 bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

			{/* ── Main content ── */}
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-12 lg:px-8 lg:pt-20 lg:pb-16">
				{/* 4-column equal grid: brand+social | nav1 | nav2+resources | newsletter */}
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

					{/* Col 1: Brand + social */}
					<AnimatedContainer className="space-y-6">
						<div className="space-y-4">
							<a href="/" className="group inline-block">
								<span className="text-2xl font-display font-bold text-primary group-hover:text-brand transition-colors duration-300">
									Digi Pexel
								</span>
							</a>
							<p className="text-secondary text-sm leading-relaxed">
								Building the future of AI automation. Transforming businesses through intelligent agents and seamless workflows.
							</p>
						</div>
						{/* Social icons */}
						<div className="flex items-center gap-3">
							{socialLinks.map((social) => {
								const urlMap: Record<string, string> = {
									'Facebook': socialUrls.facebook_url,
									'Instagram': socialUrls.instagram_url,
									'YouTube': socialUrls.youtube_url,
									'LinkedIn': socialUrls.linkedin_url,
									'WhatsApp': socialUrls.whatsapp_url,
								};
								const href = urlMap[social.label] || '';
								if (!href) {
									return (
										<span
											key={social.label}
											aria-label={social.label}
											title={`${social.label} (not configured)`}
											className="w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 cursor-default transition-all duration-300"
										>
											{social.svg}
										</span>
									);
								}
								const isWhatsApp = social.label === 'WhatsApp';
								return (
									<a
										key={social.label}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={social.label}
										className={
											isWhatsApp
												? "w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 hover:text-[#25D366] hover:border-[#25D366]/40 transition-all duration-300"
												: "w-9 h-9 rounded-lg border border-border-subtle flex items-center justify-center text-secondary/60 hover:text-brand hover:border-brand/30 transition-all duration-300"
										}
									>
										{social.svg}
									</a>
								);
							})}
						</div>
					</AnimatedContainer>

					{/* Col 2: Services nav links */}
					<AnimatedContainer delay={0.1} className="space-y-5">
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/50">
							{navLinks[0].label}
						</p>
						<ul className="space-y-3">
							{navLinks[0].links.map((link) => (
								<li key={link.title}>
									<a href={link.href} className="text-sm text-secondary/70 hover:text-brand transition-colors duration-200">
										{link.title}
									</a>
								</li>
							))}
						</ul>
					</AnimatedContainer>

					{/* Col 3: Company + Resources nav links */}
					<AnimatedContainer delay={0.18} className="space-y-8">
						{navLinks.slice(1).map((section) => (
							<div key={section.label} className="space-y-5">
								<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/50">
									{section.label}
								</p>
								<ul className="space-y-3">
									{section.links.map((link) => (
										<li key={link.title}>
											<a href={link.href} className="text-sm text-secondary/70 hover:text-brand transition-colors duration-200">
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</AnimatedContainer>

					{/* Col 4: Newsletter */}
					<AnimatedContainer delay={0.26} className="space-y-4">
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/50">
							Stay in the Loop
						</p>
						<p className="text-sm text-secondary/70 leading-relaxed">
							Weekly insights on AI automation, workflows, and agency growth.
						</p>
						{subStatus === "success" ? (
							<div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
								<span className="text-emerald-500 text-base mt-0.5">✓</span>
								<div>
									<p className="text-sm font-semibold text-emerald-700">You&apos;re in!</p>
									<p className="text-xs text-emerald-600/80 mt-0.5">Check your inbox for a confirmation.</p>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubscribe} className="flex flex-col gap-2">
								<input
									type="email"
									placeholder="Your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									aria-label="Email address for newsletter"
									className="w-full bg-white/5 border border-border-subtle rounded-xl px-4 py-2.5 text-sm text-primary placeholder:text-secondary/40 focus:outline-none focus:border-brand/30 focus:ring-2 focus:ring-brand/10"
								/>
								<button
									type="submit"
									disabled={subLoading}
									className="w-full px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition-colors disabled:opacity-60"
								>
									{subLoading ? "Subscribing…" : "Subscribe"}
								</button>
								{subStatus === "duplicate" && (
									<div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
										<span className="text-amber-500 text-sm">!</span>
										<p className="text-xs text-amber-700">This email is already subscribed.</p>
									</div>
								)}
								{subStatus === "error" && (
									<div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2.5">
										<span className="text-rose-500 text-sm">✕</span>
										<p className="text-xs text-rose-700">Something went wrong. Please try again.</p>
									</div>
								)}
							</form>
						)}
					</AnimatedContainer>
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
