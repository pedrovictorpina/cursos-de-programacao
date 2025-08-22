/**
 * 🚀 MÓDULO 3: BACKEND COM NODE.JS
 * 📘 Arquivo: 01-fundamentos-nodejs.js
 * 
 * 🎯 OBJETIVOS DESTE ARQUIVO:
 * • Compreender o runtime Node.js e o motor V8
 * • Dominar o sistema de módulos (CommonJS e ES Modules)
 * • Trabalhar com sistema de arquivos e streams
 * • Criar servidores HTTP básicos
 * • Entender o Event Loop e programação assíncrona
 * • Implementar utilitários e helpers fundamentais
 * 
 * 👨‍🏫 CONCEITOS FUNDAMENTAIS:
 * Este arquivo apresenta os fundamentos essenciais do Node.js,
 * desde conceitos básicos até implementações práticas de servidores.
 */

// =============================================================================
// 1. FUNDAMENTOS DO NODE.JS E RUNTIME V8
// =============================================================================

/**
 * 🔧 CONCEITOS BÁSICOS DO NODE.JS
 * 
 * Node.js é um runtime JavaScript construído sobre o motor V8 do Chrome
 * que permite executar JavaScript no servidor.
 */
const nodeJSConcepts = {
    /**
     * 🏗️ ARQUITETURA DO NODE.JS
     */
    arquitetura: {
        v8Engine: {
            descricao: 'Motor JavaScript de alta performance do Google Chrome',
            funcoes: [
                'Compilação Just-In-Time (JIT)',
                'Garbage Collection automático',
                'Otimizações de performance',
                'Execução de código JavaScript'
            ],
            exemplo: `
                // O V8 compila este código JavaScript para código de máquina
                function fibonacci(n) {
                    if (n <= 1) return n;
                    return fibonacci(n - 1) + fibonacci(n - 2);
                }
                
                console.log('Fibonacci de 10:', fibonacci(10));
            `
        },
        
        libuv: {
            descricao: 'Biblioteca C++ que fornece o Event Loop e I/O assíncrono',
            funcoes: [
                'Event Loop (loop de eventos)',
                'Thread Pool para operações bloqueantes',
                'I/O assíncrono (arquivos, rede)',
                'Timers e callbacks'
            ],
            exemplo: `
                // libuv gerencia estas operações assíncronas
                const fs = require('fs');
                
                // Operação não-bloqueante
                fs.readFile('arquivo.txt', 'utf8', (err, data) => {
                    if (err) throw err;
                    console.log('Arquivo lido:', data);
                });
                
                console.log('Esta linha executa imediatamente');
            `
        },
        
        eventLoop: {
            descricao: 'Mecanismo que permite Node.js ser não-bloqueante',
            fases: [
                '1. Timer Phase - executa callbacks de setTimeout/setInterval',
                '2. Pending Callbacks - executa callbacks de I/O pendentes',
                '3. Idle/Prepare - uso interno',
                '4. Poll Phase - busca novos eventos de I/O',
                '5. Check Phase - executa callbacks de setImmediate',
                '6. Close Callbacks - executa callbacks de fechamento'
            ],
            exemplo: `
                // Demonstração da ordem de execução no Event Loop
                console.log('1. Início');
                
                setTimeout(() => console.log('2. setTimeout'), 0);
                setImmediate(() => console.log('3. setImmediate'));
                
                process.nextTick(() => console.log('4. nextTick'));
                
                Promise.resolve().then(() => console.log('5. Promise'));
                
                console.log('6. Fim');
                
                // Ordem de execução:
                // 1. Início
                // 6. Fim
                // 4. nextTick
                // 5. Promise
                // 3. setImmediate
                // 2. setTimeout
            `
        }
    },
    
    /**
     * 🌟 CARACTERÍSTICAS PRINCIPAIS
     */
    caracteristicas: {
        singleThreaded: {
            descricao: 'JavaScript executa em uma única thread principal',
            vantagens: ['Sem problemas de concorrência', 'Simplicidade de desenvolvimento'],
            limitacoes: ['CPU-intensive pode bloquear', 'Não aproveita múltiplos cores nativamente']
        },
        
        nonBlocking: {
            descricao: 'I/O não-bloqueante através de callbacks e promises',
            exemplo: `
                // Bloqueante (evitar)
                const fs = require('fs');
                const data = fs.readFileSync('arquivo.txt'); // Bloqueia até terminar
                console.log(data);
                
                // Não-bloqueante (preferir)
                fs.readFile('arquivo.txt', (err, data) => {
                    if (err) throw err;
                    console.log(data); // Executa quando terminar
                });
                
                // Com Promises (moderno)
                const fsPromises = require('fs').promises;
                fsPromises.readFile('arquivo.txt')
                    .then(data => console.log(data))
                    .catch(err => console.error(err));
            `
        },
        
        eventDriven: {
            descricao: 'Arquitetura baseada em eventos e callbacks',
            exemplo: `
                const EventEmitter = require('events');
                
                class MinhaClasse extends EventEmitter {
                    executarTarefa() {
                        console.log('Iniciando tarefa...');
                        
                        // Simular trabalho assíncrono
                        setTimeout(() => {
                            this.emit('tarefa-completa', { resultado: 'Sucesso!' });
                        }, 1000);
                    }
                }
                
                const minhaInstancia = new MinhaClasse();
                
                minhaInstancia.on('tarefa-completa', (data) => {
                    console.log('Tarefa finalizada:', data.resultado);
                });
                
                minhaInstancia.executarTarefa();
            `
        }
    }
};

