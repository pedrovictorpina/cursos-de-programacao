/**
 * MÓDULO 11: QUALIDADE DE CÓDIGO EM JAVASCRIPT
 * Arquivo 01: Técnicas de Debugging
 * 
 * O debugging é uma habilidade fundamental para todo desenvolvedor.
 * Vamos explorar técnicas, ferramentas e estratégias para identificar
 * e corrigir problemas no código JavaScript.
 * 
 * Professor: Debugging não é apenas sobre corrigir bugs, é sobre
 * compreender profundamente como seu código funciona e desenvolver
 * um pensamento analítico sistemático.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Dominar técnicas de debugging manual e automatizado
2. Utilizar ferramentas de desenvolvimento do navegador
3. Implementar logging estratégico
4. Aplicar debugging preventivo
5. Desenvolver metodologia de resolução de problemas
*/

// ==========================================
// TEORIA: DEBUGGING FUNDAMENTALS
// ==========================================

/*
CONCEITO:
Debugging é o processo de identificar, analisar e corrigir
erros (bugs) no código, garantindo que o software funcione
como esperado.

TIPOS DE BUGS:
1. Syntax Errors - Erros de sintaxe
2. Runtime Errors - Erros de execução
3. Logic Errors - Erros de lógica
4. Performance Issues - Problemas de performance
5. Memory Leaks - Vazamentos de memória

METODOLOGIA DE DEBUGGING:
1. Reproduzir o problema
2. Isolar a causa
3. Formar hipóteses
4. Testar hipóteses
5. Implementar correção
6. Verificar solução
7. Prevenir regressão

FERRAMENTAS:
- Console do navegador
- Debugger integrado
- Breakpoints
- Source maps
- Performance profiler
- Memory profiler
- Network monitor
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. TÉCNICAS DE CONSOLE LOGGING
console.log('\n=== 1. Console Logging Avançado ===');

// Logger personalizado com níveis
class Logger {
    constructor(level = 'info') {
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3,
            trace: 4
        };
        
        this.currentLevel = this.levels[level] || 2;
        this.logs = [];
        this.startTime = Date.now();
    }
    
    log(level, message, data = null) {
        if (this.levels[level] <= this.currentLevel) {
            const timestamp = Date.now() - this.startTime;
            const logEntry = {
                level,
                message,
                data,
                timestamp,
                stack: new Error().stack
            };
            
            this.logs.push(logEntry);
            
            // Formatação colorida no console
            const colors = {
                error: 'color: red; font-weight: bold',
                warn: 'color: orange; font-weight: bold',
                info: 'color: blue',
                debug: 'color: green',
                trace: 'color: gray'
            };
            
            console.log(
                `%c[${level.toUpperCase()}] ${timestamp}ms: ${message}`,
                colors[level],
                data
            );
        }
    }
    
    error(message, data) { this.log('error', message, data); }
    warn(message, data) { this.log('warn', message, data); }
    info(message, data) { this.log('info', message, data); }
    debug(message, data) { this.log('debug', message, data); }
    trace(message, data) { this.log('trace', message, data); }
    
    group(label) {
        console.group(label);
    }
    
    groupEnd() {
        console.groupEnd();
    }
    
    table(data) {
        console.table(data);
    }
    
    time(label) {
        console.time(label);
    }
    
    timeEnd(label) {
        console.timeEnd(label);
    }
    
    count(label) {
        console.count(label);
    }
    
    assert(condition, message) {
        console.assert(condition, message);
    }
    
    getLogs(level = null) {
        if (level) {
            return this.logs.filter(log => log.level === level);
        }
        return this.logs;
    }
    
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
    
    clear() {
        this.logs = [];
        console.clear();
    }
}

// Testando Logger
const logger = new Logger('debug');

logger.info('Sistema iniciado');
logger.debug('Configurações carregadas', { theme: 'dark', lang: 'pt-BR' });
logger.warn('Cache não encontrado, usando padrão');
logger.error('Falha na conexão', { url: 'api.example.com', status: 500 });

// Agrupamento de logs
logger.group('Processamento de usuários');
logger.info('Carregando usuários...');
logger.debug('Query executada', { sql: 'SELECT * FROM users' });
logger.info('5 usuários carregados');
logger.groupEnd();

// Medição de tempo
logger.time('operacao-pesada');
// Simular operação
for (let i = 0; i < 1000000; i++) {
    Math.random();
}
logger.timeEnd('operacao-pesada');

// Contadores
for (let i = 0; i < 5; i++) {
    logger.count('iteracao');
}

// Assertions
logger.assert(2 + 2 === 4, 'Matemática básica falhou!');
logger.assert(2 + 2 === 5, 'Esta assertion vai falhar');

// Tabela de dados
const users = [
    { id: 1, name: 'João', email: 'joao@test.com' },
    { id: 2, name: 'Maria', email: 'maria@test.com' },
    { id: 3, name: 'Pedro', email: 'pedro@test.com' }
];
logger.table(users);

// 2. DEBUGGING COM BREAKPOINTS PROGRAMÁTICOS
console.log('\n=== 2. Breakpoints Programáticos ===');

class DebugHelper {
    static breakpoint(condition = true, message = 'Breakpoint atingido') {
        if (condition) {
            console.log(`🔴 ${message}`);
            console.trace('Stack trace:');
            
            // Em ambiente de desenvolvimento, pausar execução
            if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
                debugger; // Pausa execução no DevTools
            }
        }
    }
    
    static inspect(obj, label = 'Objeto') {
        console.group(`🔍 Inspecionando: ${label}`);
        console.log('Tipo:', typeof obj);
        console.log('Valor:', obj);
        
        if (obj && typeof obj === 'object') {
            console.log('Propriedades:', Object.keys(obj));
            console.log('Prototype:', Object.getPrototypeOf(obj));
            console.log('Descritores:', Object.getOwnPropertyDescriptors(obj));
        }
        
        console.groupEnd();
    }
    
    static watchVariable(obj, prop, callback) {
        let value = obj[prop];
        
        Object.defineProperty(obj, prop, {
            get() {
                console.log(`📖 Lendo ${prop}:`, value);
                return value;
            },
            set(newValue) {
                console.log(`✏️ Alterando ${prop}:`, value, '->', newValue);
                const oldValue = value;
                value = newValue;
                
                if (callback) {
                    callback(newValue, oldValue, prop);
                }
            },
            enumerable: true,
            configurable: true
        });
    }
    
    static traceFunction(fn, name = fn.name || 'anonymous') {
        return function(...args) {
            console.log(`🚀 Chamando ${name} com argumentos:`, args);
            
            const start = performance.now();
            let result;
            let error;
            
            try {
                result = fn.apply(this, args);
                
                if (result instanceof Promise) {
                    return result
                        .then(res => {
                            const end = performance.now();
                            console.log(`✅ ${name} resolvida em ${(end - start).toFixed(2)}ms:`, res);
                            return res;
                        })
                        .catch(err => {
                            const end = performance.now();
                            console.error(`❌ ${name} rejeitada em ${(end - start).toFixed(2)}ms:`, err);
                            throw err;
                        });
                }
                
                const end = performance.now();
                console.log(`✅ ${name} retornou em ${(end - start).toFixed(2)}ms:`, result);
                return result;
                
            } catch (err) {
                const end = performance.now();
                console.error(`❌ ${name} falhou em ${(end - start).toFixed(2)}ms:`, err);
                throw err;
            }
        };
    }
    
    static memoryUsage() {
        if (performance.memory) {
            const memory = performance.memory;
            console.table({
                'Heap usado': `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                'Heap total': `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                'Limite heap': `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
            });
        } else {
            console.warn('Performance.memory não disponível');
        }
    }
}

// Testando DebugHelper
const testObj = { name: 'João', age: 30 };

// Inspecionar objeto
DebugHelper.inspect(testObj, 'Usuário de teste');

// Observar mudanças em propriedade
DebugHelper.watchVariable(testObj, 'age', (newValue, oldValue) => {
    console.log(`🎂 Idade alterada de ${oldValue} para ${newValue}`);
});

testObj.age = 31; // Vai disparar o watcher

// Rastrear função
const originalCalculate = function(a, b) {
    return a * b + Math.random();
};

const tracedCalculate = DebugHelper.traceFunction(originalCalculate, 'calculate');
const result = tracedCalculate(5, 10);

// Breakpoint condicional
for (let i = 0; i < 10; i++) {
    DebugHelper.breakpoint(i === 7, `Iteração ${i}`);
}

// Uso de memória
DebugHelper.memoryUsage();

// 3. ERROR HANDLING E DEBUGGING
console.log('\n=== 3. Error Handling para Debugging ===');

class ErrorTracker {
    constructor() {
        this.errors = [];
        this.setupGlobalHandlers();
    }
    
    setupGlobalHandlers() {
        // Capturar erros não tratados
        if (typeof window !== 'undefined') {
            window.addEventListener('error', (event) => {
                this.logError({
                    type: 'javascript',
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error,
                    stack: event.error?.stack
                });
            });
            
            // Capturar promises rejeitadas
            window.addEventListener('unhandledrejection', (event) => {
                this.logError({
                    type: 'promise',
                    message: 'Unhandled Promise Rejection',
                    reason: event.reason,
                    stack: event.reason?.stack
                });
            });
        }
    }
    
    logError(errorInfo) {
        const error = {
            ...errorInfo,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js',
            url: typeof window !== 'undefined' ? window.location.href : 'N/A',
            id: Math.random().toString(36).substr(2, 9)
        };
        
        this.errors.push(error);
        
        console.group(`🚨 Erro capturado: ${error.id}`);
        console.error('Tipo:', error.type);
        console.error('Mensagem:', error.message);
        console.error('Timestamp:', error.timestamp);
        
        if (error.filename) {
            console.error('Arquivo:', error.filename);
            console.error('Linha:', error.lineno, 'Coluna:', error.colno);
        }
        
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        console.groupEnd();
    }
    
    wrapFunction(fn, context = 'unknown') {
        return (...args) => {
            try {
                const result = fn.apply(this, args);
                
                if (result instanceof Promise) {
                    return result.catch(error => {
                        this.logError({
                            type: 'async-function',
                            message: error.message,
                            context,
                            error,
                            stack: error.stack
                        });
                        throw error;
                    });
                }
                
                return result;
            } catch (error) {
                this.logError({
                    type: 'function',
                    message: error.message,
                    context,
                    error,
                    stack: error.stack
                });
                throw error;
            }
        };
    }
    
    getErrors(type = null) {
        if (type) {
            return this.errors.filter(error => error.type === type);
        }
        return this.errors;
    }
    
    getErrorStats() {
        const stats = {};
        this.errors.forEach(error => {
            stats[error.type] = (stats[error.type] || 0) + 1;
        });
        return stats;
    }
    
    exportErrors() {
        return JSON.stringify(this.errors, null, 2);
    }
    
    clear() {
        this.errors = [];
    }
}

// Testando ErrorTracker
const errorTracker = new ErrorTracker();

// Função que pode gerar erro
const riskyFunction = errorTracker.wrapFunction(function(value) {
    if (value < 0) {
        throw new Error('Valor não pode ser negativo');
    }
    return value * 2;
}, 'riskyFunction');

// Função assíncrona que pode falhar
const asyncRiskyFunction = errorTracker.wrapFunction(async function(delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (Math.random() < 0.3) {
        throw new Error('Falha aleatória na operação assíncrona');
    }
    
    return 'Sucesso!';
}, 'asyncRiskyFunction');

// Testar funções
try {
    riskyFunction(5); // Sucesso
    riskyFunction(-1); // Vai gerar erro
} catch (error) {
    console.log('Erro capturado e logado');
}

// Testar função assíncrona
asyncRiskyFunction(100)
    .then(result => console.log('Async result:', result))
    .catch(error => console.log('Async error capturado'));

// 4. PERFORMANCE DEBUGGING
console.log('\n=== 4. Performance Debugging ===');

class PerformanceMonitor {
    constructor() {
        this.measurements = [];
        this.observers = [];
        this.setupObservers();
    }
    
    setupObservers() {
        if (typeof PerformanceObserver !== 'undefined') {
            // Observer para medições de navegação
            const navObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.measurements.push({
                        type: 'navigation',
                        name: entry.name,
                        duration: entry.duration,
                        startTime: entry.startTime,
                        details: {
                            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                            loadComplete: entry.loadEventEnd - entry.loadEventStart
                        }
                    });
                });
            });
            
            try {
                navObserver.observe({ entryTypes: ['navigation'] });
                this.observers.push(navObserver);
            } catch (e) {
                console.warn('Navigation observer não suportado');
            }
            
            // Observer para recursos
            const resourceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach(entry => {
                    this.measurements.push({
                        type: 'resource',
                        name: entry.name,
                        duration: entry.duration,
                        size: entry.transferSize,
                        cached: entry.transferSize === 0
                    });
                });
            });
            
            try {
                resourceObserver.observe({ entryTypes: ['resource'] });
                this.observers.push(resourceObserver);
            } catch (e) {
                console.warn('Resource observer não suportado');
            }
        }
    }
    
    measure(name, fn) {
        const start = performance.now();
        
        try {
            const result = fn();
            
            if (result instanceof Promise) {
                return result.finally(() => {
                    const end = performance.now();
                    this.addMeasurement(name, end - start, 'async');
                });
            }
            
            const end = performance.now();
            this.addMeasurement(name, end - start, 'sync');
            return result;
            
        } catch (error) {
            const end = performance.now();
            this.addMeasurement(name, end - start, 'error');
            throw error;
        }
    }
    
    addMeasurement(name, duration, type = 'manual') {
        this.measurements.push({
            type,
            name,
            duration,
            timestamp: Date.now()
        });
        
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
    
    profile(name, iterations = 1000) {
        return (fn) => {
            console.log(`🔬 Profiling ${name} (${iterations} iterações)`);
            
            const times = [];
            
            for (let i = 0; i < iterations; i++) {
                const start = performance.now();
                fn();
                const end = performance.now();
                times.push(end - start);
            }
            
            const stats = {
                name,
                iterations,
                total: times.reduce((a, b) => a + b, 0),
                average: times.reduce((a, b) => a + b, 0) / times.length,
                min: Math.min(...times),
                max: Math.max(...times),
                median: times.sort((a, b) => a - b)[Math.floor(times.length / 2)]
            };
            
            console.table(stats);
            return stats;
        };
    }
    
    memorySnapshot() {
        if (performance.memory) {
            const snapshot = {
                timestamp: Date.now(),
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            };
            
            this.measurements.push({
                type: 'memory',
                ...snapshot
            });
            
            return snapshot;
        }
        
        return null;
    }
    
    getStats() {
        const byType = {};
        
        this.measurements.forEach(measurement => {
            if (!byType[measurement.type]) {
                byType[measurement.type] = {
                    count: 0,
                    totalDuration: 0,
                    avgDuration: 0
                };
            }
            
            byType[measurement.type].count++;
            if (measurement.duration) {
                byType[measurement.type].totalDuration += measurement.duration;
                byType[measurement.type].avgDuration = 
                    byType[measurement.type].totalDuration / byType[measurement.type].count;
            }
        });
        
        return byType;
    }
    
    exportMeasurements() {
        return JSON.stringify(this.measurements, null, 2);
    }
    
    clear() {
        this.measurements = [];
    }
    
    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Testando PerformanceMonitor
const perfMonitor = new PerformanceMonitor();

// Medir função simples
perfMonitor.measure('operacao-simples', () => {
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
        sum += i;
    }
    return sum;
});

// Medir função assíncrona
perfMonitor.measure('operacao-async', async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return 'Concluído';
});

// Profiling de diferentes implementações
const profileArray = perfMonitor.profile('array-operations', 1000);

profileArray(() => {
    const arr = [];
    for (let i = 0; i < 100; i++) {
        arr.push(i);
    }
});

profileArray(() => {
    const arr = new Array(100);
    for (let i = 0; i < 100; i++) {
        arr[i] = i;
    }
});

// Snapshot de memória
const memSnapshot = perfMonitor.memorySnapshot();
if (memSnapshot) {
    console.log('Memory snapshot:', memSnapshot);
}

// 5. DEBUGGING DE CÓDIGO ASSÍNCRONO
console.log('\n=== 5. Debugging Assíncrono ===');

class AsyncDebugger {
    constructor() {
        this.pendingOperations = new Map();
        this.completedOperations = [];
        this.operationId = 0;
    }
    
    wrapPromise(promise, label = 'Promise') {
        const id = ++this.operationId;
        const operation = {
            id,
            label,
            startTime: Date.now(),
            status: 'pending'
        };
        
        this.pendingOperations.set(id, operation);
        console.log(`🔄 [${id}] ${label} iniciada`);
        
        return promise
            .then(result => {
                operation.endTime = Date.now();
                operation.duration = operation.endTime - operation.startTime;
                operation.status = 'resolved';
                operation.result = result;
                
                this.pendingOperations.delete(id);
                this.completedOperations.push(operation);
                
                console.log(`✅ [${id}] ${label} resolvida em ${operation.duration}ms:`, result);
                return result;
            })
            .catch(error => {
                operation.endTime = Date.now();
                operation.duration = operation.endTime - operation.startTime;
                operation.status = 'rejected';
                operation.error = error;
                
                this.pendingOperations.delete(id);
                this.completedOperations.push(operation);
                
                console.error(`❌ [${id}] ${label} rejeitada em ${operation.duration}ms:`, error);
                throw error;
            });
    }
    
    async debugAsyncFunction(fn, label = 'AsyncFunction') {
        console.group(`🚀 Executando ${label}`);
        
        try {
            const result = await this.wrapPromise(fn(), label);
            console.groupEnd();
            return result;
        } catch (error) {
            console.groupEnd();
            throw error;
        }
    }
    
    trackAsyncFlow(promises, label = 'AsyncFlow') {
        console.group(`🌊 Fluxo assíncrono: ${label}`);
        
        const trackedPromises = promises.map((promise, index) => 
            this.wrapPromise(promise, `${label}-${index + 1}`)
        );
        
        return Promise.allSettled(trackedPromises)
            .then(results => {
                console.log(`📊 Resultados do fluxo ${label}:`);
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        console.log(`  ✅ ${index + 1}: ${result.value}`);
                    } else {
                        console.error(`  ❌ ${index + 1}: ${result.reason}`);
                    }
                });
                console.groupEnd();
                return results;
            });
    }
    
    getPendingOperations() {
        return Array.from(this.pendingOperations.values());
    }
    
    getCompletedOperations() {
        return this.completedOperations;
    }
    
    getStats() {
        const completed = this.completedOperations;
        const pending = this.getPendingOperations();
        
        const stats = {
            total: completed.length + pending.length,
            completed: completed.length,
            pending: pending.length,
            resolved: completed.filter(op => op.status === 'resolved').length,
            rejected: completed.filter(op => op.status === 'rejected').length
        };
        
        if (completed.length > 0) {
            const durations = completed
                .filter(op => op.duration)
                .map(op => op.duration);
            
            if (durations.length > 0) {
                stats.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
                stats.minDuration = Math.min(...durations);
                stats.maxDuration = Math.max(...durations);
            }
        }
        
        return stats;
    }
}

// Testando AsyncDebugger
const asyncDebugger = new AsyncDebugger();

// Função assíncrona de teste
const fetchData = (delay, shouldFail = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('Falha simulada'));
            } else {
                resolve(`Dados carregados após ${delay}ms`);
            }
        }, delay);
    });
};

// Testar operações individuais
asyncDebugger.debugAsyncFunction(
    () => fetchData(100),
    'Carregar dados do usuário'
);

asyncDebugger.debugAsyncFunction(
    () => fetchData(200, true),
    'Carregar dados que vão falhar'
).catch(() => {}); // Ignorar erro para continuar exemplo

// Testar fluxo de múltiplas operações
const promises = [
    fetchData(50),
    fetchData(150),
    fetchData(100, true),
    fetchData(75)
];

asyncDebugger.trackAsyncFlow(promises, 'Carregamento paralelo')
    .then(() => {
        console.log('\n📈 Estatísticas finais:', asyncDebugger.getStats());
    });

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE DEBUGGING COMPLETO
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Debugging Completo ===');

class DebugSystem {
    constructor(config = {}) {
        this.config = {
            logLevel: 'info',
            enablePerformance: true,
            enableErrorTracking: true,
            enableAsyncTracking: true,
            maxLogs: 1000,
            ...config
        };
        
        this.logger = new Logger(this.config.logLevel);
        this.errorTracker = new ErrorTracker();
        this.perfMonitor = new PerformanceMonitor();
        this.asyncDebugger = new AsyncDebugger();
        
        this.sessions = [];
        this.currentSession = this.createSession();
        
        console.log('🔧 Sistema de debugging inicializado');
    }
    
    createSession() {
        const session = {
            id: Math.random().toString(36).substr(2, 9),
            startTime: Date.now(),
            logs: [],
            errors: [],
            performance: [],
            async: []
        };
        
        this.sessions.push(session);
        return session;
    }
    
    log(level, message, data) {
        this.logger.log(level, message, data);
        
        this.currentSession.logs.push({
            level,
            message,
            data,
            timestamp: Date.now()
        });
        
        this.trimLogs();
    }
    
    error(message, error) {
        this.log('error', message, error);
        this.currentSession.errors.push({
            message,
            error,
            timestamp: Date.now(),
            stack: error?.stack
        });
    }
    
    measure(name, fn) {
        if (!this.config.enablePerformance) {
            return fn();
        }
        
        const result = this.perfMonitor.measure(name, fn);
        
        this.currentSession.performance.push({
            name,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    wrapAsync(promise, label) {
        if (!this.config.enableAsyncTracking) {
            return promise;
        }
        
        const wrapped = this.asyncDebugger.wrapPromise(promise, label);
        
        this.currentSession.async.push({
            label,
            timestamp: Date.now()
        });
        
        return wrapped;
    }
    
    debugFunction(fn, name = fn.name) {
        return (...args) => {
            this.log('debug', `Chamando função ${name}`, { args });
            
            return this.measure(name, () => {
                try {
                    const result = fn.apply(this, args);
                    
                    if (result instanceof Promise) {
                        return this.wrapAsync(result, name)
                            .then(res => {
                                this.log('debug', `Função ${name} resolvida`, { result: res });
                                return res;
                            })
                            .catch(err => {
                                this.error(`Função ${name} falhou`, err);
                                throw err;
                            });
                    }
                    
                    this.log('debug', `Função ${name} retornou`, { result });
                    return result;
                    
                } catch (err) {
                    this.error(`Função ${name} falhou`, err);
                    throw err;
                }
            });
        };
    }
    
    debugClass(ClassConstructor) {
        const debuggedClass = class extends ClassConstructor {
            constructor(...args) {
                super(...args);
                
                // Debug todos os métodos
                Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                    .filter(name => name !== 'constructor' && typeof this[name] === 'function')
                    .forEach(methodName => {
                        const originalMethod = this[methodName];
                        this[methodName] = this.debugFunction(originalMethod, `${ClassConstructor.name}.${methodName}`);
                    });
            }
        };
        
        Object.defineProperty(debuggedClass, 'name', { value: ClassConstructor.name });
        return debuggedClass;
    }
    
    trimLogs() {
        if (this.currentSession.logs.length > this.config.maxLogs) {
            this.currentSession.logs = this.currentSession.logs.slice(-this.config.maxLogs);
        }
    }
    
    getSessionReport(sessionId = this.currentSession.id) {
        const session = this.sessions.find(s => s.id === sessionId);
        if (!session) {
            throw new Error('Sessão não encontrada');
        }
        
        const duration = Date.now() - session.startTime;
        
        return {
            sessionId: session.id,
            duration,
            summary: {
                totalLogs: session.logs.length,
                totalErrors: session.errors.length,
                totalPerformanceMeasures: session.performance.length,
                totalAsyncOperations: session.async.length
            },
            logs: session.logs,
            errors: session.errors,
            performance: session.performance,
            async: session.async
        };
    }
    
    exportSession(sessionId = this.currentSession.id, format = 'json') {
        const report = this.getSessionReport(sessionId);
        
        switch (format) {
            case 'json':
                return JSON.stringify(report, null, 2);
            case 'csv':
                // Implementação simplificada de CSV
                const logs = report.logs.map(log => 
                    `${new Date(log.timestamp).toISOString()},${log.level},"${log.message}"`
                ).join('\n');
                return `timestamp,level,message\n${logs}`;
            default:
                throw new Error(`Formato '${format}' não suportado`);
        }
    }
    
    newSession() {
        this.currentSession = this.createSession();
        this.log('info', 'Nova sessão de debugging iniciada');
        return this.currentSession.id;
    }
    
    clear() {
        this.logger.clear();
        this.errorTracker.clear();
        this.perfMonitor.clear();
        this.currentSession = this.createSession();
    }
    
    destroy() {
        this.perfMonitor.disconnect();
        this.clear();
    }
}

// Testando Sistema de Debugging Completo
const debugSystem = new DebugSystem({
    logLevel: 'debug',
    enablePerformance: true,
    enableErrorTracking: true,
    enableAsyncTracking: true
});

// Classe de exemplo para debugging
class Calculator {
    add(a, b) {
        return a + b;
    }
    
    async divide(a, b) {
        if (b === 0) {
            throw new Error('Divisão por zero');
        }
        
        // Simular operação assíncrona
        await new Promise(resolve => setTimeout(resolve, 50));
        return a / b;
    }
    
    complexOperation(n) {
        let result = 0;
        for (let i = 0; i < n; i++) {
            result += Math.sqrt(i);
        }
        return result;
    }
}

// Criar versão debugada da classe
const DebuggedCalculator = debugSystem.debugClass(Calculator);
const calc = new DebuggedCalculator();

// Testar operações
debugSystem.log('info', 'Iniciando testes da calculadora');

const sum = calc.add(5, 3);
debugSystem.log('info', 'Soma calculada', { result: sum });

const complex = calc.complexOperation(10000);
debugSystem.log('info', 'Operação complexa concluída', { result: complex });

// Testar operação assíncrona
calc.divide(10, 2)
    .then(result => {
        debugSystem.log('info', 'Divisão bem-sucedida', { result });
    })
    .catch(error => {
        debugSystem.error('Erro na divisão', error);
    });

// Testar erro
calc.divide(10, 0)
    .catch(error => {
        debugSystem.log('info', 'Erro esperado capturado');
    });

// Gerar relatório após um tempo
setTimeout(() => {
    const report = debugSystem.getSessionReport();
    console.log('\n📊 Relatório da sessão:');
    console.log('Resumo:', report.summary);
    console.log('Duração:', `${report.duration}ms`);
    
    // Export em JSON
    const jsonExport = debugSystem.exportSession();
    console.log('\n📄 Export JSON disponível (truncado):');
    console.log(jsonExport.substring(0, 500) + '...');
}, 200);

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Conditional Logging: Use níveis de log apropriados
2. Lazy Evaluation: Evite computações desnecessárias em logs
3. Sampling: Para aplicações de alto volume, use amostragem
4. Async Logging: Não bloqueie thread principal
5. Memory Management: Limite tamanho de logs e limpe periodicamente

BOAS PRÁTICAS:
1. Structured Logging: Use formato consistente
2. Context Information: Inclua informações relevantes
3. Error Boundaries: Implemente tratamento de erro robusto
4. Performance Impact: Minimize overhead de debugging
5. Security: Não logue informações sensíveis
6. Testing: Teste código de debugging também
7. Documentation: Documente estratégias de debugging
8. Monitoring: Monitore saúde do sistema de debugging
*/

// Exemplo de logging otimizado
class OptimizedLogger {
    constructor(level = 'info') {
        this.level = level;
        this.levels = { error: 0, warn: 1, info: 2, debug: 3 };
        this.buffer = [];
        this.flushInterval = 1000;
        this.maxBufferSize = 100;
        
        this.startFlushTimer();
    }
    
    log(level, message, dataFn) {
        if (this.levels[level] <= this.levels[this.level]) {
            // Lazy evaluation - só executa função se vai logar
            const data = typeof dataFn === 'function' ? dataFn() : dataFn;
            
            this.buffer.push({
                level,
                message,
                data,
                timestamp: Date.now()
            });
            
            if (this.buffer.length >= this.maxBufferSize) {
                this.flush();
            }
        }
    }
    
    flush() {
        if (this.buffer.length > 0) {
            // Em produção, enviaria para servidor
            console.log(`📦 Flushing ${this.buffer.length} logs`);
            this.buffer = [];
        }
    }
    
    startFlushTimer() {
        setInterval(() => this.flush(), this.flushInterval);
    }
}

// ==========================================
// REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS ===');

/*
FERRAMENTAS:
- Chrome DevTools
- Firefox Developer Tools
- VS Code Debugger
- Node.js Inspector
- Sentry (Error tracking)
- LogRocket (Session replay)
- Datadog (Monitoring)

TÉCNICAS AVANÇADAS:
- Source Maps debugging
- Remote debugging
- Memory leak detection
- CPU profiling
- Network debugging
- Mobile debugging

PRÓXIMOS PASSOS:
1. Praticar com DevTools
2. Implementar logging em projetos
3. Configurar error tracking
4. Estudar performance profiling
5. Aprender debugging de produção

PROJETOS SUGERIDOS:
- Sistema de logging centralizado
- Error tracking dashboard
- Performance monitoring
- Debug toolbar para desenvolvimento
- Automated testing com debugging
*/

/*
RESUMO DO MÓDULO DEBUGGING:

CONCEITOS APRENDIDOS:
✅ Console logging avançado
✅ Breakpoints programáticos
✅ Error handling e tracking
✅ Performance debugging
✅ Debugging assíncrono
✅ Metodologia de debugging

TÉCNICAS DOMINADAS:
✅ Logging estruturado
✅ Rastreamento de funções
✅ Monitoramento de performance
✅ Captura de erros globais
✅ Debugging de promises
✅ Profiling de código

FERRAMENTAS CRIADAS:
✅ Logger personalizado
✅ Debug helper
✅ Error tracker
✅ Performance monitor
✅ Async debugger
✅ Sistema de debugging completo

PRÓXIMO ARQUIVO: 02-testes-unitarios.js
*/