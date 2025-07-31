import { FaCalendarAlt } from 'react-icons/fa'; // Calendar icon
import Search from './Search';

function Filter({filters, onFilterChange}) {
    return (
          <div className="flex flex-wrap gap-4 mb-4 items-center">

            {filters.map((filter) => {
              if (filter.type === 'text') {
                return (
                  <Search filter={filter} onFilterChange={onFilterChange}  key={filter} />
                );
              } 
              if (filter.type === 'select') {
                return (
                  <select
                  key={filter.key}
                  className="border rounded px-3 py-2 w-full sm:w-auto"
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  >
                    <option hidden disabled>{filter.placeholder}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );
              }
              if (filter.type === 'date') {
                return (
                  <div key={filter.key} className="relative w-full sm:w-auto">
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="date"
                      className="pl-10 pr-3 py-2 border rounded w-full sm:w-auto"
                      onChange={(e) => onFilterChange(filter.key, e.target.value)}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
   
      
    )
}

export default Filter