// =============================================================================
// 2. SISTEMA DE MÓDULOS
// =============================================================================

/**
 * 📦 SISTEMA DE MÓDULOS NO NODE.JS
 * 
 * Node.js suporta CommonJS (padrão) e ES Modules (moderno)
 */
const moduleSystem = {
    /**
     * 📚 COMMONJS (TRADICIONAL)
     */
    commonJS: {
        descricao: 'Sistema de módulos padrão do Node.js',
        sintaxe: {
            exportar: `
                // math.js - Exportando funções
                function somar(a, b) {
                    return a + b;
                }
                
                function multiplicar(a, b) {
                    return a * b;
                }
                
                // Exportação individual
                exports.somar = somar;
                exports.multiplicar = multiplicar;
                
                // Ou exportação em lote
                module.exports = {
                    somar,
                    multiplicar,
                    PI: 3.14159
                };
                
                // Exportação direta
                module.exports = class Calculadora {
                    static somar(a, b) {
                        return a + b;
                    }
                };
            `,
            
            importar: `
                // Importando módulo completo
                const math = require('./math');
                console.log(math.somar(2, 3)); // 5
                
                // Destructuring
                const { somar, multiplicar } = require('./math');
                console.log(somar(2, 3)); // 5
                
                // Módulos nativos
                const fs = require('fs');
                const path = require('path');
                const http = require('http');
                
                // Módulos de terceiros
                const express = require('express');
                const lodash = require('lodash');
            `
        }
    },
    
    /**
     * 🆕 ES MODULES (MODERNO)
     */
    esModules: {
        descricao: 'Sistema de módulos padrão do JavaScript moderno',
        configuracao: `
            // package.json
            {
                "type": "module",
                "name": "meu-projeto"
            }
            
            // Ou usar extensão .mjs
            // arquivo.mjs
        `,
        
        sintaxe: {
            exportar: `
                // math.mjs - Exportações nomeadas
                export function somar(a, b) {
                    return a + b;
                }
                
                export function multiplicar(a, b) {
                    return a * b;
                }
                
                export const PI = 3.14159;
                
                // Exportação padrão
                export default class Calculadora {
                    static somar(a, b) {
                        return a + b;
                    }
                }
                
                // Exportação em lote
                const utils = { somar, multiplicar };
                export { utils };
            `,
            
            importar: `
                // Importações nomeadas
                import { somar, multiplicar, PI } from './math.mjs';
                
                // Importação padrão
                import Calculadora from './math.mjs';
                
                // Importação completa
                import * as math from './math.mjs';
                
                // Importação dinâmica
                const math = await import('./math.mjs');
                
                // Módulos nativos (Node.js 14+)
                import fs from 'fs';
                import { readFile } from 'fs/promises';
            `
        }
    },
    
    /**
     * 🔍 RESOLUÇÃO DE MÓDULOS
     */
    resolucao: {
        algoritmo: [
            '1. Core modules (fs, http, path)',
            '2. Caminhos relativos (./arquivo, ../pasta)',
            '3. node_modules (local → global)',
            '4. Variáveis de ambiente NODE_PATH'
        ],
        
        exemplo: `
            // Diferentes formas de importar
            const fs = require('fs');              // Core module
            const utils = require('./utils');      // Arquivo local
            const config = require('../config');   // Pasta pai
            const express = require('express');    // node_modules
            
            // Node.js procura automaticamente:
            // ./utils.js
            // ./utils/index.js
            // ./utils/package.json (main field)
        `
    }
};

