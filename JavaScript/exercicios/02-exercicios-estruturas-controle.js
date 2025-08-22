/*
===========================================
    EXERCÍCIOS - ESTRUTURAS DE CONTROLE
===========================================

Este arquivo contém 3 exercícios práticos para fixar:
- Estruturas condicionais (if/else, switch/case)
- Loops (for, while, do-while)
- Controle de fluxo (break, continue)
- Operadores lógicos e de comparação
- Validação e tratamento de entrada

Nível: Iniciante a Intermediário
Tempo estimado: 45-60 minutos
*/

console.log('=== EXERCÍCIOS - ESTRUTURAS DE CONTROLE ===');

/*
========================================
EXERCÍCIO 1: JOGO DE ADIVINHAÇÃO
========================================

Objetivo: Criar um jogo onde o computador escolhe um número
aleatório e o jogador tenta adivinhar, demonstrando uso de
loops, condicionais e controle de fluxo.

Requisitos:
1. Gerar número aleatório entre 1 e 100
2. Permitir múltiplas tentativas
3. Dar dicas (maior/menor)
4. Contar tentativas e calcular pontuação
5. Implementar níveis de dificuldade
6. Permitir jogar novamente
7. Manter histórico de jogos
*/

console.log('\n--- EXERCÍCIO 1: JOGO DE ADIVINHAÇÃO ---');

// SOLUÇÃO:
class JogoAdivinhacao {
    constructor() {
        this.historico = [];
        this.niveis = {
            facil: { min: 1, max: 50, tentativasMax: 10, pontosPorTentativa: 15 },
            medio: { min: 1, max: 100, tentativasMax: 8, pontosPorTentativa: 20 },
            dificil: { min: 1, max: 200, tentativasMax: 6, pontosPorTentativa: 30 }
        };
    }
    
    gerarNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    calcularPontuacao(tentativas, tentativasMax, pontosPorTentativa) {
        const eficiencia = (tentativasMax - tentativas + 1) / tentativasMax;
        const pontuacaoBase = pontosPorTentativa * tentativasMax;
        const bonus = Math.floor(eficiencia * 100); // Bônus de eficiência
        return Math.max(pontuacaoBase * eficiencia + bonus, 10);
    }
    
    obterClassificacao(pontuacao) {
        if (pontuacao >= 200) return { titulo: '🏆 MESTRE', cor: '\x1b[33m' };
        if (pontuacao >= 150) return { titulo: '🥇 EXPERT', cor: '\x1b[32m' };
        if (pontuacao >= 100) return { titulo: '🥈 AVANÇADO', cor: '\x1b[36m' };
        if (pontuacao >= 50) return { titulo: '🥉 INTERMEDIÁRIO', cor: '\x1b[34m' };
        return { titulo: '📚 INICIANTE', cor: '\x1b[35m' };
    }
    
    jogar(nivel = 'medio', tentativasSimuladas = null) {
        // Validar nível
        if (!this.niveis[nivel]) {
            throw new Error(`Nível '${nivel}' não existe. Use: facil, medio, dificil`);
        }
        
        const config = this.niveis[nivel];
        const numeroSecreto = this.gerarNumeroAleatorio(config.min, config.max);
        const tentativas = [];
        let tentativaAtual = 1;
        let acertou = false;
        
        console.log(`\n🎯 JOGO DE ADIVINHAÇÃO - Nível: ${nivel.toUpperCase()}`);
        console.log(`📊 Intervalo: ${config.min} a ${config.max}`);
        console.log(`⏱️  Tentativas máximas: ${config.tentativasMax}`);
        console.log(`💎 Pontos por tentativa: ${config.pontosPorTentativa}`);
        console.log('\n' + '='.repeat(50));
        
        // Se fornecidas tentativas simuladas, usar elas (para testes)
        const tentativasParaUsar = tentativasSimuladas || [
            Math.floor((config.min + config.max) / 2), // Primeira tentativa: meio
            numeroSecreto // Segunda tentativa: acerta
        ];
        
        while (tentativaAtual <= config.tentativasMax && !acertou) {
            let palpite;
            
            // Simular entrada do usuário
            if (tentativasSimuladas) {
                palpite = tentativasParaUsar[tentativaAtual - 1];
                if (palpite === undefined) {
                    // Se não há mais tentativas simuladas, gerar aleatória
                    palpite = this.gerarNumeroAleatorio(config.min, config.max);
                }
            } else {
                // Para demonstração, usar estratégia inteligente
                if (tentativaAtual === 1) {
                    palpite = Math.floor((config.min + config.max) / 2);
                } else {
                    // Ajustar baseado na última dica
                    const ultimaTentativa = tentativas[tentativas.length - 1];
                    if (ultimaTentativa.dica === 'maior') {
                        palpite = Math.floor((ultimaTentativa.palpite + config.max) / 2);
                    } else {
                        palpite = Math.floor((config.min + ultimaTentativa.palpite) / 2);
                    }
                }
            }
            
            // Validar palpite
            if (isNaN(palpite) || palpite < config.min || palpite > config.max) {
                console.log(`❌ Palpite inválido! Digite um número entre ${config.min} e ${config.max}`);
                continue;
            }
            
            console.log(`\n🎲 Tentativa ${tentativaAtual}: ${palpite}`);
            
            // Verificar palpite
            let dica = '';
            if (palpite === numeroSecreto) {
                acertou = true;
                dica = 'acertou';
                console.log('🎉 PARABÉNS! Você acertou!');
            } else if (palpite < numeroSecreto) {
                dica = 'maior';
                console.log('📈 O número é MAIOR que ' + palpite);
            } else {
                dica = 'menor';
                console.log('📉 O número é MENOR que ' + palpite);
            }
            
            // Registrar tentativa
            tentativas.push({
                numero: tentativaAtual,
                palpite,
                dica,
                distancia: Math.abs(numeroSecreto - palpite)
            });
            
            tentativaAtual++;
        }
        
        // Resultado final
        const resultado = {
            sucesso: acertou,
            numeroSecreto,
            tentativasUsadas: tentativas.length,
            tentativasMax: config.tentativasMax,
            nivel,
            tentativas,
            timestamp: new Date()
        };
        
        if (acertou) {
            resultado.pontuacao = Math.floor(this.calcularPontuacao(
                tentativas.length, 
                config.tentativasMax, 
                config.pontosPorTentativa
            ));
            resultado.classificacao = this.obterClassificacao(resultado.pontuacao);
            
            console.log('\n' + '='.repeat(50));
            console.log('🏆 VITÓRIA!');
            console.log(`📊 Tentativas: ${tentativas.length}/${config.tentativasMax}`);
            console.log(`💯 Pontuação: ${resultado.pontuacao}`);
            console.log(`🎖️  Classificação: ${resultado.classificacao.titulo}`);
        } else {
            console.log('\n' + '='.repeat(50));
            console.log('💔 GAME OVER!');
            console.log(`🎯 O número era: ${numeroSecreto}`);
            console.log(`📊 Tentativas esgotadas: ${config.tentativasMax}`);
            resultado.pontuacao = 0;
            resultado.classificacao = { titulo: '❌ FALHOU', cor: '\x1b[31m' };
        }
        
        // Adicionar ao histórico
        this.historico.push(resultado);
        
        return resultado;
    }
    
