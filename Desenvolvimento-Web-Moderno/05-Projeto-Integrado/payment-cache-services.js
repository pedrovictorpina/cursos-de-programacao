/*
=============================================================================
                    MÓDULO 5: PROJETO INTEGRADO
                 PAGAMENTOS, CACHE E SERVIÇOS AVANÇADOS
=============================================================================

Implementação dos serviços de pagamento (Stripe), cache (Redis),
busca (Elasticsearch) e outros serviços essenciais do backend.

*/

// =============================================================================
// 1. SERVIÇO DE PAGAMENTO (STRIPE)
// =============================================================================

/*
Serviço completo de pagamento integrado com Stripe,
suportando múltiplos métodos de pagamento e webhooks.
*/

class PaymentService {
  static getPaymentService() {
    return `
// src/services/paymentService.ts
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { sendEmail } from './emailService';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface PaymentIntentData {
  amount: number;
  currency: string;
  orderId: string;
  paymentMethod: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

interface RefundData {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

class PaymentService {
  // Create payment intent
  static async createPaymentIntent(data: PaymentIntentData): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency.toLowerCase(),
        metadata: {
          orderId: data.orderId,
          paymentMethod: data.paymentMethod,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      if (data.customerId) {
        paymentIntentData.customer = data.customerId;
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      
      logger.info(\`Payment intent created: \${paymentIntent.id} for order: \${data.orderId}\`);
      
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw new AppError('Erro ao criar intenção de pagamento', 500);
    }
  }

  // Confirm payment intent
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });
      
      logger.info(\`Payment intent confirmed: \${paymentIntentId}\`);
      
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to confirm payment intent:', error);
      throw new AppError('Erro ao confirmar pagamento', 500);
    }
  }

  // Create customer
  static async createCustomer(data: {
    email: string;
    name: string;
    phone?: string;
    address?: Stripe.AddressParam;
  }): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        phone: data.phone,
        address: data.address,
      });
      
      logger.info(\`Stripe customer created: \${customer.id} for \${data.email}\`);
      
      return customer;
    } catch (error) {
      logger.error('Failed to create customer:', error);
      throw new AppError('Erro ao criar cliente', 500);
    }
  }

  // Save payment method
  static async savePaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentMethod> {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      
      logger.info(\`Payment method saved: \${paymentMethodId} for customer: \${customerId}\`);
      
      return paymentMethod;
    } catch (error) {
      logger.error('Failed to save payment method:', error);
      throw new AppError('Erro ao salvar método de pagamento', 500);
    }
  }

  // Get customer payment methods
  static async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      
      return paymentMethods.data;
    } catch (error) {
      logger.error('Failed to get payment methods:', error);
      throw new AppError('Erro ao buscar métodos de pagamento', 500);
    }
  }

  // Create refund
  static async createRefund(data: RefundData): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: data.paymentIntentId,
      };

      if (data.amount) {
        refundData.amount = Math.round(data.amount * 100);
      }

      if (data.reason) {
        refundData.reason = data.reason as Stripe.RefundCreateParams.Reason;
      }

      const refund = await stripe.refunds.create(refundData);
      
      logger.info(\`Refund created: \${refund.id} for payment: \${data.paymentIntentId}\`);
      
      return refund;
    } catch (error) {
      logger.error('Failed to create refund:', error);
      throw new AppError('Erro ao processar reembolso', 500);
    }
  }

  // Handle webhook events
  static async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<void> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      logger.info(\`Stripe webhook received: \${event.type}\`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        default:
          logger.info(\`Unhandled webhook event: \${event.type}\`);
      }
    } catch (error) {
      logger.error('Webhook handling failed:', error);
      throw new AppError('Erro ao processar webhook', 500);
    }
  }

  // Handle successful payment
  private static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      logger.error('Order ID not found in payment intent metadata');
      return;
    }

    try {
      // Update payment status
      await prisma.payment.update({
        where: { stripePaymentId: paymentIntent.id },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
            },
          },
        },
      });

      // Send confirmation email
      if (order.user) {
        await sendEmail({
          to: order.user.email,
          subject: \`Pagamento confirmado - Pedido #\${order.orderNumber}\`,
          template: 'payment-confirmed',
          data: {
            firstName: order.user.firstName,
            orderNumber: order.orderNumber,
            amount: paymentIntent.amount / 100,
          },
        });
      }

      logger.info(\`Payment succeeded for order: \${orderId}\`);
    } catch (error) {
      logger.error('Failed to handle payment success:', error);
    }
  }

  // Handle failed payment
  private static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      logger.error('Order ID not found in payment intent metadata');
      return;
    }

    try {
      // Update payment status
      await prisma.payment.update({
        where: { stripePaymentId: paymentIntent.id },
        data: {
          status: 'FAILED',
          failureReason: paymentIntent.last_payment_error?.message,
        },
      });

      // Update order status
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
            },
          },
          items: true,
        },
      });

      // Restore product stock
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Send failure notification
      if (order.user) {
        await sendEmail({
          to: order.user.email,
          subject: \`Falha no pagamento - Pedido #\${order.orderNumber}\`,
          template: 'payment-failed',
          data: {
            firstName: order.user.firstName,
            orderNumber: order.orderNumber,
            failureReason: paymentIntent.last_payment_error?.message,
          },
        });
      }

      logger.info(\`Payment failed for order: \${orderId}\`);
    } catch (error) {
      logger.error('Failed to handle payment failure:', error);
    }
  }

  // Handle charge dispute
  private static async handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
    try {
      logger.warn(\`Charge dispute created: \${dispute.id}\`, {
        amount: dispute.amount,
        reason: dispute.reason,
        status: dispute.status,
      });

      // Notify admin about dispute
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: \`Contestação de cobrança - \${dispute.id}\`,
        template: 'charge-dispute',
        data: {
          disputeId: dispute.id,
          amount: dispute.amount / 100,
          reason: dispute.reason,
          status: dispute.status,
        },
      });
    } catch (error) {
      logger.error('Failed to handle charge dispute:', error);
    }
  }

  // Handle invoice payment succeeded
  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    try {
      logger.info(\`Invoice payment succeeded: \${invoice.id}\`);
      
      // Handle subscription or recurring payment logic here
      // This would be used for subscription-based features
    } catch (error) {
      logger.error('Failed to handle invoice payment:', error);
    }
  }

  // Get payment analytics
  static async getPaymentAnalytics(startDate: Date, endDate: Date): Promise<any> {
    try {
      const charges = await stripe.charges.list({
        created: {
          gte: Math.floor(startDate.getTime() / 1000),
          lte: Math.floor(endDate.getTime() / 1000),
        },
        limit: 100,
      });

      const totalAmount = charges.data.reduce((sum, charge) => sum + charge.amount, 0);
      const successfulCharges = charges.data.filter(charge => charge.status === 'succeeded');
      const failedCharges = charges.data.filter(charge => charge.status === 'failed');

      return {
        totalTransactions: charges.data.length,
        totalAmount: totalAmount / 100,
        successfulTransactions: successfulCharges.length,
        failedTransactions: failedCharges.length,
        successRate: (successfulCharges.length / charges.data.length) * 100,
        averageTransactionValue: totalAmount / charges.data.length / 100,
      };
    } catch (error) {
      logger.error('Failed to get payment analytics:', error);
      throw new AppError('Erro ao buscar analytics de pagamento', 500);
    }
  }
}

export default PaymentService;
    `;
  }
}

