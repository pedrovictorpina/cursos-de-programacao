/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 5.3
ITERAÇÃO DE ARRAYS
==============================================

Objetivos de Aprendizagem:
- Dominar diferentes formas de iteração
- Usar for...of, for...in e for tradicional
- Trabalhar com iteradores e generators
- Implementar iteração customizada
- Aplicar Symbol.iterator
- Criar objetos iteráveis
- Entender lazy evaluation
- Otimizar loops para performance

⏱️ TEMPO ESTIMADO: 75 minutos
📊 NÍVEL: Intermediário a Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: ITERAÇÃO E ITERADORES
// ==========================================

/*
ITERAÇÃO EM JAVASCRIPT:
Iteração é o processo de percorrer elementos de uma coleção
de forma sequencial. JavaScript oferece várias formas de iterar.

TIPOS DE ITERAÇÃO:

1. **ITERAÇÃO TRADICIONAL**
   - for loop clássico
   - while e do-while
   - Controle manual de índices
   - Máxima performance

2. **ITERAÇÃO FUNCIONAL**
   - forEach, map, filter
   - Declarativa e expressiva
   - Imutável por padrão
   - Menos controle de fluxo

3. **ITERAÇÃO MODERNA**
   - for...of (valores)
   - for...in (chaves)
   - Iteradores e generators
   - Symbol.iterator

4. **ITERAÇÃO CUSTOMIZADA**
   - Implementar Symbol.iterator
   - Criar generators
   - Lazy evaluation
   - Infinite sequences

PROTOCOLO DE ITERAÇÃO:

ITERABLE:
- Objeto que implementa Symbol.iterator
- Retorna um iterator quando chamado
- Arrays, Strings, Maps, Sets são iterables

ITERATOR:
- Objeto com método next()
- next() retorna { value, done }
- done: true quando iteração termina
- value: valor atual da iteração

GENERATOR:
- Função especial que pode pausar/retomar
- Usa yield para produzir valores
- Implementa automaticamente iterator
- Permite lazy evaluation

COMPLEXIDADE E PERFORMANCE:
- for tradicional: O(n) - mais rápido
- for...of: O(n) - legível e rápido
- forEach: O(n) - overhead de função
- for...in: O(n) - mais lento, enumera propriedades

USO RECOMENDADO:
- for tradicional: performance crítica
- for...of: iteração simples de valores
- forEach: quando precisar de índice/array
- for...in: iteração de propriedades de objeto
*/

console.log('=== ITERAÇÃO DE ARRAYS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== FOR TRADICIONAL ==========
console.log('\n--- FOR TRADICIONAL ---');

// Dados de exemplo
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const frutas = ['maçã', 'banana', 'laranja', 'uva', 'manga'];
const pessoas = [
    { nome: 'Ana', idade: 25, cidade: 'São Paulo' },
    { nome: 'Bruno', idade: 30, cidade: 'Rio de Janeiro' },
    { nome: 'Carlos', idade: 35, cidade: 'Belo Horizonte' },
    { nome: 'Diana', idade: 28, cidade: 'Salvador' }
];

console.log('\n🔢 For tradicional - números pares:');
const pares = [];
for (let i = 0; i < numeros.length; i++) {
    if (numeros[i] % 2 === 0) {
        pares.push(numeros[i]);
    }
}
console.log('Números pares:', pares);

// For com controle de fluxo
console.log('\n🎯 For com break e continue:');
for (let i = 0; i < numeros.length; i++) {
    if (numeros[i] === 5) {
        console.log('Encontrou 5, pulando...');
        continue;
    }
    if (numeros[i] === 8) {
        console.log('Encontrou 8, parando...');
        break;
    }
    console.log(`Número: ${numeros[i]}`);
}

// For reverso
console.log('\n⬅️ For reverso:');
for (let i = frutas.length - 1; i >= 0; i--) {
    console.log(`${frutas.length - i}. ${frutas[i]}`);
}

// For com step customizado
console.log('\n⚡ For com step de 2:');
for (let i = 0; i < numeros.length; i += 2) {
    console.log(`Posição ${i}: ${numeros[i]}`);
}

// For aninhado - matriz
console.log('\n🔲 For aninhado - matriz:');
const matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
        console.log(`matriz[${i}][${j}] = ${matriz[i][j]}`);
    }
}

