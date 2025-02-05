import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { setUser } from "../../store/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { icons } from "../../assets/Icons.jsx";
import axiosInstance from "../../utils/axios.helper.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = async (data) => {
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", data);
      if (response?.data?.data) {
        dispatch(setUser(response.data.data.user));
        localStorage.setItem("accessToken", response.data.data.accessToken);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      if (error.status === 401) {
        setError("Invalid password");
      } else if (error.status === 500) {
        setError("Server is not working");
      } else if (error.status === 404) {
        setError("User does not exist");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col">
        <div className="flex justify-center mb-6">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="text-center text-xl font-semibold mb-6">
          Log in to your account
        </div>
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit(login)}
          className="bg-[#1e1e1e] p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              className="px-3 py-2 w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            {errors.email?.type === "required" && (
              <p className="text-red-600 text-sm mt-1">Email is required</p>
            )}
          </div>
          <div className="mb-4">
            <Input
              label="Password"
              className="px-3 py-2 w-full rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              type="password"
              placeholder="Enter your password"
              required
              {...register("password", {
                required: true,
              })}
            />
            {errors.password?.type === "required" && (
              <p className="text-red-600 text-sm mt-1">Password is required</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              loading ? "bg-pink-800" : "bg-pink-600 hover:bg-pink-700"
            } disabled:cursor-not-allowed`}
          >
            {loading ? <span>{icons.loading}</span> : "Sign in"}
          </Button>
        </form>
        <div className="text-center mt-4">
          Don't have an Account yet?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:text-blue-500"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
