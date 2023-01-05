import { DateTime } from "luxon";
import {
  convertToCardinalDirection,
  convertMetersPerSecondToKilometerPerHour,
  roundObjValues,
  geocodingAPIKey,
  weatherAPIKey,
  createError,
} from "./helpers";

const geocodingAPIRequest = (() => {
  const limit = 1;

  const processGeoData = (results) => {
    // api fetch is limited to one which results in the one result with the heighest confidense
    // returned in an array of size 1
    const cleanedData = {
      city: `${results[0].address.freeformAddress} ${results[0].address.countryCodeISO3}`,
      lat: results[0].position.lat,
      lon: results[0].position.lon,
    };

    return cleanedData;
  };

  // lat & lon for up to five cities
  const fetchGeocoding = async (city) => {
    let geocoderAPIResponse;
    try {
      geocoderAPIResponse = await fetch(
        `https://api.tomtom.com/search/2/geocode/${city}.json?key=${geocodingAPIKey}&limit=${limit}`,
        { mode: "cors" }
      );
      if (!geocoderAPIResponse.ok) {
        throw geocoderAPIResponse;
      }
    } catch (error) {
      const newError = createError(error.status, error.statusText);
      throw newError;
    }

    const geocoderAPIResponseData = await geocoderAPIResponse.json();

    if (geocoderAPIResponseData.results.length < 1) {
      throw new Error("Location not found");
    }

    const geocodeInfo = processGeoData(geocoderAPIResponseData.results);

    return geocodeInfo;
  };

  return {
    fetchGeocoding,
  };
})();

const currentWeatherInfoAPIRequest = (() => {
  const processWeatherData = (data) => {
    const cleanedWeatherData = {
      main: roundObjValues(data.main),
      wind: {
        speed: convertMetersPerSecondToKilometerPerHour(data.wind.speed),
        direction: convertToCardinalDirection(data.wind.deg),
      },
      weather: data.weather,
      humidity: data.main.humidity,
      sunrise: DateTime.fromSeconds(data.sys.sunrise + data.timezone, {
        zone: "UTC",
      }).toLocaleString(DateTime.TIME_SIMPLE),
      sunset: DateTime.fromSeconds(data.sys.sunset + data.timezone, {
        zone: "UTC",
      }).toLocaleString(DateTime.TIME_SIMPLE),
    };

    return cleanedWeatherData;
  };

  const fetchCurrentWeather = async (lat, lon) => {
    const units = "metric";
    let weatherAPIResponse;

    try {
      weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=${units}`,
        { mode: "cors" }
      );
      if (!weatherAPIResponse.ok) {
        throw weatherAPIResponse;
      }
    } catch (error) {
      const newError = createError(error.status, error.statusText);
      throw newError;
    }

    const currentWeatherData = await weatherAPIResponse.json();
    const currentWeatherInfo = processWeatherData(currentWeatherData);

    return currentWeatherInfo;
  };

  return {
    fetchCurrentWeather,
  };
})();

// fectch and clean forcast data
const forcastWeatherInfoAPIRequest = (() => {
  const parseFiveDayForcastData = (data) => {
    // forcast data is an array of objects each representing a 3-hour step indexed from 0 to 39
    let threeHourForcast = 0;
    const fiveDayData = {
      day1: [],
      day2: [],
      day3: [],
      day4: [],
      day5: [],
    };

    Object.entries(fiveDayData).forEach(([key]) => {
      for (let i = 0; i < 8; i += 1) {
        const relevantData = {
          date: data[threeHourForcast].dt,
          main: roundObjValues(data[threeHourForcast].main),
          weather: data[threeHourForcast].weather,
        };
        fiveDayData[key].push(relevantData);
        threeHourForcast += 1;
      }
    });

    return fiveDayData;
  };
  const processForcastData = (data, timezone) => {
    const fiveDayCleanedForcast = {};

    Object.entries(data).forEach(([key, value]) => {
      const len = value.length;
      const day = DateTime.fromSeconds(value[0].date + timezone, {
        zone: "UTC",
      }).weekdayLong;

      const weatherStart = value[0].weather;
      const weatherEnd = value[len - 1].weather;

      let highestMaxTemp = Number.NEGATIVE_INFINITY;
      let lowestMinTemp = Number.POSITIVE_INFINITY;

      value.forEach((item) => {
        highestMaxTemp = item.main.temp_max > highestMaxTemp ? item.main.temp_max : highestMaxTemp;
        lowestMinTemp = item.main.temp_min < lowestMinTemp ? item.main.temp_min : lowestMinTemp;
      });
      const cleanedData = {
        day,
        temp: { temp_max: highestMaxTemp, temp_min: lowestMinTemp },
        weather: { start: weatherStart, end: weatherEnd },
      };

      fiveDayCleanedForcast[key] = cleanedData;
    });

    return fiveDayCleanedForcast;
  };

  const fetchFiveDayForcast = async (lat, lon) => {
    let weatherAPIResponse;
    const units = "metric";

    try {
      weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherAPIKey}&units=${units}`,
        { mode: "cors" }
      );
      if (!weatherAPIResponse.ok) {
        throw weatherAPIResponse;
      }
    } catch (error) {
      const newError = createError(error.status, error.statusText);
      throw newError;
    }

    const fiveDayWeatherData = await weatherAPIResponse.json();

    const parsedFiveDayData = parseFiveDayForcastData(fiveDayWeatherData.list);
    const cleanedForcastInfo = processForcastData(parsedFiveDayData, fiveDayWeatherData.city.timezone);

    return cleanedForcastInfo;
  };

  return {
    fetchFiveDayForcast,
  };
})();

export { geocodingAPIRequest, currentWeatherInfoAPIRequest, forcastWeatherInfoAPIRequest };
