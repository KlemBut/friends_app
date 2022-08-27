import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import mainContext from "../context/mainContext";

const Login = () => {
  const [error, setError] = useState();

  const nav = useNavigate();
  const nameRef = useRef();
  const passwordRef = useRef();
  const sessionRef = useRef();

  const { setCurrentUser, socket } = useContext(mainContext);

  function login() {
    if (sessionRef.current.checked === true) {
      const loginData = {
        name: nameRef.current.value,
        password: passwordRef.current.value,
        stayOnline: sessionRef.current.checked,
      };
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      };
      fetch("http://localhost:4001/login", options)
        .then((r) => r.json())
        .then((data) => {
          setError(data.error);
          console.log(data.error);
          if (data.success === true) {
            setCurrentUser(loginData.name);
            const user = loginData.name;
            socket.emit("addUser", user);
            nav("/userProfile");
          }
        });
    } else {
      const loginData = {
        name: nameRef.current.value,
        password: passwordRef.current.value,
      };
      const options = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(loginData),
      };
      fetch("http://localhost:4001/login", options)
        .then((r) => r.json())
        .then((data) => {
          setError(data.error);

          if (data.success === true) {
            setCurrentUser(loginData.name);
            const user = loginData.name;

            socket.emit("addUser", user);
            nav("/userProfile");
          }
        });
    }
  }
  
  return (
    <div className="registerWrapper">
      <div className="itemWrapper">
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" placeholder="Name" ref={nameRef} />
          <label htmlFor="password">Password: </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            ref={passwordRef}
          />
          <div className="checkbox">

          <label htmlFor="loggedIn">Stay signed in: </label>
          <input
            type="checkbox"
            name="loggedIn"
            id="loggedIn"
            ref={sessionRef}
          />
          </div>
        </div>
        <div>
          <span>{error}</span>
          <button className="button-19" onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
