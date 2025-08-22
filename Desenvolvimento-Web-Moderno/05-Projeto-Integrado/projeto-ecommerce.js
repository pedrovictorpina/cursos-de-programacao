/*
=============================================================================
                    MÓDULO 5: PROJETO INTEGRADO
                   APLICAÇÃO E-COMMERCE COMPLETA
=============================================================================

Este módulo representa a culminação de todo o aprendizado dos módulos anteriores,
integrando frontend React, backend Node.js, TypeScript, testes, deploy e
monitoramento em uma aplicação real de e-commerce.

📋 ESCOPO DO PROJETO:
- Frontend React com TypeScript
- Backend Node.js com Express e TypeScript
- Banco de dados MongoDB/PostgreSQL
- Autenticação JWT
- Sistema de pagamentos
- Testes automatizados
- CI/CD com GitHub Actions
- Deploy em produção
- Monitoramento e observabilidade

*/

// =============================================================================
// 1. ARQUITETURA DO PROJETO
// =============================================================================

/*
Estrutura do projeto integrado:

ecommerce-platform/
├── frontend/                 # React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # Serviços de API
│   │   ├── store/          # Estado global (Redux/Zustand)
│   │   ├── types/          # Definições TypeScript
│   │   └── utils/          # Utilitários
│   ├── public/
│   ├── tests/
│   └── package.json
├── backend/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Controladores de rotas
│   │   ├── models/         # Modelos de dados
│   │   ├── routes/         # Definição de rotas
│   │   ├── middleware/     # Middlewares customizados
│   │   ├── services/       # Lógica de negócio
│   │   ├── types/          # Definições TypeScript
│   │   └── utils/          # Utilitários
│   ├── tests/
│   └── package.json
├── shared/                   # Código compartilhado
│   ├── types/              # Types compartilhados
│   └── utils/              # Utilitários compartilhados
├── infrastructure/          # Configurações de infraestrutura
│   ├── docker/             # Dockerfiles e compose
│   ├── k8s/               # Manifests Kubernetes
│   └── terraform/         # Infraestrutura como código
├── docs/                    # Documentação
├── .github/                 # GitHub Actions workflows
└── README.md
*/

class ProjectArchitecture {
  static getArchitectureOverview() {
    return {
      description: 'Arquitetura de uma aplicação e-commerce moderna',
      
      // Camadas da aplicação
      layers: {
        presentation: {
          description: 'Camada de apresentação (Frontend)',
          technologies: ['React', 'TypeScript', 'Tailwind CSS', 'React Query'],
          responsibilities: [
            'Interface do usuário',
            'Experiência do usuário',
            'Estado da aplicação',
            'Comunicação com APIs'
          ]
        },
        
        application: {
          description: 'Camada de aplicação (Backend)',
          technologies: ['Node.js', 'Express', 'TypeScript', 'JWT'],
          responsibilities: [
            'Lógica de negócio',
            'Autenticação e autorização',
            'Validação de dados',
            'Orquestração de serviços'
          ]
        },
        
        domain: {
          description: 'Camada de domínio',
          technologies: ['TypeScript', 'Domain Models', 'Business Rules'],
          responsibilities: [
            'Entidades de negócio',
            'Regras de domínio',
            'Casos de uso',
            'Interfaces de repositório'
          ]
        },
        
        infrastructure: {
          description: 'Camada de infraestrutura',
          technologies: ['MongoDB', 'Redis', 'Stripe', 'AWS S3'],
          responsibilities: [
            'Persistência de dados',
            'Serviços externos',
            'Cache',
            'Armazenamento de arquivos'
          ]
        }
      },
      
      // Padrões arquiteturais
      patterns: {
        mvc: {
          description: 'Model-View-Controller para organização do código',
          implementation: 'Separação clara entre modelos, views e controladores'
        },
        
        repository: {
          description: 'Repository pattern para abstração de dados',
          implementation: 'Interfaces para acesso a dados independente da tecnologia'
        },
        
        dependency_injection: {
          description: 'Injeção de dependência para baixo acoplamento',
          implementation: 'Container de DI para gerenciar dependências'
        },
        
        cqrs: {
          description: 'Command Query Responsibility Segregation',
          implementation: 'Separação entre comandos (write) e queries (read)'
        }
      }
    };
  }
  
