-- Run ONLY against a new Social-owned PostgreSQL database.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS social_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK(email = lower(email)),
  password_hash text NOT NULL,
  display_name text NOT NULL,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS social_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_sessions_user ON social_sessions(user_id);
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK(char_length(body) BETWEEN 1 AND 5000),
  audience text NOT NULL DEFAULT 'public' CHECK(audience IN ('public','friends','private')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_posts_feed ON social_posts(created_at DESC,id DESC);
CREATE TABLE IF NOT EXISTS social_reactions (
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  emoji text NOT NULL CHECK(emoji IN ('👍','❤️','🔥','🤔','👏')),
  PRIMARY KEY(post_id,user_id)
);
CREATE TABLE IF NOT EXISTS social_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK(char_length(body) BETWEEN 1 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS social_comments_post ON social_comments(post_id,created_at,id);

CREATE TABLE IF NOT EXISTS social_verification_tokens (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

-- Independent Social profile and relationship data; no h00k references.
CREATE TABLE IF NOT EXISTS social_profiles (
  user_id uuid PRIMARY KEY REFERENCES social_users(id) ON DELETE CASCADE,
  bio text NOT NULL DEFAULT '' CHECK(char_length(bio) <= 2000),
  bio_audience text NOT NULL DEFAULT 'private' CHECK(bio_audience IN ('private','friends','public')),
  public_enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS social_friend_requests (
  sender_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(sender_id,recipient_id),
  CHECK(sender_id <> recipient_id)
);
CREATE INDEX IF NOT EXISTS social_friend_requests_recipient ON social_friend_requests(recipient_id,status);
CREATE TABLE IF NOT EXISTS social_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  body text NOT NULL CHECK(char_length(body) BETWEEN 1 AND 4000),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK(sender_id <> recipient_id)
);
CREATE INDEX IF NOT EXISTS social_messages_inbox ON social_messages(recipient_id,created_at DESC);
CREATE INDEX IF NOT EXISTS social_messages_sent ON social_messages(sender_id,created_at DESC);
CREATE TABLE IF NOT EXISTS social_password_reset_tokens (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES social_users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
