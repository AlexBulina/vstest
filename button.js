const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { weather,randomize,isWorkingTime} = require('./HTML training/testexport');
const url =  'http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed';
const photo = 'https://milamed.com.ua/wp-content/uploads/2022/12/img_5791-scaled.jpg';
const token = '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA';
const bot = new TelegramBot(token, { polling: true });
let databurn;
let phone;
let list;
let ordertime,namer,homeadress,orderphone;
let today = new Date(); 
let curyear = today.getFullYear(); 
let outputdate ;
let actualid;
let getWorkperiodstatus;
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
async function getW (chatid){ weather('хмельницький')
.then(data => {
  const getweasher = {
    latitude: data[0].lat,
    longitude: data[0].lon,
    city: data[0].local_names.uk,
    appid : '29ebfe90e8a43cfb861bd842ed6ca6f8'
  };
 return getweasher; })
.catch(error => {
  console.error(error);
  
})
.then (  getweasher =>  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getweasher.latitude}&lon=${getweasher.longitude}&appid=${getweasher.appid}&units=metric&lang=ua`)
    .then(response => response.json())
    .then(data => {
         const now = new Date();
		 const starttime = new Date();
         const hours = now.getHours();
         const day = now.getDay();
		 const minute = now.getMinutes();
		 starttime.setHours(7);
		 starttime.setMinutes(30);
		
         switch (day) {

          case 0:
				
		   bot.sendMessage(chatid,'Сьогодні неділя. Медичний центр Міламед - зачинено.') ; 
          break;

          case 1:
          case 2:
          case 3:
          case 4:
          case 5:  
            if (hours < 19 && (now.getTime() > starttime.getTime()) ) {
			
              bot.sendMessage(chatid,('Ми, наразі відчинені.\nГрафік роботи сьогодні: 7:30 - 19:00\n                    \nПогода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
            
			
			
			} else {    bot.sendMessage(chatid,'Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.') ;         }
          break;
		  
		   case 6:  
            if (hours < 15 && hours >=8 ) {
              bot.sendMessage(chatid,('Погода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
            } else {    bot.sendMessage(chatid,'Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.') ;         }
          break;

          



         }












      
     // bot.sendMessage(chatid,('Погода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
    }
    
    
    ));      }



bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textid = msg.text;

  if (msg.text === '/start') {
 bot.sendSticker(chatId,'CAACAgIAAxkBAAEIsZpkRRZVQ_3EXJeaVOV972bQuqtZ5AACmyoAAm0oKEq0Oj1wJL46yC8E');
   
    getW(chatId);
    setTimeout(()=>{
      
 bot.sendMessage(chatId, 'Виберіть дію:', {
      reply_markup: {  
        inline_keyboard: [
          [{ text: '1. Отримати результати аналізів по коду', callback_data: 'button1' }],
          [{ text: '2. Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
          [{ text: '3. Як нас знайти', callback_data: 'button3' }],
          [{ text: '4. Наші філії', callback_data: 'button4' }],
          [{ text: '5. Актуальний прайс-лист лабораторії Міламед', callback_data: 'button5' }],
          [{ text: '6. Прайс-листи медичного центру Міламед', callback_data: 'button6' }],
          [{text: '7.Перейти на офіційний сайт',url: 'http://milamed.com.ua'}],
          [{text: '8.Виклик на дім (Забір крові)',callback_data: 'homeorder'}]
        ],
      
      }
    });

      },600);
   
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
       bot.sendMessage(chatId,'Адреса медичного центру Міламед. м.Хмельницький, вул.Проскурівська 13').then(()=>{
        bot.sendMessage(chatId,'Мобільний телефон:\n067 394 61 08\n067 555 80 77\nПослуги: забір аналізів, ЕКГ, добове моніторування ЕКГ (холтер),УЗД, консультації спеціалістів: гінеколог, мамолог, терапевт, сімейний лікар, кардіолог, уролог, ендокринолог, невропатолог, гастроентеролог, дерматовенеролог, проктолог, педіатр, пульмонолог, ревматолог, хірург, ортопед-травматолог, нефролог, косметолог, масажист, денний стаціонар,  ЕФГДС (ендоскопія), колоноскопія, дитячий інфекціоніст, дитячий дерматолог, дитячий кардіоревматолог.\nХірургічне відділення.\n');
        bot.sendLocation(chatId,49.42566, 26.98299,{reply_markup:{remove_keyboard:true}})
          .then(()=>{
 bot.sendMessage(chatId,'Адреса медичної лабораторії Міламед. м.Хмельницький, вул.Соборна 29')
            .then(()=>{

              bot.sendLocation(chatId,49.42481, 26.98165,{reply_markup:{remove_keyboard:true}});

            });
           });

           




          
        });
          
        

      break;
    case 'button4':

    bot.sendMessage(chatId, 'Виберіть потрібну філію:', {
      reply_markup: {  
        inline_keyboard: [
         [{ text: 'Поліклініка №2, каб.124 (4 пов.),', callback_data: 'PointFence1' }, { text: 'м. Полонне, вул. Л. Українки, 177', callback_data: 'PointFence7'}  ],
          [{ text: 'Поліклініка №2, каб. 130 (4пов.)', callback_data: 'PointFence2' },{ text: 'ПМСД каб.46', callback_data: 'PointFence8' }],
          [{ text: "смт. Білогір'я", callback_data: 'PointFence3' },{ text: "м. Славута, вул. Соборності, 32 ", callback_data: 'PointFence9' }],
          [{ text: "м. Кам'янець-Подільский", callback_data: 'PointFence4' },{ text: "м. Шепетівка, вул.Островського, 68В/1", callback_data: 'PointFence10' }],
          [{ text: "м. Кам'янець-Подільский, пр. Грушевского, 46", callback_data: 'PointFence5' },{ text: "м.Шепетівка, вул.Валі Котика,85", callback_data: 'PointFence11' }],
          [{ text: "м. Кам'янець-Подільский, вул. Князів Коріатовичів, 13.", callback_data: 'PointFence6' },{ text: "м. Із'яслав, вул. Б. Хмельницького, 47", callback_data: 'PointFence12' }],
          [{ text: "м. Нетішин, вул. Лісова, 1", callback_data: 'PointFence13' },{ text: "м. Гайсин, вул. 1 Травня, 77", callback_data: 'PointFence14' }],
          [{ text: "м. Старокостянтинів, вул.Пушкіна, 47", callback_data: 'PointFence15' },{ text: "м. Деражня, вул. Подільська, 1", callback_data: 'PointFence16' }],
          [{ text: "смт. Ярмолинці, вул. Шевченка, 41", callback_data: 'PointFence17' },{ text: "м. Ладижин, вул. Ентузіастів, 44/2", callback_data: 'PointFence18' }]
        ],
      
      }
    });







    //    bot.sendPhoto(chatId,photo,{reply_markup:{remove_keyboard:true}});
   
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
        bot.sendDocument(chatId,`C:\\Telegram\\actualclinicprice.pdf`,{caption: 'Актуальний прайс медичного центру Міламед'
           
      }).then (()=>{
        
        bot.sendDocument(chatId,`C:\\Telegram\\actualpriceUSDiagnos.pdf`,{caption: 'Прейскурант цін медичних послуг ультразвукової діагностики'
           
      });


      }).then (()=>{
        
        bot.sendDocument(chatId,`C:\\Telegram\\actualpriceendoscope.pdf`,{caption: 'Прейскурант цін медичних послуг ендоскопічних досліджень'
           
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

      case 'PointFence1':
        bot.sendMessage(chatId,'Хмельницький, пр. Миру, 61, \nПоліклініка №2, каб.124 (4пов.)\nМобільний телефон:\n 0382630615, 0670066554\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний',{parse_mode: 'HTML'});
      break;

      case 'PointFence2':

      bot.sendMessage(chatId,'Поліклініка №2, каб. 130 (4пов.)\nМобільний телефон: 0675550988\nПослуги: УЗД, ЕКГ.\nГрафік роботи: понеділок-п’ятниця 09:00-17:00\nсубота, неділя-вихідний.\n',{parse_mode: 'HTML'});
      break;
      case 'PointFence3':
        bot.sendMessage(chatId,"смт.Білогір'я, вул. Миру, 1\nМобільний телефон:\n0971439724\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 09:00-14:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
      
      
      break;

      case 'PointFence4':
        bot.sendMessage(chatId,"м.Кам'янець-Подільский, вул. Матросова, 30\nМобільний телефон:\n0677733682\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:00-12:00\nсубота,неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence5':
        bot.sendMessage(chatId,"м. Кам'янець-Подільский, пр. Грушевского, 46\nМобільний телефон:\n0965664455\nПослуги: забір аналізів, денний стаціонар, УЗД, консультації спеціалістів: терапевта, гінеколога, педіатра.\nГрафік роботи: понеділок-п’ятниця 08:30-15:00\nсубота,неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'PointFence6':
        bot.sendMessage(chatId,"м. Кам'янець-Подільский, вул. Князів Коріатовичів, 13.\nМобільний телефон:\n0989882541\n(03849) 3-79-59\ Послуги: забір аналізів, сімейний лікар, гінеколог, педіатр, уролог, дерматовенеролог, косметолог, мамолог, УЗД, денний стаціонар, масаж.\nГрафік роботи: понеділок-п’ятниця 09:00-15:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'PointFence13':
        bot.sendMessage(chatId,"м. Нетішин, вул. Лісова, 1\nМобільний телефон:\n0671258670\nПослуги: забір аналізів, УЗД, консультації спеціалістів: ендокринолог, терапевт, мамолог-онколог, уролог\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence15':
        bot.sendMessage(chatId,"м. Старокостянтинів, вул.Пушкіна, 47\nМобільний телефон:\n0963884176\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:30-16:00\nсубота,неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'PointFence17':
        bot.sendMessage(chatId,"смт. Ярмолинці, вул. Шевченка, 41\nМобільний телефон:\n0674605098\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence7':
        bot.sendMessage(chatId,"м. Полонне, вул. Л. Українки, 177\nМобільний телефон:\n0967566308\nПолуги: УЗД, ЕФГДС (ендоскопія).\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence8':
        bot.sendMessage(chatId,"ПМСД каб.46\nМобільний телефон:\n0962258946\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:00-10:30\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence9':
        bot.sendMessage(chatId,"м. Славута, вул. Соборності, 32\nМобільний телефон:\n0967313833, 0961433713.\nПослуги: забір аналізів, консультації спеціалістів: дерматовенеролога, гінеколога, уролога, кардіолога.\nГрафік роботи: понеділок-п’ятниця 08:00-16:30\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence10':
        bot.sendMessage(chatId,"м. Шепетівка, вул. Островського, 68 В / 1\nМобільний телефон:\n0960219313\nПослуги: забір аналізів, УЗД, ЕКГ, консультації спеціалістів: дерматовенеролог, гінеколог, ендокринолог, уролог, невропатолог,  кардіолог, терапевт, отоларинголог, ортопед-травматолог, педіатр, денний стаціонар, гастроентеролог.\nГрафік роботи: понеділок-п’ятниця 08:30-18:00\nсубота,неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence11':
        bot.sendMessage(chatId,"м. Шепетівка, вул. Валі Котика, 85\nМобільний телефон:\n0974085685\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:30-14:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence12':
        bot.sendMessage(chatId,"Мобільний телефон:\n0961912392\nПослуги: забір аналізів,\nГрафік роботи: понеділок-п’ятниця 08:30-15:00\nсубота, неділя-вихідний\n    \nПослуги :УЗД.\nМобільний телефон: 0964721455\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      case 'PointFence14':
        bot.sendMessage(chatId,"Вінницька обл., м. Гайсин, вул. 1 Травня, 77\nМобільний телефон:\n0673979817\nПослуги: забір аналізів, консультації спеціалістів: кардіолога, дерматовенеролога, гінеколога.\nГрафік роботи: понеділок-п’ятниця 08:30-17:30\nсубота,неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'PointFence16':
        bot.sendMessage(chatId,"м. Деражня, вул. Подільська, 1\nМобільний телефон:\n0688333702\nПослуги: забір аналізів.\nГрафік роботи: понеділок-п’ятниця 08:30-12:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'PointFence18':
        bot.sendMessage(chatId,"Вінницька обл., м. Ладижин, вул. Ентузіастів, 44/2\nМобільний телефон:\n0960949207\nПослуги: забір аналізів, консультації спеціалістів: гінеколога, уролога, УЗД.\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;

      case 'homeorder':
         const now = new Date();
        let day = now.getDay();
        if (day !=0 && day != 6) {
           getWorkperiodstatus = isWorkingTime('7:30','19:00');
        } else if (day == 6){  getWorkperiodstatus = isWorkingTime('8:00','15:00');}else { getWorkperiodstatus = false;}


        if(getWorkperiodstatus){                 
         
        bot.sendMessage(chatId, `Вартість послуги в межах м.Хмельницького 200 грн. За межі міста - ціна індивідульна в залежності від кілометражу.\nБудь-ласка, заповніть коротку анкету і наш оператор зателефонує Вам для уточнення інформації щодо місця й часу забору та кінцевої вартості даної послуги.`);

        setTimeout(()=>{
         
         
         bot.sendMessage(chatId, 'Ваше Ім\'я',{
        reply_markup:{
          force_reply:true
        }
      })
      .then((sent)=> {
         messageid = sent.message_id;
        bot.onReplyToMessage(chatId,messageid, (reply)=>{namer = reply.text;console.log(namer);
        
          bot.sendMessage(chatId, `Ваш телефон. Приклад: 0501234567`, {
            reply_markup: {
              force_reply: true // Запитуємо відповідь користувача
            }
          }).then((sent)=> {messageid = sent.message_id;
          bot.onReplyToMessage(chatId,messageid,(reply)=>{orderphone = reply.text;console.log(orderphone);
            bot.sendMessage(chatId, 'Де Вам зручно отримати послугу. Напишіть адресу в форматі (місто/вулиця/номер будинку/квартири)',{
              reply_markup:{
                force_reply:true
              }
            }).then((sent)=>{messageid = sent.message_id;
            
              bot.onReplyToMessage(chatId,messageid,(reply)=>{homeadress = reply.text;console.log(homeadress);
              
                bot.sendMessage(chatId, 'Коли Вам зручно отримати послугу. Напишіть бажану дату виклику і час в форматі (ДД.ММ.РРРР-ГГ.ХХ)',{
                  reply_markup:{
                    force_reply:true
                  }
                }).then ((sent)=>{               
                  messageid = sent.message_id;

                  bot.onReplyToMessage(chatId,messageid,(reply)=>{const ordertime = reply.text;console.log(ordertime);
                   let  todayfile = new Date();
                    const formattedDate = todayfile.toLocaleString('uk-UA', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    });
                     const ordernum = randomize();
                    fs.appendFile('./bot_log.txt', `[${todayfile}]\nНадійшло звернення від кліента на забір крові на дому\n${ordernum}\nІм\'я: ${namer}\nТелефон:  ${orderphone}\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\n    \n`, (err) => {
                      if (err) throw err;
                      console.log('Дані були успішно дописані в кінець файлу');
                    });
                    bot.sendMessage(chatId,`${ordernum}\nДякую. Ваше звернення збережено і передано відповідальному працівнику.\n Через деякий час з Вами звяжуться щодо уточнення деталей. `)
                    .then(

                      bot.sendMessage(-910827875,`Надійшло звернення від кліента на забір крові на дому\n<b>${ordernum}</b>\n     \nІм\'я: ${namer}\nТелефон: <b> ${orderphone}</b>\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\n        \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `,{parse_mode: 'HTML'})
    
                    );
                  
                  
                  
                  });

                    
                });
              
              
              });
            
            
            });
          
          
          });
          
          
          });
        
       
        });
        
      });
       
       


    },1000);


      //bot.sendMessage(chatId, 'Виклик для забору аналізів\nПослуга в межах м.Хмельницький надається безкоштовно.\nБудь ласка, заповніть коротку анкету і наш оператор зателефонує Вам для уточнення інформації щодо місця й часу забору.')
      //.then();


    } else {bot.sendMessage(chatId,'Наразі ми зачинені. Звернення обробляються лише в робочий час.');};

         
        break;

    default:
      break;
  }
});