/*
===========================================
    CURSO JAVASCRIPT - ASYNC/AWAIT E PROMISES
===========================================

Este arquivo aborda:
- Conceitos de programação assíncrona
- Callbacks e callback hell
- Promises (criação, uso, encadeamento)
- async/await (sintaxe moderna)
- Tratamento de erros
- Promise.all, Promise.race, Promise.allSettled
- Fetch API e requisições HTTP
- Timers e intervalos
- Event Loop e Call Stack
- Exemplos práticos avançados

NOTA: Este arquivo contém código JavaScript para programação assíncrona.
Alguns exemplos podem precisar de um servidor ou API para funcionar completamente.
*/

// ========================================
// 1. CONCEITOS BÁSICOS DE ASSINCRONIA
// ========================================

/*
JavaScript é single-threaded, mas pode executar código assíncrono
através do Event Loop. Isso permite que operações demoradas
(como requisições de rede) não bloqueiem a interface.

Tipos de operações assíncronas:
- Timers (setTimeout, setInterval)
- Requisições HTTP (fetch, XMLHttpRequest)
- Leitura de arquivos
- Operações de banco de dados
- Eventos do DOM
*/

console.log('=== DEMONSTRAÇÃO DO EVENT LOOP ==>');

console.log('1. Código síncrono');

setTimeout(() => {
    console.log('3. Callback do setTimeout (assíncrono)');
}, 0);

console.log('2. Mais código síncrono');

// Resultado: 1, 2, 3 (mesmo com timeout 0)

// ========================================
// 2. CALLBACKS - A BASE DA ASSINCRONIA
// ========================================

/*
Callbacks são funções passadas como argumentos para outras funções,
executadas quando uma operação assíncrona é concluída.
*/

// Exemplo básico de callback
function operacaoAssincrona(callback) {
    console.log('Iniciando operação...');
    
    setTimeout(() => {
        const resultado = Math.random() * 100;
        console.log('Operação concluída!');
        callback(resultado);
    }, 1000);
}

// Uso do callback
operacaoAssincrona((resultado) => {
    console.log('Resultado recebido:', resultado);
});

// Simulando operação com possibilidade de erro
function operacaoComErro(sucesso, callback) {
    setTimeout(() => {
        if (sucesso) {
            callback(null, 'Operação bem-sucedida!');
        } else {
            callback(new Error('Algo deu errado!'), null);
        }
    }, 500);
}

// Padrão Node.js: erro primeiro
operacaoComErro(true, (erro, resultado) => {
    if (erro) {
        console.error('Erro:', erro.message);
    } else {
        console.log('Sucesso:', resultado);
    }
});

// ========================================
// 3. CALLBACK HELL - O PROBLEMA
// ========================================

/*
Quando temos múltiplas operações assíncronas dependentes,
os callbacks podem criar uma estrutura aninhada difícil de ler.
*/

// Exemplo de callback hell
function buscarUsuario(id, callback) {
    setTimeout(() => {
        console.log('Usuário encontrado');
        callback(null, { id, nome: 'João', empresaId: 123 });
    }, 500);
}

function buscarEmpresa(id, callback) {
    setTimeout(() => {
        console.log('Empresa encontrada');
        callback(null, { id, nome: 'Tech Corp', enderecoId: 456 });
    }, 300);
}

function buscarEndereco(id, callback) {
    setTimeout(() => {
        console.log('Endereço encontrado');
        callback(null, { id, rua: 'Rua das Flores, 123', cidade: 'São Paulo' });
    }, 200);
}

// Callback hell em ação
buscarUsuario(1, (erro, usuario) => {
    if (erro) {
        console.error('Erro ao buscar usuário:', erro);
        return;
    }
    
    buscarEmpresa(usuario.empresaId, (erro, empresa) => {
        if (erro) {
            console.error('Erro ao buscar empresa:', erro);
            return;
        }
        
        buscarEndereco(empresa.enderecoId, (erro, endereco) => {
            if (erro) {
                console.error('Erro ao buscar endereço:', erro);
                return;
            }
            
            // Finalmente temos todos os dados!
            console.log('Dados completos:', {
                usuario: usuario.nome,
                empresa: empresa.nome,
                endereco: endereco.rua + ', ' + endereco.cidade
            });
        });
    });
});