  // Definir entidades do domínio
  static getDomainEntities() {
    return {
      user: {
        description: 'Entidade usuário do sistema',
        properties: {
          id: 'string',
          email: 'string',
          password: 'string (hash)',
          firstName: 'string',
          lastName: 'string',
          role: 'UserRole',
          addresses: 'Address[]',
          createdAt: 'Date',
          updatedAt: 'Date'
        },
        relationships: {
          orders: 'hasMany Order',
          cart: 'hasOne Cart',
          reviews: 'hasMany Review'
        }
      },
      
      product: {
        description: 'Entidade produto',
        properties: {
          id: 'string',
          name: 'string',
          description: 'string',
          price: 'number',
          category: 'Category',
          images: 'string[]',
          stock: 'number',
          sku: 'string',
          isActive: 'boolean',
          createdAt: 'Date',
          updatedAt: 'Date'
        },
        relationships: {
          category: 'belongsTo Category',
          reviews: 'hasMany Review',
          orderItems: 'hasMany OrderItem'
        }
      },
      
      order: {
        description: 'Entidade pedido',
        properties: {
          id: 'string',
          userId: 'string',
          status: 'OrderStatus',
          items: 'OrderItem[]',
          totalAmount: 'number',
          shippingAddress: 'Address',
          paymentMethod: 'PaymentMethod',
          paymentStatus: 'PaymentStatus',
          createdAt: 'Date',
          updatedAt: 'Date'
        },
        relationships: {
          user: 'belongsTo User',
          items: 'hasMany OrderItem',
          payment: 'hasOne Payment'
        }
      },
      
      category: {
        description: 'Entidade categoria de produtos',
        properties: {
          id: 'string',
          name: 'string',
          description: 'string',
          parentId: 'string | null',
          isActive: 'boolean',
          createdAt: 'Date',
          updatedAt: 'Date'
        },
        relationships: {
          parent: 'belongsTo Category',
          children: 'hasMany Category',
          products: 'hasMany Product'
        }
      }
    };
  }
}

// =============================================================================
// 2. CONFIGURAÇÃO DO PROJETO
// =============================================================================

/*
Configuração inicial do projeto com todas as dependências
e estrutura necessária para desenvolvimento.
*/

class ProjectSetup {
  // Configuração do package.json do frontend
  static getFrontendPackageJson() {
    return {
      name: 'ecommerce-frontend',
      version: '1.0.0',
      description: 'Frontend da aplicação e-commerce',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
        'lint:fix': 'eslint src --ext ts,tsx --fix',
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.8.0',
        '@tanstack/react-query': '^4.24.0',
        zustand: '^4.3.0',
        axios: '^1.3.0',
        'react-hook-form': '^7.43.0',
        '@hookform/resolvers': '^2.9.0',
        zod: '^3.20.0',
        'lucide-react': '^0.105.0',
        clsx: '^1.2.0',
        'tailwind-merge': '^1.10.0'
      },
      devDependencies: {
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        '@typescript-eslint/eslint-plugin': '^5.0.0',
        '@typescript-eslint/parser': '^5.0.0',
        '@vitejs/plugin-react': '^3.0.0',
        autoprefixer: '^10.4.0',
        eslint: '^8.0.0',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-react-refresh': '^0.3.0',
        jest: '^29.0.0',
        '@testing-library/react': '^13.0.0',
        '@testing-library/jest-dom': '^5.16.0',
        '@testing-library/user-event': '^14.0.0',
        postcss: '^8.4.0',
        tailwindcss: '^3.2.0',
        typescript: '^4.9.0',
        vite: '^4.0.0'
      }
    };
  }
  
  // Configuração do package.json do backend
  static getBackendPackageJson() {
    return {
      name: 'ecommerce-backend',
      version: '1.0.0',
      description: 'Backend da aplicação e-commerce',
      scripts: {
        dev: 'tsx watch src/server.ts',
        build: 'tsc',
        start: 'node dist/server.js',
        test: 'jest',
        'test:watch': 'jest --watch',
        'test:coverage': 'jest --coverage',
        lint: 'eslint src --ext ts --report-unused-disable-directives --max-warnings 0',
        'lint:fix': 'eslint src --ext ts --fix',
        'type-check': 'tsc --noEmit',
        'db:migrate': 'prisma migrate dev',
        'db:generate': 'prisma generate',
        'db:seed': 'tsx src/database/seed.ts'
      },
      dependencies: {
        express: '^4.18.0',
        '@types/express': '^4.17.0',
        cors: '^2.8.0',
        '@types/cors': '^2.8.0',
        helmet: '^6.0.0',
        'express-rate-limit': '^6.7.0',
        jsonwebtoken: '^9.0.0',
        '@types/jsonwebtoken': '^9.0.0',
        bcryptjs: '^2.4.0',
        '@types/bcryptjs': '^2.4.0',
        zod: '^3.20.0',
        '@prisma/client': '^4.10.0',
        prisma: '^4.10.0',
        redis: '^4.6.0',
        '@types/redis': '^4.0.0',
        stripe: '^11.0.0',
        nodemailer: '^6.9.0',
        '@types/nodemailer': '^6.4.0',
        winston: '^3.8.0',
        dotenv: '^16.0.0'
      },
      devDependencies: {
        '@types/node': '^18.0.0',
        '@typescript-eslint/eslint-plugin': '^5.0.0',
        '@typescript-eslint/parser': '^5.0.0',
        eslint: '^8.0.0',
        jest: '^29.0.0',
        '@types/jest': '^29.0.0',
        'ts-jest': '^29.0.0',
        supertest: '^6.3.0',
        '@types/supertest': '^2.0.0',
        tsx: '^3.12.0',
        typescript: '^4.9.0'
      }
    };
  }
  
  // Configuração do TypeScript
  static getTypeScriptConfig() {
    return {
      frontend: {
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          moduleResolution: 'bundler',
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
            '@/components/*': ['./src/components/*'],
            '@/pages/*': ['./src/pages/*'],
            '@/hooks/*': ['./src/hooks/*'],
            '@/services/*': ['./src/services/*'],
            '@/store/*': ['./src/store/*'],
            '@/types/*': ['./src/types/*'],
            '@/utils/*': ['./src/utils/*']
          }
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }]
      },
      
      backend: {
        compilerOptions: {
          target: 'ES2020',
          module: 'commonjs',
          lib: ['ES2020'],
          outDir: './dist',
          rootDir: './src',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true,
          declaration: true,
          declarationMap: true,
          sourceMap: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noImplicitReturns: true,
          noFallthroughCasesInSwitch: true,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
            '@/controllers/*': ['./src/controllers/*'],
            '@/models/*': ['./src/models/*'],
            '@/routes/*': ['./src/routes/*'],
            '@/middleware/*': ['./src/middleware/*'],
            '@/services/*': ['./src/services/*'],
            '@/types/*': ['./src/types/*'],
            '@/utils/*': ['./src/utils/*']
          }
        },
        include: ['src/**/*'],
        exclude: ['node_modules', 'dist', 'tests']
      }
    };
  }
  
  // Configuração do Vite (Frontend)
  static getViteConfig() {
    return `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/pages': path.resolve(__dirname, './src/pages'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
    `;
  }
}

