import {TxResult, useWallet} from "@terra-money/wallet-provider"
import classnames from "classnames"
import { Fee } from "@terra-money/terra.js"
import useFee from "../../graphql/useFee"

import styles from "./FarmUserStakeV4.module.scss"
import Button from "../Button"
import {
  FarmContractTYpe,
} from "../../data/farming/FarmV2"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { plus } from "../../libs/math"
import {PostError} from "../../forms/FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import {useGetUserAutoCompoundSubriptionFarm4} from "../../data/contract/migrate";

interface Props {
  lp: string,
  farmContractType: FarmContractTYpe,
  farmResponseFun: (res: TxResult | undefined, errors: PostError | undefined, type?: string) => void,
}

const AutoCompoundBtn = ({farmResponseFun, lp, farmContractType}: Props) => {

  const newContractMsg = useNewContractMsg()
  const { contracts } = useProtocol()
  const {contents: findAutoCompundStatus} = useGetUserAutoCompoundSubriptionFarm4(farmContractType)
  const disabled =  findAutoCompundStatus[lp] ?? false

  const msgs = [
    newContractMsg(contracts["loop_farm_staking_v4"], {
      opt_for_auto_compound: {
        pool_address: lp ?? "",
        opt_in: true,
      }

    })
  ]

  /* submit */

  const fee = useFee()
  const { post } = useWallet()

  const submit = async () => {

    try {
      const { gas, amount: feeAmount } = fee
      const txOptions = {
        msgs,
        fee: new Fee(gas, { uusd: plus(feeAmount, undefined) }),
        purgeQueue: true,
      }

      const response = await post(txOptions)

      farmResponseFun(response, undefined)
    }catch (error) {
      farmResponseFun(undefined, error)
    }
  }

  return (
      <Button className={classnames(styles.stake_unstake_btn, disabled ? styles.disabled : '')} disabled={disabled} onClick={disabled ? ()=> {} : submit}>Auto Compound</Button>
  )
}

export default AutoCompoundBtn
