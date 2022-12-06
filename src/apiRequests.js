// get Weather icons `http://openweathermap.org/img/w/${icon}.png`

const geocodingAPIRequest = (() => {
  const limit = 5;
  const APIKey = "W4cIzkPzZLkpSBNgL3geH4JyljGuNRYD";

  // gecoding api to get lat & lon for up to 5 city with same name `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${APIKey}`

  // `https://api.tomtom.com/search/2/geocode/${city}.json?key=${APIKey}&limit=${limit}`

  // openweather current weather api `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`

  // openweather 5 day forcast api api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={API key}

  //   const handleError = (err) => {

  // }

  const processGeoData = (results) => {
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
  // const getCurrentWeather = async (cities) => {
  // }
  // const getFiveDayForcast = async (cities) => {
  // }
  // const getWeather = async (city) => {
  //   let citiesLocationInfo;
  //   try {
  //     citiesLocationInfo = await geocodingAPIRequest.getGeocoding(city);
  //     return console.log(citiesLocationInfo);
  //   } catch (error) {
  //     return handleError(error);
  //   }
  // };
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
  const processWeatherData = (data) => {
    console.log(data);
    const cleanedWeatherData = {
      main: roundObjValues(data.main),
      wind: roundObjValues(data.wind),
      weather: data.weather,
      visibility: data.visibility,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sunset: new Date(data.sys.sunset * 1000 + data.timezone).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    console.log(cleanedWeatherData);
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
    const sunrise = new Date((currentWeatherData.sys.sunrise + currentWeatherData.timezone) * 1000);
    console.log(sunrise);
    const currentWeatherInfo = processWeatherData(currentWeatherData);
    console.log(currentWeatherInfo);
  };
  return {
    getCurrentWeather,
  };
})();

export { weatherInfoAPIRequest, geocodingAPIRequest };
