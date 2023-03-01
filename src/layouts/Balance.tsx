import {LOOP, SMALLEST, UST} from "../constants"
import { AccountInfoKey } from "../hooks/contractKeys"
import WithResult from "../containers/WithResult"
import {div} from "../libs/math";
import {commas, decimal} from "../libs/parse";

const Balance = ({ustAmount, loopAmount}) => {
  const renderError = () => <p className="red">Error</p>

  return (
    <WithResult
      keys={[AccountInfoKey.UUSD]}
      renderError={renderError}
      size={21}
    >
      {
        loopAmount && <div>{commas(decimal(div(loopAmount, SMALLEST), 2))} {LOOP}</div>
      }
      {
        !loopAmount && <div>{commas(decimal(ustAmount, 2))} { UST}</div>
      }
    </WithResult>
  )
}

export default Balance
