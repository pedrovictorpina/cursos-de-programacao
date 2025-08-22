/*
===========================================
    MÓDULO 08 - ASSINCRONISMO
    Aula 04: Fetch API (Requisições HTTP)
===========================================

Objetivos de Aprendizagem:
✓ Dominar a Fetch API moderna
✓ Implementar requisições HTTP completas
✓ Gerenciar diferentes tipos de resposta
✓ Criar interceptadores e middleware
✓ Implementar cache e retry inteligente
✓ Construir cliente HTTP robusto
*/

// ===========================================
// 1. TEORIA: FETCH API
// ===========================================

/*
FETCH API EM JAVASCRIPT:

1. CONCEITO:
   - API moderna para requisições HTTP
   - Substitui XMLHttpRequest (XHR)
   - Baseada em Promises
   - Suporte nativo a async/await
   - Mais limpa e poderosa

2. CARACTERÍSTICAS:
   - Retorna Promise<Response>
   - Não rejeita para códigos 4xx/5xx
   - Suporte a streams
   - Configuração flexível
   - Cancelamento com AbortController

3. MÉTODOS HTTP:
   - GET: Buscar dados
   - POST: Criar recursos
   - PUT: Atualizar recursos (completo)
   - PATCH: Atualizar recursos (parcial)
   - DELETE: Remover recursos
   - HEAD: Apenas headers
   - OPTIONS: Verificar métodos permitidos

4. TIPOS DE CONTEÚDO:
   - JSON: application/json
   - Form Data: multipart/form-data
   - URL Encoded: application/x-www-form-urlencoded
   - Text: text/plain
   - Binary: application/octet-stream

5. HEADERS IMPORTANTES:
   - Content-Type: Tipo do conteúdo
   - Authorization: Autenticação
   - Accept: Tipos aceitos
   - User-Agent: Identificação do cliente
   - Cache-Control: Controle de cache
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Fetch Básico ---
console.log('=== FETCH BÁSICO ===');

// Simulador de API local (para testes)
class APISimulator {
    static baseURL = 'https://jsonplaceholder.typicode.com';
    
    // Simular delay de rede
    static async delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Simular resposta de API
    static async mockResponse(data, status = 200, delay = 300) {
        await this.delay(delay);
        
        if (status >= 400) {
            throw new Error(`HTTP ${status}: ${data.message || 'Erro na requisição'}`);
        }
        
        return {
            ok: status >= 200 && status < 300,
            status,
            statusText: status === 200 ? 'OK' : 'Error',
            json: async () => data,
            text: async () => JSON.stringify(data),
            headers: new Map([
                ['content-type', 'application/json'],
                ['date', new Date().toISOString()]
            ])
        };
    }
}

// Exemplos básicos de fetch
async function exemplosFetchBasico() {
    console.log('\n--- Fetch Básico ---');
    
    try {
        // === GET SIMPLES ===
        console.log('🔄 Fazendo requisição GET...');
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        
        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const post = await response.json();
        console.log('✅ Post recebido:', {
            id: post.id,
            titulo: post.title.substring(0, 30) + '...',
            userId: post.userId
        });
        
        // === GET COM PARÂMETROS ===
        console.log('\n🔄 GET com parâmetros...');
        
        const params = new URLSearchParams({
            userId: '1',
            _limit: '3'
        });
        
        const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`);
        const posts = await postsResponse.json();
        
        console.log(`✅ ${posts.length} posts do usuário 1:`);
        posts.forEach(post => {
            console.log(`  📄 ${post.id}: ${post.title.substring(0, 40)}...`);
        });
        
        // === POST COM DADOS ===
        console.log('\n🔄 POST criando novo post...');
        
        const novoPost = {
            title: 'Meu Novo Post',
            body: 'Este é o conteúdo do meu novo post sobre JavaScript!',
            userId: 1
        };
        
        const createResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoPost)
        });
        
        const postCriado = await createResponse.json();
        console.log('✅ Post criado:', {
            id: postCriado.id,
            titulo: postCriado.title
        });
        
        // === PUT ATUALIZANDO ===
        console.log('\n🔄 PUT atualizando post...');
        
        const postAtualizado = {
            id: 1,
            title: 'Post Atualizado',
            body: 'Conteúdo atualizado do post',
            userId: 1
        };
        
        const updateResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postAtualizado)
        });
        
        const postAtualizadoResult = await updateResponse.json();
        console.log('✅ Post atualizado:', {
            id: postAtualizadoResult.id,
            titulo: postAtualizadoResult.title
        });
        
        // === DELETE ===
        console.log('\n🔄 DELETE removendo post...');
        
        const deleteResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'DELETE'
        });
        
        if (deleteResponse.ok) {
            console.log('✅ Post removido com sucesso');
        }
        
    } catch (error) {
        console.error('❌ Erro na requisição:', error.message);
    }
}

// Executar exemplos básicos
setTimeout(exemplosFetchBasico, 1000);

// --- 2.2 Cliente HTTP Avançado ---
console.log('\n=== CLIENTE HTTP AVANÇADO ===');

class HTTPClient {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };
        this.timeout = options.timeout || 10000;
        this.retryAttempts = options.retryAttempts || 3;
        this.retryDelay = options.retryDelay || 1000;
        
        // Interceptadores
        this.requestInterceptors = [];
        this.responseInterceptors = [];
        
        // Cache simples
        this.cache = new Map();
        this.cacheTimeout = options.cacheTimeout || 300000; // 5 minutos
        
        // Estatísticas
        this.stats = {
            requests: 0,
            successes: 0,
            errors: 0,
            cacheHits: 0,
            totalTime: 0
        };
    }
    
    // Adicionar interceptador de requisição
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    
    // Adicionar interceptador de resposta
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
    
    // Aplicar interceptadores de requisição
    async applyRequestInterceptors(config) {
        let processedConfig = { ...config };
        
        for (const interceptor of this.requestInterceptors) {
            try {
                processedConfig = await interceptor(processedConfig);
            } catch (error) {
                console.error('❌ Erro no interceptador de requisição:', error.message);
            }
        }
        
        return processedConfig;
    }
    
    // Aplicar interceptadores de resposta
    async applyResponseInterceptors(response, config) {
        let processedResponse = response;
        
        for (const interceptor of this.responseInterceptors) {
            try {
                processedResponse = await interceptor(processedResponse, config);
            } catch (error) {
                console.error('❌ Erro no interceptador de resposta:', error.message);
            }
        }
        
        return processedResponse;
    }
    
    // Gerar chave de cache
    generateCacheKey(url, options) {
        const key = `${options.method || 'GET'}:${url}`;
        if (options.body) {
            const bodyHash = this.simpleHash(options.body);
            return `${key}:${bodyHash}`;
        }
        return key;
    }
    
    // Hash simples para cache
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
    
    // Verificar cache
    checkCache(cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            this.stats.cacheHits++;
            return cached.data;
        }
        return null;
    }
    
    // Salvar no cache
    saveToCache(cacheKey, data) {
        this.cache.set(cacheKey, {
            data,
            timestamp: Date.now()
        });
    }
    
    // Requisição principal
    async request(url, options = {}) {
        const startTime = Date.now();
        this.stats.requests++;
        
        try {
            // Construir URL completa
            const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
            
            // Configuração inicial
            let config = {
                method: 'GET',
                headers: { ...this.defaultHeaders },
                ...options
            };
            
            // Aplicar interceptadores de requisição
            config = await this.applyRequestInterceptors(config);
            
            // Verificar cache para GET
            if (config.method === 'GET' && !config.noCache) {
                const cacheKey = this.generateCacheKey(fullURL, config);
                const cached = this.checkCache(cacheKey);
                if (cached) {
                    console.log('📦 Cache hit para:', fullURL);
                    return cached;
                }
            }
            
            // Configurar timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            config.signal = controller.signal;
            
            // Fazer requisição com retry
            let lastError;
            for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
                try {
                    console.log(`🔄 Tentativa ${attempt}/${this.retryAttempts}: ${config.method} ${fullURL}`);
                    
                    const response = await fetch(fullURL, config);
                    clearTimeout(timeoutId);
                    
                    // Verificar se a resposta foi bem-sucedida
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    // Processar resposta
                    const processedResponse = await this.processResponse(response);
                    
                    // Aplicar interceptadores de resposta
                    const finalResponse = await this.applyResponseInterceptors(processedResponse, config);
                    
                    // Salvar no cache se for GET
                    if (config.method === 'GET' && !config.noCache) {
                        const cacheKey = this.generateCacheKey(fullURL, config);
                        this.saveToCache(cacheKey, finalResponse);
                    }
                    
                    // Atualizar estatísticas
                    this.stats.successes++;
                    this.stats.totalTime += Date.now() - startTime;
                    
                    console.log(`✅ Requisição bem-sucedida em ${Date.now() - startTime}ms`);
                    return finalResponse;
                    
                } catch (error) {
                    lastError = error;
                    clearTimeout(timeoutId);
                    
                    if (error.name === 'AbortError') {
                        throw new Error(`Timeout de ${this.timeout}ms excedido`);
                    }
                    
                    console.log(`❌ Tentativa ${attempt} falhou: ${error.message}`);
                    
                    // Não fazer retry para alguns tipos de erro
                    if (this.shouldNotRetry(error)) {
                        break;
                    }
                    
                    // Aguardar antes da próxima tentativa
                    if (attempt < this.retryAttempts) {
                        const delay = this.retryDelay * Math.pow(2, attempt - 1);
                        console.log(`⏱️ Aguardando ${delay}ms antes da próxima tentativa...`);
                        await this.delay(delay);
                    }
                }
            }
            
            throw lastError;
            
        } catch (error) {
            this.stats.errors++;
            this.stats.totalTime += Date.now() - startTime;
            console.error(`❌ Requisição falhou após ${Date.now() - startTime}ms:`, error.message);
            throw error;
        }
    }
    
    // Verificar se deve fazer retry
    shouldNotRetry(error) {
        // Não fazer retry para erros 4xx (exceto 408, 429)
        if (error.message.includes('HTTP 4')) {
            const status = parseInt(error.message.match(/HTTP (\d+)/)?.[1]);
            return status !== 408 && status !== 429;
        }
        return false;
    }
    
    // Processar resposta
    async processResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        
        let data;
        if (contentType.includes('application/json')) {
            data = await response.json();
        } else if (contentType.includes('text/')) {
            data = await response.text();
        } else {
            data = await response.blob();
        }
        
        return {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            url: response.url
        };
    }
    
    // Delay simples
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Métodos de conveniência
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }
    
    async post(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async patch(url, data, options = {}) {
        return this.request(url, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
    
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
    
    // Upload de arquivo
    async upload(url, file, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Adicionar campos extras se fornecidos
        if (options.fields) {
            Object.entries(options.fields).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
        
        return this.request(url, {
            ...options,
            method: 'POST',
            body: formData,
            headers: {
                // Remover Content-Type para FormData
                ...Object.fromEntries(
                    Object.entries(this.defaultHeaders)
                        .filter(([key]) => key.toLowerCase() !== 'content-type')
                ),
                ...options.headers
            }
        });
    }
    
    // Limpar cache
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache limpo');
    }
    
    // Obter estatísticas
    getStats() {
        return {
            ...this.stats,
            averageTime: this.stats.requests > 0 
                ? Math.round(this.stats.totalTime / this.stats.requests)
                : 0,
            successRate: this.stats.requests > 0
                ? ((this.stats.successes / this.stats.requests) * 100).toFixed(1) + '%'
                : '0%',
            cacheHitRate: this.stats.requests > 0
                ? ((this.stats.cacheHits / this.stats.requests) * 100).toFixed(1) + '%'
                : '0%'
        };
    }
}

// Exemplo de uso do cliente HTTP avançado
async function exemploClienteHTTP() {
    console.log('\n--- Cliente HTTP Avançado ---');
    
    const client = new HTTPClient({
        baseURL: 'https://jsonplaceholder.typicode.com',
        timeout: 5000,
        retryAttempts: 2,
        retryDelay: 1000,
        cacheTimeout: 60000 // 1 minuto
    });
    
    // Adicionar interceptador de requisição (autenticação)
    client.addRequestInterceptor(async (config) => {
        console.log('🔐 Interceptador: Adicionando token de autenticação');
        config.headers['Authorization'] = 'Bearer fake-jwt-token';
        return config;
    });
    
    // Adicionar interceptador de resposta (logging)
    client.addResponseInterceptor(async (response, config) => {
        console.log(`📊 Interceptador: ${config.method} ${response.url} - ${response.status}`);
        return response;
    });
    
    try {
        // Testar diferentes métodos
        console.log('\n🔄 Testando métodos HTTP...');
        
        // GET
        const posts = await client.get('/posts?_limit=3');
        console.log(`✅ GET: Recebidos ${posts.data.length} posts`);
        
        // GET com cache (segunda chamada)
        const postsCache = await client.get('/posts?_limit=3');
        console.log(`✅ GET (cache): Recebidos ${postsCache.data.length} posts`);
        
        // POST
        const novoPost = {
            title: 'Post via Cliente HTTP',
            body: 'Conteúdo do post criado via cliente HTTP avançado',
            userId: 1
        };
        
        const postCriado = await client.post('/posts', novoPost);
        console.log(`✅ POST: Post criado com ID ${postCriado.data.id}`);
        
        // PUT
        const postAtualizado = {
            ...novoPost,
            title: 'Post Atualizado via Cliente HTTP'
        };
        
        const postAtualizadoResult = await client.put('/posts/1', postAtualizado);
        console.log(`✅ PUT: Post ${postAtualizadoResult.data.id} atualizado`);
        
        // DELETE
        await client.delete('/posts/1');
        console.log('✅ DELETE: Post removido');
        
        // Mostrar estatísticas
        console.log('\n📊 Estatísticas do cliente:');
        const stats = client.getStats();
        Object.entries(stats).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        
    } catch (error) {
        console.error('❌ Erro no cliente HTTP:', error.message);
    }
}

setTimeout(exemploClienteHTTP, 5000);

// --- 2.3 Tratamento de Diferentes Tipos de Resposta ---
console.log('\n=== TIPOS DE RESPOSTA ===');

class ResponseHandler {
    // Processar resposta JSON
    static async handleJSON(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
        }
        return await response.json();
    }
    
    // Processar resposta de texto
    static async handleText(response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    }
    
    // Processar resposta de blob (arquivos)
    static async handleBlob(response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.blob();
    }
    
    // Processar resposta de stream
    static async handleStream(response) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const reader = response.body.getReader();
        const chunks = [];
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
        } finally {
            reader.releaseLock();
        }
        
        return chunks;
    }
    
    // Detectar tipo de conteúdo e processar automaticamente
    static async handleAuto(response) {
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            return await this.handleJSON(response);
        } else if (contentType.includes('text/')) {
            return await this.handleText(response);
        } else {
            return await this.handleBlob(response);
        }
    }
    
    // Processar com progress para downloads
    static async handleWithProgress(response, onProgress) {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                chunks.push(value);
                loaded += value.length;
                
                if (onProgress && total > 0) {
                    const progress = (loaded / total) * 100;
                    onProgress({
                        loaded,
                        total,
                        progress: Math.round(progress)
                    });
                }
            }
        } finally {
            reader.releaseLock();
        }
        
        // Combinar chunks em um único Uint8Array
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        
        return result;
    }
}

// Exemplos de diferentes tipos de resposta
async function exemplosTiposResposta() {
    console.log('\n--- Tipos de Resposta ---');
    
    try {
        // === JSON ===
        console.log('🔄 Processando resposta JSON...');
        const jsonResponse = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const userData = await ResponseHandler.handleJSON(jsonResponse);
        console.log('✅ Dados do usuário:', {
            nome: userData.name,
            email: userData.email,
            empresa: userData.company.name
        });
        
        // === TEXTO ===
        console.log('\n🔄 Processando resposta de texto...');
        // Simular endpoint que retorna texto
        const textResponse = await fetch('https://httpbin.org/robots.txt');
        const textData = await ResponseHandler.handleText(textResponse);
        console.log('✅ Texto recebido:', textData.substring(0, 100) + '...');
        
        // === AUTO DETECT ===
        console.log('\n🔄 Detecção automática de tipo...');
        const autoResponse = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const autoData = await ResponseHandler.handleAuto(autoResponse);
        console.log('✅ Dados detectados automaticamente:', {
            tipo: typeof autoData,
            titulo: autoData.title?.substring(0, 30) + '...'
        });
        
    } catch (error) {
        console.error('❌ Erro ao processar resposta:', error.message);
    }
}

setTimeout(exemplosTiposResposta, 10000);

// --- 2.4 Upload e Download de Arquivos ---
console.log('\n=== UPLOAD E DOWNLOAD ===');

class FileHandler {
    // Simular upload de arquivo
    static async uploadFile(file, url, options = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        // Adicionar metadados
        if (options.metadata) {
            Object.entries(options.metadata).forEach(([key, value]) => {
                formData.append(key, value);
            });
        }
        
        const config = {
            method: 'POST',
            body: formData,
            ...options.fetchOptions
        };
        
        // Remover Content-Type para FormData
        if (config.headers) {
            delete config.headers['Content-Type'];
        }
        
        try {
            console.log(`🔄 Uploading ${file.name} (${file.size} bytes)...`);
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`Upload failed: HTTP ${response.status}`);
            }
            
            const result = await response.json();
            console.log(`✅ Upload concluído: ${file.name}`);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Erro no upload de ${file.name}:`, error.message);
            throw error;
        }
    }
    
    // Upload com progress
    static async uploadWithProgress(file, url, onProgress, options = {}) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);
            
            // Adicionar metadados
            if (options.metadata) {
                Object.entries(options.metadata).forEach(([key, value]) => {
                    formData.append(key, value);
                });
            }
            
            // Progress do upload
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 100;
                    onProgress({
                        loaded: event.loaded,
                        total: event.total,
                        progress: Math.round(progress)
                    });
                }
            });
            
            // Resposta
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const result = JSON.parse(xhr.responseText);
                        resolve(result);
                    } catch {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new Error(`Upload failed: HTTP ${xhr.status}`));
                }
            });
            
            // Erro
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed: Network error'));
            });
            
            // Iniciar upload
            xhr.open('POST', url);
            
            // Headers customizados
            if (options.headers) {
                Object.entries(options.headers).forEach(([key, value]) => {
                    xhr.setRequestHeader(key, value);
                });
            }
            
            xhr.send(formData);
        });
    }
    
    // Download com progress
    static async downloadWithProgress(url, onProgress, options = {}) {
        try {
            console.log(`🔄 Downloading from ${url}...`);
            
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`Download failed: HTTP ${response.status}`);
            }
            
            const data = await ResponseHandler.handleWithProgress(response, onProgress);
            
            console.log(`✅ Download concluído: ${data.length} bytes`);
            return data;
            
        } catch (error) {
            console.error('❌ Erro no download:', error.message);
            throw error;
        }
    }
    
    // Criar arquivo simulado para testes
    static createMockFile(name, size, type = 'text/plain') {
        const content = 'A'.repeat(size);
        return new File([content], name, { type });
    }
    
    // Salvar dados como arquivo
    static saveAsFile(data, filename, type = 'application/octet-stream') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        console.log(`💾 Arquivo ${filename} salvo`);
    }
}

// Exemplos de upload e download
async function exemplosUploadDownload() {
    console.log('\n--- Upload e Download ---');
    
    try {
        // === SIMULAÇÃO DE UPLOAD ===
        console.log('🔄 Simulando upload de arquivo...');
        
        // Criar arquivo simulado
        const mockFile = FileHandler.createMockFile('teste.txt', 1024, 'text/plain');
        console.log(`📄 Arquivo criado: ${mockFile.name} (${mockFile.size} bytes)`);
        
        // Simular upload com progress
        console.log('🔄 Upload com progress...');
        
        // Como não temos um servidor real, vamos simular o progress
        const simulateUploadProgress = () => {
            return new Promise((resolve) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        console.log('✅ Upload simulado concluído!');
                        resolve({ success: true, fileId: 'mock-file-123' });
                    }
                    console.log(`📊 Upload progress: ${Math.round(progress)}%`);
                }, 200);
            });
        };
        
        await simulateUploadProgress();
        
        // === SIMULAÇÃO DE DOWNLOAD ===
        console.log('\n🔄 Simulando download...');
        
        // Simular download com progress
        const simulateDownloadProgress = () => {
            return new Promise((resolve) => {
                let progress = 0;
                const totalSize = 2048;
                let loaded = 0;
                
                const interval = setInterval(() => {
                    const increment = Math.random() * 200;
                    loaded += increment;
                    progress = (loaded / totalSize) * 100;
                    
                    if (progress >= 100) {
                        progress = 100;
                        loaded = totalSize;
                        clearInterval(interval);
                        console.log('✅ Download simulado concluído!');
                        resolve(new Uint8Array(totalSize));
                    }
                    
                    console.log(`📊 Download progress: ${Math.round(progress)}% (${Math.round(loaded)}/${totalSize} bytes)`);
                }, 150);
            });
        };
        
        const downloadedData = await simulateDownloadProgress();
        console.log(`📦 Dados baixados: ${downloadedData.length} bytes`);
        
    } catch (error) {
        console.error('❌ Erro em upload/download:', error.message);
    }
}

setTimeout(exemplosUploadDownload, 15000);

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: API Client Completo ---
console.log('\n=== EXERCÍCIO: API CLIENT COMPLETO ===');

class APIClient {
    constructor(options = {}) {
        this.baseURL = options.baseURL || '';
        this.apiKey = options.apiKey || '';
        this.timeout = options.timeout || 10000;
        this.retryAttempts = options.retryAttempts || 3;
        
        // Cache inteligente
        this.cache = new Map();
        this.cacheStrategies = {
            'GET': 300000,    // 5 minutos
            'POST': 0,        // Não cachear
            'PUT': 0,         // Não cachear
            'DELETE': 0       // Não cachear
        };
        
        // Rate limiting
        this.rateLimiter = {
            requests: [],
            maxRequests: 100,
            windowMs: 60000 // 1 minuto
        };
        
        // Circuit breaker
        this.circuitBreaker = {
            state: 'CLOSED', // CLOSED, OPEN, HALF_OPEN
            failures: 0,
            threshold: 5,
            timeout: 30000,
            lastFailure: null
        };
        
        // Métricas
        this.metrics = {
            requests: 0,
            successes: 0,
            failures: 0,
            cacheHits: 0,
            rateLimitHits: 0,
            circuitBreakerTrips: 0,
            averageResponseTime: 0,
            totalResponseTime: 0
        };
        
        // Interceptadores
        this.interceptors = {
            request: [],
            response: [],
            error: []
        };
    }
    
    // Adicionar interceptadores
    addInterceptor(type, interceptor) {
        if (this.interceptors[type]) {
            this.interceptors[type].push(interceptor);
        }
    }
    
    // Verificar rate limit
    checkRateLimit() {
        const now = Date.now();
        
        // Remover requisições antigas
        this.rateLimiter.requests = this.rateLimiter.requests.filter(
            timestamp => now - timestamp < this.rateLimiter.windowMs
        );
        
        // Verificar limite
        if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
            this.metrics.rateLimitHits++;
            const oldestRequest = this.rateLimiter.requests[0];
            const waitTime = this.rateLimiter.windowMs - (now - oldestRequest);
            throw new Error(`Rate limit exceeded. Wait ${Math.ceil(waitTime / 1000)}s`);
        }
        
        this.rateLimiter.requests.push(now);
    }
    
    // Verificar circuit breaker
    checkCircuitBreaker() {
        const now = Date.now();
        
        // Tentar resetar se estiver aberto há tempo suficiente
        if (this.circuitBreaker.state === 'OPEN' && 
            now - this.circuitBreaker.lastFailure > this.circuitBreaker.timeout) {
            this.circuitBreaker.state = 'HALF_OPEN';
            console.log('🔄 Circuit breaker: Tentando HALF_OPEN');
        }
        
        // Rejeitar se estiver aberto
        if (this.circuitBreaker.state === 'OPEN') {
            throw new Error('Circuit breaker is OPEN - request rejected');
        }
    }
    
    // Atualizar circuit breaker após sucesso
    recordSuccess() {
        if (this.circuitBreaker.state === 'HALF_OPEN') {
            this.circuitBreaker.state = 'CLOSED';
            this.circuitBreaker.failures = 0;
            console.log('✅ Circuit breaker: Resetado para CLOSED');
        }
    }
    
    // Atualizar circuit breaker após falha
    recordFailure() {
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailure = Date.now();
        
        if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
            this.circuitBreaker.state = 'OPEN';
            this.metrics.circuitBreakerTrips++;
            console.log(`❌ Circuit breaker: Aberto após ${this.circuitBreaker.failures} falhas`);
        }
    }
    
    // Gerar chave de cache
    getCacheKey(method, url, data) {
        let key = `${method}:${url}`;
        if (data) {
            key += `:${JSON.stringify(data)}`;
        }
        return key;
    }
    
    // Verificar cache
    getFromCache(key, method) {
        const cacheTimeout = this.cacheStrategies[method];
        if (cacheTimeout === 0) return null;
        
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cacheTimeout) {
            this.metrics.cacheHits++;
            return cached.data;
        }
        
        return null;
    }
    
    // Salvar no cache
    saveToCache(key, data, method) {
        const cacheTimeout = this.cacheStrategies[method];
        if (cacheTimeout > 0) {
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
        }
    }
    
    // Requisição principal
    async request(method, url, data = null, options = {}) {
        const startTime = Date.now();
        this.metrics.requests++;
        
        try {
            // Verificar rate limit
            this.checkRateLimit();
            
            // Verificar circuit breaker
            this.checkCircuitBreaker();
            
            // Verificar cache
            const cacheKey = this.getCacheKey(method, url, data);
            const cached = this.getFromCache(cacheKey, method);
            if (cached) {
                console.log('📦 Cache hit:', url);
                return cached;
            }
            
            // Construir configuração
            let config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
                    ...options.headers
                },
                ...options
            };
            
            if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
                config.body = JSON.stringify(data);
            }
            
            // Aplicar interceptadores de requisição
            for (const interceptor of this.interceptors.request) {
                config = await interceptor(config);
            }
            
            // Fazer requisição com timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);
            config.signal = controller.signal;
            
            const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
            
            console.log(`🔄 ${method} ${fullURL}`);
            const response = await fetch(fullURL, config);
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Processar resposta
            const responseData = await response.json();
            
            // Aplicar interceptadores de resposta
            let processedData = responseData;
            for (const interceptor of this.interceptors.response) {
                processedData = await interceptor(processedData, response);
            }
            
            // Salvar no cache
            this.saveToCache(cacheKey, processedData, method);
            
            // Atualizar métricas
            const responseTime = Date.now() - startTime;
            this.metrics.successes++;
            this.metrics.totalResponseTime += responseTime;
            this.metrics.averageResponseTime = 
                Math.round(this.metrics.totalResponseTime / this.metrics.requests);
            
            // Registrar sucesso no circuit breaker
            this.recordSuccess();
            
            console.log(`✅ ${method} ${fullURL} - ${response.status} (${responseTime}ms)`);
            return processedData;
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.metrics.failures++;
            this.metrics.totalResponseTime += responseTime;
            this.metrics.averageResponseTime = 
                Math.round(this.metrics.totalResponseTime / this.metrics.requests);
            
            // Registrar falha no circuit breaker
            if (!error.message.includes('Rate limit') && 
                !error.message.includes('Circuit breaker')) {
                this.recordFailure();
            }
            
            // Aplicar interceptadores de erro
            for (const interceptor of this.interceptors.error) {
                await interceptor(error, { method, url, data, options });
            }
            
            console.error(`❌ ${method} ${url} - ${error.message} (${responseTime}ms)`);
            throw error;
        }
    }
    
    // Métodos de conveniência
    async get(url, options = {}) {
        return this.request('GET', url, null, options);
    }
    
    async post(url, data, options = {}) {
        return this.request('POST', url, data, options);
    }
    
    async put(url, data, options = {}) {
        return this.request('PUT', url, data, options);
    }
    
    async patch(url, data, options = {}) {
        return this.request('PATCH', url, data, options);
    }
    
    async delete(url, options = {}) {
        return this.request('DELETE', url, null, options);
    }
    
    // Requisições em lote
    async batch(requests, options = {}) {
        const { concurrency = 5, failFast = false } = options;
        
        console.log(`🔄 Executando ${requests.length} requisições em lotes de ${concurrency}...`);
        
        const results = [];
        
        for (let i = 0; i < requests.length; i += concurrency) {
            const batch = requests.slice(i, i + concurrency);
            
            const batchPromises = batch.map(async (req, index) => {
                try {
                    const result = await this.request(
                        req.method,
                        req.url,
                        req.data,
                        req.options
                    );
                    return { success: true, data: result, index: i + index };
                } catch (error) {
                    if (failFast) throw error;
                    return { success: false, error: error.message, index: i + index };
                }
            });
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            
            console.log(`📦 Lote ${Math.floor(i / concurrency) + 1} concluído`);
        }
        
        const successes = results.filter(r => r.success).length;
        const failures = results.filter(r => !r.success).length;
        
        console.log(`✅ Batch concluído: ${successes} sucessos, ${failures} falhas`);
        
        return results;
    }
    
    // Obter métricas
    getMetrics() {
        return {
            ...this.metrics,
            successRate: this.metrics.requests > 0
                ? ((this.metrics.successes / this.metrics.requests) * 100).toFixed(1) + '%'
                : '0%',
            cacheHitRate: this.metrics.requests > 0
                ? ((this.metrics.cacheHits / this.metrics.requests) * 100).toFixed(1) + '%'
                : '0%',
            circuitBreakerState: this.circuitBreaker.state
        };
    }
    
    // Limpar cache
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache limpo');
    }
    
    // Reset métricas
    resetMetrics() {
        this.metrics = {
            requests: 0,
            successes: 0,
            failures: 0,
            cacheHits: 0,
            rateLimitHits: 0,
            circuitBreakerTrips: 0,
            averageResponseTime: 0,
            totalResponseTime: 0
        };
        console.log('📊 Métricas resetadas');
    }
}

// Exemplo de uso do API Client completo
async function exemploAPIClientCompleto() {
    console.log('\n--- API Client Completo ---');
    
    const apiClient = new APIClient({
        baseURL: 'https://jsonplaceholder.typicode.com',
        timeout: 5000,
        retryAttempts: 2
    });
    
    // Adicionar interceptadores
    apiClient.addInterceptor('request', async (config) => {
        console.log('🔐 Interceptador: Adicionando timestamp');
        config.headers['X-Request-Time'] = new Date().toISOString();
        return config;
    });
    
    apiClient.addInterceptor('response', async (data, response) => {
        console.log(`📊 Interceptador: Resposta processada (${response.status})`);
        return data;
    });
    
    apiClient.addInterceptor('error', async (error, context) => {
        console.log(`🚨 Interceptador: Erro capturado - ${error.message}`);
    });
    
    try {
        console.log('\n🔄 Testando API Client completo...');
        
        // Requisições individuais
        const user = await apiClient.get('/users/1');
        console.log(`👤 Usuário: ${user.name}`);
        
        // Cache hit (segunda chamada)
        const userCache = await apiClient.get('/users/1');
        console.log(`👤 Usuário (cache): ${userCache.name}`);
        
        // Requisições em lote
        const batchRequests = [
            { method: 'GET', url: '/posts/1' },
            { method: 'GET', url: '/posts/2' },
            { method: 'GET', url: '/posts/3' },
            { method: 'GET', url: '/users/2' },
            { method: 'GET', url: '/users/3' }
        ];
        
        const batchResults = await apiClient.batch(batchRequests, {
            concurrency: 2,
            failFast: false
        });
        
        console.log(`📦 Resultados do batch: ${batchResults.length} requisições processadas`);
        
        // Criar novo post
        const novoPost = {
            title: 'Post via API Client',
            body: 'Conteúdo criado via API Client completo',
            userId: 1
        };
        
        const postCriado = await apiClient.post('/posts', novoPost);
        console.log(`✅ Post criado: ID ${postCriado.id}`);
        
        // Mostrar métricas finais
        console.log('\n📊 Métricas do API Client:');
        const metrics = apiClient.getMetrics();
        Object.entries(metrics).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        
    } catch (error) {
        console.error('❌ Erro no API Client:', error.message);
    }
}

setTimeout(exemploAPIClientCompleto, 20000);

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO E BOAS PRÁTICAS
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasFetchAPI = {
    boasPraticas: {
        // Sempre verificar response.ok
        verificarResposta: `
            // ✅ Bom - Sempre verificar se a resposta foi bem-sucedida
            const response = await fetch('/api/data');
            if (!response.ok) {
                throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
            }
            const data = await response.json();
        `,
        
        // Usar AbortController para cancelamento
        cancelamento: `
            // ✅ Bom - Implementar cancelamento
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            try {
                const response = await fetch('/api/data', {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                return await response.json();
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Requisição cancelada');
                }
                throw error;
            }
        `,
        
        // Configurar headers apropriados
        headers: `
            // ✅ Bom - Headers apropriados
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            });
        `
    },
    
    performance: {
        // Usar cache inteligente
        cache: `
            // ✅ Bom - Cache com estratégia
            const cache = new Map();
            
            async function fetchWithCache(url, cacheTime = 300000) {
                const cached = cache.get(url);
                if (cached && Date.now() - cached.timestamp < cacheTime) {
                    return cached.data;
                }
                
                const data = await fetch(url).then(r => r.json());
                cache.set(url, { data, timestamp: Date.now() });
                return data;
            }
        `,
        
        // Requisições paralelas quando possível
        paralelismo: `
            // ✅ Bom - Requisições paralelas
            const [users, posts, comments] = await Promise.all([
                fetch('/api/users').then(r => r.json()),
                fetch('/api/posts').then(r => r.json()),
                fetch('/api/comments').then(r => r.json())
            ]);
        `,
        
        // Controlar concorrência
        concorrencia: `
            // ✅ Bom - Processar em lotes
            async function fetchInBatches(urls, batchSize = 5) {
                const results = [];
                
                for (let i = 0; i < urls.length; i += batchSize) {
                    const batch = urls.slice(i, i + batchSize);
                    const batchResults = await Promise.all(
                        batch.map(url => fetch(url).then(r => r.json()))
                    );
                    results.push(...batchResults);
                }
                
                return results;
            }
        `
    },
    
    seguranca: {
        // Validar dados de entrada
        validacao: `
            // ✅ Bom - Validar dados
            function validateData(data) {
                if (!data || typeof data !== 'object') {
                    throw new Error('Dados inválidos');
                }
                // Mais validações...
            }
            
            validateData(requestData);
            const response = await fetch('/api/data', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
        `,
        
        // Sanitizar URLs
        sanitizacao: `
            // ✅ Bom - Sanitizar URLs
            function sanitizeURL(baseURL, path, params = {}) {
                const url = new URL(path, baseURL);
                Object.entries(params).forEach(([key, value]) => {
                    url.searchParams.append(key, encodeURIComponent(value));
                });
                return url.toString();
            }
        `
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasFetchAPI = {
    documentacao: [
        'MDN - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
        'MDN - Using Fetch: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch',
        'MDN - AbortController: https://developer.mozilla.org/en-US/docs/Web/API/AbortController',
        'Fetch Standard: https://fetch.spec.whatwg.org/'
    ],
    
    proximosTopicos: [
        '09-ES6-Plus - Módulos e import/export',
        '10-Padroes - Padrões de arquitetura',
        '11-Qualidade - Testes de APIs',
        'Frameworks - Axios, React Query, SWR'
    ],
    
    exerciciosAdicionais: [
        'Implementar cliente GraphQL',
        'Criar sistema de sincronização offline',
        'Desenvolver middleware de autenticação',
        'Construir sistema de upload em chunks'
    ]
};

console.log('Referências:', referenciasFetchAPI.documentacao);
console.log('Próximos tópicos:', referenciasFetchAPI.proximosTopicos);
console.log('Exercícios adicionais:', referenciasFetchAPI.exerciciosAdicionais);

// ===========================================
// 6. RESUMO DO MÓDULO ASSINCRONISMO
// ===========================================

setTimeout(() => {
    console.log('\n' + '='.repeat(50));
    console.log('🎓 MÓDULO 08 - ASSINCRONISMO CONCLUÍDO!');
    console.log('='.repeat(50));
    
    console.log('\n📚 CONCEITOS APRENDIDOS:');
    console.log('✓ Callbacks e Callback Hell');
    console.log('✓ Promises e encadeamento');
    console.log('✓ Async/Await e sintaxe moderna');
    console.log('✓ Fetch API e requisições HTTP');
    console.log('✓ Tratamento de erros assíncronos');
    console.log('✓ Padrões avançados (retry, timeout, cache)');
    console.log('✓ Performance e otimização');
    
    console.log('\n🛠️ TÉCNICAS DOMINADAS:');
    console.log('✓ Controle de fluxo assíncrono');
    console.log('✓ Gerenciamento de concorrência');
    console.log('✓ Implementação de interceptadores');
    console.log('✓ Cache inteligente');
    console.log('✓ Rate limiting e circuit breaker');
    console.log('✓ Upload/download com progress');
    console.log('✓ Requisições em lote');
    
    console.log('\n🚀 PROJETOS DESENVOLVIDOS:');
    console.log('✓ Sistema de controle de fluxo de callbacks');
    console.log('✓ Cache avançado com Promises');
    console.log('✓ Processador de dados com async/await');
    console.log('✓ Cliente HTTP completo com todas as funcionalidades');
    
    console.log('\n📈 PRÓXIMO MÓDULO:');
    console.log('🔜 09-ES6-Plus: Recursos modernos do JavaScript');
    console.log('   - let, const e template literals');
    console.log('   - Destructuring e spread operator');
    console.log('   - Módulos e import/export');
    console.log('   - Novas features ES2015+');
    
    console.log('\n💡 DICA DE ESTUDO:');
    console.log('Pratique criando APIs reais e integrando com diferentes');
    console.log('serviços. O assincronismo é fundamental no JavaScript moderno!');
    
    console.log('\n' + '='.repeat(50));
}, 25000);

/*
===========================================
    FIM DO MÓDULO 08 - ASSINCRONISMO
===========================================

PARABÉNS! 🎉

Você completou o módulo de Assincronismo em JavaScript!

Este módulo cobriu desde os conceitos básicos de callbacks
até implementações avançadas de clientes HTTP com todas
as funcionalidades modernas.

Você agora domina:
- Programação assíncrona em JavaScript
- Promises e async/await
- Fetch API e requisições HTTP
- Padrões avançados de performance
- Tratamento robusto de erros
- Arquiteturas resilientes

Continue praticando e explorando!
O próximo módulo (09-ES6-Plus) aguarda você! 🚀

===========================================
*/