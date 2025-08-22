/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 5.4
ENCEADEAMENTO DE MÉTODOS DE ARRAYS
==============================================

Objetivos de Aprendizagem:
- Dominar method chaining com arrays
- Combinar múltiplos métodos eficientemente
- Aplicar programação funcional
- Otimizar pipelines de transformação
- Implementar fluent interfaces
- Criar utilitários de array customizados
- Entender composição de funções
- Debuggar chains complexos

⏱️ TEMPO ESTIMADO: 80 minutos
📊 NÍVEL: Intermediário a Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: METHOD CHAINING
// ==========================================

/*
METHOD CHAINING EM ARRAYS:
Method chaining é a técnica de encadear múltiplas chamadas de métodos
em uma única expressão, criando pipelines de transformação de dados.

VANTAGENS DO METHOD CHAINING:
1. **Legibilidade** - código mais expressivo e declarativo
2. **Composição** - combina operações simples em complexas
3. **Imutabilidade** - cada método retorna novo array
4. **Reutilização** - pipelines podem ser extraídos e reutilizados
5. **Debugging** - cada etapa pode ser inspecionada

DESVANTAGENS:
1. **Performance** - múltiplas iterações sobre dados
2. **Memory** - arrays intermediários são criados
3. **Debugging** - stack traces podem ser confusos
4. **Complexidade** - chains muito longos são difíceis de entender

MÉTODOS CHAINABLE:
- map() - transforma elementos
- filter() - filtra elementos
- reduce() - reduz a um valor
- sort() - ordena elementos
- slice() - extrai porção
- concat() - concatena arrays
- flat() - achata arrays
- flatMap() - map + flat

MÉTODOS TERMINAIS (não chainable):
- forEach() - executa função para cada elemento
- find() - encontra primeiro elemento
- findIndex() - encontra índice
- some() - verifica se algum atende condição
- every() - verifica se todos atendem condição
- includes() - verifica se contém elemento
- indexOf() - encontra índice de elemento
- join() - converte para string

PADRÕES COMUNS:
1. **Filter → Map** - filtrar depois transformar
2. **Map → Filter** - transformar depois filtrar
3. **Sort → Slice** - ordenar depois limitar
4. **FlatMap → Filter** - achatar depois filtrar
5. **Map → Reduce** - transformar depois agregar

OTIMIZAÇÃO:
- Filtrar antes de transformar quando possível
- Usar reduce para múltiplas operações
- Considerar for loops para performance crítica
- Implementar lazy evaluation com generators
- Usar transducers para pipelines complexos

PROGRAMAÇÃO FUNCIONAL:
- Funções puras (sem efeitos colaterais)
- Imutabilidade de dados
- Composição de funções
- Higher-order functions
- Point-free style
*/

