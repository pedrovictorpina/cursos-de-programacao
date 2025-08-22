/*
========================================
EXERCÍCIOS PRÁTICOS - SISTEMA DE EVENTOS
========================================

Este arquivo contém 3 exercícios práticos para fixar os conceitos
de sistema de eventos em JavaScript:

1. Sistema de Notificações (Básico)
2. Gerenciador de Eventos Customizado (Intermediário)
3. Sistema de Comunicação entre Componentes (Avançado)

Cada exercício inclui:
• Implementação completa
• Explicações detalhadas
• Testes e demonstrações
• Conceitos aplicados
• Exercícios propostos

*/

console.log('🎯 EXERCÍCIOS PRÁTICOS - SISTEMA DE EVENTOS');
console.log('=' .repeat(50));

/*
========================================
EXERCÍCIO 1: SISTEMA DE NOTIFICAÇÕES
========================================

Objetivo: Criar um sistema completo de notificações que permite
exibir diferentes tipos de mensagens (sucesso, erro, aviso, info)
com animações, auto-dismiss e controle manual.

Conceitos aplicados:
• Event listeners
• Custom events
• DOM manipulation
• CSS animations
• Timer management
• Event delegation
*/

console.log('\n📢 EXERCÍCIO 1: Sistema de Notificações');

