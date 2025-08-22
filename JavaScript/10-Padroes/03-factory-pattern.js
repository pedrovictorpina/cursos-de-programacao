/**
 * MÓDULO 10: PADRÕES DE DESIGN EM JAVASCRIPT
 * Arquivo 03: Factory Pattern
 * 
 * O Factory Pattern é fundamental para criação de objetos, fornecendo uma
 * interface para criar famílias de objetos relacionados sem especificar
 * suas classes concretas.
 * 
 * Professor: Este padrão é essencial para sistemas flexíveis e extensíveis.
 * Vamos explorar desde factories simples até Abstract Factories complexas.
 */

// ==========================================
// OBJETIVOS DE APRENDIZAGEM
// ==========================================
/*
1. Compreender os diferentes tipos de Factory Patterns
2. Implementar Simple Factory, Factory Method e Abstract Factory
3. Aplicar Builder Pattern para objetos complexos
4. Usar Prototype Pattern para clonagem
5. Integrar patterns para sistemas robustos
*/

// ==========================================
// TEORIA: FACTORY PATTERNS
// ==========================================

/*
TIPOS DE FACTORY:
1. Simple Factory: Método estático que cria objetos
2. Factory Method: Classe base com método de criação
3. Abstract Factory: Interface para criar famílias de objetos
4. Builder Pattern: Construção passo a passo
5. Prototype Pattern: Clonagem de objetos

BENEFÍCIOS:
- Encapsula criação de objetos
- Reduz acoplamento
- Facilita extensibilidade
- Centraliza lógica de criação
- Suporte a polimorfismo

USOS COMUNS:
- Criação de componentes UI
- Instanciação de serviços
- Geração de objetos de domínio
- Configuração de ambientes
- Parsing de dados
*/

// ==========================================
// EXEMPLOS PRÁTICOS
// ==========================================

// 1. SIMPLE FACTORY
console.log('\n=== 1. Simple Factory ===');

// Classes de produtos
class Car {
    constructor(brand, model, year) {
        this.type = 'car';
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.wheels = 4;
        this.doors = 4;
    }
    
    start() {
        console.log(`${this.brand} ${this.model} ligado`);
    }
    
    getInfo() {
        return `${this.year} ${this.brand} ${this.model}`;
    }
}

class Motorcycle {
    constructor(brand, model, year) {
        this.type = 'motorcycle';
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.wheels = 2;
        this.doors = 0;
    }
    
    start() {
        console.log(`${this.brand} ${this.model} ligada`);
    }
    
    getInfo() {
        return `${this.year} ${this.brand} ${this.model}`;
    }
}

class Truck {
    constructor(brand, model, year) {
        this.type = 'truck';
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.wheels = 6;
        this.doors = 2;
        this.capacity = '10 tons';
    }
    
    start() {
        console.log(`${this.brand} ${this.model} ligado`);
    }
    
    getInfo() {
        return `${this.year} ${this.brand} ${this.model} (${this.capacity})`;
    }
}

// Simple Factory
class VehicleFactory {
    static createVehicle(type, brand, model, year) {
        switch (type.toLowerCase()) {
            case 'car':
                return new Car(brand, model, year);
            case 'motorcycle':
                return new Motorcycle(brand, model, year);
            case 'truck':
                return new Truck(brand, model, year);
            default:
                throw new Error(`Tipo de veículo '${type}' não suportado`);
        }
    }
    
    static getSupportedTypes() {
        return ['car', 'motorcycle', 'truck'];
    }
    
    static createFromConfig(config) {
        const { type, brand, model, year, ...options } = config;
        const vehicle = this.createVehicle(type, brand, model, year);
        
        // Aplicar opções adicionais
        Object.assign(vehicle, options);
        
        return vehicle;
    }
}

// Testando Simple Factory
const car = VehicleFactory.createVehicle('car', 'Toyota', 'Corolla', 2023);
const motorcycle = VehicleFactory.createVehicle('motorcycle', 'Honda', 'CB600', 2022);
const truck = VehicleFactory.createVehicle('truck', 'Volvo', 'FH16', 2023);

console.log('Veículos criados:');
console.log(car.getInfo());
console.log(motorcycle.getInfo());
console.log(truck.getInfo());

car.start();
motorcycle.start();
truck.start();

// Criação a partir de configuração
const customCar = VehicleFactory.createFromConfig({
    type: 'car',
    brand: 'BMW',
    model: 'X5',
    year: 2023,
    color: 'black',
    sunroof: true
});

console.log('Carro customizado:', customCar);

// 2. FACTORY METHOD PATTERN
console.log('\n=== 2. Factory Method Pattern ===');

// Classe abstrata (base)
class DocumentProcessor {
    constructor() {
        if (this.constructor === DocumentProcessor) {
            throw new Error('DocumentProcessor é uma classe abstrata');
        }
    }
    
    // Factory Method - deve ser implementado pelas subclasses
    createDocument() {
        throw new Error('createDocument() deve ser implementado');
    }
    
    // Template method que usa o factory method
    processDocument(data) {
        console.log('Iniciando processamento...');
        
        const document = this.createDocument();
        document.setData(data);
        document.validate();
        document.process();
        document.save();
        
        console.log('Processamento concluído');
        return document;
    }
}

// Classes de documentos
class PDFDocument {
    constructor() {
        this.type = 'PDF';
        this.data = null;
        this.metadata = {
            created: new Date(),
            format: 'application/pdf'
        };
    }
    
    setData(data) {
        this.data = data;
        console.log('Dados PDF configurados');
    }
    
    validate() {
        if (!this.data) {
            throw new Error('Dados PDF não fornecidos');
        }
        console.log('PDF validado');
    }
    
    process() {
        console.log('Processando PDF: renderização, compressão...');
        this.metadata.processed = new Date();
    }
    
    save() {
        console.log(`PDF salvo: ${this.data.title || 'documento'}.pdf`);
    }
}

class WordDocument {
    constructor() {
        this.type = 'Word';
        this.data = null;
        this.metadata = {
            created: new Date(),
            format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        };
    }
    
    setData(data) {
        this.data = data;
        console.log('Dados Word configurados');
    }
    
    validate() {
        if (!this.data || !this.data.content) {
            throw new Error('Conteúdo Word não fornecido');
        }
        console.log('Word validado');
    }
    
    process() {
        console.log('Processando Word: formatação, estilos...');
        this.metadata.wordCount = this.data.content.split(' ').length;
        this.metadata.processed = new Date();
    }
    
