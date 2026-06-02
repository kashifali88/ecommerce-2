import React, { useEffect, useRef } from 'react';
import { FiUpload } from "react-icons/fi";
import { FiFile } from "react-icons/fi";
import { FiX } from "react-icons/fi";

function ProductImageUpload({imageUploadLoading, setImageUploadLoading, file, setFile, formData, setFormData}) {
    const ref = useRef(null);

    const handleImageFileChange = (e) =>{

        const file = e.target.files?.[0]
        if (file) setFile(file);

    }
const uploadImageToCloudinary = async () => {
    const data = new FormData();
    data.append("my_file", file)
    try {
        setImageUploadLoading(true)
        const res = await fetch("/api/products/upload-image", {
            method: "POST",
            body: data
        })
        const resData = await res.json();
        if (!res.ok || resData.success === false) {
            throw new Error(resData.message)
        }
       setFormData((prev) => ({...prev, image: resData.imageUrl}))

    } catch (error) {
        console.log(error.message)
    } finally {
        setImageUploadLoading(false)
    }
}

 useEffect(() => {
  if (!file) return;
  uploadImageToCloudinary();
}, [file]);

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files?.[0];
        if(droppedFile) setFile(droppedFile)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleRemoveImage = () => {
        setFile(null)
        if(ref.current) {
            ref.current.value = ""
        }
    }

  return (
    <div className='w-full flex flex-col'>
        <label className='mb-2 font-semibold'>Upload Image</label>
        <div onDragOver={handleDragOver} onDrop={handleDrop} className='border border-gray-400 rounded-md'>
            <input type="file" id="uploadImage" hidden ref={ref} onChange={handleImageFileChange} />
        {
  imageUploadLoading ? (
    <div className='flex flex-col items-center justify-center h-32'>
      <p className='text-sm text-gray-500'>Uploading image...</p>
    </div>
  ) : !file ? (
    <label
      htmlFor='uploadImage'
      className='flex flex-col items-center justify-center h-32 cursor-pointer'
    >
      <FiUpload className='w-8 h-8 text-gray-600 mb-2'/>
      <span>Drag and drop or click to upload image</span>
    </label>
  ) : (
    <div className='flex items-center justify-between p-6'>
      <div className='flex items-center'>
        <FiFile className='w-8 text-primary h-8 mr-2' />
      </div>

      <p className='text-sm font-md'>{file.name}</p>

      <button type='button' onClick={handleRemoveImage}>
        <FiX className='text-red-500 w-6 h-6 cursor-pointer' />
        <span className='sr-only'>Remove file</span>
      </button>
    </div>
  )
}
        </div>
    </div>
  )
}

export default ProductImageUpload