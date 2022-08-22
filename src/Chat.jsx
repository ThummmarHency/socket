import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import img from "./image/dance.jpeg";

const socket = io("http://localhost:5000");

const user = localStorage.getItem("user");
const socketId = localStorage.getItem("socketId");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [room, setRoom] = useState("");
  const [chat, setChat] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [roomName, setRoomName] = useState("");

  const onEmojiClick = (event, emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };
  const chatContainer = useRef(null);

  useEffect(() => {
    socket.on("disconnect", () => {
      socket.disconnect();
    });

    socket.on("getAllUsers", (users) => {
      setUsers(users);
    });

    socket.on("updateUsers", (users) => {
      setUsers(users);
    });

    socket.on("getAllRooms", (rooms) => {
      setRooms(rooms);
    });

    socket.on("updateRooms", (rooms) => {
      setRooms(rooms);
    });

    socket.on("chat", (payload) => {
      setChat(payload.chat);
    });

    if (joinedRoom) {
      chatContainer.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chat, rooms, users]);

  const sendMessage = async () => {
    const payload = { message, room, socketId };
    socket.emit("message", payload);
    setMessage("");
    socket.on("chat", (payloadd) => {
      setChat(payloadd.chat);
    });
    chatContainer.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setShowEmoji(false);
  };

  const createRoom = () => {
    socket.emit("create_room", roomName);
    socket.on("get_room", (room) => {
      setRooms([...rooms, room]);
    });
    setRoomName("");
  };

  const joinRoom = (room) => {
    socket.emit("join_room", room);
    setRoom(room?.id);
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
                      {room.name}
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
                value={roomName}
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

      {joinedRoom && (
        <>
          <div className="chat-container">
            <ul className="chat-list" id="chat-list" ref={chatContainer}>
              {chat?.map((chat, idx) => (
                <li
                  key={idx}
                  className={chat?.writer === socketId ? "chat-me" : "chat-user"}
                >
                  {chat?.writer === socketId ? (
                    <div>
                      {chat.message}
                      <img
                        className="dp"
                        src={img}
                        alt="Me"
                        height={30}
                        width={30}
                      />
                    </div>
                  ) : (
                    `User (${chat?.writer?.slice(0, 5)}): ${chat.message}`
                  )}
                </li>
              ))}
            </ul>
          </div>

          <form className="chat-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your message ..."
              autoFocus
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              value={message}
            />

            <button
              className="emoji_btn"
              type="button"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              Emoji
            </button>
            <button
              className="send_btn"
              type="submit"
              onClick={() => sendMessage()}
              disabled={!message?.trim()?.length}
            >
              Send
            </button>
          </form>
          {showEmoji && (
            <Picker
              onEmojiClick={onEmojiClick}
              pickerStyle={{
                width: "20%",
                display: "absolute",
                left: "0",
                bottom: "270px",
                backgroundColor: "#fff",
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
