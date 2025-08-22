/*
=============================================================================
                    MÓDULO 4: TYPESCRIPT E FERRAMENTAS
                        04 - TESTES AUTOMATIZADOS
=============================================================================

Este arquivo aborda testes automatizados em JavaScript/TypeScript, incluindo
Jest, Testing Library, Cypress, e estratégias de teste para diferentes cenários.

📚 TÓPICOS ABORDADOS:
- Tipos de teste (unitário, integração, E2E)
- Jest: configuração e funcionalidades
- Testing Library: testes de componentes
- Cypress: testes end-to-end
- Mocking e stubbing
- Coverage e métricas
- TDD e BDD

*/

// =============================================================================
// 1. CONCEITOS DE TESTES
// =============================================================================

/*
Testes automatizados são essenciais para garantir qualidade, confiabilidade
e facilitar manutenção do código.

TIPOS DE TESTE:
- Unit Tests: Testam unidades isoladas (funções, classes)
- Integration Tests: Testam interação entre componentes
- End-to-End Tests: Testam fluxos completos da aplicação
- Snapshot Tests: Detectam mudanças não intencionais
- Performance Tests: Verificam performance e otimizações
*/

class TestingConcepts {
  // Demonstração da pirâmide de testes
  static getTestingPyramid() {
    return {
      structure: {
        e2e: {
          percentage: '10%',
          characteristics: [
            'Poucos testes, alto valor',
            'Testam fluxos críticos',
            'Lentos e caros',
            'Detectam problemas de integração'
          ],
          tools: ['Cypress', 'Playwright', 'Selenium']
        },
        
        integration: {
          percentage: '20%',
          characteristics: [
            'Testam interações entre módulos',
            'Verificam APIs e banco de dados',
            'Moderadamente rápidos',
            'Detectam problemas de comunicação'
          ],
          tools: ['Jest', 'Supertest', 'Testing Library']
        },
        
        unit: {
          percentage: '70%',
          characteristics: [
            'Muitos testes, execução rápida',
            'Testam lógica isolada',
            'Feedback imediato',
            'Base sólida para refatoração'
          ],
          tools: ['Jest', 'Vitest', 'Mocha']
        }
      },
      
      benefits: [
        'Detecção precoce de bugs',
        'Documentação viva do código',
        'Facilita refatoração',
        'Aumenta confiança em mudanças',
        'Reduz custos de manutenção'
      ]
    };
  }
  
  // Estratégias de teste
  static getTestingStrategies() {
    return {
      tdd: {
        name: 'Test-Driven Development',
        process: [
          'Red: Escrever teste que falha',
          'Green: Implementar código mínimo',
          'Refactor: Melhorar código mantendo testes'
        ],
        benefits: [
          'Design emergente',
          'Cobertura garantida',
          'Código mais limpo',
          'Menos bugs'
        ]
      },
      
      bdd: {
        name: 'Behavior-Driven Development',
        process: [
          'Given: Estado inicial',
          'When: Ação executada',
          'Then: Resultado esperado'
        ],
        benefits: [
          'Linguagem comum entre equipes',
          'Foco no comportamento',
          'Documentação executável',
          'Alinhamento com negócio'
        ]
      },
      
      aaa: {
        name: 'Arrange-Act-Assert',
        process: [
          'Arrange: Preparar dados e estado',
          'Act: Executar ação a ser testada',
          'Assert: Verificar resultado'
        ],
        benefits: [
          'Estrutura clara',
          'Fácil de entender',
          'Padrão consistente',
          'Manutenção simplificada'
        ]
      }
    };
  }
}

// =============================================================================
// 2. JEST CONFIGURATION E FUNCIONALIDADES
// =============================================================================

/*
Jest é o framework de testes mais popular para JavaScript/TypeScript,
com funcionalidades abrangentes e configuração simples.
*/

class JestConfig {
  // Configuração básica do Jest
  static getBasicConfig() {
    return {
      // jest.config.js
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      
      // Diretórios e arquivos
      roots: ['<rootDir>/src'],
      testMatch: [
        '**/__tests__/**/*.(ts|tsx|js)',
        '**/*.(test|spec).(ts|tsx|js)'
      ],
      
      // Transformações
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest'
      },
      
      // Module mapping
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1'
      },
      
      // Setup files
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      
      // Coverage
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/index.tsx',
        '!src/reportWebVitals.ts'
      ],
      
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      
      // Ignore patterns
      testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/dist/'
      ],
      
      // Module file extensions
      moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
      ]
    };
  }
  
  // Configuração para React
  static getReactConfig() {
    return {
      testEnvironment: 'jsdom',
      
      setupFilesAfterEnv: [
        '@testing-library/jest-dom/extend-expect'
      ],
      
      moduleNameMapping: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
      },
      
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': [
          'babel-jest',
          {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' } }],
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ]
          }
        ]
      }
    };
  }
  
  // Configuração para Node.js
  static getNodeConfig() {
    return {
      testEnvironment: 'node',
      
      roots: ['<rootDir>/src', '<rootDir>/tests'],
      
      testMatch: [
        '**/__tests__/**/*.test.(ts|js)',
        '**/tests/**/*.test.(ts|js)'
      ],
      
      collectCoverageFrom: [
        'src/**/*.{ts,js}',
        '!src/**/*.d.ts',
        '!src/index.ts'
      ],
      
      coverageReporters: [
        'text',
        'lcov',
        'html',
        'json-summary'
      ]
    };
  }
}

// =============================================================================
// 3. TESTES UNITÁRIOS
// =============================================================================

/*
Testes unitários verificam o comportamento de funções e classes isoladamente,
sem dependências externas.
*/

