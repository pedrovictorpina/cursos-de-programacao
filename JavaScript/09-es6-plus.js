/*
===========================================
    CURSO JAVASCRIPT - ES6+ (RECURSOS MODERNOS)
===========================================

Este arquivo aborda:
- Let, const e block scope
- Arrow functions
- Template literals
- Destructuring (arrays e objetos)
- Spread e rest operators
- Default parameters
- Classes ES6+
- Modules (import/export)
- Promises e async/await (revisão)
- Map, Set, WeakMap, WeakSet
- Symbols
- Iterators e Generators
- Proxy e Reflect
- Optional chaining e nullish coalescing
- BigInt
- Dynamic imports
- Private fields

NOTA: Este arquivo contém recursos do ES6 (ES2015) até versões mais recentes.
Alguns recursos podem não funcionar em navegadores muito antigos.
*/

// ========================================
// 1. LET, CONST E BLOCK SCOPE
// ========================================

/*
ES6 introduziu let e const como alternativas ao var,
com escopo de bloco e comportamentos mais previsíveis.
*/

console.log('=== LET, CONST E BLOCK SCOPE ==>');

// Diferenças entre var, let e const
function exemploEscopo() {
    console.log('--- Comparação var vs let ---');
    
    // var: escopo de função, hoisting
    if (true) {
        var varVariable = 'var funciona';
        let letVariable = 'let funciona';
        const constVariable = 'const funciona';
    }
    
    console.log(varVariable); // Funciona - var tem escopo de função
    // console.log(letVariable); // Erro - let tem escopo de bloco
    // console.log(constVariable); // Erro - const tem escopo de bloco
    
    // Hoisting com var vs let/const
    console.log('--- Hoisting ---');
    console.log(varHoisted); // undefined (hoisted)
    // console.log(letHoisted); // Erro - Temporal Dead Zone
    
    var varHoisted = 'var foi hoisted';
    let letHoisted = 'let não foi hoisted';
    
    // const deve ser inicializada
    const CONSTANTE = 'valor imutável';
    // CONSTANTE = 'novo valor'; // Erro - const não pode ser reatribuída
    
    // Mas objetos const podem ter propriedades modificadas
    const objeto = { nome: 'João' };
    objeto.nome = 'Maria'; // Permitido
    objeto.idade = 30; // Permitido
    console.log('Objeto const modificado:', objeto);
    
    // Para tornar objeto realmente imutável
    const objetoImutavel = Object.freeze({ nome: 'Pedro' });
    objetoImutavel.nome = 'Paulo'; // Ignorado em modo não-strict
    console.log('Objeto imutável:', objetoImutavel);
}

exemploEscopo();

// Loop com let vs var
console.log('--- Loops com let vs var ---');

// Problema clássico com var
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log('var i:', i); // Sempre 3
    }, 100);
}

// Solução com let
for (let j = 0; j < 3; j++) {
    setTimeout(() => {
        console.log('let j:', j); // 0, 1, 2
    }, 200);
}

// ========================================
// 2. ARROW FUNCTIONS
// ========================================

console.log('\n=== ARROW FUNCTIONS ==>');

// Sintaxe básica
const funcaoTradicional = function(x, y) {
    return x + y;
};

const arrowFunction = (x, y) => {
    return x + y;
};

// Sintaxe concisa (return implícito)
const arrowConcisa = (x, y) => x + y;

// Um parâmetro (parênteses opcionais)
const quadrado = x => x * x;

// Sem parâmetros
const saudar = () => 'Olá!';

// Retornando objeto (parênteses necessários)
const criarPessoa = (nome, idade) => ({ nome, idade });

console.log('Função tradicional:', funcaoTradicional(2, 3));
console.log('Arrow function:', arrowFunction(2, 3));
console.log('Arrow concisa:', arrowConcisa(2, 3));
console.log('Quadrado:', quadrado(5));
console.log('Saudar:', saudar());
console.log('Criar pessoa:', criarPessoa('Ana', 25));

// Diferenças importantes: this binding
class ExemploThis {
    constructor() {
        this.nome = 'Classe';
        this.numeros = [1, 2, 3];
    }
    
    // Método tradicional
    metodoTradicional() {
        console.log('--- Método tradicional ---');
        console.log('this.nome:', this.nome);
        
        // Problema com function tradicional
        this.numeros.forEach(function(num) {
            // console.log(this.nome, num); // Erro - this é undefined
        });
        
        // Solução com arrow function
        this.numeros.forEach((num) => {
            console.log(this.nome, num); // Funciona - this é preservado
        });
    }
    
    // Arrow function como método (cuidado!)
    metodoArrow = () => {
        console.log('--- Método arrow ---');
        console.log('this.nome:', this.nome); // Funciona, mas...
    }
}

