-- PostgreSQL Schema for Flashback DB in Supabase

-- Enable UUID extension (common in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- Table structure for table 'colors'
--

CREATE TABLE colors (
  color_id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE,
  hex_code VARCHAR(7)
);

--
-- Data for table 'colors'
--

INSERT INTO colors (name, hex_code) VALUES
('slate', '#64748b'),
('gray', '#6b7280'),
('zinc', '#71717a'),
('neutral', '#737373'),
('stone', '#78716c'),
('red', '#ef4444'),
('orange', '#f97316'),
('amber', '#f59e0b'),
('yellow', '#eab308'),
('lime', '#84cc16'),
('green', '#22c55e'),
('emerald', '#10b981'),
('teal', '#14b8a6'),
('cyan', '#06b6d4'),
('sky', '#0ea5e9'),
('blue', '#3b82f6'),
('indigo', '#6366f1'),
('violet', '#8b5cf6'),
('purple', '#a855f7'),
('fuchsia', '#d946ef'),
('pink', '#ec4899'),
('rose', '#f43f5e');

--
-- Table structure for table 'schools'
--

CREATE TABLE schools (
  school_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  domain VARCHAR(100) NOT NULL UNIQUE
);

--
-- Table structure for table 'tags'
--

CREATE TABLE tags (
  tag_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color_id INTEGER REFERENCES colors(color_id) ON DELETE SET NULL,
  description VARCHAR(255)
);

--
-- Table structure for table 'users'
--

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  theme_preference VARCHAR(20),
  last_login TIMESTAMP WITH TIME ZONE,
  user_type VARCHAR(20),
  school_id INTEGER REFERENCES schools(school_id) ON DELETE SET NULL,
  interests JSONB
);

-- Comment: Using JSONB for interests instead of longtext with json_valid check

--
-- Table structure for table 'folders'
--

CREATE TABLE folders (
  folder_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  color_id INTEGER REFERENCES colors(color_id) ON DELETE SET NULL
);

-- Create a function to automatically update last_modified timestamp
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_modified = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for folders
CREATE TRIGGER update_folders_last_modified
BEFORE UPDATE ON folders
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();

--
-- Table structure for table 'decks'
--

CREATE TABLE decks (
  deck_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  folder_id INTEGER REFERENCES folders(folder_id) ON DELETE SET NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_studied TIMESTAMP WITH TIME ZONE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  color_id INTEGER REFERENCES colors(color_id) ON DELETE SET NULL
);

-- Create the trigger for decks
CREATE TRIGGER update_decks_last_modified
BEFORE UPDATE ON decks
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();

--
-- Table structure for table 'cards'
--

CREATE TABLE cards (
  card_id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  front_content TEXT NOT NULL,
  back_content TEXT NOT NULL,
  front_content_type VARCHAR(10) NOT NULL DEFAULT 'plain' CHECK (front_content_type IN ('plain', 'markdown', 'html')),
  back_content_type VARCHAR(10) NOT NULL DEFAULT 'plain' CHECK (back_content_type IN ('plain', 'markdown', 'html')),
  front_image_url VARCHAR(255),
  back_image_url VARCHAR(255),
  notes TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_modified TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  color_id INTEGER REFERENCES colors(color_id) ON DELETE SET NULL
);

-- Create the trigger for cards
CREATE TRIGGER update_cards_last_modified
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION update_last_modified_column();

--
-- Table structure for table 'card_tags'
--

CREATE TABLE card_tags (
  card_id INTEGER NOT NULL REFERENCES cards(card_id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (card_id, tag_id)
);

--
-- Table structure for table 'deck_tags'
--

CREATE TABLE deck_tags (
  deck_id INTEGER NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (deck_id, tag_id)
);

--
-- Table structure for table 'reviews'
--

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  card_id INTEGER NOT NULL REFERENCES cards(card_id) ON DELETE CASCADE,
  deck_id INTEGER NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  rating VARCHAR(5) NOT NULL CHECK (rating IN ('again', 'hard', 'good', 'easy')),
  review_time_ms INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--
-- Table structure for table 'user_stats'
--

CREATE TABLE user_stats (
  stat_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_review_time_ms BIGINT NOT NULL DEFAULT 0,
  total_cards_reviewed INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_review_date DATE,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, date_recorded)
);

--
-- Table structure for table 'deck_stats'
--

