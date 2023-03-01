import { useRouteMatch } from "react-router-dom"

import { UUSD, LOOP } from "../../constants"
import { minus, number } from "../../libs/math"
import { AssetInfoKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"

import Grid from "../../components/Grid"
import StakeItemCard from "../../components/StakeItemCard"
import LoadingTitle from "../../components/LoadingTitle"
import CountWithResult from "../../containers/CountWithResult"
import usePool from "../../forms/usePool"

import StakeListTitle from "./StakeListTitle"
import styles from "./StakeList.module.scss"
import {useProtocol} from "../../data/contract/protocol";

const StakeList = () => {
  const { url } = useRouteMatch()
  const loading = false

  /* context */
  const { listed, getSymbol } = useProtocol()
  const stats = useAssetStats()
  const { apr } = stats
  const getPool = usePool()

  const getItem = ({ token }: ListedItem) => {
    const apy = stats["apy"][token] ?? "0"
    const apr = stats["apr"][token] ?? "0"
    const symbol = getSymbol(token)

    // const totalStakedLP = find(AssetInfoKey.LPTOTALSTAKED, token)
    const totalStakedLP = "0"
    const { fromLP } = getPool({ amount: totalStakedLP, token })

    // const staked = gt(find(BalanceKey.LPSTAKED, token), 0)
    const staked = true

    // const stakable = gt(find(BalanceKey.LPSTAKABLE, token), 0)
    const stakable = true

    return {
      token,
      symbol,
      staked: staked,
      stakable: stakable,
      apr,
      apy,
      totalStaked: (
        <CountWithResult
          keys={[AssetInfoKey.LPTOTALSTAKED]}
          symbol={UUSD}
          integer
        >
          {fromLP.value}
        </CountWithResult>
      ),
      to: `${url}/${token}`,
      emphasize: symbol === LOOP,
    }
  }

  return (
    <article>
      <LoadingTitle className={styles.encourage} loading={loading}>
        <StakeListTitle />
      </LoadingTitle>

      <Grid wrap={3}>
        {listed
          .map(getItem)
          .sort(({ token: a }, { token: b }) => number(minus(apr[b], apr[a])))
          .sort(
            ({ symbol: a }, { symbol: b }) =>
              Number(b === LOOP) - Number(a === LOOP)
          )
          .map((item) => (
            <StakeItemCard {...item} key={item.token} />
          ))}
      </Grid>
    </article>
  )
}

export default StakeList