// ========== FOR...OF ==========
console.log('\n--- FOR...OF ---');

// For...of básico
console.log('\n🍎 For...of básico - frutas:');
for (const fruta of frutas) {
    console.log(`Fruta: ${fruta}`);
}

// For...of com índice usando entries()
console.log('\n📊 For...of com índice:');
for (const [indice, fruta] of frutas.entries()) {
    console.log(`${indice + 1}. ${fruta}`);
}

// For...of com destructuring
console.log('\n🎭 For...of com destructuring:');
for (const { nome, idade, cidade } of pessoas) {
    console.log(`${nome}, ${idade} anos, mora em ${cidade}`);
}

// For...of com strings
console.log('\n📝 For...of com strings:');
const palavra = 'JavaScript';
for (const letra of palavra) {
    console.log(`Letra: ${letra}`);
}

// For...of com Maps
console.log('\n🗺️ For...of com Maps:');
const mapa = new Map([
    ['nome', 'João'],
    ['idade', 30],
    ['profissao', 'Desenvolvedor']
]);

for (const [chave, valor] of mapa) {
    console.log(`${chave}: ${valor}`);
}

// For...of com Sets
console.log('\n🎯 For...of com Sets:');
const conjunto = new Set(['a', 'b', 'c', 'a', 'b']); // duplicatas removidas
for (const item of conjunto) {
    console.log(`Item único: ${item}`);
}

// ========== FOR...IN ==========
console.log('\n--- FOR...IN ---');

// For...in com objetos
console.log('\n🏠 For...in com objetos:');
const pessoa = {
    nome: 'Maria',
    idade: 25,
    profissao: 'Designer',
    cidade: 'São Paulo'
};

for (const propriedade in pessoa) {
    console.log(`${propriedade}: ${pessoa[propriedade]}`);
}

// For...in com arrays (não recomendado)
console.log('\n⚠️ For...in com arrays (cuidado):');
const array = ['a', 'b', 'c'];
array.propriedadeCustoma = 'valor';

for (const indice in array) {
    console.log(`${indice}: ${array[indice]}`);
}

// For...in com verificação hasOwnProperty
console.log('\n✅ For...in com hasOwnProperty:');
const objetoComHeranca = Object.create({ propriedadeHerdada: 'valor herdado' });
objetoComHeranca.propriedadePropria = 'valor próprio';

for (const prop in objetoComHeranca) {
    if (objetoComHeranca.hasOwnProperty(prop)) {
        console.log(`Propriedade própria - ${prop}: ${objetoComHeranca[prop]}`);
    } else {
        console.log(`Propriedade herdada - ${prop}: ${objetoComHeranca[prop]}`);
    }
}

// ========== WHILE E DO-WHILE ==========
console.log('\n--- WHILE E DO-WHILE ---');

// While básico
console.log('\n🔄 While básico:');
let contador = 0;
while (contador < 5) {
    console.log(`Contador: ${contador}`);
    contador++;
}

// While com condição complexa
console.log('\n🎲 While com condição complexa:');
let tentativas = 0;
let numeroAleatorio;
while ((numeroAleatorio = Math.floor(Math.random() * 10)) !== 7 && tentativas < 10) {
    console.log(`Tentativa ${tentativas + 1}: ${numeroAleatorio}`);
    tentativas++;
}
if (numeroAleatorio === 7) {
    console.log('🎉 Encontrou o número 7!');
} else {
    console.log('😞 Não encontrou o número 7 em 10 tentativas');
}

// Do-while
console.log('\n🔁 Do-while:');
let numero;
do {
    numero = Math.floor(Math.random() * 6) + 1;
    console.log(`Rolou: ${numero}`);
} while (numero !== 6);
console.log('🎯 Conseguiu rolar 6!');

