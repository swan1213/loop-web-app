import {div, gt, multiple} from "../libs/math"
import {SMALLEST, UST} from "../constants"
import {useFindPairPoolPrice, useTokenMethods} from "../data/contract/info"
import {useEffect, useState} from "react"
import Count from "./Count"
import Button from "./Button"
import styles from "./PoolConfirmModal.module.scss"
import Container from "./Container"
import Price from "./Price"
import ConfirmWithUstPrice from "./ConfirmWithUstPrice"
import {adjustAmount, decimal} from "../libs/parse"
import {diff} from "../forms/PoolDynamicForm"

interface Props {
  token1: string
  token2: string
  amount: string
  pair: string
  isOpen: boolean
    toLP: any
  symbol1: string
  symbol2: string
    difference: string
    newNum2: string
}
const PoolConfirmModal = ({token1, token2, amount, toLP, pair, isOpen, symbol1, symbol2, difference, newNum2 }:Props) =>{

  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => isOpen ? "" :setTime(Date.now()), 3000)
    return () => {
      clearInterval(interval);
    };
  }, [])

    const { check8decOper } = useTokenMethods()
    const findPairPoolFn = useFindPairPoolPrice()

    const priceT1 = ['uusd',UST].includes(token1) ? "1" : adjustAmount(
        check8decOper(token1),
        !check8decOper(token1),
        findPairPoolFn?.(pair, token1) ?? "0"
    )
    const priceT2 = ['uusd',UST].includes(token2) ? "1" : adjustAmount(
        check8decOper(token2),
        !check8decOper(token2),
        findPairPoolFn?.(pair, token2) ?? "0"
    )

    const contents = [
     {
      title: symbol1,
       content: <Count format={(value)=> decimal(div(value, SMALLEST), 1)} symbol={symbol1} >{decimal(check8decOper(token1) ? multiple(amount, 100) : amount, 1)}</Count>,
       value: <Count format={(value)=> decimal(div(value, SMALLEST), 1)} symbol={UST} >{decimal(multiple(check8decOper(token1) ? multiple(amount, 100) : amount, priceT1), 1)}</Count>,
    },
    {
      title: symbol2,
      content: <Count format={(value)=> decimal(div(value, SMALLEST), 1)} symbol={symbol2} >{decimal(multiple(newNum2, SMALLEST),1)}</Count>,
      value: <Count format={(value)=> decimal(div(value, SMALLEST), 1)} symbol={UST} >{ decimal(multiple(multiple(newNum2, SMALLEST), priceT2), 1)}</Count>
    },
    {
        title: `Difference`,
        content: "",
        value: <Price price={decimal(difference, 2)} symbol={'%'} />,
        showContent: false
    }
  ]
  const [agree, setAgree] = useState(false)

  const disabled = gt(difference, diff) ? !agree : false

  return (
      <Container>
          <p className={styles.headerDetail}>The UST value of both assets should be the same</p>
        <div className={styles.contents}>
          {contents && (
              <ConfirmWithUstPrice
                  list={[
                    ...contents
                  ]}
              />
          )}
        </div>
        { gt(difference, diff) && <div className={styles.contents}>
          <input
              type={"checkbox"}
              checked={agree}
              id={"agree"}
              onChange={(e) => setAgree(!agree)}
          />{" "}
          <label htmlFor={"agree"}>
            I'm sure i still want to provide liquidity even though I'll loss the difference
          </label>
        </div> }
        <Button size={'lg'} disabled={disabled} className={styles.submit}>CONFIRM</Button>
      </Container>
  )
}

export default PoolConfirmModal