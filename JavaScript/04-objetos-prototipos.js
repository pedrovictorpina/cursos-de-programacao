/*
===========================================
    CURSO JAVASCRIPT - OBJETOS E PROTÓTIPOS
===========================================

Este arquivo aborda:
- Criação e manipulação de objetos
- Propriedades e métodos
- Destructuring de objetos
- Protótipos e herança
- Classes (ES6+)
- Métodos estáticos
- Getters e Setters
- Object.create() e Object.assign()
- Exemplos práticos avançados
*/

// ========================================
// 1. CRIAÇÃO DE OBJETOS
// ========================================

// Objeto literal (forma mais comum)
const pessoa = {
    nome: "João",
    idade: 30,
    profissao: "Desenvolvedor",
    
    // Método do objeto
    apresentar: function() {
        return `Olá, eu sou ${this.nome} e tenho ${this.idade} anos.`;
    },
    
    // Método com sintaxe ES6 (mais limpa)
    trabalhar() {
        return `${this.nome} está trabalhando como ${this.profissao}.`;
    }
};

console.log(pessoa.nome); // "João"
console.log(pessoa.apresentar()); // "Olá, eu sou João e tenho 30 anos."

// Objeto usando construtor Object()
const carro = new Object();
carro.marca = "Toyota";
carro.modelo = "Corolla";
carro.ano = 2023;

// Função construtora (padrão antigo)
function Produto(nome, preco) {
    this.nome = nome;
    this.preco = preco;
    this.desconto = 0;
    
    this.aplicarDesconto = function(percentual) {
        this.desconto = percentual;
        return this.preco * (1 - percentual / 100);
    };
}

const notebook = new Produto("Notebook Dell", 2500);
console.log(notebook.aplicarDesconto(10)); // 2250

// ========================================
// 2. PROPRIEDADES E MÉTODOS
// ========================================

// Acessando propriedades
console.log(pessoa.nome);        // Notação de ponto
console.log(pessoa["idade"]);    // Notação de colchetes

// Propriedades dinâmicas
const propriedade = "profissao";
console.log(pessoa[propriedade]); // "Desenvolvedor"

// Adicionando propriedades dinamicamente
pessoa.email = "joao@email.com";
pessoa["telefone"] = "(11) 99999-9999";

// Verificando se propriedade existe
console.log("nome" in pessoa);           // true
console.log(pessoa.hasOwnProperty("nome")); // true

// Listando propriedades
console.log(Object.keys(pessoa));   // Array com as chaves
console.log(Object.values(pessoa)); // Array com os valores
console.log(Object.entries(pessoa)); // Array com [chave, valor]

// Removendo propriedades
delete pessoa.telefone;

// ========================================
// 3. DESTRUCTURING DE OBJETOS
// ========================================

// Destructuring básico
const { nome, idade } = pessoa;
console.log(nome, idade); // "João" 30

// Destructuring com renomeação
const { nome: nomeCompleto, profissao: cargo } = pessoa;
console.log(nomeCompleto, cargo); // "João" "Desenvolvedor"

// Destructuring com valores padrão
const { salario = 5000, bonus = 0 } = pessoa;
console.log(salario, bonus); // 5000 0

// Destructuring aninhado
const empresa = {
    nome: "TechCorp",
    endereco: {
        rua: "Rua das Flores, 123",
        cidade: "São Paulo",
        cep: "01234-567"
    }
};

const { endereco: { cidade, cep } } = empresa;
console.log(cidade, cep); // "São Paulo" "01234-567"

// ========================================
// 4. PROTÓTIPOS E HERANÇA
// ========================================

// Todo objeto em JavaScript tem um protótipo
console.log(pessoa.__proto__); // Object.prototype
console.log(Object.getPrototypeOf(pessoa)); // Forma recomendada

// Adicionando métodos ao protótipo
Produto.prototype.calcularImposto = function(taxa) {
    return this.preco * (taxa / 100);
};

// Agora todos os produtos têm este método
console.log(notebook.calcularImposto(18)); // 450

