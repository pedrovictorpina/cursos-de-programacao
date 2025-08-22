/*
=============================================================================
                    MÓDULO 4: TYPESCRIPT E FERRAMENTAS
                        01 - FUNDAMENTOS TYPESCRIPT
=============================================================================

Este arquivo aborda os fundamentos do TypeScript, incluindo tipagem estática,
interfaces, classes, generics e configuração de projetos.

📚 TÓPICOS ABORDADOS:
- Introdução ao TypeScript
- Sistema de tipos
- Interfaces e tipos customizados
- Classes e herança
- Generics e tipos avançados
- Configuração de projetos
- Integração com ferramentas

*/

// =============================================================================
// 1. INTRODUÇÃO AO TYPESCRIPT
// =============================================================================

/*
O TypeScript é um superset do JavaScript que adiciona tipagem estática opcional.
Ele compila para JavaScript puro e pode ser executado em qualquer ambiente JS.

VANTAGENS:
- Detecção de erros em tempo de compilação
- Melhor IntelliSense e autocomplete
- Refatoração mais segura
- Documentação viva através dos tipos
- Melhor manutenibilidade em projetos grandes
*/

// Simulação de TypeScript (comentários representam tipos)
class TypeScriptIntro {
  // Tipos primitivos
  static demonstratePrimitiveTypes() {
    // let name: string = "João";
    let name = "João"; // string
    
    // let age: number = 30;
    let age = 30; // number
    
    // let isActive: boolean = true;
    let isActive = true; // boolean
    
    // let items: number[] = [1, 2, 3];
    let items = [1, 2, 3]; // number[]
    
    // let tuple: [string, number] = ["João", 30];
    let tuple = ["João", 30]; // [string, number]
    
    console.log('Tipos primitivos:', { name, age, isActive, items, tuple });
  }
  
  // Union types
  static demonstrateUnionTypes() {
    // let id: string | number;
    function processId(id) { // id: string | number
      if (typeof id === 'string') {
        return id.toUpperCase();
      }
      return id.toString();
    }
    
    console.log('Union types:', {
      stringId: processId("abc123"),
      numberId: processId(12345)
    });
  }
  
  // Literal types
  static demonstrateLiteralTypes() {
    // type Status = "pending" | "approved" | "rejected";
    function updateStatus(status) { // status: "pending" | "approved" | "rejected"
      const validStatuses = ["pending", "approved", "rejected"];
      if (!validStatuses.includes(status)) {
        throw new Error(`Status inválido: ${status}`);
      }
      return `Status atualizado para: ${status}`;
    }
    
    console.log('Literal types:', {
      pending: updateStatus("pending"),
      approved: updateStatus("approved")
    });
  }
}

// =============================================================================
// 2. INTERFACES E TIPOS CUSTOMIZADOS
// =============================================================================

/*
Interfaces definem a estrutura de objetos, fornecendo contratos
que garantem que os objetos tenham as propriedades esperadas.
*/

class InterfaceExamples {
  // Interface básica
  static demonstrateBasicInterface() {
    // interface User {
    //   id: number;
    //   name: string;
    //   email: string;
    //   isActive?: boolean; // propriedade opcional
    // }
    
    function createUser(userData) { // userData: User
      const requiredFields = ['id', 'name', 'email'];
      for (const field of requiredFields) {
        if (!(field in userData)) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }
      
      return {
        ...userData,
        isActive: userData.isActive ?? true,
        createdAt: new Date()
      };
    }
    
    const user = createUser({
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com"
    });
    
    console.log('Interface básica:', user);
  }
  
  // Interface com métodos
  static demonstrateInterfaceWithMethods() {
    // interface Calculator {
    //   add(a: number, b: number): number;
    //   subtract(a: number, b: number): number;
    //   multiply(a: number, b: number): number;
    //   divide(a: number, b: number): number;
    // }
    
    class BasicCalculator { // implements Calculator
      add(a, b) { // a: number, b: number): number
        return a + b;
      }
      
      subtract(a, b) { // a: number, b: number): number
        return a - b;
      }
      
      multiply(a, b) { // a: number, b: number): number
        return a * b;
      }
      
      divide(a, b) { // a: number, b: number): number
        if (b === 0) {
          throw new Error('Divisão por zero não é permitida');
        }
        return a / b;
      }
    }
    
    const calc = new BasicCalculator();
    console.log('Interface com métodos:', {
      add: calc.add(10, 5),
      subtract: calc.subtract(10, 5),
      multiply: calc.multiply(10, 5),
      divide: calc.divide(10, 5)
    });
  }
  
