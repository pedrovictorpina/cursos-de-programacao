/*
========================================
EXERCÍCIOS PRÁTICOS - PROGRAMAÇÃO ASSÍNCRONA
========================================

Este arquivo contém 3 exercícios práticos para fixar os conceitos
de programação assíncrona em JavaScript:

1. Simulador de Requisições HTTP (Básico)
2. Sistema de Processamento de Arquivos em Lote (Intermediário)
3. Gerenciador de Tarefas Assíncronas (Avançado)

Cada exercício inclui:
• Implementação completa
• Explicações detalhadas
• Testes e demonstrações
• Conceitos aplicados
• Exercícios propostos

*/

console.log('🚀 EXERCÍCIOS PRÁTICOS - PROGRAMAÇÃO ASSÍNCRONA');
console.log('=' .repeat(50));

/*
========================================
EXERCÍCIO 1: SIMULADOR DE REQUISIÇÕES HTTP
========================================

Objetivo: Criar um simulador completo de requisições HTTP que demonstra
o uso de Promises, async/await, tratamento de erros, timeouts,
retries e cache de respostas.

Conceitos aplicados:
• Promises e async/await
• Fetch API simulation
• Error handling
• Timeout management
• Retry mechanisms
• Response caching
• Request interceptors
*/

console.log('\n🌐 EXERCÍCIO 1: Simulador de Requisições HTTP');

class SimuladorHTTP {
    constructor(opcoes = {}) {
        this.baseURL = opcoes.baseURL || '';
        this.timeout = opcoes.timeout || 5000;
        this.retries = opcoes.retries || 3;
        this.cache = new Map();
        this.interceptors = {
            request: [],
            response: []
        };
        this.estatisticas = {
            totalRequisicoes: 0,
            sucessos: 0,
            erros: 0,
            cacheHits: 0,
            tempoMedio: 0
        };
        this.debug = opcoes.debug || false;
    }
    