const SistemaNotificacoes = (() => {
    
    // Configurações padrão
    const CONFIG_PADRAO = {
        duracao: 5000,
        posicao: 'top-right',
        animacao: 'slide',
        maxNotificacoes: 5,
        permitirDuplicatas: false
    };
    
    // Tipos de notificação
    const TIPOS = {
        SUCESSO: 'success',
        ERRO: 'error',
        AVISO: 'warning',
        INFO: 'info'
    };
    
    // Estado interno
    let notificacoes = [];
    let container = null;
    let configuracao = { ...CONFIG_PADRAO };
    let contadorId = 0;
    
    // Estilos CSS para as notificações
    const estilos = `
        .notificacao-container {
            position: fixed;
            z-index: 10000;
            pointer-events: none;
            max-width: 400px;
        }
        
        .notificacao-container.top-right {
            top: 20px;
            right: 20px;
        }
        
        .notificacao-container.top-left {
            top: 20px;
            left: 20px;
        }
        
        .notificacao-container.bottom-right {
            bottom: 20px;
            right: 20px;
        }
        
        .notificacao-container.bottom-left {
            bottom: 20px;
            left: 20px;
        }
        
        .notificacao {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            padding: 16px;
            pointer-events: auto;
            position: relative;
            overflow: hidden;
            min-width: 300px;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        
        .notificacao.show {
            transform: translateX(0);
        }
        
        .notificacao.hide {
            transform: translateX(100%);
            opacity: 0;
        }
        
        .notificacao.success {
            border-left: 4px solid #10b981;
        }
        
        .notificacao.error {
            border-left: 4px solid #ef4444;
        }
        
        .notificacao.warning {
            border-left: 4px solid #f59e0b;
        }
        
        .notificacao.info {
            border-left: 4px solid #3b82f6;
        }
        
        .notificacao-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .notificacao-titulo {
            font-weight: bold;
            font-size: 14px;
            color: #1f2937;
        }
        
        .notificacao-fechar {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #6b7280;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notificacao-fechar:hover {
            color: #374151;
        }
        
        .notificacao-mensagem {
            font-size: 13px;
            color: #4b5563;
            line-height: 1.4;
        }
        
        .notificacao-progresso {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(0,0,0,0.1);
            transition: width linear;
        }
        
        .notificacao.success .notificacao-progresso {
            background: #10b981;
        }
        
        .notificacao.error .notificacao-progresso {
            background: #ef4444;
        }
        
        .notificacao.warning .notificacao-progresso {
            background: #f59e0b;
        }
        
        .notificacao.info .notificacao-progresso {
            background: #3b82f6;
        }
    `;
    
    // Inicializar sistema
    function inicializar(opcoes = {}) {
        configuracao = { ...CONFIG_PADRAO, ...opcoes };
        
        // Criar container se não existir
        if (!container) {
            criarContainer();
            adicionarEstilos();
        }
        
        console.log('• Sistema de notificações inicializado');
        return this;
    }
    
    // Criar container das notificações
    function criarContainer() {
        if (typeof document === 'undefined') return;
        
        container = document.createElement('div');
        container.className = `notificacao-container ${configuracao.posicao}`;
        document.body.appendChild(container);
    }
    
    // Adicionar estilos CSS
    function adicionarEstilos() {
        if (typeof document === 'undefined') return;
        
        const style = document.createElement('style');
        style.textContent = estilos;
        document.head.appendChild(style);
    }
    
    // Criar notificação
    function criar(tipo, titulo, mensagem, opcoes = {}) {
        const id = ++contadorId;
        const duracao = opcoes.duracao || configuracao.duracao;
        
        // Verificar duplicatas
        if (!configuracao.permitirDuplicatas) {
            const duplicata = notificacoes.find(n => 
                n.titulo === titulo && n.mensagem === mensagem
            );
            if (duplicata) {
                console.log('• Notificação duplicada ignorada');
                return duplicata.id;
            }
        }
        
        // Limitar número de notificações
        if (notificacoes.length >= configuracao.maxNotificacoes) {
            remover(notificacoes[0].id);
        }
        
        const notificacao = {
            id,
            tipo,
            titulo,
            mensagem,
            duracao,
            criadaEm: Date.now(),
            elemento: null,
            timer: null
        };
        
        notificacoes.push(notificacao);
        renderizar(notificacao);
        
        // Auto-dismiss
        if (duracao > 0) {
            notificacao.timer = setTimeout(() => {
                remover(id);
            }, duracao);
        }
        
        // Disparar evento customizado
        dispararEvento('notificacao:criada', { notificacao });
        
        console.log(`• Notificação ${tipo} criada: ${titulo}`);
        return id;
    }
    
    // Renderizar notificação no DOM
    function renderizar(notificacao) {
        if (typeof document === 'undefined') return;
        
        const elemento = document.createElement('div');
        elemento.className = `notificacao ${notificacao.tipo}`;
        elemento.dataset.id = notificacao.id;
        
        elemento.innerHTML = `
            <div class="notificacao-header">
                <div class="notificacao-titulo">${notificacao.titulo}</div>
                <button class="notificacao-fechar" data-action="fechar">×</button>
            </div>
            <div class="notificacao-mensagem">${notificacao.mensagem}</div>
            ${notificacao.duracao > 0 ? '<div class="notificacao-progresso"></div>' : ''}
        `;
        
        // Event listeners
        elemento.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'fechar') {
                remover(notificacao.id);
            }
        });
        
        // Adicionar ao container
        container.appendChild(elemento);
        notificacao.elemento = elemento;
        
        // Animação de entrada
        requestAnimationFrame(() => {
            elemento.classList.add('show');
        });
        
        // Barra de progresso
        if (notificacao.duracao > 0) {
            const progresso = elemento.querySelector('.notificacao-progresso');
            if (progresso) {
                progresso.style.width = '100%';
                progresso.style.transition = `width ${notificacao.duracao}ms linear`;
                requestAnimationFrame(() => {
                    progresso.style.width = '0%';
                });
            }
        }
    }
    
    // Remover notificação
    function remover(id) {
        const index = notificacoes.findIndex(n => n.id === id);
        if (index === -1) return;
        
        const notificacao = notificacoes[index];
        
        // Limpar timer
        if (notificacao.timer) {
            clearTimeout(notificacao.timer);
        }
        
        // Animação de saída
        if (notificacao.elemento) {
            notificacao.elemento.classList.add('hide');
            setTimeout(() => {
                if (notificacao.elemento && notificacao.elemento.parentNode) {
                    notificacao.elemento.parentNode.removeChild(notificacao.elemento);
                }
            }, 300);
        }
        
        // Remover do array
        notificacoes.splice(index, 1);
        
        // Disparar evento
        dispararEvento('notificacao:removida', { id });
        
        console.log(`• Notificação ${id} removida`);
    }
    
    // Limpar todas as notificações
    function limparTodas() {
        const ids = notificacoes.map(n => n.id);
        ids.forEach(id => remover(id));
        console.log('• Todas as notificações removidas');
    }
    
    // Métodos de conveniência
    function sucesso(titulo, mensagem, opcoes) {
        return criar(TIPOS.SUCESSO, titulo, mensagem, opcoes);
    }
    
    function erro(titulo, mensagem, opcoes) {
        return criar(TIPOS.ERRO, titulo, mensagem, opcoes);
    }
    
    function aviso(titulo, mensagem, opcoes) {
        return criar(TIPOS.AVISO, titulo, mensagem, opcoes);
    }
    
    function info(titulo, mensagem, opcoes) {
        return criar(TIPOS.INFO, titulo, mensagem, opcoes);
    }
    
    // Disparar evento customizado
    function dispararEvento(nome, dados) {
        if (typeof document === 'undefined') return;
        
        const evento = new CustomEvent(nome, {
            detail: dados,
            bubbles: true
        });
        document.dispatchEvent(evento);
    }
    
    // Obter estatísticas
    function obterEstatisticas() {
        return {
            total: notificacoes.length,
            porTipo: notificacoes.reduce((acc, n) => {
                acc[n.tipo] = (acc[n.tipo] || 0) + 1;
                return acc;
            }, {}),
            maisAntiga: notificacoes.length > 0 ? 
                Math.min(...notificacoes.map(n => n.criadaEm)) : null,
            configuracao: { ...configuracao }
        };
    }
    
    return {
        inicializar,
        criar,
        remover,
        limparTodas,
        sucesso,
        erro,
        aviso,
        info,
        obterEstatisticas,
        TIPOS
    };
})();

// Demonstração do Sistema de Notificações
console.log('\n🧪 Testando Sistema de Notificações...');

