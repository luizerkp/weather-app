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
  console.log(error);
}

(async () => {
  let cities;
  const searchTerm = "New York";
  try {
    cities = await geocodingAPIRequest.getGeocoding(searchTerm);
  } catch (error) {
    return handleError(error);
  }

  let currentLocalWeather;
  console.log(cities);
  try {
    currentLocalWeather = await weatherInfoAPIRequest.getCurrentWeather(cities[0].lat, cities[0].lon);
  } catch (error) {
    return handleError(error);
  }
  // return console.log(currentLocalWeather);
  // return console.log(cities);
})();

// weatherInfoAPIRequest.getWeather(city);

// buildPageContent
(() => {
  footer.buildFooter();
})();
