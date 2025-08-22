/*
===========================================
    CURSO JAVASCRIPT - EVENTOS
===========================================

Este arquivo aborda:
- Conceitos básicos de eventos
- Event listeners e handlers
- Objeto Event e suas propriedades
- Propagação de eventos (bubbling e capturing)
- Delegação de eventos
- Eventos de mouse, teclado e formulário
- Eventos customizados
- Performance e boas práticas
- Exemplos práticos avançados

NOTA: Este arquivo contém código JavaScript para manipulação de eventos.
Para testar os exemplos, você precisará de um arquivo HTML.
*/

// ========================================
// 1. CONCEITOS BÁSICOS DE EVENTOS
// ========================================

/*
Eventos são ações que ocorrem no navegador:
- Cliques do mouse
- Teclas pressionadas
- Carregamento da página
- Redimensionamento da janela
- Envio de formulários
- Etc.

O JavaScript pode "escutar" esses eventos e executar código em resposta.
*/

// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado completamente!');
    
    // Código que precisa do DOM carregado vai aqui
    inicializarEventos();
});

// Aguardar carregamento completo da página (incluindo imagens)
window.addEventListener('load', function() {
    console.log('Página carregada completamente!');
});

// ========================================
// 2. ADICIONANDO EVENT LISTENERS
// ========================================

function inicializarEventos() {
    // Método moderno e recomendado: addEventListener()
    const botao = document.getElementById('meuBotao');
    if (botao) {
        // Sintaxe: elemento.addEventListener(evento, função, opções)
        botao.addEventListener('click', function() {
            console.log('Botão clicado!');
        });
        
        // Usando arrow function
        botao.addEventListener('click', () => {
            console.log('Botão clicado com arrow function!');
        });
        
        // Referenciando função externa
        botao.addEventListener('click', handleBotaoClick);
    }
    
    // Múltiplos listeners para o mesmo evento
    const input = document.getElementById('meuInput');
    if (input) {
        input.addEventListener('focus', () => console.log('Input focado'));
        input.addEventListener('focus', () => console.log('Segundo listener de foco'));
        input.addEventListener('blur', () => console.log('Input perdeu foco'));
    }
}

// Função handler externa
function handleBotaoClick(event) {
    console.log('Função externa executada!');
    console.log('Elemento clicado:', event.target);
}

// ========================================
// 3. REMOVENDO EVENT LISTENERS
// ========================================

function exemploRemocaoEventos() {
    const botao = document.getElementById('botaoTemporario');
    if (!botao) return;
    
    // Função nomeada para poder remover depois
    function clickTemporario() {
        console.log('Clique temporário!');
        // Remove o próprio listener após primeiro clique
        botao.removeEventListener('click', clickTemporario);
    }
    
    // Adiciona o listener
    botao.addEventListener('click', clickTemporario);
    
    // Remover após 5 segundos (exemplo)
    setTimeout(() => {
        botao.removeEventListener('click', clickTemporario);
        console.log('Listener removido após timeout');
    }, 5000);
}

// ========================================
// 4. OBJETO EVENT E SUAS PROPRIEDADES
// ========================================

function analisarEvento(event) {
    console.log('=== PROPRIEDADES DO EVENTO ==>');
    
    // Propriedades básicas
    console.log('Tipo do evento:', event.type);
    console.log('Elemento alvo:', event.target);
    console.log('Elemento atual (this):', event.currentTarget);
    console.log('Timestamp:', event.timeStamp);
    
    // Propriedades de mouse
    if (event.type.includes('mouse') || event.type === 'click') {
        console.log('Posição X:', event.clientX);
        console.log('Posição Y:', event.clientY);
        console.log('Posição X na página:', event.pageX);
        console.log('Posição Y na página:', event.pageY);
        console.log('Botão do mouse:', event.button); // 0=esquerdo, 1=meio, 2=direito
        console.log('Botões pressionados:', event.buttons);
    }
    
    // Teclas modificadoras
    console.log('Ctrl pressionado:', event.ctrlKey);
    console.log('Shift pressionado:', event.shiftKey);
    console.log('Alt pressionado:', event.altKey);
    console.log('Meta pressionado:', event.metaKey); // Cmd no Mac, Win no Windows
    
    // Propriedades de teclado
    if (event.type.includes('key')) {
        console.log('Tecla:', event.key);
        console.log('Código da tecla:', event.code);
        console.log('Código numérico (deprecated):', event.keyCode);
    }
}