// ========== ITERADORES CUSTOMIZADOS ==========
console.log('\n--- ITERADORES CUSTOMIZADOS ---');

// Implementando Symbol.iterator
console.log('\n🔧 Implementando Symbol.iterator:');

class ContadorIteravel {
    constructor(inicio, fim, passo = 1) {
        this.inicio = inicio;
        this.fim = fim;
        this.passo = passo;
    }
    
    [Symbol.iterator]() {
        let atual = this.inicio;
        const fim = this.fim;
        const passo = this.passo;
        
        return {
            next() {
                if (atual <= fim) {
                    const valor = atual;
                    atual += passo;
                    return { value: valor, done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
}

// Testando contador iterável
const contador1a10 = new ContadorIteravel(1, 10, 2);
console.log('Contador de 1 a 10 (passo 2):');
for (const num of contador1a10) {
    console.log(num);
}

// Iterator manual
console.log('\n🔧 Iterator manual:');
const iteradorManual = contador1a10[Symbol.iterator]();
let resultado;
while (!(resultado = iteradorManual.next()).done) {
    console.log(`Valor manual: ${resultado.value}`);
}

// Objeto iterável customizado
console.log('\n🏗️ Objeto iterável customizado:');

class ListaLigada {
    constructor() {
        this.cabeca = null;
        this.tamanho = 0;
    }
    
    adicionar(valor) {
        const novoNo = { valor, proximo: null };
        if (!this.cabeca) {
            this.cabeca = novoNo;
        } else {
            let atual = this.cabeca;
            while (atual.proximo) {
                atual = atual.proximo;
            }
            atual.proximo = novoNo;
        }
        this.tamanho++;
    }
    
    [Symbol.iterator]() {
        let atual = this.cabeca;
        
        return {
            next() {
                if (atual) {
                    const valor = atual.valor;
                    atual = atual.proximo;
                    return { value: valor, done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
}

// Testando lista ligada
const lista = new ListaLigada();
lista.adicionar('primeiro');
lista.adicionar('segundo');
lista.adicionar('terceiro');

console.log('Lista ligada:');
for (const item of lista) {
    console.log(`Item: ${item}`);
}

// ========== GENERATORS ==========
console.log('\n--- GENERATORS ---');

// Generator básico
console.log('\n⚡ Generator básico:');

function* contadorGenerator(inicio, fim) {
    for (let i = inicio; i <= fim; i++) {
        yield i;
    }
}

const gerador = contadorGenerator(1, 5);
console.log('Generator manual:');
console.log(gerador.next()); // { value: 1, done: false }
console.log(gerador.next()); // { value: 2, done: false }
console.log(gerador.next()); // { value: 3, done: false }

// Generator com for...of
console.log('\n🔄 Generator com for...of:');
for (const num of contadorGenerator(10, 15)) {
    console.log(`Número gerado: ${num}`);
}

// Generator infinito
console.log('\n♾️ Generator infinito:');

function* fibonacciGenerator() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Primeiros 10 números de Fibonacci
const fibonacci = fibonacciGenerator();
console.log('Primeiros 10 números de Fibonacci:');
for (let i = 0; i < 10; i++) {
    console.log(fibonacci.next().value);
}

// Generator com yield*
console.log('\n🌟 Generator com yield*:');

function* gerador1() {
    yield 1;
    yield 2;
}

function* gerador2() {
    yield 3;
    yield 4;
}

function* geradorCombinado() {
    yield* gerador1();
    yield* gerador2();
    yield 5;
}

for (const valor of geradorCombinado()) {
    console.log(`Valor combinado: ${valor}`);
}

// Generator com parâmetros
console.log('\n📨 Generator com parâmetros:');

function* geradorComParametros() {
    const primeiro = yield 'Primeiro yield';
    console.log(`Recebido: ${primeiro}`);
    
    const segundo = yield 'Segundo yield';
    console.log(`Recebido: ${segundo}`);
    
    return 'Fim do generator';
}

const geradorParam = geradorComParametros();
console.log(geradorParam.next()); // { value: 'Primeiro yield', done: false }
console.log(geradorParam.next('Olá')); // { value: 'Segundo yield', done: false }
console.log(geradorParam.next('Mundo')); // { value: 'Fim do generator', done: true }

// ========== LAZY EVALUATION ==========
console.log('\n--- LAZY EVALUATION ---');

// Range lazy
console.log('\n💤 Range lazy:');

function* range(inicio, fim, passo = 1) {
    for (let i = inicio; i <= fim; i += passo) {
        console.log(`Gerando: ${i}`);
        yield i;
    }
}

// Só gera valores quando necessário
const rangeLazy = range(1, 1000000, 1);
console.log('Range criado (ainda não gerou valores)');

// Pega apenas os primeiros 3
const primeiros3 = [];
for (const num of rangeLazy) {
    primeiros3.push(num);
    if (primeiros3.length === 3) break;
}
console.log('Primeiros 3:', primeiros3);

// Pipeline lazy
console.log('\n🔄 Pipeline lazy:');

function* map(iteravel, funcao) {
    for (const item of iteravel) {
        yield funcao(item);
    }
}

function* filter(iteravel, predicado) {
    for (const item of iteravel) {
        if (predicado(item)) {
            yield item;
        }
    }
}

function* take(iteravel, quantidade) {
    let contador = 0;
    for (const item of iteravel) {
        if (contador >= quantidade) break;
        yield item;
        contador++;
    }
}

// Pipeline: números -> dobrar -> filtrar pares -> pegar 5
const pipeline = take(
    filter(
        map(range(1, 100), x => x * 2),
        x => x % 4 === 0
    ),
    5
);

console.log('Pipeline lazy (dobrar -> filtrar múltiplos de 4 -> pegar 5):');
for (const resultado of pipeline) {
    console.log(`Resultado: ${resultado}`);
}

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Paginação Lazy
console.log('\n--- EXERCÍCIO 1: SISTEMA DE PAGINAÇÃO LAZY ---');

class PaginadorLazy {
    constructor(dados, tamanhoPagina = 10) {
        this.dados = dados;
        this.tamanhoPagina = tamanhoPagina;
    }
    
    // Generator para páginas
    *paginas() {
        for (let i = 0; i < this.dados.length; i += this.tamanhoPagina) {
            const pagina = this.dados.slice(i, i + this.tamanhoPagina);
            const numeroPagina = Math.floor(i / this.tamanhoPagina) + 1;
            const totalPaginas = Math.ceil(this.dados.length / this.tamanhoPagina);
            
            yield {
                numero: numeroPagina,
                total: totalPaginas,
                dados: pagina,
                temProxima: i + this.tamanhoPagina < this.dados.length,
                temAnterior: i > 0
            };
        }
    }
    
    // Busca lazy
    *buscar(termo) {
        for (const item of this.dados) {
            if (typeof item === 'string' && item.toLowerCase().includes(termo.toLowerCase())) {
                yield item;
            } else if (typeof item === 'object' && item.nome && 
                      item.nome.toLowerCase().includes(termo.toLowerCase())) {
                yield item;
            }
        }
    }
    
    // Filtro lazy
    *filtrar(predicado) {
        for (const item of this.dados) {
            if (predicado(item)) {
                yield item;
            }
        }
    }
    
    // Transformação lazy
    *transformar(funcao) {
        for (const item of this.dados) {
            yield funcao(item);
        }
    }
    
    // Pipeline de operações
    *pipeline(...operacoes) {
        let resultado = this.dados;
        
        for (const operacao of operacoes) {
            if (operacao.tipo === 'filtrar') {
                resultado = this.filtrar(operacao.predicado);
            } else if (operacao.tipo === 'transformar') {
                resultado = this.transformar(operacao.funcao);
            } else if (operacao.tipo === 'buscar') {
                resultado = this.buscar(operacao.termo);
            }
        }
        
        yield* resultado;
    }
    
    // Estatísticas lazy
    calcularEstatisticas() {
        let count = 0;
        let soma = 0;
        let min = Infinity;
        let max = -Infinity;
        
        for (const item of this.dados) {
            count++;
            if (typeof item === 'number') {
                soma += item;
                min = Math.min(min, item);
                max = Math.max(max, item);
            }
        }
        
        return {
            count,
            soma,
            media: count > 0 ? soma / count : 0,
            min: min === Infinity ? null : min,
            max: max === -Infinity ? null : max
        };
    }
}

// Dados de teste
const dadosTeste = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    nome: `Usuário ${i + 1}`,
    idade: 18 + Math.floor(Math.random() * 50),
    ativo: Math.random() > 0.3
}));

// Testando paginador
console.log('\n📄 Testando paginador lazy:');
const paginador = new PaginadorLazy(dadosTeste, 5);

// Primeira página
const primeiraPagina = paginador.paginas().next().value;
console.log('Primeira página:', {
    numero: primeiraPagina.numero,
    total: primeiraPagina.total,
    quantidade: primeiraPagina.dados.length,
    temProxima: primeiraPagina.temProxima
});

// Busca lazy
console.log('\n🔍 Busca lazy por "Usuário 1":');
let contador = 0;
for (const resultado of paginador.buscar('Usuário 1')) {
    console.log(resultado.nome);
    contador++;
    if (contador >= 5) break; // Limita para não mostrar todos
}

// Filtro lazy
console.log('\n🎯 Filtro lazy - usuários ativos com mais de 30 anos:');
contador = 0;
for (const usuario of paginador.filtrar(u => u.ativo && u.idade > 30)) {
    console.log(`${usuario.nome}, ${usuario.idade} anos`);
    contador++;
    if (contador >= 3) break;
}

// EXERCÍCIO 2: Sistema de Stream Processing
console.log('\n--- EXERCÍCIO 2: SISTEMA DE STREAM PROCESSING ---');

class StreamProcessor {
    constructor(fonte) {
        this.fonte = fonte;
    }
    
    // Criar stream de dados
    static from(dados) {
        return new StreamProcessor(function* () {
            yield* dados;
        });
    }
    
    // Criar stream infinito
    static generate(funcaoGeradora) {
        return new StreamProcessor(function* () {
            let i = 0;
            while (true) {
                yield funcaoGeradora(i++);
            }
        });
    }
    
    // Criar range
    static range(inicio, fim, passo = 1) {
        return new StreamProcessor(function* () {
            for (let i = inicio; i <= fim; i += passo) {
                yield i;
            }
        });
    }
    
    // Transformar elementos
    map(funcao) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            for (const item of fonte()) {
                yield funcao(item);
            }
        });
    }
    
    // Filtrar elementos
    filter(predicado) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            for (const item of fonte()) {
                if (predicado(item)) {
                    yield item;
                }
            }
        });
    }
    
    // Pegar quantidade limitada
    take(quantidade) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            let contador = 0;
            for (const item of fonte()) {
                if (contador >= quantidade) break;
                yield item;
                contador++;
            }
        });
    }
    
    // Pular elementos
    skip(quantidade) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            let contador = 0;
            for (const item of fonte()) {
                if (contador >= quantidade) {
                    yield item;
                }
                contador++;
            }
        });
    }
    
    // Achatar streams aninhados
    flatMap(funcao) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            for (const item of fonte()) {
                yield* funcao(item);
            }
        });
    }
    
    // Agrupar em chunks
    chunk(tamanho) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            let chunk = [];
            for (const item of fonte()) {
                chunk.push(item);
                if (chunk.length === tamanho) {
                    yield chunk;
                    chunk = [];
                }
            }
            if (chunk.length > 0) {
                yield chunk;
            }
        });
    }
    
    // Executar efeito colateral
    tap(funcao) {
        const fonte = this.fonte;
        return new StreamProcessor(function* () {
            for (const item of fonte()) {
                funcao(item);
                yield item;
            }
        });
    }
    
    // Reduzir a um valor
    reduce(funcao, valorInicial) {
        let acumulador = valorInicial;
        for (const item of this.fonte()) {
            acumulador = funcao(acumulador, item);
        }
        return acumulador;
    }
    
    // Coletar em array
    toArray() {
        return [...this.fonte()];
    }
    
    // Executar para cada elemento
    forEach(funcao) {
        for (const item of this.fonte()) {
            funcao(item);
        }
    }
    
    // Encontrar primeiro elemento
    find(predicado) {
        for (const item of this.fonte()) {
            if (predicado(item)) {
                return item;
            }
        }
        return undefined;
    }
    
    // Verificar se algum elemento atende condição
    some(predicado) {
        for (const item of this.fonte()) {
            if (predicado(item)) {
                return true;
            }
        }
        return false;
    }
    
    // Verificar se todos elementos atendem condição
    every(predicado) {
        for (const item of this.fonte()) {
            if (!predicado(item)) {
                return false;
            }
        }
        return true;
    }
    
    // Contar elementos
    count() {
        let contador = 0;
        for (const item of this.fonte()) {
            contador++;
        }
        return contador;
    }
    
    // Obter iterador
    [Symbol.iterator]() {
        return this.fonte();
    }
}

