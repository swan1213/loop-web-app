import { Dictionary } from "ramda"
import { Helmet } from "react-helmet"

import { UST, UUSD } from "../constants"
import { plus, times } from "../libs/math"
import { format } from "../libs/parse"
import { useContract, useContractsAddress, useRefetch } from "../hooks"
import { PriceKey } from "../hooks/contractKeys"
import { parsePairPool } from "../graphql/useNormalize"
import Page from "../components/Page"
import Card from "../components/Card"
import Table from "../components/Table"
import Grid from "../components/Grid"
import {useProtocol} from "../data/contract/protocol";

const Data = () => {
  const priceKey = PriceKey.PAIR
  const { listed } = useProtocol()
  const { parsed, find } = useContract()
  const pairPool: Dictionary<PairPool> | undefined = parsed[priceKey]
  const { loading } = useRefetch([priceKey])

  const dataSource = !pairPool
    ? []
    : listed.map((item) => {
        const { token } = item
        const price = find(priceKey, token)
        const { uusd, asset } = parsePairPool(pairPool[token])
        const total = plus(uusd, times(asset, price))

        return { ...item, price, uusd, asset, total }
      })

  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Info</title>
      </Helmet>
    <Page title="Info">
      <Card title="Pair Pool" loading={loading}>
        <Table
          columns={[
            { key: "symbol", title: "Ticker", bold: true },
            { key: "name", title: "Underlying Name" },
            {
              key: "uusd",
              title: UST,
              render: (value) => format(value, UUSD, { integer: true }),
              align: "right",
            },
            {
              key: "asset",
              render: (value, { symbol }) =>
                format(value, symbol, { integer: true }),
              align: "right",
            },
            {
              key: "price",
              render: (value) => `${format(value)} ${UST}`,
              align: "right",
            },
            {
              key: "total",
              render: (value) => format(value, UUSD, { integer: true }),
              align: "right",
            },
          ]}
          dataSource={dataSource}
        />
      </Card>
    </Page>
    </Grid>
  )
}

export default Data
