/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 4.3
CLASSES ES6+
==============================================

Objetivos de Aprendizagem:
- Dominar a sintaxe de classes ES6+
- Compreender constructor, métodos e propriedades
- Implementar herança com extends e super
- Usar métodos estáticos e getters/setters
- Aplicar propriedades privadas (#)
- Conhecer decorators e mixins com classes
- Entender a diferença entre classes e funções construtoras
- Implementar padrões avançados com classes

⏱️ TEMPO ESTIMADO: 80 minutos
📊 NÍVEL: Intermediário/Avançado
==============================================
*/

// ==========================================
// 📚 1. TEORIA: CLASSES ES6+
// ==========================================

/*
CLASSES EM JAVASCRIPT:
As classes ES6+ são uma sintaxe mais limpa para criar objetos e implementar
herança, mas por baixo ainda usam protótipos (syntactic sugar).

CONCEITOS FUNDAMENTAIS:
1. class - palavra-chave para definir uma classe
2. constructor - método especial para inicialização
3. extends - palavra-chave para herança
4. super - referência à classe pai
5. static - métodos/propriedades da classe (não da instância)
6. # - propriedades privadas (ES2022)

VANTAGENS DAS CLASSES:
- Sintaxe mais familiar para quem vem de outras linguagens
- Código mais organizado e legível
- Melhor suporte a ferramentas (IDEs, linters)
- Facilita implementação de padrões OOP
- Suporte nativo a propriedades privadas

DIFERENÇAS DE FUNCTION CONSTRUCTORS:
- Hoisting: classes não são hoisted
- Strict mode: classes sempre executam em strict mode
- Enumerabilidade: métodos de classe não são enumeráveis
- new.target: disponível em classes
- Super: sintaxe mais simples para herança

RECURSOS AVANÇADOS:
- Propriedades privadas (#propriedade)
- Métodos privados (#metodo())
- Campos de classe (class fields)
- Métodos estáticos
- Getters e setters
- Decorators (proposta)
*/

console.log('=== CLASSES ES6+ ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== SINTAXE BÁSICA DE CLASSES ==========
console.log('\n--- SINTAXE BÁSICA DE CLASSES ---');

// Classe básica
class Pessoa {
    // Constructor - método especial para inicialização
    constructor(nome, idade, email) {
        this.nome = nome;
        this.idade = idade;
        this.email = email;
        this.ativo = true;
        this.dataCriacao = new Date();
    }
    
    // Métodos de instância
    cumprimentar() {
        return `Olá, eu sou ${this.nome} e tenho ${this.idade} anos`;
    }
    
    aniversario() {
        this.idade++;
        console.log(`${this.nome} fez aniversário! Nova idade: ${this.idade}`);
        return this;
    }
    
    atualizarEmail(novoEmail) {
        const emailAntigo = this.email;
        this.email = novoEmail;
        console.log(`Email de ${this.nome} atualizado de ${emailAntigo} para ${novoEmail}`);
        return this;
    }
    
    desativar() {
        this.ativo = false;
        console.log(`${this.nome} foi desativado`);
        return this;
    }
    
    // Método que retorna informações
    obterInfo() {
        return {
            nome: this.nome,
            idade: this.idade,
            email: this.email,
            ativo: this.ativo,
            dataCriacao: this.dataCriacao.toLocaleDateString()
        };
    }
    
    // Método toString personalizado
    toString() {
        return `Pessoa(${this.nome}, ${this.idade} anos)`;
    }
}

// Testando classe básica
console.log('\n👤 Testando classe Pessoa:');

const pessoa1 = new Pessoa('Ana Silva', 28, 'ana@email.com');
const pessoa2 = new Pessoa('Carlos Santos', 35, 'carlos@email.com');

console.log(pessoa1.cumprimentar());
console.log(pessoa2.cumprimentar());

pessoa1.aniversario().atualizarEmail('ana.silva@email.com');

console.log('Info da Ana:', pessoa1.obterInfo());
console.log('String da Ana:', pessoa1.toString());

// ========== GETTERS E SETTERS ==========
console.log('\n--- GETTERS E SETTERS ---');

class ContaBancaria {
    constructor(titular, saldoInicial = 0) {
        this.titular = titular;
        this._saldo = saldoInicial; // Convenção: _ indica propriedade "privada"
        this._historico = [];
        this._ativa = true;
        this._limite = 1000;
        
        this._adicionarHistorico('Conta criada', saldoInicial);
    }
    
    // Getter para saldo (propriedade calculada)
    get saldo() {
        return this._ativa ? this._saldo : 0;
    }
    
    // Setter para saldo (com validação)
    set saldo(valor) {
        if (typeof valor !== 'number' || valor < 0) {
            throw new Error('Saldo deve ser um número positivo');
        }
        this._saldo = valor;
    }
    
    // Getter para limite
    get limite() {
        return this._limite;
    }
    
    // Setter para limite (com validação)
    set limite(valor) {
        if (typeof valor !== 'number' || valor < 0) {
            throw new Error('Limite deve ser um número positivo');
        }
        
        const limiteAntigo = this._limite;
        this._limite = valor;
        this._adicionarHistorico(`Limite alterado de R$ ${limiteAntigo} para R$ ${valor}`);
        console.log(`Limite da conta de ${this.titular} alterado para R$ ${valor}`);
    }
    
    // Getter para saldo disponível
    get saldoDisponivel() {
        return this.saldo + this._limite;
    }
    
    // Getter para status da conta
    get status() {
        if (!this._ativa) return 'Inativa';
        if (this._saldo < 0) return 'Devedor';
        if (this._saldo === 0) return 'Zerada';
        return 'Ativa';
    }
    
    // Getter para histórico (retorna cópia)
    get historico() {
        return [...this._historico];
    }
    
    // Métodos privados (convenção com _)
    _adicionarHistorico(operacao, valor = null) {
        this._historico.push({
            data: new Date(),
            operacao,
            valor,
            saldoApos: this._saldo
        });
    }
    
    _validarOperacao(valor) {
        if (!this._ativa) {
            throw new Error('Conta inativa');
        }
        if (typeof valor !== 'number' || valor <= 0) {
            throw new Error('Valor deve ser um número positivo');
        }
    }
    
    // Métodos públicos
    depositar(valor) {
        this._validarOperacao(valor);
        
        this._saldo += valor;
        this._adicionarHistorico('Depósito', valor);
        console.log(`Depósito de R$ ${valor} realizado. Saldo: R$ ${this._saldo}`);
        return this;
    }
    
    sacar(valor) {
        this._validarOperacao(valor);
        
        if (valor > this.saldoDisponivel) {
            throw new Error('Saldo insuficiente (incluindo limite)');
        }
        
        this._saldo -= valor;
        this._adicionarHistorico('Saque', valor);
        console.log(`Saque de R$ ${valor} realizado. Saldo: R$ ${this._saldo}`);
        return this;
    }
    
    transferir(valor, contaDestino) {
        if (!(contaDestino instanceof ContaBancaria)) {
            throw new Error('Conta de destino inválida');
        }
        
        this.sacar(valor);
        contaDestino.depositar(valor);
        
        this._adicionarHistorico(`Transferência para ${contaDestino.titular}`, valor);
        contaDestino._adicionarHistorico(`Transferência de ${this.titular}`, valor);
        
        console.log(`Transferência de R$ ${valor} para ${contaDestino.titular} realizada`);
        return this;
    }
    
    fecharConta() {
        if (this._saldo !== 0) {
            throw new Error('Conta deve estar zerada para ser fechada');
        }
        
        this._ativa = false;
        this._adicionarHistorico('Conta fechada');
        console.log(`Conta de ${this.titular} foi fechada`);
        return this;
    }
    
    obterExtrato(ultimas = 10) {
        const historico = this._historico.slice(-ultimas);
        
        console.log(`\n📋 Extrato da conta de ${this.titular} (últimas ${ultimas} operações):`);
        historico.forEach((item, index) => {
            const data = item.data.toLocaleString();
            const valor = item.valor ? `R$ ${item.valor}` : '';
            const saldo = `Saldo: R$ ${item.saldoApos}`;
            console.log(`${index + 1}. ${data} - ${item.operacao} ${valor} - ${saldo}`);
        });
        
        return historico;
    }
    
    obterResumo() {
        return {
            titular: this.titular,
            saldo: this.saldo,
            limite: this.limite,
            saldoDisponivel: this.saldoDisponivel,
            status: this.status,
            totalOperacoes: this._historico.length
        };
    }
}

// Testando getters e setters
console.log('\n🏦 Testando ContaBancaria com getters/setters:');

const contaAna = new ContaBancaria('Ana Silva', 1000);
const contaCarlos = new ContaBancaria('Carlos Santos', 500);

console.log('Saldo inicial da Ana:', contaAna.saldo);
console.log('Status da conta da Ana:', contaAna.status);
console.log('Saldo disponível da Ana:', contaAna.saldoDisponivel);

// Operações
contaAna.depositar(500)
        .sacar(200)
        .transferir(300, contaCarlos);

// Alterando limite
contaAna.limite = 2000;

console.log('\n📊 Resumo das contas:');
console.log('Ana:', contaAna.obterResumo());
console.log('Carlos:', contaCarlos.obterResumo());

// Extratos
contaAna.obterExtrato(5);
contaCarlos.obterExtrato(3);

// ========== MÉTODOS ESTÁTICOS ==========
console.log('\n--- MÉTODOS ESTÁTICOS ---');

class Matematica {
    // Propriedades estáticas
    static PI = 3.14159265359;
    static E = 2.71828182846;
    
    // Métodos estáticos - pertencem à classe, não à instância
    static somar(a, b) {
        return a + b;
    }
    
    static subtrair(a, b) {
        return a - b;
    }
    
    static multiplicar(a, b) {
        return a * b;
    }
    
    static dividir(a, b) {
        if (b === 0) {
            throw new Error('Divisão por zero não é permitida');
        }
        return a / b;
    }
    
    static potencia(base, expoente) {
        return Math.pow(base, expoente);
    }
    
    static raizQuadrada(numero) {
        if (numero < 0) {
            throw new Error('Não é possível calcular raiz quadrada de número negativo');
        }
        return Math.sqrt(numero);
    }
    
    static fatorial(n) {
        if (n < 0) {
            throw new Error('Fatorial não definido para números negativos');
        }
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * Matematica.fatorial(n - 1);
    }
    
    static fibonacci(n) {
        if (n < 0) {
            throw new Error('Fibonacci não definido para números negativos');
        }
        if (n === 0) return 0;
        if (n === 1) return 1;
        
        let a = 0, b = 1;
        for (let i = 2; i <= n; i++) {
            [a, b] = [b, a + b];
        }
        return b;
    }
    
    static ehPrimo(numero) {
        if (numero < 2) return false;
        if (numero === 2) return true;
        if (numero % 2 === 0) return false;
        
        for (let i = 3; i <= Math.sqrt(numero); i += 2) {
            if (numero % i === 0) return false;
        }
        return true;
    }
    
    static gerarPrimos(limite) {
        const primos = [];
        for (let i = 2; i <= limite; i++) {
            if (Matematica.ehPrimo(i)) {
                primos.push(i);
            }
        }
        return primos;
    }
    
    static calcularAreaCirculo(raio) {
        return Matematica.PI * raio * raio;
    }
    
    static calcularVolumeEsfera(raio) {
        return (4/3) * Matematica.PI * Math.pow(raio, 3);
    }
    
    // Método estático que retorna informações da classe
    static obterInfo() {
        return {
            nome: 'Classe Matemática',
            constantes: {
                PI: Matematica.PI,
                E: Matematica.E
            },
            metodosDisponiveis: [
                'somar', 'subtrair', 'multiplicar', 'dividir',
                'potencia', 'raizQuadrada', 'fatorial', 'fibonacci',
                'ehPrimo', 'gerarPrimos', 'calcularAreaCirculo', 'calcularVolumeEsfera'
            ]
        };
    }
}

// Testando métodos estáticos
console.log('\n🔢 Testando métodos estáticos:');

console.log('Soma 5 + 3:', Matematica.somar(5, 3));
console.log('Multiplicação 4 * 7:', Matematica.multiplicar(4, 7));
console.log('Potência 2^8:', Matematica.potencia(2, 8));
console.log('Raiz quadrada de 16:', Matematica.raizQuadrada(16));
console.log('Fatorial de 5:', Matematica.fatorial(5));
console.log('Fibonacci de 10:', Matematica.fibonacci(10));
console.log('7 é primo?', Matematica.ehPrimo(7));
console.log('15 é primo?', Matematica.ehPrimo(15));
console.log('Primos até 20:', Matematica.gerarPrimos(20));
console.log('Área do círculo (raio 5):', Matematica.calcularAreaCirculo(5).toFixed(2));
console.log('Volume da esfera (raio 3):', Matematica.calcularVolumeEsfera(3).toFixed(2));

console.log('\n📋 Info da classe:', Matematica.obterInfo());

// ========== HERANÇA COM EXTENDS E SUPER ==========
console.log('\n--- HERANÇA COM EXTENDS E SUPER ---');

// Classe base: Veiculo
class Veiculo {
    constructor(marca, modelo, ano, cor = 'branco') {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
        this.ligado = false;
        this.velocidade = 0;
        this.quilometragem = 0;
        this.combustivel = 100;
        this.manutencoes = [];
    }
    
    ligar() {
        if (!this.ligado) {
            this.ligado = true;
            console.log(`${this.marca} ${this.modelo} foi ligado`);
        } else {
            console.log(`${this.marca} ${this.modelo} já está ligado`);
        }
        return this;
    }
    
    desligar() {
        if (this.ligado) {
            this.velocidade = 0;
            this.ligado = false;
            console.log(`${this.marca} ${this.modelo} foi desligado`);
        } else {
            console.log(`${this.marca} ${this.modelo} já está desligado`);
        }
        return this;
    }
    
    acelerar(incremento = 10) {
        if (!this.ligado) {
            console.log('Precisa ligar o veículo primeiro!');
            return this;
        }
        
        if (this.combustivel <= 0) {
            console.log('Sem combustível!');
            return this;
        }
        
        this.velocidade += incremento;
        this.consumirCombustivel(incremento * 0.1);
        console.log(`${this.marca} ${this.modelo} acelerou para ${this.velocidade} km/h`);
        return this;
    }
    
    frear(decremento = 15) {
        this.velocidade = Math.max(0, this.velocidade - decremento);
        console.log(`${this.marca} ${this.modelo} freou para ${this.velocidade} km/h`);
        return this;
    }
    
    consumirCombustivel(quantidade) {
        this.combustivel = Math.max(0, this.combustivel - quantidade);
        if (this.combustivel === 0) {
            this.velocidade = 0;
            this.ligado = false;
            console.log(`${this.marca} ${this.modelo} ficou sem combustível!`);
        }
    }
    
    abastecer(quantidade = 100) {
        this.combustivel = Math.min(100, this.combustivel + quantidade);
        console.log(`${this.marca} ${this.modelo} abastecido. Combustível: ${this.combustivel}%`);
        return this;
    }
    
    rodar(distancia) {
        if (!this.ligado || this.velocidade === 0) {
            console.log('Veículo precisa estar ligado e em movimento');
            return this;
        }
        
        this.quilometragem += distancia;
        this.consumirCombustivel(distancia * 0.05);
        console.log(`${this.marca} ${this.modelo} rodou ${distancia} km. Quilometragem: ${this.quilometragem} km`);
        return this;
    }
    
    fazerManutencao(tipo, custo) {
        this.manutencoes.push({
            data: new Date(),
            tipo,
            custo,
            quilometragem: this.quilometragem
        });
        console.log(`Manutenção realizada: ${tipo} - R$ ${custo}`);
        return this;
    }
    
    obterInfo() {
        return {
            marca: this.marca,
            modelo: this.modelo,
            ano: this.ano,
            cor: this.cor,
            ligado: this.ligado,
            velocidade: this.velocidade,
            quilometragem: this.quilometragem,
            combustivel: this.combustivel + '%',
            manutencoes: this.manutencoes.length
        };
    }
    
    toString() {
        return `${this.marca} ${this.modelo} (${this.ano})`;
    }
}

// Classe derivada: Carro
class Carro extends Veiculo {
    constructor(marca, modelo, ano, cor, portas, categoria = 'hatch') {
        // Chama o constructor da classe pai
        super(marca, modelo, ano, cor);
        
        // Propriedades específicas do carro
        this.portas = portas;
        this.categoria = categoria;
        this.arCondicionado = false;
        this.radioLigado = false;
        this.portasAbertas = [];
    }
    
    // Sobrescreve método da classe pai
    acelerar(incremento = 10) {
        // Chama o método da classe pai
        super.acelerar(incremento);
        
        // Lógica específica do carro
        if (this.velocidade > 120) {
            console.log('⚠️ Velocidade alta! Dirija com cuidado.');
        }
        
        return this;
    }
    
    abrirPorta(numero) {
        if (numero < 1 || numero > this.portas) {
            console.log(`Carro tem apenas ${this.portas} portas`);
            return this;
        }
        
        if (!this.portasAbertas.includes(numero)) {
            this.portasAbertas.push(numero);
            console.log(`Porta ${numero} do ${this.marca} ${this.modelo} foi aberta`);
        } else {
            console.log(`Porta ${numero} já está aberta`);
        }
        return this;
    }
    
    fecharPorta(numero) {
        const index = this.portasAbertas.indexOf(numero);
        if (index > -1) {
            this.portasAbertas.splice(index, 1);
            console.log(`Porta ${numero} do ${this.marca} ${this.modelo} foi fechada`);
        } else {
            console.log(`Porta ${numero} já está fechada`);
        }
        return this;
    }
    
    ligarArCondicionado() {
        if (!this.ligado) {
            console.log('Precisa ligar o carro primeiro!');
            return this;
        }
        
        this.arCondicionado = true;
        console.log('Ar condicionado ligado');
        return this;
    }
    
    desligarArCondicionado() {
        this.arCondicionado = false;
        console.log('Ar condicionado desligado');
        return this;
    }
    
    ligarRadio() {
        if (!this.ligado) {
            console.log('Precisa ligar o carro primeiro!');
            return this;
        }
        
        this.radioLigado = true;
        console.log('Rádio ligado 🎵');
        return this;
    }
    
    desligarRadio() {
        this.radioLigado = false;
        console.log('Rádio desligado');
        return this;
    }
    
    // Sobrescreve obterInfo
    obterInfo() {
        // Obtém info da classe pai
        const infoBase = super.obterInfo();
        
        // Adiciona informações específicas
        return {
            ...infoBase,
            portas: this.portas,
            categoria: this.categoria,
            arCondicionado: this.arCondicionado,
            radioLigado: this.radioLigado,
            portasAbertas: this.portasAbertas.length
        };
    }
}

// Classe derivada: Moto
class Moto extends Veiculo {
    constructor(marca, modelo, ano, cor, cilindradas, tipo = 'street') {
        super(marca, modelo, ano, cor);
        this.cilindradas = cilindradas;
        this.tipo = tipo;
        this.capacete = false;
        this.cavalete = true;
    }
    
    // Sobrescreve acelerar com lógica específica
    acelerar(incremento = 15) {
        super.acelerar(incremento);
        
        if (this.velocidade > 100) {
            console.log('🏍️ Velocidade de moto! Cuidado com o vento.');
        }
        
        return this;
    }
    
    empinar() {
        if (!this.ligado) {
            console.log('Precisa ligar a moto primeiro!');
            return this;
        }
        
        if (this.velocidade < 30) {
            console.log('Velocidade insuficiente para empinar');
            return this;
        }
        
        console.log(`${this.marca} ${this.modelo} está empinando! 🤸`);
        this.velocidade = Math.max(20, this.velocidade - 10);
        return this;
    }
    
    colocarCapacete() {
        this.capacete = true;
        console.log('Capacete colocado 🪖');
        return this;
    }
    
    tirarCapacete() {
        if (this.velocidade > 0) {
            console.log('Não tire o capacete em movimento!');
            return this;
        }
        
        this.capacete = false;
        console.log('Capacete removido');
        return this;
    }
    
    levantarCavalete() {
        if (this.velocidade > 0) {
            console.log('Não mexa no cavalete em movimento!');
            return this;
        }
        
        this.cavalete = false;
        console.log('Cavalete levantado');
        return this;
    }
    
    baixarCavalete() {
        if (this.velocidade > 0) {
            console.log('Pare a moto antes de baixar o cavalete!');
            return this;
        }
        
        this.cavalete = true;
        console.log('Cavalete baixado');
        return this;
    }
    
    // Sobrescreve obterInfo
    obterInfo() {
        const infoBase = super.obterInfo();
        
        return {
            ...infoBase,
            cilindradas: this.cilindradas,
            tipo: this.tipo,
            capacete: this.capacete,
            cavalete: this.cavalete
        };
    }
}

// Classe derivada: CarroEletrico
class CarroEletrico extends Carro {
    constructor(marca, modelo, ano, cor, portas, autonomia) {
        super(marca, modelo, ano, cor, portas, 'elétrico');
        this.autonomia = autonomia; // km
        this.bateria = 100; // %
        this.carregando = false;
        this.modoEco = false;
    }
    
    // Sobrescreve métodos relacionados a combustível
    consumirCombustivel(quantidade) {
        // Para carros elétricos, "combustível" é bateria
        this.bateria = Math.max(0, this.bateria - quantidade);
        if (this.bateria === 0) {
            this.velocidade = 0;
            this.ligado = false;
            console.log(`${this.marca} ${this.modelo} ficou sem bateria!`);
        }
    }
    
    abastecer() {
        console.log('Carros elétricos não abastecem combustível. Use carregar().');
        return this;
    }
    
    carregar(tempo = 60) { // tempo em minutos
        if (this.ligado) {
            console.log('Desligue o carro para carregar');
            return this;
        }
        
        this.carregando = true;
        console.log(`Iniciando carregamento por ${tempo} minutos...`);
        
        // Simula carregamento
        const cargaAdicionada = Math.min(100 - this.bateria, tempo * 1.5);
        this.bateria += cargaAdicionada;
        
        setTimeout(() => {
            this.carregando = false;
            console.log(`Carregamento concluído! Bateria: ${this.bateria}%`);
        }, 1000); // Simula 1 segundo = tempo de carregamento
        
        return this;
    }
    
    ativarModoEco() {
        this.modoEco = true;
        console.log('Modo eco ativado 🌱 - Consumo reduzido');
        return this;
    }
    
    desativarModoEco() {
        this.modoEco = false;
        console.log('Modo eco desativado');
        return this;
    }
    
    // Sobrescreve acelerar para considerar modo eco
    acelerar(incremento = 10) {
        if (this.modoEco) {
            incremento = Math.floor(incremento * 0.7); // Reduz aceleração no modo eco
            console.log('🌱 Modo eco: aceleração reduzida');
        }
        
        super.acelerar(incremento);
        return this;
    }
    
    obterAutonomiaRestante() {
        const autonomiaAtual = (this.bateria / 100) * this.autonomia;
        return Math.floor(autonomiaAtual);
    }
    
    // Sobrescreve obterInfo
    obterInfo() {
        const infoBase = super.obterInfo();
        
        return {
            ...infoBase,
            combustivel: undefined, // Remove combustível
            bateria: this.bateria + '%',
            autonomia: this.autonomia + ' km',
            autonomiaRestante: this.obterAutonomiaRestante() + ' km',
            carregando: this.carregando,
            modoEco: this.modoEco
        };
    }
}

// Testando herança
console.log('\n🚗 Testando herança com veículos:');

// Carro comum
const civic = new Carro('Honda', 'Civic', 2022, 'prata', 4, 'sedan');
civic.ligar()
     .acelerar(50)
     .abrirPorta(1)
     .ligarArCondicionado()
     .ligarRadio()
     .rodar(100);

console.log('Info do Civic:', civic.obterInfo());

// Moto
const ninja = new Moto('Kawasaki', 'Ninja', 2023, 'verde', 650, 'esportiva');
ninja.colocarCapacete()
     .levantarCavalete()
     .ligar()
     .acelerar(60)
     .empinar()
     .frear(30);

console.log('Info da Ninja:', ninja.obterInfo());

// Carro elétrico
const tesla = new CarroEletrico('Tesla', 'Model 3', 2023, 'branco', 4, 500);
tesla.ativarModoEco()
     .ligar()
     .acelerar(40)
     .acelerar(30)
     .rodar(50);

console.log('Info do Tesla:', tesla.obterInfo());
console.log('Autonomia restante do Tesla:', tesla.obterAutonomiaRestante(), 'km');

// ========== PROPRIEDADES PRIVADAS (#) ==========
console.log('\n--- PROPRIEDADES PRIVADAS (#) ---');

class ContaSegura {
    // Propriedades privadas (ES2022)
    #saldo = 0;
    #senha;
    #tentativasLogin = 0;
    #bloqueada = false;
    #historico = [];
    
    // Propriedades públicas
    titular;
    numeroConta;
    
    constructor(titular, numeroConta, senhaInicial) {
        this.titular = titular;
        this.numeroConta = numeroConta;
        this.#senha = this.#criptografarSenha(senhaInicial);
        this.#adicionarHistorico('Conta criada');
    }
    
    // Métodos privados
    #criptografarSenha(senha) {
        // Simulação simples de criptografia
        return btoa(senha + 'salt123');
    }
    
    #verificarSenha(senha) {
        return this.#criptografarSenha(senha) === this.#senha;
    }
    
    #adicionarHistorico(operacao, valor = null) {
        this.#historico.push({
            data: new Date(),
            operacao,
            valor,
            saldo: this.#saldo
        });
    }
    
    #validarAcesso(senha) {
        if (this.#bloqueada) {
            throw new Error('Conta bloqueada por excesso de tentativas');
        }
        
        if (!this.#verificarSenha(senha)) {
            this.#tentativasLogin++;
            
            if (this.#tentativasLogin >= 3) {
                this.#bloqueada = true;
                this.#adicionarHistorico('Conta bloqueada');
                throw new Error('Conta bloqueada por excesso de tentativas');
            }
            
            throw new Error(`Senha incorreta. Tentativas restantes: ${3 - this.#tentativasLogin}`);
        }
        
        this.#tentativasLogin = 0; // Reset tentativas em caso de sucesso
    }
    
    // Métodos públicos
    consultarSaldo(senha) {
        this.#validarAcesso(senha);
        console.log(`Saldo da conta ${this.numeroConta}: R$ ${this.#saldo}`);
        return this.#saldo;
    }
    
    depositar(valor, senha) {
        this.#validarAcesso(senha);
        
        if (valor <= 0) {
            throw new Error('Valor deve ser positivo');
        }
        
        this.#saldo += valor;
        this.#adicionarHistorico('Depósito', valor);
        console.log(`Depósito de R$ ${valor} realizado. Novo saldo: R$ ${this.#saldo}`);
        return this;
    }
    
    sacar(valor, senha) {
        this.#validarAcesso(senha);
        
        if (valor <= 0) {
            throw new Error('Valor deve ser positivo');
        }
        
        if (valor > this.#saldo) {
            throw new Error('Saldo insuficiente');
        }
        
        this.#saldo -= valor;
        this.#adicionarHistorico('Saque', valor);
        console.log(`Saque de R$ ${valor} realizado. Novo saldo: R$ ${this.#saldo}`);
        return this;
    }
    
    alterarSenha(senhaAtual, novaSenha) {
        this.#validarAcesso(senhaAtual);
        
        if (novaSenha.length < 6) {
            throw new Error('Nova senha deve ter pelo menos 6 caracteres');
        }
        
        this.#senha = this.#criptografarSenha(novaSenha);
        this.#adicionarHistorico('Senha alterada');
        console.log('Senha alterada com sucesso');
        return this;
    }
    
    obterExtrato(senha, quantidade = 10) {
        this.#validarAcesso(senha);
        
        const extrato = this.#historico.slice(-quantidade);
        console.log(`\n📋 Extrato da conta ${this.numeroConta}:`);
        
        extrato.forEach((item, index) => {
            const data = item.data.toLocaleString();
            const valor = item.valor ? `R$ ${item.valor}` : '';
            console.log(`${index + 1}. ${data} - ${item.operacao} ${valor} - Saldo: R$ ${item.saldo}`);
        });
        
        return extrato;
    }
    
    desbloquear(senhaAdmin = 'admin123') {
        if (senhaAdmin !== 'admin123') {
            throw new Error('Senha de administrador incorreta');
        }
        
        this.#bloqueada = false;
        this.#tentativasLogin = 0;
        this.#adicionarHistorico('Conta desbloqueada pelo administrador');
        console.log('Conta desbloqueada pelo administrador');
        return this;
    }
    
    // Getter para status (não expõe dados privados)
    get status() {
        return {
            titular: this.titular,
            numeroConta: this.numeroConta,
            bloqueada: this.#bloqueada,
            tentativasRestantes: this.#bloqueada ? 0 : 3 - this.#tentativasLogin
        };
    }
}

