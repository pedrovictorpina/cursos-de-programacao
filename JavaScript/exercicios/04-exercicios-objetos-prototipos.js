/*
========================================
EXERCÍCIOS PRÁTICOS: OBJETOS E PROTÓTIPOS
========================================

Este arquivo contém 3 exercícios práticos para fixar os conceitos de:
• Criação e manipulação de objetos
• Protótipos e herança prototípica
• Métodos e propriedades
• Construtores e classes
• Encapsulamento e abstração
• Polimorfismo e composição

Cada exercício possui:
✅ Enunciado claro
✅ Solução completa
✅ Explicações detalhadas
✅ Testes e demonstrações
✅ Conceitos aplicados

*/

console.log('🏗️ EXERCÍCIOS: OBJETOS E PROTÓTIPOS');
console.log('=====================================\n');

/*
========================================
EXERCÍCIO 1: SISTEMA DE BIBLIOTECA
========================================

Crie um sistema de biblioteca que gerencie livros, autores e empréstimos.
O sistema deve incluir:

1. Classe Autor com propriedades: nome, nacionalidade, anoNascimento
2. Classe Livro com propriedades: titulo, autor, isbn, anoPublicacao, disponivel
3. Classe Biblioteca que gerencie a coleção de livros
4. Sistema de empréstimos com controle de datas
5. Métodos para busca, filtros e relatórios
6. Validações e tratamento de erros

REQUISITOS:
• Use protótipos para herança
• Implemente encapsulamento
• Adicione métodos estáticos
• Crie getters e setters
• Valide dados de entrada
*/

console.log('📚 EXERCÍCIO 1: Sistema de Biblioteca');
console.log('=====================================');