// =============================================================================
// 3. SISTEMA DE ARQUIVOS E STREAMS
// =============================================================================

/**
 * 📁 TRABALHANDO COM SISTEMA DE ARQUIVOS
 * 
 * Node.js fornece APIs robustas para manipulação de arquivos
 */
const fileSystemUtils = {
    /**
     * 📖 LEITURA DE ARQUIVOS
     */
    leitura: {
        // Simulação do módulo fs
        readFileSync: function(caminho, encoding = 'utf8') {
            console.log(`📖 Lendo arquivo síncronamente: ${caminho}`);
            // Simulação de conteúdo
            return `Conteúdo do arquivo ${caminho}`;
        },
        
        readFile: function(caminho, encoding, callback) {
            console.log(`📖 Lendo arquivo assincronamente: ${caminho}`);
            // Simulação de operação assíncrona
            setTimeout(() => {
                callback(null, `Conteúdo assíncrono do arquivo ${caminho}`);
            }, 100);
        },
        
        readFilePromise: function(caminho, encoding = 'utf8') {
            console.log(`📖 Lendo arquivo com Promise: ${caminho}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(`Conteúdo Promise do arquivo ${caminho}`);
                }, 100);
            });
        },
        
        exemplo: `
            const fs = require('fs');
            const fsPromises = require('fs').promises;
            
            // Síncrono (bloqueia)
            try {
                const data = fs.readFileSync('config.json', 'utf8');
                console.log(JSON.parse(data));
            } catch (err) {
                console.error('Erro ao ler arquivo:', err);
            }
            
            // Assíncrono com callback
            fs.readFile('config.json', 'utf8', (err, data) => {
                if (err) {
                    console.error('Erro:', err);
                    return;
                }
                console.log(JSON.parse(data));
            });
            
            // Assíncrono com Promise
            async function lerArquivo() {
                try {
                    const data = await fsPromises.readFile('config.json', 'utf8');
                    console.log(JSON.parse(data));
                } catch (err) {
                    console.error('Erro:', err);
                }
            }
        `
    },
    
    /**
     * ✍️ ESCRITA DE ARQUIVOS
     */
    escrita: {
        writeFile: function(caminho, conteudo, callback) {
            console.log(`✍️ Escrevendo arquivo: ${caminho}`);
            setTimeout(() => {
                console.log(`✅ Arquivo ${caminho} escrito com sucesso`);
                callback(null);
            }, 50);
        },
        
        appendFile: function(caminho, conteudo, callback) {
            console.log(`➕ Adicionando ao arquivo: ${caminho}`);
            setTimeout(() => {
                console.log(`✅ Conteúdo adicionado ao ${caminho}`);
                callback(null);
            }, 50);
        },
        
        exemplo: `
            const fs = require('fs');
            
            // Escrever arquivo
            const dados = { nome: 'João', idade: 30 };
            fs.writeFile('usuario.json', JSON.stringify(dados, null, 2), (err) => {
                if (err) throw err;
                console.log('Arquivo salvo!');
            });
            
            // Adicionar ao arquivo
            fs.appendFile('log.txt', '\nNova entrada de log', (err) => {
                if (err) throw err;
                console.log('Log adicionado!');
            });
            
            // Com Promises
            async function salvarDados() {
                try {
                    await fsPromises.writeFile('dados.json', JSON.stringify(dados));
                    console.log('Dados salvos!');
                } catch (err) {
                    console.error('Erro ao salvar:', err);
                }
            }
        `
    },
    
    /**
     * 📂 MANIPULAÇÃO DE DIRETÓRIOS
     */
    diretorios: {
        mkdir: function(caminho, callback) {
            console.log(`📂 Criando diretório: ${caminho}`);
            setTimeout(() => callback(null), 30);
        },
        
        readdir: function(caminho, callback) {
            console.log(`📋 Listando diretório: ${caminho}`);
            setTimeout(() => {
                callback(null, ['arquivo1.txt', 'arquivo2.js', 'subpasta/']);
            }, 30);
        },
        
        exemplo: `
            const fs = require('fs');
            const path = require('path');
            
            // Criar diretório
            fs.mkdir('nova-pasta', { recursive: true }, (err) => {
                if (err) throw err;
                console.log('Diretório criado!');
            });
            
            // Listar arquivos
            fs.readdir('.', (err, files) => {
                if (err) throw err;
                files.forEach(file => {
                    console.log(file);
                });
            });
            
            // Informações do arquivo
            fs.stat('arquivo.txt', (err, stats) => {
                if (err) throw err;
                console.log('Tamanho:', stats.size);
                console.log('É arquivo:', stats.isFile());
                console.log('É diretório:', stats.isDirectory());
            });
        `
    }
};

/**
 * 🌊 STREAMS - PROCESSAMENTO EFICIENTE DE DADOS
 * 
 * Streams permitem processar dados em pedaços, ideal para arquivos grandes
 */
const streamUtils = {
    /**
     * 📥 READABLE STREAMS
     */
    readable: {
        exemplo: `
            const fs = require('fs');
            
            // Criar stream de leitura
            const readStream = fs.createReadStream('arquivo-grande.txt', {
                encoding: 'utf8',
                highWaterMark: 1024 // Buffer de 1KB
            });
            
            readStream.on('data', (chunk) => {
                console.log('Recebido chunk:', chunk.length, 'bytes');
            });
            
            readStream.on('end', () => {
                console.log('Leitura finalizada');
            });
            
            readStream.on('error', (err) => {
                console.error('Erro na leitura:', err);
            });
        `
    },
    
    /**
     * 📤 WRITABLE STREAMS
     */
    writable: {
        exemplo: `
            const fs = require('fs');
            
            // Criar stream de escrita
            const writeStream = fs.createWriteStream('saida.txt');
            
            writeStream.write('Primeira linha\n');
            writeStream.write('Segunda linha\n');
            writeStream.end('Última linha\n');
            
            writeStream.on('finish', () => {
                console.log('Escrita finalizada');
            });
        `
    },
    
    /**
     * 🔄 TRANSFORM STREAMS
     */
    transform: {
        exemplo: `
            const { Transform } = require('stream');
            
            // Stream que converte para maiúsculo
            const upperCaseTransform = new Transform({
                transform(chunk, encoding, callback) {
                    this.push(chunk.toString().toUpperCase());
                    callback();
                }
            });
            
            // Pipeline
            const fs = require('fs');
            const readStream = fs.createReadStream('entrada.txt');
            const writeStream = fs.createWriteStream('saida.txt');
            
            readStream
                .pipe(upperCaseTransform)
                .pipe(writeStream);
        `
    },
    
    /**
     * 🔗 PIPES E PIPELINES
     */
    pipes: {
        exemplo: `
            const fs = require('fs');
            const zlib = require('zlib');
            const { pipeline } = require('stream');
            
            // Usando pipe (método clássico)
            fs.createReadStream('entrada.txt')
                .pipe(zlib.createGzip())
                .pipe(fs.createWriteStream('saida.txt.gz'));
            
            // Usando pipeline (recomendado)
            pipeline(
                fs.createReadStream('entrada.txt'),
                zlib.createGzip(),
                fs.createWriteStream('saida.txt.gz'),
                (err) => {
                    if (err) {
                        console.error('Pipeline falhou:', err);
                    } else {
                        console.log('Pipeline sucesso!');
                    }
                }
            );
        `
    }
};

// =============================================================================
// 4. SERVIDOR HTTP BÁSICO
// =============================================================================

/**
 * 🌐 CRIANDO SERVIDORES HTTP COM NODE.JS
 * 
 * Node.js possui módulo HTTP nativo para criar servidores web
 */
const httpServerUtils = {
    /**
     * 🚀 SERVIDOR BÁSICO
     */
    servidorBasico: {
        codigo: `
            const http = require('http');
            const url = require('url');
            
            // Criar servidor
            const server = http.createServer((req, res) => {
                // Parse da URL
                const parsedUrl = url.parse(req.url, true);
                const path = parsedUrl.pathname;
                const method = req.method;
                
                // Headers de resposta
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');
                
                // Roteamento básico
                if (path === '/' && method === 'GET') {
                    res.statusCode = 200;
                    res.end(JSON.stringify({ 
                        message: 'Bem-vindo ao servidor Node.js!',
                        timestamp: new Date().toISOString()
                    }));
                } else if (path === '/api/users' && method === 'GET') {
                    res.statusCode = 200;
                    res.end(JSON.stringify({
                        users: [
                            { id: 1, name: 'João' },
                            { id: 2, name: 'Maria' }
                        ]
                    }));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
                }
            });
            
            // Iniciar servidor
            const PORT = process.env.PORT || 3000;
            server.listen(PORT, () => {
                console.log(\`Servidor rodando na porta \${PORT}\`);
            });
        `,
        
        // Simulação do servidor para demonstração
        createServer: function(requestHandler) {
            return {
                listen: function(port, callback) {
                    console.log(`🚀 Servidor HTTP simulado iniciado na porta ${port}`);
                    if (callback) callback();
                    
                    // Simular algumas requisições
                    setTimeout(() => {
                        console.log('📥 Simulando requisição GET /');
                        const mockReq = { url: '/', method: 'GET' };
                        const mockRes = {
                            statusCode: 200,
                            setHeader: (key, value) => console.log(`📋 Header: ${key}: ${value}`),
                            end: (data) => console.log('📤 Resposta:', data)
                        };
                        requestHandler(mockReq, mockRes);
                    }, 1000);
                    
                    return this;
                }
            };
        }
    },
    
    /**
     * 📝 TRATAMENTO DE DADOS POST
     */
    tratamentoPOST: {
        exemplo: `
            const http = require('http');
            
            const server = http.createServer((req, res) => {
                if (req.method === 'POST') {
                    let body = '';
                    
                    // Receber dados em chunks
                    req.on('data', chunk => {
                        body += chunk.toString();
                    });
                    
                    // Processar quando completo
                    req.on('end', () => {
                        try {
                            const data = JSON.parse(body);
                            console.log('Dados recebidos:', data);
                            
                            res.statusCode = 201;
                            res.setHeader('Content-Type', 'application/json');
                            res.end(JSON.stringify({ 
                                success: true, 
                                received: data 
                            }));
                        } catch (err) {
                            res.statusCode = 400;
                            res.end(JSON.stringify({ error: 'JSON inválido' }));
                        }
                    });
                } else {
                    res.statusCode = 405;
                    res.end(JSON.stringify({ error: 'Método não permitido' }));
                }
            });
        `
    },
    
    /**
     * 📁 SERVINDO ARQUIVOS ESTÁTICOS
     */
    arquivosEstaticos: {
        exemplo: `
            const http = require('http');
            const fs = require('fs');
            const path = require('path');
            
            const server = http.createServer((req, res) => {
                // Determinar tipo de arquivo
                const ext = path.extname(req.url);
                const mimeTypes = {
                    '.html': 'text/html',
                    '.css': 'text/css',
                    '.js': 'application/javascript',
                    '.json': 'application/json',
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg'
                };
                
                const contentType = mimeTypes[ext] || 'text/plain';
                
                // Caminho do arquivo
                const filePath = path.join(__dirname, 'public', req.url);
                
                // Verificar se arquivo existe
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        res.statusCode = 404;
                        res.end('Arquivo não encontrado');
                        return;
                    }
                    
                    // Servir arquivo
                    res.setHeader('Content-Type', contentType);
                    fs.createReadStream(filePath).pipe(res);
                });
            });
        `
    }
};

// =============================================================================
// 5. UTILITÁRIOS E HELPERS FUNDAMENTAIS
// =============================================================================

/**
 * 🛠️ UTILITÁRIOS ESSENCIAIS PARA DESENVOLVIMENTO NODE.JS
 * 
 * Funções e classes úteis para desenvolvimento backend
 */
const nodeUtilities = {
    /**
     * 🔧 MANIPULAÇÃO DE CAMINHOS
     */
    pathUtils: {
        // Simulação do módulo path
        join: function(...paths) {
            return paths.join('/');
        },
        
        resolve: function(...paths) {
            return '/' + paths.join('/');
        },
        
        extname: function(filePath) {
            const parts = filePath.split('.');
            return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
        },
        
        basename: function(filePath) {
            return filePath.split('/').pop();
        },
        
        exemplo: `
            const path = require('path');
            
            // Juntar caminhos
            const fullPath = path.join(__dirname, 'uploads', 'image.jpg');
            console.log(fullPath); // /projeto/uploads/image.jpg
            
            // Resolver caminho absoluto
            const absolutePath = path.resolve('..', 'config', 'database.json');
            
            // Extrair extensão
            const ext = path.extname('arquivo.txt'); // .txt
            
            // Nome do arquivo
            const filename = path.basename('/pasta/arquivo.txt'); // arquivo.txt
            
            // Diretório
            const dir = path.dirname('/pasta/arquivo.txt'); // /pasta
        `
    },
    
    /**
     * 🌍 VARIÁVEIS DE AMBIENTE
     */
    envUtils: {
        exemplo: `
            // Acessar variáveis de ambiente
            const PORT = process.env.PORT || 3000;
            const NODE_ENV = process.env.NODE_ENV || 'development';
            const DB_URL = process.env.DATABASE_URL;
            
            // Verificar ambiente
            const isProduction = NODE_ENV === 'production';
            const isDevelopment = NODE_ENV === 'development';
            
            // Configuração baseada no ambiente
            const config = {
                port: PORT,
                database: {
                    url: DB_URL,
                    ssl: isProduction
                },
                logging: isDevelopment
            };
            
            // Usando dotenv para carregar .env
            require('dotenv').config();
        `
    },
    
    /**
     * 📊 LOGGING E DEBUGGING
     */
    loggingUtils: {
        Logger: class {
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
            
            static info(message, data) {
                this.log('info', message, data);
            }
            
            static error(message, error) {
                this.log('error', message, {
                    message: error.message,
                    stack: error.stack
                });
            }
            
            static warn(message, data) {
                this.log('warn', message, data);
            }
            
            static debug(message, data) {
                if (process.env.NODE_ENV === 'development') {
                    this.log('debug', message, data);
                }
            }
        },
        
        exemplo: `
            const Logger = require('./logger');
            
            // Diferentes níveis de log
            Logger.info('Servidor iniciado', { port: 3000 });
            Logger.warn('Conexão lenta detectada', { latency: 2000 });
            Logger.error('Erro na database', new Error('Connection failed'));
            Logger.debug('Dados de debug', { userId: 123, action: 'login' });
        `
    },
    
    /**
     * ⏱️ UTILITÁRIOS DE TEMPO
     */
    timeUtils: {
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        
        timeout: function(promise, ms) {
            return Promise.race([
                promise,
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), ms)
                )
            ]);
        },
        
        retry: async function(fn, maxAttempts = 3, delay = 1000) {
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    return await fn();
                } catch (error) {
                    if (attempt === maxAttempts) throw error;
                    console.log(`Tentativa ${attempt} falhou, tentando novamente em ${delay}ms`);
                    await this.sleep(delay);
                }
            }
        },
        
        exemplo: `
            const { sleep, timeout, retry } = require('./timeUtils');
            
            // Aguardar 2 segundos
            await sleep(2000);
            
            // Timeout em operação
            try {
                const result = await timeout(longRunningOperation(), 5000);
            } catch (err) {
                console.log('Operação demorou mais que 5 segundos');
            }
            
            // Retry automático
            const result = await retry(async () => {
                const response = await fetch('https://api.exemplo.com/data');
                if (!response.ok) throw new Error('API Error');
                return response.json();
            }, 3, 1000);
        `
    }
};

