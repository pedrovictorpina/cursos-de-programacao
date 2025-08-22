/**
 * 🌐 MÓDULO 2.5: INTEGRAÇÃO COM APIs REST
 * 
 * Este módulo aborda a integração de aplicações React com APIs REST,
 * incluindo requisições HTTP, gerenciamento de estado assíncrono,
 * tratamento de erros, cache e otimizações de performance.
 * 
 * 📚 TÓPICOS ABORDADOS:
 * • Fetch API e Axios para requisições HTTP
 * • Hooks para gerenciamento de estado assíncrono
 * • Tratamento de erros e loading states
 * • Cache e invalidação de dados
 * • Otimizações de performance
 * • Interceptors e middleware
 * • Autenticação com tokens
 * • Upload de arquivos
 * 
 * 🎯 OBJETIVOS DE APRENDIZAGEM:
 * • Implementar comunicação eficiente com APIs
 * • Gerenciar estados de loading, sucesso e erro
 * • Criar hooks customizados para requisições
 * • Implementar cache inteligente de dados
 * • Otimizar performance de requisições
 * • Tratar autenticação e autorização
 * • Implementar upload e download de arquivos
 * 
 * 👨‍🏫 PROFESSOR: Este módulo demonstra padrões modernos de integração
 * com APIs, focando em performance, experiência do usuário e manutenibilidade.
 * Cada exemplo inclui tratamento de erros, loading states e boas práticas.
 */

// =============================================================================
// 1. CONFIGURAÇÃO E SETUP BÁSICO
// =============================================================================

/**
 * 🔧 CONFIGURAÇÃO DE CLIENTE HTTP
 * 
 * Configuração básica para requisições HTTP usando Fetch API e Axios
 */

// Simulação do Axios (em um projeto real, instale: npm install axios)
const axios = {
    create: (config) => ({
        defaults: { ...config },
        
        async get(url, config = {}) {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaults.headers,
                    ...config.headers
                },
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return { data: await response.json(), status: response.status };
        },
        
        async post(url, data, config = {}) {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaults.headers,
                    ...config.headers
                },
                body: JSON.stringify(data),
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return { data: await response.json(), status: response.status };
        },
        
        async put(url, data, config = {}) {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaults.headers,
                    ...config.headers
                },
                body: JSON.stringify(data),
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return { data: await response.json(), status: response.status };
        },
        
        async delete(url, config = {}) {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.defaults.headers,
                    ...config.headers
                },
                ...config
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return { data: response.status === 204 ? null : await response.json(), status: response.status };
        },
        
        interceptors: {
            request: {
                use: (onFulfilled, onRejected) => {
                    console.log('🔧 Request interceptor configurado');
                    // Em implementação real, interceptaria todas as requisições
                }
            },
            response: {
                use: (onFulfilled, onRejected) => {
                    console.log('🔧 Response interceptor configurado');
                    // Em implementação real, interceptaria todas as respostas
                }
            }
        }
    })
};

/**
 * 🌐 CLIENTE API CONFIGURADO
 * 
 * Cliente HTTP configurado com base URL e headers padrão
 */
const apiClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Configurar interceptors
apiClient.interceptors.request.use(
    (config) => {
        // Adicionar token de autenticação se disponível
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('📤 Requisição enviada:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('❌ Erro na requisição:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('📥 Resposta recebida:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('❌ Erro na resposta:', error.response?.status, error.message);
        
        // Tratar erros específicos
        if (error.response?.status === 401) {
            // Token expirado - redirecionar para login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// =============================================================================
// 2. HOOKS PARA REQUISIÇÕES HTTP
// =============================================================================

/**
 * 🎣 HOOK PARA FETCH DE DADOS
 * 
 * Hook customizado para buscar dados com estados de loading e erro
 */
function useFetch(url, options = {}) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    
    const { 
        immediate = true, 
        dependencies = [], 
        onSuccess,
        onError 
    } = options;
    
    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await apiClient.get(url);
            setData(response.data);
            
            if (onSuccess) {
                onSuccess(response.data);
            }
            
        } catch (err) {
            setError(err.message);
            
            if (onError) {
                onError(err);
            }
        } finally {
            setLoading(false);
        }
    }, [url, onSuccess, onError]);
    
    React.useEffect(() => {
        if (immediate) {
            fetchData();
        }
    }, [immediate, fetchData, ...dependencies]);
    
    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
}

/**
 * 🎣 HOOK PARA MUTAÇÕES (POST, PUT, DELETE)
 * 
 * Hook para operações que modificam dados no servidor
 */
function useMutation(mutationFn, options = {}) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    const { onSuccess, onError, onSettled } = options;
    
    const mutate = React.useCallback(async (variables) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await mutationFn(variables);
            setData(result.data);
            
            if (onSuccess) {
                onSuccess(result.data, variables);
            }
            
            return result.data;
            
        } catch (err) {
            setError(err.message);
            
            if (onError) {
                onError(err, variables);
            }
            
            throw err;
        } finally {
            setLoading(false);
            
            if (onSettled) {
                onSettled();
            }
        }
    }, [mutationFn, onSuccess, onError, onSettled]);
    
    const reset = React.useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);
    
    return {
        data,
        loading,
        error,
        mutate,
        reset
    };
}

/**
 * 🎣 HOOK PARA CACHE DE DADOS
 * 
 * Hook avançado com cache inteligente e invalidação
 */
