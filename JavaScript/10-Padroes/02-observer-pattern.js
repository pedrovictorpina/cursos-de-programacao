/**
 * MÓDULO 10: PADRÕES DE DESIGN EM JAVASCRIPT
 * Arquivo 02: Observer Pattern
 * 
 * O Observer Pattern é fundamental para programação orientada a eventos,
 * permitindo comunicação desacoplada entre objetos através de notificações.
 * 
 * Professor: Este padrão é a base de muitos frameworks modernos como React, Vue
 * e sistemas de state management. Vamos explorar desde implementações básicas
 * até sistemas complexos de eventos.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender o conceito e benefícios do Observer Pattern
2. Implementar Subject e Observer básicos
3. Criar sistemas de eventos avançados
4. Aplicar o padrão em cenários reais
5. Integrar com outros padrões de design
*/

// ==========================================
// TEORIA: OBSERVER PATTERN
// ==========================================

/*
CONCEITO:
O Observer Pattern define uma dependência um-para-muitos entre objetos,
de modo que quando um objeto muda de estado, todos os seus dependentes
são notificados e atualizados automaticamente.

COMPONENTES:
- Subject (Observable): Mantém lista de observers e os notifica
- Observer: Interface para objetos que devem ser notificados
- ConcreteSubject: Implementação específica do subject
- ConcreteObserver: Implementação específica do observer

BENEFÍCIOS:
- Baixo acoplamento entre objetos
- Comunicação dinâmica
- Suporte a broadcast de comunicação
- Princípio Aberto/Fechado

USOS COMUNS:
- Event handling em DOM
- Model-View architectures
- State management
- Real-time notifications
- Data binding
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. OBSERVER PATTERN BÁSICO
console.log('\n=== 1. Observer Pattern Básico ===');

// Subject básico
class Subject {
    constructor() {
        this.observers = [];
        this.state = null;
    }
    
    // Adicionar observer
    subscribe(observer) {
        if (typeof observer.update === 'function') {
            this.observers.push(observer);
            console.log(`Observer adicionado. Total: ${this.observers.length}`);
            return true;
        }
        throw new Error('Observer deve implementar método update()');
    }
    
    // Remover observer
    unsubscribe(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
            console.log(`Observer removido. Total: ${this.observers.length}`);
            return true;
        }
        return false;
    }
    
    // Notificar todos os observers
    notify(data) {
        console.log(`Notificando ${this.observers.length} observers`);
        this.observers.forEach(observer => {
            try {
                observer.update(data, this);
            } catch (error) {
                console.error('Erro ao notificar observer:', error);
            }
        });
    }
    
    // Alterar estado e notificar
    setState(newState) {
        const oldState = this.state;
        this.state = newState;
        this.notify({
            type: 'state_change',
            oldState,
            newState,
            timestamp: new Date()
        });
    }
    
    getState() {
        return this.state;
    }
}

// Observer básico
class Observer {
    constructor(name) {
        this.name = name;
    }
    
    update(data, subject) {
        console.log(`[${this.name}] Recebeu notificação:`, {
            type: data.type,
            newState: data.newState,
            timestamp: data.timestamp.toISOString()
        });
    }
}

// Testando Observer básico
const subject = new Subject();
const observer1 = new Observer('Observer-1');
const observer2 = new Observer('Observer-2');
const observer3 = new Observer('Observer-3');

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.subscribe(observer3);

subject.setState({ user: 'João', status: 'online' });
subject.setState({ user: 'João', status: 'busy' });

subject.unsubscribe(observer2);
subject.setState({ user: 'João', status: 'offline' });

// 2. EVENT EMITTER AVANÇADO
console.log('\n=== 2. Event Emitter Avançado ===');

class EventEmitter {
    constructor() {
        this.events = new Map();
        this.maxListeners = 10;
        this.stats = {
            totalEvents: 0,
            totalListeners: 0
        };
    }
    
    // Adicionar listener
    on(event, listener, options = {}) {
        if (typeof listener !== 'function') {
            throw new Error('Listener deve ser uma função');
        }
        
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        const listeners = this.events.get(event);
        
        // Verificar limite de listeners
        if (listeners.length >= this.maxListeners) {
            console.warn(`Limite de listeners atingido para evento '${event}'`);
            return this;
        }
        
        const listenerObj = {
            fn: listener,
            once: options.once || false,
            priority: options.priority || 0,
            context: options.context || null,
            id: `${event}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        };
        
        listeners.push(listenerObj);
        
        // Ordenar por prioridade (maior primeiro)
        listeners.sort((a, b) => b.priority - a.priority);
        
        this.stats.totalListeners++;
        
        console.log(`Listener adicionado para '${event}' (ID: ${listenerObj.id})`);
        return listenerObj.id;
    }
    
    // Adicionar listener que executa apenas uma vez
    once(event, listener, options = {}) {
        return this.on(event, listener, { ...options, once: true });
    }
    
    // Remover listener
    off(event, listenerOrId) {
        if (!this.events.has(event)) {
            return false;
        }
        
        const listeners = this.events.get(event);
        let index = -1;
        
        if (typeof listenerOrId === 'string') {
            // Remover por ID
            index = listeners.findIndex(l => l.id === listenerOrId);
        } else {
            // Remover por função
            index = listeners.findIndex(l => l.fn === listenerOrId);
        }
        
        if (index > -1) {
            const removed = listeners.splice(index, 1)[0];
            this.stats.totalListeners--;
            
            if (listeners.length === 0) {
                this.events.delete(event);
            }
            
            console.log(`Listener removido de '${event}' (ID: ${removed.id})`);
            return true;
        }
        
        return false;
    }
    
    // Emitir evento
    emit(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }
        
        const listeners = this.events.get(event);
        const toRemove = [];
        
        console.log(`Emitindo evento '${event}' para ${listeners.length} listeners`);
        
        listeners.forEach(listener => {
            try {
                if (listener.context) {
                    listener.fn.apply(listener.context, args);
                } else {
                    listener.fn(...args);
                }
                
                // Marcar para remoção se for 'once'
                if (listener.once) {
                    toRemove.push(listener);
                }
            } catch (error) {
                console.error(`Erro no listener ${listener.id}:`, error);
            }
        });
        
        // Remover listeners 'once'
        toRemove.forEach(listener => {
            this.off(event, listener.id);
        });
        
        this.stats.totalEvents++;
        return true;
    }
    
    // Remover todos os listeners de um evento
    removeAllListeners(event) {
        if (event) {
            if (this.events.has(event)) {
                const count = this.events.get(event).length;
                this.events.delete(event);
                this.stats.totalListeners -= count;
                console.log(`${count} listeners removidos de '${event}'`);
            }
        } else {
            // Remover todos os listeners
            const totalRemoved = Array.from(this.events.values())
                .reduce((sum, listeners) => sum + listeners.length, 0);
            this.events.clear();
            this.stats.totalListeners = 0;
            console.log(`${totalRemoved} listeners removidos`);
        }
        return this;
    }
    
    // Listar eventos
    eventNames() {
        return Array.from(this.events.keys());
    }
    
    // Contar listeners
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }
    
    // Obter estatísticas
    getStats() {
        return {
            ...this.stats,
            activeEvents: this.events.size,
            eventDetails: Array.from(this.events.entries()).map(([event, listeners]) => ({
                event,
                listenerCount: listeners.length,
                priorities: listeners.map(l => l.priority)
            }))
        };
    }
    
    // Configurar limite de listeners
    setMaxListeners(max) {
        this.maxListeners = max;
        return this;
    }
}

// Testando Event Emitter
const emitter = new EventEmitter();

// Listeners com diferentes prioridades
const id1 = emitter.on('user:login', (user) => {
    console.log(`[ALTA] Usuário logado: ${user.name}`);
}, { priority: 10 });

const id2 = emitter.on('user:login', (user) => {
    console.log(`[MÉDIA] Registrando login: ${user.name}`);
}, { priority: 5 });

const id3 = emitter.on('user:login', (user) => {
    console.log(`[BAIXA] Enviando analytics: ${user.name}`);
}, { priority: 1 });

// Listener que executa apenas uma vez
emitter.once('user:first_login', (user) => {
    console.log(`[ONCE] Primeiro login de: ${user.name}`);
});

// Emitindo eventos
emitter.emit('user:login', { name: 'João', id: 123 });
emitter.emit('user:first_login', { name: 'João', id: 123 });
emitter.emit('user:first_login', { name: 'João', id: 123 }); // Não executará

console.log('Stats do emitter:', emitter.getStats());

// 3. OBSERVABLE COM RXJS-LIKE
console.log('\n=== 3. Observable RxJS-like ===');

class Observable {
    constructor(subscribeFn) {
        this.subscribeFn = subscribeFn;
    }
    
    // Método subscribe
    subscribe(observer) {
        const subscription = {
            closed: false,
            unsubscribe: function() {
                this.closed = true;
                if (this.cleanup) {
                    this.cleanup();
                }
            }
        };
        
        try {
            const cleanup = this.subscribeFn({
                next: (value) => {
                    if (!subscription.closed && observer.next) {
                        observer.next(value);
                    }
                },
                error: (error) => {
                    if (!subscription.closed && observer.error) {
                        observer.error(error);
                    }
                    subscription.unsubscribe();
                },
                complete: () => {
                    if (!subscription.closed && observer.complete) {
                        observer.complete();
                    }
                    subscription.unsubscribe();
                }
            });
            
            subscription.cleanup = cleanup;
        } catch (error) {
            if (observer.error) {
                observer.error(error);
            }
        }
        
        return subscription;
    }
    
    // Operador map
    map(transformFn) {
        return new Observable(observer => {
            return this.subscribe({
                next: value => observer.next(transformFn(value)),
                error: error => observer.error(error),
                complete: () => observer.complete()
            });
        });
    }
    
    // Operador filter
    filter(predicateFn) {
        return new Observable(observer => {
            return this.subscribe({
                next: value => {
                    if (predicateFn(value)) {
                        observer.next(value);
                    }
                },
                error: error => observer.error(error),
                complete: () => observer.complete()
            });
        });
    }
    
    // Operador take
    take(count) {
        return new Observable(observer => {
            let taken = 0;
            return this.subscribe({
                next: value => {
                    if (taken < count) {
                        observer.next(value);
                        taken++;
                        if (taken === count) {
                            observer.complete();
                        }
                    }
                },
                error: error => observer.error(error),
                complete: () => observer.complete()
            });
        });
    }
    
    // Método estático para criar Observable de array
    static from(array) {
        return new Observable(observer => {
            array.forEach(item => observer.next(item));
            observer.complete();
        });
    }
    
    // Método estático para criar Observable de intervalo
    static interval(ms) {
        return new Observable(observer => {
            let count = 0;
            const intervalId = setInterval(() => {
                observer.next(count++);
            }, ms);
            
            return () => clearInterval(intervalId);
        });
    }
    
    // Método estático para criar Observable de evento DOM
    static fromEvent(element, eventType) {
        return new Observable(observer => {
            const handler = (event) => observer.next(event);
            element.addEventListener(eventType, handler);
            
            return () => element.removeEventListener(eventType, handler);
        });
    }
}

// Testando Observable
const numbers$ = Observable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const subscription = numbers$
    .filter(x => x % 2 === 0)
    .map(x => x * 2)
    .take(3)
    .subscribe({
        next: value => console.log(`Observable valor: ${value}`),
        complete: () => console.log('Observable completo'),
        error: error => console.error('Observable erro:', error)
    });

// Observable de intervalo (comentado para não interferir)
/*
const interval$ = Observable.interval(1000)
    .take(5)
    .subscribe({
        next: value => console.log(`Interval: ${value}`),
        complete: () => console.log('Interval completo')
    });
*/

