import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { getPath, MenuKey } from "../routes"
import Page from "../components/Page"
import GlanceForm from "../forms/GlanceForm"
import useAddress from "../hooks/useAddress"

const Auth = () => {
  const address = useAddress()
  const { replace } = useHistory()

  useEffect(() => {
    address && replace(getPath(MenuKey.MY))
  }, [address, replace])

  return address ? null : (
    <Page>
      <GlanceForm />
    </Page>
  )
}

export default Auth
