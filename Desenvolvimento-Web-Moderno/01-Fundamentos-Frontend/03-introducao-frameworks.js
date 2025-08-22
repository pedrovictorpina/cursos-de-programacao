// =============================================================================
// MÓDULO 1: FUNDAMENTOS FRONTEND - INTRODUÇÃO AOS FRAMEWORKS
// =============================================================================

/**
 * 🏗️ INTRODUÇÃO PRÁTICA AOS FRAMEWORKS MODERNOS
 * 
 * Este arquivo aborda:
 * • Conceitos fundamentais de frameworks
 * • Implementação prática em React, Vue e Angular
 * • Comparação hands-on entre abordagens
 * • Padrões comuns e diferenças
 * • Migração entre frameworks
 */

// =============================================================================
// 1. CONCEITOS FUNDAMENTAIS DE FRAMEWORKS
// =============================================================================

/**
 * 🧩 SISTEMA DE COMPONENTES UNIVERSAL
 * 
 * Demonstra conceitos que são comuns a todos os frameworks modernos
 */
class UniversalComponentConcepts {
    constructor() {
        this.concepts = new Map();
        this.patterns = new Map();
        this.examples = new Map();
        
        this.initializeConcepts();
    }

    /**
     * Inicializa conceitos fundamentais
     */
    initializeConcepts() {
        this.setupComponentBasics();
        this.setupStateManagement();
        this.setupLifecycle();
        this.setupEventHandling();
        this.setupDataFlow();
    }

    /**
     * Conceitos básicos de componentes
     */
    setupComponentBasics() {
        const componentBasics = {
            definition: 'Unidade reutilizável de UI que encapsula estrutura, estilo e comportamento',
            
            characteristics: {
                encapsulation: 'Isolamento de responsabilidades',
                reusability: 'Reutilização em diferentes contextos',
                composability: 'Combinação para formar UIs complexas',
                testability: 'Facilidade para testes unitários'
            },
            
            anatomy: {
                template: 'Estrutura HTML/JSX do componente',
                logic: 'JavaScript para comportamento',
                styles: 'CSS para apresentação',
                props: 'Dados de entrada',
                state: 'Estado interno',
                events: 'Comunicação com outros componentes'
            },
            
            types: {
                presentational: {
                    description: 'Componentes focados na apresentação',
                    characteristics: ['Recebem dados via props', 'Não gerenciam estado', 'Puramente visuais'],
                    example: 'Button, Card, Avatar'
                },
                container: {
                    description: 'Componentes que gerenciam lógica e estado',
                    characteristics: ['Gerenciam estado', 'Fazem requisições', 'Coordenam outros componentes'],
                    example: 'UserProfile, ProductList, ShoppingCart'
                },
                layout: {
                    description: 'Componentes estruturais',
                    characteristics: ['Definem layout', 'Organizam outros componentes', 'Responsivos'],
                    example: 'Header, Sidebar, Grid'
                }
            }
        };
        
        this.concepts.set('components', componentBasics);
    }

    /**
     * Gerenciamento de estado
     */
    setupStateManagement() {
        const stateManagement = {
            definition: 'Controle e sincronização de dados na aplicação',
            
            levels: {
                local: {
                    description: 'Estado interno do componente',
                    when: 'Dados que só afetam um componente',
                    examples: ['Form inputs', 'Toggle states', 'Loading states']
                },
                shared: {
                    description: 'Estado compartilhado entre componentes',
                    when: 'Dados que afetam múltiplos componentes',
                    examples: ['User authentication', 'Shopping cart', 'Theme preferences']
                },
                global: {
                    description: 'Estado da aplicação inteira',
                    when: 'Dados que afetam toda a aplicação',
                    examples: ['User session', 'App configuration', 'Cache global']
                }
            },
            
            patterns: {
                unidirectional: {
                    description: 'Fluxo de dados em uma direção',
                    benefits: ['Previsibilidade', 'Debug mais fácil', 'Menos bugs'],
                    flow: 'Action → State → View → Action'
                },
                immutable: {
                    description: 'Estado nunca é modificado diretamente',
                    benefits: ['Rastreabilidade', 'Time travel debugging', 'Performance'],
                    approach: 'Criar novo estado ao invés de modificar'
                }
            },
            
            solutions: {
                react: ['useState', 'useReducer', 'Context API', 'Redux', 'Zustand'],
                vue: ['data', 'computed', 'Vuex', 'Pinia'],
                angular: ['Services', 'NgRx', 'Akita']
            }
        };
        
        this.concepts.set('state', stateManagement);
    }

    /**
     * Ciclo de vida dos componentes
     */
    setupLifecycle() {
        const lifecycle = {
            definition: 'Fases que um componente passa desde criação até destruição',
            
            phases: {
                mounting: {
                    description: 'Componente sendo criado e inserido no DOM',
                    events: ['constructor', 'render', 'componentDidMount'],
                    uses: ['Inicialização', 'Requisições API', 'Setup de listeners']
                },
                updating: {
                    description: 'Componente sendo re-renderizado',
                    events: ['render', 'componentDidUpdate'],
                    uses: ['Responder a mudanças', 'Atualizações condicionais']
                },
                unmounting: {
                    description: 'Componente sendo removido do DOM',
                    events: ['componentWillUnmount'],
                    uses: ['Cleanup', 'Remover listeners', 'Cancelar requisições']
                }
            },
            
            modernApproach: {
                react: 'useEffect hook',
                vue: 'Composition API lifecycle hooks',
                angular: 'Lifecycle interfaces'
            },
            
            commonPatterns: {
                dataFetching: 'Buscar dados quando componente monta',
                cleanup: 'Limpar recursos quando componente desmonta',
                subscription: 'Gerenciar inscrições em observables',
                optimization: 'Evitar re-renders desnecessários'
            }
        };
        
        this.concepts.set('lifecycle', lifecycle);
    }

    /**
     * Manipulação de eventos
     */
    setupEventHandling() {
        const eventHandling = {
            definition: 'Resposta a interações do usuário e eventos do sistema',
            
            types: {
                user: {
                    description: 'Eventos gerados pelo usuário',
                    examples: ['click', 'input', 'submit', 'scroll', 'resize']
                },
                system: {
                    description: 'Eventos do sistema ou aplicação',
                    examples: ['load', 'error', 'timeout', 'network']
                },
                custom: {
                    description: 'Eventos personalizados da aplicação',
                    examples: ['user-login', 'cart-update', 'theme-change']
                }
            },
            
            patterns: {
                delegation: {
                    description: 'Usar um listener pai para múltiplos elementos',
                    benefits: ['Performance', 'Menos listeners', 'Elementos dinâmicos']
                },
                debouncing: {
                    description: 'Atrasar execução até parar de receber eventos',
                    uses: ['Search input', 'Resize handlers', 'API calls']
                },
                throttling: {
                    description: 'Limitar frequência de execução',
                    uses: ['Scroll handlers', 'Mouse move', 'Animation frames']
                }
            },
            
            bestPractices: [
                'Sempre remover listeners no cleanup',
                'Usar passive listeners quando possível',
                'Evitar inline handlers em loops',
                'Considerar performance em eventos frequentes',
                'Usar preventDefault() quando necessário'
            ]
        };
        
        this.concepts.set('events', eventHandling);
    }

    /**
     * Fluxo de dados
     */
    setupDataFlow() {
        const dataFlow = {
            definition: 'Como dados fluem através da aplicação',
            
            directions: {
                topDown: {
                    description: 'Dados fluem de componentes pais para filhos',
                    mechanism: 'Props/Attributes',
                    benefits: ['Previsível', 'Fácil de rastrear', 'Testável']
                },
                bottomUp: {
                    description: 'Eventos fluem de componentes filhos para pais',
                    mechanism: 'Events/Callbacks',
                    benefits: ['Desacoplamento', 'Reutilização', 'Flexibilidade']
                },
                lateral: {
                    description: 'Comunicação entre componentes irmãos',
                    mechanism: 'Shared state/Event bus',
                    benefits: ['Comunicação direta', 'Menos prop drilling']
                }
            },
            
            antiPatterns: {
                propDrilling: {
                    description: 'Passar props através de muitos níveis',
                    problem: 'Componentes intermediários recebem props que não usam',
                    solutions: ['Context API', 'State management', 'Component composition']
                },
                tightCoupling: {
                    description: 'Componentes muito dependentes entre si',
                    problem: 'Dificulta reutilização e testes',
                    solutions: ['Dependency injection', 'Event-driven architecture']
                }
            },
            
            patterns: {
                containerPresentation: 'Separar lógica de apresentação',
                renderProps: 'Compartilhar lógica através de render functions',
                higherOrderComponents: 'Envolver componentes com funcionalidade adicional',
                hooks: 'Reutilizar lógica stateful entre componentes'
            }
        };
        
        this.concepts.set('dataFlow', dataFlow);
    }

