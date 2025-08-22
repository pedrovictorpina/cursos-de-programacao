/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 1.3
CONVERSÃO DE TIPOS
==============================================

Objetivos de Aprendizagem:
- Compreender conversão implícita (coerção)
- Dominar conversão explícita (casting)
- Identificar armadilhas comuns
- Aplicar boas práticas de conversão
- Evitar bugs relacionados a tipos

==============================================
*/

// ==========================================
// 1. TEORIA: CONVERSÃO DE TIPOS
// ==========================================

/*
CONVERSÃO DE TIPOS (Type Conversion) é o processo de transformar um valor
de um tipo para outro.

Tipos de conversão:
1. IMPLÍCITA (Coerção) - JavaScript converte automaticamente
2. EXPLÍCITA (Casting) - Programador força a conversão

JavaScript é uma linguagem dinamicamente tipada, o que significa que
os tipos são determinados em tempo de execução e podem mudar.

Tipos primitivos para conversão:
- string ↔ number
- string ↔ boolean
- number ↔ boolean
- object → primitive
*/

// ==========================================
// 2. CONVERSÃO IMPLÍCITA (COERÇÃO)
// ==========================================

console.log('=== CONVERSÃO IMPLÍCITA (COERÇÃO) ===');

/*
Coerção acontece automaticamente quando JavaScript precisa de um tipo
específico para uma operação, mas recebe outro tipo.
*/

// Coerção com operador +
console.log('--- OPERADOR + (CONCATENAÇÃO vs ADIÇÃO) ---');
console.log('"5" + 3 =', "5" + 3); // String + Number = String (concatenação)
console.log('5 + "3" =', 5 + "3"); // Number + String = String (concatenação)
console.log('"5" + "3" =', "5" + "3"); // String + String = String (concatenação)
console.log('5 + 3 =', 5 + 3); // Number + Number = Number (adição)
console.log('true + 1 =', true + 1); // Boolean + Number = Number (true = 1)
console.log('false + 1 =', false + 1); // Boolean + Number = Number (false = 0)
console.log('null + 1 =', null + 1); // null + Number = Number (null = 0)
console.log('undefined + 1 =', undefined + 1); // undefined + Number = NaN

// Coerção com outros operadores aritméticos
console.log('\n--- OUTROS OPERADORES ARITMÉTICOS ---');
console.log('"10" - 5 =', "10" - 5); // String → Number
console.log('"10" * 2 =', "10" * 2); // String → Number
console.log('"10" / 2 =', "10" / 2); // String → Number
console.log('"10" % 3 =', "10" % 3); // String → Number
console.log('"abc" - 5 =', "abc" - 5); // String inválida → NaN

// Coerção com operadores de comparação
console.log('\n--- OPERADORES DE COMPARAÇÃO ---');
console.log('"10" == 10:', "10" == 10); // true (coerção)
console.log('"10" === 10:', "10" === 10); // false (sem coerção)
console.log('true == 1:', true == 1); // true
console.log('false == 0:', false == 0); // true
console.log('null == undefined:', null == undefined); // true
console.log('"" == 0:', "" == 0); // true
console.log('" " == 0:', " " == 0); // true

// Coerção em contexto booleano
console.log('\n--- CONTEXTO BOOLEANO ---');
const valores = [0, 1, "", "hello", null, undefined, [], {}, NaN, false, true];

valores.forEach(valor => {
    const booleano = Boolean(valor);
    const categoria = booleano ? 'truthy' : 'falsy';
    console.log(`${JSON.stringify(valor)} → ${booleano} (${categoria})`);
});

// ==========================================
// 3. CONVERSÃO EXPLÍCITA (CASTING)
// ==========================================

console.log('\n=== CONVERSÃO EXPLÍCITA (CASTING) ===');

// Para String
console.log('--- CONVERSÃO PARA STRING ---');
const numero = 123;
const booleano = true;
const nulo = null;
const indefinido = undefined;
const objeto = { nome: "teste" };
const array = [1, 2, 3];

console.log('String(123):', String(numero));
console.log('(123).toString():', numero.toString());
console.log('123 + "":', numero + "");
console.log('String(true):', String(booleano));
console.log('String(null):', String(nulo));
console.log('String(undefined):', String(indefinido));
console.log('String(objeto):', String(objeto));
console.log('String(array):', String(array));

