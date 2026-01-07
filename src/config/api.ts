const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export const API = {
  BASE: API_BASE_URL,
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    SIGNUP: `${API_BASE_URL}/auth/signup`,
  },
  KITS: `${API_BASE_URL}/kits`,
  PRODUCTS: `${API_BASE_URL}/products`,
  ORDERS: `${API_BASE_URL}/orders`,
};


export const getImageUrl = (path?: string): string => {
  if (!path || typeof path !== "string") return "/no-image.png"; 

  path = path.trim();

  if (path.startsWith("http")) return path;

  return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(path)}`;
};
