import Tooltip from "../../lang/Tooltip.json"
import { LOOP } from "../../constants"
import { div } from "../../libs/math"
import { percent } from "../../libs/num"
import useDashboard from "../../statistics/useDashboard"
import Grid from "../../components/Grid"
import Card from "../../components/Card"
import Summary from "../../components/Summary"
import { TooltipIcon } from "../../components/Tooltip"
import CountWithResult from "../../containers/CountWithResult"
import GovMIR from "./GovMIR"
import styles from "./GovHomeHeader.module.scss"
import { useQuery } from "@apollo/client"
import { lookupSymbol } from "../../libs/parse"
import { useEffect, useState } from "react"
import { CONTRACT } from "../../graphql/gqldocs"
import useAddress from "../../hooks/useAddress"
import total_staked_icon from "../../images/icons/gov/total_staked.svg"
import staking_ratio_icon from "../../images/icons/gov/staking_ratio.svg"
import {useProtocol} from "../../data/contract/protocol";

const GovHomeHeader = () => {
  const { contracts } = useProtocol()
  const dashboard = useDashboard()

  const address = useAddress()
  const { data: allStakedLoop, refetch: refetchAllStaked } = useQuery(
    CONTRACT,
    {
      variables: {
        contract: contracts["loop_staking"] ?? "",
        msg: '{"all_stake":{}}',
      },
    }
  )

  useEffect(() => {
    refetchAllStaked()
    refetchStakedLoop()
  }, [])

  const { data: stakedLoop, refetch: refetchStakedLoop } = useQuery(CONTRACT, {
    variables: {
      contract: contracts["loop_staking"] ?? "",
      msg: `{"stake":{"name":"${address}"}}`,
    },
  })

  const [staked, setStaked] = useState(0)
  const [totalStaked, setTotalStaked] = useState(0)
  // const [ratio, setRatio] = useState('');

  useEffect(() => {
    setStaked(
      stakedLoop !== undefined
        ? JSON.parse(stakedLoop.WasmContractsContractAddressStore.Result)
        : 0
    )
  }, [stakedLoop])

  useEffect(() => {
    setTotalStaked(
      allStakedLoop !== undefined
        ? JSON.parse(allStakedLoop.WasmContractsContractAddressStore.Result)
        : 0
    )
  }, [allStakedLoop])

  return (
    <Grid>
      <div className={styles.sm}>
        <Grid>
          <Card className={styles.static_card}>
            <Summary
              icon={total_staked_icon}
              title={
                <TooltipIcon content={Tooltip.Gov.TotalStaked}>
                  Total Staked
                </TooltipIcon>
              }
            >
              {allStakedLoop !== undefined
                ? `${div(totalStaked, 1000000)} ${lookupSymbol(LOOP)}`
                : ""}
            </Summary>
          </Card>
        </Grid>

        <Grid>
          <Card className={styles.static_card}>
            <Summary
              icon={staking_ratio_icon}
              title={
                <TooltipIcon content={Tooltip.Gov.StakingRatio}>
                  Staking Ratio
                </TooltipIcon>
              }
            >
              <CountWithResult results={[dashboard]} format={percent}>
                {div(staked.toString(), totalStaked.toString())}
              </CountWithResult>
            </Summary>
          </Card>
        </Grid>
      </div>

      <div className={styles.lg}>
          <GovMIR />
      </div>
    </Grid>
  )
}

export default GovHomeHeader
