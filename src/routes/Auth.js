import React, { useState, useEffect } from "react";
import { authService, firebaseInstance, db, storageService } from "../firebase";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import g_ico from "../Assets/google.svg";
import "../css/Auth.css";
import "../css/bgEffect.css";
import AuthForm from "../components/AuthForm";
import { Modal } from "antd";

function Auth() {
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="auth">
      <div className="auth_main">
        <div className="auth_left">
          <div className="auth_logo">
            <span>GLAPER</span>
          </div>
        </div>
        <div className="auth_right">
          <div className="login">
            <AuthForm />
          </div>
        </div>
        <div className="circle">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle3"></div>
          <div className="circle4"></div>
          <div className="circle5"></div>
        </div>
      </div>
      <div className="auth_bottom">
        <div className="themeSel" onClick={showModal}>
          <ColorLensIcon /> 테마를 지정해 보세요!
        </div>
        <Modal
          title="Theme Selector"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>공사중!!!</p>
        </Modal>
      </div>
    </div>
  );
}
export default Auth;
