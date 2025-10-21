import { Client } from "pg";
import { expect } from '@playwright/test';
import dotenv from "dotenv";

dotenv.config();

//Database Connection Manager:
class DBConnection {
  private client: Client | null = null;

  async connect(): Promise<Client> {
    if (this.client) return this.client;

    this.client = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSLMODE !== "disable",
    });

    await this.client.connect();
    console.log("Connected to database");
    return this.client;
  }

  async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    if (!this.client) await this.connect();
    const result = await this.client!.query(query, params);
    return result.rows;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.end();
      console.log("Database connection closed");
      this.client = null;
    }
  }
}

// Database Page Object
export class DatabasePage {
  private dbConnection: DBConnection;

  constructor() {
    this.dbConnection = new DBConnection();
  }

  async connect(): Promise<void> {
    await this.dbConnection.connect();
  }

  async disconnect(): Promise<void> {
    await this.dbConnection.close();
  }

  private async getProductByName(productName: string): Promise<any[]> {
    return await this.dbConnection.executeQuery(
      `SELECT pd.name as product_name, p.price
       FROM public.product_description pd
       LEFT JOIN public.product p ON pd.product_description_product_id = p.product_id
       WHERE pd.name = $1`,
      [productName]
    );
  }

  private async getAllProducts(): Promise<any[]> {
    return await this.dbConnection.executeQuery(
      `SELECT pd.name, p.price, p.sku, pi.qty as stock
       FROM public.product_description pd
       LEFT JOIN public.product p ON pd.product_description_product_id = p.product_id
       LEFT JOIN public.product_inventory pi ON p.product_id = pi.product_inventory_product_id
       ORDER BY pd.name`
    );
  }

  private async getProductCount(): Promise<number> {
    const result = await this.dbConnection.executeQuery(`SELECT COUNT(*) FROM public.product_description`);
    return parseInt(result[0].count);
  }

  private async getProductImages(productName: string): Promise<any[]> {
    return await this.dbConnection.executeQuery(
      `SELECT pi.product_image_id, pi.origin_image, pi.thumb_image, 
              pi.listing_image, pi.single_image, pi.is_main
       FROM public.product_description pd
       LEFT JOIN public.product p ON pd.product_description_product_id = p.product_id
       LEFT JOIN public.product_image pi ON p.product_id = pi.product_image_product_id
       WHERE pd.name = $1
       ORDER BY pi.is_main DESC, pi.product_image_id`,
      [productName]
    );
  }

  async verifyProductDetails(productName: string): Promise<void> {
    console.log(`\n=== Verifying Product Details: ${productName} ===`);
    
    // Get product details including SKU and Stock
    const productDetails = await this.dbConnection.executeQuery(
      `SELECT pd.name as product_name, p.price, p.sku, pi.qty as stock
       FROM public.product_description pd
       LEFT JOIN public.product p ON pd.product_description_product_id = p.product_id
       LEFT JOIN public.product_inventory pi ON p.product_id = pi.product_inventory_product_id
       WHERE pd.name = $1`,
      [productName]
    );
    
    expect(productDetails.length).toBeGreaterThan(0);
    expect(productDetails[0].product_name).toBe(productName);
    
    console.log('Product Details:');
    console.log(`  Name: ${productDetails[0].product_name}`);
    console.log(`  Price: ${productDetails[0].price}`);
    console.log(`  SKU: ${productDetails[0].sku}`);
    console.log(`  Stock: ${productDetails[0].stock}`);
    
    const productImages = await this.getProductImages(productName);
    
    if (productImages.length > 0) {
      console.log(`\nTotal images found: ${productImages.length}`);
      
      productImages.forEach((image: any, index: number) => {
        console.log(`\nImage ${index + 1}:`);
        console.log(`  Product Image ID: ${image.product_image_id}`);
        console.log(`  Origin Image: ${image.origin_image}`);
        console.log(`  Thumb Image: ${image.thumb_image}`);
        console.log(`  Listing Image: ${image.listing_image}`);
        console.log(`  Single Image: ${image.single_image}`);
        console.log(`  Is Main: ${image.is_main}`);
      });
    } else {
      console.log(`\nNo images found for this product.`);
    }
  }

  async verifyProductCountInDatabase(): Promise<void> {
    console.log('\n=== Verifying Product Count ===');
    const productCount = await this.getProductCount();
    console.log(`Total products in database: ${productCount}`);
    expect(productCount).toBeGreaterThan(0);
  }

  async verifyAllProductsList(): Promise<void> {
    console.log('\n=== Verifying All Products List ===');
    const allProducts = await this.getAllProducts();
    expect(allProducts.length).toBeGreaterThan(0);
    console.log(`Total products found: ${allProducts.length}\n`);
    
    allProducts.forEach((product: any, index: number) => {
      console.log(`${index + 1}. Name: ${product.name}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   SKU: ${product.sku}`);
      console.log(`   Stock: ${product.stock}\n`);
    });
  }
}