/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 4.4
DESTRUCTURING E SPREAD OPERATOR
==============================================

Objetivos de Aprendizagem:
- Dominar destructuring de objetos e arrays
- Usar spread operator (...) eficientemente
- Implementar rest parameters em funções
- Aplicar destructuring em parâmetros de função
- Usar destructuring aninhado e com valores padrão
- Combinar destructuring com outras funcionalidades ES6+
- Entender performance e casos de uso
- Aplicar em cenários reais de desenvolvimento

⏱️ TEMPO ESTIMADO: 70 minutos
📊 NÍVEL: Intermediário
==============================================
*/

// ==========================================
// 📚 1. TEORIA: DESTRUCTURING E SPREAD
// ==========================================

/*
DESTRUCTURING ASSIGNMENT:
O destructuring é uma sintaxe que permite extrair valores de arrays ou
propriedades de objetos em variáveis distintas de forma mais concisa.

CONCEITOS FUNDAMENTAIS:
1. Object Destructuring - extração de propriedades de objetos
2. Array Destructuring - extração de elementos de arrays
3. Nested Destructuring - destructuring aninhado
4. Default Values - valores padrão
5. Rest Pattern - captura elementos restantes
6. Spread Operator - expansão de elementos
7. Parameter Destructuring - destructuring em parâmetros

VANTAGENS DO DESTRUCTURING:
- Código mais limpo e legível
- Menos repetição de código
- Extração seletiva de dados
- Facilita trabalho com APIs
- Melhora manutenibilidade
- Suporte nativo no JavaScript moderno

SPREAD OPERATOR (...):
O spread operator permite expandir elementos de arrays, objetos ou
strings em locais onde múltiplos elementos são esperados.

USOS DO SPREAD:
- Clonar arrays e objetos
- Combinar arrays e objetos
- Passar argumentos para funções
- Converter strings em arrays
- Criar cópias superficiais

REST PARAMETERS:
O rest parameter permite representar um número indefinido de argumentos
como um array, usando a mesma sintaxe do spread (...).

DIFERENÇAS:
- Spread: expande elementos
- Rest: coleta elementos em um array
- Destructuring: extrai valores específicos
*/

console.log('=== DESTRUCTURING E SPREAD OPERATOR ===');

// ==========================================
// 💡 2. EXEMPLOS PRÁTICOS
// ==========================================

// ========== DESTRUCTURING DE OBJETOS ==========
console.log('\n--- DESTRUCTURING DE OBJETOS ---');

// Objeto de exemplo
const usuario = {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana@email.com',
    idade: 28,
    endereco: {
        rua: 'Rua das Flores, 123',
        cidade: 'São Paulo',
        cep: '01234-567',
        coordenadas: {
            lat: -23.5505,
            lng: -46.6333
        }
    },
    hobbies: ['leitura', 'cinema', 'viagem'],
    configuracoes: {
        tema: 'escuro',
        notificacoes: true,
        idioma: 'pt-BR'
    }
};

// Destructuring básico
console.log('\n🔍 Destructuring básico:');
const { nome, email, idade } = usuario;
console.log('Nome:', nome);
console.log('Email:', email);
console.log('Idade:', idade);

// Renomeando variáveis
console.log('\n🏷️ Renomeando variáveis:');
const { nome: nomeCompleto, email: enderecoEmail } = usuario;
console.log('Nome completo:', nomeCompleto);
console.log('Endereço de email:', enderecoEmail);

// Valores padrão
console.log('\n⚙️ Valores padrão:');
const { telefone = 'Não informado', profissao = 'Não especificada' } = usuario;
console.log('Telefone:', telefone);
console.log('Profissão:', profissao);

// Combinando renomeação e valores padrão
console.log('\n🔄 Renomeação + valores padrão:');
const { 
    telefone: numeroTelefone = '(11) 99999-9999', 
    profissao: areaProfissional = 'Tecnologia' 
} = usuario;
console.log('Número de telefone:', numeroTelefone);
console.log('Área profissional:', areaProfissional);

