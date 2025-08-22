/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 1.2
OPERADORES E EXPRESSÕES
==============================================

Objetivos de Aprendizagem:
- Dominar operadores aritméticos, lógicos e de comparação
- Compreender precedência de operadores
- Aplicar operadores de atribuição
- Utilizar operadores especiais do JavaScript
- Construir expressões complexas

==============================================
*/

// ==========================================
// 1. TEORIA: OPERADORES
// ==========================================

/*
OPERADORES são símbolos que realizam operações em operandos (valores ou variáveis).

Tipos de operadores em JavaScript:
1. Aritméticos - Operações matemáticas
2. Atribuição - Atribuir valores
3. Comparação - Comparar valores
4. Lógicos - Operações booleanas
5. Bitwise - Operações em bits
6. Especiais - Operadores únicos do JS

EXPRESSÕES são combinações de valores, variáveis e operadores que produzem um resultado.
*/

// ==========================================
// 2. OPERADORES ARITMÉTICOS
// ==========================================

console.log('=== OPERADORES ARITMÉTICOS ===');

// Operadores básicos
const a = 15;
const b = 4;

console.log(`a = ${a}, b = ${b}`);
console.log(`Adição: ${a} + ${b} = ${a + b}`);
console.log(`Subtração: ${a} - ${b} = ${a - b}`);
console.log(`Multiplicação: ${a} * ${b} = ${a * b}`);
console.log(`Divisão: ${a} / ${b} = ${a / b}`);
console.log(`Resto (módulo): ${a} % ${b} = ${a % b}`);
console.log(`Exponenciação: ${a} ** 2 = ${a ** 2}`);

// Operadores unários
let contador = 10;
console.log('\n--- OPERADORES UNÁRIOS ---');
console.log(`Valor inicial: ${contador}`);
console.log(`Pré-incremento: ++contador = ${++contador}`);
console.log(`Pós-incremento: contador++ = ${contador++}`);
console.log(`Valor após pós-incremento: ${contador}`);
console.log(`Pré-decremento: --contador = ${--contador}`);
console.log(`Pós-decremento: contador-- = ${contador--}`);
console.log(`Valor final: ${contador}`);

// Operador unário de negação
const numero = 42;
console.log(`\nNegação unária: -${numero} = ${-numero}`);
console.log(`Conversão para número: +"123" = ${+"123"}`);
console.log(`Conversão para número: +true = ${+true}`);

// ==========================================
// 3. OPERADORES DE ATRIBUIÇÃO
// ==========================================

console.log('\n=== OPERADORES DE ATRIBUIÇÃO ===');

let valor = 100;
console.log(`Valor inicial: ${valor}`);

// Atribuição composta
valor += 20; // valor = valor + 20
console.log(`Após +=20: ${valor}`);

valor -= 15; // valor = valor - 15
console.log(`Após -=15: ${valor}`);

valor *= 2; // valor = valor * 2
console.log(`Após *=2: ${valor}`);

valor /= 4; // valor = valor / 4
console.log(`Após /=4: ${valor}`);

valor %= 7; // valor = valor % 7
console.log(`Após %=7: ${valor}`);

valor **= 3; // valor = valor ** 3
console.log(`Após **=3: ${valor}`);

// ==========================================
// 4. OPERADORES DE COMPARAÇÃO
// ==========================================

console.log('\n=== OPERADORES DE COMPARAÇÃO ===');

const x = 10;
const y = "10";
const z = 20;

console.log(`x = ${x} (${typeof x}), y = "${y}" (${typeof y}), z = ${z}`);

// Igualdade e desigualdade
console.log(`\n--- IGUALDADE ---`);
console.log(`x == y: ${x == y}`); // Igualdade com coerção
console.log(`x === y: ${x === y}`); // Igualdade estrita (sem coerção)
console.log(`x != y: ${x != y}`); // Desigualdade com coerção
console.log(`x !== y: ${x !== y}`); // Desigualdade estrita

// Comparações relacionais
console.log(`\n--- COMPARAÇÕES RELACIONAIS ---`);
console.log(`x > z: ${x > z}`);
console.log(`x < z: ${x < z}`);
console.log(`x >= 10: ${x >= 10}`);
console.log(`x <= 10: ${x <= 10}`);

// Casos especiais
console.log(`\n--- CASOS ESPECIAIS ---`);
console.log(`null == undefined: ${null == undefined}`); // true
console.log(`null === undefined: ${null === undefined}`); // false
console.log(`NaN === NaN: ${NaN === NaN}`); // false
console.log(`Number.isNaN(NaN): ${Number.isNaN(NaN)}`); // true

