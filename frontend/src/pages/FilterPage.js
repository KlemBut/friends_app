import Slider from "react-input-slider";
import mainContext from "../context/mainContext";
import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const FilterPage = () => {
  const { currentUser } = useContext(mainContext);

  const [cities, setCities] = useState(["Loading..."]);
  const [state, setState] = useState({ x: 25 });
  const [error, setError] = useState("");

  const cityRef = useRef();
  const maleRef = useRef();
  const femaleRef = useRef();
  const nav = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4001/cities/`)
      .then((res) => res.json())
      .then((data) => {
        setCities(data.cities);
      });
  }, []);
  function setFilter() {
    if (!currentUser) return nav("/");

    const gender = maleRef.current.checked ? "male" : "female";
    const filter = {
      currentUser: currentUser,
      city: cityRef.current.value,
      gender: gender,
      age: state.x,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(filter),
    };
    fetch("http://localhost:4001/setfilter", options)
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return setError(data.error);
        nav("/swipe");
      });
  }
  return (
    <div className="bigWrapper">
      <div className="filterWrapper">
        <div className="filterInputs">
          <label htmlFor="city">Select city: </label>
          <select name="" id="city" ref={cityRef}>
            <option value=""></option>
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
          <fieldset>
            <legend>Select gender:</legend>
            <div>
              <input
                type="radio"
                name="gender"
                id="male"
                ref={maleRef}
                defaultChecked
              />
              <label htmlFor="male">Male</label>
            </div>
            <div>
              <input type="radio" name="gender" id="female" ref={femaleRef} />
              <label htmlFor="female">Female</label>
            </div>
          </fieldset>
          <div>
            <label htmlFor="age">Select age:</label>
            <div className="sliderWrapper">
              <span>18</span>
              <Slider
                axis="x"
                x={state.x}
                xmin={18}
                xmax={90}
                d
                onChange={({ x }) => setState((state) => ({ ...state, x }))}
              />
              <span>90</span>
            </div>
            <h3>{state.x}</h3>
          </div>
        </div>
        <div>
          <span>{error}</span>
          <button onClick={setFilter} className="button-19">
            Set filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
