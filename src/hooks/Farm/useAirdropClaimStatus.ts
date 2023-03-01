/*
import {useRecoilValue} from "recoil";
import {airdropClaimStatusQuery} from "../../data/contract/migrate";

export default (stage: string | undefined, contract: string) => {
  const data  = useRecoilValue<{is_claimed: boolean}| undefined>(airdropClaimStatusQuery({ stage, contract}))

  return { status: data }
}
*/

import { useEffect, useState } from "react"
import { useContractsAddress } from "../../hooks"
import { useQuery } from "@apollo/client"
import { CONTRACT } from "../../graphql/gqldocs"
import useAddress from "../useAddress"

export default (stage: string | undefined, contract: string) => {
  const address = useAddress()
  const [data, setData] = useState<{is_claimed: boolean}| undefined>()

  const { refetch } = useQuery(CONTRACT, {
    fetchPolicy: "cache-and-network",
    skip: !stage && !contract,
    variables: {
      contract: contract ?? "",
      msg: ` {"is_claimed":{"stage":${stage}, "address":"${address}"}}`,
    },
    onCompleted: (result) => {
      const { Result } = result.WasmContractsContractAddressStore;

      Result && setData(JSON.parse(Result))
    },
    onError: () => {
      setData(undefined)
    }
  })

  useEffect(() => {
    !data && refetch()
  }, [data])

  return { status: data }
}
