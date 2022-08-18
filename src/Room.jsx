import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import img from "./image/dance.jpeg";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");
const user = localStorage.getItem("user");

const Room = () => {
  const [socketId, setSocketId] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [room, setRoom] = useState("");
  const [chat, setChat] = useState([]);
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    joinedRoom && navigate("/chat", { state: { joinedRoom, room } });
  }, [joinedRoom, room, navigate]);

  const createRoom = () => {
    socket.emit("create_room", roomName);
    socket.on("get_room", (room) => {
      setRooms([...rooms, room]);
    });
  };

  const joinRoom = (room) => {
    socket.emit("join_room", room);
    setRoom(room.id);
    setJoinedRoom(true);
    setChat(room.chat);
  };

  return (
    <div>
      <h1 className="main_heading">Chat App</h1>
      <h1 className="my_socket">Me: {user}</h1>
      <h3 className="roomjoined">{joinedRoom && `Room: ${room}`}</h3>

      {!joinedRoom && (
        <div className="container">
          <div className="users-container">
            <h2 className="users_heading">Online Users:</h2>
            <ul className="users">
              {users.map((user) => {
                return (
                  <li className="user" key={user}>
                    {user && user === socketId ? `*ME*` : user}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rooms-container">
            <h2 className="rooms_heading">Available Rooms:</h2>

            {!rooms.length ? (
              <h3 className="no_rooms">No Rooms! Create a room !</h3>
            ) : (
              <ul className="rooms">
                {rooms.map((room) => {
                  return (
                    <li key={room.id} onClick={() => joinRoom(room)}>
                      {room.id}
                    </li>
                  );
                })}
              </ul>
            )}
            <div>
              <input
                type="text"
                className="createRoom_Name"
                placeholder="Room name..."
                onChange={(e) => {
                  setRoomName(e.target.value);
                }}
              />
            </div>
            <div className="btn-container">
              <button
                className="btn"
                onClick={() => createRoom()}
                disabled={!roomName.trim().length}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;
