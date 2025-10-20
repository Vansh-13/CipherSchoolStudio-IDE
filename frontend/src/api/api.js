import axios from "axios";


const BASE_URL = "https://cipherstudio-ide.onrender.com/api";

export const api = axios.create({ baseURL: BASE_URL });

// Optional: handle Authorization token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
