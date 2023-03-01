import useNewContractMsg from "../../terra/useNewContractMsg"
import { useRefetch } from "../../hooks"
import { AccountInfoKey } from "../../hooks/contractKeys"
import Count from "../../components/Count"
import useClaimReceipt from "../receipts/useClaimReceipt"
import FormContainer from "../FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import {useClaimBonusList} from "../../data/contract/migrate";

const ClaimBonusForm = () => {
  useRefetch([AccountInfoKey.UUSD])

  /* context */
  const { contracts } = useProtocol()
  const { bonusList } = useClaimBonusList()

  const list = bonusList
    ? bonusList.map((item) => {
        return {
          title: item.name ?? "Token",
          content: <Count symbol={""}>{item?.bonus ?? "0"}</Count>,
        }
      })
    : []

  /* confirm */
  const contents = bonusList ? list : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["loop_farm_staking"] ?? "", {
      claim_bonus: {},
    }),
  ]

  const disabled = !bonusList.length

  /* result */
  const parseTx = useClaimReceipt()

  const container = { contents, disabled, data, parseTx }
  const props = {
    tab: { tabs: ["Claim Bonus"], current: "Claim Bonus" },
    label: "Claim Bonus",
  }

  return <FormContainer {...container} {...props} />
}

export default ClaimBonusForm
