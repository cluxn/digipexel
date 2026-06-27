/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.digipexel.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: '/admin/' },
    ],
  },
  exclude: [
    '/admin',
    '/admin/*',
    '/thank-you',
    '/thank-you/',
    '/ai-seo',
    '/ai-seo/',
    '/icon.svg',
  ],
  transform: async (config, path) => {
    const p = path.replace(/\/$/, '') || '/';
    const highPriority = ['/', '/contact-us'];
    const medPriority = ['/blog', '/case-studies', '/guides', '/testimonials'];
    const isService = p.startsWith('/services/') && p !== '/services';
    const isContent = (
      (p.startsWith('/blog/') && p !== '/blog') ||
      (p.startsWith('/case-studies/') && p !== '/case-studies') ||
      (p.startsWith('/guides/') && p !== '/guides')
    );
    const isLegal = p === '/privacy-policy' || p === '/terms-and-conditions';

    let priority = 0.6;
    let changefreq = 'monthly';

    if (highPriority.includes(p)) { priority = p === '/' ? 1.0 : 0.8; changefreq = 'weekly'; }
    else if (medPriority.includes(p)) { priority = 0.8; changefreq = 'weekly'; }
    else if (isService) { priority = 0.9; changefreq = 'monthly'; }
    else if (isContent) { priority = 0.7; changefreq = 'weekly'; }
    else if (isLegal) { priority = 0.3; changefreq = 'yearly'; }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
}
