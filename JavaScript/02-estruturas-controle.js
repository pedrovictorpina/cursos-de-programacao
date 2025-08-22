/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 2
ESTRUTURAS DE CONTROLE
==============================================

Neste módulo você aprenderá:
- Estruturas condicionais (if/else, switch)
- Operador ternário
- Estruturas de repetição (for, while, do-while)
- Controle de fluxo (break, continue)
- Estruturas aninhadas
- Boas práticas e otimizações

==============================================
*/

// ==========================================
// 1. ESTRUTURAS CONDICIONAIS - IF/ELSE
// ==========================================

/*
As estruturas condicionais permitem que o código tome decisões
baseadas em condições verdadeiras ou falsas.

Sintaxe básica:
if (condição) {
    // código executado se condição for true
} else {
    // código executado se condição for false
}
*/

console.log("=== ESTRUTURAS CONDICIONAIS ===");

// Exemplo básico
let idade = 20;

if (idade >= 18) {
    console.log("Você é maior de idade!");
} else {
    console.log("Você é menor de idade!");
}

// If/else if/else - múltiplas condições
let nota = 8.5;

if (nota >= 9) {
    console.log("Excelente! Nota A");
} else if (nota >= 7) {
    console.log("Muito bom! Nota B");
} else if (nota >= 5) {
    console.log("Bom! Nota C");
} else {
    console.log("Precisa melhorar! Nota D");
}

// Condições compostas com operadores lógicos
let temCarteira = true;
let temCarro = true;
let temCombustivel = false;

if (temCarteira && temCarro && temCombustivel) {
    console.log("Pode dirigir!");
} else if (temCarteira && temCarro && !temCombustivel) {
    console.log("Precisa abastecer primeiro!");
} else if (temCarteira && !temCarro) {
    console.log("Precisa de um carro!");
} else {
    console.log("Precisa tirar a carteira primeiro!");
}

// ==========================================
// 2. OPERADOR TERNÁRIO
// ==========================================

/*
O operador ternário é uma forma concisa de escrever if/else simples.
Sintaxe: condição ? valorSeVerdadeiro : valorSeFalso
*/

console.log("\n=== OPERADOR TERNÁRIO ===");

let idadeUsuario = 16;
let status = idadeUsuario >= 18 ? "Adulto" : "Menor";
console.log(`Status: ${status}`);

// Ternário aninhado (use com moderação)
let pontuacao = 85;
let classificacao = pontuacao >= 90 ? "Ouro" : 
                   pontuacao >= 70 ? "Prata" : 
                   pontuacao >= 50 ? "Bronze" : "Sem medalha";
console.log(`Classificação: ${classificacao}`);

// Exemplo prático: definir saudação baseada no horário
let hora = new Date().getHours();
let saudacao = hora < 12 ? "Bom dia!" : 
               hora < 18 ? "Boa tarde!" : "Boa noite!";
console.log(saudacao);

// ==========================================
// 3. SWITCH CASE
// ==========================================

/*
O switch é útil quando você tem muitas condições baseadas
no mesmo valor. É mais legível que múltiplos if/else if.
*/

console.log("\n=== SWITCH CASE ===");

let diaSemana = 3;
let nomeDia;

switch (diaSemana) {
    case 1:
        nomeDia = "Segunda-feira";
        break;
    case 2:
        nomeDia = "Terça-feira";
        break;
    case 3:
        nomeDia = "Quarta-feira";
        break;
    case 4:
        nomeDia = "Quinta-feira";
        break;
    case 5:
        nomeDia = "Sexta-feira";
        break;
    case 6:
        nomeDia = "Sábado";
        break;
    case 7:
        nomeDia = "Domingo";
        break;
    default:
        nomeDia = "Dia inválido";
}

console.log(`Hoje é: ${nomeDia}`);

// Switch com agrupamento de casos
let mes = 12;
let estacao;

