/*
===========================================
    MÓDULO 06 - DOM (Document Object Model)
    Aula 02: Manipulação de Conteúdo
===========================================

Objetivos de Aprendizagem:
✓ Compreender como modificar texto e HTML de elementos
✓ Dominar as diferenças entre innerHTML, textContent e innerText
✓ Aprender a trabalhar com atributos e propriedades
✓ Implementar manipulação segura de conteúdo
✓ Aplicar técnicas de sanitização e validação
*/

// ===========================================
// 1. TEORIA: MANIPULAÇÃO DE CONTEÚDO
// ===========================================

/*
TIPOS DE CONTEÚDO NO DOM:

1. TEXT CONTENT:
   - textContent: Todo o texto, incluindo elementos ocultos
   - innerText: Texto visível, respeitando CSS
   - nodeValue: Valor direto do nó de texto

2. HTML CONTENT:
   - innerHTML: HTML interno do elemento
   - outerHTML: HTML completo incluindo o próprio elemento

3. ATRIBUTOS:
   - getAttribute/setAttribute: Atributos HTML
   - Propriedades diretas: element.id, element.className
   - dataset: Atributos data-*

4. VALORES DE FORMULÁRIO:
   - value: Valor de inputs
   - checked: Estado de checkboxes/radios
   - selected: Opções selecionadas
*/

// ===========================================
// 2. EXEMPLOS PRÁTICOS
// ===========================================

// --- 2.1 Manipulação de Texto ---
console.log('=== MANIPULAÇÃO DE TEXTO ===');

// Simulando elementos para demonstração
const exemploTexto = {
    // Diferenças entre textContent, innerText e innerHTML
    demonstrarDiferencas() {
        console.log('Diferenças entre propriedades de texto:');
        
        // Exemplo com HTML
        const htmlExemplo = '<p>Texto <span style="display:none">oculto</span> visível</p>';
        
        // textContent: retorna todo o texto
        console.log('textContent:', 'Texto oculto visível');
        
        // innerText: apenas texto visível
        console.log('innerText:', 'Texto visível');
        
        // innerHTML: retorna HTML
        console.log('innerHTML:', htmlExemplo);
    },
    
    // Modificação segura de texto
    modificarTextoSeguro(elemento, novoTexto) {
        // Sempre use textContent para texto puro (previne XSS)
        if (elemento && typeof novoTexto === 'string') {
            elemento.textContent = novoTexto;
            return true;
        }
        return false;
    },
    
    // Formatação de texto
    formatarTexto(texto, opcoes = {}) {
        const {
            maiuscula = false,
            minuscula = false,
            capitalizar = false,
            limpar = true
        } = opcoes;
        
        let resultado = limpar ? texto.trim() : texto;
        
        if (maiuscula) resultado = resultado.toUpperCase();
        if (minuscula) resultado = resultado.toLowerCase();
        if (capitalizar) {
            resultado = resultado.charAt(0).toUpperCase() + 
                       resultado.slice(1).toLowerCase();
        }
        
        return resultado;
    }
};

// --- 2.2 Manipulação de HTML ---
console.log('\n=== MANIPULAÇÃO DE HTML ===');

const exemploHTML = {
    // Sanitização básica de HTML
    sanitizarHTML(html) {
        // Remove scripts e eventos perigosos
        return html
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')
            .replace(/javascript:/gi, '');
    },
    
    // Inserção segura de HTML
    inserirHTMLSeguro(elemento, html) {
        if (!elemento) return false;
        
        const htmlLimpo = this.sanitizarHTML(html);
        elemento.innerHTML = htmlLimpo;
        return true;
    },
    
    // Template simples
    criarTemplate(template, dados) {
        let resultado = template;
        
        Object.keys(dados).forEach(chave => {
            const regex = new RegExp(`{{${chave}}}`, 'g');
            resultado = resultado.replace(regex, dados[chave]);
        });
        
        return resultado;
    },
    
    // Exemplo de uso do template
    exemploTemplate() {
        const template = `
            <div class="card">
                <h3>{{titulo}}</h3>
                <p>{{descricao}}</p>
                <span class="data">{{data}}</span>
            </div>
        `;
        
        const dados = {
            titulo: 'Meu Card',
            descricao: 'Descrição do card',
            data: new Date().toLocaleDateString()
        };
        
        return this.criarTemplate(template, dados);
    }
};

