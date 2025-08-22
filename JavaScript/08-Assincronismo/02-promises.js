/*
===========================================
    MÓDULO 08 - ASSINCRONISMO
    Aula 02: Promises (Promessas)
===========================================

Objetivos de Aprendizagem:
✓ Compreender o conceito e estados das Promises
✓ Dominar then, catch e finally
✓ Implementar Promise.all, Promise.race e outros métodos
✓ Criar Promises customizadas
✓ Resolver problemas de callback hell com Promises
✓ Implementar padrões avançados com Promises
*/

// ===========================================
// 1. TEORIA: PROMISES E ESTADOS
// ===========================================

/*
PROMISES EM JAVASCRIPT:

1. CONCEITO:
   - Objeto que representa eventual conclusão/falha de operação assíncrona
   - Substituto mais elegante para callbacks
   - Permite encadeamento (chaining)
   - Melhor tratamento de erros

2. ESTADOS DAS PROMISES:
   - Pending: Estado inicial, nem fulfilled nem rejected
   - Fulfilled: Operação completada com sucesso
   - Rejected: Operação falhou
   - Settled: Promise foi fulfilled ou rejected

3. MÉTODOS PRINCIPAIS:
   - then(): Executado quando fulfilled
   - catch(): Executado quando rejected
   - finally(): Executado sempre, independente do resultado

4. MÉTODOS ESTÁTICOS:
   - Promise.resolve(): Cria Promise resolvida
   - Promise.reject(): Cria Promise rejeitada
   - Promise.all(): Aguarda todas as Promises
   - Promise.race(): Primeira Promise a resolver
   - Promise.allSettled(): Aguarda todas, independente do resultado
   - Promise.any(): Primeira Promise a ser fulfilled

5. VANTAGENS SOBRE CALLBACKS:
   - Evita callback hell
   - Melhor tratamento de erros
   - Composição mais fácil
   - Código mais legível
   - Suporte nativo a encadeamento
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Criação e Uso Básico de Promises ---
console.log('=== CRIAÇÃO E USO BÁSICO DE PROMISES ===');

// Criando uma Promise simples
function exemploPromiseBasica() {
    console.log('\n--- Promise Básica ---');
    
    // Criando Promise que resolve
    const promiseSimples = new Promise((resolve, reject) => {
        setTimeout(() => {
            const sucesso = Math.random() > 0.3; // 70% chance de sucesso
            
            if (sucesso) {
                resolve('Operação bem-sucedida!');
            } else {
                reject(new Error('Operação falhou!'));
            }
        }, 1000);
    });
    
    // Consumindo a Promise
    promiseSimples
        .then(resultado => {
            console.log('✅ Sucesso:', resultado);
        })
        .catch(erro => {
            console.log('❌ Erro:', erro.message);
        })
        .finally(() => {
            console.log('🏁 Operação finalizada');
        });
}

exemploPromiseBasica();

// Promise com diferentes tipos de dados
function exemploPromiseComDados() {
    console.log('\n--- Promise com Diferentes Dados ---');
    
    // Promise que retorna objeto
    function buscarUsuario(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id <= 0) {
                    reject(new Error('ID inválido'));
                    return;
                }
                
                const usuario = {
                    id: id,
                    nome: `Usuário ${id}`,
                    email: `usuario${id}@email.com`,
                    criadoEm: new Date()
                };
                
                resolve(usuario);
            }, 500);
        });
    }
    
    // Promise que retorna array
    function buscarPostagens(usuarioId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const postagens = [
                    { id: 1, titulo: 'Primeira postagem', usuarioId },
                    { id: 2, titulo: 'Segunda postagem', usuarioId },
                    { id: 3, titulo: 'Terceira postagem', usuarioId }
                ];
                resolve(postagens);
            }, 300);
        });
    }
    
    // Usando as Promises
    buscarUsuario(1)
        .then(usuario => {
            console.log('👤 Usuário encontrado:', usuario);
            return buscarPostagens(usuario.id); // Retorna nova Promise
        })
        .then(postagens => {
            console.log('📝 Postagens encontradas:', postagens);
        })
        .catch(erro => {
            console.error('❌ Erro na operação:', erro.message);
        });
    
    // Testando com ID inválido
    buscarUsuario(-1)
        .then(usuario => {
            console.log('Usuário:', usuario);
        })
        .catch(erro => {
            console.error('❌ Erro esperado:', erro.message);
        });
}

setTimeout(exemploPromiseComDados, 1500);

// --- 2.2 Encadeamento de Promises ---
console.log('\n=== ENCADEAMENTO DE PROMISES ===');

function exemploEncadeamento() {
    console.log('\n--- Encadeamento de Promises ---');
    
    // Simulando operações sequenciais
    function etapa1() {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('🔄 Etapa 1 concluída');
                resolve('Dados da etapa 1');
            }, 400);
        });
    }
    
    function etapa2(dadosAnteriores) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('🔄 Etapa 2 concluída com:', dadosAnteriores);
                resolve(`${dadosAnteriores} + Etapa 2`);
            }, 300);
        });
    }
    
    function etapa3(dadosAnteriores) {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log('🔄 Etapa 3 concluída com:', dadosAnteriores);
                resolve(`${dadosAnteriores} + Etapa 3`);
            }, 200);
        });
    }
    
    // Encadeamento linear
    etapa1()
        .then(resultado1 => etapa2(resultado1))
        .then(resultado2 => etapa3(resultado2))
        .then(resultadoFinal => {
            console.log('✅ Processo completo:', resultadoFinal);
        })
        .catch(erro => {
            console.error('❌ Erro no processo:', erro.message);
        });
    
    // Encadeamento com transformação de dados
    function processarNumeros() {
        return Promise.resolve([1, 2, 3, 4, 5])
            .then(numeros => {
                console.log('📊 Números originais:', numeros);
                return numeros.map(n => n * 2);
            })
            .then(numerosDobrados => {
                console.log('📊 Números dobrados:', numerosDobrados);
                return numerosDobrados.filter(n => n > 5);
            })
            .then(numerosFiltrados => {
                console.log('📊 Números filtrados:', numerosFiltrados);
                return numerosFiltrados.reduce((acc, n) => acc + n, 0);
            })
            .then(soma => {
                console.log('📊 Soma final:', soma);
                return soma;
            });
    }
    
    processarNumeros()
        .then(resultado => {
            console.log('✅ Processamento concluído:', resultado);
        });
}

setTimeout(exemploEncadeamento, 3000);

// --- 2.3 Métodos Estáticos das Promises ---
console.log('\n=== MÉTODOS ESTÁTICOS DAS PROMISES ===');

function exemploMetodosEstaticos() {
    console.log('\n--- Métodos Estáticos ---');
    
    // Criando Promises de teste
    function criarPromise(nome, delay, shouldReject = false) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (shouldReject) {
                    reject(new Error(`${nome} falhou`));
                } else {
                    resolve(`${nome} concluída`);
                }
            }, delay);
        });
    }
    
    // === Promise.all ===
    console.log('\n🔄 Testando Promise.all...');
    
    const promisesParaAll = [
        criarPromise('Operação A', 300),
        criarPromise('Operação B', 500),
        criarPromise('Operação C', 200)
    ];
    
    Promise.all(promisesParaAll)
        .then(resultados => {
            console.log('✅ Promise.all - Todos os resultados:', resultados);
        })
        .catch(erro => {
            console.error('❌ Promise.all - Erro:', erro.message);
        });
    
    // Promise.all com falha
    setTimeout(() => {
        console.log('\n🔄 Testando Promise.all com falha...');
        
        const promisesComFalha = [
            criarPromise('Operação 1', 200),
            criarPromise('Operação 2', 300, true), // Esta vai falhar
            criarPromise('Operação 3', 400)
        ];
        
        Promise.all(promisesComFalha)
            .then(resultados => {
                console.log('Resultados:', resultados);
            })
            .catch(erro => {
                console.error('❌ Promise.all falhou como esperado:', erro.message);
            });
    }, 1000);
    
    // === Promise.race ===
    setTimeout(() => {
        console.log('\n🏁 Testando Promise.race...');
        
        const promisesParaRace = [
            criarPromise('Lenta', 800),
            criarPromise('Média', 400),
            criarPromise('Rápida', 200) // Esta deve ganhar
        ];
        
        Promise.race(promisesParaRace)
            .then(resultado => {
                console.log('🏆 Promise.race - Primeira a terminar:', resultado);
            })
            .catch(erro => {
                console.error('❌ Promise.race - Erro:', erro.message);
            });
    }, 2000);
    
    // === Promise.allSettled ===
    setTimeout(() => {
        console.log('\n📊 Testando Promise.allSettled...');
        
        const promisesMistas = [
            criarPromise('Sucesso 1', 200),
            criarPromise('Falha 1', 300, true),
            criarPromise('Sucesso 2', 400),
            criarPromise('Falha 2', 100, true)
        ];
        
        Promise.allSettled(promisesMistas)
            .then(resultados => {
                console.log('📋 Promise.allSettled - Todos os resultados:');
                resultados.forEach((resultado, index) => {
                    if (resultado.status === 'fulfilled') {
                        console.log(`  ✅ ${index}: ${resultado.value}`);
                    } else {
                        console.log(`  ❌ ${index}: ${resultado.reason.message}`);
                    }
                });
            });
    }, 3000);
    
    // === Promise.any ===
    setTimeout(() => {
        console.log('\n🎯 Testando Promise.any...');
        
        const promisesParaAny = [
            criarPromise('Primeira (falha)', 100, true),
            criarPromise('Segunda (falha)', 200, true),
            criarPromise('Terceira (sucesso)', 300), // Primeira a ter sucesso
            criarPromise('Quarta (sucesso)', 400)
        ];
        
        Promise.any(promisesParaAny)
            .then(resultado => {
                console.log('🎯 Promise.any - Primeira bem-sucedida:', resultado);
            })
            .catch(erro => {
                console.error('❌ Promise.any - Todas falharam:', erro.message);
            });
    }, 4000);
}

setTimeout(exemploMetodosEstaticos, 5000);

// --- 2.4 Tratamento Avançado de Erros ---
console.log('\n=== TRATAMENTO AVANÇADO DE ERROS ===');

function exemploTratamentoErros() {
    console.log('\n--- Tratamento Avançado de Erros ---');
    
    // Diferentes tipos de erro
    function operacaoComTiposDeErro(tipo) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                switch (tipo) {
                    case 'sucesso':
                        resolve('Operação bem-sucedida');
                        break;
                    case 'rede':
                        reject(new Error('Erro de rede'));
                        break;
                    case 'autenticacao':
                        const erro = new Error('Não autorizado');
                        erro.code = 401;
                        reject(erro);
                        break;
                    case 'validacao':
                        const erroValidacao = new Error('Dados inválidos');
                        erroValidacao.code = 400;
                        erroValidacao.details = ['Campo obrigatório', 'Formato inválido'];
                        reject(erroValidacao);
                        break;
                    default:
                        reject(new Error('Erro desconhecido'));
                }
            }, 300);
        });
    }
    
    // Tratamento específico por tipo de erro
    function tratarErroEspecifico(tipo) {
        return operacaoComTiposDeErro(tipo)
            .catch(erro => {
                console.log(`\n🔍 Tratando erro do tipo '${tipo}':`);
                
                if (erro.code === 401) {
                    console.log('🔐 Erro de autenticação - redirecionando para login');
                    // Lógica de redirecionamento
                    throw new Error('Redirecionamento necessário');
                } else if (erro.code === 400) {
                    console.log('📝 Erro de validação:', erro.details);
                    // Lógica de validação
                    return 'Dados corrigidos'; // Recuperação
                } else if (erro.message.includes('rede')) {
                    console.log('🌐 Erro de rede - tentando novamente...');
                    // Lógica de retry
                    return operacaoComTiposDeErro('sucesso'); // Retry
                } else {
                    console.log('❓ Erro desconhecido:', erro.message);
                    throw erro; // Re-throw
                }
            })
            .then(resultado => {
                console.log(`✅ Resultado final para '${tipo}':`, resultado);
                return resultado;
            })
            .catch(erro => {
                console.log(`❌ Erro final para '${tipo}':`, erro.message);
            });
    }
    
    // Testar diferentes tipos de erro
    ['sucesso', 'rede', 'autenticacao', 'validacao', 'desconhecido'].forEach((tipo, index) => {
        setTimeout(() => tratarErroEspecifico(tipo), index * 500);
    });
}

setTimeout(exemploTratamentoErros, 10000);

// --- 2.5 Padrões Avançados com Promises ---
console.log('\n=== PADRÕES AVANÇADOS COM PROMISES ===');

class PromiseUtils {
    // Delay com Promise
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Timeout para Promise
    static timeout(promise, ms) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timeout de ${ms}ms excedido`)), ms);
        });
        
        return Promise.race([promise, timeoutPromise]);
    }
    
    // Retry com backoff exponencial
    static retry(fn, attempts = 3, delay = 1000, backoff = 2) {
        return new Promise((resolve, reject) => {
            let currentAttempt = 0;
            
            function attempt() {
                currentAttempt++;
                
                fn()
                    .then(resolve)
                    .catch(erro => {
                        if (currentAttempt >= attempts) {
                            reject(new Error(`Falhou após ${attempts} tentativas: ${erro.message}`));
                            return;
                        }
                        
                        const nextDelay = delay * Math.pow(backoff, currentAttempt - 1);
                        console.log(`Tentativa ${currentAttempt} falhou, tentando novamente em ${nextDelay}ms...`);
                        
                        setTimeout(attempt, nextDelay);
                    });
            }
            
            attempt();
        });
    }
    
    // Executar com limite de concorrência
    static concurrencyLimit(promises, limit) {
        return new Promise((resolve, reject) => {
            let index = 0;
            let running = 0;
            let completed = 0;
            const results = new Array(promises.length);
            let hasError = false;
            
            function executeNext() {
                while (running < limit && index < promises.length && !hasError) {
                    const currentIndex = index;
                    const promise = promises[index];
                    index++;
                    running++;
                    
                    promise
                        .then(result => {
                            if (hasError) return;
                            
                            results[currentIndex] = result;
                            running--;
                            completed++;
                            
                            if (completed === promises.length) {
                                resolve(results);
                            } else {
                                executeNext();
                            }
                        })
                        .catch(error => {
                            hasError = true;
                            reject(error);
                        });
                }
            }
            
            executeNext();
        });
    }
    
    // Pipeline de transformações
    static pipeline(value, ...functions) {
        return functions.reduce((promise, fn) => {
            return promise.then(fn);
        }, Promise.resolve(value));
    }
    
    // Memoização de Promises
    static memoize(fn) {
        const cache = new Map();
        
        return function(...args) {
            const key = JSON.stringify(args);
            
            if (cache.has(key)) {
                console.log('📋 Cache hit para:', key);
                return Promise.resolve(cache.get(key));
            }
            
            console.log('🔄 Cache miss para:', key);
            return fn(...args)
                .then(result => {
                    cache.set(key, result);
                    return result;
                });
        };
    }
    
    // Debounce para Promises
    static debounce(fn, delay) {
        let timeoutId;
        let latestResolve;
        let latestReject;
        
        return function(...args) {
            return new Promise((resolve, reject) => {
                latestResolve = resolve;
                latestReject = reject;
                
                clearTimeout(timeoutId);
                
                timeoutId = setTimeout(() => {
                    fn(...args)
                        .then(latestResolve)
                        .catch(latestReject);
                }, delay);
            });
        };
    }
}

// Exemplos de uso dos padrões avançados
function exemplosPadroesAvancados() {
    console.log('\n--- Padrões Avançados ---');
    
    // === DELAY ===
    console.log('\n⏱️ Testando delay...');
    PromiseUtils.delay(1000)
        .then(() => {
            console.log('✅ Delay de 1 segundo concluído');
        });
    
    // === TIMEOUT ===
    setTimeout(() => {
        console.log('\n⏰ Testando timeout...');
        
        const operacaoLenta = new Promise(resolve => {
            setTimeout(() => resolve('Operação concluída'), 2000);
        });
        
        PromiseUtils.timeout(operacaoLenta, 1500)
            .then(resultado => {
                console.log('✅ Resultado:', resultado);
            })
            .catch(erro => {
                console.log('❌ Timeout como esperado:', erro.message);
            });
    }, 1500);
    
    // === RETRY ===
    setTimeout(() => {
        console.log('\n🔄 Testando retry...');
        
        let tentativas = 0;
        const operacaoComFalha = () => {
            tentativas++;
            return new Promise((resolve, reject) => {
                if (tentativas < 3) {
                    reject(new Error(`Falha na tentativa ${tentativas}`));
                } else {
                    resolve(`Sucesso na tentativa ${tentativas}`);
                }
            });
        };
        
        PromiseUtils.retry(operacaoComFalha, 5, 500, 1.5)
            .then(resultado => {
                console.log('✅ Retry bem-sucedido:', resultado);
            })
            .catch(erro => {
                console.log('❌ Retry falhou:', erro.message);
            });
    }, 3000);
    
    // === PIPELINE ===
    setTimeout(() => {
        console.log('\n🔄 Testando pipeline...');
        
        const dobrar = x => Promise.resolve(x * 2);
        const somar10 = x => Promise.resolve(x + 10);
        const toString = x => Promise.resolve(`Resultado: ${x}`);
        
        PromiseUtils.pipeline(5, dobrar, somar10, toString)
            .then(resultado => {
                console.log('✅ Pipeline concluído:', resultado);
            });
    }, 5000);
    
    // === MEMOIZAÇÃO ===
    setTimeout(() => {
        console.log('\n📋 Testando memoização...');
        
        const operacaoCaraOriginal = (n) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    console.log(`Calculando fatorial de ${n}...`);
                    let resultado = 1;
                    for (let i = 1; i <= n; i++) {
                        resultado *= i;
                    }
                    resolve(resultado);
                }, 500);
            });
        };
        
        const operacaoCara = PromiseUtils.memoize(operacaoCaraOriginal);
        
        // Primeira chamada - cache miss
        operacaoCara(5)
            .then(resultado => {
                console.log('✅ Primeira chamada:', resultado);
                
                // Segunda chamada - cache hit
                return operacaoCara(5);
            })
            .then(resultado => {
                console.log('✅ Segunda chamada (cache):', resultado);
            });
    }, 6000);
}

setTimeout(exemplosPadroesAvancados, 13000);

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Cache com Promises ---
console.log('\n=== EXERCÍCIO 1: SISTEMA DE CACHE ===');

class CacheComPromises {
    constructor(options = {}) {
        this.cache = new Map();
        this.ttl = options.ttl || 60000; // 1 minuto padrão
        this.maxSize = options.maxSize || 100;
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            evictions: 0
        };
    }
    
    // Obter valor do cache ou executar função
    get(key, fetchFunction) {
        const cached = this.cache.get(key);
        
        // Verificar se existe e não expirou
        if (cached && Date.now() < cached.expiry) {
            this.stats.hits++;
            console.log(`📋 Cache HIT para: ${key}`);
            return Promise.resolve(cached.value);
        }
        
        // Cache miss - buscar dados
        this.stats.misses++;
        console.log(`🔄 Cache MISS para: ${key}`);
        
        return fetchFunction()
            .then(value => {
                this.set(key, value);
                return value;
            })
            .catch(error => {
                console.error(`❌ Erro ao buscar ${key}:`, error.message);
                throw error;
            });
    }
    
    // Definir valor no cache
    set(key, value) {
        // Verificar limite de tamanho
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }
        
        this.cache.set(key, {
            value,
            expiry: Date.now() + this.ttl,
            accessTime: Date.now()
        });
        
        this.stats.sets++;
        console.log(`💾 Cache SET para: ${key}`);
    }
    
    // Remover entrada mais antiga
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Infinity;
        
        for (const [key, entry] of this.cache) {
            if (entry.accessTime < oldestTime) {
                oldestTime = entry.accessTime;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.stats.evictions++;
            console.log(`🗑️ Cache EVICT: ${oldestKey}`);
        }
    }
    
    // Invalidar entrada específica
    invalidate(key) {
        const deleted = this.cache.delete(key);
        if (deleted) {
            console.log(`❌ Cache INVALIDATE: ${key}`);
        }
        return deleted;
    }
    
    // Limpar cache expirado
    cleanup() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, entry] of this.cache) {
            if (now >= entry.expiry) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache CLEANUP: ${cleaned} entradas removidas`);
        }
        
        return cleaned;
    }
    
    // Obter estatísticas
    getStats() {
        const hitRate = this.stats.hits / (this.stats.hits + this.stats.misses) * 100;
        
        return {
            ...this.stats,
            hitRate: isNaN(hitRate) ? 0 : hitRate.toFixed(2) + '%',
            cacheSize: this.cache.size
        };
    }
    
    // Limpar todo o cache
    clear() {
        const size = this.cache.size;
        this.cache.clear();
        console.log(`🗑️ Cache CLEAR: ${size} entradas removidas`);
    }
}

// Exemplo de uso do sistema de cache
function exemploSistemaCache() {
    console.log('\n--- Sistema de Cache com Promises ---');
    
    const cache = new CacheComPromises({
        ttl: 3000, // 3 segundos
        maxSize: 5
    });
    
    // Simular função de busca de dados
    function buscarDadosDoServidor(id) {
        return new Promise((resolve, reject) => {
            const delay = Math.random() * 1000 + 500; // 500-1500ms
            
            setTimeout(() => {
                if (Math.random() < 0.1) { // 10% chance de erro
                    reject(new Error(`Erro ao buscar dados para ID ${id}`));
                    return;
                }
                
                const dados = {
                    id,
                    nome: `Item ${id}`,
                    valor: Math.random() * 1000,
                    timestamp: new Date()
                };
                
                console.log(`🌐 Dados buscados do servidor para ID ${id}`);
                resolve(dados);
            }, delay);
        });
    }
    
    // Função wrapper que usa cache
    function obterDados(id) {
        return cache.get(`item_${id}`, () => buscarDadosDoServidor(id));
    }
    
    // Testar o sistema
    console.log('\n🔄 Iniciando testes do cache...');
    
    // Primeira busca - cache miss
    obterDados(1)
        .then(dados => {
            console.log('✅ Dados obtidos:', dados);
            console.log('📊 Stats:', cache.getStats());
            
            // Segunda busca do mesmo item - cache hit
            return obterDados(1);
        })
        .then(dados => {
            console.log('✅ Dados obtidos (cache):', dados);
            console.log('📊 Stats:', cache.getStats());
        })
        .catch(erro => {
            console.error('❌ Erro:', erro.message);
        });
    
    // Buscar vários itens
    setTimeout(() => {
        console.log('\n🔄 Buscando múltiplos itens...');
        
        const promises = [2, 3, 4, 5, 6, 7].map(id => obterDados(id));
        
        Promise.allSettled(promises)
            .then(resultados => {
                console.log('📊 Resultados das buscas:');
                resultados.forEach((resultado, index) => {
                    const id = index + 2;
                    if (resultado.status === 'fulfilled') {
                        console.log(`  ✅ ID ${id}: ${resultado.value.nome}`);
                    } else {
                        console.log(`  ❌ ID ${id}: ${resultado.reason.message}`);
                    }
                });
                
                console.log('📊 Stats finais:', cache.getStats());
            });
    }, 2000);
    
    // Testar expiração do cache
    setTimeout(() => {
        console.log('\n⏰ Testando expiração do cache...');
        
        obterDados(1) // Deve buscar novamente pois expirou
            .then(dados => {
                console.log('✅ Dados após expiração:', dados);
                console.log('📊 Stats após expiração:', cache.getStats());
            });
    }, 4000);
    
    // Cleanup automático
    setInterval(() => {
        cache.cleanup();
    }, 5000);
}

setTimeout(exemploSistemaCache, 20000);

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasPromises = {
    boasPraticas: {
        // Sempre retornar Promises em chains
        chaining: `
            // ✅ Bom - Retornar Promise
            promise
                .then(resultado => {
                    return outraPromise(resultado); // Retorna Promise
                })
                .then(novoResultado => {
                    console.log(novoResultado);
                });
            
            // ❌ Evitar - Não retornar Promise
            promise
                .then(resultado => {
                    outraPromise(resultado); // Não retorna!
                })
                .then(novoResultado => {
                    console.log(novoResultado); // undefined!
                });
        `,
        
        // Tratar erros adequadamente
        errorHandling: `
            // ✅ Bom - Catch específico
            promise
                .then(resultado => processarResultado(resultado))
                .catch(erro => {
                    if (erro.code === 'NETWORK_ERROR') {
                        return tentarNovamente();
                    }
                    throw erro; // Re-throw outros erros
                })
                .catch(erro => {
                    console.error('Erro final:', erro);
                });
        `,
        
        // Evitar Promise constructor desnecessário
        antipattern: `
            // ❌ Evitar - Promise constructor desnecessário
            function ruim() {
                return new Promise((resolve, reject) => {
                    outraPromise()
                        .then(resolve)
                        .catch(reject);
                });
            }
            
            // ✅ Bom - Retornar Promise diretamente
            function bom() {
                return outraPromise();
            }
        `
    },
    
    performance: {
        // Usar Promise.all para operações paralelas
        parallelismo: `
            // ✅ Bom - Paralelo com Promise.all
            const [usuario, posts, comentarios] = await Promise.all([
                buscarUsuario(id),
                buscarPosts(id),
                buscarComentarios(id)
            ]);
            
            // ❌ Evitar - Sequencial desnecessário
            const usuario = await buscarUsuario(id);
            const posts = await buscarPosts(id);
            const comentarios = await buscarComentarios(id);
        `,
        
        // Limitar concorrência
        concorrencia: `
            // ✅ Bom - Controlar concorrência
            async function processarEmLotes(items, batchSize = 5) {
                const resultados = [];
                
                for (let i = 0; i < items.length; i += batchSize) {
                    const lote = items.slice(i, i + batchSize);
                    const resultadosLote = await Promise.all(
                        lote.map(item => processarItem(item))
                    );
                    resultados.push(...resultadosLote);
                }
                
                return resultados;
            }
        `
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasPromises = {
    documentacao: [
        'MDN - Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
        'MDN - Using Promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises',
        'JavaScript.info - Promises: https://javascript.info/promise-basics',
        'Promises/A+ Specification: https://promisesaplus.com/'
    ],
    
    proximosTopicos: [
        '03-async-await.js - Sintaxe async/await',
        '04-fetch-api.js - Fetch API e requisições HTTP',
        '09-ES6-Plus - Async iterators e generators',
        '11-Qualidade - Testes com Promises'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de rate limiting',
        'Criar pool de conexões com Promises',
        'Desenvolver sistema de circuit breaker',
        'Construir cache distribuído com TTL'
    ]
};

console.log('Referências:', referenciasPromises.documentacao);
console.log('Próximos tópicos:', referenciasPromises.proximosTopicos);
console.log('Exercícios adicionais:', referenciasPromises.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - PROMISES
===========================================

✅ CONCEITOS APRENDIDOS:
• Estados das Promises (pending, fulfilled, rejected)
• Métodos then, catch, finally
• Métodos estáticos (all, race, allSettled, any)
• Encadeamento e composição
• Tratamento avançado de erros

✅ TÉCNICAS DOMINADAS:
• Criação de Promises customizadas
• Padrões de retry e timeout
• Controle de concorrência
• Memoização e cache
• Pipeline de transformações

✅ PROJETOS DESENVOLVIDOS:
• Sistema de cache com Promises
• Utilitários avançados (PromiseUtils)
• Tratamento robusto de erros

🎯 PRÓXIMO PASSO:
Continue para 03-async-await.js para aprender
a sintaxe moderna que torna Promises ainda
mais fáceis de usar!

===========================================
*/