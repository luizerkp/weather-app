import "./css/normalize.css";
import "./css/weather-icons.css";
import "material-icons/iconfont/round.css";
import "./css/style.css";
import footer from "./footerContent";
import { currentWeatherInfoAPIRequest, forcastWeatherInfoAPIRequest, geocodingAPIRequest } from "./apiRequests";
import handleWeatherDataDisplay from "./displayWeatherData";

const handleError = (error) => {
  const errorDisplay = document.querySelector("#error-msg");
  const searchForm = document.querySelector("#search-form");
  errorDisplay.textContent = error.message;
  searchForm.classList.add("shake-search-form");
  // animation is set to .8s this remove the shake-search-form class after 800 millisecs so that it can be triggered again
  setTimeout(() => {
    searchForm.classList.remove("shake-search-form");
  }, 800);

  // if a status code is available log it the console
  if (error.status) {
    console.log(error.status);
  }
};

const getFiveDayForcast = async (lat, lon) => {
  const fiveDayForcast = await forcastWeatherInfoAPIRequest.fetchFiveDayForcast(lat, lon);
  return fiveDayForcast;
};

const getCurrentWeather = async (lat, lon) => {
  const currentLocalWeather = await currentWeatherInfoAPIRequest.fetchCurrentWeather(lat, lon);
  return currentLocalWeather;
};

const getCityGeocodeInfo = async (searchTerm) => {
  const city = await geocodingAPIRequest.fetchGeocoding(searchTerm);
  return city;
};

const getCityWeatherInfo = async (searchTerm) => {
  let cityGeocodingInfo;
  try {
    cityGeocodingInfo = await getCityGeocodeInfo(searchTerm);
  } catch (error) {
    return handleError(error);
  }

  const { city } = cityGeocodingInfo;
  const { lat } = cityGeocodingInfo;
  const { lon } = cityGeocodingInfo;

  let currentWeather;
  try {
    currentWeather = await getCurrentWeather(lat, lon);
  } catch (error) {
    return handleError(error);
  }

  let fiveDayWeatherForcastData;
  try {
    fiveDayWeatherForcastData = await getFiveDayForcast(lat, lon);
  } catch (error) {
    return handleError(error);
  }

  return handleWeatherDataDisplay.displayWeather(city, currentWeather, fiveDayWeatherForcastData);
};

const searchEventHandler = () => {
  const searchForm = document.querySelector("#search-form");
  const searchBar = document.querySelector("#search-bar");
  const errorDisplay = document.querySelector("#error-msg");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // clear any previously displayed error msg
    if (errorDisplay.textContent.length > 0) {
      errorDisplay.textContent = "";
    }

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
