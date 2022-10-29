import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { db } from "../index";

const Detail = (props) => {
  //data는 이 페이지에서만 사용할 state
  const navigate = useNavigate();
  const [data, setData] = useState("");
  let { id } = useParams();

  async function detailData() {
    const detail = db.collection("product").doc(id).get();
    const result = await detail;
    setData(result.data());
  }

  /**
   * 상품명과 로그인된 유저를 기준으로 중복된 채팅방이 존재하는지 여부를 검사
   */
  async function checkOverlap() {
    const dbData = db
      .collection("chatroom")
      .where("product", "==", data.상품명)
      .where("who", "array-contains", props.uid)
      .get();
    const result = await dbData;
    if (result.size === 0) {
      db.collection("chatroom")
        .add({
          who: [props.uid, data.uid],
          date: new Date(),
          product: data.상품명,
        })
        .then(() => {
          console.log("새로운 채팅방 개설 성공!");
          navigate(`/chat/${props.uid}`);
        });
    } else {
      console.log("이미 개설된 채팅방이 있습니다");
      navigate(`/chat/${props.uid}`);
    }
  }

  useEffect(() => {
    detailData();
  }, []);

  return (
    <>
      <div className="detail">
        <div className="detail-product">
          <h5 className="title">{data.상품명}</h5>
          <h5>{data.작성자}</h5>
          <hr />
          <img src={data.image} alt="" />
          <p className="date">{}</p>
          {/* 날짜 좀 나중에 넣어보자 */}
          <p className="price">{parseInt(data.가격).toLocaleString()}원</p>
          <p className="desc">{data.내용}</p>
          {data.uid === props.uid && (
            <Button
              variant="primary"
              onClick={() => {
                navigate(`/edit/${id}`);
              }}
              style={{ marginRight: "10px", display: "inline-block" }}
            >
              수정하기
            </Button>
          )}
          {/* 로그인된 유저와 게시물 작성자가 다를경우에만 채팅방 만들기보이게 설정 */}
          {data.uid === props.uid ? null : (
            <Button
              style={{
                backgroundColor: "#8977ad",
                border: "0",
                display: "inline-block",
              }}
              onClick={() => {
                checkOverlap();
              }}
            >
              1:1 채팅
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;
