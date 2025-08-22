/*
=============================================================================
                    MÓDULO 4: TYPESCRIPT E FERRAMENTAS
                         05 - DEPLOY E CI/CD
=============================================================================

Este arquivo aborda deploy de aplicações e integração contínua/entrega contínua
(CI/CD), incluindo plataformas de deploy, pipelines automatizados e monitoramento.

📚 TÓPICOS ABORDADOS:
- Estratégias de deploy
- Plataformas de hospedagem
- CI/CD com GitHub Actions
- Docker e containerização
- Monitoramento e logging
- Performance e otimização

*/

// =============================================================================
// 1. CONCEITOS DE DEPLOY
// =============================================================================

/*
Deploy é o processo de disponibilizar uma aplicação para usuários finais,
envolvendo build, configuração de ambiente e distribuição.
*/

class DeploymentConcepts {
  // Tipos de deploy
  static getDeploymentTypes() {
    return {
      static: {
        description: 'Sites estáticos servidos via CDN',
        characteristics: [
          'Apenas HTML, CSS, JavaScript',
          'Sem processamento server-side',
          'Alta performance e escalabilidade',
          'Baixo custo de hospedagem'
        ],
        platforms: ['Netlify', 'Vercel', 'GitHub Pages', 'AWS S3'],
        useCases: [
          'Landing pages',
          'Blogs estáticos',
          'Documentação',
          'SPAs (Single Page Applications)'
        ]
      },
      
      serverSide: {
        description: 'Aplicações com processamento no servidor',
        characteristics: [
          'Renderização server-side',
          'APIs e banco de dados',
          'Lógica de negócio no backend',
          'Gerenciamento de estado no servidor'
        ],
        platforms: ['Heroku', 'Railway', 'DigitalOcean', 'AWS EC2'],
        useCases: [
          'Aplicações web completas',
          'APIs RESTful',
          'E-commerce',
          'Sistemas corporativos'
        ]
      },
      
      hybrid: {
        description: 'Combinação de estático e dinâmico',
        characteristics: [
          'SSG + API routes',
          'Edge functions',
          'Renderização incremental',
          'Otimização automática'
        ],
        platforms: ['Vercel', 'Netlify', 'AWS Amplify'],
        useCases: [
          'Next.js applications',
          'JAMstack sites',
          'E-commerce moderno',
          'Aplicações enterprise'
        ]
      },
      
      containerized: {
        description: 'Aplicações em containers Docker',
        characteristics: [
          'Ambiente isolado e reproduzível',
          'Escalabilidade horizontal',
          'Orquestração com Kubernetes',
          'Microserviços'
        ],
        platforms: ['Docker Hub', 'AWS ECS', 'Google Cloud Run', 'Azure Container'],
        useCases: [
          'Microserviços',
          'Aplicações enterprise',
          'Sistemas distribuídos',
          'DevOps avançado'
        ]
      }
    };
  }
  
  // Estratégias de deploy
  static getDeploymentStrategies() {
    return {
      blueGreen: {
        description: 'Duas versões paralelas, troca instantânea',
        process: [
          'Manter versão atual (Blue) em produção',
          'Preparar nova versão (Green) em paralelo',
          'Testar Green completamente',
          'Trocar tráfego de Blue para Green',
          'Manter Blue como backup'
        ],
        advantages: [
          'Zero downtime',
          'Rollback instantâneo',
          'Testes em ambiente idêntico',
          'Redução de riscos'
        ],
        disadvantages: [
          'Dobro de recursos necessários',
          'Complexidade de sincronização',
          'Custo mais alto'
        ]
      },
      
      canary: {
        description: 'Deploy gradual para subset de usuários',
        process: [
          'Deploy para pequeno grupo (5-10%)',
          'Monitorar métricas e erros',
          'Aumentar gradualmente (25%, 50%, 100%)',
          'Rollback se problemas detectados'
        ],
        advantages: [
          'Detecção precoce de problemas',
          'Impacto limitado em caso de falha',
          'Feedback real de usuários',
          'Redução de riscos'
        ],
        disadvantages: [
          'Complexidade de roteamento',
          'Monitoramento intensivo necessário',
          'Tempo de deploy mais longo'
        ]
      },
      
      rollingUpdate: {
        description: 'Atualização gradual de instâncias',
        process: [
          'Atualizar uma instância por vez',
          'Verificar saúde da instância',
          'Continuar para próxima instância',
          'Manter disponibilidade durante processo'
        ],
        advantages: [
          'Sem downtime',
          'Uso eficiente de recursos',
          'Rollback granular',
          'Adequado para microserviços'
        ],
        disadvantages: [
          'Deploy mais lento',
          'Versões mistas temporariamente',
          'Complexidade de versionamento'
        ]
      },
      
      recreate: {
        description: 'Parar versão atual, iniciar nova',
        process: [
          'Parar todas as instâncias atuais',
          'Fazer deploy da nova versão',
          'Iniciar novas instâncias',
          'Verificar funcionamento'
        ],
        advantages: [
          'Simplicidade',
          'Sem problemas de versionamento',
          'Menor uso de recursos',
          'Adequado para desenvolvimento'
        ],
        disadvantages: [
          'Downtime durante deploy',
          'Impacto em usuários',
          'Rollback mais lento'
        ]
      }
    };
  }
  
  // Ambientes de deploy
  static getDeploymentEnvironments() {
    return {
      development: {
        purpose: 'Desenvolvimento ativo',
        characteristics: [
          'Mudanças frequentes',
          'Debug habilitado',
          'Hot reload',
          'Dados de teste'
        ],
        configuration: {
          NODE_ENV: 'development',
          DEBUG: true,
          HOT_RELOAD: true,
          API_URL: 'http://localhost:8080'
        }
      },
      
      staging: {
        purpose: 'Testes e validação',
        characteristics: [
          'Ambiente similar à produção',
          'Testes de integração',
          'Validação de stakeholders',
          'Dados similares à produção'
        ],
        configuration: {
          NODE_ENV: 'staging',
          DEBUG: false,
          API_URL: 'https://api-staging.example.com',
          MONITORING: true
        }
      },
      
      production: {
        purpose: 'Usuários finais',
        characteristics: [
          'Máxima estabilidade',
          'Performance otimizada',
          'Monitoramento completo',
          'Dados reais'
        ],
        configuration: {
          NODE_ENV: 'production',
          DEBUG: false,
          MINIFY: true,
          API_URL: 'https://api.example.com',
          MONITORING: true,
          ANALYTICS: true
        }
      }
    };
  }
}

