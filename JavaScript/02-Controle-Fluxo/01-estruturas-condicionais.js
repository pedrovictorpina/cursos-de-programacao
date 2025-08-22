/*
==============================================
CURSO DE JAVASCRIPT - MÓDULO 2.1
ESTRUTURAS CONDICIONAIS
==============================================

Objetivos de Aprendizagem:
- Dominar if/else e suas variações
- Compreender o operador ternário
- Utilizar switch/case eficientemente
- Aplicar operadores lógicos em condições
- Evitar armadilhas comuns em condicionais

==============================================
*/

// ==========================================
// 1. TEORIA: ESTRUTURAS CONDICIONAIS
// ==========================================

/*
ESTRUTURAS CONDICIONAIS permitem que o programa tome decisões
baseadas em condições específicas.

Tipos principais:
1. if/else - Condições simples e múltiplas
2. Operador ternário (? :) - Condições inline
3. switch/case - Múltiplas opções discretas
4. Operadores lógicos - Combinação de condições

Todos avaliam expressões que resultam em valores truthy ou falsy.

Valores FALSY em JavaScript:
- false, 0, -0, 0n, "", null, undefined, NaN

Todos os outros valores são TRUTHY.
*/

// ==========================================
// 2. IF/ELSE - ESTRUTURA BÁSICA
// ==========================================

console.log('=== ESTRUTURAS IF/ELSE ===');

// If simples
const idade = 18;
if (idade >= 18) {
    console.log('Maior de idade');
}

// If/else
const temperatura = 25;
if (temperatura > 30) {
    console.log('Está quente');
} else {
    console.log('Temperatura agradável');
}

// If/else if/else
const nota = 85;
if (nota >= 90) {
    console.log('Excelente!');
} else if (nota >= 80) {
    console.log('Muito bom!');
} else if (nota >= 70) {
    console.log('Bom');
} else if (nota >= 60) {
    console.log('Regular');
} else {
    console.log('Precisa melhorar');
}

// If aninhado
const usuario = {
    logado: true,
    perfil: 'admin',
    ativo: true
};

if (usuario.logado) {
    if (usuario.ativo) {
        if (usuario.perfil === 'admin') {
            console.log('Acesso total liberado');
        } else {
            console.log('Acesso limitado');
        }
    } else {
        console.log('Usuário inativo');
    }
} else {
    console.log('Faça login primeiro');
}

// ==========================================
// 3. OPERADORES DE COMPARAÇÃO
// ==========================================

console.log('\n=== OPERADORES DE COMPARAÇÃO ===');

// Operadores básicos
const a = 10;
const b = "10";
const c = 20;

console.log('--- IGUALDADE ---');
console.log(`${a} == "${b}":`, a == b); // true (com coerção)
console.log(`${a} === "${b}":`, a === b); // false (sem coerção)
console.log(`${a} != "${b}":`, a != b); // false
console.log(`${a} !== "${b}":`, a !== b); // true

console.log('\n--- COMPARAÇÃO NUMÉRICA ---');
console.log(`${a} > ${c}:`, a > c); // false
console.log(`${a} < ${c}:`, a < c); // true
console.log(`${a} >= ${a}:`, a >= a); // true
console.log(`${a} <= ${c}:`, a <= c); // true

// Comparações com diferentes tipos
console.log('\n--- COMPARAÇÕES ESPECIAIS ---');
console.log('null == undefined:', null == undefined); // true
console.log('null === undefined:', null === undefined); // false
console.log('"" == 0:', "" == 0); // true
console.log('false == 0:', false == 0); // true
console.log('true == 1:', true == 1); // true

// ==========================================
// 4. OPERADORES LÓGICOS
// ==========================================

console.log('\n=== OPERADORES LÓGICOS ===');

// AND (&&) - Retorna o primeiro valor falsy ou o último valor
console.log('--- OPERADOR AND (&&) ---');
console.log('true && true:', true && true); // true
console.log('true && false:', true && false); // false
console.log('"hello" && "world":', "hello" && "world"); // "world"
console.log('"hello" && 0:', "hello" && 0); // 0
console.log('0 && "hello":', 0 && "hello"); // 0