// Para Number
console.log('\n--- CONVERSÃO PARA NUMBER ---');
const stringNumero = "456";
const stringDecimal = "123.45";
const stringInvalida = "abc";
const stringVazia = "";
const stringEspaco = " ";

console.log('Number("456"):', Number(stringNumero));
console.log('Number("123.45"):', Number(stringDecimal));
console.log('Number("abc"):', Number(stringInvalida));
console.log('Number(""):', Number(stringVazia));
console.log('Number(" "):', Number(stringEspaco));
console.log('Number(true):', Number(true));
console.log('Number(false):', Number(false));
console.log('Number(null):', Number(null));
console.log('Number(undefined):', Number(undefined));

// parseInt e parseFloat
console.log('\n--- PARSEINT E PARSEFLOAT ---');
const strings = ["123", "123.45", "123abc", "abc123", "  456  ", "0x10", "010"];

strings.forEach(str => {
    console.log(`"${str}":`);
    console.log(`  parseInt(): ${parseInt(str)}`);
    console.log(`  parseInt(base 10): ${parseInt(str, 10)}`);
    console.log(`  parseFloat(): ${parseFloat(str)}`);
    console.log(`  Number(): ${Number(str)}`);
});

// Para Boolean
console.log('\n--- CONVERSÃO PARA BOOLEAN ---');
const valoresParaBoolean = [0, 1, -1, "", "hello", null, undefined, [], {}, NaN];

valoresParaBoolean.forEach(valor => {
    console.log(`${JSON.stringify(valor)}:`);
    console.log(`  Boolean(): ${Boolean(valor)}`);
    console.log(`  !!: ${!!valor}`);
});

// ==========================================
// 4. CASOS ESPECIAIS E ARMADILHAS
// ==========================================

console.log('\n=== CASOS ESPECIAIS E ARMADILHAS ===');

// Array para primitivo
console.log('--- ARRAY PARA PRIMITIVO ---');
const arrayVazio = [];
const arrayUmElemento = [42];
const arrayMultiplos = [1, 2, 3];

console.log('[] + "" =', arrayVazio + ""); // ""
console.log('[42] + "" =', arrayUmElemento + ""); // "42"
console.log('[1,2,3] + "" =', arrayMultiplos + ""); // "1,2,3"
console.log('Number([]) =', Number(arrayVazio)); // 0
console.log('Number([42]) =', Number(arrayUmElemento)); // 42
console.log('Number([1,2,3]) =', Number(arrayMultiplos)); // NaN

// Objeto para primitivo
console.log('\n--- OBJETO PARA PRIMITIVO ---');
const obj = { valueOf: () => 42, toString: () => "objeto" };
const objSemValueOf = { toString: () => "só toString" };

console.log('obj + 0 =', obj + 0); // Usa valueOf()
console.log('obj + "" =', obj + ""); // Usa valueOf() → toString()
console.log('String(obj) =', String(obj)); // Usa toString()
console.log('objSemValueOf + 0 =', objSemValueOf + 0); // Usa toString()

// Comparações estranhas
console.log('\n--- COMPARAÇÕES ESTRANHAS ---');
console.log('[] == ![] =', [] == ![]); // true (![] = false, [] == false)
console.log('"" == 0 =', "" == 0); // true
console.log('" " == 0 =', " " == 0); // true
console.log('"0" == false =', "0" == false); // true
console.log('null == 0 =', null == 0); // false
console.log('null >= 0 =', null >= 0); // true (null → 0)

// NaN peculiaridades
console.log('\n--- NaN PECULIARIDADES ---');
console.log('NaN == NaN =', NaN == NaN); // false
console.log('NaN === NaN =', NaN === NaN); // false
console.log('Number.isNaN(NaN) =', Number.isNaN(NaN)); // true
console.log('isNaN("abc") =', isNaN("abc")); // true (converte para Number)
console.log('Number.isNaN("abc") =', Number.isNaN("abc")); // false (não converte)

// ==========================================
// 5. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

/*
EXERCÍCIO 1: CONVERSOR UNIVERSAL
Crie um conversor que transforme qualquer valor para string, number e boolean
com validação e tratamento de erros.
*/

console.log('\n--- EXERCÍCIO 1: CONVERSOR UNIVERSAL ---');

