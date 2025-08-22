/*
========================================
EXERCÍCIOS PRÁTICOS: ARRAYS E MÉTODOS
========================================

Este arquivo contém 3 exercícios práticos para fixar conceitos de:
• Criação e manipulação de arrays
• Métodos nativos (map, filter, reduce, etc.)
• Algoritmos de busca e ordenação
• Processamento de dados
• Análise estatística
• Performance e otimização

Nível: Básico → Intermediário → Avançado

*/

console.log('🔢 EXERCÍCIOS DE ARRAYS E MÉTODOS');
console.log('==================================');

/*
========================================
EXERCÍCIO 1: SISTEMA DE ANÁLISE DE VENDAS
========================================

Crie um sistema para analisar dados de vendas de uma empresa.
O sistema deve processar arrays de vendas e gerar relatórios.

REQUISITOS:
• Calcular totais, médias e estatísticas
• Filtrar vendas por período, vendedor, produto
• Agrupar dados por diferentes critérios
• Identificar top performers e tendências
• Gerar relatórios formatados

NÍVEL: Básico
*/

console.log('\n\n💰 EXERCÍCIO 1: Sistema de Análise de Vendas');
console.log('=============================================');

// Solução do Exercício 1
const SistemaVendas = (() => {
    'use strict';
    
    // Dados de exemplo
    const vendasExemplo = [
        { id: 1, vendedor: 'Ana Silva', produto: 'Notebook', categoria: 'Eletrônicos', valor: 2500, data: '2024-01-15', regiao: 'Sul' },
        { id: 2, vendedor: 'João Santos', produto: 'Mouse', categoria: 'Eletrônicos', valor: 50, data: '2024-01-16', regiao: 'Norte' },
        { id: 3, vendedor: 'Ana Silva', produto: 'Teclado', categoria: 'Eletrônicos', valor: 150, data: '2024-01-17', regiao: 'Sul' },
        { id: 4, vendedor: 'Maria Costa', produto: 'Cadeira', categoria: 'Móveis', valor: 800, data: '2024-01-18', regiao: 'Sudeste' },
        { id: 5, vendedor: 'João Santos', produto: 'Mesa', categoria: 'Móveis', valor: 1200, data: '2024-01-19', regiao: 'Norte' },
        { id: 6, vendedor: 'Pedro Lima', produto: 'Monitor', categoria: 'Eletrônicos', valor: 900, data: '2024-01-20', regiao: 'Centro-Oeste' },
        { id: 7, vendedor: 'Ana Silva', produto: 'Smartphone', categoria: 'Eletrônicos', valor: 1800, data: '2024-01-21', regiao: 'Sul' },
        { id: 8, vendedor: 'Maria Costa', produto: 'Sofá', categoria: 'Móveis', valor: 2200, data: '2024-01-22', regiao: 'Sudeste' },
        { id: 9, vendedor: 'Pedro Lima', produto: 'Tablet', categoria: 'Eletrônicos', valor: 1100, data: '2024-01-23', regiao: 'Centro-Oeste' },
        { id: 10, vendedor: 'João Santos', produto: 'Impressora', categoria: 'Eletrônicos', valor: 600, data: '2024-01-24', regiao: 'Norte' },
        { id: 11, vendedor: 'Ana Silva', produto: 'Webcam', categoria: 'Eletrônicos', valor: 200, data: '2024-01-25', regiao: 'Sul' },
        { id: 12, vendedor: 'Maria Costa', produto: 'Estante', categoria: 'Móveis', valor: 450, data: '2024-01-26', regiao: 'Sudeste' },
        { id: 13, vendedor: 'Pedro Lima', produto: 'Headset', categoria: 'Eletrônicos', valor: 300, data: '2024-01-27', regiao: 'Centro-Oeste' },
        { id: 14, vendedor: 'João Santos', produto: 'Armário', categoria: 'Móveis', valor: 1500, data: '2024-01-28', regiao: 'Norte' },
        { id: 15, vendedor: 'Ana Silva', produto: 'Roteador', categoria: 'Eletrônicos', valor: 250, data: '2024-01-29', regiao: 'Sul' }
    ];
    
    // Utilitários
    const Utils = {
        validarArray: (arr, nome) => {
            if (!Array.isArray(arr)) {
                throw new Error(`${nome} deve ser um array`);
            }
            return arr;
        },
        
        formatarMoeda: (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);
        },
        
        formatarData: (data) => {
            return new Date(data).toLocaleDateString('pt-BR');
        },
        
        calcularPercentual: (parte, total) => {
            return total > 0 ? ((parte / total) * 100).toFixed(2) + '%' : '0%';
        }
    };
    
    // Classe principal
    function AnalisadorVendas(vendas = []) {
        this.vendas = Utils.validarArray(vendas, 'Vendas');
        
        // Estatísticas básicas
        this.calcularEstatisticas = () => {
            if (this.vendas.length === 0) {
                return {
                    total: 0,
                    quantidade: 0,
                    media: 0,
                    mediana: 0,
                    maiorVenda: 0,
                    menorVenda: 0
                };
            }
            
            const valores = this.vendas.map(v => v.valor).sort((a, b) => a - b);
            const total = valores.reduce((sum, valor) => sum + valor, 0);
            const quantidade = valores.length;
            const media = total / quantidade;
            
            // Calcular mediana
            const meio = Math.floor(quantidade / 2);
            const mediana = quantidade % 2 === 0 
                ? (valores[meio - 1] + valores[meio]) / 2
                : valores[meio];
            
            return {
                total,
                quantidade,
                media,
                mediana,
                maiorVenda: Math.max(...valores),
                menorVenda: Math.min(...valores)
            };
        };
        
        // Filtrar vendas
        this.filtrarPor = (criterio, valor) => {
            const vendasFiltradas = this.vendas.filter(venda => {
                switch (criterio) {
                    case 'vendedor':
                        return venda.vendedor.toLowerCase().includes(valor.toLowerCase());
                    case 'produto':
                        return venda.produto.toLowerCase().includes(valor.toLowerCase());
                    case 'categoria':
                        return venda.categoria.toLowerCase() === valor.toLowerCase();
                    case 'regiao':
                        return venda.regiao.toLowerCase() === valor.toLowerCase();
                    case 'valorMinimo':
                        return venda.valor >= valor;
                    case 'valorMaximo':
                        return venda.valor <= valor;
                    case 'periodo':
                        const dataVenda = new Date(venda.data);
                        const dataInicio = new Date(valor.inicio);
                        const dataFim = new Date(valor.fim);
                        return dataVenda >= dataInicio && dataVenda <= dataFim;
                    default:
                        return true;
                }
            });
            
            return new AnalisadorVendas(vendasFiltradas);
        };
        
        // Agrupar vendas
        this.agruparPor = (criterio) => {
            const grupos = this.vendas.reduce((acc, venda) => {
                let chave;
                
                switch (criterio) {
                    case 'vendedor':
                        chave = venda.vendedor;
                        break;
                    case 'categoria':
                        chave = venda.categoria;
                        break;
                    case 'regiao':
                        chave = venda.regiao;
                        break;
                    case 'mes':
                        chave = new Date(venda.data).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
                        break;
                    default:
                        chave = 'Outros';
                }
                
                if (!acc[chave]) {
                    acc[chave] = [];
                }
                acc[chave].push(venda);
                
                return acc;
            }, {});
            
            // Calcular estatísticas para cada grupo
            const resultado = {};
            Object.keys(grupos).forEach(chave => {
                const analisador = new AnalisadorVendas(grupos[chave]);
                resultado[chave] = {
                    vendas: grupos[chave],
                    estatisticas: analisador.calcularEstatisticas()
                };
            });
            
            return resultado;
        };
        
        // Top performers
        this.topVendedores = (limite = 5) => {
            const vendedores = this.agruparPor('vendedor');
            
            return Object.keys(vendedores)
                .map(nome => ({
                    vendedor: nome,
                    ...vendedores[nome].estatisticas
                }))
                .sort((a, b) => b.total - a.total)
                .slice(0, limite);
        };
        
        // Produtos mais vendidos
        this.produtosMaisVendidos = (limite = 5) => {
            const produtos = this.vendas.reduce((acc, venda) => {
                if (!acc[venda.produto]) {
                    acc[venda.produto] = {
                        produto: venda.produto,
                        categoria: venda.categoria,
                        quantidade: 0,
                        valorTotal: 0
                    };
                }
                
                acc[venda.produto].quantidade++;
                acc[venda.produto].valorTotal += venda.valor;
                
                return acc;
            }, {});
            
            return Object.values(produtos)
                .sort((a, b) => b.valorTotal - a.valorTotal)
                .slice(0, limite);
        };
        
        // Análise de tendências
        this.analiseTendencias = () => {
            const vendasPorMes = this.agruparPor('mes');
            const meses = Object.keys(vendasPorMes).sort();
            
            const tendencias = meses.map((mes, index) => {
                const estatisticas = vendasPorMes[mes].estatisticas;
                let crescimento = 0;
                
                if (index > 0) {
                    const mesAnterior = vendasPorMes[meses[index - 1]].estatisticas;
                    crescimento = ((estatisticas.total - mesAnterior.total) / mesAnterior.total) * 100;
                }
                
                return {
                    mes,
                    ...estatisticas,
                    crescimento: crescimento.toFixed(2) + '%'
                };
            });
            
            return tendencias;
        };
        
        // Relatório completo
        this.relatorioCompleto = () => {
            const estatisticas = this.calcularEstatisticas();
            const topVendedores = this.topVendedores(3);
            const produtosMaisVendidos = this.produtosMaisVendidos(3);
            const vendasPorCategoria = this.agruparPor('categoria');
            const vendasPorRegiao = this.agruparPor('regiao');
            const tendencias = this.analiseTendencias();
            
            return {
                resumo: {
                    periodo: {
                        inicio: this.vendas.length > 0 ? Math.min(...this.vendas.map(v => new Date(v.data))) : null,
                        fim: this.vendas.length > 0 ? Math.max(...this.vendas.map(v => new Date(v.data))) : null
                    },
                    estatisticas
                },
                performance: {
                    topVendedores,
                    produtosMaisVendidos
                },
                distribuicao: {
                    categorias: Object.keys(vendasPorCategoria).map(cat => ({
                        categoria: cat,
                        ...vendasPorCategoria[cat].estatisticas,
                        participacao: Utils.calcularPercentual(
                            vendasPorCategoria[cat].estatisticas.total,
                            estatisticas.total
                        )
                    })),
                    regioes: Object.keys(vendasPorRegiao).map(reg => ({
                        regiao: reg,
                        ...vendasPorRegiao[reg].estatisticas,
                        participacao: Utils.calcularPercentual(
                            vendasPorRegiao[reg].estatisticas.total,
                            estatisticas.total
                        )
                    }))
                },
                tendencias
            };
        };
        
        // Exportar dados
        this.exportarCSV = () => {
            if (this.vendas.length === 0) return '';
            
            const cabecalho = Object.keys(this.vendas[0]).join(',');
            const linhas = this.vendas.map(venda => 
                Object.values(venda).join(',')
            );
            
            return [cabecalho, ...linhas].join('\n');
        };
    }
    
    // Interface pública
    return {
        AnalisadorVendas,
        vendasExemplo,
        Utils
    };
})();