    exibirEstatisticas() {
        if (this.historico.length === 0) {
            console.log('\n📊 Nenhum jogo registrado ainda.');
            return;
        }
        
        const jogos = this.historico;
        const vitorias = jogos.filter(j => j.sucesso);
        const derrotas = jogos.filter(j => !j.sucesso);
        
        const taxaVitoria = (vitorias.length / jogos.length * 100).toFixed(1);
        const pontuacaoMedia = vitorias.length > 0 ? 
            (vitorias.reduce((sum, j) => sum + j.pontuacao, 0) / vitorias.length).toFixed(1) : 0;
        const melhorJogo = vitorias.reduce((melhor, atual) => 
            atual.pontuacao > melhor.pontuacao ? atual : melhor, vitorias[0]);
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 ESTATÍSTICAS GERAIS');
        console.log('='.repeat(60));
        console.log(`🎮 Total de jogos: ${jogos.length}`);
        console.log(`🏆 Vitórias: ${vitorias.length}`);
        console.log(`💔 Derrotas: ${derrotas.length}`);
        console.log(`📈 Taxa de vitória: ${taxaVitoria}%`);
        console.log(`💯 Pontuação média: ${pontuacaoMedia}`);
        
        if (melhorJogo) {
            console.log(`\n🥇 MELHOR JOGO:`);
            console.log(`   Nível: ${melhorJogo.nivel}`);
            console.log(`   Tentativas: ${melhorJogo.tentativasUsadas}`);
            console.log(`   Pontuação: ${melhorJogo.pontuacao}`);
            console.log(`   Classificação: ${melhorJogo.classificacao.titulo}`);
        }
        
        // Estatísticas por nível
        console.log('\n📊 POR NÍVEL:');
        Object.keys(this.niveis).forEach(nivel => {
            const jogosNivel = jogos.filter(j => j.nivel === nivel);
            if (jogosNivel.length > 0) {
                const vitoriasNivel = jogosNivel.filter(j => j.sucesso);
                const taxaNivel = (vitoriasNivel.length / jogosNivel.length * 100).toFixed(1);
                console.log(`   ${nivel}: ${vitoriasNivel.length}/${jogosNivel.length} (${taxaNivel}%)`);
            }
        });
    }
    
    reiniciar() {
        this.historico = [];
        console.log('\n🔄 Histórico limpo! Começando do zero.');
    }
}

// Testes e demonstração
const jogo = new JogoAdivinhacao();

console.log('\n🎮 Demonstração do Jogo de Adivinhação:');

// Jogo 1: Nível fácil
try {
    const resultado1 = jogo.jogar('facil', [25, 35, 42]); // Tentativas simuladas
    console.log('\n✅ Jogo 1 concluído');
} catch (error) {
    console.log('❌ Erro no jogo 1:', error.message);
}

// Jogo 2: Nível médio
try {
    const resultado2 = jogo.jogar('medio', [50, 75, 88, 94]); // Tentativas simuladas
    console.log('\n✅ Jogo 2 concluído');
} catch (error) {
    console.log('❌ Erro no jogo 2:', error.message);
}

