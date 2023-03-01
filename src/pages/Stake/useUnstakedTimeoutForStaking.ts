import {useRecoilValue} from "recoil";
import {useEffect, useState} from "react";
import {div, gt, lte, minus, multiple, number, plus} from "../../libs/math";
import {intervalToDuration} from "date-fns";
import {
  getLockTimeFrameForUnstakeQuery
} from "../../data/stake/stake";
import {StakeDuration} from "../LoopStake";
import {getLockTimeFrameForUnstake18MonQuery, getLockTimeFrameForUnstake3MonQuery} from "../../data/stake/stake18Mon";

export default (stakedTime: string | undefined, duration: StakeDuration) => {

  const values:any =  {
    [StakeDuration["12MON"]]:{
      getLockTimeFrameForUnstakeQuery: getLockTimeFrameForUnstakeQuery
    },
    [StakeDuration["18MON"]]:{
      getLockTimeFrameForUnstakeQuery: getLockTimeFrameForUnstake18MonQuery
    },
    [StakeDuration["3MON"]]:{
      getLockTimeFrameForUnstakeQuery: getLockTimeFrameForUnstake3MonQuery
    }
  }[duration]

  const getLockTimeFrame = useRecoilValue<string| undefined>(values.getLockTimeFrameForUnstakeQuery)

  const [timeString, setTimeString] = useState('')
  const [shortTimeString, setShortTimeString] = useState('')
  const [dayString, setDayString] = useState('')
  const [monthsString, setMonthsString] = useState('')
  const [shortDayString, setShortDayString] = useState('')
  const [shortMonthsString, setShortMonthsString] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const longLabels = {
    days: "Days",
    hours: "Hours",
    minutes: "Min",
  };

  const shorts = {
    days: "D",
    hours: "H",
    minutes: "m"
  };

  useEffect(()=>{
    const remaningTime = minus(getLockTimeFrame ?? "0", minus(currentTime, stakedTime ?? "0"))
    setTimeLeft(number(remaningTime))
    const time = intervalToDuration({ start: 0, end: number(multiple(remaningTime, "1000")) });
    const timeArray = Object.keys(time).filter((item) => ['hours', 'minutes'].includes(item));
    setTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]} ${longLabels[item]}` : `${time[item]} ${longLabels[item] }`}`).join(' '))
    setShortTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]}` : `${time[item]}`}`).join(':'))
    const days = time['days'];
    days && setDayString(`${lte(days, 9) ? `0${days}` : days} calMonthsDays `)
    days && setShortDayString(`${lte(days, 9) ? `0${days}` : days}`)

    const years = time['years'] ?? "";
    const calMonths = multiple(years, "12")
    const months = plus(time['months'] ?? "", gt(calMonths, "0") ? calMonths : "0");
    months && setMonthsString(`${lte(months, 9) ? `0${months}` : months} Months `)
    months && setShortMonthsString(`${lte(months, 9) ? `0${months}` : months}`)
  },[stakedTime, currentTime])

  return {
    timeString,
    shortTimeString,
    timeLeft,
    formatTime: `${monthsString ? monthsString : ""} ${dayString ? dayString : ""} ${timeString}`,
    shortFormatTime: `${shortTimeString}`,
    shortMonthsString,
    monthsString,
    shortDayString
  }
}
