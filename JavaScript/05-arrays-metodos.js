/*
===========================================
    CURSO JAVASCRIPT - ARRAYS E MÉTODOS
===========================================

Este arquivo aborda:
- Criação e manipulação de arrays
- Métodos de adição e remoção
- Métodos de busca e verificação
- Métodos de transformação (map, filter, reduce)
- Métodos de iteração (forEach, find, some, every)
- Arrays multidimensionais
- Destructuring de arrays
- Spread operator com arrays
- Exemplos práticos avançados
*/

// ========================================
// 1. CRIAÇÃO DE ARRAYS
// ========================================

// Array literal (forma mais comum)
const frutas = ["maçã", "banana", "laranja", "uva"];
const numeros = [1, 2, 3, 4, 5];
const misto = ["texto", 42, true, null, { nome: "objeto" }];

// Array constructor
const arrayVazio = new Array();
const arrayComTamanho = new Array(5); // Array com 5 posições vazias
const arrayComElementos = new Array("a", "b", "c");

// Array.from() - cria array a partir de iterável
const arrayDeString = Array.from("hello"); // ["h", "e", "l", "l", "o"]
const arrayDeNumeros = Array.from({length: 5}, (_, i) => i + 1); // [1, 2, 3, 4, 5]

// Array.of() - cria array com elementos específicos
const arrayOf = Array.of(1, 2, 3, 4); // [1, 2, 3, 4]

console.log("Arrays criados:", { frutas, numeros, misto, arrayDeString, arrayDeNumeros });

// ========================================
// 2. PROPRIEDADES E ACESSO
// ========================================

// Propriedade length
console.log("Tamanho do array frutas:", frutas.length); // 4

// Acessando elementos
console.log("Primeira fruta:", frutas[0]); // "maçã"
console.log("Última fruta:", frutas[frutas.length - 1]); // "uva"
console.log("Última fruta (método at):", frutas.at(-1)); // "uva" (ES2022)

// Modificando elementos
frutas[1] = "manga";
console.log("Frutas após modificação:", frutas);

// Verificando se é array
console.log("É array?", Array.isArray(frutas)); // true
console.log("É array?", Array.isArray("não é array")); // false

// ========================================
// 3. MÉTODOS DE ADIÇÃO E REMOÇÃO
// ========================================

// push() - adiciona no final
const animais = ["gato", "cachorro"];
animais.push("pássaro");
animais.push("peixe", "hamster"); // Múltiplos elementos
console.log("Após push:", animais);

// pop() - remove do final
const ultimoAnimal = animais.pop();
console.log("Animal removido:", ultimoAnimal);
console.log("Após pop:", animais);

// unshift() - adiciona no início
animais.unshift("coelho");
console.log("Após unshift:", animais);

// shift() - remove do início
const primeiroAnimal = animais.shift();
console.log("Animal removido do início:", primeiroAnimal);
console.log("Após shift:", animais);

// splice() - adiciona/remove em qualquer posição
const cores = ["vermelho", "azul", "verde"];

// Removendo elementos
const coresRemovidas = cores.splice(1, 1); // Remove 1 elemento na posição 1
console.log("Cores removidas:", coresRemovidas); // ["azul"]
console.log("Cores restantes:", cores); // ["vermelho", "verde"]

// Adicionando elementos
cores.splice(1, 0, "amarelo", "roxo"); // Adiciona na posição 1, sem remover
console.log("Após adicionar:", cores); // ["vermelho", "amarelo", "roxo", "verde"]

// Substituindo elementos
cores.splice(2, 1, "laranja"); // Remove 1 e adiciona "laranja" na posição 2
console.log("Após substituir:", cores);

// ========================================
// 4. MÉTODOS DE BUSCA E VERIFICAÇÃO
// ========================================

const numeros2 = [10, 20, 30, 40, 50, 30];

// indexOf() - primeira ocorrência
console.log("Índice do 30:", numeros2.indexOf(30)); // 2
console.log("Índice do 100:", numeros2.indexOf(100)); // -1 (não encontrado)

// lastIndexOf() - última ocorrência
console.log("Último índice do 30:", numeros2.lastIndexOf(30)); // 5

// includes() - verifica se existe
console.log("Contém 40?", numeros2.includes(40)); // true
console.log("Contém 100?", numeros2.includes(100)); // false

// find() - primeiro elemento que satisfaz condição
const pessoas = [
    { nome: "Ana", idade: 25 },
    { nome: "Bruno", idade: 30 },
    { nome: "Carlos", idade: 35 }
];

