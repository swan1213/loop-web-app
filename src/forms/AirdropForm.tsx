import useNewContractMsg from "../terra/useNewContractMsg"
import { useContractsAddress } from "../hooks"
import FormContainer from "./FormContainer"
import useAddress from "../hooks/useAddress"
import { useEffect, useState } from "react"
import { postDataFetchAPI } from "../libs/fetchApi"
import { insertIf } from "../libs/utils"
import {
    farmAirdrop2StageQuery,
    loopAirdrop2StageQuery, loopAirdropDec21StageQuery, loopFebAirdrop22, loopJanAirdrop22, looprAirdrop101StageQuery,
    looprAirdrop1StageQuery, looprAirdropDec21StageQuery,
} from "../data/contract/airdrop"
import { useRecoilValue } from "recoil"
import { SMALLEST } from "../constants"
import useAirdropClaimStatus from "../hooks/Farm/useAirdropClaimStatus"
import { div } from "../libs/math"
import styles from "../components/ClaimShortcut.module.scss"
import { useLocation } from "react-router-dom"
import {useProtocol} from "../data/contract/protocol";

const AirdropForm = () => {
    const { pathname } = useLocation()
    const name = pathname.substring(1)

    const { contracts } = useProtocol()
    const address = useAddress()
    const [marklelist, setMarkleList] = useState<
        { proof: []; amount: string } | undefined
        >(undefined)
    const [stage, setStage] = useState({ latest_stage: 0 })

    const getName = {
        "claim-airdrop": "farmAirdrop2",
        "loop-airdrop": "loopAirdrop2",
        "loopr-airdrop": "looprAirdrop1",
        "loopr-airdrop-101": "looprAirdrop101",
        "loop-airdrop-21": "loopDecember21",
        "loopr-airdrop-21": "looprDecember21",
        "loop-january-22-airdrop": "loopJanuary22",
        "loop-feb-22-airdrop": "loopFeb22",
    }

    const getLatestStage = {
        "claim-airdrop": farmAirdrop2StageQuery,
        "loop-airdrop": loopAirdrop2StageQuery,
        "loopr-airdrop": looprAirdrop1StageQuery,
        "loopr-airdrop-101": looprAirdrop101StageQuery,
        "loop-airdrop-21": loopAirdropDec21StageQuery,
        "loopr-airdrop-21": looprAirdropDec21StageQuery,
        "loop-january-22-airdrop": loopJanAirdrop22,
        "loop-feb-22-airdrop": loopFebAirdrop22,
    }

    const latestStage = useRecoilValue(getLatestStage[name])

    useEffect(() => {
        // @ts-ignore
        name && latestStage && setStage(latestStage)
    }, [latestStage])

    useEffect(() => {
        getName[name] &&
        postDataFetchAPI("https://dex.loop.markets/airdrop/" + getName[name], {
            addr: address,
        })
            .then((data) => {
                data.err === undefined && setMarkleList(data)
            })
            .catch(() => {
                setMarkleList(undefined)
            })
    }, [])

    const { status } = useAirdropClaimStatus(
        stage.latest_stage && stage.latest_stage !== 0 ? `${stage.latest_stage}` : undefined,
        contracts[getName[name]] ?? ""
    )

    /* context */
    // const { airdrop, amount } = useAirdrops()
    // const result = useLatestStage()
    /* confirm */
    /*const contents = !airdrop?.length
      ? undefined
      : [{ title: "Amount", content: formatAsset(amount, LOOP) }]*/
    const contents =
        marklelist && !status?.is_claimed
            ? [
                {
                    title: "Reward",
                    content: `${div(marklelist?.amount ?? 0, SMALLEST) ?? "0"}`,
                },
            ]
            : undefined

    /* submit */
    const newContractMsg = useNewContractMsg()
    // @ts-ignore
    const data =
        marklelist !== undefined && stage.latest_stage && getName[name]
            ? [
                newContractMsg(contracts[getName[name]] ?? "", {
                    claim: { stage: stage["latest_stage"], ...marklelist },
                }),
            ]
            : []

    const notEligible = (
        <div>
            You're not eligible for the airdrop right now. Check again next time and
            follow us on{" "}
            <a
                className={styles.eligible}
                href={"https://twitter.com/loop_finance"}
                rel="noreferrer"
                target={"_blank"}
            >
                <u>Twitter</u>
            </a>{" "}
            for the latest updates
        </div>
    )

    const messages =
        [
            ...insertIf(!marklelist && !status?.is_claimed, notEligible),
            ...insertIf(
                stage.latest_stage <= 0,
                "Something went wrong, please refresh page"
            ),
            ...insertIf(status?.is_claimed, "Reward already claimed"),
        ] ?? undefined

    const disabled =
        marklelist === undefined || stage.latest_stage <= 0 || status?.is_claimed

    /* result */
    const parseTx = undefined
    const container = {
        contents,
        messages,
        disabled,
        data,
        parseTx,
        verifyUstBalance: !(!marklelist && !status?.is_claimed),
    }
    const props = {
        tab: { tabs: [name.replaceAll("-"," ")], current: name.replaceAll("-"," ") },
        label: "Claim",
    }

    return <FormContainer {...container} {...props} />
}

export default AirdropForm
