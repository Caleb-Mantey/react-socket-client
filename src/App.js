import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("message", (data) => {
        console.log(data);
        const new_messages = messages;

        if (
          new_messages.find(
            (message) =>
              message.msg === data.msg && message.username === data.username
          )
        )
          return;

        new_messages.push(data);

        setMessages(() => [...new_messages]);
      });
      console.log(socket.connected); // true
    });

    // return () => {
    //   socket.on("disconnect", () => {
    //     console.log(socket.connected); // false
    //   });
    // };
  }, []);

  return (
    <div className="App">
      <div style={{ border: "1px solid red", padding: 40 }}>
        <h4>Username</h4>
        <div>
          <input
            name="username"
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
          />
        </div>
        <h4>Message</h4>
        <div>
          <input
            name="message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
          />
          <br />
          <br />
          <button
            onClick={() => {
              if (message === "" || name === "") {
                return;
              }
              socket.emit("message", {
                msg: message,
                username: name,
              });
            }}
          >
            Send
          </button>
        </div>
      </div>
      <div style={{ border: "1px solid blue", padding: 40 }}>
        <h3 style={{ margin: 0 }}>Messages</h3>
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <h5>{message.username}</h5>
              <p> {message.msg}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
