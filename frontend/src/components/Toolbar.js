import { Link, useNavigate } from "react-router-dom";
import mainContext from "../context/mainContext";
import { useContext, useEffect } from "react";
const Toolbar = () => {
  const { currentUser, setCurrentUser, socket, notif, setNotif } =
    useContext(mainContext);
  const nav = useNavigate();
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
        setNotif("")
        socket.connect();
      });
  }
  return (
    <nav>
    <div className="logo">
      <div>

      </div>
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
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Toolbar;
