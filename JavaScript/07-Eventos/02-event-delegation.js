/*
===========================================
    MÓDULO 07 - EVENTOS
    Aula 02: Event Delegation
===========================================

Objetivos de Aprendizagem:
✓ Compreender o conceito de event delegation
✓ Dominar as fases de bubbling e capturing
✓ Implementar padrões eficientes para elementos dinâmicos
✓ Otimizar performance com delegation
✓ Desenvolver sistemas escaláveis de eventos
*/

// ===========================================
// 1. TEORIA: EVENT DELEGATION
// ===========================================

/*
EVENT DELEGATION:

1. CONCEITO:
   - Técnica que aproveita o bubbling de eventos
   - Um único listener no elemento pai gerencia eventos dos filhos
   - Especialmente útil para elementos criados dinamicamente
   - Reduz o número de event listeners necessários

2. FASES DO EVENTO:
   - CAPTURING (1): Do document até o target (raramente usado)
   - TARGET (2): No elemento que disparou o evento
   - BUBBLING (3): Do target até o document (padrão)

3. VANTAGENS:
   - Melhor performance (menos listeners)
   - Funciona com elementos dinâmicos
   - Facilita manutenção do código
   - Reduz vazamentos de memória

4. DESVANTAGENS:
   - Nem todos os eventos fazem bubble
   - Pode ser mais complexo para casos simples
   - Requer verificação do target

5. EVENTOS QUE NÃO FAZEM BUBBLE:
   - focus/blur (use focusin/focusout)
   - load/unload
   - mouseenter/mouseleave (use mouseover/mouseout)
   - resize/scroll (em alguns elementos)
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Delegation Básica ---
console.log('=== EVENT DELEGATION BÁSICA ===');

const exemploBasico = {
    // Demonstração de delegation vs listeners individuais
    demonstrarDiferenca() {
        // Container para os exemplos
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            gap: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        // === ABORDAGEM TRADICIONAL (INEFICIENTE) ===
        const containerTradicional = document.createElement('div');
        containerTradicional.innerHTML = `
            <h3>Abordagem Tradicional</h3>
            <div class="lista-tradicional">
                <button class="btn-tradicional">Botão 1</button>
                <button class="btn-tradicional">Botão 2</button>
                <button class="btn-tradicional">Botão 3</button>
            </div>
            <button class="adicionar-tradicional">Adicionar Botão</button>
        `;
        
        // Adicionar listeners individuais (problemático)
        const botoesTradicional = containerTradicional.querySelectorAll('.btn-tradicional');
        botoesTradicional.forEach((botao, index) => {
            botao.addEventListener('click', () => {
                console.log(`Botão tradicional ${index + 1} clicado`);
                botao.style.backgroundColor = 'lightcoral';
            });
        });
        
        // Adicionar novos botões (não funcionará sem re-binding)
        containerTradicional.querySelector('.adicionar-tradicional').addEventListener('click', () => {
            const novoBtn = document.createElement('button');
            novoBtn.className = 'btn-tradicional';
            novoBtn.textContent = `Botão ${botoesTradicional.length + 1}`;
            
            // PROBLEMA: Este botão não terá event listener!
            containerTradicional.querySelector('.lista-tradicional').appendChild(novoBtn);
            
            console.log('Novo botão adicionado (sem listener!)');
        });
        
        // === ABORDAGEM COM DELEGATION (EFICIENTE) ===
        const containerDelegation = document.createElement('div');
        containerDelegation.innerHTML = `
            <h3>Event Delegation</h3>
            <div class="lista-delegation">
                <button class="btn-delegation">Botão 1</button>
                <button class="btn-delegation">Botão 2</button>
                <button class="btn-delegation">Botão 3</button>
            </div>
            <button class="adicionar-delegation">Adicionar Botão</button>
        `;
        
        // UM ÚNICO listener no container pai
        containerDelegation.addEventListener('click', (event) => {
            // Verificar se o clique foi em um botão
            if (event.target.matches('.btn-delegation')) {
                const botoes = Array.from(containerDelegation.querySelectorAll('.btn-delegation'));
                const index = botoes.indexOf(event.target);
                
                console.log(`Botão delegation ${index + 1} clicado`);
                event.target.style.backgroundColor = 'lightgreen';
            }
            
            // Adicionar novos botões (funcionará automaticamente!)
            if (event.target.matches('.adicionar-delegation')) {
                const botoes = containerDelegation.querySelectorAll('.btn-delegation');
                const novoBtn = document.createElement('button');
                novoBtn.className = 'btn-delegation';
                novoBtn.textContent = `Botão ${botoes.length + 1}`;
                
                containerDelegation.querySelector('.lista-delegation').appendChild(novoBtn);
                console.log('Novo botão adicionado (com listener automático!)');
            }
        });
        
        container.appendChild(containerTradicional);
        container.appendChild(containerDelegation);
        
        return container;
    },
    
    // Demonstração das fases do evento
    demonstrarFasesEvento() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 3px solid blue;
            margin: 10px;
        `;
        container.innerHTML = '<h3>Fases do Evento (veja o console)</h3>';
        
        const meio = document.createElement('div');
        meio.style.cssText = `
            padding: 20px;
            border: 3px solid green;
            margin: 10px;
        `;
        meio.innerHTML = '<p>Elemento do meio</p>';
        
        const target = document.createElement('button');
        target.textContent = 'Clique aqui para ver as fases';
        target.style.cssText = `
            padding: 10px;
            border: 3px solid red;
            background: yellow;
        `;
        
        // FASE 1: CAPTURING (do document para o target)
        container.addEventListener('click', () => {
            console.log('1. CAPTURING - Container (pai)');
        }, { capture: true }); // capture: true = fase de capturing
        
        meio.addEventListener('click', () => {
            console.log('2. CAPTURING - Meio');
        }, { capture: true });
        
        target.addEventListener('click', () => {
            console.log('3. TARGET - Botão (alvo)');
        });
        
        // FASE 3: BUBBLING (do target para o document)
        meio.addEventListener('click', () => {
            console.log('4. BUBBLING - Meio');
        }); // capture: false (padrão) = fase de bubbling
        
        container.addEventListener('click', () => {
            console.log('5. BUBBLING - Container (pai)');
        });
        
        meio.appendChild(target);
        container.appendChild(meio);
        
        return container;
    },
    
    // Controle de propagação
    demonstrarControlePropagacao() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 2px solid purple;
            margin: 10px;
        `;
        
        container.innerHTML = `
            <h3>Controle de Propagação</h3>
            <button class="stop-propagation">stopPropagation()</button>
            <button class="stop-immediate">stopImmediatePropagation()</button>
            <button class="prevent-default">preventDefault()</button>
            <a href="#" class="link-teste">Link de teste</a>
        `;
        
        // Listeners no container
        container.addEventListener('click', () => {
            console.log('Container clicado (bubbling)');
        });
        
        // stopPropagation - para a propagação
        container.querySelector('.stop-propagation').addEventListener('click', (e) => {
            console.log('stopPropagation() chamado');
            e.stopPropagation(); // Para o bubbling
        });
        
        // stopImmediatePropagation - para todos os listeners
        const btnStopImmediate = container.querySelector('.stop-immediate');
        
        btnStopImmediate.addEventListener('click', (e) => {
            console.log('Primeiro listener do stopImmediatePropagation');
            e.stopImmediatePropagation(); // Para TODOS os listeners
        });
        
        btnStopImmediate.addEventListener('click', () => {
            console.log('Este listener NÃO será executado');
        });
        
        // preventDefault - previne ação padrão
        container.querySelector('.prevent-default').addEventListener('click', (e) => {
            console.log('preventDefault() chamado');
            e.preventDefault(); // Previne ação padrão (se houver)
        });
        
        // Link com preventDefault
        container.querySelector('.link-teste').addEventListener('click', (e) => {
            e.preventDefault(); // Previne navegação
            console.log('Link clicado, mas navegação prevenida');
        });
        
        return container;
    }
};

// --- 2.2 Padrões Avançados de Delegation ---
console.log('\n=== PADRÕES AVANÇADOS DE DELEGATION ===');

const padroesAvancados = {
    // Sistema de roteamento de eventos
    criarRoteadorEventos() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        // Mapa de rotas de eventos
        const rotasEventos = new Map([
            ['[data-action="save"]', this.acaoSalvar],
            ['[data-action="delete"]', this.acaoExcluir],
            ['[data-action="edit"]', this.acaoEditar],
            ['.toggle-button', this.acaoToggle],
            ['.counter-btn', this.acaoContador]
        ]);
        
        container.innerHTML = `
            <h3>Roteador de Eventos</h3>
            <button data-action="save">Salvar</button>
            <button data-action="delete">Excluir</button>
            <button data-action="edit">Editar</button>
            <button class="toggle-button" data-state="off">Toggle: OFF</button>
            <button class="counter-btn" data-count="0">Contador: 0</button>
        `;
        
        // Roteador principal
        container.addEventListener('click', (event) => {
            // Procurar por uma rota que corresponda ao target
            for (const [seletor, handler] of rotasEventos) {
                if (event.target.matches(seletor)) {
                    handler.call(this, event);
                    break; // Para na primeira correspondência
                }
            }
        });
        
        return container;
    },
    
    // Handlers das ações
    acaoSalvar(event) {
        console.log('Ação: Salvar');
        event.target.style.backgroundColor = 'lightgreen';
        setTimeout(() => {
            event.target.style.backgroundColor = '';
        }, 1000);
    },
    
    acaoExcluir(event) {
        console.log('Ação: Excluir');
        if (confirm('Confirma exclusão?')) {
            event.target.style.backgroundColor = 'lightcoral';
            setTimeout(() => {
                event.target.style.backgroundColor = '';
            }, 1000);
        }
    },
    
    acaoEditar(event) {
        console.log('Ação: Editar');
        const novoTexto = prompt('Novo texto:', event.target.textContent);
        if (novoTexto) {
            event.target.textContent = novoTexto;
        }
    },
    
    acaoToggle(event) {
        const estado = event.target.dataset.state;
        const novoEstado = estado === 'off' ? 'on' : 'off';
        
        event.target.dataset.state = novoEstado;
        event.target.textContent = `Toggle: ${novoEstado.toUpperCase()}`;
        event.target.style.backgroundColor = novoEstado === 'on' ? 'lightblue' : '';
        
        console.log(`Toggle: ${estado} → ${novoEstado}`);
    },
    
    acaoContador(event) {
        const contadorAtual = parseInt(event.target.dataset.count) || 0;
        const novoContador = contadorAtual + 1;
        
        event.target.dataset.count = novoContador;
        event.target.textContent = `Contador: ${novoContador}`;
        
        console.log(`Contador incrementado: ${novoContador}`);
    },
    
    // Sistema de delegation com namespaces
    criarSistemaNamespaces() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        container.innerHTML = `
            <h3>Sistema com Namespaces</h3>
            <div class="user-actions">
                <button data-ns="user" data-action="create">Criar Usuário</button>
                <button data-ns="user" data-action="update">Atualizar Usuário</button>
                <button data-ns="user" data-action="delete">Excluir Usuário</button>
            </div>
            <div class="product-actions">
                <button data-ns="product" data-action="create">Criar Produto</button>
                <button data-ns="product" data-action="update">Atualizar Produto</button>
                <button data-ns="product" data-action="delete">Excluir Produto</button>
            </div>
        `;
        
        // Handlers por namespace
        const handlers = {
            user: {
                create: () => console.log('Criando usuário...'),
                update: () => console.log('Atualizando usuário...'),
                delete: () => console.log('Excluindo usuário...')
            },
            product: {
                create: () => console.log('Criando produto...'),
                update: () => console.log('Atualizando produto...'),
                delete: () => console.log('Excluindo produto...')
            }
        };
        
        // Delegation com namespace
        container.addEventListener('click', (event) => {
            const { ns, action } = event.target.dataset;
            
            if (ns && action && handlers[ns] && handlers[ns][action]) {
                handlers[ns][action](event);
                
                // Feedback visual
                event.target.style.backgroundColor = 'lightgreen';
                setTimeout(() => {
                    event.target.style.backgroundColor = '';
                }, 500);
            }
        });
        
        return container;
    },
    
    // Delegation com filtros avançados
    criarSistemaFiltros() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        container.innerHTML = `
            <h3>Sistema com Filtros</h3>
            <div class="item-list">
                <div class="item" data-type="urgent" data-category="bug">Bug Urgente</div>
                <div class="item" data-type="normal" data-category="feature">Nova Feature</div>
                <div class="item" data-type="low" data-category="improvement">Melhoria</div>
                <div class="item" data-type="urgent" data-category="security">Falha de Segurança</div>
            </div>
            <button class="add-item">Adicionar Item</button>
        `;
        
        // Filtros de eventos
        const filtros = {
            // Apenas itens urgentes
            urgent: (element) => element.dataset.type === 'urgent',
            
            // Apenas bugs
            bugs: (element) => element.dataset.category === 'bug',
            
            // Itens que não são melhorias
            notImprovement: (element) => element.dataset.category !== 'improvement',
            
            // Combinação de filtros
            urgentBugs: (element) => 
                element.dataset.type === 'urgent' && element.dataset.category === 'bug'
        };
        
        // Sistema de delegation com filtros
        container.addEventListener('click', (event) => {
            if (event.target.matches('.item')) {
                const item = event.target;
                
                // Aplicar diferentes ações baseadas nos filtros
                if (filtros.urgentBugs(item)) {
                    console.log('🚨 Bug urgente clicado!');
                    item.style.backgroundColor = 'red';
                    item.style.color = 'white';
                } else if (filtros.urgent(item)) {
                    console.log('⚠️ Item urgente clicado!');
                    item.style.backgroundColor = 'orange';
                } else if (filtros.bugs(item)) {
                    console.log('🐛 Bug clicado!');
                    item.style.backgroundColor = 'yellow';
                } else {
                    console.log('📝 Item normal clicado!');
                    item.style.backgroundColor = 'lightblue';
                }
                
                // Reset após 2 segundos
                setTimeout(() => {
                    item.style.backgroundColor = '';
                    item.style.color = '';
                }, 2000);
            }
            
            // Adicionar novos itens dinamicamente
            if (event.target.matches('.add-item')) {
                const tipos = ['urgent', 'normal', 'low'];
                const categorias = ['bug', 'feature', 'improvement', 'security'];
                
                const tipoAleatorio = tipos[Math.floor(Math.random() * tipos.length)];
                const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
                
                const novoItem = document.createElement('div');
                novoItem.className = 'item';
                novoItem.dataset.type = tipoAleatorio;
                novoItem.dataset.category = categoriaAleatoria;
                novoItem.textContent = `${categoriaAleatoria} ${tipoAleatorio}`;
                
                container.querySelector('.item-list').appendChild(novoItem);
                console.log(`Novo item adicionado: ${tipoAleatorio} ${categoriaAleatoria}`);
            }
        });
        
        return container;
    }
};

// --- 2.3 Performance e Otimização ---
console.log('\n=== PERFORMANCE E OTIMIZAÇÃO ===');

const otimizacaoPerformance = {
    // Comparação de performance
    demonstrarPerformance() {
        console.log('=== TESTE DE PERFORMANCE ===');
        
        const numElementos = 1000;
        
        // === TESTE 1: Listeners individuais ===
        console.time('Listeners Individuais');
        
        const containerIndividual = document.createElement('div');
        for (let i = 0; i < numElementos; i++) {
            const botao = document.createElement('button');
            botao.textContent = `Botão ${i}`;
            
            // Cada botão tem seu próprio listener
            botao.addEventListener('click', () => {
                console.log(`Botão individual ${i} clicado`);
            });
            
            containerIndividual.appendChild(botao);
        }
        
        console.timeEnd('Listeners Individuais');
        
        // === TESTE 2: Event Delegation ===
        console.time('Event Delegation');
        
        const containerDelegation = document.createElement('div');
        
        // UM ÚNICO listener para todos os botões
        containerDelegation.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON') {
                const index = Array.from(containerDelegation.children).indexOf(event.target);
                console.log(`Botão delegation ${index} clicado`);
            }
        });
        
        for (let i = 0; i < numElementos; i++) {
            const botao = document.createElement('button');
            botao.textContent = `Botão ${i}`;
            containerDelegation.appendChild(botao);
        }
        
        console.timeEnd('Event Delegation');
        
        // === ANÁLISE DE MEMÓRIA ===
        console.log(`
=== ANÁLISE DE MEMÓRIA ===
Listeners individuais: ${numElementos} event listeners
Event delegation: 1 event listener
Economia: ${((numElementos - 1) / numElementos * 100).toFixed(1)}% menos listeners`);
        
        return {
            containerIndividual,
            containerDelegation,
            economia: numElementos - 1
        };
    },
    
    // Sistema de throttling para delegation
    criarSistemaThrottling() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        container.innerHTML = `
            <h3>Delegation com Throttling</h3>
            <div class="scroll-area" style="height: 200px; overflow-y: scroll; border: 1px solid #ddd; padding: 10px;">
                ${Array.from({ length: 100 }, (_, i) => 
                    `<div class="scroll-item">Item ${i + 1}</div>`
                ).join('')}
            </div>
            <div class="mouse-area" style="height: 100px; background: #f0f0f0; margin-top: 10px; padding: 10px;">
                Área de movimento do mouse
            </div>
            <div class="stats"></div>
        `;
        
        const scrollArea = container.querySelector('.scroll-area');
        const mouseArea = container.querySelector('.mouse-area');
        const stats = container.querySelector('.stats');
        
        let scrollCount = 0;
        let mouseCount = 0;
        
        // Throttle function
        const throttle = (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
        
        // Delegation com throttling para scroll
        const throttledScrollHandler = throttle((event) => {
            if (event.target.matches('.scroll-area')) {
                scrollCount++;
                this.atualizarStats();
            }
        }, 100); // Máximo 10 execuções por segundo
        
        // Delegation com throttling para mousemove
        const throttledMouseHandler = throttle((event) => {
            if (event.target.matches('.mouse-area')) {
                mouseCount++;
                this.atualizarStats();
            }
        }, 50); // Máximo 20 execuções por segundo
        
        // Registrar listeners com delegation
        container.addEventListener('scroll', throttledScrollHandler, true);
        container.addEventListener('mousemove', throttledMouseHandler);
        
        // Função para atualizar estatísticas
        this.atualizarStats = () => {
            stats.innerHTML = `
                Scroll events: ${scrollCount}<br>
                Mouse events: ${mouseCount}
            `;
        };
        
        this.atualizarStats();
        
        return container;
    },
    
    // Sistema de cache para seletores
    criarSistemaCache() {
        const container = document.createElement('div');
        container.style.cssText = `
            padding: 20px;
            border: 1px solid #ccc;
            margin: 10px;
        `;
        
        // Cache de seletores para otimização
        const selectorCache = new Map();
        
        // Função otimizada para verificar seletores
        const matchesOptimized = (element, selector) => {
            if (!selectorCache.has(selector)) {
                // Compilar seletor uma única vez
                selectorCache.set(selector, {
                    compiled: selector,
                    isClass: selector.startsWith('.'),
                    isId: selector.startsWith('#'),
                    isAttribute: selector.includes('['),
                    isTag: !selector.startsWith('.') && !selector.startsWith('#') && !selector.includes('[')
                });
            }
            
            const cached = selectorCache.get(selector);
            
            // Otimizações específicas por tipo de seletor
            if (cached.isClass) {
                return element.classList.contains(selector.slice(1));
            } else if (cached.isId) {
                return element.id === selector.slice(1);
            } else if (cached.isTag) {
                return element.tagName.toLowerCase() === selector.toLowerCase();
            } else {
                // Fallback para seletores complexos
                return element.matches(selector);
            }
        };
        
        container.innerHTML = `
            <h3>Sistema com Cache de Seletores</h3>
            <button class="btn-primary">Primário</button>
            <button class="btn-secondary">Secundário</button>
            <span class="text-info">Texto informativo</span>
            <div id="special-div">Div especial</div>
            <input type="text" placeholder="Campo de texto">
        `;
        
        // Mapa de ações com seletores otimizados
        const acoes = new Map([
            ['.btn-primary', (e) => console.log('Botão primário (cache otimizado)')],
            ['.btn-secondary', (e) => console.log('Botão secundário (cache otimizado)')],
            ['#special-div', (e) => console.log('Div especial (cache otimizado)')],
            ['input', (e) => console.log('Input focado (cache otimizado)')],
            ['.text-info', (e) => console.log('Texto informativo (cache otimizado)')]
        ]);
        
        // Delegation otimizada com cache
        container.addEventListener('click', (event) => {
            for (const [seletor, acao] of acoes) {
                if (matchesOptimized(event.target, seletor)) {
                    acao(event);
                    break;
                }
            }
        });
        
        // Mostrar estatísticas do cache
        setTimeout(() => {
            console.log('Cache de seletores:', selectorCache);
        }, 1000);
        
        return container;
    }
};

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Lista Dinâmica ---
console.log('\n=== EXERCÍCIO 1: LISTA DINÂMICA ===');

class ListaDinamica {
    constructor(container, opcoes = {}) {
        this.container = container;
        this.opcoes = {
            permitirEdicao: true,
            permitirExclusao: true,
            permitirReordenacao: true,
            animacoes: true,
            ...opcoes
        };
        
        this.itens = [];
        this.proximoId = 1;
        
        this.criarInterface();
        this.configurarEventos();
    }
    
    // Criar interface da lista
    criarInterface() {
        this.container.style.cssText = `
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        
        this.container.innerHTML = `
            <div class="lista-header">
                <h3>Lista Dinâmica com Event Delegation</h3>
                <div class="controles">
                    <input type="text" class="novo-item-input" placeholder="Novo item...">
                    <button class="adicionar-btn">Adicionar</button>
                    <button class="limpar-btn">Limpar Tudo</button>
                </div>
            </div>
            <div class="lista-container">
                <ul class="lista-itens"></ul>
            </div>
            <div class="lista-stats">
                <span class="total-itens">0 itens</span>
            </div>
        `;
        
        this.listaElement = this.container.querySelector('.lista-itens');
        this.inputElement = this.container.querySelector('.novo-item-input');
        this.statsElement = this.container.querySelector('.total-itens');
    }
    
    // Configurar eventos com delegation
    configurarEventos() {
        // UM ÚNICO listener para toda a lista
        this.container.addEventListener('click', (event) => {
            this.roteadorEventos(event);
        });
        
        // Eventos de teclado
        this.container.addEventListener('keydown', (event) => {
            if (event.target.matches('.novo-item-input') && event.key === 'Enter') {
                this.adicionarItem();
            }
            
            if (event.target.matches('.item-input') && event.key === 'Enter') {
                this.salvarEdicao(event.target);
            }
            
            if (event.target.matches('.item-input') && event.key === 'Escape') {
                this.cancelarEdicao(event.target);
            }
        });
        
        // Eventos de drag and drop para reordenação
        if (this.opcoes.permitirReordenacao) {
            this.container.addEventListener('dragstart', (event) => {
                if (event.target.matches('.item-handle')) {
                    this.iniciarDrag(event);
                }
            });
            
            this.container.addEventListener('dragover', (event) => {
                if (event.target.closest('.lista-item')) {
                    this.processarDragOver(event);
                }
            });
            
            this.container.addEventListener('drop', (event) => {
                if (event.target.closest('.lista-item')) {
                    this.processarDrop(event);
                }
            });
        }
    }
    
    // Roteador de eventos principal
    roteadorEventos(event) {
        const target = event.target;
        
        // Mapeamento de ações
        const acoes = {
            'adicionar-btn': () => this.adicionarItem(),
            'limpar-btn': () => this.limparTodos(),
            'item-excluir': () => this.excluirItem(target.closest('.lista-item')),
            'item-editar': () => this.editarItem(target.closest('.lista-item')),
            'item-salvar': () => this.salvarEdicao(target.closest('.lista-item').querySelector('.item-input')),
            'item-cancelar': () => this.cancelarEdicao(target.closest('.lista-item').querySelector('.item-input')),
            'item-toggle': () => this.toggleItem(target.closest('.lista-item')),
            'item-duplicar': () => this.duplicarItem(target.closest('.lista-item'))
        };
        
        // Executar ação baseada na classe do target
        for (const [classe, acao] of Object.entries(acoes)) {
            if (target.matches(`.${classe}`)) {
                acao();
                break;
            }
        }
    }
    
    // Adicionar novo item
    adicionarItem() {
        const texto = this.inputElement.value.trim();
        if (!texto) return;
        
        const item = {
            id: this.proximoId++,
            texto: texto,
            concluido: false,
            criadoEm: new Date()
        };
        
        this.itens.push(item);
        this.renderizarItem(item);
        this.inputElement.value = '';
        this.atualizarStats();
        
        console.log('Item adicionado:', item);
    }
    
    // Renderizar item na lista
    renderizarItem(item, posicao = -1) {
        const li = document.createElement('li');
        li.className = 'lista-item';
        li.dataset.id = item.id;
        
        if (this.opcoes.permitirReordenacao) {
            li.draggable = true;
        }
        
        li.innerHTML = `
            <div class="item-content ${item.concluido ? 'concluido' : ''}">
                ${this.opcoes.permitirReordenacao ? '<span class="item-handle">⋮⋮</span>' : ''}
                <span class="item-texto">${item.texto}</span>
                <div class="item-acoes">
                    <button class="item-toggle" title="${item.concluido ? 'Marcar como pendente' : 'Marcar como concluído'}">
                        ${item.concluido ? '↶' : '✓'}
                    </button>
                    ${this.opcoes.permitirEdicao ? '<button class="item-editar" title="Editar">✏️</button>' : ''}
                    <button class="item-duplicar" title="Duplicar">📋</button>
                    ${this.opcoes.permitirExclusao ? '<button class="item-excluir" title="Excluir">🗑️</button>' : ''}
                </div>
            </div>
        `;
        
        // Adicionar com animação
        if (this.opcoes.animacoes) {
            li.style.opacity = '0';
            li.style.transform = 'translateX(-20px)';
        }
        
        if (posicao >= 0 && posicao < this.listaElement.children.length) {
            this.listaElement.insertBefore(li, this.listaElement.children[posicao]);
        } else {
            this.listaElement.appendChild(li);
        }
        
        // Animar entrada
        if (this.opcoes.animacoes) {
            requestAnimationFrame(() => {
                li.style.transition = 'all 0.3s ease';
                li.style.opacity = '1';
                li.style.transform = 'translateX(0)';
            });
        }
    }
    
    // Excluir item
    excluirItem(itemElement) {
        const id = parseInt(itemElement.dataset.id);
        const index = this.itens.findIndex(item => item.id === id);
        
        if (index === -1) return;
        
        if (confirm('Confirma a exclusão deste item?')) {
            // Remover do array
            const itemRemovido = this.itens.splice(index, 1)[0];
            
            // Animar saída
            if (this.opcoes.animacoes) {
                itemElement.style.transition = 'all 0.3s ease';
                itemElement.style.opacity = '0';
                itemElement.style.transform = 'translateX(20px)';
                
                setTimeout(() => {
                    if (itemElement.parentNode) {
                        itemElement.parentNode.removeChild(itemElement);
                    }
                    this.atualizarStats();
                }, 300);
            } else {
                itemElement.parentNode.removeChild(itemElement);
                this.atualizarStats();
            }
            
            console.log('Item excluído:', itemRemovido);
        }
    }
    
    // Editar item
    editarItem(itemElement) {
        const textoElement = itemElement.querySelector('.item-texto');
        const acoesElement = itemElement.querySelector('.item-acoes');
        const textoAtual = textoElement.textContent;
        
        // Criar input de edição
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'item-input';
        input.value = textoAtual;
        input.style.cssText = `
            border: 1px solid #007cba;
            border-radius: 3px;
            padding: 2px 5px;
            font-size: inherit;
            width: 200px;
        `;
        
        // Substituir texto por input
        textoElement.style.display = 'none';
        textoElement.parentNode.insertBefore(input, textoElement.nextSibling);
        
        // Alterar ações
        acoesElement.innerHTML = `
            <button class="item-salvar" title="Salvar">💾</button>
            <button class="item-cancelar" title="Cancelar">❌</button>
        `;
        
        input.focus();
        input.select();
    }
    
    // Salvar edição
    salvarEdicao(input) {
        const itemElement = input.closest('.lista-item');
        const id = parseInt(itemElement.dataset.id);
        const novoTexto = input.value.trim();
        
        if (!novoTexto) {
            alert('O texto não pode estar vazio!');
            return;
        }
        
        // Atualizar no array
        const item = this.itens.find(item => item.id === id);
        if (item) {
            item.texto = novoTexto;
        }
        
        // Restaurar interface
        this.restaurarEdicao(itemElement, novoTexto);
        
        console.log('Item editado:', item);
    }
    
    // Cancelar edição
    cancelarEdicao(input) {
        const itemElement = input.closest('.lista-item');
        const textoOriginal = itemElement.querySelector('.item-texto').textContent;
        
        this.restaurarEdicao(itemElement, textoOriginal);
    }
    
    // Restaurar interface após edição
    restaurarEdicao(itemElement, texto) {
        const textoElement = itemElement.querySelector('.item-texto');
        const input = itemElement.querySelector('.item-input');
        const acoesElement = itemElement.querySelector('.item-acoes');
        const item = this.itens.find(item => item.id === parseInt(itemElement.dataset.id));
        
        // Restaurar texto
        textoElement.textContent = texto;
        textoElement.style.display = '';
        
        // Remover input
        if (input && input.parentNode) {
            input.parentNode.removeChild(input);
        }
        
        // Restaurar ações
        acoesElement.innerHTML = `
            <button class="item-toggle" title="${item.concluido ? 'Marcar como pendente' : 'Marcar como concluído'}">
                ${item.concluido ? '↶' : '✓'}
            </button>
            ${this.opcoes.permitirEdicao ? '<button class="item-editar" title="Editar">✏️</button>' : ''}
            <button class="item-duplicar" title="Duplicar">📋</button>
            ${this.opcoes.permitirExclusao ? '<button class="item-excluir" title="Excluir">🗑️</button>' : ''}
        `;
    }
    
    // Toggle status do item
    toggleItem(itemElement) {
        const id = parseInt(itemElement.dataset.id);
        const item = this.itens.find(item => item.id === id);
        
        if (item) {
            item.concluido = !item.concluido;
            
            const contentElement = itemElement.querySelector('.item-content');
            const toggleBtn = itemElement.querySelector('.item-toggle');
            
            if (item.concluido) {
                contentElement.classList.add('concluido');
                toggleBtn.textContent = '↶';
                toggleBtn.title = 'Marcar como pendente';
            } else {
                contentElement.classList.remove('concluido');
                toggleBtn.textContent = '✓';
                toggleBtn.title = 'Marcar como concluído';
            }
            
            console.log('Item toggled:', item);
        }
    }
    
    // Duplicar item
    duplicarItem(itemElement) {
        const id = parseInt(itemElement.dataset.id);
        const itemOriginal = this.itens.find(item => item.id === id);
        
        if (itemOriginal) {
            const itemDuplicado = {
                id: this.proximoId++,
                texto: `${itemOriginal.texto} (cópia)`,
                concluido: false,
                criadoEm: new Date()
            };
            
            this.itens.push(itemDuplicado);
            this.renderizarItem(itemDuplicado);
            this.atualizarStats();
            
            console.log('Item duplicado:', itemDuplicado);
        }
    }
    
    // Limpar todos os itens
    limparTodos() {
        if (this.itens.length === 0) return;
        
        if (confirm(`Confirma a exclusão de todos os ${this.itens.length} itens?`)) {
            this.itens = [];
            this.listaElement.innerHTML = '';
            this.atualizarStats();
            
            console.log('Todos os itens foram removidos');
        }
    }
    
    // Atualizar estatísticas
    atualizarStats() {
        const total = this.itens.length;
        const concluidos = this.itens.filter(item => item.concluido).length;
        const pendentes = total - concluidos;
        
        this.statsElement.textContent = 
            `${total} itens (${concluidos} concluídos, ${pendentes} pendentes)`;
    }
    
    // Funcionalidades de drag and drop
    iniciarDrag(event) {
        const itemElement = event.target.closest('.lista-item');
        event.dataTransfer.setData('text/plain', itemElement.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        
        itemElement.style.opacity = '0.5';
    }
    
    processarDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        const itemElement = event.target.closest('.lista-item');
        itemElement.style.borderTop = '2px solid #007cba';
    }
    
    processarDrop(event) {
        event.preventDefault();
        
        const draggedId = parseInt(event.dataTransfer.getData('text/plain'));
        const targetElement = event.target.closest('.lista-item');
        const targetId = parseInt(targetElement.dataset.id);
        
        if (draggedId !== targetId) {
            this.reordenarItens(draggedId, targetId);
        }
        
        // Limpar estilos
        document.querySelectorAll('.lista-item').forEach(item => {
            item.style.opacity = '';
            item.style.borderTop = '';
        });
    }
    
    // Reordenar itens
    reordenarItens(draggedId, targetId) {
        const draggedIndex = this.itens.findIndex(item => item.id === draggedId);
        const targetIndex = this.itens.findIndex(item => item.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Mover no array
        const [itemMovido] = this.itens.splice(draggedIndex, 1);
        this.itens.splice(targetIndex, 0, itemMovido);
        
        // Re-renderizar lista
        this.listaElement.innerHTML = '';
        this.itens.forEach(item => this.renderizarItem(item));
        
        console.log('Itens reordenados');
    }
    
    // Obter dados da lista
    obterDados() {
        return {
            itens: [...this.itens],
            total: this.itens.length,
            concluidos: this.itens.filter(item => item.concluido).length
        };
    }
}

// Exemplo de uso da lista dinâmica
console.log('Lista dinâmica criada!');

// --- EXERCÍCIO 2: Sistema de Tabs Dinâmicas ---
console.log('\n=== EXERCÍCIO 2: TABS DINÂMICAS ===');

class SistemaTabsDinamicas {
    constructor(container, opcoes = {}) {
        this.container = container;
        this.opcoes = {
            permitirFechar: true,
            permitirReordenar: true,
            animacoes: true,
            maxTabs: 10,
            ...opcoes
        };
        
        this.tabs = [];
        this.tabAtiva = null;
        this.proximoId = 1;
        
        this.criarInterface();
        this.configurarEventos();
        this.adicionarTabInicial();
    }
    
    // Criar interface
    criarInterface() {
        this.container.style.cssText = `
            max-width: 800px;
            margin: 20px auto;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            font-family: Arial, sans-serif;
        `;
        
        this.container.innerHTML = `
            <div class="tabs-header">
                <div class="tabs-nav"></div>
                <div class="tabs-controles">
                    <button class="nova-tab-btn" title="Nova Tab">+</button>
                    <button class="fechar-todas-btn" title="Fechar Todas">×</button>
                </div>
            </div>
            <div class="tabs-content"></div>
        `;
        
        this.navElement = this.container.querySelector('.tabs-nav');
        this.contentElement = this.container.querySelector('.tabs-content');
    }
    
    // Configurar eventos com delegation
    configurarEventos() {
        // Delegation para todos os eventos de tabs
        this.container.addEventListener('click', (event) => {
            this.roteadorEventos(event);
        });
        
        // Eventos de teclado
        this.container.addEventListener('keydown', (event) => {
            this.processarTeclado(event);
        });
        
        // Drag and drop para reordenação
        if (this.opcoes.permitirReordenar) {
            this.container.addEventListener('dragstart', (event) => {
                if (event.target.matches('.tab-item')) {
                    this.iniciarDragTab(event);
                }
            });
            
            this.container.addEventListener('dragover', (event) => {
                if (event.target.closest('.tab-item')) {
                    this.processarDragOverTab(event);
                }
            });
            
            this.container.addEventListener('drop', (event) => {
                if (event.target.closest('.tab-item')) {
                    this.processarDropTab(event);
                }
            });
        }
    }
    
    // Roteador de eventos
    roteadorEventos(event) {
        const target = event.target;
        
        // Mapeamento de ações
        if (target.matches('.tab-item')) {
            this.ativarTab(parseInt(target.dataset.id));
        } else if (target.matches('.tab-fechar')) {
            event.stopPropagation();
            this.fecharTab(parseInt(target.closest('.tab-item').dataset.id));
        } else if (target.matches('.nova-tab-btn')) {
            this.criarNovaTab();
        } else if (target.matches('.fechar-todas-btn')) {
            this.fecharTodasTabs();
        } else if (target.matches('.tab-content-editar')) {
            this.editarConteudoTab(parseInt(target.closest('.tab-content').dataset.id));
        }
    }
    
    // Processar eventos de teclado
    processarTeclado(event) {
        // Ctrl+T: Nova tab
        if (event.ctrlKey && event.key === 't') {
            event.preventDefault();
            this.criarNovaTab();
        }
        
        // Ctrl+W: Fechar tab ativa
        if (event.ctrlKey && event.key === 'w') {
            event.preventDefault();
            if (this.tabAtiva) {
                this.fecharTab(this.tabAtiva.id);
            }
        }
        
        // Ctrl+Tab: Próxima tab
        if (event.ctrlKey && event.key === 'Tab') {
            event.preventDefault();
            this.proximaTab();
        }
        
        // Ctrl+Shift+Tab: Tab anterior
        if (event.ctrlKey && event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            this.tabAnterior();
        }
    }
    
    // Criar nova tab
    criarNovaTab(titulo = null, conteudo = null) {
        if (this.tabs.length >= this.opcoes.maxTabs) {
            alert(`Máximo de ${this.opcoes.maxTabs} tabs permitidas`);
            return null;
        }
        
        const tab = {
            id: this.proximoId++,
            titulo: titulo || `Tab ${this.proximoId - 1}`,
            conteudo: conteudo || `Conteúdo da Tab ${this.proximoId - 1}`,
            ativa: false,
            criadaEm: new Date()
        };
        
        this.tabs.push(tab);
        this.renderizarTab(tab);
        this.ativarTab(tab.id);
        
        console.log('Nova tab criada:', tab);
        return tab;
    }
    
    // Renderizar tab
    renderizarTab(tab) {
        // Renderizar item de navegação
        const tabNav = document.createElement('div');
        tabNav.className = 'tab-item';
        tabNav.dataset.id = tab.id;
        
        if (this.opcoes.permitirReordenar) {
            tabNav.draggable = true;
        }
        
        tabNav.innerHTML = `
            <span class="tab-titulo">${tab.titulo}</span>
            ${this.opcoes.permitirFechar ? '<button class="tab-fechar">×</button>' : ''}
        `;
        
        // Renderizar conteúdo
        const tabContent = document.createElement('div');
        tabContent.className = 'tab-content';
        tabContent.dataset.id = tab.id;
        tabContent.style.display = 'none';
        
        tabContent.innerHTML = `
            <div class="tab-content-header">
                <h3>${tab.titulo}</h3>
                <button class="tab-content-editar">Editar</button>
            </div>
            <div class="tab-content-body">
                <p>${tab.conteudo}</p>
            </div>
        `;
        
        // Adicionar com animação
        if (this.opcoes.animacoes) {
            tabNav.style.opacity = '0';
            tabNav.style.transform = 'translateY(-10px)';
        }
        
        this.navElement.appendChild(tabNav);
        this.contentElement.appendChild(tabContent);
        
        // Animar entrada
        if (this.opcoes.animacoes) {
            requestAnimationFrame(() => {
                tabNav.style.transition = 'all 0.3s ease';
                tabNav.style.opacity = '1';
                tabNav.style.transform = 'translateY(0)';
            });
        }
    }
    
    // Ativar tab
    ativarTab(id) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;
        
        // Desativar tab atual
        if (this.tabAtiva) {
            this.tabAtiva.ativa = false;
            const tabNavAtual = this.navElement.querySelector(`[data-id="${this.tabAtiva.id}"]`);
            const tabContentAtual = this.contentElement.querySelector(`[data-id="${this.tabAtiva.id}"]`);
            
            if (tabNavAtual) tabNavAtual.classList.remove('ativa');
            if (tabContentAtual) tabContentAtual.style.display = 'none';
        }
        
        // Ativar nova tab
        tab.ativa = true;
        this.tabAtiva = tab;
        
        const tabNav = this.navElement.querySelector(`[data-id="${id}"]`);
        const tabContent = this.contentElement.querySelector(`[data-id="${id}"]`);
        
        if (tabNav) tabNav.classList.add('ativa');
        if (tabContent) {
            tabContent.style.display = 'block';
            
            if (this.opcoes.animacoes) {
                tabContent.style.opacity = '0';
                requestAnimationFrame(() => {
                    tabContent.style.transition = 'opacity 0.2s ease';
                    tabContent.style.opacity = '1';
                });
            }
        }
        
        console.log('Tab ativada:', tab);
    }
    
    // Fechar tab
    fecharTab(id) {
        const index = this.tabs.findIndex(t => t.id === id);
        if (index === -1) return;
        
        const tab = this.tabs[index];
        const tabNav = this.navElement.querySelector(`[data-id="${id}"]`);
        const tabContent = this.contentElement.querySelector(`[data-id="${id}"]`);
        
        // Animar saída
        if (this.opcoes.animacoes) {
            if (tabNav) {
                tabNav.style.transition = 'all 0.3s ease';
                tabNav.style.opacity = '0';
                tabNav.style.transform = 'translateY(-10px)';
            }
            
            setTimeout(() => {
                this.removerElementosTab(tabNav, tabContent);
                this.finalizarFechamentoTab(tab, index);
            }, 300);
        } else {
            this.removerElementosTab(tabNav, tabContent);
            this.finalizarFechamentoTab(tab, index);
        }
    }
    
    // Remover elementos da tab
    removerElementosTab(tabNav, tabContent) {
        if (tabNav && tabNav.parentNode) {
            tabNav.parentNode.removeChild(tabNav);
        }
        if (tabContent && tabContent.parentNode) {
            tabContent.parentNode.removeChild(tabContent);
        }
    }
    
    // Finalizar fechamento da tab
    finalizarFechamentoTab(tab, index) {
        // Remover do array
        this.tabs.splice(index, 1);
        
        // Se era a tab ativa, ativar outra
        if (this.tabAtiva && this.tabAtiva.id === tab.id) {
            this.tabAtiva = null;
            
            if (this.tabs.length > 0) {
                // Ativar tab anterior ou próxima
                const novoIndex = Math.min(index, this.tabs.length - 1);
                this.ativarTab(this.tabs[novoIndex].id);
            }
        }
        
        console.log('Tab fechada:', tab);
    }
    
    // Fechar todas as tabs
    fecharTodasTabs() {
        if (this.tabs.length === 0) return;
        
        if (confirm(`Confirma o fechamento de todas as ${this.tabs.length} tabs?`)) {
            // Clonar array para evitar problemas durante iteração
            const tabsParaFechar = [...this.tabs];
            
            tabsParaFechar.forEach(tab => {
                this.fecharTab(tab.id);
            });
            
            console.log('Todas as tabs foram fechadas');
        }
    }
    
    // Navegar para próxima tab
    proximaTab() {
        if (this.tabs.length <= 1) return;
        
        const indexAtual = this.tabs.findIndex(t => t.id === this.tabAtiva.id);
        const proximoIndex = (indexAtual + 1) % this.tabs.length;
        
        this.ativarTab(this.tabs[proximoIndex].id);
    }
    
    // Navegar para tab anterior
    tabAnterior() {
        if (this.tabs.length <= 1) return;
        
        const indexAtual = this.tabs.findIndex(t => t.id === this.tabAtiva.id);
        const anteriorIndex = indexAtual === 0 ? this.tabs.length - 1 : indexAtual - 1;
        
        this.ativarTab(this.tabs[anteriorIndex].id);
    }
    
    // Editar conteúdo da tab
    editarConteudoTab(id) {
        const tab = this.tabs.find(t => t.id === id);
        if (!tab) return;
        
        const novoTitulo = prompt('Novo título:', tab.titulo);
        if (novoTitulo && novoTitulo.trim()) {
            tab.titulo = novoTitulo.trim();
            
            // Atualizar interface
            const tabNav = this.navElement.querySelector(`[data-id="${id}"]`);
            const tabContent = this.contentElement.querySelector(`[data-id="${id}"]`);
            
            if (tabNav) {
                tabNav.querySelector('.tab-titulo').textContent = tab.titulo;
            }
            
            if (tabContent) {
                tabContent.querySelector('h3').textContent = tab.titulo;
            }
        }
        
        const novoConteudo = prompt('Novo conteúdo:', tab.conteudo);
        if (novoConteudo && novoConteudo.trim()) {
            tab.conteudo = novoConteudo.trim();
            
            const tabContent = this.contentElement.querySelector(`[data-id="${id}"]`);
            if (tabContent) {
                tabContent.querySelector('.tab-content-body p').textContent = tab.conteudo;
            }
        }
        
        console.log('Tab editada:', tab);
    }
    
    // Adicionar tab inicial
    adicionarTabInicial() {
        this.criarNovaTab('Bem-vindo', 'Esta é sua primeira tab! Use Ctrl+T para criar novas tabs.');
    }
    
    // Funcionalidades de drag and drop
    iniciarDragTab(event) {
        const tabElement = event.target;
        event.dataTransfer.setData('text/plain', tabElement.dataset.id);
        event.dataTransfer.effectAllowed = 'move';
        
        tabElement.style.opacity = '0.5';
    }
    
    processarDragOverTab(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        
        const tabElement = event.target.closest('.tab-item');
        tabElement.style.borderLeft = '3px solid #007cba';
    }
    
    processarDropTab(event) {
        event.preventDefault();
        
        const draggedId = parseInt(event.dataTransfer.getData('text/plain'));
        const targetElement = event.target.closest('.tab-item');
        const targetId = parseInt(targetElement.dataset.id);
        
        if (draggedId !== targetId) {
            this.reordenarTabs(draggedId, targetId);
        }
        
        // Limpar estilos
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.style.opacity = '';
            tab.style.borderLeft = '';
        });
    }
    
    // Reordenar tabs
    reordenarTabs(draggedId, targetId) {
        const draggedIndex = this.tabs.findIndex(tab => tab.id === draggedId);
        const targetIndex = this.tabs.findIndex(tab => tab.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) return;
        
        // Mover no array
        const [tabMovida] = this.tabs.splice(draggedIndex, 1);
        this.tabs.splice(targetIndex, 0, tabMovida);
        
        // Re-renderizar navegação
        this.navElement.innerHTML = '';
        this.tabs.forEach(tab => {
            const tabNav = document.createElement('div');
            tabNav.className = `tab-item ${tab.ativa ? 'ativa' : ''}`;
            tabNav.dataset.id = tab.id;
            
            if (this.opcoes.permitirReordenar) {
                tabNav.draggable = true;
            }
            
            tabNav.innerHTML = `
                <span class="tab-titulo">${tab.titulo}</span>
                ${this.opcoes.permitirFechar ? '<button class="tab-fechar">×</button>' : ''}
            `;
            
            this.navElement.appendChild(tabNav);
        });
        
        console.log('Tabs reordenadas');
    }
    
    // Obter dados das tabs
    obterDados() {
        return {
            tabs: [...this.tabs],
            tabAtiva: this.tabAtiva,
            total: this.tabs.length
        };
    }
}

// Exemplo de uso do sistema de tabs
console.log('Sistema de tabs dinâmicas criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasOtimizacao = {
    // Performance com delegation
    performance: {
        // Use seletores eficientes
        seletoresEficientes() {
            console.log('=== SELETORES EFICIENTES ===');
            
            // ❌ INEFICIENTE: Seletores complexos
            const ineficiente = (event) => {
                if (event.target.matches('div.container > ul.list > li.item[data-type="active"]')) {
                    // Muito específico e lento
                }
            };
            
            // ✅ EFICIENTE: Seletores simples + verificações
            const eficiente = (event) => {
                if (event.target.matches('.item')) {
                    const item = event.target;
                    if (item.dataset.type === 'active' && 
                        item.parentNode.matches('.list') &&
                        item.parentNode.parentNode.matches('.container')) {
                        // Mais rápido e flexível
                    }
                }
            };
            
            console.log('Use seletores simples e faça verificações adicionais quando necessário');
        },
        
        // Cache de elementos
        cacheElementos() {
            console.log('\n=== CACHE DE ELEMENTOS ===');
            
            const elementCache = new WeakMap();
            
            const obterDadosElemento = (element) => {
                if (!elementCache.has(element)) {
                    // Calcular dados pesados apenas uma vez
                    const dados = {
                        rect: element.getBoundingClientRect(),
                        computedStyle: getComputedStyle(element),
                        dataset: { ...element.dataset }
                    };
                    elementCache.set(element, dados);
                }
                return elementCache.get(element);
            };
            
            console.log('Use WeakMap para cachear dados de elementos');
        },
        
        // Throttling e debouncing
        throttleDebounce() {
            console.log('\n=== THROTTLING E DEBOUNCING ===');
            
            // Throttle para eventos frequentes
            const throttle = (func, limit) => {
                let inThrottle;
                return function(...args) {
                    if (!inThrottle) {
                        func.apply(this, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            };
            
            // Debounce para eventos de input
            const debounce = (func, delay) => {
                let timeoutId;
                return function(...args) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => func.apply(this, args), delay);
                };
            };
            
            // Exemplo de uso com delegation
            const container = document.createElement('div');
            
            const throttledHandler = throttle((event) => {
                if (event.target.matches('.scroll-item')) {
                    console.log('Scroll throttled');
                }
            }, 100);
            
            const debouncedHandler = debounce((event) => {
                if (event.target.matches('.search-input')) {
                    console.log('Search debounced:', event.target.value);
                }
            }, 300);
            
            container.addEventListener('scroll', throttledHandler, true);
            container.addEventListener('input', debouncedHandler);
            
            console.log('Use throttle para scroll/resize e debounce para input/search');
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Limpeza de listeners
        limpezaListeners() {
            console.log('\n=== LIMPEZA DE LISTENERS ===');
            
            class ComponenteComLimpeza {
                constructor(element) {
                    this.element = element;
                    this.abortController = new AbortController();
                    
                    // Usar AbortController para limpeza automática
                    this.element.addEventListener('click', this.handleClick.bind(this), {
                        signal: this.abortController.signal
                    });
                }
                
                handleClick(event) {
                    console.log('Click handled');
                }
                
                destruir() {
                    // Remove TODOS os listeners de uma vez
                    this.abortController.abort();
                    console.log('Todos os listeners removidos');
                }
            }
            
            console.log('Use AbortController para limpeza eficiente de listeners');
        },
        
        // Evitar vazamentos
        evitarVazamentos() {
            console.log('\n=== EVITAR VAZAMENTOS ===');
            
            // ❌ PROBLEMÁTICO: Referências circulares
            const problematico = () => {
                const elemento = document.createElement('div');
                elemento.customData = {
                    element: elemento, // Referência circular!
                    handler: function() {
                        console.log(this.element); // Mantém referência
                    }
                };
            };
            
            // ✅ CORRETO: Evitar referências circulares
            const correto = () => {
                const elemento = document.createElement('div');
                const weakRef = new WeakRef(elemento);
                
                const handler = () => {
                    const el = weakRef.deref();
                    if (el) {
                        console.log('Elemento ainda existe');
                    } else {
                        console.log('Elemento foi coletado pelo GC');
                    }
                };
                
                elemento.addEventListener('click', handler);
            };
            
            console.log('Use WeakRef e WeakMap para evitar vazamentos de memória');
        }
    },
    
    // Debugging
    debugging: {
        // Rastreamento de eventos
        rastreamentoEventos() {
            console.log('\n=== RASTREAMENTO DE EVENTOS ===');
            
            const criarDebugger = (container, nome) => {
                const originalAddEventListener = container.addEventListener;
                const listeners = new Map();
                
                container.addEventListener = function(type, listener, options) {
                    console.log(`[${nome}] Listener adicionado:`, type);
                    
                    if (!listeners.has(type)) {
                        listeners.set(type, []);
                    }
                    listeners.get(type).push({ listener, options });
                    
                    return originalAddEventListener.call(this, type, listener, options);
                };
                
                container.getListeners = () => listeners;
                
                return container;
            };
            
            console.log('Crie wrappers para rastrear listeners em desenvolvimento');
        },
        
        // Análise de performance
        analisePerformance() {
            console.log('\n=== ANÁLISE DE PERFORMANCE ===');
            
            const analisarEventos = (container) => {
                const stats = {
                    totalEventos: 0,
                    eventosPorTipo: new Map(),
                    tempoMedio: 0,
                    tempos: []
                };
                
                container.addEventListener('click', (event) => {
                    const inicio = performance.now();
                    
                    // Simular processamento
                    if (event.target.matches('.item')) {
                        // Processar evento
                    }
                    
                    const fim = performance.now();
                    const tempo = fim - inicio;
                    
                    stats.totalEventos++;
                    stats.tempos.push(tempo);
                    stats.tempoMedio = stats.tempos.reduce((a, b) => a + b, 0) / stats.tempos.length;
                    
                    if (tempo > 16) { // Mais de 1 frame (60fps)
                        console.warn(`Evento lento detectado: ${tempo.toFixed(2)}ms`);
                    }
                });
                
                return stats;
            };
            
            console.log('Monitore performance dos handlers em tempo real');
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

const referencias = {
    documentacao: [
        'MDN - Event delegation: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation',
        'MDN - Event.target: https://developer.mozilla.org/en-US/docs/Web/API/Event/target',
        'MDN - Element.matches(): https://developer.mozilla.org/en-US/docs/Web/API/Element/matches',
        'MDN - Event phases: https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase'
    ],
    
    proximosTopicos: [
        '03-custom-events.js - Criação e dispatch de eventos customizados',
        '04-event-handling.js - Padrões avançados de manipulação de eventos',
        '08-Assincronismo - Eventos assíncronos e Promises',
        '09-ES6-Plus - Event listeners com arrow functions e destructuring'
    ],
    
    exerciciosAdicionais: [
        'Implementar sistema de drag and drop complexo',
        'Criar editor de texto com atalhos de teclado',
        'Desenvolver sistema de notificações em tempo real',
        'Construir interface de dashboard com múltiplos widgets'
    ]
};

console.log('Referências:', referencias.documentacao);
console.log('Próximos tópicos:', referencias.proximosTopicos);
console.log('Exercícios adicionais:', referencias.exerciciosAdicionais);

/*
===========================================
RESUMO DO MÓDULO - EVENT DELEGATION
===========================================

✅ CONCEITOS APRENDIDOS:
• Event delegation e bubbling
• Fases dos eventos (capturing, target, bubbling)
• Otimização de performance com delegation
• Padrões para elementos dinâmicos
• Sistemas escaláveis de eventos

✅ TÉCNICAS DOMINADAS:
• Roteamento de eventos com maps
• Cache de seletores para performance
• Throttling e debouncing
• Gerenciamento de memória
• Debugging de eventos

✅ PROJETOS DESENVOLVIDOS:
• Sistema de lista dinâmica completo
• Sistema de tabs com drag and drop
• Exemplos de otimização avançada

🎯 PRÓXIMO PASSO:
 Continue para 03-custom-events.js para aprender sobre
criação e manipulação de eventos customizados!

===========================================
*/