// ========================================
// 4. PROMISES - A SOLUÇÃO MODERNA
// ========================================

/*
Promises representam um valor que pode estar disponível agora,
no futuro, ou nunca. Elas têm três estados:
- Pending (pendente): estado inicial
- Fulfilled (resolvida): operação concluída com sucesso
- Rejected (rejeitada): operação falhou
*/

// Criando uma Promise básica
const minhaPromise = new Promise((resolve, reject) => {
    const sucesso = Math.random() > 0.5;
    
    setTimeout(() => {
        if (sucesso) {
            resolve('Operação bem-sucedida!');
        } else {
            reject(new Error('Operação falhou!'));
        }
    }, 1000);
});

// Consumindo a Promise
minhaPromise
    .then(resultado => {
        console.log('Sucesso:', resultado);
    })
    .catch(erro => {
        console.error('Erro:', erro.message);
    })
    .finally(() => {
        console.log('Operação finalizada (sempre executa)');
    });

// ========================================
// 5. CONVERTENDO CALLBACKS PARA PROMISES
// ========================================

// Versão com Promise das funções anteriores
function buscarUsuarioPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error('ID inválido'));
            } else {
                resolve({ id, nome: 'João', empresaId: 123 });
            }
        }, 500);
    });
}

function buscarEmpresaPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error('ID da empresa inválido'));
            } else {
                resolve({ id, nome: 'Tech Corp', enderecoId: 456 });
            }
        }, 300);
    });
}

function buscarEnderecoPromise(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error('ID do endereço inválido'));
            } else {
                resolve({ id, rua: 'Rua das Flores, 123', cidade: 'São Paulo' });
            }
        }, 200);
    });
}

// ========================================
// 6. ENCADEAMENTO DE PROMISES
// ========================================

// Resolvendo o callback hell com Promises
buscarUsuarioPromise(1)
    .then(usuario => {
        console.log('Usuário encontrado:', usuario.nome);
        return buscarEmpresaPromise(usuario.empresaId);
    })
    .then(empresa => {
        console.log('Empresa encontrada:', empresa.nome);
        return buscarEnderecoPromise(empresa.enderecoId);
    })
    .then(endereco => {
        console.log('Endereço encontrado:', endereco.rua);
        console.log('Busca completa!');
    })
    .catch(erro => {
        console.error('Erro na cadeia:', erro.message);
    });

// Passando dados através da cadeia
buscarUsuarioPromise(1)
    .then(usuario => {
        // Retornando um objeto com os dados acumulados
        return buscarEmpresaPromise(usuario.empresaId)
            .then(empresa => ({ usuario, empresa }));
    })
    .then(({ usuario, empresa }) => {
        return buscarEnderecoPromise(empresa.enderecoId)
            .then(endereco => ({ usuario, empresa, endereco }));
    })
    .then(({ usuario, empresa, endereco }) => {
        console.log('Dados completos com Promises:', {
            usuario: usuario.nome,
            empresa: empresa.nome,
            endereco: endereco.rua + ', ' + endereco.cidade
        });
    })
    .catch(erro => {
        console.error('Erro:', erro.message);
    });

// ========================================
// 7. ASYNC/AWAIT - SINTAXE MODERNA
// ========================================

/*
async/await é açúcar sintático sobre Promises,
permitindo escrever código assíncrono que parece síncrono.
*/

// Função async básica
async function exemploAsyncAwait() {
    try {
        console.log('Iniciando busca com async/await...');
        
        const usuario = await buscarUsuarioPromise(1);
        console.log('Usuário:', usuario.nome);
        
        const empresa = await buscarEmpresaPromise(usuario.empresaId);
        console.log('Empresa:', empresa.nome);
        
        const endereco = await buscarEnderecoPromise(empresa.enderecoId);
        console.log('Endereço:', endereco.rua);
        
        return {
            usuario: usuario.nome,
            empresa: empresa.nome,
            endereco: endereco.rua + ', ' + endereco.cidade
        };
        
    } catch (erro) {
        console.error('Erro com async/await:', erro.message);
        throw erro; // Re-propagar o erro
    }
}

