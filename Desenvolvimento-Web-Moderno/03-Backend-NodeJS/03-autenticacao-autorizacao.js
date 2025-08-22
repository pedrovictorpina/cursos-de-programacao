/**
 * 🚀 MÓDULO 3: BACKEND COM NODE.JS
 * 📘 Arquivo: 03-autenticacao-autorizacao.js
 * 
 * 🎯 OBJETIVOS DESTE ARQUIVO:
 * • Implementar sistemas de autenticação robustos
 * • Compreender JWT (JSON Web Tokens) e suas aplicações
 * • Aplicar OAuth 2.0 para integração com terceiros
 * • Implementar autorização baseada em roles
 * • Aplicar criptografia e hash de senhas
 * • Criar middleware de segurança avançado
 * • Implementar refresh tokens e sessões
 * 
 * 👨‍🏫 CONCEITOS FUNDAMENTAIS:
 * Este arquivo ensina como proteger APIs e implementar
 * sistemas de autenticação e autorização profissionais.
 */

// =============================================================================
// 1. FUNDAMENTOS DE AUTENTICAÇÃO E AUTORIZAÇÃO
// =============================================================================

/**
 * 🔐 CONCEITOS FUNDAMENTAIS DE SEGURANÇA
 * 
 * Diferenças entre autenticação, autorização e outros conceitos
 */
const securityConcepts = {
    /**
     * 🆔 AUTENTICAÇÃO (Authentication)
     */
    authentication: {
        definicao: 'Processo de verificar a identidade de um usuário',
        pergunta: 'Quem é você?',
        metodos: {
            credentials: {
                tipo: 'Credenciais (usuário/senha)',
                exemplo: `
                    // Login com email e senha
                    const login = async (email, password) => {
                        const user = await User.findOne({ email });
                        if (!user) {
                            throw new Error('Usuário não encontrado');
                        }
                        
                        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
                        if (!isValidPassword) {
                            throw new Error('Senha incorreta');
                        }
                        
                        return generateToken(user);
                    };
                `,
                vantagens: ['Simples de implementar', 'Amplamente suportado'],
                desvantagens: ['Vulnerável a ataques de força bruta', 'Senhas podem ser comprometidas']
            },
            
            jwt: {
                tipo: 'JSON Web Tokens',
                exemplo: `
                    // Token JWT
                    const token = jwt.sign(
                        { userId: user.id, email: user.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '1h' }
                    );
                `,
                vantagens: ['Stateless', 'Escalável', 'Padrão da indústria'],
                desvantagens: ['Difícil de revogar', 'Tamanho maior que session IDs']
            },
            
            oauth: {
                tipo: 'OAuth 2.0',
                exemplo: `
                    // Login com Google OAuth
                    app.get('/auth/google', passport.authenticate('google', {
                        scope: ['profile', 'email']
                    }));
                    
                    app.get('/auth/google/callback',
                        passport.authenticate('google', { failureRedirect: '/login' }),
                        (req, res) => {
                            res.redirect('/dashboard');
                        }
                    );
                `,
                vantagens: ['Não armazena senhas', 'UX melhorada', 'Segurança delegada'],
                desvantagens: ['Dependência de terceiros', 'Complexidade adicional']
            },
            
            biometric: {
                tipo: 'Autenticação Biométrica',
                exemplo: 'Impressão digital, reconhecimento facial, etc.',
                vantagens: ['Alta segurança', 'Conveniência'],
                desvantagens: ['Requer hardware específico', 'Questões de privacidade']
            }
        }
    },
    
    /**
     * 🛡️ AUTORIZAÇÃO (Authorization)
     */
    authorization: {
        definicao: 'Processo de verificar se um usuário tem permissão para acessar um recurso',
        pergunta: 'O que você pode fazer?',
        modelos: {
            rbac: {
                nome: 'Role-Based Access Control (RBAC)',
                descricao: 'Permissões baseadas em papéis/funções',
                exemplo: `
                    const roles = {
                        admin: ['create', 'read', 'update', 'delete'],
                        editor: ['create', 'read', 'update'],
                        viewer: ['read']
                    };
                    
                    const hasPermission = (userRole, action) => {
                        return roles[userRole]?.includes(action) || false;
                    };
                    
                    // Middleware de autorização
                    const authorize = (action) => {
                        return (req, res, next) => {
                            if (!hasPermission(req.user.role, action)) {
                                return res.status(403).json({ error: 'Acesso negado' });
                            }
                            next();
                        };
                    };
                `
            },
            
            abac: {
                nome: 'Attribute-Based Access Control (ABAC)',
                descricao: 'Permissões baseadas em atributos dinâmicos',
                exemplo: `
                    const checkAccess = (user, resource, action, context) => {
                        // Regras baseadas em atributos
                        if (action === 'delete' && user.role !== 'admin') {
                            return false;
                        }
                        
                        if (resource.ownerId === user.id) {
                            return true; // Proprietário pode tudo
                        }
                        
                        if (context.time > '18:00' && user.role === 'employee') {
                            return false; // Funcionários não podem acessar após 18h
                        }
                        
                        return user.permissions.includes(action);
                    };
                `
            },
            
            acl: {
                nome: 'Access Control Lists (ACL)',
                descricao: 'Lista de permissões específicas por recurso',
                exemplo: `
                    const acl = {
                        'post:123': {
                            'user:456': ['read', 'update'],
                            'user:789': ['read'],
                            'role:admin': ['read', 'update', 'delete']
                        }
                    };
                `
            }
        }
    },
    
    /**
     * 🔒 OUTROS CONCEITOS DE SEGURANÇA
     */
    otherConcepts: {
        encryption: {
            nome: 'Criptografia',
            tipos: {
                symmetric: 'Mesma chave para criptografar e descriptografar',
                asymmetric: 'Par de chaves (pública/privada)',
                hashing: 'Função unidirecional (não reversível)'
            }
        },
        
        sessions: {
            nome: 'Sessões',
            descricao: 'Estado mantido no servidor entre requisições',
            exemplo: `
                app.use(session({
                    secret: process.env.SESSION_SECRET,
                    resave: false,
                    saveUninitialized: false,
                    cookie: { secure: true, maxAge: 24 * 60 * 60 * 1000 }
                }));
            `
        },
        
        csrf: {
            nome: 'Cross-Site Request Forgery Protection',
            descricao: 'Proteção contra ataques CSRF',
            exemplo: `
                const csrf = require('csurf');
                app.use(csrf({ cookie: true }));
            `
        }
    }
};