// =============================================================================
// 6. DEMONSTRAÇÃO PRÁTICA
// =============================================================================

/**
 * 🎯 APLICAÇÃO DE DEMONSTRAÇÃO
 * 
 * Servidor HTTP simples que demonstra os conceitos aprendidos
 */
class NodeJSDemo {
    constructor() {
        this.server = null;
        this.logger = nodeUtilities.loggingUtils.Logger;
    }
    
    /**
     * 🚀 INICIALIZAR SERVIDOR DE DEMONSTRAÇÃO
     */
    init() {
        console.log('🚀 Inicializando demonstração Node.js...');
        
        // Simular criação do servidor
        this.server = httpServerUtils.servidorBasico.createServer((req, res) => {
            this.handleRequest(req, res);
        });
        
        // Iniciar servidor
        const port = 3000;
        this.server.listen(port, () => {
            this.logger.info('Servidor Node.js iniciado', { port });
        });
        
        // Demonstrar conceitos
        this.demonstrarConceitos();
    }
    
    /**
     * 📥 MANIPULAR REQUISIÇÕES
     */
    handleRequest(req, res) {
        const { url, method } = req;
        
        this.logger.info('Requisição recebida', { url, method });
        
        // Headers padrão
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('X-Powered-By', 'Node.js Demo');
        
        // Roteamento simples
        if (url === '/' && method === 'GET') {
            this.handleHome(req, res);
        } else if (url === '/api/info' && method === 'GET') {
            this.handleInfo(req, res);
        } else {
            this.handleNotFound(req, res);
        }
    }
    