// Jogo 3: Nível difícil
try {
    const resultado3 = jogo.jogar('dificil', [100, 150, 125, 137, 143]); // Tentativas simuladas
    console.log('\n✅ Jogo 3 concluído');
} catch (error) {
    console.log('❌ Erro no jogo 3:', error.message);
}

// Exibir estatísticas
jogo.exibirEstatisticas();

/*
========================================
EXERCÍCIO 2: VALIDADOR DE SENHA
========================================

Objetivo: Criar um sistema robusto de validação de senhas
com múltiplos critérios e níveis de segurança, demonstrando
uso de loops, condicionais e validações complexas.

Requisitos:
1. Validar comprimento mínimo/máximo
2. Verificar presença de caracteres especiais
3. Validar maiúsculas, minúsculas e números
4. Detectar padrões comuns (sequências, repetições)
5. Calcular força da senha
6. Sugerir melhorias
7. Gerar senhas seguras
*/

console.log('\n--- EXERCÍCIO 2: VALIDADOR DE SENHA ---');

// SOLUÇÃO:
class ValidadorSenha {
    constructor() {
        this.criterios = {
            comprimentoMin: 8,
            comprimentoMax: 128,
            maiuscula: true,
            minuscula: true,
            numero: true,
            especial: true,
            semSequencias: true,
            semRepeticoes: true
        };
        
        this.caracteresEspeciais = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        this.sequenciasComuns = [
            '123456', '654321', 'abcdef', 'fedcba',
            'qwerty', 'asdfgh', 'zxcvbn'
        ];
        this.senhasComuns = [
            'password', '123456', 'password123', 'admin',
            'qwerty', 'letmein', 'welcome', 'monkey'
        ];
    }
    
    validarComprimento(senha) {
        const comprimento = senha.length;
        const resultado = {
            valido: comprimento >= this.criterios.comprimentoMin && 
                   comprimento <= this.criterios.comprimentoMax,
            comprimento,
            minimo: this.criterios.comprimentoMin,
            maximo: this.criterios.comprimentoMax
        };
        
        if (!resultado.valido) {
            if (comprimento < this.criterios.comprimentoMin) {
                resultado.erro = `Muito curta (mínimo ${this.criterios.comprimentoMin} caracteres)`;
            } else {
                resultado.erro = `Muito longa (máximo ${this.criterios.comprimentoMax} caracteres)`;
            }
        }
        
        return resultado;
    }
    
    validarCaracteres(senha) {
        const resultado = {
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            numero: /[0-9]/.test(senha),
            especial: new RegExp(`[${this.caracteresEspeciais.replace(/[\]\\^-]/g, '\\$&')}]`).test(senha)
        };
        
        resultado.valido = Object.values(resultado).every(Boolean);
        resultado.faltando = [];
        
        if (!resultado.maiuscula) resultado.faltando.push('letra maiúscula');
        if (!resultado.minuscula) resultado.faltando.push('letra minúscula');
        if (!resultado.numero) resultado.faltando.push('número');
        if (!resultado.especial) resultado.faltando.push('caractere especial');
        
        return resultado;
    }
    
    detectarPadroesInseguros(senha) {
        const problemas = [];
        const senhaLower = senha.toLowerCase();
        
        // Verificar sequências comuns
        for (const sequencia of this.sequenciasComuns) {
            if (senhaLower.includes(sequencia)) {
                problemas.push(`Contém sequência comum: ${sequencia}`);
            }
        }
        
        // Verificar senhas comuns
        for (const senhaComum of this.senhasComuns) {
            if (senhaLower.includes(senhaComum)) {
                problemas.push(`Contém palavra comum: ${senhaComum}`);
            }
        }
        
        // Verificar repetições excessivas
        const repeticoes = this.detectarRepeticoes(senha);
        if (repeticoes.length > 0) {
            problemas.push(...repeticoes);
        }
        
        // Verificar padrões de teclado
        const padroesToclado = ['qwer', 'asdf', 'zxcv', '1234', '4321'];
        for (const padrao of padroesToclado) {
            if (senhaLower.includes(padrao)) {
                problemas.push(`Contém padrão de teclado: ${padrao}`);
            }
        }
        
        return {
            valido: problemas.length === 0,
            problemas
        };
    }
    
    detectarRepeticoes(senha) {
        const problemas = [];
        
        // Verificar caracteres consecutivos iguais
        for (let i = 0; i < senha.length - 2; i++) {
            if (senha[i] === senha[i + 1] && senha[i] === senha[i + 2]) {
                problemas.push(`Repetição excessiva do caractere '${senha[i]}'`);
                break;
            }
        }
        
        // Verificar padrões repetitivos
        for (let tamanho = 2; tamanho <= senha.length / 2; tamanho++) {
            for (let i = 0; i <= senha.length - tamanho * 2; i++) {
                const padrao = senha.substr(i, tamanho);
                const proximoPadrao = senha.substr(i + tamanho, tamanho);
                
                if (padrao === proximoPadrao && padrao.length >= 2) {
                    problemas.push(`Padrão repetitivo detectado: '${padrao}'`);
                    return problemas; // Evitar múltiplas detecções do mesmo padrão
                }
            }
        }
        
        return problemas;
    }
    
    calcularForca(senha) {
        let pontuacao = 0;
        const detalhes = [];
        
        // Pontuação por comprimento
        if (senha.length >= 8) {
            pontuacao += Math.min(senha.length * 2, 20);
            detalhes.push(`Comprimento (${senha.length}): +${Math.min(senha.length * 2, 20)}`);
        }
        
        // Pontuação por variedade de caracteres
        const caracteres = this.validarCaracteres(senha);
        if (caracteres.maiuscula) {
            pontuacao += 10;
            detalhes.push('Maiúsculas: +10');
        }
        if (caracteres.minuscula) {
            pontuacao += 10;
            detalhes.push('Minúsculas: +10');
        }
        if (caracteres.numero) {
            pontuacao += 10;
            detalhes.push('Números: +10');
        }
        if (caracteres.especial) {
            pontuacao += 15;
            detalhes.push('Especiais: +15');
        }
        
        // Penalização por padrões inseguros
        const padroes = this.detectarPadroesInseguros(senha);
        const penalizacao = padroes.problemas.length * 10;
        pontuacao -= penalizacao;
        if (penalizacao > 0) {
            detalhes.push(`Padrões inseguros: -${penalizacao}`);
        }
        
        // Bônus por complexidade
        const caracteresUnicos = new Set(senha).size;
        const bonusComplexidade = Math.floor(caracteresUnicos / 2);
        pontuacao += bonusComplexidade;
        if (bonusComplexidade > 0) {
            detalhes.push(`Diversidade: +${bonusComplexidade}`);
        }
        
        // Determinar nível
        let nivel, cor, descricao;
        if (pontuacao >= 80) {
            nivel = 'MUITO FORTE';
            cor = '\x1b[32m'; // Verde
            descricao = 'Excelente! Senha muito segura.';
        } else if (pontuacao >= 60) {
            nivel = 'FORTE';
            cor = '\x1b[36m'; // Ciano
            descricao = 'Boa! Senha segura.';
        } else if (pontuacao >= 40) {
            nivel = 'MÉDIA';
            cor = '\x1b[33m'; // Amarelo
            descricao = 'Razoável, mas pode melhorar.';
        } else if (pontuacao >= 20) {
            nivel = 'FRACA';
            cor = '\x1b[35m'; // Magenta
            descricao = 'Fraca. Precisa de melhorias.';
        } else {
            nivel = 'MUITO FRACA';
            cor = '\x1b[31m'; // Vermelho
            descricao = 'Muito insegura! Mude imediatamente.';
        }
        
        return {
            pontuacao: Math.max(0, pontuacao),
            nivel,
            cor,
            descricao,
            detalhes
        };
    }
    
    gerarSugestoes(senha) {
        const sugestoes = [];
        
        const comprimento = this.validarComprimento(senha);
        if (!comprimento.valido) {
            sugestoes.push(comprimento.erro);
        }
        
        const caracteres = this.validarCaracteres(senha);
        if (caracteres.faltando.length > 0) {
            sugestoes.push(`Adicione: ${caracteres.faltando.join(', ')}`);
        }
        
        const padroes = this.detectarPadroesInseguros(senha);
        if (!padroes.valido) {
            sugestoes.push('Evite sequências e padrões comuns');
            sugestoes.push('Use combinações aleatórias de caracteres');
        }
        
        if (senha.length < 12) {
            sugestoes.push('Considere usar pelo menos 12 caracteres');
        }
        
        if (sugestoes.length === 0) {
            sugestoes.push('Senha atende aos critérios básicos!');
        }
        
        return sugestoes;
    }
    
    gerarSenhaSegura(comprimento = 12, incluirEspeciais = true) {
        const minusculas = 'abcdefghijklmnopqrstuvwxyz';
        const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numeros = '0123456789';
        const especiais = incluirEspeciais ? this.caracteresEspeciais : '';
        
        let caracteres = minusculas + maiusculas + numeros + especiais;
        let senha = '';
        
        // Garantir pelo menos um de cada tipo
        senha += minusculas[Math.floor(Math.random() * minusculas.length)];
        senha += maiusculas[Math.floor(Math.random() * maiusculas.length)];
        senha += numeros[Math.floor(Math.random() * numeros.length)];
        if (incluirEspeciais) {
            senha += especiais[Math.floor(Math.random() * especiais.length)];
        }
        
        // Preencher o restante aleatoriamente
        for (let i = senha.length; i < comprimento; i++) {
            senha += caracteres[Math.floor(Math.random() * caracteres.length)];
        }
        
        // Embaralhar a senha
        return senha.split('').sort(() => Math.random() - 0.5).join('');
    }
    
    validar(senha) {
        const resultado = {
            senha,
            timestamp: new Date(),
            comprimento: this.validarComprimento(senha),
            caracteres: this.validarCaracteres(senha),
            padroes: this.detectarPadroesInseguros(senha),
            forca: this.calcularForca(senha),
            sugestoes: this.gerarSugestoes(senha)
        };
        
        resultado.valida = resultado.comprimento.valido && 
                          resultado.caracteres.valido && 
                          resultado.padroes.valido;
        
        return resultado;
    }
    