// 4. SISTEMA DE STATE MANAGEMENT
console.log('\n=== 4. Sistema de State Management ===');

class Store {
    constructor(initialState = {}, reducer = null) {
        this.state = { ...initialState };
        this.reducer = reducer;
        this.subscribers = new Map();
        this.middleware = [];
        this.history = [{ ...initialState }];
        this.maxHistory = 50;
    }
    
    // Adicionar middleware
    use(middleware) {
        if (typeof middleware === 'function') {
            this.middleware.push(middleware);
        }
        return this;
    }
    
    // Subscribe a mudanças de estado
    subscribe(callback, selector = null) {
        const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        this.subscribers.set(id, {
            callback,
            selector,
            lastValue: selector ? selector(this.state) : this.state
        });
        
        console.log(`Subscriber adicionado: ${id}`);
        
        // Retornar função de unsubscribe
        return () => {
            this.subscribers.delete(id);
            console.log(`Subscriber removido: ${id}`);
        };
    }
    
    // Dispatch de ação
    dispatch(action) {
        console.log('Dispatching action:', action);
        
        // Executar middleware
        let processedAction = action;
        for (let middleware of this.middleware) {
            processedAction = middleware(processedAction, this.state, this);
            if (!processedAction) break;
        }
        
        if (!processedAction) return;
        
        // Aplicar reducer se disponível
        const newState = this.reducer 
            ? this.reducer(this.state, processedAction)
            : this.state;
        
        // Verificar se houve mudança
        if (newState !== this.state) {
            const oldState = this.state;
            this.state = { ...newState };
            
            // Adicionar ao histórico
            this.history.push({ ...this.state });
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
            
            // Notificar subscribers
            this.notifySubscribers(oldState);
        }
    }
    