    // Simular delay de rede
    _simularDelay(min = 100, max = 2000) {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Simular resposta HTTP
    _simularResposta(url, opcoes) {
        return new Promise(async (resolve, reject) => {
            const inicioTempo = Date.now();
            
            try {
                // Simular delay de rede
                await this._simularDelay();
                
                // Simular diferentes cenários baseados na URL
                if (url.includes('/error')) {
                    throw new Error('Erro simulado do servidor');
                }
                
                if (url.includes('/timeout')) {
                    await this._simularDelay(6000, 8000); // Força timeout
                }
                
                if (url.includes('/slow')) {
                    await this._simularDelay(3000, 5000);
                }
                
                // Simular falha de rede aleatória (10% de chance)
                if (Math.random() < 0.1) {
                    throw new Error('Falha de rede simulada');
                }
                
                // Gerar resposta baseada no método e URL
                const resposta = this._gerarResposta(url, opcoes);
                
                const tempoResposta = Date.now() - inicioTempo;
                
                resolve({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    url,
                    headers: {
                        'content-type': 'application/json',
                        'x-response-time': `${tempoResposta}ms`
                    },
                    data: resposta,
                    tempoResposta,
                    json: () => Promise.resolve(resposta),
                    text: () => Promise.resolve(JSON.stringify(resposta))
                });
                
            } catch (error) {
                const tempoResposta = Date.now() - inicioTempo;
                reject({
                    error: error.message,
                    url,
                    tempoResposta,
                    status: 500
                });
            }
        });
    }
    
    // Gerar resposta simulada
    _gerarResposta(url, opcoes) {
        const metodo = opcoes.method || 'GET';
        const segmentos = url.split('/').filter(s => s);
        
        // Simular diferentes endpoints
        if (url.includes('/users')) {
            if (metodo === 'GET') {
                return {
                    users: [
                        { id: 1, nome: 'João', email: 'joao@email.com' },
                        { id: 2, nome: 'Maria', email: 'maria@email.com' },
                        { id: 3, nome: 'Pedro', email: 'pedro@email.com' }
                    ],
                    total: 3,
                    timestamp: Date.now()
                };
            } else if (metodo === 'POST') {
                return {
                    id: Math.floor(Math.random() * 1000),
                    ...JSON.parse(opcoes.body || '{}'),
                    criadoEm: new Date().toISOString()
                };
            }
        }
        
        if (url.includes('/posts')) {
            return {
                posts: [
                    { id: 1, titulo: 'Post 1', conteudo: 'Conteúdo do post 1' },
                    { id: 2, titulo: 'Post 2', conteudo: 'Conteúdo do post 2' }
                ],
                timestamp: Date.now()
            };
        }
        
        // Resposta padrão
        return {
            message: 'Resposta simulada',
            url,
            metodo,
            timestamp: Date.now()
        };
    }
    
    // Criar chave de cache
    _criarChaveCache(url, opcoes) {
        const metodo = opcoes.method || 'GET';
        const body = opcoes.body || '';
        return `${metodo}:${url}:${body}`;
    }
    
    // Aplicar interceptors de request
    async _aplicarInterceptorsRequest(url, opcoes) {
        let urlFinal = url;
        let opcoesFinal = { ...opcoes };
        
        for (const interceptor of this.interceptors.request) {
            const resultado = await interceptor(urlFinal, opcoesFinal);
            if (resultado) {
                urlFinal = resultado.url || urlFinal;
                opcoesFinal = resultado.opcoes || opcoesFinal;
            }
        }
        
        return { url: urlFinal, opcoes: opcoesFinal };
    }
    
    // Aplicar interceptors de response
    async _aplicarInterceptorsResponse(resposta) {
        let respostaFinal = resposta;
        
        for (const interceptor of this.interceptors.response) {
            const resultado = await interceptor(respostaFinal);
            if (resultado) {
                respostaFinal = resultado;
            }
        }
        
        return respostaFinal;
    }
    
    // Requisição principal com retry
    async _requisicaoComRetry(url, opcoes, tentativa = 1) {
        try {
            // Timeout Promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Timeout após ${this.timeout}ms`));
                }, this.timeout);
            });
            
            // Requisição Promise
            const requisicaoPromise = this._simularResposta(url, opcoes);
            
            // Race entre timeout e requisição
            const resposta = await Promise.race([requisicaoPromise, timeoutPromise]);
            
            return resposta;
            
        } catch (error) {
            if (tentativa < this.retries) {
                if (this.debug) {
                    console.log(`• Tentativa ${tentativa} falhou, tentando novamente...`);
                }
                
                // Delay exponencial entre tentativas
                const delay = Math.pow(2, tentativa) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return this._requisicaoComRetry(url, opcoes, tentativa + 1);
            }
            
            throw error;
        }
    }
    
    // Método principal de requisição
    async request(url, opcoes = {}) {
        const inicioTempo = Date.now();
        this.estatisticas.totalRequisicoes++;
        
        try {
            // Aplicar interceptors de request
            const { url: urlFinal, opcoes: opcoesFinal } = 
                await this._aplicarInterceptorsRequest(url, opcoes);
            
            // Verificar cache (apenas para GET)
            const metodo = opcoesFinal.method || 'GET';
            if (metodo === 'GET' && !opcoesFinal.noCache) {
                const chaveCache = this._criarChaveCache(urlFinal, opcoesFinal);
                
                if (this.cache.has(chaveCache)) {
                    const dadosCache = this.cache.get(chaveCache);
                    
                    // Verificar se o cache não expirou
                    if (Date.now() - dadosCache.timestamp < (opcoesFinal.cacheTime || 300000)) {
                        this.estatisticas.cacheHits++;
                        
                        if (this.debug) {
                            console.log(`• Cache hit para: ${urlFinal}`);
                        }
                        
                        return dadosCache.resposta;
                    } else {
                        this.cache.delete(chaveCache);
                    }
                }
            }
            
            // Fazer requisição com retry
            let resposta = await this._requisicaoComRetry(urlFinal, opcoesFinal);
            
            // Aplicar interceptors de response
            resposta = await this._aplicarInterceptorsResponse(resposta);
            
            // Armazenar no cache se for GET
            if (metodo === 'GET' && !opcoesFinal.noCache) {
                const chaveCache = this._criarChaveCache(urlFinal, opcoesFinal);
                this.cache.set(chaveCache, {
                    resposta,
                    timestamp: Date.now()
                });
            }
            
            // Atualizar estatísticas
            const tempoTotal = Date.now() - inicioTempo;
            this.estatisticas.sucessos++;
            this.estatisticas.tempoMedio = 
                (this.estatisticas.tempoMedio * (this.estatisticas.sucessos - 1) + tempoTotal) / 
                this.estatisticas.sucessos;
            
            if (this.debug) {
                console.log(`• Requisição bem-sucedida: ${urlFinal} (${tempoTotal}ms)`);
            }
            
            return resposta;
            
        } catch (error) {
            this.estatisticas.erros++;
            
            if (this.debug) {
                console.error(`• Erro na requisição: ${url}`, error);
            }
            
            throw error;
        }
    }
    
    // Métodos de conveniência
    async get(url, opcoes = {}) {
        return this.request(url, { ...opcoes, method: 'GET' });
    }
    
    async post(url, data, opcoes = {}) {
        return this.request(url, {
            ...opcoes,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            }
        });
    }
    
    async put(url, data, opcoes = {}) {
        return this.request(url, {
            ...opcoes,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...opcoes.headers
            }
        });
    }
    
    async delete(url, opcoes = {}) {
        return this.request(url, { ...opcoes, method: 'DELETE' });
    }
    
    // Requisições em paralelo
    async all(requisicoes) {
        const promises = requisicoes.map(req => {
            if (typeof req === 'string') {
                return this.get(req);
            } else {
                return this.request(req.url, req.opcoes);
            }
        });
        
        return Promise.all(promises);
    }
    
    // Requisições com limite de concorrência
    async allSettled(requisicoes) {
        const promises = requisicoes.map(req => {
            if (typeof req === 'string') {
                return this.get(req);
            } else {
                return this.request(req.url, req.opcoes);
            }
        });
        
        return Promise.allSettled(promises);
    }
    
    // Primeira requisição que resolver
    async race(requisicoes) {
        const promises = requisicoes.map(req => {
            if (typeof req === 'string') {
                return this.get(req);
            } else {
                return this.request(req.url, req.opcoes);
            }
        });
        
        return Promise.race(promises);
    }
    
    // Adicionar interceptor de request
    addRequestInterceptor(interceptor) {
        this.interceptors.request.push(interceptor);
        
        if (this.debug) {
            console.log('• Interceptor de request adicionado');
        }
    }
    
    // Adicionar interceptor de response
    addResponseInterceptor(interceptor) {
        this.interceptors.response.push(interceptor);
        
        if (this.debug) {
            console.log('• Interceptor de response adicionado');
        }
    }
    
    // Limpar cache
    limparCache() {
        const tamanho = this.cache.size;
        this.cache.clear();
        
        if (this.debug) {
            console.log(`• Cache limpo (${tamanho} entradas removidas)`);
        }
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        return {
            ...this.estatisticas,
            cacheSize: this.cache.size,
            taxaSucesso: this.estatisticas.totalRequisicoes > 0 ? 
                (this.estatisticas.sucessos / this.estatisticas.totalRequisicoes * 100).toFixed(2) + '%' : '0%',
            interceptors: {
                request: this.interceptors.request.length,
                response: this.interceptors.response.length
            }
        };
    }
}

// Demonstração do Simulador HTTP
console.log('\n🧪 Testando Simulador HTTP...');

const http = new SimuladorHTTP({
    baseURL: 'https://api.exemplo.com',
    timeout: 3000,
    retries: 2,
    debug: true
});

// Adicionar interceptors
http.addRequestInterceptor((url, opcoes) => {
    console.log(`📤 Request interceptor: ${opcoes.method || 'GET'} ${url}`);
    
    // Adicionar header de autenticação
    return {
        url,
        opcoes: {
            ...opcoes,
            headers: {
                'Authorization': 'Bearer token123',
                ...opcoes.headers
            }
        }
    };
});

http.addResponseInterceptor((resposta) => {
    console.log(`📥 Response interceptor: ${resposta.status} ${resposta.url}`);
    return resposta;
});

