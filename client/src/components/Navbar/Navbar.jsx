import React, { useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import axiosInstance from "../../utils/axiosInstance";

const Navbar = ({ userInfo, onSearchTask, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Logout function
  const onLogout = async () => {
    try {
      await axiosInstance.get("api/users/logout", { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Handle search query
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      onSearchTask(query);
    } else {
      handleClearSearch();
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 sm:px-6 py-2 drop-shadow">
      <h2 className="text-lg sm:text-xl font-medium text-black py-2">
        ToDoApp
      </h2>
      {userInfo && (
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          onClearSearch={handleClearSearch}
        />
      )}
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
