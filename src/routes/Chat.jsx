import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";

const Chat = (props) => {
  let { id } = useParams();
  /**
   * 화면상 ui 구성에 사용할 state
   */
  let [chatRoom, setChatRoom] = useState([]);
  let _chatRoom = [...chatRoom];
  // props.uid === 현재 로그인중인 유저의 uid

  async function getData() {
    const dbData = db
      .collection("chatroom")
      .where("who", "array-contains", id)
      .get();
    const response = await dbData;
    response.forEach((doc) => {
      _chatRoom.push(doc.data());
      setChatRoom(_chatRoom);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  // console.log(chatRoom);

  return (
    <div className="container p-4 detail">
      <div className="row">
        <div className="col-3 p-0">
          <ul className="list-group chat-list">
            <li className="list-group-item">
              <h6>채팅방1</h6>
              <h6 className="text-small">채팅방아이디</h6>
            </li>
            {chatRoom.map((x, i) => {
              return (
                <li className="list-group-item" key={i}>
                  <h6>{chatRoom[i].product}</h6>
                  <h6 className="text-small">{chatRoom[i].who[1]}</h6>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-9 p-0">
          <div className="chat-room">
            <ul className="list-group chat-content">
              <li>
                <span className="chat-box">채팅방1 내용</span>
              </li>
              <li>
                <span className="chat-box">채팅방1 내용</span>
              </li>
              <li>
                <span className="chat-box mine">채팅방1 내용</span>
              </li>
            </ul>
            <div className="input-group">
              <input className="form-control" id="chat-input" />
              <button className="btn btn-secondary" id="send">
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
