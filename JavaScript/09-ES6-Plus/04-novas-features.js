/*
===========================================
    MÓDULO 09 - ES6+ (ECMASCRIPT 2015+)
    Aula 04: Novas Features do ES6+
===========================================

Objetivos de Aprendizagem:
✓ Dominar arrow functions e suas nuances
✓ Usar classes ES6 e herança
✓ Trabalhar com Symbols e iterators
✓ Aplicar Map, Set e WeakMap/WeakSet
✓ Usar Proxy e Reflect
✓ Implementar generators e async generators
✓ Explorar features ES2017+ (async/await, optional chaining, etc.)
*/

// ===========================================
// 1. ARROW FUNCTIONS
// ===========================================

console.log('=== ARROW FUNCTIONS ===');

/*
ARROW FUNCTIONS:

1. SINTAXE:
   - () => expression
   - param => expression
   - (param1, param2) => expression
   - (param1, param2) => { statements }

2. CARACTERÍSTICAS:
   - Não têm seu próprio 'this'
   - Não podem ser usadas como construtores
   - Não têm 'arguments' object
   - Mais concisas que function expressions

3. CASOS DE USO:
   - Callbacks
   - Array methods
   - Event handlers (com cuidado)
   - Functional programming
*/

// --- 1.1 Sintaxe Básica ---
console.log('\n--- Sintaxe de Arrow Functions ---');

// Função tradicional vs Arrow function
const tradicional = function(x) {
    return x * 2;
};

const arrow = x => x * 2;

console.log('Tradicional:', tradicional(5));
console.log('Arrow:', arrow(5));

// Múltiplos parâmetros
const soma = (a, b) => a + b;
const multiplicacao = (a, b) => {
    const resultado = a * b;
    console.log(`${a} × ${b} = ${resultado}`);
    return resultado;
};

console.log('Soma:', soma(3, 4));
console.log('Multiplicação:', multiplicacao(3, 4));

// --- 1.2 Comportamento do 'this' ---
console.log('\n--- Comportamento do this ---');

class ContadorTradicional {
    constructor() {
        this.count = 0;
    }
    
    // Problema com função tradicional
    iniciarProblematico() {
        setInterval(function() {
            this.count++; // 'this' não aponta para a instância
            console.log('Problemático:', this.count); // undefined ou erro
        }, 1000);
    }
    
    // Solução com arrow function
    iniciarCorreto() {
        setInterval(() => {
            this.count++; // 'this' aponta para a instância
            console.log('Correto:', this.count);
        }, 1000);
    }
    
    // Solução tradicional com bind
    iniciarComBind() {
        setInterval(function() {
            this.count++;
            console.log('Com bind:', this.count);
        }.bind(this), 1000);
    }
}

// Demonstração (comentado para não executar)
// const contador = new ContadorTradicional();
// contador.iniciarCorreto();

// --- 1.3 Array Methods com Arrow Functions ---
console.log('\n--- Array Methods com Arrow Functions ---');

const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map
const quadrados = numeros.map(n => n ** 2);
console.log('Quadrados:', quadrados);

// Filter
const pares = numeros.filter(n => n % 2 === 0);
console.log('Pares:', pares);

// Reduce
const soma_total = numeros.reduce((acc, n) => acc + n, 0);
console.log('Soma total:', soma_total);

// Chaining
const resultado = numeros
    .filter(n => n > 5)
    .map(n => n * 2)
    .reduce((acc, n) => acc + n, 0);

console.log('Resultado do chaining:', resultado);

// ===========================================
// 2. CLASSES ES6
// ===========================================

console.log('\n=== CLASSES ES6 ===');

/*
CLASSES ES6:

1. CARACTERÍSTICAS:
   - Syntactic sugar sobre prototypes
   - Hoisting diferente (temporal dead zone)
   - Sempre em strict mode
   - Constructor method
   - Static methods
   - Getters e setters

2. HERANÇA:
   - extends keyword
   - super() calls
   - Method overriding
   - Private fields (#)
*/

// --- 2.1 Classe Básica ---
class Pessoa {
    // Private fields (ES2022)
    #id;
    #senha;
    
    constructor(nome, idade, email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
        this.#id = Math.random().toString(36).substr(2, 9);
        this.#senha = null;
        this.criadoEm = new Date();
    }
    
    // Getter
    get info() {
        return `${this.nome} (${this.idade} anos)`;
    }
    
    // Setter
    set senha(novaSenha) {
        if (novaSenha.length < 6) {
            throw new Error('Senha deve ter pelo menos 6 caracteres');
        }
        this.#senha = this.#hashSenha(novaSenha);
    }
    