// Função para testar requisições
async function testarRequisicoes() {
    try {
        console.log('\n🔄 Testando requisições individuais...');
        
        // GET simples
        const usuarios = await http.get('/users');
        console.log('• Usuários obtidos:', usuarios.data.users.length);
        
        // POST com dados
        const novoUsuario = await http.post('/users', {
            nome: 'Novo Usuário',
            email: 'novo@email.com'
        });
        console.log('• Usuário criado:', novoUsuario.data.id);
        
        // Testar cache (segunda requisição deve usar cache)
        const usuariosCache = await http.get('/users');
        console.log('• Usuários do cache:', usuariosCache.data.users.length);
        
        console.log('\n🔄 Testando requisições em paralelo...');
        
        // Requisições em paralelo
        const resultados = await http.all([
            '/users',
            '/posts',
            { url: '/users', opcoes: { noCache: true } }
        ]);
        console.log('• Requisições paralelas concluídas:', resultados.length);
        
        console.log('\n🔄 Testando requisições com falhas...');
        
        // Testar com allSettled para capturar falhas
        const resultadosComFalhas = await http.allSettled([
            '/users',
            '/error', // Esta vai falhar
            '/posts'
        ]);
        
        const sucessos = resultadosComFalhas.filter(r => r.status === 'fulfilled').length;
        const falhas = resultadosComFalhas.filter(r => r.status === 'rejected').length;
        console.log(`• Sucessos: ${sucessos}, Falhas: ${falhas}`);
        
    } catch (error) {
        console.error('Erro no teste:', error);
    }
}

// Executar testes
testarRequisicoes().then(() => {
    console.log('\n📊 Estatísticas finais:', http.obterEstatisticas());
});

/*
========================================
EXERCÍCIO 2: SISTEMA DE PROCESSAMENTO DE ARQUIVOS EM LOTE
========================================

Objetivo: Implementar um sistema que processa múltiplos arquivos
de forma assíncrona, com controle de concorrência, progresso,
pausas/retomadas e tratamento de erros.

Conceitos aplicados:
• Async iterators
• Worker pools
• Progress tracking
• Queue management
• Error recovery
• Stream processing
*/

console.log('\n📁 EXERCÍCIO 2: Sistema de Processamento de Arquivos em Lote');

class ProcessadorArquivos {
    constructor(opcoes = {}) {
        this.maxConcorrencia = opcoes.maxConcorrencia || 3;
        this.filaProcessamento = [];
        this.processandoAtualmente = new Set();
        this.resultados = new Map();
        this.pausado = false;
        this.estatisticas = {
            totalArquivos: 0,
            processados: 0,
            erros: 0,
            tempoInicio: null,
            tempoFim: null
        };
        this.listeners = new Map();
        this.debug = opcoes.debug || false;
    }
    
    // Simular leitura de arquivo
    async _lerArquivo(arquivo) {
        // Simular tempo de leitura baseado no tamanho
        const tempoLeitura = Math.min(arquivo.tamanho / 1000, 3000);
        await new Promise(resolve => setTimeout(resolve, tempoLeitura));
        
        // Simular falha ocasional (5% de chance)
        if (Math.random() < 0.05) {
            throw new Error(`Erro ao ler arquivo: ${arquivo.nome}`);
        }
        
        return {
            nome: arquivo.nome,
            conteudo: `Conteúdo simulado do arquivo ${arquivo.nome}`,
            tamanho: arquivo.tamanho,
            tipo: arquivo.tipo,
            leituraEm: Date.now()
        };
    }
    
    // Simular processamento de arquivo
    async _processarArquivo(dadosArquivo) {
        const inicioProcessamento = Date.now();
        
        // Simular diferentes tipos de processamento
        let tempoProcessamento = 1000;
        let resultado = {};
        
        switch (dadosArquivo.tipo) {
            case 'imagem':
                tempoProcessamento = 2000;
                resultado = {
                    tipo: 'imagem',
                    dimensoes: { largura: 1920, altura: 1080 },
                    formato: 'JPEG',
                    compressao: '85%'
                };
                break;
                
            case 'video':
                tempoProcessamento = 5000;
                resultado = {
                    tipo: 'video',
                    duracao: '00:02:30',
                    resolucao: '1080p',
                    codec: 'H.264'
                };
                break;
                
            case 'documento':
                tempoProcessamento = 800;
                resultado = {
                    tipo: 'documento',
                    paginas: Math.floor(Math.random() * 50) + 1,
                    palavras: Math.floor(Math.random() * 5000) + 100,
                    formato: 'PDF'
                };
                break;
                
            default:
                resultado = {
                    tipo: 'generico',
                    processado: true
                };
        }
        
        await new Promise(resolve => setTimeout(resolve, tempoProcessamento));
        
        // Simular falha no processamento (3% de chance)
        if (Math.random() < 0.03) {
            throw new Error(`Erro no processamento: ${dadosArquivo.nome}`);
        }
        
        const fimProcessamento = Date.now();
        
        return {
            ...dadosArquivo,
            resultado,
            tempoProcessamento: fimProcessamento - inicioProcessamento,
            processadoEm: fimProcessamento
        };
    }
    
    // Processar um arquivo completo
    async _processarArquivoCompleto(arquivo) {
        const id = arquivo.id;
        
        try {
            this.processandoAtualmente.add(id);
            this._emitirEvento('arquivo:iniciado', { arquivo });
            
            if (this.debug) {
                console.log(`• Iniciando processamento: ${arquivo.nome}`);
            }
            
            // Ler arquivo
            const dadosArquivo = await this._lerArquivo(arquivo);
            this._emitirEvento('arquivo:lido', { arquivo, dadosArquivo });
            
            // Processar arquivo
            const resultado = await this._processarArquivo(dadosArquivo);
            
            // Armazenar resultado
            this.resultados.set(id, {
                sucesso: true,
                resultado,
                processadoEm: Date.now()
            });
            
            this.estatisticas.processados++;
            this._emitirEvento('arquivo:concluido', { arquivo, resultado });
            
            if (this.debug) {
                console.log(`• Concluído: ${arquivo.nome}`);
            }
            
            return resultado;
            
        } catch (error) {
            this.resultados.set(id, {
                sucesso: false,
                erro: error.message,
                processadoEm: Date.now()
            });
            
            this.estatisticas.erros++;
            this._emitirEvento('arquivo:erro', { arquivo, erro: error });
            
            if (this.debug) {
                console.error(`• Erro em ${arquivo.nome}:`, error.message);
            }
            
            throw error;
            
        } finally {
            this.processandoAtualmente.delete(id);
            this._verificarProximoArquivo();
        }
    }
    
    // Verificar e processar próximo arquivo da fila
    async _verificarProximoArquivo() {
        if (this.pausado || 
            this.processandoAtualmente.size >= this.maxConcorrencia ||
            this.filaProcessamento.length === 0) {
            return;
        }
        
        const proximoArquivo = this.filaProcessamento.shift();
        this._processarArquivoCompleto(proximoArquivo).catch(() => {
            // Erro já tratado no método _processarArquivoCompleto
        });
    }
    
