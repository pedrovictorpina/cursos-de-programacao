/**
 * MÓDULO 11: QUALIDADE DE CÓDIGO EM JAVASCRIPT
 * Arquivo 04: Boas Práticas de Desenvolvimento
 * 
 * As boas práticas são fundamentais para criar código
 * sustentável, legível e manutenível. Vamos explorar
 * convenções, padrões e técnicas que elevam a qualidade
 * do código JavaScript.
 * 
 * Professor: Boas práticas não são regras rígidas,
 * são diretrizes que evoluem com a experiência e
 * o contexto do projeto. O importante é a consistência
 * e a clareza de intenção.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Aplicar convenções de nomenclatura
2. Estruturar código de forma clara
3. Implementar tratamento de erros robusto
4. Seguir princípios SOLID
5. Criar código autodocumentado
6. Aplicar padrões de segurança
*/

// ==========================================
// TEORIA: FUNDAMENTOS DAS BOAS PRÁTICAS
// ==========================================

/*
PRINCÍPIOS FUNDAMENTAIS:

1. LEGIBILIDADE:
   - Código é lido mais vezes do que escrito
   - Nomes descritivos são essenciais
   - Estrutura clara facilita manutenção
   - Comentários explicam o "porquê", não o "como"

2. SIMPLICIDADE:
   - KISS (Keep It Simple, Stupid)
   - Evite over-engineering
   - Prefira soluções diretas
   - Remova código desnecessário

3. CONSISTÊNCIA:
   - Siga convenções estabelecidas
   - Use ferramentas de linting
   - Mantenha padrões no projeto
   - Documente decisões arquiteturais

4. MANUTENIBILIDADE:
   - Código fácil de modificar
   - Baixo acoplamento
   - Alta coesão
   - Testes abrangentes

5. PERFORMANCE:
   - Otimize quando necessário
   - Meça antes de otimizar
   - Considere trade-offs
   - Monitore em produção

6. SEGURANÇA:
   - Valide todas as entradas
   - Sanitize dados
   - Use HTTPS
   - Proteja contra vulnerabilidades conhecidas

CONVENÇÕES DE NOMENCLATURA:

1. VARIÁVEIS E FUNÇÕES:
   - camelCase para variáveis e funções
   - Nomes descritivos e pronunciáveis
   - Evite abreviações desnecessárias
   - Use verbos para funções

2. CONSTANTES:
   - UPPER_SNAKE_CASE para constantes globais
   - camelCase para constantes locais
   - Agrupe constantes relacionadas

3. CLASSES:
   - PascalCase para classes
   - Nomes substantivos
   - Evite prefixos desnecessários

4. ARQUIVOS E MÓDULOS:
   - kebab-case para arquivos
   - Nomes descritivos
   - Organize por funcionalidade

ESTRUTURA DE CÓDIGO:

1. ORGANIZAÇÃO:
   - Imports no topo
   - Constantes após imports
   - Funções auxiliares antes da principal
   - Exports no final

2. INDENTAÇÃO:
   - Use 2 ou 4 espaços consistentemente
   - Configure editor para mostrar espaços
   - Use ferramentas de formatação

3. LINHAS E BLOCOS:
   - Máximo 80-120 caracteres por linha
   - Quebras de linha lógicas
   - Espaços em branco para separar seções

4. COMENTÁRIOS:
   - JSDoc para documentação de API
   - Comentários inline para lógica complexa
   - TODO/FIXME para itens pendentes
   - Evite comentários óbvios
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. CONVENÇÕES DE NOMENCLATURA
console.log('\n=== 1. Convenções de Nomenclatura ===');

// ❌ Nomes ruins
/*
let d = new Date();
let u = users.filter(x => x.a);
function calc(a, b) { return a * b * 0.1; }
class mgr { }
*/

// ✅ Nomes bons
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);

/**
 * Calcula o desconto baseado no valor e taxa
 * @param {number} amount - Valor base
 * @param {number} rate - Taxa de desconto (0-1)
 * @returns {number} Valor do desconto
 */
function calculateDiscount(amount, rate) {
    return amount * rate * 0.1;
}

class UserManager {
    constructor() {
        this.users = new Map();
        this.activeSessionCount = 0;
    }
    
    /**
     * Adiciona um novo usuário ao sistema
     * @param {Object} userData - Dados do usuário
     * @returns {string} ID do usuário criado
     */
    addUser(userData) {
        const userId = this.generateUserId();
        const user = this.createUserFromData(userData);
        
        this.users.set(userId, user);
        this.logUserCreation(userId, user);
        
        return userId;
    }
    
    /**
     * Remove usuário do sistema
     * @param {string} userId - ID do usuário
     * @returns {boolean} Sucesso da operação
     */
    removeUser(userId) {
        if (!this.users.has(userId)) {
            throw new Error(`Usuário ${userId} não encontrado`);
        }
        
        const user = this.users.get(userId);
        this.cleanupUserSessions(userId);
        this.users.delete(userId);
        this.logUserRemoval(userId, user);
        
        return true;
    }
    
    // Métodos auxiliares com nomes descritivos
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    createUserFromData(userData) {
        return {
            ...userData,
            createdAt: new Date(),
            isActive: true,
            lastLoginAt: null
        };
    }
    
    cleanupUserSessions(userId) {
        // Lógica para limpar sessões do usuário
        console.log(`Limpando sessões do usuário ${userId}`);
    }
    
    logUserCreation(userId, user) {
        console.log(`✅ Usuário criado: ${userId} - ${user.name}`);
    }
    
    logUserRemoval(userId, user) {
        console.log(`🗑️ Usuário removido: ${userId} - ${user.name}`);
    }
}

// Constantes bem nomeadas
const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const API_ENDPOINTS = {
    USERS: '/api/users',
    AUTHENTICATION: '/api/auth',
    PRODUCTS: '/api/products'
};

const VALIDATION_RULES = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MAX_LENGTH: 50
};

// 2. ESTRUTURA E ORGANIZAÇÃO
console.log('\n=== 2. Estrutura e Organização ===');

/**
 * Classe que demonstra boa estrutura e organização
 * Segue o padrão: propriedades -> constructor -> métodos públicos -> métodos privados
 */
class ProductCatalog {
    // Propriedades estáticas
    static DEFAULT_PAGE_SIZE = 20;
    static MAX_PAGE_SIZE = 100;
    
    // Propriedades privadas (convenção com _)
    #products = new Map();
    #categories = new Set();
    #searchIndex = new Map();
    
