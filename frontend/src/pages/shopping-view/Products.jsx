import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../../redux/slice/productSlice'
import { useEffect } from 'react'

function AdminProducts() {
 const dispatch = useDispatch()
  const {productList } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchAllProducts())
  },[dispatch])

    return ( <>
        <div className="mb-5 flex">
        </div>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
        
        </>
      );
}

export default AdminProducts;