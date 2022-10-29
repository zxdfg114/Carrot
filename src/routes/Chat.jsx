import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";

const Chat = (props) => {
  let { id } = useParams();
  let [mine, setMine] = useState("");
  let [isFirstMsg, setIsFirstMsg] = useState(true);
  /**
   * 화면상 ui 구성에 사용할 state
   */
  let [chatRoom, setChatRoom] = useState([]);
  //메시지를 어느 채팅방에 저장할 건지 설정
  let [chatRoomId, setChatRoomId] = useState(null);
  let _chatRoom = [...chatRoom];
  // props.uid === 현재 로그인중인 유저의 uid
  let [chatMessages, setChatMessages] = useState([]);
  let _messages = [...chatMessages];

  /**
   *
   * @param {*} i map의 index값 활용
   * @returns 현재 로그인된 유저가 메시지 작성자인지 판별하는 함수
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
    <div className="chat container">
      <div className="row">
        <div className="col-3 p-0">
          <ul className="list-group chat-list">
            {chatRoom.map((x, i) => {
              return (
                <li
                  className="list-group-item"
                  key={i}
                  onClick={(e) => {
                    //클릭시마다 중첩되어 나오는 현상 방지를 위해 메시지 모음 초기화
                    _messages = [];
                    e.stopPropagation();
                    setChatRoomId(chatRoom[i].id);
                    /**
                     * 채팅내용 가져오는 쿼리문
                     */
                    db.collection("chatroom")
                      .doc(chatRoom[i].id)
                      .collection("messages")
                      .orderBy("when", "desc")
                      .onSnapshot((result) => {
                        result.forEach((doc) => {
                          const message = doc.data();
                          _messages.push(message);
                        });
                        //작성된 메시지가 1개도 없을때 state가 변경되지 않던 상황 해결을 위해  set을 아래로 뺐음.
                        setChatMessages(_messages);
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
                {chatMessages === null ? <h1>메시지를 작성해주세요</h1> : null}
                {chatMessages.map((x, i) => {
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
                  e.preventDefault();
                  e.stopPropagation();
                  const myMessage = {
                    input: e.target[0].value,
                    when: new Date(),
                    uid: props.uid,
                  };
                  //css flex-direction : column-reverse 사용했기 때문에 베열에 unshift를 이용하여 삽입
                  db.collection("chatroom")
                    .doc(String(chatRoomId))
                    .collection("messages")
                    .add(myMessage)
                    .then(() => {
                      e.target[0].value = "";
                      _messages.unshift(myMessage);
                      setChatMessages(_messages);
                    });
                }}
              >
                <input type="text" className="chat-message" required />
                <button className="chat-send" type="submit">
                  <i className="fa fa-send"></i>
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
