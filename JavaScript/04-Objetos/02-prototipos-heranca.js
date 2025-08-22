/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 4.2
PROTÓTIPOS E HERANÇA
==============================================

Objetivos de Aprendizagem:
- Compreender o sistema de protótipos do JavaScript
- Dominar a cadeia de protótipos (prototype chain)
- Implementar herança prototípica
- Usar Object.setPrototypeOf() e Object.getPrototypeOf()
- Entender a diferença entre __proto__ e prototype
- Aplicar padrões de herança em JavaScript
- Conhecer as limitações e vantagens da herança prototípica

⏱️ TEMPO ESTIMADO: 75 minutos
📊 NÍVEL: Intermediário/Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: PROTÓTIPOS E HERANÇA
// ==========================================

/*
PROTÓTIPOS EM JAVASCRIPT:
JavaScript usa herança prototípica, não herança clássica como outras linguagens.
Todo objeto em JavaScript tem uma propriedade interna [[Prototype]] que aponta
para outro objeto (seu protótipo).

CONCEITOS FUNDAMENTAIS:
1. [[Prototype]] - propriedade interna que aponta para o protótipo
2. __proto__ - accessor property para [[Prototype]] (não padrão, mas amplamente suportado)
3. prototype - propriedade de funções construtoras
4. Prototype Chain - cadeia de protótipos para busca de propriedades

COMO FUNCIONA:
- Quando você acessa uma propriedade, o JavaScript primeiro procura no objeto
- Se não encontrar, procura no protótipo do objeto
- Continua subindo na cadeia até encontrar ou chegar em null

HERANÇA PROTOTÍPICA:
- Objetos podem herdar propriedades e métodos de outros objetos
- A herança é dinâmica - mudanças no protótipo afetam todos os objetos
- Permite compartilhamento eficiente de métodos

VANTAGENS:
- Flexibilidade para modificar comportamento em tempo de execução
- Economia de memória (métodos compartilhados)
- Simplicidade conceitual

DESVANTAGENS:
- Pode ser confuso para quem vem de linguagens com herança clássica
- Performance pode ser afetada em cadeias muito longas
- Modificações no protótipo afetam todos os objetos
*/

