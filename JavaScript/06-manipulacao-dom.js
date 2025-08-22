/*
===========================================
    CURSO JAVASCRIPT - MANIPULAÇÃO DO DOM
===========================================

Este arquivo aborda:
- Conceitos básicos do DOM
- Seleção de elementos
- Manipulação de conteúdo e atributos
- Criação e remoção de elementos
- Manipulação de classes e estilos
- Navegação pelo DOM
- Formulários e validação
- Exemplos práticos avançados

NOTA: Este arquivo contém código JavaScript para manipulação do DOM.
Para testar os exemplos, você precisará de um arquivo HTML.
*/

// ========================================
// 1. CONCEITOS BÁSICOS DO DOM
// ========================================

/*
O DOM (Document Object Model) é uma representação em árvore do documento HTML.
Cada elemento HTML é um nó na árvore, e podemos manipular esses nós com JavaScript.

Estrutura básica:
document
├── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── div
        ├── p
        └── script
*/

// Objeto document - ponto de entrada para o DOM
console.log("Documento:", document);
console.log("Título da página:", document.title);
console.log("URL da página:", document.URL);
console.log("Domínio:", document.domain);

// ========================================
// 2. SELEÇÃO DE ELEMENTOS
// ========================================

// getElementById() - seleciona por ID (mais rápido)
const elementoPorId = document.getElementById("meuId");
console.log("Elemento por ID:", elementoPorId);

// getElementsByClassName() - seleciona por classe (retorna HTMLCollection)
const elementosPorClasse = document.getElementsByClassName("minhaClasse");
console.log("Elementos por classe:", elementosPorClasse);

// getElementsByTagName() - seleciona por tag (retorna HTMLCollection)
const elementosPorTag = document.getElementsByTagName("div");
console.log("Elementos por tag:", elementosPorTag);

// querySelector() - seleciona primeiro elemento que corresponde ao seletor CSS
const primeiroElemento = document.querySelector(".minhaClasse");
const elementoPorAtributo = document.querySelector("[data-id='123']");
const elementoComplexo = document.querySelector("div.container > p:first-child");

console.log("Primeiro elemento:", primeiroElemento);
console.log("Elemento por atributo:", elementoPorAtributo);
console.log("Elemento complexo:", elementoComplexo);

// querySelectorAll() - seleciona todos os elementos (retorna NodeList)
const todosElementos = document.querySelectorAll(".minhaClasse");
const elementosMultiplos = document.querySelectorAll("div, p, span");

console.log("Todos elementos:", todosElementos);
console.log("Elementos múltiplos:", elementosMultiplos);

// Diferença entre HTMLCollection e NodeList
/*
HTMLCollection:
- Coleção "viva" (atualiza automaticamente)
- Apenas elementos HTML
- Métodos: item(), namedItem()

NodeList:
- Pode ser "viva" ou estática
- Pode incluir qualquer tipo de nó
- Métodos: item(), forEach() (em NodeLists estáticas)
*/

// ========================================
// 3. MANIPULAÇÃO DE CONTEÚDO
// ========================================

// innerHTML - obtém/define HTML interno
const container = document.querySelector(".container");
if (container) {
    console.log("HTML interno:", container.innerHTML);
    // container.innerHTML = "<p>Novo conteúdo HTML</p>";
}

// textContent - obtém/define apenas texto (sem HTML)
const paragrafo = document.querySelector("p");
if (paragrafo) {
    console.log("Conteúdo de texto:", paragrafo.textContent);
    // paragrafo.textContent = "Novo texto sem HTML";
}

// innerText - similar ao textContent, mas considera estilos CSS
if (paragrafo) {
    console.log("Texto visível:", paragrafo.innerText);
}

// outerHTML - obtém/define o elemento completo incluindo suas tags
if (paragrafo) {
    console.log("HTML externo:", paragrafo.outerHTML);
}

