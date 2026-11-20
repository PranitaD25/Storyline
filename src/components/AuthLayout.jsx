import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const authStatus = useSelector((state) => state.auth.status);

  //   authentication → tells whether the current page requires login. It is usually a prop passed to a protected route component.
  // authStatus → tells whether the user is actually logged in, usually obtained from Redux.

  //   authentication = true; // Page requires login
  // authStatus = false;     // User is not logged in
  // The user is trying to access a protected page without logging in.

  //   All possible scenarios
  // authentication	authStatus	 Result
  // true	         true	       Stay on page
  // true	         false	    Redirect to /login
  // false        	true       Redirect to /
  // false	       false	     Stay on page
  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (!authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [authStatus, navigate, authentication]);
  return loader ? <h1>Loading...</h1> : <>{children}</>;
}
