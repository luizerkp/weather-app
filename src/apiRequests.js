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

    console.log(geocoderAPIResponseData.results);

    const geocodeinfo = processGeoData(geocoderAPIResponseData.results);

    return geocodeinfo;
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
  // return {
  //   getWeather,
  // };
})();

export { weatherInfoAPIRequest, geocodingAPIRequest };
