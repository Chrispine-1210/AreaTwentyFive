// Reference: javascript_log_in_with_replit and javascript_database blueprints
import {
  users,
  products,
  orders,
  orderItems,
  cartItems,
  deliveryTracking,
  loyaltyProgram,
  paymentRecords,
  events,
  inventoryAlerts,
  notificationLog,
  analyticsSummary,
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
import { db } from "./db";
import { eq, and, desc, lt, gte } from "drizzle-orm";

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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    try {
      return await db.select().from(products).orderBy(desc(products.createdAt));
    } catch (error) {
      console.warn('Database offline, returning empty products', error);
      return [];
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const [product] = await db.select().from(products).where(eq(products.id, id));
      return product;
    } catch (error) {
      console.warn('Database offline, product not found', error);
      return undefined;
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    try {
      const [product] = await db
        .insert(products)
        .values(productData)
        .returning();
      return product;
    } catch (error) {
      console.error('Failed to create product', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    try {
      const [product] = await db
        .update(products)
        .set({ ...productData, updatedAt: new Date() })
        .where(eq(products.id, id))
        .returning();
      return product;
    } catch (error) {
      console.error('Failed to update product', error);
      throw error;
    }
  }

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { product?: Product })[]> {
    const items = await db
      .select()
      .from(cartItems)
      .leftJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.userId, userId));
    
    return items.map(item => ({
      ...item.cart_items,
      product: item.products || undefined,
    }));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existing] = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId),
        eq(cartItems.productId, item.productId)
      ));

    if (existing) {
      // Update quantity
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + item.quantity })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }

    // Add new item
    const [newItem] = await db
      .insert(cartItems)
      .values(item)
      .returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [item] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return item;
  }

  async removeCartItem(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values(orderData)
      .returning();

    // Insert order items
    await db.insert(orderItems).values(
      items.map(item => ({
        ...item,
        orderId: order.id,
      }))
    );

    return order;
  }

  async getOrders(userId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          orderItems: items,
        };
      })
    );

    return ordersWithItems;
  }

  async getAllOrders(): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          orderItems: items,
        };
      })
    );

    return ordersWithItems;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Driver operations
  async getAvailableDrivers(): Promise<User[]> {
    return await db.select().from(users).where(
      and(eq(users.role, "driver"), eq(users.isAvailableForDelivery, true))
    );
  }

  async getDriverStats(driverId: string): Promise<any> {
    const driver = await this.getUser(driverId);
    return {
      totalDeliveries: driver?.totalDeliveries || 0,
      averageRating: driver?.averageRating || "N/A",
      isAvailable: driver?.isAvailableForDelivery || false,
    };
  }

  async assignOrderToDriver(orderId: string, driverId: string): Promise<Order | undefined> {
    const [order] = await db
      .update(orders)
      .set({ driverId, status: "assigned", updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();
    return order;
  }

  async getDriverOrders(driverId: string): Promise<(Order & { orderItems?: OrderItem[] })[]> {
    const driverOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.driverId, driverId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems = await Promise.all(
      driverOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        
        return {
          ...order,
          orderItems: items,
        };
      })
    );

    return ordersWithItems;
  }

  async updateDriverLocation(driverId: string, lat: string, lng: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ currentLatitude: lat, currentLongitude: lng })
      .where(eq(users.id, driverId))
      .returning();
    return user;
  }

  async updateDeliveryTracking(orderId: string, driverId: string, lat: string, lng: string, speed: number): Promise<void> {
    await db.insert(deliveryTracking).values({
      orderId,
      driverId,
      latitude: lat,
      longitude: lng,
      speed,
    });
  }

  async getDeliveryTracking(orderId: string): Promise<any[]> {
    return await db.select().from(deliveryTracking).where(eq(deliveryTracking.orderId, orderId));
  }

  async setDriverAvailability(driverId: string, isAvailable: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isAvailableForDelivery: isAvailable, updatedAt: new Date() })
      .where(eq(users.id, driverId))
      .returning();
    return user;
  }

  // Loyalty Program operations
  async getLoyaltyAccount(userId: string): Promise<any> {
    try {
      const [account] = await db.select().from(loyaltyProgram).where(eq(loyaltyProgram.userId, userId));
      return account || { userId, points: 0, totalSpent: 0, tier: 'bronze' };
    } catch (error) {
      console.warn('Database offline, returning default loyalty account', error);
      return { userId, points: 0, totalSpent: 0, tier: 'bronze' };
    }
  }

  async addLoyaltyPoints(userId: string, points: number): Promise<any> {
    try {
      const existing = await this.getLoyaltyAccount(userId);
      if (existing.id) {
        const [updated] = await db
          .update(loyaltyProgram)
          .set({ points: existing.points + points, lastPointsUpdate: new Date() })
          .where(eq(loyaltyProgram.userId, userId))
          .returning();
        return updated;
      } else {
        const [created] = await db.insert(loyaltyProgram).values({ userId, points }).returning();
        return created;
      }
    } catch (error) {
      console.warn('Failed to add loyalty points', error);
      return { userId, points, tier: 'bronze' };
    }
  }

  // Payment operations
  async createPaymentRecord(orderId: string, userId: string, amount: number, stripeIntentId?: string): Promise<any> {
    try {
      const [record] = await db.insert(paymentRecords).values({
        orderId,
        userId,
        amount,
        stripePaymentIntentId: stripeIntentId,
        status: 'pending',
      }).returning();
      return record;
    } catch (error) {
      console.warn('Failed to create payment record', error);
      return { orderId, userId, amount, status: 'pending', stripePaymentIntentId: stripeIntentId };
    }
  }

  async updatePaymentStatus(paymentId: string, status: string): Promise<any> {
    try {
      const [updated] = await db
        .update(paymentRecords)
        .set({ status, updatedAt: new Date() })
        .where(eq(paymentRecords.id, paymentId))
        .returning();
      return updated;
    } catch (error) {
      console.warn('Failed to update payment status', error);
      return { id: paymentId, status };
    }
  }

  // Events operations
  async getActiveEvents(): Promise<any[]> {
    try {
      return await db.select().from(events).where(eq(events.isActive, true));
    } catch (error) {
      console.warn('Database offline, returning empty events', error);
      return [];
    }
  }

  async createEvent(data: any): Promise<any> {
    try {
      const [event] = await db.insert(events).values(data).returning();
      return event;
    } catch (error) {
      console.error('Failed to create event', error);
      throw error;
    }
  }

  // Inventory Alerts operations
  async checkLowInventory(): Promise<any[]> {
    try {
      return await db
        .select()
        .from(inventoryAlerts)
        .where(and(eq(inventoryAlerts.isActive, true), lt(inventoryAlerts.currentStock, inventoryAlerts.minimumThreshold)));
    } catch (error) {
      console.warn('Database offline, returning empty alerts', error);
      return [];
    }
  }

  async updateInventoryAlert(productId: string, currentStock: number): Promise<void> {
    try {
      await db
        .update(inventoryAlerts)
        .set({ currentStock })
        .where(eq(inventoryAlerts.productId, productId));
    } catch (error) {
      console.warn('Failed to update inventory alert', error);
    }
  }

  // Notification Log operations
  async logNotification(data: any): Promise<any> {
    try {
      const [log] = await db.insert(notificationLog).values(data).returning();
      return log;
    } catch (error) {
      console.warn('Failed to log notification', error);
      return { ...data, id: `mock_${Date.now()}` };
    }
  }

  // Analytics operations
  async getOrCreateDailySummary(date: string): Promise<any> {
    try {
      const [existing] = await db.select().from(analyticsSummary).where(eq(analyticsSummary.date, date));
      if (existing) return existing;
      const [created] = await db.insert(analyticsSummary).values({ date }).returning();
      return created;
    } catch (error) {
      console.warn('Failed to get daily summary', error);
      return { date, totalOrders: 0, totalRevenue: 0, totalCustomers: 0, averageOrderValue: 0 };
    }
  }

  async updateAnalyticsSummary(date: string, data: any): Promise<any> {
    try {
      const [updated] = await db
        .update(analyticsSummary)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(analyticsSummary.date, date))
        .returning();
      return updated;
    } catch (error) {
      console.warn('Failed to update analytics', error);
      return { ...data, date };
    }
  }

  async getAnalyticsSummary(days: number = 30): Promise<any[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const formattedDate = startDate.toISOString().split('T')[0];
      
      return await db
        .select()
        .from(analyticsSummary)
        .where(gte(analyticsSummary.date, formattedDate))
        .orderBy(desc(analyticsSummary.date));
    } catch (error) {
      console.warn('Database offline, returning empty analytics', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