// --- 2.3 Manipulação de Atributos ---
console.log('\n=== MANIPULAÇÃO DE ATRIBUTOS ===');

const exemploAtributos = {
    // Gerenciador de atributos
    gerenciarAtributos: {
        // Definir atributo
        definir(elemento, atributo, valor) {
            if (elemento && atributo) {
                elemento.setAttribute(atributo, valor);
                return true;
            }
            return false;
        },
        
        // Obter atributo
        obter(elemento, atributo) {
            return elemento ? elemento.getAttribute(atributo) : null;
        },
        
        // Remover atributo
        remover(elemento, atributo) {
            if (elemento && elemento.hasAttribute(atributo)) {
                elemento.removeAttribute(atributo);
                return true;
            }
            return false;
        },
        
        // Verificar existência
        existe(elemento, atributo) {
            return elemento ? elemento.hasAttribute(atributo) : false;
        },
        
        // Alternar atributo booleano
        alternar(elemento, atributo) {
            if (!elemento) return false;
            
            if (this.existe(elemento, atributo)) {
                this.remover(elemento, atributo);
                return false;
            } else {
                this.definir(elemento, atributo, '');
                return true;
            }
        }
    },
    
    // Trabalhar com data attributes
    dataAttributes: {
        // Definir data attribute
        definir(elemento, chave, valor) {
            if (elemento && chave) {
                elemento.dataset[chave] = valor;
                return true;
            }
            return false;
        },
        
        // Obter data attribute
        obter(elemento, chave) {
            return elemento && chave ? elemento.dataset[chave] : null;
        },
        
        // Obter todos os data attributes
        obterTodos(elemento) {
            return elemento ? { ...elemento.dataset } : {};
        },
        
        // Remover data attribute
        remover(elemento, chave) {
            if (elemento && chave && chave in elemento.dataset) {
                delete elemento.dataset[chave];
                return true;
            }
            return false;
        }
    }
};

// --- 2.4 Manipulação de Formulários ---
console.log('\n=== MANIPULAÇÃO DE FORMULÁRIOS ===');

const exemploFormularios = {
    // Gerenciador de valores de formulário
    gerenciarValores: {
        // Obter valor de qualquer tipo de input
        obterValor(elemento) {
            if (!elemento) return null;
            
            switch (elemento.type) {
                case 'checkbox':
                case 'radio':
                    return elemento.checked;
                case 'select-multiple':
                    return Array.from(elemento.selectedOptions)
                                .map(option => option.value);
                case 'file':
                    return elemento.files;
                default:
                    return elemento.value;
            }
        },
        
        // Definir valor para qualquer tipo de input
        definirValor(elemento, valor) {
            if (!elemento) return false;
            
            switch (elemento.type) {
                case 'checkbox':
                case 'radio':
                    elemento.checked = Boolean(valor);
                    break;
                case 'select-multiple':
                    if (Array.isArray(valor)) {
                        Array.from(elemento.options).forEach(option => {
                            option.selected = valor.includes(option.value);
                        });
                    }
                    break;
                default:
                    elemento.value = valor;
            }
            return true;
        },
        
        // Limpar formulário
        limparFormulario(formulario) {
            if (!formulario) return false;
            
            const elementos = formulario.querySelectorAll(
                'input, select, textarea'
            );
            
            elementos.forEach(elemento => {
                switch (elemento.type) {
                    case 'checkbox':
                    case 'radio':
                        elemento.checked = false;
                        break;
                    case 'select-multiple':
                        Array.from(elemento.options).forEach(option => {
                            option.selected = false;
                        });
                        break;
                    default:
                        elemento.value = '';
                }
            });
            
            return true;
        },
        
        // Serializar formulário
        serializarFormulario(formulario) {
            if (!formulario) return {};
            
            const dados = {};
            const formData = new FormData(formulario);
            
            for (const [chave, valor] of formData.entries()) {
                if (dados[chave]) {
                    // Se já existe, transformar em array
                    if (!Array.isArray(dados[chave])) {
                        dados[chave] = [dados[chave]];
                    }
                    dados[chave].push(valor);
                } else {
                    dados[chave] = valor;
                }
            }
            
            return dados;
        }
    }
};

// ===========================================
// 3. EXERCÍCIOS PRÁTICOS
// ===========================================

// --- EXERCÍCIO 1: Sistema de Editor de Conteúdo ---
console.log('\n=== EXERCÍCIO 1: EDITOR DE CONTEÚDO ===');

