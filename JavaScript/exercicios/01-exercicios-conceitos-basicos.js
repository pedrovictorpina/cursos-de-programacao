/*
===========================================
    EXERCÍCIOS - CONCEITOS BÁSICOS
===========================================

Este arquivo contém 3 exercícios práticos para fixar:
- Variáveis e tipos de dados
- Operadores aritméticos, lógicos e de comparação
- Conversão de tipos
- Template literals
- Conceitos fundamentais do JavaScript

Nível: Iniciante
Tempo estimado: 30-45 minutos
*/

console.log('=== EXERCÍCIOS - CONCEITOS BÁSICOS ===');

/*
========================================
EXERCÍCIO 1: CALCULADORA DE IMC
========================================

Objetivo: Criar uma calculadora de Índice de Massa Corporal (IMC)
que demonstre o uso de variáveis, operadores e condicionais básicas.

Requisitos:
1. Declarar variáveis para peso (kg) e altura (m)
2. Calcular o IMC usando a fórmula: peso / (altura * altura)
3. Classificar o resultado segundo a tabela da OMS
4. Exibir resultado formatado com template literals

Classificação IMC:
- Abaixo de 18.5: Abaixo do peso
- 18.5 a 24.9: Peso normal
- 25.0 a 29.9: Sobrepeso
- 30.0 a 34.9: Obesidade grau I
- 35.0 a 39.9: Obesidade grau II
- 40.0 ou mais: Obesidade grau III
*/

console.log('\n--- EXERCÍCIO 1: CALCULADORA DE IMC ---');

// SOLUÇÃO:
function calcularIMC(peso, altura) {
    // Validação de entrada
    if (typeof peso !== 'number' || typeof altura !== 'number') {
        return 'Erro: Peso e altura devem ser números';
    }
    
    if (peso <= 0 || altura <= 0) {
        return 'Erro: Peso e altura devem ser valores positivos';
    }
    
    // Cálculo do IMC
    const imc = peso / (altura * altura);
    
    // Classificação
    let classificacao;
    if (imc < 18.5) {
        classificacao = 'Abaixo do peso';
    } else if (imc < 25.0) {
        classificacao = 'Peso normal';
    } else if (imc < 30.0) {
        classificacao = 'Sobrepeso';
    } else if (imc < 35.0) {
        classificacao = 'Obesidade grau I';
    } else if (imc < 40.0) {
        classificacao = 'Obesidade grau II';
    } else {
        classificacao = 'Obesidade grau III';
    }
    
    // Resultado formatado
    return {
        peso,
        altura,
        imc: Number(imc.toFixed(2)),
        classificacao,
        mensagem: `IMC: ${imc.toFixed(2)} - ${classificacao}`
    };
}

// Testes
const pessoa1 = calcularIMC(70, 1.75);
const pessoa2 = calcularIMC(85, 1.80);
const pessoa3 = calcularIMC(55, 1.65);

console.log('Pessoa 1:', pessoa1.mensagem);
console.log('Pessoa 2:', pessoa2.mensagem);
console.log('Pessoa 3:', pessoa3.mensagem);

// Teste com dados inválidos
console.log('Teste inválido:', calcularIMC('70', 1.75));
console.log('Teste inválido:', calcularIMC(-70, 1.75));

/*
========================================
EXERCÍCIO 2: CONVERSOR DE TEMPERATURAS
========================================

Objetivo: Criar um conversor que trabalhe com diferentes escalas
de temperatura, demonstrando conversão de tipos e operações matemáticas.

Requisitos:
1. Converter entre Celsius, Fahrenheit e Kelvin
2. Validar entrada e tratar diferentes tipos de dados
3. Retornar objeto com todas as conversões
4. Incluir informações sobre pontos de referência
5. Usar template literals para formatação

Fórmulas:
- Celsius para Fahrenheit: (C × 9/5) + 32
- Celsius para Kelvin: C + 273.15
- Fahrenheit para Celsius: (F - 32) × 5/9
- Kelvin para Celsius: K - 273.15
*/

console.log('\n--- EXERCÍCIO 2: CONVERSOR DE TEMPERATURAS ---');

