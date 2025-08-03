-- FAQ System for Help Modal
-- Provides self-service help content to reduce support ticket volume

DROP TABLE IF EXISTS faq_feedback CASCADE;
DROP TABLE IF EXISTS faq_articles CASCADE;
DROP TABLE IF EXISTS faq_categories CASCADE;

-- FAQ Categories
CREATE TABLE IF NOT EXISTS faq_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier
  description TEXT,
  icon TEXT, -- Icon name from Phosphor icons
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ Articles
CREATE TABLE IF NOT EXISTS faq_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES faq_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- Markdown content
  
  -- Quick answer for preview
  summary TEXT NOT NULL, -- Brief answer shown in list view
  
  -- Metadata
  keywords TEXT[], -- For search
  related_articles UUID[], -- References to other FAQ articles
  
  -- Tracking
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,
  
  -- Status
  is_featured BOOLEAN DEFAULT FALSE, -- Show at top of help modal
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(keywords, ' '), '')), 'B')
  ) STORED
);

-- User feedback on FAQ articles
CREATE TABLE IF NOT EXISTS faq_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES faq_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_helpful BOOLEAN NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate feedback from same user
  UNIQUE(article_id, user_id)
);

-- Indexes
CREATE INDEX idx_faq_categories_slug ON faq_categories(slug) WHERE is_active = TRUE;
CREATE INDEX idx_faq_categories_sort ON faq_categories(sort_order, name) WHERE is_active = TRUE;

CREATE INDEX idx_faq_articles_category ON faq_articles(category_id) WHERE is_active = TRUE;
CREATE INDEX idx_faq_articles_slug ON faq_articles(slug) WHERE is_active = TRUE;
CREATE INDEX idx_faq_articles_featured ON faq_articles(is_featured) WHERE is_featured = TRUE AND is_active = TRUE;
CREATE INDEX idx_faq_articles_search ON faq_articles USING GIN(search_vector);
CREATE INDEX idx_faq_articles_keywords ON faq_articles USING GIN(keywords);
CREATE INDEX idx_faq_articles_popular ON faq_articles(view_count DESC) WHERE is_active = TRUE;

CREATE INDEX idx_faq_feedback_article ON faq_feedback(article_id);
CREATE INDEX idx_faq_feedback_user ON faq_feedback(user_id);

