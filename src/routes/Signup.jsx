import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";
import firebase from "firebase/app";
import Button from "@mui/material/Button";
import "firebase/auth";
import { useState } from "react";

const Signup = (props) => {
  const [fail, setFail] = useState(false);
  const [fade, setFade] = useState("");
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>회원가입</h1>
      <form
        id="register"
        action=""
        method="POST"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          const email = e.target[0].value;
          const password = e.target[1].value;
          const username = e.target[2].value;

          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
              result.user.updateProfile({ displayName: e.target[2].value });

              db.collection("user")
                .doc(result.user.uid)
                .set({
                  name: username,
                  uid: result.user.uid,
                  email: email,
                })
                .then(() => {
                  props.setUser(username);
                });
            })
            .then((resolve) => {
              navigate("/");
              setNotice(null);
              setFail(false);
            })
            .catch((error) => {
              console.log(error);
              setFail(true);
              setTimeout(() => {
                setFade("fade-in");
              }, 100);
              setNotice(error.message);
            });
        }}
      >
        <label htmlFor="title">이메일</label>
        <input type="text" placeholder="이메일을 입력해주세요" />
        <label htmlFor="price">비밀번호</label>
        <input
          type="password"
          autoComplete="chrome-off"
          // name="price"
          placeholder="비밀번호를 입력해주세요"
          minLength="6"
          // required
        />
        <label htmlFor="username">이름</label>
        <input
          type="text"
          name="name"
          placeholder="이름을 입력해주세요"
          autoComplete="chrome-off"
          // required
        />
        {fail && <span className={`login-failed ${fade}`}>{notice}</span>}
        <Button variant="contained" color="warning" type="submit">
          가입하기
        </Button>
      </form>
    </div>
  );
};

export default Signup;