// Demonstração e testes
console.log('\n💰 Demonstração do Sistema de Vendas:');

try {
    // Criar analisador com dados de exemplo
    const analisador = new SistemaVendas.AnalisadorVendas(SistemaVendas.vendasExemplo);
    
    // Estatísticas gerais
    console.log('\n📊 ESTATÍSTICAS GERAIS:');
    const stats = analisador.calcularEstatisticas();
    console.log('• Total de vendas:', SistemaVendas.Utils.formatarMoeda(stats.total));
    console.log('• Quantidade de vendas:', stats.quantidade);
    console.log('• Ticket médio:', SistemaVendas.Utils.formatarMoeda(stats.media));
    console.log('• Mediana:', SistemaVendas.Utils.formatarMoeda(stats.mediana));
    console.log('• Maior venda:', SistemaVendas.Utils.formatarMoeda(stats.maiorVenda));
    console.log('• Menor venda:', SistemaVendas.Utils.formatarMoeda(stats.menorVenda));
    
    // Top vendedores
    console.log('\n🏆 TOP VENDEDORES:');
    const topVendedores = analisador.topVendedores(3);
    topVendedores.forEach((vendedor, index) => {
        console.log(`${index + 1}. ${vendedor.vendedor}:`);
        console.log(`   • Total: ${SistemaVendas.Utils.formatarMoeda(vendedor.total)}`);
        console.log(`   • Vendas: ${vendedor.quantidade}`);
        console.log(`   • Ticket médio: ${SistemaVendas.Utils.formatarMoeda(vendedor.media)}`);
    });
    
    // Produtos mais vendidos
    console.log('\n🛍️ PRODUTOS MAIS VENDIDOS:');
    const topProdutos = analisador.produtosMaisVendidos(3);
    topProdutos.forEach((produto, index) => {
        console.log(`${index + 1}. ${produto.produto} (${produto.categoria}):`);
        console.log(`   • Faturamento: ${SistemaVendas.Utils.formatarMoeda(produto.valorTotal)}`);
        console.log(`   • Quantidade vendida: ${produto.quantidade}`);
    });
    
    // Análise por categoria
    console.log('\n📂 VENDAS POR CATEGORIA:');
    const categorias = analisador.agruparPor('categoria');
    Object.keys(categorias).forEach(categoria => {
        const dados = categorias[categoria].estatisticas;
        console.log(`• ${categoria}:`);
        console.log(`  - Total: ${SistemaVendas.Utils.formatarMoeda(dados.total)}`);
        console.log(`  - Vendas: ${dados.quantidade}`);
        console.log(`  - Ticket médio: ${SistemaVendas.Utils.formatarMoeda(dados.media)}`);
    });
    
    // Filtros
    console.log('\n🔍 TESTANDO FILTROS:');
    
    // Filtrar por vendedor
    const vendasAna = analisador.filtrarPor('vendedor', 'Ana Silva');
    const statsAna = vendasAna.calcularEstatisticas();
    console.log('Vendas da Ana Silva:');
    console.log(`• Total: ${SistemaVendas.Utils.formatarMoeda(statsAna.total)}`);
    console.log(`• Quantidade: ${statsAna.quantidade}`);
    
    // Filtrar por categoria
    const vendasEletronicos = analisador.filtrarPor('categoria', 'Eletrônicos');
    const statsEletronicos = vendasEletronicos.calcularEstatisticas();
    console.log('\nVendas de Eletrônicos:');
    console.log(`• Total: ${SistemaVendas.Utils.formatarMoeda(statsEletronicos.total)}`);
    console.log(`• Quantidade: ${statsEletronicos.quantidade}`);
    
    // Filtrar por valor mínimo
    const vendasAltas = analisador.filtrarPor('valorMinimo', 1000);
    const statsAltas = vendasAltas.calcularEstatisticas();
    console.log('\nVendas acima de R$ 1.000:');
    console.log(`• Total: ${SistemaVendas.Utils.formatarMoeda(statsAltas.total)}`);
    console.log(`• Quantidade: ${statsAltas.quantidade}`);
    
    // Relatório completo
    console.log('\n📋 RELATÓRIO COMPLETO:');
    const relatorio = analisador.relatorioCompleto();
    
    console.log('\n📈 Distribuição por Região:');
    relatorio.distribuicao.regioes.forEach(regiao => {
        console.log(`• ${regiao.regiao}: ${SistemaVendas.Utils.formatarMoeda(regiao.total)} (${regiao.participacao})`);
    });
    
    console.log('\n📊 Distribuição por Categoria:');
    relatorio.distribuicao.categorias.forEach(categoria => {
        console.log(`• ${categoria.categoria}: ${SistemaVendas.Utils.formatarMoeda(categoria.total)} (${categoria.participacao})`);
    });
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

console.log('\n✅ Exercício 1 concluído!');

/*
========================================
EXERCÍCIO 2: ALGORITMOS DE ORDENAÇÃO E BUSCA
========================================

Implemente diferentes algoritmos de ordenação e busca.
Compare performance e casos de uso de cada algoritmo.

REQUISITOS:
• Implementar Bubble Sort, Quick Sort, Merge Sort
• Busca linear e binária
• Análise de complexidade
• Benchmark de performance
• Visualização de passos

NÍVEL: Intermediário
*/

console.log('\n\n🔍 EXERCÍCIO 2: Algoritmos de Ordenação e Busca');
console.log('===============================================');

// Solução do Exercício 2
const AlgoritmosArray = (() => {
    'use strict';
    
    // Utilitários
    const Utils = {
        gerarArrayAleatorio: (tamanho, min = 1, max = 1000) => {
            return Array.from({ length: tamanho }, () => 
                Math.floor(Math.random() * (max - min + 1)) + min
            );
        },
        
        medirTempo: (funcao, ...args) => {
            const inicio = performance.now();
            const resultado = funcao(...args);
            const fim = performance.now();
            return {
                resultado,
                tempo: fim - inicio
            };
        },
        
        validarArray: (arr) => {
            if (!Array.isArray(arr)) {
                throw new Error('Parâmetro deve ser um array');
            }
            return [...arr]; // Clonar para não modificar o original
        },
        
        estaOrdenado: (arr) => {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < arr[i - 1]) {
                    return false;
                }
            }
            return true;
        }
    };
    
    // Algoritmos de Ordenação
    const Ordenacao = {
        // Bubble Sort - O(n²)
        bubbleSort: (array, mostrarPassos = false) => {
            const arr = Utils.validarArray(array);
            const passos = [];
            let trocas = 0;
            let comparacoes = 0;
            
            for (let i = 0; i < arr.length - 1; i++) {
                let houveTroca = false;
                
                for (let j = 0; j < arr.length - i - 1; j++) {
                    comparacoes++;
                    
                    if (arr[j] > arr[j + 1]) {
                        // Trocar elementos
                        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        trocas++;
                        houveTroca = true;
                        
                        if (mostrarPassos) {
                            passos.push({
                                passo: passos.length + 1,
                                acao: `Trocou ${arr[j + 1]} com ${arr[j]}`,
                                array: [...arr]
                            });
                        }
                    }
                }
                
                // Otimização: se não houve troca, array já está ordenado
                if (!houveTroca) break;
            }
            
            return {
                arrayOrdenado: arr,
                estatisticas: {
                    algoritmo: 'Bubble Sort',
                    comparacoes,
                    trocas,
                    complexidade: 'O(n²)'
                },
                passos: mostrarPassos ? passos : []
            };
        },
        
        // Quick Sort - O(n log n) médio, O(n²) pior caso
        quickSort: (array, mostrarPassos = false) => {
            const arr = Utils.validarArray(array);
            const passos = [];
            let comparacoes = 0;
            let trocas = 0;
            
            function quickSortRecursivo(arr, inicio, fim) {
                if (inicio < fim) {
                    const indicePivo = particionar(arr, inicio, fim);
                    
                    if (mostrarPassos) {
                        passos.push({
                            passo: passos.length + 1,
                            acao: `Particionou com pivô ${arr[indicePivo]} na posição ${indicePivo}`,
                            array: [...arr],
                            intervalo: [inicio, fim]
                        });
                    }
                    
                    quickSortRecursivo(arr, inicio, indicePivo - 1);
                    quickSortRecursivo(arr, indicePivo + 1, fim);
                }
            }
            
            function particionar(arr, inicio, fim) {
                const pivo = arr[fim];
                let i = inicio - 1;
                
                for (let j = inicio; j < fim; j++) {
                    comparacoes++;
                    
                    if (arr[j] <= pivo) {
                        i++;
                        if (i !== j) {
                            [arr[i], arr[j]] = [arr[j], arr[i]];
                            trocas++;
                        }
                    }
                }
                
                [arr[i + 1], arr[fim]] = [arr[fim], arr[i + 1]];
                trocas++;
                
                return i + 1;
            }
            
            quickSortRecursivo(arr, 0, arr.length - 1);
            
            return {
                arrayOrdenado: arr,
                estatisticas: {
                    algoritmo: 'Quick Sort',
                    comparacoes,
                    trocas,
                    complexidade: 'O(n log n) médio'
                },
                passos: mostrarPassos ? passos : []
            };
        },
        
        // Merge Sort - O(n log n)
        mergeSort: (array, mostrarPassos = false) => {
            const arr = Utils.validarArray(array);
            const passos = [];
            let comparacoes = 0;
            let mesclagens = 0;
            
            function mergeSortRecursivo(arr) {
                if (arr.length <= 1) {
                    return arr;
                }
                
                const meio = Math.floor(arr.length / 2);
                const esquerda = mergeSortRecursivo(arr.slice(0, meio));
                const direita = mergeSortRecursivo(arr.slice(meio));
                
                return mesclar(esquerda, direita);
            }
            
            function mesclar(esquerda, direita) {
                const resultado = [];
                let i = 0, j = 0;
                
                while (i < esquerda.length && j < direita.length) {
                    comparacoes++;
                    
                    if (esquerda[i] <= direita[j]) {
                        resultado.push(esquerda[i]);
                        i++;
                    } else {
                        resultado.push(direita[j]);
                        j++;
                    }
                }
                
                // Adicionar elementos restantes
                while (i < esquerda.length) {
                    resultado.push(esquerda[i]);
                    i++;
                }
                
                while (j < direita.length) {
                    resultado.push(direita[j]);
                    j++;
                }
                
                mesclagens++;
                
                if (mostrarPassos) {
                    passos.push({
                        passo: passos.length + 1,
                        acao: `Mesclou [${esquerda.join(', ')}] com [${direita.join(', ')}]`,
                        resultado: [...resultado]
                    });
                }
                
                return resultado;
            }
            
            const arrayOrdenado = mergeSortRecursivo(arr);
            
            return {
                arrayOrdenado,
                estatisticas: {
                    algoritmo: 'Merge Sort',
                    comparacoes,
                    mesclagens,
                    complexidade: 'O(n log n)'
                },
                passos: mostrarPassos ? passos : []
            };
        }
    };
    
    // Algoritmos de Busca
    const Busca = {
        // Busca Linear - O(n)
        buscaLinear: (array, elemento, mostrarPassos = false) => {
            const arr = Utils.validarArray(array);
            const passos = [];
            let comparacoes = 0;
            
            for (let i = 0; i < arr.length; i++) {
                comparacoes++;
                
                if (mostrarPassos) {
                    passos.push({
                        passo: i + 1,
                        indice: i,
                        valor: arr[i],
                        encontrou: arr[i] === elemento
                    });
                }
                
                if (arr[i] === elemento) {
                    return {
                        encontrado: true,
                        indice: i,
                        valor: arr[i],
                        estatisticas: {
                            algoritmo: 'Busca Linear',
                            comparacoes,
                            complexidade: 'O(n)'
                        },
                        passos: mostrarPassos ? passos : []
                    };
                }
            }
            
            return {
                encontrado: false,
                indice: -1,
                valor: null,
                estatisticas: {
                    algoritmo: 'Busca Linear',
                    comparacoes,
                    complexidade: 'O(n)'
                },
                passos: mostrarPassos ? passos : []
            };
        },
        
        // Busca Binária - O(log n) - Requer array ordenado
        buscaBinaria: (array, elemento, mostrarPassos = false) => {
            const arr = Utils.validarArray(array);
            const passos = [];
            let comparacoes = 0;
            
            if (!Utils.estaOrdenado(arr)) {
                throw new Error('Array deve estar ordenado para busca binária');
            }
            
            let inicio = 0;
            let fim = arr.length - 1;
            
            while (inicio <= fim) {
                const meio = Math.floor((inicio + fim) / 2);
                comparacoes++;
                
                if (mostrarPassos) {
                    passos.push({
                        passo: passos.length + 1,
                        inicio,
                        fim,
                        meio,
                        valorMeio: arr[meio],
                        intervalo: arr.slice(inicio, fim + 1)
                    });
                }
                
                if (arr[meio] === elemento) {
                    return {
                        encontrado: true,
                        indice: meio,
                        valor: arr[meio],
                        estatisticas: {
                            algoritmo: 'Busca Binária',
                            comparacoes,
                            complexidade: 'O(log n)'
                        },
                        passos: mostrarPassos ? passos : []
                    };
                }
                
                if (arr[meio] < elemento) {
                    inicio = meio + 1;
                } else {
                    fim = meio - 1;
                }
            }
            
            return {
                encontrado: false,
                indice: -1,
                valor: null,
                estatisticas: {
                    algoritmo: 'Busca Binária',
                    comparacoes,
                    complexidade: 'O(log n)'
                },
                passos: mostrarPassos ? passos : []
            };
        }
    };
    
    // Benchmark de Performance
    const Benchmark = {
        compararOrdenacao: (tamanhos = [100, 500, 1000]) => {
            const resultados = [];
            
            tamanhos.forEach(tamanho => {
                console.log(`\n📊 Testando com ${tamanho} elementos:`);
                
                const arrayTeste = Utils.gerarArrayAleatorio(tamanho);
                
                // Bubble Sort
                const bubbleResult = Utils.medirTempo(
                    () => Ordenacao.bubbleSort(arrayTeste)
                );
                
                // Quick Sort
                const quickResult = Utils.medirTempo(
                    () => Ordenacao.quickSort(arrayTeste)
                );
                
                // Merge Sort
                const mergeResult = Utils.medirTempo(
                    () => Ordenacao.mergeSort(arrayTeste)
                );
                
                const resultado = {
                    tamanho,
                    bubbleSort: {
                        tempo: bubbleResult.tempo.toFixed(2) + 'ms',
                        comparacoes: bubbleResult.resultado.estatisticas.comparacoes
                    },
                    quickSort: {
                        tempo: quickResult.tempo.toFixed(2) + 'ms',
                        comparacoes: quickResult.resultado.estatisticas.comparacoes
                    },
                    mergeSort: {
                        tempo: mergeResult.tempo.toFixed(2) + 'ms',
                        comparacoes: mergeResult.resultado.estatisticas.comparacoes
                    }
                };
                
                resultados.push(resultado);
                
                console.log('• Bubble Sort:', resultado.bubbleSort.tempo, `(${resultado.bubbleSort.comparacoes} comparações)`);
                console.log('• Quick Sort:', resultado.quickSort.tempo, `(${resultado.quickSort.comparacoes} comparações)`);
                console.log('• Merge Sort:', resultado.mergeSort.tempo, `(${resultado.mergeSort.comparacoes} comparações)`);
            });
            
            return resultados;
        },
        
        compararBusca: (tamanho = 1000, elemento = null) => {
            const arrayTeste = Utils.gerarArrayAleatorio(tamanho).sort((a, b) => a - b);
            const elementoBusca = elemento || arrayTeste[Math.floor(Math.random() * arrayTeste.length)];
            
            console.log(`\n🔍 Comparando busca por ${elementoBusca} em array de ${tamanho} elementos:`);
            
            // Busca Linear
            const linearResult = Utils.medirTempo(
                () => Busca.buscaLinear(arrayTeste, elementoBusca)
            );
            
            // Busca Binária
            const binariaResult = Utils.medirTempo(
                () => Busca.buscaBinaria(arrayTeste, elementoBusca)
            );
            
            const resultado = {
                elemento: elementoBusca,
                tamanho,
                buscaLinear: {
                    tempo: linearResult.tempo.toFixed(2) + 'ms',
                    comparacoes: linearResult.resultado.estatisticas.comparacoes,
                    encontrado: linearResult.resultado.encontrado
                },
                buscaBinaria: {
                    tempo: binariaResult.tempo.toFixed(2) + 'ms',
                    comparacoes: binariaResult.resultado.estatisticas.comparacoes,
                    encontrado: binariaResult.resultado.encontrado
                }
            };
            
            console.log('• Busca Linear:', resultado.buscaLinear.tempo, `(${resultado.buscaLinear.comparacoes} comparações)`);
            console.log('• Busca Binária:', resultado.buscaBinaria.tempo, `(${resultado.buscaBinaria.comparacoes} comparações)`);
            
            return resultado;
        }
    };
    
    // Interface pública
    return {
        Ordenacao,
        Busca,
        Benchmark,
        Utils
    };
})();

