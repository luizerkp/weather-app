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
  const searchTerm = "";
  try {
    cities = await geocodingAPIRequest.getGeocoding(searchTerm);
  } catch (error) {
    console.log(error.errorText);
    return handleError(error);
  }

  let currentLocalWeather;
  // console.log(cities);
  try {
    currentLocalWeather = await weatherInfoAPIRequest.getCurrentWeather(cities[0].lat, cities[0].lon);
  } catch (error) {
    return handleError(error);
  }

  let fiveDayForcast;
  try {
    fiveDayForcast = await weatherInfoAPIRequest.getFiveDayForcast(cities[0].lat, cities[0].lon);
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
