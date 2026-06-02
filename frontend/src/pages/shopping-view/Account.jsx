import  { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaLock, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUserStart, deleteUserFailure, deleteUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../../redux/slice/authSlice";
import { Link, useNavigate } from "react-router-dom";

function Account() {
  const { currentUser, loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [file, setFile] = useState(null);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// To render user data on page load
  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        profileImage: currentUser.profileImage,
      })
    }
  }, [currentUser]);

  // Upload image to cloudinary
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_PROFILE_UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );
    const result = await res.json();
    return result.secure_url;
  };


// Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async(e) => {
    e.preventDefault();
    if (formData.oldPassword && !formData.newPassword) {
      dispatch(updateUserFailure("Please enter new password"));
      return;
    }
    if (formData.newPassword && !formData.oldPassword) {
      dispatch(updateUserFailure("Please enter old password to update new password"));
      return;
    }
    if (formData.oldPassword && formData.newPassword) {
      if (formData.newPassword === formData.oldPassword) {
        dispatch(updateUserFailure("New password cannot be the same as old password"));
        return;
      }
    }
    if (
  formData.newPassword && formData.newPassword !== formData.confirmPassword) {
  dispatch(updateUserFailure("Passwords do not match"));
  return;
}
    try {
      dispatch(updateUserStart());
      let profileImage = currentUser?.profileImage;
      if (file) {
        profileImage = await uploadImage();
      }
      const res = await fetch(`${API}/user/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ ...formData, profileImage })
      });
    const data = await res.json();
    if (!res.ok || data.success === false) {
      dispatch(updateUserFailure(data.message || "Failed to update profile"));
      return;
    }
    dispatch(updateUserSuccess(data.user));
    toast.success("User updated successful")
    setFormData((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
    setFile(null);
    } catch (error) {
      toast.error("Failed to update profile", { description: error.message });
    }
  };

  const handleDeleteAccount = async () => {
  if (!deletePassword) {
    toast.error("Please enter your password to delete account");
    return;
  }
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`${API}/user/${currentUser?._id}`,{
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ password: deletePassword })
    });
    const data = await res.json();
     if (!res.ok || data.success === false) {
      dispatch(deleteUserFailure(data.message || "Failed to delete account"));
      return;
    }
    dispatch(deleteUserSuccess());
  toast.success("Account deleted successfully");
  navigate("/login");
  } catch (error) {
    dispatch(deleteUserFailure("Failed to delete account", error.message));
  }
}

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-4">

    {/* PROFILE */}
    <div className="flex flex-col items-center mb-4">

      <div className="w-16 border-2 border-gray-300 h-16 rounded-full bg-slate-100 flex items-center justify-center shadow">
        <input type="file" ref={fileRef} hidden onChange={(e) => setFile(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} src={file ? URL.createObjectURL(file) : currentUser?.profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
      </div>

      <h1 className="text-xl font-bold text-slate-800 mt-2">
        My Profile
      </h1>

    </div>

    {/* FORM */}
    <form
      onSubmit={handleUpdateProfile}
      className="space-y-3"
    >

      {/* USERNAME */}
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
        <FaUserCircle className="text-gray-400 mr-2 text-sm" />

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* EMAIL */}
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
        <FaEnvelope className="text-gray-400 mr-2 text-sm" />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* OLD PASSWORD */}
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
        <FaLock className="text-gray-400 mr-2 text-sm" />

        <input
          type="password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          placeholder="Old Password"
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* NEW PASSWORD */}
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
        <FaLock className="text-gray-400 mr-2 text-sm" />

        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2">
        <FaLock className="text-gray-400 mr-2 text-sm" />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full outline-none text-sm bg-transparent"
        />
      </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {/* BUTTON */}
      <button
        type="submit"
        className="disabled:opacity-50 w-full bg-black text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        disabled={loading}
      >
        { loading ? "Updating..." : "Update Profile" }
      </button>

    </form>
    <div className="mt-6 border-t pt-4">
  <h2 className="text-sm font-semibold text-red-600">
    Danger Zone
  </h2>

  <p className="text-xs text-gray-500 mt-1">
    Once you delete your account, there is no going back.
  </p>

  <button
    onClick={() => setShowDeleteModal(true)}
    className="mt-3 w-full bg-red-600 text-white py-2 rounded-xl text-sm hover:bg-red-700 transition"
  >
    Delete Account
  </button>
</div>
  </div>
  {showDeleteModal && (
    <>
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center">
      <div className="bg-gray-500 p-6 rounded-lg w-80">
        <h2 className="text-lg font-bold mb-3">Confirm Delete</h2>
        <p className="text-sm text-gray-300 mb-4">
          Please enter your password to confirm account deletion.
        </p>
        <input
          type="password"
          placeholder="Password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
          className="bg-gray-600 text-gray-300 placeholder:text-gray-400 border border-gray-400 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <Link to="/forgot-password" className="flex justify-baseline mt-1 block text-xs text-gray-400 hover:text-white cursor-pointer">
          Forgot your password?
        </Link>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
      </div>
      </>
      
    )}
</div>

  )}

export default Account;