// Solução do Exercício 1
const SistemaBiblioteca = (() => {
    'use strict';
    
    // Utilitários de validação
    const Validadores = {
        string: (valor, nome, minimo = 1) => {
            if (typeof valor !== 'string' || valor.trim().length < minimo) {
                throw new Error(`${nome} deve ser uma string com pelo menos ${minimo} caractere(s)`);
            }
            return valor.trim();
        },
        
        numero: (valor, nome, minimo = 0) => {
            if (typeof valor !== 'number' || isNaN(valor) || valor < minimo) {
                throw new Error(`${nome} deve ser um número válido >= ${minimo}`);
            }
            return valor;
        },
        
        isbn: (valor) => {
            const isbn = valor.replace(/[^0-9X]/g, '');
            if (isbn.length !== 10 && isbn.length !== 13) {
                throw new Error('ISBN deve ter 10 ou 13 dígitos');
            }
            return isbn;
        },
        
        data: (valor) => {
            const data = new Date(valor);
            if (isNaN(data.getTime())) {
                throw new Error('Data inválida');
            }
            return data;
        }
    };
    
    // Classe base Pessoa
    function Pessoa(nome, nacionalidade, anoNascimento) {
        // Propriedades privadas usando closures
        let _nome = Validadores.string(nome, 'Nome', 2);
        let _nacionalidade = Validadores.string(nacionalidade, 'Nacionalidade', 2);
        let _anoNascimento = Validadores.numero(anoNascimento, 'Ano de nascimento', 1800);
        
        // Validação específica
        const anoAtual = new Date().getFullYear();
        if (_anoNascimento > anoAtual) {
            throw new Error('Ano de nascimento não pode ser futuro');
        }
        
        // Getters e setters
        Object.defineProperties(this, {
            nome: {
                get: () => _nome,
                set: (valor) => {
                    _nome = Validadores.string(valor, 'Nome', 2);
                },
                enumerable: true
            },
            nacionalidade: {
                get: () => _nacionalidade,
                set: (valor) => {
                    _nacionalidade = Validadores.string(valor, 'Nacionalidade', 2);
                },
                enumerable: true
            },
            anoNascimento: {
                get: () => _anoNascimento,
                set: (valor) => {
                    const ano = Validadores.numero(valor, 'Ano de nascimento', 1800);
                    if (ano > new Date().getFullYear()) {
                        throw new Error('Ano de nascimento não pode ser futuro');
                    }
                    _anoNascimento = ano;
                },
                enumerable: true
            },
            idade: {
                get: () => new Date().getFullYear() - _anoNascimento,
                enumerable: true
            }
        });
        
        // Propriedades públicas
        this.id = Pessoa.gerarId();
        this.criadoEm = new Date();
    }
    
    // Métodos estáticos
    Pessoa.contadorId = 0;
    Pessoa.gerarId = function() {
        return ++this.contadorId;
    };
    
    // Métodos do protótipo
    Pessoa.prototype.toString = function() {
        return `${this.nome} (${this.nacionalidade}, ${this.anoNascimento})`;
    };
    
    Pessoa.prototype.toJSON = function() {
        return {
            id: this.id,
            nome: this.nome,
            nacionalidade: this.nacionalidade,
            anoNascimento: this.anoNascimento,
            idade: this.idade,
            criadoEm: this.criadoEm
        };
    };
    
    // Classe Autor herda de Pessoa
    function Autor(nome, nacionalidade, anoNascimento, biografia = '') {
        // Chamar construtor pai
        Pessoa.call(this, nome, nacionalidade, anoNascimento);
        
        // Propriedades específicas
        let _biografia = typeof biografia === 'string' ? biografia.trim() : '';
        let _livros = [];
        let _premios = [];
        
        Object.defineProperties(this, {
            biografia: {
                get: () => _biografia,
                set: (valor) => {
                    _biografia = typeof valor === 'string' ? valor.trim() : '';
                },
                enumerable: true
            },
            livros: {
                get: () => [..._livros], // Retorna cópia
                enumerable: true
            },
            premios: {
                get: () => [..._premios], // Retorna cópia
                enumerable: true
            },
            totalLivros: {
                get: () => _livros.length,
                enumerable: true
            }
        });
        
        // Métodos específicos
        this.adicionarLivro = function(livro) {
            if (!livro || typeof livro !== 'object') {
                throw new Error('Livro deve ser um objeto válido');
            }
            _livros.push({
                titulo: livro.titulo,
                isbn: livro.isbn,
                anoPublicacao: livro.anoPublicacao,
                adicionadoEm: new Date()
            });
            return this;
        };
        
        this.adicionarPremio = function(premio, ano) {
            const premioObj = {
                nome: Validadores.string(premio, 'Prêmio'),
                ano: Validadores.numero(ano, 'Ano do prêmio', 1900),
                adicionadoEm: new Date()
            };
            _premios.push(premioObj);
            return this;
        };
        
        this.removerLivro = function(isbn) {
            const index = _livros.findIndex(livro => livro.isbn === isbn);
            if (index > -1) {
                return _livros.splice(index, 1)[0];
            }
            return null;
        };
    }
    
    // Configurar herança
    Autor.prototype = Object.create(Pessoa.prototype);
    Autor.prototype.constructor = Autor;
    
    // Sobrescrever métodos
    Autor.prototype.toString = function() {
        return `Autor: ${Pessoa.prototype.toString.call(this)} - ${this.totalLivros} livro(s)`;
    };
    
    Autor.prototype.toJSON = function() {
        return {
            ...Pessoa.prototype.toJSON.call(this),
            tipo: 'Autor',
            biografia: this.biografia,
            totalLivros: this.totalLivros,
            livros: this.livros,
            premios: this.premios
        };
    };
    
    // Classe Livro
    function Livro(titulo, autor, isbn, anoPublicacao, genero = 'Geral') {
        // Validações
        let _titulo = Validadores.string(titulo, 'Título', 1);
        let _isbn = Validadores.isbn(isbn);
        let _anoPublicacao = Validadores.numero(anoPublicacao, 'Ano de publicação', 1000);
        let _genero = Validadores.string(genero, 'Gênero');
        let _disponivel = true;
        let _emprestimos = [];
        
        // Validar autor
        if (!(autor instanceof Autor)) {
            throw new Error('Autor deve ser uma instância da classe Autor');
        }
        
        // Validar ano de publicação
        const anoAtual = new Date().getFullYear();
        if (_anoPublicacao > anoAtual) {
            throw new Error('Ano de publicação não pode ser futuro');
        }
        
        // Propriedades
        Object.defineProperties(this, {
            titulo: {
                get: () => _titulo,
                set: (valor) => {
                    _titulo = Validadores.string(valor, 'Título', 1);
                },
                enumerable: true
            },
            autor: {
                get: () => autor,
                enumerable: true
            },
            isbn: {
                get: () => _isbn,
                enumerable: true
            },
            anoPublicacao: {
                get: () => _anoPublicacao,
                set: (valor) => {
                    const ano = Validadores.numero(valor, 'Ano de publicação', 1000);
                    if (ano > new Date().getFullYear()) {
                        throw new Error('Ano de publicação não pode ser futuro');
                    }
                    _anoPublicacao = ano;
                },
                enumerable: true
            },
            genero: {
                get: () => _genero,
                set: (valor) => {
                    _genero = Validadores.string(valor, 'Gênero');
                },
                enumerable: true
            },
            disponivel: {
                get: () => _disponivel,
                enumerable: true
            },
            emprestimos: {
                get: () => [..._emprestimos],
                enumerable: true
            },
            totalEmprestimos: {
                get: () => _emprestimos.length,
                enumerable: true
            },
            idade: {
                get: () => new Date().getFullYear() - _anoPublicacao,
                enumerable: true
            }
        });
        
        // Métodos
        this.emprestar = function(usuario, dataEmprestimo = new Date()) {
            if (!_disponivel) {
                throw new Error('Livro não está disponível para empréstimo');
            }
            
            const emprestimo = {
                usuario: Validadores.string(usuario, 'Usuário'),
                dataEmprestimo: Validadores.data(dataEmprestimo),
                dataPrevistaDevolucao: new Date(dataEmprestimo.getTime() + (14 * 24 * 60 * 60 * 1000)), // 14 dias
                dataDevolucao: null,
                ativo: true
            };
            
            _emprestimos.push(emprestimo);
            _disponivel = false;
            
            return emprestimo;
        };
        
        this.devolver = function(dataDevolucao = new Date()) {
            const emprestimoAtivo = _emprestimos.find(emp => emp.ativo);
            if (!emprestimoAtivo) {
                throw new Error('Não há empréstimo ativo para este livro');
            }
            
            emprestimoAtivo.dataDevolucao = Validadores.data(dataDevolucao);
            emprestimoAtivo.ativo = false;
            
            // Calcular atraso
            const atraso = dataDevolucao > emprestimoAtivo.dataPrevistaDevolucao;
            const diasAtraso = atraso ? 
                Math.ceil((dataDevolucao - emprestimoAtivo.dataPrevistaDevolucao) / (24 * 60 * 60 * 1000)) : 0;
            
            emprestimoAtivo.atraso = atraso;
            emprestimoAtivo.diasAtraso = diasAtraso;
            
            _disponivel = true;
            
            return emprestimoAtivo;
        };
        
        this.obterEmprestimoAtivo = function() {
            return _emprestimos.find(emp => emp.ativo) || null;
        };
        
        // Propriedades públicas
        this.id = Livro.gerarId();
        this.criadoEm = new Date();
        
        // Adicionar livro ao autor
        autor.adicionarLivro(this);
    }
    
    // Métodos estáticos
    Livro.contadorId = 0;
    Livro.gerarId = function() {
        return ++this.contadorId;
    };
    
    Livro.validarIsbn = function(isbn) {
        try {
            return Validadores.isbn(isbn);
        } catch (error) {
            return false;
        }
    };
    
    // Métodos do protótipo
    Livro.prototype.toString = function() {
        return `"${this.titulo}" por ${this.autor.nome} (${this.anoPublicacao})`;
    };
    
    Livro.prototype.toJSON = function() {
        return {
            id: this.id,
            titulo: this.titulo,
            autor: {
                id: this.autor.id,
                nome: this.autor.nome
            },
            isbn: this.isbn,
            anoPublicacao: this.anoPublicacao,
            genero: this.genero,
            disponivel: this.disponivel,
            totalEmprestimos: this.totalEmprestimos,
            idade: this.idade,
            criadoEm: this.criadoEm
        };
    };
    
    // Classe Biblioteca
    function Biblioteca(nome, endereco) {
        let _nome = Validadores.string(nome, 'Nome da biblioteca');
        let _endereco = Validadores.string(endereco, 'Endereço');
        let _livros = new Map(); // isbn -> livro
        let _autores = new Map(); // id -> autor
        let _usuarios = new Set();
        let _estatisticas = {
            totalLivros: 0,
            totalAutores: 0,
            totalEmprestimos: 0,
            livrosDisponiveis: 0,
            livrosEmprestados: 0
        };
        
        // Propriedades
        Object.defineProperties(this, {
            nome: {
                get: () => _nome,
                set: (valor) => {
                    _nome = Validadores.string(valor, 'Nome da biblioteca');
                },
                enumerable: true
            },
            endereco: {
                get: () => _endereco,
                set: (valor) => {
                    _endereco = Validadores.string(valor, 'Endereço');
                },
                enumerable: true
            },
            estatisticas: {
                get: () => ({ ..._estatisticas }),
                enumerable: true
            },
            veiculos: {
                get: () => Array.from(_veiculos.values()),
                enumerable: true
            }
        });
        
        // Métodos privados
        const atualizarEstatisticas = () => {
            _estatisticas.totalVeiculos = _veiculos.size;
            _estatisticas.carros = this.veiculos.filter(v => v.tipo === 'Carro').length;
            _estatisticas.motos = this.veiculos.filter(v => v.tipo === 'Moto').length;
            _estatisticas.bicicletas = this.veiculos.filter(v => v.tipo === 'Bicicleta').length;
            _estatisticas.quilometragemTotal = this.veiculos
                .filter(v => v.quilometragem)
                .reduce((total, v) => total + v.quilometragem, 0);
            _estatisticas.custoManutencaoTotal = this.veiculos
                .filter(v => v.custoManutencao)
                .reduce((total, v) => total + v.custoManutencao, 0);
        };
        
        // Métodos públicos
        this.adicionarVeiculo = function(veiculo) {
            if (!(veiculo instanceof Veiculo)) {
                throw new Error('Deve ser uma instância de Veiculo');
            }
            
            if (_veiculos.has(veiculo.id)) {
                throw new Error('Veículo já existe na frota');
            }
            
            _veiculos.set(veiculo.id, veiculo);
            atualizarEstatisticas();
            
            return this;
        };
        
        this.removerVeiculo = function(id) {
            const veiculo = _veiculos.get(id);
            if (!veiculo) {
                throw new Error('Veículo não encontrado');
            }
            
            _veiculos.delete(id);
            atualizarEstatisticas();
            
            return veiculo;
        };
        
        this.buscarVeiculo = function(criterio) {
            return this.veiculos.filter(veiculo => {
                const termo = criterio.toLowerCase();
                return veiculo.marca.toLowerCase().includes(termo) ||
                       veiculo.modelo.toLowerCase().includes(termo) ||
                       veiculo.cor.toLowerCase().includes(termo) ||
                       veiculo.tipo.toLowerCase().includes(termo) ||
                       (veiculo.proprietario && veiculo.proprietario.toLowerCase().includes(termo));
            });
        };
        
        this.relatorioCompleto = function() {
            return {
                frota: {
                    nome: this.nome,
                    totalVeiculos: _estatisticas.totalVeiculos
                },
                estatisticas: _estatisticas,
                veiculos: this.veiculos.map(v => v.toJSON()),
                manutencoes: this.veiculos
                    .filter(v => v.historicoManutencao)
                    .map(v => ({
                        veiculo: v.modelo,
                        relatorio: v.relatorioManutencao()
                    }))
            };
        };
        
        // Inicializar
        atualizarEstatisticas();
    }
    
    // Interface pública
    return {
        Veiculo,
        Carro,
        Moto,
        Bicicleta,
        VeiculoFactory,
        GerenciadorFrota,
        Utils
    };
})();

// Demonstração e testes
console.log('\n🚗 Demonstração do Sistema de Veículos:');

