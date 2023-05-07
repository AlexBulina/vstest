const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const { weather,randomize,isWorkingTime,isdbName,url,token,basicauth,GetNameDB,DateMod,GetPackResults} = require('./HTML training/testexport');
const bot = new TelegramBot(token, { polling: true });
let databurn,phone,list,ordertime,namer,homeadress,orderphone,ordernumclient,trimmedStr;
let today = new Date(); 
let curyear = today.getFullYear(); 
let outputdate ;
let actualid;
const webappurl = 'https://www.mtsclinic.com/'
let getWorkperiodstatus;
console.log('Телеграм бот MTS Clinic - запущено');
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







});
async function requestdata (msg,newac,newaca=newac){
  
  
  bot.sendMessage(msg, `Починаю пошук інформації. Результат виконання запиту - це окремі файли pdf формату. Час виконання може бути значним. Зачекайте повного виконання запиту.`)

  //GetPackResults(outputdate,phone,newaca,newac)

await fetch(`${url}/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`,{
  headers: {
   // 'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
  'Authorization': basicauth
  }
  })
    .catch(error => {bot.sendMessage(msg,`Виникла помилка завантаження даних. Спробуйте пізніше.`);})
    .then(response => { 
      //response.ok
    if (response){response.json()
    .then(data => {
   
    const nameArray = data.length;
    const status = data[0].Docstatus;
    if (nameArray == 0 || status !== 'перевірено'){ bot.sendMessage(msg, `Результат виконання запиту - не знайдено замовлень по Вашим даним.+`);}
    else {bot.sendMessage(msg, `Результат виконання запиту - знайдено ${nameArray} замовлень за ${newac} рік по Вашим даним`,{reply_markup:{remove_keyboard:true}});
   
    list = gruopresults(msg,nameArray,data);
    
    

                  
  
}});}else {bot.sendMessage(msg,'Виникла помилка завантаження даних. Спробуйте пізніше.');}



});}
async function gruopresults(msg,nameArray,data){

  for (let i = 0; i <= nameArray-1; i++){

    console.log(data[i].WebCode);
    if (data[i].Docstatus == 'перевірено'){

   await  fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${data[i].WebCode}&ShowOnlyReady=false`,{
headers: {
'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
}
})
.then(res => res.arrayBuffer())
.then(buffer => {
const fileBufferpdf = Buffer.from(buffer);

bot.sendDocument(msg,fileBufferpdf,{},{filename: `${data[i].WebCode}.pdf`,contentType: 'application/pdf'})
bot.sendMessage(msg,'Запис  ' + `${(i+1)}` + '      \nДата звернення: ' + `${data[i].Date} \nСтатус виконання:  ${data[i].Docstatus}`)
.catch({i});

});
setTimeout(()=>{
bot.sendMessage(msg, `👩‍💻 Вивантаження данних завершено успішно. Дякуємо за терпіння.`);
},4000);

return true; 
}else {return false;}}}


bot.on('contact', (msg) => {
  phone = (msg.contact.phone_number).slice(2); // Отримуємо номер телефону з об'єкту contact


 outputdate = DateMod(databurn);
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
async function getW (chatid){ weather('Пісочин')
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
		 starttime.setHours(8);
		 starttime.setMinutes(0);
		
         switch (day) {

          case 0:
				
		   bot.sendMessage(chatid,'😴 Сьогодні неділя. Медичний центр MTS Clinic - зачинено.') ; 
          break;
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:  
            if (hours < 18 && (now.getTime() >= starttime.getTime()) ) {
			
              bot.sendMessage(chatid,('👉 Ми, наразі відчинені.\nГрафік роботи сьогодні: 08:00 - 18:00\n                    \nПогода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
            
			
			
			} else {    bot.sendMessage(chatid,'😭Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.☝') ;         }
          break;
		  
		   case 6:  
            if (hours < 15 && hours >=8 ) {
              bot.sendMessage(chatid,('💉🔬🩺🧑‍⚕️\nГрафік роботи сьогодні: 08:00 - 15:00\nСплануйте дорогу комфортно до нас.\n                 \nПогода на сьогодні.\nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
            } else {    bot.sendMessage(chatid,'😭 Ми, наразі зачинені. Але, Ви можете скористатись нашими онлайн-послугами.☝') ;         }
          break;

          



         }












      
     // bot.sendMessage(chatid,('Погода на сьогодні. \nСплануйте дорогу комфортно до нас. \n                 \nЗараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + getweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + ' °С'+ '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) )))
    }
    
    
    ));      }



bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textid = msg.text;

  if (msg.text === '/start') {
    
 bot.sendSticker(chatId,'CAACAgIAAxkBAAEIyH5kTfKJfjKEmYHi8CKOq2f7YZupTwACGCUAAn2PcUrNxIKmFCxpby8E')
 .then(

GetNameDB(chatId).then(telegram => {
  outputdate = DateMod(telegram._doc.BirthDay);
    bot.sendMessage(chatId, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: ${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay} `).then(getW(chatId),
    
    setTimeout(()=>{
      
      bot.sendMessage(chatId, 'Виберіть дію: 👇', {
           reply_markup: {  
             inline_keyboard: [
               [{ text: '1.⏳ Отримати результати аналізів по коду', callback_data: 'button1' }],
               [{ text: '2. 🔍 Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
               [{ text: '3. 🕵️‍♂️ Як нас знайти', callback_data: 'button3' }],
               [{ text: '4. 🏨 Наші філії', callback_data: 'button4' }],
               [{ text: '5. 📋 Актуальний прайс-лист лабораторії MTS Clinic', callback_data: 'button5' }],
               [{ text: '6. 📋 Прайс-листи медичного центру MTS Clinic', callback_data: 'button6' }],
               [{text: '7.💻 Перейти на офіційний сайт', web_app:{url: webappurl,} }],
               [{text: '8.🚨 Виклик на дім (Забір крові)',callback_data: 'homeorder'}],
               [{text: '8.📡 Монітор виконання аналізу',callback_data: 'monitor'}]
             ],
             
           
           }
         });







     
           },500) 
    
    
    
    
    
    
    
    );
   
    
  })
  .catch(error => {
    console.log('Помилка:', error);
    bot.sendMessage(chatId, `Вітаю Вас, Шановний відвідувач ${msg.from.first_name}`).then(getW(chatId),
    setTimeout(()=>{
      
      bot.sendMessage(chatId, 'Виберіть дію: 👇', {
           reply_markup: {  
             inline_keyboard: [
               [{ text: '1.⏳ Отримати результати аналізів по коду', callback_data: 'button1' }],
               [{ text: '2. 🔍 Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
               [{ text: '3. 🕵️‍♂️ Як нас знайти', callback_data: 'button3' }],
               [{ text: '4. 🏨 Наші філії', callback_data: 'button4' }],
               [{ text: '5. 📋 Актуальний прайс-лист лабораторії MTS Clinic', callback_data: 'button5' }],
               [{ text: '6. 📋 Прайс-листи медичного центру MTS Clinic', callback_data: 'button6' }],
               [{text: '7.💻 Перейти на офіційний сайт', web_app:{url: webappurl,} }],
               [{text: '8.🚨 Виклик на дім (Забір крові)',callback_data: 'homeorder'}],
               [{text: '8.📡 Монітор виконання аналізу',callback_data: 'monitor'}]
             ],
           
           }
         });
     
           },200)
    
    
    );
    
    
  })

 );
   
  

   
  
  






    
   
  }
   if (msg.text === undefined){}
   else if (msg.text.length == 15  ) {
        const number1 = Number(msg.text);
         if (isNaN(number1) == false){
       
        bot.sendMessage(msg.from.id,'😸 Унікальний код введено вірно - починаю пошук Вашого замовлення 🔍');
  
    fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${msg.text}&ShowOnlyReady=false`,{
      headers: {
      'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
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
     
      bot.sendMessage(chatId, 'Введіть свою дату народження в форматі ДД/ММ/РРРР - для унікальної ідентифікації вас в базі данних лабораторії MTS Clinic', {reply_markup:{remove_keyboard:true}});
     
        

      break;
    case 'button3':
       bot.sendMessage(chatId,'Адреса медичного центру MTS Clinic. м.Пісочин, Набережна 11/1').then(()=>{
        bot.sendMessage(chatId,`Мобільний телефон: \n 093 296 25 01\n096 041 40 04\nПослуги: забір аналізів, \nПункт вакцинації від COVID-19.\n`,{parse_mode:'Markdown'});
        bot.sendLocation(chatId,49.962673, 36.09681,{reply_markup:{remove_keyboard:true}})
        

      

          
        });
          
        

      break;
    case 'button4':

    bot.sendMessage(chatId, '➡ Виберіть потрібну філію:', {
      reply_markup: {  
        inline_keyboard: [
         [{ text: '🔹Пісочин', callback_data: 'PointFence1' }, { text: '🔹Холодна Гора', callback_data: 'PointFence7'}  ],
          [{ text: '🔹Баварія', callback_data: 'PointFence2' },{ text: '🔹Люботин', callback_data: 'PointFence8' }],
          [{ text: "❗Аеропорт (працює)", callback_data: 'PointFence3' },{ text: "🔹Холодна Гора, пункт №2 ", callback_data: 'PointFence9' }],
          [{ text: "🔹Південний вокзал", callback_data: 'PointFence4' },{ text: "🔹Комунальний ринок", callback_data: 'PointFence10' }],
          [{ text: "🔹Рогань", callback_data: 'PointFence5' },{ text: "🔹ХТЗ", callback_data: 'PointFence11' }],
          [{ text: "❗Салтівка (працює)", callback_data: 'PointFence6' }],
          
        ],
      
      }
    });

  
      break;
      case 'button5':

      bot.sendMessage(chatId,'💻 Завантажую актуальний прайс',{reply_markup:{remove_keyboard:true}});
     
      bot.sendDocument(chatId,`C:\\Milamed request analyze\\actualpricemts.xlsx`,{caption: 'Актуальний прайс лабораторії Mtsclinic'
     
         });
      break;
      case 'button6':
        fetch('https://www.mtsclinic.com/_files/ugd/fd4680_7ac7380d6eac480e806fc558e5d80fb9.pdf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
         const fileBuffer = Buffer.from(buffer);
        console.log(fileBuffer);
       
        bot.sendDocument(chatId,fileBuffer,{caption: '📋Актуальний прайс медичного центру Mtsclinic'

          },{filename: 'Price.pdf',contentType: 'application/pdf'});});

      break;
      case 'button8':
        bot.sendDocument(chatId,`C:\\Telegram\\Priceclinicmilamed.xlsx`,{caption: '📋Актуальний прайс медичного центру Mtsclinic'
  
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
        bot.sendMessage(chatId, `🕐<b><u>Пісочин.</u></b>` + 'тел.:(0932962501,0960414004)(Viber,Telegram)\nПункт вакцинації від COVID-19\nАдреса: Набережна, 11/1\nПн-Пт с 08:00-18:00,\n Сб с 08:00-16:00, \nНд с 08:00-14:00',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
      break;

      case 'PointFence2':

      bot.sendMessage(chatId,`🕐<b><u>Баварія.</u></b>` + 'тел.: (0932962507)(Viber)\nАдреса: проспект Ново-Баварський, 70\nПн-Сб с 08:00-12:00, Нд (вихідний)',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
      break;
      case 'PointFence3':
        bot.sendMessage(chatId,`🕐<b><u>Аеропорт.</u></b>` +' тел.:(0932962509)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Проспект Гагарина, 316Б\nПн-Пт с 07:30-12:00, Нд (вихідний)',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
      
      
      break;

      case 'PointFence4':
        bot.sendMessage(chatId,`🕐<b><u>Південний вокзал.</u></b>` +' тел.:(0932962504)(Viber,Telegram)\nАдреса: Котляра, 12\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
            
      break;
      case 'PointFence5':
        bot.sendMessage(chatId,`🕐<b><u>Рогань. </u></b>` +'тел.:(0932962505)(Viber)\nАдреса: Сергія Грицевця, 9\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
            
      break;

      case 'PointFence6':
        bot.sendMessage(chatId,`🕐<b><u>Салтівка. </u></b>` +'тел.:(0932962506)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Тракторобудівників, 160В\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
            
      break;
      
      case 'PointFence7':
        bot.sendMessage(chatId,`🕐<b><u>Холодна Гора. </u></b>` +'тел.:(0932962502)(Viber)\nАдреса: Полтавський шлях, 152 (Дитяча поліклініка №19 кабінет №8)\nПн-Сб с 08:00-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
            
      break;
      case 'PointFence8':
        bot.sendMessage(chatId,`🕐<b><u>Люботин. </u></b>` +'тел.:(0932962508)(Viber)\nАдреса: Шевченка, 15 (каб. 2) (Міська поліклініка)\nПн-Сб с 08:00-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
            
      break;
      case 'PointFence9':
        bot.sendMessage(chatId,`🕐<b><u>Холодна Гора. </u></b>` +' тел.:(0637078733)(Viber)\nАдреса: Дудинської, 1а\nПн-Сб с 07:30-12:00, Нд (вихідний)​​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
            
      break;
      case 'PointFence10':
        bot.sendMessage(chatId,`🕐<b><u>Комунальний ринок. </u></b>` +'тел.:(0932962513)(Viber)\nАдреса: Льва Ландау, 8\n(працює за індивідуальним графіком)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
            
      break;
      case 'PointFence11':
        bot.sendMessage(chatId,`🕐<b><u>ХТЗ. </u></b>` +' тел.:(932962510)(Viber)\nАдреса: пр-т. Олександрівський, 124\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"})
            
      break;
      case 'PointFence12':
        bot.sendMessage(chatId,"Мобільний телефон:\n0961912392\nПослуги: забір аналізів,\nГрафік роботи: понеділок-п’ятниця 08:30-15:00\nсубота, неділя-вихідний\n    \nПослуги :УЗД.\nМобільний телефон: 0964721455\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n",{parse_mode: 'HTML'});
            
      break;
      
      case 'homeorder':
         const now = new Date();
        let day = now.getDay();
        if (day !=0 && day != 6) {
           getWorkperiodstatus = isWorkingTime('8:00','18:00'); //18:00
        } else if (day == 6){  getWorkperiodstatus = isWorkingTime('8:00','16:00');}else { getWorkperiodstatus = false;}


        if(getWorkperiodstatus){                 
         
        bot.sendMessage(chatId, `💳 Вартість послуги в межах м.Пісочин 150 грн.\n За межі міста - ціна індивідульна в залежності від кінцевої вартості послуг таксі.\n      \n 📝 Будь-ласка, заповніть коротку анкету і наш оператор зателефонує Вам для уточнення інформації щодо місця й часу забору та кінцевої вартості даної послуги.`);

        setTimeout(()=>{
         
         
         bot.sendMessage(chatId, '❓ Ваше Ім\'я',{
        reply_markup:{
          force_reply:true
        }
      })
      .then((sent)=> {
         messageid = sent.message_id;
        bot.onReplyToMessage(chatId,messageid, (reply)=>{namer = reply.text;console.log(namer);
        
          bot.sendMessage(chatId, `📱Ваш телефон. Приклад: 0501234567`, {
            reply_markup: {
              force_reply: true // Запитуємо відповідь користувача
            }
          }).then((sent)=> {messageid = sent.message_id;
          bot.onReplyToMessage(chatId,messageid,(reply)=>{orderphone = reply.text;console.log(orderphone);
            bot.sendMessage(chatId, '💁‍♀️Де Вам зручно отримати послугу. Напишіть адресу в форматі (місто/вулиця/номер будинку/квартири)',{
              reply_markup:{
                force_reply:true
              }
            }).then((sent)=>{messageid = sent.message_id;
            
              bot.onReplyToMessage(chatId,messageid,(reply)=>{homeadress = reply.text;console.log(homeadress);
              
                bot.sendMessage(chatId, '🙏Коли Вам зручно отримати послугу. Напишіть бажану дату виклику і час в форматі (ДД.ММ.РРРР-ГГ.ХХ)',{
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

                  
                      console.log(orderphone.length);
                      if (orderphone.length == 10){
                    isdbName( chatId,Number(orderphone.slice(1)),databurn).then( data => {console.log(data);
                      if (data == false){trimmedStr = 'Шановний кліент, що обираєте нас.';
                    
                      bot.sendMessage(chatId,`${ordernum}\nДякую, ${trimmedStr}. Ваше звернення збережено і передано відповідальному працівнику.\n Через деякий час з Вами звяжуться щодо уточнення деталей. `)
                      .then(
  
                      //bot.sendMessage(-813260675,`Надійшло звернення від кліента на забір крові на дому\n<b>${ordernum}</b>\n     \nІм\'я: ${namer}\nТелефон: <b> ${orderphone}</b>\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\n        \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `,{parse_mode: 'HTML'})
      
                      );
                    
                    
                    
                    }else{
                      
                      let arr = data.split(" ");
                      console.log(arr.length);
                      if (arr.length <= 3 ){trimmedStr = data; }else{trimmedStr = arr.slice(1).join(" ");}
                      
                    bot.sendMessage(chatId,`${ordernum}\nДякую, ${trimmedStr}. Ваше звернення збережено і передано відповідальному працівнику.\n Через деякий час з Вами звяжуться щодо уточнення деталей. `)
                    .then(
                      

                    
                      
                     fs.appendFile('./bot_logmts.txt', `[${todayfile}]\nНадійшло звернення від кліента на забір крові на дому\n${ordernum}\nІм\'я: ${namer}\nТелефон:  ${orderphone}\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\nЗнайдене повне Ім\'я в базі даних:  ${trimmedStr}`, (err) => {
                      if (err) throw err;
                      console.log('Дані були успішно дописані в кінець файлу');
                    })

                  // bot.sendMessage(-813260675,`Надійшло звернення від кліента на забір крові на дому\n<b>${ordernum}</b>\n     \nІм\'я: ${namer}\nТелефон: <b> ${orderphone}</b>\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\n \nЗнайдене повне Ім\'я в базі даних:  ${trimmedStr}\n       \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `,{parse_mode: 'HTML'})

                    );
                  
                    
                    
                    }});}else{bot.sendMessage(chatId,'Номер мобільного введено не вірно. Довжина номеру повинна бути 10 цифр. \n Почніть заповнення анкети замовлення спочатку - через головне меню. Дякуємо за порозуміння');}
                    
                   
                      
                    
                  
                  
                  });

                    
                });
              
              
              });
            
            
            });
          
          
          });
          
          
          });
        
       
        });
        
      });
       
       


    },1000);


    


    } else {bot.sendMessage(chatId,'😪 Ми, наразі зачинені. Звернення обробляються лише в робочий час.');};

         
        break;

        case  'monitor':

        GetNameDB(chatId)
        .then(telegram => {
          outputdate = DateMod(telegram._doc.BirthDay);
            bot.sendMessage(chatId, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: ${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay} `).then(getW(chatId));})
            .catch(err => {bot.sendMessage(chatId, 'У мене відсутні дані про Вас. Для запуску відстеження готовності виконанння дослідженнь, потрібно отримати від Вас, дату народження і Ваш номер мобільного телефону який Ви реєстрували в лабораторії', {
              reply_markup: {  
                keyboard: [
                 [{ text: `Ваш номер\n${phone}`, callback_data: 'PointFence1000' }, { text: `Дата народження\n${databurn}`, callback_data: 'PointFence7000'}  ],
                  
                  
                ],
              
              }
            });
        });
              
                
             




  


           // if (phone){};


        
       


          break;

    default:
      break;
  }
});