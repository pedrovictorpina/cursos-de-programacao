/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 5.1
MÉTODOS BÁSICOS DE ARRAYS
==============================================

Objetivos de Aprendizagem:
- Dominar métodos fundamentais de arrays
- Entender mutação vs imutabilidade
- Usar push, pop, shift, unshift eficientemente
- Aplicar slice, splice, concat e join
- Trabalhar com indexOf, includes e find
- Implementar ordenação com sort
- Reverter arrays com reverse
- Combinar métodos para soluções complexas
- Entender performance e casos de uso

⏱️ TEMPO ESTIMADO: 80 minutos
📊 NÍVEL: Iniciante a Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: ARRAYS E MÉTODOS BÁSICOS
// ==========================================

/*
ARRAYS EM JAVASCRIPT:
Arrays são estruturas de dados que armazenam múltiplos valores em uma
única variável. Em JavaScript, arrays são objetos especiais com propriedades
numéricas e métodos específicos para manipulação de dados.

CARACTERÍSTICAS DOS ARRAYS:
1. Dinâmicos - podem crescer e diminuir
2. Heterogêneos - podem conter diferentes tipos
3. Indexados - acesso por índice numérico (0-based)
4. Iteráveis - podem ser percorridos
5. Mutáveis - podem ser modificados

MÉTODOS MUTADORES vs NÃO-MUTADORES:

MUTADORES (modificam o array original):
- push(), pop(), shift(), unshift()
- splice(), sort(), reverse()
- fill(), copyWithin()

NÃO-MUTADORES (retornam novo array/valor):
- slice(), concat(), join()
- indexOf(), includes(), find()
- toString(), toLocaleString()

IMPORTÂNCIA DA DISTINÇÃO:
- Mutadores alteram o array original
- Não-mutadores preservam o array original
- Escolha baseada na necessidade de imutabilidade
- Performance pode variar entre os tipos

COMPLEXIDADE TEMPORAL:
- Acesso por índice: O(1)
- Busca linear: O(n)
- Inserção/remoção no final: O(1)
- Inserção/remoção no início: O(n)
- Ordenação: O(n log n)
*/

