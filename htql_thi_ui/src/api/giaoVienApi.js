import axiosClient from "./axiosClient";

export const getAllGiaoVien = async () => {
  const res = await axiosClient.get("/api/giao-vien");
  return res.data;
};
