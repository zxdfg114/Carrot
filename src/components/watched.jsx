import React from "react";
import { useNavigate } from "react-router-dom";

const Watched = (props) => {
  let navigate = useNavigate();
  const watchedItem = JSON.parse(localStorage.getItem("watched"));
  const recentItem = props.data.filter((item) => watchedItem.includes(item.id));

  return (
    <>
      <div className="my-post">
        <h1>최근에 본 매물</h1>
      </div>
      <div className="wrap">
        {recentItem.map((x, i) => {
          return (
            <div
              className="product"
              key={i}
              onClick={() => {
                navigate(`/detail/${[recentItem[i].id]}`);
              }}
            >
              <div className="thumbnail">
                <img
                  src={recentItem[i].image}
                  alt="https://picsum.photos/200"
                />
              </div>
              <div className="description">
                <h5 className="title">{recentItem[i].상품명}</h5>
                <p className="date">{recentItem[i].날짜.toLocaleString()}</p>
                <p className="price">
                  {parseInt(recentItem[i].가격).toLocaleString()}원
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

export default Watched;
