/**
 * MÓDULO 3: BACKEND NODE.JS
 * Arquivo 4: Bancos de Dados
 * 
 * Este arquivo aborda:
 * - Conceitos de bancos de dados relacionais e não-relacionais
 * - Integração com MongoDB (Mongoose)
 * - Integração com PostgreSQL/MySQL (Sequelize)
 * - Migrations e Seeds
 * - Queries avançadas e otimização
 * - Transações e consistência de dados
 * 
 * Autor: Professor de Programação
 * Data: 2024
 */

// ===== CONCEITOS FUNDAMENTAIS =====

/**
 * TIPOS DE BANCOS DE DADOS
 * 
 * 1. RELACIONAIS (SQL)
 * - Estrutura: Tabelas com relacionamentos
 * - ACID: Atomicidade, Consistência, Isolamento, Durabilidade
 * - Exemplos: PostgreSQL, MySQL, SQLite
 * 
 * 2. NÃO-RELACIONAIS (NoSQL)
 * - Estrutura: Documentos, chave-valor, grafos
 * - BASE: Basically Available, Soft state, Eventual consistency
 * - Exemplos: MongoDB, Redis, Cassandra
 */

class DatabaseConcepts {
  // Demonstração de conceitos ACID
  static demonstrateACID() {
    console.log('\n=== CONCEITOS ACID ===');
    
    // Atomicidade: Tudo ou nada
    console.log('Atomicidade: Transação completa ou rollback total');
    
    // Consistência: Regras de integridade
    console.log('Consistência: Dados sempre válidos');
    
    // Isolamento: Transações independentes
    console.log('Isolamento: Transações não interferem entre si');
    
    // Durabilidade: Persistência garantida
    console.log('Durabilidade: Dados persistem após commit');
  }
  
  // Demonstração de conceitos BASE
  static demonstrateBASE() {
    console.log('\n=== CONCEITOS BASE ===');
    
    // Basically Available: Sistema sempre disponível
    console.log('Basically Available: Alta disponibilidade');
    
    // Soft state: Estado pode mudar
    console.log('Soft state: Dados podem estar inconsistentes temporariamente');
    
    // Eventual consistency: Consistência eventual
    console.log('Eventual consistency: Dados se tornam consistentes com o tempo');
  }
}

// ===== MONGODB COM MONGOOSE (SIMULADO) =====

/**
 * SIMULAÇÃO DO MONGOOSE
 * 
 * O Mongoose é um ODM (Object Document Mapper) para MongoDB
 * Fornece validação, casting, queries e middleware
 */

// Simulação da conexão com MongoDB
class MongooseSimulator {
  static connection = null;
  static models = new Map();
  
  // Conectar ao MongoDB
  static async connect(uri, options = {}) {
    console.log(`Conectando ao MongoDB: ${uri}`);
    
    // Simulação de conexão
    this.connection = {
      readyState: 1, // Conectado
      host: 'localhost',
      port: 27017,
      name: 'curso_web_moderno'
    };
    
    console.log('✅ Conectado ao MongoDB com sucesso!');
    return this.connection;
  }
  
  // Criar schema
  static Schema(definition, options = {}) {
    return {
      definition,
      options,
      methods: {},
      statics: {},
      
      // Adicionar métodos de instância
      method(name, fn) {
        this.methods[name] = fn;
        return this;
      },
      
      // Adicionar métodos estáticos
      static(name, fn) {
        this.statics[name] = fn;
        return this;
      },
      
      // Middleware pre
      pre(hook, fn) {
        console.log(`Middleware pre-${hook} registrado`);
        return this;
      },
      
      // Middleware post
      post(hook, fn) {
        console.log(`Middleware post-${hook} registrado`);
        return this;
      }
    };
  }
  
