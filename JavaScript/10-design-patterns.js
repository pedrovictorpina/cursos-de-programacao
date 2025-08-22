/*
===========================================
    CURSO JAVASCRIPT - DESIGN PATTERNS
===========================================

Este arquivo aborda:
- Conceitos fundamentais de Design Patterns
- Padrões Criacionais (Singleton, Factory, Builder)
- Padrões Estruturais (Module, Decorator, Facade)
- Padrões Comportamentais (Observer, Strategy, Command)
- Padrões específicos para JavaScript
- Implementações modernas com ES6+
- Casos de uso práticos
- Anti-patterns a evitar

NOTA: Design Patterns são soluções reutilizáveis para problemas comuns
em desenvolvimento de software. Eles não são código, mas sim conceitos
que podem ser implementados de diferentes formas.
*/

// ========================================
// 1. CONCEITOS FUNDAMENTAIS
// ========================================

/*
Design Patterns são soluções testadas e comprovadas para problemas
recorrentes no desenvolvimento de software. Eles fornecem:

1. Vocabulário comum entre desenvolvedores
2. Soluções reutilizáveis e testadas
3. Melhores práticas de arquitetura
4. Facilidade de manutenção e extensão

Categorias principais:
- Criacionais: Como objetos são criados
- Estruturais: Como objetos são compostos
- Comportamentais: Como objetos interagem
*/

console.log('=== DESIGN PATTERNS EM JAVASCRIPT ==>');

// ========================================
// 2. PADRÕES CRIACIONAIS
// ========================================

// SINGLETON PATTERN
// Garante que uma classe tenha apenas uma instância
console.log('\n=== SINGLETON PATTERN ==>');

// Implementação clássica
class DatabaseConnection {
    constructor() {
        if (DatabaseConnection.instance) {
            return DatabaseConnection.instance;
        }
        
        this.connection = null;
        this.isConnected = false;
        DatabaseConnection.instance = this;
        
        return this;
    }
    
    connect() {
        if (!this.isConnected) {
            this.connection = 'Conexão estabelecida';
            this.isConnected = true;
            console.log('Conectado ao banco de dados');
        }
        return this.connection;
    }
    
    disconnect() {
        if (this.isConnected) {
            this.connection = null;
            this.isConnected = false;
            console.log('Desconectado do banco de dados');
        }
    }
    
    query(sql) {
        if (!this.isConnected) {
            throw new Error('Não conectado ao banco de dados');
        }
        return `Executando: ${sql}`;
    }
}

// Teste do Singleton
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();

console.log('db1 === db2:', db1 === db2); // true
db1.connect();
console.log('Query resultado:', db2.query('SELECT * FROM users'));

