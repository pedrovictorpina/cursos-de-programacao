/*
========================================
EXERCÍCIOS DE TESTES E DEBUGGING
========================================

Este arquivo contém 3 exercícios práticos para aprender e aplicar
técnicas de testes e debugging em JavaScript:

1. Framework de Testes Simples (Unit Testing)
2. Sistema de Debugging e Profiling
3. Sistema de Monitoramento e Logging

Cada exercício demonstra diferentes aspectos do desenvolvimento
de software com foco em qualidade e manutenibilidade.

========================================
EXERCÍCIO 1: FRAMEWORK DE TESTES SIMPLES
========================================

Implementação de um framework básico de testes unitários
com suporte a:
• Assertions básicas
• Test suites e test cases
• Setup e teardown
• Mocking e stubbing
• Relatórios de cobertura
*/

// Classe base para assertions
class Assert {
    static equal(actual, expected, message = '') {
        if (actual !== expected) {
            throw new AssertionError(
                `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
                message
            );
        }
    }
    
    static deepEqual(actual, expected, message = '') {
        if (!this.isDeepEqual(actual, expected)) {
            throw new AssertionError(
                `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`,
                message
            );
        }
    }
    
    static isTrue(value, message = '') {
        if (value !== true) {
            throw new AssertionError(
                `Expected true but got ${JSON.stringify(value)}`,
                message
            );
        }
    }
    
    static isFalse(value, message = '') {
        if (value !== false) {
            throw new AssertionError(
                `Expected false but got ${JSON.stringify(value)}`,
                message
            );
        }
    }
    
    static throws(fn, expectedError, message = '') {
        let thrown = false;
        let actualError = null;
        
        try {
            fn();
        } catch (error) {
            thrown = true;
            actualError = error;
        }
        
        if (!thrown) {
            throw new AssertionError('Expected function to throw an error', message);
        }
        
        if (expectedError && !(actualError instanceof expectedError)) {
            throw new AssertionError(
                `Expected error of type ${expectedError.name} but got ${actualError.constructor.name}`,
                message
            );
        }
    }
    
    static async rejects(promise, expectedError, message = '') {
        let rejected = false;
        let actualError = null;
        
        try {
            await promise;
        } catch (error) {
            rejected = true;
            actualError = error;
        }
        
        if (!rejected) {
            throw new AssertionError('Expected promise to reject', message);
        }
        
        if (expectedError && !(actualError instanceof expectedError)) {
            throw new AssertionError(
                `Expected error of type ${expectedError.name} but got ${actualError.constructor.name}`,
                message
            );
        }
    }
    
    static isDeepEqual(a, b) {
        if (a === b) return true;
        
        if (a == null || b == null) return false;
        
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!this.isDeepEqual(a[i], b[i])) return false;
            }
            return true;
        }
        
        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (const key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!this.isDeepEqual(a[key], b[key])) return false;
            }
            return true;
        }
        
        return false;
    }
}

// Classe de erro para assertions
class AssertionError extends Error {
    constructor(message, userMessage = '') {
        super(userMessage ? `${userMessage}: ${message}` : message);
        this.name = 'AssertionError';
    }
}

// Sistema de mocking
class Mock {
    constructor(originalFunction) {
        this.originalFunction = originalFunction;
        this.calls = [];
        this.returnValues = [];
        this.throwErrors = [];
        this.callCount = 0;
    }
    
    // Configurar valor de retorno
    returns(value) {
        this.returnValues.push(value);
        return this;
    }
    
    // Configurar erro a ser lançado
    throws(error) {
        this.throwErrors.push(error);
        return this;
    }
    
    // Função mockada
    fn(...args) {
        this.calls.push(args);
        this.callCount++;
        
        // Verificar se deve lançar erro
        if (this.throwErrors.length > 0) {
            const error = this.throwErrors.shift();
            throw error;
        }
        
        // Retornar valor configurado
        if (this.returnValues.length > 0) {
            return this.returnValues.shift();
        }
        
        // Chamar função original se disponível
        if (this.originalFunction) {
            return this.originalFunction(...args);
        }
        
        return undefined;
    }
    
    // Verificações
    wasCalledWith(...expectedArgs) {
        return this.calls.some(args => 
            args.length === expectedArgs.length &&
            args.every((arg, index) => Assert.isDeepEqual(arg, expectedArgs[index]))
        );
    }
    
    wasCalledTimes(expectedCount) {
        return this.callCount === expectedCount;
    }
    
    // Reset do mock
    reset() {
        this.calls = [];
        this.returnValues = [];
        this.throwErrors = [];
        this.callCount = 0;
        return this;
    }
}

// Test case individual
class TestCase {
    constructor(name, testFunction) {
        this.name = name;
        this.testFunction = testFunction;
        this.status = 'pending';
        this.error = null;
        this.duration = 0;
        this.setup = null;
        this.teardown = null;
    }
    
    // Configurar setup
    beforeEach(setupFunction) {
        this.setup = setupFunction;
        return this;
    }
    
    // Configurar teardown
    afterEach(teardownFunction) {
        this.teardown = teardownFunction;
        return this;
    }
    
    // Executar teste
    async run(context = {}) {
        const startTime = Date.now();
        
        try {
            // Executar setup
            if (this.setup) {
                await this.setup(context);
            }
            
            // Executar teste
            await this.testFunction(context);
            
            this.status = 'passed';
        } catch (error) {
            this.status = 'failed';
            this.error = error;
        } finally {
            // Executar teardown
            if (this.teardown) {
                try {
                    await this.teardown(context);
                } catch (teardownError) {
                    console.warn('Erro no teardown:', teardownError);
                }
            }
            
            this.duration = Date.now() - startTime;
        }
        
        return this;
    }
}

// Test suite
class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeEachHooks = [];
        this.afterEachHooks = [];
        this.beforeAllHooks = [];
        this.afterAllHooks = [];
    }
    
    // Adicionar teste
    test(name, testFunction) {
        const testCase = new TestCase(name, testFunction);
        this.tests.push(testCase);
        return testCase;
    }
    
    // Hooks
    beforeEach(hook) {
        this.beforeEachHooks.push(hook);
        return this;
    }
    
    afterEach(hook) {
        this.afterEachHooks.push(hook);
        return this;
    }
    
    beforeAll(hook) {
        this.beforeAllHooks.push(hook);
        return this;
    }
    
    afterAll(hook) {
        this.afterAllHooks.push(hook);
        return this;
    }
    
    // Executar todos os testes
    async run() {
        const context = {};
        const results = {
            suite: this.name,
            total: this.tests.length,
            passed: 0,
            failed: 0,
            duration: 0,
            tests: []
        };
        
        const startTime = Date.now();
        
        try {
            // Executar beforeAll hooks
            for (const hook of this.beforeAllHooks) {
                await hook(context);
            }
            
            // Executar cada teste
            for (const test of this.tests) {
                // Executar beforeEach hooks
                for (const hook of this.beforeEachHooks) {
                    await hook(context);
                }
                
                // Executar teste
                await test.run(context);
                
                // Executar afterEach hooks
                for (const hook of this.afterEachHooks) {
                    await hook(context);
                }
                
                // Coletar resultados
                results.tests.push({
                    name: test.name,
                    status: test.status,
                    duration: test.duration,
                    error: test.error ? test.error.message : null
                });
                
                if (test.status === 'passed') {
                    results.passed++;
                } else {
                    results.failed++;
                }
            }
            
        } finally {
            // Executar afterAll hooks
            for (const hook of this.afterAllHooks) {
                try {
                    await hook(context);
                } catch (error) {
                    console.warn('Erro no afterAll hook:', error);
                }
            }
            
            results.duration = Date.now() - startTime;
        }
        
        return results;
    }
}

// Test runner principal
class TestRunner {
    constructor() {
        this.suites = [];
        this.reporters = [];
    }
    
    // Adicionar suite
    addSuite(suite) {
        this.suites.push(suite);
        return this;
    }
    
    // Adicionar reporter
    addReporter(reporter) {
        this.reporters.push(reporter);
        return this;
    }
    
    // Executar todos os testes
    async run() {
        const overallResults = {
            suites: [],
            totalTests: 0,
            totalPassed: 0,
            totalFailed: 0,
            totalDuration: 0
        };
        
        const startTime = Date.now();
        
        for (const suite of this.suites) {
            const suiteResults = await suite.run();
            overallResults.suites.push(suiteResults);
            overallResults.totalTests += suiteResults.total;
            overallResults.totalPassed += suiteResults.passed;
            overallResults.totalFailed += suiteResults.failed;
        }
        
        overallResults.totalDuration = Date.now() - startTime;
        
        // Notificar reporters
        for (const reporter of this.reporters) {
            reporter.report(overallResults);
        }
        
        return overallResults;
    }
}

// Reporter console
class ConsoleReporter {
    report(results) {
        console.log('\n📊 RELATÓRIO DE TESTES\n');
        
        for (const suite of results.suites) {
            console.log(`📁 Suite: ${suite.suite}`);
            console.log(`   Total: ${suite.total} | Passou: ${suite.passed} | Falhou: ${suite.failed} | Duração: ${suite.duration}ms`);
            
            for (const test of suite.tests) {
                const icon = test.status === 'passed' ? '✅' : '❌';
                console.log(`   ${icon} ${test.name} (${test.duration}ms)`);
                
                if (test.error) {
                    console.log(`      Erro: ${test.error}`);
                }
            }
            console.log('');
        }
        
        console.log('📈 RESUMO GERAL:');
        console.log(`   Total de testes: ${results.totalTests}`);
        console.log(`   Passou: ${results.totalPassed}`);
        console.log(`   Falhou: ${results.totalFailed}`);
        console.log(`   Taxa de sucesso: ${((results.totalPassed / results.totalTests) * 100).toFixed(2)}%`);
        console.log(`   Duração total: ${results.totalDuration}ms`);
    }
}

// Funções utilitárias para criação de testes
function createMock(originalFunction) {
    return new Mock(originalFunction);
}

function describe(name, setupFunction) {
    const suite = new TestSuite(name);
    setupFunction(suite);
    return suite;
}

// Demonstração do Framework de Testes
console.log('\n=== EXERCÍCIO 1: FRAMEWORK DE TESTES SIMPLES ===\n');

// Classe de exemplo para testar
class Calculator {
    add(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new Error('Argumentos devem ser números');
        }
        return a + b;
    }
    
    divide(a, b) {
        if (b === 0) {
            throw new Error('Divisão por zero não é permitida');
        }
        return a / b;
    }
    
    async asyncAdd(a, b) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (typeof a !== 'number' || typeof b !== 'number') {
                    reject(new Error('Argumentos devem ser números'));
                } else {
                    resolve(a + b);
                }
            }, 100);
        });
    }
}

// Criar testes
const calculatorSuite = describe('Calculator Tests', (suite) => {
    let calculator;
    
    suite.beforeEach((context) => {
        calculator = new Calculator();
        context.calculator = calculator;
    });
    
    suite.test('should add two numbers correctly', (context) => {
        const result = context.calculator.add(2, 3);
        Assert.equal(result, 5, 'Addition should work correctly');
    });
    
    suite.test('should throw error for invalid arguments', (context) => {
        Assert.throws(
            () => context.calculator.add('2', 3),
            Error,
            'Should throw error for string argument'
        );
    });
    
    suite.test('should divide numbers correctly', (context) => {
        const result = context.calculator.divide(10, 2);
        Assert.equal(result, 5, 'Division should work correctly');
    });
    
    suite.test('should throw error for division by zero', (context) => {
        Assert.throws(
            () => context.calculator.divide(10, 0),
            Error,
            'Should throw error for division by zero'
        );
    });
    
    suite.test('should handle async operations', async (context) => {
        const result = await context.calculator.asyncAdd(5, 7);
        Assert.equal(result, 12, 'Async addition should work');
    });
    
    suite.test('should reject async operations with invalid args', async (context) => {
        await Assert.rejects(
            context.calculator.asyncAdd('5', 7),
            Error,
            'Should reject with invalid arguments'
        );
    });
});

// Teste com mocking
const mockingSuite = describe('Mocking Tests', (suite) => {
    suite.test('should mock function calls', () => {
        const mockFn = createMock();
        mockFn.returns('mocked result');
        
        const result = mockFn.fn('test', 123);
        
        Assert.equal(result, 'mocked result');
        Assert.isTrue(mockFn.wasCalledWith('test', 123));
        Assert.isTrue(mockFn.wasCalledTimes(1));
    });
    
    suite.test('should mock errors', () => {
        const mockFn = createMock();
        mockFn.throws(new Error('Mocked error'));
        
        Assert.throws(() => mockFn.fn(), Error);
    });
});

// Executar testes
const runner = new TestRunner();
runner.addReporter(new ConsoleReporter());
runner.addSuite(calculatorSuite);
runner.addSuite(mockingSuite);

runner.run().then(results => {
    console.log('\n🎉 Testes concluídos!');
});

/*
========================================
EXERCÍCIO 2: SISTEMA DE DEBUGGING E PROFILING
========================================

Sistema para debugging e análise de performance
com suporte a:
• Breakpoints condicionais
• Stack trace analysis
• Performance profiling
• Memory usage monitoring
• Execution flow tracking
*/

// Sistema de debugging
class Debugger {
    constructor() {
        this.breakpoints = new Map();
        this.watchedVariables = new Map();
        this.callStack = [];
        this.executionLog = [];
        this.enabled = true;
        this.stepMode = false;
        this.stepCallback = null;
    }
    
    // Adicionar breakpoint
    addBreakpoint(id, condition = null) {
        this.breakpoints.set(id, {
            condition,
            hitCount: 0,
            enabled: true
        });
        return this;
    }
    
    // Remover breakpoint
    removeBreakpoint(id) {
        this.breakpoints.delete(id);
        return this;
    }
    
    // Verificar breakpoint
    checkBreakpoint(id, context = {}) {
        if (!this.enabled) return false;
        
        const breakpoint = this.breakpoints.get(id);
        if (!breakpoint || !breakpoint.enabled) return false;
        
        breakpoint.hitCount++;
        
        // Verificar condição se existir
        if (breakpoint.condition) {
            try {
                const shouldBreak = breakpoint.condition(context);
                if (!shouldBreak) return false;
            } catch (error) {
                console.warn(`Erro na condição do breakpoint ${id}:`, error);
                return false;
            }
        }
        
        this.logExecution(`🔴 Breakpoint ${id} atingido`, context);
        return true;
    }
    
    // Assistir variável
    watch(name, getValue) {
        this.watchedVariables.set(name, {
            getValue,
            previousValue: undefined,
            changeCount: 0
        });
        return this;
    }
    
    // Verificar mudanças nas variáveis assistidas
    checkWatchedVariables(context = {}) {
        for (const [name, watcher] of this.watchedVariables) {
            try {
                const currentValue = watcher.getValue(context);
                
                if (currentValue !== watcher.previousValue) {
                    watcher.changeCount++;
                    this.logExecution(
                        `👁️ Variável '${name}' mudou`,
                        {
                            from: watcher.previousValue,
                            to: currentValue,
                            changeCount: watcher.changeCount
                        }
                    );
                    watcher.previousValue = currentValue;
                }
            } catch (error) {
                console.warn(`Erro ao assistir variável ${name}:`, error);
            }
        }
    }
    
    // Entrar em função
    enterFunction(functionName, args = []) {
        const entry = {
            function: functionName,
            args,
            timestamp: Date.now(),
            depth: this.callStack.length
        };
        
        this.callStack.push(entry);
        this.logExecution(`📥 Entrando em ${functionName}`, { args, depth: entry.depth });
        
        return entry;
    }
    
    // Sair de função
    exitFunction(entry, returnValue) {
        const duration = Date.now() - entry.timestamp;
        this.callStack.pop();
        
        this.logExecution(
            `📤 Saindo de ${entry.function}`,
            { returnValue, duration, depth: entry.depth }
        );
        
        return { ...entry, duration, returnValue };
    }
    
    // Log de execução
    logExecution(message, data = {}) {
        const logEntry = {
            timestamp: new Date(),
            message,
            data,
            stackDepth: this.callStack.length
        };
        
        this.executionLog.push(logEntry);
        
        if (this.enabled) {
            const indent = '  '.repeat(logEntry.stackDepth);
            console.log(`🐛 ${indent}${message}`, data);
        }
    }
    
    // Obter stack trace
    getStackTrace() {
        return this.callStack.map(entry => ({
            function: entry.function,
            args: entry.args,
            duration: Date.now() - entry.timestamp
        }));
    }
    
    // Limpar logs
    clearLogs() {
        this.executionLog = [];
        return this;
    }
    
    // Habilitar/desabilitar
    enable() {
        this.enabled = true;
        return this;
    }
    
    disable() {
        this.enabled = false;
        return this;
    }
}

// Sistema de profiling
class Profiler {
    constructor() {
        this.profiles = new Map();
        this.memorySnapshots = [];
        this.performanceMarks = new Map();
    }
    
    // Iniciar profiling de função
    profile(name) {
        const profile = {
            name,
            startTime: performance.now(),
            startMemory: this.getMemoryUsage(),
            calls: 0,
            totalTime: 0,
            minTime: Infinity,
            maxTime: 0,
            errors: 0
        };
        
        this.profiles.set(name, profile);
        return profile;
    }
    
    // Finalizar profiling
    endProfile(name) {
        const profile = this.profiles.get(name);
        if (!profile) {
            throw new Error(`Profile '${name}' não encontrado`);
        }
        
        const endTime = performance.now();
        const endMemory = this.getMemoryUsage();
        
        profile.endTime = endTime;
        profile.endMemory = endMemory;
        profile.totalDuration = endTime - profile.startTime;
        profile.memoryDelta = endMemory - profile.startMemory;
        
        return profile;
    }
    
    // Medir execução de função
    measure(name, fn) {
        return (...args) => {
            const startTime = performance.now();
            const startMemory = this.getMemoryUsage();
            
            let profile = this.profiles.get(name);
            if (!profile) {
                profile = this.profile(name);
            }
            
            try {
                const result = fn(...args);
                
                // Se for uma Promise, aguardar conclusão
                if (result && typeof result.then === 'function') {
                    return result.then(
                        (value) => {
                            this.recordCall(name, startTime, startMemory, false);
                            return value;
                        },
                        (error) => {
                            this.recordCall(name, startTime, startMemory, true);
                            throw error;
                        }
                    );
                } else {
                    this.recordCall(name, startTime, startMemory, false);
                    return result;
                }
            } catch (error) {
                this.recordCall(name, startTime, startMemory, true);
                throw error;
            }
        };
    }
    
    // Registrar chamada
    recordCall(name, startTime, startMemory, isError) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        const profile = this.profiles.get(name);
        if (profile) {
            profile.calls++;
            profile.totalTime += duration;
            profile.minTime = Math.min(profile.minTime, duration);
            profile.maxTime = Math.max(profile.maxTime, duration);
            
            if (isError) {
                profile.errors++;
            }
        }
    }
    
    // Obter uso de memória (simulado)
    getMemoryUsage() {
        // Em um ambiente real, usaríamos performance.memory
        return Math.random() * 1000000; // Simulação
    }
    
    // Criar snapshot de memória
    takeMemorySnapshot(label) {
        const snapshot = {
            label,
            timestamp: Date.now(),
            usage: this.getMemoryUsage(),
            profiles: new Map(this.profiles)
        };
        
        this.memorySnapshots.push(snapshot);
        return snapshot;
    }
    
    // Marcar ponto de performance
    mark(name) {
        this.performanceMarks.set(name, performance.now());
    }
    
    // Medir entre marcas
    measure(startMark, endMark) {
        const startTime = this.performanceMarks.get(startMark);
        const endTime = this.performanceMarks.get(endMark);
        
        if (startTime === undefined || endTime === undefined) {
            throw new Error('Marcas de performance não encontradas');
        }
        
        return endTime - startTime;
    }
    
    // Relatório de performance
    getReport() {
        const report = {
            profiles: [],
            memorySnapshots: this.memorySnapshots,
            totalProfiles: this.profiles.size
        };
        
        for (const [name, profile] of this.profiles) {
            const avgTime = profile.calls > 0 ? profile.totalTime / profile.calls : 0;
            
            report.profiles.push({
                name,
                calls: profile.calls,
                totalTime: profile.totalTime.toFixed(2),
                avgTime: avgTime.toFixed(2),
                minTime: profile.minTime === Infinity ? 0 : profile.minTime.toFixed(2),
                maxTime: profile.maxTime.toFixed(2),
                errors: profile.errors,
                errorRate: profile.calls > 0 ? ((profile.errors / profile.calls) * 100).toFixed(2) + '%' : '0%'
            });
        }
        
        return report;
    }
}

// Decorador para debugging automático
function debug(debugger, options = {}) {
    return function(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const breakpointId = options.breakpointId || `${target.constructor.name}.${propertyKey}`;
        
        descriptor.value = function(...args) {
            // Entrar na função
            const entry = debugger.enterFunction(`${target.constructor.name}.${propertyKey}`, args);
            
            // Verificar breakpoint
            if (debugger.checkBreakpoint(breakpointId, { this: this, args })) {
                console.log('🔍 Contexto do breakpoint:', {
                    function: `${target.constructor.name}.${propertyKey}`,
                    arguments: args,
                    instance: this
                });
            }
            
            try {
                const result = originalMethod.apply(this, args);
                debugger.exitFunction(entry, result);
                return result;
            } catch (error) {
                debugger.exitFunction(entry, { error: error.message });
                throw error;
            }
        };
        
        return descriptor;
    };
}

// Classe de exemplo para debugging
class DebuggableCalculator {
    constructor() {
        this.history = [];
        this.debugger = new Debugger();
        this.profiler = new Profiler();
        
        // Configurar debugging
        this.setupDebugging();
    }
    
    setupDebugging() {
        // Adicionar breakpoints
        this.debugger.addBreakpoint('complex-calculation', (context) => {
            return context.args && context.args[0] > 100;
        });
        
        // Assistir histórico
        this.debugger.watch('history-length', (context) => {
            return this.history.length;
        });
        
        // Aplicar profiling
        this.add = this.profiler.measure('add', this.add.bind(this));
        this.complexCalculation = this.profiler.measure('complex', this.complexCalculation.bind(this));
    }
    
    add(a, b) {
        const entry = this.debugger.enterFunction('add', [a, b]);
        
        try {
            const result = a + b;
            this.history.push({ operation: 'add', args: [a, b], result });
            
            this.debugger.checkWatchedVariables();
            this.debugger.exitFunction(entry, result);
            
            return result;
        } catch (error) {
            this.debugger.exitFunction(entry, { error: error.message });
            throw error;
        }
    }
    
    complexCalculation(n) {
        const entry = this.debugger.enterFunction('complexCalculation', [n]);
        
        // Verificar breakpoint condicional
        if (this.debugger.checkBreakpoint('complex-calculation', { args: [n] })) {
            console.log('🔍 Executando cálculo complexo para n =', n);
        }
        
        try {
            let result = 0;
            for (let i = 0; i < n; i++) {
                result += Math.sqrt(i) * Math.sin(i);
            }
            
            this.history.push({ operation: 'complex', args: [n], result });
            this.debugger.checkWatchedVariables();
            this.debugger.exitFunction(entry, result);
            
            return result;
        } catch (error) {
            this.debugger.exitFunction(entry, { error: error.message });
            throw error;
        }
    }
    
    getDebugReport() {
        return {
            stackTrace: this.debugger.getStackTrace(),
            executionLog: this.debugger.executionLog.slice(-10), // Últimas 10 entradas
            performanceReport: this.profiler.getReport()
        };
    }
}

// Demonstração do Sistema de Debugging
console.log('\n\n=== EXERCÍCIO 2: SISTEMA DE DEBUGGING E PROFILING ===\n');

const calc = new DebuggableCalculator();

console.log('🧮 Executando operações com debugging...');

// Operações simples
calc.add(5, 3);
calc.add(10, 20);

// Operação que ativa breakpoint
calc.complexCalculation(150);

// Operações adicionais
calc.add(1, 2);
calc.complexCalculation(50);

// Relatório de debugging
setTimeout(() => {
    console.log('\n📊 RELATÓRIO DE DEBUGGING:');
    const report = calc.getDebugReport();
    
    console.log('\n🎯 Performance:');
    report.performanceReport.profiles.forEach(profile => {
        console.log(`  • ${profile.name}: ${profile.calls} chamadas, ${profile.avgTime}ms média`);
    });
    
    console.log('\n📜 Stack Trace atual:');
    report.stackTrace.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.function} (${entry.duration}ms)`);
    });
}, 1000);

