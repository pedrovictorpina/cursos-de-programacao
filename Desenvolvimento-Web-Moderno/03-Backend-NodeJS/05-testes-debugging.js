/**
 * MÓDULO 3: BACKEND NODE.JS
 * Arquivo 5: Testes e Debugging
 * 
 * Este arquivo aborda:
 * - Tipos de testes (unitários, integração, e2e)
 * - Frameworks de teste (Jest, Mocha, Supertest)
 * - Mocking e stubbing
 * - Debugging avançado
 * - Profiling e monitoramento
 * - CI/CD para testes
 * 
 * Autor: Professor de Programação
 * Data: 2024
 */

// ===== CONCEITOS FUNDAMENTAIS DE TESTES =====

/**
 * PIRÂMIDE DE TESTES
 * 
 * 1. TESTES UNITÁRIOS (Base da pirâmide)
 * - Testam unidades isoladas de código
 * - Rápidos e numerosos
 * - Feedback imediato
 * 
 * 2. TESTES DE INTEGRAÇÃO (Meio da pirâmide)
 * - Testam interação entre componentes
 * - Incluem banco de dados, APIs externas
 * - Moderadamente rápidos
 * 
 * 3. TESTES E2E (Topo da pirâmide)
 * - Testam fluxos completos
 * - Simulam usuário real
 * - Lentos mas abrangentes
 */

class TestingConcepts {
  static demonstratePyramid() {
    console.log('\n=== PIRÂMIDE DE TESTES ===');
    console.log('🔺 E2E Tests (10%)');
    console.log('🔶 Integration Tests (20%)');
    console.log('🔷 Unit Tests (70%)');
    
    console.log('\n📊 Distribuição recomendada:');
    console.log('- 70% Testes Unitários: Rápidos, isolados, específicos');
    console.log('- 20% Testes de Integração: Componentes trabalhando juntos');
    console.log('- 10% Testes E2E: Fluxos completos do usuário');
  }
  
  static testTypes() {
    return {
      unitarios: {
        definicao: 'Testam uma única unidade de código isoladamente',
        caracteristicas: ['Rápidos', 'Isolados', 'Determinísticos', 'Independentes'],
        exemplos: ['Função pura', 'Método de classe', 'Componente isolado']
      },
      integracao: {
        definicao: 'Testam interação entre múltiplos componentes',
        caracteristicas: ['Moderadamente rápidos', 'Dependências reais', 'Mais complexos'],
        exemplos: ['API + Banco', 'Serviços integrados', 'Módulos conectados']
      },
      e2e: {
        definicao: 'Testam fluxos completos da aplicação',
        caracteristicas: ['Lentos', 'Ambiente real', 'Abrangentes', 'Frágeis'],
        exemplos: ['Fluxo de compra', 'Login completo', 'Jornada do usuário']
      }
    };
  }
}

// ===== JEST FRAMEWORK (SIMULADO) =====

/**
 * SIMULAÇÃO DO JEST
 * 
 * Jest é um framework de testes JavaScript desenvolvido pelo Facebook
 * Inclui test runner, assertions, mocking e coverage
 */

class JestSimulator {
  static tests = [];
  static suites = [];
  static mocks = new Map();
  static spies = new Map();
  
  // Função describe para agrupar testes
  static describe(description, fn) {
    console.log(`\n📁 ${description}`);
    const suite = {
      description,
      tests: [],
      beforeEach: [],
      afterEach: [],
      beforeAll: [],
      afterAll: []
    };
    
    this.suites.push(suite);
    
    // Executar função que define os testes
    const originalTest = this.test;
    this.test = (desc, testFn) => {
      suite.tests.push({ description: desc, fn: testFn });
    };
    
    fn();
    this.test = originalTest;
    
    return suite;
  }
  
  // Função test/it para definir testes
  static test(description, fn) {
    const test = {
      description,
      fn,
      status: 'pending'
    };
    
    this.tests.push(test);
    return test;
  }
  
  // Alias para test
  static it = this.test;
  
  // Hooks de ciclo de vida
  static beforeEach(fn) {
    console.log('🔄 beforeEach registrado');
  }
  
  static afterEach(fn) {
    console.log('🔄 afterEach registrado');
  }
  
