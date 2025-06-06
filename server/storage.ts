import {
  users,
  type User,
  type InsertUser,
  categories,
  type Category,
  type InsertCategory,
  products,
  type Product,
  type InsertProduct,
  cartItems,
  type CartItem,
  type InsertCartItem,
  orders,
  type Order,
  type InsertOrder,
  orderItems,
  type OrderItem,
  type InsertOrderItem,
  testimonials,
  type Testimonial,
  type InsertTestimonial,
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
    // Add categories based on provided data
    const engineTransmissionCategory = this.createCategory({
      name: "Engine & Transmission",
      slug: "engine-transmission",
      description:
        "Essential components for your motorcycle's engine and transmission",
      image: "/assets/images/categories/engine.avif",
    });

    const electricalElectronicsCategory = this.createCategory({
      name: "Electrical & Electronics",
      slug: "electrical-electronics",
      description: "Electrical components and electronics for your motorcycle",
      image: "/assets/images/categories/electrical.avif",
    });

    const wheelsTiresCategory = this.createCategory({
      name: "Wheels & Tires",
      slug: "wheels-tires",
      description: "Premium wheels and tires for your motorcycle",
      image: "/assets/images/categories/wheels.avif",
    });

    const brakingSystemCategory = this.createCategory({
      name: "Braking System",
      slug: "braking-system",
      description:
        "High-performance brake components for optimal stopping power",
      image: "/assets/images/categories/brakes.avif",
    });

    const bodyFrameCategory = this.createCategory({
      name: "Body & Frame",
      slug: "body-frame",
      description: "Body parts and frame components for your motorcycle",
      image: "/assets/images/categories/engine.avif", // Using engine image as fallback for body & frame
    });

    const lightingIndicatorsCategory = this.createCategory({
      name: "Lighting & Indicators",
      slug: "lighting-indicators",
      description: "Lighting systems and indicators for your motorcycle",
      image: "/assets/images/categories/light.avif",
    });

    const fuelAirSystemCategory = this.createCategory({
      name: "Fuel & Air System",
      slug: "fuel-air-system",
      description: "Fuel and air system components for your motorcycle",
      image: "/assets/images/categories/fuel.avif",
    });

    const driveSystemCategory = this.createCategory({
      name: "Drive System",
      slug: "drive-system",
      description: "Drive system components for your motorcycle",
      image: "/assets/images/categories/drive system.avif",
    });

    const miscMaintenanceCategory = this.createCategory({
      name: "Miscellaneous & Maintenance",
      slug: "misc-maintenance",
      description:
        "Miscellaneous parts and maintenance supplies for your motorcycle",
      image: "/assets/images/categories/oil.avif",
    });

    const suspensionSteeringCategory = this.createCategory({
      name: "Suspension & Steering",
      slug: "suspension-steering",
      description: "Suspension and steering components for your motorcycle",
      image: "/assets/images/categories/suspension.avif",
    });

    // Add products from the provided data
    this.createProduct({
      name: "NGK C7HSA Sparkplug",
      slug: "ngk-c7hsa-sparkplug",
      description: "Standard spark plug for small motorcycles",
      price: 110.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/NGK C7HSA Sparkplug.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.5,
      reviewCount: 32,
    });

    this.createProduct({
      name: "NGK CPR8EA-9 Spark Plug",
      slug: "ngk-cpr8ea-9-spark-plug",
      description: "High-performance plug for enhanced ignition timing",
      price: 180.0,
      originalPrice: 200.0,
      imageUrl: "/assets/images/products/Kawasaki Fury CDI.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 45,
    });

    this.createProduct({
      name: "NGK CR7E Spark Plug",
      slug: "ngk-cr7e-spark-plug",
      description: "Durable spark plug for reliable engine starts",
      price: 150.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Raider 150 Dual Band CDI.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.3,
      reviewCount: 28,
    });

    this.createProduct({
      name: "Rusi 125cc Piston Kit",
      slug: "rusi-125cc-piston-kit",
      description: "OEM replacement piston kit for Rusi 125cc",
      price: 320.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Mio i 125 Piston Kit.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      rating: 4.6,
      reviewCount: 19,
    });

    this.createProduct({
      name: "Mio i 125 Piston Kit",
      slug: "mio-i-125-piston-kit",
      description: "Quality piston kit for Mio i 125 engine",
      price: 400.0,
      originalPrice: 450.0,
      imageUrl: "/assets/images/products/Mio i 125 Piston Kit.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.8,
      reviewCount: 37,
    });

    this.createProduct({
      name: "Raider 150 Piston Kit",
      slug: "raider-150-piston-kit",
      description: "High-performance piston for Raider 150",
      price: 750.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Raider 150 Piston Kit.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.9,
      reviewCount: 42,
    });

    this.createProduct({
      name: "Barako 175 Piston Kit",
      slug: "barako-175-piston-kit",
      description: "Durable piston kit for Barako 175 engine",
      price: 600.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Barako 175 Piston Kit.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: true,
      isBestseller: false,
      rating: 4.5,
      reviewCount: 25,
    });

    this.createProduct({
      name: "Wave 125 Clutch Assembly",
      slug: "wave-125-clutch-assembly",
      description: "Complete clutch set for Wave 125",
      price: 480.0,
      originalPrice: 520.0,
      imageUrl: "/assets/images/products/Fury 125 Clutch Assy.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.4,
      reviewCount: 31,
    });

    this.createProduct({
      name: "Sniper 150 Clutch Set",
      slug: "sniper-150-clutch-set",
      description: "Performance clutch kit for Sniper 150",
      price: 750.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Sniper 150 Clutch Set.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 28,
    });

    this.createProduct({
      name: "Fury 125 Clutch Assy",
      slug: "fury-125-clutch-assy",
      description: "Stock replacement clutch for Fury 125",
      price: 450.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Fury 125 Clutch Assy.jpg",
      categoryId: engineTransmissionCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.2,
      reviewCount: 17,
    });

    this.createProduct({
      name: "Rusi CDI Racing Blue Core",
      slug: "rusi-cdi-racing-blue-core",
      description: "Racing CDI for enhanced Rusi performance",
      price: 350.0,
      originalPrice: 400.0,
      imageUrl: "/assets/images/products/Rusi CDI Racing Blue Core.jpg",
      categoryId: electricalElectronicsCategory.id,
      inStock: true,
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      rating: 4.6,
      reviewCount: 23,
    });

    this.createProduct({
      name: "Mio i 125 BRT CDI",
      slug: "mio-i-125-brt-cdi",
      description: "BRT CDI upgrade for Mio i 125 tuning",
      price: 950.0,
      originalPrice: 1050.0,
      imageUrl: "/assets/images/products/Mio i 125 BRT CDI.jpg",
      categoryId: electricalElectronicsCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: true,
      isBestseller: true,
      rating: 4.8,
      reviewCount: 34,
    });

    this.createProduct({
      name: "Raider 150 Dual Band CDI",
      slug: "raider-150-dual-band-cdi",
      description: "Dual-band CDI for Raider 150 mods",
      price: 1200.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Raider 150 Dual Band CDI.jpg",
      categoryId: electricalElectronicsCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.9,
      reviewCount: 41,
    });

    this.createProduct({
      name: "Kawasaki Fury CDI",
      slug: "kawasaki-fury-cdi",
      description: "OEM CDI for Kawasaki Fury",
      price: 580.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Kawasaki Fury CDI.jpg",
      categoryId: electricalElectronicsCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: false,
      rating: 4.4,
      reviewCount: 19,
    });

    this.createProduct({
      name: "Motolite MF 4L-BS",
      slug: "motolite-mf-4l-bs",
      description: "Maintenance-free 4L-BS battery by Motolite",
      price: 980.0,
      originalPrice: null,
      imageUrl: "/assets/images/products/Motolite MF 4L-BS.jpg",
      categoryId: electricalElectronicsCategory.id,
      inStock: true,
      isFeatured: true,
      isNew: false,
      isBestseller: true,
      rating: 4.7,
      reviewCount: 52,
    });

    // Add testimonials
    this.createTestimonial({
      name: "Michael R.",
      text: "Great quality parts at affordable prices. The NGK spark plugs I ordered worked perfectly in my Honda Wave.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      bikeModel: "Honda Wave 125",
    });

    this.createTestimonial({
      name: "Jessica T.",
      text: "The shipping was fast and the clutch assembly I purchased was exactly what I needed for my Yamaha Sniper.",
      rating: 4,
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      bikeModel: "Yamaha Sniper 150",
    });

    this.createTestimonial({
      name: "David L.",
      text: "I've tried many different CDI units for my Raider 150, but this dual band CDI is by far the best. The performance improvement is noticeable.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      bikeModel: "Suzuki Raider 150",
    });

    this.createTestimonial({
      name: "Anna M.",
      text: "The piston kit for my Mio was easy to install and runs smoothly. Will definitely shop here again.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
      bikeModel: "Yamaha Mio i 125",
    });
  }

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

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    search?: string;
    inStock?: boolean;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (options?.categoryId) {
      products = products.filter(
        (product) => product.categoryId === options.categoryId,
      );
    }

    if (options?.featured) {
      products = products.filter((product) => product.isFeatured);
    }

    if (options?.search) {
      const searchTerm = options.search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description?.toLowerCase() || "").includes(searchTerm),
      );
    }

    if (options?.inStock !== undefined) {
      products = products.filter(
        (product) => product.inStock === options.inStock,
      );
    }

    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug,
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

  async getCartItems(cartId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.cartId === cartId,
    );
  }

  async getCartItem(
    cartId: string,
    productId: number,
  ): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.cartId === cartId && item.productId === productId,
    );
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(
    id: number,
    quantity: number,
  ): Promise<CartItem | undefined> {
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
    const itemsToRemove = Array.from(this.cartItems.entries())
      .filter(([_, item]) => item.cartId === cartId)
      .map(([id, _]) => id);

    itemsToRemove.forEach((id) => this.cartItems.delete(id));
    return true;
  }

  async createOrder(
    insertOrder: InsertOrder,
    items: InsertOrderItem[],
  ): Promise<Order> {
    const id = this.orderIdCounter++;
    const order: Order = { ...insertOrder, id };
    this.orders.set(id, order);

    // Create order items
    items.forEach((item) => {
      const orderItemId = this.orderItemIdCounter++;
      const orderItem: OrderItem = { ...item, id: orderItemId, orderId: id };
      this.orderItems.set(orderItemId, orderItem);
    });

    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(
    insertTestimonial: InsertTestimonial,
  ): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = { ...insertTestimonial, id };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
}

import { DatabaseStorage } from "./database-storage";

// Uncomment the following line to use database storage instead of memory storage
// export const storage = new DatabaseStorage();
export const storage = new MemStorage();
