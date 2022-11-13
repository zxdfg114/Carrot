import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";

const HotItems = (props) => {
  const navigate = useNavigate();

  const _data = props.data
    .sort((a, b) => {
      return b.likeCount - a.likeCount;
    })
    .slice(0, 8);

  return (
    <>
      <div className="my-post">
        <h1>인기 매물</h1>
      </div>

      <div className="wrap recent">
        {_data.map((x, i) => {
          return (
            <div
              className="product"
              key={i}
              onClick={() => {
                navigate(`/detail/${[_data[i].id]}`);
              }}
            >
              <div className="thumbnail">
                <img src={_data[i].image} alt="https://picsum.photos/200" />
              </div>
              <div className="description">
                <h5 className="title">{_data[i].상품명}</h5>
                <p className="date">{_data[i].날짜.toLocaleString()}</p>
                <p className="like">
                  <i className="fa fa-heart-o"></i> {_data[i].likeCount}
                </p>
                <p className="price">
                  {parseInt(_data[i].가격).toLocaleString()}원
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

export default HotItems;
