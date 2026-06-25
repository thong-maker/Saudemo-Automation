/**
 * Saucedemo page paths
 */
export const PATHS = {
  LOGIN: '/',
  INVENTORY: '/inventory.html',
  CART: '/cart.html',
  CHECKOUT_STEP_ONE: '/checkout-step-one.html',
  CHECKOUT_STEP_TWO: '/checkout-step-two.html',
  CHECKOUT_COMPLETE: '/checkout-complete.html',
  PRODUCT_DETAIL: (id: number) => `/inventory-item.html?id=${id}`,
};

export const STORAGE_STATE = '.auth/user.json';
