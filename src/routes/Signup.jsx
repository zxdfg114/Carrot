import React from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

const Signup = (props) => {
  const navigate = useNavigate();
  const user = firebase.auth().currentUser;
  // console.log(user);

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

          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
              result.user
                .updateProfile({ displayName: e.target[2].value })
                .then((result) => {
                  props.setUser(e.target[2].value);
                  navigate("/");
                });
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
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default Signup;
