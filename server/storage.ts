// Reference: javascript_log_in_with_replit and javascript_database blueprints
import {
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItem,
  type InsertCartItem,
} from "@shared/schema";

export interface IStorage {
  // User operations (MANDATORY for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Cart operations
  getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrders(userId: string): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  getAllOrders(): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Driver operations
  getAvailableDrivers(): Promise<User[]>;
  getDriverStats(driverId: string): Promise<any>;
  assignOrderToDriver(orderId: string, driverId: string): Promise<Order | undefined>;
  getDriverOrders(driverId: string): Promise<(Order & { orderItems?: OrderItem[] })[]>;
  updateDriverLocation(driverId: string, lat: string, lng: string): Promise<User | undefined>;
  updateDeliveryTracking(orderId: string, driverId: string, lat: string, lng: string, speed: number): Promise<void>;
  getDeliveryTracking(orderId: string): Promise<any[]>;
  setDriverAvailability(driverId: string, isAvailable: boolean): Promise<User | undefined>;
  
  // Loyalty Program operations
  getLoyaltyAccount(userId: string): Promise<any>;
  addLoyaltyPoints(userId: string, points: number): Promise<any>;
  
  // Payment operations
  createPaymentRecord(orderId: string, userId: string, amount: number, stripeIntentId?: string): Promise<any>;
  updatePaymentStatus(paymentId: string, status: string): Promise<any>;
  
  // Events operations
  getActiveEvents(): Promise<any[]>;
  createEvent(data: any): Promise<any>;
  
  // Inventory Alerts operations
  checkLowInventory(): Promise<any[]>;
  updateInventoryAlert(productId: string, currentStock: number): Promise<void>;
  
  // Notification Log operations
  logNotification(data: any): Promise<any>;
  
  // Analytics operations
  getOrCreateDailySummary(date: string): Promise<any>;
  updateAnalyticsSummary(date: string, data: any): Promise<any>;
  getAnalyticsSummary(days: number): Promise<any[]>;
}