// ========================================
// 4. MANIPULAÇÃO DE ATRIBUTOS
// ========================================

const imagem = document.querySelector("img");
if (imagem) {
    // getAttribute() - obtém valor do atributo
    const src = imagem.getAttribute("src");
    const alt = imagem.getAttribute("alt");
    
    console.log("Src da imagem:", src);
    console.log("Alt da imagem:", alt);
    
    // setAttribute() - define valor do atributo
    imagem.setAttribute("alt", "Nova descrição");
    imagem.setAttribute("data-loaded", "true");
    
    // removeAttribute() - remove atributo
    // imagem.removeAttribute("title");
    
    // hasAttribute() - verifica se atributo existe
    const temAlt = imagem.hasAttribute("alt");
    console.log("Tem atributo alt:", temAlt);
}

// Propriedades diretas (mais rápidas para atributos padrão)
const link = document.querySelector("a");
if (link) {
    console.log("Href do link:", link.href);
    // link.href = "https://novo-link.com";
    // link.target = "_blank";
}

// Data attributes
const elementoComData = document.querySelector("[data-id]");
if (elementoComData) {
    // Usando dataset (converte kebab-case para camelCase)
    console.log("Data ID:", elementoComData.dataset.id);
    console.log("Data user name:", elementoComData.dataset.userName);
    
    // Definindo data attributes
    elementoComData.dataset.status = "ativo";
    elementoComData.dataset.lastUpdate = new Date().toISOString();
}

// ========================================
// 5. CRIAÇÃO E REMOÇÃO DE ELEMENTOS
// ========================================

// createElement() - cria novo elemento
const novoDiv = document.createElement("div");
novoDiv.className = "novo-elemento";
novoDiv.textContent = "Elemento criado dinamicamente";

// createTextNode() - cria nó de texto
const textoNode = document.createTextNode("Texto criado dinamicamente");

// appendChild() - adiciona como último filho
const lista = document.querySelector("ul");
if (lista) {
    const novoItem = document.createElement("li");
    novoItem.textContent = "Novo item da lista";
    lista.appendChild(novoItem);
}

// insertBefore() - insere antes de elemento específico
if (lista && lista.children.length > 0) {
    const itemAntes = document.createElement("li");
    itemAntes.textContent = "Item inserido antes";
    lista.insertBefore(itemAntes, lista.firstElementChild);
}

// insertAdjacentHTML() - insere HTML em posição específica
const elemento = document.querySelector(".container");
if (elemento) {
    // Posições: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
    elemento.insertAdjacentHTML('afterbegin', '<p>Inserido no início</p>');
    elemento.insertAdjacentHTML('beforeend', '<p>Inserido no final</p>');
}

// insertAdjacentElement() - insere elemento em posição específica
if (elemento) {
    const novoParagrafo = document.createElement('p');
    novoParagrafo.textContent = 'Elemento inserido';
    elemento.insertAdjacentElement('afterbegin', novoParagrafo);
}

// removeChild() - remove elemento filho
if (lista && lista.children.length > 0) {
    const primeiroItem = lista.firstElementChild;
    // lista.removeChild(primeiroItem);
}

// remove() - remove o próprio elemento (método moderno)
const elementoParaRemover = document.querySelector(".remover");
if (elementoParaRemover) {
    // elementoParaRemover.remove();
}

// replaceChild() - substitui elemento filho
if (lista && lista.children.length > 1) {
    const novoItem = document.createElement("li");
    novoItem.textContent = "Item substituído";
    // lista.replaceChild(novoItem, lista.children[1]);
}

// ========================================
// 6. MANIPULAÇÃO DE CLASSES E ESTILOS
// ========================================

