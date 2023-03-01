import useNewContractMsg from "../terra/useNewContractMsg"
import { LOOP } from "../constants"
import { formatAsset } from "../libs/parse"
import FormContainer from "./FormContainer"
import useAdminAirdrops from "../statistics/useAdminAirdrops"
import React, { useState } from "react"
import styles from "./AdminAirdropForm.module.scss"
import {useProtocol} from "../data/contract/protocol";

const AirdropForm = () => {
  /* context */
  const { loading, amount } = useAdminAirdrops()
  const { contracts } = useProtocol()

  /* confirm */
  const contents = [{ title: "Amount", content: formatAsset(amount, LOOP) }]

  const [input, setInput] = useState<{ token: string; value: string }[]>([
    { token: "", value: "" },
  ])

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["loop_airdrop"], {
      set_reward: {
        coll: [
          ...input
            .filter((input: { token: string; value: string }) => {
              return input.token.length > 0 && input.value.length > 0
            })
            .map((input: { token: string; value: string }) => {
              return [input.token, input.value]
            }),
        ],
      },
    }),
  ]

  const messages = !loading ? undefined : undefined

  const disabled = !input.every(
    (inp: { token: string; value: string }) =>
      inp.token.length > 0 && inp.value.length > 0
  )
  /* result */
  const parseTx = undefined
  const container = { contents, messages, disabled, data, parseTx }

  return (
    <FormContainer {...container} parseTx={parseTx}>
      {/*<FormIcon name="add" onClick={() => handleAddClick()} />*/}
      {/*<div className={styles.inputs}>{ListComponent()}</div>*/}
      <div>
        <label>JSON</label>
        <textarea
          className={styles.input_token}
          placeholder="Token Address"
          name="token"
          onChange={(e) => setInput(JSON.parse(e.target.value))}
          value={JSON.stringify(input)}
          rows={20}
        />
      </div>
    </FormContainer>
  )
}

export default AirdropForm
