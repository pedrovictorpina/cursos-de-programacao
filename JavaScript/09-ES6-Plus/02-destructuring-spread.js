/*
===========================================
    MÓDULO 09 - ES6+ (ECMASCRIPT 2015+)
    Aula 02: Destructuring e Spread Operator
===========================================

Objetivos de Aprendizagem:
✓ Dominar destructuring de objetos e arrays
✓ Usar spread operator efetivamente
✓ Implementar rest parameters
✓ Aplicar padrões avançados
✓ Otimizar código com essas features
✓ Evitar armadilhas comuns
*/

// ===========================================
// 1. TEORIA: DESTRUCTURING
// ===========================================

/*
DESTRUCTURING ASSIGNMENT:

1. CONCEITO:
   - Sintaxe que permite extrair dados de arrays e objetos
   - Atribui valores a variáveis de forma concisa
   - Suporta valores padrão e renomeação

2. TIPOS:
   - Array destructuring: [a, b] = array
   - Object destructuring: {prop} = object
   - Nested destructuring: {a: {b}} = object
   - Mixed destructuring: {arr: [first]} = object

3. CARACTERÍSTICAS:
   - Valores padrão
   - Rest elements (...rest)
   - Renomeação de variáveis
   - Destructuring em parâmetros
   - Swapping de variáveis
*/

// ===========================================
// 2. DESTRUCTURING DE ARRAYS
// ===========================================

console.log('=== DESTRUCTURING DE ARRAYS ===');

// --- 2.1 Destructuring Básico ---
function exemploArrayBasico() {
    console.log('\n--- Array Destructuring Básico ---');
    
    // === SINTAXE BÁSICA ===
    const numeros = [1, 2, 3, 4, 5];
    
    // Forma tradicional
    const primeiro_tradicional = numeros[0];
    const segundo_tradicional = numeros[1];
    console.log('Forma tradicional:', { primeiro_tradicional, segundo_tradicional });
    
    // Destructuring
    const [primeiro, segundo, terceiro] = numeros;
    console.log('Destructuring:', { primeiro, segundo, terceiro });
    
    // === PULAR ELEMENTOS ===
    const [a, , c, , e] = numeros; // Pula índices 1 e 3
    console.log('Pulando elementos:', { a, c, e });
    
    // === VALORES PADRÃO ===
    const [x = 0, y = 0, z = 0, w = 100] = [10, 20];
    console.log('Valores padrão:', { x, y, z, w });
    
    // === REST ELEMENTS ===
    const [head, ...tail] = numeros;
    console.log('Head e tail:', { head, tail });
    
    const [first, second, ...rest] = numeros;
    console.log('First, second e rest:', { first, second, rest });
    
    // === SWAPPING DE VARIÁVEIS ===
    let var1 = 'A';
    let var2 = 'B';
    console.log('Antes do swap:', { var1, var2 });
    
    [var1, var2] = [var2, var1];
    console.log('Depois do swap:', { var1, var2 });
    
    // === MÚLTIPLOS SWAPS ===
    let [alpha, beta, gamma] = ['X', 'Y', 'Z'];
    console.log('Antes:', { alpha, beta, gamma });
    
    [alpha, beta, gamma] = [gamma, alpha, beta]; // Rotação
    console.log('Depois da rotação:', { alpha, beta, gamma });
}

exemploArrayBasico();

// --- 2.2 Destructuring Avançado ---
function exemploArrayAvancado() {
    console.log('\n--- Array Destructuring Avançado ---');
    
    // === ARRAYS ANINHADOS ===
    const matriz = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];
    
    // Destructuring aninhado
    const [[a1, a2], [b1, , b3], [c1]] = matriz;
    console.log('Matriz destructuring:', { a1, a2, b1, b3, c1 });
    
    // === FUNÇÃO QUE RETORNA ARRAY ===
    function getCoordinates() {
        return [10, 20, 30];
    }
    
    const [x, y, z = 0] = getCoordinates();
    console.log('Coordenadas:', { x, y, z });
    
    // === DESTRUCTURING COM ITERÁVEIS ===
    const string = 'Hello';
    const [char1, char2, ...restChars] = string;
    console.log('String destructuring:', { char1, char2, restChars });
    
    // Set destructuring
    const conjunto = new Set([1, 2, 3, 4, 5]);
    const [primeiro, segundo, ...resto] = conjunto;
    console.log('Set destructuring:', { primeiro, segundo, resto });
    
    // === DESTRUCTURING EM LOOPS ===
    const pares = [[1, 'um'], [2, 'dois'], [3, 'três']];
    
    console.log('\nLoop com destructuring:');
    for (const [numero, texto] of pares) {
        console.log(`  ${numero}: ${texto}`);
    }
    
    // === DESTRUCTURING COM MAP ===
    const mapa = new Map([
        ['nome', 'João'],
        ['idade', 30],
        ['cidade', 'São Paulo']
    ]);
    
    console.log('\nMap destructuring:');
    for (const [chave, valor] of mapa) {
        console.log(`  ${chave}: ${valor}`);
    }
    
    // === DESTRUCTURING CONDICIONAL ===
    function processarArray(arr) {
        if (!Array.isArray(arr) || arr.length === 0) {
            return { erro: 'Array inválido' };
        }
        
        const [primeiro, ...resto] = arr;
        return {
            primeiro,
            resto,
            total: arr.length,
            temMaisElementos: resto.length > 0
        };
    }
    
    console.log('\nProcessamento condicional:');
    console.log('Array válido:', processarArray([1, 2, 3, 4]));
    console.log('Array vazio:', processarArray([]));
    console.log('Não é array:', processarArray('string'));
}

