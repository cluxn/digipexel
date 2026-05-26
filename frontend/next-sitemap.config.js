/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.digipexel.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
    additionalSitemaps: ['https://www.digipexel.com/sitemap.xml'],
  },
  exclude: [
    '/admin',
    '/admin/*',
    '/thank-you',
  ],
}