function useQuery(key, queryFn, options = {}) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [lastFetch, setLastFetch] = React.useState(null);
    
    const {
        staleTime = 5 * 60 * 1000, // 5 minutos
        cacheTime = 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus = true,
        enabled = true
    } = options;
    
    // Cache simples em memória
    const cache = React.useRef(new Map());
    
    const isStale = React.useCallback(() => {
        if (!lastFetch) return true;
        return Date.now() - lastFetch > staleTime;
    }, [lastFetch, staleTime]);
    
    const fetchData = React.useCallback(async (force = false) => {
        const cacheKey = JSON.stringify(key);
        const cached = cache.current.get(cacheKey);
        
        // Usar cache se disponível e não stale
        if (!force && cached && !isStale()) {
            setData(cached.data);
            setLoading(false);
            setError(null);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            
            const result = await queryFn();
            
            // Atualizar cache
            cache.current.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            
            setData(result);
            setLastFetch(Date.now());
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [key, queryFn, isStale]);
    
    React.useEffect(() => {
        if (enabled) {
            fetchData();
        }
    }, [enabled, fetchData]);
    
    // Refetch on window focus
    React.useEffect(() => {
        if (!refetchOnWindowFocus) return;
        
        const handleFocus = () => {
            if (isStale()) {
                fetchData();
            }
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [refetchOnWindowFocus, fetchData, isStale]);
    
    const invalidate = React.useCallback(() => {
        const cacheKey = JSON.stringify(key);
        cache.current.delete(cacheKey);
        fetchData(true);
    }, [key, fetchData]);
    
    return {
        data,
        loading,
        error,
        refetch: () => fetchData(true),
        invalidate
    };
}

// =============================================================================
// 3. COMPONENTES DE DEMONSTRAÇÃO
// =============================================================================

/**
 * 📋 LISTA DE POSTS
 * 
 * Componente que demonstra busca de dados com paginação
 */
function PostsList() {
    const [page, setPage] = React.useState(1);
    const [posts, setPosts] = React.useState([]);
    const [hasMore, setHasMore] = React.useState(true);
    
    const { data, loading, error, refetch } = useFetch(
        `/posts?_page=${page}&_limit=10`,
        {
            dependencies: [page],
            onSuccess: (newPosts) => {
                if (page === 1) {
                    setPosts(newPosts);
                } else {
                    setPosts(prev => [...prev, ...newPosts]);
                }
                
                setHasMore(newPosts.length === 10);
            }
        }
    );
    
    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };
    
    const refresh = () => {
        setPage(1);
        setPosts([]);
        setHasMore(true);
        refetch();
    };
    
    return {
        render: () => `
            <div class="posts-list">
                <div class="posts-header">
                    <h2>📋 Posts do Blog</h2>
                    <button onclick="window.refreshPosts()" class="btn btn-secondary" ${loading ? 'disabled' : ''}>
                        🔄 Atualizar
                    </button>
                </div>
                
                ${error ? `
                    <div class="error-message">
                        <p>❌ Erro ao carregar posts: ${error}</p>
                        <button onclick="window.refreshPosts()" class="btn btn-primary">Tentar Novamente</button>
                    </div>
                ` : ''}
                
                <div class="posts-grid">
                    ${posts.map(post => `
                        <article class="post-card" data-id="${post.id}">
                            <h3>${post.title}</h3>
                            <p class="post-excerpt">${post.body.substring(0, 100)}...</p>
                            <div class="post-meta">
                                <span class="post-id">#${post.id}</span>
                                <span class="post-user">👤 User ${post.userId}</span>
                            </div>
                            <div class="post-actions">
                                <button onclick="window.viewPost(${post.id})" class="btn btn-sm btn-primary">
                                    👁️ Ver Detalhes
                                </button>
                                <button onclick="window.editPost(${post.id})" class="btn btn-sm btn-secondary">
                                    ✏️ Editar
                                </button>
                            </div>
                        </article>
                    `).join('')}
                </div>
                
                ${loading ? `
                    <div class="loading-container">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Carregando posts...</p>
                        </div>
                    </div>
                ` : ''}
                
                ${!loading && hasMore ? `
                    <div class="load-more-container">
                        <button onclick="window.loadMorePosts()" class="btn btn-outline-primary">
                            📄 Carregar Mais Posts
                        </button>
                    </div>
                ` : ''}
                
                ${!loading && !hasMore && posts.length > 0 ? `
                    <div class="end-message">
                        <p>🎉 Todos os posts foram carregados!</p>
                    </div>
                ` : ''}
            </div>
        `,
        
        // Expor funções para uso global
        setupGlobalFunctions: () => {
            window.refreshPosts = refresh;
            window.loadMorePosts = loadMore;
            window.viewPost = (id) => {
                console.log('👁️ Visualizar post:', id);
                // Implementar navegação para detalhes
            };
            window.editPost = (id) => {
                console.log('✏️ Editar post:', id);
                // Implementar edição
            };
        }
    };
}

/**
 * 📝 FORMULÁRIO DE POST
 * 
 * Componente para criar/editar posts com validação
 */
function PostForm({ postId = null, onSuccess }) {
    const [formData, setFormData] = React.useState({
        title: '',
        body: '',
        userId: 1
    });
    const [errors, setErrors] = React.useState({});
    
    const isEditing = !!postId;
    
    // Buscar dados do post se editando
    const { data: existingPost, loading: loadingPost } = useFetch(
        isEditing ? `/posts/${postId}` : null,
        {
            immediate: isEditing,
            onSuccess: (post) => {
                setFormData({
                    title: post.title,
                    body: post.body,
                    userId: post.userId
                });
            }
        }
    );
    
    // Mutation para salvar post
    const { mutate: savePost, loading: saving } = useMutation(
        async (data) => {
            if (isEditing) {
                return await apiClient.put(`/posts/${postId}`, data);
            } else {
                return await apiClient.post('/posts', data);
            }
        },
        {
            onSuccess: (data) => {
                console.log('✅ Post salvo com sucesso:', data);
                if (onSuccess) onSuccess(data);
                
                // Limpar formulário se criando novo post
                if (!isEditing) {
                    setFormData({ title: '', body: '', userId: 1 });
                }
            },
            onError: (error) => {
                console.error('❌ Erro ao salvar post:', error);
            }
        }
    );
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Título deve ter pelo menos 5 caracteres';
        }
        
        if (!formData.body.trim()) {
            newErrors.body = 'Conteúdo é obrigatório';
        } else if (formData.body.length < 10) {
            newErrors.body = 'Conteúdo deve ter pelo menos 10 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            await savePost(formData);
        } catch (error) {
            // Erro já tratado no onError do mutation
        }
    };
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Limpar erro do campo quando usuário digita
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };
    
    if (isEditing && loadingPost) {
        return {
            render: () => `
                <div class="post-form loading">
                    <div class="loading-container">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <p>Carregando post...</p>
                        </div>
                    </div>
                </div>
            `
        };
    }
    
    return {
        render: () => `
            <div class="post-form">
                <div class="form-header">
                    <h2>${isEditing ? '✏️ Editar Post' : '📝 Novo Post'}</h2>
                </div>
                
                <form onsubmit="window.handlePostSubmit(event)" class="form">
                    <div class="form-group">
                        <label for="post-title">Título *</label>
                        <input 
                            type="text" 
                            id="post-title" 
                            value="${formData.title}"
                            oninput="window.handlePostChange('title', this.value)"
                            class="form-control ${errors.title ? 'error' : ''}"
                            placeholder="Digite o título do post"
                        >
                        ${errors.title ? `<span class="error-text">${errors.title}</span>` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="post-body">Conteúdo *</label>
                        <textarea 
                            id="post-body" 
                            rows="6"
                            oninput="window.handlePostChange('body', this.value)"
                            class="form-control ${errors.body ? 'error' : ''}"
                            placeholder="Digite o conteúdo do post"
                        >${formData.body}</textarea>
                        ${errors.body ? `<span class="error-text">${errors.body}</span>` : ''}
                    </div>
                    
                    <div class="form-group">
                        <label for="post-user">Usuário</label>
                        <select 
                            id="post-user" 
                            onchange="window.handlePostChange('userId', parseInt(this.value))"
                            class="form-control"
                        >
                            ${[1,2,3,4,5].map(id => `
                                <option value="${id}" ${formData.userId === id ? 'selected' : ''}>
                                    Usuário ${id}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button 
                            type="submit" 
                            class="btn btn-primary"
                            ${saving ? 'disabled' : ''}
                        >
                            ${saving ? '⏳ Salvando...' : (isEditing ? '💾 Atualizar' : '📝 Criar Post')}
                        </button>
                        
                        <button 
                            type="button" 
                            onclick="window.cancelPostForm()"
                            class="btn btn-secondary"
                            ${saving ? 'disabled' : ''}
                        >
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `,
        
        setupGlobalFunctions: () => {
            window.handlePostSubmit = handleSubmit;
            window.handlePostChange = handleChange;
            window.cancelPostForm = () => {
                console.log('❌ Formulário cancelado');
                // Implementar navegação de volta
            };
        }
    };
}

/**
 * 👥 LISTA DE USUÁRIOS COM CACHE
 * 
 * Demonstra uso do hook useQuery com cache inteligente
 */
function UsersList() {
    const [selectedUser, setSelectedUser] = React.useState(null);
    
    // Query com cache para lista de usuários
    const { 
        data: users, 
        loading, 
        error, 
        refetch,
        invalidate 
    } = useQuery(
        ['users'],
        async () => {
            const response = await apiClient.get('/users');
            return response.data;
        },
        {
            staleTime: 10 * 60 * 1000, // 10 minutos
            refetchOnWindowFocus: true
        }
    );
    
    // Query para posts do usuário selecionado
    const { 
        data: userPosts, 
        loading: loadingPosts 
    } = useQuery(
        ['user-posts', selectedUser?.id],
        async () => {
            if (!selectedUser) return [];
            const response = await apiClient.get(`/posts?userId=${selectedUser.id}`);
            return response.data;
        },
        {
            enabled: !!selectedUser
        }
    );
    
    return {
        render: () => `
            <div class="users-list">
                <div class="users-header">
                    <h2>👥 Lista de Usuários</h2>
                    <div class="header-actions">
                        <button onclick="window.refreshUsers()" class="btn btn-secondary" ${loading ? 'disabled' : ''}>
                            🔄 Atualizar
                        </button>
                        <button onclick="window.invalidateUsers()" class="btn btn-outline-secondary">
                            🗑️ Limpar Cache
                        </button>
                    </div>
                </div>
                
                ${error ? `
                    <div class="error-message">
                        <p>❌ Erro ao carregar usuários: ${error}</p>
                        <button onclick="window.refreshUsers()" class="btn btn-primary">Tentar Novamente</button>
                    </div>
                ` : ''}
                
                <div class="users-content">
                    <div class="users-grid">
                        ${loading ? `
                            <div class="loading-container">
                                <div class="loading-spinner">
                                    <div class="spinner"></div>
                                    <p>Carregando usuários...</p>
                                </div>
                            </div>
                        ` : ''}
                        
                        ${users ? users.map(user => `
                            <div class="user-card ${selectedUser?.id === user.id ? 'selected' : ''}" 
                                 onclick="window.selectUser(${user.id})">
                                <div class="user-avatar">
                                    👤
                                </div>
                                <div class="user-info">
                                    <h3>${user.name}</h3>
                                    <p class="user-email">📧 ${user.email}</p>
                                    <p class="user-company">🏢 ${user.company.name}</p>
                                    <p class="user-website">🌐 ${user.website}</p>
                                </div>
                                <div class="user-stats">
                                    <span class="stat">📍 ${user.address.city}</span>
                                    <span class="stat">📞 ${user.phone}</span>
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                    
                    ${selectedUser ? `
                        <div class="user-details">
                            <h3>📝 Posts de ${selectedUser.name}</h3>
                            
                            ${loadingPosts ? `
                                <div class="loading-container">
                                    <div class="loading-spinner">
                                        <div class="spinner"></div>
                                        <p>Carregando posts...</p>
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${userPosts && userPosts.length > 0 ? `
                                <div class="user-posts">
                                    ${userPosts.map(post => `
                                        <div class="post-item">
                                            <h4>${post.title}</h4>
                                            <p>${post.body.substring(0, 150)}...</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : userPosts ? `
                                <p class="no-posts">Este usuário ainda não possui posts.</p>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `,
        
        setupGlobalFunctions: () => {
            window.refreshUsers = refetch;
            window.invalidateUsers = invalidate;
            window.selectUser = (userId) => {
                const user = users?.find(u => u.id === userId);
                setSelectedUser(user);
                console.log('👤 Usuário selecionado:', user?.name);
            };
        }
    };
}

// =============================================================================
// 4. UPLOAD DE ARQUIVOS
// =============================================================================

/**
 * 📁 COMPONENTE DE UPLOAD
 * 
 * Demonstra upload de arquivos com progress e preview
 */
function FileUpload() {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    
    const handleFileSelect = (event) => {
        const selectedFiles = Array.from(event.target.files);
        
        const fileObjects = selectedFiles.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            status: 'pending'
        }));
        
        setFiles(prev => [...prev, ...fileObjects]);
    };
    
    const removeFile = (fileId) => {
        setFiles(prev => {
            const updated = prev.filter(f => f.id !== fileId);
            // Limpar URLs de preview
            const removed = prev.find(f => f.id === fileId);
            if (removed?.preview) {
                URL.revokeObjectURL(removed.preview);
            }
            return updated;
        });
    };
    
    const uploadFiles = async () => {
        if (files.length === 0) return;
        
        setUploading(true);
        setProgress(0);
        
        try {
            for (let i = 0; i < files.length; i++) {
                const fileObj = files[i];
                
                // Simular upload (em projeto real, usar FormData)
                const formData = new FormData();
                formData.append('file', fileObj.file);
                
                // Simular progresso
                for (let p = 0; p <= 100; p += 10) {
                    setProgress(((i * 100) + p) / files.length);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                
                // Marcar como concluído
                setFiles(prev => prev.map(f => 
                    f.id === fileObj.id 
                        ? { ...f, status: 'completed' }
                        : f
                ));
            }
            
            console.log('✅ Todos os arquivos foram enviados!');
            
        } catch (error) {
            console.error('❌ Erro no upload:', error);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    };
    
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    return {
        render: () => `
            <div class="file-upload">
                <div class="upload-header">
                    <h2>📁 Upload de Arquivos</h2>
                </div>
                
                <div class="upload-area">
                    <div class="drop-zone">
                        <div class="drop-zone-content">
                            <div class="upload-icon">📁</div>
                            <p>Arraste arquivos aqui ou clique para selecionar</p>
                            <input 
                                type="file" 
                                multiple 
                                onchange="window.handleFileSelect(event)"
                                class="file-input"
                                accept="image/*,.pdf,.doc,.docx,.txt"
                            >
                        </div>
                    </div>
                </div>
                
                ${files.length > 0 ? `
                    <div class="files-list">
                        <h3>📋 Arquivos Selecionados (${files.length})</h3>
                        
                        <div class="files-grid">
                            ${files.map(file => `
                                <div class="file-item ${file.status}">
                                    ${file.preview ? `
                                        <div class="file-preview">
                                            <img src="${file.preview}" alt="Preview" class="preview-image">
                                        </div>
                                    ` : `
                                        <div class="file-icon">
                                            ${file.type.includes('pdf') ? '📄' : 
                                              file.type.includes('doc') ? '📝' : 
                                              file.type.includes('image') ? '🖼️' : '📁'}
                                        </div>
                                    `}
                                    
                                    <div class="file-info">
                                        <div class="file-name">${file.name}</div>
                                        <div class="file-size">${formatFileSize(file.size)}</div>
                                        <div class="file-status">
                                            ${file.status === 'pending' ? '⏳ Pendente' :
                                              file.status === 'uploading' ? '📤 Enviando...' :
                                              file.status === 'completed' ? '✅ Concluído' :
                                              '❌ Erro'}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onclick="window.removeFile('${file.id}')"
                                        class="remove-file"
                                        ${uploading ? 'disabled' : ''}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        
                        ${uploading ? `
                            <div class="upload-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%"></div>
                                </div>
                                <p>📤 Enviando... ${Math.round(progress)}%</p>
                            </div>
                        ` : ''}
                        
                        <div class="upload-actions">
                            <button 
                                onclick="window.uploadFiles()"
                                class="btn btn-primary"
                                ${uploading || files.length === 0 ? 'disabled' : ''}
                            >
                                📤 Enviar Arquivos
                            </button>
                            
                            <button 
                                onclick="window.clearFiles()"
                                class="btn btn-secondary"
                                ${uploading ? 'disabled' : ''}
                            >
                                🗑️ Limpar Lista
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `,
        
        setupGlobalFunctions: () => {
            window.handleFileSelect = handleFileSelect;
            window.removeFile = removeFile;
            window.uploadFiles = uploadFiles;
            window.clearFiles = () => {
                // Limpar URLs de preview
                files.forEach(file => {
                    if (file.preview) {
                        URL.revokeObjectURL(file.preview);
                    }
                });
                setFiles([]);
            };
        }
    };
}

// =============================================================================
// 5. SISTEMA DE NOTIFICAÇÕES
// =============================================================================

/**
 * 🔔 SISTEMA DE NOTIFICAÇÕES
 * 
 * Gerencia notificações de sucesso, erro e informação
 */
const NotificationSystem = {
    notifications: [],
    listeners: [],
    
    add(notification) {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification = {
            id,
            type: 'info',
            duration: 5000,
            ...notification,
            timestamp: Date.now()
        };
        
        this.notifications.push(newNotification);
        this.notifyListeners();
        
        // Auto-remove após duração especificada
        if (newNotification.duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, newNotification.duration);
        }
        
        return id;
    },
    
    remove(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    },
    
    clear() {
        this.notifications = [];
        this.notifyListeners();
    },
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },
    
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.notifications));
    },
    
    // Métodos de conveniência
    success(message, options = {}) {
        return this.add({ ...options, type: 'success', message });
    },
    
    error(message, options = {}) {
        return this.add({ ...options, type: 'error', message, duration: 8000 });
    },
    
    warning(message, options = {}) {
        return this.add({ ...options, type: 'warning', message });
    },
    
    info(message, options = {}) {
        return this.add({ ...options, type: 'info', message });
    }
};

/**
 * 🔔 COMPONENTE DE NOTIFICAÇÕES
 * 
 * Exibe notificações do sistema
 */
function NotificationContainer() {
    const [notifications, setNotifications] = React.useState([]);
    
    React.useEffect(() => {
        const unsubscribe = NotificationSystem.subscribe(setNotifications);
        return unsubscribe;
    }, []);
    
    const getIcon = (type) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return 'ℹ️';
        }
    };
    
    return {
        render: () => `
            <div class="notification-container">
                ${notifications.map(notification => `
                    <div class="notification notification-${notification.type}" data-id="${notification.id}">
                        <div class="notification-content">
                            <span class="notification-icon">${getIcon(notification.type)}</span>
                            <span class="notification-message">${notification.message}</span>
                        </div>
                        <button 
                            onclick="window.removeNotification('${notification.id}')"
                            class="notification-close"
                        >
                            ✕
                        </button>
                    </div>
                `).join('')}
            </div>
        `,
        
        setupGlobalFunctions: () => {
            window.removeNotification = (id) => {
                NotificationSystem.remove(id);
            };
        }
    };
}

// =============================================================================
// 6. ESTILOS CSS
// =============================================================================

/**
 * 🎨 ESTILOS DA APLICAÇÃO
 * 
 * CSS para todos os componentes de integração com APIs
 */
const apiStyles = `
/* Reset e Base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f7fa;
}

/* Layout Principal */
#api-app {
    min-height: 100vh;
    padding: 20px;
}

.app-header {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-bottom: 30px;
    text-align: center;
}

.app-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 2.5rem;
}

.app-header p {
    color: #7f8c8d;
    font-size: 1.1rem;
}

/* Navegação por Tabs */
.tab-navigation {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    margin-bottom: 30px;
    overflow: hidden;
}

.tab-buttons {
    display: flex;
    background: #f8f9fa;
}

.tab-button {
    flex: 1;
    padding: 15px 20px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    color: #6c757d;
    transition: all 0.3s ease;
    border-bottom: 3px solid transparent;
}

.tab-button:hover {
    background: #e9ecef;
    color: #495057;
}

.tab-button.active {
    background: white;
    color: #007bff;
    border-bottom-color: #007bff;
}

.tab-content {
    padding: 30px;
    min-height: 400px;
}

/* Componentes Comuns */
.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background: #545b62;
}

.btn-outline-primary {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;
}

.btn-outline-primary:hover:not(:disabled) {
    background: #007bff;
    color: white;
}

.btn-outline-secondary {
    background: transparent;
    color: #6c757d;
    border: 2px solid #6c757d;
}

.btn-sm {
    padding: 8px 16px;
    font-size: 0.9rem;
}

/* Loading States */
.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.loading-spinner {
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error States */
.error-message {
    background: #fff5f5;
    border: 1px solid #fed7d7;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
}

.error-message p {
    color: #c53030;
    margin-bottom: 15px;
}

/* Posts List */
.posts-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.posts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    border-bottom: 1px solid #eee;
    background: #f8f9fa;
}

.posts-header h2 {
    color: #2c3e50;
    margin: 0;
}

.posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    padding: 30px;
}

.post-card {
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.post-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    border-color: #007bff;
}

.post-card h3 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 1.2rem;
    line-height: 1.4;
}

.post-excerpt {
    color: #6c757d;
    margin-bottom: 15px;
    line-height: 1.5;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    font-size: 0.9rem;
    color: #6c757d;
}

.post-actions {
    display: flex;
    gap: 10px;
}

.load-more-container,
.end-message {
    text-align: center;
    padding: 30px;
}

/* Post Form */
.post-form {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.form-header {
    background: #f8f9fa;
    padding: 30px;
    border-bottom: 1px solid #eee;
}

.form-header h2 {
    color: #2c3e50;
    margin: 0;
}

.form {
    padding: 30px;
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #495057;
}

.form-control {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

.form-control.error {
    border-color: #dc3545;
}

.error-text {
    display: block;
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 5px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

/* Users List */
.users-list {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    border-bottom: 1px solid #eee;
    background: #f8f9fa;
}

.users-header h2 {
    color: #2c3e50;
    margin: 0;
}

.header-actions {
    display: flex;
    gap: 10px;
}

.users-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
    padding: 30px;
}

.users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}

.user-card {
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    border-color: #007bff;
}

.user-card.selected {
    border-color: #007bff;
    background: #e3f2fd;
}

.user-avatar {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 15px;
}

.user-info h3 {
    color: #2c3e50;
    margin-bottom: 10px;
}

.user-info p {
    color: #6c757d;
    margin-bottom: 5px;
    font-size: 0.9rem;
}

.user-stats {
    display: flex;
    gap: 15px;
    margin-top: 15px;
    flex-wrap: wrap;
}

.stat {
    background: white;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    color: #6c757d;
}

.user-details {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 20px;
    height: fit-content;
}

.user-details h3 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.user-posts {
    max-height: 400px;
    overflow-y: auto;
}

.post-item {
    background: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    border-left: 4px solid #007bff;
}

.post-item h4 {
    color: #2c3e50;
    margin-bottom: 8px;
    font-size: 1rem;
}

.post-item p {
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.4;
}

.no-posts {
    text-align: center;
    color: #6c757d;
    font-style: italic;
}

/* File Upload */
.file-upload {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    overflow: hidden;
}

.upload-header {
    background: #f8f9fa;
    padding: 30px;
    border-bottom: 1px solid #eee;
}

.upload-header h2 {
    color: #2c3e50;
    margin: 0;
}

.upload-area {
    padding: 30px;
}

.drop-zone {
    border: 3px dashed #dee2e6;
    border-radius: 12px;
    padding: 60px 30px;
    text-align: center;
    transition: all 0.3s ease;
    position: relative;
    cursor: pointer;
}

.drop-zone:hover {
    border-color: #007bff;
    background: #f8f9fa;
}

.drop-zone-content {
    pointer-events: none;
}

.upload-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}

.files-list {
    padding: 30px;
    border-top: 1px solid #eee;
}

.files-list h3 {
    color: #2c3e50;
    margin-bottom: 20px;
}

.files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.file-item {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 12px;
    padding: 15px;
    position: relative;
    transition: all 0.3s ease;
}

.file-item.completed {
    border-color: #28a745;
    background: #f8fff9;
}

.file-preview {
    text-align: center;
    margin-bottom: 10px;
}

.preview-image {
    max-width: 100%;
    max-height: 100px;
    border-radius: 8px;
    object-fit: cover;
}

.file-icon {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 10px;
}

.file-info {
    text-align: center;
}

.file-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
    word-break: break-word;
}

.file-size {
    color: #6c757d;
    font-size: 0.9rem;
    margin-bottom: 5px;
}

.file-status {
    font-size: 0.9rem;
    font-weight: 500;
}

.remove-file {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.remove-file:hover:not(:disabled) {
    background: #c82333;
    transform: scale(1.1);
}

.upload-progress {
    margin: 20px 0;
    text-align: center;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: #007bff;
    transition: width 0.3s ease;
}

.upload-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
}

/* Notifications */
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    max-width: 400px;
}

