/*
===========================================
    MÓDULO 09 - ES6+ (ECMASCRIPT 2015+)
    Aula 03: Módulos, Import e Export
===========================================

Objetivos de Aprendizagem:
✓ Dominar sistema de módulos ES6
✓ Usar import e export efetivamente
✓ Organizar código em módulos
✓ Implementar padrões de módulos
✓ Gerenciar dependências
✓ Otimizar carregamento de módulos

NOTA IMPORTANTE:
================
Este arquivo demonstra conceitos de módulos ES6, mas para executar
os exemplos práticos, você precisará:

1. Usar um bundler (Webpack, Vite, Rollup)
2. Configurar package.json com "type": "module"
3. Usar extensão .mjs
4. Servir via HTTP server (não file://)

Os exemplos aqui são educacionais e mostram a sintaxe correta.
*/

// ===========================================
// 1. TEORIA: SISTEMA DE MÓDULOS ES6
// ===========================================

/*
SISTEMA DE MÓDULOS ES6:

1. CONCEITOS:
   - Cada arquivo é um módulo
   - Escopo isolado por padrão
   - Import/export explícitos
   - Carregamento assíncrono
   - Análise estática

2. TIPOS DE EXPORT:
   - Named exports: export { name }
   - Default export: export default value
   - Re-exports: export { name } from './module'
   - Export all: export * from './module'

3. TIPOS DE IMPORT:
   - Named imports: import { name } from './module'
   - Default import: import name from './module'
   - Namespace import: import * as name from './module'
   - Dynamic import: import('./module')

4. CARACTERÍSTICAS:
   - Hoisting de imports
   - Binding ao vivo
   - Circular dependencies
   - Tree shaking
*/

console.log('=== SISTEMA DE MÓDULOS ES6 ===');

// ===========================================
// 2. EXEMPLOS DE EXPORT
// ===========================================

/*
--- ARQUIVO: utils/math.js ---

// === NAMED EXPORTS ===
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

// Export após declaração
function subtract(a, b) {
    return a - b;
}

function divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
}

export { subtract, divide };

// Export com renomeação
function power(base, exponent) {
    return Math.pow(base, exponent);
}

export { power as pow };

// === DEFAULT EXPORT ===
class Calculator {
    constructor() {
        this.history = [];
    }
    
    calculate(operation, a, b) {
        let result;
        
        switch (operation) {
            case 'add':
                result = add(a, b);
                break;
            case 'subtract':
                result = subtract(a, b);
                break;
            case 'multiply':
                result = multiply(a, b);
                break;
            case 'divide':
                result = divide(a, b);
                break;
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
        
        this.history.push({ operation, a, b, result });
        return result;
    }
    
    getHistory() {
        return [...this.history];
    }
    
    clearHistory() {
        this.history = [];
    }
}

export default Calculator;

--- FIM DO ARQUIVO math.js ---
*/

// ===========================================
// 3. EXEMPLOS DE IMPORT
// ===========================================

/*
--- ARQUIVO: app.js ---

// === NAMED IMPORTS ===
import { PI, E, add, multiply } from './utils/math.js';

// Import com renomeação
import { subtract as sub, divide as div } from './utils/math.js';

// Import de default
import Calculator from './utils/math.js';

// Import misto (default + named)
import Calculator, { PI, add } from './utils/math.js';

// Namespace import
import * as MathUtils from './utils/math.js';

// Uso dos imports
console.log('PI:', PI);
console.log('E:', E);
console.log('2 + 3 =', add(2, 3));
console.log('4 * 5 =', multiply(4, 5));
console.log('10 - 3 =', sub(10, 3));
console.log('15 / 3 =', div(15, 3));

const calc = new Calculator();
console.log('Calculator result:', calc.calculate('add', 10, 5));

// Usando namespace
console.log('Using namespace:', MathUtils.add(1, 2));
console.log('Constants:', MathUtils.PI, MathUtils.E);

--- FIM DO ARQUIVO app.js ---
*/

// ===========================================
// 4. SIMULAÇÃO DE MÓDULOS (PARA DEMONSTRAÇÃO)
// ===========================================

console.log('\n--- Simulação de Sistema de Módulos ---');

// Simulando um sistema de módulos para demonstração
class ModuleSystem {
    constructor() {
        this.modules = new Map();
        this.cache = new Map();
    }
    
