import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { storage } from "../index";
import { db } from "../index";
import "firebase/firestore";
import ModalLayer from "../components/ModalLayer";
import { useNavigate } from "react-router-dom";

const Upload = (props) => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(0);
  const [prdcTitle, setPrdcTitle] = useState(" ");
  let modalTitle = `상품 등록 완료!`;
  let modalContent = `상품이 정상적으로 등록되었습니다`;
  console.log(props.user);

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
          const path = storageRef.child("/image" + file.name); // 저장경로
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
                const itemData = {
                  상품명: e.target[0].value,
                  가격: e.target[1].value,
                  내용: e.target[3].value,
                  날짜: new Date().toLocaleString(),
                  image: url,
                  uid: props.uid,
                  작성자: props.user,
                };

                db.collection("product")
                  .add(itemData)
                  .then((doc) => {
                    //상세페이지 제어를 위해 아이디를 저장
                    const id = doc.id;
                    itemData.id = id;
                    props.data.push(itemData);
                    props.setData(props.data);
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
        <input type="text" name="title" placeholder="상품명을 입력해주세요" />
        <label htmlFor="price">가격</label>
        <input type="number" name="price" placeholder="가격을 입력해주세요" />
        <label htmlFor="image" className="custom-file-upload">
          사진{" "}
        </label>
        <Form.Control type="file" size="md" />
        <FloatingLabel controlId="floatingTextarea2" label="설명 및 요구사항">
          <Form.Control as="textarea" placeholder="Leave a comment here" />
        </FloatingLabel>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
