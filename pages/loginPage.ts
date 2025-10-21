import { test, expect } from "@playwright/test";
import { BasePage } from "./basePage";
import { applocators } from "../tests/locators/subscription.locator";
import testData from "../tests/data/testData.json";
import { ENV } from "../utils/env";
 
export class LoginPage extends BasePage {
  async openNewCustomerForm() {
    await this.locator(applocators.navSignup).nth(1).click();
    await expect(this.locator(applocators.linkCreateAccount)).toBeEnabled();
    await this.locator(applocators.linkCreateAccount).click();
  }
 
  async registerNewUser(name: string, Email: string, Password: string) {
    await this.locator(applocators.fullNameInput).fill(name);
    await this.locator(applocators.emailInput).fill(Email);
    await this.locator(applocators.passwordInput).fill(Password);
    await this.locator(applocators.signupButton).click();
  }

  async adminLogin(): Promise<void> {
    await this.navigateTo(ENV.adminURL);
    await this.fill(applocators.adminEmailInput, testData.admin.email);
    await this.fill(applocators.adminPasswordInput, testData.admin.password);
    await this.click(applocators.adminSigninButton);
    await this.verifyVisible(applocators.customersLink);
    await this.verifyUrl(`${ENV.baseURL}/admin`);
  }
 
}