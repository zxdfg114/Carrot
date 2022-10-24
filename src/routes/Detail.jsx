import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { db } from "../index";

const Detail = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  let { id } = useParams();

  async function detailData() {
    const detail = db.collection("product").doc(id).get();
    const result = await detail;
    setData(result.data());
  }

  useEffect(() => {
    detailData();
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
            >
              수정하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
