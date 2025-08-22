/**
 * 🎯 MÓDULO 2: REACT FRAMEWORK
 * 📚 Aula 1: Fundamentos do React
 * 
 * Este arquivo aborda os conceitos fundamentais do React:
 * - Componentes funcionais e JSX
 * - Props e comunicação entre componentes
 * - Estado local com useState
 * - Efeitos colaterais com useEffect
 * - Manipulação de eventos
 * - Renderização condicional e listas
 * - Formulários controlados
 * 
 * 🎓 OBJETIVOS DE APRENDIZAGEM:
 * ✅ Compreender a filosofia e arquitetura do React
 * ✅ Criar componentes funcionais reutilizáveis
 * ✅ Gerenciar estado local e efeitos colaterais
 * ✅ Implementar comunicação entre componentes
 * ✅ Manipular eventos e formulários
 * ✅ Aplicar renderização condicional e listas
 */

// =============================================================================
// 1. FUNDAMENTOS DO REACT
// =============================================================================

/**
 * 🔧 CONFIGURAÇÃO INICIAL
 * 
 * Para começar com React, você precisa:
 * 1. Node.js instalado (versão 16+)
 * 2. Criar projeto: npx create-react-app meu-app
 * 3. Ou usar Vite: npm create vite@latest meu-app -- --template react
 */

// Exemplo de estrutura básica de um componente React
import React, { useState, useEffect } from 'react';

/**
 * 📝 CONCEITOS FUNDAMENTAIS
 * 
 * React é uma biblioteca JavaScript para construir interfaces de usuário.
 * Principais conceitos:
 * - Componentes: Blocos de construção reutilizáveis
 * - JSX: Sintaxe que mistura JavaScript e HTML
 * - Props: Dados passados para componentes
 * - State: Dados que podem mudar ao longo do tempo
 * - Hooks: Funções que permitem usar recursos do React
 */

// =============================================================================
// 2. COMPONENTES FUNCIONAIS E JSX
// =============================================================================

/**
 * 🧩 COMPONENTE BÁSICO
 * 
 * Um componente React é uma função que retorna JSX
 */
function WelcomeMessage() {
    return (
        <div className="welcome">
            <h1>Bem-vindo ao React!</h1>
            <p>Este é seu primeiro componente funcional.</p>
        </div>
    );
}

/**
 * 🎨 JSX - JAVASCRIPT XML
 * 
 * JSX permite escrever HTML dentro do JavaScript
 * Regras importantes:
 * - Use className em vez de class
 * - Elementos devem ser fechados
 * - Apenas um elemento raiz (ou Fragment)
 */
function JSXExamples() {
    const userName = 'João';
    const isLoggedIn = true;
    const items = ['React', 'Vue', 'Angular'];

    return (
        <div className="jsx-examples">
            {/* Interpolação de variáveis */}
            <h2>Olá, {userName}!</h2>
            
            {/* Expressões JavaScript */}
            <p>Você tem {items.length} frameworks para aprender.</p>
            
            {/* Renderização condicional */}
            {isLoggedIn ? (
                <button>Logout</button>
            ) : (
                <button>Login</button>
            )}
            
            {/* Renderização de listas */}
            <ul>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            
            {/* Atributos dinâmicos */}
            <img 
                src={`/images/${userName.toLowerCase()}.jpg`}
                alt={`Foto de ${userName}`}
                className={isLoggedIn ? 'user-photo active' : 'user-photo'}
            />
        </div>
    );
}

/**
 * 🔄 FRAGMENT - MÚLTIPLOS ELEMENTOS
 * 
 * Use React.Fragment ou <> para retornar múltiplos elementos
 */
function MultipleElements() {
    return (
        <React.Fragment>
            <h3>Primeiro elemento</h3>
            <p>Segundo elemento</p>
            <div>Terceiro elemento</div>
        </React.Fragment>
    );
}

// Sintaxe curta para Fragment
function MultipleElementsShort() {
    return (
        <>
            <h3>Primeiro elemento</h3>
            <p>Segundo elemento</p>
            <div>Terceiro elemento</div>
        </>
    );
}