    // Adicionar arquivo à fila
    adicionarArquivo(arquivo) {
        const arquivoComId = {
            id: this._gerarId(),
            nome: arquivo.nome,
            tamanho: arquivo.tamanho || Math.floor(Math.random() * 10000000),
            tipo: arquivo.tipo || 'generico',
            adicionadoEm: Date.now()
        };
        
        this.filaProcessamento.push(arquivoComId);
        this.estatisticas.totalArquivos++;
        
        this._emitirEvento('arquivo:adicionado', { arquivo: arquivoComId });
        
        if (this.debug) {
            console.log(`• Arquivo adicionado à fila: ${arquivo.nome}`);
        }
        
        // Tentar processar imediatamente
        this._verificarProximoArquivo();
        
        return arquivoComId.id;
    }
    
    // Adicionar múltiplos arquivos
    adicionarArquivos(arquivos) {
        return arquivos.map(arquivo => this.adicionarArquivo(arquivo));
    }
    
    // Iniciar processamento
    async iniciar() {
        if (this.estatisticas.tempoInicio) {
            throw new Error('Processamento já iniciado');
        }
        
        this.estatisticas.tempoInicio = Date.now();
        this.pausado = false;
        
        this._emitirEvento('processamento:iniciado', {
            totalArquivos: this.estatisticas.totalArquivos
        });
        
        if (this.debug) {
            console.log(`• Processamento iniciado (${this.estatisticas.totalArquivos} arquivos)`);
        }
        
        // Iniciar processamento dos arquivos
        for (let i = 0; i < this.maxConcorrencia; i++) {
            this._verificarProximoArquivo();
        }
        
        // Aguardar conclusão de todos os arquivos
        return this.aguardarConclusao();
    }
    
    // Pausar processamento
    pausar() {
        this.pausado = true;
        this._emitirEvento('processamento:pausado', {
            processandoAtualmente: this.processandoAtualmente.size,
            filaRestante: this.filaProcessamento.length
        });
        
        if (this.debug) {
            console.log('• Processamento pausado');
        }
    }
    
    // Retomar processamento
    retomar() {
        if (!this.pausado) return;
        
        this.pausado = false;
        this._emitirEvento('processamento:retomado', {
            filaRestante: this.filaProcessamento.length
        });
        
        if (this.debug) {
            console.log('• Processamento retomado');
        }
        
        // Retomar processamento
        for (let i = 0; i < this.maxConcorrencia; i++) {
            this._verificarProximoArquivo();
        }
    }
    
    // Aguardar conclusão de todos os arquivos
    async aguardarConclusao() {
        return new Promise((resolve) => {
            const verificar = () => {
                if (this.filaProcessamento.length === 0 && 
                    this.processandoAtualmente.size === 0) {
                    
                    this.estatisticas.tempoFim = Date.now();
                    this._emitirEvento('processamento:concluido', this.obterEstatisticas());
                    
                    if (this.debug) {
                        console.log('• Processamento concluído');
                    }
                    
                    resolve(this.obterEstatisticas());
                } else {
                    setTimeout(verificar, 100);
                }
            };
            
            verificar();
        });
    }
    
    // Obter progresso atual
    obterProgresso() {
        const total = this.estatisticas.totalArquivos;
        const concluidos = this.estatisticas.processados + this.estatisticas.erros;
        const porcentagem = total > 0 ? (concluidos / total * 100).toFixed(2) : 0;
        
        return {
            total,
            concluidos,
            processando: this.processandoAtualmente.size,
            fila: this.filaProcessamento.length,
            porcentagem: parseFloat(porcentagem),
            pausado: this.pausado
        };
    }
    
    // Obter estatísticas completas
    obterEstatisticas() {
        const progresso = this.obterProgresso();
        const tempoDecorrido = this.estatisticas.tempoFim ? 
            this.estatisticas.tempoFim - this.estatisticas.tempoInicio :
            Date.now() - (this.estatisticas.tempoInicio || Date.now());
        
        return {
            ...this.estatisticas,
            progresso,
            tempoDecorrido,
            arquivosPorSegundo: this.estatisticas.processados > 0 ? 
                (this.estatisticas.processados / (tempoDecorrido / 1000)).toFixed(2) : 0
        };
    }
    
    // Obter resultados
    obterResultados() {
        return Array.from(this.resultados.entries()).map(([id, resultado]) => ({
            id,
            ...resultado
        }));
    }
    
    // Event listener
    on(evento, callback) {
        if (!this.listeners.has(evento)) {
            this.listeners.set(evento, []);
        }
        this.listeners.get(evento).push(callback);
    }
    
    // Emitir evento
    _emitirEvento(evento, dados) {
        if (this.listeners.has(evento)) {
            this.listeners.get(evento).forEach(callback => {
                try {
                    callback(dados);
                } catch (error) {
                    console.error(`Erro no listener do evento ${evento}:`, error);
                }
            });
        }
    }
    
    // Gerar ID único
    _gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Limpar processador
    limpar() {
        this.filaProcessamento = [];
        this.processandoAtualmente.clear();
        this.resultados.clear();
        this.pausado = false;
        this.estatisticas = {
            totalArquivos: 0,
            processados: 0,
            erros: 0,
            tempoInicio: null,
            tempoFim: null
        };
        
        if (this.debug) {
            console.log('• Processador limpo');
        }
    }
}

// Demonstração do Processador de Arquivos
console.log('\n🧪 Testando Processador de Arquivos...');

const processador = new ProcessadorArquivos({
    maxConcorrencia: 2,
    debug: true
});

// Adicionar listeners de eventos
processador.on('arquivo:iniciado', (dados) => {
    console.log(`📂 Iniciando: ${dados.arquivo.nome}`);
});

processador.on('arquivo:concluido', (dados) => {
    console.log(`✅ Concluído: ${dados.arquivo.nome}`);
});

processador.on('arquivo:erro', (dados) => {
    console.log(`❌ Erro: ${dados.arquivo.nome} - ${dados.erro.message}`);
});

processador.on('processamento:concluido', (estatisticas) => {
    console.log('🎉 Processamento concluído!');
    console.log('📊 Estatísticas finais:', estatisticas);
});