// Inicializar sistema
SistemaNotificacoes.inicializar({
    posicao: 'top-right',
    duracao: 3000,
    maxNotificacoes: 3
});

// Simular notificações
setTimeout(() => {
    SistemaNotificacoes.sucesso('Sucesso!', 'Operação realizada com sucesso.');
}, 100);

setTimeout(() => {
    SistemaNotificacoes.info('Informação', 'Nova atualização disponível.');
}, 500);

setTimeout(() => {
    SistemaNotificacoes.aviso('Atenção', 'Memória baixa detectada.');
}, 900);

setTimeout(() => {
    SistemaNotificacoes.erro('Erro', 'Falha na conexão com o servidor.');
}, 1300);

// Listener para eventos customizados
if (typeof document !== 'undefined') {
    document.addEventListener('notificacao:criada', (e) => {
        console.log('• Evento capturado: notificação criada', e.detail);
    });
    
    document.addEventListener('notificacao:removida', (e) => {
        console.log('• Evento capturado: notificação removida', e.detail);
    });
}

/*
========================================
EXERCÍCIO 2: GERENCIADOR DE EVENTOS CUSTOMIZADO
========================================

Objetivo: Implementar um sistema robusto de gerenciamento de eventos
com suporte a namespaces, prioridades, filtros e middleware.

Conceitos aplicados:
• Event emitter pattern
• Namespace management
• Priority queues
• Middleware pattern
• Memory management
• Error handling
*/

console.log('\n🎛️ EXERCÍCIO 2: Gerenciador de Eventos Customizado');

class GerenciadorEventos {
    constructor() {
        this.eventos = new Map();
        this.middleware = [];
        this.estatisticas = {
            eventosDispatchados: 0,
            listenersRegistrados: 0,
            erros: 0
        };
        this.debug = false;
    }
    
    // Registrar listener
    on(evento, callback, opcoes = {}) {
        const {
            prioridade = 0,
            namespace = 'default',
            once = false,
            filtro = null,
            contexto = null
        } = opcoes;
        
        if (typeof callback !== 'function') {
            throw new Error('Callback deve ser uma função');
        }
        
        const chaveEvento = this._criarChaveEvento(evento, namespace);
        
        if (!this.eventos.has(chaveEvento)) {
            this.eventos.set(chaveEvento, []);
        }
        
        const listener = {
            id: this._gerarId(),
            callback,
            prioridade,
            namespace,
            once,
            filtro,
            contexto,
            criadoEm: Date.now(),
            executado: 0
        };
        
        // Inserir ordenado por prioridade (maior primeiro)
        const listeners = this.eventos.get(chaveEvento);
        const index = listeners.findIndex(l => l.prioridade < prioridade);
        
        if (index === -1) {
            listeners.push(listener);
        } else {
            listeners.splice(index, 0, listener);
        }
        
        this.estatisticas.listenersRegistrados++;
        
        if (this.debug) {
            console.log(`• Listener registrado: ${chaveEvento} (ID: ${listener.id})`);
        }
        
        return listener.id;
    }
    
    // Registrar listener que executa apenas uma vez
    once(evento, callback, opcoes = {}) {
        return this.on(evento, callback, { ...opcoes, once: true });
    }
    
    // Remover listener
    off(evento, callbackOuId, namespace = 'default') {
        const chaveEvento = this._criarChaveEvento(evento, namespace);
        
        if (!this.eventos.has(chaveEvento)) {
            return false;
        }
        
        const listeners = this.eventos.get(chaveEvento);
        let index = -1;
        
        if (typeof callbackOuId === 'string') {
            // Remover por ID
            index = listeners.findIndex(l => l.id === callbackOuId);
        } else if (typeof callbackOuId === 'function') {
            // Remover por callback
            index = listeners.findIndex(l => l.callback === callbackOuId);
        }
        
        if (index !== -1) {
            listeners.splice(index, 1);
            
            if (listeners.length === 0) {
                this.eventos.delete(chaveEvento);
            }
            
            if (this.debug) {
                console.log(`• Listener removido: ${chaveEvento}`);
            }
            
            return true;
        }
        
        return false;
    }
    
