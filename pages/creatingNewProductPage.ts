import { Page, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { applocators } from "../tests/locators/subscription.locator";
import testData from "../tests/data/testData.json";
import { ENV } from "../utils/env";
import { DashBoardPage } from "./dashBoardPage";
import * as helper from "../utils/helper";

interface ProductData {
  Name: string;
  SKU: string;
  Price: string;
  Weight: string;
  Quantity: string;
  urlKeyInput: string;
  metaTitleInput: string;
  metaKeywordsInput: string;
  metaDescriptionInput: string;
}
let dashboardpage: DashBoardPage;
export class creatingNewProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Generating unique product data
  private generateUniqueProduct(): ProductData {
    const timestamp = Date.now().toString();
    return {
      ...testData.product,
      Name: `${testData.product.Name}_${timestamp}`,
      SKU: `${testData.product.SKU}_${timestamp}`,
      urlKeyInput: `shirt${timestamp}`,
      metaTitleInput: `newShirt${timestamp}`,
      metaKeywordsInput: `Shirt${timestamp}`,
      metaDescriptionInput: `Mens shirt${timestamp}`,
    };
  }

  // Navigating to new product page
  async navigateToNewProduct(): Promise<void> {
    await this.click(applocators.Newproduct.newProductLink);
  }

  // Fill basic product details
  async fillBasicInfo(productName?: string, sku?: string, price?: string, weight?: string): Promise<void> {
    await this.locator(applocators.Newproduct.nameInput).fill(productName || testData.product.Name);
    await this.locator(applocators.Newproduct.skuInput).fill(sku || testData.product.SKU);
    await this.locator(applocators.Newproduct.priceInput).fill(price || testData.product.Price);
    await this.locator(applocators.Newproduct.weightInput).fill(weight || testData.product.Weight);
  }

  // Select product category
  async selectCategory(): Promise<void> {
    await this.locator(applocators.Newproduct.categoryLink).click();
    await applocators.Newproduct.CategoryMen(this.page).click();
  }

  // Configure product settings (enable, visible, in-stock)
  async configureSettings(): Promise<void> {
    await this.locator(applocators.Newproduct.disabledToggle).click();
    await this.locator(applocators.Newproduct.enabledToggle).click();
    await this.locator(applocators.Newproduct.NotVisibleToggle).click();
    await this.locator(applocators.Newproduct.visibleToggle).click();
    await this.locator(applocators.Newproduct.NoStockAvailabilityToggle).click();
    await this.locator(applocators.Newproduct.StockAvailabilityToggle).click();
  }

  // Set quantity and variants
  async setInventory(quantity?: string): Promise<void> {
    await this.locator(applocators.Newproduct.quantityInput).fill(quantity || testData.product.Quantity);
    await helper.selectEachColorSizeCombination(
      applocators.Newproduct.selectColor(this.page),
      applocators.Newproduct.selectSize(this.page)
    );
  }

  // Upload product images
  async uploadImages(): Promise<void> {
    await helper.selectImage(this.locator(applocators.Newproduct.Image), ENV.filePath1);
    await helper.selectImage(this.locator(applocators.Newproduct.Image), ENV.filepath2);
  }

  // Fill SEO metadata
  async fillSEO(urlKey?: string, metaTitle?: string, metaKeywords?: string, metaDescription?: string): Promise<void> {
    await this.locator(applocators.Newproduct.urlKeyInput).fill(urlKey || testData.product.urlKeyInput);
    await this.locator(applocators.Newproduct.metaTitleInput).fill(metaTitle || testData.product.metaTitleInput);
    await this.locator(applocators.Newproduct.metaKeywordsInput).fill(metaKeywords || testData.product.metaKeywordsInput);
    await this.locator(applocators.Newproduct.metaDescriptionInput).fill(metaDescription || testData.product.metaDescriptionInput);
  }

  // Save product
  async save(): Promise<void> {
    await this.locator(applocators.Newproduct.saveButton).click();
    await helper.ProductSaveToaster(this.page);
  }

  // Verify product was saved successfully
  async verifyProductSaved(): Promise<void> {
    await expect(this.page.getByText("Product saved successfully!")).toBeVisible();
  }

  //Verifying whether created product is displaying in Products dashboard
  async isCreatedProductdisplayed(productName: string):Promise<void>{
  dashboardpage = new DashBoardPage(this.page);
  dashboardpage.navigatingToProductList();
  await expect(this.page.getByRole("link", { name: productName, exact: true })).toBeVisible();
  }

  //Taking created Product Image
  async initialProductImage(ProductName:string): Promise<string> {
    const image = await helper.capturingProductImage(this.page, ProductName);
    return image || '';
  }

  // Creating product with custom data
  async createProduct(
    productName?: string,
    sku?: string,
    price?: string,
    weight?: string,
    quantity?: string
  ): Promise<void> {
    await this.fillBasicInfo(productName, sku, price, weight);
    await this.selectCategory();
    await this.configureSettings();
    await this.setInventory(quantity);
    await this.uploadImages();
    await this.fillSEO();
    await this.save();
  }

  // Creating product with unique data
  async addingNewProduct(): Promise<ProductData> {
    const product = this.generateUniqueProduct();
    await this.navigateToNewProduct();
    await this.fillBasicInfo(product.Name, product.SKU, product.Price, product.Weight);
    await this.selectCategory();
    await this.configureSettings();
    await this.setInventory(product.Quantity);
    await this.uploadImages();
    await this.fillSEO(product.urlKeyInput, product.metaTitleInput, product.metaKeywordsInput, product.metaDescriptionInput);
    await this.save();
    return product;
  }


}