// OR (||) - Retorna o primeiro valor truthy ou o último valor
console.log('\n--- OPERADOR OR (||) ---');
console.log('false || true:', false || true); // true
console.log('false || false:', false || false); // false
console.log('"" || "default":', "" || "default"); // "default"
console.log('"value" || "default":', "value" || "default"); // "value"
console.log('null || undefined || "fallback":', null || undefined || "fallback"); // "fallback"

// NOT (!) - Inverte o valor booleano
console.log('\n--- OPERADOR NOT (!) ---');
console.log('!true:', !true); // false
console.log('!false:', !false); // true
console.log('!"hello":', !"hello"); // false
console.log('!"":', !""); // true
console.log('!!"hello":', !!"hello"); // true (conversão para boolean)

// Nullish Coalescing (??) - ES2020
console.log('\n--- NULLISH COALESCING (??) ---');
console.log('null ?? "default":', null ?? "default"); // "default"
console.log('undefined ?? "default":', undefined ?? "default"); // "default"
console.log('"" ?? "default":', "" ?? "default"); // "" (string vazia não é nullish)
console.log('0 ?? "default":', 0 ?? "default"); // 0 (zero não é nullish)

// ==========================================
// 5. OPERADOR TERNÁRIO
// ==========================================

console.log('\n=== OPERADOR TERNÁRIO ===');

// Sintaxe: condição ? valorSeVerdadeiro : valorSeFalso
const idadeUsuario = 20;
const status = idadeUsuario >= 18 ? 'adulto' : 'menor';
console.log(`Usuário é ${status}`);

// Ternário aninhado (use com moderação)
const pontuacao = 95;
const classificacao = pontuacao >= 90 ? 'A' : 
                     pontuacao >= 80 ? 'B' : 
                     pontuacao >= 70 ? 'C' : 
                     pontuacao >= 60 ? 'D' : 'F';
console.log(`Classificação: ${classificacao}`);

// Ternário para atribuição condicional
const tema = 'escuro';
const corFundo = tema === 'escuro' ? '#333' : '#fff';
const corTexto = tema === 'escuro' ? '#fff' : '#333';
console.log(`Fundo: ${corFundo}, Texto: ${corTexto}`);

// ==========================================
// 6. SWITCH/CASE
// ==========================================

console.log('\n=== SWITCH/CASE ===');

// Switch básico
const diaSemana = 3;
let nomeDia;

switch (diaSemana) {
    case 1:
        nomeDia = 'Segunda-feira';
        break;
    case 2:
        nomeDia = 'Terça-feira';
        break;
    case 3:
        nomeDia = 'Quarta-feira';
        break;
    case 4:
        nomeDia = 'Quinta-feira';
        break;
    case 5:
        nomeDia = 'Sexta-feira';
        break;
    case 6:
        nomeDia = 'Sábado';
        break;
    case 7:
        nomeDia = 'Domingo';
        break;
    default:
        nomeDia = 'Dia inválido';
}

console.log(`Dia ${diaSemana}: ${nomeDia}`);

// Switch com fall-through (sem break)
const mes = 2;
let diasNoMes;

switch (mes) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        diasNoMes = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        diasNoMes = 30;
        break;
    case 2:
        diasNoMes = 28; // Simplificado, sem considerar ano bissexto
        break;
    default:
        diasNoMes = 0;
}

console.log(`Mês ${mes} tem ${diasNoMes} dias`);

// Switch com strings
const comando = 'LISTAR';
let acao;

switch (comando.toLowerCase()) {
    case 'criar':
    case 'add':
    case 'novo':
        acao = 'Criando novo item';
        break;
    case 'listar':
    case 'list':
    case 'ver':
        acao = 'Listando itens';
        break;
    case 'editar':
    case 'edit':
    case 'modificar':
        acao = 'Editando item';
        break;
    case 'deletar':
    case 'delete':
    case 'remover':
        acao = 'Removendo item';
        break;
    default:
        acao = 'Comando não reconhecido';
}

console.log(acao);

// ==========================================
// 7. EXERCÍCIOS PRÁTICOS
// ==========================================

console.log('\n=== EXERCÍCIOS PRÁTICOS ===');

/*
EXERCÍCIO 1: SISTEMA DE CLASSIFICAÇÃO DE FILMES
Crie um sistema que classifica filmes baseado em múltiplos critérios:
- Idade do usuário
- Classificação do filme
- Horário atual
- Tipo de usuário (premium/regular)
*/

console.log('\n--- EXERCÍCIO 1: CLASSIFICAÇÃO DE FILMES ---');

