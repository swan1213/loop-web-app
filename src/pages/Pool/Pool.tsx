import Connect from "../../layouts/Connect";
import {bound} from "../../components/Boundary";
import MyPoolList from "./MyPoolList"
import useAddress from "../../hooks/useAddress";

const Pool = () => {
  const address = useAddress()

  return (
    <>
      {!address ? <Connect /> : <MyPoolList />}
    </>
  )
}

export default Pool
