/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 1
CONCEITOS BÁSICOS
==============================================

Neste módulo você aprenderá:
- Variáveis e como declará-las
- Tipos de dados primitivos
- Operadores aritméticos, de comparação e lógicos
- Conversão de tipos
- Boas práticas de nomenclatura

==============================================
*/

// ==========================================
// 1. VARIÁVEIS
// ==========================================

/*
Variáveis são "caixas" que armazenam valores na memória.
Em JavaScript, temos 3 formas de declarar variáveis:
- var (forma antiga, evite usar)
- let (para valores que podem mudar)
- const (para valores constantes)
*/

// Declaração com let (valor pode ser alterado)
let nome = "Pedro";
let idade = 25;
console.log("Nome:", nome, "| Idade:", idade);

// Alterando o valor
nome = "Maria";
idade = 30;
console.log("Novo nome:", nome, "| Nova idade:", idade);

// Declaração com const (valor NÃO pode ser alterado)
const PI = 3.14159;
const EMPRESA = "TechCorp";
console.log("PI:", PI, "| Empresa:", EMPRESA);

// Tentativa de alterar const gerará erro:
// PI = 3.14; // ❌ Erro: Assignment to constant variable

// ==========================================
// 2. TIPOS DE DADOS PRIMITIVOS
// ==========================================

/*
JavaScript possui 7 tipos primitivos:
1. Number (números)
2. String (texto)
3. Boolean (verdadeiro/falso)
4. Undefined (não definido)
5. Null (nulo)
6. Symbol (identificador único)
7. BigInt (números muito grandes)
*/

// 2.1 NUMBER
let numeroInteiro = 42;
let numeroDecimal = 3.14;
let numeroNegativo = -10;
let infinito = Infinity;
let naoEhNumero = NaN; // Not a Number

console.log("\n=== NUMBERS ===");
console.log("Inteiro:", numeroInteiro, "| Tipo:", typeof numeroInteiro);
console.log("Decimal:", numeroDecimal, "| Tipo:", typeof numeroDecimal);
console.log("Negativo:", numeroNegativo, "| Tipo:", typeof numeroNegativo);

// 2.2 STRING
let textoComAspasSimples = 'Olá mundo!';
let textoComAspasDuplas = "JavaScript é incrível!";
let textoComTemplate = `Meu nome é ${nome} e tenho ${idade} anos`; // Template literals

console.log("\n=== STRINGS ===");
console.log("Aspas simples:", textoComAspasSimples);
console.log("Aspas duplas:", textoComAspasDuplas);
console.log("Template literal:", textoComTemplate);

// 2.3 BOOLEAN
let verdadeiro = true;
let falso = false;
let maiorIdade = idade >= 18;

console.log("\n=== BOOLEANS ===");
console.log("Verdadeiro:", verdadeiro, "| Tipo:", typeof verdadeiro);
console.log("Falso:", falso, "| Tipo:", typeof falso);
console.log("É maior de idade?", maiorIdade);

// 2.4 UNDEFINED e NULL
let variavelNaoDefinida;
let variavelNula = null;

console.log("\n=== UNDEFINED e NULL ===");
console.log("Undefined:", variavelNaoDefinida, "| Tipo:", typeof variavelNaoDefinida);
console.log("Null:", variavelNula, "| Tipo:", typeof variavelNula); // Curiosidade: typeof null retorna "object"

// ==========================================
// 3. OPERADORES ARITMÉTICOS
// ==========================================

let a = 10;
let b = 3;

console.log("\n=== OPERADORES ARITMÉTICOS ===");
console.log(`${a} + ${b} = ${a + b}`); // Soma
console.log(`${a} - ${b} = ${a - b}`); // Subtração
console.log(`${a} * ${b} = ${a * b}`); // Multiplicação
console.log(`${a} / ${b} = ${a / b}`); // Divisão
console.log(`${a} % ${b} = ${a % b}`); // Resto da divisão (módulo)
console.log(`${a} ** ${b} = ${a ** b}`); // Exponenciação

// Operadores de incremento e decremento
let contador = 5;
console.log("\n=== INCREMENTO E DECREMENTO ===");
console.log("Contador inicial:", contador);
console.log("Pré-incremento (++contador):", ++contador); // Incrementa e depois retorna
console.log("Pós-incremento (contador++):", contador++); // Retorna e depois incrementa
console.log("Valor final do contador:", contador);

// ==========================================
// 4. OPERADORES DE COMPARAÇÃO
// ==========================================

let x = 5;
let y = "5";
let z = 10;

console.log("\n=== OPERADORES DE COMPARAÇÃO ===");
console.log(`${x} == ${y}:`, x == y);   // Igualdade (converte tipos)
console.log(`${x} === ${y}:`, x === y); // Igualdade estrita (não converte tipos)
console.log(`${x} != ${z}:`, x != z);   // Diferente
console.log(`${x} !== ${y}:`, x !== y); // Diferente estrito
console.log(`${x} > ${y}:`, x > y);     // Maior que
console.log(`${x} < ${z}:`, x < z);     // Menor que
console.log(`${x} >= ${y}:`, x >= y);   // Maior ou igual
console.log(`${x} <= ${z}:`, x <= z);   // Menor ou igual