  static beforeAll(fn) {
    console.log('🔄 beforeAll registrado');
  }
  
  static afterAll(fn) {
    console.log('🔄 afterAll registrado');
  }
  
  // Executar todos os testes
  static async runTests() {
    console.log('\n🧪 EXECUTANDO TESTES\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const suite of this.suites) {
      console.log(`\n📁 ${suite.description}`);
      
      for (const test of suite.tests) {
        try {
          console.log(`  ⏳ ${test.description}`);
          await test.fn();
          console.log(`  ✅ ${test.description}`);
          test.status = 'passed';
          passed++;
        } catch (error) {
          console.log(`  ❌ ${test.description}`);
          console.log(`     ${error.message}`);
          test.status = 'failed';
          failed++;
        }
      }
    }
    
    // Executar testes individuais
    for (const test of this.tests) {
      try {
        console.log(`⏳ ${test.description}`);
        await test.fn();
        console.log(`✅ ${test.description}`);
        test.status = 'passed';
        passed++;
      } catch (error) {
        console.log(`❌ ${test.description}`);
        console.log(`   ${error.message}`);
        test.status = 'failed';
        failed++;
      }
    }
    
    console.log(`\n📊 RESULTADOS:`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`📈 Taxa de sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  }
  
  // Sistema de expectations
  static expect(actual) {
    return {
      toBe(expected) {
        if (actual !== expected) {
          throw new Error(`Esperado ${expected}, recebido ${actual}`);
        }
      },
      
      toEqual(expected) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          throw new Error(`Esperado ${JSON.stringify(expected)}, recebido ${JSON.stringify(actual)}`);
        }
      },
      
      toBeTruthy() {
        if (!actual) {
          throw new Error(`Esperado valor truthy, recebido ${actual}`);
        }
      },
      
      toBeFalsy() {
        if (actual) {
          throw new Error(`Esperado valor falsy, recebido ${actual}`);
        }
      },
      
      toThrow(expectedError) {
        try {
          actual();
          throw new Error('Esperado que a função lance um erro');
        } catch (error) {
          if (expectedError && !error.message.includes(expectedError)) {
            throw new Error(`Esperado erro contendo "${expectedError}", recebido "${error.message}"`);
          }
        }
      },
      
      toHaveBeenCalled() {
        if (!actual._isMockFunction) {
          throw new Error('Esperado uma função mock');
        }
        if (actual._calls.length === 0) {
          throw new Error('Esperado que a função fosse chamada');
        }
      },
      
      toHaveBeenCalledWith(...args) {
        if (!actual._isMockFunction) {
          throw new Error('Esperado uma função mock');
        }
        const found = actual._calls.some(call => 
          JSON.stringify(call) === JSON.stringify(args)
        );
        if (!found) {
          throw new Error(`Esperado chamada com ${JSON.stringify(args)}`);
        }
      }
    };
  }
  
  // Sistema de mocking
  static fn(implementation) {
    const mockFn = function(...args) {
      mockFn._calls.push(args);
      if (mockFn._implementation) {
        return mockFn._implementation(...args);
      }
    };
    
    mockFn._isMockFunction = true;
    mockFn._calls = [];
    mockFn._implementation = implementation;
    
    mockFn.mockReturnValue = function(value) {
      this._implementation = () => value;
      return this;
    };
    
    mockFn.mockResolvedValue = function(value) {
      this._implementation = () => Promise.resolve(value);
      return this;
    };
    
    mockFn.mockRejectedValue = function(error) {
      this._implementation = () => Promise.reject(error);
      return this;
    };
    
    return mockFn;
  }
  
  // Spy em objetos
  static spyOn(object, method) {
    const original = object[method];
    const spy = this.fn(original);
    object[method] = spy;
    
    spy.mockRestore = () => {
      object[method] = original;
    };
    
    return spy;
  }
}

// ===== EXEMPLOS DE TESTES UNITÁRIOS =====

// Funções para testar
class Calculator {
  static add(a, b) {
    return a + b;
  }
  
  static subtract(a, b) {
    return a - b;
  }
  
  static multiply(a, b) {
    return a * b;
  }
  
  static divide(a, b) {
    if (b === 0) {
      throw new Error('Divisão por zero não é permitida');
    }
    return a / b;
  }
}

class UserService {
  constructor(database) {
    this.database = database;
  }
  
  async createUser(userData) {
    if (!userData.email) {
      throw new Error('Email é obrigatório');
    }
    
    const existingUser = await this.database.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }
    
    return await this.database.create(userData);
  }
  
  async getUserById(id) {
    if (!id) {
      throw new Error('ID é obrigatório');
    }
    
    return await this.database.findById(id);
  }
}

// Testes unitários
JestSimulator.describe('Calculator', () => {
  JestSimulator.test('deve somar dois números', () => {
    const result = Calculator.add(2, 3);
    JestSimulator.expect(result).toBe(5);
  });
  
  JestSimulator.test('deve subtrair dois números', () => {
    const result = Calculator.subtract(5, 3);
    JestSimulator.expect(result).toBe(2);
  });
  
  JestSimulator.test('deve multiplicar dois números', () => {
    const result = Calculator.multiply(4, 3);
    JestSimulator.expect(result).toBe(12);
  });
  
  JestSimulator.test('deve dividir dois números', () => {
    const result = Calculator.divide(10, 2);
    JestSimulator.expect(result).toBe(5);
  });
  
  JestSimulator.test('deve lançar erro ao dividir por zero', () => {
    JestSimulator.expect(() => Calculator.divide(10, 0)).toThrow('Divisão por zero');
  });
});

JestSimulator.describe('UserService', () => {
  let userService;
  let mockDatabase;
  
  JestSimulator.beforeEach(() => {
    mockDatabase = {
      findByEmail: JestSimulator.fn(),
      findById: JestSimulator.fn(),
      create: JestSimulator.fn()
    };
    userService = new UserService(mockDatabase);
  });
  
  JestSimulator.test('deve criar usuário com dados válidos', async () => {
    const userData = { name: 'João', email: 'joao@exemplo.com' };
    mockDatabase.findByEmail.mockResolvedValue(null);
    mockDatabase.create.mockResolvedValue({ id: 1, ...userData });
    
    const result = await userService.createUser(userData);
    
    JestSimulator.expect(mockDatabase.findByEmail).toHaveBeenCalledWith('joao@exemplo.com');
    JestSimulator.expect(mockDatabase.create).toHaveBeenCalledWith(userData);
    JestSimulator.expect(result).toEqual({ id: 1, ...userData });
  });
  
  JestSimulator.test('deve lançar erro se email já existe', async () => {
    const userData = { name: 'João', email: 'joao@exemplo.com' };
    mockDatabase.findByEmail.mockResolvedValue({ id: 1, email: 'joao@exemplo.com' });
    
    try {
      await userService.createUser(userData);
      throw new Error('Deveria ter lançado erro');
    } catch (error) {
      JestSimulator.expect(error.message).toBe('Email já está em uso');
    }
  });
});

// ===== TESTES DE INTEGRAÇÃO =====

/**
 * SUPERTEST SIMULADO
 * 
 * Supertest é uma biblioteca para testar APIs HTTP
 * Permite fazer requisições e verificar respostas
 */

class SupertestSimulator {
  constructor(app) {
    this.app = app;
  }
  
  get(path) {
    return new RequestBuilder('GET', path, this.app);
  }
  
  post(path) {
    return new RequestBuilder('POST', path, this.app);
  }
  
  put(path) {
    return new RequestBuilder('PUT', path, this.app);
  }
  
  delete(path) {
    return new RequestBuilder('DELETE', path, this.app);
  }
}

class RequestBuilder {
  constructor(method, path, app) {
    this.method = method;
    this.path = path;
    this.app = app;
    this.headers = {};
    this.body = null;
  }
  
  set(header, value) {
    this.headers[header] = value;
    return this;
  }
  
  send(data) {
    this.body = data;
    return this;
  }
  
  expect(statusOrCallback) {
    if (typeof statusOrCallback === 'number') {
      this.expectedStatus = statusOrCallback;
      return this;
    } else {
      // Callback para verificações customizadas
      this.customExpectation = statusOrCallback;
      return this;
    }
  }
  
  async end() {
    console.log(`${this.method} ${this.path}`);
    
    // Simular resposta da API
    const response = {
      status: 200,
      body: { message: 'Sucesso', data: this.body },
      headers: { 'content-type': 'application/json' }
    };
    
    // Verificar status esperado
    if (this.expectedStatus && response.status !== this.expectedStatus) {
      throw new Error(`Esperado status ${this.expectedStatus}, recebido ${response.status}`);
    }
    
    // Executar verificação customizada
    if (this.customExpectation) {
      this.customExpectation(response);
    }
    
    return response;
  }
}

// Aplicação Express simulada
class ExpressAppSimulator {
  constructor() {
    this.routes = new Map();
  }
  
  get(path, handler) {
    this.routes.set(`GET:${path}`, handler);
  }
  
  post(path, handler) {
    this.routes.set(`POST:${path}`, handler);
  }
  
  put(path, handler) {
    this.routes.set(`PUT:${path}`, handler);
  }
  
  delete(path, handler) {
    this.routes.set(`DELETE:${path}`, handler);
  }
}

// Configurar aplicação de teste
const app = new ExpressAppSimulator();
const request = new SupertestSimulator(app);

// Rotas da API
app.get('/api/users', (req, res) => {
  res.json({ users: [{ id: 1, name: 'João' }] });
});

app.post('/api/users', (req, res) => {
  res.status(201).json({ id: 1, ...req.body });
});

// Testes de integração
JestSimulator.describe('API Users', () => {
  JestSimulator.test('GET /api/users deve retornar lista de usuários', async () => {
    const response = await request
      .get('/api/users')
      .expect(200)
      .end();
    
    JestSimulator.expect(response.body.users).toEqual([{ id: 1, name: 'João' }]);
  });
  
  JestSimulator.test('POST /api/users deve criar novo usuário', async () => {
    const userData = { name: 'Maria', email: 'maria@exemplo.com' };
    
    const response = await request
      .post('/api/users')
      .send(userData)
      .expect(201)
      .end();
    
    JestSimulator.expect(response.body).toEqual({ id: 1, ...userData });
  });
});

// ===== DEBUGGING AVANÇADO =====

/**
 * TÉCNICAS DE DEBUGGING
 * 
 * Estratégias para identificar e corrigir problemas
 */

class AdvancedDebugging {
  // Logger estruturado
  static createLogger() {
    return {
      debug: (message, meta = {}) => {
        console.log(`🐛 DEBUG: ${message}`, meta);
      },
      info: (message, meta = {}) => {
        console.log(`ℹ️  INFO: ${message}`, meta);
      },
      warn: (message, meta = {}) => {
        console.log(`⚠️  WARN: ${message}`, meta);
      },
      error: (message, error = null) => {
        console.log(`❌ ERROR: ${message}`);
        if (error) {
          console.log(`Stack: ${error.stack}`);
        }
      }
    };
  }
  
  // Profiling de performance
  static profileFunction(fn, name) {
    return async function(...args) {
      const start = process.hrtime.bigint();
      const startMemory = process.memoryUsage();
      
      try {
        const result = await fn.apply(this, args);
        
        const end = process.hrtime.bigint();
        const endMemory = process.memoryUsage();
        
        const duration = Number(end - start) / 1000000; // Convert to ms
        const memoryDiff = endMemory.heapUsed - startMemory.heapUsed;
        
        console.log(`📊 Profile ${name}:`);
        console.log(`   Tempo: ${duration.toFixed(2)}ms`);
        console.log(`   Memória: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`);
        
        return result;
      } catch (error) {
        console.log(`❌ Erro em ${name}:`, error.message);
        throw error;
      }
    };
  }
  
  // Trace de execução
  static trace(target, methods) {
    methods.forEach(method => {
      const original = target[method];
      target[method] = function(...args) {
        console.log(`🔍 Chamando ${method} com:`, args);
        const result = original.apply(this, args);
        console.log(`🔍 ${method} retornou:`, result);
        return result;
      };
    });
  }
  
  // Monitoramento de recursos
  static monitorResources() {
    const logger = this.createLogger();
    
    setInterval(() => {
      const memory = process.memoryUsage();
      const cpu = process.cpuUsage();
      
      logger.info('Recursos do sistema', {
        memory: {
          rss: `${(memory.rss / 1024 / 1024).toFixed(2)}MB`,
          heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)}MB`
        },
        cpu: {
          user: `${(cpu.user / 1000).toFixed(2)}ms`,
          system: `${(cpu.system / 1000).toFixed(2)}ms`
        }
      });
    }, 10000); // A cada 10 segundos
  }
  
  // Captura de erros não tratados
  static setupErrorHandling() {
    const logger = this.createLogger();
    
    process.on('uncaughtException', (error) => {
      logger.error('Exceção não capturada', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Promise rejeitada não tratada', { reason, promise });
    });
  }
}

