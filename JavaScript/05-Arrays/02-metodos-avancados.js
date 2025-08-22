/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 5.2
MÉTODOS AVANÇADOS DE ARRAYS
==============================================

Objetivos de Aprendizagem:
- Dominar métodos funcionais (map, filter, reduce)
- Usar find, findIndex, some e every
- Aplicar forEach e suas variações
- Implementar flatMap e flat
- Trabalhar com reduceRight e entries
- Combinar métodos para soluções complexas
- Entender programação funcional
- Otimizar performance com métodos apropriados

⏱️ TEMPO ESTIMADO: 90 minutos
📊 NÍVEL: Intermediário a Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: MÉTODOS FUNCIONAIS
// ==========================================

/*
MÉTODOS FUNCIONAIS DE ARRAYS:
Os métodos funcionais permitem transformar, filtrar e processar arrays
de forma declarativa, seguindo princípios da programação funcional.

CARACTERÍSTICAS DOS MÉTODOS FUNCIONAIS:
1. Imutabilidade - não modificam o array original
2. Composição - podem ser encadeados
3. Declarativo - focam no "o que" fazer, não "como"
4. Reutilização - funções podem ser reutilizadas
5. Testabilidade - mais fáceis de testar

PRINCIPAIS MÉTODOS FUNCIONAIS:

TRANSFORMAÇÃO:
- map() - transforma cada elemento
- flatMap() - transforma e achata
- flat() - achata arrays aninhados

FILTRAGEM:
- filter() - filtra elementos por condição
- find() - encontra primeiro elemento
- findIndex() - encontra índice do primeiro elemento

VERIFICAÇÃO:
- some() - verifica se algum elemento atende condição
- every() - verifica se todos elementos atendem condição
- includes() - verifica se contém elemento

REDUÇÃO:
- reduce() - reduz array a um único valor
- reduceRight() - reduz da direita para esquerda

ITERAÇÃO:
- forEach() - executa função para cada elemento
- entries() - retorna iterador de [índice, valor]
- keys() - retorna iterador de índices
- values() - retorna iterador de valores

COMPLEXIDADE TEMPORAL:
- map, filter, forEach: O(n)
- find, findIndex: O(n) no pior caso
- some, every: O(n) no pior caso, pode ser O(1)
- reduce: O(n)
- flat: O(n * d) onde d é a profundidade

PROGRAMAÇÃO FUNCIONAL:
- Funções puras (sem efeitos colaterais)
- Imutabilidade de dados
- Composição de funções
- Higher-order functions
- Currying e partial application
*/

