\set ON_ERROR_STOP on
\encoding UTF8

\echo 'Resetting the MasteryPath database schema...'

BEGIN;

-- Development only: this removes every object and row in the public schema.
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION CURRENT_USER;

-- \ir resolves paths relative to this file, regardless of the calling folder.
\ir schema.sql
\ir seed.sql

COMMIT;

\echo 'MasteryPath database reset completed.'
