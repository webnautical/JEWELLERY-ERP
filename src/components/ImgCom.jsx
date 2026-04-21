import React from "react";
import { imgBaseURL } from "../helper/Utility";

const ImgCom = ({ img }) => {
  return (
    <>
      {img ? (
        <img src={`${imgBaseURL()}/${img}`} alt="" className="style-thumb" />
      ) : (
        <div className="style-thumb-empty">No img</div>
      )}
    </>
  );
};

export default ImgCom;
