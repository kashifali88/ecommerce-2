import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup, getAuth } from 'firebase/auth';
import React from 'react'
import { useDispatch } from 'react-redux'
import { app } from '../../../firebase';
import { signInFailure, signInStart, signInSuccess } from '../../redux/slice/authSlice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider)
    const user = result.user;
    try {
      dispatch(signInStart())
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: user.displayName,
          email: user.email,
          profileImage: user.photoURL
        })
      })
      const data = await res.json();
    if (!res.ok || data.success === false ) {
      dispatch(signInFailure(data.message || "Failed google login"))
      toast.error(data.message)
      return;
    }
    dispatch(signInSuccess(data.user))
    toast.success("Login successful");
    navigate('/')

    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message)
    }

  }
  return (
    <form onSubmit={handleSubmit}>
        <button type='submit' className='mt-2 font-semibold hover:opacity-90 w-full p-3 rounded-md bg-red-600 text-white '>CONTINUE WITH GOOGLE</button>
    </form>
  )
}

export default OAuth