// =============================================================================
// 2. PLATAFORMAS DE HOSPEDAGEM
// =============================================================================

/*
Diferentes plataformas oferecem soluções específicas para tipos
variados de aplicações e necessidades.
*/

class HostingPlatforms {
  // Netlify - Static sites e JAMstack
  static getNetlifyConfig() {
    return {
      description: 'Plataforma especializada em sites estáticos e JAMstack',
      
      features: [
        'Deploy automático via Git',
        'CDN global',
        'HTTPS automático',
        'Edge functions',
        'Form handling',
        'Split testing',
        'Branch deploys'
      ],
      
      // netlify.toml
      configuration: {
        build: {
          publish: 'dist',
          command: 'npm run build'
        },
        
        // Redirects e rewrites
        redirects: [
          {
            from: '/api/*',
            to: 'https://api.example.com/:splat',
            status: 200
          },
          {
            from: '/*',
            to: '/index.html',
            status: 200
          }
        ],
        
        // Headers de segurança
        headers: [
          {
            for: '/*',
            values: {
              'X-Frame-Options': 'DENY',
              'X-XSS-Protection': '1; mode=block',
              'X-Content-Type-Options': 'nosniff'
            }
          }
        ],
        
        // Environment variables
        context: {
          production: {
            environment: {
              NODE_ENV: 'production',
              API_URL: 'https://api.example.com'
            }
          },
          'branch-deploy': {
            environment: {
              NODE_ENV: 'staging',
              API_URL: 'https://api-staging.example.com'
            }
          }
        }
      },
      
      // Edge functions
      edgeFunctions: {
        'hello-world': {
          path: '/api/hello',
          function: `
            export default async (request, context) => {
              return new Response(JSON.stringify({
                message: 'Hello from edge!',
                location: context.geo.city,
                timestamp: new Date().toISOString()
              }), {
                headers: {
                  'content-type': 'application/json'
                }
              });
            };
          `
        }
      },
      
      pricing: {
        free: {
          bandwidth: '100GB/month',
          builds: '300 minutes/month',
          sites: 'Unlimited',
          functions: '125k invocations/month'
        },
        pro: {
          price: '$19/month',
          bandwidth: '1TB/month',
          builds: '25,000 minutes/month',
          functions: '2M invocations/month'
        }
      }
    };
  }
  
  // Vercel - Next.js e React
  static getVercelConfig() {
    return {
      description: 'Plataforma otimizada para React, Next.js e frontend moderno',
      
      features: [
        'Deploy automático',
        'Edge Network global',
        'Serverless functions',
        'Image optimization',
        'Analytics integrado',
        'Preview deployments',
        'Edge middleware'
      ],
      
      // vercel.json
      configuration: {
        version: 2,
        
        // Build settings
        builds: [
          {
            src: 'package.json',
            use: '@vercel/next'
          }
        ],
        
        // Serverless functions
        functions: {
          'pages/api/**/*.js': {
            runtime: 'nodejs18.x',
            maxDuration: 10
          }
        },
        
        // Redirects
        redirects: [
          {
            source: '/old-page',
            destination: '/new-page',
            permanent: true
          }
        ],
        
        // Headers
        headers: [
          {
            source: '/api/(.*)',
            headers: [
              {
                key: 'Access-Control-Allow-Origin',
                value: '*'
              }
            ]
          }
        ],
        
        // Environment variables
        env: {
          CUSTOM_KEY: 'value',
          DATABASE_URL: '@database-url'
        }
      },
      
      // Edge middleware
      middleware: `
        import { NextResponse } from 'next/server';
        
        export function middleware(request) {
          // Geolocation
          const country = request.geo.country || 'US';
          
          // A/B testing
          const bucket = Math.random() < 0.5 ? 'a' : 'b';
          
          const response = NextResponse.next();
          response.cookies.set('bucket', bucket);
          
          return response;
        }
        
        export const config = {
          matcher: '/experiment/:path*'
        };
      `,
      
      pricing: {
        hobby: {
          price: 'Free',
          bandwidth: '100GB',
          functions: '100GB-hrs',
          domains: 'Unlimited'
        },
        pro: {
          price: '$20/month',
          bandwidth: '1TB',
          functions: '1000GB-hrs',
          analytics: 'Advanced'
        }
      }
    };
  }
  
  // Heroku - Full-stack applications
  static getHerokuConfig() {
    return {
      description: 'Plataforma para aplicações full-stack com add-ons',
      
      features: [
        'Git-based deployment',
        'Add-ons ecosystem',
        'Automatic scaling',
        'Multiple languages',
        'Database integration',
        'Monitoring tools',
        'Review apps'
      ],
      
      // Procfile
      procfile: {
        web: 'node server.js',
        worker: 'node worker.js',
        scheduler: 'node scheduler.js'
      },
      
      // app.json for review apps
      appJson: {
        name: 'My App',
        description: 'A sample Node.js app',
        repository: 'https://github.com/user/repo',
        
        env: {
          NODE_ENV: {
            description: 'Environment',
            value: 'production'
          },
          SECRET_KEY: {
            description: 'Secret key for sessions',
            generator: 'secret'
          }
        },
        
        addons: [
          'heroku-postgresql:hobby-dev',
          'heroku-redis:hobby-dev'
        ],
        
        buildpacks: [
          {
            url: 'heroku/nodejs'
          }
        ]
      },
      
      // Common add-ons
      addons: {
        database: {
          postgresql: 'heroku-postgresql',
          mysql: 'jawsdb',
          mongodb: 'mongolab'
        },
        
        caching: {
          redis: 'heroku-redis',
          memcached: 'memcachier'
        },
        
        monitoring: {
          newrelic: 'newrelic',
          papertrail: 'papertrail',
          sentry: 'sentry'
        },
        
        email: {
          sendgrid: 'sendgrid',
          mailgun: 'mailgun'
        }
      },
      
      deployment: {
        commands: [
          'heroku create app-name',
          'heroku addons:create heroku-postgresql:hobby-dev',
          'heroku config:set NODE_ENV=production',
          'git push heroku main',
          'heroku run npm run migrate',
          'heroku open'
        ]
      },
      
      pricing: {
        free: {
          price: 'Free',
          hours: '550-1000/month',
          memory: '512MB',
          limitations: 'Sleeps after 30min inactivity'
        },
        hobby: {
          price: '$7/month',
          hours: 'Always on',
          memory: '512MB',
          ssl: 'Included'
        },
        standard: {
          price: '$25-500/month',
          memory: '1GB-14GB',
          features: 'Metrics, threshold alerts'
        }
      }
    };
  }
  
