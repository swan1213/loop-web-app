import MESSAGE from "../lang/MESSAGE.json"

const Reconnect = ({ name }: any) => (
  <div className="empty">
    <p>{MESSAGE.Network.NoContract}</p>
    <p>Current network: {name}</p>
  </div>
)

export default Reconnect