  // Extending interfaces
  static demonstrateExtendingInterfaces() {
    // interface Person {
    //   name: string;
    //   age: number;
    // }
    // 
    // interface Employee extends Person {
    //   employeeId: string;
    //   department: string;
    //   salary: number;
    // }
    
    function createEmployee(data) { // data: Employee
      const requiredFields = ['name', 'age', 'employeeId', 'department', 'salary'];
      for (const field of requiredFields) {
        if (!(field in data)) {
          throw new Error(`Campo obrigatório ausente: ${field}`);
        }
      }
      
      return {
        ...data,
        fullName: data.name,
        isAdult: data.age >= 18,
        monthlySalary: data.salary / 12
      };
    }
    
    const employee = createEmployee({
      name: "Carlos Santos",
      age: 28,
      employeeId: "EMP001",
      department: "Desenvolvimento",
      salary: 60000
    });
    
    console.log('Extending interfaces:', employee);
  }
  
  // Type aliases
  static demonstrateTypeAliases() {
    // type ID = string | number;
    // type Status = "active" | "inactive" | "pending";
    // type UserRole = "admin" | "user" | "moderator";
    // 
    // type UserProfile = {
    //   id: ID;
    //   username: string;
    //   status: Status;
    //   role: UserRole;
    //   permissions: string[];
    // };
    
    function createUserProfile(data) { // data: Partial<UserProfile>
      const defaults = {
        status: "pending",
        role: "user",
        permissions: ["read"]
      };
      
      return {
        ...defaults,
        ...data,
        id: data.id || Math.random().toString(36).substr(2, 9)
      };
    }
    
    const profile = createUserProfile({
      username: "joao123",
      role: "admin",
      permissions: ["read", "write", "delete"]
    });
    
    console.log('Type aliases:', profile);
  }
}

// =============================================================================
// 3. CLASSES E HERANÇA
// =============================================================================

/*
O TypeScript aprimora as classes JavaScript com modificadores de acesso,
propriedades readonly, classes abstratas e decorators.
*/

class ClassExamples {
  // Classe básica com modificadores de acesso
  static demonstrateBasicClass() {
    class BankAccount {
      // private balance: number;
      // public readonly accountNumber: string;
      // protected createdAt: Date;
      
      constructor(accountNumber, initialBalance = 0) {
        this.accountNumber = accountNumber; // readonly
        this._balance = initialBalance; // private (convenção _)
        this._createdAt = new Date(); // protected (convenção _)
      }
      
      // public method
      deposit(amount) { // amount: number): void
        if (amount <= 0) {
          throw new Error('Valor deve ser positivo');
        }
        this._balance += amount;
        console.log(`Depósito de R$ ${amount}. Saldo atual: R$ ${this._balance}`);
      }
      
      // public method
      withdraw(amount) { // amount: number): boolean
        if (amount <= 0) {
          throw new Error('Valor deve ser positivo');
        }
        if (amount > this._balance) {
          console.log('Saldo insuficiente');
          return false;
        }
        this._balance -= amount;
        console.log(`Saque de R$ ${amount}. Saldo atual: R$ ${this._balance}`);
        return true;
      }
      
      // getter
      get balance() { // (): number
        return this._balance;
      }
      
      // getter
      get accountInfo() { // (): object
        return {
          accountNumber: this.accountNumber,
          balance: this._balance,
          createdAt: this._createdAt
        };
      }
    }
    
    const account = new BankAccount("12345-6", 1000);
    account.deposit(500);
    account.withdraw(200);
    
    console.log('Classe básica:', account.accountInfo);
  }
  
  // Herança e classes abstratas
  static demonstrateInheritance() {
    // abstract class Animal {
    //   protected name: string;
    //   protected age: number;
    //   
    //   constructor(name: string, age: number) {
    //     this.name = name;
    //     this.age = age;
    //   }
    //   
    //   abstract makeSound(): string;
    //   
    //   getInfo(): string {
    //     return `${this.name} tem ${this.age} anos`;
    //   }
    // }
    
    class Animal {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }
      
      makeSound() {
        throw new Error('Método abstrato deve ser implementado');
      }
      
      getInfo() {
        return `${this.name} tem ${this.age} anos`;
      }
    }
    
    class Dog extends Animal {
      constructor(name, age, breed) {
        super(name, age);
        this.breed = breed; // breed: string
      }
      
      makeSound() { // (): string
        return "Au au!";
      }
      
      fetch() { // (): string
        return `${this.name} está buscando a bolinha!`;
      }
    }
    
    class Cat extends Animal {
      constructor(name, age, isIndoor) {
        super(name, age);
        this.isIndoor = isIndoor; // isIndoor: boolean
      }
      
      makeSound() { // (): string
        return "Miau!";
      }
      
      climb() { // (): string
        return `${this.name} está subindo na árvore!`;
      }
    }
    
    const dog = new Dog("Rex", 3, "Golden Retriever");
    const cat = new Cat("Mimi", 2, true);
    
    console.log('Herança:', {
      dog: {
        info: dog.getInfo(),
        sound: dog.makeSound(),
        action: dog.fetch()
      },
      cat: {
        info: cat.getInfo(),
        sound: cat.makeSound(),
        action: cat.climb()
      }
    });
  }
  
  // Static members
  static demonstrateStaticMembers() {
    class MathUtils {
      // static readonly PI: number = 3.14159;
      static PI = 3.14159; // readonly (convenção)
      
      // static calculateCircleArea(radius: number): number {
      static calculateCircleArea(radius) {
        return MathUtils.PI * radius * radius;
      }
      
      // static calculateCircleCircumference(radius: number): number {
      static calculateCircleCircumference(radius) {
        return 2 * MathUtils.PI * radius;
      }
      
      // static getRandomNumber(min: number, max: number): number {
      static getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    
    console.log('Static members:', {
      PI: MathUtils.PI,
      circleArea: MathUtils.calculateCircleArea(5),
      circumference: MathUtils.calculateCircleCircumference(5),
      randomNumber: MathUtils.getRandomNumber(1, 100)
    });
  }
}

// =============================================================================
// 4. GENERICS E TIPOS AVANÇADOS
// =============================================================================

/*
Generics permitem criar componentes reutilizáveis que funcionam
com diferentes tipos, mantendo a segurança de tipos.
*/

class GenericExamples {
  // Generic functions
  static demonstrateGenericFunctions() {
    // function identity<T>(arg: T): T {
    //   return arg;
    // }
    
    function identity(arg) { // <T>(arg: T): T
      return arg;
    }
    
    // function getArrayLength<T>(items: T[]): number {
    //   return items.length;
    // }
    
    function getArrayLength(items) { // <T>(items: T[]): number
      return items.length;
    }
    
    // function getFirstElement<T>(items: T[]): T | undefined {
    //   return items[0];
    // }
    
    function getFirstElement(items) { // <T>(items: T[]): T | undefined
      return items[0];
    }
    
    console.log('Generic functions:', {
      stringIdentity: identity("Hello"),
      numberIdentity: identity(42),
      arrayLength: getArrayLength([1, 2, 3, 4, 5]),
      firstElement: getFirstElement(["a", "b", "c"])
    });
  }
  
