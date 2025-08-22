/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 2.2
LOOPS E ITERAÇÃO
==============================================

Objetivos de Aprendizagem:
- Dominar estruturas de repetição (for, while, do-while)
- Compreender loops especializados (for...in, for...of)
- Aplicar controle de fluxo (break, continue)
- Otimizar performance em iterações
- Evitar loops infinitos

⏱️ TEMPO ESTIMADO: 45 minutos
📊 NÍVEL: Básico/Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: LOOPS E ITERAÇÃO
// ==========================================

/*
LOOPS (estruturas de repetição) permitem executar um bloco de código
múltiplas vezes, evitando repetição desnecessária.

Tipos principais:
1. for - Quando sabemos quantas iterações fazer
2. while - Enquanto uma condição for verdadeira
3. do-while - Executa pelo menos uma vez, depois verifica condição
4. for...in - Itera sobre propriedades enumeráveis de objetos
5. for...of - Itera sobre valores de estruturas iteráveis

Controle de fluxo:
- break: Sai do loop imediatamente
- continue: Pula para próxima iteração
*/

console.log('=== LOOPS E ITERAÇÃO ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== LOOP FOR TRADICIONAL ==========
console.log('\n--- LOOP FOR TRADICIONAL ---');

// Sintaxe: for (inicialização; condição; incremento)
for (let i = 1; i <= 5; i++) {
    console.log(`Iteração ${i}: ${i * i} (quadrado)`);
}

// Loop decrescente
console.log('\nContagem regressiva:');
for (let i = 5; i >= 1; i--) {
    console.log(`${i}...`);
}
console.log('🚀 Decolagem!');

// Loop com incremento personalizado
console.log('\nNúmeros pares de 0 a 10:');
for (let i = 0; i <= 10; i += 2) {
    console.log(i);
}

// ========== LOOP WHILE ==========
console.log('\n--- LOOP WHILE ---');

// Exemplo: Encontrar primeira potência de 2 maior que 1000
let potencia = 1;
let expoente = 0;

while (potencia <= 1000) {
    console.log(`2^${expoente} = ${potencia}`);
    expoente++;
    potencia = Math.pow(2, expoente);
}
console.log(`Primeira potência > 1000: 2^${expoente} = ${potencia}`);

// Exemplo prático: Validação de entrada
let tentativas = 0;
let senhaCorreta = false;
const senhaSecreta = "123456";

while (!senhaCorreta && tentativas < 3) {
    tentativas++;
    // Simulando entrada do usuário
    const senhaDigitada = tentativas === 1 ? "wrong" : tentativas === 2 ? "also_wrong" : "123456";
    
    console.log(`Tentativa ${tentativas}: Senha "${senhaDigitada}"`);
    
    if (senhaDigitada === senhaSecreta) {
        senhaCorreta = true;
        console.log('✅ Acesso liberado!');
    } else {
        console.log('❌ Senha incorreta');
    }
}

if (!senhaCorreta) {
    console.log('🔒 Acesso bloqueado - muitas tentativas');
}

// ========== LOOP DO-WHILE ==========
console.log('\n--- LOOP DO-WHILE ---');

// Executa pelo menos uma vez, depois verifica condição
let numero = 10;

do {
    console.log(`Número atual: ${numero}`);
    numero -= 3;
} while (numero > 0);

console.log('Loop finalizado');

// Exemplo prático: Menu interativo (simulado)
let opcaoMenu;
let execucoes = 0;

do {
    execucoes++;
    console.log(`\n--- MENU (Execução ${execucoes}) ---`);
    console.log('1. Ver perfil');
    console.log('2. Configurações');
    console.log('3. Sair');
    
    // Simulando escolha do usuário
    opcaoMenu = execucoes === 1 ? 1 : execucoes === 2 ? 2 : 3;
    
    switch (opcaoMenu) {
        case 1:
            console.log('📋 Exibindo perfil do usuário...');
            break;
        case 2:
            console.log('⚙️ Abrindo configurações...');
            break;
        case 3:
            console.log('👋 Saindo do sistema...');
            break;
        default:
            console.log('❌ Opção inválida');
    }
} while (opcaoMenu !== 3 && execucoes < 5); // Limite de segurança

// ========== FOR...IN (Objetos) ==========
console.log('\n--- FOR...IN (Propriedades de Objetos) ---');

const usuario = {
    nome: 'Ana Silva',
    idade: 28,
    profissao: 'Desenvolvedora',
    cidade: 'São Paulo',
    ativo: true
};

console.log('Propriedades do usuário:');
for (const propriedade in usuario) {
    const valor = usuario[propriedade];
    const tipo = typeof valor;
    console.log(`${propriedade}: ${valor} (${tipo})`);
}

// Exemplo com array (mostra índices)
const cores = ['vermelho', 'verde', 'azul'];
console.log('\nÍndices do array cores:');
for (const indice in cores) {
    console.log(`Índice ${indice}: ${cores[indice]}`);
}

// ========== FOR...OF (Valores Iteráveis) ==========
console.log('\n--- FOR...OF (Valores de Iteráveis) ---');

// Com arrays
const frutas = ['maçã', 'banana', 'laranja', 'uva'];
console.log('Frutas disponíveis:');
for (const fruta of frutas) {
    console.log(`🍎 ${fruta}`);
}

// Com strings
const palavra = 'JavaScript';
console.log('\nLetras da palavra "JavaScript":');
for (const letra of palavra) {
    console.log(letra);
}

// Com Set
const numerosUnicos = new Set([1, 2, 3, 2, 4, 1, 5]);
console.log('\nNúmeros únicos:');
for (const numero of numerosUnicos) {
    console.log(numero);
}

// ========== CONTROLE DE FLUXO ==========
console.log('\n--- CONTROLE DE FLUXO (break e continue) ---');

// BREAK - Sai do loop completamente
console.log('Procurando número 7:');
for (let i = 1; i <= 10; i++) {
    if (i === 7) {
        console.log(`✅ Encontrado: ${i}`);
        break; // Sai do loop
    }
    console.log(`Verificando: ${i}`);
}

// CONTINUE - Pula para próxima iteração
console.log('\nNúmeros ímpares de 1 a 10:');
for (let i = 1; i <= 10; i++) {
    if (i % 2 === 0) {
        continue; // Pula números pares
    }
    console.log(i);
}

// Exemplo prático: Processamento de dados com validação
const dadosUsuarios = [
    { nome: 'João', idade: 25, email: 'joao@email.com' },
    { nome: '', idade: 30, email: 'invalido' }, // Dados inválidos
    { nome: 'Maria', idade: -5, email: 'maria@email.com' }, // Idade inválida
    { nome: 'Pedro', idade: 35, email: 'pedro@email.com' },
    { nome: 'Ana', idade: 28, email: '' } // Email vazio
];

console.log('\nProcessando dados de usuários:');
let usuariosValidos = 0;

for (let i = 0; i < dadosUsuarios.length; i++) {
    const usuario = dadosUsuarios[i];
    
    // Validações
    if (!usuario.nome || usuario.nome.trim() === '') {
        console.log(`❌ Usuário ${i + 1}: Nome inválido`);
        continue;
    }
    
    if (usuario.idade <= 0 || usuario.idade > 120) {
        console.log(`❌ Usuário ${i + 1}: Idade inválida (${usuario.idade})`);
        continue;
    }
    
    if (!usuario.email || !usuario.email.includes('@')) {
        console.log(`❌ Usuário ${i + 1}: Email inválido`);
        continue;
    }
    
    // Se chegou até aqui, dados são válidos
    usuariosValidos++;
    console.log(`✅ Usuário ${i + 1}: ${usuario.nome} - Dados válidos`);
}

console.log(`\n📊 Resultado: ${usuariosValidos} usuários válidos de ${dadosUsuarios.length}`);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Tabuada Completa
console.log('\n--- EXERCÍCIO 1: TABUADA COMPLETA ---');

function gerarTabuada(numero, limite = 10) {
    console.log(`\n📊 Tabuada do ${numero}:`);
    for (let i = 1; i <= limite; i++) {
        const resultado = numero * i;
        console.log(`${numero} x ${i} = ${resultado}`);
    }
}

gerarTabuada(7);
gerarTabuada(3, 5);

// EXERCÍCIO 2: Contador de Caracteres
console.log('\n--- EXERCÍCIO 2: CONTADOR DE CARACTERES ---');

function analisarTexto(texto) {
    const contadores = {
        total: 0,
        letras: 0,
        numeros: 0,
        espacos: 0,
        especiais: 0
    };
    
    for (const char of texto) {
        contadores.total++;
        
        if (char.match(/[a-zA-ZÀ-ÿ]/)) {
            contadores.letras++;
        } else if (char.match(/[0-9]/)) {
            contadores.numeros++;
        } else if (char === ' ') {
            contadores.espacos++;
        } else {
            contadores.especiais++;
        }
    }
    
    return contadores;
}

const textoTeste = "Olá! Meu telefone é (11) 99999-9999.";
const analise = analisarTexto(textoTeste);

console.log(`Texto: "${textoTeste}"`);
console.log('Análise:');
for (const [tipo, quantidade] of Object.entries(analise)) {
    console.log(`  ${tipo}: ${quantidade}`);
}

// EXERCÍCIO 3: Gerador de Sequência Fibonacci
console.log('\n--- EXERCÍCIO 3: SEQUÊNCIA FIBONACCI ---');

function fibonacci(quantidade) {
    const sequencia = [];
    
    for (let i = 0; i < quantidade; i++) {
        if (i === 0) {
            sequencia.push(0);
        } else if (i === 1) {
            sequencia.push(1);
        } else {
            const proximo = sequencia[i - 1] + sequencia[i - 2];
            sequencia.push(proximo);
        }
    }
    
    return sequencia;
}

const fib10 = fibonacci(10);
console.log('Primeiros 10 números de Fibonacci:');
console.log(fib10.join(', '));

// Versão otimizada sem array
function fibonacciOtimizado(quantidade) {
    console.log('\nFibonacci otimizado (sem array):');
    
    if (quantidade >= 1) console.log('0');
    if (quantidade >= 2) console.log('1');
    
    let anterior = 0;
    let atual = 1;
    
    for (let i = 2; i < quantidade; i++) {
        const proximo = anterior + atual;
        console.log(proximo);
        anterior = atual;
        atual = proximo;
    }
}

fibonacciOtimizado(8);

// ==========================================
// 🚀 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

// DICA 1: Cache o length em loops com arrays
console.log('\n--- DICA 1: Cache do length ---');

const arrayGrande = new Array(1000000).fill(0).map((_, i) => i);

// ❌ Menos eficiente (recalcula length a cada iteração)
console.time('Sem cache');
let soma1 = 0;
for (let i = 0; i < arrayGrande.length; i++) {
    soma1 += arrayGrande[i];
}
console.timeEnd('Sem cache');

// ✅ Mais eficiente (calcula length uma vez)
console.time('Com cache');
let soma2 = 0;
const length = arrayGrande.length;
for (let i = 0; i < length; i++) {
    soma2 += arrayGrande[i];
}
console.timeEnd('Com cache');

console.log(`Resultados iguais: ${soma1 === soma2}`);

// DICA 2: Use for...of para legibilidade, for tradicional para performance
console.log('\n--- DICA 2: Escolha do loop adequado ---');

const numeros = [1, 2, 3, 4, 5];

// Para legibilidade
console.log('For...of (legível):');
for (const numero of numeros) {
    console.log(`Número: ${numero}`);
}

// Para performance crítica
console.log('\nFor tradicional (rápido):');
for (let i = 0, len = numeros.length; i < len; i++) {
    console.log(`Número: ${numeros[i]}`);
}

// DICA 3: Evite loops aninhados desnecessários
console.log('\n--- DICA 3: Otimização de loops aninhados ---');

// ❌ Menos eficiente O(n²)
function encontrarDuplicatasLento(array) {
    const duplicatas = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[i] === array[j] && !duplicatas.includes(array[i])) {
                duplicatas.push(array[i]);
            }
        }
    }
    return duplicatas;
}

