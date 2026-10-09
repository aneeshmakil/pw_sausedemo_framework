export const inventoryLocators = {
  pageTitle: '[data-test="title"]',
  items: '[data-test="inventory-item"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  addToCart: 'button[data-test^="add-to-cart-"]',
  cartLink: '[data-test="shopping-cart-link"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
} as const;
