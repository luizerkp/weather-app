const convertCelciusToFarenheit = (temp) => {
  const newtemp = Math.round(temp * (9 / 5) + 32);
  return newtemp;
};
const convertFahrenheitToCelcius = (temp) => {
  const newTemp = Math.round((temp - 32) * (5 / 9));
  return newTemp;
};

// const convertKilometersPerHourToMilesPerHour = (speed) => {
//   const conversion = 1.609344;
//   const newSpeed = Math.round(speed / conversion);
//   return newSpeed;
// };

// const convertMilesPerHourToKilometersPerHour = (speed) => {
//   const conversion = 1.609344;
//   const newSpeed = Math.round(speed * conversion);
//   return newSpeed;
// };

const handleTemperatureDisplay = (temperatureDisplay, temp, selectedUnit) => {
  const span = document.createElement("span");
  const units = {
    fahrenheit: "\u2109",
    celcius: "\u2103",
  };

  temperatureDisplay.textContent = temp;

  span.textContent = units[selectedUnit];
  temperatureDisplay.appendChild(span);
  // console.log(temperatureDisplay.textContent);
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

// Data from api comes back in metric it is then converted to imperial or left as is depending on selected unit
const displayCurrent = (() => {
  const displayCurrentWeather = (city, currentWeather) => {
    const cityName = document.querySelector(".city-name");
    const weatherConditons = document.querySelector(".current-weather-conditions");
    const temperature = document.querySelector(".current-temperature");
    const selectedUnit = document.querySelector("#selected").value;

    // display temp in fahrenheit or celcius based on whether user selected fahrenheit or celcius
    const tempConversion = {
      fahrenheit: convertCelciusToFarenheit(currentWeather.main.temp),
      celcius: currentWeather.main.temp,
    };

    // display wind speed in metric or imperial based on whether user selected fahrenheit or celcius
    // const windSpeedConversion = {
    //   fahrenheit: convertKilometersPerHourToMilesPerHour,
    //   celcius: currentWeather.wind.speed,
    // }

    const temperatureDisplay = handleTemperatureDisplay(temperature, tempConversion[selectedUnit], selectedUnit);

    cityName.textContent = city;
    weatherConditons.textContent = currentWeather.weather[0].description;

    temperature.replaceWith(temperatureDisplay);
    console.log(city, currentWeather);
  };

  return {
    displayCurrentWeather,
  };
})();

const handleWeatherDataDisplay = (() => {
  const changeCurrentTempDisplay = () => {
    const currentTemperature = document.querySelector(".current-temperature");
    const selectedUnit = document.querySelector("#selected").value;

    // remove degree symbol from current temp: regex matches \u2109 (℉) and \u2103 (℃) and replace with ''
    const temp = currentTemperature.textContent.replace(/[\u2109\u2103]+/g, "");

    // console.log(temp);

    const tempConversion = {
      fahrenheit: convertCelciusToFarenheit,
      celcius: convertFahrenheitToCelcius,
    };

    // const windSpeedConversion = {
    //   fahrenheit: convertKilometersPerHourToMilesPerHour,
    //   celcius: convertMilesPerHourToKilometersPerHour,
    // }

    const newTemperature = tempConversion[selectedUnit](temp);

    const newTemperatureDisplay = handleTemperatureDisplay(currentTemperature, newTemperature, selectedUnit);

    return currentTemperature.replaceWith(newTemperatureDisplay);
  };

  const changeDisplayTempUnits = () => {
    changeCurrentTempDisplay();
  };
  const displayWeather = (city, currentWeather, fiveDayForcast) => {
    displayCurrent.displayCurrentWeather(city, currentWeather);
    displayForcast.displayFiveDayForcast(city, fiveDayForcast);
  };
  return {
    displayWeather,
    changeDisplayTempUnits,
  };
})();

export default handleWeatherDataDisplay;
