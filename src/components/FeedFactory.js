import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { firebaseInstance, storageService, db, authService } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import { message } from "antd";
import "../css/FeedFactory.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FeedFactory = ({ userObj }) => {
  const name = userObj.displayName;
  const [feed, setFeed] = useState("");
  const [attachment, setAttachment] = useState("");
  const [openImg, setOpenImg] = useState(false);
  const [openMov, setOpenMov] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault();
    if (feed === "") {
      return;
    }
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const feedObj = {
      text: feed,
      createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp(),
      creatorId: userObj.uid,
      creatorPic: authService.currentUser.photoURL,
      attachmentUrl,
      username: userObj.displayName,
      like: 0,
      commentCount: 0,
      image: openImg,
      movie: openMov,
    };
    await db.collection("feeds").add(feedObj);
    setFeed("");
    setAttachment("");
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFeed(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    if (files && files[0].size > 50 * 1024 * 1024) {
      message.error("파일 사이즈가 50mb 를 넘습니다.");
    }
    if (Boolean(theFile)) {
      reader.readAsDataURL(theFile);
    }
    if (theFile.type[0] === "i") {
      setOpenImg(true);
      setOpenMov(false);
    }
    if (theFile.type[0] === "v") {
      setOpenMov(true);
      setOpenImg(false);
    }
  };

  const onClearAttachment = () => {
    setAttachment("");
    setOpenImg(false);
    setOpenMov(false);
  };
  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <Avatar src={authService.currentUser.photoURL} />
        <input
          className="factoryInput__feed"
          value={feed}
          onChange={onChange}
          type="text"
          required
        />
        <label className="factoryInput__label">
          {name}님, 무슨 생각을 하고 계신가요?
        </label>
        <ArrowForwardIosIcon className="feedSubmit" onClick={onSubmit} />
      </div>
      <div className="add">
        <label for="attach-file" className="mediaInput">
          <AddPhotoAlternateIcon />
          <span>사진/동영상</span>
        </label>
      </div>
      <input
        id="attach-file"
        type="file"
        accept="image/*,video/*"
        onChange={onFileChange}
        multiple
        style={{
          visibility: "hidden",
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          {openImg && <img src={attachment} />}
          {openMov && (
            <video
              src={attachment}
              controls="controls"
              controlsList="nodownload"
            />
          )}
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>제거</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default FeedFactory;
