import { useState, useEffect } from "react";
import io from "socket.io-client";

const TextEditor = () => {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.io server (replace 'server-url' with your server's URL)
    const socket = io("http://localhost:5000");
    setSocket(socket);

    // Listen for 'text-edited' events and update the text accordingly
    socket.on("text-edited", (data) => {
      setText(data.editedText);
    });

    return () => {
      // Disconnect the socket when the component unmounts
      socket.disconnect();
    };
  }, []);

  const handleTextChange = (newText) => {
    // Update the text and emit a 'text-edit' event to the server
    setText(newText);
    socket.emit("text-edit", { editedText: newText });
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => handleTextChange(e.target.value)}
        rows={10}
        cols={40}
      />
    </div>
  );
};

export default TextEditor;