class SistemaFilmes {
    static classificarAcesso(dadosUsuario, dadosFilme, horarioAtual) {
        const { idade, tipoConta, temPermissaoParental } = dadosUsuario;
        const { classificacao, genero, duracao } = dadosFilme;
        
        // Verificar idade mínima
        let idadeMinima;
        switch (classificacao) {
            case 'L':
                idadeMinima = 0;
                break;
            case '10':
                idadeMinima = 10;
                break;
            case '12':
                idadeMinima = 12;
                break;
            case '14':
                idadeMinima = 14;
                break;
            case '16':
                idadeMinima = 16;
                break;
            case '18':
                idadeMinima = 18;
                break;
            default:
                return { permitido: false, motivo: 'Classificação inválida' };
        }
        
        // Verificar se pode assistir baseado na idade
        const podeAssistirIdade = idade >= idadeMinima || 
                                 (idade >= 12 && temPermissaoParental && idadeMinima <= 16);
        
        if (!podeAssistirIdade) {
            return {
                permitido: false,
                motivo: `Idade mínima: ${idadeMinima} anos${temPermissaoParental ? ' (mesmo com permissão parental)' : ''}`
            };
        }
        
        // Verificar horário para conteúdo adulto
        const horaAtual = parseInt(horarioAtual.split(':')[0]);
        const isConteudoAdulto = classificacao === '18';
        const isHorarioPermitido = !isConteudoAdulto || (horaAtual >= 23 || horaAtual < 6);
        
        if (!isHorarioPermitido) {
            return {
                permitido: false,
                motivo: 'Conteúdo +18 só disponível entre 23h e 6h'
            };
        }
        
        // Verificar benefícios da conta premium
        const isPremium = tipoConta === 'premium';
        const temAcessoCompleto = isPremium || classificacao !== '18';
        
        if (!temAcessoCompleto) {
            return {
                permitido: false,
                motivo: 'Conteúdo +18 requer conta Premium'
            };
        }
        
        // Calcular qualidade disponível
        let qualidadeMaxima;
        if (isPremium) {
            qualidadeMaxima = '4K';
        } else if (classificacao === 'L' || classificacao === '10') {
            qualidadeMaxima = 'HD';
        } else {
            qualidadeMaxima = 'SD';
        }
        
        // Verificar se pode fazer download
        const podeDownload = isPremium && duracao <= 180; // Máximo 3 horas
        
        return {
            permitido: true,
            qualidadeMaxima,
            podeDownload,
            observacoes: [
                isPremium ? 'Usuário Premium' : 'Usuário Regular',
                `Classificação: ${classificacao}`,
                `Qualidade: ${qualidadeMaxima}`,
                podeDownload ? 'Download disponível' : 'Download não disponível'
            ]
        };
    }
    
    static obterRecomendacao(idade, generosFavoritos, horarioAtual) {
        const hora = parseInt(horarioAtual.split(':')[0]);
        
        // Determinar período do dia
        let periodo;
        if (hora >= 6 && hora < 12) {
            periodo = 'manhã';
        } else if (hora >= 12 && hora < 18) {
            periodo = 'tarde';
        } else if (hora >= 18 && hora < 23) {
            periodo = 'noite';
        } else {
            periodo = 'madrugada';
        }
        
        // Recomendar baseado no período e idade
        let recomendacao;
        
        if (periodo === 'manhã') {
            recomendacao = idade < 12 ? 'Animações e documentários educativos' :
                          idade < 18 ? 'Comédias e aventuras' :
                          'Noticiários e documentários';
        } else if (periodo === 'tarde') {
            recomendacao = generosFavoritos.includes('ação') ? 'Filmes de ação' :
                          generosFavoritos.includes('comédia') ? 'Comédias românticas' :
                          'Dramas familiares';
        } else if (periodo === 'noite') {
            recomendacao = idade >= 18 ? 'Thrillers e suspense' :
                          idade >= 14 ? 'Ficção científica' :
                          'Aventuras fantásticas';
        } else { // madrugada
            recomendacao = idade >= 18 ? 'Terror e ação intensa' :
                          'Conteúdo não recomendado neste horário';
        }
        
        return {
            periodo,
            recomendacao,
            horario: horarioAtual
        };
    }
}

