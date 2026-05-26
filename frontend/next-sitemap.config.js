/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://digipexel.cluxn.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
    additionalSitemaps: ['https://digipexel.com/sitemap.xml'],
  },
  exclude: [
    '/admin',
    '/admin/*',
    '/thank-you',
  ],
}
