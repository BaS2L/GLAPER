import React, { useState, useEffect } from "react";
import { authService, db } from "../firebase";
import { useHistory } from "react-router-dom";
import Feed from "../components/Feed";
import FeedFactory from "../components/FeedFactory";
import "../css/Home.css";
import Navigation from "../components/Navigation";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, Modal } from "antd";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
const Home = ({ userObj }) => {
  const [feeds, setFeeds] = useState([]);
  const { confirm } = Modal;
  const history = useHistory();

  useEffect(() => {
    db.collection("feeds")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const feedArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeeds(feedArray);
      });
  }, []);

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };

  function logoutConfirm() {
    confirm({
      title: "로그아웃",
      icon: <ErrorOutlineIcon style={{ color: "red" }} />,
      content: "정말 로그아웃 하시겠습니까?",
      okType: "danger",
      onOk() {
        onLogOutClick();
      },
    });
  }

  return (
    <main className="HomeMain">
      <div className="sec">
        <div className="nav">
          <Navigation userObj={userObj} />
        </div>
        <div className="feedsec">
          <Tooltip placement="bottom" color="red" title="로그아웃">
            <div className="logout" onClick={logoutConfirm}>
              <CloseIcon style={{ color: "red" }} />
            </div>
          </Tooltip>
          <FeedFactory userObj={userObj} />
          <div>
            {feeds.map((feed) => (
              <Feed
                userObj={userObj}
                key={feed.id}
                feedObj={feed}
                isOwner={feed.creatorId === userObj.uid}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;
