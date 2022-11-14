import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const SignIn = (props) => {
  const [fail, setFail] = useState(false);
  const [fade, setFade] = useState("");
  const [notice, setNotice] = useState(null);
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
              setFail(true);
              setNotice(error.message);
              setTimeout(() => {
                setFade("fade-in");
              }, 100);
            });
        }}
      >
        <label htmlFor="title">이메일</label>
        <input
          type="text"
          placeholder="이메일을 입력해주세요"
          defaultValue={"guest@guest.com"}
        />
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          autoComplete="off"
          placeholder="비밀번호를 입력해주세요"
          minLength="6"
          defaultValue={123456}
          required
        />
        <small
          onClick={() => {
            navigate("/signup");
          }}
        >
          아직 회원이 아니신가요? - 5초만에 회원가입하기
        </small>
        {fail && <span className={`login-failed ${fade}`}>{notice}</span>}
        <Button variant="contained" color="warning" type="submit">
          로그인
        </Button>
      </form>
    </div>
  );
};

export default SignIn;