// Herança com protótipos
function ProdutoEletronico(nome, preco, garantia) {
    Produto.call(this, nome, preco); // Chama o construtor pai
    this.garantia = garantia;
}

// Configurando a herança
ProdutoEletronico.prototype = Object.create(Produto.prototype);
ProdutoEletronico.prototype.constructor = ProdutoEletronico;

// Adicionando método específico
ProdutoEletronico.prototype.verificarGarantia = function() {
    return `Garantia de ${this.garantia} meses para ${this.nome}`;
};

const smartphone = new ProdutoEletronico("iPhone 15", 5000, 12);
console.log(smartphone.verificarGarantia()); // "Garantia de 12 meses para iPhone 15"
console.log(smartphone.aplicarDesconto(15)); // 4250 (método herdado)

// ========================================
// 5. CLASSES (ES6+)
// ========================================

// Sintaxe de classe (mais moderna e limpa)
class Animal {
    constructor(nome, especie) {
        this.nome = nome;
        this.especie = especie;
        this.energia = 100;
    }
    
    // Método da instância
    comer(alimento) {
        this.energia += 20;
        return `${this.nome} comeu ${alimento} e ganhou energia!`;
    }
    
    // Método da instância
    dormir(horas) {
        this.energia += horas * 10;
        return `${this.nome} dormiu ${horas}h e recuperou energia.`;
    }
    
    // Getter
    get status() {
        if (this.energia > 80) return "Muito bem";
        if (this.energia > 50) return "Bem";
        if (this.energia > 20) return "Cansado";
        return "Exausto";
    }
    
    // Setter
    set energia(valor) {
        if (valor < 0) {
            this._energia = 0;
        } else if (valor > 100) {
            this._energia = 100;
        } else {
            this._energia = valor;
        }
    }
    
    get energia() {
        return this._energia;
    }
    
    // Método estático
    static criarAnimalAleatorio() {
        const nomes = ["Rex", "Miau", "Piu", "Nemo"];
        const especies = ["Cão", "Gato", "Pássaro", "Peixe"];
        
        const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)];
        const especieAleatoria = especies[Math.floor(Math.random() * especies.length)];
        
        return new Animal(nomeAleatorio, especieAleatoria);
    }
}

const dog = new Animal("Rex", "Cão");
console.log(dog.comer("ração")); // "Rex comeu ração e ganhou energia!"
console.log(dog.status); // "Muito bem"

// Usando método estático
const animalAleatorio = Animal.criarAnimalAleatorio();
console.log(animalAleatorio);

// ========================================
// 6. HERANÇA COM CLASSES
// ========================================

class Cachorro extends Animal {
    constructor(nome, raca) {
        super(nome, "Cão"); // Chama o construtor da classe pai
        this.raca = raca;
        this.truques = [];
    }
    
    // Sobrescrevendo método da classe pai
    comer(alimento) {
        const resultado = super.comer(alimento); // Chama método da classe pai
        return resultado + " Au au!";
    }
    
    // Método específico da classe filha
    aprenderTruque(truque) {
        this.truques.push(truque);
        return `${this.nome} aprendeu: ${truque}`;
    }
    
    // Método específico
    executarTruque() {
        if (this.truques.length === 0) {
            return `${this.nome} ainda não sabe truques.`;
        }
        
        const truqueAleatorio = this.truques[Math.floor(Math.random() * this.truques.length)];
        return `${this.nome} executou: ${truqueAleatorio}`;
    }
}

const labrador = new Cachorro("Buddy", "Labrador");
console.log(labrador.comer("petisco")); // "Buddy comeu petisco e ganhou energia! Au au!"
console.log(labrador.aprenderTruque("sentar")); // "Buddy aprendeu: sentar"
console.log(labrador.aprenderTruque("rolar")); // "Buddy aprendeu: rolar"
console.log(labrador.executarTruque()); // "Buddy executou: sentar" (ou "rolar")

// ========================================
// 7. OBJECT.CREATE() E OBJECT.ASSIGN()
// ========================================