const exemploThis = new ExemploThis();
exemploThis.metodoTradicional();
exemploThis.metodoArrow();

// ========================================
// 3. TEMPLATE LITERALS
// ========================================

console.log('\n=== TEMPLATE LITERALS ==>');

const nome = 'João';
const idade = 30;
const profissao = 'desenvolvedor';

// String tradicional
const apresentacaoTradicional = 'Olá, eu sou ' + nome + ', tenho ' + idade + ' anos e sou ' + profissao + '.';

// Template literal
const apresentacaoModerna = `Olá, eu sou ${nome}, tenho ${idade} anos e sou ${profissao}.`;

console.log('Tradicional:', apresentacaoTradicional);
console.log('Moderna:', apresentacaoModerna);

// Multilinhas
const poema = `
    Roses are red,
    Violets are blue,
    Template literals
    Are awesome too!
`;

console.log('Poema:', poema);

// Expressões complexas
const preco = 29.99;
const desconto = 0.1;
const mensagem = `
    Produto: Livro JavaScript
    Preço original: R$ ${preco.toFixed(2)}
    Desconto: ${(desconto * 100)}%
    Preço final: R$ ${(preco * (1 - desconto)).toFixed(2)}
    ${preco > 20 ? 'Frete grátis!' : 'Frete: R$ 10,00'}
`;

console.log('Mensagem:', mensagem);

// Tagged template literals
function destacar(strings, ...valores) {
    return strings.reduce((resultado, string, i) => {
        const valor = valores[i] ? `<strong>${valores[i]}</strong>` : '';
        return resultado + string + valor;
    }, '');
}

const nomeDestacado = 'Maria';
const idadeDestacada = 25;
const htmlDestacado = destacar`Olá, eu sou ${nomeDestacado} e tenho ${idadeDestacada} anos.`;
console.log('HTML destacado:', htmlDestacado);

// ========================================
// 4. DESTRUCTURING
// ========================================

console.log('\n=== DESTRUCTURING ==>');

// Destructuring de arrays
console.log('--- Arrays ---');
const cores = ['vermelho', 'verde', 'azul', 'amarelo'];

// Forma tradicional
const primeira = cores[0];
const segunda = cores[1];

// Destructuring
const [primeiraCor, segundaCor, terceiraCor] = cores;
console.log('Cores:', primeiraCor, segundaCor, terceiraCor);

// Pular elementos
const [, , azul, amarelo] = cores;
console.log('Azul e amarelo:', azul, amarelo);

// Valores padrão
const [cor1, cor2, cor3, cor4, cor5 = 'roxo'] = cores;
console.log('Quinta cor (padrão):', cor5);

// Rest em arrays
const [primeiraCor2, ...restoCores] = cores;
console.log('Primeira:', primeiraCor2);
console.log('Resto:', restoCores);

// Troca de variáveis
let a = 1;
let b = 2;
console.log('Antes da troca:', { a, b });
[a, b] = [b, a];
console.log('Depois da troca:', { a, b });

// Destructuring de objetos
console.log('--- Objetos ---');
const pessoa = {
    nome: 'Carlos',
    idade: 35,
    profissao: 'engenheiro',
    endereco: {
        rua: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        cep: '01234-567'
    },
    hobbies: ['leitura', 'natação', 'culinária']
};

// Destructuring básico
const { nome: nomePessoa, idade: idadePessoa, profissao: profissaoPessoa } = pessoa;
console.log('Pessoa:', nomePessoa, idadePessoa, profissaoPessoa);

// Shorthand (quando nome da variável = nome da propriedade)
const { nome, idade, profissao } = pessoa;
console.log('Shorthand:', nome, idade, profissao);

// Valores padrão
const { nome: nomeCompleto, salario = 'não informado' } = pessoa;
console.log('Nome e salário:', nomeCompleto, salario);

// Destructuring aninhado
const { endereco: { rua, cidade }, hobbies: [hobby1, hobby2] } = pessoa;
console.log('Endereço:', rua, cidade);
console.log('Hobbies:', hobby1, hobby2);

// Rest em objetos
const { nome: nomeRest, ...outrasPropriedades } = pessoa;
console.log('Nome:', nomeRest);
console.log('Outras propriedades:', outrasPropriedades);

// Destructuring em parâmetros de função
function apresentarPessoa({ nome, idade, profissao = 'não informada' }) {
    return `${nome}, ${idade} anos, ${profissao}`;
}

console.log('Apresentação:', apresentarPessoa(pessoa));

// ========================================
// 5. SPREAD E REST OPERATORS
// ========================================

console.log('\n=== SPREAD E REST OPERATORS ==>');

// Spread com arrays
console.log('--- Spread Arrays ---');
const numeros1 = [1, 2, 3];
const numeros2 = [4, 5, 6];

