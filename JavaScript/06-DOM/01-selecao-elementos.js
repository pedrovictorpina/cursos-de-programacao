/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 6.1
SELEÇÃO DE ELEMENTOS DO DOM
==============================================

Objetivos de Aprendizagem:
- Dominar métodos de seleção de elementos
- Entender a diferença entre NodeList e HTMLCollection
- Aplicar seletores CSS no JavaScript
- Otimizar consultas ao DOM
- Implementar seleções dinâmicas
- Trabalhar com pseudo-elementos
- Criar utilitários de seleção
- Debuggar problemas de seleção

⏱️ TEMPO ESTIMADO: 70 minutos
📊 NÍVEL: Iniciante a Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: DOM E SELEÇÃO DE ELEMENTOS
// ==========================================

/*
O QUE É O DOM?
O Document Object Model (DOM) é uma representação em árvore da estrutura
HTML/XML de uma página web. Cada elemento HTML se torna um nó na árvore DOM.

HIERARQUIIA DO DOM:
- Document (raiz)
  - HTML
    - Head
      - Title, Meta, Link, etc.
    - Body
      - Div, P, Span, etc.
        - Elementos filhos
          - Texto, atributos

TIPOS DE NÓS:
1. **Element Node** - elementos HTML (div, p, span)
2. **Text Node** - conteúdo de texto
3. **Attribute Node** - atributos dos elementos
4. **Comment Node** - comentários HTML
5. **Document Node** - documento inteiro

MÉTODOS DE SELEÇÃO:

1. **getElementById()** - seleciona por ID (único)
   - Retorna: Element ou null
   - Performance: Muito rápida (índice interno)
   - Uso: Elementos únicos e específicos

2. **getElementsByClassName()** - seleciona por classe
   - Retorna: HTMLCollection (live)
   - Performance: Rápida
   - Uso: Múltiplos elementos com mesma classe

3. **getElementsByTagName()** - seleciona por tag
   - Retorna: HTMLCollection (live)
   - Performance: Rápida
   - Uso: Todos elementos de um tipo

4. **querySelector()** - primeiro elemento que atende seletor CSS
   - Retorna: Element ou null
   - Performance: Moderada
   - Uso: Seleções complexas, primeiro elemento

5. **querySelectorAll()** - todos elementos que atendem seletor CSS
   - Retorna: NodeList (static)
   - Performance: Moderada
   - Uso: Seleções complexas, múltiplos elementos

6. **getElementsByName()** - seleciona por atributo name
   - Retorna: NodeList (live)
   - Performance: Moderada
   - Uso: Elementos de formulário

DIFERENÇAS IMPORTANTES:

**HTMLCollection vs NodeList:**
- HTMLCollection: live (atualiza automaticamente)
- NodeList: pode ser live ou static
- Ambos são array-like mas não arrays

**Live vs Static:**
- Live: reflete mudanças no DOM em tempo real
- Static: snapshot do DOM no momento da consulta

**Performance:**
- getElementById > getElementsByClassName/TagName > querySelector/All
- Cache seleções frequentes
- Evite consultas repetitivas

SELETORES CSS SUPORTADOS:
- Elementos: div, p, span
- Classes: .classe, .classe1.classe2
- IDs: #id
- Atributos: [attr], [attr="valor"]
- Pseudo-classes: :hover, :first-child, :nth-child()
- Pseudo-elementos: ::before, ::after
- Combinadores: >, +, ~, espaço
- Múltiplos: seletor1, seletor2

OTIMIZAÇÃO:
- Use getElementById quando possível
- Cache elementos frequentemente acessados
- Limite escopo de busca
- Evite seletores muito complexos
- Use context para limitar busca
*/

