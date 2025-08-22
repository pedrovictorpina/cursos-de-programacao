/**
 * MÓDULO 10: PADRÕES DE DESIGN EM JAVASCRIPT
 * Arquivo 01: Module Pattern
 * 
 * O Module Pattern é um dos padrões mais fundamentais em JavaScript,
 * permitindo encapsulamento, organização de código e controle de escopo.
 * 
 * Professor: Este padrão é essencial para criar código modular e reutilizável.
 * Vamos explorar desde conceitos básicos até implementações avançadas.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender o conceito e benefícios do Module Pattern
2. Implementar diferentes variações do padrão
3. Aplicar encapsulamento e controle de acesso
4. Criar módulos reutilizáveis e escaláveis
5. Integrar com outros padrões de design
*/

// ==========================================
// TEORIA: MODULE PATTERN
// ==========================================

/*
CONCEITO:
O Module Pattern utiliza closures para criar escopo privado,
expondo apenas uma interface pública controlada.

BENEFÍCIOS:
- Encapsulamento de dados e métodos
- Prevenção de poluição do escopo global
- Organização e estruturação do código
- Reutilização e manutenibilidade
- Controle de acesso (público/privado)

VARIAÇÕES:
- IIFE Module Pattern
- Revealing Module Pattern
- Module Pattern com Namespace
- Module Pattern com Singleton
- Module Pattern com Factory
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. IIFE MODULE PATTERN BÁSICO
console.log('\n=== 1. IIFE Module Pattern Básico ===');

const BasicModule = (function() {
    // Variáveis privadas
    let privateCounter = 0;
    const privateArray = [];
    
    // Métodos privados
    function privateMethod() {
        console.log('Método privado executado');
    }
    
    function validateInput(value) {
        return value !== null && value !== undefined;
    }
    
    // Interface pública
    return {
        // Métodos públicos
        increment: function() {
            privateCounter++;
            privateMethod();
            return privateCounter;
        },
        
        decrement: function() {
            if (privateCounter > 0) {
                privateCounter--;
            }
            return privateCounter;
        },
        
        getCount: function() {
            return privateCounter;
        },
        
        addItem: function(item) {
            if (validateInput(item)) {
                privateArray.push(item);
                return true;
            }
            return false;
        },
        
        getItems: function() {
            // Retorna cópia para manter encapsulamento
            return [...privateArray];
        },
        
        reset: function() {
            privateCounter = 0;
            privateArray.length = 0;
        }
    };
})();

// Testando o módulo básico
console.log('Count inicial:', BasicModule.getCount());
console.log('Incrementando:', BasicModule.increment());
console.log('Incrementando:', BasicModule.increment());
console.log('Adicionando item:', BasicModule.addItem('teste'));
console.log('Items:', BasicModule.getItems());

// 2. REVEALING MODULE PATTERN
console.log('\n=== 2. Revealing Module Pattern ===');

const RevealingModule = (function() {
    // Variáveis privadas
    let config = {
        apiUrl: 'https://api.exemplo.com',
        timeout: 5000,
        retries: 3
    };
    
    let cache = new Map();
    let isInitialized = false;
    
    // Métodos privados
    function validateConfig(newConfig) {
        const required = ['apiUrl', 'timeout'];
        return required.every(key => newConfig.hasOwnProperty(key));
    }
    
    function logOperation(operation, data) {
        console.log(`[${new Date().toISOString()}] ${operation}:`, data);
    }
    
    function initialize() {
        if (!isInitialized) {
            logOperation('INIT', 'Módulo inicializado');
            isInitialized = true;
        }
    }
    
    // Métodos públicos (definidos como privados)
    function setConfig(newConfig) {
        if (validateConfig(newConfig)) {
            config = { ...config, ...newConfig };
            logOperation('CONFIG', 'Configuração atualizada');
            return true;
        }
        return false;
    }
    
    function getConfig() {
        return { ...config }; // Retorna cópia
    }
    
    function setCache(key, value, ttl = 300000) { // TTL padrão: 5 minutos
        const expiry = Date.now() + ttl;
        cache.set(key, { value, expiry });
        logOperation('CACHE_SET', { key, ttl });
    }
    
    function getCache(key) {
        const item = cache.get(key);
        if (item && item.expiry > Date.now()) {
            logOperation('CACHE_HIT', key);
            return item.value;
        }
        if (item) {
            cache.delete(key); // Remove item expirado
            logOperation('CACHE_EXPIRED', key);
        }
        return null;
    }
    
    function clearCache() {
        const size = cache.size;
        cache.clear();
        logOperation('CACHE_CLEAR', `${size} items removidos`);
    }
    
    function getStats() {
        return {
            initialized: isInitialized,
            cacheSize: cache.size,
            config: getConfig()
        };
    }
    
    // Inicialização automática
    initialize();
    
    // Revelando apenas métodos selecionados
    return {
        configure: setConfig,
        getConfiguration: getConfig,
        cache: setCache,
        retrieve: getCache,
        clearCache: clearCache,
        status: getStats
    };
})();

// Testando Revealing Module
console.log('Status inicial:', RevealingModule.status());
RevealingModule.configure({ apiUrl: 'https://nova-api.com', timeout: 8000 });
RevealingModule.cache('user:123', { name: 'João', age: 30 });
console.log('Cache recuperado:', RevealingModule.retrieve('user:123'));

// 3. MODULE PATTERN COM NAMESPACE
console.log('\n=== 3. Module Pattern com Namespace ===');

const MyApp = MyApp || {};

MyApp.Utils = (function() {
    // Utilitários privados
    function isObject(obj) {
        return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
    }
    
    function deepClone(obj) {
        if (!isObject(obj)) return obj;
        const cloned = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
            }
        }
        return cloned;
    }
    
    return {
        // String utilities
        string: {
            capitalize: function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            },
            
            slugify: function(str) {
                return str.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            },
            
            truncate: function(str, length, suffix = '...') {
                return str.length > length ? str.substring(0, length) + suffix : str;
            }
        },
        
        // Object utilities
        object: {
            clone: deepClone,
            
            merge: function(target, ...sources) {
                sources.forEach(source => {
                    if (isObject(source)) {
                        Object.keys(source).forEach(key => {
                            if (isObject(source[key]) && isObject(target[key])) {
                                target[key] = this.merge({}, target[key], source[key]);
                            } else {
                                target[key] = source[key];
                            }
                        });
                    }
                });
                return target;
            },
            
            pick: function(obj, keys) {
                const result = {};
                keys.forEach(key => {
                    if (obj.hasOwnProperty(key)) {
                        result[key] = obj[key];
                    }
                });
                return result;
            }
        },
        
        // Array utilities
        array: {
            unique: function(arr) {
                return [...new Set(arr)];
            },
            
            groupBy: function(arr, key) {
                return arr.reduce((groups, item) => {
                    const group = item[key];
                    groups[group] = groups[group] || [];
                    groups[group].push(item);
                    return groups;
                }, {});
            },
            
            chunk: function(arr, size) {
                const chunks = [];
                for (let i = 0; i < arr.length; i += size) {
                    chunks.push(arr.slice(i, i + size));
                }
                return chunks;
            }
        }
    };
})();

// Testando namespace utilities
console.log('Capitalize:', MyApp.Utils.string.capitalize('hello WORLD'));
console.log('Slugify:', MyApp.Utils.string.slugify('Hello World! 123'));
const users = [{ name: 'João', dept: 'TI' }, { name: 'Maria', dept: 'RH' }, { name: 'Pedro', dept: 'TI' }];
console.log('Group by dept:', MyApp.Utils.array.groupBy(users, 'dept'));

// 4. MODULE PATTERN COM SINGLETON
console.log('\n=== 4. Module Pattern com Singleton ===');

const DatabaseManager = (function() {
    let instance;
    
    function createInstance() {
        // Configuração privada
        let connections = new Map();
        let config = {
            maxConnections: 10,
            timeout: 30000,
            retryAttempts: 3
        };
        
        let stats = {
            totalConnections: 0,
            activeConnections: 0,
            failedConnections: 0
        };
        
        // Métodos privados
        function validateConnectionConfig(connConfig) {
            const required = ['host', 'database'];
            return required.every(key => connConfig.hasOwnProperty(key));
        }
        
        function generateConnectionId() {
            return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }
        
        function logConnection(action, connectionId, details = {}) {
            console.log(`[DB] ${action}: ${connectionId}`, details);
        }
        
        // Interface pública do singleton
        return {
            connect: function(connectionConfig) {
                if (!validateConnectionConfig(connectionConfig)) {
                    throw new Error('Configuração de conexão inválida');
                }
                
                if (connections.size >= config.maxConnections) {
                    throw new Error('Limite máximo de conexões atingido');
                }
                
                const connectionId = generateConnectionId();
                const connection = {
                    id: connectionId,
                    config: { ...connectionConfig },
                    status: 'connected',
                    createdAt: new Date(),
                    lastUsed: new Date()
                };
                
                connections.set(connectionId, connection);
                stats.totalConnections++;
                stats.activeConnections++;
                
                logConnection('CONNECT', connectionId, {
                    host: connectionConfig.host,
                    database: connectionConfig.database
                });
                
                return connectionId;
            },
            
            disconnect: function(connectionId) {
                const connection = connections.get(connectionId);
                if (connection) {
                    connections.delete(connectionId);
                    stats.activeConnections--;
                    logConnection('DISCONNECT', connectionId);
                    return true;
                }
                return false;
            },
            
            query: function(connectionId, sql, params = []) {
                const connection = connections.get(connectionId);
                if (!connection) {
                    throw new Error(`Conexão ${connectionId} não encontrada`);
                }
                
                connection.lastUsed = new Date();
                logConnection('QUERY', connectionId, { sql: sql.substring(0, 50) + '...' });
                
                // Simulação de query
                return {
                    success: true,
                    data: `Resultado da query: ${sql}`,
                    params,
                    executedAt: new Date()
                };
            },
            
            getStats: function() {
                return {
                    ...stats,
                    connections: Array.from(connections.values()).map(conn => ({
                        id: conn.id,
                        status: conn.status,
                        host: conn.config.host,
                        database: conn.config.database,
                        createdAt: conn.createdAt,
                        lastUsed: conn.lastUsed
                    }))
                };
            },
            
            configure: function(newConfig) {
                config = { ...config, ...newConfig };
                logConnection('CONFIG', 'system', newConfig);
            },
            
            closeAll: function() {
                const count = connections.size;
                connections.clear();
                stats.activeConnections = 0;
                logConnection('CLOSE_ALL', 'system', { closed: count });
                return count;
            }
        };
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Testando Singleton Database Manager
const db1 = DatabaseManager.getInstance();
const db2 = DatabaseManager.getInstance();

console.log('Mesma instância?', db1 === db2); // true

const connId = db1.connect({ host: 'localhost', database: 'testdb', user: 'admin' });
db1.query(connId, 'SELECT * FROM users WHERE active = ?', [true]);
console.log('Stats:', db1.getStats());

// ==========================================
// PADRÕES AVANÇADOS
// ==========================================

// 5. MODULE PATTERN COM FACTORY
console.log('\n=== 5. Module Pattern com Factory ===');

const ComponentFactory = (function() {
    // Registro de componentes
    const components = new Map();
    
    // Configurações globais
    let globalConfig = {
        theme: 'default',
        language: 'pt-BR',
        debug: false
    };
    
    // Classe base para componentes
    function BaseComponent(type, config) {
        this.type = type;
        this.id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.config = { ...globalConfig, ...config };
        this.created = new Date();
        this.events = new Map();
    }
    
    BaseComponent.prototype = {
        on: function(event, callback) {
            if (!this.events.has(event)) {
                this.events.set(event, []);
            }
            this.events.get(event).push(callback);
        },
        
        emit: function(event, data) {
            if (this.events.has(event)) {
                this.events.get(event).forEach(callback => callback(data));
            }
        },
        
        destroy: function() {
            this.events.clear();
            if (this.config.debug) {
                console.log(`Componente ${this.id} destruído`);
            }
        }
    };
    
    // Definições de componentes específicos
    const componentDefinitions = {
        button: function(config) {
            const component = new BaseComponent('button', config);
            
            component.render = function() {
                return `<button id="${this.id}" class="btn btn-${this.config.variant || 'primary'}">
                    ${this.config.text || 'Button'}
                </button>`;
            };
            
            component.click = function() {
                this.emit('click', { id: this.id, timestamp: new Date() });
            };
            
            return component;
        },
        
        modal: function(config) {
            const component = new BaseComponent('modal', config);
            
            component.isOpen = false;
            
            component.render = function() {
                return `<div id="${this.id}" class="modal ${this.isOpen ? 'open' : 'closed'}">
                    <div class="modal-content">
                        <h2>${this.config.title || 'Modal'}</h2>
                        <p>${this.config.content || 'Conteúdo do modal'}</p>
                        <button onclick="${this.id}.close()">Fechar</button>
                    </div>
                </div>`;
            };
            
            component.open = function() {
                this.isOpen = true;
                this.emit('open', { id: this.id });
            };
            
            component.close = function() {
                this.isOpen = false;
                this.emit('close', { id: this.id });
            };
            
            return component;
        },
        
        form: function(config) {
            const component = new BaseComponent('form', config);
            
            component.fields = config.fields || [];
            component.data = {};
            
            component.render = function() {
                const fieldsHtml = this.fields.map(field => {
                    return `<div class="field">
                        <label for="${field.name}">${field.label}</label>
                        <input type="${field.type || 'text'}" 
                               id="${field.name}" 
                               name="${field.name}"
                               ${field.required ? 'required' : ''}>
                    </div>`;
                }).join('');
                
                return `<form id="${this.id}">
                    ${fieldsHtml}
                    <button type="submit">Enviar</button>
                </form>`;
            };
            
            component.validate = function() {
                const errors = [];
                this.fields.forEach(field => {
                    if (field.required && !this.data[field.name]) {
                        errors.push(`${field.label} é obrigatório`);
                    }
                });
                return errors;
            };
            
            component.submit = function() {
                const errors = this.validate();
                if (errors.length === 0) {
                    this.emit('submit', { data: this.data, id: this.id });
                    return true;
                } else {
                    this.emit('error', { errors, id: this.id });
                    return false;
                }
            };
            
            return component;
        }
    };
    
    // Interface pública da factory
    return {
        register: function(type, definition) {
            if (typeof definition === 'function') {
                componentDefinitions[type] = definition;
                return true;
            }
            return false;
        },
        
        create: function(type, config = {}) {
            if (componentDefinitions[type]) {
                const component = componentDefinitions[type](config);
                components.set(component.id, component);
                
                if (globalConfig.debug) {
                    console.log(`Componente ${type} criado:`, component.id);
                }
                
                return component;
            }
            throw new Error(`Tipo de componente '${type}' não encontrado`);
        },
        
        get: function(id) {
            return components.get(id);
        },
        
        getByType: function(type) {
            return Array.from(components.values()).filter(comp => comp.type === type);
        },
        
        destroy: function(id) {
            const component = components.get(id);
            if (component) {
                component.destroy();
                components.delete(id);
                return true;
            }
            return false;
        },
        
        configure: function(config) {
            globalConfig = { ...globalConfig, ...config };
        },
        
        getStats: function() {
            const typeCount = {};
            components.forEach(comp => {
                typeCount[comp.type] = (typeCount[comp.type] || 0) + 1;
            });
            
            return {
                total: components.size,
                byType: typeCount,
                registeredTypes: Object.keys(componentDefinitions)
            };
        }
    };
})();

// Testando Component Factory
ComponentFactory.configure({ debug: true });

const button = ComponentFactory.create('button', {
    text: 'Clique aqui',
    variant: 'success'
});

const modal = ComponentFactory.create('modal', {
    title: 'Confirmação',
    content: 'Deseja continuar?'
});

const form = ComponentFactory.create('form', {
    fields: [
        { name: 'name', label: 'Nome', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true }
    ]
});

// Event listeners
button.on('click', (data) => {
    console.log('Button clicked:', data);
    modal.open();
});

modal.on('close', () => {
    console.log('Modal fechado');
});

form.on('submit', (data) => {
    console.log('Form submitted:', data);
});

console.log('Factory Stats:', ComponentFactory.getStats());
console.log('Button HTML:', button.render());

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE PLUGINS
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Plugins ===');

const PluginSystem = (function() {
    // Estado privado
    let plugins = new Map();
    let hooks = new Map();
    let config = {
        autoload: true,
        strict: false,
        maxPlugins: 50
    };
    
    let stats = {
        loaded: 0,
        failed: 0,
        hooks: 0
    };
    
    // Métodos privados
    function validatePlugin(plugin) {
        const required = ['name', 'version', 'init'];
        return required.every(prop => plugin.hasOwnProperty(prop)) &&
               typeof plugin.init === 'function';
    }
    
    function logPlugin(action, name, details = {}) {
        console.log(`[PLUGIN] ${action}: ${name}`, details);
    }
    
    function executeHook(hookName, data) {
        if (hooks.has(hookName)) {
            const callbacks = hooks.get(hookName);
            let result = data;
            
            callbacks.forEach(callback => {
                try {
                    const newResult = callback(result);
                    if (newResult !== undefined) {
                        result = newResult;
                    }
                } catch (error) {
                    console.error(`Erro no hook ${hookName}:`, error);
                }
            });
            
            return result;
        }
        return data;
    }
    
    // Interface pública
    return {
        register: function(plugin) {
            if (!validatePlugin(plugin)) {
                const error = `Plugin inválido: ${plugin.name || 'unknown'}`;
                stats.failed++;
                if (config.strict) {
                    throw new Error(error);
                }
                logPlugin('FAILED', plugin.name || 'unknown', { reason: 'validation' });
                return false;
            }
            
            if (plugins.has(plugin.name)) {
                const error = `Plugin já registrado: ${plugin.name}`;
                if (config.strict) {
                    throw new Error(error);
                }
                logPlugin('DUPLICATE', plugin.name);
                return false;
            }
            
            if (plugins.size >= config.maxPlugins) {
                const error = 'Limite máximo de plugins atingido';
                if (config.strict) {
                    throw new Error(error);
                }
                logPlugin('LIMIT', plugin.name);
                return false;
            }
            
            // Registrar plugin
            const pluginInstance = {
                ...plugin,
                status: 'registered',
                registeredAt: new Date(),
                loadedAt: null,
                dependencies: plugin.dependencies || [],
                hooks: plugin.hooks || {}
            };
            
            plugins.set(plugin.name, pluginInstance);
            logPlugin('REGISTERED', plugin.name, { version: plugin.version });
            
            // Auto-load se habilitado
            if (config.autoload) {
                this.load(plugin.name);
            }
            
            return true;
        },
        
        load: function(pluginName) {
            const plugin = plugins.get(pluginName);
            if (!plugin) {
                throw new Error(`Plugin não encontrado: ${pluginName}`);
            }
            
            if (plugin.status === 'loaded') {
                logPlugin('ALREADY_LOADED', pluginName);
                return true;
            }
            
            // Verificar dependências
            for (let dep of plugin.dependencies) {
                const depPlugin = plugins.get(dep);
                if (!depPlugin || depPlugin.status !== 'loaded') {
                    const error = `Dependência não carregada: ${dep}`;
                    if (config.strict) {
                        throw new Error(error);
                    }
                    logPlugin('DEP_MISSING', pluginName, { dependency: dep });
                    return false;
                }
            }
            
            try {
                // Executar hook before_load
                executeHook('before_load', { plugin: pluginName });
                
                // Inicializar plugin
                const context = {
                    addHook: this.addHook.bind(this),
                    removeHook: this.removeHook.bind(this),
                    executeHook: this.executeHook.bind(this),
                    getPlugin: this.getPlugin.bind(this),
                    config: { ...config }
                };
                
                plugin.init(context);
                
                // Registrar hooks do plugin
                Object.keys(plugin.hooks).forEach(hookName => {
                    this.addHook(hookName, plugin.hooks[hookName]);
                });
                
                plugin.status = 'loaded';
                plugin.loadedAt = new Date();
                stats.loaded++;
                
                logPlugin('LOADED', pluginName);
                
                // Executar hook after_load
                executeHook('after_load', { plugin: pluginName });
                
                return true;
                
            } catch (error) {
                plugin.status = 'error';
                plugin.error = error.message;
                stats.failed++;
                
                logPlugin('ERROR', pluginName, { error: error.message });
                
                if (config.strict) {
                    throw error;
                }
                return false;
            }
        },
        
        unload: function(pluginName) {
            const plugin = plugins.get(pluginName);
            if (!plugin || plugin.status !== 'loaded') {
                return false;
            }
            
            try {
                // Executar hook before_unload
                executeHook('before_unload', { plugin: pluginName });
                
                // Remover hooks do plugin
                Object.keys(plugin.hooks).forEach(hookName => {
                    this.removeHook(hookName, plugin.hooks[hookName]);
                });
                
                // Cleanup se disponível
                if (typeof plugin.cleanup === 'function') {
                    plugin.cleanup();
                }
                
                plugin.status = 'unloaded';
                stats.loaded--;
                
                logPlugin('UNLOADED', pluginName);
                
                // Executar hook after_unload
                executeHook('after_unload', { plugin: pluginName });
                
                return true;
                
            } catch (error) {
                logPlugin('UNLOAD_ERROR', pluginName, { error: error.message });
                return false;
            }
        },
        
        addHook: function(hookName, callback) {
            if (!hooks.has(hookName)) {
                hooks.set(hookName, []);
            }
            hooks.get(hookName).push(callback);
            stats.hooks++;
        },
        
        removeHook: function(hookName, callback) {
            if (hooks.has(hookName)) {
                const callbacks = hooks.get(hookName);
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                    stats.hooks--;
                    if (callbacks.length === 0) {
                        hooks.delete(hookName);
                    }
                    return true;
                }
            }
            return false;
        },
        
        executeHook: executeHook,
        
        getPlugin: function(name) {
            const plugin = plugins.get(name);
            return plugin ? { ...plugin } : null;
        },
        
        listPlugins: function(status = null) {
            const result = Array.from(plugins.values());
            return status ? result.filter(p => p.status === status) : result;
        },
        
        configure: function(newConfig) {
            config = { ...config, ...newConfig };
            logPlugin('CONFIG', 'system', newConfig);
        },
        
        getStats: function() {
            return {
                ...stats,
                total: plugins.size,
                byStatus: {
                    registered: this.listPlugins('registered').length,
                    loaded: this.listPlugins('loaded').length,
                    error: this.listPlugins('error').length,
                    unloaded: this.listPlugins('unloaded').length
                },
                hooks: hooks.size
            };
        },
        
        reset: function() {
            // Descarregar todos os plugins
            this.listPlugins('loaded').forEach(plugin => {
                this.unload(plugin.name);
            });
            
            plugins.clear();
            hooks.clear();
            stats = { loaded: 0, failed: 0, hooks: 0 };
            
            logPlugin('RESET', 'system');
        }
    };
})();

// Criando plugins de exemplo
const loggerPlugin = {
    name: 'logger',
    version: '1.0.0',
    description: 'Plugin de logging',
    
    init: function(context) {
        console.log('Logger plugin inicializado');
        
        // Adicionar hook para log de todas as ações
        context.addHook('before_load', (data) => {
            console.log(`[LOGGER] Carregando plugin: ${data.plugin}`);
            return data;
        });
        
        context.addHook('after_load', (data) => {
            console.log(`[LOGGER] Plugin carregado: ${data.plugin}`);
            return data;
        });
    },
    
    cleanup: function() {
        console.log('Logger plugin finalizado');
    }
};

const cachePlugin = {
    name: 'cache',
    version: '2.1.0',
    description: 'Plugin de cache',
    dependencies: ['logger'],
    
    init: function(context) {
        console.log('Cache plugin inicializado');
        this.cache = new Map();
        
        // Adicionar métodos globais de cache
        context.addHook('cache_set', (data) => {
            this.cache.set(data.key, {
                value: data.value,
                timestamp: Date.now(),
                ttl: data.ttl || 300000
            });
            console.log(`[CACHE] Item armazenado: ${data.key}`);
            return data;
        });
        
        context.addHook('cache_get', (data) => {
            const item = this.cache.get(data.key);
            if (item && (Date.now() - item.timestamp) < item.ttl) {
                console.log(`[CACHE] Cache hit: ${data.key}`);
                return { ...data, value: item.value, hit: true };
            }
            console.log(`[CACHE] Cache miss: ${data.key}`);
            return { ...data, hit: false };
        });
    },
    
    cleanup: function() {
        this.cache.clear();
        console.log('Cache plugin finalizado');
    }
};

const analyticsPlugin = {
    name: 'analytics',
    version: '1.5.0',
    description: 'Plugin de analytics',
    dependencies: ['logger', 'cache'],
    
    init: function(context) {
        console.log('Analytics plugin inicializado');
        this.events = [];
        
        // Rastrear eventos do sistema
        context.addHook('after_load', (data) => {
            this.events.push({
                type: 'plugin_loaded',
                plugin: data.plugin,
                timestamp: Date.now()
            });
            return data;
        });
        
        // Método para obter estatísticas
        context.addHook('get_analytics', (data) => {
            return {
                ...data,
                events: this.events.length,
                recentEvents: this.events.slice(-10)
            };
        });
    },
    
    cleanup: function() {
        this.events = [];
        console.log('Analytics plugin finalizado');
    }
};

// Testando o sistema de plugins
console.log('\n--- Registrando plugins ---');
PluginSystem.register(loggerPlugin);
PluginSystem.register(cachePlugin);
PluginSystem.register(analyticsPlugin);

console.log('\n--- Testando cache ---');
PluginSystem.executeHook('cache_set', { key: 'user:123', value: { name: 'João' }, ttl: 60000 });
const cacheResult = PluginSystem.executeHook('cache_get', { key: 'user:123' });
console.log('Resultado do cache:', cacheResult);

console.log('\n--- Analytics ---');
const analytics = PluginSystem.executeHook('get_analytics', {});
console.log('Analytics:', analytics);

console.log('\n--- Stats do sistema ---');
console.log('Plugin System Stats:', PluginSystem.getStats());

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Use lazy loading para módulos pesados
2. Implemente cache para operações custosas
3. Minimize o escopo global
4. Use Object.freeze() para configurações imutáveis
5. Implemente cleanup adequado

BOAS PRÁTICAS:
1. Sempre valide entradas
2. Forneça interfaces consistentes
3. Documente APIs públicas
4. Use naming conventions claras
5. Implemente logging adequado
6. Trate erros graciosamente
7. Mantenha estado privado realmente privado
8. Use factory pattern para criação complexa
9. Implemente singleton apenas quando necessário
10. Forneça métodos de cleanup

PADRÕES RELACIONADOS:
- Observer Pattern (para eventos)
- Factory Pattern (para criação)
- Singleton Pattern (para instância única)
- Strategy Pattern (para algoritmos)
- Command Pattern (para ações)
*/