// Exemplo de uso
function configurarAnaliseEventos() {
    const elemento = document.getElementById('elementoAnalise');
    if (elemento) {
        elemento.addEventListener('click', analisarEvento);
        elemento.addEventListener('keydown', analisarEvento);
        elemento.addEventListener('mouseover', analisarEvento);
    }
}

// ========================================
// 5. PROPAGAÇÃO DE EVENTOS
// ========================================

/*
Propagação de eventos tem 3 fases:
1. CAPTURING: Do document até o elemento alvo
2. TARGET: No elemento alvo
3. BUBBLING: Do elemento alvo até o document
*/

function demonstrarPropagacao() {
    const pai = document.getElementById('elementoPai');
    const filho = document.getElementById('elementoFilho');
    
    if (pai && filho) {
        // Fase de bubbling (padrão)
        pai.addEventListener('click', () => {
            console.log('Clique no PAI (bubbling)');
        });
        
        filho.addEventListener('click', () => {
            console.log('Clique no FILHO (bubbling)');
        });
        
        // Fase de capturing (terceiro parâmetro = true)
        pai.addEventListener('click', () => {
            console.log('Clique no PAI (capturing)');
        }, true);
        
        filho.addEventListener('click', () => {
            console.log('Clique no FILHO (capturing)');
        }, true);
    }
}

// Controlando a propagação
function controlarPropagacao() {
    const botaoStop = document.getElementById('botaoStopPropagation');
    const botaoPrevent = document.getElementById('botaoPreventDefault');
    
    if (botaoStop) {
        botaoStop.addEventListener('click', function(event) {
            console.log('Clique no botão - propagação interrompida');
            event.stopPropagation(); // Para a propagação
        });
        
        // Este listener no pai não será executado devido ao stopPropagation
        botaoStop.parentElement?.addEventListener('click', () => {
            console.log('Este não será executado se stopPropagation for chamado');
        });
    }
    
    if (botaoPrevent) {
        botaoPrevent.addEventListener('click', function(event) {
            console.log('Comportamento padrão prevenido');
            event.preventDefault(); // Previne comportamento padrão
        });
    }
    
    // stopImmediatePropagation() - para todos os listeners
    const botaoImmediate = document.getElementById('botaoImmediate');
    if (botaoImmediate) {
        botaoImmediate.addEventListener('click', function(event) {
            console.log('Primeiro listener');
            event.stopImmediatePropagation();
        });
        
        botaoImmediate.addEventListener('click', function() {
            console.log('Este não será executado');
        });
    }
}

// ========================================
// 6. DELEGAÇÃO DE EVENTOS
// ========================================

/*
Delegação de eventos é uma técnica onde adicionamos um listener
no elemento pai para capturar eventos dos filhos.
Útil para elementos criados dinamicamente.
*/

