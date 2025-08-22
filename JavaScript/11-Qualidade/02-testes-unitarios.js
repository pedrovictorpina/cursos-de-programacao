/**
 * MÓDULO 11: QUALIDADE DE CÓDIGO EM JAVASCRIPT
 * Arquivo 02: Testes Unitários
 * 
 * Os testes unitários são fundamentais para garantir a qualidade,
 * confiabilidade e manutenibilidade do código. Vamos explorar
 * conceitos, técnicas e implementações práticas de testing.
 * 
 * Professor: Testes não são apenas sobre encontrar bugs, são sobre
 * design de código, documentação viva e confiança para refatorar.
 * Um código bem testado é um código bem estruturado.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender princípios de testes unitários
2. Implementar framework de testes do zero
3. Aplicar técnicas de mocking e stubbing
4. Desenvolver testes para código assíncrono
5. Praticar TDD (Test-Driven Development)
*/

// ==========================================
// TEORIA: FUNDAMENTOS DE TESTES UNITÁRIOS
// ==========================================

/*
CONCEITO:
Teste unitário é um método de teste onde unidades individuais
de código (funções, métodos, classes) são testadas isoladamente
para verificar se funcionam conforme esperado.

PRINCÍPIOS FUNDAMENTAIS:
1. Isolamento - Cada teste deve ser independente
2. Repetibilidade - Resultados consistentes
3. Rapidez - Execução rápida
4. Clareza - Fácil de entender
5. Automatização - Execução automática

ESTRUTURA AAA:
- Arrange (Preparar) - Configurar dados e estado
- Act (Agir) - Executar a ação sendo testada
- Assert (Verificar) - Verificar o resultado

TIPOS DE TESTES:
1. Unit Tests - Testam unidades isoladas
2. Integration Tests - Testam integração entre componentes
3. End-to-End Tests - Testam fluxo completo
4. Smoke Tests - Testes básicos de funcionamento
5. Regression Tests - Previnem regressões

TDD (Test-Driven Development):
1. Red - Escrever teste que falha
2. Green - Implementar código mínimo para passar
3. Refactor - Melhorar código mantendo testes

BDD (Behavior-Driven Development):
- Foca no comportamento esperado
- Linguagem natural (Given, When, Then)
- Colaboração entre stakeholders
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. FRAMEWORK DE TESTES SIMPLES
console.log('\n=== 1. Framework de Testes Simples ===');

class SimpleTestFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
        this.currentSuite = null;
    }
    
    describe(suiteName, callback) {
        console.log(`\n📋 Suite: ${suiteName}`);
        this.currentSuite = suiteName;
        callback();
        this.currentSuite = null;
    }
    
    it(testName, callback) {
        const fullName = this.currentSuite ? `${this.currentSuite} - ${testName}` : testName;
        
        try {
            callback();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
        } catch (error) {
            this.results.failed++;
            console.log(`  ❌ ${testName}`);
            console.log(`     Error: ${error.message}`);
            if (error.stack) {
                console.log(`     Stack: ${error.stack.split('\n')[1]}`);
            }
        }
        
        this.results.total++;
    }
    
    expect(actual) {
        return new Expectation(actual);
    }
    
    beforeEach(callback) {
        this.beforeEachCallback = callback;
    }
    
    afterEach(callback) {
        this.afterEachCallback = callback;
    }
    
    run() {
        console.log('\n🏃 Executando testes...');
        
        // Executar testes já registrados
        this.tests.forEach(test => {
            if (this.beforeEachCallback) {
                this.beforeEachCallback();
            }
            
            test();
            
            if (this.afterEachCallback) {
                this.afterEachCallback();
            }
        });
        
        this.printResults();
    }
    
    printResults() {
        console.log('\n📊 Resultados dos Testes:');
        console.log(`Total: ${this.results.total}`);
        console.log(`✅ Passou: ${this.results.passed}`);
        console.log(`❌ Falhou: ${this.results.failed}`);
        
        const percentage = this.results.total > 0 
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
        
        console.log(`📈 Taxa de sucesso: ${percentage}%`);
        
        if (this.results.failed === 0) {
            console.log('🎉 Todos os testes passaram!');
        }
    }
}

class Expectation {
    constructor(actual) {
        this.actual = actual;
    }
    
    toBe(expected) {
        if (this.actual !== expected) {
            throw new Error(`Expected ${expected}, but got ${this.actual}`);
        }
    }
    
    toEqual(expected) {
        if (!this.deepEqual(this.actual, expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(this.actual)}`);
        }
    }
    
    toBeNull() {
        if (this.actual !== null) {
            throw new Error(`Expected null, but got ${this.actual}`);
        }
    }
    
    toBeUndefined() {
        if (this.actual !== undefined) {
            throw new Error(`Expected undefined, but got ${this.actual}`);
        }
    }
    
    toBeTruthy() {
        if (!this.actual) {
            throw new Error(`Expected truthy value, but got ${this.actual}`);
        }
    }
    
    toBeFalsy() {
        if (this.actual) {
            throw new Error(`Expected falsy value, but got ${this.actual}`);
        }
    }
    
    toContain(expected) {
        if (Array.isArray(this.actual)) {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected array to contain ${expected}`);
            }
        } else if (typeof this.actual === 'string') {
            if (!this.actual.includes(expected)) {
                throw new Error(`Expected string to contain ${expected}`);
            }
        } else {
            throw new Error('toContain can only be used with arrays or strings');
        }
    }
    
    toThrow(expectedError) {
        if (typeof this.actual !== 'function') {
            throw new Error('toThrow can only be used with functions');
        }
        
        try {
            this.actual();
            throw new Error('Expected function to throw an error');
        } catch (error) {
            if (expectedError && !error.message.includes(expectedError)) {
                throw new Error(`Expected error containing "${expectedError}", but got "${error.message}"`);
            }
        }
    }
    
    deepEqual(a, b) {
        if (a === b) return true;
        
        if (a == null || b == null) return false;
        
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (!this.deepEqual(a[i], b[i])) return false;
            }
            return true;
        }
        
        if (typeof a === 'object' && typeof b === 'object') {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
            
            if (keysA.length !== keysB.length) return false;
            
            for (let key of keysA) {
                if (!keysB.includes(key)) return false;
                if (!this.deepEqual(a[key], b[key])) return false;
            }
            return true;
        }
        
        return false;
    }
}

// Testando o framework
const test = new SimpleTestFramework();

// Função de exemplo para testar
function Calculator() {
    this.result = 0;
}

Calculator.prototype.add = function(value) {
    this.result += value;
    return this;
};

Calculator.prototype.subtract = function(value) {
    this.result -= value;
    return this;
};

Calculator.prototype.multiply = function(value) {
    this.result *= value;
    return this;
};

Calculator.prototype.divide = function(value) {
    if (value === 0) {
        throw new Error('Division by zero');
    }
    this.result /= value;
    return this;
};

Calculator.prototype.getResult = function() {
    return this.result;
};

Calculator.prototype.clear = function() {
    this.result = 0;
    return this;
};

// Testes da calculadora
test.describe('Calculator', () => {
    let calc;
    
    test.beforeEach(() => {
        calc = new Calculator();
    });
    
    test.it('should start with result 0', () => {
        test.expect(calc.getResult()).toBe(0);
    });
    
    test.it('should add numbers correctly', () => {
        calc.add(5).add(3);
        test.expect(calc.getResult()).toBe(8);
    });
    
    test.it('should subtract numbers correctly', () => {
        calc.add(10).subtract(3);
        test.expect(calc.getResult()).toBe(7);
    });
    
    test.it('should multiply numbers correctly', () => {
        calc.add(5).multiply(3);
        test.expect(calc.getResult()).toBe(15);
    });
    
    test.it('should divide numbers correctly', () => {
        calc.add(10).divide(2);
        test.expect(calc.getResult()).toBe(5);
    });
    
    test.it('should throw error on division by zero', () => {
        test.expect(() => calc.divide(0)).toThrow('Division by zero');
    });
    
    test.it('should clear result', () => {
        calc.add(10).clear();
        test.expect(calc.getResult()).toBe(0);
    });
    
    test.it('should chain operations', () => {
        calc.add(10).subtract(3).multiply(2).divide(2);
        test.expect(calc.getResult()).toBe(7);
    });
});

// 2. MOCKING E STUBBING
console.log('\n=== 2. Mocking e Stubbing ===');

class MockFramework {
    static createMock(object) {
        const mock = {};
        const calls = {};
        
        for (let prop in object) {
            if (typeof object[prop] === 'function') {
                calls[prop] = [];
                
                mock[prop] = function(...args) {
                    calls[prop].push({
                        args,
                        timestamp: Date.now()
                    });
                    
                    // Retornar valor mockado se definido
                    if (mock[prop]._mockReturnValue !== undefined) {
                        return mock[prop]._mockReturnValue;
                    }
                    
                    // Executar implementação mockada se definida
                    if (mock[prop]._mockImplementation) {
                        return mock[prop]._mockImplementation.apply(this, args);
                    }
                    
                    return undefined;
                };
                
                // Métodos de configuração do mock
                mock[prop].mockReturnValue = function(value) {
                    this._mockReturnValue = value;
                    return this;
                };
                
                mock[prop].mockImplementation = function(fn) {
                    this._mockImplementation = fn;
                    return this;
                };
                
                mock[prop].mockResolvedValue = function(value) {
                    this._mockImplementation = () => Promise.resolve(value);
                    return this;
                };
                
                mock[prop].mockRejectedValue = function(error) {
                    this._mockImplementation = () => Promise.reject(error);
                    return this;
                };
            }
        }
        
        // Métodos de verificação
        mock._getCalls = function(methodName) {
            return calls[methodName] || [];
        };
        
        mock._wasCalledWith = function(methodName, ...expectedArgs) {
            const methodCalls = calls[methodName] || [];
            return methodCalls.some(call => 
                call.args.length === expectedArgs.length &&
                call.args.every((arg, index) => arg === expectedArgs[index])
            );
        };
        
        mock._getCallCount = function(methodName) {
            return (calls[methodName] || []).length;
        };
        
        mock._reset = function() {
            for (let prop in calls) {
                calls[prop] = [];
            }
        };
        
        return mock;
    }
    
    static createSpy(object, methodName) {
        const originalMethod = object[methodName];
        const calls = [];
        
        object[methodName] = function(...args) {
            calls.push({
                args,
                timestamp: Date.now(),
                context: this
            });
            
            return originalMethod.apply(this, args);
        };
        
        object[methodName].getCalls = () => calls;
        object[methodName].getCallCount = () => calls.length;
        object[methodName].wasCalledWith = (...expectedArgs) => {
            return calls.some(call => 
                call.args.length === expectedArgs.length &&
                call.args.every((arg, index) => arg === expectedArgs[index])
            );
        };
        object[methodName].restore = () => {
            object[methodName] = originalMethod;
        };
        
        return object[methodName];
    }
}

// Exemplo de uso de mocks
class UserService {
    constructor(database, logger) {
        this.database = database;
        this.logger = logger;
    }
    
    async getUser(id) {
        this.logger.info(`Fetching user ${id}`);
        
        try {
            const user = await this.database.findById(id);
            
            if (!user) {
                this.logger.warn(`User ${id} not found`);
                return null;
            }
            
            this.logger.info(`User ${id} found`);
            return user;
        } catch (error) {
            this.logger.error(`Error fetching user ${id}:`, error);
            throw error;
        }
    }
    
    async createUser(userData) {
        this.logger.info('Creating new user');
        
        const user = await this.database.create(userData);
        this.logger.info(`User created with ID ${user.id}`);
        
        return user;
    }
}

// Testando com mocks
test.describe('UserService with Mocks', () => {
    let userService;
    let mockDatabase;
    let mockLogger;
    
    test.beforeEach(() => {
        // Criar mocks
        mockDatabase = MockFramework.createMock({
            findById: () => {},
            create: () => {}
        });
        
        mockLogger = MockFramework.createMock({
            info: () => {},
            warn: () => {},
            error: () => {}
        });
        
        userService = new UserService(mockDatabase, mockLogger);
    });
    
    test.it('should get user successfully', async () => {
        // Arrange
        const userId = 1;
        const expectedUser = { id: 1, name: 'João' };
        mockDatabase.findById.mockResolvedValue(expectedUser);
        
        // Act
        const result = await userService.getUser(userId);
        
        // Assert
        test.expect(result).toEqual(expectedUser);
        test.expect(mockDatabase._wasCalledWith('findById', userId)).toBeTruthy();
        test.expect(mockLogger._wasCalledWith('info', `Fetching user ${userId}`)).toBeTruthy();
        test.expect(mockLogger._wasCalledWith('info', `User ${userId} found`)).toBeTruthy();
    });
    
    test.it('should return null when user not found', async () => {
        // Arrange
        const userId = 999;
        mockDatabase.findById.mockResolvedValue(null);
        
        // Act
        const result = await userService.getUser(userId);
        
        // Assert
        test.expect(result).toBeNull();
        test.expect(mockLogger._wasCalledWith('warn', `User ${userId} not found`)).toBeTruthy();
    });
    
    test.it('should handle database errors', async () => {
        // Arrange
        const userId = 1;
        const error = new Error('Database connection failed');
        mockDatabase.findById.mockRejectedValue(error);
        
        // Act & Assert
        try {
            await userService.getUser(userId);
            test.expect(false).toBeTruthy(); // Não deveria chegar aqui
        } catch (thrownError) {
            test.expect(thrownError).toBe(error);
            test.expect(mockLogger._getCallCount('error')).toBe(1);
        }
    });
    
    test.it('should create user successfully', async () => {
        // Arrange
        const userData = { name: 'Maria', email: 'maria@test.com' };
        const createdUser = { id: 2, ...userData };
        mockDatabase.create.mockResolvedValue(createdUser);
        
        // Act
        const result = await userService.createUser(userData);
        
        // Assert
        test.expect(result).toEqual(createdUser);
        test.expect(mockDatabase._wasCalledWith('create', userData)).toBeTruthy();
        test.expect(mockLogger._wasCalledWith('info', 'Creating new user')).toBeTruthy();
        test.expect(mockLogger._wasCalledWith('info', `User created with ID ${createdUser.id}`)).toBeTruthy();
    });
});

// 3. TESTES DE CÓDIGO ASSÍNCRONO
console.log('\n=== 3. Testes Assíncronos ===');

class AsyncTestFramework extends SimpleTestFramework {
    async it(testName, callback) {
        const fullName = this.currentSuite ? `${this.currentSuite} - ${testName}` : testName;
        
        try {
            await callback();
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
        } catch (error) {
            this.results.failed++;
            console.log(`  ❌ ${testName}`);
            console.log(`     Error: ${error.message}`);
        }
        
        this.results.total++;
    }
    
    async run() {
        console.log('\n🏃 Executando testes assíncronos...');
        
        for (const test of this.tests) {
            if (this.beforeEachCallback) {
                await this.beforeEachCallback();
            }
            
            await test();
            
            if (this.afterEachCallback) {
                await this.afterEachCallback();
            }
        }
        
        this.printResults();
    }
}

// Classe para testar operações assíncronas
class AsyncDataService {
    constructor(delay = 100) {
        this.delay = delay;
        this.data = new Map();
    }
    
    async save(key, value) {
        await this.simulateDelay();
        
        if (!key) {
            throw new Error('Key is required');
        }
        
        this.data.set(key, {
            value,
            timestamp: Date.now()
        });
        
        return { key, value, saved: true };
    }
    
    async load(key) {
        await this.simulateDelay();
        
        const item = this.data.get(key);
        
        if (!item) {
            throw new Error(`Key '${key}' not found`);
        }
        
        return item.value;
    }
    
    async loadAll() {
        await this.simulateDelay();
        
        const result = {};
        for (let [key, item] of this.data) {
            result[key] = item.value;
        }
        
        return result;
    }
    
    async delete(key) {
        await this.simulateDelay();
        
        const existed = this.data.has(key);
        this.data.delete(key);
        
        return existed;
    }
    
    async clear() {
        await this.simulateDelay();
        this.data.clear();
    }
    
    simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, this.delay));
    }
}

// Testes assíncronos
const asyncTest = new AsyncTestFramework();

asyncTest.describe('AsyncDataService', () => {
    let service;
    
    asyncTest.beforeEach(async () => {
        service = new AsyncDataService(10); // Delay menor para testes
    });
    
    asyncTest.it('should save and load data', async () => {
        // Arrange
        const key = 'test-key';
        const value = 'test-value';
        
        // Act
        const saveResult = await service.save(key, value);
        const loadResult = await service.load(key);
        
        // Assert
        asyncTest.expect(saveResult.saved).toBeTruthy();
        asyncTest.expect(loadResult).toBe(value);
    });
    
    asyncTest.it('should throw error for missing key on save', async () => {
        try {
            await service.save(null, 'value');
            asyncTest.expect(false).toBeTruthy(); // Não deveria chegar aqui
        } catch (error) {
            asyncTest.expect(error.message).toBe('Key is required');
        }
    });
    
    asyncTest.it('should throw error for missing key on load', async () => {
        try {
            await service.load('non-existent');
            asyncTest.expect(false).toBeTruthy(); // Não deveria chegar aqui
        } catch (error) {
            asyncTest.expect(error.message).toContain('not found');
        }
    });
    
    asyncTest.it('should load all data', async () => {
        // Arrange
        await service.save('key1', 'value1');
        await service.save('key2', 'value2');
        
        // Act
        const result = await service.loadAll();
        
        // Assert
        asyncTest.expect(result).toEqual({
            key1: 'value1',
            key2: 'value2'
        });
    });
    
    asyncTest.it('should delete data', async () => {
        // Arrange
        await service.save('key', 'value');
        
        // Act
        const deleted = await service.delete('key');
        
        // Assert
        asyncTest.expect(deleted).toBeTruthy();
        
        try {
            await service.load('key');
            asyncTest.expect(false).toBeTruthy(); // Não deveria chegar aqui
        } catch (error) {
            asyncTest.expect(error.message).toContain('not found');
        }
    });
});

// 4. TDD (TEST-DRIVEN DEVELOPMENT)
console.log('\n=== 4. TDD Example ===');

// Vamos implementar uma classe StringUtils usando TDD
const tddTest = new SimpleTestFramework();

// PASSO 1: Escrever testes que falham (RED)
tddTest.describe('StringUtils (TDD)', () => {
    // Teste 1: capitalize
    tddTest.it('should capitalize first letter', () => {
        const result = StringUtils.capitalize('hello');
        tddTest.expect(result).toBe('Hello');
    });
    
    tddTest.it('should handle empty string', () => {
        const result = StringUtils.capitalize('');
        tddTest.expect(result).toBe('');
    });
    
    // Teste 2: reverse
    tddTest.it('should reverse string', () => {
        const result = StringUtils.reverse('hello');
        tddTest.expect(result).toBe('olleh');
    });
    
    // Teste 3: isPalindrome
    tddTest.it('should detect palindrome', () => {
        tddTest.expect(StringUtils.isPalindrome('radar')).toBeTruthy();
        tddTest.expect(StringUtils.isPalindrome('hello')).toBeFalsy();
    });
    
    // Teste 4: wordCount
    tddTest.it('should count words', () => {
        tddTest.expect(StringUtils.wordCount('hello world')).toBe(2);
        tddTest.expect(StringUtils.wordCount('  hello   world  ')).toBe(2);
        tddTest.expect(StringUtils.wordCount('')).toBe(0);
    });
    
    // Teste 5: truncate
    tddTest.it('should truncate string', () => {
        const result = StringUtils.truncate('hello world', 5);
        tddTest.expect(result).toBe('hello...');
    });
    
    tddTest.it('should not truncate if shorter', () => {
        const result = StringUtils.truncate('hi', 5);
        tddTest.expect(result).toBe('hi');
    });
});

// PASSO 2: Implementar código mínimo para passar (GREEN)
class StringUtils {
    static capitalize(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    static reverse(str) {
        return str.split('').reverse().join('');
    }
    
    static isPalindrome(str) {
        const cleaned = str.toLowerCase();
        return cleaned === this.reverse(cleaned);
    }
    
    static wordCount(str) {
        if (!str.trim()) return 0;
        return str.trim().split(/\s+/).length;
    }
    
    static truncate(str, maxLength) {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    }
}

// PASSO 3: Refatorar (REFACTOR)
// Vamos melhorar a implementação mantendo os testes passando
class StringUtilsRefactored {
    static capitalize(str) {
        return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
    }
    
    static reverse(str) {
        return [...str].reverse().join('');
    }
    
    static isPalindrome(str) {
        const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, '');
        return normalized === this.reverse(normalized);
    }
    
    static wordCount(str) {
        const words = str.trim().match(/\S+/g);
        return words ? words.length : 0;
    }
    
    static truncate(str, maxLength, suffix = '...') {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength - suffix.length) + suffix;
    }
}

// 5. COVERAGE E MÉTRICAS
console.log('\n=== 5. Coverage e Métricas ===');

class TestCoverage {
    constructor() {
        this.coverage = new Map();
        this.originalFunctions = new Map();
    }
    
    instrument(obj, methodName) {
        if (this.originalFunctions.has(`${obj.constructor.name}.${methodName}`)) {
            return; // Já instrumentado
        }
        
        const original = obj[methodName];
        this.originalFunctions.set(`${obj.constructor.name}.${methodName}`, original);
        
        const coverageKey = `${obj.constructor.name}.${methodName}`;
        this.coverage.set(coverageKey, {
            called: false,
            callCount: 0,
            lines: new Set()
        });
        
        obj[methodName] = (...args) => {
            const coverage = this.coverage.get(coverageKey);
            coverage.called = true;
            coverage.callCount++;
            
            // Simular cobertura de linha
            const stack = new Error().stack;
            const lineMatch = stack.match(/:([0-9]+):[0-9]+/);
            if (lineMatch) {
                coverage.lines.add(parseInt(lineMatch[1]));
            }
            
            return original.apply(obj, args);
        };
    }
    
    instrumentClass(ClassConstructor) {
        const prototype = ClassConstructor.prototype;
        const methods = Object.getOwnPropertyNames(prototype)
            .filter(name => name !== 'constructor' && typeof prototype[name] === 'function');
        
        methods.forEach(methodName => {
            this.instrumentStatic(ClassConstructor, methodName);
        });
    }
    
    instrumentStatic(ClassConstructor, methodName) {
        if (typeof ClassConstructor[methodName] !== 'function') {
            return;
        }
        
        const coverageKey = `${ClassConstructor.name}.${methodName}`;
        const original = ClassConstructor[methodName];
        
        this.coverage.set(coverageKey, {
            called: false,
            callCount: 0,
            lines: new Set()
        });
        
        ClassConstructor[methodName] = (...args) => {
            const coverage = this.coverage.get(coverageKey);
            coverage.called = true;
            coverage.callCount++;
            
            return original.apply(ClassConstructor, args);
        };
    }
    
    getReport() {
        const report = {
            totalMethods: this.coverage.size,
            coveredMethods: 0,
            uncoveredMethods: [],
            methodDetails: {}
        };
        
        for (let [method, data] of this.coverage) {
            if (data.called) {
                report.coveredMethods++;
            } else {
                report.uncoveredMethods.push(method);
            }
            
            report.methodDetails[method] = {
                covered: data.called,
                callCount: data.callCount,
                linesHit: data.lines.size
            };
        }
        
        report.coveragePercentage = report.totalMethods > 0 
            ? ((report.coveredMethods / report.totalMethods) * 100).toFixed(2)
            : 0;
        
        return report;
    }
    
    printReport() {
        const report = this.getReport();
        
        console.log('\n📊 Relatório de Cobertura:');
        console.log(`Total de métodos: ${report.totalMethods}`);
        console.log(`Métodos cobertos: ${report.coveredMethods}`);
        console.log(`Cobertura: ${report.coveragePercentage}%`);
        
        if (report.uncoveredMethods.length > 0) {
            console.log('\n❌ Métodos não cobertos:');
            report.uncoveredMethods.forEach(method => {
                console.log(`  - ${method}`);
            });
        }
        
        console.log('\n📋 Detalhes por método:');
        for (let [method, details] of Object.entries(report.methodDetails)) {
            const status = details.covered ? '✅' : '❌';
            console.log(`  ${status} ${method}: ${details.callCount} calls`);
        }
    }
    
    reset() {
        this.coverage.clear();
        
        // Restaurar funções originais
        for (let [key, original] of this.originalFunctions) {
            const [className, methodName] = key.split('.');
            // Em um cenário real, restauraríamos as funções originais
        }
        
        this.originalFunctions.clear();
    }
}

// Testando cobertura
const coverage = new TestCoverage();
coverage.instrumentClass(StringUtils);

// Executar alguns testes para gerar cobertura
StringUtils.capitalize('test');
StringUtils.reverse('test');
StringUtils.wordCount('hello world');
// isPalindrome e truncate não são chamados

coverage.printReport();

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE TESTES COMPLETO
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Testes Completo ===');

class AdvancedTestFramework {
    constructor() {
        this.suites = [];
        this.currentSuite = null;
        this.hooks = {
            beforeAll: [],
            afterAll: [],
            beforeEach: [],
            afterEach: []
        };
        this.config = {
            timeout: 5000,
            retries: 0,
            parallel: false
        };
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0,
            duration: 0
        };
        this.coverage = new TestCoverage();
    }
    
    describe(name, callback) {
        const suite = {
            name,
            tests: [],
            hooks: {
                beforeAll: [],
                afterAll: [],
                beforeEach: [],
                afterEach: []
            },
            only: false,
            skip: false
        };
        
        this.suites.push(suite);
        this.currentSuite = suite;
        
        callback();
        
        this.currentSuite = null;
    }
    
    it(name, callback, options = {}) {
        if (!this.currentSuite) {
            throw new Error('it() deve ser chamado dentro de describe()');
        }
        
        const test = {
            name,
            callback,
            timeout: options.timeout || this.config.timeout,
            retries: options.retries || this.config.retries,
            only: options.only || false,
            skip: options.skip || false,
            tags: options.tags || []
        };
        
        this.currentSuite.tests.push(test);
    }
    
    beforeAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeAll.push(callback);
        } else {
            this.hooks.beforeAll.push(callback);
        }
    }
    
    afterAll(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterAll.push(callback);
        } else {
            this.hooks.afterAll.push(callback);
        }
    }
    
    beforeEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.beforeEach.push(callback);
        } else {
            this.hooks.beforeEach.push(callback);
        }
    }
    
    afterEach(callback) {
        if (this.currentSuite) {
            this.currentSuite.hooks.afterEach.push(callback);
        } else {
            this.hooks.afterEach.push(callback);
        }
    }
    
    async runTest(test, suite) {
        const startTime = Date.now();
        let attempts = 0;
        let lastError;
        
        while (attempts <= test.retries) {
            try {
                // Executar hooks beforeEach
                for (let hook of this.hooks.beforeEach) {
                    await this.executeWithTimeout(hook, test.timeout);
                }
                for (let hook of suite.hooks.beforeEach) {
                    await this.executeWithTimeout(hook, test.timeout);
                }
                
                // Executar teste
                await this.executeWithTimeout(test.callback, test.timeout);
                
                // Executar hooks afterEach
                for (let hook of suite.hooks.afterEach) {
                    await this.executeWithTimeout(hook, test.timeout);
                }
                for (let hook of this.hooks.afterEach) {
                    await this.executeWithTimeout(hook, test.timeout);
                }
                
                const duration = Date.now() - startTime;
                this.results.passed++;
                console.log(`  ✅ ${test.name} (${duration}ms)`);
                return;
                
            } catch (error) {
                lastError = error;
                attempts++;
                
                if (attempts <= test.retries) {
                    console.log(`  🔄 ${test.name} - Tentativa ${attempts + 1}`);
                }
            }
        }
        
        const duration = Date.now() - startTime;
        this.results.failed++;
        console.log(`  ❌ ${test.name} (${duration}ms)`);
        console.log(`     ${lastError.message}`);
    }
    
    async executeWithTimeout(fn, timeout) {
        return new Promise(async (resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout de ${timeout}ms excedido`));
            }, timeout);
            
            try {
                const result = await fn();
                clearTimeout(timer);
                resolve(result);
            } catch (error) {
                clearTimeout(timer);
                reject(error);
            }
        });
    }
    
    async run(options = {}) {
        const startTime = Date.now();
        
        console.log('\n🚀 Executando testes avançados...');
        
        // Filtrar suites e testes
        let suitesToRun = this.suites;
        
        if (options.grep) {
            suitesToRun = suitesToRun.filter(suite => 
                suite.name.includes(options.grep) ||
                suite.tests.some(test => test.name.includes(options.grep))
            );
        }
        
        if (options.tags) {
            suitesToRun = suitesToRun.filter(suite =>
                suite.tests.some(test => 
                    test.tags.some(tag => options.tags.includes(tag))
                )
            );
        }
        
        // Executar hooks globais beforeAll
        for (let hook of this.hooks.beforeAll) {
            await hook();
        }
        
        // Executar suites
        for (let suite of suitesToRun) {
            if (suite.skip) {
                console.log(`\n⏭️ Suite: ${suite.name} (SKIPPED)`);
                continue;
            }
            
            console.log(`\n📋 Suite: ${suite.name}`);
            
            // Hooks beforeAll da suite
            for (let hook of suite.hooks.beforeAll) {
                await hook();
            }
            
            // Filtrar testes
            let testsToRun = suite.tests;
            
            if (options.grep) {
                testsToRun = testsToRun.filter(test => 
                    test.name.includes(options.grep)
                );
            }
            
            if (options.tags) {
                testsToRun = testsToRun.filter(test => 
                    test.tags.some(tag => options.tags.includes(tag))
                );
            }
            
            // Executar testes
            for (let test of testsToRun) {
                if (test.skip) {
                    this.results.skipped++;
                    console.log(`  ⏭️ ${test.name} (SKIPPED)`);
                    continue;
                }
                
                this.results.total++;
                await this.runTest(test, suite);
            }
            
            // Hooks afterAll da suite
            for (let hook of suite.hooks.afterAll) {
                await hook();
            }
        }
        
        // Executar hooks globais afterAll
        for (let hook of this.hooks.afterAll) {
            await hook();
        }
        
        this.results.duration = Date.now() - startTime;
        this.printResults();
        
        if (options.coverage) {
            this.coverage.printReport();
        }
    }
    
    printResults() {
        console.log('\n📊 Resultados Finais:');
        console.log(`Total: ${this.results.total}`);
        console.log(`✅ Passou: ${this.results.passed}`);
        console.log(`❌ Falhou: ${this.results.failed}`);
        console.log(`⏭️ Pulou: ${this.results.skipped}`);
        console.log(`⏱️ Duração: ${this.results.duration}ms`);
        
        const percentage = this.results.total > 0 
            ? ((this.results.passed / this.results.total) * 100).toFixed(1)
            : 0;
        
        console.log(`📈 Taxa de sucesso: ${percentage}%`);
        
        if (this.results.failed === 0) {
            console.log('🎉 Todos os testes passaram!');
        }
    }
    
    expect(actual) {
        return new Expectation(actual);
    }
}

// Exemplo de uso do framework avançado
const advancedTest = new AdvancedTestFramework();

// Sistema de exemplo para testar
class TaskManager {
    constructor() {
        this.tasks = [];
        this.nextId = 1;
    }
    
    addTask(title, priority = 'medium') {
        const task = {
            id: this.nextId++,
            title,
            priority,
            completed: false,
            createdAt: new Date()
        };
        
        this.tasks.push(task);
        return task;
    }
    
    completeTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) {
            throw new Error(`Task ${id} not found`);
        }
        
        task.completed = true;
        task.completedAt = new Date();
        return task;
    }
    
    getTasks(filter = {}) {
        let filtered = this.tasks;
        
        if (filter.completed !== undefined) {
            filtered = filtered.filter(t => t.completed === filter.completed);
        }
        
        if (filter.priority) {
            filtered = filtered.filter(t => t.priority === filter.priority);
        }
        
        return filtered;
    }
    
    deleteTask(id) {
        const index = this.tasks.findIndex(t => t.id === id);
        if (index === -1) {
            throw new Error(`Task ${id} not found`);
        }
        
        return this.tasks.splice(index, 1)[0];
    }
    
    clear() {
        this.tasks = [];
        this.nextId = 1;
    }
}

// Testes com framework avançado
advancedTest.describe('TaskManager Advanced Tests', () => {
    let taskManager;
    
    advancedTest.beforeEach(() => {
        taskManager = new TaskManager();
    });
    
    advancedTest.it('should add task with default priority', () => {
        const task = taskManager.addTask('Test task');
        
        advancedTest.expect(task.title).toBe('Test task');
        advancedTest.expect(task.priority).toBe('medium');
        advancedTest.expect(task.completed).toBeFalsy();
        advancedTest.expect(task.id).toBe(1);
    }, { tags: ['basic', 'add'] });
    
    advancedTest.it('should add task with custom priority', () => {
        const task = taskManager.addTask('Urgent task', 'high');
        
        advancedTest.expect(task.priority).toBe('high');
    }, { tags: ['basic', 'add'] });
    
    advancedTest.it('should complete task', () => {
        const task = taskManager.addTask('Task to complete');
        const completed = taskManager.completeTask(task.id);
        
        advancedTest.expect(completed.completed).toBeTruthy();
        advancedTest.expect(completed.completedAt).toBeTruthy();
    }, { tags: ['basic', 'complete'] });
    
    advancedTest.it('should throw error when completing non-existent task', () => {
        advancedTest.expect(() => taskManager.completeTask(999)).toThrow('not found');
    }, { tags: ['error', 'complete'] });
    
    advancedTest.it('should filter tasks by completion status', () => {
        taskManager.addTask('Task 1');
        const task2 = taskManager.addTask('Task 2');
        taskManager.completeTask(task2.id);
        
        const completed = taskManager.getTasks({ completed: true });
        const pending = taskManager.getTasks({ completed: false });
        
        advancedTest.expect(completed.length).toBe(1);
        advancedTest.expect(pending.length).toBe(1);
    }, { tags: ['filter', 'query'] });
    
    advancedTest.it('should filter tasks by priority', () => {
        taskManager.addTask('Low task', 'low');
        taskManager.addTask('High task', 'high');
        taskManager.addTask('Medium task', 'medium');
        
        const highPriority = taskManager.getTasks({ priority: 'high' });
        
        advancedTest.expect(highPriority.length).toBe(1);
        advancedTest.expect(highPriority[0].title).toBe('High task');
    }, { tags: ['filter', 'query'] });
    
    advancedTest.it('should delete task', () => {
        const task = taskManager.addTask('Task to delete');
        const deleted = taskManager.deleteTask(task.id);
        
        advancedTest.expect(deleted.id).toBe(task.id);
        advancedTest.expect(taskManager.getTasks().length).toBe(0);
    }, { tags: ['delete'] });
    
    advancedTest.it('should handle async operations', async () => {
        // Simular operação assíncrona
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const task = taskManager.addTask('Async task');
        advancedTest.expect(task.title).toBe('Async task');
    }, { tags: ['async'], timeout: 1000 });
});

// Executar testes com diferentes opções
console.log('\n--- Executando todos os testes ---');
// await advancedTest.run();

console.log('\n--- Executando apenas testes básicos ---');
// await advancedTest.run({ tags: ['basic'] });

console.log('\n--- Executando testes com grep ---');
// await advancedTest.run({ grep: 'priority' });

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Parallel Execution: Execute testes independentes em paralelo
2. Test Isolation: Garanta que testes não afetem uns aos outros
3. Fast Feedback: Priorize testes rápidos
4. Smart Retries: Retry apenas testes flaky
5. Incremental Testing: Execute apenas testes afetados por mudanças

BOAS PRÁTICAS:
1. AAA Pattern: Arrange, Act, Assert
2. Descriptive Names: Nomes claros e específicos
3. Single Responsibility: Um teste, uma responsabilidade
4. Independent Tests: Testes não devem depender uns dos outros
5. Deterministic: Resultados consistentes
6. Fast Execution: Testes rápidos incentivam execução frequente
7. Maintainable: Fácil de manter e atualizar
8. Comprehensive: Cobertura adequada sem exagero

PADRÕES DE TESTE:
1. Test Doubles: Mock, Stub, Spy, Fake
2. Test Data Builders: Construtores de dados de teste
3. Page Object Model: Para testes de UI
4. Test Fixtures: Dados e estado pré-configurados
5. Parameterized Tests: Testes com múltiplos cenários
*/

