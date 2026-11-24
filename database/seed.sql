
-- Inserindo autores
INSERT INTO autores (nome, nacionalidade, ano_nascimento)
VALUES
    ('Machado de Assis', 'Brasileira', 1839),
    ('Clarice Lispector', 'Brasileira', 1920),
    ('George Orwell', 'Britânica', 1903),
    ('J.K. Rowling', 'Britânica', 1965);

-- Inserindo livros
INSERT INTO livros (titulo, ano_publicacao, genero, autor_id)
VALUES
    ('Dom Casmurro', 1899, 'Romance', 1),
    ('Memórias Póstumas de Brás Cubas', 1881, 'Romance', 1),
    ('A Hora da Estrela', 1977, 'Romance', 2),
    ('Laços de Família', 1960, 'Contos', 2),
    ('1984', 1949, 'Ficção distópica', 3),
    ('A Revolução dos Bichos', 1945, 'Sátira', 3),
    ('Harry Potter e a Pedra Filosofal', 1997, 'Fantasia', 4),
    ('Harry Potter e a Câmara Secreta', 1998, 'Fantasia', 4);