    /**
     * Gera relatório dos conceitos
     */
    generateConceptsReport() {
        const report = {
            timestamp: new Date().toISOString(),
            concepts: Object.fromEntries(this.concepts),
            summary: {
                totalConcepts: this.concepts.size,
                keyTakeaways: [
                    'Componentes são a base de frameworks modernos',
                    'Estado deve ser gerenciado de forma previsível',
                    'Ciclo de vida permite controle fino sobre componentes',
                    'Eventos conectam UI com lógica de negócio',
                    'Fluxo de dados unidirecional simplifica debugging'
                ]
            }
        };
        
        console.log('📚 Relatório de Conceitos Fundamentais:', report);
        return report;
    }
}

// =============================================================================
// 2. IMPLEMENTAÇÃO PRÁTICA - REACT
// =============================================================================

/**
 * ⚛️ IMPLEMENTAÇÕES REACT
 * 
 * Exemplos práticos usando React com hooks modernos
 */
class ReactImplementations {
    constructor() {
        this.components = new Map();
        this.hooks = new Map();
        this.patterns = new Map();
        
        this.setupReactExamples();
    }

    /**
     * Configura exemplos React
     */
    setupReactExamples() {
        this.createBasicComponents();
        this.createCustomHooks();
        this.createAdvancedPatterns();
    }

    /**
     * Componentes básicos React
     */
    createBasicComponents() {
        const basicComponents = {
            // Componente funcional simples
            simpleButton: `import React from 'react';

function Button({ children, onClick, variant = 'primary', disabled = false }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;`,

            // Componente com estado local
            counter: `import React, { useState } from 'react';
import Button from './Button';

function Counter({ initialValue = 0, step = 1 }) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + step);
  const decrement = () => setCount(prev => prev - step);
  const reset = () => setCount(initialValue);
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Contador</h2>
      <div className="text-3xl font-mono mb-4 text-center">{count}</div>
      <div className="flex gap-2 justify-center">
        <Button onClick={decrement}>-{step}</Button>
        <Button onClick={reset} variant="outline">Reset</Button>
        <Button onClick={increment}>+{step}</Button>
      </div>
    </div>
  );
}

export default Counter;`,

            // Componente com efeitos
            userProfile: `import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const userData = await response.json();
        
        if (!cancelled) {
          setUser(userData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    if (userId) {
      fetchUser();
    }
    
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  if (loading) return <div className="animate-pulse">Carregando...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (!user) return <div>Usuário não encontrado</div>;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <img 
        src={user.avatar} 
        alt={user.name}
        className="w-16 h-16 rounded-full mx-auto mb-4"
      />
      <h2 className="text-xl font-bold text-center">{user.name}</h2>
      <p className="text-gray-600 text-center">{user.email}</p>
      <p className="text-sm text-gray-500 text-center mt-2">
        Membro desde {new Date(user.joinDate).toLocaleDateString()}
      </p>
    </div>
  );
}

export default UserProfile;`,

            // Componente com Context
            themeProvider: `import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Componente que usa o tema
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border"
      aria-label={\`Switch to \${theme === 'light' ? 'dark' : 'light'} theme\`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}`
        };
        
        this.components.set('react', basicComponents);
    }

    /**
     * Custom Hooks React
     */
    createCustomHooks() {
        const customHooks = {
            // Hook para requisições
            useFetch: `import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url, JSON.stringify(options)]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch };
}

export default useFetch;`,

            // Hook para localStorage
            useLocalStorage: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Função para ler valor do localStorage
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState(readValue);
  
  // Função para atualizar valor
  const setValue = (value) => {
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      setStoredValue(newValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error);
    }
  };
  
  // Escutar mudanças no localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  return [storedValue, setValue];
}

export default useLocalStorage;`,

            // Hook para debounce
            useDebounce: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Exemplo de uso
function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    if (debouncedSearchTerm) {
      // Fazer busca
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Digite para buscar..."
      className="w-full p-2 border rounded"
    />
  );
}

export default useDebounce;`,

            // Hook para media queries
            useMediaQuery: `import { useState, useEffect } from 'react';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    mediaQuery.addListener(handleChange);
    
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [query]);
  
  return matches;
}

// Hooks específicos para breakpoints comuns
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useMediaQuery;`
        };
        
        this.hooks.set('react', customHooks);
    }

    /**
     * Padrões avançados React
     */
    createAdvancedPatterns() {
        const advancedPatterns = {
            // Higher Order Component
            withLoading: `import React from 'react';

function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Carregando...</span>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}

// Uso
const UserListWithLoading = withLoading(UserList);

// No componente pai
<UserListWithLoading loading={isLoading} users={users} />`,

            // Render Props
            dataProvider: `import React, { useState, useEffect } from 'react';

function DataProvider({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [url]);
  
  return children({ data, loading, error });
}

// Uso
<DataProvider url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;
    return <UserList users={data} />;
  }}
</DataProvider>`,

            // Compound Components
            modal: `import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

function Modal({ children, isOpen, onClose }) {
  const value = { isOpen, onClose };
  
  if (!isOpen) return null;
  
  return (
    <ModalContext.Provider value={value}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

Modal.Header = function ModalHeader({ children }) {
  const { onClose } = useContext(ModalContext);
  
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">{children}</h2>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        ✕
      </button>
    </div>
  );
};

Modal.Body = function ModalBody({ children }) {
  return <div className="p-4">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }) {
  return <div className="flex justify-end gap-2 p-4 border-t">{children}</div>;
};

// Uso
<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
  <Modal.Header>Confirmar Ação</Modal.Header>
  <Modal.Body>
    <p>Tem certeza que deseja continuar?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
    <Button onClick={handleConfirm}>Confirmar</Button>
  </Modal.Footer>
</Modal>`,

            // Error Boundary
            errorBoundary: `import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log do erro para serviço de monitoramento
    console.error('Error Boundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="text-red-500 text-2xl mr-3">⚠️</div>
              <h1 className="text-xl font-semibold text-gray-900">Oops! Algo deu errado</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Nossa equipe foi notificada.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm text-gray-500">Detalhes técnicos</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;`
        };
        
        this.patterns.set('react', advancedPatterns);
    }

    /**
     * Gera aplicação React completa
     */
    generateReactApp() {
        const app = {
            'App.jsx': `import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <MainContent />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;`,
            
            'main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
            
            'package.json': {
                name: 'react-modern-app',
                version: '1.0.0',
                type: 'module',
                scripts: {
                    dev: 'vite',
                    build: 'vite build',
                    preview: 'vite preview',
                    lint: 'eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0'
                },
                dependencies: {
                    react: '^18.2.0',
                    'react-dom': '^18.2.0'
                },
                devDependencies: {
                    '@types/react': '^18.2.15',
                    '@types/react-dom': '^18.2.7',
                    '@vitejs/plugin-react': '^4.0.3',
                    eslint: '^8.45.0',
                    'eslint-plugin-react': '^7.32.2',
                    'eslint-plugin-react-hooks': '^4.6.0',
                    'eslint-plugin-react-refresh': '^0.4.3',
                    vite: '^4.4.5'
                }
            }
        };
        
        console.log('⚛️ Aplicação React Gerada:', app);
        return app;
    }
}

// =============================================================================
// 3. IMPLEMENTAÇÃO PRÁTICA - VUE
// =============================================================================

/**
 * 🟢 IMPLEMENTAÇÕES VUE
 * 
 * Exemplos práticos usando Vue 3 com Composition API
 */
class VueImplementations {
    constructor() {
        this.components = new Map();
        this.composables = new Map();
        this.patterns = new Map();
        
        this.setupVueExamples();
    }

    /**
     * Configura exemplos Vue
     */
    setupVueExamples() {
        this.createBasicComponents();
        this.createComposables();
        this.createAdvancedPatterns();
    }

