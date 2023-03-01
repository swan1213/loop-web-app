import React, { useEffect, useState } from "react"
import axios from "axios"
import { PriceChart } from "./PriceChart"
import "./styles.css"

function TradingChart({ period, token1, token2 }) {
  const [initialData, setInitialData] = useState([])
  const today = new Date()
  const yesterday = new Date(today.getTime())
  yesterday.setDate(today.getDate() - 1)
  const [from_time, setFromTime] = useState(
    getISOStringWithoutSecsAndMillisecs(yesterday)
  )
  const [to_time, setToTime] = useState(
    getISOStringWithoutSecsAndMillisecs(today)
  )

  useEffect(() => {
    axios
      .post("https://terra-trading-chart-api.herokuapp.com/api/pair", {
        token1: token1.startsWith("u")
          ? "terra1dw5j23l6nwge69z0enemutfmyc93c36aqnzjj5"
          : token1,
        token2: token2.startsWith("u")
          ? "terra1dw5j23l6nwge69z0enemutfmyc93c36aqnzjj5"
          : token2,
      })
      .then((response) => {
        if (response?.data) {
          const pairAddresses = Object.keys(response.data)
          console.log(pairAddresses[0])
          axios
            .post(
              "https://terra-trading-chart-api.herokuapp.com/api/chartdata",
              {
                from_time: new Date(from_time).getTime() / 1000,
                to_time: new Date(to_time).getTime() / 1000,
                period,
                pairAddr: pairAddresses[0],
              }
            )
            .then((response) => {
              setInitialData(response.data)
            })
        }
      })
  }, [from_time, to_time, period, token1, token2])

  function getISOStringWithoutSecsAndMillisecs(date) {
    const dateAndTime = date.toISOString().split("T")
    const time = dateAndTime[1].split(":")
    return dateAndTime[0] + "T" + time[0] + ":" + time[1]
  }

  return (
    <div className="chart_board">
      <div>
        <input
          type="datetime-local"
          id="from-time"
          name="from-time"
          value={from_time}
          onChange={(e) => setFromTime(e.target.value)}
        />
        <span style={{ color: "white", padding: "0 10px" }}>~</span>
        <input
          type="datetime-local"
          id="to-time"
          name="to-time"
          value={to_time}
          onChange={(e) => setToTime(e.target.value)}
        />
      </div>
      <div
        style={{
          backgroundColor: "rgba(0,0,0,.0)",
        }}
      >
        <PriceChart
          initialData={initialData}
          loaded={initialData.length !== 0}
        />
      </div>
    </div>
  )
}

export default TradingChart
