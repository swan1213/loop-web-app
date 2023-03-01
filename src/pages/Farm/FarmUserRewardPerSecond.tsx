import styles from './FarmRewards.module.scss'
import { div } from "../../libs/math";
import FarmRewardPerSecondRow, {
    FarmRewardPerSecondRowFarm2,
    FarmRewardPerSecondRowFarm4
} from "./FarmRewardPerSecondRow";
import {FarmContractTYpe} from "../../data/farming/FarmV2";


interface Props {
    data: undefined | FarmReward[]
    lp: string
    farmContractType: FarmContractTYpe
}

export interface FarmReward {
    daily_reward: string,
    info: {
        token: { contract_addr: string }
    }
}

const FarmUserRewardPerSecond = ({ data, lp, farmContractType }: Props) => {
    return (
        <div className={styles.flex}>
            {
                data && data.map((item:FarmReward, index) => (<FarmRewardPerSecondRow farmContractType={farmContractType} lp={lp} item={item} key={index} />))
            }
        </div>
    )
}

export default FarmUserRewardPerSecond

export const FarmUserRewardPerSecondFarm2 = ({ data, lp, farmContractType }: Props) => {
    return (
        <div className={styles.flex}>
            {
                data && data.map((item:FarmReward, index) => (<FarmRewardPerSecondRowFarm2 farmContractType={farmContractType} lp={lp} item={item} key={index} />))
            }
        </div>
    )
}

export const FarmUserRewardPerSecondFarm4 = ({ data, lp, farmContractType }: Props) => {
    return (
        <div className={styles.flex}>
            {
                data && data.map((item:FarmReward, index) => (<FarmRewardPerSecondRowFarm4 farmContractType={farmContractType} lp={lp} item={item} key={index} />))
            }
        </div>
    )
}

