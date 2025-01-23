import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(null); // State for error messages

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password.");
      return;
    }
    setError(""); // Clear previous errors
    
    try {
      // API call to log the user in
      const response = await axiosInstance.post("/api/users/login", 
        { email, password },
        { withCredentials: true },
      );
      // If login is successful, redirect to the dashboard
      if (response.status === 200) {
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      // Handle errors from API response
      if (error.response?.data?.message) {
        setError(error.response.data.message); // Display API error message
      } else {
        setError("Worng credentials or An unexpected error occurred."); //normal error message when something
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            {/* Form title */}
            <h4 className="text-2xl mb-7">Login</h4>

            {/* Email input */}
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Display error message */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Submit button */}
            <button type="submit" className="btn-primary">
              Login
            </button>

            {/* Link to signup page */}
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
