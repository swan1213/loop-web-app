import {useEffect, useState} from "react"
import styles from "./Step4.module.scss"

import {Type} from "../../LoopStake"
import Card from "../../../components/Card"
import Steps from "../../../components/Static/Steps"
import FarmWizardStep4MiniForm from "../../../forms/Farm/FarmWizardStep4MiniForm"
import {FactoryType, useFarms} from "../../../data/contract/normalize"
import Header from "./Header";

const queryString = require('query-string')

const Step4 = () => {
    const factoryPairs = useFarms(FactoryType.fac2)
    const [ticker, setTicker] = useState('')

    useEffect(()=>{
        const  query= queryString.parse(window.location.search);
        if (query.ticker) {
            setTicker(query.ticker)
        }
    },[window.location, factoryPairs])

    const [pair, setPair] = useState<string>('')
    const [lpToken, setLpToken] = useState<string>('')

    useEffect(()=>{
        if(ticker){
            const row = factoryPairs?.find((item) =>{
                const tick = ticker.toLowerCase().replace(/\s/g, '').split('-')
                const symbol = item.symbol.toLowerCase().replace(/\s/g, '')
                const found = symbol.includes(tick?.[0] ?? '') && symbol.includes(tick?.[1] ?? '')
                return found ?? false
            })
            if(row){
                setLpToken(row.lpToken)
                setPair(row.contract_addr)
            }
        }
    },[ticker, factoryPairs])

    return <article className={styles.component}>
        <Card className={styles.container}>
            <Header />
            <div className={styles.content}>
                <Steps current={'4'}/>
                <div className={styles.form}>
                    <h1>Farm</h1>
                    <p className={styles.msg}>{ticker.toUpperCase() ?? ''}</p>
                    <FarmWizardStep4MiniForm type={Type.STAKE} pairProp={pair} lpToken={lpToken} />
                </div>
            </div>
        </Card>
    </article>
}

export default Step4
