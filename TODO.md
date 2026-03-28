# TODO — Implementar Autenticação JWT

## Primeiro: o que é JWT e por que você precisa disso?

Agora mesmo, qualquer pessoa que souber a URL da sua API pode fazer `POST /api/news` e criar notícias falsas, ou `DELETE /api/news/:id` e apagar tudo. Não existe nenhuma verificação de "quem está fazendo isso?".

JWT (JSON Web Token) resolve esse problema. Funciona assim:

```
1. Você faz login com email + senha
2. A API verifica se estão corretos
3. Se sim, a API gera um TOKEN — uma string longa e criptografada
4. Você guarda esse token no frontend
5. Em toda requisição seguinte, você manda o token no header
6. A API lê o token, verifica se é válido, e só então executa a ação
```

O token é tipo um crachá de acesso. Sem ele, a porta não abre.

Um JWT tem 3 partes separadas por pontos: `xxxxx.yyyyy.zzzzz`

```
HEADER.PAYLOAD.ASSINATURA

Header:    diz o algoritmo usado (ex: HS256)
Payload:   dados do usuário (id, email, role) — NÃO é criptografado, só codificado em base64
Assinatura: hash do header + payload + uma chave secreta que só o servidor conhece
```

Qualquer pessoa pode ler o payload (é só base64). O que ninguém consegue fazer é FORJAR um token válido, porque não tem a chave secreta. Por isso: nunca coloque senha ou dados sensíveis no payload.

---

## O fluxo completo no Observatório Cívico

```
FRONTEND (React)                           API (Express)
─────────────────                          ──────────────
                                           
1. Tela de login                           
   email + senha ──── POST /api/auth/login ───→ 2. Verifica no banco
                                                   Senha correta?
                 ←── { token: "eyJhb..." } ────── 3. Gera JWT e retorna
                                           
4. Guarda token                            
   (localStorage ou cookie)                
                                           
5. Requisição protegida                    
   GET /api/news                           
   Header: Authorization: Bearer eyJhb...  ───→ 6. Middleware verifica token
                                                   Token válido?
                 ←── { data: [...] } ─────────── 7. Se sim, executa
                 ←── 401 Unauthorized ────────── 7. Se não, bloqueia
```

---

## Checklist de implementação

### FASE 1 — Instalar dependências

- [ ] Instalar bcryptjs (para hash de senha):
  ```bash
  npm install bcryptjs
  ```
- [ ] Instalar jsonwebtoken (para gerar e verificar tokens):
  ```bash
  npm install jsonwebtoken
  ```
- [ ] Adicionar variáveis no `.env`:
  ```
  JWT_SECRET=uma_string_longa_aleatoria_que_so_voce_sabe_mude_isso
  JWT_EXPIRES_IN=7d
  ```

**Por que bcryptjs?** Nunca salve senhas em texto puro no banco. O bcrypt transforma "minhaSenha123" em algo tipo "$2a$10$xK8f..." que é irreversível. Quando o usuário faz login, o bcrypt compara o hash, não a senha em si.

**Por que uma secret no .env?** É a chave que assina o token. Se alguém descobrir, consegue forjar tokens. Em produção, use uma string de pelo menos 64 caracteres aleatórios.

---

### FASE 2 — Criar o model de Usuário

- [ ] Criar `src/models/Usuario.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true
    },
    senha: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
        select: false  // <-- IMPORTANTE: nunca retorna a senha nas queries
    },
    role: {
        type: String,
        enum: ['admin', 'editor'],
        default: 'editor'
    }
}, { timestamps: true });

// Hook pre-save: faz o hash da senha ANTES de salvar
// Isso roda automaticamente toda vez que um usuário é criado ou a senha é alterada
usuarioSchema.pre('save', async function(next) {
    // Só faz hash se a senha foi modificada (evita re-hash em updates de outros campos)
    if (!this.isModified('senha')) return next();

    // O número 12 é o "salt rounds" — quanto maior, mais seguro mas mais lento
    this.senha = await bcrypt.hash(this.senha, 12);
    next();
});

// Método de instância: compara senha digitada com o hash do banco
// Usando como: const match = await usuario.compararSenha('minhaSenha123')
usuarioSchema.methods.compararSenha = async function(senhaDigitada) {
    return await bcrypt.compare(senhaDigitada, this.senha);
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;
```