// Testando propriedades privadas
console.log('\n🔒 Testando propriedades privadas:');

const contaSegura = new ContaSegura('João Silva', '12345-6', 'minhasenha123');

console.log('Status inicial:', contaSegura.status);

// Operações válidas
contaSegura.depositar(1000, 'minhasenha123');
contaSegura.consultarSaldo('minhasenha123');
contaSegura.sacar(200, 'minhasenha123');

// Tentativa de acesso direto às propriedades privadas
console.log('\n🚫 Tentando acessar propriedades privadas:');
console.log('contaSegura.#saldo:', contaSegura.saldo); // undefined
console.log('contaSegura.#senha:', contaSegura.senha); // undefined

// Tentativas de senha incorreta
console.log('\n🚫 Testando tentativas de senha incorreta:');
try {
    contaSegura.consultarSaldo('senhaerrada');
} catch (error) {
    console.log('Erro:', error.message);
}

try {
    contaSegura.consultarSaldo('outrasenhaerrada');
} catch (error) {
    console.log('Erro:', error.message);
}

try {
    contaSegura.consultarSaldo('maisumtentativa');
} catch (error) {
    console.log('Erro:', error.message);
}

console.log('Status após tentativas:', contaSegura.status);

// Desbloqueando
contaSegura.desbloquear();
contaSegura.obterExtrato('minhasenha123', 5);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de E-commerce
console.log('\n--- EXERCÍCIO 1: SISTEMA DE E-COMMERCE ---');

