/*
========================================
EXERCÍCIOS DE DESIGN PATTERNS
========================================

Este arquivo contém 3 exercícios práticos para aprender e aplicar
os principais design patterns em JavaScript:

1. Sistema de Configuração Global (Singleton + Factory)
2. Sistema de Notificações (Observer + Command)
3. Sistema de Plugins (Strategy + Decorator + Facade)

Cada exercício demonstra múltiplos padrões trabalhando em conjunto,
refletindo cenários reais de desenvolvimento.

========================================
EXERCÍCIO 1: SISTEMA DE CONFIGURAÇÃO GLOBAL
========================================

Padrões aplicados:
• Singleton - Instância única de configuração
• Factory - Criação de diferentes tipos de configuração
• Builder - Construção fluente de configurações
• Proxy - Interceptação e validação de acessos
*/

// Singleton para gerenciar configurações globais
class ConfigurationManager {
    constructor() {
        if (ConfigurationManager.instance) {
            return ConfigurationManager.instance;
        }
        
        this.configs = new Map();
        this.subscribers = new Set();
        this.history = [];
        this.locked = false;
        
        ConfigurationManager.instance = this;
        return this;
    }
    
    // Factory method para criar diferentes tipos de configuração
    static createConfig(type, options = {}) {
        const factories = {
            database: () => new DatabaseConfig(options),
            api: () => new ApiConfig(options),
            ui: () => new UiConfig(options),
            security: () => new SecurityConfig(options)
        };
        
        const factory = factories[type];
        if (!factory) {
            throw new Error(`Tipo de configuração '${type}' não suportado`);
        }
        
        return factory();
    }
    
    // Registrar configuração com validação
    register(name, config) {
        if (this.locked) {
            throw new Error('ConfigurationManager está bloqueado para modificações');
        }
        
        // Validar configuração
        if (!config || typeof config.validate !== 'function') {
            throw new Error('Configuração deve implementar método validate()');
        }
        
        config.validate();
        
        // Salvar estado anterior para histórico
        const previousConfig = this.configs.get(name);
        this.history.push({
            action: previousConfig ? 'update' : 'create',
            name,
            previous: previousConfig ? { ...previousConfig.toObject() } : null,
            current: { ...config.toObject() },
            timestamp: new Date()
        });
        
        this.configs.set(name, config);
        this.notifySubscribers('configChanged', { name, config });
        
        return this;
    }
    
    // Obter configuração com proxy para interceptação
    get(name) {
        const config = this.configs.get(name);
        if (!config) {
            throw new Error(`Configuração '${name}' não encontrada`);
        }
        
        // Retornar proxy para interceptar acessos
        return new Proxy(config, {
            get(target, prop) {
                // Log de acesso
                console.log(`🔍 Acessando propriedade '${prop}' da configuração '${name}'`);
                
                const value = target[prop];
                
                // Se for uma função, fazer bind do contexto
                if (typeof value === 'function') {
                    return value.bind(target);
                }
                
                return value;
            },
            
            set(target, prop, value) {
                console.log(`⚠️ Tentativa de modificação da propriedade '${prop}' na configuração '${name}'`);
                throw new Error('Configurações são imutáveis após registro. Use update() para modificar.');
            }
        });
    }
    
    // Atualizar configuração existente
    update(name, updates) {
        if (this.locked) {
            throw new Error('ConfigurationManager está bloqueado para modificações');
        }
        
        const config = this.configs.get(name);
        if (!config) {
            throw new Error(`Configuração '${name}' não encontrada`);
        }
        
        const updatedConfig = config.update(updates);
        this.register(name, updatedConfig);
        
        return this;
    }
    
    // Bloquear modificações
    lock() {
        this.locked = true;
        console.log('🔒 ConfigurationManager bloqueado para modificações');
        return this;
    }
    
    // Desbloquear modificações
    unlock() {
        this.locked = false;
        console.log('🔓 ConfigurationManager desbloqueado para modificações');
        return this;
    }
    
    // Observer pattern para notificações
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    
    notifySubscribers(event, data) {
        this.subscribers.forEach(callback => {
            try {
                callback(event, data);
            } catch (error) {
                console.error('Erro ao notificar subscriber:', error);
            }
        });
    }
    
    // Obter histórico de mudanças
    getHistory() {
        return [...this.history];
    }
    
    // Exportar todas as configurações
    export() {
        const exported = {};
        for (const [name, config] of this.configs) {
            exported[name] = config.toObject();
        }
        return exported;
    }
    
    // Importar configurações
    import(configurations) {
        for (const [name, configData] of Object.entries(configurations)) {
            const config = ConfigurationManager.createConfig(configData.type, configData);
            this.register(name, config);
        }
        return this;
    }
}

// Classe base para configurações
class BaseConfig {
    constructor(options = {}) {
        this.type = this.constructor.name.toLowerCase().replace('config', '');
        this.created = new Date();
        this.version = options.version || '1.0.0';
        this.environment = options.environment || 'development';
    }
    
    validate() {
        if (!this.type) {
            throw new Error('Tipo de configuração é obrigatório');
        }
    }
    
    update(updates) {
        const ConfigClass = this.constructor;
        const currentData = this.toObject();
        const newData = { ...currentData, ...updates };
        return new ConfigClass(newData);
    }
    
    toObject() {
        const obj = {};
        for (const key in this) {
            if (this.hasOwnProperty(key) && typeof this[key] !== 'function') {
                obj[key] = this[key];
            }
        }
        return obj;
    }
}

