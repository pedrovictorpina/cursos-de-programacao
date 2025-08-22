/*
===========================================
    EXERCÍCIOS - FUNÇÕES E ESCOPOS
===========================================

Este arquivo contém 3 exercícios práticos para fixar:
- Declaração e tipos de funções (function, arrow, anonymous)
- Parâmetros e argumentos (default, rest, spread)
- Escopo (global, local, block, lexical)
- Closures e contexto
- Hoisting e temporal dead zone
- Funções de alta ordem (callbacks, map, filter, reduce)
- Recursão e memoização

Nível: Intermediário
Tempo estimado: 60-75 minutos
*/

console.log('=== EXERCÍCIOS - FUNÇÕES E ESCOPOS ===');

/*
========================================
EXERCÍCIO 1: CALCULADORA MODULAR
========================================

Objetivo: Criar uma calculadora avançada usando diferentes
tipos de funções, closures e módulos, demonstrando escopo,
contexto e organização de código.

Requisitos:
1. Operações básicas (soma, subtração, multiplicação, divisão)
2. Operações avançadas (potência, raiz, fatorial, fibonacci)
3. Histórico de operações com closures
4. Validação de entrada e tratamento de erros
5. Formatação de resultados
6. Sistema de constantes matemáticas
7. Funções de conversão (graus/radianos, bases numéricas)
*/

console.log('\n--- EXERCÍCIO 1: CALCULADORA MODULAR ---');

