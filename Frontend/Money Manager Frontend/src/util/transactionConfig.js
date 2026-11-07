import {API_ENDPOINTS} from "./apiEndpoints.jsx"

export const TRANSACTION_CONFIG = {
    income: {
        label: "Income",
        listTitle: "This Month's Income",
        overviewTitle: "Income Overview",
        overviewSubtitle: "Track your earnings over time and analyze your income trends.",
        sourceLabel: "Income Source",
        namePlaceholder: "e.g., Salary, Freelance, Bonus",
        downloadName: "income_details.xlsx",
        endpoints: {
            list: API_ENDPOINTS.GET_ALL_INCOMES,
            add: API_ENDPOINTS.ADD_INCOMES,
            update: API_ENDPOINTS.UPDATE_INCOME,
            remove: API_ENDPOINTS.DELETE_INCOME,
            download: API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD,
            email: API_ENDPOINTS.EMAIL_INCOME,
        },
    },
    expense: {
        label: "Expense",
        listTitle: "This Month's Expenses",
        overviewTitle: "Expense Overview",
        overviewSubtitle: "Track your spending over time and analyze your expense trends.",
        sourceLabel: "Expense Source",
        namePlaceholder: "e.g., Groceries, Medicines, Bills",
        downloadName: "expense_details.xlsx",
        endpoints: {
            list: API_ENDPOINTS.GET_ALL_EXPENSES,
            add: API_ENDPOINTS.ADD_EXPENSES,
            update: API_ENDPOINTS.UPDATE_EXPENSE,
            remove: API_ENDPOINTS.DELETE_EXPENSE,
            download: API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
            email: API_ENDPOINTS.EMAIL_EXPENSE,
        },
    },
}