// Testando stream processor
console.log('\n🌊 Testando stream processor:');

// Stream simples
const stream1 = StreamProcessor
    .range(1, 20)
    .filter(x => x % 2 === 0)
    .map(x => x * x)
    .take(5);

console.log('Stream 1 (pares ao quadrado, primeiros 5):');
for (const valor of stream1) {
    console.log(valor);
}

// Stream com chunks
console.log('\n📦 Stream com chunks:');
const stream2 = StreamProcessor
    .range(1, 10)
    .chunk(3);

for (const chunk of stream2) {
    console.log('Chunk:', chunk);
}

// Stream infinito com limite
console.log('\n♾️ Stream infinito (primeiros 5 números de Fibonacci):');
const fibStream = StreamProcessor
    .generate(i => {
        if (i === 0) return 0;
        if (i === 1) return 1;
        // Simplificado para demonstração
        return i; // Na prática, calcularia Fibonacci
    })
    .take(5);

for (const fib of fibStream) {
    console.log(`Fib: ${fib}`);
}

// Stream com efeitos colaterais
console.log('\n👁️ Stream com tap (efeitos colaterais):');
const resultado = StreamProcessor
    .from([1, 2, 3, 4, 5])
    .tap(x => console.log(`Processando: ${x}`))
    .map(x => x * 2)
    .tap(x => console.log(`Dobrado: ${x}`))
    .filter(x => x > 5)
    .toArray();

