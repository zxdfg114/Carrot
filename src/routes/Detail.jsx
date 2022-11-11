import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import Alert from "@mui/material/Alert";
import { db } from "../index";
import DeleteModal from "../components/DeleteModal";

const Detail = (props) => {
  //data는 이 페이지에서만 사용할 state
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [fade, setFade] = useState("");
  const [liked, setLiked] = useState(false);
  const [success, setSuccess] = useState(null);
  const { id } = useParams();
  const [modalShow, setModalShow] = React.useState(false);

  console.log(data);

  async function detailData() {
    const detail = db.collection("product").doc(id).get();
    const result = await detail;
    setData(result.data());
  }

  /**
   * 상품명과 로그인된 유저를 기준으로 중복된 채팅방이 존재하는지 여부를 검사후 채팅방 개설.
   */
  async function checkOverlap() {
    const dbData = db
      .collection("chatroom")
      .where("who", "array-contains", props.uid)
      .where("product", "==", data.상품명)
      .get();
    const result = await dbData;
    console.log(result);
    if (result.size === 0) {
      db.collection("chatroom")
        .add({
          who: [props.uid, data.uid],
          date: new Date(),
          product: data.상품명,
        })
        .then(() => {
          console.log("새로운 채팅방 개설 성공!");
          navigate(`/chat/${props.uid}`);
        });
    } else {
      console.log("이미 개설된 채팅방이 있습니다");
      navigate(`/chat/${props.uid}`);
    }
  }

  // 토글식 좋아요 기능
  // Ref 사용시 예상못한 오류가 발생하여 일단 하드코딩
  async function handleLike() {
    const like = db
      .collection("product")
      .doc(id)
      .collection("like")
      .doc(props.uid)
      .get();
    const result = await like;
    if (result.exists === false) {
      db.collection("product")
        .doc(id)
        .collection("like")
        .doc(props.uid)
        .set({ like: props.uid })
        .then((doc) => {
          setLiked(true);
        });
    } else {
      db.collection("product")
        .doc(id)
        .collection("like")
        .doc(props.uid)
        .get()
        .then((doc) => {
          doc.ref.delete();
        });

      setLiked(false);
    }
  }
  //컴포넌트 로딩후 이 상품에 좋아요를 눌렀었는지 검사
  async function didIClicked() {
    const liked = db
      .collection("product")
      .doc(id)
      .collection("like")
      .where("like", "==", props.uid)
      .get();
    const result = await liked;
    if (result.size === 1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }

  useEffect(() => {
    didIClicked();
  }, []);

  useEffect(() => {
    detailData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setFade("fadein");
    }, 100);
  }, [fade]);

  useEffect(() => {
    if (
      props.loggedIn &&
      JSON.parse(localStorage.getItem("watched") === null)
    ) {
      localStorage.setItem("watched", JSON.stringify([]));
    }
    let arr = JSON.parse(localStorage.getItem("watched"));
    if (arr) {
      arr.unshift(id);
      let set = new Set(arr);
      let arr2 = Array.from(set);
      if (arr2.length > 4) {
        arr2.length = 4;
      }
      localStorage.setItem("watched", JSON.stringify(arr2));
    }
  }, []);

  return (
    <>
      <div className="detail">
        <div className={`detail-product ${fade}`}>
          <h5 className="title">{data.상품명}</h5>
          <h5>{data.작성자}</h5>
          <p className="date">{data.날짜}</p>
          <p className="like">
            <i className="fa fa-heart-o">{data.likeCount}</i>
          </p>
          <hr />
          <img src={data.image} alt="" />
          {/* 날짜 좀 나중에 넣어보자 */}
          <p className="price">{parseInt(data.가격).toLocaleString()}원</p>
          <p className="desc">{data.내용}</p>

          {data.uid === props.uid || props.admin ? (
            <Button
              variant="contained"
              onClick={() => {
                navigate(`/edit/${id}`);
              }}
              style={{ marginRight: "10px", display: "inline-block" }}
            >
              수정하기
            </Button>
          ) : null}
          {liked && (
            <Alert severity="success">관심목록에 등록되었습니다 !</Alert>
          )}

          {/* 로그인된 유저와 게시물 작성자가 다를경우에만 + 로그인이 되어있을때에만 채팅방 만들기 보이게 설정*/}
          {data.uid !== props.uid && props.loggedIn ? (
            <>
              <Button
                style={{
                  display: "inline-block",
                  marginRight: "10px",
                }}
                variant="text"
                color="error"
                type="submit"
                onClick={() => {
                  handleLike();
                }}
              >
                {liked ? (
                  <i className="fa fa-heart fa-2x"></i>
                ) : (
                  <i className="fa fa-heart-o fa-2x"></i>
                )}
              </Button>
              <Button
                variant="contained"
                style={{
                  border: "0",
                  display: "inline-block",
                  marginRight: "10px",
                }}
                onClick={() => {
                  checkOverlap();
                }}
              >
                1:1 채팅
              </Button>
            </>
          ) : null}
          {!props.loggedIn && (
            <Button
              variant="contained"
              color="success"
              style={{ color: `#fff` }}
              onClick={() => {
                navigate("/signin");
              }}
            >
              로그인 후 판매자와 채팅 이용이 가능합니다
            </Button>
          )}
          {data.uid === props.uid || props.admin ? (
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setModalShow(true);
              }}
            >
              삭제하기
            </Button>
          ) : null}
          {modalShow ? (
            <DeleteModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              data={data}
              id={id}
              product={props.data}
              setproduct={props.setData}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Detail;
