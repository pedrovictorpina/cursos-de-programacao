/**
 * 🎯 MÓDULO 2: REACT FRAMEWORK
 * 📚 Aula 2: Hooks Avançados
 * 
 * Este arquivo aborda hooks avançados do React:
 * - useReducer para estado complexo
 * - useContext para compartilhamento de dados
 * - useMemo para otimização de cálculos
 * - useCallback para otimização de funções
 * - useRef para referências diretas
 * - Hooks customizados
 * - Padrões avançados de composição
 * 
 * 🎓 OBJETIVOS DE APRENDIZAGEM:
 * ✅ Dominar hooks avançados do React
 * ✅ Implementar gerenciamento de estado complexo
 * ✅ Otimizar performance com memoização
 * ✅ Criar hooks customizados reutilizáveis
 * ✅ Aplicar padrões avançados de composição
 * ✅ Entender quando usar cada hook
 */

// =============================================================================
// 1. USEREDUCER - ESTADO COMPLEXO
// =============================================================================

import React, { useReducer, useContext, useMemo, useCallback, useRef, useState, useEffect, createContext } from 'react';

/**
 * 🔄 USEREDUCER
 * 
 * useReducer é ideal para estado complexo com múltiplas ações
 * Segue o padrão Redux: (state, action) => newState
 */

// Tipos de ações para o reducer
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    APPLY_DISCOUNT: 'APPLY_DISCOUNT',
    SET_SHIPPING: 'SET_SHIPPING'
};

// Estado inicial do carrinho
const initialCartState = {
    items: [],
    discount: 0,
    shipping: 0,
    total: 0
};

// Reducer function
function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const { product } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            
            let newItems;
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...state.items, { ...product, quantity: 1 }];
            }
            
            return {
                ...state,
                items: newItems
            };
        }
        
        case CART_ACTIONS.REMOVE_ITEM: {
            const { productId } = action.payload;
            return {
                ...state,
                items: state.items.filter(item => item.id !== productId)
            };
        }
        
        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            
            if (quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => item.id !== productId)
                };
            }
            
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === productId
                        ? { ...item, quantity }
                        : item
                )
            };
        }
        
        case CART_ACTIONS.CLEAR_CART: {
            return {
                ...state,
                items: []
            };
        }
        
        case CART_ACTIONS.APPLY_DISCOUNT: {
            const { discount } = action.payload;
            return {
                ...state,
                discount: Math.max(0, Math.min(100, discount))
            };
        }
        
        case CART_ACTIONS.SET_SHIPPING: {
            const { shipping } = action.payload;
            return {
                ...state,
                shipping: Math.max(0, shipping)
            };
        }
        
        default:
            return state;
    }
}

/**
 * 🛒 COMPONENTE DE CARRINHO COM USEREDUCER
 */