// =============================================================================
// 2. SERVIÇO DE CACHE (REDIS)
// =============================================================================

/*
Serviço de cache distribuído usando Redis para otimização
de performance e redução de carga no banco de dados.
*/

class CacheService {
  static getCacheService() {
    return `
// src/services/cacheService.ts
import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalKeys: number;
  memoryUsage: string;
}

class CacheService {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 hour
  private keyPrefix: string = 'ecommerce:';
  private stats = {
    hits: 0,
    misses: 0,
  };

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });

    this.redis.on('close', () => {
      logger.warn('Redis connection closed');
    });
  }

  private getKey(key: string, prefix?: string): string {
    const finalPrefix = prefix || this.keyPrefix;
    return \`\${finalPrefix}\${key}\`;
  }

  // Set cache value
  async set(
    key: string,
    value: any,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const finalKey = this.getKey(key, options.prefix);
      const serializedValue = JSON.stringify(value);
      const ttl = options.ttl || this.defaultTTL;

      await this.redis.setex(finalKey, ttl, serializedValue);
      
      logger.debug(\`Cache set: \${finalKey} (TTL: \${ttl}s)\`);
    } catch (error) {
      logger.error('Cache set error:', error);
      throw new AppError('Erro ao definir cache', 500);
    }
  }

  // Get cache value
  async get<T = any>(key: string, prefix?: string): Promise<T | null> {
    try {
      const finalKey = this.getKey(key, prefix);
      const value = await this.redis.get(finalKey);

      if (value === null) {
        this.stats.misses++;
        logger.debug(\`Cache miss: \${finalKey}\`);
        return null;
      }

      this.stats.hits++;
      logger.debug(\`Cache hit: \${finalKey}\`);
      
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      this.stats.misses++;
      return null;
    }
  }

  // Delete cache value
  async del(key: string, prefix?: string): Promise<void> {
    try {
      const finalKey = this.getKey(key, prefix);
      await this.redis.del(finalKey);
      
      logger.debug(\`Cache deleted: \${finalKey}\`);
    } catch (error) {
      logger.error('Cache delete error:', error);
      throw new AppError('Erro ao deletar cache', 500);
    }
  }

  // Check if key exists
  async exists(key: string, prefix?: string): Promise<boolean> {
    try {
      const finalKey = this.getKey(key, prefix);
      const result = await this.redis.exists(finalKey);
      
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  // Set with expiration
  async setex(
    key: string,
    seconds: number,
    value: any,
    prefix?: string
  ): Promise<void> {
    try {
      const finalKey = this.getKey(key, prefix);
      const serializedValue = JSON.stringify(value);
      
      await this.redis.setex(finalKey, seconds, serializedValue);
      
      logger.debug(\`Cache setex: \${finalKey} (TTL: \${seconds}s)\`);
    } catch (error) {
      logger.error('Cache setex error:', error);
      throw new AppError('Erro ao definir cache com expiração', 500);
    }
  }

  // Increment value
  async incr(key: string, prefix?: string): Promise<number> {
    try {
      const finalKey = this.getKey(key, prefix);
      const result = await this.redis.incr(finalKey);
      
      logger.debug(\`Cache incremented: \${finalKey} = \${result}\`);
      
      return result;
    } catch (error) {
      logger.error('Cache increment error:', error);
      throw new AppError('Erro ao incrementar cache', 500);
    }
  }

  // Decrement value
  async decr(key: string, prefix?: string): Promise<number> {
    try {
      const finalKey = this.getKey(key, prefix);
      const result = await this.redis.decr(finalKey);
      
      logger.debug(\`Cache decremented: \${finalKey} = \${result}\`);
      
      return result;
    } catch (error) {
      logger.error('Cache decrement error:', error);
      throw new AppError('Erro ao decrementar cache', 500);
    }
  }

  // Get multiple keys
  async mget<T = any>(keys: string[], prefix?: string): Promise<(T | null)[]> {
    try {
      const finalKeys = keys.map(key => this.getKey(key, prefix));
      const values = await this.redis.mget(...finalKeys);
      
      return values.map(value => {
        if (value === null) {
          this.stats.misses++;
          return null;
        }
        
        this.stats.hits++;
        return JSON.parse(value) as T;
      });
    } catch (error) {
      logger.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  // Set multiple keys
  async mset(
    keyValuePairs: Record<string, any>,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      const ttl = options.ttl || this.defaultTTL;
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        const finalKey = this.getKey(key, options.prefix);
        const serializedValue = JSON.stringify(value);
        pipeline.setex(finalKey, ttl, serializedValue);
      });
      
      await pipeline.exec();
      
      logger.debug(\`Cache mset: \${Object.keys(keyValuePairs).length} keys\`);
    } catch (error) {
      logger.error('Cache mset error:', error);
      throw new AppError('Erro ao definir múltiplos caches', 500);
    }
  }

  // Delete keys by pattern
  async delPattern(pattern: string, prefix?: string): Promise<number> {
    try {
      const finalPattern = this.getKey(pattern, prefix);
      const keys = await this.redis.keys(finalPattern);
      
      if (keys.length === 0) {
        return 0;
      }
      
      const result = await this.redis.del(...keys);
      
      logger.debug(\`Cache pattern deleted: \${finalPattern} (\${result} keys)\`);
      
      return result;
    } catch (error) {
      logger.error('Cache delete pattern error:', error);
      throw new AppError('Erro ao deletar padrão de cache', 500);
    }
  }

  // Get cache statistics
  async getStats(): Promise<CacheStats> {
    try {
      const info = await this.redis.info('memory');
      const dbSize = await this.redis.dbsize();
      
      const memoryMatch = info.match(/used_memory_human:(\S+)/);
      const memoryUsage = memoryMatch ? memoryMatch[1] : 'Unknown';
      
      const totalRequests = this.stats.hits + this.stats.misses;
      const hitRate = totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0;
      
      return {
        hits: this.stats.hits,
        misses: this.stats.misses,
        hitRate: Math.round(hitRate * 100) / 100,
        totalKeys: dbSize,
        memoryUsage,
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      throw new AppError('Erro ao buscar estatísticas do cache', 500);
    }
  }

  // Clear all cache
  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
      this.stats.hits = 0;
      this.stats.misses = 0;
      
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Cache clear error:', error);
      throw new AppError('Erro ao limpar cache', 500);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Cache health check failed:', error);
      return false;
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      await this.redis.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }

  // Cache wrapper for functions
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key, options.prefix);
      
      if (cached !== null) {
        return cached;
      }
      
      // Execute function and cache result
      const result = await fn();
      await this.set(key, result, options);
      
      return result;
    } catch (error) {
      logger.error('Cache wrap error:', error);
      // If cache fails, still execute the function
      return await fn();
    }
  }
}

// Create singleton instance
const cacheService = new CacheService();

export default cacheService;
    `;
  }
}