class ConversorUniversal {
    static paraString(valor) {
        try {
            if (valor === null) return "null";
            if (valor === undefined) return "undefined";
            if (typeof valor === 'symbol') return valor.toString();
            if (typeof valor === 'bigint') return valor.toString();
            if (typeof valor === 'object') {
                return JSON.stringify(valor);
            }
            return String(valor);
        } catch (error) {
            return `[Erro na conversão: ${error.message}]`;
        }
    }
    
    static paraNumero(valor) {
        if (valor === null) return 0;
        if (valor === undefined) return NaN;
        if (typeof valor === 'boolean') return valor ? 1 : 0;
        if (typeof valor === 'string') {
            const trimmed = valor.trim();
            if (trimmed === '') return 0;
            const numero = Number(trimmed);
            return isNaN(numero) ? NaN : numero;
        }
        if (typeof valor === 'bigint') return Number(valor);
        if (typeof valor === 'object') {
            if (Array.isArray(valor)) {
                if (valor.length === 0) return 0;
                if (valor.length === 1) return this.paraNumero(valor[0]);
                return NaN;
            }
            return NaN;
        }
        return Number(valor);
    }
    
    static paraBoolean(valor) {
        // Valores falsy: false, 0, -0, 0n, "", null, undefined, NaN
        if (valor === false || valor === 0 || valor === -0 || valor === 0n) return false;
        if (valor === "" || valor === null || valor === undefined) return false;
        if (Number.isNaN(valor)) return false;
        return true;
    }
    
    static analisar(valor) {
        return {
            original: valor,
            tipo: typeof valor,
            string: this.paraString(valor),
            numero: this.paraNumero(valor),
            boolean: this.paraBoolean(valor),
            isValido: {
                string: typeof this.paraString(valor) === 'string',
                numero: !isNaN(this.paraNumero(valor)),
                boolean: typeof this.paraBoolean(valor) === 'boolean'
            }
        };
    }
}

// Testando o conversor
const valoresParaTeste = [
    42, "123", "abc", true, false, null, undefined,
    [], [1], [1, 2], {}, { a: 1 }, NaN, Infinity,
    "", " ", "0", "false", Symbol('test'), 123n
];

valoresParaTeste.forEach(valor => {
    const resultado = ConversorUniversal.analisar(valor);
    console.log(`\nValor: ${JSON.stringify(valor)} (${resultado.tipo})`);
    console.log(`  String: "${resultado.string}"`);
    console.log(`  Number: ${resultado.numero}`);
    console.log(`  Boolean: ${resultado.boolean}`);
});

/*
EXERCÍCIO 2: VALIDADOR DE ENTRADA
Crie um sistema que valide e converta entradas de usuário
com diferentes estratégias de conversão.
*/

console.log('\n--- EXERCÍCIO 2: VALIDADOR DE ENTRADA ---');

class ValidadorEntrada {
    static validarIdade(entrada) {
        // Estratégia: converter para número e validar
        const numero = parseInt(entrada, 10);
        
        if (isNaN(numero)) {
            return { valido: false, erro: "Não é um número válido", valor: null };
        }
        
        if (numero < 0) {
            return { valido: false, erro: "Idade não pode ser negativa", valor: numero };
        }
        
        if (numero > 150) {
            return { valido: false, erro: "Idade muito alta", valor: numero };
        }
        
        return { valido: true, erro: null, valor: numero };
    }
    
    static validarPreco(entrada) {
        // Estratégia: limpar formatação e converter
        let limpo = entrada.toString().replace(/[R$\s]/g, '').replace(',', '.');
        const numero = parseFloat(limpo);
        
        if (isNaN(numero)) {
            return { valido: false, erro: "Preço inválido", valor: null };
        }
        
        if (numero < 0) {
            return { valido: false, erro: "Preço não pode ser negativo", valor: numero };
        }
        
        // Arredondar para 2 casas decimais
        const valorFinal = Math.round(numero * 100) / 100;
        
        return { valido: true, erro: null, valor: valorFinal };
    }
    
    static validarBoolean(entrada) {
        // Estratégia: múltiplas formas de representar boolean
        const str = entrada.toString().toLowerCase().trim();
        
        const verdadeiro = ['true', '1', 'sim', 'yes', 'on', 'ativo', 'ligado'];
        const falso = ['false', '0', 'não', 'nao', 'no', 'off', 'inativo', 'desligado'];
        
        if (verdadeiro.includes(str)) {
            return { valido: true, erro: null, valor: true };
        }
        
        if (falso.includes(str)) {
            return { valido: true, erro: null, valor: false };
        }
        
        return { valido: false, erro: "Valor booleano não reconhecido", valor: null };
    }
    