    /**
     * Componentes básicos Vue
     */
    createBasicComponents() {
        const basicComponents = {
            // Componente simples
            simpleButton: `<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors'
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50'
  }
  
  return [
    baseClasses,
    variantClasses[props.variant],
    props.disabled && 'opacity-50 cursor-not-allowed'
  ].filter(Boolean).join(' ')
})

const handleClick = (event) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>`,

            // Componente com estado
            counter: `<template>
  <div class="p-4 border rounded-lg">
    <h2 class="text-xl font-bold mb-4">Contador</h2>
    <div class="text-3xl font-mono mb-4 text-center">{{ count }}</div>
    <div class="flex gap-2 justify-center">
      <BaseButton @click="decrement">-{{ step }}</BaseButton>
      <BaseButton @click="reset" variant="outline">Reset</BaseButton>
      <BaseButton @click="increment">+{{ step }}</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  initialValue: {
    type: Number,
    default: 0
  },
  step: {
    type: Number,
    default: 1
  }
})

const count = ref(props.initialValue)

const increment = () => {
  count.value += props.step
}

const decrement = () => {
  count.value -= props.step
}

const reset = () => {
  count.value = props.initialValue
}
</script>`,

            // Componente com requisições
            userProfile: `<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div v-if="loading" class="animate-pulse">
      Carregando...
    </div>
    
    <div v-else-if="error" class="text-red-500">
      Erro: {{ error }}
    </div>
    
    <div v-else-if="user">
      <img 
        :src="user.avatar" 
        :alt="user.name"
        class="w-16 h-16 rounded-full mx-auto mb-4"
      />
      <h2 class="text-xl font-bold text-center">{{ user.name }}</h2>
      <p class="text-gray-600 text-center">{{ user.email }}</p>
      <p class="text-sm text-gray-500 text-center mt-2">
        Membro desde {{ formatDate(user.joinDate) }}
      </p>
    </div>
    
    <div v-else>
      Usuário não encontrado
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
})

const { data: user, loading, error, execute } = useFetch(
  computed(() => \`/api/users/\${props.userId}\`)
)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

// Reexecutar quando userId mudar
watch(() => props.userId, () => {
  if (props.userId) {
    execute()
  }
}, { immediate: true })
</script>`,

            // Componente com provide/inject
            themeProvider: `<template>
  <div :data-theme="theme">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'

const theme = ref('light')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const isLight = computed(() => theme.value === 'light')
const isDark = computed(() => theme.value === 'dark')

// Persistir tema no localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.value = savedTheme
  }
})

watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
  document.documentElement.setAttribute('data-theme', newTheme)
})

// Prover tema para componentes filhos
provide('theme', {
  theme,
  toggleTheme,
  isLight,
  isDark
})
</script>

<!-- Componente que usa o tema -->
<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-lg border"
    :aria-label="\`Switch to \${theme === 'light' ? 'dark' : 'light'} theme\`"
  >
    {{ theme === 'light' ? '🌙' : '☀️' }}
  </button>
</template>

<script setup>
import { inject } from 'vue'

const { theme, toggleTheme } = inject('theme')
</script>`
        };
        
        this.components.set('vue', basicComponents);
    }

    /**
     * Composables Vue
     */
    createComposables() {
        const composables = {
            // Composable para requisições
            useFetch: `import { ref, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const execute = async () => {
    try {
      loading.value = true
      error.value = null
      
      const response = await fetch(unref(url))
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }
      
      const result = await response.json()
      data.value = result
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  // Auto-executar quando URL mudar
  watchEffect(() => {
    if (unref(url)) {
      execute()
    }
  })
  
  return { data, loading, error, execute }
}`,

            // Composable para localStorage
            useLocalStorage: `import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const read = () => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":\`, error)
      return defaultValue
    }
  }
  
  const storedValue = ref(read())
  
  const write = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":\`, error)
    }
  }
  
  // Sincronizar com localStorage
  watch(storedValue, write, { deep: true })
  
  // Escutar mudanças externas
  window.addEventListener('storage', (e) => {
    if (e.key === key && e.newValue !== null) {
      storedValue.value = JSON.parse(e.newValue)
    }
  })
  
  return storedValue
}`,

            // Composable para debounce
            useDebounce: `import { ref, watch } from 'vue'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  
  watch(value, (newValue) => {
    const timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
    
    return () => clearTimeout(timeout)
  })
  
  return debouncedValue
}

// Exemplo de uso
<template>
  <input
    v-model="searchTerm"
    type="text"
    placeholder="Digite para buscar..."
    class="w-full p-2 border rounded"
  />
  <p>Termo de busca: {{ debouncedSearchTerm }}</p>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm, 300)

watch(debouncedSearchTerm, (newTerm) => {
  if (newTerm) {
    console.log('Searching for:', newTerm)
    // Fazer busca
  }
})
</script>`,

            // Composable para media queries
            useMediaQuery: `import { ref, onMounted, onUnmounted } from 'vue'

export function useMediaQuery(query) {
  const matches = ref(false)
  let mediaQuery
  
  const updateMatches = (event) => {
    matches.value = event.matches
  }
  
  onMounted(() => {
    mediaQuery = window.matchMedia(query)
    matches.value = mediaQuery.matches
    mediaQuery.addListener(updateMatches)
  })
  
  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeListener(updateMatches)
    }
  })
  
  return matches
}

// Composables específicos
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const useIsDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)')`
        };
        
        this.composables.set('vue', composables);
    }

    /**
     * Padrões avançados Vue
     */
    createAdvancedPatterns() {
        const advancedPatterns = {
            // Plugin personalizado
            customPlugin: `// plugins/toast.js
import { ref, reactive } from 'vue'

const toasts = ref([])
let id = 0

const addToast = (message, type = 'info', duration = 3000) => {
  const toast = {
    id: ++id,
    message,
    type,
    duration
  }
  
  toasts.value.push(toast)
  
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast.id)
    }, duration)
  }
  
  return toast.id
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

export default {
  install(app) {
    app.config.globalProperties.$toast = {
      success: (message, duration) => addToast(message, 'success', duration),
      error: (message, duration) => addToast(message, 'error', duration),
      warning: (message, duration) => addToast(message, 'warning', duration),
      info: (message, duration) => addToast(message, 'info', duration)
    }
    
    app.provide('toasts', toasts)
    app.provide('removeToast', removeToast)
  }
}`,

            // Diretiva personalizada
            customDirective: `// directives/focus.js
export default {
  mounted(el, binding) {
    if (binding.value !== false) {
      el.focus()
    }
  },
  updated(el, binding) {
    if (binding.value && !binding.oldValue) {
      el.focus()
    }
  }
}

// Uso
<template>
  <input v-focus="shouldFocus" type="text" />
</template>

// Diretiva de click outside
export const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Uso
<template>
  <div v-click-outside="closeDropdown" class="dropdown">
    <!-- conteúdo do dropdown -->
  </div>
</template>`,

            // Renderless Component
            renderlessComponent: `<template>
  <slot
    :data="data"
    :loading="loading"
    :error="error"
    :refetch="execute"
  />
</template>

<script setup>
import { useFetch } from '@/composables/useFetch'

const props = defineProps({
  url: {
    type: String,
    required: true
  }
})

const { data, loading, error, execute } = useFetch(() => props.url)
</script>

<!-- Uso -->
<template>
  <DataProvider url="/api/users">
    <template #default="{ data, loading, error }">
      <div v-if="loading">Carregando...</div>
      <div v-else-if="error">Erro: {{ error }}</div>
      <UserList v-else :users="data" />
    </template>
  </DataProvider>
</template>`,

            // Teleport avançado
            modalSystem: `<!-- Modal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <header v-if="$slots.header" class="modal-header">
            <slot name="header" />
            <button @click="closeModal" class="close-button">×</button>
          </header>
          
          <main class="modal-body">
            <slot />
          </main>
          
          <footer v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const closeModal = () => {
  emit('update:modelValue', false)
}

// Prevenir scroll do body quando modal está aberto
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>`
        };
        
        this.patterns.set('vue', advancedPatterns);
    }

    /**
     * Gera aplicação Vue completa
     */
    generateVueApp() {
        const app = {
            'main.js': `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style.css'

// Plugins personalizados
import ToastPlugin from './plugins/toast'

// Diretivas globais
import { clickOutside, focus } from './directives'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(ToastPlugin)

app.directive('click-outside', clickOutside)
app.directive('focus', focus)

app.mount('#app')`,
            
            'App.vue': `<template>
  <div id="app" :data-theme="theme">
    <TheHeader />
    <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <RouterView />
    </main>
    <ToastContainer />
  </div>
</template>

<script setup>
import { provide } from 'vue'
import { useTheme } from '@/composables/useTheme'
import TheHeader from '@/components/TheHeader.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const { theme } = useTheme()

// Prover tema globalmente
provide('theme', theme)
</script>`,
            
            'package.json': {
                name: 'vue-modern-app',
                version: '1.0.0',
                type: 'module',
                scripts: {
                    dev: 'vite',
                    build: 'vite build',
                    preview: 'vite preview',
                    lint: 'eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix --ignore-path .gitignore'
                },
                dependencies: {
                    vue: '^3.3.4',
                    'vue-router': '^4.2.4',
                    pinia: '^2.1.6'
                },
                devDependencies: {
                    '@vitejs/plugin-vue': '^4.2.3',
                    eslint: '^8.45.0',
                    'eslint-plugin-vue': '^9.15.1',
                    vite: '^4.4.5'
                }
            }
        };
        
        console.log('🟢 Aplicação Vue Gerada:', app);
        return app;
    }
}