    // Método privado
    #hashSenha(senha) {
        // Simulação de hash (use bcrypt em produção)
        return btoa(senha + this.#id);
    }
    
    // Método público
    verificarSenha(senha) {
        return this.#hashSenha(senha) === this.#senha;
    }
    
    // Método público
    cumprimentar() {
        return `Olá, eu sou ${this.nome}!`;
    }
    
    // Método estático
    static criarAnonimo() {
        return new Pessoa('Anônimo', 0, 'anonimo@example.com');
    }
    
    // Método estático para validação
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // toString override
    toString() {
        return `Pessoa(${this.nome}, ${this.idade})`;
    }
}

// --- 2.2 Herança ---
class Funcionario extends Pessoa {
    constructor(nome, idade, email, cargo, salario) {
        super(nome, idade, email); // Chamar constructor da classe pai
        this.cargo = cargo;
        this.salario = salario;
        this.dataAdmissao = new Date();
    }
    
    // Override do getter
    get info() {
        return `${super.info} - ${this.cargo}`;
    }
    
    // Método específico
    calcularSalarioAnual() {
        return this.salario * 12;
    }
    
    // Override do cumprimentar
    cumprimentar() {
        return `${super.cumprimentar()} Eu trabalho como ${this.cargo}.`;
    }
    
    // Método estático
    static criarEstagiario(nome, idade, email) {
        return new Funcionario(nome, idade, email, 'Estagiário', 1000);
    }
}

// --- 2.3 Demonstração das Classes ---
console.log('\n--- Demonstração de Classes ---');

// Criar instâncias
const pessoa = new Pessoa('Maria', 30, 'maria@example.com');
console.log('Pessoa:', pessoa.info);
console.log('Cumprimento:', pessoa.cumprimentar());

// Testar senha
try {
    pessoa.senha = '123456';
    console.log('Senha definida com sucesso');
    console.log('Verificação senha correta:', pessoa.verificarSenha('123456'));
    console.log('Verificação senha incorreta:', pessoa.verificarSenha('wrong'));
} catch (error) {
    console.error('Erro ao definir senha:', error.message);
}

// Funcionário
const funcionario = new Funcionario('João', 25, 'joao@company.com', 'Desenvolvedor', 5000);
console.log('Funcionário:', funcionario.info);
console.log('Salário anual:', funcionario.calcularSalarioAnual());
console.log('Cumprimento:', funcionario.cumprimentar());

// Métodos estáticos
const anonimo = Pessoa.criarAnonimo();
console.log('Anônimo:', anonimo.toString());

const estagiario = Funcionario.criarEstagiario('Pedro', 20, 'pedro@company.com');
console.log('Estagiário:', estagiario.info);

console.log('Email válido:', Pessoa.validarEmail('test@example.com'));
console.log('Email inválido:', Pessoa.validarEmail('invalid-email'));

// ===========================================
// 3. SYMBOLS
// ===========================================

console.log('\n=== SYMBOLS ===');

/*
SYMBOLS:

1. CARACTERÍSTICAS:
   - Tipo primitivo único
   - Sempre únicos
   - Não enumeráveis por padrão
   - Usados como chaves de propriedades

2. CASOS DE USO:
   - Propriedades privadas (antes de #)
   - Metadados
   - Protocolos (iterators, etc.)
   - Evitar colisões de nomes
*/

// --- 3.1 Criação e Uso Básico ---
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log('sym1:', sym1);
console.log('sym2:', sym2);
console.log('sym2 === sym3:', sym2 === sym3); // false - sempre únicos

// --- 3.2 Symbols como Chaves ---
const PRIVATE_PROP = Symbol('private');
const METADATA = Symbol('metadata');

class ExemploSymbol {
    constructor(valor) {
        this.valor = valor;
        this[PRIVATE_PROP] = 'Propriedade privada';
        this[METADATA] = {
            criado: new Date(),
            versao: '1.0'
        };
    }
    
    getPrivate() {
        return this[PRIVATE_PROP];
    }
    
    getMetadata() {
        return this[METADATA];
    }
}

const exemplo = new ExemploSymbol('teste');
console.log('Valor público:', exemplo.valor);
console.log('Propriedade privada:', exemplo.getPrivate());
console.log('Metadata:', exemplo.getMetadata());

// Symbols não aparecem em Object.keys()
console.log('Object.keys():', Object.keys(exemplo));
console.log('Object.getOwnPropertySymbols():', Object.getOwnPropertySymbols(exemplo));

