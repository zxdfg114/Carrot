import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../index";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";

import DeleteModal from "../components/DeleteModal";
import Upload from "./Upload";

const MyInterest = (props) => {
  const [data, setData] = useState([]);
  const _data = [...data];
  const { id } = useParams();
  const navigate = useNavigate();

  //내가 좋아요를 눌렀던 상품을 db에서 가져옴
  async function getData() {
    const dbData = db.collection("product").get();
    const result = await dbData;
    result.forEach(async (doc) => {
      const items = doc.data();
      const like = doc.ref.collection("like").get();
      const likeResult = await like;
      likeResult.forEach((x) => {
        items.id = doc.id;
        const didIliked = x.data().like;
        if (id === didIliked) {
          items.likeCount = likeResult.size;
          _data.push(items);
          setData([].concat(_data));
        }
      });
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="my-post">
        <h1>관심 상품</h1>
      </div>
      {data.length === 0 && (
        <div className="no-upload">
          <h1>아직 관심있는 상품이 없습니다. 둘러보세요</h1>
          <Button
            variant="contained"
            color="warning"
            onClick={() => {
              navigate("/");
            }}
          >
            메인으로
          </Button>
        </div>
      )}
      <div className="wrap">
        {data.map((x, i) => {
          return (
            <div
              className="product"
              key={i}
              onClick={() => {
                navigate(`/detail/${data[i].id}`);
              }}
            >
              <div className="thumbnail">
                <img src={data[i].image} alt="https://picsum.photos/200" />
              </div>
              <div className="description">
                <h5 className="title">{data[i].상품명}</h5>
                <p className="date">{data[i].날짜.toLocaleString()}</p>
                <p className="like">
                  <i className="fa fa-heart-o"></i> {data[i].likeCount}
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

export default MyInterest;
