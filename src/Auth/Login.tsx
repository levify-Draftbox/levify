import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import ResizeableModel from "@/components/ui/ResizeableModel";
import { Button } from "@/components/ui/button";

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const Login = () => {
  let theme = "dark"
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorIncorrectCerd, setShowIncorrectCred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", formData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      }
    } catch (error: any) {
      if (error.response.status === 404) {
        setShowIncorrectCred(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handelTryagain = () => {

    setFormData({
      password: "",
      username: "",
    })

    setErrors({
      username: "",
      password: ""
    })

    setShowIncorrectCred(false);
  }


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
        {showErrorIncorrectCerd && (
          <ResizeableModel
            key="model"
            size={{ width: "30%", height: "15%" }}
            onClose={handelTryagain}
          >
            <div className="p-6 w-full h-full">
              <h1 className={`text-2xl font-[500] `}>
                <p>Login Faild</p>
              </h1>
              <div className="text-sm mt-3 font-thin text-gray-700 dark:text-gray-200">
                Incorrect username or password.
              </div>
              <div className="mt-4 flex justify-end items-end">
                <Button variant={"primary"} onClick={handelTryagain} className="w-32" >Try again</Button>
              </div>
            </div>
          </ResizeableModel>
        )}
      </div>
      <div className="w-full h-full flex justify-center py-14 overflow-hidden">
        <div className="w-full relative">
          <motion.div className="w-full">
            <div className="p-10">
              <div className="flex justify-center">
                <div className="text-center w-[450px]">
                  <h1 className="text-4xl inline">
                    Login to your{" "}
                    <span className="inline text-core">Draftbox</span>
                  </h1>
                  <p className="mt-3 text-base w-[450px]">
                    Welcome back to Draftbox! Let's get you back to your emails.
                  </p>
                </div>
              </div>
              <div className="w-full justify-center flex flex-col items-center mt-10">
                <form className="w-[450px]" onSubmit={handleLogin}>

                  <div className="my-3">
                    <Input
                      label="Username"
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full outline-none ${errors.username ? "border-red-x" : ""
                        }`}
                      placeholder="Username"
                      error={errors.username}
                    />
                  </div>

                  <div className="my-3">
                    <div className="mt-1 flex w-full rounded-md">
                      <div className="w-full">
                        <Input
                          label="Password"
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className={`rounded-l-lg w-full outline-none ${errors.password ? "border-red-500" : ""
                            }`}
                          error={errors.password}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Button
                      loading={isLoading}
                    >
                      Login
                    </Button>
                  </div>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-core hover:underline">
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