// Exemplo de módulo otimizado
const OptimizedModule = (function() {
    'use strict';
    
    // Configuração imutável
    const CONFIG = Object.freeze({
        VERSION: '1.0.0',
        MAX_ITEMS: 1000,
        CACHE_TTL: 300000
    });
    
    // Estado privado
    let cache = new Map();
    let initialized = false;
    
    // Lazy loading de dependências pesadas
    let heavyDependency = null;
    
    function loadHeavyDependency() {
        if (!heavyDependency) {
            heavyDependency = {
                process: function(data) {
                    // Simulação de processamento pesado
                    return data.map(item => ({ ...item, processed: true }));
                }
            };
        }
        return heavyDependency;
    }
    
    // Cleanup automático de cache
    function cleanupCache() {
        const now = Date.now();
        for (let [key, value] of cache) {
            if (now - value.timestamp > CONFIG.CACHE_TTL) {
                cache.delete(key);
            }
        }
    }
    
    // Auto-cleanup periódico
    setInterval(cleanupCache, CONFIG.CACHE_TTL);
    
    return Object.freeze({
        init: function() {
            if (!initialized) {
                console.log(`Módulo inicializado v${CONFIG.VERSION}`);
                initialized = true;
            }
            return this;
        },
        
        process: function(data) {
            if (!initialized) {
                throw new Error('Módulo não inicializado');
            }
            
            const cacheKey = JSON.stringify(data);
            const cached = cache.get(cacheKey);
            
            if (cached && (Date.now() - cached.timestamp) < CONFIG.CACHE_TTL) {
                return cached.result;
            }
            
            const processor = loadHeavyDependency();
            const result = processor.process(data);
            
            cache.set(cacheKey, {
                result,
                timestamp: Date.now()
            });
            
            return result;
        },
        
        getStats: function() {
            return Object.freeze({
                version: CONFIG.VERSION,
                initialized,
                cacheSize: cache.size,
                heavyDependencyLoaded: heavyDependency !== null
            });
        },
        
        cleanup: function() {
            cache.clear();
            heavyDependency = null;
            initialized = false;
            console.log('Módulo limpo');
        }
    });
})();

