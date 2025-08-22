/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 3.2
PARÂMETROS E ARGUMENTOS
==============================================

Objetivos de Aprendizagem:
- Compreender a diferença entre parâmetros e argumentos
- Dominar parâmetros padrão (default parameters)
- Trabalhar com rest parameters (...args)
- Entender o objeto arguments
- Aplicar destructuring em parâmetros
- Usar spread operator com argumentos

⏱️ TEMPO ESTIMADO: 50 minutos
📊 NÍVEL: Básico/Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: PARÂMETROS VS ARGUMENTOS
// ==========================================

/*
PARÂMETROS são as variáveis definidas na declaração da função.
ARGUMENTOS são os valores reais passados para a função quando ela é chamada.

CONCEITOS IMPORTANTES:
- Parâmetros são placeholders na definição da função
- Argumentos são os valores concretos passados na chamada
- JavaScript é flexível: pode receber mais ou menos argumentos que parâmetros
- Parâmetros não fornecidos recebem valor 'undefined'
- Argumentos extras são ignorados (mas acessíveis via 'arguments')

NOVOS RECURSOS ES6+:
- Default Parameters (Parâmetros Padrão)
- Rest Parameters (...args)
- Destructuring Parameters
- Spread Operator
*/

console.log('=== PARÂMETROS E ARGUMENTOS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== PARÂMETROS BÁSICOS ==========
console.log('\n--- PARÂMETROS BÁSICOS ---');

// Função com parâmetros definidos
function apresentar(nome, idade, profissao) {
    console.log(`Nome: ${nome}`);
    console.log(`Idade: ${idade}`);
    console.log(`Profissão: ${profissao}`);
    console.log('---');
}

// Chamadas com diferentes quantidades de argumentos
console.log('\n🔍 Testando diferentes quantidades de argumentos:');

// Todos os argumentos fornecidos
apresentar('Maria', 28, 'Desenvolvedora');

// Menos argumentos que parâmetros
apresentar('João', 35); // profissao será undefined

// Mais argumentos que parâmetros
apresentar('Ana', 22, 'Designer', 'São Paulo', 'Solteira'); // argumentos extras são ignorados

// ========== VERIFICANDO ARGUMENTOS ==========
console.log('\n--- VERIFICANDO ARGUMENTOS ---');

function verificarArgumentos(a, b, c) {
    console.log('\n📊 Análise dos argumentos:');
    console.log('Parâmetro a:', a, '(tipo:', typeof a, ')');
    console.log('Parâmetro b:', b, '(tipo:', typeof b, ')');
    console.log('Parâmetro c:', c, '(tipo:', typeof c, ')');
    console.log('Total de argumentos recebidos:', arguments.length);
    
    // Verificando se argumentos foram fornecidos
    if (a !== undefined) console.log('✅ Argumento "a" foi fornecido');
    if (b !== undefined) console.log('✅ Argumento "b" foi fornecido');
    if (c !== undefined) console.log('✅ Argumento "c" foi fornecido');
}

verificarArgumentos(10);
verificarArgumentos(10, 'texto');
verificarArgumentos(10, 'texto', true, 'extra');

// ========== PARÂMETROS PADRÃO (ES6+) ==========
console.log('\n--- PARÂMETROS PADRÃO ---');

// Sintaxe moderna com valores padrão
function criarPerfil(nome, idade = 18, cidade = 'Não informada', ativo = true) {
    return {
        nome,
        idade,
        cidade,
        ativo,
        criadoEm: new Date().toLocaleString('pt-BR')
    };
}

// Testando parâmetros padrão
console.log('\n👤 Criando perfis com parâmetros padrão:');
console.log('Perfil 1:', criarPerfil('Carlos'));
console.log('Perfil 2:', criarPerfil('Lucia', 25));
console.log('Perfil 3:', criarPerfil('Pedro', 30, 'Rio de Janeiro'));
console.log('Perfil 4:', criarPerfil('Ana', 28, 'São Paulo', false));

// Parâmetros padrão com expressões
function criarMensagem(texto, prefixo = '[INFO]', timestamp = new Date().toLocaleTimeString()) {
    return `${timestamp} ${prefixo} ${texto}`;
}

console.log('\n📝 Mensagens com timestamps:');
console.log(criarMensagem('Sistema iniciado'));
setTimeout(() => {
    console.log(criarMensagem('Processamento concluído', '[SUCESSO]'));
}, 100);

// Parâmetros padrão com funções
function gerarId() {
    return Math.random().toString(36).substr(2, 9);
}

function criarUsuario(nome, email, id = gerarId(), role = 'user') {
    return {
        id,
        nome,
        email,
        role,
        criadoEm: new Date().toISOString()
    };
}

console.log('\n👥 Criando usuários:');
console.log('Usuário 1:', criarUsuario('João', 'joao@email.com'));
console.log('Usuário 2:', criarUsuario('Maria', 'maria@email.com', 'admin001', 'admin'));

// ========== OBJETO ARGUMENTS ==========
console.log('\n--- OBJETO ARGUMENTS ---');

// Função que usa o objeto arguments (sintaxe tradicional)
function somarTodos() {
    console.log('\n🧮 Função somarTodos():');
    console.log('Tipo de arguments:', typeof arguments);
    console.log('É array?', Array.isArray(arguments));
    console.log('Tem length?', arguments.length);
    
    let soma = 0;
    
    // Iterando sobre arguments
    for (let i = 0; i < arguments.length; i++) {
        console.log(`Argumento ${i}:`, arguments[i]);
        if (typeof arguments[i] === 'number') {
            soma += arguments[i];
        }
    }
    
    return soma;
}

// Testando com diferentes quantidades de argumentos
console.log('Soma de 1, 2, 3:', somarTodos(1, 2, 3));
console.log('Soma de 10, 20, 30, 40:', somarTodos(10, 20, 30, 40));
console.log('Soma com tipos mistos:', somarTodos(5, 'texto', 10, true, 15));

// Convertendo arguments para array
function argumentsParaArray() {
    console.log('\n🔄 Convertendo arguments para array:');
    
    // Método 1: Array.from()
    const array1 = Array.from(arguments);
    console.log('Array.from():', array1);
    
    // Método 2: Spread operator
    const array2 = [...arguments];
    console.log('Spread operator:', array2);
    
    // Método 3: Array.prototype.slice.call() (método antigo)
    const array3 = Array.prototype.slice.call(arguments);
    console.log('slice.call():', array3);
    
    // Agora podemos usar métodos de array
    console.log('Usando map():', array1.map(x => x * 2));
    console.log('Usando filter():', array1.filter(x => typeof x === 'number'));
}

argumentsParaArray(1, 'dois', 3, 'quatro', 5);

// ========== REST PARAMETERS (...args) ==========
console.log('\n--- REST PARAMETERS ---');

// Sintaxe moderna com rest parameters
function somarComRest(...numeros) {
    console.log('\n➕ Função somarComRest():');
    console.log('Tipo de numeros:', typeof numeros);
    console.log('É array?', Array.isArray(numeros));
    console.log('Números recebidos:', numeros);
    
    // Agora é um array real, podemos usar métodos de array
    return numeros
        .filter(num => typeof num === 'number')
        .reduce((soma, num) => soma + num, 0);
}

console.log('Soma com rest:', somarComRest(1, 2, 3, 4, 5));
console.log('Soma com tipos mistos:', somarComRest(10, 'texto', 20, null, 30));

// Rest parameters com outros parâmetros
function criarRelatorio(titulo, autor, ...dados) {
    console.log('\n📊 Criando relatório:');
    console.log('Título:', titulo);
    console.log('Autor:', autor);
    console.log('Dados adicionais:', dados);
    
    return {
        titulo,
        autor,
        dados,
        totalItens: dados.length,
        criadoEm: new Date().toLocaleString('pt-BR')
    };
}

const relatorio = criarRelatorio(
    'Vendas Q1 2024',
    'João Silva',
    { mes: 'Jan', vendas: 1000 },
    { mes: 'Fev', vendas: 1200 },
    { mes: 'Mar', vendas: 1100 }
);
console.log('Relatório criado:', relatorio);

// Função que aceita callback e argumentos adicionais
function executarComLog(callback, ...args) {
    console.log('\n🔧 Executando função com log:');
    console.log('Função a executar:', callback.name || 'função anônima');
    console.log('Argumentos:', args);
    
    const inicio = Date.now();
    const resultado = callback(...args);
    const fim = Date.now();
    
    console.log('Resultado:', resultado);
    console.log('Tempo de execução:', fim - inicio, 'ms');
    
    return resultado;
}

// Testando com diferentes funções
function multiplicar(a, b) {
    return a * b;
}

function concatenar(...strings) {
    return strings.join(' ');
}

executarComLog(multiplicar, 5, 8);
executarComLog(concatenar, 'Olá', 'mundo', 'JavaScript!');

// ========== DESTRUCTURING EM PARÂMETROS ==========
console.log('\n--- DESTRUCTURING EM PARÂMETROS ---');

// Destructuring de objetos
function processarUsuario({ nome, email, idade = 18, ativo = true }) {
    console.log('\n👤 Processando usuário:');
    console.log('Nome:', nome);
    console.log('Email:', email);
    console.log('Idade:', idade);
    console.log('Ativo:', ativo);
    
    return {
        nomeCompleto: nome.toUpperCase(),
        emailValido: email.includes('@'),
        maiorIdade: idade >= 18,
        status: ativo ? 'Ativo' : 'Inativo'
    };
}

// Testando destructuring
const usuario1 = { nome: 'Maria Silva', email: 'maria@email.com', idade: 25 };
const usuario2 = { nome: 'João Santos', email: 'joao@email.com' };

console.log('Resultado 1:', processarUsuario(usuario1));
console.log('Resultado 2:', processarUsuario(usuario2));

// Destructuring de arrays
function calcularEstatisticas([primeiro, segundo, ...resto]) {
    console.log('\n📈 Calculando estatísticas:');
    console.log('Primeiro valor:', primeiro);
    console.log('Segundo valor:', segundo);
    console.log('Demais valores:', resto);
    
    const todos = [primeiro, segundo, ...resto].filter(x => typeof x === 'number');
    
    return {
        primeiro,
        segundo,
        total: todos.length,
        soma: todos.reduce((a, b) => a + b, 0),
        media: todos.length > 0 ? todos.reduce((a, b) => a + b, 0) / todos.length : 0,
        maior: Math.max(...todos),
        menor: Math.min(...todos)
    };
}

const numeros = [10, 20, 30, 40, 50];
console.log('Estatísticas:', calcularEstatisticas(numeros));

// Destructuring aninhado
function processarPedido({ cliente: { nome, email }, itens, total, desconto = 0 }) {
    console.log('\n🛒 Processando pedido:');
    console.log('Cliente:', nome, '(' + email + ')');
    console.log('Itens:', itens.length);
    console.log('Total:', total);
    console.log('Desconto:', desconto);
    
    const totalComDesconto = total - (total * desconto / 100);
    
    return {
        nomeCliente: nome,
        emailCliente: email,
        quantidadeItens: itens.length,
        valorOriginal: total,
        valorDesconto: total * desconto / 100,
        valorFinal: totalComDesconto
    };
}

const pedido = {
    cliente: {
        nome: 'Ana Costa',
        email: 'ana@email.com'
    },
    itens: [
        { produto: 'Notebook', preco: 2000 },
        { produto: 'Mouse', preco: 50 }
    ],
    total: 2050,
    desconto: 10
};

console.log('Pedido processado:', processarPedido(pedido));

// ========== SPREAD OPERATOR COM ARGUMENTOS ==========
console.log('\n--- SPREAD OPERATOR COM ARGUMENTOS ---');

// Função que espera argumentos separados
function calcularMedia(a, b, c, d, e) {
    const argumentos = [a, b, c, d, e].filter(x => x !== undefined);
    const soma = argumentos.reduce((acc, num) => acc + num, 0);
    return soma / argumentos.length;
}

// Usando spread para passar array como argumentos
const notas = [8.5, 9.0, 7.5, 8.0];
console.log('\n📚 Calculando média das notas:');
console.log('Notas:', notas);
console.log('Média:', calcularMedia(...notas));

// Combinando arrays com spread
function combinarArrays(...arrays) {
    console.log('\n🔗 Combinando arrays:');
    console.log('Arrays recebidos:', arrays.length);
    
    // Método 1: concat
    const combinado1 = [].concat(...arrays);
    
    // Método 2: spread
    const combinado2 = [].concat(...arrays);
    
    // Método 3: flat
    const combinado3 = arrays.flat();
    
    console.log('Resultado combinado:', combinado3);
    return combinado3;
}

const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const array3 = [7, 8, 9];

const resultado = combinarArrays(array1, array2, array3);

// Função que clona e modifica objetos
function atualizarConfiguracao(configAtual, ...atualizacoes) {
    console.log('\n⚙️ Atualizando configuração:');
    console.log('Config atual:', configAtual);
    console.log('Atualizações:', atualizacoes);
    
    // Aplicando todas as atualizações
    const novaConfig = { ...configAtual };
    
    atualizacoes.forEach(atualizacao => {
        Object.assign(novaConfig, atualizacao);
    });
    
    return novaConfig;
}

const configInicial = {
    tema: 'claro',
    idioma: 'pt-BR',
    notificacoes: true
};

const novaConfig = atualizarConfiguracao(
    configInicial,
    { tema: 'escuro' },
    { idioma: 'en-US' },
    { timeout: 5000 }
);

console.log('Nova configuração:', novaConfig);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Validação Flexível
console.log('\n--- EXERCÍCIO 1: SISTEMA DE VALIDAÇÃO ---');

// Criando um sistema de validação que aceita diferentes tipos de entrada
function criarValidador(tipo, ...opcoes) {
    const validadores = {
        email: {
            validar: (valor) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(valor);
            },
            mensagem: 'Email deve ter formato válido'
        },
        
        senha: {
            validar: (valor, minLength = 8, requireSpecial = true) => {
                if (valor.length < minLength) return false;
                if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(valor)) return false;
                return true;
            },
            mensagem: 'Senha deve ter pelo menos 8 caracteres e um caractere especial'
        },
        
        idade: {
            validar: (valor, min = 0, max = 120) => {
                const idade = parseInt(valor);
                return !isNaN(idade) && idade >= min && idade <= max;
            },
            mensagem: 'Idade deve ser um número entre 0 e 120'
        },
        
        telefone: {
            validar: (valor) => {
                const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
                return regex.test(valor);
            },
            mensagem: 'Telefone deve ter formato válido'
        }
    };
    
    const validador = validadores[tipo];
    if (!validador) {
        throw new Error(`Tipo de validador '${tipo}' não suportado`);
    }
    
    return function(valor, ...parametros) {
        const isValido = validador.validar(valor, ...opcoes, ...parametros);
        return {
            valido: isValido,
            valor,
            tipo,
            mensagem: isValido ? 'Válido' : validador.mensagem
        };
    };
}

