import React from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../index";
import "firebase/firestore";

const Product = (props) => {
  const navigate = useNavigate();

  return (
    <div className="wrap">
      <div className="product">
        <div className="thumbnail">
          <img src="https://picsum.photos/200" alt="" />
        </div>
        <div className="description">
          <h5 className="title">아기다스 신발</h5>
          <p className="date">2030년 1월 8일</p>
          <p className="price">20000원</p>
          <p>?0</p>
        </div>
      </div>
      {props.data.map((x, i) => {
        return (
          <div
            className="product"
            key={i}
            onClick={() => {
              navigate(`/detail/${[props.data[i].id]}`);
            }}
          >
            <div className="thumbnail">
              <img src={props.data[i].image} alt="https://picsum.photos/200" />
            </div>
            <div className="description">
              <h5 className="title">{props.data[i].상품명}</h5>
              <p className="date">2030년 1월 8일</p>
              <p className="price">
                {parseInt(props.data[i].가격).toLocaleString()}원
              </p>
              <p></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Product;
