# 🧠 Instivo API

> API desenvolvida com [NestJS](https://nestjs.com) para gerenciamento do backend da plataforma **Instivo**.

📦 Em produção: [https://instivo-api-production.up.railway.app](https://instivo-api-production.up.railway.app)

---

## ✨ Instalação

1. **Clone o projeto:**

```bash
git clone https://github.com/seu-usuario/instivo-api.git
cd instivo-api
```

2. **Instale as dependências com `pnpm`:**

```bash
pnpm install
```

---

## ⚙️ Ambiente

Crie um arquivo `.env.development` com base no arquivo `.env.example` na raiz do projeto:

```bash
cp .env.example .env.development
```

Configure as variáveis de ambiente conforme necessário, incluindo a conexão com o MongoDB.

Você pode utilizar:

* 🧪 **MongoDB local**
* ☁️ **MongoDB Atlas**
* 🐳 **Docker Compose**:

```bash
docker-compose up -d mongodb
```

---

## 🏃‍♂️ Execução

Para rodar a API em ambiente de desenvolvimento:

```bash
pnpm start:dev
```

A API estará disponível em `http://localhost:3333`.

---

## ✅ Testes

### 📦 Unitários e cobertura:

```bash
pnpm test
pnpm test:cov
```

### 🚀 Testes de integração:

Crie um arquivo `.env.test` baseado no `.env.example`:

```bash
cp .env.example .env.test
```

Execute os testes:

```bash
pnpm test:e2e
```

---

## 📚 Documentação da API

A documentação da API (Swagger) estará disponível após subir a aplicação:

```
http://localhost:3333/api
```

Em produção:

```
https://instivo-api-production.up.railway.app/api
```

---

## 🧪 Tecnologias

* [NestJS](https://nestjs.com)
* [TypeScript](https://www.typescriptlang.org/)
* [MongoDB](https://www.mongodb.com/)
* [TypeORM](https://typeorm.io/)
* [Swagger](https://swagger.io/tools/swagger-ui/)
* [Jest](https://jestjs.io/)

---

## 🧑‍💻 Scripts úteis

| Comando             | Descrição                             |
| ------------------- | ------------------------------------- |
| `pnpm install`      | Instala as dependências               |
| `pnpm start:dev`    | Inicia a API em modo desenvolvimento  |
| `pnpm test`         | Executa testes unitários              |
| `pnpm test:cov`     | Executa testes com cobertura          |
| `pnpm test:e2e`     | Executa testes de integração          |
| `docker-compose up` | Sobe os serviços definidos no compose |

---

## 💡 Contribuindo

Pull Requests são bem-vindos! Para mudanças maiores, por favor abra uma issue primeiro para discutir o que você gostaria de mudar.

---

## 🛡️ Licença

Este projeto está sob licença MIT.
