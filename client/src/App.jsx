// import React from "react";
import Login from "./component/Login";
import Dashboard from "./component/Dashboard";

const code = new URLSearchParams(window.location.search).get("code");
const App = () => {

  return <>{code ? <Dashboard code={code} /> : <Login />}</>;
};

export default App;