// Implementação moderna com módulo
const ConfigManager = (() => {
    let instance;
    let config = {};
    
    function createInstance() {
        return {
            set(key, value) {
                config[key] = value;
            },
            
            get(key) {
                return config[key];
            },
            
            getAll() {
                return { ...config };
            },
            
            reset() {
                config = {};
            }
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Teste do ConfigManager
const config1 = ConfigManager.getInstance();
const config2 = ConfigManager.getInstance();

config1.set('apiUrl', 'https://api.exemplo.com');
console.log('Config2 apiUrl:', config2.get('apiUrl')); // Mesma instância

// FACTORY PATTERN
// Cria objetos sem especificar suas classes exatas
console.log('\n=== FACTORY PATTERN ==>');

// Factory simples
class Animal {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    
    speak() {
        return `${this.name} faz um som`;
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name, 'Dog');
    }
    
    speak() {
        return `${this.name} late: Au au!`;
    }
}

class Cat extends Animal {
    constructor(name) {
        super(name, 'Cat');
    }
    
    speak() {
        return `${this.name} mia: Miau!`;
    }
}

class Bird extends Animal {
    constructor(name) {
        super(name, 'Bird');
    }
    
    speak() {
        return `${this.name} canta: Piu piu!`;
    }
}

// Factory
class AnimalFactory {
    static createAnimal(type, name) {
        switch (type.toLowerCase()) {
            case 'dog':
                return new Dog(name);
            case 'cat':
                return new Cat(name);
            case 'bird':
                return new Bird(name);
            default:
                throw new Error(`Tipo de animal '${type}' não suportado`);
        }
    }
    
    // Factory com registro dinâmico
    static animalTypes = new Map([
        ['dog', Dog],
        ['cat', Cat],
        ['bird', Bird]
    ]);
    
    static registerAnimalType(type, AnimalClass) {
        this.animalTypes.set(type.toLowerCase(), AnimalClass);
    }
    
    static createAnimalDynamic(type, name) {
        const AnimalClass = this.animalTypes.get(type.toLowerCase());
        if (!AnimalClass) {
            throw new Error(`Tipo de animal '${type}' não registrado`);
        }
        return new AnimalClass(name);
    }
}

// Teste do Factory
const dog = AnimalFactory.createAnimal('dog', 'Rex');
const cat = AnimalFactory.createAnimal('cat', 'Whiskers');
const bird = AnimalFactory.createAnimal('bird', 'Tweety');

console.log(dog.speak());
console.log(cat.speak());
console.log(bird.speak());

// BUILDER PATTERN
// Constrói objetos complexos passo a passo
console.log('\n=== BUILDER PATTERN ==>');

class Computer {
    constructor() {
        this.cpu = null;
        this.ram = null;
        this.storage = null;
        this.gpu = null;
        this.motherboard = null;
    }
    
    getSpecs() {
        return {
            cpu: this.cpu,
            ram: this.ram,
            storage: this.storage,
            gpu: this.gpu,
            motherboard: this.motherboard
        };
    }
}

class ComputerBuilder {
    constructor() {
        this.computer = new Computer();
    }
    
    setCPU(cpu) {
        this.computer.cpu = cpu;
        return this; // Permite method chaining
    }
    
    setRAM(ram) {
        this.computer.ram = ram;
        return this;
    }
    
    setStorage(storage) {
        this.computer.storage = storage;
        return this;
    }
    
    setGPU(gpu) {
        this.computer.gpu = gpu;
        return this;
    }
    
    setMotherboard(motherboard) {
        this.computer.motherboard = motherboard;
        return this;
    }
    
    build() {
        // Validações podem ser feitas aqui
        if (!this.computer.cpu || !this.computer.ram) {
            throw new Error('CPU e RAM são obrigatórios');
        }
        
        const result = this.computer;
        this.computer = new Computer(); // Reset para próxima construção
        return result;
    }
}

// Director para configurações pré-definidas
class ComputerDirector {
    static buildGamingPC() {
        return new ComputerBuilder()
            .setCPU('Intel i9-12900K')
            .setRAM('32GB DDR4')
            .setStorage('1TB NVMe SSD')
            .setGPU('RTX 4080')
            .setMotherboard('ASUS ROG Strix')
            .build();
    }
    
    static buildOfficePC() {
        return new ComputerBuilder()
            .setCPU('Intel i5-12400')
            .setRAM('16GB DDR4')
            .setStorage('512GB SSD')
            .setMotherboard('MSI B660M')
            .build();
    }
}

// Teste do Builder
const gamingPC = ComputerDirector.buildGamingPC();
const officePC = ComputerDirector.buildOfficePC();

console.log('Gaming PC:', gamingPC.getSpecs());
console.log('Office PC:', officePC.getSpecs());

// Construção customizada
const customPC = new ComputerBuilder()
    .setCPU('AMD Ryzen 7')
    .setRAM('64GB DDR4')
    .setStorage('2TB NVMe SSD')
    .build();

console.log('Custom PC:', customPC.getSpecs());

// ========================================
// 3. PADRÕES ESTRUTURAIS
// ========================================

// MODULE PATTERN
// Encapsula código em módulos com interface pública/privada
console.log('\n=== MODULE PATTERN ==>');

// Revealing Module Pattern
const CalculatorModule = (() => {
    // Variáveis privadas
    let history = [];
    let precision = 2;
    
    // Funções privadas
    function logOperation(operation, result) {
        history.push({
            operation,
            result,
            timestamp: new Date()
        });
    }
    
    function roundResult(result) {
        return Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    
    // Interface pública
    return {
        add(a, b) {
            const result = roundResult(a + b);
            logOperation(`${a} + ${b}`, result);
            return result;
        },
        
        subtract(a, b) {
            const result = roundResult(a - b);
            logOperation(`${a} - ${b}`, result);
            return result;
        },
        
        multiply(a, b) {
            const result = roundResult(a * b);
            logOperation(`${a} * ${b}`, result);
            return result;
        },
        
        divide(a, b) {
            if (b === 0) {
                throw new Error('Divisão por zero não permitida');
            }
            const result = roundResult(a / b);
            logOperation(`${a} / ${b}`, result);
            return result;
        },
        
        getHistory() {
            return [...history]; // Retorna cópia
        },
        
        clearHistory() {
            history = [];
        },
        
        setPrecision(newPrecision) {
            precision = Math.max(0, Math.min(10, newPrecision));
        }
    };
})();

// Teste do Module
console.log('Soma:', CalculatorModule.add(10, 5));
console.log('Divisão:', CalculatorModule.divide(10, 3));
console.log('Histórico:', CalculatorModule.getHistory());

// DECORATOR PATTERN
// Adiciona funcionalidades a objetos dinamicamente
console.log('\n=== DECORATOR PATTERN ==>');

// Implementação com classes
class Coffee {
    cost() {
        return 2;
    }
    
    description() {
        return 'Café simples';
    }
}

// Decorator base
class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }
    
    cost() {
        return this.coffee.cost();
    }
    
    description() {
        return this.coffee.description();
    }
}

// Decorators específicos
class MilkDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 0.5;
    }
    
    description() {
        return this.coffee.description() + ', com leite';
    }
}

class SugarDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 0.2;
    }
    
    description() {
        return this.coffee.description() + ', com açúcar';
    }
}

class WhipDecorator extends CoffeeDecorator {
    cost() {
        return this.coffee.cost() + 0.7;
    }
    
    description() {
        return this.coffee.description() + ', com chantilly';
    }
}

// Teste do Decorator
let myCoffee = new Coffee();
console.log(`${myCoffee.description()} - R$ ${myCoffee.cost()}`);

myCoffee = new MilkDecorator(myCoffee);
console.log(`${myCoffee.description()} - R$ ${myCoffee.cost()}`);

myCoffee = new SugarDecorator(myCoffee);
console.log(`${myCoffee.description()} - R$ ${myCoffee.cost()}`);

myCoffee = new WhipDecorator(myCoffee);
console.log(`${myCoffee.description()} - R$ ${myCoffee.cost()}`);

// Implementação funcional do Decorator
function createLogger(fn) {
    return function(...args) {
        console.log(`Chamando função com argumentos:`, args);
        const result = fn.apply(this, args);
        console.log(`Resultado:`, result);
        return result;
    };
}

function createTimer(fn) {
    return function(...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`Função executada em ${end - start}ms`);
        return result;
    };
}

function createCache(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            console.log('Resultado do cache');
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Função para decorar
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Aplicando decorators
const decoratedFib = createCache(createTimer(createLogger(fibonacci)));
console.log('\nFibonacci decorado:');
console.log(decoratedFib(10));
console.log(decoratedFib(10)); // Segunda chamada usa cache

// FACADE PATTERN
// Fornece interface simplificada para subsistema complexo
console.log('\n=== FACADE PATTERN ==>');

// Subsistemas complexos
class CPU {
    freeze() { console.log('CPU: Congelando processador'); }
    jump(position) { console.log(`CPU: Saltando para posição ${position}`); }
    execute() { console.log('CPU: Executando instruções'); }
}

class Memory {
    load(position, data) {
        console.log(`Memory: Carregando dados na posição ${position}`);
    }
}

class HardDrive {
    read(lba, size) {
        console.log(`HardDrive: Lendo ${size} bytes do setor ${lba}`);
        return 'dados do boot';
    }
}

// Facade que simplifica a inicialização
class ComputerFacade {
    constructor() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.hardDrive = new HardDrive();
    }
    
    start() {
        console.log('Iniciando computador...');
        this.cpu.freeze();
        const bootData = this.hardDrive.read(0, 1024);
        this.memory.load(0, bootData);
        this.cpu.jump(0);
        this.cpu.execute();
        console.log('Computador iniciado com sucesso!');
    }
}

// Uso simplificado através do Facade
const computer = new ComputerFacade();
computer.start();

// ========================================
// 4. PADRÕES COMPORTAMENTAIS
// ========================================

// OBSERVER PATTERN
// Define dependência um-para-muitos entre objetos
console.log('\n=== OBSERVER PATTERN ==>');

