import { LOOP } from "../../constants"
import { gt, times } from "../../libs/math"
import { insertIf } from "../../libs/utils"
import { useContract, useCombineKeys } from "../../hooks"
import { BalanceKey, PriceKey } from "../../hooks/contractKeys"
import useAssetStats from "../../statistics/useAssetStats"
import useDashboard from "../../statistics/useDashboard"
import {useProtocol} from "../../data/contract/protocol";

interface Item extends ListedItem {
  gov?: boolean
}

const useMyStake = () => {
  const priceKey = PriceKey.PAIR
  const keys = [
    priceKey,
    BalanceKey.TOKEN,
    BalanceKey.LPSTAKED,
    BalanceKey.LPSTAKABLE,
    BalanceKey.REWARD,
  ]

  const { loading, data } = useCombineKeys(keys)
  const { listedAll, whitelist, getToken } = useProtocol()
  const { find, rewards } = useContract()

  const { apr } = useAssetStats()
  const { dashboard } = useDashboard()

  const loop = getToken(LOOP)

  const getData = (item: Item) => {
    const { token, gov } = item

    return {
      ...item,
      apr: !gov ? apr[token] : dashboard?.govAPR,
      staked: find(BalanceKey.LPSTAKED, token),
      stakable: find(!gov ? BalanceKey.LPSTAKABLE : BalanceKey.TOKEN, token),
      reward: !gov ? find(BalanceKey.REWARD, token) : undefined,
    }
  }

  const dataSource = !data
    ? []
    : [
        ...insertIf(
          gt(find(BalanceKey.LPSTAKED, loop), 1),
          getData({ ...whitelist[loop], gov: true })
        ),
        ...listedAll
          .map(getData)
          .filter(({ staked, stakable, reward }) =>
            [staked, stakable, reward].some(
              (balance) => balance && gt(balance, 0)
            )
          ),
      ]

  const price = find(priceKey, loop)
  const totalRewards = rewards
  const totalRewardsValue = times(rewards, price)
  const govStakedValue = times(find(BalanceKey.MIRGOVSTAKED, loop), price)

  return {
    keys,
    loading,
    dataSource,
    price,
    totalRewards,
    totalRewardsValue,
    govStakedValue,
  }
}

export default useMyStake