  // Railway - Modern alternative to Heroku
  static getRailwayConfig() {
    return {
      description: 'Plataforma moderna para deploy de aplicações full-stack',
      
      features: [
        'Git-based deployment',
        'Database provisioning',
        'Environment management',
        'Automatic HTTPS',
        'Custom domains',
        'Metrics dashboard',
        'CLI tools'
      ],
      
      // railway.toml
      configuration: {
        build: {
          builder: 'NIXPACKS',
          buildCommand: 'npm run build'
        },
        
        deploy: {
          startCommand: 'npm start',
          healthcheckPath: '/health',
          healthcheckTimeout: 300,
          restartPolicyType: 'ON_FAILURE',
          restartPolicyMaxRetries: 10
        }
      },
      
      // Environment variables
      environment: {
        NODE_ENV: 'production',
        PORT: '$PORT',
        DATABASE_URL: '$DATABASE_URL'
      },
      
      // Services
      services: {
        web: {
          source: 'repo',
          domains: ['app.railway.app', 'custom-domain.com']
        },
        
        database: {
          source: 'postgresql',
          plan: 'hobby'
        },
        
        redis: {
          source: 'redis',
          plan: 'hobby'
        }
      },
      
      pricing: {
        hobby: {
          price: '$5/month',
          usage: '$0.000463/GB-hour',
          features: 'Unlimited projects, custom domains'
        },
        pro: {
          price: '$20/month',
          usage: '$0.000231/GB-hour',
          features: 'Priority support, usage alerts'
        }
      }
    };
  }
}

// =============================================================================
// 3. CI/CD COM GITHUB ACTIONS
// =============================================================================

/*
GitHub Actions permite automatizar workflows de CI/CD
diretamente no repositório.
*/

class GitHubActions {
  // Workflow básico para Node.js
  static getBasicWorkflow() {
    return {
      name: 'CI/CD Pipeline',
      
      // .github/workflows/ci-cd.yml
      workflow: `
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Build application
      run: npm run build
    
    - name: Run E2E tests
      run: npm run test:e2e
      env:
        CI: true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
      env:
        NODE_ENV: production
        REACT_APP_API_URL: \${{ secrets.API_URL }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './dist'
        production-branch: main
        github-token: \${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
      `
    };
  }
  
  // Workflow avançado com múltiplos ambientes
  static getAdvancedWorkflow() {
    return {
      name: 'Advanced CI/CD',
      
      workflow: `
name: Advanced CI/CD

on:
  push:
    branches: [ main, develop, 'feature/*' ]
  pull_request:
    branches: [ main, develop ]
  release:
    types: [ published ]

env:
  NODE_VERSION: '18.x'
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  # Job de análise de código
  code-quality:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      with:
        fetch-depth: 0
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run ESLint
      run: npm run lint:report
    
    - name: Run Prettier check
      run: npm run format:check
    
    - name: Run type checking
      run: npm run type-check
    
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}

  # Job de testes
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:unit
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        REDIS_URL: redis://localhost:6379
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: \${{ matrix.node-version }}

  # Job de build
  build:
    needs: [code-quality, test]
    runs-on: ubuntu-latest
    
    outputs:
      image-digest: \${{ steps.build.outputs.digest }}
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/
        retention-days: 30
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push Docker image
      id: build
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  # Deploy para staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to staging
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: staging.example.com
    
    - name: Run smoke tests
      run: |
        curl -f https://staging.example.com/health || exit 1
        echo "Staging deployment successful"

  # Deploy para produção
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to production
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
        cname: example.com
    
    - name: Run smoke tests
      run: |
        curl -f https://example.com/health || exit 1
        echo "Production deployment successful"
    
    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: \${{ job.status }}
        channel: '#deployments'
        webhook_url: \${{ secrets.SLACK_WEBHOOK }}
      if: always()
      `
    };
  }
  
  // Actions customizadas
  static getCustomActions() {
    return {
      // Action para setup de ambiente
      setupEnvironment: {
        name: 'Setup Environment',
        description: 'Setup Node.js environment with caching',
        
        // action.yml
        definition: `
name: 'Setup Environment'
description: 'Setup Node.js environment with caching'

inputs:
  node-version:
    description: 'Node.js version'
    required: false
    default: '18.x'
  cache-dependency-path:
    description: 'Path to package-lock.json'
    required: false
    default: 'package-lock.json'

runs:
  using: 'composite'
  steps:
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: \${{ inputs.node-version }}
        cache: 'npm'
        cache-dependency-path: \${{ inputs.cache-dependency-path }}
    
    - name: Install dependencies
      run: npm ci
      shell: bash
    
    - name: Cache build
      uses: actions/cache@v3
      with:
        path: |
          .next/cache
          dist
        key: \${{ runner.os }}-build-\${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          \${{ runner.os }}-build-
        `
      },
      
      // Action para deploy
      deployAction: {
        name: 'Deploy Application',
        description: 'Deploy application to specified environment',
        
        definition: `
name: 'Deploy Application'
description: 'Deploy application to specified environment'

inputs:
  environment:
    description: 'Target environment'
    required: true
  api-url:
    description: 'API URL for environment'
    required: true
  deploy-token:
    description: 'Deployment token'
    required: true

outputs:
  deployment-url:
    description: 'URL of deployed application'
    value: \${{ steps.deploy.outputs.url }}

runs:
  using: 'composite'
  steps:
    - name: Build for environment
      run: |
        echo "Building for \${{ inputs.environment }}"
        npm run build
      shell: bash
      env:
        NODE_ENV: \${{ inputs.environment }}
        REACT_APP_API_URL: \${{ inputs.api-url }}
    
    - name: Deploy
      id: deploy
      run: |
        echo "Deploying to \${{ inputs.environment }}"
        # Deploy logic here
        echo "url=https://\${{ inputs.environment }}.example.com" >> \$GITHUB_OUTPUT
      shell: bash
      env:
        DEPLOY_TOKEN: \${{ inputs.deploy-token }}
        `
      }
    };
  }
  