switch (mes) {
    case 12:
    case 1:
    case 2:
        estacao = "Verão";
        break;
    case 3:
    case 4:
    case 5:
        estacao = "Outono";
        break;
    case 6:
    case 7:
    case 8:
        estacao = "Inverno";
        break;
    case 9:
    case 10:
    case 11:
        estacao = "Primavera";
        break;
    default:
        estacao = "Mês inválido";
}

console.log(`Estação: ${estacao}`);

// Switch com strings
let operacao = "soma";
let a = 10;
let b = 5;
let resultado;

switch (operacao) {
    case "soma":
        resultado = a + b;
        break;
    case "subtracao":
        resultado = a - b;
        break;
    case "multiplicacao":
        resultado = a * b;
        break;
    case "divisao":
        resultado = b !== 0 ? a / b : "Erro: divisão por zero";
        break;
    default:
        resultado = "Operação inválida";
}

console.log(`${a} ${operacao} ${b} = ${resultado}`);

// ==========================================
// 4. LOOP FOR
// ==========================================

/*
O loop for é usado quando você sabe quantas vezes quer repetir algo.
Sintaxe: for (inicialização; condição; incremento) { código }
*/

console.log("\n=== LOOP FOR ===");

// For básico - contando de 1 a 5
console.log("Contando de 1 a 5:");
for (let i = 1; i <= 5; i++) {
    console.log(`Número: ${i}`);
}

// For com decremento
console.log("\nContagem regressiva:");
for (let i = 5; i >= 1; i--) {
    console.log(`${i}...`);
}
console.log("🚀 Decolagem!");

// For com incremento diferente
console.log("\nNúmeros pares de 0 a 10:");
for (let i = 0; i <= 10; i += 2) {
    console.log(i);
}

// For aninhado - tabuada
console.log("\nTabuada do 1 ao 3:");
for (let i = 1; i <= 3; i++) {
    console.log(`\nTabuada do ${i}:`);
    for (let j = 1; j <= 5; j++) {
        console.log(`${i} x ${j} = ${i * j}`);
    }
}

// ==========================================
// 5. LOOP WHILE
// ==========================================

/*
O while executa enquanto uma condição for verdadeira.
Use quando não souber exatamente quantas iterações serão necessárias.
*/

console.log("\n=== LOOP WHILE ===");

// While básico
let contador = 1;
console.log("Contando com while:");
while (contador <= 5) {
    console.log(`Contador: ${contador}`);
    contador++; // IMPORTANTE: sempre incrementar para evitar loop infinito!
}

// Exemplo prático: adivinhar número
let numeroSecreto = 7;
let tentativa = 1;
let palpite = Math.floor(Math.random() * 10) + 1; // Número aleatório de 1 a 10

console.log("\nJogo de adivinhação (simulado):");
while (palpite !== numeroSecreto && tentativa <= 3) {
    console.log(`Tentativa ${tentativa}: Palpite ${palpite} - Errou!`);
    tentativa++;
    palpite = Math.floor(Math.random() * 10) + 1;
}

if (palpite === numeroSecreto) {
    console.log(`🎉 Acertou! O número era ${numeroSecreto}`);
} else {
    console.log(`😞 Não conseguiu adivinhar. O número era ${numeroSecreto}`);
}

// ==========================================
// 6. LOOP DO-WHILE
// ==========================================

/*
O do-while executa o código pelo menos uma vez,
depois verifica a condição para continuar.
*/

console.log("\n=== LOOP DO-WHILE ===");

let numero = 1;
console.log("Do-while - executa pelo menos uma vez:");
do {
    console.log(`Número: ${numero}`);
    numero++;
} while (numero <= 3);

// Exemplo: validação de entrada (simulado)
let senha;
let tentativas = 0;
const senhaCorreta = "123456";

