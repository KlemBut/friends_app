import { Link, useNavigate } from "react-router-dom";
import mainContext from "../context/mainContext";
import { useContext, useEffect, useState } from "react";
import Burger from "./Burger";
const Toolbar = () => {
  const { currentUser, setCurrentUser, socket, notif, setNotif } =
    useContext(mainContext);
  const nav = useNavigate();
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  useEffect(() => {
    if (window.innerWidth > 865) {
      setShowMobileNav(false);
    } else if (window.innerWidth < 865) {
      setShowMobileNav(true);
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 865) {
        setShowMobileNav(false);
      } else if (window.innerWidth < 865) {
        setShowMobileNav(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
    console.log(window.innerWidth);
  };
  const sidebar = {
    display: hamburgerOpen ? "flex" : "none",
    flexDirection: "column",
    alignItems: "flex-end",
    backgroundColor: "#0892d0",
    height: "100vh",
    width: "50vw",
    position: "absolute",
    zIndex: "10",
  };
  useEffect(() => {});
  function logOut() {
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    };
    fetch("http://localhost:4001/logout", options)
      .then((r) => r.json())
      .then((data) => {
        setCurrentUser(data.user);
        socket.disconnect();
        nav("/");
        setNotif("");
        socket.connect();
      });
  }
  return showMobileNav ? (
    <nav style={{ display: "block", height: "60px" }}>
      <div className="burg">
        <Burger toggle={toggleHamburger} isOpen={hamburgerOpen}></Burger>
      </div>
      <div className="sideBarNav" style={{}}>
            {currentUser? 
        <ul style={sidebar}>
          <div>
            <Link to="/filter">
              <li>
                <h2>Start searching</h2>
              </li>
            </Link>
            <Link to="/likes" onClick={() => setNotif("")}>
              <li>
                <h2>Likes {notif}</h2>
              </li>
            </Link>
          </div>
          <div>
            <Link to="userProfile">
              <li>
                <h2 className="user">{currentUser}</h2>
              </li>
            </Link>
            <a href="#">
              <li>
                <h2 onClick={logOut}>Log out</h2>
              </li>
            </a>
          </div>
        </ul>
        :
        <ul style={sidebar}>
        <div>
              <Link to="/register">
                <li>
                  <h2>Register</h2>
                </li>
              </Link>
              <Link to="/">
                <li>
                  <h2>Login</h2>
                </li>
              </Link>
            </div>
        </ul>

            }
      </div>
    </nav>
  ) : (
    <nav>
      <div className="logo">
        <div></div>
      </div>
      <ul>
        {!currentUser ? (
          <div className="navButtonsWrapper">
            <div>
              <Link to="/register">
                <li>
                  <h2>Register</h2>
                </li>
              </Link>
              <Link to="/">
                <li>
                  <h2>Login</h2>
                </li>
              </Link>
            </div>
          </div>
        ) : (
          <div className="navButtonsWrapper">
            <div className="toolDivLeft">
              <Link to="/filter">
                <li>
                  <h2>Start searching</h2>
                </li>
              </Link>
              <Link to="/likes" onClick={() => setNotif("")}>
                <li>
                  <h2>Likes {notif}</h2>
                </li>
              </Link>
            </div>
            <div className="toolDivRight">
              <Link to="userProfile">
                <li>
                  <h2 className="user">{currentUser}</h2>
                </li>
              </Link>
              <a href="#">
                <li>
                  <h2 onClick={logOut}>Log out</h2>
                </li>
              </a>
            </div>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Toolbar;
