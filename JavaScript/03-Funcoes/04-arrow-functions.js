/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 3.4
ARROW FUNCTIONS (FUNÇÕES SETA)
==============================================

Objetivos de Aprendizagem:
- Compreender a sintaxe das arrow functions
- Entender as diferenças entre arrow functions e funções tradicionais
- Dominar o comportamento do 'this' em arrow functions
- Aplicar arrow functions em diferentes contextos
- Usar arrow functions com métodos de array
- Conhecer limitações e quando não usar arrow functions

⏱️ TEMPO ESTIMADO: 45 minutos
📊 NÍVEL: Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: ARROW FUNCTIONS
// ==========================================

/*
ARROW FUNCTIONS (ES6+) são uma forma mais concisa de escrever funções.

SINTAXE BÁSICA:
- Sem parâmetros: () => { ... }
- Um parâmetro: param => { ... }
- Múltiplos parâmetros: (param1, param2) => { ... }
- Retorno implícito: param => valor
- Retorno explícito: param => { return valor; }

DIFERENÇAS PRINCIPAIS:
1. Não têm seu próprio 'this' (lexical this)
2. Não podem ser usadas como construtores
3. Não têm objeto 'arguments'
4. Não podem ser usadas como generators
5. Sintaxe mais concisa
6. Sempre são anônimas

QUANDO USAR:
✅ Callbacks e funções de alta ordem
✅ Métodos de array (map, filter, reduce)
✅ Funções simples e curtas
✅ Quando você quer preservar o 'this' do contexto pai

QUANDO NÃO USAR:
❌ Métodos de objeto (quando precisa do 'this' do objeto)
❌ Funções que precisam de hoisting
❌ Construtores
❌ Quando precisa do objeto 'arguments'
*/