    // Disparar evento
    emit(evento, dados = {}, namespace = 'default') {
        const chaveEvento = this._criarChaveEvento(evento, namespace);
        
        if (!this.eventos.has(chaveEvento)) {
            if (this.debug) {
                console.log(`• Nenhum listener para: ${chaveEvento}`);
            }
            return [];
        }
        
        const listeners = this.eventos.get(chaveEvento);
        const resultados = [];
        const listenersParaRemover = [];
        
        // Criar contexto do evento
        const contextoEvento = {
            evento,
            namespace,
            dados,
            timestamp: Date.now(),
            propagacao: true,
            pararPropagacao: () => { contextoEvento.propagacao = false; }
        };
        
        // Executar middleware
        for (const middleware of this.middleware) {
            try {
                const resultado = middleware(contextoEvento);
                if (resultado === false) {
                    if (this.debug) {
                        console.log(`• Evento bloqueado por middleware: ${chaveEvento}`);
                    }
                    return [];
                }
            } catch (error) {
                this.estatisticas.erros++;
                console.error('Erro no middleware:', error);
            }
        }
        
        // Executar listeners
        for (const listener of listeners) {
            if (!contextoEvento.propagacao) break;
            
            try {
                // Aplicar filtro se existir
                if (listener.filtro && !listener.filtro(dados, contextoEvento)) {
                    continue;
                }
                
                // Executar callback
                const contexto = listener.contexto || this;
                const resultado = listener.callback.call(contexto, dados, contextoEvento);
                
                resultados.push({
                    listenerId: listener.id,
                    resultado,
                    executadoEm: Date.now()
                });
                
                listener.executado++;
                
                // Marcar para remoção se for 'once'
                if (listener.once) {
                    listenersParaRemover.push(listener.id);
                }
                
            } catch (error) {
                this.estatisticas.erros++;
                console.error(`Erro no listener ${listener.id}:`, error);
                
                resultados.push({
                    listenerId: listener.id,
                    erro: error.message,
                    executadoEm: Date.now()
                });
            }
        }
        
        // Remover listeners 'once'
        listenersParaRemover.forEach(id => {
            this.off(evento, id, namespace);
        });
        
        this.estatisticas.eventosDispatchados++;
        
        if (this.debug) {
            console.log(`• Evento disparado: ${chaveEvento} (${resultados.length} listeners)`);
        }
        
        return resultados;
    }
    
    // Adicionar middleware
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware deve ser uma função');
        }
        
        this.middleware.push(middleware);
        
        if (this.debug) {
            console.log('• Middleware adicionado');
        }
    }
    
    // Remover todos os listeners de um namespace
    removeNamespace(namespace) {
        let removidos = 0;
        
        for (const [chave, listeners] of this.eventos.entries()) {
            if (chave.includes(`@${namespace}`)) {
                removidos += listeners.length;
                this.eventos.delete(chave);
            }
        }
        
        if (this.debug) {
            console.log(`• Namespace removido: ${namespace} (${removidos} listeners)`);
        }
        
        return removidos;
    }
    
    // Listar eventos registrados
    listarEventos() {
        const eventos = {};
        
        for (const [chave, listeners] of this.eventos.entries()) {
            const [evento, namespace] = chave.split('@');
            
            if (!eventos[evento]) {
                eventos[evento] = {};
            }
            
            eventos[evento][namespace] = listeners.map(l => ({
                id: l.id,
                prioridade: l.prioridade,
                once: l.once,
                executado: l.executado,
                criadoEm: l.criadoEm
            }));
        }
        
        return eventos;
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        return {
            ...this.estatisticas,
            eventosRegistrados: this.eventos.size,
            totalListeners: Array.from(this.eventos.values())
                .reduce((total, listeners) => total + listeners.length, 0),
            middleware: this.middleware.length
        };
    }
    
    // Limpar todos os eventos
    limpar() {
        const total = Array.from(this.eventos.values())
            .reduce((total, listeners) => total + listeners.length, 0);
        
        this.eventos.clear();
        this.middleware = [];
        
        if (this.debug) {
            console.log(`• Todos os eventos limpos (${total} listeners removidos)`);
        }
        
        return total;
    }
    
    // Habilitar/desabilitar debug
    setDebug(ativo) {
        this.debug = ativo;
        console.log(`• Debug ${ativo ? 'habilitado' : 'desabilitado'}`);
    }
    
    // Métodos privados
    _criarChaveEvento(evento, namespace) {
        return `${evento}@${namespace}`;
    }
    
    _gerarId() {
        return Math.random().toString(36).substr(2, 9);
    }
}

// Demonstração do Gerenciador de Eventos
console.log('\n🧪 Testando Gerenciador de Eventos...');

const gerenciador = new GerenciadorEventos();
gerenciador.setDebug(true);

// Middleware de logging
gerenciador.use((contexto) => {
    console.log(`📡 Middleware: ${contexto.evento}@${contexto.namespace}`);
    return true;
});

// Middleware de filtro
gerenciador.use((contexto) => {
    if (contexto.dados.bloqueado) {
        console.log('🚫 Evento bloqueado por middleware');
        return false;
    }
    return true;
});

// Registrar listeners com diferentes prioridades
gerenciador.on('teste', (dados) => {
    console.log('• Listener prioridade baixa:', dados.mensagem);
}, { prioridade: 1 });

gerenciador.on('teste', (dados) => {
    console.log('• Listener prioridade alta:', dados.mensagem);
}, { prioridade: 10 });

gerenciador.on('teste', (dados) => {
    console.log('• Listener prioridade média:', dados.mensagem);
}, { prioridade: 5 });

// Listener com filtro
gerenciador.on('teste', (dados) => {
    console.log('• Listener filtrado:', dados.mensagem);
}, {
    filtro: (dados) => dados.importante === true
});

// Listener que executa apenas uma vez
gerenciador.once('teste', (dados) => {
    console.log('• Listener once:', dados.mensagem);
});