// =============================================================================
// 3. SERVIÇO DE BUSCA (ELASTICSEARCH)
// =============================================================================

/*
Serviço de busca avançada usando Elasticsearch para
busca de produtos, filtros e recomendações.
*/

class SearchService {
  static getSearchService() {
    return `
// src/services/searchService.ts
import { Client } from '@elastic/elasticsearch';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SearchQuery {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

interface SearchResult {
  products: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  aggregations?: any;
}

interface ProductDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isActive: boolean;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

class SearchService {
  private client: Client;
  private indexName: string = 'products';

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
      },
      requestTimeout: 30000,
      pingTimeout: 3000,
    });

    this.setupIndex();
  }

  // Setup Elasticsearch index
  private async setupIndex(): Promise<void> {
    try {
      const indexExists = await this.client.indices.exists({
        index: this.indexName,
      });

      if (!indexExists) {
        await this.createIndex();
      }

      logger.info('Elasticsearch index setup completed');
    } catch (error) {
      logger.error('Failed to setup Elasticsearch index:', error);
    }
  }

  // Create index with mapping
  private async createIndex(): Promise<void> {
    try {
      await this.client.indices.create({
        index: this.indexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            analysis: {
              analyzer: {
                product_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: [
                    'lowercase',
                    'asciifolding',
                    'stop',
                    'snowball',
                  ],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: {
                type: 'text',
                analyzer: 'product_analyzer',
                fields: {
                  keyword: { type: 'keyword' },
                  suggest: {
                    type: 'completion',
                    analyzer: 'product_analyzer',
                  },
                },
              },
              description: {
                type: 'text',
                analyzer: 'product_analyzer',
              },
              price: { type: 'float' },
              category: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              brand: {
                type: 'text',
                fields: {
                  keyword: { type: 'keyword' },
                },
              },
              rating: { type: 'float' },
              reviewCount: { type: 'integer' },
              stock: { type: 'integer' },
              isActive: { type: 'boolean' },
              tags: { type: 'keyword' },
              images: { type: 'keyword' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });

      logger.info('Elasticsearch index created successfully');
    } catch (error) {
      logger.error('Failed to create Elasticsearch index:', error);
      throw new AppError('Erro ao criar índice de busca', 500);
    }
  }

  // Index a product
  async indexProduct(product: ProductDocument): Promise<void> {
    try {
      await this.client.index({
        index: this.indexName,
        id: product.id,
        body: product,
      });

      logger.debug(\`Product indexed: \${product.id}\`);
    } catch (error) {
      logger.error('Failed to index product:', error);
      throw new AppError('Erro ao indexar produto', 500);
    }
  }

  // Bulk index products
  async bulkIndexProducts(products: ProductDocument[]): Promise<void> {
    try {
      const body = products.flatMap(product => [
        { index: { _index: this.indexName, _id: product.id } },
        product,
      ]);

      const response = await this.client.bulk({ body });

      if (response.errors) {
        logger.error('Bulk indexing errors:', response.items);
      }

      logger.info(\`Bulk indexed \${products.length} products\`);
    } catch (error) {
      logger.error('Failed to bulk index products:', error);
      throw new AppError('Erro ao indexar produtos em lote', 500);
    }
  }

  // Search products
  async searchProducts(searchQuery: SearchQuery): Promise<SearchResult> {
    try {
      const {
        query = '',
        category,
        minPrice,
        maxPrice,
        brand,
        rating,
        inStock,
        sortBy = 'relevance',
        page = 1,
        limit = 20,
      } = searchQuery;

      const from = (page - 1) * limit;

      // Build query
      const must: any[] = [
        { term: { isActive: true } },
      ];

      if (query) {
        must.push({
          multi_match: {
            query,
            fields: [
              'name^3',
              'description^2',
              'category',
              'brand',
              'tags',
            ],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        });
      }

      // Filters
      const filter: any[] = [];

      if (category) {
        filter.push({ term: { 'category.keyword': category } });
      }

      if (brand) {
        filter.push({ term: { 'brand.keyword': brand } });
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        const priceRange: any = {};
        if (minPrice !== undefined) priceRange.gte = minPrice;
        if (maxPrice !== undefined) priceRange.lte = maxPrice;
        filter.push({ range: { price: priceRange } });
      }

      if (rating !== undefined) {
        filter.push({ range: { rating: { gte: rating } } });
      }

      if (inStock) {
        filter.push({ range: { stock: { gt: 0 } } });
      }

      // Sort
      const sort: any[] = [];
      switch (sortBy) {
        case 'price_asc':
          sort.push({ price: { order: 'asc' } });
          break;
        case 'price_desc':
          sort.push({ price: { order: 'desc' } });
          break;
        case 'rating':
          sort.push({ rating: { order: 'desc' } });
          break;
        case 'newest':
          sort.push({ createdAt: { order: 'desc' } });
          break;
        default:
          if (query) {
            sort.push({ _score: { order: 'desc' } });
          } else {
            sort.push({ createdAt: { order: 'desc' } });
          }
      }

      // Execute search
      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: {
            bool: {
              must,
              filter,
            },
          },
          sort,
          from,
          size: limit,
          aggs: {
            categories: {
              terms: {
                field: 'category.keyword',
                size: 10,
              },
            },
            brands: {
              terms: {
                field: 'brand.keyword',
                size: 10,
              },
            },
            price_ranges: {
              range: {
                field: 'price',
                ranges: [
                  { to: 50 },
                  { from: 50, to: 100 },
                  { from: 100, to: 200 },
                  { from: 200, to: 500 },
                  { from: 500 },
                ],
              },
            },
            avg_rating: {
              avg: {
                field: 'rating',
              },
            },
          },
        },
      });

      const products = response.body.hits.hits.map((hit: any) => ({
        ...hit._source,
        score: hit._score,
      }));

      const total = response.body.hits.total.value;
      const totalPages = Math.ceil(total / limit);

      return {
        products,
        total,
        page,
        limit,
        totalPages,
        aggregations: response.body.aggregations,
      };
    } catch (error) {
      logger.error('Search failed:', error);
      throw new AppError('Erro na busca de produtos', 500);
    }
  }

  // Get search suggestions
  async getSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          suggest: {
            product_suggest: {
              prefix: query,
              completion: {
                field: 'name.suggest',
                size: limit,
              },
            },
          },
        },
      });

      const suggestions = response.body.suggest.product_suggest[0].options.map(
        (option: any) => option.text
      );

      return suggestions;
    } catch (error) {
      logger.error('Failed to get suggestions:', error);
      return [];
    }
  }

  // Get similar products
  async getSimilarProducts(productId: string, limit: number = 5): Promise<any[]> {
    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: {
            more_like_this: {
              fields: ['name', 'description', 'category', 'brand'],
              like: [
                {
                  _index: this.indexName,
                  _id: productId,
                },
              ],
              min_term_freq: 1,
              max_query_terms: 12,
            },
          },
          size: limit,
        },
      });

      return response.body.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
      logger.error('Failed to get similar products:', error);
      return [];
    }
  }

  // Update product in index
  async updateProduct(productId: string, updates: Partial<ProductDocument>): Promise<void> {
    try {
      await this.client.update({
        index: this.indexName,
        id: productId,
        body: {
          doc: updates,
        },
      });

      logger.debug(\`Product updated in index: \${productId}\`);
    } catch (error) {
      logger.error('Failed to update product in index:', error);
      throw new AppError('Erro ao atualizar produto no índice', 500);
    }
  }

  // Delete product from index
  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: productId,
      });

      logger.debug(\`Product deleted from index: \${productId}\`);
    } catch (error) {
      logger.error('Failed to delete product from index:', error);
      throw new AppError('Erro ao deletar produto do índice', 500);
    }
  }

  // Sync all products from database
  async syncProducts(): Promise<void> {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
          images: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      });

      const documents: ProductDocument[] = products.map(product => {
        const avgRating = product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0;

        return {
          id: product.id,
          name: product.name,
          description: product.description || '',
          price: product.price.toNumber(),
          category: product.category.name,
          brand: product.brand || '',
          rating: avgRating,
          reviewCount: product.reviews.length,
          stock: product.stock,
          isActive: product.isActive,
          tags: product.tags || [],
          images: product.images.map(img => img.url),
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        };
      });

      await this.bulkIndexProducts(documents);
      
      logger.info(\`Synced \${documents.length} products to search index\`);
    } catch (error) {
      logger.error('Failed to sync products:', error);
      throw new AppError('Erro ao sincronizar produtos', 500);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.ping();
      return response.statusCode === 200;
    } catch (error) {
      logger.error('Elasticsearch health check failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const searchService = new SearchService();

export default searchService;
    `;
  }
}