const elementoEstilo = document.querySelector(".exemplo");
if (elementoEstilo) {
    // className - obtém/define classes como string
    console.log("Classes atuais:", elementoEstilo.className);
    // elementoEstilo.className = "nova-classe outra-classe";
    
    // classList - API moderna para manipular classes
    console.log("Lista de classes:", elementoEstilo.classList);
    
    // add() - adiciona classe
    elementoEstilo.classList.add("ativa");
    elementoEstilo.classList.add("destacada", "importante"); // Múltiplas classes
    
    // remove() - remove classe
    elementoEstilo.classList.remove("antiga");
    
    // toggle() - alterna classe (adiciona se não existe, remove se existe)
    elementoEstilo.classList.toggle("visivel");
    
    // contains() - verifica se classe existe
    const temClasse = elementoEstilo.classList.contains("ativa");
    console.log("Tem classe 'ativa':", temClasse);
    
    // replace() - substitui uma classe por outra
    elementoEstilo.classList.replace("antiga", "nova");
}

// Manipulação de estilos inline
if (elementoEstilo) {
    // style - acessa estilos inline
    elementoEstilo.style.color = "red";
    elementoEstilo.style.backgroundColor = "yellow";
    elementoEstilo.style.fontSize = "18px";
    
    // cssText - define múltiplos estilos de uma vez
    elementoEstilo.style.cssText = "color: blue; background: lightgray; padding: 10px;";
    
    // getComputedStyle() - obtém estilos computados (incluindo CSS)
    const estilosComputados = window.getComputedStyle(elementoEstilo);
    console.log("Cor computada:", estilosComputados.color);
    console.log("Fonte computada:", estilosComputados.fontSize);
}

// ========================================
// 7. NAVEGAÇÃO PELO DOM
// ========================================

const elementoNavegacao = document.querySelector(".navegacao");
if (elementoNavegacao) {
    // Propriedades de navegação (incluem nós de texto)
    console.log("Primeiro filho:", elementoNavegacao.firstChild);
    console.log("Último filho:", elementoNavegacao.lastChild);
    console.log("Próximo irmão:", elementoNavegacao.nextSibling);
    console.log("Irmão anterior:", elementoNavegacao.previousSibling);
    console.log("Nó pai:", elementoNavegacao.parentNode);
    console.log("Filhos:", elementoNavegacao.childNodes);
    
    // Propriedades de navegação (apenas elementos)
    console.log("Primeiro elemento filho:", elementoNavegacao.firstElementChild);
    console.log("Último elemento filho:", elementoNavegacao.lastElementChild);
    console.log("Próximo elemento irmão:", elementoNavegacao.nextElementSibling);
    console.log("Elemento irmão anterior:", elementoNavegacao.previousElementSibling);
    console.log("Elemento pai:", elementoNavegacao.parentElement);
    console.log("Elementos filhos:", elementoNavegacao.children);
    
    // Contagem de filhos
    console.log("Número de filhos:", elementoNavegacao.childElementCount);
}

// closest() - encontra ancestral mais próximo que corresponde ao seletor
const botao = document.querySelector("button");
if (botao) {
    const formulario = botao.closest("form");
    const container = botao.closest(".container");
    console.log("Formulário mais próximo:", formulario);
    console.log("Container mais próximo:", container);
}

// matches() - verifica se elemento corresponde ao seletor
if (botao) {
    const ehBotaoPrimario = botao.matches(".btn-primary");
    const ehInput = botao.matches("input");
    console.log("É botão primário:", ehBotaoPrimario);
    console.log("É input:", ehInput);
}

// ========================================
// 8. FORMULÁRIOS E VALIDAÇÃO
// ========================================

// Selecionando elementos de formulário
const formulario = document.querySelector("form");
const inputNome = document.querySelector("input[name='nome']");
const inputEmail = document.querySelector("input[type='email']");
const select = document.querySelector("select");
const textarea = document.querySelector("textarea");
const checkbox = document.querySelector("input[type='checkbox']");
const radio = document.querySelector("input[type='radio']");

