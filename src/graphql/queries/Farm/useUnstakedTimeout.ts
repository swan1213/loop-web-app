import {useRecoilValue} from "recoil";
import {getDistributionWaitTimeQuery, getLockTimeFrameQuery} from "../../../data/farming/stakeUnstake";
import {useEffect, useState} from "react";
import {div, gt, lte, minus, multiple, number, plus} from "../../../libs/math";
import {intervalToDuration} from "date-fns";
import {
  FarmContractTYpe,
  getLockTimeFrameForAutoCompoundQuery,
  getLockTimeFrameQueryFarm2
} from "../../../data/farming/FarmV2";
import styles from "../../../pages/LoopStake.module.scss";

export default (stakedTime: string | undefined) => {
  const getLockTimeFrame = useRecoilValue(getLockTimeFrameQuery)

  const [timeString, setTimeString] = useState('')
  const [dayString, setDayString] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const shorts = {
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
  };

  useEffect(()=>{
    const remaningTime = minus(getLockTimeFrame ?? "0", minus(currentTime, stakedTime ?? "0"))
    setTimeLeft(number(remaningTime))
    const time = intervalToDuration({ start: 0, end: number(multiple(remaningTime, "1000")) });
    const timeArray = Object.keys(time).filter((item) => ['hours', 'minutes', 'seconds'].includes(item));
    setTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]} ${shorts[item]}` : `${time[item]} ${shorts[item] }`}`).join(' '))
    const days = time['days'];
    days !==undefined && setDayString(`${lte(days, 0) ? '' : ((lte(days, 9) ? `0${days} Days` : `${days} Days`))}  `)
  },[stakedTime, currentTime])

  return {
    timeString,
    timeLeft,
    formatTime: `${dayString ? dayString : ""} ${timeString}`
  }
}


export const useUnstakeTimoutFarm2 = (stakedTime: string | undefined, type: FarmContractTYpe, lp: string | undefined) => {
  const getLockTimeFrame = useRecoilValue(getLockTimeFrameQueryFarm2(type))

  const [timeString, setTimeString] = useState('')
  const [dayString, setDayString] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [shortTimeString, setShortTimeString] = useState('')
  const [shortMonthsString, setShortMonthsString] = useState('')
  const [shortDayString, setShortDayString] = useState('')

  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const shorts = {
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
  };

  useEffect(()=>{
    const remaningTime = minus(getLockTimeFrame ?? "0", minus(currentTime, stakedTime ?? "0"))
    setTimeLeft(number(remaningTime))
    const time = intervalToDuration({ start: 0, end: number(multiple(remaningTime, "1000")) });
    const timeArray = Object.keys(time).filter((item) => ['hours', 'minutes', 'seconds'].includes(item));
    setTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]} ${shorts[item]}` : `${time[item]} ${shorts[item] }`}`).join(' '))
    setShortTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]}` : `${time[item]}`}`).join(':'))
    const days = time['days']
    const years = time['years'] ?? ""
    // const calMonths = multiple(years, "12")
    days !==undefined && setDayString(`${lte(days, 0) ? '' : ((lte(days, 9) ? `0${days} Days` : `${days} Days`))}  `)
    days && setShortDayString(`${lte(days, 9) ? `0${days}` : days}`)

    // const months = plus(time['months'] ?? "", gt(calMonths, "0") ? calMonths : "0");
    // months && setShortMonthsString(`${lte(months, 9) ? `0${months}` : months}`)
  },[stakedTime, currentTime])

  return {
    timeString,
    timeLeft,
    formatTime: `${dayString ? dayString : ""} ${timeString}`,
    unStakeTimeLeft: {
      shortFormatTime: `${shortTimeString}`,
      shortMonthsString,
      shortDayString
    }
  }
}


export const useLockTimeFrameForAutoCompound = (stakedTime: string | undefined, type: FarmContractTYpe) => {
  const getLockTimeFrame = useRecoilValue(getLockTimeFrameForAutoCompoundQuery(type))

  const [timeString, setTimeString] = useState('')
  const [dayString, setDayString] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  const [currentTime, setTime] = useState(div(Date.now(), 1000));

  useEffect(() => {
    const interval = setInterval(() => setTime(div(Date.now(), 1000)), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const shorts = {
    months: "Month",
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
  };

  useEffect(()=>{
    const remaningTime = minus(getLockTimeFrame ?? "0", minus(currentTime, stakedTime ?? "0"))
    setTimeLeft(number(remaningTime))
    const time = intervalToDuration({ start: 0, end: number(multiple(remaningTime, "1000")) });
    const timeArray = Object.keys(time).filter((item) => ['days','hours', 'minutes', 'seconds'].includes(item));
    setTimeString(timeArray.map((item)=> `${lte(time[item], 9) ? `0${time[item]} ${shorts[item]}` : `${time[item]} ${shorts[item] }`}`).join(' '))
    const days = time['months'];
    days !==undefined && setDayString(`${lte(days, 0) ? '' : ((lte(days, 9) ? `0${days} Month` : `${days} Month`))}  `)
  },[stakedTime, currentTime])

  return {
    timeString,
    timeLeft,
    formatTime: `${dayString ? dayString : ""} ${timeString}`
  }
}