// ==========================================
// 5. OPERADORES LÓGICOS
// ==========================================

let temIdade = true;
let temDocumento = false;
let temDinheiro = true;

console.log("\n=== OPERADORES LÓGICOS ===");
console.log("Tem idade E documento:", temIdade && temDocumento); // AND (&&)
console.log("Tem idade OU documento:", temIdade || temDocumento); // OR (||)
console.log("NÃO tem documento:", !temDocumento); // NOT (!)

// Exemplo prático: pode entrar na festa?
let podeEntrarNaFesta = (temIdade && temDocumento) || temDinheiro;
console.log("Pode entrar na festa?", podeEntrarNaFesta);

// ==========================================
// 6. CONVERSÃO DE TIPOS
// ==========================================

console.log("\n=== CONVERSÃO DE TIPOS ===");

// String para Number
let textoNumero = "123";
let numeroConvertido = Number(textoNumero);
let numeroComPlus = +textoNumero; // Forma abreviada
let numeroComParseInt = parseInt(textoNumero);
let numeroComParseFloat = parseFloat("123.45");

console.log("String '123' para número:", numeroConvertido, typeof numeroConvertido);
console.log("Com operador +:", numeroComPlus, typeof numeroComPlus);
console.log("Com parseInt:", numeroComParseInt, typeof numeroComParseInt);
console.log("Com parseFloat:", numeroComParseFloat, typeof numeroComParseFloat);

// Number para String
let numero = 456;
let stringConvertida = String(numero);
let stringComToString = numero.toString();
let stringComTemplate = `${numero}`;

console.log("Número 456 para string:", stringConvertida, typeof stringConvertida);
console.log("Com toString():", stringComToString, typeof stringComToString);
console.log("Com template literal:", stringComTemplate, typeof stringComTemplate);

// Boolean para String/Number
let booleano = true;
console.log("Boolean true para string:", String(booleano));
console.log("Boolean true para number:", Number(booleano)); // true = 1, false = 0

// ==========================================
// 7. BOAS PRÁTICAS DE NOMENCLATURA
// ==========================================

/*
BOAS PRÁTICAS para nomes de variáveis:

✅ FAÇA:
- Use nomes descritivos: let idadeUsuario (não let i)
- Use camelCase: let nomeCompleto
- Use const para valores que não mudam
- Use let para valores que podem mudar
- Seja consistente com a nomenclatura

❌ NÃO FAÇA:
- Não use var (forma antiga)
- Não use nomes genéricos: let data, let info
- Não use caracteres especiais: let nome-usuario
- Não comece com números: let 1nome
- Não use palavras reservadas: let function, let class
*/

// Exemplos de boas práticas
const TAXA_JUROS = 0.05; // Constante em MAIÚSCULA
let nomeUsuario = "João"; // camelCase para variáveis
let idadeMinima = 18; // Nome descritivo
let estaLogado = false; // Boolean com prefixo "esta", "tem", "pode", etc.

// ==========================================
// 8. EXERCÍCIOS PROPOSTOS
// ==========================================

/*
EXERCÍCIOS PARA PRATICAR:

1. Crie variáveis para armazenar:
   - Seu nome completo
   - Sua idade
   - Se você é estudante (boolean)
   - Sua altura em metros

2. Calcule e exiba:
   - Sua idade em meses
   - Sua idade em dias (aproximadamente)
   - Seu IMC (peso / altura²)

3. Crie uma expressão que verifique se você pode:
   - Votar (idade >= 16)
   - Dirigir (idade >= 18)
   - Ser presidente (idade >= 35)

4. Pratique conversões:
   - Converta a string "25.5" para número
   - Converta o número 100 para string
   - Verifique o tipo de cada conversão

5. Teste operadores lógicos:
   - Crie 3 variáveis boolean
   - Combine elas usando &&, || e !
   - Teste diferentes combinações
*/

// ==========================================
// 9. DICAS IMPORTANTES
// ==========================================

/*
DICAS PARA LEMBRAR:

🔹 JavaScript é case-sensitive: 'nome' ≠ 'Nome'
🔹 Use === ao invés de == para comparações
🔹 null e undefined são diferentes
🔹 NaN não é igual a nada, nem a ele mesmo
🔹 typeof null retorna "object" (peculiaridade histórica)
🔹 Template literals (`) permitem interpolação de variáveis
🔹 Sempre declare variáveis antes de usar
🔹 Use const por padrão, let quando precisar alterar o valor
*/

// Teste interessante com NaN
console.log("\n=== CURIOSIDADE COM NaN ===");
console.log("NaN === NaN:", NaN === NaN); // false!
console.log("Como verificar se é NaN:", isNaN(NaN)); // true
console.log("Forma moderna:", Number.isNaN(NaN)); // true

console.log("\n🎉 Parabéns! Você concluiu o módulo de Conceitos Básicos!");
console.log("📚 Próximo módulo: Estruturas de Controle");

// ==========================================
// FIM DO MÓDULO 1
// ==========================================