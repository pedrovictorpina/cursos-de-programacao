/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 3.3
CLOSURES E ESCOPO
==============================================

Objetivos de Aprendizagem:
- Compreender os diferentes tipos de escopo em JavaScript
- Dominar o conceito de closures (fechamentos)
- Entender lexical scoping e scope chain
- Aplicar closures para criar funções especializadas
- Usar closures para encapsulamento e privacidade
- Evitar vazamentos de memória com closures

⏱️ TEMPO ESTIMADO: 60 minutos
📊 NÍVEL: Intermediário/Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: ESCOPO E CLOSURES
// ==========================================

/*
ESCOPO é o contexto onde variáveis e funções são acessíveis.
Tipos de escopo em JavaScript:
1. Global Scope (Escopo Global)
2. Function Scope (Escopo de Função)
3. Block Scope (Escopo de Bloco) - ES6+
4. Module Scope (Escopo de Módulo)

CLOSURE é quando uma função "lembra" do ambiente lexical onde foi criada,
mesmo quando executada fora desse ambiente.

CONCEITOS IMPORTANTES:
- Lexical Scoping: Escopo determinado onde a função é definida
- Scope Chain: Cadeia de busca por variáveis
- Closure: Função + ambiente lexical onde foi criada
- Garbage Collection: Limpeza automática de memória
- Memory Leaks: Vazamentos de memória com closures
*/

console.log('=== CLOSURES E ESCOPO ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== ESCOPO GLOBAL ==========
console.log('\n--- ESCOPO GLOBAL ---');

// Variáveis no escopo global
var varGlobal = 'Variável global com var';
let letGlobal = 'Variável global com let';
const constGlobal = 'Constante global';

function demonstrarEscopoGlobal() {
    console.log('\n🌍 Acessando variáveis globais:');
    console.log('var global:', varGlobal);
    console.log('let global:', letGlobal);
    console.log('const global:', constGlobal);
    
    // Criando variável global sem declaração (má prática)
    // variavelImplicita = 'Criada sem var/let/const'; // ❌ Evitar!
}

demonstrarEscopoGlobal();

// ========== ESCOPO DE FUNÇÃO ==========
console.log('\n--- ESCOPO DE FUNÇÃO ---');

function demonstrarEscopoFuncao() {
    // Variáveis locais da função
    var varLocal = 'Variável local';
    let letLocal = 'Let local';
    const constLocal = 'Const local';
    
    console.log('\n🏠 Dentro da função:');
    console.log('var local:', varLocal);
    console.log('let local:', letLocal);
    console.log('const local:', constLocal);
    
    // Função aninhada
    function funcaoAninhada() {
        console.log('\n🪆 Função aninhada acessando escopo pai:');
        console.log('Acesso a varLocal:', varLocal);
        console.log('Acesso a letLocal:', letLocal);
        console.log('Acesso a constLocal:', constLocal);
        
        // Variável local da função aninhada
        const localAninhada = 'Variável da função aninhada';
        console.log('Variável local aninhada:', localAninhada);
    }
    
    funcaoAninhada();
    
    // console.log(localAninhada); // ❌ Erro: não acessível aqui
}

demonstrarEscopoFuncao();

// Tentativa de acesso fora da função
// console.log(varLocal); // ❌ Erro: varLocal não está definida

// ========== ESCOPO DE BLOCO (ES6+) ==========
console.log('\n--- ESCOPO DE BLOCO ---');

function demonstrarEscopoBloco() {
    console.log('\n📦 Demonstrando escopo de bloco:');
    
    // var não respeita escopo de bloco
    if (true) {
        var varNoBloco = 'var no bloco';
        let letNoBloco = 'let no bloco';
        const constNoBloco = 'const no bloco';
        
        console.log('Dentro do bloco if:');
        console.log('var:', varNoBloco);
        console.log('let:', letNoBloco);
        console.log('const:', constNoBloco);
    }
    
    console.log('\nFora do bloco if:');
    console.log('var (acessível):', varNoBloco); // ✅ Funciona
    // console.log('let:', letNoBloco); // ❌ Erro: não acessível
    // console.log('const:', constNoBloco); // ❌ Erro: não acessível
    
    // Demonstração com loop
    console.log('\n🔄 Escopo em loops:');
    
    // Problema clássico com var
    console.log('Problema com var:');
    for (var i = 0; i < 3; i++) {
        setTimeout(() => {
            console.log('var i:', i); // Sempre imprime 3
        }, 10);
    }
    
    // Solução com let
    setTimeout(() => {
        console.log('\nSolução com let:');
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                console.log('let j:', j); // Imprime 0, 1, 2
            }, 50);
        }
    }, 100);
}

