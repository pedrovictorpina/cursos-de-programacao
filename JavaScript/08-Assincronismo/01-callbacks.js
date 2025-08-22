/*
===========================================
    MÓDULO 08 - ASSINCRONISMO
    Aula 01: Callbacks (Funções de Retorno)
===========================================

Objetivos de Aprendizagem:
✓ Compreender o conceito de programação assíncrona
✓ Dominar o uso de callbacks em JavaScript
✓ Identificar e resolver problemas de callback hell
✓ Implementar padrões de controle de fluxo assíncrono
✓ Criar sistemas robustos com tratamento de erros
*/

// ===========================================
// 1. TEORIA: CALLBACKS E ASSINCRONISMO
// ===========================================

/*
PROGRAMAÇÃO ASSÍNCRONA:

1. CONCEITOS FUNDAMENTAIS:
   - Síncrono vs Assíncrono
   - Event Loop e Call Stack
   - Blocking vs Non-blocking
   - Concorrência em JavaScript

2. CALLBACKS:
   - Definição: função passada como argumento
   - Execução: chamada em momento futuro
   - Tipos: success, error, progress
   - Padrões: Node.js style, browser APIs

3. PROBLEMAS COMUNS:
   - Callback Hell (Pyramid of Doom)
   - Error handling complexo
   - Dificuldade de debugging
   - Código difícil de manter

4. SOLUÇÕES:
   - Modularização de callbacks
   - Named functions
   - Control flow libraries
   - Promises (próxima aula)

5. CASOS DE USO:
   - Operações I/O (file system, network)
   - Timers (setTimeout, setInterval)
   - Event handling
   - APIs assíncronas
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Conceitos Básicos de Callbacks ---
console.log('=== CONCEITOS BÁSICOS DE CALLBACKS ===');

// Callback simples
function exemploCallbackSimples() {
    console.log('\n--- Callback Simples ---');
    
    function saudar(nome, callback) {
        console.log(`Olá, ${nome}!`);
        callback();
    }
    
    function despedir() {
        console.log('Até logo!');
    }
    
    saudar('Maria', despedir);
    
    // Callback inline
    saudar('João', function() {
        console.log('Tenha um bom dia!');
    });
    
    // Arrow function como callback
    saudar('Ana', () => console.log('Nos vemos em breve!'));
}

exemploCallbackSimples();

// Callback com parâmetros
function exemploCallbackComParametros() {
    console.log('\n--- Callback com Parâmetros ---');
    
    function processar(dados, callback) {
        const resultado = dados.map(x => x * 2);
        callback(null, resultado); // Node.js style: (error, result)
    }
    
    function exibirResultado(erro, resultado) {
        if (erro) {
            console.error('Erro:', erro);
            return;
        }
        console.log('Resultado:', resultado);
    }
    
    processar([1, 2, 3, 4, 5], exibirResultado);
    
    // Simulando erro
    function processarComErro(dados, callback) {
        if (!Array.isArray(dados)) {
            callback(new Error('Dados devem ser um array'));
            return;
        }
        callback(null, dados.map(x => x * 3));
    }
    
    processarComErro('não é array', exibirResultado);
    processarComErro([2, 4, 6], exibirResultado);
}

exemploCallbackComParametros();

// --- 2.2 Operações Assíncronas com Callbacks ---
console.log('\n=== OPERAÇÕES ASSÍNCRONAS ===');

// Simulando operação assíncrona
function exemploOperacaoAssincrona() {
    console.log('\n--- Operação Assíncrona ---');
    
    function buscarDados(id, callback) {
        console.log(`Iniciando busca para ID: ${id}`);
        
        // Simular delay de rede
        setTimeout(() => {
            // Simular dados
            const dados = {
                id: id,
                nome: `Usuário ${id}`,
                email: `usuario${id}@email.com`,
                timestamp: new Date()
            };
            
            // Simular possível erro
            if (id < 0) {
                callback(new Error('ID inválido'));
                return;
            }
            
            console.log(`Dados encontrados para ID: ${id}`);
            callback(null, dados);
        }, Math.random() * 1000 + 500); // 500-1500ms
    }
    
    function processarDados(erro, dados) {
        if (erro) {
            console.error('Erro ao buscar dados:', erro.message);
            return;
        }
        
        console.log('Dados processados:', {
            usuario: dados.nome,
            email: dados.email,
            processadoEm: new Date()
        });
    }
    
    // Executar buscas
    buscarDados(1, processarDados);
    buscarDados(2, processarDados);
    buscarDados(-1, processarDados); // Erro
    
    console.log('Buscas iniciadas (assíncronas)...');
}

exemploOperacaoAssincrona();

// --- 2.3 Callback Hell e Soluções ---
console.log('\n=== CALLBACK HELL E SOLUÇÕES ===');

// Exemplo de Callback Hell
function exemploCallbackHell() {
    console.log('\n--- Callback Hell (Problema) ---');
    
    function buscarUsuario(id, callback) {
        setTimeout(() => {
            if (id <= 0) {
                callback(new Error('ID inválido'));
                return;
            }
            callback(null, { id, nome: `Usuário ${id}` });
        }, 300);
    }
    
    function buscarPerfil(usuarioId, callback) {
        setTimeout(() => {
            callback(null, { 
                usuarioId, 
                bio: 'Desenvolvedor JavaScript',
                avatar: `avatar${usuarioId}.jpg`
            });
        }, 200);
    }
    
    function buscarPostagens(usuarioId, callback) {
        setTimeout(() => {
            callback(null, [
                { id: 1, titulo: 'Primeiro post', usuarioId },
                { id: 2, titulo: 'Segundo post', usuarioId }
            ]);
        }, 400);
    }
    
    function buscarComentarios(postId, callback) {
        setTimeout(() => {
            callback(null, [
                { id: 1, texto: 'Ótimo post!', postId },
                { id: 2, texto: 'Muito útil!', postId }
            ]);
        }, 150);
    }
    
    // ❌ CALLBACK HELL - Difícil de ler e manter
    buscarUsuario(1, (erro, usuario) => {
        if (erro) {
            console.error('Erro:', erro.message);
            return;
        }
        
        buscarPerfil(usuario.id, (erro, perfil) => {
            if (erro) {
                console.error('Erro:', erro.message);
                return;
            }
            
            buscarPostagens(usuario.id, (erro, postagens) => {
                if (erro) {
                    console.error('Erro:', erro.message);
                    return;
                }
                
                // Para cada postagem, buscar comentários
                let comentariosCompletos = 0;
                const resultadoFinal = {
                    usuario,
                    perfil,
                    postagens: postagens.map(post => ({ ...post, comentarios: [] }))
                };
                
                postagens.forEach((post, index) => {
                    buscarComentarios(post.id, (erro, comentarios) => {
                        if (erro) {
                            console.error('Erro:', erro.message);
                            return;
                        }
                        
                        resultadoFinal.postagens[index].comentarios = comentarios;
                        comentariosCompletos++;
                        
                        if (comentariosCompletos === postagens.length) {
                            console.log('\n🔥 Callback Hell - Resultado:', resultadoFinal);
                        }
                    });
                });
            });
        });
    });
}

exemploCallbackHell();

// Solução 1: Named Functions
function exemploSolucaoNamedFunctions() {
    console.log('\n--- Solução 1: Named Functions ---');
    
    // Reutilizar as funções do exemplo anterior
    function buscarUsuario(id, callback) {
        setTimeout(() => {
            if (id <= 0) {
                callback(new Error('ID inválido'));
                return;
            }
            callback(null, { id, nome: `Usuário ${id}` });
        }, 300);
    }
    
    function buscarPerfil(usuarioId, callback) {
        setTimeout(() => {
            callback(null, { 
                usuarioId, 
                bio: 'Desenvolvedor JavaScript',
                avatar: `avatar${usuarioId}.jpg`
            });
        }, 200);
    }
    
    function buscarPostagens(usuarioId, callback) {
        setTimeout(() => {
            callback(null, [
                { id: 1, titulo: 'Primeiro post', usuarioId },
                { id: 2, titulo: 'Segundo post', usuarioId }
            ]);
        }, 400);
    }
    
    // ✅ SOLUÇÃO - Named functions
    function tratarErro(erro) {
        console.error('Erro:', erro.message);
    }
    
    function processarUsuario(erro, usuario) {
        if (erro) return tratarErro(erro);
        
        buscarPerfil(usuario.id, (erro, perfil) => {
            if (erro) return tratarErro(erro);
            processarPerfil(usuario, perfil);
        });
    }
    
    function processarPerfil(usuario, perfil) {
        buscarPostagens(usuario.id, (erro, postagens) => {
            if (erro) return tratarErro(erro);
            processarPostagens(usuario, perfil, postagens);
        });
    }
    
    function processarPostagens(usuario, perfil, postagens) {
        const resultado = {
            usuario,
            perfil,
            postagens
        };
        
        console.log('\n✅ Named Functions - Resultado:', resultado);
    }
    
    // Iniciar processo
    buscarUsuario(2, processarUsuario);
}

setTimeout(exemploSolucaoNamedFunctions, 2000);

// --- 2.4 Sistema de Controle de Fluxo ---
console.log('\n=== SISTEMA DE CONTROLE DE FLUXO ===');

class CallbackFlowControl {
    constructor() {
        this.tasks = [];
        this.results = [];
        this.errors = [];
    }
    
    // Executar callbacks em série (um após o outro)
    series(tasks, finalCallback) {
        let currentIndex = 0;
        const results = [];
        
        function executeNext() {
            if (currentIndex >= tasks.length) {
                finalCallback(null, results);
                return;
            }
            
            const currentTask = tasks[currentIndex];
            currentIndex++;
            
            currentTask((erro, resultado) => {
                if (erro) {
                    finalCallback(erro);
                    return;
                }
                
                results.push(resultado);
                executeNext();
            });
        }
        
        executeNext();
    }
    
    // Executar callbacks em paralelo
    parallel(tasks, finalCallback) {
        let completedTasks = 0;
        let hasError = false;
        const results = new Array(tasks.length);
        
        if (tasks.length === 0) {
            finalCallback(null, []);
            return;
        }
        
        tasks.forEach((task, index) => {
            task((erro, resultado) => {
                if (hasError) return;
                
                if (erro) {
                    hasError = true;
                    finalCallback(erro);
                    return;
                }
                
                results[index] = resultado;
                completedTasks++;
                
                if (completedTasks === tasks.length) {
                    finalCallback(null, results);
                }
            });
        });
    }
    
    // Executar com limite de concorrência
    parallelLimit(tasks, limit, finalCallback) {
        let currentIndex = 0;
        let completedTasks = 0;
        let runningTasks = 0;
        let hasError = false;
        const results = new Array(tasks.length);
        
        function executeNext() {
            while (runningTasks < limit && currentIndex < tasks.length && !hasError) {
                const taskIndex = currentIndex;
                const task = tasks[currentIndex];
                currentIndex++;
                runningTasks++;
                
                task((erro, resultado) => {
                    runningTasks--;
                    
                    if (hasError) return;
                    
                    if (erro) {
                        hasError = true;
                        finalCallback(erro);
                        return;
                    }
                    
                    results[taskIndex] = resultado;
                    completedTasks++;
                    
                    if (completedTasks === tasks.length) {
                        finalCallback(null, results);
                        return;
                    }
                    
                    executeNext();
                });
            }
        }
        
        executeNext();
    }
    
    // Waterfall - passar resultado de uma task para a próxima
    waterfall(tasks, finalCallback) {
        let currentIndex = 0;
        let currentResult = null;
        
        function executeNext() {
            if (currentIndex >= tasks.length) {
                finalCallback(null, currentResult);
                return;
            }
            
            const currentTask = tasks[currentIndex];
            currentIndex++;
            
            // Primeira task não recebe parâmetro
            if (currentIndex === 1) {
                currentTask((erro, resultado) => {
                    if (erro) {
                        finalCallback(erro);
                        return;
                    }
                    currentResult = resultado;
                    executeNext();
                });
            } else {
                currentTask(currentResult, (erro, resultado) => {
                    if (erro) {
                        finalCallback(erro);
                        return;
                    }
                    currentResult = resultado;
                    executeNext();
                });
            }
        }
        
        executeNext();
    }
    
    // Retry - tentar novamente em caso de erro
    retry(task, attempts, delay, callback) {
        let currentAttempt = 0;
        
        function attempt() {
            currentAttempt++;
            
            task((erro, resultado) => {
                if (!erro) {
                    callback(null, resultado);
                    return;
                }
                
                if (currentAttempt >= attempts) {
                    callback(new Error(`Falhou após ${attempts} tentativas: ${erro.message}`));
                    return;
                }
                
                console.log(`Tentativa ${currentAttempt} falhou, tentando novamente em ${delay}ms...`);
                setTimeout(attempt, delay);
            });
        }
        
        attempt();
    }
}

// Exemplo de uso do sistema de controle de fluxo
function exemploFlowControl() {
    console.log('\n--- Sistema de Controle de Fluxo ---');
    
    const flowControl = new CallbackFlowControl();
    
    // Criar tasks de exemplo
    function criarTask(nome, delay, shouldFail = false) {
        return function(callback) {
            console.log(`Iniciando task: ${nome}`);
            
            setTimeout(() => {
                if (shouldFail) {
                    callback(new Error(`Task ${nome} falhou`));
                    return;
                }
                
                const resultado = `Resultado da ${nome}`;
                console.log(`Concluída task: ${nome}`);
                callback(null, resultado);
            }, delay);
        };
    }
    
    // === SÉRIE ===
    console.log('\n🔄 Executando em série...');
    const tasksSerie = [
        criarTask('Task 1', 300),
        criarTask('Task 2', 200),
        criarTask('Task 3', 400)
    ];
    
    flowControl.series(tasksSerie, (erro, resultados) => {
        if (erro) {
            console.error('Erro na série:', erro.message);
            return;
        }
        console.log('✅ Série concluída:', resultados);
    });
    
    // === PARALELO ===
    setTimeout(() => {
        console.log('\n⚡ Executando em paralelo...');
        const tasksParalelo = [
            criarTask('Task A', 300),
            criarTask('Task B', 200),
            criarTask('Task C', 400)
        ];
        
        flowControl.parallel(tasksParalelo, (erro, resultados) => {
            if (erro) {
                console.error('Erro no paralelo:', erro.message);
                return;
            }
            console.log('✅ Paralelo concluído:', resultados);
        });
    }, 2000);
    
    // === WATERFALL ===
    setTimeout(() => {
        console.log('\n💧 Executando waterfall...');
        
        const tasksWaterfall = [
            // Primeira task
            (callback) => {
                setTimeout(() => {
                    console.log('Waterfall: Primeira task');
                    callback(null, 'Dados iniciais');
                }, 200);
            },
            // Segunda task recebe resultado da primeira
            (dadosAnteriores, callback) => {
                setTimeout(() => {
                    console.log('Waterfall: Segunda task com:', dadosAnteriores);
                    callback(null, `${dadosAnteriores} + processados`);
                }, 300);
            },
            // Terceira task recebe resultado da segunda
            (dadosAnteriores, callback) => {
                setTimeout(() => {
                    console.log('Waterfall: Terceira task com:', dadosAnteriores);
                    callback(null, `${dadosAnteriores} + finalizados`);
                }, 150);
            }
        ];
        
        flowControl.waterfall(tasksWaterfall, (erro, resultado) => {
            if (erro) {
                console.error('Erro no waterfall:', erro.message);
                return;
            }
            console.log('✅ Waterfall concluído:', resultado);
        });
    }, 4000);
    
    // === RETRY ===
    setTimeout(() => {
        console.log('\n🔄 Testando retry...');
        
        let tentativas = 0;
        const taskComFalha = (callback) => {
            tentativas++;
            console.log(`Tentativa ${tentativas}`);
            
            // Falhar nas primeiras 2 tentativas
            if (tentativas < 3) {
                callback(new Error('Falha simulada'));
                return;
            }
            
            callback(null, 'Sucesso após retry!');
        };
        
        flowControl.retry(taskComFalha, 5, 500, (erro, resultado) => {
            if (erro) {
                console.error('Retry falhou:', erro.message);
                return;
            }
            console.log('✅ Retry bem-sucedido:', resultado);
        });
    }, 6000);
}

setTimeout(exemploFlowControl, 3000);

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Download com Callbacks ---
console.log('\n=== EXERCÍCIO 1: SISTEMA DE DOWNLOAD ===');

class SistemaDownload {
    constructor() {
        this.downloads = new Map();
        this.maxConcorrentes = 3;
        this.downloadAtivos = 0;
        this.fila = [];
    }
    
    // Simular download de arquivo
    download(url, opcoes = {}, callback) {
        const downloadId = `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const config = {
            timeout: 5000,
            retries: 3,
            chunkSize: 1024,
            ...opcoes
        };
        
        const downloadInfo = {
            id: downloadId,
            url,
            config,
            status: 'pending',
            progress: 0,
            startTime: null,
            endTime: null,
            error: null,
            callback
        };
        
        this.downloads.set(downloadId, downloadInfo);
        
        // Adicionar à fila ou iniciar imediatamente
        if (this.downloadAtivos < this.maxConcorrentes) {
            this.iniciarDownload(downloadId);
        } else {
            this.fila.push(downloadId);
            console.log(`Download ${downloadId} adicionado à fila`);
        }
        
        return downloadId;
    }
    
    // Iniciar download
    iniciarDownload(downloadId) {
        const downloadInfo = this.downloads.get(downloadId);
        if (!downloadInfo) return;
        
        this.downloadAtivos++;
        downloadInfo.status = 'downloading';
        downloadInfo.startTime = new Date();
        
        console.log(`🔽 Iniciando download: ${downloadInfo.url}`);
        
        this.simularDownload(downloadInfo, (erro, resultado) => {
            this.downloadAtivos--;
            
            if (erro) {
                downloadInfo.status = 'error';
                downloadInfo.error = erro;
                downloadInfo.endTime = new Date();
                
                // Tentar retry se configurado
                if (downloadInfo.config.retries > 0) {
                    downloadInfo.config.retries--;
                    console.log(`❌ Download falhou, tentando novamente... (${downloadInfo.config.retries} tentativas restantes)`);
                    
                    setTimeout(() => {
                        this.iniciarDownload(downloadId);
                    }, 1000);
                    return;
                }
                
                console.log(`❌ Download falhou definitivamente: ${erro.message}`);
                downloadInfo.callback(erro);
            } else {
                downloadInfo.status = 'completed';
                downloadInfo.endTime = new Date();
                downloadInfo.progress = 100;
                
                const duracao = downloadInfo.endTime - downloadInfo.startTime;
                console.log(`✅ Download concluído em ${duracao}ms: ${downloadInfo.url}`);
                
                downloadInfo.callback(null, {
                    id: downloadId,
                    url: downloadInfo.url,
                    size: resultado.size,
                    duration: duracao,
                    data: resultado.data
                });
            }
            
            // Processar próximo da fila
            this.processarFila();
        });
    }
    
    // Simular processo de download
    simularDownload(downloadInfo, callback) {
        const tamanhoArquivo = Math.random() * 10000 + 1000; // 1KB - 10KB
        const chunks = Math.ceil(tamanhoArquivo / downloadInfo.config.chunkSize);
        let chunksDownloaded = 0;
        const dados = [];
        
        const downloadChunk = () => {
            // Simular possível falha
            if (Math.random() < 0.1) { // 10% chance de falha
                callback(new Error('Falha na conexão'));
                return;
            }
            
            // Simular delay do chunk
            setTimeout(() => {
                chunksDownloaded++;
                downloadInfo.progress = (chunksDownloaded / chunks) * 100;
                
                // Simular dados do chunk
                dados.push(`chunk_${chunksDownloaded}`);
                
                console.log(`📦 Chunk ${chunksDownloaded}/${chunks} - ${downloadInfo.progress.toFixed(1)}%`);
                
                if (chunksDownloaded >= chunks) {
                    // Download completo
                    callback(null, {
                        size: tamanhoArquivo,
                        data: dados.join('')
                    });
                } else {
                    // Próximo chunk
                    downloadChunk();
                }
            }, Math.random() * 200 + 50); // 50-250ms por chunk
        };
        
        downloadChunk();
    }
    
    // Processar fila de downloads
    processarFila() {
        if (this.fila.length > 0 && this.downloadAtivos < this.maxConcorrentes) {
            const proximoId = this.fila.shift();
            this.iniciarDownload(proximoId);
        }
    }
    
    // Obter status de download
    getStatus(downloadId) {
        const downloadInfo = this.downloads.get(downloadId);
        if (!downloadInfo) return null;
        
        return {
            id: downloadInfo.id,
            url: downloadInfo.url,
            status: downloadInfo.status,
            progress: downloadInfo.progress,
            error: downloadInfo.error?.message || null
        };
    }
    
    // Cancelar download
    cancelar(downloadId) {
        const downloadInfo = this.downloads.get(downloadId);
        if (!downloadInfo) return false;
        
        if (downloadInfo.status === 'pending') {
            // Remover da fila
            const index = this.fila.indexOf(downloadId);
            if (index > -1) {
                this.fila.splice(index, 1);
            }
        }
        
        downloadInfo.status = 'cancelled';
        downloadInfo.callback(new Error('Download cancelado'));
        
        console.log(`🚫 Download cancelado: ${downloadInfo.url}`);
        return true;
    }
    
    // Obter estatísticas
    getEstatisticas() {
        const downloads = Array.from(this.downloads.values());
        
        return {
            total: downloads.length,
            concluidos: downloads.filter(d => d.status === 'completed').length,
            ativos: this.downloadAtivos,
            fila: this.fila.length,
            erros: downloads.filter(d => d.status === 'error').length,
            cancelados: downloads.filter(d => d.status === 'cancelled').length
        };
    }
}

// Exemplo de uso do sistema de download
function exemploSistemaDownload() {
    console.log('\n--- Sistema de Download ---');
    
    const downloader = new SistemaDownload();
    
    // Callback para processar resultado
    function processarDownload(erro, resultado) {
        if (erro) {
            console.error('❌ Erro no download:', erro.message);
            return;
        }
        
        console.log('✅ Download processado:', {
            url: resultado.url,
            tamanho: `${(resultado.size / 1024).toFixed(2)} KB`,
            duracao: `${resultado.duration}ms`
        });
    }
    
    // Iniciar vários downloads
    const urls = [
        'https://exemplo.com/arquivo1.pdf',
        'https://exemplo.com/arquivo2.jpg',
        'https://exemplo.com/arquivo3.zip',
        'https://exemplo.com/arquivo4.mp4',
        'https://exemplo.com/arquivo5.doc'
    ];
    
    const downloadIds = urls.map(url => {
        return downloader.download(url, {
            timeout: 10000,
            retries: 2,
            chunkSize: 512
        }, processarDownload);
    });
    
    // Monitorar progresso
    const monitorInterval = setInterval(() => {
        const stats = downloader.getEstatisticas();
        console.log('📊 Estatísticas:', stats);
        
        if (stats.ativos === 0 && stats.fila === 0) {
            clearInterval(monitorInterval);
            console.log('🏁 Todos os downloads finalizados!');
        }
    }, 2000);
    
    // Cancelar um download após 3 segundos
    setTimeout(() => {
        if (downloadIds.length > 2) {
            downloader.cancelar(downloadIds[2]);
        }
    }, 3000);
}

setTimeout(exemploSistemaDownload, 8000);

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasCallbacks = {
    boasPraticas: {
        // Sempre tratar erros
        tratamentoErros: `
            // ✅ Bom - Sempre verificar erros
            function minhaFuncao(callback) {
                try {
                    // operação
                    callback(null, resultado);
                } catch (error) {
                    callback(error);
                }
            }
            
            // ❌ Evitar - Não tratar erros
            function funcaoRuim(callback) {
                // operação que pode falhar
                callback(resultado); // E se der erro?
            }
        `,
        
        // Usar named functions
        namedFunctions: `
            // ✅ Bom - Named functions
            function processarDados(dados, callback) {
                // lógica
                callback(null, resultado);
            }
            
            buscarDados(processarDados);
            
            // ❌ Evitar - Callbacks anônimos aninhados
            buscarDados((dados) => {
                processar(dados, (resultado) => {
                    salvar(resultado, (sucesso) => {
                        // callback hell
                    });
                });
            });
        `,
        
        // Validar parâmetros
        validacao: `
            // ✅ Bom - Validar entrada
            function operacaoAssincrona(dados, callback) {
                if (typeof callback !== 'function') {
                    throw new Error('Callback é obrigatório');
                }
                
                if (!dados) {
                    callback(new Error('Dados são obrigatórios'));
                    return;
                }
                
                // continuar operação
            }
        `
    },
    
    performance: {
        // Evitar callbacks desnecessários
        otimizacao: `
            // ✅ Bom - Callback apenas quando necessário
            function operacaoRapida(dados) {
                return dados.map(x => x * 2); // Síncrono
            }
            
            // ❌ Evitar - Callback desnecessário
            function operacaoLenta(dados, callback) {
                const resultado = dados.map(x => x * 2);
                callback(null, resultado); // Por que callback?
            }
        `,
        
        // Controlar concorrência
        concorrencia: `
            // ✅ Bom - Limitar concorrência
            const limiteConcorrencia = 5;
            let operacoesAtivas = 0;
            const fila = [];
            
            function executarComLimite(operacao) {
                if (operacoesAtivas < limiteConcorrencia) {
                    executar(operacao);
                } else {
                    fila.push(operacao);
                }
            }
        `
    },
    
    debugging: {
        // Adicionar logs úteis
        logging: `
            // ✅ Bom - Logs informativos
            function operacaoComLog(dados, callback) {
                console.log('Iniciando operação com:', dados);
                
                setTimeout(() => {
                    console.log('Operação concluída');
                    callback(null, resultado);
                }, 1000);
            }
        `,
        
        // Usar nomes descritivos
        nomes: `
            // ✅ Bom - Nomes descritivos
            function buscarUsuarioPorId(id, onUsuarioEncontrado) {
                // implementação
            }
            
            // ❌ Evitar - Nomes genéricos
            function get(id, cb) {
                // implementação
            }
        `
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasCallbacks = {
    documentacao: [
        'MDN - Callback functions: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function',
        'Node.js - Error-first callbacks: https://nodejs.org/api/errors.html#errors_error_first_callbacks',
        'JavaScript.info - Callbacks: https://javascript.info/callbacks',
        'Async.js library: https://caolan.github.io/async/v3/'
    ],
    
    proximosTopicos: [
        '02-promises.js - Promises e then/catch',
        '03-async-await.js - Async/await syntax',
        '04-fetch-api.js - Fetch API e requisições HTTP',
        '09-ES6-Plus - Generators e async iterators'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de cache com callbacks',
        'Criar biblioteca de controle de fluxo',
        'Desenvolver sistema de upload com progress',
        'Construir API client com retry automático'
    ]
};

console.log('Referências:', referenciasCallbacks.documentacao);
console.log('Próximos tópicos:', referenciasCallbacks.proximosTopicos);
console.log('Exercícios adicionais:', referenciasCallbacks.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - CALLBACKS
===========================================

✅ CONCEITOS APRENDIDOS:
• Programação assíncrona vs síncrona
• Callbacks e funções de retorno
• Error-first callback pattern
• Event Loop e Call Stack
• Callback Hell e suas soluções

✅ TÉCNICAS DOMINADAS:
• Controle de fluxo assíncrono
• Execução em série e paralelo
• Retry e error handling
• Named functions para legibilidade
• Sistemas de fila e concorrência

✅ PROJETOS DESENVOLVIDOS:
• Sistema de controle de fluxo
• Sistema de download com callbacks
• Gerenciador de operações assíncronas

🎯 PRÓXIMO PASSO:
Continue para 02-promises.js para aprender
como Promises resolvem os problemas dos callbacks!

===========================================
*/