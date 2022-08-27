import mainContext from "../context/mainContext";
import Carousel from "../components/Carousel";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { currentUser, setPicLength } = useContext(mainContext);

  const [getNextStatus, setNextStatus] = useState(false);
  const [getPreviousStatus, setPreviousStatus] = useState(false);
  const [myProfile, setMyProfile] = useState();
  const [picNum, setPicNum] = useState(0);
  const [error, setError] = useState("");

  const addPicRef = useRef();
  const nav = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

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
    fetch("http://localhost:4001/getprofile", options)
      .then((r) => r.json())
      .then((data) => {
        if (!data.profile) return nav("/");
        setMyProfile(data);
        setPicLength(data.profile.pictures.length);
        if (data.profile.pictures.length < 2) {
          setNextStatus(true);
        }
        if (picNum === 0) {
          setPreviousStatus(true);
        }
      });
  }

  function uploadPic() {
    const userData = {
      name: currentUser,
      imgUrl: addPicRef.current.value,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    };
    fetch("http://localhost:4001/uploadpic", options)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return setError(data.error);
        setMyProfile(data);
        refresh();
        setNextStatus(false);
        addPicRef.current.value = "";
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
    if (picNum + 1 >= myProfile.profile.pictures.length - 1) {
      setNextStatus(true);
    }
    setPreviousStatus(false);
  }

  function remove() {
    const picData = {
      currentUser: currentUser,
      img: myProfile.profile.pictures[picNum],
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(picData),
    };
    fetch("http://localhost:4001/removepic", options)
      .then((r) => r.json())
      .then((data) => {
        refresh();
        setPicNum(1)
      });
  }

  return (
    <div className="userWrapper">
      <div className="profileWrapper">
        <Carousel
          source={myProfile && myProfile.profile.pictures[picNum]}
          getPreviousStatus={getPreviousStatus}
          previousPhoto={previousPhoto}
          getNextStatus={getNextStatus}
          nextPhoto={nextPhoto}
        />
        {myProfile && <h3>{myProfile.profile.name}</h3>}
      </div>
      <div className="leftSideWrapper">
        <h4>Upload picture</h4>
        <p>Please have at least two pictures</p>
        <input type="text" ref={addPicRef} />
        <span>{error}</span>
        <button className="button-19" onClick={uploadPic}>Upload</button>
        {myProfile && myProfile.profile.pictures.length > 2 ? (
          <button className="button-18" onClick={remove}>Remove</button>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfile;