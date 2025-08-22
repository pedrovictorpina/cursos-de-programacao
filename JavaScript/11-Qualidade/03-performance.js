/**
 * MÓDULO 11: QUALIDADE DE CÓDIGO EM JAVASCRIPT
 * Arquivo 03: Performance e Otimização
 * 
 * A performance é crucial para uma boa experiência do usuário.
 * Vamos explorar técnicas de medição, análise e otimização
 * de código JavaScript, desde micro-otimizações até
 * estratégias arquiteturais.
 * 
 * Professor: Performance não é apenas sobre velocidade,
 * é sobre eficiência de recursos, experiência do usuário
 * e sustentabilidade do código. Meça antes de otimizar!
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender métricas de performance
2. Implementar ferramentas de profiling
3. Aplicar técnicas de otimização
4. Gerenciar memória eficientemente
5. Otimizar operações assíncronas
*/

// ==========================================
// TEORIA: FUNDAMENTOS DE PERFORMANCE
// ==========================================

/*
MÉTRICAS IMPORTANTES:
1. Time to First Byte (TTFB)
2. First Contentful Paint (FCP)
3. Largest Contentful Paint (LCP)
4. First Input Delay (FID)
5. Cumulative Layout Shift (CLS)
6. Time to Interactive (TTI)

TIPOS DE PERFORMANCE:
1. Runtime Performance - Execução do código
2. Load Performance - Carregamento inicial
3. Memory Performance - Uso de memória
4. Network Performance - Transferência de dados
5. Rendering Performance - Renderização visual

FATORES QUE AFETAM PERFORMANCE:
1. Complexidade algorítmica (Big O)
2. Uso de memória
3. Operações DOM
4. Network requests
5. Garbage collection
6. Event loop blocking

FERRAMENTAS DE MEDIÇÃO:
1. Performance API
2. DevTools Profiler
3. Lighthouse
4. WebPageTest
5. Chrome DevTools
6. Memory profilers

ESTRATÉGIAS DE OTIMIZAÇÃO:
1. Lazy Loading
2. Code Splitting
3. Caching
4. Debouncing/Throttling
5. Virtualization
6. Web Workers
7. Service Workers
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. SISTEMA DE PROFILING E MEDIÇÃO
console.log('\n=== 1. Sistema de Profiling ===');

class PerformanceProfiler {
    constructor() {
        this.measurements = new Map();
        this.markers = new Map();
        this.observers = [];
        this.memorySnapshots = [];
        this.isSupported = typeof performance !== 'undefined';
    }
    
    // Marcar início de uma operação
    mark(name) {
        if (!this.isSupported) return;
        
        const timestamp = performance.now();
        this.markers.set(name, {
            start: timestamp,
            memory: this.getMemoryUsage()
        });
        
        // Usar Performance API nativa se disponível
        if (performance.mark) {
            performance.mark(`${name}-start`);
        }
    }
    
    // Medir duração de uma operação
    measure(name, startMark) {
        if (!this.isSupported) return null;
        
        const endTime = performance.now();
        const startData = this.markers.get(startMark);
        
        if (!startData) {
            console.warn(`Marca '${startMark}' não encontrada`);
            return null;
        }
        
        const duration = endTime - startData.start;
        const endMemory = this.getMemoryUsage();
        
        const measurement = {
            name,
            duration,
            startTime: startData.start,
            endTime,
            memoryStart: startData.memory,
            memoryEnd: endMemory,
            memoryDelta: endMemory.usedJSHeapSize - startData.memory.usedJSHeapSize
        };
        
        this.measurements.set(name, measurement);
        
        // Usar Performance API nativa
        if (performance.mark && performance.measure) {
            performance.mark(`${startMark}-end`);
            performance.measure(name, `${startMark}-start`, `${startMark}-end`);
        }
        
        return measurement;
    }
    
    // Medir função automaticamente
    measureFunction(fn, name) {
        return (...args) => {
            this.mark(`${name}-start`);
            
            try {
                const result = fn.apply(this, args);
                
                // Se for Promise, medir quando resolver
                if (result && typeof result.then === 'function') {
                    return result.finally(() => {
                        this.measure(name, `${name}-start`);
                    });
                }
                
                this.measure(name, `${name}-start`);
                return result;
            } catch (error) {
                this.measure(name, `${name}-start`);
                throw error;
            }
        };
    }
    
    // Decorator para métodos
    measureMethod(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const methodName = `${target.constructor.name}.${propertyKey}`;
        
        descriptor.value = this.measureFunction(originalMethod, methodName);
        
        return descriptor;
    }
    
    // Obter uso de memória
    getMemoryUsage() {
        if (performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
        }
        
        return { usedJSHeapSize: 0, totalJSHeapSize: 0, jsHeapSizeLimit: 0 };
    }
    
    // Snapshot de memória
    takeMemorySnapshot(label) {
        const snapshot = {
            label,
            timestamp: Date.now(),
            memory: this.getMemoryUsage()
        };
        
        this.memorySnapshots.push(snapshot);
        return snapshot;
    }
    
    // Monitorar performance contínua
    startMonitoring(interval = 1000) {
        const monitor = setInterval(() => {
            this.takeMemorySnapshot('auto');
            
            // Verificar long tasks
            if (performance.getEntriesByType) {
                const longTasks = performance.getEntriesByType('longtask');
                longTasks.forEach(task => {
                    if (task.duration > 50) {
                        console.warn(`Long task detected: ${task.duration}ms`);
                    }
                });
            }
        }, interval);
        
        return () => clearInterval(monitor);
    }
    
    // Relatório de performance
    getReport() {
        const report = {
            measurements: Array.from(this.measurements.values()),
            memorySnapshots: this.memorySnapshots,
            summary: this.getSummary()
        };
        
        return report;
    }
    
    getSummary() {
        const measurements = Array.from(this.measurements.values());
        
        if (measurements.length === 0) {
            return { totalOperations: 0 };
        }
        
        const durations = measurements.map(m => m.duration);
        const memoryDeltas = measurements.map(m => m.memoryDelta);
        
        return {
            totalOperations: measurements.length,
            averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            minDuration: Math.min(...durations),
            maxDuration: Math.max(...durations),
            totalMemoryAllocated: memoryDeltas.reduce((a, b) => a + Math.max(0, b), 0),
            totalMemoryFreed: memoryDeltas.reduce((a, b) => a + Math.min(0, b), 0),
            slowestOperations: measurements
                .sort((a, b) => b.duration - a.duration)
                .slice(0, 5)
                .map(m => ({ name: m.name, duration: m.duration }))
        };
    }
    
    printReport() {
        const report = this.getReport();
        const summary = report.summary;
        
        console.log('\n📊 Relatório de Performance:');
        console.log(`Total de operações: ${summary.totalOperations}`);
        
        if (summary.totalOperations > 0) {
            console.log(`Duração média: ${summary.averageDuration.toFixed(2)}ms`);
            console.log(`Duração mínima: ${summary.minDuration.toFixed(2)}ms`);
            console.log(`Duração máxima: ${summary.maxDuration.toFixed(2)}ms`);
            console.log(`Memória alocada: ${(summary.totalMemoryAllocated / 1024 / 1024).toFixed(2)}MB`);
            
            if (summary.slowestOperations.length > 0) {
                console.log('\n🐌 Operações mais lentas:');
                summary.slowestOperations.forEach((op, index) => {
                    console.log(`  ${index + 1}. ${op.name}: ${op.duration.toFixed(2)}ms`);
                });
            }
        }
    }
    
    clear() {
        this.measurements.clear();
        this.markers.clear();
        this.memorySnapshots = [];
        
        if (performance.clearMarks) {
            performance.clearMarks();
        }
        if (performance.clearMeasures) {
            performance.clearMeasures();
        }
    }
}

// Testando o profiler
const profiler = new PerformanceProfiler();

// Função de exemplo para testar
function heavyComputation(n) {
    let result = 0;
    for (let i = 0; i < n; i++) {
        result += Math.sqrt(i) * Math.sin(i);
    }
    return result;
}

// Função assíncrona para testar
async function asyncOperation(delay) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random());
        }, delay);
    });
}

// Testando medições
profiler.mark('heavy-start');
heavyComputation(100000);
profiler.measure('heavy-computation', 'heavy-start');

// Testando função instrumentada
const measuredHeavy = profiler.measureFunction(heavyComputation, 'measured-heavy');
measuredHeavy(50000);

// Testando operação assíncrona
(async () => {
    const measuredAsync = profiler.measureFunction(asyncOperation, 'async-operation');
    await measuredAsync(100);
    
    profiler.printReport();
})();

// 2. OTIMIZAÇÃO DE ALGORITMOS
console.log('\n=== 2. Otimização de Algoritmos ===');

class AlgorithmOptimizer {
    // Comparar diferentes implementações
    static benchmark(implementations, testData, iterations = 1000) {
        const results = [];
        
        for (let [name, fn] of Object.entries(implementations)) {
            const start = performance.now();
            
            for (let i = 0; i < iterations; i++) {
                fn(testData);
            }
            
            const end = performance.now();
            const duration = end - start;
            
            results.push({
                name,
                duration,
                averagePerCall: duration / iterations,
                callsPerSecond: (iterations / duration) * 1000
            });
        }
        
        return results.sort((a, b) => a.duration - b.duration);
    }
    
    // Exemplo: Busca em array
    static searchBenchmark() {
        const data = Array.from({ length: 10000 }, (_, i) => i);
        const target = 7500;
        
        const implementations = {
            'Linear Search': (arr) => {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i] === target) return i;
                }
                return -1;
            },
            
            'Binary Search': (arr) => {
                let left = 0;
                let right = arr.length - 1;
                
                while (left <= right) {
                    const mid = Math.floor((left + right) / 2);
                    
                    if (arr[mid] === target) return mid;
                    if (arr[mid] < target) left = mid + 1;
                    else right = mid - 1;
                }
                
                return -1;
            },
            
            'Array.indexOf': (arr) => arr.indexOf(target),
            
            'Array.findIndex': (arr) => arr.findIndex(x => x === target)
        };
        
        return this.benchmark(implementations, data, 1000);
    }
    
    // Exemplo: Ordenação
    static sortBenchmark() {
        const generateData = () => Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
        
        const implementations = {
            'Bubble Sort': (arr) => {
                const sorted = [...arr];
                const n = sorted.length;
                
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - i - 1; j++) {
                        if (sorted[j] > sorted[j + 1]) {
                            [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
                        }
                    }
                }
                
                return sorted;
            },
            
            'Quick Sort': (arr) => {
                const quickSort = (array) => {
                    if (array.length <= 1) return array;
                    
                    const pivot = array[Math.floor(array.length / 2)];
                    const left = array.filter(x => x < pivot);
                    const middle = array.filter(x => x === pivot);
                    const right = array.filter(x => x > pivot);
                    
                    return [...quickSort(left), ...middle, ...quickSort(right)];
                };
                
                return quickSort([...arr]);
            },
            
            'Native Sort': (arr) => [...arr].sort((a, b) => a - b),
            
            'Merge Sort': (arr) => {
                const mergeSort = (array) => {
                    if (array.length <= 1) return array;
                    
                    const mid = Math.floor(array.length / 2);
                    const left = mergeSort(array.slice(0, mid));
                    const right = mergeSort(array.slice(mid));
                    
                    return merge(left, right);
                };
                
                const merge = (left, right) => {
                    const result = [];
                    let i = 0, j = 0;
                    
                    while (i < left.length && j < right.length) {
                        if (left[i] <= right[j]) {
                            result.push(left[i++]);
                        } else {
                            result.push(right[j++]);
                        }
                    }
                    
                    return result.concat(left.slice(i)).concat(right.slice(j));
                };
                
                return mergeSort([...arr]);
            }
        };
        
        return this.benchmark(implementations, generateData(), 100);
    }
    
    static printBenchmarkResults(results, title) {
        console.log(`\n📈 ${title}:`);
        
        results.forEach((result, index) => {
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
            console.log(`${emoji} ${result.name}:`);
            console.log(`   Tempo total: ${result.duration.toFixed(2)}ms`);
            console.log(`   Média por chamada: ${result.averagePerCall.toFixed(4)}ms`);
            console.log(`   Chamadas/segundo: ${result.callsPerSecond.toFixed(0)}`);
        });
    }
}

// Executar benchmarks
const searchResults = AlgorithmOptimizer.searchBenchmark();
AlgorithmOptimizer.printBenchmarkResults(searchResults, 'Benchmark de Busca');

const sortResults = AlgorithmOptimizer.sortBenchmark();
AlgorithmOptimizer.printBenchmarkResults(sortResults, 'Benchmark de Ordenação');

// 3. GERENCIAMENTO DE MEMÓRIA
console.log('\n=== 3. Gerenciamento de Memória ===');

class MemoryManager {
    constructor() {
        this.objectPools = new Map();
        this.weakRefs = new Set();
        this.memoryLeakDetector = new MemoryLeakDetector();
    }
    
    // Object Pool Pattern
    createObjectPool(factory, resetFn, initialSize = 10) {
        const pool = {
            objects: [],
            factory,
            resetFn,
            created: 0,
            reused: 0
        };
        
        // Pré-popular o pool
        for (let i = 0; i < initialSize; i++) {
            pool.objects.push(factory());
            pool.created++;
        }
        
        return pool;
    }
    
    // Obter objeto do pool
    acquire(poolName) {
        const pool = this.objectPools.get(poolName);
        if (!pool) {
            throw new Error(`Pool '${poolName}' não encontrado`);
        }
        
        let obj;
        
        if (pool.objects.length > 0) {
            obj = pool.objects.pop();
            pool.reused++;
        } else {
            obj = pool.factory();
            pool.created++;
        }
        
        return obj;
    }
    
    // Retornar objeto ao pool
    release(poolName, obj) {
        const pool = this.objectPools.get(poolName);
        if (!pool) {
            throw new Error(`Pool '${poolName}' não encontrado`);
        }
        
        // Reset do objeto
        if (pool.resetFn) {
            pool.resetFn(obj);
        }
        
        pool.objects.push(obj);
    }
    
    // Registrar pool
    registerPool(name, factory, resetFn, initialSize) {
        const pool = this.createObjectPool(factory, resetFn, initialSize);
        this.objectPools.set(name, pool);
        return pool;
    }
    
    // Weak References para evitar vazamentos
    trackObject(obj, cleanup) {
        if (typeof WeakRef !== 'undefined') {
            const weakRef = new WeakRef(obj);
            this.weakRefs.add({ weakRef, cleanup });
            
            return () => {
                this.weakRefs.delete({ weakRef, cleanup });
            };
        }
        
        return () => {}; // Fallback para ambientes sem WeakRef
    }
    
    // Limpeza de referências mortas
    cleanupWeakRefs() {
        for (let ref of this.weakRefs) {
            if (ref.weakRef.deref() === undefined) {
                if (ref.cleanup) {
                    ref.cleanup();
                }
                this.weakRefs.delete(ref);
            }
        }
    }
    
    // Estatísticas dos pools
    getPoolStats() {
        const stats = {};
        
        for (let [name, pool] of this.objectPools) {
            stats[name] = {
                available: pool.objects.length,
                created: pool.created,
                reused: pool.reused,
                reuseRatio: pool.reused / (pool.created + pool.reused)
            };
        }
        
        return stats;
    }
    
    printMemoryStats() {
        console.log('\n🧠 Estatísticas de Memória:');
        
        const memory = profiler.getMemoryUsage();
        console.log(`Heap usado: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Heap total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Limite do heap: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
        
        const poolStats = this.getPoolStats();
        if (Object.keys(poolStats).length > 0) {
            console.log('\n📦 Estatísticas dos Object Pools:');
            for (let [name, stats] of Object.entries(poolStats)) {
                console.log(`  ${name}:`);
                console.log(`    Disponíveis: ${stats.available}`);
                console.log(`    Criados: ${stats.created}`);
                console.log(`    Reutilizados: ${stats.reused}`);
                console.log(`    Taxa de reuso: ${(stats.reuseRatio * 100).toFixed(1)}%`);
            }
        }
    }
}

// Detector de vazamentos de memória
class MemoryLeakDetector {
    constructor() {
        this.snapshots = [];
        this.thresholds = {
            memoryGrowth: 10 * 1024 * 1024, // 10MB
            snapshotInterval: 5000 // 5 segundos
        };
        this.monitoring = false;
    }
    
    startMonitoring() {
        if (this.monitoring) return;
        
        this.monitoring = true;
        this.takeSnapshot('initial');
        
        this.monitoringInterval = setInterval(() => {
            this.takeSnapshot('auto');
            this.analyzeGrowth();
        }, this.thresholds.snapshotInterval);
        
        console.log('🔍 Monitoramento de vazamentos iniciado');
    }
    
    stopMonitoring() {
        if (!this.monitoring) return;
        
        this.monitoring = false;
        clearInterval(this.monitoringInterval);
        
        console.log('🔍 Monitoramento de vazamentos parado');
    }
    
    takeSnapshot(label) {
        const snapshot = {
            label,
            timestamp: Date.now(),
            memory: profiler.getMemoryUsage()
        };
        
        this.snapshots.push(snapshot);
        
        // Manter apenas os últimos 20 snapshots
        if (this.snapshots.length > 20) {
            this.snapshots.shift();
        }
        
        return snapshot;
    }
    
    analyzeGrowth() {
        if (this.snapshots.length < 2) return;
        
        const latest = this.snapshots[this.snapshots.length - 1];
        const previous = this.snapshots[this.snapshots.length - 2];
        
        const growth = latest.memory.usedJSHeapSize - previous.memory.usedJSHeapSize;
        
        if (growth > this.thresholds.memoryGrowth) {
            console.warn(`⚠️ Possível vazamento detectado: +${(growth / 1024 / 1024).toFixed(2)}MB`);
            this.generateLeakReport();
        }
    }
    
    generateLeakReport() {
        if (this.snapshots.length < 3) return;
        
        const recent = this.snapshots.slice(-5);
        const growthTrend = [];
        
        for (let i = 1; i < recent.length; i++) {
            const growth = recent[i].memory.usedJSHeapSize - recent[i-1].memory.usedJSHeapSize;
            growthTrend.push(growth);
        }
        
        const averageGrowth = growthTrend.reduce((a, b) => a + b, 0) / growthTrend.length;
        
        console.log('\n📋 Relatório de Vazamento:');
        console.log(`Crescimento médio: ${(averageGrowth / 1024).toFixed(2)}KB por snapshot`);
        console.log(`Tendência: ${averageGrowth > 0 ? '📈 Crescendo' : '📉 Estável'}`);
        
        if (averageGrowth > 1024 * 1024) { // 1MB
            console.log('🚨 Vazamento significativo detectado!');
            console.log('💡 Sugestões:');
            console.log('  - Verificar event listeners não removidos');
            console.log('  - Verificar closures mantendo referências');
            console.log('  - Verificar timers não limpos');
            console.log('  - Verificar caches crescendo indefinidamente');
        }
    }
}

// Exemplo de uso do gerenciador de memória
const memoryManager = new MemoryManager();

// Registrar pool de objetos
memoryManager.registerPool('vectors', 
    () => ({ x: 0, y: 0, z: 0 }),
    (obj) => { obj.x = 0; obj.y = 0; obj.z = 0; },
    5
);

memoryManager.registerPool('particles',
    () => ({ 
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        life: 1.0,
        active: false
    }),
    (obj) => {
        obj.position.x = 0;
        obj.position.y = 0;
        obj.velocity.x = 0;
        obj.velocity.y = 0;
        obj.life = 1.0;
        obj.active = false;
    },
    10
);

// Usar pools
const vector1 = memoryManager.acquire('vectors');
vector1.x = 10;
vector1.y = 20;
vector1.z = 30;

const particle1 = memoryManager.acquire('particles');
particle1.position.x = 100;
particle1.active = true;

// Retornar ao pool
memoryManager.release('vectors', vector1);
memoryManager.release('particles', particle1);

memoryManager.printMemoryStats();

// 4. OTIMIZAÇÃO DE OPERAÇÕES ASSÍNCRONAS
console.log('\n=== 4. Otimização Assíncrona ===');

class AsyncOptimizer {
    // Batch processing
    static createBatchProcessor(processFn, batchSize = 10, delay = 100) {
        let queue = [];
        let processing = false;
        
        const processQueue = async () => {
            if (processing || queue.length === 0) return;
            
            processing = true;
            
            while (queue.length > 0) {
                const batch = queue.splice(0, batchSize);
                
                try {
                    await processFn(batch);
                } catch (error) {
                    console.error('Erro no batch:', error);
                }
                
                // Delay entre batches para não bloquear
                if (queue.length > 0) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            processing = false;
        };
        
        return {
            add: (item) => {
                queue.push(item);
                processQueue();
            },
            
            addMany: (items) => {
                queue.push(...items);
                processQueue();
            },
            
            getQueueSize: () => queue.length,
            
            isProcessing: () => processing
        };
    }
    
    // Promise pool para limitar concorrência
    static createPromisePool(concurrency = 5) {
        let running = 0;
        const queue = [];
        
        const execute = async (promiseFactory) => {
            return new Promise((resolve, reject) => {
                queue.push({ promiseFactory, resolve, reject });
                process();
            });
        };
        
        const process = async () => {
            if (running >= concurrency || queue.length === 0) {
                return;
            }
            
            running++;
            const { promiseFactory, resolve, reject } = queue.shift();
            
            try {
                const result = await promiseFactory();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                running--;
                process(); // Processar próximo na fila
            }
        };
        
        return {
            execute,
            getStats: () => ({
                running,
                queued: queue.length,
                concurrency
            })
        };
    }
    
    // Cache com TTL
    static createTTLCache(defaultTTL = 60000) {
        const cache = new Map();
        const timers = new Map();
        
        const set = (key, value, ttl = defaultTTL) => {
            // Limpar timer existente
            if (timers.has(key)) {
                clearTimeout(timers.get(key));
            }
            
            cache.set(key, value);
            
            // Configurar expiração
            const timer = setTimeout(() => {
                cache.delete(key);
                timers.delete(key);
            }, ttl);
            
            timers.set(key, timer);
        };
        
        const get = (key) => cache.get(key);
        
        const has = (key) => cache.has(key);
        
        const clear = () => {
            cache.clear();
            timers.forEach(timer => clearTimeout(timer));
            timers.clear();
        };
        
        const size = () => cache.size;
        
        return { set, get, has, clear, size };
    }
    
    // Debounce e Throttle
    static debounce(func, delay) {
        let timeoutId;
        
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    static throttle(func, limit) {
        let inThrottle;
        
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Retry com backoff exponencial
    static async retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                const delay = baseDelay * Math.pow(2, attempt);
                console.log(`Tentativa ${attempt + 1} falhou, tentando novamente em ${delay}ms`);
                
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    }
}

// Exemplos de uso das otimizações assíncronas

// Batch processor
const batchProcessor = AsyncOptimizer.createBatchProcessor(
    async (batch) => {
        console.log(`Processando batch de ${batch.length} itens:`, batch);
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 50));
    },
    3, // batch size
    100 // delay
);

// Adicionar itens ao batch
for (let i = 1; i <= 10; i++) {
    batchProcessor.add(`item-${i}`);
}

// Promise pool
const promisePool = AsyncOptimizer.createPromisePool(2);

// Simular múltiplas operações assíncronas
const asyncOperations = [];
for (let i = 1; i <= 5; i++) {
    asyncOperations.push(
        promisePool.execute(async () => {
            console.log(`Iniciando operação ${i}`);
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
            console.log(`Operação ${i} concluída`);
            return `resultado-${i}`;
        })
    );
}

Promise.all(asyncOperations).then(results => {
    console.log('Todas as operações concluídas:', results);
});

// Cache TTL
const cache = AsyncOptimizer.createTTLCache(2000); // 2 segundos TTL

cache.set('user:1', { name: 'João', age: 30 });
console.log('Cache size:', cache.size());
console.log('User 1:', cache.get('user:1'));

setTimeout(() => {
    console.log('Após TTL - User 1:', cache.get('user:1'));
    console.log('Cache size após TTL:', cache.size());
}, 2500);

// Debounce example
const debouncedLog = AsyncOptimizer.debounce((message) => {
    console.log('Debounced:', message);
}, 300);

// Throttle example
const throttledLog = AsyncOptimizer.throttle((message) => {
    console.log('Throttled:', message);
}, 1000);

// 5. LAZY LOADING E CODE SPLITTING
console.log('\n=== 5. Lazy Loading ===');

class LazyLoader {
    constructor() {
        this.modules = new Map();
        this.loading = new Map();
    }
    
    // Registrar módulo para carregamento lazy
    register(name, loader) {
        this.modules.set(name, {
            loader,
            loaded: false,
            module: null
        });
    }
    
    // Carregar módulo sob demanda
    async load(name) {
        const moduleInfo = this.modules.get(name);
        
        if (!moduleInfo) {
            throw new Error(`Módulo '${name}' não registrado`);
        }
        
        // Se já carregado, retornar cache
        if (moduleInfo.loaded) {
            return moduleInfo.module;
        }
        
        // Se já está carregando, aguardar
        if (this.loading.has(name)) {
            return this.loading.get(name);
        }
        
        // Iniciar carregamento
        const loadingPromise = this.loadModule(name, moduleInfo);
        this.loading.set(name, loadingPromise);
        
        try {
            const module = await loadingPromise;
            moduleInfo.loaded = true;
            moduleInfo.module = module;
            this.loading.delete(name);
            
            return module;
        } catch (error) {
            this.loading.delete(name);
            throw error;
        }
    }
    
    async loadModule(name, moduleInfo) {
        console.log(`🔄 Carregando módulo: ${name}`);
        
        const startTime = performance.now();
        
        try {
            const module = await moduleInfo.loader();
            const loadTime = performance.now() - startTime;
            
            console.log(`✅ Módulo '${name}' carregado em ${loadTime.toFixed(2)}ms`);
            
            return module;
        } catch (error) {
            console.error(`❌ Erro ao carregar módulo '${name}':`, error);
            throw error;
        }
    }
    
    // Pré-carregar módulos
    async preload(names) {
        const promises = names.map(name => this.load(name));
        return Promise.all(promises);
    }
    
    // Estatísticas
    getStats() {
        const stats = {
            total: this.modules.size,
            loaded: 0,
            loading: this.loading.size
        };
        
        for (let moduleInfo of this.modules.values()) {
            if (moduleInfo.loaded) {
                stats.loaded++;
            }
        }
        
        return stats;
    }
}

// Simulação de módulos
const lazyLoader = new LazyLoader();

// Registrar módulos
lazyLoader.register('charts', async () => {
    // Simular carregamento de biblioteca de gráficos
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        createChart: (data) => `Chart with ${data.length} points`,
        types: ['line', 'bar', 'pie']
    };
});

lazyLoader.register('utils', async () => {
    // Simular carregamento de utilitários
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
        formatDate: (date) => date.toISOString(),
        debounce: AsyncOptimizer.debounce,
        throttle: AsyncOptimizer.throttle
    };
});

lazyLoader.register('heavy-computation', async () => {
    // Simular carregamento de módulo pesado
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        complexAlgorithm: (data) => {
            // Simulação de algoritmo complexo
            return data.reduce((acc, val) => acc + Math.sqrt(val), 0);
        }
    };
});

// Usar lazy loading
(async () => {
    try {
        // Carregar módulo sob demanda
        const charts = await lazyLoader.load('charts');
        console.log('Charts loaded:', charts.createChart([1, 2, 3, 4, 5]));
        
        // Carregar múltiplos módulos
        const [utils, heavyComp] = await Promise.all([
            lazyLoader.load('utils'),
            lazyLoader.load('heavy-computation')
        ]);
        
        console.log('Utils loaded:', utils.formatDate(new Date()));
        console.log('Heavy computation result:', heavyComp.complexAlgorithm([1, 4, 9, 16, 25]));
        
        console.log('Lazy loader stats:', lazyLoader.getStats());
    } catch (error) {
        console.error('Erro no lazy loading:', error);
    }
})();

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE PERFORMANCE COMPLETO
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Performance Completo ===');

class PerformanceOptimizationSuite {
    constructor() {
        this.profiler = new PerformanceProfiler();
        this.memoryManager = new MemoryManager();
        this.lazyLoader = new LazyLoader();
        this.cache = AsyncOptimizer.createTTLCache();
        this.promisePool = AsyncOptimizer.createPromisePool(3);
        
        this.metrics = {
            operations: 0,
            cacheHits: 0,
            cacheMisses: 0,
            memoryPeaks: [],
            slowOperations: []
        };
        
        this.thresholds = {
            slowOperation: 100, // ms
            memoryWarning: 50 * 1024 * 1024 // 50MB
        };
    }
    
    // Operação otimizada com cache, profiling e pool
    async optimizedOperation(key, expensiveOperation, ttl = 60000) {
        this.metrics.operations++;
        
        // Verificar cache primeiro
        if (this.cache.has(key)) {
            this.metrics.cacheHits++;
            return this.cache.get(key);
        }
        
        this.metrics.cacheMisses++;
        
        // Executar operação com profiling e pool
        const result = await this.promisePool.execute(async () => {
            const measuredOperation = this.profiler.measureFunction(
                expensiveOperation, 
                `operation-${key}`
            );
            
            return await measuredOperation();
        });
        
        // Armazenar no cache
        this.cache.set(key, result, ttl);
        
        // Verificar se foi operação lenta
        const measurement = this.profiler.measurements.get(`operation-${key}`);
        if (measurement && measurement.duration > this.thresholds.slowOperation) {
            this.metrics.slowOperations.push({
                key,
                duration: measurement.duration,
                timestamp: Date.now()
            });
        }
        
        return result;
    }
    
    // Processamento em lote otimizado
    async batchProcess(items, processor, batchSize = 10) {
        const batchProcessor = AsyncOptimizer.createBatchProcessor(
            async (batch) => {
                const results = await Promise.all(
                    batch.map(item => this.optimizedOperation(
                        `batch-${item.id}`,
                        () => processor(item)
                    ))
                );
                return results;
            },
            batchSize,
            50 // delay entre batches
        );
        
        const results = [];
        
        for (let item of items) {
            batchProcessor.add(item);
        }
        
        // Aguardar processamento completo
        while (batchProcessor.getQueueSize() > 0 || batchProcessor.isProcessing()) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return results;
    }
    
    // Monitoramento contínuo
    startMonitoring() {
        const stopProfilerMonitoring = this.profiler.startMonitoring(2000);
        
        const memoryMonitoring = setInterval(() => {
            const memory = this.profiler.getMemoryUsage();
            
            if (memory.usedJSHeapSize > this.thresholds.memoryWarning) {
                this.metrics.memoryPeaks.push({
                    usage: memory.usedJSHeapSize,
                    timestamp: Date.now()
                });
                
                console.warn(`⚠️ Alto uso de memória: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            }
        }, 5000);
        
        return () => {
            stopProfilerMonitoring();
            clearInterval(memoryMonitoring);
        };
    }
    
    // Relatório completo de performance
    generateReport() {
        const profilerReport = this.profiler.getReport();
        const memoryStats = this.memoryManager.getPoolStats();
        const lazyStats = this.lazyLoader.getStats();
        const promisePoolStats = this.promisePool.getStats();
        
        const report = {
            timestamp: new Date().toISOString(),
            operations: {
                total: this.metrics.operations,
                cacheHitRate: this.metrics.operations > 0 
                    ? (this.metrics.cacheHits / this.metrics.operations * 100).toFixed(1)
                    : 0,
                slowOperations: this.metrics.slowOperations.length
            },
            memory: {
                current: this.profiler.getMemoryUsage(),
                peaks: this.metrics.memoryPeaks.length,
                pools: memoryStats
            },
            async: {
                promisePool: promisePoolStats,
                cacheSize: this.cache.size()
            },
            modules: lazyStats,
            profiling: profilerReport.summary
        };
        
        return report;
    }
    
    printReport() {
        const report = this.generateReport();
        
        console.log('\n📊 Relatório Completo de Performance:');
        console.log('\n🔧 Operações:');
        console.log(`  Total: ${report.operations.total}`);
        console.log(`  Cache hit rate: ${report.operations.cacheHitRate}%`);
        console.log(`  Operações lentas: ${report.operations.slowOperations}`);
        
        console.log('\n🧠 Memória:');
        console.log(`  Uso atual: ${(report.memory.current.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        console.log(`  Picos detectados: ${report.memory.peaks}`);
        
        console.log('\n⚡ Assíncrono:');
        console.log(`  Promise pool - Executando: ${report.async.promisePool.running}`);
        console.log(`  Promise pool - Na fila: ${report.async.promisePool.queued}`);
        console.log(`  Cache size: ${report.async.cacheSize}`);
        
        console.log('\n📦 Módulos:');
        console.log(`  Total: ${report.modules.total}`);
        console.log(`  Carregados: ${report.modules.loaded}`);
        console.log(`  Carregando: ${report.modules.loading}`);
        
        if (report.profiling.slowestOperations && report.profiling.slowestOperations.length > 0) {
            console.log('\n🐌 Operações mais lentas:');
            report.profiling.slowestOperations.forEach((op, index) => {
                console.log(`  ${index + 1}. ${op.name}: ${op.duration.toFixed(2)}ms`);
            });
        }
    }
}

// Exemplo de uso do sistema completo
const perfSuite = new PerformanceOptimizationSuite();

// Simular operações
const simulateWork = async () => {
    console.log('\n🚀 Iniciando simulação de trabalho...');
    
    // Operações que serão otimizadas
    const operations = [
        { id: 1, data: 'operation-1' },
        { id: 2, data: 'operation-2' },
        { id: 3, data: 'operation-3' },
        { id: 1, data: 'operation-1' }, // Repetida - deve usar cache
        { id: 4, data: 'operation-4' },
        { id: 2, data: 'operation-2' }  // Repetida - deve usar cache
    ];
    
    // Processar operações
    for (let op of operations) {
        await perfSuite.optimizedOperation(
            `op-${op.id}`,
            async () => {
                // Simular trabalho pesado
                await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
                return `Resultado para ${op.data}`;
            }
        );
    }
    
    console.log('✅ Simulação concluída');
};

// Executar simulação e gerar relatório
(async () => {
    const stopMonitoring = perfSuite.startMonitoring();
    
    await simulateWork();
    
    setTimeout(() => {
        perfSuite.printReport();
        stopMonitoring();
    }, 1000);
})();

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO DE PERFORMANCE:

1. MEDIÇÃO PRIMEIRO:
   - Sempre meça antes de otimizar
   - Use ferramentas de profiling
   - Identifique gargalos reais
   - Estabeleça baselines

2. ALGORITMOS E ESTRUTURAS:
   - Escolha algoritmos apropriados (Big O)
   - Use estruturas de dados eficientes
   - Evite loops aninhados desnecessários
   - Considere trade-offs espaço vs tempo

3. MEMÓRIA:
   - Evite vazamentos de memória
   - Use object pooling para objetos frequentes
   - Implemente cleanup adequado
   - Monitore uso de memória

4. OPERAÇÕES ASSÍNCRONAS:
   - Use Promise pools para controlar concorrência
   - Implemente caching inteligente
   - Aplique debounce/throttle quando apropriado
   - Considere batch processing

5. CARREGAMENTO:
   - Implemente lazy loading
   - Use code splitting
   - Otimize bundle size
   - Considere preloading estratégico

6. DOM E RENDERING:
   - Minimize manipulações DOM
   - Use requestAnimationFrame
   - Implemente virtualization para listas grandes
   - Evite layout thrashing

7. NETWORK:
   - Minimize requests HTTP
   - Use caching apropriado
   - Implemente retry com backoff
   - Considere compression

BOAS PRÁTICAS:

1. MONITORAMENTO:
   - Monitore performance em produção
   - Configure alertas para degradação
   - Colete métricas de usuários reais
   - Use synthetic monitoring

2. TESTING:
   - Teste performance regularmente
   - Use benchmarks automatizados
   - Teste em diferentes dispositivos
   - Monitore regressões

3. DOCUMENTAÇÃO:
   - documente decisões de performance
   - Mantenha guias de otimização
   - Compartilhe conhecimento da equipe
   - Documente trade-offs

4. CULTURA:
   - Faça performance parte do processo
   - Revise impacto de performance em PRs
   - Eduque a equipe sobre performance
   - Celebre melhorias de performance
*/