// Concatenação tradicional
const concatenacaoTradicional = numeros1.concat(numeros2);

// Spread
const concatenacaoSpread = [...numeros1, ...numeros2];
const comElementosExtras = [0, ...numeros1, 3.5, ...numeros2, 7];

console.log('Tradicional:', concatenacaoTradicional);
console.log('Spread:', concatenacaoSpread);
console.log('Com extras:', comElementosExtras);

// Cópia de array
const copiaNumeros = [...numeros1];
copiaNumeros.push(4);
console.log('Original:', numeros1);
console.log('Cópia modificada:', copiaNumeros);

// Spread com objetos
console.log('--- Spread Objetos ---');
const dadosBasicos = { nome: 'Ana', idade: 28 };
const dadosCompletos = {
    ...dadosBasicos,
    profissao: 'designer',
    cidade: 'Rio de Janeiro'
};

console.log('Dados básicos:', dadosBasicos);
console.log('Dados completos:', dadosCompletos);

// Sobrescrevendo propriedades
const dadosAtualizados = {
    ...dadosCompletos,
    idade: 29, // Sobrescreve
    salario: 5000 // Adiciona
};

console.log('Dados atualizados:', dadosAtualizados);

// Rest parameters
console.log('--- Rest Parameters ---');
function somar(...numeros) {
    return numeros.reduce((total, num) => total + num, 0);
}

function logComPrefixo(prefixo, ...mensagens) {
    mensagens.forEach(msg => console.log(`${prefixo}: ${msg}`));
}

console.log('Soma:', somar(1, 2, 3, 4, 5));
logComPrefixo('INFO', 'Sistema iniciado', 'Usuário logado', 'Dados carregados');

// ========================================
// 6. DEFAULT PARAMETERS
// ========================================

console.log('\n=== DEFAULT PARAMETERS ==>');

// Forma tradicional
function saudarTradicional(nome, saudacao) {
    saudacao = saudacao || 'Olá';
    return saudacao + ', ' + nome + '!';
}

// Default parameters
function saudarModerno(nome, saudacao = 'Olá', pontuacao = '!') {
    return `${saudacao}, ${nome}${pontuacao}`;
}

// Valores padrão podem ser expressões
function criarUsuario(nome, id = Date.now(), ativo = true) {
    return { nome, id, ativo };
}

// Valores padrão podem usar parâmetros anteriores
function criarRetangulo(largura, altura = largura) {
    return { largura, altura, area: largura * altura };
}

console.log('Tradicional:', saudarTradicional('João'));
console.log('Moderno:', saudarModerno('Maria'));
console.log('Com parâmetros:', saudarModerno('Pedro', 'Oi', '!!!'));
console.log('Usuário:', criarUsuario('Ana'));
console.log('Retângulo quadrado:', criarRetangulo(5));
console.log('Retângulo:', criarRetangulo(4, 6));

// ========================================
// 7. CLASSES ES6+
// ========================================

console.log('\n=== CLASSES ES6+ ==>');

// Classe básica
class Animal {
    constructor(nome, especie) {
        this.nome = nome;
        this.especie = especie;
        this._energia = 100; // Convenção para propriedade "privada"
    }
    
    // Método de instância
    falar() {
        return `${this.nome} faz um som`;
    }
    
    // Getter
    get energia() {
        return this._energia;
    }
    
    // Setter
    set energia(valor) {
        if (valor >= 0 && valor <= 100) {
            this._energia = valor;
        } else {
            console.log('Energia deve estar entre 0 e 100');
        }
    }
    
    // Método estático
    static compararAnimais(animal1, animal2) {
        return animal1.especie === animal2.especie;
    }
    
    // Método privado (ES2022)
    #calcularIdade() {
        // Implementação privada
        return Math.floor(Math.random() * 10) + 1;
    }
    
    obterIdade() {
        return this.#calcularIdade();
    }
}

// Herança
class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome, 'Cachorro'); // Chama construtor da classe pai
        this.raca = raca;
    }
    
    // Sobrescrevendo método
    falar() {
        return `${this.nome} late: Au au!`;
    }
    
    // Método específico
    buscarBola() {
        this.energia -= 10;
        return `${this.nome} busca a bola!`;
    }
}

class Gato extends Animal {
    constructor(nome, cor) {
        super(nome, 'Gato');
        this.cor = cor;
    }
    
    falar() {
        return `${this.nome} mia: Miau!`;
    }
    
    arranhar() {
        return `${this.nome} arranha o sofá`;
    }
}

// Uso das classes
const animal = new Animal('Rex', 'Desconhecido');
const cachorro = new Cachorro('Buddy', 'Golden Retriever');
const gato = new Gato('Whiskers', 'Preto');

