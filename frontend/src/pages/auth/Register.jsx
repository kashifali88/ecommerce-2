import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from './OAuth'
import { toast } from 'react-toastify';
import Spinner from '../../components/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    "username": "",
    "email": "",
    "password": ""
  })
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev)=> ({...prev, [e.target.id]: e.target.value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.username || !formData.email || !formData.password ){
        toast.error('Please fill all required fields')
        return;
      }
      const res = await fetch("/api/auth/register",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      } )
      const data = await res.json()
      if (!res.ok || data.success === false) {
        toast.error(data.message)
        return;
      }
      toast.success("Registration success")
      setFormData(data.user)
      navigate("/login")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      
      <div className='w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl'>
        
        <h1 className='text-xl sm:text-2xl font-bold text-center mb-6'>
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          
          <input
            type="text"
            id='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Username'
            className='w-full outline-none p-3 rounded-lg border border-gray-300'
          />

          <input
            type="email"
             id='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className='w-full outline-none p-3 rounded-lg border border-gray-300'
          />

          <input
            type="password"
             id='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full outline-none p-3 rounded-lg border border-gray-300'
          />

          <button className='flex items-center justify-center bg-black text-white p-3 rounded-lg font-semibold hover:bg-gray-800 transition'>
            {loading ? (
              <Spinner />
            ) : "Create Account"
          }
          </button>

        </form>
        <OAuth />

          
          <p className='text-sm mt-4'>
            Already have an account?{" "}
            <Link to="/login" className='text-sm text-blue-600 hover:underline'>
              Sign in
            </Link>
          </p>


        </div>

      </div>

  )
}

export default Register