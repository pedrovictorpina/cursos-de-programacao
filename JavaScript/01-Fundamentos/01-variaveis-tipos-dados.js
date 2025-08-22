/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 1.1
VARIÁVEIS E TIPOS DE DADOS
==============================================

Objetivos de Aprendizagem:
- Compreender o conceito de variáveis
- Dominar os tipos de dados primitivos
- Aplicar boas práticas de nomenclatura
- Entender escopo de variáveis

==============================================
*/

// ==========================================
// 1. TEORIA: VARIÁVEIS
// ==========================================

/*
VARIÁVEIS são containers que armazenam valores na memória.
Pense nelas como "caixas etiquetadas" onde guardamos informações.

Em JavaScript temos 3 palavras-chave para declarar variáveis:

1. var (ES5) - Escopo de função, pode ser redeclarada
2. let (ES6+) - Escopo de bloco, pode ser reatribuída
3. const (ES6+) - Escopo de bloco, não pode ser reatribuída

REGRA DE OURO: Use const por padrão, let quando precisar reatribuir, evite var.
*/

// ==========================================
// 2. EXEMPLOS PRÁTICOS
// ==========================================

console.log('=== VARIÁVEIS E TIPOS DE DADOS ===');

// Declaração com let (valor mutável)
let nomeUsuario = "Ana Silva";
let idadeUsuario = 28;
let salarioAtual = 5500.75;

console.log(`Usuário: ${nomeUsuario}, ${idadeUsuario} anos, Salário: R$ ${salarioAtual}`);

// Reatribuição de valores
nomeUsuario = "Carlos Santos";
idadeUsuario = 35;
salarioAtual = 7200.00;

console.log(`Novo usuário: ${nomeUsuario}, ${idadeUsuario} anos, Salário: R$ ${salarioAtual}`);

// Declaração com const (valor imutável)
const TAXA_JUROS = 0.05; // 5% ao mês
const EMPRESA = "TechCorp Ltda";
const VERSAO_SISTEMA = "2.1.4";

console.log(`Sistema ${EMPRESA} v${VERSAO_SISTEMA} - Taxa: ${TAXA_JUROS * 100}%`);

// ==========================================
// 3. TIPOS DE DADOS PRIMITIVOS
// ==========================================

/*
JavaScript possui 7 tipos primitivos:
1. string - Texto
2. number - Números (inteiros e decimais)
3. boolean - Verdadeiro ou falso
4. undefined - Valor não definido
5. null - Valor nulo (ausência intencional)
6. symbol - Identificador único (ES6+)
7. bigint - Números inteiros muito grandes (ES2020+)
*/

// STRING - Texto entre aspas
const nome = "JavaScript";
const sobrenome = 'Developer';
const biografia = `Programador especialista em ${nome}`;

console.log('Tipo string:', typeof nome, '- Valor:', nome);
console.log('Template literal:', biografia);

// NUMBER - Números inteiros e decimais
const idade = 25;
const altura = 1.75;
const temperatura = -10.5;
const infinito = Infinity;
const naoNumero = NaN; // Not a Number

console.log('Tipo number:', typeof idade, '- Valor:', idade);
console.log('Decimal:', altura, '| Negativo:', temperatura);
console.log('Especiais:', infinito, naoNumero);

// BOOLEAN - Verdadeiro ou falso
const isAtivo = true;
const isAdmin = false;
const temPermissao = Boolean(1); // Conversão para boolean

console.log('Tipo boolean:', typeof isAtivo, '- Valores:', isAtivo, isAdmin, temPermissao);

// UNDEFINED - Valor não definido
let variavelNaoDefinida;
const objeto = {};

console.log('Tipo undefined:', typeof variavelNaoDefinida, '- Valor:', variavelNaoDefinida);
console.log('Propriedade inexistente:', objeto.propriedadeInexistente);

// NULL - Ausência intencional de valor
const dadosUsuario = null; // Intencionalmente vazio
const cache = null; // Será preenchido posteriormente

console.log('Tipo null:', typeof dadosUsuario, '- Valor:', dadosUsuario);
// Curiosidade: typeof null retorna "object" (bug histórico do JavaScript)

// SYMBOL - Identificador único
const id1 = Symbol('id');
const id2 = Symbol('id');
const chaveUnica = Symbol.for('chave_global');