    save() {
        console.log(`Word salvo: ${this.data.title || 'documento'}.docx`);
    }
}

class ExcelDocument {
    constructor() {
        this.type = 'Excel';
        this.data = null;
        this.metadata = {
            created: new Date(),
            format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        };
    }
    
    setData(data) {
        this.data = data;
        console.log('Dados Excel configurados');
    }
    
    validate() {
        if (!this.data || !Array.isArray(this.data.sheets)) {
            throw new Error('Planilhas Excel não fornecidas');
        }
        console.log('Excel validado');
    }
    
    process() {
        console.log('Processando Excel: cálculos, gráficos...');
        this.metadata.sheetCount = this.data.sheets.length;
        this.metadata.processed = new Date();
    }
    
    save() {
        console.log(`Excel salvo: ${this.data.title || 'planilha'}.xlsx`);
    }
}

// Implementações concretas do Factory Method
class PDFProcessor extends DocumentProcessor {
    createDocument() {
        console.log('Criando documento PDF');
        return new PDFDocument();
    }
}

class WordProcessor extends DocumentProcessor {
    createDocument() {
        console.log('Criando documento Word');
        return new WordDocument();
    }
}

class ExcelProcessor extends DocumentProcessor {
    createDocument() {
        console.log('Criando documento Excel');
        return new ExcelDocument();
    }
}

// Testando Factory Method
const pdfProcessor = new PDFProcessor();
const wordProcessor = new WordProcessor();
const excelProcessor = new ExcelProcessor();

const pdfDoc = pdfProcessor.processDocument({
    title: 'Relatório Anual',
    content: 'Conteúdo do relatório...'
});

const wordDoc = wordProcessor.processDocument({
    title: 'Proposta Comercial',
    content: 'Esta é uma proposta comercial detalhada...'
});

const excelDoc = excelProcessor.processDocument({
    title: 'Análise Financeira',
    sheets: [
        { name: 'Receitas', data: [[100, 200], [150, 250]] },
        { name: 'Despesas', data: [[50, 75], [60, 80]] }
    ]
});

// 3. ABSTRACT FACTORY PATTERN
console.log('\n=== 3. Abstract Factory Pattern ===');

// Interfaces/Classes abstratas para produtos
class Button {
    constructor() {
        if (this.constructor === Button) {
            throw new Error('Button é uma classe abstrata');
        }
    }
    
    render() {
        throw new Error('render() deve ser implementado');
    }
    
    onClick() {
        throw new Error('onClick() deve ser implementado');
    }
}

class Input {
    constructor() {
        if (this.constructor === Input) {
            throw new Error('Input é uma classe abstrata');
        }
    }
    
    render() {
        throw new Error('render() deve ser implementado');
    }
    
    onFocus() {
        throw new Error('onFocus() deve ser implementado');
    }
}

class Modal {
    constructor() {
        if (this.constructor === Modal) {
            throw new Error('Modal é uma classe abstrata');
        }
    }
    
    show() {
        throw new Error('show() deve ser implementado');
    }
    
    hide() {
        throw new Error('hide() deve ser implementado');
    }
}

// Implementações para tema Material Design
class MaterialButton extends Button {
    constructor(text, variant = 'contained') {
        super();
        this.text = text;
        this.variant = variant;
        this.theme = 'material';
    }
    
    render() {
        console.log(`Renderizando Material Button: "${this.text}" (${this.variant})`);
        return {
            element: 'button',
            className: `mat-button mat-${this.variant}`,
            text: this.text,
            styles: {
                borderRadius: '4px',
                textTransform: 'uppercase',
                fontWeight: '500'
            }
        };
    }
    
    onClick() {
        console.log(`Material Button "${this.text}" clicado com ripple effect`);
    }
}

class MaterialInput extends Input {
    constructor(placeholder, type = 'text') {
        super();
        this.placeholder = placeholder;
        this.type = type;
        this.theme = 'material';
    }
    
    render() {
        console.log(`Renderizando Material Input: ${this.placeholder}`);
        return {
            element: 'input',
            className: 'mat-input',
            type: this.type,
            placeholder: this.placeholder,
            styles: {
                borderBottom: '1px solid #ccc',
                borderRadius: '0',
                padding: '8px 0'
            }
        };
    }
    
    onFocus() {
        console.log(`Material Input focado com floating label`);
    }
}

class MaterialModal extends Modal {
    constructor(title, content) {
        super();
        this.title = title;
        this.content = content;
        this.theme = 'material';
    }
    
    show() {
        console.log(`Mostrando Material Modal: "${this.title}" com backdrop`);
        return {
            element: 'div',
            className: 'mat-dialog',
            title: this.title,
            content: this.content,
            animation: 'slideInUp'
        };
    }
    
    hide() {
        console.log(`Ocultando Material Modal com fade out`);
    }
}

// Implementações para tema Bootstrap
class BootstrapButton extends Button {
    constructor(text, variant = 'primary') {
        super();
        this.text = text;
        this.variant = variant;
        this.theme = 'bootstrap';
    }
    
    render() {
        console.log(`Renderizando Bootstrap Button: "${this.text}" (${this.variant})`);
        return {
            element: 'button',
            className: `btn btn-${this.variant}`,
            text: this.text,
            styles: {
                borderRadius: '0.375rem',
                fontWeight: '400',
                padding: '0.375rem 0.75rem'
            }
        };
    }
    
    onClick() {
        console.log(`Bootstrap Button "${this.text}" clicado`);
    }
}

class BootstrapInput extends Input {
    constructor(placeholder, type = 'text') {
        super();
        this.placeholder = placeholder;
        this.type = type;
        this.theme = 'bootstrap';
    }
    
    render() {
        console.log(`Renderizando Bootstrap Input: ${this.placeholder}`);
        return {
            element: 'input',
            className: 'form-control',
            type: this.type,
            placeholder: this.placeholder,
            styles: {
                border: '1px solid #ced4da',
                borderRadius: '0.375rem',
                padding: '0.375rem 0.75rem'
            }
        };
    }
    
    onFocus() {
        console.log(`Bootstrap Input focado com border highlight`);
    }
}

class BootstrapModal extends Modal {
    constructor(title, content) {
        super();
        this.title = title;
        this.content = content;
        this.theme = 'bootstrap';
    }
    
