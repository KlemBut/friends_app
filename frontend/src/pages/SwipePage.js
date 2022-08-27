import mainContext from "../context/mainContext";
import Carousel from "../components/Carousel";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SwipePage = () => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [picNum, setPicNum] = useState(0);
  const [getNextStatus, setNextStatus] = useState(false);
  const [getPreviousStatus, setPreviousStatus] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);

  const { currentUser, socket } = useContext(mainContext);
  const nav = useNavigate();

  useEffect(() => {
    refresh();
  }, [profileIndex]);

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
    fetch("http://localhost:4001/getfilteredusers", options)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return nav("/");
        if(data.userMatch.length < 1) return console.log("no match")
        setFilteredUsers(data.userMatch);
        setPreviousStatus(true)
      });
  }
  function previousPhoto() {
    setPicNum(picNum - 1);
    if (picNum - 1 <= 0) {
      setPreviousStatus(true);
    }
    setNextStatus(false);
  }
  function nextPhoto() {
    setPicNum(picNum + 1);
    if (picNum + 1 >= filteredUsers[profileIndex].pictures.length - 1) {
      setNextStatus(true);
    }
    setPreviousStatus(false);
  }
  function like () {
   
    const likeData = {
      currentUser: currentUser,
      likedProfile: filteredUsers[profileIndex].name,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(likeData),
    };
    fetch("http://localhost:4001/likeuser", options)
      .then((r) => r.json())
      .then((data) => {
       if(data.success) sendNotif()
       if((profileIndex + 1) >= filteredUsers.length){
        return setFilteredUsers([])
       }
        setProfileIndex(profileIndex + 1)
      });
  }
  function dislike () {
    if((profileIndex + 1) >= filteredUsers.length){
      return setFilteredUsers([])
     }
      setProfileIndex(profileIndex + 1)
  }
  function sendNotif() {
    const likeData = {
      likingUser: currentUser,
      likedUser: filteredUsers[profileIndex].name
    }
    socket.emit("like", likeData)
  }

  return (
    filteredUsers.length < 1? 
    <div className="swipeWrapper">
      <h2>No matches</h2>
    </div>
    :
    <div className="swipeWrapper">
    <div>
      <Carousel
        source={filteredUsers && filteredUsers[profileIndex].pictures[picNum]}
        getPreviousStatus={getPreviousStatus}
        previousPhoto={previousPhoto}
        getNextStatus={getNextStatus}
        nextPhoto={nextPhoto}
      ></Carousel>
      <h2>{filteredUsers && filteredUsers[profileIndex].name}</h2>
    </div>
    <div>
      <button className="button-19" onClick={like}>&#128077;</button>
      <button className="button-18" onClick={dislike}>&#128078;</button>
    </div>
    </div>
  );
};

export default SwipePage;
