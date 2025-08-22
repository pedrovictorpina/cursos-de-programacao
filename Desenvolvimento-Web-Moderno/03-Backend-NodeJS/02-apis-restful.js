/**
 * 🚀 MÓDULO 3: BACKEND COM NODE.JS
 * 📘 Arquivo: 02-apis-restful.js
 * 
 * 🎯 OBJETIVOS DESTE ARQUIVO:
 * • Compreender os princípios REST e arquitetura de APIs
 * • Criar APIs RESTful robustas e escaláveis
 * • Implementar roteamento avançado e middlewares
 * • Aplicar validação de dados e tratamento de erros
 * • Estruturar projetos de API profissionalmente
 * • Implementar CRUD completo com boas práticas
 * 
 * 👨‍🏫 CONCEITOS FUNDAMENTAIS:
 * Este arquivo ensina como construir APIs REST profissionais,
 * desde conceitos básicos até implementações avançadas.
 */

// =============================================================================
// 1. PRINCÍPIOS REST E ARQUITETURA DE APIS
// =============================================================================

/**
 * 🏗️ FUNDAMENTOS REST (Representational State Transfer)
 * 
 * REST é um estilo arquitetural para sistemas distribuídos
 */
const restPrinciples = {
    /**
     * 📋 PRINCÍPIOS FUNDAMENTAIS
     */
    principios: {
        stateless: {
            descricao: 'Cada requisição deve conter toda informação necessária',
            exemplo: `
                // ❌ Stateful (evitar)
                // Servidor mantém estado da sessão
                app.get('/profile', (req, res) => {
                    if (req.session.user) {
                        res.json(req.session.user);
                    } else {
                        res.status(401).json({ error: 'Not authenticated' });
                    }
                });
                
                // ✅ Stateless (preferir)
                // Cliente envia token em cada requisição
                app.get('/profile', authenticateToken, (req, res) => {
                    res.json(req.user);
                });
                
                function authenticateToken(req, res, next) {
                    const token = req.headers['authorization'];
                    if (!token) return res.status(401).json({ error: 'Token required' });
                    
                    // Verificar token
                    jwt.verify(token, SECRET_KEY, (err, user) => {
                        if (err) return res.status(403).json({ error: 'Invalid token' });
                        req.user = user;
                        next();
                    });
                }
            `
        },
        
        uniformInterface: {
            descricao: 'Interface consistente usando métodos HTTP padrão',
            metodos: {
                GET: 'Buscar recursos (idempotente)',
                POST: 'Criar novos recursos',
                PUT: 'Atualizar recurso completo (idempotente)',
                PATCH: 'Atualização parcial',
                DELETE: 'Remover recursos (idempotente)'
            },
            exemplo: `
                // Recursos de usuários
                GET    /api/users          // Listar todos os usuários
                GET    /api/users/123      // Buscar usuário específico
                POST   /api/users          // Criar novo usuário
                PUT    /api/users/123      // Atualizar usuário completo
                PATCH  /api/users/123      // Atualizar campos específicos
                DELETE /api/users/123      // Remover usuário
                
                // Recursos aninhados
                GET    /api/users/123/posts     // Posts do usuário 123
                POST   /api/users/123/posts     // Criar post para usuário 123
                GET    /api/posts/456/comments  // Comentários do post 456
            `
        },
        
        resourceBased: {
            descricao: 'URLs representam recursos, não ações',
            exemplos: {
                correto: [
                    'GET /api/users',
                    'POST /api/products',
                    'PUT /api/orders/123',
                    'DELETE /api/categories/456'
                ],
                incorreto: [
                    'GET /api/getUsers',
                    'POST /api/createProduct',
                    'GET /api/deleteOrder/123',
                    'POST /api/updateCategory'
                ]
            }
        },
        
        hateoas: {
            descricao: 'Hypermedia as the Engine of Application State',
            exemplo: `
                // Resposta com links relacionados
                {
                    "id": 123,
                    "name": "João Silva",
                    "email": "joao@email.com",
                    "_links": {
                        "self": { "href": "/api/users/123" },
                        "posts": { "href": "/api/users/123/posts" },
                        "edit": { "href": "/api/users/123", "method": "PUT" },
                        "delete": { "href": "/api/users/123", "method": "DELETE" }
                    }
                }
            `
        }
    },
    
    /**
     * 📊 CÓDIGOS DE STATUS HTTP
     */
    statusCodes: {
        success: {
            200: 'OK - Requisição bem-sucedida',
            201: 'Created - Recurso criado com sucesso',
            202: 'Accepted - Requisição aceita para processamento',
            204: 'No Content - Sucesso sem conteúdo de resposta'
        },
        
        clientError: {
            400: 'Bad Request - Dados inválidos',
            401: 'Unauthorized - Autenticação necessária',
            403: 'Forbidden - Acesso negado',
            404: 'Not Found - Recurso não encontrado',
            409: 'Conflict - Conflito de estado',
            422: 'Unprocessable Entity - Dados válidos mas não processáveis'
        },
        
        serverError: {
            500: 'Internal Server Error - Erro interno',
            502: 'Bad Gateway - Gateway inválido',
            503: 'Service Unavailable - Serviço indisponível',
            504: 'Gateway Timeout - Timeout do gateway'
        },
        
        exemplo: `
            // Uso correto de status codes
            app.post('/api/users', async (req, res) => {
                try {
                    const user = await User.create(req.body);
                    res.status(201).json(user); // 201 para criação
                } catch (error) {
                    if (error.name === 'ValidationError') {
                        res.status(400).json({ error: error.message }); // 400 para dados inválidos
                    } else {
                        res.status(500).json({ error: 'Internal server error' }); // 500 para erros internos
                    }
                }
            });
            
            app.get('/api/users/:id', async (req, res) => {
                const user = await User.findById(req.params.id);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' }); // 404 para não encontrado
                }
                res.status(200).json(user); // 200 para sucesso
            });
        `
    }
};