console.log('=== MÉTODOS BÁSICOS DE ARRAYS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== CRIAÇÃO E INICIALIZAÇÃO ==========
console.log('\n--- CRIAÇÃO E INICIALIZAÇÃO ---');

// Diferentes formas de criar arrays
console.log('\n🏗️ Criando arrays:');
const arrayVazio = [];
const arrayLiteral = [1, 2, 3, 4, 5];
const arrayConstructor = new Array(5); // Array com 5 elementos vazios
const arrayPreenchido = new Array(1, 2, 3, 4, 5);
const arrayFrom = Array.from({ length: 5 }, (_, i) => i + 1);
const arrayOf = Array.of(1, 2, 3, 4, 5);

console.log('Array vazio:', arrayVazio);
console.log('Array literal:', arrayLiteral);
console.log('Array constructor (5 vazios):', arrayConstructor);
console.log('Array preenchido:', arrayPreenchido);
console.log('Array.from:', arrayFrom);
console.log('Array.of:', arrayOf);

// Array heterogêneo
const arrayMisto = [
    'texto',
    42,
    true,
    null,
    undefined,
    { nome: 'objeto' },
    [1, 2, 3],
    function() { return 'função'; }
];

console.log('\n🎭 Array heterogêneo:', arrayMisto);
console.log('Tipos dos elementos:');
arrayMisto.forEach((item, index) => {
    console.log(`  [${index}]: ${typeof item} - ${item}`);
});

// ========== MÉTODOS DE ADIÇÃO E REMOÇÃO ==========
console.log('\n--- MÉTODOS DE ADIÇÃO E REMOÇÃO ---');

// Trabalhando com uma lista de tarefas
let tarefas = ['Estudar JavaScript', 'Fazer exercícios'];
console.log('\n📝 Lista inicial de tarefas:', tarefas);

// PUSH - adiciona no final (mutador)
console.log('\n➕ Usando push():');
const novoTamanho = tarefas.push('Revisar código', 'Documentar projeto');
console.log('Tarefas após push:', tarefas);
console.log('Novo tamanho retornado:', novoTamanho);

// POP - remove do final (mutador)
console.log('\n➖ Usando pop():');
const tarefaRemovida = tarefas.pop();
console.log('Tarefa removida:', tarefaRemovida);
console.log('Tarefas após pop:', tarefas);

// UNSHIFT - adiciona no início (mutador)
console.log('\n⬆️ Usando unshift():');
const novoTamanhoInicio = tarefas.unshift('Planejar dia', 'Verificar emails');
console.log('Tarefas após unshift:', tarefas);
console.log('Novo tamanho:', novoTamanhoInicio);

// SHIFT - remove do início (mutador)
console.log('\n⬇️ Usando shift():');
const primeiraRemovida = tarefas.shift();
console.log('Primeira tarefa removida:', primeiraRemovida);
console.log('Tarefas após shift:', tarefas);

// Demonstração de performance
console.log('\n⚡ Demonstração de performance:');
const arrayGrande = Array.from({ length: 100000 }, (_, i) => i);

console.time('Push (final)');
arrayGrande.push(100000);
console.timeEnd('Push (final)');

console.time('Unshift (início)');
arrayGrande.unshift(-1);
console.timeEnd('Unshift (início)');

// ========== MÉTODOS DE BUSCA ==========
console.log('\n--- MÉTODOS DE BUSCA ---');

const frutas = ['maçã', 'banana', 'laranja', 'uva', 'banana', 'pêra'];
console.log('\n🍎 Array de frutas:', frutas);

// INDEXOF - encontra primeiro índice
console.log('\n🔍 Usando indexOf():');
const indiceBanana = frutas.indexOf('banana');
const indiceKiwi = frutas.indexOf('kiwi');
console.log('Índice da primeira banana:', indiceBanana);
console.log('Índice do kiwi (não existe):', indiceKiwi);

// LASTINDEXOF - encontra último índice
console.log('\n🔍 Usando lastIndexOf():');
const ultimaBanana = frutas.lastIndexOf('banana');
console.log('Índice da última banana:', ultimaBanana);

// INCLUDES - verifica existência
console.log('\n✅ Usando includes():');
const temLaranja = frutas.includes('laranja');
const temManga = frutas.includes('manga');
console.log('Tem laranja?', temLaranja);
console.log('Tem manga?', temManga);

// Busca com posição inicial
console.log('\n🎯 Busca com posição inicial:');
const bananaApos2 = frutas.indexOf('banana', 2);
const temUvaApos3 = frutas.includes('uva', 3);
console.log('Banana após índice 2:', bananaApos2);
console.log('Tem uva após índice 3?', temUvaApos3);

// ========== SLICE E SPLICE ==========
console.log('\n--- SLICE E SPLICE ---');

const numeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log('\n🔢 Array original:', numeros);

// SLICE - extrai porção (não-mutador)
console.log('\n✂️ Usando slice():');
const primeiros5 = numeros.slice(0, 5);
const ultimos3 = numeros.slice(-3);
const meio = numeros.slice(3, 7);
const copia = numeros.slice();

console.log('Primeiros 5:', primeiros5);
console.log('Últimos 3:', ultimos3);
console.log('Do meio (3-6):', meio);
console.log('Cópia completa:', copia);
console.log('Array original (inalterado):', numeros);

// SPLICE - modifica array (mutador)
console.log('\n🔧 Usando splice():');
let numerosParaSplice = [...numeros]; // Cópia para demonstração

// Remover elementos
const removidos = numerosParaSplice.splice(2, 3);
console.log('Elementos removidos (índice 2, 3 elementos):', removidos);
console.log('Array após remoção:', numerosParaSplice);

// Inserir elementos
numerosParaSplice.splice(2, 0, 'a', 'b', 'c');
console.log('Após inserir a, b, c no índice 2:', numerosParaSplice);

// Substituir elementos
numerosParaSplice.splice(2, 3, 'X', 'Y');
console.log('Após substituir 3 elementos por X, Y:', numerosParaSplice);

// ========== CONCATENAÇÃO E JUNÇÃO ==========
console.log('\n--- CONCATENAÇÃO E JUNÇÃO ---');

// CONCAT - concatena arrays (não-mutador)
console.log('\n🔗 Usando concat():');
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const array3 = [7, 8, 9];

const concatenado = array1.concat(array2, array3);
const comElementos = array1.concat(array2, 'extra', [10, 11]);

console.log('Array 1:', array1);
console.log('Array 2:', array2);
console.log('Array 3:', array3);
console.log('Concatenado:', concatenado);
console.log('Com elementos extras:', comElementos);
console.log('Arrays originais inalterados:', { array1, array2, array3 });

// Alternativa moderna com spread
const concatenadoSpread = [...array1, ...array2, ...array3];
console.log('Concatenado com spread:', concatenadoSpread);

// JOIN - converte para string (não-mutador)
console.log('\n🔤 Usando join():');
const palavras = ['JavaScript', 'é', 'uma', 'linguagem', 'incrível'];

const frase = palavras.join(' ');
const lista = palavras.join(', ');
const separadoPorTraco = palavras.join(' - ');
const semSeparador = palavras.join('');

console.log('Array de palavras:', palavras);
console.log('Frase:', frase);
console.log('Lista:', lista);
console.log('Separado por traço:', separadoPorTraco);
console.log('Sem separador:', semSeparador);

// ========== ORDENAÇÃO E REVERSÃO ==========
console.log('\n--- ORDENAÇÃO E REVERSÃO ---');

// SORT - ordena array (mutador)
console.log('\n📊 Usando sort():');

// Ordenação de strings
const nomes = ['Carlos', 'Ana', 'Bruno', 'Diana', 'Eduardo'];
console.log('Nomes originais:', nomes);
nomes.sort();
console.log('Nomes ordenados:', nomes);

// Ordenação de números (cuidado!)
const numerosDesordenados = [10, 5, 40, 25, 1000, 1];
console.log('\n⚠️ Ordenação de números:');
console.log('Números originais:', numerosDesordenados);

// Ordenação incorreta (como strings)
const numerosComoString = [...numerosDesordenados];
numerosComoString.sort();
console.log('Ordenação como string (incorreta):', numerosComoString);

// Ordenação correta (com função de comparação)
const numerosCorretos = [...numerosDesordenados];
numerosCorretos.sort((a, b) => a - b);
console.log('Ordenação numérica correta:', numerosCorretos);

// Ordenação decrescente
const numerosDecrescente = [...numerosDesordenados];
numerosDecrescente.sort((a, b) => b - a);
console.log('Ordenação decrescente:', numerosDecrescente);

// Ordenação de objetos
console.log('\n👥 Ordenação de objetos:');
const pessoas = [
    { nome: 'Ana', idade: 25 },
    { nome: 'Bruno', idade: 30 },
    { nome: 'Carlos', idade: 20 },
    { nome: 'Diana', idade: 35 }
];

console.log('Pessoas originais:', pessoas);

// Ordenar por idade
const pessoasPorIdade = [...pessoas];
pessoasPorIdade.sort((a, b) => a.idade - b.idade);
console.log('Ordenadas por idade:', pessoasPorIdade);

// Ordenar por nome
const pessoasPorNome = [...pessoas];
pessoasPorNome.sort((a, b) => a.nome.localeCompare(b.nome));
console.log('Ordenadas por nome:', pessoasPorNome);

// REVERSE - inverte array (mutador)
console.log('\n🔄 Usando reverse():');
const letras = ['a', 'b', 'c', 'd', 'e'];
console.log('Letras originais:', letras);
letras.reverse();
console.log('Letras invertidas:', letras);

// Invertendo sem mutar
const letrasOriginais = ['a', 'b', 'c', 'd', 'e'];
const letrasInvertidas = [...letrasOriginais].reverse();
console.log('Originais (preservadas):', letrasOriginais);
console.log('Invertidas (nova cópia):', letrasInvertidas);

// ========== MÉTODOS DE CONVERSÃO ==========
console.log('\n--- MÉTODOS DE CONVERSÃO ---');

// TOSTRING - converte para string
console.log('\n📝 Usando toString():');
const cores = ['vermelho', 'verde', 'azul'];
const coresString = cores.toString();
console.log('Array de cores:', cores);
console.log('Como string:', coresString);
console.log('Tipo:', typeof coresString);

// TOLOCALESTRING - conversão localizada
console.log('\n🌍 Usando toLocaleString():');
const precos = [1234.56, 2345.67, 3456.78];
const precosLocalizados = precos.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
});
console.log('Preços:', precos);
console.log('Preços localizados:', precosLocalizados);