// Object.create() - cria objeto com protótipo específico
const prototipoPessoa = {
    cumprimentar() {
        return `Olá, eu sou ${this.nome}`;
    },
    
    aniversario() {
        this.idade++;
        return `${this.nome} agora tem ${this.idade} anos!`;
    }
};

const maria = Object.create(prototipoPessoa);
maria.nome = "Maria";
maria.idade = 25;

console.log(maria.cumprimentar()); // "Olá, eu sou Maria"
console.log(maria.aniversario()); // "Maria agora tem 26 anos!"

// Object.assign() - copia propriedades de um ou mais objetos
const dadosBasicos = { nome: "Pedro", idade: 28 };
const dadosProfissionais = { profissao: "Designer", salario: 4000 };
const dadosContato = { email: "pedro@email.com", telefone: "(11) 88888-8888" };

// Mesclando objetos
const perfilCompleto = Object.assign({}, dadosBasicos, dadosProfissionais, dadosContato);
console.log(perfilCompleto);

// Sintaxe spread (ES6+) - mais moderna
const perfilComSpread = { ...dadosBasicos, ...dadosProfissionais, ...dadosContato };
console.log(perfilComSpread);

// ========================================
// 8. EXEMPLO PRÁTICO: SISTEMA DE BIBLIOTECA
// ========================================

class Livro {
    constructor(titulo, autor, isbn, anoPublicacao) {
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
        this.anoPublicacao = anoPublicacao;
        this.disponivel = true;
        this.historicoEmprestimos = [];
    }
    
    get idade() {
        return new Date().getFullYear() - this.anoPublicacao;
    }
    
    get informacoes() {
        return `"${this.titulo}" por ${this.autor} (${this.anoPublicacao})`;
    }
    
    emprestar(usuario) {
        if (!this.disponivel) {
            throw new Error(`Livro "${this.titulo}" não está disponível`);
        }
        
        this.disponivel = false;
        this.historicoEmprestimos.push({
            usuario,
            dataEmprestimo: new Date(),
            dataDevolucao: null
        });
        
        return `Livro "${this.titulo}" emprestado para ${usuario}`;
    }
    
    devolver() {
        if (this.disponivel) {
            throw new Error(`Livro "${this.titulo}" já está disponível`);
        }
        
        this.disponivel = true;
        const ultimoEmprestimo = this.historicoEmprestimos[this.historicoEmprestimos.length - 1];
        ultimoEmprestimo.dataDevolucao = new Date();
        
        return `Livro "${this.titulo}" devolvido com sucesso`;
    }
}

class Biblioteca {
    constructor(nome) {
        this.nome = nome;
        this.livros = [];
        this.usuarios = new Set();
    }
    
    adicionarLivro(livro) {
        if (!(livro instanceof Livro)) {
            throw new Error("Apenas instâncias de Livro podem ser adicionadas");
        }
        
        this.livros.push(livro);
        return `Livro "${livro.titulo}" adicionado à biblioteca`;
    }
    
    buscarLivro(termo) {
        return this.livros.filter(livro => 
            livro.titulo.toLowerCase().includes(termo.toLowerCase()) ||
            livro.autor.toLowerCase().includes(termo.toLowerCase())
        );
    }
    
    livrosDisponiveis() {
        return this.livros.filter(livro => livro.disponivel);
    }
    
    livrosEmprestados() {
        return this.livros.filter(livro => !livro.disponivel);
    }
    
    cadastrarUsuario(nome) {
        this.usuarios.add(nome);
        return `Usuário ${nome} cadastrado com sucesso`;
    }
    
    get estatisticas() {
        return {
            totalLivros: this.livros.length,
            livrosDisponiveis: this.livrosDisponiveis().length,
            livrosEmprestados: this.livrosEmprestados().length,
            totalUsuarios: this.usuarios.size
        };
    }
}

// Testando o sistema
const bibliotecaCentral = new Biblioteca("Biblioteca Central");

