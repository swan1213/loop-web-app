import useNewContractMsg from "../../terra/useNewContractMsg"
import useForm from "../../libs/useForm"
import {
  placeholder,
  step,
  validate as v
} from "../../libs/formHelpers"

import styles from "./RewardsInfo.module.scss"
import useStakeReceipt from "../receipts/useStakeReceipt"
import FormContainer from "../FormContainer"
import { Type } from "../../pages/Admin/RewardsInfo"
import {number} from "../../libs/math";
import { Container, Grid } from "semantic-ui-react"
import { Card } from "@material-ui/core"
import {useProtocol} from "../../data/contract/protocol";

enum Key {
  value = "value",
}

interface Props {
  type: Type
  tab?: Tab
}

const RewardsInfoForm = ({tab, type }: Props) => {

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
    [Type.REWARDS_INFO]: [
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
    <Container>
      <Grid className={styles.wrapper}> 
          <Card className={styles.card}>
              <h1>Rewards per hour</h1>
          </Card>
        
          <Card className={styles.card}>
              <h1>Rewards per hour</h1>
          </Card>
       
      </Grid>
    </Container>
  )
}

export default RewardsInfoForm
