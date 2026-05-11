import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
      <span className="text-muted small">
        Hiển thị <b>{(currentPage - 1) * itemsPerPage + 1}</b> đến{" "}
        <b>{Math.min(currentPage * itemsPerPage, totalItems)}</b> trong tổng số{" "}
        <b>{totalItems}</b> bản ghi
      </span>
      <div className="btn-group shadow-sm rounded-3">
        <button
          className="btn btn-light border btn-sm"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="btn btn-light border btn-sm fw-bold px-3 disabled text-dark">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-light border btn-sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