// Obtendo e definindo valores
if (inputNome) {
    console.log("Valor do nome:", inputNome.value);
    // inputNome.value = "Novo nome";
    
    // Propriedades úteis
    console.log("Está focado:", inputNome === document.activeElement);
    console.log("Está desabilitado:", inputNome.disabled);
    console.log("É somente leitura:", inputNome.readOnly);
}

// Trabalhando com select
if (select) {
    console.log("Opção selecionada:", select.value);
    console.log("Índice selecionado:", select.selectedIndex);
    console.log("Opções:", select.options);
    
    // Selecionando opção programaticamente
    // select.selectedIndex = 2;
    // select.value = "opcao3";
}

// Trabalhando com checkbox e radio
if (checkbox) {
    console.log("Checkbox marcado:", checkbox.checked);
    // checkbox.checked = true;
}

if (radio) {
    console.log("Radio selecionado:", radio.checked);
    // radio.checked = true;
}

// Validação HTML5
if (inputEmail) {
    console.log("Email válido:", inputEmail.validity.valid);
    console.log("Detalhes da validação:", inputEmail.validity);
    console.log("Mensagem de validação:", inputEmail.validationMessage);
    
    // Validação customizada
    inputEmail.setCustomValidity(""); // Limpa erro customizado
    if (inputEmail.value && !inputEmail.value.includes("@")) {
        inputEmail.setCustomValidity("Email deve conter @");
    }
}

// ========================================
// 9. EXEMPLO PRÁTICO: LISTA DE TAREFAS
// ========================================