// Função para testar processamento
async function testarProcessamento() {
    // Adicionar arquivos de teste
    const arquivos = [
        { nome: 'foto1.jpg', tipo: 'imagem', tamanho: 2048000 },
        { nome: 'video1.mp4', tipo: 'video', tamanho: 50000000 },
        { nome: 'documento1.pdf', tipo: 'documento', tamanho: 1024000 },
        { nome: 'foto2.png', tipo: 'imagem', tamanho: 3072000 },
        { nome: 'planilha1.xlsx', tipo: 'documento', tamanho: 512000 },
        { nome: 'video2.avi', tipo: 'video', tamanho: 75000000 },
        { nome: 'apresentacao.pptx', tipo: 'documento', tamanho: 2048000 }
    ];
    
    console.log('\n📁 Adicionando arquivos...');
    processador.adicionarArquivos(arquivos);
    
    // Monitorar progresso
    const intervalProgresso = setInterval(() => {
        const progresso = processador.obterProgresso();
        console.log(`📈 Progresso: ${progresso.porcentagem}% (${progresso.concluidos}/${progresso.total})`);
        
        if (progresso.porcentagem === 100) {
            clearInterval(intervalProgresso);
        }
    }, 2000);
    
    // Iniciar processamento
    console.log('\n🚀 Iniciando processamento...');
    const estatisticas = await processador.iniciar();
    
    clearInterval(intervalProgresso);
    
    // Mostrar resultados
    console.log('\n📋 Resultados:');
    const resultados = processador.obterResultados();
    resultados.forEach(resultado => {
        if (resultado.sucesso) {
            console.log(`✅ ${resultado.resultado.nome}: ${resultado.resultado.resultado.tipo}`);
        } else {
            console.log(`❌ Erro: ${resultado.erro}`);
        }
    });
}

// Executar teste
setTimeout(() => {
    testarProcessamento().catch(console.error);
}, 2000);

/*
========================================
EXERCÍCIO 3: GERENCIADOR DE TAREFAS ASSÍNCRONAS
========================================

Objetivo: Criar um sistema avançado de gerenciamento de tarefas
assíncronas com prioridades, dependências, agendamento,
monitoramento e recuperação de falhas.

Conceitos aplicados:
• Task scheduling
• Dependency management
• Priority queues
• Circuit breaker pattern
• Health monitoring
• Resource management
*/

console.log('\n⚙️ EXERCÍCIO 3: Gerenciador de Tarefas Assíncronas');

class GerenciadorTarefas {
    constructor(opcoes = {}) {
        this.maxConcorrencia = opcoes.maxConcorrencia || 5;
        this.filas = {
            alta: [],
            media: [],
            baixa: []
        };
        this.tarefasExecutando = new Map();
        this.tarefasCompletas = new Map();
        this.dependencias = new Map();
        this.agendamentos = new Map();
        this.circuitBreakers = new Map();
        this.recursos = new Map();
        this.estatisticas = {
            totalTarefas: 0,
            executadas: 0,
            falhadas: 0,
            canceladas: 0,
            tempoMedioExecucao: 0
        };
        this.ativo = false;
        this.listeners = new Map();
        this.debug = opcoes.debug || false;
        
        // Inicializar recursos padrão
        this.recursos.set('cpu', { limite: 100, usado: 0 });
        this.recursos.set('memoria', { limite: 1000, usado: 0 });
        this.recursos.set('rede', { limite: 10, usado: 0 });
    }
    
    // Criar tarefa
    criarTarefa(id, funcao, opcoes = {}) {
        const tarefa = {
            id,
            funcao,
            prioridade: opcoes.prioridade || 'media',
            dependencias: opcoes.dependencias || [],
            recursos: opcoes.recursos || {},
            timeout: opcoes.timeout || 30000,
            retries: opcoes.retries || 0,
            agendarPara: opcoes.agendarPara || null,
            criadaEm: Date.now(),
            status: 'pendente',
            tentativas: 0,
            resultado: null,
            erro: null
        };
        
        // Validar dependências
        for (const dep of tarefa.dependencias) {
            if (!this.tarefasCompletas.has(dep) && !this._tarefaExiste(dep)) {
                throw new Error(`Dependência não encontrada: ${dep}`);
            }
        }
        
        // Adicionar à fila apropriada ou agendar
        if (tarefa.agendarPara) {
            this._agendarTarefa(tarefa);
        } else {
            this._adicionarAFila(tarefa);
        }
        
        this.estatisticas.totalTarefas++;
        this._emitirEvento('tarefa:criada', { tarefa });
        
        if (this.debug) {
            console.log(`• Tarefa criada: ${id} (prioridade: ${tarefa.prioridade})`);
        }
        
        return tarefa;
    }
    
    // Verificar se tarefa existe
    _tarefaExiste(id) {
        return Object.values(this.filas).some(fila => 
            fila.some(t => t.id === id)
        ) || this.tarefasExecutando.has(id) || this.agendamentos.has(id);
    }
    
    // Adicionar tarefa à fila
    _adicionarAFila(tarefa) {
        // Verificar se dependências foram satisfeitas
        if (!this._dependenciasSatisfeitas(tarefa)) {
            // Aguardar dependências
            this.dependencias.set(tarefa.id, tarefa);
            return;
        }
        
        // Adicionar à fila de prioridade
        this.filas[tarefa.prioridade].push(tarefa);
        
        // Ordenar por prioridade (se necessário)
        if (tarefa.prioridade === 'alta') {
            this.filas.alta.sort((a, b) => a.criadaEm - b.criadaEm);
        }
    }
    
    // Verificar dependências
    _dependenciasSatisfeitas(tarefa) {
        return tarefa.dependencias.every(dep => {
            const tarefaCompleta = this.tarefasCompletas.get(dep);
            return tarefaCompleta && tarefaCompleta.status === 'sucesso';
        });
    }
    
    // Agendar tarefa
    _agendarTarefa(tarefa) {
        const delay = tarefa.agendarPara - Date.now();
        
        if (delay <= 0) {
            this._adicionarAFila(tarefa);
            return;
        }
        
        const timeoutId = setTimeout(() => {
            this.agendamentos.delete(tarefa.id);
            this._adicionarAFila(tarefa);
            this._emitirEvento('tarefa:agendada_executada', { tarefa });
        }, delay);
        
        this.agendamentos.set(tarefa.id, { tarefa, timeoutId });
        
        if (this.debug) {
            console.log(`• Tarefa agendada: ${tarefa.id} para ${new Date(tarefa.agendarPara).toLocaleTimeString()}`);
        }
    }
    
