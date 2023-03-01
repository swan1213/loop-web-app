import Empty from "../components/Empty"
import useAddress from "../hooks/useAddress"
import styles from "../components/theme/Menu.module.scss"
import Connect from "../layouts/Connect"

const ConnectionRequired = () => {
  const address = useAddress()
  return (
    <Empty>
      {!address && (
        <>
          <div className={styles.CzConnectWallet}>
            <h6 className={styles.connection_required_info}>
              Connect your wallet to enter LOOP Markets
            </h6>
            <div className={styles.connection_btn}>
              <Connect />
            </div>
            <p>The Loop App is coming soon to make your life easier</p>
          </div>
        </>
      )}
    </Empty>
  )
}

export default ConnectionRequired
