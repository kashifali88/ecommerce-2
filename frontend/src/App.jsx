import { Routes, Route } from "react-router-dom";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOrders from "./pages/admin/Orders";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFeatures from "./pages/admin/Features";
import NotFound from "./pages/not-found/NotFound";
import Listing from "./pages/shopping-view/Listing";
import Checkout from './pages/shopping-view/Checkout'
import CreateProduct from "./pages/admin/CreateProduct";
import Products from './pages/shopping-view/Products'
import AdminProducts from "./pages/admin/AdminProducts";
import UpdateProduct from './pages/admin/UpdateProduct'
import Header from "./components/shopping-view/Header";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Account from "./pages/shopping-view/Account";
import Footer from './components/shopping-view/Footer'
import SingleProduct from "./pages/shopping-view/SingleProduct";
import Cart from "./pages/shopping-view/Cart";
import OrderSuccess from "./pages/shopping-view/OrderSuccess";
import PaymentSuccess from "./pages/shopping-view/PayemntSuccess";
import MyOrders from "./pages/user/Orders";
import OrderDetails from "./pages/user/OrderDetails";
import ForgotPassword from "./pages/shopping-view/ForgotPassword";
import ResetPassword from "./pages/shopping-view/ResetPassword";

function App() {
  return (
  <div className="flex flex-col bg-white ">
    <Header />
  <Routes>

      {/* Public Routes inside layout */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

    {/* <Route element={<AdminRoute />}> */}
    <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="products" element={<AdminProducts />} />
    <Route path="create-product" element={<CreateProduct />} />
    <Route path="update-product/:id" element={<UpdateProduct />} />
    <Route path="features" element={<AdminFeatures />} />
    </Route>
    </Route>
    {/* </Route> */}

   <Route path='/' element={<Home />} />
  <Route path="listing" element={<Listing />} />
  <Route path="products" element={<Products />} />
  <Route path="product/:id" element={<SingleProduct />} />


  {/*  PROTECTED USER ROUTES */}
  <Route element={<ProtectedRoute />}>
    <Route path="checkout" element={<Checkout />} />
    <Route path="account" element={<Account />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/order-success" element={<OrderSuccess />} />
    <Route path="/payment-success" element={<PaymentSuccess />} />
    <Route path="/my-orders" element={<MyOrders />} />
    <Route path="/order-details/:id" element={<OrderDetails />} />
  </Route>


    {/* Public page */}
    <Route path="*" element={<NotFound />} />

  </Routes>
  <Footer />
</div>
  );
}

export default App;
