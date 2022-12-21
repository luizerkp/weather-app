const convertCelciusToFarenheit = (temp) => Math.round(temp * (9 / 5) + 32);

const convertFahrenheitToCelcius = (temp) => Math.round((temp - 32) * (5 / 9));

const handleTemperatureDisplay = (temperatureDisplay, temp, selectedUnit) => {
  const sup = document.createElement("sup");
  const units = {
    fahrenheit: "\u2109",
    celcius: "\u2103",
  };

  temperatureDisplay.textContent = temp;

  sup.textContent = units[selectedUnit];
  temperatureDisplay.appendChild(sup);
  return temperatureDisplay;
};

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
    const cityName = document.querySelector(".city-name");
    const weatherConditons = document.querySelector(".current-weather-conditions");
    const temperature = document.querySelector(".current-temperature");
    const selectedUnit = document.querySelector("#selected").value;

    const tempConversion = {
      fahrenheit: currentWather.main.temp,
      celcius: convertFahrenheitToCelcius(currentWather.main.temp),
    };

    const temperatureDisplay = handleTemperatureDisplay(temperature, tempConversion[selectedUnit], selectedUnit);

    cityName.textContent = city;
    weatherConditons.textContent = currentWather.weather[0].description;

    temperature.replaceWith(temperatureDisplay);
    console.log(city, currentWather);
  };

  return {
    displayCurrentWeather,
  };
})();

const handleWeatherDataDisplay = (() => {
  const changeCurrentTempDisplay = () => {
    const currentTemperature = document.querySelector(".current-temperature");
    const selectedUnit = document.querySelector("#selected").value;

    // remove degree symbol from current temp
    const temp = currentTemperature.textContent.replace(/\D+/g, "");

    const tempConversion = {
      fahrenheit: convertCelciusToFarenheit(temp),
      celcius: convertFahrenheitToCelcius(temp),
    };

    const newTemperatureDisplay = handleTemperatureDisplay(
      currentTemperature,
      tempConversion[selectedUnit],
      selectedUnit
    );

    return currentTemperature.replaceWith(newTemperatureDisplay);
  };

  const changeDisplayTempUnits = () => {
    changeCurrentTempDisplay();
  };
  const displayWeather = (city, currentWather, fiveDayForcast) => {
    displayCurrent.displayCurrentWeather(city, currentWather);
    displayForcast.displayFiveDayForcast(city, fiveDayForcast);
  };
  return {
    displayWeather,
    changeDisplayTempUnits,
  };
})();

export default handleWeatherDataDisplay;
