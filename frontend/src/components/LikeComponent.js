
import HistoryCard from "./HistoryCard"

const LikeComponent = ({ source }) => {
    

    return (
        <div className="componentWrapper">
            {source && source.map((x, i) => {
                return <HistoryCard key={i} source={x}></HistoryCard>
            })}
        </div>
    )
}
export default LikeComponent