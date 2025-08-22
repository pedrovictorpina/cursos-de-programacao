/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 4.1
CRIAÇÃO DE OBJETOS
==============================================

Objetivos de Aprendizagem:
- Compreender diferentes formas de criar objetos em JavaScript
- Dominar object literals, construtores e Object.create()
- Entender propriedades e métodos de objetos
- Aplicar getters e setters
- Usar Object.defineProperty() e Object.defineProperties()
- Conhecer padrões de criação de objetos

⏱️ TEMPO ESTIMADO: 60 minutos
📊 NÍVEL: Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: CRIAÇÃO DE OBJETOS
// ==========================================

/*
OBJETOS EM JAVASCRIPT são coleções de propriedades (chave-valor).
Cada propriedade pode conter:
- Valores primitivos (string, number, boolean, etc.)
- Outros objetos
- Funções (métodos)
- Arrays
- Qualquer tipo de dado JavaScript

FORMAS DE CRIAR OBJETOS:
1. Object Literal {} - mais comum e simples
2. Constructor Function - usando 'new'
3. Object.create() - criação com protótipo específico
4. Class (ES6+) - sintaxe moderna
5. Factory Functions - funções que retornam objetos

PROPRIEDADES:
- Podem ser adicionadas, modificadas ou removidas dinamicamente
- Têm descritores (writable, enumerable, configurable)
- Podem ser acessadas via notação de ponto ou colchetes

MÉTODOS:
- São propriedades que contêm funções
- Têm acesso ao contexto do objeto via 'this'
- Podem ser definidos inline ou atribuídos posteriormente
*/

