import React, { useState, useEffect } from "react";
import { authService, db } from "../../firebase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Like({ feedObj, likeObj }) {
  const uid = authService.currentUser.uid;
  const likeRef = db
    .collection(`feeds/${feedObj.id}/likes`)
    .where("liker", "==", `${uid}`);

  const [LikeAction, setLikeAction] = useState();

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
    await db.collection(`feeds/${feedObj.id}/likes`).add(likeObj);
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

  return (
    <div>
      <span>
        <>
          {LikeAction ? (
            <div onClick={unLike}>
              {feedObj.like > 0 && (
                <span style={{ cursor: "pointer" }}>{feedObj.like}</span>
              )}
              <FavoriteIcon
                style={{
                  color: "#2D88FF",
                  cursor: "pointer",
                  fontSize: "large",
                }}
              />
            </div>
          ) : (
            <div onClick={onLike}>
              {feedObj.like > 0 && (
                <span style={{ cursor: "pointer" }}>{feedObj.like}</span>
              )}
              <FavoriteBorderIcon
                style={{
                  color: "#2D88FF",
                  cursor: "pointer",
                  fontSize: "large",
                }}
              />
            </div>
          )}
        </>
      </span>
    </div>
  );
}

export default Like;
