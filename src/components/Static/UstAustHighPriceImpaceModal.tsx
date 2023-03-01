import styles from "./UstAustHighPriceImpace.module.scss";
import ExtLinkButton from "../ExtLinkButton";
import Grid from "../Grid";

const UstAustHighPriceImpactModal = () => {
  return (
    <Grid className={styles.container}>
      <div>
        <h6 className={styles.heading}>Loop Cares About You</h6>
        <p className={styles.details}>
          The price impact on this trade is currently too high (over 1%). Please use Anchor to move between UST and aUST with
          no loss by using the “Deposit” and “Withdraw”
          functionality via the link below.
        </p>
        <ExtLinkButton size={'md'} href={'https://app.anchorprotocol.com/earn'} target={'_blank'} className={styles.button} >
          GO TO ANCHOR
        </ExtLinkButton>
      </div>
    </Grid>
  )
}

export default UstAustHighPriceImpactModal