class Subject {
    constructor() {
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
        this.observers.forEach(observer => {
            try {
                observer.update(data);
            } catch (error) {
                console.error('Erro ao notificar observer:', error);
            }
        });
    }
}

// Implementação específica
class NewsAgency extends Subject {
    constructor() {
        super();
        this.news = null;
    }
    
    setNews(news) {
        this.news = news;
        this.notify(news);
    }
    
    getNews() {
        return this.news;
    }
}

// Observers
class NewsChannel {
    constructor(name) {
        this.name = name;
    }
    
    update(news) {
        console.log(`${this.name} recebeu notícia: ${news}`);
    }
}

class NewsWebsite {
    constructor(url) {
        this.url = url;
        this.articles = [];
    }
    
    update(news) {
        this.articles.push({
            title: news,
            publishedAt: new Date(),
            url: this.url
        });
        console.log(`${this.url} publicou: ${news}`);
    }
    
    getArticles() {
        return this.articles;
    }
}

// Teste do Observer
const newsAgency = new NewsAgency();
const cnn = new NewsChannel('CNN');
const bbc = new NewsChannel('BBC');
const website = new NewsWebsite('news.com');

newsAgency.subscribe(cnn);
newsAgency.subscribe(bbc);
newsAgency.subscribe(website);

newsAgency.setNews('JavaScript é a linguagem mais popular de 2024!');
newsAgency.setNews('Nova versão do Node.js foi lançada');

console.log('Artigos do website:', website.getArticles());

// STRATEGY PATTERN
// Define família de algoritmos e os torna intercambiáveis
console.log('\n=== STRATEGY PATTERN ==>');

// Estratégias de pagamento
class PaymentStrategy {
    pay(amount) {
        throw new Error('Método pay deve ser implementado');
    }
}

class CreditCardPayment extends PaymentStrategy {
    constructor(cardNumber, cvv) {
        super();
        this.cardNumber = cardNumber;
        this.cvv = cvv;
    }
    
    pay(amount) {
        console.log(`Pagamento de R$ ${amount} realizado com cartão de crédito ****${this.cardNumber.slice(-4)}`);
        return {
            success: true,
            transactionId: Math.random().toString(36).substr(2, 9),
            method: 'credit_card'
        };
    }
}

class PayPalPayment extends PaymentStrategy {
    constructor(email) {
        super();
        this.email = email;
    }
    
    pay(amount) {
        console.log(`Pagamento de R$ ${amount} realizado via PayPal (${this.email})`);
        return {
            success: true,
            transactionId: Math.random().toString(36).substr(2, 9),
            method: 'paypal'
        };
    }
}

class BankTransferPayment extends PaymentStrategy {
    constructor(bankAccount) {
        super();
        this.bankAccount = bankAccount;
    }
    
    pay(amount) {
        console.log(`Transferência de R$ ${amount} para conta ${this.bankAccount}`);
        return {
            success: true,
            transactionId: Math.random().toString(36).substr(2, 9),
            method: 'bank_transfer'
        };
    }
}

// Context que usa as estratégias
class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    
    processPayment(amount) {
        if (!this.strategy) {
            throw new Error('Estratégia de pagamento não definida');
        }
        return this.strategy.pay(amount);
    }
}

// Teste do Strategy
const processor = new PaymentProcessor();

// Pagamento com cartão
processor.setStrategy(new CreditCardPayment('1234567890123456', '123'));
let result = processor.processPayment(100);
console.log('Resultado:', result);

// Mudança para PayPal
processor.setStrategy(new PayPalPayment('user@email.com'));
result = processor.processPayment(50);
console.log('Resultado:', result);

// COMMAND PATTERN
// Encapsula requisições como objetos
console.log('\n=== COMMAND PATTERN ==>');

// Receiver - quem executa a ação
class TextEditor {
    constructor() {
        this.content = '';
    }
    
    write(text) {
        this.content += text;
    }
    
    delete(length) {
        this.content = this.content.slice(0, -length);
    }
    
    getContent() {
        return this.content;
    }
    
    setContent(content) {
        this.content = content;
    }
}

// Command interface
class Command {
    execute() {
        throw new Error('Método execute deve ser implementado');
    }
    
    undo() {
        throw new Error('Método undo deve ser implementado');
    }
}

// Comandos concretos
class WriteCommand extends Command {
    constructor(editor, text) {
        super();
        this.editor = editor;
        this.text = text;
    }
    