class UnitTestExamples {
  // Exemplo de função para testar
  static createMathUtils() {
    return {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      divide: (a, b) => {
        if (b === 0) {
          throw new Error('Division by zero');
        }
        return a / b;
      },
      
      factorial: (n) => {
        if (n < 0) {
          throw new Error('Factorial of negative number');
        }
        if (n === 0 || n === 1) {
          return 1;
        }
        return n * UnitTestExamples.createMathUtils().factorial(n - 1);
      },
      
      isPrime: (n) => {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) return false;
        }
        return true;
      }
    };
  }
  
  // Testes para MathUtils
  static getMathUtilsTests() {
    return {
      testSuite: 'MathUtils',
      tests: [
        {
          describe: 'add function',
          tests: [
            {
              it: 'should add two positive numbers',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.add(2, 3);
                // expect(result).toBe(5);
                return result === 5;
              }
            },
            {
              it: 'should handle negative numbers',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.add(-2, 3);
                // expect(result).toBe(1);
                return result === 1;
              }
            },
            {
              it: 'should handle zero',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.add(0, 5);
                // expect(result).toBe(5);
                return result === 5;
              }
            }
          ]
        },
        
        {
          describe: 'divide function',
          tests: [
            {
              it: 'should divide two numbers',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.divide(10, 2);
                // expect(result).toBe(5);
                return result === 5;
              }
            },
            {
              it: 'should throw error when dividing by zero',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                try {
                  mathUtils.divide(10, 0);
                  return false; // Should not reach here
                } catch (error) {
                  // expect(error.message).toBe('Division by zero');
                  return error.message === 'Division by zero';
                }
              }
            }
          ]
        },
        
        {
          describe: 'factorial function',
          tests: [
            {
              it: 'should calculate factorial of positive number',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.factorial(5);
                // expect(result).toBe(120);
                return result === 120;
              }
            },
            {
              it: 'should return 1 for factorial of 0',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                const result = mathUtils.factorial(0);
                // expect(result).toBe(1);
                return result === 1;
              }
            },
            {
              it: 'should throw error for negative number',
              test: () => {
                const mathUtils = UnitTestExamples.createMathUtils();
                try {
                  mathUtils.factorial(-1);
                  return false;
                } catch (error) {
                  return error.message === 'Factorial of negative number';
                }
              }
            }
          ]
        }
      ]
    };
  }
  
  // Exemplo de classe para testar
  static createUserService() {
    return class UserService {
      constructor(apiClient) {
        this.apiClient = apiClient;
        this.users = [];
      }
      
      async getUser(id) {
        if (!id) {
          throw new Error('User ID is required');
        }
        
        // Verificar cache primeiro
        const cachedUser = this.users.find(user => user.id === id);
        if (cachedUser) {
          return cachedUser;
        }
        
        // Buscar na API
        const user = await this.apiClient.get(`/users/${id}`);
        this.users.push(user);
        return user;
      }
      
      async createUser(userData) {
        if (!userData.email) {
          throw new Error('Email is required');
        }
        
        if (!this.isValidEmail(userData.email)) {
          throw new Error('Invalid email format');
        }
        
        const user = await this.apiClient.post('/users', userData);
        this.users.push(user);
        return user;
      }
      
      isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }
      
      getUserCount() {
        return this.users.length;
      }
      
      clearCache() {
        this.users = [];
      }
    };
  }
  
  // Testes para UserService
  static getUserServiceTests() {
    return {
      testSuite: 'UserService',
      tests: [
        {
          describe: 'getUser method',
          tests: [
            {
              it: 'should throw error when no ID provided',
              test: async () => {
                const mockApiClient = {
                  get: jest.fn(),
                  post: jest.fn()
                };
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService(mockApiClient);
                
                try {
                  await userService.getUser();
                  return false;
                } catch (error) {
                  return error.message === 'User ID is required';
                }
              }
            },
            {
              it: 'should return cached user if available',
              test: async () => {
                const mockApiClient = {
                  get: jest.fn(),
                  post: jest.fn()
                };
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService(mockApiClient);
                
                // Adicionar usuário ao cache
                const cachedUser = { id: 1, name: 'John', email: 'john@example.com' };
                userService.users.push(cachedUser);
                
                const result = await userService.getUser(1);
                
                // Verificar se não chamou a API
                // expect(mockApiClient.get).not.toHaveBeenCalled();
                // expect(result).toEqual(cachedUser);
                
                return result === cachedUser && !mockApiClient.get.mock?.calls?.length;
              }
            },
            {
              it: 'should fetch user from API if not cached',
              test: async () => {
                const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
                const mockApiClient = {
                  get: jest.fn().mockResolvedValue(mockUser),
                  post: jest.fn()
                };
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService(mockApiClient);
                
                const result = await userService.getUser(1);
                
                // expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');
                // expect(result).toEqual(mockUser);
                // expect(userService.users).toContain(mockUser);
                
                return result === mockUser && userService.users.includes(mockUser);
              }
            }
          ]
        },
        
        {
          describe: 'createUser method',
          tests: [
            {
              it: 'should throw error when email is missing',
              test: async () => {
                const mockApiClient = { get: jest.fn(), post: jest.fn() };
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService(mockApiClient);
                
                try {
                  await userService.createUser({ name: 'John' });
                  return false;
                } catch (error) {
                  return error.message === 'Email is required';
                }
              }
            },
            {
              it: 'should throw error for invalid email',
              test: async () => {
                const mockApiClient = { get: jest.fn(), post: jest.fn() };
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService(mockApiClient);
                
                try {
                  await userService.createUser({ name: 'John', email: 'invalid-email' });
                  return false;
                } catch (error) {
                  return error.message === 'Invalid email format';
                }
              }
            }
          ]
        },
        
        {
          describe: 'isValidEmail method',
          tests: [
            {
              it: 'should return true for valid email',
              test: () => {
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService({});
                
                const validEmails = [
                  'test@example.com',
                  'user.name@domain.co.uk',
                  'user+tag@example.org'
                ];
                
                return validEmails.every(email => userService.isValidEmail(email));
              }
            },
            {
              it: 'should return false for invalid email',
              test: () => {
                const UserService = UnitTestExamples.createUserService();
                const userService = new UserService({});
                
                const invalidEmails = [
                  'invalid-email',
                  '@example.com',
                  'user@',
                  'user@.com',
                  ''
                ];
                
                return invalidEmails.every(email => !userService.isValidEmail(email));
              }
            }
          ]
        }
      ]
    };
  }
}

// =============================================================================
// 4. TESTING LIBRARY - TESTES DE COMPONENTES
// =============================================================================

/*
Testing Library fornece utilitários para testar componentes React
de forma que simula a interação do usuário.
*/

class ComponentTestExamples {
  // Exemplo de componente React para testar
  static createButton() {
    // Simulação de um componente Button
    return {
      name: 'Button',
      props: ['children', 'onClick', 'disabled', 'variant'],
      
      // Simulação da renderização
      render: (props) => {
        const { children, onClick, disabled, variant = 'primary' } = props;
        
        return {
          type: 'button',
          props: {
            className: `btn btn-${variant} ${disabled ? 'disabled' : ''}`,
            onClick: disabled ? undefined : onClick,
            disabled
          },
          children
        };
      }
    };
  }
  