// =============================================================================
// 3. PROPS - COMUNICAÇÃO ENTRE COMPONENTES
// =============================================================================

/**
 * 📤 PROPS - PROPRIEDADES
 * 
 * Props são dados passados de um componente pai para um filho
 * São imutáveis (read-only)
 */
function UserCard({ name, email, avatar, isOnline }) {
    return (
        <div className="user-card">
            <img src={avatar} alt={`Avatar de ${name}`} />
            <div className="user-info">
                <h3>{name}</h3>
                <p>{email}</p>
                <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                    {isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
            </div>
        </div>
    );
}

/**
 * 🎯 PROPS COM VALORES PADRÃO
 * 
 * Use defaultProps ou parâmetros padrão
 */
function Button({ text = 'Clique aqui', variant = 'primary', onClick }) {
    return (
        <button 
            className={`btn btn-${variant}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

/**
 * 🔍 PROPS CHILDREN
 * 
 * Children permite passar conteúdo entre as tags do componente
 */
function Card({ title, children }) {
    return (
        <div className="card">
            <div className="card-header">
                <h3>{title}</h3>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

/**
 * 📋 DESTRUCTURING DE PROPS
 * 
 * Extraia props específicas para código mais limpo
 */
function ProductCard({ product }) {
    const { id, name, price, image, inStock } = product;
    
    return (
        <div className="product-card">
            <img src={image} alt={name} />
            <h4>{name}</h4>
            <p className="price">R$ {price.toFixed(2)}</p>
            <p className={`stock ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                {inStock ? 'Em estoque' : 'Fora de estoque'}
            </p>
        </div>
    );
}

// =============================================================================
// 4. ESTADO LOCAL COM USESTATE
// =============================================================================

/**
 * 🔄 USESTATE - GERENCIAMENTO DE ESTADO
 * 
 * useState permite adicionar estado a componentes funcionais
 */
function Counter() {
    // Declaração do estado
    const [count, setCount] = useState(0);
    
    // Funções para manipular o estado
    const increment = () => setCount(count + 1);
    const decrement = () => setCount(count - 1);
    const reset = () => setCount(0);
    
    return (
        <div className="counter">
            <h3>Contador: {count}</h3>
            <div className="counter-buttons">
                <button onClick={decrement}>-</button>
                <button onClick={reset}>Reset</button>
                <button onClick={increment}>+</button>
            </div>
        </div>
    );
}

/**
 * 📝 ESTADO COM OBJETOS
 * 
 * Cuidado ao atualizar objetos - sempre crie uma nova referência
 */
function UserProfile() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: 0
    });
    
    const updateName = (newName) => {
        setUser({
            ...user,  // Spread operator para manter outros valores
            name: newName
        });
    };
    
    const updateUser = (field, value) => {
        setUser(prevUser => ({
            ...prevUser,
            [field]: value
        }));
    };
    
    return (
        <div className="user-profile">
            <h3>Perfil do Usuário</h3>
            <input 
                type="text"
                placeholder="Nome"
                value={user.name}
                onChange={(e) => updateUser('name', e.target.value)}
            />
            <input 
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => updateUser('email', e.target.value)}
            />
            <input 
                type="number"
                placeholder="Idade"
                value={user.age}
                onChange={(e) => updateUser('age', parseInt(e.target.value) || 0)}
            />
            
            <div className="user-display">
                <p>Nome: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Idade: {user.age}</p>
            </div>
        </div>
    );
}

/**
 * 📋 ESTADO COM ARRAYS
 * 
 * Manipulação de listas com useState
 */
