/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 2.3
TRATAMENTO DE ERROS
==============================================

Objetivos de Aprendizagem:
- Compreender tipos de erros em JavaScript
- Dominar try/catch/finally para captura de erros
- Criar e lançar erros customizados
- Implementar estratégias de debugging
- Aplicar boas práticas de tratamento de erros

⏱️ TEMPO ESTIMADO: 40 minutos
📊 NÍVEL: Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: TRATAMENTO DE ERROS
// ==========================================

/*
ERROS são situações inesperadas que podem interromper a execução do código.
Em JavaScript, temos diferentes tipos de erros:

1. SyntaxError - Erro de sintaxe no código
2. ReferenceError - Variável não declarada
3. TypeError - Tipo incorreto para operação
4. RangeError - Valor fora do intervalo permitido
5. Error - Erro genérico

Estrutura try/catch/finally:
- try: Bloco onde pode ocorrer erro
- catch: Captura e trata o erro
- finally: Sempre executa (opcional)
- throw: Lança erro customizado
*/

console.log('=== TRATAMENTO DE ERROS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== TIPOS DE ERROS ==========
console.log('\n--- TIPOS DE ERROS ---');

// Demonstração de diferentes tipos de erros
function demonstrarTiposErros() {
    console.log('\n🔍 Demonstrando tipos de erros:');
    
    // 1. ReferenceError
    try {
        console.log(varivelInexistente);
    } catch (error) {
        console.log(`❌ ReferenceError: ${error.message}`);
    }
    
    // 2. TypeError
    try {
        const numero = 42;
        numero.toUpperCase(); // Método de string em number
    } catch (error) {
        console.log(`❌ TypeError: ${error.message}`);
    }
    
    // 3. RangeError
    try {
        const array = new Array(-1); // Tamanho negativo
    } catch (error) {
        console.log(`❌ RangeError: ${error.message}`);
    }
    
    // 4. SyntaxError (em eval)
    try {
        eval('const x = ;'); // Sintaxe inválida
    } catch (error) {
        console.log(`❌ SyntaxError: ${error.message}`);
    }
}

demonstrarTiposErros();

// ========== TRY/CATCH BÁSICO ==========
console.log('\n--- TRY/CATCH BÁSICO ---');

function dividir(a, b) {
    try {
        if (typeof a !== 'number' || typeof b !== 'number') {
            throw new TypeError('Ambos os parâmetros devem ser números');
        }
        
        if (b === 0) {
            throw new Error('Divisão por zero não é permitida');
        }
        
        const resultado = a / b;
        console.log(`✅ ${a} ÷ ${b} = ${resultado}`);
        return resultado;
        
    } catch (error) {
        console.log(`❌ Erro na divisão: ${error.message}`);
        return null;
    }
}

// Testando a função
dividir(10, 2);     // Sucesso
dividir(10, 0);     // Erro: divisão por zero
dividir('10', 2);   // Erro: tipo inválido
dividir(15, 3);     // Sucesso

// ========== TRY/CATCH/FINALLY ==========
console.log('\n--- TRY/CATCH/FINALLY ---');

function processarArquivo(nomeArquivo) {
    console.log(`\n📁 Processando arquivo: ${nomeArquivo}`);
    
    try {
        // Simulando abertura de arquivo
        console.log('🔓 Abrindo arquivo...');
        
        if (!nomeArquivo || nomeArquivo.trim() === '') {
            throw new Error('Nome do arquivo não pode estar vazio');
        }
        
        if (!nomeArquivo.includes('.')) {
            throw new Error('Arquivo deve ter extensão');
        }
        
        // Simulando processamento
        console.log('⚙️ Processando dados...');
        
        // Simulando erro aleatório
        if (nomeArquivo.includes('corrupted')) {
            throw new Error('Arquivo corrompido');
        }
        
        console.log('✅ Arquivo processado com sucesso');
        return { sucesso: true, dados: 'Dados processados' };
        
    } catch (error) {
        console.log(`❌ Erro no processamento: ${error.message}`);
        return { sucesso: false, erro: error.message };
        
    } finally {
        // Sempre executa, independente de erro
        console.log('🔒 Fechando arquivo e liberando recursos');
    }
}

// Testando diferentes cenários
processarArquivo('dados.txt');           // Sucesso
processarArquivo('');                    // Erro: nome vazio
processarArquivo('arquivo_sem_extensao'); // Erro: sem extensão
processarArquivo('corrupted.txt');       // Erro: arquivo corrompido

// ========== ERROS CUSTOMIZADOS ==========
console.log('\n--- ERROS CUSTOMIZADOS ---');

// Criando classes de erro personalizadas
class ValidacaoError extends Error {
    constructor(message, campo) {
        super(message);
        this.name = 'ValidacaoError';
        this.campo = campo;
    }
}

class AutenticacaoError extends Error {
    constructor(message, codigo) {
        super(message);
        this.name = 'AutenticacaoError';
        this.codigo = codigo;
    }
}

class ConexaoError extends Error {
    constructor(message, url) {
        super(message);
        this.name = 'ConexaoError';
        this.url = url;
    }
}

// Sistema de validação com erros customizados
class ValidadorUsuario {
    static validarEmail(email) {
        if (!email || email.trim() === '') {
            throw new ValidacaoError('Email é obrigatório', 'email');
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            throw new ValidacaoError('Formato de email inválido', 'email');
        }
        
        return true;
    }
    
    static validarSenha(senha) {
        if (!senha || senha.length < 6) {
            throw new ValidacaoError('Senha deve ter pelo menos 6 caracteres', 'senha');
        }
        
        if (!/[A-Z]/.test(senha)) {
            throw new ValidacaoError('Senha deve conter pelo menos uma letra maiúscula', 'senha');
        }
        
        if (!/[0-9]/.test(senha)) {
            throw new ValidacaoError('Senha deve conter pelo menos um número', 'senha');
        }
        
        return true;
    }
    
    static validarIdade(idade) {
        if (typeof idade !== 'number' || idade < 0) {
            throw new ValidacaoError('Idade deve ser um número positivo', 'idade');
        }
        
        if (idade < 18) {
            throw new ValidacaoError('Usuário deve ser maior de idade', 'idade');
        }
        
        if (idade > 120) {
            throw new ValidacaoError('Idade não pode ser superior a 120 anos', 'idade');
        }
        
        return true;
    }
}

// Função para registrar usuário
function registrarUsuario(dadosUsuario) {
    console.log(`\n👤 Registrando usuário: ${dadosUsuario.nome}`);
    
    try {
        // Validações
        ValidadorUsuario.validarEmail(dadosUsuario.email);
        ValidadorUsuario.validarSenha(dadosUsuario.senha);
        ValidadorUsuario.validarIdade(dadosUsuario.idade);
        
        // Simulando verificação de email único
        if (dadosUsuario.email === 'admin@teste.com') {
            throw new AutenticacaoError('Email já está em uso', 'EMAIL_DUPLICADO');
        }
        
        // Simulando falha de conexão
        if (dadosUsuario.nome.includes('offline')) {
            throw new ConexaoError('Falha na conexão com o servidor', 'https://api.exemplo.com/usuarios');
        }
        
        console.log('✅ Usuário registrado com sucesso!');
        return { sucesso: true, id: Math.floor(Math.random() * 1000) };
        
    } catch (error) {
        if (error instanceof ValidacaoError) {
            console.log(`❌ Erro de validação no campo '${error.campo}': ${error.message}`);
        } else if (error instanceof AutenticacaoError) {
            console.log(`❌ Erro de autenticação [${error.codigo}]: ${error.message}`);
        } else if (error instanceof ConexaoError) {
            console.log(`❌ Erro de conexão com '${error.url}': ${error.message}`);
        } else {
            console.log(`❌ Erro inesperado: ${error.message}`);
        }
        
        return { sucesso: false, erro: error.message, tipo: error.name };
    }
}

// Testando diferentes cenários
const usuarios = [
    { nome: 'João', email: 'joao@email.com', senha: 'MinhaSenh@123', idade: 25 },
    { nome: 'Maria', email: '', senha: 'senha123', idade: 30 },
    { nome: 'Pedro', email: 'pedro@email.com', senha: '123', idade: 22 },
    { nome: 'Ana', email: 'ana@email.com', senha: 'SenhaForte1', idade: 16 },
    { nome: 'Carlos', email: 'admin@teste.com', senha: 'Admin123', idade: 35 },
    { nome: 'offline', email: 'offline@email.com', senha: 'Senha123', idade: 28 }
];

usuarios.forEach(usuario => registrarUsuario(usuario));

// ========== ASYNC/AWAIT COM TRATAMENTO DE ERROS ==========
console.log('\n--- ASYNC/AWAIT COM ERROS ---');

// Simulando operações assíncronas
function simularRequisicaoHTTP(url, sucesso = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (sucesso) {
                resolve({ status: 200, dados: `Dados de ${url}` });
            } else {
                reject(new ConexaoError(`Falha na requisição para ${url}`, url));
            }
        }, Math.random() * 1000); // Delay aleatório
    });
}