// ==========================================
// 5. OPERADORES LÓGICOS
// ==========================================

console.log('\n=== OPERADORES LÓGICOS ===');

const isLogado = true;
const isAdmin = false;
const temPermissao = true;

console.log(`isLogado = ${isLogado}, isAdmin = ${isAdmin}, temPermissao = ${temPermissao}`);

// AND lógico (&&)
console.log(`\n--- AND LÓGICO (&&) ---`);
console.log(`isLogado && isAdmin: ${isLogado && isAdmin}`);
console.log(`isLogado && temPermissao: ${isLogado && temPermissao}`);

// OR lógico (||)
console.log(`\n--- OR LÓGICO (||) ---`);
console.log(`isAdmin || temPermissao: ${isAdmin || temPermissao}`);
console.log(`isAdmin || false: ${isAdmin || false}`);

// NOT lógico (!)
console.log(`\n--- NOT LÓGICO (!) ---`);
console.log(`!isLogado: ${!isLogado}`);
console.log(`!isAdmin: ${!isAdmin}`);
console.log(`!!"texto": ${!!"texto"}`); // Conversão para boolean

// Short-circuit evaluation
console.log(`\n--- SHORT-CIRCUIT EVALUATION ---`);
const nome = "";
const nomeDefault = nome || "Usuário Anônimo";
console.log(`Nome padrão: ${nomeDefault}`);

const usuario = { nome: "João" };
const nomeUsuario = usuario && usuario.nome;
console.log(`Nome do usuário: ${nomeUsuario}`);

// ==========================================
// 6. OPERADORES ESPECIAIS
// ==========================================

console.log('\n=== OPERADORES ESPECIAIS ===');

// Operador ternário (condicional)
const idade = 20;
const status = idade >= 18 ? "Maior de idade" : "Menor de idade";
console.log(`Idade: ${idade} - Status: ${status}`);

// Operador typeof
console.log(`\n--- OPERADOR TYPEOF ---`);
const valores = [42, "texto", true, null, undefined, {}, []];
valores.forEach(valor => {
    console.log(`typeof ${JSON.stringify(valor)}: ${typeof valor}`);
});

// Operador instanceof
console.log(`\n--- OPERADOR INSTANCEOF ---`);
const array = [1, 2, 3];
const objeto = { nome: "teste" };
const data = new Date();

console.log(`array instanceof Array: ${array instanceof Array}`);
console.log(`objeto instanceof Object: ${objeto instanceof Object}`);
console.log(`data instanceof Date: ${data instanceof Date}`);
console.log(`array instanceof Object: ${array instanceof Object}`);

// Operador in
console.log(`\n--- OPERADOR IN ---`);
const pessoa = { nome: "Maria", idade: 30 };
console.log(`"nome" in pessoa: ${"nome" in pessoa}`);
console.log(`"sobrenome" in pessoa: ${"sobrenome" in pessoa}`);
console.log(`"toString" in pessoa: ${"toString" in pessoa}`); // Herança

// Operador delete
console.log(`\n--- OPERADOR DELETE ---`);
const obj = { a: 1, b: 2, c: 3 };
console.log(`Objeto antes: ${JSON.stringify(obj)}`);
delete obj.b;
console.log(`Objeto após delete obj.b: ${JSON.stringify(obj)}`);

// Operador void
console.log(`\n--- OPERADOR VOID ---`);
const resultado = void 0; // Sempre retorna undefined
console.log(`void 0: ${resultado}`);
console.log(`void "qualquer coisa": ${void "qualquer coisa"}`);

// ==========================================
// 7. PRECEDÊNCIA DE OPERADORES
// ==========================================

console.log('\n=== PRECEDÊNCIA DE OPERADORES ===');

/*
PRECEDÊNCIA (do maior para o menor):
1. () - Parênteses
2. ++ -- - Incremento/Decremento
3. ** - Exponenciação
4. * / % - Multiplicação, Divisão, Módulo
5. + - - Adição, Subtração
6. < <= > >= - Comparações relacionais
7. == != === !== - Igualdade
8. && - AND lógico
9. || - OR lógico
10. ?: - Operador ternário
11. = += -= *= /= %= - Atribuição
*/