exemploArrayAvancado();

// ===========================================
// 3. DESTRUCTURING DE OBJETOS
// ===========================================

console.log('\n=== DESTRUCTURING DE OBJETOS ===');

// --- 3.1 Destructuring Básico ---
function exemploObjetoBasico() {
    console.log('\n--- Object Destructuring Básico ---');
    
    // === SINTAXE BÁSICA ===
    const pessoa = {
        nome: 'Maria',
        idade: 28,
        cidade: 'Rio de Janeiro',
        profissao: 'Desenvolvedora'
    };
    
    // Forma tradicional
    const nome_tradicional = pessoa.nome;
    const idade_tradicional = pessoa.idade;
    console.log('Forma tradicional:', { nome_tradicional, idade_tradicional });
    
    // Destructuring
    const { nome, idade, cidade } = pessoa;
    console.log('Destructuring:', { nome, idade, cidade });
    
    // === RENOMEAÇÃO DE VARIÁVEIS ===
    const { nome: nomeCompleto, idade: anos, profissao: cargo } = pessoa;
    console.log('Renomeação:', { nomeCompleto, anos, cargo });
    
    // === VALORES PADRÃO ===
    const { nome: n, salario = 5000, bonus = 1000 } = pessoa;
    console.log('Valores padrão:', { n, salario, bonus });
    
    // === PROPRIEDADES COMPUTADAS ===
    const propriedade = 'cidade';
    const { [propriedade]: localidade } = pessoa;
    console.log('Propriedade computada:', { localidade });
    
    // === REST PROPERTIES ===
    const { nome: nomeRest, ...outrasPropriedades } = pessoa;
    console.log('Rest properties:', { nomeRest, outrasPropriedades });
    
    // === DESTRUCTURING ANINHADO ===
    const usuario = {
        id: 1,
        perfil: {
            pessoal: {
                nome: 'Ana',
                idade: 25
            },
            profissional: {
                empresa: 'TechCorp',
                cargo: 'Senior Dev'
            }
        },
        configuracoes: {
            tema: 'dark',
            idioma: 'pt-BR'
        }
    };
    
    // Destructuring aninhado
    const {
        id,
        perfil: {
            pessoal: { nome: nomeUsuario, idade: idadeUsuario },
            profissional: { empresa, cargo: cargoUsuario }
        },
        configuracoes: { tema, idioma = 'en-US' }
    } = usuario;
    
    console.log('Destructuring aninhado:', {
        id, nomeUsuario, idadeUsuario, empresa, cargoUsuario, tema, idioma
    });
}

exemploObjetoBasico();