// Criando validadores específicos
const validarEmail = criarValidador('email');
const validarSenha = criarValidador('senha', 10, true); // mínimo 10 chars, requer especial
const validarIdade = criarValidador('idade', 18, 65); // entre 18 e 65
const validarTelefone = criarValidador('telefone');

// Função para validar formulário completo
function validarFormulario({ email, senha, idade, telefone }, ...validadoresExtras) {
    console.log('\n📋 Validando formulário:');
    
    const resultados = {
        email: validarEmail(email),
        senha: validarSenha(senha),
        idade: validarIdade(idade),
        telefone: validarTelefone(telefone)
    };
    
    // Aplicando validadores extras
    validadoresExtras.forEach((validador, index) => {
        if (typeof validador === 'function') {
            resultados[`extra_${index}`] = validador();
        }
    });
    
    const todosValidos = Object.values(resultados).every(r => r.valido);
    
    return {
        valido: todosValidos,
        resultados,
        resumo: {
            total: Object.keys(resultados).length,
            validos: Object.values(resultados).filter(r => r.valido).length,
            invalidos: Object.values(resultados).filter(r => !r.valido).length
        }
    };
}

// Testando o sistema de validação
const dadosFormulario = {
    email: 'usuario@exemplo.com',
    senha: 'MinhaSenh@123',
    idade: '25',
    telefone: '(11) 99999-9999'
};