// Destructuring aninhado
console.log('\n🏠 Destructuring aninhado:');
const { 
    endereco: { 
        rua, 
        cidade, 
        coordenadas: { lat, lng } 
    },
    configuracoes: { 
        tema, 
        notificacoes 
    }
} = usuario;

console.log('Rua:', rua);
console.log('Cidade:', cidade);
console.log('Coordenadas:', { lat, lng });
console.log('Tema:', tema);
console.log('Notificações:', notificacoes);

// Destructuring com rest
console.log('\n📦 Destructuring com rest:');
const { id, nome: nomeUsuario, ...outrosDados } = usuario;
console.log('ID:', id);
console.log('Nome:', nomeUsuario);
console.log('Outros dados:', outrosDados);

// ========== DESTRUCTURING DE ARRAYS ==========
console.log('\n--- DESTRUCTURING DE ARRAYS ---');

const cores = ['vermelho', 'verde', 'azul', 'amarelo', 'roxo'];
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const coordenadas = [40.7128, -74.0060]; // Nova York

// Destructuring básico de array
console.log('\n🎨 Destructuring básico de array:');
const [primeiraCor, segundaCor, terceiraCor] = cores;
console.log('Primeira cor:', primeiraCor);
console.log('Segunda cor:', segundaCor);
console.log('Terceira cor:', terceiraCor);

// Pulando elementos
console.log('\n⏭️ Pulando elementos:');
const [, , corAzul, , corRoxa] = cores;
console.log('Cor azul:', corAzul);
console.log('Cor roxa:', corRoxa);

// Valores padrão em arrays
console.log('\n⚙️ Valores padrão em arrays:');
const [a, b, c, d, e, f = 'padrão'] = numeros.slice(0, 5);
console.log('Valores:', { a, b, c, d, e, f });

// Rest em arrays
console.log('\n📦 Rest em arrays:');
const [primeiro, segundo, ...resto] = numeros;
console.log('Primeiro:', primeiro);
console.log('Segundo:', segundo);
console.log('Resto:', resto);

// Swapping (troca) de variáveis
console.log('\n🔄 Swapping de variáveis:');
let x = 10;
let y = 20;
console.log('Antes - x:', x, 'y:', y);
[x, y] = [y, x];
console.log('Depois - x:', x, 'y:', y);

// Destructuring de coordenadas
console.log('\n🗺️ Destructuring de coordenadas:');
const [latitude, longitude] = coordenadas;
console.log('Latitude:', latitude);
console.log('Longitude:', longitude);

// ========== SPREAD OPERATOR ==========
console.log('\n--- SPREAD OPERATOR ---');

// Spread com arrays
console.log('\n📋 Spread com arrays:');
const frutas = ['maçã', 'banana', 'laranja'];
const vegetais = ['cenoura', 'brócolis', 'espinafre'];
const alimentos = [...frutas, ...vegetais];
console.log('Frutas:', frutas);
console.log('Vegetais:', vegetais);
console.log('Alimentos combinados:', alimentos);

// Adicionando elementos com spread
console.log('\n➕ Adicionando elementos com spread:');
const novasFrutas = ['uva', ...frutas, 'pêra'];
console.log('Novas frutas:', novasFrutas);

// Clonando arrays
console.log('\n📄 Clonando arrays:');
const coresOriginais = ['vermelho', 'verde', 'azul'];
const coresCopia = [...coresOriginais];
coresCopia.push('amarelo');
console.log('Cores originais:', coresOriginais);
console.log('Cores cópia:', coresCopia);

// Spread com objetos
console.log('\n🏷️ Spread com objetos:');
const dadosBasicos = {
    nome: 'João Santos',
    idade: 30
};

const dadosContato = {
    email: 'joao@email.com',
    telefone: '(11) 99999-9999'
};

const dadosCompletos = {
    ...dadosBasicos,
    ...dadosContato,
    cidade: 'Rio de Janeiro'
};

console.log('Dados básicos:', dadosBasicos);
console.log('Dados de contato:', dadosContato);
console.log('Dados completos:', dadosCompletos);