// Demonstração e testes
console.log('\n🔍 Demonstração dos Algoritmos:');

try {
    // Array de teste
    const arrayTeste = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
    console.log('\n📋 Array original:', arrayTeste);
    
    // Testar algoritmos de ordenação
    console.log('\n🔄 TESTANDO ALGORITMOS DE ORDENAÇÃO:');
    
    // Bubble Sort com passos
    console.log('\n🫧 Bubble Sort:');
    const bubbleResult = AlgoritmosArray.Ordenacao.bubbleSort(arrayTeste, true);
    console.log('• Resultado:', bubbleResult.arrayOrdenado);
    console.log('• Estatísticas:', bubbleResult.estatisticas);
    console.log('• Primeiros 3 passos:');
    bubbleResult.passos.slice(0, 3).forEach(passo => {
        console.log(`  ${passo.passo}. ${passo.acao}`);
    });
    
    // Quick Sort
    console.log('\n⚡ Quick Sort:');
    const quickResult = AlgoritmosArray.Ordenacao.quickSort(arrayTeste);
    console.log('• Resultado:', quickResult.arrayOrdenado);
    console.log('• Estatísticas:', quickResult.estatisticas);
    
    // Merge Sort
    console.log('\n🔀 Merge Sort:');
    const mergeResult = AlgoritmosArray.Ordenacao.mergeSort(arrayTeste);
    console.log('• Resultado:', mergeResult.arrayOrdenado);
    console.log('• Estatísticas:', mergeResult.estatisticas);
    
    // Testar algoritmos de busca
    console.log('\n🔍 TESTANDO ALGORITMOS DE BUSCA:');
    
    const arrayOrdenado = [11, 12, 22, 25, 34, 42, 50, 64, 76, 88, 90];
    const elementoBusca = 42;
    
    console.log('\n📋 Array ordenado:', arrayOrdenado);
    console.log('🎯 Buscando elemento:', elementoBusca);
    
    // Busca Linear
    console.log('\n📍 Busca Linear:');
    const linearResult = AlgoritmosArray.Busca.buscaLinear(arrayOrdenado, elementoBusca, true);
    console.log('• Encontrado:', linearResult.encontrado);
    console.log('• Índice:', linearResult.indice);
    console.log('• Estatísticas:', linearResult.estatisticas);
    console.log('• Passos:', linearResult.passos.length);
    
    // Busca Binária
    console.log('\n🎯 Busca Binária:');
    const binariaResult = AlgoritmosArray.Busca.buscaBinaria(arrayOrdenado, elementoBusca, true);
    console.log('• Encontrado:', binariaResult.encontrado);
    console.log('• Índice:', binariaResult.indice);
    console.log('• Estatísticas:', binariaResult.estatisticas);
    console.log('• Passos da busca binária:');
    binariaResult.passos.forEach(passo => {
        console.log(`  ${passo.passo}. Meio=${passo.meio} (${passo.valorMeio}), Intervalo=[${passo.inicio}, ${passo.fim}]`);
    });
    
    // Benchmark de performance
    console.log('\n⚡ BENCHMARK DE PERFORMANCE:');
    
    console.log('\n🏁 Comparação de Ordenação:');
    AlgoritmosArray.Benchmark.compararOrdenacao([100, 500]);
    
    console.log('\n🏁 Comparação de Busca:');
    AlgoritmosArray.Benchmark.compararBusca(1000);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

console.log('\n✅ Exercício 2 concluído!');

/*
========================================
EXERCÍCIO 3: PROCESSADOR DE DADOS AVANÇADO
========================================

Crie um sistema avançado para processar grandes volumes de dados.
Implemente operações funcionais, pipeline de transformações e análises estatísticas.

REQUISITOS:
• Pipeline de transformações com map, filter, reduce
• Análise estatística avançada
• Processamento em lotes (chunks)
• Operações funcionais (curry, compose)
• Sistema de cache inteligente
• Validação e sanitização de dados

NÍVEL: Avançado
*/

console.log('\n\n📊 EXERCÍCIO 3: Processador de Dados Avançado');
console.log('==============================================');

// Solução do Exercício 3
const ProcessadorDados = (() => {
    'use strict';
    
    // Utilitários funcionais
    const FuncUtils = {
        // Curry - transforma função de múltiplos parâmetros em sequência de funções
        curry: (fn) => {
            return function curried(...args) {
                if (args.length >= fn.length) {
                    return fn.apply(this, args);
                } else {
                    return function(...args2) {
                        return curried.apply(this, args.concat(args2));
                    };
                }
            };
        },
        
        // Compose - combina funções da direita para esquerda
        compose: (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value),
        
        // Pipe - combina funções da esquerda para direita
        pipe: (...fns) => (value) => fns.reduce((acc, fn) => fn(acc), value),
        
        // Debounce - limita execução de função
        debounce: (fn, delay) => {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn.apply(this, args), delay);
            };
        },
        
        // Memoização - cache de resultados
        memoize: (fn) => {
            const cache = new Map();
            return function(...args) {
                const key = JSON.stringify(args);
                if (cache.has(key)) {
                    return cache.get(key);
                }
                const result = fn.apply(this, args);
                cache.set(key, result);
                return result;
            };
        }
    };
    
    // Sistema de validação
    const Validador = {
        tipos: {
            numero: (valor) => typeof valor === 'number' && !isNaN(valor),
            string: (valor) => typeof valor === 'string',
            array: (valor) => Array.isArray(valor),
            objeto: (valor) => typeof valor === 'object' && valor !== null && !Array.isArray(valor),
            email: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor),
            cpf: (valor) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(valor),
            telefone: (valor) => /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(valor)
        },
        
        validar: (dados, esquema) => {
            const erros = [];
            
            Object.keys(esquema).forEach(campo => {
                const regras = esquema[campo];
                const valor = dados[campo];
                
                // Verificar se é obrigatório
                if (regras.obrigatorio && (valor === undefined || valor === null || valor === '')) {
                    erros.push(`Campo '${campo}' é obrigatório`);
                    return;
                }
                
                // Verificar tipo se valor existe
                if (valor !== undefined && valor !== null && valor !== '') {
                    if (regras.tipo && !Validador.tipos[regras.tipo](valor)) {
                        erros.push(`Campo '${campo}' deve ser do tipo ${regras.tipo}`);
                    }
                    
                    // Verificar valor mínimo/máximo
                    if (regras.min !== undefined && valor < regras.min) {
                        erros.push(`Campo '${campo}' deve ser maior ou igual a ${regras.min}`);
                    }
                    
                    if (regras.max !== undefined && valor > regras.max) {
                        erros.push(`Campo '${campo}' deve ser menor ou igual a ${regras.max}`);
                    }
                    
                    // Verificar comprimento
                    if (regras.minLength !== undefined && valor.length < regras.minLength) {
                        erros.push(`Campo '${campo}' deve ter pelo menos ${regras.minLength} caracteres`);
                    }
                    
                    if (regras.maxLength !== undefined && valor.length > regras.maxLength) {
                        erros.push(`Campo '${campo}' deve ter no máximo ${regras.maxLength} caracteres`);
                    }
                }
            });
            
            return {
                valido: erros.length === 0,
                erros
            };
        },
        
        sanitizar: (dados, esquema) => {
            const dadosLimpos = { ...dados };
            
            Object.keys(esquema).forEach(campo => {
                const regras = esquema[campo];
                let valor = dadosLimpos[campo];
                
                if (valor !== undefined && valor !== null) {
                    // Trim em strings
                    if (typeof valor === 'string') {
                        valor = valor.trim();
                    }
                    
                    // Converter tipos
                    if (regras.converter) {
                        switch (regras.converter) {
                            case 'numero':
                                valor = Number(valor);
                                break;
                            case 'string':
                                valor = String(valor);
                                break;
                            case 'maiuscula':
                                valor = valor.toUpperCase();
                                break;
                            case 'minuscula':
                                valor = valor.toLowerCase();
                                break;
                        }
                    }
                    
                    dadosLimpos[campo] = valor;
                }
            });
            
            return dadosLimpos;
        }
    };
    
    // Análise estatística avançada
    const Estatisticas = {
        basicas: (dados) => {
            if (!Array.isArray(dados) || dados.length === 0) {
                return null;
            }
            
            const numeros = dados.filter(n => typeof n === 'number' && !isNaN(n)).sort((a, b) => a - b);
            
            if (numeros.length === 0) {
                return null;
            }
            
            const soma = numeros.reduce((acc, n) => acc + n, 0);
            const media = soma / numeros.length;
            
            // Mediana
            const meio = Math.floor(numeros.length / 2);
            const mediana = numeros.length % 2 === 0
                ? (numeros[meio - 1] + numeros[meio]) / 2
                : numeros[meio];
            
            // Moda
            const frequencias = {};
            numeros.forEach(n => {
                frequencias[n] = (frequencias[n] || 0) + 1;
            });
            
            const maxFreq = Math.max(...Object.values(frequencias));
            const modas = Object.keys(frequencias)
                .filter(n => frequencias[n] === maxFreq)
                .map(Number);
            
            // Desvio padrão
            const variancia = numeros.reduce((acc, n) => acc + Math.pow(n - media, 2), 0) / numeros.length;
            const desvioPadrao = Math.sqrt(variancia);
            
            // Quartis
            const q1Index = Math.floor(numeros.length * 0.25);
            const q3Index = Math.floor(numeros.length * 0.75);
            const q1 = numeros[q1Index];
            const q3 = numeros[q3Index];
            const iqr = q3 - q1;
            
            return {
                quantidade: numeros.length,
                soma,
                media,
                mediana,
                moda: modas.length === 1 ? modas[0] : modas,
                minimo: numeros[0],
                maximo: numeros[numeros.length - 1],
                amplitude: numeros[numeros.length - 1] - numeros[0],
                variancia,
                desvioPadrao,
                quartis: { q1, q3, iqr },
                outliers: Estatisticas.detectarOutliers(numeros)
            };
        },
        
        detectarOutliers: (dados) => {
            const numeros = dados.sort((a, b) => a - b);
            const q1Index = Math.floor(numeros.length * 0.25);
            const q3Index = Math.floor(numeros.length * 0.75);
            const q1 = numeros[q1Index];
            const q3 = numeros[q3Index];
            const iqr = q3 - q1;
            
            const limiteBaixo = q1 - 1.5 * iqr;
            const limiteAlto = q3 + 1.5 * iqr;
            
            return numeros.filter(n => n < limiteBaixo || n > limiteAlto);
        },
        
        correlacao: (x, y) => {
            if (x.length !== y.length || x.length === 0) {
                return null;
            }
            
            const n = x.length;
            const mediaX = x.reduce((a, b) => a + b) / n;
            const mediaY = y.reduce((a, b) => a + b) / n;
            
            let numerador = 0;
            let denominadorX = 0;
            let denominadorY = 0;
            
            for (let i = 0; i < n; i++) {
                const diffX = x[i] - mediaX;
                const diffY = y[i] - mediaY;
                
                numerador += diffX * diffY;
                denominadorX += diffX * diffX;
                denominadorY += diffY * diffY;
            }
            
            const denominador = Math.sqrt(denominadorX * denominadorY);
            
            return denominador === 0 ? 0 : numerador / denominador;
        }
    };
    
    // Processador principal
    class ProcessadorAvancado {
        constructor() {
            this.cache = new Map();
            this.pipeline = [];
            this.dados = [];
        }
        
        // Carregar dados
        carregar(dados) {
            if (!Array.isArray(dados)) {
                throw new Error('Dados devem ser um array');
            }
            this.dados = [...dados];
            return this;
        }
        
        // Adicionar transformação ao pipeline
        transformar(funcao, nome = 'transformacao') {
            this.pipeline.push({ funcao, nome });
            return this;
        }
        
        // Filtrar dados
        filtrar(predicado, nome = 'filtro') {
            this.pipeline.push({
                funcao: (dados) => dados.filter(predicado),
                nome
            });
            return this;
        }
        
        // Mapear dados
        mapear(transformacao, nome = 'mapeamento') {
            this.pipeline.push({
                funcao: (dados) => dados.map(transformacao),
                nome
            });
            return this;
        }
        
        // Reduzir dados
        reduzir(reducao, valorInicial, nome = 'reducao') {
            this.pipeline.push({
                funcao: (dados) => dados.reduce(reducao, valorInicial),
                nome
            });
            return this;
        }
        
        // Agrupar dados
        agrupar(chave, nome = 'agrupamento') {
            this.pipeline.push({
                funcao: (dados) => {
                    return dados.reduce((grupos, item) => {
                        const valorChave = typeof chave === 'function' ? chave(item) : item[chave];
                        if (!grupos[valorChave]) {
                            grupos[valorChave] = [];
                        }
                        grupos[valorChave].push(item);
                        return grupos;
                    }, {});
                },
                nome
            });
            return this;
        }
        
        // Ordenar dados
        ordenar(comparador, nome = 'ordenacao') {
            this.pipeline.push({
                funcao: (dados) => [...dados].sort(comparador),
                nome
            });
            return this;
        }
        
        // Processar em lotes
        processarLotes(tamanhoLote = 100) {
            const lotes = [];
            for (let i = 0; i < this.dados.length; i += tamanhoLote) {
                lotes.push(this.dados.slice(i, i + tamanhoLote));
            }
            
            return lotes.map(lote => {
                let resultado = lote;
                this.pipeline.forEach(etapa => {
                    resultado = etapa.funcao(resultado);
                });
                return resultado;
            });
        }
        
        // Executar pipeline
        executar(usarCache = true) {
            const chaveCache = JSON.stringify({
                dados: this.dados,
                pipeline: this.pipeline.map(p => p.nome)
            });
            
            if (usarCache && this.cache.has(chaveCache)) {
                return this.cache.get(chaveCache);
            }
            
            let resultado = this.dados;
            const historico = [{ etapa: 'inicial', dados: [...resultado] }];
            
            this.pipeline.forEach(etapa => {
                resultado = etapa.funcao(resultado);
                historico.push({
                    etapa: etapa.nome,
                    dados: Array.isArray(resultado) ? [...resultado] : resultado
                });
            });
            
            const resultadoFinal = {
                resultado,
                historico,
                estatisticas: Array.isArray(resultado) && resultado.every(n => typeof n === 'number')
                    ? Estatisticas.basicas(resultado)
                    : null
            };
            
            if (usarCache) {
                this.cache.set(chaveCache, resultadoFinal);
            }
            
            return resultadoFinal;
        }
        
        // Limpar pipeline
        limpar() {
            this.pipeline = [];
            return this;
        }
        
        // Validar dados
        validar(esquema) {
            const resultados = this.dados.map((item, index) => {
                const validacao = Validador.validar(item, esquema);
                return {
                    index,
                    item,
                    ...validacao
                };
            });
            
            const validos = resultados.filter(r => r.valido);
            const invalidos = resultados.filter(r => !r.valido);
            
            return {
                total: resultados.length,
                validos: validos.length,
                invalidos: invalidos.length,
                percentualValidos: ((validos.length / resultados.length) * 100).toFixed(2) + '%',
                erros: invalidos.map(r => ({ index: r.index, erros: r.erros })),
                dadosValidos: validos.map(r => r.item)
            };
        }
        
        // Sanitizar dados
        sanitizar(esquema) {
            this.dados = this.dados.map(item => Validador.sanitizar(item, esquema));
            return this;
        }
        
        // Análise estatística
        analisar() {
            if (this.dados.length === 0) {
                return null;
            }
            
            // Detectar tipos de campos
            const campos = {};
            this.dados.forEach(item => {
                Object.keys(item).forEach(campo => {
                    if (!campos[campo]) {
                        campos[campo] = {
                            nome: campo,
                            valores: [],
                            tipos: new Set()
                        };
                    }
                    
                    campos[campo].valores.push(item[campo]);
                    campos[campo].tipos.add(typeof item[campo]);
                });
            });
            
            // Analisar cada campo
            const analise = {};
            Object.keys(campos).forEach(nomeCampo => {
                const campo = campos[nomeCampo];
                const tiposUnicos = Array.from(campo.tipos);
                
                analise[nomeCampo] = {
                    nome: nomeCampo,
                    tipos: tiposUnicos,
                    quantidade: campo.valores.length,
                    valoresUnicos: new Set(campo.valores).size,
                    nulos: campo.valores.filter(v => v === null || v === undefined).length
                };
                
                // Análise específica para números
                const numeros = campo.valores.filter(v => typeof v === 'number' && !isNaN(v));
                if (numeros.length > 0) {
                    analise[nomeCampo].estatisticasNumericas = Estatisticas.basicas(numeros);
                }
                
                // Análise específica para strings
                const strings = campo.valores.filter(v => typeof v === 'string');
                if (strings.length > 0) {
                    const comprimentos = strings.map(s => s.length);
                    analise[nomeCampo].estatisticasTexto = {
                        quantidade: strings.length,
                        comprimentoMedio: comprimentos.reduce((a, b) => a + b, 0) / comprimentos.length,
                        comprimentoMinimo: Math.min(...comprimentos),
                        comprimentoMaximo: Math.max(...comprimentos),
                        vazios: strings.filter(s => s.trim() === '').length
                    };
                }
            });
            
            return {
                totalRegistros: this.dados.length,
                totalCampos: Object.keys(campos).length,
                campos: analise,
                resumo: {
                    camposNumericos: Object.values(analise).filter(c => c.estatisticasNumericas).length,
                    camposTexto: Object.values(analise).filter(c => c.estatisticasTexto).length,
                    camposComNulos: Object.values(analise).filter(c => c.nulos > 0).length
                }
            };
        }
    }
    
    // Interface pública
    return {
        ProcessadorAvancado,
        FuncUtils,
        Validador,
        Estatisticas
    };
})();

