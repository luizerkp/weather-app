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

export const convertCelciusToFarenheit = (temp) => {
  const newtemp = Math.round(temp * (9 / 5) + 32);
  return newtemp;
};

export const convertFahrenheitToCelcius = (temp) => {
  const newTemp = Math.round((temp - 32) * (5 / 9));
  return newTemp;
};

export const convertKilometersPerHourToMilesPerHour = (speed) => {
  const conversion = 1.609344;
  const newSpeed = Math.round(speed / conversion);
  return newSpeed;
};

export const convertMilesPerHourToKilometersPerHour = (speed) => {
  const conversion = 1.609344;
  const newSpeed = Math.round(speed * conversion);
  return newSpeed;
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
