-- Inserção de dados de exemplo para Artistas
INSERT INTO artists (name, created_at, updated_at) VALUES
('The Beatles', NOW(), NOW()),
('Pink Floyd', NOW(), NOW()),
('Led Zeppelin', NOW(), NOW()),
('Queen', NOW(), NOW()),
('David Bowie', NOW(), NOW()),
('The Rolling Stones', NOW(), NOW()),
('Metallica', NOW(), NOW()),
('Adele', NOW(), NOW()),
('Taylor Swift', NOW(), NOW()),
('The Who', NOW(), NOW()),
('Jimi Hendrix', NOW(), NOW()),
('Nirvana', NOW(), NOW()),
('Radiohead', NOW(), NOW()),
('AC/DC', NOW(), NOW()),
('Bob Dylan', NOW(), NOW());

-- Inserção de dados de exemplo para Álbuns
INSERT INTO albums (title, artist_id, created_at, updated_at) VALUES
-- The Beatles
('Abbey Road', 1, NOW(), NOW()),
('The White Album', 1, NOW(), NOW()),
('Sgt. Pepper''s Lonely Hearts Club Band', 1, NOW(), NOW()),
('Revolver', 1, NOW(), NOW()),

-- Pink Floyd
('The Dark Side of the Moon', 2, NOW(), NOW()),
('Wish You Were Here', 2, NOW(), NOW()),
('The Wall', 2, NOW(), NOW()),
('Animals', 2, NOW(), NOW()),

-- Led Zeppelin
('Led Zeppelin IV', 3, NOW(), NOW()),
('Physical Graffiti', 3, NOW(), NOW()),
('Houses of the Holy', 3, NOW(), NOW()),

-- Queen
('A Night at the Opera', 4, NOW(), NOW()),
('Innuendo', 4, NOW(), NOW()),
('The Game', 4, NOW(), NOW()),

-- David Bowie
('The Rise and Fall of Ziggy Stardust and the Spiders from Mars', 5, NOW(), NOW()),
('Hunky Dory', 5, NOW(), NOW()),
('Station to Station', 5, NOW(), NOW()),

-- The Rolling Stones
('Exile on Main St.', 6, NOW(), NOW()),
('Sticky Fingers', 6, NOW(), NOW()),
('Their Satanic Majesties Request', 6, NOW(), NOW()),

-- Metallica
('Master of Puppets', 7, NOW(), NOW()),
('The Black Album', 7, NOW(), NOW()),
('...And Justice for All', 7, NOW(), NOW()),

-- Adele
('25', 8, NOW(), NOW()),
('21', 8, NOW(), NOW()),
('30', 8, NOW(), NOW()),

-- Taylor Swift
('1989', 9, NOW(), NOW()),
('Folklore', 9, NOW(), NOW()),
('Midnights', 9, NOW(), NOW()),

-- The Who
('Tommy', 10, NOW(), NOW()),
('Who''s Next', 10, NOW(), NOW()),
('Quadrophenia', 10, NOW(), NOW()),

-- Jimi Hendrix
('Are You Experienced', 11, NOW(), NOW()),
('Electric Ladyland', 11, NOW(), NOW()),
('Band of Gypsys', 11, NOW(), NOW()),

-- Nirvana
('Nevermind', 12, NOW(), NOW()),
('In Utero', 12, NOW(), NOW()),
('MTV Unplugged in New York', 12, NOW(), NOW()),

-- Radiohead
('OK Computer', 13, NOW(), NOW()),
('In Rainbows', 13, NOW(), NOW()),
('A Moon Shaped Pool', 13, NOW(), NOW()),

-- AC/DC
('Back in Black', 14, NOW(), NOW()),
('Highway to Hell', 14, NOW(), NOW()),
('For Those About to Rock We Salute You', 14, NOW(), NOW()),

-- Bob Dylan
('Blonde on Blonde', 15, NOW(), NOW()),
('Highway 61 Revisited', 15, NOW(), NOW()),
('The Freewheelin'' Bob Dylan', 15, NOW(), NOW());