    // Obter próxima tarefa da fila
    _obterProximaTarefa() {
        // Prioridade: alta > media > baixa
        for (const prioridade of ['alta', 'media', 'baixa']) {
            const fila = this.filas[prioridade];
            if (fila.length > 0) {
                return fila.shift();
            }
        }
        return null;
    }
    
    // Verificar disponibilidade de recursos
    _recursosDisponiveis(recursosNecessarios) {
        for (const [recurso, quantidade] of Object.entries(recursosNecessarios)) {
            const recursoInfo = this.recursos.get(recurso);
            if (!recursoInfo || recursoInfo.usado + quantidade > recursoInfo.limite) {
                return false;
            }
        }
        return true;
    }
    
    // Alocar recursos
    _alocarRecursos(recursosNecessarios) {
        for (const [recurso, quantidade] of Object.entries(recursosNecessarios)) {
            const recursoInfo = this.recursos.get(recurso);
            recursoInfo.usado += quantidade;
        }
    }
    
    // Liberar recursos
    _liberarRecursos(recursosNecessarios) {
        for (const [recurso, quantidade] of Object.entries(recursosNecessarios)) {
            const recursoInfo = this.recursos.get(recurso);
            recursoInfo.usado = Math.max(0, recursoInfo.usado - quantidade);
        }
    }
    
    // Executar tarefa
    async _executarTarefa(tarefa) {
        const inicioExecucao = Date.now();
        
        try {
            // Verificar circuit breaker
            if (this._circuitBreakerAberto(tarefa.id)) {
                throw new Error('Circuit breaker aberto para esta tarefa');
            }
            
            // Alocar recursos
            this._alocarRecursos(tarefa.recursos);
            
            tarefa.status = 'executando';
            tarefa.inicioExecucao = inicioExecucao;
            this.tarefasExecutando.set(tarefa.id, tarefa);
            
            this._emitirEvento('tarefa:iniciada', { tarefa });
            
            if (this.debug) {
                console.log(`• Executando tarefa: ${tarefa.id}`);
            }
            
            // Criar promise com timeout
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`Timeout após ${tarefa.timeout}ms`));
                }, tarefa.timeout);
            });
            
            // Executar função da tarefa
            const resultadoPromise = tarefa.funcao();
            
            // Race entre execução e timeout
            const resultado = await Promise.race([resultadoPromise, timeoutPromise]);
            
            // Sucesso
            const tempoExecucao = Date.now() - inicioExecucao;
            tarefa.status = 'sucesso';
            tarefa.resultado = resultado;
            tarefa.tempoExecucao = tempoExecucao;
            
            this.tarefasCompletas.set(tarefa.id, tarefa);
            this.estatisticas.executadas++;
            
            // Atualizar tempo médio
            this.estatisticas.tempoMedioExecucao = 
                (this.estatisticas.tempoMedioExecucao * (this.estatisticas.executadas - 1) + tempoExecucao) / 
                this.estatisticas.executadas;
            
            this._emitirEvento('tarefa:sucesso', { tarefa, resultado });
            
            if (this.debug) {
                console.log(`• Tarefa concluída: ${tarefa.id} (${tempoExecucao}ms)`);
            }
            
            // Resetar circuit breaker em caso de sucesso
            this._resetarCircuitBreaker(tarefa.id);
            
            return resultado;
            
        } catch (error) {
            const tempoExecucao = Date.now() - inicioExecucao;
            tarefa.tentativas++;
            tarefa.erro = error.message;
            tarefa.tempoExecucao = tempoExecucao;
            
            // Verificar se deve tentar novamente
            if (tarefa.tentativas < tarefa.retries + 1) {
                tarefa.status = 'pendente';
                
                // Delay exponencial para retry
                const delay = Math.pow(2, tarefa.tentativas) * 1000;
                
                setTimeout(() => {
                    this._adicionarAFila(tarefa);
                }, delay);
                
                this._emitirEvento('tarefa:retry', { tarefa, tentativa: tarefa.tentativas });
                
                if (this.debug) {
                    console.log(`• Retry ${tarefa.tentativas}/${tarefa.retries + 1}: ${tarefa.id}`);
                }
                
            } else {
                // Falha definitiva
                tarefa.status = 'falha';
                this.tarefasCompletas.set(tarefa.id, tarefa);
                this.estatisticas.falhadas++;
                
                this._emitirEvento('tarefa:falha', { tarefa, erro: error });
                
                if (this.debug) {
                    console.error(`• Tarefa falhada: ${tarefa.id} - ${error.message}`);
                }
                
                // Atualizar circuit breaker
                this._atualizarCircuitBreaker(tarefa.id, false);
            }
            
        } finally {
            // Liberar recursos
            this._liberarRecursos(tarefa.recursos);
            this.tarefasExecutando.delete(tarefa.id);
            
            // Verificar dependências que podem ser liberadas
            this._verificarDependencias();
            
            // Continuar processamento
            this._processarProximaTarefa();
        }
    }
    
    // Verificar e liberar dependências
    _verificarDependencias() {
        const tarefasLiberadas = [];
        
        for (const [id, tarefa] of this.dependencias.entries()) {
            if (this._dependenciasSatisfeitas(tarefa)) {
                this.dependencias.delete(id);
                this._adicionarAFila(tarefa);
                tarefasLiberadas.push(tarefa);
            }
        }
        
        if (tarefasLiberadas.length > 0 && this.debug) {
            console.log(`• ${tarefasLiberadas.length} tarefas liberadas por dependências`);
        }
    }
    
    // Processar próxima tarefa
    async _processarProximaTarefa() {
        if (!this.ativo || this.tarefasExecutando.size >= this.maxConcorrencia) {
            return;
        }
        
        const proximaTarefa = this._obterProximaTarefa();
        if (!proximaTarefa) {
            return;
        }
        
        // Verificar recursos
        if (!this._recursosDisponiveis(proximaTarefa.recursos)) {
            // Recolocar na fila
            this.filas[proximaTarefa.prioridade].unshift(proximaTarefa);
            return;
        }
        
        // Executar tarefa
        this._executarTarefa(proximaTarefa).catch(() => {
            // Erro já tratado em _executarTarefa
        });
    }
    
    // Circuit breaker methods
    _circuitBreakerAberto(tarefaId) {
        const cb = this.circuitBreakers.get(tarefaId);
        if (!cb) return false;
        
        if (cb.estado === 'aberto') {
            if (Date.now() - cb.ultimaFalha > cb.timeout) {
                cb.estado = 'meio-aberto';
                return false;
            }
            return true;
        }
        
        return false;
    }
    
    _atualizarCircuitBreaker(tarefaId, sucesso) {
        let cb = this.circuitBreakers.get(tarefaId);
        
        if (!cb) {
            cb = {
                falhas: 0,
                sucessos: 0,
                estado: 'fechado',
                ultimaFalha: null,
                timeout: 60000 // 1 minuto
            };
            this.circuitBreakers.set(tarefaId, cb);
        }
        
        if (sucesso) {
            cb.sucessos++;
            cb.falhas = 0;
            cb.estado = 'fechado';
        } else {
            cb.falhas++;
            cb.ultimaFalha = Date.now();
            
            if (cb.falhas >= 5) {
                cb.estado = 'aberto';
                
                if (this.debug) {
                    console.log(`• Circuit breaker aberto para: ${tarefaId}`);
                }
            }
        }
    }
    
    _resetarCircuitBreaker(tarefaId) {
        this._atualizarCircuitBreaker(tarefaId, true);
    }
    
    // Iniciar gerenciador
    iniciar() {
        if (this.ativo) {
            throw new Error('Gerenciador já está ativo');
        }
        
        this.ativo = true;
        this._emitirEvento('gerenciador:iniciado', {});
        
        if (this.debug) {
            console.log('• Gerenciador de tarefas iniciado');
        }
        
        // Iniciar processamento
        for (let i = 0; i < this.maxConcorrencia; i++) {
            this._processarProximaTarefa();
        }
    }
    
    // Parar gerenciador
    async parar() {
        this.ativo = false;
        
        // Aguardar conclusão das tarefas em execução
        while (this.tarefasExecutando.size > 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Cancelar agendamentos
        for (const [id, agendamento] of this.agendamentos.entries()) {
            clearTimeout(agendamento.timeoutId);
            this.agendamentos.delete(id);
        }
        
        this._emitirEvento('gerenciador:parado', {});
        
        if (this.debug) {
            console.log('• Gerenciador de tarefas parado');
        }
    }
    
    // Cancelar tarefa
    cancelarTarefa(id) {
        // Verificar se está agendada
        if (this.agendamentos.has(id)) {
            const agendamento = this.agendamentos.get(id);
            clearTimeout(agendamento.timeoutId);
            this.agendamentos.delete(id);
            this.estatisticas.canceladas++;
            
            this._emitirEvento('tarefa:cancelada', { tarefaId: id });
            return true;
        }
        
        // Verificar se está nas filas
        for (const fila of Object.values(this.filas)) {
            const index = fila.findIndex(t => t.id === id);
            if (index !== -1) {
                const tarefa = fila.splice(index, 1)[0];
                tarefa.status = 'cancelada';
                this.tarefasCompletas.set(id, tarefa);
                this.estatisticas.canceladas++;
                
                this._emitirEvento('tarefa:cancelada', { tarefa });
                return true;
            }
        }
        
        return false;
    }
    
    // Obter status de tarefa
    obterStatusTarefa(id) {
        // Verificar se está executando
        if (this.tarefasExecutando.has(id)) {
            return this.tarefasExecutando.get(id);
        }
        
        // Verificar se está completa
        if (this.tarefasCompletas.has(id)) {
            return this.tarefasCompletas.get(id);
        }
        
        // Verificar se está agendada
        if (this.agendamentos.has(id)) {
            return {
                ...this.agendamentos.get(id).tarefa,
                status: 'agendada'
            };
        }
        
        // Verificar se está aguardando dependências
        if (this.dependencias.has(id)) {
            return {
                ...this.dependencias.get(id),
                status: 'aguardando_dependencias'
            };
        }
        
        // Verificar se está nas filas
        for (const fila of Object.values(this.filas)) {
            const tarefa = fila.find(t => t.id === id);
            if (tarefa) {
                return tarefa;
            }
        }
        
        return null;
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        const filaTotal = Object.values(this.filas).reduce((total, fila) => total + fila.length, 0);
        
        return {
            ...this.estatisticas,
            executando: this.tarefasExecutando.size,
            filaTotal,
            agendadas: this.agendamentos.size,
            aguardandoDependencias: this.dependencias.size,
            recursos: Object.fromEntries(this.recursos.entries()),
            circuitBreakers: this.circuitBreakers.size,
            ativo: this.ativo
        };
    }
    
    // Event listener
    on(evento, callback) {
        if (!this.listeners.has(evento)) {
            this.listeners.set(evento, []);
        }
        this.listeners.get(evento).push(callback);
    }
    
    // Emitir evento
    _emitirEvento(evento, dados) {
        if (this.listeners.has(evento)) {
            this.listeners.get(evento).forEach(callback => {
                try {
                    callback(dados);
                } catch (error) {
                    console.error(`Erro no listener do evento ${evento}:`, error);
                }
            });
        }
    }
}