-- Enable RLS
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies (FAQs are public read)
CREATE POLICY "Anyone can view active FAQ categories" ON faq_categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Anyone can view active FAQ articles" ON faq_articles
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Users can view their own feedback" ON faq_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON faq_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feedback" ON faq_feedback
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_faq_view_count(p_article_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE faq_articles 
  SET view_count = view_count + 1
  WHERE id = p_article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update helpful/not helpful counts
CREATE OR REPLACE FUNCTION update_faq_helpfulness()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_helpful THEN
      UPDATE faq_articles 
      SET helpful_count = helpful_count + 1
      WHERE id = NEW.article_id;
    ELSE
      UPDATE faq_articles 
      SET not_helpful_count = not_helpful_count + 1
      WHERE id = NEW.article_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_helpful != NEW.is_helpful THEN
      IF NEW.is_helpful THEN
        UPDATE faq_articles 
        SET helpful_count = helpful_count + 1,
            not_helpful_count = GREATEST(0, not_helpful_count - 1)
        WHERE id = NEW.article_id;
      ELSE
        UPDATE faq_articles 
        SET helpful_count = GREATEST(0, helpful_count - 1),
            not_helpful_count = not_helpful_count + 1
        WHERE id = NEW.article_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_helpful THEN
      UPDATE faq_articles 
      SET helpful_count = GREATEST(0, helpful_count - 1)
      WHERE id = OLD.article_id;
    ELSE
      UPDATE faq_articles 
      SET not_helpful_count = GREATEST(0, not_helpful_count - 1)
      WHERE id = OLD.article_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for FAQ feedback
CREATE TRIGGER update_faq_helpfulness_trigger
  AFTER INSERT OR UPDATE OR DELETE ON faq_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_faq_helpfulness();

-- Function to search FAQs
CREATE OR REPLACE FUNCTION search_faqs(search_query TEXT, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  summary TEXT,
  category_name TEXT,
  relevance REAL,
  view_count INTEGER,
  helpful_percentage INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fa.id,
    fa.title,
    fa.summary,
    fc.name as category_name,
    ts_rank(fa.search_vector, plainto_tsquery('english', search_query)) as relevance,
    fa.view_count,
    CASE 
      WHEN (fa.helpful_count + fa.not_helpful_count) > 0 
      THEN (fa.helpful_count * 100 / (fa.helpful_count + fa.not_helpful_count))::INTEGER
      ELSE NULL
    END as helpful_percentage
  FROM faq_articles fa
  JOIN faq_categories fc ON fc.id = fa.category_id
  WHERE fa.is_active = TRUE
    AND fc.is_active = TRUE
    AND fa.search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY 
    fa.is_featured DESC,
    relevance DESC,
    fa.view_count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default FAQ categories
INSERT INTO faq_categories (name, slug, description, icon, sort_order) VALUES
  ('Getting Started', 'getting-started', 'Learn the basics of using the IELTS practice app', 'RocketLaunch', 1),
  ('Speaking Practice', 'speaking-practice', 'Tips and guides for IELTS speaking practice', 'Microphone', 2),
  ('Technical Issues', 'technical-issues', 'Troubleshooting common technical problems', 'Wrench', 3),
  ('Scoring & Feedback', 'scoring-feedback', 'Understanding your IELTS scores and feedback', 'ChartBar', 4),
  ('Account & Billing', 'account-billing', 'Manage your account and subscription', 'User', 5),
  ('Mobile App', 'mobile-app', 'Using the app on mobile devices', 'DeviceMobile', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample FAQ articles
INSERT INTO faq_articles (category_id, title, slug, summary, content, keywords, is_featured) VALUES
  (
    (SELECT id FROM faq_categories WHERE slug = 'getting-started'),
    'How do I start practicing?',
    'how-to-start-practicing',
    'Choose a topic from the Library, click to start, and record your responses using the microphone button.',
    E'# How to Start Practicing\n\n1. **Navigate to the Library** - Click the Library icon in the sidebar\n2. **Choose a Topic** - Browse topics organized by IELTS Part (1, 2, or 3)\n3. **Click to Start** - Select any topic to begin practicing\n4. **Record Your Response** - Click the microphone button and speak for at least 10 seconds\n5. **Get Feedback** - Receive instant grammar and vocabulary suggestions\n6. **Complete All Questions** - Finish the topic to get your IELTS band score\n\n## Tips:\n- Practice regularly for best results\n- Speak naturally and clearly\n- Review all feedback carefully',
    ARRAY['start', 'begin', 'practice', 'getting started', 'first time'],
    TRUE
  ),
  (
    (SELECT id FROM faq_categories WHERE slug = 'speaking-practice'),
    'Why is there a 10-second minimum for recordings?',
    'recording-minimum-duration',
    'The 10-second minimum ensures we have enough audio to provide accurate pronunciation analysis and meaningful feedback.',
    E'# Recording Duration Requirements\n\nWe require a minimum of 10 seconds of speech for several important reasons:\n\n## Accuracy\nShorter recordings don''t provide enough data for accurate:\n- Pronunciation analysis\n- Fluency assessment\n- Grammar pattern detection\n\n## IELTS Alignment\nIELTS speaking responses typically require:\n- Part 1: 20-30 seconds per answer\n- Part 2: 1-2 minutes\n- Part 3: 30-60 seconds per answer\n\n## Better Feedback\nLonger responses allow us to:\n- Identify speech patterns\n- Provide more specific suggestions\n- Calculate accurate band scores',
    ARRAY['recording', '10 seconds', 'minimum', 'duration', 'time limit'],
    TRUE
  ),
  (
    (SELECT id FROM faq_categories WHERE slug = 'technical-issues'),
    'Microphone not working on mobile',
    'microphone-not-working-mobile',
    'Ensure you''ve granted microphone permissions in your browser settings and are using HTTPS.',
    E'# Fix Microphone Issues on Mobile\n\n## Check Permissions\n1. Go to browser settings\n2. Find site permissions\n3. Allow microphone access\n\n## iOS Specific\n- Settings > Safari > Microphone > Allow\n- Must use Safari browser\n\n## Android Specific\n- Chrome: Settings > Site Settings > Microphone\n- Allow for this site\n\n## General Tips\n- Refresh the page after granting permissions\n- Ensure no other apps are using the microphone\n- Try closing and reopening the browser',
    ARRAY['microphone', 'mobile', 'ios', 'android', 'permissions', 'not working'],
    TRUE
  ),
  (
    (SELECT id FROM faq_categories WHERE slug = 'scoring-feedback'),
    'How is my IELTS score calculated?',
    'ielts-score-calculation',
    'Your score is based on fluency, vocabulary, grammar, and pronunciation across all your responses in a topic.',
    E'# IELTS Score Calculation\n\n## Four Scoring Criteria\n\n### 1. Fluency & Coherence (25%)\n- Speech flow and pace\n- Natural pausing\n- Logical connection of ideas\n\n### 2. Lexical Resource (25%)\n- Vocabulary range\n- Word choice accuracy\n- Idiomatic language use\n\n### 3. Grammatical Range (25%)\n- Sentence variety\n- Grammar accuracy\n- Complex structures\n\n### 4. Pronunciation (25%)\n- Individual sounds\n- Word stress\n- Intonation patterns\n\n## Important Notes\n- Complete all questions in a topic for comprehensive scoring\n- Scores are calculated using AI analysis\n- Practice regularly to improve scores',
    ARRAY['score', 'ielts', 'band', 'calculation', 'scoring', 'assessment'],
    FALSE
  )
ON CONFLICT (slug) DO NOTHING;

-- View for most popular FAQs
CREATE OR REPLACE VIEW popular_faqs AS
SELECT 
  fa.id,
  fa.title,
  fa.summary,
  fc.name as category_name,
  fc.icon as category_icon,
  fa.view_count,
  CASE 
    WHEN (fa.helpful_count + fa.not_helpful_count) > 0 
    THEN (fa.helpful_count * 100 / (fa.helpful_count + fa.not_helpful_count))::INTEGER
    ELSE NULL
  END as helpful_percentage
FROM faq_articles fa
JOIN faq_categories fc ON fc.id = fa.category_id
WHERE fa.is_active = TRUE AND fc.is_active = TRUE
ORDER BY fa.view_count DESC
LIMIT 10;

-- View for featured FAQs
CREATE OR REPLACE VIEW featured_faqs AS
SELECT 
  fa.id,
  fa.title,
  fa.summary,
  fc.name as category_name,
  fc.icon as category_icon
FROM faq_articles fa
JOIN faq_categories fc ON fc.id = fa.category_id
WHERE fa.is_active = TRUE 
  AND fc.is_active = TRUE 
  AND fa.is_featured = TRUE
ORDER BY fa.sort_order, fa.title;