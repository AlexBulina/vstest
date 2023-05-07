const TelegramBot = require('node-telegram-bot-api');

const token = '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Створення кнопки WebApp
  const webAppTest = {
    url: 'https://telegram.mihailgok.ru',
    display_name: 'Тестова сторінка',
    telegram_webpage_options: {
      // Додаткові параметри, які забезпечують відкриття WebApp в мобільному додатку Telegram
      disable_notification: true,
      supports_inline_queries: false
    }
  };

  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: webAppTest.display_name,
            url: `https://t.me/iv?url=${encodeURIComponent(webAppTest.url)}&${encodeURIComponent(JSON.stringify(webAppTest.telegram_webpage_options))}`
          }
        ]
      ]
    }
  };

  // Відправка повідомлення з клавіатурою
  bot.sendMessage(chatId, 'Натисніть на кнопку, щоб відкрити WebApp', keyboard);
});