// Testar eventos
console.log('\n🔥 Disparando eventos...');

gerenciador.emit('teste', {
    mensagem: 'Primeiro teste',
    importante: false
});

gerenciador.emit('teste', {
    mensagem: 'Segundo teste',
    importante: true
});

gerenciador.emit('teste', {
    mensagem: 'Terceiro teste (bloqueado)',
    bloqueado: true
});

// Estatísticas
console.log('\n📊 Estatísticas:', gerenciador.obterEstatisticas());

/*
========================================
EXERCÍCIO 3: SISTEMA DE COMUNICAÇÃO ENTRE COMPONENTES
========================================

Objetivo: Criar um sistema avançado de comunicação que permite
componentes se comunicarem através de eventos, com suporte a
canais, roteamento, persistência e sincronização.

Conceitos aplicados:
• Pub/Sub pattern
• Message routing
• Channel management
• State synchronization
• Persistence layer
• Component lifecycle
*/

console.log('\n📡 EXERCÍCIO 3: Sistema de Comunicação entre Componentes');

class SistemaComunicacao {
    constructor(opcoes = {}) {
        this.canais = new Map();
        this.componentes = new Map();
        this.roteamento = new Map();
        this.middleware = [];
        this.persistencia = opcoes.persistencia || false;
        this.debug = opcoes.debug || false;
        this.historico = [];
        this.maxHistorico = opcoes.maxHistorico || 100;
        
        // Canal padrão para broadcast
        this.criarCanal('broadcast', {
            persistente: true,
            historico: true
        });
        
        if (this.debug) {
            console.log('• Sistema de comunicação inicializado');
        }
    }
    
    // Criar canal de comunicação
    criarCanal(nome, opcoes = {}) {
        if (this.canais.has(nome)) {
            throw new Error(`Canal '${nome}' já existe`);
        }
        
        const canal = {
            nome,
            assinantes: new Set(),
            mensagens: [],
            opcoes: {
                persistente: false,
                historico: false,
                maxMensagens: 50,
                filtro: null,
                ...opcoes
            },
            criadoEm: Date.now(),
            estatisticas: {
                mensagensEnviadas: 0,
                assinantesTotal: 0
            }
        };
        
        this.canais.set(nome, canal);
        
        if (this.debug) {
            console.log(`• Canal criado: ${nome}`);
        }
        
        return canal;
    }
    
    // Registrar componente
    registrarComponente(id, componente) {
        if (this.componentes.has(id)) {
            throw new Error(`Componente '${id}' já registrado`);
        }
        
        const wrapper = {
            id,
            componente,
            canaisAssinados: new Set(),
            mensagensEnviadas: 0,
            mensagensRecebidas: 0,
            registradoEm: Date.now(),
            ativo: true
        };
        
        this.componentes.set(id, wrapper);
        
        // Chamar método de inicialização se existir
        if (typeof componente.onRegistrado === 'function') {
            componente.onRegistrado(this, id);
        }
        
        if (this.debug) {
            console.log(`• Componente registrado: ${id}`);
        }
        
        return wrapper;
    }
    
    // Assinar canal
    assinar(componenteId, canal, callback) {
        const componente = this.componentes.get(componenteId);
        if (!componente) {
            throw new Error(`Componente '${componenteId}' não encontrado`);
        }
        
        const canalObj = this.canais.get(canal);
        if (!canalObj) {
            throw new Error(`Canal '${canal}' não encontrado`);
        }
        
        const assinatura = {
            componenteId,
            callback,
            assinadoEm: Date.now()
        };
        
        canalObj.assinantes.add(assinatura);
        componente.canaisAssinados.add(canal);
        canalObj.estatisticas.assinantesTotal++;
        
        // Enviar mensagens do histórico se habilitado
        if (canalObj.opcoes.historico && canalObj.mensagens.length > 0) {
            canalObj.mensagens.forEach(mensagem => {
                this._entregarMensagem(assinatura, mensagem, canal);
            });
        }
        
        if (this.debug) {
            console.log(`• ${componenteId} assinou canal: ${canal}`);
        }
        
        return () => this.desassinar(componenteId, canal);
    }
    
    // Desassinar canal
    desassinar(componenteId, canal) {
        const componente = this.componentes.get(componenteId);
        const canalObj = this.canais.get(canal);
        
        if (!componente || !canalObj) {
            return false;
        }
        
        // Encontrar e remover assinatura
        for (const assinatura of canalObj.assinantes) {
            if (assinatura.componenteId === componenteId) {
                canalObj.assinantes.delete(assinatura);
                componente.canaisAssinados.delete(canal);
                
                if (this.debug) {
                    console.log(`• ${componenteId} desassinou canal: ${canal}`);
                }
                
                return true;
            }
        }
        
        return false;
    }
    
    // Enviar mensagem
    enviar(remetente, canal, dados, opcoes = {}) {
        const componente = this.componentes.get(remetente);
        if (!componente || !componente.ativo) {
            throw new Error(`Componente '${remetente}' não encontrado ou inativo`);
        }
        
        const canalObj = this.canais.get(canal);
        if (!canalObj) {
            throw new Error(`Canal '${canal}' não encontrado`);
        }
        
        const mensagem = {
            id: this._gerarId(),
            remetente,
            canal,
            dados,
            timestamp: Date.now(),
            opcoes: {
                prioridade: 'normal',
                ttl: null,
                persistir: false,
                ...opcoes
            }
        };
        
        // Aplicar filtro do canal se existir
        if (canalObj.opcoes.filtro && !canalObj.opcoes.filtro(mensagem)) {
            if (this.debug) {
                console.log(`• Mensagem filtrada no canal: ${canal}`);
            }
            return false;
        }
        
        // Executar middleware
        for (const middleware of this.middleware) {
            const resultado = middleware(mensagem, 'envio');
            if (resultado === false) {
                if (this.debug) {
                    console.log(`• Mensagem bloqueada por middleware`);
                }
                return false;
            }
        }
        
        // Armazenar no histórico do canal
        if (canalObj.opcoes.historico) {
            canalObj.mensagens.push(mensagem);
            
            // Limitar tamanho do histórico
            if (canalObj.mensagens.length > canalObj.opcoes.maxMensagens) {
                canalObj.mensagens.shift();
            }
        }
        
        // Armazenar no histórico global
        this.historico.push(mensagem);
        if (this.historico.length > this.maxHistorico) {
            this.historico.shift();
        }
        
        // Entregar para assinantes
        let entregues = 0;
        for (const assinatura of canalObj.assinantes) {
            if (this._entregarMensagem(assinatura, mensagem, canal)) {
                entregues++;
            }
        }
        
        // Atualizar estatísticas
        componente.mensagensEnviadas++;
        canalObj.estatisticas.mensagensEnviadas++;
        
        // Persistir se necessário
        if (this.persistencia && (mensagem.opcoes.persistir || canalObj.opcoes.persistente)) {
            this._persistirMensagem(mensagem);
        }
        
        if (this.debug) {
            console.log(`• Mensagem enviada: ${remetente} -> ${canal} (${entregues} destinatários)`);
        }
        
        return {
            id: mensagem.id,
            entregues,
            timestamp: mensagem.timestamp
        };
    }
    
    // Broadcast para todos os componentes
    broadcast(remetente, dados, opcoes = {}) {
        return this.enviar(remetente, 'broadcast', dados, opcoes);
    }
    
    // Enviar mensagem direta entre componentes
    enviarDireto(remetente, destinatario, dados, opcoes = {}) {
        const canalDireto = `direct:${remetente}:${destinatario}`;
        
        // Criar canal temporário se não existir
        if (!this.canais.has(canalDireto)) {
            this.criarCanal(canalDireto, {
                persistente: false,
                historico: false
            });
            
            // Auto-assinar o destinatário
            const componenteDestino = this.componentes.get(destinatario);
            if (componenteDestino && typeof componenteDestino.componente.onMensagemDireta === 'function') {
                this.assinar(destinatario, canalDireto, (dados, contexto) => {
                    componenteDestino.componente.onMensagemDireta(dados, contexto);
                });
            }
        }
        
        return this.enviar(remetente, canalDireto, dados, opcoes);
    }
    
    // Adicionar middleware
    use(middleware) {
        if (typeof middleware !== 'function') {
            throw new Error('Middleware deve ser uma função');
        }
        
        this.middleware.push(middleware);
        
        if (this.debug) {
            console.log('• Middleware adicionado ao sistema de comunicação');
        }
    }
    
    // Obter estatísticas do sistema
    obterEstatisticas() {
        const estatisticas = {
            canais: this.canais.size,
            componentes: this.componentes.size,
            mensagensHistorico: this.historico.length,
            middleware: this.middleware.length,
            detalhesCanais: {},
            detalhesComponentes: {}
        };
        
        // Estatísticas dos canais
        for (const [nome, canal] of this.canais.entries()) {
            estatisticas.detalhesCanais[nome] = {
                assinantes: canal.assinantes.size,
                mensagensArmazenadas: canal.mensagens.length,
                ...canal.estatisticas
            };
        }
        
        // Estatísticas dos componentes
        for (const [id, componente] of this.componentes.entries()) {
            estatisticas.detalhesComponentes[id] = {
                canaisAssinados: componente.canaisAssinados.size,
                mensagensEnviadas: componente.mensagensEnviadas,
                mensagensRecebidas: componente.mensagensRecebidas,
                ativo: componente.ativo
            };
        }
        
        return estatisticas;
    }
    
    // Métodos privados
    _entregarMensagem(assinatura, mensagem, canal) {
        try {
            // Verificar TTL
            if (mensagem.opcoes.ttl && 
                Date.now() - mensagem.timestamp > mensagem.opcoes.ttl) {
                return false;
            }
            
            const componente = this.componentes.get(assinatura.componenteId);
            if (!componente || !componente.ativo) {
                return false;
            }
            
            // Executar middleware de entrega
            for (const middleware of this.middleware) {
                const resultado = middleware(mensagem, 'entrega');
                if (resultado === false) {
                    return false;
                }
            }
            
            // Criar contexto da mensagem
            const contexto = {
                canal,
                remetente: mensagem.remetente,
                timestamp: mensagem.timestamp,
                id: mensagem.id
            };
            
            // Entregar mensagem
            assinatura.callback(mensagem.dados, contexto);
            componente.mensagensRecebidas++;
            
            return true;
            
        } catch (error) {
            console.error(`Erro ao entregar mensagem para ${assinatura.componenteId}:`, error);
            return false;
        }
    }
    
    _persistirMensagem(mensagem) {
        // Implementação básica de persistência
        if (typeof localStorage !== 'undefined') {
            const chave = `comunicacao_${mensagem.id}`;
            localStorage.setItem(chave, JSON.stringify(mensagem));
        }
    }
    
    _gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Limpar sistema
    limpar() {
        this.canais.clear();
        this.componentes.clear();
        this.roteamento.clear();
        this.historico = [];
        
        if (this.debug) {
            console.log('• Sistema de comunicação limpo');
        }
    }
}

// Classe base para componentes
class ComponenteBase {
    constructor(id) {
        this.id = id;
        this.sistema = null;
        this.assinaturas = [];
    }
    
    onRegistrado(sistema, id) {
        this.sistema = sistema;
        this.id = id;
        console.log(`• Componente ${id} registrado no sistema`);
    }
    
    assinar(canal, callback) {
        if (!this.sistema) {
            throw new Error('Componente não registrado no sistema');
        }
        
        const desassinar = this.sistema.assinar(this.id, canal, callback);
        this.assinaturas.push(desassinar);
        return desassinar;
    }
    
    enviar(canal, dados, opcoes) {
        if (!this.sistema) {
            throw new Error('Componente não registrado no sistema');
        }
        
        return this.sistema.enviar(this.id, canal, dados, opcoes);
    }
    
    broadcast(dados, opcoes) {
        return this.enviar('broadcast', dados, opcoes);
    }
    
    enviarDireto(destinatario, dados, opcoes) {
        if (!this.sistema) {
            throw new Error('Componente não registrado no sistema');
        }
        
        return this.sistema.enviarDireto(this.id, destinatario, dados, opcoes);
    }
    
    onMensagemDireta(dados, contexto) {
        console.log(`• ${this.id} recebeu mensagem direta:`, dados);
    }
    
    destruir() {
        // Desassinar todos os canais
        this.assinaturas.forEach(desassinar => desassinar());
        this.assinaturas = [];
        
        console.log(`• Componente ${this.id} destruído`);
    }
}

// Demonstração do Sistema de Comunicação
console.log('\n🧪 Testando Sistema de Comunicação...');

const sistema = new SistemaComunicacao({ debug: true });

// Middleware de logging
sistema.use((mensagem, tipo) => {
    console.log(`📡 Middleware ${tipo}: ${mensagem.remetente} -> ${mensagem.canal}`);
    return true;
});

// Criar canais
sistema.criarCanal('chat', {
    historico: true,
    maxMensagens: 10
});

sistema.criarCanal('notificacoes', {
    persistente: true,
    filtro: (mensagem) => mensagem.dados.prioridade >= 3
});

// Criar componentes de exemplo
class ComponenteChat extends ComponenteBase {
    constructor(id, nome) {
        super(id);
        this.nome = nome;
    }
    
    onRegistrado(sistema, id) {
        super.onRegistrado(sistema, id);
        
        // Assinar canal de chat
        this.assinar('chat', (dados, contexto) => {
            if (contexto.remetente !== this.id) {
                console.log(`💬 ${this.nome} recebeu: "${dados.mensagem}" de ${dados.autor}`);
            }
        });
        
        // Assinar notificações
        this.assinar('notificacoes', (dados, contexto) => {
            console.log(`🔔 ${this.nome} - Notificação: ${dados.texto}`);
        });
    }
    
    falar(mensagem) {
        this.enviar('chat', {
            mensagem,
            autor: this.nome,
            timestamp: new Date().toLocaleTimeString()
        });
    }
    
    notificar(texto, prioridade = 1) {
        this.enviar('notificacoes', {
            texto,
            prioridade,
            de: this.nome
        });
    }
}

// Registrar componentes
const alice = new ComponenteChat('alice', 'Alice');
const bob = new ComponenteChat('bob', 'Bob');
const charlie = new ComponenteChat('charlie', 'Charlie');

sistema.registrarComponente('alice', alice);
sistema.registrarComponente('bob', bob);
sistema.registrarComponente('charlie', charlie);

// Simular conversação
console.log('\n💬 Simulando conversação...');

setTimeout(() => {
    alice.falar('Olá pessoal!');
}, 100);

setTimeout(() => {
    bob.falar('Oi Alice! Como vai?');
}, 200);

setTimeout(() => {
    charlie.falar('Oi galera!');
}, 300);

setTimeout(() => {
    alice.notificar('Reunião em 10 minutos', 5);
}, 400);