// In-Memory Storage for Testing
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private deliveryTracking: Map<string, any> = new Map();
  private loyaltyProgram: Map<string, any> = new Map();
  private paymentRecords: Map<string, any> = new Map();
  private events: Map<string, any> = new Map();
  private notifications: any[] = [];
  private nextId = 0;

  constructor() {
    this.initializeTestData();
  }

  private generateId(): string {
    return `test_${++this.nextId}`;
  }

  private initializeTestData() {
    // Test Products - Flowers
    const flower1: Product = {
      id: 'prod_1',
      name: 'Premium Indica Flower',
      description: 'High-quality Indica strain with deep forest notes',
      productType: 'flower',
      strainType: 'Indica',
      pricePerGram: 3500,
      totalPrice: null,
      stockQuantity: 50,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const flower2: Product = {
      id: 'prod_2',
      name: 'Golden Sativa Flower',
      description: 'Energizing Sativa strain, perfect for daytime',
      productType: 'flower',
      strainType: 'Sativa',
      pricePerGram: 3000,
      totalPrice: null,
      stockQuantity: 40,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Test Products - Pre-rolls
    const preroll1: Product = {
      id: 'prod_3',
      name: 'Mini Pre-Roll Pack',
      description: '500mg pre-rolled package, single stick',
      productType: 'preroll',
      strainType: null,
      size: '500',
      pricePerGram: null,
      totalPrice: 500,
      stockQuantity: 100,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const preroll2: Product = {
      id: 'prod_4',
      name: 'Standard Pre-Roll Pack',
      description: '1000mg pre-rolled package, 2 sticks',
      productType: 'preroll',
      strainType: null,
      size: '1000',
      pricePerGram: null,
      totalPrice: 1000,
      stockQuantity: 80,
      imageUrl: null,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(flower1.id, flower1);
    this.products.set(flower2.id, flower2);
    this.products.set(preroll1.id, preroll1);
    this.products.set(preroll2.id, preroll2);

    console.log('✅ In-Memory Storage initialized with test products');
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id || this.generateId(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      profileImageUrl: userData.profileImageUrl,
      role: userData.role || 'customer',
      isActive: userData.isActive !== false,
      vehicleNumber: userData.vehicleNumber,
      driverLicenseNumber: userData.driverLicenseNumber,
      currentLatitude: userData.currentLatitude,
      currentLongitude: userData.currentLongitude,
      isAvailableForDelivery: userData.isAvailableForDelivery,
      totalDeliveries: userData.totalDeliveries || 0,
      averageRating: userData.averageRating,
      loyaltyPoints: userData.loyaltyPoints || 0,
      loyaltyTier: userData.loyaltyTier || 'bronze',
      phoneNumber: userData.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: this.generateId(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;
    this.products.set(newProduct.id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...product, updatedAt: new Date() };
    this.products.set(id, updated);
    return updated;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.userId === userId);
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId),
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = {
      id: this.generateId(),
      ...item,
      createdAt: new Date(),
    };
    this.cartItems.set(cartItem.id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    item.quantity = quantity;
    this.cartItems.set(id, item);
    return item;
  }

  async removeCartItem(id: string): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: string): Promise<void> {
    Array.from(this.cartItems.entries()).forEach(([key, item]) => {
      if (item.userId === userId) {
        this.cartItems.delete(key);
      }
    });
  }

  // Order operations
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const newOrder: Order = {
      id: this.generateId(),
      ...order,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    } as Order;
    this.orders.set(newOrder.id, newOrder);
    items.forEach(item => {
      const orderItem: OrderItem = {
        id: this.generateId(),
        ...item,
        orderId: newOrder.id,
      };
      this.orderItems.set(orderItem.id, orderItem);
    });
    return newOrder;
  }

  async getOrders(userId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const userOrders = Array.from(this.orders.values()).filter(o => o.userId === userId);
    return userOrders.map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async getAllOrders(): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    return Array.from(this.orders.values()).map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    order.status = status;
    order.updatedAt = new Date();
    this.orders.set(id, order);
    return order;
  }

  // Driver operations
  async getAvailableDrivers(): Promise<User[]> {
    return Array.from(this.users.values()).filter(u => u.role === 'driver' && u.isAvailableForDelivery);
  }

  async getDriverStats(driverId: string): Promise<any> {
    const driver = this.users.get(driverId);
    return {
      totalDeliveries: driver?.totalDeliveries || 0,
      averageRating: driver?.averageRating || 'N/A',
      isAvailable: driver?.isAvailableForDelivery || false,
    };
  }

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    order.driverId = driverId;
    order.status = 'assigned';
    this.orders.set(orderId, order);
    return order;
  }

  async getDriverOrders(driverId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const driverOrders = Array.from(this.orders.values()).filter(o => o.driverId === driverId);
    return driverOrders.map(order => ({
      ...order,
      orderItems: Array.from(this.orderItems.values()).filter(item => item.orderId === order.id),
    }));
  }

  async updateDriverLocation(driverId: string, lat: string, lng: string): Promise<User | undefined> {
    const driver = this.users.get(driverId);
    if (!driver) return undefined;
    driver.currentLatitude = lat;
    driver.currentLongitude = lng;
    this.users.set(driverId, driver);
    return driver;
  }

  async updateDeliveryTracking(orderId: string, driverId: string, lat: string, lng: string, speed: number): Promise<void> {
    this.deliveryTracking.set(this.generateId(), { orderId, driverId, latitude: lat, longitude: lng, speed, timestamp: new Date() });
  }

  async getDeliveryTracking(orderId: string): Promise<any[]> {
    return Array.from(this.deliveryTracking.values()).filter(t => t.orderId === orderId);
  }

  async setDriverAvailability(driverId: string, isAvailable: boolean): Promise<User | undefined> {
    const driver = this.users.get(driverId);
    if (!driver) return undefined;
    driver.isAvailableForDelivery = isAvailable;
    this.users.set(driverId, driver);
    return driver;
  }

  // Loyalty Program operations
  async getLoyaltyAccount(userId: string): Promise<any> {
    return this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: 'bronze' };
  }

  async addLoyaltyPoints(userId: string, points: number): Promise<any> {
    const account = this.loyaltyProgram.get(userId) || { userId, points: 0, totalSpent: 0, tier: 'bronze' };
    account.points += points;
    this.loyaltyProgram.set(userId, account);
    return account;
  }

  // Payment operations
  async createPaymentRecord(orderId: string, userId: string, amount: number, stripeIntentId?: string): Promise<any> {
    const record = { id: this.generateId(), orderId, userId, amount, stripePaymentIntentId: stripeIntentId, status: 'pending' };
    this.paymentRecords.set(record.id, record);
    return record;
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    const record = this.paymentRecords.get(paymentId);
    if (record) record.status = status;
    return record;
  }

  // Events operations
  async getActiveEvents(): Promise<any[]> {
    return Array.from(this.events.values()).filter(e => e.isActive);
  }

  async createEvent(data: any): Promise<any> {
    const event = { id: this.generateId(), ...data };
    this.events.set(event.id, event);
    return event;
  }

  // Inventory Alerts operations
  async checkLowInventory(): Promise<any[]> {
    return [];
  }

  async updateInventoryAlert(productId: string, currentStock: number): Promise<void> {
    // noop
  }

  // Notification Log operations
  async logNotification(data: any): Promise<any> {
    this.notifications.push(data);
    return data;
  }

  // Analytics operations
  async getOrCreateDailySummary(date: string): Promise<any> {
    return { date, totalOrders: 0, totalRevenue: 0 };
  }

  async updateAnalyticsSummary(date: string, data: any): Promise<any> {
    return { date, ...data };
  }

  async getAnalyticsSummary(days: number = 30): Promise<any[]> {
    return [];
  }
}

// Use MemoryStorage for testing
export const storage = new MemoryStorage();