CREATE TABLE deck_stats (
  stat_id SERIAL PRIMARY KEY,
  deck_id INTEGER NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  cards_studied INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_time_spent_ms BIGINT NOT NULL DEFAULT 0,
  avg_time_per_card_ms INTEGER NOT NULL DEFAULT 0,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(deck_id, user_id, date_recorded)
);

--
-- Table structure for table 'card_stats'
--

CREATE TABLE card_stats (
  stat_id SERIAL PRIMARY KEY,
  card_id INTEGER NOT NULL REFERENCES cards(card_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  times_reviewed INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  avg_response_time_ms INTEGER NOT NULL DEFAULT 0,
  last_review_date TIMESTAMP WITH TIME ZONE,
  difficulty_score DECIMAL(4,2) DEFAULT 0.00,
  UNIQUE(card_id, user_id)
);

--
-- Table structure for table 'study_sessions'
--

CREATE TABLE study_sessions (
  session_id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  deck_id INTEGER NOT NULL REFERENCES decks(deck_id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP WITH TIME ZONE,
  cards_reviewed INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_time_ms INTEGER
);

--
-- Functions and triggers for color inheritance
--

-- Function to update deck colors when folder color changes
CREATE OR REPLACE FUNCTION update_decks_color()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.color_id IS DISTINCT FROM NEW.color_id THEN
        UPDATE decks 
        SET color_id = NEW.color_id 
        WHERE folder_id = NEW.folder_id 
        AND (color_id IS NULL OR color_id = OLD.color_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update card colors when deck color changes
CREATE OR REPLACE FUNCTION update_cards_color()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.color_id IS DISTINCT FROM NEW.color_id THEN
        UPDATE cards 
        SET color_id = NEW.color_id 
        WHERE deck_id = NEW.deck_id 
        AND (color_id IS NULL OR color_id = OLD.color_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle deck folder changes
CREATE OR REPLACE FUNCTION handle_deck_folder_change()
RETURNS TRIGGER AS $$
DECLARE
    folder_color INTEGER;
BEGIN
    IF NEW.folder_id IS DISTINCT FROM OLD.folder_id AND NEW.folder_id IS NOT NULL THEN
        SELECT color_id INTO folder_color FROM folders WHERE folder_id = NEW.folder_id;
        
        IF folder_color IS NOT NULL AND NEW.color_id IS NULL THEN
            NEW.color_id = folder_color;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the triggers
CREATE TRIGGER folder_color_change
AFTER UPDATE ON folders
FOR EACH ROW
WHEN (OLD.color_id IS DISTINCT FROM NEW.color_id)
EXECUTE FUNCTION update_decks_color();

CREATE TRIGGER deck_color_change
AFTER UPDATE ON decks
FOR EACH ROW
WHEN (OLD.color_id IS DISTINCT FROM NEW.color_id)
EXECUTE FUNCTION update_cards_color();

CREATE TRIGGER deck_folder_change
BEFORE UPDATE ON decks
FOR EACH ROW
WHEN (OLD.folder_id IS DISTINCT FROM NEW.folder_id)
EXECUTE FUNCTION handle_deck_folder_change();

-- Add Supabase RLS (Row Level Security) policies
-- These policies control access to the tables based on the authenticated user

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE deck_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Users can view their own folders" ON folders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = folders.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own folders" ON folders
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = folders.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own folders" ON folders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = folders.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own folders" ON folders
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = folders.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own decks or public decks" ON decks
  FOR SELECT USING (
    (EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = decks.user_id
      AND users.auth_id = auth.uid()
    )) OR is_public = TRUE
  );

CREATE POLICY "Users can insert their own decks" ON decks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = decks.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own decks" ON decks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = decks.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own decks" ON decks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.user_id = decks.user_id
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can view cards in their decks or public decks" ON cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM decks d 
      JOIN users u ON u.user_id = d.user_id
      WHERE d.deck_id = cards.deck_id 
      AND (u.auth_id = auth.uid() OR d.is_public = TRUE)
    )
  );

CREATE POLICY "Users can insert cards in their decks" ON cards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM decks d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.deck_id = cards.deck_id 
      AND u.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in their decks" ON cards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM decks d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.deck_id = cards.deck_id 
      AND u.auth_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in their decks" ON cards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM decks d
      JOIN users u ON u.user_id = d.user_id
      WHERE d.deck_id = cards.deck_id 
      AND u.auth_id = auth.uid()
    )
  );

-- Setup for auth integration
-- Create a trigger function to sync auth users to our users table
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, username, email)
  VALUES (new.id, new.email, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to fire on new auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