// Testando o sistema
const usuarios = [
    { idade: 8, tipoConta: 'regular', temPermissaoParental: true },
    { idade: 15, tipoConta: 'premium', temPermissaoParental: false },
    { idade: 25, tipoConta: 'regular', temPermissaoParental: false },
    { idade: 30, tipoConta: 'premium', temPermissaoParental: false }
];

const filmes = [
    { classificacao: 'L', genero: 'animação', duracao: 90 },
    { classificacao: '14', genero: 'aventura', duracao: 120 },
    { classificacao: '18', genero: 'terror', duracao: 150 }
];

const horarios = ['09:00', '15:00', '21:00', '01:00'];

usuarios.forEach((usuario, i) => {
    console.log(`\n👤 Usuário ${i + 1} (${usuario.idade} anos, ${usuario.tipoConta}):`);
    
    filmes.forEach((filme, j) => {
        const resultado = SistemaFilmes.classificarAcesso(usuario, filme, horarios[i] || '21:00');
        console.log(`  🎬 Filme ${j + 1} (${filme.classificacao}): ${resultado.permitido ? '✅' : '❌'} ${resultado.motivo || resultado.observacoes?.join(', ')}`);
    });
    
    const recomendacao = SistemaFilmes.obterRecomendacao(
        usuario.idade, 
        ['ação', 'comédia'], 
        horarios[i] || '21:00'
    );
    console.log(`  💡 Recomendação (${recomendacao.periodo}): ${recomendacao.recomendacao}`);
});

/*
EXERCÍCIO 2: CALCULADORA DE DESCONTO INTELIGENTE
Crie um sistema que calcula descontos baseado em múltiplas condições:
- Valor da compra
- Tipo de cliente
- Dia da semana
- Produtos no carrinho
- Histórico de compras
*/

console.log('\n--- EXERCÍCIO 2: CALCULADORA DE DESCONTO ---');

class CalculadoraDesconto {
    static calcularDesconto(dadosCompra) {
        const {
            valorTotal,
            tipoCliente, // 'novo', 'regular', 'vip', 'premium'
            diaSemana, // 0-6 (domingo-sábado)
            produtos,
            historicoCompras,
            temCupom,
            valorCupom = 0
        } = dadosCompra;
        
        let descontoPercentual = 0;
        let descontoFixo = 0;
        let motivosDesconto = [];
        
        // Desconto por tipo de cliente
        switch (tipoCliente) {
            case 'novo':
                if (valorTotal >= 100) {
                    descontoPercentual += 15;
                    motivosDesconto.push('Cliente novo: 15%');
                } else {
                    descontoPercentual += 10;
                    motivosDesconto.push('Cliente novo: 10%');
                }
                break;
            case 'regular':
                descontoPercentual += 5;
                motivosDesconto.push('Cliente regular: 5%');
                break;
            case 'vip':
                descontoPercentual += 10;
                motivosDesconto.push('Cliente VIP: 10%');
                break;
            case 'premium':
                descontoPercentual += 20;
                motivosDesconto.push('Cliente Premium: 20%');
                break;
        }
        
        // Desconto por valor da compra
        if (valorTotal >= 500) {
            descontoPercentual += 10;
            motivosDesconto.push('Compra acima de R$ 500: +10%');
        } else if (valorTotal >= 200) {
            descontoPercentual += 5;
            motivosDesconto.push('Compra acima de R$ 200: +5%');
        }
        
        // Desconto por dia da semana
        const isSegunda = diaSemana === 1;
        const isFimSemana = diaSemana === 0 || diaSemana === 6;
        
        if (isSegunda) {
            descontoPercentual += 5;
            motivosDesconto.push('Segunda-feira: +5%');
        } else if (isFimSemana && tipoCliente !== 'novo') {
            descontoPercentual += 3;
            motivosDesconto.push('Fim de semana: +3%');
        }
        
        // Desconto por quantidade de produtos
        const quantidadeProdutos = produtos.length;
        if (quantidadeProdutos >= 10) {
            descontoPercentual += 8;
            motivosDesconto.push('10+ produtos: +8%');
        } else if (quantidadeProdutos >= 5) {
            descontoPercentual += 5;
            motivosDesconto.push('5+ produtos: +5%');
        }
        
        // Desconto por categoria de produtos
        const categorias = produtos.map(p => p.categoria);
        const temEletronicos = categorias.includes('eletrônicos');
        const temLivros = categorias.includes('livros');
        const temRoupas = categorias.includes('roupas');
        
        if (temEletronicos && valorTotal >= 1000) {
            descontoFixo += 50;
            motivosDesconto.push('Eletrônicos acima de R$ 1000: -R$ 50');
        }
        
        if (temLivros && quantidadeProdutos >= 3) {
            descontoPercentual += 10;
            motivosDesconto.push('3+ livros: +10%');
        }
        
        if (temRoupas && isFimSemana) {
            descontoPercentual += 15;
            motivosDesconto.push('Roupas no fim de semana: +15%');
        }
        
        // Desconto por histórico
        const comprasAnteriores = historicoCompras.length;
        const valorTotalHistorico = historicoCompras.reduce((sum, compra) => sum + compra.valor, 0);
        
        if (comprasAnteriores >= 10 && valorTotalHistorico >= 2000) {
            descontoPercentual += 15;
            motivosDesconto.push('Cliente fiel (10+ compras, R$ 2000+): +15%');
        } else if (comprasAnteriores >= 5) {
            descontoPercentual += 8;
            motivosDesconto.push('Cliente recorrente (5+ compras): +8%');
        }
        
        // Aplicar cupom
        if (temCupom && valorCupom > 0) {
            descontoFixo += valorCupom;
            motivosDesconto.push(`Cupom: -R$ ${valorCupom}`);
        }
        
        // Limitar desconto máximo
        const descontoMaximo = tipoCliente === 'premium' ? 50 : 
                              tipoCliente === 'vip' ? 40 : 
                              tipoCliente === 'regular' ? 30 : 25;
        
        if (descontoPercentual > descontoMaximo) {
            descontoPercentual = descontoMaximo;
            motivosDesconto.push(`Limitado ao máximo de ${descontoMaximo}%`);
        }
        
        // Calcular valores finais
        const valorDescontoPercentual = (valorTotal * descontoPercentual) / 100;
        const descontoTotal = valorDescontoPercentual + descontoFixo;
        const valorFinal = Math.max(0, valorTotal - descontoTotal);
        const economiaPercentual = ((descontoTotal / valorTotal) * 100).toFixed(1);
        
        return {
            valorOriginal: valorTotal,
            descontoPercentual,
            descontoFixo,
            descontoTotal: descontoTotal.toFixed(2),
            valorFinal: valorFinal.toFixed(2),
            economiaPercentual: `${economiaPercentual}%`,
            motivosDesconto
        };
    }
}