// SOLUÇÃO:
class ConversorTemperatura {
    static converterDeCelsius(celsius) {
        // Validação e conversão de tipo
        const temp = Number(celsius);
        if (isNaN(temp)) {
            throw new Error('Temperatura deve ser um número válido');
        }
        
        const fahrenheit = (temp * 9/5) + 32;
        const kelvin = temp + 273.15;
        
        return {
            celsius: temp,
            fahrenheit: Number(fahrenheit.toFixed(2)),
            kelvin: Number(kelvin.toFixed(2)),
            escalaOriginal: 'Celsius'
        };
    }
    
    static converterDeFahrenheit(fahrenheit) {
        const temp = Number(fahrenheit);
        if (isNaN(temp)) {
            throw new Error('Temperatura deve ser um número válido');
        }
        
        const celsius = (temp - 32) * 5/9;
        const kelvin = celsius + 273.15;
        
        return {
            celsius: Number(celsius.toFixed(2)),
            fahrenheit: temp,
            kelvin: Number(kelvin.toFixed(2)),
            escalaOriginal: 'Fahrenheit'
        };
    }
    
    static converterDeKelvin(kelvin) {
        const temp = Number(kelvin);
        if (isNaN(temp)) {
            throw new Error('Temperatura deve ser um número válido');
        }
        
        if (temp < 0) {
            throw new Error('Kelvin não pode ser negativo (zero absoluto)');
        }
        
        const celsius = temp - 273.15;
        const fahrenheit = (celsius * 9/5) + 32;
        
        return {
            celsius: Number(celsius.toFixed(2)),
            fahrenheit: Number(fahrenheit.toFixed(2)),
            kelvin: temp,
            escalaOriginal: 'Kelvin'
        };
    }
    
    static obterPontosReferencia() {
        return {
            congelamentoAgua: this.converterDeCelsius(0),
            fervuraAgua: this.converterDeCelsius(100),
            zeroAbsoluto: this.converterDeKelvin(0),
            temperaturaCorpo: this.converterDeCelsius(37)
        };
    }
    
    static formatarResultado(resultado) {
        const { celsius, fahrenheit, kelvin, escalaOriginal } = resultado;
        return `Conversão de ${escalaOriginal}:
` +
               `  🌡️  Celsius: ${celsius}°C
` +
               `  🌡️  Fahrenheit: ${fahrenheit}°F
` +
               `  🌡️  Kelvin: ${kelvin}K`;
    }
}

// Testes
try {
    console.log('\n🔥 Conversões de temperatura:');
    
    // Teste 1: Celsius
    const temp1 = ConversorTemperatura.converterDeCelsius(25);
    console.log(ConversorTemperatura.formatarResultado(temp1));
    
    // Teste 2: Fahrenheit
    const temp2 = ConversorTemperatura.converterDeFahrenheit(77);
    console.log('\n' + ConversorTemperatura.formatarResultado(temp2));
    
    // Teste 3: Kelvin
    const temp3 = ConversorTemperatura.converterDeKelvin(300);
    console.log('\n' + ConversorTemperatura.formatarResultado(temp3));
    
    // Pontos de referência
    console.log('\n📊 Pontos de referência importantes:');
    const referencias = ConversorTemperatura.obterPontosReferencia();
    
    console.log('❄️  Congelamento da água:', referencias.congelamentoAgua.celsius + '°C');
    console.log('💨 Fervura da água:', referencias.fervuraAgua.celsius + '°C');
    console.log('🥶 Zero absoluto:', referencias.zeroAbsoluto.celsius + '°C');
    console.log('🌡️  Temperatura corporal:', referencias.temperaturaCorpo.celsius + '°C');
    
    // Teste com string (conversão automática)
    console.log('\n🔄 Teste com string:');
    const tempString = ConversorTemperatura.converterDeCelsius('30');
    console.log(`String '30' convertida: ${tempString.celsius}°C`);
    
} catch (error) {
    console.error('Erro:', error.message);
}

// Teste com dados inválidos
try {
    ConversorTemperatura.converterDeCelsius('abc');
} catch (error) {
    console.log('\n❌ Erro esperado:', error.message);
}

try {
    ConversorTemperatura.converterDeKelvin(-10);
} catch (error) {
    console.log('❌ Erro esperado:', error.message);
}

/*
========================================
EXERCÍCIO 3: ANALISADOR DE DADOS PESSOAIS
========================================

Objetivo: Criar um sistema que processe informações pessoais,
demonstrando manipulação de strings, datas, operadores lógicos
e estruturas de dados básicas.

Requisitos:
1. Processar nome completo (extrair primeiro/último nome)
2. Calcular idade a partir da data de nascimento
3. Validar e formatar CPF
4. Determinar signo zodiacal
5. Gerar relatório completo com template literals
6. Validar todos os dados de entrada
*/

