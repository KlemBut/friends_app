import { useState } from "react";
import Carousel from "./Carousel"
const HistoryCard = ({source}) => {
    const [getNextStatus, setNextStatus] = useState(false);
    const [getPreviousStatus, setPreviousStatus] = useState(true)
      const [picNum, setPicNum] = useState(0);

    console.log(source)
    function previousPhoto() {
        setPicNum(picNum - 1);
        if (picNum - 1 <= 0) {
          setPreviousStatus(true);
        }
        setNextStatus(false);
      }
      function nextPhoto() {
        setPicNum(picNum + 1);
        if (picNum + 1 >= (source.pictures.length - 1)) {
          setNextStatus(true);
        }
        setPreviousStatus(false);
      }
    return(
        <div className="historyCardWrapper">
            <Carousel source={source.pictures[picNum]}
            getPreviousStatus={getPreviousStatus}
            previousPhoto={previousPhoto}
            getNextStatus={getNextStatus}
            nextPhoto={nextPhoto}></Carousel>
            <h3>{source.name}</h3>
        </div>
    )
}

export default HistoryCard