    execute() {
        this.editor.write(this.text);
    }
    
    undo() {
        this.editor.delete(this.text.length);
    }
}

class DeleteCommand extends Command {
    constructor(editor, length) {
        super();
        this.editor = editor;
        this.length = length;
        this.deletedText = '';
    }
    
    execute() {
        const content = this.editor.getContent();
        this.deletedText = content.slice(-this.length);
        this.editor.delete(this.length);
    }
    
    undo() {
        this.editor.write(this.deletedText);
    }
}

// Invoker - gerencia comandos
class EditorInvoker {
    constructor() {
        this.history = [];
        this.currentPosition = -1;
    }
    
    execute(command) {
        // Remove comandos após a posição atual (para redo)
        this.history = this.history.slice(0, this.currentPosition + 1);
        
        command.execute();
        this.history.push(command);
        this.currentPosition++;
    }
    
    undo() {
        if (this.currentPosition >= 0) {
            const command = this.history[this.currentPosition];
            command.undo();
            this.currentPosition--;
        }
    }
    
    redo() {
        if (this.currentPosition < this.history.length - 1) {
            this.currentPosition++;
            const command = this.history[this.currentPosition];
            command.execute();
        }
    }
}

// Teste do Command
const editor = new TextEditor();
const invoker = new EditorInvoker();

// Executar comandos
invoker.execute(new WriteCommand(editor, 'Olá '));
invoker.execute(new WriteCommand(editor, 'mundo!'));
console.log('Conteúdo:', editor.getContent());

invoker.execute(new DeleteCommand(editor, 6));
console.log('Após deletar:', editor.getContent());

invoker.execute(new WriteCommand(editor, 'JavaScript!'));
console.log('Após escrever:', editor.getContent());

// Undo/Redo
invoker.undo();
console.log('Após undo:', editor.getContent());

invoker.undo();
console.log('Após segundo undo:', editor.getContent());

invoker.redo();
console.log('Após redo:', editor.getContent());

// ========================================
// 5. PADRÕES ESPECÍFICOS PARA JAVASCRIPT
// ========================================

// MIXIN PATTERN
// Permite "herança múltipla" através de composição
console.log('\n=== MIXIN PATTERN ==>');

// Mixins
const CanFly = {
    fly() {
        return `${this.name} está voando`;
    },
    
    land() {
        return `${this.name} pousou`;
    }
};

const CanSwim = {
    swim() {
        return `${this.name} está nadando`;
    },
    
    dive() {
        return `${this.name} mergulhou`;
    }
};

const CanWalk = {
    walk() {
        return `${this.name} está caminhando`;
    },
    
    run() {
        return `${this.name} está correndo`;
    }
};

// Função para aplicar mixins
function mixin(target, ...sources) {
    Object.assign(target.prototype, ...sources);
}

// Classes base
class Duck {
    constructor(name) {
        this.name = name;
    }
}

class Fish {
    constructor(name) {
        this.name = name;
    }
}

class Bird {
    constructor(name) {
        this.name = name;
    }
}

// Aplicar mixins
mixin(Duck, CanFly, CanSwim, CanWalk);
mixin(Fish, CanSwim);
mixin(Bird, CanFly, CanWalk);

// Teste dos Mixins
const duck = new Duck('Pato Donald');
console.log(duck.fly());
console.log(duck.swim());
console.log(duck.walk());

const fish = new Fish('Nemo');
console.log(fish.swim());
console.log(fish.dive());

const bird = new Bird('Tweety');
console.log(bird.fly());
console.log(bird.run());

// NAMESPACE PATTERN
// Organiza código em namespaces para evitar conflitos
console.log('\n=== NAMESPACE PATTERN ==>');

// Namespace global
const MyApp = MyApp || {};

// Módulos do namespace
MyApp.Utils = {
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(date);
    },
    
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};

MyApp.API = {
    baseUrl: 'https://api.exemplo.com',
    
    async get(endpoint) {
        // Simulação de requisição
        console.log(`GET ${this.baseUrl}${endpoint}`);
        return { data: 'dados simulados' };
    },
    
    async post(endpoint, data) {
        console.log(`POST ${this.baseUrl}${endpoint}`, data);
        return { success: true };
    }
};