function TodoList() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    
    const addTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                id: Date.now(),
                text: inputValue,
                completed: false
            };
            setTodos([...todos, newTodo]);
            setInputValue('');
        }
    };
    
    const toggleTodo = (id) => {
        setTodos(todos.map(todo => 
            todo.id === id 
                ? { ...todo, completed: !todo.completed }
                : todo
        ));
    };
    
    const removeTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };
    
    return (
        <div className="todo-list">
            <h3>Lista de Tarefas</h3>
            <div className="todo-input">
                <input 
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Adicionar nova tarefa..."
                />
                <button onClick={addTodo}>Adicionar</button>
            </div>
            
            <ul className="todos">
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <span onClick={() => toggleTodo(todo.id)}>
                            {todo.text}
                        </span>
                        <button onClick={() => removeTodo(todo.id)}>❌</button>
                    </li>
                ))}
            </ul>
            
            <div className="todo-stats">
                <p>Total: {todos.length}</p>
                <p>Concluídas: {todos.filter(t => t.completed).length}</p>
                <p>Pendentes: {todos.filter(t => !t.completed).length}</p>
            </div>
        </div>
    );
}

// =============================================================================
// 5. EFEITOS COLATERAIS COM USEEFFECT
// =============================================================================

/**
 * ⚡ USEEFFECT - EFEITOS COLATERAIS
 * 
 * useEffect permite executar código em resposta a mudanças
 * Substitui componentDidMount, componentDidUpdate e componentWillUnmount
 */
function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Efeito que executa apenas uma vez (componentDidMount)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []); // Array vazio = executa apenas uma vez
    
    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error}</div>;
    
    return (
        <div className="data-display">
            <h3>{data?.title}</h3>
            <p>{data?.body}</p>
        </div>
    );
}

/**
 * 🔄 USEEFFECT COM DEPENDÊNCIAS
 * 
 * Efeito que executa quando dependências mudam
 */
function SearchComponent() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Efeito que executa quando query muda
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        
        const searchData = async () => {
            setLoading(true);
            try {
                // Simular busca com delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Simular resultados
                const mockResults = [
                    `Resultado 1 para "${query}"`,
                    `Resultado 2 para "${query}"`,
                    `Resultado 3 para "${query}"`
                ];
                setResults(mockResults);
            } catch (error) {
                console.error('Erro na busca:', error);
            } finally {
                setLoading(false);
            }
        };
        
        // Debounce - aguarda 300ms antes de buscar
        const timeoutId = setTimeout(searchData, 300);
        
        // Cleanup - cancela busca anterior
        return () => clearTimeout(timeoutId);
    }, [query]); // Executa quando query muda
    
    return (
        <div className="search-component">
            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite para buscar..."
            />
            
            {loading && <div>Buscando...</div>}
            
            <ul>
                {results.map((result, index) => (
                    <li key={index}>{result}</li>
                ))}
            </ul>
        </div>
    );
}

/**
 * 🧹 CLEANUP COM USEEFFECT
 * 
 * Limpeza de recursos (timers, subscriptions, etc.)
 */