// Testando a calculadora
const comprasExemplo = [
    {
        valorTotal: 150,
        tipoCliente: 'novo',
        diaSemana: 1, // Segunda
        produtos: [
            { categoria: 'livros', preco: 50 },
            { categoria: 'livros', preco: 40 },
            { categoria: 'livros', preco: 60 }
        ],
        historicoCompras: [],
        temCupom: true,
        valorCupom: 20
    },
    {
        valorTotal: 1200,
        tipoCliente: 'premium',
        diaSemana: 6, // Sábado
        produtos: [
            { categoria: 'eletrônicos', preco: 800 },
            { categoria: 'eletrônicos', preco: 400 }
        ],
        historicoCompras: Array(12).fill({ valor: 200 }),
        temCupom: false
    },
    {
        valorTotal: 300,
        tipoCliente: 'vip',
        diaSemana: 0, // Domingo
        produtos: Array(8).fill({ categoria: 'roupas', preco: 37.5 }),
        historicoCompras: Array(6).fill({ valor: 150 }),
        temCupom: true,
        valorCupom: 30
    }
];

comprasExemplo.forEach((compra, i) => {
    console.log(`\n🛒 Compra ${i + 1}:`);
    const resultado = CalculadoraDesconto.calcularDesconto(compra);
    
    console.log(`  💰 Valor original: R$ ${resultado.valorOriginal}`);
    console.log(`  🎯 Desconto total: R$ ${resultado.descontoTotal} (${resultado.economiaPercentual})`);
    console.log(`  💳 Valor final: R$ ${resultado.valorFinal}`);
    console.log(`  📋 Motivos:`);
    resultado.motivosDesconto.forEach(motivo => {
        console.log(`    • ${motivo}`);
    });
});

/*
EXERCÍCIO 3: SISTEMA DE ROTEAMENTO INTELIGENTE
Crie um sistema que determina rotas baseado em condições múltiplas:
- Tipo de usuário
- Permissões
- Horário de acesso
- Localização
- Dispositivo
*/

