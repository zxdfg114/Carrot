import React from "react";
import { useNavigate } from "react-router-dom";

const OpenChat = (props) => {
  const navigate = useNavigate();

  return (
    <div
      id="chat-oppener"
      onClick={() => {
        navigate(`/chat/${props.uid}`);
      }} 
    >
      <i className="fa fa-comment"></i>
    </div>
  );
};

export default OpenChat;