console.log('=== ARROW FUNCTIONS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== SINTAXE BÁSICA ==========
console.log('\n--- SINTAXE BÁSICA ---');

// Função tradicional vs Arrow function
console.log('\n🔄 Comparando sintaxes:');

// Função tradicional
function somar(a, b) {
    return a + b;
}

// Arrow function equivalente
const somarArrow = (a, b) => a + b;

console.log('Função tradicional:', somar(5, 3));
console.log('Arrow function:', somarArrow(5, 3));

// Diferentes formas de arrow functions
console.log('\n📝 Diferentes sintaxes de arrow functions:');

// Sem parâmetros
const obterDataAtual = () => new Date().toLocaleDateString('pt-BR');
console.log('Data atual:', obterDataAtual());

// Um parâmetro (parênteses opcionais)
const dobrar = x => x * 2;
const dobrarComParenteses = (x) => x * 2;
console.log('Dobrar 5:', dobrar(5));
console.log('Dobrar com parênteses:', dobrarComParenteses(5));

// Múltiplos parâmetros
const calcularArea = (largura, altura) => largura * altura;
console.log('Área (10x5):', calcularArea(10, 5));

// Retorno implícito (uma linha)
const quadrado = x => x * x;
console.log('Quadrado de 4:', quadrado(4));

// Retorno explícito (bloco de código)
const calcularDesconto = (preco, desconto) => {
    const valorDesconto = preco * (desconto / 100);
    const precoFinal = preco - valorDesconto;
    return {
        precoOriginal: preco,
        desconto: desconto,
        valorDesconto: valorDesconto,
        precoFinal: precoFinal
    };
};

console.log('Desconto 20% em R$ 100:', calcularDesconto(100, 20));

// Retornando objeto literal (precisa de parênteses)
const criarPessoa = (nome, idade) => ({ nome, idade, ativo: true });
console.log('Pessoa criada:', criarPessoa('João', 30));

// ========== COMPORTAMENTO DO 'THIS' ==========
console.log('\n--- COMPORTAMENTO DO THIS ---');

// Demonstrando diferença no comportamento do 'this'
console.log('\n🎯 Diferenças no comportamento do this:');

// Objeto com métodos tradicionais e arrow functions
const exemploThis = {
    nome: 'Objeto Exemplo',
    valor: 42,
    
    // Método tradicional - 'this' aponta para o objeto
    metodoTradicional: function() {
        console.log('Método tradicional - this.nome:', this.nome);
        console.log('Método tradicional - this.valor:', this.valor);
        
        // Função aninhada tradicional - 'this' se perde
        function funcaoAninhada() {
            console.log('Função aninhada tradicional - this.nome:', this.nome); // undefined
        }
        funcaoAninhada();
        
        // Arrow function aninhada - 'this' é preservado
        const arrowAninhada = () => {
            console.log('Arrow aninhada - this.nome:', this.nome);
            console.log('Arrow aninhada - this.valor:', this.valor);
        };
        arrowAninhada();
    },
    
    // Arrow function como método - 'this' NÃO aponta para o objeto
    metodoArrow: () => {
        console.log('Método arrow - this.nome:', this.nome); // undefined
        console.log('Método arrow - this:', this); // Window/global
    },
    
    // Método que retorna arrow function
    criarContador: function() {
        let contador = 0;
        
        // Arrow function preserva o 'this' do método pai
        return () => {
            contador++;
            console.log(`${this.nome} - Contador: ${contador}`);
            return contador;
        };
    }
};

console.log('\n🔍 Testando comportamento do this:');
exemploThis.metodoTradicional();
console.log('\n❌ Arrow function como método:');
exemploThis.metodoArrow();

console.log('\n✅ Arrow function preservando this:');
const contador = exemploThis.criarContador();
contador();
contador();
contador();

// Exemplo prático: Event handlers
console.log('\n🖱️ Simulando event handlers:');

class ComponenteUI {
    constructor(nome) {
        this.nome = nome;
        this.cliques = 0;
    }
    
    // Método tradicional para event handler
    handleClickTradicional() {
        this.cliques++;
        console.log(`${this.nome} - Cliques (tradicional): ${this.cliques}`);
    }
    
    // Arrow function para event handler (preserva this)
    handleClickArrow = () => {
        this.cliques++;
        console.log(`${this.nome} - Cliques (arrow): ${this.cliques}`);
    }
    
    // Método que simula addEventListener
    simularEventListener() {
        // Simulando comportamento do addEventListener
        const simularClick = (handler) => {
            // No navegador, 'this' seria o elemento DOM
            handler.call({ tagName: 'BUTTON' });
        };
        
        console.log('\n🔄 Simulando clicks:');
        
        // Com método tradicional, 'this' se perde
        try {
            simularClick(this.handleClickTradicional);
        } catch (error) {
            console.log('❌ Erro com método tradicional:', error.message);
        }
        
        // Com arrow function, 'this' é preservado
        simularClick(this.handleClickArrow);
        
        // Solução com bind para método tradicional
        simularClick(this.handleClickTradicional.bind(this));
    }
}

const componente = new ComponenteUI('MeuComponente');
componente.simularEventListener();

// ========== ARROW FUNCTIONS COM ARRAYS ==========
console.log('\n--- ARROW FUNCTIONS COM ARRAYS ---');

// Arrow functions são ideais para métodos de array
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log('\n🔢 Usando arrow functions com métodos de array:');
console.log('Array original:', numeros);

// map - transformar elementos
const quadrados = numeros.map(n => n * n);
console.log('Quadrados:', quadrados);

// filter - filtrar elementos
const pares = numeros.filter(n => n % 2 === 0);
console.log('Números pares:', pares);

// reduce - reduzir a um valor
const soma = numeros.reduce((acc, n) => acc + n, 0);
console.log('Soma total:', soma);

// Combinando métodos
const resultado = numeros
    .filter(n => n > 5)           // Números maiores que 5
    .map(n => n * 2)              // Dobrar cada número
    .reduce((acc, n) => acc + n, 0); // Somar tudo

console.log('Resultado combinado:', resultado);

// Exemplo mais complexo: processamento de dados
const produtos = [
    { nome: 'Notebook', preco: 2500, categoria: 'eletrônicos', estoque: 10 },
    { nome: 'Mouse', preco: 50, categoria: 'eletrônicos', estoque: 25 },
    { nome: 'Livro JS', preco: 80, categoria: 'livros', estoque: 15 },
    { nome: 'Cadeira', preco: 300, categoria: 'móveis', estoque: 5 },
    { nome: 'Monitor', preco: 800, categoria: 'eletrônicos', estoque: 8 }
];

console.log('\n🛍️ Processamento de produtos:');

// Produtos eletrônicos com desconto
const eletronicosComDesconto = produtos
    .filter(p => p.categoria === 'eletrônicos')
    .map(p => ({
        ...p,
        precoComDesconto: p.preco * 0.9,
        desconto: '10%'
    }));

console.log('Eletrônicos com desconto:', eletronicosComDesconto);

// Valor total do estoque
const valorTotalEstoque = produtos
    .reduce((total, p) => total + (p.preco * p.estoque), 0);

console.log('Valor total do estoque: R$', valorTotalEstoque);

// Produtos por categoria
const produtosPorCategoria = produtos
    .reduce((acc, produto) => {
        const categoria = produto.categoria;
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(produto);
        return acc;
    }, {});

console.log('Produtos por categoria:', produtosPorCategoria);

// ========== ARROW FUNCTIONS AVANÇADAS ==========
console.log('\n--- ARROW FUNCTIONS AVANÇADAS ---');

// Currying com arrow functions
console.log('\n🍛 Currying com arrow functions:');

const somar3Numeros = a => b => c => a + b + c;
const somarCom5 = somar3Numeros(5);
const somarCom5E3 = somarCom5(3);

console.log('Currying - somar 5 + 3 + 2:', somarCom5E3(2));
console.log('Currying - direto:', somar3Numeros(1)(2)(3));

// Função de alta ordem para validação
const criarValidador = regra => valor => regra(valor);

const validarEmail = criarValidador(email => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
);

const validarIdade = criarValidador(idade => 
    typeof idade === 'number' && idade >= 0 && idade <= 150
);

const validarSenha = criarValidador(senha => 
    senha.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(senha)
);

console.log('\n✅ Validações:');
console.log('Email válido:', validarEmail('user@email.com'));
console.log('Email inválido:', validarEmail('email-inválido'));
console.log('Idade válida:', validarIdade(25));
console.log('Idade inválida:', validarIdade(-5));
console.log('Senha válida:', validarSenha('MinhaSenh@123'));
console.log('Senha inválida:', validarSenha('123'));

// Pipeline de transformações
const pipeline = (...funcoes) => valor => 
    funcoes.reduce((acc, fn) => fn(acc), valor);

const processarTexto = pipeline(
    texto => texto.trim(),
    texto => texto.toLowerCase(),
    texto => texto.replace(/\s+/g, '-'),
    texto => texto.replace(/[^a-z0-9-]/g, '')
);

console.log('\n🔄 Pipeline de transformações:');
console.log('Texto original: "  Meu Título Especial!  "');
console.log('Texto processado:', processarTexto('  Meu Título Especial!  '));

// Memoização com arrow functions
const memoizar = fn => {
    const cache = new Map();
    return (...args) => {
        const chave = JSON.stringify(args);
        if (cache.has(chave)) {
            console.log('📋 Cache hit para:', chave);
            return cache.get(chave);
        }
        console.log('🔄 Calculando para:', chave);
        const resultado = fn(...args);
        cache.set(chave, resultado);
        return resultado;
    };
};

const fibonacciMemoizado = memoizar(n => {
    if (n <= 1) return n;
    return fibonacciMemoizado(n - 1) + fibonacciMemoizado(n - 2);
});

console.log('\n🔢 Fibonacci memoizado:');
console.log('Fibonacci(10):', fibonacciMemoizado(10));
console.log('Fibonacci(10) novamente:', fibonacciMemoizado(10)); // Cache hit

// ========== LIMITAÇÕES E CUIDADOS ==========
console.log('\n--- LIMITAÇÕES E CUIDADOS ---');

console.log('\n⚠️ Limitações das arrow functions:');

// 1. Não podem ser construtores
try {
    const MinhaClasse = () => {};
    // new MinhaClasse(); // ❌ Erro: MinhaClasse is not a constructor
    console.log('❌ Arrow functions não podem ser construtores');
} catch (error) {
    console.log('Erro esperado:', error.message);
}

// 2. Não têm objeto 'arguments'
function funcaoTradicionalComArguments() {
    console.log('✅ Função tradicional - arguments:', Array.from(arguments));
}

const arrowSemArguments = (...args) => {
    console.log('✅ Arrow function - rest parameters:', args);
    // console.log(arguments); // ❌ Erro: arguments is not defined
};

console.log('\n📝 Testando arguments vs rest parameters:');
funcaoTradicionalComArguments(1, 2, 3);
arrowSemArguments(1, 2, 3);

// 3. Não podem ser generators
// const arrowGenerator = () => { yield 1; }; // ❌ Erro de sintaxe

// 4. Cuidado com métodos de objeto
const objetoProblematico = {
    nome: 'Teste',
    
    // ❌ Problemático: arrow function como método
    metodoArrow: () => {
        // 'this' não aponta para o objeto
        console.log('❌ Arrow como método - this.nome:', this.nome);
    },
    
    // ✅ Correto: função tradicional como método
    metodoTradicional: function() {
        console.log('✅ Método tradicional - this.nome:', this.nome);
        
        // ✅ Arrow function dentro do método preserva 'this'
        const arrowInterna = () => {
            console.log('✅ Arrow interna - this.nome:', this.nome);
        };
        arrowInterna();
    }
};

console.log('\n🔍 Testando métodos:');
objetoProblematico.metodoArrow();
objetoProblematico.metodoTradicional();

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Transformação de Dados
console.log('\n--- EXERCÍCIO 1: TRANSFORMAÇÃO DE DADOS ---');

// Dados de vendas para processar
const vendas = [
    { id: 1, produto: 'Notebook', valor: 2500, data: '2024-01-15', vendedor: 'João' },
    { id: 2, produto: 'Mouse', valor: 50, data: '2024-01-16', vendedor: 'Maria' },
    { id: 3, produto: 'Teclado', valor: 120, data: '2024-01-16', vendedor: 'João' },
    { id: 4, produto: 'Monitor', valor: 800, data: '2024-01-17', vendedor: 'Ana' },
    { id: 5, produto: 'Webcam', valor: 200, data: '2024-01-17', vendedor: 'Maria' },
    { id: 6, produto: 'Headset', valor: 150, data: '2024-01-18', vendedor: 'João' }
];

// Sistema de transformação usando arrow functions
const SistemaVendas = {
    // Filtrar vendas por vendedor
    porVendedor: vendedor => vendas.filter(v => v.vendedor === vendedor),
    
    // Vendas acima de um valor
    acimaDeValor: valor => vendas.filter(v => v.valor > valor),
    
    // Total de vendas por vendedor
    totalPorVendedor: () => vendas.reduce((acc, venda) => {
        acc[venda.vendedor] = (acc[venda.vendedor] || 0) + venda.valor;
        return acc;
    }, {}),
    
    // Vendas por dia
    vendasPorDia: () => vendas.reduce((acc, venda) => {
        const data = venda.data;
        if (!acc[data]) {
            acc[data] = { vendas: [], total: 0, quantidade: 0 };
        }
        acc[data].vendas.push(venda);
        acc[data].total += venda.valor;
        acc[data].quantidade++;
        return acc;
    }, {}),
    
    // Top produtos (mais vendidos por valor)
    topProdutos: (limite = 3) => vendas
        .reduce((acc, venda) => {
            const produto = venda.produto;
            if (!acc[produto]) {
                acc[produto] = { total: 0, quantidade: 0 };
            }
            acc[produto].total += venda.valor;
            acc[produto].quantidade++;
            return acc;
        }, {})
        |> (produtos => Object.entries(produtos)
            .map(([nome, dados]) => ({ nome, ...dados }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limite)
        ),
    
    // Relatório completo
    relatorioCompleto: () => {
        const totalGeral = vendas.reduce((total, v) => total + v.valor, 0);
        const totalVendas = vendas.length;
        const ticketMedio = totalGeral / totalVendas;
        
        return {
            totalGeral,
            totalVendas,
            ticketMedio: Math.round(ticketMedio * 100) / 100,
            porVendedor: SistemaVendas.totalPorVendedor(),
            porDia: SistemaVendas.vendasPorDia()
        };
    },
    
    // Função de busca avançada
    buscar: filtros => vendas.filter(venda => {
        return Object.entries(filtros).every(([campo, valor]) => {
            if (campo === 'valorMin') return venda.valor >= valor;
            if (campo === 'valorMax') return venda.valor <= valor;
            if (campo === 'dataInicio') return venda.data >= valor;
            if (campo === 'dataFim') return venda.data <= valor;
            return venda[campo] === valor;
        });
    })
};

// Testando o sistema
console.log('\n💰 Relatório de Vendas:');
console.log('Vendas do João:', SistemaVendas.porVendedor('João'));
console.log('Vendas acima de R$ 200:', SistemaVendas.acimaDeValor(200));
console.log('Total por vendedor:', SistemaVendas.totalPorVendedor());
console.log('Relatório completo:', SistemaVendas.relatorioCompleto());

// Busca avançada
const vendasFiltradas = SistemaVendas.buscar({
    vendedor: 'João',
    valorMin: 100
});
console.log('Vendas do João acima de R$ 100:', vendasFiltradas);

// EXERCÍCIO 2: Sistema de Validação Funcional
console.log('\n--- EXERCÍCIO 2: VALIDAÇÃO FUNCIONAL ---');

// Sistema de validação usando composição de funções
const Validacao = {
    // Validadores básicos
    obrigatorio: campo => valor => {
        const valido = valor !== null && valor !== undefined && valor !== '';
        return {
            valido,
            erro: valido ? null : `${campo} é obrigatório`
        };
    },
    
    tamanhoMinimo: (campo, min) => valor => {
        const valido = valor && valor.length >= min;
        return {
            valido,
            erro: valido ? null : `${campo} deve ter pelo menos ${min} caracteres`
        };
    },
    
    tamanhoMaximo: (campo, max) => valor => {
        const valido = !valor || valor.length <= max;
        return {
            valido,
            erro: valido ? null : `${campo} deve ter no máximo ${max} caracteres`
        };
    },
    
    email: campo => valor => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valido = !valor || regex.test(valor);
        return {
            valido,
            erro: valido ? null : `${campo} deve ser um email válido`
        };
    },
    
    numero: campo => valor => {
        const valido = !valor || !isNaN(Number(valor));
        return {
            valido,
            erro: valido ? null : `${campo} deve ser um número`
        };
    },
    
    intervalo: (campo, min, max) => valor => {
        const num = Number(valor);
        const valido = !valor || (num >= min && num <= max);
        return {
            valido,
            erro: valido ? null : `${campo} deve estar entre ${min} e ${max}`
        };
    },
    
    // Combinar validadores
    combinar: (...validadores) => valor => {
        for (const validador of validadores) {
            const resultado = validador(valor);
            if (!resultado.valido) {
                return resultado;
            }
        }
        return { valido: true, erro: null };
    },
    
    // Validar objeto completo
    validarObjeto: esquema => objeto => {
        const erros = {};
        let valido = true;
        
        Object.entries(esquema).forEach(([campo, validador]) => {
            const valor = objeto[campo];
            const resultado = validador(valor);
            
            if (!resultado.valido) {
                erros[campo] = resultado.erro;
                valido = false;
            }
        });
        
        return { valido, erros };
    }
};

// Esquema de validação para usuário
const esquemaUsuario = {
    nome: Validacao.combinar(
        Validacao.obrigatorio('Nome'),
        Validacao.tamanhoMinimo('Nome', 2),
        Validacao.tamanhoMaximo('Nome', 50)
    ),
    
    email: Validacao.combinar(
        Validacao.obrigatorio('Email'),
        Validacao.email('Email')
    ),
    
    idade: Validacao.combinar(
        Validacao.obrigatorio('Idade'),
        Validacao.numero('Idade'),
        Validacao.intervalo('Idade', 0, 150)
    ),
    
    senha: Validacao.combinar(
        Validacao.obrigatorio('Senha'),
        Validacao.tamanhoMinimo('Senha', 8)
    )
};

const validarUsuario = Validacao.validarObjeto(esquemaUsuario);

// Testando validação
console.log('\n✅ Sistema de Validação:');

// Usuário válido
const usuarioValido = {
    nome: 'João Silva',
    email: 'joao@email.com',
    idade: '30',
    senha: 'minhasenha123'
};

const resultadoValido = validarUsuario(usuarioValido);
console.log('Usuário válido:', resultadoValido);

// Usuário inválido
const usuarioInvalido = {
    nome: 'A',
    email: 'email-inválido',
    idade: '200',
    senha: '123'
};

const resultadoInvalido = validarUsuario(usuarioInvalido);
console.log('Usuário inválido:', resultadoInvalido);

// Sistema de validação em tempo real
const criarValidadorTempoReal = esquema => {
    const estado = { dados: {}, erros: {}, valido: false };
    const observadores = [];
    
    const notificarObservadores = () => {
        observadores.forEach(callback => callback(estado));
    };
    
    return {
        // Atualizar campo
        atualizarCampo: (campo, valor) => {
            estado.dados[campo] = valor;
            
            // Validar campo específico
            if (esquema[campo]) {
                const resultado = esquema[campo](valor);
                if (resultado.valido) {
                    delete estado.erros[campo];
                } else {
                    estado.erros[campo] = resultado.erro;
                }
            }
            
            // Verificar se formulário está válido
            estado.valido = Object.keys(estado.erros).length === 0;
            
            notificarObservadores();
        },
        
        // Validar tudo
        validarTudo: () => {
            const resultado = validarUsuario(estado.dados);
            estado.erros = resultado.erros;
            estado.valido = resultado.valido;
            notificarObservadores();
            return resultado;
        },
        
        // Observar mudanças
        observar: callback => {
            observadores.push(callback);
            return () => {
                const index = observadores.indexOf(callback);
                if (index > -1) observadores.splice(index, 1);
            };
        },
        
        // Obter estado atual
        obterEstado: () => ({ ...estado })
    };
};

// Testando validação em tempo real
const validadorTempoReal = criarValidadorTempoReal(esquemaUsuario);

// Observar mudanças
const removerObservador = validadorTempoReal.observar(estado => {
    console.log('📊 Estado atualizado:', {
        valido: estado.valido,
        erros: Object.keys(estado.erros).length
    });
});

console.log('\n⏱️ Validação em tempo real:');
validadorTempoReal.atualizarCampo('nome', 'J');
validadorTempoReal.atualizarCampo('nome', 'João Silva');
validadorTempoReal.atualizarCampo('email', 'joao@email.com');
validadorTempoReal.atualizarCampo('idade', '30');
validadorTempoReal.atualizarCampo('senha', 'minhasenha123');

console.log('Estado final:', validadorTempoReal.obterEstado());

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Use arrow functions para callbacks simples
console.log('\n--- DICA 1: Callbacks Simples ---');

const numeros2 = [1, 2, 3, 4, 5];

// ✅ Bom: arrow functions para transformações simples
const resultados = numeros2
    .map(n => n * 2)
    .filter(n => n > 5)
    .reduce((sum, n) => sum + n, 0);

console.log('✅ Pipeline otimizado:', resultados);

// DICA 2: Evite arrow functions desnecessariamente complexas
console.log('\n--- DICA 2: Complexidade Adequada ---');

// ❌ Problemático: arrow function muito complexa
const processarDadosComplexo = dados => {
    // Muita lógica complexa aqui...
    const resultado = dados
        .filter(item => item.ativo)
        .map(item => {
            // Lógica complexa de transformação
            const novoItem = { ...item };
            if (item.tipo === 'premium') {
                novoItem.desconto = 0.2;
            } else if (item.tipo === 'regular') {
                novoItem.desconto = 0.1;
            }
            novoItem.precoFinal = item.preco * (1 - novoItem.desconto);
            return novoItem;
        })
        .sort((a, b) => b.precoFinal - a.precoFinal);
    
    return resultado;
};

// ✅ Melhor: quebrar em funções menores
const aplicarDesconto = item => {
    const desconto = item.tipo === 'premium' ? 0.2 : 
                    item.tipo === 'regular' ? 0.1 : 0;
    return {
        ...item,
        desconto,
        precoFinal: item.preco * (1 - desconto)
    };
};

const ordenarPorPreco = (a, b) => b.precoFinal - a.precoFinal;

const processarDadosOtimizado = dados => dados
    .filter(item => item.ativo)
    .map(aplicarDesconto)
    .sort(ordenarPorPreco);

console.log('✅ Funções quebradas em partes menores');

// DICA 3: Use destructuring com arrow functions
console.log('\n--- DICA 3: Destructuring ---');

const usuarios = [
    { id: 1, nome: 'João', email: 'joao@email.com', ativo: true },
    { id: 2, nome: 'Maria', email: 'maria@email.com', ativo: false },
    { id: 3, nome: 'Pedro', email: 'pedro@email.com', ativo: true }
];

// ✅ Com destructuring
const usuariosAtivos = usuarios
    .filter(({ ativo }) => ativo)
    .map(({ nome, email }) => ({ nome, email }));

console.log('✅ Usuários ativos (com destructuring):', usuariosAtivos);

// DICA 4: Cuidado com performance em loops grandes
console.log('\n--- DICA 4: Performance ---');

// Para arrays muito grandes, considere usar for loops tradicionais
const arrayGrande = Array.from({ length: 1000000 }, (_, i) => i);

// Medindo performance
const medirTempo = (nome, fn) => {
    const inicio = performance.now();
    const resultado = fn();
    const fim = performance.now();
    console.log(`${nome}: ${(fim - inicio).toFixed(2)}ms`);
    return resultado;
};

// Arrow function com map
medirTempo('Arrow function (map)', () => {
    return arrayGrande.map(n => n * 2).reduce((sum, n) => sum + n, 0);
});

// For loop tradicional
medirTempo('For loop tradicional', () => {
    let soma = 0;
    for (let i = 0; i < arrayGrande.length; i++) {
        soma += arrayGrande[i] * 2;
    }
    return soma;
});

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Arrow Functions: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions');
console.log('📚 ES6 Features: https://github.com/lukehoban/es6features#arrows');
console.log('📚 JavaScript.info - Arrow Functions: https://javascript.info/arrow-functions-basics');
console.log('📚 When NOT to use Arrow Functions: https://wesbos.com/arrow-function-no-no');
console.log('📚 Functional Programming in JS: https://mostly-adequate.gitbooks.io/mostly-adequate-guide/');

console.log('\n✅ Módulo 3.4 - Arrow Functions concluído!');
console.log('📚 Próximo: Módulo 4 - Objetos');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SistemaVendas,
        Validacao,
        criarValidadorTempoReal,
        processarDadosOtimizado,
        aplicarDesconto,
        ordenarPorPreco,
        medirTempo
    };
}