const API_KEY = "30388717e32fbe7e0eac8fa7a7bf7941";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast`;

const forecastContainer = document.getElementById("forecast-cards");
const hourlyContainer = document.getElementById("hourly-forecast");
const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");

// Arrow buttons
const forecastLeft = document.getElementById("forecast-left");
const forecastRight = document.getElementById("forecast-right");
const hourlyLeft = document.getElementById("hourly-left");
const hourlyRight = document.getElementById("hourly-right");

// Fetch weather data
async function fetchDetailedWeather(city) {
  const response = await fetch(
    `${API_URL}?q=${city}&units=imperial&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("City not found");
  const data = await response.json();
  console.log(data);
  return data;
}

// Group hourly data by day
function groupByDay(list) {
  return list.reduce((acc, item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
}

// Render daily forecast cards
function renderDailyForecast(days) {
  forecastContainer.innerHTML = ""; // Clear previous content

  Object.keys(days).forEach((date, index) => {
    if (index >= 5) return; // Limit to 5 days

    const dayData = days[date][0];
    const { temp } = dayData.main;
    const { icon, description } = dayData.weather[0];

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.dataset.date = date;

    const imgSize = "100px";

    card.style.backgroundColor = "#292929";
    card.style.fontFamily = "Timeburner";
    card.style.color = "#ffffff";
    card.style.boxShadow = "0 7px 10px black";
    card.style.borderRadius = "10px";
    card.style.height = "200px";

    card.innerHTML = `
      <h3 style="font-size: 40px">${new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
      })}</h3>
      <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" style="height: ${imgSize}; width: ${imgSize};">
    `;
    card.addEventListener("click", () => renderHourlyForecast(days[date])); // Show hourly forecast on click
    forecastContainer.appendChild(card);
  });
}

// Render hourly forecast cards
function renderHourlyForecast(hours) {
  hourlyContainer.innerHTML = ""; // Clear previous content

  hours.forEach((hour) => {
    const { temp } = hour.main;
    const { icon, description } = hour.weather[0];
    const time = new Date(hour.dt_txt).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    const card = document.createElement("div");
    card.classList.add("hourly-card");

    card.style.background =
      "radial-gradient(circle, rgba(172,172,172,1) 0%, rgba(172,172,172,1) 46%, rgba(121,121,121,1) 100%)";
    card.style.fontFamily = "Timeburner";
    card.style.color = "#ffffff";
    card.style.boxShadow = "0 7px 10px black";
    card.style.borderRadius = "10px";
    card.style.height = "200px";

    const imgSize = "100px";

    card.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" style="width: ${imgSize}; height: ${imgSize};">
        <h4 style="padding-top: 20px; font-size: 40px;">${time}</h4>
    `;
    hourlyContainer.appendChild(card);
  });
}

// Scroll handler for forecast and hourly containers
function scrollContainer(container, direction) {
  const scrollAmount = 300; // Pixels to scroll per button click
  const maxScrollLeft = container.scrollWidth - container.clientWidth; // Maximum scrollable distance

  if (direction === -1) {
    container.scrollLeft = Math.max(0, container.scrollLeft - scrollAmount);
  } else if (direction === 1) {
    container.scrollLeft = Math.min(
      maxScrollLeft,
      container.scrollLeft + scrollAmount
    );
  }
}

// Add event listeners to arrow buttons
forecastLeft.addEventListener("click", () =>
  scrollContainer(forecastContainer, -1)
);
forecastRight.addEventListener("click", () =>
  scrollContainer(forecastContainer, 1)
);
hourlyLeft.addEventListener("click", () =>
  scrollContainer(hourlyContainer, -1)
);
hourlyRight.addEventListener("click", () =>
  scrollContainer(hourlyContainer, 1)
);

// Search button FOR TESTING.  Hopefully removal will not effect the modal. //
searchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city) {
    try {
      const data = await fetchDetailedWeather(city);
      const groupedDays = groupByDay(data.list);
      renderDailyForecast(groupedDays);
      renderHourlyForecast(groupedDays[Object.keys(groupedDays)[0]]);
    } catch (error) {
      alert("Error fetching weather data. Please try again.");
    }
  }
});

//*************************************************************//
// WE MAY BE ABLE TO USE THIS SECTION TO CONNECT TO THE MODAL? //

fetchDetailedWeather("Seattle").then((data) => {
  const groupedDays = groupByDay(data.list);
  renderDailyForecast(groupedDays);
  renderHourlyForecast(groupedDays[Object.keys(groupedDays)[0]]);
});