// Chamando função async
exemploAsyncAwait()
    .then(resultado => {
        console.log('Resultado final:', resultado);
    })
    .catch(erro => {
        console.error('Erro capturado:', erro.message);
    });

// ========================================
// 8. TRATAMENTO DE ERROS AVANÇADO
// ========================================

// Múltiplos try/catch
async function exemploTratamentoErros() {
    let usuario, empresa, endereco;
    
    try {
        usuario = await buscarUsuarioPromise(1);
        console.log('Usuário carregado:', usuario.nome);
    } catch (erro) {
        console.error('Erro ao carregar usuário:', erro.message);
        // Usar dados padrão ou retornar
        usuario = { id: 1, nome: 'Usuário Padrão', empresaId: 123 };
    }
    
    try {
        empresa = await buscarEmpresaPromise(usuario.empresaId);
        console.log('Empresa carregada:', empresa.nome);
    } catch (erro) {
        console.error('Erro ao carregar empresa:', erro.message);
        empresa = { id: 123, nome: 'Empresa Padrão', enderecoId: 456 };
    }
    
    try {
        endereco = await buscarEnderecoPromise(empresa.enderecoId);
        console.log('Endereço carregado:', endereco.rua);
    } catch (erro) {
        console.error('Erro ao carregar endereço:', erro.message);
        endereco = { id: 456, rua: 'Endereço não disponível', cidade: 'N/A' };
    }
    
    return { usuario, empresa, endereco };
}

// Função para retry automático
async function comRetry(funcao, tentativas = 3, delay = 1000) {
    for (let i = 0; i < tentativas; i++) {
        try {
            return await funcao();
        } catch (erro) {
            console.log(`Tentativa ${i + 1} falhou:`, erro.message);
            
            if (i === tentativas - 1) {
                throw erro; // Última tentativa, propagar erro
            }
            
            // Aguardar antes da próxima tentativa
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Exemplo de uso do retry
async function exemploRetry() {
    try {
        const resultado = await comRetry(() => buscarUsuarioPromise(-1), 3, 500);
        console.log('Sucesso após retry:', resultado);
    } catch (erro) {
        console.error('Falhou mesmo com retry:', erro.message);
    }
}

// ========================================
// 9. PROMISE.ALL, RACE E ALLSETTLED
// ========================================

// Promise.all - aguarda todas as promises
async function exemploPromiseAll() {
    console.log('=== Promise.all ==>');
    
    try {
        const inicio = Date.now();
        
        // Executa todas em paralelo
        const [usuario, empresa, endereco] = await Promise.all([
            buscarUsuarioPromise(1),
            buscarEmpresaPromise(123),
            buscarEnderecoPromise(456)
        ]);
        
        const tempo = Date.now() - inicio;
        console.log(`Todas as operações concluídas em ${tempo}ms`);
        console.log('Resultados:', { usuario, empresa, endereco });
        
    } catch (erro) {
        console.error('Uma das promises falhou:', erro.message);
    }
}

// Promise.race - primeira a resolver
async function exemploPromiseRace() {
    console.log('=== Promise.race ==>');
    
    const promiseRapida = new Promise(resolve => {
        setTimeout(() => resolve('Rápida!'), 100);
    });
    
    const promiseLenta = new Promise(resolve => {
        setTimeout(() => resolve('Lenta!'), 1000);
    });
    
    try {
        const resultado = await Promise.race([promiseRapida, promiseLenta]);
        console.log('Primeira a resolver:', resultado);
    } catch (erro) {
        console.error('Erro no race:', erro.message);
    }
}

// Promise.allSettled - aguarda todas, independente do resultado
async function exemploPromiseAllSettled() {
    console.log('=== Promise.allSettled ==>');
    
    const promises = [
        buscarUsuarioPromise(1),
        buscarUsuarioPromise(-1), // Esta vai falhar
        buscarEmpresaPromise(123)
    ];
    
    const resultados = await Promise.allSettled(promises);
    
    resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled') {
            console.log(`Promise ${index} resolvida:`, resultado.value);
        } else {
            console.log(`Promise ${index} rejeitada:`, resultado.reason.message);
        }
    });
}

