// import { useState } from "react";

// import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const Login = () => {
  // const [verification, setVerification] = useState(false);

  const { theme } = useTheme();

  // const handleLogin = () => {
  //   axios
  //     .post("http://localhost:3030/login", { email })
  //     .then((response) => {
  //       console.log(response);
  //       const token = response.data.token;
  //       localStorage.setItem("authToken", token);
  //       if (response.data.success === true) {
  //         setVerification(true);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // };

  // const handleVerification = () => {
  //   const token = localStorage.getItem("authToken");
  //   axios
  //     .post(
  //       "http://localhost:3030/veryfy",
  //       { otp },
  //       {
  //         headers: {
  //           Authorization: token,
  //         },
  //       }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       // Handle successful verification
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // };

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (verification) {
  //     handleVerification();
  //   } else {
  //     handleLogin();
  //   }
  // };

  const [showPassword, setShowPassword] = useState(false);

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
                  ? "  /logo-light.svg"
                  : "/logo-dark.svg"
                : theme === "light"
                ? "/logo-light.svg"
                : "/logo-dark.svg"
            }
          />
        </Link>
      </div>
      <div className="w-full h-full flex justify-center py-14">
        <div className="w-[37%]">
          <div className="p-10">
            <div className="text-center">
              <h1 className="text-4xl inline">
                Create your <h1 className="inline text-[#926e43]">Draftbox</h1>{" "}
                Account
              </h1>
            <p className="mt-3 text-lg">
              Welcome to Draftbox! We're excited to have you on board.
               Get ready
              to experience a smarter way to manage your emails.
            </p>
            </div>
            <div className="mt-10">
              <form>
                <div className="mb-4 mt-5">
                  <label htmlFor="username" className="block  text-gray-700 ">
                    Username
                  </label>
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      id="username"
                      className="w-full p-3 rounded-lg outline-none"
                      placeholder="Username"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
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
                  <label
                    htmlFor="Number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      id="Number"
                      placeholder="+91"
                      className="w-full p-3 rounded-lg outline-none"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 bg-core text-white rounded-lg "
                  >
                    Create account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