demonstrarEscopoBloco();

// ========== INTRODUÇÃO A CLOSURES ==========
console.log('\n--- INTRODUÇÃO A CLOSURES ---');

// Exemplo básico de closure
function criarContador() {
    let contador = 0; // Variável privada
    
    // Função interna que "fecha" sobre a variável contador
    return function() {
        contador++;
        return contador;
    };
}

// Criando contadores independentes
const contador1 = criarContador();
const contador2 = criarContador();

console.log('\n🔢 Testando closures com contadores:');
console.log('Contador 1 - primeira chamada:', contador1()); // 1
console.log('Contador 1 - segunda chamada:', contador1());  // 2
console.log('Contador 2 - primeira chamada:', contador2()); // 1
console.log('Contador 1 - terceira chamada:', contador1()); // 3
console.log('Contador 2 - segunda chamada:', contador2());  // 2

// Demonstrando que cada closure mantém seu próprio estado
console.log('\n📊 Cada closure mantém estado independente');

// ========== CLOSURES MAIS COMPLEXOS ==========
console.log('\n--- CLOSURES MAIS COMPLEXOS ---');

// Closure que retorna múltiplas funções
function criarCalculadora(valorInicial = 0) {
    let valor = valorInicial;
    
    return {
        somar: function(x) {
            valor += x;
            return valor;
        },
        
        subtrair: function(x) {
            valor -= x;
            return valor;
        },
        
        multiplicar: function(x) {
            valor *= x;
            return valor;
        },
        
        dividir: function(x) {
            if (x !== 0) {
                valor /= x;
            } else {
                console.log('Erro: Divisão por zero!');
            }
            return valor;
        },
        
        obterValor: function() {
            return valor;
        },
        
        resetar: function(novoValor = 0) {
            valor = novoValor;
            return valor;
        },
        
        // Método para ver o histórico (demonstração avançada)
        criarHistorico: function() {
            const historico = [];
            
            return {
                somar: function(x) {
                    valor += x;
                    historico.push(`+${x} = ${valor}`);
                    return valor;
                },
                
                subtrair: function(x) {
                    valor -= x;
                    historico.push(`-${x} = ${valor}`);
                    return valor;
                },
                
                obterHistorico: function() {
                    return [...historico]; // Retorna cópia
                },
                
                obterValor: function() {
                    return valor;
                }
            };
        }
    };
}

// Testando calculadora com closure
const calc = criarCalculadora(10);

console.log('\n🧮 Testando calculadora com closure:');
console.log('Valor inicial:', calc.obterValor());
console.log('Somar 5:', calc.somar(5));
console.log('Multiplicar por 2:', calc.multiplicar(2));
console.log('Subtrair 3:', calc.subtrair(3));
console.log('Dividir por 2:', calc.dividir(2));
console.log('Valor final:', calc.obterValor());

// Testando calculadora com histórico
const calcComHistorico = calc.criarHistorico();
console.log('\n📝 Calculadora com histórico:');
calcComHistorico.somar(10);
calcComHistorico.subtrair(5);
calcComHistorico.somar(3);
console.log('Histórico:', calcComHistorico.obterHistorico());
console.log('Valor atual:', calcComHistorico.obterValor());

// ========== FACTORY FUNCTIONS COM CLOSURES ==========
console.log('\n--- FACTORY FUNCTIONS COM CLOSURES ---');

// Factory para criar objetos com comportamento privado
function criarPessoa(nome, idadeInicial) {
    let idade = idadeInicial;
    let segredos = [];
    
    // Validação privada
    function validarIdade(novaIdade) {
        return typeof novaIdade === 'number' && novaIdade >= 0 && novaIdade <= 150;
    }
    
    return {
        // Propriedade pública
        nome,
        
        // Métodos públicos
        obterIdade: function() {
            return idade;
        },
        
        envelhecer: function(anos = 1) {
            const novaIdade = idade + anos;
            if (validarIdade(novaIdade)) {
                idade = novaIdade;
                return `${nome} agora tem ${idade} anos`;
            } else {
                return 'Idade inválida';
            }
        },
        
        definirIdade: function(novaIdade) {
            if (validarIdade(novaIdade)) {
                idade = novaIdade;
                return `Idade de ${nome} definida para ${idade} anos`;
            } else {
                return 'Idade inválida';
            }
        },
        
        // Métodos para segredos (demonstração de privacidade)
        contarSegredo: function(segredo) {
            segredos.push({
                segredo,
                data: new Date().toLocaleString('pt-BR')
            });
            return `Segredo guardado! Total: ${segredos.length}`;
        },
        
        quantosSegredos: function() {
            return segredos.length;
        },
        
        // Método que retorna função com closure
        criarApresentacao: function() {
            return function(contexto = 'geral') {
                const apresentacoes = {
                    formal: `Prezados, meu nome é ${nome} e tenho ${idade} anos.`,
                    casual: `Oi! Eu sou ${nome}, tenho ${idade} anos.`,
                    profissional: `Sou ${nome}, ${idade} anos, prazer em conhecê-los.`,
                    geral: `Meu nome é ${nome} e tenho ${idade} anos.`
                };
                
                return apresentacoes[contexto] || apresentacoes.geral;
            };
        }
    };
}