console.log('Resultado final:', resultado);

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA ITERAÇÃO:

1. **Performance de Loops**
   - for tradicional: mais rápido
   - for...of: boa performance, mais legível
   - forEach: overhead de função
   - for...in: mais lento, para objetos

2. **Otimização de For Loops**
   - Cache length em variável
   - Use decremento quando possível
   - Evite operações custosas no loop
   - Considere loop unrolling para casos críticos

3. **Lazy Evaluation**
   - Use generators para datasets grandes
   - Implemente early termination
   - Evite materializar dados desnecessários
   - Combine operações em pipelines

4. **Memory Management**
   - Generators não mantêm todos valores na memória
   - Use iteradores para streams de dados
   - Evite arrays intermediários desnecessários
   - Implemente cleanup quando necessário

5. **Casos Específicos**
   - Use break/continue para controle de fluxo
   - Prefira for...of para iteração de valores
   - Use for...in apenas para propriedades de objeto
   - Considere while para condições complexas
*/

// Exemplo de otimização
console.log('\n⚡ Exemplo de otimização:');

// ❌ Menos eficiente
function processarArrayLento(array) {
    const resultado = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] % 2 === 0) {
            resultado.push(array[i] * array[i]);
        }
    }
    return resultado;
}

// ✅ Mais eficiente - cache length
function processarArrayRapido(array) {
    const resultado = [];
    const length = array.length; // Cache length
    for (let i = 0; i < length; i++) {
        const item = array[i]; // Cache item
        if (item % 2 === 0) {
            resultado.push(item * item);
        }
    }
    return resultado;
}

