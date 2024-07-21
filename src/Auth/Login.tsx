// import { useState } from "react";

// import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/Theme-provider";

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
      <div className="w-full h-full flex justify-center ">
        <div className="w-[50%]">
          <div className="p-10">
            <div>
              <h1 className="text-4xl inline">Create your <h1 className="inline text-[#a67e4f]">Draftbox</h1>  Account</h1>
            </div>
            <p className="mt-4 text-lg">
              Welcome to Draftbox! We're excited to have you on board. Get ready
              to experience a smarter way to manage your emails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