    static validarData(entrada) {
        // Estratégia: tentar múltiplos formatos
        const formatos = [
            /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
            /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
            /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
        ];
        
        const str = entrada.toString().trim();
        
        // Tentar conversão direta
        const dataDirecta = new Date(str);
        if (!isNaN(dataDirecta.getTime())) {
            return { valido: true, erro: null, valor: dataDirecta };
        }
        
        // Tentar formatos específicos
        for (let formato of formatos) {
            const match = str.match(formato);
            if (match) {
                let [, p1, p2, p3] = match;
                let data;
                
                if (formato.source.includes('\\d{4}')) {
                    // YYYY-MM-DD
                    data = new Date(parseInt(p1), parseInt(p2) - 1, parseInt(p3));
                } else {
                    // DD/MM/YYYY ou DD-MM-YYYY
                    data = new Date(parseInt(p3), parseInt(p2) - 1, parseInt(p1));
                }
                
                if (!isNaN(data.getTime())) {
                    return { valido: true, erro: null, valor: data };
                }
            }
        }
        
        return { valido: false, erro: "Formato de data não reconhecido", valor: null };
    }
}

// Testando validações
const testesValidacao = [
    ['idade', '25'],
    ['idade', 'abc'],
    ['idade', '-5'],
    ['preco', 'R$ 123,45'],
    ['preco', '99.99'],
    ['preco', 'abc'],
    ['boolean', 'true'],
    ['boolean', 'sim'],
    ['boolean', 'maybe'],
    ['data', '25/12/2023'],
    ['data', '2023-12-25'],
    ['data', 'invalid']
];

testesValidacao.forEach(([tipo, entrada]) => {
    let resultado;
    switch(tipo) {
        case 'idade': resultado = ValidadorEntrada.validarIdade(entrada); break;
        case 'preco': resultado = ValidadorEntrada.validarPreco(entrada); break;
        case 'boolean': resultado = ValidadorEntrada.validarBoolean(entrada); break;
        case 'data': resultado = ValidadorEntrada.validarData(entrada); break;
    }
    
    console.log(`${tipo.toUpperCase()} "${entrada}": ${resultado.valido ? '✅' : '❌'} ${resultado.erro || resultado.valor}`);
});

/*
EXERCÍCIO 3: COMPARADOR INTELIGENTE
Crie um sistema que compare valores de diferentes tipos
com estratégias de conversão personalizadas.
*/

console.log('\n--- EXERCÍCIO 3: COMPARADOR INTELIGENTE ---');

class ComparadorInteligente {
    static compararEstrito(a, b) {
        // Comparação sem conversão
        return {
            igual: a === b,
            tipoA: typeof a,
            tipoB: typeof b,
            valorA: a,
            valorB: b
        };
    }
    
    static compararComCoercao(a, b) {
        // Comparação com conversão automática
        return {
            igual: a == b,
            tipoA: typeof a,
            tipoB: typeof b,
            valorA: a,
            valorB: b
        };
    }
    
    static compararNormalizado(a, b) {
        // Normalizar ambos para string e comparar
        const strA = ConversorUniversal.paraString(a).toLowerCase();
        const strB = ConversorUniversal.paraString(b).toLowerCase();
        
        return {
            igual: strA === strB,
            stringA: strA,
            stringB: strB,
            originalA: a,
            originalB: b
        };
    }
    
    static compararNumerico(a, b) {
        // Tentar converter ambos para número
        const numA = ConversorUniversal.paraNumero(a);
        const numB = ConversorUniversal.paraNumero(b);
        
        const ambosValidos = !isNaN(numA) && !isNaN(numB);
        
        return {
            igual: ambosValidos && numA === numB,
            numeroA: numA,
            numeroB: numB,
            ambosValidos: ambosValidos,
            originalA: a,
            originalB: b
        };
    }
    
    static analisarComparacao(a, b) {
        return {
            estrito: this.compararEstrito(a, b),
            coercao: this.compararComCoercao(a, b),
            normalizado: this.compararNormalizado(a, b),
            numerico: this.compararNumerico(a, b)
        };
    }
}

// Testando comparações
const paresComparacao = [
    [10, "10"],
    [true, 1],
    [false, 0],
    [null, undefined],
    ["", 0],
    [[], false],
    ["abc", "ABC"]
];

