import React, { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

// Debounce function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const SearchBar = ({ value, onChange, onClearSearch }) => {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    const debouncedSearch = debounce(onChange, 300);
    debouncedSearch(searchValue);
  }, [searchValue, onChange]);

  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Tasks"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && <IoMdClose onClick={onClearSearch} />}
      <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" />
    </div>
  );
};

export default SearchBar;