    show() {
        console.log(`Mostrando Bootstrap Modal: "${this.title}"`);
        return {
            element: 'div',
            className: 'modal fade',
            title: this.title,
            content: this.content,
            animation: 'fade'
        };
    }
    
    hide() {
        console.log(`Ocultando Bootstrap Modal`);
    }
}

// Abstract Factory
class UIFactory {
    createButton(text, variant) {
        throw new Error('createButton() deve ser implementado');
    }
    
    createInput(placeholder, type) {
        throw new Error('createInput() deve ser implementado');
    }
    
    createModal(title, content) {
        throw new Error('createModal() deve ser implementado');
    }
}

// Concrete Factories
class MaterialUIFactory extends UIFactory {
    createButton(text, variant = 'contained') {
        return new MaterialButton(text, variant);
    }
    
    createInput(placeholder, type = 'text') {
        return new MaterialInput(placeholder, type);
    }
    
    createModal(title, content) {
        return new MaterialModal(title, content);
    }
}

class BootstrapUIFactory extends UIFactory {
    createButton(text, variant = 'primary') {
        return new BootstrapButton(text, variant);
    }
    
    createInput(placeholder, type = 'text') {
        return new BootstrapInput(placeholder, type);
    }
    
    createModal(title, content) {
        return new BootstrapModal(title, content);
    }
}

// Factory Provider
class UIFactoryProvider {
    static getFactory(theme) {
        switch (theme.toLowerCase()) {
            case 'material':
                return new MaterialUIFactory();
            case 'bootstrap':
                return new BootstrapUIFactory();
            default:
                throw new Error(`Tema '${theme}' não suportado`);
        }
    }
    
    static getSupportedThemes() {
        return ['material', 'bootstrap'];
    }
}

// Testando Abstract Factory
function createLoginForm(theme) {
    const factory = UIFactoryProvider.getFactory(theme);
    
    const emailInput = factory.createInput('Email', 'email');
    const passwordInput = factory.createInput('Senha', 'password');
    const loginButton = factory.createButton('Entrar', 'primary');
    const cancelButton = factory.createButton('Cancelar', 'secondary');
    const helpModal = factory.createModal('Ajuda', 'Como fazer login...');
    
    console.log(`\n--- Formulário de Login (${theme}) ---`);
    emailInput.render();
    passwordInput.render();
    loginButton.render();
    cancelButton.render();
    helpModal.show();
    
    return {
        emailInput,
        passwordInput,
        loginButton,
        cancelButton,
        helpModal
    };
}

const materialForm = createLoginForm('material');
const bootstrapForm = createLoginForm('bootstrap');

// 4. BUILDER PATTERN
console.log('\n=== 4. Builder Pattern ===');

class Computer {
    constructor() {
        this.cpu = null;
        this.ram = null;
        this.storage = null;
        this.gpu = null;
        this.motherboard = null;
        this.powerSupply = null;
        this.case = null;
        this.cooling = null;
        this.peripherals = [];
        this.warranty = null;
        this.price = 0;
    }
    
    getSpecs() {
        return {
            cpu: this.cpu,
            ram: this.ram,
            storage: this.storage,
            gpu: this.gpu,
            motherboard: this.motherboard,
            powerSupply: this.powerSupply,
            case: this.case,
            cooling: this.cooling,
            peripherals: this.peripherals,
            warranty: this.warranty,
            totalPrice: this.price
        };
    }
    
    isValid() {
        const required = ['cpu', 'ram', 'storage', 'motherboard', 'powerSupply'];
        return required.every(component => this[component] !== null);
    }
}

class ComputerBuilder {
    constructor() {
        this.computer = new Computer();
    }
    
    setCPU(cpu, price = 0) {
        this.computer.cpu = cpu;
        this.computer.price += price;
        console.log(`CPU configurado: ${cpu}`);
        return this;
    }
    
    setRAM(ram, price = 0) {
        this.computer.ram = ram;
        this.computer.price += price;
        console.log(`RAM configurada: ${ram}`);
        return this;
    }
    
    setStorage(storage, price = 0) {
        this.computer.storage = storage;
        this.computer.price += price;
        console.log(`Armazenamento configurado: ${storage}`);
        return this;
    }
    
    setGPU(gpu, price = 0) {
        this.computer.gpu = gpu;
        this.computer.price += price;
        console.log(`GPU configurada: ${gpu}`);
        return this;
    }
    
    setMotherboard(motherboard, price = 0) {
        this.computer.motherboard = motherboard;
        this.computer.price += price;
        console.log(`Placa-mãe configurada: ${motherboard}`);
        return this;
    }
    
    setPowerSupply(powerSupply, price = 0) {
        this.computer.powerSupply = powerSupply;
        this.computer.price += price;
        console.log(`Fonte configurada: ${powerSupply}`);
        return this;
    }
    
    setCase(computerCase, price = 0) {
        this.computer.case = computerCase;
        this.computer.price += price;
        console.log(`Gabinete configurado: ${computerCase}`);
        return this;
    }
    
    setCooling(cooling, price = 0) {
        this.computer.cooling = cooling;
        this.computer.price += price;
        console.log(`Refrigeração configurada: ${cooling}`);
        return this;
    }
    
    addPeripheral(peripheral, price = 0) {
        this.computer.peripherals.push(peripheral);
        this.computer.price += price;
        console.log(`Periférico adicionado: ${peripheral}`);
        return this;
    }
    
    setWarranty(warranty, price = 0) {
        this.computer.warranty = warranty;
        this.computer.price += price;
        console.log(`Garantia configurada: ${warranty}`);
        return this;
    }
    
    build() {
        if (!this.computer.isValid()) {
            throw new Error('Configuração de computador inválida - componentes obrigatórios faltando');
        }
        
        const result = this.computer;
        this.computer = new Computer(); // Reset para próxima construção
        
        console.log(`Computador construído! Preço total: R$ ${result.price}`);
        return result;
    }
    
    reset() {
        this.computer = new Computer();
        return this;
    }
}

// Director para configurações pré-definidas
class ComputerDirector {
    constructor(builder) {
        this.builder = builder;
    }
    
    buildGamingPC() {
        return this.builder
            .setCPU('Intel i7-13700K', 2500)
            .setRAM('32GB DDR5-5600', 800)
            .setStorage('1TB NVMe SSD', 600)
            .setGPU('RTX 4080', 7000)
            .setMotherboard('ASUS ROG Z790', 1200)
            .setPowerSupply('850W 80+ Gold', 500)
            .setCase('NZXT H7 Elite', 800)
            .setCooling('AIO 280mm', 600)
            .addPeripheral('Teclado Mecânico', 400)
            .addPeripheral('Mouse Gaming', 300)
            .addPeripheral('Monitor 144Hz', 1500)
            .setWarranty('3 anos', 300)
            .build();
    }
    
