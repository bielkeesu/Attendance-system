import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function Pagination({currentPage, handlePageChange, totalPages}) {
    return (
        <div className="mt-2 flex justify-center gap-2 items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          <FaAngleLeft />
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
         <FaAngleRight />
        </button>
      </div>
    )
}

export default Pagination