**O que está acontecendo aqui:**
- `select: false` na senha = quando você faz `Usuario.find()`, a senha NÃO vem. Você precisa pedir explicitamente com `.select('+senha')` quando precisar (no login).
- `pre('save')` = middleware do Mongoose que roda antes de salvar. Ele intercepta a senha em texto puro e substitui pelo hash.
- `compararSenha()` = método que fica disponível em cada documento de usuário. Internamente o bcrypt compara o texto com o hash.

---

### FASE 3 — Criar o middleware de autenticação

- [ ] Criar `src/middleware/auth.js`:

```javascript
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Middleware que protege rotas — coloca nas rotas que precisam de login
export const proteger = async (req, res, next) => {
    try {
        // 1. Pegar o token do header
        // O frontend manda: Authorization: Bearer eyJhbGciOi...
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            //                                          ^ pega só a parte depois do "Bearer "
        }

        if (!token) {
            return res.status(401).json({ message: 'Acesso negado. Faça login.' });
        }

        // 2. Verificar se o token é válido (não expirou e não foi adulterado)
        // jwt.verify() lança erro se o token for inválido
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // decoded = { id: '...', iat: 1234567890, exp: 1234567890 }

        // 3. Verificar se o usuário ainda existe no banco
        // (pode ter sido deletado depois que o token foi gerado)
        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            return res.status(401).json({ message: 'Usuário não existe mais.' });
        }

        // 4. Anexar o usuário no request para uso nos controllers
        req.usuario = usuario;
        next(); // <-- passa para o próximo middleware ou controller

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado. Faça login novamente.' });
        }
        return res.status(500).json({ message: 'Erro na autenticação.' });
    }
};

// Middleware de autorização por role — usa DEPOIS do proteger
// Exemplo: restringirPara('admin') → só admin pode acessar
export const restringirPara = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.role)) {
            return res.status(403).json({
                message: 'Você não tem permissão para esta ação.'
            });
        }
        next();
    };
};
```

**O que está acontecendo:**
- `proteger` é o guarda da porta. Ele verifica se o crachá (token) existe, se é válido, e se o dono ainda é funcionário (existe no banco).
- `restringirPara` é o segundo guarda. Depois que o primeiro verifica que você é funcionário, esse verifica se seu cargo permite a ação. Ex: só admin pode deletar notícias.
- `req.usuario` fica disponível para qualquer controller depois. Então o controller sabe QUEM está fazendo a requisição.

---

### FASE 4 — Criar o controller de autenticação

- [ ] Criar `src/controllers/authController.js`:

```javascript
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

// Função auxiliar que gera o token
const gerarToken = (id) => {
    return jwt.sign(
        { id },                          // payload — dados que ficam dentro do token
        process.env.JWT_SECRET,          // chave secreta
        { expiresIn: process.env.JWT_EXPIRES_IN }  // ex: '7d' = expira em 7 dias
    );
};

// POST /api/auth/register
export const registrar = async (req, res) => {
    try {
        const { nome, email, senha, role } = req.body;

        // Verificar se email já existe
        const existe = await Usuario.findOne({ email });
        if (existe) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Criar usuário (a senha é hasheada automaticamente pelo pre-save hook)
        const usuario = await Usuario.create({ nome, email, senha, role });

        // Gerar token
        const token = gerarToken(usuario._id);

        res.status(201).json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar.', error: error.message });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Verificar se email e senha foram enviados
        if (!email || !senha) {
            return res.status(400).json({ message: 'Informe email e senha.' });
        }

        // 2. Buscar usuário pelo email
        // .select('+senha') porque no model a senha tem select: false
        const usuario = await Usuario.findOne({ email }).select('+senha');
        if (!usuario) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
            //                                       ^ mensagem genérica de propósito
            //                                         não diz se foi o email ou a senha
            //                                         para não dar dica para atacantes
        }

        // 3. Comparar senha
        const senhaCorreta = await usuario.compararSenha(senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Email ou senha incorretos.' });
        }

        // 4. Gerar token e retornar
        const token = gerarToken(usuario._id);

        res.status(200).json({
            token,
            usuario: {
                id: usuario._id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no login.', error: error.message });
    }
};

// GET /api/auth/me — retorna dados do usuário logado
export const getMe = async (req, res) => {
    // req.usuario já foi preenchido pelo middleware proteger
    res.status(200).json({
        usuario: {
            id: req.usuario._id,
            nome: req.usuario.nome,
            email: req.usuario.email,
            role: req.usuario.role
        }
    });
};
```