// Exemplos de precedência
const expr1 = 2 + 3 * 4; // 2 + 12 = 14
const expr2 = (2 + 3) * 4; // 5 * 4 = 20
const expr3 = 2 ** 3 ** 2; // 2 ** 9 = 512 (associatividade à direita)
const expr4 = (2 ** 3) ** 2; // 8 ** 2 = 64

console.log(`2 + 3 * 4 = ${expr1}`);
console.log(`(2 + 3) * 4 = ${expr2}`);
console.log(`2 ** 3 ** 2 = ${expr3}`);
console.log(`(2 ** 3) ** 2 = ${expr4}`);

// Expressão complexa
const complexa = 10 > 5 && 3 + 2 === 5 || false;
console.log(`10 > 5 && 3 + 2 === 5 || false = ${complexa}`);

// ==========================================
// 8. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

/*
EXERCÍCIO 1: CALCULADORA AVANÇADA
Crie uma calculadora que realize operações básicas e avançadas:
- Operações básicas (+, -, *, /, %)
- Potenciação
- Raiz quadrada
- Validação de entrada
*/

console.log('\n--- EXERCÍCIO 1: CALCULADORA AVANÇADA ---');

class CalculadoraAvancada {
    static somar(a, b) {
        return this.validarNumeros(a, b) ? a + b : "Erro: Valores inválidos";
    }
    
    static subtrair(a, b) {
        return this.validarNumeros(a, b) ? a - b : "Erro: Valores inválidos";
    }
    
    static multiplicar(a, b) {
        return this.validarNumeros(a, b) ? a * b : "Erro: Valores inválidos";
    }
    
    static dividir(a, b) {
        if (!this.validarNumeros(a, b)) return "Erro: Valores inválidos";
        if (b === 0) return "Erro: Divisão por zero";
        return a / b;
    }
    
    static modulo(a, b) {
        if (!this.validarNumeros(a, b)) return "Erro: Valores inválidos";
        if (b === 0) return "Erro: Divisão por zero";
        return a % b;
    }
    
    static potencia(base, expoente) {
        return this.validarNumeros(base, expoente) ? base ** expoente : "Erro: Valores inválidos";
    }
    
    static raizQuadrada(numero) {
        if (!this.validarNumero(numero)) return "Erro: Valor inválido";
        if (numero < 0) return "Erro: Raiz de número negativo";
        return Math.sqrt(numero);
    }
    
    static validarNumero(num) {
        return typeof num === 'number' && !isNaN(num) && isFinite(num);
    }
    
    static validarNumeros(a, b) {
        return this.validarNumero(a) && this.validarNumero(b);
    }
}

// Testando a calculadora
const testes = [
    [10, 5, 'somar'],
    [10, 3, 'dividir'],
    [2, 8, 'potencia'],
    [16, null, 'raizQuadrada'],
    [10, 0, 'dividir'],
    [-4, null, 'raizQuadrada']
];

testes.forEach(([a, b, operacao]) => {
    let resultado;
    switch(operacao) {
        case 'somar': resultado = CalculadoraAvancada.somar(a, b); break;
        case 'dividir': resultado = CalculadoraAvancada.dividir(a, b); break;
        case 'potencia': resultado = CalculadoraAvancada.potencia(a, b); break;
        case 'raizQuadrada': resultado = CalculadoraAvancada.raizQuadrada(a); break;
    }
    console.log(`${operacao}(${a}${b !== null ? `, ${b}` : ''}): ${resultado}`);
});

/*
EXERCÍCIO 2: VALIDADOR DE EXPRESSÕES
Crie um sistema que valide diferentes tipos de expressões:
- Validação de email
- Validação de senha forte
- Validação de CPF
- Validação de idade
*/

console.log('\n--- EXERCÍCIO 2: VALIDADOR DE EXPRESSÕES ---');

