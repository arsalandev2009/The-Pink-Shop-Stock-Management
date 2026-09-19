import React from "react";
import style from "./ComingSoon.module.css";

const ComingSoon = () => {
  return (
    <div className={style.comingsoon}>
      <div className={style.comingsooncontent}>

        <div className={style.shopname}>
          The <span>Pink</span> Shop <b>♡</b>
        </div>
        <br />
        <h1>
            <h1>Settings Page</h1>
          Coming <span>Soon</span>
        </h1>



        <div className={style.shoppingbag}>
          <div className={style.baghandle}></div>

          <div className={style.bag}>
            <div className={style.bagheart}>♡</div>
          </div>

          <div className={`${style.heart} ${style.heart1}`}>♡</div>
          <div className={`${style.heart} ${style.heart2}`}>♡</div>
          <div className={`${style.heart} ${style.heart3}`}>♡</div>
        </div>

      </div>
    </div>
  );
};

export default ComingSoon;