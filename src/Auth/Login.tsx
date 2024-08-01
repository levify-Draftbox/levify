import React, { useState  } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import ResizeableModel from "@/components/ui/ResizeableModel";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const Login = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorDialog, setShowErrorDialog] = useState(false);
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

      if (response.data.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "/";
      } else {
        setErrors({
          ...errors,
          general: response.data.message || "Login failed",
        });
      }
    } catch (error) {
      console.log("Error:", error);
      setShowErrorDialog(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handelTryagain=()=>{

    window.location.href = "/";

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
          {showErrorDialog && (
            <AnimatePresence>
            <ResizeableModel
              key="model"
              size={{ width: "30%", height: "15%" }}
              onClose={() => setShowErrorDialog(false)}
            >
              <div className="p-6 w-full h-full">
                <h1 className={`text-2xl font-[500] `}>
                  <p>error</p>
                </h1>
                <div className="text-sm mt-3 font-thin text-gray-700 dark:text-gray-200">
                incorrect username or password.
                </div>
                <div className=" flex justify-end items-end">
                  <Button onClick={handelTryagain} className="w-32 bg-black " variant="superActive">try again</Button>
                </div>
              </div>
            </ResizeableModel>
            </AnimatePresence>
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
                    <span className="inline text-core">Draftbox</span> Account
                  </h1>
                  <p className="mt-3 text-lg w-[450px]">
                    Welcome back to Draftbox! Let's get you back to your emails.
                  </p>
                </div>
              </div>
              <div className="w-full justify-center flex flex-col items-center mt-10">
                <form className="w-[450px]" onSubmit={handleLogin}>
                  {errors.general && (
                    <p className="text-red-500 text-sm mb-4">
                      <AnimatePresence>
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          transition={{ ease: "easeOut", duration: 0.3 }}
                        >
                          <motion.span className="text-red-500 text-sm block mt-1">
                            {errors.general}
                          </motion.span>
                        </motion.div>
                      </AnimatePresence>
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
                      error={errors.username}
                    />
                  </div>
                  <div className="mb-4 w-full">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="mt-1 flex w-full rounded-md">
                      <div className="w-full">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className={`rounded-l-lg w-full p-3 outline-none ${
                            errors.password ? "border-red-500" : ""
                          }`}
                          error={errors.password}
                        />
                      </div>
                      <div className="">
                        <div
                          className="inset-y-0 h-10 right-0 px-3 bg-input rounded-r-lg flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlash size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg hover:bg-core-lite"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                          <Spinner />
                      ) : (
                        "Login"
                      )}
                    </button>
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