// =============================================================================
// 4. MIDDLEWARE DE RATE LIMITING
// =============================================================================

/*
Middleware para controle de taxa de requisições e proteção
contra ataques de força bruta e spam.
*/

class RateLimitingService {
  static getRateLimitingService() {
    return `
// src/middleware/rateLimiting.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

// Custom key generator
const keyGenerator = (req: Request): string => {
  // Use user ID if authenticated, otherwise use IP
  if (req.user) {
    return \`user:\${req.user.id}\`;
  }
  
  // Get real IP address
  const forwarded = req.headers['x-forwarded-for'] as string;
  const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
  
  return \`ip:\${ip}\`;
};

// Custom handler for rate limit exceeded
const rateLimitHandler = (req: Request, res: Response) => {
  logger.warn('Rate limit exceeded', {
    key: keyGenerator(req),
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
  });
  
  res.status(429).json({
    success: false,
    error: {
      message: 'Muitas requisições. Tente novamente mais tarde.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(req.rateLimit?.resetTime || 0),
    },
  });
};

// Skip successful requests for certain endpoints
const skipSuccessfulRequests = (req: Request, res: Response): boolean => {
  // Skip counting successful requests for read-only endpoints
  const readOnlyPaths = ['/api/products', '/api/categories', '/api/search'];
  const isReadOnly = readOnlyPaths.some(path => req.path.startsWith(path));
  
  return isReadOnly && res.statusCode < 400;
};

// General rate limiting
export const generalRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each key to 1000 requests per windowMs
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each key to 5 requests per windowMs
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// API rate limiting
export const apiRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each key to 100 requests per minute
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests,
  standardHeaders: true,
  legacyHeaders: false,
});

// Search rate limiting
export const searchRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each key to 30 search requests per minute
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting
export const uploadRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each key to 10 uploads per hour
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Password reset rate limiting
export const passwordResetRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each key to 3 password reset requests per hour
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Order creation rate limiting
export const orderRateLimit = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each key to 5 order creations per minute
  keyGenerator,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Dynamic rate limiting based on user role
export const dynamicRateLimit = (options: {
  guest: { windowMs: number; max: number };
  user: { windowMs: number; max: number };
  admin: { windowMs: number; max: number };
}) => {
  return (req: Request, res: Response, next: Function) => {
    let config = options.guest; // Default to guest limits
    
    if (req.user) {
      if (req.user.role === 'ADMIN') {
        config = options.admin;
      } else {
        config = options.user;
      }
    }
    
    const rateLimiter = rateLimit({
      store: new RedisStore({
        sendCommand: (...args: string[]) => redis.call(...args),
      }),
      windowMs: config.windowMs,
      max: config.max,
      keyGenerator,
      handler: rateLimitHandler,
      standardHeaders: true,
      legacyHeaders: false,
    });
    
    rateLimiter(req, res, next);
  };
};

// Burst protection middleware
export const burstProtection = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 1000, // 1 second
  max: 10, // Maximum 10 requests per second
  keyGenerator,
  handler: rateLimitHandler,
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down middleware for repeated requests
export const slowDown = require('express-slow-down')({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 100 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  keyGenerator,
});

// Rate limiting analytics
export const getRateLimitStats = async (key: string): Promise<any> => {
  try {
    const stats = await redis.hgetall(\`rl:\${key}\`);
    return {
      totalRequests: parseInt(stats.totalHits || '0'),
      remainingRequests: parseInt(stats.remaining || '0'),
      resetTime: new Date(parseInt(stats.resetTime || '0')),
      isBlocked: parseInt(stats.totalHits || '0') >= parseInt(stats.limit || '0'),
    };
  } catch (error) {
    logger.error('Failed to get rate limit stats:', error);
    return null;
  }
};

// Clear rate limit for a key
export const clearRateLimit = async (key: string): Promise<void> => {
  try {
    await redis.del(\`rl:\${key}\`);
    logger.info(\`Rate limit cleared for key: \${key}\`);
  } catch (error) {
    logger.error('Failed to clear rate limit:', error);
  }
};
    `;
  }
}

