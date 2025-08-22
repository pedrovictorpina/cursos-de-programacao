/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 3.1
DECLARAÇÃO DE FUNÇÕES
==============================================

Objetivos de Aprendizagem:
- Compreender diferentes formas de declarar funções
- Dominar function declarations vs function expressions
- Entender hoisting e seu impacto nas funções
- Aplicar funções anônimas e nomeadas
- Conhecer IIFE (Immediately Invoked Function Expression)

⏱️ TEMPO ESTIMADO: 45 minutos
📊 NÍVEL: Básico/Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: DECLARAÇÃO DE FUNÇÕES
// ==========================================

/*
FUNÇÕES são blocos de código reutilizáveis que executam uma tarefa específica.
Em JavaScript, existem várias formas de declarar funções:

1. Function Declaration (Declaração de Função)
2. Function Expression (Expressão de Função)
3. Arrow Functions (Funções Seta) - ES6+
4. Function Constructor (Construtor de Função)
5. Method Definition (Definição de Método)

CONCEITOS IMPORTANTES:
- Hoisting: Function declarations são "elevadas"
- Escopo: Funções criam seu próprio escopo
- First-class citizens: Funções são valores em JavaScript
- Closure: Funções "lembram" do ambiente onde foram criadas
*/

console.log('=== DECLARAÇÃO DE FUNÇÕES ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== FUNCTION DECLARATION ==========
console.log('\n--- FUNCTION DECLARATION ---');

// Sintaxe básica
function saudar(nome) {
    return `Olá, ${nome}! Bem-vindo(a)!`;
}

// Função sem parâmetros
function obterDataAtual() {
    return new Date().toLocaleDateString('pt-BR');
}

// Função com múltiplos parâmetros
function calcularArea(largura, altura) {
    return largura * altura;
}

// Função com valor padrão (ES6+)
function criarMensagem(texto, prefixo = '[INFO]') {
    return `${prefixo} ${texto}`;
}

// Testando as funções
console.log(saudar('Maria'));
console.log('Data atual:', obterDataAtual());
console.log('Área do retângulo:', calcularArea(5, 3));
console.log(criarMensagem('Sistema iniciado'));
console.log(criarMensagem('Erro detectado', '[ERRO]'));

// ========== HOISTING COM FUNCTION DECLARATIONS ==========
console.log('\n--- HOISTING ---');

// Esta chamada funciona devido ao hoisting
console.log('Resultado do hoisting:', funcaoComHoisting());

// A declaração é "elevada" para o topo
function funcaoComHoisting() {
    return 'Função foi elevada pelo hoisting!';
}

// Demonstração prática do hoisting
function demonstrarHoisting() {
    console.log('\n🔍 Demonstrando hoisting:');
    
    // Esta chamada funciona
    console.log('1. Chamada antes da declaração:', minhaFuncao());
    
    function minhaFuncao() {
        return 'Hoisting em ação!';
    }
    
    // Esta chamada também funciona
    console.log('2. Chamada após a declaração:', minhaFuncao());
}

demonstrarHoisting();

// ========== FUNCTION EXPRESSION ==========
console.log('\n--- FUNCTION EXPRESSION ---');

// Função anônima atribuída a uma variável
const somar = function(a, b) {
    return a + b;
};

// Função nomeada (útil para debugging)
const multiplicar = function multiplicacao(a, b) {
    return a * b;
};

// Function expression não sofre hoisting
// console.log(subtrair(10, 5)); // ❌ Erro: Cannot access 'subtrair' before initialization

const subtrair = function(a, b) {
    return a - b;
};

// Testando function expressions
console.log('Soma:', somar(10, 5));
console.log('Multiplicação:', multiplicar(4, 3));
console.log('Subtração:', subtrair(10, 5));

// ========== FUNÇÕES COMO VALORES ==========
console.log('\n--- FUNÇÕES COMO VALORES ---');

// Funções podem ser armazenadas em arrays
const operacoes = [
    function(a, b) { return a + b; },
    function(a, b) { return a - b; },
    function(a, b) { return a * b; },
    function(a, b) { return a / b; }
];

const simbolos = ['+', '-', '*', '/'];

console.log('Calculadora com array de funções:');
for (let i = 0; i < operacoes.length; i++) {
    const resultado = operacoes[i](12, 4);
    console.log(`12 ${simbolos[i]} 4 = ${resultado}`);
}

// Funções podem ser propriedades de objetos
const calculadora = {
    nome: 'Calculadora Avançada',
    versao: '1.0',
    
    somar: function(a, b) {
        return a + b;
    },
    
    // Método shorthand (ES6+)
    subtrair(a, b) {
        return a - b;
    },
    
    // Método com lógica mais complexa
    calcular: function(operacao, a, b) {
        switch (operacao) {
            case '+':
                return this.somar(a, b);
            case '-':
                return this.subtrair(a, b);
            default:
                return 'Operação não suportada';
        }
    }
};

console.log('\nCalculadora objeto:');
console.log(`${calculadora.nome} v${calculadora.versao}`);
console.log('15 + 8 =', calculadora.somar(15, 8));
console.log('15 - 8 =', calculadora.subtrair(15, 8));
console.log('Usando método calcular:', calculadora.calcular('+', 20, 5));

// ========== FUNÇÕES COMO PARÂMETROS ==========
console.log('\n--- FUNÇÕES COMO PARÂMETROS (CALLBACKS) ---');

// Função que recebe outra função como parâmetro
function executarOperacao(a, b, callback) {
    console.log(`Executando operação com ${a} e ${b}`);
    const resultado = callback(a, b);
    console.log(`Resultado: ${resultado}`);
    return resultado;
}

// Funções para usar como callbacks
function potencia(base, expoente) {
    return Math.pow(base, expoente);
}

function maximo(a, b) {
    return Math.max(a, b);
}

function minimo(a, b) {
    return Math.min(a, b);
}

// Testando callbacks
executarOperacao(2, 8, potencia);
executarOperacao(15, 7, maximo);
executarOperacao(15, 7, minimo);

// Callback com função anônima
executarOperacao(10, 3, function(a, b) {
    return (a + b) / 2; // Média
});

// ========== HIGHER-ORDER FUNCTIONS ==========
console.log('\n--- HIGHER-ORDER FUNCTIONS ---');

// Função que retorna outra função
function criarMultiplicador(fator) {
    return function(numero) {
        return numero * fator;
    };
}

// Criando funções especializadas
const dobrar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);
const multiplicarPor10 = criarMultiplicador(10);

