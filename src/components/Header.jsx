import React from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";

const Header = (props) => {
  const navigate = useNavigate();
  return (
    <header>
      <h1>LOGO</h1>
      {props.user === null ? (
        <span
          onClick={() => {
            navigate("/signin");
          }}
        >
          로그인이 필요합니다
        </span>
      ) : (
        <span>{`${props.user}님 안녕하세요!`}</span>
      )}
      <ul>
        <li
          onClick={() => {
            navigate("/");
          }}
        >
          중고거래
        </li>
        {props.loggedIn && (
          <li
            onClick={() => {
              navigate("/upload");
            }}
          >
            올리기
          </li>
        )}
        <li
          onClick={() => {
            navigate("/signup");
          }}
        >
          회원가입
        </li>
        {/* 로그인 상태에 따라 로그인 로그아웃 변경 */}
        {!props.loggedIn && (
          <li
            onClick={() => {
              navigate("/signin");
            }}
          >
            로그인
          </li>
        )}
        {props.loggedIn && (
          <li
            onClick={() => {
              firebase
                .auth()
                .signOut()
                .then(() => {
                  props.setUser(null);
                });
            }}
          >
            로그아웃
          </li>
        )}
      </ul>
    </header>
  );
};

export default Header;
