import './PortfolioAllAssetsLoading.scss'
import styles from '../../PortfolioAllAssets/PortFolioAllAssets.module.scss'
import classNames from "classnames"

const PortfolioAllAssetsLoading = () => {
  return (
    <div className='skelton'>
  <div className={classNames(styles.assetsContainer, styles.assetsContainerLoading)}>
      <div className={styles.imageWrapper}>
        <span className={styles.coinImage}>
        <span className="skeleton-box" style={{width:100,height:80, borderRadius: 50}}></span>
        </span>
      </div>
      <div className={styles.valuesContainer}>
        <span className={styles.itemWrapper}>
        <span className="skeleton-box skeleton-box-title" style={{width: 130}}></span>
          <span className={styles.dflex}>
          
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 200, height: 20, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 50, height: 20, marginTop: 5}}></span>
          </div>
          </span>
        </span>

        <span className={styles.itemWrapper}>
        <span className="skeleton-box skeleton-box-title" style={{width: 130}}></span>
          <span className={styles.dflex}>
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 200, height: 20, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 50, height: 20, marginTop: 5}}></span>
          </div>
          </span>
        </span>

        <span className={styles.itemWrapper}>
        <span className="skeleton-box skeleton-box-title" style={{width: 130}}></span>
          <span className={styles.dflex}>
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 200, height: 20, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 50, height: 20, marginTop: 5}}></span>
          </div>
          </span>
        </span>
      </div>
    </div>
    </div>
  )
}

export default PortfolioAllAssetsLoading