console.log('Animal genérico:', animal.falar());
console.log('Cachorro:', cachorro.falar());
console.log('Gato:', gato.falar());

console.log('Buscar bola:', cachorro.buscarBola());
console.log('Energia do cachorro:', cachorro.energia);

cachorro.energia = 90;
console.log('Nova energia:', cachorro.energia);

console.log('Arranhar:', gato.arranhar());
console.log('Comparar animais:', Animal.compararAnimais(cachorro, gato));
console.log('Idade do animal:', animal.obterIdade());

// Classe com campos privados (ES2022)
class ContaBancaria {
    #saldo = 0; // Campo privado
    #historico = []; // Campo privado
    
    constructor(titular) {
        this.titular = titular;
    }
    
    depositar(valor) {
        if (valor > 0) {
            this.#saldo += valor;
            this.#historico.push({ tipo: 'depósito', valor, data: new Date() });
            return true;
        }
        return false;
    }
    
    sacar(valor) {
        if (valor > 0 && valor <= this.#saldo) {
            this.#saldo -= valor;
            this.#historico.push({ tipo: 'saque', valor, data: new Date() });
            return true;
        }
        return false;
    }
    
    get saldo() {
        return this.#saldo;
    }
    
    get extrato() {
        return [...this.#historico]; // Retorna cópia
    }
}

const conta = new ContaBancaria('João Silva');
conta.depositar(1000);
conta.sacar(200);
console.log('Saldo da conta:', conta.saldo);
console.log('Extrato:', conta.extrato);

// ========================================
// 8. MODULES (IMPORT/EXPORT)
// ========================================

/*
Este é um exemplo de como usar modules.
Em um ambiente real, você teria arquivos separados.
*/

console.log('\n=== MODULES ==>');

// Exemplo de exports (em um arquivo separado)
/*
// math.js
export const PI = 3.14159;

export function somar(a, b) {
    return a + b;
}

export function multiplicar(a, b) {
    return a * b;
}

export default function dividir(a, b) {
    return b !== 0 ? a / b : null;
}

export class Calculadora {
    static somar(a, b) {
        return a + b;
    }
}
*/

// Exemplo de imports (em outro arquivo)
/*
// main.js
import dividir, { PI, somar, multiplicar, Calculadora } from './math.js';
import * as Math from './math.js';
import { somar as adicionar } from './math.js';

console.log('PI:', PI);
console.log('Soma:', somar(2, 3));
console.log('Multiplicação:', multiplicar(4, 5));
console.log('Divisão:', dividir(10, 2));
console.log('Calculadora:', Calculadora.somar(1, 1));
*/

// Dynamic imports (ES2020)
async function carregarModulo() {
    try {
        // const modulo = await import('./meu-modulo.js');
        // console.log('Módulo carregado:', modulo);
        console.log('Dynamic import seria usado aqui');
    } catch (erro) {
        console.error('Erro ao carregar módulo:', erro);
    }
}

// ========================================
// 9. MAP, SET, WEAKMAP, WEAKSET
// ========================================

console.log('\n=== MAP, SET, WEAKMAP, WEAKSET ==>');

// Map - coleção de chave-valor
console.log('--- Map ---');
const mapa = new Map();

// Adicionar elementos
mapa.set('nome', 'João');
mapa.set('idade', 30);
mapa.set(1, 'número um');
mapa.set(true, 'booleano verdadeiro');

// Chaves podem ser objetos
const chaveObjeto = { id: 1 };
mapa.set(chaveObjeto, 'valor do objeto');

console.log('Tamanho do mapa:', mapa.size);
console.log('Valor para "nome":', mapa.get('nome'));
console.log('Tem chave "idade":', mapa.has('idade'));

// Iterar sobre Map
console.log('--- Iteração Map ---');
for (const [chave, valor] of mapa) {
    console.log(`${chave}: ${valor}`);
}

// Métodos úteis
mapa.forEach((valor, chave) => {
    console.log(`forEach - ${chave}: ${valor}`);
});

console.log('Chaves:', Array.from(mapa.keys()));
console.log('Valores:', Array.from(mapa.values()));

// Set - coleção de valores únicos
console.log('--- Set ---');
const conjunto = new Set();

// Adicionar elementos
conjunto.add(1);
conjunto.add(2);
conjunto.add(2); // Duplicata ignorada
conjunto.add('texto');
conjunto.add({ id: 1 });

console.log('Tamanho do conjunto:', conjunto.size);
console.log('Tem valor 2:', conjunto.has(2));

// Converter array para Set (remove duplicatas)
const numerosComDuplicatas = [1, 2, 2, 3, 3, 3, 4];
const numerosSemDuplicatas = [...new Set(numerosComDuplicatas)];
console.log('Array sem duplicatas:', numerosSemDuplicatas);

// Iterar sobre Set
for (const valor of conjunto) {
    console.log('Valor do conjunto:', valor);
}

// WeakMap - chaves devem ser objetos, não enumerable
console.log('--- WeakMap ---');
const mapaFraco = new WeakMap();
const obj1 = { id: 1 };
const obj2 = { id: 2 };

mapaFraco.set(obj1, 'dados do objeto 1');
mapaFraco.set(obj2, 'dados do objeto 2');

console.log('WeakMap obj1:', mapaFraco.get(obj1));
console.log('WeakMap tem obj2:', mapaFraco.has(obj2));

// WeakSet - valores devem ser objetos, não enumerable
console.log('--- WeakSet ---');
const conjuntoFraco = new WeakSet();
conjuntoFraco.add(obj1);
conjuntoFraco.add(obj2);

console.log('WeakSet tem obj1:', conjuntoFraco.has(obj1));

// ========================================
// 10. SYMBOLS
// ========================================

console.log('\n=== SYMBOLS ==>');

// Criar symbols
const sym1 = Symbol();
const sym2 = Symbol('descrição');
const sym3 = Symbol('descrição');

console.log('sym1:', sym1);
console.log('sym2:', sym2);
console.log('sym2 === sym3:', sym2 === sym3); // false - cada symbol é único

// Symbols como chaves de propriedades
const ID = Symbol('id');
const NOME = Symbol('nome');

const usuario = {
    [ID]: 123,
    [NOME]: 'João',
    email: 'joao@email.com'
};

console.log('Usuário:', usuario);
console.log('ID do usuário:', usuario[ID]);
console.log('Nome do usuário:', usuario[NOME]);

// Symbols não aparecem em Object.keys()
console.log('Chaves do objeto:', Object.keys(usuario));
console.log('Symbols do objeto:', Object.getOwnPropertySymbols(usuario));

// Symbol.for() - registry global
const symGlobal1 = Symbol.for('app.id');
const symGlobal2 = Symbol.for('app.id');
console.log('Symbols globais iguais:', symGlobal1 === symGlobal2); // true

// Well-known symbols
class MinhaClasse {
    constructor(items) {
        this.items = items;
    }
    