class GerenciadorLista {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.items = [];
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.criarInterface();
        this.configurarDelegacao();
    }
    
    criarInterface() {
        this.container.innerHTML = `
            <div class="lista-dinamica">
                <button id="adicionar-item">Adicionar Item</button>
                <ul id="lista-items"></ul>
            </div>
        `;
    }
    
    configurarDelegacao() {
        // Delegação de eventos no container
        this.container.addEventListener('click', (event) => {
            const target = event.target;
            
            // Adicionar novo item
            if (target.id === 'adicionar-item') {
                this.adicionarItem();
            }
            
            // Remover item (usando closest para encontrar o li)
            if (target.classList.contains('remover-item')) {
                const li = target.closest('li');
                if (li) {
                    this.removerItem(li.dataset.id);
                }
            }
            
            // Editar item
            if (target.classList.contains('editar-item')) {
                const li = target.closest('li');
                if (li) {
                    this.editarItem(li.dataset.id);
                }
            }
        });
        
        // Delegação para eventos de teclado
        this.container.addEventListener('keydown', (event) => {
            if (event.target.classList.contains('item-input')) {
                if (event.key === 'Enter') {
                    this.salvarEdicao(event.target);
                }
                if (event.key === 'Escape') {
                    this.cancelarEdicao(event.target);
                }
            }
        });
    }
    
    adicionarItem() {
        const id = Date.now().toString();
        const texto = `Item ${this.items.length + 1}`;
        
        this.items.push({ id, texto });
        this.renderizarLista();
    }
    
    removerItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.renderizarLista();
    }
    
    editarItem(id) {
        const li = this.container.querySelector(`li[data-id="${id}"]`);
        const span = li.querySelector('.item-texto');
        const textoAtual = span.textContent;
        
        span.innerHTML = `<input type="text" class="item-input" value="${textoAtual}">`;
        const input = span.querySelector('input');
        input.focus();
        input.select();
    }
    
    salvarEdicao(input) {
        const li = input.closest('li');
        const id = li.dataset.id;
        const novoTexto = input.value.trim();
        
        if (novoTexto) {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.texto = novoTexto;
                this.renderizarLista();
            }
        }
    }
    
    cancelarEdicao(input) {
        this.renderizarLista();
    }
    
    renderizarLista() {
        const lista = this.container.querySelector('#lista-items');
        lista.innerHTML = this.items.map(item => `
            <li data-id="${item.id}">
                <span class="item-texto">${item.texto}</span>
                <button class="editar-item">✏️</button>
                <button class="remover-item">🗑️</button>
            </li>
        `).join('');
    }
}

// ========================================
// 7. EVENTOS DE MOUSE
// ========================================

function configurarEventosMouse() {
    const area = document.getElementById('areaMouse');
    if (!area) return;
    
    // Eventos básicos de mouse
    area.addEventListener('mousedown', (e) => {
        console.log('Mouse pressionado:', e.button);
    });
    
    area.addEventListener('mouseup', (e) => {
        console.log('Mouse solto:', e.button);
    });
    
    area.addEventListener('click', (e) => {
        console.log('Clique simples');
    });
    
    area.addEventListener('dblclick', (e) => {
        console.log('Clique duplo');
    });
    
    area.addEventListener('contextmenu', (e) => {
        console.log('Menu de contexto (botão direito)');
        // e.preventDefault(); // Previne menu padrão
    });
    
    // Eventos de movimento
    area.addEventListener('mousemove', (e) => {
        // Throttle para performance
        if (!area.dataset.lastMove || Date.now() - area.dataset.lastMove > 100) {
            console.log(`Mouse em: ${e.clientX}, ${e.clientY}`);
            area.dataset.lastMove = Date.now();
        }
    });
    
    area.addEventListener('mouseenter', () => {
        console.log('Mouse entrou na área');
        area.style.backgroundColor = '#f0f0f0';
    });
    
    area.addEventListener('mouseleave', () => {
        console.log('Mouse saiu da área');
        area.style.backgroundColor = '';
    });
    
    // mouseover vs mouseenter
    // mouseover: dispara para elemento e filhos
    // mouseenter: dispara apenas para o elemento
    
    area.addEventListener('mouseover', (e) => {
        console.log('Mouseover (inclui filhos):', e.target.tagName);
    });
    
    area.addEventListener('mouseout', (e) => {
        console.log('Mouseout (inclui filhos):', e.target.tagName);
    });
}

// ========================================
// 8. EVENTOS DE TECLADO
// ========================================

function configurarEventosTeclado() {
    const input = document.getElementById('inputTeclado');
    if (!input) return;
    
    // Eventos de teclado
    input.addEventListener('keydown', (e) => {
        console.log('Tecla pressionada:', e.key, e.code);
        
        // Teclas especiais
        if (e.key === 'Enter') {
            console.log('Enter pressionado!');
        }
        
        if (e.key === 'Escape') {
            console.log('Escape pressionado!');
            input.blur();
        }
        
        // Combinações de teclas
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            console.log('Ctrl+S interceptado!');
        }
        
        if (e.shiftKey && e.key === 'Tab') {
            console.log('Shift+Tab (navegação reversa)');
        }
    });
    
    input.addEventListener('keyup', (e) => {
        console.log('Tecla solta:', e.key);
    });
    
    input.addEventListener('keypress', (e) => {
        // Deprecated, mas ainda usado
        console.log('Keypress (deprecated):', e.key);
    });
    
    // Eventos de input (mais modernos)
    input.addEventListener('input', (e) => {
        console.log('Valor alterado:', e.target.value);
    });
    
    input.addEventListener('change', (e) => {
        console.log('Mudança confirmada:', e.target.value);
    });
}