// --- 3.3 Well-known Symbols ---
class IterableRange {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    
    // Implementar Symbol.iterator
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        
        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
    
    // Implementar Symbol.toPrimitive
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.end - this.start + 1;
        }
        if (hint === 'string') {
            return `Range(${this.start}..${this.end})`;
        }
        return this.end - this.start + 1;
    }
}

const range = new IterableRange(1, 5);
console.log('Range como string:', String(range));
console.log('Range como número:', Number(range));
console.log('Iterando range:', [...range]);

// ===========================================
// 4. MAP E SET
// ===========================================

console.log('\n=== MAP E SET ===');

/*
MAP:
- Chaves podem ser qualquer tipo
- Mantém ordem de inserção
- Tem propriedade size
- Iterável

SET:
- Valores únicos
- Qualquer tipo de valor
- Mantém ordem de inserção
- Iterável
*/

// --- 4.1 Map ---
console.log('\n--- Map ---');

const mapa = new Map();

// Diferentes tipos de chaves
const objChave = { id: 1 };
const funcChave = function() {};
const strChave = 'string';

mapa.set(objChave, 'Valor do objeto');
mapa.set(funcChave, 'Valor da função');
mapa.set(strChave, 'Valor da string');
mapa.set(42, 'Valor do número');

console.log('Tamanho do Map:', mapa.size);
console.log('Valor do objeto:', mapa.get(objChave));
console.log('Tem chave string:', mapa.has(strChave));

// Iterar Map
console.log('\nIterando Map:');
for (const [chave, valor] of mapa) {
    console.log('Chave:', chave, 'Valor:', valor);
}

// Map com inicialização
const configuracoes = new Map([
    ['tema', 'escuro'],
    ['idioma', 'pt-BR'],
    ['notificacoes', true]
]);

console.log('\nConfigurações:', configuracoes);

// --- 4.2 Set ---
console.log('\n--- Set ---');

const conjunto = new Set();

// Adicionar valores
conjunto.add(1);
conjunto.add(2);
conjunto.add(2); // Duplicata ignorada
conjunto.add('hello');
conjunto.add({ a: 1 });
conjunto.add({ a: 1 }); // Objetos diferentes

console.log('Tamanho do Set:', conjunto.size);
console.log('Tem valor 2:', conjunto.has(2));
console.log('Valores do Set:', [...conjunto]);

// Set para remover duplicatas
const arrayComDuplicatas = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const arraySemDuplicatas = [...new Set(arrayComDuplicatas)];
console.log('Array sem duplicatas:', arraySemDuplicatas);

// --- 4.3 WeakMap e WeakSet ---
console.log('\n--- WeakMap e WeakSet ---');

// WeakMap - chaves devem ser objetos, não enumerable
const weakMap = new WeakMap();
const obj1 = { name: 'objeto1' };
const obj2 = { name: 'objeto2' };

weakMap.set(obj1, 'dados do objeto 1');
weakMap.set(obj2, 'dados do objeto 2');

console.log('WeakMap obj1:', weakMap.get(obj1));
console.log('WeakMap tem obj2:', weakMap.has(obj2));

// WeakSet - valores devem ser objetos
const weakSet = new WeakSet();
weakSet.add(obj1);
weakSet.add(obj2);

console.log('WeakSet tem obj1:', weakSet.has(obj1));

// ===========================================
// 5. GENERATORS
// ===========================================

console.log('\n=== GENERATORS ===');

/*
GENERATORS:

1. CARACTERÍSTICAS:
   - Função que pode pausar e retomar
   - Usa yield para produzir valores
   - Retorna iterator
   - Lazy evaluation

2. CASOS DE USO:
   - Sequências infinitas
   - Controle de fluxo
   - Iteradores customizados
   - Async programming (antes de async/await)
*/

// --- 5.1 Generator Básico ---
function* contadorSimples() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const contador = contadorSimples();
console.log('Contador 1:', contador.next().value);
console.log('Contador 2:', contador.next().value);
console.log('Contador 3:', contador.next().value);