    // Notificar subscribers
    notifySubscribers(oldState) {
        this.subscribers.forEach((subscriber, id) => {
            try {
                const currentValue = subscriber.selector 
                    ? subscriber.selector(this.state)
                    : this.state;
                
                const lastValue = subscriber.selector 
                    ? subscriber.selector(oldState)
                    : oldState;
                
                // Só notificar se o valor mudou
                if (currentValue !== lastValue) {
                    subscriber.callback(currentValue, lastValue);
                    subscriber.lastValue = currentValue;
                }
            } catch (error) {
                console.error(`Erro no subscriber ${id}:`, error);
            }
        });
    }
    
    // Obter estado atual
    getState() {
        return { ...this.state };
    }
    
    // Obter histórico
    getHistory() {
        return [...this.history];
    }
    
    // Voltar no histórico
    undo() {
        if (this.history.length > 1) {
            this.history.pop(); // Remove estado atual
            const previousState = this.history[this.history.length - 1];
            const oldState = this.state;
            this.state = { ...previousState };
            this.notifySubscribers(oldState);
            console.log('Undo executado');
            return true;
        }
        return false;
    }
    
    // Reset do estado
    reset() {
        const oldState = this.state;
        this.state = { ...this.history[0] };
        this.history = [{ ...this.state }];
        this.notifySubscribers(oldState);
        console.log('Estado resetado');
    }
}

// Reducer de exemplo
function appReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload
            };
        
        case 'SET_THEME':
            return {
                ...state,
                theme: action.payload
            };
        
        case 'INCREMENT_COUNTER':
            return {
                ...state,
                counter: (state.counter || 0) + 1
            };
        
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...(state.notifications || []), action.payload]
            };
        
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: (state.notifications || []).filter(n => n.id !== action.payload)
            };
        
        default:
            return state;
    }
}