    /**
     * 🏠 ROTA HOME
     */
    handleHome(req, res) {
        const response = {
            message: 'Bem-vindo ao Node.js Demo!',
            timestamp: new Date().toISOString(),
            version: process.version,
            platform: process.platform
        };
        
        res.statusCode = 200;
        res.end(JSON.stringify(response, null, 2));
    }
    
    /**
     * ℹ️ ROTA INFO
     */
    handleInfo(req, res) {
        const response = {
            nodeVersion: process.version,
            platform: process.platform,
            architecture: process.arch,
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development'
        };
        
        res.statusCode = 200;
        res.end(JSON.stringify(response, null, 2));
    }
    
    /**
     * ❌ ROTA NÃO ENCONTRADA
     */
    handleNotFound(req, res) {
        const response = {
            error: 'Rota não encontrada',
            url: req.url,
            method: req.method
        };
        
        res.statusCode = 404;
        res.end(JSON.stringify(response, null, 2));
    }
    
    /**
     * 🎓 DEMONSTRAR CONCEITOS
     */
    async demonstrarConceitos() {
        console.log('\n📚 Demonstrando conceitos Node.js...');
        
        // 1. Event Loop
        console.log('\n🔄 Event Loop:');
        console.log('1. Código síncrono');
        
        setTimeout(() => console.log('2. setTimeout'), 0);
        setImmediate(() => console.log('3. setImmediate'));
        process.nextTick(() => console.log('4. nextTick'));
        
        console.log('5. Mais código síncrono');
        
        // 2. Sistema de arquivos
        console.log('\n📁 Sistema de arquivos:');
        fileSystemUtils.leitura.readFile('config.json', 'utf8', (err, data) => {
            if (!err) console.log('✅ Arquivo lido com sucesso');
        });
        
        // 3. Streams
        console.log('\n🌊 Demonstração de conceitos de Streams');
        console.log('Streams permitem processar dados grandes eficientemente');
        
        // 4. Utilitários
        console.log('\n🛠️ Utilitários:');
        console.log('Path join:', nodeUtilities.pathUtils.join('pasta', 'arquivo.txt'));
        console.log('Extensão:', nodeUtilities.pathUtils.extname('arquivo.js'));
        
        // 5. Aguardar um pouco
        await nodeUtilities.timeUtils.sleep(2000);
        console.log('\n✅ Demonstração concluída!');
    }
}