    // Simular definição de módulo
    define(name, factory) {
        this.modules.set(name, factory);
    }
    
    // Simular importação de módulo
    import(name) {
        if (this.cache.has(name)) {
            return this.cache.get(name);
        }
        
        const factory = this.modules.get(name);
        if (!factory) {
            throw new Error(`Module '${name}' not found`);
        }
        
        const moduleExports = {};
        const moduleContext = {
            exports: moduleExports,
            require: (depName) => this.import(depName)
        };
        
        factory.call(null, moduleContext);
        
        this.cache.set(name, moduleExports);
        return moduleExports;
    }
    
    // Limpar cache
    clearCache() {
        this.cache.clear();
    }
    
    // Listar módulos
    listModules() {
        return Array.from(this.modules.keys());
    }
}

// Instância global do sistema de módulos
const moduleSystem = new ModuleSystem();

// ===========================================
// 5. EXEMPLOS PRÁTICOS DE MÓDULOS
// ===========================================

// --- 5.1 Módulo de Utilitários ---
moduleSystem.define('utils/string', function(module) {
    // Funções de string
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    function camelCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    }
    
    function kebabCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    }
    
    function truncate(str, length, suffix = '...') {
        if (str.length <= length) return str;
        return str.substring(0, length - suffix.length) + suffix;
    }
    
    function slugify(str) {
        return str
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Exports
    module.exports = {
        capitalize,
        camelCase,
        kebabCase,
        truncate,
        slugify
    };
});

// --- 5.2 Módulo de Validação ---
moduleSystem.define('utils/validation', function(module) {
    const stringUtils = module.require('utils/string');
    
    // Validadores
    const validators = {
        email: (value) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        },
        
        phone: (value) => {
            const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
            return regex.test(value);
        },
        
        cpf: (value) => {
            const cpf = value.replace(/[^\d]/g, '');
            if (cpf.length !== 11) return false;
            
            // Verificar dígitos verificadores
            let sum = 0;
            for (let i = 0; i < 9; i++) {
                sum += parseInt(cpf.charAt(i)) * (10 - i);
            }
            
            let digit = 11 - (sum % 11);
            if (digit === 10 || digit === 11) digit = 0;
            if (digit !== parseInt(cpf.charAt(9))) return false;
            
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf.charAt(i)) * (11 - i);
            }
            
            digit = 11 - (sum % 11);
            if (digit === 10 || digit === 11) digit = 0;
            return digit === parseInt(cpf.charAt(10));
        },
        
        url: (value) => {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },
        
        strongPassword: (value) => {
            // Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return regex.test(value);
        }
    };
    
    // Classe de validação
    class Validator {
        constructor() {
            this.rules = {};
            this.errors = {};
        }
        
        addRule(field, validatorName, message) {
            if (!this.rules[field]) {
                this.rules[field] = [];
            }
            
            this.rules[field].push({
                validator: validators[validatorName],
                message: message || `${field} is invalid`
            });
            
            return this;
        }
        
        validate(data) {
            this.errors = {};
            let isValid = true;
            
            for (const [field, rules] of Object.entries(this.rules)) {
                const value = data[field];
                
                for (const rule of rules) {
                    if (!rule.validator(value)) {
                        if (!this.errors[field]) {
                            this.errors[field] = [];
                        }
                        this.errors[field].push(rule.message);
                        isValid = false;
                    }
                }
            }
            
            return isValid;
        }
        
        getErrors() {
            return { ...this.errors };
        }
        
        getFirstError(field) {
            return this.errors[field]?.[0] || null;
        }
    }
    
    // Exports
    module.exports = {
        validators,
        Validator,
        // Função de conveniência
        validate: (value, type) => validators[type]?.(value) || false
    };
});