// Função assíncrona com tratamento de erros
async function buscarDadosUsuario(id) {
    console.log(`\n🔍 Buscando dados do usuário ${id}...`);
    
    try {
        // Múltiplas requisições
        const perfilPromise = simularRequisicaoHTTP(`/usuarios/${id}`, true);
        const configPromise = simularRequisicaoHTTP(`/usuarios/${id}/config`, id !== 999);
        const historicoPromise = simularRequisicaoHTTP(`/usuarios/${id}/historico`, true);
        
        // Aguardando todas as requisições
        const [perfil, config, historico] = await Promise.all([
            perfilPromise,
            configPromise,
            historicoPromise
        ]);
        
        console.log('✅ Todos os dados carregados:');
        console.log(`  - Perfil: ${perfil.dados}`);
        console.log(`  - Config: ${config.dados}`);
        console.log(`  - Histórico: ${historico.dados}`);
        
        return { perfil, config, historico };
        
    } catch (error) {
        if (error instanceof ConexaoError) {
            console.log(`❌ Erro de conexão: ${error.message}`);
            console.log(`   URL problemática: ${error.url}`);
        } else {
            console.log(`❌ Erro inesperado: ${error.message}`);
        }
        
        throw error; // Re-propaga o erro
    }
}

// Testando operações assíncronas
(async () => {
    try {
        await buscarDadosUsuario(123); // Sucesso
    } catch (error) {
        console.log('Erro capturado no nível superior');
    }
    
    try {
        await buscarDadosUsuario(999); // Falha na config
    } catch (error) {
        console.log('Erro capturado no nível superior');
    }
})();

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Calculadora Robusta
console.log('\n--- EXERCÍCIO 1: CALCULADORA ROBUSTA ---');