// SOLUÇÃO:
const CalculadoraModular = (() => {
    // Escopo privado - variáveis e funções internas
    let historico = [];
    let precisao = 10; // Casas decimais
    let modoAngular = 'graus'; // 'graus' ou 'radianos'
    
    // Constantes matemáticas privadas
    const CONSTANTES = {
        PI: Math.PI,
        E: Math.E,
        PHI: (1 + Math.sqrt(5)) / 2, // Proporção áurea
        SQRT2: Math.sqrt(2),
        LN2: Math.LN2,
        LN10: Math.LN10
    };
    
    // Funções utilitárias privadas
    function validarNumero(valor, nome = 'valor') {
        if (typeof valor !== 'number' || isNaN(valor)) {
            throw new Error(`${nome} deve ser um número válido`);
        }
        if (!isFinite(valor)) {
            throw new Error(`${nome} deve ser um número finito`);
        }
    }
    
    function formatarResultado(resultado) {
        if (typeof resultado !== 'number') return resultado;
        
        // Verificar se é um número inteiro
        if (Number.isInteger(resultado)) {
            return resultado;
        }
        
        // Aplicar precisão para números decimais
        const fator = Math.pow(10, precisao);
        return Math.round(resultado * fator) / fator;
    }
    
    function registrarOperacao(operacao, operandos, resultado) {
        const registro = {
            id: Date.now() + Math.random(),
            timestamp: new Date(),
            operacao,
            operandos: Array.isArray(operandos) ? [...operandos] : [operandos],
            resultado,
            formatado: formatarResultado(resultado)
        };
        
        historico.push(registro);
        
        // Limitar histórico a 100 operações
        if (historico.length > 100) {
            historico = historico.slice(-100);
        }
        
        return registro;
    }
    
    function grausParaRadianos(graus) {
        return graus * (Math.PI / 180);
    }
    
    function radianosParaGraus(radianos) {
        return radianos * (180 / Math.PI);
    }
    
    function ajustarAngulo(angulo) {
        return modoAngular === 'graus' ? grausParaRadianos(angulo) : angulo;
    }
    
    // Cache para memoização (closure)
    const criarCache = () => {
        const cache = new Map();
        
        return {
            get: (chave) => cache.get(chave),
            set: (chave, valor) => {
                cache.set(chave, valor);
                // Limitar cache a 50 entradas
                if (cache.size > 50) {
                    const primeiraChave = cache.keys().next().value;
                    cache.delete(primeiraChave);
                }
            },
            has: (chave) => cache.has(chave),
            clear: () => cache.clear(),
            size: () => cache.size
        };
    };
    
    const cacheFactorial = criarCache();
    const cacheFibonacci = criarCache();
    
    // Operações básicas
    const operacoesBasicas = {
        somar: (a, b) => {
            validarNumero(a, 'primeiro operando');
            validarNumero(b, 'segundo operando');
            const resultado = a + b;
            return registrarOperacao('soma', [a, b], resultado);
        },
        
        subtrair: (a, b) => {
            validarNumero(a, 'minuendo');
            validarNumero(b, 'subtraendo');
            const resultado = a - b;
            return registrarOperacao('subtração', [a, b], resultado);
        },
        
        multiplicar: (a, b) => {
            validarNumero(a, 'primeiro fator');
            validarNumero(b, 'segundo fator');
            const resultado = a * b;
            return registrarOperacao('multiplicação', [a, b], resultado);
        },
        
        dividir: (a, b) => {
            validarNumero(a, 'dividendo');
            validarNumero(b, 'divisor');
            
            if (b === 0) {
                throw new Error('Divisão por zero não é permitida');
            }
            
            const resultado = a / b;
            return registrarOperacao('divisão', [a, b], resultado);
        }
    };
    
    // Operações avançadas
    const operacoesAvancadas = {
        potencia: (base, expoente) => {
            validarNumero(base, 'base');
            validarNumero(expoente, 'expoente');
            
            const resultado = Math.pow(base, expoente);
            return registrarOperacao('potência', [base, expoente], resultado);
        },
        
        raiz: (numero, indice = 2) => {
            validarNumero(numero, 'número');
            validarNumero(indice, 'índice');
            
            if (indice === 0) {
                throw new Error('Índice da raiz não pode ser zero');
            }
            
            if (numero < 0 && indice % 2 === 0) {
                throw new Error('Raiz par de número negativo não é real');
            }
            
            const resultado = numero < 0 ? 
                -Math.pow(-numero, 1/indice) : 
                Math.pow(numero, 1/indice);
            
            return registrarOperacao(`raiz ${indice}`, [numero], resultado);
        },
        
        // Fatorial com memoização
        fatorial: (n) => {
            validarNumero(n, 'número');
            
            if (n < 0) {
                throw new Error('Fatorial não é definido para números negativos');
            }
            
            if (!Number.isInteger(n)) {
                throw new Error('Fatorial só é definido para números inteiros');
            }
            
            if (n > 170) {
                throw new Error('Fatorial muito grande (overflow)');
            }
            
            // Verificar cache
            if (cacheFactorial.has(n)) {
                const resultado = cacheFactorial.get(n);
                return registrarOperacao('fatorial (cache)', [n], resultado);
            }
            
            // Calcular fatorial recursivamente
            function calcularFatorial(num) {
                if (num <= 1) return 1;
                if (cacheFactorial.has(num)) return cacheFactorial.get(num);
                
                const resultado = num * calcularFatorial(num - 1);
                cacheFactorial.set(num, resultado);
                return resultado;
            }
            
            const resultado = calcularFatorial(n);
            return registrarOperacao('fatorial', [n], resultado);
        },
        
        // Fibonacci com memoização
        fibonacci: (n) => {
            validarNumero(n, 'posição');
            
            if (n < 0) {
                throw new Error('Posição deve ser não-negativa');
            }
            
            if (!Number.isInteger(n)) {
                throw new Error('Posição deve ser um número inteiro');
            }
            
            if (n > 1000) {
                throw new Error('Posição muito grande (limite: 1000)');
            }
            
            // Verificar cache
            if (cacheFibonacci.has(n)) {
                const resultado = cacheFibonacci.get(n);
                return registrarOperacao('fibonacci (cache)', [n], resultado);
            }
            
            // Calcular fibonacci iterativamente (mais eficiente que recursão)
            function calcularFibonacci(pos) {
                if (pos <= 1) return pos;
                
                let a = 0, b = 1;
                for (let i = 2; i <= pos; i++) {
                    const temp = a + b;
                    a = b;
                    b = temp;
                    
                    // Cachear valores intermediários
                    if (!cacheFibonacci.has(i)) {
                        cacheFibonacci.set(i, b);
                    }
                }
                return b;
            }
            
            const resultado = calcularFibonacci(n);
            return registrarOperacao('fibonacci', [n], resultado);
        }
    };
    
    // Funções trigonométricas
    const trigonometria = {
        seno: (angulo) => {
            validarNumero(angulo, 'ângulo');
            const anguloRad = ajustarAngulo(angulo);
            const resultado = Math.sin(anguloRad);
            return registrarOperacao('seno', [angulo], resultado);
        },
        
        cosseno: (angulo) => {
            validarNumero(angulo, 'ângulo');
            const anguloRad = ajustarAngulo(angulo);
            const resultado = Math.cos(anguloRad);
            return registrarOperacao('cosseno', [angulo], resultado);
        },
        
        tangente: (angulo) => {
            validarNumero(angulo, 'ângulo');
            const anguloRad = ajustarAngulo(angulo);
            
            // Verificar se tangente é indefinida
            const cos = Math.cos(anguloRad);
            if (Math.abs(cos) < 1e-10) {
                throw new Error('Tangente indefinida para este ângulo');
            }
            
            const resultado = Math.tan(anguloRad);
            return registrarOperacao('tangente', [angulo], resultado);
        }
    };
    
    // Conversões
    const conversoes = {
        paraDecimal: (numero, baseOrigem) => {
            if (typeof numero === 'string') {
                const resultado = parseInt(numero, baseOrigem);
                if (isNaN(resultado)) {
                    throw new Error('Número inválido para a base especificada');
                }
                return registrarOperacao(`conversão base ${baseOrigem} para decimal`, [numero], resultado);
            }
            throw new Error('Número deve ser uma string para conversão');
        },
        
        paraBase: (numero, baseDestino) => {
            validarNumero(numero, 'número');
            
            if (!Number.isInteger(numero)) {
                throw new Error('Apenas números inteiros podem ser convertidos para outras bases');
            }
            
            if (baseDestino < 2 || baseDestino > 36) {
                throw new Error('Base deve estar entre 2 e 36');
            }
            
            const resultado = numero.toString(baseDestino).toUpperCase();
            return registrarOperacao(`conversão para base ${baseDestino}`, [numero], resultado);
        },
        
        grausParaRadianos: (graus) => {
            validarNumero(graus, 'graus');
            const resultado = grausParaRadianos(graus);
            return registrarOperacao('graus para radianos', [graus], resultado);
        },
        
        radianosParaGraus: (radianos) => {
            validarNumero(radianos, 'radianos');
            const resultado = radianosParaGraus(radianos);
            return registrarOperacao('radianos para graus', [radianos], resultado);
        }
    };
    
    // Interface pública (retorno do módulo)
    return {
        // Operações básicas
        somar: operacoesBasicas.somar,
        subtrair: operacoesBasicas.subtrair,
        multiplicar: operacoesBasicas.multiplicar,
        dividir: operacoesBasicas.dividir,
        
        // Operações avançadas
        potencia: operacoesAvancadas.potencia,
        raiz: operacoesAvancadas.raiz,
        fatorial: operacoesAvancadas.fatorial,
        fibonacci: operacoesAvancadas.fibonacci,
        
        // Trigonometria
        seno: trigonometria.seno,
        cosseno: trigonometria.cosseno,
        tangente: trigonometria.tangente,
        
        // Conversões
        paraDecimal: conversoes.paraDecimal,
        paraBase: conversoes.paraBase,
        grausParaRadianos: conversoes.grausParaRadianos,
        radianosParaGraus: conversoes.radianosParaGraus,
        
        // Constantes
        constantes: { ...CONSTANTES },
        
        // Configurações
        configurar: {
            precisao: (novaP) => {
                if (typeof novaP !== 'number' || novaP < 0 || novaP > 15) {
                    throw new Error('Precisão deve ser entre 0 e 15');
                }
                precisao = Math.floor(novaP);
                return `Precisão definida para ${precisao} casas decimais`;
            },
            
            modoAngular: (modo) => {
                if (modo !== 'graus' && modo !== 'radianos') {
                    throw new Error('Modo deve ser "graus" ou "radianos"');
                }
                modoAngular = modo;
                return `Modo angular definido para ${modo}`;
            }
        },
        
        // Histórico e cache
        historico: {
            obter: (quantidade = 10) => {
                return historico.slice(-quantidade).reverse();
            },
            
            limpar: () => {
                const quantidadeAnterior = historico.length;
                historico = [];
                return `${quantidadeAnterior} operações removidas do histórico`;
            },
            
            buscar: (termo) => {
                return historico.filter(op => 
                    op.operacao.toLowerCase().includes(termo.toLowerCase())
                ).reverse();
            },
            
            estatisticas: () => {
                const operacoesPorTipo = {};
                historico.forEach(op => {
                    operacoesPorTipo[op.operacao] = (operacoesPorTipo[op.operacao] || 0) + 1;
                });
                
                return {
                    total: historico.length,
                    porTipo: operacoesPorTipo,
                    primeira: historico[0]?.timestamp,
                    ultima: historico[historico.length - 1]?.timestamp
                };
            }
        },
        
        cache: {
            estatisticas: () => ({
                factorial: cacheFactorial.size(),
                fibonacci: cacheFibonacci.size()
            }),
            
            limpar: () => {
                cacheFactorial.clear();
                cacheFibonacci.clear();
                return 'Cache limpo';
            }
        },
        
        // Função de alta ordem para operações em lote
        lote: (operacoes) => {
            if (!Array.isArray(operacoes)) {
                throw new Error('Operações devem ser um array');
            }
            
            const resultados = [];
            const erros = [];
            
            operacoes.forEach((op, index) => {
                try {
                    const { funcao, argumentos } = op;
                    if (typeof this[funcao] !== 'function') {
                        throw new Error(`Função '${funcao}' não encontrada`);
                    }
                    
                    const resultado = this[funcao](...argumentos);
                    resultados.push({ index, sucesso: true, resultado });
                } catch (error) {
                    erros.push({ index, erro: error.message });
                    resultados.push({ index, sucesso: false, erro: error.message });
                }
            });
            
            return {
                resultados,
                erros,
                sucessos: resultados.filter(r => r.sucesso).length,
                falhas: erros.length
            };
        }
    };
})();

// Testes e demonstração
console.log('\n🧮 Demonstração da Calculadora Modular:');

