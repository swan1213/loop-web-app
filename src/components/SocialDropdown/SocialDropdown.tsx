import { FC, ReactNode, useEffect, useState } from "react"
import classNames from "classnames/bind"
import styles from "./SocialDropdown.module.scss"
import Twitter_icon from "../../images/icons/Twitter.svg"
import Discord_icon from "../../images/icons/Discord.svg"
import Telegram_icon from "../../images/icons/Telegram.png"
import Down_Arrow from "../../images/icons/polygon.svg"
import Reddit_icon from "../../images/icons/Redit.png"

const cx = classNames.bind(styles)

const SocialDropdown = () => {
  const [isDropdown, setIsDropDown] = useState(false)

  const toogleDropDown = () => {
    setIsDropDown((prev) => !prev) 
  }

  const closeDropdown = () => {
    window.innerWidth < 600 ? setIsDropDown(true) : setIsDropDown(false)
  }

  useEffect(()=>{

    window.innerWidth < 600 && setIsDropDown(true)

  },[window])

  return (
    <>
      {isDropdown && (
        <div
          className={styles.invisibleDiv}
          onClick={() => setIsDropDown(false)}
        ></div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          className={styles.btn}
          style={isDropdown ? { marginTop: "150px" } : {  }}
          onClick={toogleDropDown}
        >
          <img
            src={Telegram_icon}
            alt="telegram"
            style={{ marginLeft: "9px" }}
          />
          <a
            className={styles.title}
            href="https://t.me/loopfinance"
            target="_blank"
          >
            Telegram
          </a>{" "}
          <img src={Down_Arrow} alt="" style={{ width: "9px" }} />
        </button>

        {isDropdown && (
          <div className={styles.socialDropdown}>
            
            <a
              href={window.innerWidth < 600 ? "https://t.me/loopfinance" : "https://t.me/loopannouncements/"}
              target="_blank"
              className={styles.socialLink}
              onClick={closeDropdown}
            >
            
            
              <img src={Telegram_icon} alt="twitter" />

              <span className={styles.title}>TG Alerts</span>
            </a>
            <a
              href="https://twitter.com/loop_finance"
              className={styles.socialLink}
              target="_blank"
              onClick={closeDropdown}
            >
              <img src={Twitter_icon} alt="twitter" />
              <span className={styles.title}>Twitter</span>
            </a>
            <a
              href="https://discord.gg/loopfinance"
              className={styles.socialLink}
              target="_blank"
              onClick={closeDropdown}
            >
              <img src={Discord_icon} alt="discord" />
              <span className={styles.title}>Discord</span>
            </a>
            <a
              href="https://www.reddit.com/r/Loop/"
              className={styles.socialLink}
              target="_blank"
              onClick={closeDropdown}
            >
              <img src={Reddit_icon} alt="twitter" />
              <span className={styles.title}>Reddit</span>
            </a>
          </div>
        )}
      </div>
    </>
  )
}

export default SocialDropdown
