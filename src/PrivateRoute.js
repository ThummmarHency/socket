import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const PrivateRoute = (props) => {
  let Com = props.Com;
  let naviGate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
        naviGate("./");
        return
    } else{
        return true
    }
  }, []);
//   return <div>{<Com />}</div>;
};

export default PrivateRoute;