const pessoaEncontrada = pessoas.find(pessoa => pessoa.idade > 28);
console.log("Primeira pessoa com mais de 28 anos:", pessoaEncontrada);

// findIndex() - índice do primeiro elemento que satisfaz condição
const indicePessoa = pessoas.findIndex(pessoa => pessoa.nome === "Bruno");
console.log("Índice do Bruno:", indicePessoa);

// some() - verifica se pelo menos um elemento satisfaz condição
const temMaiorQue30 = pessoas.some(pessoa => pessoa.idade > 30);
console.log("Tem alguém com mais de 30 anos?", temMaiorQue30);

// every() - verifica se todos os elementos satisfazem condição
const todosMaioresQue20 = pessoas.every(pessoa => pessoa.idade > 20);
console.log("Todos têm mais de 20 anos?", todosMaioresQue20);

// ========================================
// 5. MÉTODOS DE TRANSFORMAÇÃO
// ========================================

// map() - transforma cada elemento
const numerosOriginais = [1, 2, 3, 4, 5];
const numerosAoQuadrado = numerosOriginais.map(num => num ** 2);
const numerosComTexto = numerosOriginais.map(num => `Número: ${num}`);

console.log("Números originais:", numerosOriginais);
console.log("Números ao quadrado:", numerosAoQuadrado);
console.log("Números com texto:", numerosComTexto);

// map() com objetos
const pessoasComIdade = pessoas.map(pessoa => ({
    ...pessoa,
    categoria: pessoa.idade >= 30 ? "Adulto" : "Jovem"
}));
console.log("Pessoas com categoria:", pessoasComIdade);

// filter() - filtra elementos que satisfazem condição
const numerosPares = numerosOriginais.filter(num => num % 2 === 0);
const pessoasJovens = pessoas.filter(pessoa => pessoa.idade < 30);

console.log("Números pares:", numerosPares);
console.log("Pessoas jovens:", pessoasJovens);

// reduce() - reduz array a um único valor
const soma = numerosOriginais.reduce((acumulador, atual) => acumulador + atual, 0);
const produto = numerosOriginais.reduce((acc, curr) => acc * curr, 1);

console.log("Soma dos números:", soma);
console.log("Produto dos números:", produto);

// reduce() com objetos - contando ocorrências
const frutas2 = ["maçã", "banana", "maçã", "laranja", "banana", "maçã"];
const contadorFrutas = frutas2.reduce((contador, fruta) => {
    contador[fruta] = (contador[fruta] || 0) + 1;
    return contador;
}, {});
console.log("Contador de frutas:", contadorFrutas);

// reduce() para encontrar maior valor
const idades = pessoas.map(p => p.idade);
const maiorIdade = idades.reduce((maior, atual) => atual > maior ? atual : maior);
console.log("Maior idade:", maiorIdade);

// ========================================
// 6. MÉTODOS DE ITERAÇÃO
// ========================================

// forEach() - executa função para cada elemento
console.log("\nIterando com forEach:");
numerosOriginais.forEach((numero, indice) => {
    console.log(`Posição ${indice}: ${numero}`);
});

// for...of - iteração moderna
console.log("\nIterando com for...of:");
for (const fruta of frutas) {
    console.log(`Fruta: ${fruta}`);
}

// for...in - iteração por índices (não recomendado para arrays)
console.log("\nIterando com for...in:");
for (const indice in frutas) {
    console.log(`Índice ${indice}: ${frutas[indice]}`);
}

// entries() - retorna pares [índice, valor]
console.log("\nIterando com entries:");
for (const [indice, fruta] of frutas.entries()) {
    console.log(`${indice}: ${fruta}`);
}

// keys() - retorna índices
console.log("\nÍndices do array:", Array.from(frutas.keys()));

// values() - retorna valores
console.log("Valores do array:", Array.from(frutas.values()));

// ========================================
// 7. MÉTODOS DE ORDENAÇÃO E REVERSÃO
// ========================================

// sort() - ordena elementos (modifica o array original)
const numerosDesordenados = [3, 1, 4, 1, 5, 9, 2, 6];
const numerosOrdenados = [...numerosDesordenados].sort((a, b) => a - b);

console.log("Números desordenados:", numerosDesordenados);
console.log("Números ordenados:", numerosOrdenados);

