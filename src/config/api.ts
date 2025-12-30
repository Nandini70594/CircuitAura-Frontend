const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const API = {
  BASE: API_BASE_URL,
  KITS: `${API_BASE_URL}/api/kits`,
  PRODUCTS: `${API_BASE_URL}/api/products`,
  ORDERS: `${API_BASE_URL}/api/orders`,
};

export const getImageUrl = (url?: string): string => {
  if (!url || typeof url !== "string") {
    return "https://via.placeholder.com/400x300?text=No+Image";
  }
  return url.trim();
};
