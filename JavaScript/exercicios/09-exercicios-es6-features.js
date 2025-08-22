/*
========================================
EXERCÍCIOS PRÁTICOS - RECURSOS ES6+
========================================

Este arquivo contém 3 exercícios práticos para dominar os recursos
modernos do JavaScript (ES6+), incluindo:

• Destructuring (arrays e objetos)
• Arrow functions e lexical this
• Classes e herança
• Modules (import/export)
• Template literals e tagged templates
• Spread/Rest operators
• Default parameters
• Async/await
• Symbols e iterators
• Proxy e Reflect
• Map, Set, WeakMap, WeakSet
• Generators e async generators

Cada exercício demonstra conceitos progressivos e aplicações práticas.
*/

console.log('🚀 EXERCÍCIOS DE RECURSOS ES6+ INICIADOS!');
console.log('📚 Explorando funcionalidades modernas do JavaScript\n');

/*
========================================
EXERCÍCIO 1: SISTEMA DE CONFIGURAÇÃO AVANÇADO
========================================

Objetivo: Criar um sistema de configuração que utiliza múltiplos
recursos ES6+ para gerenciar configurações de aplicação de forma
elegante e type-safe.

Recursos ES6+ utilizados:
• Destructuring com default values
• Spread/Rest operators
• Template literals e tagged templates
• Symbols para propriedades privadas
• Proxy para validação automática
• Map para cache de configurações
• Classes com getters/setters
*/

// Símbolos para propriedades privadas
const _config = Symbol('config');
const _cache = Symbol('cache');
const _validators = Symbol('validators');
const _watchers = Symbol('watchers');

// Tagged template para validação de configuração
function config(strings, ...values) {
    const result = strings.reduce((acc, str, i) => {
        return acc + str + (values[i] || '');
    }, '');
    
    try {
        return JSON.parse(result);
    } catch (error) {
        throw new Error(`Configuração inválida: ${error.message}`);
    }
}

// Classe principal do sistema de configuração
class ConfigManager {
    constructor(initialConfig = {}) {
        this[_config] = new Map();
        this[_cache] = new Map();
        this[_validators] = new Map();
        this[_watchers] = new Map();
        
        // Configuração padrão com destructuring
        const defaultConfig = {
            app: {
                name: 'MyApp',
                version: '1.0.0',
                debug: false
            },
            database: {
                host: 'localhost',
                port: 5432,
                ssl: false
            },
            api: {
                baseUrl: 'https://api.example.com',
                timeout: 5000,
                retries: 3
            }
        };
        
        // Merge com spread operator
        this.setConfig({ ...defaultConfig, ...initialConfig });
        
        // Retornar proxy para interceptar acessos
        return new Proxy(this, {
            get(target, prop) {
                if (typeof prop === 'string' && !prop.startsWith('_') && !(prop in target)) {
                    return target.get(prop);
                }
                return target[prop];
            },
            
            set(target, prop, value) {
                if (typeof prop === 'string' && !prop.startsWith('_') && !(prop in target)) {
                    target.set(prop, value);
                    return true;
                }
                target[prop] = value;
                return true;
            }
        });
    }
    
    // Definir configuração com destructuring avançado
    setConfig(config) {
        const setNestedConfig = (obj, path = '') => {
            for (const [key, value] of Object.entries(obj)) {
                const fullPath = path ? `${path}.${key}` : key;
                
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    setNestedConfig(value, fullPath);
                } else {
                    this[_config].set(fullPath, value);
                }
            }
        };
        
        setNestedConfig(config);
        this[_cache].clear(); // Limpar cache
    }
    
    // Obter configuração com default values
    get(path, defaultValue = undefined) {
        // Verificar cache primeiro
        if (this[_cache].has(path)) {
            return this[_cache].get(path);
        }
        
        const value = this[_config].get(path) ?? defaultValue;
        
        // Cache do resultado
        this[_cache].set(path, value);
        
        return value;
    }
    
    // Definir valor com validação
    set(path, value) {
        // Executar validadores
        if (this[_validators].has(path)) {
            const validator = this[_validators].get(path);
            if (!validator(value)) {
                throw new Error(`Valor inválido para ${path}: ${value}`);
            }
        }
        
        const oldValue = this[_config].get(path);
        this[_config].set(path, value);
        this[_cache].delete(path); // Invalidar cache
        
        // Notificar watchers
        if (this[_watchers].has(path)) {
            const watchers = this[_watchers].get(path);
            watchers.forEach(watcher => watcher(value, oldValue, path));
        }
    }
    
    // Adicionar validador
    addValidator(path, validator) {
        this[_validators].set(path, validator);
    }
    
    // Adicionar watcher
    watch(path, callback) {
        if (!this[_watchers].has(path)) {
            this[_watchers].set(path, new Set());
        }
        this[_watchers].get(path).add(callback);
        
        // Retornar função para remover watcher
        return () => {
            const watchers = this[_watchers].get(path);
            if (watchers) {
                watchers.delete(callback);
                if (watchers.size === 0) {
                    this[_watchers].delete(path);
                }
            }
        };
    }
    
    // Obter configuração como objeto com destructuring
    getSection(section) {
        const result = {};
        const prefix = section + '.';
        
        for (const [key, value] of this[_config]) {
            if (key.startsWith(prefix)) {
                const subKey = key.substring(prefix.length);
                this.setNestedValue(result, subKey, value);
            } else if (key === section) {
                return value;
            }
        }
        
        return Object.keys(result).length > 0 ? result : undefined;
    }
    
    // Utilitário para definir valores aninhados
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
    }
    
    // Exportar configuração
    export() {
        const result = {};
        
        for (const [key, value] of this[_config]) {
            this.setNestedValue(result, key, value);
        }
        
        return result;
    }
    
    // Estatísticas do sistema
    getStats() {
        return {
            totalConfigs: this[_config].size,
            cachedValues: this[_cache].size,
            validators: this[_validators].size,
            watchers: Array.from(this[_watchers].values())
                .reduce((total, set) => total + set.size, 0)
        };
    }
}

