import axiosClient from "./axiosClient";

export const getAllHocKy = async () => {
  const res = await axiosClient.get("/api/hoc-ky");
  return res.data;
};
