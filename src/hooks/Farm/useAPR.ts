/*
import {useRecoilValue} from "recoil";
import {aprQuery} from "../../data/contract/migrate";

//migrated
export default () => {
  const data = useRecoilValue(aprQuery)
  return { simulated: data }
}
*/

import { useEffect, useState } from "react"
import { useContractsAddress } from "../../hooks"
import { useQuery } from "@apollo/client"
import { CONTRACT } from "../../graphql/gqldocs"
import {useProtocol} from "../../data/contract/protocol";

export interface SimulatedAsset {
  asset: {
    token: {
      contract_addr: string
    }
  }
  apr: string
  apy: string
  liqval: string
}

export default () => {
  const { contracts } = useProtocol()

  const [data, setData] = useState<any[]>()

  const { refetch } = useQuery(CONTRACT, {
    fetchPolicy: "cache-and-network",
    variables: {
      contract: contracts["loop_farm_staking"] ?? "",
      msg: ` {"apry":{}}`,
    },
    onCompleted: (result) => {
      // const { Result } = result.WasmContractsContractAddressStore;

      setData(JSON.parse(result.WasmContractsContractAddressStore.Result))
    },
  })

  useEffect(() => {
    !data && refetch()
  }, [data])

  return { simulated: data }
}
