/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 3
FUNÇÕES E ESCOPOS
==============================================

Neste módulo você aprenderá:
- Declaração e chamada de funções
- Parâmetros e argumentos
- Valores de retorno
- Escopo global vs local
- Hoisting (elevação)
- Closures (fechamentos)
- Arrow functions
- Funções como valores
- Callbacks básicos

==============================================
*/

// ==========================================
// 1. DECLARAÇÃO DE FUNÇÕES
// ==========================================

/*
Funções são blocos de código reutilizáveis que executam uma tarefa específica.
Elas são fundamentais para organizar e modularizar o código.

Sintaxe básica:
function nomeDaFuncao(parametros) {
    // código da função
    return valor; // opcional
}
*/

console.log("=== DECLARAÇÃO DE FUNÇÕES ===");

// Função simples sem parâmetros
function saudar() {
    console.log("Olá! Bem-vindo ao curso de JavaScript!");
}

// Chamando a função
saudar();

// Função com parâmetros
function saudarPessoa(nome) {
    console.log(`Olá, ${nome}! Como você está?`);
}

saudarPessoa("Maria");
saudarPessoa("João");

// Função com múltiplos parâmetros
function somar(a, b) {
    let resultado = a + b;
    console.log(`${a} + ${b} = ${resultado}`);
    return resultado; // Retorna o valor para quem chamou
}

let soma = somar(5, 3);
console.log(`Resultado armazenado: ${soma}`);

// ==========================================
// 2. PARÂMETROS E ARGUMENTOS
// ==========================================

console.log("\n=== PARÂMETROS E ARGUMENTOS ===");

// Parâmetros com valores padrão (ES6+)
function apresentar(nome, idade = 18, cidade = "São Paulo") {
    console.log(`Nome: ${nome}, Idade: ${idade}, Cidade: ${cidade}`);
}

apresentar("Ana"); // Usa valores padrão para idade e cidade
apresentar("Carlos", 25); // Usa valor padrão apenas para cidade
apresentar("Beatriz", 30, "Rio de Janeiro"); // Todos os valores fornecidos

// Função com número variável de argumentos
function calcularMedia(...numeros) {
    console.log(`\nCalculando média de: ${numeros}`);
    
    if (numeros.length === 0) {
        return 0;
    }
    
    let soma = 0;
    for (let numero of numeros) {
        soma += numero;
    }
    
    let media = soma / numeros.length;
    console.log(`Média: ${media.toFixed(2)}`);
    return media;
}

calcularMedia(8, 7, 9);
calcularMedia(10, 8, 6, 9, 7);
calcularMedia(); // Array vazio

// Desestruturação de parâmetros
function criarPerfil({nome, idade, profissao = "Não informado"}) {
    console.log(`\nPerfil criado:`);
    console.log(`Nome: ${nome}`);
    console.log(`Idade: ${idade}`);
    console.log(`Profissão: ${profissao}`);
}

criarPerfil({nome: "Pedro", idade: 28, profissao: "Desenvolvedor"});
criarPerfil({nome: "Laura", idade: 22}); // profissao usa valor padrão

// ==========================================
// 3. VALORES DE RETORNO
// ==========================================

console.log("\n=== VALORES DE RETORNO ===");

// Função que retorna um valor
function calcularAreaRetangulo(largura, altura) {
    return largura * altura;
}

let area = calcularAreaRetangulo(5, 3);
console.log(`Área do retângulo: ${area}`);

// Função que retorna múltiplos valores (usando objeto)
function calcularCirculo(raio) {
    const PI = 3.14159;
    return {
        raio: raio,
        diametro: raio * 2,
        circunferencia: 2 * PI * raio,
        area: PI * raio * raio
    };
}

let circulo = calcularCirculo(5);
console.log("\nDados do círculo:");
console.log(`Raio: ${circulo.raio}`);
console.log(`Diâmetro: ${circulo.diametro}`);
console.log(`Circunferência: ${circulo.circunferencia.toFixed(2)}`);
console.log(`Área: ${circulo.area.toFixed(2)}`);