setTimeout(() => {
    bob.notificar('Lembrete pessoal', 1); // Será filtrada
}, 500);

setTimeout(() => {
    // Mensagem direta
    alice.enviarDireto('bob', {
        mensagem: 'Mensagem privada para você',
        confidencial: true
    });
}, 600);

setTimeout(() => {
    console.log('\n📊 Estatísticas finais:', sistema.obterEstatisticas());
}, 1000);

/*
========================================
CONCEITOS APLICADOS
========================================

1. SISTEMA DE EVENTOS:
   • addEventListener() - registro de eventos
   • CustomEvent - eventos customizados
   • Event delegation - delegação de eventos
   • Event bubbling/capturing - propagação
   • preventDefault() - prevenção de comportamento

2. PADRÕES DE DESIGN:
   • Observer Pattern - notificação de mudanças
   • Pub/Sub Pattern - publicação/assinatura
   • Mediator Pattern - comunicação centralizada
   • Command Pattern - encapsulamento de ações
   • Strategy Pattern - algoritmos intercambiáveis

3. GERENCIAMENTO DE ESTADO:
   • Event-driven architecture
   • State synchronization
   • Message queuing
   • Priority handling
   • Middleware pattern

4. PERFORMANCE E MEMÓRIA:
   • Event listener cleanup
   • Memory leak prevention
   • Efficient event routing
   • Batch processing
   • Lazy loading

========================================
BOAS PRÁTICAS DEMONSTRADAS
========================================

1. ORGANIZAÇÃO:
   • Separação de responsabilidades
   • Encapsulamento de funcionalidades
   • Interfaces bem definidas
   • Documentação inline

2. ROBUSTEZ:
   • Tratamento de erros
   • Validação de parâmetros
   • Cleanup automático
   • Fallbacks apropriados

3. EXTENSIBILIDADE:
   • Sistema de middleware
   • Configurações flexíveis
   • Hooks para customização
   • API consistente

4. DEBUGGING:
   • Logging detalhado
   • Estatísticas de uso
   • Modo debug
   • Rastreamento de eventos

========================================
EXERCÍCIOS PROPOSTOS
========================================

1. BÁSICO:
   • Criar um sistema de tooltips com eventos
   • Implementar um carousel com navegação por eventos
   • Fazer um formulário com validação em tempo real
   • Criar um sistema de abas com eventos

2. INTERMEDIÁRIO:
   • Implementar drag and drop com eventos customizados
   • Criar um sistema de undo/redo baseado em eventos
   • Fazer um chat em tempo real com WebSockets
   • Implementar um sistema de plugins baseado em eventos

3. AVANÇADO:
   • Criar um framework de componentes com comunicação
   • Implementar um sistema de workflow com eventos
   • Fazer um editor colaborativo em tempo real
   • Criar um sistema de microservices frontend

========================================
FERRAMENTAS RECOMENDADAS
========================================

• RxJS - programação reativa
• EventEmitter3 - event emitter performático
• Socket.io - comunicação em tempo real
• Redux - gerenciamento de estado
• MobX - estado reativo
• Webpack - bundling com hot reload
• Chrome DevTools - debugging de eventos
• React DevTools - inspeção de componentes

*/

// Demonstração final
console.log('\n🎉 DEMONSTRAÇÃO FINAL - INTEGRAÇÃO DOS EXERCÍCIOS');

// Integrar notificações com comunicação
if (typeof SistemaNotificacoes !== 'undefined') {
    // Conectar sistema de comunicação com notificações
    sistema.assinar('sistema', 'notificacoes', (dados) => {
        const tipo = dados.prioridade >= 4 ? 'erro' : 
                    dados.prioridade >= 3 ? 'aviso' : 'info';
        
        SistemaNotificacoes[tipo](
            'Sistema de Comunicação',
            dados.texto
        );
    });
    
    console.log('• Sistemas integrados: Comunicação + Notificações');
}

console.log('\n🎯 RESUMO DOS EXERCÍCIOS:');
console.log('1. ✅ Sistema de Notificações - Interface rica com animações');
console.log('2. ✅ Gerenciador de Eventos - Sistema robusto com middleware');
console.log('3. ✅ Comunicação entre Componentes - Arquitetura escalável');
console.log('\n🚀 Todos os exercícios de sistema de eventos concluídos!');
console.log('\n📚 Próximos passos: Explore padrões avançados como CQRS e Event Sourcing!');

/*
========================================
NOTAS FINAIS
========================================

Estes exercícios cobrem os aspectos fundamentais dos sistemas de eventos:

• Criação e gerenciamento de eventos
• Comunicação entre componentes
• Padrões de design para eventos
• Performance e otimização
• Debugging e monitoramento
• Integração com outras funcionalidades

Os conceitos aprendidos são fundamentais para:
• Desenvolvimento de SPAs
• Arquiteturas orientadas a eventos
• Sistemas distribuídos
• Programação reativa
• Microservices frontend

Continue praticando e experimentando com diferentes cenários!
*/