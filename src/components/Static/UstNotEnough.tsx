import styles from "./UstNotEnough.module.scss"
import Tooltip  from "../Tooltip"
import { openTransak } from "../../pages/BuyUst"
import { div } from "../../libs/math"
import useAddress from "../../hooks/useAddress"

const UstNotEnough = ({ uusdAmount }) => {
    const address = useAddress()

    return (
        <div className={styles.container}>
            {/*<Confirm
                className={styles.list}
                list={[
                    {
                        title: <TooltipIcon>Gas Fee</TooltipIcon>,
                        content: uusdAmount,
                    },
                ]}
            />*/}
            <Tooltip className={styles.tooltip}>
                { address ? <p className={styles.tooltip}>
                    You don't have enough UST left over for Gas Fees. Buy UST with your
                    credit card{" "}
                    <span
                        className={styles.href}
                        onClick={() => {
                            openTransak()
                        }}
                    >
            here
          </span>
                </p> : <p className={styles.tooltip}>
                    Please connect your wallet
                </p> }
            </Tooltip>
        </div>
    )
}

export default UstNotEnough
