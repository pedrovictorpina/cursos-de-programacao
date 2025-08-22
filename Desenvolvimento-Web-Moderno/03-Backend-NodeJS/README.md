# Cursos de Programação

## 📚 Estrutura dos Cursos

Este repositório contém cursos completos de programação organizados por linguagem, seguindo uma metodologia pedagógica estruturada.

# Módulo 3: Backend Node.js

## 📋 Visão Geral

Este módulo aborda o desenvolvimento backend completo com Node.js, cobrindo desde os fundamentos até técnicas avançadas de desenvolvimento, teste e debugging. O conteúdo é estruturado de forma progressiva, permitindo que você construa uma base sólida e evolua para conceitos mais complexos.

## 🎯 Objetivos de Aprendizagem

Ao final deste módulo, você será capaz de:

- **Fundamentos Node.js**: Compreender o runtime, Event Loop, módulos e sistema de arquivos
- **APIs RESTful**: Criar APIs robustas seguindo princípios REST e boas práticas
- **Autenticação/Autorização**: Implementar sistemas seguros com JWT, OAuth 2.0 e criptografia
- **Bancos de Dados**: Integrar com MongoDB e PostgreSQL usando ORMs/ODMs
- **Testes e Debugging**: Desenvolver testes abrangentes e técnicas avançadas de debugging

## 📚 Conteúdo do Módulo

### 1. Fundamentos Node.js (`01-fundamentos-nodejs.js`)
- **Runtime e V8**: Compreensão do motor JavaScript e Event Loop
- **Módulos**: CommonJS vs ES Modules, criação e importação
- **Sistema de Arquivos**: Manipulação de arquivos e streams
- **Servidores HTTP**: Criação de servidores básicos
- **Utilitários**: Path, URL, crypto e outras APIs nativas

### 2. APIs RESTful (`02-apis-restful.js`)
- **Princípios REST**: Recursos, métodos HTTP, status codes
- **Express Framework**: Roteamento, middleware, tratamento de erros
- **Arquitetura**: Estrutura de projeto profissional
- **Middlewares**: CORS, autenticação, validação, rate limiting
- **Controllers**: Organização e implementação de endpoints

### 3. Autenticação e Autorização (`03-autenticacao-autorizacao.js`)
- **Conceitos de Segurança**: Autenticação vs autorização, criptografia
- **JWT (JSON Web Tokens)**: Geração, verificação, refresh tokens
- **Criptografia**: Hash de senhas, criptografia simétrica
- **OAuth 2.0**: Fluxo de autorização, integração com provedores
- **Middleware de Segurança**: Proteção de rotas, roles e permissões

### 4. Bancos de Dados (`04-bancos-dados.js`)
- **Tipos de Bancos**: Relacionais vs NoSQL, ACID vs BASE
- **MongoDB + Mongoose**: ODM, schemas, validações, queries
- **PostgreSQL + Sequelize**: ORM, modelos, associações, migrations
- **Queries Avançadas**: Agregações, joins, otimização
- **Performance**: Índices, connection pooling, cache

### 5. Testes e Debugging (`05-testes-debugging.js`)
- **Tipos de Testes**: Unitários, integração, E2E
- **Frameworks**: Jest, Mocha, Supertest, Cypress
- **Mocking**: Simulação de dependências e APIs
- **Debugging**: Técnicas avançadas, profiling, logging
- **CI/CD**: Pipeline automatizado de testes

## 🛠️ Tecnologias Utilizadas

### Core Technologies
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web minimalista
- **JavaScript ES6+**: Sintaxe moderna

### Bancos de Dados
- **MongoDB**: Banco NoSQL orientado a documentos
- **Mongoose**: ODM para MongoDB
- **PostgreSQL**: Banco relacional avançado
- **Sequelize**: ORM para bancos SQL

### Autenticação
- **JWT**: JSON Web Tokens
- **bcrypt**: Hash de senhas
- **OAuth 2.0**: Protocolo de autorização

### Testes
- **Jest**: Framework de testes
- **Supertest**: Testes de APIs HTTP
- **Cypress**: Testes E2E
- **Sinon**: Mocking e stubbing

### Ferramentas
- **Nodemon**: Auto-reload em desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código
- **Postman**: Testes manuais de API

## 💻 Exercícios Práticos

### Exercícios Básicos
1. **Servidor HTTP Básico**
   - Criar servidor com Node.js puro
   - Implementar roteamento manual
   - Servir arquivos estáticos

2. **API REST Simples**
   - CRUD de usuários com Express
   - Middleware de logging
   - Validação de dados