/*
========================================
EXERCÍCIO 3: SISTEMA DE MONITORAMENTO E LOGGING
========================================

Sistema completo de logging e monitoramento
com suporte a:
• Diferentes níveis de log
• Múltiplos transportes (console, arquivo, rede)
• Filtragem e formatação
• Métricas e alertas
• Agregação e análise
*/

// Níveis de log
const LogLevel = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    FATAL: 5
};

const LogLevelNames = {
    [LogLevel.TRACE]: 'TRACE',
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
    [LogLevel.FATAL]: 'FATAL'
};

// Formatadores de log
class LogFormatter {
    format(logEntry) {
        throw new Error('Método format deve ser implementado');
    }
}

class SimpleFormatter extends LogFormatter {
    format(logEntry) {
        const timestamp = logEntry.timestamp.toISOString();
        const level = LogLevelNames[logEntry.level];
        return `[${timestamp}] ${level}: ${logEntry.message}`;
    }
}

class JSONFormatter extends LogFormatter {
    format(logEntry) {
        return JSON.stringify({
            timestamp: logEntry.timestamp.toISOString(),
            level: LogLevelNames[logEntry.level],
            message: logEntry.message,
            data: logEntry.data,
            context: logEntry.context
        });
    }
}

class ColoredFormatter extends LogFormatter {
    constructor() {
        super();
        this.colors = {
            [LogLevel.TRACE]: '\x1b[37m', // Branco
            [LogLevel.DEBUG]: '\x1b[36m', // Ciano
            [LogLevel.INFO]: '\x1b[32m',  // Verde
            [LogLevel.WARN]: '\x1b[33m',  // Amarelo
            [LogLevel.ERROR]: '\x1b[31m', // Vermelho
            [LogLevel.FATAL]: '\x1b[35m'  // Magenta
        };
        this.reset = '\x1b[0m';
    }
    