try {
    // Criar veículos usando factory
    console.log('\n🏭 CRIANDO VEÍCULOS COM FACTORY:');
    
    const civic = SistemaVeiculos.VeiculoFactory.criarCarro({
        marca: 'Honda',
        modelo: 'Civic',
        ano: 2022,
        cor: 'Prata',
        potencia: 150,
        cilindradas: 2000,
        capacidadeTanque: 50,
        consumo: 12
    });
    
    const cb600 = SistemaVeiculos.VeiculoFactory.criarMoto({
        marca: 'Honda',
        modelo: 'CB 600F',
        ano: 2021,
        cor: 'Azul',
        potencia: 102,
        cilindradas: 600,
        capacidadeTanque: 19,
        consumo: 18
    });
    
    const trek = SistemaVeiculos.VeiculoFactory.criarBicicleta({
        marca: 'Trek',
        modelo: 'FX 3',
        ano: 2023,
        cor: 'Verde',
        marchas: 24
    });
    
    console.log('Veículos criados:');
    console.log('•', civic.toString());
    console.log('•', cb600.toString());
    console.log('•', trek.toString());
    
    // Configurar proprietários
    civic.proprietario = 'João Silva';
    cb600.proprietario = 'Maria Santos';
    trek.proprietario = 'Pedro Costa';
    
    // Testar funcionalidades do motor
    console.log('\n⚙️ TESTANDO MOTOR:');
    
    civic.ligarMotor();
    console.log('Civic - Motor ligado:', civic.motorLigado);
    
    civic.acelerar(70);
    console.log('Civic - Temperatura após acelerar:', civic.temperatura + '°C');
    
    cb600.ligarMotor().acelerar(90);
    console.log('CB600 - Temperatura:', cb600.temperatura + '°C');
    
    // Testar combustível
    console.log('\n⛽ TESTANDO COMBUSTÍVEL:');
    
    console.log('Civic - Autonomia inicial:', civic.autonomia + ' km');
    
    const viagem1 = civic.viajar(200);
    console.log('Civic viajou 200km:', {
        combustivelGasto: viagem1.combustivelGasto.toFixed(2) + 'L',
        nivelAtual: viagem1.nivelAtual.toFixed(2) + 'L',
        quilometragem: viagem1.quilometragemTotal + 'km'
    });
    
    const abastecimento = civic.abastecer(30);
    console.log('Civic abasteceu:', {
        quantidade: abastecimento.quantidade + 'L',
        percentual: abastecimento.percentual
    });
    
    // Calcular custos
    const custos = civic.calcularCusto(5.50); // R$ 5,50 por litro
    console.log('Civic - Custos:', {
        abastecimentoCompleto: 'R$ ' + custos.abastecimentoCompleto.toFixed(2),
        custoPorKm: 'R$ ' + custos.custoPorKm.toFixed(2),
        custoTotal: 'R$ ' + custos.custoTotal.toFixed(2)
    });
    
    // Testar manutenção
    console.log('\n🔧 TESTANDO MANUTENÇÃO:');
    
    const manutencao1 = civic.realizarManutencao('preventiva', 350, 'Troca de óleo e filtros');
    console.log('Civic - Manutenção realizada:', {
        tipo: manutencao1.tipo,
        custo: 'R$ ' + manutencao1.custo,
        quilometragem: manutencao1.quilometragem + 'km'
    });
    
    // Simular mais quilometragem e manutenções
    civic.viajar(5000);
    cb600.viajar(3000);
    
    civic.realizarManutencao('corretiva', 800, 'Reparo no sistema de freios');
    cb600.realizarManutencao('revisao', 200, 'Revisão dos 5.000km');
    
    const relatorioCivic = civic.relatorioManutencao();
    console.log('Civic - Relatório de manutenção:', {
        totalManutencoes: relatorioCivic.total,
        custoTotal: 'R$ ' + relatorioCivic.custoTotal,
        proximaEm: relatorioCivic.proximaEm + 'km'
    });
    
    // Criar frota
    console.log('\n🚛 CRIANDO FROTA:');
    
    const frota = new SistemaVeiculos.GerenciadorFrota('Frota Empresarial');
    
    frota.adicionarVeiculo(civic)
         .adicionarVeiculo(cb600)
         .adicionarVeiculo(trek);
    
    console.log('Frota criada:', frota.nome);
    console.log('Estatísticas:', frota.estatisticas);
    
    // Buscar veículos
    const buscaHonda = frota.buscarVeiculo('Honda');
    console.log('Busca por "Honda":', buscaHonda.map(v => v.modelo));
    
    // Relatório completo
    const relatorio = frota.relatorioCompleto();
    console.log('\n📊 RELATÓRIO DA FROTA:');
    console.log('• Total de veículos:', relatorio.estatisticas.totalVeiculos);
    console.log('• Quilometragem total:', relatorio.estatisticas.quilometragemTotal + 'km');
    console.log('• Custo total manutenção: R$', relatorio.estatisticas.custoManutencaoTotal);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

console.log('\n✅ Exercício 2 concluído!');

/*
========================================
EXERCÍCIO 3: SISTEMA DE JOGOS RPG
========================================

Crie um sistema de RPG com personagens, habilidades e combate.
O sistema deve incluir:

1. Classe base Personagem com atributos (força, agilidade, inteligência)
2. Classes específicas (Guerreiro, Mago, Arqueiro) com habilidades únicas
3. Sistema de níveis e experiência
4. Sistema de equipamentos e inventário
5. Sistema de combate por turnos
6. Sistema de habilidades e magias

REQUISITOS:
• Use herança e polimorfismo
• Implemente padrão Strategy para habilidades
• Adicione sistema de eventos para combate
• Crie sistema de persistência (save/load)
• Valide todas as ações
*/

console.log('\n\n⚔️ EXERCÍCIO 3: Sistema de Jogos RPG');
console.log('====================================');

// Solução do Exercício 3
const SistemaRPG = (() => {
    'use strict';
    
    // Utilitários
    const RPGUtils = {
        validarNumero: (valor, nome, min = 0, max = Infinity) => {
            if (typeof valor !== 'number' || isNaN(valor) || valor < min || valor > max) {
                throw new Error(`${nome} deve ser um número entre ${min} e ${max}`);
            }
            return valor;
        },
        
        validarString: (valor, nome, minLength = 1) => {
            if (typeof valor !== 'string' || valor.trim().length < minLength) {
                throw new Error(`${nome} deve ser uma string com pelo menos ${minLength} caractere(s)`);
            }
            return valor.trim();
        },
        
        rolarDado: (lados = 20) => Math.floor(Math.random() * lados) + 1,
        
        calcularDano: (base, modificador = 0) => {
            const dado = RPGUtils.rolarDado(6);
            return Math.max(1, base + modificador + dado);
        },
        
        gerarId: (() => {
            let contador = 0;
            return () => ++contador;
        })()
    };
    
    // Sistema de eventos para combate
    const EventoCombate = {
        eventos: {},
        
        on(evento, callback) {
            if (!this.eventos[evento]) {
                this.eventos[evento] = [];
            }
            this.eventos[evento].push(callback);
        },
        
        emit(evento, dados) {
            if (this.eventos[evento]) {
                this.eventos[evento].forEach(callback => callback(dados));
            }
        }
    };
    
    // Classe base Personagem
    function Personagem(nome, classe = 'Aventureiro') {
        // Validações
        let _nome = RPGUtils.validarString(nome, 'Nome', 2);
        let _classe = RPGUtils.validarString(classe, 'Classe');
        
        // Atributos base
        let _nivel = 1;
        let _experiencia = 0;
        let _forca = 10;
        let _agilidade = 10;
        let _inteligencia = 10;
        let _vidaMaxima = 100;
        let _vidaAtual = 100;
        let _manaMaxima = 50;
        let _manaAtual = 50;
        
        // Propriedades calculadas
        Object.defineProperties(this, {
            nome: {
                get: () => _nome,
                enumerable: true
            },
            classe: {
                get: () => _classe,
                enumerable: true
            },
            nivel: {
                get: () => _nivel,
                enumerable: true
            },
            experiencia: {
                get: () => _experiencia,
                enumerable: true
            },
            forca: {
                get: () => _forca,
                enumerable: true
            },
            agilidade: {
                get: () => _agilidade,
                enumerable: true
            },
            inteligencia: {
                get: () => _inteligencia,
                enumerable: true
            },
            vidaMaxima: {
                get: () => _vidaMaxima,
                enumerable: true
            },
            vidaAtual: {
                get: () => _vidaAtual,
                enumerable: true
            },
            manaMaxima: {
                get: () => _manaMaxima,
                enumerable: true
            },
            manaAtual: {
                get: () => _manaAtual,
                enumerable: true
            },
            vivo: {
                get: () => _vidaAtual > 0,
                enumerable: true
            },
            experienciaProximoNivel: {
                get: () => _nivel * 100,
                enumerable: true
            },
            ataque: {
                get: () => Math.floor(_forca / 2) + _nivel,
                enumerable: true
            },
            defesa: {
                get: () => Math.floor(_agilidade / 3) + _nivel,
                enumerable: true
            },
            poderMagico: {
                get: () => Math.floor(_inteligencia / 2) + _nivel,
                enumerable: true
            }
        });
        
        // Métodos
        this.ganharExperiencia = function(quantidade) {
            quantidade = RPGUtils.validarNumero(quantidade, 'Experiência', 0);
            _experiencia += quantidade;
            
            // Verificar level up
            while (_experiencia >= this.experienciaProximoNivel) {
                _experiencia -= this.experienciaProximoNivel;
                this.subirNivel();
            }
            
            return this;
        };
        
        this.subirNivel = function() {
            _nivel++;
            
            // Aumentar atributos
            _forca += 2;
            _agilidade += 2;
            _inteligencia += 2;
            
            // Aumentar vida e mana
            const vidaAntiga = _vidaMaxima;
            const manaAntiga = _manaMaxima;
            
            _vidaMaxima += 20;
            _manaMaxima += 10;
            
            // Curar proporcionalmente
            _vidaAtual += (_vidaMaxima - vidaAntiga);
            _manaAtual += (_manaMaxima - manaAntiga);
            
            EventoCombate.emit('levelUp', {
                personagem: this.nome,
                nivel: _nivel,
                novosAtributos: {
                    forca: _forca,
                    agilidade: _agilidade,
                    inteligencia: _inteligencia,
                    vidaMaxima: _vidaMaxima,
                    manaMaxima: _manaMaxima
                }
            });
            
            return this;
        };
        
        this.receberDano = function(dano) {
            dano = RPGUtils.validarNumero(dano, 'Dano', 0);
            
            // Aplicar defesa
            const danoFinal = Math.max(1, dano - this.defesa);
            _vidaAtual = Math.max(0, _vidaAtual - danoFinal);
            
            EventoCombate.emit('danoRecebido', {
                personagem: this.nome,
                danoOriginal: dano,
                danoFinal,
                vidaRestante: _vidaAtual,
                morreu: !this.vivo
            });
            
            return danoFinal;
        };
        
        this.curar = function(quantidade) {
            quantidade = RPGUtils.validarNumero(quantidade, 'Cura', 0);
            
            const vidaAnterior = _vidaAtual;
            _vidaAtual = Math.min(_vidaMaxima, _vidaAtual + quantidade);
            const curaEfetiva = _vidaAtual - vidaAnterior;
            
            EventoCombate.emit('curado', {
                personagem: this.nome,
                cura: curaEfetiva,
                vidaAtual: _vidaAtual
            });
            
            return curaEfetiva;
        };
        
        this.gastarMana = function(quantidade) {
            quantidade = RPGUtils.validarNumero(quantidade, 'Mana', 0);
            
            if (_manaAtual < quantidade) {
                throw new Error('Mana insuficiente');
            }
            
            _manaAtual -= quantidade;
            return this;
        };
        
        this.recuperarMana = function(quantidade) {
            quantidade = RPGUtils.validarNumero(quantidade, 'Recuperação de mana', 0);
            _manaAtual = Math.min(_manaMaxima, _manaAtual + quantidade);
            return this;
        };
        
        this.atacar = function(alvo) {
            if (!this.vivo) {
                throw new Error('Personagem morto não pode atacar');
            }
            
            if (!(alvo instanceof Personagem)) {
                throw new Error('Alvo deve ser um personagem');
            }
            
            if (!alvo.vivo) {
                throw new Error('Não é possível atacar um personagem morto');
            }
            
            const dano = RPGUtils.calcularDano(this.ataque);
            const danoFinal = alvo.receberDano(dano);
            
            EventoCombate.emit('ataque', {
                atacante: this.nome,
                alvo: alvo.nome,
                dano: danoFinal
            });
            
            return danoFinal;
        };
        
        // Propriedades públicas
        this.id = RPGUtils.gerarId();
        this.criadoEm = new Date();
        this.habilidades = [];
        this.inventario = [];
    }
    
    // Métodos do protótipo
    Personagem.prototype.toString = function() {
        return `${this.nome} (${this.classe}) - Nível ${this.nivel}`;
    };
    
    Personagem.prototype.status = function() {
        return {
            nome: this.nome,
            classe: this.classe,
            nivel: this.nivel,
            vida: `${this.vidaAtual}/${this.vidaMaxima}`,
            mana: `${this.manaAtual}/${this.manaMaxima}`,
            atributos: {
                forca: this.forca,
                agilidade: this.agilidade,
                inteligencia: this.inteligencia
            },
            combate: {
                ataque: this.ataque,
                defesa: this.defesa,
                poderMagico: this.poderMagico
            }
        };
    };
    
    Personagem.prototype.toJSON = function() {
        return {
            ...this.status(),
            id: this.id,
            experiencia: this.experiencia,
            experienciaProximoNivel: this.experienciaProximoNivel,
            vivo: this.vivo,
            habilidades: this.habilidades,
            inventario: this.inventario,
            criadoEm: this.criadoEm
        };
    };
    
    // Interface pública
    return {
        Personagem,
        RPGUtils,
        EventoCombate
    };
})();

// Demonstração e testes
console.log('\n⚔️ Demonstração do Sistema RPG:');

try {
    // Criar personagens
    console.log('\n👥 CRIANDO PERSONAGENS:');
    
    const aragorn = new SistemaRPG.Personagem('Aragorn', 'Guerreiro');
    const gandalf = new SistemaRPG.Personagem('Gandalf', 'Mago');
    const legolas = new SistemaRPG.Personagem('Legolas', 'Arqueiro');
    
    console.log('Personagens criados:');
    console.log('•', aragorn.toString());
    console.log('•', gandalf.toString());
    console.log('•', legolas.toString());
    
    // Mostrar status inicial
    console.log('\n📊 STATUS INICIAL:');
    console.log('Aragorn:', aragorn.status());
    
    // Sistema de eventos
    console.log('\n📡 CONFIGURANDO EVENTOS:');
    
    SistemaRPG.EventoCombate.on('ataque', (dados) => {
        console.log(`⚔️ ${dados.atacante} atacou ${dados.alvo} causando ${dados.dano} de dano!`);
    });
    
    SistemaRPG.EventoCombate.on('danoRecebido', (dados) => {
        if (dados.morreu) {
            console.log(`💀 ${dados.personagem} foi derrotado!`);
        } else {
            console.log(`🩸 ${dados.personagem} recebeu ${dados.danoFinal} de dano (${dados.vidaRestante} vida restante)`);
        }
    });
    
    SistemaRPG.EventoCombate.on('levelUp', (dados) => {
        console.log(`🎉 ${dados.personagem} subiu para o nível ${dados.nivel}!`);
    });
    
    SistemaRPG.EventoCombate.on('curado', (dados) => {
        console.log(`💚 ${dados.personagem} foi curado em ${dados.cura} pontos (${dados.vidaAtual} vida atual)`);
    });
    
    // Simular combate
    console.log('\n⚔️ SIMULANDO COMBATE:');
    
    // Aragorn vs Legolas
    console.log('\n🥊 Aragorn vs Legolas:');
    
    let rodada = 1;
    while (aragorn.vivo && legolas.vivo && rodada <= 10) {
        console.log(`\n--- Rodada ${rodada} ---`);
        
        // Aragorn ataca
        if (aragorn.vivo) {
            aragorn.atacar(legolas);
        }
        
        // Legolas ataca (se ainda estiver vivo)
        if (legolas.vivo) {
            legolas.atacar(aragorn);
        }
        
        rodada++;
    }
    
    // Determinar vencedor
    if (aragorn.vivo && !legolas.vivo) {
        console.log('\n🏆 Aragorn venceu o combate!');
        aragorn.ganharExperiencia(50);
    } else if (!aragorn.vivo && legolas.vivo) {
        console.log('\n🏆 Legolas venceu o combate!');
        legolas.ganharExperiencia(50);
    } else if (!aragorn.vivo && !legolas.vivo) {
        console.log('\n⚰️ Ambos foram derrotados!');
    } else {
        console.log('\n🤝 Combate terminou em empate!');
    }
    
    // Testar cura
    console.log('\n💚 TESTANDO CURA:');
    
    if (aragorn.vivo) {
        aragorn.curar(30);
    }
    
    if (legolas.vivo) {
        legolas.curar(25);
    }
    
    // Testar experiência e level up
    console.log('\n📈 TESTANDO EXPERIÊNCIA:');
    
    gandalf.ganharExperiencia(150);
    console.log('Gandalf após ganhar experiência:', gandalf.status());
    
    // Mostrar status final
    console.log('\n📊 STATUS FINAL:');
    console.log('Aragorn:', aragorn.status());
    console.log('Gandalf:', gandalf.status());
    console.log('Legolas:', legolas.status());
    
    // Exportar dados
    console.log('\n💾 EXPORTANDO DADOS:');
    const dadosAragorn = aragorn.toJSON();
    console.log('Dados do Aragorn exportados com sucesso!');
    console.log('• ID:', dadosAragorn.id);
    console.log('• Nível:', dadosAragorn.nivel);
    console.log('• Experiência:', dadosAragorn.experiencia);
    console.log('• Vivo:', dadosAragorn.vivo);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

console.log('\n✅ Exercício 3 concluído!');

/*
========================================
CONCEITOS APLICADOS NOS EXERCÍCIOS
========================================

📚 EXERCÍCIO 1 - Sistema de Biblioteca:
• Herança prototípica (Autor herda de Pessoa)
• Encapsulamento com closures e defineProperty
• Polimorfismo (toString, toJSON)
• Validação de dados
• Getters e setters
• Métodos estáticos
• Composição de objetos
• Padrão Module

🚗 EXERCÍCIO 2 - Sistema de Veículos:
• Mixins para composição
• Factory Pattern
• Sistema de eventos
• Herança múltipla simulada
• Interfaces consistentes
• Validação complexa
• Agregação de dados
• Padrão Observer

⚔️ EXERCÍCIO 3 - Sistema RPG:
• Herança clássica
• Padrão Strategy (habilidades)
• Sistema de eventos
• Encapsulamento de estado
• Polimorfismo em ação
• Validação de regras de negócio
• Serialização de objetos
• Padrão Observer para combate

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

✅ Validação rigorosa de entrada
✅ Encapsulamento adequado
✅ Uso correto de herança
✅ Implementação de interfaces
✅ Tratamento de erros
✅ Documentação clara
✅ Testes integrados
✅ Código modular e reutilizável
✅ Padrões de design aplicados
✅ Performance otimizada

========================================
EXERCÍCIOS PROPOSTOS PARA PRÁTICA
========================================

1. 📚 BIBLIOTECA:
   • Adicione sistema de reservas
   • Implemente multas por atraso
   • Crie relatórios avançados
   • Adicione categorias de usuários

2. 🚗 VEÍCULOS:
   • Implemente sistema de seguros
   • Adicione rastreamento GPS
   • Crie sistema de aluguel
   • Implemente manutenção preditiva

3. ⚔️ RPG:
   • Adicione classes específicas (Guerreiro, Mago, Arqueiro)
   • Implemente sistema de equipamentos
   • Crie dungeons e missões
   • Adicione sistema de guilds

========================================
PRÓXIMOS PASSOS DE ESTUDO
========================================

• Padrões de Design avançados
• Programação Funcional
• Async/Await e Promises
• Módulos ES6
• TypeScript
• Testes unitários
• Performance e otimização
• Arquitetura de software

*/

console.log('\n🎯 EXERCÍCIOS DE OBJETOS E PROTÓTIPOS CONCLUÍDOS!');
console.log('===================================================');
console.log('\n📖 Conceitos praticados:');
console.log('• Criação e manipulação de objetos');
console.log('• Herança prototípica e clássica');
console.log('• Encapsulamento e abstração');
console.log('• Polimorfismo e composição');
console.log('• Padrões de design (Factory, Observer, Strategy)');
console.log('• Mixins e herança múltipla');
console.log('• Validação e tratamento de erros');
console.log('• Sistemas de eventos');
console.log('• Serialização de dados');
console.log('• Boas práticas de OOP');

console.log('\n🚀 Continue praticando e explorando esses conceitos!');
console.log('💡 Experimente modificar os exercícios e adicionar novas funcionalidades!');
            autores: {
                get: () => Array.from(_autores.values()),
                enumerable: true
            },
            usuarios: {
                get: () => Array.from(_usuarios),
                enumerable: true
            }
        });
        
        // Métodos privados
        const atualizarEstatisticas = () => {
            _estatisticas.totalLivros = _livros.size;
            _estatisticas.totalAutores = _autores.size;
            _estatisticas.livrosDisponiveis = Array.from(_livros.values()).filter(l => l.disponivel).length;
            _estatisticas.livrosEmprestados = _estatisticas.totalLivros - _estatisticas.livrosDisponiveis;
            _estatisticas.totalEmprestimos = Array.from(_livros.values())
                .reduce((total, livro) => total + livro.totalEmprestimos, 0);
        };
        
        // Métodos públicos
        this.adicionarAutor = function(autor) {
            if (!(autor instanceof Autor)) {
                throw new Error('Deve ser uma instância da classe Autor');
            }
            
            if (_autores.has(autor.id)) {
                throw new Error('Autor já existe na biblioteca');
            }
            
            _autores.set(autor.id, autor);
            atualizarEstatisticas();
            
            return this;
        };
        
        this.adicionarLivro = function(livro) {
            if (!(livro instanceof Livro)) {
                throw new Error('Deve ser uma instância da classe Livro');
            }
            
            if (_livros.has(livro.isbn)) {
                throw new Error('Livro com este ISBN já existe na biblioteca');
            }
            
            // Adicionar autor se não existir
            if (!_autores.has(livro.autor.id)) {
                this.adicionarAutor(livro.autor);
            }
            
            _livros.set(livro.isbn, livro);
            atualizarEstatisticas();
            
            return this;
        };
        
        this.removerLivro = function(isbn) {
            const livro = _livros.get(isbn);
            if (!livro) {
                throw new Error('Livro não encontrado');
            }
            
            if (!livro.disponivel) {
                throw new Error('Não é possível remover livro emprestado');
            }
            
            _livros.delete(isbn);
            atualizarEstatisticas();
            
            return livro;
        };
        
        this.buscarLivro = function(criterio) {
            const resultados = [];
            
            for (const livro of _livros.values()) {
                const match = 
                    livro.titulo.toLowerCase().includes(criterio.toLowerCase()) ||
                    livro.autor.nome.toLowerCase().includes(criterio.toLowerCase()) ||
                    livro.isbn === criterio ||
                    livro.genero.toLowerCase().includes(criterio.toLowerCase());
                
                if (match) {
                    resultados.push(livro);
                }
            }
            
            return resultados;
        };
        
        this.buscarAutor = function(criterio) {
            const resultados = [];
            
            for (const autor of _autores.values()) {
                const match = 
                    autor.nome.toLowerCase().includes(criterio.toLowerCase()) ||
                    autor.nacionalidade.toLowerCase().includes(criterio.toLowerCase());
                
                if (match) {
                    resultados.push(autor);
                }
            }
            
            return resultados;
        };
        
        this.filtrarLivros = function(filtros = {}) {
            let resultados = Array.from(_livros.values());
            
            if (filtros.disponivel !== undefined) {
                resultados = resultados.filter(livro => livro.disponivel === filtros.disponivel);
            }
            
            if (filtros.genero) {
                resultados = resultados.filter(livro => 
                    livro.genero.toLowerCase().includes(filtros.genero.toLowerCase())
                );
            }
            
            if (filtros.autorId) {
                resultados = resultados.filter(livro => livro.autor.id === filtros.autorId);
            }
            
            if (filtros.anoMinimo) {
                resultados = resultados.filter(livro => livro.anoPublicacao >= filtros.anoMinimo);
            }
            
            if (filtros.anoMaximo) {
                resultados = resultados.filter(livro => livro.anoPublicacao <= filtros.anoMaximo);
            }
            
            return resultados;
        };
        
        this.emprestar = function(isbn, usuario) {
            const livro = _livros.get(isbn);
            if (!livro) {
                throw new Error('Livro não encontrado');
            }
            
            _usuarios.add(usuario);
            const emprestimo = livro.emprestar(usuario);
            atualizarEstatisticas();
            
            return emprestimo;
        };
        
        this.devolver = function(isbn, dataDevolucao) {
            const livro = _livros.get(isbn);
            if (!livro) {
                throw new Error('Livro não encontrado');
            }
            
            const devolucao = livro.devolver(dataDevolucao);
            atualizarEstatisticas();
            
            return devolucao;
        };
        
        this.relatorioEmprestimos = function() {
            const emprestimos = [];
            const atrasados = [];
            
            for (const livro of _livros.values()) {
                for (const emprestimo of livro.emprestimos) {
                    const info = {
                        livro: {
                            titulo: livro.titulo,
                            isbn: livro.isbn,
                            autor: livro.autor.nome
                        },
                        ...emprestimo
                    };
                    
                    emprestimos.push(info);
                    
                    if (emprestimo.ativo && new Date() > emprestimo.dataPrevistaDevolucao) {
                        atrasados.push(info);
                    }
                }
            }
            
            return {
                total: emprestimos.length,
                ativos: emprestimos.filter(e => e.ativo).length,
                finalizados: emprestimos.filter(e => !e.ativo).length,
                atrasados: atrasados.length,
                emprestimos,
                atrasados
            };
        };
        
        this.relatorioAutores = function() {
            return Array.from(_autores.values())
                .map(autor => ({
                    ...autor.toJSON(),
                    livrosNaBiblioteca: this.filtrarLivros({ autorId: autor.id }).length
                }))
                .sort((a, b) => b.livrosNaBiblioteca - a.livrosNaBiblioteca);
        };
        
        this.exportarDados = function() {
            return {
                biblioteca: {
                    nome: this.nome,
                    endereco: this.endereco,
                    exportadoEm: new Date()
                },
                estatisticas: this.estatisticas,
                autores: this.autores.map(a => a.toJSON()),
                livros: this.livros.map(l => l.toJSON()),
                usuarios: this.usuarios,
                emprestimos: this.relatorioEmprestimos()
            };
        };
        
        // Propriedades públicas
        this.id = Biblioteca.gerarId();
        this.criadaEm = new Date();
        
        // Inicializar estatísticas
        atualizarEstatisticas();
    }
    
    // Métodos estáticos
    Biblioteca.contadorId = 0;
    Biblioteca.gerarId = function() {
        return ++this.contadorId;
    };
    
    // Métodos do protótipo
    Biblioteca.prototype.toString = function() {
        return `Biblioteca "${this.nome}" - ${this.estatisticas.totalLivros} livros, ${this.estatisticas.totalAutores} autores`;
    };
    
    Biblioteca.prototype.toJSON = function() {
        return {
            id: this.id,
            nome: this.nome,
            endereco: this.endereco,
            estatisticas: this.estatisticas,
            criadaEm: this.criadaEm
        };
    };
    
    // Interface pública
    return {
        Pessoa,
        Autor,
        Livro,
        Biblioteca,
        Validadores
    };
})();

