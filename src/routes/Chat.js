import React, { useEffect, useState, useRef } from "react";
import { ChatEngine } from "react-chat-engine";
import "../css/Chat.css";
import ChatFeed from "../components/Chat/ChatFeed";
import axios from "axios";
import { authService } from "../firebase";
import Navigation from "../components/Navigation";

const ID = "631facb9-313d-4ab4-b8a8-d0776df71189";
const SECRET = "b3d4e86b-5b7c-420b-a223-9a4aaecac375";

const Chat = ({ userObj }) => {
  const [loading, setLoading] = useState(true);

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();

    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };
  useEffect(() => {
    axios
      .get("https://api.chatengine.io/users/me/", {
        headers: {
          "project-id": "631facb9-313d-4ab4-b8a8-d0776df71189",
          "user-name": authService.currentUser.email,
          "user-secret": authService.currentUser.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        let formdata = new FormData();
        formdata.append("email", authService.currentUser.email);
        formdata.append("username", authService.currentUser.email);
        formdata.append("secret", authService.currentUser.uid);

        // getFile(authService.currentUser.photoURL).then((avatar) => {
        //   formdata.append("avatar", avatar, avatar.name);

        axios
          .post("https://api.chatengine.io/users/", formdata, {
            headers: {
              "private-key": "b3d4e86b-5b7c-420b-a223-9a4aaecac375",
            },
          })
          .then(() => setLoading(false))
          .catch((error) => console.log(error));
      });
  });
  // });
  return (
    <main className="chatMain">
      <div className="sec">
        <div className="nav">
          <Navigation userObj={userObj} />
        </div>
        <div className="chat-form">
          <ChatEngine
            height="calc(100vh - 60px)"
            projectID={ID}
            userName={authService.currentUser.email}
            userSecret={authService.currentUser.uid}
            renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
            onNewMessage={() =>
              new Audio(
                "https://chat-engine-assets.s3.amazonaws.com/click.mp3"
              ).play()
            }
          />
        </div>
      </div>
    </main>
  );
};

export default Chat;