// Classe para configuração de ambiente
class EnvironmentConfig extends ConfigManager {
    constructor(environment = 'development') {
        const envConfigs = {
            development: {
                app: { debug: true },
                database: { host: 'localhost' },
                api: { baseUrl: 'http://localhost:3000' }
            },
            production: {
                app: { debug: false },
                database: { ssl: true },
                api: { timeout: 10000 }
            },
            test: {
                app: { debug: true },
                database: { host: 'test-db' },
                api: { timeout: 1000 }
            }
        };
        
        super(envConfigs[environment] || {});
        this.environment = environment;
    }
    
    // Método para alternar ambiente
    switchEnvironment(newEnv) {
        const config = new EnvironmentConfig(newEnv);
        this[_config] = config[_config];
        this[_cache].clear();
        this.environment = newEnv;
    }
}

// Demonstração do sistema de configuração
function demonstrarSistemaConfiguracao() {
    console.log('\n📋 EXERCÍCIO 1: Sistema de Configuração Avançado');
    console.log('=' .repeat(50));
    
    // Criar configuração com tagged template
    const configData = config`{
        "app": {
            "name": "MeuApp",
            "version": "2.0.0"
        },
        "features": {
            "analytics": true,
            "notifications": false
        }
    }`;
    
    const configManager = new ConfigManager(configData);
    
    // Demonstrar destructuring com default values
    const { 
        app: { name = 'App Padrão', version = '1.0.0' } = {},
        features: { analytics = false, notifications = true } = {}
    } = configManager.export();
    
    console.log('🔧 Configuração inicial:');
    console.log(`   App: ${name} v${version}`);
    console.log(`   Analytics: ${analytics}`);
    console.log(`   Notifications: ${notifications}`);
    
    // Adicionar validadores
    configManager.addValidator('app.version', (value) => {
        return typeof value === 'string' && /^\d+\.\d+\.\d+$/.test(value);
    });
    
    configManager.addValidator('database.port', (value) => {
        return Number.isInteger(value) && value > 0 && value < 65536;
    });
    
    // Adicionar watchers
    const unwatch = configManager.watch('app.debug', (newValue, oldValue) => {
        console.log(`🔍 Debug mode changed: ${oldValue} → ${newValue}`);
    });
    
    // Testar configurações
    console.log('\n⚙️ Testando configurações:');
    
    // Usar proxy para acesso direto
    console.log(`   Database host: ${configManager['database.host']}`);
    console.log(`   API timeout: ${configManager.get('api.timeout', 3000)}`);
    
    // Modificar configurações
    configManager.set('app.debug', true);
    configManager['database.port'] = 3306;
    
    // Obter seção completa
    const databaseConfig = configManager.getSection('database');
    console.log('\n💾 Configuração do banco:', databaseConfig);
    
    // Testar configuração de ambiente
    console.log('\n🌍 Testando configuração de ambiente:');
    const envConfig = new EnvironmentConfig('production');
    console.log(`   Environment: ${envConfig.environment}`);
    console.log(`   Debug: ${envConfig.get('app.debug')}`);
    console.log(`   SSL: ${envConfig.get('database.ssl')}`);
    
    // Estatísticas
    console.log('\n📊 Estatísticas:', configManager.getStats());
    
    // Limpar watcher
    unwatch();
}

// Executar demonstração
setTimeout(() => {
    demonstrarSistemaConfiguracao();
}, 1000);

/*
========================================
EXERCÍCIO 2: SISTEMA DE MÓDULOS E COMPONENTES
========================================

Objetivo: Criar um sistema modular de componentes que demonstra
o uso avançado de classes, modules, generators, e outros recursos ES6+.

Recursos ES6+ utilizados:
• Classes com herança e mixins
• Generators e async generators
• Modules (simulados com closures)
• WeakMap para dados privados
• Symbols para métodos privados
• Async/await com error handling
• Default parameters e rest parameters
*/

// WeakMap para dados privados dos componentes
const privateData = new WeakMap();

// Símbolos para métodos privados
const _render = Symbol('render');
const _update = Symbol('update');
const _destroy = Symbol('destroy');