// Função que retorna múltiplos valores (usando array)
function obterNomeCompleto(nomeCompleto) {
    let partes = nomeCompleto.split(" ");
    return [partes[0], partes[partes.length - 1]];
}

let [primeiroNome, ultimoNome] = obterNomeCompleto("João Silva Santos");
console.log(`\nPrimeiro nome: ${primeiroNome}`);
console.log(`Último nome: ${ultimoNome}`);

// Return antecipado (early return)
function verificarIdade(idade) {
    if (idade < 0) {
        return "Idade inválida";
    }
    
    if (idade < 18) {
        return "Menor de idade";
    }
    
    if (idade >= 65) {
        return "Idoso";
    }
    
    return "Adulto";
}

console.log(`\nClassificação por idade:`);
console.log(`15 anos: ${verificarIdade(15)}`);
console.log(`25 anos: ${verificarIdade(25)}`);
console.log(`70 anos: ${verificarIdade(70)}`);
console.log(`-5 anos: ${verificarIdade(-5)}`);

// ==========================================
// 4. ESCOPO GLOBAL VS LOCAL
// ==========================================

console.log("\n=== ESCOPO GLOBAL VS LOCAL ===");

// Variável global
let variavelGlobal = "Eu sou global!";

function exemploEscopo() {
    // Variável local
    let variavelLocal = "Eu sou local!";
    
    console.log("Dentro da função:");
    console.log("- Variável global:", variavelGlobal); // ✅ Acessível
    console.log("- Variável local:", variavelLocal);   // ✅ Acessível
}

exemploEscopo();

console.log("\nFora da função:");
console.log("- Variável global:", variavelGlobal); // ✅ Acessível
// console.log("- Variável local:", variavelLocal); // ❌ Erro: não definida

// Shadowing (sombreamento)
let nome = "Global";

function exemploShadowing() {
    let nome = "Local"; // Sombreia a variável global
    console.log(`\nDentro da função: ${nome}`); // "Local"
}

exemploShadowing();
console.log(`Fora da função: ${nome}`); // "Global"

// Escopo de bloco com let e const
function exemploEscopoBloco() {
    console.log("\n=== Escopo de Bloco ===");
    
    if (true) {
        let variavelBloco = "Só existe neste bloco";
        const CONSTANTE_BLOCO = "Também só existe aqui";
        console.log("Dentro do if:", variavelBloco);
    }
    
    // console.log(variavelBloco); // ❌ Erro: não definida fora do bloco
    
    for (let i = 0; i < 3; i++) {
        console.log(`Loop: ${i}`);
    }
    
    // console.log(i); // ❌ Erro: i só existe dentro do for
}

exemploEscopoBloco();

// ==========================================
// 5. HOISTING (ELEVAÇÃO)
// ==========================================

console.log("\n=== HOISTING ===");

/*
Hoisting é o comportamento do JavaScript de "elevar" declarações
de variáveis e funções para o topo do escopo.
*/

// Hoisting com function declaration
console.log("Chamando função antes da declaração:");
funcaoElevada(); // ✅ Funciona!

function funcaoElevada() {
    console.log("Esta função foi elevada!");
}

// Hoisting com var (comportamento confuso - evite usar var)
console.log("\nHoisting com var:");
console.log("Valor de varElevada antes da declaração:", varElevada); // undefined
var varElevada = "Agora tenho valor";
console.log("Valor de varElevada depois da atribuição:", varElevada);

// let e const NÃO são elevadas da mesma forma
console.log("\nlet e const não são elevadas:");
// console.log(letNaoElevada); // ❌ Erro: Cannot access before initialization
let letNaoElevada = "Valor do let";
console.log("Valor do let:", letNaoElevada);

// ==========================================
// 6. CLOSURES (FECHAMENTOS)
// ==========================================

console.log("\n=== CLOSURES ===");

/*
Closure é quando uma função "lembra" do escopo em que foi criada,
mesmo quando executada fora desse escopo.
*/

// Exemplo básico de closure
function criarContador() {
    let contador = 0; // Variável privada
    
    return function() {
        contador++; // Acessa variável do escopo pai
        return contador;
    };
}