**Detalhe importante sobre o login:** a mensagem de erro é propositalmente vaga ("Email ou senha incorretos" em vez de "Email não encontrado" ou "Senha errada"). Isso é uma prática de segurança — se a mensagem dissesse "email não encontrado", um atacante saberia que aquele email não está cadastrado e tentaria outro. Com a mensagem genérica, ele não sabe qual dos dois está errado.

---

### FASE 5 — Criar as rotas de autenticação

- [ ] Criar `src/routes/authRoutes.js`:

```javascript
import express from 'express';
import { registrar, login, getMe } from '../controllers/authController.js';
import { proteger } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registrar);  // POST /api/auth/register
router.post('/login', login);          // POST /api/auth/login
router.get('/me', proteger, getMe);    // GET  /api/auth/me (precisa de token)

export default router;
```

---

### FASE 6 — Proteger as rotas existentes

- [ ] Atualizar `src/routes/newsRoutes.js`:

```javascript
import express from 'express';
import { proteger, restringirPara } from '../middleware/auth.js';
import {
    getAllNews, getById, getByTitle, getByDate,
    getByCategory, getFeatured, createNews,
    updateNews, deleteNews
} from '../controllers/newsController.js';

const router = express.Router();

// PÚBLICAS — qualquer pessoa pode ler (o frontend precisa disso)
router.get('/', getAllNews);
router.get('/featured', getFeatured);
router.get('/:id', getById);
router.get('/title/:title', getByTitle);
router.get('/date/:startDate/:endDate', getByDate);
router.get('/category/:category', getByCategory);

// PROTEGIDAS — precisa de login
router.post('/', proteger, createNews);
router.put('/:id', proteger, updateNews);

// RESTRITAS — precisa ser admin
router.delete('/:id', proteger, restringirPara('admin'), deleteNews);

export default router;
```

**A lógica é:**
- GET (leitura) = público. O frontend React precisa ler sem login.
- POST e PUT (criar/editar) = precisa de token. Só editores e admins logados.
- DELETE = precisa ser admin. Evita que um editor apague notícias por acidente/maldade.

- [ ] Aplicar a mesma lógica no `glossarioRoutes.js`:
    - GET = público
    - POST, PUT, DELETE = proteger

---

### FASE 7 — Registrar no server.js

- [ ] Atualizar `server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/mongoose.js';
import newsRoutes from './src/routes/newsRoutes.js';
import glossarioRoutes from './src/routes/glossarioRoutes.js';
import authRoutes from './src/routes/authRoutes.js';          // NOVO
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);           // NOVO
app.use('/api/news', newsRoutes);
app.use('/api/glossario', glossarioRoutes);

// Error handler (sempre por último)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
```

---

### FASE 8 — Criar o primeiro admin

- [ ] Criar `src/seed/createAdmin.js`:

```javascript
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';

dotenv.config();

const criarAdmin = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado ao MongoDB');

    // Verificar se já existe admin
    const existe = await Usuario.findOne({ role: 'admin' });
    if (existe) {
        console.log('Admin já existe:', existe.email);
        await mongoose.disconnect();
        return;
    }

    // Criar admin padrão — TROCAR EMAIL E SENHA depois
    const admin = await Usuario.create({
        nome: 'Admin Observatório',
        email: 'admin@observatoriocivico.com',
        senha: 'trocarDepois123',
        role: 'admin'
    });

    console.log('Admin criado:', admin.email);
    await mongoose.disconnect();
};

criarAdmin().catch(console.error);
```