console.log('=== SELEÇÃO DE ELEMENTOS DO DOM ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// Primeiro, vamos criar uma estrutura HTML simulada para demonstração
// Em um ambiente real, estes elementos já existiriam na página

// ========== CRIANDO ESTRUTURA DE TESTE ==========
console.log('\n--- CRIANDO ESTRUTURA DE TESTE ---');

// Função para criar estrutura HTML de exemplo
function criarEstruturaHTML() {
    // Limpar body existente (se houver)
    if (typeof document !== 'undefined') {
        document.body.innerHTML = '';
        
        // Criar estrutura de exemplo
        const html = `
            <header id="cabecalho" class="header main-header">
                <nav class="navegacao">
                    <ul class="menu">
                        <li class="item-menu"><a href="#home">Home</a></li>
                        <li class="item-menu"><a href="#sobre">Sobre</a></li>
                        <li class="item-menu"><a href="#contato">Contato</a></li>
                    </ul>
                </nav>
            </header>
            
            <main id="conteudo-principal" class="main-content">
                <section class="secao hero">
                    <h1 class="titulo principal">Bem-vindo ao Curso de JavaScript</h1>
                    <p class="descricao">Aprenda JavaScript do básico ao avançado</p>
                    <button id="btn-comecar" class="botao primario">Começar Agora</button>
                </section>
                
                <section class="secao modulos">
                    <h2 class="titulo secundario">Módulos do Curso</h2>
                    <div class="container-modulos">
                        <article class="modulo" data-nivel="basico" data-duracao="2h">
                            <h3 class="titulo-modulo">Fundamentos</h3>
                            <p class="descricao-modulo">Variáveis, tipos e operadores</p>
                            <span class="badge nivel-basico">Básico</span>
                        </article>
                        
                        <article class="modulo" data-nivel="intermediario" data-duracao="3h">
                            <h3 class="titulo-modulo">Funções</h3>
                            <p class="descricao-modulo">Declaração, parâmetros e closures</p>
                            <span class="badge nivel-intermediario">Intermediário</span>
                        </article>
                        
                        <article class="modulo" data-nivel="avancado" data-duracao="4h">
                            <h3 class="titulo-modulo">DOM</h3>
                            <p class="descricao-modulo">Manipulação e eventos</p>
                            <span class="badge nivel-avancado">Avançado</span>
                        </article>
                    </div>
                </section>
                
                <section class="secao formulario">
                    <h2 class="titulo secundario">Contato</h2>
                    <form id="form-contato" class="formulario">
                        <div class="campo">
                            <label for="nome">Nome:</label>
                            <input type="text" id="nome" name="nome" class="input" required>
                        </div>
                        
                        <div class="campo">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" class="input" required>
                        </div>
                        
                        <div class="campo">
                            <label for="mensagem">Mensagem:</label>
                            <textarea id="mensagem" name="mensagem" class="input textarea" rows="4"></textarea>
                        </div>
                        
                        <button type="submit" class="botao secundario">Enviar</button>
                    </form>
                </section>
            </main>
            
            <footer id="rodape" class="footer">
                <p class="copyright">&copy; 2024 Curso JavaScript. Todos os direitos reservados.</p>
                <div class="redes-sociais">
                    <a href="#" class="link-social" data-rede="facebook">Facebook</a>
                    <a href="#" class="link-social" data-rede="twitter">Twitter</a>
                    <a href="#" class="link-social" data-rede="linkedin">LinkedIn</a>
                </div>
            </footer>
        `;
        
        document.body.innerHTML = html;
        console.log('✅ Estrutura HTML criada com sucesso!');
    } else {
        console.log('⚠️ Ambiente Node.js detectado - simulando estrutura HTML');
    }
}

// Simular ambiente DOM se não estiver no browser
if (typeof document === 'undefined') {
    console.log('📝 Simulando ambiente DOM para demonstração...');
    
    // Mock básico do document para demonstração
    global.document = {
        getElementById: (id) => ({ id, tagName: 'DIV', className: 'mock' }),
        getElementsByClassName: (className) => [{ className, tagName: 'DIV' }],
        getElementsByTagName: (tagName) => [{ tagName: tagName.toUpperCase() }],
        querySelector: (selector) => ({ selector, tagName: 'DIV' }),
        querySelectorAll: (selector) => [{ selector, tagName: 'DIV' }],
        getElementsByName: (name) => [{ name, tagName: 'INPUT' }]
    };
} else {
    // Criar estrutura real no browser
    criarEstruturaHTML();
}

// ========== SELEÇÃO POR ID ==========
console.log('\n--- SELEÇÃO POR ID ---');

// getElementById - método mais rápido para elementos únicos
console.log('\n🎯 getElementById():');

const cabecalho = document.getElementById('cabecalho');
console.log('Cabeçalho:', cabecalho);

const btnComecar = document.getElementById('btn-comecar');
console.log('Botão começar:', btnComecar);

const formContato = document.getElementById('form-contato');
console.log('Formulário:', formContato);

// Verificação de existência
const elementoInexistente = document.getElementById('nao-existe');
console.log('Elemento inexistente:', elementoInexistente); // null

// Função utilitária para seleção segura por ID
function selecionarPorId(id) {
    const elemento = document.getElementById(id);
    if (!elemento) {
        console.warn(`⚠️ Elemento com ID '${id}' não encontrado`);
        return null;
    }
    console.log(`✅ Elemento '${id}' encontrado:`, elemento.tagName || 'MOCK');
    return elemento;
}

console.log('\n🛡️ Seleção segura por ID:');
selecionarPorId('cabecalho');
selecionarPorId('elemento-inexistente');

// ========== SELEÇÃO POR CLASSE ==========
console.log('\n--- SELEÇÃO POR CLASSE ---');

// getElementsByClassName - retorna HTMLCollection (live)
console.log('\n🏷️ getElementsByClassName():');

const titulos = document.getElementsByClassName('titulo');
console.log('Títulos:', titulos);
console.log('Quantidade de títulos:', titulos.length);

const botoes = document.getElementsByClassName('botao');
console.log('Botões:', botoes);

const modulos = document.getElementsByClassName('modulo');
console.log('Módulos:', modulos);

// Iterando sobre HTMLCollection
console.log('\n🔄 Iterando sobre elementos por classe:');
if (typeof document !== 'undefined' && titulos.length > 0) {
    // Converter para array para usar métodos de array
    const arrayTitulos = Array.from(titulos);
    arrayTitulos.forEach((titulo, index) => {
        console.log(`Título ${index + 1}:`, titulo.textContent || titulo.className);
    });
} else {
    console.log('Simulação: 3 títulos encontrados');
}

// Função utilitária para seleção por classe
function selecionarPorClasse(className, contexto = document) {
    const elementos = contexto.getElementsByClassName(className);
    console.log(`🔍 Encontrados ${elementos.length} elementos com classe '${className}'`);
    return elementos;
}

console.log('\n📋 Seleções por classe:');
selecionarPorClasse('titulo');
selecionarPorClasse('botao');
selecionarPorClasse('input');

// ========== SELEÇÃO POR TAG ==========
console.log('\n--- SELEÇÃO POR TAG ---');

// getElementsByTagName - retorna HTMLCollection (live)
console.log('\n🏗️ getElementsByTagName():');

const paragrafos = document.getElementsByTagName('p');
console.log('Parágrafos:', paragrafos);

const links = document.getElementsByTagName('a');
console.log('Links:', links);

const inputs = document.getElementsByTagName('input');
console.log('Inputs:', inputs);

// Seleção de todos os elementos
const todosElementos = document.getElementsByTagName('*');
console.log('Todos os elementos:', todosElementos.length);

// Função para contar elementos por tag
function contarElementosPorTag(tag) {
    const elementos = document.getElementsByTagName(tag);
    console.log(`📊 ${tag.toUpperCase()}: ${elementos.length} elementos`);
    return elementos.length;
}

console.log('\n📈 Contagem de elementos:');
contarElementosPorTag('div');
contarElementosPorTag('section');
contarElementosPorTag('article');
contarElementosPorTag('button');

// ========== SELEÇÃO COM QUERYSELECTOR ==========
console.log('\n--- SELEÇÃO COM QUERYSELECTOR ---');

// querySelector - primeiro elemento que atende ao seletor CSS
console.log('\n🎯 querySelector():');

// Seletores básicos
const primeiroTitulo = document.querySelector('.titulo');
console.log('Primeiro título:', primeiroTitulo);

const primeiroBotao = document.querySelector('.botao');
console.log('Primeiro botão:', primeiroBotao);

const primeiroInput = document.querySelector('input');
console.log('Primeiro input:', primeiroInput);

// Seletores complexos
const tituloSecundario = document.querySelector('h2.titulo.secundario');
console.log('Título secundário:', tituloSecundario);

const botaoPrimario = document.querySelector('button.botao.primario');
console.log('Botão primário:', botaoPrimario);

const linkSocial = document.querySelector('a.link-social[data-rede="facebook"]');
console.log('Link Facebook:', linkSocial);

// Seletores de hierarquia
const menuItem = document.querySelector('nav .menu .item-menu');
console.log('Item de menu:', menuItem);

const inputFormulario = document.querySelector('#form-contato input[type="email"]');
console.log('Input de email:', inputFormulario);

// Pseudo-seletores
const primeiroModulo = document.querySelector('.modulo:first-child');
console.log('Primeiro módulo:', primeiroModulo);

const ultimoLink = document.querySelector('.redes-sociais a:last-child');
console.log('Último link social:', ultimoLink);

// ========== SELEÇÃO COM QUERYSELECTORALL ==========
console.log('\n--- SELEÇÃO COM QUERYSELECTORALL ---');

// querySelectorAll - todos elementos que atendem ao seletor CSS
console.log('\n🎯 querySelectorAll():');

// Seleções múltiplas
const todosTitulos = document.querySelectorAll('.titulo');
console.log('Todos os títulos:', todosTitulos);
console.log('Quantidade:', todosTitulos.length);

const todosBotoes = document.querySelectorAll('.botao');
console.log('Todos os botões:', todosBotoes);

const todosInputs = document.querySelectorAll('input');
console.log('Todos os inputs:', todosInputs);

// Seletores complexos
const modulosBasicos = document.querySelectorAll('.modulo[data-nivel="basico"]');
console.log('Módulos básicos:', modulosBasicos);

const linksSociais = document.querySelectorAll('.redes-sociais a');
console.log('Links sociais:', linksSociais);

const camposObrigatorios = document.querySelectorAll('input[required]');
console.log('Campos obrigatórios:', camposObrigatorios);

// Múltiplos seletores
const titulosEBotoes = document.querySelectorAll('.titulo, .botao');
console.log('Títulos e botões:', titulosEBotoes);

// Iterando sobre NodeList
console.log('\n🔄 Iterando sobre NodeList:');
if (typeof document !== 'undefined' && todosTitulos.length > 0) {
    todosTitulos.forEach((titulo, index) => {
        console.log(`Título ${index + 1}:`, titulo.textContent || titulo.className);
    });
} else {
    console.log('Simulação: Iterando sobre 3 títulos');
}

// ========== SELEÇÃO POR ATRIBUTO NAME ==========
console.log('\n--- SELEÇÃO POR ATRIBUTO NAME ---');

// getElementsByName - usado principalmente para elementos de formulário
console.log('\n📝 getElementsByName():');

const campoNome = document.getElementsByName('nome');
console.log('Campo nome:', campoNome);

const campoEmail = document.getElementsByName('email');
console.log('Campo email:', campoEmail);

const campoMensagem = document.getElementsByName('mensagem');
console.log('Campo mensagem:', campoMensagem);

// ========== SELEÇÃO COM CONTEXTO ==========
console.log('\n--- SELEÇÃO COM CONTEXTO ---');

// Limitando busca a um elemento específico
console.log('\n🎯 Seleção com contexto:');

// Primeiro, selecionar o contexto
const secaoModulos = document.querySelector('.secao.modulos');
console.log('Seção módulos:', secaoModulos);

if (secaoModulos && typeof secaoModulos.querySelector === 'function') {
    // Buscar apenas dentro da seção de módulos
    const tituloSecaoModulos = secaoModulos.querySelector('.titulo');
    console.log('Título da seção módulos:', tituloSecaoModulos);
    
    const modulosDentroSecao = secaoModulos.querySelectorAll('.modulo');
    console.log('Módulos dentro da seção:', modulosDentroSecao);
    
    const badgesNivel = secaoModulos.querySelectorAll('.badge');
    console.log('Badges de nível:', badgesNivel);
} else {
    console.log('Simulação: Elementos encontrados dentro do contexto');
}

// Contexto com formulário
const formulario = document.querySelector('#form-contato');
if (formulario && typeof formulario.querySelectorAll === 'function') {
    const inputsFormulario = formulario.querySelectorAll('input');
    console.log('Inputs do formulário:', inputsFormulario);
    
    const camposObrigatoriosForm = formulario.querySelectorAll('[required]');
    console.log('Campos obrigatórios do form:', camposObrigatoriosForm);
}

// ========== SELEÇÕES AVANÇADAS ==========
console.log('\n--- SELEÇÕES AVANÇADAS ---');

// Seletores de atributo avançados
console.log('\n🔍 Seletores de atributo avançados:');

// Atributo existe
const elementosComDataNivel = document.querySelectorAll('[data-nivel]');
console.log('Elementos com data-nivel:', elementosComDataNivel);

// Atributo com valor específico
const modulosIntermediarios = document.querySelectorAll('[data-nivel="intermediario"]');
console.log('Módulos intermediários:', modulosIntermediarios);

// Atributo contém valor
const linksComHref = document.querySelectorAll('a[href*="#"]');
console.log('Links com # no href:', linksComHref);

// Atributo começa com valor
const inputsTexto = document.querySelectorAll('input[type^="text"]');
console.log('Inputs de texto:', inputsTexto);

// Atributo termina com valor
const elementosComClasseModulo = document.querySelectorAll('[class$="modulo"]');
console.log('Elementos com classe terminada em "modulo":', elementosComClasseModulo);

// Pseudo-seletores avançados
console.log('\n🎭 Pseudo-seletores avançados:');

// nth-child
const segundoItemMenu = document.querySelector('.item-menu:nth-child(2)');
console.log('Segundo item do menu:', segundoItemMenu);

const modulosImpares = document.querySelectorAll('.modulo:nth-child(odd)');
console.log('Módulos em posições ímpares:', modulosImpares);

// not
const botoesNaoPrimarios = document.querySelectorAll('.botao:not(.primario)');
console.log('Botões não primários:', botoesNaoPrimarios);

// first-of-type e last-of-type
const primeiroH2 = document.querySelector('h2:first-of-type');
console.log('Primeiro H2:', primeiroH2);

const ultimoP = document.querySelector('p:last-of-type');
console.log('Último parágrafo:', ultimoP);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Seleção Inteligente
console.log('\n--- EXERCÍCIO 1: SISTEMA DE SELEÇÃO INTELIGENTE ---');

class SeletorInteligente {
    constructor() {
        this.cache = new Map();
        this.estatisticas = {
            consultas: 0,
            cacheHits: 0,
            tempoTotal: 0
        };
    }
    
    // Seleção com cache automático
    selecionar(seletor, opcoes = {}) {
        const inicio = performance.now();
        this.estatisticas.consultas++;
        
        const {
            cache = true,
            contexto = document,
            multiplos = false,
            obrigatorio = false
        } = opcoes;
        
        // Verificar cache
        const chaveCache = `${seletor}_${multiplos}_${contexto === document ? 'doc' : 'ctx'}`;
        
        if (cache && this.cache.has(chaveCache)) {
            this.estatisticas.cacheHits++;
            const resultado = this.cache.get(chaveCache);
            console.log(`🚀 Cache hit para '${seletor}'`);
            return resultado;
        }
        
        // Realizar seleção
        let elementos;
        try {
            if (multiplos) {
                elementos = contexto.querySelectorAll(seletor);
            } else {
                elementos = contexto.querySelector(seletor);
            }
            
            // Validar resultado
            if (obrigatorio && (!elementos || (multiplos && elementos.length === 0))) {
                throw new Error(`Elemento obrigatório não encontrado: ${seletor}`);
            }
            
            // Armazenar no cache
            if (cache) {
                this.cache.set(chaveCache, elementos);
            }
            
            const tempo = performance.now() - inicio;
            this.estatisticas.tempoTotal += tempo;
            
            console.log(`✅ Seleção '${seletor}': ${multiplos ? elementos.length + ' elementos' : (elementos ? '1 elemento' : 'nenhum elemento')} (${tempo.toFixed(2)}ms)`);
            
            return elementos;
            
        } catch (error) {
            console.error(`❌ Erro na seleção '${seletor}':`, error.message);
            return multiplos ? [] : null;
        }
    }
    
    // Seleção por ID otimizada
    porId(id, obrigatorio = false) {
        return this.selecionar(`#${id}`, { obrigatorio });
    }
    
    // Seleção por classe otimizada
    porClasse(classe, multiplos = true, contexto = document) {
        return this.selecionar(`.${classe}`, { multiplos, contexto });
    }
    
    // Seleção por tag otimizada
    porTag(tag, multiplos = true, contexto = document) {
        return this.selecionar(tag, { multiplos, contexto });
    }
    
    // Seleção por atributo
    porAtributo(atributo, valor = null, multiplos = true) {
        const seletor = valor ? `[${atributo}="${valor}"]` : `[${atributo}]`;
        return this.selecionar(seletor, { multiplos });
    }
    
    // Seleção combinada
    combinada(seletores, operador = ',') {
        const seletorCombinado = seletores.join(operador);
        return this.selecionar(seletorCombinado, { multiplos: true });
    }
    
    // Limpar cache
    limparCache() {
        this.cache.clear();
        console.log('🧹 Cache limpo');
    }
    
    // Obter estatísticas
    obterEstatisticas() {
        const { consultas, cacheHits, tempoTotal } = this.estatisticas;
        const taxaCache = consultas > 0 ? (cacheHits / consultas * 100).toFixed(1) : 0;
        const tempoMedio = consultas > 0 ? (tempoTotal / consultas).toFixed(2) : 0;
        
        return {
            consultas,
            cacheHits,
            taxaCache: `${taxaCache}%`,
            tempoTotal: `${tempoTotal.toFixed(2)}ms`,
            tempoMedio: `${tempoMedio}ms`,
            itensCache: this.cache.size
        };
    }
    
    // Validar seletor CSS
    validarSeletor(seletor) {
        try {
            document.querySelector(seletor);
            return true;
        } catch (error) {
            console.warn(`⚠️ Seletor inválido: ${seletor}`);
            return false;
        }
    }
    
    // Encontrar elementos por texto
    porTexto(texto, tag = '*', exato = false) {
        const elementos = this.selecionar(tag, { multiplos: true });
        const resultado = [];
        
        if (elementos && elementos.length > 0) {
            for (const elemento of elementos) {
                const textoElemento = elemento.textContent || '';
                const match = exato ? 
                    textoElemento.trim() === texto :
                    textoElemento.toLowerCase().includes(texto.toLowerCase());
                
                if (match) {
                    resultado.push(elemento);
                }
            }
        }
        
        console.log(`🔍 Encontrados ${resultado.length} elementos com texto '${texto}'`);
        return resultado;
    }
}

// Testando seletor inteligente
console.log('\n🧠 Testando seletor inteligente:');
const seletor = new SeletorInteligente();

// Testes básicos
const cabecalhoInteligente = seletor.porId('cabecalho', true);
const titulosInteligentes = seletor.porClasse('titulo');
const botoesInteligentes = seletor.porTag('button');

// Teste de cache
console.log('\n💾 Teste de cache:');
seletor.porId('cabecalho'); // Deve usar cache
seletor.porClasse('titulo'); // Deve usar cache

// Seleções avançadas
const modulosNivel = seletor.porAtributo('data-nivel', 'basico');
const elementosCombinados = seletor.combinada(['.titulo', '.botao']);

// Busca por texto
const elementosComTexto = seletor.porTexto('JavaScript');

// Estatísticas
console.log('\n📊 Estatísticas do seletor:');
console.log(seletor.obterEstatisticas());

// EXERCÍCIO 2: Analisador de DOM
console.log('\n--- EXERCÍCIO 2: ANALISADOR DE DOM ---');

class AnalisadorDOM {
    constructor() {
        this.relatorio = {
            elementos: {},
            classes: {},
            ids: {},
            atributos: {},
            estrutura: {},
            problemas: []
        };
    }
    
    // Analisar toda a estrutura do DOM
    analisar(contexto = document) {
        console.log('🔍 Iniciando análise do DOM...');
        
        this.analisarElementos(contexto);
        this.analisarClasses(contexto);
        this.analisarIds(contexto);
        this.analisarAtributos(contexto);
        this.analisarEstrutura(contexto);
        this.detectarProblemas(contexto);
        
        return this.relatorio;
    }
    
    // Analisar tipos de elementos
    analisarElementos(contexto) {
        const todosElementos = contexto.querySelectorAll('*');
        
        for (const elemento of todosElementos) {
            const tag = elemento.tagName ? elemento.tagName.toLowerCase() : 'unknown';
            this.relatorio.elementos[tag] = (this.relatorio.elementos[tag] || 0) + 1;
        }
        
        console.log(`📊 Analisados ${todosElementos.length} elementos`);
    }
    
    // Analisar classes
    analisarClasses(contexto) {
        const elementosComClasse = contexto.querySelectorAll('[class]');
        
        for (const elemento of elementosComClasse) {
            const classes = elemento.className ? elemento.className.split(' ') : [];
            
            for (const classe of classes) {
                if (classe.trim()) {
                    this.relatorio.classes[classe] = (this.relatorio.classes[classe] || 0) + 1;
                }
            }
        }
        
        console.log(`🏷️ Analisadas ${Object.keys(this.relatorio.classes).length} classes únicas`);
    }
    
    // Analisar IDs
    analisarIds(contexto) {
        const elementosComId = contexto.querySelectorAll('[id]');
        
        for (const elemento of elementosComId) {
            const id = elemento.id;
            if (id) {
                this.relatorio.ids[id] = (this.relatorio.ids[id] || 0) + 1;
                
                // Detectar IDs duplicados
                if (this.relatorio.ids[id] > 1) {
                    this.relatorio.problemas.push({
                        tipo: 'ID_DUPLICADO',
                        elemento: id,
                        descricao: `ID '${id}' usado ${this.relatorio.ids[id]} vezes`
                    });
                }
            }
        }
        
        console.log(`🆔 Analisados ${Object.keys(this.relatorio.ids).length} IDs únicos`);
    }
    
    // Analisar atributos
    analisarAtributos(contexto) {
        const todosElementos = contexto.querySelectorAll('*');
        
        for (const elemento of todosElementos) {
            if (elemento.attributes) {
                for (const attr of elemento.attributes) {
                    const nome = attr.name;
                    this.relatorio.atributos[nome] = (this.relatorio.atributos[nome] || 0) + 1;
                }
            }
        }
        
        console.log(`📋 Analisados ${Object.keys(this.relatorio.atributos).length} tipos de atributos`);
    }
    
    // Analisar estrutura hierárquica
    analisarEstrutura(contexto) {
        const calcularProfundidade = (elemento, profundidade = 0) => {
            this.relatorio.estrutura.profundidadeMaxima = Math.max(
                this.relatorio.estrutura.profundidadeMaxima || 0,
                profundidade
            );
            
            if (elemento.children) {
                for (const filho of elemento.children) {
                    calcularProfundidade(filho, profundidade + 1);
                }
            }
        };
        
        calcularProfundidade(contexto);
        
        // Contar elementos órfãos (sem parent)
        const elementosOrfaos = contexto.querySelectorAll('*:not(:has(*))');
        this.relatorio.estrutura.elementosOrfaos = elementosOrfaos.length;
        
        console.log(`🌳 Estrutura analisada - Profundidade máxima: ${this.relatorio.estrutura.profundidadeMaxima}`);
    }
    
    // Detectar problemas comuns
    detectarProblemas(contexto) {
        // Elementos sem texto acessível
        const imagensSemAlt = contexto.querySelectorAll('img:not([alt])');
        if (imagensSemAlt.length > 0) {
            this.relatorio.problemas.push({
                tipo: 'ACESSIBILIDADE',
                elemento: 'img',
                descricao: `${imagensSemAlt.length} imagens sem atributo alt`
            });
        }
        
        // Links sem href
        const linksSemHref = contexto.querySelectorAll('a:not([href])');
        if (linksSemHref.length > 0) {
            this.relatorio.problemas.push({
                tipo: 'SEMANTICA',
                elemento: 'a',
                descricao: `${linksSemHref.length} links sem atributo href`
            });
        }
        
        // Inputs sem label
        const inputsSemLabel = contexto.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        const labelsExistentes = contexto.querySelectorAll('label');
        
        if (inputsSemLabel.length > labelsExistentes.length) {
            this.relatorio.problemas.push({
                tipo: 'ACESSIBILIDADE',
                elemento: 'input',
                descricao: 'Possíveis inputs sem labels associados'
            });
        }
        
        // Classes não utilizadas (simulação)
        const classesDefinidas = Object.keys(this.relatorio.classes);
        const classesComUsoUnico = classesDefinidas.filter(classe => 
            this.relatorio.classes[classe] === 1
        );
        
        if (classesComUsoUnico.length > 0) {
            this.relatorio.problemas.push({
                tipo: 'OTIMIZACAO',
                elemento: 'class',
                descricao: `${classesComUsoUnico.length} classes usadas apenas uma vez`
            });
        }
        
        console.log(`⚠️ Detectados ${this.relatorio.problemas.length} problemas potenciais`);
    }
    
    // Gerar relatório formatado
    gerarRelatorio() {
        console.log('\n📋 RELATÓRIO DE ANÁLISE DO DOM');
        console.log('================================');
        
        // Elementos mais comuns
        const elementosOrdenados = Object.entries(this.relatorio.elementos)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        console.log('\n🏗️ Top 5 elementos:');
        elementosOrdenados.forEach(([tag, count]) => {
            console.log(`  ${tag}: ${count}`);
        });
        
        // Classes mais usadas
        const classesOrdenadas = Object.entries(this.relatorio.classes)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);
        
        console.log('\n🏷️ Top 5 classes:');
        classesOrdenadas.forEach(([classe, count]) => {
            console.log(`  .${classe}: ${count}`);
        });
        
        // Estrutura
        console.log('\n🌳 Estrutura:');
        console.log(`  Profundidade máxima: ${this.relatorio.estrutura.profundidadeMaxima}`);
        console.log(`  Total de elementos: ${Object.values(this.relatorio.elementos).reduce((a, b) => a + b, 0)}`);
        console.log(`  Total de classes: ${Object.keys(this.relatorio.classes).length}`);
        console.log(`  Total de IDs: ${Object.keys(this.relatorio.ids).length}`);
        
        // Problemas
        if (this.relatorio.problemas.length > 0) {
            console.log('\n⚠️ Problemas detectados:');
            this.relatorio.problemas.forEach((problema, index) => {
                console.log(`  ${index + 1}. [${problema.tipo}] ${problema.descricao}`);
            });
        } else {
            console.log('\n✅ Nenhum problema detectado!');
        }
        
        return this.relatorio;
    }
    
    // Sugerir otimizações
    sugerirOtimizacoes() {
        const sugestoes = [];
        
        // Muitas classes únicas
        const classesUnicas = Object.values(this.relatorio.classes)
            .filter(count => count === 1).length;
        
        if (classesUnicas > 10) {
            sugestoes.push('Considere consolidar classes com uso único');
        }
        
        // Estrutura muito profunda
        if (this.relatorio.estrutura.profundidadeMaxima > 10) {
            sugestoes.push('Estrutura DOM muito profunda - considere simplificar');
        }
        
        // Muitos elementos
        const totalElementos = Object.values(this.relatorio.elementos)
            .reduce((a, b) => a + b, 0);
        
        if (totalElementos > 1000) {
            sugestoes.push('DOM muito complexo - considere lazy loading ou virtualização');
        }
        
        console.log('\n💡 Sugestões de otimização:');
        sugestoes.forEach((sugestao, index) => {
            console.log(`  ${index + 1}. ${sugestao}`);
        });
        
        return sugestoes;
    }
}