// Classe base para componentes
class Component {
    constructor(element, options = {}) {
        // Dados privados
        privateData.set(this, {
            element,
            state: {},
            listeners: new Map(),
            children: new Set(),
            parent: null,
            mounted: false,
            ...options
        });
        
        this.id = options.id || `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Getter para estado
    get state() {
        return { ...privateData.get(this).state };
    }
    
    // Setter para estado com reatividade
    setState(newState) {
        const data = privateData.get(this);
        const oldState = { ...data.state };
        
        // Merge do estado
        data.state = { ...data.state, ...newState };
        
        // Trigger update se montado
        if (data.mounted) {
            this[_update](oldState, data.state);
        }
    }
    
    // Método para adicionar event listeners
    addEventListener(event, handler, options = {}) {
        const data = privateData.get(this);
        
        if (!data.listeners.has(event)) {
            data.listeners.set(event, new Set());
        }
        
        const wrappedHandler = (e) => {
            if (options.once) {
                this.removeEventListener(event, wrappedHandler);
            }
            handler.call(this, e);
        };
        
        data.listeners.get(event).add(wrappedHandler);
        data.element.addEventListener(event, wrappedHandler, options);
        
        return wrappedHandler;
    }
    
    // Método para remover event listeners
    removeEventListener(event, handler) {
        const data = privateData.get(this);
        
        if (data.listeners.has(event)) {
            data.listeners.get(event).delete(handler);
            data.element.removeEventListener(event, handler);
        }
    }
    
    // Adicionar componente filho
    addChild(child) {
        const data = privateData.get(this);
        const childData = privateData.get(child);
        
        data.children.add(child);
        childData.parent = this;
        
        return child;
    }
    
    // Remover componente filho
    removeChild(child) {
        const data = privateData.get(this);
        const childData = privateData.get(child);
        
        data.children.delete(child);
        childData.parent = null;
        
        child[_destroy]();
    }
    
    // Generator para iterar sobre filhos
    * children() {
        const data = privateData.get(this);
        yield* data.children;
    }
    
    // Async generator para eventos
    async * events(eventType) {
        const data = privateData.get(this);
        const eventQueue = [];
        let resolveNext;
        
        const handler = (event) => {
            if (resolveNext) {
                resolveNext(event);
                resolveNext = null;
            } else {
                eventQueue.push(event);
            }
        };
        
        this.addEventListener(eventType, handler);
        
        try {
            while (true) {
                if (eventQueue.length > 0) {
                    yield eventQueue.shift();
                } else {
                    yield await new Promise(resolve => {
                        resolveNext = resolve;
                    });
                }
            }
        } finally {
            this.removeEventListener(eventType, handler);
        }
    }
    
    // Método de montagem
    async mount() {
        const data = privateData.get(this);
        
        if (data.mounted) {
            throw new Error('Component already mounted');
        }
        
        await this[_render]();
        data.mounted = true;
        
        // Montar filhos
        for (const child of data.children) {
            await child.mount();
        }
        
        this.onMount?.();
    }
    
    // Método de desmontagem
    async unmount() {
        const data = privateData.get(this);
        
        if (!data.mounted) {
            return;
        }
        
        // Desmontar filhos
        for (const child of data.children) {
            await child.unmount();
        }
        
        this.onUnmount?.();
        await this[_destroy]();
        data.mounted = false;
    }
    
    // Métodos privados (implementados pelas subclasses)
    [_render]() {
        // Implementação padrão vazia
    }
    
    [_update](oldState, newState) {
        // Re-render por padrão
        this[_render]();
    }
    
    [_destroy]() {
        const data = privateData.get(this);
        
        // Limpar todos os listeners
        for (const [event, handlers] of data.listeners) {
            for (const handler of handlers) {
                data.element.removeEventListener(event, handler);
            }
        }
        
        data.listeners.clear();
    }
}

// Mixin para funcionalidade de drag and drop
const DraggableMixin = {
    makeDraggable(options = {}) {
        const data = privateData.get(this);
        let isDragging = false;
        let startX, startY, initialX, initialY;
        
        const handleStart = (e) => {
            isDragging = true;
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            startX = clientX;
            startY = clientY;
            
            const rect = data.element.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            data.element.style.cursor = 'grabbing';
            options.onDragStart?.(e);
        };
        
        const handleMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const clientX = e.clientX || e.touches[0].clientX;
            const clientY = e.clientY || e.touches[0].clientY;
            
            const deltaX = clientX - startX;
            const deltaY = clientY - startY;
            
            data.element.style.left = `${initialX + deltaX}px`;
            data.element.style.top = `${initialY + deltaY}px`;
            
            options.onDrag?.(e, { deltaX, deltaY });
        };
        
        const handleEnd = (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            data.element.style.cursor = 'grab';
            options.onDragEnd?.(e);
        };
        
        // Mouse events
        this.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
        
        // Touch events
        this.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        
        data.element.style.cursor = 'grab';
        data.element.style.position = 'absolute';
    }
};

// Mixin para animações
const AnimatableMixin = {
    async animate(keyframes, options = {}) {
        const data = privateData.get(this);
        const {
            duration = 300,
            easing = 'ease',
            fill = 'forwards',
            ...animationOptions
        } = options;
        
        return new Promise((resolve, reject) => {
            const animation = data.element.animate(keyframes, {
                duration,
                easing,
                fill,
                ...animationOptions
            });
            
            animation.onfinish = () => resolve(animation);
            animation.oncancel = () => reject(new Error('Animation cancelled'));
        });
    },
    
    async fadeIn(duration = 300) {
        return this.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration });
    },
    
    async fadeOut(duration = 300) {
        return this.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], { duration });
    },
    
    async slideIn(direction = 'left', duration = 300) {
        const transforms = {
            left: ['translateX(-100%)', 'translateX(0)'],
            right: ['translateX(100%)', 'translateX(0)'],
            up: ['translateY(-100%)', 'translateY(0)'],
            down: ['translateY(100%)', 'translateY(0)']
        };
        
        return this.animate([
            { transform: transforms[direction][0] },
            { transform: transforms[direction][1] }
        ], { duration });
    }
};

// Aplicar mixins à classe Component
Object.assign(Component.prototype, DraggableMixin, AnimatableMixin);

// Componente específico: Modal
class Modal extends Component {
    constructor(options = {}) {
        // Criar elemento do modal
        const modalElement = document.createElement('div');
        modalElement.className = 'modal';
        modalElement.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${options.title || 'Modal'}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    ${options.content || ''}
                </div>
                <div class="modal-footer">
                    <button class="btn-cancel">Cancelar</button>
                    <button class="btn-confirm">Confirmar</button>
                </div>
            </div>
        `;
        
        super(modalElement, options);
        
        this.setState({
            title: options.title || 'Modal',
            content: options.content || '',
            visible: false
        });
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Fechar modal
        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop') || 
                e.target.classList.contains('modal-close') ||
                e.target.classList.contains('btn-cancel')) {
                this.hide();
            }
        });
        
        // Confirmar modal
        this.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-confirm')) {
                this.confirm();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.visible) {
                this.hide();
            }
        });
    }
    
    async [_render]() {
        const data = privateData.get(this);
        const { title, content } = this.state;
        
        const titleElement = data.element.querySelector('.modal-header h3');
        const contentElement = data.element.querySelector('.modal-body');
        
        if (titleElement) titleElement.textContent = title;
        if (contentElement) contentElement.innerHTML = content;
    }
    
    async show() {
        const data = privateData.get(this);
        
        if (this.state.visible) return;
        
        document.body.appendChild(data.element);
        this.setState({ visible: true });
        
        await this.fadeIn();
        
        this.onShow?.();
    }
    
    async hide() {
        const data = privateData.get(this);
        
        if (!this.state.visible) return;
        
        await this.fadeOut();
        
        if (data.element.parentNode) {
            data.element.parentNode.removeChild(data.element);
        }
        
        this.setState({ visible: false });
        this.onHide?.();
    }
    
    confirm() {
        this.onConfirm?.();
        this.hide();
    }
}

