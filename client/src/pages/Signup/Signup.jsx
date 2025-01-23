import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import Navbar from "../../components/Navbar/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const Signup = () => {
  // State to manage user input and error messages
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Input validation
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous error

    try {
      // API call to register the user
      const response = await axiosInstance.post("/api/users/register", 
        {name,email,password},
        { withCredentials: true });

      // If API returns an error, display it
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      // On successful signup, navigate to login page
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      // Handle unexpected errors from the API or network
      setError(
        err.response?.data?.message || "User Already registered or An unexpected error occurred."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignup}>
            {/* Signup form title */}
            <h4 className="text-2xl mb-7">Sign Up</h4>

            {/* Name input field */}
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email input field */}
            <input
              type="email"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password input field */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Display error message, if any */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Submit button */}
            <button type="submit" className="btn-primary">
              Create Account
            </button>

            {/* Link to login page */}
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