// --- 5.3 Módulo de HTTP Client ---
moduleSystem.define('utils/http', function(module) {
    const validation = module.require('utils/validation');
    
    class HttpClient {
        constructor(baseURL = '', options = {}) {
            this.baseURL = baseURL;
            this.defaultOptions = {
                timeout: 5000,
                headers: {
                    'Content-Type': 'application/json'
                },
                ...options
            };
            this.interceptors = {
                request: [],
                response: []
            };
        }
        
        // Adicionar interceptador de request
        addRequestInterceptor(interceptor) {
            this.interceptors.request.push(interceptor);
        }
        
        // Adicionar interceptador de response
        addResponseInterceptor(interceptor) {
            this.interceptors.response.push(interceptor);
        }
        
        // Processar interceptadores de request
        async processRequestInterceptors(config) {
            let processedConfig = { ...config };
            
            for (const interceptor of this.interceptors.request) {
                processedConfig = await interceptor(processedConfig);
            }
            
            return processedConfig;
        }
        
        // Processar interceptadores de response
        async processResponseInterceptors(response) {
            let processedResponse = response;
            
            for (const interceptor of this.interceptors.response) {
                processedResponse = await interceptor(processedResponse);
            }
            
            return processedResponse;
        }
        
        // Fazer requisição
        async request(url, options = {}) {
            // Validar URL
            const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
            
            if (!validation.validate(fullURL, 'url')) {
                throw new Error(`Invalid URL: ${fullURL}`);
            }
            
            // Configuração da requisição
            let config = {
                ...this.defaultOptions,
                ...options,
                headers: {
                    ...this.defaultOptions.headers,
                    ...options.headers
                }
            };
            
            // Processar interceptadores de request
            config = await this.processRequestInterceptors(config);
            
            try {
                // Simular requisição (em ambiente real, usaria fetch)
                const response = await this.simulateRequest(fullURL, config);
                
                // Processar interceptadores de response
                return await this.processResponseInterceptors(response);
            } catch (error) {
                throw new Error(`Request failed: ${error.message}`);
            }
        }
        
        // Simular requisição para demonstração
        async simulateRequest(url, config) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        status: 200,
                        statusText: 'OK',
                        url,
                        data: {
                            message: 'Simulated response',
                            method: config.method || 'GET',
                            timestamp: new Date().toISOString()
                        },
                        headers: {
                            'content-type': 'application/json'
                        }
                    });
                }, 100);
            });
        }
        
        // Métodos de conveniência
        get(url, options = {}) {
            return this.request(url, { ...options, method: 'GET' });
        }
        
        post(url, data, options = {}) {
            return this.request(url, {
                ...options,
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
        
        put(url, data, options = {}) {
            return this.request(url, {
                ...options,
                method: 'PUT',
                body: JSON.stringify(data)
            });
        }
        
        delete(url, options = {}) {
            return this.request(url, { ...options, method: 'DELETE' });
        }
    }
    
    // Factory function
    function createClient(baseURL, options) {
        return new HttpClient(baseURL, options);
    }
    
    // Exports
    module.exports = {
        HttpClient,
        createClient,
        // Cliente padrão
        default: new HttpClient()
    };
});

// --- 5.4 Módulo de Estado (State Management) ---
moduleSystem.define('utils/state', function(module) {
    class StateManager {
        constructor(initialState = {}) {
            this.state = { ...initialState };
            this.listeners = new Set();
            this.middleware = [];
            this.history = [];
            this.maxHistorySize = 50;
        }
        
        // Adicionar middleware
        use(middleware) {
            this.middleware.push(middleware);
        }
        
        // Adicionar listener
        subscribe(listener) {
            this.listeners.add(listener);
            
            // Retornar função de unsubscribe
            return () => {
                this.listeners.delete(listener);
            };
        }
        
        // Obter estado atual
        getState() {
            return { ...this.state };
        }
        
        // Atualizar estado
        setState(updates, action = 'UPDATE') {
            const prevState = { ...this.state };
            const newState = { ...this.state, ...updates };
            
            // Processar middleware
            let processedState = newState;
            for (const middleware of this.middleware) {
                processedState = middleware(processedState, prevState, action);
            }
            
            // Atualizar estado
            this.state = processedState;
            
            // Adicionar ao histórico
            this.addToHistory(prevState, this.state, action);
            
            // Notificar listeners
            this.notifyListeners(this.state, prevState, action);
        }
        
        // Adicionar ao histórico
        addToHistory(prevState, newState, action) {
            this.history.push({
                timestamp: Date.now(),
                action,
                prevState: { ...prevState },
                newState: { ...newState }
            });
            
            // Limitar tamanho do histórico
            if (this.history.length > this.maxHistorySize) {
                this.history.shift();
            }
        }
        
        // Notificar listeners
        notifyListeners(newState, prevState, action) {
            for (const listener of this.listeners) {
                try {
                    listener(newState, prevState, action);
                } catch (error) {
                    console.error('Error in state listener:', error);
                }
            }
        }
        
        // Obter histórico
        getHistory() {
            return [...this.history];
        }
        
        // Resetar estado
        reset(newState = {}) {
            this.setState(newState, 'RESET');
        }
        
        // Desfazer última ação
        undo() {
            if (this.history.length > 0) {
                const lastEntry = this.history[this.history.length - 1];
                this.state = { ...lastEntry.prevState };
                this.history.pop();
                this.notifyListeners(this.state, lastEntry.newState, 'UNDO');
            }
        }
    }
    
    // Factory function
    function createStore(initialState, middleware = []) {
        const store = new StateManager(initialState);
        middleware.forEach(mw => store.use(mw));
        return store;
    }
    
    // Middleware comum
    const middleware = {
        logger: (newState, prevState, action) => {
            console.log(`[STATE] ${action}:`, {
                prev: prevState,
                new: newState
            });
            return newState;
        },
        
        validator: (schema) => (newState, prevState, action) => {
            // Validação simples
            for (const [key, validator] of Object.entries(schema)) {
                if (newState[key] !== undefined && !validator(newState[key])) {
                    console.warn(`Invalid value for ${key}:`, newState[key]);
                    return prevState; // Rejeitar mudança
                }
            }
            return newState;
        },
        
        persistence: (key) => (newState, prevState, action) => {
            try {
                localStorage.setItem(key, JSON.stringify(newState));
            } catch (error) {
                console.warn('Failed to persist state:', error);
            }
            return newState;
        }
    };
    
    // Exports
    module.exports = {
        StateManager,
        createStore,
        middleware
    };
});

