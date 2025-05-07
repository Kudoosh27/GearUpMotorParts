import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, pool } from "../server/db";
import * as schema from "../shared/schema";

// This script will push the schema to the database
async function pushSchema() {
  console.log("Pushing schema to database...");
  
  try {
    // Using direct SQL to create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        image TEXT
      );
      
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        price DOUBLE PRECISION NOT NULL,
        original_price DOUBLE PRECISION,
        image_url TEXT NOT NULL,
        category_id INTEGER NOT NULL,
        in_stock BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        is_bestseller BOOLEAN DEFAULT FALSE,
        rating DOUBLE PRECISION DEFAULT 0,
        review_count INTEGER DEFAULT 0
      );
      
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        cart_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1
      );
      
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        total DOUBLE PRECISION NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        billing_address TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price DOUBLE PRECISION NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        avatar TEXT,
        rating INTEGER NOT NULL,
        text TEXT NOT NULL,
        bike_model TEXT
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);
    
    console.log("Schema successfully pushed to database.");
    
    // You could potentially seed the database here
    await seedDatabase();
    
  } catch (error) {
    console.error("Error pushing schema:", error);
  }
}

// Function to seed the database with initial data
async function seedDatabase() {
  console.log("Seeding database with initial data...");
  
  try {
    // Check if categories table is empty
    const existingCategories = await db.select().from(schema.categories);
    
    if (existingCategories.length === 0) {
      // Seed categories
      await db.insert(schema.categories).values([
        {
          name: "Engine Parts",
          slug: "engine-parts",
          description: "Essential components for your motorcycle's powerhouse",
          image: "https://images.unsplash.com/photo-1590615370581-265ae19a053b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        },
        {
          name: "Brake Systems",
          slug: "brake-systems",
          description: "High-performance brake components for reliable stopping power",
          image: "https://images.unsplash.com/photo-1605152297551-e7bf3222943a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        },
        {
          name: "Suspension",
          slug: "suspension",
          description: "Enhance your ride quality and handling with our suspension components",
          image: "https://images.unsplash.com/photo-1611821333273-3870758fc302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        },
        {
          name: "Exhaust Systems",
          slug: "exhaust-systems",
          description: "Performance exhaust solutions for improved sound and power",
          image: "https://images.unsplash.com/photo-1605937812160-019d6242fabf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        },
        {
          name: "Electrical & Lighting",
          slug: "electrical-lighting",
          description: "Electrical components and lighting upgrades for your motorcycle",
          image: "https://images.unsplash.com/photo-1586878341230-e943d813c5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        },
        {
          name: "Accessories",
          slug: "accessories",
          description: "Essential accessories to enhance your riding experience",
          image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500"
        }
      ]);
      
      console.log("Categories seeded successfully!");
    }
    
    // Get the category IDs for product seeding
    const categories = await db.select().from(schema.categories);
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat.id]));
    
    // Check if products table is empty
    const existingProducts = await db.select().from(schema.products);
    
    if (existingProducts.length === 0 && categories.length > 0) {
      // Seed products
      await db.insert(schema.products).values([
        {
          name: "High-Performance Brake Pads",
          slug: "high-performance-brake-pads",
          description: "Premium brake pads designed for superior stopping power and durability. Perfect for sport and touring motorcycles.",
          price: 49.99,
          originalPrice: 59.99,
          imageUrl: "https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("brake-systems") || 2,
          inStock: true,
          isFeatured: true,
          isNew: false,
          isBestseller: true,
          rating: 4.8,
          reviewCount: 32
        },
        {
          name: "Sport Motorcycle Chain",
          slug: "sport-motorcycle-chain",
          description: "Heavy-duty chain with X-ring technology for maximum durability and performance. Fits most sport motorcycles.",
          price: 89.99,
          originalPrice: null,
          imageUrl: "https://images.unsplash.com/photo-1581481615985-ba4775734a9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("engine-parts") || 1,
          inStock: true,
          isFeatured: true,
          isNew: false,
          isBestseller: false,
          rating: 4.5,
          reviewCount: 18
        },
        {
          name: "LED Headlight Conversion Kit",
          slug: "led-headlight-conversion-kit",
          description: "Upgrade your visibility with this plug-and-play LED headlight conversion. 3x brighter than standard halogen bulbs.",
          price: 129.99,
          originalPrice: 149.99,
          imageUrl: "https://images.unsplash.com/photo-1614025832123-722156758d61?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("electrical-lighting") || 5,
          inStock: true,
          isFeatured: true,
          isNew: true,
          isBestseller: false,
          rating: 4.7,
          reviewCount: 14
        },
        {
          name: "Performance Exhaust System",
          slug: "performance-exhaust-system",
          description: "Stainless steel performance exhaust that increases horsepower and torque while reducing weight. Deep, aggressive sound.",
          price: 349.99,
          originalPrice: 399.99,
          imageUrl: "https://images.unsplash.com/photo-1605937812536-e05a2420c100?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("exhaust-systems") || 4,
          inStock: true,
          isFeatured: true,
          isNew: false,
          isBestseller: true,
          rating: 4.9,
          reviewCount: 27
        },
        {
          name: "Adjustable Suspension Kit",
          slug: "adjustable-suspension-kit",
          description: "Fully adjustable front and rear suspension kit. Customize your ride for comfort or performance.",
          price: 299.99,
          originalPrice: null,
          imageUrl: "https://images.unsplash.com/photo-1579118339938-d16eadbe5275?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("suspension") || 3,
          inStock: false,
          isFeatured: true,
          isNew: false,
          isBestseller: false,
          rating: 4.6,
          reviewCount: 12
        },
        {
          name: "Motorcycle Tank Bag",
          slug: "motorcycle-tank-bag",
          description: "Magnetic tank bag with multiple compartments and map pocket. Perfect for day trips and touring.",
          price: 79.99,
          originalPrice: 89.99,
          imageUrl: "https://images.unsplash.com/photo-1581853761378-c1f87b4d6945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
          categoryId: categoryMap.get("accessories") || 6,
          inStock: true,
          isFeatured: false,
          isNew: true,
          isBestseller: false,
          rating: 4.3,
          reviewCount: 9
        }
      ]);
      
      console.log("Products seeded successfully!");
    }
    
    // Check if testimonials table is empty
    const existingTestimonials = await db.select().from(schema.testimonials);
    
    if (existingTestimonials.length === 0) {
      // Seed testimonials
      await db.insert(schema.testimonials).values([
        {
          name: "Michael R.",
          avatar: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
          rating: 5,
          text: "I've been buying parts from GearUp for years. Their quality and customer service is unmatched. The brake pads I purchased last month have significantly improved my stopping power.",
          bikeModel: "Honda CBR Owner"
        },
        {
          name: "Sarah J.",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
          rating: 4,
          text: "The chain and sprocket kit I ordered arrived quickly and was easy to install. The quality is excellent, and my bike runs smoother than ever. Highly recommended!",
          bikeModel: "Yamaha MT-07 Owner"
        },
        {
          name: "David L.",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50",
          rating: 5,
          text: "The technical support team at GearUp helped me find the perfect suspension upgrade for my Ducati. The parts fit perfectly, and the ride quality has improved tremendously.",
          bikeModel: "Ducati Monster Owner"
        }
      ]);
      
      console.log("Testimonials seeded successfully!");
    }
    
    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run the script
pushSchema().then(() => {
  console.log("Schema push and seeding complete!");
  process.exit(0);
}).catch(error => {
  console.error("An error occurred:", error);
  process.exit(1);
});