  // Generic classes
  static demonstrateGenericClasses() {
    // class Stack<T> {
    //   private items: T[] = [];
    //   
    //   push(item: T): void {
    //     this.items.push(item);
    //   }
    //   
    //   pop(): T | undefined {
    //     return this.items.pop();
    //   }
    //   
    //   peek(): T | undefined {
    //     return this.items[this.items.length - 1];
    //   }
    //   
    //   get size(): number {
    //     return this.items.length;
    //   }
    // }
    
    class Stack {
      constructor() {
        this._items = []; // private items: T[]
      }
      
      push(item) { // (item: T): void
        this._items.push(item);
      }
      
      pop() { // (): T | undefined
        return this._items.pop();
      }
      
      peek() { // (): T | undefined
        return this._items[this._items.length - 1];
      }
      
      get size() { // (): number
        return this._items.length;
      }
      
      get isEmpty() { // (): boolean
        return this._items.length === 0;
      }
    }
    
    const numberStack = new Stack(); // Stack<number>
    numberStack.push(1);
    numberStack.push(2);
    numberStack.push(3);
    
    const stringStack = new Stack(); // Stack<string>
    stringStack.push("first");
    stringStack.push("second");
    
    console.log('Generic classes:', {
      numberStack: {
        size: numberStack.size,
        peek: numberStack.peek(),
        pop: numberStack.pop()
      },
      stringStack: {
        size: stringStack.size,
        peek: stringStack.peek(),
        isEmpty: stringStack.isEmpty
      }
    });
  }
  
  // Utility types
  static demonstrateUtilityTypes() {
    // interface User {
    //   id: number;
    //   name: string;
    //   email: string;
    //   age: number;
    //   isActive: boolean;
    // }
    
    // Partial<User> - todas as propriedades opcionais
    function updateUser(id, updates) { // (id: number, updates: Partial<User>): User
      const existingUser = {
        id: id,
        name: "João Silva",
        email: "joao@email.com",
        age: 30,
        isActive: true
      };
      
      return { ...existingUser, ...updates };
    }
    
    // Pick<User, 'name' | 'email'> - apenas propriedades selecionadas
    function getUserContact(user) { // (user: User): Pick<User, 'name' | 'email'>
      return {
        name: user.name,
        email: user.email
      };
    }
    
    // Omit<User, 'id'> - exclui propriedades específicas
    function createUser(userData) { // (userData: Omit<User, 'id'>): User
      return {
        id: Math.floor(Math.random() * 1000),
        ...userData
      };
    }
    
    const user = {
      id: 1,
      name: "Maria Santos",
      email: "maria@email.com",
      age: 25,
      isActive: true
    };
    
    console.log('Utility types:', {
      updatedUser: updateUser(1, { age: 31, isActive: false }),
      userContact: getUserContact(user),
      newUser: createUser({
        name: "Pedro Costa",
        email: "pedro@email.com",
        age: 28,
        isActive: true
      })
    });
  }
  
  // Conditional types
  static demonstrateConditionalTypes() {
    // type ApiResponse<T> = T extends string ? { message: T } : { data: T };
    
    function createApiResponse(payload) { // <T>(payload: T): ApiResponse<T>
      if (typeof payload === 'string') {
        return { message: payload };
      }
      return { data: payload };
    }
    
    // type NonNullable<T> = T extends null | undefined ? never : T;
    
    function ensureNonNull(value) { // <T>(value: T): NonNullable<T>
      if (value === null || value === undefined) {
        throw new Error('Valor não pode ser null ou undefined');
      }
      return value;
    }
    
    console.log('Conditional types:', {
      stringResponse: createApiResponse("Operação realizada com sucesso"),
      dataResponse: createApiResponse({ id: 1, name: "Teste" }),
      nonNullValue: ensureNonNull("valor válido")
    });
  }
}

// =============================================================================
// 5. CONFIGURAÇÃO DE PROJETOS
// =============================================================================

/*
O TypeScript usa o arquivo tsconfig.json para configurar o compilador
e definir como o projeto deve ser processado.
*/

class TypeScriptConfig {
  // Configuração básica do tsconfig.json
  static getTsConfigBasic() {
    return {
      compilerOptions: {
        // Target ES version
        target: "ES2020",
        
        // Module system
        module: "commonjs",
        
        // Output directory
        outDir: "./dist",
        
        // Root directory
        rootDir: "./src",
        
        // Enable strict type checking
        strict: true,
        
        // Enable all strict type checking options
        noImplicitAny: true,
        strictNullChecks: true,
        strictFunctionTypes: true,
        
        // Module resolution
        moduleResolution: "node",
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        
        // Source maps for debugging
        sourceMap: true,
        
        // Declaration files
        declaration: true,
        declarationMap: true,
        
        // Skip lib check for faster compilation
        skipLibCheck: true,
        
        // Force consistent casing
        forceConsistentCasingInFileNames: true
      },
      
      // Include patterns
      include: [
        "src/**/*"
      ],
      
      // Exclude patterns
      exclude: [
        "node_modules",
        "dist",
        "**/*.test.ts",
        "**/*.spec.ts"
      ]
    };
  }
  
