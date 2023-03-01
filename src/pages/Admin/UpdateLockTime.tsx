import Page from "../../components/Page"
import useHash from "../../libs/useHash"
import { useContractsAddress } from "../../hooks"
import LinkButton from "../../components/LinkButton"
import UpdateLockTimeForm from "../../forms/Admin/UpdateLockTimeForm";


export enum Type {
  "LOCK_TIME" = "lock_time",
}

const UpdateLockTime = () => {

  const { hash: type } = useHash<Type>(Type.LOCK_TIME)
  const tab = {
    tabs: [Type.LOCK_TIME],
    current: type,
  }

  const link = {
    to: "/admin",
    children: "Go Back",
    outline: false,
  }
  return (
    <Page title={' '} action={<LinkButton {...link} />}>
      <UpdateLockTimeForm tab={tab} type={type} />
    </Page>
  )
}

export default UpdateLockTime
