/*
===========================================
    MÓDULO 08 - ASSINCRONISMO
    Aula 03: Async/Await (Sintaxe Moderna)
===========================================

Objetivos de Aprendizagem:
✓ Compreender a sintaxe async/await
✓ Converter Promises para async/await
✓ Dominar tratamento de erros com try/catch
✓ Implementar padrões avançados com async/await
✓ Otimizar performance com execução paralela
✓ Criar funções assíncronas robustas
*/

// ===========================================
// 1. TEORIA: ASYNC/AWAIT
// ===========================================

/*
ASYNC/AWAIT EM JAVASCRIPT:

1. CONCEITO:
   - Sintaxe que torna código assíncrono mais legível
   - Baseado em Promises (syntactic sugar)
   - Permite escrever código assíncrono como síncrono
   - Introduzido no ES2017 (ES8)

2. PALAVRAS-CHAVE:
   - async: Declara função assíncrona
   - await: Pausa execução até Promise resolver
   - Só pode usar await dentro de função async
   - Função async sempre retorna Promise

3. VANTAGENS:
   - Código mais limpo e legível
   - Melhor tratamento de erros com try/catch
   - Debugging mais fácil
   - Fluxo de controle mais natural

4. EQUIVALÊNCIAS:
   - async function = função que retorna Promise
   - await promise = promise.then()
   - try/catch = promise.catch()

5. CASOS DE USO:
   - APIs e requisições HTTP
   - Operações de banco de dados
   - Leitura/escrita de arquivos
   - Qualquer operação assíncrona
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Sintaxe Básica Async/Await ---
console.log('=== SINTAXE BÁSICA ASYNC/AWAIT ===');

// Função assíncrona simples
async function exemploBasico() {
    console.log('\n--- Exemplo Básico ---');
    
    // Função que retorna Promise
    function criarPromise(valor, delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(`✅ Promise resolvida com: ${valor}`);
                resolve(valor);
            }, delay);
        });
    }
    
    try {
        console.log('🔄 Iniciando operação assíncrona...');
        
        // Aguardar Promise resolver
        const resultado1 = await criarPromise('Primeiro resultado', 500);
        console.log('📦 Recebido:', resultado1);
        
        const resultado2 = await criarPromise('Segundo resultado', 300);
        console.log('📦 Recebido:', resultado2);
        
        const resultado3 = await criarPromise('Terceiro resultado', 200);
        console.log('📦 Recebido:', resultado3);
        
        console.log('🏁 Todas as operações concluídas!');
        
        return `Processados: ${resultado1}, ${resultado2}, ${resultado3}`;
        
    } catch (erro) {
        console.error('❌ Erro na operação:', erro.message);
        throw erro;
    }
}

// Executar exemplo básico
exemploBasico()
    .then(resultado => {
        console.log('✅ Resultado final:', resultado);
    })
    .catch(erro => {
        console.error('❌ Erro capturado:', erro.message);
    });

// --- 2.2 Comparação: Promises vs Async/Await ---
console.log('\n=== COMPARAÇÃO: PROMISES VS ASYNC/AWAIT ===');

// Simulando operações assíncronas
function buscarUsuario(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error('ID inválido'));
                return;
            }
            resolve({ id, nome: `Usuário ${id}`, email: `user${id}@email.com` });
        }, 300);
    });
}

function buscarPerfil(usuarioId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                usuarioId,
                bio: 'Desenvolvedor JavaScript',
                avatar: `avatar${usuarioId}.jpg`,
                seguidores: Math.floor(Math.random() * 1000)
            });
        }, 200);
    });
}

function buscarPostagens(usuarioId) {
    return new Promise(resolve => {
        setTimeout(() => {
            const postagens = Array.from({ length: 3 }, (_, i) => ({
                id: i + 1,
                titulo: `Post ${i + 1} do usuário ${usuarioId}`,
                conteudo: `Conteúdo do post ${i + 1}`,
                likes: Math.floor(Math.random() * 100)
            }));
            resolve(postagens);
        }, 400);
    });
}

// ❌ VERSÃO COM PROMISES (mais verbosa)
function obterDadosCompletoPromises(id) {
    console.log('\n--- Versão com Promises ---');
    
    return buscarUsuario(id)
        .then(usuario => {
            console.log('👤 Usuário encontrado:', usuario.nome);
            
            return Promise.all([
                Promise.resolve(usuario),
                buscarPerfil(usuario.id),
                buscarPostagens(usuario.id)
            ]);
        })
        .then(([usuario, perfil, postagens]) => {
            console.log('📊 Perfil carregado:', perfil.bio);
            console.log('📝 Postagens carregadas:', postagens.length);
            
            return {
                usuario,
                perfil,
                postagens,
                timestamp: new Date()
            };
        })
        .catch(erro => {
            console.error('❌ Erro com Promises:', erro.message);
            throw erro;
        });
}

// ✅ VERSÃO COM ASYNC/AWAIT (mais limpa)
async function obterDadosCompletoAsyncAwait(id) {
    console.log('\n--- Versão com Async/Await ---');
    
    try {
        // Buscar usuário primeiro
        const usuario = await buscarUsuario(id);
        console.log('👤 Usuário encontrado:', usuario.nome);
        
        // Buscar perfil e postagens em paralelo
        const [perfil, postagens] = await Promise.all([
            buscarPerfil(usuario.id),
            buscarPostagens(usuario.id)
        ]);
        
        console.log('📊 Perfil carregado:', perfil.bio);
        console.log('📝 Postagens carregadas:', postagens.length);
        
        return {
            usuario,
            perfil,
            postagens,
            timestamp: new Date()
        };
        
    } catch (erro) {
        console.error('❌ Erro com Async/Await:', erro.message);
        throw erro;
    }
}

// Testar ambas as versões
setTimeout(() => {
    obterDadosCompletoPromises(1)
        .then(dados => {
            console.log('✅ Dados completos (Promises):', {
                usuario: dados.usuario.nome,
                seguidores: dados.perfil.seguidores,
                totalPosts: dados.postagens.length
            });
        });
}, 2000);

setTimeout(() => {
    obterDadosCompletoAsyncAwait(2)
        .then(dados => {
            console.log('✅ Dados completos (Async/Await):', {
                usuario: dados.usuario.nome,
                seguidores: dados.perfil.seguidores,
                totalPosts: dados.postagens.length
            });
        });
}, 4000);

// --- 2.3 Tratamento de Erros com Try/Catch ---
console.log('\n=== TRATAMENTO DE ERROS ===');

async function exemploTratamentoErros() {
    console.log('\n--- Tratamento de Erros ---');
    
    // Função que pode falhar
    function operacaoQuePodefFalhar(shouldFail = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldFail) {
                    reject(new Error('Operação falhou intencionalmente'));
                } else {
                    resolve('Operação bem-sucedida');
                }
            }, 300);
        });
    }
    
    // === TRATAMENTO BÁSICO ===
    try {
        console.log('🔄 Tentando operação que vai dar certo...');
        const resultado1 = await operacaoQuePodefFalhar(false);
        console.log('✅ Resultado 1:', resultado1);
        
        console.log('🔄 Tentando operação que vai falhar...');
        const resultado2 = await operacaoQuePodefFalhar(true);
        console.log('✅ Resultado 2:', resultado2); // Não será executado
        
    } catch (erro) {
        console.log('❌ Erro capturado:', erro.message);
    }
    
    // === TRATAMENTO ESPECÍFICO POR TIPO ===
    try {
        console.log('\n🔄 Testando diferentes tipos de erro...');
        
        // Simular diferentes tipos de erro
        const tipoErro = Math.random();
        
        if (tipoErro < 0.33) {
            const erro = new Error('Erro de rede');
            erro.type = 'NETWORK_ERROR';
            throw erro;
        } else if (tipoErro < 0.66) {
            const erro = new Error('Não autorizado');
            erro.type = 'AUTH_ERROR';
            erro.status = 401;
            throw erro;
        } else {
            console.log('✅ Operação bem-sucedida');
        }
        
    } catch (erro) {
        // Tratamento específico por tipo
        switch (erro.type) {
            case 'NETWORK_ERROR':
                console.log('🌐 Erro de rede detectado - tentando reconectar...');
                break;
            case 'AUTH_ERROR':
                console.log('🔐 Erro de autenticação - redirecionando para login...');
                break;
            default:
                console.log('❓ Erro desconhecido:', erro.message);
        }
    }
    
    // === FINALLY ===
    let recurso = null;
    try {
        console.log('\n🔄 Alocando recurso...');
        recurso = { nome: 'Recurso importante', ativo: true };
        
        // Simular operação que pode falhar
        await operacaoQuePodefFalhar(Math.random() < 0.5);
        
        console.log('✅ Operação com recurso concluída');
        
    } catch (erro) {
        console.log('❌ Erro durante uso do recurso:', erro.message);
    } finally {
        // Sempre executado - limpeza de recursos
        if (recurso) {
            recurso.ativo = false;
            console.log('🧹 Recurso liberado:', recurso.nome);
        }
    }
}

setTimeout(exemploTratamentoErros, 6000);

// --- 2.4 Padrões Avançados com Async/Await ---
console.log('\n=== PADRÕES AVANÇADOS ===');

class AsyncPatterns {
    // Retry com backoff exponencial
    static async retry(fn, maxAttempts = 3, baseDelay = 1000, backoffFactor = 2) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(`🔄 Tentativa ${attempt}/${maxAttempts}`);
                const result = await fn();
                console.log(`✅ Sucesso na tentativa ${attempt}`);
                return result;
                
            } catch (error) {
                lastError = error;
                console.log(`❌ Falha na tentativa ${attempt}: ${error.message}`);
                
                if (attempt === maxAttempts) {
                    break;
                }
                
                const delay = baseDelay * Math.pow(backoffFactor, attempt - 1);
                console.log(`⏱️ Aguardando ${delay}ms antes da próxima tentativa...`);
                await this.delay(delay);
            }
        }
        
        throw new Error(`Falhou após ${maxAttempts} tentativas: ${lastError.message}`);
    }
    
    // Timeout para operações assíncronas
    static async timeout(promise, ms) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout de ${ms}ms excedido`));
            }, ms);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }
    
    // Delay simples
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Executar operações em lotes com limite de concorrência
    static async batchProcess(items, processor, batchSize = 5, delayBetweenBatches = 0) {
        const results = [];
        
        for (let i = 0; i < items.length; i += batchSize) {
            const batch = items.slice(i, i + batchSize);
            console.log(`📦 Processando lote ${Math.floor(i / batchSize) + 1} (${batch.length} itens)`);
            
            const batchPromises = batch.map(item => processor(item));
            const batchResults = await Promise.allSettled(batchPromises);
            
            results.push(...batchResults);
            
            if (delayBetweenBatches > 0 && i + batchSize < items.length) {
                console.log(`⏱️ Aguardando ${delayBetweenBatches}ms entre lotes...`);
                await this.delay(delayBetweenBatches);
            }
        }
        
        return results;
    }
    
    // Pipeline de transformações assíncronas
    static async pipeline(value, ...transformers) {
        let result = value;
        
        for (const transformer of transformers) {
            console.log(`🔄 Aplicando transformação: ${transformer.name || 'anônima'}`);
            result = await transformer(result);
        }
        
        return result;
    }
    
    // Executar com circuit breaker
    static createCircuitBreaker(fn, options = {}) {
        const {
            failureThreshold = 5,
            resetTimeout = 60000,
            monitoringPeriod = 10000
        } = options;
        
        let state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        let failures = 0;
        let lastFailureTime = null;
        let successCount = 0;
        
        return async function circuitBreakerWrapper(...args) {
            // Verificar se deve tentar resetar
            if (state === 'OPEN' && Date.now() - lastFailureTime > resetTimeout) {
                state = 'HALF_OPEN';
                successCount = 0;
                console.log('🔄 Circuit breaker: Tentando HALF_OPEN');
            }
            
            // Rejeitar imediatamente se circuito estiver aberto
            if (state === 'OPEN') {
                throw new Error('Circuit breaker está OPEN - operação rejeitada');
            }
            
            try {
                const result = await fn(...args);
                
                // Sucesso - resetar contadores
                if (state === 'HALF_OPEN') {
                    successCount++;
                    if (successCount >= 3) {
                        state = 'CLOSED';
                        failures = 0;
                        console.log('✅ Circuit breaker: Resetado para CLOSED');
                    }
                } else {
                    failures = 0;
                }
                
                return result;
                
            } catch (error) {
                failures++;
                lastFailureTime = Date.now();
                
                if (failures >= failureThreshold) {
                    state = 'OPEN';
                    console.log(`❌ Circuit breaker: Aberto após ${failures} falhas`);
                }
                
                throw error;
            }
        };
    }
    
    // Rate limiting
    static createRateLimiter(maxRequests, windowMs) {
        const requests = [];
        
        return async function rateLimitedFunction(fn, ...args) {
            const now = Date.now();
            
            // Remover requisições antigas
            while (requests.length > 0 && now - requests[0] > windowMs) {
                requests.shift();
            }
            
            // Verificar limite
            if (requests.length >= maxRequests) {
                const oldestRequest = requests[0];
                const waitTime = windowMs - (now - oldestRequest);
                
                console.log(`⏱️ Rate limit atingido. Aguardando ${waitTime}ms...`);
                await AsyncPatterns.delay(waitTime);
                
                return rateLimitedFunction(fn, ...args);
            }
            
            // Registrar requisição e executar
            requests.push(now);
            return await fn(...args);
        };
    }
}

// Exemplos de uso dos padrões avançados
async function exemplosPadroesAvancados() {
    console.log('\n--- Padrões Avançados ---');
    
    // === RETRY ===
    console.log('\n🔄 Testando retry...');
    
    let tentativas = 0;
    const operacaoComFalha = async () => {
        tentativas++;
        if (tentativas < 3) {
            throw new Error(`Falha simulada ${tentativas}`);
        }
        return `Sucesso após ${tentativas} tentativas`;
    };
    
    try {
        const resultado = await AsyncPatterns.retry(operacaoComFalha, 5, 500, 1.5);
        console.log('✅ Retry bem-sucedido:', resultado);
    } catch (error) {
        console.error('❌ Retry falhou:', error.message);
    }
    
    // === TIMEOUT ===
    console.log('\n⏰ Testando timeout...');
    
    const operacaoLenta = async () => {
        await AsyncPatterns.delay(2000);
        return 'Operação concluída';
    };
    
    try {
        const resultado = await AsyncPatterns.timeout(operacaoLenta(), 1500);
        console.log('✅ Operação concluída:', resultado);
    } catch (error) {
        console.log('❌ Timeout como esperado:', error.message);
    }
    
    // === BATCH PROCESSING ===
    console.log('\n📦 Testando processamento em lotes...');
    
    const items = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const processarItem = async (item) => {
        await AsyncPatterns.delay(Math.random() * 200 + 100);
        return item * 2;
    };
    
    const resultados = await AsyncPatterns.batchProcess(items, processarItem, 3, 300);
    
    const sucessos = resultados.filter(r => r.status === 'fulfilled').length;
    const falhas = resultados.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Processamento em lotes concluído: ${sucessos} sucessos, ${falhas} falhas`);
    
    // === PIPELINE ===
    console.log('\n🔄 Testando pipeline...');
    
    const dobrar = async (x) => {
        await AsyncPatterns.delay(100);
        return x * 2;
    };
    
    const somar10 = async (x) => {
        await AsyncPatterns.delay(100);
        return x + 10;
    };
    
    const toString = async (x) => {
        await AsyncPatterns.delay(100);
        return `Resultado: ${x}`;
    };
    
    const resultadoPipeline = await AsyncPatterns.pipeline(5, dobrar, somar10, toString);
    console.log('✅ Pipeline concluído:', resultadoPipeline);
}

setTimeout(exemplosPadroesAvancados, 10000);

// --- 2.5 Async/Await com Diferentes Estruturas ---
console.log('\n=== ASYNC/AWAIT COM DIFERENTES ESTRUTURAS ===');

// Async em diferentes contextos
class ExemplosEstruturasAsync {
    // Método de classe async
    async metodoAsync() {
        console.log('\n--- Método de Classe Async ---');
        await AsyncPatterns.delay(200);
        return 'Método de classe executado';
    }
    
    // Método estático async
    static async metodoEstaticoAsync() {
        console.log('\n--- Método Estático Async ---');
        await AsyncPatterns.delay(200);
        return 'Método estático executado';
    }
    
    // Getter async (não recomendado, mas possível)
    async getValorAsync() {
        await AsyncPatterns.delay(100);
        return 'Valor obtido assincronamente';
    }
}

// Arrow functions async
const arrowFunctionAsync = async (valor) => {
    console.log('\n--- Arrow Function Async ---');
    await AsyncPatterns.delay(200);
    return `Arrow function processou: ${valor}`;
};

// Async em callbacks (cuidado!)
function exemploAsyncEmCallbacks() {
    console.log('\n--- Async em Callbacks ---');
    
    const numeros = [1, 2, 3, 4, 5];
    
    // ❌ PROBLEMA: forEach não aguarda async
    console.log('🔄 forEach com async (problemático):');
    numeros.forEach(async (num) => {
        await AsyncPatterns.delay(100);
        console.log(`  Processado: ${num}`);
    });
    console.log('forEach "concluído" (mas não realmente)');
    
    // ✅ SOLUÇÃO: for...of ou Promise.all
    setTimeout(async () => {
        console.log('\n🔄 for...of com async (correto):');
        for (const num of numeros) {
            await AsyncPatterns.delay(100);
            console.log(`  Processado: ${num}`);
        }
        console.log('for...of realmente concluído');
    }, 1000);
    
    // ✅ SOLUÇÃO: map + Promise.all para paralelo
    setTimeout(async () => {
        console.log('\n🔄 map + Promise.all (paralelo):');
        const promises = numeros.map(async (num) => {
            await AsyncPatterns.delay(100);
            console.log(`  Processado em paralelo: ${num}`);
            return num * 2;
        });
        
        const resultados = await Promise.all(promises);
        console.log('✅ Todos processados em paralelo:', resultados);
    }, 2500);
}

// Async/await com destructuring
async function exemploDestructuring() {
    console.log('\n--- Async/Await com Destructuring ---');
    
    // Função que retorna múltiplos valores
    async function obterDadosMultiplos() {
        await AsyncPatterns.delay(300);
        return {
            usuario: { nome: 'João', idade: 30 },
            configuracoes: { tema: 'escuro', idioma: 'pt-BR' },
            estatisticas: { visitas: 1250, likes: 89 }
        };
    }
    
    // Destructuring direto no await
    const { usuario, configuracoes } = await obterDadosMultiplos();
    console.log('👤 Usuário:', usuario);
    console.log('⚙️ Configurações:', configuracoes);
    
    // Destructuring com renomeação
    const { estatisticas: stats } = await obterDadosMultiplos();
    console.log('📊 Estatísticas:', stats);
}

// Executar exemplos de estruturas
setTimeout(async () => {
    const exemplo = new ExemplosEstruturasAsync();
    
    // Testar diferentes estruturas
    const resultados = await Promise.all([
        exemplo.metodoAsync(),
        ExemplosEstruturasAsync.metodoEstaticoAsync(),
        arrowFunctionAsync('teste'),
        exemplo.getValorAsync()
    ]);
    
    console.log('✅ Resultados das estruturas:', resultados);
    
    // Testar callbacks e destructuring
    exemploAsyncEmCallbacks();
    await exemploDestructuring();
}, 15000);

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Processamento de Dados ---
console.log('\n=== EXERCÍCIO 1: SISTEMA DE PROCESSAMENTO ===');

class SistemaProcessamentoDados {
    constructor(options = {}) {
        this.maxConcorrencia = options.maxConcorrencia || 3;
        this.retryAttempts = options.retryAttempts || 3;
        this.timeoutMs = options.timeoutMs || 5000;
        this.delayBetweenBatches = options.delayBetweenBatches || 1000;
        
        this.estatisticas = {
            processados: 0,
            sucessos: 0,
            falhas: 0,
            tempoTotal: 0
        };
    }
    
    // Processar um único item
    async processarItem(item) {
        const startTime = Date.now();
        
        try {
            // Simular processamento complexo
            await this.simularProcessamento(item);
            
            const resultado = {
                id: item.id,
                original: item.dados,
                processado: this.transformarDados(item.dados),
                timestamp: new Date(),
                tempoProcessamento: Date.now() - startTime
            };
            
            this.estatisticas.sucessos++;
            console.log(`✅ Item ${item.id} processado em ${resultado.tempoProcessamento}ms`);
            
            return resultado;
            
        } catch (error) {
            this.estatisticas.falhas++;
            console.error(`❌ Falha ao processar item ${item.id}:`, error.message);
            throw error;
        } finally {
            this.estatisticas.processados++;
            this.estatisticas.tempoTotal += Date.now() - startTime;
        }
    }
    
    // Simular processamento com possível falha
    async simularProcessamento(item) {
        const operacao = async () => {
            // Simular delay variável
            const delay = Math.random() * 1000 + 500;
            await AsyncPatterns.delay(delay);
            
            // Simular possível falha (10% chance)
            if (Math.random() < 0.1) {
                throw new Error('Falha aleatória no processamento');
            }
            
            return true;
        };
        
        // Aplicar timeout e retry
        const operacaoComTimeout = () => AsyncPatterns.timeout(operacao(), this.timeoutMs);
        return await AsyncPatterns.retry(operacaoComTimeout, this.retryAttempts, 500, 2);
    }
    
    // Transformar dados
    transformarDados(dados) {
        return {
            ...dados,
            processadoEm: new Date(),
            hash: this.gerarHash(JSON.stringify(dados)),
            validado: this.validarDados(dados)
        };
    }
    
    // Gerar hash simples
    gerarHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converter para 32bit
        }
        return Math.abs(hash).toString(16);
    }
    
    // Validar dados
    validarDados(dados) {
        return dados && 
               typeof dados.nome === 'string' && 
               typeof dados.valor === 'number' &&
               dados.valor >= 0;
    }
    
    // Processar lote de itens
    async processarLote(itens) {
        console.log(`\n📦 Processando lote de ${itens.length} itens...`);
        
        const startTime = Date.now();
        
        try {
            // Processar em lotes com limite de concorrência
            const resultados = await AsyncPatterns.batchProcess(
                itens,
                (item) => this.processarItem(item),
                this.maxConcorrencia,
                this.delayBetweenBatches
            );
            
            const sucessos = resultados.filter(r => r.status === 'fulfilled');
            const falhas = resultados.filter(r => r.status === 'rejected');
            
            const tempoTotal = Date.now() - startTime;
            
            console.log(`\n📊 Lote processado em ${tempoTotal}ms:`);
            console.log(`  ✅ Sucessos: ${sucessos.length}`);
            console.log(`  ❌ Falhas: ${falhas.length}`);
            console.log(`  📈 Taxa de sucesso: ${(sucessos.length / itens.length * 100).toFixed(1)}%`);
            
            return {
                sucessos: sucessos.map(r => r.value),
                falhas: falhas.map(r => ({ error: r.reason.message })),
                estatisticas: {
                    total: itens.length,
                    sucessos: sucessos.length,
                    falhas: falhas.length,
                    tempoTotal,
                    tempoMedio: tempoTotal / itens.length
                }
            };
            
        } catch (error) {
            console.error('❌ Erro crítico no processamento do lote:', error.message);
            throw error;
        }
    }
    
    // Processar múltiplos lotes
    async processarMultiplosLotes(todosItens, tamanheLote = 10) {
        console.log(`\n🔄 Iniciando processamento de ${todosItens.length} itens em lotes de ${tamanheLote}...`);
        
        const lotes = [];
        for (let i = 0; i < todosItens.length; i += tamanheLote) {
            lotes.push(todosItens.slice(i, i + tamanheLote));
        }
        
        console.log(`📦 Total de lotes: ${lotes.length}`);
        
        const resultadosLotes = [];
        
        for (let i = 0; i < lotes.length; i++) {
            console.log(`\n🔄 Processando lote ${i + 1}/${lotes.length}...`);
            
            try {
                const resultado = await this.processarLote(lotes[i]);
                resultadosLotes.push(resultado);
                
            } catch (error) {
                console.error(`❌ Lote ${i + 1} falhou completamente:`, error.message);
                resultadosLotes.push({
                    sucessos: [],
                    falhas: lotes[i].map(item => ({ 
                        id: item.id, 
                        error: error.message 
                    })),
                    estatisticas: {
                        total: lotes[i].length,
                        sucessos: 0,
                        falhas: lotes[i].length,
                        tempoTotal: 0,
                        tempoMedio: 0
                    }
                });
            }
            
            // Delay entre lotes se não for o último
            if (i < lotes.length - 1) {
                console.log(`⏱️ Aguardando ${this.delayBetweenBatches}ms antes do próximo lote...`);
                await AsyncPatterns.delay(this.delayBetweenBatches);
            }
        }
        
        return this.consolidarResultados(resultadosLotes);
    }
    
    // Consolidar resultados de todos os lotes
    consolidarResultados(resultadosLotes) {
        const consolidado = {
            sucessos: [],
            falhas: [],
            estatisticas: {
                totalItens: 0,
                totalSucessos: 0,
                totalFalhas: 0,
                tempoTotalProcessamento: 0,
                lotes: resultadosLotes.length
            }
        };
        
        resultadosLotes.forEach(resultado => {
            consolidado.sucessos.push(...resultado.sucessos);
            consolidado.falhas.push(...resultado.falhas);
            
            consolidado.estatisticas.totalItens += resultado.estatisticas.total;
            consolidado.estatisticas.totalSucessos += resultado.estatisticas.sucessos;
            consolidado.estatisticas.totalFalhas += resultado.estatisticas.falhas;
            consolidado.estatisticas.tempoTotalProcessamento += resultado.estatisticas.tempoTotal;
        });
        
        consolidado.estatisticas.taxaSucesso = 
            (consolidado.estatisticas.totalSucessos / consolidado.estatisticas.totalItens * 100).toFixed(1) + '%';
        
        consolidado.estatisticas.tempoMedioItem = 
            Math.round(consolidado.estatisticas.tempoTotalProcessamento / consolidado.estatisticas.totalItens);
        
        return consolidado;
    }
    
    // Obter estatísticas do sistema
    obterEstatisticas() {
        return {
            ...this.estatisticas,
            tempoMedio: this.estatisticas.processados > 0 
                ? Math.round(this.estatisticas.tempoTotal / this.estatisticas.processados)
                : 0,
            taxaSucesso: this.estatisticas.processados > 0
                ? (this.estatisticas.sucessos / this.estatisticas.processados * 100).toFixed(1) + '%'
                : '0%'
        };
    }
}

// Exemplo de uso do sistema de processamento
async function exemploSistemaProcessamento() {
    console.log('\n--- Sistema de Processamento de Dados ---');
    
    const sistema = new SistemaProcessamentoDados({
        maxConcorrencia: 2,
        retryAttempts: 2,
        timeoutMs: 3000,
        delayBetweenBatches: 500
    });
    
    // Gerar dados de teste
    const itens = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        dados: {
            nome: `Item ${i + 1}`,
            valor: Math.random() * 1000,
            categoria: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
            prioridade: Math.floor(Math.random() * 5) + 1
        }
    }));
    
    try {
        console.log(`🚀 Iniciando processamento de ${itens.length} itens...`);
        
        const resultado = await sistema.processarMultiplosLotes(itens, 8);
        
        console.log('\n🏁 PROCESSAMENTO CONCLUÍDO!');
        console.log('📊 Resumo final:');
        console.log(`  📦 Total de itens: ${resultado.estatisticas.totalItens}`);
        console.log(`  ✅ Sucessos: ${resultado.estatisticas.totalSucessos}`);
        console.log(`  ❌ Falhas: ${resultado.estatisticas.totalFalhas}`);
        console.log(`  📈 Taxa de sucesso: ${resultado.estatisticas.taxaSucesso}`);
        console.log(`  ⏱️ Tempo médio por item: ${resultado.estatisticas.tempoMedioItem}ms`);
        console.log(`  🔄 Lotes processados: ${resultado.estatisticas.lotes}`);
        
        // Mostrar alguns exemplos de sucessos
        if (resultado.sucessos.length > 0) {
            console.log('\n✅ Exemplos de itens processados com sucesso:');
            resultado.sucessos.slice(0, 3).forEach(item => {
                console.log(`  📄 Item ${item.id}: ${item.processado.validado ? '✓' : '✗'} validado`);
            });
        }
        
        // Mostrar alguns exemplos de falhas
        if (resultado.falhas.length > 0) {
            console.log('\n❌ Exemplos de falhas:');
            resultado.falhas.slice(0, 3).forEach(falha => {
                console.log(`  ⚠️ ${falha.id ? `Item ${falha.id}` : 'Item'}: ${falha.error}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erro crítico no sistema:', error.message);
    }
}

setTimeout(exemploSistemaProcessamento, 20000);

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasAsyncAwait = {
    boasPraticas: {
        // Sempre usar try/catch
        errorHandling: `
            // ✅ Bom - Sempre tratar erros
            async function operacao() {
                try {
                    const resultado = await operacaoAssincrona();
                    return resultado;
                } catch (error) {
                    console.error('Erro:', error.message);
                    throw error; // Re-throw se necessário
                }
            }
        `,
        
        // Evitar await desnecessário
        returnPromise: `
            // ❌ Evitar - await desnecessário
            async function ruim() {
                return await operacaoAssincrona();
            }
            
            // ✅ Bom - retornar Promise diretamente
            async function bom() {
                return operacaoAssincrona();
            }
            
            // ✅ Bom - await apenas quando necessário
            async function bomComProcessamento() {
                const resultado = await operacaoAssincrona();
                return processarResultado(resultado);
            }
        `,
        
        // Usar Promise.all para operações paralelas
        paralelismo: `
            // ❌ Evitar - sequencial desnecessário
            async function sequencial() {
                const a = await operacaoA();
                const b = await operacaoB();
                const c = await operacaoC();
                return [a, b, c];
            }
            
            // ✅ Bom - paralelo quando possível
            async function paralelo() {
                const [a, b, c] = await Promise.all([
                    operacaoA(),
                    operacaoB(),
                    operacaoC()
                ]);
                return [a, b, c];
            }
        `
    },
    
    performance: {
        // Evitar await em loops
        loops: `
            // ❌ Evitar - await em forEach
            async function ruim(items) {
                items.forEach(async (item) => {
                    await processarItem(item); // Não aguarda!
                });
            }
            
            // ✅ Bom - for...of para sequencial
            async function bomSequencial(items) {
                for (const item of items) {
                    await processarItem(item);
                }
            }
            
            // ✅ Bom - Promise.all para paralelo
            async function bomParalelo(items) {
                await Promise.all(
                    items.map(item => processarItem(item))
                );
            }
        `,
        
        // Controlar concorrência
        concorrencia: `
            // ✅ Bom - processar em lotes
            async function processarEmLotes(items, batchSize = 5) {
                for (let i = 0; i < items.length; i += batchSize) {
                    const batch = items.slice(i, i + batchSize);
                    await Promise.all(
                        batch.map(item => processarItem(item))
                    );
                }
            }
        `
    },
    
    debugging: {
        // Usar nomes descritivos
        nomes: `
            // ✅ Bom - nomes descritivos
            async function buscarDadosUsuarioCompletos(userId) {
                const usuario = await buscarUsuario(userId);
                const perfil = await buscarPerfil(userId);
                return { usuario, perfil };
            }
        `,
        
        // Adicionar logs úteis
        logging: `
            // ✅ Bom - logs informativos
            async function operacaoComLog(dados) {
                console.log('Iniciando operação com:', dados.id);
                
                try {
                    const resultado = await processarDados(dados);
                    console.log('Operação concluída:', resultado.id);
                    return resultado;
                } catch (error) {
                    console.error('Operação falhou:', error.message);
                    throw error;
                }
            }
        `
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasAsyncAwait = {
    documentacao: [
        'MDN - async function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
        'MDN - await: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await',
        'JavaScript.info - Async/await: https://javascript.info/async-await',
        'TC39 - Async Functions: https://tc39.es/ecma262/#sec-async-function-definitions'
    ],
    
    proximosTopicos: [
        '04-fetch-api.js - Fetch API e requisições HTTP',
        '09-ES6-Plus - Async iterators e for await...of',
        '10-Padroes - Padrões assíncronos avançados',
        '11-Qualidade - Testes com async/await'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de fila de tarefas',
        'Criar API client com retry automático',
        'Desenvolver sistema de cache assíncrono',
        'Construir worker pool para processamento'
    ]
};

console.log('Referências:', referenciasAsyncAwait.documentacao);
console.log('Próximos tópicos:', referenciasAsyncAwait.proximosTopicos);
console.log('Exercícios adicionais:', referenciasAsyncAwait.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - ASYNC/AWAIT
===========================================

✅ CONCEITOS APRENDIDOS:
• Sintaxe async/await
• Conversão de Promises para async/await
• Tratamento de erros com try/catch/finally
• Execução sequencial vs paralela
• Padrões avançados (retry, timeout, circuit breaker)

✅ TÉCNICAS DOMINADAS:
• Controle de fluxo assíncrono
• Processamento em lotes
• Rate limiting e throttling
• Pipeline de transformações
• Debugging de código assíncrono

✅ PROJETOS DESENVOLVIDOS:
• Sistema de processamento de dados
• Utilitários assíncronos (AsyncPatterns)
• Padrões de resiliência

🎯 PRÓXIMO PASSO:
Continue para 04-fetch-api.js para aprender
como usar async/await com requisições HTTP
e APIs reais!

===========================================
*/