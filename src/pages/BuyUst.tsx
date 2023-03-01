import Page from "../components/Page"
import { Helmet } from "react-helmet"
import Grid from "../components/Grid"
import transakSDK from "@transak/transak-sdk"
// 89c32cc5-ea64-465d-b2c7-438b455ef82b (old)
// 79a79702-8f83-4ab3-a140-b905dc316383 (new)

const settings = {
  apiKey: "79a79702-8f83-4ab3-a140-b905dc316383",
  environment: "PRODUCTION",
  defaultCryptoCurrency: "UST",
  hostURL: window.location.origin,
  widgetHeight: "700px",
  // widgetWidth: "80%",
  networks: "terra",
  // cryptoCurrencyList: "USD, LUNA",
  disableWalletAddressForm: true,
  walletAddress: localStorage.getItem(
    "__terra_chrome_extension_wallet_address__"
  ),
  themeColor: "#2a293e",
}

export const openTransak = () => {
  const transak = new transakSDK(settings)
  transak.init()
}

const BuyUst = () => {
  return (
    <Grid>
      <Helmet>
        <title>Loop Markets | Buy UST</title>
      </Helmet>
      <Page></Page>
    </Grid>
  )
}

export default BuyUst