// ========== PROPRIEDADES IMPORTANTES ==========
console.log('\n--- PROPRIEDADES IMPORTANTES ---');

// LENGTH - tamanho do array
console.log('\n📏 Propriedade length:');
const animais = ['gato', 'cachorro', 'pássaro'];
console.log('Animais:', animais);
console.log('Tamanho:', animais.length);

// Modificando length
animais.length = 2;
console.log('Após reduzir length para 2:', animais);

animais.length = 5;
console.log('Após aumentar length para 5:', animais);

// Adicionando elemento em índice específico
animais[10] = 'peixe';
console.log('Após adicionar no índice 10:', animais);
console.log('Novo tamanho:', animais.length);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Playlist
console.log('\n--- EXERCÍCIO 1: SISTEMA DE PLAYLIST ---');

class Playlist {
    constructor(nome) {
        this.nome = nome;
        this.musicas = [];
        this.posicaoAtual = 0;
        this.historico = [];
    }
    
    // Adicionar música no final
    adicionarMusica(musica) {
        this.musicas.push(musica);
        console.log(`🎵 "${musica}" adicionada à playlist "${this.nome}"`);
        return this;
    }
    
    // Adicionar múltiplas músicas
    adicionarMusicas(...musicas) {
        this.musicas.push(...musicas);
        console.log(`🎵 ${musicas.length} músicas adicionadas à playlist`);
        return this;
    }
    
