const weatherInterpretation = document.getElementById('weather-interpretation'),
      temperature = document.getElementById('temperature'),
      weatherCodes = {
        0: 'Vonku je úplná topečka',
        1: 'Dnes je fajnovo, nemaj stres',
        2: 'Nepoteší, neurazí...',
        3: 'Zamračené ako tvoja nálada',
        45: 'Vonku je mléko',
        48: 'Pozor, šmýka sa!',
        51: 'Trošku ťa oprská',
        53: 'Trošku budeš mokrý',
        55: 'Trošku budeš mokrý',
        56: 'Brácho, bolo už aj lepšie...',
        57: 'Brácho, bolo už aj lepšie...',
        61: 'Zober si parazól',
        63: 'Určite si zober parazól!',
        65: 'Schovaj sa do kaviarne, brácho!',
        66: 'Ten dážď aj mrzne',
        67: 'Ten dážď aj mrzne',
        71: 'Trošku nám sneží',
        73: 'Daj si zimnú čapicu!',
        75: 'Daj si radšej baranicu brate',
        77: 'Ževraj snehové zrná',
        80: 'Šak trošku prehánky',
        81: 'Šak trošku prehánky',
        82: 'Schovaj sa pod most',
        85: 'Dojdi k nám na bežkách',
        86: 'Dojdi k nám na sánkach',
        95: 'Hrmí, ale neboj',
        96: 'Padajú krupy, brate...',
        99: 'Toto už neni sranda, pozor!'
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