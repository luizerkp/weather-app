import "./css/normalize.css";
import "material-icons/iconfont/round.css";
import "./css/style.css";
import footer from "./footerContent";
import "./imgs/overcast.webp";
import "./imgs/partially-cloudy.webp";
import "./imgs/rainy.webp";
import "./imgs/sunny.webp";
import "./imgs/thunderstorm.webp";
import { weatherInfoAPIRequest, geocodingAPIRequest } from "./apiRequests";

function handleError(error) {
  console.log(error.message);
}

(async () => {
  let cities;
  const searchTerm = "Auburn";
  try {
    cities = await geocodingAPIRequest.fetchGeocoding(searchTerm);
  } catch (error) {
    console.log(error.message);
    return handleError(error);
  }

  let currentLocalWeather;
  // console.log(cities);
  try {
    currentLocalWeather = await weatherInfoAPIRequest.fetchCurrentWeather(cities[0].lat, cities[0].lon);
  } catch (error) {
    return handleError(error);
  }

  let fiveDayForcast;
  try {
    fiveDayForcast = await weatherInfoAPIRequest.fetchFiveDayForcast(cities[0].lat, cities[0].lon);
  } catch (error) {
    return handleError(error);
  }
  console.log("Current Weather: ", currentLocalWeather);
  return console.log("Five Day Forcast: ", fiveDayForcast);
})();

// buildPageFooterContent
(() => {
  footer.buildFooter();
})();