// ===========================================
// 6. DEMONSTRAÇÃO DO SISTEMA DE MÓDULOS
// ===========================================

function demonstrarSistemaModulos() {
    console.log('\n--- Demonstração do Sistema de Módulos ---');
    
    // === USAR MÓDULO DE STRING ===
    console.log('\n🔤 Testando módulo de string:');
    const stringUtils = moduleSystem.import('utils/string');
    
    const texto = 'hello world example';
    console.log('Original:', texto);
    console.log('Capitalize:', stringUtils.capitalize(texto));
    console.log('CamelCase:', stringUtils.camelCase(texto));
    console.log('KebabCase:', stringUtils.kebabCase(texto));
    console.log('Truncate:', stringUtils.truncate(texto, 10));
    console.log('Slugify:', stringUtils.slugify('Hello World! @#$ Example'));
    
    // === USAR MÓDULO DE VALIDAÇÃO ===
    console.log('\n✅ Testando módulo de validação:');
    const { Validator, validate } = moduleSystem.import('utils/validation');
    
    // Validações simples
    console.log('Email válido:', validate('user@example.com', 'email'));
    console.log('Email inválido:', validate('invalid-email', 'email'));
    console.log('Telefone válido:', validate('(11) 99999-9999', 'phone'));
    console.log('URL válida:', validate('https://example.com', 'url'));
    
    // Validador complexo
    const validator = new Validator()
        .addRule('email', 'email', 'Email deve ser válido')
        .addRule('phone', 'phone', 'Telefone deve ser válido')
        .addRule('password', 'strongPassword', 'Senha deve ser forte');
    
    const userData = {
        email: 'user@example.com',
        phone: '11999999999',
        password: 'WeakPass'
    };
    
    const isValid = validator.validate(userData);
    console.log('Dados válidos:', isValid);
    if (!isValid) {
        console.log('Erros:', validator.getErrors());
    }
    
    // === USAR MÓDULO HTTP ===
    console.log('\n🌐 Testando módulo HTTP:');
    const { createClient } = moduleSystem.import('utils/http');
    
    const httpClient = createClient('https://api.example.com');
    
    // Adicionar interceptadores
    httpClient.addRequestInterceptor(async (config) => {
        console.log('🔄 Request interceptor:', config.method || 'GET', config);
        return config;
    });
    
    httpClient.addResponseInterceptor(async (response) => {
        console.log('📥 Response interceptor:', response.status, response.data);
        return response;
    });
    
    // Fazer requisições (simuladas)
    httpClient.get('/users')
        .then(response => {
            console.log('GET Response:', response.data);
        })
        .catch(error => {
            console.error('GET Error:', error.message);
        });
    
    httpClient.post('/users', { name: 'João', email: 'joao@example.com' })
        .then(response => {
            console.log('POST Response:', response.data);
        })
        .catch(error => {
            console.error('POST Error:', error.message);
        });
    
    // === USAR MÓDULO DE ESTADO ===
    console.log('\n🗃️ Testando módulo de estado:');
    const { createStore, middleware } = moduleSystem.import('utils/state');
    
    // Criar store com middleware
    const store = createStore(
        { count: 0, user: null },
        [
            middleware.logger,
            middleware.validator({
                count: (value) => typeof value === 'number' && value >= 0
            })
        ]
    );
    
    // Adicionar listener
    const unsubscribe = store.subscribe((newState, prevState, action) => {
        console.log(`📢 State changed (${action}):`, {
            from: prevState.count,
            to: newState.count
        });
    });
    
    // Atualizar estado
    store.setState({ count: 1 }, 'INCREMENT');
    store.setState({ count: 2 }, 'INCREMENT');
    store.setState({ user: { name: 'Maria', id: 1 } }, 'SET_USER');
    
    // Tentar valor inválido
    store.setState({ count: -1 }, 'INVALID_UPDATE');
    
    console.log('Estado final:', store.getState());
    console.log('Histórico:', store.getHistory().length, 'entradas');
    
    // Desfazer
    store.undo();
    console.log('Após undo:', store.getState());
    
    // Limpar listener
    unsubscribe();
}