let meuContador = criarContador();
console.log("Contador:", meuContador()); // 1
console.log("Contador:", meuContador()); // 2
console.log("Contador:", meuContador()); // 3

// Cada closure mantém sua própria cópia das variáveis
let outroContador = criarContador();
console.log("Outro contador:", outroContador()); // 1 (independente)
console.log("Primeiro contador:", meuContador()); // 4

// Closure com parâmetros
function criarMultiplicador(fator) {
    return function(numero) {
        return numero * fator;
    };
}

let duplicar = criarMultiplicador(2);
let triplicar = criarMultiplicador(3);

console.log("\nUsando closures com parâmetros:");
console.log(`5 duplicado: ${duplicar(5)}`);
console.log(`5 triplicado: ${triplicar(5)}`);

// Closure para criar "métodos privados"
function criarBanco() {
    let saldo = 0; // Variável privada
    
    return {
        depositar: function(valor) {
            if (valor > 0) {
                saldo += valor;
                console.log(`Depositado: R$ ${valor}. Saldo: R$ ${saldo}`);
            } else {
                console.log("Valor inválido para depósito");
            }
        },
        
        sacar: function(valor) {
            if (valor > 0 && valor <= saldo) {
                saldo -= valor;
                console.log(`Sacado: R$ ${valor}. Saldo: R$ ${saldo}`);
            } else {
                console.log("Saque inválido");
            }
        },
        
        consultarSaldo: function() {
            console.log(`Saldo atual: R$ ${saldo}`);
            return saldo;
        }
    };
}

console.log("\nSimulador de banco com closure:");
let minhaConta = criarBanco();
minhaConta.depositar(100);
minhaConta.sacar(30);
minhaConta.consultarSaldo();
// console.log(saldo); // ❌ Erro: saldo é privado

// ==========================================
// 7. ARROW FUNCTIONS
// ==========================================

console.log("\n=== ARROW FUNCTIONS ===");

/*
Arrow functions são uma sintaxe mais concisa para escrever funções.
Introduzidas no ES6.
*/

// Sintaxe tradicional vs arrow function
function somaTradicional(a, b) {
    return a + b;
}

const somaArrow = (a, b) => {
    return a + b;
};

// Arrow function simplificada (return implícito)
const somaSimples = (a, b) => a + b;

// Arrow function com um parâmetro (parênteses opcionais)
const dobrar = x => x * 2;

// Arrow function sem parâmetros
const obterDataAtual = () => new Date().toLocaleDateString();

console.log("Comparando sintaxes:");
console.log(`Tradicional: ${somaTradicional(3, 4)}`);
console.log(`Arrow: ${somaArrow(3, 4)}`);
console.log(`Arrow simples: ${somaSimples(3, 4)}`);
console.log(`Dobrar 5: ${dobrar(5)}`);
console.log(`Data atual: ${obterDataAtual()}`);

// Arrow functions em arrays (muito comum)
let numeros = [1, 2, 3, 4, 5];

// Usando arrow functions com métodos de array
let numerosDobrados = numeros.map(n => n * 2);
let numerosPares = numeros.filter(n => n % 2 === 0);
let somaTotal = numeros.reduce((acc, n) => acc + n, 0);

console.log("\nArrow functions com arrays:");
console.log(`Originais: ${numeros}`);
console.log(`Dobrados: ${numerosDobrados}`);
console.log(`Pares: ${numerosPares}`);
console.log(`Soma total: ${somaTotal}`);

// ==========================================
// 8. FUNÇÕES COMO VALORES
// ==========================================

console.log("\n=== FUNÇÕES COMO VALORES ===");

/*
Em JavaScript, funções são "first-class citizens",
ou seja, podem ser tratadas como qualquer outro valor.
*/

// Atribuindo função a uma variável
const cumprimentar = function(nome) {
    return `Olá, ${nome}!`;
};

console.log(cumprimentar("Ana"));

// Passando função como argumento
function executarOperacao(a, b, operacao) {
    return operacao(a, b);
}

const somar2 = (x, y) => x + y;
const multiplicar = (x, y) => x * y;