console.log('\n--- EXERCÍCIO 3: SISTEMA DE ROTEAMENTO ---');

class SistemaRoteamento {
    static definirRota(dadosAcesso) {
        const {
            usuario,
            rotaSolicitada,
            horarioAcesso,
            localizacao,
            dispositivo,
            ip
        } = dadosAcesso;
        
        const { tipo, permissoes, ativo, ultimoLogin } = usuario;
        
        // Verificar se usuário está ativo
        if (!ativo) {
            return {
                rota: '/conta-suspensa',
                motivo: 'Conta suspensa',
                acesso: 'negado'
            };
        }
        
        // Verificar horário de funcionamento para certas rotas
        const hora = parseInt(horarioAcesso.split(':')[0]);
        const isHorarioComercial = hora >= 8 && hora <= 18;
        const rotasComerciais = ['/admin', '/relatorios', '/financeiro'];
        
        if (rotasComerciais.some(rota => rotaSolicitada.startsWith(rota)) && !isHorarioComercial) {
            if (tipo !== 'admin' && tipo !== 'gerente') {
                return {
                    rota: '/acesso-restrito',
                    motivo: 'Acesso fora do horário comercial',
                    acesso: 'negado',
                    sugestao: 'Tente novamente entre 8h e 18h'
                };
            }
        }
        
        // Verificar localização para rotas sensíveis
        const rotasSensiveis = ['/admin', '/configuracoes', '/usuarios'];
        const localizacoesPermitidas = ['escritorio', 'casa', 'vpn'];
        
        if (rotasSensiveis.some(rota => rotaSolicitada.startsWith(rota))) {
            if (!localizacoesPermitidas.includes(localizacao) && tipo !== 'admin') {
                return {
                    rota: '/acesso-negado',
                    motivo: 'Localização não autorizada para esta rota',
                    acesso: 'negado',
                    sugestao: 'Use VPN corporativa ou acesse do escritório'
                };
            }
        }
        
        // Verificar dispositivo para rotas administrativas
        const rotasAdmin = ['/admin'];
        const dispositivosSegurosPara Admin = ['desktop', 'laptop'];
        
        if (rotasAdmin.some(rota => rotaSolicitada.startsWith(rota))) {
            if (!dispositivosSegurosPara Admin.includes(dispositivo)) {
                return {
                    rota: '/admin-mobile-restrito',
                    motivo: 'Acesso administrativo limitado em dispositivos móveis',
                    acesso: 'limitado',
                    funcionalidades: ['visualizar', 'aprovar']
                };
            }
        }
        
        // Roteamento baseado no tipo de usuário
        let rotaFinal;
        let acessoPermitido = true;
        let funcionalidadesDisponiveis = [];
        
        switch (tipo) {
            case 'visitante':
                const rotasPublicas = ['/', '/sobre', '/contato', '/produtos', '/login'];
                if (!rotasPublicas.includes(rotaSolicitada)) {
                    rotaFinal = '/login';
                    acessoPermitido = false;
                } else {
                    rotaFinal = rotaSolicitada;
                    funcionalidadesDisponiveis = ['visualizar', 'contatar'];
                }
                break;
                
            case 'cliente':
                const rotasCliente = ['/', '/perfil', '/pedidos', '/suporte', '/produtos'];
                if (rotasCliente.some(rota => rotaSolicitada.startsWith(rota))) {
                    rotaFinal = rotaSolicitada;
                    funcionalidadesDisponiveis = ['visualizar', 'comprar', 'avaliar', 'suporte'];
                } else {
                    rotaFinal = '/acesso-negado';
                    acessoPermitido = false;
                }
                break;
                
            case 'funcionario':
                const rotasFuncionario = ['/', '/dashboard', '/clientes', '/produtos', '/vendas'];
                if (rotasFuncionario.some(rota => rotaSolicitada.startsWith(rota))) {
                    rotaFinal = rotaSolicitada;
                    funcionalidadesDisponiveis = ['visualizar', 'editar', 'criar', 'relatorios'];
                } else if (permissoes.includes('admin_temp')) {
                    rotaFinal = rotaSolicitada;
                    funcionalidadesDisponiveis = ['visualizar'];
                } else {
                    rotaFinal = '/acesso-negado';
                    acessoPermitido = false;
                }
                break;
                
            case 'gerente':
                const rotasGerente = ['/', '/dashboard', '/relatorios', '/funcionarios', '/configuracoes'];
                if (rotasGerente.some(rota => rotaSolicitada.startsWith(rota))) {
                    rotaFinal = rotaSolicitada;
                    funcionalidadesDisponiveis = ['visualizar', 'editar', 'criar', 'deletar', 'relatorios', 'aprovar'];
                } else {
                    rotaFinal = rotaSolicitada; // Gerente tem acesso amplo
                    funcionalidadesDisponiveis = ['visualizar', 'editar'];
                }
                break;
                
            case 'admin':
                rotaFinal = rotaSolicitada; // Admin tem acesso total
                funcionalidadesDisponiveis = ['todas'];
                break;
                
            default:
                rotaFinal = '/erro';
                acessoPermitido = false;
        }
        
        // Verificar permissões específicas
        const permissoesEspeciais = {
            '/financeiro': ['financeiro', 'admin'],
            '/usuarios': ['usuarios', 'admin'],
            '/logs': ['logs', 'admin'],
            '/backup': ['backup', 'admin']
        };
        
        for (const [rota, permissoesNecessarias] of Object.entries(permissoesEspeciais)) {
            if (rotaSolicitada.startsWith(rota)) {
                const temPermissao = permissoesNecessarias.some(perm => 
                    permissoes.includes(perm) || tipo === 'admin'
                );
                
                if (!temPermissao) {
                    rotaFinal = '/sem-permissao';
                    acessoPermitido = false;
                    break;
                }
            }
        }
        
        // Verificar primeiro acesso
        const isPrimeiroAcesso = !ultimoLogin;
        if (isPrimeiroAcesso && tipo !== 'visitante') {
            rotaFinal = '/primeiro-acesso';
        }
        
        return {
            rota: rotaFinal,
            acesso: acessoPermitido ? 'permitido' : 'negado',
            funcionalidades: funcionalidadesDisponiveis,
            usuario: tipo,
            horario: horarioAcesso,
            dispositivo,
            observacoes: [
                `Usuário: ${tipo}`,
                `Horário: ${horarioAcesso}`,
                `Dispositivo: ${dispositivo}`,
                `Localização: ${localizacao}`,
                isPrimeiroAcesso ? 'Primeiro acesso' : 'Usuário recorrente'
            ]
        };
    }
}

