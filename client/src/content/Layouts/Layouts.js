import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function Layouts({ children }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/forgotpassword" ||
      location.pathname === "/Messages" ||
      location.pathname === "/EditProfile" ||
      location.pathname.startsWith("/resetpassword")
    ) {
      setShowSidebar(false);
      setShowFooter(false);
    } else {
      setShowSidebar(true);
      setShowFooter(true);
    }
  }, [location]);
  return (
  <div>
    {showSidebar && children}
    
  {showFooter}
    </div>
  );
}

export default Layouts;