import useNewContractMsg from "../../terra/useNewContractMsg"
import { LOOP } from "../../constants"
import { minus } from "../../libs/math"
import { toAmount } from "../../libs/parse"
import useForm from "../../libs/useForm"
import {
  placeholder,
  renderMax,
  step,
  validate as v
} from "../../libs/formHelpers"

import FormGroup from "../../components/FormGroup"
import useStakeReceipt from "../receipts/useStakeReceipt"
import FormContainer from "../FormContainer"
import { Type } from "../../pages/Admin/RewardStaking"
import {useTokenMethods} from "../../data/contract/info";
import {useProtocol} from "../../data/contract/protocol";
import {useAirdropTotalStaked, useTokenBalanceByLoopStake} from "../../data/contract/migrate";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  token: string
  tab?: Tab
}

const FarmStakeFarm = ({token, tab, type }: Props) => {

  /* context */
  const { contracts } = useProtocol()
  const { getSymbol } = useTokenMethods()

  const { getToken } = useProtocol()

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    return { [Key.value]: v.required(value) }
  }

  const { contents: total_staked } = useAirdropTotalStaked()

  const balance   = useTokenBalanceByLoopStake(getToken(LOOP))

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, getFields, attrs, invalid } = form
  const { value } = values
  const amount = toAmount(value)
  const symbol = getSymbol(token)

  /* render:form */
  const fields = getFields({
    [Key.value]: {
      label: "Amount",
      input: {
        type: "number",
        step: step(symbol),
        placeholder: placeholder(symbol),
        autoFocus: true,
      },
      unit: LOOP,
      help: renderMax(
        (minus(balance, total_staked)),
        'Remaining'
      ),
    },
  })

  const contents = undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.REWARD]: [
      newContractMsg(contracts["loop_staking"], {
        add_distribution_asset: { asset: {
            info: {token:{contract_addr: token}},
            amount
          }},
      }),
    ]
  }[type as Type]

  const messages = undefined

  const disabled = invalid

  /* result */
  const parseTx = useStakeReceipt(false,type)

  const container = { tab, attrs, contents, messages, disabled, data, parseTx }

  return (
    <FormContainer
      {...container}
    >
      <FormGroup {...fields[Key.value]} />
    </FormContainer>
  )
}

export default FarmStakeFarm