    format(logEntry) {
        const timestamp = logEntry.timestamp.toISOString();
        const level = LogLevelNames[logEntry.level];
        const color = this.colors[logEntry.level];
        
        return `${color}[${timestamp}] ${level}: ${logEntry.message}${this.reset}`;
    }
}

// Transportes de log
class LogTransport {
    constructor(options = {}) {
        this.level = options.level || LogLevel.INFO;
        this.formatter = options.formatter || new SimpleFormatter();
        this.filters = options.filters || [];
    }
    
    shouldLog(logEntry) {
        // Verificar nível
        if (logEntry.level < this.level) {
            return false;
        }
        
        // Aplicar filtros
        return this.filters.every(filter => filter(logEntry));
    }
    
    log(logEntry) {
        if (this.shouldLog(logEntry)) {
            this.write(logEntry);
        }
    }
    
    write(logEntry) {
        throw new Error('Método write deve ser implementado');
    }
}

class ConsoleTransport extends LogTransport {
    write(logEntry) {
        const formatted = this.formatter.format(logEntry);
        
        switch (logEntry.level) {
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(formatted);
                break;
            case LogLevel.WARN:
                console.warn(formatted);
                break;
            default:
                console.log(formatted);
        }
        
        // Mostrar dados adicionais se existirem
        if (logEntry.data && Object.keys(logEntry.data).length > 0) {
            console.log('  Dados:', logEntry.data);
        }
    }
}