// ===== COVERAGE E MÉTRICAS =====

/**
 * SIMULAÇÃO DE COVERAGE
 * 
 * Coverage mede quanto do código é executado pelos testes
 */

class CoverageSimulator {
  static coverage = {
    statements: 0,
    branches: 0,
    functions: 0,
    lines: 0
  };
  
  static files = new Map();
  
  // Instrumentar arquivo para coverage
  static instrument(filename, source) {
    console.log(`📊 Instrumentando ${filename} para coverage`);
    
    // Simular análise de código
    const lines = source.split('\n').length;
    const functions = (source.match(/function|=>/g) || []).length;
    const branches = (source.match(/if|switch|\?|&&|\|\|/g) || []).length;
    const statements = (source.match(/;/g) || []).length;
    
    this.files.set(filename, {
      lines: { total: lines, covered: 0 },
      functions: { total: functions, covered: 0 },
      branches: { total: branches, covered: 0 },
      statements: { total: statements, covered: 0 }
    });
  }
  
  // Gerar relatório de coverage
  static generateReport() {
    console.log('\n📊 RELATÓRIO DE COVERAGE\n');
    
    let totalLines = 0, coveredLines = 0;
    let totalFunctions = 0, coveredFunctions = 0;
    let totalBranches = 0, coveredBranches = 0;
    let totalStatements = 0, coveredStatements = 0;
    
    for (const [filename, data] of this.files) {
      // Simular coverage aleatório
      data.lines.covered = Math.floor(data.lines.total * 0.8);
      data.functions.covered = Math.floor(data.functions.total * 0.9);
      data.branches.covered = Math.floor(data.branches.total * 0.7);
      data.statements.covered = Math.floor(data.statements.total * 0.85);
      
      totalLines += data.lines.total;
      coveredLines += data.lines.covered;
      totalFunctions += data.functions.total;
      coveredFunctions += data.functions.covered;
      totalBranches += data.branches.total;
      coveredBranches += data.branches.covered;
      totalStatements += data.statements.total;
      coveredStatements += data.statements.covered;
      
      const linePercent = ((data.lines.covered / data.lines.total) * 100).toFixed(1);
      console.log(`📄 ${filename}: ${linePercent}% linhas cobertas`);
    }
    
    console.log('\n📈 RESUMO GERAL:');
    console.log(`📏 Linhas: ${((coveredLines / totalLines) * 100).toFixed(1)}% (${coveredLines}/${totalLines})`);
    console.log(`🔧 Funções: ${((coveredFunctions / totalFunctions) * 100).toFixed(1)}% (${coveredFunctions}/${totalFunctions})`);
    console.log(`🌿 Branches: ${((coveredBranches / totalBranches) * 100).toFixed(1)}% (${coveredBranches}/${totalBranches})`);
    console.log(`📝 Statements: ${((coveredStatements / totalStatements) * 100).toFixed(1)}% (${coveredStatements}/${totalStatements})`);
  }
}

