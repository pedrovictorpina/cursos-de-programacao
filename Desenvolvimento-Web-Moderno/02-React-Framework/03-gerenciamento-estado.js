/**
 * 🎯 MÓDULO 2: REACT FRAMEWORK
 * 📚 Aula 3: Gerenciamento de Estado
 * 
 * Este arquivo aborda gerenciamento de estado em React:
 * - Context API vs Redux
 * - Redux Toolkit (RTK)
 * - Zustand como alternativa moderna
 * - Padrões de estado global
 * - Performance e otimização
 * - Estado local vs global
 * - Middleware e DevTools
 * 
 * 🎓 OBJETIVOS DE APRENDIZAGEM:
 * ✅ Dominar Context API para estado global
 * ✅ Implementar Redux com Redux Toolkit
 * ✅ Conhecer alternativas modernas (Zustand)
 * ✅ Aplicar padrões de gerenciamento de estado
 * ✅ Otimizar performance em aplicações grandes
 * ✅ Decidir entre estado local e global
 * ✅ Usar DevTools para debugging
 */

// =============================================================================
// 1. CONTEXT API - ESTADO GLOBAL NATIVO
// =============================================================================

import React, { createContext, useContext, useReducer, useState, useEffect, useMemo, useCallback } from 'react';

/**
 * 🌐 CONTEXT API
 * 
 * Context API é a solução nativa do React para estado global
 * Ideal para dados que precisam ser acessados por muitos componentes
 */

// =============================================================================
// 1.1 CONTEXT SIMPLES COM USESTATE
// =============================================================================

/**
 * 👤 USER CONTEXT - Gerenciamento de usuário
 */
const UserContext = createContext();

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Simular login
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        
        try {
            // Simular API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (credentials.email === 'admin@test.com' && credentials.password === '123456') {
                const userData = {
                    id: 1,
                    name: 'Admin User',
                    email: credentials.email,
                    role: 'admin',
                    avatar: 'https://via.placeholder.com/100',
                    preferences: {
                        theme: 'light',
                        language: 'pt-BR',
                        notifications: true
                    }
                };
                
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            } else {
                throw new Error('Credenciais inválidas');
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };
    
    // Logout
    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('user');
    };
    
    // Atualizar perfil
    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };
    
    // Verificar usuário salvo
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Erro ao carregar usuário salvo:', error);
                localStorage.removeItem('user');
            }
        }
    }, []);
    
    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Hook customizado para usar o contexto
function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser deve ser usado dentro de UserProvider');
    }
    return context;
}

// =============================================================================
// 1.2 CONTEXT COMPLEXO COM USEREDUCER
// =============================================================================

/**
 * 🛒 SHOPPING CONTEXT - Carrinho de compras complexo
 */

// Actions do carrinho
const CART_ACTIONS = {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    CLEAR_CART: 'CLEAR_CART',
    APPLY_COUPON: 'APPLY_COUPON',
    REMOVE_COUPON: 'REMOVE_COUPON',
    SET_SHIPPING: 'SET_SHIPPING',
    SET_PAYMENT_METHOD: 'SET_PAYMENT_METHOD',
    CALCULATE_TOTALS: 'CALCULATE_TOTALS'
};

// Estado inicial do carrinho
const initialCartState = {
    items: [],
    coupon: null,
    shipping: {
        method: 'standard',
        cost: 0,
        estimatedDays: 5
    },
    paymentMethod: null,
    totals: {
        subtotal: 0,
        discount: 0,
        shipping: 0,
        tax: 0,
        total: 0
    }
};

// Cupons disponíveis
const availableCoupons = {
    'SAVE10': { discount: 10, type: 'percentage', minValue: 50 },
    'SAVE20': { discount: 20, type: 'percentage', minValue: 100 },
    'FRETE': { discount: 15, type: 'fixed', minValue: 30 }
};

// Métodos de envio
const shippingMethods = {
    standard: { cost: 15, days: 5, name: 'Padrão' },
    express: { cost: 25, days: 2, name: 'Expresso' },
    overnight: { cost: 40, days: 1, name: 'Overnight' }
};

// Reducer do carrinho
function cartReducer(state, action) {
    switch (action.type) {
        case CART_ACTIONS.ADD_ITEM: {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            
            let newItems;
            if (existingItem) {
                newItems = state.items.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newItems = [...state.items, { ...product, quantity }];
            }
            
            return calculateTotals({ ...state, items: newItems });
        }
        
        case CART_ACTIONS.REMOVE_ITEM: {
            const { productId } = action.payload;
            const newItems = state.items.filter(item => item.id !== productId);
            return calculateTotals({ ...state, items: newItems });
        }
        
        case CART_ACTIONS.UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            
            if (quantity <= 0) {
                const newItems = state.items.filter(item => item.id !== productId);
                return calculateTotals({ ...state, items: newItems });
            }
            
            const newItems = state.items.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            );
            
            return calculateTotals({ ...state, items: newItems });
        }
        
        case CART_ACTIONS.CLEAR_CART: {
            return calculateTotals({ ...state, items: [] });
        }
        
        case CART_ACTIONS.APPLY_COUPON: {
            const { couponCode } = action.payload;
            const coupon = availableCoupons[couponCode];
            
            if (!coupon) {
                return state; // Cupom inválido
            }
            
            const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (subtotal < coupon.minValue) {
                return state; // Valor mínimo não atingido
            }
            
            return calculateTotals({ ...state, coupon: { code: couponCode, ...coupon } });
        }
        
        case CART_ACTIONS.REMOVE_COUPON: {
            return calculateTotals({ ...state, coupon: null });
        }
        
        case CART_ACTIONS.SET_SHIPPING: {
            const { method } = action.payload;
            const shippingInfo = shippingMethods[method];
            
            if (!shippingInfo) {
                return state;
            }
            
            const newShipping = {
                method,
                cost: shippingInfo.cost,
                estimatedDays: shippingInfo.days
            };
            
            return calculateTotals({ ...state, shipping: newShipping });
        }
        
        case CART_ACTIONS.SET_PAYMENT_METHOD: {
            const { paymentMethod } = action.payload;
            return { ...state, paymentMethod };
        }
        
        case CART_ACTIONS.CALCULATE_TOTALS: {
            return calculateTotals(state);
        }
        
        default:
            return state;
    }
}

// Função para calcular totais
function calculateTotals(state) {
    const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let discount = 0;
    if (state.coupon) {
        if (state.coupon.type === 'percentage') {
            discount = (subtotal * state.coupon.discount) / 100;
        } else {
            discount = state.coupon.discount;
        }
    }
    
    const shipping = state.shipping.cost;
    const tax = (subtotal - discount) * 0.1; // 10% de imposto
    const total = subtotal - discount + shipping + tax;
    
    return {
        ...state,
        totals: {
            subtotal: Math.max(0, subtotal),
            discount: Math.max(0, discount),
            shipping: Math.max(0, shipping),
            tax: Math.max(0, tax),
            total: Math.max(0, total)
        }
    };
}

