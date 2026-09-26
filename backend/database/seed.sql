-- MasteryPath reference data.
--
-- Add only data required for the application to start, such as fixed roles or
-- initial subject areas. Normal user-created data belongs in the application.

INSERT INTO concepts (name, description)
VALUES
    ('Arithmetic', 'This lesson focuses on Arithmetic'),
    ('Algebra', 'This lesson focuses on Algebra'),
    ('Geometry', 'This lesson focuses on Geometry'),
    ('Trigonometry', 'This lesson focuses on Trigonometry'),
    ('Probability', 'This lesson focuses on Probability'),
    ('Statistics', 'This lesson focuses on Statistics'),
    ('Precalculus', 'This lesson focuses on Precalculus'),
    ('Calculus', 'This lesson focuses on Calculus')
RETURNING id, name, description;