class EditorConteudo {
    constructor() {
        this.historico = [];
        this.indiceHistorico = -1;
        this.maxHistorico = 50;
    }
    
    // Salvar estado no histórico
    salvarEstado(elemento) {
        if (!elemento) return;
        
        const estado = {
            html: elemento.innerHTML,
            timestamp: Date.now()
        };
        
        // Remove estados futuros se estamos no meio do histórico
        this.historico = this.historico.slice(0, this.indiceHistorico + 1);
        
        // Adiciona novo estado
        this.historico.push(estado);
        this.indiceHistorico++;
        
        // Limita o tamanho do histórico
        if (this.historico.length > this.maxHistorico) {
            this.historico.shift();
            this.indiceHistorico--;
        }
    }
    
    // Desfazer alteração
    desfazer(elemento) {
        if (!elemento || this.indiceHistorico <= 0) return false;
        
        this.indiceHistorico--;
        const estado = this.historico[this.indiceHistorico];
        elemento.innerHTML = estado.html;
        
        return true;
    }
    
    // Refazer alteração
    refazer(elemento) {
        if (!elemento || this.indiceHistorico >= this.historico.length - 1) {
            return false;
        }
        
        this.indiceHistorico++;
        const estado = this.historico[this.indiceHistorico];
        elemento.innerHTML = estado.html;
        
        return true;
    }
    
    // Aplicar formatação
    aplicarFormatacao(elemento, tipo, valor = null) {
        if (!elemento) return false;
        
        this.salvarEstado(elemento);
        
        try {
            switch (tipo) {
                case 'negrito':
                    document.execCommand('bold');
                    break;
                case 'italico':
                    document.execCommand('italic');
                    break;
                case 'sublinhado':
                    document.execCommand('underline');
                    break;
                case 'cor':
                    document.execCommand('foreColor', false, valor);
                    break;
                case 'tamanho':
                    document.execCommand('fontSize', false, valor);
                    break;
                default:
                    return false;
            }
            return true;
        } catch (error) {
            console.error('Erro ao aplicar formatação:', error);
            return false;
        }
    }
    
    // Inserir conteúdo
    inserirConteudo(elemento, conteudo, posicao = 'fim') {
        if (!elemento || !conteudo) return false;
        
        this.salvarEstado(elemento);
        
        switch (posicao) {
            case 'inicio':
                elemento.insertAdjacentHTML('afterbegin', conteudo);
                break;
            case 'fim':
                elemento.insertAdjacentHTML('beforeend', conteudo);
                break;
            case 'antes':
                elemento.insertAdjacentHTML('beforebegin', conteudo);
                break;
            case 'depois':
                elemento.insertAdjacentHTML('afterend', conteudo);
                break;
            default:
                return false;
        }
        
        return true;
    }
    
    // Limpar formatação
    limparFormatacao(elemento) {
        if (!elemento) return false;
        
        this.salvarEstado(elemento);
        
        // Remove todas as tags de formatação mantendo o texto
        const textoLimpo = elemento.textContent || elemento.innerText;
        elemento.textContent = textoLimpo;
        
        return true;
    }
    
    // Obter estatísticas do conteúdo
    obterEstatisticas(elemento) {
        if (!elemento) return null;
        
        const texto = elemento.textContent || elemento.innerText;
        const html = elemento.innerHTML;
        
        return {
            caracteres: texto.length,
            caracteresComEspacos: texto.length,
            caracteresSemEspacos: texto.replace(/\s/g, '').length,
            palavras: texto.trim() ? texto.trim().split(/\s+/).length : 0,
            paragrafos: (html.match(/<p[^>]*>/gi) || []).length,
            linhas: texto.split('\n').length,
            tagsHTML: (html.match(/<[^>]+>/g) || []).length
        };
    }
}

// Exemplo de uso do Editor
const editor = new EditorConteudo();
console.log('Editor de conteúdo criado com sucesso!');

// --- EXERCÍCIO 2: Sistema de Validação de Formulários ---
console.log('\n=== EXERCÍCIO 2: VALIDAÇÃO DE FORMULÁRIOS ===');

class ValidadorFormulario {
    constructor() {
        this.regras = new Map();
        this.mensagens = new Map();
        this.configurarRegrasBasicas();
    }
    