// Classe base Produto
class Produto {
    static #proximoId = 1;
    
    #id;
    #preco;
    #estoque;
    
    constructor(nome, preco, categoria, estoque = 0) {
        this.#id = Produto.#proximoId++;
        this.nome = nome;
        this.#preco = preco;
        this.categoria = categoria;
        this.#estoque = estoque;
        this.ativo = true;
        this.dataCriacao = new Date();
        this.avaliacoes = [];
    }
    
    get id() {
        return this.#id;
    }
    
    get preco() {
        return this.#preco;
    }
    
    set preco(novoPreco) {
        if (novoPreco <= 0) {
            throw new Error('Preço deve ser positivo');
        }
        this.#preco = novoPreco;
    }
    
    get estoque() {
        return this.#estoque;
    }
    
    get disponivel() {
        return this.ativo && this.#estoque > 0;
    }
    
    get mediaAvaliacoes() {
        if (this.avaliacoes.length === 0) return 0;
        const soma = this.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
        return (soma / this.avaliacoes.length).toFixed(1);
    }
    
    adicionarEstoque(quantidade) {
        if (quantidade <= 0) {
            throw new Error('Quantidade deve ser positiva');
        }
        this.#estoque += quantidade;
        console.log(`Estoque de ${this.nome} aumentado em ${quantidade}. Total: ${this.#estoque}`);
        return this;
    }
    
