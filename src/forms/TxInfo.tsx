import DataLayer from "../components/DataLayer/DataLayer"
import { formatAsset } from "../libs/parse"
import TxHash from "./TxHash"
import styles from "./TxInfo.module.scss"
import {FeeAmount, TxLog} from "../types/tx";

interface Props {
  txInfo: {
    Success: boolean
    RawLog: string

    TxHash: string

    Tx: {
      Fee: { Amount: FeeAmount[] }
      Memo: string
    }

    Logs: TxLog[]
  }
  parser: ResultParser
  asset?: string
}

const TxInfo = ({ txInfo, parser, asset }: Props) => {
  const { TxHash: hash, Tx } = txInfo
  const logs = txInfo?.Logs
  const [fee] = Tx.Fee.Amount

  const receipt = parser(logs, txInfo)

  const footer = [
    {
      title: "Gas Fee",
      content: `+ ${formatAsset(fee.Amount, fee.Denom)}`,
    },
    {
      title: "Tx Hash",
      content: <TxHash>{hash}</TxHash>,
    },
  ]

  return (
    <>
      <DataLayer
        asset={asset}
        receipt={receipt}
        txHash={hash}
        txFee={formatAsset(fee.Amount, fee.Denom)}
      />
      {receipt &&
        receipt.map(
          ({ title, content, children }) =>
            content && (
              <article className={styles.wrapper} key={title}>
                <header className={styles.row}>
                  <h1 className={styles.title}>{title}</h1>
                  <p className={styles.content}>{content}</p>
                </header>

                {children && (
                  <section className={styles.children}>
                    {children.map(
                      ({ title, content }) =>
                        content && (
                          <article className={styles.row} key={title}>
                            <h1 className={styles.title}>{title}</h1>
                            <p className={styles.content}>{content}</p>
                          </article>
                        )
                    )}
                  </section>
                )}
              </article>
            )
        )}

      <footer className={styles.footer}>
        {footer.map(({ title, content }) => (
          <article className={styles.row} key={title}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.content}>{content}</p>
          </article>
        ))}
      </footer>
    </>
  )
}

export default TxInfo