// Validador extra personalizado
const validarTermos = () => ({
    valido: true,
    valor: 'aceito',
    tipo: 'termos',
    mensagem: 'Termos aceitos'
});

const resultadoValidacao = validarFormulario(dadosFormulario, validarTermos);
console.log('Resultado da validação:', resultadoValidacao);

// Testando com dados inválidos
const dadosInvalidos = {
    email: 'email_invalido',
    senha: '123',
    idade: '150',
    telefone: '123'
};

const resultadoInvalido = validarFormulario(dadosInvalidos);
console.log('\nValidação com dados inválidos:', resultadoInvalido);

// EXERCÍCIO 2: Sistema de Configuração Dinâmica
console.log('\n--- EXERCÍCIO 2: CONFIGURAÇÃO DINÂMICA ---');

// Sistema que permite configuração flexível com diferentes tipos de parâmetros
function criarSistemaConfig() {
    let configuracao = {
        ambiente: 'desenvolvimento',
        debug: true,
        timeout: 5000,
        cache: {
            ativo: true,
            ttl: 3600
        },
        apis: {
            principal: 'https://api.exemplo.com',
            backup: 'https://backup.exemplo.com'
        }
    };
    
    // Função para atualizar configuração com destructuring
    function atualizar({ ambiente, debug, timeout, cache = {}, apis = {}, ...outras } = {}) {
        console.log('\n🔧 Atualizando configuração:');
        console.log('Parâmetros recebidos:', { ambiente, debug, timeout, cache, apis, outras });
        
        // Atualizando valores simples
        if (ambiente !== undefined) configuracao.ambiente = ambiente;
        if (debug !== undefined) configuracao.debug = debug;
        if (timeout !== undefined) configuracao.timeout = timeout;
        
        // Atualizando objetos aninhados
        configuracao.cache = { ...configuracao.cache, ...cache };
        configuracao.apis = { ...configuracao.apis, ...apis };
        
        // Adicionando configurações extras
        Object.keys(outras).forEach(chave => {
            configuracao[chave] = outras[chave];
        });
        
        return { ...configuracao };
    }
    
    // Função para obter configuração com valores padrão
    function obter(chave, valorPadrao = null) {
        const valor = chave.split('.').reduce((obj, key) => obj?.[key], configuracao);
        return valor !== undefined ? valor : valorPadrao;
    }
    
    // Função para aplicar múltiplas configurações
    function aplicarConfiguracoes(...configs) {
        console.log('\n📦 Aplicando múltiplas configurações:');
        console.log('Configurações a aplicar:', configs.length);
        
        configs.forEach((config, index) => {
            console.log(`Aplicando config ${index + 1}:`, config);
            atualizar(config);
        });
        
        return { ...configuracao };
    }
    
    // Função para resetar com configurações específicas
    function resetar(novaConfig = {}) {
        console.log('\n🔄 Resetando configuração:');
        
        const configPadrao = {
            ambiente: 'desenvolvimento',
            debug: true,
            timeout: 5000,
            cache: { ativo: true, ttl: 3600 },
            apis: {
                principal: 'https://api.exemplo.com',
                backup: 'https://backup.exemplo.com'
            }
        };
        
        configuracao = { ...configPadrao, ...novaConfig };
        return { ...configuracao };
    }
    
    // Função para validar configuração
    function validar() {
        const erros = [];
        
        if (!configuracao.ambiente) {
            erros.push('Ambiente é obrigatório');
        }
        
        if (configuracao.timeout < 1000) {
            erros.push('Timeout deve ser pelo menos 1000ms');
        }
        
        if (!configuracao.apis.principal) {
            erros.push('API principal é obrigatória');
        }
        
        return {
            valida: erros.length === 0,
            erros,
            configuracao: { ...configuracao }
        };
    }
    
    return {
        atualizar,
        obter,
        aplicarConfiguracoes,
        resetar,
        validar,
        
        // Getter para configuração atual
        get atual() {
            return { ...configuracao };
        }
    };
}