// ========================================
// 10. FETCH API - REQUISIÇÕES HTTP
// ========================================

/*
A Fetch API é a forma moderna de fazer requisições HTTP,
substituindo XMLHttpRequest.
*/

// Função básica com fetch
async function exemploFetch() {
    try {
        console.log('Fazendo requisição...');
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        // Verificar se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dados recebidos:', data);
        
        return data;
        
    } catch (erro) {
        console.error('Erro na requisição:', erro.message);
        throw erro;
    }
}

// Requisição POST com dados
async function criarPost(dados) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        console.log('Post criado:', resultado);
        return resultado;
        
    } catch (erro) {
        console.error('Erro ao criar post:', erro.message);
        throw erro;
    }
}

// Classe para gerenciar requisições
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Verificar se há conteúdo para parsear
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
            
        } catch (erro) {
            console.error(`Erro na requisição para ${url}:`, erro.message);
            throw erro;
        }
    }
    
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Exemplo de uso da classe ApiClient
async function exemploApiClient() {
    const api = new ApiClient('https://jsonplaceholder.typicode.com');
    
    try {
        // GET
        const post = await api.get('/posts/1');
        console.log('Post obtido:', post.title);
        
        // POST
        const novoPost = await api.post('/posts', {
            title: 'Meu Post',
            body: 'Conteúdo do post',
            userId: 1
        });
        console.log('Novo post criado:', novoPost);
        
    } catch (erro) {
        console.error('Erro na API:', erro.message);
    }
}

// ========================================
// 11. TIMERS E INTERVALOS
// ========================================

// Versão Promise do setTimeout
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exemplo de uso
async function exemploDelay() {
    console.log('Iniciando...');
    await delay(1000);
    console.log('1 segundo depois');
    await delay(2000);
    console.log('3 segundos depois do início');
}

// Timeout com Promise
function comTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout!')), ms);
    });
    
    return Promise.race([promise, timeout]);
}

// Exemplo de uso do timeout
async function exemploTimeout() {
    try {
        const resultado = await comTimeout(
            buscarUsuarioPromise(1),
            2000 // 2 segundos de timeout
        );
        console.log('Resultado dentro do tempo:', resultado);
    } catch (erro) {
        console.error('Erro ou timeout:', erro.message);
    }
}

// Intervalo controlado
class IntervalControlado {
    constructor(callback, intervalo) {
        this.callback = callback;
        this.intervalo = intervalo;
        this.intervalId = null;
        this.ativo = false;
    }
    
    iniciar() {
        if (!this.ativo) {
            this.ativo = true;
            this.intervalId = setInterval(this.callback, this.intervalo);
            console.log('Intervalo iniciado');
        }
    }
    
    parar() {
        if (this.ativo) {
            this.ativo = false;
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Intervalo parado');
        }
    }
    
    alterarIntervalo(novoIntervalo) {
        this.intervalo = novoIntervalo;
        if (this.ativo) {
            this.parar();
            this.iniciar();
        }
    }
}

// ========================================
// 12. EXEMPLO PRÁTICO: SISTEMA DE CACHE
// ========================================

