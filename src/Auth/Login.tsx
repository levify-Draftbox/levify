import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [varification, setVarification] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVarification(!varification);
  };

  return (
    <div className="flex items-center justify-center flex-col h-screen">
      <div className="w-96">
        <div>
          <h1 className="font-semibold text-2xl">Think it. Make it.</h1>
          <p className="text-2xl font-bold text-[#acaba9]">
            Log in to your Notion account
          </p>
        </div>
        <div className="mt-10">
          <div className="w-full h-10 border-[1px] rounded-md border-slate-300 flex justify-center items-center gap-2 cursor-pointer dark:hover:bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(0,0,0,0.06)]">
            <FcGoogle size={20} />
            <p className="text-sm font-semibold">Continue With Google</p>
          </div>
        </div>
        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <label>
              <p className="text-sm">Email</p>
              <Input
                className="mt-2"
                placeholder="Enter your email address.."
              />
            </label>

            <p className="text-sm text-slate-400 mt-2">
              Use an organization email to easily collaborate with teammates
            </p>

            {varification && (
              <div className="mt-5">
                <label>
                  <p className="text-sm">Verification code</p>
                  <Input
                    className="mt-2"
                    placeholder="Paste Sing Up code"
                  />
                </label>
                <p className="text-sm text-slate-400 mt-2">
                  We sent a code to your inbox
                </p>
              </div>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-[#2383e2] rounded-md mt-4 text-white font-semibold"
            >
              Continue
            </button>
          </form>
        </div>
        <div className="text-center mt-24">
          <p className="text-sm text-gray-500 inline">
            Your name and photo are displayed to users who invite you to a
            workspace using your email. By continuing, you acknowledge that you
            understand and agree to the
            <p className="text-gray-400 hover:text-blue-500 cursor-pointer inline">
              Terms & Conditions
            </p>
            and
            <p className="text-gray-400 hover:text-blue-500 cursor-pointer inline">
              Privacy Policy
            </p>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
