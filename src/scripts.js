// Pull info on CLICK and return an error if the city entered is not a city //

//TODO Need to secure API key with dotenv
const API_KEY = "30388717e32fbe7e0eac8fa7a7bf7941";
const API_URL = `https://api.openweathermap.org/data/2.5/forecast`;

//Variables for Modal
const forecastContainer = document.getElementById("forecast-cards");
const hourlyContainer = document.getElementById("hourly-forecast");

// Modal Arrow buttons
const forecastLeft = document.getElementById("forecast-left");
const forecastRight = document.getElementById("forecast-right");
const hourlyLeft = document.getElementById("hourly-left");
const hourlyRight = document.getElementById("hourly-right");

//Variables for Imgs
const sunImage = "./img/sun2.jpeg";
const cloudsImage = "./img/clouds.jpeg";
const rainImage = "./img/rain.jpeg";
const fogImage = "./img/fog.jpg";
const snowImage = "./img/snow.jpeg";


// Fetch TODAYS weather data
async function fetchWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather data for city "${city}" could not be retrieved.`);
  }

  const data = await response.json();
  console.log(data);

  // Destructuring the object & array. I'm playing with a new technique to pull data from the API object. Everything should work the same as before. -DF
  const {
    main: {
      temp: temperature,
      humidity,
      temp_max: highTemp,
      temp_min: lowTemp,
    },
    weather: [{ description }],
  } = data;

  return {
    city: data.name,
    temperature,
    humidity,
    description,
    highTemp,
    lowTemp,
  };
}

// Fetch DETAILED weather data
async function fetchDetailedWeather(city) {
  const response = await fetch(
    `${API_URL}?q=${city}&units=imperial&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error("City not found");
  const detailedData = await response.json();
  console.log("Detailed Data" + detailedData);
  return detailedData;
}

// This loads the modal and keeps it up so we can design it. Delete after finished. -DF
// document.addEventListener('DOMContentLoaded', function () {
//     const modal = new bootstrap.Modal(document.getElementById('detailModal'));
//     modal.show();

// });


// Function to add a new weather card
function addCard(data) {
  const cardContainer = document.getElementById("cardContainer");

  if (cardContainer.children.length >= 9) {
    alert("Dashboard can only hold seven cards.");
    return;
  }

  const card = document.createElement("div");
  card.classList.add(
    "card",
    "rounded-4",
    "text-white",
    "bg-secondary",
    "border-end-0",
    "border-bottom-0",
    "custom-card"
  );

  // Store city name in the card's dataset
  card.dataset.city = data.city; // Store city in data-city attribute

  // Close button
  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent card click from firing
    event.preventDefault();
    card.remove();
  });

  card.appendChild(closeButton);

  // Creating elements in the card
  const title = document.createElement("h3");
  title.id = "city-name";
  title.innerText = data.city;
  card.appendChild(title);

  // used this to test the switch statment
  // const desc = document.createElement("p");
  // desc.id = "description";
  // desc.innerText = data.description;
  // card.appendChild(desc);

  const temp = document.createElement("p");
  temp.id = "main-temp";
  temp.innerText = `${Math.round(data.temperature)}`;
  card.appendChild(temp);

  const highLowTemp = document.createElement("span");
  highLowTemp.id = "high-low-temp";
  highLowTemp.innerText = `H ${Math.round(data.highTemp)} | L${Math.round(
    data.lowTemp
  )}`;
  card.appendChild(highLowTemp);

  // Set background image based on weather
  const weatherForImg = data.description;
  switch (weatherForImg) {
    case "clear":
    case "clear sky":
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${sunImage})`;
      break;
    case "clouds":
    case "overcast clouds":
    case "broken clouds":
    case 'few clouds':
    case 'scattered clouds':
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${cloudsImage})`;
      break;
    case 'mist':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'fog':
    case 'ash':
    case 'squall':
    case 'tornado': 
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${fogImage})`;
      break; 
    case 'rain':
    case 'light rain':
    case 'moderate rain':
    case 'thunderstorm':
    case 'drizzle': 
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${rainImage})`;
      break;
    case 'snow': 
        card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)),url(${snowImage})`;
        break;      
    default:
      card.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url("./img/default.jpg")`;
  }

  // Append card to container
  cardContainer.appendChild(card);

  // Add click event listener to the card to show the detailed weather
  card.addEventListener("click", () => {
    const city = card.dataset.city; // Retrieve the city from the card
    fetchDetailedWeather(city).then((data) => {
      const groupedDays = groupByDay(data.list);
      renderDailyForecast(groupedDays);
      renderHourlyForecast(groupedDays[Object.keys(groupedDays)[0]]);
    }).catch((error) => {
      alert("Error fetching detailed weather: " + error.message);
    });
    const modal = new bootstrap.Modal(document.getElementById("detailModal"));
    modal.show(); // Manually show the modal
  });
}


//This launches the prompt to get the city name
document.getElementById("addButton").addEventListener("click", () => {
  const city = prompt("Enter the city you'd like the weather for:");
  if (city) {
    fetchWeatherData(city)
      .then(addCard)
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("Could not retrieve weather data. Please try a different city.");
      });
  }
  return city;
});

// Time and date javascript for navbar
function updateDateTime() {
  const dateElement = document.getElementById("currentDate");
  const timeElement = document.getElementById("currentTime");
  const now = new Date();

  // Format the date
  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  const formattedDate = now.toLocaleDateString("en-US", dateOptions);

  // Format the time
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // For AM/PM format
  };
  const formattedTime = now.toLocaleTimeString("en-US", timeOptions);

  // Update the elements
  dateElement.textContent = formattedDate;
  timeElement.textContent = formattedTime;
}

// MODAL DETAILS //

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

    card.style.backgroundColor = "rgb(122 157 190)";
    card.style.fontFamily = "Timeburner";
    card.style.color = "#ffffff";
    card.style.boxShadow = "0 7px 10px black";
    card.style.borderRadius = "10px";
    card.style.height = "200px";

    card.innerHTML = `
        <h3 style="font-size: 40px">${new Date(date).toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        )}</h3>
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

// Update the date and time every second
setInterval(updateDateTime, 1000);

// Initialize on page load
updateDateTime();