console.log('\n--- EXERCÍCIO 3: ANALISADOR DE DADOS PESSOAIS ---');

// SOLUÇÃO:
class AnalisadorDadosPessoais {
    constructor() {
        this.signos = [
            { nome: 'Capricórnio', inicio: [12, 22], fim: [1, 19] },
            { nome: 'Aquário', inicio: [1, 20], fim: [2, 18] },
            { nome: 'Peixes', inicio: [2, 19], fim: [3, 20] },
            { nome: 'Áries', inicio: [3, 21], fim: [4, 19] },
            { nome: 'Touro', inicio: [4, 20], fim: [5, 20] },
            { nome: 'Gêmeos', inicio: [5, 21], fim: [6, 20] },
            { nome: 'Câncer', inicio: [6, 21], fim: [7, 22] },
            { nome: 'Leão', inicio: [7, 23], fim: [8, 22] },
            { nome: 'Virgem', inicio: [8, 23], fim: [9, 22] },
            { nome: 'Libra', inicio: [9, 23], fim: [10, 22] },
            { nome: 'Escorpião', inicio: [10, 23], fim: [11, 21] },
            { nome: 'Sagitário', inicio: [11, 22], fim: [12, 21] }
        ];
    }
    
    processarNome(nomeCompleto) {
        if (typeof nomeCompleto !== 'string' || !nomeCompleto.trim()) {
            throw new Error('Nome deve ser uma string não vazia');
        }
        
        const nomes = nomeCompleto.trim().split(/\s+/);
        
        if (nomes.length < 2) {
            throw new Error('Nome completo deve conter pelo menos nome e sobrenome');
        }
        
        return {
            nomeCompleto: nomeCompleto.trim(),
            primeiroNome: nomes[0],
            ultimoNome: nomes[nomes.length - 1],
            nomesDoMeio: nomes.slice(1, -1),
            quantidadeNomes: nomes.length,
            iniciais: nomes.map(nome => nome[0].toUpperCase()).join('.')
        };
    }
    
    calcularIdade(dataNascimento) {
        let data;
        
        if (typeof dataNascimento === 'string') {
            // Aceita formatos: DD/MM/AAAA, DD-MM-AAAA, AAAA-MM-DD
            const formatoBR = dataNascimento.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
            const formatoISO = dataNascimento.match(/^(\d{4})[\/\-](\d{2})[\/\-](\d{2})$/);
            
            if (formatoBR) {
                data = new Date(formatoBR[3], formatoBR[2] - 1, formatoBR[1]);
            } else if (formatoISO) {
                data = new Date(formatoISO[1], formatoISO[2] - 1, formatoISO[3]);
            } else {
                throw new Error('Formato de data inválido. Use DD/MM/AAAA ou AAAA-MM-DD');
            }
        } else if (dataNascimento instanceof Date) {
            data = dataNascimento;
        } else {
            throw new Error('Data deve ser string ou objeto Date');
        }
        
        if (isNaN(data.getTime())) {
            throw new Error('Data inválida');
        }
        
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const anoNascimento = data.getFullYear();
        
        let idade = anoAtual - anoNascimento;
        
        // Ajustar se ainda não fez aniversário este ano
        const mesAtual = hoje.getMonth();
        const diaAtual = hoje.getDate();
        const mesNascimento = data.getMonth();
        const diaNascimento = data.getDate();
        
        if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
            idade--;
        }
        
        if (idade < 0) {
            throw new Error('Data de nascimento não pode ser no futuro');
        }
        
