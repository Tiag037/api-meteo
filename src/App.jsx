import loader from "./assets/loader.svg";
import "./App.css";
import { useEffect, useState } from "react";
const APIKEY = import.meta.env.VITE_WEATHER_API_KEY;
import Browser from "./assets/browser.svg";
function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    fetch(`http://api.airvisual.com/v2/nearest_city?key=${APIKEY}`)
      .then((response) => {
        //erreur de 4400 - 499 : erreur client
        //erreur de 500 - 599 : erreur serveur
        /*
        On gere les erreur autres que l'acces a l'api qui elle est géré par le catch tout en bas.
        on gere les erreur du a une mauvaise clé ou a une erreur de recherche apres avoir acceder a l'api

        .ok => false ou true
        .status => n° de l'erreur (ex : 404)
        .statusText => nom de l'erreur
        */
        if (!response.ok)
          throw new Error(`Error ${response.status}, ${response.statusText}`);
        return response.json();
      })
      .then((responseData) => {
        setWeatherData({
          city: responseData.data.city,
          country: responseData.data.country,
          iconId: responseData.data.current.weather.ic,
          temparature: responseData.data.current.weather.tp,
        });
      })
      .catch((err) => {
        console.log(err);
        console.dir(err);
        setErrorInfo(err.message);
      });
  }, []);

  return (
    <main>
      <div
        className={`loader-container ${!weatherData && !errorInfo && "active"}`}
      >
        <img src={loader} alt="loading icon" />
      </div>
      {weatherData && (
        <>
          <p className="city-name">{weatherData.city}</p>
          <p className="country-name">{weatherData.country}</p>
          <p className="temperature">{weatherData.temparature}°</p>
          <div className="info-icon-container">
            <img
              src={`/icons/${weatherData.iconId}.svg`}
              alt="weather icon"
              className="info-icon"
            />
          </div>
        </>
      )}
      {errorInfo && !weatherData && (
        <>
          <p className="error-information">{errorInfo}</p>
          <img src={Browser} alt="error icon" />
        </>
      )}
    </main>
  );
}

export default App;