// ✅ Generator para lazy evaluation
function* processarArrayLazy(array) {
    for (const item of array) {
        if (item % 2 === 0) {
            yield item * item;
        }
    }
}

// Testando performance
const arrayGrande = Array.from({ length: 100000 }, (_, i) => i);

console.time('Processamento lento');
processarArrayLento(arrayGrande.slice(0, 1000));
console.timeEnd('Processamento lento');

console.time('Processamento rápido');
processarArrayRapido(arrayGrande.slice(0, 1000));
console.timeEnd('Processamento rápido');

console.time('Processamento lazy (primeiros 10)');
const lazy = processarArrayLazy(arrayGrande);
const primeiros10 = [];
for (const item of lazy) {
    primeiros10.push(item);
    if (primeiros10.length === 10) break;
}
console.timeEnd('Processamento lazy (primeiros 10)');

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Iteration Protocols: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
- MDN Generators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
- MDN for...of: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
- MDN Symbol.iterator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator

📚 LIVROS RECOMENDADOS:
- "You Don't Know JS: ES6 & Beyond" - Kyle Simpson
- "Exploring ES6" - Dr. Axel Rauschmayer
- "JavaScript: The Definitive Guide" - David Flanagan

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Array methods chaining
2. Async iterators e for await...of
3. Streams e reactive programming
4. Performance optimization
5. Functional programming patterns
6. Data structures customizadas
7. Algorithm implementation
8. Memory management avançado

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente uma estrutura de dados Tree iterável
2. Crie um sistema de parsing de CSV lazy
3. Desenvolva um motor de busca com iteradores
4. Implemente algoritmos de sorting com generators
5. Crie um sistema de cache com lazy loading