// ==========================================
// REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS ===');

/*
FRAMEWORKS POPULARES:
- Jest - Framework completo para JavaScript
- Mocha - Framework flexível
- Jasmine - BDD framework
- Vitest - Framework rápido para Vite
- Cypress - E2E testing
- Playwright - Cross-browser testing

FERRAMENTAS:
- Istanbul - Code coverage
- Sinon - Mocking library
- Testing Library - Utilities para testing
- Storybook - Component testing
- MSW - API mocking

METODOLOGIAS:
- TDD (Test-Driven Development)
- BDD (Behavior-Driven Development)
- ATDD (Acceptance Test-Driven Development)
- Mutation Testing
- Property-Based Testing

PRÓXIMOS PASSOS:
1. Praticar TDD em projetos reais
2. Configurar CI/CD com testes
3. Implementar testes de integração
4. Estudar testes E2E
5. Explorar visual regression testing

PROJETOS SUGERIDOS:
- Sistema de testes para API
- Framework de testes customizado
- Dashboard de cobertura
- Gerador de dados de teste
- Automação de testes E2E
*/

/*
RESUMO DO MÓDULO TESTES UNITÁRIOS:

CONCEITOS APRENDIDOS:
✅ Fundamentos de testes unitários
✅ Framework de testes do zero
✅ Mocking e stubbing
✅ Testes assíncronos
✅ TDD (Test-Driven Development)
✅ Coverage e métricas
✅ Hooks e lifecycle
✅ Filtros e configurações

TÉCNICAS DOMINADAS:
✅ Estrutura AAA
✅ Test doubles (Mock, Spy)
✅ Assertions customizadas
✅ Timeout handling
✅ Retry mechanisms
✅ Test isolation
✅ Coverage tracking
✅ Parallel execution

FERRAMENTAS CRIADAS:
✅ Framework de testes simples
✅ Sistema de mocking
✅ Framework assíncrono
✅ Coverage tracker
✅ Framework avançado completo
✅ Sistema de hooks
✅ Filtros e tags

PRÓXIMO ARQUIVO: 03-performance.js
*/