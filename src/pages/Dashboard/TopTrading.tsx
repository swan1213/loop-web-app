import Card from "../../components/Card"
import PairTVLList from "./PairTVLList"
import {bound} from "../../components/Boundary";

const TopTrading = () => {
  return (
    <div className="tradingCard">
      <Card title="Top Trading Assets">
          { bound(<PairTVLList />)}
      </Card>
    </div>
  )
}

export default TopTrading