// --- 3.2 Destructuring Avançado ---
function exemploObjetoAvancado() {
    console.log('\n--- Object Destructuring Avançado ---');
    
    // === DESTRUCTURING EM PARÂMETROS ===
    function criarPerfil({ nome, idade, cidade = 'Não informado', ...extras }) {
        return {
            nomeCompleto: nome.toUpperCase(),
            anos: idade,
            localizacao: cidade,
            informacoesExtras: extras,
            criadoEm: new Date().toISOString()
        };
    }
    
    const dadosUsuario = {
        nome: 'Carlos Silva',
        idade: 35,
        cidade: 'Brasília',
        profissao: 'Arquiteto',
        hobby: 'Fotografia',
        telefone: '(61) 99999-9999'
    };
    
    const perfil = criarPerfil(dadosUsuario);
    console.log('Perfil criado:', perfil);
    
    // === DESTRUCTURING COM VALIDAÇÃO ===
    function processarPedido({
        id,
        cliente: { nome: nomeCliente, email } = {},
        itens = [],
        desconto = 0,
        ...metadados
    } = {}) {
        // Validações
        if (!id) throw new Error('ID do pedido é obrigatório');
        if (!nomeCliente) throw new Error('Nome do cliente é obrigatório');
        if (!Array.isArray(itens) || itens.length === 0) {
            throw new Error('Pedido deve ter pelo menos um item');
        }
        
        const total = itens.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        const totalComDesconto = total * (1 - desconto);
        
        return {
            pedidoId: id,
            cliente: nomeCliente,
            email,
            totalItens: itens.length,
            valorTotal: total,
            desconto,
            valorFinal: totalComDesconto,
            metadados
        };
    }
    
    const pedido = {
        id: 'PED-001',
        cliente: {
            nome: 'João Santos',
            email: 'joao@email.com'
        },
        itens: [
            { nome: 'Produto A', preco: 100, quantidade: 2 },
            { nome: 'Produto B', preco: 50, quantidade: 1 }
        ],
        desconto: 0.1,
        origem: 'website',
        vendedor: 'Maria'
    };
    
    try {
        const resultado = processarPedido(pedido);
        console.log('Pedido processado:', resultado);
    } catch (error) {
        console.log('Erro no pedido:', error.message);
    }
    
    // === DESTRUCTURING DINÂMICO ===
    function extrairCampos(objeto, campos) {
        const resultado = {};
        
        for (const campo of campos) {
            if (campo.includes('.')) {
                // Propriedade aninhada
                const partes = campo.split('.');
                let valor = objeto;
                
                for (const parte of partes) {
                    valor = valor?.[parte];
                }
                
                resultado[campo] = valor;
            } else {
                // Propriedade simples
                const { [campo]: valor } = objeto;
                resultado[campo] = valor;
            }
        }
        
        return resultado;
    }
    
    const dadosCompletos = {
        usuario: {
            nome: 'Pedro',
            contato: {
                email: 'pedro@email.com',
                telefone: '123456789'
            }
        },
        configuracoes: {
            tema: 'light',
            notificacoes: true
        }
    };
    
    const camposDesejados = ['usuario.nome', 'usuario.contato.email', 'configuracoes.tema'];
    const dadosExtraidos = extrairCampos(dadosCompletos, camposDesejados);
    console.log('Dados extraídos dinamicamente:', dadosExtraidos);
    
    // === DESTRUCTURING COM ARRAYS DE OBJETOS ===
    const funcionarios = [
        { nome: 'Ana', departamento: 'TI', salario: 8000 },
        { nome: 'Bruno', departamento: 'RH', salario: 6000 },
        { nome: 'Carla', departamento: 'TI', salario: 9000 }
    ];
    
    // Extrair apenas nomes
    const nomes = funcionarios.map(({ nome }) => nome);
    console.log('Nomes dos funcionários:', nomes);
    
    // Filtrar e extrair dados específicos
    const funcionariosTI = funcionarios
        .filter(({ departamento }) => departamento === 'TI')
        .map(({ nome, salario }) => ({ nome, salario }));
    
    console.log('Funcionários de TI:', funcionariosTI);
    
    // Calcular estatísticas
    const estatisticas = funcionarios.reduce(
        (acc, { departamento, salario }) => {
            if (!acc[departamento]) {
                acc[departamento] = { total: 0, count: 0, salarios: [] };
            }
            
            acc[departamento].total += salario;
            acc[departamento].count += 1;
            acc[departamento].salarios.push(salario);
            
            return acc;
        },
        {}
    );
    
    console.log('Estatísticas por departamento:', estatisticas);
}

exemploObjetoAvancado();

// ===========================================
// 4. SPREAD OPERATOR
// ===========================================

console.log('\n=== SPREAD OPERATOR ===');