  // Criar modelo
  static model(name, schema) {
    const Model = class {
      constructor(data = {}) {
        Object.assign(this, data);
        this._id = this._id || this.generateId();
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date();
      }
      
      generateId() {
        return Math.random().toString(36).substr(2, 9);
      }
      
      // Salvar documento
      async save() {
        console.log(`Salvando ${name}:`, this);
        this.updatedAt = new Date();
        return this;
      }
      
      // Remover documento
      async remove() {
        console.log(`Removendo ${name}:`, this._id);
        return this;
      }
      
      // Converter para JSON
      toJSON() {
        const obj = { ...this };
        delete obj.generateId;
        return obj;
      }
    };
    
    // Métodos estáticos do modelo
    Model.find = async function(query = {}) {
      console.log(`Buscando ${name} com query:`, query);
      return [new Model({ name: `${name} exemplo`, ...query })];
    };
    
    Model.findById = async function(id) {
      console.log(`Buscando ${name} por ID:`, id);
      return new Model({ _id: id, name: `${name} ${id}` });
    };
    
    Model.findOne = async function(query) {
      console.log(`Buscando um ${name} com query:`, query);
      return new Model({ name: `${name} único`, ...query });
    };
    
    Model.create = async function(data) {
      console.log(`Criando ${name}:`, data);
      return new Model(data);
    };
    
    Model.updateOne = async function(query, update) {
      console.log(`Atualizando ${name}:`, { query, update });
      return { modifiedCount: 1 };
    };
    
    Model.deleteOne = async function(query) {
      console.log(`Removendo ${name}:`, query);
      return { deletedCount: 1 };
    };
    
    // Adicionar métodos do schema
    Object.assign(Model, schema.statics);
    Object.assign(Model.prototype, schema.methods);
    
    this.models.set(name, Model);
    return Model;
  }
}

// Schemas de exemplo
const userSchema = MongooseSimulator.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    avatar: String,
    bio: String,
    location: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware pre-save
userSchema.pre('save', function() {
  console.log('Executando middleware pre-save para usuário');
  // Aqui normalmente hashearíamos a senha
});

// Método de instância
userSchema.method('getPublicProfile', function() {
  const { password, ...publicData } = this.toJSON();
  return publicData;
});

// Método estático
userSchema.static('findByEmail', async function(email) {
  return this.findOne({ email });
});

const User = MongooseSimulator.model('User', userSchema);

// Schema de produto
const productSchema = MongooseSimulator.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
});

const Product = MongooseSimulator.model('Product', productSchema);

// ===== POSTGRESQL/MYSQL COM SEQUELIZE (SIMULADO) =====

/**
 * SIMULAÇÃO DO SEQUELIZE
 * 
 * O Sequelize é um ORM (Object Relational Mapper) para bancos SQL
 * Suporta PostgreSQL, MySQL, MariaDB, SQLite e Microsoft SQL Server
 */

class SequelizeSimulator {
  constructor(database, username, password, options = {}) {
    this.database = database;
    this.username = username;
    this.options = options;
    this.models = new Map();
    this.connected = false;
  }
  
  // Conectar ao banco
  async authenticate() {
    console.log(`Conectando ao ${this.options.dialect || 'postgres'}: ${this.database}`);
    this.connected = true;
    console.log('✅ Conectado ao banco SQL com sucesso!');
  }
  
  // Sincronizar modelos
  async sync(options = {}) {
    console.log('Sincronizando modelos com o banco...');
    if (options.force) {
      console.log('⚠️  Recriando todas as tabelas (force: true)');
    }
    console.log('✅ Sincronização concluída!');
  }
  
