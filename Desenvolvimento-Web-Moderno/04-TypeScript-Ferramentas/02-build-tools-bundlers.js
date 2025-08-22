/*
=============================================================================
                    MÓDULO 4: TYPESCRIPT E FERRAMENTAS
                        02 - BUILD TOOLS E BUNDLERS
=============================================================================

Este arquivo aborda ferramentas de build e bundlers modernos, incluindo
Webpack, Vite, Rollup, esbuild e suas configurações para diferentes cenários.

📚 TÓPICOS ABORDADOS:
- Conceitos de build e bundling
- Webpack: configuração e plugins
- Vite: desenvolvimento rápido
- Rollup: bibliotecas e tree-shaking
- esbuild: performance extrema
- Configurações para diferentes ambientes
- Otimizações de produção

*/

// =============================================================================
// 1. CONCEITOS FUNDAMENTAIS
// =============================================================================

/*
Build tools e bundlers são ferramentas essenciais no desenvolvimento moderno
que transformam, otimizam e empacotam código para produção.

CONCEITOS PRINCIPAIS:
- Bundling: Combinar múltiplos arquivos em poucos bundles
- Tree-shaking: Remover código não utilizado
- Code splitting: Dividir código em chunks menores
- Hot Module Replacement (HMR): Atualizações em tempo real
- Transpilation: Converter código moderno para compatível
- Minification: Reduzir tamanho dos arquivos
- Source maps: Mapear código compilado para original
*/