    // Remover música por nome
    removerMusica(musica) {
        const indice = this.musicas.indexOf(musica);
        if (indice !== -1) {
            const removida = this.musicas.splice(indice, 1)[0];
            console.log(`🗑️ "${removida}" removida da playlist`);
            
            // Ajustar posição atual se necessário
            if (indice < this.posicaoAtual) {
                this.posicaoAtual--;
            } else if (indice === this.posicaoAtual && this.posicaoAtual >= this.musicas.length) {
                this.posicaoAtual = 0;
            }
            
            return removida;
        } else {
            console.log(`❌ Música "${musica}" não encontrada`);
            return null;
        }
    }
    
    // Mover música para nova posição
    moverMusica(musicaOuIndice, novaposicao) {
        let indiceAtual;
        
        if (typeof musicaOuIndice === 'string') {
            indiceAtual = this.musicas.indexOf(musicaOuIndice);
        } else {
            indiceAtual = musicaOuIndice;
        }
        
        if (indiceAtual === -1 || indiceAtual >= this.musicas.length) {
            console.log('❌ Música ou índice inválido');
            return this;
        }
        
        if (novaposicao < 0 || novaposicao >= this.musicas.length) {
            console.log('❌ Nova posição inválida');
            return this;
        }
        
        const musica = this.musicas.splice(indiceAtual, 1)[0];
        this.musicas.splice(novaposicao, 0, musica);
        
        console.log(`🔄 "${musica}" movida para posição ${novaposicao}`);
        return this;
    }
    
    // Embaralhar playlist
    embaralhar() {
        const musicasEmbaralhadas = [...this.musicas];
        
        // Algoritmo Fisher-Yates
        for (let i = musicasEmbaralhadas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [musicasEmbaralhadas[i], musicasEmbaralhadas[j]] = [musicasEmbaralhadas[j], musicasEmbaralhadas[i]];
        }
        
        this.musicas = musicasEmbaralhadas;
        this.posicaoAtual = 0;
        console.log('🔀 Playlist embaralhada');
        return this;
    }
    
    // Ordenar playlist
    ordenar(criterio = 'alfabetico') {
        switch (criterio) {
            case 'alfabetico':
                this.musicas.sort();
                break;
            case 'reverso':
                this.musicas.sort().reverse();
                break;
            case 'tamanho':
                this.musicas.sort((a, b) => a.length - b.length);
                break;
            default:
                console.log('❌ Critério de ordenação inválido');
                return this;
        }
        
        this.posicaoAtual = 0;
        console.log(`📊 Playlist ordenada por ${criterio}`);
        return this;
    }
    
    // Tocar música atual
    tocar() {
        if (this.musicas.length === 0) {
            console.log('❌ Playlist vazia');
            return null;
        }
        
        const musicaAtual = this.musicas[this.posicaoAtual];
        this.historico.push(musicaAtual);
        console.log(`▶️ Tocando: "${musicaAtual}" (${this.posicaoAtual + 1}/${this.musicas.length})`);
        return musicaAtual;
    }
    
