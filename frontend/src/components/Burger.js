
const Burger = ({toggle, isOpen}) => {
    const burger1 = {
        transform: isOpen? 'rotate(45deg)' : 'rotate(0)'
    }
    const burger2 = {
        transform: isOpen? 'translateX(100%)' : 'translateX(0)',
        opacity: isOpen? 0 : 1
    }
    const burger3 = {
        transform: isOpen? 'rotate(-45deg)' : 'rotate(0)'
    }
     return(

        <div className="hamburger" style={{gap: "0"}} onClick={toggle}>
            <div className="burger burger1" style={burger1}></div>
            <div className="burger burger2" style={burger2}></div>
            <div className="burger burger3" style={burger3}></div>
        </div>
    
        
     )
}
export default Burger