// Testando factory com closures
const pessoa1 = criarPessoa('Maria', 25);
const pessoa2 = criarPessoa('João', 30);

console.log('\n👤 Testando factory de pessoas:');
console.log('Pessoa 1:', pessoa1.nome, '- Idade:', pessoa1.obterIdade());
console.log('Pessoa 2:', pessoa2.nome, '- Idade:', pessoa2.obterIdade());

// Testando métodos
console.log('\n🎂 Envelhecendo pessoas:');
console.log(pessoa1.envelhecer(2));
console.log(pessoa2.envelhecer(1));

// Testando segredos
console.log('\n🤫 Contando segredos:');
console.log(pessoa1.contarSegredo('Gosto de chocolate'));
console.log(pessoa1.contarSegredo('Tenho medo de aranhas'));
console.log('Segredos da Maria:', pessoa1.quantosSegredos());
console.log('Segredos do João:', pessoa2.quantosSegredos());

// Testando apresentações
const apresentarMaria = pessoa1.criarApresentacao();
console.log('\n🎭 Apresentações:');
console.log('Formal:', apresentarMaria('formal'));
console.log('Casual:', apresentarMaria('casual'));
console.log('Profissional:', apresentarMaria('profissional'));

// ========== CLOSURES PARA CONFIGURAÇÃO ==========
console.log('\n--- CLOSURES PARA CONFIGURAÇÃO ---');

// Sistema de configuração usando closures
function criarSistemaConfig() {
    const configuracoes = new Map();
    const observadores = new Map();
    
    // Função privada para notificar observadores
    function notificarObservadores(chave, valorAntigo, valorNovo) {
        if (observadores.has(chave)) {
            observadores.get(chave).forEach(callback => {
                try {
                    callback(valorNovo, valorAntigo, chave);
                } catch (error) {
                    console.error('Erro no observador:', error);
                }
            });
        }
    }
    
    return {
        // Definir configuração
        definir: function(chave, valor) {
            const valorAntigo = configuracoes.get(chave);
            configuracoes.set(chave, valor);
            notificarObservadores(chave, valorAntigo, valor);
            return valor;
        },
        
        // Obter configuração
        obter: function(chave, valorPadrao = null) {
            return configuracoes.has(chave) ? configuracoes.get(chave) : valorPadrao;
        },
        
        // Verificar se existe
        existe: function(chave) {
            return configuracoes.has(chave);
        },
        
        // Remover configuração
        remover: function(chave) {
            const valor = configuracoes.get(chave);
            const removido = configuracoes.delete(chave);
            if (removido) {
                notificarObservadores(chave, valor, undefined);
            }
            return removido;
        },
        
        // Listar todas as chaves
        listarChaves: function() {
            return Array.from(configuracoes.keys());
        },
        
        // Observar mudanças
        observar: function(chave, callback) {
            if (!observadores.has(chave)) {
                observadores.set(chave, []);
            }
            observadores.get(chave).push(callback);
            
            // Retorna função para remover observador
            return function removerObservador() {
                const callbacks = observadores.get(chave);
                if (callbacks) {
                    const index = callbacks.indexOf(callback);
                    if (index > -1) {
                        callbacks.splice(index, 1);
                    }
                }
            };
        },
        
        // Criar namespace (sub-configuração)
        criarNamespace: function(prefixo) {
            return {
                definir: function(chave, valor) {
                    return configuracoes.set(`${prefixo}.${chave}`, valor);
                },
                
                obter: function(chave, valorPadrao = null) {
                    const chaveCompleta = `${prefixo}.${chave}`;
                    return configuracoes.has(chaveCompleta) ? 
                           configuracoes.get(chaveCompleta) : valorPadrao;
                },
                
                listar: function() {
                    const resultado = {};
                    for (const [chave, valor] of configuracoes) {
                        if (chave.startsWith(`${prefixo}.`)) {
                            const chaveLocal = chave.substring(prefixo.length + 1);
                            resultado[chaveLocal] = valor;
                        }
                    }
                    return resultado;
                }
            };
        },
        
        // Exportar todas as configurações
        exportar: function() {
            const resultado = {};
            for (const [chave, valor] of configuracoes) {
                resultado[chave] = valor;
            }
            return resultado;
        },
        
        // Importar configurações
        importar: function(configs) {
            Object.entries(configs).forEach(([chave, valor]) => {
                this.definir(chave, valor);
            });
        }
    };
}

