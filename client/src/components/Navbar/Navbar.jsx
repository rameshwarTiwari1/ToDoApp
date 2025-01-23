import React, { useState } from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";
import axiosInstance from "../../utils/axiosInstance";


const Navbar = ({ userInfo, onSearchTask, handleClearSearch }) => {
  const [searchquery, setsearchquery] = useState("");
  const navigate = useNavigate();

  // Call the logout route
  const onLogout = async () => {
    try {
      await axiosInstance.get("api/users/logout", { withCredentials: true }); 
      // Redirect to the login page after successful logout
      navigate("/login"); 
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  // search box and handle search query
  const handlesearch = () => {
    if (searchquery) {
      onSearchTask(searchquery);
    }
  };
  const onClearSearch = () => {
    setsearchquery("");
    handleClearSearch();
  };
  return (
    <div className="bg-white flex items-center justify-between px-4 sm:px-6 py-2 drop-shadow">
      <h2 className="text-lg sm:text-xl font-medium text-black py-2">
        ToDoApp
      </h2>
      {userInfo && (
        <SearchBar
          value={searchquery}
          onChange={({ target }) => {
            setsearchquery(target.value);
          }}
          handleSearch={handlesearch}
          onClearSearch={onClearSearch}
        />
      )}
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