// Middleware de logging
function loggingMiddleware(action, state, store) {
    console.log('🔄 Action:', action.type, action.payload);
    console.log('📊 State antes:', state);
    return action;
}

// Middleware de validação
function validationMiddleware(action, state, store) {
    if (action.type === 'SET_USER' && !action.payload.name) {
        console.error('❌ Usuário deve ter nome');
        return null; // Bloqueia a ação
    }
    return action;
}

// Criando store
const store = new Store(
    { counter: 0, theme: 'light', notifications: [] },
    appReducer
);

// Adicionando middleware
store.use(loggingMiddleware).use(validationMiddleware);

// Subscribers
const unsubscribeUser = store.subscribe(
    (user) => console.log('👤 Usuário mudou:', user),
    state => state.user
);

const unsubscribeTheme = store.subscribe(
    (theme) => console.log('🎨 Tema mudou:', theme),
    state => state.theme
);

const unsubscribeCounter = store.subscribe(
    (counter) => console.log('🔢 Contador:', counter),
    state => state.counter
);

// Testando store
store.dispatch({ type: 'SET_USER', payload: { name: 'João', age: 30 } });
store.dispatch({ type: 'SET_THEME', payload: 'dark' });
store.dispatch({ type: 'INCREMENT_COUNTER' });
store.dispatch({ type: 'INCREMENT_COUNTER' });
store.dispatch({ type: 'ADD_NOTIFICATION', payload: { id: 1, message: 'Bem-vindo!' } });

// Tentativa de ação inválida
store.dispatch({ type: 'SET_USER', payload: { age: 25 } }); // Será bloqueada

console.log('Estado final:', store.getState());

// 5. SISTEMA DE NOTIFICAÇÕES REAL-TIME
console.log('\n=== 5. Sistema de Notificações Real-time ===');

class NotificationCenter {
    constructor() {
        this.channels = new Map();
        this.globalListeners = [];
        this.stats = {
            totalNotifications: 0,
            totalChannels: 0,
            totalListeners: 0
        };
        this.filters = [];
        this.transformers = [];
    }
    
    // Criar canal
    createChannel(name, options = {}) {
        if (this.channels.has(name)) {
            console.warn(`Canal '${name}' já existe`);
            return this.channels.get(name);
        }
        
        const channel = {
            name,
            listeners: [],
            buffer: [],
            maxBuffer: options.maxBuffer || 100,
            persistent: options.persistent || false,
            priority: options.priority || 0,
            created: new Date()
        };
        
        this.channels.set(name, channel);
        this.stats.totalChannels++;
        
        console.log(`📢 Canal '${name}' criado`);
        return channel;
    }
    
    // Subscribe a canal
    subscribe(channelName, listener, options = {}) {
        let channel = this.channels.get(channelName);
        if (!channel) {
            channel = this.createChannel(channelName);
        }
        
        const subscription = {
            id: `${channelName}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            listener,
            filter: options.filter || null,
            transform: options.transform || null,
            once: options.once || false,
            priority: options.priority || 0,
            created: new Date()
        };
        
        channel.listeners.push(subscription);
        channel.listeners.sort((a, b) => b.priority - a.priority);
        
        this.stats.totalListeners++;
        
        console.log(`👂 Listener adicionado ao canal '${channelName}' (${subscription.id})`);
        
        // Se canal é persistente, enviar notificações do buffer
        if (channel.persistent && channel.buffer.length > 0) {
            channel.buffer.forEach(notification => {
                this.deliverToListener(subscription, notification, channel);
            });
        }
        
        // Retornar função de unsubscribe
        return () => {
            const index = channel.listeners.findIndex(l => l.id === subscription.id);
            if (index > -1) {
                channel.listeners.splice(index, 1);
                this.stats.totalListeners--;
                console.log(`🔇 Listener removido do canal '${channelName}' (${subscription.id})`);
            }
        };
    }
    
    // Subscribe global (todos os canais)
    subscribeGlobal(listener, options = {}) {
        const subscription = {
            id: `global_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            listener,
            filter: options.filter || null,
            channels: options.channels || null, // Array de canais específicos
            created: new Date()
        };
        
        this.globalListeners.push(subscription);
        console.log(`🌍 Listener global adicionado (${subscription.id})`);
        
        return () => {
            const index = this.globalListeners.findIndex(l => l.id === subscription.id);
            if (index > -1) {
                this.globalListeners.splice(index, 1);
                console.log(`🌍 Listener global removido (${subscription.id})`);
            }
        };
    }
    
    // Publicar notificação
    publish(channelName, data, options = {}) {
        const notification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            channel: channelName,
            data,
            timestamp: new Date(),
            priority: options.priority || 0,
            persistent: options.persistent || false,
            ttl: options.ttl || null
        };
        
        // Aplicar filtros globais
        for (let filter of this.filters) {
            if (!filter(notification)) {
                console.log(`🚫 Notificação filtrada: ${notification.id}`);
                return false;
            }
        }
        