class MemoryTransport extends LogTransport {
    constructor(options = {}) {
        super(options);
        this.logs = [];
        this.maxSize = options.maxSize || 1000;
    }
    
    write(logEntry) {
        this.logs.push({
            ...logEntry,
            formatted: this.formatter.format(logEntry)
        });
        
        // Manter tamanho máximo
        if (this.logs.length > this.maxSize) {
            this.logs.shift();
        }
    }
    
    getLogs(filter = null) {
        if (filter) {
            return this.logs.filter(filter);
        }
        return [...this.logs];
    }
    
    clear() {
        this.logs = [];
    }
}

class FileTransport extends LogTransport {
    constructor(options = {}) {
        super(options);
        this.filename = options.filename || 'app.log';
        this.buffer = [];
        this.flushInterval = options.flushInterval || 5000;
        
        // Simular flush periódico
        setInterval(() => this.flush(), this.flushInterval);
    }
    
    write(logEntry) {
        const formatted = this.formatter.format(logEntry);
        this.buffer.push(formatted);
        
        // Flush imediato para erros críticos
        if (logEntry.level >= LogLevel.ERROR) {
            this.flush();
        }
    }
    
    flush() {
        if (this.buffer.length > 0) {
            console.log(`📁 Escrevendo ${this.buffer.length} logs para ${this.filename}`);
            // Em um ambiente real, escreveria para arquivo
            this.buffer = [];
        }
    }
}

