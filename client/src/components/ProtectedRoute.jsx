import {
  Navigate,
  useLocation,
} from "react-router-dom";

function ProtectedRoute({
  children,
}) {

  const token =
    localStorage.getItem(
      "token"
    );

  const location =
    useLocation();

  /* USER NOT LOGGED IN */

  if (!token) {

    return (

      <Navigate
        to="/login"
        state={{
          from:
            location.pathname,
        }}
        replace
      />

    );

  }

  /* USER LOGGED IN */

  return children;

}

export default ProtectedRoute;