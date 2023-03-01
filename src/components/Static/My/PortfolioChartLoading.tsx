import './PortfolioAllAssetsLoading.scss'
import styles from '../../PortfolioAllAssets/PortFolioAllAssets.module.scss'
import classNames from "classnames"

const PortfolioChartLoading = () => {
  return (
    <div className='skelton'>
  <div className={classNames(styles.assetsContainer, styles.assetsContainerLoading)}>
      <div className={classNames(styles.imageWrapper, styles.imageWrapperChart)}>
      
        <span className="skeleton-box" style={{width:150,height:150, borderRadius: 80}}></span>
        
      </div>
      <div className={styles.valuesContainer}>
        <span className={styles.itemWrapper}>
        <span className="skeleton-box skeleton-box-title" style={{width: 300, height: 20}}></span>
          <span className={styles.dflex}>
          
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5}}></span>
          </div>
          </span>
        </span>

        <span className={styles.itemWrapper}>
        
          <span className={styles.dflex}>
          
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5}}></span>
          </div>
          </span>
        </span>

        <span className={styles.itemWrapper}>
          <span className={styles.dflex}>
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5}}></span>
          </div>
          </span>
        </span>
        <span className={styles.itemWrapper}>
          <span className={styles.dflex}>
          <div className={styles.row}>
          <span className="skeleton-box" style={{width: 150, height: 35, marginTop: 5, marginRight: 10}}></span> 
          <span className="skeleton-box" style={{width: 170, height: 35, marginTop: 5}}></span>
          </div>
          </span>
        </span>
      </div>
    </div>
    </div>
  )
}

export default PortfolioChartLoading