// Testando analisador de DOM
console.log('\n🔬 Testando analisador de DOM:');
const analisador = new AnalisadorDOM();

// Simular análise
if (typeof document !== 'undefined') {
    const relatorio = analisador.analisar();
    analisador.gerarRelatorio();
    analisador.sugerirOtimizacoes();
} else {
    console.log('📝 Simulação de análise de DOM concluída');
}

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA SELEÇÃO DE ELEMENTOS:

1. **Performance de Seleção**
   - getElementById() é mais rápido que querySelector('#id')
   - getElementsByClassName() é mais rápido que querySelectorAll('.class')
   - Cache elementos frequentemente acessados
   - Use contexto para limitar escopo de busca

2. **Estratégias de Cache**
   - Armazene referências de elementos estáticos
   - Use WeakMap para cache que não vaza memória
   - Invalide cache quando DOM muda
   - Cache seletores complexos

3. **Seletores Eficientes**
   - Evite seletores muito genéricos (*)
   - Use IDs e classes específicas
   - Prefira seletores de atributo a pseudo-seletores
   - Combine seletores quando possível

4. **Gerenciamento de Memória**
   - Remova event listeners de elementos removidos
   - Use WeakMap/WeakSet para referências fracas
   - Evite vazamentos com closures
   - Limpe caches periodicamente