// --- 4.1 Spread com Arrays ---
function exemploSpreadArray() {
    console.log('\n--- Spread com Arrays ---');
    
    // === SINTAXE BÁSICA ===
    const array1 = [1, 2, 3];
    const array2 = [4, 5, 6];
    
    // Concatenação tradicional
    const concatenadoTradicional = array1.concat(array2);
    console.log('Concat tradicional:', concatenadoTradicional);
    
    // Spread operator
    const concatenadoSpread = [...array1, ...array2];
    console.log('Spread concat:', concatenadoSpread);
    
    // === INSERIR ELEMENTOS ===
    const numeros = [2, 3, 4];
    const numerosCompletos = [1, ...numeros, 5, 6];
    console.log('Inserir elementos:', numerosCompletos);
    
    // === CLONAR ARRAYS ===
    const original = [1, 2, 3, { a: 1 }];
    const clone = [...original];
    
    console.log('Original:', original);
    console.log('Clone:', clone);
    console.log('São iguais?', original === clone); // false
    console.log('Objetos internos são iguais?', original[3] === clone[3]); // true (shallow copy)
    
    // === CONVERTER ITERÁVEIS ===
    const string = 'Hello';
    const caracteres = [...string];
    console.log('String para array:', caracteres);
    
    const conjunto = new Set([1, 2, 3, 2, 1]);
    const arrayUnico = [...conjunto];
    console.log('Set para array:', arrayUnico);
    
    const mapa = new Map([['a', 1], ['b', 2]]);
    const arrayMapa = [...mapa];
    console.log('Map para array:', arrayMapa);
    
    // === ENCONTRAR MIN/MAX ===
    const valores = [10, 5, 8, 3, 15, 1];
    const minimo = Math.min(...valores);
    const maximo = Math.max(...valores);
    console.log('Min/Max:', { minimo, maximo });
    
    // === SPREAD EM FUNÇÕES ===
    function somar(a, b, c, d = 0) {
        return a + b + c + d;
    }
    
    const argumentos = [1, 2, 3, 4];
    const resultado = somar(...argumentos);
    console.log('Função com spread:', resultado);
    
    // === REMOVER DUPLICATAS ===
    const comDuplicatas = [1, 2, 2, 3, 3, 3, 4];
    const semDuplicatas = [...new Set(comDuplicatas)];
    console.log('Remover duplicatas:', semDuplicatas);
    
    // === MESCLAR E ORDENAR ===
    const lista1 = [3, 1, 4];
    const lista2 = [2, 5, 6];
    const mesclada = [...lista1, ...lista2].sort((a, b) => a - b);
    console.log('Mesclar e ordenar:', mesclada);
}

exemploSpreadArray();

// --- 4.2 Spread com Objetos ---
function exemploSpreadObjeto() {
    console.log('\n--- Spread com Objetos ---');
    
    // === SINTAXE BÁSICA ===
    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    
    // Merge tradicional
    const mergeTradicional = Object.assign({}, obj1, obj2);
    console.log('Merge tradicional:', mergeTradicional);
    
    // Spread operator
    const mergeSpread = { ...obj1, ...obj2 };
    console.log('Spread merge:', mergeSpread);
    
    // === SOBRESCREVER PROPRIEDADES ===
    const base = { nome: 'João', idade: 30, cidade: 'SP' };
    const atualizacao = { idade: 31, profissao: 'Dev' };
    
    const atualizado = { ...base, ...atualizacao };
    console.log('Objeto atualizado:', atualizado);
    
    // === CLONAR OBJETOS ===
    const original = { nome: 'Maria', dados: { idade: 25 } };
    const clone = { ...original };
    
    console.log('Original:', original);
    console.log('Clone:', clone);
    console.log('São iguais?', original === clone); // false
    console.log('Dados internos são iguais?', original.dados === clone.dados); // true (shallow copy)
    
    // === ADICIONAR PROPRIEDADES ===
    const usuario = { nome: 'Pedro', email: 'pedro@email.com' };
    const usuarioCompleto = {
        ...usuario,
        id: Date.now(),
        criadoEm: new Date().toISOString(),
        ativo: true
    };
    
    console.log('Usuário completo:', usuarioCompleto);
    
    // === REMOVER PROPRIEDADES ===
    const { senha, ...usuarioSemSenha } = {
        nome: 'Ana',
        email: 'ana@email.com',
        senha: 'secret123',
        idade: 28
    };
    
    console.log('Usuário sem senha:', usuarioSemSenha);
    
    // === CONFIGURAÇÕES PADRÃO ===
    function criarConfiguracao(opcoes = {}) {
        const padroes = {
            tema: 'light',
            idioma: 'pt-BR',
            notificacoes: true,
            autoSave: false,
            timeout: 5000
        };
        
        return { ...padroes, ...opcoes };
    }
    
    const config1 = criarConfiguracao();
    const config2 = criarConfiguracao({ tema: 'dark', autoSave: true });
    
    console.log('Config padrão:', config1);
    console.log('Config customizada:', config2);
    
    // === MERGE CONDICIONAL ===
    function atualizarPerfil(perfilAtual, novosDados, condicoes = {}) {
        const { 
            permitirAlterarEmail = false,
            permitirAlterarNome = true,
            validarIdade = true
        } = condicoes;
        
        const atualizacoes = { ...novosDados };
        
        // Aplicar condições
        if (!permitirAlterarEmail) {
            delete atualizacoes.email;
        }
        
        if (!permitirAlterarNome) {
            delete atualizacoes.nome;
        }
        
        if (validarIdade && atualizacoes.idade && atualizacoes.idade < 0) {
            delete atualizacoes.idade;
        }
        
        return {
            ...perfilAtual,
            ...atualizacoes,
            ultimaAtualizacao: new Date().toISOString()
        };
    }
    
    const perfilAtual = {
        nome: 'Carlos',
        email: 'carlos@email.com',
        idade: 30
    };
    
    const novosDados = {
        nome: 'Carlos Silva',
        email: 'novo@email.com',
        idade: -5, // Inválida
        telefone: '123456789'
    };
    
    const perfilAtualizado = atualizarPerfil(perfilAtual, novosDados, {
        permitirAlterarEmail: false,
        validarIdade: true
    });
    
    console.log('Perfil atualizado:', perfilAtualizado);
}