// Context do carrinho
const CartContext = createContext();

function CartProvider({ children }) {
    const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
    
    // Action creators
    const addItem = useCallback((product, quantity = 1) => {
        dispatch({
            type: CART_ACTIONS.ADD_ITEM,
            payload: { product, quantity }
        });
    }, []);
    
    const removeItem = useCallback((productId) => {
        dispatch({
            type: CART_ACTIONS.REMOVE_ITEM,
            payload: { productId }
        });
    }, []);
    
    const updateQuantity = useCallback((productId, quantity) => {
        dispatch({
            type: CART_ACTIONS.UPDATE_QUANTITY,
            payload: { productId, quantity }
        });
    }, []);
    
    const clearCart = useCallback(() => {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
    }, []);
    
    const applyCoupon = useCallback((couponCode) => {
        dispatch({
            type: CART_ACTIONS.APPLY_COUPON,
            payload: { couponCode }
        });
    }, []);
    
    const removeCoupon = useCallback(() => {
        dispatch({ type: CART_ACTIONS.REMOVE_COUPON });
    }, []);
    
    const setShipping = useCallback((method) => {
        dispatch({
            type: CART_ACTIONS.SET_SHIPPING,
            payload: { method }
        });
    }, []);
    
    const setPaymentMethod = useCallback((paymentMethod) => {
        dispatch({
            type: CART_ACTIONS.SET_PAYMENT_METHOD,
            payload: { paymentMethod }
        });
    }, []);
    
    // Valores computados
    const itemCount = useMemo(() => {
        return cartState.items.reduce((count, item) => count + item.quantity, 0);
    }, [cartState.items]);
    
    const isEmpty = useMemo(() => {
        return cartState.items.length === 0;
    }, [cartState.items]);
    
    // Persistir carrinho no localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartState));
    }, [cartState]);
    
    // Carregar carrinho do localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                // Recalcular totais para garantir consistência
                dispatch({ type: CART_ACTIONS.CALCULATE_TOTALS });
            } catch (error) {
                console.error('Erro ao carregar carrinho salvo:', error);
            }
        }
    }, []);
    
    const value = {
        ...cartState,
        itemCount,
        isEmpty,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        setShipping,
        setPaymentMethod,
        availableCoupons,
        shippingMethods
    };
    
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// Hook customizado para usar o carrinho
function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart deve ser usado dentro de CartProvider');
    }
    return context;
}

// =============================================================================
// 2. REDUX TOOLKIT - ESTADO GLOBAL PROFISSIONAL
// =============================================================================

/**
 * 🔧 REDUX TOOLKIT (RTK)
 * 
 * Redux Toolkit é a forma moderna e recomendada de usar Redux
 * Simplifica a configuração e reduz boilerplate
 */

// Simulação do Redux Toolkit (em um projeto real, você instalaria @reduxjs/toolkit)
const RTK_SIMULATION = {
    // Simular createSlice
    createSlice: ({ name, initialState, reducers }) => {
        const actionTypes = {};
        const actionCreators = {};
        
        Object.keys(reducers).forEach(key => {
            const actionType = `${name}/${key}`;
            actionTypes[key] = actionType;
            actionCreators[key] = (payload) => ({ type: actionType, payload });
        });
        
        const reducer = (state = initialState, action) => {
            const reducerFunction = reducers[action.type.split('/')[1]];
            if (reducerFunction) {
                return reducerFunction(state, action);
            }
            return state;
        };
        
        return {
            name,
            reducer,
            actions: actionCreators
        };
    },
    
    // Simular configureStore
    configureStore: ({ reducer }) => {
        let state = {};
        const listeners = [];
        
        // Inicializar estado
        Object.keys(reducer).forEach(key => {
            state[key] = reducer[key](undefined, { type: '@@INIT' });
        });
        
        return {
            getState: () => state,
            dispatch: (action) => {
                const newState = {};
                Object.keys(reducer).forEach(key => {
                    newState[key] = reducer[key](state[key], action);
                });
                state = newState;
                listeners.forEach(listener => listener());
                return action;
            },
            subscribe: (listener) => {
                listeners.push(listener);
                return () => {
                    const index = listeners.indexOf(listener);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                };
            }
        };
    }
};

// =============================================================================
// 2.1 SLICE DE USUÁRIO COM RTK
// =============================================================================

/**
 * 👤 USER SLICE - Gerenciamento de usuário com Redux Toolkit
 */
const userSlice = RTK_SIMULATION.createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        loading: false,
        error: null,
        preferences: {
            theme: 'light',
            language: 'pt-BR',
            notifications: true
        }
    },
    reducers: {
        loginStart: (state) => {
            return { ...state, loading: true, error: null };
        },
        loginSuccess: (state, action) => {
            return {
                ...state,
                loading: false,
                currentUser: action.payload,
                error: null
            };
        },
        loginFailure: (state, action) => {
            return {
                ...state,
                loading: false,
                error: action.payload,
                currentUser: null
            };
        },
        logout: (state) => {
            return {
                ...state,
                currentUser: null,
                error: null
            };
        },
        updateProfile: (state, action) => {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.payload
                }
            };
        },
        updatePreferences: (state, action) => {
            return {
                ...state,
                preferences: {
                    ...state.preferences,
                    ...action.payload
                }
            };
        }
    }
});

// =============================================================================
// 2.2 SLICE DE PRODUTOS COM RTK
// =============================================================================

/**
 * 📦 PRODUCTS SLICE - Gerenciamento de produtos
 */
const productsSlice = RTK_SIMULATION.createSlice({
    name: 'products',
    initialState: {
        items: [],
        categories: [],
        loading: false,
        error: null,
        filters: {
            category: 'all',
            priceRange: [0, 1000],
            sortBy: 'name',
            searchTerm: ''
        },
        pagination: {
            page: 1,
            limit: 12,
            total: 0
        }
    },
    reducers: {
        fetchProductsStart: (state) => {
            return { ...state, loading: true, error: null };
        },
        fetchProductsSuccess: (state, action) => {
            const { products, total } = action.payload;
            return {
                ...state,
                loading: false,
                items: products,
                pagination: {
                    ...state.pagination,
                    total
                }
            };
        },
        fetchProductsFailure: (state, action) => {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        },
        setFilters: (state, action) => {
            return {
                ...state,
                filters: {
                    ...state.filters,
                    ...action.payload
                },
                pagination: {
                    ...state.pagination,
                    page: 1 // Reset para primeira página
                }
            };
        },
        setPage: (state, action) => {
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    page: action.payload
                }
            };
        },
        addProduct: (state, action) => {
            return {
                ...state,
                items: [...state.items, action.payload]
            };
        },
        updateProduct: (state, action) => {
            const { id, updates } = action.payload;
            return {
                ...state,
                items: state.items.map(product =>
                    product.id === id
                        ? { ...product, ...updates }
                        : product
                )
            };
        },
        deleteProduct: (state, action) => {
            return {
                ...state,
                items: state.items.filter(product => product.id !== action.payload)
            };
        }
    }
});