    // Tornar a classe iterável
    *[Symbol.iterator]() {
        for (const item of this.items) {
            yield item;
        }
    }
    
    // Customizar toString
    [Symbol.toStringTag] = 'MinhaClasse';
}

const minhaInstancia = new MinhaClasse([1, 2, 3]);
console.log('Iterando sobre MinhaClasse:');
for (const item of minhaInstancia) {
    console.log('Item:', item);
}
console.log('toString customizado:', minhaInstancia.toString());

// ========================================
// 11. ITERATORS E GENERATORS
// ========================================

console.log('\n=== ITERATORS E GENERATORS ==>');

// Iterator customizado
function criarIterador(array) {
    let index = 0;
    
    return {
        next() {
            if (index < array.length) {
                return { value: array[index++], done: false };
            } else {
                return { done: true };
            }
        }
    };
}

const iterador = criarIterador([1, 2, 3]);
console.log('Iterator manual:');
console.log(iterador.next()); // { value: 1, done: false }
console.log(iterador.next()); // { value: 2, done: false }
console.log(iterador.next()); // { value: 3, done: false }
console.log(iterador.next()); // { done: true }

// Generator function
function* gerarNumeros() {
    console.log('Gerando 1');
    yield 1;
    console.log('Gerando 2');
    yield 2;
    console.log('Gerando 3');
    yield 3;
    console.log('Fim do generator');
}

const generator = gerarNumeros();
console.log('Generator:');
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { done: true }

// Generator infinito
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

const fib = fibonacci();
console.log('Fibonacci:');
for (let i = 0; i < 10; i++) {
    console.log(fib.next().value);
}

// Generator com yield*
function* gerarLetras() {
    yield 'A';
    yield 'B';
    yield 'C';
}

function* gerarAlfanumerico() {
    yield* gerarNumeros();
    yield* gerarLetras();
}

console.log('Alfanumérico:');
for (const valor of gerarAlfanumerico()) {
    console.log(valor);
}

// ========================================
// 12. PROXY E REFLECT
// ========================================

console.log('\n=== PROXY E REFLECT ==>');

// Proxy básico
const alvo = {
    nome: 'João',
    idade: 30
};

const proxy = new Proxy(alvo, {
    get(target, property) {
        console.log(`Acessando propriedade: ${property}`);
        return Reflect.get(target, property);
    },
    
    set(target, property, value) {
        console.log(`Definindo ${property} = ${value}`);
        
        // Validação
        if (property === 'idade' && typeof value !== 'number') {
            throw new Error('Idade deve ser um número');
        }
        
        return Reflect.set(target, property, value);
    },
    
    has(target, property) {
        console.log(`Verificando se tem propriedade: ${property}`);
        return Reflect.has(target, property);
    }
});

console.log('Nome via proxy:', proxy.nome);
proxy.idade = 31;
console.log('Tem propriedade nome:', 'nome' in proxy);

// Proxy para array com índices negativos
function criarArrayComIndicesNegativos(array) {
    return new Proxy(array, {
        get(target, property) {
            if (typeof property === 'string' && /^-\d+$/.test(property)) {
                const index = target.length + parseInt(property);
                return target[index];
            }
            return Reflect.get(target, property);
        }
    });
}

const arrayProxy = criarArrayComIndicesNegativos([1, 2, 3, 4, 5]);
console.log('Último elemento:', arrayProxy[-1]); // 5
console.log('Penúltimo elemento:', arrayProxy[-2]); // 4

// ========================================
// 13. OPTIONAL CHAINING E NULLISH COALESCING
// ========================================

console.log('\n=== OPTIONAL CHAINING E NULLISH COALESCING ==>');

// Objeto para teste
const usuarioCompleto = {
    nome: 'Maria',
    endereco: {
        rua: 'Rua das Flores',
        numero: 123,
        cidade: {
            nome: 'São Paulo',
            estado: 'SP'
        }
    },
    telefones: ['11999999999', '1133333333'],
    obterEmail() {
        return 'maria@email.com';
    }
};

const usuarioIncompleto = {
    nome: 'João'
};

// Optional chaining (?.) - ES2020
console.log('--- Optional Chaining ---');

// Acesso seguro a propriedades aninhadas
console.log('Cidade (completo):', usuarioCompleto.endereco?.cidade?.nome);
console.log('Cidade (incompleto):', usuarioIncompleto.endereco?.cidade?.nome); // undefined

// Acesso seguro a arrays
console.log('Primeiro telefone (completo):', usuarioCompleto.telefones?.[0]);
console.log('Primeiro telefone (incompleto):', usuarioIncompleto.telefones?.[0]); // undefined

// Chamada segura de métodos
console.log('Email (completo):', usuarioCompleto.obterEmail?.());
console.log('Email (incompleto):', usuarioIncompleto.obterEmail?.()); // undefined

// Nullish coalescing (??) - ES2020
console.log('--- Nullish Coalescing ---');

const config = {
    tema: null,
    debug: false,
    timeout: 0
};

// Diferença entre || e ??
console.log('Tema com ||:', config.tema || 'padrão'); // 'padrão'
console.log('Tema com ??:', config.tema ?? 'padrão'); // 'padrão'

console.log('Debug com ||:', config.debug || true); // true (problema!)
console.log('Debug com ??:', config.debug ?? true); // false (correto!)

console.log('Timeout com ||:', config.timeout || 5000); // 5000 (problema!)
console.log('Timeout com ??:', config.timeout ?? 5000); // 0 (correto!)

// Combinando optional chaining com nullish coalescing
const cidadeUsuario = usuarioIncompleto.endereco?.cidade?.nome ?? 'Cidade não informada';
console.log('Cidade do usuário:', cidadeUsuario);

// ========================================
// 14. BIGINT
// ========================================

console.log('\n=== BIGINT ==>');

// Números muito grandes
const numeroGrande = 9007199254740991n; // Sufixo 'n'
const outroNumeroGrande = BigInt('9007199254740992');

console.log('Número grande:', numeroGrande);
console.log('Outro número grande:', outroNumeroGrande);

// Operações com BigInt
const soma = numeroGrande + outroNumeroGrande;
const multiplicacao = numeroGrande * 2n;

console.log('Soma BigInt:', soma);
console.log('Multiplicação BigInt:', multiplicacao);

// Não pode misturar BigInt com Number
// console.log(numeroGrande + 1); // Erro!
console.log('BigInt + Number:', numeroGrande + BigInt(1));

// Conversões
console.log('BigInt para Number:', Number(numeroGrande));
console.log('Number para BigInt:', BigInt(123));

// ========================================
// 15. EXEMPLO PRÁTICO: SISTEMA DE EVENTOS
// ========================================

console.log('\n=== EXEMPLO PRÁTICO: SISTEMA DE EVENTOS ==>');

class EventEmitter {
    #listeners = new Map();
    
