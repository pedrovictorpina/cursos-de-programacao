/*
===========================================
    MÓDULO 06 - DOM (Document Object Model)
    Aula 04: Criação de Elementos
===========================================

Objetivos de Aprendizagem:
✓ Dominar criação dinâmica de elementos DOM
✓ Compreender manipulação da árvore DOM
✓ Implementar sistemas de templates eficientes
✓ Aplicar técnicas de otimização na criação
✓ Desenvolver componentes reutilizáveis
*/

// ===========================================
// 1. TEORIA: CRIAÇÃO DE ELEMENTOS
// ===========================================

/*
MÉTODOS DE CRIAÇÃO NO DOM:

1. CRIAÇÃO BÁSICA:
   - document.createElement(): Cria elemento
   - document.createTextNode(): Cria nó de texto
   - document.createDocumentFragment(): Cria fragmento
   - element.cloneNode(): Clona elemento

2. INSERÇÃO NA ÁRVORE:
   - appendChild(): Adiciona como último filho
   - insertBefore(): Insere antes de elemento
   - insertAdjacentElement(): Inserção posicional
   - replaceChild(): Substitui elemento

3. REMOÇÃO:
   - removeChild(): Remove filho
   - element.remove(): Remove o próprio elemento
   - replaceWith(): Substitui elemento

4. OTIMIZAÇÃO:
   - DocumentFragment: Operações em lote
   - Template elements: Reutilização
   - Virtual DOM: Diff e patch
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Criação Básica de Elementos ---
console.log('=== CRIAÇÃO BÁSICA DE ELEMENTOS ===');

const exemploCriacaoBasica = {
    // Criar elemento simples
    criarElementoSimples(tag, conteudo = '', atributos = {}) {
        const elemento = document.createElement(tag);
        
        // Define conteúdo
        if (conteudo) {
            elemento.textContent = conteudo;
        }
        
        // Define atributos
        Object.entries(atributos).forEach(([chave, valor]) => {
            elemento.setAttribute(chave, valor);
        });
        
        return elemento;
    },
    
    // Criar elemento com HTML interno
    criarElementoComHTML(tag, html = '', atributos = {}) {
        const elemento = document.createElement(tag);
        
        // Define HTML interno (cuidado com XSS)
        if (html) {
            elemento.innerHTML = html;
        }
        
        // Define atributos
        Object.entries(atributos).forEach(([chave, valor]) => {
            elemento.setAttribute(chave, valor);
        });
        
        return elemento;
    },
    
    // Criar estrutura aninhada
    criarEstruturaAninhada(estrutura) {
        const criarNo = (config) => {
            if (typeof config === 'string') {
                return document.createTextNode(config);
            }
            
            const { tag, conteudo, atributos = {}, filhos = [] } = config;
            const elemento = document.createElement(tag);
            
            // Define atributos
            Object.entries(atributos).forEach(([chave, valor]) => {
                elemento.setAttribute(chave, valor);
            });
            
            // Define conteúdo de texto
            if (conteudo && typeof conteudo === 'string') {
                elemento.textContent = conteudo;
            }
            
            // Adiciona filhos recursivamente
            filhos.forEach(filho => {
                const noFilho = criarNo(filho);
                elemento.appendChild(noFilho);
            });
            
            return elemento;
        };
        
        return criarNo(estrutura);
    },
    
    // Exemplo de uso da estrutura aninhada
    exemploEstrutura() {
        return this.criarEstruturaAninhada({
            tag: 'div',
            atributos: { class: 'card', id: 'meu-card' },
            filhos: [
                {
                    tag: 'div',
                    atributos: { class: 'card-header' },
                    filhos: [
                        {
                            tag: 'h3',
                            conteudo: 'Título do Card'
                        }
                    ]
                },
                {
                    tag: 'div',
                    atributos: { class: 'card-body' },
                    filhos: [
                        {
                            tag: 'p',
                            conteudo: 'Conteúdo do card aqui.'
                        },
                        {
                            tag: 'button',
                            atributos: { class: 'btn btn-primary' },
                            conteudo: 'Ação'
                        }
                    ]
                }
            ]
        });
    }
};

// --- 2.2 Manipulação da Árvore DOM ---
console.log('\n=== MANIPULAÇÃO DA ÁRVORE DOM ===');

const exemploManipulacaoArvore = {
    // Gerenciador de inserção
    gerenciadorInsercao: {
        // Inserir no início
        inserirNoInicio(container, elemento) {
            if (!container || !elemento) return false;
            
            if (container.firstChild) {
                container.insertBefore(elemento, container.firstChild);
            } else {
                container.appendChild(elemento);
            }
            return true;
        },
        
        // Inserir no final
        inserirNoFinal(container, elemento) {
            if (!container || !elemento) return false;
            
            container.appendChild(elemento);
            return true;
        },
        
        // Inserir em posição específica
        inserirNaPosicao(container, elemento, posicao) {
            if (!container || !elemento) return false;
            
            const filhos = Array.from(container.children);
            
            if (posicao >= filhos.length) {
                container.appendChild(elemento);
            } else if (posicao <= 0) {
                this.inserirNoInicio(container, elemento);
            } else {
                container.insertBefore(elemento, filhos[posicao]);
            }
            
            return true;
        },
        
        // Inserir antes de elemento específico
        inserirAntes(elementoReferencia, novoElemento) {
            if (!elementoReferencia || !novoElemento) return false;
            
            const pai = elementoReferencia.parentNode;
            if (pai) {
                pai.insertBefore(novoElemento, elementoReferencia);
                return true;
            }
            return false;
        },
        
        // Inserir depois de elemento específico
        inserirDepois(elementoReferencia, novoElemento) {
            if (!elementoReferencia || !novoElemento) return false;
            
            const pai = elementoReferencia.parentNode;
            if (pai) {
                const proximoIrmao = elementoReferencia.nextSibling;
                if (proximoIrmao) {
                    pai.insertBefore(novoElemento, proximoIrmao);
                } else {
                    pai.appendChild(novoElemento);
                }
                return true;
            }
            return false;
        },
        
        // Mover elemento
        moverElemento(elemento, novoContainer, posicao = -1) {
            if (!elemento || !novoContainer) return false;
            
            // Remove do container atual
            if (elemento.parentNode) {
                elemento.parentNode.removeChild(elemento);
            }
            
            // Insere no novo container
            if (posicao === -1) {
                this.inserirNoFinal(novoContainer, elemento);
            } else {
                this.inserirNaPosicao(novoContainer, elemento, posicao);
            }
            
            return true;
        }
    },
    
    // Gerenciador de remoção
    gerenciadorRemocao: {
        // Remover elemento
        remover(elemento) {
            if (!elemento) return false;
            
            if (elemento.remove) {
                elemento.remove();
            } else if (elemento.parentNode) {
                elemento.parentNode.removeChild(elemento);
            }
            
            return true;
        },
        
        // Remover todos os filhos
        removerTodosFilhos(container) {
            if (!container) return false;
            
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            
            return true;
        },
        
        // Remover filhos por seletor
        removerFilhosPorSeletor(container, seletor) {
            if (!container || !seletor) return false;
            
            const elementos = container.querySelectorAll(seletor);
            elementos.forEach(elemento => this.remover(elemento));
            
            return elementos.length > 0;
        },
        
        // Substituir elemento
        substituir(elementoAntigo, elementoNovo) {
            if (!elementoAntigo || !elementoNovo) return false;
            
            const pai = elementoAntigo.parentNode;
            if (pai) {
                pai.replaceChild(elementoNovo, elementoAntigo);
                return true;
            }
            return false;
        }
    },
    
    // Clonagem de elementos
    gerenciadorClonagem: {
        // Clonar elemento
        clonar(elemento, profundo = true) {
            if (!elemento) return null;
            
            return elemento.cloneNode(profundo);
        },
        
        // Clonar com novos atributos
        clonarComAtributos(elemento, novosAtributos = {}) {
            const clone = this.clonar(elemento);
            
            if (clone) {
                Object.entries(novosAtributos).forEach(([chave, valor]) => {
                    clone.setAttribute(chave, valor);
                });
            }
            
            return clone;
        },
        
        // Clonar múltiplas vezes
        clonarMultiplo(elemento, quantidade, modificador = null) {
            if (!elemento || quantidade <= 0) return [];
            
            const clones = [];
            
            for (let i = 0; i < quantidade; i++) {
                const clone = this.clonar(elemento);
                
                if (modificador && typeof modificador === 'function') {
                    modificador(clone, i);
                }
                
                clones.push(clone);
            }
            
            return clones;
        }
    }
};

// --- 2.3 Sistema de Templates ---
console.log('\n=== SISTEMA DE TEMPLATES ===');

const exemploTemplates = {
    // Template engine simples
    templateEngine: {
        // Cache de templates
        cache: new Map(),
        
        // Registrar template
        registrar(nome, template) {
            this.cache.set(nome, template);
        },
        
        // Renderizar template
        renderizar(nome, dados = {}) {
            const template = this.cache.get(nome);
            if (!template) {
                throw new Error(`Template '${nome}' não encontrado`);
            }
            
            return this.processarTemplate(template, dados);
        },
        
        // Processar template com dados
        processarTemplate(template, dados) {
            let resultado = template;
            
            // Substituições simples {{variavel}}
            resultado = resultado.replace(/{{(\w+)}}/g, (match, chave) => {
                return dados[chave] || '';
            });
            
            // Condicionais {{#if variavel}}...{{/if}}
            resultado = resultado.replace(
                /{{#if (\w+)}}([\s\S]*?){{/if}}/g,
                (match, chave, conteudo) => {
                    return dados[chave] ? conteudo : '';
                }
            );
            
            // Loops {{#each array}}...{{/each}}
            resultado = resultado.replace(
                /{{#each (\w+)}}([\s\S]*?){{/each}}/g,
                (match, chave, conteudo) => {
                    const array = dados[chave];
                    if (!Array.isArray(array)) return '';
                    
                    return array.map((item, index) => {
                        let itemConteudo = conteudo;
                        
                        // Substitui {{this}} pelo item atual
                        itemConteudo = itemConteudo.replace(/{{this}}/g, item);
                        
                        // Substitui {{@index}} pelo índice
                        itemConteudo = itemConteudo.replace(/{{@index}}/g, index);
                        
                        // Se item é objeto, substitui propriedades
                        if (typeof item === 'object') {
                            Object.entries(item).forEach(([prop, valor]) => {
                                const regex = new RegExp(`{{${prop}}}`, 'g');
                                itemConteudo = itemConteudo.replace(regex, valor);
                            });
                        }
                        
                        return itemConteudo;
                    }).join('');
                }
            );
            
            return resultado;
        },
        
        // Criar elemento a partir de template
        criarElemento(nome, dados = {}) {
            const html = this.renderizar(nome, dados);
            const container = document.createElement('div');
            container.innerHTML = html.trim();
            
            // Retorna o primeiro elemento filho
            return container.firstElementChild;
        }
    },
    
    // Templates pré-definidos
    templatesBasicos: {
        // Registrar templates básicos
        registrarTemplatesBasicos() {
            const engine = exemploTemplates.templateEngine;
            
            // Template de card
            engine.registrar('card', `
                <div class="card {{classe}}">
                    {{#if titulo}}
                    <div class="card-header">
                        <h3>{{titulo}}</h3>
                    </div>
                    {{/if}}
                    <div class="card-body">
                        <p>{{conteudo}}</p>
                        {{#if botoes}}
                        <div class="card-actions">
                            {{#each botoes}}
                            <button class="btn {{classe}}">{{texto}}</button>
                            {{/each}}
                        </div>
                        {{/if}}
                    </div>
                </div>
            `);
            
            // Template de lista
            engine.registrar('lista', `
                <div class="lista {{classe}}">
                    {{#if titulo}}
                    <h3 class="lista-titulo">{{titulo}}</h3>
                    {{/if}}
                    <ul class="lista-items">
                        {{#each items}}
                        <li class="lista-item">{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
            `);
            
            // Template de formulário
            engine.registrar('formulario', `
                <form class="formulario {{classe}}" id="{{id}}">
                    {{#if titulo}}
                    <h2 class="formulario-titulo">{{titulo}}</h2>
                    {{/if}}
                    {{#each campos}}
                    <div class="campo">
                        <label for="{{nome}}">{{label}}</label>
                        <input type="{{tipo}}" id="{{nome}}" name="{{nome}}" 
                               placeholder="{{placeholder}}" {{#if obrigatorio}}required{{/if}}>
                    </div>
                    {{/each}}
                    <div class="formulario-acoes">
                        <button type="submit" class="btn btn-primary">{{textoBotao}}</button>
                    </div>
                </form>
            `);
            
            // Template de modal
            engine.registrar('modal', `
                <div class="modal {{classe}}" id="{{id}}">
                    <div class="modal-backdrop"></div>
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>{{titulo}}</h2>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            {{conteudo}}
                        </div>
                        {{#if botoes}}
                        <div class="modal-footer">
                            {{#each botoes}}
                            <button class="btn {{classe}}" data-acao="{{acao}}">{{texto}}</button>
                            {{/each}}
                        </div>
                        {{/if}}
                    </div>
                </div>
            `);
        }
    }
};

// Registrar templates básicos
exemploTemplates.templatesBasicos.registrarTemplatesBasicos();

// --- 2.4 DocumentFragment para Performance ---
console.log('\n=== DOCUMENT FRAGMENT ===');

const exemploDocumentFragment = {
    // Criação otimizada de múltiplos elementos
    criarMultiplosElementos(elementos, container) {
        if (!Array.isArray(elementos) || !container) return false;
        
        // Cria fragment para operações em lote
        const fragment = document.createDocumentFragment();
        
        elementos.forEach(config => {
            let elemento;
            
            if (typeof config === 'string') {
                // Se é string, cria elemento de texto
                elemento = document.createTextNode(config);
            } else if (config.template) {
                // Se tem template, usa o template engine
                elemento = exemploTemplates.templateEngine.criarElemento(
                    config.template,
                    config.dados || {}
                );
            } else {
                // Criação manual
                elemento = exemploCriacaoBasica.criarElementoSimples(
                    config.tag || 'div',
                    config.conteudo || '',
                    config.atributos || {}
                );
            }
            
            if (elemento) {
                fragment.appendChild(elemento);
            }
        });
        
        // Adiciona tudo de uma vez (apenas um reflow)
        container.appendChild(fragment);
        
        return true;
    },
    
    // Lista virtual para grandes quantidades de dados
    criarListaVirtual(dados, container, opcoes = {}) {
        if (!Array.isArray(dados) || !container) return false;
        
        const {
            itemsPorPagina = 50,
            templateItem = 'lista-item',
            altura = 400
        } = opcoes;
        
        let paginaAtual = 0;
        const totalPaginas = Math.ceil(dados.length / itemsPorPagina);
        
        // Configura container
        container.style.height = altura + 'px';
        container.style.overflowY = 'auto';
        
        const renderizarPagina = (pagina) => {
            const inicio = pagina * itemsPorPagina;
            const fim = Math.min(inicio + itemsPorPagina, dados.length);
            const dadosPagina = dados.slice(inicio, fim);
            
            const fragment = document.createDocumentFragment();
            
            dadosPagina.forEach(item => {
                const elemento = exemploTemplates.templateEngine.criarElemento(
                    templateItem,
                    { item, dados: item }
                );
                fragment.appendChild(elemento);
            });
            
            return fragment;
        };
        
        // Renderiza primeira página
        container.appendChild(renderizarPagina(0));
        
        // Configura scroll infinito
        container.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                paginaAtual++;
                if (paginaAtual < totalPaginas) {
                    container.appendChild(renderizarPagina(paginaAtual));
                }
            }
        });
        
        return true;
    }
};

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Componentes Dinâmicos ---
console.log('\n=== EXERCÍCIO 1: COMPONENTES DINÂMICOS ===');

class ComponenteDinamico {
    constructor(config) {
        this.config = {
            tag: 'div',
            classe: '',
            atributos: {},
            eventos: {},
            filhos: [],
            template: null,
            dados: {},
            ...config
        };
        
        this.elemento = null;
        this.filhosComponentes = [];
        this.eventListeners = new Map();
        
        this.criar();
    }
    
    // Criar elemento
    criar() {
        if (this.config.template) {
            // Usa template engine
            this.elemento = exemploTemplates.templateEngine.criarElemento(
                this.config.template,
                this.config.dados
            );
        } else {
            // Criação manual
            this.elemento = document.createElement(this.config.tag);
            
            // Define classe
            if (this.config.classe) {
                this.elemento.className = this.config.classe;
            }
            
            // Define atributos
            Object.entries(this.config.atributos).forEach(([chave, valor]) => {
                this.elemento.setAttribute(chave, valor);
            });
        }
        
        // Adiciona filhos
        this.adicionarFilhos();
        
        // Configura eventos
        this.configurarEventos();
        
        return this.elemento;
    }
    
    // Adicionar filhos
    adicionarFilhos() {
        if (!this.config.filhos.length) return;
        
        const fragment = document.createDocumentFragment();
        
        this.config.filhos.forEach(configFilho => {
            let filho;
            
            if (typeof configFilho === 'string') {
                filho = document.createTextNode(configFilho);
            } else if (configFilho instanceof ComponenteDinamico) {
                filho = configFilho.elemento;
                this.filhosComponentes.push(configFilho);
            } else {
                const componenteFilho = new ComponenteDinamico(configFilho);
                filho = componenteFilho.elemento;
                this.filhosComponentes.push(componenteFilho);
            }
            
            fragment.appendChild(filho);
        });
        
        this.elemento.appendChild(fragment);
    }
    
    // Configurar eventos
    configurarEventos() {
        Object.entries(this.config.eventos).forEach(([evento, handler]) => {
            this.elemento.addEventListener(evento, handler);
            this.eventListeners.set(evento, handler);
        });
    }
    
    // Atualizar dados
    atualizarDados(novosDados) {
        this.config.dados = { ...this.config.dados, ...novosDados };
        
        if (this.config.template) {
            // Re-renderiza com template
            const novoElemento = exemploTemplates.templateEngine.criarElemento(
                this.config.template,
                this.config.dados
            );
            
            this.elemento.parentNode.replaceChild(novoElemento, this.elemento);
            this.elemento = novoElemento;
            this.configurarEventos();
        }
    }
    
    // Adicionar filho
    adicionarFilho(configFilho) {
        let filho;
        
        if (typeof configFilho === 'string') {
            filho = document.createTextNode(configFilho);
        } else {
            const componenteFilho = new ComponenteDinamico(configFilho);
            filho = componenteFilho.elemento;
            this.filhosComponentes.push(componenteFilho);
        }
        
        this.elemento.appendChild(filho);
        return filho;
    }
    
    // Remover filho
    removerFilho(indice) {
        const filhos = Array.from(this.elemento.children);
        if (indice >= 0 && indice < filhos.length) {
            filhos[indice].remove();
            
            // Remove do array de componentes filhos
            if (this.filhosComponentes[indice]) {
                this.filhosComponentes[indice].destruir();
                this.filhosComponentes.splice(indice, 1);
            }
        }
    }
    
    // Encontrar filho por seletor
    encontrarFilho(seletor) {
        return this.elemento.querySelector(seletor);
    }
    
    // Encontrar todos os filhos por seletor
    encontrarTodosFilhos(seletor) {
        return Array.from(this.elemento.querySelectorAll(seletor));
    }
    
    // Clonar componente
    clonar() {
        return new ComponenteDinamico(this.config);
    }
    
    // Destruir componente
    destruir() {
        // Remove event listeners
        this.eventListeners.forEach((handler, evento) => {
            this.elemento.removeEventListener(evento, handler);
        });
        
        // Destrói filhos componentes
        this.filhosComponentes.forEach(filho => filho.destruir());
        
        // Remove elemento do DOM
        if (this.elemento && this.elemento.parentNode) {
            this.elemento.parentNode.removeChild(this.elemento);
        }
        
        // Limpa referências
        this.elemento = null;
        this.filhosComponentes = [];
        this.eventListeners.clear();
    }
}

// Factory para componentes comuns
class FactoryComponentesDinamicos {
    static criarBotao(texto, acao, tipo = 'primary') {
        return new ComponenteDinamico({
            tag: 'button',
            classe: `btn btn-${tipo}`,
            atributos: { type: 'button' },
            filhos: [texto],
            eventos: {
                click: acao
            }
        });
    }
    
    static criarInput(config) {
        const {
            tipo = 'text',
            nome,
            placeholder = '',
            valor = '',
            obrigatorio = false
        } = config;
        
        return new ComponenteDinamico({
            tag: 'input',
            classe: 'form-control',
            atributos: {
                type: tipo,
                name: nome,
                placeholder: placeholder,
                value: valor,
                ...(obrigatorio && { required: true })
            }
        });
    }
    
    static criarCard(titulo, conteudo, acoes = []) {
        const filhos = [
            {
                tag: 'div',
                classe: 'card-header',
                filhos: [
                    {
                        tag: 'h3',
                        filhos: [titulo]
                    }
                ]
            },
            {
                tag: 'div',
                classe: 'card-body',
                filhos: [
                    {
                        tag: 'p',
                        filhos: [conteudo]
                    }
                ]
            }
        ];
        
        if (acoes.length > 0) {
            filhos.push({
                tag: 'div',
                classe: 'card-footer',
                filhos: acoes.map(acao => ({
                    tag: 'button',
                    classe: `btn btn-${acao.tipo || 'primary'}`,
                    filhos: [acao.texto],
                    eventos: {
                        click: acao.handler
                    }
                }))
            });
        }
        
        return new ComponenteDinamico({
            tag: 'div',
            classe: 'card',
            filhos: filhos
        });
    }
    
    static criarLista(items, config = {}) {
        const {
            ordenada = false,
            classe = 'lista',
            renderizarItem = (item) => item.toString()
        } = config;
        
        return new ComponenteDinamico({
            tag: ordenada ? 'ol' : 'ul',
            classe: classe,
            filhos: items.map(item => ({
                tag: 'li',
                classe: 'lista-item',
                filhos: [renderizarItem(item)]
            }))
        });
    }
}

// Exemplo de uso dos componentes dinâmicos
console.log('Sistema de componentes dinâmicos criado!');

// --- EXERCÍCIO 2: Construtor de Páginas ---
console.log('\n=== EXERCÍCIO 2: CONSTRUTOR DE PÁGINAS ===');

class ConstrutorPaginas {
    constructor() {
        this.paginas = new Map();
        this.paginaAtual = null;
        this.container = null;
        this.historico = [];
        this.indiceHistorico = -1;
    }
    
    // Definir container principal
    definirContainer(container) {
        this.container = container;
    }
    
    // Registrar página
    registrarPagina(nome, config) {
        this.paginas.set(nome, {
            titulo: config.titulo || nome,
            componentes: config.componentes || [],
            estilos: config.estilos || {},
            scripts: config.scripts || [],
            metadados: config.metadados || {},
            ...config
        });
    }
    
    // Construir página
    construirPagina(nome) {
        const config = this.paginas.get(nome);
        if (!config) {
            throw new Error(`Página '${nome}' não encontrada`);
        }
        
        // Cria container da página
        const paginaElemento = new ComponenteDinamico({
            tag: 'div',
            classe: `pagina pagina-${nome}`,
            atributos: {
                'data-pagina': nome
            }
        });
        
        // Adiciona componentes
        config.componentes.forEach(componenteConfig => {
            let componente;
            
            if (componenteConfig instanceof ComponenteDinamico) {
                componente = componenteConfig;
            } else {
                componente = new ComponenteDinamico(componenteConfig);
            }
            
            paginaElemento.adicionarFilho(componente.config);
        });
        
        // Aplica estilos específicos da página
        Object.entries(config.estilos).forEach(([propriedade, valor]) => {
            paginaElemento.elemento.style.setProperty(propriedade, valor);
        });
        
        return paginaElemento;
    }
    
    // Navegar para página
    navegarPara(nome, adicionarAoHistorico = true) {
        if (!this.container) {
            throw new Error('Container não definido');
        }
        
        const paginaElemento = this.construirPagina(nome);
        
        // Limpa container
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        
        // Adiciona nova página
        this.container.appendChild(paginaElemento.elemento);
        
        // Atualiza página atual
        this.paginaAtual = nome;
        
        // Adiciona ao histórico
        if (adicionarAoHistorico) {
            this.historico = this.historico.slice(0, this.indiceHistorico + 1);
            this.historico.push(nome);
            this.indiceHistorico++;
        }
        
        // Executa scripts da página
        const config = this.paginas.get(nome);
        config.scripts.forEach(script => {
            if (typeof script === 'function') {
                script(paginaElemento.elemento);
            }
        });
        
        // Dispara evento de navegação
        window.dispatchEvent(new CustomEvent('paginaAlterada', {
            detail: { pagina: nome, elemento: paginaElemento.elemento }
        }));
        
        return paginaElemento;
    }
    
    // Voltar no histórico
    voltar() {
        if (this.indiceHistorico > 0) {
            this.indiceHistorico--;
            const paginaAnterior = this.historico[this.indiceHistorico];
            this.navegarPara(paginaAnterior, false);
            return true;
        }
        return false;
    }
    
    // Avançar no histórico
    avancar() {
        if (this.indiceHistorico < this.historico.length - 1) {
            this.indiceHistorico++;
            const proximaPagina = this.historico[this.indiceHistorico];
            this.navegarPara(proximaPagina, false);
            return true;
        }
        return false;
    }
    
    // Obter página atual
    obterPaginaAtual() {
        return this.paginaAtual;
    }
    
    // Listar páginas registradas
    listarPaginas() {
        return Array.from(this.paginas.keys());
    }
    
    // Remover página
    removerPagina(nome) {
        return this.paginas.delete(nome);
    }
    
    // Criar menu de navegação
    criarMenuNavegacao(opcoes = {}) {
        const {
            classe = 'menu-navegacao',
            mostrarTitulos = true
        } = opcoes;
        
        const itensMenu = Array.from(this.paginas.entries()).map(([nome, config]) => {
            return {
                tag: 'li',
                classe: 'menu-item',
                filhos: [
                    {
                        tag: 'a',
                        classe: 'menu-link',
                        atributos: {
                            href: '#',
                            'data-pagina': nome
                        },
                        filhos: [mostrarTitulos ? config.titulo : nome],
                        eventos: {
                            click: (e) => {
                                e.preventDefault();
                                this.navegarPara(nome);
                            }
                        }
                    }
                ]
            };
        });
        
        return new ComponenteDinamico({
            tag: 'nav',
            classe: classe,
            filhos: [
                {
                    tag: 'ul',
                    classe: 'menu-lista',
                    filhos: itensMenu
                }
            ]
        });
    }
}

// Exemplo de uso do construtor de páginas
const construtor = new ConstrutorPaginas();
console.log('Construtor de páginas criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasOtimizacao = {
    // Performance na criação
    performance: {
        // Pool de elementos reutilizáveis
        poolElementos: new Map(),
        
        // Obter elemento do pool
        obterDoPool(tag) {
            if (!this.poolElementos.has(tag)) {
                this.poolElementos.set(tag, []);
            }
            
            const pool = this.poolElementos.get(tag);
            
            if (pool.length > 0) {
                return pool.pop();
            } else {
                return document.createElement(tag);
            }
        },
        
        // Retornar elemento ao pool
        retornarAoPool(elemento) {
            if (!elemento) return;
            
            // Limpa o elemento
            elemento.innerHTML = '';
            elemento.removeAttribute('class');
            elemento.removeAttribute('style');
            
            // Remove todos os atributos exceto tag
            Array.from(elemento.attributes).forEach(attr => {
                elemento.removeAttribute(attr.name);
            });
            
            const tag = elemento.tagName.toLowerCase();
            const pool = this.poolElementos.get(tag) || [];
            
            if (pool.length < 50) { // Limita tamanho do pool
                pool.push(elemento);
                this.poolElementos.set(tag, pool);
            }
        },
        
        // Batch de operações DOM
        executarEmLote(operacoes) {
            const fragment = document.createDocumentFragment();
            
            operacoes.forEach(operacao => {
                operacao(fragment);
            });
            
            return fragment;
        },
        
        // Medição de performance
        medirPerformance(nome, funcao) {
            const inicio = performance.now();
            const resultado = funcao();
            const fim = performance.now();
            
            console.log(`${nome}: ${fim - inicio}ms`);
            return resultado;
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Limpeza de componentes órfãos
        limparComponentesOrfaos() {
            // Remove elementos que não estão mais no DOM
            const elementosOrfaos = document.querySelectorAll('[data-componente]');
            
            elementosOrfaos.forEach(elemento => {
                if (!document.body.contains(elemento)) {
                    // Elemento órfão encontrado
                    console.warn('Elemento órfão removido:', elemento);
                }
            });
        },
        
        // Observer para detectar remoções
        criarObservadorRemocao(callback) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            callback(node);
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
    
    // Otimização de templates
    templates: {
        // Cache compilado de templates
        cacheCompilado: new Map(),
        
        // Compilar template para função
        compilarTemplate(template) {
            if (this.cacheCompilado.has(template)) {
                return this.cacheCompilado.get(template);
            }
            
            // Cria função que renderiza o template
            const funcaoRenderizacao = new Function('dados', `
                const { ${Object.keys(template.dados || {}).join(', ')} } = dados;
                return \`${template}\`;
            `);
            
            this.cacheCompilado.set(template, funcaoRenderizacao);
            return funcaoRenderizacao;
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');

const referencias = {
    documentacao: [
        'MDN - Creating and inserting nodes: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction',
        'MDN - DocumentFragment: https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment',
        'MDN - Template element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template',
        'MDN - Web Components: https://developer.mozilla.org/en-US/docs/Web/Web_Components'
    ],
    
    topicosAvancados: [
        'Virtual DOM e algoritmos de diff',
        'Web Components e Custom Elements',
        'Shadow DOM e encapsulamento',
        'Template engines avançados (Handlebars, Mustache)',
        'Server-side rendering (SSR)'
    ],
    
    proximosPassos: [
        'Estudar eventos e interatividade',
        'Aprender manipulação avançada de formulários',
        'Dominar animações e transições',
        'Implementar arquiteturas de componentes'
    ]
};

console.log('Referências carregadas. Próximo módulo: Eventos!');

/*
===========================================
RESUMO DO MÓDULO - CRIAÇÃO DE ELEMENTOS
===========================================

✅ CONCEITOS APRENDIDOS:
• Criação dinâmica de elementos DOM
• Manipulação da árvore DOM
• Sistema de templates eficiente
• DocumentFragment para performance
• Componentes reutilizáveis
• Construtor de páginas dinâmicas

🎯 HABILIDADES DESENVOLVIDAS:
• Sistema de componentes dinâmicos
• Template engine personalizado
• Pool de elementos para performance
• Gerenciamento de memória
• Navegação entre páginas
• Otimização de operações DOM

📚 PRÓXIMA AULA:
• Eventos e interatividade
• Event delegation
• Eventos customizados
• Gerenciamento de eventos

===========================================
*/