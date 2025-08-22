/*
===========================================
    CURSO JAVASCRIPT - TESTES E DEBUGGING
===========================================

Este arquivo aborda:
- Fundamentos de testes em JavaScript
- Testes unitários e de integração
- Frameworks de teste (Jest, Mocha, Jasmine)
- Test-Driven Development (TDD)
- Behavior-Driven Development (BDD)
- Mocking e Stubbing
- Debugging técnicas e ferramentas
- Performance testing
- End-to-end testing
- Boas práticas e estratégias

NOTA: Testes são fundamentais para garantir qualidade, confiabilidade
e facilitar manutenção do código. Debugging é essencial para
identificar e corrigir problemas.
*/

// ========================================
// 1. FUNDAMENTOS DE TESTES
// ========================================

/*
Tipos de Testes:

1. TESTES UNITÁRIOS:
   - Testam unidades isoladas de código (funções, métodos)
   - Rápidos e focados
   - Base da pirâmide de testes

2. TESTES DE INTEGRAÇÃO:
   - Testam interação entre componentes
   - Verificam se módulos funcionam juntos
   - Mais complexos que unitários

3. TESTES END-TO-END (E2E):
   - Testam fluxo completo da aplicação
   - Simulam interação real do usuário
   - Mais lentos e complexos

4. TESTES DE PERFORMANCE:
   - Verificam velocidade e eficiência
   - Identificam gargalos
   - Monitoram recursos
*/

console.log('=== TESTES E DEBUGGING EM JAVASCRIPT ==>');

// ========================================
// 2. IMPLEMENTAÇÃO BÁSICA DE TESTES
// ========================================

// Framework de teste simples (para entendimento)
class SimpleTestFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }
    
    // Registrar teste
    test(description, testFunction) {
        this.tests.push({ description, testFunction });
    }
    
    // Executar todos os testes
    run() {
        console.log('\n🧪 Executando testes...');
        console.log('=' .repeat(50));
        
        this.tests.forEach(({ description, testFunction }) => {
            try {
                testFunction();
                console.log(`✅ ${description}`);
                this.results.passed++;
            } catch (error) {
                console.log(`❌ ${description}`);
                console.log(`   Erro: ${error.message}`);
                this.results.failed++;
            }
            this.results.total++;
        });
        
        this.printSummary();
    }
    
    printSummary() {
        console.log('\n' + '=' .repeat(50));
        console.log('📊 RESUMO DOS TESTES:');
        console.log(`Total: ${this.results.total}`);
        console.log(`✅ Passou: ${this.results.passed}`);
        console.log(`❌ Falhou: ${this.results.failed}`);
        
        const successRate = (this.results.passed / this.results.total * 100).toFixed(1);
        console.log(`📈 Taxa de sucesso: ${successRate}%`);
    }
}