    on(evento, callback) {
        if (!this.#listeners.has(evento)) {
            this.#listeners.set(evento, new Set());
        }
        this.#listeners.get(evento).add(callback);
        return this; // Permite chaining
    }
    
    off(evento, callback) {
        this.#listeners.get(evento)?.delete(callback);
        return this;
    }
    
    emit(evento, ...args) {
        const callbacks = this.#listeners.get(evento);
        if (callbacks) {
            for (const callback of callbacks) {
                try {
                    callback(...args);
                } catch (erro) {
                    console.error('Erro no callback:', erro);
                }
            }
        }
        return this;
    }
    
    once(evento, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(evento, wrapper);
        };
        return this.on(evento, wrapper);
    }
    
    listenerCount(evento) {
        return this.#listeners.get(evento)?.size ?? 0;
    }
    
    removeAllListeners(evento) {
        if (evento) {
            this.#listeners.delete(evento);
        } else {
            this.#listeners.clear();
        }
        return this;
    }
}

// Uso do EventEmitter
const emitter = new EventEmitter();

// Adicionar listeners
emitter
    .on('usuario:login', (usuario) => {
        console.log(`Usuário ${usuario.nome} fez login`);
    })
    .on('usuario:login', (usuario) => {
        console.log(`Registrando acesso de ${usuario.nome}`);
    })
    .once('sistema:inicializado', () => {
        console.log('Sistema inicializado (só executa uma vez)');
    });