// Logger principal
class Logger {
    constructor(options = {}) {
        this.transports = [];
        this.context = options.context || {};
        this.metrics = {
            totalLogs: 0,
            logsByLevel: {
                [LogLevel.TRACE]: 0,
                [LogLevel.DEBUG]: 0,
                [LogLevel.INFO]: 0,
                [LogLevel.WARN]: 0,
                [LogLevel.ERROR]: 0,
                [LogLevel.FATAL]: 0
            },
            errors: [],
            startTime: Date.now()
        };
    }
    
    // Adicionar transport
    addTransport(transport) {
        this.transports.push(transport);
        return this;
    }
    
    // Remover transport
    removeTransport(transport) {
        const index = this.transports.indexOf(transport);
        if (index > -1) {
            this.transports.splice(index, 1);
        }
        return this;
    }
    
    // Log genérico
    log(level, message, data = {}, context = {}) {
        const logEntry = {
            timestamp: new Date(),
            level,
            message,
            data,
            context: { ...this.context, ...context },
            id: Math.random().toString(36).substr(2, 9)
        };
        
        // Atualizar métricas
        this.metrics.totalLogs++;
        this.metrics.logsByLevel[level]++;
        
        // Armazenar erros para análise
        if (level >= LogLevel.ERROR) {
            this.metrics.errors.push({
                timestamp: logEntry.timestamp,
                message,
                data,
                context: logEntry.context
            });
        }
        
        // Enviar para todos os transports
        this.transports.forEach(transport => {
            try {
                transport.log(logEntry);
            } catch (error) {
                console.error('Erro no transport de log:', error);
            }
        });
        
        return logEntry.id;
    }
    
