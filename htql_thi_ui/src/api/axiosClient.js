import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});

// REQUEST
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log(">>> CALL API:", config.url);
  console.log(">>> METHOD:", config.method);
  console.log(">>> TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // ❗ chỉ logout khi 401
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }

      // ❗ 403 chỉ log
      if (status === 403) {
        console.error("KHÔNG CÓ QUYỀN (403)");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