console.log('=== MÉTODOS AVANÇADOS DE ARRAYS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== MAP - TRANSFORMAÇÃO ==========
console.log('\n--- MAP - TRANSFORMAÇÃO ---');

// Dados de exemplo
const produtos = [
    { id: 1, nome: 'Notebook', preco: 2500, categoria: 'Eletrônicos', estoque: 5 },
    { id: 2, nome: 'Mouse', preco: 45, categoria: 'Eletrônicos', estoque: 20 },
    { id: 3, nome: 'Teclado', preco: 120, categoria: 'Eletrônicos', estoque: 15 },
    { id: 4, nome: 'Cadeira', preco: 450, categoria: 'Móveis', estoque: 8 },
    { id: 5, nome: 'Mesa', preco: 300, categoria: 'Móveis', estoque: 3 }
];

console.log('\n📦 Produtos originais:', produtos);

// MAP básico - extrair apenas nomes
console.log('\n🏷️ Usando map() - extrair nomes:');
const nomesProdutos = produtos.map(produto => produto.nome);
console.log('Nomes:', nomesProdutos);

// MAP com transformação - calcular preço com desconto
console.log('\n💰 Map com transformação - preços com 10% desconto:');
const produtosComDesconto = produtos.map(produto => ({
    ...produto,
    precoOriginal: produto.preco,
    preco: produto.preco * 0.9,
    desconto: '10%'
}));

console.log('Produtos com desconto:');
produtosComDesconto.forEach(p => {
    console.log(`${p.nome}: R$ ${p.precoOriginal} → R$ ${p.preco.toFixed(2)}`);
});

// MAP com índice
console.log('\n📊 Map com índice - numeração:');
const produtosNumerados = produtos.map((produto, index) => ({
    numero: index + 1,
    nome: produto.nome,
    preco: produto.preco
}));

console.log('Produtos numerados:', produtosNumerados);

// MAP aninhado - transformar arrays de arrays
console.log('\n🔄 Map aninhado:');
const vendas = [
    [{ produto: 'Notebook', quantidade: 2 }, { produto: 'Mouse', quantidade: 5 }],
    [{ produto: 'Teclado', quantidade: 3 }],
    [{ produto: 'Cadeira', quantidade: 1 }, { produto: 'Mesa', quantidade: 2 }]
];

const vendasProcessadas = vendas.map(vendaDia => 
    vendaDia.map(item => ({
        ...item,
        total: item.quantidade * (produtos.find(p => p.nome === item.produto)?.preco || 0)
    }))
);

console.log('Vendas processadas:', vendasProcessadas);

// ========== FILTER - FILTRAGEM ==========
console.log('\n--- FILTER - FILTRAGEM ---');

// FILTER básico - produtos eletrônicos
console.log('\n🔌 Usando filter() - produtos eletrônicos:');
const eletronicos = produtos.filter(produto => produto.categoria === 'Eletrônicos');
console.log('Eletrônicos:', eletronicos.map(p => p.nome));

// FILTER com múltiplas condições
console.log('\n💸 Filter com múltiplas condições - produtos baratos em estoque:');
const produtosBaratosEmEstoque = produtos.filter(produto => 
    produto.preco < 200 && produto.estoque > 10
);
console.log('Produtos baratos em estoque:', produtosBaratosEmEstoque);

// FILTER com função externa
console.log('\n🎯 Filter com função externa:');
const estaEmEstoque = produto => produto.estoque > 0;
const eCaro = produto => produto.preco > 100;
const eEletronico = produto => produto.categoria === 'Eletrônicos';

const eletronicosCarosEmEstoque = produtos
    .filter(estaEmEstoque)
    .filter(eCaro)
    .filter(eEletronico);

console.log('Eletrônicos caros em estoque:', eletronicosCarosEmEstoque.map(p => p.nome));

// FILTER com regex
console.log('\n🔍 Filter com regex - produtos que começam com "M":');
const produtosComM = produtos.filter(produto => /^M/i.test(produto.nome));
console.log('Produtos com M:', produtosComM.map(p => p.nome));

// ========== REDUCE - REDUÇÃO ==========
console.log('\n--- REDUCE - REDUÇÃO ---');

// REDUCE básico - soma de preços
console.log('\n💰 Usando reduce() - valor total do estoque:');
const valorTotalEstoque = produtos.reduce((total, produto) => {
    return total + (produto.preco * produto.estoque);
}, 0);

console.log(`Valor total do estoque: R$ ${valorTotalEstoque.toFixed(2)}`);

// REDUCE para agrupar por categoria
console.log('\n📊 Reduce para agrupar por categoria:');
const produtosPorCategoria = produtos.reduce((grupos, produto) => {
    if (!grupos[produto.categoria]) {
        grupos[produto.categoria] = [];
    }
    grupos[produto.categoria].push(produto);
    return grupos;
}, {});

console.log('Produtos por categoria:', produtosPorCategoria);

// REDUCE para encontrar produto mais caro
console.log('\n🏆 Reduce para encontrar produto mais caro:');
const produtoMaisCaro = produtos.reduce((maisCaro, produto) => {
    return produto.preco > maisCaro.preco ? produto : maisCaro;
});

console.log('Produto mais caro:', produtoMaisCaro.nome, `R$ ${produtoMaisCaro.preco}`);

// REDUCE para criar objeto de lookup
console.log('\n🗂️ Reduce para criar lookup por ID:');
const produtosPorId = produtos.reduce((lookup, produto) => {
    lookup[produto.id] = produto;
    return lookup;
}, {});

console.log('Lookup por ID:', produtosPorId);

// REDUCE com array de números
console.log('\n🔢 Reduce com números - estatísticas:');
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const estatisticas = numeros.reduce((stats, num) => {
    stats.soma += num;
    stats.count++;
    stats.min = Math.min(stats.min, num);
    stats.max = Math.max(stats.max, num);
    stats.media = stats.soma / stats.count;
    return stats;
}, { soma: 0, count: 0, min: Infinity, max: -Infinity, media: 0 });

console.log('Estatísticas:', estatisticas);

// ========== FIND E FINDINDEX ==========
console.log('\n--- FIND E FINDINDEX ---');

// FIND - encontrar primeiro elemento
console.log('\n🔍 Usando find() - primeiro produto caro:');
const primeiroProdutoCaro = produtos.find(produto => produto.preco > 200);
console.log('Primeiro produto caro:', primeiroProdutoCaro?.nome || 'Não encontrado');

// FINDINDEX - encontrar índice
console.log('\n📍 Usando findIndex() - índice do primeiro móvel:');
const indiceMovel = produtos.findIndex(produto => produto.categoria === 'Móveis');
console.log('Índice do primeiro móvel:', indiceMovel);

// FIND com condição complexa
console.log('\n🎯 Find com condição complexa:');
const produtoEspecifico = produtos.find(produto => 
    produto.categoria === 'Eletrônicos' && 
    produto.preco < 100 && 
    produto.estoque > 15
);

console.log('Produto específico:', produtoEspecifico?.nome || 'Não encontrado');

// ========== SOME E EVERY ==========
console.log('\n--- SOME E EVERY ---');

// SOME - verifica se algum elemento atende condição
console.log('\n❓ Usando some():');
const temProdutoCaro = produtos.some(produto => produto.preco > 1000);
const temProdutoSemEstoque = produtos.some(produto => produto.estoque === 0);
const temEletronicos = produtos.some(produto => produto.categoria === 'Eletrônicos');

console.log('Tem produto caro (>R$1000)?', temProdutoCaro);
console.log('Tem produto sem estoque?', temProdutoSemEstoque);
console.log('Tem eletrônicos?', temEletronicos);

// EVERY - verifica se todos elementos atendem condição
console.log('\n✅ Usando every():');
const todosProdutosTemEstoque = produtos.every(produto => produto.estoque > 0);
const todosProdutosSaoCaros = produtos.every(produto => produto.preco > 100);
const todosProdutosTemNome = produtos.every(produto => produto.nome && produto.nome.length > 0);

console.log('Todos produtos têm estoque?', todosProdutosTemEstoque);
console.log('Todos produtos são caros (>R$100)?', todosProdutosSaoCaros);
console.log('Todos produtos têm nome?', todosProdutosTemNome);

// ========== FOREACH ==========
console.log('\n--- FOREACH ---');

// FOREACH básico
console.log('\n🔄 Usando forEach() - listar produtos:');
produtos.forEach((produto, index) => {
    console.log(`${index + 1}. ${produto.nome} - R$ ${produto.preco} (${produto.estoque} em estoque)`);
});

// FOREACH com efeitos colaterais (cuidado!)
console.log('\n⚠️ ForEach com efeitos colaterais:');
let totalValor = 0;
let totalItens = 0;

produtos.forEach(produto => {
    totalValor += produto.preco * produto.estoque;
    totalItens += produto.estoque;
});

console.log(`Total em valor: R$ ${totalValor.toFixed(2)}`);
console.log(`Total em itens: ${totalItens}`);

// ========== FLAT E FLATMAP ==========
console.log('\n--- FLAT E FLATMAP ---');

// FLAT - achatar arrays aninhados
console.log('\n📏 Usando flat():');
const arraysAninhados = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const arrayAchatado = arraysAninhados.flat();
console.log('Arrays aninhados:', arraysAninhados);
console.log('Array achatado:', arrayAchatado);

// FLAT com profundidade
console.log('\n🏔️ Flat com profundidade:');
const arraysMuitoAninhados = [
    [1, [2, 3]],
    [4, [5, [6, 7]]],
    [8, 9]
];

const achatadoProfundidade1 = arraysMuitoAninhados.flat(1);
const achatadoProfundidade2 = arraysMuitoAninhados.flat(2);
const achatadoCompleto = arraysMuitoAninhados.flat(Infinity);

console.log('Original:', arraysMuitoAninhados);
console.log('Profundidade 1:', achatadoProfundidade1);
console.log('Profundidade 2:', achatadoProfundidade2);
console.log('Completamente achatado:', achatadoCompleto);

// FLATMAP - map + flat
console.log('\n🗺️ Usando flatMap():');
const frases = ['Hello world', 'JavaScript rocks', 'Arrays are awesome'];

// Separar palavras de cada frase
const palavras = frases.flatMap(frase => frase.split(' '));
console.log('Frases:', frases);
console.log('Palavras:', palavras);

// FlatMap com produtos e suas tags
const produtosComTags = [
    { nome: 'Notebook', tags: ['eletrônico', 'portátil', 'trabalho'] },
    { nome: 'Mouse', tags: ['eletrônico', 'acessório'] },
    { nome: 'Cadeira', tags: ['móvel', 'escritório', 'conforto'] }
];

const todasTags = produtosComTags.flatMap(produto => produto.tags);
const tagsUnicas = [...new Set(todasTags)];

console.log('Produtos com tags:', produtosComTags);
console.log('Todas as tags:', todasTags);
console.log('Tags únicas:', tagsUnicas);

// ========== MÉTODOS DE ITERAÇÃO ==========
console.log('\n--- MÉTODOS DE ITERAÇÃO ---');

// ENTRIES - iterador de [índice, valor]
console.log('\n🔢 Usando entries():');
const frutas = ['maçã', 'banana', 'laranja'];

for (const [indice, fruta] of frutas.entries()) {
    console.log(`${indice}: ${fruta}`);
}

// KEYS - iterador de índices
console.log('\n🗝️ Usando keys():');
for (const indice of frutas.keys()) {
    console.log(`Índice: ${indice}`);
}

// VALUES - iterador de valores
console.log('\n💎 Usando values():');
for (const fruta of frutas.values()) {
    console.log(`Fruta: ${fruta}`);
}

// ========== REDUCERIGHT ==========
console.log('\n--- REDUCERIGHT ---');

// REDUCERIGHT - redução da direita para esquerda
console.log('\n⬅️ Usando reduceRight():');
const letras = ['a', 'b', 'c', 'd'];

const concatenacaoEsquerda = letras.reduce((acc, letra) => acc + letra, '');
const concatenacaoDireita = letras.reduceRight((acc, letra) => acc + letra, '');

console.log('Letras:', letras);
console.log('Concatenação esquerda (reduce):', concatenacaoEsquerda);
console.log('Concatenação direita (reduceRight):', concatenacaoDireita);

// ReduceRight para operações matemáticas
console.log('\n🧮 ReduceRight para operações:');
const numerosOp = [2, 3, 4];

// Potenciação da direita para esquerda: 2^(3^4)
const potenciacaoDireita = numerosOp.reduceRight((acc, num) => Math.pow(num, acc));
console.log('Números:', numerosOp);
console.log('Potenciação da direita:', potenciacaoDireita); // 2^(3^4) = 2^81

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Análise de Vendas
console.log('\n--- EXERCÍCIO 1: SISTEMA DE ANÁLISE DE VENDAS ---');

class AnalisadorVendas {
    constructor(vendas) {
        this.vendas = vendas;
    }
    
    // Calcular receita total
    calcularReceitaTotal() {
        return this.vendas.reduce((total, venda) => total + venda.valor, 0);
    }
    
    // Agrupar vendas por período
    agruparPorPeriodo(periodo = 'mes') {
        return this.vendas.reduce((grupos, venda) => {
            let chave;
            const data = new Date(venda.data);
            
            switch (periodo) {
                case 'dia':
                    chave = data.toISOString().split('T')[0];
                    break;
                case 'mes':
                    chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
                    break;
                case 'ano':
                    chave = data.getFullYear().toString();
                    break;
                default:
                    chave = 'total';
            }
            
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(venda);
            return grupos;
        }, {});
    }
    
    // Encontrar top vendedores
    encontrarTopVendedores(limite = 5) {
        const vendasPorVendedor = this.vendas.reduce((acc, venda) => {
            if (!acc[venda.vendedor]) {
                acc[venda.vendedor] = {
                    nome: venda.vendedor,
                    totalVendas: 0,
                    valorTotal: 0,
                    vendas: []
                };
            }
            
            acc[venda.vendedor].totalVendas++;
            acc[venda.vendedor].valorTotal += venda.valor;
            acc[venda.vendedor].vendas.push(venda);
            
            return acc;
        }, {});
        
        return Object.values(vendasPorVendedor)
            .sort((a, b) => b.valorTotal - a.valorTotal)
            .slice(0, limite);
    }
    
    // Analisar produtos mais vendidos
    analisarProdutosMaisVendidos() {
        const produtosVendidos = this.vendas
            .flatMap(venda => venda.itens)
            .reduce((acc, item) => {
                if (!acc[item.produto]) {
                    acc[item.produto] = {
                        nome: item.produto,
                        quantidadeTotal: 0,
                        valorTotal: 0,
                        numeroVendas: 0
                    };
                }
                
                acc[item.produto].quantidadeTotal += item.quantidade;
                acc[item.produto].valorTotal += item.valor;
                acc[item.produto].numeroVendas++;
                
                return acc;
            }, {});
        
        return Object.values(produtosVendidos)
            .sort((a, b) => b.quantidadeTotal - a.quantidadeTotal);
    }
    
    // Calcular métricas de performance
    calcularMetricas() {
        const receitas = this.vendas.map(venda => venda.valor);
        const vendedores = [...new Set(this.vendas.map(venda => venda.vendedor))];
        
        const receitaTotal = receitas.reduce((a, b) => a + b, 0);
        const receitaMedia = receitaTotal / receitas.length;
        const receitaMaxima = Math.max(...receitas);
        const receitaMinima = Math.min(...receitas);
        
        const vendasPorDia = this.agruparPorPeriodo('dia');
        const diasComVendas = Object.keys(vendasPorDia).length;
        const mediaVendasPorDia = this.vendas.length / diasComVendas;
        
        return {
            receitaTotal,
            receitaMedia,
            receitaMaxima,
            receitaMinima,
            totalVendas: this.vendas.length,
            totalVendedores: vendedores.length,
            diasComVendas,
            mediaVendasPorDia
        };
    }
    
    // Filtrar vendas por critérios
    filtrarVendas(criterios) {
        return this.vendas.filter(venda => {
            // Filtro por valor mínimo
            if (criterios.valorMinimo && venda.valor < criterios.valorMinimo) {
                return false;
            }
            
            // Filtro por valor máximo
            if (criterios.valorMaximo && venda.valor > criterios.valorMaximo) {
                return false;
            }
            
            // Filtro por vendedor
            if (criterios.vendedor && venda.vendedor !== criterios.vendedor) {
                return false;
            }
            
            // Filtro por período
            if (criterios.dataInicio || criterios.dataFim) {
                const dataVenda = new Date(venda.data);
                if (criterios.dataInicio && dataVenda < new Date(criterios.dataInicio)) {
                    return false;
                }
                if (criterios.dataFim && dataVenda > new Date(criterios.dataFim)) {
                    return false;
                }
            }
            
            // Filtro por produto
            if (criterios.produto) {
                const temProduto = venda.itens.some(item => 
                    item.produto.toLowerCase().includes(criterios.produto.toLowerCase())
                );
                if (!temProduto) {
                    return false;
                }
            }
            
            return true;
        });
    }
    
    // Gerar relatório completo
    gerarRelatorio() {
        const metricas = this.calcularMetricas();
        const topVendedores = this.encontrarTopVendedores(3);
        const produtosMaisVendidos = this.analisarProdutosMaisVendidos().slice(0, 5);
        const vendasPorMes = this.agruparPorPeriodo('mes');
        
        console.log('\n📊 RELATÓRIO DE VENDAS');
        console.log('=' .repeat(50));
        
        console.log('\n💰 Métricas Gerais:');
        console.log(`Receita Total: R$ ${metricas.receitaTotal.toFixed(2)}`);
        console.log(`Receita Média: R$ ${metricas.receitaMedia.toFixed(2)}`);
        console.log(`Total de Vendas: ${metricas.totalVendas}`);
        console.log(`Total de Vendedores: ${metricas.totalVendedores}`);
        console.log(`Média de Vendas/Dia: ${metricas.mediaVendasPorDia.toFixed(1)}`);
        
        console.log('\n🏆 Top Vendedores:');
        topVendedores.forEach((vendedor, index) => {
            console.log(`${index + 1}. ${vendedor.nome}: R$ ${vendedor.valorTotal.toFixed(2)} (${vendedor.totalVendas} vendas)`);
        });
        
        console.log('\n📦 Produtos Mais Vendidos:');
        produtosMaisVendidos.forEach((produto, index) => {
            console.log(`${index + 1}. ${produto.nome}: ${produto.quantidadeTotal} unidades (R$ ${produto.valorTotal.toFixed(2)})`);
        });
        
        console.log('\n📅 Vendas por Mês:');
        Object.entries(vendasPorMes).forEach(([mes, vendas]) => {
            const receitaMes = vendas.reduce((total, venda) => total + venda.valor, 0);
            console.log(`${mes}: ${vendas.length} vendas - R$ ${receitaMes.toFixed(2)}`);
        });
        
        return {
            metricas,
            topVendedores,
            produtosMaisVendidos,
            vendasPorMes
        };
    }
}

// Dados de teste para vendas
const vendasTeste = [
    {
        id: 1,
        data: '2024-01-15',
        vendedor: 'Ana Silva',
        valor: 1250.00,
        itens: [
            { produto: 'Notebook Dell', quantidade: 1, valor: 1250.00 }
        ]
    },
    {
        id: 2,
        data: '2024-01-16',
        vendedor: 'Bruno Santos',
        valor: 320.00,
        itens: [
            { produto: 'Mouse Logitech', quantidade: 2, valor: 90.00 },
            { produto: 'Teclado Mecânico', quantidade: 1, valor: 230.00 }
        ]
    },
    {
        id: 3,
        data: '2024-01-17',
        vendedor: 'Ana Silva',
        valor: 450.00,
        itens: [
            { produto: 'Cadeira Ergonômica', quantidade: 1, valor: 450.00 }
        ]
    },
    {
        id: 4,
        data: '2024-02-01',
        vendedor: 'Carlos Oliveira',
        valor: 800.00,
        itens: [
            { produto: 'Monitor 24"', quantidade: 2, valor: 800.00 }
        ]
    },
    {
        id: 5,
        data: '2024-02-03',
        vendedor: 'Bruno Santos',
        valor: 180.00,
        itens: [
            { produto: 'Mouse Logitech', quantidade: 4, valor: 180.00 }
        ]
    }
];

// Testando analisador de vendas
console.log('\n💼 Testando analisador de vendas:');
const analisador = new AnalisadorVendas(vendasTeste);

// Gerando relatório completo
const relatorio = analisador.gerarRelatorio();

// Testando filtros
console.log('\n🔍 Testando filtros:');
const vendasAna = analisador.filtrarVendas({ vendedor: 'Ana Silva' });
console.log(`Vendas da Ana: ${vendasAna.length}`);

const vendasCaras = analisador.filtrarVendas({ valorMinimo: 500 });
console.log(`Vendas acima de R$ 500: ${vendasCaras.length}`);

// EXERCÍCIO 2: Processador de Dados Complexos
console.log('\n--- EXERCÍCIO 2: PROCESSADOR DE DADOS COMPLEXOS ---');

class ProcessadorDados {
    // Pipeline de transformação de dados
    static pipeline(dados, ...transformacoes) {
        return transformacoes.reduce((resultado, transformacao) => {
            return transformacao(resultado);
        }, dados);
    }
    
    // Transformações disponíveis
    static transformacoes = {
        // Filtrar por propriedade
        filtrarPor: (propriedade, valor) => (dados) => {
            return dados.filter(item => item[propriedade] === valor);
        },
        
        // Filtrar por condição customizada
        filtrarPorCondicao: (condicao) => (dados) => {
            return dados.filter(condicao);
        },
        
        // Mapear propriedades
        mapearPropriedades: (mapeamento) => (dados) => {
            return dados.map(item => {
                const novoItem = {};
                Object.entries(mapeamento).forEach(([novaChave, chaveOriginal]) => {
                    if (typeof chaveOriginal === 'function') {
                        novoItem[novaChave] = chaveOriginal(item);
                    } else {
                        novoItem[novaChave] = item[chaveOriginal];
                    }
                });
                return novoItem;
            });
        },
        
        // Agrupar por propriedade
        agruparPor: (propriedade) => (dados) => {
            return dados.reduce((grupos, item) => {
                const chave = item[propriedade];
                if (!grupos[chave]) {
                    grupos[chave] = [];
                }
                grupos[chave].push(item);
                return grupos;
            }, {});
        },
        
        // Ordenar por propriedade
        ordenarPor: (propriedade, ordem = 'asc') => (dados) => {
            return [...dados].sort((a, b) => {
                const valorA = a[propriedade];
                const valorB = b[propriedade];
                
                if (ordem === 'asc') {
                    return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
                } else {
                    return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
                }
            });
        },
        
        // Limitar quantidade
        limitar: (quantidade) => (dados) => {
            return dados.slice(0, quantidade);
        },
        
        // Calcular estatísticas
        calcularEstatisticas: (propriedade) => (dados) => {
            const valores = dados.map(item => item[propriedade]).filter(v => typeof v === 'number');
            
            if (valores.length === 0) {
                return { erro: 'Nenhum valor numérico encontrado' };
            }
            
            const soma = valores.reduce((a, b) => a + b, 0);
            const media = soma / valores.length;
            const min = Math.min(...valores);
            const max = Math.max(...valores);
            
            // Mediana
            const valoresOrdenados = [...valores].sort((a, b) => a - b);
            const meio = Math.floor(valoresOrdenados.length / 2);
            const mediana = valoresOrdenados.length % 2 === 0
                ? (valoresOrdenados[meio - 1] + valoresOrdenados[meio]) / 2
                : valoresOrdenados[meio];
            
            return {
                propriedade,
                count: valores.length,
                soma,
                media,
                mediana,
                min,
                max
            };
        },
        
        // Achatar arrays aninhados
        achatar: (propriedade) => (dados) => {
            return dados.flatMap(item => item[propriedade] || []);
        },
        
        // Remover duplicatas
        removerDuplicatas: (propriedade) => (dados) => {
            const vistos = new Set();
            return dados.filter(item => {
                const valor = item[propriedade];
                if (vistos.has(valor)) {
                    return false;
                }
                vistos.add(valor);
                return true;
            });
        }
    };
    
    // Análise de frequência
    static analisarFrequencia(dados, propriedade) {
        const frequencias = dados.reduce((freq, item) => {
            const valor = item[propriedade];
            freq[valor] = (freq[valor] || 0) + 1;
            return freq;
        }, {});
        
        return Object.entries(frequencias)
            .map(([valor, count]) => ({ valor, count }))
            .sort((a, b) => b.count - a.count);
    }
    
    // Correlação entre propriedades numéricas
    static calcularCorrelacao(dados, prop1, prop2) {
        const pares = dados
            .filter(item => typeof item[prop1] === 'number' && typeof item[prop2] === 'number')
            .map(item => [item[prop1], item[prop2]]);
        
        if (pares.length < 2) {
            return { erro: 'Dados insuficientes para correlação' };
        }
        
        const n = pares.length;
        const somaX = pares.reduce((sum, [x]) => sum + x, 0);
        const somaY = pares.reduce((sum, [, y]) => sum + y, 0);
        const somaXY = pares.reduce((sum, [x, y]) => sum + x * y, 0);
        const somaX2 = pares.reduce((sum, [x]) => sum + x * x, 0);
        const somaY2 = pares.reduce((sum, [, y]) => sum + y * y, 0);
        
        const numerador = n * somaXY - somaX * somaY;
        const denominador = Math.sqrt((n * somaX2 - somaX * somaX) * (n * somaY2 - somaY * somaY));
        
        const correlacao = denominador === 0 ? 0 : numerador / denominador;
        
        return {
            propriedades: [prop1, prop2],
            correlacao,
            interpretacao: Math.abs(correlacao) > 0.7 ? 'forte' : 
                          Math.abs(correlacao) > 0.3 ? 'moderada' : 'fraca'
        };
    }
}

// Dados de teste complexos
const dadosComplexos = [
    { id: 1, nome: 'João', idade: 25, salario: 3000, departamento: 'TI', projetos: ['A', 'B'] },
    { id: 2, nome: 'Maria', idade: 30, salario: 4500, departamento: 'RH', projetos: ['C'] },
    { id: 3, nome: 'Pedro', idade: 35, salario: 5000, departamento: 'TI', projetos: ['A', 'D'] },
    { id: 4, nome: 'Ana', idade: 28, salario: 3800, departamento: 'Vendas', projetos: ['B', 'C'] },
    { id: 5, nome: 'Carlos', idade: 32, salario: 4200, departamento: 'TI', projetos: ['D'] },
    { id: 6, nome: 'Lucia', idade: 27, salario: 3500, departamento: 'RH', projetos: ['A', 'C'] },
    { id: 7, nome: 'Roberto', idade: 40, salario: 6000, departamento: 'Vendas', projetos: ['B'] },
    { id: 8, nome: 'Fernanda', idade: 26, salario: 3200, departamento: 'TI', projetos: ['A', 'B', 'D'] }
];

console.log('\n🔧 Testando processador de dados complexos:');

// Pipeline 1: Funcionários de TI com salário alto
const funcionariosTIAltoSalario = ProcessadorDados.pipeline(
    dadosComplexos,
    ProcessadorDados.transformacoes.filtrarPor('departamento', 'TI'),
    ProcessadorDados.transformacoes.filtrarPorCondicao(pessoa => pessoa.salario > 4000),
    ProcessadorDados.transformacoes.mapearPropriedades({
        nome: 'nome',
        salario: 'salario',
        quantidadeProjetos: item => item.projetos.length
    }),
    ProcessadorDados.transformacoes.ordenarPor('salario', 'desc')
);

console.log('\n💻 Funcionários de TI com alto salário:', funcionariosTIAltoSalario);

// Pipeline 2: Análise de projetos
const analiseProj = ProcessadorDados.pipeline(
    dadosComplexos,
    ProcessadorDados.transformacoes.achatar('projetos'),
    dados => ProcessadorDados.analisarFrequencia(dados.map(proj => ({ projeto: proj })), 'projeto')
);

console.log('\n📊 Análise de frequência de projetos:', analiseProj);

// Estatísticas de salário por departamento
console.log('\n💰 Estatísticas de salário por departamento:');
const departamentos = ['TI', 'RH', 'Vendas'];
departamentos.forEach(dept => {
    const estatisticas = ProcessadorDados.pipeline(
        dadosComplexos,
        ProcessadorDados.transformacoes.filtrarPor('departamento', dept),
        ProcessadorDados.transformacoes.calcularEstatisticas('salario')
    );
    console.log(`${dept}:`, estatisticas);
});

// Correlação idade vs salário
const correlacao = ProcessadorDados.calcularCorrelacao(dadosComplexos, 'idade', 'salario');
console.log('\n📈 Correlação idade vs salário:', correlacao);

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA MÉTODOS AVANÇADOS:

1. **Performance de Métodos Funcionais**
   - map, filter, reduce são O(n) - lineares
   - Evite encadeamentos desnecessários
   - Use for loops para performance crítica
   - Considere early termination com some/every

2. **Otimização de Encadeamento**
   - Combine operações quando possível
   - Use filter antes de map para reduzir processamento
   - Evite múltiplos reduce consecutivos
   - Considere transducers para pipelines complexos

3. **Memory Management**
   - Métodos funcionais criam novos arrays
   - Use forEach para efeitos colaterais sem criar arrays
   - Considere generators para datasets grandes
   - Implemente lazy evaluation quando apropriado

4. **Casos Específicos**
   - find/findIndex param na primeira ocorrência
   - some/every param no primeiro true/false
   - Use Set para verificações de existência rápidas
   - Considere Map para lookups frequentes

5. **Debugging e Desenvolvimento**
   - Use console.log dentro de callbacks para debug
   - Nomeie funções para stack traces mais claros
   - Valide dados antes de processar
   - Use TypeScript para type safety

6. **Programação Funcional**
   - Prefira funções puras (sem efeitos colaterais)
   - Use currying para reutilização
   - Implemente composição de funções
   - Considere bibliotecas como Ramda ou Lodash/FP
*/

// Exemplo de otimização
console.log('\n⚡ Exemplo de otimização:');

// ❌ Menos eficiente - múltiplas iterações
function processarDadosLento(dados) {
    return dados
        .filter(item => item.ativo)
        .map(item => ({ ...item, processado: true }))
        .filter(item => item.valor > 100)
        .map(item => ({ ...item, categoria: item.valor > 500 ? 'alto' : 'medio' }));
}

// ✅ Mais eficiente - menos iterações
function processarDadosRapido(dados) {
    return dados.reduce((resultado, item) => {
        if (item.ativo && item.valor > 100) {
            resultado.push({
                ...item,
                processado: true,
                categoria: item.valor > 500 ? 'alto' : 'medio'
            });
        }
        return resultado;
    }, []);
}

// ✅ Ainda mais eficiente - for loop
function processarDadosMaisRapido(dados) {
    const resultado = [];
    for (let i = 0; i < dados.length; i++) {
        const item = dados[i];
        if (item.ativo && item.valor > 100) {
            resultado.push({
                ...item,
                processado: true,
                categoria: item.valor > 500 ? 'alto' : 'medio'
            });
        }
    }
    return resultado;
}

// Testando performance
const dadosPerformance = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    ativo: Math.random() > 0.3,
    valor: Math.random() * 1000
}));

