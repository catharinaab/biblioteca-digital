# 📚 Biblioteca Digital API

API REST desenvolvida como parte da disciplina de **Desenvolvimento de Aplicações Web II**, com o objetivo de gerenciar autores e livros por meio de operações CRUD (Create, Read, Update e Delete).

O projeto utiliza Node.js, Express e SQLite, com organização em camadas, validação de dados e relacionamento entre entidades.

## 🚀 Tecnologias utilizadas

- **Node.js** — Ambiente de execução JavaScript.
- **Express** — Framework para criação da API REST.
- **SQLite** — Banco de dados relacional.
- **sqlite3** — Driver de conexão com SQLite.
- **sqlite** — Interface de acesso assíncrono ao banco.
- **dotenv** — Gerenciamento de variáveis de ambiente.
- **Nodemon** — Reinicialização automática do servidor durante o desenvolvimento.
- **REST Client** — Extensão do VS Code utilizada para testar as requisições HTTP.

## 📁 Estrutura do projeto

```text
biblioteca-digital/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── initDatabase.js
│   ├── controllers/
│   │   ├── autorController.js
│   │   └── livroController.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── autorModel.js
│   │   └── livroModel.js
│   ├── routes/
│   │   ├── autorRoutes.js
│   │   └── livroRoutes.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── autores.http
│   └── livros.http
├── .env
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm (geralmente instalado junto com o Node.js).
- [Visual Studio Code](https://code.visualstudio.com/) (recomendado).

## 📥 Instalação

Clone o repositório:

```bash
git clone https://github.com/catharinaab/biblioteca-digital.git
```

Entre na pasta do projeto:

```bash
cd biblioteca-digital
```

Instale as dependências:

```bash
npm install
```

## 🔧 Configuração do ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
```

## 🗄️ Banco de dados

O projeto utiliza SQLite como banco de dados relacional.

Para criar as tabelas e inserir os dados iniciais de exemplo, execute:

```bash
npm run db:init
```

O script utiliza os arquivos:

- `database/schema.sql`: criação das tabelas e definição dos relacionamentos.
- `database/seed.sql`: inserção dos dados iniciais de autores e livros.

O banco de dados é criado localmente na pasta `database`.

## ▶️ Executando a aplicação

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar em modo normal:

```bash
npm start
```

Por padrão, a API estará disponível em:

```text
http://localhost:3000
```

Ao acessar a rota principal, será exibida uma mensagem confirmando o funcionamento da API.

## 📌 Endpoints disponíveis

### Autores

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/autores` | Listar todos os autores |
| GET | `/autores/:id` | Buscar autor por ID |
| POST | `/autores` | Cadastrar autor |
| PUT | `/autores/:id` | Atualizar autor |
| DELETE | `/autores/:id` | Excluir autor |
| GET | `/autores/:id/livros` | Listar livros de um autor |

### Livros

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/livros` | Listar todos os livros |
| GET | `/livros/:id` | Buscar livro por ID |
| POST | `/livros` | Cadastrar livro |
| PUT | `/livros/:id` | Atualizar livro |
| DELETE | `/livros/:id` | Excluir livro |

### Filtros

É possível filtrar os livros pelo gênero utilizando query string:

```http
GET /livros?genero=Fantasia
```

## 📝 Exemplos de requisições

### Cadastrar autor

```http
POST /autores
Content-Type: application/json

{
    "nome": "Jorge Amado",
    "nacionalidade": "Brasileira",
    "ano_nascimento": 1912
}
```

### Cadastrar livro

```http
POST /livros
Content-Type: application/json

{
    "titulo": "Capitães da Areia",
    "ano_publicacao": 1937,
    "genero": "Romance",
    "autor_id": 1
}
```

### Listar livros de um autor

```http
GET /autores/1/livros
```

## 🔗 Relacionamento entre entidades

O banco de dados possui um relacionamento de **um para muitos (1:N)**:

- Um autor pode possuir vários livros.
- Cada livro pertence a um único autor.

A tabela `livros` possui a chave estrangeira `autor_id`, que referencia a chave primária `id` da tabela `autores`.

Também existe uma restrição que impede a exclusão de um autor que ainda possui livros cadastrados.

## 🛡️ Validações e tratamento de erros

A API realiza validações dos dados recebidos e utiliza códigos de status HTTP adequados.

| Código | Descrição |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Registro criado com sucesso |
| 204 | Registro excluído com sucesso |
| 400 | Dados ou parâmetros inválidos |
| 404 | Recurso não encontrado |
| 500 | Erro interno do servidor |

Os erros são tratados por um middleware centralizado, que padroniza as respostas em JSON.

## 🧪 Testes

As requisições HTTP estão organizadas na pasta `tests`, nos arquivos:

- `autores.http`
- `livros.http`

Para executá-las, utilize a extensão **REST Client** no Visual Studio Code e clique em *Send Request* acima de cada requisição.

Os arquivos incluem testes de operações CRUD, filtros, relacionamentos e cenários de erro.

---

**Desenvolvido por Catharina Alves Bonella**

Projeto acadêmico — Desenvolvimento de Aplicações Web II | 2026/2.