    removerEstoque(quantidade) {
        if (quantidade <= 0) {
            throw new Error('Quantidade deve ser positiva');
        }
        if (quantidade > this.#estoque) {
            throw new Error('Estoque insuficiente');
        }
        this.#estoque -= quantidade;
        console.log(`Estoque de ${this.nome} reduzido em ${quantidade}. Restante: ${this.#estoque}`);
        return this;
    }
    
    avaliar(nota, comentario = '') {
        if (nota < 1 || nota > 5) {
            throw new Error('Nota deve ser entre 1 e 5');
        }
        
        this.avaliacoes.push({
            nota,
            comentario,
            data: new Date()
        });
        
        console.log(`Avaliação adicionada para ${this.nome}: ${nota} estrelas`);
        return this;
    }
    
    desativar() {
        this.ativo = false;
        console.log(`Produto ${this.nome} foi desativado`);
        return this;
    }
    
    obterInfo() {
        return {
            id: this.#id,
            nome: this.nome,
            preco: this.#preco,
            categoria: this.categoria,
            estoque: this.#estoque,
            disponivel: this.disponivel,
            mediaAvaliacoes: this.mediaAvaliacoes,
            totalAvaliacoes: this.avaliacoes.length,
            ativo: this.ativo
        };
    }
}

// Classe ProdutoFisico
class ProdutoFisico extends Produto {
    constructor(nome, preco, categoria, estoque, peso, dimensoes) {
        super(nome, preco, categoria, estoque);
        this.peso = peso; // em kg
        this.dimensoes = dimensoes; // {largura, altura, profundidade} em cm
        this.fragil = false;
    }
    