exemploSpreadObjeto();

// ===========================================
// 5. REST PARAMETERS
// ===========================================

console.log('\n=== REST PARAMETERS ===');

function exemploRestParameters() {
    console.log('\n--- Rest Parameters ---');
    
    // === SINTAXE BÁSICA ===
    function somar(...numeros) {
        console.log('Argumentos recebidos:', numeros);
        return numeros.reduce((total, num) => total + num, 0);
    }
    
    console.log('Soma 1:', somar(1, 2, 3));
    console.log('Soma 2:', somar(1, 2, 3, 4, 5, 6));
    console.log('Soma 3:', somar());
    
    // === REST COM PARÂMETROS NOMEADOS ===
    function criarMensagem(tipo, titulo, ...detalhes) {
        const timestamp = new Date().toLocaleString('pt-BR');
        
        return {
            tipo,
            titulo,
            detalhes,
            timestamp,
            totalDetalhes: detalhes.length
        };
    }
    
    const mensagem1 = criarMensagem('info', 'Sistema iniciado');
    const mensagem2 = criarMensagem('error', 'Falha na conexão', 'Timeout', 'Retry failed', 'Check network');
    
    console.log('Mensagem 1:', mensagem1);
    console.log('Mensagem 2:', mensagem2);
    
    // === REST EM DESTRUCTURING ===
    function processarDados({ id, nome, ...outrosDados }) {
        return {
            identificacao: { id, nome },
            metadados: outrosDados,
            processadoEm: new Date().toISOString()
        };
    }
    
    const dados = {
        id: 1,
        nome: 'Produto A',
        preco: 100,
        categoria: 'Eletrônicos',
        estoque: 50,
        descricao: 'Produto de alta qualidade'
    };
    
    const resultado = processarDados(dados);
    console.log('Dados processados:', resultado);
    
    // === FUNÇÃO VARIÁDICA AVANÇADA ===
    function executarOperacoes(operacao, ...valores) {
        const operacoes = {
            soma: (nums) => nums.reduce((a, b) => a + b, 0),
            produto: (nums) => nums.reduce((a, b) => a * b, 1),
            media: (nums) => nums.reduce((a, b) => a + b, 0) / nums.length,
            maximo: (nums) => Math.max(...nums),
            minimo: (nums) => Math.min(...nums),
            ordenar: (nums) => [...nums].sort((a, b) => a - b)
        };
        
        if (!operacoes[operacao]) {
            throw new Error(`Operação '${operacao}' não suportada`);
        }
        
        if (valores.length === 0) {
            throw new Error('Pelo menos um valor é necessário');
        }
        
        const resultado = operacoes[operacao](valores);
        
        return {
            operacao,
            valores,
            resultado,
            totalValores: valores.length
        };
    }
    
    console.log('\nOperações matemáticas:');
    console.log('Soma:', executarOperacoes('soma', 1, 2, 3, 4, 5));
    console.log('Produto:', executarOperacoes('produto', 2, 3, 4));
    console.log('Média:', executarOperacoes('media', 10, 20, 30));
    console.log('Máximo:', executarOperacoes('maximo', 5, 15, 3, 9, 12));
    console.log('Ordenar:', executarOperacoes('ordenar', 5, 1, 9, 3, 7));
    
    // === CURRY COM REST ===
    function criarLogger(nivel, ...prefixos) {
        const timestamp = () => new Date().toISOString();
        
        return function(...mensagens) {
            const prefixoCompleto = prefixos.length > 0 ? `[${prefixos.join('][')}]` : '';
            const log = `[${timestamp()}] [${nivel.toUpperCase()}] ${prefixoCompleto} ${mensagens.join(' ')}`;
            
            console.log(log);
            return log;
        };
    }
    
    const loggerInfo = criarLogger('info', 'APP', 'AUTH');
    const loggerError = criarLogger('error', 'DB', 'CONNECTION');
    
    console.log('\nExemplos de logging:');
    loggerInfo('Usuário logado com sucesso');
    loggerError('Falha na conexão com banco', 'Timeout após 5s');
    
    // === PIPELINE COM REST ===
    function pipeline(valor, ...funcoes) {
        return funcoes.reduce((resultado, funcao) => funcao(resultado), valor);
    }
    
    const dobrar = x => x * 2;
    const somar10 = x => x + 10;
    const elevarAoQuadrado = x => x * x;
    
    const resultadoPipeline = pipeline(5, dobrar, somar10, elevarAoQuadrado);
    console.log('\nPipeline (5 -> dobrar -> +10 -> ^2):', resultadoPipeline); // ((5*2)+10)^2 = 400
}