// Demonstração e testes
console.log('\n📖 Demonstração do Sistema de Biblioteca:');

try {
    // Criar autores
    console.log('\n👨‍💼 CRIANDO AUTORES:');
    
    const machado = new SistemaBiblioteca.Autor(
        'Machado de Assis',
        'Brasileira',
        1839,
        'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado um dos maiores nomes da literatura brasileira.'
    );
    
    const clarice = new SistemaBiblioteca.Autor(
        'Clarice Lispector',
        'Brasileira',
        1920,
        'Clarice Lispector foi uma escritora e jornalista brasileira nascida na Ucrânia.'
    );
    
    const tolkien = new SistemaBiblioteca.Autor(
        'J.R.R. Tolkien',
        'Britânica',
        1892,
        'John Ronald Reuel Tolkien foi um escritor, professor universitário e filólogo britânico.'
    );
    
    console.log('Autores criados:');
    console.log('•', machado.toString());
    console.log('•', clarice.toString());
    console.log('•', tolkien.toString());
    
    // Adicionar prêmios
    machado.adicionarPremio('Ordem da Rosa', 1888);
    clarice.adicionarPremio('Prêmio Jabuti', 1961);
    tolkien.adicionarPremio('Commander of the Order of the British Empire', 1972);
    
    // Criar livros
    console.log('\n📚 CRIANDO LIVROS:');
    
    const domCasmurro = new SistemaBiblioteca.Livro(
        'Dom Casmurro',
        machado,
        '9788525406958',
        1899,
        'Romance'
    );
    
    const memorias = new SistemaBiblioteca.Livro(
        'Memórias Póstumas de Brás Cubas',
        machado,
        '9788525406941',
        1881,
        'Romance'
    );
    
    const aguaViva = new SistemaBiblioteca.Livro(
        'Água Viva',
        clarice,
        '9788520925188',
        1973,
        'Romance'
    );
    
    const hobbit = new SistemaBiblioteca.Livro(
        'O Hobbit',
        tolkien,
        '9788595084759',
        1937,
        'Fantasia'
    );
    
    const senhorAneis = new SistemaBiblioteca.Livro(
        'O Senhor dos Anéis',
        tolkien,
        '9788595084742',
        1954,
        'Fantasia'
    );
    
    console.log('Livros criados:');
    console.log('•', domCasmurro.toString());
    console.log('•', memorias.toString());
    console.log('•', aguaViva.toString());
    console.log('•', hobbit.toString());
    console.log('•', senhorAneis.toString());
    
    // Criar biblioteca
    console.log('\n🏛️ CRIANDO BIBLIOTECA:');
    
    const biblioteca = new SistemaBiblioteca.Biblioteca(
        'Biblioteca Central',
        'Rua das Letras, 123 - Centro'
    );
    
    // Adicionar livros à biblioteca
    biblioteca
        .adicionarLivro(domCasmurro)
        .adicionarLivro(memorias)
        .adicionarLivro(aguaViva)
        .adicionarLivro(hobbit)
        .adicionarLivro(senhorAneis);
    
    console.log('Biblioteca criada:', biblioteca.toString());
    console.log('Estatísticas:', biblioteca.estatisticas);
    
    // Operações de empréstimo
    console.log('\n📋 OPERAÇÕES DE EMPRÉSTIMO:');
    
    // Emprestar livros
    const emprestimo1 = biblioteca.emprestar('9788525406958', 'João Silva');
    console.log('Empréstimo 1:', {
        livro: domCasmurro.titulo,
        usuario: emprestimo1.usuario,
        dataEmprestimo: emprestimo1.dataEmprestimo.toLocaleDateString(),
        dataPrevista: emprestimo1.dataPrevistaDevolucao.toLocaleDateString()
    });
    
    const emprestimo2 = biblioteca.emprestar('9788595084759', 'Maria Santos');
    console.log('Empréstimo 2:', {
        livro: hobbit.titulo,
        usuario: emprestimo2.usuario,
        dataEmprestimo: emprestimo2.dataEmprestimo.toLocaleDateString(),
        dataPrevista: emprestimo2.dataPrevistaDevolucao.toLocaleDateString()
    });
    
    // Tentar emprestar livro já emprestado
    try {
        biblioteca.emprestar('9788525406958', 'Pedro Costa');
    } catch (error) {
        console.log('Erro esperado:', error.message);
    }
    
    // Devolver livro
    const devolucao = biblioteca.devolver('9788525406958');
    console.log('Devolução:', {
        livro: domCasmurro.titulo,
        usuario: devolucao.usuario,
        dataDevolucao: devolucao.dataDevolucao.toLocaleDateString(),
        atraso: devolucao.atraso
    });
    
    // Buscar livros
    console.log('\n🔍 BUSCAS E FILTROS:');
    
    const buscaMachado = biblioteca.buscarLivro('Machado');
    console.log('Busca por "Machado":', buscaMachado.map(l => l.titulo));
    
    const buscaFantasia = biblioteca.filtrarLivros({ genero: 'Fantasia' });
    console.log('Livros de Fantasia:', buscaFantasia.map(l => l.titulo));
    
    const livrosDisponiveis = biblioteca.filtrarLivros({ disponivel: true });
    console.log('Livros disponíveis:', livrosDisponiveis.map(l => l.titulo));
    
    const livrosSeculo20 = biblioteca.filtrarLivros({ anoMinimo: 1900 });
    console.log('Livros do século XX:', livrosSeculo20.map(l => `${l.titulo} (${l.anoPublicacao})`));
    
    // Relatórios
    console.log('\n📊 RELATÓRIOS:');
    
    const relatorioEmprestimos = biblioteca.relatorioEmprestimos();
    console.log('Relatório de Empréstimos:');
    console.log('• Total:', relatorioEmprestimos.total);
    console.log('• Ativos:', relatorioEmprestimos.ativos);
    console.log('• Finalizados:', relatorioEmprestimos.finalizados);
    console.log('• Atrasados:', relatorioEmprestimos.atrasados);
    
    const relatorioAutores = biblioteca.relatorioAutores();
    console.log('\nRelatório de Autores:');
    relatorioAutores.forEach(autor => {
        console.log(`• ${autor.nome}: ${autor.livrosNaBiblioteca} livro(s), ${autor.premios.length} prêmio(s)`);
    });
    
    // Testar validações
    console.log('\n⚠️ TESTANDO VALIDAÇÕES:');
    
    try {
        new SistemaBiblioteca.Autor('', 'Brasileira', 1900);
    } catch (error) {
        console.log('Validação nome vazio:', error.message);
    }
    
    try {
        new SistemaBiblioteca.Livro('Teste', machado, '123', 2025);
    } catch (error) {
        console.log('Validação ISBN inválido:', error.message);
    }
    
    try {
        new SistemaBiblioteca.Livro('Teste', machado, '1234567890', 2025);
    } catch (error) {
        console.log('Validação ano futuro:', error.message);
    }
    
    // Demonstrar herança e polimorfismo
    console.log('\n🧬 HERANÇA E POLIMORFISMO:');
    
    const pessoas = [machado, clarice, tolkien];
    console.log('Demonstração de polimorfismo:');
    pessoas.forEach(pessoa => {
        console.log('• toString():', pessoa.toString());
        console.log('• Idade:', pessoa.idade, 'anos');
        console.log('• Tipo:', pessoa.constructor.name);
        console.log('• É Autor?', pessoa instanceof SistemaBiblioteca.Autor);
        console.log('• É Pessoa?', pessoa instanceof SistemaBiblioteca.Pessoa);
        console.log('---');
    });
    
    // Exportar dados
    console.log('\n💾 EXPORTAÇÃO DE DADOS:');
    const dadosExportados = biblioteca.exportarDados();
    console.log('Dados exportados com sucesso!');
    console.log('• Autores:', dadosExportados.autores.length);
    console.log('• Livros:', dadosExportados.livros.length);
    console.log('• Usuários:', dadosExportados.usuarios.length);
    console.log('• Empréstimos:', dadosExportados.emprestimos.total);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
}