console.log('Dobrar 5:', dobrar(5));
console.log('Triplicar 4:', triplicar(4));
console.log('Multiplicar 7 por 10:', multiplicarPor10(7));

// Função que cria validadores
function criarValidador(tipo) {
    switch (tipo) {
        case 'email':
            return function(valor) {
                return valor.includes('@') && valor.includes('.');
            };
        case 'telefone':
            return function(valor) {
                return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(valor);
            };
        case 'cep':
            return function(valor) {
                return /^\d{5}-\d{3}$/.test(valor);
            };
        default:
            return function() {
                return false;
            };
    }
}

// Criando validadores específicos
const validarEmail = criarValidador('email');
const validarTelefone = criarValidador('telefone');
const validarCEP = criarValidador('cep');

console.log('\nTestando validadores:');
console.log('Email válido:', validarEmail('usuario@exemplo.com'));
console.log('Email inválido:', validarEmail('email_invalido'));
console.log('Telefone válido:', validarTelefone('(11) 99999-9999'));
console.log('Telefone inválido:', validarTelefone('11999999999'));
console.log('CEP válido:', validarCEP('01234-567'));
console.log('CEP inválido:', validarCEP('12345678'));

// ========== IIFE (Immediately Invoked Function Expression) ==========
console.log('\n--- IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION) ---');

// IIFE básica
(function() {
    console.log('🚀 IIFE executada imediatamente!');
})();

// IIFE com parâmetros
(function(nome, versao) {
    console.log(`📦 Módulo ${nome} v${versao} inicializado`);
})('MeuModulo', '1.0.0');

