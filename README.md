# 📚 Biblioteca Digital API

API REST desenvolvida como parte da disciplina de **Desenvolvimento de Aplicações Web II**, com o objetivo de gerenciar usuários, autores e livros.

O projeto utiliza Node.js, Express e SQLite, com organização em camadas, operações CRUD, relacionamento entre entidades, autenticação, autorização e mecanismos de segurança.

A API permite que usuários realizem cadastro e login, gerenciem seus próprios autores e livros e acessem recursos de acordo com seu perfil de permissão.

## 🚀 Tecnologias utilizadas

- **Node.js** — Ambiente de execução JavaScript.
- **Express** — Framework para criação da API REST.
- **SQLite** — Banco de dados relacional.
- **sqlite3** — Driver de conexão com SQLite.
- **sqlite** — Interface de acesso assíncrono ao banco.
- **bcrypt** — Proteção de senhas por meio de hash.
- **jsonwebtoken (JWT)** — Autenticação baseada em tokens.
- **Helmet** — Proteção de cabeçalhos HTTP.
- **CORS** — Controle de acesso entre origens.
- **express-rate-limit** — Limitação de requisições.
- **dotenv** — Gerenciamento de variáveis de ambiente.
- **Jest** — Framework para testes automatizados.
- **Supertest** — Testes das requisições HTTP.
- **Nodemon** — Reinicialização automática do servidor durante o desenvolvimento.
- **REST Client** — Extensão do VS Code utilizada para testar requisições HTTP.

## 📁 Estrutura do projeto

```text
biblioteca-digital/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── initDatabase.js
│   │   ├── migrateOwnership.js
│   │   └── criarAdmin.js
│   ├── controllers/
│   │   ├── autorController.js
│   │   ├── livroController.js
│   │   └── usuarioController.js
│   ├── middlewares/
│   │   ├── autenticar.js
│   │   ├── autorizar.js
│   │   ├── errorHandler.js
│   │   └── loginLimiter.js
│   ├── models/
│   │   ├── autorModel.js
│   │   ├── livroModel.js
│   │   └── usuarioModel.js
│   ├── routes/
│   │   ├── autorRoutes.js
│   │   ├── livroRoutes.js
│   │   └── usuarioRoutes.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── autenticacao.test.js
│   ├── propriedade.test.js
│   ├── setupDatabase.js
│   └── setupEnv.js
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
├── usuarios.http
├── autores.http
├── livros.http
└── README.md
```

## ⚙️ Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm (instalado junto com o Node.js).
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

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência.

