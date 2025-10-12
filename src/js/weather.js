const projectData = await fetch('/project-data.json', {cache: 'no-cache'}).then(res => res.json());
const {customWeather} = projectData;

const weatherInterpretation = document.getElementById('weather-interpretation'),
      temperature = document.getElementById('temperature'),
      weatherIcon = document.querySelector('.info-panel-icon');

const handleWeatherApi = (apiData) => {
  const date = new Date(),
        formattedDate = date.toLocaleString('sv-SE').slice(0, 13).replace(' ', 'T'),
        timeArray = apiData.hourly.time,
        temperatureArray = apiData.hourly.temperature_2m,
        weatherCodeArray = apiData.hourly.weather_code,
        index = timeArray.findIndex((t) => t.slice(0, 13) === formattedDate);

  if (index !== -1) {
    temperature.textContent = `${parseInt(temperatureArray[index], 10)}°C`;
    weatherInterpretation.textContent = customWeather[weatherCodeArray[index]].text;
    weatherIcon.src = customWeather[weatherCodeArray[index]].icon;
  } else {
    handleApiError();
  }
};

const handleApiError = () => {
  temperature.textContent = 'Niečo je zle';
  weatherInterpretation.textContent = 'Vôbec netuším aké \nje práve počasie';
  weatherIcon.src = '/img/ico-question.png';
};

const fetchMeteoApi = () => {
  fetch('https://api.open-meteo.com/v1/forecast?latitude=50.088&longitude=14.4208&hourly=temperature_2m,weather_code&timezone=Europe%2FBerlin&forecast_days=1')
  .then((res) => res.json())
  .then(handleWeatherApi)
  .catch(handleApiError)
  .finally(() => setTimeout(fetchMeteoApi, 15 * 60 * 1000));
};

fetchMeteoApi();