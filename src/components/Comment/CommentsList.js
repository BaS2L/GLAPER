import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "../../css/CommentList.css";
import { authService, db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import confirm from "antd/lib/modal/confirm";
import { Link } from "react-router-dom";
import CommentLike from "../Like/CommentLike";
import Moment from "react-moment";
import "moment/locale/ko";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const CommentsList = ({ commentObj, userObj, isOwner, feedObj }) => {
  const user = commentObj.username;
  const text = commentObj.text;
  const commentDate = new Date(commentObj.createdAt?.toDate()).toUTCString();
  const [OpenReply, setOpenReply] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [editing, setEditing] = useState(false);
  const openReply = () => {
    setOpenReply(!OpenReply);
  };
  const actions = [
    //<span onClick={openReply} key="comment-basic-reply-to">
    // 답글쓰기
    //</span>,
  ];

  const [update, setUpdate] = useState(false);
  const [newComment, setNewComment] = useState(commentObj.text);

  const onDeleteClick = async () => {
    confirm({
      title: "댓글을 삭제합니다.",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      onOk() {
        db.doc(`feeds/${feedObj.id}`).update({
          commentCount: feedObj.commentCount - 1,
        });
        db.doc(`comments/${commentObj.id}`).delete();
      },
    });
  };
  const onUpdateClick = () => setUpdate((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await db.doc(`comments/${commentObj.id}`).update({
      text: newComment,
    });
    setUpdate(false);
  };
  const isFeed = feedObj.id === commentObj.feedID;
  const onShow = (event) => {
    setShowActions(!showActions);
  };
  const toggleEditing = () => setEditing((prev) => !prev);

  return (
    <div style={{ marginBottom: "20px" }}>
      {isFeed && (
        <div className="C_List">
          <div className="profileInfo">
            <Link
              to={`/profile?${commentObj.creatorId}`}
              commentObj={commentObj}
            >
              <Avatar src={commentObj.creatorPic} />
            </Link>
            <h1 className="CommentUser">{user}</h1>
            <h3 className="commentDate">
              <Moment fromNow interval={1000}>
                {commentDate}
              </Moment>
            </h3>
          </div>
          <div className="commentText">
            <h4>{text}</h4>
          </div>

          {isOwner && (
            <div class="comment__actions">
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
          <div className="commenntOption">
            <CommentLike commentObj={commentObj} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsList;
