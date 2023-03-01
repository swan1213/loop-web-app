import styles from "../Holdings.module.scss"
import LoadingPlaceholder from "../../../components/Static/LoadingPlaceholder"
import {div} from "../../../libs/math"
import Card from "../../../components/Card"
import ProgressLoading from "../../../components/Static/ProgressLoading"

const Placeholder = ({title}:{title: string}) => {

    return (
        <Card
            title={title ?? ''}
            headerClass={styles.header}
            description={<><LoadingPlaceholder size={'sm'} color={'pink'} /></>}
        ><div className="dashboardLoaderInline">
            <ProgressLoading />
        </div> </Card>
    )
}

export default Placeholder