  // Testes para o componente Button
  static getButtonTests() {
    return {
      testSuite: 'Button Component',
      tests: [
        {
          describe: 'rendering',
          tests: [
            {
              it: 'should render button with text',
              test: () => {
                const Button = ComponentTestExamples.createButton();
                const rendered = Button.render({ children: 'Click me' });
                
                // expect(screen.getByRole('button')).toBeInTheDocument();
                // expect(screen.getByText('Click me')).toBeInTheDocument();
                
                return rendered.type === 'button' && rendered.children === 'Click me';
              }
            },
            {
              it: 'should apply correct CSS classes',
              test: () => {
                const Button = ComponentTestExamples.createButton();
                const rendered = Button.render({ 
                  children: 'Test', 
                  variant: 'secondary' 
                });
                
                // expect(screen.getByRole('button')).toHaveClass('btn', 'btn-secondary');
                
                return rendered.props.className.includes('btn-secondary');
              }
            },
            {
              it: 'should be disabled when disabled prop is true',
              test: () => {
                const Button = ComponentTestExamples.createButton();
                const rendered = Button.render({ 
                  children: 'Test', 
                  disabled: true 
                });
                
                // expect(screen.getByRole('button')).toBeDisabled();
                
                return rendered.props.disabled === true;
              }
            }
          ]
        },
        
        {
          describe: 'interactions',
          tests: [
            {
              it: 'should call onClick when clicked',
              test: () => {
                const mockOnClick = jest.fn();
                const Button = ComponentTestExamples.createButton();
                const rendered = Button.render({ 
                  children: 'Test', 
                  onClick: mockOnClick 
                });
                
                // Simular clique
                if (rendered.props.onClick) {
                  rendered.props.onClick();
                }
                
                // expect(mockOnClick).toHaveBeenCalledTimes(1);
                
                return mockOnClick.mock?.calls?.length === 1;
              }
            },
            {
              it: 'should not call onClick when disabled',
              test: () => {
                const mockOnClick = jest.fn();
                const Button = ComponentTestExamples.createButton();
                const rendered = Button.render({ 
                  children: 'Test', 
                  onClick: mockOnClick,
                  disabled: true
                });
                
                // Tentar simular clique (não deve funcionar)
                if (rendered.props.onClick) {
                  rendered.props.onClick();
                }
                
                // expect(mockOnClick).not.toHaveBeenCalled();
                
                return !rendered.props.onClick && mockOnClick.mock?.calls?.length === 0;
              }
            }
          ]
        }
      ]
    };
  }
  
  // Exemplo de componente de formulário
  static createLoginForm() {
    return {
      name: 'LoginForm',
      props: ['onSubmit', 'loading'],
      
      state: {
        email: '',
        password: '',
        errors: {}
      },
      
      validate: function(data) {
        const errors = {};
        
        if (!data.email) {
          errors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          errors.email = 'Email inválido';
        }
        
        if (!data.password) {
          errors.password = 'Senha é obrigatória';
        } else if (data.password.length < 6) {
          errors.password = 'Senha deve ter pelo menos 6 caracteres';
        }
        
        return errors;
      },
      
      handleSubmit: function(data, onSubmit) {
        const errors = this.validate(data);
        
        if (Object.keys(errors).length > 0) {
          return { success: false, errors };
        }
        
        if (onSubmit) {
          onSubmit(data);
        }
        
        return { success: true, data };
      }
    };
  }
  
  // Testes para o formulário de login
  static getLoginFormTests() {
    return {
      testSuite: 'LoginForm Component',
      tests: [
        {
          describe: 'form validation',
          tests: [
            {
              it: 'should show error for empty email',
              test: () => {
                const LoginForm = ComponentTestExamples.createLoginForm();
                const errors = LoginForm.validate({ email: '', password: 'password123' });
                
                // expect(errors.email).toBe('Email é obrigatório');
                
                return errors.email === 'Email é obrigatório';
              }
            },
            {
              it: 'should show error for invalid email',
              test: () => {
                const LoginForm = ComponentTestExamples.createLoginForm();
                const errors = LoginForm.validate({ email: 'invalid-email', password: 'password123' });
                
                return errors.email === 'Email inválido';
              }
            },
            {
              it: 'should show error for short password',
              test: () => {
                const LoginForm = ComponentTestExamples.createLoginForm();
                const errors = LoginForm.validate({ email: 'test@example.com', password: '123' });
                
                return errors.password === 'Senha deve ter pelo menos 6 caracteres';
              }
            },
            {
              it: 'should pass validation with valid data',
              test: () => {
                const LoginForm = ComponentTestExamples.createLoginForm();
                const errors = LoginForm.validate({ 
                  email: 'test@example.com', 
                  password: 'password123' 
                });
                
                return Object.keys(errors).length === 0;
              }
            }
          ]
        },
        
        {
          describe: 'form submission',
          tests: [
            {
              it: 'should call onSubmit with valid data',
              test: () => {
                const mockOnSubmit = jest.fn();
                const LoginForm = ComponentTestExamples.createLoginForm();
                const formData = { email: 'test@example.com', password: 'password123' };
                
                const result = LoginForm.handleSubmit(formData, mockOnSubmit);
                
                return result.success && mockOnSubmit.mock?.calls?.length === 1;
              }
            },
            {
              it: 'should not call onSubmit with invalid data',
              test: () => {
                const mockOnSubmit = jest.fn();
                const LoginForm = ComponentTestExamples.createLoginForm();
                const formData = { email: '', password: '123' };
                
                const result = LoginForm.handleSubmit(formData, mockOnSubmit);
                
                return !result.success && mockOnSubmit.mock?.calls?.length === 0;
              }
            }
          ]
        }
      ]
    };
  }
}

// =============================================================================
// 5. MOCKING E STUBBING
// =============================================================================

/*
Mocking permite isolar unidades de teste substituindo dependências
por implementações controladas.
*/

class MockingExamples {
  // Exemplo de API client para mock
  static createApiClient() {
    return {
      baseURL: 'https://api.example.com',
      
      async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        return response.json();
      },
      
      async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return response.json();
      },
      
      async put(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        return response.json();
      },
      