class CalculadoraRobusta {
    static somar(a, b) {
        try {
            this.validarNumeros(a, b);
            return a + b;
        } catch (error) {
            throw new Error(`Erro na soma: ${error.message}`);
        }
    }
    
    static subtrair(a, b) {
        try {
            this.validarNumeros(a, b);
            return a - b;
        } catch (error) {
            throw new Error(`Erro na subtração: ${error.message}`);
        }
    }
    
    static multiplicar(a, b) {
        try {
            this.validarNumeros(a, b);
            const resultado = a * b;
            
            if (!isFinite(resultado)) {
                throw new RangeError('Resultado muito grande');
            }
            
            return resultado;
        } catch (error) {
            throw new Error(`Erro na multiplicação: ${error.message}`);
        }
    }
    
    static dividir(a, b) {
        try {
            this.validarNumeros(a, b);
            
            if (b === 0) {
                throw new Error('Divisão por zero');
            }
            
            return a / b;
        } catch (error) {
            throw new Error(`Erro na divisão: ${error.message}`);
        }
    }
    
    static potencia(base, expoente) {
        try {
            this.validarNumeros(base, expoente);
            
            const resultado = Math.pow(base, expoente);
            
            if (!isFinite(resultado)) {
                throw new RangeError('Resultado muito grande');
            }
            
            return resultado;
        } catch (error) {
            throw new Error(`Erro na potenciação: ${error.message}`);
        }
    }
    
