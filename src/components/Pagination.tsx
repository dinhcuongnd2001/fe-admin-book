import { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const Pagination = ({
  page,
  size,
  total,
  onChange,
}: {
  page: number;
  size: number;
  total: number;
  onChange: (page: number) => void;
}) => {
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  const onChangePage = (newPage: number) => {
    if (newPage <= 0 || (newPage - 1) * size >= total) return;

    setCurrentPage(newPage);
    onChange(newPage);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <p className="text-xs">
          Page {total ? currentPage : 0} / {Math.ceil(total / size)} (
          {total === 0 ? 0 : (currentPage - 1) * size + 1} -{" "}
          {Math.min(currentPage * size, total)})
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <button
          className="flex items-center rounded-md bg-gray-400 px-2 py-1"
          onClick={() => onChangePage(currentPage - 1)}
        >
          <HiChevronLeft className="h-5 w-5 text-primary-bg-layout" />
        </button>
        <button
          className="flex items-center rounded-md bg-gray-400 px-2 py-1"
          onClick={() => onChangePage(currentPage + 1)}
        >
          <HiChevronRight className="h-5 w-5 text-primary-bg-layout" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