// =============================================================================
// 3. TIPOS COMPARTILHADOS
// =============================================================================

/*
Definições de tipos TypeScript compartilhadas entre frontend e backend.
Essas definições garantem consistência de dados em toda a aplicação.
*/

class SharedTypes {
  static getCommonTypes() {
    return `
// =============================================================================
// TIPOS BÁSICOS
// =============================================================================

export type ID = string;
export type Timestamp = Date;

// =============================================================================
// ENUMS
// =============================================================================

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
  PAYPAL = 'paypal'
}

// =============================================================================
// ENTIDADES PRINCIPAIS
// =============================================================================

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  addresses: Address[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  id: ID;
  userId: ID;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: ID;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  categoryId: ID;
  category?: Category;
  images: ProductImage[];
  stock: number;
  sku: string;
  weight?: number;
  dimensions?: ProductDimensions;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ProductImage {
  id: ID;
  productId: ID;
  url: string;
  alt: string;
  order: number;
  isMain: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface Category {
  id: ID;
  name: string;
  description?: string;
  slug: string;
  parentId?: ID;
  parent?: Category;
  children?: Category[];
  image?: string;
  isActive: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Cart {
  id: ID;
  userId?: ID;
  sessionId?: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CartItem {
  id: ID;
  cartId: ID;
  productId: ID;
  product?: Product;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: ID;
  orderNumber: string;
  userId: ID;
  user?: User;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Timestamp;
  deliveredAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderItem {
  id: ID;
  orderId: ID;
  productId: ID;
  product?: Product;
  quantity: number;
  price: number;
  totalPrice: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: ID;
  userId: ID;
  user?: User;
  productId: ID;
  product?: Product;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// =============================================================================
// TIPOS DE REQUEST/RESPONSE
// =============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProductFilters {
  categoryId?: ID;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  tags?: string[];
  search?: string;
}

export interface ProductSort {
  field: 'name' | 'price' | 'createdAt' | 'rating';
  direction: 'asc' | 'desc';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}

// =============================================================================
// TIPOS DE VALIDAÇÃO
// =============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormErrors {
  [key: string]: string | string[];
}

// =============================================================================
// TIPOS DE ESTADO (FRONTEND)
// =============================================================================

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  sort: ProductSort;
  pagination: PaginationParams;
  isLoading: boolean;
  error: string | null;
}

// =============================================================================
// TIPOS DE CONFIGURAÇÃO
// =============================================================================

export interface AppConfig {
  apiUrl: string;
  stripePublicKey: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    reviews: boolean;
    wishlist: boolean;
    recommendations: boolean;
    analytics: boolean;
  };
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}
    `;
  }
}

// =============================================================================
// 4. ESTRUTURA DO FRONTEND
// =============================================================================

