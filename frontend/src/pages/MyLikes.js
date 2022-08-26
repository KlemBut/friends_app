import mainContext from "../context/mainContext";
import { useContext, useEffect, useRef, useState } from "react";
import LikeComponent from "../components/LikeComponent";
import { useNavigate } from "react-router-dom";

const MyLikes = () => {
    const { currentUser, notif } = useContext(mainContext);
    const [likes, setLikes] = useState()
    const [mylikes, setmylikes] = useState(true)
    const [melikesClass, setMelikeClass] = useState("button-19")
    const [likesMeClass, setLikesMeClass] = useState("button-18")
    const nav = useNavigate()
    useEffect(() => {
        refresh()
    }, [notif])

    function refresh() {
        const userData = {
          currentUser,
        };
        const options = {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        };
        fetch("http://localhost:4001/gethistory", options)
          .then((r) => r.json())
          .then((data) => {
            
            if(!data.success && !data.profile) return nav("/")
            console.log(data)
            setLikes(data)
          });
      }
    function melikes() {
      setmylikes(true)
      setMelikeClass("button-19")
      setLikesMeClass("button-18")
    }
    function likesme () {
      setmylikes(false)
      setMelikeClass("button-18")
      setLikesMeClass("button-19")

    }
    return( 
        <div className="likesWrapper">
        <div className="buttonWrap">
        <button className={melikesClass} onClick={melikes}>My likes</button>
        <button className={likesMeClass} onClick={likesme}>Likes me</button>
        </div>
        <div>
        {
            mylikes?
            <LikeComponent source={likes && likes.iLike}></LikeComponent>
            :
            <LikeComponent source={likes && likes.likesMe}></LikeComponent>
        }   
        </div>
        </div>
    )
}

export default MyLikes
