/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://digipexel.cluxn.com',
  generateRobotsTxt: true,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/admin/' },
    ],
    additionalSitemaps: ['https://digipexel.cluxn.com/sitemap.xml'],
  },
  exclude: [
    '/admin',
    '/admin/*',
    '/thank-you',
  ],
}