class ValidadorExpressoes {
    static validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValido = typeof email === 'string' && regex.test(email);
        return {
            valido: isValido,
            mensagem: isValido ? 'Email válido' : 'Email inválido'
        };
    }
    
    static validarSenhaForte(senha) {
        if (typeof senha !== 'string') {
            return { valido: false, mensagem: 'Senha deve ser uma string' };
        }
        
        const temMinimo8 = senha.length >= 8;
        const temMaiuscula = /[A-Z]/.test(senha);
        const temMinuscula = /[a-z]/.test(senha);
        const temNumero = /\d/.test(senha);
        const temEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);
        
        const criterios = [temMinimo8, temMaiuscula, temMinuscula, temNumero, temEspecial];
        const pontuacao = criterios.filter(Boolean).length;
        
        return {
            valido: pontuacao === 5,
            pontuacao: pontuacao,
            criterios: {
                minimo8: temMinimo8,
                maiuscula: temMaiuscula,
                minuscula: temMinuscula,
                numero: temNumero,
                especial: temEspecial
            },
            mensagem: pontuacao === 5 ? 'Senha forte' : `Senha fraca (${pontuacao}/5 critérios)`
        };
    }
    
    static validarCPF(cpf) {
        if (typeof cpf !== 'string') return { valido: false, mensagem: 'CPF deve ser string' };
        
        // Remove formatação
        const cpfLimpo = cpf.replace(/[^\d]/g, '');
        
        // Verifica se tem 11 dígitos
        if (cpfLimpo.length !== 11) {
            return { valido: false, mensagem: 'CPF deve ter 11 dígitos' };
        }
        
        // Verifica se não são todos iguais
        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            return { valido: false, mensagem: 'CPF inválido (dígitos iguais)' };
        }
        
        // Algoritmo de validação do CPF
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo[i]) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo[9])) {
            return { valido: false, mensagem: 'CPF inválido (primeiro dígito)' };
        }
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo[10])) {
            return { valido: false, mensagem: 'CPF inválido (segundo dígito)' };
        }
        
        return { valido: true, mensagem: 'CPF válido' };
    }
    
    static validarIdade(idade) {
        const isNumero = typeof idade === 'number' && !isNaN(idade);
        const isPositiva = idade > 0;
        const isRealista = idade <= 150;
        const isInteira = Number.isInteger(idade);
        
        const valido = isNumero && isPositiva && isRealista && isInteira;
        
        return {
            valido: valido,
            mensagem: valido ? 'Idade válida' : 'Idade inválida',
            categoria: valido ? this.categorizarIdade(idade) : null
        };
    }
    
    static categorizarIdade(idade) {
        if (idade < 13) return 'Criança';
        if (idade < 18) return 'Adolescente';
        if (idade < 60) return 'Adulto';
        return 'Idoso';
    }
}

// Testando validações
const testesValidacao = [
    ['email', 'usuario@exemplo.com'],
    ['email', 'email-invalido'],
    ['senha', 'MinhaSenh@123'],
    ['senha', '123456'],
    ['cpf', '123.456.789-09'],
    ['cpf', '111.111.111-11'],
    ['idade', 25],
    ['idade', -5]
];

testesValidacao.forEach(([tipo, valor]) => {
    let resultado;
    switch(tipo) {
        case 'email': resultado = ValidadorExpressoes.validarEmail(valor); break;
        case 'senha': resultado = ValidadorExpressoes.validarSenhaForte(valor); break;
        case 'cpf': resultado = ValidadorExpressoes.validarCPF(valor); break;
        case 'idade': resultado = ValidadorExpressoes.validarIdade(valor); break;
    }
    console.log(`${tipo.toUpperCase()} "${valor}": ${resultado.mensagem}`);
});

/*
EXERCÍCIO 3: SISTEMA DE PONTUAÇÃO
Crie um sistema que calcule pontuações baseado em diferentes critérios:
- Use operadores ternários para bonificações
- Implemente multiplicadores
- Adicione penalidades
- Calcule ranking final
*/

console.log('\n--- EXERCÍCIO 3: SISTEMA DE PONTUAÇÃO ---');