// Testando o sistema de roteamento
const acessosExemplo = [
    {
        usuario: { tipo: 'cliente', permissoes: [], ativo: true, ultimoLogin: '2023-01-01' },
        rotaSolicitada: '/pedidos',
        horarioAcesso: '14:30',
        localizacao: 'casa',
        dispositivo: 'mobile',
        ip: '192.168.1.1'
    },
    {
        usuario: { tipo: 'funcionario', permissoes: ['vendas'], ativo: true, ultimoLogin: null },
        rotaSolicitada: '/admin',
        horarioAcesso: '22:00',
        localizacao: 'casa',
        dispositivo: 'laptop',
        ip: '10.0.0.1'
    },
    {
        usuario: { tipo: 'gerente', permissoes: ['relatorios', 'funcionarios'], ativo: true, ultimoLogin: '2023-12-01' },
        rotaSolicitada: '/financeiro',
        horarioAcesso: '09:00',
        localizacao: 'escritorio',
        dispositivo: 'desktop',
        ip: '192.168.100.50'
    },
    {
        usuario: { tipo: 'admin', permissoes: ['todas'], ativo: true, ultimoLogin: '2023-12-15' },
        rotaSolicitada: '/logs',
        horarioAcesso: '03:00',
        localizacao: 'vpn',
        dispositivo: 'laptop',
        ip: '172.16.0.1'
    }
];

acessosExemplo.forEach((acesso, i) => {
    console.log(`\n🔐 Acesso ${i + 1}:`);
    const resultado = SistemaRoteamento.definirRota(acesso);
    
    console.log(`  🎯 Rota solicitada: ${acesso.rotaSolicitada}`);
    console.log(`  ➡️  Rota final: ${resultado.rota}`);
    console.log(`  🚦 Status: ${resultado.acesso === 'permitido' ? '✅' : '❌'} ${resultado.acesso}`);
    
    if (resultado.funcionalidades?.length > 0) {
        console.log(`  ⚙️  Funcionalidades: ${resultado.funcionalidades.join(', ')}`);
    }
    
    if (resultado.motivo) {
        console.log(`  ❗ Motivo: ${resultado.motivo}`);
    }
    
    if (resultado.sugestao) {
        console.log(`  💡 Sugestão: ${resultado.sugestao}`);
    }
    
    console.log(`  📋 Observações: ${resultado.observacoes.join(', ')}`);
});