      async delete(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          method: 'DELETE'
        });
        return response.json();
      }
    };
  }
  
  // Diferentes tipos de mocks
  static getMockTypes() {
    return {
      // Mock simples
      simpleMock: {
        description: 'Substitui função por implementação fake',
        example: {
          original: 'const apiClient = new ApiClient()',
          mocked: 'const apiClient = { get: jest.fn(), post: jest.fn() }'
        }
      },
      
      // Mock com retorno específico
      mockWithReturn: {
        description: 'Mock que retorna valores específicos',
        example: {
          setup: 'apiClient.get.mockResolvedValue({ id: 1, name: "John" })',
          usage: 'const user = await apiClient.get("/users/1")'
        }
      },
      
      // Mock com implementação
      mockWithImplementation: {
        description: 'Mock com lógica customizada',
        example: {
          setup: `
            apiClient.get.mockImplementation((endpoint) => {
              if (endpoint === '/users/1') {
                return Promise.resolve({ id: 1, name: 'John' });
              }
              return Promise.reject(new Error('Not found'));
            })
          `
        }
      },
      
      // Spy
      spy: {
        description: 'Observa chamadas sem alterar comportamento',
        example: {
          setup: 'const spy = jest.spyOn(console, "log")',
          verification: 'expect(spy).toHaveBeenCalledWith("Hello World")'
        }
      },
      
      // Partial mock
      partialMock: {
        description: 'Mock apenas parte de um módulo',
        example: {
          setup: `
            jest.mock('./apiClient', () => ({
              ...jest.requireActual('./apiClient'),
              get: jest.fn()
            }))
          `
        }
      }
    };
  }
  
  // Exemplos práticos de mocking
  static getMockExamples() {
    return {
      // Mock de fetch
      fetchMock: {
        setup: () => {
          global.fetch = jest.fn();
        },
        
        mockSuccess: (data) => {
          global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(data)
          });
        },
        
        mockError: (error) => {
          global.fetch.mockRejectedValue(error);
        },
        
        cleanup: () => {
          global.fetch.mockRestore();
        }
      },
      
      // Mock de localStorage
      localStorageMock: {
        setup: () => {
          const localStorageMock = {
            getItem: jest.fn(),
            setItem: jest.fn(),
            removeItem: jest.fn(),
            clear: jest.fn()
          };
          
          Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
          });
          
          return localStorageMock;
        }
      },
      
      // Mock de Date
      dateMock: {
        setup: (fixedDate) => {
          const mockDate = new Date(fixedDate);
          jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
          return mockDate;
        },
        
        cleanup: () => {
          global.Date.mockRestore();
        }
      },
      
      // Mock de timers
      timerMock: {
        setup: () => {
          jest.useFakeTimers();
        },
        
        advanceTime: (ms) => {
          jest.advanceTimersByTime(ms);
        },
        
        runAllTimers: () => {
          jest.runAllTimers();
        },
        
        cleanup: () => {
          jest.useRealTimers();
        }
      }
    };
  }
  
  // Exemplo de teste com mocks
  static getTestWithMocks() {
    return {
      testSuite: 'Service with API calls',
      
      setup: () => {
        // Mock do fetch
        global.fetch = jest.fn();
        
        // Mock do localStorage
        const localStorageMock = {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn()
        };
        Object.defineProperty(window, 'localStorage', {
          value: localStorageMock
        });
        
        return { fetch: global.fetch, localStorage: localStorageMock };
      },
      
      tests: [
        {
          it: 'should fetch user data successfully',
          test: async () => {
            const mockUser = { id: 1, name: 'John', email: 'john@example.com' };
            
            // Configurar mock
            global.fetch.mockResolvedValue({
              ok: true,
              json: () => Promise.resolve(mockUser)
            });
            
            // Executar função
            const apiClient = MockingExamples.createApiClient();
            const result = await apiClient.get('/users/1');
            
            // Verificações
            // expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1');
            // expect(result).toEqual(mockUser);
            
            return JSON.stringify(result) === JSON.stringify(mockUser);
          }
        },
        
        {
          it: 'should handle API errors',
          test: async () => {
            // Configurar mock para erro
            global.fetch.mockRejectedValue(new Error('Network error'));
            
            const apiClient = MockingExamples.createApiClient();
            
            try {
              await apiClient.get('/users/1');
              return false; // Não deveria chegar aqui
            } catch (error) {
              // expect(error.message).toBe('Network error');
              return error.message === 'Network error';
            }
          }
        }
      ],
      
      cleanup: () => {
        jest.restoreAllMocks();
        delete global.fetch;
      }
    };
  }
}

// =============================================================================
// 6. TESTES END-TO-END COM CYPRESS
// =============================================================================

/*
Cypress permite testar fluxos completos da aplicação,
simulando interações reais do usuário.
*/