    // Métodos de conveniência
    trace(message, data, context) {
        return this.log(LogLevel.TRACE, message, data, context);
    }
    
    debug(message, data, context) {
        return this.log(LogLevel.DEBUG, message, data, context);
    }
    
    info(message, data, context) {
        return this.log(LogLevel.INFO, message, data, context);
    }
    
    warn(message, data, context) {
        return this.log(LogLevel.WARN, message, data, context);
    }
    
    error(message, data, context) {
        return this.log(LogLevel.ERROR, message, data, context);
    }
    
    fatal(message, data, context) {
        return this.log(LogLevel.FATAL, message, data, context);
    }
    
    // Criar logger filho com contexto adicional
    child(additionalContext) {
        const childLogger = new Logger({
            context: { ...this.context, ...additionalContext }
        });
        
        // Compartilhar transports
        childLogger.transports = this.transports;
        childLogger.metrics = this.metrics;
        
        return childLogger;
    }
    
    // Obter métricas
    getMetrics() {
        const uptime = Date.now() - this.metrics.startTime;
        const logsPerSecond = this.metrics.totalLogs / (uptime / 1000);
        
        return {
            ...this.metrics,
            uptime,
            logsPerSecond: logsPerSecond.toFixed(2),
            errorRate: ((this.metrics.logsByLevel[LogLevel.ERROR] + this.metrics.logsByLevel[LogLevel.FATAL]) / this.metrics.totalLogs * 100).toFixed(2) + '%'
        };
    }
}

