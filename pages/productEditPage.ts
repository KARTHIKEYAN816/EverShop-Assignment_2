import{Page,expect} from '@playwright/test';
import { BasePage } from './basePage';
import { applocators, getLocator } from '../tests/locators/subscription.locator';
import * as helper from "../utils/helper";
import { ENV } from '../utils/env';
import testData from "../tests/data/testData.json";
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
  
export class ProductEditPage extends BasePage{
    constructor(page:Page){
        super(page)
  }
 // Navigating to Created products page
    async navigateToProducts(): Promise<void> {
    await this.click(applocators.Dashboard.Catalog.Products);
  }  
//Selecting Required Product
async selectingProduct(ProductName:string): Promise<void> {
    await helper.selectingProductFromList(this.page,ProductName)
    await expect(getLocator(this.page,applocators.Newproduct.editProductTitle)).toContainText(ProductName);
  }
  //Updating Product Basic details
  async updateBasicInfo(productName?: string, sku?: string, price?: string, weight?: string): Promise<void> {
    await this.locator(applocators.Newproduct.nameInput).fill(productName || testData.product.Name);
    await this.locator(applocators.Newproduct.skuInput).fill(sku || testData.product.SKU);
    await this.locator(applocators.Newproduct.priceInput).fill(price || testData.product.Price);
    await this.locator(applocators.Newproduct.weightInput).fill(weight || testData.product.Weight);
  }
// Updating SEO metadata
  async updateSEO(urlKey?: string, metaTitle?: string, metaKeywords?: string, metaDescription?: string): Promise<void> {
    await this.locator(applocators.Newproduct.urlKeyInput).fill(urlKey || testData.product.urlKeyInput);
    await this.locator(applocators.Newproduct.metaTitleInput).fill(metaTitle || testData.product.metaTitleInput);
    await this.locator(applocators.Newproduct.metaKeywordsInput).fill(metaKeywords || testData.product.metaKeywordsInput);
    await this.locator(applocators.Newproduct.metaDescriptionInput).fill(metaDescription || testData.product.metaDescriptionInput);
  }

  //Updating Product Images
  async UpdateImages():Promise<void>{
await helper.UpdatingProductImage(this.page, this.page.locator(applocators.Newproduct.Image), [ENV.UpdateImage1, ENV.UpdateImage2]);
  }

//Saving Updated details
async SaveUpdatedDetail():Promise<void>{
 await this.locator(applocators.Newproduct.saveButton).click();
await helper.ProductSaveToaster(this.page);
}
//Selecting Updated Product
async SelectingUpdatedProductCheckbox(ProductName:string):Promise<void>{
  //await helper.selectingProductCheckbox(this.page,ProductName);
  await helper.selectingSingleProductCheckbox(this.page,ProductName);
}
//Deleting Updated Product
async DeleteProduct():Promise<void>{
  const deleteButton = this.locator(applocators.Products.DeleteButton);
  await deleteButton.waitFor({ state: 'visible' });
  await deleteButton.click();
  await this.locator(applocators.Products.DeletePopup.Delete).click();
}
  //Taking Updated Product Image
  async UpdatedproductImage(ProductName:string): Promise<string> {
    await this.navigateToProducts();
    const image = await helper.capturingProductImage(this.page, ProductName);
    return image || '';
  }
  //Verifying product is not displaying in Products dashboard
  async isProductNotDisplaying(productName: string):Promise<void>{
  await expect(this.page.getByRole("link", { name: productName, exact: true })).not.toBeVisible();
  // await expect(this.page.getByRole("link", { name: productName, exact: true })).not.toBeAttached();
  }
  
 // Generating unique product data
  private generateUniqueProduct(): ProductData {
    const timestamp = Date.now().toString();
    return {
      ...testData.product,
      Name: `${testData.Updatedproduct.Name}_${timestamp}`,
      SKU: `${testData.Updatedproduct.SKU}_${timestamp}`,
      urlKeyInput: `shirt${timestamp}`,
      metaTitleInput: `newShirt${timestamp}`,
      metaKeywordsInput: `Shirt${timestamp}`,
      metaDescriptionInput: `Mens shirt${timestamp}`,
    };
  }

  // Updating product with unique data
    async UpdatingProduct(): Promise<ProductData> {
    const product = this.generateUniqueProduct();
    await this.updateBasicInfo(product.Name, product.SKU, product.Price, product.Weight);
    await this.updateSEO(product.urlKeyInput, product.metaTitleInput, product.metaKeywordsInput, product.metaDescriptionInput);    
    return product;
  }



}