3. **Autenticação JWT**
   - Sistema de login/registro
   - Proteção de rotas
   - Refresh tokens

### Exercícios Intermediários
4. **Integração com Banco**
   - Modelos com Mongoose/Sequelize
   - Relacionamentos entre entidades
   - Migrations e seeds

5. **API Completa**
   - Sistema de posts e comentários
   - Upload de arquivos
   - Paginação e filtros

6. **Testes Automatizados**
   - Testes unitários com Jest
   - Testes de integração com Supertest
   - Coverage de código

### Exercícios Avançados
7. **Sistema de Permissões**
   - Roles e permissões granulares
   - Middleware de autorização
   - Auditoria de ações

8. **Performance e Escalabilidade**
   - Cache com Redis
   - Rate limiting
   - Otimização de queries

9. **Monitoramento**
   - Logging estruturado
   - Métricas de performance
   - Health checks

### 🚀 Projeto Integrado: Sistema de Blog Completo

**Descrição**: Desenvolver uma API completa para um sistema de blog com todas as funcionalidades aprendidas.

**Funcionalidades**:
- ✅ Autenticação JWT com refresh tokens
- ✅ Sistema de usuários com roles (admin, editor, leitor)
- ✅ CRUD completo de posts com categorias e tags
- ✅ Sistema de comentários aninhados
- ✅ Upload de imagens com redimensionamento
- ✅ Sistema de likes e favoritos
- ✅ Busca full-text com filtros avançados
- ✅ Paginação e ordenação
- ✅ Rate limiting e cache
- ✅ Testes abrangentes (unitários, integração, E2E)
- ✅ Documentação da API com Swagger
- ✅ Pipeline CI/CD automatizado

**Tecnologias**:
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- Jest + Supertest
- Redis (cache)
- Multer (upload)
- Swagger (documentação)

## 📖 Recursos Adicionais