// ===== CI/CD PARA TESTES =====

/**
 * PIPELINE DE CI/CD
 * 
 * Automação de testes em pipeline de integração contínua
 */

class CIPipeline {
  static stages = [];
  
  // Adicionar estágio ao pipeline
  static addStage(name, commands) {
    this.stages.push({ name, commands, status: 'pending' });
  }
  
  // Executar pipeline
  static async run() {
    console.log('\n🚀 INICIANDO PIPELINE CI/CD\n');
    
    for (const stage of this.stages) {
      console.log(`📦 Executando estágio: ${stage.name}`);
      stage.status = 'running';
      
      try {
        for (const command of stage.commands) {
          console.log(`   $ ${command}`);
          await this.executeCommand(command);
        }
        
        stage.status = 'success';
        console.log(`✅ Estágio ${stage.name} concluído com sucesso`);
      } catch (error) {
        stage.status = 'failed';
        console.log(`❌ Estágio ${stage.name} falhou: ${error.message}`);
        throw error;
      }
    }
    
    console.log('\n🎉 Pipeline executado com sucesso!');
  }
  
  // Simular execução de comando
  static async executeCommand(command) {
    // Simular tempo de execução
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (command.includes('test')) {
      console.log('     Executando testes...');
    } else if (command.includes('build')) {
      console.log('     Construindo aplicação...');
    } else if (command.includes('deploy')) {
      console.log('     Fazendo deploy...');
    }
  }
}