// Configuração de banco de dados
class DatabaseConfig extends BaseConfig {
    constructor(options = {}) {
        super(options);
        this.host = options.host || 'localhost';
        this.port = options.port || 5432;
        this.database = options.database || 'app_db';
        this.username = options.username || 'user';
        this.password = options.password || '';
        this.ssl = options.ssl || false;
        this.poolSize = options.poolSize || 10;
        this.timeout = options.timeout || 30000;
    }
    
    validate() {
        super.validate();
        if (!this.host || !this.database) {
            throw new Error('Host e database são obrigatórios');
        }
        if (this.port < 1 || this.port > 65535) {
            throw new Error('Porta deve estar entre 1 e 65535');
        }
    }
    
    getConnectionString() {
        const protocol = this.ssl ? 'postgresql+ssl' : 'postgresql';
        return `${protocol}://${this.username}:${this.password}@${this.host}:${this.port}/${this.database}`;
    }
}

// Configuração de API
class ApiConfig extends BaseConfig {
    constructor(options = {}) {
        super(options);
        this.baseUrl = options.baseUrl || 'http://localhost:3000';
        this.timeout = options.timeout || 5000;
        this.retries = options.retries || 3;
        this.apiKey = options.apiKey || '';
        this.rateLimit = options.rateLimit || 100;
        this.headers = options.headers || {};
    }
    
    validate() {
        super.validate();
        if (!this.baseUrl) {
            throw new Error('Base URL é obrigatória');
        }
        try {
            new URL(this.baseUrl);
        } catch {
            throw new Error('Base URL deve ser uma URL válida');
        }
    }
    
    getHeaders() {
        const headers = { ...this.headers };
        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }
        return headers;
    }
}

// Configuração de UI
class UiConfig extends BaseConfig {
    constructor(options = {}) {
        super(options);
        this.theme = options.theme || 'light';
        this.language = options.language || 'pt-BR';
        this.animations = options.animations !== false;
        this.notifications = options.notifications !== false;
        this.autoSave = options.autoSave !== false;
        this.pageSize = options.pageSize || 20;
    }
    
    validate() {
        super.validate();
        const validThemes = ['light', 'dark', 'auto'];
        if (!validThemes.includes(this.theme)) {
            throw new Error(`Tema deve ser um de: ${validThemes.join(', ')}`);
        }
    }
}

// Configuração de segurança
class SecurityConfig extends BaseConfig {
    constructor(options = {}) {
        super(options);
        this.jwtSecret = options.jwtSecret || '';
        this.jwtExpiration = options.jwtExpiration || '24h';
        this.bcryptRounds = options.bcryptRounds || 12;
        this.corsOrigins = options.corsOrigins || ['http://localhost:3000'];
        this.rateLimitWindow = options.rateLimitWindow || 900000; // 15 min
        this.rateLimitMax = options.rateLimitMax || 100;
    }
    
    validate() {
        super.validate();
        if (!this.jwtSecret || this.jwtSecret.length < 32) {
            throw new Error('JWT secret deve ter pelo menos 32 caracteres');
        }
        if (this.bcryptRounds < 10 || this.bcryptRounds > 15) {
            throw new Error('Rounds do bcrypt devem estar entre 10 e 15');
        }
    }
}

// Builder para configurações complexas
class ConfigBuilder {
    constructor() {
        this.configs = new Map();
    }
    
    database(options) {
        this.configs.set('database', ConfigurationManager.createConfig('database', options));
        return this;
    }
    
    api(options) {
        this.configs.set('api', ConfigurationManager.createConfig('api', options));
        return this;
    }
    
    ui(options) {
        this.configs.set('ui', ConfigurationManager.createConfig('ui', options));
        return this;
    }
    
    security(options) {
        this.configs.set('security', ConfigurationManager.createConfig('security', options));
        return this;
    }
    
    build() {
        const manager = new ConfigurationManager();
        for (const [name, config] of this.configs) {
            manager.register(name, config);
        }
        return manager;
    }
}

// Demonstração do Sistema de Configuração
console.log('\n=== EXERCÍCIO 1: SISTEMA DE CONFIGURAÇÃO GLOBAL ===\n');

// Criar configurações usando Builder pattern
const configManager = new ConfigBuilder()
    .database({
        host: 'localhost',
        port: 5432,
        database: 'myapp',
        username: 'admin',
        password: 'secret123',
        ssl: true
    })
    .api({
        baseUrl: 'https://api.myapp.com',
        timeout: 10000,
        apiKey: 'sk-1234567890abcdef',
        retries: 5
    })
    .ui({
        theme: 'dark',
        language: 'pt-BR',
        animations: true
    })
    .security({
        jwtSecret: 'super-secret-jwt-key-with-32-chars-min',
        jwtExpiration: '7d',
        bcryptRounds: 12
    })
    .build();

// Subscrever para mudanças
const unsubscribe = configManager.subscribe((event, data) => {
    console.log(`📢 Evento: ${event}`, data.name);
});

// Testar acesso às configurações
console.log('🔍 Testando acesso às configurações:');
const dbConfig = configManager.get('database');
console.log('Connection String:', dbConfig.getConnectionString());

const apiConfig = configManager.get('api');
console.log('API Headers:', apiConfig.getHeaders());