// Testando o sistema de configuração
const sistemaConfig = criarSistemaConfig();

console.log('\n⚙️ Testando sistema de configuração:');
console.log('Config inicial:', sistemaConfig.atual);

// Atualizando configurações individuais
sistemaConfig.atualizar({
    ambiente: 'producao',
    debug: false,
    timeout: 10000
});

console.log('Após primeira atualização:', sistemaConfig.atual);

// Atualizando configurações aninhadas
sistemaConfig.atualizar({
    cache: { ttl: 7200, maxSize: 1000 },
    apis: { principal: 'https://prod-api.exemplo.com' },
    logging: { level: 'info', file: 'app.log' }
});

console.log('Após segunda atualização:', sistemaConfig.atual);

// Aplicando múltiplas configurações
sistemaConfig.aplicarConfiguracoes(
    { ambiente: 'teste' },
    { debug: true },
    { 
        cache: { ativo: false },
        monitoring: { ativo: true, intervalo: 60000 }
    }
);

console.log('Após múltiplas configurações:', sistemaConfig.atual);

// Testando obtenção de valores
console.log('\n🔍 Obtendo valores específicos:');
console.log('Ambiente:', sistemaConfig.obter('ambiente'));
console.log('Cache TTL:', sistemaConfig.obter('cache.ttl'));
console.log('API principal:', sistemaConfig.obter('apis.principal'));
console.log('Valor inexistente:', sistemaConfig.obter('inexistente', 'valor padrão'));