    // Próxima música
    proxima() {
        if (this.musicas.length === 0) {
            console.log('❌ Playlist vazia');
            return null;
        }
        
        this.posicaoAtual = (this.posicaoAtual + 1) % this.musicas.length;
        return this.tocar();
    }
    
    // Música anterior
    anterior() {
        if (this.musicas.length === 0) {
            console.log('❌ Playlist vazia');
            return null;
        }
        
        this.posicaoAtual = this.posicaoAtual === 0 ? this.musicas.length - 1 : this.posicaoAtual - 1;
        return this.tocar();
    }
    
    // Buscar músicas
    buscar(termo) {
        const resultados = this.musicas.filter(musica => 
            musica.toLowerCase().includes(termo.toLowerCase())
        );
        
        console.log(`🔍 Encontradas ${resultados.length} músicas com "${termo}":`);
        resultados.forEach((musica, index) => {
            const indiceOriginal = this.musicas.indexOf(musica);
            console.log(`  ${index + 1}. "${musica}" (posição ${indiceOriginal + 1})`);
        });
        
        return resultados;
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        return {
            nome: this.nome,
            totalMusicas: this.musicas.length,
            posicaoAtual: this.posicaoAtual + 1,
            musicaAtual: this.musicas[this.posicaoAtual] || null,
            historico: this.historico.length,
            ultimasTocadas: this.historico.slice(-5)
        };
    }
    
    // Listar playlist
    listar() {
        console.log(`\n📋 Playlist "${this.nome}" (${this.musicas.length} músicas):`);
        this.musicas.forEach((musica, index) => {
            const marcador = index === this.posicaoAtual ? '▶️' : '  ';
            console.log(`${marcador} ${index + 1}. ${musica}`);
        });
    }
    
    // Criar cópia da playlist
    clonar(novoNome) {
        const novaPlaylist = new Playlist(novoNome);
        novaPlaylist.musicas = [...this.musicas];
        novaPlaylist.posicaoAtual = this.posicaoAtual;
        console.log(`📋 Playlist "${novoNome}" criada como cópia de "${this.nome}"`);
        return novaPlaylist;
    }
}

// Testando sistema de playlist
console.log('\n🎵 Testando sistema de playlist:');

const minhaPlaylist = new Playlist('Favoritas');

// Adicionando músicas
minhaPlaylist
    .adicionarMusica('Bohemian Rhapsody - Queen')
    .adicionarMusica('Imagine - John Lennon')
    .adicionarMusicas(
        'Hotel California - Eagles',
        'Stairway to Heaven - Led Zeppelin',
        'Sweet Child O Mine - Guns N Roses'
    );

minhaPlaylist.listar();

// Tocando músicas
minhaPlaylist.tocar();
minhaPlaylist.proxima();
minhaPlaylist.proxima();

// Movendo música
minhaPlaylist.moverMusica('Imagine - John Lennon', 0);
minhaPlaylist.listar();

// Buscando
minhaPlaylist.buscar('queen');

// Estatísticas
console.log('\n📊 Estatísticas:', minhaPlaylist.obterEstatisticas());

// EXERCÍCIO 2: Gerenciador de Inventário
console.log('\n--- EXERCÍCIO 2: GERENCIADOR DE INVENTÁRIO ---');

class GerenciadorInventario {
    constructor() {
        this.itens = [];
        this.historico = [];
    }
    
    // Adicionar item
    adicionarItem(item) {
        const novoItem = {
            id: this.gerarId(),
            nome: item.nome,
            categoria: item.categoria || 'Geral',
            quantidade: item.quantidade || 1,
            preco: item.preco || 0,
            dataAdicao: new Date(),
            ...item
        };
        
        this.itens.push(novoItem);
        this.registrarHistorico('adicionar', novoItem);
        console.log(`✅ Item "${novoItem.nome}" adicionado ao inventário`);
        return novoItem;
    }
    
    // Remover item
    removerItem(id) {
        const indice = this.itens.findIndex(item => item.id === id);
        if (indice !== -1) {
            const itemRemovido = this.itens.splice(indice, 1)[0];
            this.registrarHistorico('remover', itemRemovido);
            console.log(`🗑️ Item "${itemRemovido.nome}" removido do inventário`);
            return itemRemovido;
        } else {
            console.log(`❌ Item com ID ${id} não encontrado`);
            return null;
        }
    }
    
