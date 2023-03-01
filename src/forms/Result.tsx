import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useRecoilValue, useSetRecoilState } from "recoil"
import { TxResult, UserDenied } from "@terra-money/wallet-provider"
// import dataLayer from 'analytics-datalayer';

import MESSAGE from "../lang/MESSAGE.json"
import { getPath, MenuKey } from "../routes"

import Wait, { STATUS } from "../components/Wait"
import TxHash from "./TxHash"
import TxInfo from "./TxInfo"
import { PostError } from "./FormContainer"
import { getTxInfosQuery } from "../data/native/tx"
import { TX_POLLING_INTERVAL } from "../constants"
import {priceKeyIndexState} from "../data/app";

declare const window: any;

interface Props {
  response?: TxResult
  parseTx: ResultParser
  gov?: boolean
  onFailure: () => void
  error?: PostError
  resetIt?: string
  asset?:string
}

const Result = ({
                  response,
                  error,
                  parseTx,
                  gov,
                  onFailure,
                  resetIt,
                  asset,
                  ...props
                }: Props) => {
  const success = !error
  const hash = response?.result.txhash ?? ""
  const raw_log = response?.result.raw_log ?? ""

  /* polling */
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)
  const getTxInfos = useRecoilValue(getTxInfosQuery)

  const tx = useQuery(hash, () => getTxInfos(hash), { refetchInterval })
  const { data: txInfo } = tx

  /* status */
  const status =
      !success || !hash || tx.error || (txInfo && !txInfo?.Success)
          ? STATUS.FAILURE
          : tx.isLoading || !txInfo
          ? STATUS.LOADING
          : STATUS.SUCCESS


  useEffect(() => {
    success && hash && setRefetchInterval(TX_POLLING_INTERVAL)
  }, [success, hash])


  const serPriceKeyIndexStateState = useSetRecoilState(priceKeyIndexState)

  useEffect(() => {
    if (status === STATUS.LOADING) {
      setRefetchInterval(TX_POLLING_INTERVAL)
    } else {
      setRefetchInterval(false)
      serPriceKeyIndexStateState((n) => n + 1)
    }
  }, [status, serPriceKeyIndexStateState])

  /* verbose */
  const verbose = txInfo ? JSON.stringify(txInfo, null, 2) : undefined
  useEffect(() => {
    const log = () => {
      console.groupCollapsed("Logs")
      console.info(verbose)
      console.groupEnd()
    }

    verbose && log()
  }, [verbose])

  /* render */
  const message =
      txInfo?.RawLog ||
      raw_log ||
      error?.message ||
      (error instanceof UserDenied && MESSAGE.Result.DENIED)

  const content = {
    [STATUS.SUCCESS]: txInfo && <TxInfo asset={asset} txInfo={txInfo} parser={parseTx} />,
    [STATUS.LOADING]: "Please wait while your request is being processed",
    [STATUS.FAILURE]: message,
  }[status]

  const wait = {
    status,

    hash: status === STATUS.LOADING && <TxHash>{hash}</TxHash>,

    link:
        status === STATUS.SUCCESS
            ? {
              to: getPath(!gov ? MenuKey.MY : MenuKey.GOV),
              children: !gov ? MenuKey.MY : MenuKey.GOV,
            }
            : undefined,
    resetIt:
        status === STATUS.SUCCESS
            ? {
              onClick: onFailure,
              children: resetIt ? resetIt : "Done",
            }
            : undefined,
    button:
        status === STATUS.FAILURE
            ? {
              onClick: onFailure,
              children: MESSAGE.Result.Button.FAILURE,
            }
            : undefined,
  }

  return <Wait {...wait}>{content}</Wait>
}

export default Result