    buildOfficePC() {
        return this.builder
            .setCPU('Intel i5-13400', 1200)
            .setRAM('16GB DDR4-3200', 400)
            .setStorage('512GB SSD', 300)
            .setMotherboard('MSI B660M', 600)
            .setPowerSupply('500W 80+ Bronze', 300)
            .setCase('Gabinete Básico', 200)
            .setCooling('Cooler Stock', 0)
            .addPeripheral('Teclado e Mouse', 150)
            .addPeripheral('Monitor 24"', 800)
            .setWarranty('1 ano', 100)
            .build();
    }
    
    buildWorkstationPC() {
        return this.builder
            .setCPU('AMD Ryzen 9 7950X', 3500)
            .setRAM('64GB DDR5-5200', 1600)
            .setStorage('2TB NVMe SSD', 1200)
            .setGPU('RTX 4090', 10000)
            .setMotherboard('ASUS ProArt X670E', 2000)
            .setPowerSupply('1000W 80+ Platinum', 800)
            .setCase('Fractal Define 7 XL', 1000)
            .setCooling('Custom Loop', 1500)
            .addPeripheral('Teclado Profissional', 600)
            .addPeripheral('Mouse Precision', 400)
            .addPeripheral('Monitor 4K 32"', 3000)
            .addPeripheral('Tablet Gráfico', 1200)
            .setWarranty('5 anos', 500)
            .build();
    }
}

// Testando Builder Pattern
const builder = new ComputerBuilder();
const director = new ComputerDirector(builder);

console.log('\n--- Construindo PC Gamer ---');
const gamingPC = director.buildGamingPC();
console.log('Specs do PC Gamer:', gamingPC.getSpecs());

console.log('\n--- Construindo PC Office ---');
const officePC = director.buildOfficePC();
console.log('Specs do PC Office:', officePC.getSpecs());

// Construção customizada
console.log('\n--- Construindo PC Customizado ---');
const customPC = new ComputerBuilder()
    .setCPU('AMD Ryzen 7 7700X', 2000)
    .setRAM('32GB DDR5', 800)
    .setStorage('1TB SSD', 500)
    .setGPU('RTX 4070', 4000)
    .setMotherboard('MSI X670E', 1500)
    .setPowerSupply('750W Gold', 400)
    .setCase('Corsair 4000D', 600)
    .setCooling('Noctua NH-D15', 400)
    .addPeripheral('Monitor Ultrawide', 2500)
    .setWarranty('2 anos', 200)
    .build();

console.log('Specs do PC Customizado:', customPC.getSpecs());

// 5. PROTOTYPE PATTERN
console.log('\n=== 5. Prototype Pattern ===');

class Prototype {
    clone() {
        throw new Error('clone() deve ser implementado');
    }
}

class User extends Prototype {
    constructor(name, email, preferences = {}) {
        super();
        this.id = Math.random().toString(36).substr(2, 9);
        this.name = name;
        this.email = email;
        this.preferences = { ...preferences };
        this.createdAt = new Date();
        this.permissions = [];
        this.profile = {
            avatar: null,
            bio: '',
            location: '',
            website: ''
        };
    }
    
    clone() {
        // Deep clone do usuário
        const cloned = new User(this.name, this.email, this.preferences);
        cloned.permissions = [...this.permissions];
        cloned.profile = {
            avatar: this.profile.avatar,
            bio: this.profile.bio,
            location: this.profile.location,
            website: this.profile.website
        };
        
        // Gerar novo ID e timestamp
        cloned.id = Math.random().toString(36).substr(2, 9);
        cloned.createdAt = new Date();
        
        console.log(`Usuário clonado: ${this.name} -> ${cloned.id}`);
        return cloned;
    }
    
    addPermission(permission) {
        if (!this.permissions.includes(permission)) {
            this.permissions.push(permission);
        }
        return this;
    }
    
    setProfile(profile) {
        this.profile = { ...this.profile, ...profile };
        return this;
    }
    
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            permissions: this.permissions,
            createdAt: this.createdAt
        };
    }
}

class Document extends Prototype {
    constructor(title, content, type = 'text') {
        super();
        this.id = Math.random().toString(36).substr(2, 9);
        this.title = title;
        this.content = content;
        this.type = type;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
        this.version = 1;
        this.metadata = {
            author: null,
            tags: [],
            category: '',
            status: 'draft'
        };
        this.formatting = {
            font: 'Arial',
            fontSize: 12,
            color: '#000000',
            bold: false,
            italic: false
        };
    }
    
    clone() {
        const cloned = new Document(this.title, this.content, this.type);
        
        // Deep clone dos objetos
        cloned.metadata = {
            author: this.metadata.author,
            tags: [...this.metadata.tags],
            category: this.metadata.category,
            status: this.metadata.status
        };
        
        cloned.formatting = { ...this.formatting };
        
        // Atualizar informações de versão
        cloned.id = Math.random().toString(36).substr(2, 9);
        cloned.version = this.version + 1;
        cloned.createdAt = new Date();
        cloned.modifiedAt = new Date();
        
        console.log(`Documento clonado: ${this.title} v${this.version} -> v${cloned.version}`);
        return cloned;
    }
    
    setMetadata(metadata) {
        this.metadata = { ...this.metadata, ...metadata };
        this.modifiedAt = new Date();
        return this;
    }
    
    setFormatting(formatting) {
        this.formatting = { ...this.formatting, ...formatting };
        this.modifiedAt = new Date();
        return this;
    }
    
    addTag(tag) {
        if (!this.metadata.tags.includes(tag)) {
            this.metadata.tags.push(tag);
            this.modifiedAt = new Date();
        }
        return this;
    }
    
    getInfo() {
        return {
            id: this.id,
            title: this.title,
            type: this.type,
            version: this.version,
            status: this.metadata.status,
            tags: this.metadata.tags,
            createdAt: this.createdAt,
            modifiedAt: this.modifiedAt
        };
    }
}

// Registry de protótipos
class PrototypeRegistry {
    constructor() {
        this.prototypes = new Map();
    }
    