class CypressExamples {
  // Configuração básica do Cypress
  static getBasicConfig() {
    return {
      // cypress.config.js
      e2e: {
        baseUrl: 'http://localhost:3000',
        viewportWidth: 1280,
        viewportHeight: 720,
        video: true,
        screenshotOnRunFailure: true,
        
        // Timeouts
        defaultCommandTimeout: 10000,
        requestTimeout: 10000,
        responseTimeout: 10000,
        
        // Folders
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.js',
        fixturesFolder: 'cypress/fixtures',
        
        // Environment variables
        env: {
          apiUrl: 'http://localhost:8080/api',
          testUser: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      },
      
      component: {
        devServer: {
          framework: 'react',
          bundler: 'vite'
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}'
      }
    };
  }
  
  // Comandos customizados
  static getCustomCommands() {
    return {
      // cypress/support/commands.js
      commands: [
        {
          name: 'login',
          implementation: `
            Cypress.Commands.add('login', (email, password) => {
              cy.visit('/login');
              cy.get('[data-testid="email-input"]').type(email);
              cy.get('[data-testid="password-input"]').type(password);
              cy.get('[data-testid="login-button"]').click();
              cy.url().should('include', '/dashboard');
            });
          `
        },
        
        {
          name: 'createUser',
          implementation: `
            Cypress.Commands.add('createUser', (userData) => {
              return cy.request({
                method: 'POST',
                url: '/api/users',
                body: userData
              });
            });
          `
        },
        
        {
          name: 'seedDatabase',
          implementation: `
            Cypress.Commands.add('seedDatabase', () => {
              return cy.task('db:seed');
            });
          `
        },
        
        {
          name: 'getByTestId',
          implementation: `
            Cypress.Commands.add('getByTestId', (testId) => {
              return cy.get(\`[data-testid="\${testId}"]\`);
            });
          `
        }
      ]
    };
  }
  
  // Exemplos de testes E2E
  static getE2ETests() {
    return {
      testSuite: 'User Authentication Flow',
      
      tests: [
        {
          describe: 'Login functionality',
          tests: [
            {
              it: 'should login with valid credentials',
              test: `
                cy.visit('/login');
                
                // Preencher formulário
                cy.getByTestId('email-input').type('user@example.com');
                cy.getByTestId('password-input').type('password123');
                
                // Submeter formulário
                cy.getByTestId('login-button').click();
                
                // Verificar redirecionamento
                cy.url().should('include', '/dashboard');
                
                // Verificar elementos da dashboard
                cy.getByTestId('user-menu').should('be.visible');
                cy.getByTestId('welcome-message').should('contain', 'Bem-vindo');
              `
            },
            
            {
              it: 'should show error for invalid credentials',
              test: `
                cy.visit('/login');
                
                cy.getByTestId('email-input').type('invalid@example.com');
                cy.getByTestId('password-input').type('wrongpassword');
                cy.getByTestId('login-button').click();
                
                // Verificar mensagem de erro
                cy.getByTestId('error-message')
                  .should('be.visible')
                  .and('contain', 'Credenciais inválidas');
                
                // Verificar que não redirecionou
                cy.url().should('include', '/login');
              `
            },
            
            {
              it: 'should validate required fields',
              test: `
                cy.visit('/login');
                
                // Tentar submeter sem preencher
                cy.getByTestId('login-button').click();
                
                // Verificar validação
                cy.getByTestId('email-error')
                  .should('be.visible')
                  .and('contain', 'Email é obrigatório');
                
                cy.getByTestId('password-error')
                  .should('be.visible')
                  .and('contain', 'Senha é obrigatória');
              `
            }
          ]
        },
        
        {
          describe: 'User registration',
          tests: [
            {
              it: 'should register new user successfully',
              test: `
                cy.visit('/register');
                
                // Preencher formulário
                cy.getByTestId('name-input').type('João Silva');
                cy.getByTestId('email-input').type('joao@example.com');
                cy.getByTestId('password-input').type('password123');
                cy.getByTestId('confirm-password-input').type('password123');
                
                // Aceitar termos
                cy.getByTestId('terms-checkbox').check();
                
                // Submeter
                cy.getByTestId('register-button').click();
                
                // Verificar sucesso
                cy.getByTestId('success-message')
                  .should('be.visible')
                  .and('contain', 'Conta criada com sucesso');
                
                // Verificar redirecionamento
                cy.url().should('include', '/login');
              `
            }
          ]
        },
        
        {
          describe: 'Protected routes',
          tests: [
            {
              it: 'should redirect to login when accessing protected route',
              test: `
                // Tentar acessar rota protegida sem estar logado
                cy.visit('/dashboard');
                
                // Verificar redirecionamento
                cy.url().should('include', '/login');
                
                // Verificar mensagem
                cy.getByTestId('redirect-message')
                  .should('contain', 'Faça login para continuar');
              `
            },
            
            {
              it: 'should access protected route after login',
              test: `
                // Fazer login
                cy.login('user@example.com', 'password123');
                
                // Acessar rota protegida
                cy.visit('/profile');
                
                // Verificar acesso
                cy.url().should('include', '/profile');
                cy.getByTestId('profile-form').should('be.visible');
              `
            }
          ]
        }
      ]
    };
  }
  
  // Testes de API
  static getAPITests() {
    return {
      testSuite: 'API Integration Tests',
      
      tests: [
        {
          it: 'should create user via API',
          test: `
            cy.request({
              method: 'POST',
              url: '/api/users',
              body: {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
              }
            }).then((response) => {
              expect(response.status).to.eq(201);
              expect(response.body).to.have.property('id');
              expect(response.body.email).to.eq('test@example.com');
            });
          `
        },
        
        {
          it: 'should get user list',
          test: `
            // Criar alguns usuários primeiro
            cy.createUser({ name: 'User 1', email: 'user1@example.com' });
            cy.createUser({ name: 'User 2', email: 'user2@example.com' });
            
            // Buscar lista
            cy.request('GET', '/api/users').then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body).to.be.an('array');
              expect(response.body.length).to.be.at.least(2);
            });
          `
        }
      ]
    };
  }
}

// =============================================================================
// 7. COVERAGE E MÉTRICAS
// =============================================================================

/*
Coverage mede quanto do código está sendo testado,
ajudando a identificar áreas não cobertas.
*/

class CoverageMetrics {
  // Configuração de coverage
  static getCoverageConfig() {
    return {
      // Jest coverage configuration
      jest: {
        collectCoverage: true,
        collectCoverageFrom: [
          'src/**/*.{js,jsx,ts,tsx}',
          '!src/**/*.d.ts',
          '!src/index.tsx',
          '!src/reportWebVitals.ts',
          '!src/**/*.stories.{js,jsx,ts,tsx}',
          '!src/**/*.test.{js,jsx,ts,tsx}'
        ],
        
        coverageDirectory: 'coverage',
        
        coverageReporters: [
          'text',
          'text-summary',
          'lcov',
          'html',
          'json-summary'
        ],
        
        coverageThreshold: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
          },
          './src/components/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
          },
          './src/utils/': {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95
          }
        }
      },
      