// Executar demonstração
setTimeout(demonstrarSistemaModulos, 1000);

// ===========================================
// 7. PADRÕES AVANÇADOS DE MÓDULOS
// ===========================================

console.log('\n=== PADRÕES AVANÇADOS ===');

// --- 7.1 Module Factory Pattern ---
moduleSystem.define('patterns/factory', function(module) {
    // Factory para criar diferentes tipos de loggers
    function createLogger(type, options = {}) {
        const loggers = {
            console: {
                log: (message) => console.log(`[LOG] ${message}`),
                error: (message) => console.error(`[ERROR] ${message}`),
                warn: (message) => console.warn(`[WARN] ${message}`)
            },
            
            file: {
                log: (message) => console.log(`[FILE LOG] ${message}`),
                error: (message) => console.log(`[FILE ERROR] ${message}`),
                warn: (message) => console.log(`[FILE WARN] ${message}`)
            },
            
            remote: {
                log: (message) => console.log(`[REMOTE LOG] ${message}`),
                error: (message) => console.log(`[REMOTE ERROR] ${message}`),
                warn: (message) => console.log(`[REMOTE WARN] ${message}`)
            }
        };
        
        const logger = loggers[type];
        if (!logger) {
            throw new Error(`Logger type '${type}' not supported`);
        }
        
        // Adicionar timestamp se solicitado
        if (options.timestamp) {
            const originalLog = logger.log;
            const originalError = logger.error;
            const originalWarn = logger.warn;
            
            logger.log = (message) => originalLog(`${new Date().toISOString()} ${message}`);
            logger.error = (message) => originalError(`${new Date().toISOString()} ${message}`);
            logger.warn = (message) => originalWarn(`${new Date().toISOString()} ${message}`);
        }
        
        return logger;
    }
    
    module.exports = {
        createLogger
    };
});

// --- 7.2 Singleton Pattern ---
moduleSystem.define('patterns/singleton', function(module) {
    // Singleton para configuração global
    let instance = null;
    
    class ConfigSingleton {
        constructor() {
            if (instance) {
                return instance;
            }
            
            this.config = {
                apiUrl: 'https://api.default.com',
                timeout: 5000,
                retries: 3
            };
            
            instance = this;
            return instance;
        }
        
        get(key) {
            return this.config[key];
        }
        
        set(key, value) {
            this.config[key] = value;
        }
        
        getAll() {
            return { ...this.config };
        }
        
        reset() {
            this.config = {
                apiUrl: 'https://api.default.com',
                timeout: 5000,
                retries: 3
            };
        }
    }
    
    // Exportar instância única
    module.exports = new ConfigSingleton();
});