        // Aplicar transformers globais
        for (let transformer of this.transformers) {
            notification.data = transformer(notification.data, notification);
        }
        
        console.log(`📨 Publicando em '${channelName}':`, notification.id);
        
        // Entregar para canal específico
        const channel = this.channels.get(channelName);
        if (channel) {
            this.deliverToChannel(channel, notification);
        }
        
        // Entregar para listeners globais
        this.deliverToGlobalListeners(notification);
        
        this.stats.totalNotifications++;
        return notification.id;
    }
    
    // Entregar para canal
    deliverToChannel(channel, notification) {
        // Adicionar ao buffer se persistente
        if (channel.persistent) {
            channel.buffer.push(notification);
            if (channel.buffer.length > channel.maxBuffer) {
                channel.buffer.shift();
            }
        }
        
        // Entregar para listeners do canal
        const toRemove = [];
        channel.listeners.forEach(subscription => {
            this.deliverToListener(subscription, notification, channel);
            
            if (subscription.once) {
                toRemove.push(subscription);
            }
        });
        
        // Remover listeners 'once'
        toRemove.forEach(subscription => {
            const index = channel.listeners.findIndex(l => l.id === subscription.id);
            if (index > -1) {
                channel.listeners.splice(index, 1);
                this.stats.totalListeners--;
            }
        });
    }
    
    // Entregar para listener específico
    deliverToListener(subscription, notification, channel) {
        try {
            let data = notification.data;
            
            // Aplicar filtro do listener
            if (subscription.filter && !subscription.filter(data, notification)) {
                return;
            }
            
            // Aplicar transform do listener
            if (subscription.transform) {
                data = subscription.transform(data, notification);
            }
            
            // Executar listener
            subscription.listener(data, {
                id: notification.id,
                channel: notification.channel,
                timestamp: notification.timestamp,
                priority: notification.priority
            });
            
        } catch (error) {
            console.error(`Erro no listener ${subscription.id}:`, error);
        }
    }
    
    // Entregar para listeners globais
    deliverToGlobalListeners(notification) {
        this.globalListeners.forEach(subscription => {
            // Verificar se listener é para canais específicos
            if (subscription.channels && !subscription.channels.includes(notification.channel)) {
                return;
            }
            
            try {
                let data = notification.data;
                
                // Aplicar filtro
                if (subscription.filter && !subscription.filter(data, notification)) {
                    return;
                }
                
                // Executar listener
                subscription.listener(data, {
                    id: notification.id,
                    channel: notification.channel,
                    timestamp: notification.timestamp,
                    priority: notification.priority
                });
                
            } catch (error) {
                console.error(`Erro no listener global ${subscription.id}:`, error);
            }
        });
    }
    
    // Adicionar filtro global
    addFilter(filter) {
        if (typeof filter === 'function') {
            this.filters.push(filter);
            return true;
        }
        return false;
    }
    
    // Adicionar transformer global
    addTransformer(transformer) {
        if (typeof transformer === 'function') {
            this.transformers.push(transformer);
            return true;
        }
        return false;
    }
    
    // Obter estatísticas
    getStats() {
        return {
            ...this.stats,
            channels: Array.from(this.channels.entries()).map(([name, channel]) => ({
                name,
                listeners: channel.listeners.length,
                bufferSize: channel.buffer.length,
                persistent: channel.persistent,
                created: channel.created
            })),
            globalListeners: this.globalListeners.length,
            filters: this.filters.length,
            transformers: this.transformers.length
        };
    }
    
    // Limpar canal
    clearChannel(channelName) {
        const channel = this.channels.get(channelName);
        if (channel) {
            this.stats.totalListeners -= channel.listeners.length;
            channel.listeners = [];
            channel.buffer = [];
            console.log(`🧹 Canal '${channelName}' limpo`);
            return true;
        }
        return false;
    }
    
    // Remover canal
    removeChannel(channelName) {
        const channel = this.channels.get(channelName);
        if (channel) {
            this.stats.totalListeners -= channel.listeners.length;
            this.stats.totalChannels--;
            this.channels.delete(channelName);
            console.log(`🗑️ Canal '${channelName}' removido`);
            return true;
        }
        return false;
    }
}

// Testando Notification Center
const notificationCenter = new NotificationCenter();

// Adicionar filtros e transformers globais
notificationCenter.addFilter((notification) => {
    // Filtrar notificações muito antigas (exemplo)
    return Date.now() - notification.timestamp.getTime() < 60000;
});

notificationCenter.addTransformer((data, notification) => {
    // Adicionar timestamp formatado
    return {
        ...data,
        formattedTime: notification.timestamp.toLocaleTimeString()
    };
});

// Criar canais
notificationCenter.createChannel('user-events', { persistent: true, maxBuffer: 50 });
notificationCenter.createChannel('system-alerts', { persistent: false });
notificationCenter.createChannel('chat-messages', { persistent: true, maxBuffer: 200 });