// Testar atualização
console.log('\n🔄 Testando atualização de configuração:');
configManager.update('ui', { theme: 'light', pageSize: 50 });

// Testar bloqueio
console.log('\n🔒 Testando bloqueio de configurações:');
configManager.lock();
try {
    configManager.update('api', { timeout: 15000 });
} catch (error) {
    console.log('❌ Erro esperado:', error.message);
}

// Mostrar histórico
console.log('\n📜 Histórico de mudanças:');
configManager.getHistory().forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.action} '${entry.name}' em ${entry.timestamp.toLocaleString()}`);
});

/*
========================================
EXERCÍCIO 2: SISTEMA DE NOTIFICAÇÕES
========================================

Padrões aplicados:
• Observer - Notificação de eventos
• Command - Encapsulamento de ações
• Chain of Responsibility - Pipeline de processamento
• Template Method - Estrutura comum para notificações
*/

// Command pattern para ações de notificação
class NotificationCommand {
    constructor(type, payload, options = {}) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.type = type;
        this.payload = payload;
        this.options = options;
        this.timestamp = new Date();
        this.status = 'pending';
        this.attempts = 0;
        this.maxAttempts = options.maxAttempts || 3;
    }
    
    execute(context) {
        this.attempts++;
        this.status = 'executing';
        
        try {
            const result = this.doExecute(context);
            this.status = 'completed';
            return result;
        } catch (error) {
            this.status = 'failed';
            this.error = error;
            
            if (this.attempts < this.maxAttempts) {
                this.status = 'retrying';
                setTimeout(() => this.execute(context), this.getRetryDelay());
            }
            
            throw error;
        }
    }
    
    doExecute(context) {
        throw new Error('Método doExecute deve ser implementado');
    }
    
    getRetryDelay() {
        return Math.pow(2, this.attempts) * 1000; // Exponential backoff
    }
    
    canExecute() {
        return this.status === 'pending' || this.status === 'retrying';
    }
}

// Comandos específicos para diferentes tipos de notificação
class EmailNotificationCommand extends NotificationCommand {
    doExecute(context) {
        const { to, subject, body } = this.payload;
        console.log(`📧 Enviando email para ${to}:`);
        console.log(`   Assunto: ${subject}`);
        console.log(`   Corpo: ${body.substring(0, 50)}...`);
        
        // Simular envio
        if (Math.random() < 0.8) { // 80% de sucesso
            return { messageId: `email-${this.id}`, status: 'sent' };
        } else {
            throw new Error('Falha no envio do email');
        }
    }
}

class PushNotificationCommand extends NotificationCommand {
    doExecute(context) {
        const { deviceId, title, message } = this.payload;
        console.log(`📱 Enviando push para dispositivo ${deviceId}:`);
        console.log(`   Título: ${title}`);
        console.log(`   Mensagem: ${message}`);
        
        // Simular envio
        if (Math.random() < 0.9) { // 90% de sucesso
            return { notificationId: `push-${this.id}`, status: 'delivered' };
        } else {
            throw new Error('Dispositivo não encontrado');
        }
    }
}

class SmsNotificationCommand extends NotificationCommand {
    doExecute(context) {
        const { phoneNumber, message } = this.payload;
        console.log(`📱 Enviando SMS para ${phoneNumber}:`);
        console.log(`   Mensagem: ${message}`);
        
        // Simular envio
        if (Math.random() < 0.85) { // 85% de sucesso
            return { messageId: `sms-${this.id}`, status: 'sent' };
        } else {
            throw new Error('Número inválido');
        }
    }
}

// Chain of Responsibility para processamento de notificações
class NotificationProcessor {
    constructor() {
        this.next = null;
    }
    
    setNext(processor) {
        this.next = processor;
        return processor;
    }
    
    process(command, context) {
        if (this.canProcess(command)) {
            return this.doProcess(command, context);
        } else if (this.next) {
            return this.next.process(command, context);
        } else {
            throw new Error(`Nenhum processador encontrado para comando ${command.type}`);
        }
    }
    
    canProcess(command) {
        throw new Error('Método canProcess deve ser implementado');
    }
    
    doProcess(command, context) {
        throw new Error('Método doProcess deve ser implementado');
    }
}

// Processadores específicos
class EmailProcessor extends NotificationProcessor {
    canProcess(command) {
        return command.type === 'email';
    }
    
    doProcess(command, context) {
        console.log('🔄 Processando notificação por email...');
        return command.execute(context);
    }
}

class PushProcessor extends NotificationProcessor {
    canProcess(command) {
        return command.type === 'push';
    }
    
    doProcess(command, context) {
        console.log('🔄 Processando notificação push...');
        return command.execute(context);
    }
}

class SmsProcessor extends NotificationProcessor {
    canProcess(command) {
        return command.type === 'sms';
    }
    
    doProcess(command, context) {
        console.log('🔄 Processando notificação SMS...');
        return command.execute(context);
    }
}

// Observer pattern para o sistema de notificações
class NotificationCenter {
    constructor() {
        this.observers = new Map();
        this.queue = [];
        this.processing = false;
        this.history = [];
        this.processors = this.setupProcessors();
    }
    
    setupProcessors() {
        const emailProcessor = new EmailProcessor();
        const pushProcessor = new PushProcessor();
        const smsProcessor = new SmsProcessor();
        
        emailProcessor.setNext(pushProcessor).setNext(smsProcessor);
        
        return emailProcessor;
    }
    
    // Observer pattern
    subscribe(event, callback) {
        if (!this.observers.has(event)) {
            this.observers.set(event, new Set());
        }
        this.observers.get(event).add(callback);
        
        return () => {
            const callbacks = this.observers.get(event);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }
    
    notify(event, data) {
        const callbacks = this.observers.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erro ao notificar observer para evento ${event}:`, error);
                }
            });
        }
    }
    
    // Enviar notificação
    send(type, payload, options = {}) {
        const command = this.createCommand(type, payload, options);
        this.queue.push(command);
        
        this.notify('notificationQueued', { command });
        
        if (!this.processing) {
            this.processQueue();
        }
        
        return command.id;
    }
    
    createCommand(type, payload, options) {
        const commandMap = {
            email: EmailNotificationCommand,
            push: PushNotificationCommand,
            sms: SmsNotificationCommand
        };
        
        const CommandClass = commandMap[type];
        if (!CommandClass) {
            throw new Error(`Tipo de notificação '${type}' não suportado`);
        }
        
        return new CommandClass(type, payload, options);
    }
    
    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        
        this.processing = true;
        this.notify('processingStarted', { queueSize: this.queue.length });
        
        while (this.queue.length > 0) {
            const command = this.queue.shift();
            
            try {
                this.notify('notificationProcessing', { command });
                
                const result = await this.processors.process(command, this);
                
                this.history.push({
                    command,
                    result,
                    status: 'success',
                    processedAt: new Date()
                });
                
                this.notify('notificationSent', { command, result });
                
            } catch (error) {
                this.history.push({
                    command,
                    error,
                    status: 'failed',
                    processedAt: new Date()
                });
                
                this.notify('notificationFailed', { command, error });
            }
            
            // Pequena pausa entre processamentos
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.processing = false;
        this.notify('processingCompleted', { historySize: this.history.length });
    }
    
    // Obter estatísticas
    getStats() {
        const total = this.history.length;
        const successful = this.history.filter(h => h.status === 'success').length;
        const failed = this.history.filter(h => h.status === 'failed').length;
        
        const byType = this.history.reduce((acc, h) => {
            const type = h.command.type;
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});
        
        return {
            total,
            successful,
            failed,
            successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
            byType,
            queueSize: this.queue.length
        };
    }
    
    // Limpar histórico
    clearHistory() {
        this.history = [];
        this.notify('historyCleaned', {});
    }
}