Configure as seguintes variáveis:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_aqui
CORS_ORIGIN=http://localhost:5173
```

- `PORT`: porta utilizada pelo servidor.
- `JWT_SECRET`: chave secreta utilizada para assinar e verificar os tokens JWT.
- `CORS_ORIGIN`: origem autorizada a acessar a API.

**Importante:** utilize uma chave secreta forte para o JWT. O arquivo `.env` contém informações privadas e não deve ser enviado ao GitHub.

## 🗄️ Banco de dados

O projeto utiliza SQLite como banco de dados relacional.

Para inicializar o banco de dados, execute:

```bash
npm run db:init
```

O banco utiliza os seguintes arquivos:

- `database/schema.sql`: criação das tabelas e definição dos relacionamentos.
- `database/seed.sql`: inserção dos dados iniciais de exemplo.
- `src/config/database.js`: configuração da conexão com o banco.
- `src/config/initDatabase.js`: inicialização das tabelas e dos dados de exemplo.
- `src/config/migrateOwnership.js`: migração responsável por adicionar a coluna `usuario_id` às tabelas `autores` e `livros`, permitindo identificar o proprietário de cada registro.

A migração `migrateOwnership.js` é destinada a bancos existentes que ainda não possuem as colunas de propriedade. Para executar manualmente em um banco antigo, utilize:

```bash
node src/config/migrateOwnership.js
```

O banco de dados é armazenado localmente na pasta `database`.

## 👤 Cadastro e criação do administrador

A API possui dois perfis de acesso:

- **Administrador (`admin`):** possui permissões administrativas, podendo consultar e gerenciar registros independentemente do usuário proprietário.
- **Usuário comum (`usuario`):** pode visualizar, cadastrar, atualizar e excluir somente seus próprios autores e livros.

O cadastro público cria automaticamente usuários com o perfil `usuario`. Não é permitido escolher o perfil administrativo por meio da rota pública de cadastro.

### Criando uma conta administrativa

A criação do administrador é realizada por um script separado, localizado em:

```text
src/config/criarAdmin.js
```

Para executar o script, configure temporariamente as seguintes variáveis no arquivo `.env`:

```env
ADMIN_NOME=Administrador
ADMIN_EMAIL=admin@biblioteca.com
ADMIN_SENHA=sua_senha_forte
```

Em seguida, execute:

```bash
npm run admin:create
```

O script:

1. Verifica se os dados necessários foram configurados.
2. Confere se o e-mail já está cadastrado.
3. Gera o hash da senha utilizando bcrypt.
4. Cria a conta com o perfil `admin`.

Após a criação, as variáveis `ADMIN_NOME`, `ADMIN_EMAIL` e `ADMIN_SENHA` podem ser removidas do `.env`. A conta administrativa permanece cadastrada no banco de dados.

**Importante:** não compartilhe as credenciais administrativas e não envie o arquivo `.env` ao GitHub.

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

## 🔐 Autenticação e autorização

A API utiliza autenticação baseada em **JWT (JSON Web Token)**.

O processo funciona da seguinte maneira:

1. O usuário realiza o cadastro informando nome, e-mail e senha.
2. A senha é armazenada de forma protegida utilizando bcrypt.
3. O usuário realiza login com suas credenciais.
4. Após a autenticação, a API retorna um token JWT com validade de uma hora.
5. O token deve ser enviado no cabeçalho `Authorization` das requisições protegidas.

Exemplo:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

### Controle de permissões

As rotas protegidas utilizam middlewares de autenticação e autorização.

- O middleware `autenticar.js` verifica a validade do token.
- O middleware `autorizar.js` verifica se o perfil possui permissão para acessar determinado recurso.

A API utiliza os seguintes códigos de resposta:

| Código | Descrição |
|---|---|
| 401 | Token ausente, inválido ou expirado |
| 403 | Usuário sem permissão para acessar o recurso |

### Regras de acesso

| Funcionalidade | Administrador | Usuário comum |
|---|---|---|
| Consultar perfil autenticado | Sim | Sim |
| Acessar rota administrativa | Sim | Não |
| Listar autores e livros | Todos | Próprios |
| Consultar registros de outros usuários | Sim | Não |
| Editar registros de outros usuários | Sim | Não |
| Excluir registros de outros usuários | Sim | Não |

## 🛡️ Recursos de segurança

Foram implementados mecanismos para proteger a API:

- **bcrypt:** armazenamento de senhas por meio de hash.
- **JWT:** autenticação por tokens com expiração.
- **Autorização por perfil:** restrição de acesso conforme o tipo de usuário.
- **Controle de propriedade:** impede que usuários comuns acessem ou alterem registros de outras pessoas.
- **Consultas parametrizadas:** utilização de parâmetros nas operações com o banco de dados para reduzir riscos de SQL Injection.
- **Helmet:** configuração de cabeçalhos HTTP de segurança.
- **CORS restrito:** permite requisições somente da origem configurada.
- **Rate limiting:** limita as tentativas de login a cinco requisições por janela de quinze minutos.

## 📌 Endpoints disponíveis

As rotas de usuários possuem regras próprias de acesso. As rotas de autores e livros exigem autenticação JWT.

### Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/usuarios/cadastro` | Cadastrar usuário |
| POST | `/usuarios/login` | Realizar login |
| GET | `/usuarios/perfil` | Consultar perfil autenticado |
| GET | `/usuarios/admin` | Acessar rota administrativa |

