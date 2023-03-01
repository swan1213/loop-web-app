import { MsgExecuteContract, Coins, Coin } from "@terra-money/terra.js"
import useAddress from "../hooks/useAddress"

export default () => {
  const sender = useAddress()

  return (
    contract: string,
    msg: object,
    coin?: { denom: string; amount: string },
    coin2?: { denom: string; amount: string },
  ) =>
  {
    const coin1data = coin ? [Coin.fromData(coin)] : [];
    const coin2data = coin2 ? [Coin.fromData(coin2)] : [];

    return new MsgExecuteContract(
      sender,
      contract,
      msg,
      new Coins([...coin1data, ...coin2data ])
    )
  }
}
