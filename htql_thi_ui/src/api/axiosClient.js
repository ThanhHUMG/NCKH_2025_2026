import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://htql-thi-api.onrender.com",
  headers: { "Content-Type": "application/json" },
});

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

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/login";
      }

      if (status === 403) {
        console.error("KHÔNG CÓ QUYỀN (403)");
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