// Template Method para diferentes tipos de notificação
class NotificationTemplate {
    constructor(notificationCenter) {
        this.notificationCenter = notificationCenter;
    }
    
    // Template method
    sendNotification(recipient, data) {
        const payload = this.preparePayload(recipient, data);
        const options = this.getOptions(data);
        
        return this.notificationCenter.send(this.getType(), payload, options);
    }
    
    getType() {
        throw new Error('Método getType deve ser implementado');
    }
    
    preparePayload(recipient, data) {
        throw new Error('Método preparePayload deve ser implementado');
    }
    
    getOptions(data) {
        return {
            priority: data.priority || 'normal',
            maxAttempts: data.maxAttempts || 3
        };
    }
}

class WelcomeEmailTemplate extends NotificationTemplate {
    getType() {
        return 'email';
    }
    
    preparePayload(recipient, data) {
        return {
            to: recipient.email,
            subject: `Bem-vindo(a), ${recipient.name}!`,
            body: `Olá ${recipient.name},\n\nSeja bem-vindo(a) à nossa plataforma!\n\nAtenciosamente,\nEquipe`
        };
    }
}

class OrderConfirmationTemplate extends NotificationTemplate {
    getType() {
        return 'email';
    }
    
    preparePayload(recipient, data) {
        return {
            to: recipient.email,
            subject: `Pedido #${data.orderId} confirmado`,
            body: `Olá ${recipient.name},\n\nSeu pedido #${data.orderId} foi confirmado!\n\nTotal: R$ ${data.total}\n\nObrigado!`
        };
    }
}

class UrgentAlertTemplate extends NotificationTemplate {
    getType() {
        return 'push';
    }
    
    preparePayload(recipient, data) {
        return {
            deviceId: recipient.deviceId,
            title: 'Alerta Urgente',
            message: data.message
        };
    }
    
    getOptions(data) {
        return {
            priority: 'high',
            maxAttempts: 5
        };
    }
}

// Demonstração do Sistema de Notificações
console.log('\n\n=== EXERCÍCIO 2: SISTEMA DE NOTIFICAÇÕES ===\n');

const notificationCenter = new NotificationCenter();

// Subscrever para eventos
notificationCenter.subscribe('notificationSent', (data) => {
    console.log(`✅ Notificação ${data.command.id} enviada com sucesso`);
});

notificationCenter.subscribe('notificationFailed', (data) => {
    console.log(`❌ Falha ao enviar notificação ${data.command.id}: ${data.error.message}`);
});

notificationCenter.subscribe('processingCompleted', (data) => {
    console.log(`🏁 Processamento concluído. Histórico: ${data.historySize} itens`);
});

// Usar templates para enviar notificações
const welcomeTemplate = new WelcomeEmailTemplate(notificationCenter);
const orderTemplate = new OrderConfirmationTemplate(notificationCenter);
const alertTemplate = new UrgentAlertTemplate(notificationCenter);

// Enviar diferentes tipos de notificação
console.log('📤 Enviando notificações...');