  // Configuração para projetos React
  static getTsConfigReact() {
    return {
      compilerOptions: {
        target: "ES2020",
        lib: ["DOM", "DOM.Iterable", "ES6"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx"
      },
      include: [
        "src"
      ]
    };
  }
  
  // Configuração para projetos Node.js
  static getTsConfigNode() {
    return {
      compilerOptions: {
        target: "ES2020",
        module: "commonjs",
        lib: ["ES2020"],
        outDir: "./dist",
        rootDir: "./src",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        types: ["node"]
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    };
  }
  
  // Scripts de build comuns
  static getBuildScripts() {
    return {
      // package.json scripts
      scripts: {
        "build": "tsc",
        "build:watch": "tsc --watch",
        "dev": "ts-node src/index.ts",
        "dev:watch": "ts-node-dev --respawn src/index.ts",
        "type-check": "tsc --noEmit",
        "clean": "rimraf dist"
      },
      
      // Dependências de desenvolvimento
      devDependencies: {
        "typescript": "^4.9.0",
        "ts-node": "^10.9.0",
        "ts-node-dev": "^2.0.0",
        "@types/node": "^18.0.0",
        "rimraf": "^3.0.0"
      }
    };
  }
}

// =============================================================================
// 6. INTEGRAÇÃO COM FERRAMENTAS
// =============================================================================

/*
O TypeScript se integra bem com diversas ferramentas de desenvolvimento,
melhorando a experiência do desenvolvedor.
*/

class ToolIntegration {
  // ESLint configuration for TypeScript
  static getESLintConfig() {
    return {
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "@typescript-eslint/recommended",
        "@typescript-eslint/recommended-requiring-type-checking"
      ],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json"
      },
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/prefer-const": "error"
      }
    };
  }
  
  // Prettier configuration
  static getPrettierConfig() {
    return {
      semi: true,
      trailingComma: "es5",
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2,
      useTabs: false
    };
  }
  
  // Jest configuration for TypeScript
  static getJestConfig() {
    return {
      preset: "ts-jest",
      testEnvironment: "node",
      roots: ["<rootDir>/src"],
      testMatch: [
        "**/__tests__/**/*.ts",
        "**/?(*.)+(spec|test).ts"
      ],
      transform: {
        "^.+\.ts$": "ts-jest"
      },
      collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts"
      ],
      coverageDirectory: "coverage",
      coverageReporters: ["text", "lcov", "html"]
    };
  }
  
  // Webpack configuration for TypeScript
  static getWebpackConfig() {
    return {
      entry: "./src/index.ts",
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: "ts-loader",
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        extensions: [".ts", ".js"]
      },
      output: {
        filename: "bundle.js",
        path: "./dist"
      },
      devtool: "source-map"
    };
  }
}

// =============================================================================
// 7. APLICAÇÃO DE DEMONSTRAÇÃO
// =============================================================================

/*
Aplicação completa que demonstra todos os conceitos do TypeScript
abordados neste módulo.
*/

class TaskManagerApp {
  constructor() {
    this.tasks = []; // Task[]
    this.nextId = 1;
    this.observers = []; // Observer[]
  }
  
  // interface Task {
  //   id: number;
  //   title: string;
  //   description?: string;
  //   status: TaskStatus;
  //   priority: TaskPriority;
  //   createdAt: Date;
  //   updatedAt: Date;
  //   dueDate?: Date;
  // }
  
  // type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled";
  // type TaskPriority = "low" | "medium" | "high" | "urgent";
  
  createTask(taskData) { // (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task
    const task = {
      id: this.nextId++,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: taskData.dueDate
    };
    
    this.tasks.push(task);
    this.notifyObservers('taskCreated', task);
    return task;
  }
  