// --- 7.3 Observer Pattern ---
moduleSystem.define('patterns/observer', function(module) {
    class EventEmitter {
        constructor() {
            this.events = new Map();
        }
        
        on(event, listener) {
            if (!this.events.has(event)) {
                this.events.set(event, new Set());
            }
            this.events.get(event).add(listener);
        }
        
        off(event, listener) {
            if (this.events.has(event)) {
                this.events.get(event).delete(listener);
            }
        }
        
        emit(event, ...args) {
            if (this.events.has(event)) {
                for (const listener of this.events.get(event)) {
                    try {
                        listener(...args);
                    } catch (error) {
                        console.error(`Error in event listener for '${event}':`, error);
                    }
                }
            }
        }
        
        once(event, listener) {
            const onceListener = (...args) => {
                listener(...args);
                this.off(event, onceListener);
            };
            this.on(event, onceListener);
        }
        
        listenerCount(event) {
            return this.events.has(event) ? this.events.get(event).size : 0;
        }
        
        eventNames() {
            return Array.from(this.events.keys());
        }
    }
    
    // Instância global
    const globalEmitter = new EventEmitter();
    
    module.exports = {
        EventEmitter,
        global: globalEmitter
    };
});

// --- 7.4 Demonstração dos Padrões ---
function demonstrarPadroes() {
    console.log('\n--- Demonstração de Padrões ---');
    
    // === FACTORY PATTERN ===
    console.log('\n🏭 Factory Pattern:');
    const { createLogger } = moduleSystem.import('patterns/factory');
    
    const consoleLogger = createLogger('console', { timestamp: true });
    const fileLogger = createLogger('file');
    
    consoleLogger.log('Mensagem do console logger');
    fileLogger.error('Erro do file logger');
    
    // === SINGLETON PATTERN ===
    console.log('\n🔒 Singleton Pattern:');
    const config1 = moduleSystem.import('patterns/singleton');
    const config2 = moduleSystem.import('patterns/singleton');
    
    console.log('São a mesma instância:', config1 === config2);
    
    config1.set('apiUrl', 'https://api.custom.com');
    console.log('Config 1 apiUrl:', config1.get('apiUrl'));
    console.log('Config 2 apiUrl:', config2.get('apiUrl'));
    
    // === OBSERVER PATTERN ===
    console.log('\n👁️ Observer Pattern:');
    const { EventEmitter, global } = moduleSystem.import('patterns/observer');
    
    // Criar emitter local
    const emitter = new EventEmitter();
    
    // Adicionar listeners
    emitter.on('user:login', (user) => {
        console.log(`Usuário ${user.name} fez login`);
    });
    
    emitter.on('user:login', (user) => {
        console.log(`Registrando atividade para ${user.name}`);
    });
    
    emitter.once('user:logout', (user) => {
        console.log(`${user.name} fez logout (evento único)`);
    });
    
    // Emitir eventos
    emitter.emit('user:login', { name: 'João', id: 1 });
    emitter.emit('user:logout', { name: 'João', id: 1 });
    emitter.emit('user:logout', { name: 'João', id: 1 }); // Não será executado
    
    console.log('Eventos registrados:', emitter.eventNames());
    console.log('Listeners para user:login:', emitter.listenerCount('user:login'));
}

setTimeout(demonstrarPadroes, 3000);

// ===========================================
// 8. DYNAMIC IMPORTS E LAZY LOADING
// ===========================================

console.log('\n=== DYNAMIC IMPORTS ===');

// Simulação de dynamic imports
class DynamicModuleLoader {
    constructor() {
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
    }
    
    // Simular import dinâmico
    async import(moduleName) {
        // Se já está carregado, retornar do cache
        if (this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }
        
        // Se está sendo carregado, aguardar
        if (this.loadingPromises.has(moduleName)) {
            return this.loadingPromises.get(moduleName);
        }
        
        // Simular carregamento assíncrono
        const loadingPromise = this.loadModule(moduleName);
        this.loadingPromises.set(moduleName, loadingPromise);
        
        try {
            const module = await loadingPromise;
            this.loadedModules.set(moduleName, module);
            this.loadingPromises.delete(moduleName);
            return module;
        } catch (error) {
            this.loadingPromises.delete(moduleName);
            throw error;
        }
    }
    
