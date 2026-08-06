import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const ASSET_URL = API_URL;

export function resolveAsset(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^\.?\//, "/");
  return `${API_URL}${clean}`;
}

export default api;
