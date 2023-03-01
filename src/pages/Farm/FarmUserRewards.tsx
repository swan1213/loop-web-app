import styles from './FarmRewards.module.scss'
import FarmUserRewardsRow, {FarmRewardsRowFarm2} from "./FarmUserRewardsRow";
import { div } from "../../libs/math";
import {useEffect, useState} from "react";
/*interface Props {
  data: FarmUserRewardType[][]
}*/

export interface Props {
    data: ({ pool: { token: { contract_addr: string}}, rewards_info: FarmUserRewardType[] })[] | undefined
}

export interface FarmUserRewardType {
    amount: string,
    info: {
        token?: { contract_addr: string },
        nativeToken: { denom: string }
    }
}

const FarmRewards = ({ data }: Props) => {

    const [items, setItems] = useState<{ pool: { token: { contract_addr: string; }; }; rewards_info: FarmUserRewardType[] }[]>()

    useEffect(()=>{
        data && setItems(data)
    },[data])

    return (
        <div className={styles.flex}>
            {
                items && items.map(({rewards_info}, index) => (rewards_info && rewards_info.map((li) => (<FarmUserRewardsRow item={li} key={index} />))
                ))
            }
        </div>
    )
}

export default FarmRewards


export const FarmUserRewardsFarm2 = ({ data }: { data: any }) => {

    const [items, setItems] = useState<any>()

    useEffect(()=>{
        data && setItems(data)
    },[data])

    return (
        <div className={styles.flex}>
            {
                items && items.map(({rewards_info}, index) => (rewards_info && rewards_info.map((li) => (<FarmRewardsRowFarm2 item={li} key={index} />))
                ))
            }
        </div>
    )
}