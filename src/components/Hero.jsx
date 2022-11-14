import React from "react";

const Hero = () => {
  return (
    <div className="hero">
      <section>
        <h1>
          당신 근처의 <br /> 당근마켓
        </h1>
        <p>
          중고 거래부터 동네 정보까지, 이웃과 함께해요.
          <br />
          가깝고 따뜻한 당신의 근처를 만들어요.
        </p>
      </section>
      <img src={process.env.PUBLIC_URL + "/image/hero.png"} alt="" />
    </div>
  );
};

export default Hero;