console.log('=== ENCADEAMENTO DE MÉTODOS DE ARRAYS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== CHAINS BÁSICOS ==========
console.log('\n--- CHAINS BÁSICOS ---');

// Dados de exemplo
const vendas = [
    { id: 1, produto: 'Notebook', categoria: 'Eletrônicos', preco: 2500, quantidade: 2, vendedor: 'Ana' },
    { id: 2, produto: 'Mouse', categoria: 'Eletrônicos', preco: 45, quantidade: 10, vendedor: 'Bruno' },
    { id: 3, produto: 'Teclado', categoria: 'Eletrônicos', preco: 120, quantidade: 5, vendedor: 'Ana' },
    { id: 4, produto: 'Cadeira', categoria: 'Móveis', preco: 450, quantidade: 3, vendedor: 'Carlos' },
    { id: 5, produto: 'Mesa', categoria: 'Móveis', preco: 300, quantidade: 2, vendedor: 'Ana' },
    { id: 6, produto: 'Monitor', categoria: 'Eletrônicos', preco: 800, quantidade: 4, vendedor: 'Bruno' },
    { id: 7, produto: 'Smartphone', categoria: 'Eletrônicos', preco: 1200, quantidade: 6, vendedor: 'Diana' },
    { id: 8, produto: 'Tablet', categoria: 'Eletrônicos', preco: 600, quantidade: 3, vendedor: 'Carlos' }
];

console.log('\n📊 Dados originais:', vendas.length, 'vendas');

// Chain básico: filtrar → mapear → ordenar
console.log('\n🔗 Chain básico - eletrônicos caros ordenados por preço:');
const eletronicosCaros = vendas
    .filter(venda => venda.categoria === 'Eletrônicos')
    .filter(venda => venda.preco > 500)
    .map(venda => ({
        produto: venda.produto,
        preco: venda.preco,
        total: venda.preco * venda.quantidade
    }))
    .sort((a, b) => b.preco - a.preco);

console.log('Eletrônicos caros:', eletronicosCaros);

// Chain com reduce no final
console.log('\n💰 Chain com reduce - receita total por categoria:');
const receitaPorCategoria = vendas
    .map(venda => ({
        categoria: venda.categoria,
        receita: venda.preco * venda.quantidade
    }))
    .reduce((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.receita;
        return acc;
    }, {});

console.log('Receita por categoria:', receitaPorCategoria);

// Chain com slice para limitação
console.log('\n🏆 Chain com slice - top 3 vendas por valor:');
const top3Vendas = vendas
    .map(venda => ({
        ...venda,
        valorTotal: venda.preco * venda.quantidade
    }))
    .sort((a, b) => b.valorTotal - a.valorTotal)
    .slice(0, 3)
    .map(venda => `${venda.produto}: R$ ${venda.valorTotal.toFixed(2)}`);

console.log('Top 3 vendas:', top3Vendas);

// ========== CHAINS COMPLEXOS ==========
console.log('\n--- CHAINS COMPLEXOS ---');

// Chain complexo com múltiplas transformações
console.log('\n🔄 Chain complexo - análise de vendedores:');
const analiseVendedores = vendas
    .filter(venda => venda.quantidade > 2) // Vendas significativas
    .map(venda => ({
        vendedor: venda.vendedor,
        categoria: venda.categoria,
        receita: venda.preco * venda.quantidade,
        margem: venda.preco > 500 ? 'alta' : 'baixa'
    }))
    .reduce((acc, venda) => {
        if (!acc[venda.vendedor]) {
            acc[venda.vendedor] = {
                nome: venda.vendedor,
                totalReceita: 0,
                vendas: 0,
                categorias: new Set(),
                margemAlta: 0
            };
        }
        
        acc[venda.vendedor].totalReceita += venda.receita;
        acc[venda.vendedor].vendas++;
        acc[venda.vendedor].categorias.add(venda.categoria);
        if (venda.margem === 'alta') {
            acc[venda.vendedor].margemAlta++;
        }
        
        return acc;
    }, {})
    // Converter para array e processar
    .let(obj => Object.values(obj)) // Usando método customizado
    .map(vendedor => ({
        ...vendedor,
        categorias: Array.from(vendedor.categorias),
        ticketMedio: vendedor.totalReceita / vendedor.vendas,
        percentualMargemAlta: (vendedor.margemAlta / vendedor.vendas) * 100
    }))
    .sort((a, b) => b.totalReceita - a.totalReceita);

// Método customizado para converter objeto em array no meio do chain
Object.prototype.let = function(fn) {
    return fn(this);
};

console.log('Análise de vendedores:', analiseVendedores);

// Chain com flatMap
console.log('\n🗂️ Chain com flatMap - todas as categorias únicas:');
const todasCategorias = vendas
    .flatMap(venda => [venda.categoria]) // Simula array de categorias
    .filter((categoria, index, array) => array.indexOf(categoria) === index) // Remove duplicatas
    .sort();

console.log('Categorias únicas:', todasCategorias);

// Chain com flat para dados aninhados
console.log('\n📦 Chain com flat - produtos por vendedor:');
const produtosPorVendedor = vendas
    .reduce((acc, venda) => {
        if (!acc[venda.vendedor]) {
            acc[venda.vendedor] = [];
        }
        acc[venda.vendedor].push(venda.produto);
        return acc;
    }, {})
    .let(obj => Object.entries(obj)) // [vendedor, produtos[]]
    .map(([vendedor, produtos]) => produtos.map(produto => ({ vendedor, produto })))
    .flat()
    .slice(0, 10); // Limita para demonstração

console.log('Produtos por vendedor (primeiros 10):', produtosPorVendedor);

// ========== CHAINS COM CONDICIONAIS ==========
console.log('\n--- CHAINS COM CONDICIONAIS ---');

// Chain condicional baseado em parâmetros
function analisarVendas(dados, filtros = {}) {
    let chain = dados.slice(); // Copia array
    
    // Aplicar filtros condicionalmente
    if (filtros.categoria) {
        chain = chain.filter(venda => venda.categoria === filtros.categoria);
    }
    
    if (filtros.precoMinimo) {
        chain = chain.filter(venda => venda.preco >= filtros.precoMinimo);
    }
    
    if (filtros.vendedor) {
        chain = chain.filter(venda => venda.vendedor === filtros.vendedor);
    }
    
    // Transformações sempre aplicadas
    return chain
        .map(venda => ({
            ...venda,
            valorTotal: venda.preco * venda.quantidade
        }))
        .sort((a, b) => b.valorTotal - a.valorTotal)
        .slice(0, filtros.limite || 5);
}

console.log('\n🎯 Chain condicional - eletrônicos da Ana:');
const vendasAnaEletronicos = analisarVendas(vendas, {
    categoria: 'Eletrônicos',
    vendedor: 'Ana',
    limite: 3
});
console.log('Vendas Ana eletrônicos:', vendasAnaEletronicos);

// Chain com operador ternário
console.log('\n❓ Chain com operador ternário:');
const processarPorTipo = (dados, tipo) => dados
    .filter(venda => tipo === 'premium' ? venda.preco > 500 : venda.preco <= 500)
    .map(venda => ({
        produto: venda.produto,
        preco: venda.preco,
        categoria: tipo === 'premium' ? 'Premium' : 'Standard',
        desconto: tipo === 'premium' ? 0.05 : 0.10
    }))
    .map(item => ({
        ...item,
        precoFinal: item.preco * (1 - item.desconto)
    }));

const produtosPremium = processarPorTipo(vendas, 'premium');
const produtosStandard = processarPorTipo(vendas, 'standard');

console.log('Produtos premium:', produtosPremium.length);
console.log('Produtos standard:', produtosStandard.length);

// ========== CHAINS COM AGRUPAMENTO ==========
console.log('\n--- CHAINS COM AGRUPAMENTO ---');

// Agrupamento complexo com chain
console.log('\n📊 Agrupamento complexo - estatísticas por categoria:');
const estatisticasPorCategoria = vendas
    .map(venda => ({
        categoria: venda.categoria,
        receita: venda.preco * venda.quantidade,
        quantidade: venda.quantidade,
        preco: venda.preco
    }))
    .reduce((acc, item) => {
        if (!acc[item.categoria]) {
            acc[item.categoria] = {
                categoria: item.categoria,
                totalReceita: 0,
                totalQuantidade: 0,
                vendas: 0,
                precos: []
            };
        }
        
        acc[item.categoria].totalReceita += item.receita;
        acc[item.categoria].totalQuantidade += item.quantidade;
        acc[item.categoria].vendas++;
        acc[item.categoria].precos.push(item.preco);
        
        return acc;
    }, {})
    .let(obj => Object.values(obj))
    .map(categoria => ({
        ...categoria,
        receitaMedia: categoria.totalReceita / categoria.vendas,
        quantidadeMedia: categoria.totalQuantidade / categoria.vendas,
        precoMedio: categoria.precos.reduce((a, b) => a + b, 0) / categoria.precos.length,
        precoMinimo: Math.min(...categoria.precos),
        precoMaximo: Math.max(...categoria.precos)
    }))
    .map(categoria => {
        delete categoria.precos; // Remove array de preços
        return categoria;
    })
    .sort((a, b) => b.totalReceita - a.totalReceita);

console.log('Estatísticas por categoria:', estatisticasPorCategoria);

// ========== CHAINS COM VALIDAÇÃO ==========
console.log('\n--- CHAINS COM VALIDAÇÃO ---');

// Chain com validação de dados
function processarVendasSeguro(dados) {
    return dados
        .filter(venda => {
            // Validações básicas
            return venda && 
                   typeof venda.preco === 'number' && venda.preco > 0 &&
                   typeof venda.quantidade === 'number' && venda.quantidade > 0 &&
                   typeof venda.produto === 'string' && venda.produto.length > 0;
        })
        .map(venda => {
            try {
                return {
                    id: venda.id || 'N/A',
                    produto: venda.produto.trim(),
                    categoria: venda.categoria || 'Sem categoria',
                    preco: Number(venda.preco.toFixed(2)),
                    quantidade: Math.floor(venda.quantidade),
                    vendedor: venda.vendedor || 'Desconhecido',
                    valorTotal: Number((venda.preco * venda.quantidade).toFixed(2))
                };
            } catch (error) {
                console.warn('Erro ao processar venda:', venda, error);
                return null;
            }
        })
        .filter(venda => venda !== null) // Remove itens com erro
        .sort((a, b) => b.valorTotal - a.valorTotal);
}

console.log('\n🛡️ Chain com validação:');
const vendasSeguras = processarVendasSeguro(vendas);
console.log(`Vendas processadas com segurança: ${vendasSeguras.length}/${vendas.length}`);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Análise de E-commerce
console.log('\n--- EXERCÍCIO 1: SISTEMA DE ANÁLISE DE E-COMMERCE ---');

class EcommerceAnalyzer {
    constructor(dados) {
        this.dados = dados;
    }
    
    // Pipeline de análise de produtos
    analisarProdutos(filtros = {}) {
        return this.dados
            .filter(item => !filtros.categoria || item.categoria === filtros.categoria)
            .filter(item => !filtros.precoMin || item.preco >= filtros.precoMin)
            .filter(item => !filtros.precoMax || item.preco <= filtros.precoMax)
            .map(item => ({
                ...item,
                valorTotal: item.preco * item.quantidade,
                margemLucro: this.calcularMargem(item.preco),
                classificacao: this.classificarProduto(item)
            }))
            .sort((a, b) => b.valorTotal - a.valorTotal);
    }
    
    // Análise de vendedores com performance
    analisarVendedores() {
        return this.dados
            .reduce((acc, venda) => {
                const vendedor = venda.vendedor;
                if (!acc[vendedor]) {
                    acc[vendedor] = {
                        nome: vendedor,
                        vendas: [],
                        totalReceita: 0,
                        totalQuantidade: 0,
                        categorias: new Set()
                    };
                }
                
                acc[vendedor].vendas.push(venda);
                acc[vendedor].totalReceita += venda.preco * venda.quantidade;
                acc[vendedor].totalQuantidade += venda.quantidade;
                acc[vendedor].categorias.add(venda.categoria);
                
                return acc;
            }, {})
            .let(obj => Object.values(obj))
            .map(vendedor => ({
                ...vendedor,
                numeroVendas: vendedor.vendas.length,
                ticketMedio: vendedor.totalReceita / vendedor.vendas.length,
                produtividade: vendedor.totalQuantidade / vendedor.vendas.length,
                diversificacao: vendedor.categorias.size,
                categorias: Array.from(vendedor.categorias)
            }))
            .map(vendedor => {
                delete vendedor.vendas; // Remove array de vendas para economizar memória
                return vendedor;
            })
            .sort((a, b) => b.totalReceita - a.totalReceita);
    }
    
    // Análise de tendências por período
    analisarTendencias(agruparPor = 'categoria') {
        return this.dados
            .map(venda => ({
                chave: venda[agruparPor],
                receita: venda.preco * venda.quantidade,
                quantidade: venda.quantidade,
                preco: venda.preco
            }))
            .reduce((acc, item) => {
                if (!acc[item.chave]) {
                    acc[item.chave] = {
                        nome: item.chave,
                        vendas: 0,
                        receita: 0,
                        quantidade: 0,
                        precos: []
                    };
                }
                
                acc[item.chave].vendas++;
                acc[item.chave].receita += item.receita;
                acc[item.chave].quantidade += item.quantidade;
                acc[item.chave].precos.push(item.preco);
                
                return acc;
            }, {})
            .let(obj => Object.values(obj))
            .map(grupo => ({
                ...grupo,
                receitaMedia: grupo.receita / grupo.vendas,
                quantidadeMedia: grupo.quantidade / grupo.vendas,
                precoMedio: grupo.precos.reduce((a, b) => a + b, 0) / grupo.precos.length,
                amplitude: Math.max(...grupo.precos) - Math.min(...grupo.precos)
            }))
            .map(grupo => {
                delete grupo.precos;
                return grupo;
            })
            .sort((a, b) => b.receita - a.receita);
    }
    
    // Relatório completo com múltiplos chains
    gerarRelatorioCompleto() {
        const produtos = this.analisarProdutos();
        const vendedores = this.analisarVendedores();
        const categorias = this.analisarTendencias('categoria');
        
        // Métricas gerais
        const metricas = this.dados
            .map(venda => venda.preco * venda.quantidade)
            .reduce((acc, receita, index, array) => {
                acc.receitaTotal += receita;
                acc.receitaMaxima = Math.max(acc.receitaMaxima, receita);
                acc.receitaMinima = Math.min(acc.receitaMinima, receita);
                
                if (index === array.length - 1) {
                    acc.receitaMedia = acc.receitaTotal / array.length;
                }
                
                return acc;
            }, { receitaTotal: 0, receitaMaxima: 0, receitaMinima: Infinity, receitaMedia: 0 });
        
        return {
            resumo: {
                totalVendas: this.dados.length,
                ...metricas,
                topProduto: produtos[0]?.produto || 'N/A',
                topVendedor: vendedores[0]?.nome || 'N/A',
                topCategoria: categorias[0]?.nome || 'N/A'
            },
            produtos: produtos.slice(0, 5),
            vendedores: vendedores.slice(0, 3),
            categorias
        };
    }
    
    // Métodos auxiliares
    calcularMargem(preco) {
        if (preco > 1000) return 0.30;
        if (preco > 500) return 0.25;
        if (preco > 100) return 0.20;
        return 0.15;
    }
    
    classificarProduto(produto) {
        const valor = produto.preco * produto.quantidade;
        if (valor > 2000) return 'Premium';
        if (valor > 500) return 'Médio';
        return 'Básico';
    }
}

// Testando analisador de e-commerce
console.log('\n🛒 Testando analisador de e-commerce:');
const analyzer = new EcommerceAnalyzer(vendas);

// Relatório completo
const relatorio = analyzer.gerarRelatorioCompleto();
console.log('\n📊 Relatório completo:');
console.log('Resumo:', relatorio.resumo);
console.log('Top 3 vendedores:', relatorio.vendedores.map(v => `${v.nome}: R$ ${v.totalReceita.toFixed(2)}`));
console.log('Categorias:', relatorio.categorias.map(c => `${c.nome}: R$ ${c.receita.toFixed(2)}`));

// Análise filtrada
const eletronicosAnalise = analyzer.analisarProdutos({ categoria: 'Eletrônicos', precoMin: 100 });
console.log('\n💻 Eletrônicos acima de R$ 100:', eletronicosAnalise.length, 'produtos');

// EXERCÍCIO 2: Sistema de Transformação de Dados
console.log('\n--- EXERCÍCIO 2: SISTEMA DE TRANSFORMAÇÃO DE DADOS ---');

class DataTransformer {
    constructor(dados) {
        this.dados = dados;
        this.pipeline = [];
    }
    
    // Adicionar transformação ao pipeline
    addTransform(nome, funcao) {
        this.pipeline.push({ nome, funcao });
        return this; // Para chaining
    }
    
    // Filtrar dados
    filter(predicado, nome = 'filter') {
        return this.addTransform(nome, dados => dados.filter(predicado));
    }
    
    // Mapear dados
    map(transformacao, nome = 'map') {
        return this.addTransform(nome, dados => dados.map(transformacao));
    }
    
    // Ordenar dados
    sort(comparador, nome = 'sort') {
        return this.addTransform(nome, dados => [...dados].sort(comparador));
    }
    
    // Agrupar dados
    groupBy(chave, nome = 'groupBy') {
        return this.addTransform(nome, dados => {
            return dados.reduce((grupos, item) => {
                const valorChave = typeof chave === 'function' ? chave(item) : item[chave];
                if (!grupos[valorChave]) {
                    grupos[valorChave] = [];
                }
                grupos[valorChave].push(item);
                return grupos;
            }, {});
        });
    }
    
    // Limitar quantidade
    limit(quantidade, nome = 'limit') {
        return this.addTransform(nome, dados => {
            if (Array.isArray(dados)) {
                return dados.slice(0, quantidade);
            } else {
                // Para objetos agrupados
                const entries = Object.entries(dados).slice(0, quantidade);
                return Object.fromEntries(entries);
            }
        });
    }
    
    // Achatar dados agrupados
    flatten(nome = 'flatten') {
        return this.addTransform(nome, dados => {
            if (Array.isArray(dados)) {
                return dados.flat();
            } else {
                // Para objetos agrupados
                return Object.values(dados).flat();
            }
        });
    }
    
    // Agregar dados
    aggregate(agregadores, nome = 'aggregate') {
        return this.addTransform(nome, dados => {
            if (Array.isArray(dados)) {
                return dados.reduce((acc, item) => {
                    Object.entries(agregadores).forEach(([chave, funcao]) => {
                        if (!acc[chave]) acc[chave] = [];
                        acc[chave].push(funcao(item));
                    });
                    return acc;
                }, {});
            } else {
                // Para dados agrupados
                return Object.entries(dados).reduce((acc, [grupo, itens]) => {
                    acc[grupo] = {};
                    Object.entries(agregadores).forEach(([chave, funcao]) => {
                        acc[grupo][chave] = itens.reduce((total, item) => total + funcao(item), 0);
                    });
                    return acc;
                }, {});
            }
        });
    }
    
    // Executar pipeline
    execute() {
        let resultado = this.dados;
        const log = [];
        
        for (const { nome, funcao } of this.pipeline) {
            const antes = Array.isArray(resultado) ? resultado.length : Object.keys(resultado).length;
            resultado = funcao(resultado);
            const depois = Array.isArray(resultado) ? resultado.length : Object.keys(resultado).length;
            
            log.push({
                etapa: nome,
                antes,
                depois,
                tipo: Array.isArray(resultado) ? 'array' : 'object'
            });
        }
        
        return {
            dados: resultado,
            log,
            pipeline: this.pipeline.map(p => p.nome)
        };
    }
    
    // Resetar pipeline
    reset() {
        this.pipeline = [];
        return this;
    }
    
    // Clonar transformer
    clone() {
        const novo = new DataTransformer(this.dados);
        novo.pipeline = [...this.pipeline];
        return novo;
    }
}

// Testando transformer
console.log('\n🔄 Testando data transformer:');

// Pipeline 1: Análise de vendas por vendedor
const transformer1 = new DataTransformer(vendas)
    .filter(venda => venda.preco > 100, 'filtrar_produtos_caros')
    .map(venda => ({
        vendedor: venda.vendedor,
        receita: venda.preco * venda.quantidade,
        categoria: venda.categoria
    }), 'calcular_receita')
    .groupBy('vendedor', 'agrupar_por_vendedor')
    .aggregate({
        totalReceita: item => item.receita,
        totalVendas: () => 1
    }, 'agregar_metricas');

const resultado1 = transformer1.execute();
console.log('\n📈 Pipeline 1 - Vendas por vendedor:');
console.log('Log do pipeline:', resultado1.log);
console.log('Resultado:', resultado1.dados);

// Pipeline 2: Top produtos por categoria
const transformer2 = new DataTransformer(vendas)
    .map(venda => ({
        ...venda,
        valorTotal: venda.preco * venda.quantidade
    }), 'calcular_valor_total')
    .sort((a, b) => b.valorTotal - a.valorTotal, 'ordenar_por_valor')
    .groupBy('categoria', 'agrupar_por_categoria')
    .map(grupos => {
        // Pegar top 2 de cada categoria
        return Object.entries(grupos).reduce((acc, [categoria, produtos]) => {
            acc[categoria] = produtos.slice(0, 2);
            return acc;
        }, {});
    }, 'top_2_por_categoria')
    .flatten('achatar_resultados');

const resultado2 = transformer2.execute();
console.log('\n🏆 Pipeline 2 - Top produtos por categoria:');
console.log('Produtos encontrados:', resultado2.dados.length);
console.log('Pipeline executado:', resultado2.pipeline);

// Pipeline 3: Análise comparativa
const transformer3 = transformer1.clone()
    .reset()
    .filter(venda => venda.categoria === 'Eletrônicos', 'apenas_eletronicos')
    .map(venda => ({
        produto: venda.produto,
        vendedor: venda.vendedor,
        performance: (venda.preco * venda.quantidade) / 1000 // Performance normalizada
    }), 'calcular_performance')
    .sort((a, b) => b.performance - a.performance, 'ordenar_performance')
    .limit(3, 'top_3');

const resultado3 = transformer3.execute();
console.log('\n⚡ Pipeline 3 - Top performance eletrônicos:');
console.log('Top 3:', resultado3.dados);

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA METHOD CHAINING:

1. **Ordem das Operações**
   - Filtrar antes de mapear quando possível
   - Ordenar apenas quando necessário
   - Limitar dados cedo no pipeline
   - Usar early termination

2. **Performance**
   - Evitar chains muito longos
   - Considerar reduce para múltiplas operações
   - Usar for loops para performance crítica
   - Implementar lazy evaluation

3. **Memory Management**
   - Cada método cria novo array
   - Considerar generators para datasets grandes
   - Limpar referências desnecessárias
   - Usar Object.freeze() para imutabilidade

4. **Debugging**
   - Quebrar chains longos em variáveis
   - Usar console.log entre métodos
   - Implementar logging no pipeline
   - Validar dados em cada etapa

5. **Legibilidade**
   - Usar nomes descritivos para funções
   - Quebrar linhas apropriadamente
   - Extrair lógica complexa para funções
   - Documentar pipelines complexos
*/

// Exemplo de otimização
console.log('\n⚡ Exemplo de otimização:');

// ❌ Menos eficiente - múltiplas iterações
function analisarVendasLento(vendas) {
    return vendas
        .map(v => ({ ...v, total: v.preco * v.quantidade })) // Iteração 1
        .filter(v => v.total > 500) // Iteração 2
        .map(v => ({ ...v, categoria: v.categoria.toUpperCase() })) // Iteração 3
        .sort((a, b) => b.total - a.total) // Iteração 4
        .slice(0, 5); // Iteração 5
}

// ✅ Mais eficiente - menos iterações
function analisarVendasRapido(vendas) {
    return vendas
        .reduce((acc, venda) => {
            const total = venda.preco * venda.quantidade;
            if (total > 500) {
                acc.push({
                    ...venda,
                    total,
                    categoria: venda.categoria.toUpperCase()
                });
            }
            return acc;
        }, [])
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);
}

