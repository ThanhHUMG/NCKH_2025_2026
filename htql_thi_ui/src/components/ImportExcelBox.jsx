import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { FileSpreadsheet, UploadCloud } from "lucide-react";

export default function ImportExcelBox({
  endpoint,
  onSuccess,
  title = "Import từ Excel",
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if (!file) return alert("⚠️ Vui lòng chọn file Excel!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axiosClient.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Import thành công!");
      setFile(null);
      document.getElementById("excelInputFile").value = "";
      onSuccess();
    } catch (e) {
      alert("❌ Import thất bại: " + (e.response?.data || "Sai định dạng"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-light rounded-4 border border-info border-opacity-25">
      <div className="d-flex align-items-center gap-2 mb-3 text-info fw-bold">
        <FileSpreadsheet size={20} /> <span>{title}</span>
      </div>
      <input
        id="excelInputFile"
        type="file"
        className="form-control rounded-3 mb-2 small"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="btn btn-info text-white w-100 rounded-3 shadow-sm d-flex justify-content-center align-items-center gap-2"
        onClick={upload}
        disabled={loading}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          <UploadCloud size={18} />
        )}{" "}
        Tải lên hệ thống
      </button>
    </div>
  );
}