  // Configuração de secrets e environments
  static getSecretsConfiguration() {
    return {
      repositorySecrets: [
        {
          name: 'NETLIFY_AUTH_TOKEN',
          description: 'Token de autenticação do Netlify',
          usage: 'Deploy automático para Netlify'
        },
        {
          name: 'NETLIFY_SITE_ID',
          description: 'ID do site no Netlify',
          usage: 'Identificação do site para deploy'
        },
        {
          name: 'SONAR_TOKEN',
          description: 'Token do SonarCloud',
          usage: 'Análise de qualidade de código'
        },
        {
          name: 'SLACK_WEBHOOK',
          description: 'Webhook do Slack',
          usage: 'Notificações de deploy'
        },
        {
          name: 'DATABASE_URL',
          description: 'URL do banco de dados',
          usage: 'Conexão com banco em testes'
        }
      ],
      
      environments: {
        staging: {
          protection_rules: {
            required_reviewers: 0,
            wait_timer: 0
          },
          secrets: {
            API_URL: 'https://api-staging.example.com',
            DATABASE_URL: 'postgresql://staging-db-url'
          }
        },
        
        production: {
          protection_rules: {
            required_reviewers: 2,
            wait_timer: 5
          },
          secrets: {
            API_URL: 'https://api.example.com',
            DATABASE_URL: 'postgresql://production-db-url'
          }
        }
      }
    };
  }
}

// =============================================================================
// 4. DOCKER E CONTAINERIZAÇÃO
// =============================================================================

/*
Docker permite empacotar aplicações em containers portáveis
que funcionam consistentemente em qualquer ambiente.
*/

class DockerConfiguration {
  // Dockerfile para aplicação Node.js
  static getNodeDockerfile() {
    return {
      description: 'Dockerfile otimizado para aplicações Node.js',
      
      // Dockerfile
      content: `
# Multi-stage build para otimização
FROM node:18-alpine AS base

# Instalar dependências do sistema
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock* ./

# Stage para dependências
FROM base AS deps

# Instalar dependências
RUN npm ci --only=production && npm cache clean --force

# Stage para build
FROM base AS builder

# Instalar todas as dependências (incluindo dev)
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage para produção
FROM base AS runner

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Definir usuário
USER nextjs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]
      `,
      
      // .dockerignore
      dockerignore: `
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.nyc_output
coverage
.next
dist
build
*.log
.DS_Store
Thumbs.db
      `
    };
  }
  
  // Docker Compose para desenvolvimento
  static getDockerCompose() {
    return {
      description: 'Docker Compose para ambiente de desenvolvimento',
      
      // docker-compose.yml
      development: `
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=myapp_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
      `,
      
      // docker-compose.prod.yml
      production: `
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=\${DATABASE_URL}
      - REDIS_URL=\${REDIS_URL}
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:14-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=\${POSTGRES_DB}
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
      `
    };
  }
  
  // Configuração do Nginx
  static getNginxConfig() {
    return {
      description: 'Configuração do Nginx para proxy reverso',
      
      // nginx.conf
      development: `
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
      `,
      
      // nginx.prod.conf
      production: `
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    upstream app {
        server app:3000;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name example.com www.example.com;
        return 301 https://\$server_name\$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name example.com www.example.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_session_timeout 1d;
        ssl_session_cache shared:MozTLS:10m;
        ssl_session_tickets off;

        # Modern configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # HSTS
        add_header Strict-Transport-Security "max-age=63072000" always;

        # Static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            try_files \$uri @proxy;
        }

        # API routes
        location /api/ {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Main application
        location / {
            try_files \$uri @proxy;
        }

        location @proxy {
            proxy_pass http://app;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
      `
    };
  }
  
  // Scripts de deploy com Docker
  static getDeploymentScripts() {
    return {
      description: 'Scripts para automatizar deploy com Docker',
      
      // deploy.sh
      deployScript: `
#!/bin/bash

# Deploy script for Docker application
set -e

# Configuration
IMAGE_NAME="myapp"
CONTAINER_NAME="myapp-container"
PORT="3000"
ENV_FILE=".env.production"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "\${GREEN}Starting deployment...\${NC}"

# Check if .env file exists
if [ ! -f "\$ENV_FILE" ]; then
    echo -e "\${RED}Error: \$ENV_FILE not found!\${NC}"
    exit 1
fi

# Build new image
echo -e "\${YELLOW}Building Docker image...\${NC}"
docker build -t \$IMAGE_NAME:latest .

# Stop and remove existing container
echo -e "\${YELLOW}Stopping existing container...\${NC}"
docker stop \$CONTAINER_NAME 2>/dev/null || true
docker rm \$CONTAINER_NAME 2>/dev/null || true

# Run new container
echo -e "\${YELLOW}Starting new container...\${NC}"
docker run -d \
  --name \$CONTAINER_NAME \
  --env-file \$ENV_FILE \
  -p \$PORT:\$PORT \
  --restart unless-stopped \
  \$IMAGE_NAME:latest

# Wait for container to be ready
echo -e "\${YELLOW}Waiting for application to start...\${NC}"
sleep 10

# Health check
if curl -f http://localhost:\$PORT/health > /dev/null 2>&1; then
    echo -e "\${GREEN}Deployment successful! Application is running on port \$PORT\${NC}"
else
    echo -e "\${RED}Deployment failed! Application is not responding\${NC}"
    docker logs \$CONTAINER_NAME
    exit 1
fi

# Cleanup old images
echo -e "\${YELLOW}Cleaning up old images...\${NC}"
docker image prune -f

echo -e "\${GREEN}Deployment completed successfully!\${NC}"
      `,
      
      // docker-deploy.yml (GitHub Actions)
      githubAction: `
name: Docker Deploy

on:
  push:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: \${{ env.REGISTRY }}
        username: \${{ github.actor }}
        password: \${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}
    
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: \${{ steps.meta.outputs.tags }}
        labels: \${{ steps.meta.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: \${{ secrets.HOST }}
        username: \${{ secrets.USERNAME }}
        key: \${{ secrets.SSH_KEY }}
        script: |
          docker pull \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
          docker stop myapp-container || true
          docker rm myapp-container || true
          docker run -d \
            --name myapp-container \
            --env-file .env.production \
            -p 3000:3000 \
            --restart unless-stopped \
            \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:latest
          docker image prune -f
      `
    };
  }
}