    calcularFrete(cep, transportadora = 'correios') {
        // Simulação simples de cálculo de frete
        const distancia = Math.random() * 1000 + 100; // 100-1100 km
        const pesoFator = this.peso * 2;
        const fragilFator = this.fragil ? 1.5 : 1;
        
        const frete = (distancia * 0.01 + pesoFator) * fragilFator;
        
        console.log(`Frete para ${cep} via ${transportadora}: R$ ${frete.toFixed(2)}`);
        return frete;
    }
    
    marcarFragil() {
        this.fragil = true;
        console.log(`${this.nome} marcado como frágil`);
        return this;
    }
    
    obterInfo() {
        const infoBase = super.obterInfo();
        return {
            ...infoBase,
            peso: this.peso + ' kg',
            dimensoes: this.dimensoes,
            fragil: this.fragil
        };
    }
}

// Classe ProdutoDigital
class ProdutoDigital extends Produto {
    constructor(nome, preco, categoria, tamanho, formato) {
        super(nome, preco, categoria, Infinity); // Estoque infinito
        this.tamanho = tamanho; // em MB
        this.formato = formato;
        this.downloads = 0;
        this.linkDownload = null;
    }
    
    gerarLinkDownload() {
        this.linkDownload = `https://download.loja.com/${this.id}/${Date.now()}`;
        console.log(`Link de download gerado para ${this.nome}`);
        return this.linkDownload;
    }
    
    registrarDownload() {
        this.downloads++;
        console.log(`Download registrado. Total: ${this.downloads}`);
        return this;
    }
    
