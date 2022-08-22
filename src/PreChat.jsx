import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const PreChat = () => {
  const [user, setUser] = useState({ name: "" });
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate("/chat");
    localStorage.setItem("user", user?.name);
    localStorage.setItem('isAuthenticated',true)
  };

  useEffect(()=>{
    socket.on("me", (id) => {
      localStorage.setItem("socketId", id);
    });
  },[])
  return (
    <div>
      <input
        type="text"
        className="createRoom_Name"
        placeholder="Your name..."
        onChange={(e) => {
          setUser({ ...user, name: e.target.value });
        }}
      />
      <button
        className="btn"
        disabled={!user?.name?.trim().length}
        onClick={() => handleStartChat()}
      >
        Start chatting
      </button>
    </div>
  );
};

export default PreChat;
