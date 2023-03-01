import MESSAGE from "../lang/MESSAGE.json"
import { EXTENSION } from "../constants"
import ExtLink from "../components/ExtLink"
import Empty from "../components/Empty"
import styles from "./TestnetRequired.module.scss"
import useAddress from "../hooks/useAddress"
import Grid from "../components/Grid"
import Button from "../components/Button"

const TestnetRequired = () => {
  const address = useAddress()
  const action = !address ? (
    <ExtLink href={EXTENSION}>{MESSAGE.Wallet.DownloadExtension}</ExtLink>
  ) : (
    <Grid className={styles.error_container}>
      <Grid className={styles.blankGrid}></Grid>
      <Grid className={styles.container}>
        <div className={styles.CzWelcome}>
          <h6>Welcome to the Testnet Beta of Loop Markets!</h6>
          <ExtLink
            href={"https://faucet.terra.money"}
            className={styles.button}
          >
            <img src="../load.svg" alt={'Loop'} />
            LOAD UP ON TESTNET UST
          </ExtLink>
          <p>
            Then switch to the Testnet (dropdown at the top of Terra Station)
          </p>
          <p>
            Stay awesome, and please leave feedback (good, bad & ugly) via the
            BUGS & FEEDBACK button to the right
          </p>
          <Button
            className={styles.button}
            onClick={() => window.location.reload()}
          >
            <img src="../refresh.svg" alt={'refresh'} />
            Refresh
          </Button>
        </div>
      </Grid>
      <Grid></Grid>
    </Grid>
  )

  return (
    <Empty>
      <div>{action}</div>
    </Empty>
  )
}

export default TestnetRequired
