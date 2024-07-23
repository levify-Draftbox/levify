import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:3030",
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const Login = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await api.post<LoginResponse>("/auth/login", formData);

      if (response.data.success && response.data.token) {
         localStorage.setItem("token", response.data.token);
        alert("login successfull...");
        navigate("/"); // Redirect to inbox after successful login
      } else {
        setErrors({
          ...errors,
          general: response.data.message || "Login failed",
        });
      }
    } catch (error) {
      console.error(
        "Error during login:",
        (error as AxiosError<LoginResponse>).response?.data ||
          (error as Error).message
      );
      setErrors({
        ...errors,
        general: "invalid username or password.",
      });
    }
  };

  return (
    <div className="flex w-full flex-col h-screen">
      <div className="w-[230px] mx-10 my-2">
        <Link to="/inbox" className="cursor-pointer my-1 mx-2">
          <img
            className="w-full"
            alt="DraftBox Mail"
            src={
              theme === "system"
                ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "/logo-light.svg"
                  : "/logo-dark.svg"
                : theme === "light"
                ? "/logo-light.svg"
                : "/logo-dark.svg"
            }
          />
        </Link>
      </div>
      <div className="w-full h-full flex justify-center py-14 overflow-hidden">
        <div className="lg:w-[40%] xl:w-[35%]  w-[50%]  relative">
          <motion.div className="w-full absolute">
            <div className="p-10">
              <div className="text-center">
                <h1 className="text-4xl inline">
                  Login to your{" "}
                  <span className="inline text-[#926e43]">Draftbox</span>{" "}
                  Account
                </h1>
                <p className="mt-3 text-lg">
                  Welcome back to Draftbox! Let's get you back to your emails.
                </p>
              </div>
              <div className="mt-10">
                <form onSubmit={handleLogin}>
                  {errors.general && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.general}
                    </p>
                  )}
                  <div className="mb-4 mt-5">
                    <Label
                      htmlFor="username"
                      className="block text-gray-700 dark:text-white"
                    >
                      Username
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-lg outline-none mt-2 ${
                        errors.username ? "border-red-500" : ""
                      }`}
                      placeholder="Username"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Password
                    </Label>
                    <div className="mt-1 relative rounded-md ">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className={`rounded-lg w-full p-3 outline-none ${
                          errors.password ? "border-red-500" : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlash size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="mt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-[#926e43] hover:underline"
                    >
                      Sign up here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