/*
Estrutura e componentes principais do frontend React com TypeScript.
*/

class FrontendStructure {
  // Componente principal da aplicação
  static getAppComponent() {
    return `
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from '@/components/layouts/MainLayout';
import AdminLayout from '@/components/layouts/AdminLayout';

// Pages
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ProfilePage from '@/pages/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminProducts from '@/pages/admin/Products';
import AdminOrders from '@/pages/admin/Orders';
import AdminUsers from '@/pages/admin/Users';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoute from '@/components/auth/AdminRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Hooks
import { useAuthStore } from '@/store/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const { isLoading, initializeAuth } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailPage />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>
            </Routes>

            {/* Global Components */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </Router>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
    `;
  }
  
  // Store de autenticação com Zustand
  static getAuthStore() {
    return `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '@/types';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()()
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.login({ email, password });
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Login realizado com sucesso!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authService.register(data);
          
          set({
            user: response.user,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          
          toast.success('Conta criada com sucesso!');
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Erro ao criar conta';
          set({ error: errorMessage, isLoading: false });
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
        
        // Clear any cached data
        localStorage.removeItem('auth-storage');
        
        toast.success('Logout realizado com sucesso!');
      },

      refreshAuth: async () => {
        try {
          const { refreshToken } = get();
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await authService.refreshToken(refreshToken);
          
          set({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      initializeAuth: () => {
        const { accessToken, user } = get();
        
        if (accessToken && user) {
          set({ isAuthenticated: true });
        }
        
        set({ isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
    `;
  }
  
  // Serviço de API
  static getApiService() {
    return `
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken) {
      config.headers.Authorization = \`Bearer \${accessToken}\`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useAuthStore.getState().refreshAuth();
        
        // Retry original request with new token
        const { accessToken } = useAuthStore.getState();
        originalRequest.headers.Authorization = \`Bearer \${accessToken}\`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    if (error.response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.');
    } else if (error.response?.status === 404) {
      toast.error('Recurso não encontrado.');
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Erro de conexão. Verifique sua internet.');
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiService = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.get(url, config).then((response) => response.data);
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return api.post(url, data, config).then((response) => response.data);
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return api.put(url, data, config).then((response) => response.data);
  },
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return api.patch(url, data, config).then((response) => response.data);
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.delete(url, config).then((response) => response.data);
  },
};

export default api;
    `;
  }
}

// Função de inicialização do módulo
function initializeIntegratedProject() {
  console.log('🚀 Módulo 5: Projeto Integrado - E-commerce Platform');
  console.log('====================================================');
  
  console.log('\n📋 Escopo do Projeto:');
  console.log('- Frontend React com TypeScript');
  console.log('- Backend Node.js com Express');
  console.log('- Banco de dados com Prisma ORM');
  console.log('- Autenticação JWT');
  console.log('- Sistema de pagamentos com Stripe');
  console.log('- Testes automatizados');
  console.log('- CI/CD com GitHub Actions');
  console.log('- Deploy em produção');
  console.log('- Monitoramento e observabilidade');
  
  console.log('\n🏗️ Arquitetura:');
  const architecture = ProjectArchitecture.getArchitectureOverview();
  Object.entries(architecture.layers).forEach(([layer, config]) => {
    console.log(`\n${layer.toUpperCase()}:`);
    console.log(`- ${config.description}`);
    console.log(`- Tecnologias: ${config.technologies.join(', ')}`);
  });
  
  console.log('\n📦 Configuração:');
  console.log('- TypeScript strict mode habilitado');
  console.log('- ESLint + Prettier configurados');
  console.log('- Husky para git hooks');
  console.log('- Jest para testes');
  console.log('- Vite para build otimizado');
  
  console.log('\n🎯 Próximos passos:');
  console.log('1. Configurar estrutura do projeto');
  console.log('2. Implementar backend com APIs');
  console.log('3. Desenvolver frontend React');
  console.log('4. Integrar sistema de pagamentos');
  console.log('5. Implementar testes');
  console.log('6. Configurar CI/CD');
  console.log('7. Deploy em produção');
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeIntegratedProject();
}

module.exports = {
  ProjectArchitecture,
  ProjectSetup,
  SharedTypes,
  FrontendStructure,
  initializeIntegratedProject
};

/*
=============================================================================
                        INÍCIO DO MÓDULO 5
                      PROJETO INTEGRADO
=============================================================================

Este é o módulo final que integra todos os conhecimentos adquiridos nos
módulos anteriores em um projeto real e completo.

O projeto será desenvolvido seguindo as melhores práticas de:
- Arquitetura de software
- Desenvolvimento orientado a testes
- Integração e deploy contínuo
- Monitoramento e observabilidade
- Performance e otimização

🎓 Este é o momento de aplicar tudo que foi aprendido!
=============================================================================
*/