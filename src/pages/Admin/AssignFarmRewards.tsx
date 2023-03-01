import Container from "../../components/Container"
import styles from "./AssignFarmReward.module.scss"
import classNames from "classnames"
import React, { useState } from "react"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import useSelectSwapAsset from "../../forms/Exchange/useSelectSwapAsset"
import ContractButton from "../../components/ContractButton"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"
import useNewContractMsg from "../../terra/useNewContractMsg"
import useStakeReceipt from "../../forms/receipts/useStakeReceipt"
import Result from "../../forms/Result"
import { useFindTokenDetails } from "../../data/form/select"
import { lookupSymbol } from "../../libs/parse"
import LinkButton from "../../components/LinkButton"
import Page from "../../components/Page"
import { FarmContractTYpe, listOfStakeableTokensQueryFarm2,listOfStakeableTokensQueryFarm3 } from "../../data/farming/FarmV2"
import { useRecoilValue } from "recoil"
import { getLpArray } from "./helpers"
import {useProtocol} from "../../data/contract/protocol"

const AssignFarmRewards = () => {
  const findTokenDetailFn = useFindTokenDetails()

  const [lpToken, setLpToken] = useState("")
  const [token, setToken] = useState("terra1nef5jf6c7js9x6gkntlehgywvjlpytm7pcgkn4")
  const [amount, setAmount] = useState("")
  const [ustPair, setUstPair] = useState("terra106a00unep7pvwvcck4wylt4fffjhgkf9a0u6eu")

  const onSelect = (name: string) => (token: string) => {
    setLpToken(token)
  }
  const symbol = findTokenDetailFn?.(lpToken, "lp")?.tokenSymbol ?? ""

  const farm2=useRecoilValue(listOfStakeableTokensQueryFarm2(FarmContractTYpe.Farm2))
  const farm3=useRecoilValue(listOfStakeableTokensQueryFarm3(FarmContractTYpe.Farm3))

  const farm2Lp=getLpArray(farm2)
  const farm3Lp=getLpArray(farm3)

  const farmingAddress = farm2Lp.includes(lpToken) ? "loop_farm_staking_v2" : farm3Lp.includes(lpToken) ? "loop_farm_staking_v3" : '';


  /* render:form */
  const config = {
    token: lpToken,
    symbol: lookupSymbol(symbol) ?? "",
    onSelect: onSelect("1"),
    priceKey: undefined,
    balanceKey: undefined,
    formatTokenName: undefined,
    formatPairToken: true,
    showAsPairs: true,
    showQuickTokens: false,
  }

  const select = useSelectSwapAsset(config)

  const disabled = [lpToken, token, amount, ustPair].some(
    (item) => !item && !item.length
  )

  const [response, setResponse] = useState<TxResult>()
  const [error, setError] = useState<PostError>()

  const setResponseFunc = (
    res: TxResult | undefined,
    err: PostError | undefined
  ) => {
    if (res) {
      setResponse(res)
    }
    if (err) {
      setError(err)
    }
  }

  const newContractMsg = useNewContractMsg()
  const { contracts } = useProtocol()
  const data = [
    newContractMsg(contracts[farmingAddress] ?? "", {
      update_reward: {
        pool: lpToken,
        rewards: [
          [
            { info: { token: { contract_addr: token } }, amount: amount },
            ustPair,
          ],
        ],
      },
    }),
  ]

  /* result */
  const parseTx = useStakeReceipt(false,null)

  const reset = () => {
    setResponse(undefined)
    setError(undefined)
  }
  const goGoAdminLink = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }

  return (
    <Page title={" "} action={<LinkButton {...goGoAdminLink} />}>
      <Container sm>
        {response || error ? (
          <Result
            response={response}
            error={error}
            parseTx={parseTx}
            onFailure={reset}
          />
        ) : (
          <Card title={"Farm Rewards"}>
            <Grid className={styles.container}>
              <Grid className={styles.row}>{select.button}</Grid>
              <Grid className={styles.row}>{select.assets}</Grid>
              <Grid className={styles.row}>
                <div className={styles.inputContainer}>
                  <div className={classNames(styles.tokenGroup)}>
                    <label className={styles.label}>Token Addr</label>
                    <input
                      type="text"
                      className={styles.input_token}
                      placeholder={`Enter Token addr`}
                      name="reward"
                      disabled={true}
                      onChange={(e) => setToken(e.target.value)}
                      value={token}
                    />
                    <div className={styles.error_container}>
                      {(token.length <= 0 || !token) && (
                        <p className={styles.error}>Required</p>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid className={styles.row}>
                <div className={styles.inputContainer}>
                  <div className={classNames(styles.tokenGroup)}>
                    <label className={styles.label}>Amount</label>
                    <input
                      type="number"
                      className={styles.input_token}
                      placeholder={`Enter amount`}
                      name="reward"
                      onChange={(e) => setAmount(e.target.value)}
                      value={amount}
                    />
                    <div className={styles.error_container}>
                      {(amount.length <= 0 || !amount) && (
                        <p className={styles.error}>Required</p>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid className={styles.row}>
                <div className={styles.inputContainer}>
                  <div className={classNames(styles.tokenGroup)}>
                    <label className={styles.label}>UST pair Addr</label>
                    <input
                      type="text"
                      className={styles.input_token}
                      placeholder={`Enter UST pair addr`}
                      name="reward"
                      disabled={true}
                      onChange={(e) => setUstPair(e.target.value)}
                      value={ustPair}
                    />
                    <div className={styles.error_container}>
                      {(ustPair.length <= 0 || !ustPair) && (
                        <p className={styles.error}>Required</p>
                      )}
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid>
                <ContractButton
                  data={data}
                  setResponse={setResponseFunc}
                  disabled={disabled}
                  label={"Submit"}
                />
              </Grid>
            </Grid>
          </Card>
        )}
      </Container>
    </Page>
  )
}

export default AssignFarmRewards
