import { getTokensList, useFindTokenDetails } from "../../data/form/select";
import { useRecoilValue } from "recoil";
import { CONTRACT } from "../useTradeAssets";

/**
 * get asset tokens for select box
 * @param secondToken
 * @param asPairs
 */
const useAssets = (secondToken?: string | undefined, asPairs: boolean | undefined = false) => {

  if (secondToken) {
    // if second token is native
    return [];
  } else {
    // const tokenList =  useRecoilValue((getTokensList))
    const tokenList = useFindTokenDetails()
    return tokenList(asPairs ? 'pair' : 'token')
  }
}

export default useAssets
