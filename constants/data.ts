import { CategoryType, ExpenseCategoriesType } from "@/types";
import * as Icon from "phosphor-react-native";

// import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Groceries",
    value: "groceries",
    icon: Icon.ShoppingCart,
    bgColor: "#4B5563", // Deep Teal Green
  },
  rent: {
    label: "Rent",
    value: "rent",
    icon: Icon.House,
    bgColor: "#075985", // Dark Blue
  },
  utilities: {
    label: "Utilities",
    value: "utilities",
    icon: Icon.Lightbulb,
    bgColor: "#ca8a04", // Dark Golden Brown
  },
  transportation: {
    label: "Transportation",
    value: "transportation",
    icon: Icon.Car,
    bgColor: "#b45309", // Dark Orange-Red
  },
  entertainment: {
    label: "Entertainment",
    value: "entertainment",
    icon: Icon.FilmStrip,
    bgColor: "#0f766e", // Darker Red-Brown
  },
  dining: {
    label: "Dining",
    value: "dining",
    icon: Icon.ForkKnife,
    bgColor: "#be185d", // Dark Red
  },
  health: {
    label: "Health",
    value: "health",
    icon: Icon.Heart,
    bgColor: "#e11d48", // Dark Purple
  },
  insurance: {
    label: "Insurance",
    value: "insurance",
    icon: Icon.ShieldCheck,
    bgColor: "#404040", // Dark Gray
  },
  savings: {
    label: "Savings",
    value: "savings",
    icon: Icon.PiggyBank,
    bgColor: "#065F46", // Deep Teal Green
  },
  clothing: {
    label: "Clothing",
    value: "clothing",
    icon: Icon.TShirt,
    bgColor: "#7c3aed", // Dark Indigo
  },
  personal: {
    label: "Personal",
    value: "personal",
    icon: Icon.User,
    bgColor: "#a21caf", // Deep Pink
  },
  others: {
    label: "Others",
    value: "others",
    icon: Icon.DotsThreeOutline,
    bgColor: "#525252", // Neutral Dark Gray
  },
};

export const incomeCategory: CategoryType = {
  label: "Income",
  value: "income",
  icon: Icon.CurrencyDollarSimple,
  bgColor: "#16a34a", // Dark
};

export const transactionTypes = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];
