import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

const MyPost = (props) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const myData = props.data.filter((x) => x.uid === id);

  return (
    <>
      <div className="my-post">
        <h1>내 거래</h1>
      </div>
      {myData.length === 0 && (
        <div className="no-upload">
          <h1>아직 업로드한 상품이 없습니다</h1>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              navigate("/upload");
            }}
          >
            중고매물 올리기
          </Button>
        </div>
      )}
      <div className="wrap">
        {myData.map((x, i) => {
          return (
            <div
              className="product"
              key={i}
              onClick={() => {
                navigate(`/detail/${myData[i].id}`);
              }}
            >
              <div className="thumbnail">
                <img src={myData[i].image} alt="https://picsum.photos/200" />
              </div>
              <div className="description">
                <h5 className="title">{myData[i].상품명}</h5>
                <p className="date">{myData[i].날짜.toLocaleString()}</p>
                <p className="price">
                  {parseInt(myData[i].가격).toLocaleString()}원
                </p>
                <p></p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyPost;
