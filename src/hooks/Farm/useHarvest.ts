import {useRecoilValue} from "recoil";
import {harvestQuery} from "../../data/contract/migrate";

export interface LISTHarvest {
  asset: {
    token: {
      contract_addr: string
    }
  }
  fullyvested: string
  unvested: string
  bonus: string
}

export default () => {
  /*const { contracts } = useProtocol()
  const address = useAddress()

  const [data, setData] = useState<LIST[]>([])

  const { refetch } = useQuery(CONTRACT, {
    fetchPolicy: "cache-and-network",
    variables: {
      contract: contracts["loop_farm_staking"] ?? "",
      msg: `{"all_rewards": { "name": "${address}", "time": ${Math.floor(
        Date.now() / 1000
      )} }}`,
    },
    onCompleted: (result) => {
      setData(JSON.parse(result.WasmContractsContractAddressStore.Result))
    },
  })

  useEffect(() => {
    !data.length && refetch()
  }, [data])*/
  const data = useRecoilValue(harvestQuery)

  return { harvestList: data }
}