    // Configurar regras básicas de validação
    configurarRegrasBasicas() {
        // Regras de validação
        this.regras.set('obrigatorio', (valor) => {
            return valor !== null && valor !== undefined && 
                   String(valor).trim().length > 0;
        });
        
        this.regras.set('email', (valor) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(valor);
        });
        
        this.regras.set('telefone', (valor) => {
            const regex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
            return regex.test(valor);
        });
        
        this.regras.set('cpf', (valor) => {
            const cpf = valor.replace(/\D/g, '');
            if (cpf.length !== 11) return false;
            
            // Validação básica de CPF
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let resto = 11 - (soma % 11);
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.charAt(9))) return false;
            
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            resto = 11 - (soma % 11);
            if (resto === 10 || resto === 11) resto = 0;
            
            return resto === parseInt(cpf.charAt(10));
        });
        
        this.regras.set('senha', (valor) => {
            // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula e 1 número
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
            return regex.test(valor);
        });
        
        // Mensagens de erro
        this.mensagens.set('obrigatorio', 'Este campo é obrigatório');
        this.mensagens.set('email', 'Digite um email válido');
        this.mensagens.set('telefone', 'Digite um telefone válido');
        this.mensagens.set('cpf', 'Digite um CPF válido');
        this.mensagens.set('senha', 'A senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula e número');
    }
    
    // Adicionar regra customizada
    adicionarRegra(nome, funcao, mensagem) {
        this.regras.set(nome, funcao);
        this.mensagens.set(nome, mensagem);
    }
    
    // Validar campo individual
    validarCampo(elemento, regrasAplicar = []) {
        if (!elemento) return { valido: false, erros: ['Elemento não encontrado'] };
        
        const valor = exemploFormularios.gerenciarValores.obterValor(elemento);
        const erros = [];
        
        // Se não há regras específicas, usar data attributes
        if (regrasAplicar.length === 0) {
            const dataRegras = elemento.dataset.validacao;
            if (dataRegras) {
                regrasAplicar = dataRegras.split(',').map(r => r.trim());
            }
        }
        
        // Aplicar cada regra
        regrasAplicar.forEach(regra => {
            if (this.regras.has(regra)) {
                const funcaoValidacao = this.regras.get(regra);
                if (!funcaoValidacao(valor)) {
                    erros.push(this.mensagens.get(regra));
                }
            }
        });
        
        return {
            valido: erros.length === 0,
            erros: erros,
            valor: valor
        };
    }
    
    // Validar formulário completo
    validarFormulario(formulario) {
        if (!formulario) return { valido: false, erros: {} };
        
        const campos = formulario.querySelectorAll('[data-validacao]');
        const resultados = {};
        let formularioValido = true;
        
        campos.forEach(campo => {
            const nome = campo.name || campo.id || 'campo_sem_nome';
            const resultado = this.validarCampo(campo);
            
            resultados[nome] = resultado;
            
            if (!resultado.valido) {
                formularioValido = false;
                this.mostrarErros(campo, resultado.erros);
            } else {
                this.limparErros(campo);
            }
        });
        
        return {
            valido: formularioValido,
            erros: resultados
        };
    }
    
    // Mostrar erros no campo
    mostrarErros(elemento, erros) {
        if (!elemento || !erros.length) return;
        
        // Remove erros anteriores
        this.limparErros(elemento);
        
        // Adiciona classe de erro
        elemento.classList.add('campo-erro');
        
        // Cria container de erros
        const containerErros = document.createElement('div');
        containerErros.className = 'erros-validacao';
        
        erros.forEach(erro => {
            const spanErro = document.createElement('span');
            spanErro.className = 'erro-mensagem';
            spanErro.textContent = erro;
            containerErros.appendChild(spanErro);
        });
        
        // Insere após o elemento
        elemento.parentNode.insertBefore(containerErros, elemento.nextSibling);
    }
    
    // Limpar erros do campo
    limparErros(elemento) {
        if (!elemento) return;
        
        elemento.classList.remove('campo-erro');
        
        // Remove container de erros existente
        const proximoElemento = elemento.nextSibling;
        if (proximoElemento && proximoElemento.classList && 
            proximoElemento.classList.contains('erros-validacao')) {
            proximoElemento.remove();
        }
    }
    
    // Validação em tempo real
    configurarValidacaoTempoReal(formulario) {
        if (!formulario) return;
        
        const campos = formulario.querySelectorAll('[data-validacao]');
        
        campos.forEach(campo => {
            // Validar ao sair do campo
            campo.addEventListener('blur', () => {
                const resultado = this.validarCampo(campo);
                if (!resultado.valido) {
                    this.mostrarErros(campo, resultado.erros);
                } else {
                    this.limparErros(campo);
                }
            });
            
            // Limpar erros ao digitar
            campo.addEventListener('input', () => {
                if (campo.classList.contains('campo-erro')) {
                    this.limparErros(campo);
                }
            });
        });
    }
}