.notification {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    margin-bottom: 10px;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    animation: slideIn 0.3s ease;
    border-left: 4px solid #007bff;
}

.notification-success {
    border-left-color: #28a745;
}

.notification-error {
    border-left-color: #dc3545;
}

.notification-warning {
    border-left-color: #ffc107;
}

.notification-info {
    border-left-color: #17a2b8;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.notification-icon {
    font-size: 1.2rem;
}

.notification-message {
    color: #2c3e50;
    font-weight: 500;
}

.notification-close {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-close:hover {
    color: #495057;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .users-content {
        grid-template-columns: 1fr;
    }
    
    .posts-grid {
        grid-template-columns: 1fr;
    }
    
    .files-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
    
    .tab-buttons {
        flex-direction: column;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .notification-container {
        left: 20px;
        right: 20px;
        max-width: none;
    }
}
`;

// =============================================================================
// 7. APLICAÇÃO PRINCIPAL
// =============================================================================

/**
 * 🚀 APLICAÇÃO DE DEMONSTRAÇÃO
 * 
 * Aplicação principal que integra todos os componentes
 */
function ApiIntegrationApp() {
    const [activeTab, setActiveTab] = React.useState('posts');
    
    const tabs = [
        { id: 'posts', label: '📋 Posts', component: PostsList },
        { id: 'form', label: '📝 Formulário', component: () => PostForm({ onSuccess: () => {
            NotificationSystem.success('Post criado com sucesso!');
            setActiveTab('posts');
        }})},
        { id: 'users', label: '👥 Usuários', component: UsersList },
        { id: 'upload', label: '📁 Upload', component: FileUpload }
    ];
    
    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;
    
    return {
        render: () => `
            <div id="api-app">
                <div class="app-header">
                    <h1>🌐 Integração com APIs REST</h1>
                    <p>Demonstração completa de comunicação com APIs usando React</p>
                </div>
                
                <div class="tab-navigation">
                    <div class="tab-buttons">
                        ${tabs.map(tab => `
                            <button 
                                class="tab-button ${activeTab === tab.id ? 'active' : ''}"
                                onclick="window.setActiveTab('${tab.id}')"
                            >
                                ${tab.label}
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="tab-content">
                        <div id="active-component"></div>
                    </div>
                </div>
            </div>
        `,
        
        setupGlobalFunctions: () => {
            window.setActiveTab = (tabId) => {
                setActiveTab(tabId);
                console.log('📑 Tab ativa:', tabId);
                
                // Re-renderizar componente ativo
                setTimeout(() => {
                    const component = tabs.find(tab => tab.id === tabId)?.component();
                    if (component) {
                        document.getElementById('active-component').innerHTML = component.render();
                        if (component.setupGlobalFunctions) {
                            component.setupGlobalFunctions();
                        }
                    }
                }, 0);
            };
        },
        
        init: () => {
            // Renderizar componente inicial
            setTimeout(() => {
                const component = ActiveComponent();
                document.getElementById('active-component').innerHTML = component.render();
                if (component.setupGlobalFunctions) {
                    component.setupGlobalFunctions();
                }
            }, 0);
        }
    };
}

// =============================================================================
// 8. CONCEITOS PRINCIPAIS
// =============================================================================

/**
 * 📚 CONCEITOS FUNDAMENTAIS DE INTEGRAÇÃO COM APIs
 * 
 * Esta seção explica os conceitos essenciais para trabalhar com APIs REST
 */
const apiConcepts = {
    /**
     * 🌐 PROTOCOLO HTTP
     * 
     * Métodos HTTP e seus usos:
     * • GET: Buscar dados (idempotente)
     * • POST: Criar novos recursos
     * • PUT: Atualizar recursos completos
     * • PATCH: Atualizar recursos parcialmente
     * • DELETE: Remover recursos
     */
    httpMethods: {
        description: 'Métodos HTTP para diferentes operações',
        examples: {
            get: 'Buscar lista de posts ou detalhes de um post específico',
            post: 'Criar um novo post ou usuário',
            put: 'Atualizar todos os campos de um post',
            patch: 'Atualizar apenas o título de um post',
            delete: 'Remover um post ou usuário'
        }
    },
    
    /**
     * 📊 CÓDIGOS DE STATUS HTTP
     * 
     * Principais códigos de resposta:
     * • 200: OK - Sucesso
     * • 201: Created - Recurso criado
     * • 400: Bad Request - Dados inválidos
     * • 401: Unauthorized - Não autenticado
     * • 403: Forbidden - Sem permissão
     * • 404: Not Found - Recurso não encontrado
     * • 500: Internal Server Error - Erro do servidor
     */
    statusCodes: {
        success: [200, 201, 204],
        clientError: [400, 401, 403, 404],
        serverError: [500, 502, 503, 504]
    },
    
    /**
     * 🔄 ESTADOS DE REQUISIÇÃO
     * 
     * Estados que uma requisição pode ter:
     * • idle: Estado inicial, nenhuma requisição feita
     * • loading: Requisição em andamento
     * • success: Requisição concluída com sucesso
     * • error: Requisição falhou
     */
    requestStates: {
        idle: 'Estado inicial ou após reset',
        loading: 'Requisição em andamento - mostrar spinner',
        success: 'Dados recebidos - atualizar UI',
        error: 'Falha na requisição - mostrar mensagem de erro'
    },
    
    /**
     * 💾 ESTRATÉGIAS DE CACHE
     * 
     * Diferentes abordagens para cache de dados:
     * • Memory Cache: Cache em memória (rápido, temporário)
     * • Local Storage: Persistente no navegador
     * • Session Storage: Persistente durante a sessão
     * • HTTP Cache: Cache baseado em headers HTTP
     */
    cacheStrategies: {
        memory: 'Rápido acesso, perdido ao recarregar página',
        localStorage: 'Persistente, limitado a ~5MB',
        sessionStorage: 'Persistente durante sessão',
        httpCache: 'Controlado por headers do servidor'
    }
};

// =============================================================================
// 9. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS PROGRESSIVOS
 * 
 * Exercícios práticos para dominar integração com APIs
 */
const apiExercises = {
    /**
     * 🟢 EXERCÍCIOS BÁSICOS
     * 
     * Fundamentos de requisições HTTP
     */
    basicos: [
        {
            titulo: '1. Primeira Requisição',
            descricao: 'Criar um componente que busca e exibe uma lista de posts',
            objetivos: [
                'Usar fetch() para buscar dados',
                'Gerenciar estados de loading e erro',
                'Renderizar lista de dados'
            ],
            dicas: [
                'Use useState para gerenciar dados e loading',
                'Use useEffect para fazer a requisição',
                'Trate erros com try/catch'
            ]
        },
        {
            titulo: '2. Detalhes de Item',
            descricao: 'Implementar visualização de detalhes de um post específico',
            objetivos: [
                'Buscar dados baseado em ID',
                'Navegar entre lista e detalhes',
                'Implementar botão de voltar'
            ]
        },
        {
            titulo: '3. Formulário Simples',
            descricao: 'Criar formulário para adicionar novo post',
            objetivos: [
                'Capturar dados do formulário',
                'Enviar dados via POST',
                'Validar campos obrigatórios',
                'Mostrar feedback de sucesso/erro'
            ]
        }
    ],
    
    /**
     * 🟡 EXERCÍCIOS INTERMEDIÁRIOS
     * 
     * Funcionalidades mais avançadas
     */
    intermediarios: [
        {
            titulo: '4. CRUD Completo',
            descricao: 'Implementar operações completas de Create, Read, Update, Delete',
            objetivos: [
                'Criar hook customizado para CRUD',
                'Implementar edição inline',
                'Confirmar antes de deletar',
                'Atualizar lista após operações'
            ]
        },
        {
            titulo: '5. Busca e Filtros',
            descricao: 'Adicionar funcionalidade de busca e filtros',
            objetivos: [
                'Implementar busca em tempo real',
                'Criar filtros por categoria',
                'Usar debounce para otimizar',
                'Manter estado da busca na URL'
            ]
        },
        {
            titulo: '6. Paginação',
            descricao: 'Implementar paginação de dados',
            objetivos: [
                'Carregar dados por páginas',
                'Implementar infinite scroll',
                'Mostrar indicadores de página',
                'Otimizar performance'
            ]
        }
    ],
    
    /**
     * 🔴 EXERCÍCIOS AVANÇADOS
     * 
     * Padrões profissionais e otimizações
     */
    avancados: [
        {
            titulo: '7. Sistema de Cache',
            descricao: 'Implementar cache inteligente de dados',
            objetivos: [
                'Cache com TTL (Time To Live)',
                'Invalidação automática',
                'Cache em diferentes níveis',
                'Sincronização entre abas'
            ]
        },
        {
            titulo: '8. Interceptors e Middleware',
            descricao: 'Criar sistema de interceptors para requisições',
            objetivos: [
                'Interceptar requisições e respostas',
                'Adicionar tokens automaticamente',
                'Tratar erros globalmente',
                'Implementar retry automático'
            ]
        },
        {
            titulo: '9. Upload Avançado',
            descricao: 'Sistema completo de upload de arquivos',
            objetivos: [
                'Upload com progress bar',
                'Upload múltiplo e paralelo',
                'Drag and drop',
                'Preview de imagens',
                'Validação de tipos e tamanhos'
            ]
        }
    ],
    
    /**
     * 🚀 PROJETO INTEGRADO
     * 
     * Aplicação completa combinando todos os conceitos
     */
    projeto: {
        titulo: '10. Blog Completo',
        descricao: 'Desenvolver aplicação completa de blog com todas as funcionalidades',
        funcionalidades: [
            'Sistema de autenticação',
            'CRUD completo de posts',
            'Sistema de comentários',
            'Upload de imagens',
            'Busca e filtros avançados',
            'Paginação e infinite scroll',
            'Cache inteligente',
            'Notificações em tempo real',
            'Modo offline com sincronização'
        ],
        tecnologias: [
            'React com hooks customizados',
            'Context API para estado global',
            'Axios para requisições',
            'React Query para cache',
            'WebSockets para tempo real',
            'Service Workers para offline'
        ]
     }
 };

// =============================================================================
// 10. RECURSOS ADICIONAIS
// =============================================================================

/**
 * 📚 RECURSOS PARA APROFUNDAMENTO
 * 
 * Links e materiais para continuar aprendendo
 */
const apiResources = {
    /**
     * 📖 DOCUMENTAÇÃO OFICIAL
     */
    documentacao: [
        {
            nome: 'MDN - Fetch API',
            url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API',
            descricao: 'Documentação completa da Fetch API'
        },
        {
            nome: 'Axios Documentation',
            url: 'https://axios-http.com/docs/intro',
            descricao: 'Guia oficial do Axios para requisições HTTP'
        },
        {
            nome: 'React Query',
            url: 'https://tanstack.com/query/latest',
            descricao: 'Biblioteca poderosa para gerenciamento de estado servidor'
        },
        {
            nome: 'SWR',
            url: 'https://swr.vercel.app/',
            descricao: 'Alternativa ao React Query para data fetching'
        }
    ],
    
    /**
     * 🛠️ FERRAMENTAS ÚTEIS
     */
    ferramentas: [
        {
            nome: 'Postman',
            url: 'https://www.postman.com/',
            descricao: 'Ferramenta para testar APIs REST'
        },
        {
            nome: 'Insomnia',
            url: 'https://insomnia.rest/',
            descricao: 'Cliente REST alternativo ao Postman'
        },
        {
            nome: 'JSON Server',
            url: 'https://github.com/typicode/json-server',
            descricao: 'Criar API REST fake para desenvolvimento'
        },
        {
            nome: 'MSW (Mock Service Worker)',
            url: 'https://mswjs.io/',
            descricao: 'Mock de APIs para desenvolvimento e testes'
        }
    ],
    
    /**
     * 📚 BIBLIOTECAS COMPLEMENTARES
     */
    bibliotecas: [
        {
            nome: 'React Hook Form',
            url: 'https://react-hook-form.com/',
            descricao: 'Gerenciamento eficiente de formulários'
        },
        {
            nome: 'Yup',
            url: 'https://github.com/jquense/yup',
            descricao: 'Validação de schemas JavaScript'
        },
        {
            nome: 'React Toastify',
            url: 'https://fkhadra.github.io/react-toastify/',
            descricao: 'Notificações toast elegantes'
        },
        {
            nome: 'React Dropzone',
            url: 'https://react-dropzone.js.org/',
            descricao: 'Upload de arquivos com drag and drop'
        }
    ],
    
    /**
     * 🎯 PADRÕES E BOAS PRÁTICAS
     */
    padroes: [
        {
            titulo: 'Error Boundaries',
            descricao: 'Capturar erros em componentes React',
            exemplo: 'Envolver componentes que fazem requisições'
        },
        {
            titulo: 'Loading States',
            descricao: 'Sempre mostrar feedback visual durante carregamento',
            exemplo: 'Spinners, skeletons, progress bars'
        },
        {
            titulo: 'Error Handling',
            descricao: 'Tratar diferentes tipos de erro adequadamente',
            exemplo: 'Network errors, 404, 500, timeout'
        },
        {
            titulo: 'Optimistic Updates',
            descricao: 'Atualizar UI antes da confirmação do servidor',
            exemplo: 'Like em posts, adicionar comentário'
        },
        {
            titulo: 'Debouncing',
            descricao: 'Evitar requisições excessivas em buscas',
            exemplo: 'Aguardar 300ms após usuário parar de digitar'
        }
    ]
};

// =============================================================================
// 11. RESUMO DO MÓDULO
// =============================================================================

/**
 * 📋 RESUMO COMPLETO DO MÓDULO
 * 
 * Síntese de tudo que foi abordado sobre integração com APIs
 */
const moduleSummary = {
    /**
     * 🎯 OBJETIVOS ALCANÇADOS
     */
    objetivos: [
        '✅ Dominar requisições HTTP com Fetch API e Axios',
        '✅ Criar hooks customizados para gerenciamento de estado assíncrono',
        '✅ Implementar tratamento robusto de erros e loading states',
        '✅ Desenvolver sistema de cache inteligente',
        '✅ Construir componentes reutilizáveis para CRUD',
        '✅ Implementar upload de arquivos com progress',
        '✅ Criar sistema de notificações',
        '✅ Aplicar padrões profissionais de desenvolvimento'
    ],
    
    /**
     * 🔑 CONCEITOS-CHAVE APRENDIDOS
     */
    conceitos: [
        {
            nome: 'HTTP Methods',
            descricao: 'GET, POST, PUT, PATCH, DELETE e seus usos apropriados'
        },
        {
            nome: 'Status Codes',
            descricao: 'Interpretação e tratamento de códigos de resposta HTTP'
        },
        {
            nome: 'Request States',
            descricao: 'Gerenciamento de estados idle, loading, success, error'
        },
        {
            nome: 'Custom Hooks',
            descricao: 'useFetch, useMutation, useQuery para reutilização'
        },
        {
            nome: 'Error Handling',
            descricao: 'Tratamento gracioso de diferentes tipos de erro'
        },
        {
            nome: 'Caching Strategies',
            descricao: 'Memory cache, localStorage, HTTP cache'
        },
        {
            nome: 'Interceptors',
            descricao: 'Middleware para requisições e respostas'
        },
        {
            nome: 'File Upload',
            descricao: 'Upload com progress, preview e validação'
        }
    ],
    
    /**
     * 🚀 HABILIDADES DESENVOLVIDAS
     */
    habilidades: [
        'Integração eficiente com APIs REST',
        'Gerenciamento de estado assíncrono',
        'Criação de hooks customizados reutilizáveis',
        'Implementação de cache inteligente',
        'Tratamento robusto de erros',
        'Otimização de performance em requisições',
        'Desenvolvimento de UX responsiva',
        'Aplicação de padrões profissionais'
    ],
    
    /**
     * ➡️ PRÓXIMOS PASSOS
     */
    proximosPassos: [
        {
            topico: 'GraphQL',
            descricao: 'Aprender consultas mais eficientes com GraphQL',
            recursos: ['Apollo Client', 'Relay', 'urql']
        },
        {
            topico: 'WebSockets',
            descricao: 'Implementar comunicação em tempo real',
            recursos: ['Socket.io', 'WebSocket API', 'Server-Sent Events']
        },
        {
            topico: 'Service Workers',
            descricao: 'Adicionar funcionalidades offline',
            recursos: ['PWA', 'Background Sync', 'Push Notifications']
        },
        {
            topico: 'Testing',
            descricao: 'Testar integração com APIs',
            recursos: ['MSW', 'React Testing Library', 'Jest']
        }
    ],
    
    /**
     * 💡 DICAS IMPORTANTES
     */
    dicas: [
        '🔐 Nunca exponha chaves de API no frontend',
        '⚡ Use debounce em buscas para otimizar performance',
        '🎯 Implemente loading states para melhor UX',
        '🛡️ Sempre trate erros de rede adequadamente',
        '💾 Use cache inteligente para reduzir requisições',
        '🔄 Implemente retry automático para falhas temporárias',
        '📱 Considere conexões lentas em dispositivos móveis',
        '🧪 Teste cenários de erro e edge cases'
    ]
};

// =============================================================================
// 12. INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 FUNÇÃO DE INICIALIZAÇÃO
 * 
 * Inicializa a aplicação de demonstração de APIs
 */
function initApiIntegration() {
    console.log('🌐 Inicializando módulo de Integração com APIs REST...');
    
    // Criar container principal
    const container = document.createElement('div');
    container.id = 'api-integration-container';
    
    // Adicionar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = apiStyles;
    document.head.appendChild(styleSheet);
    
    // Criar aplicação principal
    const app = ApiIntegrationApp();
    container.innerHTML = app.render();
    
    // Adicionar container de notificações
    const notificationContainer = NotificationContainer();
    container.innerHTML += notificationContainer.render();
    
    // Configurar funções globais
    app.setupGlobalFunctions();
    notificationContainer.setupGlobalFunctions();
    
    // Adicionar ao DOM
    document.body.appendChild(container);
    
    // Inicializar aplicação
    app.init();
    
    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        NotificationSystem.info(
            'Bem-vindo ao módulo de Integração com APIs! Explore as diferentes funcionalidades nas abas acima.',
            { duration: 8000 }
        );
    }, 1000);
    
    console.log('✅ Módulo de Integração com APIs inicializado com sucesso!');
    console.log('📚 Conceitos abordados:', Object.keys(apiConcepts));
    console.log('🎯 Exercícios disponíveis:', {
        básicos: apiExercises.basicos.length,
        intermediários: apiExercises.intermediarios.length,
        avançados: apiExercises.avancados.length
    });
    console.log('📖 Recursos adicionais:', Object.keys(apiResources));
    
    return {
        app,
        concepts: apiConcepts,
        exercises: apiExercises,
        resources: apiResources,
        summary: moduleSummary
    };
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApiIntegration,
        apiConcepts,
        apiExercises,
        apiResources,
        moduleSummary,
        // Componentes principais
        PostsList,
        PostForm,
        UsersList,
        FileUpload,
        NotificationSystem,
        // Hooks customizados
        useFetch,
        useMutation,
        useQuery,
        // Cliente API
        apiClient
    };
}

