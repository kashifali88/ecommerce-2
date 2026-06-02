import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  const { currentUser } = useSelector((state) => state.auth);
  

  if (!currentUser) return <Navigate to="/login" />;

  return currentUser.isAdmin ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoute;