/*
===========================================
    MÓDULO 07 - EVENTOS
    Aula 01: Event Listeners
===========================================

Objetivos de Aprendizagem:
✓ Dominar o sistema de eventos do JavaScript
✓ Compreender event listeners e handlers
✓ Implementar diferentes tipos de eventos
✓ Aplicar boas práticas de gerenciamento
✓ Desenvolver sistemas de eventos robustos
*/

// ===========================================
// 1. TEORIA: SISTEMA DE EVENTOS
// ===========================================

/*
SISTEMA DE EVENTOS NO JAVASCRIPT:

1. CONCEITOS FUNDAMENTAIS:
   - Event: Ação que ocorre no navegador
   - Event Target: Elemento que recebe o evento
   - Event Listener: Função que responde ao evento
   - Event Handler: Código que processa o evento

2. TIPOS DE EVENTOS:
   - Mouse: click, dblclick, mousedown, mouseup, mouseover, mouseout
   - Teclado: keydown, keyup, keypress
   - Formulário: submit, change, input, focus, blur
   - Janela: load, resize, scroll, unload
   - Touch: touchstart, touchmove, touchend
   - Customizados: eventos criados pelo desenvolvedor

3. FASES DO EVENTO:
   - Capturing: Do document até o target
   - Target: No elemento alvo
   - Bubbling: Do target até o document

4. MÉTODOS DE REGISTRO:
   - addEventListener(): Método recomendado
   - removeEventListener(): Remove listener
   - Propriedades on*: onclick, onload, etc.
   - HTML attributes: onclick="..."
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Registro Básico de Event Listeners ---
console.log('=== REGISTRO BÁSICO DE EVENT LISTENERS ===');

const exemploRegistroBasico = {
    // Demonstração de diferentes formas de registro
    demonstrarFormasRegistro() {
        // Criar elemento para demonstração
        const botao = document.createElement('button');
        botao.textContent = 'Clique aqui';
        botao.id = 'botao-demo';
        
        // 1. addEventListener (RECOMENDADO)
        botao.addEventListener('click', function(event) {
            console.log('Clique detectado via addEventListener');
            console.log('Target:', event.target);
            console.log('Timestamp:', event.timeStamp);
        });
        
        // 2. Propriedade onclick (permite apenas um handler)
        botao.onclick = function(event) {
            console.log('Clique detectado via onclick');
        };
        
        // 3. Arrow function com addEventListener
        botao.addEventListener('click', (event) => {
            console.log('Clique detectado via arrow function');
        });
        
        // 4. Função nomeada (facilita remoção)
        const handlerNomeado = function(event) {
            console.log('Handler nomeado executado');
        };
        botao.addEventListener('click', handlerNomeado);
        
        return { botao, handlerNomeado };
    },
    
    // Demonstração de remoção de listeners
    demonstrarRemocaoListeners() {
        const { botao, handlerNomeado } = this.demonstrarFormasRegistro();
        
        // Remover listener específico
        setTimeout(() => {
            botao.removeEventListener('click', handlerNomeado);
            console.log('Handler nomeado removido após 5 segundos');
        }, 5000);
        
        return botao;
    },
    
    // Demonstração de opções avançadas
    demonstrarOpcoesAvancadas() {
        const elemento = document.createElement('div');
        elemento.textContent = 'Elemento com opções avançadas';
        
        // Listener que executa apenas uma vez
        elemento.addEventListener('click', function(event) {
            console.log('Este listener executa apenas uma vez');
        }, { once: true });
        
        // Listener passivo (não pode chamar preventDefault)
        elemento.addEventListener('scroll', function(event) {
            console.log('Scroll passivo detectado');
        }, { passive: true });
        
        // Listener na fase de capturing
        elemento.addEventListener('click', function(event) {
            console.log('Capturing phase');
        }, { capture: true });
        
        // Listener com signal para cancelamento
        const controller = new AbortController();
        elemento.addEventListener('click', function(event) {
            console.log('Listener cancelável');
        }, { signal: controller.signal });
        
        // Cancelar após 10 segundos
        setTimeout(() => {
            controller.abort();
            console.log('Listener cancelado via AbortController');
        }, 10000);
        
        return elemento;
    }
};

// --- 2.2 Eventos de Mouse ---
console.log('\n=== EVENTOS DE MOUSE ===');

const exemploEventsMouse = {
    // Gerenciador completo de eventos de mouse
    criarGerenciadorMouse(elemento) {
        if (!elemento) {
            elemento = document.createElement('div');
            elemento.style.cssText = `
                width: 200px;
                height: 200px;
                background: lightblue;
                border: 2px solid blue;
                margin: 20px;
                cursor: pointer;
                user-select: none;
            `;
            elemento.textContent = 'Área de teste do mouse';
        }
        
        const eventos = {
            // Eventos básicos de clique
            click: (e) => {
                console.log('Click:', {
                    x: e.clientX,
                    y: e.clientY,
                    button: e.button,
                    detail: e.detail // número de cliques
                });
            },
            
            dblclick: (e) => {
                console.log('Double click detectado');
                elemento.style.backgroundColor = 
                    elemento.style.backgroundColor === 'lightcoral' 
                        ? 'lightblue' 
                        : 'lightcoral';
            },
            
            // Eventos de pressionar/soltar
            mousedown: (e) => {
                console.log('Mouse down:', {
                    button: e.button, // 0=esquerdo, 1=meio, 2=direito
                    buttons: e.buttons // bitmask dos botões pressionados
                });
                elemento.style.transform = 'scale(0.95)';
            },
            
            mouseup: (e) => {
                console.log('Mouse up');
                elemento.style.transform = 'scale(1)';
            },
            
            // Eventos de movimento
            mousemove: (e) => {
                // Throttle para evitar spam
                if (!elemento.dataset.lastMove || 
                    Date.now() - parseInt(elemento.dataset.lastMove) > 100) {
                    
                    console.log('Mouse move:', {
                        clientX: e.clientX,
                        clientY: e.clientY,
                        offsetX: e.offsetX,
                        offsetY: e.offsetY
                    });
                    
                    elemento.dataset.lastMove = Date.now();
                }
            },
            
            // Eventos de entrada/saída
            mouseenter: (e) => {
                console.log('Mouse enter');
                elemento.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            },
            
            mouseleave: (e) => {
                console.log('Mouse leave');
                elemento.style.boxShadow = 'none';
            },
            
            // Eventos de hover (com bubbling)
            mouseover: (e) => {
                console.log('Mouse over (bubbles)');
            },
            
            mouseout: (e) => {
                console.log('Mouse out (bubbles)');
            },
            
            // Evento de menu de contexto
            contextmenu: (e) => {
                e.preventDefault(); // Previne menu padrão
                console.log('Menu de contexto solicitado');
                alert('Menu customizado aqui!');
            }
        };
        
        // Registrar todos os eventos
        Object.entries(eventos).forEach(([tipo, handler]) => {
            elemento.addEventListener(tipo, handler);
        });
        
        return { elemento, eventos };
    },
    
    // Sistema de drag and drop
    criarSistemaDragDrop() {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            gap: 20px;
            padding: 20px;
        `;
        
        // Elemento arrastável
        const draggable = document.createElement('div');
        draggable.style.cssText = `
            width: 100px;
            height: 100px;
            background: orange;
            cursor: move;
            user-select: none;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        draggable.textContent = 'Arraste-me';
        draggable.draggable = true;
        
        // Área de drop
        const dropZone = document.createElement('div');
        dropZone.style.cssText = `
            width: 200px;
            height: 200px;
            border: 2px dashed #ccc;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
        `;
        dropZone.textContent = 'Solte aqui';
        
        // Eventos de drag
        draggable.addEventListener('dragstart', (e) => {
            console.log('Drag start');
            e.dataTransfer.setData('text/plain', 'dados-do-elemento');
            e.dataTransfer.effectAllowed = 'move';
            draggable.style.opacity = '0.5';
        });
        
        draggable.addEventListener('dragend', (e) => {
            console.log('Drag end');
            draggable.style.opacity = '1';
        });
        
        // Eventos de drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permite o drop
            e.dataTransfer.dropEffect = 'move';
            dropZone.style.borderColor = 'green';
            dropZone.style.backgroundColor = 'rgba(0,255,0,0.1)';
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            dropZone.style.borderColor = '#ccc';
            dropZone.style.backgroundColor = 'transparent';
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            console.log('Drop realizado');
            
            const dados = e.dataTransfer.getData('text/plain');
            console.log('Dados recebidos:', dados);
            
            dropZone.style.borderColor = '#ccc';
            dropZone.style.backgroundColor = 'lightgreen';
            dropZone.textContent = 'Item recebido!';
            
            // Move o elemento
            dropZone.appendChild(draggable);
        });
        
        container.appendChild(draggable);
        container.appendChild(dropZone);
        
        return container;
    }
};

// --- 2.3 Eventos de Teclado ---
console.log('\n=== EVENTOS DE TECLADO ===');

const exemploEventsTeclado = {
    // Gerenciador de eventos de teclado
    criarGerenciadorTeclado() {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Digite algo aqui...';
        input.style.cssText = `
            padding: 10px;
            font-size: 16px;
            border: 2px solid #ccc;
            border-radius: 4px;
            width: 300px;
        `;
        
        const info = document.createElement('div');
        info.style.cssText = `
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            font-family: monospace;
        `;
        
        // Eventos de teclado
        input.addEventListener('keydown', (e) => {
            const infoKeydown = {
                tipo: 'keydown',
                key: e.key,
                code: e.code,
                keyCode: e.keyCode,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey
            };
            
            console.log('Keydown:', infoKeydown);
            
            // Atalhos de teclado
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                console.log('Ctrl+S interceptado!');
                alert('Salvamento simulado!');
            }
            
            if (e.key === 'Escape') {
                input.blur();
                console.log('Escape pressionado - foco removido');
            }
        });
        
        input.addEventListener('keyup', (e) => {
            console.log('Keyup:', e.key);
        });
        
        input.addEventListener('keypress', (e) => {
            console.log('Keypress:', e.key);
            
            // Validação em tempo real
            if (e.key >= '0' && e.key <= '9') {
                // Permite números
            } else if (e.key >= 'a' && e.key <= 'z' || e.key >= 'A' && e.key <= 'Z') {
                // Permite letras
            } else if (e.key === ' ') {
                // Permite espaço
            } else {
                // Bloqueia outros caracteres
                e.preventDefault();
                console.log('Caractere bloqueado:', e.key);
            }
        });
        
        // Eventos de input
        input.addEventListener('input', (e) => {
            const valor = e.target.value;
            info.innerHTML = `
                <strong>Input Event:</strong><br>
                Valor: "${valor}"<br>
                Comprimento: ${valor.length}<br>
                Última tecla: ${e.inputType || 'N/A'}
            `;
        });
        
        // Eventos de foco
        input.addEventListener('focus', (e) => {
            console.log('Input focado');
            input.style.borderColor = 'blue';
        });
        
        input.addEventListener('blur', (e) => {
            console.log('Input desfocado');
            input.style.borderColor = '#ccc';
        });
        
        const container = document.createElement('div');
        container.appendChild(input);
        container.appendChild(info);
        
        return container;
    },
    
    // Sistema de atalhos globais
    criarSistemaAtalhos() {
        const atalhos = new Map();
        
        const registrarAtalho = (combinacao, callback, descricao = '') => {
            atalhos.set(combinacao, { callback, descricao });
        };
        
        const processarAtalho = (e) => {
            const combinacao = [];
            
            if (e.ctrlKey) combinacao.push('Ctrl');
            if (e.shiftKey) combinacao.push('Shift');
            if (e.altKey) combinacao.push('Alt');
            if (e.metaKey) combinacao.push('Meta');
            
            combinacao.push(e.key);
            
            const chaveAtalho = combinacao.join('+');
            
            if (atalhos.has(chaveAtalho)) {
                e.preventDefault();
                const { callback } = atalhos.get(chaveAtalho);
                callback(e);
                console.log(`Atalho executado: ${chaveAtalho}`);
            }
        };
        
        // Registrar atalhos padrão
        registrarAtalho('Ctrl+s', () => {
            alert('Salvamento simulado!');
        }, 'Salvar');
        
        registrarAtalho('Ctrl+z', () => {
            alert('Desfazer simulado!');
        }, 'Desfazer');
        
        registrarAtalho('Ctrl+Shift+i', () => {
            console.log('DevTools shortcut interceptado!');
        }, 'DevTools');
        
        registrarAtalho('F1', () => {
            alert('Ajuda simulada!');
        }, 'Ajuda');
        
        // Listener global
        document.addEventListener('keydown', processarAtalho);
        
        return {
            registrarAtalho,
            removerAtalho: (combinacao) => atalhos.delete(combinacao),
            listarAtalhos: () => Array.from(atalhos.entries()),
            destruir: () => document.removeEventListener('keydown', processarAtalho)
        };
    }
};

// --- 2.4 Eventos de Formulário ---
console.log('\n=== EVENTOS DE FORMULÁRIO ===');

const exemploEventsFormulario = {
    // Formulário com validação em tempo real
    criarFormularioValidacao() {
        const form = document.createElement('form');
        form.style.cssText = `
            max-width: 400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
        `;
        
        // Campo de email
        const emailGroup = document.createElement('div');
        emailGroup.innerHTML = `
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <span class="error"></span>
        `;
        
        // Campo de senha
        const senhaGroup = document.createElement('div');
        senhaGroup.innerHTML = `
            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" required>
            <span class="error"></span>
        `;
        
        // Botão de submit
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Enviar';
        
        form.appendChild(emailGroup);
        form.appendChild(senhaGroup);
        form.appendChild(submitBtn);
        
        const emailInput = form.querySelector('#email');
        const senhaInput = form.querySelector('#senha');
        
        // Validação de email em tempo real
        emailInput.addEventListener('input', (e) => {
            const email = e.target.value;
            const errorSpan = emailGroup.querySelector('.error');
            
            if (email && !email.includes('@')) {
                errorSpan.textContent = 'Email deve conter @';
                errorSpan.style.color = 'red';
                e.target.style.borderColor = 'red';
            } else {
                errorSpan.textContent = '';
                e.target.style.borderColor = email ? 'green' : '#ccc';
            }
        });
        
        // Validação de senha
        senhaInput.addEventListener('input', (e) => {
            const senha = e.target.value;
            const errorSpan = senhaGroup.querySelector('.error');
            
            if (senha.length > 0 && senha.length < 6) {
                errorSpan.textContent = 'Senha deve ter pelo menos 6 caracteres';
                errorSpan.style.color = 'red';
                e.target.style.borderColor = 'red';
            } else {
                errorSpan.textContent = '';
                e.target.style.borderColor = senha.length >= 6 ? 'green' : '#ccc';
            }
        });
        
        // Evento de submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());
            
            console.log('Formulário enviado:', dados);
            
            // Validação final
            if (dados.email && dados.senha && dados.senha.length >= 6) {
                alert('Formulário válido enviado!');
            } else {
                alert('Por favor, corrija os erros antes de enviar.');
            }
        });
        
        // Eventos de foco/blur para UX
        [emailInput, senhaInput].forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.style.boxShadow = 'none';
            });
        });
        
        return form;
    },
    
    // Sistema de auto-save
    criarAutoSave(form, intervalo = 5000) {
        let timeoutId;
        const dadosSalvos = new Map();
        
        const salvarDados = () => {
            const formData = new FormData(form);
            const dados = Object.fromEntries(formData.entries());
            
            // Simula salvamento (localStorage, API, etc.)
            dadosSalvos.set('formulario', dados);
            console.log('Auto-save executado:', dados);
            
            // Feedback visual
            const indicator = document.getElementById('save-indicator') || 
                             document.createElement('div');
            indicator.id = 'save-indicator';
            indicator.textContent = 'Salvo automaticamente';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: green;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
            `;
            
            if (!document.body.contains(indicator)) {
                document.body.appendChild(indicator);
            }
            
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 2000);
        };
        
        const agendarSalvamento = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(salvarDados, intervalo);
        };
        
        // Listener para mudanças no formulário
        form.addEventListener('input', agendarSalvamento);
        form.addEventListener('change', agendarSalvamento);
        
        return {
            salvarAgora: salvarDados,
            obterDadosSalvos: () => dadosSalvos.get('formulario'),
            destruir: () => {
                clearTimeout(timeoutId);
                form.removeEventListener('input', agendarSalvamento);
                form.removeEventListener('change', agendarSalvamento);
            }
        };
    }
};

// --- 2.5 Eventos de Janela ---
console.log('\n=== EVENTOS DE JANELA ===');

const exemploEventsJanela = {
    // Gerenciador de eventos de janela
    configurarEventosJanela() {
        // Evento de carregamento
        window.addEventListener('load', () => {
            console.log('Página totalmente carregada');
        });
        
        // Evento de redimensionamento
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('Janela redimensionada:', {
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }, 250); // Debounce
        });
        
        // Evento de scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                console.log('Scroll detectado:', {
                    x: window.scrollX,
                    y: window.scrollY
                });
            }, 100); // Throttle
        });
        
        // Evento antes de sair da página
        window.addEventListener('beforeunload', (e) => {
            // Apenas mostra aviso se houver dados não salvos
            const temDadosNaoSalvos = false; // Lógica de verificação
            
            if (temDadosNaoSalvos) {
                e.preventDefault();
                e.returnValue = ''; // Chrome requer isso
                return 'Você tem alterações não salvas. Deseja sair mesmo assim?';
            }
        });
        
        // Evento de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('Página ficou oculta');
                // Pausar animações, timers, etc.
            } else {
                console.log('Página ficou visível');
                // Retomar animações, timers, etc.
            }
        });
        
        // Evento de foco/blur da janela
        window.addEventListener('focus', () => {
            console.log('Janela ganhou foco');
        });
        
        window.addEventListener('blur', () => {
            console.log('Janela perdeu foco');
        });
    },
    
    // Sistema de detecção de inatividade
    criarDetectorInatividade(tempoLimite = 30000) { // 30 segundos
        let timeoutId;
        let ultimaAtividade = Date.now();
        
        const eventos = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        const resetarTimer = () => {
            ultimaAtividade = Date.now();
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(() => {
                console.log('Usuário inativo detectado');
                window.dispatchEvent(new CustomEvent('usuarioInativo', {
                    detail: { ultimaAtividade }
                }));
            }, tempoLimite);
        };
        
        // Registrar listeners para todos os eventos de atividade
        eventos.forEach(evento => {
            document.addEventListener(evento, resetarTimer, true);
        });
        
        // Iniciar timer
        resetarTimer();
        
        return {
            obterUltimaAtividade: () => ultimaAtividade,
            resetar: resetarTimer,
            destruir: () => {
                clearTimeout(timeoutId);
                eventos.forEach(evento => {
                    document.removeEventListener(evento, resetarTimer, true);
                });
            }
        };
    }
};

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Notificações Interativas ---
console.log('\n=== EXERCÍCIO 1: NOTIFICAÇÕES INTERATIVAS ===');

class SistemaNotificacoes {
    constructor(opcoes = {}) {
        this.opcoes = {
            posicao: 'top-right',
            tempoVida: 5000,
            maxNotificacoes: 5,
            animacao: true,
            ...opcoes
        };
        
        this.notificacoes = new Map();
        this.container = null;
        this.contadorId = 0;
        
        this.criarContainer();
    }
    
    // Criar container das notificações
    criarContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notificacoes-container';
        
        const posicoes = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;',
            'top-center': 'top: 20px; left: 50%; transform: translateX(-50%);',
            'bottom-center': 'bottom: 20px; left: 50%; transform: translateX(-50%);'
        };
        
        this.container.style.cssText = `
            position: fixed;
            ${posicoes[this.opcoes.posicao] || posicoes['top-right']}
            z-index: 10000;
            pointer-events: none;
        `;
        
        document.body.appendChild(this.container);
    }
    
    // Criar notificação
    criar(config) {
        const {
            tipo = 'info',
            titulo = '',
            mensagem = '',
            acoes = [],
            tempoVida = this.opcoes.tempoVida,
            persistente = false
        } = config;
        
        const id = ++this.contadorId;
        
        // Limitar número de notificações
        if (this.notificacoes.size >= this.opcoes.maxNotificacoes) {
            const primeiraNotificacao = this.notificacoes.keys().next().value;
            this.remover(primeiraNotificacao);
        }
        
        const elemento = this.criarElementoNotificacao({
            id, tipo, titulo, mensagem, acoes, persistente
        });
        
        this.container.appendChild(elemento);
        this.notificacoes.set(id, {
            elemento,
            config,
            criadaEm: Date.now()
        });
        
        // Animação de entrada
        if (this.opcoes.animacao) {
            elemento.style.transform = 'translateX(100%)';
            elemento.style.opacity = '0';
            
            requestAnimationFrame(() => {
                elemento.style.transition = 'all 0.3s ease';
                elemento.style.transform = 'translateX(0)';
                elemento.style.opacity = '1';
            });
        }
        
        // Auto-remoção
        if (!persistente && tempoVida > 0) {
            setTimeout(() => {
                this.remover(id);
            }, tempoVida);
        }
        
        return id;
    }
    
    // Criar elemento da notificação
    criarElementoNotificacao({ id, tipo, titulo, mensagem, acoes, persistente }) {
        const elemento = document.createElement('div');
        elemento.className = `notificacao notificacao-${tipo}`;
        elemento.dataset.id = id;
        
        const cores = {
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
        
        elemento.style.cssText = `
            background: white;
            border-left: 4px solid ${cores[tipo] || cores.info};
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            margin-bottom: 10px;
            max-width: 350px;
            min-width: 300px;
            padding: 16px;
            pointer-events: auto;
            position: relative;
        `;
        
        // Cabeçalho
        if (titulo) {
            const tituloEl = document.createElement('div');
            tituloEl.className = 'notificacao-titulo';
            tituloEl.style.cssText = `
                font-weight: bold;
                margin-bottom: 8px;
                color: #333;
            `;
            tituloEl.textContent = titulo;
            elemento.appendChild(tituloEl);
        }
        
        // Mensagem
        if (mensagem) {
            const mensagemEl = document.createElement('div');
            mensagemEl.className = 'notificacao-mensagem';
            mensagemEl.style.cssText = `
                color: #666;
                line-height: 1.4;
                margin-bottom: ${acoes.length > 0 ? '12px' : '0'};
            `;
            mensagemEl.textContent = mensagem;
            elemento.appendChild(mensagemEl);
        }
        
        // Ações
        if (acoes.length > 0) {
            const acoesContainer = document.createElement('div');
            acoesContainer.className = 'notificacao-acoes';
            acoesContainer.style.cssText = `
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            `;
            
            acoes.forEach(acao => {
                const botao = document.createElement('button');
                botao.textContent = acao.texto;
                botao.style.cssText = `
                    background: ${acao.primario ? cores[tipo] : 'transparent'};
                    border: 1px solid ${cores[tipo]};
                    border-radius: 3px;
                    color: ${acao.primario ? 'white' : cores[tipo]};
                    cursor: pointer;
                    font-size: 12px;
                    padding: 6px 12px;
                `;
                
                botao.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (acao.callback) {
                        acao.callback(id);
                    }
                    if (acao.fecharApos !== false) {
                        this.remover(id);
                    }
                });
                
                acoesContainer.appendChild(botao);
            });
            
            elemento.appendChild(acoesContainer);
        }
        
        // Botão de fechar
        if (!persistente) {
            const botaoFechar = document.createElement('button');
            botaoFechar.innerHTML = '&times;';
            botaoFechar.style.cssText = `
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                font-size: 18px;
                position: absolute;
                right: 8px;
                top: 8px;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            botaoFechar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remover(id);
            });
            
            elemento.appendChild(botaoFechar);
        }
        
        // Clique na notificação
        elemento.addEventListener('click', () => {
            this.remover(id);
        });
        
        return elemento;
    }
    
    // Remover notificação
    remover(id) {
        const notificacao = this.notificacoes.get(id);
        if (!notificacao) return false;
        
        const { elemento } = notificacao;
        
        if (this.opcoes.animacao) {
            elemento.style.transition = 'all 0.3s ease';
            elemento.style.transform = 'translateX(100%)';
            elemento.style.opacity = '0';
            
            setTimeout(() => {
                if (elemento.parentNode) {
                    elemento.parentNode.removeChild(elemento);
                }
                this.notificacoes.delete(id);
            }, 300);
        } else {
            if (elemento.parentNode) {
                elemento.parentNode.removeChild(elemento);
            }
            this.notificacoes.delete(id);
        }
        
        return true;
    }
    
    // Métodos de conveniência
    info(titulo, mensagem, opcoes = {}) {
        return this.criar({ tipo: 'info', titulo, mensagem, ...opcoes });
    }
    
    sucesso(titulo, mensagem, opcoes = {}) {
        return this.criar({ tipo: 'success', titulo, mensagem, ...opcoes });
    }
    
    aviso(titulo, mensagem, opcoes = {}) {
        return this.criar({ tipo: 'warning', titulo, mensagem, ...opcoes });
    }
    
    erro(titulo, mensagem, opcoes = {}) {
        return this.criar({ tipo: 'error', titulo, mensagem, ...opcoes });
    }
    
    // Limpar todas as notificações
    limparTodas() {
        Array.from(this.notificacoes.keys()).forEach(id => {
            this.remover(id);
        });
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        return {
            total: this.notificacoes.size,
            porTipo: Array.from(this.notificacoes.values()).reduce((acc, { config }) => {
                acc[config.tipo] = (acc[config.tipo] || 0) + 1;
                return acc;
            }, {})
        };
    }
    
    // Destruir sistema
    destruir() {
        this.limparTodas();
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }
}

// Exemplo de uso do sistema de notificações
const notificacoes = new SistemaNotificacoes();
console.log('Sistema de notificações criado!');

// --- EXERCÍCIO 2: Editor de Texto com Atalhos ---
console.log('\n=== EXERCÍCIO 2: EDITOR DE TEXTO ===');

class EditorTexto {
    constructor(container) {
        this.container = container;
        this.editor = null;
        this.toolbar = null;
        this.statusBar = null;
        this.historico = [];
        this.indiceHistorico = -1;
        this.atalhos = new Map();
        
        this.criarInterface();
        this.configurarEventos();
        this.registrarAtalhosPadrao();
    }
    
    // Criar interface do editor
    criarInterface() {
        this.container.style.cssText = `
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            overflow: hidden;
        `;
        
        // Toolbar
        this.toolbar = document.createElement('div');
        this.toolbar.className = 'editor-toolbar';
        this.toolbar.style.cssText = `
            background: #f5f5f5;
            border-bottom: 1px solid #ccc;
            display: flex;
            gap: 5px;
            padding: 8px;
        `;
        
        // Botões da toolbar
        const botoes = [
            { id: 'bold', texto: 'B', titulo: 'Negrito (Ctrl+B)' },
            { id: 'italic', texto: 'I', titulo: 'Itálico (Ctrl+I)' },
            { id: 'underline', texto: 'U', titulo: 'Sublinhado (Ctrl+U)' },
            { id: 'separator', texto: '|' },
            { id: 'undo', texto: '↶', titulo: 'Desfazer (Ctrl+Z)' },
            { id: 'redo', texto: '↷', titulo: 'Refazer (Ctrl+Y)' },
            { id: 'separator', texto: '|' },
            { id: 'clear', texto: '🗑', titulo: 'Limpar tudo' }
        ];
        
        botoes.forEach(botao => {
            if (botao.id === 'separator') {
                const sep = document.createElement('span');
                sep.textContent = botao.texto;
                sep.style.cssText = 'color: #ccc; margin: 0 5px;';
                this.toolbar.appendChild(sep);
            } else {
                const btn = document.createElement('button');
                btn.textContent = botao.texto;
                btn.title = botao.titulo;
                btn.dataset.acao = botao.id;
                btn.style.cssText = `
                    background: white;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    cursor: pointer;
                    font-weight: bold;
                    height: 30px;
                    width: 30px;
                `;
                
                btn.addEventListener('click', () => this.executarAcao(botao.id));
                this.toolbar.appendChild(btn);
            }
        });
        
        // Área de edição
        this.editor = document.createElement('div');
        this.editor.contentEditable = true;
        this.editor.style.cssText = `
            min-height: 300px;
            padding: 16px;
            outline: none;
            line-height: 1.5;
        `;
        this.editor.innerHTML = '<p>Digite seu texto aqui...</p>';
        
        // Barra de status
        this.statusBar = document.createElement('div');
        this.statusBar.className = 'editor-status';
        this.statusBar.style.cssText = `
            background: #f5f5f5;
            border-top: 1px solid #ccc;
            font-size: 12px;
            padding: 8px 16px;
            color: #666;
        `;
        
        this.container.appendChild(this.toolbar);
        this.container.appendChild(this.editor);
        this.container.appendChild(this.statusBar);
        
        this.atualizarStatus();
    }
    
    // Configurar eventos
    configurarEventos() {
        // Eventos de input
        this.editor.addEventListener('input', () => {
            this.salvarEstado();
            this.atualizarStatus();
        });
        
        // Eventos de seleção
        this.editor.addEventListener('selectionchange', () => {
            this.atualizarStatus();
        });
        
        // Eventos de teclado
        this.editor.addEventListener('keydown', (e) => {
            this.processarAtalho(e);
        });
        
        // Eventos de foco
        this.editor.addEventListener('focus', () => {
            this.container.style.borderColor = '#007cba';
        });
        
        this.editor.addEventListener('blur', () => {
            this.container.style.borderColor = '#ccc';
        });
    }
    
    // Registrar atalhos padrão
    registrarAtalhosPadrao() {
        this.registrarAtalho('Ctrl+b', () => this.executarAcao('bold'));
        this.registrarAtalho('Ctrl+i', () => this.executarAcao('italic'));
        this.registrarAtalho('Ctrl+u', () => this.executarAcao('underline'));
        this.registrarAtalho('Ctrl+z', () => this.executarAcao('undo'));
        this.registrarAtalho('Ctrl+y', () => this.executarAcao('redo'));
        this.registrarAtalho('Ctrl+a', (e) => {
            e.preventDefault();
            this.selecionarTudo();
        });
    }
    
    // Registrar atalho
    registrarAtalho(combinacao, callback) {
        this.atalhos.set(combinacao.toLowerCase(), callback);
    }
    
    // Processar atalho
    processarAtalho(e) {
        const combinacao = [];
        
        if (e.ctrlKey) combinacao.push('ctrl');
        if (e.shiftKey) combinacao.push('shift');
        if (e.altKey) combinacao.push('alt');
        
        combinacao.push(e.key.toLowerCase());
        
        const chaveAtalho = combinacao.join('+');
        
        if (this.atalhos.has(chaveAtalho)) {
            e.preventDefault();
            this.atalhos.get(chaveAtalho)(e);
        }
    }
    
    // Executar ação
    executarAcao(acao) {
        switch (acao) {
            case 'bold':
                document.execCommand('bold');
                break;
            case 'italic':
                document.execCommand('italic');
                break;
            case 'underline':
                document.execCommand('underline');
                break;
            case 'undo':
                this.desfazer();
                break;
            case 'redo':
                this.refazer();
                break;
            case 'clear':
                if (confirm('Limpar todo o conteúdo?')) {
                    this.editor.innerHTML = '<p></p>';
                    this.salvarEstado();
                }
                break;
        }
        
        this.atualizarStatus();
    }
    
    // Salvar estado para histórico
    salvarEstado() {
        const estado = this.editor.innerHTML;
        
        // Remove estados futuros se estamos no meio do histórico
        if (this.indiceHistorico < this.historico.length - 1) {
            this.historico = this.historico.slice(0, this.indiceHistorico + 1);
        }
        
        this.historico.push(estado);
        this.indiceHistorico++;
        
        // Limita o tamanho do histórico
        if (this.historico.length > 50) {
            this.historico.shift();
            this.indiceHistorico--;
        }
    }
    
    // Desfazer
    desfazer() {
        if (this.indiceHistorico > 0) {
            this.indiceHistorico--;
            this.editor.innerHTML = this.historico[this.indiceHistorico];
        }
    }
    
    // Refazer
    refazer() {
        if (this.indiceHistorico < this.historico.length - 1) {
            this.indiceHistorico++;
            this.editor.innerHTML = this.historico[this.indiceHistorico];
        }
    }
    
    // Selecionar tudo
    selecionarTudo() {
        const range = document.createRange();
        range.selectNodeContents(this.editor);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
    // Atualizar barra de status
    atualizarStatus() {
        const texto = this.editor.textContent || '';
        const palavras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
        const caracteres = texto.length;
        const linhas = this.editor.innerHTML.split('<div>').length;
        
        this.statusBar.textContent = 
            `Palavras: ${palavras} | Caracteres: ${caracteres} | Linhas: ${linhas}`;
    }
    
    // Obter conteúdo
    obterConteudo() {
        return {
            html: this.editor.innerHTML,
            texto: this.editor.textContent
        };
    }
    
    // Definir conteúdo
    definirConteudo(conteudo) {
        this.editor.innerHTML = conteudo;
        this.salvarEstado();
        this.atualizarStatus();
    }
}

// Exemplo de uso do editor
console.log('Editor de texto criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasOtimizacao = {
    // Performance de eventos
    performance: {
        // Debounce para eventos frequentes
        debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        },
        
        // Throttle para eventos contínuos
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Pool de event listeners
        poolEventListeners: new Map(),
        
        obterListener(tipo, handler) {
            const chave = `${tipo}-${handler.toString()}`;
            if (!this.poolEventListeners.has(chave)) {
                this.poolEventListeners.set(chave, handler);
            }
            return this.poolEventListeners.get(chave);
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Cleanup automático de listeners
        criarCleanupAutomatico() {
            const listeners = new WeakMap();
            
            return {
                adicionar(elemento, tipo, handler, opcoes) {
                    elemento.addEventListener(tipo, handler, opcoes);
                    
                    if (!listeners.has(elemento)) {
                        listeners.set(elemento, []);
                    }
                    listeners.get(elemento).push({ tipo, handler, opcoes });
                },
                
                removerTodos(elemento) {
                    const elementoListeners = listeners.get(elemento);
                    if (elementoListeners) {
                        elementoListeners.forEach(({ tipo, handler }) => {
                            elemento.removeEventListener(tipo, handler);
                        });
                        listeners.delete(elemento);
                    }
                }
            };
        },
        
        // Observer para limpeza automática
        criarObservadorLimpeza() {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Limpar listeners do elemento removido
                            console.log('Elemento removido, limpando listeners:', node);
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            return observer;
        }
    },
    
    // Boas práticas
    boasPraticas: {
        // Usar passive listeners quando possível
        exemploPassiveListeners() {
            // Para eventos de scroll/touch que não precisam de preventDefault
            document.addEventListener('scroll', (e) => {
                // Apenas leitura, sem preventDefault
                console.log('Scroll position:', window.scrollY);
            }, { passive: true });
        },
        
        // Usar AbortController para cancelamento
        exemploAbortController() {
            const controller = new AbortController();
            
            document.addEventListener('click', (e) => {
                console.log('Click detectado');
            }, { signal: controller.signal });
            
            // Cancelar todos os listeners associados
            setTimeout(() => {
                controller.abort();
            }, 10000);
        },
        
        // Event delegation para elementos dinâmicos
        exemploEventDelegation() {
            // Em vez de adicionar listener a cada botão
            document.addEventListener('click', (e) => {
                if (e.target.matches('.botao-dinamico')) {
                    console.log('Botão dinâmico clicado:', e.target);
                }
            });
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');

const referencias = {
    documentacao: [
        'MDN - Introduction to events: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events',
        'MDN - Event reference: https://developer.mozilla.org/en-US/docs/Web/Events',
        'MDN - EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget',
        'MDN - Event delegation: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation'
    ],
    
    topicosAvancados: [
        'Event delegation e bubbling avançado',
        'Custom events e comunicação entre componentes',
        'Performance de eventos em aplicações grandes',
        'Eventos touch e gestos móveis',
        'Web Workers e eventos assíncronos'
    ],
    
    proximosPassos: [
        'Estudar event delegation em detalhes',
        'Aprender sobre eventos customizados',
        'Dominar handling de eventos complexos',
        'Implementar sistemas de eventos robustos'
    ]
};

console.log('Referências carregadas. Próximo arquivo: Event Delegation!');

/*
===========================================
RESUMO DO MÓDULO - EVENT LISTENERS
===========================================

✅ CONCEITOS APRENDIDOS:
• Sistema de eventos do JavaScript
• Diferentes tipos de eventos (mouse, teclado, formulário, janela)
• Métodos de registro de event listeners
• Fases do evento (capturing, target, bubbling)
• Opções avançadas (once, passive, signal)

🎯 HABILIDADES DESENVOLVIDAS:
• Sistema de notificações interativas
• Editor de texto com atalhos
• Gerenciamento de eventos de mouse e teclado
• Auto-save e detecção de inatividade
• Otimização de performance com debounce/throttle

📚 PRÓXIMA AULA:
• Event delegation
• Bubbling e capturing
• Eventos em elementos dinâmicos
• Padrões avançados de eventos

===========================================
*/