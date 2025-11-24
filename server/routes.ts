// Reference: javascript_log_in_with_replit blueprint
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin, isDriver } from "./replitAuth";
import { insertProductSchema, insertCartItemSchema, insertOrderSchema } from "@shared/schema";
import { createPaymentIntent, confirmPayment, refundPayment } from "./services/stripe";
import { sendSMSNotification, sendEmailNotification, notifyOrderStatusChange } from "./services/notifications";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: error.message || "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      console.error("Error updating product:", error);
      res.status(400).json({ message: error.message || "Failed to update product" });
    }
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getCartItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      const item = await storage.addToCart(validatedData);
      res.status(201).json(item);
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ message: error.message || "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      const item = await storage.updateCartItem(req.params.id, quantity);
      if (!item) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      res.json(item);
    } catch (error: any) {
      console.error("Error updating cart:", error);
      res.status(400).json({ message: error.message || "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.removeCartItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  // Order routes
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { deliveryLocation } = req.body;

      if (!deliveryLocation) {
        return res.status(400).json({ message: "Delivery location is required" });
      }

      // Get cart items
      const cartItemsData = await storage.getCartItems(userId);
      if (cartItemsData.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // Calculate total and create order items
      let totalAmount = 0;
      const orderItemsData = cartItemsData.map((item) => {
        const subtotal = (item.product?.pricePerGram || 0) * item.quantity;
        totalAmount += subtotal;
        return {
          productId: item.productId,
          productName: item.product?.name || "Unknown Product",
          quantity: item.quantity,
          pricePerGram: item.product?.pricePerGram || 0,
          subtotal,
        };
      });

      // Create order
      const order = await storage.createOrder(
        {
          userId,
          deliveryLocation,
          totalAmount,
          status: "pending",
        },
        orderItemsData
      );

      // Clear cart
      await storage.clearCart(userId);

      res.status(201).json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: error.message || "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error: any) {
      console.error("Error updating order:", error);
      res.status(400).json({ message: error.message || "Failed to update order" });
    }
  });

  // Admin routes
  app.get("/api/admin/orders", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Driver routes
  app.get("/api/driver/available", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const drivers = await storage.getAvailableDrivers();
      res.json(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Failed to fetch drivers" });
    }
  });

  app.get("/api/driver/stats", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDriverStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching driver stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/driver/deliveries", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getDriverOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  app.post("/api/driver/location", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const { latitude, longitude, speed } = req.body;
      const userId = req.user.claims.sub;
      
      if (!latitude || !longitude) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      await storage.updateDriverLocation(userId, latitude, longitude);
      
      // Track active deliveries
      const orders = await storage.getDriverOrders(userId);
      const activeOrder = orders.find(o => o.status === "out_for_delivery");
      
      if (activeOrder) {
        await storage.updateDeliveryTracking(activeOrder.id, userId, latitude, longitude, speed || 0);
      }

      res.json({ message: "Location updated" });
    } catch (error) {
      console.error("Error updating location:", error);
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  app.post("/api/driver/accept/:orderId", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const order = await storage.assignOrderToDriver(req.params.orderId, userId);
      res.json(order);
    } catch (error) {
      console.error("Error accepting order:", error);
      res.status(500).json({ message: "Failed to accept order" });
    }
  });

  app.patch("/api/driver/availability", isAuthenticated, isDriver, async (req: any, res) => {
    try {
      const { isAvailable } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.setDriverAvailability(userId, isAvailable);
      res.json(user);
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ message: "Failed to update availability" });
    }
  });

  app.get("/api/delivery/:orderId/tracking", isAuthenticated, async (req, res) => {
    try {
      const tracking = await storage.getDeliveryTracking(req.params.orderId);
      res.json(tracking);
    } catch (error) {
      console.error("Error fetching tracking:", error);
      res.status(500).json({ message: "Failed to fetch tracking" });
    }
  });

  // Payment routes
  app.post("/api/payment/create-intent", isAuthenticated, async (req: any, res) => {
    try {
      const { orderId, amount } = req.body;
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.email) return res.status(400).json({ message: "User email not found" });
      
      const paymentIntent = await createPaymentIntent(amount, orderId, user.email);
      await storage.createPaymentRecord(orderId, userId, amount, paymentIntent.id);
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Payment error:", error);
      res.status(500).json({ message: error.message || "Failed to create payment" });
    }
  });

  app.post("/api/payment/confirm", isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId, orderId } = req.body;
      const payment = await confirmPayment(paymentIntentId);
      
      if (payment.status === 'succeeded') {
        await storage.updateOrderStatus(orderId, 'processing');
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        
        // Award loyalty points (1 point per MWK)
        await storage.addLoyaltyPoints(userId, Math.floor((payment.amount || 0) / 100));
        
        // Notify customer
        if (user?.email) {
          await sendEmailNotification(
            user.email,
            'Payment Successful',
            'Your payment has been confirmed. Your order is being processed.'
          );
        }
      }
      
      res.json(payment);
    } catch (error: any) {
      console.error("Confirm payment error:", error);
      res.status(500).json({ message: error.message || "Failed to confirm payment" });
    }
  });

  // Loyalty routes
  app.get("/api/loyalty", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const account = await storage.getLoyaltyAccount(userId);
      res.json(account);
    } catch (error) {
      console.error("Error fetching loyalty:", error);
      res.status(500).json({ message: "Failed to fetch loyalty info" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const eventsList = await storage.getActiveEvents();
      res.json(eventsList || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.json([]);
    }
  });

  app.post("/api/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const event = await storage.createEvent(req.body);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });

  // Inventory alerts routes
  app.get("/api/admin/inventory-alerts", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const alerts = await storage.checkLowInventory();
      res.json(alerts || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.json([]);
    }
  });

  // Analytics routes
  app.get("/api/admin/analytics", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const summary = await storage.getAnalyticsSummary(days);
      res.json(summary || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.json([]);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
