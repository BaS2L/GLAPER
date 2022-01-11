import React, { useState } from "react";
import { authService, firebaseInstance } from "../firebase";
import g_ico from "../Assets/google.svg";
import { Modal } from "antd";

const inputStyles = {};

const AuthForm = () => {
  //* State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  //* State

  //* modal
  function not_found() {
    Modal.error({
      title: "로그인 오류",
      content: "ID 혹은 비밀번호를 잘못 입력하셨거나 등록되지 않은 ID 입니다.",
    });
  }

  function weak_pw() {
    Modal.error({
      title: "로그인 오류",
      content: "비밀번호는 6자리 이상입니다.",
    });
  }

  function email_already() {
    Modal.error({
      title: "회원가입 오류",
      content: "이미 존재하는 이메일 입니다.",
    });
  }
  //* modal

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (newAccount === true) {
        await authService
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
            authService.currentUser.sendEmailVerification();
          })
          .catch((error) => {
            if (error.code === "auth/email-already-in-use") {
              setError("이미 존재하는 이메일 입니다.");
            }
          });
      } else {
        await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setError(
          "ID 혹은 비밀번호를 잘못 입력하셨거나 등록되지 않은 ID 입니다."
        );
      } else if (error.code === "auth/weak-password") {
        setError("비밀번호는 6자리 이상입니다.");
      }
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  const socialLogin = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <div className="head">
          <h1>{newAccount ? "회원가입" : "로그인"}</h1>
          {error && (
            <div className="err">
              <span className="authError">{error}</span>
            </div>
          )}
        </div>

        <div className="signInput" onChange={onChange}>
          <input name="email" type="text" required value={email} />
          <span />
          <label>이메일</label>
        </div>
        <div className="signInput" onChange={onChange}>
          <input name="password" type="password" required value={password} />
          <span />
          <label>비밀번호</label>
        </div>
        <input
          type="submit"
          className="login_submit"
          value={newAccount ? "회원가입" : "로그인"}
        />
        <div className="signup_link">
          <div name="signup">
            <span onClick={toggleAccount} className="authSwitch">
              {newAccount ? "로그인" : "회원가입"}
            </span>
          </div>
        </div>
        <div className="social">
          <button type="button" onClick={socialLogin} name="google">
            <img
              className="social_login_g"
              src={g_ico}
              className="social_icon"
              name="google"
            />
            Google 로그인
          </button>
        </div>
      </form>
    </>
  );
};
export default AuthForm;
