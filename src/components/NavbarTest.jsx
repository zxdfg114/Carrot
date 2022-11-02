import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import SubMenu from "./Submenu";
import firebase from "firebase/app";
import "firebase/auth";

export default function ButtonAppBar(props) {
  const navigate = useNavigate();
  const [sub, setSub] = useState(false);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
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
              uid={props.uid}
            />
          )}
          <Typography
            variant="h2"
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => {
              navigate("/");
            }}
          >
            FAKE
          </Typography>
          {/* <ul className="gnb">
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

          </ul> */}
          {/* 로그인 상태에 따라 로그인 로그아웃 변경 */}
          <ul className="user">
            {props.user === null ? null : (
              <Typography
                variant="h7"
                component="div"
                sx={{ flexGrow: 1 }}
                onClick={() => {
                  navigate("/");
                }}
              >
                <AccountCircle />
                {`${props.user}`}
              </Typography>
            )}
          </ul>
          {!props.loggedIn && (
            <>
              <span
                className="login-required"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                로그인이 필요합니다
              </span>
              <Button
                color="inherit"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  navigate("/signup");
                }}
              >
                SignUP
              </Button>
            </>
          )}
          {props.loggedIn && (
            <Button
              color="inherit"
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
              LogOUT
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
