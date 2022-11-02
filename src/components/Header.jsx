import React from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import SubMenu from "./Submenu";

const Header = (props) => {
  const navigate = useNavigate();
  return (
    <header>
      <h1
        onClick={() => {
          navigate("/");
        }}
      >
        FAKE
      </h1>
      <ul className="gnb">
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

        {/* 로그인 상태에 따라 로그인 로그아웃 변경 */}
      </ul>
      <ul className="user">
        {props.user === null ? (
          <span
            onClick={() => {
              navigate("/signin");
            }}
          >
            로그인이 필요합니다
          </span>
        ) : (
          <span>{`${props.user}`}</span>
        )}
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
                })
                .then(() => {
                  navigate("/");
                });
            }}
          >
            로그아웃
          </li>
        )}
        {!props.loggedIn && (
          <li
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입
          </li>
        )}
      </ul>
      <i className="fa fa-bars fa-2x"></i>
    </header>
  );
};

export default Header;
