/**
 * Centralized application routes
 * All navigation routes should be referenced from this file
 */

export const ROUTES = {
  // Home
  HOME: "/",

  // Auth routes (located at /auth)
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },

  // Budgeting app (located at /apps/budgeting)
  BUDGETING: {
    HOME: "/apps/budgeting",
    ADD_EXPENSE: "/apps/budgeting/add-expense",
    ADD_INCOME: "/apps/budgeting/add-income",
  },

  // Hookah Picker app (located at /apps/hookah-picker)
  HOOKAH_PICKER: {
    HOME: "/apps/hookah-picker",
    PICKER: "/apps/hookah-picker/picker",
  },

  // Market app (located at /apps/market)
  MARKET: {
    HOME: "/apps/market",
    FOR_GUESTS: "/apps/market/for-guests",
    CREATE_PRODUCT: "/apps/market/create-product",
  },

  // API endpoints
  API: {
    AUTH: {
      LOGIN: "/api/auth/login",
      LOGOUT: "/api/auth/logout",
      REGISTER: "/api/auth/register",
      VALIDATE: "/api/auth/validate",
    },
    BUDGETING: {
      CATEGORIES: "/api/budgeting/categories",
      CATEGORIES_MOST_USED: "/api/budgeting/categories/most-used",
      EXPENSES: "/api/budgeting/expenses",
      INCOME: "/api/budgeting/income",
    },
  },
} as const;