// Funções de asserção
class Assert {
    static equal(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} - Esperado: ${expected}, Recebido: ${actual}`);
        }
    }
    
    static notEqual(actual, expected, message = '') {
        if (actual === expected) {
            throw new Error(`${message} - Valores não deveriam ser iguais: ${actual}`);
        }
    }
    
    static true(value, message = '') {
        if (value !== true) {
            throw new Error(`${message} - Esperado: true, Recebido: ${value}`);
        }
    }
    
    static false(value, message = '') {
        if (value !== false) {
            throw new Error(`${message} - Esperado: false, Recebido: ${value}`);
        }
    }
    
    static throws(fn, expectedError, message = '') {
        try {
            fn();
            throw new Error(`${message} - Função deveria ter lançado erro`);
        } catch (error) {
            if (expectedError && !(error instanceof expectedError)) {
                throw new Error(`${message} - Tipo de erro incorreto`);
            }
        }
    }
    
    static async(promiseOrFunction, message = '') {
        return {
            async resolves() {
                try {
                    await promiseOrFunction;
                } catch (error) {
                    throw new Error(`${message} - Promise deveria resolver: ${error.message}`);
                }
            },
            
            async rejects() {
                try {
                    await promiseOrFunction;
                    throw new Error(`${message} - Promise deveria rejeitar`);
                } catch (error) {
                    // Esperado
                }
            }
        };
    }
}

// ========================================
// 3. EXEMPLOS DE CÓDIGO PARA TESTAR
// ========================================

// Calculadora para testes
class Calculator {
    add(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Argumentos devem ser números');
        }
        return a + b;
    }
    
    subtract(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Argumentos devem ser números');
        }
        return a - b;
    }
    
    multiply(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Argumentos devem ser números');
        }
        return a * b;
    }
    
    divide(a, b) {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Argumentos devem ser números');
        }
        if (b === 0) {
            throw new Error('Divisão por zero não permitida');
        }
        return a / b;
    }
    
    power(base, exponent) {
        if (typeof base !== 'number' || typeof exponent !== 'number') {
            throw new TypeError('Argumentos devem ser números');
        }
        return Math.pow(base, exponent);
    }
    
    sqrt(number) {
        if (typeof number !== 'number') {
            throw new TypeError('Argumento deve ser número');
        }
        if (number < 0) {
            throw new Error('Não é possível calcular raiz quadrada de número negativo');
        }
        return Math.sqrt(number);
    }
}

// Sistema de usuários para testes
class UserManager {
    constructor() {
        this.users = new Map();
        this.nextId = 1;
    }
    
    createUser(userData) {
        const { name, email, age } = userData;
        
        // Validações
        if (!name || typeof name !== 'string' || name.trim().length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!email || !this.isValidEmail(email)) {
            throw new Error('Email inválido');
        }
        
        if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 150)) {
            throw new Error('Idade deve ser um número entre 0 e 150');
        }
        
        // Verificar email único
        for (const user of this.users.values()) {
            if (user.email === email) {
                throw new Error('Email já está em uso');
            }
        }
        
        const user = {
            id: this.nextId++,
            name: name.trim(),
            email: email.toLowerCase(),
            age: age || null,
            createdAt: new Date(),
            active: true
        };
        
        this.users.set(user.id, user);
        return user;
    }
    
    getUserById(id) {
        return this.users.get(id) || null;
    }
    
    getUserByEmail(email) {
        for (const user of this.users.values()) {
            if (user.email === email.toLowerCase()) {
                return user;
            }
        }
        return null;
    }
    
    updateUser(id, updates) {
        const user = this.users.get(id);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }
        
        const updatedUser = { ...user, ...updates };
        
        // Validar atualizações
        if (updates.email && !this.isValidEmail(updates.email)) {
            throw new Error('Email inválido');
        }
        
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    
    deleteUser(id) {
        const deleted = this.users.delete(id);
        if (!deleted) {
            throw new Error('Usuário não encontrado');
        }
        return true;
    }
    
    getAllUsers() {
        return Array.from(this.users.values());
    }
    
    getActiveUsers() {
        return Array.from(this.users.values()).filter(user => user.active);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    clear() {
        this.users.clear();
        this.nextId = 1;
    }
}

// Função assíncrona para testes
class ApiClient {
    constructor(baseUrl = 'https://api.exemplo.com') {
        this.baseUrl = baseUrl;
    }
    
    async fetchUser(id) {
        // Simula requisição HTTP
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id === 1) {
                    resolve({
                        id: 1,
                        name: 'João Silva',
                        email: 'joao@email.com'
                    });
                } else if (id === 999) {
                    reject(new Error('Usuário não encontrado'));
                } else {
                    resolve({
                        id,
                        name: `Usuário ${id}`,
                        email: `user${id}@email.com`
                    });
                }
            }, 100);
        });
    }
    
    async createUser(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!userData.name || !userData.email) {
                    reject(new Error('Nome e email são obrigatórios'));
                } else {
                    resolve({
                        id: Math.floor(Math.random() * 1000),
                        ...userData,
                        createdAt: new Date()
                    });
                }
            }, 150);
        });
    }
}

// ========================================
// 4. TESTES UNITÁRIOS
// ========================================

console.log('\n=== TESTES UNITÁRIOS ==>');

// Criar instância do framework de teste
const testFramework = new SimpleTestFramework();

// Testes da Calculadora
testFramework.test('Calculator - Soma de números positivos', () => {
    const calc = new Calculator();
    const result = calc.add(2, 3);
    Assert.equal(result, 5, 'Soma de 2 + 3 deveria ser 5');
});

testFramework.test('Calculator - Soma com números negativos', () => {
    const calc = new Calculator();
    const result = calc.add(-2, 3);
    Assert.equal(result, 1, 'Soma de -2 + 3 deveria ser 1');
});

testFramework.test('Calculator - Subtração', () => {
    const calc = new Calculator();
    const result = calc.subtract(10, 4);
    Assert.equal(result, 6, 'Subtração de 10 - 4 deveria ser 6');
});

testFramework.test('Calculator - Multiplicação', () => {
    const calc = new Calculator();
    const result = calc.multiply(3, 4);
    Assert.equal(result, 12, 'Multiplicação de 3 * 4 deveria ser 12');
});

testFramework.test('Calculator - Divisão', () => {
    const calc = new Calculator();
    const result = calc.divide(15, 3);
    Assert.equal(result, 5, 'Divisão de 15 / 3 deveria ser 5');
});

testFramework.test('Calculator - Divisão por zero deve lançar erro', () => {
    const calc = new Calculator();
    Assert.throws(() => calc.divide(10, 0), Error, 'Divisão por zero deveria lançar erro');
});

testFramework.test('Calculator - Argumentos inválidos devem lançar TypeError', () => {
    const calc = new Calculator();
    Assert.throws(() => calc.add('2', 3), TypeError, 'Argumentos inválidos deveriam lançar TypeError');
});

testFramework.test('Calculator - Potenciação', () => {
    const calc = new Calculator();
    const result = calc.power(2, 3);
    Assert.equal(result, 8, 'Potenciação de 2^3 deveria ser 8');
});

testFramework.test('Calculator - Raiz quadrada', () => {
    const calc = new Calculator();
    const result = calc.sqrt(16);
    Assert.equal(result, 4, 'Raiz quadrada de 16 deveria ser 4');
});

testFramework.test('Calculator - Raiz quadrada de número negativo deve lançar erro', () => {
    const calc = new Calculator();
    Assert.throws(() => calc.sqrt(-4), Error, 'Raiz quadrada de número negativo deveria lançar erro');
});

// Testes do UserManager
testFramework.test('UserManager - Criar usuário válido', () => {
    const userManager = new UserManager();
    const userData = {
        name: 'João Silva',
        email: 'joao@email.com',
        age: 30
    };
    
    const user = userManager.createUser(userData);
    
    Assert.equal(user.name, 'João Silva');
    Assert.equal(user.email, 'joao@email.com');
    Assert.equal(user.age, 30);
    Assert.equal(user.id, 1);
    Assert.true(user.active);
});

testFramework.test('UserManager - Email deve ser único', () => {
    const userManager = new UserManager();
    
    userManager.createUser({
        name: 'João',
        email: 'joao@email.com'
    });
    
    Assert.throws(() => {
        userManager.createUser({
            name: 'Maria',
            email: 'joao@email.com'
        });
    }, Error, 'Email duplicado deveria lançar erro');
});

testFramework.test('UserManager - Nome inválido deve lançar erro', () => {
    const userManager = new UserManager();
    
    Assert.throws(() => {
        userManager.createUser({
            name: 'A',
            email: 'a@email.com'
        });
    }, Error, 'Nome muito curto deveria lançar erro');
});

testFramework.test('UserManager - Email inválido deve lançar erro', () => {
    const userManager = new UserManager();
    
    Assert.throws(() => {
        userManager.createUser({
            name: 'João',
            email: 'email-inválido'
        });
    }, Error, 'Email inválido deveria lançar erro');
});

testFramework.test('UserManager - Buscar usuário por ID', () => {
    const userManager = new UserManager();
    const user = userManager.createUser({
        name: 'João',
        email: 'joao@email.com'
    });
    
    const foundUser = userManager.getUserById(user.id);
    Assert.equal(foundUser.id, user.id);
    Assert.equal(foundUser.name, 'João');
});

testFramework.test('UserManager - Buscar usuário inexistente retorna null', () => {
    const userManager = new UserManager();
    const foundUser = userManager.getUserById(999);
    Assert.equal(foundUser, null);
});

testFramework.test('UserManager - Atualizar usuário', () => {
    const userManager = new UserManager();
    const user = userManager.createUser({
        name: 'João',
        email: 'joao@email.com'
    });
    
    const updatedUser = userManager.updateUser(user.id, {
        name: 'João Silva',
        age: 25
    });
    
    Assert.equal(updatedUser.name, 'João Silva');
    Assert.equal(updatedUser.age, 25);
    Assert.equal(updatedUser.email, 'joao@email.com'); // Não alterado
});

testFramework.test('UserManager - Deletar usuário', () => {
    const userManager = new UserManager();
    const user = userManager.createUser({
        name: 'João',
        email: 'joao@email.com'
    });
    
    const deleted = userManager.deleteUser(user.id);
    Assert.true(deleted);
    
    const foundUser = userManager.getUserById(user.id);
    Assert.equal(foundUser, null);
});

// ========================================
// 5. TESTES ASSÍNCRONOS
// ========================================

console.log('\n=== TESTES ASSÍNCRONOS ==>');

// Framework estendido para testes assíncronos
class AsyncTestFramework extends SimpleTestFramework {
    async runAsync() {
        console.log('\n🧪 Executando testes assíncronos...');
        console.log('=' .repeat(50));
        
        for (const { description, testFunction } of this.tests) {
            try {
                await testFunction();
                console.log(`✅ ${description}`);
                this.results.passed++;
            } catch (error) {
                console.log(`❌ ${description}`);
                console.log(`   Erro: ${error.message}`);
                this.results.failed++;
            }
            this.results.total++;
        }
        
        this.printSummary();
    }
}

const asyncTestFramework = new AsyncTestFramework();

// Testes assíncronos
asyncTestFramework.test('ApiClient - Buscar usuário existente', async () => {
    const api = new ApiClient();
    const user = await api.fetchUser(1);
    
    Assert.equal(user.id, 1);
    Assert.equal(user.name, 'João Silva');
    Assert.equal(user.email, 'joao@email.com');
});

asyncTestFramework.test('ApiClient - Buscar usuário inexistente deve rejeitar', async () => {
    const api = new ApiClient();
    
    try {
        await api.fetchUser(999);
        throw new Error('Deveria ter lançado erro');
    } catch (error) {
        Assert.equal(error.message, 'Usuário não encontrado');
    }
});

asyncTestFramework.test('ApiClient - Criar usuário válido', async () => {
    const api = new ApiClient();
    const userData = {
        name: 'Maria Silva',
        email: 'maria@email.com'
    };
    
    const user = await api.createUser(userData);
    
    Assert.equal(user.name, 'Maria Silva');
    Assert.equal(user.email, 'maria@email.com');
    Assert.true(user.id > 0);
    Assert.true(user.createdAt instanceof Date);
});

asyncTestFramework.test('ApiClient - Criar usuário sem dados obrigatórios deve rejeitar', async () => {
    const api = new ApiClient();
    
    try {
        await api.createUser({ name: 'João' }); // Sem email
        throw new Error('Deveria ter lançado erro');
    } catch (error) {
        Assert.equal(error.message, 'Nome e email são obrigatórios');
    }
});

// ========================================
// 6. MOCKING E STUBBING
// ========================================

console.log('\n=== MOCKING E STUBBING ==>');

// Sistema simples de mocking
class MockFunction {
    constructor(returnValue) {
        this.calls = [];
        this.returnValue = returnValue;
        this.throwError = null;
    }
    
    // Função mockada
    fn(...args) {
        this.calls.push({
            args,
            timestamp: new Date()
        });
        
        if (this.throwError) {
            throw this.throwError;
        }
        
        return typeof this.returnValue === 'function' 
            ? this.returnValue(...args)
            : this.returnValue;
    }
    
    // Configurar retorno
    mockReturnValue(value) {
        this.returnValue = value;
        return this;
    }
    
    // Configurar erro
    mockThrow(error) {
        this.throwError = error;
        return this;
    }
    
    // Verificações
    toHaveBeenCalled() {
        return this.calls.length > 0;
    }
    
    toHaveBeenCalledTimes(times) {
        return this.calls.length === times;
    }
    
    toHaveBeenCalledWith(...args) {
        return this.calls.some(call => 
            call.args.length === args.length &&
            call.args.every((arg, index) => arg === args[index])
        );
    }
    
    getCallCount() {
        return this.calls.length;
    }
    
    getCalls() {
        return [...this.calls];
    }
    
    reset() {
        this.calls = [];
        this.returnValue = undefined;
        this.throwError = null;
    }
}

// Classe para testar com dependências
class EmailService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    
    async sendWelcomeEmail(userId) {
        try {
            const user = await this.apiClient.fetchUser(userId);
            
            // Simula envio de email
            console.log(`Enviando email de boas-vindas para ${user.email}`);
            
            return {
                success: true,
                emailSent: true,
                recipient: user.email
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Testes com mocks
const mockTestFramework = new AsyncTestFramework();

mockTestFramework.test('EmailService - Enviar email para usuário existente', async () => {
    // Criar mock do ApiClient
    const mockApiClient = {
        fetchUser: new MockFunction({
            id: 1,
            name: 'João',
            email: 'joao@email.com'
        }).fn
    };
    
    const emailService = new EmailService(mockApiClient);
    const result = await emailService.sendWelcomeEmail(1);
    
    Assert.true(result.success);
    Assert.true(result.emailSent);
    Assert.equal(result.recipient, 'joao@email.com');
});

mockTestFramework.test('EmailService - Falha ao buscar usuário', async () => {
    // Mock que lança erro
    const mockApiClient = {
        fetchUser: new MockFunction().mockThrow(new Error('Usuário não encontrado')).fn
    };
    
    const emailService = new EmailService(mockApiClient);
    const result = await emailService.sendWelcomeEmail(999);
    
    Assert.false(result.success);
    Assert.equal(result.error, 'Usuário não encontrado');
});

// ========================================
// 7. TEST-DRIVEN DEVELOPMENT (TDD)
// ========================================

console.log('\n=== TEST-DRIVEN DEVELOPMENT (TDD) ==>');

/*
TDD Cycle (Red-Green-Refactor):

1. RED: Escreva um teste que falha
2. GREEN: Escreva o código mínimo para passar
3. REFACTOR: Melhore o código mantendo os testes passando

Exemplo: Implementar uma função de validação de senha
*/

// PASSO 1: Escrever testes primeiro (RED)
const tddFramework = new SimpleTestFramework();

// Testes para função que ainda não existe
tddFramework.test('PasswordValidator - Senha válida', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('MinhaSenh@123');
    Assert.true(result.isValid);
});

tddFramework.test('PasswordValidator - Senha muito curta', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('123');
    Assert.false(result.isValid);
    Assert.true(result.errors.includes('Senha deve ter pelo menos 8 caracteres'));
});

tddFramework.test('PasswordValidator - Senha sem maiúscula', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('minhasenha123');
    Assert.false(result.isValid);
    Assert.true(result.errors.includes('Senha deve conter pelo menos uma letra maiúscula'));
});

tddFramework.test('PasswordValidator - Senha sem número', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('MinhaSenh@');
    Assert.false(result.isValid);
    Assert.true(result.errors.includes('Senha deve conter pelo menos um número'));
});

tddFramework.test('PasswordValidator - Senha sem caractere especial', () => {
    const validator = new PasswordValidator();
    const result = validator.validate('MinhaSenh123');
    Assert.false(result.isValid);
    Assert.true(result.errors.includes('Senha deve conter pelo menos um caractere especial'));
});

// PASSO 2: Implementar código mínimo (GREEN)
class PasswordValidator {
    validate(password) {
        const errors = [];
        
        // Verificar comprimento
        if (password.length < 8) {
            errors.push('Senha deve ter pelo menos 8 caracteres');
        }
        
        // Verificar letra maiúscula
        if (!/[A-Z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra maiúscula');
        }
        
        // Verificar letra minúscula
        if (!/[a-z]/.test(password)) {
            errors.push('Senha deve conter pelo menos uma letra minúscula');
        }
        
        // Verificar número
        if (!/\d/.test(password)) {
            errors.push('Senha deve conter pelo menos um número');
        }
        
        // Verificar caractere especial
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Senha deve conter pelo menos um caractere especial');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            strength: this.calculateStrength(password, errors)
        };
    }
    
    // PASSO 3: Refatorar e adicionar funcionalidades
    calculateStrength(password, errors) {
        let score = 0;
        
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
        if (password.length >= 16) score += 1;
        
        if (score <= 2) return 'fraca';
        if (score <= 4) return 'média';
        if (score <= 6) return 'forte';
        return 'muito forte';
    }
}

// ========================================
// 8. DEBUGGING TÉCNICAS
// ========================================

console.log('\n=== DEBUGGING TÉCNICAS ==>');

// Função com bug para demonstrar debugging
function buggyFunction(numbers) {
    console.log('🐛 Função com bug - entrada:', numbers);
    
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i <= numbers.length; i++) { // BUG: <= deveria ser <
        console.log(`Iteração ${i}: processando ${numbers[i]}`);
        
        if (typeof numbers[i] === 'number') {
            sum += numbers[i];
            count++;
        }
    }
    
    console.log(`Soma total: ${sum}, Quantidade: ${count}`);
    
    const average = sum / count;
    console.log(`Média calculada: ${average}`);
    
    return average;
}

// Função corrigida com debugging
function debuggedFunction(numbers) {
    console.log('✅ Função corrigida - entrada:', numbers);
    
    // Validação de entrada
    if (!Array.isArray(numbers)) {
        throw new TypeError('Entrada deve ser um array');
    }
    
    if (numbers.length === 0) {
        throw new Error('Array não pode estar vazio');
    }
    
    let sum = 0;
    let count = 0;
    
    // Correção: i < numbers.length
    for (let i = 0; i < numbers.length; i++) {
        console.log(`Iteração ${i}: processando ${numbers[i]}`);
        
        if (typeof numbers[i] === 'number' && !isNaN(numbers[i])) {
            sum += numbers[i];
            count++;
        } else {
            console.warn(`Valor inválido ignorado na posição ${i}: ${numbers[i]}`);
        }
    }
    
    if (count === 0) {
        throw new Error('Nenhum número válido encontrado');
    }
    
    console.log(`Soma total: ${sum}, Quantidade: ${count}`);
    
    const average = sum / count;
    console.log(`Média calculada: ${average}`);
    
    return average;
}

// Demonstração de debugging
console.log('\n--- Testando função com bug ---');
try {
    const result1 = buggyFunction([1, 2, 3, 4, 5]);
    console.log('Resultado:', result1);
} catch (error) {
    console.error('Erro capturado:', error.message);
}

console.log('\n--- Testando função corrigida ---');
try {
    const result2 = debuggedFunction([1, 2, 3, 4, 5]);
    console.log('Resultado:', result2);
} catch (error) {
    console.error('Erro capturado:', error.message);
}

// Técnicas de debugging
class DebugUtils {
    // Logging estruturado
    static log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            message,
            data
        };
        
        console.log(JSON.stringify(logEntry, null, 2));
    }
    
    // Profiling de performance
    static profile(name, fn) {
        return function(...args) {
            const start = performance.now();
            console.log(`🚀 Iniciando profiling: ${name}`);
            
            try {
                const result = fn.apply(this, args);
                const end = performance.now();
                console.log(`✅ ${name} concluído em ${(end - start).toFixed(2)}ms`);
                return result;
            } catch (error) {
                const end = performance.now();
                console.log(`❌ ${name} falhou em ${(end - start).toFixed(2)}ms`);
                throw error;
            }
        };
    }
    
    // Trace de execução
    static trace(fn, name = 'function') {
        return function(...args) {
            console.log(`📍 Entrando em ${name} com argumentos:`, args);
            
            try {
                const result = fn.apply(this, args);
                console.log(`📍 Saindo de ${name} com resultado:`, result);
                return result;
            } catch (error) {
                console.log(`📍 ${name} lançou erro:`, error.message);
                throw error;
            }
        };
    }
    
    // Breakpoint condicional
    static breakpoint(condition, message = 'Breakpoint atingido') {
        if (condition) {
            console.log(`🔴 ${message}`);
            console.trace();
            debugger; // Pausa execução se DevTools estiver aberto
        }
    }
    
    // Dump de estado
    static dumpState(obj, name = 'object') {
        console.group(`📊 Estado de ${name}:`);
        console.table(obj);
        console.groupEnd();
    }
}

// Exemplo de uso das ferramentas de debugging
const profiledFunction = DebugUtils.profile('calculateSum', function(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
});

const tracedFunction = DebugUtils.trace(function(x, y) {
    DebugUtils.breakpoint(x < 0, 'Valor negativo detectado');
    return x * y;
}, 'multiply');

console.log('\n--- Testando ferramentas de debugging ---');
const sum = profiledFunction([1, 2, 3, 4, 5]);
const product = tracedFunction(3, 4);

DebugUtils.dumpState({ sum, product }, 'resultados');

// ========================================
// 9. PERFORMANCE TESTING
// ========================================

console.log('\n=== PERFORMANCE TESTING ==>');

class PerformanceTest {
    static benchmark(name, fn, iterations = 1000) {
        console.log(`\n🏃 Benchmark: ${name}`);
        console.log(`Iterações: ${iterations}`);
        
        // Warm-up
        for (let i = 0; i < 10; i++) {
            fn();
        }
        
        const times = [];
        
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            fn();
            const end = performance.now();
            times.push(end - start);
        }
        
        const total = times.reduce((sum, time) => sum + time, 0);
        const average = total / iterations;
        const min = Math.min(...times);
        const max = Math.max(...times);
        const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
        
        console.log(`📊 Resultados:`);
        console.log(`   Tempo total: ${total.toFixed(2)}ms`);
        console.log(`   Tempo médio: ${average.toFixed(4)}ms`);
        console.log(`   Tempo mínimo: ${min.toFixed(4)}ms`);
        console.log(`   Tempo máximo: ${max.toFixed(4)}ms`);
        console.log(`   Mediana: ${median.toFixed(4)}ms`);
        
        return {
            name,
            iterations,
            total,
            average,
            min,
            max,
            median
        };
    }
    
    static compare(tests) {
        console.log('\n🏆 Comparação de Performance:');
        console.log('=' .repeat(50));
        
        const results = tests.map(({ name, fn, iterations = 1000 }) => 
            this.benchmark(name, fn, iterations)
        );
        
        // Ordenar por tempo médio
        results.sort((a, b) => a.average - b.average);
        
        console.log('\n🥇 Ranking (do mais rápido para o mais lento):');
        results.forEach((result, index) => {
            const emoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
            console.log(`${emoji} ${index + 1}. ${result.name}: ${result.average.toFixed(4)}ms`);
        });
        
        return results;
    }
}

// Exemplo de teste de performance
const testData = Array.from({ length: 1000 }, (_, i) => i);

PerformanceTest.compare([
    {
        name: 'for loop',
        fn: () => {
            let sum = 0;
            for (let i = 0; i < testData.length; i++) {
                sum += testData[i];
            }
            return sum;
        }
    },
    {
        name: 'forEach',
        fn: () => {
            let sum = 0;
            testData.forEach(num => sum += num);
            return sum;
        }
    },
    {
        name: 'reduce',
        fn: () => {
            return testData.reduce((sum, num) => sum + num, 0);
        }
    },
    {
        name: 'for...of',
        fn: () => {
            let sum = 0;
            for (const num of testData) {
                sum += num;
            }
            return sum;
        }
    }
]);

// ========================================
// 10. EXECUTAR TODOS OS TESTES
// ========================================

console.log('\n' + '=' .repeat(60));
console.log('🧪 EXECUTANDO TODOS OS TESTES');
console.log('=' .repeat(60));

// Executar testes síncronos
testFramework.run();

// Executar testes TDD
console.log('\n--- TESTES TDD ---');
tddFramework.run();

// Executar testes assíncronos
(async () => {
    await asyncTestFramework.runAsync();
    await mockTestFramework.runAsync();
})();

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

EXERCÍCIO 1: Sistema de Testes Completo
Implemente um framework de testes que suporte:
- Testes síncronos e assíncronos
- Mocking automático
- Relatórios em HTML
- Cobertura de código
- Testes parametrizados

EXERCÍCIO 2: TDD - Carrinho de Compras
Use TDD para implementar:
- Adicionar/remover produtos
- Calcular total com desconto
- Aplicar cupons
- Validar estoque
- Calcular frete

EXERCÍCIO 3: Sistema de Debugging
Crie ferramentas para:
- Logging estruturado
- Profiling automático
- Trace de execução
- Análise de memory leaks
- Breakpoints condicionais

EXERCÍCIO 4: Testes E2E
Implemente testes que:
- Simulem interação do usuário
- Testem fluxos completos
- Validem interface
- Testem em diferentes browsers
- Gerem screenshots de falhas

EXERCÍCIO 5: Performance Testing
Crie suite que:
- Meça tempo de execução
- Monitore uso de memória
- Teste sob carga
- Compare algoritmos
- Gere relatórios detalhados
*/

/*
========================================
FERRAMENTAS RECOMENDADAS
========================================

FRAMEWORKS DE TESTE:
- Jest: Framework completo com mocking
- Mocha: Framework flexível
- Jasmine: BDD framework
- Vitest: Rápido para Vite projects
- Cypress: E2E testing

DEBUGGING:
- Chrome DevTools: Debugging no browser
- Node.js Inspector: Debugging server-side
- VS Code Debugger: Debugging no editor
- console.* methods: Logging básico

PERFORMANCE:
- Lighthouse: Análise web performance
- WebPageTest: Teste de velocidade
- Performance API: Medições precisas
- Memory tab: Análise de memória

COBERTURA:
- Istanbul/nyc: Cobertura de código
- c8: Cobertura nativa V8
- Codecov: Relatórios online

CI/CD:
- GitHub Actions: Automação
- Jenkins: Pipeline completo
- Travis CI: Integração contínua
*/

/*
========================================
BOAS PRÁTICAS
========================================

ESCRITA DE TESTES:
1. Testes devem ser independentes
2. Use nomes descritivos
3. Teste um comportamento por vez
4. Arrange-Act-Assert pattern
5. Evite lógica complexa em testes

ORGANIZAÇÃO:
1. Estrutura de pastas clara
2. Agrupe testes relacionados
3. Use setup/teardown apropriados
4. Mantenha testes próximos ao código

MANUTENÇÃO:
1. Refatore testes junto com código
2. Remova testes obsoletos
3. Mantenha alta cobertura
4. Revise testes regularmente

DEBUGGING:
1. Use breakpoints estratégicos
2. Adicione logs temporários
3. Isole o problema
4. Reproduza consistentemente
5. Documente soluções

PERFORMANCE:
1. Meça antes de otimizar
2. Foque nos gargalos reais
3. Considere trade-offs
4. Monitore continuamente
5. Teste em ambiente real
*/

console.log("\n=== ARQUIVO 11: TESTES E DEBUGGING CONCLUÍDO ===");
console.log("🎉 CURSO COMPLETO DE JAVASCRIPT FINALIZADO!");
console.log("\nVocê agora possui uma base sólida em:");
console.log("✅ Conceitos fundamentais");
console.log("✅ Estruturas de controle");
console.log("✅ Funções e escopos");
console.log("✅ Objetos e protótipos");
console.log("✅ Arrays e métodos");
console.log("✅ Manipulação do DOM");
console.log("✅ Sistema de eventos");
console.log("✅ Programação assíncrona");
console.log("✅ Recursos modernos ES6+");
console.log("✅ Design Patterns");
console.log("✅ Testes e Debugging");
console.log("\n🚀 Continue praticando e explorando projetos reais!");