function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    useEffect(() => {
        let intervalId;
        
        if (isRunning) {
            intervalId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        
        // Cleanup function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning]);
    
    const startTimer = () => setIsRunning(true);
    const stopTimer = () => setIsRunning(false);
    const resetTimer = () => {
        setIsRunning(false);
        setSeconds(0);
    };
    
    return (
        <div className="timer">
            <h3>Timer: {seconds}s</h3>
            <div className="timer-controls">
                <button onClick={startTimer} disabled={isRunning}>
                    Iniciar
                </button>
                <button onClick={stopTimer} disabled={!isRunning}>
                    Parar
                </button>
                <button onClick={resetTimer}>
                    Reset
                </button>
            </div>
        </div>
    );
}

// =============================================================================
// 6. MANIPULAÇÃO DE EVENTOS
// =============================================================================

/**
 * 🖱️ EVENTOS EM REACT
 * 
 * React usa SyntheticEvents - wrapper dos eventos nativos
 */
function EventExamples() {
    const [message, setMessage] = useState('');
    
    // Evento de clique
    const handleClick = (event) => {
        console.log('Botão clicado!', event);
        setMessage('Botão foi clicado!');
    };
    
    // Evento de mouse
    const handleMouseEnter = () => {
        setMessage('Mouse entrou no elemento!');
    };
    
    const handleMouseLeave = () => {
        setMessage('Mouse saiu do elemento!');
    };
    
    // Evento de teclado
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setMessage(`Você pressionou Enter! Valor: ${event.target.value}`);
        }
    };
    
    // Evento de formulário
    const handleSubmit = (event) => {
        event.preventDefault(); // Previne comportamento padrão
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log('Dados do formulário:', data);
        setMessage(`Formulário enviado: ${JSON.stringify(data)}`);
    };
    
    return (
        <div className="event-examples">
            <h3>Exemplos de Eventos</h3>
            
            <div className="message">{message}</div>
            
            {/* Evento de clique */}
            <button onClick={handleClick}>
                Clique em mim
            </button>
            
            {/* Eventos de mouse */}
            <div 
                className="hover-area"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    padding: '20px',
                    border: '1px solid #ccc',
                    margin: '10px 0'
                }}
            >
                Passe o mouse aqui
            </div>
            
            {/* Evento de teclado */}
            <input 
                type="text"
                placeholder="Pressione Enter"
                onKeyDown={handleKeyDown}
            />
            
            {/* Evento de formulário */}
            <form onSubmit={handleSubmit}>
                <input name="nome" placeholder="Nome" required />
                <input name="email" type="email" placeholder="Email" required />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

/**
 * 📝 FORMULÁRIOS CONTROLADOS
 * 
 * Componentes onde o React controla o valor dos inputs
 */
function ControlledForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        interests: [],
        newsletter: false,
        comments: ''
    });
    
    const [errors, setErrors] = useState({});
    
    // Função genérica para atualizar campos
    const updateField = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpar erro do campo quando usuário digita
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };
    
    // Manipular checkboxes múltiplos
    const handleInterestChange = (interest) => {
        const updatedInterests = formData.interests.includes(interest)
            ? formData.interests.filter(i => i !== interest)
            : [...formData.interests, interest];
        
        updateField('interests', updatedInterests);
    };
    
    // Validação
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.age || formData.age < 1) {
            newErrors.age = 'Idade deve ser maior que 0';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Submissão do formulário
    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (validateForm()) {
            console.log('Dados válidos:', formData);
            alert('Formulário enviado com sucesso!');
            
            // Reset do formulário
            setFormData({
                name: '',
                email: '',
                age: '',
                gender: '',
                interests: [],
                newsletter: false,
                comments: ''
            });
        }
    };
    
    return (
        <div className="controlled-form">
            <h3>Formulário Controlado</h3>
            
            <form onSubmit={handleSubmit}>
                {/* Input de texto */}
                <div className="form-group">
                    <label>Nome:</label>
                    <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                
                {/* Input de email */}
                <div className="form-group">
                    <label>Email:</label>
                    <input 
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                {/* Input de número */}
                <div className="form-group">
                    <label>Idade:</label>
                    <input 
                        type="number"
                        value={formData.age}
                        onChange={(e) => updateField('age', e.target.value)}
                        className={errors.age ? 'error' : ''}
                    />
                    {errors.age && <span className="error-message">{errors.age}</span>}
                </div>
                
                {/* Select */}
                <div className="form-group">
                    <label>Gênero:</label>
                    <select 
                        value={formData.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                    >
                        <option value="">Selecione...</option>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                {/* Checkboxes múltiplos */}
                <div className="form-group">
                    <label>Interesses:</label>
                    {['Tecnologia', 'Esportes', 'Música', 'Viagens'].map(interest => (
                        <label key={interest} className="checkbox-label">
                            <input 
                                type="checkbox"
                                checked={formData.interests.includes(interest)}
                                onChange={() => handleInterestChange(interest)}
                            />
                            {interest}
                        </label>
                    ))}
                </div>
                
                {/* Checkbox único */}
                <div className="form-group">
                    <label className="checkbox-label">
                        <input 
                            type="checkbox"
                            checked={formData.newsletter}
                            onChange={(e) => updateField('newsletter', e.target.checked)}
                        />
                        Receber newsletter
                    </label>
                </div>
                
                {/* Textarea */}
                <div className="form-group">
                    <label>Comentários:</label>
                    <textarea 
                        value={formData.comments}
                        onChange={(e) => updateField('comments', e.target.value)}
                        rows="4"
                        placeholder="Deixe seus comentários..."
                    />
                </div>
                
                <button type="submit">Enviar</button>
            </form>
            
            {/* Preview dos dados */}
            <div className="form-preview">
                <h4>Preview dos dados:</h4>
                <pre>{JSON.stringify(formData, null, 2)}</pre>
            </div>
        </div>
    );
}