    // Simular carregamento de módulo
    async loadModule(moduleName) {
        console.log(`🔄 Carregando módulo: ${moduleName}`);
        
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Módulos simulados
        const modules = {
            'charts': {
                createChart: (type, data) => {
                    return {
                        type,
                        data,
                        render: () => console.log(`Renderizando gráfico ${type} com ${data.length} pontos`)
                    };
                },
                ChartTypes: {
                    LINE: 'line',
                    BAR: 'bar',
                    PIE: 'pie'
                }
            },
            
            'pdf': {
                generatePDF: (content) => {
                    return {
                        content,
                        save: (filename) => console.log(`PDF salvo como: ${filename}`),
                        print: () => console.log('Imprimindo PDF...')
                    };
                }
            },
            
            'analytics': {
                track: (event, data) => {
                    console.log(`📊 Tracking: ${event}`, data);
                },
                identify: (userId, traits) => {
                    console.log(`👤 Identify: ${userId}`, traits);
                }
            }
        };
        
        const module = modules[moduleName];
        if (!module) {
            throw new Error(`Módulo '${moduleName}' não encontrado`);
        }
        
        console.log(`✅ Módulo carregado: ${moduleName}`);
        return module;
    }
    
    // Pré-carregar módulos
    async preload(moduleNames) {
        const promises = moduleNames.map(name => this.import(name));
        return Promise.all(promises);
    }
    
    // Limpar cache
    clearCache() {
        this.loadedModules.clear();
    }
    
    // Estatísticas
    getStats() {
        return {
            loaded: Array.from(this.loadedModules.keys()),
            loading: Array.from(this.loadingPromises.keys()),
            totalLoaded: this.loadedModules.size
        };
    }
}

// Instância global do loader
const dynamicLoader = new DynamicModuleLoader();

// Demonstração de dynamic imports
function demonstrarDynamicImports() {
    console.log('\n--- Dynamic Imports ---');
    
    // === CARREGAMENTO SOB DEMANDA ===
    async function criarGrafico() {
        try {
            console.log('\n📊 Criando gráfico...');
            const charts = await dynamicLoader.import('charts');
            
            const data = [10, 20, 30, 40, 50];
            const chart = charts.createChart(charts.ChartTypes.LINE, data);
            chart.render();
            
        } catch (error) {
            console.error('Erro ao carregar módulo de gráficos:', error);
        }
    }
    
    async function gerarRelatorio() {
        try {
            console.log('\n📄 Gerando relatório...');
            const pdf = await dynamicLoader.import('pdf');
            
            const relatorio = pdf.generatePDF('Conteúdo do relatório');
            relatorio.save('relatorio.pdf');
            
        } catch (error) {
            console.error('Erro ao carregar módulo PDF:', error);
        }
    }
    
    async function rastrearEvento() {
        try {
            console.log('\n📈 Rastreando evento...');
            const analytics = await dynamicLoader.import('analytics');
            
            analytics.identify('user123', { name: 'João', plan: 'premium' });
            analytics.track('button_click', { button: 'save', page: 'dashboard' });
            
        } catch (error) {
            console.error('Erro ao carregar módulo de analytics:', error);
        }
    }
    
    // Executar exemplos
    criarGrafico();
    
    setTimeout(() => {
        gerarRelatorio();
        rastrearEvento();
        
        // Mostrar estatísticas
        setTimeout(() => {
            console.log('\n📊 Estatísticas do loader:', dynamicLoader.getStats());
        }, 1000);
    }, 600);
    
    // === PRÉ-CARREGAMENTO ===
    setTimeout(async () => {
        console.log('\n🚀 Pré-carregando módulos...');
        
        try {
            await dynamicLoader.preload(['charts', 'pdf']);
            console.log('✅ Módulos pré-carregados com sucesso');
            
            // Usar módulo já carregado (instantâneo)
            const charts = await dynamicLoader.import('charts');
            console.log('📊 Usando módulo já carregado:', Object.keys(charts));
            
        } catch (error) {
            console.error('Erro no pré-carregamento:', error);
        }
    }, 2000);
}

setTimeout(demonstrarDynamicImports, 5000);

