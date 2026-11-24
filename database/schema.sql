
CREATE TABLE IF NOT EXISTS autores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK(length(trim(nome)) > 0),
    nacionalidade TEXT NOT NULL,
    ano_nascimento INTEGER NOT NULL
);


CREATE TABLE IF NOT EXISTS livros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL CHECK(length(trim(titulo)) > 0),
    ano_publicacao INTEGER NOT NULL,
    genero TEXT NOT NULL,
    autor_id INTEGER NOT NULL,

    FOREIGN KEY (autor_id)
        REFERENCES autores(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);