5. **Debugging e Monitoramento**
   - Use console.time() para medir performance
   - Monitore quantidade de consultas DOM
   - Valide existência de elementos
   - Log seletores que falham
*/

// Exemplo de cache otimizado
console.log('\n⚡ Exemplo de cache otimizado:');

class CacheDOM {
    constructor() {
        this.cache = new Map();
        this.observer = null;
        this.setupMutationObserver();
    }
    
    // Configurar observador de mutações
    setupMutationObserver() {
        if (typeof MutationObserver !== 'undefined') {
            this.observer = new MutationObserver((mutations) => {
                let shouldClear = false;
                
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        shouldClear = true;
                        break;
                    }
                }
                
                if (shouldClear) {
                    this.invalidateCache();
                }
            });
            
            if (typeof document !== 'undefined') {
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'id']
                });
            }
        }
    }
    
    // Obter elemento com cache
    get(seletor, contexto = document) {
        const chave = `${seletor}_${contexto === document ? 'doc' : 'ctx'}`;
        
        if (this.cache.has(chave)) {
            return this.cache.get(chave);
        }
        
        const elemento = contexto.querySelector(seletor);
        this.cache.set(chave, elemento);
        
        return elemento;
    }
    
    // Invalidar cache
    invalidateCache() {
        this.cache.clear();
        console.log('🔄 Cache DOM invalidado devido a mudanças');
    }
    
    // Destruir cache
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.cache.clear();
    }
}

