import { gt } from "../libs/math"
import useNewContractMsg from "../terra/useNewContractMsg"
import { LOOP } from "../constants"
import { formatAsset } from "../libs/parse"
import FormContainer from "./FormContainer"
import useAdminAirdrops from "../statistics/useAdminAirdrops"
import {useProtocol} from "../data/contract/protocol";

const AdminClaimAirdropForm = () => {
  /* context */
  const { loading, amount } = useAdminAirdrops()
  const { contracts } = useProtocol()

  /* confirm */
  const contents = [{ title: "Amount", content: formatAsset(amount, LOOP) }]

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = [
    newContractMsg(contracts["loop_airdrop"], {
      claim: {},
    }),
  ]

  const messages = !loading ? undefined : undefined

  const disabled = !gt(amount, 0)

  /* result */
  const parseTx = undefined
  const container = { contents, messages, disabled, data, parseTx }
  const props = {
    tab: { tabs: ["Airdrop"], current: "Airdrop" },
    label: "Claim",
  }

  return <FormContainer {...container} {...props} />
}

export default AdminClaimAirdropForm
