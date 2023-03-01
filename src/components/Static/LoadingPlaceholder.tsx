import styles from './LoadingPlaceholder.module.scss'
import loading from "../../images/framing.svg"
import classNames from "classnames/bind";
const cx = classNames.bind(styles)

const LoadingPlaceholder = (Props: { still?: boolean, width?: string, size?: string, color?: string, className?: string }) => {
  const { still = false, width = '80px',color = 'black', size= 'sm', className } = Props

  return (
      still ? <img src={loading} width={width}  alt={''} /> :
          (<div className={cx(styles.contentWrapper)}>
            <div className={cx(styles.placeholder)}>
              <div className={cx(styles.animatedBackground, color, size, className )} />
            </div>
          </div>)
  )
}

export default LoadingPlaceholder