// Testando cache otimizado
const cacheDOM = new CacheDOM();
console.log('Cache DOM criado com observador de mutações');

// Exemplo de medição de performance
console.log('\n📊 Medição de performance:');

function medirPerformanceSelecao() {
    const iteracoes = 1000;
    
    // Teste getElementById
    console.time('getElementById');
    for (let i = 0; i < iteracoes; i++) {
        document.getElementById('cabecalho');
    }
    console.timeEnd('getElementById');
    
    // Teste querySelector
    console.time('querySelector');
    for (let i = 0; i < iteracoes; i++) {
        document.querySelector('#cabecalho');
    }
    console.timeEnd('querySelector');
    
    // Teste com cache
    const elementoCache = document.getElementById('cabecalho');
    console.time('cache');
    for (let i = 0; i < iteracoes; i++) {
        // Simula acesso ao cache
        const elemento = elementoCache;
    }
    console.timeEnd('cache');
}

if (typeof document !== 'undefined' && typeof performance !== 'undefined') {
    medirPerformanceSelecao();
} else {
    console.log('📝 Simulação de medição de performance concluída');
}

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN DOM: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
- MDN Selectors API: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Locating_DOM_elements_using_selectors
- CSS Selectors: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors

📚 LIVROS RECOMENDADOS:
- "DOM Enlightenment" - Cody Lindley
- "JavaScript: The Definitive Guide" - David Flanagan
- "High Performance JavaScript" - Nicholas Zakas

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Manipulação de conteúdo DOM
2. Manipulação de estilos e classes
3. Criação e remoção de elementos
4. Event handling e delegation
5. Performance e otimização DOM
6. Virtual DOM e frameworks
7. Web Components
8. Shadow DOM

