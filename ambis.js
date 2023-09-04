const now = new Date();
const starttime = new Date();
const hours = now.getHours();
const day = now.getDay();
const minute = now.getMinutes();
starttime.setHours(8);
starttime.setMinutes(0);

switch (day) {

  case 0:

    bot.sendMessage(chatid, '😴 Сьогодні неділя. Медичний центр MTS Clinic - зачинено.');
    break;
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    if (hours < 17 && (now.getTime() >= starttime.getTime())) {

      bot.sendMessage(chatid, ('👉 Ми, наразі відчинені.\nГрафік роботи сьогодні: 08:00 - 17:00\n                    \nПогода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp) + ' °С в місті ' + getweasher.city + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С' + '\n' + ((data.weather[0].description).charAt(0).toUpperCase() + (data.weather[0].description).slice(1))));



    } else {
      bot.sendMessage(chatid, '😭Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.☝');
    }
    break;

  case 6:
    if (hours < 15 && hours >= 8) {
      bot.sendMessage(chatid, ('💉🔬🩺🧑‍⚕️\nГрафік роботи сьогодні: 08:00 - 15:00\nСплануйте дорогу комфортно до нас.\n                 \nПогода на сьогодні.\nЗараз ' + Math.ceil(data.main.temp) + ' °С в місті ' + getweasher.city + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С' + '\n' + ((data.weather[0].description).charAt(0).toUpperCase() + (data.weather[0].description).slice(1))));
    } else {
      bot.sendMessage(chatid, '😭 Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.☝');
    }
    break;





}





async function weather(cityname) {
  try {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=29ebfe90e8a43cfb861bd842ed6ca6f8`);
    if (!response.ok) {
      throw new Error(`Помилка запиту до сервісу OpenWeatherMap. Статус: ${response.status}`);
    }
    const data = await response.json();
    
    // Перевірка на коректність даних (наприклад, чи отримано місто)
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`Місто "${cityname}" не знайдено`);
    }

    return Promise.resolve(data); // Повертати дані для обробки у .then()
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

async function getWeather(city) {
  try {
    const weatherData = await weather(city);
    const getWeather = {
      latitude: weatherData[0].lat,
      longitude: weatherData[0].lon,
      city: weatherData[0].local_names.uk,
      appid: '29ebfe90e8a43cfb861bd842ed6ca6f8'
    };

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getWeather.latitude}&lon=${getWeather.longitude}&appid=${getWeather.appid}&units=metric&lang=ua`);
    
    if (!response.ok) {
      throw new Error(`Помилка запиту до сервісу OpenWeatherMap. Статус: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.ceil(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: (data.weather[0].description).charAt(0).toUpperCase() + (data.weather[0].description).slice(1)
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

// Приклад використання:
const cityname = 'Пісочин';
getWeather(cityname)
  .then(weatherInfo => {
    console.log(`Погода в місті ${cityname}:`);
    console.log(`Температура: ${weatherInfo.temperature} °C`);
    console.log(`Відчувається як: ${weatherInfo.feelsLike} °C`);
    console.log(`Опис: ${weatherInfo.description}`);
  })
  .catch(error => {
    if (error.message.includes(`не знайдено`)) {
      console.error(`Місто "${cityname}" не знайдено.`);
  
    } else {
      console.error(`Помилка отримання погоди для міста ${cityname}: ${error}`);
    
    }
  });


  