    register(name, prototype) {
        if (!(prototype instanceof Prototype)) {
            throw new Error('Objeto deve estender Prototype');
        }
        
        this.prototypes.set(name, prototype);
        console.log(`Protótipo '${name}' registrado`);
    }
    
    create(name) {
        const prototype = this.prototypes.get(name);
        if (!prototype) {
            throw new Error(`Protótipo '${name}' não encontrado`);
        }
        
        return prototype.clone();
    }
    
    getRegisteredNames() {
        return Array.from(this.prototypes.keys());
    }
    
    unregister(name) {
        const deleted = this.prototypes.delete(name);
        if (deleted) {
            console.log(`Protótipo '${name}' removido`);
        }
        return deleted;
    }
}

// Testando Prototype Pattern
const registry = new PrototypeRegistry();

// Criar protótipos base
const adminUser = new User('Admin Template', 'admin@template.com', {
    theme: 'dark',
    language: 'pt-BR',
    notifications: true
});
adminUser
    .addPermission('read')
    .addPermission('write')
    .addPermission('delete')
    .addPermission('admin')
    .setProfile({
        bio: 'Usuário administrador do sistema',
        location: 'Brasil'
    });

const regularUser = new User('User Template', 'user@template.com', {
    theme: 'light',
    language: 'pt-BR',
    notifications: false
});
regularUser
    .addPermission('read')
    .setProfile({
        bio: 'Usuário padrão do sistema'
    });

const reportDocument = new Document(
    'Relatório Template',
    'Este é um template de relatório...',
    'report'
);
reportDocument
    .setMetadata({
        category: 'business',
        status: 'template'
    })
    .addTag('template')
    .addTag('report')
    .setFormatting({
        font: 'Times New Roman',
        fontSize: 14,
        bold: true
    });

// Registrar protótipos
registry.register('admin-user', adminUser);
registry.register('regular-user', regularUser);
registry.register('report-doc', reportDocument);

console.log('Protótipos registrados:', registry.getRegisteredNames());

// Criar instâncias a partir dos protótipos
const newAdmin = registry.create('admin-user');
newAdmin.name = 'João Admin';
newAdmin.email = 'joao@empresa.com';

const newUser = registry.create('regular-user');
newUser.name = 'Maria Silva';
newUser.email = 'maria@empresa.com';

const newReport = registry.create('report-doc');
newReport.title = 'Relatório Mensal - Janeiro 2024';
newReport.content = 'Dados do relatório mensal...';
newReport.setMetadata({ author: 'João Admin' });

console.log('\nUsuários criados:');
console.log('Admin:', newAdmin.getInfo());
console.log('User:', newUser.getInfo());
console.log('\nDocumento criado:');
console.log('Report:', newReport.getInfo());

// ==========================================
// EXERCÍCIO PRÁTICO: SISTEMA DE PLUGINS
// ==========================================

console.log('\n=== EXERCÍCIO: Sistema de Plugins ===');

class Plugin {
    constructor(name, version) {
        this.name = name;
        this.version = version;
        this.enabled = false;
        this.dependencies = [];
        this.hooks = new Map();
        this.config = {};
    }
    
    initialize() {
        throw new Error('initialize() deve ser implementado');
    }
    
    destroy() {
        throw new Error('destroy() deve ser implementado');
    }
    
    getInfo() {
        return {
            name: this.name,
            version: this.version,
            enabled: this.enabled,
            dependencies: this.dependencies
        };
    }
}

// Factory para diferentes tipos de plugins
class PluginFactory {
    static createPlugin(type, config) {
        switch (type) {
            case 'analytics':
                return new AnalyticsPlugin(config);
            case 'cache':
                return new CachePlugin(config);
            case 'security':
                return new SecurityPlugin(config);
            case 'logger':
                return new LoggerPlugin(config);
            default:
                throw new Error(`Tipo de plugin '${type}' não suportado`);
        }
    }
    
    static getSupportedTypes() {
        return ['analytics', 'cache', 'security', 'logger'];
    }
}

// Implementações de plugins
class AnalyticsPlugin extends Plugin {
    constructor(config = {}) {
        super('Analytics', '1.0.0');
        this.config = {
            trackPageViews: true,
            trackEvents: true,
            apiKey: config.apiKey || null,
            ...config
        };
        this.events = [];
    }
    
    initialize() {
        console.log('Analytics Plugin inicializado');
        this.enabled = true;
        
        // Registrar hooks
        this.hooks.set('page_view', (data) => this.trackPageView(data));
        this.hooks.set('event', (data) => this.trackEvent(data));
        
        return true;
    }
    
    destroy() {
        console.log('Analytics Plugin destruído');
        this.enabled = false;
        this.hooks.clear();
        this.events = [];
    }
    
    trackPageView(data) {
        if (this.config.trackPageViews) {
            const event = {
                type: 'page_view',
                url: data.url,
                timestamp: new Date(),
                userAgent: data.userAgent || 'unknown'
            };
            this.events.push(event);
            console.log('📊 Page view tracked:', event.url);
        }
    }
    
    trackEvent(data) {
        if (this.config.trackEvents) {
            const event = {
                type: 'event',
                action: data.action,
                category: data.category,
                label: data.label,
                value: data.value,
                timestamp: new Date()
            };
            this.events.push(event);
            console.log('📈 Event tracked:', event.action);
        }
    }
    
    getStats() {
        return {
            totalEvents: this.events.length,
            pageViews: this.events.filter(e => e.type === 'page_view').length,
            customEvents: this.events.filter(e => e.type === 'event').length
        };
    }
}

class CachePlugin extends Plugin {
    constructor(config = {}) {
        super('Cache', '1.0.0');
        this.config = {
            maxSize: config.maxSize || 100,
            ttl: config.ttl || 3600000, // 1 hora
            strategy: config.strategy || 'lru',
            ...config
        };
        this.cache = new Map();
        this.accessTimes = new Map();
    }
    
    initialize() {
        console.log('Cache Plugin inicializado');
        this.enabled = true;
        
        // Registrar hooks
        this.hooks.set('get', (key) => this.get(key));
        this.hooks.set('set', (key, value, ttl) => this.set(key, value, ttl));
        this.hooks.set('delete', (key) => this.delete(key));
        
        // Iniciar limpeza automática
        this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
        
        return true;
    }
    
