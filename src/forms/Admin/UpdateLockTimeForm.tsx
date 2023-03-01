import useNewContractMsg from "../../terra/useNewContractMsg"
import useForm from "../../libs/useForm"
import {
  placeholder,
  step,
  validate as v
} from "../../libs/formHelpers"

import FormGroup from "../../components/FormGroup"
import useStakeReceipt from "../receipts/useStakeReceipt"
import FormContainer from "../FormContainer"
import { Type } from "../../pages/Admin/UpdateLockTime"
import {number} from "../../libs/math";
import {useProtocol} from "../../data/contract/protocol";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  tab?: Tab
}

const UpdateLockTimeForm = ({tab, type }: Props) => {

  /* context */
  const { contracts } = useProtocol()

  /* form:validate */
  const validate = ({ value }: Values<Key>) => {
    return { [Key.value]: v.required(value) }
  }

  /* form:hook */
  const initial = { [Key.value]: "" }
  const form = useForm<Key>(initial, validate)
  const { values, getFields, attrs, invalid } = form
  const { value } = values

  /* render:form */
  const fields = getFields({
    [Key.value]: {
      label: "Time (in seconds)",
      input: {
        type: "number",
        step: step("Time"),
        placeholder: placeholder("Time (in seconds)"),
        autoFocus: true,
      },
    },
  })

  const contents = undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  const data = {
    [Type.LOCK_TIME]: [
      newContractMsg(contracts["loop_farm_staking_v2"], {
        update_lock_time_frame:{
          lock_time_frame: number(value)
        }
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

export default UpdateLockTimeForm