// Demonstração do Gerenciador de Tarefas
console.log('\n🧪 Testando Gerenciador de Tarefas...');

const gerenciador = new GerenciadorTarefas({
    maxConcorrencia: 3,
    debug: true
});

// Adicionar listeners
gerenciador.on('tarefa:sucesso', (dados) => {
    console.log(`✅ Tarefa concluída: ${dados.tarefa.id}`);
});

gerenciador.on('tarefa:falha', (dados) => {
    console.log(`❌ Tarefa falhada: ${dados.tarefa.id} - ${dados.erro.message}`);
});

// Função para testar gerenciador
async function testarGerenciador() {
    console.log('\n⚙️ Criando tarefas...');
    
    // Tarefa simples
    gerenciador.criarTarefa('tarefa1', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return 'Resultado da tarefa 1';
    }, {
        prioridade: 'alta',
        recursos: { cpu: 10, memoria: 50 }
    });
    
    // Tarefa com dependência
    gerenciador.criarTarefa('tarefa2', async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return 'Resultado da tarefa 2';
    }, {
        prioridade: 'media',
        dependencias: ['tarefa1'],
        recursos: { cpu: 20, memoria: 100 }
    });
    
    // Tarefa agendada
    gerenciador.criarTarefa('tarefa3', async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return 'Resultado da tarefa 3';
    }, {
        prioridade: 'baixa',
        agendarPara: Date.now() + 3000, // 3 segundos no futuro
        recursos: { rede: 2 }
    });
    
    // Tarefa que pode falhar
    gerenciador.criarTarefa('tarefa4', async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (Math.random() < 0.7) {
            throw new Error('Falha simulada');
        }
        return 'Resultado da tarefa 4';
    }, {
        prioridade: 'alta',
        retries: 3,
        recursos: { cpu: 15 }
    });
    
    // Tarefa com timeout
    gerenciador.criarTarefa('tarefa5', async () => {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Vai dar timeout
        return 'Resultado da tarefa 5';
    }, {
        prioridade: 'media',
        timeout: 2000,
        recursos: { memoria: 200 }
    });
    
    console.log('\n🚀 Iniciando gerenciador...');
    gerenciador.iniciar();
    
    // Monitorar progresso
    const intervalEstatisticas = setInterval(() => {
        const stats = gerenciador.obterEstatisticas();
        console.log(`📊 Executando: ${stats.executando}, Fila: ${stats.filaTotal}, Concluídas: ${stats.executadas}`);
        
        if (stats.executando === 0 && stats.filaTotal === 0 && stats.agendadas === 0) {
            clearInterval(intervalEstatisticas);
            console.log('\n🎉 Todas as tarefas processadas!');
            console.log('📈 Estatísticas finais:', stats);
        }
    }, 1000);
}

