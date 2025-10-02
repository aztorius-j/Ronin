const weatherInterpretation = document.getElementById('weather-interpretation'),
      temperature = document.getElementById('temperature'),
      weatherCodes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Drizzle: Light intensity",
        53: "Drizzle: Moderate intensity",
        55: "Drizzle: Dense intensity",
        56: "Freezing Drizzle: Light intensity",
        57: "Freezing Drizzle: Dense intensity",
        61: "Rain: Slight intensity",
        63: "Rain: Moderate intensity",
        65: "Rain: Heavy intensity",
        66: "Freezing Rain: Light intensity",
        67: "Freezing Rain: Heavy intensity",
        71: "Snow fall: Slight intensity",
        73: "Snow fall: Moderate intensity",
        75: "Snow fall: Heavy intensity",
        77: "Snow grains",
        80: "Rain showers: Slight intensity",
        81: "Rain showers: Moderate intensity",
        82: "Rain showers: Violent intensity",
        85: "Snow showers: Slight intensity",
        86: "Snow showers: Heavy intensity",
        95: "Thunderstorm: Slight or moderate",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail"
      };

const handleWeatherApi = (data) => {
  const date = new Date(),
        formattedDate = date.toLocaleString('sv-SE').slice(0, 13).replace(' ', 'T'),
        timeArray = data.hourly.time,
        temperatureArray = data.hourly.temperature_2m,
        weatherCodeArray = data.hourly.weather_code,
        index = timeArray.findIndex((t) => t.slice(0, 13) === formattedDate);

  if (index !== -1) {
    temperature.textContent = `${parseInt(temperatureArray[index], 10)}°C`;
    weatherInterpretation.textContent = weatherCodes[weatherCodeArray[index]];
  } else {
    handleApiError();
  }
}

const handleApiError = () => {
  temperature.textContent = '?';
  weatherInterpretation.textContent = 'Vôbec netuším aké je práve počasie';
}

const fetchMeteoApi = () => {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=50.088&longitude=14.4208&hourly=temperature_2m,weather_code&timezone=Europe%2FBerlin&forecast_days=1')
  .then((res) => res.json())
  .then((data) => handleWeatherApi(data))
  .catch(handleApiError)
  .finally(() => setTimeout(fetchMeteoApi, 15 * 60 * 1000));
};

fetchMeteoApi();