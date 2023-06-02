// Импортируем библиотеку для работы с Telegram Bot API
const TelegramBot = require('node-telegram-bot-api');

// Создаем экземпляр бота
const bot = new TelegramBot('510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA', { polling: true });

// Объект для хранения интервалов для каждого пользователя
const intervals = {};

// Функция запуска интервала для пользователя
function startInterval(chatId, intervalTime) {
  // Проверяем, есть ли уже интервал для данного пользователя
  if (chatId in intervals) {
    bot.sendMessage(chatId, 'Интервал уже запущен');
  } else {
    // Определяем функцию, которая будет вызываться каждый раз при прохождении интервала
    function intervalFunction() {
      // Выполняем нужное действие
      bot.sendMessage(chatId, `Прошло ${intervalTime} секунд`);
    }

    // Создаем новый интервал и сохраняем его в объект intervals
    const interval = setInterval(intervalFunction, intervalTime * 1000);
    intervals[chatId] = interval;

    // Отправляем сообщение пользователю о запуске интервала
    bot.sendMessage(chatId, 'Интервал запущен');
  }
}

// Функция остановки интервала для пользователя
function stopInterval(chatId) {
  // Проверяем, есть ли интервал для данного пользователя
  if (chatId in intervals) {
    // Останавливаем интервал и удаляем его из объекта intervals
    clearInterval(intervals[chatId]);
    delete intervals[chatId];

    // Отправляем сообщение пользователю об остановке интервала
    bot.sendMessage(chatId, 'Интервал остановлен');
  } else {
    // Если интервала нет, отправляем сообщение пользователю
    bot.sendMessage(chatId, 'Нет запущенного интервала для этого пользователя');
  }
}

// Обработчик сообщений пользователя
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  // Проверяем текст сообщения и запускаем или останавливаем интервал
  if (messageText === '/start') {
    startInterval(chatId, 10);
  } else if (messageText === '/stop') {
    stopInterval(chatId);
  } else {
    bot.sendMessage(chatId, 'Неизвестная команда');
  }
});
