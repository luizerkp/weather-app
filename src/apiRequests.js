import { DateTime } from "luxon";

// get Weather icons `http://openweathermap.org/img/w/${icon}.png`

const geocodingAPIRequest = (() => {
  const limit = 1;
  const APIKey = "W4cIzkPzZLkpSBNgL3geH4JyljGuNRYD";

  // openweather 5 day forcast api api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={API key}

  const processGeoData = (results) => {
    // console.log(results);
    const cleanedData = [];
    results.forEach((result) => {
      const locationObj = {
        city: result.address.freeformAddress,
        country: result.address.country,
        lat: result.position.lat,
        lon: result.position.lon,
      };
      cleanedData.push(locationObj);
    });
    return cleanedData;
  };

  // lat & lon for up to five cities
  const getGeocoding = async (city) => {
    let geocoderAPIResponse;
    try {
      geocoderAPIResponse = await fetch(
        `https://api.tomtom.com/search/2/geocode/${city}.json?key=${APIKey}&limit=${limit}`,
        { mode: "cors" }
      );
      if (!geocoderAPIResponse.ok) {
        throw new Error(geocoderAPIResponse.status);
      }
    } catch (error) {
      throw new Error(error);
    }

    const geocoderAPIResponseData = await geocoderAPIResponse.json();

    if (geocoderAPIResponseData.results.length < 1) {
      throw new Error("Results Empty");
    }

    const geocodeInfo = processGeoData(geocoderAPIResponseData.results);

    return geocodeInfo;
  };
  return {
    getGeocoding,
  };
})();

const weatherInfoAPIRequest = (() => {
  const APIKey = "02fc8c5e0612a90cae215d46fdd00bdc";
  const roundObjValues = (obj) => {
    if (typeof obj !== "object") {
      return obj;
    }

    const roundedObjValues = {};
    Object.entries(obj).forEach(([key, value]) => {
      const roundedValue = {};
      roundedValue[key] = Math.round(value);
      Object.assign(roundedObjValues, roundedValue);
    });

    return roundedObjValues;
  };
  const parseForcastData = (data) => {
    let count = 1;
    const fiveDayData = {
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
    };
  };
  const processWeatherData = (data) => {
    const cleanedWeatherData = {
      main: roundObjValues(data.main),
      wind: roundObjValues(data.wind),
      weather: data.weather,
      visibility: data.visibility,
      sunrise: DateTime.fromSeconds(data.sys.sunrise + data.timezone, {
        zone: "UTC",
      }).toLocaleString(DateTime.TIME_SIMPLE),
      sunset: DateTime.fromSeconds(data.sys.sunset + data.timezone, {
        zone: "UTC",
      }).toLocaleString(DateTime.TIME_SIMPLE),
    };
    return cleanedWeatherData;
  };

  const getCurrentWeather = async (lat, lon, units = "imperial") => {
    let weatherAPIResponse;
    try {
      weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=${units}`,
        { mode: "cors" }
      );
      if (!weatherAPIResponse.ok) {
        throw new Error(weatherAPIResponse.status);
      }
    } catch (error) {
      throw new Error(error);
    }
    const currentWeatherData = await weatherAPIResponse.json();
    const currentWeatherInfo = processWeatherData(currentWeatherData);
    return currentWeatherInfo;
  };

  const getFiveDayForcast = async (lat, lon, units = "imperial") => {
    let weatherAPIResponse;
    try {
      weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=${units}`,
        { mode: "cors" }
      );
      if (!weatherAPIResponse.ok) {
        throw new Error(weatherAPIResponse.status);
      }
    } catch (error) {
      throw new Error(error);
    }
    const fiveDayWeatherData = await weatherAPIResponse.json();
    console.log(fiveDayWeatherData);
  };
  return {
    getCurrentWeather,
    getFiveDayForcast,
  };
})();

export { weatherInfoAPIRequest, geocodingAPIRequest };