// Emitir eventos
emitter.emit('usuario:login', { nome: 'João', id: 1 });
emitter.emit('sistema:inicializado');
emitter.emit('sistema:inicializado'); // Não executa novamente

console.log('Listeners para usuario:login:', emitter.listenerCount('usuario:login'));

// ========================================
// 16. EXEMPLO PRÁTICO: CACHE AVANÇADO
// ========================================

class CacheAvancado {
    #cache = new Map();
    #maxSize;
    #ttl;
    
    constructor({ maxSize = 100, ttl = 300000 } = {}) {
        this.#maxSize = maxSize;
        this.#ttl = ttl;
        
        // Limpeza automática
        setInterval(() => this.#limpezaAutomatica(), ttl / 2);
    }
    
    set(chave, valor, ttlCustom) {
        const agora = Date.now();
        const expiresAt = agora + (ttlCustom ?? this.#ttl);
        
        // Remover item mais antigo se necessário
        if (this.#cache.size >= this.#maxSize && !this.#cache.has(chave)) {
            const primeiraChave = this.#cache.keys().next().value;
            this.#cache.delete(primeiraChave);
        }
        
        this.#cache.set(chave, {
            valor,
            createdAt: agora,
            expiresAt,
            accessCount: 0
        });
        
        return this;
    }
    
    get(chave) {
        const item = this.#cache.get(chave);
        
        if (!item) {
            return undefined;
        }
        
        // Verificar expiração
        if (Date.now() > item.expiresAt) {
            this.#cache.delete(chave);
            return undefined;
        }
        
        // Atualizar estatísticas
        item.accessCount++;
        
        // Mover para o final (LRU)
        this.#cache.delete(chave);
        this.#cache.set(chave, item);
        
        return item.valor;
    }
    
    has(chave) {
        return this.get(chave) !== undefined;
    }
    
    delete(chave) {
        return this.#cache.delete(chave);
    }
    
    clear() {
        this.#cache.clear();
        return this;
    }
    
    get size() {
        return this.#cache.size;
    }
    
    getStats() {
        const agora = Date.now();
        let expired = 0;
        let totalAccess = 0;
        
        for (const [chave, item] of this.#cache) {
            if (agora > item.expiresAt) {
                expired++;
            }
            totalAccess += item.accessCount;
        }
        
        return {
            size: this.#cache.size,
            maxSize: this.#maxSize,
            expired,
            totalAccess,
            hitRate: totalAccess / (totalAccess + expired) || 0
        };
    }
    
    #limpezaAutomatica() {
        const agora = Date.now();
        const chavesExpiradas = [];
        
        for (const [chave, item] of this.#cache) {
            if (agora > item.expiresAt) {
                chavesExpiradas.push(chave);
            }
        }
        
        chavesExpiradas.forEach(chave => this.#cache.delete(chave));
        
        if (chavesExpiradas.length > 0) {
            console.log(`Cache: ${chavesExpiradas.length} itens expirados removidos`);
        }
    }
}

// Teste do cache avançado
const cache = new CacheAvancado({ maxSize: 3, ttl: 2000 });

cache
    .set('user:1', { nome: 'João', idade: 30 })
    .set('user:2', { nome: 'Maria', idade: 25 })
    .set('user:3', { nome: 'Pedro', idade: 35 });

console.log('Usuário 1:', cache.get('user:1'));
console.log('Usuário 2:', cache.get('user:2'));
console.log('Stats do cache:', cache.getStats());

// Adicionar mais um item (deve remover o mais antigo)
cache.set('user:4', { nome: 'Ana', idade: 28 });
console.log('Usuário 3 após adicionar user:4:', cache.get('user:3')); // undefined

// ========================================
// 17. INICIALIZAÇÃO E EXERCÍCIOS
// ========================================

