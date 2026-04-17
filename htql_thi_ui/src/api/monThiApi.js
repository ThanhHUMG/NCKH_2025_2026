import axiosClient from "./axiosClient";

export const getMonThiByKiThi = async (maKiThi) => {
  const res = await axiosClient.get(`/api/mon-thi/ki-thi/${maKiThi}`);
  return res.data;
};

export const updateMonThi = async (
  id,
  hinhThucThi,
  phongThi,
  thoiGianThi,
  dsMaGiamThi,
) => {
  const res = await axiosClient.put(`/api/mon-thi/${id}`, {
    hinhThucThi,
    phongThi,
    thoiGianThi,
    dsMaGiamThi,
  });
  return res.data;
};

export const deleteMonThi = async (id) => {
  const res = await axiosClient.delete(`/api/mon-thi/${id}`);
  return res.data;
};
