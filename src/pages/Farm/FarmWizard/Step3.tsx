import {useEffect, useState} from "react"

import styles from "./Step3.module.scss"
import {Type} from "../../PoolDynamic"
import Card from "../../../components/Card"
import FarmWizardStep3Form from "../../../forms/Farm/FarmWizardStep3Form"
import Steps from "../../../components/Static/Steps"
import {useContractsV2List} from "../../../data/contract/factoryV2"
import {FactoryType, useFarms} from "../../../data/contract/normalize"
import Header from "./Header";

const Step3 = ({ticker}:{ticker: string}) => {
    const factoryPairs = useFarms(FactoryType.fac2)

    const{ contents: findLpTokens } = useContractsV2List()
    const [tokens, setTokens] = useState<string[]|undefined>(undefined)
    const [pair, setPair] = useState<string>('')
    const [lpToken, setLpToken] = useState<string>('')

    useEffect(()=>{
        const tokenList = findLpTokens?.filter((item) => item.lp === lpToken) ?? []
        lpToken && setTokens(tokenList.map((item)=> item.contract_addr))
    },[lpToken,findLpTokens])

    useEffect(()=>{
        if(ticker){
            const row = factoryPairs?.find((item) => {
                const symbol = item.symbol.toLowerCase().replace(/\s/g, '').split('-')
                const tick = ticker.toLowerCase().replace(/\s/g, '')
                const found = tick.includes(symbol?.[0] ?? '') && tick.includes(symbol?.[1] ?? '')
                return found ?? false
            })
            if(row){
                setLpToken(row.lpToken)
                setPair(row.contract_addr)
            }
        }
    },[ticker, factoryPairs])

    return (<article className={styles.component}>
            <Card className={styles.container}>
                <Header />
                <div className={styles.content}>
                    <Steps current={'3'}/>
                    <div className={styles.form}>
                        <h1 className={styles.title}>Pool</h1>

                        <FarmWizardStep3Form pairProp={pair} tokens={tokens} type={Type.PROVIDE} lpToken={lpToken} farmResponseFun={()=>{}}/>
                    </div>
                </div>
            </Card>
        </article>
    )
}

export default Step3