// Validando configuração
const validacao = sistemaConfig.validar();
console.log('\n✅ Validação:', validacao);

// Resetando configuração
sistemaConfig.resetar({ ambiente: 'desenvolvimento', versao: '2.0.0' });
console.log('\nApós reset:', sistemaConfig.atual);

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Use rest parameters em vez do objeto arguments
console.log('\n--- DICA 1: Rest Parameters vs Arguments ---');

// ❌ Evite: objeto arguments
function somaAntiga() {
    let soma = 0;
    for (let i = 0; i < arguments.length; i++) {
        soma += arguments[i];
    }
    return soma;
}

// ✅ Prefira: rest parameters
function somaModerna(...numeros) {
    return numeros.reduce((soma, num) => soma + num, 0);
}

console.log('Soma antiga:', somaAntiga(1, 2, 3, 4));
console.log('Soma moderna:', somaModerna(1, 2, 3, 4));

// DICA 2: Use destructuring para APIs mais claras
console.log('\n--- DICA 2: Destructuring para APIs Claras ---');

// ❌ Evite: muitos parâmetros posicionais
function criarUsuarioAntigo(nome, email, idade, cidade, pais, telefone, ativo) {
    // Difícil de lembrar a ordem dos parâmetros
    return { nome, email, idade, cidade, pais, telefone, ativo };
}