class CacheAssincrono {
    constructor(ttl = 300000) { // TTL padrão: 5 minutos
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async get(chave, funcaoBusca) {
        const agora = Date.now();
        const item = this.cache.get(chave);
        
        // Verificar se existe e não expirou
        if (item && (agora - item.timestamp) < this.ttl) {
            console.log('Cache hit para:', chave);
            return item.valor;
        }
        
        console.log('Cache miss para:', chave);
        
        try {
            const valor = await funcaoBusca();
            
            // Armazenar no cache
            this.cache.set(chave, {
                valor,
                timestamp: agora
            });
            
            return valor;
            
        } catch (erro) {
            console.error('Erro ao buscar valor:', erro.message);
            
            // Retornar valor em cache mesmo expirado, se existir
            if (item) {
                console.log('Retornando valor expirado do cache');
                return item.valor;
            }
            
            throw erro;
        }
    }
    
    invalidar(chave) {
        this.cache.delete(chave);
        console.log('Cache invalidado para:', chave);
    }
    
    limpar() {
        this.cache.clear();
        console.log('Cache limpo');
    }
    
    // Limpeza automática de itens expirados
    iniciarLimpezaAutomatica(intervalo = 60000) { // 1 minuto
        setInterval(() => {
            const agora = Date.now();
            let removidos = 0;
            
            for (const [chave, item] of this.cache.entries()) {
                if ((agora - item.timestamp) >= this.ttl) {
                    this.cache.delete(chave);
                    removidos++;
                }
            }
            
            if (removidos > 0) {
                console.log(`Limpeza automática: ${removidos} itens removidos`);
            }
        }, intervalo);
    }
}

// Exemplo de uso do cache
async function exemploCache() {
    const cache = new CacheAssincrono(5000); // 5 segundos de TTL
    
    // Função que simula busca custosa
    const buscarDadosCustosos = async (id) => {
        console.log('Buscando dados custosos para ID:', id);
        await delay(2000); // Simula operação lenta
        return { id, dados: `Dados para ${id}`, timestamp: new Date() };
    };
    
    try {
        // Primeira busca - vai para a fonte
        const dados1 = await cache.get('user:123', () => buscarDadosCustosos(123));
        console.log('Primeira busca:', dados1);
        
        // Segunda busca - vem do cache
        const dados2 = await cache.get('user:123', () => buscarDadosCustosos(123));
        console.log('Segunda busca:', dados2);
        
        // Aguardar expiração
        await delay(6000);
        
        // Terceira busca - cache expirado, vai para a fonte
        const dados3 = await cache.get('user:123', () => buscarDadosCustosos(123));
        console.log('Terceira busca:', dados3);
        
    } catch (erro) {
        console.error('Erro no exemplo de cache:', erro.message);
    }
}

// ========================================
// 13. EXEMPLO PRÁTICO: UPLOAD DE ARQUIVOS
// ========================================

class GerenciadorUpload {
    constructor() {
        this.uploads = new Map();
    }
    
    async uploadArquivo(arquivo, opcoes = {}) {
        const id = this.gerarId();
        const { onProgress, onComplete, onError } = opcoes;
        
        // Simular upload com progresso
        const uploadPromise = this.simularUpload(arquivo, (progresso) => {
            if (onProgress) {
                onProgress(progresso);
            }
        });
        
        // Armazenar referência do upload
        this.uploads.set(id, {
            arquivo: arquivo.name,
            status: 'uploading',
            promise: uploadPromise
        });
        
        try {
            const resultado = await uploadPromise;
            
            // Atualizar status
            this.uploads.set(id, {
                arquivo: arquivo.name,
                status: 'completed',
                resultado
            });
            
            if (onComplete) {
                onComplete(resultado);
            }
            
            return resultado;
            
        } catch (erro) {
            // Atualizar status de erro
            this.uploads.set(id, {
                arquivo: arquivo.name,
                status: 'error',
                erro: erro.message
            });
            
            if (onError) {
                onError(erro);
            }
            
            throw erro;
        }
    }
    
    async simularUpload(arquivo, onProgress) {
        const tamanhoTotal = arquivo.size || 1000000; // 1MB padrão
        let enviado = 0;
        
        return new Promise((resolve, reject) => {
            const intervalo = setInterval(() => {
                enviado += Math.random() * 100000; // Simular chunks
                
                if (enviado >= tamanhoTotal) {
                    enviado = tamanhoTotal;
                    clearInterval(intervalo);
                    
                    // Simular possível erro
                    if (Math.random() < 0.1) { // 10% chance de erro
                        reject(new Error('Falha no upload'));
                    } else {
                        resolve({
                            id: this.gerarId(),
                            url: `https://exemplo.com/arquivos/${arquivo.name}`,
                            tamanho: tamanhoTotal
                        });
                    }
                }
                
                const progresso = (enviado / tamanhoTotal) * 100;
                onProgress(Math.min(progresso, 100));
                
            }, 100);
        });
    }
    
