-- MasteryPath database schema.
--
-- Add CREATE TABLE, CREATE INDEX, and other schema definitions to this file.
-- Do not add DROP statements here; reset.sql is responsible for clearing the
-- development database before this file is applied.

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE concepts (
    id UUID PRIMARY KEY DEFAULT uuidv7(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE user_concept_mastery (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,

    mastery_score NUMERIC(5, 4) NOT NULL DEFAULT 0
        CHECK (mastery_score BETWEEN 0 AND 1),

    attempts_count INTEGER NOT NULL DEFAULT 0
        CHECK (attempts_count >= 0),

    last_practiced_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, concept_id)
);
