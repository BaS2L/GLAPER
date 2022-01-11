import React, { useState, useEffect } from "react";
import "../../css/Comment.css";
import { firebaseInstance, db, authService } from "../../firebase";
import { Avatar } from "@material-ui/core";
import CommentsList from "./CommentsList";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Comment = ({ feedObj, userObj }) => {
  const [commentVelue, setCommentVelue] = useState("");
  const [comments, setComments] = useState([]);
  useEffect(() => {
    db.collection("comments")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const commentArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(commentArray);
      });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (commentVelue === "") {
      return;
    }
    const commentObj = {
      text: commentVelue,
      createdAt: firebaseInstance.firestore.FieldValue.serverTimestamp(),
      creatorId: userObj.uid,
      creatorPic: authService.currentUser.photoURL,
      username: userObj.displayName,
      feedID: feedObj.id,
      like: 0,
    };
    await db.collection("comments").add(commentObj);
    await db.doc(`feeds/${feedObj.id}`).update({
      commentCount: feedObj.commentCount + 1,
    });
    setCommentVelue("");
  };

  const handleClick = (event) => {
    const {
      target: { value },
    } = event;
    setCommentVelue(value);
  };

  return (
    <div>
      <div className="list">
        {comments.map((commentObj) => (
          <CommentsList
            feedObj={feedObj}
            userObj={userObj}
            key={commentObj.id}
            commentObj={commentObj}
            isOwner={commentObj.creatorId === userObj.uid}
            feedID={commentObj.feedID === feedObj.id}
          />
        ))}
      </div>
      <form className="comment_form" onSubmit={onSubmit}>
        <div className="user">
          <Avatar src={authService.currentUser.photoURL} />
        </div>
        <div className="comment">
          <input
            className="commentInput"
            type="text"
            onChange={handleClick}
            value={commentVelue}
          />
          <label className="commentLabel">
            {userObj.displayName}님, 댓글을 남겨보세요!
          </label>
          <ArrowForwardIosIcon className="commentSubmit" onClick={onSubmit} />
        </div>
      </form>
    </div>
  );
};

export default Comment;