// Subscribers específicos
const unsubUser = notificationCenter.subscribe('user-events', (data, meta) => {
    console.log(`👤 [${meta.channel}] ${data.action}: ${data.user}`, data.formattedTime);
}, {
    filter: (data) => data.action !== 'heartbeat',
    priority: 10
});

const unsubSystem = notificationCenter.subscribe('system-alerts', (data, meta) => {
    console.log(`⚠️ [${meta.channel}] ${data.level}: ${data.message}`);
}, {
    filter: (data) => data.level === 'error' || data.level === 'warning'
});

const unsubChat = notificationCenter.subscribe('chat-messages', (data, meta) => {
    console.log(`💬 [${meta.channel}] ${data.from}: ${data.message}`);
});

// Listener global para auditoria
const unsubGlobal = notificationCenter.subscribeGlobal((data, meta) => {
    console.log(`📋 [AUDIT] Canal: ${meta.channel}, ID: ${meta.id}`);
});

// Publicar notificações
notificationCenter.publish('user-events', {
    action: 'login',
    user: 'João',
    ip: '192.168.1.100'
});

notificationCenter.publish('system-alerts', {
    level: 'error',
    message: 'Falha na conexão com banco de dados',
    code: 'DB_CONNECTION_FAILED'
});

notificationCenter.publish('chat-messages', {
    from: 'Maria',
    to: 'João',
    message: 'Olá! Como você está?',
    room: 'general'
});

notificationCenter.publish('user-events', {
    action: 'logout',
    user: 'João',
    duration: 3600
});

console.log('\nStats do Notification Center:', notificationCenter.getStats());

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE CHAT
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Chat ===');

class ChatSystem {
    constructor() {
        this.rooms = new Map();
        this.users = new Map();
        this.eventEmitter = new EventEmitter();
        this.messageHistory = [];
        this.maxHistory = 1000;
        this.stats = {
            totalMessages: 0,
            totalUsers: 0,
            totalRooms: 0
        };
    }
    
    // Criar sala
    createRoom(roomId, options = {}) {
        if (this.rooms.has(roomId)) {
            throw new Error(`Sala '${roomId}' já existe`);
        }
        
        const room = {
            id: roomId,
            name: options.name || roomId,
            description: options.description || '',
            maxUsers: options.maxUsers || 100,
            private: options.private || false,
            users: new Set(),
            messages: [],
            created: new Date(),
            owner: options.owner || null
        };
        
        this.rooms.set(roomId, room);
        this.stats.totalRooms++;
        
        this.eventEmitter.emit('room:created', { room: roomId, options });
        console.log(`🏠 Sala '${roomId}' criada`);
        
        return room;
    }
    
    // Registrar usuário
    registerUser(userId, userData) {
        if (this.users.has(userId)) {
            throw new Error(`Usuário '${userId}' já existe`);
        }
        
        const user = {
            id: userId,
            name: userData.name || userId,
            avatar: userData.avatar || null,
            status: 'offline',
            rooms: new Set(),
            lastSeen: new Date(),
            created: new Date()
        };
        
        this.users.set(userId, user);
        this.stats.totalUsers++;
        
        this.eventEmitter.emit('user:registered', { user: userId, data: userData });
        console.log(`👤 Usuário '${userId}' registrado`);
        
        return user;
    }
    
    // Entrar na sala
    joinRoom(userId, roomId) {
        const user = this.users.get(userId);
        const room = this.rooms.get(roomId);
        
        if (!user) {
            throw new Error(`Usuário '${userId}' não encontrado`);
        }
        
        if (!room) {
            throw new Error(`Sala '${roomId}' não encontrada`);
        }
        
        if (room.users.size >= room.maxUsers) {
            throw new Error(`Sala '${roomId}' está lotada`);
        }
        
        if (room.users.has(userId)) {
            console.log(`Usuário '${userId}' já está na sala '${roomId}'`);
            return;
        }
        
        room.users.add(userId);
        user.rooms.add(roomId);
        user.status = 'online';
        user.lastSeen = new Date();
        
        const joinMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'system',
            room: roomId,
            content: `${user.name} entrou na sala`,
            timestamp: new Date(),
            user: null
        };
        
        room.messages.push(joinMessage);
        this.addToHistory(joinMessage);
        
        this.eventEmitter.emit('user:joined', { user: userId, room: roomId });
        this.eventEmitter.emit(`room:${roomId}:message`, joinMessage);
        
