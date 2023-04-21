const TelegramBot = require('node-telegram-bot-api');

const url =  'http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed';
const photo = 'https://milamed.com.ua/wp-content/uploads/2022/12/img_5791-scaled.jpg';
const token = '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA';
const bot = new TelegramBot(token, { polling: true });
let databurn;
let phone;
let list;
let today = new Date(); 
let curyear = today.getFullYear(); 
let outputdate ;
let actualid;
console.log('Телеграм бот Міламед - запущено');
bot.onText(/(\d{2})\/(\d{2})\/(\d{4})/, (msg) => {
  databurn = msg.text;
  actualid = msg.chat.id;
  bot.sendMessage(msg.chat.id, `Дякуємо! Ваша дата народження: ${databurn}`)
  bot.sendMessage(msg.chat.id, `Тепер попрошу Вас надати дозвіл на отримання Вашого мобільного номера. Натисніть кнопку , що з'явилася під полем вводу.`,{
    reply_markup: {
        keyboard: [
            [
                {
                    text: 'Надіслати номер телефону',
                    request_contact: true,
                    
                    
                    
                    
                     // Вмикаємо запит на надсилання контакту
                }
            ]


        ],
       
       resize_keyboard: false
       
        // Вмикаємо автоматичне зменшення клавіатури
    }
}); 


//  const currentYear = new Date().getFullYear().toString(); 127.0.0.1:9998
 







});
async function requestdata (msg,newac,newaca=newac){
  
  
  
  bot.sendMessage(msg, `Починаю пошук інформації. Результат виконання запиту - це окремі файли pdf формату. Час виконання може бути значним. Зачекайте повного виконання запиту.`)

await fetch(`${url}/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`,{
  headers: {
   // 'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
  'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
  }
  })
    //.catch(error => {bot.sendMessage(msg,'Виникла помилка завантаження даних. Спробуйте пізніше.');})
  .then(response => { 
    if (response.ok){response.json()
  .then(data => {
   
    const nameArray = data.length;
    if (nameArray == 0){ bot.sendMessage(msg, `Результат виконання запиту - не знайдено замовлень по Вашим даним. Можливі причини цього читайте в головному розділі в пункті Допомога.`);}
    else {bot.sendMessage(msg, `Результат виконання запиту - знайдено ${nameArray} замовлень за ${newac} рік по Вашим даним`,{reply_markup:{remove_keyboard:true}});
   
    list = gruopresults(msg,nameArray,data);
    
    

                  
  
}});}else {bot.sendMessage(msg,'Виникла помилка завантаження даних. Спробуйте пізніше.');}



});}
async function gruopresults(msg,nameArray,data){

  for (let i = 0; i <= nameArray-1; i++){

    console.log(data[i].WebCode);
    

   await  fetch(`http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed/examination/getResultsPDF?ExaminationResultsPDFCode=${data[i].WebCode}&ShowOnlyReady=false`,{
headers: {
'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
}
})
.then(res => res.arrayBuffer())
.then(buffer => {
const fileBufferpdf = Buffer.from(buffer);
//  console.log(fileBufferpdf);

bot.sendDocument(msg,fileBufferpdf,{},{filename: `${data[i].WebCode}.pdf`,contentType: 'application/pdf'})
bot.sendMessage(msg,'Запис  ' + `${(i+1)}` + '       Дата звернення: ' + `${data[i].Date}`)
.catch({i});

});}
setTimeout(()=>{
bot.sendMessage(msg, `Вивантаження данних завершено успішно. Дякуємо за терпіння.`);
},4000);

return true; 
}