// Exemplo de uso do Validador
const validador = new ValidadorFormulario();
console.log('Validador de formulários criado com sucesso!');

// ===========================================
// 4. DICAS DE OTIMIZAÇÃO
// ===========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

const dicasOtimizacao = {
    // Performance na manipulação de conteúdo
    performance: {
        // Use DocumentFragment para múltiplas inserções
        insercoesMultiplas(container, elementos) {
            const fragment = document.createDocumentFragment();
            
            elementos.forEach(elemento => {
                fragment.appendChild(elemento);
            });
            
            container.appendChild(fragment);
        },
        
        // Cache de elementos frequentemente acessados
        cacheElementos: new Map(),
        
        obterElementoCache(seletor) {
            if (!this.cacheElementos.has(seletor)) {
                this.cacheElementos.set(seletor, document.querySelector(seletor));
            }
            return this.cacheElementos.get(seletor);
        },
        
        // Debounce para validação em tempo real
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
            };
        }
    },
    
    // Segurança na manipulação
    seguranca: {
        // Sanitização rigorosa
        sanitizarHTML(html) {
            const div = document.createElement('div');
            div.textContent = html;
            return div.innerHTML;
        },
        
        // Validação de entrada
        validarEntrada(valor, tipo) {
            switch (tipo) {
                case 'texto':
                    return typeof valor === 'string' && valor.length <= 1000;
                case 'numero':
                    return !isNaN(valor) && isFinite(valor);
                case 'email':
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
                default:
                    return false;
            }
        }
    },
    
    // Gerenciamento de memória
    memoria: {
        // Limpeza de event listeners
        limparEventListeners(elemento) {
            if (elemento) {
                elemento.replaceWith(elemento.cloneNode(true));
            }
        },
        
        // Observador de mutações eficiente
        criarObservadorMutacoes(callback, opcoes = {}) {
            const observer = new MutationObserver(callback);
            const config = {
                childList: true,
                subtree: false,
                attributes: false,
                ...opcoes
            };
            return { observer, config };
        }
    }
};

// ===========================================
// 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ===========================================

console.log('\n=== REFERÊNCIAS PARA APROFUNDAMENTO ===');

const referencias = {
    documentacao: [
        'MDN - Manipulating documents: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents',
        'MDN - Element: https://developer.mozilla.org/en-US/docs/Web/API/Element',
        'MDN - Node: https://developer.mozilla.org/en-US/docs/Web/API/Node',
        'MDN - Document: https://developer.mozilla.org/en-US/docs/Web/API/Document'
    ],
    
    topicosAvancados: [
        'Shadow DOM e Web Components',
        'Virtual DOM e bibliotecas como React',
        'Observadores de mutação (MutationObserver)',
        'Intersection Observer API',
        'Content Security Policy (CSP)'
    ],
    
    proximosPassos: [
        'Estudar estilos e classes CSS via JavaScript',
        'Aprender criação dinâmica de elementos',
        'Dominar eventos e interatividade',
        'Implementar componentes reutilizáveis'
    ]
};

console.log('Referências carregadas. Próximo módulo: Estilos e Classes!');

/*
===========================================
RESUMO DO MÓDULO - MANIPULAÇÃO DE CONTEÚDO
===========================================

✅ CONCEITOS APRENDIDOS:
• Diferenças entre textContent, innerText e innerHTML
• Manipulação segura de HTML e prevenção de XSS
• Trabalho com atributos e data attributes
• Gerenciamento de valores de formulários
• Validação em tempo real
• Técnicas de otimização e performance

🎯 HABILIDADES DESENVOLVIDAS:
• Editor de conteúdo com histórico
• Sistema de validação robusto
• Sanitização de dados
• Cache e otimização
• Gerenciamento de memória

📚 PRÓXIMA AULA:
• Estilos e Classes CSS via JavaScript
• Animações e transições
• Responsive design programático
• Temas dinâmicos

===========================================
*/