        console.log(`👋 ${user.name} entrou na sala '${roomId}'`);
    }
    
    // Sair da sala
    leaveRoom(userId, roomId) {
        const user = this.users.get(userId);
        const room = this.rooms.get(roomId);
        
        if (!user || !room) {
            return false;
        }
        
        if (!room.users.has(userId)) {
            return false;
        }
        
        room.users.delete(userId);
        user.rooms.delete(roomId);
        
        if (user.rooms.size === 0) {
            user.status = 'offline';
        }
        
        const leaveMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'system',
            room: roomId,
            content: `${user.name} saiu da sala`,
            timestamp: new Date(),
            user: null
        };
        
        room.messages.push(leaveMessage);
        this.addToHistory(leaveMessage);
        
        this.eventEmitter.emit('user:left', { user: userId, room: roomId });
        this.eventEmitter.emit(`room:${roomId}:message`, leaveMessage);
        
        console.log(`👋 ${user.name} saiu da sala '${roomId}'`);
        return true;
    }
    
    // Enviar mensagem
    sendMessage(userId, roomId, content, type = 'text') {
        const user = this.users.get(userId);
        const room = this.rooms.get(roomId);
        
        if (!user) {
            throw new Error(`Usuário '${userId}' não encontrado`);
        }
        
        if (!room) {
            throw new Error(`Sala '${roomId}' não encontrada`);
        }
        
        if (!room.users.has(userId)) {
            throw new Error(`Usuário '${userId}' não está na sala '${roomId}'`);
        }
        
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type,
            room: roomId,
            content,
            user: {
                id: userId,
                name: user.name,
                avatar: user.avatar
            },
            timestamp: new Date(),
            edited: false,
            reactions: new Map()
        };
        
        room.messages.push(message);
        this.addToHistory(message);
        this.stats.totalMessages++;
        
        user.lastSeen = new Date();
        
        this.eventEmitter.emit('message:sent', { message, user: userId, room: roomId });
        this.eventEmitter.emit(`room:${roomId}:message`, message);
        
        console.log(`💬 [${room.name}] ${user.name}: ${content}`);
        
        return message;
    }
    
    // Adicionar reação
    addReaction(userId, messageId, emoji) {
        const message = this.findMessage(messageId);
        if (!message) {
            throw new Error(`Mensagem '${messageId}' não encontrada`);
        }
        
        const user = this.users.get(userId);
        if (!user) {
            throw new Error(`Usuário '${userId}' não encontrado`);
        }
        
        if (!message.reactions.has(emoji)) {
            message.reactions.set(emoji, new Set());
        }
        
        message.reactions.get(emoji).add(userId);
        
        this.eventEmitter.emit('message:reaction', {
            message: messageId,
            user: userId,
            emoji,
            action: 'add'
        });
        
        console.log(`${emoji} ${user.name} reagiu à mensagem`);
    }
    
    // Encontrar mensagem
    findMessage(messageId) {
        for (let room of this.rooms.values()) {
            const message = room.messages.find(m => m.id === messageId);
            if (message) return message;
        }
        return null;
    }
    
    // Adicionar ao histórico global
    addToHistory(message) {
        this.messageHistory.push(message);
        if (this.messageHistory.length > this.maxHistory) {
            this.messageHistory.shift();
        }
    }
    
    // Subscribe a eventos
    on(event, callback) {
        return this.eventEmitter.on(event, callback);
    }
    
    // Obter estatísticas
    getStats() {
        return {
            ...this.stats,
            onlineUsers: Array.from(this.users.values()).filter(u => u.status === 'online').length,
            rooms: Array.from(this.rooms.values()).map(room => ({
                id: room.id,
                name: room.name,
                users: room.users.size,
                messages: room.messages.length,
                created: room.created
            })),
            historySize: this.messageHistory.length
        };
    }
    
    // Obter mensagens da sala
    getRoomMessages(roomId, limit = 50) {
        const room = this.rooms.get(roomId);
        if (!room) return [];
        
        return room.messages.slice(-limit);
    }
    
    // Buscar mensagens
    searchMessages(query, roomId = null) {
        let messages = roomId 
            ? this.getRoomMessages(roomId, 1000)
            : this.messageHistory;
        
        return messages.filter(msg => 
            msg.content.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Testando Chat System
const chat = new ChatSystem();

// Event listeners
chat.on('user:joined', (data) => {
    console.log(`🔔 ${data.user} entrou na sala ${data.room}`);
});

chat.on('message:sent', (data) => {
    console.log(`📨 Nova mensagem de ${data.user} em ${data.room}`);
});

// Criar salas
chat.createRoom('general', { name: 'Geral', description: 'Sala principal' });
chat.createRoom('tech', { name: 'Tecnologia', description: 'Discussões técnicas' });

// Registrar usuários
chat.registerUser('joao', { name: 'João Silva', avatar: '👨‍💻' });
chat.registerUser('maria', { name: 'Maria Santos', avatar: '👩‍🎨' });
chat.registerUser('pedro', { name: 'Pedro Costa', avatar: '👨‍🔬' });

// Usuários entrando nas salas
chat.joinRoom('joao', 'general');
chat.joinRoom('maria', 'general');
chat.joinRoom('pedro', 'tech');
chat.joinRoom('joao', 'tech');

// Enviando mensagens
chat.sendMessage('joao', 'general', 'Olá pessoal!');
chat.sendMessage('maria', 'general', 'Oi João! Como você está?');
chat.sendMessage('joao', 'tech', 'Alguém conhece JavaScript?');
chat.sendMessage('pedro', 'tech', 'Sim! É minha linguagem favorita');

// Adicionando reações
const lastMessage = chat.getRoomMessages('tech').pop();
chat.addReaction('joao', lastMessage.id, '👍');
chat.addReaction('joao', lastMessage.id, '❤️');

console.log('\nStats do Chat:', chat.getStats());
console.log('\nMensagens da sala tech:', chat.getRoomMessages('tech'));

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Use WeakMap para referências fracas
2. Implemente debounce para eventos frequentes
3. Use Object.freeze() para dados imutáveis
4. Limite o número de listeners
5. Implemente cleanup automático
6. Use lazy loading para observers pesados
7. Considere usar Web Workers para processamento pesado

BOAS PRÁTICAS:
1. Sempre remover listeners não utilizados
2. Tratar erros em callbacks
3. Usar namespaces para eventos
4. Implementar rate limiting
5. Validar dados antes de notificar
6. Documentar contratos de eventos
7. Usar tipos específicos de eventos
8. Implementar logging adequado
9. Considerar performance com muitos observers
10. Usar padrões assíncronos quando apropriado

PADRÕES RELACIONADOS:
- Mediator Pattern (para comunicação complexa)
- Command Pattern (para ações)
- State Pattern (para mudanças de estado)
- Strategy Pattern (para diferentes comportamentos)
- Decorator Pattern (para funcionalidades adicionais)
*/

// Exemplo de Observer otimizado
class OptimizedObserver {
    constructor() {
        this.observers = new WeakMap();
        this.eventQueue = [];
        this.processing = false;
        this.batchSize = 10;
        this.debounceTime = 16; // ~60fps
    }
    
    subscribe(target, callback, options = {}) {
        if (!this.observers.has(target)) {
            this.observers.set(target, []);
        }
        
        const observer = {
            callback,
            debounced: this.debounce(callback, options.debounce || 0),
            throttled: this.throttle(callback, options.throttle || 0),
            once: options.once || false,
            priority: options.priority || 0
        };
        
        this.observers.get(target).push(observer);
        
        return () => {
            const observers = this.observers.get(target);
            if (observers) {
                const index = observers.indexOf(observer);
                if (index > -1) {
                    observers.splice(index, 1);
                }
            }
        };
    }
    
    notify(target, data) {
        this.eventQueue.push({ target, data, timestamp: Date.now() });
        this.processQueue();
    }
    
    async processQueue() {
        if (this.processing) return;
        this.processing = true;
        
        while (this.eventQueue.length > 0) {
            const batch = this.eventQueue.splice(0, this.batchSize);
            
            for (let event of batch) {
                const observers = this.observers.get(event.target);
                if (observers) {
                    observers.forEach(observer => {
                        try {
                            if (observer.throttled) {
                                observer.throttled(event.data);
                            } else if (observer.debounced) {
                                observer.debounced(event.data);
                            } else {
                                observer.callback(event.data);
                            }
                        } catch (error) {
                            console.error('Erro no observer:', error);
                        }
                    });
                }
            }
            
            // Yield para não bloquear a thread
            await new Promise(resolve => setTimeout(resolve, 0));
        }
        
        this.processing = false;
    }
    
    debounce(func, wait) {
        if (wait <= 0) return null;
        
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    throttle(func, limit) {
        if (limit <= 0) return null;
        
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ==========================================
// RESUMO E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== RESUMO DO MÓDULO ===');

/*
CONCEITOS APRENDIDOS:
✓ Observer Pattern básico
✓ Event Emitter avançado
✓ Observable RxJS-like
✓ State Management com Store
✓ Sistema de Notificações Real-time
✓ Sistema de Chat completo
✓ Otimizações e boas práticas

TÉCNICAS DOMINADAS:
✓ Subject/Observer implementation
✓ Event-driven architecture
✓ Pub/Sub pattern
✓ State management
✓ Real-time notifications
✓ Middleware pattern
✓ Debounce e throttle
✓ Batch processing
✓ Error handling em observers
✓ Memory management com WeakMap

PROJETOS DESENVOLVIDOS:
✓ Observer básico com Subject
✓ Event Emitter com prioridades
✓ Observable com operadores
✓ Store com middleware e history
✓ Notification Center multi-canal
✓ Sistema de Chat real-time
✓ Observer otimizado com batching

PRÓXIMO MÓDULO: Factory Pattern
- Object creation patterns
- Abstract Factory
- Builder Pattern
- Prototype Pattern
*/

// ==========================================
// REFERÊNCIAS E APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS:
1. "Design Patterns" - Gang of Four
2. "JavaScript Patterns" - Stoyan Stefanov
3. "Learning JavaScript Design Patterns" - Addy Osmani
4. RxJS Documentation
5. "Reactive Programming with RxJS" - Sergi Mansilla

APROFUNDAMENTO:
1. RxJS e programação reativa
2. Redux e state management
3. WebSockets e real-time
4. Event sourcing
5. CQRS (Command Query Responsibility Segregation)

FERRAMENTAS:
1. RxJS para programação reativa
2. Redux/MobX para state management
3. Socket.io para real-time
4. EventEmitter3 para performance
5. Immer para immutability
*/

console.log('\n🎯 Observer Pattern concluído! Próximo: Factory Pattern');
console.log('📚 Continue praticando com sistemas event-driven!');
console.log('🔧 Experimente criar seus próprios sistemas de eventos!');