    exibirRelatorio(validacao) {
        console.log('\n' + '='.repeat(60));
        console.log('🔐 RELATÓRIO DE VALIDAÇÃO DE SENHA');
        console.log('='.repeat(60));
        console.log(`📝 Senha: ${'*'.repeat(validacao.senha.length)} (${validacao.senha.length} caracteres)`);
        console.log(`✅ Status: ${validacao.valida ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
        
        // Força da senha
        console.log(`\n💪 FORÇA DA SENHA:`);
        console.log(`   Pontuação: ${validacao.forca.pontuacao}/100`);
        console.log(`   Nível: ${validacao.forca.cor}${validacao.forca.nivel}\x1b[0m`);
        console.log(`   ${validacao.forca.descricao}`);
        
        // Detalhes da pontuação
        if (validacao.forca.detalhes.length > 0) {
            console.log(`\n📊 DETALHES DA PONTUAÇÃO:`);
            validacao.forca.detalhes.forEach(detalhe => {
                console.log(`   • ${detalhe}`);
            });
        }
        
        // Problemas encontrados
        if (!validacao.valida) {
            console.log(`\n❌ PROBLEMAS ENCONTRADOS:`);
            
            if (!validacao.comprimento.valido) {
                console.log(`   • ${validacao.comprimento.erro}`);
            }
            
            if (validacao.caracteres.faltando.length > 0) {
                console.log(`   • Faltam: ${validacao.caracteres.faltando.join(', ')}`);
            }
            
            validacao.padroes.problemas.forEach(problema => {
                console.log(`   • ${problema}`);
            });
        }
        
        // Sugestões
        if (validacao.sugestoes.length > 0) {
            console.log(`\n💡 SUGESTÕES:`);
            validacao.sugestoes.forEach(sugestao => {
                console.log(`   • ${sugestao}`);
            });
        }
    }
}

// Testes e demonstração
const validador = new ValidadorSenha();

console.log('\n🔐 Demonstração do Validador de Senha:');

// Teste 1: Senha fraca
const senha1 = '123456';
const validacao1 = validador.validar(senha1);
validador.exibirRelatorio(validacao1);

// Teste 2: Senha média
const senha2 = 'MinhaSenh@123';
const validacao2 = validador.validar(senha2);
validador.exibirRelatorio(validacao2);

// Teste 3: Senha forte
const senha3 = 'K9#mX$7pL@2vN&8qR!';
const validacao3 = validador.validar(senha3);
validador.exibirRelatorio(validacao3);

// Demonstrar geração de senha segura
console.log('\n🎲 GERAÇÃO DE SENHA SEGURA:');
for (let i = 0; i < 3; i++) {
    const senhaGerada = validador.gerarSenhaSegura(12, true);
    const validacaoGerada = validador.validar(senhaGerada);
    console.log(`\n🔑 Senha ${i + 1}: ${senhaGerada}`);
    console.log(`   Força: ${validacaoGerada.forca.nivel} (${validacaoGerada.forca.pontuacao}/100)`);
}

/*
========================================
EXERCÍCIO 3: SIMULADOR DE CAIXA ELETRÔNICO
========================================

Objetivo: Criar um simulador completo de caixa eletrônico
com múltiplas operações, validações e controle de estado,
demonstrando uso avançado de estruturas de controle.

Requisitos:
1. Sistema de autenticação (PIN)
2. Múltiplas operações (saque, depósito, transferência)
3. Validação de notas disponíveis
4. Controle de saldo e limites
5. Histórico de transações
6. Sistema de bloqueio por tentativas
7. Relatórios e extratos
*/

console.log('\n--- EXERCÍCIO 3: SIMULADOR DE CAIXA ELETRÔNICO ---');

// SOLUÇÃO:
class CaixaEletronico {
    constructor() {
        this.contas = new Map();
        this.notasDisponiveis = {
            100: 50,
            50: 100,
            20: 200,
            10: 150,
            5: 100,
            2: 200
        };
        this.limites = {
            saqueMaximo: 1000,
            transferenciaDiaria: 5000,
            tentativasPin: 3
        };
        this.sessaoAtual = null;
        this.inicializarContasDemo();
    }
    
    inicializarContasDemo() {
        // Criar contas de demonstração
        this.criarConta('12345', '1234', 'João Silva', 2500.00);
        this.criarConta('67890', '5678', 'Maria Santos', 1800.50);
        this.criarConta('11111', '0000', 'Pedro Costa', 500.00);
    }
    
    criarConta(numero, pin, titular, saldoInicial = 0) {
        const conta = {
            numero,
            pin,
            titular,
            saldo: saldoInicial,
            bloqueada: false,
            tentativasPin: 0,
            transacoes: [],
            limitesUsados: {
                transferenciaDiaria: 0,
                ultimaResetTransferencia: new Date().toDateString()
            },
            criadaEm: new Date()
        };
        
        this.contas.set(numero, conta);
        this.registrarTransacao(numero, 'ABERTURA', saldoInicial, 'Abertura de conta');
        return conta;
    }
    
    autenticar(numeroConta, pin) {
        const conta = this.contas.get(numeroConta);
        
        if (!conta) {
            return { sucesso: false, erro: 'Conta não encontrada' };
        }
        
        if (conta.bloqueada) {
            return { sucesso: false, erro: 'Conta bloqueada. Procure uma agência.' };
        }
        
        if (conta.pin !== pin) {
            conta.tentativasPin++;
            
            if (conta.tentativasPin >= this.limites.tentativasPin) {
                conta.bloqueada = true;
                this.registrarTransacao(numeroConta, 'BLOQUEIO', 0, 'Conta bloqueada por tentativas de PIN');
                return { sucesso: false, erro: 'Conta bloqueada por excesso de tentativas incorretas' };
            }
            
            const tentativasRestantes = this.limites.tentativasPin - conta.tentativasPin;
            return { 
                sucesso: false, 
                erro: `PIN incorreto. ${tentativasRestantes} tentativa(s) restante(s)` 
            };
        }
        
        // Reset tentativas em caso de sucesso
        conta.tentativasPin = 0;
        this.sessaoAtual = {
            conta: numeroConta,
            inicioSessao: new Date(),
            operacoes: 0
        };
        
        return { sucesso: true, conta };
    }
    
    calcularNotas(valor) {
        const notasParaSaque = {};
        let valorRestante = valor;
        const notasOrdenadas = Object.keys(this.notasDisponiveis)
            .map(Number)
            .sort((a, b) => b - a);
        
        for (const nota of notasOrdenadas) {
            const quantidadeDisponivel = this.notasDisponiveis[nota];
            const quantidadeNecessaria = Math.floor(valorRestante / nota);
            const quantidadeUsar = Math.min(quantidadeDisponivel, quantidadeNecessaria);
            
            if (quantidadeUsar > 0) {
                notasParaSaque[nota] = quantidadeUsar;
                valorRestante -= quantidadeUsar * nota;
            }
        }
        
        return {
            possivel: valorRestante === 0,
            notas: notasParaSaque,
            valorRestante
        };
    }
    
    sacar(valor, observacao = '') {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Sessão não iniciada' };
        }
        
        const conta = this.contas.get(this.sessaoAtual.conta);
        
        // Validações
        if (valor <= 0) {
            return { sucesso: false, erro: 'Valor deve ser positivo' };
        }
        
        if (valor > this.limites.saqueMaximo) {
            return { sucesso: false, erro: `Valor excede limite de saque (R$ ${this.limites.saqueMaximo})` };
        }
        
        if (valor > conta.saldo) {
            return { sucesso: false, erro: 'Saldo insuficiente' };
        }
        
        // Verificar disponibilidade de notas
        const calculoNotas = this.calcularNotas(valor);
        if (!calculoNotas.possivel) {
            return { 
                sucesso: false, 
                erro: `Não há notas suficientes para este valor. Tente R$ ${valor - calculoNotas.valorRestante}` 
            };
        }
        
        // Realizar saque
        conta.saldo -= valor;
        
        // Atualizar notas disponíveis
        for (const [nota, quantidade] of Object.entries(calculoNotas.notas)) {
            this.notasDisponiveis[nota] -= quantidade;
        }
        
        this.registrarTransacao(
            conta.numero, 
            'SAQUE', 
            -valor, 
            observacao || 'Saque em dinheiro'
        );
        
        this.sessaoAtual.operacoes++;
        
        return {
            sucesso: true,
            valor,
            notas: calculoNotas.notas,
            saldoAtual: conta.saldo,
            transacao: conta.transacoes[conta.transacoes.length - 1]
        };
    }
    
    depositar(valor, observacao = '') {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Sessão não iniciada' };
        }
        
        const conta = this.contas.get(this.sessaoAtual.conta);
        
        if (valor <= 0) {
            return { sucesso: false, erro: 'Valor deve ser positivo' };
        }
        
        conta.saldo += valor;
        
        this.registrarTransacao(
            conta.numero, 
            'DEPÓSITO', 
            valor, 
            observacao || 'Depósito em dinheiro'
        );
        
        this.sessaoAtual.operacoes++;
        
        return {
            sucesso: true,
            valor,
            saldoAtual: conta.saldo,
            transacao: conta.transacoes[conta.transacoes.length - 1]
        };
    }
    
    transferir(contaDestino, valor, observacao = '') {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Sessão não iniciada' };
        }
        
        const contaOrigem = this.contas.get(this.sessaoAtual.conta);
        const contaDestinoObj = this.contas.get(contaDestino);
        
        // Validações
        if (!contaDestinoObj) {
            return { sucesso: false, erro: 'Conta de destino não encontrada' };
        }
        
        if (contaDestino === this.sessaoAtual.conta) {
            return { sucesso: false, erro: 'Não é possível transferir para a mesma conta' };
        }
        
        if (valor <= 0) {
            return { sucesso: false, erro: 'Valor deve ser positivo' };
        }
        
        if (valor > contaOrigem.saldo) {
            return { sucesso: false, erro: 'Saldo insuficiente' };
        }
        
        // Verificar limite diário
        const hoje = new Date().toDateString();
        if (contaOrigem.limitesUsados.ultimaResetTransferencia !== hoje) {
            contaOrigem.limitesUsados.transferenciaDiaria = 0;
            contaOrigem.limitesUsados.ultimaResetTransferencia = hoje;
        }
        
        if (contaOrigem.limitesUsados.transferenciaDiaria + valor > this.limites.transferenciaDiaria) {
            const disponivel = this.limites.transferenciaDiaria - contaOrigem.limitesUsados.transferenciaDiaria;
            return { 
                sucesso: false, 
                erro: `Limite diário de transferência excedido. Disponível: R$ ${disponivel.toFixed(2)}` 
            };
        }
        
        // Realizar transferência
        contaOrigem.saldo -= valor;
        contaDestinoObj.saldo += valor;
        contaOrigem.limitesUsados.transferenciaDiaria += valor;
        
        // Registrar transações
        const observacaoCompleta = observacao || `Transferência para ${contaDestinoObj.titular}`;
        
        this.registrarTransacao(
            contaOrigem.numero, 
            'TRANSFERÊNCIA ENVIADA', 
            -valor, 
            `${observacaoCompleta} (Conta: ${contaDestino})`
        );
        
        this.registrarTransacao(
            contaDestinoObj.numero, 
            'TRANSFERÊNCIA RECEBIDA', 
            valor, 
            `De ${contaOrigem.titular} (Conta: ${contaOrigem.numero})`
        );
        
        this.sessaoAtual.operacoes++;
        
        return {
            sucesso: true,
            valor,
            contaDestino,
            titularDestino: contaDestinoObj.titular,
            saldoAtual: contaOrigem.saldo,
            transacao: contaOrigem.transacoes[contaOrigem.transacoes.length - 1]
        };
    }
    
    consultarSaldo() {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Sessão não iniciada' };
        }
        
        const conta = this.contas.get(this.sessaoAtual.conta);
        
        return {
            sucesso: true,
            saldo: conta.saldo,
            titular: conta.titular,
            numero: conta.numero
        };
    }
    
    obterExtrato(quantidade = 10) {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Sessão não iniciada' };
        }
        
        const conta = this.contas.get(this.sessaoAtual.conta);
        const transacoesRecentes = conta.transacoes
            .slice(-quantidade)
            .reverse();
        
        return {
            sucesso: true,
            conta: {
                numero: conta.numero,
                titular: conta.titular,
                saldo: conta.saldo
            },
            transacoes: transacoesRecentes,
            periodo: {
                inicio: transacoesRecentes[transacoesRecentes.length - 1]?.data,
                fim: transacoesRecentes[0]?.data
            }
        };
    }
    
    registrarTransacao(numeroConta, tipo, valor, observacao) {
        const conta = this.contas.get(numeroConta);
        if (!conta) return;
        
        const transacao = {
            id: Date.now() + Math.random(),
            data: new Date(),
            tipo,
            valor,
            observacao,
            saldoApos: conta.saldo
        };
        
        conta.transacoes.push(transacao);
    }
    
    encerrarSessao() {
        if (!this.sessaoAtual) {
            return { sucesso: false, erro: 'Nenhuma sessão ativa' };
        }
        
        const duracao = new Date() - this.sessaoAtual.inicioSessao;
        const resultado = {
            sucesso: true,
            duracao: Math.floor(duracao / 1000), // em segundos
            operacoes: this.sessaoAtual.operacoes
        };
        
        this.sessaoAtual = null;
        return resultado;
    }
    
    exibirMenu() {
        console.log('\n' + '='.repeat(50));
        console.log('🏧 CAIXA ELETRÔNICO - MENU PRINCIPAL');
        console.log('='.repeat(50));
        console.log('1. 💰 Consultar Saldo');
        console.log('2. 💸 Sacar Dinheiro');
        console.log('3. 💳 Depositar Dinheiro');
        console.log('4. 🔄 Transferir Dinheiro');
        console.log('5. 📄 Extrato');
        console.log('6. 🚪 Sair');
        console.log('='.repeat(50));
    }
    
    formatarExtrato(extrato) {
        let relatorio = '\n' + '='.repeat(60) + '\n';
        relatorio += '📄 EXTRATO BANCÁRIO\n';
        relatorio += '='.repeat(60) + '\n';
        relatorio += `👤 Titular: ${extrato.conta.titular}\n`;
        relatorio += `🏦 Conta: ${extrato.conta.numero}\n`;
        relatorio += `💰 Saldo Atual: R$ ${extrato.conta.saldo.toFixed(2)}\n`;
        relatorio += '\n' + '-'.repeat(60) + '\n';
        relatorio += 'MOVIMENTAÇÕES\n';
        relatorio += '-'.repeat(60) + '\n';
        
        if (extrato.transacoes.length === 0) {
            relatorio += 'Nenhuma movimentação encontrada.\n';
        } else {
            extrato.transacoes.forEach(transacao => {
                const data = transacao.data.toLocaleDateString('pt-BR');
                const hora = transacao.data.toLocaleTimeString('pt-BR');
                const valor = transacao.valor >= 0 ? 
                    `+R$ ${transacao.valor.toFixed(2)}` : 
                    `-R$ ${Math.abs(transacao.valor).toFixed(2)}`;
                const sinal = transacao.valor >= 0 ? '📈' : '📉';
                
                relatorio += `${data} ${hora} ${sinal}\n`;
                relatorio += `  ${transacao.tipo}: ${valor}\n`;
                relatorio += `  ${transacao.observacao}\n`;
                relatorio += `  Saldo: R$ ${transacao.saldoApos.toFixed(2)}\n`;
                relatorio += '-'.repeat(40) + '\n';
            });
        }
        
        relatorio += '='.repeat(60);
        return relatorio;
    }
}

// Demonstração e testes
const caixa = new CaixaEletronico();

console.log('\n🏧 Demonstração do Caixa Eletrônico:');

// Simular sessão completa
function simularSessao() {
    console.log('\n🔐 Tentando autenticar...');
    
    // Tentativa com PIN incorreto
    let auth = caixa.autenticar('12345', '0000');
    console.log('❌ PIN incorreto:', auth.erro);
    
    // Autenticação correta
    auth = caixa.autenticar('12345', '1234');
    if (auth.sucesso) {
        console.log('✅ Autenticação bem-sucedida!');
        console.log(`👤 Bem-vindo, ${auth.conta.titular}!`);
        
        // Consultar saldo
        const saldo = caixa.consultarSaldo();
        console.log(`\n💰 Saldo atual: R$ ${saldo.saldo.toFixed(2)}`);
        
        // Realizar saque
        console.log('\n💸 Realizando saque de R$ 200...');
        const saque = caixa.sacar(200, 'Saque para despesas');
        if (saque.sucesso) {
            console.log('✅ Saque realizado com sucesso!');
            console.log('💵 Notas entregues:');
            Object.entries(saque.notas).forEach(([nota, qtd]) => {
                console.log(`   ${qtd}x R$ ${nota}`);
            });
            console.log(`💰 Novo saldo: R$ ${saque.saldoAtual.toFixed(2)}`);
        } else {
            console.log('❌ Erro no saque:', saque.erro);
        }
        
        // Realizar depósito
        console.log('\n💳 Realizando depósito de R$ 150...');
        const deposito = caixa.depositar(150, 'Depósito de salário');
        if (deposito.sucesso) {
            console.log('✅ Depósito realizado com sucesso!');
            console.log(`💰 Novo saldo: R$ ${deposito.saldoAtual.toFixed(2)}`);
        }
        
        // Realizar transferência
        console.log('\n🔄 Realizando transferência de R$ 100...');
        const transferencia = caixa.transferir('67890', 100, 'Pagamento de conta');
        if (transferencia.sucesso) {
            console.log('✅ Transferência realizada com sucesso!');
            console.log(`👤 Para: ${transferencia.titularDestino}`);
            console.log(`💰 Novo saldo: R$ ${transferencia.saldoAtual.toFixed(2)}`);
        } else {
            console.log('❌ Erro na transferência:', transferencia.erro);
        }
        
        // Obter extrato
        console.log('\n📄 Gerando extrato...');
        const extrato = caixa.obterExtrato(5);
        if (extrato.sucesso) {
            console.log(caixa.formatarExtrato(extrato));
        }
        
        // Encerrar sessão
        const encerramento = caixa.encerrarSessao();
        console.log(`\n🚪 Sessão encerrada após ${encerramento.duracao}s e ${encerramento.operacoes} operações.`);
        console.log('Obrigado por usar nosso caixa eletrônico!');
    }
}

// Executar simulação
simularSessao();

// Demonstrar tentativas de PIN incorreto
console.log('\n🔒 Demonstrando bloqueio por tentativas incorretas:');
for (let i = 1; i <= 4; i++) {
    const resultado = caixa.autenticar('67890', '0000');
    console.log(`Tentativa ${i}: ${resultado.erro}`);
    if (resultado.erro.includes('bloqueada')) break;
}

console.log('\n=== EXERCÍCIOS ESTRUTURAS DE CONTROLE CONCLUÍDOS ===');
console.log('\n🎯 Conceitos praticados:');
console.log('✅ Estruturas condicionais (if/else, switch/case)');
console.log('✅ Loops (for, while, do-while)');
console.log('✅ Controle de fluxo (break, continue)');
console.log('✅ Operadores lógicos e de comparação');
console.log('✅ Validação complexa de dados');
console.log('✅ Gerenciamento de estado');
console.log('✅ Tratamento de múltiplas condições');
console.log('✅ Algoritmos de busca e classificação');
console.log('✅ Controle de acesso e segurança');
console.log('✅ Simulação de sistemas reais');

/*
========================================
DESAFIOS EXTRAS (OPCIONAL)
========================================

1. JOGO DE ADIVINHAÇÃO AVANÇADO:
   - Adicione modo multiplayer
   - Implemente diferentes categorias (números, palavras, matemática)
   - Crie sistema de ranking global
   - Adicione power-ups e dicas especiais

2. VALIDADOR DE SENHA EMPRESARIAL:
   - Implemente políticas personalizáveis
   - Adicione verificação contra vazamentos conhecidos
   - Crie sistema de expiração de senhas
   - Implemente histórico de senhas anteriores

3. CAIXA ELETRÔNICO COMPLETO:
   - Adicione múltiplas moedas
   - Implemente sistema de cartão de crédito
   - Crie módulo de investimentos
   - Adicione sistema de agendamento
   - Implemente relatórios gerenciais

4. SISTEMA DE VOTAÇÃO:
   - Crie eleição com múltiplos candidatos
   - Implemente diferentes métodos de votação
   - Adicione sistema de auditoria
   - Crie relatórios estatísticos

5. SIMULADOR DE TRÂNSITO:
   - Modele semáforos inteligentes
   - Simule fluxo de veículos
   - Implemente algoritmos de otimização
   - Crie sistema de multas automáticas
*/