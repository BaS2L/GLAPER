import React, { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { authService, db } from "../../firebase";
import "../../css/feedHover.css";

function CommentLike({ commentObj }) {
  const likeObj = {
    liker: authService.currentUser.uid,
    state: true,
  };

  const userId = authService.currentUser.uid;

  const likeRef = db
    .collection(`comments/${commentObj.id}/likes`)
    .where("liker", "==", `${likeObj.liker}`);

  const [LikeAction, setLikeAction] = useState(false);

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
    await db.doc(`comments/${commentObj.id}`).update({
      like: commentObj.like + 1,
    });
    await db.collection(`comments/${commentObj.id}/likes`).add(likeObj);
  };
  const unLike = async (event) => {
    await db.doc(`comments/${commentObj.id}`).update({
      like: commentObj.like - 1,
    });
    await likeRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
        setLikeAction(false);
      });
    });
  };

  const toggleLike = () => setLikeAction((prev) => !prev);

  return (
    <div>
      <span onClick={toggleLike}>
        <>
          {LikeAction ? (
            <div onClick={unLike}>
              <span style={{ cursor: "pointer" }}>{commentObj.like}</span>
              <FavoriteIcon
                className="commentLike"
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div onClick={onLike}>
              <span style={{ cursor: "pointer" }}>{commentObj.like}</span>
              <FavoriteBorderIcon
                className="commentLike"
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
        </>
      </span>
    </div>
  );
}

export default CommentLike;