// =============================================================================
// 2. ESTRUTURA DE PROJETO API
// =============================================================================

/**
 * 📁 ESTRUTURA PROFISSIONAL DE PROJETO API
 * 
 * Organização de pastas e arquivos para APIs escaláveis
 */
const projectStructure = {
    /**
     * 🗂️ ESTRUTURA DE PASTAS
     */
    estrutura: `
        projeto-api/
        ├── src/
        │   ├── controllers/     # Lógica de controle das rotas
        │   │   ├── userController.js
        │   │   ├── productController.js
        │   │   └── authController.js
        │   ├── models/          # Modelos de dados
        │   │   ├── User.js
        │   │   ├── Product.js
        │   │   └── index.js
        │   ├── routes/          # Definição de rotas
        │   │   ├── users.js
        │   │   ├── products.js
        │   │   ├── auth.js
        │   │   └── index.js
        │   ├── middleware/      # Middlewares customizados
        │   │   ├── auth.js
        │   │   ├── validation.js
        │   │   ├── errorHandler.js
        │   │   └── logger.js
        │   ├── services/        # Lógica de negócio
        │   │   ├── userService.js
        │   │   ├── emailService.js
        │   │   └── paymentService.js
        │   ├── utils/           # Utilitários
        │   │   ├── database.js
        │   │   ├── helpers.js
        │   │   └── constants.js
        │   ├── config/          # Configurações
        │   │   ├── database.js
        │   │   ├── server.js
        │   │   └── environment.js
        │   └── app.js           # Configuração principal do Express
        ├── tests/               # Testes automatizados
        │   ├── unit/
        │   ├── integration/
        │   └── fixtures/
        ├── docs/                # Documentação
        │   ├── api.md
        │   └── swagger.yaml
        ├── .env                 # Variáveis de ambiente
        ├── .env.example         # Exemplo de variáveis
        ├── .gitignore
        ├── package.json
        ├── README.md
        └── server.js            # Ponto de entrada
    `,
    
    /**
     * 📦 PACKAGE.JSON EXEMPLO
     */
    packageJson: {
        name: 'api-restful-demo',
        version: '1.0.0',
        description: 'API RESTful profissional com Node.js',
        main: 'server.js',
        scripts: {
            start: 'node server.js',
            dev: 'nodemon server.js',
            test: 'jest',
            'test:watch': 'jest --watch',
            'test:coverage': 'jest --coverage'
        },
        dependencies: {
            express: '^4.18.0',
            cors: '^2.8.5',
            helmet: '^6.0.0',
            'express-rate-limit': '^6.6.0',
            'express-validator': '^6.14.0',
            bcryptjs: '^2.4.3',
            jsonwebtoken: '^8.5.1',
            mongoose: '^6.7.0',
            dotenv: '^16.0.3'
        },
        devDependencies: {
            nodemon: '^2.0.20',
            jest: '^29.3.0',
            supertest: '^6.3.0'
        }
    }
};