paresComparacao.forEach(([a, b]) => {
    const analise = ComparadorInteligente.analisarComparacao(a, b);
    console.log(`\nComparando ${JSON.stringify(a)} com ${JSON.stringify(b)}:`);
    console.log(`  Estrito (===): ${analise.estrito.igual}`);
    console.log(`  Coerção (==): ${analise.coercao.igual}`);
    console.log(`  Normalizado: ${analise.normalizado.igual}`);
    console.log(`  Numérico: ${analise.numerico.igual}`);
});

// ==========================================
// 6. BOAS PRÁTICAS
// ==========================================

console.log('\n=== BOAS PRÁTICAS ===');

/*
BOAS PRÁTICAS PARA CONVERSÃO DE TIPOS:

1. ✅ Use conversão explícita sempre que possível
2. ✅ Prefira === em vez de == para evitar coerção
3. ✅ Use Number.isNaN() em vez de isNaN()
4. ✅ Valide entradas antes de converter
5. ✅ Use parseInt() com base explícita
6. ✅ Trate casos especiais (null, undefined, NaN)
7. ✅ Documente conversões não óbvias
8. ❌ Evite confiar em coerção automática
9. ❌ Não use == com null/undefined
10. ❌ Cuidado com + para concatenação vs adição
*/

// Exemplos de boas práticas
function exemploBoasPraticas() {
    // ✅ Conversão explícita
    const idade = Number(prompt("Digite sua idade:"));
    if (Number.isNaN(idade)) {
        console.log("Idade inválida");
        return;
    }
    
    // ✅ Validação antes da conversão
    function converterParaNumero(valor) {
        if (valor === null || valor === undefined) {
            throw new Error("Valor não pode ser null ou undefined");
        }
        
        const numero = Number(valor);
        if (Number.isNaN(numero)) {
            throw new Error(`Não foi possível converter "${valor}" para número`);
        }
        
        return numero;
    }
    
    // ✅ Comparação estrita
    function verificarIgualdade(a, b) {
        return a === b; // Sem coerção
    }
    
    // ✅ parseInt com base
    const binario = parseInt("1010", 2); // Base 2
    const hexadecimal = parseInt("FF", 16); // Base 16
    
    console.log("Exemplos de boas práticas executados");
}

// ==========================================
// 7. DICAS DE OTIMIZAÇÃO
// ==========================================

/*
DICAS DE PERFORMANCE:

1. Conversões explícitas são mais rápidas que coerção
2. Use Number() para conversão geral, parseInt() para inteiros
3. Cache conversões custosas
4. Evite conversões desnecessárias em loops
5. Use typeof para verificação de tipos antes da conversão
6. Prefira métodos nativos (Number.isNaN, Number.isInteger)
*/

console.log('\n=== DICAS IMPORTANTES ===');
console.log('1. Use conversão explícita para clareza e performance');
console.log('2. Sempre valide antes de converter');
console.log('3. === é mais seguro que == (evita coerção)');
console.log('4. Number.isNaN() é mais preciso que isNaN()');
console.log('5. parseInt() sempre com base explícita');
console.log('6. Cuidado com + (pode ser concatenação ou adição)');

// ==========================================
// 8. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS RECOMENDADAS:

📚 Documentação:
- MDN Type Conversion: https://developer.mozilla.org/en-US/docs/Glossary/Type_conversion
- MDN Type Coercion: https://developer.mozilla.org/en-US/docs/Glossary/Type_coercion
- ECMAScript Abstract Operations: https://tc39.es/ecma262/#sec-abstract-operations

📖 Artigos Essenciais:
- "JavaScript Type Conversion" - javascript.info
- "Equality comparisons and sameness" - MDN
- "You Don't Know JS: Types & Grammar" - Kyle Simpson

🎯 Ferramentas:
- TypeScript para tipagem estática
- ESLint rules: eqeqeq, no-implicit-coercion
- Babel para transpilação segura

🔧 Testes:
- Jest para testes de conversão
- Property-based testing com fast-check
- Benchmark.js para performance
*/

console.log('\n✅ Módulo 1.3 - Conversão de Tipos concluído!');
console.log('📚 Próximo: Estruturas de Controle');

// Exportação para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ConversorUniversal,
        ValidadorEntrada,
        ComparadorInteligente
    };
}