// Configurar pipeline
CIPipeline.addStage('Install Dependencies', [
  'npm ci',
  'npm audit'
]);

CIPipeline.addStage('Lint and Format', [
  'npm run lint',
  'npm run format:check'
]);

CIPipeline.addStage('Unit Tests', [
  'npm run test:unit',
  'npm run test:coverage'
]);

CIPipeline.addStage('Integration Tests', [
  'npm run test:integration'
]);

CIPipeline.addStage('Build', [
  'npm run build',
  'npm run build:check'
]);

CIPipeline.addStage('E2E Tests', [
  'npm run test:e2e'
]);

CIPipeline.addStage('Deploy', [
  'npm run deploy:staging',
  'npm run test:smoke'
]);

// ===== APLICAÇÃO DE DEMONSTRAÇÃO =====

/**
 * SISTEMA COMPLETO DE TESTES
 * 
 * Demonstra integração de todas as técnicas de teste
 */

class TestingDemo {
  static async initialize() {
    console.log('\n🧪 INICIALIZANDO SISTEMA DE TESTES\n');
    
    // Configurar debugging
    AdvancedDebugging.setupErrorHandling();
    AdvancedDebugging.monitorResources();
    
    // Instrumentar arquivos para coverage
    CoverageSimulator.instrument('calculator.js', 'function add(a, b) { return a + b; }');
    CoverageSimulator.instrument('userService.js', 'class UserService { async createUser() {} }');
    
    console.log('✅ Sistema de testes configurado!');
  }
  