welcomeTemplate.sendNotification(
    { name: 'João Silva', email: 'joao@email.com' },
    { priority: 'normal' }
);

orderTemplate.sendNotification(
    { name: 'Maria Santos', email: 'maria@email.com' },
    { orderId: '12345', total: '299.90' }
);

alertTemplate.sendNotification(
    { deviceId: 'device-abc123' },
    { message: 'Sistema será reiniciado em 5 minutos', priority: 'high' }
);

// Enviar notificações diretas
notificationCenter.send('sms', {
    phoneNumber: '+5511999999999',
    message: 'Seu código de verificação é: 123456'
});

// Aguardar processamento e mostrar estatísticas
setTimeout(() => {
    console.log('\n📊 Estatísticas do sistema:');
    console.log(notificationCenter.getStats());
}, 2000);

/*
========================================
EXERCÍCIO 3: SISTEMA DE PLUGINS
========================================

Padrões aplicados:
• Strategy - Diferentes estratégias de processamento
• Decorator - Extensão de funcionalidades
• Facade - Interface simplificada
• Plugin Architecture - Sistema extensível
*/

// Strategy pattern para diferentes tipos de processamento
class ProcessingStrategy {
    process(data, context) {
        throw new Error('Método process deve ser implementado');
    }
    
    getName() {
        throw new Error('Método getName deve ser implementado');
    }
    
    getDescription() {
        return 'Estratégia de processamento';
    }
    
    getVersion() {
        return '1.0.0';
    }
}

// Estratégias específicas
class DataValidationStrategy extends ProcessingStrategy {
    constructor(rules = {}) {
        super();
        this.rules = rules;
    }
    
    process(data, context) {
        console.log('🔍 Executando validação de dados...');
        
        const errors = [];
        
        for (const [field, rule] of Object.entries(this.rules)) {
            const value = data[field];
            
            if (rule.required && (value === undefined || value === null || value === '')) {
                errors.push(`Campo '${field}' é obrigatório`);
            }
            
            if (value !== undefined && rule.type && typeof value !== rule.type) {
                errors.push(`Campo '${field}' deve ser do tipo ${rule.type}`);
            }
            
            if (value !== undefined && rule.minLength && value.length < rule.minLength) {
                errors.push(`Campo '${field}' deve ter pelo menos ${rule.minLength} caracteres`);
            }
            
            if (value !== undefined && rule.pattern && !rule.pattern.test(value)) {
                errors.push(`Campo '${field}' não atende ao padrão exigido`);
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`Validação falhou: ${errors.join(', ')}`);
        }
        
        return { ...data, validated: true };
    }
    
    getName() {
        return 'DataValidation';
    }
    
    getDescription() {
        return 'Valida dados de entrada conforme regras definidas';
    }
}

class DataTransformationStrategy extends ProcessingStrategy {
    constructor(transformations = {}) {
        super();
        this.transformations = transformations;
    }
    
    process(data, context) {
        console.log('🔄 Executando transformação de dados...');
        
        const transformed = { ...data };
        
        for (const [field, transformation] of Object.entries(this.transformations)) {
            if (transformed[field] !== undefined) {
                switch (transformation.type) {
                    case 'uppercase':
                        transformed[field] = transformed[field].toString().toUpperCase();
                        break;
                    case 'lowercase':
                        transformed[field] = transformed[field].toString().toLowerCase();
                        break;
                    case 'trim':
                        transformed[field] = transformed[field].toString().trim();
                        break;
                    case 'format':
                        if (transformation.formatter) {
                            transformed[field] = transformation.formatter(transformed[field]);
                        }
                        break;
                    case 'map':
                        if (transformation.mapping) {
                            transformed[field] = transformation.mapping[transformed[field]] || transformed[field];
                        }
                        break;
                }
            }
        }
        
        return { ...transformed, transformed: true };
    }
    
    getName() {
        return 'DataTransformation';
    }
    
    getDescription() {
        return 'Transforma dados conforme regras de transformação';
    }
}

class DataEnrichmentStrategy extends ProcessingStrategy {
    constructor(enrichers = []) {
        super();
        this.enrichers = enrichers;
    }
    
    async process(data, context) {
        console.log('✨ Executando enriquecimento de dados...');
        
        let enriched = { ...data };
        
        for (const enricher of this.enrichers) {
            try {
                const enrichment = await enricher(enriched, context);
                enriched = { ...enriched, ...enrichment };
            } catch (error) {
                console.warn(`Falha no enriquecimento: ${error.message}`);
            }
        }
        
        return { ...enriched, enriched: true };
    }
    
    getName() {
        return 'DataEnrichment';
    }
    
    getDescription() {
        return 'Enriquece dados com informações adicionais';
    }
}

// Decorator pattern para adicionar funcionalidades
class StrategyDecorator extends ProcessingStrategy {
    constructor(strategy) {
        super();
        this.strategy = strategy;
    }
    
    process(data, context) {
        return this.strategy.process(data, context);
    }
    
    getName() {
        return this.strategy.getName();
    }
    
    getDescription() {
        return this.strategy.getDescription();
    }
    
    getVersion() {
        return this.strategy.getVersion();
    }
}

