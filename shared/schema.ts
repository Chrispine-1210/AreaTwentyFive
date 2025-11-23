// Database schema for Mede-Mede Spot e-commerce platform
// Reference: javascript_log_in_with_replit and javascript_database blueprints

import { sql, relations } from 'drizzle-orm';
import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (MANDATORY for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (MANDATORY for Replit Auth, with role-based access)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 50 }).default("customer").notNull(), // customer, admin, driver
  isActive: boolean("is_active").default(true).notNull(),
  // Driver specific fields
  vehicleNumber: varchar("vehicle_number"),
  driverLicenseNumber: varchar("driver_license_number"),
  currentLatitude: varchar("current_latitude"),
  currentLongitude: varchar("current_longitude"),
  isAvailableForDelivery: boolean("is_available_for_delivery").default(false),
  totalDeliveries: integer("total_deliveries").default(0),
  averageRating: varchar("average_rating"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Products table - supports both flowers and pre-rolled packages
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  productType: varchar("product_type", { length: 50 }).notNull(), // "flower" or "preroll"
  strainType: varchar("strain_type", { length: 50 }), // Indica, Sativa, Hybrid (for flowers)
  size: varchar("size"), // For prerolls: 500, 1000, 1500, 2000 (mg)
  pricePerGram: integer("price_per_gram"), // Price in MWK per gram (for flowers)
  totalPrice: integer("total_price"), // Fixed price (for prerolls/packages)
  stockQuantity: integer("stock_quantity").notNull().default(0),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Delivery Tracking table for real-time driver location updates
export const deliveryTracking = pgTable("delivery_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  driverId: varchar("driver_id").notNull().references(() => users.id),
  latitude: varchar("latitude").notNull(),
  longitude: varchar("longitude").notNull(),
  speed: integer("speed").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Orders table with driver assignment and tracking
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  driverId: varchar("driver_id").references(() => users.id),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // pending, processing, assigned, out_for_delivery, completed, cancelled
  deliveryLocation: text("delivery_location").notNull(),
  deliveryLatitude: varchar("delivery_latitude"),
  deliveryLongitude: varchar("delivery_longitude"),
  totalAmount: integer("total_amount").notNull(),
  deliveryFee: integer("delivery_fee").default(0),
  distanceKm: integer("distance_km").default(0), // For calculating delivery fee
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Order Items table
export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(), // Store product name at time of order
  quantity: integer("quantity").notNull(),
  pricePerGram: integer("price_per_gram").notNull(), // Store price at time of order
  subtotal: integer("subtotal").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// Cart Items table
export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const deliveryTrackingRelations = relations(deliveryTracking, ({ one }) => ({
  order: one(orders, {
    fields: [deliveryTracking.orderId],
    references: [orders.id],
  }),
  driver: one(users, {
    fields: [deliveryTracking.driverId],
    references: [users.id],
  }),
}));
