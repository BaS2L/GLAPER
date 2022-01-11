import React, { useState, useEffect } from "react";
import { authService, db } from "../firebase";
import { useHistory } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Tooltip, Modal } from "antd";
import "../css/Profile.css";
import { Avatar } from "@material-ui/core";
import Navigation from "../components/Navigation";
import Feed from "../components/Feed";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";

export default ({ refreshUser, userObj, feedObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(userObj.photoURL);
  const [feeds, setFeeds] = useState([]);
  const [LikeAction, setLikeAction] = useState();
  const userName = userObj.displayName;

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      if (newDisplayName === "Admin") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else if (newDisplayName === "ADMIN") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else if (newDisplayName === "admin") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else if (newDisplayName === "운영자") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else if (newDisplayName === "GM") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else if (newDisplayName === "관리자") {
        alert("이 닉네임은 사용 할 수 없습니다.");
      } else {
        await userObj.updateProfile({
          displayName: newDisplayName,
        });
      }
      refreshUser();
    }
  };

  function deleteUser() {
    authService.currentUser.delete().then(() => {
      Modal.success({
        title: "회원탈퇴가 완료되었습니다.",
        content: "이용해 주셔서 감사합니다.",
      });
      history.push("/");
    });
  }

  const changeProfic = async (event) => {
    authService.currentUser.updateProfile({
      photoURL: newProfilePic,
    });
  };

  const current = decodeURI(window.location.href); //*현재 페이지 주소를 가져와서
  const who = current.split("?")[1]; //* ?부터 끝까지의 주소를 가져온다
  const isOwner = who === authService.currentUser.uid;

  useEffect(() => {
    db.collection("feeds")
      .where("creatorId", "==", `${who}`)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const feedArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeeds(feedArray);
      });
  }, []);

  return (
    <main className="Profilemain">
      <div className="sec">
        <div className="nav">
          <Navigation userObj={userObj} />
        </div>
        <div className="profilesec">
          <Tooltip placement="bottom" color="red" title="로그아웃">
            <div className="logout" onClick={onLogOutClick}>
              <CloseIcon style={{ color: "red" }} />
            </div>
          </Tooltip>
          {isOwner ? (
            <form onSubmit={onSubmit} className="profileForm">
              <div className="profile__container">
                <Avatar
                  src={authService.currentUser.photoURL}
                  className="avatarPic"
                  onClick={changeProfic}
                />
                <input
                  onChange={onChange}
                  type="text"
                  value={newDisplayName}
                  className="profileInput"
                  required
                />
                <label className="profileInput__label">
                  {userName}님, 닉네임을 바꿔보세요!
                </label>
                <ChangeCircleOutlinedIcon
                  className="profileSubmit"
                  onClick={onSubmit}
                />
              </div>
              {/* <span
                className="formBtn cancelBtn logOut"
                onClick={onLogOutClick}
              >
                로그아웃
              </span>
              <span className="formBtn" onClick={deleteUser}>
                회원탈퇴
              </span> */}
            </form>
          ) : (
            // <div className="profilecard">
            //   <div className="profilecard_top"></div>
            //   <div className="profilecard_bottom"></div>
            // </div>
            ""
          )}
          <div className="myFeed">
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