console.log('Tipo symbol:', typeof id1);
console.log('Symbols são únicos:', id1 === id2); // false
console.log('Symbol global:', Symbol.for('chave_global') === chaveUnica); // true

// BIGINT - Números inteiros muito grandes
const numeroGigante = 1234567890123456789012345678901234567890n;
const outroBigInt = BigInt("9007199254740991999999");

console.log('Tipo bigint:', typeof numeroGigante);
console.log('BigInt:', numeroGigante);
console.log('Conversão:', outroBigInt);

// ==========================================
// 4. VERIFICAÇÃO DE TIPOS
// ==========================================

function verificarTipo(valor) {
    console.log(`Valor: ${valor} | Tipo: ${typeof valor}`);
}

console.log('\n--- VERIFICAÇÃO DE TIPOS ---');
verificarTipo("Hello World");
verificarTipo(42);
verificarTipo(true);
verificarTipo(undefined);
verificarTipo(null);
verificarTipo(Symbol('test'));
verificarTipo(123n);

// ==========================================
// 5. BOAS PRÁTICAS DE NOMENCLATURA
// ==========================================

/*
CONVENÇÕES DE NOMENCLATURA:

1. camelCase para variáveis e funções
   ✅ nomeCompleto, calcularIdade, isUsuarioAtivo
   ❌ nome_completo, NomeCompleto, nome-completo

2. UPPER_SNAKE_CASE para constantes
   ✅ MAX_TENTATIVAS, API_URL, TAXA_DESCONTO
   ❌ maxTentativas, apiUrl

3. PascalCase para classes e construtores
   ✅ Usuario, ContaBancaria, ProcessadorPagamento
   ❌ usuario, conta_bancaria

4. Nomes descritivos e significativos
   ✅ idadeUsuario, emailValido, contadorCliques
   ❌ x, temp, data1, info

5. Evitar palavras reservadas
   ❌ class, function, return, if, for
*/

// Exemplos de boas práticas
const MAX_TENTATIVAS_LOGIN = 3;
const URL_API_USUARIOS = "https://api.exemplo.com/usuarios";
const TIMEOUT_REQUISICAO = 5000; // 5 segundos

let contadorTentativas = 0;
let emailUsuario = "usuario@exemplo.com";
let isLoginValido = false;
let dadosPerfilUsuario = null;

// Função com nomenclatura clara
function validarEmailUsuario(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
}

// ==========================================
// 6. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

/*
EXERCÍCIO 1: PERFIL DE USUÁRIO
Crie variáveis para armazenar informações de um usuário:
- Nome completo (string)
- Idade (number)
- É maior de idade (boolean)
- Profissão (string)
- Salário (number ou null se desempregado)
*/

console.log('\n--- EXERCÍCIO 1: PERFIL DE USUÁRIO ---');

// Sua solução aqui:
const nomeCompleto = "Maria Santos";
const idadePessoa = 22;
const isMaiorIdade = idadePessoa >= 18;
const profissao = "Desenvolvedora Frontend";
const salario = 4500.00;

console.log(`Perfil: ${nomeCompleto}`);
console.log(`Idade: ${idadePessoa} anos (${isMaiorIdade ? 'Maior' : 'Menor'} de idade)`);
console.log(`Profissão: ${profissao}`);
console.log(`Salário: R$ ${salario}`);

/*
EXERCÍCIO 2: CALCULADORA DE TIPOS
Crie uma função que receba um valor e retorne:
- O valor original
- O tipo do valor
- Se é um número válido
- Se é uma string não vazia
*/

console.log('\n--- EXERCÍCIO 2: CALCULADORA DE TIPOS ---');

function analisarTipo(valor) {
    const tipo = typeof valor;
    const isNumeroValido = tipo === 'number' && !isNaN(valor) && isFinite(valor);
    const isStringNaoVazia = tipo === 'string' && valor.length > 0;
    
    return {
        valor: valor,
        tipo: tipo,
        isNumeroValido: isNumeroValido,
        isStringNaoVazia: isStringNaoVazia
    };
}

// Testando a função
const valores = [42, "Hello", true, null, undefined, NaN, "", 0, "123"];

valores.forEach(valor => {
    const resultado = analisarTipo(valor);
    console.log(`Valor: ${resultado.valor} | Tipo: ${resultado.tipo} | Número válido: ${resultado.isNumeroValido} | String não vazia: ${resultado.isStringNaoVazia}`);
});