  // Definir modelo
  define(modelName, attributes, options = {}) {
    const Model = class {
      constructor(data = {}) {
        Object.assign(this, data);
        this.id = this.id || Math.floor(Math.random() * 1000);
        this.createdAt = this.createdAt || new Date();
        this.updatedAt = new Date();
      }
      
      // Salvar instância
      async save() {
        console.log(`Salvando ${modelName}:`, this);
        this.updatedAt = new Date();
        return this;
      }
      
      // Atualizar instância
      async update(values) {
        Object.assign(this, values);
        this.updatedAt = new Date();
        console.log(`Atualizando ${modelName}:`, this);
        return this;
      }
      
      // Remover instância
      async destroy() {
        console.log(`Removendo ${modelName}:`, this.id);
        return this;
      }
      
      // Recarregar do banco
      async reload() {
        console.log(`Recarregando ${modelName}:`, this.id);
        return this;
      }
    };
    
    // Métodos estáticos
    Model.findAll = async function(options = {}) {
      console.log(`SELECT * FROM ${modelName.toLowerCase()}s`, options);
      return [new Model({ name: `${modelName} exemplo` })];
    };
    
    Model.findByPk = async function(id, options = {}) {
      console.log(`SELECT * FROM ${modelName.toLowerCase()}s WHERE id = ${id}`);
      return new Model({ id, name: `${modelName} ${id}` });
    };
    
    Model.findOne = async function(options = {}) {
      console.log(`SELECT * FROM ${modelName.toLowerCase()}s LIMIT 1`, options);
      return new Model({ name: `${modelName} único` });
    };
    
    Model.create = async function(values, options = {}) {
      console.log(`INSERT INTO ${modelName.toLowerCase()}s`, values);
      return new Model(values);
    };
    
    Model.update = async function(values, options) {
      console.log(`UPDATE ${modelName.toLowerCase()}s SET`, values, 'WHERE', options.where);
      return [1]; // Número de linhas afetadas
    };
    
    Model.destroy = async function(options) {
      console.log(`DELETE FROM ${modelName.toLowerCase()}s WHERE`, options.where);
      return 1; // Número de linhas removidas
    };
    
    Model.count = async function(options = {}) {
      console.log(`SELECT COUNT(*) FROM ${modelName.toLowerCase()}s`, options);
      return Math.floor(Math.random() * 100);
    };
    
    // Associações
    Model.hasMany = function(target, options = {}) {
      console.log(`${modelName} hasMany ${target.name}`);
    };
    
    Model.belongsTo = function(target, options = {}) {
      console.log(`${modelName} belongsTo ${target.name}`);
    };
    
    Model.belongsToMany = function(target, options = {}) {
      console.log(`${modelName} belongsToMany ${target.name}`);
    };
    
    this.models.set(modelName, Model);
    return Model;
  }
  
  // Tipos de dados
  static DataTypes = {
    STRING: 'VARCHAR(255)',
    TEXT: 'TEXT',
    INTEGER: 'INTEGER',
    BIGINT: 'BIGINT',
    FLOAT: 'FLOAT',
    DOUBLE: 'DOUBLE',
    DECIMAL: 'DECIMAL',
    BOOLEAN: 'BOOLEAN',
    DATE: 'TIMESTAMP',
    DATEONLY: 'DATE',
    TIME: 'TIME',
    JSON: 'JSON',
    JSONB: 'JSONB',
    UUID: 'UUID',
    ENUM: (values) => `ENUM(${values.map(v => `'${v}'`).join(', ')})`
  };
  
  // Executar query raw
  async query(sql, options = {}) {
    console.log('Executando query SQL:', sql);
    return {
      rows: [{ id: 1, name: 'Resultado exemplo' }],
      metadata: { affectedRows: 1 }
    };
  }
  