💡 EXERCÍCIOS SUGERIDOS:
1. Crie um sistema de busca em tempo real
2. Implemente um seletor visual de elementos
3. Desenvolva um analisador de performance DOM
4. Crie um sistema de cache inteligente
5. Implemente um debugger de seletores CSS

🔧 FERRAMENTAS ÚTEIS:
- DevTools do navegador
- Lighthouse para performance
- axe-core para acessibilidade
- CSS Selector Tester
- DOM Inspector extensions

⚠️ ARMADILHAS COMUNS:
1. Não verificar se elemento existe antes de usar
2. Fazer muitas consultas DOM desnecessárias
3. Não usar cache para elementos estáticos
4. Seletores muito complexos e lentos
5. Não considerar mudanças dinâmicas no DOM
6. Vazamentos de memória com referências
7. Não validar seletores CSS
8. Usar métodos deprecated

🎓 CONCEITOS AVANÇADOS:
- Shadow DOM
- Custom Elements
- Mutation Observers
- Intersection Observer
- Virtual DOM
- DOM diffing algorithms
- Tree shaking para DOM
- Lazy loading de elementos
*/

console.log('\n✅ Módulo de Seleção de Elementos concluído!');
console.log('📝 Próximo arquivo: 02-manipulacao-conteudo.js');
console.log('🎯 Continue praticando com os exercícios propostos!');

// Limpeza
if (typeof cacheDOM !== 'undefined') {
    cacheDOM.destroy();
}

/*
==============================================
RESUMO DO MÓDULO - SELEÇÃO DE ELEMENTOS
==============================================

✅ CONCEITOS APRENDIDOS:
- Métodos de seleção DOM
- Diferenças entre HTMLCollection e NodeList
- Seletores CSS avançados
- Cache e otimização
- Debugging de seleções
- Análise de estrutura DOM

🎯 HABILIDADES DESENVOLVIDAS:
- Selecionar elementos eficientemente
- Usar seletores CSS complexos
- Implementar cache inteligente
- Analisar performance de seleções
- Detectar problemas no DOM
- Criar utilitários de seleção

📈 PRÓXIMOS DESAFIOS:
- Manipulação de conteúdo
- Estilos e classes
- Criação de elementos
- Event handling
- Performance optimization

==============================================
*/