// ✅ Prefira: destructuring com objeto
function criarUsuarioModerno({ nome, email, idade = 18, cidade = '', pais = 'Brasil', telefone = '', ativo = true }) {
    return { nome, email, idade, cidade, pais, telefone, ativo };
}

// Uso mais claro e flexível
const novoUsuario = criarUsuarioModerno({
    nome: 'João Silva',
    email: 'joao@email.com',
    cidade: 'São Paulo',
    telefone: '(11) 99999-9999'
    // outros parâmetros usam valores padrão
});

console.log('Usuário criado:', novoUsuario);

// DICA 3: Valide parâmetros quando necessário
console.log('\n--- DICA 3: Validação de Parâmetros ---');

function calcularJurosCompostos({ capital, taxa, tempo, periodo = 'anual' }) {
    // Validações
    if (typeof capital !== 'number' || capital <= 0) {
        throw new Error('Capital deve ser um número positivo');
    }
    
    if (typeof taxa !== 'number' || taxa <= 0) {
        throw new Error('Taxa deve ser um número positivo');
    }
    
    if (typeof tempo !== 'number' || tempo <= 0) {
        throw new Error('Tempo deve ser um número positivo');
    }
    
    const periodosValidos = ['anual', 'mensal', 'diario'];
    if (!periodosValidos.includes(periodo)) {
        throw new Error(`Período deve ser um de: ${periodosValidos.join(', ')}`);
    }
    
    // Cálculo
    const montante = capital * Math.pow(1 + (taxa / 100), tempo);
    const juros = montante - capital;
    
    return {
        capital,
        taxa,
        tempo,
        periodo,
        montante: Number(montante.toFixed(2)),
        juros: Number(juros.toFixed(2))
    };
}

// Testando validação
try {
    const resultado = calcularJurosCompostos({
        capital: 1000,
        taxa: 5,
        tempo: 2
    });
    console.log('Cálculo de juros:', resultado);
} catch (error) {
    console.error('Erro:', error.message);
}

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Function Parameters: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/arguments');
console.log('📚 MDN - Rest Parameters: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/rest_parameters');
console.log('📚 MDN - Default Parameters: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Default_parameters');
console.log('📚 MDN - Destructuring: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment');
console.log('📚 MDN - Spread Operator: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Spread_syntax');

console.log('\n✅ Módulo 3.2 - Parâmetros e Argumentos concluído!');
console.log('📚 Próximo: Closures e Escopo');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        criarPerfil,
        criarMensagem,
        criarUsuario,
        somarTodos,
        somarComRest,
        criarRelatorio,
        executarComLog,
        processarUsuario,
        calcularEstatisticas,
        processarPedido,
        calcularMedia,
        combinarArrays,
        atualizarConfiguracao,
        criarValidador,
        criarSistemaConfig,
        calcularJurosCompostos
    };
}