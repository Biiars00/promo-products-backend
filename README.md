# Promo Products - Backend 🎯

API REST desenvolvida em Node.js + TypeScript + MySQL para gerenciamento de produtos, aplicação de cupons de desconto e operações relacionadas.

# 🚀 Tecnologias Utilizadas
- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Docker](https://www.docker.com/)
- [Tsoa](https://tsoa-community.github.io/docs/) 
- [Tsyringe](https://github.com/microsoft/tsyringe) 
- [Nodemon](https://nodemon.io/)
- [Swagger](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/)
- [Jest](https://jestjs.io/)

# 📦 Instalação

### 🔧 Pré-requisitos
- Node.js (versão 18+)
- Git
- Docker e Docker Compose
- MySQL
- npm ou yarn

### 🛠️ Clonando o projeto

```js
git clone https://github.com/Biiars00/promo-products-backend.git
cd promo-products-backend
```

### 🔍 Instalando as dependências

```js
npm install
```

### 🔑 Configuração das variáveis de ambiente

Crie um arquivo .env na raiz do projeto baseado no `.env.example` e preencha com suas configurações:

```js
DB_ROOT_PASSWORD=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_PORT=
```

### Banco de Dados

🏗️ Execute o script de criação do banco e das tabelas localizado na raiz do projeto:

```js
init.sql
```

Ou rode manualmente os comandos SQL no seu banco MySQL.

## 🚀 Executando a aplicação

No seu terminal, execute:

```js
npm rn dev
```

## 📑 Documentação dos Endpoints

A documentação da API é gerada automaticamente via Swagger.

🔗 Acesse em:

```js
http://localhost:3000/docs
```

### 🔥 Rotas da API

| Método             | Endpoint                           | Body (parcial)                          |  Descrição                                      |
| -------------------| ---------------------------------- | --------------------------------------- | ----------------------------------------------- |
| **Produtos**                                                                                                                                        |
| POST               | /products                          | { name, description, price, stock }     | Cadastra um novo produto                        |
| GET                | /products                          | —                                       | Lista todos os produtos com filtros e paginação |
| GET                | /products/:id                      | —                                       | Busca um produto pelo ID                        |
| PATCH              | /products/:id                      | { name?, description?, price?, stock? } | Atualiza parcialmente os dados de um produto    |
| DELETE             | /products/:id                      | { checkStock }                          | Inativa (soft delete) um produto                |
| POST               | /products/:id/restore              | { checkStock }                                                                            |
| **Cupons**                                                                                                                                          |
| POST               | /coupons                           | { code, percentage, expirationDate }    | Cadastra um novo cupom de desconto              |
| GET                | /coupons                           | —                                       | Lista todos os cupons                           |
| GET                | /coupons/:code                     | —                                       | Busca um cupom                                  |
| PATCH              | /coupons/:code                     | { code?, percentage?, expirationDate? } | Atualiza informações de um cupom                |
| DELETE             | /coupons/:code                     | —                                       | Inativa um cupom                                |
| **Aplicação de Cupons**                                                                                                                             |
| POST               | /products/:productId/discount      | { couponId }                            | Aplica um cupom em um produto                   |
| DELETE             | /products/:productId/undoDiscount  | —                                       | Inativa um cupom em um produto                  |

### 📋 Filtros e Query Params suportados em /products (GET)

- `page`: número da página (ex: 1)
- `limit`: número de itens por página (ex: 10)
- `search`: busca por nome do produto (ex: tv)
- `minPrice`: preço mínimo (ex: 100)
- `maxPrice`: preço máximo (ex: 2000)
- `hasDiscount`: filtra produtos com desconto aplicado (true ou false)
- `sortBy`: ordenação por campo (name, price, created_at, stock)
- `sortOrder`: direção da ordenação (asc ou desc)
- `includeDeleted`: incluir produtos inativados (true ou false)
- `onlyOutOfStock`: apenas produtos fora de estoque (true)
- `withCouponApplied`: produtos com cupom aplicado (true ou false)

### 📦 Exemplos de Requests

#### 🔹PRODUTOS

➕ Criar Produto

`POST /products`
```js
// Body
{
  "name": "Smart TV 50\"",
  "description": "Smart TV com resolução 4K e Wi-Fi integrado",
  "stock": 10,
  "price": 2999.90
}
```

Resposta: `201`

```js
{
  "message": "Product created successfully!",
  "location": "/api/v1/products/1"
}
```

📄 Listar Produtos

`GET /products?page=1&limit=10&search=tv&sortBy=price&sortOrder=asc`

Resposta: `200`

```js
{
  "data": [
    {
      "id": 1,
      "name": "Smart TV 50\"",
      "description": "Smart TV com resolução 4K e Wi-Fi integrado",
      "stock": 10,
      "price": 2999.90,
      "createdAt": "24/06/2025 23:24",
      "updatedAt": null,
      "isOutOfStock": true,
      "activeCoupon": {
        "finalPrice": 0,
        "discount": {
          "appliedAt": "string",
          "value": 0,
          "type": "string"
        }
      }
    }
  ],
  "meta": {
    "totalPages": 0,
    "totalItems": 0,
    "limit": 0,
    "page": 0
  }
}
```

🔍 Buscar Produto por ID

`GET /products/1`

Resposta: `200`

```js
{
  "data": {
    "id": 0,
    "name": "string",
    "description": "string",
    "stock": 0,
    "price": 0,
    "createdAt": "string",
    "updatedAt": "string",
    "isOutOfStock": true,
    "activeCoupon": {
      "finalPrice": 0,
      "discount": {
        "appliedAt": "string",
        "value": 0,
        "type": "string"
      }
    }
  }
}
```

✏️ Atualizar Produto

`PATCH /products/1`

```js
// Body
{
  "stock": 20,
  "price": 2799.90
}
```
Resposta: `200`

```js
{
  "id": 1,
  "stock": 20,
  "price": 2799.90
}
```

🚫 Inativar Produto

`DELETE /products/1`

```js
// Body
{
  "checkStock": true
}
```

Resposta: `204`

```js
{
  "data": true
}
```

♻️ Reativar Produto

`POST /products/1/restore`

```js
// Body
{
  "checkStock": false
}
```

Resposta: `204` 

```js
false
```

🏷️ CUPONS

➕ Criar Cupom

`POST /coupons`

```js
// Body
{
  "code": "DESCONTO20",
  "percentage": 20,
  "expirationDate": "2025-12-31"
}
```

Resposta: `201`

```js
{
  "message": "Coupon created successfully!",
  "location": "/api/v1/coupons/DESCONTO20"
}
```

📄 Listar Cupons

`GET /coupons`

Resposta: `200`

```js
[
  {
    "id": 1,
    "code": "DESCONTO20",
    "percentage": 20,
    "expirationDate": "2025-12-31",
    "isActive": true
  }
]
```

✅ Buscar Cupom

`GET /coupons/DESCONTO20/`

Resposta:

```js
{
  "valid": true,
  "discount": 20
}
```

✏️ Atualizar Cupom

`PATCH /coupons/1`

```js
{
  "percentage": 25
}
```

Resposta: `200`

```js
{
  "message": "Coupon updated successfully",
  "data": {
    "id": 1,
    "code": "DESCONTO20",
    "percentage": 25,
    "expirationDate": "2025-12-31"
  }
}
```

❌ Remover Cupom

`DELETE /coupons/1`

Resposta: `204`

```js
true

```

## ✅ Testes [...Em construção]

Execute os testes unitários com:

```js
npm run test
```

Execute testes com relatório de cobertura:

```js
npm run test:coverage
```

## 🐳 Docker 

### 📦 Buildando a imagem

```js
docker build -t isi-product-server .
```

### 🚀 Executando com Docker

```js
docker run -p 3000:3000 isi-product-server
```

## 🏗️ Estrutura de Pastas

src/
├── config/           (Configuração do CORS)
├── containers/       (Gerenciamento de dependências da aplicação)
├── controllers/
├── database/         (Conexão com o banco de dados)
├── docs/             (Swagger.json)
├── interfaces/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── server.ts
└── app.ts

## 👩‍💻 Contribuindo

- Faça um fork.
- Crie uma branch: `git checkout -b feature/minha-feature`.
- Commit suas alterações: `git commit -m 'feat: minha feature'`.
- Push na sua branch: `git push origin feature/minha-feature`.
- Abra um Pull Request.

## 🤝 Autor

Desenvolvido por **[Beatriz Ribeiro](https://www.linkedin.com/in/beatriz-ribeiro-dev/)**

🔗 [GitHub](https://github.com/Biiars00)

📧 Em breve: integração de autenticação e testes unitários com Jest.

## 📝 Licença

Este projeto está sob a licença MIT.