// =============================================================================
// 4. IMPLEMENTAÇÃO PRÁTICA - ANGULAR
// =============================================================================

/**
 * 🔴 IMPLEMENTAÇÕES ANGULAR
 * 
 * Exemplos práticos usando Angular com TypeScript
 */
class AngularImplementations {
    constructor() {
        this.components = new Map();
        this.services = new Map();
        this.patterns = new Map();
        
        this.setupAngularExamples();
    }

    /**
     * Configura exemplos Angular
     */
    setupAngularExamples() {
        this.createBasicComponents();
        this.createServices();
        this.createAdvancedPatterns();
    }

    /**
     * Componentes básicos Angular
     */
    createBasicComponents() {
        const basicComponents = {
            // Componente simples
            simpleButton: `// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

@Component({
  selector: 'app-button',
  template: \`
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  \`,
  styles: [\`
    .btn {
      @apply px-4 py-2 rounded font-medium transition-colors;
    }
    .btn-primary {
      @apply bg-blue-500 text-white hover:bg-blue-600;
    }
    .btn-secondary {
      @apply bg-gray-500 text-white hover:bg-gray-600;
    }
    .btn-outline {
      @apply border border-blue-500 text-blue-500 hover:bg-blue-50;
    }
    .btn:disabled {
      @apply opacity-50 cursor-not-allowed;
    }
  \`]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();
  
  get buttonClasses(): string {
    return \`btn btn-\${this.variant}\`;
  }
  
  handleClick(event: Event): void {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}`,

            // Componente com estado
            counter: `// counter.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <div class="p-4 border rounded-lg">
      <h2 class="text-xl font-bold mb-4">Contador</h2>
      <div class="text-3xl font-mono mb-4 text-center">{{ count }}</div>
      <div class="flex gap-2 justify-center">
        <app-button (clicked)="decrement()">-{{ step }}</app-button>
        <app-button (clicked)="reset()" variant="outline">Reset</app-button>
        <app-button (clicked)="increment()">+{{ step }}</app-button>
      </div>
    </div>
  \`
})
export class CounterComponent {
  @Input() initialValue = 0;
  @Input() step = 1;
  
  count = this.initialValue;
  
  increment(): void {
    this.count += this.step;
  }
  
  decrement(): void {
    this.count -= this.step;
  }
  
  reset(): void {
    this.count = this.initialValue;
  }
}`,

            // Componente com serviços
            userProfile: `// user-profile.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-user-profile',
  template: \`
    <div class="bg-white rounded-lg shadow p-6">
      <div *ngIf="loading" class="animate-pulse">
        Carregando...
      </div>
      
      <div *ngIf="error" class="text-red-500">
        Erro: {{ error }}
      </div>
      
      <div *ngIf="user && !loading">
        <img 
          [src]="user.avatar" 
          [alt]="user.name"
          class="w-16 h-16 rounded-full mx-auto mb-4"
        />
        <h2 class="text-xl font-bold text-center">{{ user.name }}</h2>
        <p class="text-gray-600 text-center">{{ user.email }}</p>
        <p class="text-sm text-gray-500 text-center mt-2">
          Membro desde {{ user.joinDate | date:'dd/MM/yyyy' }}
        </p>
      </div>
      
      <div *ngIf="!user && !loading && !error">
        Usuário não encontrado
      </div>
    </div>
  \`
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @Input() userId!: string;
  
  user: User | null = null;
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.loadUser();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadUser(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.error = null;
    
    this.userService.getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message;
          this.loading = false;
        }
      });
  }
}`
        };
        
        this.components.set('angular', basicComponents);
    }

    /**
     * Serviços Angular
     */
    createServices() {
        const services = {
            // Serviço HTTP
            userService: `// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = '/api/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  
  users$ = this.usersSubject.asObservable();
  
  constructor(private http: HttpClient) {}
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
      .pipe(
        tap(users => this.usersSubject.next(users)),
        catchError(this.handleError)
      );
  }
  
  getUser(id: string): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user)
      .pipe(
        tap(newUser => {
          const currentUsers = this.usersSubject.value;
          this.usersSubject.next([...currentUsers, newUser]);
        }),
        catchError(this.handleError)
      );
  }
  
  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/\${id}\`, user)
      .pipe(
        tap(updatedUser => {
          const currentUsers = this.usersSubject.value;
          const index = currentUsers.findIndex(u => u.id === id);
          if (index !== -1) {
            currentUsers[index] = updatedUser;
            this.usersSubject.next([...currentUsers]);
          }
        }),
        catchError(this.handleError)
      );
  }
  
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`)
      .pipe(
        tap(() => {
          const currentUsers = this.usersSubject.value;
          const filteredUsers = currentUsers.filter(u => u.id !== id);
          this.usersSubject.next(filteredUsers);
        }),
        catchError(this.handleError)
      );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = \`Erro: \${error.error.message}\`;
    } else {
      // Erro do lado do servidor
      errorMessage = \`Código do erro: \${error.status}, mensagem: \${error.message}\`;
    }
    
    console.error(errorMessage);
     return throwError(() => new Error(errorMessage));
   }
 }`,

            // Serviço de estado global
            stateService: `// state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AppState {
  user: any;
  theme: 'light' | 'dark';
  loading: boolean;
  notifications: any[];
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private initialState: AppState = {
    user: null,
    theme: 'light',
    loading: false,
    notifications: []
  };
  
  private state$ = new BehaviorSubject<AppState>(this.initialState);
  
  // Seletores
  getState(): Observable<AppState> {
    return this.state$.asObservable();
  }
  
  getUser(): Observable<any> {
    return this.state$.pipe(map(state => state.user));
  }
  
  getTheme(): Observable<'light' | 'dark'> {
    return this.state$.pipe(map(state => state.theme));
  }
  
  getLoading(): Observable<boolean> {
    return this.state$.pipe(map(state => state.loading));
  }
  
  // Actions
  setUser(user: any): void {
    this.updateState({ user });
  }
  
  setTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
    localStorage.setItem('theme', theme);
  }
  
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }
  
  addNotification(notification: any): void {
    const currentState = this.state$.value;
    const notifications = [...currentState.notifications, notification];
    this.updateState({ notifications });
  }
  
  removeNotification(id: string): void {
    const currentState = this.state$.value;
    const notifications = currentState.notifications.filter(n => n.id !== id);
    this.updateState({ notifications });
  }
  
  private updateState(partialState: Partial<AppState>): void {
    const currentState = this.state$.value;
    const newState = { ...currentState, ...partialState };
    this.state$.next(newState);
  }
}`
        };
        
        this.services.set('angular', services);
    }

    /**
     * Padrões avançados Angular
     */
    createAdvancedPatterns() {
        const advancedPatterns = {
            // Guard de rota
            authGuard: `// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}`,

            // Interceptor HTTP
            httpInterceptor: `// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        let authReq = req;
        
        if (token) {
          authReq = req.clone({
            setHeaders: {
              Authorization: \`Bearer \${token}\`
            }
          });
        }
        
        return next.handle(authReq).pipe(
          catchError(error => {
            if (error.status === 401) {
              this.authService.logout();
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}`,

            // Diretiva personalizada
            customDirective: `// highlight.directive.ts
import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'transparent';
  
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  
  ngOnInit(): void {
    this.highlight(this.defaultColor);
  }
  
  @HostListener('mouseenter') onMouseEnter(): void {
    this.highlight(this.appHighlight);
  }
  
  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(this.defaultColor);
  }
  
  private highlight(color: string): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
  }
}

// Uso: <p appHighlight="lightblue">Texto destacado</p>`,

            // Pipe personalizado
            customPipe: `// truncate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 25, completeWords = false, ellipsis = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }
    
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    
    return value.substr(0, limit) + ellipsis;
  }
}

// Uso: {{ longText | truncate:50:true }}`
        };
        
        this.patterns.set('angular', advancedPatterns);
    }

    /**
     * Gera aplicação Angular completa
     */
    generateAngularApp() {
        const app = {
            'main.ts': `import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));`,
            
            'app.module.ts': `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }`,
            
            'package.json': {
                name: 'angular-modern-app',
                version: '1.0.0',
                scripts: {
                    ng: 'ng',
                    start: 'ng serve',
                    build: 'ng build',
                    test: 'ng test',
                    lint: 'ng lint'
                },
                dependencies: {
                    '@angular/animations': '^16.0.0',
                    '@angular/common': '^16.0.0',
                    '@angular/compiler': '^16.0.0',
                    '@angular/core': '^16.0.0',
                    '@angular/forms': '^16.0.0',
                    '@angular/platform-browser': '^16.0.0',
                    '@angular/platform-browser-dynamic': '^16.0.0',
                    '@angular/router': '^16.0.0',
                    rxjs: '~7.8.0',
                    tslib: '^2.3.0',
                    'zone.js': '~0.13.0'
                },
                devDependencies: {
                    '@angular-devkit/build-angular': '^16.0.0',
                    '@angular/cli': '~16.0.0',
                    '@angular/compiler-cli': '^16.0.0',
                    '@types/jasmine': '~4.3.0',
                    jasmine: '~4.6.0',
                    karma: '~6.4.0',
                    typescript: '~5.0.2'
                }
            }
        };
        
        console.log('🔴 Aplicação Angular Gerada:', app);
        return app;
    }
}

