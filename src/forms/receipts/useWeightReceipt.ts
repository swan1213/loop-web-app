import { Type } from "../../pages/GiveWeight"
import {TxLog} from "../../types/tx";

export default (type: Type) => (logs: TxLog[]) => {
  /* contents */
  return {
    [Type.WEIGHT]: [
      {
        title: "Weighted",
        content: "Success",
      },
    ],
  }[type]
}
