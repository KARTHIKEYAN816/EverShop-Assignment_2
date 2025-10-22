import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { creatingNewProductPage } from '../pages/creatingNewProductPage';
import { DatabasePage } from '../utils/dbconnection';
import { ProductEditPage } from '../pages/productEditPage';

let productPage: creatingNewProductPage;
let loginPage: LoginPage;
let editProductdetails: ProductEditPage;
let createdProductName: string = '';
let updatedProductName: string = '';
let InitialProductImage: string='';
let UpdatedProductImage: string='';

test.describe('NewProduct', () => {
  test.describe.configure({ mode: 'serial' });

  // Helper function for login
  async function performLogin(page: any) {
    loginPage = new LoginPage(page);
    await loginPage.adminLogin();
  }

  test('TC 01:Adding NewProduct', async ({ page }) => {
    await performLogin(page);
    productPage = new creatingNewProductPage(page);
    const productData = await productPage.addingNewProduct();
    createdProductName = productData.Name;
    console.log('Created Product Name:', createdProductName);
    //Verifying Product Save Toaster
    await productPage.verifyProductSaved();
    //Verifying Product is displayed in Products List
    await productPage.isCreatedProductdisplayed(createdProductName);
    //Taking initial Product Image
   InitialProductImage = await productPage.initialProductImage(createdProductName);
  });

  test('TC 02 & 03: Updating Product details', async ({ page }) => {
    await performLogin(page);
    editProductdetails = new ProductEditPage(page);
    
    //navigating to Products DashBoard
    await editProductdetails.navigateToProducts();
    
    //Selecting created Product
    await editProductdetails.selectingProduct(createdProductName);
    
    //Editing Product details
    const updatedData = await editProductdetails.UpdatingProduct();
    updatedProductName=updatedData.Name;
    
    //Updating Image
    await editProductdetails.UpdateImages();
    
  //Saving the Updated details
    await editProductdetails.SaveUpdatedDetail();
   console.log('Updated Product Name:', updatedProductName);
   
    //Taking Updated Product Image
  UpdatedProductImage = await editProductdetails.UpdatedproductImage(updatedProductName);

   //Checking whether Image is updated
  expect(UpdatedProductImage).not.toBe(InitialProductImage);

  //checking the Initial Product is not displaying after Updation
  await editProductdetails.isProductNotDisplaying(createdProductName);
  });

  test('TC 04: Verify Product Details in Database', async () => {
    const databasePage = new DatabasePage();
    try {
      await databasePage.connect();
      await databasePage.verifyProductDetails(updatedProductName);
    } finally {
      await databasePage.disconnect();
    }
  });

    test('TC 05: Deleting Updated Product', async ({ page }) => {
    await performLogin(page);
    editProductdetails = new ProductEditPage(page);
    //navigating to Products Dashboard
    await editProductdetails.navigateToProducts();
    //Selecting Product Checkbox
    await editProductdetails.SelectingUpdatedProductCheckbox(updatedProductName);
    //Deleting updated Product
    await editProductdetails.DeleteProduct();
  });

});

// Additional DB validation tests
test.describe('Additional Database Validation Tests', () => {
  test('TC 06: Verify Product Count in Database', async () => {
    const databasePage = new DatabasePage();
    try {
      await databasePage.connect();
      await databasePage.verifyProductCountInDatabase();
    } finally {
      await databasePage.disconnect();
    }
  });

  test('TC 07: Verify All Products List', async () => {
    const databasePage = new DatabasePage();
    try {
      await databasePage.connect();
      await databasePage.verifyAllProductsList();
    } finally {
      await databasePage.disconnect();
    }
  });
});