import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  orders, type Order, type InsertOrder,
  orderItems, type OrderItem, type InsertOrderItem,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";

// Storage interface for all data operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Product operations
  getProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(cartId: string): Promise<CartItem[]>;
  getCartItem(cartId: string, productId: number): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(cartId: string): Promise<boolean>;

  // Order operations
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private testimonials: Map<number, Testimonial>;
  
  // ID counters
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.testimonials = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.testimonialIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const engineCategory = this.createCategory({
      name: "Engine Parts",
      slug: "engine-parts",
      description: "Essential components for your motorcycle's engine",
      image: "https://pixabay.com/get/gbfe7935869651d9d6479791df6861b0d784bb7cdd28bdb4b76cb4a82c2200562d5f8d26f9be26d1c7a8ca82b46f4177e63e976d573a5e47215e11f32c6512099_1280.jpg"
    });

    const brakeCategory = this.createCategory({
      name: "Brake Systems",
      slug: "brake-systems",
      description: "High-performance brake components for optimal stopping power",
      image: "https://pixabay.com/get/ga1c876062eaf26a3bf54cc05558c5e73beb9af013731e576230b96e3fbd5e36bf5d52405de94934d84988932323175b2ead716a8c73b9b4e80203b51043a285f_1280.jpg"
    });

    const suspensionCategory = this.createCategory({
      name: "Suspension",
      slug: "suspension",
      description: "Suspension parts for a smooth and controlled ride",
      image: "https://pixabay.com/get/g86da22780b1da1df1137f30887b7aef915cd76c89f9815378ff9d1fec2515fa96d269e99bfae20940673b4df4477d981a5c36e52dd3f3877ca17d80c0bf3e42e_1280.jpg"
    });

    const electricalCategory = this.createCategory({
      name: "Electrical",
      slug: "electrical",
      description: "Electrical components and wiring for your motorcycle",
      image: "https://pixabay.com/get/g960695d29bdea171a3136b9cac87ed42fcabd204a87f08b5a6088f0c2012d1f7112dc967be6e2b9bb13545fe471d9e53023d1222bedcc23af48b606bcfd5482a_1280.jpg"
    });

    const accessoriesCategory = this.createCategory({
      name: "Accessories",
      slug: "accessories",
      description: "Enhance your ride with our premium motorcycle accessories",
      image: "https://images.unsplash.com/photo-1558979159-2b18a4070a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    });

    const maintenanceCategory = this.createCategory({
      name: "Maintenance",
      slug: "maintenance",
      description: "Keep your motorcycle in top condition with our maintenance supplies",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
    });

    // Add products
    this.createProduct({
      name: "High-Performance Brake Pads",
      slug: "high-performance-brake-pads",
      description: "Premium brake pads designed for maximum stopping power and durability. These high-performance pads provide excellent heat resistance and minimal fade, even under extreme conditions.",
      price: 49.99,
      originalPrice: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      categoryId: brakeCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.5,
      reviewCount: 42
    });

    this.createProduct({
      name: "Premium Oil Filter",
      slug: "premium-oil-filter",
      description: "High-quality oil filter designed to remove contaminants and extend engine life. Features advanced filtration technology for superior engine protection.",
      price: 12.99,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1601612628452-9e99ced43524?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      categoryId: engineCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.0,
      reviewCount: 28
    });

    this.createProduct({
      name: "Chain and Sprocket Kit",
      slug: "chain-sprocket-kit",
      description: "Complete chain and sprocket kit for optimal power transfer. Includes front and rear sprockets and a high-strength chain designed for durability and performance.",
      price: 129.99,
      originalPrice: 149.99,
      imageUrl: "https://pixabay.com/get/gadee2d780d9cce38442e905af43216e5499068543d561cf199acf58da363b5c79278fed014b66dcf88c03ec30c38aa339a1a307130ab89b38449e4c6b14f1d1d_1280.jpg",
      categoryId: engineCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      rating: 5.0,
      reviewCount: 17
    });

    this.createProduct({
      name: "Handlebar Grip Set",
      slug: "handlebar-grip-set",
      description: "Ergonomic handlebar grips for improved control and comfort. These premium grips reduce vibration and provide excellent grip in all weather conditions.",
      price: 24.99,
      originalPrice: null,
      imageUrl: "https://pixabay.com/get/gbc1037291bb6f638e400a6acddfce7a418d360e864c3ebb649d7aca3a6eb6bb873fed2edd3823015da87804f7b3719d5ae5b26e29e4da296580fa40623e846e9_1280.jpg",
      categoryId: accessoriesCategory.id,
      inStock: false,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 3.0,
      reviewCount: 9
    });

    // Add more products for various categories
    this.createProduct({
      name: "Performance Air Filter",
      slug: "performance-air-filter",
      description: "High-flow air filter that increases horsepower and acceleration while providing excellent filtration. Washable and reusable design.",
      price: 29.99,
      originalPrice: 34.99,
      imageUrl: "https://pixabay.com/get/g2d1e6305a9bb2cc13bdda23b5ab9bc61e9b6f41cd7b02b5b56baeb01bae00d6ec0cd845fb7e7d94c7e8d7a63613b8c6bd9db9e1d834f4c0de01398a24ca8e0ed_1280.jpg",
      categoryId: engineCategory.id,
      inStock: true,
      isFeatured: false,
      isNew: false,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 36
    });

    this.createProduct({
      name: "Adjustable Suspension Kit",
      slug: "adjustable-suspension-kit",
      description: "Fully adjustable front and rear suspension system that allows you to fine-tune your ride for comfort or performance.",
      price: 349.99,
      originalPrice: 399.99,
      imageUrl: "https://pixabay.com/get/g0ce5ac7f76e49923aefc79607a9a6ffb3ffa9b8c1ff69b67d78bbd7c08c14bbebc2c73dd694f44ae2dc2071b9b4747ebb5f96ffdb52b72dc47b37d8ee88ce76f_1280.jpg",
      categoryId: suspensionCategory.id,
      inStock: true,
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      rating: 4.9,
      reviewCount: 22
    });

    // Add testimonials
    this.createTestimonial({
      name: "Michael R.",
      avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      rating: 5,
      text: "I've been buying parts from GearUp for years. Their quality and customer service is unmatched. The brake pads I purchased last month have significantly improved my stopping power.",
      bikeModel: "Honda CBR Owner"
    });

    this.createTestimonial({
      name: "Sarah J.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      rating: 4,
      text: "The chain and sprocket kit I ordered arrived quickly and was easy to install. The quality is excellent, and my bike runs smoother than ever. Highly recommended!",
      bikeModel: "Yamaha MT-07 Owner"
    });

    this.createTestimonial({
      name: "David L.",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
      rating: 5,
      text: "The technical support team at GearUp helped me find the perfect suspension upgrade for my Ducati. The parts fit perfectly, and the ride quality has improved tremendously.",
      bikeModel: "Ducati Monster Owner"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (options) {
      if (options.categoryId !== undefined) {
        products = products.filter(p => p.categoryId === options.categoryId);
      }
      if (options.featured !== undefined) {
        products = products.filter(p => p.isFeatured === options.featured);
      }
      if (options.inStock !== undefined) {
        products = products.filter(p => p.inStock === options.inStock);
      }
      if (options.search) {
        const search = options.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(search) || 
          (p.description && p.description.toLowerCase().includes(search))
        );
      }
    }

    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Cart methods
  async getCartItems(cartId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.cartId === cartId
    );
  }

  async getCartItem(cartId: string, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.cartId === cartId && item.productId === productId
    );
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    const updatedItem: CartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(cartId: string): Promise<boolean> {
    const items = await this.getCartItems(cartId);
    for (const item of items) {
      this.cartItems.delete(item.id);
    }
    return true;
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderIdCounter++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);

    // Create order items
    for (const item of items) {
      const orderItemId = this.orderItemIdCounter++;
      const orderItem: OrderItem = { ...item, id: orderItemId, orderId: id };
      this.orderItems.set(orderItemId, orderItem);
    }

    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

import { DatabaseStorage } from "./database-storage";

// Uncomment the following line to use database storage instead of memory storage
export const storage = new DatabaseStorage();
// export const storage = new MemStorage();
