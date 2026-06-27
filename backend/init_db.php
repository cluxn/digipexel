<?php
// backend/init_db.php
// Protect against public access — require a secret token in the query string.
// Set INIT_DB_SECRET as an env var on the server, then call: /backend/init_db.php?token=YOUR_SECRET
$expected_token = getenv('INIT_DB_SECRET') ?: '';
if ($expected_token === '' || ($_GET['token'] ?? '') !== $expected_token) {
    http_response_code(403);
    die(json_encode(['status' => 'error', 'message' => 'Forbidden']));
}

require_once 'config.php';

// Helper: run a single statement, die with a clear message on failure.
function run(PDO $pdo, string $sql, string $label = ''): void {
    try {
        $pdo->exec($sql);
    } catch (PDOException $e) {
        // Ignore "duplicate column" (1060) — column already exists from a previous deploy.
        if ($e->getCode() == '42S21' || strpos($e->getMessage(), '1060') !== false) return;
        die(($label ? "$label: " : '') . $e->getMessage());
    }
}

try {

    // ── 1. Create tables (each exec is a single statement — safe on all PHP/MySQL versions) ──

    run($pdo, "CREATE TABLE IF NOT EXISTS logos (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        name         VARCHAR(255) NOT NULL,
        src          TEXT NOT NULL,
        display_type ENUM('image','text','both') DEFAULT 'image',
        position     INT DEFAULT 0
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS leads (
        id             INT AUTO_INCREMENT PRIMARY KEY,
        full_name      VARCHAR(255) NOT NULL,
        email          VARCHAR(255),
        company        VARCHAR(255),
        contact_number VARCHAR(100),
        service        VARCHAR(255),
        message        TEXT,
        status         ENUM('new','contacted','archived') DEFAULT 'new',
        created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS guides (
        id               INT AUTO_INCREMENT PRIMARY KEY,
        title            VARCHAR(255) NOT NULL,
        slug             VARCHAR(255) UNIQUE NOT NULL,
        subtitle         VARCHAR(255),
        description      TEXT,
        content          LONGTEXT,
        image_url        TEXT,
        image_size       VARCHAR(20) DEFAULT 'md',
        category         VARCHAR(100),
        cta_label        VARCHAR(100) DEFAULT 'Download Guide',
        cta_link         TEXT,
        file_url         TEXT,
        pages_count      VARCHAR(20),
        format           VARCHAR(20) DEFAULT 'PDF',
        chapters         LONGTEXT,
        benefits         LONGTEXT,
        position         INT DEFAULT 0,
        status           VARCHAR(20) DEFAULT 'published',
        author_name      VARCHAR(255) DEFAULT 'Digi Pexel Team',
        published_at     DATE,
        scheduled_at     DATETIME,
        meta_title       VARCHAR(255),
        meta_description TEXT,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS testimonials (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        name            VARCHAR(255) NOT NULL,
        role            VARCHAR(255),
        company         VARCHAR(255),
        content         TEXT NOT NULL,
        image_url       TEXT,
        category        VARCHAR(100),
        star_rating     TINYINT DEFAULT 5,
        video_url       TEXT,
        logo_url        TEXT,
        display_context VARCHAR(100) DEFAULT 'homepage,testimonials-page',
        position        INT DEFAULT 0,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS testimonials_focus (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        type          ENUM('logo','video','photo') DEFAULT 'logo',
        url           TEXT,
        thumbnail_url TEXT,
        label         VARCHAR(255),
        position      INT DEFAULT 0,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS blogs (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255) NOT NULL,
        slug        VARCHAR(255) UNIQUE NOT NULL,
        eyebrow     VARCHAR(255),
        subtitle    VARCHAR(255),
        excerpt     TEXT,
        content     LONGTEXT,
        image_url   TEXT,
        category    VARCHAR(100),
        tags        TEXT,
        author_name VARCHAR(255) DEFAULT 'Digi Pexel Team',
        author_role VARCHAR(255),
        author_image TEXT,
        read_time   VARCHAR(50),
        status      VARCHAR(20) DEFAULT 'published',
        sections    LONGTEXT,
        position    INT DEFAULT 0,
        published_at DATE,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS case_studies (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        title         VARCHAR(255) NOT NULL,
        slug          VARCHAR(255) UNIQUE NOT NULL,
        eyebrow       VARCHAR(255),
        subtitle      VARCHAR(255),
        description   TEXT,
        client_name   VARCHAR(255),
        industry      VARCHAR(100),
        image_url     TEXT,
        hero_cta_label VARCHAR(100),
        hero_cta_url  TEXT,
        hero_stats    LONGTEXT,
        sections      LONGTEXT,
        status        VARCHAR(20) DEFAULT 'published',
        position      INT DEFAULT 0,
        published_date DATE,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS site_content (
        section    VARCHAR(50) PRIMARY KEY,
        content    LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS settings (
        `key`   VARCHAR(50) PRIMARY KEY,
        `value` TEXT
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        email         VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status        ENUM('active','unsubscribed') DEFAULT 'active'
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS service_content (
        slug       VARCHAR(50)  NOT NULL,
        section    VARCHAR(50)  NOT NULL,
        content    LONGTEXT     NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (slug, section)
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS users (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        designation   VARCHAR(255),
        login_id      VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS analytics_codes (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        code_key   VARCHAR(50) UNIQUE NOT NULL,
        code_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS banners (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        config_key   VARCHAR(50) UNIQUE NOT NULL,
        config_value LONGTEXT,
        updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    run($pdo, "CREATE TABLE IF NOT EXISTS seo_meta (
        page_key         VARCHAR(100) PRIMARY KEY,
        seo_title        VARCHAR(255),
        meta_description TEXT,
        og_image         TEXT,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");

    // ── 2. Add any columns that older deployments may be missing (safe — ignores duplicate-column errors) ──

    run($pdo, "ALTER TABLE leads MODIFY COLUMN email VARCHAR(255)");
    run($pdo, "ALTER TABLE leads MODIFY COLUMN status VARCHAR(50) DEFAULT 'new'");
    run($pdo, "ALTER TABLE leads ADD COLUMN source VARCHAR(100) DEFAULT ''");
    run($pdo, "ALTER TABLE leads ADD COLUMN role VARCHAR(255)");
    run($pdo, "ALTER TABLE leads ADD COLUMN follow_up_date DATE");
    run($pdo, "ALTER TABLE leads ADD COLUMN notes TEXT");
    run($pdo, "ALTER TABLE newsletter_subscribers ADD COLUMN source VARCHAR(100) DEFAULT 'website'")
    run($pdo, "ALTER TABLE testimonials ADD COLUMN star_rating TINYINT DEFAULT 5");
    run($pdo, "ALTER TABLE testimonials ADD COLUMN video_url TEXT");
    run($pdo, "ALTER TABLE testimonials ADD COLUMN logo_url TEXT");
    run($pdo, "ALTER TABLE testimonials ADD COLUMN display_context VARCHAR(100) DEFAULT 'homepage,testimonials-page'");
    run($pdo, "ALTER TABLE blogs ADD COLUMN eyebrow VARCHAR(255)");
    run($pdo, "ALTER TABLE blogs ADD COLUMN subtitle VARCHAR(255)");
    run($pdo, "ALTER TABLE blogs ADD COLUMN author_name VARCHAR(255) DEFAULT 'Digi Pexel Team'");
    run($pdo, "ALTER TABLE blogs ADD COLUMN author_role VARCHAR(255)");
    run($pdo, "ALTER TABLE blogs ADD COLUMN author_image TEXT");
    run($pdo, "ALTER TABLE blogs ADD COLUMN read_time VARCHAR(50)");
    run($pdo, "ALTER TABLE blogs ADD COLUMN status VARCHAR(20) DEFAULT 'published'");
    run($pdo, "ALTER TABLE blogs ADD COLUMN sections LONGTEXT");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN eyebrow VARCHAR(255)");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN hero_cta_label VARCHAR(100)");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN hero_cta_url TEXT");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN hero_stats LONGTEXT");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN sections LONGTEXT");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN status VARCHAR(20) DEFAULT 'published'");
    run($pdo, "ALTER TABLE case_studies ADD COLUMN published_date DATE");
    run($pdo, "ALTER TABLE guides ADD COLUMN status VARCHAR(20) DEFAULT 'published'");
    run($pdo, "ALTER TABLE guides ADD COLUMN author_name VARCHAR(255) DEFAULT 'Digi Pexel Team'");
    run($pdo, "ALTER TABLE guides ADD COLUMN published_at DATE");
    run($pdo, "ALTER TABLE guides ADD COLUMN scheduled_at DATETIME");
    run($pdo, "ALTER TABLE guides ADD COLUMN meta_title VARCHAR(255)");
    run($pdo, "ALTER TABLE guides ADD COLUMN meta_description TEXT");

    // Promote any guide rows with null/empty status to 'published' (legacy rows)
    run($pdo, "UPDATE guides SET status = 'published' WHERE status IS NULL OR status = ''");

    // ── 3. Seed default data — INSERT IGNORE / INSERT...WHERE NOT EXISTS: never overwrites admin edits ──

    // Logos
    $logos = [
        ['Zapier',     'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg',            'image', 0],
        ['HubSpot',    'https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg',           'image', 1],
        ['Salesforce', 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg',   'image', 2],
        ['Google Ads', 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Ads_logo.svg',       'image', 3],
        ['Meta',       'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', 'image', 4],
        ['Slack',      'https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg', 'image', 5],
        ['OpenAI',     '', 'text', 6],
        ['Anthropic',  '', 'text', 7],
        ['n8n',        '', 'text', 8],
        ['Microsoft',  '', 'text', 9],
        ['Make',       '', 'text', 10],
    ];
    $logoStmt = $pdo->prepare("INSERT IGNORE INTO logos (name, src, display_type, position) VALUES (?,?,?,?)");
    foreach ($logos as $l) $logoStmt->execute($l);

    // Analytics codes
    foreach (['google_analytics', 'search_console', 'custom_head_scripts'] as $key) {
        $pdo->prepare("INSERT IGNORE INTO analytics_codes (code_key, code_value) VALUES (?, '')")->execute([$key]);
    }

    // Banners
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['banner',     '{"enabled":false,"text":"AI automation audit slots open for next week.","ctaLabel":"Book a Call","ctaLink":"/contact-us","bgColor":"#2563EB"}']);
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['popup',      '{"enabled":false,"title":"Ready to automate your ops?","body":"Get a 20-minute discovery call and a quick automation roadmap.","ctaLabel":"Schedule a Call","ctaLink":"/contact-us","delayMs":5000}']);
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['exit_popup', '{"enabled":false,"title":"Before you go","body":"Want a quick audit checklist? We will send it in minutes.","ctaLabel":"Get the Checklist","ctaLink":"/contact-us"}']);

    // Settings — INSERT IGNORE so admin changes are never overwritten
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['admin_passcode',  'ChangeMe@123']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['whatsapp_number', '']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['whatsapp_enabled','true']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['calendly_url',    '']);
    // General contact
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['company_email',   '']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['company_phone',   '']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['company_address', '']);
    // Social
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['twitter_url',     '']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['logo_url',        '']);
    // Appearance
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['site_name',       'Digi Pexel']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['tagline',         'Building the future of AI automation.']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['default_cta_link','/contact-us']);
    // Cookie consent
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['cookie_consent_enabled',   'false']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['cookie_consent_text',      'We use cookies to improve your experience. By continuing, you agree to our Privacy Policy.']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['cookie_consent_link_text', 'Privacy Policy']);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['cookie_consent_link_url',  '/privacy-policy']);
    // SEO extras
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['robots_txt',      "User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://www.digipexel.com/sitemap.xml"]);
    $pdo->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)")->execute(['url_redirects',   '[]']);
    // Marketing extras
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['nudge',      '{"enabled":false,"message":"Limited automation audit slots available this week!","ctaLabel":"Claim your spot","ctaLink":"/contact-us","position":"bottom-right","delayMs":3000}']);
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['mini_ctas',  '{"items":[{"label":"Free Audit","url":"/contact-us"},{"label":"Book a Call","url":"/contact-us"}]}']);
    $pdo->prepare("INSERT IGNORE INTO banners (config_key, config_value) VALUES (?, ?)")->execute(['lead_form',  '{"heading":"Ready to automate your ops?","subtext":"Fill in your details and we will send a custom automation roadmap in 24 hours.","ctaLabel":"Send My Roadmap","fields":["name","email","company","phone","service"]}']);

    // Admin user — seed only on first run, never overwrite
    $existingUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($existingUsers === 0) {
        $pdo->prepare("INSERT INTO users (name, designation, login_id, password_hash) VALUES (?,?,?,?)")
            ->execute(['Admin', 'Founder', 'info@digipexel.com', password_hash('ChangeMe@123', PASSWORD_DEFAULT)]);
    }

    // Testimonials — seed only if table is empty
    $existingTestimonials = (int)$pdo->query("SELECT COUNT(*) FROM testimonials")->fetchColumn();
    if ($existingTestimonials === 0) {
        $tStmt = $pdo->prepare("INSERT INTO testimonials (id,name,role,company,content,image_url,category,star_rating,video_url,logo_url,display_context,position) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)");
        $testimonials = [
            [1,'Aarav Mehta','COO','Lumina Health','Digi Pexel replaced manual handoffs with AI workflows. Our operations now run in half the time with clear ownership.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150','Healthcare',5,'','','homepage,testimonials-page',0],
            [2,'Priya Nair','Head of Ops','Arrow Logistics','The automation system removed our QA bottleneck. We ship faster and miss fewer deadlines.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150','Logistics',5,'','','homepage,testimonials-page',1],
            [3,'Kabir Singh','VP Growth','Northbridge SaaS','AI-driven lead workflows turned our response time from hours to minutes. Pipeline quality improved immediately.','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150','SaaS',5,'','','homepage,testimonials-page',2],
            [4,'Neha Joshi','Director','FinOps Hub','Reconciliation workflows now run nightly without human intervention. We trust the numbers every morning.','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150','Finance',5,'','','homepage,testimonials-page',3],
            [5,'Zara Sheikh','Product Lead','CloudNorth','The AI workflows reduced escalation volume by 60%. Our support team focuses on high-value cases now.','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150','SaaS',5,'','','homepage,testimonials-page',4],
            [6,'Rahul Verma','Head of RevOps','Signalstack','We finally have a clean pipeline and predictable follow-up. The automation stack just works.','https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150','SaaS',5,'','','homepage,testimonials-page',5],
            [7,'Anika Roy','Operations Manager','Crest Labs','Our onboarding workflows went from chaotic to repeatable. New hires ramp in days, not weeks.','https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150','Healthcare',5,'','','homepage,testimonials-page',6],
            [8,'Vikram Patel','CEO','Atlas Retail','Digi Pexel delivered a complete automation roadmap and executed it on time. The results are visible weekly.','https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150','Retail',5,'','','homepage,testimonials-page',7],
            [9,'Amit Saxena','CEO','TechFlow','The automation workflows implemented by Digi Pexel save our team dozens of hours every week.','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150','Technology',5,'','','homepage,testimonials-page',8],
            [10,'Sarah Chen','Product Manager','Stripe','The AI workflows implemented by Digi Pexel transformed our support operations. We reduced response times by 70% while improving customer satisfaction scores.','https://i.pravatar.cc/150?u=sarah','Fintech',5,'','','testimonials-page',9],
            [11,'Marcus Rodriguez','Founder','GrowthLoop','We tried building internal AI systems for 6 months with no luck. Digi Pexel delivered a production-ready lead scoring agent in 3 weeks.','https://i.pravatar.cc/150?u=marcus','SaaS',5,'','','testimonials-page',10],
            [12,'Emma Watson','Director of Marketing','Adobe','Their AI SEO strategy is light years ahead. We went from zero AI citations to being the top result for critical industry prompts.','https://i.pravatar.cc/150?u=emma','Enterprise',5,'','','testimonials-page',11],
            [13,'David Miller','COO','NexGen Logistics','Automating our route optimization with AI Agents has cut fuel costs by 18% and saved countless manual planning hours.','https://i.pravatar.cc/150?u=david','Logistics',5,'','','testimonials-page',12],
            [14,'Lisa Wong','Head of Success','ScaleFlow','Digi Pexel didn\'t just give us tools; they gave us a complete automation architecture that scales as we grow.','https://i.pravatar.cc/150?u=lisa','Technology',5,'','','testimonials-page',13],
            [15,'James Anderson','Managing Director','Apex Capital','Zero-touch accounting workflows have revolutionized our month-end close. No more manual data entry errors.','https://i.pravatar.cc/150?u=james','Finance',5,'','','testimonials-page',14],
            [16,'Sophie Bennett','CTO','DataVise','The reliability of the agents Digi Pexel built is unprecedented. We\'ve had zero downtime in 6 months of operation.','https://i.pravatar.cc/150?u=sophie','Cloud',5,'','','testimonials-page',15],
            [17,'Thomas Wright','VP Marketing','Vividly','Our content production quadrupled without adding a single head to the team. The AI coordination is seamless.','https://i.pravatar.cc/150?u=thomas','Marketing',5,'','','testimonials-page',16],
            [18,'Elena Petrova','Strategy Lead','GlobalNet','Digi Pexel is the only agency we\'ve found that actually understands how to make LLMs safe for enterprise data.','https://i.pravatar.cc/150?u=elena','Security',5,'','','testimonials-page',17],
        ];
        foreach ($testimonials as $t) $tStmt->execute($t);
    }

    // Blogs — INSERT IGNORE (idempotent)
    $bStmt = $pdo->prepare("INSERT IGNORE INTO blogs (title,slug,eyebrow,subtitle,excerpt,content,image_url,category,tags,author_name,author_role,read_time,status,sections,position,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $blogs = [
        ['How AI Automation Eliminates 14 Hours of Manual Work Per Week','ai-automation-eliminates-manual-work','AI Strategy','A practical breakdown of the automation stack that reclaims lost productivity','Every knowledge worker loses hours each week on repetitive tasks. Here is how to reclaim that time with autonomous AI workflows.','','https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800','AI Strategy','automation, AI, workflows, productivity','Digi Pexel Team','AI Automation Specialists','8 min read','published','[{"id":"s1","type":"overview","title":"The Hidden Cost of Manual Operations","content":"Research shows knowledge workers spend 40% of their time on low-value repetitive tasks.","points":["14 hours/week lost to manual handoffs per employee","73% of repetitive tasks are automatable with current AI tools","Teams with automation report 3x faster output cycles"]},{"id":"s2","type":"challenge","title":"Why Most Automation Projects Fail","content":"The challenge is not the technology — it is the implementation strategy.","points":["Siloed tools with no shared data layer","No error handling or fallback logic","Humans still required for edge cases with no escalation path"]},{"id":"s3","type":"solution","title":"The Connected Automation Stack","content":"Effective automation operates as a system.","points":["Event-driven triggers that respond to real data changes","LLM decision layer for intelligent routing","Human-in-the-loop checkpoints for high-stakes decisions"]},{"id":"s4","type":"mid_cta","cta_text":"Want a free automation audit for your business?","cta_label":"Book a Strategy Call"}]',0,'2025-03-14'],
        ['SEO in the Age of AI: How to Win When LLMs Answer Instead of Google','seo-age-of-ai-llm-answers','SEO Strategy','Generative Engine Optimisation explained for B2B decision makers','Search is changing. AI assistants now answer questions directly. Here is how to ensure your brand is the one they cite.','','https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800','SEO','SEO, GEO, AI search, LLM, content strategy','Digi Pexel Team','AI SEO Specialists','7 min read','published','[{"id":"s1","type":"overview","title":"The Zero-Click Revolution","content":"Over 40% of Google searches now end without a click.","points":["40%+ of searches end without a click","AI assistants cite 3-5 sources per answer","B2B buyers use AI tools for research before contacting vendors"]},{"id":"s2","type":"challenge","title":"Why Traditional SEO Is Not Enough","content":"Classic on-page SEO and backlinks still matter, but they do not guarantee AI citation.","points":["Keyword density does not drive LLM citations","Backlink authority is a weak signal for AI answers","Structured, entity-rich content outperforms thin pages"]},{"id":"s3","type":"solution","title":"Generative Engine Optimisation (GEO)","content":"GEO is the practice of optimising content so AI assistants cite your brand.","points":["Build topical authority through entity mapping","Use schema markup to signal structured facts","Publish comprehensive pillar content that LLMs can summarise","Earn citations from high-authority sources in your niche"]},{"id":"s4","type":"mid_cta","cta_text":"Want an AI visibility audit for your brand?","cta_label":"Book a Free Strategy Call"}]',1,'2025-04-02'],
        ['How to Evaluate an AI Automation Agency: 8 Questions Every COO Must Ask','evaluate-ai-automation-agency-coo-guide','Buyer Guide','A no-fluff framework for vetting vendors before you sign a contract','Most agencies overpromise and underdeliver on AI. Here is exactly what to ask before committing budget.','','https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800','Strategy','AI agency, vendor selection, COO, automation ROI, due diligence','Digi Pexel Team','AI Strategy Consultants','6 min read','published','[{"id":"s1","type":"overview","title":"Why Most AI Projects Fail at the Vendor Stage","content":"Gartner reports that over 80% of AI projects fail to reach production.","points":["80% of AI projects fail before production launch","Vendor overpromising is the leading risk factor","Scoping misalignment costs 3-6 months of wasted sprint time"]},{"id":"s2","type":"challenge","title":"The 8 Questions","content":"Ask these in your first discovery call.","points":["Q1: Show me a workflow you built for a company in my industry.","Q2: What does your error handling and monitoring architecture look like?","Q3: How do you handle a workflow that breaks at 2am on a Sunday?","Q4: What is your standard SLA for uptime on production automations?","Q5: Can you walk me through your data security and access control model?","Q6: What does your off-boarding process look like if we end the engagement?","Q7: How do you measure ROI, and at what cadence do you report it?","Q8: Who on your team will own our account day-to-day?"]},{"id":"s3","type":"mid_cta","cta_text":"Want to see how Digi Pexel answers every one of these questions?","cta_label":"Book a Discovery Call"}]',2,'2025-04-18'],
        ['CRM-to-Campaign in 12 Days: The Automation Stack That Runs Your Outbound','crm-to-campaign-automation-stack','Growth Ops','How modern B2B teams wire HubSpot, LinkedIn, and AI into a single outbound engine','Stop running campaigns manually. Here is the exact automation stack that moves CRM signals into personalised outreach without touching a spreadsheet.','','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800','Growth','CRM automation, HubSpot, outbound, sales ops, lead nurturing','Digi Pexel Team','Growth Automation Engineers','9 min read','published','[{"id":"s1","type":"overview","title":"The Broken Outbound Loop","content":"The average B2B sales team manually exports CRM lists and pastes them into a sequencer.","points":["Average CRM export to first outreach: 4.2 days","40% of warm CRM leads never receive a follow-up within 24 hours","Sales reps spend 2.5 hours per day on manual data tasks"]},{"id":"s2","type":"challenge","title":"The Stack","content":"You do not need to rip out your existing CRM.","points":["CRM: HubSpot or Salesforce with webhook support","Orchestration: n8n Cloud or Make.com for workflow logic","Personalisation: OpenAI API for context-aware message generation","Delivery: LinkedIn via approved API or cold email via SMTP relay"]},{"id":"s3","type":"metrics","title":"What to Expect After 30 Days Live","content":"Benchmarks from Digi Pexel clients running this stack.","metrics":[{"value":"34%","label":"Reply rate","desc":"Up from 8% baseline"},{"value":"<2 hrs","label":"CRM-to-outreach","desc":"Down from 4+ days"},{"value":"2.8x","label":"Pipeline volume","desc":"Same team, same headcount"},{"value":"12 days","label":"Deploy time","desc":"From kickoff to live"}]},{"id":"s4","type":"mid_cta","cta_text":"Want this stack built for your team?","cta_label":"Book a Build Call"}]',3,'2025-05-06'],
    ];
    foreach ($blogs as $b) $bStmt->execute($b);

    // Case studies — INSERT IGNORE (idempotent)
    $csStmt = $pdo->prepare("INSERT IGNORE INTO case_studies (title,slug,eyebrow,subtitle,description,client_name,industry,image_url,hero_cta_label,hero_cta_url,hero_stats,sections,status,position,published_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $caseStudies = [
        ['How FinFlows Automated 90% of Their Back-Office Operations','finflows-back-office-automation','Case Study','AI-powered workflow automation that eliminated manual processing and cut operational costs by 60%.','FinFlows, a fast-growing fintech platform, partnered with Digi Pexel to automate their loan processing, KYC verification, and monthly reporting pipelines.','FinFlows Inc.','Fintech','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80','Start Your Project','/contact-us','[{"label":"Ops Cost Reduction","value":"60%"},{"label":"Processes Automated","value":"40+"},{"label":"Hours Saved / Week","value":"320h"},{"label":"ROI in 90 Days","value":"4.2x"}]','[{"id":"c1","type":"challenge","title":"The Problem: Manual Overload","content":"The FinFlows ops team was spending 320 hours per week on manual loan processing.","points":["48-hour average KYC verification time","12% error rate on manual data entry","Compliance reporting took 3 full-time employees"]},{"id":"c2","type":"solution","title":"The Approach: Autonomous Agent Stack","content":"Digi Pexel designed a multi-agent automation system.","points":["Custom AI agent for document parsing","Automated KYC decision routing","Real-time compliance report generation"]},{"id":"c3","type":"metrics","title":"Results After 90 Days","content":"Measured against pre-deployment baseline.","metrics":[{"value":"60%","label":"Ops cost reduction","desc":"Year-one savings"},{"value":"4 hrs","label":"KYC verification","desc":"Down from 48 hours"},{"value":"99.1%","label":"Data accuracy","desc":"Up from 88%"},{"value":"4.2x","label":"ROI","desc":"Within 90 days"}]}]','published',0,'2025-03-14'],
        ['How GrowthLoop Scaled LinkedIn Outreach 10x Without Hiring','growthloop-linkedin-scale','Case Study','AI-driven social selling automation that tripled qualified pipeline in 60 days.','GrowthLoop, a B2B SaaS company, needed to scale their outbound pipeline without expanding their SDR team.','GrowthLoop','B2B SaaS','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80','Start Your Project','/contact-us','[{"label":"Pipeline Growth","value":"3x"},{"label":"SDR Hours Saved","value":"120/wk"},{"label":"Response Rate","value":"34%"},{"label":"Time to Deploy","value":"3 wks"}]','[{"id":"c1","type":"challenge","title":"The Problem: Outbound at a Ceiling","content":"GrowthLoop had a skilled but overloaded SDR team.","points":["SDRs spending 5+ hours daily on manual list building","Inconsistent follow-up cadence losing warm leads","Personalisation at scale impossible without automation"]},{"id":"c2","type":"solution","title":"The Approach: AI Social Selling Engine","content":"We built an autonomous LinkedIn prospecting workflow.","points":["AI personalisation engine generating custom openers","Intent-based prioritisation surfacing high-signal accounts daily","Automated multi-touch sequences with human handoff triggers"]},{"id":"c3","type":"metrics","title":"Results After 60 Days","content":"Measured against the 60-day pre-deployment baseline.","metrics":[{"value":"3x","label":"Qualified pipeline","desc":"vs. prior period"},{"value":"34%","label":"Response rate","desc":"From 11% baseline"},{"value":"120 hrs","label":"SDR time saved","desc":"Per week across team"},{"value":"3 wks","label":"Deployment time","desc":"From kickoff to live"}]}]','published',1,'2025-04-10'],
        ['How MediTrack Cut Patient Onboarding From 9 Days to 6 Hours','meditrack-patient-onboarding-automation','Case Study','AI-powered document intake and verification that eliminated manual processing across 4 clinic locations.','MediTrack, a multi-location healthcare SaaS provider, engaged Digi Pexel to automate their patient onboarding pipeline.','MediTrack Health','Healthcare SaaS','https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80','Start Your Project','/contact-us','[{"label":"Onboarding Time","value":"-93%"},{"label":"Manual Steps Eliminated","value":"28"},{"label":"Staff Hours Saved/Wk","value":"210h"},{"label":"Error Rate","value":"0.3%"}]','[{"id":"c1","type":"challenge","title":"The Problem: 9-Day Onboarding Backlog","content":"MediTrack staff were spending 9 days on average processing each new patient.","points":["9-day average patient onboarding cycle","4.2% data entry error rate causing claim rejections","210 staff hours per week lost to manual intake tasks"]},{"id":"c2","type":"solution","title":"The Approach: Document AI + Eligibility Automation","content":"Digi Pexel deployed a multi-stage AI pipeline.","points":["Document parsing agent extracting 40+ data fields","Real-time insurance eligibility verification","Automated EHR record creation","Human review queue for less than 3% of edge cases"]},{"id":"c3","type":"metrics","title":"Results After 60 Days Live","content":"Measured against the 60-day pre-deployment baseline.","metrics":[{"value":"6 hrs","label":"Onboarding time","desc":"Down from 9 days"},{"value":"0.3%","label":"Data error rate","desc":"Down from 4.2%"},{"value":"210 hrs","label":"Staff time reclaimed","desc":"Per week across locations"},{"value":"$340k","label":"Annual cost saving","desc":"Projected year-one"}]}]','published',2,'2025-04-28'],
        ['How NexaRetail Automated Inventory Reporting and Saved 480 Ops Hours Monthly','nexaretail-inventory-reporting-automation','Case Study','Replacing weekly manual inventory reconciliation with a fully autonomous AI reporting pipeline.','NexaRetail, a fast-growing D2C brand, partnered with Digi Pexel to automate their inventory reconciliation and supplier reorder workflows.','NexaRetail','E-Commerce / Retail','https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80','Start Your Project','/contact-us','[{"label":"Ops Hours Saved/Mo","value":"480h"},{"label":"Stockout Incidents","value":"-78%"},{"label":"Report Accuracy","value":"99.7%"},{"label":"Deployment Time","value":"4 wks"}]','[{"id":"c1","type":"challenge","title":"The Problem: 120-Hour Monthly Reconciliation Drain","content":"NexaRetail operations managers were spending 120 hours every month manually reconciling inventory.","points":["120 hours/month on manual inventory reconciliation","Average 3-day lag between stockout and reorder trigger","18% of weekly reports contained at least one material error"]},{"id":"c2","type":"solution","title":"The Approach: Unified Inventory Intelligence Layer","content":"Digi Pexel built an automation layer that pulls live inventory data.","points":["Unified API sync across Shopify, WMS, and 3PL portals every 4 hours","AI reconciliation engine flagging discrepancies within 15 minutes","Automated supplier reorder emails with PO draft generation","Daily and weekly summary dashboards emailed to leadership at 7am"]},{"id":"c3","type":"metrics","title":"Results After 30 Days Live","content":"Measured against the 30-day pre-deployment baseline.","metrics":[{"value":"480 hrs","label":"Ops time saved","desc":"Per month total"},{"value":"-78%","label":"Stockout incidents","desc":"vs. prior 30 days"},{"value":"99.7%","label":"Report accuracy","desc":"Up from 82%"},{"value":"4 wks","label":"Time to deploy","desc":"Kickoff to full automation"}]}]','published',3,'2025-05-09'],
    ];
    foreach ($caseStudies as $cs) $csStmt->execute($cs);

    // Migrate guide slugs from old values (safe no-op if already migrated)
    run($pdo, "UPDATE guides SET slug = 'ai-automation-roadmap-12-month-playbook' WHERE slug = 'ai-automation-roadmap-12-month'");
    run($pdo, "UPDATE guides SET slug = 'geo-vs-seo-complete-guide' WHERE slug = 'geo-vs-seo-ai-citation-guide'");

    // Guides — INSERT IGNORE (idempotent)
    $gStmt = $pdo->prepare("INSERT IGNORE INTO guides (title,slug,description,content,image_url,category,cta_label,cta_link,position,status) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $guides = [
        ['The AI Automation Roadmap: A 12-Month Playbook for B2B Teams','ai-automation-roadmap-12-month-playbook','A step-by-step framework for auditing your operations, identifying high-ROI automation opportunities, and building a deployment plan.','<h2>Why Most Automation Projects Fail Before They Start</h2><p>Without a clear audit methodology, companies automate the wrong things first.</p><h2>Phase 1: The Operations Audit</h2><p>Start by mapping every workflow that involves more than 3 manual steps.</p><h2>Phase 2: Tool Selection</h2><p>Match your workflow complexity to the right automation platform.</p>','https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800','Strategy','Read the Playbook','#',0,'published'],
        ['GEO vs SEO: The Complete Guide to Getting Your Brand Cited by AI','geo-vs-seo-complete-guide','Everything B2B marketing leaders need to know about Generative Engine Optimisation.','<h2>The Search Landscape Has Changed</h2><p>When a buyer asks ChatGPT about the best automation agency, they receive a direct answer with 3-5 citations.</p><h2>How AI Assistants Choose Citations</h2><p>LLMs prioritise authoritative domains with strong topical depth.</p>','https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800','SEO','Read the Guide','#',1,'published'],
        ['The AI Vendor Selection Scorecard: 7 Criteria Every Ops Leader Must Evaluate','ai-vendor-selection-scorecard','A structured evaluation framework for B2B operations leaders vetting AI automation partners.','<h2>Why Vendor Selection Is the Highest-Stakes Decision</h2><p>Once you commit to an AI automation vendor, switching costs are high.</p><h2>The 7 Criteria Framework</h2><p>Score vendors across production track record, observability, security, integration depth, team model, pricing, and exit portability.</p>','https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800','Strategy','Download the Scorecard','#',2,'published'],
        ['The 90-Day Ops Transformation Playbook: From Manual to Automated','90-day-ops-transformation-playbook','A week-by-week implementation guide for founders and COOs who want to automate their core operations.','<h2>Why 90 Days Is the Right Horizon</h2><p>90 days is long enough to automate 3-5 high-impact workflows and short enough to maintain executive sponsorship.</p><h2>Month 1: The Audit</h2><p>Map every operational workflow that touches more than 3 people or takes more than 4 hours per week.</p><h2>Month 2: The Build</h2><p>Select your tool stack based on workflow complexity and build in priority order.</p><h2>Month 3: Launch and Validate</h2><p>Soft launch with real data on a shadow pipeline, then go live with full monitoring.</p>','https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800','Operations','Read the Playbook','#',3,'published'],
    ];
    foreach ($guides as $g) $gStmt->execute($g);

    // site_content — INSERT IGNORE: never overwrite content the admin has customised
    $scStmt = $pdo->prepare("INSERT IGNORE INTO site_content (section, content) VALUES (?, ?)");
    $scStmt->execute(['stats',   '{"stats":[{"label":"FASTER SHIPPING","value":"42%","description":"Automation eliminates handoffs and approvals so teams ship at the speed of AI."},{"label":"LOWER OPS COST","value":"28%","description":"Saved on run-rate by removing manual steps, rework, and duplicate tooling."},{"label":"HOURS RECOVERED","value":"12k+","description":"Returned to teams by automating data movement, follow-ups, and reporting."},{"label":"TIME TO DEPLOY","value":"4-6 wks","description":"From discovery to production workflows with full monitoring and governance."}]}']);
    $scStmt->execute(['problem', '{"stat1_value":"14 hrs","stat1_detail":"lost per team / week","stat1_title":"Handoff Friction","stat1_body":"Every tool switch and status update burns hours that should go toward delivering real outcomes.","stat2_value":"6+ tools","stat2_detail":"disconnected on average","stat2_title":"Siloed Systems","stat2_body":"Fragmented data means your AI can\'t see the full picture.","stat3_value":"40%","stat3_detail":"of all work is rework","stat3_title":"Manual Rework","stat3_body":"Teams spend nearly half their time re-entering or reformatting information that already exists somewhere else."}']);

    // service_content — INSERT IGNORE (idempotent, never overwrites admin edits)
    $svcStmt = $pdo->prepare("INSERT IGNORE INTO service_content (slug, section, content) VALUES (?, ?, ?)");

    $services = [
        'ai-seo' => [
            'hero'          => '{"badge":"AI SEO Automation","heroLine1":"Stop optimizing for bots.","heroLine2":"Start winning AI answers.","heroCopy":"We build AI-ready content systems that make your brand the default citation across search assistants, copilots, and LLM-driven research.","ctaPrimary":"Book a Strategy Call","pills":["GEO Strategy","Entity Authority","RAG Readiness"],"snapshotTitle":"Live Visibility Snapshot","snapshotRows":["Model citations: 68%","Entity coverage: 92%","Prompt intent match: 84%","Trust signals: 76%"],"statLabel1":"Visibility Delta","statValue1":"+41%","statLabel2":"AI Answer Rate","statValue2":"3.2x"}',
            'features'      => '{"cards":[{"title":"GEO Optimization","description":"Optimize for Generative Engine Results to ensure your brand is cited by LLMs."},{"title":"Entity Authority","description":"Map your content to semantic entities to build topical authority that AI understands."},{"title":"Automated Content Loop","description":"A system that continuously updates content based on AI search trends and intent."}]}',
            'roadmap'       => '{"roadmapTitle":"The 6-step delivery","roadmapTitleAccent":"roadmap","roadmapCopy":"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.","items":[{"step":"01","title":"Discovery","desc":"Process auditing & feasibility"},{"step":"02","title":"Architecture","desc":"Logic mapping & tool selection"},{"step":"03","title":"Engineering","desc":"Build & data integration"},{"step":"04","title":"Validation","desc":"Security audit & QA testing"},{"step":"05","title":"Deployment","desc":"Live launch & pilot monitoring"},{"step":"06","title":"Scale","desc":"Performance tuning & expansion"}]}',
            'market_impact' => '{"outcomesTitle":"Partnering for","outcomesTitleAccent":"high-velocity growth","outcomesCopy":"We help modern teams ship faster without increasing headcount or complexity.","cards":[{"quote":"We removed the manual bottlenecks and shipped weekly.","company":"Atlas Studio","sector":"Operations","metricValue":"2x","metricLabel":"Throughput"},{"quote":"Quality improved while cycle time dropped.","company":"Signal Ops","sector":"Delivery","metricValue":"-38%","metricLabel":"Cycle time"}],"stats":[{"value":"2x","label":"Throughput"},{"value":"38%","label":"Faster cycles"},{"value":"6","label":"Weeks to launch"},{"value":"24/7","label":"Monitoring"}]}',
            'cta'           => '{"ctaBadge":"Deployment Ready","ctaTitle":"Ship faster with automation.","ctaCopy":"Get a tailored plan and deployment timeline in days, not weeks."}',
            'testimonials'  => '{"items":[{"quote":"Our brand citations in Perplexity and ChatGPT increased by 140% in just two months.","role":"CEO","company":"Nexus Tech"},{"quote":"The zero-click search visibility we\'ve gained has been a game-changer for our organic traffic.","role":"Marketing Director","company":"Aura Media"}]}',
        ],
    ];

    // Reuse the same hero/roadmap/market_impact/cta defaults for all other services
    $defaultRoadmap      = '{"roadmapTitle":"The 6-step delivery","roadmapTitleAccent":"roadmap","roadmapCopy":"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.","items":[{"step":"01","title":"Discovery","desc":"Process auditing & feasibility"},{"step":"02","title":"Architecture","desc":"Logic mapping & tool selection"},{"step":"03","title":"Engineering","desc":"Build & data integration"},{"step":"04","title":"Validation","desc":"Security audit & QA testing"},{"step":"05","title":"Deployment","desc":"Live launch & pilot monitoring"},{"step":"06","title":"Scale","desc":"Performance tuning & expansion"}]}';
    $defaultMarketImpact = '{"outcomesTitle":"Partnering for","outcomesTitleAccent":"high-velocity growth","outcomesCopy":"We help modern teams ship faster without increasing headcount or complexity.","cards":[{"quote":"We removed the manual bottlenecks and shipped weekly.","company":"Atlas Studio","sector":"Operations","metricValue":"2x","metricLabel":"Throughput"},{"quote":"Quality improved while cycle time dropped.","company":"Signal Ops","sector":"Delivery","metricValue":"-38%","metricLabel":"Cycle time"}],"stats":[{"value":"2x","label":"Throughput"},{"value":"38%","label":"Faster cycles"},{"value":"6","label":"Weeks to launch"},{"value":"24/7","label":"Monitoring"}]}';
    $defaultCta          = '{"ctaBadge":"Deployment Ready","ctaTitle":"Ship faster with automation.","ctaCopy":"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today."}';

    $otherServices = [
        'custom-ai-solutions'   => ['hero' => '{"badge":"Custom AI Solutions","heroLine1":"Build AI that fits","heroLine2":"your business logic.","heroCopy":"We design bespoke AI solutions that integrate with your data, workflows, and proprietary processes.","ctaPrimary":"Plan a Discovery Call","pills":["AI Architecture","Data Pipelines","Workflow Integration"],"snapshotTitle":"Solution Readiness","snapshotRows":["Use-case clarity: 88%","Data availability: 79%","Model fit score: 86%","Security readiness: 82%"],"statLabel1":"Delivery speed","statValue1":"3x","statLabel2":"Ops uplift","statValue2":"+45%"}', 'features' => '{"cards":[{"title":"Custom Agent Design","description":"Build autonomous agents specialized in your unique business operations."},{"title":"Proprietary RAG","description":"Securely connect your private data to LLMs for accurate, context-aware answers."},{"title":"Legacy Integration","description":"Seamlessly bridge modern AI capabilities with your existing software stack."}]}', 'testimonials' => '{"items":[{"quote":"Digi Pexel built a custom RAG system that cut our document analysis time from hours to seconds.","role":"Head of Operations","company":"Fortress Law"},{"quote":"Our proprietary AI agent now handles 80% of our initial client intake with perfect accuracy.","role":"Founder","company":"ScaleUp"}]}'],
        'youtube-automation'    => ['hero' => '{"badge":"YouTube Automation","heroLine1":"Scale your channel","heroLine2":"without the bottlenecks.","heroCopy":"We automate scripting, production coordination, publishing, and analytics so your YouTube engine runs every week without burnout.","ctaPrimary":"Audit My Channel","pills":["Content Engine","Publishing Ops","Audience Growth"],"snapshotTitle":"Channel Momentum","snapshotRows":["Upload consistency: 92%","Retention lift: +28%","Topic velocity: 3.4x","Revenue mix: 47%"],"statLabel1":"Time saved","statValue1":"12 hrs/wk","statLabel2":"Output lift","statValue2":"3x"}', 'features' => '{"cards":[{"title":"AI Scripting Engine","description":"Generate data-backed scripts that maximize viewer retention and engagement."},{"title":"Production Pipeline","description":"Automated coordination between editors, designers, and upload managers."},{"title":"Topic Velocity","description":"Rapidly identify and execute on trending topics before the competition."}]}', 'testimonials' => '{"items":[{"quote":"Closing 8 channels a week used to be impossible. Now we do 12 with a smaller team.","role":"Channel Manager","company":"MediaFlow"},{"quote":"The AI scripting tool understands our audience better than we did. Retention is up 35%.","role":"Creative Director","company":"TubeFoundry"}]}'],
        'instagram-automation'  => ['hero' => '{"badge":"Instagram Automation","heroLine1":"Grow consistently","heroLine2":"without manual grind.","heroCopy":"Automate content scheduling, engagement workflows, and performance tracking so your brand stays always-on and on-strategy.","ctaPrimary":"Get an IG Audit","pills":["Content System","Engagement Ops","Brand Voice"],"snapshotTitle":"Social Pulse","snapshotRows":["Posting rhythm: 90%","Engagement rate: +22%","DM response time: 3h","Content reuse: 2.6x"],"statLabel1":"Engagement lift","statValue1":"+22%","statLabel2":"Time saved","statValue2":"9 hrs/wk"}', 'features' => '{"cards":[{"title":"Engagement Automator","description":"AI-powered DM and comment handling that maintains authentic brand voice."},{"title":"Visual Content Hub","description":"Centralized system for generating and scheduling Reels, Carousels, and Stories."},{"title":"Pattern Analysis","description":"Automatically identify what content drives the most follows and sales."}]}', 'testimonials' => '{"items":[{"quote":"Our engagement rate spiked 25% after automating our DM triage system.","role":"Social Lead","company":"Vibe Marketing"},{"quote":"We finally have an always-on presence without hiring 3 more community managers.","role":"Founder","company":"GlowUp"}]}'],
        'linkedin-automation'   => ['hero' => '{"badge":"LinkedIn Automation","heroLine1":"Build authority","heroLine2":"at scale.","heroCopy":"We automate content publishing, audience engagement, and lead capture so your LinkedIn presence drives pipeline consistently.","ctaPrimary":"Book a LinkedIn Audit","pills":["Authority Building","Outbound Assist","Lead Capture"],"snapshotTitle":"Authority Scorecard","snapshotRows":["Post cadence: 4x","Profile views: +58%","Inbound leads: +36%","Engagement rate: 6.1%"],"statLabel1":"Lead lift","statValue1":"+36%","statLabel2":"Authority growth","statValue2":"+58%"}', 'features' => '{"cards":[{"title":"Thought Leadership Ops","description":"Scale your professional voice with AI-assisted post generation and scheduling."},{"title":"Social Selling Flows","description":"Automated lead nurturing and profile visit follow-ups that feel personal."},{"title":"Network Growth","description":"Strategic connection automation to build a highly targeted industry network."}]}', 'testimonials' => '{"items":[{"quote":"My LinkedIn profile views went from 200 to 5,000 a week. The authority we\'ve built is massive.","role":"B2B Founder","company":"SaaS Rocket"},{"quote":"The outreach automation is so subtle — nobody knows it\'s a system, but the results are very real.","role":"Sales Director","company":"Prime Edge"}]}'],
        'automation-flows'      => ['hero' => '{"badge":"Automation Flows","heroLine1":"Connect your stack","heroLine2":"without friction.","heroCopy":"We build automation flows that move data and actions across your tools with reliability, observability, and scale.","ctaPrimary":"Map My Workflows","pills":["System Orchestration","Data Sync","Reliability"],"snapshotTitle":"Workflow Health","snapshotRows":["Success rate: 99.2%","Latency: 1.8s","Manual touches: -64%","Error recovery: 92%"],"statLabel1":"Ops time saved","statValue1":"-64%","statLabel2":"Flow uptime","statValue2":"99.2%"}', 'features' => '{"cards":[{"title":"Event Orchestration","description":"Build complex multi-step flows that trigger based on specific data events."},{"title":"Data Synchronization","description":"Keep your entire tech stack in sync with zero-latency data transfers."},{"title":"Observability Hub","description":"Real-time monitoring and alerting for every automated process you run."}]}', 'testimonials' => '{"items":[{"quote":"Our data syncing issues used to cost us $10k a month. Now everything is perfectly in sync.","role":"CTO","company":"DataFirst"},{"quote":"The observability dashboards give us total peace of mind for our critical business flows.","role":"IT Manager","company":"SwiftCore"}]}'],
        'ai-workflows'          => ['hero' => '{"badge":"AI Workflows","heroLine1":"Let AI run","heroLine2":"the complex decisions.","heroCopy":"We build AI workflows that chain decisions, approvals, and actions across your business with auditability and control.","ctaPrimary":"Design My Workflow","pills":["Decision Chains","Human-in-Loop","24/7 Ops"],"snapshotTitle":"Workflow Intelligence","snapshotRows":["Decision accuracy: 93%","Escalation rate: 7%","Automation coverage: 68%","Cycle time: -41%"],"statLabel1":"Cycle time","statValue1":"-41%","statLabel2":"Decision accuracy","statValue2":"93%"}', 'features' => '{"cards":[{"title":"Decision Intelligence","description":"AI that reasons through complex scenarios and takes the right action."},{"title":"Human-in-Loop QA","description":"Smart checkpoints that escalate complex cases to humans while automating the rest."},{"title":"Context Chain","description":"Maintain business context across multiple automation steps for smarter outcomes."}]}', 'testimonials' => '{"items":[{"quote":"The AI decision chains now handle 70% of our complex claims approvals.","role":"Operations Director","company":"InsurePlus"},{"quote":"Bridging human insight with AI reasoning has halved our processing time.","role":"Process Architect","company":"LogiNext"}]}'],
        'workflow-creation'     => ['hero' => '{"badge":"Workflow Creation","heroLine1":"Architect workflows","heroLine2":"that never break.","heroCopy":"We design dependable business workflows with clear ownership, automation hooks, and measurable performance.","ctaPrimary":"Build My Workflow","pills":["Process Design","Automation Ready","Reliability"],"snapshotTitle":"Workflow Readiness","snapshotRows":["Process clarity: 88%","Automation fit: 74%","Error rate: 6%","Cycle time: -32%"],"statLabel1":"Cycle time","statValue1":"-32%","statLabel2":"Automation fit","statValue2":"74%"}', 'features' => '{"cards":[{"title":"System Mapping","description":"Detailed blueprints of your business operations to identify automation points."},{"title":"Performance Benchmarking","description":"Measure every step of your workflow to find and fix hidden bottlenecks."},{"title":"Fail-safe Design","description":"Workflows built with built-in redundancies and error handling protocols."}]}', 'testimonials' => '{"items":[{"quote":"The blueprints Digi Pexel mapped out revealed bottlenecks we never knew existed.","role":"COO","company":"Atlas Studio"},{"quote":"We finally have a scalable workflow architecture that doesn\'t break under pressure.","role":"Founder","company":"LaunchPoint"}]}'],
        'accounting-bookkeeping'=> ['hero' => '{"badge":"Accounting Automation","heroLine1":"Close books faster","heroLine2":"with zero-touch workflows.","heroCopy":"We automate reconciliation, reporting, and financial workflows so your team focuses on analysis, not manual cleanup.","ctaPrimary":"Book an Accounting Audit","pills":["Reconciliation","Reporting","Compliance"],"snapshotTitle":"Finance Health","snapshotRows":["Close time: -40%","Reconciliation accuracy: 99%","AP cycle time: -32%","Manual entries: -70%"],"statLabel1":"Close time","statValue1":"-40%","statLabel2":"Manual entries","statValue2":"-70%"}', 'features' => '{"cards":[{"title":"Zero-touch Reconciliation","description":"Automatically match bank statements with your ledger using AI pattern recognition."},{"title":"Real-time P&L","description":"Live financial dashboards that update instantly as transactions occur."},{"title":"Compliance Guard","description":"Automated audits that flag inconsistencies and ensure tax readiness year-round."}]}', 'testimonials' => '{"items":[{"quote":"Closing our month-end now takes 3 days instead of 12. Total transformation.","role":"CFO","company":"Global Ledger"},{"quote":"The accuracy and speed of our automated reconciliation is beyond what we expected.","role":"Controller","company":"FinPath"}]}'],
        'hiring-recruitment'    => ['hero' => '{"badge":"Hiring Automation","heroLine1":"Hire faster","heroLine2":"with AI-driven pipelines.","heroCopy":"We automate sourcing, screening, and outreach to help you scale hiring without sacrificing quality.","ctaPrimary":"Audit My Hiring Flow","pills":["Sourcing","Screening","Candidate Experience"],"snapshotTitle":"Hiring Velocity","snapshotRows":["Time-to-hire: -35%","Qualified applicants: +48%","Response time: 2h","Offer acceptance: 82%"],"statLabel1":"Time-to-hire","statValue1":"-35%","statLabel2":"Qualified leads","statValue2":"+48%"}', 'features' => '{"cards":[{"title":"AI Candidate Sourcing","description":"Find top talent across platforms automatically with intelligent search agents."},{"title":"Automated Screening","description":"Smart interviews and skill assessments that filter for quality at scale."},{"title":"Engagement Engine","description":"Personalized candidate outreach that maintains high response rates."}]}', 'testimonials' => '{"items":[{"quote":"Our cost-per-hire dropped 40% while our candidate quality actually improved.","role":"HR Director","company":"ScaleRecruit"},{"quote":"The AI screening process has saved our team hundreds of hours in top-of-funnel work.","role":"Talent Lead","company":"Innovate Hub"}]}'],
        'sales-automation'      => ['hero' => '{"badge":"Sales Automation","heroLine1":"Convert faster","heroLine2":"with automated follow-up.","heroCopy":"We automate lead scoring, nurturing, and pipeline hygiene so sales teams focus on closing, not chasing.","ctaPrimary":"Audit My Sales Ops","pills":["Lead Scoring","Follow-up","Pipeline Hygiene"],"snapshotTitle":"Pipeline Health","snapshotRows":["Response time: -45%","Conversion lift: +29%","Lead scoring: 94%","Stale deals: -38%"],"statLabel1":"Conversion lift","statValue1":"+29%","statLabel2":"Response time","statValue2":"-45%"}', 'features' => '{"cards":[{"title":"Predictive Lead Scoring","description":"AI that identifies your highest-value leads before you even contact them."},{"title":"Multi-channel Follow-up","description":"Automated nurturing across Email, LinkedIn, and SMS that never misses a beat."},{"title":"CRM Hygiene Bots","description":"Autonomous agents that keep your sales data accurate and pipeline clean."}]}', 'testimonials' => '{"items":[{"quote":"Our sales reps are spending 90% of their time on hot leads now. Conversion is at an all-time high.","role":"VP Sales","company":"CloudScale"},{"quote":"Automating our follow-up sequences has ensured no lead ever falls through the cracks again.","role":"Founder","company":"Apex Systems"}]}'],
    ];

    foreach ($otherServices as $slug => $sections) {
        foreach ($sections as $section => $content) {
            $svcStmt->execute([$slug, $section, $content]);
        }
        $svcStmt->execute([$slug, 'roadmap',       $defaultRoadmap]);
        $svcStmt->execute([$slug, 'market_impact', $defaultMarketImpact]);
        $svcStmt->execute([$slug, 'cta',           $defaultCta]);
    }
    // ai-seo was in the $services array — seed it too
    foreach ($services['ai-seo'] as $section => $content) {
        $svcStmt->execute(['ai-seo', $section, $content]);
    }
    $svcStmt->execute(['ai-seo', 'roadmap',       $defaultRoadmap]);
    $svcStmt->execute(['ai-seo', 'market_impact', $defaultMarketImpact]);

    echo json_encode(['status' => 'success', 'message' => 'Database initialized successfully.']);

} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(['status' => 'error', 'message' => $e->getMessage()]));
}
