import React, { StrictMode } from "react"
import { render} from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import {QueryClient, QueryClientProvider} from "react-query"
import { RecoilRoot } from "recoil"

import "./index.scss"
import { DSN } from "./constants"
import ScrollToTop from "./layouts/ScrollToTop"
import App from "./layouts/App"
import WalletConnectProvider from "./layouts/WalletConnectProvider"
import Boundary from "./components/Boundary"
import "./fonts/shapiro-65lightheavywide.woff"
import "./fonts/shapiro-65lightheavywide.woff2"
import "./fonts/shapiro-75heavyextd.woff"
import "./fonts/shapiro-75heavyextd.woff2"
import Network from "./layouts/Network"

process.env.NODE_ENV === "production" &&
  Sentry.init({
    dsn: DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  })
const queryClient = new QueryClient()

render(
    <StrictMode>
      <RecoilRoot>
            <Boundary>
              <Router>
                <ScrollToTop />
                <QueryClientProvider client={queryClient}>
                  <WalletConnectProvider>
                      <Network>
                            <App />
                      </Network>
                  </WalletConnectProvider>
                </QueryClientProvider>
              </Router>
            </Boundary>
      </RecoilRoot>
    </StrictMode>,
    document.getElementById("loop")
  )