// Ordenação de strings
const nomes = ["Carlos", "Ana", "Bruno", "Diana"];
const nomesOrdenados = [...nomes].sort();
console.log("Nomes ordenados:", nomesOrdenados);

// Ordenação de objetos
const pessoasPorIdade = [...pessoas].sort((a, b) => a.idade - b.idade);
const pessoasPorNome = [...pessoas].sort((a, b) => a.nome.localeCompare(b.nome));

console.log("Pessoas por idade:", pessoasPorIdade);
console.log("Pessoas por nome:", pessoasPorNome);

// reverse() - inverte ordem (modifica o array original)
const letras = ["a", "b", "c", "d"];
const letrasInvertidas = [...letras].reverse();
console.log("Letras invertidas:", letrasInvertidas);

// ========================================
// 8. MÉTODOS DE JUNÇÃO E DIVISÃO
// ========================================

// join() - une elementos em string
const palavras = ["JavaScript", "é", "incrível"];
const frase = palavras.join(" ");
const fraseComVirgula = palavras.join(", ");

console.log("Frase:", frase);
console.log("Frase com vírgula:", fraseComVirgula);

// concat() - une arrays
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const array3 = [7, 8, 9];

const arrayUnido = array1.concat(array2, array3);
console.log("Array unido:", arrayUnido);

// Spread operator (alternativa moderna ao concat)
const arrayComSpread = [...array1, ...array2, ...array3];
console.log("Array com spread:", arrayComSpread);

// slice() - extrai parte do array (não modifica original)
const alfabeto = ["a", "b", "c", "d", "e", "f", "g"];
const parte1 = alfabeto.slice(2, 5); // Do índice 2 ao 4
const parte2 = alfabeto.slice(-3); // Últimos 3 elementos
const copia = alfabeto.slice(); // Cópia completa

console.log("Parte 1:", parte1);
console.log("Parte 2:", parte2);
console.log("Cópia:", copia);

// ========================================
// 9. ARRAYS MULTIDIMENSIONAIS
// ========================================

// Matriz 2D
const matriz = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log("Elemento [1][2]:", matriz[1][2]); // 6

// Iterando matriz 2D
console.log("\nMatriz 2D:");
matriz.forEach((linha, i) => {
    linha.forEach((elemento, j) => {
        console.log(`[${i}][${j}] = ${elemento}`);
    });
});

// Achatando array multidimensional
const arrayAninhado = [[1, 2], [3, 4], [5, [6, 7]]];
const arrayAchatado = arrayAninhado.flat(); // Achata 1 nível
const arrayTotalmenteAchatado = arrayAninhado.flat(2); // Achata 2 níveis

console.log("Array aninhado:", arrayAninhado);
console.log("Array achatado (1 nível):", arrayAchatado);
console.log("Array totalmente achatado:", arrayTotalmenteAchatado);

// flatMap() - map + flat
const frases = ["hello world", "javascript rocks"];
const palavrasArray = frases.flatMap(frase => frase.split(" "));
console.log("Palavras:", palavrasArray);

// ========================================
// 10. DESTRUCTURING DE ARRAYS
// ========================================

// Destructuring básico
const [primeira, segunda, terceira] = frutas;
console.log("Destructuring:", { primeira, segunda, terceira });

// Pulando elementos
const [, , terceiraFruta] = frutas;
console.log("Terceira fruta:", terceiraFruta);

// Rest operator
const [primeiraFruta, ...restanteFrutas] = frutas;
console.log("Primeira:", primeiraFruta);
console.log("Restantes:", restanteFrutas);

// Valores padrão
const [a, b, c, d = "padrão"] = [1, 2, 3];
console.log("Com valor padrão:", { a, b, c, d });

// Troca de variáveis
let x = 10;
let y = 20;
[x, y] = [y, x];
console.log("Após troca:", { x, y });

// ========================================
// 11. EXEMPLO PRÁTICO: SISTEMA DE NOTAS
// ========================================

class SistemaNotas {
    constructor() {
        this.estudantes = [];
    }
    
    adicionarEstudante(nome, notas = []) {
        const estudante = {
            id: this.estudantes.length + 1,
            nome,
            notas: [...notas],
            dataMatricula: new Date()
        };
        
        this.estudantes.push(estudante);
        return estudante;
    }
    
