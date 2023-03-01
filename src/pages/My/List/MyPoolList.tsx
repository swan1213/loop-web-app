import Pool from "../Pool"
import {bound} from "../../../components/Boundary"
import Placeholder from "./Placeholder"

const MyPoolList = () => {

    return (
        bound(<Pool />, <Placeholder title={'Pool'} />)
    )
}

export default MyPoolList