// =============================================================================
// 5. COMPARAÇÃO PRÁTICA ENTRE FRAMEWORKS
// =============================================================================

/**
 * 📊 COMPARAÇÃO HANDS-ON
 * 
 * Análise prática das diferenças entre React, Vue e Angular
 */
class FrameworkComparison {
    constructor() {
        this.comparisons = new Map();
        this.metrics = new Map();
        this.recommendations = new Map();
        
        this.setupComparisons();
    }

    /**
     * Configura comparações detalhadas
     */
    setupComparisons() {
        this.createSyntaxComparison();
        this.createArchitectureComparison();
        this.createPerformanceComparison();
        this.createEcosystemComparison();
        this.createLearningCurveComparison();
    }

    /**
     * Comparação de sintaxe
     */
    createSyntaxComparison() {
        const syntaxComparison = {
            componentDefinition: {
                react: {
                    functional: `function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}`,
                    hooks: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}`
                },
                vue: {
                    sfc: `<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])
const handleClick = () => emit('click')
</script>`,
                    composition: `<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">+</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const count = ref(0)
const increment = () => count.value++
</script>`
                },
                angular: {
                    component: `@Component({
  selector: 'app-button',
  template: '<button (click)="handleClick()"><ng-content></ng-content></button>'
})
export class ButtonComponent {
  @Output() clicked = new EventEmitter();
  handleClick() { this.clicked.emit(); }
}`,
                    counter: `@Component({
  selector: 'app-counter',
  template: \`
    <div>
      <p>{{ count }}</p>
      <button (click)="increment()">+</button>
    </div>
  \`
})
export class CounterComponent {
  count = 0;
  increment() { this.count++; }
}`
                }
            },
            
            stateManagement: {
                react: {
                    local: 'useState, useReducer',
                    global: 'Context API, Redux, Zustand',
                    example: `const [state, setState] = useState(initialState);
const { state, dispatch } = useContext(AppContext);`
                },
                vue: {
                    local: 'ref, reactive, computed',
                    global: 'provide/inject, Pinia, Vuex',
                    example: `const count = ref(0);
const state = reactive({ user: null });
const { user } = useStore();`
                },
                angular: {
                    local: 'Component properties',
                    global: 'Services, NgRx, Akita',
                    example: `this.count = 0;
constructor(private store: Store) {}
this.user$ = this.store.select('user');`
                }
            },
            
            eventHandling: {
                react: {
                    syntax: 'onClick={handler}',
                    example: `<button onClick={(e) => handleClick(e)}>Click</button>`
                },
                vue: {
                    syntax: '@click="handler"',
                    example: `<button @click="handleClick">Click</button>
<button @click="handleClick($event)">Click</button>`
                },
                angular: {
                    syntax: '(click)="handler()"',
                    example: `<button (click)="handleClick()">Click</button>
<button (click)="handleClick($event)">Click</button>`
                }
            },
            
            conditionalRendering: {
                react: {
                    syntax: 'JSX expressions',
                    example: `{isVisible && <div>Visible</div>}
{user ? <Profile user={user} /> : <Login />}`
                },
                vue: {
                    syntax: 'Directives',
                    example: `<div v-if="isVisible">Visible</div>
<Profile v-if="user" :user="user" />
<Login v-else />`
                },
                angular: {
                    syntax: 'Structural directives',
                    example: `<div *ngIf="isVisible">Visible</div>
<app-profile *ngIf="user; else loginTemplate" [user]="user"></app-profile>
<ng-template #loginTemplate><app-login></app-login></ng-template>`
                }
            }
        };
        
