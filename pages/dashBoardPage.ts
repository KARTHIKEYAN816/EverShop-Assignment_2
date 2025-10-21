import{Page, expect} from '@playwright/test';
import { BasePage } from './basePage';
import { applocators } from '../tests/locators/subscription.locator';

export class DashBoardPage extends BasePage{
    constructor(page:Page){
        super(page)
    }
//Navigating to created Products page
async navigatingToProductList():Promise<void>{
await this.click(applocators.Dashboard.Catalog.Products)
}

}