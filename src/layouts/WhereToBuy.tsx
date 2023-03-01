import WithAbsolute from "../components/WithAbsolute"
import Icon from "../components/Icon"
import BuyLinks from "../components/BuyLinks"
import styles from "./WhereToBuy.module.scss"

const WhereToBuy = () => (
  <WithAbsolute
    content={({ close }) => (
      <BuyLinks className={styles.card} onClick={close} />
    )}
  >
    {({ toggle }) => (
      <>
        <button
          className={styles.button + " " + styles.mobileBuy}
          onClick={toggle}
        >
          Buy UST
          <Icon name="chevron_right" />
        </button>

        <button
          className={styles.button + " " + styles.buyMobile}
          onClick={toggle}
        >
          <Icon name="shopping_cart" /> Buy UST/LUNA
        </button>
      </>
    )}
  </WithAbsolute>
)

export default WhereToBuy