// =============================================================================
// 2.3 CONFIGURAÇÃO DA STORE
// =============================================================================

/**
 * 🏪 REDUX STORE - Configuração central
 */
const store = RTK_SIMULATION.configureStore({
    reducer: {
        user: userSlice.reducer,
        products: productsSlice.reducer
    }
});

// Action creators
const { 
    loginStart, 
    loginSuccess, 
    loginFailure, 
    logout, 
    updateProfile, 
    updatePreferences 
} = userSlice.actions;

const {
    fetchProductsStart,
    fetchProductsSuccess,
    fetchProductsFailure,
    setFilters,
    setPage,
    addProduct,
    updateProduct,
    deleteProduct
} = productsSlice.actions;

// =============================================================================
// 2.4 THUNKS - AÇÕES ASSÍNCRONAS
// =============================================================================

/**
 * 🔄 ASYNC ACTIONS - Thunks para operações assíncronas
 */

// Simular thunk middleware
const createAsyncThunk = (name, asyncFunction) => {
    return (args) => async (dispatch, getState) => {
        try {
            const result = await asyncFunction(args);
            return result;
        } catch (error) {
            throw error;
        }
    };
};

// Login assíncrono
const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials) => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (credentials.email === 'admin@test.com' && credentials.password === '123456') {
            return {
                id: 1,
                name: 'Admin User',
                email: credentials.email,
                role: 'admin',
                avatar: 'https://via.placeholder.com/100'
            };
        } else {
            throw new Error('Credenciais inválidas');
        }
    }
);

// Buscar produtos
const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, limit = 12, filters = {} }) => {
        // Simular API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Dados simulados
        const allProducts = [
            { id: 1, name: 'Notebook Dell', price: 2500, category: 'electronics', image: 'https://via.placeholder.com/200' },
            { id: 2, name: 'Mouse Logitech', price: 50, category: 'electronics', image: 'https://via.placeholder.com/200' },
            { id: 3, name: 'Teclado Mecânico', price: 150, category: 'electronics', image: 'https://via.placeholder.com/200' },
            { id: 4, name: 'Monitor 24"', price: 800, category: 'electronics', image: 'https://via.placeholder.com/200' },
            { id: 5, name: 'Cadeira Gamer', price: 600, category: 'furniture', image: 'https://via.placeholder.com/200' },
            { id: 6, name: 'Mesa de Escritório', price: 400, category: 'furniture', image: 'https://via.placeholder.com/200' }
        ];
        
        // Aplicar filtros
        let filteredProducts = allProducts;
        
        if (filters.category && filters.category !== 'all') {
            filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        
        if (filters.searchTerm) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }
        
        if (filters.priceRange) {
            filteredProducts = filteredProducts.filter(p => 
                p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
            );
        }
        
        // Ordenação
        if (filters.sortBy) {
            filteredProducts.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'name':
                    default:
                        return a.name.localeCompare(b.name);
                }
            });
        }
        
        // Paginação
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        return {
            products: paginatedProducts,
            total: filteredProducts.length
        };
    }
);

// =============================================================================
// 3. ZUSTAND - ALTERNATIVA MODERNA
// =============================================================================

/**
 * 🐻 ZUSTAND
 * 
 * Zustand é uma alternativa moderna e leve ao Redux
 * Menos boilerplate, mais simples de usar
 */

// Simulação do Zustand (em um projeto real, você instalaria zustand)
const ZUSTAND_SIMULATION = {
    create: (stateCreator) => {
        let state = stateCreator((partial) => {
            if (typeof partial === 'function') {
                state = { ...state, ...partial(state) };
            } else {
                state = { ...state, ...partial };
            }
            listeners.forEach(listener => listener(state));
        });
        
        const listeners = [];
        
        const useStore = (selector) => {
            const [selectedState, setSelectedState] = useState(
                selector ? selector(state) : state
            );
            
            useEffect(() => {
                const listener = (newState) => {
                    const newSelectedState = selector ? selector(newState) : newState;
                    setSelectedState(newSelectedState);
                };
                
                listeners.push(listener);
                
                return () => {
                    const index = listeners.indexOf(listener);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                };
            }, [selector]);
            
            return selectedState;
        };
        
        useStore.getState = () => state;
        useStore.setState = (partial) => {
            if (typeof partial === 'function') {
                state = { ...state, ...partial(state) };
            } else {
                state = { ...state, ...partial };
            }
            listeners.forEach(listener => listener(state));
        };
        
        return useStore;
    }
};

// =============================================================================
// 3.1 STORE DE NOTIFICAÇÕES COM ZUSTAND
// =============================================================================

/**
 * 🔔 NOTIFICATION STORE - Gerenciamento de notificações
 */
const useNotificationStore = ZUSTAND_SIMULATION.create((set, get) => ({
    notifications: [],
    
    addNotification: (notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'info',
            duration: 5000,
            ...notification,
            timestamp: new Date()
        };
        
        set((state) => ({
            notifications: [...state.notifications, newNotification]
        }));
        
        // Auto-remover após duração especificada
        if (newNotification.duration > 0) {
            setTimeout(() => {
                get().removeNotification(id);
            }, newNotification.duration);
        }
        
        return id;
    },
    
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
        }));
    },
    
    clearNotifications: () => {
        set({ notifications: [] });
    },
    
    // Métodos de conveniência
    success: (message, options = {}) => {
        return get().addNotification({
            type: 'success',
            message,
            ...options
        });
    },
    
    error: (message, options = {}) => {
        return get().addNotification({
            type: 'error',
            message,
            duration: 0, // Não remove automaticamente
            ...options
        });
    },
    
    warning: (message, options = {}) => {
        return get().addNotification({
            type: 'warning',
            message,
            ...options
        });
    },
    
    info: (message, options = {}) => {
        return get().addNotification({
            type: 'info',
            message,
            ...options
        });
    }
}));

// =============================================================================
// 3.2 STORE DE CONFIGURAÇÕES COM ZUSTAND
// =============================================================================

/**
 * ⚙️ SETTINGS STORE - Configurações da aplicação
 */
const useSettingsStore = ZUSTAND_SIMULATION.create((set, get) => ({
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    notifications: {
        email: true,
        push: true,
        sms: false
    },
    privacy: {
        analytics: true,
        cookies: true,
        tracking: false
    },
    
    // Ações
    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    },
    
    setLanguage: (language) => {
        set({ language });
        localStorage.setItem('language', language);
    },
    
    setCurrency: (currency) => {
        set({ currency });
        localStorage.setItem('currency', currency);
    },
    
    updateNotifications: (notifications) => {
        set((state) => ({
            notifications: { ...state.notifications, ...notifications }
        }));
    },
    
    updatePrivacy: (privacy) => {
        set((state) => ({
            privacy: { ...state.privacy, ...privacy }
        }));
    },
    
    resetSettings: () => {
        const defaultSettings = {
            theme: 'light',
            language: 'pt-BR',
            currency: 'BRL',
            timezone: 'America/Sao_Paulo',
            notifications: {
                email: true,
                push: true,
                sms: false
            },
            privacy: {
                analytics: true,
                cookies: true,
                tracking: false
            }
        };
        
        set(defaultSettings);
        
        // Limpar localStorage
        ['theme', 'language', 'currency'].forEach(key => {
            localStorage.removeItem(key);
        });
    },
    
    // Carregar configurações salvas
    loadSettings: () => {
        const savedTheme = localStorage.getItem('theme');
        const savedLanguage = localStorage.getItem('language');
        const savedCurrency = localStorage.getItem('currency');
        
        const updates = {};
        
        if (savedTheme) updates.theme = savedTheme;
        if (savedLanguage) updates.language = savedLanguage;
        if (savedCurrency) updates.currency = savedCurrency;
        
        if (Object.keys(updates).length > 0) {
            set(updates);
        }
        
        // Aplicar tema
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
}));

// =============================================================================
// 4. COMPONENTES DE DEMONSTRAÇÃO
// =============================================================================

/**
 * 🎨 COMPONENTES PARA DEMONSTRAR GERENCIAMENTO DE ESTADO
 */

/**
 * 👤 LOGIN COMPONENT - Context API
 */