// =============================================================================
// 7. RENDERIZAÇÃO CONDICIONAL E LISTAS
// =============================================================================

/**
 * 🔀 RENDERIZAÇÃO CONDICIONAL
 * 
 * Diferentes formas de renderizar condicionalmente
 */
function ConditionalRendering() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    const login = () => {
        setLoading(true);
        setTimeout(() => {
            setUser({
                id: 1,
                name: 'João Silva',
                email: 'joao@email.com',
                role: 'admin'
            });
            setLoading(false);
        }, 1000);
    };
    
    const logout = () => {
        setUser(null);
        setShowDetails(false);
    };
    
    return (
        <div className="conditional-rendering">
            <h3>Renderização Condicional</h3>
            
            {/* Operador ternário */}
            {loading ? (
                <div className="loading">Carregando...</div>
            ) : user ? (
                <div className="user-info">
                    <h4>Bem-vindo, {user.name}!</h4>
                    <button onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
                    </button>
                    <button onClick={logout}>Logout</button>
                    
                    {/* Renderização condicional com && */}
                    {showDetails && (
                        <div className="user-details">
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            
                            {/* Condicional baseada em propriedade */}
                            {user.role === 'admin' && (
                                <div className="admin-panel">
                                    <h5>Painel Administrativo</h5>
                                    <button>Gerenciar Usuários</button>
                                    <button>Configurações</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="login-prompt">
                    <p>Você não está logado.</p>
                    <button onClick={login}>Login</button>
                </div>
            )}
        </div>
    );
}

/**
 * 📋 RENDERIZAÇÃO DE LISTAS
 * 
 * Técnicas para renderizar arrays de dados
 */
function ListRendering() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Notebook', price: 2500, category: 'Eletrônicos', inStock: true },
        { id: 2, name: 'Mouse', price: 50, category: 'Acessórios', inStock: true },
        { id: 3, name: 'Teclado', price: 150, category: 'Acessórios', inStock: false },
        { id: 4, name: 'Monitor', price: 800, category: 'Eletrônicos', inStock: true },
        { id: 5, name: 'Webcam', price: 200, category: 'Acessórios', inStock: false }
    ]);
    
    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    
    // Filtrar produtos
    const filteredProducts = products.filter(product => {
        switch (filter) {
            case 'inStock':
                return product.inStock;
            case 'outOfStock':
                return !product.inStock;
            case 'electronics':
                return product.category === 'Eletrônicos';
            case 'accessories':
                return product.category === 'Acessórios';
            default:
                return true;
        }
    });
    
    // Ordenar produtos
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return a.price - b.price;
            case 'priceDesc':
                return b.price - a.price;
            default:
                return 0;
        }
    });
    
    return (
        <div className="list-rendering">
            <h3>Lista de Produtos</h3>
            
            {/* Controles de filtro e ordenação */}
            <div className="controls">
                <div className="filter-controls">
                    <label>Filtrar por:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Todos</option>
                        <option value="inStock">Em estoque</option>
                        <option value="outOfStock">Fora de estoque</option>
                        <option value="electronics">Eletrônicos</option>
                        <option value="accessories">Acessórios</option>
                    </select>
                </div>
                
                <div className="sort-controls">
                    <label>Ordenar por:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="name">Nome (A-Z)</option>
                        <option value="price">Preço (menor)</option>
                        <option value="priceDesc">Preço (maior)</option>
                    </select>
                </div>
            </div>
            
            {/* Lista de produtos */}
            <div className="products-grid">
                {sortedProducts.length > 0 ? (
                    sortedProducts.map(product => (
                        <div key={product.id} className="product-item">
                            <h4>{product.name}</h4>
                            <p className="price">R$ {product.price.toFixed(2)}</p>
                            <p className="category">{product.category}</p>
                            <p className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                {product.inStock ? '✅ Em estoque' : '❌ Fora de estoque'}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="no-products">
                        <p>Nenhum produto encontrado com os filtros aplicados.</p>
                    </div>
                )}
            </div>
            
            {/* Estatísticas */}
            <div className="stats">
                <p>Total de produtos: {products.length}</p>
                <p>Produtos filtrados: {sortedProducts.length}</p>
                <p>Em estoque: {products.filter(p => p.inStock).length}</p>
                <p>Fora de estoque: {products.filter(p => !p.inStock).length}</p>
            </div>
        </div>
    );
}

// =============================================================================
// 8. COMPONENTE PRINCIPAL - DEMONSTRAÇÃO
// =============================================================================

/**
 * 🎯 APLICAÇÃO PRINCIPAL
 * 
 * Demonstra todos os conceitos aprendidos
 */
function ReactFundamentalsApp() {
    const [currentSection, setCurrentSection] = useState('welcome');
    
    const sections = {
        welcome: { title: 'Bem-vindo', component: <WelcomeMessage /> },
        jsx: { title: 'JSX Examples', component: <JSXExamples /> },
        props: { title: 'Props', component: (
            <div>
                <UserCard 
                    name="João Silva"
                    email="joao@email.com"
                    avatar="/avatar1.jpg"
                    isOnline={true}
                />
                <Card title="Exemplo de Card">
                    <p>Este é o conteúdo do card passado como children.</p>
                    <Button text="Clique aqui" onClick={() => alert('Botão clicado!')} />
                </Card>
            </div>
        )},
        state: { title: 'Estado', component: (
            <div>
                <Counter />
                <UserProfile />
                <TodoList />
            </div>
        )},
        effects: { title: 'Efeitos', component: (
            <div>
                <DataFetcher />
                <SearchComponent />
                <Timer />
            </div>
        )},
        events: { title: 'Eventos', component: <EventExamples /> },
        forms: { title: 'Formulários', component: <ControlledForm /> },
        conditional: { title: 'Renderização Condicional', component: <ConditionalRendering /> },
        lists: { title: 'Listas', component: <ListRendering /> }
    };
    
    return (
        <div className="react-fundamentals-app">
            <header className="app-header">
                <h1>🎯 React Fundamentals</h1>
                <p>Aprenda os conceitos fundamentais do React</p>
            </header>
            
            <nav className="app-nav">
                {Object.entries(sections).map(([key, section]) => (
                    <button 
                        key={key}
                        className={currentSection === key ? 'active' : ''}
                        onClick={() => setCurrentSection(key)}
                    >
                        {section.title}
                    </button>
                ))}
            </nav>
            
            <main className="app-content">
                <h2>{sections[currentSection].title}</h2>
                {sections[currentSection].component}
            </main>
            
            <footer className="app-footer">
                <p>🎓 Curso de Desenvolvimento Web Moderno - Módulo 2: React</p>
            </footer>
        </div>
    );
}

// =============================================================================
// 9. ESTILOS CSS PARA A APLICAÇÃO
// =============================================================================

/**
 * 🎨 ESTILOS CSS
 * 
 * Estilos para todos os componentes demonstrados
 */
const styles = `
/* Reset e estilos base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f5f5f5;
}

/* Layout principal */
.react-fundamentals-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.app-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
}

.app-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.app-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.app-nav button {
    padding: 10px 15px;
    border: none;
    background: #e9ecef;
    color: #495057;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.app-nav button:hover {
    background: #dee2e6;
    transform: translateY(-2px);
}

.app-nav button.active {
    background: #007bff;
    color: white;
}

.app-content {
    min-height: 400px;
    padding: 20px;
}

.app-footer {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    color: #6c757d;
}

/* Componentes específicos */
.welcome {
    text-align: center;
    padding: 40px;
}

.jsx-examples {
    padding: 20px;
}

.jsx-examples h2 {
    color: #007bff;
    margin-bottom: 15px;
}

.jsx-examples ul {
    list-style-type: none;
    padding: 0;
}

.jsx-examples li {
    padding: 8px;
    margin: 5px 0;
    background: #e3f2fd;
    border-radius: 4px;
}

.user-card {
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 10px 0;
    background: white;
}

.user-card img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 15px;
    background: #ddd;
}

.user-info h3 {
    margin-bottom: 5px;
    color: #333;
}

.status.online {
    color: #28a745;
}

.status.offline {
    color: #dc3545;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}

.card {
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
    overflow: hidden;
}

.card-header {
    background: #f8f9fa;
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.card-body {
    padding: 15px;
}

.counter {
    text-align: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.counter-buttons {
    margin-top: 15px;
}

.counter-buttons button {
    margin: 0 5px;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.user-profile {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.user-profile input {
    display: block;
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.user-display {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.todo-list {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.todo-input {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.todo-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.todos {
    list-style: none;
    padding: 0;
}

.todos li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #eee;
    border-radius: 4px;
    cursor: pointer;
}

.todos li.completed {
    text-decoration: line-through;
    opacity: 0.6;
}

.todos li button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.todo-stats {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
    display: flex;
    gap: 20px;
}

.data-display {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.search-component {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.search-component input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
}

.timer {
    text-align: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.timer-controls {
    margin-top: 15px;
}

.timer-controls button {
    margin: 0 5px;
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.timer-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.event-examples {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.message {
    padding: 10px;
    margin: 10px 0;
    background: #e3f2fd;
    border-radius: 4px;
    min-height: 20px;
}

.hover-area {
    transition: background-color 0.3s ease;
}

.hover-area:hover {
    background-color: #f0f0f0;
}

.controlled-form {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-group input.error {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 12px;
    margin-top: 5px;
    display: block;
}

.checkbox-label {
    display: flex !important;
    align-items: center;
    margin: 5px 0;
    font-weight: normal !important;
}

.checkbox-label input {
    width: auto !important;
    margin-right: 8px;
}

.form-preview {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.form-preview pre {
    background: #e9ecef;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
}

.conditional-rendering {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #007bff;
}

.user-details {
    margin-top: 15px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.admin-panel {
    margin-top: 15px;
    padding: 15px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
}

.admin-panel button {
    margin: 5px;
    padding: 8px 15px;
    border: none;
    background: #ffc107;
    color: #212529;
    border-radius: 4px;
    cursor: pointer;
}

.list-rendering {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.controls {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.filter-controls,
.sort-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
}

.product-item {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
}

.product-item h4 {
    margin-bottom: 10px;
    color: #333;
}

.price {
    font-size: 18px;
    font-weight: bold;
    color: #28a745;
    margin: 5px 0;
}

.category {
    color: #6c757d;
    font-size: 14px;
    margin: 5px 0;
}

.stock.in-stock {
    color: #28a745;
}

.stock.out-of-stock {
    color: #dc3545;
}

.no-products {
    text-align: center;
    padding: 40px;
    color: #6c757d;
}

.stats {
    display: flex;
    gap: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.stats p {
    margin: 0;
    font-size: 14px;
    color: #495057;
}

/* Responsividade */
@media (max-width: 768px) {
    .react-fundamentals-app {
        padding: 10px;
    }
    
    .app-nav {
        flex-direction: column;
    }
    
    .controls {
        flex-direction: column;
        gap: 10px;
    }
    
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .stats {
        flex-direction: column;
        gap: 5px;
    }
    
    .todo-input {
        flex-direction: column;
    }
    
    .counter-buttons button,
    .timer-controls button {
        display: block;
        width: 100%;
        margin: 5px 0;
    }
}
`;

// =============================================================================
// 10. EXPORTAÇÃO E INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 INICIALIZAÇÃO
 * 
 * Função para demonstrar todos os conceitos
 */
function initializeReactFundamentals() {
    console.log('\n🎯 INICIANDO: FUNDAMENTOS DO REACT\n');
    
    // Informações sobre o módulo
    const moduleInfo = {
        title: 'Fundamentos do React',
        topics: [
            'Componentes funcionais e JSX',
            'Props e comunicação entre componentes',
            'Estado local com useState',
            'Efeitos colaterais com useEffect',
            'Manipulação de eventos',
            'Formulários controlados',
            'Renderização condicional',
            'Renderização de listas'
        ],
        practicalExamples: [
            'Contador interativo',
            'Lista de tarefas (Todo List)',
            'Formulário com validação',
            'Busca com debounce',
            'Timer com controles',
            'Lista de produtos com filtros'
        ],
        nextSteps: [
            'Hooks avançados (useReducer, useContext)',
            'Componentes de classe (legacy)',
            'Otimização de performance',
            'Testes de componentes',
            'Roteamento com React Router',
            'Gerenciamento de estado global'
        ]
    };
    
    console.log('📚 Informações do Módulo:', moduleInfo);
    
    // Dicas importantes
    const importantTips = [
        '🎯 Sempre use keys únicas ao renderizar listas',
        '🔄 Estado é imutável - sempre crie novas referências',
        '⚡ useEffect com array vazio executa apenas uma vez',
        '🧹 Sempre faça cleanup de timers e subscriptions',
        '📝 Formulários controlados oferecem melhor controle',
        '🎨 JSX é JavaScript - use camelCase para propriedades',
        '🔍 Props são read-only - nunca as modifique diretamente',
        '🚀 Componentes devem ser funções puras quando possível'
    ];
    
    console.log('\n💡 Dicas Importantes:');
    importantTips.forEach(tip => console.log(tip));
    
    console.log('\n✅ MÓDULO CARREGADO COM SUCESSO!');
    console.log('🎓 Próximo passo: Explore os exemplos práticos e faça os exercícios!');
    
    return {
        moduleInfo,
        importantTips,
        components: {
            ReactFundamentalsApp,
            WelcomeMessage,
            JSXExamples,
            UserCard,
            Button,
            Card,
            Counter,
            UserProfile,
            TodoList,
            DataFetcher,
            SearchComponent,
            Timer,
            EventExamples,
            ControlledForm,
            ConditionalRendering,
            ListRendering
        },
        styles
    };
}

// Executar inicialização
const reactFundamentals = initializeReactFundamentals();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = reactFundamentals;
}

