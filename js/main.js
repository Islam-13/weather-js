const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const navBtn = document.querySelector(".navbar-toggler");
const dataContainer = document.querySelector(".data-container");
const searchInput = document.querySelector(".search-input");
const locationBtn = document.querySelector(".location-btn");
const locationAlert = document.querySelector(".location-alert");
let currentLocation = "";

navBtn.addEventListener("click", () => navBtn.classList.toggle("show"));

locationBtn.addEventListener("click", async function () {
  await fetchAddress();
  searchInput.value = currentLocation;
  getWeatherData(currentLocation);
});

searchInput.addEventListener("input", function () {
  const search = searchInput.value;
  getWeatherData(search);
});

const baseURL =
  "https://api.weatherapi.com/v1/forecast.json?key=29adf76e7d8a4149971222823232812";

async function getWeatherData(search = "barce") {
  const result = await fetch(`${baseURL}&q=${search}&days=3&aqi=no&alerts=no`);
  const data = await result.json();
  if (data.error) return;
  else displayData(data);
}
getWeatherData();

function displayData({ current, location, forecast }) {
  const today = daysOfWeek.at(
    new Date(`${forecast.forecastday.at(0).date}`).getDay()
  );
  const nextDay = daysOfWeek.at(
    new Date(`${forecast.forecastday.at(1).date}`).getDay()
  );
  const afterNextDay = daysOfWeek.at(
    new Date(`${forecast.forecastday.at(2).date}`).getDay()
  );
  const dayOfMonth = new Date(`${forecast.forecastday.at(0).date}`).getDate();
  const month = new Date(`${forecast.forecastday.at(0).date}`).getMonth();
  const todayDate = `${dayOfMonth} ${months.at(month)}`;

  dataContainer.innerHTML = `
  <div class="col-md-4">
            <div class="today-box">
              <div class="title d-flex justify-content-between">
                <span>${today}</span>
                <span>${todayDate}</span>
              </div>
              <div class="today-body">
                <div class="city-name">${location.name}</div>
                <div class="degree">
                  <div class="num">${current.temp_c}<sup>o</sup>C</div>
                  <div class="icon-degree d-inline-block">
                    <img src="${current.condition.icon}" alt="" />
                  </div>
                </div>
                <div class="status">${current.condition.text}</div>
                <div class="d-flex gap-3 align-items-center">
                  <span> <i class="fa-solid fa-umbrella"></i> 20% </span>
                  <span><i class="fa-solid fa-wind"></i> ${
                    current.wind_kph
                  } km/h</span>
                  <span
                    ><i class="fa-solid fa-regular fa-compass"></i> ${
                      current.wind_dir
                    }</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="next-day-box text-center">
              <div class="title">
                <span>${nextDay}</span>
              </div>
              <div class="next-day-body">
                <div class="icon">
                  <img src="${
                    forecast.forecastday.at(1).day.condition.icon
                  }" alt="" />
                </div>
                <div class="big-degree">${
                  forecast.forecastday.at(1).day.maxtemp_c
                }<sup>o</sup>C</div>
                <div class="small-degree">${
                  forecast.forecastday.at(1).day.mintemp_c
                }<sup>o</sup></div>
                <div class="status">${
                  forecast.forecastday.at(1).day.condition.text
                }</div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="next-day-box text-center">
              <div class="title">
                <span>${afterNextDay}</span>
              </div>
              <div class="next-day-body">
                <div class="icon">
                  <img src="${
                    forecast.forecastday.at(2).day.condition.icon
                  }" alt="" />
                </div>
                <div class="big-degree">${
                  forecast.forecastday.at(2).day.maxtemp_c
                }<sup>o</sup>C</div>
                <div class="small-degree">${
                  forecast.forecastday.at(2).day.mintemp_c
                }<sup>o</sup></div>
                <div class="status">${
                  forecast.forecastday.at(2).day.condition.text
                }</div>
              </div>
            </div>
          </div>
  `;
}

function getPosition() {
  return new Promise(function (success, reject) {
    function reject() {
      locationAlert.innerHTML = `Location is not available,
      <strong>Please make sure to turn on device location!!`;
      locationAlert.classList.add("show");
      setTimeout(function () {
        locationAlert.innerHTML = "";
        locationAlert.classList.remove("show");
      }, 5000);
    }
    navigator.geolocation.getCurrentPosition(success, reject);
  });
}

async function getAddress({ latitude, longitude }) {
  const result = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}`
  );
  const data = await result.json();
  return data;
}

async function fetchAddress() {
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };
  const addressObj = await getAddress(position);
  const address = `${addressObj.city}`;

  currentLocation = address;
}
