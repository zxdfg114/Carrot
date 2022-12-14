import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalLayer = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.content}</h4>
        <p>{`고객님의 ${props.prdcTitle}이 정상적으로 등록되었습니다.`}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          style={{ backgroundColor: "dodgerblue" }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalLayer;