        this.comparisons.set('syntax', syntaxComparison);
    }

    /**
     * Comparação de arquitetura
     */
    createArchitectureComparison() {
        const architectureComparison = {
            philosophy: {
                react: {
                    approach: 'Library focada em UI',
                    philosophy: 'Composição de componentes funcionais',
                    dataFlow: 'Unidirecional (top-down)',
                    flexibility: 'Alta - você escolhe as ferramentas'
                },
                vue: {
                    approach: 'Framework progressivo',
                    philosophy: 'Facilidade de uso e adoção gradual',
                    dataFlow: 'Bidirecional com reatividade',
                    flexibility: 'Média - opções balanceadas'
                },
                angular: {
                    approach: 'Framework completo (full-stack)',
                    philosophy: 'Convenção sobre configuração',
                    dataFlow: 'Bidirecional com RxJS',
                    flexibility: 'Baixa - estrutura opinionada'
                }
            },
            
            projectStructure: {
                react: {
                    structure: `src/
  components/
    Button/
      Button.jsx
      Button.test.js
      index.js
  hooks/
    useAuth.js
  utils/
    api.js
  App.jsx
  index.js`,
                    characteristics: 'Flexível, baseada em componentes'
                },
                vue: {
                    structure: `src/
  components/
    Button.vue
  views/
    Home.vue
  composables/
    useAuth.js
  router/
    index.js
  store/
    index.js
  App.vue
  main.js`,
                    characteristics: 'Organizada, Single File Components'
                },
                angular: {
                    structure: `src/
  app/
    components/
      button/
        button.component.ts
        button.component.html
        button.component.scss
        button.component.spec.ts
    services/
      auth.service.ts
    guards/
      auth.guard.ts
    app.module.ts
    app.component.ts
  main.ts`,
                    characteristics: 'Estruturada, separação clara de responsabilidades'
                }
            },
            
            buildTools: {
                react: {
                    default: 'Create React App, Vite',
                    advanced: 'Webpack, Rollup, Parcel',
                    config: 'Flexível, muitas opções'
                },
                vue: {
                    default: 'Vue CLI, Vite',
                    advanced: 'Webpack, Rollup',
                    config: 'Balanceada, boa experiência padrão'
                },
                angular: {
                    default: 'Angular CLI',
                    advanced: 'Webpack (interno)',
                    config: 'Opinionada, configuração complexa'
                }
            }
        };
        
        this.comparisons.set('architecture', architectureComparison);
    }

    /**
     * Comparação de performance
     */
    createPerformanceComparison() {
        const performanceComparison = {
            bundleSize: {
                react: {
                    core: '42.2kb (React + ReactDOM)',
                    withRouter: '~50kb',
                    withState: '~55kb (com Redux)',
                    notes: 'Tamanho cresce com bibliotecas adicionais'
                },
                vue: {
                    core: '34kb (Vue 3)',
                    withRouter: '~40kb',
                    withState: '~42kb (com Pinia)',
                    notes: 'Tamanho consistente, tree-shaking eficiente'
                },
                angular: {
                    core: '130kb+ (framework completo)',
                    withRouter: '~140kb',
                    withState: '~150kb (com NgRx)',
                    notes: 'Maior inicialmente, mas estável em apps grandes'
                }
            },
            
            renderingPerformance: {
                react: {
                    strategy: 'Virtual DOM + Reconciliation',
                    optimization: 'React.memo, useMemo, useCallback',
                    strengths: 'Otimizações manuais precisas',
                    weaknesses: 'Requer conhecimento para otimizar'
                },
                vue: {
                    strategy: 'Virtual DOM + Reatividade',
                    optimization: 'Automática + v-memo, computed',
                    strengths: 'Otimizações automáticas inteligentes',
                    weaknesses: 'Menos controle granular'
                },
                angular: {
                    strategy: 'Change Detection + Zone.js',
                    optimization: 'OnPush, TrackBy, Async Pipe',
                    strengths: 'Detecção de mudanças robusta',
                    weaknesses: 'Overhead do Zone.js'
                }
            },
            
            memoryUsage: {
                react: {
                    baseline: 'Baixo',
                    scaling: 'Linear com componentes',
                    leaks: 'Possíveis com closures e refs'
                },
                vue: {
                    baseline: 'Muito baixo',
                    scaling: 'Eficiente com proxy',
                    leaks: 'Raros, cleanup automático'
                },
                angular: {
                    baseline: 'Médio',
                    scaling: 'Estável com DI',
                    leaks: 'Gerenciados pelo framework'
                }
            }
        };
        
        this.comparisons.set('performance', performanceComparison);
    }

    /**
     * Comparação de ecossistema
     */
    createEcosystemComparison() {
        const ecosystemComparison = {
            popularity: {
                react: {
                    githubStars: '220k+',
                    npmDownloads: '20M+/week',
                    jobMarket: 'Muito alto',
                    community: 'Maior comunidade'
                },
                vue: {
                    githubStars: '206k+',
                    npmDownloads: '4M+/week',
                    jobMarket: 'Alto',
                    community: 'Comunidade ativa e acolhedora'
                },
                angular: {
                    githubStars: '93k+',
                    npmDownloads: '3M+/week',
                    jobMarket: 'Alto (enterprise)',
                    community: 'Comunidade enterprise'
                }
            },
            
            libraries: {
                react: {
                    routing: 'React Router, Reach Router',
                    state: 'Redux, Zustand, Jotai, Recoil',
                    ui: 'Material-UI, Ant Design, Chakra UI',
                    testing: 'Jest, React Testing Library',
                    quantity: 'Vasta quantidade de opções'
                },
                vue: {
                    routing: 'Vue Router (oficial)',
                    state: 'Pinia (oficial), Vuex',
                    ui: 'Vuetify, Quasar, Element Plus',
                    testing: 'Vue Test Utils, Jest',
                    quantity: 'Ecossistema curado e oficial'
                },
                angular: {
                    routing: 'Angular Router (built-in)',
                    state: 'NgRx, Akita, Services',
                    ui: 'Angular Material, PrimeNG',
                    testing: 'Jasmine, Karma (built-in)',
                    quantity: 'Ferramentas integradas'
                }
            },
            
            tooling: {
                react: {
                    devtools: 'React DevTools',
                    cli: 'Create React App, Vite',
                    linting: 'ESLint + plugins',
                    formatting: 'Prettier',
                    quality: 'Excelente, muitas opções'
                },
                vue: {
                    devtools: 'Vue DevTools',
                    cli: 'Vue CLI, Vite',
                    linting: 'ESLint + Vue plugin',
                    formatting: 'Prettier + Vue',
                    quality: 'Muito boa, bem integrada'
                },
                angular: {
                    devtools: 'Angular DevTools',
                    cli: 'Angular CLI (poderoso)',
                    linting: 'TSLint/ESLint + Angular',
                    formatting: 'Prettier + Angular',
                    quality: 'Excelente, tudo integrado'
                }
            }
        };
        
        this.comparisons.set('ecosystem', ecosystemComparison);
    }

    /**
     * Comparação de curva de aprendizado
     */
    createLearningCurveComparison() {
        const learningComparison = {
            beginner: {
                react: {
                    difficulty: 'Média',
                    timeToBasic: '2-3 semanas',
                    prerequisites: 'JavaScript ES6+, JSX',
                    challenges: 'Conceitos funcionais, hooks',
                    firstProject: 'Todo App com hooks'
                },
                vue: {
                    difficulty: 'Baixa',
                    timeToBasic: '1-2 semanas',
                    prerequisites: 'HTML, CSS, JavaScript básico',
                    challenges: 'Diretivas, reatividade',
                    firstProject: 'Todo App com Options API'
                },
                angular: {
                    difficulty: 'Alta',
                    timeToBasic: '4-6 semanas',
                    prerequisites: 'TypeScript, OOP, RxJS',
                    challenges: 'Arquitetura complexa, muitos conceitos',
                    firstProject: 'Todo App com serviços'
                }
            },
            
            intermediate: {
                react: {
                    concepts: 'Context, Custom Hooks, Performance',
                    timeToIntermediate: '2-3 meses',
                    projects: 'SPA com roteamento e estado global',
                    challenges: 'Gerenciamento de estado, otimizações'
                },
                vue: {
                    concepts: 'Composition API, Stores, Plugins',
                    timeToIntermediate: '1-2 meses',
                    projects: 'SPA com Pinia e Vue Router',
                    challenges: 'Transição para Composition API'
                },
                angular: {
                    concepts: 'Services, Guards, Interceptors',
                    timeToIntermediate: '3-4 meses',
                    projects: 'App enterprise com NgRx',
                    challenges: 'RxJS, arquitetura modular'
                }
            },
            
            advanced: {
                react: {
                    concepts: 'Concurrent Features, Suspense, SSR',
                    timeToAdvanced: '6+ meses',
                    projects: 'Apps complexas com Next.js',
                    mastery: 'Arquitetura de componentes, performance'
                },
                vue: {
                    concepts: 'Renderless Components, Plugins, SSR',
                    timeToAdvanced: '4-6 meses',
                    projects: 'Apps complexas com Nuxt.js',
                    mastery: 'Reatividade avançada, otimizações'
                },
                angular: {
                    concepts: 'Micro-frontends, Ivy, Universal',
                    timeToAdvanced: '8+ meses',
                    projects: 'Apps enterprise escaláveis',
                    mastery: 'Arquitetura enterprise, RxJS avançado'
                }
            }
        };
        
        this.comparisons.set('learningCurve', learningComparison);
    }

    /**
     * Gera relatório de comparação
     */
    generateComparisonReport() {
        const report = {
            summary: {
                react: {
                    bestFor: 'Apps complexas, equipes experientes, flexibilidade',
                    pros: ['Ecossistema vasto', 'Performance otimizável', 'Mercado de trabalho'],
                    cons: ['Curva de aprendizado', 'Muitas decisões', 'Boilerplate'],
                    score: 8.5
                },
                vue: {
                    bestFor: 'Projetos de qualquer tamanho, equipes mistas, produtividade',
                    pros: ['Fácil aprendizado', 'Performance excelente', 'Documentação'],
                    cons: ['Ecossistema menor', 'Menos vagas', 'Comunidade menor'],
                    score: 9.0
                },
                angular: {
                    bestFor: 'Apps enterprise, equipes grandes, projetos longos',
                    pros: ['Framework completo', 'TypeScript nativo', 'Arquitetura sólida'],
                    cons: ['Complexidade alta', 'Bundle grande', 'Curva íngreme'],
                    score: 8.0
                }
            },
            
            recommendations: {
                startups: 'Vue.js - Produtividade e facilidade',
                enterprise: 'Angular - Estrutura e escalabilidade',
                freelancers: 'React - Mercado de trabalho',
                beginners: 'Vue.js - Curva de aprendizado suave',
                experienced: 'React - Flexibilidade e controle',
                teams: 'Angular - Convenções e estrutura'
            },
            
            migrationPaths: {
                'vanilla-to-react': 'Gradual, componente por componente',
                'vanilla-to-vue': 'Muito fácil, adoção progressiva',
                'vanilla-to-angular': 'Reescrita completa recomendada',
                'react-to-vue': 'Moderada, conceitos similares',
                'vue-to-react': 'Moderada, mudança de paradigma',
                'angular-to-react': 'Complexa, arquiteturas diferentes'
            }
        };
        
        console.log('📊 Relatório de Comparação:', report);
        return report;
    }

    /**
     * Demonstração prática das diferenças
     */
    demonstrateDifferences() {
        console.log('\n🔍 DEMONSTRAÇÃO PRÁTICA DAS DIFERENÇAS\n');
        
        // Exemplo: Mesmo componente nos 3 frameworks
        const todoComponent = {
            react: `// TodoList.jsx
import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  
  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };
  
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };
  
  return (
    <div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
            
            vue: `<!-- TodoList.vue -->
<template>
  <div>
    <input 
      v-model="input" 
      @keyup.enter="addTodo"
    />
    <button @click="addTodo">Add</button>
    <ul>
      <li 
        v-for="todo in todos" 
        :key="todo.id"
        @click="toggleTodo(todo.id)"
      >
        <span :class="{ done: todo.done }">
          {{ todo.text }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todos = ref([])
const input = ref('')

const addTodo = () => {
  if (input.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: input.value,
      done: false
    })
    input.value = ''
  }
}

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) todo.done = !todo.done
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
}
</style>`,
            
            angular: `// todo-list.component.ts