class ListaTarefas {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tarefas = [];
        this.proximoId = 1;
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error("Container não encontrado");
            return;
        }
        
        this.criarInterface();
        this.adicionarEventListeners();
    }
    
    criarInterface() {
        this.container.innerHTML = `
            <div class="lista-tarefas">
                <h2>Lista de Tarefas</h2>
                <div class="input-container">
                    <input type="text" id="nova-tarefa" placeholder="Digite uma nova tarefa...">
                    <button id="adicionar-tarefa">Adicionar</button>
                </div>
                <div class="filtros">
                    <button class="filtro ativo" data-filtro="todas">Todas</button>
                    <button class="filtro" data-filtro="pendentes">Pendentes</button>
                    <button class="filtro" data-filtro="concluidas">Concluídas</button>
                </div>
                <ul id="lista-tarefas"></ul>
                <div class="estatisticas">
                    <span id="total-tarefas">0 tarefas</span>
                    <span id="tarefas-pendentes">0 pendentes</span>
                    <span id="tarefas-concluidas">0 concluídas</span>
                </div>
            </div>
        `;
    }
    
    adicionarEventListeners() {
        const inputNovaTarefa = this.container.querySelector("#nova-tarefa");
        const botaoAdicionar = this.container.querySelector("#adicionar-tarefa");
        const filtros = this.container.querySelectorAll(".filtro");
        
        // Adicionar tarefa
        botaoAdicionar.addEventListener("click", () => this.adicionarTarefa());
        inputNovaTarefa.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.adicionarTarefa();
        });
        
        // Filtros
        filtros.forEach(filtro => {
            filtro.addEventListener("click", (e) => {
                this.aplicarFiltro(e.target.dataset.filtro);
                this.atualizarFiltroAtivo(e.target);
            });
        });
    }
    
    adicionarTarefa() {
        const input = this.container.querySelector("#nova-tarefa");
        const texto = input.value.trim();
        
        if (!texto) {
            alert("Digite uma tarefa válida!");
            return;
        }
        
        const tarefa = {
            id: this.proximoId++,
            texto,
            concluida: false,
            dataCreacao: new Date()
        };
        
        this.tarefas.push(tarefa);
        input.value = "";
        this.renderizarTarefas();
        this.atualizarEstatisticas();
    }
    
    removerTarefa(id) {
        this.tarefas = this.tarefas.filter(tarefa => tarefa.id !== id);
        this.renderizarTarefas();
        this.atualizarEstatisticas();
    }
    
    alternarTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.concluida = !tarefa.concluida;
            this.renderizarTarefas();
            this.atualizarEstatisticas();
        }
    }
    
    editarTarefa(id, novoTexto) {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (tarefa && novoTexto.trim()) {
            tarefa.texto = novoTexto.trim();
            this.renderizarTarefas();
        }
    }
    
    aplicarFiltro(filtro) {
        this.filtroAtual = filtro;
        this.renderizarTarefas();
    }
    
    atualizarFiltroAtivo(filtroClicado) {
        this.container.querySelectorAll(".filtro").forEach(f => f.classList.remove("ativo"));
        filtroClicado.classList.add("ativo");
    }
    
    obterTarefasFiltradas() {
        switch (this.filtroAtual) {
            case "pendentes":
                return this.tarefas.filter(t => !t.concluida);
            case "concluidas":
                return this.tarefas.filter(t => t.concluida);
            default:
                return this.tarefas;
        }
    }
    
    renderizarTarefas() {
        const lista = this.container.querySelector("#lista-tarefas");
        const tarefasFiltradas = this.obterTarefasFiltradas();
        
        lista.innerHTML = "";
        
        tarefasFiltradas.forEach(tarefa => {
            const li = document.createElement("li");
            li.className = `tarefa ${tarefa.concluida ? "concluida" : ""}`;
            li.dataset.id = tarefa.id;
            
            li.innerHTML = `
                <div class="tarefa-conteudo">
                    <input type="checkbox" ${tarefa.concluida ? "checked" : ""}>
                    <span class="texto-tarefa">${tarefa.texto}</span>
                    <div class="acoes">
                        <button class="editar">✏️</button>
                        <button class="remover">🗑️</button>
                    </div>
                </div>
            `;
            
            // Event listeners para cada tarefa
            const checkbox = li.querySelector("input[type='checkbox']");
            const botaoEditar = li.querySelector(".editar");
            const botaoRemover = li.querySelector(".remover");
            const textoTarefa = li.querySelector(".texto-tarefa");
            
            checkbox.addEventListener("change", () => this.alternarTarefa(tarefa.id));
            botaoRemover.addEventListener("click", () => this.removerTarefa(tarefa.id));
            
            botaoEditar.addEventListener("click", () => {
                const novoTexto = prompt("Editar tarefa:", tarefa.texto);
                if (novoTexto !== null) {
                    this.editarTarefa(tarefa.id, novoTexto);
                }
            });
            
            lista.appendChild(li);
        });
    }
    
    atualizarEstatisticas() {
        const total = this.tarefas.length;
        const concluidas = this.tarefas.filter(t => t.concluida).length;
        const pendentes = total - concluidas;
        
        this.container.querySelector("#total-tarefas").textContent = `${total} tarefas`;
        this.container.querySelector("#tarefas-pendentes").textContent = `${pendentes} pendentes`;
        this.container.querySelector("#tarefas-concluidas").textContent = `${concluidas} concluídas`;
    }
}

// Para usar a lista de tarefas:
// const minhaLista = new ListaTarefas("container-tarefas");

// ========================================
// 10. EXEMPLO PRÁTICO: GALERIA DE IMAGENS
// ========================================

class GaleriaImagens {
    constructor(containerId, imagens) {
        this.container = document.getElementById(containerId);
        this.imagens = imagens;
        this.imagemAtual = 0;
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error("Container não encontrado");
            return;
        }
        
