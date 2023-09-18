import { useState, useEffect } from "react";
import io from "socket.io-client";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const TextEditor = () => {
  const [text, setText] = useState("");
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quillServer.disable();
    quillServer.setText("Loading the document...");
    setQuill(quillServer);
  }, []);

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
    <div className="bg-gray-100 h-screen p-4">
      <div className="bg-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Real-Time Text Editor</h1>
        <textarea
          id="container"
          className="w-full p-2 border rounded-md resize-none"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={10}
          placeholder="Start typing here..."
        />
      </div>
    </div>
  );
};

export default TextEditor;