try {
    // Configurar calculadora
    console.log(CalculadoraModular.configurar.precisao(4));
    console.log(CalculadoraModular.configurar.modoAngular('graus'));
    
    // Operações básicas
    console.log('\n📊 OPERAÇÕES BÁSICAS:');
    console.log('Soma:', CalculadoraModular.somar(15, 25).formatado);
    console.log('Subtração:', CalculadoraModular.subtrair(100, 37).formatado);
    console.log('Multiplicação:', CalculadoraModular.multiplicar(8, 7).formatado);
    console.log('Divisão:', CalculadoraModular.dividir(144, 12).formatado);
    
    // Operações avançadas
    console.log('\n🔬 OPERAÇÕES AVANÇADAS:');
    console.log('Potência (2^8):', CalculadoraModular.potencia(2, 8).formatado);
    console.log('Raiz quadrada de 64:', CalculadoraModular.raiz(64, 2).formatado);
    console.log('Fatorial de 7:', CalculadoraModular.fatorial(7).formatado);
    console.log('Fibonacci(10):', CalculadoraModular.fibonacci(10).formatado);
    
    // Trigonometria
    console.log('\n📐 TRIGONOMETRIA:');
    console.log('Seno de 30°:', CalculadoraModular.seno(30).formatado);
    console.log('Cosseno de 60°:', CalculadoraModular.cosseno(60).formatado);
    console.log('Tangente de 45°:', CalculadoraModular.tangente(45).formatado);
    
    // Conversões
    console.log('\n🔄 CONVERSÕES:');
    console.log('90° em radianos:', CalculadoraModular.grausParaRadianos(90).formatado);
    console.log('255 para base 16:', CalculadoraModular.paraBase(255, 16).resultado);
    console.log('FF (base 16) para decimal:', CalculadoraModular.paraDecimal('FF', 16).resultado);
    
    // Constantes
    console.log('\n🔢 CONSTANTES:');
    console.log('π (PI):', CalculadoraModular.constantes.PI);
    console.log('e (Euler):', CalculadoraModular.constantes.E);
    console.log('φ (Phi):', CalculadoraModular.constantes.PHI);
    
    // Operações em lote
    console.log('\n📦 OPERAÇÕES EM LOTE:');
    const lote = CalculadoraModular.lote([
        { funcao: 'somar', argumentos: [10, 20] },
        { funcao: 'multiplicar', argumentos: [5, 6] },
        { funcao: 'potencia', argumentos: [3, 4] },
        { funcao: 'fatorial', argumentos: [5] }
    ]);
    console.log(`Sucessos: ${lote.sucessos}, Falhas: ${lote.falhas}`);
    
    // Histórico
    console.log('\n📚 HISTÓRICO (últimas 5 operações):');
    const historico = CalculadoraModular.historico.obter(5);
    historico.forEach((op, i) => {
        console.log(`${i + 1}. ${op.operacao}: ${op.formatado}`);
    });
    
    // Estatísticas
    console.log('\n📈 ESTATÍSTICAS:');
    const stats = CalculadoraModular.historico.estatisticas();
    console.log(`Total de operações: ${stats.total}`);
    console.log('Cache:', CalculadoraModular.cache.estatisticas());
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

/*
========================================
EXERCÍCIO 2: GERENCIADOR DE TAREFAS
========================================

Objetivo: Criar um sistema completo de gerenciamento de tarefas
usando closures, funções de alta ordem e diferentes escopos,
demonstrando organização modular e encapsulamento.

Requisitos:
1. CRUD completo de tarefas (criar, ler, atualizar, deletar)
2. Sistema de categorias e tags
3. Filtros e busca avançada
4. Ordenação por múltiplos critérios
5. Sistema de prioridades e status
6. Relatórios e estatísticas
7. Persistência local (simulada)
*/

console.log('\n--- EXERCÍCIO 2: GERENCIADOR DE TAREFAS ---');

// SOLUÇÃO:
const GerenciadorTarefas = (() => {
    // Estado privado
    let tarefas = new Map();
    let categorias = new Set(['Trabalho', 'Pessoal', 'Estudos', 'Saúde']);
    let proximoId = 1;
    let configuracoes = {
        autoSave: true,
        formatoData: 'pt-BR',
        ordenacaoPadrao: 'prioridade'
    };
    
    // Enums para status e prioridades
    const STATUS = {
        PENDENTE: 'pendente',
        EM_PROGRESSO: 'em_progresso',
        CONCLUIDA: 'concluida',
        CANCELADA: 'cancelada'
    };
    
    const PRIORIDADES = {
        BAIXA: 1,
        MEDIA: 2,
        ALTA: 3,
        URGENTE: 4
    };
    
    // Funções utilitárias privadas
    function gerarId() {
        return proximoId++;
    }
    
    function validarTarefa(dados) {
        const erros = [];
        
        if (!dados.titulo || typeof dados.titulo !== 'string' || dados.titulo.trim().length === 0) {
            erros.push('Título é obrigatório');
        }
        
        if (dados.titulo && dados.titulo.length > 100) {
            erros.push('Título deve ter no máximo 100 caracteres');
        }
        
        if (dados.descricao && dados.descricao.length > 500) {
            erros.push('Descrição deve ter no máximo 500 caracteres');
        }
        
        if (dados.prioridade && !Object.values(PRIORIDADES).includes(dados.prioridade)) {
            erros.push('Prioridade inválida');
        }
        
        if (dados.status && !Object.values(STATUS).includes(dados.status)) {
            erros.push('Status inválido');
        }
        
        if (dados.prazo && !(dados.prazo instanceof Date) && isNaN(new Date(dados.prazo))) {
            erros.push('Prazo deve ser uma data válida');
        }
        
        if (dados.categoria && !categorias.has(dados.categoria)) {
            erros.push(`Categoria '${dados.categoria}' não existe`);
        }
        
        if (dados.tags && !Array.isArray(dados.tags)) {
            erros.push('Tags devem ser um array');
        }
        
        return erros;
    }
    
    function criarTarefa(dados) {
        const agora = new Date();
        
        return {
            id: dados.id || gerarId(),
            titulo: dados.titulo.trim(),
            descricao: dados.descricao ? dados.descricao.trim() : '',
            categoria: dados.categoria || 'Pessoal',
            prioridade: dados.prioridade || PRIORIDADES.MEDIA,
            status: dados.status || STATUS.PENDENTE,
            tags: dados.tags ? [...new Set(dados.tags.map(tag => tag.toLowerCase()))] : [],
            prazo: dados.prazo ? new Date(dados.prazo) : null,
            criadaEm: dados.criadaEm || agora,
            atualizadaEm: agora,
            concluidaEm: dados.status === STATUS.CONCLUIDA ? agora : null,
            tempoEstimado: dados.tempoEstimado || null, // em minutos
            tempoGasto: dados.tempoGasto || 0, // em minutos
            anexos: dados.anexos || [],
            subtarefas: dados.subtarefas || [],
            historico: dados.historico || [{
                acao: 'criada',
                timestamp: agora,
                detalhes: 'Tarefa criada'
            }]
        };
    }
    
    function adicionarHistorico(tarefa, acao, detalhes) {
        tarefa.historico.push({
            acao,
            timestamp: new Date(),
            detalhes
        });
        tarefa.atualizadaEm = new Date();
    }
    
    function salvarAutomatico() {
        if (configuracoes.autoSave) {
            // Simular salvamento (em uma aplicação real, seria localStorage ou API)
            console.log(`💾 Auto-save: ${tarefas.size} tarefas salvas`);
        }
    }
    
    // Funções de filtro (closures)
    const criarFiltros = () => {
        return {
            porStatus: (status) => (tarefa) => tarefa.status === status,
            porCategoria: (categoria) => (tarefa) => tarefa.categoria === categoria,
            porPrioridade: (prioridade) => (tarefa) => tarefa.prioridade === prioridade,
            porTag: (tag) => (tarefa) => tarefa.tags.includes(tag.toLowerCase()),
            porPrazo: (dias) => (tarefa) => {
                if (!tarefa.prazo) return false;
                const agora = new Date();
                const diferenca = (tarefa.prazo - agora) / (1000 * 60 * 60 * 24);
                return diferenca <= dias && diferenca >= 0;
            },
            atrasadas: () => (tarefa) => {
                if (!tarefa.prazo || tarefa.status === STATUS.CONCLUIDA) return false;
                return tarefa.prazo < new Date();
            },
            porTexto: (texto) => (tarefa) => {
                const busca = texto.toLowerCase();
                return tarefa.titulo.toLowerCase().includes(busca) ||
                       tarefa.descricao.toLowerCase().includes(busca) ||
                       tarefa.tags.some(tag => tag.includes(busca));
            }
        };
    };
    
    const filtros = criarFiltros();
    
    // Funções de ordenação
    const criarOrdenadores = () => {
        return {
            porPrioridade: (a, b) => b.prioridade - a.prioridade,
            porPrazo: (a, b) => {
                if (!a.prazo && !b.prazo) return 0;
                if (!a.prazo) return 1;
                if (!b.prazo) return -1;
                return a.prazo - b.prazo;
            },
            porCriacao: (a, b) => b.criadaEm - a.criadaEm,
            porAtualizacao: (a, b) => b.atualizadaEm - a.atualizadaEm,
            porTitulo: (a, b) => a.titulo.localeCompare(b.titulo),
            porCategoria: (a, b) => a.categoria.localeCompare(b.categoria),
            porStatus: (a, b) => {
                const ordemStatus = [STATUS.URGENTE, STATUS.EM_PROGRESSO, STATUS.PENDENTE, STATUS.CONCLUIDA, STATUS.CANCELADA];
                return ordemStatus.indexOf(a.status) - ordemStatus.indexOf(b.status);
            }
        };
    };
    
    const ordenadores = criarOrdenadores();
    
    // Interface pública
    return {
        // CRUD de tarefas
        criar: (dados) => {
            const erros = validarTarefa(dados);
            if (erros.length > 0) {
                throw new Error(`Erro de validação: ${erros.join(', ')}`);
            }
            
            const tarefa = criarTarefa(dados);
            tarefas.set(tarefa.id, tarefa);
            salvarAutomatico();
            
            return {
                sucesso: true,
                tarefa: { ...tarefa },
                mensagem: `Tarefa '${tarefa.titulo}' criada com sucesso`
            };
        },
        
        obter: (id) => {
            const tarefa = tarefas.get(id);
            if (!tarefa) {
                return { sucesso: false, erro: 'Tarefa não encontrada' };
            }
            return { sucesso: true, tarefa: { ...tarefa } };
        },
        
        listar: (filtroFn = null, ordenarPor = 'prioridade') => {
            let lista = Array.from(tarefas.values());
            
            // Aplicar filtro se fornecido
            if (filtroFn && typeof filtroFn === 'function') {
                lista = lista.filter(filtroFn);
            }
            
            // Aplicar ordenação
            if (ordenadores[ordenarPor]) {
                lista.sort(ordenadores[ordenarPor]);
            }
            
            return {
                sucesso: true,
                tarefas: lista.map(t => ({ ...t })),
                total: lista.length
            };
        },
        
        atualizar: (id, dadosAtualizacao) => {
            const tarefa = tarefas.get(id);
            if (!tarefa) {
                return { sucesso: false, erro: 'Tarefa não encontrada' };
            }
            
            // Validar dados de atualização
            const erros = validarTarefa({ ...tarefa, ...dadosAtualizacao });
            if (erros.length > 0) {
                return { sucesso: false, erro: `Erro de validação: ${erros.join(', ')}` };
            }
            
            // Registrar mudanças
            const mudancas = [];
            Object.keys(dadosAtualizacao).forEach(campo => {
                if (tarefa[campo] !== dadosAtualizacao[campo]) {
                    mudancas.push(`${campo}: ${tarefa[campo]} → ${dadosAtualizacao[campo]}`);
                }
            });
            
            // Aplicar atualizações
            Object.assign(tarefa, dadosAtualizacao);
            tarefa.atualizadaEm = new Date();
            
            // Marcar como concluída se status mudou
            if (dadosAtualizacao.status === STATUS.CONCLUIDA && tarefa.status !== STATUS.CONCLUIDA) {
                tarefa.concluidaEm = new Date();
            }
            
            adicionarHistorico(tarefa, 'atualizada', `Campos alterados: ${mudancas.join(', ')}`);
            salvarAutomatico();
            
            return {
                sucesso: true,
                tarefa: { ...tarefa },
                mudancas,
                mensagem: `Tarefa '${tarefa.titulo}' atualizada com sucesso`
            };
        },
        
        excluir: (id) => {
            const tarefa = tarefas.get(id);
            if (!tarefa) {
                return { sucesso: false, erro: 'Tarefa não encontrada' };
            }
            
            const titulo = tarefa.titulo;
            tarefas.delete(id);
            salvarAutomatico();
            
            return {
                sucesso: true,
                mensagem: `Tarefa '${titulo}' excluída com sucesso`
            };
        },
        
        // Filtros predefinidos
        filtros: {
            pendentes: () => filtros.porStatus(STATUS.PENDENTE),
            emProgresso: () => filtros.porStatus(STATUS.EM_PROGRESSO),
            concluidas: () => filtros.porStatus(STATUS.CONCLUIDA),
            atrasadas: filtros.atrasadas,
            urgentes: () => filtros.porPrioridade(PRIORIDADES.URGENTE),
            proximoVencimento: (dias = 7) => filtros.porPrazo(dias),
            porCategoria: filtros.porCategoria,
            porTag: filtros.porTag,
            buscar: filtros.porTexto
        },
        
        // Busca avançada
        buscarAvancado: (criterios) => {
            let filtrosCombinados = [];
            
            if (criterios.texto) {
                filtrosCombinados.push(filtros.porTexto(criterios.texto));
            }
            
            if (criterios.categoria) {
                filtrosCombinados.push(filtros.porCategoria(criterios.categoria));
            }
            
            if (criterios.status) {
                filtrosCombinados.push(filtros.porStatus(criterios.status));
            }
            
            if (criterios.prioridade) {
                filtrosCombinados.push(filtros.porPrioridade(criterios.prioridade));
            }
            
            if (criterios.tags && criterios.tags.length > 0) {
                filtrosCombinados.push((tarefa) => 
                    criterios.tags.some(tag => tarefa.tags.includes(tag.toLowerCase()))
                );
            }
            
            // Combinar todos os filtros com AND
            const filtroFinal = (tarefa) => 
                filtrosCombinados.every(filtro => filtro(tarefa));
            
            return this.listar(filtroFinal, criterios.ordenarPor || 'prioridade');
        },
        
        // Relatórios e estatísticas
        relatorios: {
            resumo: () => {
                const lista = Array.from(tarefas.values());
                const porStatus = {};
                const porCategoria = {};
                const porPrioridade = {};
                
                lista.forEach(tarefa => {
                    // Por status
                    porStatus[tarefa.status] = (porStatus[tarefa.status] || 0) + 1;
                    
                    // Por categoria
                    porCategoria[tarefa.categoria] = (porCategoria[tarefa.categoria] || 0) + 1;
                    
                    // Por prioridade
                    const nomePrioridade = Object.keys(PRIORIDADES).find(
                        key => PRIORIDADES[key] === tarefa.prioridade
                    );
                    porPrioridade[nomePrioridade] = (porPrioridade[nomePrioridade] || 0) + 1;
                });
                
                const atrasadas = lista.filter(filtros.atrasadas()).length;
                const proximoVencimento = lista.filter(filtros.porPrazo(7)).length;
                
                return {
                    total: lista.length,
                    porStatus,
                    porCategoria,
                    porPrioridade,
                    atrasadas,
                    proximoVencimento,
                    produtividade: {
                        concluidas: porStatus[STATUS.CONCLUIDA] || 0,
                        taxa: lista.length > 0 ? 
                            ((porStatus[STATUS.CONCLUIDA] || 0) / lista.length * 100).toFixed(1) + '%' : '0%'
                    }
                };
            },
            
            produtividade: (periodo = 30) => {
                const agora = new Date();
                const dataLimite = new Date(agora.getTime() - (periodo * 24 * 60 * 60 * 1000));
                
                const tarefasPeriodo = Array.from(tarefas.values())
                    .filter(t => t.criadaEm >= dataLimite);
                
                const concluidas = tarefasPeriodo.filter(t => t.status === STATUS.CONCLUIDA);
                const tempoMedio = concluidas.length > 0 ?
                    concluidas.reduce((acc, t) => {
                        const tempo = t.concluidaEm - t.criadaEm;
                        return acc + tempo;
                    }, 0) / concluidas.length / (1000 * 60 * 60 * 24) : 0;
                
                return {
                    periodo: `${periodo} dias`,
                    criadas: tarefasPeriodo.length,
                    concluidas: concluidas.length,
                    taxa: tarefasPeriodo.length > 0 ? 
                        (concluidas.length / tarefasPeriodo.length * 100).toFixed(1) + '%' : '0%',
                    tempoMedioConclusao: tempoMedio.toFixed(1) + ' dias'
                };
            }
        },
        
        // Gerenciamento de categorias
        categorias: {
            listar: () => Array.from(categorias),
            
            adicionar: (nome) => {
                if (!nome || typeof nome !== 'string') {
                    return { sucesso: false, erro: 'Nome da categoria é obrigatório' };
                }
                
                const nomeFormatado = nome.trim();
                if (categorias.has(nomeFormatado)) {
                    return { sucesso: false, erro: 'Categoria já existe' };
                }
                
                categorias.add(nomeFormatado);
                return { sucesso: true, mensagem: `Categoria '${nomeFormatado}' adicionada` };
            },
            
            remover: (nome) => {
                if (!categorias.has(nome)) {
                    return { sucesso: false, erro: 'Categoria não encontrada' };
                }
                
                // Verificar se há tarefas usando esta categoria
                const tarefasUsando = Array.from(tarefas.values())
                    .filter(t => t.categoria === nome);
                
                if (tarefasUsando.length > 0) {
                    return { 
                        sucesso: false, 
                        erro: `Não é possível remover. ${tarefasUsando.length} tarefa(s) usando esta categoria` 
                    };
                }
                
                categorias.delete(nome);
                return { sucesso: true, mensagem: `Categoria '${nome}' removida` };
            }
        },
        
        // Configurações
        configurar: (novasConfiguracoes) => {
            Object.assign(configuracoes, novasConfiguracoes);
            return { sucesso: true, configuracoes: { ...configuracoes } };
        },
        
        // Constantes públicas
        STATUS,
        PRIORIDADES,
        
        // Utilitários
        utils: {
            exportar: () => {
                return {
                    tarefas: Array.from(tarefas.values()),
                    categorias: Array.from(categorias),
                    configuracoes: { ...configuracoes },
                    exportadoEm: new Date()
                };
            },
            
            importar: (dados) => {
                try {
                    if (dados.tarefas) {
                        tarefas.clear();
                        dados.tarefas.forEach(tarefa => {
                            tarefas.set(tarefa.id, tarefa);
                            proximoId = Math.max(proximoId, tarefa.id + 1);
                        });
                    }
                    
                    if (dados.categorias) {
                        categorias = new Set(dados.categorias);
                    }
                    
                    if (dados.configuracoes) {
                        Object.assign(configuracoes, dados.configuracoes);
                    }
                    
                    return { sucesso: true, mensagem: 'Dados importados com sucesso' };
                } catch (error) {
                    return { sucesso: false, erro: 'Erro ao importar dados: ' + error.message };
                }
            },
            
            limpar: () => {
                const quantidade = tarefas.size;
                tarefas.clear();
                proximoId = 1;
                return { sucesso: true, mensagem: `${quantidade} tarefas removidas` };
            }
        }
    };
})();

// Testes e demonstração
console.log('\n📋 Demonstração do Gerenciador de Tarefas:');

try {
    // Criar algumas tarefas de exemplo
    console.log('\n📝 CRIANDO TAREFAS:');
    
    const tarefa1 = GerenciadorTarefas.criar({
        titulo: 'Estudar JavaScript',
        descricao: 'Revisar conceitos de closures e escopos',
        categoria: 'Estudos',
        prioridade: GerenciadorTarefas.PRIORIDADES.ALTA,
        tags: ['javascript', 'programação', 'closures'],
        prazo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        tempoEstimado: 120 // 2 horas
    });
    console.log('✅', tarefa1.mensagem);
    
    const tarefa2 = GerenciadorTarefas.criar({
        titulo: 'Exercitar-se',
        descricao: 'Corrida matinal no parque',
        categoria: 'Saúde',
        prioridade: GerenciadorTarefas.PRIORIDADES.MEDIA,
        tags: ['saúde', 'exercício', 'corrida'],
        prazo: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // amanhã
        tempoEstimado: 30
    });
    console.log('✅', tarefa2.mensagem);
    
    const tarefa3 = GerenciadorTarefas.criar({
        titulo: 'Reunião de equipe',
        descricao: 'Discutir progresso do projeto',
        categoria: 'Trabalho',
        prioridade: GerenciadorTarefas.PRIORIDADES.URGENTE,
        tags: ['reunião', 'equipe', 'projeto'],
        prazo: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // ontem (atrasada)
        tempoEstimado: 60
    });
    console.log('✅', tarefa3.mensagem);
    
    // Atualizar uma tarefa
    console.log('\n🔄 ATUALIZANDO TAREFA:');
    const atualizacao = GerenciadorTarefas.atualizar(tarefa2.tarefa.id, {
        status: GerenciadorTarefas.STATUS.EM_PROGRESSO,
        tempoGasto: 15
    });
    console.log('✅', atualizacao.mensagem);
    
    // Listar tarefas com filtros
    console.log('\n📊 LISTAGEM COM FILTROS:');
    
    const pendentes = GerenciadorTarefas.listar(GerenciadorTarefas.filtros.pendentes());
    console.log(`Tarefas pendentes: ${pendentes.total}`);
    
    const atrasadas = GerenciadorTarefas.listar(GerenciadorTarefas.filtros.atrasadas());
    console.log(`Tarefas atrasadas: ${atrasadas.total}`);
    
    const urgentes = GerenciadorTarefas.listar(GerenciadorTarefas.filtros.urgentes());
    console.log(`Tarefas urgentes: ${urgentes.total}`);
    
    // Busca avançada
    console.log('\n🔍 BUSCA AVANÇADA:');
    const busca = GerenciadorTarefas.buscarAvancado({
        texto: 'javascript',
        categoria: 'Estudos',
        ordenarPor: 'prazo'
    });
    console.log(`Resultados da busca: ${busca.total}`);
    
    // Relatórios
    console.log('\n📈 RELATÓRIOS:');
    const resumo = GerenciadorTarefas.relatorios.resumo();
    console.log('Resumo geral:');
    console.log(`  Total: ${resumo.total}`);
    console.log(`  Por status:`, resumo.porStatus);
    console.log(`  Atrasadas: ${resumo.atrasadas}`);
    console.log(`  Produtividade: ${resumo.produtividade.taxa}`);
    
    const produtividade = GerenciadorTarefas.relatorios.produtividade(30);
    console.log('\nProdutividade (30 dias):');
    console.log(`  Criadas: ${produtividade.criadas}`);
    console.log(`  Concluídas: ${produtividade.concluidas}`);
    console.log(`  Taxa: ${produtividade.taxa}`);
    
    // Gerenciar categorias
    console.log('\n📂 GERENCIAMENTO DE CATEGORIAS:');
    const novaCategoria = GerenciadorTarefas.categorias.adicionar('Hobby');
    console.log('✅', novaCategoria.mensagem);
    
    console.log('Categorias disponíveis:', GerenciadorTarefas.categorias.listar());
    
    // Exportar dados
    console.log('\n💾 EXPORTAÇÃO:');
    const exportacao = GerenciadorTarefas.utils.exportar();
    console.log(`Dados exportados: ${exportacao.tarefas.length} tarefas, ${exportacao.categorias.length} categorias`);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

/*
========================================
EXERCÍCIO 3: SISTEMA DE CACHE INTELIGENTE
========================================

Objetivo: Implementar um sistema de cache avançado usando
closures, funções de alta ordem e diferentes estratégias
de armazenamento, demonstrando conceitos avançados de escopo.

Requisitos:
1. Múltiplas estratégias de cache (LRU, LFU, TTL)
2. Cache hierárquico com níveis
3. Compressão e serialização automática
4. Estatísticas e monitoramento
5. Limpeza automática e manual
6. Persistência simulada
7. Sistema de eventos para cache
*/

console.log('\n--- EXERCÍCIO 3: SISTEMA DE CACHE INTELIGENTE ---');

// SOLUÇÃO:
const SistemaCache = (() => {
    // Configurações globais
    const configuracoes = {
        tamanhoMaximo: 100,
        ttlPadrao: 5 * 60 * 1000, // 5 minutos
        estrategiaPadrao: 'LRU',
        compressaoAutomatica: true,
        persistencia: false,
        debug: false
    };
    
    // Eventos do sistema
    const eventos = {
        hit: [],
        miss: [],
        set: [],
        delete: [],
        clear: [],
        expire: []
    };
    
    // Estatísticas globais
    let estatisticas = {
        hits: 0,
        misses: 0,
        sets: 0,
        deletes: 0,
        expires: 0,
        iniciadoEm: new Date()
    };
    
    // Função para emitir eventos
    function emitirEvento(tipo, dados) {
        if (eventos[tipo]) {
            eventos[tipo].forEach(callback => {
                try {
                    callback(dados);
                } catch (error) {
                    if (configuracoes.debug) {
                        console.error(`Erro no evento ${tipo}:`, error);
                    }
                }
            });
        }
    }
    
    // Função para criar um cache com estratégia específica
    function criarCache(opcoes = {}) {
        const config = { ...configuracoes, ...opcoes };
        const dados = new Map();
        const metadados = new Map();
        const acessos = new Map(); // Para LRU/LFU
        
        let proximaLimpeza = null;
        
        // Função para serializar dados
        function serializar(valor) {
            if (config.compressaoAutomatica) {
                // Simular compressão (em uma aplicação real, usaria uma biblioteca)
                const json = JSON.stringify(valor);
                return {
                    dados: json,
                    comprimido: json.length > 100,
                    tamanhoOriginal: json.length,
                    tamanhoComprimido: Math.floor(json.length * 0.7) // Simular 30% de compressão
                };
            }
            return { dados: valor, comprimido: false };
        }
        
        // Função para deserializar dados
        function deserializar(item) {
            if (item.comprimido) {
                return JSON.parse(item.dados);
            }
            return item.dados;
        }
        
        // Função para verificar expiração
        function verificarExpiracao(chave) {
            const meta = metadados.get(chave);
            if (!meta) return false;
            
            if (meta.ttl && Date.now() > meta.expiraEm) {
                // Item expirado
                dados.delete(chave);
                metadados.delete(chave);
                acessos.delete(chave);
                
                estatisticas.expires++;
                emitirEvento('expire', { chave, motivo: 'TTL expirado' });
                
                return true;
            }
            return false;
        }
        
        // Função para aplicar estratégia de remoção
        function aplicarEstrategia() {
            if (dados.size <= config.tamanhoMaximo) return;
            
            let chaveRemover = null;
            
            switch (config.estrategiaPadrao) {
                case 'LRU': // Least Recently Used
                    let menorAcesso = Infinity;
                    for (const [chave, ultimoAcesso] of acessos) {
                        if (ultimoAcesso < menorAcesso) {
                            menorAcesso = ultimoAcesso;
                            chaveRemover = chave;
                        }
                    }
                    break;
                    
                case 'LFU': // Least Frequently Used
                    let menorFrequencia = Infinity;
                    for (const [chave, meta] of metadados) {
                        if (meta.acessos < menorFrequencia) {
                            menorFrequencia = meta.acessos;
                            chaveRemover = chave;
                        }
                    }
                    break;
                    
                case 'FIFO': // First In, First Out
                    let maisAntigo = Infinity;
                    for (const [chave, meta] of metadados) {
                        if (meta.criadoEm < maisAntigo) {
                            maisAntigo = meta.criadoEm;
                            chaveRemover = chave;
                        }
                    }
                    break;
                    
                default:
                    // Remover aleatório
                    const chaves = Array.from(dados.keys());
                    chaveRemover = chaves[Math.floor(Math.random() * chaves.length)];
            }
            
            if (chaveRemover) {
                dados.delete(chaveRemover);
                metadados.delete(chaveRemover);
                acessos.delete(chaveRemover);
                
                emitirEvento('delete', { 
                    chave: chaveRemover, 
                    motivo: `Estratégia ${config.estrategiaPadrao}` 
                });
            }
        }
        
        // Função para agendar limpeza automática
        function agendarLimpeza() {
            if (proximaLimpeza) {
                clearTimeout(proximaLimpeza);
            }
            
            proximaLimpeza = setTimeout(() => {
                limparExpirados();
                agendarLimpeza(); // Reagendar
            }, 60000); // A cada minuto
        }
        
        // Função para limpar itens expirados
        function limparExpirados() {
            const agora = Date.now();
            const chavesExpiradas = [];
            
            for (const [chave, meta] of metadados) {
                if (meta.ttl && agora > meta.expiraEm) {
                    chavesExpiradas.push(chave);
                }
            }
            
            chavesExpiradas.forEach(chave => {
                dados.delete(chave);
                metadados.delete(chave);
                acessos.delete(chave);
                
                estatisticas.expires++;
                emitirEvento('expire', { chave, motivo: 'Limpeza automática' });
            });
            
            return chavesExpiradas.length;
        }
        
        // Iniciar limpeza automática
        agendarLimpeza();
        
        // Interface do cache
        return {
            // Definir valor
            set: (chave, valor, ttl = config.ttlPadrao) => {
                try {
                    // Verificar se a chave já existe
                    const existe = dados.has(chave);
                    
                    // Serializar dados
                    const item = serializar(valor);
                    
                    // Criar metadados
                    const agora = Date.now();
                    const meta = {
                        criadoEm: agora,
                        atualizadoEm: agora,
                        acessos: 0,
                        ttl: ttl,
                        expiraEm: ttl ? agora + ttl : null,
                        tamanho: item.tamanhoOriginal || JSON.stringify(valor).length
                    };
                    
                    // Armazenar dados e metadados
                    dados.set(chave, item);
                    metadados.set(chave, meta);
                    acessos.set(chave, agora);
                    
                    // Aplicar estratégia se necessário
                    aplicarEstrategia();
                    
                    // Atualizar estatísticas
                    estatisticas.sets++;
                    
                    // Emitir evento
                    emitirEvento('set', {
                        chave,
                        valor,
                        ttl,
                        existe,
                        tamanho: meta.tamanho
                    });
                    
                    return {
                        sucesso: true,
                        chave,
                        tamanho: meta.tamanho,
                        comprimido: item.comprimido,
                        expiraEm: meta.expiraEm
                    };
                    
                } catch (error) {
                    return {
                        sucesso: false,
                        erro: error.message
                    };
                }
            },
            
            // Obter valor
            get: (chave) => {
                try {
                    // Verificar expiração
                    if (verificarExpiracao(chave)) {
                        estatisticas.misses++;
                        emitirEvento('miss', { chave, motivo: 'Expirado' });
                        return { sucesso: false, motivo: 'Chave expirada' };
                    }
                    
                    // Verificar se existe
                    if (!dados.has(chave)) {
                        estatisticas.misses++;
                        emitirEvento('miss', { chave, motivo: 'Não encontrado' });
                        return { sucesso: false, motivo: 'Chave não encontrada' };
                    }
                    
                    // Obter dados
                    const item = dados.get(chave);
                    const meta = metadados.get(chave);
                    
                    // Atualizar estatísticas de acesso
                    meta.acessos++;
                    meta.ultimoAcesso = Date.now();
                    acessos.set(chave, Date.now());
                    
                    // Deserializar
                    const valor = deserializar(item);
                    
                    // Atualizar estatísticas
                    estatisticas.hits++;
                    
                    // Emitir evento
                    emitirEvento('hit', {
                        chave,
                        valor,
                        acessos: meta.acessos,
                        idade: Date.now() - meta.criadoEm
                    });
                    
                    return {
                        sucesso: true,
                        valor,
                        metadados: { ...meta },
                        comprimido: item.comprimido
                    };
                    
                } catch (error) {
                    return {
                        sucesso: false,
                        erro: error.message
                    };
                }
            },
            
            // Verificar se existe
            has: (chave) => {
                if (verificarExpiracao(chave)) {
                    return false;
                }
                return dados.has(chave);
            },
            
            // Remover valor
            delete: (chave) => {
                const existe = dados.has(chave);
                
                if (existe) {
                    dados.delete(chave);
                    metadados.delete(chave);
                    acessos.delete(chave);
                    
                    estatisticas.deletes++;
                    emitirEvento('delete', { chave, motivo: 'Manual' });
                }
                
                return existe;
            },
            
            // Limpar cache
            clear: () => {
                const quantidade = dados.size;
                
                dados.clear();
                metadados.clear();
                acessos.clear();
                
                emitirEvento('clear', { quantidade });
                
                return quantidade;
            },
            
            // Obter estatísticas
            stats: () => {
                const agora = Date.now();
                const tempoVida = agora - estatisticas.iniciadoEm;
                const total = estatisticas.hits + estatisticas.misses;
                
                return {
                    ...estatisticas,
                    tamanho: dados.size,
                    tamanhoMaximo: config.tamanhoMaximo,
                    hitRate: total > 0 ? (estatisticas.hits / total * 100).toFixed(2) + '%' : '0%',
                    tempoVida: Math.floor(tempoVida / 1000) + 's',
                    memoria: {
                        itens: dados.size,
                        metadados: metadados.size,
                        acessos: acessos.size
                    }
                };
            },
            
            // Listar chaves
            keys: () => Array.from(dados.keys()),
            
            // Listar valores
            values: () => {
                const valores = [];
                for (const [chave, item] of dados) {
                    if (!verificarExpiracao(chave)) {
                        valores.push(deserializar(item));
                    }
                }
                return valores;
            },
            
            // Listar entradas
            entries: () => {
                const entradas = [];
                for (const [chave, item] of dados) {
                    if (!verificarExpiracao(chave)) {
                        entradas.push([chave, deserializar(item)]);
                    }
                }
                return entradas;
            },
            
            // Limpeza manual
            cleanup: () => {
                const removidos = limparExpirados();
                return {
                    removidos,
                    tamanhoAtual: dados.size
                };
            },
            
            // Configurar cache
            configure: (novasConfigs) => {
                Object.assign(config, novasConfigs);
                return { ...config };
            },
            
            // Exportar dados
            export: () => {
                const exportacao = {
                    dados: {},
                    metadados: {},
                    configuracao: { ...config },
                    estatisticas: { ...estatisticas },
                    exportadoEm: new Date()
                };
                
                for (const [chave, item] of dados) {
                    if (!verificarExpiracao(chave)) {
                        exportacao.dados[chave] = deserializar(item);
                        exportacao.metadados[chave] = metadados.get(chave);
                    }
                }
                
                return exportacao;
            },
            
            // Importar dados
            import: (dadosImportacao) => {
                try {
                    let importados = 0;
                    
                    if (dadosImportacao.dados) {
                        for (const [chave, valor] of Object.entries(dadosImportacao.dados)) {
                            const meta = dadosImportacao.metadados?.[chave];
                            const ttl = meta?.ttl || config.ttlPadrao;
                            
                            this.set(chave, valor, ttl);
                            importados++;
                        }
                    }
                    
                    return {
                        sucesso: true,
                        importados,
                        tamanhoAtual: dados.size
                    };
                    
                } catch (error) {
                    return {
                        sucesso: false,
                        erro: error.message
                    };
                }
            }
        };
    }
    
    // Cache principal
    const cacheL1 = criarCache({ tamanhoMaximo: 50, estrategiaPadrao: 'LRU' });
    const cacheL2 = criarCache({ tamanhoMaximo: 200, estrategiaPadrao: 'LFU' });
    
    // Interface pública do sistema
    return {
        // Criar novo cache
        criarCache,
        
        // Cache principal (L1)
        cache: cacheL1,
        
        // Cache hierárquico
        hierarquico: {
            get: (chave) => {
                // Tentar L1 primeiro
                let resultado = cacheL1.get(chave);
                if (resultado.sucesso) {
                    return { ...resultado, nivel: 'L1' };
                }
                
                // Tentar L2
                resultado = cacheL2.get(chave);
                if (resultado.sucesso) {
                    // Promover para L1
                    cacheL1.set(chave, resultado.valor);
                    return { ...resultado, nivel: 'L2', promovido: true };
                }
                
                return { sucesso: false, motivo: 'Não encontrado em nenhum nível' };
            },
            
            set: (chave, valor, ttl) => {
                // Armazenar em ambos os níveis
                const l1 = cacheL1.set(chave, valor, ttl);
                const l2 = cacheL2.set(chave, valor, ttl * 2); // TTL maior no L2
                
                return {
                    l1: l1.sucesso,
                    l2: l2.sucesso,
                    chave,
                    valor
                };
            },
            
            stats: () => ({
                l1: cacheL1.stats(),
                l2: cacheL2.stats()
            })
        },
        
        // Eventos
        on: (evento, callback) => {
            if (eventos[evento]) {
                eventos[evento].push(callback);
                return () => {
                    const index = eventos[evento].indexOf(callback);
                    if (index > -1) {
                        eventos[evento].splice(index, 1);
                    }
                };
            }
            throw new Error(`Evento '${evento}' não existe`);
        },
        
        // Configurações globais
        configurar: (novasConfigs) => {
            Object.assign(configuracoes, novasConfigs);
            return { ...configuracoes };
        },
        
        // Estatísticas globais
        estatisticasGlobais: () => ({ ...estatisticas }),
        
        // Utilitários
        utils: {
            // Função de memoização
            memoize: (funcao, opcoes = {}) => {
                const cache = criarCache(opcoes);
                
                return function(...args) {
                    const chave = JSON.stringify(args);
                    
                    const resultado = cache.get(chave);
                    if (resultado.sucesso) {
                        return resultado.valor;
                    }
                    
                    const valor = funcao.apply(this, args);
                    cache.set(chave, valor);
                    
                    return valor;
                };
            },
            
            // Cache para promises
            cachePromise: (promiseFactory, chave, ttl) => {
                const resultado = cacheL1.get(chave);
                if (resultado.sucesso) {
                    return Promise.resolve(resultado.valor);
                }
                
                return promiseFactory()
                    .then(valor => {
                        cacheL1.set(chave, valor, ttl);
                        return valor;
                    })
                    .catch(error => {
                        // Não cachear erros
                        throw error;
                    });
            },
            
            // Benchmark de cache
            benchmark: (operacoes = 1000) => {
                const cache = criarCache({ tamanhoMaximo: 100 });
                const inicio = performance.now();
                
                // Operações de escrita
                for (let i = 0; i < operacoes; i++) {
                    cache.set(`chave_${i}`, { dados: `valor_${i}`, numero: i });
                }
                
                const meioTempo = performance.now();
                
                // Operações de leitura
                for (let i = 0; i < operacoes; i++) {
                    cache.get(`chave_${i}`);
                }
                
                const fim = performance.now();
                
                return {
                    operacoes,
                    tempoEscrita: (meioTempo - inicio).toFixed(2) + 'ms',
                    tempoLeitura: (fim - meioTempo).toFixed(2) + 'ms',
                    tempoTotal: (fim - inicio).toFixed(2) + 'ms',
                    opsEscritaPorMs: (operacoes / (meioTempo - inicio)).toFixed(2),
                    opsLeituraPorMs: (operacoes / (fim - meioTempo)).toFixed(2),
                    stats: cache.stats()
                };
            }
        }
    };
})();

// Testes e demonstração
console.log('\n🗄️ Demonstração do Sistema de Cache:');

try {
    // Configurar sistema
    console.log('\n⚙️ CONFIGURAÇÃO:');
    const config = SistemaCache.configurar({
        debug: true,
        tamanhoMaximo: 10
    });
    console.log('Configurações:', config);
    
    // Adicionar listeners de eventos
    const removerListener = SistemaCache.on('set', (dados) => {
        console.log(`📝 Cache SET: ${dados.chave} (${dados.tamanho} bytes)`);
    });
    
    SistemaCache.on('hit', (dados) => {
        console.log(`✅ Cache HIT: ${dados.chave} (${dados.acessos} acessos)`);
    });
    
    SistemaCache.on('miss', (dados) => {
        console.log(`❌ Cache MISS: ${dados.chave} (${dados.motivo})`);
    });
    
    // Operações básicas
    console.log('\n📊 OPERAÇÕES BÁSICAS:');
    
    // Armazenar dados
    SistemaCache.cache.set('usuario:123', {
        id: 123,
        nome: 'João Silva',
        email: 'joao@email.com',
        perfil: 'admin'
    }, 30000); // 30 segundos
    
    SistemaCache.cache.set('config:app', {
        tema: 'escuro',
        idioma: 'pt-BR',
        notificacoes: true
    });
    
    SistemaCache.cache.set('dados:temporarios', {
        timestamp: Date.now(),
        dados: Array.from({length: 100}, (_, i) => i)
    }, 5000); // 5 segundos
    
    // Recuperar dados
    console.log('\n🔍 RECUPERAÇÃO:');
    const usuario = SistemaCache.cache.get('usuario:123');
    if (usuario.sucesso) {
        console.log('Usuário encontrado:', usuario.valor.nome);
    }
    
    const config2 = SistemaCache.cache.get('config:app');
    if (config2.sucesso) {
        console.log('Configuração:', config2.valor.tema);
    }
    
    // Tentar acessar dados inexistentes
    const inexistente = SistemaCache.cache.get('chave:inexistente');
    console.log('Chave inexistente:', inexistente.motivo);
    
    // Cache hierárquico
    console.log('\n🏗️ CACHE HIERÁRQUICO:');
    
    SistemaCache.hierarquico.set('produto:456', {
        id: 456,
        nome: 'Smartphone',
        preco: 899.99,
        categoria: 'eletrônicos'
    });
    
    const produto = SistemaCache.hierarquico.get('produto:456');
    console.log(`Produto encontrado no nível: ${produto.nivel}`);
    
    // Acessar novamente (deve vir do L1 agora)
    const produto2 = SistemaCache.hierarquico.get('produto:456');
    console.log(`Segunda busca - nível: ${produto2.nivel}`);
    
    // Memoização
    console.log('\n🧠 MEMOIZAÇÃO:');
    
    const fibonacci = SistemaCache.utils.memoize((n) => {
        console.log(`Calculando fibonacci(${n})`);
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    });
    
    console.log('Primeira chamada fibonacci(10):');
    console.log('Resultado:', fibonacci(10));
    
    console.log('\nSegunda chamada fibonacci(10) (deve usar cache):');
    console.log('Resultado:', fibonacci(10));
    
    // Cache de promises
    console.log('\n🔄 CACHE DE PROMISES:');
    
    const buscarDados = () => {
        console.log('Simulando requisição HTTP...');
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ dados: 'Dados da API', timestamp: Date.now() });
            }, 100);
        });
    };
    
    // Primeira chamada
    SistemaCache.utils.cachePromise(buscarDados, 'api:dados', 10000)
        .then(dados => {
            console.log('Primeira chamada:', dados.timestamp);
            
            // Segunda chamada (deve usar cache)
            return SistemaCache.utils.cachePromise(buscarDados, 'api:dados', 10000);
        })
        .then(dados => {
            console.log('Segunda chamada (cache):', dados.timestamp);
        });
    
    // Estatísticas
    setTimeout(() => {
        console.log('\n📈 ESTATÍSTICAS:');
        const stats = SistemaCache.cache.stats();
        console.log(`Hit Rate: ${stats.hitRate}`);
        console.log(`Total de itens: ${stats.tamanho}`);
        console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
        
        const statsHierarquico = SistemaCache.hierarquico.stats();
        console.log('\nCache Hierárquico:');
        console.log('L1 - Hit Rate:', statsHierarquico.l1.hitRate);
        console.log('L2 - Hit Rate:', statsHierarquico.l2.hitRate);
        
        // Benchmark
        console.log('\n⚡ BENCHMARK:');
        const benchmark = SistemaCache.utils.benchmark(1000);
        console.log(`${benchmark.operacoes} operações:`);
        console.log(`Escrita: ${benchmark.tempoEscrita} (${benchmark.opsEscritaPorMs} ops/ms)`);
        console.log(`Leitura: ${benchmark.tempoLeitura} (${benchmark.opsLeituraPorMs} ops/ms)`);
        console.log(`Total: ${benchmark.tempoTotal}`);
        
        // Limpeza
        console.log('\n🧹 LIMPEZA:');
        const limpeza = SistemaCache.cache.cleanup();
        console.log(`Itens expirados removidos: ${limpeza.removidos}`);
        
        // Remover listener
        removerListener();
        
    }, 200);
    
} catch (error) {
    console.error('❌ Erro:', error.message);
}

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