      // NYC (Istanbul) configuration
      nyc: {
        include: ['src/**/*.js', 'src/**/*.ts'],
        exclude: [
          'src/**/*.test.js',
          'src/**/*.spec.js',
          'src/**/*.d.ts'
        ],
        reporter: ['text', 'html', 'lcov'],
        'check-coverage': true,
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    };
  }
  
  // Tipos de métricas de coverage
  static getCoverageTypes() {
    return {
      lines: {
        description: 'Porcentagem de linhas executadas',
        calculation: 'Linhas executadas / Total de linhas',
        target: '80-90%'
      },
      
      functions: {
        description: 'Porcentagem de funções chamadas',
        calculation: 'Funções chamadas / Total de funções',
        target: '80-90%'
      },
      
      branches: {
        description: 'Porcentagem de branches (if/else) testados',
        calculation: 'Branches executados / Total de branches',
        target: '75-85%'
      },
      
      statements: {
        description: 'Porcentagem de statements executados',
        calculation: 'Statements executados / Total de statements',
        target: '80-90%'
      }
    };
  }
  
  // Exemplo de relatório de coverage
  static getCoverageReport() {
    return {
      summary: {
        lines: { total: 1000, covered: 850, percentage: 85 },
        functions: { total: 200, covered: 170, percentage: 85 },
        branches: { total: 300, covered: 240, percentage: 80 },
        statements: { total: 1200, covered: 1020, percentage: 85 }
      },
      
      files: [
        {
          file: 'src/utils/helpers.ts',
          lines: { percentage: 95, uncovered: [45, 67] },
          functions: { percentage: 100, uncovered: [] },
          branches: { percentage: 90, uncovered: [23] },
          statements: { percentage: 95, uncovered: [45, 67] }
        },
        {
          file: 'src/components/Button.tsx',
          lines: { percentage: 80, uncovered: [12, 25, 30] },
          functions: { percentage: 75, uncovered: ['handleError'] },
          branches: { percentage: 70, uncovered: [15, 28] },
          statements: { percentage: 80, uncovered: [12, 25, 30] }
        },
        {
          file: 'src/services/api.ts',
          lines: { percentage: 60, uncovered: [10, 15, 20, 25, 30] },
          functions: { percentage: 50, uncovered: ['handleTimeout', 'retry'] },
          branches: { percentage: 40, uncovered: [8, 12, 18, 22] },
          statements: { percentage: 60, uncovered: [10, 15, 20, 25, 30] }
        }
      ],
      
      recommendations: [
        'Adicionar testes para src/services/api.ts (baixa cobertura)',
        'Testar cenários de erro em src/components/Button.tsx',
        'Cobrir branches não testados em condicionais',
        'Adicionar testes para funções handleTimeout e retry'
      ]
    };
  }
  
  // Métricas de qualidade de testes
  static getTestQualityMetrics() {
    return {
      quantitative: {
        totalTests: 150,
        passingTests: 148,
        failingTests: 2,
        skippedTests: 0,
        testExecutionTime: '15.3s',
        averageTestTime: '102ms'
      },
      
      coverage: {
        overall: 85,
        unit: 90,
        integration: 75,
        e2e: 60
      },
      
      qualitative: {
        testMaintainability: 'Good',
        testReadability: 'Excellent',
        testReliability: 'Good',
        testSpeed: 'Fast'
      },
      
      trends: {
        coverageChange: '+5%',
        testCountChange: '+12 tests',
        executionTimeChange: '-2.1s',
        bugDetectionRate: '95%'
      }
    };
  }
}

// =============================================================================
// 8. APLICAÇÃO DE DEMONSTRAÇÃO
// =============================================================================

/*
Aplicação que demonstra configuração completa de testes
automatizados com diferentes estratégias e ferramentas.
*/

class TestingDemo {
  constructor() {
    this.jestConfig = new JestConfig();
    this.unitTests = new UnitTestExamples();
    this.componentTests = new ComponentTestExamples();
    this.mockingExamples = new MockingExamples();
    this.cypressExamples = new CypressExamples();
    this.coverageMetrics = new CoverageMetrics();
  }
  
  // Configuração completa do ambiente de testes
  setupTestingEnvironment(projectType = 'react-typescript') {
    const configs = {
      // Jest configuration
      jest: this.jestConfig.getBasicConfig(),
      
      // Cypress configuration
      cypress: this.cypressExamples.getBasicConfig(),
      
      // Coverage configuration
      coverage: this.coverageMetrics.getCoverageConfig(),
      
      // Package.json scripts
      scripts: {
        'test': 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        'test:ci': 'jest --ci --coverage --watchAll=false',
        'test:e2e': 'cypress run',
        'test:e2e:open': 'cypress open',
        'test:component': 'cypress run --component',
        'test:all': 'npm run test:coverage && npm run test:e2e'
      },
      
      // Dependencies
      devDependencies: [
        'jest',
        '@testing-library/react',
        '@testing-library/jest-dom',
        '@testing-library/user-event',
        'cypress',
        '@types/jest',
        'jest-environment-jsdom'
      ]
    };
    
    if (projectType.includes('typescript')) {
      configs.jest = { ...configs.jest, ...this.jestConfig.getTypeScriptConfig() };
      configs.devDependencies.push('ts-jest', '@types/testing-library__jest-dom');
    }
    
    if (projectType.includes('react')) {
      configs.jest = { ...configs.jest, ...this.jestConfig.getReactConfig() };
    }
    
    console.log('Configuração completa do ambiente de testes:', configs);
    return configs;
  }
  
  // Executar suite de testes unitários
  runUnitTests() {
    console.log('\n=== EXECUTANDO TESTES UNITÁRIOS ===\n');
    
    const mathTests = this.unitTests.getMathUtilsTests();
    const userServiceTests = this.unitTests.getUserServiceTests();
    
    const results = {
      mathUtils: this.executeTestSuite(mathTests),
      userService: this.executeTestSuite(userServiceTests)
    };
    
    console.log('Resultados dos testes unitários:', results);
    return results;
  }
  
  // Executar testes de componentes
  runComponentTests() {
    console.log('\n=== EXECUTANDO TESTES DE COMPONENTES ===\n');
    
    const buttonTests = this.componentTests.getButtonTests();
    const formTests = this.componentTests.getLoginFormTests();
    
    const results = {
      button: this.executeTestSuite(buttonTests),
      loginForm: this.executeTestSuite(formTests)
    };
    
    console.log('Resultados dos testes de componentes:', results);
    return results;
  }
  
  // Executar testes com mocks
  runMockTests() {
    console.log('\n=== EXECUTANDO TESTES COM MOCKS ===\n');
    
    const mockTests = this.mockingExamples.getTestWithMocks();
    
    // Setup
    const mocks = mockTests.setup();
    
    // Executar testes
    const results = this.executeTestSuite(mockTests);
    
    // Cleanup
    mockTests.cleanup();
    
    console.log('Resultados dos testes com mocks:', results);
    return results;
  }
  
  // Simular execução de testes E2E
  simulateE2ETests() {
    console.log('\n=== SIMULANDO TESTES E2E ===\n');
    
    const e2eTests = this.cypressExamples.getE2ETests();
    const apiTests = this.cypressExamples.getAPITests();
    
    const results = {
      userFlow: {
        total: 6,
        passed: 5,
        failed: 1,
        duration: '45s',
        screenshots: 2,
        videos: 1
      },
      apiIntegration: {
        total: 2,
        passed: 2,
        failed: 0,
        duration: '8s'
      }
    };
    
    console.log('Resultados simulados dos testes E2E:', results);
    return results;
  }
  