console.log('=== PROTÓTIPOS E HERANÇA ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== ENTENDENDO PROTÓTIPOS ==========
console.log('\n--- ENTENDENDO PROTÓTIPOS ---');

// Todo objeto tem um protótipo
const obj = {};
console.log('\n🔍 Explorando protótipos:');
console.log('Protótipo de obj:', Object.getPrototypeOf(obj));
console.log('obj.__proto__ === Object.prototype:', obj.__proto__ === Object.prototype);
console.log('Object.prototype.__proto__:', Object.prototype.__proto__); // null

// Arrays também têm protótipos
const arr = [];
console.log('\n📋 Protótipos de arrays:');
console.log('Protótipo de arr:', Object.getPrototypeOf(arr) === Array.prototype);
console.log('Array.prototype.__proto__ === Object.prototype:', Array.prototype.__proto__ === Object.prototype);

// Funções também têm protótipos
function minhaFuncao() {}
console.log('\n⚡ Protótipos de funções:');
console.log('Protótipo de minhaFuncao:', Object.getPrototypeOf(minhaFuncao) === Function.prototype);
console.log('minhaFuncao tem propriedade prototype:', 'prototype' in minhaFuncao);
console.log('minhaFuncao.prototype.constructor === minhaFuncao:', minhaFuncao.prototype.constructor === minhaFuncao);

// ========== CADEIA DE PROTÓTIPOS ==========
console.log('\n--- CADEIA DE PROTÓTIPOS ---');

// Demonstrando a cadeia de protótipos
function mostrarCadeiaPrototipos(obj, nome) {
    console.log(`\n🔗 Cadeia de protótipos de ${nome}:`);
    let atual = obj;
    let nivel = 0;
    
    while (atual !== null) {
        const espacos = '  '.repeat(nivel);
        if (nivel === 0) {
            console.log(`${espacos}${nome} (objeto atual)`);
        } else {
            const construtorNome = atual.constructor ? atual.constructor.name : 'Unknown';
            console.log(`${espacos}${construtorNome}.prototype`);
        }
        
        atual = Object.getPrototypeOf(atual);
        nivel++;
        
        if (nivel > 10) { // Proteção contra loops infinitos
            console.log(`${espacos}... (cadeia muito longa)`);
            break;
        }
    }
    console.log(`${'  '.repeat(nivel)}null`);
}

// Exemplos de cadeias
const objeto = {};
const array = [];
const funcao = function() {};
const data = new Date();

mostrarCadeiaPrototipos(objeto, 'objeto');
mostrarCadeiaPrototipos(array, 'array');
mostrarCadeiaPrototipos(funcao, 'funcao');
mostrarCadeiaPrototipos(data, 'data');

// ========== HERANÇA COM CONSTRUCTOR FUNCTIONS ==========
console.log('\n--- HERANÇA COM CONSTRUCTOR FUNCTIONS ---');

// Classe base: Animal
function Animal(nome, especie) {
    this.nome = nome;
    this.especie = especie;
    this.vivo = true;
    this.energia = 100;
}

// Métodos no protótipo do Animal
Animal.prototype.comer = function(alimento) {
    this.energia = Math.min(100, this.energia + 20);
    console.log(`${this.nome} comeu ${alimento}. Energia: ${this.energia}`);
    return this;
};

Animal.prototype.dormir = function(horas = 8) {
    this.energia = Math.min(100, this.energia + horas * 5);
    console.log(`${this.nome} dormiu ${horas} horas. Energia: ${this.energia}`);
    return this;
};

Animal.prototype.gastarEnergia = function(quantidade) {
    this.energia = Math.max(0, this.energia - quantidade);
    if (this.energia === 0) {
        console.log(`${this.nome} está exausto!`);
    }
    return this;
};

Animal.prototype.obterInfo = function() {
    return {
        nome: this.nome,
        especie: this.especie,
        vivo: this.vivo,
        energia: this.energia,
        tipo: this.constructor.name
    };
};

Animal.prototype.emitirSom = function() {
    console.log(`${this.nome} faz algum som...`);
    return this;
};

// Classe derivada: Mamifero
function Mamifero(nome, especie, pelagem) {
    // Chama o construtor pai
    Animal.call(this, nome, especie);
    this.pelagem = pelagem;
    this.temperatura = 37; // Temperatura corporal
}

// Estabelece herança
Mamifero.prototype = Object.create(Animal.prototype);
Mamifero.prototype.constructor = Mamifero;

// Métodos específicos de Mamífero
Mamifero.prototype.regularTemperatura = function() {
    console.log(`${this.nome} está regulando a temperatura corporal`);
    return this;
};

Mamifero.prototype.amamentar = function() {
    if (this.energia >= 30) {
        this.gastarEnergia(30);
        console.log(`${this.nome} está amamentando`);
    } else {
        console.log(`${this.nome} não tem energia suficiente para amamentar`);
    }
    return this;
};

// Sobrescreve método do pai
Mamifero.prototype.obterInfo = function() {
    const infoBase = Animal.prototype.obterInfo.call(this);
    return {
        ...infoBase,
        pelagem: this.pelagem,
        temperatura: this.temperatura
    };
};

// Classe derivada: Cachorro
function Cachorro(nome, raca, pelagem = 'média') {
    Mamifero.call(this, nome, 'Canis lupus', pelagem);
    this.raca = raca;
    this.lealdade = 100;
    this.treinamento = [];
}

// Herança de Mamífero
Cachorro.prototype = Object.create(Mamifero.prototype);
Cachorro.prototype.constructor = Cachorro;

// Métodos específicos de Cachorro
Cachorro.prototype.latir = function(intensidade = 'normal') {
    const sons = {
        baixo: 'au...',
        normal: 'au au!',
        alto: 'AU AU AU!'
    };
    
    console.log(`${this.nome} late: ${sons[intensidade] || sons.normal}`);
    this.gastarEnergia(5);
    return this;
};

Cachorro.prototype.abanarRabo = function() {
    console.log(`${this.nome} está abanando o rabo alegremente!`);
    return this;
};

Cachorro.prototype.buscarObjeto = function(objeto = 'bola') {
    if (this.energia >= 20) {
        console.log(`${this.nome} foi buscar a ${objeto}`);
        this.gastarEnergia(20);
        this.lealdade = Math.min(100, this.lealdade + 5);
    } else {
        console.log(`${this.nome} está muito cansado para buscar`);
    }
    return this;
};

Cachorro.prototype.aprender = function(comando) {
    if (!this.treinamento.includes(comando)) {
        this.treinamento.push(comando);
        console.log(`${this.nome} aprendeu o comando: ${comando}`);
    } else {
        console.log(`${this.nome} já conhece o comando: ${comando}`);
    }
    return this;
};

Cachorro.prototype.executarComando = function(comando) {
    if (this.treinamento.includes(comando)) {
        console.log(`${this.nome} executou: ${comando}`);
        this.lealdade = Math.min(100, this.lealdade + 2);
        this.gastarEnergia(10);
    } else {
        console.log(`${this.nome} não conhece o comando: ${comando}`);
        this.latir('baixo');
    }
    return this;
};

// Sobrescreve emitirSom
Cachorro.prototype.emitirSom = function() {
    return this.latir();
};

// Sobrescreve obterInfo
Cachorro.prototype.obterInfo = function() {
    const infoBase = Mamifero.prototype.obterInfo.call(this);
    return {
        ...infoBase,
        raca: this.raca,
        lealdade: this.lealdade,
        comandosAprendidos: this.treinamento.length,
        comandos: [...this.treinamento]
    };
};

// Classe derivada: Gato
function Gato(nome, raca, pelagem = 'curta') {
    Mamifero.call(this, nome, 'Felis catus', pelagem);
    this.raca = raca;
    this.independencia = 80;
    this.curiosidade = 90;
}

// Herança de Mamífero
Gato.prototype = Object.create(Mamifero.prototype);
Gato.prototype.constructor = Gato;

// Métodos específicos de Gato
Gato.prototype.miar = function(tipo = 'normal') {
    const sons = {
        carinho: 'miau~',
        normal: 'miau',
        irritado: 'MIAU!',
        fome: 'miaaau'
    };
    
    console.log(`${this.nome} mia: ${sons[tipo] || sons.normal}`);
    this.gastarEnergia(3);
    return this;
};

Gato.prototype.ronronar = function() {
    console.log(`${this.nome} está ronronando... purr purr`);
    this.energia = Math.min(100, this.energia + 5);
    return this;
};

Gato.prototype.arranhar = function(objeto = 'sofá') {
    console.log(`${this.nome} está arranhando o ${objeto}`);
    this.gastarEnergia(10);
    this.independencia = Math.min(100, this.independencia + 3);
    return this;
};

Gato.prototype.explorar = function() {
    if (this.energia >= 25) {
        console.log(`${this.nome} está explorando o ambiente`);
        this.gastarEnergia(25);
        this.curiosidade = Math.min(100, this.curiosidade + 5);
        
        // Chance de encontrar algo interessante
        if (Math.random() > 0.7) {
            const descobertas = ['um inseto', 'um lugar aconchegante', 'algo brilhante', 'um cheiro interessante'];
            const descoberta = descobertas[Math.floor(Math.random() * descobertas.length)];
            console.log(`${this.nome} encontrou ${descoberta}!`);
        }
    } else {
        console.log(`${this.nome} está muito cansado para explorar`);
    }
    return this;
};

Gato.prototype.ignorar = function(alguem) {
    console.log(`${this.nome} está ignorando ${alguem} majestosamente`);
    this.independencia = Math.min(100, this.independencia + 5);
    return this;
};

// Sobrescreve emitirSom
Gato.prototype.emitirSom = function() {
    return this.miar();
};

// Sobrescreve obterInfo
Gato.prototype.obterInfo = function() {
    const infoBase = Mamifero.prototype.obterInfo.call(this);
    return {
        ...infoBase,
        raca: this.raca,
        independencia: this.independencia,
        curiosidade: this.curiosidade
    };
};

// Testando a herança
console.log('\n🐕 Testando herança com Cachorro:');

const rex = new Cachorro('Rex', 'Labrador', 'curta');
console.log('Info inicial do Rex:', rex.obterInfo());

// Testando métodos herdados e próprios
rex.comer('ração')
   .latir('alto')
   .buscarObjeto('frisbee')
   .aprender('sentar')
   .aprender('dar a pata')
   .executarComando('sentar')
   .executarComando('rolar') // Comando não aprendido
   .abanarRabo();

console.log('\n📊 Info final do Rex:', rex.obterInfo());

console.log('\n🐱 Testando herança com Gato:');

const mimi = new Gato('Mimi', 'Siamês', 'curta');
console.log('Info inicial da Mimi:', mimi.obterInfo());

// Testando métodos herdados e próprios
mimi.comer('peixe')
    .miar('carinho')
    .ronronar()
    .explorar()
    .arranhar('arranhador')
    .ignorar('o dono')
    .dormir(6);

console.log('\n📊 Info final da Mimi:', mimi.obterInfo());

// Verificando instanceof e herança
console.log('\n🔍 Verificando tipos e herança:');
console.log('rex instanceof Cachorro:', rex instanceof Cachorro);
console.log('rex instanceof Mamifero:', rex instanceof Mamifero);
console.log('rex instanceof Animal:', rex instanceof Animal);
console.log('rex instanceof Object:', rex instanceof Object);

console.log('mimi instanceof Gato:', mimi instanceof Gato);
console.log('mimi instanceof Mamifero:', mimi instanceof Mamifero);
console.log('mimi instanceof Animal:', mimi instanceof Animal);

// Verificando protótipos
console.log('\n🔗 Verificando protótipos:');
console.log('Cachorro.prototype.__proto__ === Mamifero.prototype:', Cachorro.prototype.__proto__ === Mamifero.prototype);
console.log('Mamifero.prototype.__proto__ === Animal.prototype:', Mamifero.prototype.__proto__ === Animal.prototype);
console.log('Animal.prototype.__proto__ === Object.prototype:', Animal.prototype.__proto__ === Object.prototype);

// ========== HERANÇA COM OBJECT.CREATE() ==========
console.log('\n--- HERANÇA COM OBJECT.CREATE() ---');

// Protótipo base para veículos
const veiculo = {
    tipo: 'veículo',
    velocidade: 0,
    ligado: false,
    
    ligar: function() {
        if (!this.ligado) {
            this.ligado = true;
            console.log(`${this.modelo || 'Veículo'} foi ligado`);
        } else {
            console.log(`${this.modelo || 'Veículo'} já está ligado`);
        }
        return this;
    },
    
    desligar: function() {
        if (this.ligado) {
            this.velocidade = 0;
            this.ligado = false;
            console.log(`${this.modelo || 'Veículo'} foi desligado`);
        } else {
            console.log(`${this.modelo || 'Veículo'} já está desligado`);
        }
        return this;
    },
    
    acelerar: function(incremento = 10) {
        if (this.ligado) {
            this.velocidade = Math.min(this.velocidadeMaxima || 200, this.velocidade + incremento);
            console.log(`${this.modelo || 'Veículo'} acelerou para ${this.velocidade} km/h`);
        } else {
            console.log('Precisa ligar o veículo primeiro!');
        }
        return this;
    },
    
    frear: function(decremento = 15) {
        this.velocidade = Math.max(0, this.velocidade - decremento);
        console.log(`${this.modelo || 'Veículo'} freou para ${this.velocidade} km/h`);
        return this;
    },
    
    obterStatus: function() {
        return {
            modelo: this.modelo || 'Desconhecido',
            tipo: this.tipo,
            ligado: this.ligado,
            velocidade: this.velocidade,
            velocidadeMaxima: this.velocidadeMaxima || 'Não definida'
        };
    }
};

// Criando protótipo para carros
const carro = Object.create(veiculo);
carro.tipo = 'carro';
carro.portas = 4;
carro.combustivel = 100;

carro.abrirPorta = function(numero) {
    if (numero >= 1 && numero <= this.portas) {
        console.log(`Porta ${numero} do ${this.modelo} foi aberta`);
    } else {
        console.log(`${this.modelo} não tem porta ${numero}`);
    }
    return this;
};

carro.abastecer = function(litros) {
    this.combustivel = Math.min(100, this.combustivel + litros);
    console.log(`${this.modelo} abastecido. Combustível: ${this.combustivel}%`);
    return this;
};

carro.consumirCombustivel = function() {
    if (this.velocidade > 0) {
        const consumo = this.velocidade * 0.1;
        this.combustivel = Math.max(0, this.combustivel - consumo);
        if (this.combustivel === 0) {
            this.velocidade = 0;
            this.ligado = false;
            console.log(`${this.modelo} ficou sem combustível!`);
        }
    }
    return this;
};

// Sobrescreve obterStatus
carro.obterStatus = function() {
    const statusBase = veiculo.obterStatus.call(this);
    return {
        ...statusBase,
        portas: this.portas,
        combustivel: this.combustivel + '%'
    };
};

// Criando protótipo para motos
const moto = Object.create(veiculo);
moto.tipo = 'moto';
moto.cilindradas = 0;

moto.empinar = function() {
    if (this.ligado && this.velocidade >= 30) {
        console.log(`${this.modelo} está empinando!`);
        this.velocidade = Math.max(20, this.velocidade - 10);
    } else {
        console.log('Precisa estar ligado e com velocidade >= 30 km/h para empinar');
    }
    return this;
};

moto.trocarMarcha = function(marcha) {
    if (this.ligado) {
        console.log(`${this.modelo} mudou para a ${marcha}ª marcha`);
    } else {
        console.log('Precisa ligar a moto primeiro!');
    }
    return this;
};

// Sobrescreve obterStatus
moto.obterStatus = function() {
    const statusBase = veiculo.obterStatus.call(this);
    return {
        ...statusBase,
        cilindradas: this.cilindradas
    };
};

// Criando instâncias específicas
const civic = Object.create(carro);
civic.modelo = 'Honda Civic';
civic.velocidadeMaxima = 180;
civic.portas = 4;

const ferrari = Object.create(carro);
ferrari.modelo = 'Ferrari F8';
ferrari.velocidadeMaxima = 340;
ferrari.portas = 2;

const harley = Object.create(moto);
harley.modelo = 'Harley Davidson';
harley.velocidadeMaxima = 200;
harley.cilindradas = 1200;

// Testando veículos
console.log('\n🚗 Testando carros:');

civic.ligar()
     .acelerar(50)
     .abrirPorta(1)
     .abastecer(20);

console.log('Status do Civic:', civic.obterStatus());

ferrari.ligar()
       .acelerar(100)
       .acelerar(80)
       .frear(50);

console.log('Status da Ferrari:', ferrari.obterStatus());

console.log('\n🏍️ Testando moto:');

harley.ligar()
      .acelerar(40)
      .trocarMarcha(3)
      .empinar()
      .frear(20);

console.log('Status da Harley:', harley.obterStatus());

// Verificando herança
console.log('\n🔍 Verificando herança com Object.create():');
console.log('civic.__proto__ === carro:', civic.__proto__ === carro);
console.log('carro.__proto__ === veiculo:', carro.__proto__ === veiculo);
console.log('harley.__proto__ === moto:', harley.__proto__ === moto);
console.log('moto.__proto__ === veiculo:', moto.__proto__ === veiculo);

// ========== MODIFICANDO PROTÓTIPOS EM TEMPO DE EXECUÇÃO ==========
console.log('\n--- MODIFICANDO PROTÓTIPOS EM TEMPO DE EXECUÇÃO ---');

// Adicionando método a todos os animais
Animal.prototype.envelhecer = function(anos = 1) {
    this.idade = (this.idade || 0) + anos;
    console.log(`${this.nome} envelheceu ${anos} ano(s). Idade atual: ${this.idade}`);
    
    // Reduz energia com a idade
    this.energia = Math.max(50, this.energia - anos * 5);
    return this;
};

// Adicionando propriedade a todos os veículos
veiculo.quilometragem = 0;
veiculo.rodar = function(distancia) {
    if (this.ligado && this.velocidade > 0) {
        this.quilometragem += distancia;
        console.log(`${this.modelo} rodou ${distancia} km. Quilometragem total: ${this.quilometragem} km`);
        
        // Consome combustível se for carro
        if (this.combustivel !== undefined) {
            this.consumirCombustivel();
        }
    } else {
        console.log('Veículo precisa estar ligado e em movimento');
    }
    return this;
};

console.log('\n🔄 Testando modificações em tempo de execução:');

// Testando novo método em animais existentes
rex.envelhecer(2);
mimi.envelhecer(1);

console.log('Rex após envelhecer:', rex.obterInfo());
console.log('Mimi após envelhecer:', mimi.obterInfo());

// Testando novo método em veículos existentes
civic.rodar(50);
ferrari.rodar(100);
harley.rodar(75);

console.log('\n📊 Status após rodar:');
console.log('Civic:', civic.obterStatus(), '- Quilometragem:', civic.quilometragem);
console.log('Ferrari:', ferrari.obterStatus(), '- Quilometragem:', ferrari.quilometragem);
console.log('Harley:', harley.obterStatus(), '- Quilometragem:', harley.quilometragem);

// ========== OBJECT.SETPROTOTYPEOF() E OBJECT.GETPROTOTYPEOF() ==========
console.log('\n--- OBJECT.SETPROTOTYPEOF() E OBJECT.GETPROTOTYPEOF() ---');

// Criando objetos sem herança inicial
const objetoSimples = {
    nome: 'Objeto Simples',
    valor: 42
};

// Protótipo com métodos úteis
const prototipoUtil = {
    duplicar: function() {
        return { ...this };
    },
    
    serializar: function() {
        return JSON.stringify(this);
    },
    
    obterTipo: function() {
        return typeof this;
    },
    
    obterChaves: function() {
        return Object.keys(this);
    }
};

console.log('\n🔧 Antes de definir protótipo:');
console.log('Protótipo atual:', Object.getPrototypeOf(objetoSimples) === Object.prototype);

try {
    objetoSimples.duplicar(); // Erro - método não existe
} catch (error) {
    console.log('Erro esperado:', error.message);
}

// Definindo novo protótipo
Object.setPrototypeOf(objetoSimples, prototipoUtil);

console.log('\n🔧 Após definir protótipo:');
console.log('Novo protótipo definido:', Object.getPrototypeOf(objetoSimples) === prototipoUtil);

// Agora os métodos estão disponíveis
console.log('Objeto duplicado:', objetoSimples.duplicar());
console.log('Objeto serializado:', objetoSimples.serializar());
console.log('Tipo do objeto:', objetoSimples.obterTipo());
console.log('Chaves do objeto:', objetoSimples.obterChaves());

// CUIDADO: Object.setPrototypeOf() pode ser lento
console.log('\n⚠️ AVISO: Object.setPrototypeOf() pode impactar performance!');
console.log('Prefira Object.create() quando possível.');

// ========== PADRÕES AVANÇADOS DE HERANÇA ==========
console.log('\n--- PADRÕES AVANÇADOS DE HERANÇA ---');

// Padrão Mixin - Composição de comportamentos
const voadorMixin = {
    voar: function(altitude = 100) {
        if (this.energia >= 30) {
            console.log(`${this.nome} está voando a ${altitude} metros de altitude`);
            this.gastarEnergia(30);
            this.altitude = altitude;
        } else {
            console.log(`${this.nome} não tem energia para voar`);
        }
        return this;
    },
    
    pousar: function() {
        if (this.altitude > 0) {
            console.log(`${this.nome} pousou`);
            this.altitude = 0;
        } else {
            console.log(`${this.nome} já está no chão`);
        }
        return this;
    }
};

const nadadorMixin = {
    nadar: function(distancia = 100) {
        if (this.energia >= 20) {
            console.log(`${this.nome} nadou ${distancia} metros`);
            this.gastarEnergia(20);
        } else {
            console.log(`${this.nome} não tem energia para nadar`);
        }
        return this;
    },
    
    mergulhar: function(profundidade = 10) {
        if (this.energia >= 25) {
            console.log(`${this.nome} mergulhou a ${profundidade} metros de profundidade`);
            this.gastarEnergia(25);
        } else {
            console.log(`${this.nome} não tem energia para mergulhar`);
        }
        return this;
    }
};

// Função para aplicar mixins
function aplicarMixins(construtor, ...mixins) {
    mixins.forEach(mixin => {
        Object.assign(construtor.prototype, mixin);
    });
}

// Criando classe Pássaro que herda de Animal e usa mixins
function Passaro(nome, especie, envergadura) {
    Animal.call(this, nome, especie);
    this.envergadura = envergadura;
    this.altitude = 0;
}

// Herança básica
Passaro.prototype = Object.create(Animal.prototype);
Passaro.prototype.constructor = Passaro;

// Aplicando mixin de voo
aplicarMixins(Passaro, voadorMixin);

// Métodos específicos
Passaro.prototype.cantar = function() {
    console.log(`${this.nome} está cantando: ♪♫♪`);
    return this;
};

Passaro.prototype.construirNinho = function() {
    if (this.energia >= 40) {
        console.log(`${this.nome} está construindo um ninho`);
        this.gastarEnergia(40);
    } else {
        console.log(`${this.nome} não tem energia para construir ninho`);
    }
    return this;
};

// Sobrescreve emitirSom
Passaro.prototype.emitirSom = function() {
    return this.cantar();
};

// Criando classe Pato que herda de Pássaro e usa múltiplos mixins
function Pato(nome, raca) {
    Passaro.call(this, nome, 'Anas platyrhynchos', 60);
    this.raca = raca;
}

// Herança de Pássaro
Pato.prototype = Object.create(Passaro.prototype);
Pato.prototype.constructor = Pato;

// Aplicando mixin de natação (patos também nadam)
aplicarMixins(Pato, nadadorMixin);

// Métodos específicos
Pato.prototype.grasnar = function() {
    console.log(`${this.nome} grasna: Quack quack!`);
    return this;
};

// Sobrescreve cantar
Pato.prototype.cantar = function() {
    return this.grasnar();
};

// Testando herança com mixins
console.log('\n🦅 Testando Pássaro com mixin:');

const aguia = new Passaro('Águia', 'Aquila chrysaetos', 200);
aguia.comer('peixe')
     .voar(500)
     .cantar()
     .construirNinho()
     .pousar();

console.log('Info da águia:', aguia.obterInfo());

console.log('\n🦆 Testando Pato com múltiplos mixins:');

const donald = new Pato('Donald', 'Pato Branco');
donald.comer('milho')
      .voar(50)
      .nadar(200)
      .mergulhar(5)
      .grasnar()
      .pousar();

console.log('Info do Donald:', donald.obterInfo());

// Verificando capacidades
console.log('\n🔍 Verificando capacidades:');
console.log('Águia pode voar:', typeof aguia.voar === 'function');
console.log('Águia pode nadar:', typeof aguia.nadar === 'function');
console.log('Donald pode voar:', typeof donald.voar === 'function');
console.log('Donald pode nadar:', typeof donald.nadar === 'function');

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Funcionários
console.log('\n--- EXERCÍCIO 1: SISTEMA DE FUNCIONÁRIOS ---');

// Classe base Pessoa
function Pessoa(nome, idade, cpf) {
    this.nome = nome;
    this.idade = idade;
    this.cpf = cpf;
    this.endereco = null;
}

Pessoa.prototype.definirEndereco = function(endereco) {
    this.endereco = endereco;
    console.log(`Endereço definido para ${this.nome}`);
    return this;
};

Pessoa.prototype.obterIdade = function() {
    return this.idade;
};

Pessoa.prototype.aniversario = function() {
    this.idade++;
    console.log(`${this.nome} fez aniversário! Nova idade: ${this.idade}`);
    return this;
};

Pessoa.prototype.obterInfo = function() {
    return {
        nome: this.nome,
        idade: this.idade,
        cpf: this.cpf,
        endereco: this.endereco
    };
};

// Classe Funcionário
function Funcionario(nome, idade, cpf, cargo, salario) {
    Pessoa.call(this, nome, idade, cpf);
    this.cargo = cargo;
    this.salario = salario;
    this.dataAdmissao = new Date();
    this.ativo = true;
    this.historicoCargos = [{ cargo, dataInicio: new Date(), salario }];
}

// Herança
Funcionario.prototype = Object.create(Pessoa.prototype);
Funcionario.prototype.constructor = Funcionario;

// Métodos específicos
Funcionario.prototype.promover = function(novoCargo, novoSalario) {
    if (novoSalario > this.salario) {
        this.historicoCargos.push({
            cargo: this.cargo,
            dataFim: new Date()
        });
        
        this.cargo = novoCargo;
        this.salario = novoSalario;
        
        this.historicoCargos.push({
            cargo: novoCargo,
            dataInicio: new Date(),
            salario: novoSalario
        });
        
        console.log(`${this.nome} foi promovido para ${novoCargo} com salário R$ ${novoSalario}`);
    } else {
        console.log('Promoção deve incluir aumento salarial');
    }
    return this;
};

Funcionario.prototype.demitir = function() {
    this.ativo = false;
    console.log(`${this.nome} foi demitido`);
    return this;
};

Funcionario.prototype.calcularTempoEmpresa = function() {
    const agora = new Date();
    const tempo = agora - this.dataAdmissao;
    const anos = Math.floor(tempo / (1000 * 60 * 60 * 24 * 365));
    const meses = Math.floor((tempo % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return { anos, meses };
};

// Sobrescreve obterInfo
Funcionario.prototype.obterInfo = function() {
    const infoBase = Pessoa.prototype.obterInfo.call(this);
    const tempo = this.calcularTempoEmpresa();
    
    return {
        ...infoBase,
        cargo: this.cargo,
        salario: this.salario,
        ativo: this.ativo,
        tempoEmpresa: `${tempo.anos} anos e ${tempo.meses} meses`,
        totalCargos: this.historicoCargos.length
    };
};

// Classe Gerente
function Gerente(nome, idade, cpf, salario, departamento) {
    Funcionario.call(this, nome, idade, cpf, 'Gerente', salario);
    this.departamento = departamento;
    this.subordinados = [];
    this.metas = [];
}

// Herança
Gerente.prototype = Object.create(Funcionario.prototype);
Gerente.prototype.constructor = Gerente;

// Métodos específicos
Gerente.prototype.adicionarSubordinado = function(funcionario) {
    if (funcionario instanceof Funcionario && !this.subordinados.includes(funcionario)) {
        this.subordinados.push(funcionario);
        console.log(`${funcionario.nome} agora reporta para ${this.nome}`);
    }
    return this;
};

Gerente.prototype.removerSubordinado = function(funcionario) {
    const index = this.subordinados.indexOf(funcionario);
    if (index > -1) {
        this.subordinados.splice(index, 1);
        console.log(`${funcionario.nome} não reporta mais para ${this.nome}`);
    }
    return this;
};

Gerente.prototype.definirMeta = function(descricao, prazo) {
    this.metas.push({
        descricao,
        prazo: new Date(prazo),
        concluida: false,
        dataCriacao: new Date()
    });
    console.log(`Meta definida: ${descricao}`);
    return this;
};

Gerente.prototype.concluirMeta = function(indice) {
    if (this.metas[indice]) {
        this.metas[indice].concluida = true;
        this.metas[indice].dataConclusao = new Date();
        console.log(`Meta concluída: ${this.metas[indice].descricao}`);
    }
    return this;
};

Gerente.prototype.obterRelatorio = function() {
    return {
        gerente: this.nome,
        departamento: this.departamento,
        subordinados: this.subordinados.length,
        metasTotal: this.metas.length,
        metasConcluidas: this.metas.filter(m => m.concluida).length,
        equipe: this.subordinados.map(s => ({
            nome: s.nome,
            cargo: s.cargo,
            ativo: s.ativo
        }))
    };
};

// Testando sistema de funcionários
console.log('\n👥 Testando sistema de funcionários:');

// Criando funcionários
const joao = new Funcionario('João Silva', 30, '123.456.789-00', 'Desenvolvedor', 5000);
const maria = new Funcionario('Maria Santos', 28, '987.654.321-00', 'Analista', 4000);
const pedro = new Funcionario('Pedro Costa', 35, '456.789.123-00', 'Designer', 4500);

// Criando gerente
const ana = new Gerente('Ana Oliveira', 40, '789.123.456-00', 8000, 'Tecnologia');

// Definindo endereços
joao.definirEndereco('Rua A, 123');
maria.definirEndereco('Rua B, 456');
ana.definirEndereco('Rua C, 789');

// Gerente adicionando subordinados
ana.adicionarSubordinado(joao)
   .adicionarSubordinado(maria)
   .adicionarSubordinado(pedro);

// Definindo metas
ana.definirMeta('Lançar novo produto', '2024-12-31')
   .definirMeta('Reduzir bugs em 50%', '2024-06-30')
   .definirMeta('Treinar equipe em novas tecnologias', '2024-09-30');

// Promovendo funcionário
joao.promover('Desenvolvedor Sênior', 6000);

// Concluindo meta
ana.concluirMeta(1);

console.log('\n📊 Informações dos funcionários:');
console.log('João:', joao.obterInfo());
console.log('Maria:', maria.obterInfo());
console.log('Ana:', ana.obterInfo());

console.log('\n📋 Relatório da gerente:');
console.log(ana.obterRelatorio());

// EXERCÍCIO 2: Sistema de Formas Geométricas
console.log('\n--- EXERCÍCIO 2: SISTEMA DE FORMAS GEOMÉTRICAS ---');

// Classe base Forma
function Forma(cor = 'branco') {
    this.cor = cor;
    this.visivel = true;
}

Forma.prototype.mostrar = function() {
    this.visivel = true;
    console.log(`${this.constructor.name} ${this.cor} está visível`);
    return this;
};

Forma.prototype.esconder = function() {
    this.visivel = false;
    console.log(`${this.constructor.name} ${this.cor} está escondida`);
    return this;
};

Forma.prototype.mudarCor = function(novaCor) {
    console.log(`${this.constructor.name} mudou de ${this.cor} para ${novaCor}`);
    this.cor = novaCor;
    return this;
};

// Métodos abstratos (devem ser implementados pelas subclasses)
Forma.prototype.calcularArea = function() {
    throw new Error('Método calcularArea deve ser implementado pela subclasse');
};

Forma.prototype.calcularPerimetro = function() {
    throw new Error('Método calcularPerimetro deve ser implementado pela subclasse');
};

Forma.prototype.obterInfo = function() {
    return {
        tipo: this.constructor.name,
        cor: this.cor,
        visivel: this.visivel,
        area: this.calcularArea(),
        perimetro: this.calcularPerimetro()
    };
};

// Classe Retângulo
function Retangulo(largura, altura, cor) {
    Forma.call(this, cor);
    this.largura = largura;
    this.altura = altura;
}

Retangulo.prototype = Object.create(Forma.prototype);
Retangulo.prototype.constructor = Retangulo;

Retangulo.prototype.calcularArea = function() {
    return this.largura * this.altura;
};

Retangulo.prototype.calcularPerimetro = function() {
    return 2 * (this.largura + this.altura);
};

Retangulo.prototype.redimensionar = function(novaLargura, novaAltura) {
    console.log(`Retângulo redimensionado de ${this.largura}x${this.altura} para ${novaLargura}x${novaAltura}`);
    this.largura = novaLargura;
    this.altura = novaAltura;
    return this;
};

// Classe Círculo
function Circulo(raio, cor) {
    Forma.call(this, cor);
    this.raio = raio;
}

Circulo.prototype = Object.create(Forma.prototype);
Circulo.prototype.constructor = Circulo;

Circulo.prototype.calcularArea = function() {
    return Math.PI * this.raio * this.raio;
};

Circulo.prototype.calcularPerimetro = function() {
    return 2 * Math.PI * this.raio;
};

Circulo.prototype.redimensionar = function(novoRaio) {
    console.log(`Círculo redimensionado de raio ${this.raio} para ${novoRaio}`);
    this.raio = novoRaio;
    return this;
};

// Classe Quadrado (herda de Retângulo)
function Quadrado(lado, cor) {
    Retangulo.call(this, lado, lado, cor);
}

Quadrado.prototype = Object.create(Retangulo.prototype);
Quadrado.prototype.constructor = Quadrado;

// Sobrescreve redimensionar para manter proporção
Quadrado.prototype.redimensionar = function(novoLado) {
    console.log(`Quadrado redimensionado de lado ${this.largura} para ${novoLado}`);
    this.largura = novoLado;
    this.altura = novoLado;
    return this;
};

// Classe Triângulo
function Triangulo(base, altura, lado1, lado2, cor) {
    Forma.call(this, cor);
    this.base = base;
    this.altura = altura;
    this.lado1 = lado1 || base;
    this.lado2 = lado2 || base;
}

Triangulo.prototype = Object.create(Forma.prototype);
Triangulo.prototype.constructor = Triangulo;

Triangulo.prototype.calcularArea = function() {
    return (this.base * this.altura) / 2;
};

Triangulo.prototype.calcularPerimetro = function() {
    return this.base + this.lado1 + this.lado2;
};

Triangulo.prototype.verificarTipo = function() {
    if (this.base === this.lado1 && this.lado1 === this.lado2) {
        return 'equilátero';
    } else if (this.base === this.lado1 || this.lado1 === this.lado2 || this.base === this.lado2) {
        return 'isósceles';
    } else {
        return 'escaleno';
    }
};

// Sistema de desenho
const sistemaDesenho = {
    formas: [],
    
    adicionarForma: function(forma) {
        if (forma instanceof Forma) {
            this.formas.push(forma);
            console.log(`${forma.constructor.name} ${forma.cor} adicionada ao desenho`);
        }
        return this;
    },
    
    removerForma: function(indice) {
        if (this.formas[indice]) {
            const forma = this.formas.splice(indice, 1)[0];
            console.log(`${forma.constructor.name} ${forma.cor} removida do desenho`);
        }
        return this;
    },
    
    calcularAreaTotal: function() {
        return this.formas.reduce((total, forma) => total + forma.calcularArea(), 0);
    },
    
    listarFormas: function() {
        console.log('\n📐 Formas no desenho:');
        this.formas.forEach((forma, index) => {
            const info = forma.obterInfo();
            console.log(`${index + 1}. ${info.tipo} ${info.cor} - Área: ${info.area.toFixed(2)} - Perímetro: ${info.perimetro.toFixed(2)}`);
        });
        return this;
    },
    
    obterEstatisticas: function() {
        const tipos = {};
        let areaTotal = 0;
        
        this.formas.forEach(forma => {
            const tipo = forma.constructor.name;
            tipos[tipo] = (tipos[tipo] || 0) + 1;
            areaTotal += forma.calcularArea();
        });
        
        return {
            totalFormas: this.formas.length,
            tipos,
            areaTotal: areaTotal.toFixed(2)
        };
    }
};

// Testando sistema de formas
console.log('\n📐 Testando sistema de formas geométricas:');

// Criando formas
const retangulo = new Retangulo(10, 5, 'azul');
const circulo = new Circulo(3, 'vermelho');
const quadrado = new Quadrado(4, 'verde');
const triangulo = new Triangulo(6, 4, 5, 7, 'amarelo');

// Adicionando ao sistema
sistemaDesenho
    .adicionarForma(retangulo)
    .adicionarForma(circulo)
    .adicionarForma(quadrado)
    .adicionarForma(triangulo);

// Manipulando formas
retangulo.redimensionar(12, 6).mudarCor('azul escuro');
circulo.redimensionar(4).esconder();
quadrado.redimensionar(5);

console.log('\nTipo do triângulo:', triangulo.verificarTipo());

// Listando formas
sistemaDesenho.listarFormas();

console.log('\n📊 Estatísticas do desenho:', sistemaDesenho.obterEstatisticas());

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Evite cadeias de protótipos muito longas
console.log('\n--- DICA 1: Cadeias de Protótipos ---');
console.log('✅ Mantenha cadeias de protótipos curtas (máximo 3-4 níveis)');
console.log('✅ Cadeias longas impactam performance na busca de propriedades');
console.log('✅ Use composição quando a herança ficar muito complexa');

// DICA 2: Use hasOwnProperty para verificar propriedades próprias
console.log('\n--- DICA 2: hasOwnProperty ---');

const objetoTeste = { propriedadePropria: 'valor' };

console.log('Propriedade própria:', objetoTeste.hasOwnProperty('propriedadePropria'));
console.log('Propriedade herdada (toString):', objetoTeste.hasOwnProperty('toString'));
console.log('Mas toString existe:', 'toString' in objetoTeste);

// DICA 3: Use Object.create(null) para objetos sem protótipo
console.log('\n--- DICA 3: Objetos sem Protótipo ---');

const mapaSemPrototipo = Object.create(null);
mapaSemPrototipo.chave1 = 'valor1';
mapaSemPrototipo.chave2 = 'valor2';

console.log('Objeto sem protótipo:', Object.getPrototypeOf(mapaSemPrototipo));
console.log('Não tem toString:', mapaSemPrototipo.toString === undefined);
console.log('Ideal para mapas/dicionários puros');

// DICA 4: Performance de instanceof vs typeof
console.log('\n--- DICA 4: Performance de Verificação de Tipos ---');

const arr = [];
const obj = {};

console.time('instanceof Array');
for (let i = 0; i < 100000; i++) {
    arr instanceof Array;
}
console.timeEnd('instanceof Array');

console.time('Array.isArray');
for (let i = 0; i < 100000; i++) {
    Array.isArray(arr);
}
console.timeEnd('Array.isArray');

console.log('✅ Array.isArray() é mais rápido que instanceof Array');

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Inheritance and the prototype chain: https://developer.mozilla.org/docs/Web/JavaScript/Inheritance_and_the_prototype_chain');
console.log('📚 MDN - Object.create(): https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create');
console.log('📚 MDN - Object.setPrototypeOf(): https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf');
console.log('📚 JavaScript.info - Prototypal inheritance: https://javascript.info/prototype-inheritance');
console.log('📚 You Don\'t Know JS - this & Object Prototypes: https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/this%20%26%20object%20prototypes/README.md');
console.log('📚 Eloquent JavaScript - The Secret Life of Objects: https://eloquentjavascript.net/06_object.html');

console.log('\n✅ Módulo 4.2 - Protótipos e Herança concluído!');
console.log('📚 Próximo: Classes ES6+');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Animal,
        Mamifero,
        Cachorro,
        Gato,
        veiculo,
        carro,
        moto,
        voadorMixin,
        nadadorMixin,
        aplicarMixins,
        Passaro,
        Pato,
        Pessoa,
        Funcionario,
        Gerente,
        Forma,
        Retangulo,
        Circulo,
        Quadrado,
        Triangulo,
        sistemaDesenho
    };
}