// =============================================================================
// 5. MONITORAMENTO E LOGGING
// =============================================================================

/*
Monitoramento e logging são essenciais para manter aplicações
em produção funcionando corretamente.
*/

class MonitoringLogging {
  // Configuração de logging
  static getLoggingConfig() {
    return {
      description: 'Configuração de logging estruturado',
      
      // Winston logger
      winston: {
        configuration: `
const winston = require('winston');
const { combine, timestamp, errors, json, colorize, simple } = winston.format;

// Custom format for development
const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  simple()
);

// Custom format for production
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  
  transports: [
    // Console transport
    new winston.transports.Console({
      stderrLevels: ['error']
    }),
    
    // File transports for production
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 5242880, // 5MB
        maxFiles: 5
      })
    ] : [])
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  
  // Handle unhandled rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: \`\${duration}ms\`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

module.exports = { logger, requestLogger };
        `,
        
        usage: `
const { logger } = require('./logger');

// Different log levels
logger.error('Database connection failed', { error: err.message });
logger.warn('High memory usage detected', { usage: '85%' });
logger.info('User logged in', { userId: 123, email: 'user@example.com' });
logger.debug('Processing request', { requestId: 'req-123' });

// Structured logging
logger.info('Order created', {
  orderId: 'order-456',
  userId: 123,
  amount: 99.99,
  currency: 'USD',
  timestamp: new Date().toISOString()
});
        `
      }
    };
  }
  
  // Métricas de aplicação
  static getApplicationMetrics() {
    return {
      description: 'Coleta de métricas de performance da aplicação',
      
      // Prometheus metrics
      prometheus: {
        setup: `
const promClient = require('prom-client');

// Create a Registry
const register = new promClient.Registry();

// Add default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type', 'table']
});

// Register metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(databaseQueryDuration);

// Middleware to collect HTTP metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

// Metrics endpoint
const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

module.exports = {
  register,
  metricsMiddleware,
  metricsEndpoint,
  metrics: {
    httpRequestDuration,
    httpRequestTotal,
    activeConnections,
    databaseQueryDuration
  }
};
        `,
        
        usage: `
const { metrics } = require('./metrics');

// Track database queries
const queryTimer = metrics.databaseQueryDuration.startTimer({
  query_type: 'SELECT',
  table: 'users'
});

try {
  const users = await db.query('SELECT * FROM users');
  queryTimer();
  return users;
} catch (error) {
  queryTimer();
  throw error;
}

// Track active connections
server.on('connection', () => {
  metrics.activeConnections.inc();
});

server.on('close', () => {
  metrics.activeConnections.dec();
});
        `
      }
    };
  }
  
  // Health checks
  static getHealthChecks() {
    return {
      description: 'Implementação de health checks para monitoramento',
      
      // Basic health check
      basic: {
        endpoint: '/health',
        implementation: `
const express = require('express');
const app = express();

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});
        `
      },
      
      // Advanced health check
      advanced: {
        endpoint: '/health/detailed',
        implementation: `
const os = require('os');
const { promisify } = require('util');

// Health check with dependencies
app.get('/health/detailed', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalAPI: await checkExternalAPI(),
    diskSpace: checkDiskSpace(),
    memory: checkMemory()
  };
  
  const isHealthy = Object.values(checks).every(check => check.status === 'healthy');
  const status = isHealthy ? 200 : 503;
  
  res.status(status).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks
  });
});

// Individual check functions
async function checkDatabase() {
  try {
    // Simulate database check
    await new Promise(resolve => setTimeout(resolve, 100));
    return { status: 'healthy', responseTime: '100ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkRedis() {
  try {
    // Simulate Redis check
    await new Promise(resolve => setTimeout(resolve, 50));
    return { status: 'healthy', responseTime: '50ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkExternalAPI() {
  try {
    // Simulate external API check
    await new Promise(resolve => setTimeout(resolve, 200));
    return { status: 'healthy', responseTime: '200ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

function checkDiskSpace() {
  const stats = require('fs').statSync('.');
  const free = os.freemem();
  const total = os.totalmem();
  const used = total - free;
  const percentage = (used / total) * 100;
  
  return {
    status: percentage < 90 ? 'healthy' : 'unhealthy',
    usage: \`\${percentage.toFixed(2)}%\`,
    free: \`\${(free / 1024 / 1024 / 1024).toFixed(2)}GB\`,
    total: \`\${(total / 1024 / 1024 / 1024).toFixed(2)}GB\`
  };
}

function checkMemory() {
  const usage = process.memoryUsage();
  const total = os.totalmem();
  const percentage = (usage.heapUsed / total) * 100;
  
  return {
    status: percentage < 80 ? 'healthy' : 'unhealthy',
    heapUsed: \`\${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB\`,
    heapTotal: \`\${(usage.heapTotal / 1024 / 1024).toFixed(2)}MB\`,
    external: \`\${(usage.external / 1024 / 1024).toFixed(2)}MB\`
  };
}
        `
      },
      
      // Kubernetes health checks
      kubernetes: {
        liveness: {
          description: 'Verifica se o container está vivo',
          path: '/health/live',
          implementation: `
app.get('/health/live', (req, res) => {
  // Liveness probe - verifica se a aplicação está rodando
  res.status(200).json({ status: 'alive' });
});
          `
        },
        
        readiness: {
          description: 'Verifica se o container está pronto para receber tráfego',
          path: '/health/ready',
          implementation: `
let isReady = false;

// Simular inicialização
setTimeout(() => {
  isReady = true;
}, 5000);

app.get('/health/ready', async (req, res) => {
  if (!isReady) {
    return res.status(503).json({ status: 'not ready' });
  }
  
  // Verificar dependências críticas
  const dbReady = await checkDatabase();
  
  if (dbReady.status !== 'healthy') {
    return res.status(503).json({ status: 'not ready', reason: 'database unavailable' });
  }
  
  res.status(200).json({ status: 'ready' });
});
          `
        }
      }
    };
  }
  
