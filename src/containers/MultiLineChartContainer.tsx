import { ReactNode, useEffect } from "react"
import { helpers, ChartPoint, ChartOptions } from "chart.js"
import { Line, defaults, Bar } from "react-chartjs-2"
import { format as formatDate } from "date-fns"
import {commas, decimal, format} from "../libs/parse"
import Change from "../components/Change"
import styles from "./MultiLineChartContainer.module.scss"
import { gt } from "../libs/math"
import moment from "moment"

/* styles */
const $font = '"Lexend", sans-serif'
const $darkblue = "#172240"
const $aqua = "#01CDFD"
const $size = 14
// const $red = "#e64c57"
const $slate = "#505466"
// const $text = "rgba(1, 205, 253, 1)"

const $bgSecond="linear-gradient(180deg, #01CDFD 0%, rgba(1, 205, 253, 0) 100%)"
const $bgFirst="gradient(180deg, #32FE9A 0%, rgba(50, 254, 154, 0) 100%)"

const $green = "rgb(140,253,10)"
const $light_bg = "rgba(1, 205, 253, 0.2)"
const $line = helpers.color($slate).alpha(0.2).rgbString()
var $bg_transparent = "transparent"


defaults.global.defaultFontColor = $slate
defaults.global.defaultFontFamily = $font
defaults.global.defaultFontSize = $size

interface Props {
  multiAxes?: boolean
  value?: ReactNode
  change?: string
  datasets1: ChartPoint[]
  datasets2: ChartPoint[]
  fmt?: { t: string }
  compact?: boolean
  bar?: boolean
  symbol?: string,
  dataSet1Label?: string,
  dataSet2Label?: string,

}

const MultiLineChartContainer = ({
  multiAxes,
  value,
  symbol,
  change,
  datasets1,
  datasets2,
  dataSet1Label,
  dataSet2Label,
  ...props
}: Props) => {

    const data1:any=datasets1?.map((price)=> price?.y ).flat();
    const data1Label:any=datasets1?.map((price)=> moment(price?.t)).flat();
    const data2:any=datasets2?.map((price)=> price?.y ).flat();



      const { fmt, compact, bar } = props

      const height = compact ? 120 : 300

      const data: any = (canvas: any) => {
        const ctx = canvas.getContext("2d")
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, $light_bg)
        gradient.addColorStop(1, $bg_transparent)

        const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
        gradient2.addColorStop(0, 'rgba(50, 254, 154, 0)');   
        gradient2.addColorStop(1, 'rgba(50, 254, 154, 1)');

    
        const border = ctx.createLinearGradient(0, 0, 0, height)
        border.addColorStop(1, $aqua)
        border.addColorStop(0, $green)
    
        return {  
          labels: data1Label,
          datasets: [
						{
							label: dataSet1Label,
							data: data1,
							fill: true,
              borderColor: '#01CDFD',
                    borderCapStyle: "round",
                    borderWidth: 2,
                    lineTension: compact ? 0.2 : 0.05,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    backgroundColor: gradient,
              yAxisID:'left',
						},
						{
							label: dataSet2Label,
							data: data2,
							fill: true,
              borderColor: '#32FE9A',
                    borderCapStyle: "round",
                    borderWidth: 2,
                    lineTension: compact ? 0.2 : 0.05,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    backgroundColor: gradient2,
              yAxisID:'right',
						}
					]
        }
      }
  
      const chartProps = { height, data }

  return (
    <div>
      <section className={styles.chart}>
			<Line
				data={chartProps.data}
				width={800}
				height={400}
				options={{
          responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            legend: { display: false },
            layout: compact ? { padding: 20 } : undefined,
          scales: {
            xAxes: [
              {
                offset: true,
                type: "time",
                time: {
                  parser: "dd LLL HH:mm",
                  unit: "hour",
                  unitStepSize: 1,
                  displayFormats: {
                    hour: "DD MMM",
                  },
                },
                display: !compact,
                ticks: {
                  source: "data",
                  autoSkip: true,
                  autoSkipPadding: 15,
                  maxRotation: 0,
                },
                gridLines: {
                  drawBorder: true,
                  color: $line,
                  zeroLineColor: $line,
                  borderDash: [10, 10],
                },
              },
            ],
            yAxes: [
              {
                id: "left",
                type: "linear",
                display: !compact,
                position: "left",
                gridLines: {
                  drawBorder: true,
                  color: $line,
                  zeroLineColor: $line,
                  borderDash: [10, 10],
                },
                ticks: {
                  callback: (value) => format(value as string),
                  padding: 20,
                },
              },
              {
                id: "right",
                type: "linear",
                position: "right",
                ticks: {
                  beginAtZero: true,
                }
              }
            ]
          },
          tooltips: {
            mode: "index",
            intersect: false,
            displayColors: false,
            backgroundColor: "white",
            cornerRadius: 5,
            titleFontColor: $darkblue,
            titleFontSize: 16,
            titleFontStyle: "600",
            bodyFontColor: $darkblue,
            bodyFontSize: 12,
            xPadding: 10,
            yPadding: 8,
            callbacks: {
              title: ([{ value }]) =>
                value ? `${commas(decimal(value, 4))} ${symbol ?? ""}` : "",
                
            },
          },
				}}
			/>
      </section>
		</div>
  )
    }
  
export default MultiLineChartContainer;