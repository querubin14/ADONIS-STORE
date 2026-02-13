-- 1. Create the product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL, -- Assuming products.id is TEXT based on current schema (or UUID if that was changed, but likely TEXT from 'savage_id' or similar wrapper)
  color_name TEXT NOT NULL,
  image_url TEXT,
  hex_code TEXT,
  stock_quantity INTEGER DEFAULT 0,
  price NUMERIC, -- Optional override price for this variant
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS (Optional, standard practice)
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- 3. Create Policy (Open for now as requested for admin/public read)
CREATE POLICY "Enable read access for all users" ON "product_variants" FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON "product_variants" FOR INSERT WITH CHECK (true); -- Simplified for dev
CREATE POLICY "Enable update for authenticated users only" ON "product_variants" FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON "product_variants" FOR DELETE USING (true);

-- 4. (Optional) Foreign Key Constraint if product_id is compatible
-- ALTER TABLE product_variants ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