  updateTask(id, updates) { // (id: number, updates: Partial<Task>): Task | null
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return null;
    }
    
    const updatedTask = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.tasks[taskIndex] = updatedTask;
    this.notifyObservers('taskUpdated', updatedTask);
    return updatedTask;
  }
  
  deleteTask(id) { // (id: number): boolean
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      return false;
    }
    
    const deletedTask = this.tasks.splice(taskIndex, 1)[0];
    this.notifyObservers('taskDeleted', deletedTask);
    return true;
  }
  
  getTasks(filter) { // (filter?: TaskFilter): Task[]
    let filteredTasks = [...this.tasks];
    
    if (filter) {
      if (filter.status) {
        filteredTasks = filteredTasks.filter(task => task.status === filter.status);
      }
      if (filter.priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === filter.priority);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) ||
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return filteredTasks;
  }
  
  // interface TaskFilter {
  //   status?: TaskStatus;
  //   priority?: TaskPriority;
  //   search?: string;
  // }
  
  getTaskStats() { // (): TaskStats
    const stats = {
      total: this.tasks.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0
      }
    };
    
    this.tasks.forEach(task => {
      switch (task.status) {
        case 'pending':
          stats.pending++;
          break;
        case 'in-progress':
          stats.inProgress++;
          break;
        case 'completed':
          stats.completed++;
          break;
        case 'cancelled':
          stats.cancelled++;
          break;
      }
      
      stats.byPriority[task.priority]++;
    });
    
    return stats;
  }
  
  // Observer pattern
  addObserver(observer) { // (observer: Observer): void
    this.observers.push(observer);
  }
  
  removeObserver(observer) { // (observer: Observer): void
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }
  
  notifyObservers(event, data) { // (event: string, data: any): void
    this.observers.forEach(observer => {
      if (typeof observer.update === 'function') {
        observer.update(event, data);
      }
    });
  }
}

