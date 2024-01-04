// Importing required CSS and modules
import "./App.css"; // Importing CSS for styling
import io from "socket.io-client"; // Importing Socket.IO client
import { useState } from "react"; // Importing useState hook from React
import Chat from "./Chat"; // Importing Chat component

// Establishing a connection to the Socket.IO server
const socket = io.connect("http://localhost:3001"); // Connects to Socket.IO server running on localhost port 3001

function App() {
  // State management using React hooks
  const [username, setUsername] = useState(""); // State for storing username
  const [room, setRoom] = useState(""); // State for storing room ID
  const [showChat, setShowChat] = useState(false); // State to toggle chat display

  // Function to join a chat room
  const joinRoom = () => {
    if (username !== "" && room !== "") { // Checks if username and room ID are not empty
      socket.emit("join_room", room); // Emits a 'join_room' event to the server with the room ID
      setShowChat(true); // Shows the chat interface
    }
  };

  // Rendering the component
  return (
    <div className="App">
      {/* Conditional rendering based on whether the chat is shown or not */}
      {!showChat ? (
        <div className="joinChatContainer">
          {/* Container for joining a chat room */}
          <h3>Join A Chat</h3>
          {/* Input field for username */}
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value); // Updates the username state on change
            }}
          />
          {/* Input field for room ID */}
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value); // Updates the room state on change
            }}
          />
          {/* Button to join a room */}
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        // Chat component is displayed when showChat is true
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App; // Exports the App component