/*
EXERCÍCIO 3: CONVERSOR DE DADOS
Crie um sistema que converta diferentes tipos de dados:
- String para número
- Número para string
- Qualquer valor para boolean
- Demonstre conversões implícitas e explícitas
*/

console.log('\n--- EXERCÍCIO 3: CONVERSOR DE DADOS ---');

function demonstrarConversoes() {
    console.log('=== CONVERSÕES EXPLÍCITAS ===');
    
    // String para Number
    const stringNumero = "123.45";
    const numeroConvertido = Number(stringNumero);
    const numeroParseFloat = parseFloat(stringNumero);
    const numeroParseInt = parseInt(stringNumero);
    
    console.log(`String "${stringNumero}" para:`);
    console.log(`  Number(): ${numeroConvertido} (${typeof numeroConvertido})`);
    console.log(`  parseFloat(): ${numeroParseFloat} (${typeof numeroParseFloat})`);
    console.log(`  parseInt(): ${numeroParseInt} (${typeof numeroParseInt})`);
    
    // Number para String
    const numero = 456.78;
    const stringConvertida = String(numero);
    const stringToString = numero.toString();
    const stringTemplate = `${numero}`;
    
    console.log(`\nNúmero ${numero} para:`);
    console.log(`  String(): "${stringConvertida}" (${typeof stringConvertida})`);
    console.log(`  toString(): "${stringToString}" (${typeof stringToString})`);
    console.log(`  Template: "${stringTemplate}" (${typeof stringTemplate})`);
    
    // Para Boolean
    const valores = [0, 1, "", "hello", null, undefined, [], {}];
    console.log('\n=== CONVERSÕES PARA BOOLEAN ===');
    
    valores.forEach(valor => {
        const booleanExplicito = Boolean(valor);
        const booleanImplicito = !!valor;
        console.log(`${JSON.stringify(valor)} → Boolean(): ${booleanExplicito} | !!: ${booleanImplicito}`);
    });
    
    console.log('\n=== CONVERSÕES IMPLÍCITAS ===');
    console.log('"5" + 3 =', "5" + 3); // Concatenação
    console.log('"5" - 3 =', "5" - 3); // Subtração numérica
    console.log('"5" * 3 =', "5" * 3); // Multiplicação numérica
    console.log('true + 1 =', true + 1); // Boolean para number
    console.log('false + 1 =', false + 1); // Boolean para number
}

demonstraConversoes();

// ==========================================
// 7. DICAS DE OTIMIZAÇÃO
// ==========================================

/*
DICAS DE PERFORMANCE E BOAS PRÁTICAS:

1. Use const sempre que possível (otimização do motor JS)
2. Declare variáveis no escopo mais restrito necessário
3. Evite conversões desnecessárias de tipo
4. Use typeof para verificação de tipos primitivos
5. Cuidado com == vs === (coerção de tipos)
6. Inicialize variáveis com valores padrão apropriados
7. Use nomes descritivos para melhor manutenibilidade
*/

console.log('\n=== DICAS IMPORTANTES ===');
console.log('1. Sempre use === para comparações (evita coerção)');
console.log('2. typeof null retorna "object" (peculiaridade histórica)');
console.log('3. NaN !== NaN (use Number.isNaN() para verificar)');
console.log('4. undefined vs null: undefined = não definido, null = intencionalmente vazio');
console.log('5. Use const por padrão, let quando necessário, evite var');

// ==========================================
// 8. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS RECOMENDADAS:

📚 Documentação:
- MDN Web Docs: https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Data_structures
- ECMAScript Specification: https://tc39.es/ecma262/

📖 Livros:
- "JavaScript: The Good Parts" - Douglas Crockford
- "You Don't Know JS" - Kyle Simpson
- "Eloquent JavaScript" - Marijn Haverbeke

🎯 Práticas:
- JavaScript.info: https://javascript.info/
- FreeCodeCamp: https://www.freecodecamp.org/
- Exercism: https://exercism.org/tracks/javascript

🔧 Ferramentas:
- TypeScript (tipagem estática)
- ESLint (análise de código)
- Prettier (formatação)
*/

console.log('\n✅ Módulo 1.1 - Variáveis e Tipos de Dados concluído!');
console.log('📚 Próximo: Operadores e Expressões');

// Exportação para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        verificarTipo,
        analisarTipo,
        validarEmailUsuario,
        demonstrarConversoes
    };
}