    obterInfo() {
        const infoBase = super.obterInfo();
        return {
            ...infoBase,
            estoque: 'Ilimitado',
            tamanho: this.tamanho + ' MB',
            formato: this.formato,
            downloads: this.downloads
        };
    }
}

// Classe CarrinhoCompras
class CarrinhoCompras {
    #itens = [];
    #desconto = 0;
    
    constructor(usuario) {
        this.usuario = usuario;
        this.dataCriacao = new Date();
    }
    
    adicionarItem(produto, quantidade = 1) {
        if (!(produto instanceof Produto)) {
            throw new Error('Item deve ser um produto válido');
        }
        
        if (!produto.disponivel) {
            throw new Error('Produto não disponível');
        }
        
        if (produto instanceof ProdutoFisico && quantidade > produto.estoque) {
            throw new Error('Quantidade maior que estoque disponível');
        }
        
        const itemExistente = this.#itens.find(item => item.produto.id === produto.id);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
            console.log(`Quantidade de ${produto.nome} atualizada para ${itemExistente.quantidade}`);
        } else {
            this.#itens.push({ produto, quantidade });
            console.log(`${produto.nome} adicionado ao carrinho`);
        }
        
        return this;
    }
    
    removerItem(produtoId) {
        const index = this.#itens.findIndex(item => item.produto.id === produtoId);
        
        if (index > -1) {
            const item = this.#itens.splice(index, 1)[0];
            console.log(`${item.produto.nome} removido do carrinho`);
        } else {
            console.log('Item não encontrado no carrinho');
        }
        
        return this;
    }
    
    alterarQuantidade(produtoId, novaQuantidade) {
        const item = this.#itens.find(item => item.produto.id === produtoId);
        
        if (!item) {
            throw new Error('Item não encontrado no carrinho');
        }
        
        if (novaQuantidade <= 0) {
            return this.removerItem(produtoId);
        }
        
        if (item.produto instanceof ProdutoFisico && novaQuantidade > item.produto.estoque) {
            throw new Error('Quantidade maior que estoque disponível');
        }
        
        item.quantidade = novaQuantidade;
        console.log(`Quantidade de ${item.produto.nome} alterada para ${novaQuantidade}`);
        return this;
    }
    
    aplicarDesconto(percentual) {
        if (percentual < 0 || percentual > 100) {
            throw new Error('Desconto deve ser entre 0 e 100%');
        }
        
        this.#desconto = percentual;
        console.log(`Desconto de ${percentual}% aplicado`);
        return this;
    }
    
    calcularSubtotal() {
        return this.#itens.reduce((total, item) => {
            return total + (item.produto.preco * item.quantidade);
        }, 0);
    }
    
    calcularDesconto() {
        return this.calcularSubtotal() * (this.#desconto / 100);
    }
    
    calcularTotal() {
        return this.calcularSubtotal() - this.calcularDesconto();
    }
    
    obterResumo() {
        return {
            usuario: this.usuario,
            totalItens: this.#itens.length,
            quantidadeTotal: this.#itens.reduce((total, item) => total + item.quantidade, 0),
            subtotal: this.calcularSubtotal().toFixed(2),
            desconto: this.calcularDesconto().toFixed(2),
            total: this.calcularTotal().toFixed(2),
            itens: this.#itens.map(item => ({
                produto: item.produto.nome,
                preco: item.produto.preco,
                quantidade: item.quantidade,
                subtotal: (item.produto.preco * item.quantidade).toFixed(2)
            }))
        };
    }
    
    limpar() {
        this.#itens = [];
        this.#desconto = 0;
        console.log('Carrinho limpo');
        return this;
    }
}

// Testando sistema de e-commerce
console.log('\n🛒 Testando sistema de e-commerce:');

// Criando produtos
const notebook = new ProdutoFisico(
    'Notebook Gamer',
    2500,
    'Eletrônicos',
    10,
    2.5,
    { largura: 35, altura: 25, profundidade: 3 }
);

const ebook = new ProdutoDigital(
    'Curso de JavaScript',
    99.90,
    'Educação',
    150,
    'PDF'
);

const mouse = new ProdutoFisico(
    'Mouse Gamer RGB',
    89.90,
    'Periféricos',
    25,
    0.15,
    { largura: 12, altura: 7, profundidade: 4 }
);

// Configurando produtos
notebook.marcarFragil();
ebook.gerarLinkDownload();

// Adicionando avaliações
notebook.avaliar(5, 'Excelente notebook!')
        .avaliar(4, 'Muito bom, recomendo')
        .avaliar(5, 'Perfeito para jogos');

ebook.avaliar(5, 'Curso muito completo')
     .avaliar(4, 'Aprendi muito');

mouse.avaliar(4, 'Bom custo-benefício');

// Criando carrinho
const carrinho = new CarrinhoCompras('João Silva');

// Adicionando itens
carrinho.adicionarItem(notebook, 1)
        .adicionarItem(ebook, 1)
        .adicionarItem(mouse, 2);

// Aplicando desconto
carrinho.aplicarDesconto(10);

console.log('\n📊 Informações dos produtos:');
console.log('Notebook:', notebook.obterInfo());
console.log('E-book:', ebook.obterInfo());
console.log('Mouse:', mouse.obterInfo());

console.log('\n🛒 Resumo do carrinho:');
console.log(carrinho.obterResumo());

// Calculando frete
notebook.calcularFrete('01234-567');
mouse.calcularFrete('01234-567');

// EXERCÍCIO 2: Sistema de Biblioteca
console.log('\n--- EXERCÍCIO 2: SISTEMA DE BIBLIOTECA ---');

// Classe base Item
class ItemBiblioteca {
    static #proximoId = 1000;
    
    #id;
    #disponivel = true;
    
    constructor(titulo, autor, anoPublicacao) {
        this.#id = ItemBiblioteca.#proximoId++;
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.dataAquisicao = new Date();
        this.emprestimos = [];
    }
    
    get id() {
        return this.#id;
    }
    
    get disponivel() {
        return this.#disponivel;
    }
    
    emprestar(usuario, diasEmprestimo = 14) {
        if (!this.#disponivel) {
            throw new Error('Item não disponível para empréstimo');
        }
        
        const dataEmprestimo = new Date();
        const dataDevolucao = new Date();
        dataDevolucao.setDate(dataDevolucao.getDate() + diasEmprestimo);
        
        this.emprestimos.push({
            usuario,
            dataEmprestimo,
            dataDevolucao,
            devolvido: false
        });
        
        this.#disponivel = false;
        console.log(`${this.titulo} emprestado para ${usuario} até ${dataDevolucao.toLocaleDateString()}`);
        return this;
    }
    
    devolver() {
        if (this.#disponivel) {
            throw new Error('Item não está emprestado');
        }
        
        const emprestimoAtual = this.emprestimos.find(emp => !emp.devolvido);
        if (emprestimoAtual) {
            emprestimoAtual.devolvido = true;
            emprestimoAtual.dataRealDevolucao = new Date();
        }
        
        this.#disponivel = true;
        console.log(`${this.titulo} foi devolvido`);
        return this;
    }
    
