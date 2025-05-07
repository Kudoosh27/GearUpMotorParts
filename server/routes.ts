import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertOrderItemSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories API
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });

  // Products API
  app.get("/api/products", async (req: Request, res: Response) => {
    const { categoryId, featured, search, inStock } = req.query;
    
    const options: {
      categoryId?: number;
      featured?: boolean;
      search?: string;
      inStock?: boolean;
    } = {};
    
    if (categoryId) options.categoryId = parseInt(categoryId as string);
    if (featured === "true") options.featured = true;
    if (inStock === "true") options.inStock = true;
    if (search) options.search = search as string;
    
    const products = await storage.getProducts(options);
    res.json(products);
  });

  app.get("/api/products/featured", async (req: Request, res: Response) => {
    const products = await storage.getProducts({ featured: true });
    res.json(products);
  });

  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const product = await storage.getProductBySlug(slug);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });

  // Cart API
  app.get("/api/cart/:cartId", async (req: Request, res: Response) => {
    const { cartId } = req.params;
    const cartItems = await storage.getCartItems(cartId);
    
    // Get product details for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await storage.getProductById(item.productId);
        return {
          ...item,
          product
        };
      })
    );
    
    res.json(cartWithProducts);
  });

  app.post("/api/cart", async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Check if product exists
      const product = await storage.getProductById(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Check if product is in stock
      if (!product.inStock) {
        return res.status(400).json({ message: "Product is out of stock" });
      }
      
      // Check if item already exists in cart
      const existingItem = await storage.getCartItem(cartItemData.cartId, cartItemData.productId);
      
      if (existingItem) {
        // Update quantity instead of creating new item
        const updatedItem = await storage.updateCartItem(existingItem.id, existingItem.quantity + cartItemData.quantity);
        return res.status(200).json(updatedItem);
      }
      
      const cartItem = await storage.createCartItem(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }
      
      const updatedItem = await storage.updateCartItem(parseInt(id), quantity);
      
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/cart/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await storage.removeCartItem(parseInt(id));
      
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/cart/clear/:cartId", async (req: Request, res: Response) => {
    try {
      const { cartId } = req.params;
      await storage.clearCart(cartId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { order, items } = req.body;
      
      const orderData = insertOrderSchema.parse(order);
      
      // Validate each order item
      const orderItems = [];
      for (const item of items) {
        const orderItem = insertOrderItemSchema.parse(item);
        orderItems.push(orderItem);
      }
      
      const newOrder = await storage.createOrder(orderData, orderItems);
      
      // Clear the cart after successful order
      if (req.body.cartId) {
        await storage.clearCart(req.body.cartId);
      }
      
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(parseInt(id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Testimonials API
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });

  const httpServer = createServer(app);
  return httpServer;
}