class LoggingDecorator extends StrategyDecorator {
    async process(data, context) {
        const startTime = Date.now();
        console.log(`📝 [${this.getName()}] Iniciando processamento...`);
        
        try {
            const result = await this.strategy.process(data, context);
            const duration = Date.now() - startTime;
            console.log(`📝 [${this.getName()}] Concluído em ${duration}ms`);
            return result;
        } catch (error) {
            const duration = Date.now() - startTime;
            console.log(`📝 [${this.getName()}] Falhou em ${duration}ms: ${error.message}`);
            throw error;
        }
    }
}

class CachingDecorator extends StrategyDecorator {
    constructor(strategy, ttl = 300000) { // 5 minutos
        super(strategy);
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async process(data, context) {
        const key = this.generateCacheKey(data);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.ttl) {
            console.log(`💾 [${this.getName()}] Cache hit`);
            return cached.result;
        }
        
        console.log(`🔄 [${this.getName()}] Cache miss, processando...`);
        const result = await this.strategy.process(data, context);
        
        this.cache.set(key, {
            result,
            timestamp: Date.now()
        });
        
        return result;
    }
    
    generateCacheKey(data) {
        return JSON.stringify(data);
    }
    
    clearCache() {
        this.cache.clear();
        console.log(`🗑️ [${this.getName()}] Cache limpo`);
    }
}

class RetryDecorator extends StrategyDecorator {
    constructor(strategy, maxRetries = 3, delay = 1000) {
        super(strategy);
        this.maxRetries = maxRetries;
        this.delay = delay;
    }
    
    async process(data, context) {
        let lastError;
        
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                if (attempt > 1) {
                    console.log(`🔄 [${this.getName()}] Tentativa ${attempt}/${this.maxRetries}`);
                    await new Promise(resolve => setTimeout(resolve, this.delay * attempt));
                }
                
                return await this.strategy.process(data, context);
            } catch (error) {
                lastError = error;
                console.log(`❌ [${this.getName()}] Tentativa ${attempt} falhou: ${error.message}`);
            }
        }
        
        throw new Error(`Falha após ${this.maxRetries} tentativas: ${lastError.message}`);
    }
}

// Plugin base
class Plugin {
    constructor(name, version = '1.0.0') {
        this.name = name;
        this.version = version;
        this.enabled = true;
        this.dependencies = [];
        this.strategies = new Map();
        this.hooks = new Map();
    }
    
    // Registrar estratégia
    registerStrategy(name, strategy) {
        this.strategies.set(name, strategy);
        return this;
    }
    
    // Registrar hook
    registerHook(event, callback) {
        if (!this.hooks.has(event)) {
            this.hooks.set(event, []);
        }
        this.hooks.get(event).push(callback);
        return this;
    }
    
    // Inicializar plugin
    initialize(pluginManager) {
        console.log(`🔌 Inicializando plugin ${this.name} v${this.version}`);
        this.onInitialize(pluginManager);
    }
    
    // Finalizar plugin
    destroy() {
        console.log(`🔌 Finalizando plugin ${this.name}`);
        this.onDestroy();
    }
    
    // Hooks para subclasses
    onInitialize(pluginManager) {}
    onDestroy() {}
    
    // Verificar dependências
    checkDependencies(availablePlugins) {
        for (const dep of this.dependencies) {
            if (!availablePlugins.has(dep)) {
                throw new Error(`Plugin ${this.name} requer dependência: ${dep}`);
            }
        }
    }
}

