import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

const Chat = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  //현재 활성화된 채팅방의 index
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
  let _messages = [...chatMessages];;

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
  function getData() {
    const dbData = db
      .collection("chatroom")
      .where("who", "array-contains", id)
      .onSnapshot((querysnapshot) => {
        querysnapshot.docChanges().forEach((change) => {
          const items = change.doc.data();
          items.id = change.doc.id;
          console.log(change.type);
          if (change.type === "added") {
            _chatRoom.push(items);
          }
          if (change.type === "modified") {
            let idx = _chatRoom.findIndex((x) => x.id === items.id);
            _chatRoom.splice(idx, 1, items);
          }
        });
        setChatRoom([].concat(_chatRoom));
      });
    // const response = await dbData;
    // response.forEach((doc) => {
    //   const items = doc.data();
    //   items.id = doc.id;
    //   _chatRoom.push(items);
    //   setChatRoom(_chatRoom);
    // });
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

  //새 메시지 생성시 알림 기능 생성
  function postAlram(i, bool) {
    db.collection("user")
      .doc(chatRoom[i].who.filter((x) => x !== props.uid)[0])
      .update({ message: bool });
    console.log("업데이트");
  }

  console.log(chatRoom);

  useEffect(() => {
    db.collection("user") //
      .doc(id)
      .update({ message: false });
  }, []);

  useEffect(() => {
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
      {chatRoom.length === 0 && (
        <div className="no-chat-room">
          <h2>아직 개설된 채팅방이 없습니다</h2>
          <p>상품별 상세페이지에서 판매자와의 채팅 시작이 가능합니다.</p>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </Button>
        </div>
      )}
      <ul className="list-group chat-list">
        {chatRoom.map((x, i) => {
          return (
            <Badge
              key={i}
              badgeContent={chatRoom[i]?.new ? "!" : null}
              color="error"
            >
              <li
                className={`list-group-item ${handleOn(i)}`}
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  //클릭시마다 중첩되어 나오는 현상 방지를 위해 메시지 모음 초기화
                  setActive(i);
                  setChatRoomId(chatRoom[i].id);
                  _messages = [];
                  db.collection("chatroom")
                    .doc(chatRoom[i].id)
                    .update({ new: false });
                  /**
                   * 채팅내용 가져오는 쿼리문, 현재 채팅방이 활성화되어있다면 클릭시에 중복해서 가져오지 않음
                   */

                  if (active !== i) {
                    db.collection("chatroom")
                      .doc(chatRoom[i].id)
                      .collection("messages")
                      .orderBy("when")
                      .onSnapshot((querysnapshot) => {
                        //docChanges() : 처음에 전체를 가져옴, 이후에 바뀌는 데이터만 추가
                        querysnapshot.docChanges().forEach((change) => {
                          let message = change.doc.data();
                          _messages.push(message);
                        });
                        //concat을 사용해야 state re-render가 일어남
                        //(.push)는 새로운 배열을 반환하지 않는다.

                        setChatMessages([].concat(_messages));
                      });
                  }
                  getUserName(i);
                  scrollToBottom();
                }}
              >
                <h6>{chatRoom[i].product}</h6>
                <h6></h6>
                <h6 className="text-small">{chatRoom[i].id}</h6>
              </li>
            </Badge>
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
              db.collection("chatroom")
                .doc(String(chatRoomId))
                .update({ new: true });
              postAlram(active, true);
            }}
          >
            <input type="text" className="chat-message" required />
            <Button
              className="chat-send"
              variant="contained"
              color="warning"
              type="submit"
            >
              <i className="fa fa-send"></i>
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chat;