// Atalhos de teclado globais
function configurarAtalhosTeclado() {
    document.addEventListener('keydown', (e) => {
        // Atalhos globais
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k':
                    e.preventDefault();
                    console.log('Atalho Ctrl/Cmd+K');
                    break;
                case '/':
                    e.preventDefault();
                    console.log('Atalho Ctrl/Cmd+/');
                    break;
            }
        }
        
        // Teclas de função
        if (e.key.startsWith('F')) {
            console.log('Tecla de função:', e.key);
        }
        
        // Setas de navegação
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            console.log('Seta pressionada:', e.key);
        }
    });
}

// ========================================
// 9. EVENTOS DE FORMULÁRIO
// ========================================

function configurarEventosFormulario() {
    const form = document.getElementById('meuFormulario');
    if (!form) return;
    
    // Evento de submit
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Previne envio padrão
        console.log('Formulário enviado!');
        
        // Validação customizada
        const dados = new FormData(form);
        const valores = Object.fromEntries(dados);
        console.log('Dados do formulário:', valores);
        
        // Simular validação
        if (!valores.nome) {
            alert('Nome é obrigatório!');
            return;
        }
        
        console.log('Formulário válido, enviando...');
    });
    
    // Eventos em campos específicos
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            console.log('Campo focado:', e.target.name);
            e.target.classList.add('focused');
        });
        
        input.addEventListener('blur', (e) => {
            console.log('Campo perdeu foco:', e.target.name);
            e.target.classList.remove('focused');
            
            // Validação em tempo real
            validarCampo(e.target);
        });
        
        input.addEventListener('input', (e) => {
            // Limpar erros enquanto digita
            e.target.classList.remove('error');
        });
    });
    
    // Evento de reset
    form.addEventListener('reset', () => {
        console.log('Formulário resetado!');
        // Limpar classes de erro
        inputs.forEach(input => {
            input.classList.remove('error', 'focused');
        });
    });
}

function validarCampo(campo) {
    let valido = true;
    
    // Validações específicas por tipo
    switch (campo.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valido = emailRegex.test(campo.value);
            break;
        case 'tel':
            const telRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            valido = telRegex.test(campo.value);
            break;
        default:
            valido = campo.value.trim() !== '';
    }
    
    if (!valido) {
        campo.classList.add('error');
        console.log('Campo inválido:', campo.name);
    } else {
        campo.classList.remove('error');
    }
    
    return valido;
}

// ========================================
// 10. EVENTOS DE JANELA E DOCUMENTO
// ========================================

function configurarEventosJanela() {
    // Redimensionamento da janela
    window.addEventListener('resize', () => {
        console.log('Janela redimensionada:', window.innerWidth, 'x', window.innerHeight);
    });
    
    // Scroll da página
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollPercent = (scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        console.log('Scroll:', scrollPercent.toFixed(2) + '%');
    });
    
    // Antes de sair da página
    window.addEventListener('beforeunload', (e) => {
        // Mostrar confirmação (apenas em certas condições)
        const temAlteracoes = false; // Lógica para verificar alterações
        if (temAlteracoes) {
            e.preventDefault();
            e.returnValue = ''; // Necessário para alguns navegadores
        }
    });
    
    // Mudança de visibilidade da página
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Página ficou oculta');
            // Pausar animações, vídeos, etc.
        } else {
            console.log('Página ficou visível');
            // Retomar atividades
        }
    });
    
    // Mudança de foco da janela
    window.addEventListener('focus', () => {
        console.log('Janela ganhou foco');
    });
    
    window.addEventListener('blur', () => {
        console.log('Janela perdeu foco');
    });
}

