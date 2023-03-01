import Holdings from "../Holdings"
import {bound} from "../../../components/Boundary"
import Placeholder from "./Placeholder"

const MyHoldingList = () => {
    return (
        bound( <Holdings />, <Placeholder title={'Holdings'} />)
    )
}

export default MyHoldingList
