export const BASE_URL = "https://money-manager-backend-5r2j.onrender.com"

const CLOUDINARY_CLOUD_NAME = "ecip7fs9"
export const CLOUDINARY_UPLOAD_PRESET = "MoneyManager"

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/profile",
  UPDATE_PROFILE_IMAGE: "/profile/image",
  GET_ALL_CATEGORIES : "/categories",
  ADD_CATEGORY: "/categories",
  UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  DELETE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
  GET_ALL_INCOMES : "/incomes",
  CATEGORY_BY_TYPE : (type) => `/categories/${type}`,
  ADD_INCOMES : "/incomes",
  DELETE_INCOME : (incomeId) => `/incomes/${incomeId}`,
  UPDATE_INCOME : (incomeId) => `/incomes/${incomeId}`,
  INCOME_EXCEL_DOWNLOAD : "/excel/download/income",
  EMAIL_INCOME: "/email/income-excel",
  GET_ALL_EXPENSES : "/expenses",
  ADD_EXPENSES : "/expenses",
  DELETE_EXPENSE : (expenseId) => `/expenses/${expenseId}`,
  UPDATE_EXPENSE : (expenseId) => `/expenses/${expenseId}`,
  EXPENSE_EXCEL_DOWNLOAD : "/excel/download/expense",
  EMAIL_EXPENSE: "/email/expense-excel",
  APPLY_FILTERS : "/filter",
  DASHBOARD_DATA: "/dashboard",
  UPLOAD_IMAGE : `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}
