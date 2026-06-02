import { FaBars } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'


function AdminHeader({setOpen}) {
    const navigate = useNavigate();
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleLogOut = async () => {
  try {
    const res = await fetch(`${API}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok || data.success === false) {
      return toast.error(data.message);
    }

    toast.success("User logged out successfully");

    navigate("/login");

  } catch (error) {
    toast.error(error.message);
  }
};
    return (
        <header className="flex items-center justify-center px-4 py-3 bg-background  shadow-md">
            <button onClick={()=>setOpen((prev) => !prev)} className='flex items-center gap-2 md:hidden sm:block'>
                <FaBars  className='text-xl' />
                <span className='font-semibold'>Menu</span>
            </button>
            <div className='flex flex-1 justify-end'>
                <button className='flex items-center justify-center bg-slate-700 p-2 text-sm rounded-md cursor-pointer text-white font-semibold hover:opacity-90'>
                <FiLogOut />
                <span onClick={handleLogOut}>Logout</span>
                </button>
            </div>
        </header>
      );
}

export default AdminHeader;