// =============================================================================
// 3. IMPLEMENTAÇÃO DE API COM EXPRESS
// =============================================================================

/**
 * 🚀 SIMULAÇÃO DO EXPRESS FRAMEWORK
 * 
 * Implementação simplificada para demonstração dos conceitos
 */
class ExpressSimulator {
    constructor() {
        this.routes = {
            GET: new Map(),
            POST: new Map(),
            PUT: new Map(),
            PATCH: new Map(),
            DELETE: new Map()
        };
        this.middlewares = [];
        this.errorHandlers = [];
    }
    
    /**
     * 🔧 MIDDLEWARE GLOBAL
     */
    use(middleware) {
        if (typeof middleware === 'function') {
            this.middlewares.push(middleware);
        }
        console.log('🔧 Middleware registrado');
    }
    
    /**
     * 📍 MÉTODOS HTTP
     */
    get(path, ...handlers) {
        this.routes.GET.set(path, handlers);
        console.log(`📍 Rota GET ${path} registrada`);
    }
    
    post(path, ...handlers) {
        this.routes.POST.set(path, handlers);
        console.log(`📍 Rota POST ${path} registrada`);
    }
    
    put(path, ...handlers) {
        this.routes.PUT.set(path, handlers);
        console.log(`📍 Rota PUT ${path} registrada`);
    }
    
    patch(path, ...handlers) {
        this.routes.PATCH.set(path, handlers);
        console.log(`📍 Rota PATCH ${path} registrada`);
    }
    
    delete(path, ...handlers) {
        this.routes.DELETE.set(path, handlers);
        console.log(`📍 Rota DELETE ${path} registrada`);
    }
    
    /**
     * 🚀 INICIAR SERVIDOR
     */
    listen(port, callback) {
        console.log(`🚀 Servidor Express simulado iniciado na porta ${port}`);
        if (callback) callback();
        
        // Simular algumas requisições
        setTimeout(() => this.simulateRequests(), 1000);
    }
    
    /**
     * 🎭 SIMULAR REQUISIÇÕES
     */
    simulateRequests() {
        console.log('\n🎭 Simulando requisições...');
        
        // Simular GET /api/users
        this.handleRequest('GET', '/api/users');
        
        // Simular POST /api/users
        setTimeout(() => {
            this.handleRequest('POST', '/api/users', {
                name: 'João Silva',
                email: 'joao@email.com'
            });
        }, 500);
        
        // Simular GET /api/users/123
        setTimeout(() => {
            this.handleRequest('GET', '/api/users/123');
        }, 1000);
    }
    
    /**
     * 📥 PROCESSAR REQUISIÇÃO
     */
    handleRequest(method, path, body = null) {
        console.log(`\n📥 ${method} ${path}`);
        
        const handlers = this.routes[method].get(path);
        if (!handlers) {
            console.log('❌ 404 - Rota não encontrada');
            return;
        }
        
        // Mock request e response
        const req = {
            method,
            path,
            body,
            params: this.extractParams(path),
            query: {},
            headers: { 'content-type': 'application/json' }
        };
        
        const res = {
            statusCode: 200,
            headers: {},
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                console.log(`📤 ${this.statusCode} - ${JSON.stringify(data, null, 2)}`);
                return this;
            },
            send: function(data) {
                console.log(`📤 ${this.statusCode} - ${data}`);
                return this;
            }
        };
        
        // Executar middlewares e handlers
        this.executeHandlers([...this.middlewares, ...handlers], req, res);
    }
    
    /**
     * ⚙️ EXECUTAR HANDLERS
     */
    executeHandlers(handlers, req, res, index = 0) {
        if (index >= handlers.length) return;
        
        const handler = handlers[index];
        const next = () => this.executeHandlers(handlers, req, res, index + 1);
        
        try {
            handler(req, res, next);
        } catch (error) {
            console.error('❌ Erro no handler:', error.message);
        }
    }
    
    /**
     * 🔍 EXTRAIR PARÂMETROS
     */
    extractParams(path) {
        // Simulação simples de extração de parâmetros
        const parts = path.split('/');
        const params = {};
        
        if (parts.length > 3 && !isNaN(parts[3])) {
            params.id = parts[3];
        }
        
        return params;
    }
}

