import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Watched = (props) => {
  const navigate = useNavigate();
  let watched = JSON.parse(localStorage.getItem("watched"));
  let [watchedId, setWatchedId] = useState(watched);
  const recentItem = props.data.filter((x) => watchedId.includes(x.id));
  useEffect(()=>{
    setWatchedId(watched);
    console.log(watchedId);
  }, [])

  return (
    <>
      {recentItem.length !== 0 ? (
        <div className="my-post">
          <h1>최근 본 매물</h1>
        </div>
      ) : null}

      <div className="wrap recent">
        {recentItem?.map((x, i) => {
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
                <p className="like">
                  <i className="fa fa-heart-o"></i> {props.data[i].likeCount}
                </p>
                <p className="price">
                  {parseInt(recentItem[i].가격).toLocaleString()}원
                </p>
                <p></p>
              </div>
            </div>
          );
        })}
      </div>
      <hr />
    </>
  );
};

export default Watched;
