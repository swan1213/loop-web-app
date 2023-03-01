import { useContractsAddress } from "../../hooks"
import useNewContractMsg from "../../terra/useNewContractMsg"
import CustomMsgFormContainer from "../../forms/CustomMsgFormContainer"
import { useState } from "react"
import styles from "./AssignFarmReward.module.scss"
import classnames from 'classnames'
import useHash from "../../libs/useHash"
import LinkButton from "../../components/LinkButton";
import {MenuKey} from "../Admin";
import Page from "../../components/Page";
import {useProtocol} from "../../data/contract/protocol";

export enum Type {
  "STAKEABLE_TOKENS" = "stakeable-tokens",
}

const AddStakeableTokens = () => {
  const { hash: type } = useHash<Type>(Type.STAKEABLE_TOKENS)
  const tab = {
    tabs: [Type.STAKEABLE_TOKENS],
    tooltips: [],
    current: type,
  }
  const [lp, setLp] = useState('')
  const [firstPair, setFirstPair] = useState('')
  const [secondPair, setSecondPair] = useState('')

  const newContractMsg = useNewContractMsg()
  const { contracts } = useProtocol()

  const data = [
    newContractMsg(contracts["loop_farm_staking_v2"], {
      add_stakeable_token: {
        token: { token: { contract_addr: lp}},
        pair_add: firstPair,
        pair_add2: secondPair,
      },
    })
  ]

  const disabled = !lp && (!firstPair && !firstPair.length) && (!secondPair && !secondPair.length)

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
        <div className={classnames(styles.tokenGroup)}>
          <label className={styles.label}>Enter LPToken</label>
          <input
            type="text"
            className={styles.input_token}
            placeholder={`Enter LPToken`}
            onChange={(e) => setLp(e.target.value)}
            value={lp}
          />
        </div>
        <div className={styles.error_container}>{ (parseFloat(lp) <= 0 || !lp) && <p className={styles.error}>Required</p>}</div>
      </div>
      <div className={styles.inputContainer}>
        <div className={classnames(styles.tokenGroup)}>
          <label className={styles.label}>First Pair</label>
          <input
            type="text"
            className={styles.input_token}
            placeholder={`Enter First Pair`}
            onChange={(e) => setFirstPair(e.target.value)}
            value={firstPair}
          />
        </div>
        <div className={styles.error_container}>{ (firstPair.length <= 0 || !firstPair) && <p className={styles.error}>Required</p>}</div>
      </div>
      <div className={styles.inputContainer}>
        <div className={classnames(styles.tokenGroup)}>
          <label className={styles.label}>Second Pair</label>
          <input
            type="text"
            className={styles.input_token}
            placeholder={`Enter Second Pair`}
            onChange={(e) => setSecondPair(e.target.value)}
            value={secondPair}
          />
        </div>
        <div className={styles.error_container}>{ (secondPair.length <= 0 || !secondPair) && <p className={styles.error}>Required</p>}</div>
      </div>
    </CustomMsgFormContainer>
      </Page>
  )
}

export default AddStakeableTokens