console.log("\nSimulação de validação de senha:");
do {
    tentativas++;
    // Simulando diferentes tentativas
    if (tentativas === 1) senha = "123";
    else if (tentativas === 2) senha = "password";
    else senha = "123456";
    
    console.log(`Tentativa ${tentativas}: Senha "${senha}"`);
    
    if (senha !== senhaCorreta) {
        console.log("❌ Senha incorreta!");
    }
} while (senha !== senhaCorreta && tentativas < 3);

if (senha === senhaCorreta) {
    console.log("✅ Acesso liberado!");
} else {
    console.log("🔒 Acesso bloqueado - muitas tentativas!");
}

// ==========================================
// 7. CONTROLE DE FLUXO - BREAK E CONTINUE
// ==========================================

console.log("\n=== BREAK E CONTINUE ===");

// BREAK - interrompe o loop completamente
console.log("Exemplo com BREAK:");
for (let i = 1; i <= 10; i++) {
    if (i === 6) {
        console.log("Encontrou o 6, parando o loop!");
        break; // Sai do loop
    }
    console.log(`Número: ${i}`);
}

// CONTINUE - pula para a próxima iteração
console.log("\nExemplo com CONTINUE:");
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue; // Pula números pares
    }
    console.log(`Número ímpar: ${i}`);
}

// Exemplo prático: procurar item em lista
let frutas = ["maçã", "banana", "laranja", "uva", "manga"];
let frutaProcurada = "laranja";
let encontrada = false;

console.log("\nProcurando por 'laranja' na lista:");
for (let i = 0; i < frutas.length; i++) {
    console.log(`Verificando: ${frutas[i]}`);
    if (frutas[i] === frutaProcurada) {
        console.log(`✅ Encontrou ${frutaProcurada} na posição ${i}!`);
        encontrada = true;
        break; // Para de procurar quando encontrar
    }
}

if (!encontrada) {
    console.log(`❌ ${frutaProcurada} não foi encontrada.`);
}

// ==========================================
// 8. FOR...IN E FOR...OF
// ==========================================

console.log("\n=== FOR...IN E FOR...OF ===");

// FOR...IN - itera sobre as chaves/índices
let pessoa = {
    nome: "João",
    idade: 30,
    cidade: "São Paulo"
};

console.log("FOR...IN com objeto (chaves):");
for (let chave in pessoa) {
    console.log(`${chave}: ${pessoa[chave]}`);
}

let cores = ["vermelho", "azul", "verde"];
console.log("\nFOR...IN com array (índices):");
for (let indice in cores) {
    console.log(`Índice ${indice}: ${cores[indice]}`);
}

// FOR...OF - itera sobre os valores
console.log("\nFOR...OF com array (valores):");
for (let cor of cores) {
    console.log(`Cor: ${cor}`);
}

// FOR...OF com strings
let palavra = "JavaScript";
console.log("\nFOR...OF com string:");
for (let letra of palavra) {
    console.log(letra);
}

// ==========================================
// 9. EXEMPLOS PRÁTICOS AVANÇADOS
// ==========================================

console.log("\n=== EXEMPLOS PRÁTICOS ===");

// 1. Calculadora de média de notas
function calcularMedia() {
    let notas = [8.5, 7.2, 9.1, 6.8, 8.9];
    let soma = 0;
    
    console.log("Calculando média das notas:");
    for (let i = 0; i < notas.length; i++) {
        soma += notas[i];
        console.log(`Nota ${i + 1}: ${notas[i]}`);
    }
    
    let media = soma / notas.length;
    console.log(`Média: ${media.toFixed(2)}`);
    
    if (media >= 7) {
        console.log("✅ Aprovado!");
    } else if (media >= 5) {
        console.log("⚠️ Recuperação");
    } else {
        console.log("❌ Reprovado");
    }
}

calcularMedia();