    adicionarNota(estudanteId, nota) {
        const estudante = this.estudantes.find(e => e.id === estudanteId);
        if (!estudante) {
            throw new Error("Estudante não encontrado");
        }
        
        if (nota < 0 || nota > 10) {
            throw new Error("Nota deve estar entre 0 e 10");
        }
        
        estudante.notas.push(nota);
        return estudante;
    }
    
    calcularMedia(estudanteId) {
        const estudante = this.estudantes.find(e => e.id === estudanteId);
        if (!estudante || estudante.notas.length === 0) {
            return 0;
        }
        
        const soma = estudante.notas.reduce((acc, nota) => acc + nota, 0);
        return Number((soma / estudante.notas.length).toFixed(2));
    }
    
    obterEstatisticas(estudanteId) {
        const estudante = this.estudantes.find(e => e.id === estudanteId);
        if (!estudante) {
            throw new Error("Estudante não encontrado");
        }
        
        const notas = estudante.notas;
        if (notas.length === 0) {
            return { media: 0, maior: 0, menor: 0, total: 0 };
        }
        
        return {
            media: this.calcularMedia(estudanteId),
            maior: Math.max(...notas),
            menor: Math.min(...notas),
            total: notas.length,
            aprovado: this.calcularMedia(estudanteId) >= 7
        };
    }
    
    listarAprovados() {
        return this.estudantes
            .filter(estudante => this.calcularMedia(estudante.id) >= 7)
            .map(estudante => ({
                ...estudante,
                media: this.calcularMedia(estudante.id)
            }))
            .sort((a, b) => b.media - a.media);
    }
    
    listarReprovados() {
        return this.estudantes
            .filter(estudante => this.calcularMedia(estudante.id) < 7)
            .map(estudante => ({
                ...estudante,
                media: this.calcularMedia(estudante.id)
            }))
            .sort((a, b) => a.media - b.media);
    }
    
    obterRanking() {
        return this.estudantes
            .map(estudante => ({
                ...estudante,
                media: this.calcularMedia(estudante.id),
                estatisticas: this.obterEstatisticas(estudante.id)
            }))
            .sort((a, b) => b.media - a.media);
    }
    
    buscarEstudante(termo) {
        return this.estudantes.filter(estudante => 
            estudante.nome.toLowerCase().includes(termo.toLowerCase())
        );
    }
}

// Testando o sistema
const sistema = new SistemaNotas();

// Adicionando estudantes
sistema.adicionarEstudante("Ana Silva", [8.5, 9.0, 7.5]);
sistema.adicionarEstudante("Bruno Santos", [6.0, 7.0, 5.5]);
sistema.adicionarEstudante("Carlos Oliveira", [9.5, 9.8, 9.2]);
sistema.adicionarEstudante("Diana Costa", [7.0, 8.0, 7.5]);

// Adicionando mais notas
sistema.adicionarNota(1, 8.0);
sistema.adicionarNota(2, 6.5);
sistema.adicionarNota(3, 9.0);
sistema.adicionarNota(4, 8.5);

console.log("\n=== SISTEMA DE NOTAS ===");
console.log("Ranking geral:", sistema.obterRanking());
console.log("Aprovados:", sistema.listarAprovados());
console.log("Reprovados:", sistema.listarReprovados());
console.log("Estatísticas Ana:", sistema.obterEstatisticas(1));

// ========================================
// 12. EXEMPLO PRÁTICO: PROCESSAMENTO DE DADOS
// ========================================

// Simulando dados de vendas
const vendas = [
    { id: 1, produto: "Notebook", categoria: "Eletrônicos", valor: 2500, data: "2024-01-15", vendedor: "João" },
    { id: 2, produto: "Mouse", categoria: "Eletrônicos", valor: 50, data: "2024-01-16", vendedor: "Maria" },
    { id: 3, produto: "Teclado", categoria: "Eletrônicos", valor: 150, data: "2024-01-17", vendedor: "João" },
    { id: 4, produto: "Cadeira", categoria: "Móveis", valor: 300, data: "2024-01-18", vendedor: "Pedro" },
    { id: 5, produto: "Mesa", categoria: "Móveis", valor: 500, data: "2024-01-19", vendedor: "Maria" },
    { id: 6, produto: "Monitor", categoria: "Eletrônicos", valor: 800, data: "2024-01-20", vendedor: "João" }
];

