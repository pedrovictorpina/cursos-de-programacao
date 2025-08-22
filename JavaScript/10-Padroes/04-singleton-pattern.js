/**
 * MÓDULO 10: PADRÕES DE DESIGN EM JAVASCRIPT
 * Arquivo 04: Singleton Pattern
 * 
 * O Singleton Pattern garante que uma classe tenha apenas uma instância
 * e fornece um ponto de acesso global a essa instância.
 * 
 * Professor: Este é um dos padrões mais conhecidos, mas também um dos
 * mais controversos. Vamos explorar suas implementações, usos apropriados
 * e alternativas modernas.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender o conceito e propósito do Singleton
2. Implementar diferentes variações do padrão
3. Identificar casos de uso apropriados
4. Reconhecer problemas e limitações
5. Explorar alternativas modernas
*/

// ==========================================
// TEORIA: SINGLETON PATTERN
// ==========================================

/*
CONCEITO:
O Singleton é um padrão criacional que garante que uma classe
tenha apenas uma instância e fornece acesso global a ela.

CARACTERÍSTICAS:
- Única instância da classe
- Acesso global controlado
- Lazy initialization (opcional)
- Thread-safe (em ambientes multi-thread)

BENEFÍCIOS:
- Controle sobre instanciação
- Economia de recursos
- Ponto de acesso global
- Inicialização tardia

PROBLEMAS:
- Viola Single Responsibility Principle
- Dificulta testes unitários
- Cria dependências ocultas
- Pode ser considerado anti-pattern

USOS APROPRIADOS:
- Configurações globais
- Conexões de banco de dados
- Loggers
- Cache global
- Gerenciadores de estado

ALTERNATIVAS MODERNAS:
- Dependency Injection
- Module Pattern
- ES6 Modules
- Context API (React)
- Stores (Redux, Vuex)
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. SINGLETON BÁSICO (EAGER INITIALIZATION)
console.log('\n=== 1. Singleton Básico ===');

class BasicSingleton {
    constructor() {
        // Verificar se já existe uma instância
        if (BasicSingleton.instance) {
            console.log('⚠️ Tentativa de criar nova instância - retornando existente');
            return BasicSingleton.instance;
        }
        
        // Inicializar propriedades
        this.id = Math.random().toString(36).substr(2, 9);
        this.createdAt = new Date();
        this.data = {};
        this.accessCount = 0;
        
        // Armazenar a instância
        BasicSingleton.instance = this;
        
        console.log(`✅ Singleton criado: ${this.id}`);
    }
    
    static getInstance() {
        if (!BasicSingleton.instance) {
            BasicSingleton.instance = new BasicSingleton();
        }
        
        BasicSingleton.instance.accessCount++;
        return BasicSingleton.instance;
    }
    
    setData(key, value) {
        this.data[key] = value;
        console.log(`📝 Dados atualizados: ${key} = ${value}`);
    }
    
    getData(key) {
        return this.data[key];
    }
    
    getInfo() {
        return {
            id: this.id,
            createdAt: this.createdAt,
            accessCount: this.accessCount,
            dataKeys: Object.keys(this.data)
        };
    }
    
    // Método para reset (útil em testes)
    static reset() {
        BasicSingleton.instance = null;
        console.log('🔄 Singleton resetado');
    }
}

// Testando Singleton Básico
const singleton1 = new BasicSingleton();
const singleton2 = new BasicSingleton();
const singleton3 = BasicSingleton.getInstance();

console.log('São a mesma instância?', singleton1 === singleton2); // true
console.log('São a mesma instância?', singleton1 === singleton3); // true

singleton1.setData('user', 'João');
singleton1.setData('theme', 'dark');

console.log('Dados do singleton2:', singleton2.getData('user')); // João
console.log('Info:', singleton3.getInfo());

// 2. SINGLETON COM LAZY INITIALIZATION
console.log('\n=== 2. Singleton Lazy ===');

class LazySingleton {
    constructor() {
        if (LazySingleton.instance) {
            return LazySingleton.instance;
        }
        
        this.id = Math.random().toString(36).substr(2, 9);
        this.initialized = false;
        this.config = null;
        
        LazySingleton.instance = this;
        console.log(`💤 Lazy Singleton criado: ${this.id}`);
    }
    
    static getInstance() {
        if (!LazySingleton.instance) {
            LazySingleton.instance = new LazySingleton();
        }
        return LazySingleton.instance;
    }
    
    // Inicialização pesada só quando necessário
    initialize(config = {}) {
        if (this.initialized) {
            console.log('⚠️ Já inicializado');
            return this;
        }
        
        console.log('🚀 Inicializando recursos pesados...');
        
        // Simular inicialização pesada
        this.config = {
            database: config.database || 'default_db',
            cache: config.cache || 'memory',
            logging: config.logging || true,
            ...config
        };
        
        this.connections = {
            database: this.connectDatabase(),
            cache: this.connectCache(),
            logger: this.initLogger()
        };
        
        this.initialized = true;
        console.log('✅ Inicialização completa');
        
        return this;
    }
    
    connectDatabase() {
        console.log(`🗄️ Conectando ao banco: ${this.config.database}`);
        return {
            type: this.config.database,
            connected: true,
            connectionId: Math.random().toString(36).substr(2, 9)
        };
    }
    
    connectCache() {
        console.log(`💾 Conectando ao cache: ${this.config.cache}`);
        return {
            type: this.config.cache,
            connected: true,
            size: 0
        };
    }
    
    initLogger() {
        console.log(`📋 Inicializando logger: ${this.config.logging}`);
        return {
            enabled: this.config.logging,
            level: 'info',
            logs: []
        };
    }
    
    getConnection(type) {
        if (!this.initialized) {
            throw new Error('Singleton não foi inicializado. Chame initialize() primeiro.');
        }
        
        return this.connections[type];
    }
    
    isReady() {
        return this.initialized;
    }
    
    static reset() {
        LazySingleton.instance = null;
    }
}

// Testando Lazy Singleton
const lazy1 = LazySingleton.getInstance();
console.log('Está pronto?', lazy1.isReady()); // false

// Inicializar quando necessário
lazy1.initialize({
    database: 'postgresql',
    cache: 'redis',
    logging: true
});

console.log('Está pronto?', lazy1.isReady()); // true
console.log('Conexão DB:', lazy1.getConnection('database'));

// 3. SINGLETON COM CLOSURE (IIFE)
console.log('\n=== 3. Singleton com Closure ===');

const ConfigManager = (function() {
    let instance;
    let config = {};
    let listeners = [];
    
    function createInstance() {
        console.log('🔧 Criando ConfigManager');
        
        return {
            set(key, value) {
                const oldValue = config[key];
                config[key] = value;
                
                console.log(`⚙️ Config atualizada: ${key} = ${value}`);
                
                // Notificar listeners
                listeners.forEach(listener => {
                    try {
                        listener(key, value, oldValue);
                    } catch (error) {
                        console.error('Erro no listener:', error);
                    }
                });
            },
            
            get(key) {
                return config[key];
            },
            
            getAll() {
                return { ...config };
            },
            
            has(key) {
                return key in config;
            },
            
            delete(key) {
                const existed = key in config;
                delete config[key];
                
                if (existed) {
                    console.log(`🗑️ Config removida: ${key}`);
                    listeners.forEach(listener => {
                        try {
                            listener(key, undefined, config[key]);
                        } catch (error) {
                            console.error('Erro no listener:', error);
                        }
                    });
                }
                
                return existed;
            },
            
            subscribe(listener) {
                if (typeof listener !== 'function') {
                    throw new Error('Listener deve ser uma função');
                }
                
                listeners.push(listener);
                console.log(`👂 Listener adicionado (total: ${listeners.length})`);
                
                // Retornar função de unsubscribe
                return () => {
                    const index = listeners.indexOf(listener);
                    if (index > -1) {
                        listeners.splice(index, 1);
                        console.log(`👋 Listener removido (total: ${listeners.length})`);
                    }
                };
            },
            
            clear() {
                config = {};
                console.log('🧹 Configurações limpas');
            },
            
            size() {
                return Object.keys(config).length;
            },
            
            export() {
                return JSON.stringify(config, null, 2);
            },
            
            import(jsonString) {
                try {
                    const imported = JSON.parse(jsonString);
                    Object.assign(config, imported);
                    console.log('📥 Configurações importadas');
                } catch (error) {
                    console.error('Erro ao importar:', error);
                    throw new Error('JSON inválido');
                }
            }
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
        
        // Método para testes
        reset() {
            instance = null;
            config = {};
            listeners = [];
            console.log('🔄 ConfigManager resetado');
        }
    };
})();

// Testando ConfigManager
const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

console.log('São a mesma instância?', config1 === config2); // true

// Adicionar listener
const unsubscribe = config1.subscribe((key, newValue, oldValue) => {
    console.log(`🔔 Config changed: ${key} ${oldValue} -> ${newValue}`);
});

config1.set('theme', 'dark');
config1.set('language', 'pt-BR');
config1.set('notifications', true);

console.log('Todas as configs:', config1.getAll());
console.log('Tamanho:', config1.size());

// 4. SINGLETON COM ES6 MODULES
console.log('\n=== 4. Singleton com ES6 Modules ===');

// Simulação de módulo ES6 (normalmente seria um arquivo separado)
class DatabaseConnection {
    constructor() {
        this.id = Math.random().toString(36).substr(2, 9);
        this.connected = false;
        this.queries = [];
        this.connectionPool = [];
        
        console.log(`🗄️ Database connection criada: ${this.id}`);
    }
    
    async connect(config = {}) {
        if (this.connected) {
            console.log('⚠️ Já conectado');
            return this;
        }
        
        console.log('🔌 Conectando ao banco de dados...');
        
        // Simular conexão assíncrona
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.config = {
            host: config.host || 'localhost',
            port: config.port || 5432,
            database: config.database || 'app_db',
            user: config.user || 'user',
            maxConnections: config.maxConnections || 10,
            ...config
        };
        
        // Criar pool de conexões
        for (let i = 0; i < this.config.maxConnections; i++) {
            this.connectionPool.push({
                id: i,
                busy: false,
                lastUsed: null
            });
        }
        
        this.connected = true;
        console.log(`✅ Conectado: ${this.config.host}:${this.config.port}/${this.config.database}`);
        
        return this;
    }
    
    async disconnect() {
        if (!this.connected) {
            console.log('⚠️ Já desconectado');
            return;
        }
        
        console.log('🔌 Desconectando...');
        
        // Aguardar queries pendentes
        await new Promise(resolve => setTimeout(resolve, 50));
        
        this.connected = false;
        this.connectionPool = [];
        
        console.log('❌ Desconectado');
    }
    
    getConnection() {
        if (!this.connected) {
            throw new Error('Banco não conectado');
        }
        
        const available = this.connectionPool.find(conn => !conn.busy);
        
        if (!available) {
            throw new Error('Nenhuma conexão disponível');
        }
        
        available.busy = true;
        available.lastUsed = new Date();
        
        console.log(`🔗 Conexão ${available.id} em uso`);
        
        return {
            id: available.id,
            query: async (sql, params = []) => {
                console.log(`📝 Query: ${sql}`);
                
                // Simular query
                await new Promise(resolve => setTimeout(resolve, 10));
                
                const result = {
                    sql,
                    params,
                    rows: [],
                    rowCount: 0,
                    duration: Math.random() * 100
                };
                
                this.queries.push({
                    ...result,
                    timestamp: new Date(),
                    connectionId: available.id
                });
                
                return result;
            },
            release: () => {
                available.busy = false;
                console.log(`🔓 Conexão ${available.id} liberada`);
            }
        };
    }
    
    getStats() {
        return {
            id: this.id,
            connected: this.connected,
            totalQueries: this.queries.length,
            availableConnections: this.connectionPool.filter(c => !c.busy).length,
            busyConnections: this.connectionPool.filter(c => c.busy).length,
            config: this.config
        };
    }
}

// Criar instância única (simulando export de módulo)
const dbInstance = new DatabaseConnection();

// Simular import em diferentes módulos
const getDatabase = () => dbInstance;

// Testando Database Singleton
const db1 = getDatabase();
const db2 = getDatabase();

console.log('São a mesma instância?', db1 === db2); // true

// Usar o banco
(async () => {
    await db1.connect({
        host: 'localhost',
        database: 'my_app',
        maxConnections: 5
    });
    
    // Fazer algumas queries
    const conn1 = db1.getConnection();
    const conn2 = db1.getConnection();
    
    await conn1.query('SELECT * FROM users WHERE id = ?', [1]);
    await conn2.query('SELECT * FROM products LIMIT 10');
    
    conn1.release();
    conn2.release();
    
    console.log('Database Stats:', db1.getStats());
})();

// 5. SINGLETON REGISTRY PATTERN
console.log('\n=== 5. Singleton Registry ===');

class SingletonRegistry {
    constructor() {
        this.instances = new Map();
        this.factories = new Map();
    }
    
    register(name, factory) {
        if (typeof factory !== 'function') {
            throw new Error('Factory deve ser uma função');
        }
        
        this.factories.set(name, factory);
        console.log(`🏭 Factory '${name}' registrada`);
    }
    
    getInstance(name, ...args) {
        // Verificar se já existe instância
        if (this.instances.has(name)) {
            console.log(`♻️ Retornando instância existente: ${name}`);
            return this.instances.get(name);
        }
        
        // Verificar se factory existe
        const factory = this.factories.get(name);
        if (!factory) {
            throw new Error(`Factory '${name}' não encontrada`);
        }
        
        // Criar nova instância
        console.log(`🆕 Criando nova instância: ${name}`);
        const instance = factory(...args);
        this.instances.set(name, instance);
        
        return instance;
    }
    
    hasInstance(name) {
        return this.instances.has(name);
    }
    
    removeInstance(name) {
        const removed = this.instances.delete(name);
        if (removed) {
            console.log(`🗑️ Instância '${name}' removida`);
        }
        return removed;
    }
    
    clear() {
        this.instances.clear();
        console.log('🧹 Todas as instâncias removidas');
    }
    
    getRegisteredNames() {
        return Array.from(this.factories.keys());
    }
    
    getInstanceNames() {
        return Array.from(this.instances.keys());
    }
    
    getStats() {
        return {
            registeredFactories: this.factories.size,
            activeInstances: this.instances.size,
            factories: this.getRegisteredNames(),
            instances: this.getInstanceNames()
        };
    }
}

// Criar registry global
const registry = new SingletonRegistry();

// Registrar factories
registry.register('logger', (level = 'info') => {
    return {
        level,
        logs: [],
        log(message, data) {
            const entry = {
                timestamp: new Date(),
                level: this.level,
                message,
                data
            };
            this.logs.push(entry);
            console.log(`📋 [${this.level.toUpperCase()}] ${message}`);
        },
        getLogs() {
            return this.logs;
        }
    };
});

registry.register('cache', (maxSize = 100) => {
    return {
        maxSize,
        data: new Map(),
        set(key, value) {
            if (this.data.size >= this.maxSize) {
                const firstKey = this.data.keys().next().value;
                this.data.delete(firstKey);
            }
            this.data.set(key, value);
            console.log(`💾 Cache set: ${key}`);
        },
        get(key) {
            return this.data.get(key);
        },
        size() {
            return this.data.size;
        }
    };
});

registry.register('eventBus', () => {
    return {
        listeners: new Map(),
        on(event, callback) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
            console.log(`👂 Listener adicionado para '${event}'`);
        },
        emit(event, data) {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                callbacks.forEach(callback => callback(data));
                console.log(`📡 Evento '${event}' emitido`);
            }
        },
        off(event) {
            this.listeners.delete(event);
            console.log(`🔇 Listeners removidos para '${event}'`);
        }
    };
});

// Testando Registry
console.log('Factories registradas:', registry.getRegisteredNames());

const logger = registry.getInstance('logger', 'debug');
const cache = registry.getInstance('cache', 50);
const eventBus = registry.getInstance('eventBus');

// Usar os singletons
logger.log('Sistema inicializado');
cache.set('user:1', { name: 'João', email: 'joao@test.com' });
eventBus.on('user:login', (user) => {
    logger.log('Usuário logado', user);
    cache.set(`session:${user.id}`, { loginTime: new Date() });
});

eventBus.emit('user:login', { id: 1, name: 'João' });

// Verificar se são singletons
const logger2 = registry.getInstance('logger');
const cache2 = registry.getInstance('cache');

console.log('Logger é singleton?', logger === logger2); // true
console.log('Cache é singleton?', cache === cache2); // true
console.log('Registry Stats:', registry.getStats());

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE CONFIGURAÇÃO GLOBAL
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Configuração Global ===');

class GlobalConfig {
    constructor() {
        if (GlobalConfig.instance) {
            return GlobalConfig.instance;
        }
        
        this.config = new Map();
        this.watchers = new Map();
        this.history = [];
        this.frozen = false;
        this.version = '1.0.0';
        this.lastModified = new Date();
        
        // Configurações padrão
        this.setDefaults();
        
        GlobalConfig.instance = this;
        console.log('🌐 GlobalConfig inicializado');
    }
    
    static getInstance() {
        if (!GlobalConfig.instance) {
            GlobalConfig.instance = new GlobalConfig();
        }
        return GlobalConfig.instance;
    }
    
    setDefaults() {
        const defaults = {
            'app.name': 'My Application',
            'app.version': '1.0.0',
            'app.environment': 'development',
            'ui.theme': 'light',
            'ui.language': 'pt-BR',
            'api.baseUrl': 'http://localhost:3000',
            'api.timeout': 5000,
            'cache.enabled': true,
            'cache.ttl': 3600,
            'logging.level': 'info',
            'logging.enabled': true
        };
        
        for (let [key, value] of Object.entries(defaults)) {
            this.config.set(key, value);
        }
        
        console.log('⚙️ Configurações padrão carregadas');
    }
    
    set(key, value, options = {}) {
        if (this.frozen && !options.force) {
            throw new Error('Configuração está congelada');
        }
        
        const oldValue = this.config.get(key);
        
        // Validação
        if (options.validate && typeof options.validate === 'function') {
            if (!options.validate(value)) {
                throw new Error(`Valor inválido para '${key}': ${value}`);
            }
        }
        
        // Transformação
        let finalValue = value;
        if (options.transform && typeof options.transform === 'function') {
            finalValue = options.transform(value);
        }
        
        this.config.set(key, finalValue);
        this.lastModified = new Date();
        
        // Histórico
        this.history.push({
            action: 'set',
            key,
            oldValue,
            newValue: finalValue,
            timestamp: new Date(),
            options
        });
        
        // Notificar watchers
        this.notifyWatchers(key, finalValue, oldValue);
        
        console.log(`⚙️ Config set: ${key} = ${finalValue}`);
        return this;
    }
    
    get(key, defaultValue = undefined) {
        return this.config.has(key) ? this.config.get(key) : defaultValue;
    }
    
    has(key) {
        return this.config.has(key);
    }
    
    delete(key) {
        if (this.frozen) {
            throw new Error('Configuração está congelada');
        }
        
        const oldValue = this.config.get(key);
        const deleted = this.config.delete(key);
        
        if (deleted) {
            this.lastModified = new Date();
            
            this.history.push({
                action: 'delete',
                key,
                oldValue,
                timestamp: new Date()
            });
            
            this.notifyWatchers(key, undefined, oldValue);
            console.log(`🗑️ Config deleted: ${key}`);
        }
        
        return deleted;
    }
    
    watch(key, callback) {
        if (!this.watchers.has(key)) {
            this.watchers.set(key, []);
        }
        
        this.watchers.get(key).push(callback);
        console.log(`👀 Watcher adicionado para '${key}'`);
        
        // Retornar função de unwatch
        return () => {
            const callbacks = this.watchers.get(key);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                    console.log(`👋 Watcher removido para '${key}'`);
                }
            }
        };
    }
    
    notifyWatchers(key, newValue, oldValue) {
        const callbacks = this.watchers.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error(`Erro no watcher para '${key}':`, error);
                }
            });
        }
        
        // Watchers globais (key = '*')
        const globalCallbacks = this.watchers.get('*');
        if (globalCallbacks) {
            globalCallbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error('Erro no watcher global:', error);
                }
            });
        }
    }
    
    getSection(prefix) {
        const section = {};
        for (let [key, value] of this.config) {
            if (key.startsWith(prefix)) {
                const sectionKey = key.substring(prefix.length + 1);
                section[sectionKey] = value;
            }
        }
        return section;
    }
    
    setSection(prefix, values) {
        for (let [key, value] of Object.entries(values)) {
            this.set(`${prefix}.${key}`, value);
        }
        return this;
    }
    
    freeze() {
        this.frozen = true;
        console.log('🧊 Configuração congelada');
        return this;
    }
    
    unfreeze() {
        this.frozen = false;
        console.log('🔥 Configuração descongelada');
        return this;
    }
    
    export(format = 'json') {
        const data = Object.fromEntries(this.config);
        
        switch (format) {
            case 'json':
                return JSON.stringify(data, null, 2);
            case 'env':
                return Object.entries(data)
                    .map(([key, value]) => `${key.toUpperCase().replace(/\./g, '_')}=${value}`)
                    .join('\n');
            case 'yaml':
                // Implementação simplificada de YAML
                return Object.entries(data)
                    .map(([key, value]) => {
                        const yamlKey = key.replace(/\./g, ':\n  ');
                        return `${yamlKey}: ${value}`;
                    })
                    .join('\n');
            default:
                throw new Error(`Formato '${format}' não suportado`);
        }
    }
    
    import(data, format = 'json') {
        let parsed;
        
        switch (format) {
            case 'json':
                parsed = JSON.parse(data);
                break;
            case 'env':
                parsed = {};
                data.split('\n').forEach(line => {
                    const [key, value] = line.split('=');
                    if (key && value) {
                        const configKey = key.toLowerCase().replace(/_/g, '.');
                        parsed[configKey] = value;
                    }
                });
                break;
            default:
                throw new Error(`Formato '${format}' não suportado`);
        }
        
        for (let [key, value] of Object.entries(parsed)) {
            this.set(key, value);
        }
        
        console.log('📥 Configurações importadas');
        return this;
    }
    
    getHistory(limit = 10) {
        return this.history.slice(-limit);
    }
    
    clear() {
        if (this.frozen) {
            throw new Error('Configuração está congelada');
        }
        
        this.config.clear();
        this.history.push({
            action: 'clear',
            timestamp: new Date()
        });
        
        console.log('🧹 Configurações limpas');
        return this;
    }
    
    getStats() {
        return {
            version: this.version,
            totalConfigs: this.config.size,
            frozen: this.frozen,
            lastModified: this.lastModified,
            historySize: this.history.length,
            watchersCount: Array.from(this.watchers.values())
                .reduce((sum, callbacks) => sum + callbacks.length, 0)
        };
    }
    
    static reset() {
        GlobalConfig.instance = null;
        console.log('🔄 GlobalConfig resetado');
    }
}

// Testando Sistema de Configuração Global
const config = GlobalConfig.getInstance();
const config2 = GlobalConfig.getInstance();

console.log('São a mesma instância?', config === config2); // true

// Adicionar watchers
const unwatchTheme = config.watch('ui.theme', (newValue, oldValue) => {
    console.log(`🎨 Tema alterado: ${oldValue} -> ${newValue}`);
});

const unwatchGlobal = config.watch('*', (newValue, oldValue, key) => {
    console.log(`🔔 Config global alterada: ${key}`);
});

// Testar configurações
config.set('ui.theme', 'dark');
config.set('api.timeout', 10000, {
    validate: (value) => value > 0 && value < 60000,
    transform: (value) => Math.max(1000, value)
});

// Seções
console.log('Seção UI:', config.getSection('ui'));
console.log('Seção API:', config.getSection('api'));

config.setSection('database', {
    host: 'localhost',
    port: 5432,
    name: 'myapp',
    ssl: true
});

// Export/Import
const jsonExport = config.export('json');
console.log('\nExport JSON:');
console.log(jsonExport);

const envExport = config.export('env');
console.log('\nExport ENV:');
console.log(envExport);

// Estatísticas
console.log('\nEstatísticas:', config.getStats());
console.log('Histórico:', config.getHistory(5));

// ==========================================
// PROBLEMAS E ALTERNATIVAS
// ==========================================

console.log('\n=== PROBLEMAS E ALTERNATIVAS ===');

/*
PROBLEMAS DO SINGLETON:

1. VIOLAÇÃO DO SINGLE RESPONSIBILITY PRINCIPLE
   - A classe gerencia tanto sua instanciação quanto sua funcionalidade

2. DIFICULDADE EM TESTES
   - Estado global compartilhado entre testes
   - Dificulta mocking e isolamento

3. DEPENDÊNCIAS OCULTAS
   - Código que usa singleton não declara dependência explicitamente
   - Dificulta compreensão e manutenção

4. ACOPLAMENTO FORTE
   - Classes ficam fortemente acopladas ao singleton
   - Dificulta reutilização e flexibilidade

5. PROBLEMAS DE CONCORRÊNCIA
   - Em ambientes multi-thread pode haver race conditions
   - JavaScript é single-threaded, mas Web Workers podem causar problemas

ALTERNATIVAS MODERNAS:

1. DEPENDENCY INJECTION
   - Injeta dependências explicitamente
   - Facilita testes e flexibilidade

2. MODULE PATTERN / ES6 MODULES
   - Módulos são naturalmente singletons
   - Mais limpo e explícito

3. CONTEXT API (React)
   - Compartilha estado sem singleton global
   - Escopo limitado à árvore de componentes

4. STATE MANAGEMENT (Redux, Vuex, Zustand)
   - Gerenciamento de estado centralizado
   - Mais previsível e testável

5. SERVICE LOCATOR PATTERN
   - Registry de serviços
   - Mais flexível que singleton direto
*/