// 2. Contador de caracteres
function contarCaracteres(texto) {
    let vogais = 0;
    let consoantes = 0;
    let espacos = 0;
    let numeros = 0;
    
    console.log(`\nAnalisando o texto: "${texto}"`);
    
    for (let char of texto.toLowerCase()) {
        if (char === ' ') {
            espacos++;
        } else if ('aeiou'.includes(char)) {
            vogais++;
        } else if (char >= 'a' && char <= 'z') {
            consoantes++;
        } else if (char >= '0' && char <= '9') {
            numeros++;
        }
    }
    
    console.log(`Vogais: ${vogais}`);
    console.log(`Consoantes: ${consoantes}`);
    console.log(`Espaços: ${espacos}`);
    console.log(`Números: ${numeros}`);
}

contarCaracteres("JavaScript é incrível! 2024");

// 3. Gerador de padrões
function gerarPadrao(linhas) {
    console.log(`\nPadrão triangular com ${linhas} linhas:`);
    
    for (let i = 1; i <= linhas; i++) {
        let linha = "";
        
        // Adiciona espaços
        for (let j = 1; j <= linhas - i; j++) {
            linha += " ";
        }
        
        // Adiciona asteriscos
        for (let k = 1; k <= 2 * i - 1; k++) {
            linha += "*";
        }
        
        console.log(linha);
    }
}

gerarPadrao(5);

// ==========================================
// 10. EXERCÍCIOS PROPOSTOS
// ==========================================

/*
EXERCÍCIOS PARA PRATICAR:

1. CONDICIONAIS:
   - Crie um programa que classifique a temperatura:
     * Abaixo de 15°C: "Frio"
     * 15°C a 25°C: "Agradável"
     * 26°C a 35°C: "Quente"
     * Acima de 35°C: "Muito quente"

2. SWITCH:
   - Crie uma calculadora que receba dois números e uma operação
   - Use switch para determinar qual operação executar
   - Trate o caso de divisão por zero

3. LOOPS:
   - Imprima todos os números de 1 a 100
   - Mas substitua múltiplos de 3 por "Fizz"
   - Múltiplos de 5 por "Buzz"
   - Múltiplos de ambos por "FizzBuzz"

4. WHILE:
   - Crie um jogo onde o usuário tenta adivinhar um número
   - O programa deve dar dicas ("maior" ou "menor")
   - Limite a 5 tentativas

5. FOR ANINHADO:
   - Crie uma tabuada completa (1 a 10)
   - Formate a saída de forma organizada

6. BREAK/CONTINUE:
   - Percorra um array de números
   - Pule números negativos (continue)
   - Pare quando encontrar um número maior que 100 (break)

7. DESAFIO:
   - Crie um programa que verifique se um número é primo
   - Use loops para testar divisibilidade
   - Otimize testando apenas até a raiz quadrada do número
*/

// ==========================================
// 11. BOAS PRÁTICAS
// ==========================================

/*
BOAS PRÁTICAS PARA ESTRUTURAS DE CONTROLE:

✅ FAÇA:
- Use === ao invés de == para comparações
- Sempre use chaves {} mesmo para uma linha
- Indente o código corretamente
- Use nomes descritivos para variáveis de controle
- Evite loops infinitos (sempre incremente/decremente)
- Use break e continue com moderação
- Prefira for...of para iterar arrays
- Use for...in para iterar objetos

❌ NÃO FAÇA:
- Não esqueça o break no switch
- Não crie condições muito complexas
- Não use loops aninhados desnecessariamente
- Não modifique a variável de controle dentro do loop for
- Não use var dentro de loops (use let)
*/

// Exemplo de código limpo vs código problemático

// ❌ Problemático
/*
if(idade>=18)console.log("adulto");else console.log("menor");
for(var i=0;i<10;i++){if(i%2==0)continue;console.log(i);}
*/

// ✅ Limpo e legível
if (idade >= 18) {
    console.log("Adulto");
} else {
    console.log("Menor de idade");
}

for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
        continue;
    }
    console.log(i);
}

console.log("\n🎉 Parabéns! Você concluiu o módulo de Estruturas de Controle!");
console.log("📚 Próximo módulo: Funções e Escopos");

// ==========================================
// FIM DO MÓDULO 2
// ==========================================