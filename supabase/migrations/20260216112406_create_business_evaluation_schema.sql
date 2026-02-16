/*
  # Business Evaluation System Schema

  ## Overview
  Creates a comprehensive business evaluation system with tables for tracking:
  - Financial transactions (revenue, expenses)
  - Business assets
  - Business roadmap items
  - Key business metrics

  ## New Tables

  ### `transactions`
  Stores all business financial transactions
  - `id` (uuid, primary key)
  - `label` (text) - Transaction description/label
  - `type` (text) - Type: 'revenue', 'expense', 'budget'
  - `amount` (decimal) - Transaction amount
  - `category` (text) - Category for grouping
  - `date` (date) - Transaction date
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid) - Owner of the transaction

  ### `assets`
  Tracks business assets
  - `id` (uuid, primary key)
  - `name` (text) - Asset name/label
  - `value` (decimal) - Current asset value
  - `category` (text) - Asset category
  - `acquired_date` (date) - When asset was acquired
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid) - Owner of the asset

  ### `roadmap_items`
  Business roadmap planning
  - `id` (uuid, primary key)
  - `title` (text) - Roadmap item title
  - `description` (text) - Detailed description
  - `type` (text) - Type: 'user_defined', 'suggested'
  - `status` (text) - Status: 'planned', 'in_progress', 'completed'
  - `target_date` (date) - Target completion date
  - `priority` (text) - Priority: 'low', 'medium', 'high'
  - `created_at` (timestamptz) - Record creation timestamp
  - `user_id` (uuid) - Owner of the roadmap item

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated users to manage their own data
  - Users can only access their own business data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  type text NOT NULL CHECK (type IN ('revenue', 'expense', 'budget')),
  amount decimal(12, 2) NOT NULL,
  category text NOT NULL DEFAULT '',
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value decimal(12, 2) NOT NULL,
  category text NOT NULL DEFAULT '',
  acquired_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Create roadmap_items table
CREATE TABLE IF NOT EXISTS roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL CHECK (type IN ('user_defined', 'suggested')),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  target_date date,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Assets policies
CREATE POLICY "Users can view own assets"
  ON assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Roadmap items policies
CREATE POLICY "Users can view own roadmap items"
  ON roadmap_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own roadmap items"
  ON roadmap_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmap items"
  ON roadmap_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmap items"
  ON roadmap_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_user_id ON roadmap_items(user_id);