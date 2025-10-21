import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { creatingNewProductPage } from '../pages/creatingNewProductPage';
import { BasePage } from '../pages/basePage';
import { DatabasePage } from '../utils/dbconnection';
import { ProductEditPage } from '../pages/productEditPage';

let basePage: BasePage;
let productPage: creatingNewProductPage;
let loginPage: LoginPage;
let editProductdetails: ProductEditPage;
let createdProductName: string = '';
let updatedProductName: string = 'Mens Blue Shirt';

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
  });

  test('TC 02 & 03: Updating Product details', async ({ page }) => {
    await performLogin(page);
    editProductdetails = new ProductEditPage(page);
    await editProductdetails.navigateToProducts();
    await editProductdetails.selectingProduct(createdProductName);
    await editProductdetails.updateProductName(updatedProductName);
    await editProductdetails.updateProductPrice('20');
    await editProductdetails.UpdateImages();
    await editProductdetails.SaveUpdatedDetail();
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

});

// Additional DB validation tests
test.describe('Additional Database Validation Tests', () => {
  test('TC 05: Verify Product Count in Database', async () => {
    const databasePage = new DatabasePage();
    try {
      await databasePage.connect();
      await databasePage.verifyProductCountInDatabase();
    } finally {
      await databasePage.disconnect();
    }
  });

  test('TC 06: Verify All Products List', async () => {
    const databasePage = new DatabasePage();
    try {
      await databasePage.connect();
      await databasePage.verifyAllProductsList();
    } finally {
      await databasePage.disconnect();
    }
  });
});