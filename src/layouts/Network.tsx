import { FC } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { DefaultOptions } from "@apollo/client"
import networks from "../networks";
import {useNetwork} from "../hooks";
// import {NetworkProvider, useNetworkState} from "../hooks/useNetwork"

const queryClient = new QueryClient()

export const DefaultApolloClientOptions: DefaultOptions = {
  watchQuery: { notifyOnNetworkStatusChange: true },
  query: { errorPolicy: "all", fetchPolicy: "network-only" },
}

const Network: FC = ({ children }) => {
  const { name } = useNetwork()
  const network = networks[name]
  const client = new ApolloClient({
    uri: network.mantle,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: DefaultApolloClientOptions,
  })

  return (
      /*<NetworkProvider value={network} key={network.name}>*/
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>{children}</ApolloProvider>
        </QueryClientProvider>
      /*</NetworkProvider>*/
  )
}

export default Network