// Análises usando métodos de array
const analiseVendas = {
    // Total de vendas
    totalVendas: vendas.reduce((total, venda) => total + venda.valor, 0),
    
    // Vendas por categoria
    vendasPorCategoria: vendas.reduce((acc, venda) => {
        acc[venda.categoria] = (acc[venda.categoria] || 0) + venda.valor;
        return acc;
    }, {}),
    
    // Vendas por vendedor
    vendasPorVendedor: vendas.reduce((acc, venda) => {
        if (!acc[venda.vendedor]) {
            acc[venda.vendedor] = { total: 0, quantidade: 0 };
        }
        acc[venda.vendedor].total += venda.valor;
        acc[venda.vendedor].quantidade += 1;
        return acc;
    }, {}),
    
    // Produtos mais caros
    produtosMaisCaros: vendas
        .filter(venda => venda.valor > 200)
        .sort((a, b) => b.valor - a.valor)
        .map(venda => ({ produto: venda.produto, valor: venda.valor })),
    
    // Média de vendas
    mediaVendas: vendas.reduce((total, venda) => total + venda.valor, 0) / vendas.length,
    
    // Vendedor com mais vendas
    melhorVendedor: Object.entries(
        vendas.reduce((acc, venda) => {
            acc[venda.vendedor] = (acc[venda.vendedor] || 0) + venda.valor;
            return acc;
        }, {})
    ).sort(([,a], [,b]) => b - a)[0]
};

console.log("\n=== ANÁLISE DE VENDAS ===");
console.log(analiseVendas);

// ========================================
// 13. EXERCÍCIOS PROPOSTOS
// ========================================

/*
EXERCÍCIO 1: Manipulação de Lista de Tarefas
Crie funções para:
- Adicionar tarefa
- Remover tarefa por índice
- Marcar tarefa como concluída
- Filtrar tarefas por status
- Ordenar tarefas por prioridade

EXERCÍCIO 2: Sistema de Carrinho de Compras
Implemente:
- Adicionar produto ao carrinho
- Remover produto do carrinho
- Calcular total do carrinho
- Aplicar desconto
- Agrupar produtos por categoria

EXERCÍCIO 3: Análise de Dados de Estudantes
Crie um sistema que:
- Calcule média geral da turma
- Encontre o melhor e pior aluno
- Liste alunos por faixa de nota
- Calcule estatísticas por matéria

EXERCÍCIO 4: Processamento de Log de Servidor
Procese um array de logs para:
- Contar tipos de erro
- Encontrar horários de pico
- Filtrar logs por período
- Agrupar por IP de origem

EXERCÍCIO 5: Sistema de Playlist Musical
Implemente:
- Adicionar/remover músicas
- Embaralhar playlist
- Filtrar por gênero/artista
- Calcular duração total
- Criar playlist personalizada
*/

// ========================================
// 14. BOAS PRÁTICAS E DICAS
// ========================================

/*
BOAS PRÁTICAS:

1. PERFORMANCE:
   - Use métodos imutáveis (map, filter, reduce) em vez de modificar arrays
   - Para arrays grandes, considere usar for loops tradicionais
   - Evite métodos aninhados desnecessários
   - Use break/continue em loops quando apropriado

2. LEGIBILIDADE:
   - Prefira métodos funcionais (map, filter, reduce) para transformações
   - Use nomes descritivos para variáveis de callback
   - Quebre operações complexas em etapas menores
   - Comente lógicas complexas de reduce

3. IMUTABILIDADE:
   - Use spread operator para criar cópias
   - Evite modificar arrays originais quando possível
   - Use métodos como slice() para extrair partes
   - Considere bibliotecas como Immutable.js para casos complexos

4. VALIDAÇÃO:
   - Sempre verifique se é um array antes de usar métodos
   - Valide índices antes de acessar elementos
   - Trate casos de arrays vazios
   - Use optional chaining (?.) quando apropriado

5. MÉTODOS MODERNOS:
   - Use at() para acesso com índices negativos
   - Use flat() e flatMap() para arrays aninhados
   - Use includes() em vez de indexOf() !== -1
   - Use find() em vez de filter()[0]

DICAS IMPORTANTES:
- Arrays em JavaScript são objetos especiais
- Índices podem ser strings, mas evite isso
- length pode ser modificado diretamente
- Arrays esparsos (com buracos) podem causar problemas
- Use TypeScript para melhor tipagem de arrays
- Considere usar Set para arrays únicos
- Map pode ser melhor que arrays para chave-valor
*/

console.log("\n=== ARQUIVO 05: ARRAYS E MÉTODOS CONCLUÍDO ===");
console.log("Próximo: 06-manipulacao-dom.js");