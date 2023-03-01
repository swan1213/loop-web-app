import { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { useContractsAddress } from "../hooks"
import useAddress from "../hooks/useAddress"
import {useProtocol} from "../data/contract/protocol";

export default () => {
  const [amount, setAmount] = useState("")
  const address = useAddress()
  const { contracts } = useProtocol()

  const QUERY = gql`
    query($contract: String, $msg: String) {
      WasmContractsContractAddressStore(
        ContractAddress: $contract
        QueryMsg: $msg
      ) {
        Height
        Result
      }
    }
  `

  const { refetch, loading } = useQuery(QUERY, {
    variables: {
      contract: contracts["loop_airdrop"] ?? "",
      msg: `{"rewards":{"name":"${address}"}}`,
    },
    onCompleted: ({ WasmContractsContractAddressStore }) => {
      setAmount(JSON.parse(WasmContractsContractAddressStore.Result) ?? "")
    },
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  return { loading, amount }
}