// Sobrescrevendo propriedades
console.log('\n🔄 Sobrescrevendo propriedades:');
const configuracaoBase = {
    tema: 'claro',
    idioma: 'en',
    notificacoes: true
};

const configuracaoUsuario = {
    ...configuracaoBase,
    tema: 'escuro', // Sobrescreve
    fonte: 'grande' // Adiciona
};

console.log('Configuração base:', configuracaoBase);
console.log('Configuração do usuário:', configuracaoUsuario);

// Clonando objetos (shallow copy)
console.log('\n📄 Clonando objetos:');
const pessoaOriginal = {
    nome: 'Maria',
    idade: 25,
    hobbies: ['leitura', 'natação']
};

const pessoaCopia = { ...pessoaOriginal };
pessoaCopia.idade = 26;
pessoaCopia.hobbies.push('culinária'); // Atenção: modifica o array original!

console.log('Pessoa original:', pessoaOriginal);
console.log('Pessoa cópia:', pessoaCopia);

// ========== DESTRUCTURING EM PARÂMETROS ==========
console.log('\n--- DESTRUCTURING EM PARÂMETROS ---');

// Função com destructuring de objeto
function exibirPerfil({ nome, idade, email, cidade = 'Não informada' }) {
    console.log(`\n👤 Perfil do usuário:`);
    console.log(`Nome: ${nome}`);
    console.log(`Idade: ${idade} anos`);
    console.log(`Email: ${email}`);
    console.log(`Cidade: ${cidade}`);
}

// Função com destructuring aninhado
function calcularDistancia({ origem: { lat: lat1, lng: lng1 }, destino: { lat: lat2, lng: lng2 } }) {
    // Fórmula simplificada de distância
    const deltaLat = lat2 - lat1;
    const deltaLng = lng2 - lng1;
    const distancia = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng);
    
    console.log(`\n📏 Distância calculada: ${distancia.toFixed(4)} unidades`);
    return distancia;
}

