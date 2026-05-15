<?php
// backend/init_db.php
require_once 'config.php';

try {
    $sql = "
    CREATE TABLE IF NOT EXISTS logos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        src TEXT NOT NULL,
        display_type ENUM('image', 'text', 'both') DEFAULT 'image',
        position INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        contact_number VARCHAR(100),
        service VARCHAR(255),
        message TEXT,
        status ENUM('new', 'contacted', 'archived') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS guides (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        content LONGTEXT,
        image_url TEXT,
        category VARCHAR(100),
        cta_label VARCHAR(100) DEFAULT 'Download Guide',
        cta_link TEXT,
        feature1 VARCHAR(255),
        feature2 VARCHAR(255),
        feature3 VARCHAR(255),
        feature4 VARCHAR(255),
        stat1_label VARCHAR(100),
        stat1_value VARCHAR(100),
        stat2_label VARCHAR(100),
        stat2_value VARCHAR(100),
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        image_url TEXT,
        category VARCHAR(100),
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials_focus (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('logo', 'video', 'photo') DEFAULT 'logo',
        url TEXT,
        thumbnail_url TEXT,
        label VARCHAR(255),
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        image_url TEXT,
        category VARCHAR(100),
        tags TEXT,
        position INT DEFAULT 0,
        published_at DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS case_studies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        subtitle VARCHAR(255),
        description TEXT,
        client_name VARCHAR(255),
        industry VARCHAR(100),
        challenge TEXT,
        solution TEXT,
        results TEXT,
        image_url TEXT,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
        section VARCHAR(50) PRIMARY KEY,
        content JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
        `key` VARCHAR(50) PRIMARY KEY,
        `value` TEXT
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('active', 'unsubscribed') DEFAULT 'active'
    );

    CREATE TABLE IF NOT EXISTS service_content (
        slug       VARCHAR(50) NOT NULL,
        section    VARCHAR(50) NOT NULL,
        content    JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (slug, section)
    );

    -- Insert default logos if table is empty
    INSERT INTO logos (name, src, position) 
    SELECT 'Dish', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Dish_Network_logo.svg', 0
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'Dish');

    INSERT INTO logos (name, src, position) 
    SELECT 'Deloitte', 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Deloitte.svg', 1
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'Deloitte');

    INSERT INTO logos (name, src, position) 
    SELECT 'Pfizer', 'https://upload.wikimedia.org/wikipedia/commons/5/57/Pfizer_%282021%29.svg', 2
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'Pfizer');

    INSERT INTO logos (name, src, position) 
    SELECT 'Adobe', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Experience_Cloud_logo.svg', 3
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'Adobe');

    INSERT INTO logos (name, src, position) 
    SELECT 'American Airlines', 'https://upload.wikimedia.org/wikipedia/commons/f/f6/American_Airlines_logo_2013.svg', 4
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'American Airlines');

    INSERT INTO logos (name, src, position) 
    SELECT 'NBCUniversal', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/NBC_Universal_Logo.svg', 5
    WHERE NOT EXISTS (SELECT 1 FROM logos WHERE name = 'NBCUniversal');
    ";

    $pdo->exec($sql);
    // Insert default guides if table is empty
    $sql_guides = "
    INSERT INTO guides (title, slug, description, content, image_url, category, position)
    SELECT 'The 2024 AI Automation Roadmap: Scalability Guide', 'ai-automation-roadmap-2024', 'How to audit your business for high-ROI automation opportunities and build a 12-month deployment plan.', '<h2>The Future of Efficiency</h2><p>Identifying opportunities is the first step to massive growth.</p><h3>Why Automation Matters</h3><ul><li>Reduced Errors</li><li>Increased Speed</li><li>Lower Costs</li></ul>', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800', 'Strategy', 0
    WHERE NOT EXISTS (SELECT 1 FROM guides);
    ";
    $pdo->exec($sql_guides);

    $sql_testimonials = "
    INSERT INTO testimonials (name, role, company, content, image_url, category, position)
    SELECT 'Sarah Chen', 'Product Manager', 'Stripe', 'The AI workflows implemented by Digi Pexel transformed our support operations. We reduced response times by 70% while improving customer satisfaction scores.', 'https://i.pravatar.cc/150?u=sarah', 'Fintech', 0
    WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Sarah Chen');

    INSERT INTO testimonials (name, role, company, content, image_url, category, position)
    SELECT 'Marcus Rodriguez', 'Founder', 'GrowthLoop', 'We tried building internal AI systems for 6 months with no luck. Digi Pexel delivered a production-ready lead scoring agent in 3 weeks.', 'https://i.pravatar.cc/150?u=marcus', 'SaaS', 1
    WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Marcus Rodriguez');

    INSERT INTO testimonials (name, role, company, content, image_url, category, position)
    SELECT 'Emma Watson', 'Director of Marketing', 'Adobe', 'Their AI SEO strategy is light years ahead. We went from zero AI citations to being the top result for critical industry prompts.', 'https://i.pravatar.cc/150?u=emma', 'Enterprise', 2
    WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Emma Watson');

    INSERT INTO blogs (title, slug, excerpt, content, image_url, category, position, published_at)
    SELECT 'The Future of AI in Modern Business', 'future-of-ai-business', 'Explore how artificial intelligence is reshaping industries and what it means for your company\'s future.', '<p>Artificial Intelligence is no longer a buzzword; it is the fundamental architecture of the next generation of business.</p>', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', 'Technology', 0, '2024-03-15'
    WHERE NOT EXISTS (SELECT 1 FROM blogs);

    INSERT INTO case_studies (title, slug, subtitle, description, client_name, industry, challenge, solution, results, image_url, position)
    SELECT 'Automating FinTech Customer Onboarding', 'verivault-onboarding-automation', 'Reducing manual verification time by 85% using autonomous AI agents.', 'Detailed breakdown of our execution with VeriVault.', 'VeriVault', 'FinTech', 'Manual verification was taking 48 hours per user.', 'Deployed a custom AI identity verification agent.', 'Verification time reduced to 4 hours.', 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800', 0
    WHERE NOT EXISTS (SELECT 1 FROM case_studies);
    ";
    $pdo->exec($sql_testimonials);

    // Seed default settings
    $sql_settings = "
    INSERT INTO settings (`key`, `value`)
    SELECT 'whatsapp_number', ''
    WHERE NOT EXISTS (SELECT 1 FROM settings WHERE `key` = 'whatsapp_number');
    ";
    $pdo->exec($sql_settings);

    // ── service_content seed (INSERT IGNORE so re-runs never overwrite admin edits) ──

    // ai-seo
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'hero', '{\"badge\":\"AI SEO Automation\",\"heroLine1\":\"Stop optimizing for bots.\",\"heroLine2\":\"Start winning AI answers.\",\"heroCopy\":\"We build AI-ready content systems that make your brand the default citation across search assistants, copilots, and LLM-driven research.\",\"ctaPrimary\":\"Book a Strategy Call\",\"pills\":[\"GEO Strategy\",\"Entity Authority\",\"RAG Readiness\"],\"snapshotTitle\":\"Live Visibility Snapshot\",\"snapshotRows\":[\"Model citations: 68%\",\"Entity coverage: 92%\",\"Prompt intent match: 84%\",\"Trust signals: 76%\"],\"statLabel1\":\"Visibility Delta\",\"statValue1\":\"+41%\",\"statLabel2\":\"AI Answer Rate\",\"statValue2\":\"3.2x\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'features', '{\"cards\":[{\"title\":\"GEO Optimization\",\"description\":\"Optimize for Generative Engine Results to ensure your brand is cited by LLMs.\"},{\"title\":\"Entity Authority\",\"description\":\"Map your content to semantic entities to build topical authority that AI understands.\"},{\"title\":\"Automated Content Loop\",\"description\":\"A system that continuously updates content based on AI search trends and intent.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-seo', 'testimonials', '{\"items\":[{\"quote\":\"Our brand citations in Perplexity and ChatGPT increased by 140% in just two months.\",\"role\":\"CEO\",\"company\":\"Nexus Tech\"},{\"quote\":\"The zero-click search visibility we\'ve gained has been a game-changer for our organic traffic.\",\"role\":\"Marketing Director\",\"company\":\"Aura Media\"}]}')");

    // custom-ai-solutions
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'hero', '{\"badge\":\"Custom AI Solutions\",\"heroLine1\":\"Build AI that fits\",\"heroLine2\":\"your business logic.\",\"heroCopy\":\"We design bespoke AI solutions that integrate with your data, workflows, and proprietary processes. From copilots to autonomous systems, we make AI operational.\",\"ctaPrimary\":\"Plan a Discovery Call\",\"pills\":[\"AI Architecture\",\"Data Pipelines\",\"Workflow Integration\"],\"snapshotTitle\":\"Solution Readiness\",\"snapshotRows\":[\"Use-case clarity: 88%\",\"Data availability: 79%\",\"Model fit score: 86%\",\"Security readiness: 82%\"],\"statLabel1\":\"Delivery speed\",\"statValue1\":\"3x\",\"statLabel2\":\"Ops uplift\",\"statValue2\":\"+45%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'features', '{\"cards\":[{\"title\":\"Custom Agent Design\",\"description\":\"Build autonomous agents specialized in your unique business operations.\"},{\"title\":\"Proprietary RAG\",\"description\":\"Securely connect your private data to LLMs for accurate, context-aware answers.\"},{\"title\":\"Legacy Integration\",\"description\":\"Seamlessly bridge modern AI capabilities with your existing software stack.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('custom-ai-solutions', 'testimonials', '{\"items\":[{\"quote\":\"Digi Pexel built a custom RAG system that cut our document analysis time from hours to seconds.\",\"role\":\"Head of Operations\",\"company\":\"Fortress Law\"},{\"quote\":\"Our proprietary AI agent now handles 80% of our initial client intake with perfect accuracy.\",\"role\":\"Founder\",\"company\":\"ScaleUp\"}]}')");

    // youtube-automation
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'hero', '{\"badge\":\"YouTube Automation\",\"heroLine1\":\"Scale your channel\",\"heroLine2\":\"without the bottlenecks.\",\"heroCopy\":\"We automate scripting, production coordination, publishing, and analytics so your YouTube engine runs every week without burnout.\",\"ctaPrimary\":\"Audit My Channel\",\"pills\":[\"Content Engine\",\"Publishing Ops\",\"Audience Growth\"],\"snapshotTitle\":\"Channel Momentum\",\"snapshotRows\":[\"Upload consistency: 92%\",\"Retention lift: +28%\",\"Topic velocity: 3.4x\",\"Revenue mix: 47%\"],\"statLabel1\":\"Time saved\",\"statValue1\":\"12 hrs/wk\",\"statLabel2\":\"Output lift\",\"statValue2\":\"3x\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'features', '{\"cards\":[{\"title\":\"AI Scripting Engine\",\"description\":\"Generate data-backed scripts that maximize viewer retention and engagement.\"},{\"title\":\"Production Pipeline\",\"description\":\"Automated coordination between editors, designers, and upload managers.\"},{\"title\":\"Topic Velocity\",\"description\":\"Rapidly identify and execute on trending topics before the competition.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('youtube-automation', 'testimonials', '{\"items\":[{\"quote\":\"Closing 8 channels a week used to be impossible. Now we do 12 with a smaller team.\",\"role\":\"Channel Manager\",\"company\":\"MediaFlow\"},{\"quote\":\"The AI scripting tool understands our audience better than we did. Retention is up 35%.\",\"role\":\"Creative Director\",\"company\":\"TubeFoundry\"}]}')");

    // instagram-automation
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'hero', '{\"badge\":\"Instagram Automation\",\"heroLine1\":\"Grow consistently\",\"heroLine2\":\"without manual grind.\",\"heroCopy\":\"Automate content scheduling, engagement workflows, and performance tracking so your brand stays always-on and on-strategy.\",\"ctaPrimary\":\"Get an IG Audit\",\"pills\":[\"Content System\",\"Engagement Ops\",\"Brand Voice\"],\"snapshotTitle\":\"Social Pulse\",\"snapshotRows\":[\"Posting rhythm: 90%\",\"Engagement rate: +22%\",\"DM response time: 3h\",\"Content reuse: 2.6x\"],\"statLabel1\":\"Engagement lift\",\"statValue1\":\"+22%\",\"statLabel2\":\"Time saved\",\"statValue2\":\"9 hrs/wk\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'features', '{\"cards\":[{\"title\":\"Engagement Automator\",\"description\":\"AI-powered DM and comment handling that maintains authentic brand voice.\"},{\"title\":\"Visual Content Hub\",\"description\":\"Centralized system for generating and scheduling Reels, Carousels, and Stories.\"},{\"title\":\"Pattern Analysis\",\"description\":\"Automatically identify what content drives the most follows and sales.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('instagram-automation', 'testimonials', '{\"items\":[{\"quote\":\"Our engagement rate spiked 25% after automating our DM triage system.\",\"role\":\"Social Lead\",\"company\":\"Vibe Marketing\"},{\"quote\":\"We finally have an always-on presence without hiring 3 more community managers.\",\"role\":\"Founder\",\"company\":\"GlowUp\"}]}')");

    // linkedin-automation
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'hero', '{\"badge\":\"LinkedIn Automation\",\"heroLine1\":\"Build authority\",\"heroLine2\":\"at scale.\",\"heroCopy\":\"We automate content publishing, audience engagement, and lead capture so your LinkedIn presence drives pipeline consistently.\",\"ctaPrimary\":\"Book a LinkedIn Audit\",\"pills\":[\"Authority Building\",\"Outbound Assist\",\"Lead Capture\"],\"snapshotTitle\":\"Authority Scorecard\",\"snapshotRows\":[\"Post cadence: 4x\",\"Profile views: +58%\",\"Inbound leads: +36%\",\"Engagement rate: 6.1%\"],\"statLabel1\":\"Lead lift\",\"statValue1\":\"+36%\",\"statLabel2\":\"Authority growth\",\"statValue2\":\"+58%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'features', '{\"cards\":[{\"title\":\"Thought Leadership Ops\",\"description\":\"Scale your professional voice with AI-assisted post generation and scheduling.\"},{\"title\":\"Social Selling Flows\",\"description\":\"Automated lead nurturing and profile visit follow-ups that feel personal.\"},{\"title\":\"Network Growth\",\"description\":\"Strategic connection automation to build a highly targeted industry network.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('linkedin-automation', 'testimonials', '{\"items\":[{\"quote\":\"My LinkedIn profile views went from 200 to 5,000 a week. The authority we\'ve built is massive.\",\"role\":\"B2B Founder\",\"company\":\"SaaS Rocket\"},{\"quote\":\"The outreach automation is so subtle—nobody knows it\'s a system, but the results are very real.\",\"role\":\"Sales Director\",\"company\":\"Prime Edge\"}]}')");

    // automation-flows
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'hero', '{\"badge\":\"Automation Flows\",\"heroLine1\":\"Connect your stack\",\"heroLine2\":\"without friction.\",\"heroCopy\":\"We build automation flows that move data and actions across your tools with reliability, observability, and scale.\",\"ctaPrimary\":\"Map My Workflows\",\"pills\":[\"System Orchestration\",\"Data Sync\",\"Reliability\"],\"snapshotTitle\":\"Workflow Health\",\"snapshotRows\":[\"Success rate: 99.2%\",\"Latency: 1.8s\",\"Manual touches: -64%\",\"Error recovery: 92%\"],\"statLabel1\":\"Ops time saved\",\"statValue1\":\"-64%\",\"statLabel2\":\"Flow uptime\",\"statValue2\":\"99.2%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'features', '{\"cards\":[{\"title\":\"Event Orchestration\",\"description\":\"Build complex multi-step flows that trigger based on specific data events.\"},{\"title\":\"Data Synchronization\",\"description\":\"Keep your entire tech stack in sync with zero-latency data transfers.\"},{\"title\":\"Observability Hub\",\"description\":\"Real-time monitoring and alerting for every automated process you run.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('automation-flows', 'testimonials', '{\"items\":[{\"quote\":\"Our data syncing issues used to cost us $10k a month. Now everything is perfectly in sync.\",\"role\":\"CTO\",\"company\":\"DataFirst\"},{\"quote\":\"The observability dashboards give us total peace of mind for our critical business flows.\",\"role\":\"IT Manager\",\"company\":\"SwiftCore\"}]}')");

    // ai-workflows
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'hero', '{\"badge\":\"AI Workflows\",\"heroLine1\":\"Let AI run\",\"heroLine2\":\"the complex decisions.\",\"heroCopy\":\"We build AI workflows that chain decisions, approvals, and actions across your business with auditability and control.\",\"ctaPrimary\":\"Design My Workflow\",\"pills\":[\"Decision Chains\",\"Human-in-Loop\",\"24/7 Ops\"],\"snapshotTitle\":\"Workflow Intelligence\",\"snapshotRows\":[\"Decision accuracy: 93%\",\"Escalation rate: 7%\",\"Automation coverage: 68%\",\"Cycle time: -41%\"],\"statLabel1\":\"Cycle time\",\"statValue1\":\"-41%\",\"statLabel2\":\"Decision accuracy\",\"statValue2\":\"93%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'features', '{\"cards\":[{\"title\":\"Decision Intelligence\",\"description\":\"AI that reasons through complex scenarios and takes the right action.\"},{\"title\":\"Human-in-Loop QA\",\"description\":\"Smart checkpoints that escalate complex cases to humans while automating the rest.\"},{\"title\":\"Context Chain\",\"description\":\"Maintain business context across multiple automation steps for smarter outcomes.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('ai-workflows', 'testimonials', '{\"items\":[{\"quote\":\"The AI decision chains now handle 70% of our complex claims approvals.\",\"role\":\"Operations Director\",\"company\":\"InsurePlus\"},{\"quote\":\"Bridging human insight with AI reasoning has halved our processing time.\",\"role\":\"Process Architect\",\"company\":\"LogiNext\"}]}')");

    // workflow-creation
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'hero', '{\"badge\":\"Workflow Creation\",\"heroLine1\":\"Architect workflows\",\"heroLine2\":\"that never break.\",\"heroCopy\":\"We design dependable business workflows with clear ownership, automation hooks, and measurable performance.\",\"ctaPrimary\":\"Build My Workflow\",\"pills\":[\"Process Design\",\"Automation Ready\",\"Reliability\"],\"snapshotTitle\":\"Workflow Readiness\",\"snapshotRows\":[\"Process clarity: 88%\",\"Automation fit: 74%\",\"Error rate: 6%\",\"Cycle time: -32%\"],\"statLabel1\":\"Cycle time\",\"statValue1\":\"-32%\",\"statLabel2\":\"Automation fit\",\"statValue2\":\"74%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'features', '{\"cards\":[{\"title\":\"System Mapping\",\"description\":\"Detailed blueprints of your business operations to identify automation points.\"},{\"title\":\"Performance Benchmarking\",\"description\":\"Measure every step of your workflow to find and fix hidden bottlenecks.\"},{\"title\":\"Fail-safe Design\",\"description\":\"Workflows built with built-in redundancies and error handling protocols.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('workflow-creation', 'testimonials', '{\"items\":[{\"quote\":\"The blueprints Digi Pexel mapped out revealed bottlenecks we never knew existed.\",\"role\":\"COO\",\"company\":\"Atlas Studio\"},{\"quote\":\"We finally have a scalable workflow architecture that doesn\'t break under pressure.\",\"role\":\"Founder\",\"company\":\"LaunchPoint\"}]}')");

    // accounting-bookkeeping
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'hero', '{\"badge\":\"Accounting Automation\",\"heroLine1\":\"Close books faster\",\"heroLine2\":\"with zero-touch workflows.\",\"heroCopy\":\"We automate reconciliation, reporting, and financial workflows so your team focuses on analysis, not manual cleanup.\",\"ctaPrimary\":\"Book an Accounting Audit\",\"pills\":[\"Reconciliation\",\"Reporting\",\"Compliance\"],\"snapshotTitle\":\"Finance Health\",\"snapshotRows\":[\"Close time: -40%\",\"Reconciliation accuracy: 99%\",\"AP cycle time: -32%\",\"Manual entries: -70%\"],\"statLabel1\":\"Close time\",\"statValue1\":\"-40%\",\"statLabel2\":\"Manual entries\",\"statValue2\":\"-70%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'features', '{\"cards\":[{\"title\":\"Zero-touch Reconciliation\",\"description\":\"Automatically match bank statements with your ledger using AI pattern recognition.\"},{\"title\":\"Real-time P&L\",\"description\":\"Live financial dashboards that update instantly as transactions occur.\"},{\"title\":\"Compliance Guard\",\"description\":\"Automated audits that flag inconsistencies and ensure tax readiness year-round.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('accounting-bookkeeping', 'testimonials', '{\"items\":[{\"quote\":\"Closing our month-end now takes 3 days instead of 12. Total transformation.\",\"role\":\"CFO\",\"company\":\"Global Ledger\"},{\"quote\":\"The accuracy and speed of our automated reconciliation is beyond what we expected.\",\"role\":\"Controller\",\"company\":\"FinPath\"}]}')");

    // hiring-recruitment
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'hero', '{\"badge\":\"Hiring Automation\",\"heroLine1\":\"Hire faster\",\"heroLine2\":\"with AI-driven pipelines.\",\"heroCopy\":\"We automate sourcing, screening, and outreach to help you scale hiring without sacrificing quality.\",\"ctaPrimary\":\"Audit My Hiring Flow\",\"pills\":[\"Sourcing\",\"Screening\",\"Candidate Experience\"],\"snapshotTitle\":\"Hiring Velocity\",\"snapshotRows\":[\"Time-to-hire: -35%\",\"Qualified applicants: +48%\",\"Response time: 2h\",\"Offer acceptance: 82%\"],\"statLabel1\":\"Time-to-hire\",\"statValue1\":\"-35%\",\"statLabel2\":\"Qualified leads\",\"statValue2\":\"+48%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'features', '{\"cards\":[{\"title\":\"AI Candidate Sourcing\",\"description\":\"Find top talent across platforms automatically with intelligent search agents.\"},{\"title\":\"Automated Screening\",\"description\":\"Smart interviews and skill assessments that filter for quality at scale.\"},{\"title\":\"Engagement Engine\",\"description\":\"Personalized candidate outreach that maintains high response rates.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('hiring-recruitment', 'testimonials', '{\"items\":[{\"quote\":\"Our cost-per-hire dropped 40% while our candidate quality actually improved.\",\"role\":\"HR Director\",\"company\":\"ScaleRecruit\"},{\"quote\":\"The AI screening process has saved our team hundreds of hours in top-of-funnel work.\",\"role\":\"Talent Lead\",\"company\":\"Innovate Hub\"}]}')");

    // sales-automation
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'hero', '{\"badge\":\"Sales Automation\",\"heroLine1\":\"Convert faster\",\"heroLine2\":\"with automated follow-up.\",\"heroCopy\":\"We automate lead scoring, nurturing, and pipeline hygiene so sales teams focus on closing, not chasing.\",\"ctaPrimary\":\"Audit My Sales Ops\",\"pills\":[\"Lead Scoring\",\"Follow-up\",\"Pipeline Hygiene\"],\"snapshotTitle\":\"Pipeline Health\",\"snapshotRows\":[\"Response time: -45%\",\"Conversion lift: +29%\",\"Lead scoring: 94%\",\"Stale deals: -38%\"],\"statLabel1\":\"Conversion lift\",\"statValue1\":\"+29%\",\"statLabel2\":\"Response time\",\"statValue2\":\"-45%\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'features', '{\"cards\":[{\"title\":\"Predictive Lead Scoring\",\"description\":\"AI that identifies your highest-value leads before you even contact them.\"},{\"title\":\"Multi-channel Follow-up\",\"description\":\"Automated nurturing across Email, LinkedIn, and SMS that never misses a beat.\"},{\"title\":\"CRM Hygiene Bots\",\"description\":\"Autonomous agents that keep your sales data accurate and pipeline clean.\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'roadmap', '{\"roadmapTitle\":\"The 6-step delivery\",\"roadmapTitleAccent\":\"roadmap\",\"roadmapCopy\":\"A transparent, milestone-driven approach to moving from manual friction to autonomous excellence.\",\"items\":[{\"step\":\"01\",\"title\":\"Discovery\",\"desc\":\"Process auditing & feasibility\"},{\"step\":\"02\",\"title\":\"Architecture\",\"desc\":\"Logic mapping & tool selection\"},{\"step\":\"03\",\"title\":\"Engineering\",\"desc\":\"Build & data integration\"},{\"step\":\"04\",\"title\":\"Validation\",\"desc\":\"Security audit & QA testing\"},{\"step\":\"05\",\"title\":\"Deployment\",\"desc\":\"Live launch & pilot monitoring\"},{\"step\":\"06\",\"title\":\"Scale\",\"desc\":\"Performance tuning & expansion\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'market_impact', '{\"outcomesTitle\":\"Partnering for\",\"outcomesTitleAccent\":\"high-velocity growth\",\"outcomesCopy\":\"We help modern teams ship faster without increasing headcount or complexity.\",\"cards\":[{\"quote\":\"We removed the manual bottlenecks and shipped weekly.\",\"company\":\"Atlas Studio\",\"sector\":\"Operations\",\"metricValue\":\"2x\",\"metricLabel\":\"Throughput\"},{\"quote\":\"Quality improved while cycle time dropped.\",\"company\":\"Signal Ops\",\"sector\":\"Delivery\",\"metricValue\":\"-38%\",\"metricLabel\":\"Cycle time\"}],\"stats\":[{\"value\":\"2x\",\"label\":\"Throughput\"},{\"value\":\"38%\",\"label\":\"Faster cycles\"},{\"value\":\"6\",\"label\":\"Weeks to launch\"},{\"value\":\"24/7\",\"label\":\"Monitoring\"}]}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'cta', '{\"ctaBadge\":\"Deployment Ready\",\"ctaTitle\":\"Ship faster with automation.\",\"ctaCopy\":\"Get a tailored plan and deployment timeline in days, not weeks. Start building your autonomous future today.\"}')");
    $pdo->exec("INSERT IGNORE INTO service_content (slug, section, content) VALUES ('sales-automation', 'testimonials', '{\"items\":[{\"quote\":\"Our sales reps are spending 90% of their time on hot leads now. Conversion is at an all-time high.\",\"role\":\"VP Sales\",\"company\":\"CloudScale\"},{\"quote\":\"Automating our follow-up sequences has ensured no lead ever falls through the cracks again.\",\"role\":\"Founder\",\"company\":\"Apex Systems\"}]}')");

    echo "Database initialized successfully.";
} catch (PDOException $e) {
    die("DB Init Error: " . $e->getMessage());
}