// Testando sistema de configuração
const config = criarSistemaConfig();

console.log('\n⚙️ Testando sistema de configuração:');

// Definindo configurações
config.definir('tema', 'escuro');
config.definir('idioma', 'pt-BR');
config.definir('debug', true);

console.log('Configurações definidas:');
console.log('Tema:', config.obter('tema'));
console.log('Idioma:', config.obter('idioma'));
console.log('Debug:', config.obter('debug'));
console.log('Inexistente:', config.obter('inexistente', 'valor padrão'));

// Observando mudanças
const removerObservador = config.observar('tema', (novoValor, valorAntigo, chave) => {
    console.log(`🔍 Tema alterado de "${valorAntigo}" para "${novoValor}"`);
});

config.definir('tema', 'claro'); // Dispara o observador

// Testando namespace
const configDB = config.criarNamespace('database');
configDB.definir('host', 'localhost');
configDB.definir('porta', 5432);
configDB.definir('nome', 'meuapp');

console.log('\n🗄️ Configurações do banco:');
console.log('Host:', configDB.obter('host'));
console.log('Porta:', configDB.obter('porta'));
console.log('Todas as configs DB:', configDB.listar());

// Exportando configurações
console.log('\n📤 Todas as configurações:', config.exportar());

// ========== CLOSURES PARA CACHE ==========
console.log('\n--- CLOSURES PARA CACHE ---');

// Sistema de cache com TTL usando closures
function criarCache(ttlPadrao = 60000) { // TTL padrão: 1 minuto
    const cache = new Map();
    const timers = new Map();
    
    // Função privada para limpar item expirado
    function limparItem(chave) {
        cache.delete(chave);
        if (timers.has(chave)) {
            clearTimeout(timers.get(chave));
            timers.delete(chave);
        }
    }
    
    // Função privada para configurar expiração
    function configurarExpiracao(chave, ttl) {
        if (timers.has(chave)) {
            clearTimeout(timers.get(chave));
        }
        
        const timer = setTimeout(() => {
            limparItem(chave);
            console.log(`🗑️ Cache expirado para chave: ${chave}`);
        }, ttl);
        
        timers.set(chave, timer);
    }
    
    return {
        // Definir item no cache
        definir: function(chave, valor, ttl = ttlPadrao) {
            const item = {
                valor,
                criadoEm: Date.now(),
                ttl
            };
            
            cache.set(chave, item);
            configurarExpiracao(chave, ttl);
            
            return valor;
        },
        
        // Obter item do cache
        obter: function(chave) {
            if (cache.has(chave)) {
                const item = cache.get(chave);
                return item.valor;
            }
            return null;
        },
        
        // Verificar se existe
        existe: function(chave) {
            return cache.has(chave);
        },
        
        // Remover item
        remover: function(chave) {
            limparItem(chave);
            return true;
        },
        
        // Limpar todo o cache
        limpar: function() {
            // Limpar todos os timers
            for (const timer of timers.values()) {
                clearTimeout(timer);
            }
            
            cache.clear();
            timers.clear();
            
            return true;
        },
        
        // Obter estatísticas
        estatisticas: function() {
            const agora = Date.now();
            const itens = Array.from(cache.entries()).map(([chave, item]) => ({
                chave,
                idade: agora - item.criadoEm,
                ttl: item.ttl
            }));
            
            return {
                totalItens: cache.size,
                itens,
                memoriaAproximada: JSON.stringify(Array.from(cache.entries())).length
            };
        },
        
        // Função para cache com callback (memoização)
        memoizar: function(funcao, gerarChave = (...args) => JSON.stringify(args)) {
            return function(...args) {
                const chave = gerarChave(...args);
                
                // Verificar se já está no cache
                if (cache.has(chave)) {
                    console.log(`📋 Cache hit para: ${chave}`);
                    return cache.get(chave).valor;
                }
                
                // Executar função e cachear resultado
                console.log(`🔄 Cache miss para: ${chave}`);
                const resultado = funcao(...args);
                
                // Cachear apenas se o resultado não for undefined
                if (resultado !== undefined) {
                    cache.set(chave, {
                        valor: resultado,
                        criadoEm: Date.now(),
                        ttl: ttlPadrao
                    });
                    configurarExpiracao(chave, ttlPadrao);
                }
                
                return resultado;
            };
        }
    };
}

