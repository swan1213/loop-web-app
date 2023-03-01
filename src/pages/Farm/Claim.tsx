import Page from "../../components/Page"
import ClaimForm from "../../forms/Farm/ClaimForm"
import { MenuKey } from "../Stake"
import { getPath, MenuKey as Menu } from "../../routes"
import LinkButton from "../../components/LinkButton"

const Claim = () => {
  const title = MenuKey.CLAIMALL

  const farmAction = {
    to: getPath(Menu.FARM) ?? "farm",
    children: "Go back",
    outline: false,
  }

  return (
    <Page title={title} action={<LinkButton {...farmAction} />}>
      <ClaimForm />
    </Page>
  )
}

export default Claim