// ========================================
// 11. EVENTOS CUSTOMIZADOS
// ========================================

class EventoCustomizado {
    constructor() {
        this.configurarEventosCustomizados();
    }
    
    configurarEventosCustomizados() {
        // Escutar evento customizado
        document.addEventListener('meuEventoCustom', (e) => {
            console.log('Evento customizado recebido:', e.detail);
        });
        
        // Escutar evento de usuário logado
        document.addEventListener('usuarioLogado', (e) => {
            console.log('Usuário logado:', e.detail.usuario);
            this.atualizarInterface(e.detail.usuario);
        });
        
        // Escutar evento de carrinho atualizado
        document.addEventListener('carrinhoAtualizado', (e) => {
            console.log('Carrinho atualizado:', e.detail);
            this.atualizarContadorCarrinho(e.detail.total);
        });
    }
    
    // Disparar evento customizado simples
    dispararEventoSimples() {
        const evento = new Event('meuEventoCustom');
        document.dispatchEvent(evento);
    }
    
    // Disparar evento customizado com dados
    dispararEventoComDados(dados) {
        const evento = new CustomEvent('usuarioLogado', {
            detail: {
                usuario: dados.usuario,
                timestamp: new Date(),
                origem: 'login-form'
            },
            bubbles: true,
            cancelable: true
        });
        
        document.dispatchEvent(evento);
    }
    
    // Simular login
    simularLogin() {
        const dadosUsuario = {
            usuario: {
                id: 123,
                nome: 'João Silva',
                email: 'joao@email.com'
            }
        };
        
        this.dispararEventoComDados(dadosUsuario);
    }
    
    // Simular atualização do carrinho
    atualizarCarrinho(item, quantidade) {
        const evento = new CustomEvent('carrinhoAtualizado', {
            detail: {
                item,
                quantidade,
                total: this.calcularTotal(),
                timestamp: new Date()
            }
        });
        
        document.dispatchEvent(evento);
    }
    
    calcularTotal() {
        // Lógica para calcular total do carrinho
        return Math.floor(Math.random() * 1000) + 100;
    }
    
    atualizarInterface(usuario) {
        console.log('Atualizando interface para:', usuario.nome);
        // Lógica para atualizar UI
    }
    
    atualizarContadorCarrinho(total) {
        console.log('Atualizando contador do carrinho:', total);
        // Lógica para atualizar contador
    }
}

// ========================================
// 12. PERFORMANCE E THROTTLING
// ========================================

// Função de throttle
function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
        const currentTime = Date.now();
        
        if (currentTime - lastExecTime > delay) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, delay - (currentTime - lastExecTime));
        }
    };
}