  // Alertas e notificações
  static getAlerting() {
    return {
      description: 'Sistema de alertas para monitoramento proativo',
      
      // Configuração de alertas
      rules: {
        highErrorRate: {
          condition: 'error_rate > 5%',
          duration: '5m',
          severity: 'critical',
          message: 'High error rate detected'
        },
        
        highLatency: {
          condition: 'response_time_p95 > 2s',
          duration: '10m',
          severity: 'warning',
          message: 'High latency detected'
        },
        
        lowDiskSpace: {
          condition: 'disk_usage > 90%',
          duration: '1m',
          severity: 'critical',
          message: 'Low disk space'
        },
        
        highMemoryUsage: {
          condition: 'memory_usage > 85%',
          duration: '15m',
          severity: 'warning',
          message: 'High memory usage'
        }
      },
      
      // Canais de notificação
      channels: {
        slack: {
          webhook: process.env.SLACK_WEBHOOK_URL,
          channel: '#alerts',
          implementation: `
const axios = require('axios');

class SlackNotifier {
  constructor(webhookUrl, channel) {
    this.webhookUrl = webhookUrl;
    this.channel = channel;
  }
  
  async sendAlert(alert) {
    const color = this.getSeverityColor(alert.severity);
    
    const payload = {
      channel: this.channel,
      username: 'AlertBot',
      icon_emoji: ':warning:',
      attachments: [{
        color,
        title: \`\${alert.severity.toUpperCase()}: \${alert.title}\`,
        text: alert.message,
        fields: [
          {
            title: 'Service',
            value: alert.service,
            short: true
          },
          {
            title: 'Environment',
            value: alert.environment,
            short: true
          },
          {
            title: 'Time',
            value: new Date().toISOString(),
            short: true
          }
        ],
        footer: 'Monitoring System'
      }]
    };
    
    await axios.post(this.webhookUrl, payload);
  }
  
  getSeverityColor(severity) {
    const colors = {
      critical: '#FF0000',
      warning: '#FFA500',
      info: '#0000FF'
    };
    return colors[severity] || '#808080';
  }
}
          `
        },
        
        email: {
          smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true
          },
          implementation: `
const nodemailer = require('nodemailer');

class EmailNotifier {
  constructor(smtpConfig) {
    this.transporter = nodemailer.createTransporter(smtpConfig);
  }
  
  async sendAlert(alert) {
    const mailOptions = {
      from: process.env.ALERT_FROM_EMAIL,
      to: process.env.ALERT_TO_EMAIL,
      subject: \`[\${alert.severity.toUpperCase()}] \${alert.title}\`,
      html: \`
        <h2>Alert: \${alert.title}</h2>
        <p><strong>Severity:</strong> \${alert.severity}</p>
        <p><strong>Service:</strong> \${alert.service}</p>
        <p><strong>Environment:</strong> \${alert.environment}</p>
        <p><strong>Message:</strong> \${alert.message}</p>
        <p><strong>Time:</strong> \${new Date().toISOString()}</p>
        
        <h3>Details:</h3>
        <pre>\${JSON.stringify(alert.details, null, 2)}</pre>
      \`
    };
    
    await this.transporter.sendMail(mailOptions);
  }
}
          `
        }
      }
    };
  }
}

// =============================================================================
// 6. PERFORMANCE E OTIMIZAÇÃO
// =============================================================================

/*
Otimizações de performance são cruciais para aplicações em produção,
incluindo cache, CDN, compressão e otimização de assets.
*/

class PerformanceOptimization {
  // Estratégias de cache
  static getCachingStrategies() {
    return {
      description: 'Diferentes estratégias de cache para otimização',
      
      // Cache de aplicação
      applicationCache: {
        inMemory: {
          description: 'Cache em memória para dados frequentemente acessados',
          implementation: `
class MemoryCache {
  constructor(ttl = 300000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value, customTtl) {
    const expiry = Date.now() + (customTtl || this.ttl);
    this.cache.set(key, { value, expiry });
  }
  
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  delete(key) {
    return this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Cleanup expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Usage
const cache = new MemoryCache();

// Cache middleware
const cacheMiddleware = (duration = 300000) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(data) {
      cache.set(key, data, duration);
      return originalJson.call(this, data);
    };
    
    next();
  };
};
          `
        },
        
        redis: {
          description: 'Cache distribuído com Redis',
          implementation: `
const redis = require('redis');

class RedisCache {
  constructor(redisUrl) {
    this.client = redis.createClient({ url: redisUrl });
    this.client.connect();
  }
  
  async set(key, value, ttl = 300) {
    await this.client.setEx(key, ttl, JSON.stringify(value));
  }
  
  async get(key) {
    const value = await this.client.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async delete(key) {
    await this.client.del(key);
  }
  
  async clear() {
    await this.client.flushAll();
  }
}

// Cache middleware for Redis
const redisCacheMiddleware = (redisCache, duration = 300) => {
  return async (req, res, next) => {
    const key = \`cache:\${req.originalUrl}\`;
    
    try {
      const cached = await redisCache.get(key);
      
      if (cached) {
        return res.json(cached);
      }
      
      const originalJson = res.json;
      res.json = async function(data) {
        await redisCache.set(key, data, duration);
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};
          `
        }
      },
      
      // Cache HTTP
      httpCache: {
        headers: {
          description: 'Headers de cache para controle de cache do navegador',
          implementation: `
// Cache headers middleware
const setCacheHeaders = (maxAge = 3600) => {
  return (req, res, next) => {
    // Cache for static assets
    if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
      res.set({
        'Cache-Control': \`public, max-age=\${maxAge * 24 * 7}\`, // 1 week
        'Expires': new Date(Date.now() + maxAge * 24 * 7 * 1000).toUTCString()
      });
    }
    // Cache for API responses
    else if (req.url.startsWith('/api/')) {
      res.set({
        'Cache-Control': \`public, max-age=\${maxAge}\`, // 1 hour
        'ETag': generateETag(req.url)
      });
    }
    // No cache for dynamic content
    else {
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
    }
    
    next();
  };
};

function generateETag(url) {
   return require('crypto')
     .createHash('md5')
     .update(url + Date.now())
     .digest('hex');
 }
           `
         }
       }
     };
   }
   
