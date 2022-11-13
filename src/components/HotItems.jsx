import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../index";
import "firebase/firestore";

const HotItems = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState(props.data);

  useEffect(() => {
    setData(
      props.data
        .sort((a, b) => {
          return b.likeCount - a.likeCount;
        })
        .slice(0, 8)
    );
  }, []);

  return (
    <>
      {data.length !== 0 ? (
        <div className="my-post">
          <h1>인기 매물</h1>
        </div>
      ) : null}

      <div className="wrap recent">
        {data.map((x, i) => {
          return (
            <div
              className="product"
              key={i}
              onClick={() => {
                navigate(`/detail/${[data[i].id]}`);
              }}
            >
              <div className="thumbnail">
                <img src={data[i].image} alt="https://picsum.photos/200" />
              </div>
              <div className="description">
                <h5 className="title">{data[i].상품명}</h5>
                <p className="date">{data[i].날짜.toLocaleString()}</p>
                <p className="like">
                  <i className="fa fa-heart-o"></i> {props.data[i].likeCount}
                </p>
                <p className="price">
                  {parseInt(data[i].가격).toLocaleString()}원
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