console.log('=== CRIAÇÃO DE OBJETOS ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== OBJECT LITERALS ==========
console.log('\n--- OBJECT LITERALS ---');

// Forma mais simples e comum de criar objetos
console.log('\n📦 Criando objetos com object literals:');

// Objeto simples
const pessoa = {
    nome: 'João Silva',
    idade: 30,
    email: 'joao@email.com',
    ativo: true
};

console.log('Pessoa:', pessoa);
console.log('Nome:', pessoa.nome);
console.log('Email:', pessoa['email']); // Notação de colchetes

// Objeto com métodos
const calculadora = {
    // Propriedades
    resultado: 0,
    historico: [],
    
    // Métodos
    somar: function(valor) {
        this.resultado += valor;
        this.historico.push(`+${valor} = ${this.resultado}`);
        return this;
    },
    
    subtrair: function(valor) {
        this.resultado -= valor;
        this.historico.push(`-${valor} = ${this.resultado}`);
        return this;
    },
    
    multiplicar: function(valor) {
        this.resultado *= valor;
        this.historico.push(`*${valor} = ${this.resultado}`);
        return this;
    },
    
    dividir: function(valor) {
        if (valor !== 0) {
            this.resultado /= valor;
            this.historico.push(`/${valor} = ${this.resultado}`);
        } else {
            console.log('Erro: Divisão por zero!');
        }
        return this;
    },
    
    limpar: function() {
        this.resultado = 0;
        this.historico = [];
        console.log('Calculadora limpa');
        return this;
    },
    
    obterResultado: function() {
        return this.resultado;
    },
    
    obterHistorico: function() {
        return [...this.historico]; // Retorna cópia
    },
    
    // Método com sintaxe ES6 (sem 'function')
    mostrarInfo() {
        return {
            resultado: this.resultado,
            operacoes: this.historico.length,
            ultimaOperacao: this.historico[this.historico.length - 1] || 'Nenhuma'
        };
    }
};

// Testando calculadora
console.log('\n🧮 Testando calculadora:');
calculadora
    .somar(10)
    .multiplicar(2)
    .subtrair(5)
    .dividir(3);

console.log('Resultado final:', calculadora.obterResultado());
console.log('Histórico:', calculadora.obterHistorico());
console.log('Info:', calculadora.mostrarInfo());

// Objeto com propriedades computadas (ES6+)
const chave = 'cor';
const valor = 'azul';

const carro = {
    marca: 'Toyota',
    modelo: 'Corolla',
    ano: 2023,
    [chave]: valor, // Propriedade computada
    [`${chave}Secundaria`]: 'prata', // Propriedade computada com template
    
    // Método getter
    get descricao() {
        return `${this.marca} ${this.modelo} ${this.ano}`;
    },
    
    // Método setter
    set anoFabricacao(ano) {
        if (ano >= 1900 && ano <= new Date().getFullYear()) {
            this.ano = ano;
        } else {
            console.log('Ano inválido');
        }
    },
    
    // Método para obter idade do carro
    obterIdade() {
        return new Date().getFullYear() - this.ano;
    }
};

console.log('\n🚗 Testando carro:');
console.log('Carro:', carro);
console.log('Descrição (getter):', carro.descricao);
carro.anoFabricacao = 2020; // Usando setter
console.log('Após alterar ano:', carro.descricao);
console.log('Idade do carro:', carro.obterIdade(), 'anos');

// ========== CONSTRUCTOR FUNCTIONS ==========
console.log('\n--- CONSTRUCTOR FUNCTIONS ---');

// Função construtora para criar múltiplos objetos similares
function Produto(nome, preco, categoria) {
    // Propriedades da instância
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.ativo = true;
    this.criadoEm = new Date();
    
    // Método da instância (não recomendado - cria nova função para cada instância)
    this.obterInfo = function() {
        return `${this.nome} - R$ ${this.preco.toFixed(2)}`;
    };
}

// Adicionando métodos ao protótipo (recomendado)
Produto.prototype.aplicarDesconto = function(percentual) {
    if (percentual > 0 && percentual <= 100) {
        const desconto = this.preco * (percentual / 100);
        this.preco -= desconto;
        console.log(`Desconto de ${percentual}% aplicado. Novo preço: R$ ${this.preco.toFixed(2)}`);
    } else {
        console.log('Percentual de desconto inválido');
    }
    return this;
};

Produto.prototype.ativar = function() {
    this.ativo = true;
    console.log(`${this.nome} foi ativado`);
    return this;
};

Produto.prototype.desativar = function() {
    this.ativo = false;
    console.log(`${this.nome} foi desativado`);
    return this;
};

Produto.prototype.obterIdade = function() {
    const agora = new Date();
    const diferenca = agora - this.criadoEm;
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    return dias;
};

// Método estático (pertence à função construtora, não às instâncias)
Produto.criarProdutoPromocional = function(nome, precoOriginal, desconto) {
    const precoComDesconto = precoOriginal * (1 - desconto / 100);
    const produto = new Produto(nome, precoComDesconto, 'promocional');
    produto.precoOriginal = precoOriginal;
    produto.desconto = desconto;
    return produto;
};

// Criando instâncias
console.log('\n🛍️ Testando constructor function:');

const produto1 = new Produto('Notebook', 2500, 'eletrônicos');
const produto2 = new Produto('Mouse', 50, 'eletrônicos');
const produto3 = Produto.criarProdutoPromocional('Teclado', 200, 20); // Produto promocional

console.log('Produto 1:', produto1.obterInfo());
console.log('Produto 2:', produto2.obterInfo());
console.log('Produto 3 (promocional):', produto3.obterInfo());

// Testando métodos
produto1.aplicarDesconto(10);
produto2.desativar();

console.log('\n📊 Status dos produtos:');
console.log('Produto 1 ativo:', produto1.ativo);
console.log('Produto 2 ativo:', produto2.ativo);
console.log('Idade do produto 1:', produto1.obterIdade(), 'dias');

// Verificando instanceof
console.log('\n🔍 Verificando tipos:');
console.log('produto1 instanceof Produto:', produto1 instanceof Produto);
console.log('produto1.constructor === Produto:', produto1.constructor === Produto);

// ========== OBJECT.CREATE() ==========
console.log('\n--- OBJECT.CREATE() ---');

// Criando objeto com protótipo específico
const prototipoAnimal = {
    tipo: 'animal',
    respirar: function() {
        console.log(`${this.nome} está respirando`);
    },
    
    mover: function() {
        console.log(`${this.nome} está se movendo`);
    },
    
    dormir: function() {
        console.log(`${this.nome} está dormindo`);
    },
    
    obterInfo: function() {
        return {
            nome: this.nome,
            especie: this.especie,
            idade: this.idade,
            tipo: this.tipo
        };
    }
};

// Criando objeto com Object.create()
const cachorro = Object.create(prototipoAnimal);
cachorro.nome = 'Rex';
cachorro.especie = 'Canis lupus';
cachorro.idade = 3;
cachorro.raca = 'Labrador';

// Adicionando método específico
cachorro.latir = function() {
    console.log(`${this.nome} está latindo: Au au!`);
};

cachorro.buscarBola = function() {
    console.log(`${this.nome} está buscando a bola`);
};

// Criando outro animal
const gato = Object.create(prototipoAnimal);
gato.nome = 'Mimi';
gato.especie = 'Felis catus';
gato.idade = 2;
gato.raca = 'Siamês';

gato.miar = function() {
    console.log(`${this.nome} está miando: Miau!`);
};

gato.arranhar = function() {
    console.log(`${this.nome} está arranhando`);
};

console.log('\n🐕 Testando cachorro:');
console.log('Info do cachorro:', cachorro.obterInfo());
cachorro.respirar();
cachorro.latir();
cachorro.buscarBola();

console.log('\n🐱 Testando gato:');
console.log('Info do gato:', gato.obterInfo());
gato.mover();
gato.miar();
gato.arranhar();

// Verificando protótipo
console.log('\n🔗 Verificando protótipos:');
console.log('Protótipo do cachorro:', Object.getPrototypeOf(cachorro) === prototipoAnimal);
console.log('Protótipo do gato:', Object.getPrototypeOf(gato) === prototipoAnimal);

// ========== OBJECT.CREATE() COM DESCRITORES ==========
console.log('\n--- OBJECT.CREATE() COM DESCRITORES ---');

// Criando objeto com propriedades e descritores específicos
const contaBancaria = Object.create(null, {
    // Propriedade privada (não enumerável)
    _saldo: {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: false
    },
    
    // Propriedade pública
    titular: {
        value: '',
        writable: true,
        enumerable: true,
        configurable: true
    },
    
    // Propriedade somente leitura
    numeroConta: {
        value: Math.random().toString(36).substr(2, 9),
        writable: false,
        enumerable: true,
        configurable: false
    },
    
    // Getter para saldo
    saldo: {
        get: function() {
            return this._saldo;
        },
        enumerable: true,
        configurable: true
    },
    
    // Método depositar
    depositar: {
        value: function(valor) {
            if (valor > 0) {
                this._saldo += valor;
                console.log(`Depósito de R$ ${valor.toFixed(2)} realizado. Saldo atual: R$ ${this._saldo.toFixed(2)}`);
            } else {
                console.log('Valor de depósito deve ser positivo');
            }
            return this;
        },
        writable: false,
        enumerable: false,
        configurable: false
    },
    
    // Método sacar
    sacar: {
        value: function(valor) {
            if (valor > 0 && valor <= this._saldo) {
                this._saldo -= valor;
                console.log(`Saque de R$ ${valor.toFixed(2)} realizado. Saldo atual: R$ ${this._saldo.toFixed(2)}`);
            } else if (valor > this._saldo) {
                console.log('Saldo insuficiente');
            } else {
                console.log('Valor de saque deve ser positivo');
            }
            return this;
        },
        writable: false,
        enumerable: false,
        configurable: false
    },
    
    // Método transferir
    transferir: {
        value: function(valor, contaDestino) {
            if (valor > 0 && valor <= this._saldo) {
                this._saldo -= valor;
                contaDestino.depositar(valor);
                console.log(`Transferência de R$ ${valor.toFixed(2)} realizada para conta ${contaDestino.numeroConta}`);
            } else {
                console.log('Transferência inválida');
            }
            return this;
        },
        writable: false,
        enumerable: false,
        configurable: false
    }
});

// Criando contas
const conta1 = Object.create(contaBancaria);
conta1.titular = 'João Silva';

const conta2 = Object.create(contaBancaria);
conta2.titular = 'Maria Santos';

console.log('\n🏦 Testando contas bancárias:');
console.log('Conta 1 - Titular:', conta1.titular, '- Número:', conta1.numeroConta);
console.log('Conta 2 - Titular:', conta2.titular, '- Número:', conta2.numeroConta);

// Testando operações
conta1.depositar(1000);
conta1.sacar(200);
conta2.depositar(500);
conta1.transferir(100, conta2);

console.log('\n💰 Saldos finais:');
console.log('Saldo conta 1:', conta1.saldo);
console.log('Saldo conta 2:', conta2.saldo);

// Tentando modificar propriedade somente leitura
try {
    conta1.numeroConta = '123456789';
    console.log('Número da conta após tentativa de alteração:', conta1.numeroConta);
} catch (error) {
    console.log('Erro ao tentar alterar número da conta:', error.message);
}

// ========== FACTORY FUNCTIONS ==========
console.log('\n--- FACTORY FUNCTIONS ---');

// Factory function para criar objetos de forma mais flexível
function criarUsuario(nome, email, tipo = 'comum') {
    // Validações
    if (!nome || !email) {
        throw new Error('Nome e email são obrigatórios');
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Email inválido');
    }
    
    // Dados privados usando closure
    let senha = null;
    let tentativasLogin = 0;
    const maxTentativas = 3;
    let bloqueado = false;
    const historico = [];
    
    // Função privada para registrar ação
    function registrarAcao(acao) {
        historico.push({
            acao,
            timestamp: new Date().toISOString(),
            ip: '127.0.0.1' // Simulado
        });
    }
    
    // Objeto público
    const usuario = {
        // Propriedades públicas
        nome,
        email,
        tipo,
        ativo: true,
        criadoEm: new Date(),
        
        // Métodos públicos
        definirSenha: function(novaSenha) {
            if (novaSenha && novaSenha.length >= 8) {
                senha = novaSenha; // Em produção, seria hasheada
                registrarAcao('senha_definida');
                console.log('Senha definida com sucesso');
                return true;
            } else {
                console.log('Senha deve ter pelo menos 8 caracteres');
                return false;
            }
        },
        
        login: function(senhaInformada) {
            if (bloqueado) {
                console.log('Usuário bloqueado por excesso de tentativas');
                return false;
            }
            
            if (senha === senhaInformada) {
                tentativasLogin = 0;
                registrarAcao('login_sucesso');
                console.log(`Login realizado com sucesso para ${this.nome}`);
                return true;
            } else {
                tentativasLogin++;
                registrarAcao('login_falha');
                
                if (tentativasLogin >= maxTentativas) {
                    bloqueado = true;
                    registrarAcao('usuario_bloqueado');
                    console.log('Usuário bloqueado por excesso de tentativas');
                } else {
                    console.log(`Senha incorreta. Tentativas restantes: ${maxTentativas - tentativasLogin}`);
                }
                return false;
            }
        },
        
        desbloquear: function() {
            if (this.tipo === 'admin') {
                bloqueado = false;
                tentativasLogin = 0;
                registrarAcao('usuario_desbloqueado');
                console.log('Usuário desbloqueado');
                return true;
            } else {
                console.log('Apenas administradores podem desbloquear usuários');
                return false;
            }
        },
        
        alterarTipo: function(novoTipo) {
            if (this.tipo === 'admin') {
                const tiposValidos = ['comum', 'premium', 'admin'];
                if (tiposValidos.includes(novoTipo)) {
                    this.tipo = novoTipo;
                    registrarAcao(`tipo_alterado_para_${novoTipo}`);
                    console.log(`Tipo alterado para: ${novoTipo}`);
                    return true;
                } else {
                    console.log('Tipo inválido');
                    return false;
                }
            } else {
                console.log('Apenas administradores podem alterar tipos');
                return false;
            }
        },
        
        obterEstatisticas: function() {
            return {
                nome: this.nome,
                email: this.email,
                tipo: this.tipo,
                ativo: this.ativo,
                criadoEm: this.criadoEm,
                temSenha: senha !== null,
                bloqueado,
                tentativasLogin,
                totalAcoes: historico.length
            };
        },
        
        obterHistorico: function() {
            if (this.tipo === 'admin') {
                return [...historico]; // Retorna cópia
            } else {
                console.log('Apenas administradores podem ver o histórico');
                return [];
            }
        },
        
        // Método para serialização (excluindo dados sensíveis)
        toJSON: function() {
            return {
                nome: this.nome,
                email: this.email,
                tipo: this.tipo,
                ativo: this.ativo,
                criadoEm: this.criadoEm
            };
        }
    };
    
    // Registrar criação
    registrarAcao('usuario_criado');
    
    return usuario;
}

// Factory function para administradores
function criarAdmin(nome, email) {
    const admin = criarUsuario(nome, email, 'admin');
    
    // Métodos específicos de admin
    admin.criarUsuario = function(nomeUsuario, emailUsuario, tipoUsuario = 'comum') {
        try {
            const novoUsuario = criarUsuario(nomeUsuario, emailUsuario, tipoUsuario);
            console.log(`Admin ${this.nome} criou usuário: ${nomeUsuario}`);
            return novoUsuario;
        } catch (error) {
            console.log('Erro ao criar usuário:', error.message);
            return null;
        }
    };
    
    admin.listarUsuarios = function(usuarios) {
        console.log('\n👥 Lista de usuários:');
        usuarios.forEach((usuario, index) => {
            const stats = usuario.obterEstatisticas();
            console.log(`${index + 1}. ${stats.nome} (${stats.email}) - Tipo: ${stats.tipo} - Ativo: ${stats.ativo}`);
        });
    };
    
    return admin;
}

// Testando factory functions
console.log('\n👤 Testando factory functions:');

try {
    // Criando usuários
    const usuario1 = criarUsuario('João Silva', 'joao@email.com');
    const usuario2 = criarUsuario('Maria Santos', 'maria@email.com', 'premium');
    const admin = criarAdmin('Admin User', 'admin@email.com');
    
    // Definindo senhas
    usuario1.definirSenha('minhasenha123');
    usuario2.definirSenha('outrasenha456');
    admin.definirSenha('adminpass789');
    
    // Testando login
    console.log('\n🔐 Testando logins:');
    usuario1.login('senhaerrada'); // Falha
    usuario1.login('minhasenha123'); // Sucesso
    
    usuario2.login('senha123'); // Falha
    usuario2.login('senha456'); // Falha
    usuario2.login('senha789'); // Falha - usuário bloqueado
    
    // Admin desbloqueando usuário
    admin.login('adminpass789');
    usuario2.desbloquear(); // Falha - não é admin
    admin.desbloquear(); // Sucesso - é admin (mas não está bloqueado)
    
    // Criando usuário via admin
    const novoUsuario = admin.criarUsuario('Pedro Costa', 'pedro@email.com');
    
    // Listando usuários
    const todosUsuarios = [usuario1, usuario2, admin, novoUsuario].filter(u => u !== null);
    admin.listarUsuarios(todosUsuarios);
    
    // Estatísticas
    console.log('\n📊 Estatísticas:');
    console.log('Usuário 1:', usuario1.obterEstatisticas());
    console.log('Usuário 2:', usuario2.obterEstatisticas());
    
    // Histórico (apenas admin pode ver)
    console.log('\n📋 Histórico do admin:', admin.obterHistorico().slice(-3));
    
} catch (error) {
    console.log('Erro:', error.message);
}

// ========== OBJECT.DEFINEPROPERTY() ==========
console.log('\n--- OBJECT.DEFINEPROPERTY() ---');

// Criando objeto com propriedades controladas
const configuracao = {};

// Propriedade somente leitura
Object.defineProperty(configuracao, 'versao', {
    value: '1.0.0',
    writable: false,
    enumerable: true,
    configurable: false
});

// Propriedade com getter e setter
let _tema = 'claro';
Object.defineProperty(configuracao, 'tema', {
    get: function() {
        console.log('Obtendo tema:', _tema);
        return _tema;
    },
    set: function(novoTema) {
        const temasValidos = ['claro', 'escuro', 'auto'];
        if (temasValidos.includes(novoTema)) {
            console.log(`Alterando tema de '${_tema}' para '${novoTema}'`);
            _tema = novoTema;
        } else {
            console.log('Tema inválido. Temas válidos:', temasValidos);
        }
    },
    enumerable: true,
    configurable: true
});

// Propriedade computada
Object.defineProperty(configuracao, 'info', {
    get: function() {
        return {
            versao: this.versao,
            tema: _tema,
            timestamp: new Date().toISOString()
        };
    },
    enumerable: true,
    configurable: true
});

// Propriedade privada (não enumerável)
let _chaveApi = 'abc123def456';
Object.defineProperty(configuracao, 'chaveApi', {
    get: function() {
        return _chaveApi.substring(0, 6) + '***'; // Mascarar chave
    },
    set: function(novaChave) {
        if (novaChave && novaChave.length >= 12) {
            _chaveApi = novaChave;
            console.log('Chave API atualizada');
        } else {
            console.log('Chave API deve ter pelo menos 12 caracteres');
        }
    },
    enumerable: false, // Não aparece em Object.keys()
    configurable: true
});

console.log('\n⚙️ Testando Object.defineProperty():');
console.log('Configuração inicial:', configuracao);
console.log('Versão:', configuracao.versao);

// Testando getter/setter
console.log('\n🎨 Testando tema:');
console.log('Tema atual:', configuracao.tema);
configuração.tema = 'escuro';
configuração.tema = 'invalido'; // Deve falhar

// Testando propriedade computada
console.log('\n📊 Info da configuração:', configuracao.info);

// Testando propriedade privada
console.log('\n🔐 Chave API (mascarada):', configuracao.chaveApi);
configuração.chaveApi = 'nova123chave456';
console.log('Chave API após alteração:', configuracao.chaveApi);

// Verificando enumerabilidade
console.log('\n🔍 Propriedades enumeráveis:', Object.keys(configuracao));
console.log('Todas as propriedades:', Object.getOwnPropertyNames(configuracao));

// Tentando alterar propriedade somente leitura
try {
    configuracao.versao = '2.0.0';
    console.log('Versão após tentativa de alteração:', configuracao.versao);
} catch (error) {
    console.log('Erro ao alterar versão:', error.message);
}

// ========== OBJECT.DEFINEPROPERTIES() ==========
console.log('\n--- OBJECT.DEFINEPROPERTIES() ---');

// Criando objeto com múltiplas propriedades de uma vez
const produto = {};

Object.defineProperties(produto, {
    nome: {
        value: 'Smartphone',
        writable: true,
        enumerable: true,
        configurable: true
    },
    
    preco: {
        value: 1000,
        writable: true,
        enumerable: true,
        configurable: true
    },
    
    categoria: {
        value: 'eletrônicos',
        writable: true,
        enumerable: true,
        configurable: true
    },
    
    // Propriedade computada para desconto
    precoComDesconto: {
        get: function() {
            return this.preco * 0.9; // 10% de desconto
        },
        enumerable: true,
        configurable: true
    },
    
    // Propriedade para descrição completa
    descricaoCompleta: {
        get: function() {
            return `${this.nome} - ${this.categoria} - R$ ${this.preco.toFixed(2)}`;
        },
        enumerable: true,
        configurable: true
    },
    
    // Método para aplicar desconto
    aplicarDesconto: {
        value: function(percentual) {
            if (percentual > 0 && percentual <= 50) {
                this.preco *= (1 - percentual / 100);
                console.log(`Desconto de ${percentual}% aplicado. Novo preço: R$ ${this.preco.toFixed(2)}`);
            } else {
                console.log('Desconto deve estar entre 1% e 50%');
            }
            return this;
        },
        writable: false,
        enumerable: false,
        configurable: false
    },
    
    // Propriedade privada para ID
    _id: {
        value: Math.random().toString(36).substr(2, 9),
        writable: false,
        enumerable: false,
        configurable: false
    },
    
    // Getter para ID (somente leitura)
    id: {
        get: function() {
            return this._id;
        },
        enumerable: true,
        configurable: false
    }
});

console.log('\n📱 Testando produto com defineProperties:');
console.log('Produto:', produto);
console.log('ID:', produto.id);
console.log('Descrição completa:', produto.descricaoCompleta);
console.log('Preço com desconto:', produto.precoComDesconto);

// Aplicando desconto
produto.aplicarDesconto(15);
console.log('Descrição após desconto:', produto.descricaoCompleta);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Biblioteca
console.log('\n--- EXERCÍCIO 1: SISTEMA DE BIBLIOTECA ---');

// Factory function para criar livros
function criarLivro(titulo, autor, isbn, ano) {
    // Validações
    if (!titulo || !autor || !isbn) {
        throw new Error('Título, autor e ISBN são obrigatórios');
    }
    
    if (ano && (ano < 1000 || ano > new Date().getFullYear())) {
        throw new Error('Ano inválido');
    }
    
    // Estado privado
    let disponivel = true;
    let emprestadoPara = null;
    let dataEmprestimo = null;
    const historicoEmprestimos = [];
    
    return {
        // Propriedades públicas
        titulo,
        autor,
        isbn,
        ano: ano || null,
        
        // Getters
        get disponivel() {
            return disponivel;
        },
        
        get emprestadoPara() {
            return emprestadoPara;
        },
        
        get dataEmprestimo() {
            return dataEmprestimo;
        },
        
        get diasEmprestado() {
            if (!dataEmprestimo) return 0;
            return Math.floor((new Date() - dataEmprestimo) / (1000 * 60 * 60 * 24));
        },
        
        // Métodos
        emprestar: function(nomeUsuario) {
            if (!disponivel) {
                console.log(`Livro "${this.titulo}" já está emprestado para ${emprestadoPara}`);
                return false;
            }
            
            disponivel = false;
            emprestadoPara = nomeUsuario;
            dataEmprestimo = new Date();
            
            historicoEmprestimos.push({
                usuario: nomeUsuario,
                dataEmprestimo: new Date(dataEmprestimo),
                dataRetorno: null
            });
            
            console.log(`Livro "${this.titulo}" emprestado para ${nomeUsuario}`);
            return true;
        },
        
        devolver: function() {
            if (disponivel) {
                console.log(`Livro "${this.titulo}" já está disponível`);
                return false;
            }
            
            // Atualizar histórico
            const ultimoEmprestimo = historicoEmprestimos[historicoEmprestimos.length - 1];
            if (ultimoEmprestimo) {
                ultimoEmprestimo.dataRetorno = new Date();
            }
            
            console.log(`Livro "${this.titulo}" devolvido por ${emprestadoPara} após ${this.diasEmprestado} dias`);
            
            disponivel = true;
            emprestadoPara = null;
            dataEmprestimo = null;
            
            return true;
        },
        
        obterHistorico: function() {
            return historicoEmprestimos.map(emp => ({
                usuario: emp.usuario,
                dataEmprestimo: emp.dataEmprestimo.toLocaleDateString('pt-BR'),
                dataRetorno: emp.dataRetorno ? emp.dataRetorno.toLocaleDateString('pt-BR') : 'Não devolvido',
                diasEmprestado: emp.dataRetorno ? 
                    Math.floor((emp.dataRetorno - emp.dataEmprestimo) / (1000 * 60 * 60 * 24)) : 
                    this.diasEmprestado
            }));
        },
        
        obterInfo: function() {
            return {
                titulo: this.titulo,
                autor: this.autor,
                isbn: this.isbn,
                ano: this.ano,
                disponivel: this.disponivel,
                emprestadoPara: this.emprestadoPara,
                diasEmprestado: this.diasEmprestado,
                totalEmprestimos: historicoEmprestimos.length
            };
        }
    };
}

// Sistema de biblioteca
const biblioteca = {
    livros: [],
    usuarios: [],
    
    adicionarLivro: function(titulo, autor, isbn, ano) {
        try {
            const livro = criarLivro(titulo, autor, isbn, ano);
            this.livros.push(livro);
            console.log(`Livro "${titulo}" adicionado à biblioteca`);
            return livro;
        } catch (error) {
            console.log('Erro ao adicionar livro:', error.message);
            return null;
        }
    },
    
    buscarLivro: function(criterio, valor) {
        return this.livros.filter(livro => {
            if (criterio === 'titulo') return livro.titulo.toLowerCase().includes(valor.toLowerCase());
            if (criterio === 'autor') return livro.autor.toLowerCase().includes(valor.toLowerCase());
            if (criterio === 'isbn') return livro.isbn === valor;
            return false;
        });
    },
    
    listarLivrosDisponiveis: function() {
        return this.livros.filter(livro => livro.disponivel);
    },
    
    listarLivrosEmprestados: function() {
        return this.livros.filter(livro => !livro.disponivel);
    },
    
    emprestarLivro: function(isbn, nomeUsuario) {
        const livro = this.livros.find(l => l.isbn === isbn);
        if (!livro) {
            console.log('Livro não encontrado');
            return false;
        }
        
        return livro.emprestar(nomeUsuario);
    },
    
    devolverLivro: function(isbn) {
        const livro = this.livros.find(l => l.isbn === isbn);
        if (!livro) {
            console.log('Livro não encontrado');
            return false;
        }
        
        return livro.devolver();
    },
    
    obterEstatisticas: function() {
        const total = this.livros.length;
        const disponiveis = this.listarLivrosDisponiveis().length;
        const emprestados = this.listarLivrosEmprestados().length;
        
        return {
            totalLivros: total,
            disponiveis,
            emprestados,
            taxaOcupacao: total > 0 ? ((emprestados / total) * 100).toFixed(1) + '%' : '0%'
        };
    }
};

// Testando sistema de biblioteca
console.log('\n📚 Testando sistema de biblioteca:');

// Adicionando livros
biblioteca.adicionarLivro('1984', 'George Orwell', '978-0451524935', 1949);
biblioteca.adicionarLivro('Dom Casmurro', 'Machado de Assis', '978-8525406958', 1899);
biblioteca.adicionarLivro('O Cortiço', 'Aluísio Azevedo', '978-8508133024', 1890);

// Emprestando livros
biblioteca.emprestarLivro('978-0451524935', 'João Silva');
biblioteca.emprestarLivro('978-8525406958', 'Maria Santos');

// Tentando emprestar livro já emprestado
biblioteca.emprestarLivro('978-0451524935', 'Pedro Costa');

// Listando livros
console.log('\n📖 Livros disponíveis:');
biblioteca.listarLivrosDisponiveis().forEach(livro => {
    console.log(`- ${livro.titulo} (${livro.autor})`);
});

console.log('\n📚 Livros emprestados:');
biblioteca.listarLivrosEmprestados().forEach(livro => {
    const info = livro.obterInfo();
    console.log(`- ${info.titulo} - Emprestado para: ${info.emprestadoPara} (${info.diasEmprestado} dias)`);
});

// Devolvendo livro
biblioteca.devolverLivro('978-0451524935');

// Estatísticas
console.log('\n📊 Estatísticas da biblioteca:', biblioteca.obterEstatisticas());

// EXERCÍCIO 2: Sistema de E-commerce
console.log('\n--- EXERCÍCIO 2: SISTEMA DE E-COMMERCE ---');

// Constructor function para produtos
function ProdutoEcommerce(nome, preco, categoria, estoque) {
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.estoque = estoque;
    this.ativo = true;
    this.criadoEm = new Date();
    this.avaliacoes = [];
    this.vendas = 0;
}

// Métodos no protótipo
ProdutoEcommerce.prototype.adicionarAvaliacao = function(nota, comentario, usuario) {
    if (nota >= 1 && nota <= 5) {
        this.avaliacoes.push({
            nota,
            comentario,
            usuario,
            data: new Date()
        });
        console.log(`Avaliação adicionada: ${nota} estrelas`);
        return true;
    } else {
        console.log('Nota deve estar entre 1 e 5');
        return false;
    }
};

ProdutoEcommerce.prototype.obterMediaAvaliacoes = function() {
    if (this.avaliacoes.length === 0) return 0;
    const soma = this.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
    return (soma / this.avaliacoes.length).toFixed(1);
};

ProdutoEcommerce.prototype.vender = function(quantidade = 1) {
    if (quantidade <= this.estoque) {
        this.estoque -= quantidade;
        this.vendas += quantidade;
        console.log(`${quantidade} unidade(s) de "${this.nome}" vendida(s)`);
        return true;
    } else {
        console.log(`Estoque insuficiente. Disponível: ${this.estoque}`);
        return false;
    }
};

ProdutoEcommerce.prototype.reabastecer = function(quantidade) {
    this.estoque += quantidade;
    console.log(`Estoque reabastecido: +${quantidade} unidades`);
    return this.estoque;
};

ProdutoEcommerce.prototype.obterInfo = function() {
    return {
        nome: this.nome,
        preco: this.preco,
        categoria: this.categoria,
        estoque: this.estoque,
        ativo: this.ativo,
        vendas: this.vendas,
        mediaAvaliacoes: this.obterMediaAvaliacoes(),
        totalAvaliacoes: this.avaliacoes.length
    };
};

// Factory para carrinho de compras
function criarCarrinho() {
    const itens = [];
    
    return {
        adicionarItem: function(produto, quantidade = 1) {
            const itemExistente = itens.find(item => item.produto === produto);
            
            if (itemExistente) {
                itemExistente.quantidade += quantidade;
                console.log(`Quantidade atualizada: ${produto.nome} (${itemExistente.quantidade})`);
            } else {
                itens.push({ produto, quantidade });
                console.log(`Item adicionado: ${produto.nome} (${quantidade})`);
            }
            
            return this;
        },
        
        removerItem: function(produto) {
            const index = itens.findIndex(item => item.produto === produto);
            if (index > -1) {
                const item = itens.splice(index, 1)[0];
                console.log(`Item removido: ${item.produto.nome}`);
                return true;
            } else {
                console.log('Item não encontrado no carrinho');
                return false;
            }
        },
        
        alterarQuantidade: function(produto, novaQuantidade) {
            const item = itens.find(item => item.produto === produto);
            if (item) {
                if (novaQuantidade > 0) {
                    item.quantidade = novaQuantidade;
                    console.log(`Quantidade alterada: ${produto.nome} (${novaQuantidade})`);
                } else {
                    this.removerItem(produto);
                }
                return true;
            } else {
                console.log('Item não encontrado no carrinho');
                return false;
            }
        },
        
        obterItens: function() {
            return itens.map(item => ({
                produto: item.produto.nome,
                preco: item.produto.preco,
                quantidade: item.quantidade,
                subtotal: item.produto.preco * item.quantidade
            }));
        },
        
        obterTotal: function() {
            return itens.reduce((total, item) => {
                return total + (item.produto.preco * item.quantidade);
            }, 0);
        },
        
        limpar: function() {
            const totalItens = itens.length;
            itens.length = 0;
            console.log(`Carrinho limpo: ${totalItens} itens removidos`);
            return this;
        },
        
        finalizar: function() {
            if (itens.length === 0) {
                console.log('Carrinho vazio');
                return null;
            }
            
            // Verificar estoque e processar venda
            const pedido = {
                itens: [],
                total: 0,
                data: new Date(),
                status: 'processando'
            };
            
            let pedidoValido = true;
            
            for (const item of itens) {
                if (item.produto.estoque >= item.quantidade) {
                    item.produto.vender(item.quantidade);
                    pedido.itens.push({
                        produto: item.produto.nome,
                        preco: item.produto.preco,
                        quantidade: item.quantidade,
                        subtotal: item.produto.preco * item.quantidade
                    });
                    pedido.total += item.produto.preco * item.quantidade;
                } else {
                    console.log(`Estoque insuficiente para ${item.produto.nome}`);
                    pedidoValido = false;
                    break;
                }
            }
            
            if (pedidoValido) {
                pedido.status = 'confirmado';
                this.limpar();
                console.log(`Pedido finalizado: R$ ${pedido.total.toFixed(2)}`);
                return pedido;
            } else {
                pedido.status = 'cancelado';
                console.log('Pedido cancelado por falta de estoque');
                return pedido;
            }
        }
    };
}

// Testando sistema de e-commerce
console.log('\n🛒 Testando sistema de e-commerce:');

// Criando produtos
const produto1 = new ProdutoEcommerce('Smartphone', 800, 'eletrônicos', 10);
const produto2 = new ProdutoEcommerce('Fone de Ouvido', 150, 'eletrônicos', 25);
const produto3 = new ProdutoEcommerce('Camiseta', 50, 'roupas', 100);

// Adicionando avaliações
produto1.adicionarAvaliacao(5, 'Excelente produto!', 'João');
produto1.adicionarAvaliacao(4, 'Muito bom, recomendo', 'Maria');
produto2.adicionarAvaliacao(5, 'Som perfeito', 'Pedro');

// Criando carrinho
const carrinho = criarCarrinho();

// Adicionando itens ao carrinho
carrinho
    .adicionarItem(produto1, 2)
    .adicionarItem(produto2, 1)
    .adicionarItem(produto3, 3);

console.log('\n🛍️ Itens no carrinho:');
console.log(carrinho.obterItens());
console.log('Total do carrinho: R$', carrinho.obterTotal().toFixed(2));

// Alterando quantidade
carrinho.alterarQuantidade(produto1, 1);

// Finalizando pedido
const pedido = carrinho.finalizar();
console.log('\n📦 Pedido:', pedido);

// Verificando estoque após venda
console.log('\n📊 Informações dos produtos após venda:');
console.log('Produto 1:', produto1.obterInfo());
console.log('Produto 2:', produto2.obterInfo());
console.log('Produto 3:', produto3.obterInfo());

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Use Object.freeze() para objetos imutáveis
console.log('\n--- DICA 1: Objetos Imutáveis ---');

const configImutavel = Object.freeze({
    API_URL: 'https://api.exemplo.com',
    TIMEOUT: 5000,
    MAX_RETRIES: 3
});

// Tentativa de modificação (falha silenciosamente em modo não-strict)
configImutavel.API_URL = 'https://api.malicioso.com';
console.log('✅ Config protegida:', configImutavel.API_URL);

// DICA 2: Use Object.seal() para permitir modificação mas não adição/remoção
console.log('\n--- DICA 2: Object.seal() ---');

const configSelada = Object.seal({
    tema: 'claro',
    idioma: 'pt-BR'
});

// Modificação permitida
configSelada.tema = 'escuro';
console.log('✅ Tema alterado:', configSelada.tema);

// Adição não permitida
configSelada.novaPropriedade = 'valor';
console.log('❌ Nova propriedade não adicionada:', configSelada.novaPropriedade);

// DICA 3: Use WeakMap para associações privadas
console.log('\n--- DICA 3: WeakMap para Privacidade ---');

const dadosPrivados = new WeakMap();

function criarContaSegura(titular, saldoInicial = 0) {
    const conta = {
        titular,
        
        depositar(valor) {
            const dados = dadosPrivados.get(this);
            dados.saldo += valor;
            console.log(`Depósito: R$ ${valor}. Saldo: R$ ${dados.saldo}`);
        },
        
        obterSaldo() {
            return dadosPrivados.get(this).saldo;
        }
    };
    
    // Dados privados não acessíveis externamente
    dadosPrivados.set(conta, { saldo: saldoInicial });
    
    return conta;
}

const contaSegura = criarContaSegura('João', 1000);
contaSegura.depositar(500);
console.log('✅ Saldo protegido:', contaSegura.obterSaldo());

// DICA 4: Use Proxy para interceptação avançada
console.log('\n--- DICA 4: Proxy para Interceptação ---');

const objetoComLog = new Proxy({}, {
    set(target, property, value) {
        console.log(`🔍 Definindo ${property} = ${value}`);
        target[property] = value;
        return true;
    },
    
    get(target, property) {
        console.log(`🔍 Acessando ${property}`);
        return target[property];
    }
});

objetoComLog.nome = 'Teste';
const nome = objetoComLog.nome;

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Working with Objects: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Working_with_Objects');
console.log('📚 MDN - Object.create(): https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create');
console.log('📚 MDN - Object.defineProperty(): https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty');
console.log('📚 JavaScript.info - Objects: https://javascript.info/object');
console.log('📚 You Don\'t Know JS - this & Object Prototypes: https://github.com/getify/You-Dont-Know-JS');

console.log('\n✅ Módulo 4.1 - Criação de Objetos concluído!');
console.log('📚 Próximo: Protótipos e Herança');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Produto,
        criarUsuario,
        criarAdmin,
        criarLivro,
        biblioteca,
        ProdutoEcommerce,
        criarCarrinho,
        criarContaSegura
    };
}