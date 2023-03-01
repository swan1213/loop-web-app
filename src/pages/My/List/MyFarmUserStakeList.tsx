import StakeFarm2 from "../StakeFarm2"
import {bound} from "../../../components/Boundary"
import Placeholder from "./Placeholder"

const MyFarmUserStakeList = () => {

    return (
        bound(<StakeFarm2 />, <Placeholder title={'Farm'} />)
    )
}

export default MyFarmUserStakeList
