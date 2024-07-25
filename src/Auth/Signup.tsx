import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { Eye, EyeSlash } from "@phosphor-icons/react";
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
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [timeRemaining, setTimeRemaining] = useState(60);
  const Navigate = useNavigate();

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
    setErrors({ ...errors, [id]: null });
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
    if (!validateForm()) {
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
        alert(error.response?.data.error);
        console.log("Error during signup:", error.response);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }
    try {
      const response = await api.post<VerifyResponse>("/auth/verify", { otp, token });
      if (response.data.success) {
        alert("Verification successful");
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        Navigate("/inbox");
      } else {
        console.error("Verification failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await api.post<{ success: boolean; message?: string }>(
        "/auth/resend-otp",
        { token }
      );
      if (response.data.success) {
        alert("New OTP sent successfully");
        setTimeRemaining(60);
      } else {
        console.error("Failed to resend OTP:", response.data.message);
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
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
            <div className=" p-10">
              <div className="w-full flex items-center flex-col text-center">
                <h1 className="text-4xl inline">
                  Create your{" "}
                  <span className="inline text-[#926e43]">Draftbox</span>{" "}
                  Account
                </h1>
                <p className="w-[600px] mt-3 text-lg">
                  Welcome to Draftbox! We're excited to have you on board. Get
                  ready to experience a smarter way to manage your emails.
                </p>
              </div>
              <div className="flex justify-center mt-10">
                <form className="w-[600px]" onSubmit={handleSignup}>
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
                      className={`w-full p-3 rounded-lg outline-none mt-2 ${errors.username ? "border-red-500" : ""
                        }`}
                      placeholder="Username"
                      error={errors.username || ""}
                    />

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
                        className={`rounded-lg w-full p-3 outline-none ${errors.password ? "border-red-500" : ""}`}
                        error={errors.password || ""}
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

                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="mobile"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Mobile
                    </Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="+91"
                      className={`w-full p-3 rounded-lg outline-none mt-1 ${errors.mobile ? "border-red-500" : ""}`}
                      error={errors.mobile || ""}
                    />

                  </div>

                  <div className="mt-2">
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg"
                    >
                      Create account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="w-full absolute"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{
              x: isVerifying ? "0%" : "100%",
              opacity: isVerifying ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-10">
              <div className="mb-6">
                <h2 className="text-2xl">Verify Your Account</h2>
                {timeRemaining > 0 ? (
                  <p className="text-sm text-gray-600 mt-1">
                    Time remaining: {timeRemaining} seconds
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    Otp expired. Please resend OTP.
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
                  className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg mb-4"
                  disabled={timeRemaining === 0}
                >
                  Verify
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
