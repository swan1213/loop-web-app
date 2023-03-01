import useNewContractMsg from "../terra/useNewContractMsg"
import FormContainer from "./FormContainer"
import { useLocation } from "react-router-dom"
import { insertIf } from "../libs/utils"
import useURL from "../graphql/useURL"
import { useEffect, useMemo, useState } from "react"
import useAddress from "../hooks/useAddress"
import {useProtocol} from "../data/contract/protocol"


const DistributionForm = () => {
  const { pathname } = useLocation()
  const name = pathname.substring(1)
  const getName = {
    "team-distribution": "loop_distribution_team",
    "investor-distribution": "loop_distribution_investor",
  }

  const { contracts } = useProtocol()
  const address = useAddress()
  const getURL = useURL()

  /* output */
  const [isWhitelisted, setWhitelisted] = useState(false)
  const [amount, setAmount] = useState("0")

  /* submit */
  const newContractMsg = useNewContractMsg()

  /* fetch */
  const queryClaimStatus = async () => {
    const message = {
      user_reward_unit: {
        addr: address
      }
    }
    const url = getURL(contracts[getName[name]] ?? "", JSON.stringify(message))
    const response = await fetch(url)
    const data = await response.json()
    if (parseInt(data.result) > 0) {
      setWhitelisted(true)
      const amount = await queryClaimAmount()
      setAmount(amount)
    } else {
      setWhitelisted(false)
    }
  }

  /* fetch */
  const queryClaimAmount = async () => {
    const message = {
      user_reward: {
        addr: address
      }
    }
    const url = getURL(contracts[getName[name]] ?? "", JSON.stringify(message))
    const response = await fetch(url)
    const data = await response.json()
    return data.result
  }

  useEffect(() => {
    queryClaimStatus()
  }, [name, address,contracts])

  const container = useMemo(() => {

    const contents =
      isWhitelisted
        ? [
          {
            title: "Reward",
            content: `${amount}`,
          },
        ]
        : undefined

    // @ts-ignore
    const data = [
      newContractMsg(contracts[getName[name]] ?? "", {
        claim: {}
      })
    ]

    const notEligible = (
      <div>
        You're not eligible for the distribution.
      </div>
    )

    const messages =
      [
        ...insertIf(!isWhitelisted, notEligible),
      ] ?? undefined

    const disabled = !isWhitelisted

    /* result */
    const parseTx = undefined
    return {
      contents,
      messages,
      disabled,
      data,
      parseTx,
      verifyUstBalance: !(true),
    }
  }, [isWhitelisted, amount])

  const props = {
    tab: { tabs: ['claim'], current: 'claim' },
    label: "Claim",
  }

  return <FormContainer {...container} {...props} />
}

export default DistributionForm