    // Buscar itens
    buscarItens(criterio) {
        let resultados = [...this.itens];
        
        if (criterio.nome) {
            resultados = resultados.filter(item => 
                item.nome.toLowerCase().includes(criterio.nome.toLowerCase())
            );
        }
        
        if (criterio.categoria) {
            resultados = resultados.filter(item => 
                item.categoria.toLowerCase() === criterio.categoria.toLowerCase()
            );
        }
        
        if (criterio.precoMin !== undefined) {
            resultados = resultados.filter(item => item.preco >= criterio.precoMin);
        }
        
        if (criterio.precoMax !== undefined) {
            resultados = resultados.filter(item => item.preco <= criterio.precoMax);
        }
        
        if (criterio.quantidadeMin !== undefined) {
            resultados = resultados.filter(item => item.quantidade >= criterio.quantidadeMin);
        }
        
        return resultados;
    }
    
    // Ordenar inventário
    ordenarPor(campo, ordem = 'asc') {
        this.itens.sort((a, b) => {
            let valorA = a[campo];
            let valorB = b[campo];
            
            // Tratamento especial para strings
            if (typeof valorA === 'string') {
                valorA = valorA.toLowerCase();
                valorB = valorB.toLowerCase();
            }
            
            if (ordem === 'asc') {
                return valorA < valorB ? -1 : valorA > valorB ? 1 : 0;
            } else {
                return valorA > valorB ? -1 : valorA < valorB ? 1 : 0;
            }
        });
        
        console.log(`📊 Inventário ordenado por ${campo} (${ordem})`);
        return this;
    }
    
    // Agrupar por categoria
    agruparPorCategoria() {
        const grupos = {};
        
        this.itens.forEach(item => {
            if (!grupos[item.categoria]) {
                grupos[item.categoria] = [];
            }
            grupos[item.categoria].push(item);
        });
        
        return grupos;
    }
    
    // Calcular estatísticas
    calcularEstatisticas() {
        if (this.itens.length === 0) {
            return {
                totalItens: 0,
                valorTotal: 0,
                quantidadeTotal: 0,
                categorias: 0
            };
        }
        
        const valorTotal = this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const quantidadeTotal = this.itens.reduce((total, item) => total + item.quantidade, 0);
        const categorias = [...new Set(this.itens.map(item => item.categoria))].length;
        
        const precos = this.itens.map(item => item.preco);
        const precoMedio = precos.reduce((a, b) => a + b, 0) / precos.length;
        const precoMin = Math.min(...precos);
        const precoMax = Math.max(...precos);
        
        return {
            totalItens: this.itens.length,
            valorTotal: valorTotal.toFixed(2),
            quantidadeTotal,
            categorias,
            precoMedio: precoMedio.toFixed(2),
            precoMin,
            precoMax
        };
    }
    
    // Itens em baixo estoque
    itensEstoqueBaixo(limite = 5) {
        return this.itens.filter(item => item.quantidade <= limite)
                         .sort((a, b) => a.quantidade - b.quantidade);
    }
    
    // Gerar relatório
    gerarRelatorio() {
        const stats = this.calcularEstatisticas();
        const grupos = this.agruparPorCategoria();
        const estoqueBaixo = this.itensEstoqueBaixo();
        
        console.log('\n📊 RELATÓRIO DO INVENTÁRIO');
        console.log('=' .repeat(40));
        console.log(`Total de itens: ${stats.totalItens}`);
        console.log(`Valor total: R$ ${stats.valorTotal}`);
        console.log(`Quantidade total: ${stats.quantidadeTotal}`);
        console.log(`Categorias: ${stats.categorias}`);
        console.log(`Preço médio: R$ ${stats.precoMedio}`);
        console.log(`Faixa de preços: R$ ${stats.precoMin} - R$ ${stats.precoMax}`);
        
        console.log('\n📦 Por categoria:');
        Object.entries(grupos).forEach(([categoria, itens]) => {
            console.log(`  ${categoria}: ${itens.length} itens`);
        });
        
        if (estoqueBaixo.length > 0) {
            console.log('\n⚠️ Itens com estoque baixo:');
            estoqueBaixo.forEach(item => {
                console.log(`  ${item.nome}: ${item.quantidade} unidades`);
            });
        }
        
        return {
            estatisticas: stats,
            grupos,
            estoqueBaixo
        };
    }
    
