/*
===========================================
    MÓDULO 07 - EVENTOS
    Aula 04: Event Handling (Manipulação Avançada de Eventos)
===========================================

Objetivos de Aprendizagem:
✓ Dominar padrões avançados de manipulação de eventos
✓ Implementar sistemas robustos de event handling
✓ Otimizar performance em aplicações com muitos eventos
✓ Criar abstrações reutilizáveis para eventos
✓ Desenvolver arquiteturas escaláveis orientadas a eventos
*/

// ===========================================
// 1. TEORIA: EVENT HANDLING AVANÇADO
// ===========================================

/*
EVENT HANDLING AVANÇADO:

1. PADRÕES DE MANIPULAÇÃO:
   - Event Delegation (delegação)
   - Event Pooling (pool de eventos)
   - Event Batching (agrupamento)
   - Event Throttling/Debouncing
   - Event Composition (composição)

2. PERFORMANCE:
   - Passive listeners
   - Event listener cleanup
   - Memory leak prevention
   - Efficient event propagation
   - Lazy event binding

3. ARQUITETURAS:
   - Event-driven architecture
   - Command pattern com eventos
   - State machines com eventos
   - Plugin systems
   - Micro-frontends communication

4. DEBUGGING E MONITORAMENTO:
   - Event tracking
   - Performance monitoring
   - Error handling
   - Event replay
   - Analytics integration

5. CASOS AVANÇADOS:
   - Cross-frame communication
   - Service Worker events
   - WebSocket event handling
   - Real-time synchronization
   - Offline/online event management
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Sistema Avançado de Event Handling ---
console.log('=== SISTEMA AVANÇADO DE EVENT HANDLING ===');

class AdvancedEventHandler {
    constructor(options = {}) {
        this.options = {
            enableLogging: true,
            enablePerformanceMonitoring: true,
            maxEventHistory: 1000,
            enableEventReplay: false,
            throttleDelay: 16, // ~60fps
            debounceDelay: 300,
            ...options
        };
        
        this.eventHistory = [];
        this.performanceMetrics = new Map();
        this.throttledHandlers = new Map();
        this.debouncedHandlers = new Map();
        this.eventPools = new Map();
        this.abortControllers = new Map();
        
        this.setupGlobalErrorHandling();
    }
    
    // === THROTTLING E DEBOUNCING ===
    
    // Criar handler com throttle
    throttle(handler, delay = this.options.throttleDelay, key = null) {
        const throttleKey = key || handler.toString();
        
        if (this.throttledHandlers.has(throttleKey)) {
            return this.throttledHandlers.get(throttleKey);
        }
        
        let lastExecution = 0;
        let timeoutId = null;
        
        const throttledHandler = (...args) => {
            const now = Date.now();
            const timeSinceLastExecution = now - lastExecution;
            
            if (timeSinceLastExecution >= delay) {
                lastExecution = now;
                return handler.apply(this, args);
            } else {
                if (timeoutId) clearTimeout(timeoutId);
                
                timeoutId = setTimeout(() => {
                    lastExecution = Date.now();
                    handler.apply(this, args);
                }, delay - timeSinceLastExecution);
            }
        };
        
        throttledHandler.original = handler;
        throttledHandler.cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            this.throttledHandlers.delete(throttleKey);
        };
        
        this.throttledHandlers.set(throttleKey, throttledHandler);
        return throttledHandler;
    }
    
    // Criar handler com debounce
    debounce(handler, delay = this.options.debounceDelay, key = null) {
        const debounceKey = key || handler.toString();
        
        if (this.debouncedHandlers.has(debounceKey)) {
            return this.debouncedHandlers.get(debounceKey);
        }
        
        let timeoutId = null;
        
        const debouncedHandler = (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                handler.apply(this, args);
            }, delay);
        };
        
        debouncedHandler.original = handler;
        debouncedHandler.cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            this.debouncedHandlers.delete(debounceKey);
        };
        
        this.debouncedHandlers.set(debounceKey, debouncedHandler);
        return debouncedHandler;
    }
    
    // === EVENT POOLING ===
    
    // Obter evento do pool
    getPooledEvent(type, detail = null, options = {}) {
        if (!this.eventPools.has(type)) {
            this.eventPools.set(type, []);
        }
        
        const pool = this.eventPools.get(type);
        let event;
        
        if (pool.length > 0) {
            event = pool.pop();
            // Resetar propriedades
            Object.defineProperty(event, 'detail', { value: detail, configurable: true });
            Object.assign(event, options);
        } else {
            event = new CustomEvent(type, { detail, ...options });
        }
        
        return event;
    }
    
    // Retornar evento para o pool
    releaseEvent(event) {
        const type = event.type;
        if (!this.eventPools.has(type)) {
            this.eventPools.set(type, []);
        }
        
        const pool = this.eventPools.get(type);
        if (pool.length < 50) { // Limite do pool
            // Limpar referências
            Object.defineProperty(event, 'detail', { value: null, configurable: true });
            pool.push(event);
        }
    }
    
    // === ADVANCED EVENT BINDING ===
    
    // Binding avançado com cleanup automático
    bindEvent(element, type, handler, options = {}) {
        const bindingId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Criar AbortController para este binding
        const abortController = new AbortController();
        this.abortControllers.set(bindingId, abortController);
        
        // Wrapper para logging e métricas
        const wrappedHandler = (event) => {
            const startTime = performance.now();
            
            try {
                // Log do evento
                if (this.options.enableLogging) {
                    this.logEvent(event, element, handler);
                }
                
                // Executar handler original
                const result = handler.call(element, event);
                
                // Métricas de performance
                if (this.options.enablePerformanceMonitoring) {
                    const duration = performance.now() - startTime;
                    this.recordPerformanceMetric(type, duration);
                }
                
                return result;
            } catch (error) {
                console.error(`Erro no handler do evento ${type}:`, error);
                this.handleEventError(error, event, handler);
            }
        };
        
        // Configurar opções finais
        const finalOptions = {
            ...options,
            signal: abortController.signal
        };
        
        // Aplicar throttle/debounce se especificado
        let finalHandler = wrappedHandler;
        if (options.throttle) {
            finalHandler = this.throttle(wrappedHandler, options.throttle, bindingId);
        } else if (options.debounce) {
            finalHandler = this.debounce(wrappedHandler, options.debounce, bindingId);
        }
        
        // Adicionar listener
        element.addEventListener(type, finalHandler, finalOptions);
        
        // Retornar função de cleanup
        return () => this.unbindEvent(bindingId);
    }
    
    // Remover binding
    unbindEvent(bindingId) {
        const abortController = this.abortControllers.get(bindingId);
        if (abortController) {
            abortController.abort();
            this.abortControllers.delete(bindingId);
        }
        
        // Cleanup de throttle/debounce
        const throttled = this.throttledHandlers.get(bindingId);
        if (throttled && throttled.cleanup) {
            throttled.cleanup();
        }
        
        const debounced = this.debouncedHandlers.get(bindingId);
        if (debounced && debounced.cleanup) {
            debounced.cleanup();
        }
    }
    
    // === LOGGING E MÉTRICAS ===
    
    // Log de eventos
    logEvent(event, element, handler) {
        const logEntry = {
            timestamp: new Date(),
            type: event.type,
            element: element.tagName || 'Unknown',
            elementId: element.id || null,
            detail: event.detail,
            bubbles: event.bubbles,
            cancelable: event.cancelable,
            handlerName: handler.name || 'anonymous'
        };
        
        this.eventHistory.push(logEntry);
        
        // Manter limite do histórico
        if (this.eventHistory.length > this.options.maxEventHistory) {
            this.eventHistory.shift();
        }
        
        console.log(`🎯 Event: ${event.type}`, logEntry);
    }
    
    // Registrar métrica de performance
    recordPerformanceMetric(eventType, duration) {
        if (!this.performanceMetrics.has(eventType)) {
            this.performanceMetrics.set(eventType, {
                count: 0,
                totalDuration: 0,
                minDuration: Infinity,
                maxDuration: 0,
                avgDuration: 0
            });
        }
        
        const metrics = this.performanceMetrics.get(eventType);
        metrics.count++;
        metrics.totalDuration += duration;
        metrics.minDuration = Math.min(metrics.minDuration, duration);
        metrics.maxDuration = Math.max(metrics.maxDuration, duration);
        metrics.avgDuration = metrics.totalDuration / metrics.count;
    }
    
    // === ERROR HANDLING ===
    
    // Configurar tratamento global de erros
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Erro global capturado:', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Promise rejeitada não tratada:', event.reason);
        });
    }
    
    // Tratar erro em handler de evento
    handleEventError(error, event, handler) {
        const errorInfo = {
            error,
            event: {
                type: event.type,
                target: event.target,
                detail: event.detail
            },
            handler: handler.name || 'anonymous',
            timestamp: new Date()
        };
        
        // Aqui você pode integrar com serviços de monitoramento
        console.error('Event handler error:', errorInfo);
    }
    
    // === RELATÓRIOS E ANÁLISES ===
    
    // Obter relatório de performance
    getPerformanceReport() {
        const report = {
            totalEvents: this.eventHistory.length,
            eventTypes: {},
            performanceMetrics: Object.fromEntries(this.performanceMetrics),
            slowestEvents: [],
            mostFrequentEvents: []
        };
        
        // Contar tipos de eventos
        this.eventHistory.forEach(entry => {
            report.eventTypes[entry.type] = (report.eventTypes[entry.type] || 0) + 1;
        });
        
        // Eventos mais lentos
        report.slowestEvents = Array.from(this.performanceMetrics.entries())
            .sort((a, b) => b[1].avgDuration - a[1].avgDuration)
            .slice(0, 5)
            .map(([type, metrics]) => ({ type, avgDuration: metrics.avgDuration }));
        
        // Eventos mais frequentes
        report.mostFrequentEvents = Object.entries(report.eventTypes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));
        
        return report;
    }
    
    // Limpar todos os recursos
    cleanup() {
        // Abortar todos os listeners
        for (const controller of this.abortControllers.values()) {
            controller.abort();
        }
        this.abortControllers.clear();
        
        // Limpar throttle/debounce
        for (const handler of this.throttledHandlers.values()) {
            if (handler.cleanup) handler.cleanup();
        }
        this.throttledHandlers.clear();
        
        for (const handler of this.debouncedHandlers.values()) {
            if (handler.cleanup) handler.cleanup();
        }
        this.debouncedHandlers.clear();
        
        // Limpar pools
        this.eventPools.clear();
        
        console.log('Advanced Event Handler cleanup completed');
    }
}

// Exemplo de uso do sistema avançado
const exemploAdvancedHandler = {
    demonstrarSistema() {
        console.log('=== DEMONSTRAÇÃO SISTEMA AVANÇADO ===');
        
        const eventHandler = new AdvancedEventHandler({
            enableLogging: true,
            enablePerformanceMonitoring: true,
            throttleDelay: 100,
            debounceDelay: 300
        });
        
        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        
        container.innerHTML = `
            <h3>Sistema Avançado de Event Handling</h3>
            <div class="controles">
                <button class="throttle-test">Teste Throttle</button>
                <button class="debounce-test">Teste Debounce</button>
                <button class="performance-test">Teste Performance</button>
                <button class="error-test">Teste Error</button>
                <button class="relatorio">Ver Relatório</button>
            </div>
            <div class="resultados" style="margin-top: 20px; padding: 10px; border: 1px solid #ccc; min-height: 200px;"></div>
        `;
        
        const resultados = container.querySelector('.resultados');
        
        // === TESTE THROTTLE ===
        const throttleCleanup = eventHandler.bindEvent(
            container.querySelector('.throttle-test'),
            'click',
            () => {
                const p = document.createElement('p');
                p.textContent = `Throttle executado: ${new Date().toLocaleTimeString()}`;
                resultados.appendChild(p);
            },
            { throttle: 1000 } // Máximo 1 execução por segundo
        );
        
        // === TESTE DEBOUNCE ===
        const debounceCleanup = eventHandler.bindEvent(
            container.querySelector('.debounce-test'),
            'click',
            () => {
                const p = document.createElement('p');
                p.textContent = `Debounce executado: ${new Date().toLocaleTimeString()}`;
                resultados.appendChild(p);
            },
            { debounce: 500 } // Aguarda 500ms sem cliques
        );
        
        // === TESTE PERFORMANCE ===
        eventHandler.bindEvent(
            container.querySelector('.performance-test'),
            'click',
            () => {
                // Simular operação pesada
                const start = Date.now();
                while (Date.now() - start < 50) {
                    // Operação que demora ~50ms
                }
                
                const p = document.createElement('p');
                p.textContent = `Performance test executado (50ms simulados)`;
                resultados.appendChild(p);
            }
        );
        
        // === TESTE ERROR ===
        eventHandler.bindEvent(
            container.querySelector('.error-test'),
            'click',
            () => {
                throw new Error('Erro simulado para teste!');
            }
        );
        
        // === RELATÓRIO ===
        eventHandler.bindEvent(
            container.querySelector('.relatorio'),
            'click',
            () => {
                const report = eventHandler.getPerformanceReport();
                
                resultados.innerHTML = `
                    <h4>Relatório de Performance</h4>
                    <pre>${JSON.stringify(report, null, 2)}</pre>
                `;
            }
        );
        
        return { container, eventHandler };
    }
};

// --- 2.2 Sistema de State Machine com Eventos ---
console.log('\n=== STATE MACHINE COM EVENTOS ===');

class EventDrivenStateMachine {
    constructor(initialState, states = {}) {
        this.currentState = initialState;
        this.states = states;
        this.history = [{ state: initialState, timestamp: new Date() }];
        this.listeners = new Map();
        this.middleware = [];
        
        this.eventTarget = new EventTarget();
    }
    
    // Definir estados e transições
    defineState(stateName, config) {
        this.states[stateName] = {
            onEnter: null,
            onExit: null,
            transitions: {},
            ...config
        };
    }
    
    // Adicionar transição
    addTransition(fromState, event, toState, condition = null) {
        if (!this.states[fromState]) {
            this.defineState(fromState, {});
        }
        
        this.states[fromState].transitions[event] = {
            to: toState,
            condition
        };
    }
    
    // Adicionar middleware
    use(middleware) {
        this.middleware.push(middleware);
    }
    
    // Transição de estado
    transition(event, data = null) {
        const currentStateConfig = this.states[this.currentState];
        if (!currentStateConfig || !currentStateConfig.transitions[event]) {
            console.warn(`Transição '${event}' não permitida no estado '${this.currentState}'`);
            return false;
        }
        
        const transition = currentStateConfig.transitions[event];
        
        // Verificar condição
        if (transition.condition && !transition.condition(data, this.currentState)) {
            console.warn(`Condição para transição '${event}' não atendida`);
            return false;
        }
        
        const previousState = this.currentState;
        const nextState = transition.to;
        
        // Executar middleware
        const context = {
            from: previousState,
            to: nextState,
            event,
            data,
            cancel: false
        };
        
        for (const middleware of this.middleware) {
            middleware(context);
            if (context.cancel) {
                console.warn(`Transição cancelada pelo middleware`);
                return false;
            }
        }
        
        // Executar onExit do estado atual
        if (currentStateConfig.onExit) {
            currentStateConfig.onExit(data, nextState);
        }
        
        // Atualizar estado
        this.currentState = nextState;
        
        // Adicionar ao histórico
        this.history.push({
            state: nextState,
            previousState,
            event,
            data,
            timestamp: new Date()
        });
        
        // Executar onEnter do novo estado
        const nextStateConfig = this.states[nextState];
        if (nextStateConfig && nextStateConfig.onEnter) {
            nextStateConfig.onEnter(data, previousState);
        }
        
        // Disparar eventos
        this.eventTarget.dispatchEvent(new CustomEvent('state:changed', {
            detail: {
                from: previousState,
                to: nextState,
                event,
                data
            }
        }));
        
        this.eventTarget.dispatchEvent(new CustomEvent(`state:enter:${nextState}`, {
            detail: { data, previousState }
        }));
        
        this.eventTarget.dispatchEvent(new CustomEvent(`state:exit:${previousState}`, {
            detail: { data, nextState }
        }));
        
        console.log(`Estado mudou: ${previousState} → ${nextState} (evento: ${event})`);
        return true;
    }
    
    // Verificar se transição é possível
    canTransition(event) {
        const currentStateConfig = this.states[this.currentState];
        return currentStateConfig && currentStateConfig.transitions[event];
    }
    
    // Obter transições possíveis
    getPossibleTransitions() {
        const currentStateConfig = this.states[this.currentState];
        return currentStateConfig ? Object.keys(currentStateConfig.transitions) : [];
    }
    
    // Event listeners
    on(event, listener) {
        this.eventTarget.addEventListener(event, listener);
    }
    
    off(event, listener) {
        this.eventTarget.removeEventListener(event, listener);
    }
    
    // Obter estado atual
    getState() {
        return this.currentState;
    }
    
    // Obter histórico
    getHistory(limit = 10) {
        return this.history.slice(-limit);
    }
    
    // Reset para estado inicial
    reset() {
        const initialState = this.history[0].state;
        this.currentState = initialState;
        this.history = [{ state: initialState, timestamp: new Date() }];
        
        this.eventTarget.dispatchEvent(new CustomEvent('state:reset', {
            detail: { state: initialState }
        }));
    }
}

// Exemplo de uso da State Machine
const exemploStateMachine = {
    criarMaquinaEstados() {
        console.log('=== CRIANDO STATE MACHINE ===');
        
        // Criar state machine para um player de música
        const musicPlayer = new EventDrivenStateMachine('stopped');
        
        // Definir estados
        musicPlayer.defineState('stopped', {
            onEnter: () => console.log('🛑 Player parado'),
            transitions: {
                'play': { to: 'playing' },
                'load': { to: 'loading' }
            }
        });
        
        musicPlayer.defineState('loading', {
            onEnter: () => console.log('⏳ Carregando música...'),
            transitions: {
                'loaded': { to: 'stopped' },
                'error': { to: 'error' }
            }
        });
        
        musicPlayer.defineState('playing', {
            onEnter: () => console.log('▶️ Reproduzindo música'),
            transitions: {
                'pause': { to: 'paused' },
                'stop': { to: 'stopped' },
                'next': { to: 'loading' },
                'error': { to: 'error' }
            }
        });
        
        musicPlayer.defineState('paused', {
            onEnter: () => console.log('⏸️ Música pausada'),
            transitions: {
                'play': { to: 'playing' },
                'stop': { to: 'stopped' }
            }
        });
        
        musicPlayer.defineState('error', {
            onEnter: (data) => console.log('❌ Erro:', data?.message || 'Erro desconhecido'),
            transitions: {
                'retry': { to: 'loading' },
                'stop': { to: 'stopped' }
            }
        });
        
        // Middleware para logging
        musicPlayer.use((context) => {
            console.log(`Middleware: ${context.from} → ${context.to} (${context.event})`);
        });
        
        // Listeners para mudanças de estado
        musicPlayer.on('state:changed', (event) => {
            console.log('Estado mudou:', event.detail);
        });
        
        // Simular uso
        console.log('Estado inicial:', musicPlayer.getState());
        
        musicPlayer.transition('load');
        musicPlayer.transition('loaded');
        musicPlayer.transition('play');
        musicPlayer.transition('pause');
        musicPlayer.transition('play');
        musicPlayer.transition('stop');
        
        console.log('Histórico:', musicPlayer.getHistory());
        
        return musicPlayer;
    }
};

// --- 2.3 Sistema de Command Pattern com Eventos ---
console.log('\n=== COMMAND PATTERN COM EVENTOS ===');

class EventDrivenCommandSystem {
    constructor() {
        this.commands = new Map();
        this.history = [];
        this.currentIndex = -1;
        this.maxHistory = 100;
        
        this.eventTarget = new EventTarget();
    }
    
    // Registrar comando
    registerCommand(name, command) {
        this.commands.set(name, command);
        console.log(`Comando '${name}' registrado`);
    }
    
    // Executar comando
    execute(commandName, params = {}) {
        const command = this.commands.get(commandName);
        if (!command) {
            throw new Error(`Comando '${commandName}' não encontrado`);
        }
        
        // Criar contexto do comando
        const context = {
            name: commandName,
            params,
            timestamp: new Date(),
            id: `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
        
        try {
            // Evento antes da execução
            this.eventTarget.dispatchEvent(new CustomEvent('command:before', {
                detail: context
            }));
            
            // Executar comando
            const result = command.execute(params);
            context.result = result;
            
            // Adicionar ao histórico (removendo comandos futuros se estivermos no meio)
            if (this.currentIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.currentIndex + 1);
            }
            
            this.history.push(context);
            this.currentIndex++;
            
            // Manter limite do histórico
            if (this.history.length > this.maxHistory) {
                this.history.shift();
                this.currentIndex--;
            }
            
            // Evento após execução
            this.eventTarget.dispatchEvent(new CustomEvent('command:executed', {
                detail: context
            }));
            
            console.log(`Comando '${commandName}' executado:`, result);
            return result;
            
        } catch (error) {
            context.error = error;
            
            // Evento de erro
            this.eventTarget.dispatchEvent(new CustomEvent('command:error', {
                detail: context
            }));
            
            console.error(`Erro ao executar comando '${commandName}':`, error);
            throw error;
        }
    }
    
    // Desfazer comando
    undo() {
        if (this.currentIndex < 0) {
            console.warn('Nenhum comando para desfazer');
            return false;
        }
        
        const context = this.history[this.currentIndex];
        const command = this.commands.get(context.name);
        
        if (!command || !command.undo) {
            console.warn(`Comando '${context.name}' não pode ser desfeito`);
            return false;
        }
        
        try {
            // Evento antes do undo
            this.eventTarget.dispatchEvent(new CustomEvent('command:before-undo', {
                detail: context
            }));
            
            // Executar undo
            const result = command.undo(context.params, context.result);
            
            this.currentIndex--;
            
            // Evento após undo
            this.eventTarget.dispatchEvent(new CustomEvent('command:undone', {
                detail: { ...context, undoResult: result }
            }));
            
            console.log(`Comando '${context.name}' desfeito`);
            return true;
            
        } catch (error) {
            console.error(`Erro ao desfazer comando '${context.name}':`, error);
            return false;
        }
    }
    
    // Refazer comando
    redo() {
        if (this.currentIndex >= this.history.length - 1) {
            console.warn('Nenhum comando para refazer');
            return false;
        }
        
        this.currentIndex++;
        const context = this.history[this.currentIndex];
        const command = this.commands.get(context.name);
        
        try {
            // Evento antes do redo
            this.eventTarget.dispatchEvent(new CustomEvent('command:before-redo', {
                detail: context
            }));
            
            // Executar novamente
            const result = command.execute(context.params);
            
            // Evento após redo
            this.eventTarget.dispatchEvent(new CustomEvent('command:redone', {
                detail: { ...context, redoResult: result }
            }));
            
            console.log(`Comando '${context.name}' refeito`);
            return true;
            
        } catch (error) {
            this.currentIndex--; // Reverter índice em caso de erro
            console.error(`Erro ao refazer comando '${context.name}':`, error);
            return false;
        }
    }
    
    // Verificar se pode desfazer
    canUndo() {
        return this.currentIndex >= 0;
    }
    
    // Verificar se pode refazer
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
    
    // Obter histórico
    getHistory() {
        return this.history.map((context, index) => ({
            ...context,
            isCurrent: index === this.currentIndex,
            canUndo: index <= this.currentIndex,
            canRedo: index > this.currentIndex
        }));
    }
    
    // Limpar histórico
    clearHistory() {
        this.history = [];
        this.currentIndex = -1;
        
        this.eventTarget.dispatchEvent(new CustomEvent('command:history-cleared'));
    }
    
    // Event listeners
    on(event, listener) {
        this.eventTarget.addEventListener(event, listener);
    }
    
    off(event, listener) {
        this.eventTarget.removeEventListener(event, listener);
    }
}

// Exemplo de uso do Command System
const exemploCommandSystem = {
    criarSistemaComandos() {
        console.log('=== CRIANDO SISTEMA DE COMANDOS ===');
        
        const commandSystem = new EventDrivenCommandSystem();
        
        // Estado da aplicação (simulado)
        const appState = {
            text: '',
            fontSize: 16,
            color: '#000000'
        };
        
        // === COMANDOS ===
        
        // Comando para alterar texto
        commandSystem.registerCommand('changeText', {
            execute: (params) => {
                const oldText = appState.text;
                appState.text = params.newText;
                return { oldText, newText: params.newText };
            },
            undo: (params, result) => {
                appState.text = result.oldText;
                return { restored: result.oldText };
            }
        });
        
        // Comando para alterar tamanho da fonte
        commandSystem.registerCommand('changeFontSize', {
            execute: (params) => {
                const oldSize = appState.fontSize;
                appState.fontSize = params.newSize;
                return { oldSize, newSize: params.newSize };
            },
            undo: (params, result) => {
                appState.fontSize = result.oldSize;
                return { restored: result.oldSize };
            }
        });
        
        // Comando para alterar cor
        commandSystem.registerCommand('changeColor', {
            execute: (params) => {
                const oldColor = appState.color;
                appState.color = params.newColor;
                return { oldColor, newColor: params.newColor };
            },
            undo: (params, result) => {
                appState.color = result.oldColor;
                return { restored: result.oldColor };
            }
        });
        
        // === LISTENERS ===
        
        commandSystem.on('command:executed', (event) => {
            console.log('Estado atual:', appState);
        });
        
        commandSystem.on('command:undone', (event) => {
            console.log('Comando desfeito. Estado atual:', appState);
        });
        
        // === SIMULAÇÃO ===
        
        console.log('Estado inicial:', appState);
        
        commandSystem.execute('changeText', { newText: 'Olá Mundo!' });
        commandSystem.execute('changeFontSize', { newSize: 20 });
        commandSystem.execute('changeColor', { newColor: '#ff0000' });
        
        console.log('\n--- Testando Undo/Redo ---');
        commandSystem.undo(); // Desfazer mudança de cor
        commandSystem.undo(); // Desfazer mudança de fonte
        commandSystem.redo(); // Refazer mudança de fonte
        
        console.log('\nHistórico:', commandSystem.getHistory());
        
        return { commandSystem, appState };
    }
}

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Editor de Texto Avançado ---
console.log('\n=== EXERCÍCIO 1: EDITOR DE TEXTO AVANÇADO ===');

class EditorTextoAvancado {
    constructor(container) {
        this.container = container;
        this.eventHandler = new AdvancedEventHandler();
        this.commandSystem = new EventDrivenCommandSystem();
        this.stateMachine = new EventDrivenStateMachine('editing');
        
        this.estado = {
            conteudo: '',
            selecao: { start: 0, end: 0 },
            historico: [],
            configuracoes: {
                autoSave: true,
                highlightSyntax: false,
                wordWrap: true
            }
        };
        
        this.criarInterface();
        this.configurarComandos();
        this.configurarEstados();
        this.configurarEventos();
    }
    
    // Criar interface
    criarInterface() {
        this.container.style.cssText = `
            max-width: 1000px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        
        this.container.innerHTML = `
            <div class="editor-header">
                <h3>Editor de Texto Avançado</h3>
                <div class="toolbar">
                    <button class="btn-undo" disabled>↶ Desfazer</button>
                    <button class="btn-redo" disabled>↷ Refazer</button>
                    <button class="btn-bold">B</button>
                    <button class="btn-italic">I</button>
                    <button class="btn-save">💾 Salvar</button>
                    <button class="btn-load">📁 Carregar</button>
                    <span class="status">Editando</span>
                </div>
            </div>
            <div class="editor-content">
                <textarea class="editor-textarea" placeholder="Digite seu texto aqui..."></textarea>
            </div>
            <div class="editor-footer">
                <div class="stats">
                    <span class="char-count">0 caracteres</span>
                    <span class="word-count">0 palavras</span>
                    <span class="line-count">1 linha</span>
                </div>
                <div class="logs" style="height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; font-size: 12px;"></div>
            </div>
        `;
        
        // Elementos da interface
        this.textarea = this.container.querySelector('.editor-textarea');
        this.btnUndo = this.container.querySelector('.btn-undo');
        this.btnRedo = this.container.querySelector('.btn-redo');
        this.statusElement = this.container.querySelector('.status');
        this.logsElement = this.container.querySelector('.logs');
        
        // Estilizar textarea
        this.textarea.style.cssText = `
            width: 100%;
            height: 300px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            resize: vertical;
        `;
    }
    
    // Configurar comandos
    configurarComandos() {
        // Comando de inserção de texto
        this.commandSystem.registerCommand('insertText', {
            execute: (params) => {
                const { text, position } = params;
                const oldContent = this.estado.conteudo;
                
                this.estado.conteudo = 
                    oldContent.slice(0, position) + 
                    text + 
                    oldContent.slice(position);
                
                this.atualizarInterface();
                
                return {
                    oldContent,
                    newContent: this.estado.conteudo,
                    insertedText: text,
                    position
                };
            },
            undo: (params, result) => {
                this.estado.conteudo = result.oldContent;
                this.atualizarInterface();
                return { restored: true };
            }
        });
        
        // Comando de remoção de texto
        this.commandSystem.registerCommand('removeText', {
            execute: (params) => {
                const { start, end } = params;
                const oldContent = this.estado.conteudo;
                const removedText = oldContent.slice(start, end);
                
                this.estado.conteudo = 
                    oldContent.slice(0, start) + 
                    oldContent.slice(end);
                
                this.atualizarInterface();
                
                return {
                    oldContent,
                    newContent: this.estado.conteudo,
                    removedText,
                    start,
                    end
                };
            },
            undo: (params, result) => {
                this.estado.conteudo = result.oldContent;
                this.atualizarInterface();
                return { restored: true };
            }
        });
        
        // Comando de formatação
        this.commandSystem.registerCommand('formatText', {
            execute: (params) => {
                const { start, end, format } = params;
                const oldContent = this.estado.conteudo;
                const selectedText = oldContent.slice(start, end);
                
                let formattedText;
                switch (format) {
                    case 'bold':
                        formattedText = `**${selectedText}**`;
                        break;
                    case 'italic':
                        formattedText = `*${selectedText}*`;
                        break;
                    default:
                        formattedText = selectedText;
                }
                
                this.estado.conteudo = 
                    oldContent.slice(0, start) + 
                    formattedText + 
                    oldContent.slice(end);
                
                this.atualizarInterface();
                
                return {
                    oldContent,
                    newContent: this.estado.conteudo,
                    format,
                    start,
                    end
                };
            },
            undo: (params, result) => {
                this.estado.conteudo = result.oldContent;
                this.atualizarInterface();
                return { restored: true };
            }
        });
    }
    
    // Configurar estados
    configurarEstados() {
        this.stateMachine.defineState('editing', {
            onEnter: () => {
                this.statusElement.textContent = 'Editando';
                this.statusElement.style.color = '#007bff';
            }
        });
        
        this.stateMachine.defineState('saving', {
            onEnter: () => {
                this.statusElement.textContent = 'Salvando...';
                this.statusElement.style.color = '#ffc107';
            }
        });
        
        this.stateMachine.defineState('saved', {
            onEnter: () => {
                this.statusElement.textContent = 'Salvo';
                this.statusElement.style.color = '#28a745';
            }
        });
        
        this.stateMachine.defineState('loading', {
            onEnter: () => {
                this.statusElement.textContent = 'Carregando...';
                this.statusElement.style.color = '#6c757d';
            }
        });
        
        // Transições
        this.stateMachine.addTransition('editing', 'save', 'saving');
        this.stateMachine.addTransition('saving', 'saved', 'saved');
        this.stateMachine.addTransition('saved', 'edit', 'editing');
        this.stateMachine.addTransition('editing', 'load', 'loading');
        this.stateMachine.addTransition('loading', 'loaded', 'editing');
    }
    
    // Configurar eventos
    configurarEventos() {
        // === EVENTOS DO TEXTAREA ===
        
        // Input com debounce para comandos
        this.eventHandler.bindEvent(
            this.textarea,
            'input',
            (event) => {
                const newContent = event.target.value;
                if (newContent !== this.estado.conteudo) {
                    // Detectar tipo de mudança
                    if (newContent.length > this.estado.conteudo.length) {
                        // Inserção
                        const position = this.textarea.selectionStart - (newContent.length - this.estado.conteudo.length);
                        const insertedText = newContent.slice(position, this.textarea.selectionStart);
                        
                        this.commandSystem.execute('insertText', {
                            text: insertedText,
                            position
                        });
                    } else {
                        // Remoção
                        this.estado.conteudo = newContent;
                        this.atualizarInterface();
                    }
                    
                    this.stateMachine.transition('edit');
                }
            },
            { debounce: 300 }
        );
        
        // Seleção de texto
        this.eventHandler.bindEvent(
            this.textarea,
            'selectionchange',
            () => {
                this.estado.selecao = {
                    start: this.textarea.selectionStart,
                    end: this.textarea.selectionEnd
                };
            }
        );
        
        // === EVENTOS DOS BOTÕES ===
        
        // Undo
        this.eventHandler.bindEvent(
            this.btnUndo,
            'click',
            () => {
                this.commandSystem.undo();
                this.atualizarBotoesUndoRedo();
            }
        );
        
        // Redo
        this.eventHandler.bindEvent(
            this.btnRedo,
            'click',
            () => {
                this.commandSystem.redo();
                this.atualizarBotoesUndoRedo();
            }
        );
        
        // Bold
        this.eventHandler.bindEvent(
            this.container.querySelector('.btn-bold'),
            'click',
            () => {
                const { start, end } = this.estado.selecao;
                if (start !== end) {
                    this.commandSystem.execute('formatText', {
                        start,
                        end,
                        format: 'bold'
                    });
                }
            }
        );
        
        // Italic
        this.eventHandler.bindEvent(
            this.container.querySelector('.btn-italic'),
            'click',
            () => {
                const { start, end } = this.estado.selecao;
                if (start !== end) {
                    this.commandSystem.execute('formatText', {
                        start,
                        end,
                        format: 'italic'
                    });
                }
            }
        );
        
        // Save
        this.eventHandler.bindEvent(
            this.container.querySelector('.btn-save'),
            'click',
            () => {
                this.salvar();
            }
        );
        
        // Load
        this.eventHandler.bindEvent(
            this.container.querySelector('.btn-load'),
            'click',
            () => {
                this.carregar();
            }
        );
        
        // === LISTENERS DO COMMAND SYSTEM ===
        
        this.commandSystem.on('command:executed', (event) => {
            this.adicionarLog(`Comando executado: ${event.detail.name}`);
            this.atualizarBotoesUndoRedo();
        });
        
        this.commandSystem.on('command:undone', (event) => {
            this.adicionarLog(`Comando desfeito: ${event.detail.name}`);
        });
        
        this.commandSystem.on('command:redone', (event) => {
            this.adicionarLog(`Comando refeito: ${event.detail.name}`);
        });
    }
    
    // Atualizar interface
    atualizarInterface() {
        this.textarea.value = this.estado.conteudo;
        
        // Atualizar estatísticas
        const charCount = this.estado.conteudo.length;
        const wordCount = this.estado.conteudo.trim() ? this.estado.conteudo.trim().split(/\s+/).length : 0;
        const lineCount = this.estado.conteudo.split('\n').length;
        
        this.container.querySelector('.char-count').textContent = `${charCount} caracteres`;
        this.container.querySelector('.word-count').textContent = `${wordCount} palavras`;
        this.container.querySelector('.line-count').textContent = `${lineCount} linhas`;
    }
    
    // Atualizar botões de undo/redo
    atualizarBotoesUndoRedo() {
        this.btnUndo.disabled = !this.commandSystem.canUndo();
        this.btnRedo.disabled = !this.commandSystem.canRedo();
    }
    
    // Salvar
    async salvar() {
        this.stateMachine.transition('save');
        
        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            localStorage.setItem('editor-content', this.estado.conteudo);
            
            this.stateMachine.transition('saved');
            this.adicionarLog('Conteúdo salvo com sucesso');
            
            // Voltar para editing após 2 segundos
            setTimeout(() => {
                this.stateMachine.transition('edit');
            }, 2000);
            
        } catch (error) {
            this.adicionarLog(`Erro ao salvar: ${error.message}`);
            this.stateMachine.transition('edit');
        }
    }
    
    // Carregar
    async carregar() {
        this.stateMachine.transition('load');
        
        try {
            // Simular carregamento
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const conteudo = localStorage.getItem('editor-content') || '';
            this.estado.conteudo = conteudo;
            
            this.atualizarInterface();
            this.commandSystem.clearHistory();
            this.atualizarBotoesUndoRedo();
            
            this.stateMachine.transition('loaded');
            this.adicionarLog('Conteúdo carregado com sucesso');
            
        } catch (error) {
            this.adicionarLog(`Erro ao carregar: ${error.message}`);
            this.stateMachine.transition('edit');
        }
    }
    
    // Adicionar log
    adicionarLog(mensagem) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${mensagem}`;
        
        const p = document.createElement('p');
        p.textContent = logEntry;
        p.style.cssText = 'margin: 2px 0; padding: 2px;';
        
        this.logsElement.appendChild(p);
        this.logsElement.scrollTop = this.logsElement.scrollHeight;
        
        // Manter apenas os últimos 20 logs
        while (this.logsElement.children.length > 20) {
            this.logsElement.removeChild(this.logsElement.firstChild);
        }
    }
    
    // Cleanup
    destroy() {
        this.eventHandler.cleanup();
        console.log('Editor destruído');
    }
}

// Exemplo de uso do editor
console.log('Editor de texto avançado criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasEventHandling = {
    performance: {
        // Use passive listeners para eventos de scroll/touch
        passiveListeners: `
            // ✅ Bom - Passive listener
            element.addEventListener('scroll', handler, { passive: true });
            
            // ❌ Evitar - Listener que pode bloquear
            element.addEventListener('scroll', handler);
        `,
        
        // Debounce/throttle para eventos frequentes
        debounceThrottle: `
            // ✅ Bom - Debounce para input
            const debouncedHandler = debounce(handler, 300);
            input.addEventListener('input', debouncedHandler);
            
            // ✅ Bom - Throttle para scroll
            const throttledHandler = throttle(handler, 16);
            window.addEventListener('scroll', throttledHandler);
        `,
        
        // Event delegation para elementos dinâmicos
        delegation: `
            // ✅ Bom - Event delegation
            container.addEventListener('click', (event) => {
                if (event.target.matches('.dynamic-button')) {
                    handleClick(event);
                }
            });
            
            // ❌ Evitar - Listeners individuais
            dynamicButtons.forEach(button => {
                button.addEventListener('click', handleClick);
            });
        `
    },
    
    memoria: {
        // Sempre limpar listeners
        cleanup: `
            // ✅ Bom - Cleanup automático
            const abortController = new AbortController();
            element.addEventListener('click', handler, {
                signal: abortController.signal
            });
            
            // Limpar quando necessário
            abortController.abort();
        `,
        
        // Evitar closures desnecessárias
        closures: `
            // ❌ Evitar - Closure desnecessária
            elements.forEach(element => {
                element.addEventListener('click', () => {
                    handleClick(element);
                });
            });
            
            // ✅ Bom - Usar event delegation ou bind
            container.addEventListener('click', handleClick);
        `
    },
    
    arquitetura: {
        // Separar concerns
        separation: `
            // ✅ Bom - Separação clara
            class EventManager {
                constructor() {
                    this.handlers = new Map();
                    this.middleware = [];
                }
                
                register(event, handler) { /* ... */ }
                emit(event, data) { /* ... */ }
                cleanup() { /* ... */ }
            }
        `,
        
        // Usar padrões estabelecidos
        patterns: `
            // ✅ Bom - Observer pattern
            class Observable {
                constructor() {
                    this.observers = [];
                }
                
                subscribe(observer) { /* ... */ }
                notify(data) { /* ... */ }
            }
        `
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasEventHandling = {
    documentacao: [
        'MDN - Event handling: https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers',
        'MDN - AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        'MDN - Passive listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive',
        'Web.dev - Event listeners performance: https://web.dev/passive-event-listeners/'
    ],
    
    proximosTopicos: [
        '08-Assincronismo - Eventos assíncronos e Promises',
        '09-ES6-Plus - Async/await com eventos',
        '10-Padroes - Design patterns avançados',
        '11-Qualidade - Testes de eventos e debugging'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de drag and drop avançado',
        'Criar framework de eventos customizado',
        'Desenvolver sistema de analytics em tempo real',
        'Construir editor colaborativo com eventos'
    ]
};

console.log('Referências:', referenciasEventHandling.documentacao);
console.log('Próximos tópicos:', referenciasEventHandling.proximosTopicos);
console.log('Exercícios adicionais:', referenciasEventHandling.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - EVENT HANDLING AVANÇADO
===========================================

✅ CONCEITOS APRENDIDOS:
• Padrões avançados de manipulação de eventos
• Throttling e debouncing
• Event pooling e otimização
• State machines com eventos
• Command pattern com eventos
• Arquiteturas orientadas a eventos

✅ TÉCNICAS DOMINADAS:
• Advanced Event Handler system
• Performance monitoring
• Memory management
• Error handling robusto
• Event-driven architectures
• Cleanup automático

✅ PROJETOS DESENVOLVIDOS:
• Sistema avançado de event handling
• State machine orientada a eventos
• Command system com undo/redo
• Editor de texto avançado

🎯 PRÓXIMO PASSO:
Continue para 08-Assincronismo para aprender
sobre programação assíncrona e eventos!

===========================================
*/