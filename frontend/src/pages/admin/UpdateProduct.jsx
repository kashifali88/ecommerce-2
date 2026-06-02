import React, { useEffect, useState } from 'react'
import { addProductFormElements } from '../../config/index'
import ProductImageUpload from '../../components/admin/ImageUpload'
import { updateProduct } from '../../redux/slice/productSlice'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '../../components/Spinner'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

function UpdateProduct() {

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const [formData, setFormData] = useState(initialFormData)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [file, setFile] = useState(null)

  const { loading, productList } = useSelector((state) => state.products)

  // 🔥 load product data into form
  useEffect(() => {
    const product = productList.find((p) => p._id === id)

    if (product) {
      setFormData({
        image: product.image,
        title: product.title,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        salePrice: product.salePrice,
        totalStock: product.totalStock
      })
      setFile(product.image)
    }
  }, [id, productList])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(updateProduct({ id, formData }))
      .then((data) => {
        if (data?.payload?.success) {
          toast.success("Product updated successfully")
          navigate("/admin/products")
        }
      })
  }

  return (
    <div className='min-h-screen w-full max-w-2xl mx-auto'>
      <h1 className='text-2xl font-semibold text-center'>
        Update Product
      </h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        {addProductFormElements.map((field) => {

          if (field.componentType === "input") {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className='p-3 border rounded-md'
                />
              </div>
            )
          }

          if (field.componentType === "textarea") {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <textarea
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={3}
                  className='p-3 border rounded-md'
                />
              </div>
            )
          }

          if (field.componentType === "select") {
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <label>{field.label}</label>
                <select
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className='p-3 border rounded-md'
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

        })}

        <ProductImageUpload
          imageUploadLoading={imageUploadLoading}
          setImageUploadLoading={setImageUploadLoading}
          file={file}
          setFile={setFile}
          formData={formData}
          setFormData={setFormData}
        />

        <button
          disabled={loading}
          className='flex items-center justify-center p-3 bg-slate-700 text-white rounded-md'
        >
          {loading ? <Spinner /> : "Update Product"}
        </button>

      </form>
    </div>
  )
}

export default UpdateProduct