// ===========================================
// 9. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasModulos = {
    organizacao: {
        estrutura: `
            // ✅ Boa estrutura de módulos
            src/
            ├── components/
            │   ├── Button/
            │   │   ├── index.js
            │   │   ├── Button.js
            │   │   └── Button.css
            │   └── Modal/
            ├── utils/
            │   ├── string.js
            │   ├── validation.js
            │   └── http.js
            ├── services/
            │   ├── api.js
            │   └── auth.js
            └── main.js
        `,
        
        nomeacao: `
            // ✅ Bom - Nomes descritivos
            import { validateEmail } from './utils/validation.js';
            import { ApiClient } from './services/api.js';
            
            // ❌ Evitar - Nomes genéricos
            import { helper } from './utils.js';
            import { thing } from './stuff.js';
        `
    },
    
    performance: {
        treeShaking: `
            // ✅ Bom - Named exports para tree shaking
            export const add = (a, b) => a + b;
            export const multiply = (a, b) => a * b;
            
            // Import específico
            import { add } from './math.js'; // Só importa add
            
            // ❌ Evitar - Import de tudo
            import * as math from './math.js'; // Importa tudo
        `,
        
        lazyLoading: `
            // ✅ Bom - Lazy loading para módulos grandes
            async function loadCharts() {
                const { Chart } = await import('./charts.js');
                return new Chart();
            }
            
            // ✅ Bom - Conditional loading
            if (user.isPremium) {
                const { PremiumFeatures } = await import('./premium.js');
                // Usar features premium
            }
        `
    },
    
    seguranca: {
        validacao: `
            // ✅ Bom - Validar imports
            export function createUser(data) {
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid user data');
                }
                // Processar dados
            }
            
            // ✅ Bom - Sanitizar exports
            const sensitiveData = 'secret';
            export const publicAPI = {
                // Só exportar o que é necessário
                createUser,
                validateUser
            };
        `
    }
};

// ===========================================
// 10. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasModulos = {
    documentacao: [
        'MDN - Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules',
        'MDN - Import: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import',
        'MDN - Export: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export',
        'Dynamic imports: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports'
    ],
    
    ferramentas: [
        'Webpack: https://webpack.js.org/',
        'Vite: https://vitejs.dev/',
        'Rollup: https://rollupjs.org/',
        'Parcel: https://parceljs.org/'
    ],
    
    proximosTopicos: [
        '04-novas-features.js - Arrow functions, classes, symbols, etc.',
        'Bundlers e build tools',
        'Module federation',
        'Micro frontends'
    ],
    
    exerciciosAdicionais: [
        'Criar sistema de plugins modular',
        'Implementar module registry',
        'Desenvolver lazy loading router',
        'Construir sistema de temas modular'
    ]
};

console.log('Documentação:', referenciasModulos.documentacao);
console.log('Ferramentas:', referenciasModulos.ferramentas);
console.log('Próximos tópicos:', referenciasModulos.proximosTopicos);
console.log('Exercícios adicionais:', referenciasModulos.exerciciosAdicionais);

setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 AULA 03 - MÓDULOS, IMPORT E EXPORT CONCLUÍDA!');
    console.log('='.repeat(50));
    
    console.log('\n📚 CONCEITOS APRENDIDOS:');
    console.log('✓ Sistema de módulos ES6');
    console.log('✓ Named e default exports/imports');
    console.log('✓ Dynamic imports e lazy loading');
    console.log('✓ Padrões de módulos (Factory, Singleton, Observer)');
    console.log('✓ Organização de código modular');
    console.log('✓ Otimização e tree shaking');
    
    console.log('\n🛠️ TÉCNICAS DOMINADAS:');
    console.log('✓ Criação de módulos reutilizáveis');
    console.log('✓ Gerenciamento de dependências');
    console.log('✓ Carregamento condicional');
    console.log('✓ Interceptadores e middleware');
    console.log('✓ State management modular');
    
    console.log('\n🚀 PRÓXIMA AULA:');
    console.log('🔜 04-novas-features.js');
    console.log('   - Arrow functions');
    console.log('   - Classes ES6');
    console.log('   - Symbols e iterators');
    console.log('   - Outras features modernas');
    
    console.log('\n' + '='.repeat(50));
}, 10000);

/*
===========================================
    FIM DA AULA 03 - MÓDULOS, IMPORT E EXPORT
===========================================

PARABÉNS! 🎉

Você dominou o sistema de módulos do JavaScript moderno!

Esta aula cobriu:
- Sistema de módulos ES6
- Import e export (named, default, dynamic)
- Padrões de design com módulos
- Lazy loading e otimização
- Organização de código

Continue para a próxima aula para aprender sobre
outras features importantes do ES6+! 🚀

===========================================
*/