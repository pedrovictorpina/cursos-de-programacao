/*
===========================================
    MÓDULO 09 - ES6+ (ECMASCRIPT 2015+)
    Aula 01: let, const e Template Literals
===========================================

Objetivos de Aprendizagem:
✓ Dominar let e const vs var
✓ Entender escopo de bloco
✓ Usar template literals efetivamente
✓ Implementar tagged templates
✓ Aplicar boas práticas modernas
✓ Evitar armadilhas comuns
*/

// ===========================================
// 1. TEORIA: LET, CONST E VAR
// ===========================================

/*
DIFERENÇAS ENTRE VAR, LET E CONST:

1. ESCOPO:
   - var: Function scope ou global scope
   - let: Block scope
   - const: Block scope

2. HOISTING:
   - var: Hoisted e inicializada com undefined
   - let: Hoisted mas não inicializada (TDZ)
   - const: Hoisted mas não inicializada (TDZ)

3. REDECLARAÇÃO:
   - var: Permite redeclaração
   - let: Não permite redeclaração no mesmo escopo
   - const: Não permite redeclaração no mesmo escopo

4. REATRIBUIÇÃO:
   - var: Permite reatribuição
   - let: Permite reatribuição
   - const: Não permite reatribuição (mas objetos são mutáveis)

5. TEMPORAL DEAD ZONE (TDZ):
   - Período entre o hoisting e a declaração
   - Aplica-se a let e const
   - Gera ReferenceError se acessado
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Diferenças de Escopo ---
console.log('=== DIFERENÇAS DE ESCOPO ===');

// Demonstração de escopo com var vs let
function exemploEscopo() {
    console.log('\n--- Escopo: var vs let ---');
    
    // === VAR - FUNCTION SCOPE ===
    function exemploVar() {
        console.log('\n🔍 Exemplo com VAR:');
        
        if (true) {
            var varVariable = 'Eu sou var';
            console.log('Dentro do if (var):', varVariable);
        }
        
        // var é acessível fora do bloco if
        console.log('Fora do if (var):', varVariable);
        
        // Hoisting com var
        console.log('Antes da declaração (var):', typeof varHoisted); // undefined
        var varHoisted = 'Hoisted var';
        console.log('Depois da declaração (var):', varHoisted);
    }
    
    // === LET - BLOCK SCOPE ===
    function exemploLet() {
        console.log('\n🔍 Exemplo com LET:');
        
        if (true) {
            let letVariable = 'Eu sou let';
            console.log('Dentro do if (let):', letVariable);
        }
        
        // let não é acessível fora do bloco if
        try {
            console.log('Fora do if (let):', letVariable);
        } catch (error) {
            console.log('❌ Erro esperado:', error.message);
        }
        
        // Temporal Dead Zone com let
        try {
            console.log('Antes da declaração (let):', letHoisted);
        } catch (error) {
            console.log('❌ TDZ Error:', error.message);
        }
        
        let letHoisted = 'Hoisted let';
        console.log('Depois da declaração (let):', letHoisted);
    }
    
    exemploVar();
    exemploLet();
}

exemploEscopo();

// --- 2.2 Const e Imutabilidade ---
console.log('\n=== CONST E IMUTABILIDADE ===');

function exemploConst() {
    console.log('\n--- Const: Imutabilidade ---');
    
    // === CONST COM PRIMITIVOS ===
    console.log('\n🔍 Const com primitivos:');
    
    const numero = 42;
    const texto = 'Hello World';
    const booleano = true;
    
    console.log('Valores const:', { numero, texto, booleano });
    
    // Tentativa de reatribuição (erro)
    try {
        // numero = 43; // Descomente para ver o erro
        console.log('✅ Const primitivos são imutáveis');
    } catch (error) {
        console.log('❌ Erro de reatribuição:', error.message);
    }
    
    // === CONST COM OBJETOS ===
    console.log('\n🔍 Const com objetos:');
    
    const pessoa = {
        nome: 'João',
        idade: 30,
        hobbies: ['leitura', 'programação']
    };
    
    console.log('Objeto original:', pessoa);
    
    // Mutação é permitida
    pessoa.nome = 'Maria';
    pessoa.idade = 25;
    pessoa.hobbies.push('música');
    pessoa.profissao = 'Desenvolvedora';
    
    console.log('Objeto mutado:', pessoa);
    
    // Reatribuição não é permitida
    try {
        // pessoa = {}; // Descomente para ver o erro
        console.log('✅ Mutação permitida, reatribuição não');
    } catch (error) {
        console.log('❌ Erro de reatribuição:', error.message);
    }
    
    // === CONST COM ARRAYS ===
    console.log('\n🔍 Const com arrays:');
    
    const numeros = [1, 2, 3];
    console.log('Array original:', numeros);
    
    // Mutações permitidas
    numeros.push(4);
    numeros[0] = 10;
    numeros.pop();
    
    console.log('Array mutado:', numeros);
    
    // === IMUTABILIDADE REAL ===
    console.log('\n🔍 Imutabilidade real:');
    
    const objetoImutavel = Object.freeze({
        nome: 'Constante',
        valor: 100
    });
    
    // Tentativa de mutação (silenciosamente ignorada em modo não-strict)
    objetoImutavel.nome = 'Novo Nome';
    objetoImutavel.novaPropriedade = 'Nova';
    
    console.log('Objeto frozen:', objetoImutavel);
    
    // Imutabilidade profunda
    const deepFreeze = (obj) => {
        Object.getOwnPropertyNames(obj).forEach(prop => {
            if (obj[prop] !== null && typeof obj[prop] === 'object') {
                deepFreeze(obj[prop]);
            }
        });
        return Object.freeze(obj);
    };
    
    const objetoProfundo = deepFreeze({
        nivel1: {
            nivel2: {
                valor: 'profundo'
            }
        }
    });
    
    console.log('Objeto deep frozen:', objetoProfundo);
}

exemploConst();

// --- 2.3 Loops e Closures ---
console.log('\n=== LOOPS E CLOSURES ===');

function exemploLoopsClosures() {
    console.log('\n--- Loops: var vs let ---');
    
    // === PROBLEMA CLÁSSICO COM VAR ===
    console.log('\n🔍 Problema com var em loops:');
    
    const funcoesVar = [];
    
    for (var i = 0; i < 3; i++) {
        funcoesVar.push(function() {
            return `Função ${i}`; // i será sempre 3
        });
    }
    
    console.log('Resultado com var:');
    funcoesVar.forEach((fn, index) => {
        console.log(`  Função ${index}:`, fn());
    });
    
    // === SOLUÇÃO COM LET ===
    console.log('\n🔍 Solução com let:');
    
    const funcoesLet = [];
    
    for (let j = 0; j < 3; j++) {
        funcoesLet.push(function() {
            return `Função ${j}`; // j mantém o valor correto
        });
    }
    
    console.log('Resultado com let:');
    funcoesLet.forEach((fn, index) => {
        console.log(`  Função ${index}:`, fn());
    });
    
    // === SOLUÇÃO ALTERNATIVA COM VAR (IIFE) ===
    console.log('\n🔍 Solução alternativa com var (IIFE):');
    
    const funcoesIIFE = [];
    
    for (var k = 0; k < 3; k++) {
        funcoesIIFE.push((function(index) {
            return function() {
                return `Função ${index}`;
            };
        })(k));
    }
    
    console.log('Resultado com IIFE:');
    funcoesIIFE.forEach((fn, index) => {
        console.log(`  Função ${index}:`, fn());
    });
}

exemploLoopsClosures();

// ===========================================
// 3. TEMPLATE LITERALS
// ===========================================

console.log('\n=== TEMPLATE LITERALS ===');

// --- 3.1 Sintaxe Básica ---
function exemploTemplateBasico() {
    console.log('\n--- Template Literals Básicos ---');
    
    const nome = 'Ana';
    const idade = 28;
    const profissao = 'Desenvolvedora';
    
    // === CONCATENAÇÃO TRADICIONAL ===
    const mensagemTradicional = 'Olá, eu sou ' + nome + ', tenho ' + idade + ' anos e sou ' + profissao + '.';
    console.log('Concatenação tradicional:', mensagemTradicional);
    
    // === TEMPLATE LITERAL ===
    const mensagemTemplate = `Olá, eu sou ${nome}, tenho ${idade} anos e sou ${profissao}.`;
    console.log('Template literal:', mensagemTemplate);
    
    // === EXPRESSÕES COMPLEXAS ===
    const produto = {
        nome: 'Notebook',
        preco: 2500,
        desconto: 0.1
    };
    
    const mensagemProduto = `
        Produto: ${produto.nome}
        Preço original: R$ ${produto.preco.toFixed(2)}
        Desconto: ${(produto.desconto * 100)}%
        Preço final: R$ ${(produto.preco * (1 - produto.desconto)).toFixed(2)}
        Economia: R$ ${(produto.preco * produto.desconto).toFixed(2)}
    `;
    
    console.log('Mensagem do produto:', mensagemProduto);
    
    // === MULTILINHAS ===
    const poema = `
        Roses are red,
        Violets are blue,
        Template literals
        Are awesome too!
    `;
    
    console.log('Poema multilinhas:', poema);
    
    // === ESCAPE DE CARACTERES ===
    const mensagemEscape = `
        Aspas simples: 'texto'
        Aspas duplas: "texto"
        Backtick: \`template\`
        Cifrão: \${variavel}
        Quebra de linha: \n
        Nova linha
    `;
    
    console.log('Escape de caracteres:', mensagemEscape);
}

exemploTemplateBasico();

// --- 3.2 Funções em Templates ---
function exemploTemplateFuncoes() {
    console.log('\n--- Funções em Templates ---');
    
    // === CHAMADAS DE FUNÇÃO ===
    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }
    
    function formatarData(data) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(data);
    }
    
    const pedido = {
        id: 12345,
        cliente: 'Carlos Silva',
        valor: 1250.75,
        data: new Date(),
        itens: ['Produto A', 'Produto B', 'Produto C']
    };
    
    const relatorioPedido = `
        📋 RELATÓRIO DO PEDIDO
        =====================
        
        ID: #${pedido.id}
        Cliente: ${pedido.cliente.toUpperCase()}
        Data: ${formatarData(pedido.data)}
        Valor: ${formatarMoeda(pedido.valor)}
        
        Itens (${pedido.itens.length}):
        ${pedido.itens.map((item, index) => `${index + 1}. ${item}`).join('\n        ')}
        
        Status: ${pedido.valor > 1000 ? '🟢 PEDIDO PREMIUM' : '🔵 PEDIDO PADRÃO'}
    `;
    
    console.log(relatorioPedido);
    
    // === OPERAÇÕES MATEMÁTICAS ===
    const a = 10;
    const b = 5;
    
    const calculadora = `
        🧮 CALCULADORA
        ==============
        
        a = ${a}, b = ${b}
        
        Soma: ${a} + ${b} = ${a + b}
        Subtração: ${a} - ${b} = ${a - b}
        Multiplicação: ${a} × ${b} = ${a * b}
        Divisão: ${a} ÷ ${b} = ${(a / b).toFixed(2)}
        Potência: ${a}^${b} = ${Math.pow(a, b)}
        Módulo: ${a} % ${b} = ${a % b}
    `;
    
    console.log(calculadora);
    
    // === CONDICIONAIS COMPLEXAS ===
    const usuario = {
        nome: 'Maria',
        idade: 17,
        premium: true,
        pontos: 1250
    };
    
    const perfilUsuario = `
        👤 PERFIL DO USUÁRIO
        ===================
        
        Nome: ${usuario.nome}
        Idade: ${usuario.idade} anos
        Status: ${usuario.idade >= 18 ? '🔞 Adulto' : '👶 Menor de idade'}
        Plano: ${usuario.premium ? '⭐ Premium' : '🆓 Gratuito'}
        Pontos: ${usuario.pontos.toLocaleString('pt-BR')}
        Nível: ${usuario.pontos >= 1000 ? '🏆 Ouro' : usuario.pontos >= 500 ? '🥈 Prata' : '🥉 Bronze'}
        
        ${usuario.premium && usuario.pontos >= 1000 
            ? '🎉 Parabéns! Você é um usuário VIP!' 
            : 'Continue acumulando pontos para desbloquear benefícios!'}
    `;
    
    console.log(perfilUsuario);
}

exemploTemplateFuncoes();

// --- 3.3 Tagged Templates ---
console.log('\n=== TAGGED TEMPLATES ===');

function exemploTaggedTemplates() {
    console.log('\n--- Tagged Templates ---');
    
    // === TAG FUNCTION BÁSICA ===
    function highlight(strings, ...values) {
        console.log('\n🔍 Análise do tagged template:');
        console.log('Strings:', strings);
        console.log('Values:', values);
        
        return strings.reduce((result, string, i) => {
            const value = values[i] ? `<mark>${values[i]}</mark>` : '';
            return result + string + value;
        }, '');
    }
    
    const nome = 'JavaScript';
    const versao = 'ES6+';
    
    const resultado = highlight`Aprendendo ${nome} versão ${versao}!`;
    console.log('\nResultado highlighted:', resultado);
    
    // === TAG FUNCTION PARA FORMATAÇÃO ===
    function format(strings, ...values) {
        return strings.reduce((result, string, i) => {
            let value = values[i];
            
            if (value !== undefined) {
                // Formatação baseada no tipo
                if (typeof value === 'number') {
                    value = value.toLocaleString('pt-BR');
                } else if (value instanceof Date) {
                    value = value.toLocaleDateString('pt-BR');
                } else if (typeof value === 'string') {
                    value = value.trim();
                }
            } else {
                value = '';
            }
            
            return result + string + value;
        }, '');
    }
    
    const preco = 1234.56;
    const data = new Date();
    const produto = '  Smartphone  ';
    
    const mensagemFormatada = format`
        Produto: ${produto}
        Preço: R$ ${preco}
        Data: ${data}
    `;
    
    console.log('\nMensagem formatada:', mensagemFormatada);
    
    // === TAG FUNCTION PARA SANITIZAÇÃO ===
    function sanitize(strings, ...values) {
        const escapeHTML = (str) => {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };
        
        return strings.reduce((result, string, i) => {
            const value = values[i] ? escapeHTML(values[i]) : '';
            return result + string + value;
        }, '');
    }
    
    const userInput = '<script>alert("XSS")</script>';
    const comentario = 'Texto com "aspas" e <tags>';
    
    const htmlSeguro = sanitize`
        <div>
            <p>Input do usuário: ${userInput}</p>
            <p>Comentário: ${comentario}</p>
        </div>
    `;
    
    console.log('\nHTML sanitizado:', htmlSeguro);
    
    // === TAG FUNCTION PARA QUERIES ===
    function sql(strings, ...values) {
        console.log('\n🔍 SQL Query Builder:');
        
        // Simular escape de SQL
        const escapeSQL = (value) => {
            if (typeof value === 'string') {
                return `'${value.replace(/'/g, "''")}'`;
            }
            return value;
        };
        
        const query = strings.reduce((result, string, i) => {
            const value = values[i] ? escapeSQL(values[i]) : '';
            return result + string + value;
        }, '');
        
        console.log('Query gerada:', query);
        return query;
    }
    
    const tabela = 'usuarios';
    const nome_usuario = "João'Silva";
    const idade_min = 18;
    
    const query = sql`
        SELECT * FROM ${tabela} 
        WHERE nome = ${nome_usuario} 
        AND idade >= ${idade_min}
    `;
    
    // === TAG FUNCTION PARA INTERNACIONALIZAÇÃO ===
    const translations = {
        'pt-BR': {
            'hello': 'Olá',
            'welcome': 'Bem-vindo',
            'goodbye': 'Tchau'
        },
        'en-US': {
            'hello': 'Hello',
            'welcome': 'Welcome',
            'goodbye': 'Goodbye'
        }
    };
    
    function i18n(locale) {
        return function(strings, ...values) {
            const dict = translations[locale] || translations['pt-BR'];
            
            return strings.reduce((result, string, i) => {
                let value = values[i];
                
                if (value && dict[value]) {
                    value = dict[value];
                }
                
                return result + string + (value || '');
            }, '');
        };
    }
    
    const t_pt = i18n('pt-BR');
    const t_en = i18n('en-US');
    
    const usuario_nome = 'Maria';
    
    const mensagem_pt = t_pt`${'hello'}, ${usuario_nome}! ${'welcome'} ao sistema.`;
    const mensagem_en = t_en`${'hello'}, ${usuario_nome}! ${'welcome'} to the system.`;
    
    console.log('\nMensagem PT-BR:', mensagem_pt);
    console.log('Mensagem EN-US:', mensagem_en);
}

exemploTaggedTemplates();

// ===========================================
// 4. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Configuração ---
console.log('\n=== EXERCÍCIO: SISTEMA DE CONFIGURAÇÃO ===');

class ConfigurationManager {
    constructor() {
        // Usar const para configurações que não devem ser reatribuídas
        this.config = Object.freeze({
            app: {
                name: 'MeuApp',
                version: '1.0.0',
                environment: 'development'
            },
            database: {
                host: 'localhost',
                port: 5432,
                name: 'myapp_db'
            },
            features: {
                enableLogging: true,
                enableCache: true,
                maxRetries: 3
            }
        });
        
        // Usar let para valores que podem mudar
        this.runtimeConfig = {
            startTime: new Date(),
            requestCount: 0,
            lastActivity: null
        };
    }
    
    // Template para informações do sistema
    getSystemInfo() {
        const { app, database, features } = this.config;
        const uptime = Date.now() - this.runtimeConfig.startTime.getTime();
        const uptimeFormatted = this.formatUptime(uptime);
        
        return `
            🖥️  INFORMAÇÕES DO SISTEMA
            ===========================
            
            📱 Aplicação:
               Nome: ${app.name}
               Versão: ${app.version}
               Ambiente: ${app.environment.toUpperCase()}
            
            🗄️  Banco de Dados:
               Host: ${database.host}
               Porta: ${database.port}
               Database: ${database.name}
               URL: postgresql://${database.host}:${database.port}/${database.name}
            
            ⚙️  Features:
               Logging: ${features.enableLogging ? '✅ Ativo' : '❌ Inativo'}
               Cache: ${features.enableCache ? '✅ Ativo' : '❌ Inativo'}
               Max Retries: ${features.maxRetries}
            
            📊 Runtime:
               Uptime: ${uptimeFormatted}
               Requests: ${this.runtimeConfig.requestCount.toLocaleString('pt-BR')}
               Última atividade: ${this.runtimeConfig.lastActivity || 'Nenhuma'}
        `;
    }
    
    // Template para logs formatados
    createLogEntry(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const levelIcon = {
            'info': 'ℹ️',
            'warn': '⚠️',
            'error': '❌',
            'debug': '🐛',
            'success': '✅'
        }[level] || '📝';
        
        // Usar template literal para formatação complexa
        const logEntry = `
            ${levelIcon} [${timestamp}] ${level.toUpperCase()}
            ${'-'.repeat(50)}
            Message: ${message}
            ${data ? `Data: ${JSON.stringify(data, null, 2)}` : ''}
            Environment: ${this.config.app.environment}
            Request #: ${++this.runtimeConfig.requestCount}
        `;
        
        this.runtimeConfig.lastActivity = timestamp;
        return logEntry;
    }
    
    // Template para relatórios
    generateReport(type, filters = {}) {
        const reportId = `RPT-${Date.now()}`;
        const generatedAt = new Date().toLocaleString('pt-BR');
        
        // Usar destructuring com const
        const {
            startDate = 'N/A',
            endDate = 'N/A',
            category = 'Geral',
            includeDetails = true
        } = filters;
        
        return `
            📊 RELATÓRIO ${type.toUpperCase()}
            ${'='.repeat(40)}
            
            🆔 ID: ${reportId}
            📅 Gerado em: ${generatedAt}
            🏷️  Categoria: ${category}
            
            📈 Filtros Aplicados:
            ${startDate !== 'N/A' ? `   📅 Data início: ${startDate}` : ''}
            ${endDate !== 'N/A' ? `   📅 Data fim: ${endDate}` : ''}
            ${includeDetails ? '   📋 Detalhes incluídos' : '   📋 Resumo apenas'}
            
            ⚙️  Configuração Atual:
               App: ${this.config.app.name} v${this.config.app.version}
               Ambiente: ${this.config.app.environment}
               Features ativas: ${Object.entries(this.config.features)
                   .filter(([key, value]) => value === true)
                   .map(([key]) => key)
                   .join(', ')}
            
            📊 Estatísticas:
               Total de requests: ${this.runtimeConfig.requestCount}
               Uptime: ${this.formatUptime(Date.now() - this.runtimeConfig.startTime.getTime())}
        `;
    }
    
    // Utilitário para formatar uptime
    formatUptime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
    
    // Demonstrar uso de let em loops
    processConfigUpdates(updates) {
        const results = [];
        
        // Usar let no loop para escopo correto
        for (let i = 0; i < updates.length; i++) {
            const update = updates[i];
            
            // Simular processamento assíncrono
            const processUpdate = () => {
                return `Update ${i + 1}: ${update.key} = ${update.value}`;
            };
            
            results.push(processUpdate);
        }
        
        return results.map(fn => fn());
    }
}

// Exemplo de uso do sistema de configuração
function exemploSistemaConfiguracao() {
    console.log('\n--- Sistema de Configuração ---');
    
    const configManager = new ConfigurationManager();
    
    // Mostrar informações do sistema
    console.log(configManager.getSystemInfo());
    
    // Criar alguns logs
    console.log(configManager.createLogEntry('info', 'Sistema iniciado com sucesso'));
    console.log(configManager.createLogEntry('warn', 'Cache quase cheio', { usage: '85%' }));
    console.log(configManager.createLogEntry('error', 'Falha na conexão com banco', { 
        error: 'Connection timeout',
        retries: 3
    }));
    
    // Gerar relatório
    console.log(configManager.generateReport('performance', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        category: 'Performance',
        includeDetails: true
    }));
    
    // Demonstrar processamento de updates
    const updates = [
        { key: 'maxRetries', value: 5 },
        { key: 'enableCache', value: false },
        { key: 'logLevel', value: 'debug' }
    ];
    
    const updateResults = configManager.processConfigUpdates(updates);
    console.log('\n📝 Resultados dos updates:');
    updateResults.forEach(result => console.log(`  ${result}`));
}

setTimeout(exemploSistemaConfiguracao, 1000);

// ===========================================
// 5. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasES6Basico = {
    boasPraticas: {
        // Preferir const sempre que possível
        declaracoes: `
            // ✅ Bom - Usar const por padrão
            const API_URL = 'https://api.exemplo.com';
            const config = { timeout: 5000 };
            
            // ✅ Bom - Usar let quando precisar reatribuir
            let contador = 0;
            let resultado;
            
            // ❌ Evitar - var em código moderno
            var legacyVariable = 'evitar';
        `,
        
        // Template literals para strings complexas
        templates: `
            // ✅ Bom - Template literals para interpolação
            const mensagem = \`Olá \${nome}, você tem \${count} mensagens\`;
            
            // ✅ Bom - Multilinhas
            const html = \`
                <div class="card">
                    <h2>\${titulo}</h2>
                    <p>\${conteudo}</p>
                </div>
            \`;
            
            // ❌ Evitar - Concatenação complexa
            const mensagemRuim = 'Olá ' + nome + ', você tem ' + count + ' mensagens';
        `,
        
        // Escopo de bloco
        escopo: `
            // ✅ Bom - Usar escopo de bloco
            if (condicao) {
                const resultado = calcular();
                console.log(resultado);
            }
            // resultado não está acessível aqui
            
            // ✅ Bom - Let em loops
            for (let i = 0; i < array.length; i++) {
                setTimeout(() => console.log(i), 100); // i correto
            }
        `
    },
    
    performance: {
        // Template literals são otimizados
        otimizacao: `
            // ✅ Bom - Templates são otimizados pelo engine
            const template = \`\${a} + \${b} = \${a + b}\`;
            
            // ✅ Bom - Reutilizar templates
            const createMessage = (name, count) => \`\${name}: \${count}\`;
        `,
        
        // Evitar criação desnecessária
        memoria: `
            // ✅ Bom - Const para valores que não mudam
            const CONSTANTS = Object.freeze({
                MAX_SIZE: 1000,
                API_VERSION: 'v1'
            });
            
            // ❌ Evitar - Recriação desnecessária
            function badFunction() {
                const config = { /* objeto grande */ }; // Recriado a cada chamada
            }
        `
    }
};

// ===========================================
// 6. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasES6Basico = {
    documentacao: [
        'MDN - let: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
        'MDN - const: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
        'MDN - Template literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals',
        'ES6 Features: https://github.com/lukehoban/es6features'
    ],
    
    proximosTopicos: [
        '02-destructuring-spread.js - Destructuring e Spread Operator',
        '03-modules-import-export.js - Módulos ES6',
        '04-novas-features.js - Arrow functions, classes, etc.'
    ],
    
    exerciciosAdicionais: [
        'Criar sistema de templates para emails',
        'Implementar builder pattern com template literals',
        'Desenvolver sistema de logs estruturados',
        'Construir gerador de código SQL'
    ]
};

console.log('Referências:', referenciasES6Basico.documentacao);
console.log('Próximos tópicos:', referenciasES6Basico.proximosTopicos);
console.log('Exercícios adicionais:', referenciasES6Basico.exerciciosAdicionais);

setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 AULA 01 - LET, CONST E TEMPLATE LITERALS CONCLUÍDA!');
    console.log('='.repeat(50));
    
    console.log('\n📚 CONCEITOS APRENDIDOS:');
    console.log('✓ Diferenças entre var, let e const');
    console.log('✓ Escopo de bloco vs escopo de função');
    console.log('✓ Temporal Dead Zone (TDZ)');
    console.log('✓ Template literals e interpolação');
    console.log('✓ Tagged templates');
    console.log('✓ Boas práticas modernas');
    
    console.log('\n🛠️ TÉCNICAS DOMINADAS:');
    console.log('✓ Uso correto de const para imutabilidade');
    console.log('✓ Let em loops para closures corretos');
    console.log('✓ Templates para strings complexas');
    console.log('✓ Tagged templates para processamento');
    console.log('✓ Formatação e sanitização');
    
    console.log('\n🚀 PRÓXIMA AULA:');
    console.log('🔜 02-destructuring-spread.js');
    console.log('   - Destructuring de objetos e arrays');
    console.log('   - Spread e rest operators');
    console.log('   - Padrões avançados');
    
    console.log('\n' + '='.repeat(50));
}, 5000);

/*
===========================================
    FIM DA AULA 01 - LET, CONST E TEMPLATE LITERALS
===========================================

PARABÉNS! 🎉

Você dominou os fundamentos do JavaScript moderno!

Esta aula cobriu:
- Declarações modernas (let, const)
- Escopo de bloco
- Template literals e tagged templates
- Boas práticas ES6+

Continue para a próxima aula para aprender sobre
destructuring e spread operators! 🚀

===========================================
*/