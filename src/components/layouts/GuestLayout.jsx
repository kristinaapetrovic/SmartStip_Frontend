import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import "../../assets/css/bootstrap.min.css";

export default function GuestLayout() {
  const { token } = useStateContext();

  return !token ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