// =============================================================================
// 2. IMPLEMENTAÇÃO DE JWT (JSON WEB TOKENS)
// =============================================================================

/**
 * 🎫 SISTEMA JWT COMPLETO
 * 
 * Implementação robusta de autenticação com JWT
 */
class JWTAuthSystem {
    constructor(options = {}) {
        this.secretKey = options.secretKey || 'your-super-secret-key';
        this.refreshSecretKey = options.refreshSecretKey || 'your-refresh-secret-key';
        this.accessTokenExpiry = options.accessTokenExpiry || '15m';
        this.refreshTokenExpiry = options.refreshTokenExpiry || '7d';
        this.refreshTokens = new Set(); // Em produção, usar Redis ou banco
    }
    
    /**
     * 🔐 GERAR TOKEN DE ACESSO
     */
    generateAccessToken(payload) {
        const tokenPayload = {
            ...payload,
            type: 'access',
            iat: Math.floor(Date.now() / 1000)
        };
        
        // Simulação do jwt.sign()
        const header = this.base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payloadEncoded = this.base64Encode(JSON.stringify(tokenPayload));
        const signature = this.generateSignature(`${header}.${payloadEncoded}`, this.secretKey);
        
        const token = `${header}.${payloadEncoded}.${signature}`;
        
        console.log('🎫 Token de acesso gerado:', {
            payload: tokenPayload,
            expiresIn: this.accessTokenExpiry
        });
        
        return token;
    }
    
    /**
     * 🔄 GERAR REFRESH TOKEN
     */
    generateRefreshToken(payload) {
        const tokenPayload = {
            userId: payload.userId,
            type: 'refresh',
            iat: Math.floor(Date.now() / 1000),
            jti: this.generateJTI() // JWT ID único
        };
        
        const header = this.base64Encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payloadEncoded = this.base64Encode(JSON.stringify(tokenPayload));
        const signature = this.generateSignature(`${header}.${payloadEncoded}`, this.refreshSecretKey);
        
        const token = `${header}.${payloadEncoded}.${signature}`;
        
        // Armazenar refresh token
        this.refreshTokens.add(tokenPayload.jti);
        
        console.log('🔄 Refresh token gerado:', {
            jti: tokenPayload.jti,
            userId: payload.userId
        });
        
        return token;
    }
    
