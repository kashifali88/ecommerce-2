import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filter from "../../components/shopping-view/Filter";
import ProductCard from "../../components/shopping-view/ProductCard";
import { FaSort } from "react-icons/fa";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { sortOptions } from "../../config";
import { fetchAllProducts } from "../../redux/slice/productSlice";
import {  useSearchParams } from "react-router-dom";
import { fetchFilterProducts } from "../../redux/slice/productSlice";

function Listing() {
  const dispatch = useDispatch();
  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState({})
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { productList, loading } = useSelector(
    (state) => state.products
  );
  


  const handleSort = (value) => {
    setSort(value)

  }
const createSearchParamsHelper = (filterParams) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    }
  }

  return params.toString();
};

  const handleFilter = (getSectionId, getCurrentOption) => {
  let copyFilters = filters ? {...filters} : {};
  if (!copyFilters[getSectionId]) {
    copyFilters[getSectionId] = [];
  }

  const indexOfCurrentOption =
    copyFilters[getSectionId].indexOf(getCurrentOption);

  if (indexOfCurrentOption === -1) {
    copyFilters[getSectionId].push(getCurrentOption);
  } else {
    copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
  }

  setFilters(copyFilters);
  sessionStorage.setItem('filters', JSON.stringify(copyFilters))

  }
  



  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

useEffect(() => {
  const queryString = createSearchParamsHelper(filters);
dispatch(
  fetchFilterProducts({
    filters,
    sort,
  })
);
}, [filters, sort]);

useEffect(() => {
  if (filters && Object.keys(filters).length > 0) {
    const queryString = createSearchParamsHelper(filters);
    setSearchParams(queryString); // NOT new URLSearchParams again
  }
}, [filters]);

  useEffect(() => {
    setSort("priceLowToHigh");
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {} )
  }, [])

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      
      {/* DESKTOP FILTER */}
      <div className="hidden md:block">
        <Filter filters = {filters} handleFilter ={ handleFilter} />
      </div>

      {/* MOBILE FILTER DRAWER */}
      {mobileFilterOpen && (
        <>
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
          />

          <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 overflow-y-auto md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-lg">Filters</h2>

              <button onClick={() => setMobileFilterOpen(false)}>
                <IoClose size={24} />
              </button>
            </div>

            <Filter handleFilter={handleFilter} filters={filters} />
          </div>
        </>
      )}

      {/* PRODUCTS SECTION */}
      <div className="bg-white rounded-lg shadow-sm">

        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-200">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md"
            >
              <HiOutlineAdjustmentsHorizontal size={20} />
              Filters
            </button>

            <h3 className="text-lg font-semibold">
              ALL PRODUCTS
            </h3>
          </div>

          <div className="flex items-center gap-4 relative">

            <span className="text-sm text-gray-500">
              {productList?.length} products
            </span>

            <button
              onClick={() => { setSortMenuOpen(!sortMenuOpen); handleSort(sort === "priceLowToHigh" ? "priceHighToLow" : "priceLowToHigh")}}
              className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-100 transition"
            >
              <span className="text-sm">Sort By</span>
              <FaSort size={14} />
            </button>

            {sortMenuOpen && (
              <>
                <div
                  onClick={() => setSortMenuOpen(false)}
                  className="fixed inset-0 z-40"
                />

                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSortMenuOpen(false);
                        handleSort(option.id);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="p-4">

         {loading ? (
  <p>Loading...</p>
) : productList?.length === 0 ? (
  <p>No products found.</p>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-2  lg:grid-cols-4 gap-4">
    {productList?.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default Listing;