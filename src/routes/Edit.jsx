import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { db } from "../index";
import "firebase/firestore";
import firebase from "firebase/app";
import ModalLayer from "../components/ModalLayer";
import { storage } from "../index";

const Edit = (props) => {
  //이 페이지 내에서만 사용할 하나의 doc
  const [data, setData] = useState("");
  const { product } = useParams();
  const dataCopied = [...props.data];

  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(0);
  const [prdcTitle, setPrdcTitle] = useState(" ");
  const modalTitle = `상품 등록 완료!`;
  const modalContent = `상품이 정상적으로 등록되었습니다`;

  async function editData() {
    const detail = db.collection("product").doc(product).get();
    const result = await detail;
    const item = result.data();
    item.id = product;
    setData(item);
  }

  useEffect(() => {
    editData();
  }, []);

  return (
    <div className="container">
      {modalShow ? (
        <ModalLayer
          show={modalShow}
          onHide={() => setModalShow(0)}
          title={modalTitle}
          content={modalContent}
          prdcTitle={prdcTitle}
        ></ModalLayer>
      ) : null}
      <form
        action=""
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();

          const file = e.target[2].files[0];
          const storageRef = storage.ref(); // 저장경로
          const path = storageRef.child("/image" + file?.name); // 저장경로
          const uploading = path.put(file);

          uploading.on(
            "state_changed",
            // 변화시 동작하는 함수
            null,
            //에러시 동작하는 함수
            (error) => {
              console.error("실패사유는", error);
            },
            // 성공시 동작하는 함수
            () => {
              uploading.snapshot.ref.getDownloadURL().then((url) => {
                const updateData = {
                  상품명: e.target[0].value,
                  가격: e.target[1].value,
                  내용: e.target[3].value,
                  날짜: new Date().toLocaleString(),
                  image: url,
                  uid: props.uid,
                  작성자: props.user,
                  id: product,
                };

                db.collection("product")
                  .doc(product)
                  .update(updateData)
                  .then((result) => {
                    // 화면 변화를 위해 클라이언트단 state 변경

                    const newArr = props.data.filter((x) => x.id !== product);
                    newArr.unshift(updateData);

                    props.setData(newArr);
                    setModalShow(1);
                    setPrdcTitle(e.target[0].value);
                    setTimeout(navigate("/"), 3000);
                  });
              });
            }
          );
        }}
      >
        <label htmlFor="title">상품명</label>
        <input
          type="text"
          name="title"
          placeholder={data.상품명}
          defaultValue={data.상품명}
          required
        />
        <label htmlFor="price">가격</label>
        <input
          type="number"
          name="price"
          placeholder={data.가격}
          defaultValue={data.가격}
          required
        />
        <label
          htmlFor="image"
          className="custom-file-upload"
        >
          사진{" "}
        </label>
        <Form.Control type="file" size="md" defaultValue={data.image} />
        <FloatingLabel
          controlId="floatingTextarea2"
          label={data.내용}
          defaultValue={data.내용}
        >
          <Form.Control as="textarea" placeholder={data.내용} />
        </FloatingLabel>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default Edit;