exemploRestParameters();

// ===========================================
// 6. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Configuração Avançado ---
console.log('\n=== EXERCÍCIO: SISTEMA DE CONFIGURAÇÃO AVANÇADO ===');

class AdvancedConfigManager {
    constructor(defaultConfig = {}) {
        this.defaultConfig = Object.freeze({
            app: {
                name: 'MyApp',
                version: '1.0.0',
                debug: false
            },
            database: {
                host: 'localhost',
                port: 5432,
                ssl: false,
                poolSize: 10
            },
            cache: {
                enabled: true,
                ttl: 3600,
                maxSize: 1000
            },
            logging: {
                level: 'info',
                format: 'json',
                outputs: ['console']
            },
            ...defaultConfig
        });
        
        this.currentConfig = { ...this.defaultConfig };
        this.configHistory = [];
    }
    
    // Atualizar configuração com merge inteligente
    updateConfig(updates, options = {}) {
        const {
            merge = true,
            validate = true,
            saveHistory = true
        } = options;
        
        if (saveHistory) {
            this.configHistory.push({
                timestamp: new Date().toISOString(),
                config: { ...this.currentConfig }
            });
        }
        
        if (merge) {
            this.currentConfig = this.deepMerge(this.currentConfig, updates);
        } else {
            this.currentConfig = { ...this.defaultConfig, ...updates };
        }
        
        if (validate) {
            this.validateConfig();
        }
        
        return this.currentConfig;
    }
    