MyApp.Components = {
    Modal: class {
        constructor(title, content) {
            this.title = title;
            this.content = content;
            this.isOpen = false;
        }
        
        open() {
            this.isOpen = true;
            console.log(`Modal "${this.title}" aberto`);
        }
        
        close() {
            this.isOpen = false;
            console.log(`Modal "${this.title}" fechado`);
        }
    },
    
    Button: class {
        constructor(text, onClick) {
            this.text = text;
            this.onClick = onClick;
        }
        
        click() {
            console.log(`Botão "${this.text}" clicado`);
            if (this.onClick) {
                this.onClick();
            }
        }
    }
};

// Teste do Namespace
console.log('Moeda formatada:', MyApp.Utils.formatCurrency(1234.56));
console.log('Data formatada:', MyApp.Utils.formatDate(new Date()));

const modal = new MyApp.Components.Modal('Confirmação', 'Tem certeza?');
modal.open();

const button = new MyApp.Components.Button('OK', () => {
    console.log('Ação do botão executada');
    modal.close();
});
button.click();

// ========================================
// 6. EXEMPLO PRÁTICO: SISTEMA DE PLUGINS
// ========================================

console.log('\n=== EXEMPLO PRÁTICO: SISTEMA DE PLUGINS ==>');

// Sistema principal usando vários patterns
class PluginSystem {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
        this.middleware = [];
    }
    
    // Strategy Pattern para diferentes tipos de plugins
    registerPlugin(name, plugin) {
        if (this.plugins.has(name)) {
            throw new Error(`Plugin ${name} já está registrado`);
        }
        
        this.plugins.set(name, plugin);
        
        // Observer Pattern para notificar sobre novo plugin
        this.notifyHooks('plugin:registered', { name, plugin });
        
        console.log(`Plugin ${name} registrado`);
    }
    
    // Command Pattern para executar plugins
    executePlugin(name, ...args) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin ${name} não encontrado`);
        }
        
        // Decorator Pattern para middleware
        let execution = () => plugin.execute(...args);
        
        // Aplicar middleware em ordem reversa
        for (let i = this.middleware.length - 1; i >= 0; i--) {
            const currentExecution = execution;
            const middleware = this.middleware[i];
            execution = () => middleware(currentExecution, name, ...args);
        }
        
        return execution();
    }
    
    // Observer Pattern para hooks
    addHook(event, callback) {
        if (!this.hooks.has(event)) {
            this.hooks.set(event, []);
        }
        this.hooks.get(event).push(callback);
    }
    
    notifyHooks(event, data) {
        const callbacks = this.hooks.get(event) || [];
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Erro no hook ${event}:`, error);
            }
        });
    }
    
    // Decorator Pattern para middleware
    addMiddleware(middleware) {
        this.middleware.push(middleware);
    }
    
    listPlugins() {
        return Array.from(this.plugins.keys());
    }
}

// Interface para plugins
class Plugin {
    constructor(name) {
        this.name = name;
    }
    
    execute() {
        throw new Error('Método execute deve ser implementado');
    }
}

// Plugins específicos
class LoggerPlugin extends Plugin {
    execute(message, level = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
        return { logged: true, timestamp, level, message };
    }
}

class CachePlugin extends Plugin {
    constructor() {
        super('cache');
        this.cache = new Map();
    }
    
    execute(key, value) {
        if (value !== undefined) {
            this.cache.set(key, {
                value,
                timestamp: Date.now()
            });
            return { action: 'set', key, value };
        } else {
            const cached = this.cache.get(key);
            return cached ? { action: 'get', key, value: cached.value } : null;
        }
    }
}