  // Gerar relatório de coverage
  generateCoverageReport() {
    console.log('\n=== RELATÓRIO DE COVERAGE ===\n');
    
    const report = this.coverageMetrics.getCoverageReport();
    const qualityMetrics = this.coverageMetrics.getTestQualityMetrics();
    
    console.log('Relatório de coverage:', report);
    console.log('\nMétricas de qualidade:', qualityMetrics);
    
    return { report, qualityMetrics };
  }
  
  // Executar suite de testes (simulação)
  executeTestSuite(testSuite) {
    const results = {
      suiteName: testSuite.testSuite,
      total: 0,
      passed: 0,
      failed: 0,
      duration: 0,
      details: []
    };
    
    if (testSuite.tests) {
      testSuite.tests.forEach(testGroup => {
        if (testGroup.tests) {
          testGroup.tests.forEach(test => {
            results.total++;
            const startTime = Date.now();
            
            try {
              const result = test.test();
              if (result === true || (result && result.then)) {
                results.passed++;
                results.details.push({
                  name: test.it,
                  status: 'passed',
                  duration: Date.now() - startTime
                });
              } else {
                results.failed++;
                results.details.push({
                  name: test.it,
                  status: 'failed',
                  duration: Date.now() - startTime,
                  error: 'Test assertion failed'
                });
              }
            } catch (error) {
              results.failed++;
              results.details.push({
                name: test.it,
                status: 'failed',
                duration: Date.now() - startTime,
                error: error.message
              });
            }
          });
        }
      });
    }
    
    results.duration = results.details.reduce((sum, test) => sum + test.duration, 0);
    return results;
  }
  
  // Executar todos os testes
  runAllTests() {
    console.log('\n🧪 INICIANDO EXECUÇÃO COMPLETA DE TESTES\n');
    
    const startTime = Date.now();
    
    const results = {
      unit: this.runUnitTests(),
      component: this.runComponentTests(),
      mock: this.runMockTests(),
      e2e: this.simulateE2ETests(),
      coverage: this.generateCoverageReport()
    };
    
    const totalTime = Date.now() - startTime;
    
    console.log('\n📊 RESUMO FINAL DOS TESTES');
    console.log('================================');
    console.log(`⏱️  Tempo total: ${totalTime}ms`);
    console.log(`✅ Testes unitários: ${results.unit.mathUtils.passed + results.unit.userService.passed} passou`);
    console.log(`✅ Testes de componentes: ${results.component.button.passed + results.component.loginForm.passed} passou`);
    console.log(`✅ Testes com mocks: ${results.mock.passed} passou`);
    console.log(`✅ Testes E2E: ${results.e2e.userFlow.passed + results.e2e.apiIntegration.passed} passou`);
    console.log(`📈 Coverage geral: ${results.coverage.report.summary.lines.percentage}%`);
    
    return results;
  }
}

// =============================================================================
// 9. ESTRATÉGIAS AVANÇADAS DE TESTE
// =============================================================================

/*
Estratégias avançadas para otimizar e melhorar a qualidade dos testes.
*/

class AdvancedTestingStrategies {
  // Testes de performance
  static getPerformanceTests() {
    return {
      description: 'Testes que verificam performance e otimizações',
      
      examples: [
        {
          name: 'Teste de tempo de execução',
          code: `
            test('should execute function within time limit', () => {
              const start = performance.now();
              
              // Função a ser testada
              const result = expensiveFunction(largeDataSet);
              
              const end = performance.now();
              const executionTime = end - start;
              
              expect(executionTime).toBeLessThan(1000); // 1 segundo
              expect(result).toBeDefined();
            });
          `
        },
        
        {
          name: 'Teste de uso de memória',
          code: `
            test('should not cause memory leaks', () => {
              const initialMemory = process.memoryUsage().heapUsed;
              
              // Executar operação múltiplas vezes
              for (let i = 0; i < 1000; i++) {
                createAndDestroyObjects();
              }
              
              // Forçar garbage collection
              if (global.gc) {
                global.gc();
              }
              
              const finalMemory = process.memoryUsage().heapUsed;
              const memoryIncrease = finalMemory - initialMemory;
              
              expect(memoryIncrease).toBeLessThan(1024 * 1024); // 1MB
            });
          `
        }
      ]
    };
  }
  
  // Testes de acessibilidade
  static getAccessibilityTests() {
    return {
      description: 'Testes que verificam acessibilidade da aplicação',
      
      tools: ['jest-axe', '@testing-library/jest-dom'],
      
      examples: [
        {
          name: 'Teste básico de acessibilidade',
          code: `
            import { axe, toHaveNoViolations } from 'jest-axe';
            
            expect.extend(toHaveNoViolations);
            
            test('should not have accessibility violations', async () => {
              const { container } = render(<MyComponent />);
              const results = await axe(container);
              expect(results).toHaveNoViolations();
            });
          `
        },
        
        {
          name: 'Teste de navegação por teclado',
          code: `
            test('should be navigable by keyboard', () => {
              render(<NavigationMenu />);
              
              const firstItem = screen.getByRole('menuitem', { name: /home/i });
              firstItem.focus();
              
              // Navegar com Tab
              userEvent.tab();
              
              const secondItem = screen.getByRole('menuitem', { name: /about/i });
              expect(secondItem).toHaveFocus();
            });
          `
        }
      ]
    };
  }
  
  // Testes de segurança
  static getSecurityTests() {
    return {
      description: 'Testes que verificam aspectos de segurança',
      
      examples: [
        {
          name: 'Teste de sanitização de input',
          code: `
            test('should sanitize user input', () => {
              const maliciousInput = '<script>alert("XSS")</script>';
              const sanitized = sanitizeInput(maliciousInput);
              
              expect(sanitized).not.toContain('<script>');
              expect(sanitized).not.toContain('alert');
            });
          `
        },
        
        {
          name: 'Teste de validação de autenticação',
          code: `
            test('should reject invalid tokens', async () => {
              const invalidToken = 'invalid.jwt.token';
              
              await expect(validateToken(invalidToken))
                .rejects
                .toThrow('Invalid token');
            });
          `
        }
      ]
    };
  }
  
  // Testes de regressão
  static getRegressionTests() {
    return {
      description: 'Testes que previnem regressões em funcionalidades',
      
      strategies: [
        {
          name: 'Snapshot Testing',
          description: 'Detecta mudanças não intencionais na UI',
          example: `
            test('should match snapshot', () => {
              const tree = renderer
                .create(<MyComponent prop="value" />)
                .toJSON();
              expect(tree).toMatchSnapshot();
            });
          `
        },
        
        {
          name: 'Visual Regression Testing',
          description: 'Detecta mudanças visuais não intencionais',
          example: `
            test('should match visual snapshot', async () => {
              await page.goto('http://localhost:3000/component');
              const screenshot = await page.screenshot();
              expect(screenshot).toMatchImageSnapshot();
            });
          `
        }
      ]
    };
  }
}