    constructor(initialProducts = []) {
        this.validateInitialProducts(initialProducts);
        this.initializeProducts(initialProducts);
        this.buildSearchIndex();
    }
    
    // ==========================================
    // MÉTODOS PÚBLICOS
    // ==========================================
    
    /**
     * Adiciona produto ao catálogo
     * @param {Object} product - Dados do produto
     * @returns {string} ID do produto adicionado
     */
    addProduct(product) {
        this.validateProduct(product);
        
        const productId = this.generateProductId();
        const enrichedProduct = this.enrichProductData(product);
        
        this.#products.set(productId, enrichedProduct);
        this.#categories.add(product.category);
        this.updateSearchIndex(productId, enrichedProduct);
        
        this.logProductAddition(productId, enrichedProduct);
        
        return productId;
    }
    
    /**
     * Busca produtos com filtros e paginação
     * @param {Object} options - Opções de busca
     * @returns {Object} Resultado da busca
     */
    searchProducts(options = {}) {
        const {
            query = '',
            category = null,
            minPrice = 0,
            maxPrice = Infinity,
            page = 1,
            pageSize = ProductCatalog.DEFAULT_PAGE_SIZE
        } = options;
        
        this.validateSearchOptions(options);
        
        let results = Array.from(this.#products.values());
        
        // Aplicar filtros
        if (query) {
            results = this.filterByQuery(results, query);
        }
        
        if (category) {
            results = this.filterByCategory(results, category);
        }
        
        results = this.filterByPriceRange(results, minPrice, maxPrice);
        
        // Aplicar paginação
        const paginatedResults = this.paginateResults(results, page, pageSize);
        
        return {
            products: paginatedResults.items,
            pagination: {
                currentPage: page,
                pageSize,
                totalItems: results.length,
                totalPages: paginatedResults.totalPages,
                hasNextPage: paginatedResults.hasNextPage,
                hasPreviousPage: page > 1
            },
            filters: {
                query,
                category,
                priceRange: { min: minPrice, max: maxPrice }
            }
        };
    }
    
    /**
     * Obtém estatísticas do catálogo
     * @returns {Object} Estatísticas
     */
    getStatistics() {
        const products = Array.from(this.#products.values());
        
        return {
            totalProducts: products.length,
            totalCategories: this.#categories.size,
            averagePrice: this.calculateAveragePrice(products),
            priceRange: this.calculatePriceRange(products),
            categoriesDistribution: this.calculateCategoriesDistribution(products),
            lastUpdated: new Date().toISOString()
        };
    }
    
    // ==========================================
    // MÉTODOS PRIVADOS
    // ==========================================
    
    validateInitialProducts(products) {
        if (!Array.isArray(products)) {
            throw new TypeError('Produtos iniciais devem ser um array');
        }
        
        products.forEach((product, index) => {
            try {
                this.validateProduct(product);
            } catch (error) {
                throw new Error(`Produto inválido no índice ${index}: ${error.message}`);
            }
        });
    }
    
    validateProduct(product) {
        const requiredFields = ['name', 'price', 'category'];
        
        for (let field of requiredFields) {
            if (!(field in product)) {
                throw new Error(`Campo obrigatório ausente: ${field}`);
            }
        }
        
        if (typeof product.name !== 'string' || product.name.trim().length === 0) {
            throw new Error('Nome do produto deve ser uma string não vazia');
        }
        
        if (typeof product.price !== 'number' || product.price < 0) {
            throw new Error('Preço deve ser um número não negativo');
        }
        
        if (typeof product.category !== 'string' || product.category.trim().length === 0) {
            throw new Error('Categoria deve ser uma string não vazia');
        }
    }
    
    validateSearchOptions(options) {
        const { page, pageSize } = options;
        
        if (page && (typeof page !== 'number' || page < 1)) {
            throw new Error('Página deve ser um número maior que 0');
        }
        
        if (pageSize && (typeof pageSize !== 'number' || pageSize < 1 || pageSize > ProductCatalog.MAX_PAGE_SIZE)) {
            throw new Error(`Tamanho da página deve estar entre 1 e ${ProductCatalog.MAX_PAGE_SIZE}`);
        }
    }
    
    initializeProducts(products) {
        products.forEach(product => {
            this.addProduct(product);
        });
    }
    
    enrichProductData(product) {
        return {
            ...product,
            id: this.generateProductId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            slug: this.generateSlug(product.name)
        };
    }
    
    generateProductId() {
        return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    buildSearchIndex() {
        this.#searchIndex.clear();
        
        for (let [productId, product] of this.#products) {
            this.updateSearchIndex(productId, product);
        }
    }
    
    updateSearchIndex(productId, product) {
        const searchTerms = [
            ...product.name.toLowerCase().split(/\s+/),
            product.category.toLowerCase(),
            ...(product.tags || [])
        ];
        
        searchTerms.forEach(term => {
            if (!this.#searchIndex.has(term)) {
                this.#searchIndex.set(term, new Set());
            }
            this.#searchIndex.get(term).add(productId);
        });
    }
    
    filterByQuery(products, query) {
        const queryTerms = query.toLowerCase().split(/\s+/);
        
        return products.filter(product => {
            const productText = `${product.name} ${product.category} ${(product.tags || []).join(' ')}`.toLowerCase();
            
            return queryTerms.every(term => productText.includes(term));
        });
    }
    
    filterByCategory(products, category) {
        return products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    filterByPriceRange(products, minPrice, maxPrice) {
        return products.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }
    
    paginateResults(items, page, pageSize) {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedItems = items.slice(startIndex, endIndex);
        
        return {
            items: paginatedItems,
            totalPages: Math.ceil(items.length / pageSize),
            hasNextPage: endIndex < items.length
        };
    }
    
    calculateAveragePrice(products) {
        if (products.length === 0) return 0;
        
        const total = products.reduce((sum, product) => sum + product.price, 0);
        return total / products.length;
    }
    
    calculatePriceRange(products) {
        if (products.length === 0) return { min: 0, max: 0 };
        
        const prices = products.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }
    
    calculateCategoriesDistribution(products) {
        const distribution = {};
        
        products.forEach(product => {
            distribution[product.category] = (distribution[product.category] || 0) + 1;
        });
        
        return distribution;
    }
    
    logProductAddition(productId, product) {
        console.log(`📦 Produto adicionado: ${productId} - ${product.name}`);
    }
}

// Exemplo de uso da classe bem estruturada
const catalog = new ProductCatalog([
    { name: 'Smartphone Galaxy', price: 899.99, category: 'Eletrônicos', tags: ['mobile', 'android'] },
    { name: 'Notebook Dell', price: 1299.99, category: 'Eletrônicos', tags: ['laptop', 'computer'] },
    { name: 'Camiseta Polo', price: 49.99, category: 'Roupas', tags: ['casual', 'cotton'] }
]);

const searchResults = catalog.searchProducts({
    query: 'smartphone',
    category: 'Eletrônicos',
    maxPrice: 1000
});

console.log('Resultados da busca:', searchResults);
console.log('Estatísticas:', catalog.getStatistics());

// 3. TRATAMENTO DE ERROS ROBUSTO
console.log('\n=== 3. Tratamento de Erros ===');

/**
 * Sistema de tratamento de erros com diferentes tipos e contextos
 */
class ErrorHandler {
    static ERROR_TYPES = {
        VALIDATION: 'ValidationError',
        NETWORK: 'NetworkError',
        AUTHENTICATION: 'AuthenticationError',
        AUTHORIZATION: 'AuthorizationError',
        NOT_FOUND: 'NotFoundError',
        BUSINESS_LOGIC: 'BusinessLogicError',
        SYSTEM: 'SystemError'
    };
    
    /**
     * Cria erro customizado com contexto
     * @param {string} type - Tipo do erro
     * @param {string} message - Mensagem do erro
     * @param {Object} context - Contexto adicional
     * @returns {Error} Erro customizado
     */
    static createError(type, message, context = {}) {
        const error = new Error(message);
        error.name = type;
        error.context = context;
        error.timestamp = new Date().toISOString();
        error.stack = error.stack;
        
        return error;
    }
    
    /**
     * Wrapper para operações que podem falhar
     * @param {Function} operation - Operação a ser executada
     * @param {Object} options - Opções de tratamento
     * @returns {Object} Resultado ou erro
     */
    static async safeExecute(operation, options = {}) {
        const {
            retries = 0,
            retryDelay = 1000,
            timeout = 30000,
            onError = null,
            context = {}
        } = options;
        
        let lastError;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                // Aplicar timeout se especificado
                if (timeout > 0) {
                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(() => {
                            reject(this.createError(
                                this.ERROR_TYPES.SYSTEM,
                                `Operação excedeu timeout de ${timeout}ms`,
                                { ...context, attempt, timeout }
                            ));
                        }, timeout);
                    });
                    
                    const result = await Promise.race([
                        operation(),
                        timeoutPromise
                    ]);
                    
                    return { success: true, data: result, error: null };
                } else {
                    const result = await operation();
                    return { success: true, data: result, error: null };
                }
            } catch (error) {
                lastError = error;
                
                // Chamar callback de erro se fornecido
                if (onError) {
                    try {
                        await onError(error, attempt, context);
                    } catch (callbackError) {
                        console.error('Erro no callback de erro:', callbackError);
                    }
                }
                
                // Se não é a última tentativa, aguardar antes de tentar novamente
                if (attempt < retries) {
                    console.warn(`Tentativa ${attempt + 1} falhou, tentando novamente em ${retryDelay}ms`);
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }
            }
        }
        
        return { success: false, data: null, error: lastError };
    }
    