  static async runAllTests() {
    console.log('\n🎯 EXECUTANDO TODOS OS TESTES\n');
    
    try {
      // Executar testes
      await JestSimulator.runTests();
      
      // Gerar relatório de coverage
      CoverageSimulator.generateReport();
      
      // Executar pipeline CI/CD
      await CIPipeline.run();
      
      console.log('\n🎉 Todos os testes executados com sucesso!');
      
    } catch (error) {
      console.error('❌ Falha na execução dos testes:', error.message);
      throw error;
    }
  }
  
  static demonstrateDebugging() {
    console.log('\n🔍 DEMONSTRAÇÃO DE DEBUGGING\n');
    
    const logger = AdvancedDebugging.createLogger();
    
    // Exemplo de função com debugging
    const problematicFunction = AdvancedDebugging.profileFunction(
      async function(data) {
        logger.debug('Processando dados', { dataLength: data.length });
        
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (data.length === 0) {
          throw new Error('Dados vazios não são permitidos');
        }
        
        return data.map(item => item * 2);
      },
      'problematicFunction'
    );
    
    // Testar função
    problematicFunction([1, 2, 3, 4, 5])
      .then(result => logger.info('Resultado processado', { result }))
      .catch(error => logger.error('Erro no processamento', error));
  }
}

// ===== CONCEITOS PRINCIPAIS =====

