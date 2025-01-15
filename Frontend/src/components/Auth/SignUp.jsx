import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios.helper.js";
import Logo from "../Logo";
import Input from "../Input";
import Button from "../Button";
import { icons } from "../../assets/Icons.jsx";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signup = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "avatar" || key === "coverImage") {
        if (data[key]?.[0]) {
          formData.append(key, data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/register", formData);
      if (response?.data?.data) {
        toast.success("Account created successfully 🥳");
        navigate("/login");
      }
    } catch (error) {
      setError(
        error?.status === 409
          ? "User with email or username already exists"
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-gray-900 text-white">
      <div className="mx-auto my-10 flex w-full max-w-lg flex-col px-6">
        <div className="mx-auto mb-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="text-center text-2xl font-semibold">
          Create an Account
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-400"
          >
            Sign in now
          </Link>
        </p>
        {error && (
          <p className="text-red-600 text-center mt-4" aria-live="assertive">
            {error}
          </p>
        )}
        <form
          onSubmit={handleSubmit(signup)}
          className="mt-6 flex flex-col space-y-4"
        >
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            className="rounded-lg"
            required
            {...register("fullName", {
              required: "Full name is required",
              maxLength: {
                value: 25,
                message: "Full name cannot exceed 25 characters",
              },
            })}
          />
          {errors.fullName && (
            <p className="text-red-600 text-sm px-2">
              {errors.fullName.message}
            </p>
          )}

          <Input
            label="Username"
            placeholder="Choose your username"
            className="rounded-lg"
            required
            {...register("username", {
              required: "Username is required",
              maxLength: {
                value: 25,
                message: "Username cannot exceed 25 characters",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-600 text-sm px-2">
              {errors.username.message}
            </p>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            className="rounded-lg"
            required
            {...register("email", {
              required: "Email address is required",
              validate: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Invalid email format",
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm px-2">{errors.email.message}</p>
          )}

          <Input
            label="Password"
            type="password"
            placeholder="Create your password"
            className="rounded-lg"
            required
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm px-2">
              {errors.password.message}
            </p>
          )}

          <Input
            label="Avatar"
            type="file"
            className="rounded-lg"
            required
            {...register("avatar", {
              required: "Avatar is required",
              validate: (files) => {
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                return (
                  (file && allowedTypes.includes(file.type)) ||
                  "Invalid file type. Only JPG, PNG, and JPEG are allowed"
                );
              },
            })}
          />
          {errors.avatar && (
            <p className="text-red-600 text-sm px-2">{errors.avatar.message}</p>
          )}

          <Input
            label="Cover Image"
            type="file"
            className="rounded-lg"
            {...register("coverImage", {
              validate: (files) => {
                if (!files[0]) return true;
                const file = files[0];
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                return (
                  allowedTypes.includes(file.type) ||
                  "Invalid file type. Only JPG, PNG, and JPEG are allowed"
                );
              },
            })}
          />
          {errors.coverImage && (
            <p className="text-red-600 text-sm px-2">
              {errors.coverImage.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold ${
              loading
                ? "bg-pink-800 cursor-not-allowed"
                : "bg-pink-600 hover:bg-pink-700"
            }`}
          >
            {loading ? <span>{icons.loading}</span> : "Sign Up"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
