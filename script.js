const accessToken = "pk.4bf7535e453668f0a4691ab77526e028";

const geo = navigator.geolocation;
const currPos = geo.getCurrentPosition(
  async function (e) {
    try {
      const latitude = await e.coords.latitude;
      const longitude = await e.coords.longitude;
      const response = await fetch(
        `https://eu1.locationiq.com/v1/reverse.php?key=${accessToken}&lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const city = data.address.city;
      console.log(city);
      setCity(city);
      weatherData(city);
    } catch (err) {
      console.error(err);
    }
  },
  (err) => {
    console.error("Could't get your position", err);
  }
);

const date = new Date();
const weekday = date.getDay();
const hour = date.getHours();

const dayOfWeek = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

// Weather api gives codes which describes weather condition

const conditions = {
  sunny: [1000, 1003],
  cloudy: [1006, 1009, 1030, 1135],
  rainy: [
    1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246,
  ],
  snowy: [
    1066, 1069, 1072, 1114, 1117, 1147, 1168, 1171, 1198, 1201, 1204, 1207,
    1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261,
    1264,
  ],
  thundery: [1087, 1273, 1276, 1279, 1282],
};

const conditionStyle = {
  sunny: { imgUrl: "./weather-icons/sunny.svg", color: "fcc9c5" },
  cloudy: { imgUrl: "./weather-icons/cloudy.svg", color: "b9cbd9" },
  rainy: { imgUrl: "./weather-icons/rainy.svg", color: "eae7e2" },
  snowy: { imgUrl: "./weather-icons/snowy.svg", color: "cfe3e2" },
  thundery: { imgUrl: "./weather-icons/thundery.svg", color: "e2d1ef" },
};

const displayWeekdays = document.querySelectorAll(".weekday");
const maxMinTemp = document.querySelectorAll(".max-min");
const mainTemp = document.querySelector(".main-temp");
const mainImg = document.querySelector(".main-img");
const searchBar = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");
const degToggle = document.querySelector(".slider");

let isCelcius = true;
let forecast;

const weatherData = async function (city = "Vilnius") {
  try {
    const response = await fetch(
      `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=3`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "d31113971cmshf0588227f767bd5p1ebe58jsn2531b1567fb5",
          "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();
    forecast = data.forecast.forecastday;
    setTempValues("c", forecast);
    setTemperature(forecast);
  } catch (err) {
    console.log(err);
  }
};

const setTemperature = function (arrTemp) {
  let nowCondition;

  for (const key in conditions) {
    if (conditions[key].includes(arrTemp[0].hour[hour].condition.code)) {
      nowCondition = key;
    }
  }

  document.documentElement.style.setProperty(
    "--main-color",
    `#${conditionStyle[nowCondition].color}`
  );

  mainImg.src = conditionStyle[nowCondition].imgUrl;

  displayWeekdays.forEach((el, index) => {
    if (index === 0) {
      el.textContent = "Today";
    } else {
      el.textContent = dayOfWeek[(weekday + index) % 7];
    }
  });
};

const setCity = function (city) {
  searchBar.value = city;
};

const setTempValues = function (deg, arrTemp) {
  mainTemp.textContent = isCelcius
    ? arrTemp[0].hour[hour].temp_c
    : arrTemp[0].hour[hour].temp_f;

  mainTemp.textContent = Math.round(mainTemp.textContent) + "°";

  displayWeekdays.forEach((el, index) => {
    let max = isCelcius
      ? arrTemp[index].day.maxtemp_c
      : arrTemp[index].day.maxtemp_f;
    max = Math.round(max);
    let min = isCelcius
      ? arrTemp[index].day.mintemp_c
      : arrTemp[index].day.mintemp_f;
    min = Math.round(min);
    maxMinTemp[index].textContent = `${max}°/${min}°`;
  });
};

searchBar.addEventListener("click", function () {
  searchBar.value = "";
});

searchBtn.addEventListener("click", function () {
  weatherData(searchBar.value);
});

degToggle.addEventListener("click", function () {
  isCelcius = !isCelcius;
  setTempValues(isCelcius, forecast);
});