import { Component } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  selector: 'app-todo-list',
  template: \`
    <div>
      <input 
        [(ngModel)]="input" 
        (keyup.enter)="addTodo()"
      />
      <button (click)="addTodo()">Add</button>
      <ul>
        <li 
          *ngFor="let todo of todos; trackBy: trackByFn"
          (click)="toggleTodo(todo.id)"
        >
          <span [class.done]="todo.done">
            {{ todo.text }}
          </span>
        </li>
      </ul>
    </div>
  \`,
  styles: [\`
    .done {
      text-decoration: line-through;
    }
  \`]
})
export class TodoListComponent {
  todos: Todo[] = [];
  input = '';
  
  addTodo(): void {
    if (this.input.trim()) {
      this.todos.push({
        id: Date.now(),
        text: this.input,
        done: false
      });
      this.input = '';
    }
  }
  
  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done;
    }
  }
  
  trackByFn(index: number, todo: Todo): number {
    return todo.id;
  }
}`
        };
        
        console.log('📝 Mesmo componente nos 3 frameworks:', todoComponent);
        return todoComponent;
    }
}

// =============================================================================
// 6. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS HANDS-ON
 * 
 * Exercícios práticos para consolidar o aprendizado
 */
class FrameworkExercises {
    constructor() {
        this.exercises = new Map();
        this.solutions = new Map();
        
        this.setupExercises();
    }

    /**
     * Configura exercícios práticos
     */
    setupExercises() {
        this.createBasicExercises();
        this.createIntermediateExercises();
        this.createAdvancedExercises();
        this.createComparisonExercises();
    }

    /**
     * Exercícios básicos
     */
    createBasicExercises() {
        const basicExercises = {
            exercise1: {
                title: 'Contador Simples',
                description: 'Crie um contador com botões + e - nos três frameworks',
                requirements: [
                    'Estado para armazenar o número',
                    'Botão para incrementar',
                    'Botão para decrementar',
                    'Exibição do valor atual',
                    'Não permitir valores negativos'
                ],
                difficulty: 'Básico',
                timeEstimate: '30 minutos por framework'
            },
            
            exercise2: {
                title: 'Lista de Tarefas',
                description: 'Implemente uma todo list básica',
                requirements: [
                    'Input para nova tarefa',
                    'Botão para adicionar',
                    'Lista de tarefas',
                    'Marcar como concluída',
                    'Remover tarefa'
                ],
                difficulty: 'Básico',
                timeEstimate: '45 minutos por framework'
            },
            
            exercise3: {
                title: 'Formulário de Contato',
                description: 'Crie um formulário com validação',
                requirements: [
                    'Campos: nome, email, mensagem',
                    'Validação em tempo real',
                    'Exibição de erros',
                    'Botão submit habilitado apenas se válido',
                    'Limpar formulário após envio'
                ],
                difficulty: 'Básico-Intermediário',
                timeEstimate: '60 minutos por framework'
            }
        };
        
        this.exercises.set('basic', basicExercises);
    }

    /**
     * Exercícios intermediários
     */
    createIntermediateExercises() {
        const intermediateExercises = {
            exercise1: {
                title: 'Dashboard com Múltiplos Componentes',
                description: 'Crie um dashboard com comunicação entre componentes',
                requirements: [
                    'Componente de estatísticas',
                    'Componente de gráfico (simulado)',
                    'Componente de filtros',
                    'Estado compartilhado',
                    'Comunicação entre componentes'
                ],
                difficulty: 'Intermediário',
                timeEstimate: '90 minutos por framework'
            },
            
            exercise2: {
                title: 'App de Busca com API',
                description: 'Implemente busca com debounce e loading',
                requirements: [
                    'Input de busca com debounce',
                    'Chamada para API (JSONPlaceholder)',
                    'Loading state',
                    'Exibição de resultados',
                    'Tratamento de erros'
                ],
                difficulty: 'Intermediário',
                timeEstimate: '75 minutos por framework'
            },
            
            exercise3: {
                title: 'Carrinho de Compras',
                description: 'Sistema de carrinho com persistência',
                requirements: [
                    'Lista de produtos',
                    'Adicionar ao carrinho',
                    'Remover do carrinho',
                    'Calcular total',
                    'Persistir no localStorage'
                ],
                difficulty: 'Intermediário',
                timeEstimate: '120 minutos por framework'
            }
        };
        
        this.exercises.set('intermediate', intermediateExercises);
    }

    /**
     * Exercícios avançados
     */
    createAdvancedExercises() {
        const advancedExercises = {
            exercise1: {
                title: 'Sistema de Autenticação',
                description: 'Implemente login/logout com guards',
                requirements: [
                    'Formulário de login',
                    'Gerenciamento de token',
                    'Guards de rota (onde aplicável)',
                    'Interceptors HTTP',
                    'Logout automático'
                ],
                difficulty: 'Avançado',
                timeEstimate: '180 minutos por framework'
            },
            
            exercise2: {
                title: 'Chat em Tempo Real (Simulado)',
                description: 'Sistema de chat com WebSocket simulado',
                requirements: [
                    'Lista de conversas',
                    'Área de mensagens',
                    'Envio de mensagens',
                    'Simulação de tempo real',
                    'Notificações'
                ],
                difficulty: 'Avançado',
                timeEstimate: '240 minutos por framework'
            },
            
            exercise3: {
                title: 'Editor de Texto Rico',
                description: 'Editor com formatação básica',
                requirements: [
                    'Área de edição',
                    'Botões de formatação (bold, italic)',
                    'Salvar/carregar conteúdo',
                    'Preview em tempo real',
                    'Exportar como HTML'
                ],
                difficulty: 'Avançado',
                timeEstimate: '300 minutos por framework'
            }
        };
        
        this.exercises.set('advanced', advancedExercises);
    }

    /**
     * Exercícios de comparação
     */
    createComparisonExercises() {
        const comparisonExercises = {
            exercise1: {
                title: 'Mesmo App, Três Implementações',
                description: 'Implemente o mesmo app nos três frameworks',
                app: 'Sistema de notas pessoais',
                requirements: [
                    'CRUD completo de notas',
                    'Busca e filtros',
                    'Categorização',
                    'Persistência local',
                    'Interface responsiva'
                ],
                comparison: [
                    'Tempo de desenvolvimento',
                    'Linhas de código',
                    'Facilidade de manutenção',
                    'Performance percebida',
                    'Experiência do desenvolvedor'
                ],
                difficulty: 'Comparativo',
                timeEstimate: '6-8 horas total'
            },
            
            exercise2: {
                title: 'Análise de Bundle Size',
                description: 'Compare o tamanho final dos bundles',
                tasks: [
                    'Criar app básico em cada framework',
                    'Adicionar roteamento',
                    'Adicionar gerenciamento de estado',
                    'Fazer build de produção',
                    'Analisar tamanhos e performance'
                ],
                tools: [
                    'webpack-bundle-analyzer',
                    'Lighthouse',
                    'Chrome DevTools'
                ],
                difficulty: 'Análise',
                timeEstimate: '2-3 horas'
            },
            
            exercise3: {
                title: 'Migração Entre Frameworks',
                description: 'Migre um app simples entre frameworks',
                scenario: 'App de lista de filmes',
                migrations: [
                    'Vue → React',
                    'React → Angular',
                    'Angular → Vue'
                ],
                analysis: [
                    'Dificuldades encontradas',
                    'Conceitos que se traduzem bem',
                    'Conceitos específicos de cada framework',
                    'Tempo necessário para migração'
                ],
                difficulty: 'Prático',
                timeEstimate: '4-5 horas'
            }
        };
        
        this.exercises.set('comparison', comparisonExercises);
    }

    /**
     * Gera guia de exercícios
     */
    generateExerciseGuide() {
        const guide = {
            introduction: `
🎯 GUIA DE EXERCÍCIOS PRÁTICOS

Este guia contém exercícios progressivos para dominar React, Vue e Angular.
Cada exercício deve ser implementado nos três frameworks para comparação.

📋 METODOLOGIA:
1. Leia o exercício completamente
2. Implemente primeiro no framework que você conhece melhor
3. Implemente nos outros dois frameworks
4. Compare as implementações
5. Anote diferenças e dificuldades
6. Reflita sobre qual abordagem preferiu e por quê
            `,
            
            progression: {
                week1: 'Exercícios básicos - Fundamentos',
                week2: 'Exercícios intermediários - Componentes e estado',
                week3: 'Exercícios avançados - Arquitetura',
                week4: 'Exercícios comparativos - Análise'
            },
            
            evaluation: {
                criteria: [
                    'Funcionalidade completa',
                    'Código limpo e organizado',
                    'Uso correto dos padrões do framework',
                    'Performance adequada',
                    'Experiência do usuário'
                ],
                deliverables: [
                    'Código fonte de cada implementação',
                    'README com instruções de execução',
                    'Relatório comparativo (1-2 páginas)',
                    'Reflexões pessoais sobre cada framework'
                ]
            },
            
            resources: {
                documentation: [
                    'React: https://react.dev/',
                    'Vue: https://vuejs.org/',
                    'Angular: https://angular.io/'
                ],
                tools: [
                    'VS Code com extensões específicas',
                    'Chrome DevTools',
                    'Postman para APIs',
                    'Git para versionamento'
                ],
                apis: [
                    'JSONPlaceholder: https://jsonplaceholder.typicode.com/',
                    'Lorem Picsum: https://picsum.photos/',
                    'OpenWeather: https://openweathermap.org/api'
                ]
            }
        };
        
        console.log('📚 Guia de Exercícios:', guide);
        return guide;
    }
}