        return {
            idade,
            dataNascimento: data,
            proximoAniversario: this.calcularProximoAniversario(data),
            diasParaAniversario: this.calcularDiasParaAniversario(data)
        };
    }
    
    calcularProximoAniversario(dataNascimento) {
        const hoje = new Date();
        const anoAtual = hoje.getFullYear();
        const proximoAniversario = new Date(anoAtual, dataNascimento.getMonth(), dataNascimento.getDate());
        
        if (proximoAniversario < hoje) {
            proximoAniversario.setFullYear(anoAtual + 1);
        }
        
        return proximoAniversario;
    }
    
    calcularDiasParaAniversario(dataNascimento) {
        const proximoAniversario = this.calcularProximoAniversario(dataNascimento);
        const hoje = new Date();
        const diferenca = proximoAniversario - hoje;
        return Math.ceil(diferenca / (1000 * 60 * 60 * 24));
    }
    
    validarCPF(cpf) {
        if (typeof cpf !== 'string') {
            cpf = String(cpf);
        }
        
        // Remove caracteres não numéricos
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        if (cpfLimpo.length !== 11) {
            return { valido: false, erro: 'CPF deve ter 11 dígitos' };
        }
        
        // Verifica se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
            return { valido: false, erro: 'CPF não pode ter todos os dígitos iguais' };
        }
        
        // Validação dos dígitos verificadores
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpfLimpo[i]) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo[9])) {
            return { valido: false, erro: 'Primeiro dígito verificador inválido' };
        }
        
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpfLimpo[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpfLimpo[10])) {
            return { valido: false, erro: 'Segundo dígito verificador inválido' };
        }
        
        return {
            valido: true,
            cpfOriginal: cpf,
            cpfLimpo,
            cpfFormatado: cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
        };
    }
    
    determinarSigno(dataNascimento) {
        const data = dataNascimento instanceof Date ? dataNascimento : new Date(dataNascimento);
        const mes = data.getMonth() + 1; // getMonth() retorna 0-11
        const dia = data.getDate();
        
        for (const signo of this.signos) {
            const [mesInicio, diaInicio] = signo.inicio;
            const [mesFim, diaFim] = signo.fim;
            
            // Signo que cruza o ano (Capricórnio)
            if (mesInicio > mesFim) {
                if ((mes === mesInicio && dia >= diaInicio) || (mes === mesFim && dia <= diaFim)) {
                    return signo.nome;
                }
            } else {
                if ((mes === mesInicio && dia >= diaInicio) || 
                    (mes === mesFim && dia <= diaFim) || 
                    (mes > mesInicio && mes < mesFim)) {
                    return signo.nome;
                }
            }
        }
        
        return 'Não determinado';
    }
    
    analisar(dadosPessoais) {
        const { nome, dataNascimento, cpf } = dadosPessoais;
        
        try {
            // Processar cada componente
            const infoNome = this.processarNome(nome);
            const infoIdade = this.calcularIdade(dataNascimento);
            const infoCPF = this.validarCPF(cpf);
            const signo = this.determinarSigno(infoIdade.dataNascimento);
            
            // Verificar se CPF é válido
            if (!infoCPF.valido) {
                throw new Error(`CPF inválido: ${infoCPF.erro}`);
            }
            
            // Gerar relatório
            const relatorio = this.gerarRelatorio({
                nome: infoNome,
                idade: infoIdade,
                cpf: infoCPF,
                signo
            });
            
            return {
                sucesso: true,
                dados: {
                    nome: infoNome,
                    idade: infoIdade,
                    cpf: infoCPF,
                    signo
                },
                relatorio
            };
            
        } catch (error) {
            return {
                sucesso: false,
                erro: error.message
            };
        }
    }
    
    gerarRelatorio(dados) {
        const { nome, idade, cpf, signo } = dados;
        
        return `
╔══════════════════════════════════════════════════════════════╗
║                    RELATÓRIO DE DADOS PESSOAIS              ║
╠══════════════════════════════════════════════════════════════╣
║ 👤 INFORMAÇÕES PESSOAIS                                     ║
║    Nome completo: ${nome.nomeCompleto.padEnd(42)} ║
║    Primeiro nome: ${nome.primeiroNome.padEnd(42)} ║
║    Último nome: ${nome.ultimoNome.padEnd(44)} ║
║    Iniciais: ${nome.iniciais.padEnd(47)} ║
║    Quantidade de nomes: ${String(nome.quantidadeNomes).padEnd(36)} ║
║                                                              ║
║ 🎂 INFORMAÇÕES DE IDADE                                      ║
║    Idade atual: ${String(idade.idade).padEnd(44)} anos ║
║    Data de nascimento: ${idade.dataNascimento.toLocaleDateString('pt-BR').padEnd(33)} ║
║    Próximo aniversário: ${idade.proximoAniversario.toLocaleDateString('pt-BR').padEnd(32)} ║
║    Dias para aniversário: ${String(idade.diasParaAniversario).padEnd(34)} dias ║
║                                                              ║
║ 📄 DOCUMENTAÇÃO                                              ║
║    CPF: ${cpf.cpfFormatado.padEnd(50)} ║
║    Status: Válido ✅                                         ║
║                                                              ║
║ ♈ ASTROLOGIA                                                ║
║    Signo: ${signo.padEnd(48)} ║
╚══════════════════════════════════════════════════════════════╝`;
    }
}