// Função de inicialização do módulo
function initializePaymentCacheServices() {
  console.log('💳 Pagamentos, Cache e Serviços Avançados');
  console.log('==========================================');
  
  console.log('\n💳 Serviço de Pagamento (Stripe):');
  console.log('✅ Criação de Payment Intents');
  console.log('✅ Confirmação de pagamentos');
  console.log('✅ Gerenciamento de clientes');
  console.log('✅ Métodos de pagamento salvos');
  console.log('✅ Sistema de reembolsos');
  console.log('✅ Webhooks para eventos');
  console.log('✅ Analytics de pagamento');
  
  console.log('\n🚀 Serviço de Cache (Redis):');
  console.log('✅ Cache distribuído com TTL');
  console.log('✅ Operações em lote (mget/mset)');
  console.log('✅ Padrões de cache (get/set/del)');
  console.log('✅ Estatísticas de hit/miss');
  console.log('✅ Cache wrapper para funções');
  console.log('✅ Health check e monitoramento');
  
  console.log('\n🔍 Serviço de Busca (Elasticsearch):');
  console.log('✅ Indexação de produtos');
  console.log('✅ Busca full-text avançada');
  console.log('✅ Filtros e agregações');
  console.log('✅ Sugestões de busca');
  console.log('✅ Produtos similares');
  console.log('✅ Sincronização com banco');
  
  console.log('\n🛡️ Rate Limiting:');
  console.log('✅ Limitação por IP e usuário');
  console.log('✅ Diferentes limites por endpoint');
  console.log('✅ Proteção contra força bruta');
  console.log('✅ Rate limiting dinâmico por role');
  console.log('✅ Proteção contra burst');
  console.log('✅ Analytics de rate limiting');
  
  console.log('\n🎯 Benefícios da Implementação:');
  console.log('- Performance otimizada com cache distribuído');
  console.log('- Busca rápida e relevante com Elasticsearch');
  console.log('- Pagamentos seguros com Stripe');
  console.log('- Proteção contra ataques e abuse');
  console.log('- Monitoramento e analytics detalhados');
  console.log('- Escalabilidade horizontal');
  
  console.log('\n📊 Métricas e Monitoramento:');
  console.log('- Taxa de sucesso de pagamentos');
  console.log('- Performance de cache (hit rate)');
  console.log('- Latência de busca');
  console.log('- Rate limiting por endpoint');
  console.log('- Uso de recursos (CPU, memória)');
}