// =============================================================================
// 7. RESUMO DO MÓDULO
// =============================================================================

/**
 * 📋 RESUMO COMPLETO
 * 
 * Consolidação de todo o aprendizado do módulo
 */
class ModuleSummary {
    constructor() {
        this.topics = new Map();
        this.keyTakeaways = [];
        this.nextSteps = [];
        
        this.generateSummary();
    }

    /**
     * Gera resumo completo do módulo
     */
    generateSummary() {
        const summary = {
            moduleTitle: 'Introdução aos Frameworks Modernos',
            
            topicsCovered: {
                frameworks: {
                    react: {
                        concepts: ['Componentes funcionais', 'Hooks', 'JSX', 'Virtual DOM'],
                        patterns: ['Estado local', 'Context API', 'Custom Hooks'],
                        ecosystem: ['Create React App', 'React Router', 'Redux']
                    },
                    vue: {
                        concepts: ['Single File Components', 'Reatividade', 'Diretivas'],
                        patterns: ['Options API', 'Composition API', 'Stores'],
                        ecosystem: ['Vue CLI', 'Vue Router', 'Pinia']
                    },
                    angular: {
                        concepts: ['Componentes', 'Services', 'Dependency Injection'],
                        patterns: ['Observables', 'Guards', 'Interceptors'],
                        ecosystem: ['Angular CLI', 'Angular Router', 'NgRx']
                    }
                },
                
                comparisons: {
                    syntax: 'Diferenças na definição de componentes e manipulação de eventos',
                    architecture: 'Filosofias e estruturas de projeto distintas',
                    performance: 'Estratégias de otimização e tamanhos de bundle',
                    ecosystem: 'Comunidades, bibliotecas e ferramentas disponíveis',
                    learning: 'Curvas de aprendizado e complexidade'
                },
                
                practicalWork: {
                    implementations: 'Componentes práticos nos três frameworks',
                    exercises: 'Exercícios progressivos para consolidação',
                    comparison: 'Análise hands-on das diferenças',
                    projects: 'Projetos completos para prática'
                }
            },
            
            keyTakeaways: [
                '🎯 React é ideal para projetos que precisam de flexibilidade e têm equipes experientes',
                '🎯 Vue oferece o melhor equilíbrio entre facilidade e poder, ideal para a maioria dos projetos',
                '🎯 Angular é perfeito para aplicações enterprise com equipes grandes e projetos de longo prazo',
                '🎯 Todos os três frameworks são capazes de criar aplicações modernas e performáticas',
                '🎯 A escolha deve considerar contexto do projeto, equipe e objetivos de negócio',
                '🎯 Dominar os conceitos fundamentais é mais importante que decorar sintaxes específicas',
                '🎯 A experiência prática é essencial para entender as nuances de cada framework'
            ],
            
            skillsAcquired: [
                'Compreensão dos conceitos fundamentais de frameworks modernos',
                'Capacidade de implementar componentes básicos nos três frameworks',
                'Conhecimento das diferenças arquiteturais entre React, Vue e Angular',
                'Habilidade para escolher o framework adequado para diferentes cenários',
                'Experiência prática com ferramentas de desenvolvimento modernas',
                'Entendimento dos padrões de gerenciamento de estado',
                'Conhecimento do ecossistema e comunidade de cada framework'
            ],
            
            nextSteps: {
                immediate: [
                    'Escolher um framework para aprofundamento',
                    'Completar todos os exercícios práticos',
                    'Criar um projeto pessoal no framework escolhido',
                    'Participar de comunidades online'
                ],
                
                shortTerm: [
                    'Dominar o framework escolhido (2-3 meses)',
                    'Aprender ferramentas complementares (roteamento, estado)',
                    'Estudar padrões avançados e melhores práticas',
                    'Contribuir para projetos open source'
                ],
                
                longTerm: [
                    'Explorar frameworks meta (Next.js, Nuxt.js, Angular Universal)',
                    'Aprender sobre micro-frontends e arquiteturas avançadas',
                    'Estudar outros frameworks emergentes (Svelte, Solid.js)',
                    'Desenvolver expertise em performance e otimização'
                ]
            },
            
            resources: {
                documentation: {
                    react: 'https://react.dev/ - Documentação oficial renovada',
                    vue: 'https://vuejs.org/ - Guias excelentes e exemplos práticos',
                    angular: 'https://angular.io/ - Documentação completa e tutoriais'
                },
                
                learning: {
                    courses: [
                        'React: The Complete Guide (Udemy)',
                        'Vue.js Complete Course (Vue Mastery)',
                        'Angular Complete Guide (Angular University)'
                    ],
                    books: [
                        'Learning React (O\'Reilly)',
                        'Vue.js in Action (Manning)',
                        'Angular Development with TypeScript (Manning)'
                    ],
                    practice: [
                        'Frontend Mentor - Desafios práticos',
                        'Codewars - Exercícios de lógica',
                        'GitHub - Projetos open source'
                    ]
                },
                
                community: {
                    react: ['React Brasil (Telegram)', 'Reactiflux (Discord)', 'r/reactjs (Reddit)'],
                    vue: ['Vue Brasil (Telegram)', 'Vue Land (Discord)', 'Vue Forum'],
                    angular: ['Angular Brasil (Telegram)', 'Angular Discord', 'Angular Community']
                }
            },
            
            finalAdvice: `
💡 CONSELHOS FINAIS:

1. **Não tente aprender todos ao mesmo tempo** - Escolha um e domine antes de explorar outros

2. **Pratique constantemente** - A teoria sem prática não gera competência real

3. **Construa projetos reais** - Todo portfólio precisa de projetos que resolvam problemas reais

4. **Participe da comunidade** - O networking e troca de experiências aceleram o aprendizado

5. **Mantenha-se atualizado** - O mundo frontend evolui rapidamente, acompanhe as novidades

6. **Foque nos fundamentos** - JavaScript sólido é mais importante que conhecer 10 frameworks

7. **Seja paciente** - Dominar um framework leva tempo, não desista nas primeiras dificuldades

🚀 Lembre-se: O melhor framework é aquele que você domina e que resolve o problema do seu projeto!
            `
        };
        
        console.log('\n📋 RESUMO COMPLETO DO MÓDULO:\n', summary);
        return summary;
    }
}

// =============================================================================
// INICIALIZAÇÃO E DEMONSTRAÇÃO
// =============================================================================

/**
 * 🚀 EXECUÇÃO PRINCIPAL
 * 
 * Demonstra todos os conceitos do módulo
 */
function initializeFrameworkModule() {
    console.log('\n🎯 INICIANDO MÓDULO: INTRODUÇÃO AOS FRAMEWORKS MODERNOS\n');
    
    // 1. Demonstração React
    console.log('⚛️ === DEMONSTRAÇÃO REACT ===');
    const reactDemo = new ReactFramework();
    reactDemo.demonstrateReact();
    
    // 2. Demonstração Vue
    console.log('\n💚 === DEMONSTRAÇÃO VUE ===');
    const vueDemo = new VueFramework();
    vueDemo.demonstrateVue();
    
    // 3. Demonstração Angular
    console.log('\n🔴 === DEMONSTRAÇÃO ANGULAR ===');
    const angularDemo = new AngularFramework();
    angularDemo.demonstrateAngular();
    
    // 4. Comparação prática
    console.log('\n📊 === COMPARAÇÃO ENTRE FRAMEWORKS ===');
    const comparison = new FrameworkComparison();
    comparison.demonstrateDifferences();
    comparison.generateComparisonReport();
    
    // 5. Exercícios práticos
    console.log('\n🎯 === EXERCÍCIOS PRÁTICOS ===');
    const exercises = new FrameworkExercises();
    exercises.generateExerciseGuide();
    
    // 6. Resumo final
    console.log('\n📋 === RESUMO DO MÓDULO ===');
    const summary = new ModuleSummary();
    
    console.log('\n✅ MÓDULO CONCLUÍDO COM SUCESSO!');
    console.log('\n🎓 Próximo passo: Escolha um framework e aprofunde-se no Módulo 2!');
}

// Executar demonstração
initializeFrameworkModule();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ReactFramework,
        VueFramework,
        AngularFramework,
        FrameworkComparison,
        FrameworkExercises,
        ModuleSummary
    };
}