class SistemaPontuacao {
    static calcularPontuacao(dados) {
        const {
            pontuacaoBase = 0,
            tempoSegundos = 0,
            acertos = 0,
            erros = 0,
            dificuldade = 'normal',
            isBonus = false,
            isPenalidade = false
        } = dados;
        
        // Pontuação base
        let pontuacao = pontuacaoBase;
        
        // Bonificação por acertos
        pontuacao += acertos * 10;
        
        // Penalidade por erros
        pontuacao -= erros * 5;
        
        // Multiplicador de dificuldade
        const multiplicadorDificuldade = 
            dificuldade === 'facil' ? 0.8 :
            dificuldade === 'normal' ? 1.0 :
            dificuldade === 'dificil' ? 1.5 :
            dificuldade === 'expert' ? 2.0 : 1.0;
        
        pontuacao *= multiplicadorDificuldade;
        
        // Bonificação por tempo (mais pontos para menos tempo)
        const bonusTempo = tempoSegundos > 0 ? Math.max(0, 1000 - tempoSegundos) : 0;
        pontuacao += bonusTempo;
        
        // Bônus especial
        if (isBonus) {
            pontuacao *= 1.2; // 20% de bônus
        }
        
        // Penalidade especial
        if (isPenalidade) {
            pontuacao *= 0.7; // 30% de penalidade
        }
        
        // Garante que a pontuação não seja negativa
        pontuacao = Math.max(0, Math.round(pontuacao));
        
        // Calcula ranking
        const ranking = this.calcularRanking(pontuacao);
        
        return {
            pontuacaoFinal: pontuacao,
            ranking: ranking,
            detalhes: {
                pontuacaoBase,
                bonusAcertos: acertos * 10,
                penalErros: erros * 5,
                multiplicadorDificuldade,
                bonusTempo,
                bonusEspecial: isBonus ? '20%' : 'Nenhum',
                penalidadeEspecial: isPenalidade ? '30%' : 'Nenhuma'
            }
        };
    }
    
    static calcularRanking(pontuacao) {
        return pontuacao >= 2000 ? 'Lendário' :
               pontuacao >= 1500 ? 'Mestre' :
               pontuacao >= 1000 ? 'Especialista' :
               pontuacao >= 500 ? 'Avançado' :
               pontuacao >= 200 ? 'Intermediário' :
               pontuacao >= 50 ? 'Iniciante' : 'Novato';
    }
}

// Testando sistema de pontuação
const jogadores = [
    {
        nome: 'João',
        dados: { pontuacaoBase: 100, tempoSegundos: 45, acertos: 15, erros: 2, dificuldade: 'dificil', isBonus: true }
    },
    {
        nome: 'Maria',
        dados: { pontuacaoBase: 80, tempoSegundos: 120, acertos: 12, erros: 5, dificuldade: 'normal', isPenalidade: true }
    },
    {
        nome: 'Pedro',
        dados: { pontuacaoBase: 150, tempoSegundos: 30, acertos: 20, erros: 1, dificuldade: 'expert', isBonus: true }
    }
];

jogadores.forEach(jogador => {
    const resultado = SistemaPontuacao.calcularPontuacao(jogador.dados);
    console.log(`\n${jogador.nome}:`);
    console.log(`  Pontuação Final: ${resultado.pontuacaoFinal}`);
    console.log(`  Ranking: ${resultado.ranking}`);
    console.log(`  Detalhes:`, resultado.detalhes);
});

// ==========================================
// 9. DICAS DE OTIMIZAÇÃO
// ==========================================

/*
DICAS DE PERFORMANCE E BOAS PRÁTICAS:

1. Use === em vez de == para evitar coerção desnecessária
2. Prefira operadores de atribuição composta (+=, -=, etc.)
3. Use short-circuit evaluation para otimizar condições
4. Cuidado com a precedência - use parênteses quando necessário
5. Evite operações custosas em loops (como exponenciação)
6. Use Number.isNaN() em vez de isNaN() para verificações precisas
7. Prefira operadores ternários para condições simples
8. Use typeof para verificação de tipos primitivos
*/

console.log('\n=== DICAS IMPORTANTES ===');
console.log('1. === é mais rápido que == (sem coerção de tipos)');
console.log('2. Use && e || para short-circuit evaluation');
console.log('3. Parênteses tornam expressões mais legíveis');
console.log('4. Cuidado: typeof null === "object"');
console.log('5. NaN é o único valor que não é igual a si mesmo');

// ==========================================
// 10. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS RECOMENDADAS:

📚 Documentação:
- MDN Expressions and Operators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
- Operator Precedence: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence

📖 Conceitos Avançados:
- Type Coercion: https://javascript.info/type-conversions
- Truthy and Falsy: https://javascript.info/logical-operators
- Bitwise Operations: https://javascript.info/bitwise-operators

🎯 Práticas:
- Exercícios de lógica: https://www.codewars.com/
- Desafios matemáticos: https://projecteuler.net/
- Algoritmos: https://leetcode.com/

🔧 Ferramentas:
- ESLint rules para operadores
- Prettier para formatação consistente
- TypeScript para tipagem estática
*/

console.log('\n✅ Módulo 1.2 - Operadores e Expressões concluído!');
console.log('📚 Próximo: Conversão de Tipos');

// Exportação para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CalculadoraAvancada,
        ValidadorExpressoes,
        SistemaPontuacao
    };
}