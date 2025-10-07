import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {

    let url = "";
    if(isRegister){
      url = "/api/auth/register";
    }else {
      url = "/api/auth/login"
    }

    try{
      const res = await axios.post(url, {username: data?.username, email: data?.email, password: data?.password, role: data?.role}, {withCredentials: true});
      console.log(res);
      toast.success(res.data.message);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard/profile");

    }catch(err){
      toast.error(err.message);
      console.log("Auth Error", err.message);
    }
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-gray-800 shadow-xl p-8 text-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-400">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                {...register("username", { required: true })}
                className="w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              defaultValue={"bela@bela.com"}
              {...register("email", { required: true })}
              className="w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              defaultValue={"belaa"}
              {...register("password", { required: true, minLength: 5 })}
              className="w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm mb-1">Role</label>
              <select
                {...register("role", { required: true })}
                className="w-full rounded-lg bg-gray-700 border border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value={"Admin"}>Admin</option>
                <option value={"Client"}>Client</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-400 hover:underline font-medium"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
}
