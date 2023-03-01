import FarmRewardsRow, {FarmRewardsRowFarm2} from "./FarmRewardsRow";
import styles from './FarmRewards.module.scss'
import {FarmContractTYpe} from "../../data/farming/FarmV2";

interface Props {
  data: undefined | FarmReward[]
    farmType: FarmContractTYpe
}

export interface FarmReward {
    daily_reward: string,
    info: {
        token: { contract_addr: string }
    }
}

const FarmRewards = ({ data }: Props) => {
  return (
        <div className={styles.flex}>
          {
            data && data.map((item:FarmReward, index) => (<FarmRewardsRow item={item} key={index} />))
          }
        </div>
  )
}

export default FarmRewards


export const FarmRewardsFarm2 = ({ data, farmType }: Props) => {
    return (
        <div className={styles.flex}>
            {
                data && data.map((item:FarmReward, index) => (<FarmRewardsRowFarm2 farmType={farmType} item={item} key={index} />))
            }
        </div>
    )
}