// =============================================================================
// 4. MIDDLEWARES ESSENCIAIS
// =============================================================================

/**
 * 🔧 MIDDLEWARES FUNDAMENTAIS PARA APIS
 * 
 * Funções que processam requisições antes dos handlers principais
 */
const apiMiddlewares = {
    /**
     * 📝 LOGGING MIDDLEWARE
     */
    logger: function(req, res, next) {
        const timestamp = new Date().toISOString();
        console.log(`📝 [${timestamp}] ${req.method} ${req.path}`);
        next();
    },
    
    /**
     * 🛡️ CORS MIDDLEWARE
     */
    cors: function(req, res, next) {
        res.headers['Access-Control-Allow-Origin'] = '*';
        res.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
        res.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        
        if (req.method === 'OPTIONS') {
            return res.status(200).send();
        }
        
        console.log('🛡️ CORS headers adicionados');
        next();
    },
    
    /**
     * 🔒 AUTENTICAÇÃO MIDDLEWARE
     */
    authenticate: function(req, res, next) {
        const token = req.headers.authorization;
        
        if (!token) {
            return res.status(401).json({ error: 'Token de acesso necessário' });
        }
        
        // Simulação de verificação de token
        if (token === 'Bearer valid-token') {
            req.user = { id: 123, name: 'João Silva', role: 'user' };
            console.log('🔒 Usuário autenticado:', req.user.name);
            next();
        } else {
            res.status(401).json({ error: 'Token inválido' });
        }
    },
    
    /**
     * 👮 AUTORIZAÇÃO MIDDLEWARE
     */
    authorize: function(roles = []) {
        return function(req, res, next) {
            if (!req.user) {
                return res.status(401).json({ error: 'Usuário não autenticado' });
            }
            
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Acesso negado' });
            }
            
            console.log('👮 Usuário autorizado');
            next();
        };
    },
    
    /**
     * ✅ VALIDAÇÃO MIDDLEWARE
     */
    validate: function(schema) {
        return function(req, res, next) {
            const { error, value } = schema.validate(req.body);
            
            if (error) {
                return res.status(400).json({
                    error: 'Dados inválidos',
                    details: error.details.map(d => d.message)
                });
            }
            
            req.body = value;
            console.log('✅ Dados validados com sucesso');
            next();
        };
    },
    
    /**
     * ⚡ RATE LIMITING MIDDLEWARE
     */
    rateLimit: function(options = { max: 100, windowMs: 15 * 60 * 1000 }) {
        const requests = new Map();
        
        return function(req, res, next) {
            const ip = req.ip || '127.0.0.1';
            const now = Date.now();
            const windowStart = now - options.windowMs;
            
            // Limpar requisições antigas
            if (requests.has(ip)) {
                const userRequests = requests.get(ip).filter(time => time > windowStart);
                requests.set(ip, userRequests);
            } else {
                requests.set(ip, []);
            }
            
            const userRequests = requests.get(ip);
            
            if (userRequests.length >= options.max) {
                return res.status(429).json({
                    error: 'Muitas requisições',
                    retryAfter: Math.ceil(options.windowMs / 1000)
                });
            }
            
            userRequests.push(now);
            console.log(`⚡ Rate limit: ${userRequests.length}/${options.max}`);
            next();
        };
    },
    
    /**
     * 🚨 ERROR HANDLER MIDDLEWARE
     */
    errorHandler: function(err, req, res, next) {
        console.error('🚨 Erro capturado:', err.message);
        
        // Diferentes tipos de erro
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Dados inválidos',
                details: err.message
            });
        }
        
        if (err.name === 'UnauthorizedError') {
            return res.status(401).json({
                error: 'Não autorizado'
            });
        }
        
        if (err.name === 'NotFoundError') {
            return res.status(404).json({
                error: 'Recurso não encontrado'
            });
        }
        
        // Erro genérico
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// =============================================================================
// 5. CONTROLLERS E LÓGICA DE NEGÓCIO
// =============================================================================