bot.on('contact', (msg) => {
  phone = (msg.contact.phone_number).slice(2); // Отримуємо номер телефону з об'єкту contact
  const parts = databurn.split('/');
  var year = parts[2];
  var month = parts[1];
  var day = parts[0];
  
  
  outputdate = year + '-' + month + '-' + day;
 bot.sendMessage(msg.chat.id, `Дякуємо! Ваш номер телефону: ${phone}`,{reply_markup:{remove_keyboard:true}}); // Відправляємо повідомлення з підтвердженням
 


 bot.sendMessage(msg.chat.id, 'Виберіть період,який Вас цікавить:', {
  
  reply_markup: {  
    inline_keyboard: [
      [{ text: `1. ${curyear-3}`, callback_data: 'button12' }],
      [{ text: `2. ${curyear-2}`, callback_data: 'button11' }],
      [{ text: `3. ${curyear-1}`, callback_data: 'button9' }],
      [{ text: `4. ${curyear}`, callback_data: 'button10' }],
      [{ text: '5. Усі роки', callback_data: 'button13' }]
     
    ],
    
  }


});





console.log(outputdate);
 console.log(phone);











});  
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textid = msg.text;

  if (msg.text === '/start') {
   
    bot.sendMessage(chatId, 'Виберіть дію:', {
      reply_markup: {  
        inline_keyboard: [
          [{ text: '1. Отримати результати аналізів по коду', callback_data: 'button1' }],
          [{ text: '2. Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
          [{ text: '3. Як нас знайти', callback_data: 'button3' }],
          [{ text: '4. Графік роботи лабораторії', callback_data: 'button4' }],
          [{ text: '5. Актуальний прайс-лист лабораторії Міламед', callback_data: 'button5' }],
          [{ text: '6. Прайс-листи медичного центру Міламед', callback_data: 'button6' }],
          [{text: 'Перейти на офіційний сайт',url: 'http://milamed.com.ua'}]
        ],
      
      }
    });
  }

   if (msg.text === undefined){}
   else if (msg.text.length == 15  ) {
        const number1 = Number(msg.text);
         if (isNaN(number1) == false){
       
        bot.sendMessage(msg.from.id,'Унікальний код введено вірно - починаю пошук Вашого замовлення');
  
    fetch(`http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed/examination/getResultsPDF?ExaminationResultsPDFCode=${msg.text}&ShowOnlyReady=false`,{
      headers: {
      'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ== '
      }
      })
    .then(res => res.arrayBuffer())
    .then(buffer => {
       const fileBufferpdf = Buffer.from(buffer);
 
      bot.sendDocument(msg.from.id,fileBufferpdf,{},{filename: `${msg.text}.pdf`,contentType: 'application/pdf'});
      
      
    })
    .catch(error => console.error(error));
  
      }} 




});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'button1':
      
    bot.sendMessage(chatId, 'Введіть 15 значний унікальний код замовлення. код можна знайти на бланку замовлення або в смс від лабораторії про готовність результатів.',{reply_markup:{remove_keyboard:true}});

   
      break;
    case 'button2':
     
      bot.sendMessage(chatId, 'Введіть свою дату народження в форматі ДД/ММ/РРРР - для унікальної ідентифікації вас в базі данних лабораторії Міламед', {reply_markup:{remove_keyboard:true}});
     
        

      break;
    case 'button3':
        bot.sendLocation(chatId,49.42566, 26.98299,{reply_markup:{remove_keyboard:true}});

      break;
    case 'button4':
        bot.sendPhoto(chatId,photo,{reply_markup:{remove_keyboard:true}});
   
      break;
      case 'button5':

      bot.sendMessage(chatId,'Завантажую актуальний прайс',{reply_markup:{remove_keyboard:true}});   
     
          
        fetch('https://milamed.com.ua/actualpricemilamed.xlsx')
      .then(res => res.arrayBuffer())
      .then(buffer => {
         const fileBuffer = Buffer.from(buffer);
        console.log(fileBuffer);
       
        bot.sendDocument(chatId,fileBuffer,{caption: 'Актуальний прайс лабораторії Міламед'

          },{filename: 'Price.xlsx',contentType: 'application/vnd.ms-excel'});});

            
      break;
      case 'button6':
        bot.sendDocument(chatId,`C:\\JAVA\\Telegram\\actualclinicprice.pdf`,{caption: 'Актуальний прайс медичного центру Міламед'
           
      }).then (()=>{
        
        bot.sendDocument(chatId,`C:\\JAVA\\Telegram\\actualpriceUSDiagnos.pdf`,{caption: 'Прейскурант цін медичних послуг ультразвукової діагностики'
           
      });


      }).then (()=>{
        
        bot.sendDocument(chatId,`C:\\JAVA\\Telegram\\actualpriceendoscope.pdf`,{caption: 'Прейскурант цін медичних послуг ендоскопічних досліджень'
           
      });


      });

      break;
      case 'button8':
        bot.sendDocument(chatId,`C:\\Telegram\\Priceclinicmilamed.xlsx`,{caption: 'Актуальний прайс медичного центру Міламед'
  
      });

      break;
      case 'button9':
      if (actualid == undefined){}else{
      requestdata(actualid,curyear-1);}

      break;
      case 'button10':
         if (actualid == undefined){}else{
		 requestdata(actualid,curyear);}
      

      break;
      case 'button11':
	  if (actualid == undefined){}else{
	  requestdata(actualid,curyear-2);}
  

      break;
      case 'button12':
	  if (actualid == undefined){}else{
	  requestdata(actualid,curyear-3);}
  

      break;
      case 'button13':
	  if (actualid == undefined){}else{
	  requestdata(actualid,curyear,2010);}
  

      break;
    default:
      break;
  }
});