// Executar teste após um delay
setTimeout(() => {
    testarGerenciador().catch(console.error);
}, 5000);

/*
========================================
CONCEITOS APLICADOS
========================================

1. PROMISES E ASYNC/AWAIT:
   • Uso correto de async/await para código assíncrono limpo
   • Promise.all, Promise.allSettled, Promise.race
   • Tratamento de erros com try/catch
   • Criação de Promises customizadas

2. CONTROLE DE CONCORRÊNCIA:
   • Limitação do número de operações simultâneas
   • Filas de prioridade para gerenciar ordem de execução
   • Pool de workers para processamento paralelo

3. TIMEOUT E RETRY:
   • Implementação de timeouts para evitar travamentos
   • Estratégias de retry com backoff exponencial
   • Circuit breaker pattern para falhas recorrentes

4. GERENCIAMENTO DE RECURSOS:
   • Controle de uso de CPU, memória e rede
   • Alocação e liberação automática de recursos
   • Prevenção de sobrecarga do sistema

5. SISTEMA DE EVENTOS:
   • Event emitters para comunicação assíncrona
   • Listeners para monitoramento de progresso
   • Desacoplamento através de eventos

6. CACHE E INTERCEPTORS:
   • Cache inteligente com expiração
   • Interceptors para modificar requests/responses
   • Otimização de performance

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. TRATAMENTO DE ERROS:
   • Sempre capturar e tratar erros adequadamente
   • Logs detalhados para debugging
   • Fallbacks para cenários de falha

2. PERFORMANCE:
   • Evitar blocking operations
   • Usar Promise.all para operações paralelas
   • Implementar cache quando apropriado

3. MONITORAMENTO:
   • Estatísticas detalhadas de execução
   • Eventos para tracking de progresso
   • Métricas de performance

4. CONFIGURABILIDADE:
   • Parâmetros ajustáveis (timeout, retries, concorrência)
   • Modo debug para desenvolvimento
   • Flexibilidade na configuração

5. ESCALABILIDADE:
   • Arquitetura que suporta crescimento
   • Gerenciamento eficiente de recursos
   • Padrões que facilitam manutenção

========================================
EXERCÍCIOS PROPOSTOS
========================================

BÁSICO:
1. Criar uma função que faz múltiplas requisições HTTP em paralelo
2. Implementar um sistema de retry simples
3. Criar um cache básico para requisições

INTERMEDIÁRIO:
4. Implementar um rate limiter para APIs
5. Criar um sistema de filas com prioridades
6. Desenvolver um monitor de health para serviços

AVANÇADO:
7. Implementar um sistema de streaming de dados
8. Criar um orchestrator de microserviços
9. Desenvolver um sistema de backup assíncrono
10. Implementar um load balancer com circuit breaker

========================================
FERRAMENTAS RECOMENDADAS
========================================

• Node.js: Para desenvolvimento backend
• Axios: Cliente HTTP com interceptors
• Bull: Sistema de filas robusto
• Async: Utilitários para programação assíncrona
• Bluebird: Biblioteca de Promises avançada
• RxJS: Programação reativa
• Socket.io: Comunicação em tempo real
• Redis: Cache e pub/sub

*/

console.log('\n🎓 EXERCÍCIOS DE PROGRAMAÇÃO ASSÍNCRONA CONCLUÍDOS!');
console.log('📚 Conceitos cobertos: Promises, async/await, concorrência, timeouts, retries, cache, eventos');
console.log('🚀 Próximo passo: Pratique implementando seus próprios sistemas assíncronos!');

/*
========================================
DEMONSTRAÇÃO FINAL - INTEGRAÇÃO DOS EXERCÍCIOS
========================================

Este exemplo mostra como integrar os três exercícios em um
sistema completo de processamento assíncrono.
*/

class SistemaProcessamentoCompleto {
    constructor() {
        this.http = new SimuladorHTTP({ debug: false });
        this.processador = new ProcessadorArquivos({ maxConcorrencia: 2, debug: false });
        this.gerenciador = new GerenciadorTarefas({ maxConcorrencia: 3, debug: false });
    }
    
    async executarFluxoCompleto() {
        console.log('\n🔄 Executando fluxo completo de processamento...');
        
        // 1. Buscar lista de arquivos via HTTP
        const listaArquivos = await this.http.get('/arquivos');
        
        // 2. Processar arquivos em lote
        const arquivos = [
            { nome: 'relatorio.pdf', tipo: 'documento' },
            { nome: 'foto.jpg', tipo: 'imagem' },
            { nome: 'video.mp4', tipo: 'video' }
        ];
        
        this.processador.adicionarArquivos(arquivos);
        const resultadosProcessamento = await this.processador.iniciar();
        
        // 3. Criar tarefas baseadas nos resultados
        this.gerenciador.criarTarefa('upload_resultados', async () => {
            const resultados = this.processador.obterResultados();
            return await this.http.post('/resultados', { resultados });
        });
        
        this.gerenciador.criarTarefa('gerar_relatorio', async () => {
            return await this.http.post('/relatorio', {
                estatisticas: resultadosProcessamento
            });
        }, {
            dependencias: ['upload_resultados']
        });
        
        this.gerenciador.iniciar();
        
        console.log('✅ Fluxo completo iniciado!');
    }
}

// Demonstração final
setTimeout(() => {
    const sistema = new SistemaProcessamentoCompleto();
    sistema.executarFluxoCompleto().catch(console.error);
}, 8000);