    // Métodos auxiliares
    gerarId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }
    
    registrarHistorico(acao, item) {
        this.historico.push({
            acao,
            item: { ...item },
            timestamp: new Date()
        });
        
        // Manter apenas os últimos 100 registros
        if (this.historico.length > 100) {
            this.historico.splice(0, this.historico.length - 100);
        }
    }
    
    // Listar itens
    listarItens(limite = 10) {
        console.log(`\n📋 Inventário (${Math.min(limite, this.itens.length)} de ${this.itens.length} itens):`);
        this.itens.slice(0, limite).forEach((item, index) => {
            console.log(`${index + 1}. ${item.nome} - ${item.categoria} - Qtd: ${item.quantidade} - R$ ${item.preco}`);
        });
        
        if (this.itens.length > limite) {
            console.log(`... e mais ${this.itens.length - limite} itens`);
        }
    }
}

// Testando gerenciador de inventário
console.log('\n📦 Testando gerenciador de inventário:');

const inventario = new GerenciadorInventario();

// Adicionando itens
inventario.adicionarItem({
    nome: 'Notebook Dell',
    categoria: 'Eletrônicos',
    quantidade: 5,
    preco: 2500.00
});

inventario.adicionarItem({
    nome: 'Mouse Logitech',
    categoria: 'Eletrônicos',
    quantidade: 15,
    preco: 45.90
});

inventario.adicionarItem({
    nome: 'Cadeira Ergonômica',
    categoria: 'Móveis',
    quantidade: 3,
    preco: 450.00
});

inventario.adicionarItem({
    nome: 'Caneta Bic',
    categoria: 'Material de Escritório',
    quantidade: 100,
    preco: 1.50
});

inventario.adicionarItem({
    nome: 'Monitor 24"',
    categoria: 'Eletrônicos',
    quantidade: 2,
    preco: 800.00
});

// Listando itens
inventario.listarItens();

// Buscando itens
console.log('\n🔍 Buscando eletrônicos:');
const eletronicos = inventario.buscarItens({ categoria: 'Eletrônicos' });
eletronicos.forEach(item => {
    console.log(`- ${item.nome}: R$ ${item.preco}`);
});

// Ordenando por preço
inventario.ordenarPor('preco', 'desc');
inventario.listarItens(3);

// Gerando relatório
inventario.gerarRelatorio();

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA MÉTODOS DE ARRAYS:

1. **Performance de Métodos**
   - push/pop são O(1) - muito rápidos
   - shift/unshift são O(n) - mais lentos para arrays grandes
   - splice é O(n) - cuidado com inserções no meio
   - indexOf/includes são O(n) - considere Set para buscas frequentes

2. **Mutação vs Imutabilidade**
   - Métodos mutadores modificam o array original
   - Use spread operator [...array] para criar cópias
   - Considere bibliotecas como Immutable.js para estruturas complexas
   - Mutação é mais eficiente em memória, imutabilidade é mais segura

3. **Ordenação Eficiente**
   - sort() usa Timsort (híbrido merge/insertion sort)
   - Para números, sempre use função de comparação: (a, b) => a - b
   - Para strings, considere localeCompare() para ordenação localizada
   - Cache resultados de ordenação quando possível

4. **Busca Otimizada**
   - Para buscas frequentes, considere Map ou Set
   - indexOf retorna -1 se não encontrar, includes retorna boolean
   - Para objetos, use findIndex() em vez de indexOf
   - Considere binary search para arrays ordenados grandes

5. **Concatenação Eficiente**
   - concat() cria novo array, spread operator também
   - Para múltiplas concatenações, use push.apply() ou spread
   - Para strings, join() é mais eficiente que concatenação manual

6. **Memory Management**
   - Arrays esparsos (com buracos) consomem mais memória
   - delete array[index] cria buraco, use splice() em vez disso
   - length = 0 é a forma mais rápida de limpar array
   - Evite arrays muito grandes em memória

7. **Casos Especiais**
   - Array(n) cria array com n elementos vazios
   - Array.of() sempre cria array com elementos fornecidos
   - Array.from() é útil para converter iteráveis
   - Use TypedArrays para dados numéricos grandes
*/

