import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";
import { useQuery } from "react-query";

const Chat = (props) => {
  const { id } = useParams();
  const [active, setActive] = useState(null);
  const [userName, setUserName] = useState(null);

  /**
   * 화면상 ui 구성에 사용할 state
   */
  let [chatRoom, setChatRoom] = useState([]);
  let _chatRoom = [...chatRoom];
  //메시지를 어느 채팅방에 저장할 건지 설정
  let [chatRoomId, setChatRoomId] = useState(null);
  // props.uid === 현재 로그인중인 유저의 uid
  let [chatMessages, setChatMessages] = useState([]);
  let _messages = [...chatMessages];
  const messageQuery = db
    .collection("chatroom")
    .doc()
    .collection("messages")
    .orderBy("when");

  const chatContents = useRef();

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
   *
   * @param {*:} i
   * @returns 현재 보고있는 채팅방 표시하려고 만든 함수, className에 삽입하여 구분함
   */
  const handleOn = (i) => {
    if (active === i) {
      return "on";
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

  //채팅방 상대 유저이름 설정하는 함수
  async function getUserName(i) {
    const user = db
      .collection("user")
      .doc(chatRoom[i].who.filter((x) => x !== props.uid)[0])
      .get();
    const response = await user;
    const name = response.data().name;
    setUserName(name);
  }

  useEffect(() => {
    // _messages = [];
    getData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  //채팅방에 스크롤 있으면 아래로 내려줌.
  const scrollToBottom = () => {
    if (chatContents.current) {
      chatContents.current.scrollTop = chatContents.current.scrollHeight;
    }
  };

  return (
    <div className="chat">
      <div className="user-name"></div>

      <ul className="list-group chat-list">
        {chatRoom.map((x, i) => {
          return (
            <li
              className={`list-group-item ${handleOn(i)}`}
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                //클릭시마다 중첩되어 나오는 현상 방지를 위해 메시지 모음 초기화
                setActive(i);
                _messages = [];
                setChatRoomId(chatRoom[i].id);
                /**
                 * 채팅내용 가져오는 쿼리문
                 */
                db.collection("chatroom")
                  .doc(chatRoom[i].id)
                  .collection("messages")
                  .orderBy("when")
                  .onSnapshot((querysnapshot) => {
                    querysnapshot.docChanges().forEach((change) => {
                      let message = change.doc.data();
                      _messages.push(message);
                    });
                    //concat을 사용해야 state re-render가 일어남
                    setChatMessages(chatMessages.concat(_messages));
                    console.log(chatMessages);
                  });
                getUserName(i);
                scrollToBottom();
              }}
            >
              <h6>{chatRoom[i].product}</h6>
              <h6 className="text-small">{chatRoom[i].id}</h6>
            </li>
          );
        })}
      </ul>
      {chatRoomId === null ? null : (
        <div className="chat-room">
          <div className="user-name">{userName}님과의 1:1 채팅입니다</div>
          <ul className="list-group chat-content" ref={chatContents}>
            {chatMessages === null ? <h1>메시지를 작성해주세요</h1> : null}
            {chatMessages.map((x, i) => {
              return (
                <li key={i} className="clear-fix">
                  <span className={`chat-box ${checkMine(i)}`}>
                    {chatMessages[i].input}
                  </span>
                </li>
              );
            })}
            {scrollToBottom()}
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
              _messages = [...chatMessages];
              db.collection("chatroom")
                .doc(String(chatRoomId))
                .collection("messages")
                .add(myMessage)
                .then((doc) => {
                  e.target[0].value = "";
                  _messages.push(myMessage);
                  setChatMessages(_messages);
                  scrollToBottom();
                });
            }}
          >
            <input type="text" className="chat-message" required />
            <button className="chat-send" type="submit">
              <i className="fa fa-send"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
