import { div } from "../../libs/math"
import { useFetchTokens } from "../../hooks"
import { StatsNetwork } from "../../statistics/useDashboard"
import Card from "../../components/Card"
import Table from "../../components/Table"
import styles from "./RewardList.module.scss"
import ClaimAll from "./ClaimAll"
import SwapToLoop from "./SwapToLoop"
import useTxs from "../../statistics/useTxs"
import Distribute from "./Distribute"
import { LOOP, SMALLEST } from "../../constants"
import useNewContractMsg from "../../terra/useNewContractMsg"
import { toBase64 } from "../../libs/formHelpers"
import { lookupSymbol} from "../../libs/parse"
import { TxResult } from "@terra-money/wallet-provider"
import { PostError } from "../../forms/FormContainer"
import {useProtocol} from "../../data/contract/protocol";
import {useRewardList} from "../../data/contract/migrate";

const RewardList = ({
  setPageResponse,
  setClaimPageResponse,
  setSwapResponsePage,
}: {
  network: StatsNetwork
  setPageResponse: (response: TxResult | undefined, error: PostError | undefined ) => void
  setClaimPageResponse: (response: TxResult | undefined, error: PostError | undefined ) => void
  setSwapResponsePage:(response: TxResult | undefined, error: PostError | undefined ) => void
}) => {
  const { listed, getSymbol, getToken, contracts } = useProtocol()

  const {
    contractList: list,
    getSymbolFromContract,
    getPair,
  } = useFetchTokens()

  const { contents: allRewards, isLoading: loading } = useRewardList()

  const dataSource = list
    .filter(({ contract_addr: token }) => token !== getToken(LOOP))
    .map((item) => {
      const { contract_addr: token, denom } = item
      const pair = getPair(token, getToken(LOOP))

      const name =
        denom !== undefined
          ? lookupSymbol(denom)
          : getSymbol(token)
          ? getSymbolFromContract(token)?.tokenName
          : ""

      const symbol = denom
        ? denom
        : getSymbol(token)
        ? getSymbolFromContract(token)?.tokenSymbol
        : ""

      const rewardItem = allRewards.filter(
        (reward: any) => reward.curr.token.contract_addr === token
      )

      return {
        ...item,
        name,
        symbol,
        rank: token ?? "",
        reward: rewardItem[0] !== undefined ? rewardItem[0].amount : 0,
        revenue: "0",
        token: token ?? "",
        canSwap: pair !== undefined && pair?.pair.length > 0,
        pair: pair?.pair ?? "",
      }
    })

  const { txs } = useTxs()

  const setResponse = (response: TxResult | undefined, error: PostError | undefined): void => response ? setPageResponse(response, undefined) : setPageResponse(undefined, error)
  const setClaimResponse = (response: TxResult | undefined, error: PostError | undefined): void => response ?  setClaimPageResponse(response, undefined) : setClaimPageResponse(undefined, error)

  const newContractMsg = useNewContractMsg()

  const setSwapResponseFunc = (data: TxResult | undefined, error: PostError | undefined) => data ? setSwapResponsePage(data, undefined) : setClaimPageResponse(undefined, error)

  const sendToStakeList = listed
    .filter(({ token }) => token !== getToken(LOOP))
    .map((list) => {
      return newContractMsg(list.pair, {
        send_to_stake: {},
      })
    })

  const data = [
    ...sendToStakeList,
    newContractMsg(contracts["loop_staking"] ?? "", {
      distribute: {},
    }),
  ]

  return (
    <Card
      title="Rewards"
      loading={loading}
      action={
        !loading && (
          <>
            <ClaimAll txs={txs} setResponse={setClaimResponse} />
            <Distribute
              label={"Distribute"}
              data={data}
              setResponse={setResponse}
              disabled
            />
          </>
        )
      }
    >
      {!!dataSource && (
        <Table
          columns={[
            {
              key: "rank",
              className: styles.rank,
              render: (_value, _record, index) => index + 1,
              align: "center",
            },
            {
              key: "symbol",
              title: "Ticker",
              bold: true,
            },
            { key: "name", title: "Underlying Name" },
            /*{ key: "token", title: "Token" },*/
            /*{
              key: "revenue",
              title: "Total Revenue",
              render: (value) => formatAsset(value, UUSD, { integer: true }),
              align: "right",
            },*/
            {
              key: "reward",
              title: "My Reward",
              render: (value) => div(value, SMALLEST),
            },
            {
              key: "action",
              title: "",
              render: (value, { reward, pair, token, canSwap }) => {
                const data = [
                  newContractMsg(token, {
                    send: {
                      amount: reward,
                      contract: pair,
                      msg: toBase64({ swap: {} }),
                    },
                  }),
                ]

                return (
                  canSwap &&
                  reward > 0 && (
                    <SwapToLoop data={data} setResponse={setSwapResponseFunc} />
                  )
                )
              },
              align: "right",
            },
          ]}
          dataSource={dataSource}
        />
      )}
    </Card>
  )
}

export default RewardList
