import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";

const Chat = (props) => {
  let { id } = useParams();
  let [mine, setMine] = useState("");
  /**
   * 화면상 ui 구성에 사용할 state
   */
  let [chatRoom, setChatRoom] = useState([]);
  //메시지를 어느 채팅방에 저장할 건지 설정
  let [chatRoomId, setChatRoomId] = useState(null);
  let _chatRoom = [...chatRoom];
  // props.uid === 현재 로그인중인 유저의 uid
  let [chatMessages, setChatMessages] = useState(null);
  let _messages = [];

  /**
   *
   * @param {*} i map의 index값 활용
   * @returns 현재 로그인된유저가 메시지 작성자인지 판별하는 함수
   */
  const checkMine = (i) => {
    if (chatMessages[i].uid === props.uid) {
      return "mine";
    } else {
      return "";
    }
  };

  /**
   * 채팅방 목록 가져오는 함수
   */
  async function getData() {
    const dbData = db
      .collection("chatroom")
      .where("who", "array-contains", id)
      .get();
    const response = await dbData;
    response.forEach((doc) => {
      const items = doc.data();
      items.id = doc.id;
      _chatRoom.push(items);
      setChatRoom(_chatRoom);
    });
  }

  useEffect(() => {
    getData();
  }, []);

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
                /**
                 * 채팅내용 가져오는 함수
                 */
                <li
                  className="list-group-item"
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChatRoomId(chatRoom[i].id);
                    db.collection("chatroom")
                      .doc(String(chatRoom[i].id))
                      .collection("messages")
                      .orderBy("when", "desc")
                      .onSnapshot((result) => {
                        result.forEach((doc) => {
                          const message = doc.data();
                          _messages.push(message);
                          setChatMessages(_messages);
                        });
                      });
                  }}
                >
                  <h6>{chatRoom[i].product}</h6>
                  <h6 className="text-small">{chatRoom[i].id}</h6>
                </li>
              );
            })}
          </ul>
        </div>
        {chatRoomId === null ? null : (
          <div className="col-9 p-0">
            <div className="chat-room">
              <ul className="list-group chat-content">
                {chatMessages?.map((x, i) => {
                  return (
                    <li key={i}>
                      <span className={`chat-box ${checkMine(i)}`}>
                        {chatMessages[i].input}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <form
                className="chat-input"
                onSubmit={(e) => {
                  const message = {
                    input: e.target[0].value,
                    when: new Date(),
                    uid: props.uid,
                  };
                  _messages.push(message);
                  setChatMessages(_messages);
                  db.collection("chatroom")
                    .doc(String(chatRoomId))
                    .collection("messages")
                    .add(message)
                    .then(() => {
                      e.target[0].value = "";
                    });
                  e.preventDefault();
                }}
              >
                <input type="text" className="chat-message" />
                <button className="chat-send" type="submit">
                  전송
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