class BuildToolsConcepts {
  // Demonstração de module bundling
  static demonstrateModuleBundling() {
    // Simulação de múltiplos módulos que seriam bundled
    
    // utils.js
    const utils = {
      formatDate: (date) => {
        return new Intl.DateTimeFormat('pt-BR').format(date);
      },
      
      formatCurrency: (value) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      },
      
      debounce: (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(null, args), delay);
        };
      }
    };
    
    // api.js
    const api = {
      baseURL: 'https://api.example.com',
      
      async get(endpoint) {
        try {
          const response = await fetch(`${this.baseURL}${endpoint}`);
          return await response.json();
        } catch (error) {
          console.error('API Error:', error);
          throw error;
        }
      },
      
      async post(endpoint, data) {
        try {
          const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          return await response.json();
        } catch (error) {
          console.error('API Error:', error);
          throw error;
        }
      }
    };
    
    // components.js
    const components = {
      createButton: (text, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        button.className = 'btn btn-primary';
        return button;
      },
      
      createModal: (title, content) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-content">
            <div class="modal-header">
              <h2>${title}</h2>
              <span class="close">&times;</span>
            </div>
            <div class="modal-body">
              ${content}
            </div>
          </div>
        `;
        return modal;
      }
    };
    
    // main.js (entry point)
    const app = {
      init() {
        console.log('App initialized');
        this.setupEventListeners();
        this.loadInitialData();
      },
      
      setupEventListeners() {
        const searchInput = document.querySelector('#search');
        if (searchInput) {
          const debouncedSearch = utils.debounce(this.handleSearch.bind(this), 300);
          searchInput.addEventListener('input', debouncedSearch);
        }
      },
      
      async loadInitialData() {
        try {
          // Simulação de carregamento de dados
          const data = {
            users: [
              { id: 1, name: 'João', balance: 1500.50 },
              { id: 2, name: 'Maria', balance: 2300.75 }
            ],
            lastUpdate: new Date()
          };
          
          this.renderData(data);
        } catch (error) {
          console.error('Failed to load data:', error);
        }
      },
      
      renderData(data) {
        const container = document.querySelector('#app');
        if (!container) return;
        
        const html = `
          <h1>Dashboard</h1>
          <p>Última atualização: ${utils.formatDate(data.lastUpdate)}</p>
          <div class="users">
            ${data.users.map(user => `
              <div class="user-card">
                <h3>${user.name}</h3>
                <p>Saldo: ${utils.formatCurrency(user.balance)}</p>
              </div>
            `).join('')}
          </div>
        `;
        
        container.innerHTML = html;
      },
      
      handleSearch(event) {
        const query = event.target.value;
        console.log('Searching for:', query);
        // Implementar lógica de busca
      }
    };
    
    console.log('Module bundling demonstration:', {
      utils: Object.keys(utils),
      api: Object.keys(api),
      components: Object.keys(components),
      app: Object.keys(app)
    });
    
    return { utils, api, components, app };
  }
  
  // Demonstração de tree-shaking
  static demonstrateTreeShaking() {
    // Biblioteca com muitas funções (apenas algumas serão usadas)
    const mathLibrary = {
      // Funções que serão usadas (mantidas no bundle)
      add: (a, b) => a + b,
      multiply: (a, b) => a * b,
      
      // Funções que NÃO serão usadas (removidas pelo tree-shaking)
      subtract: (a, b) => a - b,
      divide: (a, b) => a / b,
      power: (a, b) => Math.pow(a, b),
      sqrt: (a) => Math.sqrt(a),
      sin: (a) => Math.sin(a),
      cos: (a) => Math.cos(a),
      tan: (a) => Math.tan(a),
      log: (a) => Math.log(a),
      factorial: (n) => n <= 1 ? 1 : n * mathLibrary.factorial(n - 1)
    };
    
    // Apenas estas funções seriam mantidas no bundle final
    const usedFunctions = {
      calculateTotal: (items) => {
        return items.reduce((total, item) => mathLibrary.add(total, item.price), 0);
      },
      
      calculateArea: (width, height) => {
        return mathLibrary.multiply(width, height);
      }
    };
    
    console.log('Tree-shaking demonstration:', {
      totalLibraryFunctions: Object.keys(mathLibrary).length,
      usedFunctions: Object.keys(usedFunctions).length,
      treeShakenSize: `${Object.keys(usedFunctions).length}/${Object.keys(mathLibrary).length} functions kept`
    });
    
    return usedFunctions;
  }
  
  // Demonstração de code splitting
  static demonstrateCodeSplitting() {
    // Simulação de lazy loading de módulos
    const moduleLoader = {
      loadedModules: new Map(),
      
      async loadModule(moduleName) {
        if (this.loadedModules.has(moduleName)) {
          console.log(`Module ${moduleName} already loaded from cache`);
          return this.loadedModules.get(moduleName);
        }
        
        console.log(`Loading module ${moduleName}...`);
        
        // Simulação de carregamento assíncrono
        await new Promise(resolve => setTimeout(resolve, 100));
        
        let module;
        switch (moduleName) {
          case 'charts':
            module = {
              createChart: (data) => ({ type: 'chart', data }),
              createPieChart: (data) => ({ type: 'pie', data }),
              createBarChart: (data) => ({ type: 'bar', data })
            };
            break;
            
          case 'forms':
            module = {
              createForm: (fields) => ({ type: 'form', fields }),
              validateForm: (data) => ({ valid: true, errors: [] }),
              submitForm: (data) => ({ success: true, data })
            };
            break;
            
          case 'animations':
            module = {
              fadeIn: (element) => ({ animation: 'fadeIn', element }),
              slideUp: (element) => ({ animation: 'slideUp', element }),
              bounce: (element) => ({ animation: 'bounce', element })
            };
            break;
            
          default:
            throw new Error(`Module ${moduleName} not found`);
        }
        
        this.loadedModules.set(moduleName, module);
        console.log(`Module ${moduleName} loaded successfully`);
        return module;
      },
      
      async loadMultipleModules(moduleNames) {
        const promises = moduleNames.map(name => this.loadModule(name));
        return Promise.all(promises);
      }
    };
    
    // Demonstração de uso
    const demonstrateUsage = async () => {
      try {
        // Carregar módulo de charts apenas quando necessário
        const charts = await moduleLoader.loadModule('charts');
        const chart = charts.createChart([1, 2, 3, 4, 5]);
        
        // Carregar múltiplos módulos
        const [forms, animations] = await moduleLoader.loadMultipleModules(['forms', 'animations']);
        
        console.log('Code splitting demonstration:', {
          chartCreated: chart,
          formModule: Object.keys(forms),
          animationModule: Object.keys(animations),
          loadedModules: Array.from(moduleLoader.loadedModules.keys())
        });
      } catch (error) {
        console.error('Error loading modules:', error);
      }
    };
    
    return { moduleLoader, demonstrateUsage };
  }
}

// =============================================================================
// 2. WEBPACK CONFIGURATION
// =============================================================================

/*
Webpack é o bundler mais popular e configurável, ideal para projetos complexos
com necessidades específicas de build.
*/

class WebpackConfig {
  // Configuração básica do Webpack
  static getBasicConfig() {
    return {
      // Ponto de entrada
      entry: './src/index.js',
      
      // Configuração de saída
      output: {
        path: '/dist',
        filename: 'bundle.js',
        clean: true // Limpa o diretório de saída
      },
      
      // Modo de desenvolvimento
      mode: 'development',
      
      // Source maps para debugging
      devtool: 'eval-source-map',
      
      // Configuração do dev server
      devServer: {
        static: './dist',
        hot: true,
        port: 3000,
        open: true
      },
      
      // Resolução de módulos
      resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
        alias: {
          '@': '/src',
          '@components': '/src/components',
          '@utils': '/src/utils'
        }
      },
      
      // Regras de processamento
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react']
              }
            }
          },
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'ts-loader'
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            type: 'asset/resource'
          }
        ]
      }
    };
  }
  
  // Configuração para produção
  static getProductionConfig() {
    return {
      mode: 'production',
      
      // Otimizações
      optimization: {
        minimize: true,
        minimizer: [
          '...', // Usa os minimizers padrão
          // new CssMinimizerPlugin()
        ],
        
        // Code splitting
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true
            }
          }
        },
        
        // Runtime chunk
        runtimeChunk: 'single'
      },
      
      // Source maps para produção
      devtool: 'source-map',
      
      // Configuração de saída
      output: {
        path: '/dist',
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js',
        clean: true
      },
      
      // Performance hints
      performance: {
        maxAssetSize: 250000,
        maxEntrypointSize: 250000,
        hints: 'warning'
      }
    };
  }
  
  // Configuração com plugins
  static getConfigWithPlugins() {
    return {
      plugins: [
        // HTML Plugin
        {
          name: 'HtmlWebpackPlugin',
          options: {
            template: './src/index.html',
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true
            }
          }
        },
        
        // Extract CSS
        {
          name: 'MiniCssExtractPlugin',
          options: {
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
          }
        },
        
        // Copy static assets
        {
          name: 'CopyWebpackPlugin',
          options: {
            patterns: [
              {
                from: 'public',
                to: 'assets',
                globOptions: {
                  ignore: ['**/index.html']
                }
              }
            ]
          }
        },
        
        // Bundle analyzer
        {
          name: 'BundleAnalyzerPlugin',
          options: {
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html'
          }
        },
        
        // Environment variables
        {
          name: 'DefinePlugin',
          options: {
            'process.env.NODE_ENV': JSON.stringify('production'),
            'process.env.API_URL': JSON.stringify('https://api.production.com')
          }
        }
      ]
    };
  }
  
  // Configuração para TypeScript
  static getTypeScriptConfig() {
    return {
      entry: './src/index.ts',
      
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: [
              {
                loader: 'ts-loader',
                options: {
                  transpileOnly: true, // Faster builds
                  experimentalWatchApi: true
                }
              }
            ],
            exclude: /node_modules/
          },
          {
            test: /\.js$/,
            enforce: 'pre',
            use: ['source-map-loader']
          }
        ]
      },
      
      resolve: {
        extensions: ['.tsx', '.ts', '.js']
      },
      
      plugins: [
        {
          name: 'ForkTsCheckerWebpackPlugin',
          options: {
            async: false,
            eslint: {
              files: './src/**/*.{ts,tsx,js,jsx}'
            }
          }
        }
      ]
    };
  }
}

// =============================================================================
// 3. VITE CONFIGURATION
// =============================================================================

/*
Vite é um build tool moderno que oferece desenvolvimento extremamente rápido
com Hot Module Replacement nativo e builds otimizados.
*/

class ViteConfig {
  // Configuração básica do Vite
  static getBasicConfig() {
    return {
      // Configuração do servidor de desenvolvimento
      server: {
        port: 3000,
        open: true,
        cors: true,
        proxy: {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
      
      // Build configuration
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        minify: 'terser',
        
        // Rollup options
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              utils: ['lodash', 'date-fns']
            }
          }
        },
        
        // Chunk size warnings
        chunkSizeWarningLimit: 1000
      },
      
      // Resolve configuration
      resolve: {
        alias: {
          '@': '/src',
          '@components': '/src/components',
          '@utils': '/src/utils',
          '@assets': '/src/assets'
        }
      },
      
      // CSS configuration
      css: {
        modules: {
          localsConvention: 'camelCase'
        },
        preprocessorOptions: {
          scss: {
            additionalData: '@import "@/styles/variables.scss";'
          }
        }
      }
    };
  }
  
  // Configuração para React
  static getReactConfig() {
    return {
      plugins: [
        {
          name: '@vitejs/plugin-react',
          options: {
            // React refresh
            fastRefresh: true,
            
            // Babel options
            babel: {
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }]
              ]
            }
          }
        }
      ],
      
      // Environment variables
      define: {
        __APP_VERSION__: JSON.stringify('1.0.0'),
        __API_URL__: JSON.stringify('https://api.example.com')
      },
      
      // Optimization
      optimizeDeps: {
        include: ['react', 'react-dom'],
        exclude: ['@vite/client', '@vite/env']
      }
    };
  }
  
  // Configuração para TypeScript
  static getTypeScriptConfig() {
    return {
      plugins: [
        {
          name: '@vitejs/plugin-react',
          options: {
            typescript: {
              tsconfig: './tsconfig.json'
            }
          }
        }
      ],
      
      // ESBuild options
      esbuild: {
        target: 'es2020',
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment'
      },
      
      // Build options
      build: {
        target: 'es2020',
        lib: {
          entry: 'src/index.ts',
          name: 'MyLib',
          fileName: (format) => `my-lib.${format}.js`
        }
      }
    };
  }
  
  // Configuração para PWA
  static getPWAConfig() {
    return {
      plugins: [
        {
          name: 'vite-plugin-pwa',
          options: {
            registerType: 'autoUpdate',
            workbox: {
              globPatterns: ['**/*.{js,css,html,ico,png,svg}']
            },
            manifest: {
              name: 'My App',
              short_name: 'MyApp',
              description: 'My Awesome App description',
              theme_color: '#ffffff',
              background_color: '#ffffff',
              display: 'standalone',
              icons: [
                {
                  src: 'icon-192x192.png',
                  sizes: '192x192',
                  type: 'image/png'
                },
                {
                  src: 'icon-512x512.png',
                  sizes: '512x512',
                  type: 'image/png'
                }
              ]
            }
          }
        }
      ]
    };
  }
}

// =============================================================================
// 4. ROLLUP CONFIGURATION
// =============================================================================

/*
Rollup é ideal para bibliotecas e aplicações que precisam de tree-shaking
avançado e bundles menores.
*/

class RollupConfig {
  // Configuração básica para biblioteca
  static getLibraryConfig() {
    return {
      input: 'src/index.js',
      
      output: [
        {
          file: 'dist/my-library.cjs.js',
          format: 'cjs',
          exports: 'named'
        },
        {
          file: 'dist/my-library.esm.js',
          format: 'esm'
        },
        {
          file: 'dist/my-library.umd.js',
          format: 'umd',
          name: 'MyLibrary',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
          }
        }
      ],
      
      external: ['react', 'react-dom'],
      
      plugins: [
        {
          name: '@rollup/plugin-node-resolve',
          options: {
            browser: true
          }
        },
        {
          name: '@rollup/plugin-commonjs'
        },
        {
          name: '@rollup/plugin-babel',
          options: {
            babelHelpers: 'bundled',
            exclude: 'node_modules/**'
          }
        },
        {
          name: 'rollup-plugin-terser'
        }
      ]
    };
  }
  
  // Configuração para TypeScript
  static getTypeScriptConfig() {
    return {
      input: 'src/index.ts',
      
      output: [
        {
          file: 'dist/index.js',
          format: 'cjs',
          sourcemap: true
        },
        {
          file: 'dist/index.esm.js',
          format: 'esm',
          sourcemap: true
        }
      ],
      
      plugins: [
        {
          name: '@rollup/plugin-typescript',
          options: {
            tsconfig: './tsconfig.json',
            declaration: true,
            declarationDir: 'dist/types'
          }
        },
        {
          name: '@rollup/plugin-node-resolve'
        },
        {
          name: '@rollup/plugin-commonjs'
        }
      ]
    };
  }
  
  // Configuração para aplicação
  static getApplicationConfig() {
    return {
      input: 'src/main.js',
      
      output: {
        dir: 'dist',
        format: 'esm',
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash][extname]'
      },
      
      plugins: [
        {
          name: '@rollup/plugin-html',
          options: {
            template: ({ attributes, files, meta, publicPath, title }) => {
              return `
<!DOCTYPE html>
<html${attributes.html}>
<head>
  ${meta.map(input => `<meta${attributes.meta(input)}>`).join('\n  ')}
  <title>${title}</title>
  ${files.css.map(file => `<link rel="stylesheet" href="${publicPath}${file.fileName}">`).join('\n  ')}
</head>
<body>
  <div id="app"></div>
  ${files.js.map(file => `<script type="module" src="${publicPath}${file.fileName}"></script>`).join('\n  ')}
</body>
</html>`;
            }
          }
        },
        {
          name: '@rollup/plugin-node-resolve',
          options: {
            browser: true
          }
        },
        {
          name: '@rollup/plugin-commonjs'
        },
        {
          name: 'rollup-plugin-postcss',
          options: {
            extract: true,
            minimize: true
          }
        }
      ]
    };
  }
}

// =============================================================================
// 5. ESBUILD CONFIGURATION
// =============================================================================

/*
esbuild é extremamente rápido e ideal para desenvolvimento e builds simples
que precisam de performance máxima.
*/

class ESBuildConfig {
  // Configuração básica
  static getBasicConfig() {
    return {
      entryPoints: ['src/index.js'],
      bundle: true,
      outfile: 'dist/bundle.js',
      minify: true,
      sourcemap: true,
      target: ['es2020'],
      format: 'esm',
      platform: 'browser',
      
      // External dependencies
      external: ['react', 'react-dom'],
      
      // Define environment variables
      define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_URL': '"https://api.example.com"'
      },
      
      // Loader configuration
      loader: {
        '.png': 'file',
        '.jpg': 'file',
        '.svg': 'text'
      }
    };
  }
  
  // Configuração para TypeScript
  static getTypeScriptConfig() {
    return {
      entryPoints: ['src/index.ts'],
      bundle: true,
      outdir: 'dist',
      minify: true,
      sourcemap: true,
      target: ['es2020'],
      format: 'esm',
      
      // TypeScript options
      tsconfig: 'tsconfig.json',
      
      // Splitting
      splitting: true,
      
      // Chunk names
      chunkNames: '[name]-[hash]',
      
      // Asset names
      assetNames: '[name]-[hash]'
    };
  }
  
  // Configuração para desenvolvimento
  static getDevConfig() {
    return {
      entryPoints: ['src/index.js'],
      bundle: true,
      outdir: 'dist',
      sourcemap: true,
      target: ['es2020'],
      format: 'esm',
      
      // Watch mode
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error('Build failed:', error);
          } else {
            console.log('Build succeeded:', result);
          }
        }
      },
      
      // Serve configuration
      serve: {
        servedir: 'dist',
        port: 3000,
        host: 'localhost'
      }
    };
  }
}

// =============================================================================
// 6. OTIMIZAÇÕES DE PRODUÇÃO
// =============================================================================

/*
Técnicas e configurações para otimizar builds de produção,
reduzindo tamanho e melhorando performance.
*/

class ProductionOptimizations {
  // Análise de bundle
  static getBundleAnalysisTools() {
    return {
      webpack: {
        // webpack-bundle-analyzer
        analyzer: {
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-report.html',
          defaultSizes: 'parsed',
          generateStatsFile: true,
          statsFilename: 'stats.json'
        }
      },
      
      rollup: {
        // rollup-plugin-visualizer
        visualizer: {
          filename: 'bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        }
      },
      
      vite: {
        // Built-in analysis
        build: {
          rollupOptions: {
            output: {
              manualChunks: (id) => {
                if (id.includes('node_modules')) {
                  return 'vendor';
                }
                if (id.includes('src/components')) {
                  return 'components';
                }
                if (id.includes('src/utils')) {
                  return 'utils';
                }
              }
            }
          }
        }
      }
    };
  }
  
  // Estratégias de code splitting
  static getCodeSplittingStrategies() {
    return {
      // Por rota (route-based)
      routeBased: {
        description: 'Dividir código por páginas/rotas',
        implementation: {
          react: `
            const Home = lazy(() => import('./pages/Home'));
            const About = lazy(() => import('./pages/About'));
            const Contact = lazy(() => import('./pages/Contact'));
          `,
          vue: `
            const Home = () => import('./pages/Home.vue');
            const About = () => import('./pages/About.vue');
          `
        }
      },
      
      // Por funcionalidade (feature-based)
      featureBased: {
        description: 'Dividir código por funcionalidades',
        implementation: {
          webpack: {
            splitChunks: {
              cacheGroups: {
                admin: {
                  test: /[\\/]src[\\/]admin[\\/]/,
                  name: 'admin',
                  chunks: 'all'
                },
                dashboard: {
                  test: /[\\/]src[\\/]dashboard[\\/]/,
                  name: 'dashboard',
                  chunks: 'all'
                }
              }
            }
          }
        }
      },
      
      // Por vendor (library-based)
      vendorBased: {
        description: 'Separar bibliotecas de terceiros',
        implementation: {
          webpack: {
            splitChunks: {
              cacheGroups: {
                react: {
                  test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                  name: 'react',
                  chunks: 'all'
                },
                lodash: {
                  test: /[\\/]node_modules[\\/]lodash[\\/]/,
                  name: 'lodash',
                  chunks: 'all'
                }
              }
            }
          }
        }
      }
    };
  }
  
  // Otimizações de assets
  static getAssetOptimizations() {
    return {
      images: {
        // Compressão de imagens
        compression: {
          webpack: {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        },
        
        // Lazy loading
        lazyLoading: {
          implementation: `
            const LazyImage = ({ src, alt, ...props }) => {
              const [isLoaded, setIsLoaded] = useState(false);
              const [isInView, setIsInView] = useState(false);
              const imgRef = useRef();
              
              useEffect(() => {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting) {
                      setIsInView(true);
                      observer.disconnect();
                    }
                  },
                  { threshold: 0.1 }
                );
                
                if (imgRef.current) {
                  observer.observe(imgRef.current);
                }
                
                return () => observer.disconnect();
              }, []);
              
              return (
                <div ref={imgRef} {...props}>
                  {isInView && (
                    <img
                      src={src}
                      alt={alt}
                      onLoad={() => setIsLoaded(true)}
                      style={{ opacity: isLoaded ? 1 : 0 }}
                    />
                  )}
                </div>
              );
            };
          `
        }
      },
      
      fonts: {
        // Preload de fontes críticas
        preload: `
          <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
        `,
        
        // Font display strategy
        fontDisplay: {
          css: `
            @font-face {
              font-family: 'MyFont';
              src: url('/fonts/myfont.woff2') format('woff2');
              font-display: swap; /* ou fallback, optional */
            }
          `
        }
      },
      
      css: {
        // Critical CSS
        critical: {
          description: 'Extrair CSS crítico para above-the-fold',
          tools: ['critical', 'critters', 'penthouse']
        },
        
        // CSS purging
        purging: {
          purgecss: {
            content: ['./src/**/*.html', './src/**/*.js'],
            css: ['./src/**/*.css'],
            safelist: ['active', 'open', 'visible']
          }
        }
      }
    };
  }
  
  // Performance budgets
  static getPerformanceBudgets() {
    return {
      webpack: {
        performance: {
          maxAssetSize: 250000, // 250kb
          maxEntrypointSize: 250000, // 250kb
          hints: 'warning' // ou 'error'
        }
      },
      
      lighthouse: {
        budgets: [
          {
            resourceType: 'script',
            budget: 300 // 300kb
          },
          {
            resourceType: 'stylesheet',
            budget: 100 // 100kb
          },
          {
            resourceType: 'image',
            budget: 500 // 500kb
          }
        ]
      },
      
      bundlesize: {
        files: [
          {
            path: './dist/bundle.js',
            maxSize: '250kb'
          },
          {
            path: './dist/vendor.js',
            maxSize: '300kb'
          }
        ]
      }
    };
  }
}

// =============================================================================
// 7. APLICAÇÃO DE DEMONSTRAÇÃO
// =============================================================================

/*
Aplicação que demonstra diferentes configurações de build tools
e suas otimizações.
*/

class BuildToolsDemo {
  constructor() {
    this.configs = {
      webpack: new WebpackConfig(),
      vite: new ViteConfig(),
      rollup: new RollupConfig(),
      esbuild: new ESBuildConfig()
    };
    
    this.optimizations = new ProductionOptimizations();
  }
  
  // Comparação de ferramentas
  compareTools() {
    return {
      webpack: {
        pros: [
          'Altamente configurável',
          'Ecossistema maduro',
          'Suporte a plugins extenso',
          'Hot Module Replacement'
        ],
        cons: [
          'Configuração complexa',
          'Build mais lento',
          'Curva de aprendizado íngreme'
        ],
        bestFor: 'Projetos complexos com necessidades específicas'
      },
      
      vite: {
        pros: [
          'Desenvolvimento extremamente rápido',
          'HMR nativo',
          'Configuração simples',
          'Suporte TypeScript out-of-the-box'
        ],
        cons: [
          'Ecossistema mais novo',
          'Menos plugins que Webpack',
          'Algumas limitações em projetos legados'
        ],
        bestFor: 'Projetos modernos que priorizam velocidade de desenvolvimento'
      },
      
      rollup: {
        pros: [
          'Tree-shaking excelente',
          'Bundles menores',
          'Ideal para bibliotecas',
          'Configuração clara'
        ],
        cons: [
          'Menos recursos para aplicações',
          'Code splitting limitado',
          'Ecossistema menor'
        ],
        bestFor: 'Bibliotecas e aplicações que precisam de bundles otimizados'
      },
      
      esbuild: {
        pros: [
          'Extremamente rápido',
          'Configuração simples',
          'Suporte TypeScript nativo',
          'Baixo uso de memória'
        ],
        cons: [
          'Menos recursos avançados',
          'Ecossistema limitado',
          'Menos opções de customização'
        ],
        bestFor: 'Projetos que priorizam velocidade de build'
      }
    };
  }
  
  // Benchmark de performance
  async benchmarkTools() {
    const results = {
      webpack: { buildTime: 0, bundleSize: 0 },
      vite: { buildTime: 0, bundleSize: 0 },
      rollup: { buildTime: 0, bundleSize: 0 },
      esbuild: { buildTime: 0, bundleSize: 0 }
    };
    
    // Simulação de benchmark
    const simulateBuild = async (tool) => {
      const start = Date.now();
      
      // Simular tempo de build
      const buildTimes = {
        webpack: 5000,
        vite: 1000,
        rollup: 3000,
        esbuild: 500
      };
      
      await new Promise(resolve => setTimeout(resolve, buildTimes[tool] / 10));
      
      const buildTime = Date.now() - start;
      
      // Simular tamanho do bundle
      const bundleSizes = {
        webpack: 250000,
        vite: 220000,
        rollup: 180000,
        esbuild: 200000
      };
      
      return {
        buildTime,
        bundleSize: bundleSizes[tool]
      };
    };
    
    for (const tool of Object.keys(results)) {
      console.log(`Benchmarking ${tool}...`);
      results[tool] = await simulateBuild(tool);
    }
    
    return results;
  }
  
  // Recomendações baseadas no projeto
  getRecommendations(projectType) {
    const recommendations = {
      'spa-react': {
        primary: 'vite',
        alternative: 'webpack',
        reasoning: 'Vite oferece desenvolvimento rápido para SPAs React modernas'
      },
      
      'library': {
        primary: 'rollup',
        alternative: 'esbuild',
        reasoning: 'Rollup produz bundles menores e melhor tree-shaking para bibliotecas'
      },
      
      'enterprise': {
        primary: 'webpack',
        alternative: 'vite',
        reasoning: 'Webpack oferece máxima configurabilidade para projetos complexos'
      },
      
      'prototype': {
        primary: 'vite',
        alternative: 'esbuild',
        reasoning: 'Vite permite prototipagem rápida com configuração mínima'
      },
      
      'monorepo': {
        primary: 'webpack',
        alternative: 'vite',
        reasoning: 'Webpack tem melhor suporte para configurações complexas de monorepo'
      }
    };
    
    return recommendations[projectType] || {
      primary: 'vite',
      alternative: 'webpack',
      reasoning: 'Vite é uma boa escolha padrão para a maioria dos projetos'
    };
  }
  
  // Configuração automática
  generateConfig(tool, projectType, options = {}) {
    const baseConfigs = {
      webpack: this.configs.webpack.getBasicConfig(),
      vite: this.configs.vite.getBasicConfig(),
      rollup: this.configs.rollup.getLibraryConfig(),
      esbuild: this.configs.esbuild.getBasicConfig()
    };
    
    let config = { ...baseConfigs[tool] };
    
    // Customizações baseadas no tipo de projeto
    if (projectType === 'react') {
      if (tool === 'vite') {
        config = { ...config, ...this.configs.vite.getReactConfig() };
      }
    }
    
    if (projectType === 'typescript') {
      if (tool === 'webpack') {
        config = { ...config, ...this.configs.webpack.getTypeScriptConfig() };
      } else if (tool === 'vite') {
        config = { ...config, ...this.configs.vite.getTypeScriptConfig() };
      }
    }
    
    // Aplicar opções customizadas
    if (options.production) {
      if (tool === 'webpack') {
        config = { ...config, ...this.configs.webpack.getProductionConfig() };
      }
    }
    
    return config;
  }
}

// =============================================================================
// 8. DEMONSTRAÇÃO E TESTES
// =============================================================================

function demonstrateBuildTools() {
  console.log('\n=== DEMONSTRAÇÃO BUILD TOOLS ===\n');
  
  // 1. Conceitos fundamentais
  console.log('1. CONCEITOS FUNDAMENTAIS:');
  const concepts = BuildToolsConcepts.demonstrateModuleBundling();
  BuildToolsConcepts.demonstrateTreeShaking();
  
  const { moduleLoader, demonstrateUsage } = BuildToolsConcepts.demonstrateCodeSplitting();
  demonstrateUsage();
  
  // 2. Configurações
  console.log('\n2. CONFIGURAÇÕES:');
  console.log('Webpack básico:', JSON.stringify(WebpackConfig.getBasicConfig(), null, 2));
  console.log('\nVite básico:', JSON.stringify(ViteConfig.getBasicConfig(), null, 2));
  
  // 3. Demonstração da aplicação
  console.log('\n3. APLICAÇÃO DE DEMONSTRAÇÃO:');
  const demo = new BuildToolsDemo();
  
  // Comparação de ferramentas
  const comparison = demo.compareTools();
  console.log('Comparação de ferramentas:', comparison);
  
  // Benchmark
  demo.benchmarkTools().then(results => {
    console.log('\nResultados do benchmark:', results);
  });
  
  // Recomendações
  const recommendations = {
    spa: demo.getRecommendations('spa-react'),
    library: demo.getRecommendations('library'),
    enterprise: demo.getRecommendations('enterprise')
  };
  
  console.log('\nRecomendações por tipo de projeto:', recommendations);
  
  // Configuração automática
  const autoConfig = demo.generateConfig('vite', 'react', { production: false });
  console.log('\nConfiguração automática (Vite + React):', autoConfig);
  
  // 4. Otimizações
  console.log('\n4. OTIMIZAÇÕES:');
  const optimizations = new ProductionOptimizations();
  console.log('Estratégias de code splitting:', optimizations.getCodeSplittingStrategies());
  console.log('\nPerformance budgets:', optimizations.getPerformanceBudgets());
}

// Executar demonstração
if (typeof window === 'undefined') {
  // Node.js environment
  demonstrateBuildTools();
} else {
  // Browser environment
  console.log('Build Tools module loaded. Call demonstrateBuildTools() to run demo.');
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BuildToolsConcepts,
    WebpackConfig,
    ViteConfig,
    RollupConfig,
    ESBuildConfig,
    ProductionOptimizations,
    BuildToolsDemo,
    demonstrateBuildTools
  };
}

/*
=============================================================================
                              RESUMO DO MÓDULO
=============================================================================

📚 CONCEITOS PRINCIPAIS:

1. **Bundling e Build**:
   - Module bundling e resolução de dependências
   - Tree-shaking para remoção de código morto
   - Code splitting para carregamento otimizado
   - Hot Module Replacement para desenvolvimento

2. **Webpack**:
   - Configuração flexível e extensível
   - Sistema de plugins robusto
   - Loaders para diferentes tipos de arquivo
   - Otimizações avançadas de produção

3. **Vite**:
   - Desenvolvimento extremamente rápido
   - HMR nativo com ES modules
   - Configuração simples e intuitiva
   - Build otimizado com Rollup

4. **Rollup**:
   - Tree-shaking superior
   - Ideal para bibliotecas
   - Múltiplos formatos de saída
   - Bundles menores e limpos

5. **esbuild**:
   - Performance extrema
   - Suporte TypeScript nativo
   - Configuração minimalista
   - Ideal para builds rápidos

🎯 OBJETIVOS ALCANÇADOS:

✅ Compreensão dos conceitos de bundling
✅ Configuração de diferentes build tools
✅ Otimizações para produção
✅ Estratégias de code splitting
✅ Performance budgets e monitoramento
✅ Escolha da ferramenta adequada por projeto

🔧 HABILIDADES DESENVOLVIDAS:

- Configuração de build pipelines
- Otimização de bundles para produção
- Implementação de code splitting
- Análise de performance de builds
- Escolha de ferramentas adequadas
- Configuração de ambientes de desenvolvimento

📈 PRÓXIMOS PASSOS:

1. **Testes Avançados**: Jest, Testing Library, E2E
2. **Linting e Formatação**: ESLint, Prettier, Husky
3. **CI/CD**: GitHub Actions, pipelines automatizados
4. **Monitoramento**: Bundle analysis, performance metrics
5. **Deployment**: Estratégias de deploy otimizadas

💡 DICAS IMPORTANTES:

- Escolha a ferramenta baseada nas necessidades do projeto
- Configure performance budgets desde o início
- Use code splitting para melhorar carregamento
- Monitore o tamanho dos bundles regularmente
- Otimize assets (imagens, fontes, CSS)
- Configure source maps para debugging
- Use tree-shaking para reduzir bundle size

=============================================================================
*/