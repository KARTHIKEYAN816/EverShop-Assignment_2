import{Page,expect} from '@playwright/test';
import { BasePage } from './basePage';
import { applocators, getLocator } from '../tests/locators/subscription.locator';
import * as helper from "../utils/helper";
import { ENV } from '../utils/env';

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
  //Updating Product Name
  async updateProductName(UpdateProductName:string):Promise<void>{
    await this.locator(applocators.Newproduct.nameInput).fill(UpdateProductName);
  }
    //Updating Product Price
  async updateProductPrice(updateProductPrice:string):Promise<void>{
    await this.locator(applocators.Newproduct.priceInput).fill(updateProductPrice)
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
  await helper.selectingProductCheckbox(this.page,ProductName);
}
//Deleting Updated Product
async DeleteProduct():Promise<void>{
  const deleteButton = this.locator(applocators.Products.DeleteButton);
  await deleteButton.waitFor({ state: 'visible' });
  await deleteButton.click();
  await this.locator(applocators.Products.DeletePopup.Delete).click();
}

}