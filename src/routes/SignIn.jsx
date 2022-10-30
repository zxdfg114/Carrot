import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignIn = (props) => {
  const [fail, setFail] = useState(false);
  const [fade, setFade] = useState("");
  const navigate = useNavigate();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      props.setUser(user.displayName);
    }
  });

  return (
    <div className="container">
      <h1>로그인</h1>
      <form
        action=""
        onSubmit={(e) => {
          setFade("");
          e.preventDefault();
          firebase
            .auth()
            .signInWithEmailAndPassword(e.target[0].value, e.target[1].value)
            .then((user) => {
              props.setUser(user.displayName);
              setFail(false);
              navigate("/");
            })
            .catch((error) => {
              console.error(error);
              setFail(true);
              setTimeout(() => {
                setFade("fade-in");
              }, 100);
            });
        }}
      >
        <label htmlFor="title">이메일</label>
        <input type="text" placeholder="이메일을 입력해주세요" />
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          autoComplete="off"
          placeholder="비밀번호를 입력해주세요"
          minLength="6"
          required
        />
        {fail && (
          <span className={`login-failed ${fade}`}>
            로그인에 실패하였습니다. 이메일 혹은 비밀번호를 확인해주세요
          </span>
        )}
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default SignIn;
