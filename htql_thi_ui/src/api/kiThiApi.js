import axiosClient from "./axiosClient";

export const getAllKiThi = async () => {
  const res = await axiosClient.get("/api/ki-thi");
  return res.data;
};

export const createKiThi = async (tenKiThi, maHocKi) => {
  const res = await axiosClient.post("/api/ki-thi", {
    tenKiThi,
    maHocKi,
  });
  return res.data;
};

export const deleteKiThi = async (id) => {
  const res = await axiosClient.delete(`/api/ki-thi/${id}`);
  return res.data;
};