Executar com:
```bash
node src/seed/createAdmin.js
```

---

### FASE 9 — Testar tudo

- [ ] Testar com curl ou Postman na seguinte ordem:

```bash
# 1. Criar admin (rodar o seed)
node src/seed/createAdmin.js

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@observatoriocivico.com","senha":"trocarDepois123"}'

# Resposta: { "token": "eyJhbGci...", "usuario": {...} }
# Copiar o token

# 3. Testar rota protegida SEM token (deve dar 401)
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{"titulo":"teste","resumo":"teste","categorias":["economia"]}'

# Resposta: { "message": "Acesso negado. Faça login." }

# 4. Testar rota protegida COM token (deve funcionar)
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"titulo":"teste","resumo":"teste","categorias":["economia"]}'

# Resposta: 201 com a notícia criada

# 5. Testar rota pública (deve funcionar sem token)
curl http://localhost:3000/api/news

# Resposta: { "data": [...], "page": 1, ... }
```

---

### FASE 10 — Implementar no frontend React

- [ ] Criar um serviço de API com o token:

```typescript
// src/services/api.ts
const API_URL = 'http://localhost:3000/api';

// Pega o token salvo
const getToken = () => localStorage.getItem('token');

// Função base para requisições autenticadas
export const fetchAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, { ...options, headers });

    if (response.status === 401) {
        // Token expirou ou inválido — redirecionar para login
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    return response;
};

// Exemplos de uso:
// GET público (sem token)
export const getNews = () => fetch(`${API_URL}/news`).then(r => r.json());

// POST protegido (com token)
export const createNews = (data: any) =>
    fetchAuth('/news', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json());

// Login
export const login = async (email: string, senha: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};
```

---

## Arquivos novos/modificados (resumo)

```
CRIAR:
  src/models/Usuario.js
  src/controllers/authController.js
  src/routes/authRoutes.js
  src/middleware/auth.js
  src/seed/createAdmin.js

MODIFICAR:
  server.js              → adicionar authRoutes
  src/routes/newsRoutes.js     → adicionar proteger/restringirPara
  src/routes/glossarioRoutes.js → adicionar proteger/restringirPara
  .env                   → adicionar JWT_SECRET e JWT_EXPIRES_IN
  .env.example           → adicionar JWT_SECRET e JWT_EXPIRES_IN
  package.json           → bcryptjs e jsonwebtoken já instalados

ESTRUTURA FINAL:
  src/
  ├── config/
  │   └── mongoose.js
  ├── controllers/
  │   ├── authController.js      ← NOVO
  │   ├── newsController.js
  │   └── glossarioController.js
  ├── middleware/
  │   ├── auth.js                ← NOVO
  │   └── errorHandler.js
  ├── models/
  │   ├── Usuario.js             ← NOVO
  │   ├── Noticia.js
  │   └── Glossario.js
  ├── routes/
  │   ├── authRoutes.js          ← NOVO
  │   ├── newsRoutes.js
  │   └── glossarioRoutes.js
  └── seed/
      ├── seed.js
      └── createAdmin.js         ← NOVO
```

---

## Sobre segurança em produção

Isso funciona bem para desenvolvimento e MVP. Para produção, considere eventualmente:

- **Refresh tokens** — em vez de um token de 7 dias, usar token curto (15min) + refresh token (30 dias). Mais seguro mas mais complexo.
- **Rate limiting** — limitar tentativas de login (ex: 5 por minuto) para evitar brute force. Lib: `express-rate-limit`.
- **HTTPS** — obrigatório em produção. O token viaja no header e pode ser interceptado em HTTP puro.
- **httpOnly cookies** — em vez de localStorage, guardar o token em cookie httpOnly (JavaScript não consegue ler, protege contra XSS). Mais seguro mas exige configuração de CORS com credentials.

Mas nenhum desses é bloqueante para começar. Implemente o JWT básico primeiro, coloque para funcionar, e refine depois.