// ✅ Ainda mais eficiente - early termination
function analisarVendasMaisRapido(vendas) {
    const resultado = [];
    const vendasOrdenadas = vendas
        .map(v => ({ ...v, total: v.preco * v.quantidade }))
        .sort((a, b) => b.total - a.total);
    
    for (const venda of vendasOrdenadas) {
        if (venda.total > 500) {
            resultado.push({
                ...venda,
                categoria: venda.categoria.toUpperCase()
            });
            if (resultado.length === 5) break; // Early termination
        }
    }
    
    return resultado;
}

// Testando performance
console.time('Análise lenta');
analisarVendasLento(vendas);
console.timeEnd('Análise lenta');

console.time('Análise rápida');
analisarVendasRapido(vendas);
console.timeEnd('Análise rápida');

console.time('Análise mais rápida');
analisarVendasMaisRapido(vendas);
console.timeEnd('Análise mais rápida');

// Exemplo de debugging de chains
console.log('\n🐛 Debugging de chains:');

function debugChain(dados, nome = 'Chain') {
    console.log(`\n🔍 Debugging ${nome}:`);
    
    return dados
        .filter(item => {
            const resultado = item.preco > 200;
            console.log(`Filter: ${item.produto} (${item.preco}) -> ${resultado}`);
            return resultado;
        })
        .map(item => {
            const novoItem = { ...item, categoria: item.categoria.toUpperCase() };
            console.log(`Map: ${item.produto} -> categoria: ${novoItem.categoria}`);
            return novoItem;
        })
        .slice(0, 2)
        .let(resultado => {
            console.log(`Resultado final: ${resultado.length} itens`);
            return resultado;
        });
}

