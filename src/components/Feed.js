import React, { useEffect, useState } from "react";
import { authService, db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@material-ui/core";
import Comment from "./Comment/Comment";
import Like from "./Like/Like";
import { Popconfirm, notification } from "antd";
import confirm from "antd/lib/modal/confirm";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import "moment/locale/ko";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "../css/Feed.css";
import "../css/feedHover.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Feed = ({ feedObj, userObj, isOwner, commentObj }) => {
  const feeddate = new Date(feedObj.createdAt?.toDate()).toUTCString();
  const [editing, setEditing] = useState(false);
  const [newFeed, setNewFeed] = useState(feedObj.text);
  const [OpenComment, setOpenComment] = useState(false);
  const [OpenImg, setOpenImg] = useState(feedObj.image);
  const [OpenMov, setOpenMov] = useState(feedObj.movie);
  const [LikeAction, setLikeAction] = useState();
  const [showActions, setShowActions] = useState(false);

  const openComment = () => {
    setOpenComment(!OpenComment);
  };
  const actions = [
    <div onClick={openComment} key="comment-basic-reply-to">
      <ChatBubbleOutlineIcon />
      {feedObj.commentCount > 0 ? `댓글 ${feedObj.commentCount} 개` : "댓글"}
    </div>,
  ];

  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await db
      .doc(`feeds/${feedObj.id}`)
      .update({
        text: newFeed,
      })
      .then(() => {
        notification.success({
          message: "수정 완료",
        });
      });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewFeed(value);
  };

  const feed_del_confirm = (placement) => {
    db.doc(`feeds/${feedObj.id}`)
      .delete()
      .then(() => {
        notification.success({
          message: "Feed를 삭제했습니다.",
          placement,
        });
      });
  };

  const onDeleteClick = async () => {
    confirm({
      title: "댓글을 삭제합니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        db.doc(`feeds/${feedObj.id}`).delete();
      },
    });
  };

  const uid = authService.currentUser.uid;
  const likeRef = db
    .collection(`feeds/${feedObj.id}/likes`)
    .where("liker", "==", `${uid}`);
  useEffect(() =>
    likeRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.exists) {
          setLikeAction(true);
        }
      });
    })
  );
  const onLike = async (event) => {
    await db.doc(`feeds/${feedObj.id}`).update({
      like: feedObj.like + 1,
    });
    await db.collection(`feeds/${feedObj.id}/likes`).add({
      liker: authService.currentUser.uid,
      state: true,
    });
  };
  const unLike = async (event) => {
    await db.doc(`feeds/${feedObj.id}`).update({
      like: feedObj.like - 1,
    });
    await likeRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
        setLikeAction(false);
      });
    });
  };

  const onShow = (event) => {
    setShowActions(!showActions);
  };

  return (
    <div className="feed">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="feedEdit">
            <div style={{ display: "flex" }}>
              <input
                type="text"
                value={newFeed}
                required
                onChange={onChange}
                className="feedEditInput"
              />
              <label className="feedEditInputLabel">Feed를 수정해보세요</label>
              <input type="submit" value="수정" className="feedEditSubmit" />
              <span onClick={toggleEditing} className="feedEditCancel">
                취소
              </span>
            </div>
          </form>
        </>
      ) : (
        <>
          <div className="feedinfo">
            <div className="feedinfoLeft">
              <Link to={`/profile?${feedObj.creatorId}`}>
                <Avatar src={feedObj.creatorPic} />
              </Link>
              <div className="userinfo">
                <h3 className="feed_user_name">{feedObj.username}</h3>
                <p className="timedata">
                  <Moment fromNow interval={1000}>
                    {feeddate}
                  </Moment>
                </p>
              </div>
            </div>
            <div className="feedinfoRight">
              {isOwner && (
                <div class="feed__actions">
                  <MoreHorizIcon onClick={onShow} />
                  {showActions ? (
                    <div className="actions">
                      <span onClick={onDeleteClick}>
                        <FontAwesomeIcon className="del" icon={faTrash} />
                        삭제하기
                      </span>
                      <span onClick={toggleEditing}>
                        <FontAwesomeIcon className="tnwjd" icon={faPencilAlt} />
                        수정하기
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
          <h4>{feedObj.text}</h4>
          <div className="media">
            {OpenImg && <img src={feedObj.attachmentUrl} />}
            <br />
            {OpenMov && (
              <video
                src={feedObj.attachmentUrl}
                controls="controls"
                controlsList="nodownload"
              />
            )}
          </div>
        </>
      )}
      <div className="feed_btn">
        <>
          {LikeAction ? (
            <div className="likesec" onClick={unLike}>
              <FavoriteIcon className="likesecIcon" />
              좋아요 {feedObj.like}개
            </div>
          ) : (
            <div className="likesec" onClick={onLike}>
              <FavoriteBorderIcon className="likesecIcon" />
              좋아요 {feedObj.like}개
            </div>
          )}
        </>
        <div className="commentsec">{actions}</div>
      </div>
      {OpenComment && (
        <div className="commentSection">
          <Comment
            userObj={userObj}
            feedObj={feedObj}
            commentObj={commentObj}
          />
        </div>
      )}
    </div>
  );
};

export default Feed;