// --- 5.2 Generator com Parâmetros ---
function* fibonacci() {
    let a = 0, b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

const fib = fibonacci();
const primeiros10Fib = [];
for (let i = 0; i < 10; i++) {
    primeiros10Fib.push(fib.next().value);
}
console.log('Primeiros 10 Fibonacci:', primeiros10Fib);

// --- 5.3 Generator com Entrada ---
function* processadorDados() {
    console.log('Generator iniciado');
    
    while (true) {
        const entrada = yield;
        if (entrada === 'sair') {
            console.log('Generator finalizando');
            return 'Finalizado';
        }
        console.log('Processando:', entrada);
        yield `Processado: ${entrada}`;
    }
}

const processador = processadorDados();
processador.next(); // Inicializar
console.log(processador.next('dados1').value);
processador.next(); // Continuar
console.log(processador.next('dados2').value);
processador.next(); // Continuar
console.log(processador.next('sair').value);

// --- 5.4 Generator para Estruturas de Dados ---
function* percorrerArvore(node) {
    yield node.value;
    
    if (node.children) {
        for (const child of node.children) {
            yield* percorrerArvore(child);
        }
    }
}

const arvore = {
    value: 'raiz',
    children: [
        {
            value: 'filho1',
            children: [
                { value: 'neto1' },
                { value: 'neto2' }
            ]
        },
        {
            value: 'filho2',
            children: [
                { value: 'neto3' }
            ]
        }
    ]
};

console.log('Percorrendo árvore:', [...percorrerArvore(arvore)]);

// ===========================================
// 6. PROXY E REFLECT
// ===========================================

console.log('\n=== PROXY E REFLECT ===');

/*
PROXY:
- Intercepta operações em objetos
- Handlers (traps) para diferentes operações
- Meta-programming

REFLECT:
- API para operações reflexivas
- Métodos correspondem aos Proxy traps
- Alternativa mais funcional para Object methods
*/

// --- 6.1 Proxy Básico ---
const usuario = {
    nome: 'João',
    idade: 30,
    email: 'joao@example.com'
};

const usuarioProxy = new Proxy(usuario, {
    get(target, property) {
        console.log(`Acessando propriedade: ${property}`);
        return Reflect.get(target, property);
    },
    
    set(target, property, value) {
        console.log(`Definindo ${property} = ${value}`);
        
        // Validação
        if (property === 'idade' && (value < 0 || value > 150)) {
            throw new Error('Idade inválida');
        }
        
        if (property === 'email' && !value.includes('@')) {
            throw new Error('Email inválido');
        }
        
        return Reflect.set(target, property, value);
    },
    
    has(target, property) {
        console.log(`Verificando se tem propriedade: ${property}`);
        return Reflect.has(target, property);
    },
    
    deleteProperty(target, property) {
        console.log(`Tentando deletar propriedade: ${property}`);
        if (property === 'nome') {
            throw new Error('Não é possível deletar o nome');
        }
        return Reflect.deleteProperty(target, property);
    }
});

console.log('\n--- Testando Proxy ---');
console.log('Nome:', usuarioProxy.nome);
usuarioProxy.idade = 31;
console.log('Tem email:', 'email' in usuarioProxy);

try {
    usuarioProxy.idade = -5;
} catch (error) {
    console.log('Erro capturado:', error.message);
}

// --- 6.2 Proxy para Array Virtual ---
const arrayVirtual = new Proxy({}, {
    get(target, property) {
        if (property === 'length') {
            return Object.keys(target).length;
        }
        
        if (property === 'push') {
            return function(value) {
                const length = Object.keys(target).length;
                target[length] = value;
                return length + 1;
            };
        }
        
        if (property === 'pop') {
            return function() {
                const keys = Object.keys(target);
                if (keys.length === 0) return undefined;
                
                const lastKey = keys[keys.length - 1];
                const value = target[lastKey];
                delete target[lastKey];
                return value;
            };
        }
        
        return target[property];
    },
    
    set(target, property, value) {
        target[property] = value;
        return true;
    }
});

console.log('\n--- Array Virtual ---');
arrayVirtual.push('item1');
arrayVirtual.push('item2');
arrayVirtual.push('item3');
console.log('Length:', arrayVirtual.length);
console.log('Pop:', arrayVirtual.pop());
console.log('Length após pop:', arrayVirtual.length);

// --- 6.3 Reflect ---
console.log('\n--- Reflect ---');

const obj = { a: 1, b: 2 };

// Reflect.get
console.log('Reflect.get(obj, "a"):', Reflect.get(obj, 'a'));

// Reflect.set
Reflect.set(obj, 'c', 3);
console.log('Após Reflect.set:', obj);

// Reflect.has
console.log('Reflect.has(obj, "b"):', Reflect.has(obj, 'b'));

// Reflect.ownKeys
console.log('Reflect.ownKeys(obj):', Reflect.ownKeys(obj));

// Reflect.deleteProperty
Reflect.deleteProperty(obj, 'b');
console.log('Após delete:', obj);

// ===========================================
// 7. FEATURES ES2017+ (ASYNC/AWAIT E MAIS)
// ===========================================

console.log('\n=== FEATURES ES2017+ ===');

// --- 7.1 Async/Await (já visto em módulo anterior) ---
// Aqui apenas um exemplo rápido
async function exemploAsync() {
    try {
        const resultado = await new Promise(resolve => {
            setTimeout(() => resolve('Resultado assíncrono'), 1000);
        });
        console.log('Async result:', resultado);
    } catch (error) {
        console.error('Async error:', error);
    }
}

// --- 7.2 Object.entries, Object.values (ES2017) ---
const pessoa_obj = { nome: 'Ana', idade: 25, cidade: 'São Paulo' };

console.log('Object.entries:', Object.entries(pessoa_obj));
console.log('Object.values:', Object.values(pessoa_obj));
console.log('Object.keys:', Object.keys(pessoa_obj));

// --- 7.3 String padding (ES2017) ---
const numero = '42';
console.log('padStart:', numero.padStart(5, '0')); // "00042"
console.log('padEnd:', numero.padEnd(5, '*'));     // "42***"

// --- 7.4 Optional Chaining (ES2020) ---
const usuario_complexo = {
    nome: 'Carlos',
    endereco: {
        rua: 'Rua A',
        cidade: 'São Paulo'
    }
};

// Sem optional chaining (pode dar erro)
// console.log(usuario_complexo.endereco.cep.codigo); // Error

// Com optional chaining
console.log('CEP (opcional):', usuario_complexo.endereco?.cep?.codigo); // undefined
console.log('Cidade (opcional):', usuario_complexo.endereco?.cidade);   // "São Paulo"

// --- 7.5 Nullish Coalescing (ES2020) ---
const config = {
    timeout: 0,
    retries: null,
    debug: false
};

// || vs ??
console.log('timeout com ||:', config.timeout || 5000);    // 5000 (falsy)
console.log('timeout com ??:', config.timeout ?? 5000);    // 0 (não null/undefined)
console.log('retries com ??:', config.retries ?? 3);       // 3 (null)
console.log('debug com ??:', config.debug ?? true);        // false (não null/undefined)

// --- 7.6 BigInt (ES2020) ---
const numeroGrande = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
console.log('Número grande:', numeroGrande);
console.log('Tipo:', typeof numeroGrande);

// Operações com BigInt
const big1 = 123n;
const big2 = 456n;
console.log('BigInt soma:', big1 + big2);
console.log('BigInt multiplicação:', big1 * big2);

// --- 7.7 Private Fields (ES2022) - já visto nas classes ---
// Exemplo adicional
class ContadorPrivado {
    #count = 0;
    #maxCount;
    
    constructor(maxCount = 100) {
        this.#maxCount = maxCount;
    }
    
    increment() {
        if (this.#count < this.#maxCount) {
            this.#count++;
        }
        return this.#count;
    }
    
    get value() {
        return this.#count;
    }
    
    // Método privado
    #reset() {
        this.#count = 0;
    }
    
    forceReset() {
        this.#reset();
    }
}