console.time('Processamento lento');
processarDadosLento(dadosPerformance);
console.timeEnd('Processamento lento');

console.time('Processamento rápido');
processarDadosRapido(dadosPerformance);
console.timeEnd('Processamento rápido');

console.time('Processamento mais rápido');
processarDadosMaisRapido(dadosPerformance);
console.timeEnd('Processamento mais rápido');

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- MDN Functional Programming: https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function
- ECMAScript Array Specification: https://tc39.es/ecma262/#sec-array-objects

📚 LIVROS RECOMENDADOS:
- "Functional-Light JavaScript" - Kyle Simpson
- "Professor Frisby's Mostly Adequate Guide to Functional Programming"
- "JavaScript Allongé" - Reginald Braithwaite

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Iteração avançada e generators
2. Array methods chaining
3. Programação funcional avançada
4. Lazy evaluation e streams
5. Transducers e composição
6. Performance e otimização
7. Estruturas de dados imutáveis
8. Reactive programming

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente um sistema de recomendação
2. Crie um motor de busca simples
3. Desenvolva um sistema de analytics
4. Implemente algoritmos de machine learning básicos
5. Crie utilitários de data processing

🔧 FERRAMENTAS ÚTEIS:
- Lodash/FP para programação funcional
- Ramda para composição de funções
- RxJS para programação reativa
- Immutable.js para estruturas imutáveis
- D3.js para processamento de dados

