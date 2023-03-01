import styles from "./PoolWithPoolList.module.scss"
import {ReactNode} from "react"
import Card from "../components/Card"
import Container from "../components/Container"
import Pool from "../pages/Pool/Pool"
// import LinkButton from "../components/LinkButton";
// import {getPath, MenuKey} from "../routes";
import Boundary, {bound} from "../components/Boundary"
import ClipLoader from "react-spinners/ClipLoader"
import {div} from "../libs/math"
import {css} from "@emotion/react"

interface Props {
  children: ReactNode
}

const PoolWithPoolList = ({ children }: Props) => {
  // const pageName = window.location.pathname
  // const hashName = window.location.hash
  const color = '#FFFFFF'
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: white;
    `

  return (
    <div className={styles.flex}>
      <section className={styles.content}>
        {/*{ pageName == "/pool" && hashName == "#provide" && <Card className={styles.v2Container}>
          <LinkButton size={'sm'} to={getPath(MenuKey.POOL_V2)}>Go to V2</LinkButton>
        </Card> }
        { pageName == "/pool-v2" && hashName == "#provide" && <Card className={styles.v2Container}>
          <LinkButton size={'sm'} to={getPath(MenuKey.POOL)}>Go to V1</LinkButton>
        </Card> }*/}
        <div className={styles.childPool}>{children}</div>
      </section>
      <section className={styles.chart}>
        <Container sm>
          <Card title="Your Liquidity" className={styles.your_liquidity}>
            <div className={styles.your_liquidity_content}>
              <Boundary
                  fallback={<div className="dashboardLoaderInline">
                    <ClipLoader
                        color={color}
                        loading={true}
                        css={override}
                        size={50}
                    />
                  </div>}
              >
                <Pool />
              </Boundary>
              <h6 className={styles.msg}>
                If you staked your LP tokens in a farm,
                <br /> unstake them to see them here.
              </h6>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  )
}

export default PoolWithPoolList
