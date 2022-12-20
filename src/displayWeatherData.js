const displayForcast = (() => {
  const displayFiveDayForcast = (city, fiveDayForcast) => {
    console.log(city, fiveDayForcast);
  };
  return {
    displayFiveDayForcast,
  };
})();

const displayCurrent = (() => {
  const displayCurrentWeather = (city, currentWather) => {
    const sup = document.createElement("sup");
    const units = {
      fahrenheit: "\u2109",
      celcius: "\u2103",
    };
    const cityName = document.querySelector(".city-name");
    const weatherConditons = document.querySelector(".weather-conditions");
    const temperature = document.querySelector(".temperature");
    const selectedUnit = document.querySelector("#selected").value;

    cityName.textContent = city;
    weatherConditons.textContent = currentWather.weather[0].description;

    temperature.textContent = currentWather.main.temp;
    sup.textContent = units.fahrenheit;
    temperature.appendChild(sup);
    console.log(city, currentWather);
  };
  return {
    displayCurrentWeather,
  };
})();

const handleWeatherDataDisplay = (() => {
  const displayWeather = (city, currentWather, fiveDayForcast) => {
    displayCurrent.displayCurrentWeather(city, currentWather);
    displayForcast.displayFiveDayForcast(city, fiveDayForcast);
  };
  return {
    displayWeather,
  };
})();

export default handleWeatherDataDisplay;
