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

    echo "Database initialized successfully.";
} catch (PDOException $e) {
    die("DB Init Error: " . $e->getMessage());
}