1. CALCULADORA MODULAR:
   - Adicione operações logarítmicas (log, ln, log10)
   - Implemente conversão entre diferentes unidades (temperatura, peso, distância)
   - Crie um sistema de macros para operações complexas
   - Adicione suporte a números complexos
   - Implemente um parser de expressões matemáticas

2. GERENCIADOR DE TAREFAS:
   - Adicione sistema de dependências entre tarefas
   - Implemente notificações e lembretes
   - Crie templates de tarefas reutilizáveis
   - Adicione sistema de colaboração (atribuir tarefas)
   - Implemente sincronização com calendário

3. SISTEMA DE CACHE:
   - Adicione compressão real usando bibliotecas
   - Implemente persistência em localStorage/IndexedDB
   - Crie sistema de replicação entre abas
   - Adicione métricas de performance detalhadas
   - Implemente cache distribuído simulado

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. CLOSURES E ESCOPO:
   ✅ Encapsulamento de dados privados
   ✅ Factory functions para criar instâncias
   ✅ Preservação de estado entre chamadas
   ✅ Evitar poluição do escopo global

2. FUNÇÕES DE ALTA ORDEM:
   ✅ Callbacks e event listeners
   ✅ Funções que retornam funções
   ✅ Composição de funções
   ✅ Memoização e cache de funções

3. ORGANIZAÇÃO DE CÓDIGO:
   ✅ Padrão Module (IIFE)
   ✅ Interface pública bem definida
   ✅ Separação de responsabilidades
   ✅ Documentação inline

4. TRATAMENTO DE ERROS:
   ✅ Validação de entrada
   ✅ Try-catch apropriado
   ✅ Mensagens de erro descritivas
   ✅ Fallbacks e valores padrão

5. PERFORMANCE:
   ✅ Lazy loading e inicialização sob demanda
   ✅ Cache e memoização
   ✅ Limpeza de recursos
   ✅ Otimização de algoritmos
*/

console.log('\n✅ Exercícios de Funções e Escopos concluídos!');
console.log('\n📚 Conceitos abordados:');
console.log('• Closures e encapsulamento');
console.log('• Factory functions e módulos');
console.log('• Funções de alta ordem');
console.log('• Memoização e cache');
console.log('• Escopo lexical e contexto');
console.log('• Padrões de organização de código');
console.log('\n🎯 Próximo: Exercícios de Objetos e Protótipos!');