// Demonstração e testes
console.log('\n📊 Demonstração do Processador de Dados:');

try {
    // Dados de exemplo - vendas de e-commerce
    const dadosVendas = [
        { id: 1, produto: 'Notebook', categoria: 'Eletrônicos', preco: 2500, quantidade: 2, vendedor: 'Ana', regiao: 'Sul', data: '2024-01-15' },
        { id: 2, produto: 'Mouse', categoria: 'Eletrônicos', preco: 50, quantidade: 10, vendedor: 'João', regiao: 'Norte', data: '2024-01-16' },
        { id: 3, produto: 'Teclado', categoria: 'Eletrônicos', preco: 150, quantidade: 5, vendedor: 'Ana', regiao: 'Sul', data: '2024-01-17' },
        { id: 4, produto: 'Cadeira', categoria: 'Móveis', preco: 800, quantidade: 3, vendedor: 'Maria', regiao: 'Sudeste', data: '2024-01-18' },
        { id: 5, produto: 'Mesa', categoria: 'Móveis', preco: 1200, quantidade: 1, vendedor: 'João', regiao: 'Norte', data: '2024-01-19' },
        { id: 6, produto: 'Monitor', categoria: 'Eletrônicos', preco: 900, quantidade: 4, vendedor: 'Pedro', regiao: 'Centro-Oeste', data: '2024-01-20' },
        { id: 7, produto: 'Smartphone', categoria: 'Eletrônicos', preco: 1800, quantidade: 2, vendedor: 'Ana', regiao: 'Sul', data: '2024-01-21' },
        { id: 8, produto: 'Sofá', categoria: 'Móveis', preco: 2200, quantidade: 1, vendedor: 'Maria', regiao: 'Sudeste', data: '2024-01-22' },
        { id: 9, produto: 'Tablet', categoria: 'Eletrônicos', preco: 1100, quantidade: 3, vendedor: 'Pedro', regiao: 'Centro-Oeste', data: '2024-01-23' },
        { id: 10, produto: 'Impressora', categoria: 'Eletrônicos', preco: 600, quantidade: 2, vendedor: 'João', regiao: 'Norte', data: '2024-01-24' }
    ];
    
    // Criar processador
    const processador = new ProcessadorDados.ProcessadorAvancado();
    
    // Análise inicial dos dados
    console.log('\n🔍 ANÁLISE INICIAL DOS DADOS:');
    const analiseInicial = processador.carregar(dadosVendas).analisar();
    console.log('• Total de registros:', analiseInicial.totalRegistros);
    console.log('• Total de campos:', analiseInicial.totalCampos);
    console.log('• Campos numéricos:', analiseInicial.resumo.camposNumericos);
    console.log('• Campos de texto:', analiseInicial.resumo.camposTexto);
    
    // Análise detalhada do campo preço
    const estatisticasPreco = analiseInicial.campos.preco.estatisticasNumericas;
    console.log('\n💰 Estatísticas de Preço:');
    console.log('• Média:', estatisticasPreco.media.toFixed(2));
    console.log('• Mediana:', estatisticasPreco.mediana);
    console.log('• Desvio padrão:', estatisticasPreco.desvioPadrao.toFixed(2));
    console.log('• Amplitude:', estatisticasPreco.amplitude);
    
    // Pipeline de transformações
    console.log('\n🔄 PIPELINE DE TRANSFORMAÇÕES:');
    
    const resultado1 = processador
        .limpar()
        .carregar(dadosVendas)
        .mapear(item => ({ ...item, faturamento: item.preco * item.quantidade }), 'calcular-faturamento')
        .filtrar(item => item.categoria === 'Eletrônicos', 'filtrar-eletronicos')
        .ordenar((a, b) => b.faturamento - a.faturamento, 'ordenar-por-faturamento')
        .executar();
    
    console.log('• Eletrônicos ordenados por faturamento:');
    resultado1.resultado.slice(0, 3).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.produto}: R$ ${item.faturamento}`);
    });
    
    // Agrupamento e análise
    console.log('\n📊 AGRUPAMENTO POR VENDEDOR:');
    
    const resultado2 = processador
        .limpar()
        .carregar(dadosVendas)
        .mapear(item => ({ ...item, faturamento: item.preco * item.quantidade }))
        .agrupar('vendedor')
        .executar();
    
    Object.keys(resultado2.resultado).forEach(vendedor => {
        const vendas = resultado2.resultado[vendedor];
        const totalFaturamento = vendas.reduce((sum, v) => sum + v.faturamento, 0);
        console.log(`• ${vendedor}: ${vendas.length} vendas, R$ ${totalFaturamento}`);
    });
    
    // Operações funcionais avançadas
    console.log('\n🧮 OPERAÇÕES FUNCIONAIS:');
    
    // Curry - função para calcular desconto
    const calcularDesconto = ProcessadorDados.FuncUtils.curry((percentual, valor) => {
        return valor * (1 - percentual / 100);
    });
    
    const desconto10 = calcularDesconto(10);
    const desconto20 = calcularDesconto(20);
    
    console.log('• Preço original: R$ 1000');
    console.log('• Com 10% desconto:', desconto10(1000));
    console.log('• Com 20% desconto:', desconto20(1000));
    
    // Compose - pipeline de transformações
    const processarPreco = ProcessadorDados.FuncUtils.compose(
        preco => preco.toFixed(2),
        preco => preco * 1.1, // adicionar taxa
        preco => preco * 0.9  // aplicar desconto
    );
    
    console.log('• Preço processado (desconto + taxa):', processarPreco(1000));
    
    // Validação de dados
    console.log('\n✅ VALIDAÇÃO DE DADOS:');
    
    const esquemaValidacao = {
        id: { obrigatorio: true, tipo: 'numero', min: 1 },
        produto: { obrigatorio: true, tipo: 'string', minLength: 2, maxLength: 50 },
        preco: { obrigatorio: true, tipo: 'numero', min: 0 },
        quantidade: { obrigatorio: true, tipo: 'numero', min: 1 },
        vendedor: { obrigatorio: true, tipo: 'string', minLength: 2 }
    };
    
    const validacao = processador.validar(esquemaValidacao);
    console.log('• Total de registros:', validacao.total);
    console.log('• Registros válidos:', validacao.validos);
    console.log('• Percentual válido:', validacao.percentualValidos);
    
    // Processamento em lotes
    console.log('\n📦 PROCESSAMENTO EM LOTES:');
    
    const lotes = processador
        .limpar()
        .mapear(item => ({ ...item, faturamento: item.preco * item.quantidade }))
        .filtrar(item => item.faturamento > 500)
        .processarLotes(3);
    
    console.log('• Número de lotes:', lotes.length);
    lotes.forEach((lote, index) => {
        console.log(`• Lote ${index + 1}: ${lote.length} itens`);
    });
    
    // Análise de correlação
    console.log('\n📈 ANÁLISE DE CORRELAÇÃO:');
    
    const precos = dadosVendas.map(v => v.preco);
    const quantidades = dadosVendas.map(v => v.quantidade);
    const correlacao = ProcessadorDados.Estatisticas.correlacao(precos, quantidades);
    
    console.log('• Correlação preço x quantidade:', correlacao.toFixed(3));
    
    if (correlacao > 0.7) {
        console.log('• Correlação forte positiva');
    } else if (correlacao > 0.3) {
        console.log('• Correlação moderada positiva');
    } else if (correlacao > -0.3) {
        console.log('• Correlação fraca');
    } else if (correlacao > -0.7) {
        console.log('• Correlação moderada negativa');
    } else {
        console.log('• Correlação forte negativa');
    }
    
    // Detecção de outliers
    console.log('\n🎯 DETECÇÃO DE OUTLIERS:');
    
    const outliers = ProcessadorDados.Estatisticas.detectarOutliers(precos);
    console.log('• Outliers encontrados:', outliers.length);
    if (outliers.length > 0) {
        console.log('• Valores:', outliers);
    }
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

console.log('\n✅ Exercício 3 concluído!');

/*
========================================
CONCEITOS APLICADOS
========================================

1. MÉTODOS DE ARRAY NATIVOS:
   • map() - transformação de elementos
   • filter() - filtragem com predicados
   • reduce() - agregação e acumulação
   • sort() - ordenação com comparadores
   • forEach() - iteração com efeitos colaterais
   • find() - busca de elemento específico
   • some() / every() - verificações booleanas

2. ALGORITMOS DE ORDENAÇÃO:
   • Bubble Sort - O(n²) - simples, educativo
   • Quick Sort - O(n log n) - eficiente, recursivo
   • Merge Sort - O(n log n) - estável, divide-e-conquista

3. ALGORITMOS DE BUSCA:
   • Busca Linear - O(n) - simples, qualquer array
   • Busca Binária - O(log n) - eficiente, array ordenado

4. PROGRAMAÇÃO FUNCIONAL:
   • Curry - transformação de funções
   • Compose/Pipe - combinação de funções
   • Memoização - cache de resultados
   • Imutabilidade - preservação de dados originais

5. ANÁLISE ESTATÍSTICA:
   • Medidas de tendência central (média, mediana, moda)
   • Medidas de dispersão (desvio padrão, variância)
   • Quartis e detecção de outliers
   • Correlação entre variáveis

6. PROCESSAMENTO DE DADOS:
   • Pipeline de transformações
   • Validação e sanitização
   • Processamento em lotes
   • Cache inteligente

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. PERFORMANCE:
   • Clonagem de arrays para preservar originais
   • Memoização para cache de resultados
   • Processamento em lotes para grandes volumes
   • Algoritmos eficientes para ordenação/busca

2. LEGIBILIDADE:
   • Nomes descritivos para funções e variáveis
   • Separação de responsabilidades
   • Comentários explicativos
   • Estrutura modular

3. MANUTENIBILIDADE:
   • Funções puras sem efeitos colaterais
   • Validação de entrada
   • Tratamento de erros
   • Interface consistente

4. FLEXIBILIDADE:
   • Pipeline configurável
   • Funções de alta ordem
   • Composição de operações
   • Extensibilidade

========================================
EXERCÍCIOS PROPOSTOS
========================================

1. BÁSICO:
   • Implemente Selection Sort e Insertion Sort
   • Crie função para encontrar k-ésimo menor elemento
   • Desenvolva sistema de filtragem múltipla

2. INTERMEDIÁRIO:
   • Implemente Heap Sort e Radix Sort
   • Crie algoritmo de busca ternária
   • Desenvolva sistema de agregação com GROUP BY

3. AVANÇADO:
   • Implemente processamento paralelo com Web Workers
   • Crie sistema de streaming de dados
   • Desenvolva algoritmos de machine learning básicos

*/