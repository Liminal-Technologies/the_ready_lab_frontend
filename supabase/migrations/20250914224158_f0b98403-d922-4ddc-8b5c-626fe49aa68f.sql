-- Insert initial tracks for The Ready Lab
INSERT INTO public.tracks (title, description, category, level, price, certification_type, estimated_hours, completion_requirement) VALUES
('Funding Readiness 101', 'Complete guide to preparing your business for funding rounds, from seed to Series A', 'Funding', 'beginner', 199.00, 'verified', 8, 70),
('Infrastructure Essentials', 'Build the foundation systems your business needs to scale effectively', 'Infrastructure', 'intermediate', 299.00, 'verified', 12, 70),
('Brand Identity & Marketing', 'Create a compelling brand that attracts customers and investors', 'Branding', 'beginner', 249.00, 'verified', 10, 70),
('AI for Entrepreneurs', 'Leverage artificial intelligence tools to streamline and scale your business', 'AI', 'intermediate', 399.00, 'verified', 15, 70);

-- Get the track IDs for creating modules
WITH track_data AS (
  SELECT id, title FROM public.tracks WHERE title IN ('Funding Readiness 101', 'Infrastructure Essentials', 'Brand Identity & Marketing', 'AI for Entrepreneurs')
)
-- Insert modules for Funding Readiness 101
INSERT INTO public.modules (track_id, title, description, order_index)
SELECT id, 'Business Plan Fundamentals', 'Learn to create investor-ready business plans', 1
FROM track_data WHERE title = 'Funding Readiness 101'
UNION ALL
SELECT id, 'Financial Projections & Modeling', 'Build compelling financial models that investors trust', 2
FROM track_data WHERE title = 'Funding Readiness 101'
UNION ALL
SELECT id, 'Pitch Deck Mastery', 'Craft presentations that secure funding', 3
FROM track_data WHERE title = 'Funding Readiness 101'
UNION ALL
-- Modules for Brand Identity & Marketing
SELECT id, 'Brand Strategy & Positioning', 'Define your unique market position', 1
FROM track_data WHERE title = 'Brand Identity & Marketing'
UNION ALL
SELECT id, 'Visual Identity Design', 'Create logos, colors, and visual systems', 2
FROM track_data WHERE title = 'Brand Identity & Marketing'
UNION ALL
SELECT id, 'Digital Marketing Fundamentals', 'Master online marketing channels', 3
FROM track_data WHERE title = 'Brand Identity & Marketing'
UNION ALL
-- Modules for AI for Entrepreneurs
SELECT id, 'AI Strategy & Implementation', 'Plan your AI adoption roadmap', 1
FROM track_data WHERE title = 'AI for Entrepreneurs'
UNION ALL
SELECT id, 'Automation & Productivity Tools', 'Streamline operations with AI tools', 2
FROM track_data WHERE title = 'AI for Entrepreneurs'
UNION ALL
SELECT id, 'AI Marketing & Customer Service', 'Enhance customer experience with AI', 3
FROM track_data WHERE title = 'AI for Entrepreneurs';