// IIFE que retorna um valor
const configuracao = (function() {
    const config = {
        ambiente: 'desenvolvimento',
        debug: true,
        versao: '2.1.0'
    };
    
    // Configurações privadas
    const chaveSecreta = 'abc123';
    
    // Retorna apenas o que deve ser público
    return {
        obterAmbiente: function() {
            return config.ambiente;
        },
        
        isDebug: function() {
            return config.debug;
        },
        
        obterVersao: function() {
            return config.versao;
        },
        
        // Método que usa a chave secreta (privada)
        gerarToken: function() {
            return `token_${chaveSecreta}_${Date.now()}`;
        }
    };
})();

console.log('\nConfigurações do sistema:');
console.log('Ambiente:', configuracao.obterAmbiente());
console.log('Debug ativo:', configuracao.isDebug());
console.log('Versão:', configuracao.obterVersao());
console.log('Token gerado:', configuracao.gerarToken());
// console.log(configuracao.chaveSecreta); // ❌ undefined - variável privada

// ========== FUNCTION CONSTRUCTOR ==========
console.log('\n--- FUNCTION CONSTRUCTOR ---');

// Criando função usando o construtor Function (raramente usado)
const somarDinamico = new Function('a', 'b', 'return a + b');
const cumprimentar = new Function('nome', 'return "Olá, " + nome + "!"');

console.log('Soma dinâmica:', somarDinamico(5, 3));
console.log('Cumprimento:', cumprimentar('João'));

// Exemplo mais complexo com Function constructor
const criarFormula = function(formula) {
    return new Function('x', `return ${formula}`);
};

const quadratica = criarFormula('x * x + 2 * x + 1');
const cubica = criarFormula('x * x * x');

console.log('\nFórmulas dinâmicas:');
console.log('f(3) = 3² + 2*3 + 1 =', quadratica(3));
console.log('g(4) = 4³ =', cubica(4));

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Autenticação
console.log('\n--- EXERCÍCIO 1: SISTEMA DE AUTENTICAÇÃO ---');

