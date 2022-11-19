const weatherInfoAPIRequest = (() => {
  const limit = 5;
  const APIKey = "916119c80d2af6a7468e20b7fd5cbb78";

  // gecoding api to get lat & lon for up to 5 city with same name `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${APIKey}`

  // openweather current weather api `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`

  // openweather 5 day forcast api api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid={API key}

  //   const handleError = (err) => {

  // }

  // lat & lon for up to five cities
  const getGeocoding = async (city) => {
    const geocoderAPIResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${APIKey}`,
      { mode: "cors" }
    );
    const geocoderAPIResponseData = await geocoderAPIResponse.json();
    console.log(geocoderAPIResponse);
    return geocoderAPIResponseData;
  };

  // const getCurrentWeather = async (cities) => {

  // }

  // const getFiveDayForcast = async (cities) => {

  // }

  const getWeather = async (city) => {
    const citiesLocationInfo = await getGeocoding(city);

    return console.log(citiesLocationInfo);
  };

  return {
    getWeather,
  };
})();

export default weatherInfoAPIRequest;
