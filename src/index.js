import "./css/normalize.css";
import "material-icons/iconfont/round.css";
import "./css/style.css";
import footer from "./footerContent";
import "./imgs/overcast.webp";
import "./imgs/partially-cloudy.webp";
import "./imgs/rainy.webp";
import "./imgs/sunny.webp";
import "./imgs/thunderstorm.webp";
import weatherInfoAPIRequest from "./weather-info";

const city = "Auburn";
weatherInfoAPIRequest.getWeather(city);

// buildPageContent
(() => {
  footer.buildFooter();
})();