// Sistema de alertas
class AlertManager {
    constructor(logger) {
        this.logger = logger;
        this.rules = [];
        this.alerts = [];
        this.checkInterval = 10000; // 10 segundos
        
        this.startMonitoring();
    }
    
    // Adicionar regra de alerta
    addRule(rule) {
        this.rules.push({
            id: Math.random().toString(36).substr(2, 9),
            ...rule,
            triggered: false,
            lastCheck: Date.now()
        });
        return this;
    }
    
    // Verificar regras
    checkRules() {
        const metrics = this.logger.getMetrics();
        
        for (const rule of this.rules) {
            try {
                const shouldTrigger = rule.condition(metrics);
                
                if (shouldTrigger && !rule.triggered) {
                    this.triggerAlert(rule, metrics);
                    rule.triggered = true;
                } else if (!shouldTrigger && rule.triggered) {
                    rule.triggered = false;
                }
                
                rule.lastCheck = Date.now();
            } catch (error) {
                this.logger.error('Erro ao verificar regra de alerta', {
                    ruleId: rule.id,
                    error: error.message
                });
            }
        }
    }
    
    // Disparar alerta
    triggerAlert(rule, metrics) {
        const alert = {
            id: Math.random().toString(36).substr(2, 9),
            ruleId: rule.id,
            name: rule.name,
            message: rule.message,
            severity: rule.severity || 'medium',
            timestamp: new Date(),
            metrics: { ...metrics }
        };
        
        this.alerts.push(alert);
        
        // Log do alerta
        const logLevel = this.getSeverityLogLevel(alert.severity);
        this.logger.log(logLevel, `🚨 ALERTA: ${alert.message}`, {
            alertId: alert.id,
            severity: alert.severity,
            metrics: alert.metrics
        });
        
        // Executar ação se definida
        if (rule.action) {
            try {
                rule.action(alert, metrics);
            } catch (error) {
                this.logger.error('Erro ao executar ação do alerta', {
                    alertId: alert.id,
                    error: error.message
                });
            }
        }
    }
    
    getSeverityLogLevel(severity) {
        switch (severity) {
            case 'low': return LogLevel.WARN;
            case 'medium': return LogLevel.ERROR;
            case 'high': return LogLevel.FATAL;
            default: return LogLevel.ERROR;
        }
    }
    
    // Iniciar monitoramento
    startMonitoring() {
        setInterval(() => {
            this.checkRules();
        }, this.checkInterval);
    }
    
    // Obter alertas
    getAlerts(filter = null) {
        if (filter) {
            return this.alerts.filter(filter);
        }
        return [...this.alerts];
    }
}

// Demonstração do Sistema de Monitoramento
console.log('\n\n=== EXERCÍCIO 3: SISTEMA DE MONITORAMENTO E LOGGING ===\n');

// Criar logger com múltiplos transports
const logger = new Logger({ context: { service: 'demo-app', version: '1.0.0' } });

// Adicionar transports
logger.addTransport(new ConsoleTransport({
    level: LogLevel.INFO,
    formatter: new ColoredFormatter()
}));

const memoryTransport = new MemoryTransport({
    level: LogLevel.DEBUG,
    formatter: new JSONFormatter(),
    maxSize: 100
});
logger.addTransport(memoryTransport);

logger.addTransport(new FileTransport({
    level: LogLevel.WARN,
    filename: 'errors.log',
    formatter: new SimpleFormatter()
}));

// Configurar alertas
const alertManager = new AlertManager(logger);

alertManager.addRule({
    name: 'High Error Rate',
    condition: (metrics) => {
        const errorRate = parseFloat(metrics.errorRate);
        return errorRate > 20; // Mais de 20% de erros
    },
    message: 'Taxa de erro muito alta detectada',
    severity: 'high',
    action: (alert, metrics) => {
        console.log('🚨 AÇÃO: Notificando equipe de desenvolvimento');
    }
});

alertManager.addRule({
    name: 'High Log Volume',
    condition: (metrics) => {
        return metrics.totalLogs > 50;
    },
    message: 'Volume alto de logs detectado',
    severity: 'medium'
});

// Simular atividade da aplicação
console.log('📝 Simulando atividade da aplicação...');

// Logger filho para módulo específico
const dbLogger = logger.child({ module: 'database' });
const apiLogger = logger.child({ module: 'api' });

// Logs normais
logger.info('Aplicação iniciada', { port: 3000 });
dbLogger.info('Conectado ao banco de dados', { host: 'localhost', database: 'myapp' });
apiLogger.info('Servidor API iniciado', { endpoints: 15 });