    static validarNumeros(...numeros) {
        for (let i = 0; i < numeros.length; i++) {
            const num = numeros[i];
            
            if (typeof num !== 'number') {
                throw new TypeError(`Parâmetro ${i + 1} deve ser um número`);
            }
            
            if (isNaN(num)) {
                throw new Error(`Parâmetro ${i + 1} não é um número válido`);
            }
        }
    }
    
    static calcular(operacao, a, b) {
        try {
            switch (operacao) {
                case '+':
                    return this.somar(a, b);
                case '-':
                    return this.subtrair(a, b);
                case '*':
                    return this.multiplicar(a, b);
                case '/':
                    return this.dividir(a, b);
                case '**':
                    return this.potencia(a, b);
                default:
                    throw new Error(`Operação '${operacao}' não suportada`);
            }
        } catch (error) {
            console.log(`❌ ${error.message}`);
            return null;
        }
    }
}

// Testando a calculadora
const operacoes = [
    ['+', 10, 5],
    ['-', 10, 5],
    ['*', 10, 5],
    ['/', 10, 5],
    ['**', 2, 3],
    ['/', 10, 0],        // Erro: divisão por zero
    ['+', '10', 5],      // Erro: tipo inválido
    ['%', 10, 5],        // Erro: operação não suportada
    ['*', Infinity, 2]   // Erro: resultado muito grande
];

operacoes.forEach(([op, a, b]) => {
    const resultado = CalculadoraRobusta.calcular(op, a, b);
    if (resultado !== null) {
        console.log(`✅ ${a} ${op} ${b} = ${resultado}`);
    }
});

// EXERCÍCIO 2: Sistema de Log com Tratamento de Erros
console.log('\n--- EXERCÍCIO 2: SISTEMA DE LOG ---');

class SistemaLog {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
    }
    
    log(nivel, mensagem, dados = null) {
        try {
            this.validarParametros(nivel, mensagem);
            
            const entrada = {
                timestamp: new Date().toISOString(),
                nivel: nivel.toUpperCase(),
                mensagem,
                dados,
                id: this.gerarId()
            };
            
            this.adicionarLog(entrada);
            this.exibirLog(entrada);
            
        } catch (error) {
            console.error(`❌ Erro no sistema de log: ${error.message}`);
        }
    }
    
    validarParametros(nivel, mensagem) {
        const niveisValidos = ['info', 'warn', 'error', 'debug'];
        
        if (!nivel || typeof nivel !== 'string') {
            throw new TypeError('Nível deve ser uma string');
        }
        
        if (!niveisValidos.includes(nivel.toLowerCase())) {
            throw new Error(`Nível '${nivel}' inválido. Use: ${niveisValidos.join(', ')}`);
        }
        
        if (!mensagem || typeof mensagem !== 'string') {
            throw new TypeError('Mensagem deve ser uma string não vazia');
        }
    }
    
    adicionarLog(entrada) {
        this.logs.push(entrada);
        
        // Limita o número de logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift(); // Remove o mais antigo
        }
    }
    
    exibirLog(entrada) {
        const emoji = {
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
            DEBUG: '🐛'
        };
        
        const cor = {
            INFO: '\x1b[36m',    // Ciano
            WARN: '\x1b[33m',    // Amarelo
            ERROR: '\x1b[31m',   // Vermelho
            DEBUG: '\x1b[35m'    // Magenta
        };
        
        const reset = '\x1b[0m';
        
        console.log(
            `${emoji[entrada.nivel]} ${cor[entrada.nivel]}[${entrada.nivel}]${reset} ` +
            `${entrada.timestamp} - ${entrada.mensagem}` +
            (entrada.dados ? ` | Dados: ${JSON.stringify(entrada.dados)}` : '')
        );
    }
    
    gerarId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    obterLogs(nivel = null) {
        try {
            if (nivel) {
                return this.logs.filter(log => log.nivel === nivel.toUpperCase());
            }
            return [...this.logs]; // Cópia do array
        } catch (error) {
            console.error(`❌ Erro ao obter logs: ${error.message}`);
            return [];
        }
    }
    
    limparLogs() {
        try {
            const quantidade = this.logs.length;
            this.logs = [];
            console.log(`🗑️ ${quantidade} logs removidos`);
        } catch (error) {
            console.error(`❌ Erro ao limpar logs: ${error.message}`);
        }
    }
}

