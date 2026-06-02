import React, {  useState } from 'react'
import { addProductFormElements } from '../../config/index' // adjust path
import ProductImageUpload from '../../components/admin/ImageUpload'
import { addNewProduct } from '../../redux/slice/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import  Spinner  from '../../components/Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function CreateProduct() {
  const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: ""
  }
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const { loading } = useSelector((state) => state.products)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(addNewProduct(formData)).then((data) => {
if (data?.payload?.success) {
  setFormData(initialFormData)
  setFile(null)
  toast.success('Product added successfully')
navigate('/admin/products')
}    
    })

  }

  
  return (
    <div className='min-h-screen  w-full max-w-2xl mx-auto'>
        <h1 className='text-2xl font-semibold text-center'>Create Product</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {addProductFormElements.map((field) => {
            
            // INPUT
            if (field.componentType === "input") {
                return (
                    <div key={field.name} className="flex flex-col gap-1">
                <label className="text-sm font-medium">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className='p-3 rounded-md border border-gray-400'
                />
              </div>
            )
        }
        
        // TEXTAREA
        if (field.componentType === "textarea") {
            return (
                <div key={field.name} className="flex flex-col gap-1">
                <label className="text-sm font-medium">{field.label}</label>
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={3}
                  className='p-3 rounded-md border border-gray-400'
                />
              </div>
            )
        }

          // SELECT
          if (field.componentType === "select") {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-sm font-medium">{field.label}</label>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className='p-3 rounded-md border border-gray-400'
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )
        }
        
        return null
    })}
    <ProductImageUpload imageUploadLoading = {imageUploadLoading} setImageUploadLoading={setImageUploadLoading} file={file} setFile={setFile} formData={formData}
setFormData={setFormData}  />

        <button disabled={loading} className='cursor-pointer flex items-center justify-center p-3 bg-slate-700 rounded-md text-white hover:opacity-90'>
          {loading ? (
            <Spinner /> 
          ) : "Add Product"}
        </button>

      </form>
    </div>
  )
}

export default CreateProduct