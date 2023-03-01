import { useEffect, useState } from "react"
import { gql, useQuery } from "@apollo/client"

import { LOOP } from "../../constants"
import { BalanceKey } from "../../hooks/contractKeys"
import WithResult from "../../containers/WithResult"
import { Di } from "../../components/Dl"
import styles from "./GovMIRFooter.module.scss"
import { div } from "../../libs/math"
import useAddress from "../../hooks/useAddress"
import {useProtocol} from "../../data/contract/protocol";

const GovMIRFooter = () => {
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

  const [staked, setStaked] = useState(0)
  // const { find } = useContract()
  const address = useAddress()
  const { data: stakedLoop } = useQuery(QUERY, {
    variables: {
      contract: contracts["loop_staking"] ?? "",
      msg: `{"stake":{"name":"${address}"}}`,
    },
  })

  useEffect(() => {
    setStaked(
      stakedLoop !== undefined
        ? JSON.parse(stakedLoop.WasmContractsContractAddressStore.Result)
        : 0
    )
  }, [stakedLoop])

  const contents = [
    {
      title: `Staked ${LOOP}`,
      content: (
        <WithResult keys={[BalanceKey.MIRGOVSTAKED]}>
          {stakedLoop !== undefined ? div(staked, 1000000) : ""}
        </WithResult>
      ),
    },
    {
      title: `Stakable ${LOOP}`,
      content: (
        /*<WithResult keys={[BalanceKey.TOKEN]}>
          {formatAsset(find(BalanceKey.TOKEN, getToken(LOOP)), LOOP)}
        </WithResult>*/
          "0"
      ),
    },
  ]

  return (
    <footer className={styles.footer}>
      {contents.map((item, index) => (
        <article className={styles.item} key={index}>
          <Di {...item} fontSize={16} type="vertical" align="center" />
        </article>
      ))}
    </footer>
  )
}

export default GovMIRFooter
