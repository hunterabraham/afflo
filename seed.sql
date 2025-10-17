-- Seed data for Afflo database
-- This file seeds all tables with sample data for development/testing

-- Clean up existing data (in reverse order of dependencies)
-- Use IF EXISTS to avoid errors if tables don't exist yet
TRUNCATE TABLE IF EXISTS afflo_affiliate_event CASCADE;
TRUNCATE TABLE IF EXISTS afflo_affiliate_to_partner CASCADE;
TRUNCATE TABLE IF EXISTS afflo_affiliate CASCADE;
TRUNCATE TABLE IF EXISTS afflo_partner CASCADE;
TRUNCATE TABLE IF EXISTS afflo_session CASCADE;
TRUNCATE TABLE IF EXISTS afflo_account CASCADE;
TRUNCATE TABLE IF EXISTS afflo_verification_token CASCADE;
TRUNCATE TABLE IF EXISTS afflo_user CASCADE;

-- Seed Users
INSERT INTO afflo_user (id, name, email, "emailVerified", image, updated_at, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Sarah Johnson', 'sarah.johnson@example.com', NOW(), 'https://i.pravatar.cc/150?img=1', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'sarah.johnson@example.com', NOW(), 'https://i.pravatar.cc/150?img=1', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 'michael.chen@example.com', NOW(), 'https://i.pravatar.cc/150?img=2', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Emily Rodriguez', 'emily.rodriguez@example.com', NOW(), 'https://i.pravatar.cc/150?img=3', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'David Kim', 'david.kim@example.com', NOW(), 'https://i.pravatar.cc/150?img=4', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Jessica Williams', 'jessica.williams@example.com', NOW(), 'https://i.pravatar.cc/150?img=5', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'Alex Thompson', 'alex.thompson@example.com', NOW(), 'https://i.pravatar.cc/150?img=6', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Maria Garcia', 'maria.garcia@example.com', NOW(), 'https://i.pravatar.cc/150?img=7', NOW(), NOW());

-- Seed Partners
INSERT INTO afflo_partner (id, name, domain, shopify_secret, updated_at, created_at) VALUES
('650e8400-e29b-41d4-a716-546655440000', 'EcoStyle Fashion', 'ecostyle.com', 'shpss_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz', NOW(), NOW()),
('650e8400-e29b-41d4-a716-546655440001', 'TechGadgets Pro', 'techgadgetspro.com', 'shpss_xyz987wvu654tsr321qpo098nml765kji432hgf210edc098ba', NOW(), NOW()),
('650e8400-e29b-41d4-a716-546655440002', 'Wellness Haven', 'wellnesshaven.com', 'shpss_mno456pqr789stu012vwx345yza678bcd901efg234hij567klm', NOW(), NOW()),
('650e8400-e29b-41d4-a716-546655440003', 'Urban Home Decor', 'urbanhomedecor.com', 'shpss_def321ghi654jkl987mno210pqr543stu876vwx109yza432bcd', NOW(), NOW()),
('650e8400-e29b-41d4-a716-546655440004', 'FitLife Gear', 'fitlifegear.com', 'shpss_vwx765yza098bcd321efg654hij987klm210nop543qrs876tuv109', NOW(), NOW());

-- Seed Affiliates
INSERT INTO afflo_affiliate (id, user_id, updated_at, created_at) VALUES
('750e8400-e29b-41d4-a716-646655440000', '550e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-646655440001', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('750e8400-e29b-41d4-a716-646655440002', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('750e8400-e29b-41d4-a716-646655440003', '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('750e8400-e29b-41d4-a716-646655440004', '550e8400-e29b-41d4-a716-446655440004', NOW(), NOW()),
('750e8400-e29b-41d4-a716-646655440005', '550e8400-e29b-41d4-a716-446655440005', NOW(), NOW());

-- Seed Affiliate to Partner relationships (many-to-many)
-- Sarah (affiliate 0) works with EcoStyle and Wellness Haven
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW());

-- Michael (affiliate 1) works with TechGadgets and FitLife
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- Emily (affiliate 2) works with EcoStyle, Urban Home, and Wellness Haven
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW());

-- David (affiliate 3) works with TechGadgets only
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Jessica (affiliate 4) works with Urban Home and FitLife
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- Alex (affiliate 5) works with all partners (power affiliate!)
INSERT INTO afflo_affiliate_to_partner (affiliate_id, partner_id, created_at, updated_at) VALUES
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440000', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', NOW(), NOW()),
('750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', NOW(), NOW());

-- Seed Affiliate Events
-- Sales events
INSERT INTO afflo_affiliate_event (id, affiliate_id, partner_id, type, data, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440000', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'sale', 
  '{"order_id": "ORD-001", "amount": 159.99, "currency": "USD", "products": ["Organic Cotton T-Shirt", "Bamboo Socks"], "commission": 15.99}'::jsonb, 
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'sale', 
  '{"order_id": "ORD-002", "amount": 899.99, "currency": "USD", "products": ["Wireless Earbuds Pro"], "commission": 89.99}'::jsonb, 
  NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'sale', 
  '{"order_id": "ORD-003", "amount": 249.99, "currency": "USD", "products": ["Essential Oil Set", "Aromatherapy Diffuser"], "commission": 37.49}'::jsonb, 
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440003', 'sale', 
  '{"order_id": "ORD-004", "amount": 1299.99, "currency": "USD", "products": ["Modern Sectional Sofa"], "commission": 129.99}'::jsonb, 
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- Product seeding events
INSERT INTO afflo_affiliate_event (id, affiliate_id, partner_id, type, data, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440010', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'product_seed', 
  '{"product_ids": ["PROD-101", "PROD-102"], "quantity": 10, "value": 500.00}'::jsonb, 
  NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('850e8400-e29b-41d4-a716-446655440011', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'product_seed', 
  '{"product_ids": ["PROD-201"], "quantity": 5, "value": 750.00}'::jsonb, 
  NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
('850e8400-e29b-41d4-a716-446655440012', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440004', 'product_seed', 
  '{"product_ids": ["PROD-501", "PROD-502", "PROD-503"], "quantity": 15, "value": 1200.00}'::jsonb, 
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- Social media post events
INSERT INTO afflo_affiliate_event (id, affiliate_id, partner_id, type, data, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440020', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'social_post', 
  '{"platform": "instagram", "post_id": "IG123456", "engagement": {"likes": 342, "comments": 28, "shares": 15}}'::jsonb, 
  NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('850e8400-e29b-41d4-a716-446655440021', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'social_post', 
  '{"platform": "tiktok", "post_id": "TT789012", "engagement": {"views": 12500, "likes": 890, "comments": 67}}'::jsonb, 
  NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('850e8400-e29b-41d4-a716-446655440022', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'social_post', 
  '{"platform": "youtube", "post_id": "YT345678", "engagement": {"views": 25000, "likes": 1234, "comments": 89}}'::jsonb, 
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Click tracking events
INSERT INTO afflo_affiliate_event (id, affiliate_id, partner_id, type, data, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440030', '750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'link_click', 
  '{"link_id": "LINK-001", "clicks": 156, "unique_clicks": 98, "source": "instagram_bio"}'::jsonb, 
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('850e8400-e29b-41d4-a716-446655440031', '750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'link_click', 
  '{"link_id": "LINK-002", "clicks": 234, "unique_clicks": 187, "source": "youtube_description"}'::jsonb, 
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('850e8400-e29b-41d4-a716-446655440032', '750e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 'link_click', 
  '{"link_id": "LINK-003", "clicks": 89, "unique_clicks": 67, "source": "twitter_profile"}'::jsonb, 
  NOW(), NOW());

-- Commission payout events
INSERT INTO afflo_affiliate_event (id, affiliate_id, partner_id, type, data, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440040', '750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'commission_payout', 
  '{"amount": 456.78, "currency": "USD", "period": "2024-09", "method": "bank_transfer"}'::jsonb, 
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('850e8400-e29b-41d4-a716-446655440041', '750e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001', 'commission_payout', 
  '{"amount": 1234.56, "currency": "USD", "period": "2024-09", "method": "paypal"}'::jsonb, 
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('850e8400-e29b-41d4-a716-446655440042', '750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'commission_payout', 
  '{"amount": 789.12, "currency": "USD", "period": "2024-09", "method": "bank_transfer"}'::jsonb, 
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days');

-- Summary output
DO $$ 
BEGIN
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Seed data has been inserted!';
  RAISE NOTICE '=================================';
  RAISE NOTICE 'Users created: %', (SELECT COUNT(*) FROM afflo_user);
  RAISE NOTICE 'Partners created: %', (SELECT COUNT(*) FROM afflo_partner);
  RAISE NOTICE 'Affiliates created: %', (SELECT COUNT(*) FROM afflo_affiliate);
  RAISE NOTICE 'Affiliate-Partner relationships: %', (SELECT COUNT(*) FROM afflo_affiliate_to_partner);
  RAISE NOTICE 'Affiliate events created: %', (SELECT COUNT(*) FROM afflo_affiliate_event);
  RAISE NOTICE '=================================';
END $$;

