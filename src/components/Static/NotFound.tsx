import Empty from "../../components/Empty"
import Grid from "../Grid";
import styles from "./TerraDown.module.scss";
import notFoundImage from "../../images/404.svg"
import LinkButton from "../LinkButton";
import classNames from "classnames";
import {getPath, MenuKey} from "../../routes";

const NotFound = () => {
  return (
    <Empty>
      <div>
        <Grid className={styles.error_container}>
          <Grid className={styles.blankGrid}></Grid>
          <Grid className={styles.container}>
            <div className={classNames(styles.CzWelcome, styles.notFoundContainer)}>
              <h6>404! Doh</h6>
              <p>
                Hello explorer, this page doesn't exist anymore sorry
              </p>
              <img src={notFoundImage} alt={'not found'} />
              <LinkButton to={getPath(MenuKey.DASHBOARD)}  className={styles.notFoundButton} >
                Home Page
              </LinkButton>
            </div>
          </Grid>
          <Grid className={styles.blankGrid}></Grid>
        </Grid>
      </div>
    </Empty>
  )
}

export default NotFound
