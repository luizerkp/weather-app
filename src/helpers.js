export const geocodingAPIKey = "W4cIzkPzZLkpSBNgL3geH4JyljGuNRYD";
export const weatherAPIKey = "02fc8c5e0612a90cae215d46fdd00bdc";

export const createError = (statusCode, statusText) => {
  const defaultErrorText = `An Error has Occured see status code ${statusCode}`;
  const errorMsg = statusText || defaultErrorText;
  const error = new Error(errorMsg);
  error.status = `HTTP response code: ${statusCode}`;
  return error;
};

export const speedUnits = {
  fahrenheit: "mph",
  celcius: "kph",
};

export const asyncSetTimeOut = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const convertMetersPerSecondToKilometerPerHour = (speed) => Math.round(speed * 3.6);

export const convertToCardinalDirection = (deg) => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSE",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const directionIndex = Math.round(deg / 22.5) % 16;

  return directions[directionIndex];
};

// takes an object and rounds all the values in the object
export const roundObjValues = (obj) => {
  if (typeof obj !== "object") {
    return obj;
  }

  const roundedObjValues = {};
  Object.entries(obj).forEach(([key, value]) => {
    const roundedValue = {};
    // prevents a boolean true from being rounded to 1
    if (typeof value !== "boolean") {
      // will round value or leave as is if round returns NaN
      roundedValue[key] = Math.round(value) || value;
    } else {
      roundedValue[key] = value;
    }
    Object.assign(roundedObjValues, roundedValue);
  });

  return roundedObjValues;
};

const convertCelciusToFarenheit = (temp) => {
  const newtemp = Math.round(temp * (9 / 5) + 32);
  return newtemp;
};

const convertFahrenheitToCelcius = (temp) => {
  const newTemp = Math.round((temp - 32) * (5 / 9));
  return newTemp;
};

// convert temp to fahrenheit or leave as celcius based on whether user selected fahrenheit or celcius
// celcius is the unit we get back from the api but our default dislplay is in fahrenheit
export const defaultTempConversion = {
  fahrenheit: convertCelciusToFarenheit,
  celcius: (temp) => temp,
};

// used for switching between the two units back and forth when user clicks on the unit change btn
export const tempConversion = {
  fahrenheit: convertCelciusToFarenheit,
  celcius: convertFahrenheitToCelcius,
};

const convertKilometersPerHourToMilesPerHour = (speed) => {
  const conversion = 1.609344;
  const newSpeed = Math.round(speed / conversion);
  return newSpeed;
};

const convertMilesPerHourToKilometersPerHour = (speed) => {
  const conversion = 1.609344;
  const newSpeed = Math.round(speed * conversion);
  return newSpeed;
};

// convert wind speed to mph or leave as kph based on whether user selected fahrenheit or celcius
// kph is the unit we get back from the api but our default dislplay is in mph
export const defaultWindSpeedConversion = {
  fahrenheit: convertKilometersPerHourToMilesPerHour,
  celcius: (speed) => speed,
};

// used for switching between the two units back and forth when user clicks on the unit change btn
export const windSpeedConversion = {
  fahrenheit: convertKilometersPerHourToMilesPerHour,
  celcius: convertMilesPerHourToKilometersPerHour,
};

export const handleTemperatureDisplay = (temperatureDisplay, temp, selectedUnit) => {
  const span = document.createElement("span");
  const units = {
    fahrenheit: "\u2109",
    celcius: "\u2103",
  };

  temperatureDisplay.textContent = temp;

  span.textContent = units[selectedUnit];
  temperatureDisplay.appendChild(span);

  return temperatureDisplay;
};

export const handleWeatherIcon = (id) => {
  const weatherIcon = document.createElement("i");

  // makes use of the weather icons package from https://erikflowers.github.io/weather-icons/api-list.html i.e. <i class="wi wi-night-sleet"></i> with open weather icons having the class "wi-owm-{openweather icon id}"
  const currentWeatherIconClass = `wi-owm-${id}`;
  const wi = "wi";
  weatherIcon.classList.add(wi);
  weatherIcon.classList.add(currentWeatherIconClass);

  return weatherIcon;
};
