/**
 * Saucedemo test users & products
 */

export const USERS = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.STANDARD_PASSWORD || 'secret_sauce',
  },
  lockedOut: {
    username: process.env.LOCKED_OUT_USER || 'locked_out_user',
    password: process.env.LOCKED_OUT_PASSWORD || 'secret_sauce',
  },
  problem: {
    username: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.PROBLEM_PASSWORD || 'secret_sauce',
  },
  performanceGlitch: {
    username: process.env.PERF_GLITCH_USER || 'performance_glitch_user',
    password: process.env.PERF_GLITCH_PASSWORD || 'secret_sauce',
  },
  error: {
    username: process.env.ERROR_USER || 'error_user',
    password: process.env.ERROR_PASSWORD || 'secret_sauce',
  },
  visual: {
    username: process.env.VISUAL_USER || 'visual_user',
    password: process.env.VISUAL_PASSWORD || 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

export const PRODUCTS = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  tShirtRed: 'Test.allTheThings() T-Shirt (Red)',
};

export const CHECKOUT_INFO = {
  valid: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '10001',
  },
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '10001',
  },
  missingLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '10001',
  },
  missingPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
};

export const ERROR_MESSAGES = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  credentialsDoNotMatch: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};