function ShoppingCart() {
    const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
    
    // Produtos disponíveis
    const availableProducts = [
        { id: 1, name: 'Notebook', price: 2500 },
        { id: 2, name: 'Mouse', price: 50 },
        { id: 3, name: 'Teclado', price: 150 },
        { id: 4, name: 'Monitor', price: 800 }
    ];
    
    // Calcular total
    const subtotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * cartState.discount) / 100;
    const total = subtotal - discountAmount + cartState.shipping;
    
    // Action creators
    const addItem = (product) => {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload: { product }
        });
    };
    
    const removeItem = (productId) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: { productId }
        });
    };
    
    const updateQuantity = (productId, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { productId, quantity }
        });
    };
    
    const clearCart = () => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    };
    
    const applyDiscount = (discount) => {
        dispatch({
            type: CART_ACTIONS.APPLY_DISCOUNT,
            payload: { discount }
        });
    };
    
    const setShipping = (shipping) => {
        dispatch({
            type: CART_ACTIONS.SET_SHIPPING,
            payload: { shipping }
        });
    };
    
    return (
        <div className="shopping-cart">
            <h3>🛒 Carrinho de Compras (useReducer)</h3>
            
            {/* Produtos disponíveis */}
            <div className="available-products">
                <h4>Produtos Disponíveis:</h4>
                <div className="products-grid">
                    {availableProducts.map(product => (
                        <div key={product.id} className="product-card">
                            <h5>{product.name}</h5>
                            <p>R$ {product.price.toFixed(2)}</p>
                            <button onClick={() => addItem(product)}>
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Itens do carrinho */}
            <div className="cart-items">
                <h4>Itens no Carrinho:</h4>
                {cartState.items.length === 0 ? (
                    <p>Carrinho vazio</p>
                ) : (
                    <div className="cart-list">
                        {cartState.items.map(item => (
                            <div key={item.id} className="cart-item">
                                <span>{item.name}</span>
                                <span>R$ {item.price.toFixed(2)}</span>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                        +
                                    </button>
                                </div>
                                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => removeItem(item.id)}>❌</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Controles do carrinho */}
            <div className="cart-controls">
                <div className="discount-control">
                    <label>Desconto (%):</label>
                    <input 
                        type="number"
                        min="0"
                        max="100"
                        value={cartState.discount}
                        onChange={(e) => applyDiscount(parseInt(e.target.value) || 0)}
                    />
                </div>
                
                <div className="shipping-control">
                    <label>Frete (R$):</label>
                    <input 
                        type="number"
                        min="0"
                        step="0.01"
                        value={cartState.shipping}
                        onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                    />
                </div>
                
                <button onClick={clearCart} className="clear-cart">
                    Limpar Carrinho
                </button>
            </div>
            
            {/* Resumo */}
            <div className="cart-summary">
                <div className="summary-line">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                    <span>Desconto ({cartState.discount}%):</span>
                    <span>-R$ {discountAmount.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                    <span>Frete:</span>
                    <span>R$ {cartState.shipping.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// 2. USECONTEXT - COMPARTILHAMENTO DE DADOS
// =============================================================================

/**
 * 🌐 USECONTEXT
 * 
 * Context permite compartilhar dados entre componentes sem prop drilling
 */

// Criar contextos
const ThemeContext = createContext();
const UserContext = createContext();
const NotificationContext = createContext();

/**
 * 🎨 THEME PROVIDER
 */
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };
    
    const themeConfig = {
        light: {
            background: '#ffffff',
            color: '#333333',
            primary: '#007bff',
            secondary: '#6c757d'
        },
        dark: {
            background: '#333333',
            color: '#ffffff',
            primary: '#0d6efd',
            secondary: '#adb5bd'
        }
    };
    
    const value = {
        theme,
        themeConfig: themeConfig[theme],
        toggleTheme
    };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * 👤 USER PROVIDER
 */
function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const login = async (credentials) => {
        setLoading(true);
        try {
            // Simular login
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const userData = {
                id: 1,
                name: credentials.username,
                email: `${credentials.username}@email.com`,
                role: 'user',
                preferences: {
                    notifications: true,
                    theme: 'auto'
                }
            };
            
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    
    const updateUser = (updates) => {
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };
    
    // Verificar usuário salvo no localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);
    
    const value = {
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user
    };
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

/**
 * 🔔 NOTIFICATION PROVIDER
 */
function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    
    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const notification = {
            id,
            message,
            type,
            timestamp: new Date()
        };
        
        setNotifications(prev => [...prev, notification]);
        
        // Auto-remover após duração especificada
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    };
    
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };
    
    const clearNotifications = () => {
        setNotifications([]);
    };
    
    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications
    };
    
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

/**
 * 🎨 COMPONENTE QUE USA THEME CONTEXT
 */
function ThemedComponent() {
    const { theme, themeConfig, toggleTheme } = useContext(ThemeContext);
    
    return (
        <div 
            className="themed-component"
            style={{
                background: themeConfig.background,
                color: themeConfig.color,
                padding: '20px',
                borderRadius: '8px',
                border: `1px solid ${themeConfig.secondary}`
            }}
        >
            <h4>Componente com Tema</h4>
            <p>Tema atual: {theme}</p>
            <button 
                onClick={toggleTheme}
                style={{
                    background: themeConfig.primary,
                    color: themeConfig.background,
                    border: 'none',
                    padding: '10px 15px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Alternar Tema
            </button>
        </div>
    );
}

/**
 * 👤 COMPONENTE DE LOGIN
 */
function LoginComponent() {
    const { user, loading, login, logout, isAuthenticated } = useContext(UserContext);
    const { addNotification } = useContext(NotificationContext);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    
    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!credentials.username || !credentials.password) {
            addNotification('Preencha todos os campos', 'error');
            return;
        }
        
        await login(credentials);
        addNotification('Login realizado com sucesso!', 'success');
        setCredentials({ username: '', password: '' });
    };
    
    const handleLogout = () => {
        logout();
        addNotification('Logout realizado com sucesso!', 'info');
    };
    
    if (isAuthenticated) {
        return (
            <div className="user-profile">
                <h4>Bem-vindo, {user.name}!</h4>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }
    
    return (
        <div className="login-form">
            <h4>Login</h4>
            <form onSubmit={handleLogin}>
                <input 
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    disabled={loading}
                />
                <input 
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}

/**
 * 🔔 COMPONENTE DE NOTIFICAÇÕES
 */
function NotificationList() {
    const { notifications, removeNotification, clearNotifications } = useContext(NotificationContext);
    
    if (notifications.length === 0) {
        return null;
    }
    
    return (
        <div className="notification-container">
            <div className="notification-header">
                <h4>Notificações ({notifications.length})</h4>
                <button onClick={clearNotifications}>Limpar Todas</button>
            </div>
            
            <div className="notification-list">
                {notifications.map(notification => (
                    <div 
                        key={notification.id}
                        className={`notification notification-${notification.type}`}
                    >
                        <span>{notification.message}</span>
                        <button onClick={() => removeNotification(notification.id)}>×</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// =============================================================================
// 3. USEMEMO E USECALLBACK - OTIMIZAÇÃO
// =============================================================================

/**
 * ⚡ USEMEMO E USECALLBACK
 * 
 * useMemo: Memoriza valores calculados
 * useCallback: Memoriza funções
 */

/**
 * 📊 COMPONENTE COM CÁLCULOS PESADOS
 */
function ExpensiveCalculationComponent() {
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
    const [multiplier, setMultiplier] = useState(1);
    const [filter, setFilter] = useState('all');
    
    // Função pesada simulada
    const expensiveCalculation = (nums, mult) => {
        console.log('🔄 Executando cálculo pesado...');
        
        // Simular processamento pesado
        let result = 0;
        for (let i = 0; i < 1000000; i++) {
            result += i * 0.001;
        }
        
        return nums.map(num => num * mult).reduce((sum, num) => sum + num, 0);
    };
    
    // useMemo para memorizar cálculo pesado
    const calculatedValue = useMemo(() => {
        return expensiveCalculation(numbers, multiplier);
    }, [numbers, multiplier]); // Só recalcula se numbers ou multiplier mudarem
    
    // useMemo para filtrar números
    const filteredNumbers = useMemo(() => {
        console.log('🔍 Filtrando números...');
        
        switch (filter) {
            case 'even':
                return numbers.filter(num => num % 2 === 0);
            case 'odd':
                return numbers.filter(num => num % 2 !== 0);
            default:
                return numbers;
        }
    }, [numbers, filter]);
    
    // useCallback para memorizar função
    const addNumber = useCallback(() => {
        const newNumber = Math.floor(Math.random() * 100) + 1;
        setNumbers(prev => [...prev, newNumber]);
    }, []); // Função não depende de nenhum valor
    
    const removeNumber = useCallback((index) => {
        setNumbers(prev => prev.filter((_, i) => i !== index));
    }, []); // Função não depende de nenhum valor
    
    // useCallback com dependências
    const multiplyNumber = useCallback((index) => {
        setNumbers(prev => prev.map((num, i) => 
            i === index ? num * multiplier : num
        ));
    }, [multiplier]); // Depende de multiplier
    
    return (
        <div className="expensive-calculation">
            <h3>⚡ Otimização com useMemo e useCallback</h3>
            
            <div className="controls">
                <div className="control-group">
                    <label>Multiplicador:</label>
                    <input 
                        type="number"
                        value={multiplier}
                        onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
                    />
                </div>
                
                <div className="control-group">
                    <label>Filtro:</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">Todos</option>
                        <option value="even">Pares</option>
                        <option value="odd">Ímpares</option>
                    </select>
                </div>
                
                <button onClick={addNumber}>Adicionar Número</button>
            </div>
            
            <div className="results">
                <div className="result-item">
                    <strong>Valor Calculado (pesado):</strong> {calculatedValue.toFixed(2)}
                </div>
                
                <div className="result-item">
                    <strong>Números Originais:</strong>
                    <div className="number-list">
                        {numbers.map((num, index) => (
                            <div key={index} className="number-item">
                                <span>{num}</span>
                                <button onClick={() => multiplyNumber(index)}>×{multiplier}</button>
                                <button onClick={() => removeNumber(index)}>❌</button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="result-item">
                    <strong>Números Filtrados ({filter}):</strong>
                    <div className="number-list">
                        {filteredNumbers.map((num, index) => (
                            <span key={index} className="filtered-number">{num}</span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="performance-tip">
                💡 <strong>Dica:</strong> Abra o console para ver quando os cálculos são executados.
                useMemo e useCallback evitam recálculos desnecessários!
            </div>
        </div>
    );
}

/**
 * 📋 COMPONENTE FILHO OTIMIZADO
 */
const OptimizedChildComponent = React.memo(({ data, onUpdate, multiplier }) => {
    console.log('🔄 Renderizando componente filho...');
    
    return (
        <div className="optimized-child">
            <h4>Componente Filho Otimizado</h4>
            <p>Dados recebidos: {JSON.stringify(data)}</p>
            <p>Multiplicador: {multiplier}</p>
            <button onClick={() => onUpdate('Atualizado!')}>Atualizar Pai</button>
        </div>
    );
});

/**
 * 🎯 COMPONENTE PAI QUE USA OTIMIZAÇÃO
 */
function OptimizedParentComponent() {
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState('Inicial');
    const [multiplier, setMultiplier] = useState(2);
    
    // Dados que não mudam frequentemente
    const stableData = useMemo(() => ({
        id: 1,
        name: 'Dados Estáveis',
        timestamp: Date.now()
    }), []); // Só cria uma vez
    
    // Função memorizada
    const handleUpdate = useCallback((newMessage) => {
        setMessage(newMessage);
    }, []); // Função estável
    
    return (
        <div className="optimized-parent">
            <h3>🎯 Componente Pai Otimizado</h3>
            
            <div className="parent-controls">
                <button onClick={() => setCount(count + 1)}>
                    Count: {count}
                </button>
                
                <input 
                    type="number"
                    value={multiplier}
                    onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
                    placeholder="Multiplicador"
                />
            </div>
            
            <p>Mensagem: {message}</p>
            
            {/* 
                Este componente só re-renderiza se data, onUpdate ou multiplier mudarem
                Como data e onUpdate são memorizados, só re-renderiza quando multiplier muda
            */}
            <OptimizedChildComponent 
                data={stableData}
                onUpdate={handleUpdate}
                multiplier={multiplier}
            />
            
            <div className="optimization-info">
                <p>💡 O componente filho só re-renderiza quando necessário!</p>
                <p>Clique em "Count" para ver que o filho não re-renderiza.</p>
                <p>Mude o multiplicador para ver o filho re-renderizar.</p>
            </div>
        </div>
    );
}

// =============================================================================
// 4. USEREF - REFERÊNCIAS DIRETAS
// =============================================================================

/**
 * 🎯 USEREF
 * 
 * useRef permite acessar elementos DOM diretamente
 * e manter valores que não causam re-render
 */

function UseRefExamples() {
    // Refs para elementos DOM
    const inputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    
    // Ref para valores que não causam re-render
    const countRef = useRef(0);
    const timerRef = useRef(null);
    
    // Estado normal para comparação
    const [renderCount, setRenderCount] = useState(0);
    
    // Focar no input
    const focusInput = () => {
        inputRef.current?.focus();
    };
    
    // Controlar vídeo
    const playVideo = () => {
        videoRef.current?.play();
    };
    
    const pauseVideo = () => {
        videoRef.current?.pause();
    };
    
    // Desenhar no canvas
    const drawOnCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Desenhar círculo aleatório
            ctx.beginPath();
            ctx.arc(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                20,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 50%)`;
            ctx.fill();
        }
    };
    
    // Incrementar contador sem re-render
    const incrementWithoutRender = () => {
        countRef.current += 1;
        console.log('Contador sem re-render:', countRef.current);
    };
    
    // Incrementar contador com re-render
    const incrementWithRender = () => {
        setRenderCount(prev => prev + 1);
    };
    
    // Timer com useRef
    const startTimer = () => {
        if (timerRef.current) return; // Já está rodando
        
        timerRef.current = setInterval(() => {
            countRef.current += 1;
            console.log('Timer tick:', countRef.current);
        }, 1000);
    };
    
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };
    
    // Cleanup do timer
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);
    
    return (
        <div className="useref-examples">
            <h3>🎯 Exemplos de useRef</h3>
            
            {/* Referência para input */}
            <div className="ref-section">
                <h4>1. Focar em Input</h4>
                <input 
                    ref={inputRef}
                    type="text"
                    placeholder="Clique no botão para focar aqui"
                />
                <button onClick={focusInput}>Focar Input</button>
            </div>
            
            {/* Referência para vídeo */}
            <div className="ref-section">
                <h4>2. Controlar Vídeo</h4>
                <video 
                    ref={videoRef}
                    width="300"
                    height="200"
                    controls
                    muted
                >
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeo.
                </video>
                <div className="video-controls">
                    <button onClick={playVideo}>Play</button>
                    <button onClick={pauseVideo}>Pause</button>
                </div>
            </div>
            
            {/* Referência para canvas */}
            <div className="ref-section">
                <h4>3. Desenhar no Canvas</h4>
                <canvas 
                    ref={canvasRef}
                    width="300"
                    height="200"
                    style={{ border: '1px solid #ccc' }}
                />
                <button onClick={drawOnCanvas}>Desenhar Círculo</button>
            </div>
            
            {/* Valores sem re-render */}
            <div className="ref-section">
                <h4>4. Valores sem Re-render</h4>
                <p>Contador com re-render: {renderCount}</p>
                <p>Contador sem re-render: {countRef.current} (veja o console)</p>
                
                <div className="counter-controls">
                    <button onClick={incrementWithoutRender}>
                        Incrementar sem Re-render
                    </button>
                    <button onClick={incrementWithRender}>
                        Incrementar com Re-render
                    </button>
                </div>
            </div>
            
            {/* Timer com useRef */}
            <div className="ref-section">
                <h4>5. Timer com useRef</h4>
                <p>Timer rodando: {timerRef.current ? 'Sim' : 'Não'}</p>
                <p>Valor atual: {countRef.current} (veja o console)</p>
                
                <div className="timer-controls">
                    <button onClick={startTimer}>Iniciar Timer</button>
                    <button onClick={stopTimer}>Parar Timer</button>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// 5. HOOKS CUSTOMIZADOS
// =============================================================================

/**
 * 🔧 HOOKS CUSTOMIZADOS
 * 
 * Hooks customizados permitem reutilizar lógica entre componentes
 */

/**
 * 🌐 Hook para requisições HTTP
 */
function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url, JSON.stringify(options)]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const refetch = () => {
        fetchData();
    };
    
    return { data, loading, error, refetch };
}

/**
 * 💾 Hook para localStorage
 */
function useLocalStorage(key, initialValue) {
    // Função para ler valor do localStorage
    const readValue = useCallback(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Erro ao ler localStorage key "${key}":`, error);
            return initialValue;
        }
    }, [key, initialValue]);
    
    const [storedValue, setStoredValue] = useState(readValue);
    
    // Função para salvar no localStorage
    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.warn(`Erro ao salvar no localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);
    
    // Remover do localStorage
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.warn(`Erro ao remover localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);
    
    return [storedValue, setValue, removeValue];
}

/**
 * ⏱️ Hook para debounce
 */
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    
    return debouncedValue;
}

/**
 * 🖱️ Hook para posição do mouse
 */
function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (event) => {
            setMousePosition({
                x: event.clientX,
                y: event.clientY
            });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    return mousePosition;
}

/**
 * 📱 Hook para media queries
 */
function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);
    
    useEffect(() => {
        const media = window.matchMedia(query);
        
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);
    
    return matches;
}

/**
 * 🔄 Hook para toggle
 */
function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);
    
    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);
    
    const setTrue = useCallback(() => {
        setValue(true);
    }, []);
    
    const setFalse = useCallback(() => {
        setValue(false);
    }, []);
    
    return [value, toggle, setTrue, setFalse];
}

/**
 * 📊 Componente que demonstra hooks customizados
 */
function CustomHooksDemo() {
    // Hook de fetch
    const { data: posts, loading, error, refetch } = useFetch(
        'https://jsonplaceholder.typicode.com/posts?_limit=5'
    );
    
    // Hook de localStorage
    const [savedText, setSavedText, removeSavedText] = useLocalStorage('demo-text', '');
    
    // Hook de debounce
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    
    // Hook de posição do mouse
    const mousePosition = useMousePosition();
    
    // Hook de media query
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    // Hook de toggle
    const [isVisible, toggleVisible, showContent, hideContent] = useToggle(false);
    
    return (
        <div className="custom-hooks-demo">
            <h3>🔧 Demonstração de Hooks Customizados</h3>
            
            {/* useFetch */}
            <div className="hook-section">
                <h4>1. useFetch - Requisições HTTP</h4>
                {loading && <p>Carregando posts...</p>}
                {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
                {posts && (
                    <div>
                        <button onClick={refetch}>Recarregar</button>
                        <ul>
                            {posts.slice(0, 3).map(post => (
                                <li key={post.id}>
                                    <strong>{post.title}</strong>
                                    <p>{post.body.substring(0, 100)}...</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            {/* useLocalStorage */}
            <div className="hook-section">
                <h4>2. useLocalStorage - Persistência Local</h4>
                <input 
                    type="text"
                    value={savedText}
                    onChange={(e) => setSavedText(e.target.value)}
                    placeholder="Digite algo (será salvo automaticamente)"
                />
                <p>Texto salvo: {savedText}</p>
                <button onClick={removeSavedText}>Limpar</button>
            </div>
            
            {/* useDebounce */}
            <div className="hook-section">
                <h4>3. useDebounce - Busca com Delay</h4>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite para buscar (delay de 500ms)"
                />
                <p>Termo de busca: {searchTerm}</p>
                <p>Termo com debounce: {debouncedSearchTerm}</p>
            </div>
            
            {/* useMousePosition */}
            <div className="hook-section">
                <h4>4. useMousePosition - Posição do Mouse</h4>
                <p>Posição do mouse: X: {mousePosition.x}, Y: {mousePosition.y}</p>
                <div 
                    style={{
                        width: '200px',
                        height: '100px',
                        border: '1px solid #ccc',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div 
                        style={{
                            position: 'absolute',
                            left: `${mousePosition.x % 200}px`,
                            top: `${mousePosition.y % 100}px`,
                            width: '10px',
                            height: '10px',
                            background: 'red',
                            borderRadius: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    />
                </div>
            </div>
            
            {/* useMediaQuery */}
            <div className="hook-section">
                <h4>5. useMediaQuery - Responsividade</h4>
                <p>Dispositivo: {isMobile ? '📱 Mobile' : '💻 Desktop'}</p>
                <p>Largura da tela: {isMobile ? 'Menor que 768px' : 'Maior que 768px'}</p>
            </div>
            
            {/* useToggle */}
            <div className="hook-section">
                <h4>6. useToggle - Controle de Estado Booleano</h4>
                <div className="toggle-controls">
                    <button onClick={toggleVisible}>Toggle</button>
                    <button onClick={showContent}>Mostrar</button>
                    <button onClick={hideContent}>Esconder</button>
                </div>
                
                {isVisible && (
                    <div className="toggle-content">
                        <p>🎉 Conteúdo visível!</p>
                        <p>Este conteúdo é controlado pelo hook useToggle.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// =============================================================================
// 6. APLICAÇÃO PRINCIPAL COM TODOS OS HOOKS
// =============================================================================

/**
 * 🎯 APLICAÇÃO PRINCIPAL
 * 
 * Demonstra todos os hooks avançados em uma aplicação completa
 */
function AdvancedHooksApp() {
    const [currentSection, setCurrentSection] = useState('reducer');
    
    const sections = {
        reducer: { title: 'useReducer', component: <ShoppingCart /> },
        context: { title: 'useContext', component: (
            <div>
                <ThemedComponent />
                <LoginComponent />
                <NotificationList />
            </div>
        )},
        memo: { title: 'useMemo/useCallback', component: (
            <div>
                <ExpensiveCalculationComponent />
                <OptimizedParentComponent />
            </div>
        )},
        ref: { title: 'useRef', component: <UseRefExamples /> },
        custom: { title: 'Hooks Customizados', component: <CustomHooksDemo /> }
    };
    
    return (
        <ThemeProvider>
            <UserProvider>
                <NotificationProvider>
                    <div className="advanced-hooks-app">
                        <header className="app-header">
                            <h1>🚀 Hooks Avançados do React</h1>
                            <p>Domine os hooks avançados para aplicações profissionais</p>
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
                            <p>🎓 Curso de Desenvolvimento Web Moderno - Módulo 2: React Hooks Avançados</p>
                        </footer>
                    </div>
                </NotificationProvider>
            </UserProvider>
        </ThemeProvider>
    );
}

// =============================================================================
// 7. ESTILOS CSS PARA HOOKS AVANÇADOS
// =============================================================================

const advancedStyles = `
/* Estilos para hooks avançados */
.advanced-hooks-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Shopping Cart */
.shopping-cart {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.available-products .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 15px 0;
}

.product-card {
    border: 1px solid #eee;
    padding: 15px;
    border-radius: 8px;
    text-align: center;
}

.cart-list {
    margin: 15px 0;
}

.cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 5px 0;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 10px;
}

.quantity-controls button {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: #f8f9fa;
    cursor: pointer;
}

.cart-controls {
    display: flex;
    gap: 20px;
    align-items: center;
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.cart-summary {
    border-top: 1px solid #ddd;
    padding-top: 15px;
}

.summary-line {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
}

.summary-line.total {
    font-weight: bold;
    font-size: 1.2em;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
}

/* Context Components */
.themed-component {
    margin: 15px 0;
}

.login-form {
    max-width: 300px;
    margin: 15px 0;
}

.login-form input {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.user-profile {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin: 15px 0;
}

.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 300px;
    z-index: 1000;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.notification {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    margin: 5px 0;
    border-radius: 4px;
    color: white;
}

.notification-info {
    background: #17a2b8;
}

.notification-success {
    background: #28a745;
}

.notification-error {
    background: #dc3545;
}

/* Optimization Components */
.expensive-calculation {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.controls {
    display: flex;
    gap: 20px;
    margin: 15px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.results {
    margin: 20px 0;
}

.result-item {
    margin: 15px 0;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.number-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 10px 0;
}

.number-item {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: #f8f9fa;
}

.filtered-number {
    padding: 5px 10px;
    background: #e3f2fd;
    border-radius: 4px;
}

.performance-tip {
    margin: 20px 0;
    padding: 15px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 4px;
}

.optimized-child {
    border: 1px solid #28a745;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    background: #f8fff9;
}

.optimization-info {
    margin: 15px 0;
    padding: 15px;
    background: #e3f2fd;
    border-radius: 4px;
}

/* useRef Examples */
.useref-examples {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.ref-section {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.video-controls {
    margin: 10px 0;
}

.video-controls button {
    margin: 0 5px;
}

.counter-controls {
    margin: 10px 0;
}

.timer-controls {
    margin: 10px 0;
}

/* Custom Hooks */
.custom-hooks-demo {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.hook-section {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.toggle-controls {
    margin: 10px 0;
}

.toggle-controls button {
    margin: 0 5px;
}

.toggle-content {
    margin: 15px 0;
    padding: 15px;
    background: #e8f5e8;
    border: 1px solid #c3e6c3;
    border-radius: 4px;
}

/* Responsividade */
@media (max-width: 768px) {
    .controls {
        flex-direction: column;
    }
    
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .cart-controls {
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
// 8. EXPORTAÇÃO E INICIALIZAÇÃO
// =============================================================================

/**
 * 🚀 INICIALIZAÇÃO DOS HOOKS AVANÇADOS
 */
function initializeAdvancedHooks() {
    console.log('\n🚀 INICIANDO: HOOKS AVANÇADOS DO REACT\n');
    
    const moduleInfo = {
        title: 'Hooks Avançados do React',
        topics: [
            'useReducer para estado complexo',
            'useContext para compartilhamento de dados',
            'useMemo para otimização de cálculos',
            'useCallback para otimização de funções',
            'useRef para referências diretas',
            'Hooks customizados reutilizáveis',
            'Padrões avançados de composição',
            'Otimização de performance'
        ],
        practicalExamples: [
            'Carrinho de compras com useReducer',
            'Sistema de temas com useContext',
            'Otimização com useMemo e useCallback',
            'Controle de DOM com useRef',
            'Hooks customizados para fetch, localStorage, etc.'
        ],
        bestPractices: [
            'Use useReducer para estado complexo com múltiplas ações',
            'Context é ideal para dados globais, mas evite overuse',
            'useMemo e useCallback só quando necessário',
            'useRef para valores que não causam re-render',
            'Hooks customizados para lógica reutilizável',
            'Sempre faça cleanup de efeitos colaterais'
        ]
    };
    
    console.log('📚 Informações do Módulo:', moduleInfo);
    
    const performanceTips = [
        '⚡ useMemo: Memorize cálculos pesados',
        '🔄 useCallback: Memorize funções para evitar re-renders',
        '🎯 React.memo: Memorize componentes que recebem props estáveis',
        '📊 useReducer: Melhor que useState para estado complexo',
        '🌐 Context: Evite re-renders desnecessários dividindo contextos',
        '🎯 useRef: Para valores que não afetam a renderização',
        '🔧 Hooks customizados: Reutilize lógica entre componentes'
    ];
    
    console.log('\n💡 Dicas de Performance:');
    performanceTips.forEach(tip => console.log(tip));
    
    console.log('\n✅ HOOKS AVANÇADOS CARREGADOS COM SUCESSO!');
    console.log('🎓 Próximo passo: Pratique criando seus próprios hooks!');
    
    return {
        moduleInfo,
        performanceTips,
        components: {
            AdvancedHooksApp,
            ShoppingCart,
            ThemeProvider,
            UserProvider,
            NotificationProvider,
            ExpensiveCalculationComponent,
            OptimizedParentComponent,
            UseRefExamples,
            CustomHooksDemo
        },
        hooks: {
            useFetch,
            useLocalStorage,
            useDebounce,
            useMousePosition,
            useMediaQuery,
            useToggle
        },
        styles: advancedStyles
    };
}

// Executar inicialização
const advancedHooks = initializeAdvancedHooks();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = advancedHooks;
}

// Para uso no navegador
if (typeof window !== 'undefined') {
    window.AdvancedHooks = advancedHooks;
}

/**
 * 📋 RESUMO DO ARQUIVO
 * 
 * Este arquivo aborda hooks avançados essenciais do React:
 * 
 * 1. **useReducer**: Gerenciamento de estado complexo
 * 2. **useContext**: Compartilhamento de dados entre componentes
 * 3. **useMemo**: Otimização de cálculos pesados
 * 4. **useCallback**: Otimização de funções
 * 5. **useRef**: Referências diretas ao DOM e valores persistentes
 * 6. **Hooks Customizados**: Reutilização de lógica
 * 
 * 🎯 **CONCEITOS PRINCIPAIS:**
 * - Estado complexo com múltiplas ações
 * - Context API para dados globais
 * - Memoização para performance
 * - Referências diretas sem re-render
 * - Composição de hooks reutilizáveis
 * 
 * 💡 **QUANDO USAR CADA HOOK:**
 * - useReducer: Estado com lógica complexa
 * - useContext: Dados compartilhados globalmente
 * - useMemo: Cálculos pesados que dependem de valores específicos
 * - useCallback: Funções passadas como props para componentes memorizados
 * - useRef: Acesso direto ao DOM ou valores que não causam re-render
 * - Hooks customizados: Lógica reutilizável entre componentes
 */

// =============================================================================
// 9. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS PRÁTICOS - HOOKS AVANÇADOS
 * 
 * Pratique os conceitos aprendidos com estes exercícios:
 */

const exerciciosHooksAvancados = {
    basicos: [
        {
            titulo: "Contador com useReducer",
            descricao: "Crie um contador que suporte incrementar, decrementar, resetar e definir valor específico usando useReducer",
            dificuldade: "Básico",
            tempo: "15 minutos",
            conceitos: ["useReducer", "actions", "reducer function"]
        },
        {
            titulo: "Context de Configurações",
            descricao: "Implemente um context para configurações da aplicação (idioma, tema, timezone)",
            dificuldade: "Básico",
            tempo: "20 minutos",
            conceitos: ["useContext", "Provider", "Consumer"]
        },
        {
            titulo: "Input com useRef",
            descricao: "Crie um formulário que foca automaticamente no primeiro campo com erro usando useRef",
            dificuldade: "Básico",
            tempo: "15 minutos",
            conceitos: ["useRef", "DOM manipulation", "focus"]
        }
    ],
    
    intermediarios: [
        {
            titulo: "Lista Otimizada",
            descricao: "Implemente uma lista de 1000 itens com busca otimizada usando useMemo e useCallback",
            dificuldade: "Intermediário",
            tempo: "30 minutos",
            conceitos: ["useMemo", "useCallback", "React.memo", "performance"]
        },
        {
            titulo: "Hook de API",
            descricao: "Crie um hook customizado para requisições HTTP com cache, loading e retry",
            dificuldade: "Intermediário",
            tempo: "45 minutos",
            conceitos: ["custom hooks", "useEffect", "useState", "error handling"]
        },
        {
            titulo: "Carrinho Avançado",
            descricao: "Expanda o carrinho com persistência, cupons de desconto e cálculo de frete",
            dificuldade: "Intermediário",
            tempo: "60 minutos",
            conceitos: ["useReducer", "useContext", "localStorage", "complex state"]
        }
    ],
    
    avancados: [
        {
            titulo: "Sistema de Notificações",
            descricao: "Implemente um sistema completo de notificações com diferentes tipos, posições e animações",
            dificuldade: "Avançado",
            tempo: "90 minutos",
            conceitos: ["useContext", "useReducer", "animations", "portal"]
        },
        {
            titulo: "Editor de Texto",
            descricao: "Crie um editor de texto com undo/redo, formatação e auto-save usando múltiplos hooks",
            dificuldade: "Avançado",
            tempo: "120 minutos",
            conceitos: ["useReducer", "useRef", "useMemo", "custom hooks", "complex state"]
        },
        {
            titulo: "Dashboard Interativo",
            descricao: "Desenvolva um dashboard com gráficos, filtros e dados em tempo real",
            dificuldade: "Avançado",
            tempo: "150 minutos",
            conceitos: ["multiple contexts", "performance optimization", "real-time data", "complex interactions"]
        }
    ]
};

/**
 * 📚 RECURSOS ADICIONAIS
 */
const recursosAdicionais = {
    documentacao: [
        "React Hooks API Reference: https://react.dev/reference/react",
        "React Performance: https://react.dev/learn/render-and-commit",
        "Context Best Practices: https://react.dev/learn/passing-data-deeply-with-context"
    ],
    
    ferramentas: [
        "React DevTools: Profiler para análise de performance",
        "Why Did You Render: Debug de re-renders desnecessários",
        "React Hook Form: Formulários otimizados",
        "SWR/React Query: Gerenciamento de estado servidor"
    ],
    
    padroes: [
        "Compound Components: Componentes compostos",
        "Render Props: Compartilhamento de lógica",
        "Higher-Order Components: Componentes de ordem superior",
        "Custom Hooks: Lógica reutilizável"
    ]
};

console.log('\n📚 Exercícios Práticos:', exerciciosHooksAvancados);
console.log('\n🔗 Recursos Adicionais:', recursosAdicionais);

/**
 * 🎓 RESUMO DO MÓDULO
 * 
 * Neste módulo você aprendeu:
 * 
 * ✅ **useReducer**: Gerenciar estado complexo com ações bem definidas
 * ✅ **useContext**: Compartilhar dados globalmente sem prop drilling
 * ✅ **useMemo**: Otimizar cálculos pesados com memoização
 * ✅ **useCallback**: Otimizar funções para evitar re-renders
 * ✅ **useRef**: Acessar DOM diretamente e manter valores persistentes
 * ✅ **Hooks Customizados**: Criar lógica reutilizável entre componentes
 * ✅ **Padrões de Otimização**: React.memo, memoização e performance
 * 
 * 🚀 **PRÓXIMOS PASSOS:**
 * 1. Pratique os exercícios propostos
 * 2. Implemente hooks customizados em seus projetos
 * 3. Analise performance com React DevTools
 * 4. Estude padrões avançados de composição
 * 5. Explore bibliotecas como React Query e Zustand
 * 
 * 💡 **DICAS IMPORTANTES:**
 * - Use hooks avançados apenas quando necessário
 * - Prefira simplicidade sobre otimização prematura
 * - Meça performance antes de otimizar
 * - Mantenha hooks customizados focados e reutilizáveis
 * - Sempre faça cleanup de efeitos colaterais
 */