// ==========================================
// 8. BOAS PRÁTICAS
// ==========================================

console.log('\n=== BOAS PRÁTICAS ===');

/*
BOAS PRÁTICAS PARA ESTRUTURAS CONDICIONAIS:

1. ✅ Use === em vez de == para evitar coerção
2. ✅ Mantenha condições simples e legíveis
3. ✅ Use early return para reduzir aninhamento
4. ✅ Prefira switch para múltiplas opções discretas
5. ✅ Use operador ternário apenas para casos simples
6. ✅ Extraia condições complexas para variáveis
7. ✅ Use operadores lógicos para combinar condições
8. ❌ Evite if/else muito aninhados
9. ❌ Não abuse do operador ternário
10. ❌ Cuidado com valores falsy inesperados
*/

// Exemplos de boas práticas
function exemploBoasPraticas() {
    // ✅ Early return
    function validarUsuario(usuario) {
        if (!usuario) return { valido: false, erro: 'Usuário não fornecido' };
        if (!usuario.email) return { valido: false, erro: 'Email obrigatório' };
        if (!usuario.idade) return { valido: false, erro: 'Idade obrigatória' };
        
        return { valido: true };
    }
    
    // ✅ Extrair condições complexas
    function podeAcessarRecurso(usuario, recurso) {
        const isUsuarioAtivo = usuario.ativo && !usuario.suspenso;
        const temPermissao = usuario.permissoes.includes(recurso.permissaoNecessaria);
        const isHorarioPermitido = new Date().getHours() >= 8 && new Date().getHours() <= 18;
        
        return isUsuarioAtivo && temPermissao && isHorarioPermitido;
    }
    
    // ✅ Switch para múltiplas opções
    function obterCorPorStatus(status) {
        switch (status) {
            case 'ativo': return '#28a745';
            case 'inativo': return '#6c757d';
            case 'pendente': return '#ffc107';
            case 'erro': return '#dc3545';
            default: return '#007bff';
        }
    }
    
    console.log('Exemplos de boas práticas executados');
}

// ==========================================
// 9. DICAS DE OTIMIZAÇÃO
// ==========================================

/*
DICAS DE PERFORMANCE:

1. Condições mais prováveis primeiro em if/else if
2. Use short-circuit evaluation (&&, ||)
3. Cache resultados de condições custosas
4. Prefira switch para muitas condições discretas
5. Evite condições desnecessárias em loops
6. Use Map/Object para lookup em vez de múltiplos if
*/

console.log('\n=== DICAS IMPORTANTES ===');
console.log('1. Use === para comparações estritas');
console.log('2. Mantenha condições simples e legíveis');
console.log('3. Use early return para reduzir complexidade');
console.log('4. Switch é eficiente para múltiplas opções');
console.log('5. Operador ternário apenas para casos simples');
console.log('6. Extraia lógica complexa para funções');

// ==========================================
// 10. REFERÊNCIAS PARA APROFUNDAMENTO
// ==========================================

/*
REFERÊNCIAS RECOMENDADAS:

📚 Documentação:
- MDN Conditional Statements: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
- MDN Logical Operators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators
- MDN Comparison Operators: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Comparison_Operators

📖 Artigos Essenciais:
- "Truthy and Falsy Values" - javascript.info
- "Conditional (ternary) operator" - MDN
- "Clean Code: Conditionals" - Robert C. Martin

🎯 Ferramentas:
- ESLint rules: no-else-return, prefer-const
- SonarQube para complexidade ciclomática
- Code coverage para testar todas as condições

🔧 Padrões:
- Guard clauses (early return)
- Strategy pattern para condições complexas
- State pattern para máquinas de estado
*/

console.log('\n✅ Módulo 2.1 - Estruturas Condicionais concluído!');
console.log('📚 Próximo: Loops e Iteração');

// Exportação para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SistemaFilmes,
        CalculadoraDesconto,
        SistemaRoteamento
    };
}