const livro1 = new Livro("1984", "George Orwell", "978-0451524935", 1949);
const livro2 = new Livro("Dom Casmurro", "Machado de Assis", "978-8525406958", 1899);
const livro3 = new Livro("O Cortiço", "Aluísio Azevedo", "978-8508133024", 1890);

bibliotecaCentral.adicionarLivro(livro1);
bibliotecaCentral.adicionarLivro(livro2);
bibliotecaCentral.adicionarLivro(livro3);

bibliotecaCentral.cadastrarUsuario("Ana Silva");
bibliotecaCentral.cadastrarUsuario("Carlos Santos");

console.log(livro1.emprestar("Ana Silva"));
console.log(bibliotecaCentral.estatisticas);

// ========================================
// 9. EXERCÍCIOS PROPOSTOS
// ========================================

/*
EXERCÍCIO 1: Sistema de Conta Bancária
Crie uma classe ContaBancaria com:
- Propriedades: numero, titular, saldo, tipo
- Métodos: depositar(), sacar(), transferir(), consultarSaldo()
- Getter para status da conta (ativa/inativa baseado no saldo)
- Histórico de transações

EXERCÍCIO 2: Herança de Veículos
Crie uma classe base Veiculo e classes filhas Carro, Moto, Bicicleta
- Cada uma com características específicas
- Métodos para acelerar, frear, ligar/desligar (quando aplicável)
- Calcular consumo de combustível (quando aplicável)

EXERCÍCIO 3: Sistema de E-commerce
Crie classes para:
- Produto (nome, preço, categoria, estoque)
- CarrinhoCompras (adicionar/remover produtos, calcular total)
- Cliente (dados pessoais, histórico de compras)
- Pedido (produtos, cliente, status, data)

EXERCÍCIO 4: Jogo de RPG Simples
Crie um sistema com:
- Classe Personagem (nome, vida, mana, força, defesa)
- Classes filhas: Guerreiro, Mago, Arqueiro
- Sistema de combate entre personagens
- Sistema de level up e atributos

EXERCÍCIO 5: Agenda de Contatos
Crie um sistema que permita:
- Adicionar, editar, remover contatos
- Buscar contatos por nome, telefone ou email
- Agrupar contatos por categoria
- Exportar contatos para diferentes formatos
*/

// ========================================
// 10. BOAS PRÁTICAS E DICAS
// ========================================

/*
BOAS PRÁTICAS:

1. NOMENCLATURA:
   - Use nomes descritivos para propriedades e métodos
   - Classes começam com letra maiúscula (PascalCase)
   - Propriedades e métodos em camelCase
   - Constantes em UPPER_CASE

2. ENCAPSULAMENTO:
   - Use # para propriedades privadas (ES2022+)
   - Prefixe com _ propriedades "privadas" por convenção
   - Use getters e setters para controlar acesso

3. HERANÇA:
   - Prefira composição sobre herança quando possível
   - Use super() adequadamente em construtores
   - Não crie hierarquias muito profundas

4. PERFORMANCE:
   - Evite criar métodos dentro do constructor
   - Use Object.freeze() para objetos imutáveis
   - Considere Object.seal() para objetos semi-imutáveis

5. VALIDAÇÃO:
   - Sempre valide parâmetros em métodos públicos
   - Use instanceof para verificar tipos
   - Implemente tratamento de erros adequado

6. DOCUMENTAÇÃO:
   - Comente código complexo
   - Use JSDoc para documentar classes e métodos
   - Mantenha exemplos de uso atualizados

DICAS IMPORTANTES:
- O 'this' em JavaScript pode ser confuso - estude seu comportamento
- Arrow functions não têm seu próprio 'this'
- Use bind(), call() ou apply() quando necessário
- Protótipos são poderosos, mas classes são mais legíveis
- Sempre considere a imutabilidade quando apropriado
*/

console.log("\n=== ARQUIVO 04: OBJETOS E PROTÓTIPOS CONCLUÍDO ===");
console.log("Próximo: 05-arrays-metodos.js");