const conceptosTestes = {
  tipos: {
    unitarios: {
      definicao: 'Testam unidades isoladas de código',
      caracteristicas: ['Rápidos', 'Isolados', 'Determinísticos'],
      ferramentas: ['Jest', 'Mocha', 'Jasmine'],
      exemplos: ['Função pura', 'Método de classe', 'Componente isolado']
    },
    integracao: {
      definicao: 'Testam interação entre componentes',
      caracteristicas: ['Dependências reais', 'Mais complexos'],
      ferramentas: ['Supertest', 'Testing Library', 'Cypress'],
      exemplos: ['API + Banco', 'Módulos integrados']
    },
    e2e: {
      definicao: 'Testam fluxos completos da aplicação',
      caracteristicas: ['Ambiente real', 'Abrangentes', 'Lentos'],
      ferramentas: ['Cypress', 'Playwright', 'Selenium'],
      exemplos: ['Jornada do usuário', 'Fluxos críticos']
    }
  },
  
  estrategias: {
    tdd: {
      nome: 'Test-Driven Development',
      fluxo: ['Red (teste falha)', 'Green (código passa)', 'Refactor (melhoria)'],
      vantagens: ['Design emergente', 'Cobertura garantida', 'Documentação viva']
    },
    bdd: {
      nome: 'Behavior-Driven Development',
      fluxo: ['Given (contexto)', 'When (ação)', 'Then (resultado)'],
      vantagens: ['Linguagem natural', 'Colaboração', 'Foco no comportamento']
    }
  },
  
  metricas: {
    coverage: {
      tipos: ['Statement', 'Branch', 'Function', 'Line'],
      meta: '80% ou mais para código crítico',
      cuidados: ['Coverage não garante qualidade', 'Foco na qualidade dos testes']
    },
    qualidade: {
      indicadores: ['Tempo de execução', 'Flakiness', 'Manutenibilidade'],
      boas_praticas: ['Testes independentes', 'Nomes descritivos', 'Setup/teardown']
    }
  }
};

// ===== EXERCÍCIOS PRÁTICOS =====

const exerciciosTestes = {
  basicos: [
    {
      titulo: 'Configuração de Ambiente',
      descricao: 'Configurar Jest e estrutura de testes',
      tarefas: [
        'Instalar Jest e dependências',
        'Configurar scripts de teste no package.json',
        'Criar estrutura de diretórios de teste',
        'Configurar coverage e relatórios'
      ]
    },
    {
      titulo: 'Testes Unitários Básicos',
      descricao: 'Escrever testes para funções puras',
      tarefas: [
        'Testar funções matemáticas',
        'Testar validações de entrada',
        'Testar tratamento de erros',
        'Usar matchers do Jest'
      ]
    },
    {
      titulo: 'Mocking Básico',
      descricao: 'Usar mocks para isolar dependências',
      tarefas: [
        'Criar mocks de funções',
        'Mockar módulos externos',
        'Verificar chamadas de funções',
        'Testar com diferentes retornos'
      ]
    }
  ],
  
  intermediarios: [
    {
      titulo: 'Testes de Integração',
      descricao: 'Testar APIs e integração com banco',
      tarefas: [
        'Configurar Supertest',
        'Testar endpoints da API',
        'Mockar banco de dados',
        'Testar middleware'
      ]
    },
    {
      titulo: 'Testes Assíncronos',
      descricao: 'Testar código assíncrono e Promises',
      tarefas: [
        'Testar funções async/await',
        'Testar Promises',
        'Testar timeouts e intervals',
        'Testar callbacks'
      ]
    },
    {
      titulo: 'Setup e Teardown',
      descricao: 'Configurar ambiente de teste',
      tarefas: [
        'Usar beforeEach/afterEach',
        'Configurar banco de teste',
        'Limpar dados entre testes',
        'Configurar variáveis de ambiente'
      ]
    }
  ],
  
  avancados: [
    {
      titulo: 'Testes E2E',
      descricao: 'Testes de ponta a ponta com Cypress',
      tarefas: [
        'Configurar Cypress',
        'Testar fluxos de usuário',
        'Testar formulários complexos',
        'Configurar CI/CD para E2E'
      ]
    },
    {
      titulo: 'Performance Testing',
      descricao: 'Testes de carga e performance',
      tarefas: [
        'Configurar testes de carga',
        'Medir tempo de resposta',
        'Testar concorrência',
        'Identificar gargalos'
      ]
    },
    {
      titulo: 'Debugging Avançado',
      descricao: 'Técnicas avançadas de debugging',
      tarefas: [
        'Configurar debugging no VS Code',
        'Usar profiling de memória',
        'Implementar logging estruturado',
        'Monitorar aplicação em produção'
      ]
    }
  ],
  
  projeto: {
    titulo: 'Sistema de Testes Completo',
    descricao: 'Implementar suite completa de testes para API',
    requisitos: [
      'Testes unitários com 90%+ coverage',
      'Testes de integração para todas as rotas',
      'Testes E2E para fluxos críticos',
      'Pipeline CI/CD automatizado',
      'Relatórios de qualidade',
      'Monitoramento de performance',
      'Debugging configurado',
      'Documentação de testes'
    ]
  }
};

