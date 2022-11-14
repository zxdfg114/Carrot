import React from "react";
import { useNavigate } from "react-router-dom";
import "firebase/firestore";

const Product = (props) => {
  const navigate = useNavigate();
  const date = new Date();

  const sortedData = props.data.sort((a, b) => {
    return parseInt(date.getTime(b.날짜)) - parseInt(date.getTime(a.날짜));
  });

  return (
    <>
      <div className="wrap">
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
                <img
                  src={props.data[i].image}
                  alt="https://picsum.photos/200"
                />
              </div>
              <div className="description">
                <h5 className="title">{props.data[i].상품명}</h5>
                <p className="date">{props.data[i].날짜.toLocaleString()}</p>
                <p className="like">
                  <i className="fa fa-heart-o"></i> {props.data[i].likeCount}
                </p>
                <p className="price">
                  {parseInt(props.data[i].가격).toLocaleString()}원
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Product;