const contadorPriv = new ContadorPrivado(5);
console.log('Contador inicial:', contadorPriv.value);
console.log('Após increment:', contadorPriv.increment());
console.log('Após increment:', contadorPriv.increment());

// ===========================================
// 8. EXERCÍCIO PRÁTICO: SISTEMA DE CACHE AVANÇADO
// ===========================================

console.log('\n=== EXERCÍCIO: SISTEMA DE CACHE AVANÇADO ===');

/*
Vamos criar um sistema de cache que usa várias features ES6+:
- Classes com private fields
- Proxy para interceptação
- Map para armazenamento
- Generators para iteração
- Symbols para metadados
- Async/await para operações assíncronas
*/

class AdvancedCache {
    // Private fields
    #cache = new Map();
    #maxSize;
    #ttl;
    #stats = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0
    };
    
    // Symbols para metadados
    static #METADATA = Symbol('metadata');
    static #CREATED_AT = Symbol('createdAt');
    static #ACCESSED_AT = Symbol('accessedAt');
    static #TTL = Symbol('ttl');
    
    constructor(options = {}) {
        this.#maxSize = options.maxSize || 100;
        this.#ttl = options.ttl || 60000; // 1 minuto padrão
        
        // Criar proxy para interceptar operações
        return new Proxy(this, {
            get(target, property) {
                if (typeof property === 'string' && property.startsWith('get_')) {
                    const key = property.slice(4);
                    return () => target.get(key);
                }
                
                if (typeof property === 'string' && property.startsWith('set_')) {
                    const key = property.slice(4);
                    return (value, ttl) => target.set(key, value, ttl);
                }
                
                return Reflect.get(target, property);
            }
        });
    }
    
    // Método para criar entrada com metadados
    #createEntry(value, ttl = this.#ttl) {
        const now = Date.now();
        return {
            value,
            [AdvancedCache.#METADATA]: {
                [AdvancedCache.#CREATED_AT]: now,
                [AdvancedCache.#ACCESSED_AT]: now,
                [AdvancedCache.#TTL]: ttl
            }
        };
    }
    
    // Verificar se entrada expirou
    #isExpired(entry) {
        const metadata = entry[AdvancedCache.#METADATA];
        const createdAt = metadata[AdvancedCache.#CREATED_AT];
        const ttl = metadata[AdvancedCache.#TTL];
        return Date.now() - createdAt > ttl;
    }
    
    // Atualizar último acesso
    #updateAccess(entry) {
        entry[AdvancedCache.#METADATA][AdvancedCache.#ACCESSED_AT] = Date.now();
    }
    
    // Remover entradas expiradas
    #cleanup() {
        for (const [key, entry] of this.#cache) {
            if (this.#isExpired(entry)) {
                this.#cache.delete(key);
                this.#stats.deletes++;
            }
        }
    }
    
    // Implementar LRU (Least Recently Used)
    #evictLRU() {
        if (this.#cache.size <= this.#maxSize) return;
        
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, entry] of this.#cache) {
            const accessTime = entry[AdvancedCache.#METADATA][AdvancedCache.#ACCESSED_AT];
            if (accessTime < oldestTime) {
                oldestTime = accessTime;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.#cache.delete(oldestKey);
            this.#stats.deletes++;
        }
    }
    
    // Método get
    get(key) {
        this.#cleanup();
        
        const entry = this.#cache.get(key);
        
        if (!entry || this.#isExpired(entry)) {
            this.#stats.misses++;
            return undefined;
        }
        
        this.#updateAccess(entry);
        this.#stats.hits++;
        return entry.value;
    }
    
    // Método set
    set(key, value, ttl) {
        this.#cleanup();
        this.#evictLRU();
        
        const entry = this.#createEntry(value, ttl);
        this.#cache.set(key, entry);
        this.#stats.sets++;
        
        return this;
    }
    
    // Método delete
    delete(key) {
        const deleted = this.#cache.delete(key);
        if (deleted) {
            this.#stats.deletes++;
        }
        return deleted;
    }
    
    // Verificar se tem chave
    has(key) {
        this.#cleanup();
        const entry = this.#cache.get(key);
        return entry && !this.#isExpired(entry);
    }
    
    // Limpar cache
    clear() {
        this.#cache.clear();
        this.#stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
    }
    
    // Obter estatísticas
    getStats() {
        this.#cleanup();
        return {
            ...this.#stats,
            size: this.#cache.size,
            hitRate: this.#stats.hits / (this.#stats.hits + this.#stats.misses) || 0
        };
    }
    
    // Generator para iterar entradas válidas
    *entries() {
        this.#cleanup();
        for (const [key, entry] of this.#cache) {
            if (!this.#isExpired(entry)) {
                yield [key, entry.value];
            }
        }
    }
    
    // Generator para iterar chaves válidas
    *keys() {
        for (const [key] of this.entries()) {
            yield key;
        }
    }
    
    // Generator para iterar valores válidos
    *values() {
        for (const [, value] of this.entries()) {
            yield value;
        }
    }
    
    // Método assíncrono para buscar com fallback
    async getOrFetch(key, fetchFn, ttl) {
        let value = this.get(key);
        
        if (value === undefined) {
            try {
                value = await fetchFn(key);
                this.set(key, value, ttl);
            } catch (error) {
                console.error(`Erro ao buscar ${key}:`, error);
                throw error;
            }
        }
        
        return value;
    }
    
    // Método para exportar dados
    export() {
        const data = {};
        for (const [key, value] of this.entries()) {
            data[key] = value;
        }
        return data;
    }
    
    // Método para importar dados
    import(data, ttl) {
        for (const [key, value] of Object.entries(data)) {
            this.set(key, value, ttl);
        }
        return this;
    }
}

// --- Demonstração do Cache Avançado ---
function demonstrarCacheAvancado() {
    console.log('\n--- Demonstração do Cache Avançado ---');
    
    // Criar cache
    const cache = new AdvancedCache({
        maxSize: 5,
        ttl: 2000 // 2 segundos
    });
    
    // Testar operações básicas
    cache.set('user:1', { name: 'João', age: 30 });
    cache.set('user:2', { name: 'Maria', age: 25 });
    cache.set('config', { theme: 'dark', lang: 'pt' });
    
    console.log('User 1:', cache.get('user:1'));
    console.log('Config:', cache.get('config'));
    console.log('Inexistente:', cache.get('inexistente'));
    
    // Testar proxy (métodos dinâmicos)
    console.log('Via proxy get_user:1:', cache.get_user1());
    cache.set_newUser({ name: 'Pedro', age: 35 });
    console.log('Via proxy get_newUser:', cache.get_newUser());
    
    // Testar iteradores
    console.log('\nChaves:', [...cache.keys()]);
    console.log('Valores:', [...cache.values()]);
    console.log('Entradas:', [...cache.entries()]);
    
    // Testar estatísticas
    console.log('\nEstatísticas:', cache.getStats());
    
    // Testar busca assíncrona
    const fetchUser = async (id) => {
        console.log(`Buscando usuário ${id} da API...`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return { id, name: `User ${id}`, fetched: true };
    };
    
    // Buscar com cache
    cache.getOrFetch('user:3', () => fetchUser(3))
        .then(user => {
            console.log('\nUsuário buscado:', user);
            
            // Segunda busca (do cache)
            return cache.getOrFetch('user:3', () => fetchUser(3));
        })
        .then(user => {
            console.log('Usuário do cache:', user);
            console.log('Estatísticas finais:', cache.getStats());
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    
    // Testar expiração
    setTimeout(() => {
        console.log('\n--- Após 3 segundos (TTL expirado) ---');
        console.log('User 1 (expirado):', cache.get('user:1'));
        console.log('Estatísticas após expiração:', cache.getStats());
    }, 3000);
}

// Executar demonstração
setTimeout(demonstrarCacheAvancado, 1000);

// ===========================================
// 9. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasES6Plus = {
    arrowFunctions: {
        quando_usar: `
            // ✅ Bom - Callbacks e array methods
            const numeros = [1, 2, 3].map(n => n * 2);
            
            // ✅ Bom - Funções curtas
            const soma = (a, b) => a + b;
            
            // ❌ Evitar - Métodos de objeto (perde this)
            const obj = {
                name: 'test',
                greet: () => console.log(this.name) // undefined
            };
        `,
        
        performance: `
            // ✅ Bom - Arrow functions são mais rápidas para callbacks
            array.filter(item => item.active)
                 .map(item => item.name);
            
            // ❌ Evitar - Function expressions desnecessárias
            array.filter(function(item) { return item.active; });
        `
    },
    
    classes: {
        private_fields: `
            // ✅ Bom - Use private fields para encapsulamento
            class User {
                #password;
                #id = Math.random();
                
                setPassword(pwd) {
                    this.#password = this.#hash(pwd);
                }
                
                #hash(value) {
                    return btoa(value + this.#id);
                }
            }
        `,
        
        heranca: `
            // ✅ Bom - Prefira composição sobre herança
            class User {
                constructor(validator, logger) {
                    this.validator = validator;
                    this.logger = logger;
                }
            }
            
            // ❌ Evitar - Hierarquias muito profundas
            class A extends B extends C extends D {}
        `
    },
    
    symbols: {
        uso_correto: `
            // ✅ Bom - Para propriedades realmente privadas
            const PRIVATE_DATA = Symbol('privateData');
            
            class MyClass {
                constructor() {
                    this[PRIVATE_DATA] = {};
                }
            }
            
            // ✅ Bom - Para protocolos customizados
            const SERIALIZABLE = Symbol('serializable');
            
            class MyClass {
                [SERIALIZABLE]() {
                    return this.toJSON();
                }
            }
        `
    },
    
    mapSet: {
        quando_usar: `
            // ✅ Use Map quando:
            // - Chaves não são strings
            // - Precisa de ordem de inserção
            // - Iteração frequente
            
            // ✅ Use Set quando:
            // - Precisa de valores únicos
            // - Operações de conjunto
            
            // ✅ Use WeakMap/WeakSet quando:
            // - Chaves são objetos
            // - Quer garbage collection automático
        `
    },
    
    generators: {
        casos_uso: `
            // ✅ Bom - Para sequências grandes/infinitas
            function* fibonacci() {
                let a = 0, b = 1;
                while (true) {
                    yield a;
                    [a, b] = [b, a + b];
                }
            }
            
            // ✅ Bom - Para controle de fluxo
            function* pipeline() {
                const data = yield 'ready';
                const processed = yield process(data);
                return yield save(processed);
            }
        `
    },
    
    proxy: {
        performance: `
            // ⚠️ Cuidado - Proxy tem overhead
            // Use apenas quando necessário
            
            // ✅ Bom - Para APIs dinâmicas
            const api = new Proxy({}, {
                get(target, method) {
                    return (...args) => fetch(\`/api/\${method}\`, {
                        method: 'POST',
                        body: JSON.stringify(args)
                    });
                }
            });
        `
    }
};

// ===========================================
// 10. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasES6Plus = {
    documentacao: [
        'MDN - Arrow Functions: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
        'MDN - Classes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes',
        'MDN - Symbols: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol',
        'MDN - Map: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map',
        'MDN - Set: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set',
        'MDN - Generators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator',
        'MDN - Proxy: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy',
        'MDN - Reflect: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect'
    ],
    
    especificacoes: [
        'ECMAScript 2015 (ES6): https://www.ecma-international.org/ecma-262/6.0/',
        'ECMAScript 2017 (ES8): https://www.ecma-international.org/ecma-262/8.0/',
        'ECMAScript 2020 (ES11): https://www.ecma-international.org/ecma-262/11.0/',
        'ECMAScript 2022 (ES13): https://www.ecma-international.org/ecma-262/13.0/'
    ],
    
    ferramentas: [
        'Babel: https://babeljs.io/',
        'TypeScript: https://www.typescriptlang.org/',
        'ESLint: https://eslint.org/',
        'Prettier: https://prettier.io/'
    ],
    
    proximosModulos: [
        '10-Padroes - Design patterns em JavaScript',
        '11-Qualidade - Debugging, testes e performance',
        'Frameworks modernos (React, Vue, Angular)',
        'Node.js e desenvolvimento backend'
    ],
    
    exerciciosAvancados: [
        'Implementar ORM simples com Proxy',
        'Criar sistema de validação com decorators',
        'Desenvolver state machine com generators',
        'Construir sistema de eventos com Symbols'
    ]
};

console.log('Documentação:', referenciasES6Plus.documentacao);
console.log('Especificações:', referenciasES6Plus.especificacoes);
console.log('Ferramentas:', referenciasES6Plus.ferramentas);
console.log('Próximos módulos:', referenciasES6Plus.proximosModulos);
console.log('Exercícios avançados:', referenciasES6Plus.exerciciosAvancados);

// Executar exemplo async no final
exemploAsync();

setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('🎓 MÓDULO 09 - ES6+ CONCLUÍDO!');
    console.log('='.repeat(60));
    
    console.log('\n📚 CONCEITOS DOMINADOS:');
    console.log('✓ Arrow functions e binding de this');
    console.log('✓ Classes ES6 com private fields');
    console.log('✓ Symbols e well-known symbols');
    console.log('✓ Map, Set, WeakMap e WeakSet');
    console.log('✓ Generators e iterators');
    console.log('✓ Proxy e Reflect para meta-programming');
    console.log('✓ Features ES2017+ (async/await, optional chaining, etc.)');
    
    console.log('\n🛠️ TÉCNICAS AVANÇADAS:');
    console.log('✓ Meta-programming com Proxy');
    console.log('✓ Lazy evaluation com generators');
    console.log('✓ Encapsulamento com private fields');
    console.log('✓ Protocolos customizados com symbols');
    console.log('✓ Estruturas de dados eficientes');
    console.log('✓ Cache avançado com múltiplas features');
    
    console.log('\n🚀 PROJETOS DESENVOLVIDOS:');
    console.log('✓ Sistema de cache avançado');
    console.log('✓ Proxy para APIs dinâmicas');
    console.log('✓ Iteradores customizados');
    console.log('✓ Classes com encapsulamento real');
    
    console.log('\n🔜 PRÓXIMO MÓDULO:');
    console.log('📁 10-Padroes');
    console.log('   - Module Pattern');
    console.log('   - Observer Pattern');
    console.log('   - Factory Pattern');
    console.log('   - Singleton Pattern');
    
    console.log('\n' + '='.repeat(60));
}, 15000);

/*
===========================================
    FIM DO MÓDULO 09 - ES6+ (ECMASCRIPT 2015+)
===========================================

PARABÉNS! 🎉

Você dominou as principais features do JavaScript moderno!

Este módulo cobriu:
- Arrow functions e suas nuances
- Classes ES6 com private fields
- Symbols para meta-programming
- Map/Set para estruturas de dados
- Generators para lazy evaluation
- Proxy/Reflect para interceptação
- Features ES2017+ mais recentes

Agora você está preparado para usar JavaScript
moderno de forma eficiente e elegante! 🚀

===========================================
*/