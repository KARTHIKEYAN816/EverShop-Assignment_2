import { expect, Locator, Page } from "@playwright/test";
import { error } from "console";
import testData from '../tests/data/testData.json';
import { FileUrlToPathOptions } from "url";
import { applocators,RoleTextLocator } from "../tests/locators/subscription.locator";
// Generate random email
export function generateRandomEmail(baseEmail: string): string {
  const part = baseEmail.split("@");
  const name = part[0];
  const domain = part[1];
  //const [name, domain] = baseEmail.split('@');
  return `${name}+${Date.now()}@${domain}`;
}

export async function findRecordAndClick(page: Page, recordtext: string) {
  while (true) {
    const rows = page.getByRole("row", { name: recordtext });

    if ((await rows.count()) > 0) {
      await rows.first().getByRole("link").click();
      break;
    }
    const nextButton = page.locator(".next");
    if (!(await nextButton.isVisible())) {
      
    }
    await nextButton.click();
    await page.waitForTimeout(1000);
  }
}

export function getFutureDate(daysForToday: number): {
  month: string;
  day: number;
} {
  const date = new Date();
  date.setDate(date.getDate() + daysForToday);
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  return { month, day };
}

export async function selectdate(
  page: Page,
  daysFromToday: number,
  isEndDate: boolean = false,
  Datelocator: string
) {
  const target = getFutureDate(daysFromToday);
  const targetlabel = `${target.month} ${target.day}`;
  //August 26
  console.log("Selected Date");
  console.log(target.month);
  console.log(target.day);

  const calendar = page.locator(`${Datelocator}`);
  const nextBtn = isEndDate
    ? calendar.locator(".flatpickr-next-month").first()
    : page.locator(".flatpickr-next-month").nth(1);

  // const nextBtn = page.locator('.flatpickr-next-month').nth(1);

  const targetLocator = calendar.getByLabel(targetlabel);
  if (await targetLocator.count()) {
    await targetLocator.first().click();
    return;
  }
  for (let i = 0; i < 12; i++) {
    await nextBtn.click();
    if (await targetLocator.count()) {
      await targetLocator.first().click();
      return;
    }
  }
  throw new Error("date not found");
}

// Selecting every combination of color and size from the test data using the provided locators
export async function selectEachColorSizeCombination(colorLocator: Locator, sizeLocator: Locator) {
  for (const color of testData.product.Color) {
    await colorLocator.selectOption(color);
    for (const size of testData.product.Size) {
      await sizeLocator.selectOption(size);
    }
  }
}

export async function selectImage(imageLocator: Locator, path: string | string[]) {
  await imageLocator.setInputFiles(path);
}

export function ProductDialog(page: Page): Promise<void> {
  return new Promise((resolve) => {
    page.on('dialog', async dialog => {
      console.log(dialog.message);
      let message = dialog.message();
      expect(message).toContain("Product saved successfully!");
      await expect(page.locator('button[aria-label="close"]')).toBeVisible();
      resolve();
    });
  });
}

export async function ProductSaveToaster(page: Page): Promise<void> {
  // Adjust the selector below to match your actual toaster element
  const toaster = page.locator('div[role="alert"]');
  await expect(toaster).toBeVisible({ timeout: 5000 });
  const message = await toaster.textContent();
  if (message) {
    console.log('Toaster message:', message.trim());
  }
  await expect(toaster).toContainText("Product saved successfully!");
 
  const closeBtn = page.locator('button[aria-label="close"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
}

export async function Textvalidation(page: Page, locator: Locator, expectedText: string) {
  await page.waitForTimeout(5000);
  await expect(locator).toHaveText(expectedText);
}

export async function selectingCategory(page:Page, CategoryPopUplocator:Locator, CategoryTypeLocator:Locator) {
  await CategoryPopUplocator.click();
  await CategoryTypeLocator.click();
}

export async function selectingProductFromList(page:Page,ProductName:string){
  const rows = page.locator('.listing.sticky tbody tr:visible');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const columns = rows.nth(i).locator('td:visible');
        const columnCount=await columns.count();
        for(let j=0; j<columnCount;j++){
            const cellvalue=await columns.nth(j).textContent();
        if(cellvalue?.includes(ProductName)){
            await columns.nth(2).click();
            break;
        }
        }
    }
} 

export async function capturingProductImage(page:Page,ProductName:string,ProductImage?:string){
  const rows = page.locator('.listing.sticky tbody tr:visible');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const columns = rows.nth(i).locator('td:visible');
        const columnCount=await columns.count();
        for(let j=0; j<columnCount;j++){
            const cellvalue=await columns.nth(j).textContent();
        if(cellvalue?.includes(ProductName)){
            const imageBuffer = await columns.nth(1).screenshot();
            ProductImage = imageBuffer.toString('base64');
            break;
        }
        }
    }
    return ProductImage;
} 

export async function selectingProductCheckbox(page:Page,ProductName:string){
  const rows = page.locator('.listing.sticky tbody tr:visible');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
        const columns = rows.nth(i).locator('td:visible');
        const columnCount=await columns.count();
        for(let j=0; j<columnCount;j++){
            const cellvalue=await columns.nth(j).textContent();
        if(cellvalue?.includes(ProductName)){  
          // await columns.locator('td > .form-field-container > .field-wrapper > label > .checkbox-unchecked').click();
          await page.waitForTimeout(2000);
          await page.locator('td > .form-field-container > .field-wrapper > label > .checkbox-unchecked').first().click();
            break;
        }
        }
    }
  } 

export async function UpdatingProductImage(page: Page, imageLocator?: Locator, imagePaths?: string | string[]) {
  const Delete = page.locator(applocators.Newproduct.ImageRemove);
  while (await Delete.count() > 0) {
    const count = await Delete.count();
    for (let i = 0; i < count; i++) {
      if (await Delete.nth(i).isVisible()) {
        await Delete.nth(i).click();
        break;
      }
    }
  }
  if (imageLocator && imagePaths) {
    const files = Array.isArray(imagePaths) ? imagePaths : [imagePaths];
    await selectImage(imageLocator, files);
  }
}
export async function ProductImageScreenshot(page: Page) {
  const image = await page.locator('img[src="/assets/catalog/7569/8789/yellow-shirt.webp"]').screenshot();
  return image;
}

