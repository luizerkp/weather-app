import {
  handleTemperatureDisplay,
  speedUnits,
  handleWeatherIcon,
  defaultTempConversion,
  defaultWindSpeedConversion,
  tempConversion,
  windSpeedConversion,
} from "./helpers";

const displayForcast = (() => {
  const buildDayTitleContainer = (dayTitle) => {
    const dayTitleContainer = document.createElement("p");
    dayTitleContainer.classList.add("day-title");
    dayTitleContainer.textContent = dayTitle;
    return dayTitleContainer;
  };

  // Data from api comes back in metric it is then converted to imperial or left as is depending on selected unit
  const buildTemperatureRangeContainer = (temperatureMax, temperatureMin) => {
    const temperatureRangeContainer = document.createElement("div");
    temperatureRangeContainer.classList.add("temperature-range");

    const selectedUnit = document.querySelector("#selected").value;

    const paraElementMaxTemperature = document.createElement("p");
    paraElementMaxTemperature.classList.add("temperature-max", "temperature-value");
    const paraElementMinTemperature = document.createElement("p");
    paraElementMinTemperature.classList.add("temperature-min", "temperature-value");

    const temperatureMaxContainer = handleTemperatureDisplay(
      paraElementMaxTemperature,
      defaultTempConversion[selectedUnit](temperatureMax),
      selectedUnit
    );

    const temperatureMinContainer = handleTemperatureDisplay(
      paraElementMinTemperature,
      defaultTempConversion[selectedUnit](temperatureMin),
      selectedUnit
    );

    temperatureRangeContainer.appendChild(temperatureMaxContainer);
    temperatureRangeContainer.appendChild(temperatureMinContainer);

    return temperatureRangeContainer;
  };

  const buildIconConatiner = (iconStartId, iconEndId) => {
    const weatherIconDiv = document.createElement("div");
    weatherIconDiv.classList.add("forcast-day-icon");

    const weatherIconStartPara = document.createElement("p");
    const weatherIconStart = handleWeatherIcon(iconStartId);
    weatherIconStart.classList.add("weather-icon");
    weatherIconStartPara.appendChild(weatherIconStart);

    const weatherIconEndPara = document.createElement("p");
    const weatherIconEnd = handleWeatherIcon(iconEndId);
    weatherIconEnd.classList.add("weather-icon");
    weatherIconEndPara.appendChild(weatherIconEnd);

    weatherIconDiv.appendChild(weatherIconStartPara);
    weatherIconDiv.appendChild(weatherIconEndPara);

    return weatherIconDiv;
  };

  const buildDayForcastContainer = (dayData) => {
    const forcastDayContainer = document.createElement("div");
    forcastDayContainer.classList.add("forcast-day-container");

    // console.log(dayData.temp.temp_max)
    const title = buildDayTitleContainer(dayData.day);
    const temperatureRange = buildTemperatureRangeContainer(dayData.temp.temp_max, dayData.temp.temp_min);
    const weatherIcons = buildIconConatiner(dayData.weather.start[0].id, dayData.weather.end[0].id);
    forcastDayContainer.appendChild(title);
    forcastDayContainer.appendChild(temperatureRange);
    forcastDayContainer.appendChild(weatherIcons);

    return forcastDayContainer;
  };

  const displayFiveDayForcast = (city, fiveDayForcast) => {
    const forcastContainer = document.querySelector(".forcast-container");
    // empty the container
    forcastContainer.replaceChildren();

    Object.entries(fiveDayForcast).forEach((day) => {
      const forcastDayContainer = buildDayForcastContainer(day[1]);
      forcastContainer.appendChild(forcastDayContainer);
    });
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

    const weatherIcon = handleWeatherIcon(currentWeather.weather[0].id);

    cityName.textContent = city;
    weatherConditons.textContent = currentWeather.weather[0].description;
    weatherConditons.appendChild(weatherIcon);

    const temperatureDisplay = handleTemperatureDisplay(
      temperature,
      defaultTempConversion[selectedUnit](currentWeather.main.temp),
      selectedUnit
    );

    temperature.replaceWith(temperatureDisplay);

    feelsLike.textContent = defaultTempConversion[selectedUnit](currentWeather.main.feels_like);
    currentRangeHigh.textContent = defaultTempConversion[selectedUnit](currentWeather.main.temp_max);
    currentRangeLow.textContent = defaultTempConversion[selectedUnit](currentWeather.main.temp_min);
    currentWindsSpeed.textContent = `${
      defaultWindSpeedConversion[selectedUnit](currentWeather.wind.speed) + speedUnits[selectedUnit]
    }`;
    currentWindDirection.textContent = currentWeather.wind.direction;
    humidity.textContent = `${`${currentWeather.humidity}%`}`;
    sunrise.textContent = currentWeather.sunrise;
    sunset.textContent = currentWeather.sunset;
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

  const changeForcastTempDisplay = () => {
    const currentForcastTemperatureValues = document.querySelectorAll(".temperature-value");
    const selectedUnit = document.querySelector("#selected").value;

    currentForcastTemperatureValues.forEach((temperatureValue) => {
      const temperatureNumber = temperatureValue.textContent.replace(/[\u2109\u2103]+/g, "");
      const newTemperature = tempConversion[selectedUnit](temperatureNumber);
      const newTemperatureDisplay = handleTemperatureDisplay(temperatureValue, newTemperature, selectedUnit);
      temperatureValue.replaceWith(newTemperatureDisplay);
    });
  };

  const changeDisplayTempUnits = () => {
    changeCurrentTempDisplay();
    changeForcastTempDisplay();
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