    // Merge profundo de objetos
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const [key, value] of Object.entries(source)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = this.deepMerge(target[key] || {}, value);
            } else {
                result[key] = value;
            }
        }
        
        return result;
    }
    
    // Extrair configuração específica
    getConfig(...paths) {
        if (paths.length === 0) {
            return { ...this.currentConfig };
        }
        
        const result = {};
        
        for (const path of paths) {
            const value = this.getNestedValue(this.currentConfig, path);
            this.setNestedValue(result, path, value);
        }
        
        return result;
    }
    
    // Obter valor aninhado
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }
    
    // Definir valor aninhado
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        
        const target = keys.reduce((current, key) => {
            if (!(key in current)) {
                current[key] = {};
            }
            return current[key];
        }, obj);
        
        target[lastKey] = value;
    }
    
    // Validar configuração
    validateConfig() {
        const { app, database, cache, logging } = this.currentConfig;
        
        // Validações básicas
        if (!app?.name || typeof app.name !== 'string') {
            throw new Error('app.name deve ser uma string não vazia');
        }
        
        if (database?.port && (database.port < 1 || database.port > 65535)) {
            throw new Error('database.port deve estar entre 1 e 65535');
        }
        
        if (cache?.maxSize && cache.maxSize < 1) {
            throw new Error('cache.maxSize deve ser maior que 0');
        }
        
        const validLogLevels = ['debug', 'info', 'warn', 'error'];
        if (logging?.level && !validLogLevels.includes(logging.level)) {
            throw new Error(`logging.level deve ser um de: ${validLogLevels.join(', ')}`);
        }
        
        return true;
    }
    
    // Gerar relatório de configuração
    generateReport() {
        const {
            app: { name, version, debug },
            database: { host, port, ssl, poolSize },
            cache: { enabled: cacheEnabled, ttl, maxSize },
            logging: { level, format, outputs }
        } = this.currentConfig;
        
        const totalConfigs = Object.keys(this.currentConfig).length;
        const historyCount = this.configHistory.length;
        
        return `
            📋 RELATÓRIO DE CONFIGURAÇÃO
            ============================
            
            🏷️  Aplicação:
               Nome: ${name}
               Versão: ${version}
               Debug: ${debug ? '✅ Ativo' : '❌ Inativo'}
            
            🗄️  Banco de Dados:
               Host: ${host}:${port}
               SSL: ${ssl ? '🔒 Ativo' : '🔓 Inativo'}
               Pool Size: ${poolSize} conexões
            
            💾 Cache:
               Status: ${cacheEnabled ? '✅ Ativo' : '❌ Inativo'}
               TTL: ${ttl}s
               Tamanho máximo: ${maxSize} itens
            
            📝 Logging:
               Nível: ${level.toUpperCase()}
               Formato: ${format}
               Saídas: ${outputs.join(', ')}
            
            📊 Estatísticas:
               Total de configurações: ${totalConfigs}
               Histórico de mudanças: ${historyCount}
               Última atualização: ${historyCount > 0 ? this.configHistory[historyCount - 1].timestamp : 'Nunca'}
        `;
    }
    
    // Exportar configuração
    export(format = 'json', ...sections) {
        const config = sections.length > 0 ? this.getConfig(...sections) : this.currentConfig;
        
        switch (format) {
            case 'json':
                return JSON.stringify(config, null, 2);
            
            case 'env':
                return this.toEnvFormat(config);
            
            case 'yaml':
                return this.toYamlFormat(config);
            
            default:
                throw new Error(`Formato '${format}' não suportado`);
        }
    }
    
    // Converter para formato ENV
    toEnvFormat(obj, prefix = '') {
        const lines = [];
        
        for (const [key, value] of Object.entries(obj)) {
            const envKey = prefix ? `${prefix}_${key.toUpperCase()}` : key.toUpperCase();
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                lines.push(...this.toEnvFormat(value, envKey).split('\n').filter(Boolean));
            } else {
                const envValue = Array.isArray(value) ? value.join(',') : String(value);
                lines.push(`${envKey}=${envValue}`);
            }
        }
        
        return lines.join('\n');
    }
    
    // Converter para formato YAML (simplificado)
    toYamlFormat(obj, indent = 0) {
        const spaces = ' '.repeat(indent);
        const lines = [];
        
        for (const [key, value] of Object.entries(obj)) {
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                lines.push(`${spaces}${key}:`);
                lines.push(this.toYamlFormat(value, indent + 2));
            } else if (Array.isArray(value)) {
                lines.push(`${spaces}${key}:`);
                for (const item of value) {
                    lines.push(`${spaces}  - ${item}`);
                }
            } else {
                lines.push(`${spaces}${key}: ${value}`);
            }
        }
        
        return lines.join('\n');
    }
    
    // Resetar para configuração padrão
    reset(...sections) {
        if (sections.length === 0) {
            this.currentConfig = { ...this.defaultConfig };
        } else {
            for (const section of sections) {
                const defaultValue = this.getNestedValue(this.defaultConfig, section);
                this.setNestedValue(this.currentConfig, section, defaultValue);
            }
        }
        
        return this.currentConfig;
    }
}

// Exemplo de uso do sistema de configuração avançado
function exemploSistemaConfiguracao() {
    console.log('\n--- Sistema de Configuração Avançado ---');
    
    const configManager = new AdvancedConfigManager();
    
    // Configuração inicial
    console.log('Configuração inicial:');
    console.log(configManager.generateReport());
    
    // Atualizar configurações
    configManager.updateConfig({
        app: {
            debug: true,
            environment: 'development'
        },
        database: {
            host: 'db.exemplo.com',
            ssl: true
        },
        cache: {
            ttl: 7200
        },
        logging: {
            level: 'debug',
            outputs: ['console', 'file']
        }
    });
    
    console.log('\nApós atualizações:');
    console.log(configManager.generateReport());
    
    // Extrair configurações específicas
    const dbConfig = configManager.getConfig('database.host', 'database.port', 'database.ssl');
    console.log('\nConfiguração do banco:', dbConfig);
    
    // Exportar em diferentes formatos
    console.log('\n--- Exportação JSON ---');
    console.log(configManager.export('json', 'app', 'database'));
    
    console.log('\n--- Exportação ENV ---');
    console.log(configManager.export('env', 'app'));
    
    console.log('\n--- Exportação YAML ---');
    console.log(configManager.export('yaml', 'cache', 'logging'));
}