🔧 FERRAMENTAS ÚTEIS:
- RxJS para reactive programming
- Lodash para utilitários de iteração
- Immutable.js para estruturas imutáveis
- Benchmark.js para testes de performance
- Memory profilers para análise de memória

⚠️ ARMADILHAS COMUNS:
1. Usar for...in com arrays
2. Não considerar performance em loops críticos
3. Criar generators desnecessariamente complexos
4. Não implementar cleanup em iteradores
5. Confundir iterables com iterators
6. Não usar lazy evaluation quando apropriado
7. Memory leaks em generators infinitos
8. Não validar dados antes de iterar

🎓 CONCEITOS AVANÇADOS:
- Async iterators
- Observable patterns
- Transducers
- Coroutines
- Backpressure handling
*/

console.log('\n✅ Módulo de Iteração de Arrays concluído!');
console.log('📝 Próximo arquivo: 04-array-methods-chain.js');
console.log('🎯 Continue praticando com os exercícios propostos!');

/*
==============================================
RESUMO DO MÓDULO - ITERAÇÃO DE ARRAYS
==============================================

✅ CONCEITOS APRENDIDOS:
- For tradicional e suas variações
- For...of para iteração de valores
- For...in para propriedades de objetos
- While e do-while
- Iteradores customizados
- Symbol.iterator
- Generators e yield
- Lazy evaluation
- Stream processing

🎯 HABILIDADES DESENVOLVIDAS:
- Escolher o tipo de loop apropriado
- Implementar iteradores customizados
- Criar generators eficientes
- Aplicar lazy evaluation
- Otimizar performance de loops
- Processar streams de dados
- Implementar pipelines de transformação

📈 PRÓXIMOS DESAFIOS:
- Array methods chaining
- Async iteration
- Reactive programming
- Performance optimization
- Advanced data structures

==============================================
*/