    verificarAtraso() {
        const emprestimoAtual = this.emprestimos.find(emp => !emp.devolvido);
        if (!emprestimoAtual) return 0;
        
        const hoje = new Date();
        const diasAtraso = Math.max(0, Math.floor((hoje - emprestimoAtual.dataDevolucao) / (1000 * 60 * 60 * 24)));
        return diasAtraso;
    }
    
    obterInfo() {
        return {
            id: this.#id,
            titulo: this.titulo,
            autor: this.autor,
            anoPublicacao: this.anoPublicacao,
            disponivel: this.#disponivel,
            totalEmprestimos: this.emprestimos.length,
            diasAtraso: this.verificarAtraso()
        };
    }
}

// Classe Livro
class Livro extends ItemBiblioteca {
    constructor(titulo, autor, anoPublicacao, isbn, genero, paginas) {
        super(titulo, autor, anoPublicacao);
        this.isbn = isbn;
        this.genero = genero;
        this.paginas = paginas;
        this.edicao = 1;
    }
    
    obterInfo() {
        const infoBase = super.obterInfo();
        return {
            ...infoBase,
            tipo: 'Livro',
            isbn: this.isbn,
            genero: this.genero,
            paginas: this.paginas,
            edicao: this.edicao
        };
    }
}

// Classe Revista
class Revista extends ItemBiblioteca {
    constructor(titulo, editora, anoPublicacao, numero, periodicidade) {
        super(titulo, editora, anoPublicacao);
        this.numero = numero;
        this.periodicidade = periodicidade; // mensal, semanal, etc.
        this.dataPublicacao = new Date();
    }
    
    obterInfo() {
        const infoBase = super.obterInfo();
        return {
            ...infoBase,
            tipo: 'Revista',
            numero: this.numero,
            periodicidade: this.periodicidade,
            dataPublicacao: this.dataPublicacao.toLocaleDateString()
        };
    }
}

// Classe DVD
class DVD extends ItemBiblioteca {
    constructor(titulo, diretor, anoPublicacao, genero, duracao) {
        super(titulo, diretor, anoPublicacao);
        this.genero = genero;
        this.duracao = duracao; // em minutos
        this.legendas = [];
        this.classificacao = 'Livre';
    }
    
    adicionarLegenda(idioma) {
        if (!this.legendas.includes(idioma)) {
            this.legendas.push(idioma);
            console.log(`Legenda em ${idioma} adicionada ao DVD ${this.titulo}`);
        }
        return this;
    }
    
    definirClassificacao(classificacao) {
        const classificacoesValidas = ['Livre', '10', '12', '14', '16', '18'];
        if (!classificacoesValidas.includes(classificacao)) {
            throw new Error('Classificação inválida');
        }
        
        this.classificacao = classificacao;
        console.log(`Classificação do DVD ${this.titulo} definida como ${classificacao}`);
        return this;
    }
    
    obterInfo() {
        const infoBase = super.obterInfo();
        return {
            ...infoBase,
            tipo: 'DVD',
            genero: this.genero,
            duracao: this.duracao + ' min',
            legendas: this.legendas,
            classificacao: this.classificacao
        };
    }
}

// Classe Biblioteca
class Biblioteca {
    #acervo = [];
    #usuarios = [];
    
    constructor(nome, endereco) {
        this.nome = nome;
        this.endereco = endereco;
        this.dataFundacao = new Date();
    }
    
    adicionarItem(item) {
        if (!(item instanceof ItemBiblioteca)) {
            throw new Error('Item deve ser uma instância de ItemBiblioteca');
        }
        
        this.#acervo.push(item);
        console.log(`${item.titulo} adicionado ao acervo da ${this.nome}`);
        return this;
    }
    
    buscarPorTitulo(titulo) {
        return this.#acervo.filter(item => 
            item.titulo.toLowerCase().includes(titulo.toLowerCase())
        );
    }
    
    buscarPorAutor(autor) {
        return this.#acervo.filter(item => 
            item.autor.toLowerCase().includes(autor.toLowerCase())
        );
    }
    
    buscarPorTipo(tipo) {
        const tipos = {
            'livro': Livro,
            'revista': Revista,
            'dvd': DVD
        };
        
        const TipoClasse = tipos[tipo.toLowerCase()];
        if (!TipoClasse) {
            throw new Error('Tipo inválido. Use: livro, revista ou dvd');
        }
        
        return this.#acervo.filter(item => item instanceof TipoClasse);
    }
    
    listarDisponiveis() {
        return this.#acervo.filter(item => item.disponivel);
    }
    
    listarEmprestados() {
        return this.#acervo.filter(item => !item.disponivel);
    }
    
    listarAtrasados() {
        return this.#acervo.filter(item => item.verificarAtraso() > 0);
    }
    
    obterEstatisticas() {
        const total = this.#acervo.length;
        const disponiveis = this.listarDisponiveis().length;
        const emprestados = this.listarEmprestados().length;
        const atrasados = this.listarAtrasados().length;
        
        const porTipo = {
            livros: this.buscarPorTipo('livro').length,
            revistas: this.buscarPorTipo('revista').length,
            dvds: this.buscarPorTipo('dvd').length
        };
        
        return {
            nome: this.nome,
            totalItens: total,
            disponiveis,
            emprestados,
            atrasados,
            porTipo,
            taxaOcupacao: ((emprestados / total) * 100).toFixed(1) + '%'
        };
    }
}

// Testando sistema de biblioteca
console.log('\n📚 Testando sistema de biblioteca:');

// Criando biblioteca
const biblioteca = new Biblioteca('Biblioteca Central', 'Rua das Letras, 123');

// Criando itens
const livro1 = new Livro(
    'Clean Code',
    'Robert C. Martin',
    2008,
    '978-0132350884',
    'Programação',
    464
);

const revista1 = new Revista(
    'National Geographic',
    'National Geographic Society',
    2023,
    'Edição 287',
    'Mensal'
);

const dvd1 = new DVD(
    'Matrix',
    'Lana e Lilly Wachowski',
    1999,
    'Ficção Científica',
    136
);

// Configurando itens
dvd1.adicionarLegenda('Português')
    .adicionarLegenda('Inglês')
    .adicionarLegenda('Espanhol')
    .definirClassificacao('14');

// Adicionando ao acervo
biblioteca.adicionarItem(livro1)
          .adicionarItem(revista1)
          .adicionarItem(dvd1);

// Realizando empréstimos
livro1.emprestar('Ana Silva', 21);
revista1.emprestar('Carlos Santos', 7);

console.log('\n📊 Informações dos itens:');
console.log('Livro:', livro1.obterInfo());
console.log('Revista:', revista1.obterInfo());
console.log('DVD:', dvd1.obterInfo());

console.log('\n📈 Estatísticas da biblioteca:');
console.log(biblioteca.obterEstatisticas());

// Buscas
console.log('\n🔍 Resultados de busca:');
console.log('Busca por "Clean":', biblioteca.buscarPorTitulo('Clean').map(item => item.titulo));
console.log('Busca por autor "Martin":', biblioteca.buscarPorAutor('Martin').map(item => item.titulo));
console.log('DVDs no acervo:', biblioteca.buscarPorTipo('dvd').map(item => item.titulo));

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA CLASSES ES6+:

