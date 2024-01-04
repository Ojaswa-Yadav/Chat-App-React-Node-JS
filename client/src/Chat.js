import React, { useEffect, useState } from "react"; // Importing React hooks
import ScrollToBottom from "react-scroll-to-bottom"; // Importing a component to keep the chat scrolled to the bottom

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState(""); // State for the current message input
  const [messageList, setMessageList] = useState([]); // State for storing all messages

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage !== "") { // Check if the message is not empty
      const messageData = { // Creating the message object
        room: room, // Current room
        author: username, // Author of the message
        message: currentMessage, // Message text
        time: // Time when the message is sent
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData); // Emitting the message to the server
      setMessageList((list) => [...list, messageData]); // Adding the message to the message list
      setCurrentMessage(""); // Clearing the message input
    }
  };

  // Hook to listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]); // Updating the message list when a new message is received
    });
  }, [socket]); // Dependency array with socket to re-run the effect when socket changes

  // Rendering the chat component
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        {/* Automatically scrolling to the bottom as new messages arrive */}
        <ScrollToBottom className="message-container">
          {/* Mapping through each message in the message list */}
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {/* Input field for typing a message */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value); // Updating the current message state on change
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage(); // Sending the message when Enter key is pressed
          }}
        />
        {/* Button to send the message */}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat; // Exporting the Chat component