// Executar se chamado diretamente
if (require.main === module) {
  initializePaymentCacheServices();
}

module.exports = {
  PaymentService,
  CacheService,
  SearchService,
  RateLimitingService,
  initializePaymentCacheServices
};

/*
=============================================================================
                    PAGAMENTOS, CACHE E SERVIÇOS AVANÇADOS
                           PROJETO E-COMMERCE
=============================================================================

Esta implementação completa os serviços avançados do backend:

💳 PAGAMENTOS COM STRIPE:
- Integração completa com Stripe API
- Suporte a múltiplos métodos de pagamento
- Webhooks para eventos em tempo real
- Sistema de reembolsos automatizado
- Analytics detalhados de transações

🚀 CACHE COM REDIS:
- Cache distribuído de alta performance
- Operações otimizadas em lote
- Estatísticas de performance
- Cache wrapper para funções
- TTL configurável por contexto

🔍 BUSCA COM ELASTICSEARCH:
- Indexação automática de produtos
- Busca full-text com relevância
- Filtros e agregações avançadas
- Sugestões e autocomplete
- Recomendações de produtos similares

🛡️ RATE LIMITING:
- Proteção contra ataques DDoS
- Limitação por usuário e IP
- Configuração dinâmica por role
- Analytics de uso da API
- Proteção específica por endpoint

O backend agora está completo com todos os serviços essenciais
para uma aplicação e-commerce de produção.
=============================================================================
*/