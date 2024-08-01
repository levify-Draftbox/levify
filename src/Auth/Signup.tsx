import React, { useState, useEffect, } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { CaretDown, Eye, EyeSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Spinner } from "@/components/Spinner";
interface SignupResponse {
  message: string;
  success: boolean;
  token?: string;
}

interface VerifyResponse {
  success: boolean;
  message?: string;
  token?: string;
}

const Signup = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [token, setToken] = useState<string>("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mobile: "",
  });
  const [otp, setOtp] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [timeRemaining, setTimeRemaining] = useState(60);

  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVerifying && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isVerifying, timeRemaining]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: undefined });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else {
      formData.username = formData.username.trim().toLowerCase();
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()-=_+[\]{}|;':",./<>?])(?=.*\d).{6,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one special character, one number, and be at least 6 characters long";
    }

    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      newErrors.mobile = "Invalid mobile number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await api.post<SignupResponse>("/auth/signup", formData);

      if (response.data.success) {
        if (response.data.token) {
          setToken(response.data.token);
        }
        setIsVerifying(true);
      } else {
        console.error("Signup failed:", response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors({ "username": error.response?.data.error });
        console.log("Error during signup:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ ...errors, otp: "Please enter a 6-digit OTP" });
      return;
    }
    setIsLoading(true); // Start loading spinner
    try {
      const response = await api.post<VerifyResponse>("/auth/verify", {
        otp,
        token,
      });
      if (response.data.success) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        window.location.href = "/";
      } else {
        setErrors({ ...errors, otp: response.data.message || "Verification failed" });
      }
    } catch (error) {
      setErrors({ ...errors, otp: "Invalid OTP" });
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post<{ success: boolean; message?: string }>(
        "/auth/resend-otp",
        { token }
      );
      if (response.data.success) {
        setTimeRemaining(60);
      } else {
        setErrors({ ...errors, otp: response.data.message || "Failed to resend OTP" });
      }
    } catch (error) {
      setErrors({ ...errors, otp: "Error resending OTP" });
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
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
        <div className="container relative">
          <motion.div
            className="w-full absolute"
            initial={{ x: "0%", opacity: 1 }}
            animate={{
              x: isVerifying ? "-100%" : "0%",
              opacity: isVerifying ? 0 : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-10">
              <div className="w-full flex items-center flex-col text-center">
                <h1 className="text-4xl inline">
                  Create your <span className="inline text-core">Draftbox</span>{" "}
                  Account
                </h1>
                <p className="w-[600px] mt-3 text-base">
                  Welcome to Draftbox! We're excited to have you on board. Get
                  ready to experience a smarter way to manage your emails.
                </p>
              </div>
              <div className="flex justify-center mt-10">
                <form className="w-[500px]" onSubmit={handleSignup}>
                  <div className="mb-4 mt-5">
                    <label
                      htmlFor="username"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white"
                    >
                      Username
                    </label>
                    <div className="flex justify-center ">
                      <div className="w-full">
                        <Input
                          type="text"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className={`w-full p-3 !rounded-l-lg outline-none mt-2 ${errors.username ? "border-red-500" : ""
                            }`}
                          placeholder="Username"
                          error={errors.username}
                        />
                      </div>

                      <div className={`flex gap-2 h-10 px-3 mt-2 rounded-r-lg bg-input justify-center items-center cursor-pointer `}>
                        <Select open={isOpen} onOpenChange={setIsOpen}>
                          <SelectTrigger className="w-auto">
                            <SelectValue placeholder="@draftbox.com" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="@draftbox.com">@draftbox.com</SelectItem>
                            <SelectItem value="@draftbox.dev">
                              @draftbox.dev
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <CaretDown size={15} onClick={toggleSelect} />
                      </div>
                    </div>

                  </div>

                  <div className="mb-4 w-full">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white"
                    >
                      Password
                    </label>
                    <div className=" mt-1 flex w-full rounded-md">
                      <div className="w-full">

                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Password"
                          className={`rounded-l-lg w-full p-3  outline-none ${errors.password ? "border-red-500" : ""
                            }`}
                          error={errors.password}

                        />
                      </div>
                      <div className="">

                        <div
                          className=" inset-y-0  h-10 right-0 px-3 bg-input rounded-r-lg flex items-center"
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

                  <div className="mb-6">
                    <Input
                      label="Mobile"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91"
                      className={`w-full p-3 rounded-lg outline-none mt-1 ${errors.mobile ? "border-red-500" : ""
                        }`}
                      error={errors.mobile}
                    />
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
                        "Create account"
                      )}
                    </button>
                  </div>
                  <div className="mt-4 text-center">
                  <p className="text-sm">
                    alredy have an account?{" "}
                    <Link to="/login" className="text-core hover:underline">
                      Log in here
                    </Link>
                  </p>
                </div>
                </form>
               
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full flex justify-center"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: isVerifying ? "0%" : "100%",
              opacity: isVerifying ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-10  w-[500px]">
              <div className="mb-6">
                <h2 className="text-2xl">Verify Your Account</h2>
                {timeRemaining > 0 ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Time remaining: {timeRemaining} seconds
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    OTP expired. Please resend OTP.
                  </p>
                )}
              </div>
              <form onSubmit={handleVerify}>
                <div className="mb-4">
                  <Label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Enter OTP
                  </Label>
                  <div className="mt-3">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={handleOtpChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />  
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors.otp && (
                    <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                  )}
                </div>
                <div className="mb-2">
                  <button
                    type="button"
                    className="text-core hover:underline mb-1"
                    onClick={handleResendOTP}
                    disabled={timeRemaining > 0}
                  >
                    {timeRemaining > 0
                      ? `Resend OTP (${timeRemaining}s)`
                      : "Resend OTP"}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg mb-4 hover:bg-core-lite"
                  disabled={timeRemaining === 0 || isLoading}
                >
                  {isLoading ? (
                      <Spinner />
                  ) : (
                    "Verify"
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