// Componente: Lista com itens draggable
class DraggableList extends Component {
    constructor(element, options = {}) {
        super(element, options);
        
        this.setState({
            items: options.items || [],
            sortable: options.sortable !== false
        });
    }
    
    async [_render]() {
        const data = privateData.get(this);
        const { items, sortable } = this.state;
        
        data.element.innerHTML = '';
        data.element.className = 'draggable-list';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'list-item';
            itemElement.draggable = sortable;
            itemElement.innerHTML = `
                <span class="item-content">${item.content || item}</span>
                <button class="item-remove">×</button>
            `;
            
            // Criar componente para o item
            const itemComponent = new Component(itemElement);
            
            if (sortable) {
                itemComponent.makeDraggable({
                    onDragStart: () => {
                        itemElement.style.opacity = '0.5';
                    },
                    onDragEnd: () => {
                        itemElement.style.opacity = '1';
                    }
                });
            }
            
            // Event listener para remover item
            itemComponent.addEventListener('click', (e) => {
                if (e.target.classList.contains('item-remove')) {
                    this.removeItem(index);
                }
            });
            
            this.addChild(itemComponent);
            data.element.appendChild(itemElement);
        });
    }
    
    addItem(item) {
        const items = [...this.state.items, item];
        this.setState({ items });
    }
    
    removeItem(index) {
        const items = this.state.items.filter((_, i) => i !== index);
        this.setState({ items });
    }
    
    // Generator para iterar sobre itens
    * getItems() {
        yield* this.state.items;
    }
}

// Factory para criar componentes
class ComponentFactory {
    static components = new Map([
        ['modal', Modal],
        ['draggable-list', DraggableList]
    ]);
    
    static register(name, componentClass) {
        this.components.set(name, componentClass);
    }
    
    static create(type, ...args) {
        const ComponentClass = this.components.get(type);
        
        if (!ComponentClass) {
            throw new Error(`Component type '${type}' not found`);
        }
        
        return new ComponentClass(...args);
    }
    
    static * getRegisteredTypes() {
        yield* this.components.keys();
    }
}

