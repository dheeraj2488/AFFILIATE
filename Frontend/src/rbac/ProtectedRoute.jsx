import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// `roles` is an array of allowed roles
function ProtectedRoute({ roles, children }) {
  const userDetails = useSelector((state) => state.userDetails);
  
  if(!userDetails) {
    // If user details are not available, redirect to login
    return <Navigate to="/login" replace />;
  }
  // If user role is allowed, render the children, otherwise redirect
  return roles.includes(userDetails?.role) ? (
    children
  ) : (
    <Navigate to="/unauthorized-access" replace />
  );
}

export default ProtectedRoute;