// Função de debounce
function debounce(func, delay) {
    let timeoutId;
    
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Exemplos de uso
function configurarPerformance() {
    const input = document.getElementById('inputBusca');
    const area = document.getElementById('areaScroll');
    
    if (input) {
        // Debounce para busca (aguarda parar de digitar)
        const buscarDebounced = debounce((valor) => {
            console.log('Buscando por:', valor);
            // Lógica de busca aqui
        }, 300);
        
        input.addEventListener('input', (e) => {
            buscarDebounced(e.target.value);
        });
    }
    
    if (area) {
        // Throttle para scroll (limita frequência)
        const scrollThrottled = throttle(() => {
            console.log('Scroll throttled:', area.scrollTop);
            // Lógica de scroll aqui
        }, 100);
        
        area.addEventListener('scroll', scrollThrottled);
    }
    
    // Throttle para resize
    const resizeThrottled = throttle(() => {
        console.log('Resize throttled:', window.innerWidth);
        // Lógica de redimensionamento
    }, 250);
    
    window.addEventListener('resize', resizeThrottled);
}

// ========================================
// 13. EXEMPLO PRÁTICO: DRAG AND DROP
// ========================================

class DragAndDrop {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.criarInterface();
        this.configurarEventos();
    }
    
    criarInterface() {
        this.container.innerHTML = `
            <div class="drag-drop-demo">
                <h3>Drag and Drop Demo</h3>
                <div class="drag-area">
                    <div class="draggable-item" draggable="true" data-id="1">Item 1</div>
                    <div class="draggable-item" draggable="true" data-id="2">Item 2</div>
                    <div class="draggable-item" draggable="true" data-id="3">Item 3</div>
                </div>
                <div class="drop-zones">
                    <div class="drop-zone" data-zone="a">Zona A</div>
                    <div class="drop-zone" data-zone="b">Zona B</div>
                    <div class="drop-zone" data-zone="c">Zona C</div>
                </div>
            </div>
        `;
    }
    
    configurarEventos() {
        // Eventos nos itens arrastáveis
        this.container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                e.target.classList.add('dragging');
                console.log('Iniciou arraste:', e.target.dataset.id);
            }
        });
        
        this.container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('draggable-item')) {
                e.target.classList.remove('dragging');
                console.log('Terminou arraste');
            }
        });
        
        // Eventos nas zonas de drop
        this.container.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault(); // Necessário para permitir drop
                e.target.classList.add('drag-over');
            }
        });
        
        this.container.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.target.classList.remove('drag-over');
            }
        });
        
        this.container.addEventListener('drop', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                
                const itemId = e.dataTransfer.getData('text/plain');
                const zona = e.target.dataset.zone;
                
                console.log(`Item ${itemId} solto na zona ${zona}`);
                
                // Mover o item visualmente
                const item = this.container.querySelector(`[data-id="${itemId}"]`);
                if (item) {
                    e.target.appendChild(item);
                }
            }
        });
    }
}

// ========================================
// 14. EXEMPLO PRÁTICO: MODAL INTERATIVO
// ========================================

class ModalInterativo {
    constructor() {
        this.modal = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.criarModal();
        this.configurarEventos();
    }
    
    criarModal() {
        // Criar modal se não existir
        if (!document.getElementById('modal-interativo')) {
            const modalHTML = `
                <div id="modal-interativo" class="modal" style="display: none;">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Modal Interativo</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>Conteúdo do modal...</p>
                            <input type="text" placeholder="Digite algo...">
                        </div>
                        <div class="modal-footer">
                            <button class="btn-cancelar">Cancelar</button>
                            <button class="btn-confirmar">Confirmar</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        this.modal = document.getElementById('modal-interativo');
    }
    
    configurarEventos() {
        if (!this.modal) return;
        
        // Fechar modal
        this.modal.addEventListener('click', (e) => {
            // Fechar ao clicar no backdrop
            if (e.target.classList.contains('modal-backdrop')) {
                this.fechar();
            }
            
            // Fechar ao clicar no X
            if (e.target.classList.contains('modal-close')) {
                this.fechar();
            }
            
            // Botão cancelar
            if (e.target.classList.contains('btn-cancelar')) {
                this.fechar();
            }
            
            // Botão confirmar
            if (e.target.classList.contains('btn-confirmar')) {
                this.confirmar();
            }
        });
        
        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.fechar();
            }
        });
        
        // Trap focus no modal
        this.modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.trapFocus(e);
            }
        });
    }
    
    abrir() {
        if (this.modal) {
            this.modal.style.display = 'block';
            this.isOpen = true;
            
            // Focar primeiro elemento focável
            const primeiroFocavel = this.modal.querySelector('input, button, [tabindex]');
            if (primeiroFocavel) {
                primeiroFocavel.focus();
            }
            
            // Prevenir scroll do body
            document.body.style.overflow = 'hidden';
            
            console.log('Modal aberto');
        }
    }
    
    fechar() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.isOpen = false;
            
            // Restaurar scroll do body
            document.body.style.overflow = '';
            
            console.log('Modal fechado');
        }
    }
    
    confirmar() {
        const input = this.modal.querySelector('input');
        const valor = input ? input.value : '';
        
        console.log('Modal confirmado com valor:', valor);
        
        // Disparar evento customizado
        const evento = new CustomEvent('modalConfirmado', {
            detail: { valor }
        });
        document.dispatchEvent(evento);
        
        this.fechar();
    }
    
    trapFocus(e) {
        const focaveis = this.modal.querySelectorAll(
            'input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];
        
        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === primeiro) {
                e.preventDefault();
                ultimo.focus();
            }
        } else {
            // Tab
            if (document.activeElement === ultimo) {
                e.preventDefault();
                primeiro.focus();
            }
        }
    }
}

// ========================================
// 15. INICIALIZAÇÃO E EXERCÍCIOS
// ========================================

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIALIZANDO EVENTOS ==>');
    
    // Configurar todos os exemplos
    configurarAnaliseEventos();
    demonstrarPropagacao();
    controlarPropagacao();
    configurarEventosMouse();
    configurarEventosTeclado();
    configurarAtalhosTeclado();
    configurarEventosFormulario();
    configurarEventosJanela();
    configurarPerformance();
    
    // Inicializar classes
    const eventosCustomizados = new EventoCustomizado();
    const modal = new ModalInterativo();
    
    // Exemplos condicionais (se elementos existirem)
    if (document.getElementById('lista-dinamica')) {
        new GerenciadorLista('lista-dinamica');
    }
    
    if (document.getElementById('drag-drop-container')) {
        new DragAndDrop('drag-drop-container');
    }
    
    // Botão para abrir modal
    const botaoModal = document.getElementById('abrir-modal');
    if (botaoModal) {
        botaoModal.addEventListener('click', () => modal.abrir());
    }
    
    // Escutar evento customizado do modal
    document.addEventListener('modalConfirmado', (e) => {
        console.log('Recebido evento de modal confirmado:', e.detail);
    });
});

/*
========================================
EXERCÍCIOS PROPOSTOS
========================================

EXERCÍCIO 1: Sistema de Notificações
Crie um sistema que:
- Mostre notificações toast
- Diferentes tipos (sucesso, erro, aviso)
- Auto-dismiss após tempo configurável
- Botão para fechar manualmente
- Máximo de notificações simultâneas

EXERCÍCIO 2: Editor de Texto Simples
Implemente:
- Área de texto editável
- Atalhos de teclado (Ctrl+B para negrito, etc.)
- Contador de caracteres em tempo real
- Auto-save com debounce
- Histórico de undo/redo

EXERCÍCIO 3: Galeria com Lightbox
Crie:
- Grid de imagens em miniatura
- Lightbox ao clicar na imagem
- Navegação por teclado (setas, escape)
- Zoom com scroll do mouse
- Slideshow automático opcional

EXERCÍCIO 4: Formulário Multi-etapas
Implemente:
- Formulário dividido em etapas
- Navegação entre etapas
- Validação por etapa
- Progresso visual
- Salvamento automático

EXERCÍCIO 5: Jogo da Memória
Crie:
- Grid de cartas viradas
- Clique para virar cartas
- Lógica de matching
- Contador de tentativas
- Timer e pontuação
*/

/*
========================================
BOAS PRÁTICAS E DICAS
========================================

PERFORMANCE:
1. Use event delegation para elementos dinâmicos
2. Remova listeners desnecessários
3. Use throttle/debounce para eventos frequentes
4. Evite listeners inline no HTML
5. Cache referências de elementos

ACESSIBILIDADE:
1. Suporte navegação por teclado
2. Use atributos ARIA apropriados
3. Mantenha foco visível
4. Forneça feedback para ações
5. Teste com leitores de tela

SEGURANÇA:
1. Valide dados de entrada
2. Sanitize conteúdo dinâmico
3. Use preventDefault() com cuidado
4. Evite eval() com dados de eventos
5. Implemente CSP quando possível

MANUTENIBILIDADE:
1. Use nomes descritivos para handlers
2. Separe lógica de apresentação
3. Documente eventos customizados
4. Use padrões consistentes
5. Teste em diferentes navegadores

DEBUG:
1. Use console.log para rastrear eventos
2. Inspecione objeto event no DevTools
3. Verifique propagação de eventos
4. Teste com diferentes dispositivos
5. Use breakpoints condicionais
*/

console.log("\n=== ARQUIVO 07: EVENTOS CONCLUÍDO ===");
console.log("Próximo: 08-async-promises.js");
console.log("\nNOTA: Para testar os exemplos, crie elementos HTML correspondentes aos IDs mencionados.");