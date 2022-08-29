import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const nameRef = useRef();
  const passwordOne = useRef();
  const passwordTwo = useRef();
  const genderRef = useRef();
  const birthdayRef = useRef();
  const cityRef = useRef();

  const [cities, setCities] = useState(["Loading..."]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4001/cities/`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities);
      });
  }, []);

  function register() {
    const registrationData = {
      name: nameRef.current.value,
      passwordOne: passwordOne.current.value,
      passwordTwo: passwordTwo.current.value,
      gender: genderRef.current.value,
      birthday: birthdayRef.current.value,
      city: cityRef.current.value,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(registrationData),
    };
    fetch("http://localhost:4001/register", options)
      .then((r) => r.json())
      .then((data) => {
        setError(data.error);
        if (data.success === true) nav("/");
      });
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
            ref={passwordOne}
          />
          <label htmlFor="passwordTwo">Repeat password: </label>
          <input
            type="password"
            id="passwordTwo"
            placeholder="Repeat password"
            ref={passwordTwo}
          />
          <label htmlFor="gender">Gender: </label>
          <select name="gender" id="gender" ref={genderRef}>
            <option value="">Select gender: </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <label htmlFor="birthday">Age: </label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            min="1950-01-01"
            max="2005-12-31"
            ref={birthdayRef}
          />
          <label htmlFor="cities">City: </label>
          <select name="cities" id="cities" ref={cityRef}>
            <option value="">Select city</option>
            <option value="Vilnius">Vilnius</option>
            <option value="Kaunas">Kaunas</option>
            {cities &&
              cities.sort().map((x, i) => {
                return (
                  <option key={i} value={x}>
                    {x}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <span>{error}</span>
          <button className="button-19" onClick={register}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