// Testando o sistema de log
const logger = new SistemaLog();

// Logs válidos
logger.log('info', 'Sistema iniciado');
logger.log('warn', 'Memória baixa', { memoria: '85%' });
logger.log('error', 'Falha na conexão', { url: 'https://api.exemplo.com' });
logger.log('debug', 'Variável X', { x: 42 });

// Logs inválidos
logger.log('', 'Mensagem sem nível');           // Erro: nível vazio
logger.log('critical', 'Nível inválido');       // Erro: nível não suportado
logger.log('info', null);                       // Erro: mensagem inválida

console.log(`\n📊 Total de logs: ${logger.obterLogs().length}`);
console.log(`📊 Logs de erro: ${logger.obterLogs('error').length}`);

// ==========================================
// 🚀 4. DICAS DE DEBUGGING
// ==========================================

console.log('\n=== DICAS DE DEBUGGING ===');

// DICA 1: Use console.trace() para rastrear chamadas
function funcaoA() {
    funcaoB();
}

function funcaoB() {
    funcaoC();
}

function funcaoC() {
    console.trace('🔍 Rastreamento de chamadas:');
}

console.log('\n--- DICA 1: Rastreamento de chamadas ---');
funcaoA();

// DICA 2: Use console.time() para medir performance
console.log('\n--- DICA 2: Medição de performance ---');

function operacaoLenta() {
    console.time('Operação lenta');
    
    // Simulando operação pesada
    let soma = 0;
    for (let i = 0; i < 1000000; i++) {
        soma += i;
    }
    
    console.timeEnd('Operação lenta');
    return soma;
}

operacaoLenta();

// DICA 3: Use console.assert() para validações
console.log('\n--- DICA 3: Assertions ---');

function validarIdade(idade) {
    console.assert(typeof idade === 'number', 'Idade deve ser um número');
    console.assert(idade >= 0, 'Idade deve ser positiva');
    console.assert(idade <= 150, 'Idade deve ser realista');
    
    return idade >= 18;
}

validarIdade(25);    // OK
validarIdade(-5);    // Assertion falha
validarIdade('30');  // Assertion falha

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Error handling: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Control_flow_and_error_handling');
console.log('📚 JavaScript.info - Error handling: https://javascript.info/try-catch');
console.log('📚 Custom Errors: https://javascript.info/custom-errors');
console.log('📚 Debugging: https://developer.chrome.com/docs/devtools/javascript/');
console.log('📚 Best Practices: https://www.jshint.com/');

console.log('\n✅ Módulo 2.3 - Tratamento de Erros concluído!');
console.log('📚 Próximo: Módulo 3 - Funções');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ValidacaoError,
        AutenticacaoError,
        ConexaoError,
        ValidadorUsuario,
        CalculadoraRobusta,
        SistemaLog,
        demonstrarTiposErros,
        dividir,
        processarArquivo,
        registrarUsuario,
        buscarDadosUsuario
    };
}