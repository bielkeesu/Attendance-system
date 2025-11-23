import { forwardRef, memo } from "react";

const Table = memo(
  forwardRef(({ columns, data }, ref) => {
    return (
      <table ref={ref} className="table-auto w-full text-left text-sm m-4">
        <thead className="border-b p-4">
          <tr className="bg-slate-100 text-gray-600">
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? "bg-white" : "bg-slate-100"}
            >
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  })
);

export default Table;
