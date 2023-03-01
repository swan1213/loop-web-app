import useNewContractMsg from "../../terra/useNewContractMsg"
import Count from "../../components/Count"
import useClaimReceipt from "../receipts/useClaimReceipt"
import FormContainer from "../FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import {useClaimBonusList} from "../../data/contract/migrate";

const ClaimForm = () => {

  /* context */
  const { contracts } = useProtocol()
  const { bonusList } = useClaimBonusList()

  const list = bonusList
    ? bonusList.map((item) => {
        return {
          title: item.name ?? "Token",
          content: <Count symbol={""}>{item?.fullyvested ?? "0"}</Count>,
        }
      })
    : []

  /* confirm */
  const contents = bonusList ? list : []

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["loop_farm_staking"] ?? "", {
      claim: {},
    }),
  ]

  const disabled = !bonusList.length

  /* result */
  const parseTx = useClaimReceipt()

  const container = { contents, disabled, data, parseTx }
  const props = { tab: { tabs: ["Claim"], current: "Claim" }, label: "Claim" }

  return <FormContainer {...container} {...props} />
}

export default ClaimForm
