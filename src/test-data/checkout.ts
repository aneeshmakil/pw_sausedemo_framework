export const checkoutDetails = {
  firstName: process.env.CHECKOUT_FIRST_NAME ?? 'John',
  lastName: process.env.CHECKOUT_LAST_NAME ?? 'Doe',
  postalCode: process.env.CHECKOUT_POSTAL_CODE ?? '12345',
} as const;

export interface ProductTestData {
  readonly name: string;
  readonly price: string;
}

export const products = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: '$29.99',
  },
  bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99' },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: '$15.99' },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: '$49.99' },
  onesie: { name: 'Sauce Labs Onesie', price: '$7.99' },
  redTShirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: '$15.99' },
} as const satisfies Record<string, ProductTestData>;