// Função com destructuring de array
function processarCoordenadas([lat, lng, altitude = 0]) {
    console.log(`\n🗺️ Processando coordenadas:`);
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lng}`);
    console.log(`Altitude: ${altitude}m`);
    
    return {
        latitude: lat,
        longitude: lng,
        altitude,
        valida: lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180
    };
}

// Função com rest parameters
function calcularMedia(primeiro, segundo, ...outrosNumeros) {
    const todosNumeros = [primeiro, segundo, ...outrosNumeros];
    const soma = todosNumeros.reduce((acc, num) => acc + num, 0);
    const media = soma / todosNumeros.length;
    
    console.log(`\n🧮 Calculando média de ${todosNumeros.length} números:`);
    console.log(`Números: ${todosNumeros.join(', ')}`);
    console.log(`Soma: ${soma}`);
    console.log(`Média: ${media.toFixed(2)}`);
    
    return media;
}

// Testando funções
console.log('\n🧪 Testando funções com destructuring:');

const perfilUsuario = {
    nome: 'Carlos Oliveira',
    idade: 35,
    email: 'carlos@email.com'
};

exibirPerfil(perfilUsuario);

const viagem = {
    origem: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    destino: { lat: -22.9068, lng: -43.1729 }  // Rio de Janeiro
};

calcularDistancia(viagem);

const coordenadasGPS = [-23.5505, -46.6333, 760];
const resultado = processarCoordenadas(coordenadasGPS);
console.log('Resultado do processamento:', resultado);

calcularMedia(10, 20, 30, 40, 50);

// ========== CASOS AVANÇADOS ==========
console.log('\n--- CASOS AVANÇADOS ---');

// Destructuring com computed property names
console.log('\n🔧 Destructuring com computed properties:');
const propriedade = 'email';
const { [propriedade]: valorEmail } = usuario;
console.log(`Valor da propriedade '${propriedade}':`, valorEmail);

// Destructuring em loops
console.log('\n🔄 Destructuring em loops:');
const pessoas = [
    { nome: 'Ana', idade: 28, cidade: 'São Paulo' },
    { nome: 'Bruno', idade: 32, cidade: 'Rio de Janeiro' },
    { nome: 'Carla', idade: 25, cidade: 'Belo Horizonte' }
];

console.log('Informações das pessoas:');
for (const { nome, idade, cidade } of pessoas) {
    console.log(`${nome}, ${idade} anos, mora em ${cidade}`);
}

// Destructuring com Map
console.log('\n🗺️ Destructuring com Map:');
const configuracoes = new Map([
    ['tema', 'escuro'],
    ['idioma', 'pt-BR'],
    ['notificacoes', true]
]);

for (const [chave, valor] of configuracoes) {
    console.log(`${chave}: ${valor}`);
}

// Destructuring condicional
console.log('\n❓ Destructuring condicional:');
function processarDados(dados) {
    if (dados && typeof dados === 'object') {
        const { nome = 'Anônimo', idade = 0 } = dados;
        console.log(`Processando: ${nome}, ${idade} anos`);
    } else {
        console.log('Dados inválidos');
    }
}

processarDados({ nome: 'Pedro', idade: 30 });
processarDados(null);
processarDados({ nome: 'Maria' });

// ========== SPREAD EM FUNÇÕES ==========
console.log('\n--- SPREAD EM FUNÇÕES ---');

// Função que aceita múltiplos argumentos
function somar(...numeros) {
    const soma = numeros.reduce((acc, num) => acc + num, 0);
    console.log(`\n➕ Somando ${numeros.length} números: ${numeros.join(' + ')} = ${soma}`);
    return soma;
}

// Usando spread para passar argumentos
const numerosArray = [1, 2, 3, 4, 5];
console.log('\n📊 Usando spread para passar argumentos:');
somar(...numerosArray);
somar(10, 20, 30);
somar(...[100, 200], 300, ...numerosArray);

// Função Math.max com spread
console.log('\n📈 Math.max com spread:');
const valores = [45, 23, 67, 12, 89, 34];
const maximo = Math.max(...valores);
const minimo = Math.min(...valores);
console.log('Valores:', valores);
console.log('Máximo:', maximo);
console.log('Mínimo:', minimo);

// Convertendo string em array
console.log('\n🔤 Convertendo string em array:');
const palavra = 'JavaScript';
const letras = [...palavra];
console.log('Palavra:', palavra);
console.log('Letras:', letras);
console.log('Primeira letra:', letras[0]);
console.log('Última letra:', letras[letras.length - 1]);

// ==========================================
// 🎯 3. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

// EXERCÍCIO 1: Sistema de Configuração
console.log('\n--- EXERCÍCIO 1: SISTEMA DE CONFIGURAÇÃO ---');

class SistemaConfiguracao {
    constructor() {
        this.configuracaoPadrao = {
            tema: 'claro',
            idioma: 'pt-BR',
            notificacoes: {
                email: true,
                push: false,
                sms: false
            },
            interface: {
                sidebar: true,
                toolbar: true,
                footer: false
            },
            performance: {
                cache: true,
                compressao: false,
                lazy: true
            }
        };
        
        this.configuracaoAtual = { ...this.configuracaoPadrao };
    }
    
    // Atualizar configuração usando destructuring e spread
    atualizarConfiguracao(novasConfiguracoes) {
        // Merge profundo usando spread
        this.configuracaoAtual = {
            ...this.configuracaoAtual,
            ...novasConfiguracoes,
            notificacoes: {
                ...this.configuracaoAtual.notificacoes,
                ...(novasConfiguracoes.notificacoes || {})
            },
            interface: {
                ...this.configuracaoAtual.interface,
                ...(novasConfiguracoes.interface || {})
            },
            performance: {
                ...this.configuracaoAtual.performance,
                ...(novasConfiguracoes.performance || {})
            }
        };
        
        console.log('✅ Configuração atualizada');
        return this;
    }
    
    // Obter configuração específica usando destructuring
    obterConfiguracao(secao) {
        const {
            tema,
            idioma,
            notificacoes,
            interface: interfaceConfig,
            performance
        } = this.configuracaoAtual;
        
        switch (secao) {
            case 'tema':
                return { tema, idioma };
            case 'notificacoes':
                return notificacoes;
            case 'interface':
                return interfaceConfig;
            case 'performance':
                return performance;
            default:
                return this.configuracaoAtual;
        }
    }
    
    // Resetar configuração para padrão
    resetarConfiguracao(...secoes) {
        if (secoes.length === 0) {
            // Reset completo
            this.configuracaoAtual = { ...this.configuracaoPadrao };
            console.log('🔄 Todas as configurações resetadas');
        } else {
            // Reset seletivo
            for (const secao of secoes) {
                if (this.configuracaoPadrao[secao]) {
                    this.configuracaoAtual[secao] = { ...this.configuracaoPadrao[secao] };
                    console.log(`🔄 Seção '${secao}' resetada`);
                }
            }
        }
        
        return this;
    }
    
    // Exportar configuração
    exportarConfiguracao() {
        const {
            tema,
            idioma,
            notificacoes: { email, push, sms },
            interface: { sidebar, toolbar, footer },
            performance: { cache, compressao, lazy }
        } = this.configuracaoAtual;
        
        return {
            basico: { tema, idioma },
            notificacoes: { email, push, sms },
            interface: { sidebar, toolbar, footer },
            performance: { cache, compressao, lazy },
            exportadoEm: new Date().toISOString()
        };
    }
    
    // Importar configuração
    importarConfiguracao({ basico, notificacoes, interface: interfaceConfig, performance }) {
        const novaConfiguracao = {
            ...basico,
            notificacoes,
            interface: interfaceConfig,
            performance
        };
        
        this.atualizarConfiguracao(novaConfiguracao);
        console.log('📥 Configuração importada com sucesso');
        return this;
    }
    
    // Comparar configurações
    compararConfiguracoes(outraConfiguracao) {
        const atual = this.configuracaoAtual;
        const diferencas = {};
        
        // Função auxiliar para comparação profunda
        const compararObjetos = (obj1, obj2, caminho = '') => {
            for (const [chave, valor] of Object.entries(obj1)) {
                const caminhoCompleto = caminho ? `${caminho}.${chave}` : chave;
                
                if (typeof valor === 'object' && valor !== null) {
                    compararObjetos(valor, obj2[chave] || {}, caminhoCompleto);
                } else if (obj2[chave] !== valor) {
                    diferencas[caminhoCompleto] = {
                        atual: valor,
                        comparacao: obj2[chave]
                    };
                }
            }
        };
        
        compararObjetos(atual, outraConfiguracao);
        
        return {
            temDiferencas: Object.keys(diferencas).length > 0,
            diferencas,
            totalDiferencas: Object.keys(diferencas).length
        };
    }
}

// Testando sistema de configuração
console.log('\n⚙️ Testando sistema de configuração:');

const sistema = new SistemaConfiguracao();

// Atualizando configurações
sistema.atualizarConfiguracao({
    tema: 'escuro',
    notificacoes: {
        email: false,
        push: true
    },
    interface: {
        sidebar: false
    }
});

console.log('\n📋 Configurações por seção:');
console.log('Tema:', sistema.obterConfiguracao('tema'));
console.log('Notificações:', sistema.obterConfiguracao('notificacoes'));
console.log('Interface:', sistema.obterConfiguracao('interface'));

// Exportando e importando
const configExportada = sistema.exportarConfiguracao();
console.log('\n📤 Configuração exportada:', configExportada);

// Criando novo sistema e importando
const novoSistema = new SistemaConfiguracao();
novoSistema.importarConfiguracao(configExportada);

// Comparando configurações
const comparacao = sistema.compararConfiguracoes(novoSistema.configuracaoAtual);
console.log('\n🔍 Comparação de configurações:', comparacao);

// EXERCÍCIO 2: Processador de Dados
console.log('\n--- EXERCÍCIO 2: PROCESSADOR DE DADOS ---');

class ProcessadorDados {
    // Processar array de usuários
    static processarUsuarios(usuarios) {
        console.log('\n👥 Processando usuários:');
        
        const resultados = usuarios.map(({ 
            id, 
            nome, 
            email, 
            idade, 
            endereco: { cidade, estado } = {}, 
            preferencias: { tema = 'claro', idioma = 'pt-BR' } = {} 
        }) => {
            return {
                id,
                nomeCompleto: nome,
                contato: email,
                idade,
                localizacao: cidade && estado ? `${cidade}, ${estado}` : 'Não informado',
                configuracao: { tema, idioma },
                categoria: idade < 18 ? 'menor' : idade < 60 ? 'adulto' : 'idoso'
            };
        });
        
        return resultados;
    }
    
    // Agrupar dados por critério
    static agruparPor(dados, criterio) {
        return dados.reduce((grupos, item) => {
            const chave = item[criterio];
            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(item);
            return grupos;
        }, {});
    }
    
    // Extrair estatísticas
    static extrairEstatisticas(dados) {
        const idades = dados.map(({ idade }) => idade).filter(idade => idade);
        const cidades = dados.map(({ localizacao }) => localizacao).filter(loc => loc !== 'Não informado');
        
        return {
            total: dados.length,
            idadeMedia: idades.length > 0 ? (idades.reduce((a, b) => a + b, 0) / idades.length).toFixed(1) : 0,
            idadeMinima: idades.length > 0 ? Math.min(...idades) : 0,
            idadeMaxima: idades.length > 0 ? Math.max(...idades) : 0,
            cidadesUnicas: [...new Set(cidades)].length,
            distribuicaoCategorias: this.agruparPor(dados, 'categoria')
        };
    }
    
    // Filtrar e transformar dados
    static filtrarETransformar(dados, filtros = {}, transformacoes = {}) {
        let resultado = [...dados];
        
        // Aplicar filtros
        const { 
            idadeMinima, 
            idadeMaxima, 
            categoria, 
            cidade,
            tema 
        } = filtros;
        
        if (idadeMinima) {
            resultado = resultado.filter(({ idade }) => idade >= idadeMinima);
        }
        
        if (idadeMaxima) {
            resultado = resultado.filter(({ idade }) => idade <= idadeMaxima);
        }
        
        if (categoria) {
            resultado = resultado.filter(item => item.categoria === categoria);
        }
        
        if (cidade) {
            resultado = resultado.filter(({ localizacao }) => 
                localizacao.toLowerCase().includes(cidade.toLowerCase())
            );
        }
        
        if (tema) {
            resultado = resultado.filter(({ configuracao: { tema: temaUsuario } }) => 
                temaUsuario === tema
            );
        }
        
        // Aplicar transformações
        const { 
            incluirIdade = true, 
            incluirLocalizacao = true, 
            incluirConfiguracao = true,
            formatoNome = 'completo'
        } = transformacoes;
        
        return resultado.map(item => {
            const { nomeCompleto, idade, localizacao, configuracao, ...resto } = item;
            
            const itemTransformado = { ...resto };
            
            // Transformar nome
            if (formatoNome === 'primeiro') {
                itemTransformado.nome = nomeCompleto.split(' ')[0];
            } else if (formatoNome === 'iniciais') {
                itemTransformado.nome = nomeCompleto
                    .split(' ')
                    .map(parte => parte[0])
                    .join('.');
            } else {
                itemTransformado.nomeCompleto = nomeCompleto;
            }
            
            if (incluirIdade) itemTransformado.idade = idade;
            if (incluirLocalizacao) itemTransformado.localizacao = localizacao;
            if (incluirConfiguracao) itemTransformado.configuracao = configuracao;
            
            return itemTransformado;
        });
    }
    
    // Combinar múltiplos datasets
    static combinarDatasets(...datasets) {
        const [primeiro, ...resto] = datasets;
        
        return resto.reduce((combinado, dataset) => {
            return [...combinado, ...dataset];
        }, [...primeiro]);
    }
}

// Dados de teste
const usuariosRaw = [
    {
        id: 1,
        nome: 'Ana Silva Santos',
        email: 'ana@email.com',
        idade: 28,
        endereco: { cidade: 'São Paulo', estado: 'SP' },
        preferencias: { tema: 'escuro', idioma: 'pt-BR' }
    },
    {
        id: 2,
        nome: 'Bruno Costa',
        email: 'bruno@email.com',
        idade: 35,
        endereco: { cidade: 'Rio de Janeiro', estado: 'RJ' }
    },
    {
        id: 3,
        nome: 'Carla Oliveira',
        email: 'carla@email.com',
        idade: 22,
        endereco: { cidade: 'Belo Horizonte', estado: 'MG' },
        preferencias: { tema: 'claro' }
    },
    {
        id: 4,
        nome: 'Daniel Ferreira',
        email: 'daniel@email.com',
        idade: 45
    },
    {
        id: 5,
        nome: 'Elena Rodriguez',
        email: 'elena@email.com',
        idade: 17,
        endereco: { cidade: 'São Paulo', estado: 'SP' },
        preferencias: { tema: 'escuro', idioma: 'es' }
    }
];

// Testando processador de dados
console.log('\n📊 Testando processador de dados:');

const usuariosProcessados = ProcessadorDados.processarUsuarios(usuariosRaw);
console.log('\n✅ Usuários processados:');
usuariosProcessados.forEach(usuario => {
    console.log(`- ${usuario.nomeCompleto} (${usuario.categoria}): ${usuario.localizacao}`);
});

const estatisticas = ProcessadorDados.extrairEstatisticas(usuariosProcessados);
console.log('\n📈 Estatísticas:', estatisticas);

const adultos = ProcessadorDados.filtrarETransformar(
    usuariosProcessados,
    { categoria: 'adulto' },
    { formatoNome: 'primeiro', incluirConfiguracao: false }
);
console.log('\n👨‍💼 Usuários adultos (nome simplificado):', adultos);

const usuariosSP = ProcessadorDados.filtrarETransformar(
    usuariosProcessados,
    { cidade: 'São Paulo' },
    { formatoNome: 'iniciais' }
);
console.log('\n🏙️ Usuários de São Paulo (iniciais):', usuariosSP);

// ==========================================
// 🎯 4. DICAS DE OTIMIZAÇÃO
// ==========================================

console.log('\n=== DICAS DE OTIMIZAÇÃO ===');

/*
DICAS DE OTIMIZAÇÃO PARA DESTRUCTURING E SPREAD:

1. **Performance do Spread Operator**
   - Spread cria cópias superficiais (shallow copy)
   - Para objetos grandes, considere bibliotecas como Lodash
   - Use Object.assign() para melhor performance em alguns casos
   - Evite spread em loops frequentes

2. **Destructuring Eficiente**
   - Use destructuring apenas para propriedades que você realmente precisa
   - Evite destructuring muito aninhado em código crítico
   - Prefira destructuring em parâmetros para APIs mais claras
   - Use valores padrão para evitar verificações manuais

3. **Rest Parameters vs Arguments**
   - Rest parameters são mais eficientes que o objeto arguments
   - Use rest parameters para funções variádicas
   - Combine com destructuring para APIs flexíveis

4. **Clonagem Profunda vs Superficial**
   - Spread faz apenas cópia superficial
   - Para cópia profunda, use JSON.parse(JSON.stringify()) ou bibliotecas
   - Considere imutabilidade com bibliotecas como Immutable.js

5. **Casos de Uso Otimizados**
   - Use destructuring em imports para tree-shaking
   - Combine com default parameters para APIs robustas
   - Use computed property names com cuidado
   - Prefira destructuring a múltiplas atribuições

6. **Memory Management**
   - Spread pode criar muitos objetos temporários
   - Use WeakMap/WeakSet quando apropriado
   - Considere pooling de objetos em aplicações críticas

7. **Compatibilidade e Transpilação**
   - Destructuring é bem suportado em browsers modernos
   - Babel transpila eficientemente para ES5
   - Use polyfills apenas quando necessário

8. **Debugging e Desenvolvimento**
   - Destructuring pode dificultar debugging
   - Use nomes descritivos em renomeações
   - Considere performance em hot paths
*/

// Exemplo de otimização
console.log('\n⚡ Exemplo de otimização:');

// ❌ Menos eficiente
function processarDadosLento(dados) {
    const resultado = [];
    for (let i = 0; i < dados.length; i++) {
        const item = dados[i];
        resultado.push({
            ...item,
            processado: true,
            timestamp: Date.now()
        });
    }
    return resultado;
}

// ✅ Mais eficiente
function processarDadosRapido(dados) {
    const timestamp = Date.now(); // Calcular uma vez
    return dados.map(item => ({
        ...item,
        processado: true,
        timestamp
    }));
}

// Testando performance
const dadosTeste = Array.from({ length: 1000 }, (_, i) => ({ id: i, valor: Math.random() }));

console.time('Processamento lento');
processarDadosLento(dadosTeste);
console.timeEnd('Processamento lento');

console.time('Processamento rápido');
processarDadosRapido(dadosTeste);
console.timeEnd('Processamento rápido');

// ==========================================
// 📚 5. REFERÊNCIAS E PRÓXIMOS PASSOS
// ==========================================

console.log('\n=== REFERÊNCIAS E PRÓXIMOS PASSOS ===');

/*
REFERÊNCIAS PARA APROFUNDAMENTO:

📖 DOCUMENTAÇÃO OFICIAL:
- MDN Destructuring: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
- MDN Spread Operator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
- MDN Rest Parameters: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters

📚 LIVROS RECOMENDADOS:
- "Understanding ECMAScript 6" - Nicholas C. Zakas
- "Exploring ES6" - Dr. Axel Rauschmayer
- "You Don't Know JS: ES6 & Beyond" - Kyle Simpson

🎯 PRÓXIMOS TÓPICOS DE ESTUDO:
1. Arrays e métodos avançados
2. Programação funcional em JavaScript
3. Immutabilidade e estruturas de dados
4. Padrões de design com ES6+
5. Performance e otimização
6. Metaprogramação com Proxy e Reflect
7. Generators e Iterators
8. Async/Await e Promises

💡 EXERCÍCIOS SUGERIDOS:
1. Implemente um sistema de cache usando destructuring
2. Crie um ORM simples com destructuring e spread
3. Desenvolva um sistema de validação de formulários
4. Implemente um sistema de configuração hierárquica
5. Crie utilitários para manipulação de dados

🔧 FERRAMENTAS ÚTEIS:
- Babel para transpilação
- ESLint para linting
- TypeScript para tipagem
- Lodash para utilitários
- Ramda para programação funcional

⚠️ ARMADILHAS COMUNS:
1. Confundir spread com rest
2. Assumir que spread faz cópia profunda
3. Usar destructuring excessivamente aninhado
4. Não considerar performance em loops
5. Esquecer valores padrão em destructuring
6. Usar computed properties desnecessariamente
7. Não validar dados antes do destructuring
8. Misturar padrões de destructuring inconsistentemente

🎓 CONCEITOS AVANÇADOS:
- Immutable data structures
- Functional programming patterns
- Lens e optics
- Transducers
- Reactive programming
*/

console.log('\n✅ Módulo de Destructuring e Spread concluído!');
console.log('📝 Próximo módulo: 05-Arrays');
console.log('🎯 Continue praticando com os exercícios propostos!');

/*
==============================================
RESUMO DO MÓDULO - DESTRUCTURING E SPREAD
==============================================

✅ CONCEITOS APRENDIDOS:
- Destructuring de objetos e arrays
- Spread operator para expansão
- Rest parameters em funções
- Valores padrão em destructuring
- Destructuring aninhado
- Destructuring em parâmetros
- Clonagem e merge de objetos
- Casos de uso avançados
- Otimizações e performance

🎯 HABILIDADES DESENVOLVIDAS:
- Extrair dados eficientemente
- Criar APIs mais limpas
- Manipular estruturas complexas
- Implementar padrões funcionais
- Otimizar código ES6+
- Trabalhar com dados dinâmicos
- Criar utilitários reutilizáveis

📈 PRÓXIMOS DESAFIOS:
- Arrays e métodos funcionais
- Programação reativa
- Padrões de imutabilidade
- Arquiteturas funcionais
- Performance avançada

==============================================
*/