// Testando sistema de cache
const cache = criarCache(5000); // TTL de 5 segundos

console.log('\n💾 Testando sistema de cache:');

// Definindo itens
cache.definir('usuario:1', { nome: 'João', email: 'joao@email.com' });
cache.definir('config:tema', 'escuro', 10000); // TTL personalizado

console.log('Usuário 1:', cache.obter('usuario:1'));
console.log('Tema:', cache.obter('config:tema'));
console.log('Inexistente:', cache.obter('inexistente'));

// Testando memoização
function calcularFibonacci(n) {
    if (n <= 1) return n;
    return calcularFibonacci(n - 1) + calcularFibonacci(n - 2);
}

const fibonacciMemoizado = cache.memoizar(calcularFibonacci);

console.log('\n🔢 Testando memoização:');
console.log('Fibonacci(10) - primeira vez:', fibonacciMemoizado(10));
console.log('Fibonacci(10) - segunda vez:', fibonacciMemoizado(10)); // Cache hit
console.log('Fibonacci(15) - primeira vez:', fibonacciMemoizado(15));

// Estatísticas do cache
console.log('\n📊 Estatísticas do cache:', cache.estatisticas());

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Módulos com Closures
console.log('\n--- EXERCÍCIO 1: SISTEMA DE MÓDULOS ---');

// Criando um sistema de módulos usando closures
const SistemaModulos = (function() {
    const modulos = new Map();
    const dependencias = new Map();
    
    // Função privada para resolver dependências
    function resolverDependencias(deps) {
        const modulosResolvidos = {};
        
        for (const dep of deps) {
            if (!modulos.has(dep)) {
                throw new Error(`Módulo '${dep}' não encontrado`);
            }
            modulosResolvidos[dep] = modulos.get(dep);
        }
        
        return modulosResolvidos;
    }
    
    // Função privada para validar dependências circulares
    function validarDependenciasCirculares(nome, deps, visitados = new Set()) {
        if (visitados.has(nome)) {
            throw new Error(`Dependência circular detectada: ${Array.from(visitados).join(' -> ')} -> ${nome}`);
        }
        
        visitados.add(nome);
        
        for (const dep of deps) {
            if (dependencias.has(dep)) {
                validarDependenciasCirculares(dep, dependencias.get(dep), new Set(visitados));
            }
        }
    }
    
    return {
        // Definir módulo
        definir: function(nome, deps = [], factory) {
            // Se deps é uma função, não há dependências
            if (typeof deps === 'function') {
                factory = deps;
                deps = [];
            }
            
            // Validar dependências circulares
            validarDependenciasCirculares(nome, deps);
            
            // Resolver dependências
            const modulosResolvidos = resolverDependencias(deps);
            
            // Executar factory e armazenar módulo
            const modulo = factory(modulosResolvidos);
            modulos.set(nome, modulo);
            dependencias.set(nome, deps);
            
            console.log(`📦 Módulo '${nome}' definido com dependências: [${deps.join(', ')}]`);
            return modulo;
        },
        
        // Obter módulo
        obter: function(nome) {
            if (!modulos.has(nome)) {
                throw new Error(`Módulo '${nome}' não encontrado`);
            }
            return modulos.get(nome);
        },
        
        // Verificar se módulo existe
        existe: function(nome) {
            return modulos.has(nome);
        },
        
        // Listar módulos
        listar: function() {
            return Array.from(modulos.keys());
        },
        
        // Obter informações de dependências
        obterDependencias: function(nome) {
            return dependencias.get(nome) || [];
        },
        
        // Remover módulo
        remover: function(nome) {
            // Verificar se outros módulos dependem deste
            for (const [modulo, deps] of dependencias) {
                if (deps.includes(nome)) {
                    throw new Error(`Não é possível remover '${nome}': módulo '${modulo}' depende dele`);
                }
            }
            
            modulos.delete(nome);
            dependencias.delete(nome);
            console.log(`🗑️ Módulo '${nome}' removido`);
            return true;
        },
        
        // Recarregar módulo
        recarregar: function(nome, factory) {
            if (!modulos.has(nome)) {
                throw new Error(`Módulo '${nome}' não encontrado`);
            }
            
            const deps = dependencias.get(nome);
            const modulosResolvidos = resolverDependencias(deps);
            const novoModulo = factory(modulosResolvidos);
            
            modulos.set(nome, novoModulo);
            console.log(`🔄 Módulo '${nome}' recarregado`);
            return novoModulo;
        }
    };
})();

