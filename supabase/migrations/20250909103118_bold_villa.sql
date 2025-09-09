-- Seed data for cosmetics e-commerce

-- Insert categories
INSERT INTO categories (name, slug, is_active) VALUES
('Skincare', 'skincare', true),
('Makeup', 'makeup', true),
('Fragrance', 'fragrance', true),
('Hair Care', 'hair-care', true),
('Body Care', 'body-care', true);

-- Insert sample products
INSERT INTO products (
  name, slug, description, price, discount_price, is_discount, is_feature, 
  category_id, image_url, stock, variation1, variation2, rating, review_count
) VALUES
(
  'Luminance Brightening Cream',
  'luminance-brightening-cream',
  'A brightening day cream formulated with niacinamide and hyaluronic acid to even out skin tone and boost natural glow.',
  104.99,
  45.50,
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'skincare'),
  'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg',
  25,
  '50ml',
  'Day Cream',
  4.5,
  12
),
(
  'Velvet Bloom Lip Color',
  'velvet-bloom-lip-color',
  'A rich, long-lasting matte lip color infused with nourishing oils for a smooth, bold finish without drying out your lips.',
  54.99,
  29.90,
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'makeup'),
  'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
  40,
  'Coral Rose',
  'Matte',
  4.2,
  8
),
(
  'Elegance Revitalizing Serum',
  'elegance-revitalizing-serum',
  'This anti-aging serum penetrates deep into your skin, restoring elasticity and reducing fine lines for a radiant, youthful look.',
  129.99,
  52.00,
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'skincare'),
  'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
  15,
  '30ml',
  'Anti-Aging',
  4.7,
  25
),
(
  'Soft Glow Moisturizer',
  'soft-glow-moisturizer',
  'A lightweight daily moisturizer enriched with aloe vera and vitamin E to hydrate and refresh your skin with a silky-smooth finish.',
  89.99,
  70.00,
  true,
  true,
  (SELECT id FROM categories WHERE slug = 'skincare'),
  'https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg',
  30,
  '75ml',
  'Daily Use',
  4.3,
  18
),
(
  'Rose Gold Highlighter',
  'rose-gold-highlighter',
  'Illuminate your features with this luxurious rose gold highlighter that gives you a natural, radiant glow.',
  45.99,
  NULL,
  false,
  false,
  (SELECT id FROM categories WHERE slug = 'makeup'),
  'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
  20,
  'Rose Gold',
  'Powder',
  4.1,
  6
),
(
  'Hydrating Face Mask',
  'hydrating-face-mask',
  'A deeply hydrating face mask with hyaluronic acid and botanical extracts for instant moisture and radiance.',
  35.99,
  NULL,
  false,
  false,
  (SELECT id FROM categories WHERE slug = 'skincare'),
  'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
  50,
  'Single Use',
  'Hydrating',
  4.4,
  14
),
(
  'Matte Foundation',
  'matte-foundation',
  'Long-wearing matte foundation that provides full coverage while feeling lightweight on your skin.',
  65.99,
  NULL,
  false,
  false,
  (SELECT id FROM categories WHERE slug = 'makeup'),
  'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
  35,
  'Medium',
  'Matte',
  4.0,
  22
),
(
  'Vitamin C Serum',
  'vitamin-c-serum',
  'Powerful antioxidant serum with 20% Vitamin C to brighten skin and protect against environmental damage.',
  75.99,
  NULL,
  false,
  true,
  (SELECT id FROM categories WHERE slug = 'skincare'),
  'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
  18,
  '30ml',
  'Brightening',
  4.6,
  31
);

-- Create an admin user (you'll need to sign up with this email first)
-- This is just a placeholder - the actual user creation happens through Supabase Auth
-- After signing up with admin@cosmetics.com, run this to set the role:
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@cosmetics.com');