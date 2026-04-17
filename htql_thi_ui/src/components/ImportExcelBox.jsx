import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function ImportExcelBox({ endpoint, onSuccess }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const upload = async () => {
    if (!file) {
      setMessage("❌ Vui lòng chọn file Excel!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosClient.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Import thành công!");
      setFile(null);
      onSuccess();
    } catch (e) {
      setMessage("❌ Import thất bại!");
    }
  };

  return (
    <div className="card p-3 mt-3">
      <h5>Import Excel</h5>

      {message && <div className="alert alert-info">{message}</div>}

      <input
        type="file"
        className="form-control mb-2"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button className="btn btn-success" onClick={upload}>
        Upload Excel
      </button>
    </div>
  );
}
