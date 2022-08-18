import React from "react";
import "./App.css";
import Chat from "./Chat";
import PreChat from "./PreChat";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Room from "./Room";

function App() {
  return (
    <Routes>
      <Route path="/" exact element={<PreChat/>}/>
      <Route path="/chat" exact element={<Chat/>}/>
      {/* <Route path="/room" exact element={<Room/>}/> */}
    </Routes>

  );
}

export default App;