// Testes
console.log('\n👤 Analisando dados pessoais:');

const analisador = new AnalisadorDadosPessoais();

// Teste 1: Dados válidos
const pessoa1 = {
    nome: 'João Silva Santos',
    dataNascimento: '15/03/1990',
    cpf: '123.456.789-09'
};

const resultado1 = analisador.analisar(pessoa1);
if (resultado1.sucesso) {
    console.log(resultado1.relatorio);
} else {
    console.log('❌ Erro:', resultado1.erro);
}

// Teste 2: Dados com diferentes formatos
const pessoa2 = {
    nome: 'Maria Fernanda Costa Lima',
    dataNascimento: '1985-12-25',
    cpf: '98765432100'
};

const resultado2 = analisador.analisar(pessoa2);
if (resultado2.sucesso) {
    console.log('\n📊 Dados processados com sucesso!');
    console.log(`Nome: ${resultado2.dados.nome.nomeCompleto}`);
    console.log(`Idade: ${resultado2.dados.idade.idade} anos`);
    console.log(`Signo: ${resultado2.dados.signo}`);
    console.log(`CPF: ${resultado2.dados.cpf.cpfFormatado}`);
} else {
    console.log('❌ Erro:', resultado2.erro);
}

// Teste 3: Dados inválidos
const pessoa3 = {
    nome: 'Ana',
    dataNascimento: '30/02/1990', // Data inválida
    cpf: '111.111.111-11' // CPF inválido
};

const resultado3 = analisador.analisar(pessoa3);
if (!resultado3.sucesso) {
    console.log('\n❌ Erro esperado:', resultado3.erro);
}

// Teste 4: Validação individual de CPF
console.log('\n🔍 Testando validação de CPF:');
const cpfsParaTeste = [
    '123.456.789-09',
    '111.111.111-11',
    '12345678901',
    '123.456.789-10'
];

cpfsParaTeste.forEach(cpf => {
    const validacao = analisador.validarCPF(cpf);
    if (validacao.valido) {
        console.log(`✅ ${cpf} → ${validacao.cpfFormatado}`);
    } else {
        console.log(`❌ ${cpf} → ${validacao.erro}`);
    }
});

console.log('\n=== EXERCÍCIOS CONCEITOS BÁSICOS CONCLUÍDOS ===');
console.log('\n🎯 Conceitos praticados:');
console.log('✅ Declaração e manipulação de variáveis');
console.log('✅ Tipos de dados primitivos e objetos');
console.log('✅ Operadores aritméticos, lógicos e de comparação');
console.log('✅ Conversão automática e manual de tipos');
console.log('✅ Template literals e formatação de strings');
console.log('✅ Validação de dados e tratamento de erros');
console.log('✅ Estruturas condicionais básicas');
console.log('✅ Manipulação de datas e strings');
console.log('✅ Criação de classes e métodos');
console.log('✅ Uso de arrays e objetos');

/*
========================================
DESAFIOS EXTRAS (OPCIONAL)
========================================

1. CALCULADORA CIENTÍFICA:
   - Adicione operações como potência, raiz, logaritmo
   - Implemente histórico de cálculos
   - Adicione validação para operações inválidas

2. CONVERSOR UNIVERSAL:
   - Adicione conversões de moeda (com API)
   - Implemente conversões de unidades (peso, distância)
   - Crie interface para múltiplas conversões

3. SISTEMA DE PERFIL COMPLETO:
   - Adicione validação de email e telefone
   - Implemente cálculo de compatibilidade astrológica
   - Crie gerador de senhas seguras
   - Adicione análise de força de senha

4. ANALISADOR DE TEXTO:
   - Conte palavras, caracteres, parágrafos
   - Identifique palavras mais frequentes
   - Calcule tempo estimado de leitura
   - Analise complexidade do texto

5. GERADOR DE DADOS ALEATÓRIOS:
   - Gere CPFs válidos aleatórios
   - Crie nomes e sobrenomes brasileiros
   - Implemente gerador de datas aleatórias
   - Adicione gerador de endereços fictícios
*/