function LoginComponent() {
    const { user, loading, error, login, logout, isAuthenticated } = useUser();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(credentials);
    };
    
    if (isAuthenticated) {
        return (
            <div className="user-profile">
                <h3>Bem-vindo, {user.name}!</h3>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                <button onClick={logout}>Logout</button>
            </div>
        );
    }
    
    return (
        <div className="login-form">
            <h3>Login (Context API)</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="email"
                    placeholder="Email (admin@test.com)"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    disabled={loading}
                />
                <input 
                    type="password"
                    placeholder="Senha (123456)"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

/**
 * 🛒 CART COMPONENT - Context API com useReducer
 */
function CartComponent() {
    const {
        items,
        totals,
        itemCount,
        isEmpty,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        coupon,
        availableCoupons
    } = useCart();
    
    const [couponCode, setCouponCode] = useState('');
    
    // Produtos de exemplo
    const sampleProducts = [
        { id: 1, name: 'Notebook', price: 2500 },
        { id: 2, name: 'Mouse', price: 50 },
        { id: 3, name: 'Teclado', price: 150 }
    ];
    
    const handleApplyCoupon = () => {
        if (couponCode.trim()) {
            applyCoupon(couponCode.toUpperCase());
            setCouponCode('');
        }
    };
    
    return (
        <div className="cart-component">
            <h3>Carrinho ({itemCount} itens)</h3>
            
            {/* Produtos para adicionar */}
            <div className="sample-products">
                <h4>Produtos Disponíveis:</h4>
                {sampleProducts.map(product => (
                    <div key={product.id} className="product-item">
                        <span>{product.name} - R$ {product.price}</span>
                        <button onClick={() => addItem(product)}>Adicionar</button>
                    </div>
                ))}
            </div>
            
            {/* Itens do carrinho */}
            {isEmpty ? (
                <p>Carrinho vazio</p>
            ) : (
                <div className="cart-items">
                    {items.map(item => (
                        <div key={item.id} className="cart-item">
                            <span>{item.name}</span>
                            <div className="quantity-controls">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeItem(item.id)}>❌</button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Cupom */}
            <div className="coupon-section">
                <h4>Cupom de Desconto:</h4>
                {coupon ? (
                    <div className="applied-coupon">
                        <span>Cupom {coupon.code} aplicado!</span>
                        <button onClick={removeCoupon}>Remover</button>
                    </div>
                ) : (
                    <div className="coupon-input">
                        <input 
                            type="text"
                            placeholder="Código do cupom"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button onClick={handleApplyCoupon}>Aplicar</button>
                    </div>
                )}
                <p>Cupons disponíveis: {Object.keys(availableCoupons).join(', ')}</p>
            </div>
            
            {/* Totais */}
            <div className="cart-totals">
                <div className="total-line">
                    <span>Subtotal:</span>
                    <span>R$ {totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="total-line">
                    <span>Desconto:</span>
                    <span>-R$ {totals.discount.toFixed(2)}</span>
                </div>
                <div className="total-line">
                    <span>Frete:</span>
                    <span>R$ {totals.shipping.toFixed(2)}</span>
                </div>
                <div className="total-line">
                    <span>Impostos:</span>
                    <span>R$ {totals.tax.toFixed(2)}</span>
                </div>
                <div className="total-line total">
                    <span>Total:</span>
                    <span>R$ {totals.total.toFixed(2)}</span>
                </div>
            </div>
            
            {!isEmpty && (
                <button onClick={clearCart} className="clear-cart">
                    Limpar Carrinho
                </button>
            )}
        </div>
    );
}

/**
 * 🔔 NOTIFICATION COMPONENT - Zustand
 */
function NotificationComponent() {
    const { notifications, removeNotification, clearNotifications, success, error, warning, info } = useNotificationStore();
    
    const showSampleNotifications = () => {
        success('Operação realizada com sucesso!');
        setTimeout(() => error('Erro ao processar solicitação'), 1000);
        setTimeout(() => warning('Atenção: Verifique os dados'), 2000);
        setTimeout(() => info('Informação importante'), 3000);
    };
    
    return (
        <div className="notification-component">
            <h3>Notificações (Zustand)</h3>
            
            <div className="notification-controls">
                <button onClick={showSampleNotifications}>Mostrar Notificações</button>
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
            
            <p>Total de notificações: {notifications.length}</p>
        </div>
    );
}

/**
 * ⚙️ SETTINGS COMPONENT - Zustand
 */
function SettingsComponent() {
    const {
        theme,
        language,
        currency,
        notifications,
        privacy,
        setTheme,
        setLanguage,
        setCurrency,
        updateNotifications,
        updatePrivacy,
        resetSettings
    } = useSettingsStore();
    
    return (
        <div className="settings-component">
            <h3>Configurações (Zustand)</h3>
            
            <div className="setting-group">
                <label>Tema:</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="auto">Automático</option>
                </select>
            </div>
            
            <div className="setting-group">
                <label>Idioma:</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="pt-BR">Português</option>
                    <option value="en-US">English</option>
                    <option value="es-ES">Español</option>
                </select>
            </div>
            
            <div className="setting-group">
                <label>Moeda:</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="BRL">Real (BRL)</option>
                    <option value="USD">Dólar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                </select>
            </div>
            
            <div className="setting-group">
                <h4>Notificações:</h4>
                <label>
                    <input 
                        type="checkbox"
                        checked={notifications.email}
                        onChange={(e) => updateNotifications({ email: e.target.checked })}
                    />
                    Email
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={notifications.push}
                        onChange={(e) => updateNotifications({ push: e.target.checked })}
                    />
                    Push
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={(e) => updateNotifications({ sms: e.target.checked })}
                    />
                    SMS
                </label>
            </div>
            
            <div className="setting-group">
                <h4>Privacidade:</h4>
                <label>
                    <input 
                        type="checkbox"
                        checked={privacy.analytics}
                        onChange={(e) => updatePrivacy({ analytics: e.target.checked })}
                    />
                    Analytics
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={privacy.cookies}
                        onChange={(e) => updatePrivacy({ cookies: e.target.checked })}
                    />
                    Cookies
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={privacy.tracking}
                        onChange={(e) => updatePrivacy({ tracking: e.target.checked })}
                    />
                    Tracking
                </label>
            </div>
            
            <button onClick={resetSettings} className="reset-button">
                Resetar Configurações
            </button>
        </div>
    );
}

// =============================================================================
// 5. APLICAÇÃO PRINCIPAL
// =============================================================================

/**
 * 🎯 STATE MANAGEMENT APP - Demonstração completa
 */
function StateManagementApp() {
    const [currentTab, setCurrentTab] = useState('context');
    
    // Carregar configurações ao inicializar
    useEffect(() => {
        useSettingsStore.getState().loadSettings();
    }, []);
    
    const tabs = {
        context: { title: 'Context API', component: (
            <div>
                <LoginComponent />
                <CartComponent />
            </div>
        )},
        zustand: { title: 'Zustand', component: (
            <div>
                <NotificationComponent />
                <SettingsComponent />
            </div>
        )},
        comparison: { title: 'Comparação', component: <StateComparisonComponent /> }
    };
    
    return (
        <UserProvider>
            <CartProvider>
                <div className="state-management-app">
                    <header className="app-header">
                        <h1>🎯 Gerenciamento de Estado</h1>
                        <p>Context API, Redux Toolkit e Zustand</p>
                    </header>
                    
                    <nav className="app-nav">
                        {Object.entries(tabs).map(([key, tab]) => (
                            <button 
                                key={key}
                                className={currentTab === key ? 'active' : ''}
                                onClick={() => setCurrentTab(key)}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </nav>
                    
                    <main className="app-content">
                        {tabs[currentTab].component}
                    </main>
                </div>
            </CartProvider>
        </UserProvider>
    );
}

/**
 * 📊 COMPARISON COMPONENT - Comparação entre soluções
 */
function StateComparisonComponent() {
    const comparisonData = {
        'Context API': {
            pros: [
                'Nativo do React',
                'Sem dependências externas',
                'Ideal para estado simples',
                'Boa para temas e autenticação'
            ],
            cons: [
                'Pode causar re-renders desnecessários',
                'Não tem DevTools nativos',
                'Difícil de debugar em apps grandes',
                'Sem middleware built-in'
            ],
            useCases: [
                'Temas da aplicação',
                'Dados de autenticação',
                'Configurações simples',
                'Estado compartilhado pequeno'
            ]
        },
        'Redux Toolkit': {
            pros: [
                'Excelentes DevTools',
                'Previsível e debugável',
                'Middleware robusto',
                'Ideal para apps grandes'
            ],
            cons: [
                'Curva de aprendizado',
                'Mais boilerplate',
                'Pode ser overkill para apps simples',
                'Dependência externa'
            ],
            useCases: [
                'Aplicações grandes',
                'Estado complexo',
                'Time sharing',
                'Debugging avançado'
            ]
        },
        'Zustand': {
            pros: [
                'Muito simples de usar',
                'Bundle pequeno',
                'TypeScript friendly',
                'Sem providers'
            ],
            cons: [
                'DevTools limitados',
                'Menos maduro',
                'Comunidade menor',
                'Menos recursos avançados'
            ],
            useCases: [
                'Apps médias',
                'Prototipagem rápida',
                'Estado simples a médio',
                'Quando simplicidade é prioridade'
            ]
        }
    };
    
    return (
        <div className="state-comparison">
            <h3>📊 Comparação de Soluções</h3>
            
            <div className="comparison-grid">
                {Object.entries(comparisonData).map(([solution, data]) => (
                    <div key={solution} className="comparison-card">
                        <h4>{solution}</h4>
                        
                        <div className="pros-cons">
                            <div className="pros">
                                <h5>✅ Prós:</h5>
                                <ul>
                                    {data.pros.map((pro, index) => (
                                        <li key={index}>{pro}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="cons">
                                <h5>❌ Contras:</h5>
                                <ul>
                                    {data.cons.map((con, index) => (
                                        <li key={index}>{con}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="use-cases">
                            <h5>🎯 Casos de Uso:</h5>
                            <ul>
                                {data.useCases.map((useCase, index) => (
                                    <li key={index}>{useCase}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="decision-guide">
                <h4>🤔 Como Escolher?</h4>
                <div className="decision-tree">
                    <div className="decision-item">
                        <strong>Use Context API quando:</strong>
                        <p>Estado simples, poucos componentes, dados de tema/auth</p>
                    </div>
                    <div className="decision-item">
                        <strong>Use Redux Toolkit quando:</strong>
                        <p>App grande, estado complexo, time grande, debugging avançado</p>
                    </div>
                    <div className="decision-item">
                        <strong>Use Zustand quando:</strong>
                        <p>Quer simplicidade, app média, prototipagem, menos boilerplate</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// 6. ESTILOS CSS
// =============================================================================

const stateManagementStyles = `
/* Estilos para gerenciamento de estado */
.state-management-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.app-header {
    text-align: center;
    margin-bottom: 30px;
}

.app-nav {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    border-bottom: 1px solid #ddd;
}

.app-nav button {
    padding: 10px 20px;
    border: none;
    background: #f8f9fa;
    cursor: pointer;
    border-radius: 4px 4px 0 0;
}

.app-nav button.active {
    background: #007bff;
    color: white;
}

/* Login Component */
.login-form {
    max-width: 400px;
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.login-form input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.user-profile {
    padding: 20px;
    border: 1px solid #28a745;
    border-radius: 8px;
    background: #f8fff9;
    margin: 20px 0;
}

.error {
    color: #dc3545;
    margin-top: 10px;
}

/* Cart Component */
.cart-component {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.sample-products {
    margin: 20px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 4px;
}

.product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.cart-items {
    margin: 20px 0;
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

.coupon-section {
    margin: 20px 0;
    padding: 15px;
    background: #fff3cd;
    border-radius: 4px;
}

.coupon-input {
    display: flex;
    gap: 10px;
    margin: 10px 0;
}

.applied-coupon {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #d4edda;
    border-radius: 4px;
}

.cart-totals {
    border-top: 1px solid #ddd;
    padding-top: 15px;
    margin-top: 20px;
}

.total-line {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
}

.total-line.total {
    font-weight: bold;
    font-size: 1.2em;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 10px;
}

/* Notification Component */
.notification-component {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.notification-controls {
    display: flex;
    gap: 10px;
    margin: 15px 0;
}

.notification-list {
    margin: 20px 0;
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

.notification-success {
    background: #28a745;
}

.notification-error {
    background: #dc3545;
}

.notification-warning {
    background: #ffc107;
    color: #212529;
}

.notification-info {
    background: #17a2b8;
}

/* Settings Component */
.settings-component {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.setting-group {
    margin: 15px 0;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
}

.setting-group label {
    display: block;
    margin: 5px 0;
}

.setting-group select {
    width: 200px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.setting-group input[type="checkbox"] {
    margin-right: 8px;
}

.reset-button {
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
}

/* Comparison Component */
.state-comparison {
    padding: 20px;
}

.comparison-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.comparison-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background: #f8f9fa;
}

.comparison-card h4 {
    margin-top: 0;
    color: #007bff;
}

.pros-cons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin: 15px 0;
}

.pros, .cons, .use-cases {
    margin: 10px 0;
}

.pros h5 {
    color: #28a745;
    margin-bottom: 10px;
}

.cons h5 {
    color: #dc3545;
    margin-bottom: 10px;
}

.use-cases h5 {
    color: #6f42c1;
    margin-bottom: 10px;
}

.pros ul, .cons ul, .use-cases ul {
    list-style: none;
    padding: 0;
}

.pros li, .cons li, .use-cases li {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}

.decision-guide {
    margin-top: 30px;
    padding: 20px;
    background: #e9ecef;
    border-radius: 8px;
}

.decision-tree {
    display: grid;
    gap: 15px;
    margin-top: 15px;
}

.decision-item {
    padding: 15px;
    background: white;
    border-radius: 4px;
    border-left: 4px solid #007bff;
}

.decision-item strong {
    color: #007bff;
    display: block;
    margin-bottom: 5px;
}

/* Responsive */
@media (max-width: 768px) {
    .pros-cons {
        grid-template-columns: 1fr;
    }
    
    .comparison-grid {
        grid-template-columns: 1fr;
    }
    
    .cart-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .notification-controls {
        flex-direction: column;
    }
}

/* Temas */
[data-theme="dark"] {
    background: #1a1a1a;
    color: #ffffff;
}

[data-theme="dark"] .state-management-app {
    background: #1a1a1a;
    color: #ffffff;
}

[data-theme="dark"] .comparison-card,
[data-theme="dark"] .login-form,
[data-theme="dark"] .cart-component,
[data-theme="dark"] .notification-component,
[data-theme="dark"] .settings-component {
    background: #2d2d2d;
    border-color: #444;
    color: #ffffff;
}

[data-theme="dark"] input,
[data-theme="dark"] select {
    background: #3d3d3d;
    border-color: #555;
    color: #ffffff;
}

[data-theme="dark"] .app-nav button {
    background: #3d3d3d;
    color: #ffffff;
    border-color: #555;
}

[data-theme="dark"] .app-nav button.active {
    background: #007bff;
}
`;

// =============================================================================
// 7. INICIALIZAÇÃO E DEMONSTRAÇÃO
// =============================================================================

/**
 * 🚀 INICIALIZAÇÃO
 * 
 * Função principal para demonstrar todos os conceitos de gerenciamento de estado
 */
function initStateManagement() {
    console.log('🎯 Iniciando demonstração de Gerenciamento de Estado');
    
    // Criar container principal
    const container = document.createElement('div');
    container.id = 'state-management-root';
    document.body.appendChild(container);
    
    // Adicionar estilos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = stateManagementStyles;
    document.head.appendChild(styleSheet);
    
    // Renderizar aplicação (simulação)
    container.innerHTML = `
        <div class="state-management-app">
            <header class="app-header">
                <h1>🎯 Gerenciamento de Estado em React</h1>
                <p>Context API, Redux Toolkit e Zustand</p>
            </header>
            
            <div class="demo-info">
                <h2>📚 Conceitos Demonstrados:</h2>
                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>🌐 Context API</h3>
                        <p>Estado global nativo do React com useContext e useReducer</p>
                        <ul>
                            <li>UserContext para autenticação</li>
                            <li>CartContext com useReducer</li>
                            <li>Providers aninhados</li>
                            <li>Custom hooks</li>
                        </ul>
                    </div>
                    
                    <div class="concept-card">
                        <h3>🔧 Redux Toolkit</h3>
                        <p>Gerenciamento de estado profissional e escalável</p>
                        <ul>
                            <li>createSlice para reducers</li>
                            <li>configureStore</li>
                            <li>Async thunks</li>
                            <li>DevTools integration</li>
                        </ul>
                    </div>
                    
                    <div class="concept-card">
                        <h3>🐻 Zustand</h3>
                        <p>Alternativa moderna e simples</p>
                        <ul>
                            <li>Store sem providers</li>
                            <li>Subscriptions automáticas</li>
                            <li>Persist middleware</li>
                            <li>TypeScript friendly</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="implementation-examples">
                <h2>💻 Exemplos de Implementação:</h2>
                <div class="example-tabs">
                    <button class="tab-button active" data-tab="context">Context API</button>
                    <button class="tab-button" data-tab="redux">Redux Toolkit</button>
                    <button class="tab-button" data-tab="zustand">Zustand</button>
                </div>
                
                <div class="tab-content" id="context-tab">
                    <h3>Context API - Carrinho de Compras</h3>
                    <pre><code>// Exemplo de uso do CartContext
const { addItem, removeItem, items, totals } = useCart();

// Adicionar produto
addItem({ id: 1, name: 'Produto', price: 100 });

// Remover produto
removeItem(1);

// Acessar estado
console.log('Itens:', items);
console.log('Total:', totals.total);</code></pre>
                </div>
                
                <div class="tab-content" id="redux-tab" style="display: none;">
                    <h3>Redux Toolkit - Gerenciamento de Usuário</h3>
                    <pre><code>// Dispatch de ações
dispatch(loginStart());
dispatch(loginSuccess(userData));
dispatch(updateProfile({ name: 'Novo Nome' }));

// Seletores
const user = useSelector(state => state.user.currentUser);
const loading = useSelector(state => state.user.loading);</code></pre>
                </div>
                
                <div class="tab-content" id="zustand-tab" style="display: none;">
                    <h3>Zustand - Notificações</h3>
                    <pre><code>// Uso direto do store
const { notifications, success, error } = useNotificationStore();

// Adicionar notificações
success('Operação realizada!');
error('Erro ao processar');

// Estado reativo automático
console.log('Notificações:', notifications);</code></pre>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar interatividade aos tabs
    const tabButtons = container.querySelectorAll('.tab-button');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remover classe active de todos os botões
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Esconder todos os conteúdos
            tabContents.forEach(content => content.style.display = 'none');
            
            // Mostrar conteúdo selecionado
            const targetContent = container.querySelector(`#${tabId}-tab`);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
    
    console.log('✅ Demonstração de Gerenciamento de Estado carregada!');
}

// =============================================================================
// 8. CONCEITOS PRINCIPAIS
// =============================================================================

/**
 * 📖 CONCEITOS FUNDAMENTAIS DE GERENCIAMENTO DE ESTADO
 * 
 * Esta seção explica os conceitos essenciais que todo desenvolvedor React
 * deve dominar sobre gerenciamento de estado.
 */

const STATE_MANAGEMENT_CONCEPTS = {
    
    /**
     * 🎯 QUANDO USAR ESTADO LOCAL VS GLOBAL
     */
    stateDecision: {
        local: {
            description: 'Estado que pertence a um componente específico',
            examples: [
                'Valores de formulário',
                'Estado de loading de um botão',
                'Visibilidade de modal',
                'Posição de scroll'
            ],
            tools: ['useState', 'useReducer']
        },
        
        global: {
            description: 'Estado compartilhado entre múltiplos componentes',
            examples: [
                'Dados do usuário logado',
                'Carrinho de compras',
                'Tema da aplicação',
                'Configurações globais'
            ],
            tools: ['Context API', 'Redux', 'Zustand']
        }
    },
    
    /**
     * 🔄 FLUXO DE DADOS UNIDIRECIONAL
     */
    dataFlow: {
        principle: 'Os dados fluem sempre em uma direção: de pai para filho',
        benefits: [
            'Previsibilidade',
            'Facilita debugging',
            'Evita inconsistências',
            'Melhora performance'
        ],
        implementation: {
            'Context API': 'Provider -> Consumer',
            'Redux': 'Store -> Component -> Action -> Reducer -> Store',
            'Zustand': 'Store -> Component -> Action -> Store'
        }
    },
    
    /**
     * 🎭 IMUTABILIDADE
     */
    immutability: {
        definition: 'Nunca modificar o estado diretamente, sempre criar novo objeto',
        why: [
            'React detecta mudanças por referência',
            'Evita bugs difíceis de rastrear',
            'Permite otimizações',
            'Facilita debugging'
        ],
        examples: {
            wrong: 'state.items.push(newItem)', // ❌
            correct: 'setState([...state.items, newItem])' // ✅
        }
    },
    
    /**
     * 🚀 PERFORMANCE E OTIMIZAÇÃO
     */
    performance: {
        problems: [
            'Re-renders desnecessários',
            'Cálculos custosos repetidos',
            'Subscriptions não otimizadas',
            'Contextos muito amplos'
        ],
        solutions: {
            'React.memo': 'Evita re-renders de componentes',
            'useMemo': 'Memoriza cálculos custosos',
            'useCallback': 'Memoriza funções',
            'Seletores': 'Subscrevem apenas dados necessários'
        }
    }
};

// =============================================================================
// 9. EXERCÍCIOS PRÁTICOS
// =============================================================================

/**
 * 🎯 EXERCÍCIOS PROGRESSIVOS
 * 
 * Exercícios práticos para dominar gerenciamento de estado
 */

const STATE_EXERCISES = {
    
    /**
     * 🟢 EXERCÍCIOS BÁSICOS
     */
    basic: [
        {
            title: '1. Context API Simples',
            description: 'Criar um ThemeContext para alternar entre tema claro e escuro',
            requirements: [
                'Criar ThemeProvider com useState',
                'Implementar toggleTheme function',
                'Criar hook useTheme personalizado',
                'Aplicar tema em 3 componentes diferentes'
            ],
            hints: [
                'Use createContext e useContext',
                'Armazene tema no localStorage',
                'Aplique classes CSS condicionalmente'
            ]
        },
        
        {
            title: '2. Estado Local com useReducer',
            description: 'Criar um formulário complexo com validação usando useReducer',
            requirements: [
                'Campos: nome, email, senha, confirmação',
                'Validação em tempo real',
                'Estados: pristine, valid, submitting',
                'Ações: updateField, validate, submit, reset'
            ],
            hints: [
                'Defina actions claras',
                'Mantenha estado imutável',
                'Separe lógica de validação'
            ]
        },
        
        {
            title: '3. Zustand Store Básico',
            description: 'Criar store de contador com Zustand',
            requirements: [
                'Estado: count, step',
                'Ações: increment, decrement, reset, setStep',
                'Persistir no localStorage',
                'Usar em múltiplos componentes'
            ],
            hints: [
                'Use persist middleware',
                'Teste seletores específicos',
                'Implemente ações assíncronas'
            ]
        }
    ],
    
    /**
     * 🟡 EXERCÍCIOS INTERMEDIÁRIOS
     */
    intermediate: [
        {
            title: '4. Sistema de Autenticação Completo',
            description: 'Implementar autenticação com Context API + useReducer',
            requirements: [
                'Estados: user, loading, error, isAuthenticated',
                'Ações: login, logout, register, updateProfile',
                'Persistência com localStorage',
                'Interceptação de rotas protegidas',
                'Refresh token automático'
            ],
            hints: [
                'Use useEffect para verificar token',
                'Implemente timeout de sessão',
                'Crie HOC para rotas protegidas'
            ]
        },
        
        {
            title: '5. E-commerce com Redux Toolkit',
            description: 'Criar loja virtual completa com RTK',
            requirements: [
                'Slices: products, cart, user, orders',
                'Async thunks para API calls',
                'Middleware para logging',
                'Seletores otimizados',
                'DevTools configurados'
            ],
            hints: [
                'Use createAsyncThunk',
                'Implemente normalização de dados',
                'Configure middleware personalizado'
            ]
        },
        
        {
            title: '6. Dashboard em Tempo Real',
            description: 'Dashboard com WebSocket e Zustand',
            requirements: [
                'Conexão WebSocket',
                'Múltiplas stores (metrics, alerts, users)',
                'Atualizações em tempo real',
                'Filtros e ordenação',
                'Histórico de dados'
            ],
            hints: [
                'Use subscriptions do Zustand',
                'Implemente reconnection automática',
                'Otimize updates frequentes'
            ]
        }
    ],
    
    /**
     * 🔴 EXERCÍCIOS AVANÇADOS
     */
    advanced: [
        {
            title: '7. Micro-frontends com Estado Compartilhado',
            description: 'Compartilhar estado entre micro-frontends',
            requirements: [
                'Múltiplas aplicações React',
                'Estado compartilhado via eventos',
                'Sincronização automática',
                'Fallback para offline',
                'Versionamento de estado'
            ],
            hints: [
                'Use CustomEvents para comunicação',
                'Implemente schema validation',
                'Configure error boundaries'
            ]
        },
        
        {
            title: '8. Sistema de Cache Inteligente',
            description: 'Cache avançado com invalidação automática',
            requirements: [
                'Cache com TTL',
                'Invalidação por tags',
                'Background refresh',
                'Optimistic updates',
                'Offline support'
            ],
            hints: [
                'Use Map para cache indexado',
                'Implemente LRU eviction',
                'Configure service worker'
            ]
        }
    ],
    
    /**
     * 🎯 EXERCÍCIOS COMPARATIVOS
     */
    comparative: [
        {
            title: '9. Mesmo App, Três Soluções',
            description: 'Implementar TODO app com Context, Redux e Zustand',
            requirements: [
                'Funcionalidades idênticas',
                'Métricas de performance',
                'Análise de bundle size',
                'Comparação de DX (Developer Experience)',
                'Documentação das diferenças'
            ]
        },
        
        {
            title: '10. Migration Challenge',
            description: 'Migrar app de Context API para Redux Toolkit',
            requirements: [
                'Manter funcionalidades',
                'Migração incremental',
                'Testes de regressão',
                'Performance comparison',
                'Documentar lições aprendidas'
            ]
        }
    ]
};

// =============================================================================
// 10. RECURSOS ADICIONAIS
// =============================================================================

/**
 * 📚 RECURSOS PARA APROFUNDAMENTO
 */
const ADDITIONAL_RESOURCES = {
    
    /**
     * 📖 DOCUMENTAÇÃO OFICIAL
     */
    documentation: {
        'React Context': 'https://react.dev/reference/react/createContext',
        'Redux Toolkit': 'https://redux-toolkit.js.org/',
        'Zustand': 'https://github.com/pmndrs/zustand',
        'React DevTools': 'https://react.dev/learn/react-developer-tools'
    },
    
    /**
     * 🛠️ FERRAMENTAS ÚTEIS
     */
    tools: {
        'Redux DevTools': 'Browser extension para debugging Redux',
        'React DevTools': 'Inspeção de componentes e hooks',
        'Why Did You Render': 'Detecta re-renders desnecessários',
        'React Query DevTools': 'Para gerenciamento de estado servidor'
    },
    
    /**
     * 📦 BIBLIOTECAS COMPLEMENTARES
     */
    libraries: {
        'Immer': 'Mutações imutáveis simplificadas',
        'Reselect': 'Seletores memoizados para Redux',
        'React Query': 'Estado de servidor e cache',
        'SWR': 'Data fetching com cache'
    },
    
    /**
     * 🎯 PADRÕES RECOMENDADOS
     */
    patterns: {
        'Container/Presentational': 'Separar lógica de apresentação',
        'Custom Hooks': 'Reutilizar lógica de estado',
        'Compound Components': 'Componentes que trabalham juntos',
        'Render Props': 'Compartilhar lógica via props'
    }
};

// =============================================================================
// 11. RESUMO DO MÓDULO
// =============================================================================

/**
 * 🎓 RESUMO: GERENCIAMENTO DE ESTADO EM REACT
 * 
 * Este módulo cobriu os aspectos fundamentais e avançados do gerenciamento
 * de estado em aplicações React modernas.
 */

const MODULE_SUMMARY = {
    
    /**
     * 🎯 PRINCIPAIS APRENDIZADOS
     */
    keyLearnings: [
        '🌐 Context API para estado global simples',
        '🔧 Redux Toolkit para aplicações complexas',
        '🐻 Zustand como alternativa moderna e simples',
        '🎭 Importância da imutabilidade',
        '🚀 Técnicas de otimização de performance',
        '🔄 Padrões de fluxo de dados unidirecional',
        '🛠️ Debugging e DevTools',
        '📊 Critérios para escolha da solução'
    ],
    
    /**
     * 🛠️ HABILIDADES ADQUIRIDAS
     */
    skills: [
        'Implementar Context API com useContext e useReducer',
        'Configurar Redux Toolkit com slices e thunks',
        'Criar stores Zustand com middleware',
        'Otimizar performance com memoização',
        'Debugar estado com DevTools',
        'Escolher a solução adequada para cada caso',
        'Implementar padrões de estado avançados',
        'Migrar entre diferentes soluções de estado'
    ],
    
    /**
     * 🚀 PRÓXIMOS PASSOS
     */
    nextSteps: [
        '🛣️ Rotas e navegação com React Router',
        '🌐 Integração com APIs REST',
        '📡 Estado de servidor com React Query',
        '🔒 Autenticação e autorização',
        '📱 Estado em aplicações mobile (React Native)',
        '🧪 Testes de estado e reducers',
        '⚡ Server-side rendering com estado',
        '🏗️ Arquiteturas escaláveis'
    ],
    
    /**
     * 💡 DICAS FINAIS
     */
    tips: [
        'Comece simples: useState -> Context -> Redux/Zustand',
        'Meça performance antes de otimizar',
        'Use DevTools para entender o fluxo de dados',
        'Mantenha estado próximo de onde é usado',
        'Documente decisões de arquitetura',
        'Teste diferentes soluções em projetos pequenos',
        'Acompanhe evolução das ferramentas',
        'Priorize developer experience e maintainability'
    ]
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StateManagementApp,
        UserProvider,
        CartProvider,
        useUser,
        useCart,
        useNotificationStore,
        useSettingsStore,
        initStateManagement,
        STATE_MANAGEMENT_CONCEPTS,
        STATE_EXERCISES,
        ADDITIONAL_RESOURCES,
        MODULE_SUMMARY
    };
}

// Auto-inicialização se executado diretamente
if (typeof window !== 'undefined') {
    // Aguardar DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStateManagement);
    } else {
        initStateManagement();
    }
}

console.log('📚 Módulo de Gerenciamento de Estado carregado!');
console.log('🎯 Tópicos abordados:', Object.keys(STATE_MANAGEMENT_CONCEPTS));
console.log('💪 Exercícios disponíveis:', STATE_EXERCISES.basic.length + STATE_EXERCISES.intermediate.length + STATE_EXERCISES.advanced.length);
console.log('🚀 Execute initStateManagement() para ver a demonstração!');

/**
 * 🎉 CONCLUSÃO
 * 
 * Parabéns! Você completou o módulo de Gerenciamento de Estado.
 * 
 * Você aprendeu:
 * ✅ Context API para estado global nativo
 * ✅ Redux Toolkit para aplicações complexas  
 * ✅ Zustand como alternativa moderna
 * ✅ Padrões de performance e otimização
 * ✅ Debugging e DevTools
 * ✅ Critérios para escolha da solução
 * 
 * Continue praticando com os exercícios e explore os recursos adicionais!
 * 
 * Próximo módulo: 🛣️ Rotas e Navegação com React Router
 */