// Testando módulo otimizado
const optimized = OptimizedModule.init();
const testData = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }];
const result = optimized.process(testData);
console.log('Resultado processado:', result);
console.log('Stats otimizado:', optimized.getStats());

// ==========================================
// RESUMO E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== RESUMO DO MÓDULO ===');

/*
CONCEITOS APRENDIDOS:
✓ Module Pattern básico com IIFE
✓ Revealing Module Pattern
✓ Module Pattern com Namespace
✓ Module Pattern com Singleton
✓ Module Pattern com Factory
✓ Sistema de Plugins avançado
✓ Otimizações e boas práticas

TÉCNICAS DOMINADAS:
✓ Encapsulamento com closures
✓ Controle de acesso público/privado
✓ Lazy loading de dependências
✓ Cache inteligente com TTL
✓ Sistema de hooks e eventos
✓ Validação e tratamento de erros
✓ Cleanup automático
✓ Factory pattern para componentes
✓ Singleton pattern para recursos únicos
✓ Plugin system com dependências

PROJETOS DESENVOLVIDOS:
✓ Módulo básico com contador
✓ Sistema de configuração revelado
✓ Namespace de utilitários
✓ Database manager singleton
✓ Factory de componentes UI
✓ Sistema completo de plugins
✓ Módulo otimizado com cache

PRÓXIMO MÓDULO: Observer Pattern
- Event-driven architecture
- Publisher/Subscriber
- Custom events
- State management
*/

// ==========================================
// REFERÊNCIAS E APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS:
1. "JavaScript Patterns" - Stoyan Stefanov
2. "Learning JavaScript Design Patterns" - Addy Osmani
3. MDN Web Docs - Closures
4. "You Don't Know JS" - Kyle Simpson
5. "Effective JavaScript" - David Herman

APROFUNDAMENTO:
1. AMD e CommonJS modules
2. ES6 Modules vs Module Pattern
3. Webpack e module bundling
4. Micro-frontends architecture
5. Plugin architectures avançadas

FERRAMENTAS:
1. ESLint para qualidade de código
2. Webpack para bundling
3. Rollup para libraries
4. Jest para testes
5. JSDoc para documentação
*/

console.log('\n🎯 Module Pattern concluído! Próximo: Observer Pattern');
console.log('📚 Continue praticando com projetos reais!');
console.log('🔧 Experimente criar seus próprios sistemas modulares!');