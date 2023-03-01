import AdminAirdropForm from "../../forms/AdminAirdropForm"
import { MenuKey } from "../Admin"
import Page from "../../components/Page"
import LinkButton from "../../components/LinkButton"

const AdminAirdrops = () => {

  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }

  return (
    <Page title={MenuKey.AIRDROPS} action={<LinkButton {...link} />}>
      <AdminAirdropForm />
    </Page>
  )
}

export default AdminAirdrops