   // CDN e otimização de assets
   static getCDNOptimization() {
     return {
       description: 'Configuração de CDN e otimização de assets',
       
       // Configuração de CDN
       cdn: {
         cloudflare: {
           description: 'Configuração do Cloudflare como CDN',
           features: [
             'Cache automático de assets estáticos',
             'Compressão Brotli/Gzip',
             'Minificação automática',
             'Image optimization',
             'DDoS protection',
             'SSL/TLS automático'
           ],
           
           configuration: {
             // Page Rules
             pageRules: [
               {
                 url: '*.example.com/static/*',
                 settings: {
                   cacheLevel: 'Cache Everything',
                   edgeCacheTtl: '1 month',
                   browserCacheTtl: '1 week'
                 }
               },
               {
                 url: '*.example.com/api/*',
                 settings: {
                   cacheLevel: 'Bypass',
                   disableApps: true
                 }
               }
             ],
             
             // Workers
             worker: `
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // Add security headers
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Cache static assets
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000');
  }
  
  return newResponse;
}
             `
           }
         },
         
         aws: {
           description: 'AWS CloudFront como CDN',
           configuration: {
             // CloudFormation template
             template: `
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CloudFront distribution for web application'

Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        Comment: 'Web application CDN'
        DefaultRootObject: 'index.html'
        
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt S3Bucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/\${OriginAccessIdentity}'
        
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad # Managed-CachingOptimized
          OriginRequestPolicyId: 88a5eaf4-2fd4-4709-b370-b4c650ea3fcf # Managed-CORS-S3Origin
        
        CacheBehaviors:
          - PathPattern: '/api/*'
            TargetOriginId: S3Origin
            ViewerProtocolPolicy: https-only
            CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
            TTL:
              DefaultTTL: 0
              MaxTTL: 0
        
        ViewerCertificate:
          AcmCertificateArn: !Ref SSLCertificate
          SslSupportMethod: sni-only
        
        Aliases:
          - example.com
          - www.example.com
             `
           }
         }
       },
       
       // Compressão
       compression: {
         gzip: {
           description: 'Compressão Gzip para reduzir tamanho de arquivos',
           implementation: `
const compression = require('compression');

// Middleware de compressão
app.use(compression({
  // Comprimir apenas se o arquivo for maior que 1KB
  threshold: 1024,
  
  // Filtrar tipos de arquivo
  filter: (req, res) => {
    // Não comprimir se o cliente não suporta
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Comprimir apenas tipos específicos
    const contentType = res.getHeader('content-type');
    return /text|javascript|json|css|xml|svg/.test(contentType);
  },
  
  // Nível de compressão (1-9, 6 é padrão)
  level: 6,
  
  // Estratégia de compressão
  strategy: compression.constants.Z_DEFAULT_STRATEGY
}));
           `
         },
         
         brotli: {
           description: 'Compressão Brotli (mais eficiente que Gzip)',
           implementation: `
const express = require('express');
const { promisify } = require('util');
const { brotliCompress } = require('zlib');
const brotliCompressAsync = promisify(brotliCompress);

// Middleware Brotli customizado
const brotliMiddleware = () => {
  return async (req, res, next) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    if (!acceptEncoding.includes('br')) {
      return next();
    }
    
    const originalSend = res.send;
    
    res.send = async function(data) {
      if (typeof data === 'string' && data.length > 1024) {
        try {
          const compressed = await brotliCompressAsync(Buffer.from(data));
          
          res.set({
            'Content-Encoding': 'br',
            'Content-Length': compressed.length,
            'Vary': 'Accept-Encoding'
          });
          
          return originalSend.call(this, compressed);
        } catch (error) {
          console.error('Brotli compression error:', error);
        }
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};
           `
         }
       },
       
       // Otimização de imagens
       imageOptimization: {
         sharp: {
           description: 'Otimização de imagens com Sharp',
           implementation: `
const sharp = require('sharp');
const path = require('path');

// Middleware para otimização de imagens
const imageOptimization = () => {
  return async (req, res, next) => {
    if (!req.url.match(/\.(jpg|jpeg|png|webp)$/)) {
      return next();
    }
    
    try {
      const imagePath = path.join(__dirname, 'public', req.url);
      const quality = parseInt(req.query.q) || 80;
      const width = parseInt(req.query.w);
      const height = parseInt(req.query.h);
      const format = req.query.f || 'webp';
      
      let pipeline = sharp(imagePath);
      
      // Redimensionar se especificado
      if (width || height) {
        pipeline = pipeline.resize(width, height, {
          fit: 'cover',
          withoutEnlargement: true
        });
      }
      
      // Converter formato e otimizar
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          res.set('Content-Type', 'image/webp');
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          res.set('Content-Type', 'image/avif');
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality, progressive: true });
          res.set('Content-Type', 'image/jpeg');
          break;
        default:
          return next();
      }
      
      const optimizedImage = await pipeline.toBuffer();
      
      res.set({
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': optimizedImage.length
      });
      
      res.send(optimizedImage);
    } catch (error) {
      console.error('Image optimization error:', error);
      next();
    }
  };
};
           `
         }
       }
     };
   }
 }

// =============================================================================
// 7. APLICAÇÃO DE DEMONSTRAÇÃO
// =============================================================================

/*
Aplicação que demonstra todos os conceitos de deploy e CI/CD
abordados neste módulo.
*/

class DeploymentDemo {
  constructor() {
    this.deploymentStrategies = DeploymentConcepts.getDeploymentTypes();
    this.hostingPlatforms = HostingPlatforms.getNetlifyConfig();
    this.cicdPipelines = GitHubActions.getBasicWorkflow();
    this.dockerConfig = DockerConfiguration.getNodeDockerfile();
    this.monitoring = MonitoringLogging.getLoggingConfig();
    this.performance = PerformanceOptimization.getCachingStrategies();
  }
  
