import { Dictionary } from "ramda"
import { UUSD, LOOP } from "../constants"
import { plus, div, floor, gt } from "../libs/math"
import calc from "../helpers/calc"
import { PriceKey, AssetInfoKey, GOVStakedKey } from "../hooks/contractKeys"
import { BalanceKey, AccountInfoKey } from "../hooks/contractKeys"
import { Type } from "../pages/PoolDynamic"
import {useProtocol} from "../data/contract/protocol";

export default () => {
  const { listedAll, getToken } = useProtocol()

  const price = {
    [PriceKey.PAIR]: (pairPool: Dictionary<PairPool>) =>
      dict(pairPool, calcPairPrice),
    [PriceKey.ORACLE]: (oraclePrice: Dictionary<Rate>) =>
      dict(oraclePrice, ({ rate }) => rate),
  }

  const contractInfo = {
    [AssetInfoKey.LIQUIDITY]: (pairPool: Dictionary<PairPool>) =>
      dict(pairPool, (pool) => parsePairPool(pool).asset),
    [AssetInfoKey.MINCOLLATERALRATIO]: (mintInfo: Dictionary<MintInfo>) =>
      dict(mintInfo, ({ min_collateral_ratio }) => min_collateral_ratio),
    [AssetInfoKey.LPTOTALSTAKED]: (stakingPool: Dictionary<StakingPool>) =>
      dict(stakingPool, ({ total_bond_amount }) => total_bond_amount),
    [AssetInfoKey.LPTOTALSUPPLY]: (lpTokenInfo: Dictionary<TotalSupply>) =>
      dict(lpTokenInfo, ({ total_supply }) => total_supply),
  }
  // @ts-ignore
  const balance = {
    [BalanceKey.TOKEN]: (tokenBalance: Dictionary<Balance>) =>
      dict(tokenBalance, ({ balance }) => balance),
    [BalanceKey.LPTOTAL]: (
      lpTokenBalance: Dictionary<Balance>,
      stakingReward: StakingReward
    ) => reduceLP(listedAll, { lpTokenBalance, stakingReward }),
    [BalanceKey.LPSTAKABLE]: (lpTokenBalance: Dictionary<Balance>) =>
      dict(lpTokenBalance, ({ balance }) => balance),
    [BalanceKey.LPSTAKED]: (stakingReward: StakingReward) =>
      reduceBondAmount(stakingReward),
    [BalanceKey.MIRGOVSTAKED]: (govStake: Balance) => {
      const token = getToken(LOOP)
      return { [token]: govStake.balance }
    },
    [BalanceKey.REWARD]: (
      stakingPool: Dictionary<StakingPool>,
      stakingReward: StakingReward
    ) =>
      dict(stakingPool, ({ reward_index: globalIndex }, token) => {
        const { reward_infos } = stakingReward
        const info = reward_infos?.find((info) => info.asset_token === token)
        return floor(calc.reward(globalIndex, info))
      }),
  }

  const accountInfo = {
    [AccountInfoKey.UUSD]: (bankBalance: BankBalance) =>
      findBalance(UUSD, bankBalance),
  }

  const govStaked = {
    [GOVStakedKey.STAKEDLOOP]: (bankBalance: string) => {
      // findBalance(UUSD, bankBalance)
    },
  }

  return { price, contractInfo, balance, accountInfo, govStaked }
}

/* utils */
export const dict = <Data, Item = string>(
  dictionary: Dictionary<Data>,
  selector: (data: Data, token?: string) => Item
) =>
  Object.entries(dictionary).reduce<Dict<Item>>(
    (acc, [token, data]) => ({ ...acc, [token]: selector(data, token) }),
    {}
  )

/* helpers */
const calcPairPrice = (param: PairPool) => {
  const { uusd, asset } = parsePairPool(param)
  return [uusd, asset].every((v) => v && gt(v, 0)) ? div(uusd, asset) : "0"
}

export const parsePairPool = ({ assets, total_share }: PairPool) => ({
  uusd: assets.find(({ info }) => "native_token" in info)?.amount ?? "0",
  asset: assets.find(({ info }) => "token" in info)?.amount ?? "0",
  total: total_share ?? "0",
})

/*export const parsePairPoolForMultiTokens = ({
  assets,
  total_share,
  token1,
  type
}: {
  assets: (AssetToken | NativeToken)[]
  total_share: string
  token1: string
  type: string
})*/
export const parsePairPoolForMultiTokens = (
  pairPoolResult: { assets: Assets[]; total_share: string },
  token1: string,
  type: string
) => {
  let uusd = "0"
  let asset = "0"

  if (type === Type.PROVIDE) {
    const pairOne = pairPoolResult?.assets?.find((asset) => {
      if (asset.info?.token !== undefined) {
        return asset.info?.token.contract_addr === token1
      } else {
        return (
          asset.info?.native_token !== undefined &&
          asset.info?.native_token.denom === token1
        )
      }
    })

    const pairTwo = pairPoolResult?.assets?.find((asset) => {
      if (asset.info?.token !== undefined) {
        return asset.info?.token.contract_addr !== token1
      } else {
        return (
          asset.info?.native_token !== undefined &&
          asset.info?.native_token.denom !== token1
        )
      }
    })

    uusd = pairOne?.amount ?? "0"
    asset = pairTwo?.amount ?? "0"
  } else {
    uusd = pairPoolResult.assets[0]?.amount ?? "0"
    asset = pairPoolResult.assets[1]?.amount ?? "0"
  }

  return {
    uusd: uusd ?? "0",
    asset: asset ?? "0",
    total: pairPoolResult.total_share ?? "0",
  }
}

interface LPParams {
  lpTokenBalance: Dictionary<Balance>
  stakingReward: StakingReward
}

const reduceLP = (
  listedAll: ListedItem[],
  { lpTokenBalance, stakingReward }: LPParams
) =>
  listedAll.reduce<Dictionary<string>>(
    (acc, { token }) => ({
      ...acc,
      [token]: plus(
        lpTokenBalance[token].balance,
        stakingReward.reward_infos.find(
          ({ asset_token }) => asset_token === token
        )?.bond_amount
      ),
    }),
    {}
  )

const reduceBondAmount = ({ reward_infos }: StakingReward) =>
  reward_infos.reduce<Dictionary<string>>(
    (acc, { asset_token, bond_amount }) => {
      return { ...acc, [asset_token]: bond_amount }
    },
    {}
  )

const findBalance = (denom: string, { BankBalancesAddress }: BankBalance) =>
  BankBalancesAddress?.Result.find(({ Denom }) => Denom === denom)?.Amount ??
  "0"