/**
 * 🎮 CONTROLLERS PARA GERENCIAR RECURSOS
 * 
 * Separação da lógica de controle das rotas
 */
const apiControllers = {
    /**
     * 👥 USER CONTROLLER
     */
    userController: {
        // Simulação de banco de dados
        users: [
            { id: 1, name: 'João Silva', email: 'joao@email.com', role: 'admin' },
            { id: 2, name: 'Maria Santos', email: 'maria@email.com', role: 'user' },
            { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', role: 'user' }
        ],
        
        /**
         * 📋 LISTAR USUÁRIOS
         */
        getUsers: function(req, res) {
            try {
                const { page = 1, limit = 10, search } = req.query;
                let users = [...this.users];
                
                // Filtro de busca
                if (search) {
                    users = users.filter(user => 
                        user.name.toLowerCase().includes(search.toLowerCase()) ||
                        user.email.toLowerCase().includes(search.toLowerCase())
                    );
                }
                
                // Paginação
                const startIndex = (page - 1) * limit;
                const endIndex = startIndex + parseInt(limit);
                const paginatedUsers = users.slice(startIndex, endIndex);
                
                res.status(200).json({
                    users: paginatedUsers,
                    pagination: {
                        page: parseInt(page),
                        limit: parseInt(limit),
                        total: users.length,
                        pages: Math.ceil(users.length / limit)
                    }
                });
            } catch (error) {
                res.status(500).json({ error: 'Erro ao buscar usuários' });
            }
        },
        
        /**
         * 🔍 BUSCAR USUÁRIO POR ID
         */
        getUserById: function(req, res) {
            try {
                const { id } = req.params;
                const user = this.users.find(u => u.id === parseInt(id));
                
                if (!user) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao buscar usuário' });
            }
        },
        
        /**
         * ➕ CRIAR USUÁRIO
         */
        createUser: function(req, res) {
            try {
                const { name, email, role = 'user' } = req.body;
                
                // Verificar se email já existe
                const existingUser = this.users.find(u => u.email === email);
                if (existingUser) {
                    return res.status(409).json({ error: 'Email já cadastrado' });
                }
                
                // Criar novo usuário
                const newUser = {
                    id: this.users.length + 1,
                    name,
                    email,
                    role,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(newUser);
                
                res.status(201).json(newUser);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao criar usuário' });
            }
        },
        
        /**
         * ✏️ ATUALIZAR USUÁRIO
         */
        updateUser: function(req, res) {
            try {
                const { id } = req.params;
                const updates = req.body;
                
                const userIndex = this.users.findIndex(u => u.id === parseInt(id));
                if (userIndex === -1) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                
                // Verificar email único (se sendo atualizado)
                if (updates.email) {
                    const emailExists = this.users.find(u => 
                        u.email === updates.email && u.id !== parseInt(id)
                    );
                    if (emailExists) {
                        return res.status(409).json({ error: 'Email já cadastrado' });
                    }
                }
                
                // Atualizar usuário
                this.users[userIndex] = {
                    ...this.users[userIndex],
                    ...updates,
                    updatedAt: new Date().toISOString()
                };
                
                res.status(200).json(this.users[userIndex]);
            } catch (error) {
                res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }
        },
        
        /**
         * 🗑️ DELETAR USUÁRIO
         */
        deleteUser: function(req, res) {
            try {
                const { id } = req.params;
                
                const userIndex = this.users.findIndex(u => u.id === parseInt(id));
                if (userIndex === -1) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                
                // Remover usuário
                this.users.splice(userIndex, 1);
                
                res.status(204).send();
            } catch (error) {
                res.status(500).json({ error: 'Erro ao deletar usuário' });
            }
        }
    },
    
    /**
     * 📦 PRODUCT CONTROLLER
     */
    productController: {
        products: [
            { id: 1, name: 'Notebook', price: 2500.00, category: 'electronics' },
            { id: 2, name: 'Mouse', price: 50.00, category: 'electronics' },
            { id: 3, name: 'Livro JavaScript', price: 80.00, category: 'books' }
        ],
        
        getProducts: function(req, res) {
            const { category, minPrice, maxPrice } = req.query;
            let products = [...this.products];
            
            // Filtros
            if (category) {
                products = products.filter(p => p.category === category);
            }
            
            if (minPrice) {
                products = products.filter(p => p.price >= parseFloat(minPrice));
            }
            
            if (maxPrice) {
                products = products.filter(p => p.price <= parseFloat(maxPrice));
            }
            
            res.status(200).json({ products });
        },
        
        getProductById: function(req, res) {
            const { id } = req.params;
            const product = this.products.find(p => p.id === parseInt(id));
            
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            
            res.status(200).json(product);
        },
        
        createProduct: function(req, res) {
            const { name, price, category } = req.body;
            
            const newProduct = {
                id: this.products.length + 1,
                name,
                price: parseFloat(price),
                category,
                createdAt: new Date().toISOString()
            };
            
            this.products.push(newProduct);
            res.status(201).json(newProduct);
        }
    }
};

// =============================================================================
// 6. VALIDAÇÃO DE DADOS
// =============================================================================

/**
 * ✅ SISTEMA DE VALIDAÇÃO
 * 
 * Validação robusta de dados de entrada
 */
const validationSchemas = {
    /**
     * 👤 VALIDAÇÃO DE USUÁRIO
     */
    userSchema: {
        validate: function(data) {
            const errors = [];
            
            // Nome obrigatório
            if (!data.name || typeof data.name !== 'string') {
                errors.push('Nome é obrigatório e deve ser string');
            } else if (data.name.length < 2) {
                errors.push('Nome deve ter pelo menos 2 caracteres');
            }
            
            // Email obrigatório e válido
            if (!data.email || typeof data.email !== 'string') {
                errors.push('Email é obrigatório');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                errors.push('Email deve ter formato válido');
            }
            
            // Role opcional mas deve ser válido
            if (data.role && !['user', 'admin', 'moderator'].includes(data.role)) {
                errors.push('Role deve ser: user, admin ou moderator');
            }
            
            return {
                error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null,
                value: data
            };
        }
    },
    
    /**
     * 📦 VALIDAÇÃO DE PRODUTO
     */
    productSchema: {
        validate: function(data) {
            const errors = [];
            
            // Nome obrigatório
            if (!data.name || typeof data.name !== 'string') {
                errors.push('Nome do produto é obrigatório');
            }
            
            // Preço obrigatório e positivo
            if (!data.price || isNaN(data.price)) {
                errors.push('Preço é obrigatório e deve ser numérico');
            } else if (parseFloat(data.price) <= 0) {
                errors.push('Preço deve ser maior que zero');
            }
            
            // Categoria obrigatória
            if (!data.category || typeof data.category !== 'string') {
                errors.push('Categoria é obrigatória');
            }
            
            return {
                error: errors.length > 0 ? { details: errors.map(msg => ({ message: msg })) } : null,
                value: data
            };
        }
    }
};

// =============================================================================
// 7. APLICAÇÃO COMPLETA
// =============================================================================

/**
 * 🚀 API RESTFUL COMPLETA
 * 
 * Implementação de uma API completa com todos os conceitos
 */
class RESTfulAPI {
    constructor() {
        this.app = new ExpressSimulator();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    
    /**
     * 🔧 CONFIGURAR MIDDLEWARES
     */
    setupMiddlewares() {
        console.log('🔧 Configurando middlewares...');
        
        // Middlewares globais
        this.app.use(apiMiddlewares.logger);
        this.app.use(apiMiddlewares.cors);
        this.app.use(apiMiddlewares.rateLimit({ max: 100, windowMs: 15 * 60 * 1000 }));
    }
    
    /**
     * 📍 CONFIGURAR ROTAS
     */
    setupRoutes() {
        console.log('📍 Configurando rotas...');
        
        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.status(200).json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            });
        });
        
        // Rotas de usuários
        this.app.get('/api/users', 
            apiControllers.userController.getUsers.bind(apiControllers.userController)
        );
        
        this.app.get('/api/users/:id', 
            apiControllers.userController.getUserById.bind(apiControllers.userController)
        );
        
        this.app.post('/api/users',
            apiMiddlewares.validate(validationSchemas.userSchema),
            apiControllers.userController.createUser.bind(apiControllers.userController)
        );
        
        this.app.put('/api/users/:id',
            apiMiddlewares.authenticate,
            apiMiddlewares.validate(validationSchemas.userSchema),
            apiControllers.userController.updateUser.bind(apiControllers.userController)
        );
        
        this.app.delete('/api/users/:id',
            apiMiddlewares.authenticate,
            apiMiddlewares.authorize(['admin']),
            apiControllers.userController.deleteUser.bind(apiControllers.userController)
        );
        
        // Rotas de produtos
        this.app.get('/api/products',
            apiControllers.productController.getProducts.bind(apiControllers.productController)
        );
        
        this.app.get('/api/products/:id',
            apiControllers.productController.getProductById.bind(apiControllers.productController)
        );
        
        this.app.post('/api/products',
            apiMiddlewares.authenticate,
            apiMiddlewares.authorize(['admin']),
            apiMiddlewares.validate(validationSchemas.productSchema),
            apiControllers.productController.createProduct.bind(apiControllers.productController)
        );
    }
    
    /**
     * 🚨 CONFIGURAR TRATAMENTO DE ERROS
     */
    setupErrorHandling() {
        console.log('🚨 Configurando tratamento de erros...');
        
        // 404 para rotas não encontradas
        this.app.use((req, res) => {
            res.status(404).json({
                error: 'Endpoint não encontrado',
                path: req.path,
                method: req.method
            });
        });
        
        // Error handler global
        this.app.use(apiMiddlewares.errorHandler);
    }
    
    /**
     * 🚀 INICIAR SERVIDOR
     */
    start(port = 3000) {
        console.log('🚀 Iniciando API RESTful...');
        
        this.app.listen(port, () => {
            console.log(`✅ API RESTful rodando na porta ${port}`);
            console.log('📋 Endpoints disponíveis:');
            console.log('  GET    /health');
            console.log('  GET    /api/users');
            console.log('  GET    /api/users/:id');
            console.log('  POST   /api/users');
            console.log('  PUT    /api/users/:id');
            console.log('  DELETE /api/users/:id');
            console.log('  GET    /api/products');
            console.log('  GET    /api/products/:id');
            console.log('  POST   /api/products');
        });
    }
}

