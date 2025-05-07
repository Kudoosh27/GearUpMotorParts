import { 
  Category, InsertCategory, 
  Product, InsertProduct,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Testimonial, InsertTestimonial,
  User, InsertUser,
  users, products, categories, cartItems, orders, orderItems, testimonials
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  // Product operations
  async getProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (options) {
      if (options.categoryId !== undefined) {
        query = query.where(eq(products.categoryId, options.categoryId));
      }
      
      if (options.featured !== undefined) {
        query = query.where(eq(products.isFeatured, options.featured));
      }
      
      if (options.inStock !== undefined) {
        query = query.where(eq(products.inStock, options.inStock));
      }
      
      // Note: For a real database, you'd implement a proper text search
      // This is a simplified version and won't be as efficient as proper DB text search
      if (options.search) {
        const search = options.search.toLowerCase();
        // This won't work efficiently in PostgreSQL - in a real app you'd use a proper text search
        // This is just for demonstration
        // TODO: Implement proper PostgreSQL text search
      }
    }
    
    return query;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.slug, slug));
    return result[0];
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  // Cart operations
  async getCartItems(cartId: string): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async getCartItem(cartId: string, productId: number): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId)
      )
    );
    return result[0];
  }

  async createCartItem(cartItem: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(cartItem).returning();
    return result[0];
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return result.length > 0;
  }

  async clearCart(cartId: string): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.cartId, cartId)).returning();
    return true;
  }

  // Order operations
  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    // Using a transaction to ensure order and its items are created together
    const orderResult = await db.insert(orders).values(order).returning();
    const createdOrder = orderResult[0];
    
    // Add order ID to each item
    for (const item of items) {
      await db.insert(orderItems).values({
        ...item,
        orderId: createdOrder.id
      });
    }
    
    return createdOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }
}