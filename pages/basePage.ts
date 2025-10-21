import { Page, Locator, expect } from "@playwright/test";
import {getLocator,RoleLocator} from "../tests/locators/subscription.locator";
 
export class BasePage {
  readonly page: Page;
 
  constructor(page: Page) {
    this.page = page;
  }
 
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }
 
  locator(locator: RoleLocator | string): Locator {
    return getLocator(this.page, locator);
  }
 
  async click(locator: RoleLocator | string): Promise<void> {
    await this.locator(locator).click();
  }
 
  async fill(locator: RoleLocator | string, value: string): Promise<void> {
    await this.locator(locator).fill(value);
  }
 
  async verifyVisible(locator: RoleLocator | string): Promise<void> {
    await expect(this.locator(locator)).toBeVisible();
  }
 
  async verifyUrl(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }
 
  async waitForTimeout(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }
}