console.log(`\nExecutando operações:\`);
console.log(`5 + 3 = ${executarOperacao(5, 3, somar2)}`);
console.log(`5 * 3 = ${executarOperacao(5, 3, multiplicar)}`);

// Retornando função de outra função
function criarOperacao(tipo) {
    switch (tipo) {
        case 'soma':
            return (a, b) => a + b;
        case 'subtracao':
            return (a, b) => a - b;
        case 'multiplicacao':
            return (a, b) => a * b;
        case 'divisao':
            return (a, b) => b !== 0 ? a / b : 'Erro: divisão por zero';
        default:
            return () => 'Operação inválida';
    }
}

let operacaoSoma = criarOperacao('soma');
let operacaoDivisao = criarOperacao('divisao');

console.log(`\nUsando funções retornadas:\`);
console.log(`10 + 5 = ${operacaoSoma(10, 5)}`);
console.log(`10 / 2 = ${operacaoDivisao(10, 2)}`);

// ==========================================
// 9. CALLBACKS BÁSICOS
// ==========================================

console.log("\n=== CALLBACKS BÁSICOS ===");

/*
Callback é uma função passada como argumento para outra função,
para ser executada em um momento específico.
*/

// Exemplo simples de callback
function processarArray(array, callback) {
    console.log(`\nProcessando array: ${array}`);
    let resultado = [];
    
    for (let item of array) {
        resultado.push(callback(item));
    }
    
    return resultado;
}

// Diferentes callbacks
const elevarAoQuadrado = x => x * x;
const converterParaString = x => `Número: ${x}`;
const ehPar = x => x % 2 === 0;

let numerosOriginais = [1, 2, 3, 4, 5];

console.log(`Quadrados: ${processarArray(numerosOriginais, elevarAoQuadrado)}`);
console.log(`Strings: ${processarArray(numerosOriginais, converterParaString)}`);
console.log(`São pares: ${processarArray(numerosOriginais, ehPar)}`);

// Callback com múltiplos parâmetros
function executarComDelay(callback, delay, ...args) {
    console.log(`\nExecutando callback em ${delay}ms...`);
    setTimeout(() => {
        callback(...args);
    }, delay);
}

const mostrarMensagem = (nome, idade) => {
    console.log(`Olá ${nome}, você tem ${idade} anos!`);
};

executarComDelay(mostrarMensagem, 1000, "Carlos", 25);

// ==========================================
// 10. EXEMPLOS PRÁTICOS AVANÇADOS
// ==========================================

console.log("\n=== EXEMPLOS PRÁTICOS ===");

// 1. Sistema de validação
function criarValidador() {
    const validacoes = {
        email: (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        senha: (senha) => {
            return senha.length >= 8 && /[A-Z]/.test(senha) && /[0-9]/.test(senha);
        },
        
        idade: (idade) => {
            return idade >= 0 && idade <= 120;
        }
    };
    
    return {
        validar: function(tipo, valor) {
            if (validacoes[tipo]) {
                return validacoes[tipo](valor);
            }
            return false;
        },
        
        adicionarValidacao: function(tipo, funcao) {
            validacoes[tipo] = funcao;
        }
    };
}

let validador = criarValidador();
console.log(`\nValidações:\`);
console.log(`Email válido: ${validador.validar('email', 'user@example.com')}`);
console.log(`Senha válida: ${validador.validar('senha', 'MinhaSenh@123')}`);
console.log(`Idade válida: ${validador.validar('idade', 25)}`);

// 2. Sistema de cache simples
function criarCache() {
    const cache = new Map();
    
    return function(chave, funcaoCalcular) {
        if (cache.has(chave)) {
            console.log(`Cache hit para: ${chave}`);
            return cache.get(chave);
        }
        
        console.log(`Calculando para: ${chave}`);
        const resultado = funcaoCalcular();
        cache.set(chave, resultado);
        return resultado;
    };
}

const cacheCalculos = criarCache();

// Função custosa simulada
const calcularFatorial = (n) => {
    let resultado = 1;
    for (let i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
};

console.log(`\nTeste de cache:\`);
console.log(`Fatorial de 5: ${cacheCalculos('fat5', () => calcularFatorial(5))}`);
console.log(`Fatorial de 5 (cache): ${cacheCalculos('fat5', () => calcularFatorial(5))}`);

// ==========================================
// 11. EXERCÍCIOS PROPOSTOS
// ==========================================

/*
EXERCÍCIOS PARA PRATICAR:

1. FUNÇÕES BÁSICAS:
   - Crie uma função que calcule o IMC (peso / altura²)
   - Crie uma função que converta temperatura (Celsius ↔ Fahrenheit)
   - Crie uma função que verifique se um número é primo

2. PARÂMETROS E RETORNO:
   - Crie uma função que receba um array de números e retorne:
     * O maior número
     * O menor número
     * A média
   - Use desestruturação no retorno

3. ESCOPO E CLOSURES:
   - Crie uma função que simule um cofre:
     * Tenha uma senha privada
     * Métodos para abrir (com senha) e fechar
     * Método para guardar/retirar itens (só se estiver aberto)

4. ARROW FUNCTIONS:
   - Converta estas funções para arrow functions:
     * function dobrar(x) { return x * 2; }
     * function saudar(nome) { return "Olá " + nome; }
     * function somar(a, b) { return a + b; }

5. CALLBACKS:
   - Crie uma função que processe uma lista de tarefas:
     * Receba um array de tarefas e um callback
     * Execute o callback para cada tarefa
     * Retorne um resumo do processamento

6. FUNÇÕES DE ALTA ORDEM:
   - Crie uma função que retorne diferentes tipos de filtros:
     * Filtro por idade mínima
     * Filtro por profissão
     * Filtro personalizado

7. DESAFIO - CALCULADORA AVANÇADA:
   - Crie uma calculadora que:
     * Suporte operações básicas (+, -, *, /)
     * Tenha histórico de operações (closure)
     * Permita operações em cadeia
     * Tenha função para limpar histórico
*/

// ==========================================
// 12. BOAS PRÁTICAS
// ==========================================

/*
BOAS PRÁTICAS PARA FUNÇÕES:

✅ FAÇA:
- Use nomes descritivos para funções
- Mantenha funções pequenas e focadas (uma responsabilidade)
- Use parâmetros padrão quando apropriado
- Prefira arrow functions para callbacks simples
- Use const para funções que não serão reatribuídas
- Documente funções complexas
- Valide parâmetros quando necessário
- Use return antecipado para reduzir aninhamento

❌ NÃO FAÇA:
- Não crie funções muito longas (> 20 linhas)
- Não use muitos parâmetros (> 3-4)
- Não modifique parâmetros diretamente
- Não use var dentro de funções
- Não esqueça de tratar casos de erro
- Não crie closures desnecessários
- Não abuse de funções aninhadas
*/

// Exemplo de função bem estruturada
function calcularDesconto(preco, percentualDesconto = 0, tipoCliente = 'regular') {
    // Validação de entrada
    if (preco < 0 || percentualDesconto < 0 || percentualDesconto > 100) {
        throw new Error('Parâmetros inválidos');
    }
    
    // Lógica principal
    let desconto = preco * (percentualDesconto / 100);
    
    // Desconto adicional para clientes VIP
    if (tipoCliente === 'vip') {
        desconto += preco * 0.05; // 5% adicional
    }
    
    const precoFinal = preco - desconto;
    
    // Retorno estruturado
    return {
        precoOriginal: preco,
        desconto: desconto,
        precoFinal: precoFinal,
        percentualAplicado: percentualDesconto
    };
}

// Teste da função
try {
    let resultado = calcularDesconto(100, 20, 'vip');
    console.log(`\nCálculo de desconto:`, resultado);
} catch (error) {
    console.error('Erro:', error.message);
}

console.log("\n🎉 Parabéns! Você concluiu o módulo de Funções e Escopos!");
console.log("📚 Próximo módulo: Objetos e Protótipos");

// ==========================================
// FIM DO MÓDULO 3
// ==========================================