### Documentação Oficial
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Sequelize Documentation](https://sequelize.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/)

### Ferramentas Recomendadas
- **Postman**: Testes manuais de API
- **MongoDB Compass**: GUI para MongoDB
- **pgAdmin**: Administração PostgreSQL
- **VS Code**: Editor com extensões Node.js
- **Docker**: Containerização de aplicações

### Bibliotecas Úteis
- **helmet**: Segurança HTTP
- **cors**: Cross-Origin Resource Sharing
- **morgan**: Logging de requisições
- **joi**: Validação de schemas
- **multer**: Upload de arquivos
- **nodemailer**: Envio de emails
- **socket.io**: WebSockets

### Padrões e Arquiteturas
- **MVC**: Model-View-Controller
- **Repository Pattern**: Abstração de dados
- **Dependency Injection**: Inversão de controle
- **Clean Architecture**: Arquitetura limpa
- **Microservices**: Arquitetura distribuída

## 📊 Critérios de Avaliação

### Conhecimento Técnico (40%)
- Compreensão dos fundamentos Node.js
- Implementação correta de APIs REST
- Uso adequado de bancos de dados
- Aplicação de conceitos de segurança

### Qualidade do Código (30%)
- Estrutura e organização
- Boas práticas e padrões
- Tratamento de erros
- Documentação adequada

### Testes (20%)
- Cobertura de testes
- Qualidade dos testes
- Estratégias de teste
- Debugging eficaz

### Projeto Prático (10%)
- Funcionalidades implementadas
- Integração entre componentes
- Performance e escalabilidade
- Deploy e CI/CD

## 📋 Entregáveis

1. **Exercícios Básicos**: Implementações dos 3 primeiros exercícios
2. **Exercícios Intermediários**: Implementações dos exercícios 4-6
3. **Exercícios Avançados**: Implementações dos exercícios 7-9
4. **Projeto Final**: Sistema de blog completo com documentação
5. **Relatório Técnico**: Análise das decisões arquiteturais e aprendizados

## 🎯 Próximos Passos

Após concluir este módulo, você estará preparado para:

1. **Módulo 4 - TypeScript e Ferramentas**:
   - Tipagem estática com TypeScript
   - Build tools e bundlers
   - Testes avançados
   - Ferramentas de desenvolvimento

2. **Módulo 5 - Projeto Integrado**:
   - Aplicação full-stack completa
   - Deploy em produção
   - CI/CD avançado
   - Monitoramento e observabilidade

## 💡 Dicas de Estudo

### Para Iniciantes
- 📚 Comece pelos fundamentos do Node.js
- 🔄 Pratique cada conceito com exercícios
- 🧪 Sempre teste seu código
- 📖 Leia a documentação oficial

### Para Intermediários
- 🏗️ Foque na arquitetura e padrões
- 🔒 Priorize segurança desde o início
- ⚡ Otimize performance continuamente
- 🤝 Colabore em projetos open source

### Para Avançados
- 🚀 Explore tecnologias emergentes
- 📊 Implemente observabilidade
- 🔄 Contribua para a comunidade
- 🎯 Mentore outros desenvolvedores

## 🆘 Suporte

Se você encontrar dificuldades:

1. **Consulte a documentação** dos arquivos do módulo
2. **Revise os conceitos** fundamentais
3. **Pratique com exercícios** adicionais
4. **Busque ajuda** na comunidade
5. **Experimente** diferentes abordagens

---

**Lembre-se**: O desenvolvimento backend é uma jornada contínua de aprendizado. Seja paciente, pratique regularmente e não hesite em experimentar novas tecnologias e abordagens!

### 🎯 Metodologia

Cada curso segue o padrão:
- **Teoria**: Conceitos fundamentais explicados de forma clara
- **Exemplos**: Código prático demonstrando os conceitos
- **Exercícios**: 3 exercícios por módulo para fixação
- **Dicas**: Boas práticas e otimizações
- **Referências**: Links para aprofundamento

### 📁 Estrutura de Pastas

```
├── JavaScript/
│   ├── 01-Fundamentos/
│   │   ├── 01-variaveis-tipos-dados.js
│   │   ├── 02-operadores-expressoes.js
│   │   └── 03-conversao-tipos.js
│   ├── 02-Controle-Fluxo/
│   │   └── 01-estruturas-condicionais.js
│   ├── 03-Funcoes/
│   ├── 04-Objetos/
│   ├── 05-Arrays/
│   ├── 06-DOM/
│   ├── 07-Eventos/
│   ├── 08-Assincronismo/
│   ├── 09-ES6-Plus/
│   ├── 10-Padroes/
│   ├── 11-Qualidade/
│   └── exercicios/
├── Python/ (em desenvolvimento)
├── Java/ (em desenvolvimento)
├── CSharp/ (em desenvolvimento)
├── TypeScript/ (em desenvolvimento)
└── Go/ (em desenvolvimento)
```

## 🚀 Como Usar

### Para Estudantes
1. Navegue até a pasta da linguagem desejada
2. Comece pelo módulo 01-Fundamentos
3. Leia a teoria, analise os exemplos
4. Pratique com os exercícios na pasta `exercicios/`
5. Avance para o próximo módulo

### Para Contribuidores
1. Clone o repositório
2. Crie uma branch para sua contribuição
3. Siga o padrão estabelecido nos módulos existentes
4. Teste todos os exemplos e exercícios
5. Faça um pull request

## 📋 Status dos Cursos

- ✅ **JavaScript**: Módulos 1-2 completos, demais em desenvolvimento
- 🔄 **Python**: Planejado
- 🔄 **Java**: Planejado
- 🔄 **C#**: Planejado
- 🔄 **TypeScript**: Planejado
- 🔄 **Go**: Planejado

## 🎓 Próximos Passos para Continuar o Desenvolvimento

### No Trae AI (outro dispositivo):

1. **Abra o projeto**:
   ```bash
   cd caminho/para/cursos-de-programacao
   ```

2. **Continue a partir da lista de tarefas**:
   - Finalizar subpastas temáticas do JavaScript
   - Aprimorar módulos JavaScript existentes
   - Criar cursos para outras linguagens

3. **Comando para o Trae AI**:
   ```
   Continue desenvolvendo os cursos de programação. Estou trabalhando na criação de subpastas temáticas dentro da pasta JavaScript e preciso finalizar todos os módulos restantes, depois expandir para Python, Java, C#, TypeScript e Go.
   ```

### Estrutura de Desenvolvimento Recomendada:

#### JavaScript (finalizar):
- ✅ 01-Fundamentos (parcialmente completo)
- 🔄 02-Controle-Fluxo (em andamento)
- ⏳ 03-Funcoes
- ⏳ 04-Objetos
- ⏳ 05-Arrays
- ⏳ 06-DOM
- ⏳ 07-Eventos
- ⏳ 08-Assincronismo
- ⏳ 09-ES6-Plus
- ⏳ 10-Padroes
- ⏳ 11-Qualidade

#### Outras Linguagens:
Cada linguagem seguirá estrutura similar adaptada às suas especificidades.

## 🛠️ Ferramentas Recomendadas

- **IDE**: Trae AI, VS Code, ou similar
- **Controle de Versão**: Git
- **Testes**: Node.js para JavaScript, pytest para Python, etc.

## 📞 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Última atualização**: Janeiro 2025
**Versão**: 1.0.0-beta