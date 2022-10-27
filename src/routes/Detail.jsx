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

  async function checkOverlap() {
    const dbData = db.collection("chatroom").where("who", "==", true).get();
    const response = await dbData;
    response.forEach((x) => console.log(x.data()));
  }

  useEffect(() => {
    detailData();
  }, []);

  useEffect(() => {
    checkOverlap();
  }, []);

  return (
    <div className="wrap">
      <div className="container">
        <h1>상세보기</h1>
        <div className="detail-pic my-4"></div>
        <div>
          <h2>{data.작성자}</h2>
          <hr />
          <h5 className="title">{data.상품명}</h5>
          <img src={data.image} alt="" />
          <p className="date">{}</p>
          {/* 날짜 좀 나중에 넣어보자 */}
          <p className="price">{data.가격}</p>
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
          {data.uid === props.uid ? null : (
            <Button
              style={{
                backgroundColor: "#8977ad",
                border: "0",
                display: "inline-block",
              }}
              onClick={() => {
                // 0번 : 현재 로그인중인 유저
                // 1번 : 상품에 저장된 유저
                db.collection("chatroom").add({
                  who: [props.uid, data.uid],
                  date: new Date(),
                  product: data.상품명,
                });
                navigate(`/chat/${props.uid}`);
              }}
            >
              채팅
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
