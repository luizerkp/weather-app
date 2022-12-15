import { DateTime } from "luxon";

// get Weather icons `http://openweathermap.org/img/w/${icon}.png`

const geocodingAPIRequest = (() => {
  const limit = 1;
  const APIKey = "W4cIzkPzZLkpSBNgL3geH4JyljGuNRYD";

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
  const fetchGeocoding = async (city) => {
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
      throw new Error(`httpStatusCode: ${error.message}`);
    }

    const geocoderAPIResponseData = await geocoderAPIResponse.json();

    if (geocoderAPIResponseData.results.length < 1) {
      throw new Error("Results Empty");
    }

    const geocodeInfo = processGeoData(geocoderAPIResponseData.results);

    return geocodeInfo;
  };
  return {
    fetchGeocoding,
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

  const cleanForcastMainData = (data) => {
    const cleanedData = {
      temp_max: data.temp_max,
      temp_min: data.temp_min,
      feels_like: data.feels_like,
    };
    // in Five day forcast temp_max is alwasy equal to temp but not in current weather
    if (data.temp !== data.temp_max) {
      cleanedData.temp = data.temp;
    }
    return cleanedData;
  };

  const parseFiveDayForcastData = (data) => {
    // console.log(data);
    // console.log(timezone);
    let count = 0;
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
          date: data[count].dt,
          main: roundObjValues(cleanForcastMainData(data[count].main)),
          weather: data[count].weather,
        };
        fiveDayData[key].push(relevantData);
        count += 1;
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
      let highestFeelsLike = Number.NEGATIVE_INFINITY;
      value.forEach((item) => {
        highestMaxTemp = item.main.temp_max > highestMaxTemp ? item.main.temp_max : highestMaxTemp;
        lowestMinTemp = item.main.temp_min < lowestMinTemp ? item.main.temp_min : lowestMinTemp;
        highestFeelsLike = item.main.feels_like > highestFeelsLike ? item.main.feels_like : highestFeelsLike;
      });
      const cleanedData = {
        day,
        temp: { temp_max: highestMaxTemp, temp_min: lowestMinTemp, feels_like: highestFeelsLike },
        weather: { start: weatherStart, end: weatherEnd },
      };

      fiveDayCleanedForcast[key] = cleanedData;
      // console.log(`high: ${highestMaxTemp}`);
      // console.log(`low: ${lowestMinTemp}`);
      // console.log(`highest FL: ${highestFeelsLike}`);
      // console.log(weatherStart, weatherEnd);

      // console.log(day);
      // console.log(key, value);
    });
    return fiveDayCleanedForcast;
  };

  const convertToCardinalDirection = (deg) => {
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

  const processWeatherData = (data) => {
    const cleanedWeatherData = {
      temp: roundObjValues(cleanForcastMainData(data.main)),
      wind: {
        speed: Math.round(data.wind.speed),
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

  const fetchCurrentWeather = async (lat, lon, units = "imperial") => {
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
      throw new Error(`httpStatusCode: ${error.message}`);
    }
    const currentWeatherData = await weatherAPIResponse.json();
    console.log(currentWeatherData);
    const currentWeatherInfo = processWeatherData(currentWeatherData);
    return currentWeatherInfo;
  };

  const fetchFiveDayForcast = async (lat, lon) => {
    let weatherAPIResponse;
    const units = "imperial";
    try {
      weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=${units}`,
        { mode: "cors" }
      );
      if (!weatherAPIResponse.ok) {
        throw new Error(weatherAPIResponse.status);
      }
    } catch (error) {
      throw new Error(`httpStatusCode: ${error.message}`);
    }
    const fiveDayWeatherData = await weatherAPIResponse.json();
    // console.log(fiveDayWeatherData);
    const parsedFiveDayData = parseFiveDayForcastData(fiveDayWeatherData.list);
    const cleanedForcastInfo = processForcastData(parsedFiveDayData, fiveDayWeatherData.city.timezone);
    // console.log(parsedFiveDayData);
    // console.log(cleanedForcastInfo);
    return cleanedForcastInfo;
  };
  return {
    fetchCurrentWeather,
    fetchFiveDayForcast,
  };
})();

export { weatherInfoAPIRequest, geocodingAPIRequest };