// Exemplo de otimização
console.log('\n⚡ Exemplo de otimização:');

// ❌ Menos eficiente para arrays grandes
function removerElementosLento(array, valor) {
    while (array.includes(valor)) {
        const index = array.indexOf(valor);
        array.splice(index, 1);
    }
    return array;
}

// ✅ Mais eficiente
function removerElementosRapido(array, valor) {
    return array.filter(item => item !== valor);
}

// ✅ Ainda mais eficiente para mutação
function removerElementosMutacao(array, valor) {
    let writeIndex = 0;
    for (let readIndex = 0; readIndex < array.length; readIndex++) {
        if (array[readIndex] !== valor) {
            array[writeIndex] = array[readIndex];
            writeIndex++;
        }
    }
    array.length = writeIndex;
    return array;
}

// Testando performance
const arrayTeste = Array.from({ length: 10000 }, () => Math.floor(Math.random() * 100));

console.time('Remoção com filter');
const resultado1 = removerElementosRapido([...arrayTeste], 50);
console.timeEnd('Remoção com filter');

console.time('Remoção com mutação');
const resultado2 = removerElementosMutacao([...arrayTeste], 50);
console.timeEnd('Remoção com mutação');

console.log('Resultados têm mesmo tamanho:', resultado1.length === resultado2.length);

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
- MDN Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods
- ECMAScript Array Specification: https://tc39.es/ecma262/#sec-array-objects

📚 LIVROS RECOMENDADOS:
- "Eloquent JavaScript" - Marijn Haverbeke (Capítulo 4: Data Structures)
- "JavaScript: The Good Parts" - Douglas Crockford
- "You Don't Know JS: Types & Grammar" - Kyle Simpson

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Métodos avançados de arrays (map, filter, reduce)
2. Iteração e loops avançados
3. Array methods chaining
4. Programação funcional com arrays
5. Performance e otimização
6. TypedArrays e ArrayBuffer
7. Estruturas de dados avançadas
8. Algoritmos de ordenação e busca

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente um sistema de carrinho de compras
2. Crie um algoritmo de ordenação personalizado
3. Desenvolva um sistema de cache com arrays
4. Implemente estruturas como Stack e Queue
5. Crie utilitários para manipulação de dados

🔧 FERRAMENTAS ÚTEIS:
- Lodash para utilitários de arrays
- Ramda para programação funcional
- Immutable.js para estruturas imutáveis
- D3.js para manipulação de dados
- Chart.js para visualização

⚠️ ARMADILHAS COMUNS:
1. Confundir métodos mutadores com não-mutadores
2. Usar sort() sem função de comparação para números
3. Modificar array durante iteração
4. Não considerar performance em arrays grandes
5. Criar arrays esparsos acidentalmente
6. Usar delete em vez de splice
7. Não validar índices antes de acessar
8. Assumir que todos os elementos existem

🎓 CONCEITOS AVANÇADOS:
- Algoritmos de ordenação (QuickSort, MergeSort)
- Estruturas de dados (Heap, Tree, Graph)
- Programação funcional (map, reduce, filter)
- Lazy evaluation
- Generators e iterators
*/

console.log('\n✅ Módulo de Métodos Básicos de Arrays concluído!');
console.log('📝 Próximo arquivo: 02-metodos-avancados.js');
console.log('🎯 Continue praticando com os exercícios propostos!');

/*
==============================================
RESUMO DO MÓDULO - MÉTODOS BÁSICOS DE ARRAYS
==============================================

✅ CONCEITOS APRENDIDOS:
- Criação e inicialização de arrays
- Métodos mutadores vs não-mutadores
- Adição e remoção de elementos
- Busca e verificação de existência
- Extração e modificação com slice/splice
- Concatenação e conversão
- Ordenação e reversão
- Propriedades importantes (length)

🎯 HABILIDADES DESENVOLVIDAS:
- Manipular arrays eficientemente
- Escolher método apropriado para cada situação
- Entender impacto de performance
- Implementar estruturas de dados básicas
- Criar sistemas de gerenciamento
- Trabalhar com dados dinâmicos
- Otimizar operações em arrays

📈 PRÓXIMOS DESAFIOS:
- Métodos funcionais avançados
- Programação reativa
- Algoritmos complexos
- Estruturas de dados avançadas
- Performance em larga escala

==============================================
*/