// Observer implementation
class TaskLogger {
  update(event, data) { // (event: string, data: any): void
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${event}:`, data);
  }
}

class TaskNotifier {
  update(event, data) { // (event: string, data: any): void
    switch (event) {
      case 'taskCreated':
        console.log(`📝 Nova tarefa criada: ${data.title}`);
        break;
      case 'taskUpdated':
        console.log(`✏️ Tarefa atualizada: ${data.title}`);
        break;
      case 'taskDeleted':
        console.log(`🗑️ Tarefa removida: ${data.title}`);
        break;
    }
  }
}

// =============================================================================
// 8. DEMONSTRAÇÃO E TESTES
// =============================================================================

function demonstrateTypeScript() {
  console.log('\n=== DEMONSTRAÇÃO TYPESCRIPT ===\n');
  
  // 1. Tipos primitivos
  console.log('1. TIPOS PRIMITIVOS:');
  TypeScriptIntro.demonstratePrimitiveTypes();
  TypeScriptIntro.demonstrateUnionTypes();
  TypeScriptIntro.demonstrateLiteralTypes();
  
  // 2. Interfaces
  console.log('\n2. INTERFACES:');
  InterfaceExamples.demonstrateBasicInterface();
  InterfaceExamples.demonstrateInterfaceWithMethods();
  InterfaceExamples.demonstrateExtendingInterfaces();
  InterfaceExamples.demonstrateTypeAliases();
  
  // 3. Classes
  console.log('\n3. CLASSES:');
  ClassExamples.demonstrateBasicClass();
  ClassExamples.demonstrateInheritance();
  ClassExamples.demonstrateStaticMembers();
  
  // 4. Generics
  console.log('\n4. GENERICS:');
  GenericExamples.demonstrateGenericFunctions();
  GenericExamples.demonstrateGenericClasses();
  GenericExamples.demonstrateUtilityTypes();
  GenericExamples.demonstrateConditionalTypes();
  
  // 5. Configurações
  console.log('\n5. CONFIGURAÇÕES:');
  console.log('tsconfig.json básico:', JSON.stringify(TypeScriptConfig.getTsConfigBasic(), null, 2));
  console.log('\nScripts de build:', TypeScriptConfig.getBuildScripts());
  
  // 6. Aplicação de demonstração
  console.log('\n6. APLICAÇÃO DE DEMONSTRAÇÃO:');
  const taskManager = new TaskManagerApp();
  const logger = new TaskLogger();
  const notifier = new TaskNotifier();
  
  taskManager.addObserver(logger);
  taskManager.addObserver(notifier);
  
  // Criar tarefas
  const task1 = taskManager.createTask({
    title: "Implementar autenticação",
    description: "Adicionar sistema de login com JWT",
    status: "pending",
    priority: "high",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
  });
  
  const task2 = taskManager.createTask({
    title: "Escrever testes",
    description: "Adicionar testes unitários para a API",
    status: "pending",
    priority: "medium"
  });
  
  // Atualizar tarefa
  taskManager.updateTask(task1.id, {
    status: "in-progress"
  });
  
  // Buscar tarefas
  const pendingTasks = taskManager.getTasks({ status: "pending" });
  const highPriorityTasks = taskManager.getTasks({ priority: "high" });
  
  console.log('\nTarefas pendentes:', pendingTasks);
  console.log('Tarefas de alta prioridade:', highPriorityTasks);
  console.log('Estatísticas:', taskManager.getTaskStats());
}

// Executar demonstração
if (typeof window === 'undefined') {
  // Node.js environment
  demonstrateTypeScript();
} else {
  // Browser environment
  console.log('TypeScript Fundamentals module loaded. Call demonstrateTypeScript() to run demo.');
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TypeScriptIntro,
    InterfaceExamples,
    ClassExamples,
    GenericExamples,
    TypeScriptConfig,
    ToolIntegration,
    TaskManagerApp,
    TaskLogger,
    TaskNotifier,
    demonstrateTypeScript
  };
}

/*
=============================================================================
                              RESUMO DO MÓDULO
=============================================================================

📚 CONCEITOS PRINCIPAIS:

1. **Sistema de Tipos**:
   - Tipos primitivos (string, number, boolean)
   - Union types e literal types
   - Arrays e tuplas
   - Tipos opcionais e null/undefined

2. **Interfaces e Tipos**:
   - Definição de contratos
   - Propriedades opcionais e readonly
   - Herança de interfaces
   - Type aliases e utility types

3. **Classes Avançadas**:
   - Modificadores de acesso (public, private, protected)
   - Propriedades readonly
   - Classes abstratas
   - Membros estáticos

4. **Generics**:
   - Funções genéricas
   - Classes genéricas
   - Constraints e conditional types
   - Utility types (Partial, Pick, Omit)

5. **Configuração**:
   - tsconfig.json
   - Integração com ferramentas
   - Scripts de build
   - Ambientes diferentes (React, Node.js)

🎯 OBJETIVOS ALCANÇADOS:

✅ Compreensão do sistema de tipos do TypeScript
✅ Uso de interfaces para definir contratos
✅ Implementação de classes com modificadores de acesso
✅ Aplicação de generics para reutilização de código
✅ Configuração de projetos TypeScript
✅ Integração com ferramentas de desenvolvimento
✅ Desenvolvimento de aplicação completa tipada

🔧 HABILIDADES DESENVOLVIDAS:

- Tipagem estática para maior segurança
- Design de APIs com interfaces claras
- Programação orientada a objetos avançada
- Uso de generics para flexibilidade
- Configuração de ambiente de desenvolvimento
- Integração com ferramentas modernas

📈 PRÓXIMOS PASSOS:

1. **Build Tools**: Webpack, Vite, Rollup
2. **Testes Avançados**: Jest, Testing Library
3. **Linting e Formatação**: ESLint, Prettier
4. **CI/CD**: GitHub Actions, pipelines automatizados
5. **Monorepos**: Lerna, Nx, Rush

💡 DICAS IMPORTANTES:

- Use strict mode para máxima segurança de tipos
- Prefira interfaces a type aliases para objetos
- Evite 'any' - use unknown quando necessário
- Configure ESLint e Prettier desde o início
- Documente tipos complexos com comentários
- Use utility types para transformações de tipos

=============================================================================
*/