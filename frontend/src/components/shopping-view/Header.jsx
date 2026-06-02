import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { HiOutlineShoppingCart, HiOutlineMenuAlt3 } from "react-icons/hi";
import { FaSearch, FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';
import {  signOutFailure, signOutStart, signOutSuccess } from '../../redux/slice/authSlice'
import { FaClipboardList } from "react-icons/fa";

function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { totalQuantity } = useSelector((state) => state.cart)
  const { currentUser } = useSelector((state) => state.auth);
  const [searchTerm ,setSearchTerm] = useState("")
  const navigate = useNavigate();
const dispatch = useDispatch();
    const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const handleNavigate = (getCurrentMenuItem) => {
  sessionStorage.removeItem('filters')
  const currentFilter = getCurrentMenuItem.id !== '/' ? {
    category: [getCurrentMenuItem.id]
  } : null
  sessionStorage.setItem('filters', JSON.stringify(currentFilter))
  navigate(getCurrentMenuItem.path)
}
  const navLinks = [
    { id: "home", name: "Home", path: "/" },
    { id: "products", name: "Products", path: "/listing" },
    { id: "men", name: "Men", path: "/listing" },
    { id: "women", name: "Women", path: "/listing" },
    { id: "kids", name: "Kids", path: "/listing" },
    { id: "accessories", name: "Accessories", path: "/listing" },
  ];




  const handleLogout = async() => {
try {
  dispatch(signOutStart())
  const res = await fetch(`${API}/auth/signout`, {
    method: "POST",
    credentials: "include"
  })
  const data = await res.json()
  if (!res.ok || data.success === false) {
    dispatch(signOutFailure(data.message))
    return toast.error(data.message);
  }
  dispatch(signOutSuccess())
  toast.success("Logged Out successfully")
navigate("/login")
  
} catch (error) {
  dispatch(signOutFailure(error.message))
  toast.error(error.message)
}  
};

const handleSearchProduct = async (searchTerm) => {
  try {
    if(!searchTerm.trim()){
      toast.error("search for something")
      return
    }
      sessionStorage.removeItem("filters");

    const res = await fetch(`${API}/products/search?keyword=${searchTerm}`)
    const data = await res.json();
    if (!res.ok || data.success === false){
      toast.error(data.error);
      return;
    }
    navigate(`/listing?search=${searchTerm}`);
    
  } catch (error) {
    toast.error(error.message)
  }
}

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <FiShoppingBag size={24} className="text-slate-700" />
              <h1 className="text-xl font-bold text-slate-700">
                Ecommerce
              </h1>
            </Link>

            {/* DESKTOP NAV */}
            <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-700">
              {navLinks.map((item) => (
                <li onClick={() => handleNavigate(item)} key={item.id}>
                  <Link to={item.path} className="hover:text-black transition">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4">

              {/* SEARCH */}
              <div className="hidden md:flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <input
                  type="text"
                  value={searchTerm || ""}
                  onChange={(e)=> setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="outline-none text-sm w-48"
                />
                <FaSearch onClick={()=> handleSearchProduct(searchTerm)} className="text-gray-400" />
              </div>

              {/* CART */}
              <Link to="/cart" className="relative">
                <HiOutlineShoppingCart size={26} className="text-slate-700" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              </Link>

              {/* PROFILE / LOGIN */}
              <div className="relative">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2"
                    >
                      <img
                        className="cursor-pointer w-8 h-8 rounded-full border-2 border-gray-500 object-cover"
                        src={currentUser?.profileImage}
                        alt=""
                      />
                      <span className="hidden md:block font-semibold text-gray-700">
                        {currentUser?.username}
                      </span>
                    </button>

                    {/* DROPDOWN */}
                    {profileOpen && (
                      <>
                        <div
                          onClick={() => setProfileOpen(false)}
                          className="fixed inset-0 bg-black/30 z-40"
                        />

                        <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <p className="px-4 py-3 text-sm sm:hidden">Username: <span className="text-sky-600">{currentUser?.username}</span></p>
                          <Link
                            to="/account"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 block px-4 py-3 text-gray-500 text-sm hover:bg-gray-100"
                          >
                            <FaUser />
                            Account
                          </Link>

                          <Link
                           onClick={() => setProfileOpen(false)}
                            to="/my-orders" className="flex items-center gap-2 cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-500 hover:bg-gray-100"
                          >
                            <FaClipboardList />
                            My orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 cursor-pointer w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-gray-100"
                          >
                            <FaSignOutAlt />
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="  font-semibold text-gray-700"
                  >
                    Sign in
                  </Link>
                )}
              </div>

              {/* MOBILE MENU BUTTON */}
              <button onClick={() => setOpenMenu(true)} className="lg:hidden">
                <HiOutlineMenuAlt3 size={28} />
              </button>

            </div>
          </div>
        </div>

        {/* MOBILE OVERLAY */}
        <div
          onClick={() => setOpenMenu(false)}
          className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition ${
            openMenu ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        />

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform lg:hidden ${
            openMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* TOP */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/">
            <div className="flex items-center gap-2">
              <FiShoppingBag size={22} />
              <h2 className="font-bold text-lg">Ecommerce</h2>
            </div>
            </Link>

            <button onClick={() => setOpenMenu(false)}>
              <IoClose size={28} />
            </button>
          </div>

          {/* SEARCH */}
          <div className="p-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
              <input
                type="text"
                placeholder="Search..."
                className="outline-none text-sm flex-1"
              />
              <FaSearch className="text-gray-400" />
            </div>
          </div>

          {/* LINKS */}
          <ul className="flex flex-col px-4 gap-5 text-sm font-semibold text-gray-700">
            {navLinks.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => setOpenMenu(false)}
                  className="hover:text-black"
                >
                  {item.name}
                </Link>
              </li>
            ))}

          </ul>
        </div>
      </nav>

     
    </>
  );
}

export default Header;