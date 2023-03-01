import {DistributableTokensByPool} from "../../data/farming/stakeUnstake";
import { plus } from "../../libs/math";
import {decimal, numbers} from "../../libs/parse";
import {useCalculatePrice, useCalculatePriceFarm2} from "./CalculateAPR";
import {FarmContractTYpe} from "../../data/farming/FarmV2";

export const CalculateTVL = ({ tvl, lpToken, all_rewards }: {
  tvl: string
  lpToken: string
  all_rewards:  DistributableTokensByPool[] | undefined
}) => {
  const price = useCalculatePrice(all_rewards, lpToken)
  return (
    <>
      ${numbers(decimal(plus(price, tvl), 2))}
    </>
  )
}

export const CalculateTVLFarm2 = ({ tvl, lpToken, all_rewards, farmContractType }: {
  tvl: string
  lpToken: string
  all_rewards:  DistributableTokensByPool[] | undefined
  farmContractType:  FarmContractTYpe
}) => {
  const price = useCalculatePriceFarm2({all_rewards, lpToken, type: farmContractType})
  return (
      <>
        ${numbers(decimal(plus(price, tvl), 2))}
      </>
  )
}