// ==========================================
// REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS ===');

/*
FERRAMENTAS DE PERFORMANCE:
- Chrome DevTools Performance tab
- Lighthouse
- WebPageTest
- Performance API
- Memory profilers
- Bundle analyzers

MÉTRICAS IMPORTANTES:
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Speed Index
- Total Blocking Time (TBT)

TÉCNICAS AVANÇADAS:
- Service Workers
- Web Workers
- WebAssembly
- Streaming
- Progressive loading
- Resource hints

PRÓXIMOS PASSOS:
1. Implementar monitoring em produção
2. Configurar performance budgets
3. Automatizar testes de performance
4. Estudar Web Workers
5. Explorar WebAssembly

PROJETOS SUGERIDOS:
- Dashboard de performance
- Sistema de monitoring
- Framework de benchmarking
- Otimizador automático
- Performance regression detector
*/

/*
RESUMO DO MÓDULO PERFORMANCE:

CONCEITOS APRENDIDOS:
✅ Métricas de performance
✅ Profiling e medição
✅ Otimização de algoritmos
✅ Gerenciamento de memória
✅ Object pooling
✅ Otimização assíncrona
✅ Lazy loading
✅ Caching strategies

TÉCNICAS DOMINADAS:
✅ Performance API
✅ Memory profiling
✅ Benchmark automation
✅ Promise pools
✅ Batch processing
✅ TTL caching
✅ Debounce/throttle
✅ Retry mechanisms

FERRAMENTAS CRIADAS:
✅ Performance profiler
✅ Memory manager
✅ Algorithm optimizer
✅ Async optimizer
✅ Lazy loader
✅ Performance suite completa
✅ Monitoring system

PRÓXIMO ARQUIVO: 04-boas-praticas.js
*/