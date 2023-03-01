import useNewContractMsg from "../../terra/useNewContractMsg"
import { useContractsAddress } from "../../hooks"
import FormContainer from "../FormContainer"
import useAddress from "../../hooks/useAddress"
import { useEffect, useState } from "react"
import { postDataFetchAPI } from "../../libs/fetchApi"
import { insertIf } from "../../libs/utils"
import {latestStageFarmingv1AirdropQuery, latestStageQuery} from "../../data/contract/airdrop"
import { useRecoilValue } from "recoil"
import {LOOP, SMALLEST} from "../../constants"
import useAirdropClaimStatus from "../../hooks/Farm/useAirdropClaimStatus"
import {div} from "../../libs/math";
import styles from '../../components/ClaimShortcut.module.scss'
import {useProtocol} from "../../data/contract/protocol";

const AirdropForm = () => {

  const { contracts } = useProtocol()
  const address = useAddress()
  const [marklelist, setMarkleList] = useState<{proof:[], amount: string} | undefined>(undefined)
  const [stage, setStage] = useState({latest_stage: 0})

  const latestStage = useRecoilValue(latestStageFarmingv1AirdropQuery)
  useEffect( ()=>{
      latestStage && setStage(latestStage)
  },[latestStage])

  useEffect(()=>{
    postDataFetchAPI('https://dex.loop.markets/FarmingReward1/merkleProof', { addr: address })
      .then(data => {
        data.err === undefined && setMarkleList(data)
      }).catch(()=>{
      setMarkleList(undefined)
    });
  },[])

  const { status } = useAirdropClaimStatus(stage.latest_stage !==0 ? stage.latest_stage.toString() : undefined, contracts["loop_farming_airdrop"])

  /* context */
  // const { airdrop, amount } = useAirdrops()
  // const result = useLatestStage()
  /* confirm */
  /*const contents = !airdrop?.length
    ? undefined
    : [{ title: "Amount", content: formatAsset(amount, LOOP) }]*/
  const contents = marklelist && !status?.is_claimed ?
    [
      {
        title: "Reward",
        content: `${div(marklelist?.amount ?? 0, SMALLEST) ?? "0"} ${LOOP}`
      }
      ]
    : undefined

  /* submit */
  const newContractMsg = useNewContractMsg()
  // @ts-ignore
  const data = marklelist !== undefined && stage.latest_stage && contracts["loop_farming_airdrop"] ? [newContractMsg(contracts["loop_farming_airdrop"], { claim: { stage: stage['latest_stage'], ...marklelist}})]
     : [];

  const notEligible = <div>
    You're not eligible for the airdrop right now. Check again next time and follow us on <a className={styles.eligible} href={'https://twitter.com/loop_finance'} rel="noreferrer" target={'_blank'}><u>Twitter</u></a> for the latest updates
  </div>

  const messages =  [ ...insertIf(!marklelist && !status?.is_claimed,notEligible), ...insertIf(stage.latest_stage <= 0, "Something went wrong, please refresh page"), ...insertIf(status?.is_claimed, "Reward already claimed")] ?? undefined;

  const disabled = marklelist === undefined || stage.latest_stage <= 0 || status?.is_claimed

  /* result */
  const parseTx = undefined
  const container = { contents, messages, disabled, data, parseTx, verifyUstBalance: !marklelist && !status?.is_claimed ? false: true }
  const props = {
    tab: { tabs: ["Farming-Reward"], current: "Farming-Reward" },
    label: "Claim",
  }

  return <FormContainer {...container} {...props} />
}

export default AirdropForm
