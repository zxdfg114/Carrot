import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import { useSelector } from "react-redux";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import MenuIcon from "@mui/icons-material/Menu";

import AccountCircle from "@mui/icons-material/AccountCircle";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import SubMenu from "./Submenu";
import firebase from "firebase/app";
import Badge from "@mui/material/Badge";
import { red } from "@mui/material/colors";

import "firebase/auth";

export default function Header(props) {
  const color = red[0];
  const navigate = useNavigate();
  const [sub, setSub] = useState(false);
  const state = useSelector((state) => state);
  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        style={{ backgroundColor: "#fff" }}
      >
        <Toolbar
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="warning"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setSub(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          {sub && (
            <SubMenu
              setSub={setSub}
              loggedIn={props.loggedIn}
              uid={state.userUid}
            />
          )}
          <div
            id="logo"
            onClick={() => {
              navigate("/");
            }}
          >
            <img src={process.env.PUBLIC_URL + "/image/logo.png"} alt="" />
            <h3>당근마켓</h3>
          </div>

          {/* 로그인 상태에 따라 로그인 로그아웃 변경 */}
          <div className="user">
            {props.user === null ? null : (
              <>
                <Tooltip
                  title={
                    props.logginedUser?.message
                      ? "새 메시지가 있습니다"
                      : "채팅하기"
                  }
                  placement="bottom"
                >
                  <IconButton
                    size="large"
                    edge="start"
                    color="warning"
                    sx={{ mr: 2 }}
                    onClick={() => {
                      setSub(true);
                    }}
                  >
                    {" "}
                    <Badge
                      badgeContent={props.logginedUser?.message ? "!" : null}
                      color="error"
                      className="mail"
                    >
                      <MailOutlinedIcon
                        variant="h2"
                        color="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/chat/${state.userUid}`);
                        }}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="caption"
                  className="user-name"
                  component="div"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <AccountCircle color="primary" />
                  <span className="user-name"> {`${props.user}`}</span>
                </Typography>
              </>
            )}

            {!props.loggedIn && (
              <>
                <Tooltip title="로그인이 필요합니다" placement="bottom">
                  <Button
                    color="warning"
                    onClick={() => {
                      navigate("/signin");
                      setSub(false);
                    }}
                  >
                    Login
                  </Button>
                </Tooltip>
                <Tooltip title="회원가입" placement="bottom">
                  <Button
                    color="warning"
                    onClick={() => {
                      navigate("/signup");
                      setSub(false);
                    }}
                  >
                    SignUP
                  </Button>
                </Tooltip>
              </>
            )}
            {props.loggedIn && (
              <Tooltip title="로그아웃" placement="bottom">
                <Button
                  color="warning"
                  onClick={() => {
                    firebase
                      .auth()
                      .signOut()
                      .then(() => {
                        localStorage.setItem("watched", JSON.stringify([]));
                        props.setUser(null);
                      })
                      .then(() => {
                        navigate("/");
                        setSub(false);
                      });
                  }}
                >
                  LogOUT
                </Button>
              </Tooltip>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
}