    destroy() {
        console.log('Cache Plugin destruído');
        this.enabled = false;
        this.hooks.clear();
        this.cache.clear();
        this.accessTimes.clear();
        
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
    
    set(key, value, ttl = null) {
        if (this.cache.size >= this.config.maxSize) {
            this.evict();
        }
        
        const item = {
            value,
            timestamp: Date.now(),
            ttl: ttl || this.config.ttl,
            accessCount: 0
        };
        
        this.cache.set(key, item);
        this.accessTimes.set(key, Date.now());
        
        console.log(`💾 Cache set: ${key}`);
        return true;
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            console.log(`❌ Cache miss: ${key}`);
            return null;
        }
        
        // Verificar TTL
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            this.accessTimes.delete(key);
            console.log(`⏰ Cache expired: ${key}`);
            return null;
        }
        
        // Atualizar estatísticas de acesso
        item.accessCount++;
        this.accessTimes.set(key, Date.now());
        
        console.log(`✅ Cache hit: ${key}`);
        return item.value;
    }
    
    delete(key) {
        const deleted = this.cache.delete(key);
        this.accessTimes.delete(key);
        
        if (deleted) {
            console.log(`🗑️ Cache deleted: ${key}`);
        }
        
        return deleted;
    }
    
    evict() {
        if (this.config.strategy === 'lru') {
            // Remover o item menos recentemente usado
            let oldestKey = null;
            let oldestTime = Date.now();
            
            for (let [key, time] of this.accessTimes) {
                if (time < oldestTime) {
                    oldestTime = time;
                    oldestKey = key;
                }
            }
            
            if (oldestKey) {
                this.delete(oldestKey);
                console.log(`🔄 LRU evicted: ${oldestKey}`);
            }
        }
    }
    
    cleanup() {
        const now = Date.now();
        const toDelete = [];
        
        for (let [key, item] of this.cache) {
            if (now - item.timestamp > item.ttl) {
                toDelete.push(key);
            }
        }
        
        toDelete.forEach(key => this.delete(key));
        
        if (toDelete.length > 0) {
            console.log(`🧹 Cleanup: ${toDelete.length} items removed`);
        }
    }
    
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.config.maxSize,
            hitRate: this.calculateHitRate(),
            oldestItem: this.getOldestItem()
        };
    }
    
    calculateHitRate() {
        // Implementação simplificada
        return 0.85; // 85% de hit rate
    }
    
    getOldestItem() {
        let oldest = null;
        let oldestTime = Date.now();
        
        for (let [key, time] of this.accessTimes) {
            if (time < oldestTime) {
                oldestTime = time;
                oldest = key;
            }
        }
        
        return oldest;
    }
}

class SecurityPlugin extends Plugin {
    constructor(config = {}) {
        super('Security', '1.0.0');
        this.config = {
            enableCSRF: config.enableCSRF || true,
            enableXSS: config.enableXSS || true,
            rateLimit: config.rateLimit || 100,
            ...config
        };
        this.requests = new Map();
        this.blockedIPs = new Set();
    }
    
    initialize() {
        console.log('Security Plugin inicializado');
        this.enabled = true;
        
        // Registrar hooks
        this.hooks.set('validate_request', (req) => this.validateRequest(req));
        this.hooks.set('check_rate_limit', (ip) => this.checkRateLimit(ip));
        this.hooks.set('sanitize_input', (input) => this.sanitizeInput(input));
        
        return true;
    }
    
    destroy() {
        console.log('Security Plugin destruído');
        this.enabled = false;
        this.hooks.clear();
        this.requests.clear();
        this.blockedIPs.clear();
    }
    
    validateRequest(request) {
        const { ip, headers, body } = request;
        
        // Verificar IP bloqueado
        if (this.blockedIPs.has(ip)) {
            console.log(`🚫 Blocked IP: ${ip}`);
            return { valid: false, reason: 'IP blocked' };
        }
        
        // Verificar rate limit
        if (!this.checkRateLimit(ip)) {
            console.log(`⚠️ Rate limit exceeded: ${ip}`);
            return { valid: false, reason: 'Rate limit exceeded' };
        }
        
        // Verificar CSRF
        if (this.config.enableCSRF && !this.validateCSRF(headers)) {
            console.log(`🛡️ CSRF validation failed: ${ip}`);
            return { valid: false, reason: 'CSRF validation failed' };
        }
        
        console.log(`✅ Request validated: ${ip}`);
        return { valid: true };
    }
    
    checkRateLimit(ip) {
        const now = Date.now();
        const windowMs = 60000; // 1 minuto
        
        if (!this.requests.has(ip)) {
            this.requests.set(ip, []);
        }
        
        const requests = this.requests.get(ip);
        
        // Remover requests antigas
        const validRequests = requests.filter(time => now - time < windowMs);
        this.requests.set(ip, validRequests);
        
        // Verificar limite
        if (validRequests.length >= this.config.rateLimit) {
            this.blockedIPs.add(ip);
            setTimeout(() => this.blockedIPs.delete(ip), windowMs);
            return false;
        }
        
        // Adicionar request atual
        validRequests.push(now);
        return true;
    }
    
    validateCSRF(headers) {
        // Implementação simplificada
        return headers['x-csrf-token'] !== undefined;
    }
    
    sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        // Sanitização básica XSS
        const sanitized = input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
        
        if (sanitized !== input) {
            console.log('🧼 Input sanitized');
        }
        
        return sanitized;
    }
    
    getStats() {
        return {
            blockedIPs: this.blockedIPs.size,
            activeRequests: this.requests.size,
            totalRequests: Array.from(this.requests.values())
                .reduce((sum, reqs) => sum + reqs.length, 0)
        };
    }
}

class LoggerPlugin extends Plugin {
    constructor(config = {}) {
        super('Logger', '1.0.0');
        this.config = {
            level: config.level || 'info',
            format: config.format || 'json',
            maxLogs: config.maxLogs || 1000,
            ...config
        };
        this.logs = [];
        this.levels = ['debug', 'info', 'warn', 'error'];
    }
    
    initialize() {
        console.log('Logger Plugin inicializado');
        this.enabled = true;
        
        // Registrar hooks
        this.hooks.set('log', (level, message, data) => this.log(level, message, data));
        this.hooks.set('debug', (message, data) => this.debug(message, data));
        this.hooks.set('info', (message, data) => this.info(message, data));
        this.hooks.set('warn', (message, data) => this.warn(message, data));
        this.hooks.set('error', (message, data) => this.error(message, data));
        
        return true;
    }
    