// Função principal para demonstrar recursos
function demonstrarRecursosES6() {
    console.log('\n=== DEMONSTRAÇÃO COMPLETA DOS RECURSOS ES6+ ==>');
    
    // Usar vários recursos juntos
    const criarSistemaUsuarios = () => {
        const usuarios = new Map();
        const eventos = new EventEmitter();
        
        return {
            async adicionarUsuario(dadosUsuario) {
                const { nome, email, idade = 18, ...outrosDados } = dadosUsuario;
                
                if (!nome || !email) {
                    throw new Error('Nome e email são obrigatórios');
                }
                
                const id = Symbol('userId');
                const usuario = {
                    [id]: Date.now(),
                    nome,
                    email,
                    idade,
                    ...outrosDados,
                    criadoEm: new Date()
                };
                
                usuarios.set(email, usuario);
                eventos.emit('usuario:adicionado', usuario);
                
                return usuario;
            },
            
            obterUsuario(email) {
                return usuarios.get(email);
            },
            
            listarUsuarios() {
                return [...usuarios.values()];
            },
            
            on: eventos.on.bind(eventos),
            off: eventos.off.bind(eventos)
        };
    };
    
    const sistema = criarSistemaUsuarios();
    
    // Event listener
    sistema.on('usuario:adicionado', (usuario) => {
        console.log(`✓ Usuário ${usuario.nome} adicionado ao sistema`);
    });
    
    // Adicionar usuários
    sistema.adicionarUsuario({
        nome: 'João Silva',
        email: 'joao@email.com',
        profissao: 'Desenvolvedor'
    });
    
    sistema.adicionarUsuario({
        nome: 'Maria Santos',
        email: 'maria@email.com',
        idade: 28,
        cidade: 'São Paulo'
    });
    
    console.log('Usuários no sistema:', sistema.listarUsuarios().length);
}

// Executar demonstração
demonstrarRecursosES6();

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

EXERCÍCIO 1: Sistema de Validação Avançado
Crie um sistema que:
- Use classes com campos privados
- Implemente validadores usando Proxy
- Use Symbols para metadados
- Suporte validação assíncrona
- Tenha sistema de eventos para notificações

EXERCÍCIO 2: ORM Simples
Implemente:
- Classes para modelos de dados
- Sistema de relacionamentos
- Query builder usando template literals
- Cache com Map/WeakMap
- Migrations usando generators

EXERCÍCIO 3: Sistema de Módulos Dinâmicos
Crie:
- Carregamento dinâmico de módulos
- Sistema de dependências
- Hot reload para desenvolvimento
- Lazy loading com Proxy
- Versionamento de módulos

EXERCÍCIO 4: Framework de Testes
Implemente:
- DSL usando template literals
- Mocks com Proxy
- Async testing com generators
- Relatórios com Map/Set
- Hooks usando Symbols

EXERCÍCIO 5: State Management
Crie:
- Store imutável com Proxy
- Middleware system
- Time travel debugging
- Subscription system com WeakMap
- DevTools integration
*/

/*
========================================
BOAS PRÁTICAS E DICAS
========================================

COMPATIBILidade:
1. Use Babel para transpilação em projetos legados
2. Verifique suporte do navegador no caniuse.com
3. Use polyfills quando necessário
4. Configure ESLint para ES6+
5. Use TypeScript para type safety

PERFORMANCE:
1. Use const por padrão, let quando necessário
2. Prefira arrow functions para callbacks
3. Use destructuring para extrair dados
4. Aproveite template literals para strings
5. Use Map/Set para coleções quando apropriado

LEGIBILIDADE:
1. Use nomes descritivos para variáveis
2. Prefira destructuring a acesso por índice
3. Use default parameters em vez de verificações
4. Combine spread/rest para APIs flexíveis
5. Use optional chaining para acesso seguro

MANUTENÇÃO:
1. Organize código em módulos pequenos
2. Use classes para encapsular comportamento
3. Implemente proper error handling
4. Documente APIs públicas
5. Escreva testes para recursos críticos

SEGURANÇA:
1. Valide dados de entrada
2. Use Symbols para propriedades privadas
3. Implemente proper sanitization
4. Evite eval() e Function()
5. Use CSP headers em aplicações web

TESTES:
1. Teste recursos ES6+ separadamente
2. Mock módulos dinâmicos
3. Teste edge cases com Proxy
4. Valide memory leaks com WeakMap/WeakSet
5. Use ferramentas de coverage
*/

console.log("\n=== ARQUIVO 09: ES6+ CONCLUÍDO ===");
console.log("Próximo: Arquivos de Design Patterns, Testes e Debugging");
console.log("\nNOTA: Alguns recursos podem não funcionar em navegadores muito antigos. Use transpilação quando necessário.");