// Demonstração do sistema de componentes
function demonstrarSistemaComponentes() {
    console.log('\n🧩 EXERCÍCIO 2: Sistema de Módulos e Componentes');
    console.log('=' .repeat(50));
    
    // Criar container para demonstração
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 400px;
        height: 300px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        padding: 20px;
        z-index: 1000;
    `;
    
    // Adicionar estilos para os componentes
    const styles = document.createElement('style');
    styles.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            min-width: 300px;
        }
        
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .modal-footer {
            padding: 20px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .draggable-list {
            border: 1px solid #ddd;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .list-item {
            padding: 10px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        
        .list-item:hover {
            background: #f5f5f5;
        }
        
        .item-remove {
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
        
        button {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-confirm {
            background: #007bff;
            color: white;
            border-color: #007bff;
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(container);
    
    // Criar lista draggable
    const listContainer = document.createElement('div');
    container.appendChild(listContainer);
    
    const draggableList = ComponentFactory.create('draggable-list', listContainer, {
        items: [
            { content: 'Item 1 - Arraste-me!' },
            { content: 'Item 2 - Eu também!' },
            { content: 'Item 3 - E eu!' }
        ]
    });
    
    // Botão para adicionar item
    const addButton = document.createElement('button');
    addButton.textContent = 'Adicionar Item';
    addButton.onclick = () => {
        const itemNumber = draggableList.state.items.length + 1;
        draggableList.addItem({ content: `Item ${itemNumber} - Novo!` });
    };
    
    // Botão para mostrar modal
    const modalButton = document.createElement('button');
    modalButton.textContent = 'Abrir Modal';
    modalButton.onclick = () => {
        const modal = ComponentFactory.create('modal', {
            title: 'Modal de Demonstração',
            content: '<p>Este é um modal criado com ES6+ features!</p>'
        });
        
        modal.onConfirm = () => {
            console.log('✅ Modal confirmado!');
        };
        
        modal.onHide = () => {
            console.log('❌ Modal fechado!');
        };
        
        modal.show();
    };
    
    container.appendChild(addButton);
    container.appendChild(modalButton);
    
    // Montar componentes
    draggableList.mount();
    
    console.log('🎯 Componentes criados:');
    console.log('   • Lista draggable com itens removíveis');
    console.log('   • Modal com animações');
    console.log('   • Sistema de eventos assíncronos');
    
    // Demonstrar async generator de eventos
    (async () => {
        console.log('\n🔄 Monitorando eventos da lista...');
        
        // Usar async generator para monitorar cliques
        const clickEvents = draggableList.events('click');
        
        for await (const event of clickEvents) {
            console.log(`👆 Click detectado em:`, event.target.className);
            
            // Parar após 5 eventos
            if (Math.random() < 0.2) {
                break;
            }
        }
        
        console.log('🛑 Monitoramento de eventos finalizado');
    })();
    
    // Demonstrar iteração com generators
    console.log('\n📋 Itens da lista:');
    for (const item of draggableList.getItems()) {
        console.log(`   • ${item.content}`);
    }
    
    // Demonstrar tipos de componentes registrados
    console.log('\n🏭 Tipos de componentes registrados:');
    for (const type of ComponentFactory.getRegisteredTypes()) {
        console.log(`   • ${type}`);
    }
    
    // Limpar após 10 segundos
    setTimeout(() => {
        draggableList.unmount();
        document.body.removeChild(container);
        document.head.removeChild(styles);
        console.log('🧹 Demonstração limpa!');
    }, 10000);
}

// Executar demonstração
setTimeout(() => {
    demonstrarSistemaComponentes();
}, 3000);

/*
========================================
EXERCÍCIO 3: SISTEMA DE DADOS REATIVO
========================================

Objetivo: Criar um sistema de gerenciamento de dados reativo
que utiliza Proxy, Reflect, Map, Set e outros recursos avançados
para criar uma experiência de desenvolvimento moderna.

Recursos ES6+ utilizados:
• Proxy e Reflect para reatividade
• Map e Set para estruturas de dados
• WeakMap e WeakSet para referências fracas
• Symbols para propriedades únicas
• Async iterators para streams de dados
• Template literals para queries
• Destructuring assignment avançado
*/

// Símbolos para propriedades internas
const _data = Symbol('data');
const _observers = Symbol('observers');
const _computed = Symbol('computed');
const _watchers = Symbol('watchers');
const _history = Symbol('history');

// WeakMap para metadados
const metadata = new WeakMap();

// Classe para observar mudanças em objetos
class ReactiveStore {
    constructor(initialData = {}) {
        this[_data] = new Map();
        this[_observers] = new Map();
        this[_computed] = new Map();
        this[_watchers] = new Set();
        this[_history] = [];
        
        // Configurar dados iniciais
        this.setData(initialData);
        
        // Retornar proxy para interceptar acessos
        return new Proxy(this, {
            get(target, prop, receiver) {
                if (typeof prop === 'string' && !prop.startsWith('_') && !(prop in target)) {
                    return target.get(prop);
                }
                return Reflect.get(target, prop, receiver);
            },
            
            set(target, prop, value, receiver) {
                if (typeof prop === 'string' && !prop.startsWith('_') && !(prop in target)) {
                    target.set(prop, value);
                    return true;
                }
                return Reflect.set(target, prop, value, receiver);
            },
            
            has(target, prop) {
                if (typeof prop === 'string' && !prop.startsWith('_')) {
                    return target.has(prop) || Reflect.has(target, prop);
                }
                return Reflect.has(target, prop);
            },
            
            ownKeys(target) {
                const keys = [...target[_data].keys(), ...Reflect.ownKeys(target)];
                return [...new Set(keys)];
            }
        });
    }
    
    // Definir dados com reatividade
    setData(data) {
        for (const [key, value] of Object.entries(data)) {
            this.set(key, value);
        }
    }
    
    // Obter valor
    get(key) {
        // Verificar computed properties primeiro
        if (this[_computed].has(key)) {
            const computedFn = this[_computed].get(key);
            return computedFn();
        }
        
        return this[_data].get(key);
    }
    
    // Definir valor com notificação
    set(key, value) {
        const oldValue = this[_data].get(key);
        
        // Salvar no histórico
        this[_history].push({
            type: 'set',
            key,
            oldValue,
            newValue: value,
            timestamp: Date.now()
        });
        
        // Definir novo valor
        this[_data].set(key, value);
        
        // Notificar observadores
        this.notify(key, value, oldValue);
        
        // Notificar watchers globais
        for (const watcher of this[_watchers]) {
            watcher(key, value, oldValue);
        }
    }
    
    // Verificar se existe
    has(key) {
        return this[_data].has(key) || this[_computed].has(key);
    }
    
    // Deletar valor
    delete(key) {
        const oldValue = this[_data].get(key);
        const deleted = this[_data].delete(key);
        
        if (deleted) {
            this[_history].push({
                type: 'delete',
                key,
                oldValue,
                timestamp: Date.now()
            });
            
            this.notify(key, undefined, oldValue);
        }
        
        return deleted;
    }
    
    // Observar mudanças em uma chave
    observe(key, callback) {
        if (!this[_observers].has(key)) {
            this[_observers].set(key, new Set());
        }
        
        this[_observers].get(key).add(callback);
        
        // Retornar função para parar de observar
        return () => {
            const observers = this[_observers].get(key);
            if (observers) {
                observers.delete(callback);
                if (observers.size === 0) {
                    this[_observers].delete(key);
                }
            }
        };
    }
    
    // Adicionar watcher global
    watch(callback) {
        this[_watchers].add(callback);
        
        return () => {
            this[_watchers].delete(callback);
        };
    }
    
    // Notificar observadores
    notify(key, newValue, oldValue) {
        const observers = this[_observers].get(key);
        if (observers) {
            for (const callback of observers) {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error('Error in observer:', error);
                }
            }
        }
    }
    
    // Definir propriedade computada
    computed(key, computeFn) {
        this[_computed].set(key, computeFn);
        
        // Retornar função para remover
        return () => {
            this[_computed].delete(key);
        };
    }
    
    // Async iterator para mudanças
    async * changes(key) {
        const changeQueue = [];
        let resolveNext;
        
        const unobserve = this.observe(key, (newValue, oldValue) => {
            const change = { key, newValue, oldValue, timestamp: Date.now() };
            
            if (resolveNext) {
                resolveNext(change);
                resolveNext = null;
            } else {
                changeQueue.push(change);
            }
        });
        
        try {
            while (true) {
                if (changeQueue.length > 0) {
                    yield changeQueue.shift();
                } else {
                    yield await new Promise(resolve => {
                        resolveNext = resolve;
                    });
                }
            }
        } finally {
            unobserve();
        }
    }
    
    // Obter histórico
    getHistory(limit = 10) {
        return this[_history].slice(-limit);
    }
    
    // Desfazer última operação
    undo() {
        const lastChange = this[_history].pop();
        
        if (!lastChange) {
            return false;
        }
        
        if (lastChange.type === 'set') {
            if (lastChange.oldValue !== undefined) {
                this[_data].set(lastChange.key, lastChange.oldValue);
            } else {
                this[_data].delete(lastChange.key);
            }
        } else if (lastChange.type === 'delete') {
            this[_data].set(lastChange.key, lastChange.oldValue);
        }
        
        return true;
    }
    
    // Exportar dados
    toObject() {
        const result = {};
        
        for (const [key, value] of this[_data]) {
            result[key] = value;
        }
        
        // Adicionar computed properties
        for (const [key] of this[_computed]) {
            result[key] = this.get(key);
        }
        
        return result;
    }
    
    // Query com template literals
    query(queryTemplate, ...values) {
        const query = queryTemplate.reduce((acc, str, i) => {
            return acc + str + (values[i] || '');
        }, '');
        
        // Parser simples de query
        const [operation, ...params] = query.trim().split(' ');
        
        switch (operation.toLowerCase()) {
            case 'select':
                return this.select(params);
            case 'where':
                return this.where(params.join(' '));
            case 'count':
                return this[_data].size;
            default:
                throw new Error(`Unknown query operation: ${operation}`);
        }
    }
    
    // Selecionar chaves
    select(keys) {
        const result = {};
        
        for (const key of keys) {
            if (this.has(key)) {
                result[key] = this.get(key);
            }
        }
        
        return result;
    }
    
    // Filtrar dados
    where(condition) {
        const result = new Map();
        
        for (const [key, value] of this[_data]) {
            // Avaliação simples de condição
            if (this.evaluateCondition(key, value, condition)) {
                result.set(key, value);
            }
        }
        
        return result;
    }
    
    // Avaliar condição simples
    evaluateCondition(key, value, condition) {
        // Implementação básica - em produção usaria um parser mais robusto
        if (condition.includes('=')) {
            const [condKey, condValue] = condition.split('=').map(s => s.trim());
            return key === condKey && String(value) === condValue.replace(/["']/g, '');
        }
        
        return false;
    }
}

// Classe para coleções reativas
class ReactiveCollection extends ReactiveStore {
    constructor(items = []) {
        super();
        
        this.items = new Map();
        this.indexes = new Map();
        
        // Adicionar itens iniciais
        items.forEach((item, index) => {
            this.add(item, index);
        });
    }
    
    // Adicionar item
    add(item, id = null) {
        const itemId = id ?? this.generateId();
        
        this.items.set(itemId, item);
        this.updateIndexes(itemId, item);
        
        this.set(`item_${itemId}`, item);
        
        return itemId;
    }
    
    // Remover item
    remove(id) {
        const item = this.items.get(id);
        
        if (item) {
            this.items.delete(id);
            this.removeFromIndexes(id, item);
            this.delete(`item_${id}`);
        }
        
        return item;
    }
    
    // Atualizar item
    update(id, newItem) {
        const oldItem = this.items.get(id);
        
        if (oldItem) {
            this.removeFromIndexes(id, oldItem);
            this.items.set(id, newItem);
            this.updateIndexes(id, newItem);
            this.set(`item_${id}`, newItem);
        }
        
        return oldItem;
    }
    
    // Buscar por índice
    findBy(field, value) {
        const indexKey = `${field}:${value}`;
        return this.indexes.get(indexKey) || new Set();
    }
    
    // Gerar ID único
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Atualizar índices
    updateIndexes(id, item) {
        if (typeof item === 'object' && item !== null) {
            for (const [field, value] of Object.entries(item)) {
                const indexKey = `${field}:${value}`;
                
                if (!this.indexes.has(indexKey)) {
                    this.indexes.set(indexKey, new Set());
                }
                
                this.indexes.get(indexKey).add(id);
            }
        }
    }
    
    // Remover dos índices
    removeFromIndexes(id, item) {
        if (typeof item === 'object' && item !== null) {
            for (const [field, value] of Object.entries(item)) {
                const indexKey = `${field}:${value}`;
                const indexSet = this.indexes.get(indexKey);
                
                if (indexSet) {
                    indexSet.delete(id);
                    if (indexSet.size === 0) {
                        this.indexes.delete(indexKey);
                    }
                }
            }
        }
    }
    
    // Iterator para itens
    * [Symbol.iterator]() {
        for (const [id, item] of this.items) {
            yield { id, ...item };
        }
    }
    
    // Async iterator para mudanças na coleção
    async * itemChanges() {
        const changeQueue = [];
        let resolveNext;
        
        const unwatch = this.watch((key, newValue, oldValue) => {
            if (key.startsWith('item_')) {
                const id = key.substring(5);
                const change = {
                    type: oldValue === undefined ? 'add' : newValue === undefined ? 'remove' : 'update',
                    id,
                    item: newValue,
                    oldItem: oldValue,
                    timestamp: Date.now()
                };
                
                if (resolveNext) {
                    resolveNext(change);
                    resolveNext = null;
                } else {
                    changeQueue.push(change);
                }
            }
        });
        
        try {
            while (true) {
                if (changeQueue.length > 0) {
                    yield changeQueue.shift();
                } else {
                    yield await new Promise(resolve => {
                        resolveNext = resolve;
                    });
                }
            }
        } finally {
            unwatch();
        }
    }
    
    // Obter estatísticas
    getStats() {
        return {
            totalItems: this.items.size,
            totalIndexes: this.indexes.size,
            memoryUsage: this.estimateMemoryUsage()
        };
    }
    
    // Estimar uso de memória
    estimateMemoryUsage() {
        let size = 0;
        
        for (const item of this.items.values()) {
            size += JSON.stringify(item).length;
        }
        
        return size;
    }
}

// Demonstração do sistema reativo
function demonstrarSistemaReativo() {
    console.log('\n⚡ EXERCÍCIO 3: Sistema de Dados Reativo');
    console.log('=' .repeat(50));
    
    // Criar store reativo
    const store = new ReactiveStore({
        user: { name: 'João', age: 30 },
        settings: { theme: 'dark', language: 'pt-BR' },
        counter: 0
    });
    
    // Demonstrar acesso via proxy
    console.log('👤 Usuário:', store.user);
    console.log('⚙️ Configurações:', store.settings);
    
    // Adicionar propriedade computada
    store.computed('userInfo', () => {
        const user = store.get('user');
        return user ? `${user.name} (${user.age} anos)` : 'Usuário não definido';
    });
    
    console.log('📊 Info computada:', store.userInfo);
    
    // Observar mudanças
    const unobserveUser = store.observe('user', (newUser, oldUser) => {
        console.log('👤 Usuário alterado:', { old: oldUser, new: newUser });
    });
    
    const unobserveCounter = store.observe('counter', (newValue, oldValue) => {
        console.log(`🔢 Contador: ${oldValue} → ${newValue}`);
    });
    
    // Watcher global
    const unwatchGlobal = store.watch((key, newValue, oldValue) => {
        console.log(`🔍 Mudança global em '${key}':`, { old: oldValue, new: newValue });
    });
    
    // Testar mudanças
    console.log('\n🔄 Testando mudanças...');
    
    store.user = { name: 'Maria', age: 25 };
    store.counter = 1;
    store.counter = 2;
    
    // Usar query com template literals
    console.log('\n🔍 Testando queries:');
    
    const userData = store.query`select user settings`;
    console.log('📋 Dados selecionados:', userData);
    
    const count = store.query`count`;
    console.log('📊 Total de itens:', count);
    
    // Demonstrar histórico
    console.log('\n📜 Histórico de mudanças:');
    const history = store.getHistory(5);
    history.forEach((change, index) => {
        console.log(`   ${index + 1}. ${change.type} '${change.key}': ${JSON.stringify(change.oldValue)} → ${JSON.stringify(change.newValue)}`);
    });
    
    // Testar undo
    console.log('\n↩️ Testando undo...');
    console.log('Antes do undo - Counter:', store.counter);
    store.undo();
    console.log('Após undo - Counter:', store.counter);
    
    // Demonstrar coleção reativa
    console.log('\n📚 Testando coleção reativa...');
    
    const collection = new ReactiveCollection([
        { name: 'João', age: 30, city: 'São Paulo' },
        { name: 'Maria', age: 25, city: 'Rio de Janeiro' },
        { name: 'Pedro', age: 35, city: 'São Paulo' }
    ]);
    
    // Buscar por índice
    const sãoPauloUsers = collection.findBy('city', 'São Paulo');
    console.log('🏙️ Usuários de São Paulo:', sãoPauloUsers.size);
    
    // Adicionar novo item
    const newId = collection.add({ name: 'Ana', age: 28, city: 'Brasília' });
    console.log('➕ Novo item adicionado com ID:', newId);
    
    // Iterar sobre coleção
    console.log('\n👥 Todos os usuários:');
    for (const user of collection) {
        console.log(`   • ${user.name} (${user.age}) - ${user.city}`);
    }
    
    // Demonstrar async iterator
    (async () => {
        console.log('\n🔄 Monitorando mudanças na coleção...');
        
        const changes = collection.itemChanges();
        
        // Simular algumas mudanças
        setTimeout(() => {
            collection.update(newId, { name: 'Ana Silva', age: 29, city: 'Brasília' });
        }, 1000);
        
        setTimeout(() => {
            collection.remove(newId);
        }, 2000);
        
        // Monitorar por 3 segundos
        const timeout = setTimeout(() => {
            changes.return(); // Finalizar iterator
        }, 3000);
        
        try {
            for await (const change of changes) {
                console.log(`📝 Mudança na coleção:`, change);
            }
        } catch (error) {
            console.log('🛑 Monitoramento finalizado');
        } finally {
            clearTimeout(timeout);
        }
    })();
    
    // Estatísticas
    console.log('\n📊 Estatísticas da coleção:', collection.getStats());
    
    // Limpar observadores após um tempo
    setTimeout(() => {
        unobserveUser();
        unobserveCounter();
        unwatchGlobal();
        console.log('🧹 Observadores removidos');
    }, 5000);
}

// Executar demonstração
setTimeout(() => {
    demonstrarSistemaReativo();
}, 5000);

/*
========================================
CONCEITOS APLICADOS
========================================

1. DESTRUCTURING:
   • Destructuring de objetos com default values
   • Destructuring de arrays e nested objects
   • Rest/spread operators em destructuring
   • Renomeação de variáveis no destructuring

2. ARROW FUNCTIONS:
   • Sintaxe concisa para funções
   • Lexical this binding
   • Implicit return para expressões
   • Uso em callbacks e higher-order functions

3. CLASSES E HERANÇA:
   • Sintaxe de classe ES6
   • Herança com extends
   • Super calls e method overriding
   • Static methods e getters/setters

4. SYMBOLS:
   • Propriedades únicas e privadas
   • Symbol.iterator para iterables customizados
   • Well-known symbols
   • Symbol registry global

5. PROXY E REFLECT:
   • Interceptação de operações em objetos
   • Validação automática de propriedades
   • Metaprogramação avançada
   • Transparent proxies

6. MAP, SET, WEAKMAP, WEAKSET:
   • Estruturas de dados nativas
   • Chaves de qualquer tipo (Map)
   • Valores únicos (Set)
   • Garbage collection automático (Weak*)
   • Performance otimizada

7. GENERATORS E ASYNC GENERATORS:
   • Funções pausáveis e resumíveis
   • Lazy evaluation
   • Iteração assíncrona
   • Controle de fluxo avançado

8. TEMPLATE LITERALS:
   • String interpolation
   • Multiline strings
   • Tagged templates
   • Raw strings

9. ASYNC/AWAIT:
   • Sintaxe síncrona para código assíncrono
   • Error handling com try/catch
   • Promise composition
   • Parallel execution

10. MODULES:
    • Import/export statements
    • Named e default exports
    • Dynamic imports
    • Module namespaces

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. ORGANIZAÇÃO:
   • Separação de responsabilidades
   • Encapsulamento com símbolos e WeakMaps
   • Interfaces consistentes
   • Documentação inline

2. PERFORMANCE:
   • Lazy loading com generators
   • Cache inteligente
   • Memory management com WeakMaps
   • Efficient data structures

3. MANUTENIBILIDADE:
   • Código autodocumentado
   • Error handling robusto
   • Extensibilidade via mixins
   • Testing-friendly design

4. SEGURANÇA:
   • Propriedades privadas reais
   • Validação de entrada
   • Immutability patterns
   • Safe property access

========================================
EXERCÍCIOS PROPOSTOS
========================================

BÁSICO:
1. Criar uma classe Calculator que usa destructuring para operações
2. Implementar um sistema de cache usando Map e WeakMap
3. Criar iteradores customizados com Symbol.iterator
4. Usar template literals para criar um sistema de templates

INTERMEDIÁRIO:
5. Implementar um sistema de eventos usando Proxy
6. Criar um ORM simples com generators e async/await
7. Desenvolver um sistema de validação com decorators (proposal)
8. Implementar um state manager reativo

AVANÇADO:
9. Criar um transpiler simples usando AST
10. Implementar um sistema de módulos dinâmicos
11. Desenvolver um framework de componentes reativo
12. Criar um sistema de debugging avançado

========================================
FERRAMENTAS RECOMENDADAS
========================================

• Babel - Transpilação ES6+
• ESLint - Linting e boas práticas
• Prettier - Formatação de código
• TypeScript - Type safety
• Webpack - Module bundling
• Jest - Testing framework
• Chrome DevTools - Debugging
• Node.js - Runtime environment

========================================
RECURSOS ADICIONAIS
========================================

• MDN Web Docs - Documentação oficial
• ECMAScript Specifications - Especificações oficiais
• Babel REPL - Teste de transformações
• Can I Use - Compatibilidade de browsers
• TC39 Proposals - Futuras features
• JavaScript.info - Tutoriais detalhados
*/

console.log('\n✅ EXERCÍCIOS DE RECURSOS ES6+ CONCLUÍDOS!');
console.log('🎯 Conceitos cobertos:');
console.log('   • Destructuring e spread/rest operators');
console.log('   • Arrow functions e lexical this');
console.log('   • Classes, herança e mixins');
console.log('   • Symbols para propriedades privadas');
console.log('   • Proxy e Reflect para metaprogramação');
console.log('   • Map, Set, WeakMap, WeakSet');
console.log('   • Generators e async generators');
console.log('   • Template literals e tagged templates');
console.log('   • Async/await e error handling');
console.log('   • Modules e dynamic imports');
console.log('\n🚀 Continue praticando esses conceitos em projetos reais!');
console.log('📚 Consulte a documentação para features mais avançadas!');

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ConfigManager,
        EnvironmentConfig,
        Component,
        Modal,
        DraggableList,
        ComponentFactory,
        ReactiveStore,
        ReactiveCollection
    };
}