// ✅ Mais eficiente O(n)
function encontrarDuplicatasRapido(array) {
    const contadores = {};
    const duplicatas = [];
    
    for (const item of array) {
        contadores[item] = (contadores[item] || 0) + 1;
    }
    
    for (const [item, count] of Object.entries(contadores)) {
        if (count > 1) {
            duplicatas.push(item);
        }
    }
    
    return duplicatas;
}

const arrayTeste = [1, 2, 3, 2, 4, 5, 3, 6, 1];
console.log('Array:', arrayTeste);
console.log('Duplicatas (lento):', encontrarDuplicatasLento(arrayTeste));
console.log('Duplicatas (rápido):', encontrarDuplicatasRapido(arrayTeste));

// ==========================================
// 📖 5. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');
console.log('📚 MDN - Loops and iteration: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Loops_and_iteration');
console.log('📚 JavaScript.info - Loops: https://javascript.info/while-for');
console.log('📚 Performance de loops: https://jsperf.com/');
console.log('📚 Big O Notation: https://www.bigocheatsheet.com/');

console.log('\n✅ Módulo 2.2 - Loops e Iteração concluído!');
console.log('📚 Próximo: Tratamento de Erros');

// ==========================================
// 📤 EXPORTAÇÕES (para uso em outros módulos)
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gerarTabuada,
        analisarTexto,
        fibonacci,
        fibonacciOtimizado,
        encontrarDuplicatasLento,
        encontrarDuplicatasRapido
    };
}