// =============================================================================
// 7. INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 FUNÇÃO DE INICIALIZAÇÃO
 * 
 * Inicializa a demonstração dos fundamentos Node.js
 */
function initNodeJSFundamentals() {
    console.log('🌟 Inicializando módulo: Fundamentos do Node.js');
    console.log('📘 Conceitos abordados:');
    console.log('  • Runtime Node.js e motor V8');
    console.log('  • Event Loop e programação assíncrona');
    console.log('  • Sistema de módulos (CommonJS e ES Modules)');
    console.log('  • Sistema de arquivos e Streams');
    console.log('  • Servidores HTTP básicos');
    console.log('  • Utilitários e helpers essenciais');
    
    // Criar e inicializar demonstração
    const demo = new NodeJSDemo();
    demo.init();
    
    return {
        concepts: nodeJSConcepts,
        moduleSystem,
        fileSystem: fileSystemUtils,
        streams: streamUtils,
        httpServer: httpServerUtils,
        utilities: nodeUtilities,
        demo
    };
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNodeJSFundamentals,
        nodeJSConcepts,
        moduleSystem,
        fileSystemUtils,
        streamUtils,
        httpServerUtils,
        nodeUtilities,
        NodeJSDemo
    };
}

// Auto-inicializar se executado diretamente
if (typeof require !== 'undefined' && require.main === module) {
    initNodeJSFundamentals();
}

/**
 * 🎓 RESUMO DOS FUNDAMENTOS NODE.JS
 * 
 * Neste arquivo, você aprendeu:
 * 
 * 1. 🏗️ **Arquitetura do Node.js**: V8, libuv, Event Loop
 * 2. 📦 **Sistema de Módulos**: CommonJS e ES Modules
 * 3. 📁 **Sistema de Arquivos**: Leitura, escrita, diretórios
 * 4. 🌊 **Streams**: Processamento eficiente de dados
 * 5. 🌐 **Servidores HTTP**: Criação de APIs básicas
 * 6. 🛠️ **Utilitários**: Logging, paths, tempo, debugging
 * 
 * **Próximo arquivo**: 02-apis-restful.js
 * Onde você aprenderá a criar APIs REST profissionais!
 */