    async uploadMultiplos(arquivos, opcoes = {}) {
        const { concorrencia = 3 } = opcoes;
        const resultados = [];
        
        // Dividir em lotes para controlar concorrência
        for (let i = 0; i < arquivos.length; i += concorrencia) {
            const lote = arquivos.slice(i, i + concorrencia);
            
            const promisesLote = lote.map(arquivo => 
                this.uploadArquivo(arquivo, opcoes)
                    .catch(erro => ({ erro: erro.message, arquivo: arquivo.name }))
            );
            
            const resultadosLote = await Promise.all(promisesLote);
            resultados.push(...resultadosLote);
        }
        
        return resultados;
    }
    
    gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    obterStatus(id) {
        return this.uploads.get(id);
    }
    
    listarUploads() {
        return Array.from(this.uploads.entries()).map(([id, info]) => ({ id, ...info }));
    }
}

// Exemplo de uso do gerenciador de upload
async function exemploUpload() {
    const gerenciador = new GerenciadorUpload();
    
    // Simular arquivo
    const arquivo = {
        name: 'documento.pdf',
        size: 2000000 // 2MB
    };
    
    try {
        console.log('Iniciando upload...');
        
        const resultado = await gerenciador.uploadArquivo(arquivo, {
            onProgress: (progresso) => {
                console.log(`Progresso: ${progresso.toFixed(1)}%`);
            },
            onComplete: (resultado) => {
                console.log('Upload concluído:', resultado.url);
            },
            onError: (erro) => {
                console.error('Erro no upload:', erro.message);
            }
        });
        
        console.log('Resultado final:', resultado);
        
    } catch (erro) {
        console.error('Falha no upload:', erro.message);
    }
}

// ========================================
// 14. PADRÕES AVANÇADOS
// ========================================

// Padrão Observer para eventos assíncronos
class EventEmitterAssincrono {
    constructor() {
        this.listeners = new Map();
    }
    
    on(evento, callback) {
        if (!this.listeners.has(evento)) {
            this.listeners.set(evento, []);
        }
        this.listeners.get(evento).push(callback);
    }
    