### Autores

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/autores` | Listar autores permitidos ao usuário |
| GET | `/autores/:id` | Buscar autor por ID |
| POST | `/autores` | Cadastrar autor |
| PUT | `/autores/:id` | Atualizar autor |
| DELETE | `/autores/:id` | Excluir autor |
| GET | `/autores/:id/livros` | Listar livros de um autor |

### Livros

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/livros` | Listar livros permitidos ao usuário |
| GET | `/livros/:id` | Buscar livro por ID |
| POST | `/livros` | Cadastrar livro |
| PUT | `/livros/:id` | Atualizar livro |
| DELETE | `/livros/:id` | Excluir livro |

### Filtros

É possível filtrar os livros pelo gênero utilizando query string:

```http
GET /livros?genero=Fantasia
```

O filtro respeita as permissões de acesso do usuário autenticado.

## 📝 Exemplos de requisições

### Cadastro de usuário

```http
POST /usuarios/cadastro
Content-Type: application/json

{
    "nome": "Usuário Teste",
    "email": "teste@biblioteca.com",
    "senha": "senha123"
}
```

### Login

```http
POST /usuarios/login
Content-Type: application/json

{
    "email": "teste@biblioteca.com",
    "senha": "senha123"
}
```

Após o login, a resposta contém o token JWT que deverá ser utilizado nas próximas requisições.

### Cadastrar autor autenticado

```http
POST /autores
Authorization: Bearer SEU_TOKEN_JWT
Content-Type: application/json

{
    "nome": "Jorge Amado",
    "nacionalidade": "Brasileira",
    "ano_nascimento": 1912
}
```

### Cadastrar livro autenticado

```http
POST /livros
Authorization: Bearer SEU_TOKEN_JWT
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
Authorization: Bearer SEU_TOKEN_JWT
```

## 🔗 Relacionamento entre entidades

O banco de dados possui um relacionamento de **um para muitos (1:N)** entre autores e livros:

- Um autor pode possuir vários livros.
- Cada livro pertence a um único autor.

A tabela `livros` possui a chave estrangeira `autor_id`, que referencia a chave primária `id` da tabela `autores`.

Também existe um relacionamento entre usuários, autores e livros, permitindo identificar o proprietário de cada registro.

Uma restrição impede a exclusão de um autor que ainda possui livros cadastrados.

## ⚠️ Validações e tratamento de erros

A API realiza validações dos dados recebidos e utiliza códigos de status HTTP adequados.

| Código | Descrição |
|---|---|
| 200 | Requisição realizada com sucesso |
| 201 | Registro criado com sucesso |
| 204 | Registro excluído com sucesso |
| 400 | Dados ou parâmetros inválidos |
| 401 | Falha na autenticação |
| 403 | Acesso não autorizado |
| 404 | Recurso não encontrado |
| 409 | Conflito, como e-mail já cadastrado |
| 429 | Limite de requisições excedido |
| 500 | Erro interno do servidor |

Os erros são tratados por um middleware centralizado, que padroniza as respostas em JSON.

## 🧪 Testes

O projeto possui testes automatizados desenvolvidos com **Jest e Supertest**.

Os testes estão organizados na pasta `tests`:

- `autenticacao.test.js`: verifica login, senha incorreta, acesso sem token e restrição da rota administrativa.
- `propriedade.test.js`: verifica o isolamento dos registros e impede que um usuário acesse, edite ou exclua dados de outro usuário.
- `setupDatabase.js`: prepara o banco de dados utilizado nos testes.
- `setupEnv.js`: configura o ambiente de testes.

Para executar os testes automatizados, utilize:

```bash
npm test
```

Os testes utilizam um banco de dados separado, evitando alterações nos dados utilizados pela aplicação.

### Testes manuais

As requisições HTTP também podem ser testadas utilizando a extensão **REST Client** no Visual Studio Code.

Os arquivos de teste são:

- `usuarios.http`
- `autores.http`
- `livros.http`

Eles permitem verificar:

- Cadastro e login de usuários.
- Autenticação por JWT.
- Operações CRUD de autores e livros.
- Filtros e relacionamentos.
- Validações e cenários de erro.
- Acesso negado sem autenticação.
- Controle de propriedade entre usuários.
- Permissões de administrador e usuário comum.

## 👩‍💻 Desenvolvido por

**Catharina Alves Bonella**

Projeto acadêmico — Desenvolvimento de Aplicações Web II | 2026/2.