// Simular operações com alguns erros
for (let i = 0; i < 30; i++) {
    if (i % 10 === 0) {
        apiLogger.error('Falha na requisição', {
            endpoint: '/api/users',
            statusCode: 500,
            error: 'Database connection timeout'
        });
    } else if (i % 7 === 0) {
        dbLogger.warn('Query lenta detectada', {
            query: 'SELECT * FROM users',
            duration: 2500
        });
    } else {
        apiLogger.debug('Requisição processada', {
            endpoint: '/api/data',
            method: 'GET',
            duration: Math.random() * 100
        });
    }
    
    // Pequena pausa
    await new Promise(resolve => setTimeout(resolve, 50));
}

// Mostrar relatórios após um tempo
setTimeout(() => {
    console.log('\n📊 RELATÓRIO DE MONITORAMENTO:');
    
    const metrics = logger.getMetrics();
    console.log('\n📈 Métricas gerais:');
    console.log(`  • Total de logs: ${metrics.totalLogs}`);
    console.log(`  • Logs por segundo: ${metrics.logsPerSecond}`);
    console.log(`  • Taxa de erro: ${metrics.errorRate}`);
    console.log(`  • Tempo ativo: ${(metrics.uptime / 1000).toFixed(2)}s`);
    
    console.log('\n📊 Logs por nível:');
    Object.entries(metrics.logsByLevel).forEach(([level, count]) => {
        const levelName = LogLevelNames[level];
        console.log(`  • ${levelName}: ${count}`);
    });
    
    console.log('\n🚨 Alertas disparados:');
    const alerts = alertManager.getAlerts();
    alerts.forEach(alert => {
        console.log(`  • ${alert.name}: ${alert.message} (${alert.severity})`);
    });
    
    console.log('\n💾 Logs em memória:');
    const memoryLogs = memoryTransport.getLogs();
    console.log(`  • Total armazenado: ${memoryLogs.length}`);
    console.log(`  • Últimos 3 logs:`);
    memoryLogs.slice(-3).forEach(log => {
        console.log(`    ${log.formatted}`);
    });
    
}, 3000);

/*
========================================
CONCEITOS APLICADOS
========================================

1. UNIT TESTING:
   • Test cases e test suites
   • Assertions e validações
   • Setup e teardown
   • Mocking e stubbing
   • Test runners e reporters

2. DEBUGGING:
   • Breakpoints condicionais
   • Stack trace analysis
   • Variable watching
   • Execution flow tracking
   • Context inspection

3. PROFILING:
   • Performance measurement
   • Memory usage tracking
   • Function call analysis
   • Bottleneck identification
   • Resource optimization

4. LOGGING:
   • Log levels e categorização
   • Multiple transports
   • Formatação customizada
   • Filtragem e agregação
   • Structured logging

5. MONITORING:
   • Metrics collection
   • Real-time alerting
   • Performance tracking
   • Error rate monitoring
   • System health checks

6. ERROR HANDLING:
   • Exception catching
   • Error propagation
   • Recovery strategies
   • Error reporting
   • Graceful degradation

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. TESTES:
   • Isolamento de testes
   • Nomenclatura descritiva
   • Cobertura abrangente
   • Testes rápidos e confiáveis
   • Mocking de dependências

2. DEBUGGING:
   • Logging estruturado
   • Breakpoints estratégicos
   • Context preservation
   • Non-intrusive debugging
   • Performance awareness

3. MONITORAMENTO:
   • Métricas relevantes
   • Alertas acionáveis
   • Dashboards informativos
   • Retention policies
   • Privacy compliance

4. CÓDIGO:
   • Error boundaries
   • Graceful failures
   • Resource cleanup
   • Performance optimization
   • Security considerations

========================================
EXERCÍCIOS PROPOSTOS
========================================

BÁSICO:
1. Implementar testes para uma função de validação
2. Criar um logger simples com diferentes níveis
3. Adicionar debugging a uma função recursiva
4. Implementar um sistema de métricas básico

INTERMEDIÁRIO:
5. Criar um framework de testes com async/await
6. Implementar profiling de performance
7. Desenvolver um sistema de alertas
8. Criar testes de integração

AVANÇADO:
9. Implementar code coverage analysis
10. Criar um debugger visual
11. Desenvolver um sistema de APM completo
12. Implementar distributed tracing

========================================
FERRAMENTAS RECOMENDADAS
========================================

• Jest - Framework de testes
• Mocha/Chai - Testing framework alternativo
• Chrome DevTools - Debugging e profiling
• Winston - Logging library
• Prometheus - Metrics e monitoring
• Sentry - Error tracking
• New Relic - APM solution
• Datadog - Monitoring platform

========================================
RECURSOS ADICIONAIS
========================================

• Test-Driven Development (TDD)
• Behavior-Driven Development (BDD)
• Continuous Integration/Deployment
• Performance Testing
• Security Testing
• Accessibility Testing
• Load Testing
• Chaos Engineering
*/

console.log('\n✅ EXERCÍCIOS DE TESTES E DEBUGGING CONCLUÍDOS!');
console.log('🎯 Conceitos cobertos:');
console.log('   • Unit Testing e Test Frameworks');
console.log('   • Debugging e Profiling');
console.log('   • Logging e Monitoring');
console.log('   • Error Handling e Alerting');
console.log('   • Performance Analysis');
console.log('\n🚀 Continue praticando com ferramentas reais!');
console.log('📚 Explore TDD, BDD e outras metodologias!');

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Assert,
        TestCase,
        TestSuite,
        TestRunner,
        Mock,
        Debugger,
        Profiler,
        Logger,
        AlertManager,
        LogLevel
    };
}