// Para uso no navegador
if (typeof window !== 'undefined') {
    window.ReactFundamentals = reactFundamentals;
}

/**
 * 📋 RESUMO DO ARQUIVO
 * 
 * Este arquivo aborda os fundamentos essenciais do React:
 * 
 * 1. **Componentes e JSX**: Sintaxe, regras e boas práticas
 * 2. **Props**: Comunicação entre componentes, valores padrão, children
 * 3. **Estado**: useState para dados que mudam, objetos e arrays
 * 4. **Efeitos**: useEffect para side effects, dependências, cleanup
 * 5. **Eventos**: Manipulação de eventos sintéticos do React
 * 6. **Formulários**: Componentes controlados, validação, múltiplos inputs
 * 7. **Renderização**: Condicional e de listas com filtros e ordenação
 * 8. **Aplicação**: Exemplo completo integrando todos os conceitos
 * 
 * 🎯 **Próximos Passos**:
 * - Pratique criando seus próprios componentes
 * - Experimente diferentes padrões de estado
 * - Explore a documentação oficial do React
 * - Faça os exercícios propostos no README
 * 
 * 📚 **Recursos Adicionais**:
 * - React Docs: https://react.dev/
 * - React DevTools: Extensão para debugging
 * - Create React App: Ferramenta para iniciar projetos
 * - Vite: Alternativa moderna e rápida
 */