// Exemplo de alternativa com Dependency Injection
class UserService {
    constructor(database, logger, cache) {
        this.database = database;
        this.logger = logger;
        this.cache = cache;
    }
    
    async getUser(id) {
        // Verificar cache
        const cached = this.cache.get(`user:${id}`);
        if (cached) {
            this.logger.log('Cache hit', { userId: id });
            return cached;
        }
        
        // Buscar no banco
        this.logger.log('Fetching from database', { userId: id });
        const user = await this.database.query('SELECT * FROM users WHERE id = ?', [id]);
        
        // Cachear resultado
        this.cache.set(`user:${id}`, user);
        
        return user;
    }
}

// Container de DI simples
class DIContainer {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
    }
    
    register(name, factory, singleton = false) {
        this.services.set(name, { factory, singleton });
        return this;
    }
    
    get(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Serviço '${name}' não registrado`);
        }
        
        if (service.singleton) {
            if (!this.singletons.has(name)) {
                this.singletons.set(name, service.factory(this));
            }
            return this.singletons.get(name);
        }
        
        return service.factory(this);
    }
}

// Configurar DI
const container = new DIContainer();

container
    .register('database', () => getDatabase(), true)
    .register('logger', () => registry.getInstance('logger'), true)
    .register('cache', () => registry.getInstance('cache'), true)
    .register('userService', (container) => new UserService(
        container.get('database'),
        container.get('logger'),
        container.get('cache')
    ));

// Usar com DI
const userService = container.get('userService');
console.log('\n--- Testando DI ---');
console.log('UserService criado com dependências injetadas');

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Lazy Initialization: Inicialize apenas quando necessário
2. Memory Management: Implemente cleanup adequado
3. Thread Safety: Considere concorrência em Web Workers
4. Performance: Evite operações pesadas no constructor
5. Caching: Cache resultados de operações caras

BOAS PRÁTICAS:
1. Use com moderação: Singleton não é sempre a solução
2. Considere alternativas: DI, modules, context
3. Testes: Implemente reset para testes
4. Documentação: Documente o propósito do singleton
5. Validação: Valide estado antes de usar
6. Error Handling: Trate erros graciosamente
7. Monitoring: Monitore uso e performance
8. Immutability: Considere tornar dados imutáveis
*/

// ==========================================
// REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS ===');

/*
LIVROS:
- "Design Patterns" - Gang of Four
- "Effective JavaScript" - David Herman
- "Clean Code" - Robert Martin

ARTIGOS:
- "Singleton Pattern Considered Harmful"
- "Dependency Injection in JavaScript"
- "ES6 Modules vs Singleton Pattern"

PRÓXIMOS PASSOS:
1. Estudar Dependency Injection
2. Explorar State Management patterns
3. Praticar com testes unitários
4. Implementar em projetos reais
5. Comparar com alternativas modernas

PROJETOS SUGERIDOS:
- Sistema de configuração global
- Logger centralizado
- Cache manager
- Connection pool
- Event bus global
*/

/*
RESUMO DO MÓDULO SINGLETON PATTERN:

CONCEITOS APRENDIDOS:
✅ Singleton básico - Instância única
✅ Lazy initialization - Criação sob demanda
✅ Closure singleton - Encapsulamento com IIFE
✅ ES6 modules - Singleton natural
✅ Registry pattern - Múltiplos singletons
✅ Problemas e limitações
✅ Alternativas modernas

TÉCNICAS DOMINADAS:
✅ Controle de instanciação
✅ Acesso global controlado
✅ Lazy loading
✅ State management
✅ Dependency injection
✅ Testing strategies

PROJETOS DESENVOLVIDOS:
✅ Singleton básico com validação
✅ Lazy singleton com recursos pesados
✅ ConfigManager com closure
✅ Database connection singleton
✅ Registry de singletons
✅ Sistema de configuração global completo

MÓDULO CONCLUÍDO: 10-Padroes
PRÓXIMO MÓDULO: 11-Qualidade
*/