// ===== RECURSOS ADICIONAIS =====

const recursosTestes = {
  documentacao: [
    'Jest Documentation: https://jestjs.io/docs/',
    'Mocha Documentation: https://mochajs.org/',
    'Cypress Documentation: https://docs.cypress.io/',
    'Supertest Documentation: https://github.com/visionmedia/supertest',
    'Testing Library: https://testing-library.com/'
  ],
  
  ferramentas: [
    'Jest - Framework de testes JavaScript',
    'Cypress - Testes E2E modernos',
    'Playwright - Automação de browsers',
    'Supertest - Testes de APIs HTTP',
    'Sinon - Mocking e stubbing'
  ],
  
  bibliotecas: [
    'jest - Framework de testes',
    'supertest - Testes de API',
    'cypress - Testes E2E',
    'sinon - Mocks e stubs',
    'nock - Mock de requisições HTTP'
  ],
  
  padroes: [
    'AAA Pattern - Arrange, Act, Assert',
    'Given-When-Then - BDD pattern',
    'Test Doubles - Mocks, Stubs, Fakes',
    'Page Object Model - Organização de testes E2E',
    'Test Data Builders - Criação de dados de teste'
  ]
};

// ===== RESUMO DO MÓDULO =====

const resumoModulo = {
  objetivos: [
    '✅ Dominar diferentes tipos de testes (unitários, integração, E2E)',
    '✅ Configurar e usar frameworks de teste (Jest, Cypress)',
    '✅ Implementar mocking e stubbing eficazes',
    '✅ Aplicar técnicas avançadas de debugging',
    '✅ Configurar pipeline CI/CD para testes',
    '✅ Monitorar qualidade e coverage de código'
  ],
  
  conceitosChave: [
    'Pirâmide de testes',
    'TDD e BDD',
    'Mocking e stubbing',
    'Coverage e métricas',
    'Debugging e profiling',
    'CI/CD e automação'
  ],
  
  habilidades: [
    'Escrever testes eficazes e maintíveis',
    'Debuggar problemas complexos',
    'Configurar ambientes de teste',
    'Automatizar pipeline de qualidade',
    'Monitorar performance de aplicações',
    'Implementar estratégias de teste'
  ],
  
  proximosPassos: [
    'Estudar testes de mutação',
    'Explorar property-based testing',
    'Aprender visual regression testing',
    'Implementar chaos engineering',
    'Estudar observabilidade e monitoring'
  ],
  
  dicas: [
    '🎯 Foque na qualidade, não apenas na quantidade de testes',
    '⚡ Mantenha testes rápidos e independentes',
    '🔍 Use debugging sistemático para resolver problemas',
    '📊 Monitore métricas de qualidade continuamente',
    '🚀 Automatize tudo que for possível no pipeline'
  ]
};

// Função de inicialização
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TestingConcepts,
    JestSimulator,
    SupertestSimulator,
    AdvancedDebugging,
    CoverageSimulator,
    CIPipeline,
    TestingDemo,
    conceptosTestes,
    exerciciosTestes,
    recursosTestes,
    resumoModulo
  };
} else {
  // Executar demonstração no browser
  TestingDemo.initialize().then(() => {
    TestingDemo.demonstrateDebugging();
    return TestingDemo.runAllTests();
  }).catch(console.error);
}

console.log('\n📚 Módulo 3.5: Testes e Debugging carregado com sucesso!');
console.log('🎯 Explore técnicas de teste e debugging avançadas');
console.log('💡 Pratique com Jest, Cypress e ferramentas de qualidade');

// Demonstrar conceitos
TestingConcepts.demonstratePyramid();