// =============================================================================
// 8. INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 FUNÇÃO DE INICIALIZAÇÃO
 * 
 * Inicializa a demonstração de APIs RESTful
 */
function initRESTfulAPI() {
    console.log('🌟 Inicializando módulo: APIs RESTful com Node.js');
    console.log('📘 Conceitos abordados:');
    console.log('  • Princípios REST e arquitetura');
    console.log('  • Estrutura profissional de projetos');
    console.log('  • Middlewares e roteamento');
    console.log('  • Controllers e lógica de negócio');
    console.log('  • Validação de dados');
    console.log('  • Tratamento de erros');
    console.log('  • Autenticação e autorização');
    
    // Criar e inicializar API
    const api = new RESTfulAPI();
    api.start(3000);
    
    return {
        api,
        principles: restPrinciples,
        structure: projectStructure,
        middlewares: apiMiddlewares,
        controllers: apiControllers,
        validation: validationSchemas
    };
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initRESTfulAPI,
        restPrinciples,
        projectStructure,
        apiMiddlewares,
        apiControllers,
        validationSchemas,
        RESTfulAPI,
        ExpressSimulator
    };
}

// Auto-inicializar se executado diretamente
if (typeof require !== 'undefined' && require.main === module) {
    initRESTfulAPI();
}

/**
 * 🎓 RESUMO DAS APIS RESTFUL
 * 
 * Neste arquivo, você aprendeu:
 * 
 * 1. 🏗️ **Princípios REST**: Stateless, interface uniforme, recursos
 * 2. 📁 **Estrutura de Projeto**: Organização profissional
 * 3. 🔧 **Middlewares**: Logging, CORS, autenticação, validação
 * 4. 🎮 **Controllers**: Separação de responsabilidades
 * 5. ✅ **Validação**: Dados seguros e consistentes
 * 6. 🚨 **Error Handling**: Tratamento robusto de erros
 * 7. 🔒 **Segurança**: Autenticação e autorização
 * 
 * **Próximo arquivo**: 03-autenticacao-autorizacao.js
 * Onde você aprenderá JWT, OAuth e segurança avançada!
 */