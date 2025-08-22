/*
===========================================
    MÓDULO 07 - EVENTOS
    Aula 03: Custom Events (Eventos Customizados)
===========================================

Objetivos de Aprendizagem:
✓ Compreender a criação de eventos customizados
✓ Dominar o dispatch e escuta de eventos personalizados
✓ Implementar sistemas de comunicação entre componentes
✓ Desenvolver arquiteturas orientadas a eventos
✓ Criar padrões de pub/sub e observer
*/

// ===========================================
// 1. TEORIA: CUSTOM EVENTS
// ===========================================

/*
CUSTOM EVENTS (EVENTOS CUSTOMIZADOS):

1. CONCEITO:
   - Eventos criados pelo desenvolvedor, não nativos do browser
   - Permitem comunicação entre diferentes partes da aplicação
   - Seguem o mesmo padrão dos eventos nativos
   - Podem carregar dados customizados (detail)

2. CRIAÇÃO:
   - new CustomEvent(type, options)
   - new Event(type, options) - mais simples
   - document.createEvent() - método legado

3. DISPATCH:
   - element.dispatchEvent(event)
   - Pode ser disparado em qualquer EventTarget
   - Segue as mesmas fases (capturing, target, bubbling)

4. VANTAGENS:
   - Desacoplamento de componentes
   - Comunicação assíncrona
   - Reutilização de código
   - Arquitetura mais limpa
   - Facilita testes unitários

5. CASOS DE USO:
   - Comunicação entre componentes
   - Notificações de estado
   - Sistemas de plugins
   - Arquiteturas orientadas a eventos
   - Padrões pub/sub
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Criação Básica de Custom Events ---
console.log('=== CUSTOM EVENTS BÁSICOS ===');

const exemploBasico = {
    // Demonstração de criação e dispatch
    demonstrarCriacaoBasica() {
        console.log('=== CRIAÇÃO BÁSICA ===');
        
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        container.innerHTML = `
            <h3>Custom Events Básicos</h3>
            <button class="disparar-simples">Disparar Evento Simples</button>
            <button class="disparar-dados">Disparar com Dados</button>
            <button class="disparar-complexo">Disparar Evento Complexo</button>
            <div class="log-eventos"></div>
        `;
        
        const logElement = container.querySelector('.log-eventos');
        
        // Função para logar eventos
        const logarEvento = (mensagem) => {
            const p = document.createElement('p');
            p.textContent = `${new Date().toLocaleTimeString()}: ${mensagem}`;
            p.style.cssText = 'margin: 5px 0; padding: 5px; background: #f0f0f0;';
            logElement.appendChild(p);
            
            // Manter apenas os últimos 5 logs
            while (logElement.children.length > 5) {
                logElement.removeChild(logElement.firstChild);
            }
        };
        
        // === EVENTO SIMPLES ===
        container.querySelector('.disparar-simples').addEventListener('click', () => {
            // Criar evento simples
            const eventoSimples = new Event('meuEventoSimples');
            
            // Disparar o evento
            container.dispatchEvent(eventoSimples);
            
            console.log('Evento simples disparado');
        });
        
        // Escutar evento simples
        container.addEventListener('meuEventoSimples', (event) => {
            logarEvento('Evento simples recebido!');
            console.log('Evento simples capturado:', event);
        });
        
        // === EVENTO COM DADOS ===
        container.querySelector('.disparar-dados').addEventListener('click', () => {
            // Criar evento com dados customizados
            const eventoComDados = new CustomEvent('eventoComDados', {
                detail: {
                    usuario: 'João',
                    timestamp: Date.now(),
                    dados: { score: 100, level: 5 }
                },
                bubbles: true,
                cancelable: true
            });
            
            container.dispatchEvent(eventoComDados);
            console.log('Evento com dados disparado');
        });
        
        // Escutar evento com dados
        container.addEventListener('eventoComDados', (event) => {
            const { usuario, dados } = event.detail;
            logarEvento(`Dados recebidos: ${usuario}, Score: ${dados.score}`);
            console.log('Dados do evento:', event.detail);
        });
        
        // === EVENTO COMPLEXO ===
        container.querySelector('.disparar-complexo').addEventListener('click', () => {
            // Evento que pode ser cancelado
            const eventoComplexo = new CustomEvent('eventoComplexo', {
                detail: {
                    acao: 'salvar',
                    dados: { id: 123, nome: 'Teste' },
                    callback: (resultado) => {
                        logarEvento(`Callback executado: ${resultado}`);
                    }
                },
                bubbles: true,
                cancelable: true
            });
            
            // Verificar se o evento foi cancelado
            const foiCancelado = !container.dispatchEvent(eventoComplexo);
            
            if (foiCancelado) {
                logarEvento('Evento foi cancelado!');
            } else {
                logarEvento('Evento processado com sucesso!');
                // Executar callback se fornecido
                if (eventoComplexo.detail.callback) {
                    eventoComplexo.detail.callback('sucesso');
                }
            }
        });
        
        // Escutar evento complexo
        container.addEventListener('eventoComplexo', (event) => {
            const { acao, dados } = event.detail;
            
            logarEvento(`Ação: ${acao}, ID: ${dados.id}`);
            
            // Simular validação - cancelar se ID for inválido
            if (dados.id < 100) {
                event.preventDefault(); // Cancelar o evento
                logarEvento('Evento cancelado: ID inválido!');
            }
        });
        
        return container;
    },
    
    // Demonstração de propagação de custom events
    demonstrarPropagacao() {
        console.log('\n=== PROPAGAÇÃO DE CUSTOM EVENTS ===');
        
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 3px solid blue;
            margin: 10px;
        `;
        
        const meio = document.createElement('div');
        meio.style.cssText = `
            padding: 20px;
            border: 3px solid green;
            margin: 10px;
        `;
        
        const target = document.createElement('button');
        target.textContent = 'Disparar Custom Event';
        target.style.cssText = `
            padding: 10px;
            border: 3px solid red;
            background: yellow;
        `;
        
        container.innerHTML = '<h3>Propagação (veja o console)</h3>';
        meio.appendChild(target);
        container.appendChild(meio);
        
        // Listeners em diferentes níveis
        container.addEventListener('meuEventoCustom', (event) => {
            console.log('🔵 Container capturou:', event.detail);
        });
        
        meio.addEventListener('meuEventoCustom', (event) => {
            console.log('🟢 Meio capturou:', event.detail);
        });
        
        target.addEventListener('click', () => {
            const customEvent = new CustomEvent('meuEventoCustom', {
                detail: {
                    origem: 'botão',
                    mensagem: 'Olá do custom event!',
                    timestamp: new Date().toISOString()
                },
                bubbles: true // Permitir bubbling
            });
            
            console.log('🔴 Disparando custom event do botão');
            target.dispatchEvent(customEvent);
        });
        
        return container;
    }
};

// --- 2.2 Sistema de Comunicação entre Componentes ---
console.log('\n=== COMUNICAÇÃO ENTRE COMPONENTES ===');

class SistemaComunicacao {
    constructor() {
        this.eventBus = document.createElement('div'); // Event bus central
        this.componentes = new Map();
        this.logs = [];
    }
    
    // Registrar componente no sistema
    registrarComponente(nome, componente) {
        this.componentes.set(nome, componente);
        componente.eventBus = this.eventBus;
        componente.nome = nome;
        
        console.log(`Componente '${nome}' registrado`);
    }
    
    // Criar interface de demonstração
    criarInterface() {
        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        
        container.innerHTML = `
            <h3>Sistema de Comunicação entre Componentes</h3>
            <div class="componentes-container" style="display: flex; gap: 20px; margin: 20px 0;">
                <div class="componente-a"></div>
                <div class="componente-b"></div>
                <div class="componente-c"></div>
            </div>
            <div class="logs-container">
                <h4>Logs de Comunicação:</h4>
                <div class="logs" style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;"></div>
            </div>
        `;
        
        // Criar componentes
        const compA = new ComponenteA();
        const compB = new ComponenteB();
        const compC = new ComponenteC();
        
        // Registrar componentes
        this.registrarComponente('ComponenteA', compA);
        this.registrarComponente('ComponenteB', compB);
        this.registrarComponente('ComponenteC', compC);
        
        // Renderizar componentes
        compA.render(container.querySelector('.componente-a'));
        compB.render(container.querySelector('.componente-b'));
        compC.render(container.querySelector('.componente-c'));
        
        // Configurar logs
        this.logsElement = container.querySelector('.logs');
        this.configurarLogs();
        
        return container;
    }
    
    // Configurar sistema de logs
    configurarLogs() {
        // Interceptar todos os eventos customizados
        this.eventBus.addEventListener('componente:mensagem', (event) => {
            this.adicionarLog(`📨 ${event.detail.de} → ${event.detail.para}: ${event.detail.mensagem}`);
        });
        
        this.eventBus.addEventListener('componente:estado', (event) => {
            this.adicionarLog(`🔄 ${event.detail.componente} mudou estado: ${JSON.stringify(event.detail.estado)}`);
        });
        
        this.eventBus.addEventListener('componente:acao', (event) => {
            this.adicionarLog(`⚡ ${event.detail.componente} executou: ${event.detail.acao}`);
        });
    }
    
    // Adicionar log
    adicionarLog(mensagem) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${mensagem}`;
        
        this.logs.push(logEntry);
        
        const p = document.createElement('p');
        p.textContent = logEntry;
        p.style.cssText = 'margin: 2px 0; padding: 2px; font-size: 12px;';
        
        this.logsElement.appendChild(p);
        this.logsElement.scrollTop = this.logsElement.scrollHeight;
        
        // Manter apenas os últimos 50 logs
        while (this.logsElement.children.length > 50) {
            this.logsElement.removeChild(this.logsElement.firstChild);
        }
        
        console.log(logEntry);
    }
}

// Componente A - Contador
class ComponenteA {
    constructor() {
        this.contador = 0;
        this.estado = { ativo: true };
    }
    
    render(container) {
        container.style.cssText = `
            border: 2px solid #ff6b6b;
            padding: 15px;
            border-radius: 8px;
            background: #ffe0e0;
        `;
        
        container.innerHTML = `
            <h4>Componente A - Contador</h4>
            <div class="contador">Contador: ${this.contador}</div>
            <button class="incrementar">Incrementar</button>
            <button class="resetar">Resetar</button>
            <button class="notificar-b">Notificar B</button>
        `;
        
        this.contadorElement = container.querySelector('.contador');
        
        // Event listeners
        container.querySelector('.incrementar').addEventListener('click', () => {
            this.incrementar();
        });
        
        container.querySelector('.resetar').addEventListener('click', () => {
            this.resetar();
        });
        
        container.querySelector('.notificar-b').addEventListener('click', () => {
            this.notificarComponenteB();
        });
        
        // Escutar eventos de outros componentes
        this.eventBus.addEventListener('componente-b:solicitacao', (event) => {
            this.responderSolicitacao(event.detail);
        });
    }
    
    incrementar() {
        this.contador++;
        this.atualizarInterface();
        
        // Disparar evento de mudança de estado
        this.eventBus.dispatchEvent(new CustomEvent('componente:estado', {
            detail: {
                componente: this.nome,
                estado: { contador: this.contador }
            }
        }));
        
        // Notificar outros componentes se contador for múltiplo de 5
        if (this.contador % 5 === 0) {
            this.eventBus.dispatchEvent(new CustomEvent('componente-a:milestone', {
                detail: {
                    contador: this.contador,
                    milestone: true
                }
            }));
        }
    }
    
    resetar() {
        this.contador = 0;
        this.atualizarInterface();
        
        this.eventBus.dispatchEvent(new CustomEvent('componente:acao', {
            detail: {
                componente: this.nome,
                acao: 'resetar contador'
            }
        }));
    }
    
    notificarComponenteB() {
        this.eventBus.dispatchEvent(new CustomEvent('componente:mensagem', {
            detail: {
                de: this.nome,
                para: 'ComponenteB',
                mensagem: `Contador atual: ${this.contador}`,
                dados: { contador: this.contador }
            }
        }));
    }
    
    responderSolicitacao(solicitacao) {
        if (solicitacao.tipo === 'obter-contador') {
            this.eventBus.dispatchEvent(new CustomEvent('componente-a:resposta', {
                detail: {
                    solicitacaoId: solicitacao.id,
                    resposta: { contador: this.contador }
                }
            }));
        }
    }
    
    atualizarInterface() {
        if (this.contadorElement) {
            this.contadorElement.textContent = `Contador: ${this.contador}`;
        }
    }
}

// Componente B - Lista de Mensagens
class ComponenteB {
    constructor() {
        this.mensagens = [];
        this.proximoId = 1;
    }
    
    render(container) {
        container.style.cssText = `
            border: 2px solid #4ecdc4;
            padding: 15px;
            border-radius: 8px;
            background: #e0f7f7;
        `;
        
        container.innerHTML = `
            <h4>Componente B - Mensagens</h4>
            <div class="mensagens-lista" style="height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin: 10px 0;"></div>
            <button class="solicitar-contador">Solicitar Contador de A</button>
            <button class="broadcast">Broadcast para Todos</button>
        `;
        
        this.listaElement = container.querySelector('.mensagens-lista');
        
        // Event listeners
        container.querySelector('.solicitar-contador').addEventListener('click', () => {
            this.solicitarContador();
        });
        
        container.querySelector('.broadcast').addEventListener('click', () => {
            this.fazerBroadcast();
        });
        
        // Escutar eventos
        this.eventBus.addEventListener('componente:mensagem', (event) => {
            if (event.detail.para === this.nome || event.detail.para === 'todos') {
                this.receberMensagem(event.detail);
            }
        });
        
        this.eventBus.addEventListener('componente-a:milestone', (event) => {
            this.adicionarMensagem(`🎉 Componente A atingiu milestone: ${event.detail.contador}`);
        });
        
        this.eventBus.addEventListener('componente-a:resposta', (event) => {
            this.processarResposta(event.detail);
        });
    }
    
    receberMensagem(mensagem) {
        this.adicionarMensagem(`📨 De ${mensagem.de}: ${mensagem.mensagem}`);
    }
    
    adicionarMensagem(texto) {
        this.mensagens.push({
            id: this.proximoId++,
            texto,
            timestamp: new Date()
        });
        
        this.atualizarInterface();
    }
    
    solicitarContador() {
        const solicitacaoId = `req_${Date.now()}`;
        
        this.eventBus.dispatchEvent(new CustomEvent('componente-b:solicitacao', {
            detail: {
                id: solicitacaoId,
                tipo: 'obter-contador',
                de: this.nome
            }
        }));
        
        this.adicionarMensagem('🔄 Solicitando contador do Componente A...');
    }
    
    processarResposta(resposta) {
        this.adicionarMensagem(`✅ Resposta recebida: Contador = ${resposta.resposta.contador}`);
    }
    
    fazerBroadcast() {
        this.eventBus.dispatchEvent(new CustomEvent('componente:mensagem', {
            detail: {
                de: this.nome,
                para: 'todos',
                mensagem: 'Mensagem broadcast para todos os componentes!',
                timestamp: new Date().toISOString()
            }
        }));
    }
    
    atualizarInterface() {
        if (this.listaElement) {
            this.listaElement.innerHTML = '';
            
            this.mensagens.slice(-10).forEach(mensagem => {
                const div = document.createElement('div');
                div.textContent = mensagem.texto;
                div.style.cssText = 'font-size: 12px; margin: 2px 0; padding: 2px;';
                this.listaElement.appendChild(div);
            });
            
            this.listaElement.scrollTop = this.listaElement.scrollHeight;
        }
    }
}

// Componente C - Status e Controle
class ComponenteC {
    constructor() {
        this.status = 'ativo';
        this.estatisticas = {
            mensagensRecebidas: 0,
            eventosProcessados: 0
        };
    }
    
    render(container) {
        container.style.cssText = `
            border: 2px solid #ffa726;
            padding: 15px;
            border-radius: 8px;
            background: #fff3e0;
        `;
        
        container.innerHTML = `
            <h4>Componente C - Status</h4>
            <div class="status">Status: ${this.status}</div>
            <div class="stats">
                <div>Mensagens: ${this.estatisticas.mensagensRecebidas}</div>
                <div>Eventos: ${this.estatisticas.eventosProcessados}</div>
            </div>
            <button class="toggle-status">Toggle Status</button>
            <button class="limpar-stats">Limpar Stats</button>
        `;
        
        this.statusElement = container.querySelector('.status');
        this.statsElement = container.querySelector('.stats');
        
        // Event listeners
        container.querySelector('.toggle-status').addEventListener('click', () => {
            this.toggleStatus();
        });
        
        container.querySelector('.limpar-stats').addEventListener('click', () => {
            this.limparEstatisticas();
        });
        
        // Escutar TODOS os eventos para estatísticas
        this.eventBus.addEventListener('componente:mensagem', (event) => {
            this.estatisticas.mensagensRecebidas++;
            this.atualizarInterface();
        });
        
        ['componente:estado', 'componente:acao', 'componente-a:milestone'].forEach(tipo => {
            this.eventBus.addEventListener(tipo, (event) => {
                this.estatisticas.eventosProcessados++;
                this.atualizarInterface();
            });
        });
    }
    
    toggleStatus() {
        this.status = this.status === 'ativo' ? 'inativo' : 'ativo';
        
        this.eventBus.dispatchEvent(new CustomEvent('componente:estado', {
            detail: {
                componente: this.nome,
                estado: { status: this.status }
            }
        }));
        
        this.atualizarInterface();
    }
    
    limparEstatisticas() {
        this.estatisticas = {
            mensagensRecebidas: 0,
            eventosProcessados: 0
        };
        
        this.eventBus.dispatchEvent(new CustomEvent('componente:acao', {
            detail: {
                componente: this.nome,
                acao: 'limpar estatísticas'
            }
        }));
        
        this.atualizarInterface();
    }
    
    atualizarInterface() {
        if (this.statusElement) {
            this.statusElement.textContent = `Status: ${this.status}`;
        }
        
        if (this.statsElement) {
            this.statsElement.innerHTML = `
                <div>Mensagens: ${this.estatisticas.mensagensRecebidas}</div>
                <div>Eventos: ${this.estatisticas.eventosProcessados}</div>
            `;
        }
    }
}

// Exemplo de uso do sistema de comunicação
const sistemaComunicacao = new SistemaComunicacao();
console.log('Sistema de comunicação entre componentes criado!');

// --- 2.3 Padrão Publisher/Subscriber ---
console.log('\n=== PADRÃO PUBLISHER/SUBSCRIBER ===');

class EventPublisher {
    constructor() {
        this.subscribers = new Map();
        this.eventHistory = [];
        this.maxHistory = 100;
    }
    
    // Inscrever-se em um evento
    subscribe(eventType, callback, options = {}) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        
        const subscription = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            callback,
            options: {
                once: false,
                priority: 0,
                filter: null,
                ...options
            },
            createdAt: new Date()
        };
        
        this.subscribers.get(eventType).push(subscription);
        
        // Ordenar por prioridade (maior prioridade primeiro)
        this.subscribers.get(eventType).sort((a, b) => b.options.priority - a.options.priority);
        
        console.log(`Inscrito no evento '${eventType}' com ID: ${subscription.id}`);
        
        // Retornar função de unsubscribe
        return () => this.unsubscribe(eventType, subscription.id);
    }
    
    // Cancelar inscrição
    unsubscribe(eventType, subscriptionId) {
        if (!this.subscribers.has(eventType)) return false;
        
        const subscribers = this.subscribers.get(eventType);
        const index = subscribers.findIndex(sub => sub.id === subscriptionId);
        
        if (index !== -1) {
            subscribers.splice(index, 1);
            console.log(`Inscrição cancelada: ${subscriptionId}`);
            return true;
        }
        
        return false;
    }
    
    // Publicar evento
    publish(eventType, data = null, options = {}) {
        const event = {
            type: eventType,
            data,
            timestamp: new Date(),
            id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            options: {
                async: false,
                cancelable: true,
                ...options
            }
        };
        
        // Adicionar ao histórico
        this.eventHistory.push(event);
        if (this.eventHistory.length > this.maxHistory) {
            this.eventHistory.shift();
        }
        
        console.log(`Publicando evento '${eventType}':`, data);
        
        if (!this.subscribers.has(eventType)) {
            console.log(`Nenhum subscriber para '${eventType}'`);
            return event;
        }
        
        const subscribers = [...this.subscribers.get(eventType)];
        let cancelled = false;
        
        const processSubscriber = (subscription) => {
            try {
                // Aplicar filtro se existir
                if (subscription.options.filter && !subscription.options.filter(event)) {
                    return;
                }
                
                // Criar contexto do evento
                const eventContext = {
                    ...event,
                    preventDefault: () => {
                        if (event.options.cancelable) {
                            cancelled = true;
                        }
                    },
                    stopPropagation: () => {
                        cancelled = true;
                    }
                };
                
                // Executar callback
                const result = subscription.callback(eventContext);
                
                // Remover se for 'once'
                if (subscription.options.once) {
                    this.unsubscribe(eventType, subscription.id);
                }
                
                return result;
            } catch (error) {
                console.error(`Erro no subscriber ${subscription.id}:`, error);
            }
        };
        
        if (event.options.async) {
            // Execução assíncrona
            Promise.all(subscribers.map(sub => 
                Promise.resolve(processSubscriber(sub))
            )).catch(error => {
                console.error('Erro na execução assíncrona:', error);
            });
        } else {
            // Execução síncrona
            for (const subscription of subscribers) {
                if (cancelled) break;
                processSubscriber(subscription);
            }
        }
        
        event.cancelled = cancelled;
        return event;
    }
    
    // Obter estatísticas
    getStats() {
        const stats = {
            totalEventTypes: this.subscribers.size,
            totalSubscribers: 0,
            eventHistory: this.eventHistory.length,
            subscribersByType: {}
        };
        
        for (const [eventType, subscribers] of this.subscribers) {
            stats.totalSubscribers += subscribers.length;
            stats.subscribersByType[eventType] = subscribers.length;
        }
        
        return stats;
    }
    
    // Limpar histórico
    clearHistory() {
        this.eventHistory = [];
    }
    
    // Obter histórico de eventos
    getHistory(eventType = null, limit = 10) {
        let history = this.eventHistory;
        
        if (eventType) {
            history = history.filter(event => event.type === eventType);
        }
        
        return history.slice(-limit);
    }
}

// Exemplo de uso do Publisher/Subscriber
const exemploPublisher = {
    demonstrarPubSub() {
        console.log('=== DEMONSTRAÇÃO PUB/SUB ===');
        
        const publisher = new EventPublisher();
        
        // === SUBSCRIBERS BÁSICOS ===
        
        // Subscriber simples
        const unsubscribe1 = publisher.subscribe('user:login', (event) => {
            console.log(`👤 Usuário logado:`, event.data);
        });
        
        // Subscriber com prioridade alta
        publisher.subscribe('user:login', (event) => {
            console.log(`🔐 Validando login...`);
            // Este será executado primeiro devido à prioridade
        }, { priority: 10 });
        
        // Subscriber que executa apenas uma vez
        publisher.subscribe('user:login', (event) => {
            console.log(`🎉 Primeiro login detectado!`);
        }, { once: true });
        
        // Subscriber com filtro
        publisher.subscribe('user:login', (event) => {
            console.log(`👑 Admin logado:`, event.data.username);
        }, {
            filter: (event) => event.data && event.data.role === 'admin'
        });
        
        // === PUBLICAR EVENTOS ===
        
        // Login de usuário normal
        publisher.publish('user:login', {
            username: 'joao',
            role: 'user',
            timestamp: new Date()
        });
        
        console.log('---');
        
        // Login de admin
        publisher.publish('user:login', {
            username: 'admin',
            role: 'admin',
            timestamp: new Date()
        });
        
        console.log('---');
        
        // Terceiro login (subscriber 'once' não será executado)
        publisher.publish('user:login', {
            username: 'maria',
            role: 'user',
            timestamp: new Date()
        });
        
        // === EVENTOS CANCELÁVEIS ===
        
        publisher.subscribe('user:delete', (event) => {
            if (event.data.username === 'admin') {
                console.log('❌ Bloqueando exclusão do admin');
                event.preventDefault();
            }
        }, { priority: 100 });
        
        publisher.subscribe('user:delete', (event) => {
            console.log(`🗑️ Excluindo usuário: ${event.data.username}`);
        });
        
        // Tentar excluir usuário normal
        const evento1 = publisher.publish('user:delete', { username: 'joao' });
        console.log('Evento cancelado?', evento1.cancelled);
        
        // Tentar excluir admin
        const evento2 = publisher.publish('user:delete', { username: 'admin' });
        console.log('Evento cancelado?', evento2.cancelled);
        
        // === ESTATÍSTICAS ===
        console.log('\nEstatísticas:', publisher.getStats());
        console.log('Histórico:', publisher.getHistory());
        
        // Cancelar inscrição
        unsubscribe1();
        
        return publisher;
    }
};

// Executar demonstração
const publisherDemo = exemploPublisher.demonstrarPubSub();

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Notificações ---
console.log('\n=== EXERCÍCIO 1: SISTEMA DE NOTIFICAÇÕES ===');

class SistemaNotificacoes {
    constructor(container, opcoes = {}) {
        this.container = container;
        this.opcoes = {
            maxNotificacoes: 5,
            duracaoDefault: 5000,
            posicao: 'top-right',
            animacoes: true,
            ...opcoes
        };
        
        this.notificacoes = [];
        this.proximoId = 1;
        this.publisher = new EventPublisher();
        
        this.criarInterface();
        this.configurarEventos();
    }
    
    // Criar interface
    criarInterface() {
        this.container.style.cssText = `
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        
        this.container.innerHTML = `
            <div class="notificacoes-header">
                <h3>Sistema de Notificações com Custom Events</h3>
                <div class="controles">
                    <button class="criar-sucesso">Sucesso</button>
                    <button class="criar-erro">Erro</button>
                    <button class="criar-aviso">Aviso</button>
                    <button class="criar-info">Info</button>
                    <button class="criar-personalizada">Personalizada</button>
                    <button class="limpar-todas">Limpar Todas</button>
                </div>
            </div>
            <div class="notificacoes-container" style="position: relative; min-height: 200px;"></div>
            <div class="logs-notificacoes" style="margin-top: 20px;">
                <h4>Logs de Eventos:</h4>
                <div class="logs" style="height: 150px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; font-size: 12px;"></div>
            </div>
        `;
        
        this.notificacoesContainer = this.container.querySelector('.notificacoes-container');
        this.logsContainer = this.container.querySelector('.logs');
    }
    
    // Configurar eventos
    configurarEventos() {
        // Eventos dos botões
        this.container.querySelector('.criar-sucesso').addEventListener('click', () => {
            this.criarNotificacao('sucesso', 'Operação realizada com sucesso!');
        });
        
        this.container.querySelector('.criar-erro').addEventListener('click', () => {
            this.criarNotificacao('erro', 'Ocorreu um erro na operação!');
        });
        
        this.container.querySelector('.criar-aviso').addEventListener('click', () => {
            this.criarNotificacao('aviso', 'Atenção: Esta ação não pode ser desfeita!');
        });
        
        this.container.querySelector('.criar-info').addEventListener('click', () => {
            this.criarNotificacao('info', 'Nova atualização disponível.');
        });
        
        this.container.querySelector('.criar-personalizada').addEventListener('click', () => {
            this.criarNotificacaoPersonalizada();
        });
        
        this.container.querySelector('.limpar-todas').addEventListener('click', () => {
            this.limparTodasNotificacoes();
        });
        
        // Subscribers para eventos de notificação
        this.publisher.subscribe('notificacao:criada', (event) => {
            this.adicionarLog(`✨ Notificação criada: ${event.data.tipo} - ${event.data.mensagem}`);
            this.renderizarNotificacao(event.data);
        });
        
        this.publisher.subscribe('notificacao:removida', (event) => {
            this.adicionarLog(`🗑️ Notificação removida: ID ${event.data.id}`);
            this.removerElementoNotificacao(event.data.id);
        });
        
        this.publisher.subscribe('notificacao:clicada', (event) => {
            this.adicionarLog(`👆 Notificação clicada: ID ${event.data.id}`);
        });
        
        this.publisher.subscribe('notificacao:expirada', (event) => {
            this.adicionarLog(`⏰ Notificação expirada: ID ${event.data.id}`);
        });
    }
    
    // Criar notificação
    criarNotificacao(tipo, mensagem, opcoes = {}) {
        const notificacao = {
            id: this.proximoId++,
            tipo,
            mensagem,
            timestamp: new Date(),
            duracao: opcoes.duracao || this.opcoes.duracaoDefault,
            clicavel: opcoes.clicavel !== false,
            ...opcoes
        };
        
        // Verificar limite de notificações
        if (this.notificacoes.length >= this.opcoes.maxNotificacoes) {
            const maisAntiga = this.notificacoes.shift();
            this.removerNotificacao(maisAntiga.id, 'limite_atingido');
        }
        
        this.notificacoes.push(notificacao);
        
        // Publicar evento
        this.publisher.publish('notificacao:criada', notificacao);
        
        // Configurar auto-remoção
        if (notificacao.duracao > 0) {
            setTimeout(() => {
                this.removerNotificacao(notificacao.id, 'expirada');
            }, notificacao.duracao);
        }
        
        return notificacao;
    }
    
    // Criar notificação personalizada
    criarNotificacaoPersonalizada() {
        const mensagem = prompt('Mensagem da notificação:');
        if (!mensagem) return;
        
        const tipo = prompt('Tipo (sucesso, erro, aviso, info):') || 'info';
        const duracao = parseInt(prompt('Duração em ms (0 = permanente):')) || 5000;
        
        this.criarNotificacao(tipo, mensagem, { duracao });
    }
    
    // Renderizar notificação
    renderizarNotificacao(notificacao) {
        const elemento = document.createElement('div');
        elemento.className = `notificacao notificacao-${notificacao.tipo}`;
        elemento.dataset.id = notificacao.id;
        
        const cores = {
            sucesso: { bg: '#d4edda', border: '#c3e6cb', text: '#155724' },
            erro: { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' },
            aviso: { bg: '#fff3cd', border: '#ffeaa7', text: '#856404' },
            info: { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' }
        };
        
        const cor = cores[notificacao.tipo] || cores.info;
        
        elemento.style.cssText = `
            background: ${cor.bg};
            border: 1px solid ${cor.border};
            color: ${cor.text};
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 4px;
            position: relative;
            cursor: ${notificacao.clicavel ? 'pointer' : 'default'};
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateX(100%);
        `;
        
        elemento.innerHTML = `
            <div class="notificacao-content">
                <div class="notificacao-tipo">${notificacao.tipo.toUpperCase()}</div>
                <div class="notificacao-mensagem">${notificacao.mensagem}</div>
                <div class="notificacao-timestamp">${notificacao.timestamp.toLocaleTimeString()}</div>
            </div>
            <button class="notificacao-fechar" style="position: absolute; top: 5px; right: 5px; background: none; border: none; font-size: 16px; cursor: pointer;">×</button>
        `;
        
        // Event listeners
        if (notificacao.clicavel) {
            elemento.addEventListener('click', (event) => {
                if (!event.target.matches('.notificacao-fechar')) {
                    this.publisher.publish('notificacao:clicada', notificacao);
                }
            });
        }
        
        elemento.querySelector('.notificacao-fechar').addEventListener('click', (event) => {
            event.stopPropagation();
            this.removerNotificacao(notificacao.id, 'manual');
        });
        
        this.notificacoesContainer.appendChild(elemento);
        
        // Animar entrada
        if (this.opcoes.animacoes) {
            requestAnimationFrame(() => {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateX(0)';
            });
        }
    }
    
    // Remover notificação
    removerNotificacao(id, motivo = 'manual') {
        const index = this.notificacoes.findIndex(n => n.id === id);
        if (index === -1) return;
        
        const notificacao = this.notificacoes.splice(index, 1)[0];
        
        // Publicar evento baseado no motivo
        if (motivo === 'expirada') {
            this.publisher.publish('notificacao:expirada', notificacao);
        }
        
        this.publisher.publish('notificacao:removida', { ...notificacao, motivo });
    }
    
    // Remover elemento da interface
    removerElementoNotificacao(id) {
        const elemento = this.notificacoesContainer.querySelector(`[data-id="${id}"]`);
        if (!elemento) return;
        
        if (this.opcoes.animacoes) {
            elemento.style.transition = 'all 0.3s ease';
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (elemento.parentNode) {
                    elemento.parentNode.removeChild(elemento);
                }
            }, 300);
        } else {
            elemento.parentNode.removeChild(elemento);
        }
    }
    
    // Limpar todas as notificações
    limparTodasNotificacoes() {
        const notificacoesParaRemover = [...this.notificacoes];
        
        notificacoesParaRemover.forEach(notificacao => {
            this.removerNotificacao(notificacao.id, 'limpeza');
        });
        
        this.adicionarLog('🧹 Todas as notificações foram removidas');
    }
    
    // Adicionar log
    adicionarLog(mensagem) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${mensagem}`;
        
        const p = document.createElement('p');
        p.textContent = logEntry;
        p.style.cssText = 'margin: 2px 0; padding: 2px;';
        
        this.logsContainer.appendChild(p);
        this.logsContainer.scrollTop = this.logsContainer.scrollHeight;
        
        // Manter apenas os últimos 20 logs
        while (this.logsContainer.children.length > 20) {
            this.logsContainer.removeChild(this.logsContainer.firstChild);
        }
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        return {
            notificacoesAtivas: this.notificacoes.length,
            totalCriadas: this.proximoId - 1,
            porTipo: this.notificacoes.reduce((acc, n) => {
                acc[n.tipo] = (acc[n.tipo] || 0) + 1;
                return acc;
            }, {}),
            eventStats: this.publisher.getStats()
        };
    }
}

// Exemplo de uso do sistema de notificações
console.log('Sistema de notificações criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasCustomEvents = {
    // Performance
    performance: {
        // Pool de eventos para reutilização
        criarPoolEventos() {
            console.log('=== POOL DE EVENTOS ===');
            
            class EventPool {
                constructor(maxSize = 50) {
                    this.pool = [];
                    this.maxSize = maxSize;
                    this.created = 0;
                    this.reused = 0;
                }
                
                // Obter evento do pool ou criar novo
                getEvent(type, detail = null) {
                    let event;
                    
                    if (this.pool.length > 0) {
                        event = this.pool.pop();
                        this.reused++;
                        
                        // Resetar propriedades
                        Object.defineProperty(event, 'type', { value: type, configurable: true });
                        Object.defineProperty(event, 'detail', { value: detail, configurable: true });
                    } else {
                        event = new CustomEvent(type, { detail });
                        this.created++;
                    }
                    
                    return event;
                }
                
                // Retornar evento para o pool
                releaseEvent(event) {
                    if (this.pool.length < this.maxSize) {
                        // Limpar referências
                        Object.defineProperty(event, 'detail', { value: null, configurable: true });
                        this.pool.push(event);
                    }
                }
                
                // Estatísticas
                getStats() {
                    return {
                        poolSize: this.pool.length,
                        created: this.created,
                        reused: this.reused,
                        reuseRate: this.reused / (this.created + this.reused) * 100
                    };
                }
            }
            
            const eventPool = new EventPool();
            
            // Exemplo de uso
            const element = document.createElement('div');
            
            for (let i = 0; i < 100; i++) {
                const event = eventPool.getEvent('test-event', { index: i });
                element.dispatchEvent(event);
                eventPool.releaseEvent(event);
            }
            
            console.log('Estatísticas do pool:', eventPool.getStats());
        },
        
        // Debouncing para eventos frequentes
        debounceEventos() {
            console.log('\n=== DEBOUNCE DE EVENTOS ===');
            
            class DebouncedEventDispatcher {
                constructor(element) {
                    this.element = element;
                    this.pendingEvents = new Map();
                }
                
                // Disparar evento com debounce
                dispatchDebounced(eventType, detail, delay = 100) {
                    // Cancelar evento pendente
                    if (this.pendingEvents.has(eventType)) {
                        clearTimeout(this.pendingEvents.get(eventType));
                    }
                    
                    // Agendar novo evento
                    const timeoutId = setTimeout(() => {
                        const event = new CustomEvent(eventType, { detail });
                        this.element.dispatchEvent(event);
                        this.pendingEvents.delete(eventType);
                    }, delay);
                    
                    this.pendingEvents.set(eventType, timeoutId);
                }
                
                // Limpar todos os eventos pendentes
                clear() {
                    for (const timeoutId of this.pendingEvents.values()) {
                        clearTimeout(timeoutId);
                    }
                    this.pendingEvents.clear();
                }
            }
            
            console.log('Use debounce para eventos que podem ser disparados frequentemente');
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Limpeza automática de listeners
        limpezaAutomatica() {
            console.log('\n=== LIMPEZA AUTOMÁTICA ===');
            
            class AutoCleanupEventTarget {
                constructor() {
                    this.element = document.createElement('div');
                    this.listeners = new Set();
                    this.abortController = new AbortController();
                }
                
                addEventListener(type, listener, options = {}) {
                    // Adicionar signal do AbortController
                    const finalOptions = {
                        ...options,
                        signal: this.abortController.signal
                    };
                    
                    this.element.addEventListener(type, listener, finalOptions);
                    this.listeners.add({ type, listener, options: finalOptions });
                }
                
                dispatchEvent(event) {
                    return this.element.dispatchEvent(event);
                }
                
                // Limpar todos os listeners
                cleanup() {
                    this.abortController.abort();
                    this.listeners.clear();
                    console.log('Todos os listeners foram removidos automaticamente');
                }
                
                // Obter estatísticas
                getListenerCount() {
                    return this.listeners.size;
                }
            }
            
            console.log('Use AbortController para limpeza automática de listeners');
        }
    },
    
    // Debugging
    debugging: {
        // Rastreamento de eventos customizados
        rastreamentoEventos() {
            console.log('\n=== RASTREAMENTO DE EVENTOS ===');
            
            class EventTracker {
                constructor() {
                    this.events = [];
                    this.maxEvents = 1000;
                }
                
                // Interceptar dispatchEvent
                wrapElement(element, name = 'element') {
                    const originalDispatch = element.dispatchEvent;
                    
                    element.dispatchEvent = (event) => {
                        // Registrar evento
                        this.events.push({
                            element: name,
                            type: event.type,
                            detail: event.detail,
                            timestamp: new Date(),
                            bubbles: event.bubbles,
                            cancelable: event.cancelable
                        });
                        
                        // Manter limite
                        if (this.events.length > this.maxEvents) {
                            this.events.shift();
                        }
                        
                        console.log(`🎯 [${name}] Disparando evento:`, event.type, event.detail);
                        
                        return originalDispatch.call(element, event);
                    };
                    
                    return element;
                }
                
                // Obter relatório
                getReport() {
                    const report = {
                        totalEvents: this.events.length,
                        eventTypes: {},
                        recentEvents: this.events.slice(-10)
                    };
                    
                    this.events.forEach(event => {
                        report.eventTypes[event.type] = (report.eventTypes[event.type] || 0) + 1;
                    });
                    
                    return report;
                }
            }
            
            console.log('Use EventTracker para monitorar eventos em desenvolvimento');
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referenciasCustomEvents = {
    documentacao: [
        'MDN - CustomEvent: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent',
        'MDN - Creating and triggering events: https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events',
        'MDN - EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget',
        'MDN - Event: https://developer.mozilla.org/en-US/docs/Web/API/Event'
    ],
    
    proximosTopicos: [
        '04-event-handling.js - Padrões avançados de manipulação de eventos',
        '08-Assincronismo - Eventos assíncronos e Promises',
        '10-Padroes - Observer pattern e outros padrões de design',
        '11-Qualidade - Testes de eventos e debugging'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de undo/redo com eventos',
        'Criar sistema de plugins baseado em eventos',
        'Desenvolver arquitetura de micro-frontends com eventos',
        'Construir sistema de analytics com custom events'
    ]
};

console.log('Referências:', referenciasCustomEvents.documentacao);
console.log('Próximos tópicos:', referenciasCustomEvents.proximosTopicos);
console.log('Exercícios adicionais:', referenciasCustomEvents.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - CUSTOM EVENTS
===========================================

✅ CONCEITOS APRENDIDOS:
• Criação de eventos customizados
• Dispatch e escuta de eventos personalizados
• Comunicação entre componentes
• Padrão Publisher/Subscriber
• Arquiteturas orientadas a eventos

✅ TÉCNICAS DOMINADAS:
• CustomEvent e Event APIs
• Event delegation com custom events
• Sistemas de comunicação desacoplados
• Pool de eventos para performance
• Debugging e rastreamento de eventos

✅ PROJETOS DESENVOLVIDOS:
• Sistema de comunicação entre componentes
• Publisher/Subscriber completo
• Sistema de notificações avançado

🎯 PRÓXIMO PASSO:
Continue para 04-event-handling.js para aprender
padrões avançados de manipulação de eventos!

===========================================
*/