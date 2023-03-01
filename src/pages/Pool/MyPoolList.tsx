import MyPoolTable from "./MyPoolTable"
import useMyPool from "../My/useMyPool"

const MyPoolList = () => {
    const pool = useMyPool()

    return (
        <>
            <MyPoolTable {...pool} />
        </>
    )
}

export default MyPoolList