setTimeout(exemploSistemaConfiguracao, 1000);

// ===========================================
// 7. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasDestructuringSpread = {
    performance: {
        // Destructuring é otimizado pelo engine
        destructuring: `
            // ✅ Bom - Destructuring é eficiente
            const { name, age } = user;
            
            // ✅ Bom - Usar valores padrão
            const { timeout = 5000 } = options;
            
            // ❌ Evitar - Destructuring desnecessário
            const { a } = { a: simpleValue }; // Use simpleValue diretamente
        `,
        
        spread: `
            // ✅ Bom - Spread para shallow copy
            const newArray = [...oldArray];
            const newObject = { ...oldObject };
            
            // ⚠️ Cuidado - Spread é shallow copy
            const original = { nested: { value: 1 } };
            const copy = { ...original };
            copy.nested.value = 2; // Modifica o original também!
            
            // ✅ Melhor - Deep copy quando necessário
            const deepCopy = JSON.parse(JSON.stringify(original));
        `,
        
        rest: `
            // ✅ Bom - Rest parameters são eficientes
            function sum(...numbers) {
                return numbers.reduce((a, b) => a + b, 0);
            }
            
            // ✅ Bom - Rest em destructuring
            const [first, ...rest] = array;
        `
    },
    
    boasPraticas: {
        // Usar destructuring para clareza
        clareza: `
            // ✅ Bom - Destructuring torna código mais claro
            function processUser({ name, email, age = 18 }) {
                // Parâmetros claros e valores padrão
            }
            
            // ✅ Bom - Renomear para evitar conflitos
            const { name: userName, id: userId } = user;
        `,
        
        // Evitar over-destructuring
        moderacao: `
            // ❌ Evitar - Over-destructuring
            const { a: { b: { c: { d } } } } = deepObject;
            
            // ✅ Melhor - Destructuring gradual
            const { a } = deepObject;
            const { b } = a;
            const { c } = b;
            const { d } = c;
        `
    }
};

// ===========================================
// 8. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasDestructuringSpread = {
    documentacao: [
        'MDN - Destructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment',
        'MDN - Spread: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax',
        'MDN - Rest parameters: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters'
    ],
    
    proximosTopicos: [
        '03-modules-import-export.js - Sistema de módulos ES6',
        '04-novas-features.js - Arrow functions, classes, symbols, etc.'
    ],
    
    exerciciosAdicionais: [
        'Criar sistema de validação com destructuring',
        'Implementar merge profundo de objetos',
        'Desenvolver parser de configurações',
        'Construir sistema de transformação de dados'
    ]
};

console.log('Referências:', referenciasDestructuringSpread.documentacao);
console.log('Próximos tópicos:', referenciasDestructuringSpread.proximosTopicos);
console.log('Exercícios adicionais:', referenciasDestructuringSpread.exerciciosAdicionais);

setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 AULA 02 - DESTRUCTURING E SPREAD OPERATOR CONCLUÍDA!');
    console.log('='.repeat(50));
    
    console.log('\n📚 CONCEITOS APRENDIDOS:');
    console.log('✓ Destructuring de arrays e objetos');
    console.log('✓ Spread operator para arrays e objetos');
    console.log('✓ Rest parameters em funções');
    console.log('✓ Valores padrão e renomeação');
    console.log('✓ Destructuring aninhado');
    console.log('✓ Padrões avançados de manipulação');
    
    console.log('\n🛠️ TÉCNICAS DOMINADAS:');
    console.log('✓ Clonagem e merge de objetos');
    console.log('✓ Extração seletiva de dados');
    console.log('✓ Funções variádicas');
    console.log('✓ Configuração com valores padrão');
    console.log('✓ Transformação de estruturas de dados');
    
    console.log('\n🚀 PRÓXIMA AULA:');
    console.log('🔜 03-modules-import-export.js');
    console.log('   - Sistema de módulos ES6');
    console.log('   - Import e export');
    console.log('   - Organização de código');
    
    console.log('\n' + '='.repeat(50));
}, 7000);

/*
===========================================
    FIM DA AULA 02 - DESTRUCTURING E SPREAD OPERATOR
===========================================

PARABÉNS! 🎉

Você dominou técnicas avançadas de manipulação de dados!

Esta aula cobriu:
- Destructuring de arrays e objetos
- Spread operator
- Rest parameters
- Padrões avançados
- Sistema de configuração completo

Continue para a próxima aula para aprender sobre
o sistema de módulos ES6! 🚀

===========================================
*/