        this.criarInterface();
        this.adicionarEventListeners();
        this.mostrarImagem(0);
    }
    
    criarInterface() {
        this.container.innerHTML = `
            <div class="galeria">
                <div class="imagem-principal">
                    <img id="imagem-atual" src="" alt="">
                    <div class="controles">
                        <button id="anterior">❮</button>
                        <button id="proximo">❯</button>
                    </div>
                    <div class="contador">
                        <span id="posicao-atual">1</span> / <span id="total-imagens">${this.imagens.length}</span>
                    </div>
                </div>
                <div class="miniaturas">
                    ${this.imagens.map((img, index) => `
                        <img class="miniatura" src="${img.src}" alt="${img.alt}" data-index="${index}">
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    adicionarEventListeners() {
        const botaoAnterior = this.container.querySelector("#anterior");
        const botaoProximo = this.container.querySelector("#proximo");
        const miniaturas = this.container.querySelectorAll(".miniatura");
        
        botaoAnterior.addEventListener("click", () => this.imagemAnterior());
        botaoProximo.addEventListener("click", () => this.proximaImagem());
        
        miniaturas.forEach(miniatura => {
            miniatura.addEventListener("click", (e) => {
                const index = parseInt(e.target.dataset.index);
                this.mostrarImagem(index);
            });
        });
        
        // Navegação por teclado
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.imagemAnterior();
            if (e.key === "ArrowRight") this.proximaImagem();
            if (e.key === "Escape") this.fecharGaleria();
        });
    }
    
    mostrarImagem(index) {
        if (index < 0 || index >= this.imagens.length) return;
        
        this.imagemAtual = index;
        const imagem = this.imagens[index];
        
        const imagemElement = this.container.querySelector("#imagem-atual");
        imagemElement.src = imagem.src;
        imagemElement.alt = imagem.alt;
        
        // Atualizar contador
        this.container.querySelector("#posicao-atual").textContent = index + 1;
        
        // Atualizar miniaturas
        this.container.querySelectorAll(".miniatura").forEach((mini, i) => {
            mini.classList.toggle("ativa", i === index);
        });
    }
    
    proximaImagem() {
        const proximoIndex = (this.imagemAtual + 1) % this.imagens.length;
        this.mostrarImagem(proximoIndex);
    }
    
    imagemAnterior() {
        const anteriorIndex = (this.imagemAtual - 1 + this.imagens.length) % this.imagens.length;
        this.mostrarImagem(anteriorIndex);
    }
    
    fecharGaleria() {
        // Implementar lógica para fechar galeria se necessário
        console.log("Galeria fechada");
    }
}

// Para usar a galeria:
/*
const imagens = [
    { src: "imagem1.jpg", alt: "Descrição 1" },
    { src: "imagem2.jpg", alt: "Descrição 2" },
    { src: "imagem3.jpg", alt: "Descrição 3" }
];
const galeria = new GaleriaImagens("container-galeria", imagens);
*/

// ========================================
// 11. EXERCÍCIOS PROPOSTOS
// ========================================

/*
EXERCÍCIO 1: Calculadora Interativa
Crie uma calculadora com:
- Interface criada dinamicamente
- Botões para números e operações
- Display para mostrar resultado
- Histórico de operações
- Validação de entrada

EXERCÍCIO 2: Sistema de Abas (Tabs)
Implemente:
- Múltiplas abas com conteúdo diferente
- Navegação entre abas
- Aba ativa destacada
- Conteúdo carregado dinamicamente
- Animações de transição

EXERCÍCIO 3: Formulário de Cadastro Avançado
Crie um formulário com:
- Validação em tempo real
- Máscaras para campos (CPF, telefone)
- Upload de arquivo com preview
- Campos dependentes (cidade baseada no estado)
- Salvamento em localStorage

EXERCÍCIO 4: Menu Dropdown Responsivo
Implemente:
- Menu principal com submenus
- Abertura/fechamento suave
- Navegação por teclado
- Fechamento ao clicar fora
- Adaptação para mobile

EXERCÍCIO 5: Sistema de Comentários
Crie:
- Adição de comentários
- Respostas aninhadas
- Edição e exclusão
- Curtidas/descurtidas
- Ordenação por data/popularidade
*/

// ========================================
// 12. BOAS PRÁTICAS E DICAS
// ========================================

