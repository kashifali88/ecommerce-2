import { MdDashboard } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { FiClipboard } from "react-icons/fi";
export const adminSideBarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: MdDashboard 
    },
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: FiShoppingCart  
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: FiClipboard
    },
    {
        id: "create-product",
        label: "Create-Product",
        path: "/admin/create-product",
        icon: FiClipboard
    },
   
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "hm", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];
export const sortOptions = [
  { id :"priceLowToHigh", label: "Price: Low to High"},
  { id :"priceHighToLow", label: "Price: High to Low"},
  { id :"newest", label: "Newest Arrivals"},
]

export const filterOptions = {
  category: [
    { id: 'men', label: "Men"},
    { id: 'women', label: "Women"},
    { id: 'kids', label: "Kids"},
    { id: 'accessories', label: "Accessories"},
    { id: 'footwear', label: "Footwear"},
  ],
  brand: [
    { id: "nike", label: "Nike"},
    { id: "adidas", label: "Adidas"},
    { id: "puma", label: "Puma"},
    { id: "levi", label: "Levi"},
    { id: "zara", label: "Zara"},
    { id: "h&m", label: "H&M"},
  ]
}