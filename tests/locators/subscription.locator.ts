import { Locator, Page } from "@playwright/test";
import { link } from "fs";
 
export type RoleLocator= {
  role : Parameters<Page["getByRole"]>[0];
  name?: string;
  exact?: boolean;
  text?: string | RegExp;
  option?:string;
};


export type RoleTextLocator = {
  role?: Parameters<Page["getByRole"]>[0];
  name?: string;
  text?: string;
  exact?: boolean;
};
 
export const applocators = {
  // Navigation
  navSignup: ".self-center",
 
  // Signup
  linkCreateAccount: { role: "link" , name: "Create an account" } as RoleLocator,
  fullNameInput: { role: "textbox" as const, name: "Full Name" }as RoleLocator,
  emailInput: { role: "textbox" as const, name: "Email" }as RoleLocator,
  passwordInput: { role: "textbox" as const, name: "Password" }as RoleLocator,
  signupButton: { role: "button" as const, name: "SIGN UP" }as RoleLocator,
 
  // Admin login
  adminEmailInput: { role: "textbox" as const, name: "Email" }as RoleLocator,
  adminPasswordInput: { role: "textbox" as const, name: "Password" }as RoleLocator,
  adminSigninButton: { role: "button" as const, name: "SIGN IN" }as RoleLocator,
  nextButton:".next",
  coupon1 : {role:"link", name: "Coupons"} as RoleLocator,
  // Customers page
  customersLink: { role: "link" as const, name: "Customers" }as RoleLocator,
  customerStatus: "text=StatusEnabled",
  startDate: {role:"textbox", name: "Start date" }as RoleLocator,
  endDate: {role:"textbox", name: "End date" }as RoleLocator,
   newCouponLink: (page:Page) =>
   page.locator('div').filter({ hasText: /^New Coupon$/ }).getByRole('link'),
 
// Dynamic data for random email
dynamicCustomerEmailCell: (email: string): RoleLocator => ({
  role: "cell",    
  name: email,
  exact: true,
}),
//New Product Creation Page
Newproduct: {
  newProductLink: { role: "link", name: "New Product" } as RoleLocator,
  productsLink: { role: "link", name: "Products", exact: true } as RoleLocator,
  successMessage: { role: "alert", name: "Product saved successfully!" } as RoleLocator,
  editProductTitle: "h1.page-heading-title",
    nameInput: { role: "textbox" as const, name: "Name" } as RoleLocator,
    skuInput: { role: "textbox" as const, name: "SKU" } as RoleLocator,
    priceInput: { role: "textbox" as const, name: "Price" } as RoleLocator,
    weightInput: { role: "textbox" as const, name: "Weight" } as RoleLocator,
    categoryLink: { role: "link" as const, name: "Select category" } as RoleLocator,
    searchCategory: { role: "textbox" as const, name: "Search categories" } as RoleLocator,
    CategoryMen:(page:Page)=>page.locator('div').filter({ hasText: /^MenSelect$/ }).getByRole('button'),
    urlKeyInput: "#urlKey",
    metaTitleInput: "#metaTitle",
    metaKeywordsInput: "#metaKeywords",
    metaDescriptionInput: { role: "textbox" as const, name: "Meta description" } as RoleLocator,
    disabledToggle: 'label[for="status0"]',
    enabledToggle: 'label[for="status1"]',
    NotVisibleToggle: 'label[for="visibility0"]',
    visibleToggle: 'label[for="visibility1"]',
    NoStockAvailabilityToggle:'label[for="stock_availability0"]',
    StockAvailabilityToggle:'label[for="stock_availability1"]',
    quantityInput: { role: "textbox" as const, name: "Quantity" } as RoleLocator,
    saveButton: { role: "button" as const, name: "Save" } as RoleLocator,
    selectColor:(page:Page)=> page.locator('select[name="attributes[0][value]"]'),
    selectSize:(page:Page)=>page.locator('select[name="attributes[1][value]"]'),
    Image:".h-5.w-5",
    title:".page-heading-title",
    ImageRemove:".remove"
 
  },
//Product List page
Products:{
  DeleteButton: "a:nth-child(4) span:nth-child(1)",
  EnableButton: { role: "link" as const, name: "Enable" } as RoleLocator,
  DisableButton: { role: "link" as const, name: "Disable" } as RoleLocator,
  DeletePopup:{
    Close:".modal-close-button",
    Cancel:{ role: "button" as const, name: "Cancel" } as RoleLocator,
    Delete:{ role: "button" as const, name: "Delete" } as RoleLocator
  
  }
},

 //Coupon Creation Page
Coupon:{
  newCouponLink:{role:"link", name:"New Coupon"} as RoleLocator,
  title:".page-heading-title",
  couponCode:{role:"textbox" as const, name :"coupon" } as RoleLocator,
  Description:{role:"textbox" as const, name :"description" } as RoleLocator,
  OnStatusToggle:".toggle.enabled",
  OffStatusToggle:".toggle.disabled",
  DiscountAmmount:{role:"textbox" as const, name :"Discount amount" } as RoleLocator,
  StartDate:{role:"textbox" as const, name :"Start date" } as RoleLocator,
  EndDate:{role:"textbox" as const, name :"End date" } as RoleLocator,
  FreeShipping:".pl-2",
  FixedDiscountToEntireOrder:'label[for="discount_type0"]',
  MinimumPurchaseAmount:{role:"textbox" as const, name :"Minimum purchase amount" } as RoleLocator,
  MinimumPurchaseQty:{role:"textbox" as const, name :"Minimum purchase qty" } as RoleLocator,
  AddProductLink:{role:"link", name:"Add product"} as RoleLocator,
  CategoryPopup:{role:"link", name:'Choose categories'} as RoleLocator,
  CategoryType: {
    Men: (page: Page) => page.locator('div').filter({ hasText: /^MenSelect$/ }).getByRole('button'),
    Women: (page: Page) => page.locator('div').filter({ hasText: /^WomenSelect$/ }).getByRole('button'),
    Kids: (page: Page) => page.locator('div').filter({ hasText: /^KidsSelect$/ }).getByRole('button'),
  },
  MinimumQuantity:'input[placeholder="Enter the quantity"]',
  selectDefaultDropDown:'.css-19bb58m',
  selectDropDownOption:{role:'option'as const, name: 'Default' } as RoleLocator,
  CustomerEmail:{role:'textbox'as const, name: 'Enter customer emails'} as RoleLocator,
  CustomerPurchase:{role:'textbox'as const, name: 'Enter purchased amount' } as RoleLocator,
  CouponSave:{role: 'button'as const, name: 'Save' } as RoleLocator
},
//DashBoard Page
Dashboard:{
  QuickLinks:{
    DashBoard:{role:"link", name:"Dashboard"} as RoleLocator,
    NewProduct:{role:"link", name:"New Product"} as RoleLocator,
    NewCoupon:{role:"link", name:"New Coupon"} as RoleLocator,
  },
  Catalog:{
  Products:{role:"link", name:"Products",exact: true} as RoleLocator,
  Categories:{role:"link", name:"Categories"} as RoleLocator,
  Collections:{role:"link", name:"Collections"} as RoleLocator,
  Attributes:{role:"link", name:"Attributes"} as RoleLocator,
  },
  Sale:{
  Orders:{role:"link", name:"Orders"} as RoleLocator,
  }
}

};
 
export function getLocator(page: Page,locator:RoleLocator| string): Locator {
  if(typeof locator==="string")
  {
    return page.locator(locator);
  }
  const {role,name,exact}=locator;
  return page.getByRole(role,{name,exact});
}

