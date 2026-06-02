import Slider from "../components/shopping-view/Slider";
import { GiTShirt, GiLargeDress, GiPearlNecklace, GiRunningShoe } from "react-icons/gi";
import { FaBaby } from "react-icons/fa";
import { PiSneakerLight } from "react-icons/pi";
import { PiSneakerMoveLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { fetchFilterProducts } from "../redux/slice/productSlice";
import ProductCard from "../components/shopping-view/ProductCard"

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.products)
  const categoriesIcon = [
    { id: "men", label: "Men", icon: GiTShirt },
    { id: "women", label: "Women", icon: GiLargeDress },
    { id: "kids", label: "Kids", icon: FaBaby },
    { id: "accessories", label: "Accessories", icon: GiPearlNecklace },
    { id: "footwear", label: "Footwear", icon: GiRunningShoe },
  ];
  const  brandIcon = [
    { id: "nike", label: "Nike", icon: PiSneakerLight },
    { id: "adidas", label: "Adidas", icon: GiRunningShoe},
    { id: "puma", label: "Puma", icon: PiSneakerMoveLight },
    { id: "levi", label: "Levi", icon: GiRunningShoe },
    { id: "zara", label: "Zara", icon: PiSneakerLight },
    { id: "h&m", label: "H&M", icon: PiSneakerMoveLight },
  ]

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section] : [getCurrentItem.id]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate(`/listing`)
  }

  useEffect(() => {
  dispatch(fetchFilterProducts({ filters: {}, sort: "priceLowToHigh"}))

  },[dispatch])
  
  

  return (
    <div className="min-h-screen bg-white">
      <Slider />

      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4">
          
          {/* TITLE */}
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
            Shop by Category
          </h2>

          {/* GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categoriesIcon.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigateToListingPage(item, "category")}
                className="
                  group cursor-pointer
                  bg-white rounded-2xl
                  shadow-md hover:shadow-2xl
                  transition-all duration-300
                  p-6 flex flex-col items-center justify-center
                  hover:-translate-y-1
                "
              >
                {/* ICON */}
                <item.icon
                  className="
                    w-12 h-12 mb-3
                    text-gray-700 group-hover:text-black
                    transition-colors
                  "
                />

                {/* LABEL */}
                <span className="font-semibold text-gray-700 group-hover:text-black">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
              Shop by Brand
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {brandIcon.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigateToListingPage(item, "brand")}
                  className="group cursor-pointer p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center hover:-translate-y-1"
                >
                  <item.icon className="w-12 h-12 mb-3 text-gray-700 group-hover:text-black transition-colors" />
                  <span className="font-semibold text-gray-700 group-hover:text-black">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Feature Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           { productList && productList.length > 0 ? 
            productList.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
            : null 
           }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;