const debugResult = debugChain(vendas.slice(0, 3), 'Exemplo');

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- MDN Method Chaining: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#method_chaining
- Functional Programming Guide: https://github.com/MostlyAdequate/mostly-adequate-guide

📚 LIVROS RECOMENDADOS:
- "Functional-Light JavaScript" - Kyle Simpson
- "JavaScript Allongé" - Reginald Braithwaite
- "Eloquent JavaScript" - Marijn Haverbeke

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Programação funcional avançada
2. Transducers e composição
3. Lazy evaluation e streams
4. Reactive programming (RxJS)
5. Immutable data structures
6. Performance optimization
7. Functional reactive programming
8. Category theory aplicada

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente um sistema de ETL (Extract, Transform, Load)
2. Crie um motor de consultas SQL-like para arrays
3. Desenvolva um sistema de analytics em tempo real
4. Implemente algoritmos de machine learning com chains
5. Crie um sistema de validação de dados complexos

🔧 FERRAMENTAS ÚTEIS:
- Lodash/FP para programação funcional
- Ramda para composição de funções
- RxJS para reactive programming
- Immutable.js para estruturas imutáveis
- Benchmark.js para testes de performance

⚠️ ARMADILHAS COMUNS:
1. Chains muito longos e complexos
2. Não considerar performance em datasets grandes
3. Criar arrays intermediários desnecessários
4. Não validar dados entre etapas
5. Debugging difícil em chains complexos
6. Não usar early termination quando possível
7. Misturar paradigmas (imperativo vs funcional)
8. Não documentar pipelines complexos

