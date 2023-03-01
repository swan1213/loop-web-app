import StakingInfo from "../StakingInfo"
import {bound} from "../../../components/Boundary";
import Placeholder from "./Placeholder";

const MyStakeList = () => {
    return (
        bound(<StakingInfo />, <Placeholder title={'Staking Positions'} />)
    )
}

export default MyStakeList