// Facade para o sistema de plugins
class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.strategies = new Map();
        this.hooks = new Map();
        this.processingPipeline = [];
    }
    
    // Registrar plugin
    register(plugin) {
        if (this.plugins.has(plugin.name)) {
            throw new Error(`Plugin ${plugin.name} já está registrado`);
        }
        
        // Verificar dependências
        plugin.checkDependencies(this.plugins);
        
        // Registrar plugin
        this.plugins.set(plugin.name, plugin);
        
        // Registrar estratégias do plugin
        for (const [name, strategy] of plugin.strategies) {
            this.strategies.set(`${plugin.name}.${name}`, strategy);
        }
        
        // Registrar hooks do plugin
        for (const [event, callbacks] of plugin.hooks) {
            if (!this.hooks.has(event)) {
                this.hooks.set(event, []);
            }
            this.hooks.get(event).push(...callbacks);
        }
        
        // Inicializar plugin
        plugin.initialize(this);
        
        this.triggerHook('pluginRegistered', { plugin });
        
        return this;
    }
    
    // Desregistrar plugin
    unregister(pluginName) {
        const plugin = this.plugins.get(pluginName);
        if (!plugin) {
            throw new Error(`Plugin ${pluginName} não encontrado`);
        }
        
        // Finalizar plugin
        plugin.destroy();
        
        // Remover estratégias
        for (const strategyName of plugin.strategies.keys()) {
            this.strategies.delete(`${pluginName}.${strategyName}`);
        }
        
        // Remover hooks
        for (const [event, callbacks] of plugin.hooks) {
            const eventHooks = this.hooks.get(event);
            if (eventHooks) {
                callbacks.forEach(callback => {
                    const index = eventHooks.indexOf(callback);
                    if (index > -1) {
                        eventHooks.splice(index, 1);
                    }
                });
            }
        }
        
        // Remover plugin
        this.plugins.delete(pluginName);
        
        this.triggerHook('pluginUnregistered', { pluginName });
        
        return this;
    }
    
    // Obter estratégia
    getStrategy(name) {
        const strategy = this.strategies.get(name);
        if (!strategy) {
            throw new Error(`Estratégia ${name} não encontrada`);
        }
        return strategy;
    }
    
    // Configurar pipeline de processamento
    setPipeline(strategyNames) {
        this.processingPipeline = strategyNames.map(name => this.getStrategy(name));
        return this;
    }
    
    // Processar dados através do pipeline
    async process(data, context = {}) {
        this.triggerHook('processingStarted', { data, context });
        
        let result = data;
        
        for (const strategy of this.processingPipeline) {
            try {
                this.triggerHook('strategyStarted', { strategy, data: result });
                result = await strategy.process(result, context);
                this.triggerHook('strategyCompleted', { strategy, result });
            } catch (error) {
                this.triggerHook('strategyFailed', { strategy, error, data: result });
                throw error;
            }
        }
        
        this.triggerHook('processingCompleted', { result });
        
        return result;
    }
    
    // Disparar hooks
    triggerHook(event, data) {
        const callbacks = this.hooks.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Erro ao executar hook ${event}:`, error);
                }
            });
        }
    }
    
    // Listar plugins
    listPlugins() {
        return Array.from(this.plugins.values()).map(plugin => ({
            name: plugin.name,
            version: plugin.version,
            enabled: plugin.enabled,
            strategies: Array.from(plugin.strategies.keys())
        }));
    }
    
    // Listar estratégias
    listStrategies() {
        return Array.from(this.strategies.keys());
    }
}

// Plugins específicos
class ValidationPlugin extends Plugin {
    constructor() {
        super('validation', '1.0.0');
        
        // Registrar estratégias
        this.registerStrategy('basic', new DataValidationStrategy({
            name: { required: true, type: 'string', minLength: 2 },
            email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            age: { type: 'number' }
        }));
        
        this.registerStrategy('strict', new DataValidationStrategy({
            name: { required: true, type: 'string', minLength: 3 },
            email: { required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
            age: { required: true, type: 'number' },
            phone: { required: true, type: 'string', pattern: /^\+?[1-9]\d{1,14}$/ }
        }));
    }
}

class TransformationPlugin extends Plugin {
    constructor() {
        super('transformation', '1.0.0');
        
        // Registrar estratégias
        this.registerStrategy('normalize', new DataTransformationStrategy({
            name: { type: 'trim' },
            email: { type: 'lowercase' },
            country: { type: 'uppercase' }
        }));
        
        this.registerStrategy('format', new DataTransformationStrategy({
            name: { type: 'format', formatter: (name) => name.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ') },
            phone: { type: 'format', formatter: (phone) => phone.replace(/\D/g, '') }
        }));
    }
}

class EnrichmentPlugin extends Plugin {
    constructor() {
        super('enrichment', '1.0.0');
        
        // Registrar estratégias
        this.registerStrategy('basic', new DataEnrichmentStrategy([
            async (data) => ({ timestamp: new Date().toISOString() }),
            async (data) => ({ id: Math.random().toString(36).substr(2, 9) }),
            async (data) => ({ source: 'api' })
        ]));
        
        this.registerStrategy('geo', new DataEnrichmentStrategy([
            async (data) => {
                // Simular busca de geolocalização
                if (data.country) {
                    const geoData = {
                        'BR': { continent: 'South America', timezone: 'America/Sao_Paulo' },
                        'US': { continent: 'North America', timezone: 'America/New_York' },
                        'UK': { continent: 'Europe', timezone: 'Europe/London' }
                    };
                    return geoData[data.country] || {};
                }
                return {};
            }
        ]));
    }
}

// Demonstração do Sistema de Plugins
console.log('\n\n=== EXERCÍCIO 3: SISTEMA DE PLUGINS ===\n');

const pluginManager = new PluginManager();

// Registrar hooks globais
pluginManager.hooks.set('processingStarted', [(data) => {
    console.log('🚀 Iniciando processamento de dados...');
}]);

pluginManager.hooks.set('processingCompleted', [(data) => {
    console.log('✅ Processamento concluído!');
    console.log('📊 Resultado final:', JSON.stringify(data.result, null, 2));
}]);

// Registrar plugins
const validationPlugin = new ValidationPlugin();
const transformationPlugin = new TransformationPlugin();
const enrichmentPlugin = new EnrichmentPlugin();

pluginManager
    .register(validationPlugin)
    .register(transformationPlugin)
    .register(enrichmentPlugin);

// Aplicar decorators às estratégias
const loggedValidation = new LoggingDecorator(
    pluginManager.getStrategy('validation.basic')
);

const cachedTransformation = new CachingDecorator(
    new LoggingDecorator(pluginManager.getStrategy('transformation.normalize'))
);

const retryEnrichment = new RetryDecorator(
    new LoggingDecorator(pluginManager.getStrategy('enrichment.basic')),
    2,
    500
);

// Registrar estratégias decoradas
pluginManager.strategies.set('validation.logged', loggedValidation);
pluginManager.strategies.set('transformation.cached', cachedTransformation);
pluginManager.strategies.set('enrichment.retry', retryEnrichment);

// Configurar pipeline
pluginManager.setPipeline([
    'validation.logged',
    'transformation.cached',
    'enrichment.retry'
]);

// Processar dados
const testData = {
    name: '  joão silva  ',
    email: 'JOAO@EMAIL.COM',
    age: 30,
    country: 'BR'
};

console.log('📥 Dados de entrada:', JSON.stringify(testData, null, 2));

// Executar processamento
pluginManager.process(testData)
    .then(result => {
        console.log('\n🎉 Processamento bem-sucedido!');
    })
    .catch(error => {
        console.error('💥 Erro no processamento:', error.message);
    });

// Mostrar informações do sistema
setTimeout(() => {
    console.log('\n📋 Plugins registrados:');
    pluginManager.listPlugins().forEach(plugin => {
        console.log(`  • ${plugin.name} v${plugin.version} (${plugin.strategies.length} estratégias)`);
    });
    
    console.log('\n🔧 Estratégias disponíveis:');
    pluginManager.listStrategies().forEach(strategy => {
        console.log(`  • ${strategy}`);
    });
}, 1000);

/*
========================================
CONCEITOS APLICADOS
========================================

1. SINGLETON PATTERN:
   • Instância única do ConfigurationManager
   • Controle de acesso global
   • Lazy initialization
   • Thread safety considerations

2. FACTORY PATTERN:
   • Criação de diferentes tipos de configuração
   • Encapsulamento da lógica de criação
   • Extensibilidade para novos tipos
   • Validação durante criação

3. BUILDER PATTERN:
   • Construção fluente de configurações
   • Separação da construção da representação
   • Configuração step-by-step
   • Validação incremental

4. PROXY PATTERN:
   • Interceptação de acessos às configurações
   • Logging transparente
   • Controle de acesso
   • Lazy loading

5. OBSERVER PATTERN:
   • Notificação de mudanças
   • Desacoplamento entre publisher e subscribers
   • Event-driven architecture
   • Subscription management

6. COMMAND PATTERN:
   • Encapsulamento de operações
   • Undo/redo functionality
   • Queuing e scheduling
   • Retry logic

7. CHAIN OF RESPONSIBILITY:
   • Pipeline de processamento
   • Desacoplamento de handlers
   • Flexibilidade na ordem
   • Error handling distribuído

8. TEMPLATE METHOD:
   • Estrutura comum para notificações
   • Customização de steps específicos
   • Code reuse
   • Consistent interface

9. STRATEGY PATTERN:
   • Algoritmos intercambiáveis
   • Runtime strategy selection
   • Extensibilidade
   • Separation of concerns

10. DECORATOR PATTERN:
    • Extensão de funcionalidades
    • Composição dinâmica
    • Single responsibility
    • Open/closed principle

11. FACADE PATTERN:
    • Interface simplificada
    • Subsystem encapsulation
    • Reduced coupling
    • Ease of use

12. PLUGIN ARCHITECTURE:
    • Modular design
    • Runtime extensibility
    • Dependency management
    • Hot-swapping capabilities

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. DESIGN:
   • Separation of concerns
   • Single responsibility principle
   • Open/closed principle
   • Dependency inversion

2. ARQUITETURA:
   • Modular design
   • Plugin-based architecture
   • Event-driven communication
   • Layered structure

3. CÓDIGO:
   • Clean code principles
   • Error handling
   • Logging e monitoring
   • Documentation

4. PERFORMANCE:
   • Caching strategies
   • Lazy loading
   • Resource pooling
   • Efficient algorithms

5. MANUTENIBILIDADE:
   • Consistent interfaces
   • Extensible design
   • Configuration management
   • Version control

6. TESTABILIDADE:
   • Dependency injection
   • Mock-friendly design
   • Isolated components
   • Clear contracts

========================================
EXERCÍCIOS PROPOSTOS
========================================

BÁSICO:
1. Implementar um Logger usando Singleton
2. Criar um Factory para diferentes tipos de usuário
3. Usar Observer para sistema de eventos simples
4. Implementar Strategy para diferentes algoritmos de ordenação

INTERMEDIÁRIO:
5. Criar um sistema de cache com Decorator
6. Implementar Command pattern para operações de CRUD
7. Usar Template Method para diferentes relatórios
8. Criar um Facade para API complexa

AVANÇADO:
9. Implementar um framework MVC completo
10. Criar um sistema de workflow com Chain of Responsibility
11. Desenvolver um ORM usando múltiplos patterns
12. Implementar um sistema de plugins completo

========================================
FERRAMENTAS RECOMENDADAS
========================================

• UML Tools - Diagramação de patterns
• Design Pattern Libraries - Implementações prontas
• Code Analysis Tools - Detecção de anti-patterns
• Refactoring Tools - Aplicação de patterns
• Testing Frameworks - Teste de patterns
• Documentation Tools - Documentação de arquitetura

========================================
RECURSOS ADICIONAIS
========================================

• Gang of Four - Design Patterns book
• Refactoring Guru - Pattern explanations
• SourceMaking - Pattern examples
• JavaScript Patterns - JS-specific patterns
• Clean Code - Code quality principles
• Clean Architecture - Architectural patterns
*/

console.log('\n✅ EXERCÍCIOS DE DESIGN PATTERNS CONCLUÍDOS!');
console.log('🎯 Padrões cobertos:');
console.log('   • Singleton, Factory, Builder');
console.log('   • Proxy, Observer, Command');
console.log('   • Chain of Responsibility, Template Method');
console.log('   • Strategy, Decorator, Facade');
console.log('   • Plugin Architecture');
console.log('\n🚀 Continue praticando esses padrões em projetos reais!');
console.log('📚 Estude outros padrões como MVC, MVP, MVVM!');

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ConfigurationManager,
        NotificationCenter,
        PluginManager,
        ValidationPlugin,
        TransformationPlugin,
        EnrichmentPlugin
    };
}