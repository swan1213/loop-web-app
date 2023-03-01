import { Helmet } from "react-helmet"

import useHash from "../libs/useHash"
import Page from "../components/Page"
import RewardForm from "../forms/RewardForm"
import useContractQueries from "../graphql/useContractQueries"
import { dict } from "../graphql/useNormalize"
import { useContractsAddress, useContract, useRefetch } from "../hooks"
import { BalanceKey, PriceKey } from "../hooks/contractKeys"
import Grid from "../components/Grid"
import {useProtocol} from "../data/contract/protocol";

export enum Type {
  "FACTORY" = "factory",
  "COLLECTOR" = "gov",
}

const Reward = () => {
  const { hash: type } = useHash<Type>(Type.FACTORY)
  const tab = { tabs: [Type.FACTORY, Type.COLLECTOR], current: type }

  /* initialize form */
  const priceKey = PriceKey.PAIR
  const balanceKey = BalanceKey.LPSTAKED

  const { [balanceKey]: balances } = useContract()
  useRefetch([priceKey, balanceKey])
  const collected = useCollected()
  const payload = {
    [Type.FACTORY]: balances,
    [Type.COLLECTOR]: collected,
  }[type]

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Reward</title>
      </Helmet>
    <Page title="Reward">
      {type && payload && (
        <RewardForm balances={payload} type={type} tab={tab} key={type} />
      )}
    </Page>
    </Grid>
  )
}

export default Reward

/* hooks */
const useCollected = () => {
  const { contracts } = useProtocol()
  const { parsed } = useContractQueries<Balance>(({ token }) => ({
    contract: token,
    msg: { balance: { address: contracts["collector"] } },
  }))

  return parsed && dict(parsed, ({ balance }) => balance)
}