    /**
     * ✅ VERIFICAR TOKEN
     */
    verifyToken(token, isRefreshToken = false) {
        try {
            const [header, payload, signature] = token.split('.');
            
            if (!header || !payload || !signature) {
                throw new Error('Token malformado');
            }
            
            // Verificar assinatura
            const secretKey = isRefreshToken ? this.refreshSecretKey : this.secretKey;
            const expectedSignature = this.generateSignature(`${header}.${payload}`, secretKey);
            
            if (signature !== expectedSignature) {
                throw new Error('Assinatura inválida');
            }
            
            // Decodificar payload
            const decodedPayload = JSON.parse(this.base64Decode(payload));
            
            // Verificar expiração
            const now = Math.floor(Date.now() / 1000);
            const expiryTime = decodedPayload.iat + this.getExpirySeconds(isRefreshToken);
            
            if (now > expiryTime) {
                throw new Error('Token expirado');
            }
            
            // Verificar tipo de token
            const expectedType = isRefreshToken ? 'refresh' : 'access';
            if (decodedPayload.type !== expectedType) {
                throw new Error('Tipo de token incorreto');
            }
            
            // Verificar se refresh token ainda é válido
            if (isRefreshToken && !this.refreshTokens.has(decodedPayload.jti)) {
                throw new Error('Refresh token revogado');
            }
            
            console.log('✅ Token verificado com sucesso:', {
                userId: decodedPayload.userId,
                type: decodedPayload.type
            });
            
            return decodedPayload;
        } catch (error) {
            console.error('❌ Erro na verificação do token:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔄 RENOVAR TOKEN
     */
    refreshAccessToken(refreshToken) {
        try {
            const payload = this.verifyToken(refreshToken, true);
            
            // Gerar novo access token
            const newAccessToken = this.generateAccessToken({
                userId: payload.userId
            });
            
            console.log('🔄 Access token renovado para usuário:', payload.userId);
            
            return newAccessToken;
        } catch (error) {
            console.error('❌ Erro ao renovar token:', error.message);
            throw error;
        }
    }
    
    /**
     * 🚫 REVOGAR REFRESH TOKEN
     */
    revokeRefreshToken(refreshToken) {
        try {
            const payload = this.verifyToken(refreshToken, true);
            this.refreshTokens.delete(payload.jti);
            
            console.log('🚫 Refresh token revogado:', payload.jti);
            return true;
        } catch (error) {
            console.error('❌ Erro ao revogar token:', error.message);
            return false;
        }
    }
    
    /**
     * 🔧 MÉTODOS AUXILIARES
     */
    base64Encode(str) {
        return Buffer.from(str).toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    
    base64Decode(str) {
        str += '='.repeat((4 - str.length % 4) % 4);
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(str, 'base64').toString();
    }
    
    generateSignature(data, secret) {
        // Simulação simples de HMAC SHA256
        const crypto = require('crypto');
        return crypto.createHmac('sha256', secret)
            .update(data)
            .digest('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    
    generateJTI() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    getExpirySeconds(isRefreshToken) {
        if (isRefreshToken) {
            return 7 * 24 * 60 * 60; // 7 dias
        }
        return 15 * 60; // 15 minutos
    }
}

// =============================================================================
// 3. CRIPTOGRAFIA E HASH DE SENHAS
// =============================================================================

/**
 * 🔐 SISTEMA DE CRIPTOGRAFIA
 * 
 * Implementação de hash de senhas e criptografia
 */
class CryptographySystem {
    constructor() {
        this.saltRounds = 12;
    }
    
    /**
     * 🧂 HASH DE SENHA COM BCRYPT
     */
    async hashPassword(password) {
        try {
            // Simulação do bcrypt
            const salt = this.generateSalt(this.saltRounds);
            const hash = this.bcryptHash(password, salt);
            
            console.log('🧂 Senha hasheada:', {
                saltRounds: this.saltRounds,
                hashLength: hash.length
            });
            
            return hash;
        } catch (error) {
            console.error('❌ Erro ao hashear senha:', error.message);
            throw error;
        }
    }
    
    /**
     * ✅ VERIFICAR SENHA
     */
    async verifyPassword(password, hash) {
        try {
            // Extrair salt do hash
            const salt = hash.substring(0, 29);
            const expectedHash = this.bcryptHash(password, salt);
            
            const isValid = hash === expectedHash;
            
            console.log('✅ Verificação de senha:', {
                isValid,
                providedLength: password.length
            });
            
            return isValid;
        } catch (error) {
            console.error('❌ Erro ao verificar senha:', error.message);
            return false;
        }
    }
    
    /**
     * 🔐 CRIPTOGRAFIA SIMÉTRICA
     */
    encrypt(text, key) {
        try {
            const crypto = require('crypto');
            const algorithm = 'aes-256-gcm';
            const iv = crypto.randomBytes(16);
            
            const cipher = crypto.createCipher(algorithm, key);
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            
            const authTag = cipher.getAuthTag();
            
            const result = {
                encrypted,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex')
            };
            
            console.log('🔐 Texto criptografado:', {
                originalLength: text.length,
                encryptedLength: encrypted.length
            });
            
            return result;
        } catch (error) {
            console.error('❌ Erro na criptografia:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔓 DESCRIPTOGRAFIA SIMÉTRICA
     */
    decrypt(encryptedData, key) {
        try {
            const crypto = require('crypto');
            const algorithm = 'aes-256-gcm';
            
            const decipher = crypto.createDecipher(algorithm, key);
            decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
            
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            
            console.log('🔓 Texto descriptografado:', {
                decryptedLength: decrypted.length
            });
            
            return decrypted;
        } catch (error) {
            console.error('❌ Erro na descriptografia:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔧 MÉTODOS AUXILIARES
     */
    generateSalt(rounds) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
        let salt = '$2b$' + rounds.toString().padStart(2, '0') + '$';
        
        for (let i = 0; i < 22; i++) {
            salt += chars[Math.floor(Math.random() * chars.length)];
        }
        
        return salt;
    }
    
    bcryptHash(password, salt) {
        // Simulação simplificada do bcrypt
        const crypto = require('crypto');
        return salt + crypto.createHash('sha256')
            .update(password + salt)
            .digest('base64')
            .substring(0, 31);
    }
    
    /**
     * 🎲 GERAR CHAVES SEGURAS
     */
    generateSecureKey(length = 32) {
        const crypto = require('crypto');
        return crypto.randomBytes(length).toString('hex');
    }
    
    /**
     * 🔢 GERAR CÓDIGO OTP
     */
    generateOTP(length = 6) {
        const digits = '0123456789';
        let otp = '';
        
        for (let i = 0; i < length; i++) {
            otp += digits[Math.floor(Math.random() * digits.length)];
        }
        
        console.log('🔢 OTP gerado:', { length, otp });
        return otp;
    }
}

// =============================================================================
// 4. OAUTH 2.0 E INTEGRAÇÃO COM TERCEIROS
// =============================================================================

/**
 * 🌐 SISTEMA OAUTH 2.0
 * 
 * Implementação de OAuth para integração com provedores externos
 */
class OAuth2System {
    constructor() {
        this.providers = {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID || 'google-client-id',
                clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'google-client-secret',
                redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
                authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
                tokenUrl: 'https://oauth2.googleapis.com/token',
                userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
                scope: 'openid profile email'
            },
            
            github: {
                clientId: process.env.GITHUB_CLIENT_ID || 'github-client-id',
                clientSecret: process.env.GITHUB_CLIENT_SECRET || 'github-client-secret',
                redirectUri: process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback',
                authUrl: 'https://github.com/login/oauth/authorize',
                tokenUrl: 'https://github.com/login/oauth/access_token',
                userInfoUrl: 'https://api.github.com/user',
                scope: 'user:email'
            },
            
            facebook: {
                clientId: process.env.FACEBOOK_CLIENT_ID || 'facebook-client-id',
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'facebook-client-secret',
                redirectUri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback',
                authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
                tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
                userInfoUrl: 'https://graph.facebook.com/me',
                scope: 'email,public_profile'
            }
        };
        
        this.authorizationCodes = new Map(); // Armazenar códigos temporários
        this.accessTokens = new Map(); // Armazenar tokens de acesso
    }
    
    /**
     * 🔗 GERAR URL DE AUTORIZAÇÃO
     */
    getAuthorizationUrl(provider, state = null) {
        const config = this.providers[provider];
        if (!config) {
            throw new Error(`Provedor ${provider} não suportado`);
        }
        
        const params = new URLSearchParams({
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            scope: config.scope,
            response_type: 'code',
            state: state || this.generateState()
        });
        
        const authUrl = `${config.authUrl}?${params.toString()}`;
        
        console.log('🔗 URL de autorização gerada:', {
            provider,
            url: authUrl
        });
        
        return authUrl;
    }
    
    /**
     * 🎫 TROCAR CÓDIGO POR TOKEN
     */
    async exchangeCodeForToken(provider, code, state = null) {
        try {
            const config = this.providers[provider];
            if (!config) {
                throw new Error(`Provedor ${provider} não suportado`);
            }
            
            // Simular requisição para trocar código por token
            const tokenData = await this.simulateTokenExchange(provider, code);
            
            // Armazenar token
            const tokenId = this.generateTokenId();
            this.accessTokens.set(tokenId, {
                ...tokenData,
                provider,
                createdAt: new Date()
            });
            
            console.log('🎫 Token obtido com sucesso:', {
                provider,
                tokenId,
                expiresIn: tokenData.expires_in
            });
            
            return { tokenId, ...tokenData };
        } catch (error) {
            console.error('❌ Erro ao trocar código por token:', error.message);
            throw error;
        }
    }
    
    /**
     * 👤 OBTER INFORMAÇÕES DO USUÁRIO
     */
    async getUserInfo(provider, tokenId) {
        try {
            const tokenData = this.accessTokens.get(tokenId);
            if (!tokenData) {
                throw new Error('Token não encontrado');
            }
            
            if (tokenData.provider !== provider) {
                throw new Error('Token não pertence ao provedor especificado');
            }
            
            // Simular requisição para obter dados do usuário
            const userInfo = await this.simulateUserInfoRequest(provider, tokenData.access_token);
            
            console.log('👤 Informações do usuário obtidas:', {
                provider,
                userId: userInfo.id,
                email: userInfo.email
            });
            
            return userInfo;
        } catch (error) {
            console.error('❌ Erro ao obter informações do usuário:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔄 RENOVAR TOKEN
     */
    async refreshToken(provider, refreshToken) {
        try {
            const config = this.providers[provider];
            if (!config) {
                throw new Error(`Provedor ${provider} não suportado`);
            }
            
            // Simular renovação de token
            const newTokenData = await this.simulateTokenRefresh(provider, refreshToken);
            
            console.log('🔄 Token renovado:', {
                provider,
                expiresIn: newTokenData.expires_in
            });
            
            return newTokenData;
        } catch (error) {
            console.error('❌ Erro ao renovar token:', error.message);
            throw error;
        }
    }
    
    /**
     * 🚫 REVOGAR TOKEN
     */
    async revokeToken(tokenId) {
        try {
            const tokenData = this.accessTokens.get(tokenId);
            if (!tokenData) {
                throw new Error('Token não encontrado');
            }
            
            // Remover token
            this.accessTokens.delete(tokenId);
            
            console.log('🚫 Token revogado:', {
                tokenId,
                provider: tokenData.provider
            });
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao revogar token:', error.message);
            return false;
        }
    }
    
    /**
     * 🎭 MÉTODOS DE SIMULAÇÃO
     */
    async simulateTokenExchange(provider, code) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
            access_token: `${provider}_access_${this.generateTokenId()}`,
            refresh_token: `${provider}_refresh_${this.generateTokenId()}`,
            token_type: 'Bearer',
            expires_in: 3600,
            scope: this.providers[provider].scope
        };
    }
    
    async simulateUserInfoRequest(provider, accessToken) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const mockUsers = {
            google: {
                id: '123456789',
                email: 'usuario@gmail.com',
                name: 'João Silva',
                picture: 'https://example.com/avatar.jpg',
                verified_email: true
            },
            github: {
                id: 987654321,
                login: 'joaosilva',
                email: 'joao@github.com',
                name: 'João Silva',
                avatar_url: 'https://github.com/avatar.jpg'
            },
            facebook: {
                id: '456789123',
                email: 'joao@facebook.com',
                name: 'João Silva',
                picture: {
                    data: {
                        url: 'https://facebook.com/avatar.jpg'
                    }
                }
            }
        };
        
        return mockUsers[provider] || {};
    }
    
    async simulateTokenRefresh(provider, refreshToken) {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
            access_token: `${provider}_access_${this.generateTokenId()}`,
            token_type: 'Bearer',
            expires_in: 3600
        };
    }
    
    /**
     * 🔧 MÉTODOS AUXILIARES
     */
    generateState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    generateTokenId() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
}

// =============================================================================
// 5. MIDDLEWARE DE AUTENTICAÇÃO E AUTORIZAÇÃO
// =============================================================================

/**
 * 🛡️ MIDDLEWARE DE SEGURANÇA AVANÇADO
 * 
 * Middleware robusto para autenticação e autorização
 */
class SecurityMiddleware {
    constructor(jwtSystem, cryptoSystem) {
        this.jwtSystem = jwtSystem;
        this.cryptoSystem = cryptoSystem;
        this.rateLimitStore = new Map();
        this.blacklistedTokens = new Set();
    }
    
    /**
     * 🔐 MIDDLEWARE DE AUTENTICAÇÃO JWT
     */
    authenticateJWT() {
        return (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;
                
                if (!authHeader) {
                    return res.status(401).json({
                        error: 'Token de acesso necessário',
                        code: 'MISSING_TOKEN'
                    });
                }
                
                const token = authHeader.startsWith('Bearer ') 
                    ? authHeader.substring(7) 
                    : authHeader;
                
                // Verificar se token está na blacklist
                if (this.blacklistedTokens.has(token)) {
                    return res.status(401).json({
                        error: 'Token revogado',
                        code: 'REVOKED_TOKEN'
                    });
                }
                
                // Verificar token
                const payload = this.jwtSystem.verifyToken(token);
                
                // Adicionar dados do usuário à requisição
                req.user = payload;
                req.token = token;
                
                console.log('🔐 Usuário autenticado:', {
                    userId: payload.userId,
                    tokenType: payload.type
                });
                
                next();
            } catch (error) {
                console.error('❌ Erro na autenticação:', error.message);
                
                let errorCode = 'INVALID_TOKEN';
                if (error.message.includes('expirado')) {
                    errorCode = 'EXPIRED_TOKEN';
                } else if (error.message.includes('malformado')) {
                    errorCode = 'MALFORMED_TOKEN';
                }
                
                res.status(401).json({
                    error: 'Token inválido',
                    code: errorCode,
                    message: error.message
                });
            }
        };
    }
    
    /**
     * 👮 MIDDLEWARE DE AUTORIZAÇÃO
     */
    authorize(requiredRoles = [], requiredPermissions = []) {
        return (req, res, next) => {
            try {
                if (!req.user) {
                    return res.status(401).json({
                        error: 'Usuário não autenticado',
                        code: 'NOT_AUTHENTICATED'
                    });
                }
                
                // Verificar roles
                if (requiredRoles.length > 0) {
                    const userRoles = Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
                    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
                    
                    if (!hasRequiredRole) {
                        return res.status(403).json({
                            error: 'Acesso negado - Role insuficiente',
                            code: 'INSUFFICIENT_ROLE',
                            required: requiredRoles,
                            current: userRoles
                        });
                    }
                }
                
                // Verificar permissões
                if (requiredPermissions.length > 0) {
                    const userPermissions = req.user.permissions || [];
                    const hasRequiredPermissions = requiredPermissions.every(permission => 
                        userPermissions.includes(permission)
                    );
                    
                    if (!hasRequiredPermissions) {
                        return res.status(403).json({
                            error: 'Acesso negado - Permissões insuficientes',
                            code: 'INSUFFICIENT_PERMISSIONS',
                            required: requiredPermissions,
                            current: userPermissions
                        });
                    }
                }
                
                console.log('👮 Usuário autorizado:', {
                    userId: req.user.userId,
                    roles: req.user.roles || req.user.role,
                    permissions: req.user.permissions
                });
                
                next();
            } catch (error) {
                console.error('❌ Erro na autorização:', error.message);
                res.status(500).json({
                    error: 'Erro interno na autorização',
                    code: 'AUTHORIZATION_ERROR'
                });
            }
        };
    }
    
    /**
     * ⚡ MIDDLEWARE DE RATE LIMITING
     */
    rateLimit(options = {}) {
        const {
            windowMs = 15 * 60 * 1000, // 15 minutos
            max = 100, // máximo de requisições
            message = 'Muitas requisições',
            skipSuccessfulRequests = false,
            skipFailedRequests = false
        } = options;
        
        return (req, res, next) => {
            const key = req.ip || req.connection.remoteAddress || 'unknown';
            const now = Date.now();
            const windowStart = now - windowMs;
            
            // Obter ou criar registro para o IP
            if (!this.rateLimitStore.has(key)) {
                this.rateLimitStore.set(key, []);
            }
            
            const requests = this.rateLimitStore.get(key);
            
            // Remover requisições antigas
            const validRequests = requests.filter(timestamp => timestamp > windowStart);
            
            // Verificar limite
            if (validRequests.length >= max) {
                const resetTime = Math.ceil((validRequests[0] + windowMs) / 1000);
                
                res.set({
                    'X-RateLimit-Limit': max,
                    'X-RateLimit-Remaining': 0,
                    'X-RateLimit-Reset': resetTime
                });
                
                return res.status(429).json({
                    error: message,
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: Math.ceil(windowMs / 1000)
                });
            }
            
            // Adicionar requisição atual
            validRequests.push(now);
            this.rateLimitStore.set(key, validRequests);
            
            // Adicionar headers informativos
            res.set({
                'X-RateLimit-Limit': max,
                'X-RateLimit-Remaining': max - validRequests.length,
                'X-RateLimit-Reset': Math.ceil((now + windowMs) / 1000)
            });
            
            console.log('⚡ Rate limit check:', {
                ip: key,
                requests: validRequests.length,
                limit: max
            });
            
            next();
        };
    }
    
    /**
     * 🔒 MIDDLEWARE DE VALIDAÇÃO DE ORIGEM
     */
    validateOrigin(allowedOrigins = []) {
        return (req, res, next) => {
            const origin = req.headers.origin;
            
            if (allowedOrigins.length === 0) {
                return next(); // Permitir todas as origens se não especificado
            }
            
            if (!origin || !allowedOrigins.includes(origin)) {
                return res.status(403).json({
                    error: 'Origem não permitida',
                    code: 'FORBIDDEN_ORIGIN',
                    origin
                });
            }
            
            console.log('🔒 Origem validada:', origin);
            next();
        };
    }
    
    /**
     * 🚫 BLACKLIST DE TOKENS
     */
    blacklistToken(token) {
        this.blacklistedTokens.add(token);
        console.log('🚫 Token adicionado à blacklist');
    }
    
    /**
     * 🧹 LIMPEZA PERIÓDICA
     */
    startCleanupTask(intervalMs = 60 * 60 * 1000) { // 1 hora
        setInterval(() => {
            this.cleanupExpiredData();
        }, intervalMs);
        
        console.log('🧹 Tarefa de limpeza iniciada');
    }
    
    cleanupExpiredData() {
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutos
        
        // Limpar rate limit store
        for (const [key, requests] of this.rateLimitStore.entries()) {
            const validRequests = requests.filter(timestamp => timestamp > now - windowMs);
            if (validRequests.length === 0) {
                this.rateLimitStore.delete(key);
            } else {
                this.rateLimitStore.set(key, validRequests);
            }
        }
        
        console.log('🧹 Dados expirados removidos');
    }
}

// =============================================================================
// 6. SISTEMA COMPLETO DE AUTENTICAÇÃO
// =============================================================================

/**
 * 🏗️ SISTEMA COMPLETO DE AUTENTICAÇÃO
 * 
 * Integração de todos os componentes de segurança
 */
class CompleteAuthSystem {
    constructor() {
        this.jwtSystem = new JWTAuthSystem({
            secretKey: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
            refreshSecretKey: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
            accessTokenExpiry: '15m',
            refreshTokenExpiry: '7d'
        });
        
        this.cryptoSystem = new CryptographySystem();
        this.oauthSystem = new OAuth2System();
        this.securityMiddleware = new SecurityMiddleware(this.jwtSystem, this.cryptoSystem);
        
        // Simulação de banco de dados de usuários
        this.users = new Map();
        this.initializeDefaultUsers();
        
        // Iniciar limpeza automática
        this.securityMiddleware.startCleanupTask();
    }
    
    /**
     * 👥 INICIALIZAR USUÁRIOS PADRÃO
     */
    async initializeDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                email: 'admin@example.com',
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                permissions: ['create', 'read', 'update', 'delete']
            },
            {
                id: 2,
                email: 'user@example.com',
                password: 'user123',
                name: 'Usuário Comum',
                role: 'user',
                permissions: ['read']
            }
        ];
        
        for (const userData of defaultUsers) {
            const hashedPassword = await this.cryptoSystem.hashPassword(userData.password);
            this.users.set(userData.email, {
                ...userData,
                passwordHash: hashedPassword,
                createdAt: new Date(),
                isActive: true
            });
        }
        
        console.log('👥 Usuários padrão inicializados');
    }
    
    /**
     * 🔐 LOGIN COM CREDENCIAIS
     */
    async login(email, password) {
        try {
            // Buscar usuário
            const user = this.users.get(email);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }
            
            if (!user.isActive) {
                throw new Error('Conta desativada');
            }
            
            // Verificar senha
            const isValidPassword = await this.cryptoSystem.verifyPassword(password, user.passwordHash);
            if (!isValidPassword) {
                throw new Error('Senha incorreta');
            }
            
            // Gerar tokens
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            };
            
            const accessToken = this.jwtSystem.generateAccessToken(tokenPayload);
            const refreshToken = this.jwtSystem.generateRefreshToken(tokenPayload);
            
            // Atualizar último login
            user.lastLogin = new Date();
            
            console.log('🔐 Login realizado com sucesso:', {
                userId: user.id,
                email: user.email
            });
            
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        } catch (error) {
            console.error('❌ Erro no login:', error.message);
            throw error;
        }
    }
    
    /**
     * 📝 REGISTRO DE USUÁRIO
     */
    async register(userData) {
        try {
            const { email, password, name, role = 'user' } = userData;
            
            // Verificar se usuário já existe
            if (this.users.has(email)) {
                throw new Error('Email já cadastrado');
            }
            
            // Validar senha
            if (password.length < 6) {
                throw new Error('Senha deve ter pelo menos 6 caracteres');
            }
            
            // Hash da senha
            const passwordHash = await this.cryptoSystem.hashPassword(password);
            
            // Criar usuário
            const newUser = {
                id: this.users.size + 1,
                email,
                passwordHash,
                name,
                role,
                permissions: role === 'admin' ? ['create', 'read', 'update', 'delete'] : ['read'],
                createdAt: new Date(),
                isActive: true
            };
            
            this.users.set(email, newUser);
            
            console.log('📝 Usuário registrado:', {
                userId: newUser.id,
                email: newUser.email
            });
            
            return {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            };
        } catch (error) {
            console.error('❌ Erro no registro:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔄 RENOVAR TOKEN
     */
    async refreshToken(refreshToken) {
        try {
            const newAccessToken = this.jwtSystem.refreshAccessToken(refreshToken);
            
            console.log('🔄 Token renovado com sucesso');
            
            return {
                accessToken: newAccessToken
            };
        } catch (error) {
            console.error('❌ Erro ao renovar token:', error.message);
            throw error;
        }
    }
    
    /**
     * 🚪 LOGOUT
     */
    async logout(accessToken, refreshToken) {
        try {
            // Adicionar tokens à blacklist
            this.securityMiddleware.blacklistToken(accessToken);
            
            // Revogar refresh token
            this.jwtSystem.revokeRefreshToken(refreshToken);
            
            console.log('🚪 Logout realizado com sucesso');
            
            return { success: true };
        } catch (error) {
            console.error('❌ Erro no logout:', error.message);
            throw error;
        }
    }
    
    /**
     * 🌐 LOGIN COM OAUTH
     */
    async loginWithOAuth(provider, code, state) {
        try {
            // Trocar código por token
            const tokenData = await this.oauthSystem.exchangeCodeForToken(provider, code, state);
            
            // Obter informações do usuário
            const userInfo = await this.oauthSystem.getUserInfo(provider, tokenData.tokenId);
            
            // Buscar ou criar usuário local
            let user = Array.from(this.users.values()).find(u => u.email === userInfo.email);
            
            if (!user) {
                // Criar novo usuário
                const newUser = {
                    id: this.users.size + 1,
                    email: userInfo.email,
                    name: userInfo.name,
                    role: 'user',
                    permissions: ['read'],
                    oauthProvider: provider,
                    oauthId: userInfo.id,
                    createdAt: new Date(),
                    isActive: true
                };
                
                this.users.set(userInfo.email, newUser);
                user = newUser;
                
                console.log('👤 Novo usuário criado via OAuth:', {
                    provider,
                    email: userInfo.email
                });
            }
            
            // Gerar tokens JWT
            const tokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                permissions: user.permissions
            };
            
            const accessToken = this.jwtSystem.generateAccessToken(tokenPayload);
            const refreshToken = this.jwtSystem.generateRefreshToken(tokenPayload);
            
            console.log('🌐 Login OAuth realizado:', {
                provider,
                userId: user.id
            });
            
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions
                },
                tokens: {
                    accessToken,
                    refreshToken
                }
            };
        } catch (error) {
            console.error('❌ Erro no login OAuth:', error.message);
            throw error;
        }
    }
    
    /**
     * 🔧 OBTER MIDDLEWARES
     */
    getMiddlewares() {
        return {
            authenticate: this.securityMiddleware.authenticateJWT(),
            authorize: (roles, permissions) => this.securityMiddleware.authorize(roles, permissions),
            rateLimit: (options) => this.securityMiddleware.rateLimit(options),
            validateOrigin: (origins) => this.securityMiddleware.validateOrigin(origins)
        };
    }
}

// =============================================================================
// 7. INICIALIZAÇÃO E DEMONSTRAÇÃO
// =============================================================================

/**
 * 🚀 FUNÇÃO DE INICIALIZAÇÃO
 * 
 * Demonstra o sistema completo de autenticação
 */
function initAuthenticationSystem() {
    console.log('🌟 Inicializando sistema de autenticação e autorização');
    console.log('📘 Conceitos abordados:');
    console.log('  • JWT (JSON Web Tokens)');
    console.log('  • Criptografia e hash de senhas');
    console.log('  • OAuth 2.0 e integração com terceiros');
    console.log('  • Middleware de segurança');
    console.log('  • Rate limiting e proteções');
    console.log('  • Sistema completo de autenticação');
    
    // Criar sistema de autenticação
    const authSystem = new CompleteAuthSystem();
    
    // Demonstrar funcionalidades
    setTimeout(async () => {
        console.log('\n🎭 Demonstrando funcionalidades...');
        
        try {
            // 1. Login com credenciais
            console.log('\n1. 🔐 Testando login com credenciais...');
            const loginResult = await authSystem.login('admin@example.com', 'admin123');
            console.log('✅ Login bem-sucedido:', loginResult.user.name);
            
            // 2. Verificar token
            console.log('\n2. ✅ Verificando token...');
            const tokenPayload = authSystem.jwtSystem.verifyToken(loginResult.tokens.accessToken);
            console.log('✅ Token válido para usuário:', tokenPayload.userId);
            
            // 3. Renovar token
            console.log('\n3. 🔄 Renovando token...');
            const refreshResult = await authSystem.refreshToken(loginResult.tokens.refreshToken);
            console.log('✅ Token renovado com sucesso');
            
            // 4. Registro de novo usuário
            console.log('\n4. 📝 Registrando novo usuário...');
            const newUser = await authSystem.register({
                email: 'novo@example.com',
                password: 'senha123',
                name: 'Novo Usuário',
                role: 'user'
            });
            console.log('✅ Usuário registrado:', newUser.name);
            
            // 5. OAuth (simulação)
            console.log('\n5. 🌐 Simulando OAuth...');
            const authUrl = authSystem.oauthSystem.getAuthorizationUrl('google');
            console.log('✅ URL de autorização gerada');
            
            // 6. Logout
            console.log('\n6. 🚪 Fazendo logout...');
            await authSystem.logout(loginResult.tokens.accessToken, loginResult.tokens.refreshToken);
            console.log('✅ Logout realizado');
            
        } catch (error) {
            console.error('❌ Erro na demonstração:', error.message);
        }
    }, 1000);
    
    return {
        authSystem,
        concepts: securityConcepts,
        JWTAuthSystem,
        CryptographySystem,
        OAuth2System,
        SecurityMiddleware,
        CompleteAuthSystem
    };
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initAuthenticationSystem,
        securityConcepts,
        JWTAuthSystem,
        CryptographySystem,
        OAuth2System,
        SecurityMiddleware,
        CompleteAuthSystem
    };
}

// Auto-inicializar se executado diretamente
if (typeof require !== 'undefined' && require.main === module) {
    initAuthenticationSystem();
}

/**
 * 🎓 RESUMO DE AUTENTICAÇÃO E AUTORIZAÇÃO
 * 
 * Neste arquivo, você aprendeu:
 * 
 * 1. 🔐 **Conceitos Fundamentais**: Diferenças entre autenticação e autorização
 * 2. 🎫 **JWT**: Implementação completa de JSON Web Tokens
 * 3. 🔒 **Criptografia**: Hash de senhas e criptografia simétrica
 * 4. 🌐 **OAuth 2.0**: Integração com provedores externos
 * 5. 🛡️ **Middleware**: Proteção robusta de rotas
 * 6. ⚡ **Rate Limiting**: Proteção contra ataques
 * 7. 🏗️ **Sistema Completo**: Integração de todos os componentes
 * 
 * **Próximo arquivo**: 04-bancos-dados.js
 * Onde você aprenderá integração com MongoDB e PostgreSQL!
 */