⚠️ ARMADILHAS COMUNS:
1. Usar forEach quando map/filter seria melhor
2. Não considerar performance em datasets grandes
3. Criar funções com efeitos colaterais
4. Não validar dados antes de processar
5. Encadear métodos desnecessariamente
6. Não usar early termination (some/every)
7. Confundir reduce com reduceRight
8. Não entender closures em callbacks

🎓 CONCEITOS AVANÇADOS:
- Monads e functors
- Transducers
- Lazy sequences
- Stream processing
- Parallel processing
*/

console.log('\n✅ Módulo de Métodos Avançados de Arrays concluído!');
console.log('📝 Próximo arquivo: 03-iteracao-arrays.js');
console.log('🎯 Continue praticando com os exercícios propostos!');

/*
==============================================
RESUMO DO MÓDULO - MÉTODOS AVANÇADOS DE ARRAYS
==============================================

✅ CONCEITOS APRENDIDOS:
- Métodos funcionais (map, filter, reduce)
- Busca e verificação (find, some, every)
- Iteração avançada (forEach, entries)
- Achatamento (flat, flatMap)
- Redução bidirecional (reduce, reduceRight)
- Programação funcional
- Pipeline de transformações
- Análise de dados

🎯 HABILIDADES DESENVOLVIDAS:
- Transformar dados eficientemente
- Implementar pipelines de processamento
- Analisar datasets complexos
- Criar sistemas de analytics
- Aplicar programação funcional
- Otimizar performance
- Compor funções complexas

📈 PRÓXIMOS DESAFIOS:
- Iteração avançada
- Method chaining
- Programação reativa
- Estruturas imutáveis
- Performance em larga escala

==============================================
*/