// Testando sistema de módulos
console.log('\n🧩 Testando sistema de módulos:');

// Definindo módulo utilitário
SistemaModulos.definir('utils', function() {
    return {
        formatarMoeda: function(valor) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        },
        
        formatarData: function(data) {
            return new Date(data).toLocaleDateString('pt-BR');
        },
        
        gerarId: function() {
            return Math.random().toString(36).substr(2, 9);
        }
    };
});

// Definindo módulo de validação
SistemaModulos.definir('validacao', function() {
    return {
        email: function(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        
        cpf: function(cpf) {
            // Validação simplificada
            return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
        },
        
        senha: function(senha) {
            return senha.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        }
    };
});

// Definindo módulo de usuário que depende dos outros
SistemaModulos.definir('usuario', ['utils', 'validacao'], function({ utils, validacao }) {
    const usuarios = [];
    
    return {
        criar: function(dados) {
            // Validações
            if (!validacao.email(dados.email)) {
                throw new Error('Email inválido');
            }
            
            if (!validacao.senha(dados.senha)) {
                throw new Error('Senha inválida');
            }
            
            // Criar usuário
            const usuario = {
                id: utils.gerarId(),
                nome: dados.nome,
                email: dados.email,
                criadoEm: new Date(),
                ativo: true
            };
            
            usuarios.push(usuario);
            console.log(`👤 Usuário criado: ${usuario.nome} (${usuario.id})`);
            return usuario;
        },
        
        listar: function() {
            return usuarios.map(u => ({
                ...u,
                criadoEm: utils.formatarData(u.criadoEm)
            }));
        },
        
        buscarPorEmail: function(email) {
            return usuarios.find(u => u.email === email);
        },
        
        obterEstatisticas: function() {
            return {
                total: usuarios.length,
                ativos: usuarios.filter(u => u.ativo).length,
                inativos: usuarios.filter(u => !u.ativo).length
            };
        }
    };
});

// Testando os módulos
const moduloUsuario = SistemaModulos.obter('usuario');
const moduloUtils = SistemaModulos.obter('utils');

// Criando usuários
try {
    moduloUsuario.criar({
        nome: 'João Silva',
        email: 'joao@email.com',
        senha: 'MinhaSenh@123'
    });
    
    moduloUsuario.criar({
        nome: 'Maria Santos',
        email: 'maria@email.com',
        senha: 'OutraSenh@456'
    });
    
    console.log('\n👥 Usuários criados:');
    console.log(moduloUsuario.listar());
    console.log('\n📊 Estatísticas:', moduloUsuario.obterEstatisticas());
    
} catch (error) {
    console.error('Erro ao criar usuário:', error.message);
}

console.log('\n📋 Módulos disponíveis:', SistemaModulos.listar());

// EXERCÍCIO 2: Sistema de Eventos com Closures
console.log('\n--- EXERCÍCIO 2: SISTEMA DE EVENTOS ---');

// Sistema de eventos usando closures para encapsulamento
function criarSistemaEventos() {
    const eventos = new Map();
    const eventosUmaVez = new Set();
    const historico = [];
    const maxHistorico = 100;
    
    // Função privada para registrar no histórico
    function registrarHistorico(tipo, evento, dados) {
        historico.push({
            tipo,
            evento,
            dados: JSON.parse(JSON.stringify(dados)), // Deep clone
            timestamp: Date.now()
        });
        
        // Manter apenas os últimos registros
        if (historico.length > maxHistorico) {
            historico.shift();
        }
    }
    
    // Função privada para executar listeners
    function executarListeners(evento, dados) {
        if (!eventos.has(evento)) return 0;
        
        const listeners = eventos.get(evento);
        let executados = 0;
        
        // Criar cópia para evitar problemas se listeners forem removidos durante execução
        const listenersParaExecutar = [...listeners];
        
        for (const listener of listenersParaExecutar) {
            try {
                listener(dados, evento);
                executados++;
                
                // Remover listener se for "uma vez"
                if (eventosUmaVez.has(listener)) {
                    listeners.delete(listener);
                    eventosUmaVez.delete(listener);
                }
            } catch (error) {
                console.error(`Erro no listener do evento '${evento}':`, error);
            }
        }
        
        return executados;
    }
    
    return {
        // Adicionar listener
        on: function(evento, listener) {
            if (typeof listener !== 'function') {
                throw new Error('Listener deve ser uma função');
            }
            
            if (!eventos.has(evento)) {
                eventos.set(evento, new Set());
            }
            
            eventos.get(evento).add(listener);
            registrarHistorico('listener_adicionado', evento, { total: eventos.get(evento).size });
            
            // Retornar função para remover listener
            return function remover() {
                if (eventos.has(evento)) {
                    eventos.get(evento).delete(listener);
                    eventosUmaVez.delete(listener);
                    registrarHistorico('listener_removido', evento, { total: eventos.get(evento).size });
                }
            };
        },
        
        // Adicionar listener que executa apenas uma vez
        once: function(evento, listener) {
            if (typeof listener !== 'function') {
                throw new Error('Listener deve ser uma função');
            }
            
            eventosUmaVez.add(listener);
            return this.on(evento, listener);
        },
        
        // Emitir evento
        emit: function(evento, dados = {}) {
            const executados = executarListeners(evento, dados);
            registrarHistorico('evento_emitido', evento, { dados, listeners_executados: executados });
            
            return executados;
        },
        
        // Remover todos os listeners de um evento
        off: function(evento) {
            if (eventos.has(evento)) {
                const listeners = eventos.get(evento);
                
                // Remover da lista de "uma vez"
                for (const listener of listeners) {
                    eventosUmaVez.delete(listener);
                }
                
                eventos.delete(evento);
                registrarHistorico('evento_removido', evento, { listeners_removidos: listeners.size });
                return true;
            }
            return false;
        },
        
        // Listar eventos
        listarEventos: function() {
            const resultado = {};
            for (const [evento, listeners] of eventos) {
                resultado[evento] = listeners.size;
            }
            return resultado;
        },
        
        // Obter histórico
        obterHistorico: function(filtro = null) {
            if (!filtro) {
                return [...historico];
            }
            
            return historico.filter(item => {
                if (filtro.evento && item.evento !== filtro.evento) return false;
                if (filtro.tipo && item.tipo !== filtro.tipo) return false;
                if (filtro.desde && item.timestamp < filtro.desde) return false;
                if (filtro.ate && item.timestamp > filtro.ate) return false;
                return true;
            });
        },
        
        // Limpar histórico
        limparHistorico: function() {
            const total = historico.length;
            historico.length = 0;
            return total;
        },
        
        // Criar namespace de eventos
        criarNamespace: function(prefixo) {
            return {
                on: (evento, listener) => this.on(`${prefixo}:${evento}`, listener),
                once: (evento, listener) => this.once(`${prefixo}:${evento}`, listener),
                emit: (evento, dados) => this.emit(`${prefixo}:${evento}`, dados),
                off: (evento) => this.off(`${prefixo}:${evento}`)
            };
        },
        
        // Estatísticas
        obterEstatisticas: function() {
            const totalEventos = eventos.size;
            const totalListeners = Array.from(eventos.values())
                .reduce((total, listeners) => total + listeners.size, 0);
            const totalUmaVez = eventosUmaVez.size;
            
            return {
                totalEventos,
                totalListeners,
                totalUmaVez,
                totalHistorico: historico.length,
                eventosComMaisListeners: Array.from(eventos.entries())
                    .sort((a, b) => b[1].size - a[1].size)
                    .slice(0, 5)
                    .map(([evento, listeners]) => ({ evento, listeners: listeners.size }))
            };
        }
    };
}

// Testando sistema de eventos
const eventos = criarSistemaEventos();

console.log('\n🎪 Testando sistema de eventos:');

// Adicionando listeners
const removerLogin = eventos.on('usuario:login', (dados) => {
    console.log(`👤 Usuário logado: ${dados.nome}`);
});

eventos.on('usuario:login', (dados) => {
    console.log(`📊 Login registrado às ${new Date().toLocaleTimeString()}`);
});

// Listener que executa apenas uma vez
eventos.once('sistema:inicializado', (dados) => {
    console.log(`🚀 Sistema inicializado: ${dados.versao}`);
});

// Emitindo eventos
eventos.emit('usuario:login', { nome: 'João', id: 1 });
eventos.emit('usuario:login', { nome: 'Maria', id: 2 });
eventos.emit('sistema:inicializado', { versao: '1.0.0' });
eventos.emit('sistema:inicializado', { versao: '1.0.1' }); // Listener "once" não executa

// Testando namespace
const eventosAdmin = eventos.criarNamespace('admin');
eventosAdmin.on('acao', (dados) => {
    console.log(`🔧 Ação administrativa: ${dados.acao}`);
});

eventosAdmin.emit('acao', { acao: 'backup_criado' });

// Estatísticas e histórico
console.log('\n📊 Estatísticas dos eventos:', eventos.obterEstatisticas());
console.log('\n📋 Histórico recente:', eventos.obterHistorico().slice(-5));

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Evite vazamentos de memória com closures
console.log('\n--- DICA 1: Evitando Vazamentos de Memória ---');

// ❌ Problemático: closure mantém referência desnecessária
function criarFuncaoProblematica() {
    const dadosGrandes = new Array(1000000).fill('dados'); // Array grande
    const outrosDados = { info: 'importante' };
    
    // Esta função mantém referência a TODOS os dados do escopo
    return function() {
        return outrosDados.info; // Só usa outrosDados, mas mantém dadosGrandes na memória
    };
}

// ✅ Melhor: extrair apenas o que é necessário
function criarFuncaoOtimizada() {
    const dadosGrandes = new Array(1000000).fill('dados');
    const outrosDados = { info: 'importante' };
    
    // Extrair apenas o que é necessário
    const infoNecessaria = outrosDados.info;
    
    // Agora a função só mantém referência ao que realmente precisa
    return function() {
        return infoNecessaria;
    };
}

console.log('✅ Função otimizada criada (evita vazamento de memória)');

// DICA 2: Use WeakMap para associações privadas
console.log('\n--- DICA 2: WeakMap para Dados Privados ---');

// Usando WeakMap para dados privados (evita vazamentos)
const dadosPrivados = new WeakMap();

function criarObjetoComPrivacidade(nome, idade) {
    const obj = {
        obterNome: function() {
            return dadosPrivados.get(this).nome;
        },
        
        obterIdade: function() {
            return dadosPrivados.get(this).idade;
        },
        
        definirIdade: function(novaIdade) {
            if (novaIdade >= 0 && novaIdade <= 150) {
                dadosPrivados.get(this).idade = novaIdade;
                return true;
            }
            return false;
        }
    };
    
    // Armazenar dados privados
    dadosPrivados.set(obj, { nome, idade });
    
    return obj;
}

const pessoa = criarObjetoComPrivacidade('Ana', 30);
console.log('Nome:', pessoa.obterNome());
console.log('Idade:', pessoa.obterIdade());
console.log('Alterar idade:', pessoa.definirIdade(31));
console.log('Nova idade:', pessoa.obterIdade());

// DICA 3: Use closures para configuração imutável
console.log('\n--- DICA 3: Configuração Imutável ---');

function criarConfigImutavel(configInicial) {
    // Fazer deep freeze da configuração
    const config = Object.freeze(JSON.parse(JSON.stringify(configInicial)));
    
    return {
        obter: function(chave) {
            return chave.split('.').reduce((obj, key) => obj?.[key], config);
        },
        
        obterToda: function() {
            return JSON.parse(JSON.stringify(config)); // Retorna cópia
        },
        
        // Criar nova configuração (imutável)
        atualizar: function(novasConfigs) {
            const novaConfig = { ...config, ...novasConfigs };
            return criarConfigImutavel(novaConfig);
        }
    };
}

const configOriginal = criarConfigImutavel({
    api: { url: 'https://api.exemplo.com', timeout: 5000 },
    debug: true
});

const configAtualizada = configOriginal.atualizar({
    debug: false,
    api: { ...configOriginal.obter('api'), timeout: 10000 }
});

console.log('Config original - debug:', configOriginal.obter('debug'));
console.log('Config atualizada - debug:', configAtualizada.obter('debug'));
console.log('Config original - timeout:', configOriginal.obter('api.timeout'));
console.log('Config atualizada - timeout:', configAtualizada.obter('api.timeout'));

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Closures: https://developer.mozilla.org/docs/Web/JavaScript/Closures');
console.log('📚 MDN - Scope: https://developer.mozilla.org/docs/Glossary/Scope');
console.log('📚 JavaScript.info - Closure: https://javascript.info/closure');
console.log('📚 You Don\'t Know JS - Scope & Closures: https://github.com/getify/You-Dont-Know-JS');
console.log('📚 Memory Management: https://developer.mozilla.org/docs/Web/JavaScript/Memory_Management');

console.log('\n✅ Módulo 3.3 - Closures e Escopo concluído!');
console.log('📚 Próximo: Arrow Functions');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        criarContador,
        criarCalculadora,
        criarPessoa,
        criarSistemaConfig,
        criarCache,
        SistemaModulos,
        criarSistemaEventos,
        criarObjetoComPrivacidade,
        criarConfigImutavel
    };
}