    destroy() {
        console.log('Logger Plugin destruído');
        this.enabled = false;
        this.hooks.clear();
        this.logs = [];
    }
    
    log(level, message, data = null) {
        const levelIndex = this.levels.indexOf(level);
        const configLevelIndex = this.levels.indexOf(this.config.level);
        
        if (levelIndex < configLevelIndex) {
            return; // Nível muito baixo
        }
        
        const logEntry = {
            timestamp: new Date(),
            level,
            message,
            data,
            id: Math.random().toString(36).substr(2, 9)
        };
        
        this.logs.push(logEntry);
        
        // Manter limite de logs
        if (this.logs.length > this.config.maxLogs) {
            this.logs.shift();
        }
        
        // Output formatado
        this.output(logEntry);
    }
    
    debug(message, data) {
        this.log('debug', message, data);
    }
    
    info(message, data) {
        this.log('info', message, data);
    }
    
    warn(message, data) {
        this.log('warn', message, data);
    }
    
    error(message, data) {
        this.log('error', message, data);
    }
    
    output(logEntry) {
        const timestamp = logEntry.timestamp.toISOString();
        const level = logEntry.level.toUpperCase().padEnd(5);
        
        if (this.config.format === 'json') {
            console.log(JSON.stringify(logEntry));
        } else {
            const dataStr = logEntry.data ? ` | ${JSON.stringify(logEntry.data)}` : '';
            console.log(`[${timestamp}] ${level} ${logEntry.message}${dataStr}`);
        }
    }
    
    getLogs(level = null, limit = 100) {
        let filteredLogs = this.logs;
        
        if (level) {
            filteredLogs = this.logs.filter(log => log.level === level);
        }
        
        return filteredLogs.slice(-limit);
    }
    
    getStats() {
        const stats = {
            totalLogs: this.logs.length,
            byLevel: {}
        };
        
        this.levels.forEach(level => {
            stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
        });
        
        return stats;
    }
}

