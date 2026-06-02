// Filter.jsx

import React from "react";
import { filterOptions } from "../../config";

function Filter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-lg shadow-sm w-full md:max-w-xs">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold">Filters</h1>
      </div>

      <div className="p-4 space-y-6">
        {Object.keys(filterOptions).map((key) => (
          <div key={key}>
            <h3 className="font-medium mb-3 capitalize">{key}</h3>

            <div className="space-y-2">
              {filterOptions[key].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input type="checkbox" checked={filters && Object.keys(filters).length > 0 && filters[key]
                    && filters[key].indexOf(item.id) > -1 
                  } onChange = {() => handleFilter(key, item.id)} className="w-4 h-4" />

                  <span className="text-sm text-gray-700">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Filter;