// =============================================================================
// 10. RESUMO E RECURSOS ADICIONAIS
// =============================================================================

/*
Resumo completo do módulo de testes automatizados com recursos
para aprofundamento e melhores práticas.
*/

class TestingModuleSummary {
  static getModuleSummary() {
    return {
      title: 'Módulo 4.4 - Testes Automatizados',
      
      objectives: [
        'Compreender tipos e estratégias de teste',
        'Configurar Jest para diferentes cenários',
        'Implementar testes unitários eficazes',
        'Testar componentes React com Testing Library',
        'Utilizar mocking e stubbing adequadamente',
        'Executar testes E2E com Cypress',
        'Medir e interpretar coverage',
        'Aplicar TDD e BDD na prática'
      ],
      
      keyLearnings: [
        'Pirâmide de testes: 70% unit, 20% integration, 10% E2E',
        'Jest como framework principal para JavaScript/TypeScript',
        'Testing Library para testes centrados no usuário',
        'Cypress para testes end-to-end robustos',
        'Mocking para isolar unidades de teste',
        'Coverage como métrica de qualidade',
        'TDD para design emergente',
        'Estratégias avançadas: performance, acessibilidade, segurança'
      ],
      
      bestPractices: [
        'Escrever testes legíveis e mantíveis',
        'Usar nomes descritivos para testes',
        'Seguir padrão AAA (Arrange-Act-Assert)',
        'Manter testes independentes e isolados',
        'Priorizar testes de comportamento sobre implementação',
        'Usar mocks com moderação',
        'Manter coverage alto mas não obsessivo',
        'Executar testes frequentemente',
        'Tratar testes como código de produção'
      ],
      
      tools: {
        testing: ['Jest', 'Vitest', 'Mocha', 'Jasmine'],
        react: ['Testing Library', 'Enzyme'],
        e2e: ['Cypress', 'Playwright', 'Selenium'],
        mocking: ['Jest mocks', 'Sinon', 'MSW'],
        coverage: ['Istanbul', 'NYC', 'C8'],
        accessibility: ['jest-axe', 'axe-core'],
        visual: ['Storybook', 'Chromatic', 'Percy']
      },
      
      nextSteps: [
        'Implementar CI/CD com testes automatizados',
        'Explorar testes de performance',
        'Adicionar testes de acessibilidade',
        'Configurar testes visuais',
        'Estudar property-based testing',
        'Implementar mutation testing'
      ]
    };
  }
  
  static getAdditionalResources() {
    return {
      documentation: [
        {
          name: 'Jest Documentation',
          url: 'https://jestjs.io/docs/getting-started',
          description: 'Documentação oficial do Jest'
        },
        {
          name: 'Testing Library',
          url: 'https://testing-library.com/',
          description: 'Guias e APIs da Testing Library'
        },
        {
          name: 'Cypress Documentation',
          url: 'https://docs.cypress.io/',
          description: 'Documentação completa do Cypress'
        }
      ],
      
      articles: [
        'The Practical Test Pyramid - Martin Fowler',
        'Testing Implementation Details - Kent C. Dodds',
        'Common Testing Mistakes - JavaScript Testing Best Practices',
        'TDD vs BDD: What\'s the Difference?'
      ],
      
      books: [
        'Test-Driven Development by Kent Beck',
        'Growing Object-Oriented Software, Guided by Tests',
        'The Art of Unit Testing by Roy Osherove',
        'Effective Unit Testing by Lasse Koskela'
      ],
      
      courses: [
        'Testing JavaScript with Jest and Testing Library',
        'End-to-End Testing with Cypress',
        'Test-Driven Development Fundamentals',
        'Advanced Testing Strategies'
      ]
    };
  }
}

// =============================================================================
// INICIALIZAÇÃO E DEMONSTRAÇÃO
// =============================================================================

// Função principal para demonstrar o módulo
function initializeTestingModule() {
  console.log('🧪 MÓDULO 4.4 - TESTES AUTOMATIZADOS');
  console.log('=====================================\n');
  
  // Criar instância da demonstração
  const demo = new TestingDemo();
  
  // Configurar ambiente
  console.log('📋 Configurando ambiente de testes...');
  const config = demo.setupTestingEnvironment('react-typescript');
  
  // Executar demonstração completa
  const results = demo.runAllTests();
  
  // Mostrar conceitos
  console.log('\n📚 CONCEITOS DE TESTES');
  const concepts = TestingConcepts.getTestingPyramid();
  console.log('Pirâmide de testes:', concepts.structure);
  
  // Mostrar estratégias avançadas
  console.log('\n🚀 ESTRATÉGIAS AVANÇADAS');
  const advanced = AdvancedTestingStrategies.getPerformanceTests();
  console.log('Testes de performance:', advanced.description);
  
  // Mostrar resumo
  console.log('\n📖 RESUMO DO MÓDULO');
  const summary = TestingModuleSummary.getModuleSummary();
  console.log('Objetivos alcançados:', summary.objectives.length);
  console.log('Ferramentas aprendidas:', Object.keys(summary.tools).length);
  
  // Recursos adicionais
  const resources = TestingModuleSummary.getAdditionalResources();
  console.log('\n📚 RECURSOS PARA ESTUDO');
  console.log(`📖 Documentação: ${resources.documentation.length} links`);
  console.log(`📰 Artigos: ${resources.articles.length} recomendações`);
  console.log(`📚 Livros: ${resources.books.length} sugestões`);
  console.log(`🎓 Cursos: ${resources.courses.length} opções`);
  
  console.log('\n✅ Módulo de Testes Automatizados concluído com sucesso!');
  console.log('🎯 Próximo: Ferramentas de Deploy e CI/CD');
  
  return {
    config,
    results,
    concepts,
    advanced,
    summary,
    resources
  };
}

// Executar se chamado diretamente
if (typeof window === 'undefined' && typeof module !== 'undefined') {
  initializeTestingModule();
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TestingConcepts,
    JestConfig,
    UnitTestExamples,
    ComponentTestExamples,
    MockingExamples,
    CypressExamples,
    CoverageMetrics,
    AdvancedTestingStrategies,
    TestingModuleSummary,
    TestingDemo,
    initializeTestingModule
  };
}