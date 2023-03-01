import {useRecoilValue} from "recoil";
import {lpLimitsQuery} from "../../data/contract/migrate";

export default (pair?: string) => {
  const data = useRecoilValue(lpLimitsQuery({pair: pair ?? ""}))

  return { limits: data }
}