// Auto-inicializar se executado diretamente
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApiIntegration);
} else if (typeof window !== 'undefined') {
    initApiIntegration();
}

/**
 * 🎓 CONCLUSÃO DO MÓDULO
 * 
 * Parabéns! Você completou o módulo de Integração com APIs REST.
 * 
 * Neste módulo, você aprendeu:
 * 
 * 1. 🌐 **Fundamentos HTTP**: Métodos, status codes e headers
 * 2. 🎣 **Hooks Customizados**: useFetch, useMutation, useQuery
 * 3. 🔄 **Gerenciamento de Estado**: Loading, success, error states
 * 4. 💾 **Cache Inteligente**: Estratégias de cache e invalidação
 * 5. 🛡️ **Tratamento de Erros**: Error boundaries e recovery
 * 6. 📁 **Upload de Arquivos**: Progress, preview e validação
 * 7. 🔔 **Sistema de Notificações**: Feedback visual para usuário
 * 8. ⚡ **Otimizações**: Debounce, interceptors, retry
 * 
 * **Próximo Módulo**: Backend com Node.js
 * Onde você aprenderá a criar as APIs que consumimos aqui!
 * 
 * Continue praticando e explorando os exercícios propostos.
 * A integração com APIs é fundamental no desenvolvimento moderno!
 */