1. **Use propriedades privadas (#) para encapsulamento real**
   - Evita acesso acidental a propriedades internas
   - Melhora a segurança e manutenibilidade
   - Permite mudanças internas sem quebrar código externo

2. **Prefira getters/setters para propriedades calculadas**
   - Evita armazenar valores que podem ser calculados
   - Permite validação automática
   - Mantém dados sempre atualizados

3. **Use métodos estáticos para funcionalidades utilitárias**
   - Não precisam de instância da classe
   - Organizam código relacionado
   - Melhoram performance (não criam contexto de instância)

4. **Implemente herança com cuidado**
   - Use composição quando herança não faz sentido
   - Evite hierarquias muito profundas
   - Prefira interfaces/mixins para múltipla herança

5. **Valide parâmetros no constructor**
   - Falhe rápido com erros claros
   - Use Object.freeze() para objetos imutáveis
   - Implemente validação consistente

6. **Use WeakMap para dados verdadeiramente privados (alternativa)**
   - Permite garbage collection automático
   - Não vaza memória
   - Compatível com versões antigas do JavaScript

7. **Implemente toString() e valueOf() quando apropriado**
   - Melhora debugging e logging
   - Facilita conversões automáticas
   - Torna objetos mais "JavaScript-friendly"

8. **Use Symbol.iterator para objetos iteráveis**
   - Permite uso com for...of
   - Integra com APIs nativas
   - Melhora experiência do desenvolvedor

9. **Considere usar decorators (quando disponível)**
   - Reduz código boilerplate
   - Melhora legibilidade
   - Facilita aspectos transversais (logging, validação)

10. **Otimize métodos frequentemente chamados**
    - Cache resultados quando possível
    - Evite criação desnecessária de objetos
    - Use técnicas de memoização
*/

// Exemplo de otimização com cache
class CalculadoraOtimizada {
    #cache = new Map();
    
    static fibonacci(n) {
        // Implementação otimizada com memoização
        const cache = CalculadoraOtimizada.#fibCache || (CalculadoraOtimizada.#fibCache = new Map());
        
        if (cache.has(n)) {
            return cache.get(n);
        }
        
        let result;
        if (n <= 1) {
            result = n;
        } else {
            result = CalculadoraOtimizada.fibonacci(n - 1) + CalculadoraOtimizada.fibonacci(n - 2);
        }
        
        cache.set(n, result);
        return result;
    }
    
    static #fibCache;
    
    calcularPotencia(base, expoente) {
        const chave = `${base}^${expoente}`;
        
        if (this.#cache.has(chave)) {
            console.log(`Cache hit para ${chave}`);
            return this.#cache.get(chave);
        }
        
        const resultado = Math.pow(base, expoente);
        this.#cache.set(chave, resultado);
        console.log(`Calculado e armazenado em cache: ${chave} = ${resultado}`);
        return resultado;
    }
    
    limparCache() {
        this.#cache.clear();
        console.log('Cache limpo');
        return this;
    }
    
    obterEstatisticasCache() {
        return {
            tamanho: this.#cache.size,
            chaves: Array.from(this.#cache.keys())
        };
    }
}

// Testando otimizações
console.log('\n⚡ Testando otimizações:');

const calc = new CalculadoraOtimizada();

// Testando cache
console.log('Primeira chamada 2^10:', calc.calcularPotencia(2, 10));
console.log('Segunda chamada 2^10:', calc.calcularPotencia(2, 10)); // Cache hit
console.log('Terceira chamada 3^5:', calc.calcularPotencia(3, 5));
console.log('Quarta chamada 2^10:', calc.calcularPotencia(2, 10)); // Cache hit

console.log('Estatísticas do cache:', calc.obterEstatisticasCache());

// Testando Fibonacci otimizado
console.log('\n🔢 Fibonacci otimizado:');
console.time('Fibonacci 40');
console.log('Fibonacci(40):', CalculadoraOtimizada.fibonacci(40));
console.timeEnd('Fibonacci 40');

// Segunda chamada (com cache)
console.time('Fibonacci 40 (cached)');
console.log('Fibonacci(40) cached:', CalculadoraOtimizada.fibonacci(40));
console.timeEnd('Fibonacci 40 (cached)');

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Classes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
- MDN Private Fields: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields
- MDN Static Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static

📚 LIVROS RECOMENDADOS:
- "You Don't Know JS: this & Object Prototypes" - Kyle Simpson
- "Effective JavaScript" - David Herman
- "JavaScript: The Good Parts" - Douglas Crockford

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Mixins e composição
2. Decorators (TC39 proposal)
3. Padrões de design com classes
4. Metaprogramação com Proxy
5. Symbols e Well-known Symbols
6. WeakMap e WeakSet para dados privados
7. Generators e Iterators
8. Async/Await em classes

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente um sistema de cache com TTL usando classes
2. Crie um ORM simples usando classes e Proxy
3. Desenvolva um sistema de eventos com classes
4. Implemente padrões como Observer, Factory, Singleton
5. Crie um sistema de validação usando decorators

🔧 FERRAMENTAS ÚTEIS:
- TypeScript para tipagem estática
- Babel para transpilação
- ESLint para linting
- Jest para testes
- Webpack para bundling

⚠️ ARMADILHAS COMUNS:
1. Confundir classes com protótipos
2. Usar herança quando composição seria melhor
3. Não validar parâmetros no constructor
4. Expor propriedades que deveriam ser privadas
5. Criar hierarquias muito profundas
6. Não implementar métodos toString/valueOf
7. Usar this incorretamente em callbacks
8. Não considerar performance em métodos frequentes

🎓 CONCEITOS AVANÇADOS:
- Metaclasses e metaprogramação
- Aspect-Oriented Programming
- Dependency Injection
- Inversion of Control
- SOLID principles aplicados a JavaScript
*/

console.log('\n✅ Módulo de Classes ES6+ concluído!');
console.log('📝 Próximo módulo: 04-destructuring.js');
console.log('🎯 Continue praticando com os exercícios propostos!');

/*
==============================================
RESUMO DO MÓDULO - CLASSES ES6+
==============================================

✅ CONCEITOS APRENDIDOS:
- Sintaxe de classes ES6+
- Constructor e métodos de instância
- Getters e setters
- Métodos estáticos
- Herança com extends e super
- Propriedades privadas (#)
- Encapsulamento e abstração
- Polimorfismo em JavaScript
- Padrões de design com classes
- Otimizações e boas práticas

🎯 HABILIDADES DESENVOLVIDAS:
- Criar classes bem estruturadas
- Implementar herança eficiente
- Usar encapsulamento adequadamente
- Aplicar padrões de design
- Otimizar performance de classes
- Debuggar problemas com classes
- Escrever código orientado a objetos

📈 PRÓXIMOS DESAFIOS:
- Destructuring e spread operator
- Padrões avançados de design
- Metaprogramação
- Programação funcional vs OOP
- Arquiteturas escaláveis

==============================================
*/