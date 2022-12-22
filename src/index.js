import "./css/normalize.css";
import "material-icons/iconfont/round.css";
import "./css/style.css";
import footer from "./footerContent";
import { weatherInfoAPIRequest, geocodingAPIRequest } from "./apiRequests";
import handleWeatherDataDisplay from "./displayWeatherData";

function handleError(error) {
  console.log(error.message);
}

const getFiveDayForcast = async (lat, lon) => {
  let fiveDayForcast;
  try {
    fiveDayForcast = await weatherInfoAPIRequest.fetchFiveDayForcast(lat, lon);
  } catch (error) {
    return handleError(error);
  }
  return fiveDayForcast;
};
const getCurrentWeather = async (lat, lon) => {
  let currentLocalWeather;
  // console.log(city);
  try {
    currentLocalWeather = await weatherInfoAPIRequest.fetchCurrentWeather(lat, lon);
  } catch (error) {
    return handleError(error);
  }
  return currentLocalWeather;
};
const getCityGeocodeInfo = async (searchTerm) => {
  let city;
  try {
    city = await geocodingAPIRequest.fetchGeocoding(searchTerm);
  } catch (error) {
    console.log(error.message);
    return handleError(error);
  }

  return city;
};

const getCityWeatherInfo = async (searchTerm) => {
  const cityGeocodingInfo = await getCityGeocodeInfo(searchTerm);
  const { city } = cityGeocodingInfo[0];
  const { lat } = cityGeocodingInfo[0];
  const { lon } = cityGeocodingInfo[0];
  const currentWeather = await getCurrentWeather(lat, lon);
  const fiveDayWeatherForcastData = await getFiveDayForcast(lat, lon);

  return handleWeatherDataDisplay.displayWeather(city, currentWeather, fiveDayWeatherForcastData);
};

const searchEventHandler = () => {
  const searchForm = document.querySelector("#search-form");
  const searchBar = document.querySelector("#search-bar");
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchQuery = searchBar.value.trim();
    if (searchQuery.length < 1) {
      return;
    }
    getCityWeatherInfo(searchQuery);
  });
};

const unitSelectionEventHandler = () => {
  const fahrenheitBtn = document.querySelector(".fahrenheit");
  const celciusBtn = document.querySelector(".celcius");

  // ensures only one btn is selected
  const buttonClickHandler = (event, btnOne, btnTwo) => {
    if (event.target.value === btnOne.value) {
      btnOne.setAttribute("id", "selected");
      btnTwo.removeAttribute("id");
    } else {
      btnTwo.setAttribute("id", "selected");
      btnOne.removeAttribute("id");
    }
  };

  fahrenheitBtn.addEventListener("click", (event) => {
    const currentUnit = document.querySelector("#selected").value;
    if (currentUnit !== fahrenheitBtn.value) {
      buttonClickHandler(event, fahrenheitBtn, celciusBtn);
      handleWeatherDataDisplay.changeDisplayTempUnits();
    }
  });

  celciusBtn.addEventListener("click", (event) => {
    const currentUnit = document.querySelector("#selected").value;
    if (currentUnit !== celciusBtn.value) {
      buttonClickHandler(event, fahrenheitBtn, celciusBtn);
      handleWeatherDataDisplay.changeDisplayTempUnits();
    }
  });
};

(() => {
  // get default cities weather info for intial loadout
  const defaultCity = "Auburn, WA";
  getCityWeatherInfo(defaultCity);

  // buildPageFooterContent
  footer.buildFooter();

  // add event listeners
  searchEventHandler();
  unitSelectionEventHandler();
})();