// Criando um sistema de autenticação usando diferentes tipos de funções
const sistemaAuth = (function() {
    // Dados privados
    const usuarios = [
        { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
        { id: 2, username: 'user1', password: 'user123', role: 'user' },
        { id: 3, username: 'guest', password: 'guest123', role: 'guest' }
    ];
    
    let usuarioLogado = null;
    
    // Função para hash simples (apenas para demonstração)
    function hashSimples(texto) {
        let hash = 0;
        for (let i = 0; i < texto.length; i++) {
            const char = texto.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converte para 32bit
        }
        return Math.abs(hash).toString(16);
    }
    
    // Function declaration para login
    function login(username, password) {
        const usuario = usuarios.find(u => u.username === username);
        
        if (!usuario) {
            return { sucesso: false, mensagem: 'Usuário não encontrado' };
        }
        
        if (usuario.password !== password) {
            return { sucesso: false, mensagem: 'Senha incorreta' };
        }
        
        usuarioLogado = { ...usuario };
        delete usuarioLogado.password; // Remove senha dos dados em memória
        
        return { 
            sucesso: true, 
            mensagem: 'Login realizado com sucesso',
            usuario: usuarioLogado
        };
    }
    
    // Function expression para logout
    const logout = function() {
        if (!usuarioLogado) {
            return { sucesso: false, mensagem: 'Nenhum usuário logado' };
        }
        
        const nomeUsuario = usuarioLogado.username;
        usuarioLogado = null;
        
        return { 
            sucesso: true, 
            mensagem: `Logout realizado para ${nomeUsuario}`
        };
    };
    
    // Método para verificar permissões
    const verificarPermissao = function(permissaoRequerida) {
        if (!usuarioLogado) {
            return false;
        }
        
        const permissoes = {
            admin: ['read', 'write', 'delete', 'admin'],
            user: ['read', 'write'],
            guest: ['read']
        };
        
        return permissoes[usuarioLogado.role].includes(permissaoRequerida);
    };
    
    // Higher-order function para criar middleware de autorização
    const criarMiddlewareAuth = function(permissaoRequerida) {
        return function(acao) {
            if (!verificarPermissao(permissaoRequerida)) {
                return {
                    sucesso: false,
                    mensagem: `Permissão '${permissaoRequerida}' necessária`
                };
            }
            
            return acao();
        };
    };
    
    // API pública
    return {
        login,
        logout,
        verificarPermissao,
        criarMiddlewareAuth,
        
        obterUsuarioLogado: function() {
            return usuarioLogado ? { ...usuarioLogado } : null;
        },
        
        // Método que usa hash
        gerarTokenSessao: function() {
            if (!usuarioLogado) {
                return null;
            }
            
            const dados = `${usuarioLogado.id}_${usuarioLogado.username}_${Date.now()}`;
            return hashSimples(dados);
        }
    };
})();

// Testando o sistema de autenticação
console.log('\n🔐 Testando sistema de autenticação:');

// Tentativa de login
let resultado = sistemaAuth.login('admin', 'admin123');
console.log('Login admin:', resultado);

// Verificando usuário logado
console.log('Usuário logado:', sistemaAuth.obterUsuarioLogado());

// Gerando token
console.log('Token de sessão:', sistemaAuth.gerarTokenSessao());

// Testando permissões
console.log('Pode ler:', sistemaAuth.verificarPermissao('read'));
console.log('Pode deletar:', sistemaAuth.verificarPermissao('delete'));

// Criando middleware de autorização
const apenasAdmin = sistemaAuth.criarMiddlewareAuth('admin');
const apenasLeitura = sistemaAuth.criarMiddlewareAuth('read');

// Testando middleware
const resultadoAdmin = apenasAdmin(function() {
    return { sucesso: true, dados: 'Dados administrativos' };
});
console.log('Ação admin:', resultadoAdmin);

// Logout
resultado = sistemaAuth.logout();
console.log('Logout:', resultado);

// Tentativa de ação após logout
const resultadoSemAuth = apenasLeitura(function() {
    return { sucesso: true, dados: 'Dados públicos' };
});
console.log('Ação sem auth:', resultadoSemAuth);

// EXERCÍCIO 2: Factory de Funções
console.log('\n--- EXERCÍCIO 2: FACTORY DE FUNÇÕES ---');

// Factory que cria diferentes tipos de funções de processamento
function criarProcessador(tipo) {
    const processadores = {
        texto: function() {
            return {
                maiuscula: function(str) {
                    return str.toUpperCase();
                },
                
                minuscula: function(str) {
                    return str.toLowerCase();
                },
                
                capitalizar: function(str) {
                    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                },
                
                inverter: function(str) {
                    return str.split('').reverse().join('');
                },
                
                limpar: function(str) {
                    return str.trim().replace(/\s+/g, ' ');
                }
            };
        },
        
        numero: function() {
            return {
                absoluto: function(num) {
                    return Math.abs(num);
                },
                
                arredondar: function(num, casas = 0) {
                    return Number(num.toFixed(casas));
                },
                
                porcentagem: function(valor, total) {
                    return (valor / total) * 100;
                },
                
                formatarMoeda: function(valor) {
                    return new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }).format(valor);
                },
                
                estaNoIntervalo: function(valor, min, max) {
                    return valor >= min && valor <= max;
                }
            };
        },
        
        array: function() {
            return {
                removerDuplicatas: function(arr) {
                    return [...new Set(arr)];
                },
                
                embaralhar: function(arr) {
                    const copia = [...arr];
                    for (let i = copia.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [copia[i], copia[j]] = [copia[j], copia[i]];
                    }
                    return copia;
                },
                
                agruparPor: function(arr, propriedade) {
                    return arr.reduce((grupos, item) => {
                        const chave = item[propriedade];
                        if (!grupos[chave]) {
                            grupos[chave] = [];
                        }
                        grupos[chave].push(item);
                        return grupos;
                    }, {});
                },
                
                encontrarMaior: function(arr) {
                    return Math.max(...arr);
                },
                
                calcularMedia: function(arr) {
                    return arr.reduce((sum, num) => sum + num, 0) / arr.length;
                }
            };
        }
    };
    
    if (!processadores[tipo]) {
        throw new Error(`Tipo de processador '${tipo}' não suportado`);
    }
    
    return processadores[tipo]();
}

// Testando a factory de processadores
console.log('\n🏭 Testando factory de processadores:');

