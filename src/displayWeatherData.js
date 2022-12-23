import {
  convertCelciusToFarenheit,
  convertFahrenheitToCelcius,
  convertKilometersPerHourToMilesPerHour,
  convertMilesPerHourToKilometersPerHour,
  handleTemperatureDisplay,
} from "./helpers";

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

    const feelsLike = document.querySelector(".feels-like");
    const currentRangeHigh = document.querySelector(".current-range-high");
    const currentRangeLow = document.querySelector(".current-range-low");
    const currentWindsSpeed = document.querySelector(".wind-speed");
    const currentWindDirection = document.querySelector(".wind-direction");

    const humidity = document.querySelector(".humidity");
    const sunrise = document.querySelector(".sunrise");
    const sunset = document.querySelector(".sunset");

    const weatherIcon = document.createElement("i");

    // makes use of the weather icons package from https://erikflowers.github.io/weather-icons/api-list.html i.e. <i class="wi wi-night-sleet"></i> with open weather icons having the class "wi-owm-{openweather icon id}"
    const currentWeatherIconClass = `wi-owm-${currentWeather.weather[0].id}`;
    const wi = "wi";
    weatherIcon.classList.add(wi);
    weatherIcon.classList.add(currentWeatherIconClass);

    // convert temp to fahrenheit or leave as celcius based on whether user selected
    const tempConversion = {
      fahrenheit: convertCelciusToFarenheit,
      celcius: (temp) => temp,
    };

    // convert wind speed to mph or leave as kph based on whether user selected fahrenheit or celcius
    const windSpeedConversion = {
      fahrenheit: convertKilometersPerHourToMilesPerHour,
      celcius: (speed) => speed,
    };

    const speedUnits = {
      fahrenheit: "mph",
      celcius: "kph",
    };

    cityName.textContent = city;
    weatherConditons.textContent = currentWeather.weather[0].description;
    weatherConditons.appendChild(weatherIcon);

    const temperatureDisplay = handleTemperatureDisplay(
      temperature,
      tempConversion[selectedUnit](currentWeather.main.temp),
      selectedUnit
    );

    temperature.replaceWith(temperatureDisplay);

    feelsLike.textContent = tempConversion[selectedUnit](currentWeather.main.feels_like);
    currentRangeHigh.textContent = tempConversion[selectedUnit](currentWeather.main.temp_max);
    currentRangeLow.textContent = tempConversion[selectedUnit](currentWeather.main.temp_min);
    currentWindsSpeed.textContent = `${
      windSpeedConversion[selectedUnit](currentWeather.wind.speed) + speedUnits[selectedUnit]
    }`;
    currentWindDirection.textContent = currentWeather.wind.direction;
    humidity.textContent = `${`${currentWeather.humidity}%`}`;
    sunrise.textContent = currentWeather.sunrise;
    sunset.textContent = currentWeather.sunset;

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
    const currentRangeHigh = document.querySelector(".current-range-high");
    const currentRangeLow = document.querySelector(".current-range-low");
    const feelsLike = document.querySelector(".feels-like");
    const windSpeed = document.querySelector(".wind-speed");

    // remove degree symbol from current temp: regex matches \u2109 (℉) and \u2103 (℃) and replace with ''
    const temp = currentTemperature.textContent.replace(/[\u2109\u2103]+/g, "");

    const tempHigh = currentRangeHigh.textContent;
    const tempLow = currentRangeLow.textContent;
    const feelsLikeTemp = feelsLike.textContent;

    const speed = windSpeed.textContent.replace(/\D+/g, "");

    // console.log(speed);
    // console.log(temp);

    const tempConversion = {
      fahrenheit: convertCelciusToFarenheit,
      celcius: convertFahrenheitToCelcius,
    };

    const windSpeedConversion = {
      fahrenheit: convertKilometersPerHourToMilesPerHour,
      celcius: convertMilesPerHourToKilometersPerHour,
    };

    const speedUnits = {
      fahrenheit: "mph",
      celcius: "kph",
    };

    const newTemperature = tempConversion[selectedUnit](temp);
    const newTemperatureHigh = tempConversion[selectedUnit](tempHigh);
    const newTemperatureLow = tempConversion[selectedUnit](tempLow);
    const newFeelsLikeTemp = tempConversion[selectedUnit](feelsLikeTemp);

    const newSpeed = windSpeedConversion[selectedUnit](speed);

    const newTemperatureDisplay = handleTemperatureDisplay(currentTemperature, newTemperature, selectedUnit);

    currentRangeHigh.textContent = newTemperatureHigh;
    currentRangeLow.textContent = newTemperatureLow;
    feelsLike.textContent = newFeelsLikeTemp;
    windSpeed.textContent = `${newSpeed + speedUnits[selectedUnit]}`;

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
