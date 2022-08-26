
const Carousel = ({source, getPreviousStatus, previousPhoto, getNextStatus, nextPhoto}) => {

    return(
      <div className="carouselWrapper">
        <span className='leftArrow' disabled={getPreviousStatus} onClick={previousPhoto}> <div></div> </span>
        <div className="imgWrapper" >
          <img src={source} alt="picture of user" />
        </div>
        <span className='rightArrow' disabled={getNextStatus} onClick={nextPhoto}> <div></div> </span>
      </div>
    )   
}

export default Carousel