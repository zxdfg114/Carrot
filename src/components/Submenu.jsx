import React from "react";
import { useNavigate } from "react-router-dom";

const SubMenu = (props) => {
  const navigate = useNavigate();
  return (
    <ul className="sub">
      <li
        onClick={() => {
          props.setSub(false);
        }}
      >
        <i className="fa fa-close fa-3x"></i>
      </li>
      <li
        onClick={() => {
          navigate("/");
          props.setSub(false);
        }}
      >
        중고 거래
      </li>
      {props.loggedIn ? (
        <>
          <li
            onClick={() => {
              navigate("/upload");
              props.setSub(false);
            }}
          >
            업로드
          </li>
          <li
            onClick={() => {
              navigate(`/chat/${props.uid}`);
              props.setSub(false);
            }}
          >
            채팅
          </li>
        </>
      ) : (
        <li
          onClick={() => {
            navigate("/signin");
          }}
        >
          로그인시 확인 가능합니다
        </li>
      )}
    </ul>
  );
};

export default SubMenu;