    /**
     * Valida dados com tratamento de erro detalhado
     * @param {any} data - Dados a validar
     * @param {Object} schema - Schema de validação
     * @returns {Object} Resultado da validação
     */
    static validateData(data, schema) {
        const errors = [];
        
        try {
            for (let [field, rules] of Object.entries(schema)) {
                const value = data[field];
                const fieldErrors = this.validateField(field, value, rules);
                
                if (fieldErrors.length > 0) {
                    errors.push(...fieldErrors);
                }
            }
            
            if (errors.length > 0) {
                const validationError = this.createError(
                    this.ERROR_TYPES.VALIDATION,
                    'Dados inválidos',
                    { errors, data }
                );
                
                return { valid: false, errors, error: validationError };
            }
            
            return { valid: true, errors: [], error: null };
        } catch (error) {
            const systemError = this.createError(
                this.ERROR_TYPES.SYSTEM,
                'Erro interno na validação',
                { originalError: error.message, data, schema }
            );
            
            return { valid: false, errors: [systemError.message], error: systemError };
        }
    }
    
    static validateField(field, value, rules) {
        const errors = [];
        
        // Verificar se é obrigatório
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`Campo '${field}' é obrigatório`);
            return errors; // Se obrigatório e vazio, não validar outras regras
        }
        
        // Se valor está vazio e não é obrigatório, pular validações
        if (value === undefined || value === null || value === '') {
            return errors;
        }
        
        // Validar tipo
        if (rules.type && typeof value !== rules.type) {
            errors.push(`Campo '${field}' deve ser do tipo ${rules.type}`);
        }
        
        // Validar comprimento mínimo
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`Campo '${field}' deve ter pelo menos ${rules.minLength} caracteres`);
        }
        
        // Validar comprimento máximo
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Campo '${field}' deve ter no máximo ${rules.maxLength} caracteres`);
        }
        
        // Validar valor mínimo
        if (rules.min !== undefined && value < rules.min) {
            errors.push(`Campo '${field}' deve ser maior ou igual a ${rules.min}`);
        }
        
        // Validar valor máximo
        if (rules.max !== undefined && value > rules.max) {
            errors.push(`Campo '${field}' deve ser menor ou igual a ${rules.max}`);
        }
        
        // Validar padrão regex
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`Campo '${field}' não atende ao padrão exigido`);
        }
        
        // Validação customizada
        if (rules.custom && typeof rules.custom === 'function') {
            try {
                const customResult = rules.custom(value);
                if (customResult !== true) {
                    errors.push(customResult || `Campo '${field}' falhou na validação customizada`);
                }
            } catch (error) {
                errors.push(`Erro na validação customizada do campo '${field}': ${error.message}`);
            }
        }
        
        return errors;
    }
    
    /**
     * Logger de erros estruturado
     * @param {Error} error - Erro a ser logado
     * @param {Object} context - Contexto adicional
     */
    static logError(error, context = {}) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            level: 'ERROR',
            name: error.name || 'Error',
            message: error.message,
            stack: error.stack,
            context: {
                ...error.context,
                ...context
            }
        };
        
        // Em produção, enviar para serviço de logging
        console.error('🚨 Erro capturado:', JSON.stringify(errorLog, null, 2));
        
        // Aqui você poderia enviar para serviços como Sentry, LogRocket, etc.
        // this.sendToLoggingService(errorLog);
    }
}

// Exemplos de uso do tratamento de erros

// Função que pode falhar
async function unreliableApiCall() {
    if (Math.random() < 0.7) {
        throw ErrorHandler.createError(
            ErrorHandler.ERROR_TYPES.NETWORK,
            'Falha na conexão com a API',
            { endpoint: '/api/data', method: 'GET' }
        );
    }
    
    return { data: 'Sucesso!' };
}

// Uso do safeExecute
(async () => {
    const result = await ErrorHandler.safeExecute(
        unreliableApiCall,
        {
            retries: 3,
            retryDelay: 1000,
            timeout: 5000,
            onError: (error, attempt, context) => {
                console.log(`Tentativa ${attempt + 1} falhou:`, error.message);
            },
            context: { userId: '123', operation: 'fetchData' }
        }
    );
    
    if (result.success) {
        console.log('✅ Operação bem-sucedida:', result.data);
    } else {
        console.log('❌ Operação falhou após todas as tentativas');
        ErrorHandler.logError(result.error);
    }
})();

// Exemplo de validação
const userSchema = {
    name: {
        required: true,
        type: 'string',
        minLength: 2,
        maxLength: 50
    },
    email: {
        required: true,
        type: 'string',
        pattern: VALIDATION_RULES.EMAIL_REGEX
    },
    age: {
        required: false,
        type: 'number',
        min: 0,
        max: 120
    },
    password: {
        required: true,
        type: 'string',
        minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
        custom: (value) => {
            if (!/[A-Z]/.test(value)) {
                return 'Senha deve conter pelo menos uma letra maiúscula';
            }
            if (!/[0-9]/.test(value)) {
                return 'Senha deve conter pelo menos um número';
            }
            return true;
        }
    }
};

const userData = {
    name: 'João',
    email: 'joao@email.com',
    age: 30,
    password: 'MinhaSenh@123'
};

const validation = ErrorHandler.validateData(userData, userSchema);
if (validation.valid) {
    console.log('✅ Dados válidos');
} else {
    console.log('❌ Dados inválidos:', validation.errors);
}

// 4. PRINCÍPIOS SOLID
console.log('\n=== 4. Princípios SOLID ===');

/**
 * Demonstração dos princípios SOLID em JavaScript
 */

// S - Single Responsibility Principle
// Cada classe tem uma única responsabilidade

class EmailValidator {
    static validate(email) {
        return VALIDATION_RULES.EMAIL_REGEX.test(email);
    }
}

class PasswordValidator {
    static validate(password) {
        return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH &&
               /[A-Z]/.test(password) &&
               /[0-9]/.test(password);
    }
}

class UserRepository {
    constructor() {
        this.users = new Map();
    }
    
    save(user) {
        this.users.set(user.id, user);
        return user;
    }
    
    findById(id) {
        return this.users.get(id);
    }
    
    findByEmail(email) {
        return Array.from(this.users.values())
            .find(user => user.email === email);
    }
}

// O - Open/Closed Principle
// Aberto para extensão, fechado para modificação

class NotificationSender {
    send(message, recipient) {
        throw new Error('Método send deve ser implementado');
    }
}

class EmailNotificationSender extends NotificationSender {
    send(message, recipient) {
        console.log(`📧 Enviando email para ${recipient}: ${message}`);
        // Lógica específica para email
    }
}

class SMSNotificationSender extends NotificationSender {
    send(message, recipient) {
        console.log(`📱 Enviando SMS para ${recipient}: ${message}`);
        // Lógica específica para SMS
    }
}

class PushNotificationSender extends NotificationSender {
    send(message, recipient) {
        console.log(`🔔 Enviando push notification para ${recipient}: ${message}`);
        // Lógica específica para push notification
    }
}

// L - Liskov Substitution Principle
// Objetos de uma superclasse devem ser substituíveis por objetos de suas subclasses

class Shape {
    calculateArea() {
        throw new Error('Método calculateArea deve ser implementado');
    }
    
    calculatePerimeter() {
        throw new Error('Método calculatePerimeter deve ser implementado');
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    calculateArea() {
        return this.width * this.height;
    }
    
    calculatePerimeter() {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    calculateArea() {
        return Math.PI * this.radius * this.radius;
    }
    
    calculatePerimeter() {
        return 2 * Math.PI * this.radius;
    }
}

// Função que trabalha com qualquer Shape
function printShapeInfo(shape) {
    console.log(`Área: ${shape.calculateArea().toFixed(2)}`);
    console.log(`Perímetro: ${shape.calculatePerimeter().toFixed(2)}`);
}

// I - Interface Segregation Principle
// Clientes não devem ser forçados a depender de interfaces que não usam

// Em JavaScript, usamos composição em vez de interfaces
class Readable {
    read() {
        throw new Error('Método read deve ser implementado');
    }
}

class Writable {
    write(data) {
        throw new Error('Método write deve ser implementado');
    }
}

class Seekable {
    seek(position) {
        throw new Error('Método seek deve ser implementado');
    }
}

// Classes específicas implementam apenas o que precisam
class FileReader {
    constructor() {
        Object.assign(this, new Readable());
    }
    
    read() {
        return 'Dados do arquivo';
    }
}

class FileWriter {
    constructor() {
        Object.assign(this, new Writable());
    }
    
    write(data) {
        console.log(`Escrevendo: ${data}`);
    }
}

class RandomAccessFile {
    constructor() {
        Object.assign(this, new Readable(), new Writable(), new Seekable());
    }
    
    read() {
        return 'Dados do arquivo';
    }
    
    write(data) {
        console.log(`Escrevendo: ${data}`);
    }
    
    seek(position) {
        console.log(`Movendo para posição: ${position}`);
    }
}

// D - Dependency Inversion Principle
// Módulos de alto nível não devem depender de módulos de baixo nível

class UserService {
    constructor(userRepository, emailSender, logger) {
        this.userRepository = userRepository;
        this.emailSender = emailSender;
        this.logger = logger;
    }
    
    async createUser(userData) {
        try {
            // Validar dados
            if (!EmailValidator.validate(userData.email)) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.VALIDATION,
                    'Email inválido'
                );
            }
            
            if (!PasswordValidator.validate(userData.password)) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.VALIDATION,
                    'Senha inválida'
                );
            }
            
            // Verificar se usuário já existe
            const existingUser = this.userRepository.findByEmail(userData.email);
            if (existingUser) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.BUSINESS_LOGIC,
                    'Usuário já existe'
                );
            }
            
            // Criar usuário
            const user = {
                id: `user_${Date.now()}`,
                ...userData,
                createdAt: new Date()
            };
            
            const savedUser = this.userRepository.save(user);
            
            // Enviar email de boas-vindas
            await this.emailSender.send(
                'Bem-vindo ao nosso sistema!',
                user.email
            );
            
            // Log da operação
            this.logger.info('Usuário criado com sucesso', { userId: user.id });
            
            return savedUser;
        } catch (error) {
            this.logger.error('Erro ao criar usuário', { error: error.message });
            throw error;
        }
    }
}

// Logger simples
class Logger {
    info(message, context = {}) {
        console.log(`ℹ️ [INFO] ${message}`, context);
    }
    
    error(message, context = {}) {
        console.error(`🚨 [ERROR] ${message}`, context);
    }
}

// Exemplo de uso dos princípios SOLID
const userRepository = new UserRepository();
const emailSender = new EmailNotificationSender();
const logger = new Logger();

const userService = new UserService(userRepository, emailSender, logger);

// Teste das formas geométricas (LSP)
const rectangle = new Rectangle(5, 3);
const circle = new Circle(4);

console.log('\n📐 Informações do Retângulo:');
printShapeInfo(rectangle);

console.log('\n⭕ Informações do Círculo:');
printShapeInfo(circle);

// Teste do serviço de usuário
(async () => {
    try {
        const newUser = await userService.createUser({
            name: 'Maria Silva',
            email: 'maria@email.com',
            password: 'MinhaSenh@123'
        });
        
        console.log('\n✅ Usuário criado:', newUser.name);
    } catch (error) {
        console.log('\n❌ Erro ao criar usuário:', error.message);
    }
})();

// 5. CÓDIGO AUTODOCUMENTADO
console.log('\n=== 5. Código Autodocumentado ===');

/**
 * Sistema de processamento de pedidos que demonstra código autodocumentado
 * 
 * @example
 * const processor = new OrderProcessor(paymentGateway, inventoryService);
 * const result = await processor.processOrder(orderData);
 */
class OrderProcessor {
    /**
     * @param {PaymentGateway} paymentGateway - Gateway de pagamento
     * @param {InventoryService} inventoryService - Serviço de estoque
     * @param {NotificationService} notificationService - Serviço de notificações
     */
    constructor(paymentGateway, inventoryService, notificationService) {
        this.paymentGateway = paymentGateway;
        this.inventoryService = inventoryService;
        this.notificationService = notificationService;
        
        this.ORDER_STATUSES = {
            PENDING: 'pending',
            PROCESSING: 'processing',
            CONFIRMED: 'confirmed',
            SHIPPED: 'shipped',
            DELIVERED: 'delivered',
            CANCELLED: 'cancelled'
        };
    }
    
    /**
     * Processa um pedido completo
     * 
     * @param {Object} orderData - Dados do pedido
     * @param {string} orderData.customerId - ID do cliente
     * @param {Array} orderData.items - Itens do pedido
     * @param {Object} orderData.shippingAddress - Endereço de entrega
     * @param {Object} orderData.paymentMethod - Método de pagamento
     * @returns {Promise<Object>} Resultado do processamento
     * 
     * @throws {ValidationError} Quando dados do pedido são inválidos
     * @throws {InsufficientStockError} Quando não há estoque suficiente
     * @throws {PaymentError} Quando pagamento falha
     */
    async processOrder(orderData) {
        const orderId = this.generateOrderId();
        
        try {
            // Etapa 1: Validar dados do pedido
            this.validateOrderData(orderData);
            
            // Etapa 2: Verificar disponibilidade no estoque
            await this.verifyStockAvailability(orderData.items);
            
            // Etapa 3: Calcular valores do pedido
            const orderTotals = this.calculateOrderTotals(orderData.items);
            
            // Etapa 4: Processar pagamento
            const paymentResult = await this.processPayment(
                orderTotals.total,
                orderData.paymentMethod
            );
            
            // Etapa 5: Reservar itens no estoque
            await this.reserveStockItems(orderData.items);
            
            // Etapa 6: Criar registro do pedido
            const order = this.createOrderRecord({
                id: orderId,
                ...orderData,
                ...orderTotals,
                paymentId: paymentResult.transactionId,
                status: this.ORDER_STATUSES.CONFIRMED,
                createdAt: new Date()
            });
            
            // Etapa 7: Enviar confirmação ao cliente
            await this.sendOrderConfirmation(order);
            
            return {
                success: true,
                order,
                message: 'Pedido processado com sucesso'
            };
            
        } catch (error) {
            // Em caso de erro, reverter operações já realizadas
            await this.rollbackOrderProcessing(orderId, error);
            
            throw error;
        }
    }
    
    /**
     * Valida os dados básicos do pedido
     * @private
     */
    validateOrderData(orderData) {
        const requiredFields = ['customerId', 'items', 'shippingAddress', 'paymentMethod'];
        
        for (let field of requiredFields) {
            if (!orderData[field]) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.VALIDATION,
                    `Campo obrigatório ausente: ${field}`
                );
            }
        }
        
        if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw ErrorHandler.createError(
                ErrorHandler.ERROR_TYPES.VALIDATION,
                'Pedido deve conter pelo menos um item'
            );
        }
        
        // Validar cada item do pedido
        orderData.items.forEach((item, index) => {
            this.validateOrderItem(item, index);
        });
    }
    
    /**
     * Valida um item individual do pedido
     * @private
     */
    validateOrderItem(item, index) {
        const requiredItemFields = ['productId', 'quantity', 'price'];
        
        for (let field of requiredItemFields) {
            if (item[field] === undefined || item[field] === null) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.VALIDATION,
                    `Item ${index}: campo '${field}' é obrigatório`
                );
            }
        }
        
        if (typeof item.quantity !== 'number' || item.quantity <= 0) {
            throw ErrorHandler.createError(
                ErrorHandler.ERROR_TYPES.VALIDATION,
                `Item ${index}: quantidade deve ser um número positivo`
            );
        }
        
        if (typeof item.price !== 'number' || item.price < 0) {
            throw ErrorHandler.createError(
                ErrorHandler.ERROR_TYPES.VALIDATION,
                `Item ${index}: preço deve ser um número não negativo`
            );
        }
    }
    
    /**
     * Verifica se há estoque suficiente para todos os itens
     * @private
     */
    async verifyStockAvailability(items) {
        for (let item of items) {
            const availableStock = await this.inventoryService.getAvailableStock(item.productId);
            
            if (availableStock < item.quantity) {
                throw ErrorHandler.createError(
                    ErrorHandler.ERROR_TYPES.BUSINESS_LOGIC,
                    `Estoque insuficiente para produto ${item.productId}`,
                    {
                        productId: item.productId,
                        requested: item.quantity,
                        available: availableStock
                    }
                );
            }
        }
    }
    
    /**
     * Calcula os totais do pedido (subtotal, impostos, frete, total)
     * @private
     */
    calculateOrderTotals(items) {
        const subtotal = items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        const taxRate = 0.1; // 10% de imposto
        const tax = subtotal * taxRate;
        
        const shippingCost = this.calculateShippingCost(subtotal);
        
        const total = subtotal + tax + shippingCost;
        
        return {
            subtotal: this.roundToTwoDecimals(subtotal),
            tax: this.roundToTwoDecimals(tax),
            shipping: this.roundToTwoDecimals(shippingCost),
            total: this.roundToTwoDecimals(total)
        };
    }
    
    /**
     * Calcula o custo de frete baseado no subtotal
     * @private
     */
    calculateShippingCost(subtotal) {
        const FREE_SHIPPING_THRESHOLD = 100;
        const STANDARD_SHIPPING_COST = 15;
        
        return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
    }
    
    /**
     * Arredonda valor para duas casas decimais
     * @private
     */
    roundToTwoDecimals(value) {
        return Math.round(value * 100) / 100;
    }
    
    /**
     * Processa o pagamento através do gateway
     * @private
     */
    async processPayment(amount, paymentMethod) {
        try {
            return await this.paymentGateway.processPayment({
                amount,
                method: paymentMethod,
                currency: 'BRL'
            });
        } catch (error) {
            throw ErrorHandler.createError(
                ErrorHandler.ERROR_TYPES.BUSINESS_LOGIC,
                'Falha no processamento do pagamento',
                { originalError: error.message, amount, paymentMethod }
            );
        }
    }
    
    /**
     * Reserva itens no estoque
     * @private
     */
    async reserveStockItems(items) {
        for (let item of items) {
            await this.inventoryService.reserveStock(item.productId, item.quantity);
        }
    }
    
    /**
     * Cria o registro do pedido no sistema
     * @private
     */
    createOrderRecord(orderData) {
        // Em um sistema real, isso salvaria no banco de dados
        console.log(`📝 Criando registro do pedido ${orderData.id}`);
        return orderData;
    }
    
    /**
     * Envia confirmação do pedido ao cliente
     * @private
     */
    async sendOrderConfirmation(order) {
        const confirmationMessage = this.buildConfirmationMessage(order);
        
        await this.notificationService.send(
            confirmationMessage,
            order.customerId
        );
    }
    
    /**
     * Constrói mensagem de confirmação do pedido
     * @private
     */
    buildConfirmationMessage(order) {
        return `Pedido ${order.id} confirmado! Total: R$ ${order.total.toFixed(2)}`;
    }
    
    /**
     * Reverte operações em caso de erro
     * @private
     */
    async rollbackOrderProcessing(orderId, error) {
        console.log(`🔄 Revertendo processamento do pedido ${orderId}`);
        
        // Aqui você implementaria a lógica de rollback:
        // - Cancelar reservas de estoque
        // - Estornar pagamento se processado
        // - Limpar registros temporários
        // - Notificar sistemas dependentes
        
        ErrorHandler.logError(error, { orderId, operation: 'rollback' });
    }
    
    /**
     * Gera ID único para o pedido
     * @private
     */
    generateOrderId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `ORD-${timestamp}-${random}`;
    }
}

// Mocks dos serviços para demonstração
class MockPaymentGateway {
    async processPayment(paymentData) {
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            success: true,
            transactionId: `txn_${Date.now()}`,
            amount: paymentData.amount
        };
    }
}

class MockInventoryService {
    constructor() {
        this.stock = new Map([
            ['prod_1', 100],
            ['prod_2', 50],
            ['prod_3', 25]
        ]);
    }
    
    async getAvailableStock(productId) {
        return this.stock.get(productId) || 0;
    }
    
    async reserveStock(productId, quantity) {
        const current = this.stock.get(productId) || 0;
        this.stock.set(productId, current - quantity);
        console.log(`📦 Reservado ${quantity} unidades do produto ${productId}`);
    }
}

class MockNotificationService {
    async send(message, recipient) {
        console.log(`📧 Notificação enviada para ${recipient}: ${message}`);
    }
}

// Exemplo de uso do código autodocumentado
const paymentGateway = new MockPaymentGateway();
const inventoryService = new MockInventoryService();
const notificationService = new MockNotificationService();

const orderProcessor = new OrderProcessor(
    paymentGateway,
    inventoryService,
    notificationService
);

// Processar um pedido de exemplo
(async () => {
    try {
        const orderData = {
            customerId: 'customer_123',
            items: [
                { productId: 'prod_1', quantity: 2, price: 29.99 },
                { productId: 'prod_2', quantity: 1, price: 49.99 }
            ],
            shippingAddress: {
                street: 'Rua das Flores, 123',
                city: 'São Paulo',
                zipCode: '01234-567'
            },
            paymentMethod: {
                type: 'credit_card',
                cardNumber: '**** **** **** 1234'
            }
        };
        
        const result = await orderProcessor.processOrder(orderData);
        console.log('\n✅ Pedido processado com sucesso:', result.order.id);
    } catch (error) {
        console.log('\n❌ Erro no processamento:', error.message);
    }
})();

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE QUALIDADE COMPLETO
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Qualidade Completo ===');

/**
 * Sistema completo que integra todas as boas práticas aprendidas
 */
class QualityAssuranceSystem {
    constructor() {
        this.codeAnalyzer = new CodeAnalyzer();
        this.testRunner = new TestRunner();
        this.performanceMonitor = new PerformanceMonitor();
        this.securityScanner = new SecurityScanner();
        this.documentationGenerator = new DocumentationGenerator();
        
        this.qualityMetrics = {
            codeQuality: 0,
            testCoverage: 0,
            performance: 0,
            security: 0,
            documentation: 0,
            overall: 0
        };
    }
    
    /**
     * Executa análise completa de qualidade
     * @param {Object} project - Dados do projeto
     * @returns {Object} Relatório de qualidade
     */
    async analyzeProject(project) {
        console.log('🔍 Iniciando análise de qualidade...');
        
        const results = {
            timestamp: new Date().toISOString(),
            project: project.name,
            analyses: {},
            recommendations: [],
            score: 0
        };
        
        try {
            // Análise de código
            results.analyses.code = await this.codeAnalyzer.analyze(project.sourceFiles);
            this.qualityMetrics.codeQuality = results.analyses.code.score;
            
            // Execução de testes
            results.analyses.tests = await this.testRunner.runTests(project.testFiles);
            this.qualityMetrics.testCoverage = results.analyses.tests.coverage;
            
            // Monitoramento de performance
            results.analyses.performance = await this.performanceMonitor.analyze(project);
            this.qualityMetrics.performance = results.analyses.performance.score;
            
            // Análise de segurança
            results.analyses.security = await this.securityScanner.scan(project);
            this.qualityMetrics.security = results.analyses.security.score;
            
            // Verificação de documentação
            results.analyses.documentation = await this.documentationGenerator.analyze(project);
            this.qualityMetrics.documentation = results.analyses.documentation.score;
            
            // Calcular score geral
            results.score = this.calculateOverallScore();
            this.qualityMetrics.overall = results.score;
            
            // Gerar recomendações
            results.recommendations = this.generateRecommendations();
            
            return results;
            
        } catch (error) {
            ErrorHandler.logError(error, { project: project.name });
            throw error;
        }
    }
    
    calculateOverallScore() {
        const weights = {
            codeQuality: 0.25,
            testCoverage: 0.25,
            performance: 0.20,
            security: 0.20,
            documentation: 0.10
        };
        
        let weightedSum = 0;
        for (let [metric, weight] of Object.entries(weights)) {
            weightedSum += this.qualityMetrics[metric] * weight;
        }
        
        return Math.round(weightedSum);
    }
    
    generateRecommendations() {
        const recommendations = [];
        
        if (this.qualityMetrics.codeQuality < 70) {
            recommendations.push({
                category: 'Qualidade de Código',
                priority: 'Alta',
                message: 'Refatorar código com baixa qualidade',
                actions: [
                    'Aplicar princípios SOLID',
                    'Melhorar nomenclatura',
                    'Reduzir complexidade ciclomática'
                ]
            });
        }
        
        if (this.qualityMetrics.testCoverage < 80) {
            recommendations.push({
                category: 'Cobertura de Testes',
                priority: 'Alta',
                message: 'Aumentar cobertura de testes',
                actions: [
                    'Escrever testes unitários',
                    'Adicionar testes de integração',
                    'Implementar testes E2E'
                ]
            });
        }
        
        if (this.qualityMetrics.performance < 70) {
            recommendations.push({
                category: 'Performance',
                priority: 'Média',
                message: 'Otimizar performance da aplicação',
                actions: [
                    'Identificar gargalos',
                    'Implementar caching',
                    'Otimizar algoritmos'
                ]
            });
        }
        
        if (this.qualityMetrics.security < 80) {
            recommendations.push({
                category: 'Segurança',
                priority: 'Alta',
                message: 'Corrigir vulnerabilidades de segurança',
                actions: [
                    'Validar todas as entradas',
                    'Implementar autenticação robusta',
                    'Usar HTTPS em produção'
                ]
            });
        }
        
        if (this.qualityMetrics.documentation < 60) {
            recommendations.push({
                category: 'Documentação',
                priority: 'Baixa',
                message: 'Melhorar documentação do projeto',
                actions: [
                    'Adicionar JSDoc às funções',
                    'Criar README detalhado',
                    'Documentar APIs'
                ]
            });
        }
        
        return recommendations;
    }
    
    printQualityReport(results) {
        console.log('\n📊 RELATÓRIO DE QUALIDADE');
        console.log('=' .repeat(50));
        console.log(`Projeto: ${results.project}`);
        console.log(`Data: ${new Date(results.timestamp).toLocaleString()}`);
        console.log(`Score Geral: ${results.score}/100`);
        
        console.log('\n📈 Métricas Detalhadas:');
        console.log(`  Qualidade de Código: ${this.qualityMetrics.codeQuality}/100`);
        console.log(`  Cobertura de Testes: ${this.qualityMetrics.testCoverage}%`);
        console.log(`  Performance: ${this.qualityMetrics.performance}/100`);
        console.log(`  Segurança: ${this.qualityMetrics.security}/100`);
        console.log(`  Documentação: ${this.qualityMetrics.documentation}/100`);
        
        if (results.recommendations.length > 0) {
            console.log('\n💡 Recomendações:');
            results.recommendations.forEach((rec, index) => {
                console.log(`\n${index + 1}. ${rec.category} (${rec.priority})`);
                console.log(`   ${rec.message}`);
                rec.actions.forEach(action => {
                    console.log(`   • ${action}`);
                });
            });
        }
        
        console.log('\n' + '='.repeat(50));
    }
}

// Classes auxiliares para o sistema de qualidade
class CodeAnalyzer {
    async analyze(sourceFiles) {
        console.log('🔍 Analisando qualidade do código...');
        
        // Simular análise de código
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            score: Math.floor(Math.random() * 40) + 60, // 60-100
            issues: [
                { type: 'complexity', count: 3, severity: 'medium' },
                { type: 'duplication', count: 1, severity: 'low' },
                { type: 'naming', count: 2, severity: 'low' }
            ],
            linesOfCode: 1250,
            maintainabilityIndex: 85
        };
    }
}

class TestRunner {
    async runTests(testFiles) {
        console.log('🧪 Executando testes...');
        
        // Simular execução de testes
        await new Promise(resolve => setTimeout(resolve, 800));
        
        return {
            coverage: Math.floor(Math.random() * 30) + 70, // 70-100%
            testsRun: 45,
            testsPassed: 43,
            testsFailed: 2,
            duration: 1250
        };
    }
}

class PerformanceMonitor {
    async analyze(project) {
        console.log('⚡ Analisando performance...');
        
        // Simular análise de performance
        await new Promise(resolve => setTimeout(resolve, 600));
        
        return {
            score: Math.floor(Math.random() * 40) + 60, // 60-100
            loadTime: Math.random() * 2 + 1, // 1-3 segundos
            bundleSize: Math.floor(Math.random() * 500) + 200, // 200-700 KB
            memoryUsage: Math.floor(Math.random() * 50) + 20 // 20-70 MB
        };
    }
}

class SecurityScanner {
    async scan(project) {
        console.log('🔒 Verificando segurança...');
        
        // Simular scan de segurança
        await new Promise(resolve => setTimeout(resolve, 700));
        
        return {
            score: Math.floor(Math.random() * 30) + 70, // 70-100
            vulnerabilities: [
                { type: 'XSS', severity: 'medium', count: 1 },
                { type: 'CSRF', severity: 'low', count: 2 }
            ],
            dependencies: {
                total: 25,
                vulnerable: 1,
                outdated: 3
            }
        };
    }
}

class DocumentationGenerator {
    async analyze(project) {
        console.log('📚 Verificando documentação...');
        
        // Simular análise de documentação
        await new Promise(resolve => setTimeout(resolve, 400));
        
        return {
            score: Math.floor(Math.random() * 50) + 50, // 50-100
            coverage: {
                functions: 65,
                classes: 80,
                modules: 45
            },
            readmeExists: true,
            apiDocsExists: false
        };
    }
}

// Exemplo de uso do sistema de qualidade
(async () => {
    const qaSystem = new QualityAssuranceSystem();
    
    const projectData = {
        name: 'Sistema de E-commerce',
        sourceFiles: ['src/main.js', 'src/utils.js', 'src/api.js'],
        testFiles: ['tests/main.test.js', 'tests/utils.test.js'],
        configFiles: ['package.json', 'webpack.config.js']
    };
    
    try {
        const qualityReport = await qaSystem.analyzeProject(projectData);
        qaSystem.printQualityReport(qualityReport);
    } catch (error) {
        console.error('❌ Erro na análise de qualidade:', error.message);
    }
})();

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS GERAIS:

1. PERFORMANCE:
   - Use const/let em vez de var
   - Prefira for...of para arrays
   - Use Map/Set para coleções grandes
   - Implemente lazy loading quando apropriado
   - Cache resultados de operações caras
   - Use Web Workers para processamento pesado

2. MEMÓRIA:
   - Remova event listeners não utilizados
   - Limpe timers e intervalos
   - Use WeakMap/WeakSet para referências fracas
   - Evite closures desnecessários
   - Monitore vazamentos de memória

3. SEGURANÇA:
   - Valide todas as entradas do usuário
   - Use Content Security Policy (CSP)
   - Sanitize dados antes de exibir
   - Implemente rate limiting
   - Use HTTPS em produção
   - Mantenha dependências atualizadas

4. MANUTENIBILIDADE:
   - Escreva testes antes do código (TDD)
   - Use ferramentas de linting (ESLint)
   - Configure formatação automática (Prettier)
   - Documente decisões arquiteturais
   - Faça code reviews regulares
   - Refatore código regularmente

5. MONITORAMENTO:
   - Implemente logging estruturado
   - Use ferramentas de APM
   - Monitore métricas de negócio
   - Configure alertas para erros
   - Analise performance em produção

FERRAMENTAS RECOMENDADAS:

1. DESENVOLVIMENTO:
   - ESLint (linting)
   - Prettier (formatação)
   - Husky (git hooks)
   - Jest (testes)
   - Webpack/Vite (bundling)

2. QUALIDADE:
   - SonarQube (análise de código)
   - Codecov (cobertura de testes)
   - Lighthouse (performance web)
   - OWASP ZAP (segurança)

3. MONITORAMENTO:
   - Sentry (error tracking)
   - New Relic (APM)
   - Google Analytics (métricas)
   - LogRocket (session replay)

PADRÕES DE PROJETO ÚTEIS:

1. CRIACIONAIS:
   - Factory (criação de objetos)
   - Singleton (instância única)
   - Builder (construção complexa)

2. ESTRUTURAIS:
   - Adapter (compatibilidade)
   - Decorator (funcionalidade adicional)
   - Facade (interface simplificada)

3. COMPORTAMENTAIS:
   - Observer (notificações)
   - Strategy (algoritmos intercambiáveis)
   - Command (encapsular operações)
*/

// ==========================================
// REFERÊNCIAS E RECURSOS
// ==========================================

/*
LIVROS RECOMENDADOS:
- "Clean Code" por Robert C. Martin
- "JavaScript: The Good Parts" por Douglas Crockford
- "You Don't Know JS" série por Kyle Simpson
- "Refactoring" por Martin Fowler
- "Design Patterns" por Gang of Four

RECURSOS ONLINE:
- MDN Web Docs (documentação)
- JavaScript.info (tutorial completo)
- ESLint Rules (regras de linting)
- Jest Documentation (testes)
- Web.dev (performance e boas práticas)

FERRAMENTAS DE DESENVOLVIMENTO:
- VS Code (editor)
- Chrome DevTools (debugging)
- Postman (API testing)
- Git (controle de versão)
- npm/yarn (gerenciamento de pacotes)

COMUNIDADES:
- Stack Overflow
- GitHub
- Reddit (r/javascript)
- Discord/Slack communities
- Meetups locais
*/

// ==========================================
// PRÓXIMOS PASSOS
// ==========================================

/*
APÓS DOMINAR ESTAS BOAS PRÁTICAS:

1. FRAMEWORKS E BIBLIOTECAS:
   - React/Vue/Angular
   - Node.js para backend
   - Express.js para APIs
   - TypeScript para tipagem

2. FERRAMENTAS AVANÇADAS:
   - Docker para containerização
   - CI/CD pipelines
   - Cloud platforms (AWS, Azure, GCP)
   - Microservices architecture

3. ESPECIALIZAÇÃO:
   - Frontend: PWAs, performance optimization
   - Backend: databases, caching, scaling
   - DevOps: monitoring, deployment, infrastructure
   - Mobile: React Native, Ionic

4. SOFT SKILLS:
   - Code review skills
   - Technical communication
   - Project management
   - Team leadership
*/

console.log('\n✅ Módulo de Boas Práticas concluído!');
console.log('\n📚 RESUMO DO MÓDULO:');
console.log('- Convenções de nomenclatura e estrutura');
console.log('- Tratamento robusto de erros');
console.log('- Aplicação dos princípios SOLID');
console.log('- Código autodocumentado');
console.log('- Sistema de qualidade integrado');
console.log('- Dicas de otimização e ferramentas');
console.log('\n🎯 Próximo passo: Aplicar essas práticas em projetos reais!');

/**
 * REFLEXÃO FINAL:
 * 
 * As boas práticas não são regras rígidas, mas diretrizes
 * que evoluem com a experiência. O importante é:
 * 
 * 1. Consistência no projeto
 * 2. Clareza de intenção
 * 3. Facilidade de manutenção
 * 4. Colaboração efetiva
 * 5. Melhoria contínua
 * 
 * Lembre-se: código bom é código que outros desenvolvedores
 * (incluindo você no futuro) conseguem entender e modificar
 * facilmente.
 * 
 * Professor: A jornada de aprendizado nunca termina.
 * Continue praticando, questionando e melhorando suas
 * habilidades. A excelência vem da prática consistente
 * e da busca constante por conhecimento.
 */