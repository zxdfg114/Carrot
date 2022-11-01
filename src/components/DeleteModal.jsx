import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { db } from "../index";
import "firebase/firestore";

export default function DeleteModal(props) {
  const navigate = useNavigate();
  console.log(props.data);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">삭제</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>정말로 삭제하시겠습니까 ?</h4>
        <p>삭제한 데이터는 복구할수 없습니다</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            db.collection("chatroom")
              .where("product", "==", props.data.상품명)
              .get()
              .then((result) => {
                result.forEach((doc) => doc.ref.delete());
              })
              .catch((error) => {
                console.error(error);
              });
            db.collection("product")
              .doc(props.id)
              .get()
              .then((result) => {
                result.ref.delete();
              });
            props.setproduct(
              props.product.filter((x) => x.상품명 !== props.data.상품명)
            );
            navigate("/");
          }}
        >
          삭제하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