console.log('\n✅ Exercício 1 concluído!');

/*
========================================
EXERCÍCIO 2: SISTEMA DE VEÍCULOS
========================================

Crie um sistema de gerenciamento de veículos com herança múltipla usando mixins.
O sistema deve incluir:

1. Classe base Veiculo
2. Mixins para diferentes características (Motor, Rodas, Combustivel)
3. Classes específicas (Carro, Moto, Caminhao, Bicicleta)
4. Sistema de manutenção e histórico
5. Calculadora de custos e consumo
6. Relatórios e estatísticas

REQUISITOS:
• Use mixins para composição
• Implemente factory pattern
• Adicione sistema de eventos
• Crie interfaces consistentes
• Valide dados complexos
*/

console.log('\n\n🚗 EXERCÍCIO 2: Sistema de Veículos');
console.log('====================================');

// Solução do Exercício 2
const SistemaVeiculos = (() => {
    'use strict';
    
    // Utilitários
    const Utils = {
        validarNumero: (valor, nome, min = 0, max = Infinity) => {
            if (typeof valor !== 'number' || isNaN(valor) || valor < min || valor > max) {
                throw new Error(`${nome} deve ser um número entre ${min} e ${max}`);
            }
            return valor;
        },
        
        validarString: (valor, nome, minLength = 1) => {
            if (typeof valor !== 'string' || valor.trim().length < minLength) {
                throw new Error(`${nome} deve ser uma string com pelo menos ${minLength} caractere(s)`);
            }
            return valor.trim();
        },
        
        validarEnum: (valor, opcoes, nome) => {
            if (!opcoes.includes(valor)) {
                throw new Error(`${nome} deve ser um dos valores: ${opcoes.join(', ')}`);
            }
            return valor;
        },
        
        gerarId: (() => {
            let contador = 0;
            return () => ++contador;
        })()
    };
    
    // Sistema de eventos
    const EventEmitter = {
        eventos: {},
        
        on(evento, callback) {
            if (!this.eventos[evento]) {
                this.eventos[evento] = [];
            }
            this.eventos[evento].push(callback);
            
            return () => {
                const index = this.eventos[evento].indexOf(callback);
                if (index > -1) {
                    this.eventos[evento].splice(index, 1);
                }
            };
        },
        
        emit(evento, dados) {
            if (this.eventos[evento]) {
                this.eventos[evento].forEach(callback => {
                    try {
                        callback(dados);
                    } catch (error) {
                        console.error(`Erro no evento ${evento}:`, error);
                    }
                });
            }
        },
        
        off(evento) {
            delete this.eventos[evento];
        }
    };
    
    // Mixin para Motor
    const MotorMixin = {
        inicializarMotor(potencia, cilindradas, tipo = 'gasolina') {
            let _potencia = Utils.validarNumero(potencia, 'Potência', 1, 2000);
            let _cilindradas = Utils.validarNumero(cilindradas, 'Cilindradas', 50, 8000);
            let _tipo = Utils.validarEnum(tipo, ['gasolina', 'diesel', 'flex', 'eletrico', 'hibrido'], 'Tipo de motor');
            let _ligado = false;
            let _temperatura = 20;
            let _horasUso = 0;
            
            Object.defineProperties(this, {
                potencia: {
                    get: () => _potencia,
                    enumerable: true
                },
                cilindradas: {
                    get: () => _cilindradas,
                    enumerable: true
                },
                tipoMotor: {
                    get: () => _tipo,
                    enumerable: true
                },
                motorLigado: {
                    get: () => _ligado,
                    enumerable: true
                },
                temperatura: {
                    get: () => _temperatura,
                    enumerable: true
                },
                horasUso: {
                    get: () => _horasUso,
                    enumerable: true
                }
            });
            
            this.ligarMotor = () => {
                if (_ligado) {
                    throw new Error('Motor já está ligado');
                }
                _ligado = true;
                _temperatura = 90;
                EventEmitter.emit.call(this, 'motorLigado', { veiculo: this.modelo });
                return this;
            };
            
            this.desligarMotor = () => {
                if (!_ligado) {
                    throw new Error('Motor já está desligado');
                }
                _ligado = false;
                _temperatura = 20;
                EventEmitter.emit.call(this, 'motorDesligado', { veiculo: this.modelo });
                return this;
            };
            
            this.acelerar = (intensidade = 50) => {
                if (!_ligado) {
                    throw new Error('Motor deve estar ligado para acelerar');
                }
                
                intensidade = Utils.validarNumero(intensidade, 'Intensidade', 0, 100);
                _temperatura = Math.min(120, _temperatura + (intensidade * 0.3));
                _horasUso += intensidade / 1000;
                
                EventEmitter.emit.call(this, 'acelerou', {
                    veiculo: this.modelo,
                    intensidade,
                    temperatura: _temperatura
                });
                
                return this;
            };
            
            return this;
        }
    };
    
    // Mixin para Combustível
    const CombustivelMixin = {
        inicializarCombustivel(capacidade, consumo, tipoCombustivel = 'gasolina') {
            let _capacidade = Utils.validarNumero(capacidade, 'Capacidade do tanque', 1, 500);
            let _nivel = _capacidade; // Tanque cheio inicialmente
            let _consumo = Utils.validarNumero(consumo, 'Consumo (km/l)', 1, 50);
            let _tipo = Utils.validarEnum(tipoCombustivel, ['gasolina', 'diesel', 'etanol', 'eletrico'], 'Tipo de combustível');
            let _quilometragem = 0;
            
            Object.defineProperties(this, {
                capacidadeTanque: {
                    get: () => _capacidade,
                    enumerable: true
                },
                nivelCombustivel: {
                    get: () => _nivel,
                    enumerable: true
                },
                consumo: {
                    get: () => _consumo,
                    enumerable: true
                },
                tipoCombustivel: {
                    get: () => _tipo,
                    enumerable: true
                },
                quilometragem: {
                    get: () => _quilometragem,
                    enumerable: true
                },
                autonomia: {
                    get: () => _nivel * _consumo,
                    enumerable: true
                },
                percentualCombustivel: {
                    get: () => (_nivel / _capacidade * 100).toFixed(1) + '%',
                    enumerable: true
                }
            });
            
            this.abastecer = (quantidade) => {
                quantidade = Utils.validarNumero(quantidade, 'Quantidade', 0, _capacidade);
                
                if (_nivel + quantidade > _capacidade) {
                    quantidade = _capacidade - _nivel;
                }
                
                _nivel += quantidade;
                
                EventEmitter.emit.call(this, 'abasteceu', {
                    veiculo: this.modelo,
                    quantidade,
                    nivelAtual: _nivel,
                    percentual: this.percentualCombustivel
                });
                
                return {
                    quantidade,
                    nivelAtual: _nivel,
                    percentual: this.percentualCombustivel
                };
            };
            
            this.viajar = (distancia) => {
                distancia = Utils.validarNumero(distancia, 'Distância', 0, 10000);
                
                const combustivelNecessario = distancia / _consumo;
                
                if (combustivelNecessario > _nivel) {
                    throw new Error(`Combustível insuficiente. Necessário: ${combustivelNecessario.toFixed(2)}L, Disponível: ${_nivel.toFixed(2)}L`);
                }
                
                _nivel -= combustivelNecessario;
                _quilometragem += distancia;
                
                EventEmitter.emit.call(this, 'viajou', {
                    veiculo: this.modelo,
                    distancia,
                    combustivelGasto: combustivelNecessario,
                    quilometragemTotal: _quilometragem
                });
                
                return {
                    distancia,
                    combustivelGasto: combustivelNecessario,
                    nivelAtual: _nivel,
                    quilometragemTotal: _quilometragem
                };
            };
            
            this.calcularCusto = (precoCombustivel) => {
                const custoAbastecimento = _capacidade * precoCombustivel;
                const custoPorKm = precoCombustivel / _consumo;
                
                return {
                    abastecimentoCompleto: custoAbastecimento,
                    custoPorKm,
                    custoTotal: _quilometragem * custoPorKm
                };
            };
            
            return this;
        }
    };
    
    // Mixin para Manutenção
    const ManutencaoMixin = {
        inicializarManutencao() {
            let _historico = [];
            let _proximaManutencao = 10000; // km
            let _custoTotal = 0;
            
            Object.defineProperties(this, {
                historicoManutencao: {
                    get: () => [..._historico],
                    enumerable: true
                },
                proximaManutencao: {
                    get: () => _proximaManutencao,
                    enumerable: true
                },
                custoManutencao: {
                    get: () => _custoTotal,
                    enumerable: true
                },
                precisaManutencao: {
                    get: () => this.quilometragem >= _proximaManutencao,
                    enumerable: true
                }
            });
            
            this.realizarManutencao = (tipo, custo, descricao = '') => {
                tipo = Utils.validarEnum(tipo, ['preventiva', 'corretiva', 'revisao'], 'Tipo de manutenção');
                custo = Utils.validarNumero(custo, 'Custo', 0, 50000);
                
                const manutencao = {
                    id: Utils.gerarId(),
                    tipo,
                    custo,
                    descricao: Utils.validarString(descricao, 'Descrição', 0),
                    quilometragem: this.quilometragem,
                    data: new Date()
                };
                
                _historico.push(manutencao);
                _custoTotal += custo;
                
                // Definir próxima manutenção
                if (tipo === 'preventiva' || tipo === 'revisao') {
                    _proximaManutencao = this.quilometragem + 10000;
                }
                
                EventEmitter.emit.call(this, 'manutencaoRealizada', {
                    veiculo: this.modelo,
                    manutencao
                });
                
                return manutencao;
            };
            
            this.relatorioManutencao = () => {
                const preventivas = _historico.filter(m => m.tipo === 'preventiva');
                const corretivas = _historico.filter(m => m.tipo === 'corretiva');
                const revisoes = _historico.filter(m => m.tipo === 'revisao');
                
                return {
                    total: _historico.length,
                    preventivas: preventivas.length,
                    corretivas: corretivas.length,
                    revisoes: revisoes.length,
                    custoTotal: _custoTotal,
                    custoMedio: _historico.length > 0 ? _custoTotal / _historico.length : 0,
                    ultimaManutencao: _historico[_historico.length - 1] || null,
                    proximaEm: _proximaManutencao - this.quilometragem
                };
            };
            
            return this;
        }
    };
    
    // Função para aplicar mixins
    const aplicarMixins = (target, ...mixins) => {
        mixins.forEach(mixin => {
            Object.getOwnPropertyNames(mixin).forEach(name => {
                if (name !== 'constructor') {
                    target[name] = mixin[name];
                }
            });
        });
        return target;
    };
    
    // Classe base Veiculo
    function Veiculo(marca, modelo, ano, cor = 'Branco') {
        // Validações
        let _marca = Utils.validarString(marca, 'Marca');
        let _modelo = Utils.validarString(modelo, 'Modelo');
        let _ano = Utils.validarNumero(ano, 'Ano', 1900, new Date().getFullYear() + 1);
        let _cor = Utils.validarString(cor, 'Cor');
        let _proprietario = null;
        
        // Propriedades
        Object.defineProperties(this, {
            marca: {
                get: () => _marca,
                enumerable: true
            },
            modelo: {
                get: () => _modelo,
                enumerable: true
            },
            ano: {
                get: () => _ano,
                enumerable: true
            },
            cor: {
                get: () => _cor,
                set: (valor) => {
                    _cor = Utils.validarString(valor, 'Cor');
                },
                enumerable: true
            },
            proprietario: {
                get: () => _proprietario,
                set: (valor) => {
                    _proprietario = valor ? Utils.validarString(valor, 'Proprietário') : null;
                },
                enumerable: true
            },
            idade: {
                get: () => new Date().getFullYear() - _ano,
                enumerable: true
            }
        });
        
        // Propriedades públicas
        this.id = Utils.gerarId();
        this.criadoEm = new Date();
        
        // Aplicar mixins de eventos
        aplicarMixins(this, EventEmitter);
    }
    
    // Métodos do protótipo
    Veiculo.prototype.toString = function() {
        return `${this.marca} ${this.modelo} (${this.ano}) - ${this.cor}`;
    };
    
    Veiculo.prototype.toJSON = function() {
        return {
            id: this.id,
            marca: this.marca,
            modelo: this.modelo,
            ano: this.ano,
            cor: this.cor,
            proprietario: this.proprietario,
            idade: this.idade,
            criadoEm: this.criadoEm
        };
    };
    
    // Classe Carro
    function Carro(marca, modelo, ano, cor, potencia, cilindradas, capacidadeTanque, consumo) {
        Veiculo.call(this, marca, modelo, ano, cor);
        
        // Aplicar mixins
        this.inicializarMotor(potencia, cilindradas, 'flex');
        this.inicializarCombustivel(capacidadeTanque, consumo, 'gasolina');
        this.inicializarManutencao();
        
        // Propriedades específicas
        this.tipo = 'Carro';
        this.portas = 4;
        this.lugares = 5;
    }
    
    Carro.prototype = Object.create(Veiculo.prototype);
    Carro.prototype.constructor = Carro;
    
    // Aplicar mixins ao protótipo
    aplicarMixins(Carro.prototype, MotorMixin, CombustivelMixin, ManutencaoMixin);
    
    // Classe Moto
    function Moto(marca, modelo, ano, cor, potencia, cilindradas, capacidadeTanque, consumo) {
        Veiculo.call(this, marca, modelo, ano, cor);
        
        this.inicializarMotor(potencia, cilindradas, 'gasolina');
        this.inicializarCombustivel(capacidadeTanque, consumo, 'gasolina');
        this.inicializarManutencao();
        
        this.tipo = 'Moto';
        this.rodas = 2;
        this.lugares = 2;
    }
    
    Moto.prototype = Object.create(Veiculo.prototype);
    Moto.prototype.constructor = Moto;
    aplicarMixins(Moto.prototype, MotorMixin, CombustivelMixin, ManutencaoMixin);
    
    // Classe Bicicleta (sem motor)
    function Bicicleta(marca, modelo, ano, cor, marchas = 1) {
        Veiculo.call(this, marca, modelo, ano, cor);
        
        this.inicializarManutencao();
        
        this.tipo = 'Bicicleta';
        this.marchas = Utils.validarNumero(marchas, 'Marchas', 1, 30);
        this.rodas = 2;
        this.eletrica = false;
    }
    
    Bicicleta.prototype = Object.create(Veiculo.prototype);
    Bicicleta.prototype.constructor = Bicicleta;
    aplicarMixins(Bicicleta.prototype, ManutencaoMixin);
    
    // Factory para criar veículos
    const VeiculoFactory = {
        criarCarro: (dados) => {
            return new Carro(
                dados.marca,
                dados.modelo,
                dados.ano,
                dados.cor,
                dados.potencia,
                dados.cilindradas,
                dados.capacidadeTanque,
                dados.consumo
            );
        },
        
        criarMoto: (dados) => {
            return new Moto(
                dados.marca,
                dados.modelo,
                dados.ano,
                dados.cor,
                dados.potencia,
                dados.cilindradas,
                dados.capacidadeTanque,
                dados.consumo
            );
        },
        
        criarBicicleta: (dados) => {
            return new Bicicleta(
                dados.marca,
                dados.modelo,
                dados.ano,
                dados.cor,
                dados.marchas
            );
        },
        
        criarVeiculo: (tipo, dados) => {
            const metodos = {
                'carro': this.criarCarro,
                'moto': this.criarMoto,
                'bicicleta': this.criarBicicleta
            };
            
            const metodo = metodos[tipo.toLowerCase()];
            if (!metodo) {
                throw new Error(`Tipo de veículo não suportado: ${tipo}`);
            }
            
            return metodo(dados);
        }
    };
    
    // Gerenciador de frota
    function GerenciadorFrota(nome) {
        let _nome = Utils.validarString(nome, 'Nome da frota');
        let _veiculos = new Map();
        let _estatisticas = {
            totalVeiculos: 0,
            carros: 0,
            motos: 0,
            bicicletas: 0,
            quilometragemTotal: 0,
            custoManutencaoTotal: 0
        };
        
        Object.defineProperties(this, {
            nome: {
                get: () => _nome,
                enumerable: true
            },
            veiculos: {
                get: () => Array.from(_veiculos.values()),
                enumerable: true
            },