    off(evento, callback) {
        if (this.listeners.has(evento)) {
            const callbacks = this.listeners.get(evento);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    async emit(evento, dados) {
        if (this.listeners.has(evento)) {
            const callbacks = this.listeners.get(evento);
            
            // Executar todos os callbacks em paralelo
            const promises = callbacks.map(callback => {
                try {
                    return Promise.resolve(callback(dados));
                } catch (erro) {
                    return Promise.reject(erro);
                }
            });
            
            // Aguardar todos ou capturar erros
            const resultados = await Promise.allSettled(promises);
            
            // Log de erros
            resultados.forEach((resultado, index) => {
                if (resultado.status === 'rejected') {
                    console.error(`Erro no listener ${index}:`, resultado.reason);
                }
            });
        }
    }
}

// Padrão Queue para processamento sequencial
class FilaAssincrona {
    constructor(concorrencia = 1) {
        this.fila = [];
        this.executando = 0;
        this.concorrencia = concorrencia;
    }
    
    async adicionar(tarefa) {
        return new Promise((resolve, reject) => {
            this.fila.push({
                tarefa,
                resolve,
                reject
            });
            
            this.processar();
        });
    }
    
    async processar() {
        if (this.executando >= this.concorrencia || this.fila.length === 0) {
            return;
        }
        
        this.executando++;
        const item = this.fila.shift();
        
        try {
            const resultado = await item.tarefa();
            item.resolve(resultado);
        } catch (erro) {
            item.reject(erro);
        } finally {
            this.executando--;
            this.processar(); // Processar próximo item
        }
    }
    
    obterStatus() {
        return {
            filaSize: this.fila.length,
            executando: this.executando,
            concorrencia: this.concorrencia
        };
    }
}

// ========================================
// 15. INICIALIZAÇÃO E EXERCÍCIOS
// ========================================

// Função principal para executar exemplos
async function executarExemplos() {
    console.log('=== EXECUTANDO EXEMPLOS ASSÍNCRONOS ==>');
    
    try {
        // Executar exemplos básicos
        await exemploAsyncAwait();
        await exemploPromiseAll();
        await exemploPromiseRace();
        await exemploPromiseAllSettled();
        
        // Exemplos de API (comentados para evitar requisições reais)
        // await exemploFetch();
        // await exemploApiClient();
        
        // Exemplos práticos
        await exemploCache();
        await exemploUpload();
        
        console.log('Todos os exemplos executados com sucesso!');
        
    } catch (erro) {
        console.error('Erro ao executar exemplos:', erro.message);
    }
}

// Executar quando o script for carregado
if (typeof window !== 'undefined') {
    // Ambiente do navegador
    document.addEventListener('DOMContentLoaded', executarExemplos);
} else {
    // Ambiente Node.js
    executarExemplos();
}

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

EXERCÍCIO 1: Sistema de Retry Inteligente
Crie uma função que:
- Tente executar uma operação assíncrona
- Implemente backoff exponencial (1s, 2s, 4s, 8s...)
- Tenha diferentes estratégias para diferentes tipos de erro
- Registre tentativas e sucessos/falhas
- Permita cancelamento

EXERCÍCIO 2: Pool de Conexões
Implemente:
- Pool de conexões simuladas
- Limite máximo de conexões simultâneas
- Fila de espera para requisições
- Timeout para conexões ociosas
- Métricas de uso

EXERCÍCIO 3: Sistema de Notificações Push
Crie:
- Simulação de servidor de notificações
- Cliente que se conecta e escuta notificações
- Retry automático em caso de desconexão
- Buffer de notificações offline
- Interface para mostrar notificações

EXERCÍCIO 4: Processador de Lote
Implemente:
- Sistema que processa itens em lotes
- Controle de concorrência
- Progresso em tempo real
- Tratamento de falhas parciais
- Relatório final de processamento

EXERCÍCIO 5: Cache Distribuído Simulado
Crie:
- Sistema de cache com múltiplas instâncias
- Sincronização entre caches
- Invalidação em cascata
- Estratégias de eviction (LRU, TTL)
- Métricas de hit/miss
*/

/*
========================================
BOAS PRÁTICAS E DICAS
========================================

PERFORMANCE:
1. Use Promise.all() para operações paralelas
2. Evite await desnecessário em loops
3. Implemente timeout para operações longas
4. Use cache para evitar requisições repetidas
5. Considere lazy loading para dados grandes

TRATAMENTO DE ERROS:
1. Sempre trate erros em operações assíncronas
2. Use try/catch com async/await
3. Implemente fallbacks para falhas
4. Log erros com contexto suficiente
5. Considere retry para erros temporários

CONCORRÊNCIA:
1. Limite concorrência para evitar sobrecarga
2. Use filas para controlar processamento
3. Implemente circuit breakers para serviços externos
4. Monitore uso de recursos
5. Considere worker threads para CPU intensiva

TESTES:
1. Mock operações assíncronas em testes
2. Teste cenários de erro e timeout
3. Use fake timers para testes determinísticos
4. Teste concorrência e condições de corrida
5. Valide cleanup de recursos

SEGURANÇA:
1. Valide dados de APIs externas
2. Implemente rate limiting
3. Use HTTPS para requisições
4. Sanitize dados antes de processar
5. Implemente autenticação adequada

DEBUG:
1. Use console.time() para medir performance
2. Adicione logs em pontos críticos
3. Use Promise.allSettled() para debug
4. Monitore memory leaks em operações longas
5. Use ferramentas de profiling
*/

console.log("\n=== ARQUIVO 08: ASYNC/PROMISES CONCLUÍDO ===");
console.log("Próximo: 09-es6-plus.js");
console.log("\nNOTA: Alguns exemplos podem precisar de um ambiente de servidor ou APIs reais para funcionar completamente.");