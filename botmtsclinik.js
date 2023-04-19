const TelegramBot = require('node-telegram-bot-api');
const photo = 'https://milamed.com.ua/wp-content/uploads/2022/12/img_5791-scaled.jpg';
const token = '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA';
const bot = new TelegramBot(token, { polling: true });
const url = 'http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech';
//const url =  'http://milamed.org.ua:9998/KDG_SIMPLE_LAB_API/Milamed6';
let databurn,ama;
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
       
      
       
    }
}); 


});
async function requestdata (msg,newac,newaca=newac){
  
  
  
  bot.sendMessage(msg, `Починаю пошук інформації. Результат виконання запиту - це окремі файли pdf формату. Час виконання може бути значним. Зачекайте повного виконання запиту.`)

await fetch(`${url}/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`,{
  headers: {
    'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
  //'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
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
    

   await  fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${data[i].WebCode}&ShowOnlyReady=false`,{
headers: {
  'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
//'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
}
})
.catch(error => {bot.sendMessage(msg,'Виникла помилка завантаження даних. Спробуйте пізніше.');})
.then(res => res.arrayBuffer())
.then(buffer => {
const fileBufferpdf = Buffer.from(buffer);


bot.sendDocument(msg,fileBufferpdf,{},{filename: `${data[i].WebCode}.pdf`,contentType: 'application/pdf'})
bot.sendMessage(msg,'Запис  ' + `${(i+1)}` + '       Дата звернення: ' + `${data[i].Date}`)

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
  
  actualid = msg.chat.id;
  outputdate = year + '-' + month + '-' + day;
 bot.sendMessage(msg.chat.id, `Дякуємо! Ваш номер телефону: ${phone}`); // Відправляємо повідомлення з підтвердженням
 
setTimeout(()=>{   bot.sendMessage(msg.chat.id, 'Виберіть період,який Вас цікавить:', {
  
  reply_markup: {  
    inline_keyboard: [
      [{ text: `1. ${curyear-3}`, callback_data: 'button12' }],
      [{ text: `2. ${curyear-2}`, callback_data: 'button11' }],
      [{ text: `3. ${curyear-1}`, callback_data: 'button9' }],
      [{ text: `4. ${curyear}`, callback_data: 'button10' }],
      [{ text: '5. Усі роки', callback_data: 'button13' }]
     
     
    ],
  

    
  }


});},1000);

console.log(outputdate);
 console.log(phone);


});  
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const textid = msg.text;
  actualid = chatId;
  if (msg.text === '/start') {
    bot.sendSticker(chatId,'CAACAgIAAxkBAAEInYFkPTL-z7XSsYz_T-PZyTU7P2lUlwACEwAD0jx1DrpU_OxSKpfhLwQ');
    bot.sendMessage(chatId, 'Виберіть дію:', {
      reply_markup: {  
        inline_keyboard: [
          [{ text: '1. Отримати результати аналізів по коду', callback_data: 'button1' }],
          [{ text: '2. Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
          [{ text: '3. Як нас знайти', callback_data: 'button3' }],
          [{ text: '4. Новини та акції', url: 'https://www.mtsclinic.com/drygieyslygi' }],
          [{ text: '5. Актуальний прайс-лист лабораторії Mtsclinic', callback_data: 'button5' }],
          [{ text: '6. Прайс-лист медичного центру Mtsclinic', callback_data: 'button6' }],
          [{text: 'Перейти на офіційний сайт',url: 'https://www.mtsclinic.com/'}],
          [{ text: 'Запустити моніторинг', callback_data: 'deamon' }]
         
        ],
      
      }
    });
  }

   if (msg.text === undefined){}
   else if (msg.text.length == 15  ) {
        const number1 = Number(msg.text);
         if (isNaN(number1) == false){
       
        bot.sendMessage(msg.from.id,'Унікальний код введено вірно - починаю пошук Вашого замовлення');
  
    fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${msg.text}&ShowOnlyReady=false`,{
      headers: {
        'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
      //'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ== '
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
        //bot.sendLocation(chatId,49.42566, 26.98299,{reply_markup:{remove_keyboard:true}});
        
        bot.sendMessage(chatId, `<b><u>Пісочин.</u></b>` + 'тел.:(0932962501,0960414004)(Viber,Telegram)\nПункт вакцинації від COVID-19\nАдреса: Набережна, 11/1\nПн-Пт с 08:00-18:00,\n Сб с 08:00-16:00, \nНд с 08:00-14:00',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,`<b><u>Баварія.</u></b>` + 'тел.: (0932962507)(Viber)\nАдреса: проспект Ново-Баварський, 70\nПн-Сб с 08:00-12:00, Нд (вихідний)',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,`<b><u>Аеропорт.</u></b>` +' тел.:(0932962509)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Проспект Гагарина, 316Б\nПн-Пт с 07:30-12:00, Нд (вихідний)',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,`<b><u>Південний вокзал.</u></b>` +' тел.:(0932962504)(Viber,Telegram)\nАдреса: Котляра, 12\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,`<b><u>Рогань. </u></b>` +'тел.:(0932962505)(Viber)\nАдреса: Сергія Грицевця, 9\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,'Холодна Гора. тел.:(0932962502)(Viber)\nАдреса: Полтавський шлях, 152 (Дитяча поліклініка №19 кабінет №8)\nПн-Сб с 08:00-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"}); 
        bot.sendMessage(chatId,'Люботин. тел.:(0932962508)(Viber)\nАдреса: Шевченка, 15 (каб. 2) (Міська поліклініка)\nПн-Сб с 08:00-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
        bot.sendMessage(chatId,'Холодна Гора. тел.:(0637078733)(Viber)\nАдреса: Дудинської, 1а\nПн-Сб с 07:30-12:00, Нд (вихідний)​​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
        bot.sendMessage(chatId,'Комунальний ринок. тел.:(0932962513)(Viber)\nАдреса: Льва Ландау, 8\n(працює за індивідуальним графіком)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
        bot.sendMessage(chatId,'ХТЗ. тел.:(932962510)(Viber)\nАдреса: пр-т. Олександрівський, 124\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});
        bot.sendMessage(chatId,'Салтівка. тел.:(0932962506)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Тракторобудівників, 160В\nПн-Сб с 07:30-12:00, Нд (вихідний)​',{reply_markup:{remove_keyboard:true},parse_mode: "HTML"});


        break;
    case 'button4':
      //  bot.sendPhoto(chatId,photo,{reply_markup:{remove_keyboard:true}});
      
       //ama =  setInterval(()=>{
        
       // requestdata (chatId,2021);
        
       // bot.sendPhoto(chatId,photo,{reply_markup:{remove_keyboard:true}});//},5000);
      break;
      case 'button5':

      bot.sendMessage(chatId,'Завантажую актуальний прайс',{reply_markup:{remove_keyboard:true}});
     
          
        fetch('https://www.mtsclinic.com/_files/ugd/fd4680_84efb0554e9f4d9590db25061ce954a6.pdf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
         const fileBuffer = Buffer.from(buffer);
        console.log(fileBuffer);
       
        bot.sendDocument(chatId,fileBuffer,{caption: 'Актуальний прайс лабораторії Mtsclinic'

          },{filename: 'Price.pdf',contentType: 'application/pdf'});});

            
      break;
      case 'button6':
        fetch('https://www.mtsclinic.com/_files/ugd/fd4680_7ac7380d6eac480e806fc558e5d80fb9.pdf')
      .then(res => res.arrayBuffer())
      .then(buffer => {
         const fileBuffer = Buffer.from(buffer);
        console.log(fileBuffer);
       
        bot.sendDocument(chatId,fileBuffer,{caption: 'Актуальний прайс медичного центру Mtsclinic'

          },{filename: 'Price.pdf',contentType: 'application/pdf'});});

      break;
      case 'button8':
        //bot.sendDocument(chatId,`C:\\JAVA\\Telegram\\Priceclinicmilamed.xlsx`,{caption: 'Актуальний прайс медичного центру Міламед'

    

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
     case 'button20':
       
    default:
      case 'deamon':
      
  
      setInterval(() => {
        
      bot.sendMessage(actualid,'Test');
       bot.sendMessage(actualid, `Починаю пошук інформації. Результат виконання запиту - це окремі файли pdf формату. Час виконання може бути значним. Зачекайте повного виконання запиту.`)

 fetch(`${url}/custom/GetPatientExams?BurnDate=1982-08-06&PhoneNumber=0506158601&BegDate=2010-01-01&EndDate=2023-12-31`,{
  headers: {
    'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
  //'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
  }
  })
    //.catch(error => {bot.sendMessage(msg,'Виникла помилка завантаження даних. Спробуйте пізніше.');})
  .then(response => { 
    if (response.ok){response.json()
  .then(data => {
   
    const nameArray = data.length;
    if (nameArray == 0){ bot.sendMessage(actualid, `Результат виконання запиту - не знайдено замовлень по Вашим даним. Можливі причини цього читайте в головному розділі в пункті Допомога.`);}
    else {bot.sendMessage(actualid, `Результат виконання запиту - знайдено ${nameArray} замовлень  рік по Вашим даним`,{reply_markup:{remove_keyboard:true}});
   
    list = gruopresults(actualid,nameArray,data);
    
    

                  
  
}});}else {bot.sendMessage(actualid,'Виникла помилка завантаження даних. Спробуйте пізніше.');}



});
       
        
      }, 50000);
     
      break;
  }
});