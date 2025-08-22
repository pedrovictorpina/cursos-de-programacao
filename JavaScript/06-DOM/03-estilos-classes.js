/*
===========================================
    MÓDULO 06 - DOM (Document Object Model)
    Aula 03: Estilos e Classes CSS
===========================================

Objetivos de Aprendizagem:
✓ Dominar manipulação de classes CSS via JavaScript
✓ Compreender modificação de estilos inline e computados
✓ Implementar sistemas de temas dinâmicos
✓ Aplicar animações e transições programáticas
✓ Otimizar performance na manipulação de estilos
*/

// ===========================================
// 1. TEORIA: ESTILOS E CLASSES
// ===========================================

/*
MANIPULAÇÃO DE ESTILOS NO DOM:

1. CLASSES CSS:
   - classList.add(): Adiciona classes
   - classList.remove(): Remove classes
   - classList.toggle(): Alterna classes
   - classList.contains(): Verifica existência
   - classList.replace(): Substitui classes

2. ESTILOS INLINE:
   - element.style.property: Acesso direto
   - element.style.setProperty(): Método formal
   - element.style.removeProperty(): Remove propriedade
   - element.style.cssText: Define múltiplas propriedades

3. ESTILOS COMPUTADOS:
   - getComputedStyle(): Obtém estilos finais
   - Considera CSS, herança e cascata
   - Somente leitura

4. CSS CUSTOM PROPERTIES (Variáveis CSS):
   - --nome-variavel: Definição
   - var(--nome-variavel): Uso
   - Manipulação via JavaScript
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Manipulação de Classes ---
console.log('=== MANIPULAÇÃO DE CLASSES ===');

const exemploClasses = {
    // Gerenciador avançado de classes
    gerenciadorClasses: {
        // Adicionar múltiplas classes
        adicionarMultiplas(elemento, classes) {
            if (!elemento || !Array.isArray(classes)) return false;
            
            classes.forEach(classe => {
                if (classe && typeof classe === 'string') {
                    elemento.classList.add(classe);
                }
            });
            return true;
        },
        
        // Remover múltiplas classes
        removerMultiplas(elemento, classes) {
            if (!elemento || !Array.isArray(classes)) return false;
            
            classes.forEach(classe => {
                if (classe && typeof classe === 'string') {
                    elemento.classList.remove(classe);
                }
            });
            return true;
        },
        
        // Alternar com condição
        alternarCondicional(elemento, classe, condicao) {
            if (!elemento || !classe) return false;
            
            if (condicao) {
                elemento.classList.add(classe);
            } else {
                elemento.classList.remove(classe);
            }
            return true;
        },
        
        // Substituir classe com fallback
        substituirClasse(elemento, classeAntiga, classeNova) {
            if (!elemento || !classeAntiga || !classeNova) return false;
            
            if (elemento.classList.contains(classeAntiga)) {
                elemento.classList.replace(classeAntiga, classeNova);
            } else {
                elemento.classList.add(classeNova);
            }
            return true;
        },
        
        // Obter todas as classes como array
        obterClasses(elemento) {
            return elemento ? Array.from(elemento.classList) : [];
        },
        
        // Verificar múltiplas classes
        contemClasses(elemento, classes, todasObrigatorias = true) {
            if (!elemento || !Array.isArray(classes)) return false;
            
            if (todasObrigatorias) {
                return classes.every(classe => elemento.classList.contains(classe));
            } else {
                return classes.some(classe => elemento.classList.contains(classe));
            }
        }
    },
    
    // Sistema de estados visuais
    estadosVisuais: {
        estados: ['normal', 'hover', 'active', 'disabled', 'loading'],
        
        // Definir estado
        definirEstado(elemento, novoEstado) {
            if (!elemento || !this.estados.includes(novoEstado)) return false;
            
            // Remove todos os estados anteriores
            this.estados.forEach(estado => {
                elemento.classList.remove(`estado-${estado}`);
            });
            
            // Adiciona o novo estado
            elemento.classList.add(`estado-${novoEstado}`);
            
            // Adiciona atributo para acessibilidade
            elemento.setAttribute('data-estado', novoEstado);
            
            return true;
        },
        
        // Obter estado atual
        obterEstado(elemento) {
            if (!elemento) return null;
            
            for (const estado of this.estados) {
                if (elemento.classList.contains(`estado-${estado}`)) {
                    return estado;
                }
            }
            return 'normal';
        },
        
        // Verificar se está em estado específico
        estaEmEstado(elemento, estado) {
            return elemento ? elemento.classList.contains(`estado-${estado}`) : false;
        }
    }
};

// --- 2.2 Manipulação de Estilos Inline ---
console.log('\n=== MANIPULAÇÃO DE ESTILOS INLINE ===');

const exemploEstilos = {
    // Gerenciador de estilos inline
    gerenciadorEstilos: {
        // Definir estilo único
        definir(elemento, propriedade, valor) {
            if (!elemento || !propriedade) return false;
            
            try {
                elemento.style.setProperty(propriedade, valor);
                return true;
            } catch (error) {
                console.error('Erro ao definir estilo:', error);
                return false;
            }
        },
        
        // Definir múltiplos estilos
        definirMultiplos(elemento, estilos) {
            if (!elemento || typeof estilos !== 'object') return false;
            
            Object.entries(estilos).forEach(([propriedade, valor]) => {
                this.definir(elemento, propriedade, valor);
            });
            
            return true;
        },
        
        // Obter estilo computado
        obterComputado(elemento, propriedade) {
            if (!elemento || !propriedade) return null;
            
            const estilosComputados = window.getComputedStyle(elemento);
            return estilosComputados.getPropertyValue(propriedade);
        },
        
        // Remover estilo
        remover(elemento, propriedade) {
            if (!elemento || !propriedade) return false;
            
            elemento.style.removeProperty(propriedade);
            return true;
        },
        
        // Limpar todos os estilos inline
        limparTodos(elemento) {
            if (!elemento) return false;
            
            elemento.removeAttribute('style');
            return true;
        },
        
        // Copiar estilos entre elementos
        copiarEstilos(origem, destino, propriedades = []) {
            if (!origem || !destino) return false;
            
            if (propriedades.length === 0) {
                // Copia todos os estilos inline
                destino.style.cssText = origem.style.cssText;
            } else {
                // Copia propriedades específicas
                propriedades.forEach(prop => {
                    const valor = this.obterComputado(origem, prop);
                    if (valor) {
                        this.definir(destino, prop, valor);
                    }
                });
            }
            
            return true;
        }
    },
    
    // Animações CSS via JavaScript
    animacoes: {
        // Fade in
        fadeIn(elemento, duracao = 300) {
            if (!elemento) return Promise.reject('Elemento não encontrado');
            
            return new Promise(resolve => {
                elemento.style.opacity = '0';
                elemento.style.display = 'block';
                elemento.style.transition = `opacity ${duracao}ms ease-in-out`;
                
                // Force reflow
                elemento.offsetHeight;
                
                elemento.style.opacity = '1';
                
                setTimeout(() => {
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        },
        
        // Fade out
        fadeOut(elemento, duracao = 300) {
            if (!elemento) return Promise.reject('Elemento não encontrado');
            
            return new Promise(resolve => {
                elemento.style.transition = `opacity ${duracao}ms ease-in-out`;
                elemento.style.opacity = '0';
                
                setTimeout(() => {
                    elemento.style.display = 'none';
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        },
        
        // Slide down
        slideDown(elemento, duracao = 300) {
            if (!elemento) return Promise.reject('Elemento não encontrado');
            
            return new Promise(resolve => {
                elemento.style.height = '0';
                elemento.style.overflow = 'hidden';
                elemento.style.display = 'block';
                
                const alturaFinal = elemento.scrollHeight + 'px';
                
                elemento.style.transition = `height ${duracao}ms ease-in-out`;
                elemento.style.height = alturaFinal;
                
                setTimeout(() => {
                    elemento.style.height = '';
                    elemento.style.overflow = '';
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        },
        
        // Slide up
        slideUp(elemento, duracao = 300) {
            if (!elemento) return Promise.reject('Elemento não encontrado');
            
            return new Promise(resolve => {
                elemento.style.height = elemento.offsetHeight + 'px';
                elemento.style.overflow = 'hidden';
                elemento.style.transition = `height ${duracao}ms ease-in-out`;
                
                // Force reflow
                elemento.offsetHeight;
                
                elemento.style.height = '0';
                
                setTimeout(() => {
                    elemento.style.display = 'none';
                    elemento.style.height = '';
                    elemento.style.overflow = '';
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        },
        
        // Animação personalizada
        animar(elemento, propriedades, duracao = 300, easing = 'ease-in-out') {
            if (!elemento || typeof propriedades !== 'object') {
                return Promise.reject('Parâmetros inválidos');
            }
            
            return new Promise(resolve => {
                const transicoes = Object.keys(propriedades)
                    .map(prop => `${prop} ${duracao}ms ${easing}`)
                    .join(', ');
                
                elemento.style.transition = transicoes;
                
                Object.entries(propriedades).forEach(([prop, valor]) => {
                    elemento.style.setProperty(prop, valor);
                });
                
                setTimeout(() => {
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        }
    }
};

// --- 2.3 CSS Custom Properties (Variáveis CSS) ---
console.log('\n=== CSS CUSTOM PROPERTIES ===');

const exemploVariaveisCSS = {
    // Gerenciador de variáveis CSS
    gerenciadorVariaveis: {
        // Definir variável CSS
        definir(elemento, nome, valor) {
            if (!elemento || !nome) return false;
            
            const nomeVariavel = nome.startsWith('--') ? nome : `--${nome}`;
            elemento.style.setProperty(nomeVariavel, valor);
            return true;
        },
        
        // Obter variável CSS
        obter(elemento, nome) {
            if (!elemento || !nome) return null;
            
            const nomeVariavel = nome.startsWith('--') ? nome : `--${nome}`;
            const estilosComputados = window.getComputedStyle(elemento);
            return estilosComputados.getPropertyValue(nomeVariavel).trim();
        },
        
        // Definir variáveis globais (no :root)
        definirGlobal(nome, valor) {
            return this.definir(document.documentElement, nome, valor);
        },
        
        // Obter variável global
        obterGlobal(nome) {
            return this.obter(document.documentElement, nome);
        },
        
        // Definir múltiplas variáveis
        definirMultiplas(elemento, variaveis) {
            if (!elemento || typeof variaveis !== 'object') return false;
            
            Object.entries(variaveis).forEach(([nome, valor]) => {
                this.definir(elemento, nome, valor);
            });
            
            return true;
        },
        
        // Remover variável
        remover(elemento, nome) {
            if (!elemento || !nome) return false;
            
            const nomeVariavel = nome.startsWith('--') ? nome : `--${nome}`;
            elemento.style.removeProperty(nomeVariavel);
            return true;
        }
    },
    
    // Sistema de temas
    sistemaTemas: {
        temas: {
            claro: {
                '--cor-primaria': '#007bff',
                '--cor-secundaria': '#6c757d',
                '--cor-fundo': '#ffffff',
                '--cor-texto': '#212529',
                '--cor-borda': '#dee2e6'
            },
            escuro: {
                '--cor-primaria': '#0d6efd',
                '--cor-secundaria': '#6c757d',
                '--cor-fundo': '#212529',
                '--cor-texto': '#ffffff',
                '--cor-borda': '#495057'
            },
            azul: {
                '--cor-primaria': '#0066cc',
                '--cor-secundaria': '#004499',
                '--cor-fundo': '#f0f8ff',
                '--cor-texto': '#003366',
                '--cor-borda': '#b3d9ff'
            }
        },
        
        temaAtual: 'claro',
        
        // Aplicar tema
        aplicarTema(nomeTema) {
            if (!this.temas[nomeTema]) {
                console.warn(`Tema '${nomeTema}' não encontrado`);
                return false;
            }
            
            const tema = this.temas[nomeTema];
            
            Object.entries(tema).forEach(([variavel, valor]) => {
                exemploVariaveisCSS.gerenciadorVariaveis.definirGlobal(variavel, valor);
            });
            
            this.temaAtual = nomeTema;
            
            // Salva preferência no localStorage
            localStorage.setItem('tema-preferido', nomeTema);
            
            // Adiciona classe no body para CSS adicional
            document.body.className = document.body.className
                .replace(/tema-\w+/g, '')
                .trim();
            document.body.classList.add(`tema-${nomeTema}`);
            
            return true;
        },
        
        // Obter tema atual
        obterTemaAtual() {
            return this.temaAtual;
        },
        
        // Alternar entre temas
        alternarTema() {
            const temas = Object.keys(this.temas);
            const indiceAtual = temas.indexOf(this.temaAtual);
            const proximoIndice = (indiceAtual + 1) % temas.length;
            
            return this.aplicarTema(temas[proximoIndice]);
        },
        
        // Carregar tema salvo
        carregarTemaSalvo() {
            const temaSalvo = localStorage.getItem('tema-preferido');
            if (temaSalvo && this.temas[temaSalvo]) {
                this.aplicarTema(temaSalvo);
            }
        },
        
        // Adicionar novo tema
        adicionarTema(nome, variaveis) {
            if (!nome || typeof variaveis !== 'object') return false;
            
            this.temas[nome] = { ...variaveis };
            return true;
        },
        
        // Detectar preferência do sistema
        detectarPreferenciaSistema() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'escuro';
            }
            return 'claro';
        },
        
        // Configurar detecção automática
        configurarDetecaoAutomatica() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const aplicarTemaAutomatico = (e) => {
                const tema = e.matches ? 'escuro' : 'claro';
                this.aplicarTema(tema);
            };
            
            mediaQuery.addListener(aplicarTemaAutomatico);
            aplicarTemaAutomatico(mediaQuery);
        }
    }
};

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Componentes Visuais ---
console.log('\n=== EXERCÍCIO 1: COMPONENTES VISUAIS ===');

class ComponenteVisual {
    constructor(elemento) {
        this.elemento = elemento;
        this.estado = 'normal';
        this.animacoes = new Map();
        this.configurarEventos();
    }
    
    // Configurar eventos básicos
    configurarEventos() {
        if (!this.elemento) return;
        
        this.elemento.addEventListener('mouseenter', () => {
            this.definirEstado('hover');
        });
        
        this.elemento.addEventListener('mouseleave', () => {
            this.definirEstado('normal');
        });
        
        this.elemento.addEventListener('mousedown', () => {
            this.definirEstado('active');
        });
        
        this.elemento.addEventListener('mouseup', () => {
            this.definirEstado('hover');
        });
    }
    
    // Definir estado visual
    definirEstado(novoEstado) {
        if (this.estado === novoEstado) return;
        
        // Remove estado anterior
        this.elemento.classList.remove(`estado-${this.estado}`);
        
        // Adiciona novo estado
        this.elemento.classList.add(`estado-${novoEstado}`);
        
        this.estado = novoEstado;
        
        // Dispara evento customizado
        this.elemento.dispatchEvent(new CustomEvent('estadoAlterado', {
            detail: { estadoAnterior: this.estado, novoEstado }
        }));
    }
    
    // Adicionar classe com animação
    adicionarClasse(classe, animacao = null) {
        if (!classe) return false;
        
        this.elemento.classList.add(classe);
        
        if (animacao) {
            this.executarAnimacao(animacao);
        }
        
        return true;
    }
    
    // Remover classe com animação
    removerClasse(classe, animacao = null) {
        if (!classe) return false;
        
        if (animacao) {
            this.executarAnimacao(animacao).then(() => {
                this.elemento.classList.remove(classe);
            });
        } else {
            this.elemento.classList.remove(classe);
        }
        
        return true;
    }
    
    // Executar animação
    executarAnimacao(config) {
        const {
            propriedades,
            duracao = 300,
            easing = 'ease-in-out',
            delay = 0
        } = config;
        
        return new Promise(resolve => {
            setTimeout(() => {
                exemploEstilos.animacoes.animar(
                    this.elemento,
                    propriedades,
                    duracao,
                    easing
                ).then(resolve);
            }, delay);
        });
    }
    
    // Aplicar tema específico
    aplicarTema(variaveis) {
        if (typeof variaveis !== 'object') return false;
        
        Object.entries(variaveis).forEach(([nome, valor]) => {
            exemploVariaveisCSS.gerenciadorVariaveis.definir(
                this.elemento,
                nome,
                valor
            );
        });
        
        return true;
    }
    
    // Resetar estilos
    resetar() {
        this.elemento.removeAttribute('style');
        this.elemento.className = this.elemento.className
            .replace(/estado-\w+/g, '')
            .trim();
        this.estado = 'normal';
    }
    
    // Clonar componente
    clonar() {
        const clone = this.elemento.cloneNode(true);
        return new ComponenteVisual(clone);
    }
    
    // Destruir componente
    destruir() {
        if (this.elemento) {
            this.elemento.remove();
            this.elemento = null;
        }
    }
}

// Factory para criar componentes
class FactoryComponentes {
    static criarBotao(texto, tipo = 'primario') {
        const botao = document.createElement('button');
        botao.textContent = texto;
        botao.classList.add('btn', `btn-${tipo}`);
        
        return new ComponenteVisual(botao);
    }
    
    static criarCard(titulo, conteudo) {
        const card = document.createElement('div');
        card.classList.add('card');
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${titulo}</h3>
            </div>
            <div class="card-body">
                <p>${conteudo}</p>
            </div>
        `;
        
        return new ComponenteVisual(card);
    }
    
    static criarModal(titulo, conteudo) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${titulo}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${conteudo}
                </div>
            </div>
        `;
        
        const componente = new ComponenteVisual(modal);
        
        // Adiciona funcionalidade de fechar
        const botaoFechar = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        [botaoFechar, backdrop].forEach(elemento => {
            elemento.addEventListener('click', () => {
                componente.executarAnimacao({
                    propriedades: { opacity: '0' },
                    duracao: 200
                }).then(() => {
                    componente.destruir();
                });
            });
        });
        
        return componente;
    }
}

// Exemplo de uso dos componentes
console.log('Sistema de componentes visuais criado!');

// --- EXERCÍCIO 2: Sistema de Layout Responsivo ---
console.log('\n=== EXERCÍCIO 2: LAYOUT RESPONSIVO ===');

class GerenciadorLayout {
    constructor() {
        this.breakpoints = {
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            xxl: 1400
        };
        
        this.breakpointAtual = this.obterBreakpointAtual();
        this.observadores = new Map();
        
        this.configurarObservadorResize();
    }
    
    // Obter breakpoint atual
    obterBreakpointAtual() {
        const largura = window.innerWidth;
        
        for (const [nome, valor] of Object.entries(this.breakpoints).reverse()) {
            if (largura >= valor) {
                return nome;
            }
        }
        
        return 'xs';
    }
    
    // Configurar observador de resize
    configurarObservadorResize() {
        let timeoutResize;
        
        window.addEventListener('resize', () => {
            clearTimeout(timeoutResize);
            
            timeoutResize = setTimeout(() => {
                const novoBreakpoint = this.obterBreakpointAtual();
                
                if (novoBreakpoint !== this.breakpointAtual) {
                    this.breakpointAtual = novoBreakpoint;
                    this.notificarMudancaBreakpoint(novoBreakpoint);
                }
            }, 100);
        });
    }
    
    // Notificar mudança de breakpoint
    notificarMudancaBreakpoint(novoBreakpoint) {
        this.observadores.forEach((callback, elemento) => {
            callback(novoBreakpoint, elemento);
        });
        
        // Dispara evento global
        window.dispatchEvent(new CustomEvent('breakpointAlterado', {
            detail: { breakpoint: novoBreakpoint }
        }));
    }
    
    // Adicionar observador de breakpoint
    adicionarObservador(elemento, callback) {
        if (elemento && typeof callback === 'function') {
            this.observadores.set(elemento, callback);
        }
    }
    
    // Remover observador
    removerObservador(elemento) {
        this.observadores.delete(elemento);
    }
    
    // Aplicar estilos responsivos
    aplicarEstilosResponsivos(elemento, estilos) {
        if (!elemento || typeof estilos !== 'object') return false;
        
        const aplicarEstilosBreakpoint = (breakpoint) => {
            // Remove classes de breakpoint anteriores
            Object.keys(this.breakpoints).forEach(bp => {
                elemento.classList.remove(`${bp}-ativo`);
            });
            
            // Adiciona classe do breakpoint atual
            elemento.classList.add(`${breakpoint}-ativo`);
            
            // Aplica estilos específicos do breakpoint
            if (estilos[breakpoint]) {
                exemploEstilos.gerenciadorEstilos.definirMultiplos(
                    elemento,
                    estilos[breakpoint]
                );
            }
        };
        
        // Aplica estilos iniciais
        aplicarEstilosBreakpoint(this.breakpointAtual);
        
        // Adiciona observador para mudanças futuras
        this.adicionarObservador(elemento, aplicarEstilosBreakpoint);
        
        return true;
    }
    
    // Sistema de grid responsivo
    criarGrid(container, opcoes = {}) {
        if (!container) return false;
        
        const {
            colunas = { xs: 1, sm: 2, md: 3, lg: 4 },
            gap = '1rem',
            autoFit = false
        } = opcoes;
        
        const aplicarGrid = (breakpoint) => {
            const numColunas = colunas[breakpoint] || colunas.xs || 1;
            
            if (autoFit) {
                container.style.gridTemplateColumns = 
                    `repeat(auto-fit, minmax(${300 / numColunas}px, 1fr))`;
            } else {
                container.style.gridTemplateColumns = `repeat(${numColunas}, 1fr)`;
            }
            
            container.style.gap = gap;
            container.style.display = 'grid';
        };
        
        // Aplica grid inicial
        aplicarGrid(this.breakpointAtual);
        
        // Adiciona observador
        this.adicionarObservador(container, aplicarGrid);
        
        return true;
    }
    
    // Utilitários de visibilidade responsiva
    configurarVisibilidade(elemento, regras) {
        if (!elemento || typeof regras !== 'object') return false;
        
        const aplicarVisibilidade = (breakpoint) => {
            const visivel = regras[breakpoint];
            
            if (visivel === true) {
                elemento.style.display = '';
            } else if (visivel === false) {
                elemento.style.display = 'none';
            } else if (typeof visivel === 'string') {
                elemento.style.display = visivel;
            }
        };
        
        // Aplica visibilidade inicial
        aplicarVisibilidade(this.breakpointAtual);
        
        // Adiciona observador
        this.adicionarObservador(elemento, aplicarVisibilidade);
        
        return true;
    }
    
    // Verificar se está em breakpoint específico
    estaEm(breakpoint) {
        return this.breakpointAtual === breakpoint;
    }
    
    // Verificar se está acima de um breakpoint
    estaAcimaDe(breakpoint) {
        const larguraAtual = window.innerWidth;
        const larguraBreakpoint = this.breakpoints[breakpoint];
        
        return larguraAtual >= larguraBreakpoint;
    }
    
    // Verificar se está abaixo de um breakpoint
    estaAbaixoDe(breakpoint) {
        const larguraAtual = window.innerWidth;
        const larguraBreakpoint = this.breakpoints[breakpoint];
        
        return larguraAtual < larguraBreakpoint;
    }
}

// Exemplo de uso do gerenciador de layout
const layoutManager = new GerenciadorLayout();
console.log('Gerenciador de layout responsivo criado!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasOtimizacao = {
    // Performance em manipulação de estilos
    performance: {
        // Batch de mudanças de estilo
        aplicarMudancasEmLote(elemento, mudancas) {
            if (!elemento || !Array.isArray(mudancas)) return false;
            
            // Desabilita transições temporariamente
            const transicaoOriginal = elemento.style.transition;
            elemento.style.transition = 'none';
            
            // Aplica todas as mudanças
            mudancas.forEach(mudanca => {
                if (mudanca.tipo === 'classe') {
                    if (mudanca.acao === 'adicionar') {
                        elemento.classList.add(mudanca.valor);
                    } else if (mudanca.acao === 'remover') {
                        elemento.classList.remove(mudanca.valor);
                    }
                } else if (mudanca.tipo === 'estilo') {
                    elemento.style.setProperty(mudanca.propriedade, mudanca.valor);
                }
            });
            
            // Force reflow
            elemento.offsetHeight;
            
            // Restaura transições
            elemento.style.transition = transicaoOriginal;
            
            return true;
        },
        
        // Cache de estilos computados
        cacheEstilosComputados: new Map(),
        
        obterEstiloComputadoCache(elemento, propriedade) {
            const chave = `${elemento.tagName}-${propriedade}`;
            
            if (!this.cacheEstilosComputados.has(chave)) {
                const valor = window.getComputedStyle(elemento)
                    .getPropertyValue(propriedade);
                this.cacheEstilosComputados.set(chave, valor);
            }
            
            return this.cacheEstilosComputados.get(chave);
        },
        
        // Limpar cache
        limparCache() {
            this.cacheEstilosComputados.clear();
        },
        
        // Debounce para resize
        debounceResize(callback, delay = 100) {
            let timeoutId;
            
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => callback.apply(this, args), delay);
            };
        }
    },
    
    // Otimização de animações
    animacoes: {
        // Usar transform e opacity para animações suaves
        animacaoOtimizada(elemento, transformacao, duracao = 300) {
            return new Promise(resolve => {
                elemento.style.transition = `transform ${duracao}ms ease-out, opacity ${duracao}ms ease-out`;
                elemento.style.transform = transformacao.transform || '';
                elemento.style.opacity = transformacao.opacity || '1';
                
                setTimeout(() => {
                    elemento.style.transition = '';
                    resolve(elemento);
                }, duracao);
            });
        },
        
        // Verificar suporte a animações
        suportaAnimacoes() {
            return 'animate' in document.createElement('div');
        },
        
        // Usar Web Animations API quando disponível
        animarComWebAPI(elemento, keyframes, opcoes) {
            if (this.suportaAnimacoes()) {
                return elemento.animate(keyframes, opcoes);
            } else {
                // Fallback para CSS transitions
                return this.animacaoOtimizada(elemento, keyframes[1], opcoes.duration);
            }
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Limpeza de observadores
        limparObservadores(gerenciador) {
            if (gerenciador && gerenciador.observadores) {
                gerenciador.observadores.clear();
            }
        },
        
        // Remoção de event listeners
        removerEventListeners(elemento) {
            if (elemento) {
                const clone = elemento.cloneNode(true);
                elemento.parentNode.replaceChild(clone, elemento);
                return clone;
            }
            return null;
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');

const referencias = {
    documentacao: [
        'MDN - CSS Object Model: https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model',
        'MDN - Element.classList: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList',
        'MDN - CSS Custom Properties: https://developer.mozilla.org/en-US/docs/Web/CSS/--*',
        'MDN - Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API'
    ],
    
    topicosAvancados: [
        'CSS-in-JS e styled-components',
        'CSS Houdini e Custom Properties API',
        'Intersection Observer para animações',
        'CSS Grid e Flexbox avançados',
        'Performance de animações e 60fps'
    ],
    
    proximosPassos: [
        'Estudar criação dinâmica de elementos',
        'Aprender manipulação avançada do DOM',
        'Dominar eventos e interatividade',
        'Implementar componentes reutilizáveis'
    ]
};

console.log('Referências carregadas. Próximo módulo: Criação de Elementos!');

/*
===========================================
RESUMO DO MÓDULO - ESTILOS E CLASSES
===========================================

✅ CONCEITOS APRENDIDOS:
• Manipulação avançada de classes CSS
• Estilos inline e computados
• CSS Custom Properties (variáveis)
• Animações programáticas
• Sistema de temas dinâmicos
• Layout responsivo via JavaScript

🎯 HABILIDADES DESENVOLVIDAS:
• Sistema de componentes visuais
• Gerenciador de layout responsivo
• Animações fluidas e otimizadas
• Temas dinâmicos com persistência
• Cache e otimização de performance

📚 PRÓXIMA AULA:
• Criação dinâmica de elementos
• Manipulação da árvore DOM
• Templates e componentes
• Performance em criação de elementos

===========================================
*/