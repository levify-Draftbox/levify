import { Link } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { useState } from "react";
import { Eye, EyeSlash, ArrowRight } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Signup = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
        <div className="w-[30%] relative">
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
              <div className="text-center">
                <h1 className="text-4xl inline">
                  Create your{" "}
                  <span className="inline text-[#926e43]">Draftbox</span>{" "}
                  Account
                </h1>
                <p className="mt-3 text-lg">
                  Welcome to Draftbox! We're excited to have you on board. Get
                  ready to experience a smarter way to manage your emails.
                </p>
              </div>
              <div className="mt-10">
                <form>
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
                      className="w-full p-3 rounded-lg outline-none mt-2"
                      placeholder="Username"
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
                        placeholder="Password"
                        className="rounded-lg w-full p-3 outline-none"
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
                      htmlFor="Number"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Number
                    </Label>
                    <Input
                      id="Number"
                      placeholder="+91"
                      className="w-full p-3 rounded-lg outline-none mt-1"
                    />
                  </div>

                  <div className="mt-2">
                    <button
                      type="button"
                      className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg"
                      onClick={() => setIsVerifying(true)}
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Verify Your Account</h2>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ArrowRight size={24} className="dark:text-white" />
                </button>
              </div>
              <form>
                <div className="mb-4">
                  <Label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Enter OTP
                  </Label>
                  <div className="mt-3">
                    <InputOTP maxLength={6}>
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
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg"
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
