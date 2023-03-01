import { Container, Grid, Image, Header, List } from "semantic-ui-react"
import styles from "./WalletGuide.module.scss"
import GOOGLE_CHROME from "../../images/googlechrome.png"
import ARROW from "../../images/arrow.png"
import GOOGLE_STORE from "../../images/googleStore.png"
import APP_STORE from "../../images/appStore.png"
import SHADOW_PINKU from "../../images/shadowPinku.png"
import I_DOWNLOAD from "../../images/iDownload.png"

const WalletGuide = () => {
  return (
    <>
      <div className={styles.downloadPage}>
        <div className={styles.downloadPageContent}>
          <h6>Setting Up a Wallet on the Terra Blockchain</h6>
          <p>
            Blockchain Wallets are used to store your tokens and connect to and
            interact with the blockchain.
          </p>
          <p>
            A wallet can be either a mobile app or a Chrome extension. Anyone
            can download a wallet and set it up in less than 2 minutes!{" "}
          </p>
          <p>
            Watch the videos below to learn how to set up a Terra wallet and
            start using Loop.
          </p>
        </div>

        <div className={styles.downloadPageVideos}>
          <div className={styles.downloadPageVideosLeft}>
            <h6>Chrome Extension Wallet</h6>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/tHVjzGMwb-8"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className={styles.downloadButtons}>
              <button>
                <a href="https://chrome.google.com/webstore/detail/terra-station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp?hl=en">
                  <img src={GOOGLE_CHROME} alt="" /> Download{" "}
                  <img src={ARROW} alt="" />
                </a>
              </button>
            </div>
          </div>
          <div className={styles.downloadPageVideosLeft}>
            <h6>Mobile Wallet</h6>
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/U5Qic6mm94Y"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className={styles.downloadButtons}>
              <button>
                <a href="https://play.google.com/store/apps/details?id=money.terra.station">
                  <img src={GOOGLE_STORE} alt="" /> Playstore{" "}
                  <img src={ARROW} alt="" />
                </a>
              </button>
              <button>
                <a href="https://apps.apple.com/us/app/terra-station/id1548434735">
                  <img src={APP_STORE} alt="" /> Appstore{" "}
                  <img src={ARROW} alt="" />
                </a>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.downloadBottom}>
          <h6>Why Do I Need a Wallet?</h6>
          <p>
            Loop is a blockchain application, meaning that you will need your
            own wallet in order to use it.Unlike centralized exchanges, such as
            Coinbase and Binance, we do not take custody of your assets and they
            will always remain in your wallet.
          </p>
          <h5>The advantages of this are many:</h5>
          <ul>
            <li>- You do not need to KYC (prove your identity)</li>
            <li>
              - We can never freeze or block your account or get access to your
              funds
            </li>
            <li>
              - Your funds are safer than they are on a centralized exchange
            </li>
          </ul>
          <h4>
            However, taking control of your own assets comes with great
            responsibility!
            <img src={SHADOW_PINKU} alt="" />
          </h4>
          <p>
            <img src={I_DOWNLOAD} alt="" /> Always write down your seed phrase
            and store multiple copies safely as ONLY YOU can recover your wallet
            if you lose it (we never have access to it)
          </p>
        </div>
      </div>
    </>
  )
}

export default WalletGuide
