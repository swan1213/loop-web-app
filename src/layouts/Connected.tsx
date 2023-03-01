import { gt } from "../libs/math"
import { truncate } from "../libs/text"
import {useRefetch} from "../hooks"
import { AccountInfoKey } from "../hooks/contractKeys"
import ConnectedButton from "../components/ConnectedButton"
import Balance from "./Balance"
import Wallet from "./Wallet"
import WhereToBuy from "./WhereToBuy"
import useAddress from "../hooks/useAddress"
import {useFindBalance} from "../data/contract/normalize";
import {LOOP, UUSD} from "../constants";
import {useProtocol} from "../data/contract/protocol";

const Connected = () => {
  const address = useAddress()

  const { getToken } = useProtocol()
    const findBalanceFn = useFindBalance()
    const uusd = findBalanceFn(UUSD) ?? "0"
    const loop = findBalanceFn(getToken(LOOP) ?? "") ?? "0"
  const { data } = useRefetch([AccountInfoKey.UUSD])
  const shouldBuyUST = !!data && !gt(uusd, 0)

  return (
    <>
      <ConnectedButton
        address={truncate(address)}
        balance={<Balance ustAmount={gt(uusd, "0") ? uusd : undefined} loopAmount={gt(loop, "0") ? loop : undefined} />}
        info={(close) => <Wallet close={close} />}
      />
      {shouldBuyUST && <WhereToBuy />}
    </>
  )
}

export default Connected