🎓 CONCEITOS AVANÇADOS:
- Transducers
- Lens e optics
- Monads e functors
- Lazy sequences
- Stream processing
- Functional reactive programming
- Category theory
- Type-level programming
*/

console.log('\n✅ Módulo de Encadeamento de Métodos de Arrays concluído!');
console.log('📝 Próximo módulo: 06-DOM');
console.log('🎯 Continue praticando com os exercícios propostos!');

// Limpeza de protótipo customizado
delete Object.prototype.let;

/*
==============================================
RESUMO DO MÓDULO - ENCADEAMENTO DE MÉTODOS
==============================================

✅ CONCEITOS APRENDIDOS:
- Method chaining com arrays
- Pipelines de transformação
- Programação funcional
- Composição de funções
- Fluent interfaces
- Debugging de chains
- Otimização de performance
- Validação de dados

🎯 HABILIDADES DESENVOLVIDAS:
- Criar pipelines eficientes
- Combinar múltiplos métodos
- Implementar transformações complexas
- Otimizar performance de chains
- Debuggar pipelines complexos
- Aplicar programação funcional
- Criar sistemas de análise de dados

📈 PRÓXIMOS DESAFIOS:
- DOM manipulation
- Event handling
- Async programming
- Reactive programming
- Advanced functional programming

==============================================
*/