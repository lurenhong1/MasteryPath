-- MasteryPath reference data.
--
-- Add only data required for the application to start, such as fixed roles or
-- initial subject areas. Normal user-created data belongs in the application.

INSERT INTO concepts (name)
VALUES
    ('Arithmetic'),
    ('Algebra'),
    ('Geometry'),
    ('Trigonometry'),
    ('Probability'),
    ('Statistics'),
    ('Precalculus'),
    ('Calculus')
RETURNING id, name;
