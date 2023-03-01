import Page from "../../components/Page"
import ClaimBonusForm from "../../forms/Farm/ClaimBonusForm"
import { MenuKey, getPath } from "../../routes"
import LinkButton from "../../components/LinkButton"

const ClaimBonus = () => {
  const title = "Claim Bonus"

  const farmAction = {
    to: getPath(MenuKey.FARM) ?? "farm",
    children: "Go back",
    outline: false,
  }

  return (
    <Page title={title} action={<LinkButton {...farmAction} />}>
      <ClaimBonusForm />
    </Page>
  )
}

export default ClaimBonus