  // Transação
  async transaction(callback) {
    console.log('Iniciando transação...');
    const transaction = {
      commit: () => console.log('✅ Transação commitada'),
      rollback: () => console.log('❌ Transação revertida')
    };
    
    try {
      const result = await callback(transaction);
      transaction.commit();
      return result;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  }
}

// Configuração do Sequelize
const sequelize = new SequelizeSimulator('curso_web_moderno', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Modelos Sequelize
const UserSQL = sequelize.define('User', {
  id: {
    type: SequelizeSimulator.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: SequelizeSimulator.DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: SequelizeSimulator.DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: SequelizeSimulator.DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  role: {
    type: SequelizeSimulator.DataTypes.ENUM(['user', 'admin']),
    defaultValue: 'user'
  },
  isActive: {
    type: SequelizeSimulator.DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  paranoid: true, // Soft delete
  hooks: {
    beforeCreate: (user) => {
      console.log('Hook beforeCreate executado para usuário');
    },
    afterCreate: (user) => {
      console.log('Hook afterCreate executado para usuário');
    }
  }
});

const ProductSQL = sequelize.define('Product', {
  id: {
    type: SequelizeSimulator.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: SequelizeSimulator.DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: SequelizeSimulator.DataTypes.TEXT
  },
  price: {
    type: SequelizeSimulator.DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  stock: {
    type: SequelizeSimulator.DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  categoryId: {
    type: SequelizeSimulator.DataTypes.INTEGER,
    references: {
      model: 'Categories',
      key: 'id'
    }
  }
});

// Associações
UserSQL.hasMany(ProductSQL, { foreignKey: 'userId', as: 'products' });
ProductSQL.belongsTo(UserSQL, { foreignKey: 'userId', as: 'user' });

// ===== MIGRATIONS E SEEDS =====

/**
 * SISTEMA DE MIGRATIONS
 * 
 * Migrations permitem versionar e evoluir o schema do banco
 * de forma controlada e reversível
 */

class MigrationSystem {
  static migrations = [];
  static executedMigrations = new Set();
  
  // Registrar migration
  static addMigration(name, up, down) {
    this.migrations.push({ name, up, down, timestamp: Date.now() });
  }
  
  // Executar migrations pendentes
  static async runMigrations() {
    console.log('\n=== EXECUTANDO MIGRATIONS ===');
    
    for (const migration of this.migrations) {
      if (!this.executedMigrations.has(migration.name)) {
        console.log(`Executando migration: ${migration.name}`);
        await migration.up();
        this.executedMigrations.add(migration.name);
        console.log(`✅ Migration ${migration.name} executada`);
      }
    }
  }
  
  // Reverter última migration
  static async rollbackMigration() {
    const lastMigration = [...this.executedMigrations].pop();
    if (lastMigration) {
      const migration = this.migrations.find(m => m.name === lastMigration);
      console.log(`Revertendo migration: ${migration.name}`);
      await migration.down();
      this.executedMigrations.delete(migration.name);
      console.log(`✅ Migration ${migration.name} revertida`);
    }
  }
}

// Migrations de exemplo
MigrationSystem.addMigration(
  '001_create_users_table',
  async () => {
    console.log('CREATE TABLE users (id, name, email, password, created_at, updated_at)');
  },
  async () => {
    console.log('DROP TABLE users');
  }
);

MigrationSystem.addMigration(
  '002_add_role_to_users',
  async () => {
    console.log('ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT \'user\'');
  },
  async () => {
    console.log('ALTER TABLE users DROP COLUMN role');
  }
);

MigrationSystem.addMigration(
  '003_create_products_table',
  async () => {
    console.log('CREATE TABLE products (id, name, description, price, stock, user_id, created_at, updated_at)');
  },
  async () => {
    console.log('DROP TABLE products');
  }
);

/**
 * SISTEMA DE SEEDS
 * 
 * Seeds permitem popular o banco com dados iniciais
 * para desenvolvimento e testes
 */

class SeedSystem {
  static seeds = [];
  
  // Registrar seed
  static addSeed(name, run) {
    this.seeds.push({ name, run });
  }
  
  // Executar seeds
  static async runSeeds() {
    console.log('\n=== EXECUTANDO SEEDS ===');
    
    for (const seed of this.seeds) {
      console.log(`Executando seed: ${seed.name}`);
      await seed.run();
      console.log(`✅ Seed ${seed.name} executado`);
    }
  }
}

// Seeds de exemplo
SeedSystem.addSeed('users', async () => {
  const users = [
    { name: 'Admin', email: 'admin@exemplo.com', role: 'admin' },
    { name: 'João Silva', email: 'joao@exemplo.com', role: 'user' },
    { name: 'Maria Santos', email: 'maria@exemplo.com', role: 'user' }
  ];
  
  for (const userData of users) {
    await User.create(userData);
  }
  
  console.log(`Criados ${users.length} usuários`);
});

SeedSystem.addSeed('products', async () => {
  const products = [
    { name: 'Notebook', price: 2500.00, stock: 10 },
    { name: 'Mouse', price: 50.00, stock: 100 },
    { name: 'Teclado', price: 150.00, stock: 50 }
  ];
  
  for (const productData of products) {
    await Product.create(productData);
  }
  
  console.log(`Criados ${products.length} produtos`);
});

// ===== QUERIES AVANÇADAS =====

/**
 * EXEMPLOS DE QUERIES COMPLEXAS
 * 
 * Demonstra diferentes tipos de consultas e otimizações
 */

class AdvancedQueries {
  // Queries MongoDB
  static async mongoQueries() {
    console.log('\n=== QUERIES MONGODB ===');
    
    // Busca com filtros
    const activeUsers = await User.find({ isActive: true });
    console.log('Usuários ativos:', activeUsers.length);
    
    // Busca com projeção
    console.log('Simulando: User.find({}, { name: 1, email: 1 })');
    
    // Busca com ordenação e paginação
    console.log('Simulando: User.find().sort({ createdAt: -1 }).limit(10).skip(0)');
    
    // Busca com regex
    console.log('Simulando: User.find({ name: /joão/i })');
    
    // Agregação
    console.log('Simulando agregação: User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }])');
    
    // Busca com populate (relacionamentos)
    console.log('Simulando: User.findById(id).populate("products")');
  }
  
  // Queries SQL
  static async sqlQueries() {
    console.log('\n=== QUERIES SQL ===');
    
    // Busca simples
    const users = await UserSQL.findAll({ where: { isActive: true } });
    console.log('Usuários ativos:', users.length);
    
    // Busca com joins
    console.log('Simulando: UserSQL.findAll({ include: [{ model: ProductSQL, as: "products" }] })');
    
    // Busca com agregação
    console.log('Simulando: UserSQL.findAll({ attributes: ["role", [sequelize.fn("COUNT", "*"), "count"]], group: ["role"] })');
    
    // Query raw
    const result = await sequelize.query(
      'SELECT u.name, COUNT(p.id) as product_count FROM users u LEFT JOIN products p ON u.id = p.user_id GROUP BY u.id, u.name'
    );
    console.log('Resultado query raw:', result.rows);
    
    // Transação
    await sequelize.transaction(async (t) => {
      const user = await UserSQL.create({ name: 'Novo Usuário', email: 'novo@exemplo.com' }, { transaction: t });
      await ProductSQL.create({ name: 'Novo Produto', price: 100, userId: user.id }, { transaction: t });
      console.log('Operações executadas em transação');
    });
  }
}

// ===== OTIMIZAÇÃO E PERFORMANCE =====

/**
 * ESTRATÉGIAS DE OTIMIZAÇÃO
 * 
 * Técnicas para melhorar performance das consultas
 */

class DatabaseOptimization {
  // Índices
  static createIndexes() {
    console.log('\n=== CRIANDO ÍNDICES ===');
    
    // MongoDB
    console.log('MongoDB: db.users.createIndex({ email: 1 }, { unique: true })');
    console.log('MongoDB: db.products.createIndex({ category: 1, price: -1 })');
    console.log('MongoDB: db.products.createIndex({ name: "text", description: "text" })');
    
    // SQL
    console.log('SQL: CREATE INDEX idx_users_email ON users(email)');
    console.log('SQL: CREATE INDEX idx_products_category_price ON products(category, price)');
    console.log('SQL: CREATE INDEX idx_products_name ON products(name)');
  }
  
  // Connection pooling
  static configureConnectionPool() {
    console.log('\n=== CONFIGURAÇÃO DE POOL ===');
    
    const poolConfig = {
      min: 2,
      max: 10,
      acquire: 30000,
      idle: 10000,
      evict: 1000
    };
    
    console.log('Pool de conexões configurado:', poolConfig);
  }
  
  // Cache de queries
  static implementQueryCache() {
    console.log('\n=== CACHE DE QUERIES ===');
    
    const cache = new Map();
    
    const cachedQuery = async (key, queryFn) => {
      if (cache.has(key)) {
        console.log(`Cache hit para: ${key}`);
        return cache.get(key);
      }
      
      console.log(`Cache miss para: ${key}`);
      const result = await queryFn();
      cache.set(key, result);
      
      // Expirar cache após 5 minutos
      setTimeout(() => cache.delete(key), 5 * 60 * 1000);
      
      return result;
    };
    
    return cachedQuery;
  }
  
  // Monitoramento de performance
  static monitorPerformance() {
    console.log('\n=== MONITORAMENTO ===');
    
    const originalQuery = sequelize.query;
    sequelize.query = async function(sql, options) {
      const start = Date.now();
      const result = await originalQuery.call(this, sql, options);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`⚠️  Query lenta (${duration}ms): ${sql.substring(0, 100)}...`);
      } else {
        console.log(`✅ Query rápida (${duration}ms)`);
      }
      
      return result;
    };
  }
}

// ===== APLICAÇÃO DE DEMONSTRAÇÃO =====

/**
 * SISTEMA COMPLETO DE BANCO DE DADOS
 * 
 * Demonstra integração completa com diferentes tipos de banco
 */

class DatabaseDemo {
  static async initialize() {
    console.log('\n🚀 INICIALIZANDO SISTEMA DE BANCO DE DADOS\n');
    
    try {
      // Conectar aos bancos
      await MongooseSimulator.connect('mongodb://localhost:27017/curso_web_moderno');
      await sequelize.authenticate();
      
      // Executar migrations
      await MigrationSystem.runMigrations();
      
      // Sincronizar modelos SQL
      await sequelize.sync();
      
      // Executar seeds
      await SeedSystem.runSeeds();
      
      // Configurar otimizações
      DatabaseOptimization.createIndexes();
      DatabaseOptimization.configureConnectionPool();
      DatabaseOptimization.monitorPerformance();
      
      console.log('\n✅ Sistema de banco de dados inicializado com sucesso!');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar banco de dados:', error.message);
    }
  }
  
  static async demonstrateOperations() {
    console.log('\n=== DEMONSTRAÇÃO DE OPERAÇÕES ===');
    
    // Operações MongoDB
    console.log('\n--- MongoDB Operations ---');
    const mongoUser = await User.create({
      name: 'Usuário MongoDB',
      email: 'mongo@exemplo.com',
      password: 'senha123'
    });
    
    const publicProfile = mongoUser.getPublicProfile();
    console.log('Perfil público:', publicProfile);
    
    // Operações SQL
    console.log('\n--- SQL Operations ---');
    const sqlUser = await UserSQL.create({
      name: 'Usuário SQL',
      email: 'sql@exemplo.com',
      password: 'senha123'
    });
    
    await sqlUser.update({ name: 'Usuário SQL Atualizado' });
    
    // Queries avançadas
    await AdvancedQueries.mongoQueries();
    await AdvancedQueries.sqlQueries();
  }
}

// ===== CONCEITOS PRINCIPAIS =====

const conceptosDatabase = {
  relacionais: {
    caracteristicas: [
      'Estrutura em tabelas com relacionamentos',
      'ACID compliance (Atomicidade, Consistência, Isolamento, Durabilidade)',
      'Schema rígido e bem definido',
      'SQL como linguagem de consulta',
      'Ideal para dados estruturados e transações complexas'
    ],
    vantagens: [
      'Integridade referencial',
      'Transações ACID',
      'Consultas complexas com JOINs',
      'Maturidade e padronização',
      'Ferramentas robustas de administração'
    ],
    desvantagens: [
      'Escalabilidade horizontal limitada',
      'Schema rígido',
      'Performance pode degradar com grandes volumes',
      'Complexidade em estruturas hierárquicas'
    ]
  },
  
  naoRelacionais: {
    caracteristicas: [
      'Estrutura flexível (documentos, chave-valor, grafos)',
      'BASE compliance (Basically Available, Soft state, Eventual consistency)',
      'Schema dinâmico',
      'APIs específicas para cada tipo',
      'Ideal para dados semi-estruturados e escalabilidade'
    ],
    vantagens: [
      'Escalabilidade horizontal',
      'Flexibilidade de schema',
      'Performance com grandes volumes',
      'Desenvolvimento ágil',
      'Adequado para dados hierárquicos'
    ],
    desvantagens: [
      'Consistência eventual',
      'Menos ferramentas maduras',
      'Curva de aprendizado',
      'Padronização limitada'
    ]
  },
  
  orm: {
    definicao: 'Object-Relational Mapping - mapeia objetos para tabelas relacionais',
    vantagens: [
      'Abstração do SQL',
      'Segurança contra SQL injection',
      'Portabilidade entre bancos',
      'Validações automáticas',
      'Migrations e seeds'
    ],
    desvantagens: [
      'Performance overhead',
      'Complexidade em queries avançadas',
      'Curva de aprendizado',
      'Abstração pode esconder problemas'
    ]
  },
  
  odm: {
    definicao: 'Object-Document Mapping - mapeia objetos para documentos NoSQL',
    vantagens: [
      'Sintaxe natural para JavaScript',
      'Validações e middleware',
      'Populate para relacionamentos',
      'Schema flexível com validação'
    ],
    desvantagens: [
      'Específico para MongoDB',
      'Overhead de abstração',
      'Pode mascarar ineficiências'
    ]
  }
};

// ===== EXERCÍCIOS PRÁTICOS =====

const exerciciosDatabase = {
  basicos: [
    {
      titulo: 'Configuração de Banco',
      descricao: 'Configure conexões com MongoDB e PostgreSQL',
      tarefas: [
        'Instalar e configurar MongoDB local',
        'Instalar e configurar PostgreSQL',
        'Criar conexões com Mongoose e Sequelize',
        'Testar conectividade'
      ]
    },
    {
      titulo: 'Modelos Básicos',
      descricao: 'Criar modelos para usuários e produtos',
      tarefas: [
        'Definir schema de usuário no MongoDB',
        'Definir modelo de usuário no Sequelize',
        'Adicionar validações básicas',
        'Testar operações CRUD'
      ]
    },
    {
      titulo: 'Relacionamentos',
      descricao: 'Implementar relacionamentos entre entidades',
      tarefas: [
        'Criar relacionamento usuário-produtos',
        'Implementar referências no MongoDB',
        'Configurar associações no Sequelize',
        'Testar consultas com relacionamentos'
      ]
    }
  ],
  
  intermediarios: [
    {
      titulo: 'Migrations e Seeds',
      descricao: 'Sistema de versionamento de schema',
      tarefas: [
        'Criar sistema de migrations',
        'Implementar rollback de migrations',
        'Desenvolver seeds para dados iniciais',
        'Automatizar processo de setup'
      ]
    },
    {
      titulo: 'Queries Avançadas',
      descricao: 'Consultas complexas e otimizadas',
      tarefas: [
        'Implementar agregações no MongoDB',
        'Criar queries com múltiplos JOINs no SQL',
        'Adicionar paginação e ordenação',
        'Implementar busca full-text'
      ]
    },
    {
      titulo: 'Transações',
      descricao: 'Operações atômicas e consistência',
      tarefas: [
        'Implementar transações no Sequelize',
        'Usar transações no MongoDB',
        'Tratar rollback em caso de erro',
        'Testar cenários de concorrência'
      ]
    }
  ],
  
  avancados: [
    {
      titulo: 'Otimização de Performance',
      descricao: 'Técnicas avançadas de otimização',
      tarefas: [
        'Criar índices estratégicos',
        'Implementar cache de queries',
        'Configurar connection pooling',
        'Monitorar performance de queries'
      ]
    },
    {
      titulo: 'Backup e Recuperação',
      descricao: 'Estratégias de backup e disaster recovery',
      tarefas: [
        'Implementar backup automático',
        'Criar scripts de restauração',
        'Testar recuperação de dados',
        'Documentar procedimentos'
      ]
    },
    {
      titulo: 'Replicação e Sharding',
      descricao: 'Escalabilidade e alta disponibilidade',
      tarefas: [
        'Configurar replica set no MongoDB',
        'Implementar read replicas no PostgreSQL',
        'Estudar estratégias de sharding',
        'Testar failover automático'
      ]
    }
  ],
  
  projeto: {
    titulo: 'Sistema de E-commerce Completo',
    descricao: 'Aplicação full-stack com múltiplos bancos',
    requisitos: [
      'MongoDB para catálogo de produtos e reviews',
      'PostgreSQL para usuários e pedidos',
      'Redis para cache e sessões',
      'Sistema de migrations completo',
      'Backup automático',
      'Monitoramento de performance',
      'API RESTful completa',
      'Testes de integração'
    ]
  }
};

// ===== RECURSOS ADICIONAIS =====

const recursosDatabase = {
  documentacao: [
    'MongoDB Manual: https://docs.mongodb.com/',
    'Mongoose Documentation: https://mongoosejs.com/docs/',
    'PostgreSQL Documentation: https://www.postgresql.org/docs/',
    'Sequelize Documentation: https://sequelize.org/docs/',
    'SQL Tutorial: https://www.w3schools.com/sql/'
  ],
  
  ferramentas: [
    'MongoDB Compass - GUI para MongoDB',
    'pgAdmin - Administração PostgreSQL',
    'DBeaver - Cliente universal de banco',
    'Robo 3T - Cliente MongoDB',
    'DataGrip - IDE para bancos de dados'
  ],
  
  bibliotecas: [
    'mongoose - ODM para MongoDB',
    'sequelize - ORM para SQL',
    'prisma - ORM moderno',
    'typeorm - ORM para TypeScript',
    'knex - Query builder SQL'
  ],
  
  padroes: [
    'Repository Pattern - Abstração de acesso a dados',
    'Unit of Work - Gerenciamento de transações',
    'Data Mapper - Separação entre modelo e persistência',
    'Active Record - Modelo com lógica de persistência',
    'CQRS - Separação de comandos e consultas'
  ]
};

// ===== RESUMO DO MÓDULO =====

const resumoModulo = {
  objetivos: [
    '✅ Compreender diferenças entre bancos relacionais e NoSQL',
    '✅ Dominar integração com MongoDB usando Mongoose',
    '✅ Dominar integração com PostgreSQL usando Sequelize',
    '✅ Implementar migrations e seeds',
    '✅ Criar queries avançadas e otimizadas',
    '✅ Aplicar técnicas de performance e escalabilidade'
  ],
  
  conceitosChave: [
    'ACID vs BASE',
    'ORM vs ODM',
    'Relacionamentos e referências',
    'Índices e otimização',
    'Transações e consistência',
    'Migrations e versionamento'
  ],
  
  habilidades: [
    'Modelagem de dados eficiente',
    'Queries complexas e performáticas',
    'Gerenciamento de schema',
    'Otimização de performance',
    'Backup e recuperação',
    'Monitoramento e debugging'
  ],
  
  proximosPassos: [
    'Estudar padrões avançados (Repository, Unit of Work)',
    'Explorar bancos especializados (Redis, Elasticsearch)',
    'Aprender sobre microserviços e bancos distribuídos',
    'Implementar cache distribuído',
    'Estudar Event Sourcing e CQRS'
  ],
  
  dicas: [
    '🎯 Escolha o banco certo para cada caso de uso',
    '⚡ Sempre considere performance desde o início',
    '🔒 Nunca negligencie segurança e backup',
    '📊 Monitore queries e otimize continuamente',
    '🧪 Teste cenários de falha e recuperação'
  ]
};

// Função de inicialização
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DatabaseConcepts,
    MongooseSimulator,
    SequelizeSimulator,
    MigrationSystem,
    SeedSystem,
    AdvancedQueries,
    DatabaseOptimization,
    DatabaseDemo,
    conceptosDatabase,
    exerciciosDatabase,
    recursosDatabase,
    resumoModulo
  };
} else {
  // Executar demonstração no browser
  DatabaseDemo.initialize().then(() => {
    DatabaseDemo.demonstrateOperations();
  });
}

console.log('\n📚 Módulo 3.4: Bancos de Dados carregado com sucesso!');
console.log('🎯 Explore os conceitos de bancos relacionais e NoSQL');
console.log('💡 Pratique com MongoDB, PostgreSQL e otimizações');