  // Demonstrar diferentes estratégias de deploy
  demonstrateDeploymentStrategies() {
    console.log('\n=== ESTRATÉGIAS DE DEPLOY ===');
    
    Object.entries(this.deploymentStrategies).forEach(([type, config]) => {
      console.log(`\n${type.toUpperCase()}:`);
      console.log(`Descrição: ${config.description}`);
      console.log(`Características: ${config.characteristics.join(', ')}`);
      console.log(`Plataformas: ${config.platforms.join(', ')}`);
      console.log(`Casos de uso: ${config.useCases.join(', ')}`);
    });
  }
  
  // Demonstrar configuração de CI/CD
  demonstrateCICD() {
    console.log('\n=== CONFIGURAÇÃO CI/CD ===');
    console.log('Pipeline básico configurado com:');
    console.log('- Testes automatizados');
    console.log('- Build otimizado');
    console.log('- Deploy automático');
    console.log('- Monitoramento de qualidade');
    console.log('- Notificações de status');
  }
  
  // Demonstrar monitoramento
  demonstrateMonitoring() {
    console.log('\n=== MONITORAMENTO ===');
    console.log('Sistema de monitoramento inclui:');
    console.log('- Health checks básicos e avançados');
    console.log('- Métricas de performance');
    console.log('- Alertas proativos');
    console.log('- Logging estruturado');
    console.log('- Dashboards de observabilidade');
  }
  
  // Demonstrar otimizações de performance
  demonstratePerformance() {
    console.log('\n=== OTIMIZAÇÕES DE PERFORMANCE ===');
    console.log('Estratégias implementadas:');
    console.log('- Cache em múltiplas camadas');
    console.log('- CDN para distribuição global');
    console.log('- Compressão de assets');
    console.log('- Otimização de imagens');
    console.log('- Headers de cache otimizados');
  }
  
  // Executar demonstração completa
  runDemo() {
    console.log('🚀 DEMONSTRAÇÃO: DEPLOY E CI/CD');
    console.log('=====================================');
    
    this.demonstrateDeploymentStrategies();
    this.demonstrateCICD();
    this.demonstrateMonitoring();
    this.demonstratePerformance();
    
    console.log('\n=== RESUMO ===');
    console.log('✅ Estratégias de deploy configuradas');
    console.log('✅ Pipeline CI/CD automatizado');
    console.log('✅ Monitoramento e alertas ativos');
    console.log('✅ Performance otimizada');
    console.log('✅ Aplicação pronta para produção!');
  }
}

// =============================================================================
// 8. RESUMO DO MÓDULO
// =============================================================================

/*
📚 RESUMO COMPLETO: DEPLOY E CI/CD

🎯 OBJETIVOS ALCANÇADOS:
✅ Compreensão de estratégias de deploy
✅ Configuração de pipelines CI/CD
✅ Implementação de monitoramento
✅ Otimização de performance
✅ Containerização com Docker
✅ Configuração de CDN e cache

🔧 TECNOLOGIAS DOMINADAS:
- GitHub Actions para CI/CD
- Docker para containerização
- Netlify, Vercel, Heroku para deploy
- Prometheus para métricas
- Winston para logging
- Redis para cache distribuído
- Cloudflare/AWS CloudFront para CDN

💡 CONCEITOS CHAVE:
- Blue-Green deployment
- Canary releases
- Health checks (liveness/readiness)
- Observabilidade (logs, métricas, traces)
- Performance optimization
- Security best practices

🛠️ FERRAMENTAS ESSENCIAIS:
- CI/CD: GitHub Actions, GitLab CI, Jenkins
- Deploy: Netlify, Vercel, Heroku, Railway
- Containers: Docker, Kubernetes
- Monitoring: Prometheus, Grafana, New Relic
- CDN: Cloudflare, AWS CloudFront
- Cache: Redis, Memcached

📈 MELHORES PRÁTICAS:
- Automatizar tudo (testes, build, deploy)
- Implementar rollback automático
- Monitorar métricas críticas
- Usar feature flags para releases
- Manter ambientes consistentes
- Documentar processos de deploy

🚀 PRÓXIMOS PASSOS:
- Implementar observabilidade avançada
- Estudar Kubernetes para orquestração
- Explorar service mesh (Istio)
- Aprender sobre chaos engineering
- Implementar disaster recovery

*/

// Função de inicialização do módulo
function initializeDeployModule() {
  console.log('🎯 Módulo 4.5: Deploy e CI/CD');
  console.log('==============================');
  
  // Executar demonstração
  const demo = new DeploymentDemo();
  demo.runDemo();
  
  console.log('\n📚 Recursos para estudo:');
  console.log('- The DevOps Handbook');
  console.log('- Continuous Delivery (Jez Humble)');
  console.log('- Site Reliability Engineering (Google)');
  console.log('- Docker Deep Dive');
  console.log('- Kubernetes in Action');
  
  console.log('\n🔗 Links úteis:');
  console.log('- GitHub Actions: https://docs.github.com/actions');
  console.log('- Docker Hub: https://hub.docker.com/');
  console.log('- Netlify Docs: https://docs.netlify.com/');
  console.log('- Vercel Docs: https://vercel.com/docs');
  console.log('- Prometheus: https://prometheus.io/docs/');
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeDeployModule();
}

module.exports = {
  DeploymentConcepts,
  HostingPlatforms,
  GitHubActions,
  DockerConfiguration,
  MonitoringLogging,
  PerformanceOptimization,
  DeploymentDemo,
  initializeDeployModule
};

/*
=============================================================================
                           FIM DO MÓDULO 4.5
                          DEPLOY E CI/CD
=============================================================================

Este módulo forneceu uma base sólida em deploy e CI/CD, cobrindo desde
conceitos básicos até implementações avançadas de monitoramento e otimização.

O próximo passo é aplicar esses conhecimentos em projetos reais e continuar
aprofundando em tópicos específicos como Kubernetes, service mesh e
observabilidade avançada.

🎓 Parabéns por completar este módulo!
=============================================================================
*/