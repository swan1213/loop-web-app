import { useState } from "react"
import styles from "./SocialDropdown.module.scss"
import Twitter_icon from "../images/icons/Twitter.svg"
import Discord_icon from "../images/icons/Discord.svg"
import Telegram_icon from "../images/icons/Telegram.svg"
import Down_Arrow from "../images/icons/Polygon.svg"
import Reddit from "../images/icons/reddit.png"

const SocialDropdown = () => {
  const [isDropdown, setIsDropDown] = useState(false)

  const toogleDropDown = () => {
    setIsDropDown((prev) => !prev)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        className={styles.btn}
        style={isDropdown ? { marginTop: "130px" } : { marginTop: "unset" }}
        onClick={toogleDropDown}
      >
        <img src={Telegram_icon} alt="telegram" style={{ marginLeft: "9px" }}/>
        <a className={styles.title} href='https://t.me/loopfinance' target='_blank'>
          Telegram
        </a>{" "}
        <img src={Down_Arrow} alt="" style={{ width: "9px" }} />
      </button>

      {isDropdown && (
        <div className={styles.socialDropdown}>
             <a
            href="https://t.me/loopannouncements/"
            target="_blank"
            className={styles.socialLink}
          >
            <img src={Telegram_icon} alt="twitter" />
            <span className={styles.title}>TG Alerts</span>
          </a>
          <a
            href="https://twitter.com/loop_finance"
            className={styles.socialLink}
            target="_blank"
          >
            <img src={Twitter_icon} alt="twitter" />
            <span className={styles.title}>Twitter</span>
          </a>
          <a
            href="https://discord.gg/loopfinance"
            className={styles.socialLink}
            target="_blank"
          >
            <img src={Discord_icon} alt="discord" />
            <span className={styles.title}>Discord</span>
          </a>
          <a
            href="https://www.reddit.com/r/Loop/"
            className={styles.socialLink}
            target="_blank"
          >
            <img src={Reddit} height={'15px'} width={'15px'} alt="reddit" />
            <span className={styles.title}>Reddit</span>
          </a>
        </div>
      )}
    </div>
  )
}

export default SocialDropdown