/*
BOAS PRÁTICAS:

1. PERFORMANCE:
   - Cache seleções de elementos frequentemente usados
   - Use DocumentFragment para múltiplas inserções
   - Evite manipulações desnecessárias do DOM
   - Use requestAnimationFrame para animações

2. SELETORES:
   - Prefira getElementById para seleções únicas
   - Use querySelector/querySelectorAll para seletores complexos
   - Seja específico nos seletores para melhor performance
   - Evite seletores muito genéricos

3. EVENTOS:
   - Use event delegation para elementos dinâmicos
   - Remova event listeners quando não precisar mais
   - Use passive listeners quando apropriado
   - Evite inline event handlers

4. MANIPULAÇÃO:
   - Prefira textContent sobre innerHTML quando possível
   - Use classList em vez de className
   - Valide existência de elementos antes de manipular
   - Use métodos modernos (remove, closest, matches)

5. ACESSIBILIDADE:
   - Mantenha foco visível e lógico
   - Use atributos ARIA quando necessário
   - Garanta navegação por teclado
   - Forneça feedback para ações do usuário

6. SEGURANÇA:
   - Sanitize conteúdo antes de usar innerHTML
   - Valide dados de entrada
   - Use textContent para conteúdo não-HTML
   - Cuidado com XSS em conteúdo dinâmico

DICAS IMPORTANTES:
- O DOM é uma API custosa - minimize acessos
- Batch operações DOM quando possível
- Use CSS para animações sempre que possível
- Teste em diferentes navegadores
- Considere usar bibliotecas como React/Vue para apps complexas
- Aprenda sobre Virtual DOM para entender frameworks modernos
*/

// ========================================
// 13. ARQUIVO HTML DE EXEMPLO
// ========================================

/*
Para testar os exemplos deste arquivo, crie um arquivo HTML com esta estrutura:

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manipulação DOM - Exemplos</title>
    <style>
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .tarefa { padding: 10px; border: 1px solid #ddd; margin: 5px 0; }
        .tarefa.concluida { opacity: 0.6; text-decoration: line-through; }
        .filtro.ativo { background: #007bff; color: white; }
        .galeria img { max-width: 100%; height: auto; }
        .miniatura { width: 80px; height: 60px; object-fit: cover; cursor: pointer; }
        .miniatura.ativa { border: 3px solid #007bff; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Exemplos de Manipulação DOM</h1>
        
        <!-- Container para lista de tarefas -->
        <div id="container-tarefas"></div>
        
        <!-- Container para galeria -->
        <div id="container-galeria"></div>
        
        <!-- Elementos para testes -->
        <div class="exemplo" data-id="123" data-user-name="joao">
            <p>Parágrafo de exemplo</p>
            <img src="exemplo.jpg" alt="Imagem de exemplo">
            <a href="#">Link de exemplo</a>
        </div>
        
        <form>
            <input type="text" name="nome" placeholder="Nome">
            <input type="email" name="email" placeholder="Email">
            <select name="opcoes">
                <option value="opcao1">Opção 1</option>
                <option value="opcao2">Opção 2</option>
                <option value="opcao3">Opção 3</option>
            </select>
            <textarea name="mensagem" placeholder="Mensagem"></textarea>
            <input type="checkbox" name="aceito"> Aceito os termos
            <input type="radio" name="tipo" value="tipo1"> Tipo 1
            <input type="radio" name="tipo" value="tipo2"> Tipo 2
            <button type="submit">Enviar</button>
        </form>
    </div>
    
    <script src="06-manipulacao-dom.js"></script>
</body>
</html>
*/

console.log("\n=== ARQUIVO 06: MANIPULAÇÃO DO DOM CONCLUÍDO ===");
console.log("Próximo: 07-eventos.js");
console.log("\nNOTA: Para testar os exemplos, crie um arquivo HTML com a estrutura fornecida no final deste arquivo.");