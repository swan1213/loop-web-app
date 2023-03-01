import { useContractsAddress } from "../../hooks"
import useNewContractMsg from "../../terra/useNewContractMsg"
import CustomMsgFormContainer from "../../forms/CustomMsgFormContainer"
import { useState } from "react"
import styles from "./AssignFarmReward.module.scss"
import classnames from 'classnames'
import useHash from "../../libs/useHash"
import Grid from "../../components/Grid";
import LinkButton from "../../components/LinkButton";
import Page from "../../components/Page";
import {useProtocol} from "../../data/contract/protocol";

export enum Type {
  "DISTRIBUTION_TOKEN" = "distribution-token",
}

const AddDistributionToken = () => {
  const { hash: type } = useHash<Type>(Type.DISTRIBUTION_TOKEN)
  const tab = {
    tabs: [Type.DISTRIBUTION_TOKEN],
    tooltips: [],
    current: type,
  }

  const [token, setToken] = useState('')
  const [pair, setPair] = useState('')

  const newContractMsg = useNewContractMsg()
  const { contracts } = useProtocol()

  const data = [
    newContractMsg(contracts["loop_farm_staking_v2"], {
      add_distribution_token: {
        token: { token: { contract_addr:  token }},
        pair_addr: pair
      },
    })
  ]

  const disabled = (!token && !token.length) || (!pair && !pair.length)

  const container = {
    label: 'Submit',
    tab,
    data,
    disabled,
  }
  const goGoAdminLink = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }

  return (
      <Page title={" "} action={<LinkButton {...goGoAdminLink} />}>
    <CustomMsgFormContainer {...container}>
      <div className={styles.inputContainer}>
        <Grid className={styles.column}>
          <Grid>
            <div className={classnames(styles.tokenGroup)}>
              <label className={styles.label}>Token</label>
              <input
                  type="text"
                  className={styles.input_token}
                  placeholder={`Enter Token`}
                  onChange={(e) => setToken(e.target.value)}
                  value={token}
              />
            </div>
            <div className={styles.error_container}>{ (token.length <= 0 || !token) && <p className={styles.error}>Required</p>}</div>
          </Grid>
          <Grid className={styles.row}>
            <div className={classnames(styles.tokenGroup)}>
              <label className={styles.label}>Pair</label>
              <input
                  type="text"
                  className={styles.input_token}
                  placeholder={`Enter pair`}
                  onChange={(e) => setPair(e.target.value)}
                  value={pair}
              />
            </div>
            <div className={styles.error_container}>{ (pair.length <= 0 || !pair) && <p className={styles.error}>Required</p>}</div>
          </Grid>
        </Grid>

      </div>
    </CustomMsgFormContainer>
      </Page>
  )
}

export default AddDistributionToken