class ValidationPlugin extends Plugin {
    execute(data, rules) {
        const errors = [];
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];
            
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} é obrigatório`);
            }
            
            if (rule.type && typeof value !== rule.type) {
                errors.push(`${field} deve ser do tipo ${rule.type}`);
            }
            
            if (rule.min && value.length < rule.min) {
                errors.push(`${field} deve ter pelo menos ${rule.min} caracteres`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Middleware
function timingMiddleware(next, pluginName, ...args) {
    const start = performance.now();
    const result = next();
    const end = performance.now();
    console.log(`Plugin ${pluginName} executado em ${(end - start).toFixed(2)}ms`);
    return result;
}

function loggingMiddleware(next, pluginName, ...args) {
    console.log(`Executando plugin ${pluginName} com argumentos:`, args);
    const result = next();
    console.log(`Plugin ${pluginName} retornou:`, result);
    return result;
}

// Teste do sistema de plugins
const system = new PluginSystem();

// Adicionar middleware
system.addMiddleware(timingMiddleware);
system.addMiddleware(loggingMiddleware);

// Adicionar hooks
system.addHook('plugin:registered', ({ name }) => {
    console.log(`🔌 Novo plugin disponível: ${name}`);
});

// Registrar plugins
system.registerPlugin('logger', new LoggerPlugin());
system.registerPlugin('cache', new CachePlugin());
system.registerPlugin('validator', new ValidationPlugin());

// Usar plugins
system.executePlugin('logger', 'Sistema iniciado', 'info');

system.executePlugin('cache', 'user:123', { name: 'João', age: 30 });
const cachedUser = system.executePlugin('cache', 'user:123');
console.log('Usuário do cache:', cachedUser);

const validation = system.executePlugin('validator', 
    { name: 'João', email: 'joao@email.com' },
    {
        name: { required: true, type: 'string', min: 2 },
        email: { required: true, type: 'string' },
        age: { type: 'number' }
    }
);
console.log('Validação:', validation);

console.log('Plugins disponíveis:', system.listPlugins());

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

EXERCÍCIO 1: Sistema de Notificações
Implemente um sistema que use:
- Observer para notificar usuários
- Strategy para diferentes tipos de notificação (email, SMS, push)
- Factory para criar notificações
- Decorator para adicionar funcionalidades (retry, logging)

EXERCÍCIO 2: Editor de Texto Avançado
Crie um editor que use:
- Command para undo/redo
- Memento para salvar estados
- Composite para elementos de texto
- Visitor para operações (busca, substituição)

EXERCÍCIO 3: Sistema de Autenticação
Implemente:
- Singleton para gerenciador de sessão
- Strategy para diferentes métodos de auth
- Proxy para controle de acesso
- Observer para eventos de login/logout

EXERCÍCIO 4: Framework MVC
Crie um mini-framework com:
- MVC pattern
- Router usando Chain of Responsibility
- Template Engine usando Interpreter
- Middleware usando Decorator

EXERCÍCIO 5: Sistema de Cache Distribuído
Implemente:
- Strategy para diferentes backends
- Proxy para cache transparente
- Observer para invalidação
- Builder para configuração
*/

/*
========================================
ANTI-PATTERNS A EVITAR
========================================

GOD OBJECT:
- Classe que faz muitas coisas
- Dificulta manutenção e testes
- Solução: Single Responsibility Principle

SPAGHETTI CODE:
- Código sem estrutura clara
- Dependências circulares
- Solução: Usar patterns apropriados

COPY-PASTE PROGRAMMING:
- Duplicação de código
- Inconsistências
- Solução: DRY principle, abstrações

PREMATURE OPTIMIZATION:
- Otimizar antes de medir
- Complexidade desnecessária
- Solução: Profile first, optimize later

OVER-ENGINEERING:
- Usar patterns desnecessários
- Complexidade excessiva
- Solução: KISS principle

TIGHT COUPLING:
- Classes muito dependentes
- Dificulta mudanças
- Solução: Dependency Injection, Interfaces
*/

/*
========================================
BOAS PRÁTICAS
========================================

ESCOLHA DO PATTERN:
1. Identifique o problema real
2. Considere soluções simples primeiro
3. Use patterns quando agregam valor
4. Documente a escolha

IMPLEMENTAÇÃO:
1. Mantenha interfaces simples
2. Favoreça composição sobre herança
3. Use injeção de dependência
4. Escreva testes unitários

MANUTENÇÃO:
1. Refatore quando necessário
2. Monitore complexidade
3. Documente decisões arquiteturais
4. Revise código regularmente

PERFORMANCE:
1. Meça antes de otimizar
2. Considere trade-offs
3. Use profiling tools
4. Monitore em produção

TESTES:
1. Teste comportamento, não implementação
2. Use mocks para dependências
3. Teste edge cases
4. Mantenha testes simples
*/

console.log("\n=== ARQUIVO 10: DESIGN PATTERNS CONCLUÍDO ===");
console.log("Próximo: Arquivo de Testes e Debugging");
console.log("\nNOTA: Design Patterns são ferramentas. Use-os quando agregam valor, não por obrigação.");