// Processador de texto
const procTexto = criarProcessador('texto');
console.log('\nProcessador de texto:');
console.log('Maiúscula:', procTexto.maiuscula('hello world'));
console.log('Capitalizar:', procTexto.capitalizar('javaScript é incrível'));
console.log('Inverter:', procTexto.inverter('JavaScript'));
console.log('Limpar:', procTexto.limpar('  texto   com    espaços  '));

// Processador de números
const procNumero = criarProcessador('numero');
console.log('\nProcessador de números:');
console.log('Absoluto:', procNumero.absoluto(-42));
console.log('Arredondar:', procNumero.arredondar(3.14159, 2));
console.log('Porcentagem:', procNumero.porcentagem(25, 200));
console.log('Moeda:', procNumero.formatarMoeda(1234.56));
console.log('No intervalo:', procNumero.estaNoIntervalo(15, 10, 20));

// Processador de arrays
const procArray = criarProcessador('array');
console.log('\nProcessador de arrays:');
const numeros = [1, 2, 2, 3, 4, 4, 5];
const pessoas = [
    { nome: 'Ana', idade: 25 },
    { nome: 'João', idade: 30 },
    { nome: 'Maria', idade: 25 }
];

console.log('Original:', numeros);
console.log('Sem duplicatas:', procArray.removerDuplicatas(numeros));
console.log('Embaralhado:', procArray.embaralhar(numeros));
console.log('Maior número:', procArray.encontrarMaior(numeros));
console.log('Média:', procArray.calcularMedia(numeros));
console.log('Agrupado por idade:', procArray.agruparPor(pessoas, 'idade'));

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Prefira function declarations para funções principais
console.log('\n--- DICA 1: Function Declarations vs Expressions ---');

// ✅ Bom: Function declaration para funções principais
function calcularImpostos(salario) {
    return salario * 0.15;
}

// ✅ Bom: Function expression para callbacks e funções condicionais
const processarDados = function(dados, callback) {
    return callback(dados);
};

// DICA 2: Use IIFE para evitar poluição do escopo global
console.log('\n--- DICA 2: Evitando Poluição do Escopo ---');

// ❌ Ruim: Variáveis no escopo global
// var contador = 0;
// var incrementar = function() { contador++; };

// ✅ Bom: IIFE para encapsular
const contadorSeguro = (function() {
    let contador = 0;
    
    return {
        incrementar: function() {
            contador++;
        },
        
        obterValor: function() {
            return contador;
        },
        
        resetar: function() {
            contador = 0;
        }
    };
})();

console.log('Contador inicial:', contadorSeguro.obterValor());
contadorSeguro.incrementar();
contadorSeguro.incrementar();
console.log('Após incrementar:', contadorSeguro.obterValor());
contadorSeguro.resetar();
console.log('Após resetar:', contadorSeguro.obterValor());

// DICA 3: Use nomes descritivos para funções
console.log('\n--- DICA 3: Nomes Descritivos ---');

// ❌ Ruim: Nomes genéricos
// function calc(x, y) { return x * y * 0.1; }

// ✅ Bom: Nomes descritivos
function calcularComissaoVendedor(valorVenda, percentualComissao) {
    return valorVenda * (percentualComissao / 100);
}

console.log('Comissão:', calcularComissaoVendedor(1000, 5));

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Functions: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions');
console.log('📚 JavaScript.info - Functions: https://javascript.info/function-basics');
console.log('📚 Hoisting: https://developer.mozilla.org/docs/Glossary/Hoisting');
console.log('📚 IIFE Pattern: https://developer.mozilla.org/docs/Glossary/IIFE');
console.log('📚 First-class Functions: https://developer.mozilla.org/docs/Glossary/First-class_Function');

console.log('\n✅ Módulo 3.1 - Declaração de Funções concluído!');
console.log('📚 Próximo: Parâmetros e Argumentos');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saudar,
        obterDataAtual,
        calcularArea,
        criarMensagem,
        criarMultiplicador,
        criarValidador,
        sistemaAuth,
        criarProcessador,
        calcularImpostos,
        calcularComissaoVendedor
    };
}