// Sistema de gerenciamento de plugins
class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
        this.factory = PluginFactory;
    }
    
    register(name, plugin) {
        if (!(plugin instanceof Plugin)) {
            throw new Error('Plugin deve estender a classe Plugin');
        }
        
        if (this.plugins.has(name)) {
            throw new Error(`Plugin '${name}' já está registrado`);
        }
        
        this.plugins.set(name, plugin);
        console.log(`🔌 Plugin '${name}' registrado`);
        
        return this;
    }
    
    create(type, name, config = {}) {
        const plugin = this.factory.createPlugin(type, config);
        return this.register(name, plugin);
    }
    
    enable(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin '${name}' não encontrado`);
        }
        
        if (plugin.enabled) {
            console.log(`Plugin '${name}' já está habilitado`);
            return this;
        }
        
        // Verificar dependências
        for (let dep of plugin.dependencies) {
            const depPlugin = this.plugins.get(dep);
            if (!depPlugin || !depPlugin.enabled) {
                throw new Error(`Dependência '${dep}' não está habilitada`);
            }
        }
        
        plugin.initialize();
        
        // Registrar hooks do plugin
        for (let [hookName, hookFn] of plugin.hooks) {
            this.registerHook(hookName, hookFn);
        }
        
        console.log(`✅ Plugin '${name}' habilitado`);
        return this;
    }
    
    disable(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            throw new Error(`Plugin '${name}' não encontrado`);
        }
        
        if (!plugin.enabled) {
            console.log(`Plugin '${name}' já está desabilitado`);
            return this;
        }
        
        plugin.destroy();
        
        // Remover hooks do plugin
        for (let hookName of plugin.hooks.keys()) {
            this.unregisterHook(hookName);
        }
        
        console.log(`❌ Plugin '${name}' desabilitado`);
        return this;
    }
    
    unregister(name) {
        const plugin = this.plugins.get(name);
        if (plugin && plugin.enabled) {
            this.disable(name);
        }
        
        const removed = this.plugins.delete(name);
        if (removed) {
            console.log(`🗑️ Plugin '${name}' removido`);
        }
        
        return this;
    }
    
    registerHook(name, callback) {
        if (!this.hooks.has(name)) {
            this.hooks.set(name, []);
        }
        
        this.hooks.get(name).push(callback);
    }
    
    unregisterHook(name) {
        this.hooks.delete(name);
    }
    
    executeHook(name, ...args) {
        const callbacks = this.hooks.get(name);
        if (!callbacks) {
            return null;
        }
        
        let result = null;
        for (let callback of callbacks) {
            try {
                result = callback(...args);
            } catch (error) {
                console.error(`Erro no hook '${name}':`, error);
            }
        }
        
        return result;
    }
    
    getPlugin(name) {
        return this.plugins.get(name);
    }
    
    getEnabledPlugins() {
        return Array.from(this.plugins.entries())
            .filter(([name, plugin]) => plugin.enabled)
            .map(([name, plugin]) => ({ name, ...plugin.getInfo() }));
    }
    
    getAllPlugins() {
        return Array.from(this.plugins.entries())
            .map(([name, plugin]) => ({ name, ...plugin.getInfo() }));
    }
    
    getStats() {
        return {
            totalPlugins: this.plugins.size,
            enabledPlugins: this.getEnabledPlugins().length,
            totalHooks: this.hooks.size,
            availableTypes: this.factory.getSupportedTypes()
        };
    }
}

// Testando o Sistema de Plugins
const pluginManager = new PluginManager();

// Criar e registrar plugins
pluginManager
    .create('logger', 'main-logger', { level: 'info', format: 'text' })
    .create('cache', 'main-cache', { maxSize: 50, ttl: 1800000 })
    .create('security', 'main-security', { rateLimit: 50 })
    .create('analytics', 'main-analytics', { trackPageViews: true });

console.log('\nPlugins registrados:', pluginManager.getAllPlugins());

// Habilitar plugins
pluginManager
    .enable('main-logger')
    .enable('main-cache')
    .enable('main-security')
    .enable('main-analytics');

console.log('\nPlugins habilitados:', pluginManager.getEnabledPlugins());

// Testar funcionalidades
console.log('\n--- Testando Cache ---');
pluginManager.executeHook('set', 'user:123', { name: 'João', email: 'joao@test.com' });
pluginManager.executeHook('set', 'user:456', { name: 'Maria', email: 'maria@test.com' });

const user = pluginManager.executeHook('get', 'user:123');
console.log('Usuário do cache:', user);

console.log('\n--- Testando Security ---');
const request1 = {
    ip: '192.168.1.100',
    headers: { 'x-csrf-token': 'abc123' },
    body: { message: 'Hello <script>alert("xss")</script>' }
};

const validation = pluginManager.executeHook('validate_request', request1);
console.log('Validação:', validation);

const sanitized = pluginManager.executeHook('sanitize_input', request1.body.message);
console.log('Input sanitizado:', sanitized);

console.log('\n--- Testando Analytics ---');
pluginManager.executeHook('page_view', { url: '/home', userAgent: 'Mozilla/5.0' });
pluginManager.executeHook('event', {
    action: 'click',
    category: 'button',
    label: 'login',
    value: 1
});

console.log('\n--- Testando Logger ---');
pluginManager.executeHook('info', 'Sistema inicializado', { version: '1.0.0' });
pluginManager.executeHook('warn', 'Cache quase cheio', { usage: '90%' });
pluginManager.executeHook('error', 'Falha na conexão', { code: 'CONN_FAILED' });

// Estatísticas dos plugins
console.log('\n--- Estatísticas ---');
const cachePlugin = pluginManager.getPlugin('main-cache');
const securityPlugin = pluginManager.getPlugin('main-security');
const analyticsPlugin = pluginManager.getPlugin('main-analytics');
const loggerPlugin = pluginManager.getPlugin('main-logger');

console.log('Cache Stats:', cachePlugin.getStats());
console.log('Security Stats:', securityPlugin.getStats());
console.log('Analytics Stats:', analyticsPlugin.getStats());
console.log('Logger Stats:', loggerPlugin.getStats());

console.log('\nManager Stats:', pluginManager.getStats());

// ==========================================
// DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
OTIMIZAÇÃO:
1. Lazy Loading: Carregue factories apenas quando necessário
2. Object Pooling: Reutilize objetos caros de criar
3. Caching: Cache objetos criados frequentemente
4. Prototype Sharing: Compartilhe protótipos entre instâncias
5. Memory Management: Implemente cleanup adequado

BOAS PRÁTICAS:
1. Validação: Sempre valide parâmetros de entrada
2. Error Handling: Trate erros de criação graciosamente
3. Documentation: Documente tipos e configurações suportadas
4. Testing: Teste todas as variações de criação
5. Extensibilidade: Projete para fácil adição de novos tipos
6. Dependency Injection: Use DI para reduzir acoplamento
7. Configuration: Externalize configurações
8. Monitoring: Monitore uso e performance
*/

// Exemplo de Factory com Object Pool
class ObjectPool {
    constructor(createFn, resetFn, maxSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.maxSize = maxSize;
        this.pool = [];
        this.created = 0;
        this.reused = 0;
    }
    
    acquire() {
        if (this.pool.length > 0) {
            const obj = this.pool.pop();
            this.reused++;
            console.log(`♻️ Object reused (pool: ${this.pool.length})`);
            return obj;
        }
        
        const obj = this.createFn();
        this.created++;
        console.log(`🆕 Object created (total: ${this.created})`);
        return obj;
    }
    
    release(obj) {
        if (this.pool.length < this.maxSize) {
            this.resetFn(obj);
            this.pool.push(obj);
            console.log(`🔄 Object returned to pool (pool: ${this.pool.length})`);
        } else {
            console.log(`🗑️ Object discarded (pool full)`);
        }
    }
    
    getStats() {
        return {
            poolSize: this.pool.length,
            maxSize: this.maxSize,
            created: this.created,
            reused: this.reused,
            reuseRate: this.reused / (this.created + this.reused)
        };
    }
}

// Exemplo de uso do Object Pool
class ExpensiveObject {
    constructor() {
        this.id = Math.random().toString(36).substr(2, 9);
        this.data = new Array(1000).fill(0).map(() => Math.random());
        this.processed = false;
    }
    
    process() {
        this.processed = true;
        // Simulação de processamento pesado
        this.result = this.data.reduce((sum, val) => sum + val, 0);
        return this.result;
    }
    
    reset() {
        this.processed = false;
        this.result = null;
        this.data.fill(0);
    }
}

const expensivePool = new ObjectPool(
    () => new ExpensiveObject(),
    (obj) => obj.reset(),
    5
);

console.log('\n--- Testando Object Pool ---');
for (let i = 0; i < 8; i++) {
    const obj = expensivePool.acquire();
    obj.process();
    console.log(`Objeto ${obj.id} processado: ${obj.result.toFixed(2)}`);
    
    // Simular uso e retorno
    setTimeout(() => {
        expensivePool.release(obj);
    }, 100);
}

setTimeout(() => {
    console.log('Pool Stats:', expensivePool.getStats());
}, 200);

// ==========================================
// REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS ===');

/*
LIVROS:
- "Design Patterns" - Gang of Four
- "Head First Design Patterns" - Freeman & Robson
- "JavaScript Patterns" - Stoyan Stefanov

ARTIGOS:
- MDN Web Docs: JavaScript Classes
- Refactoring Guru: Factory Patterns
- JavaScript.info: Prototypes

PRÓXIMOS PASSOS:
1. Estudar Singleton Pattern
2. Implementar Dependency Injection
3. Explorar Abstract Factory avançado
4. Praticar com projetos reais
5. Integrar com frameworks modernos

PROJETOS SUGERIDOS:
- Sistema de componentes UI
- Factory de validadores
- Gerador de relatórios
- Sistema de plugins extensível
- Factory de conexões de banco
*/

/*
RESUMO DO MÓDULO FACTORY PATTERN:

CONCEITOS APRENDIDOS:
✅ Simple Factory - Criação centralizada
✅ Factory Method - Delegação de criação
✅ Abstract Factory - Famílias de objetos
✅ Builder Pattern - Construção complexa
✅ Prototype Pattern - Clonagem eficiente
✅ Object Pool - Reutilização de recursos

TÉCNICAS DOMINADAS:
✅ Encapsulamento de criação
✅ Polimorfismo em factories
✅ Configuração flexível
✅ Validação e error handling
✅ Performance optimization
✅ Plugin architecture

PROJETOS DESENVOLVIDOS:
✅ Sistema de veículos com Simple Factory
✅ Processador de documentos com Factory Method
✅ Framework UI com Abstract Factory
✅ Configurador de PC com Builder
✅ Sistema de templates com Prototype
✅ Gerenciador de plugins completo

PRÓXIMO MÓDULO: 04-singleton-pattern.js
*/