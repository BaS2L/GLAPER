import React from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import { Avatar } from "@material-ui/core";
import "../css/Navigation.css";
import { ChatBubble } from "@material-ui/icons";
import { authService } from "../firebase";
const Navigation = ({ userObj }) => (
  <div className="navigation">
    <div className="profile">
      <Link to={`/profile?${authService.currentUser.uid}`}>
        <Avatar
          src={authService.currentUser.photoURL}
          style={{ marginLeft: "40%" }}
        />
        <h2>{userObj.displayName ? `${userObj.displayName}` : "Profile"}</h2>
      </Link>
    </div>

    <div className="home">
      <Link to="/">
        <HomeIcon fontSize="large" className="HomeIcon" />
        <h2>Home</h2>
      </Link>
    </div>

    <div className="chat">
      <Link to="/chat">
        <ChatBubble fontSize="large" className="ChatIcon" />
        <h2>Chat</h2>
      </Link>
    </div>
  </div>
);
export default Navigation;
