import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();
    const handleLogout =async  () => {
        try{
            const res = await axios.post("/api/auth/logout", {}, {withCredentials: true})
            toast.success(res.data.message);
            localStorage.clear();
            navigate("/");
        }catch(err){
            toast.error(err.message);
            console.log("Logout err", err.message);
        }
    }
  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Left side: could be logo/title */}
          <div className="flex-shrink-0">
            {/* <h1 className="text-xl font-bold text-blue-400">MyApp</h1> */}
          </div>

          {/* Right side: logout button */}
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
