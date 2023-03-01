import Button from "../../components/Button"
import {useHistory} from "react-router-dom"


export function FarmWizard({
  ticker,
  lpToken,
  farmType,
}: {
  ticker: string
  lpToken: string
  farmType: string
}) {

  const history = useHistory()
  const func = () => {
    history.push({
      pathname: "/farm-wizard",
      search: `?lp=${lpToken}&step=step1&type=${farmType}&ticker=${ticker.replace(/ /g, "").trim()}`
    })
  }

  return (
    <>
      <Button color={'green'} onClick={func} >Migrate</Button>
    </>
  )
}