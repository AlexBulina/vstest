 /* jshint maxlen: 300 */
 const TelegramBot = require('node-telegram-bot-api');
 const fs = require('fs');
 const {
   weather,
   randomize,
   isWorkingTime,
   RemoveDocDB,
   isdbName,
   url,
   token,
   basicauth,
   InlineKB,
   ButtonStartMenu,
   GetNameDB,
   GetPackResultsCount,
   GetPackResults,
   GetCurDay,
   GetPeriodBack
   
 } = require('./HTML training/testexport');
 const {
   Console
 } = require('console');
 const bot = new TelegramBot(token, {
   polling: true
 });
 let databurn, phone, list, ordertime, namer, homeadress, orderphone, ordernumclient, trimmedStr;
 let today = new Date();
 let modifydate = new Date();
 let curyear = today.getFullYear();
 let outputdate, countcode = 0;
 let actualid, textid,analcount ;
 let DateRegularexp = /^(\d{2})\/(\d{2})\/(\d{4})$/;
 let DateRegularexp1 = /^(?!(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})$).*$/
 ;

 let TelegramId ;
 let SelectTriger = false;
 let BurnTriger = false;
 let PhoneTriger = false;
 let QuestionPhoneTriger = false;
 let intervalId = 0;
 let ArrayCheckAnalyze = [];
 let timepause = 20000; // 900000;
 let ii = true;
 const intervals = {};
 const userphones = {};
 const userburns = {};
 let isAlreadySent = false;
  let getWorkperiodstatus;
 const  demosmspng = '.\\demosms.png';
let GetTrigerObject = {};
let arrayyearcount = [];

 console.log('Телеграм бот MTS Clinic - запущено');




 
 function StartMonitor(query){ 
  GetNameDB(Number(query))
      .then(telegram => {
    outputdate = telegram._doc.BirthDay;
    bot.sendMessage(query, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: 0${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay} `)
      .then(bot.sendMessage(query, 'Запускаю систему моніторингу актуальних замовлень в лабораторії. Сканування змін статусу виконання існуючих досліджень проходить що 15 хв.', {
          reply_markup: {
            keyboard: [
              [{
                text: 'Зупинити моніторинг',
                request_contact: false,



              }, ]
            ],
            resize_keyboard: false

          }
        })
        .then(data => {

          if ((query in intervals) == false) {


            intervalId = setInterval(() => {


              const currentTime = new Date();
             
              // Встановлення бажаного часу
              const desiredTime = new Date();
              desiredTime.setHours(23);
              desiredTime.setMinutes(50);

              // Порівняння годин
              if (currentTime <= desiredTime) {
                console.log('Час менший або дорівнює 23:50');
                GetPackResults(telegram._doc.BirthDay, telegram._doc.Phone, GetPeriodBack(1000), GetCurDay())
                  .then(response => {

                    if (response.ok) {
                      response.json()
                        .then(data => {
                          console.log(data);

                          if (data.length == 0) {
                            bot.sendMessage(query, 'У Вас не знайдено аналізів до виконання в поточному періоді.');
                            stopInterval(query);
                          }
                          for (let i = 0; i < data.length; i++) {
                            const resarray = data[i];
                            isAlreadySent = false;
                            for (let j = 0; j < ArrayCheckAnalyze.length; j++) {
                              if (resarray.Docstatus == 'скасовано') {
                                continue;
                              }
                              const item = ArrayCheckAnalyze[j];
                              if (resarray.WebCode == item) {
                                console.log(`Ці дані я вже передав: ${resarray.WebCode}`);
                                isAlreadySent = true;
                                //break;
                              }
                            }
                            if (!isAlreadySent) {
                              if (resarray.Docstatus == 'перевірено') {
                                if (ArrayCheckAnalyze.length >= 0) {
                                  bot.sendMessage(query, `Знайдено дослідження в статусі: ${resarray.Docstatus}. Надсилаю його Вам`)
                                    .then(ArrayCheckAnalyze.push(resarray.WebCode));
                                }


                                GetPdfCode(query, resarray.WebCode, data.length);
                              } else {
                                if (ii == true) {




                                  setTimeout(() => {
                                    if (resarray.Docstatus != 'скасовано') {
                                      bot.sendMessage(query, `Також знайдено  дослідження в статусі: ${resarray.Docstatus}. Очікуйте виконання`, {
                                        reply_markup: {
                                          remove_keyboard: false
                                        }
                                      });
                                    }
                                  }, 6000);
                                  ii = false;




                                }
                              }

                            }
                          }






                        });
                    }
                  });

              } else {
                stopInterval(query.message.chat.id);
                console.log('Час більший за 23:59');
                bot.sendMessage(query, 'Зупинка моніторингу по завершенню календарної доби. Для продовження моніторингу перезапустіть послугу в новій календарній добі.');
              }


              // telegram._doc.BirthDay,telegram._doc.Phone,'01-01-2023','12-21.2023'
            }, timepause);
            intervals[query] = intervalId;



          } else {
            bot.sendMessage(query, `⚠	Моніторинг результатів вже запущено.	`);
          }
        })







      );

  })
  .catch(err => {
    bot.sendMessage(query, 'У мене відсутні дані про Вас. Для запуску відстеження готовності виконанння дослідженнь, потрібно отримати від Вас, дату народження і Ваш номер мобільного телефону, який Ви реєстрували в лабораторії', GetKeybNull);



  });
}



 bot.onText(DateRegularexp, (msg) => {
  ArrayCheckAnalyze = []; ii = true;
  if (validateDate(msg.text)==true){
    
    userburns[msg.chat.id] = modifydate.DateMod(msg.text);
 
  
  
  

  


   
  if (userphones[msg.chat.id] == undefined && validateDateObj(userburns[msg.chat.id])) {
     bot.sendMessage(msg.chat.id, `Дякуємо! Ваша дата народження: ${userburns[msg.chat.id]}`, GetKeyboardonlyBurn(userburns[msg.chat.id]));
   } else if (validateDateObj(userburns[msg.chat.id]) && userphones[msg.chat.id]){
     bot.sendMessage(msg.chat.id, `Дякуємо! Ваша дата народження: ${userburns[msg.chat.id]}`, GetKeyboradBurnandPhone(userphones[msg.chat.id], userburns[msg.chat.id]));
     isdbName(msg.chat.id, Number(userphones[msg.chat.id]), userburns[msg.chat.id], GetPeriodBack(1000), GetCurDay(),false).catch(()=>{})
     .then((response=>{
      if (response != undefined){
      if (response.IsUpdateted == true) {
        stopInterval(msg.chat.id);}}



      }));

   } else{ (bot.sendMessage(msg.chat.id,'Відсутня інформація про Вас.'));}



   if (GetTrigerObject[msg.chat.id].BurnTriger == true && userphones[msg.chat.id] == undefined) {
     bot.sendMessage(msg.chat.id, `Тепер попрошу Вас надати дозвіл на отримання Вашого мобільного номера. Натисніть кнопку , що з'явилася під полем вводу.`, {
       reply_markup: {
         keyboard: [
           [{
             text: 'Надіслати номер телефону',
             request_contact: true,




             // Вмикаємо запит на надсилання контакту
           }]


         ],

         resize_keyboard: false

         // Вмикаємо автоматичне зменшення клавіатури
       }
     });
   }

 
 if (GetTrigerObject[msg.chat.id].SelectTriger == true && userphones[msg.chat.id] && userburns[msg.chat.id] && GetTrigerObject[msg.chat.id].PhoneTriger == false)
 {
  GetTrigerObject[msg.chat.id].arrayyearcount = [];
  processIterations(msg.chat.id,3)
  .then(() => {

    GetNameDB(msg.chat.id).then(() =>{
    // isdbName(msg.chat.id,userphones[msg.chat.id],userburns[msg.chat.id],'2010-01-01','2030-31-12').then((response)=>{

      if (userphones[msg.chat.id] && userburns[msg.chat.id] != undefined){    //перевірка на наявність в базі
      
      
        bot.sendMessage(msg.chat.id, `Виберіть період,який Вас цікавить:`, {
  
        reply_markup: {
          inline_keyboard: [
            [{
              text: `1. ${curyear-3}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[0]}) `,
              callback_data: 'button12'
            }],
            [{
              text: `2. ${curyear-2}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[1]})`,
              callback_data: 'button11'
            }],
            [{
              text: `3. ${curyear-1}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[2]})`,
              callback_data: 'button9'
            }],
            [{
              text: `4. ${curyear}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[3]}) `,   
              callback_data: 'button10'
            }],
            [{
              text: `5. Усі роки: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount.sumArray( GetTrigerObject[msg.chat.id].arrayyearcount)}) `,
              callback_data: 'button13'
            }]
  
          ],remove_keyboard: false
  
        }
  });}}).catch(()=>{bot.sendMessage(msg.chat.id, `Помилка. Відсутня інформація про Вас в базі данних MTS Clinic`);});


    });

  } else {}
 if (GetTrigerObject[msg.chat.id].StartScan == true && validateDateObj(userburns[msg.chat.id])){
  
 isdbName(msg.chat.id, Number(userphones[msg.chat.id]), userburns[msg.chat.id], GetPeriodBack(1000), GetCurDay(),false)
 .then(

  setTimeout(()=>{StartMonitor(msg.chat.id);   },2000)
    
 
 
 
 
 )
.catch(err =>{bot.sendMessage(msg.chat.id,'Помилка. Відсутня інформація про Вас в базі данних MTS Clinic',GetKeyboardonlyBurn(userburns[msg.chat.id]));})
     

 
 
 } else {}
 




 } else { console.log('Помилка дата нулі');
   
  }


 });
 async function requestdataCount(msg, newac, newaca = newac, phoneq, outputdateq) {
  try {
    const response = await fetch(`${url}/custom/GetPatientExams?BurnDate=${outputdateq}&PhoneNumber=${phoneq}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`, {
      headers: {
        'Authorization': basicauth
      }
    });

    if (response.ok) {
   
      const data = await response.json();
      
      return data;
    } else { return 0;
      //throw new Error('Request failed');
    }
  } catch (error) {
    throw error;
  }
}

  
 
 async function requestdata(msg, newac, newaca,phoneq,outputdateq) {

    

   bot.sendMessage(msg, `Починаю пошук інформації. Результат виконання запиту - це окремі файли pdf формату. Час виконання може бути значним. Зачекайте повного виконання запиту.`)

    if (phoneq == undefined || outputdateq == undefined || validateDateObj(outputdateq)==false) {bot.sendMessage(msg,'Виникла помилка. Відсутні або некоректні дані. Пройдіть процедуру з головного меню - заново');} else {

   await fetch(`${url}/custom/GetPatientExams?BurnDate=${outputdateq}&PhoneNumber=${phoneq}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`, {
       headers: {
         // 'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
         'Authorization': basicauth
       }
     })
     .catch(error => {
       bot.sendMessage(msg, `Виникла помилка завантаження даних. Спробуйте пізніше.`);
     })
     .then(response => {
       //response.ok
       if (response.ok) {
         response.json()
           .then(data => {

             const nameArray = data.length;

             if (nameArray == 0) {
               bot.sendMessage(msg, `Результат виконання запиту - не знайдено замовлень по Вашим даним. Відсутні дані в лабораторії по Вашим наданим даним.`);
             } else {
               const status = data[0].Docstatus;
               // if (status == 'перевірено'){
               bot.sendMessage(msg, `Результат виконання запиту - знайдено ${nameArray} замовлень за ${newac} рік по Вашим даним`, {
                 reply_markup: {
                   remove_keyboard: true
                 }
               });

               gruopresults(msg, nameArray, data);





             }
           });
       } else {
         bot.sendMessage(msg, 'Виникла помилка завантаження даних. Спробуйте пізніше.');
       }



     });
    }}


 async function gruopresults(msg, nameArray, data) {

   for (let i = 0; i <= nameArray - 1; i++) {

     console.log(data[i].WebCode);
     if (data[i].Docstatus == 'перевірено') {

       await fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${data[i].WebCode}&ShowOnlyReady=false`, {
           headers: {
             'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
           }
         })
         .then(res => res.arrayBuffer())
         .then(buffer => {
           const fileBufferpdf = Buffer.from(buffer);

           bot.sendDocument(msg, fileBufferpdf, {}, {
             filename: `${data[i].WebCode}.pdf`,
             contentType: 'application/pdf'
           })
           bot.sendMessage(msg, 'Запис  ' + `${(i+1)}` + '      \nДата звернення: ' + `${data[i].Date} \nСтатус виконання:  ${data[i].Docstatus}`)
             .catch({
               i
             });

         });

     }

     else {
       bot.sendMessage(msg, `Замовлення  ${data[i].WebCode} поки в процесі виконання. `);
       console.log('Замовлення в процесі роботи');
     }
   }
 }


 bot.on('contact', (msg) => {
  // phone = (msg.contact.phone_number).slice(-10); // Отримуємо номер телефону з об'єкту contact
  if (QuestionPhoneTriger == true){

   // QuestionPhoneTriger = false;
    setTimeout(()=>{  bot.sendMessage(msg.chat.id, `Вітаю Вас, поставте нам запитання або озвучте проблему з якою Ви зіткнулись в нашій лабораторії. І ми в найкоротший час звяжемося з Вами`, {
      reply_markup: {
        force_reply: true
      }
    }).then(sent=>{
     bot.onReplyToMessage(msg.chat.id, sent.message_id, (reply) => {
                       if (reply.text == '/start' || reply.text == undefined || reply.text.length ==0){bot.sendMessage(msg.chat.id,'Введено некоректний текст');}else{
       bot.sendMessage(msg.chat.id, `Ваше запитання відправлено оператору. Очікуйте відповідь.`).then(QuestionPhoneTriger = false);
       //  bot.sendMessage(chatId,namer).then((sent)=>{ bot.forwardMessage(-813260675, chatId, sent.message_id); } );
       
       bot.sendMessage(-954144335, `Надійшло запитання від користувача Телеграм-бота ${sent.chat.first_name}\n     \nТекст запитання:\n ${reply.text}\n Номер телефону: ${userphones[msg.chat.id]}    \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `, {
         parse_mode: 'HTML'
       });
     }});});},1200);
  



















  }
   if (msg.chat.id in userphones){}else{userphones[msg.chat.id]= (msg.contact.phone_number).slice(-10);}
   if (msg.chat.id in userburns  && validateDateObj(userburns[msg.chat.id])== true){ 
       bot.sendMessage(msg.chat.id, `Дякуємо! Ваш номер телефону: ${msg.contact.phone_number}`, GetKeyboradBurnandPhone((msg.contact.phone_number).slice(-10), userburns[msg.chat.id]));
           isdbName(msg.chat.id, Number((msg.contact.phone_number).slice(-10)), userburns[msg.chat.id], GetPeriodBack(1000), GetCurDay(),false)
           .catch(err =>{bot.sendMessage(msg.chat.id,'Помилка. Відсутня інформація про Вас в базі данних MTS Clinic');});

      } 
   
    else {
     // if (QuestionPhoneTriger == false){} else {}
     if (GetTrigerObject[msg.chat.id].PhoneTriger== true){bot.sendMessage(msg.chat.id, `Дякуємо! Ваш номер телефону: ${msg.contact.phone_number}`, GetKeyboardPhone((msg.contact.phone_number).slice(-10)));
   }
     //----------------------ту треба всативити обробку запиту на імя
    // outputdate = DateMod(databurn);

   }
   if (GetTrigerObject[msg.chat.id].SelectTriger && (userphones[msg.chat.id] != undefined)  && validateDateObj(userburns[msg.chat.id]) && !GetTrigerObject[msg.chat.id].PhoneTriger ){
    //bot.sendMessage(msg.chat.id,'Оберіть потрібний період',YearSelect);
    GetTrigerObject[msg.chat.id].arrayyearcount = [];
    processIterations(msg.chat.id,3)
  .then(() => {

    GetNameDB(msg.chat.id).then(() =>{


        if (userphones[msg.chat.id] && userburns[msg.chat.id] != undefined){
      
      
      bot.sendMessage(msg.chat.id, `Виберіть період,який Вас цікавить:`, {

      reply_markup: {
        inline_keyboard: [
          [{
            text: `1. ${curyear-3}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[0]}) `,
            callback_data: 'button12'
          }],
          [{
            text: `2. ${curyear-2}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[1]})`,
            callback_data: 'button11'
          }],
          [{
            text: `3. ${curyear-1}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[2]})`,
            callback_data: 'button9'
          }],
          [{
            text: `4. ${curyear}: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount[3]}) `,   
            callback_data: 'button10'
          }],
          [{
            text: `5. Усі роки: Аналізів (${ GetTrigerObject[msg.chat.id].arrayyearcount.sumArray( GetTrigerObject[msg.chat.id].arrayyearcount)}) `,
            callback_data: 'button13'
          }]

        ],remove_keyboard: false

      }
});
bot.sendMessage(msg.chat.id,'В разі потреби скорегуйте свою дату народження та номер телефону через кнопки клавіатури , що внизу.Також, якщо Ви реєстрували дослідження своєї дитини на свій номер, то введіть дату народження Вашої дитини чи окремих дітей і отримайте їхні результати досліджень.',GetKeyboradBurnandPhone(userphones[msg.chat.id],userburns[msg.chat.id] )
// 



).then(GetTrigerObject[msg.chat.id].PhoneTriger =false);
} else {
   
   bot.sendMessage(msg.chat.id, 'Введіть свою дату народження в форматі ДД/ММ/РРРР - для унікальної ідентифікації вас в базі данних лабораторії MTS Clinic', {
     reply_markup: {
       remove_keyboard: true
     }
   });

}

    }).catch(err =>{console.log(err +'Відстуній запис паціента в постійних кліентах телеграма' );});
  
  
  });









  }



   //bot.sendMessage(msg.chat.id, `Дякуємо! Ваш номер телефону: ${phone}`,GetKeybOnlyPhone); // Відправляємо повідомлення з підтвердженням

   






   console.log(GetTrigerObject);
   console.log(phone);











 });

 let GetKeybNull = {
   reply_markup: {
     keyboard: [
       [{
         text: 'Крок 1: Надіслати номер телефону',
         request_contact: true
       }],




       // Вмикаємо запит на надсилання контакту
       [`Крок 2: Дата народження`]


     ],
     resize_keyboard: true

   }
 };


const YearSelect = {   reply_markup: {
  inline_keyboard: [
    [{
      text: `1. ${curyear-3}`,
      callback_data: 'button12'
    }],
    [{
      text: `2. ${curyear-2}`,
      callback_data: 'button11'
    }],
    [{
      text: `3. ${curyear-1}`,
      callback_data: 'button9'
    }],
    [{
      text: `4. ${curyear}`,
      callback_data: 'button10'
    }],
    [{
      text: '5. Усі роки',
      callback_data: 'button13'
    }]

  ],remove_keyboard: false

}};

 function GetKeyboardPhone(getphone) {
   const GetKeybOnlyPhone = {
     reply_markup: {
       keyboard: [
         [{
           text: `Ваш номер телефону:\n ${getphone} `,
           request_contact: true
         }],




         // Вмикаємо запит на надсилання контакту
         [`Дата народження`]


       ],
       resize_keyboard: true



     }
   };

   return GetKeybOnlyPhone;
 }


 function validateDateObj(dateString) {
  // Шаблон даты: ГГГГ-ММ-ДД
  var pattern = /^\d{4}-\d{2}-\d{2}$/;

  // Проверяем совпадение с шаблоном
  if (!pattern.test(dateString)) {
    return false;
  }

  // Разбиваем строку на составляющие
  var parts = dateString.split('-');
  var year = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var day = parseInt(parts[2], 10);

  // Проверяем корректность даты
  if (year < 1000 || year > 9999 || month === 0 || month > 12) {
    return false;
  }

  // Проверяем количество дней в месяце
  var maxDay = new Date(year, month, 0).getDate();
  if (day === 0 || day > maxDay) {
    return false;
  }

  // Дата прошла все проверки
  return true;
}


 function validateDate(dateString) {
  // Шаблон даты: дд/мм/гггг
  var pattern = /^\d{2}\/\d{2}\/\d{4}$/;

  // Проверяем совпадение с шаблоном
  if (!pattern.test(dateString)) {
    return false;
  }

  // Разбиваем строку на составляющие
  var parts = dateString.split('/');
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  // Проверяем корректность даты
  if (year < 1000 || year > 9999 || month === 0 || month > 12) {
    return false;
  }

  // Проверяем количество дней в месяце
  var maxDay = new Date(year, month, 0).getDate();
  if (day === 0 || day > maxDay) {
    return false;
  }

  // Дата прошла все проверки
  return true;
}


 function GetKeyboardonlyBurn(getburn) {
   const keyboardOnlyBurn = {
     reply_markup: {
       keyboard: [
         [{
           text: `'Надіслати номер телефону' `,
           request_contact: true
         }],




         // Вмикаємо запит на надсилання контакту
         [`Дата народження: \n ${getburn}`]


       ],
       resize_keyboard: true



     }
   };
   return keyboardOnlyBurn;
 }

 function GetKeyboradBurnandPhone(getphone, getburn) {
   const keyboardPhoneandBurn = {
     reply_markup: {
       keyboard: [
         [{
           text: `Ваш номер телефону: ${getphone} `,
           request_contact: true
         }],




         // Вмикаємо запит на надсилання контакту
         [`Дата народження: ${getburn}`]


       ],
       resize_keyboard: true



     }
   };
   return keyboardPhoneandBurn;
 }



 function stopInterval(chatId) {
   // Проверяем, есть ли интервал для данного пользователя
   if (chatId in intervals) {
     // Останавливаем интервал и удаляем его из объекта intervals
     clearInterval(intervals[chatId]);
     delete intervals[chatId];

     // Отправляем сообщение пользователю об остановке интервала
     bot.sendMessage(chatId, 'Автоматичний моніторинг зупинено.');
   } else {
     // Если интервала нет, отправляем сообщение пользователю
     bot.sendMessage(chatId, 'Нема діючого моніторинга.');
   }
 }



 async function getW(chatid, city) {
  return new Promise((resolve,reject)=>{
   weather(city)
     .then(data => {
       const getweasher = {
         latitude: data[0].lat,
         longitude: data[0].lon,
         city: data[0].local_names.uk,
         appid: '29ebfe90e8a43cfb861bd842ed6ca6f8'
       };
       return getweasher;
     })
     .catch(error => {console.error(error);})
     .then(getweasher => fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getweasher.latitude}&lon=${getweasher.longitude}&appid=${getweasher.appid}&units=metric&lang=ua`)
       
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













      resolve();   }


       ).catch(err => {console.log('Помилка в функції виклику данних погоди. Рядок 692' + err);})
       );
   });  }



 async function GetPdfCode(msg, webcode, count) {




   await fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${webcode}&ShowOnlyReady=false`, {
       headers: {
         'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
       }
     })
     .then(res => res.arrayBuffer())
     .then(buffer => {
       const fileBufferpdf = Buffer.from(buffer);

       bot.sendDocument(msg, fileBufferpdf, {}, {
           filename: `${webcode}.pdf`,
           contentType: 'application/pdf'
         })
         .then(setTimeout(() => {
           (bot.sendMessage(msg, 'Вивантаження данних завершено')

           );
         }, 1500));
      // countcode++;
      //  if (countcode == count) {
      //    stopInterval(msg);
      //    intervalId = 0;
      //  }

     });


   return true;





 }





 function processIterations(Tid,i) {

  if (i >= 0) {
    
    return requestdataCount(Tid, curyear - i, curyear - i, userphones[Tid], userburns[Tid])
      .then(res => {
        
        GetTrigerObject[Tid].arrayyearcount.push(res.length);
         // Добавляем текущее значение res в массив
        return processIterations(Tid,i - 1); // Рекурсивно вызываем следующую итерацию с уменьшенным i
      });
  } else {
    return Promise.resolve(); // Возвращаем успешно разрешенный промис при завершении всех итераций
  }
}




bot.on('polling_error', (error) => {
  if (error.response && error.response.statusCode === 403) {
    console.log('Користувач заблокував телеграм-бота');
    // Здесь можно добавить дополнительную логику, связанную с заблокированным пользователем
    return;
  }

  // Ваш код для обработки других ошибок
});


 bot.on('message', (msg) => {





   const chatId = msg.chat.id;
   if (msg.contact === undefined){
      if (validateDate(msg.text) )
      {QuestionPhoneTriger = true;
         if ( msg.text == '/start' || msg.text == '/delete' || msg.text.includes('Дата') || msg.text.includes('Зупинити') || QuestionPhoneTriger ){QuestionPhoneTriger = false;}
     else {bot.sendMessage(msg.chat.id,'Внесений невірно формат дати народження. Спробуйте знову.');} } else {
     }
     }
     
   if ( msg.text === 'Зупинити моніторинг') {
     // Отримання поточного часу
     stopInterval(msg.chat.id);

   }







    if (msg.text != undefined){
   if (msg.text.includes('Дата народження')) {
     bot.sendMessage(chatId, 'Введіть свою дату народження в форматі ДД/ММ/РРРР - для унікальної ідентифікації вас в базі данних лабораторії MTS Clinic');
     



   }} 

   if (msg.text === '/delete') { 
    RemoveDocDB(msg.chat.id).then(()=>{bot.sendMessage(msg.chat.id,'Профіль користувача успішно очищено. Почніть роботу з menu /start');}); 
         delete  userburns[msg.chat.id];
         delete userphones[msg.chat.id];
         ArrayCheckAnalyze = [];
         ii = true;
     
  
  }
 
   if (msg.text === '/start') {

     bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEIyH5kTfKJfjKEmYHi8CKOq2f7YZupTwACGCUAAn2PcUrNxIKmFCxpby8E')
       .then(()=>{
       
         GetNameDB(msg.chat.id).then(telegram => {
          userburns[msg.chat.id]=telegram._doc.BirthDay;
          userphones[msg.chat.id] = telegram._doc.Phone;
          // actualid = msg.from.id;
         
           bot.sendMessage(chatId, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: 0${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay}`,{
            reply_markup: {
              remove_keyboard: true
            }
          })
             .then(()=>{getW(msg.from.id, 'Пісочин').then(()=>{SelectTriger = false;
                setTimeout(() => {
                SelectTriger = false;

                 bot.sendMessage(msg.chat.id, 'Виберіть дію: 👇', InlineKB);



               }, 500);
            });

             
              }







             );


         })
         .catch(error => {
           console.log('Помилка:', error);

           setTimeout(() => {
             bot.sendMessage(msg.from.id, `Вітаю Вас, Шановний відвідувач ${msg.from.first_name}`)
             .then(()=>{bot.sendMessage(msg.from.id, 'Виберіть дію: 👇', InlineKB);});


             



           }, 500);





         });}

       );














   }
   if (msg.text === undefined) {} else if (msg.text.length == 15) {
     const number1 = Number(msg.text);
     if (isNaN(number1) == false) {
      

       bot.sendMessage(msg.from.id, '😸 Унікальний код введено вірно - починаю пошук Вашого замовлення 🔍');

       fetch(`${url}/examination/getResultsPDF?ExaminationResultsPDFCode=${msg.text}&ShowOnlyReady=false`, {
           headers: {
             'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
           }
         })
         .then(res => res.arrayBuffer())
         .then(buffer => {
            if (buffer.byteLength < 1023){bot.sendMessage(msg.chat.id,'Код доступу відсутній в базі данних лабораторії MTS Clinic. Перевірте правильність набору комбінації.').then(QuestionPhoneTriger = false);}else

          {
           const fileBufferpdf = Buffer.from(buffer);

           bot.sendDocument(msg.from.id, fileBufferpdf, {}, {
             filename: `${msg.text}.pdf`,
             contentType: 'application/pdf'
           }).then(QuestionPhoneTriger = false);

          }
         })
         .catch(error => {console.error(error);
         QuestionPhoneTriger = false;});

     }
   }




 });

// тут закінчується блок bot.on("message")

 bot.on('callback_query', (query) => {
   const chatId = query.message.chat.id;
   const data = query.data;

   switch (data) {
     case 'button1':
      QuestionPhoneTriger = true;

       bot.sendMessage(query.message.chat.id, 'Введіть 15 значний унікальний код замовлення. код можна знайти на бланку замовлення або в смс від лабораторії про готовність результатів.', {
         reply_markup: {
           remove_keyboard: true
         }
       })
       .then(bot.sendPhoto(query.message.chat.id,demosmspng));


       break;
     case 'button2':
     
      QuestionPhoneTriger = true;
      GetTrigerObject = {
        [query.message.chat.id]: {
          SelectTriger: true,
          BurnTriger: true,
          PhoneTriger:  false,
          StartScan: false,
          arrayyearcount: []
        }};



// function processIterations(Tid,i) {
//   if (i >= 0) {
//     return requestdataCount(Tid, curyear - i, curyear - i, userphones[Tid], userburns[Tid])
//       .then(res => {

//         GetTrigerObject[Tid].arrayyearcount.push(res);
//          // Добавляем текущее значение res в массив
//         return processIterations(query.message.chat.id,i - 1); // Рекурсивно вызываем следующую итерацию с уменьшенным i
//       });
//   } else {
//     return Promise.resolve(); // Возвращаем успешно разрешенный промис при завершении всех итераций
//   }
// }

// Используем рекурсивную функцию для выполнения итераций
processIterations(query.message.chat.id,3)
  .then(() => {
    
    if (userphones[query.message.chat.id] && userburns[query.message.chat.id] != undefined){
      
      
      bot.sendMessage(query.message.chat.id, 'Виберіть період,який Вас цікавить:', {

      reply_markup: {
        inline_keyboard: [
          [{
            text: `1. ${curyear-3}: Аналізів (${ GetTrigerObject[query.message.chat.id].arrayyearcount[0]}) `,
            callback_data: 'button12'
          }],
          [{
            text: `2. ${curyear-2}: Аналізів (${ GetTrigerObject[query.message.chat.id].arrayyearcount[1]})`,
            callback_data: 'button11'
          }],
          [{
            text: `3. ${curyear-1}: Аналізів (${ GetTrigerObject[query.message.chat.id].arrayyearcount[2]})`,
            callback_data: 'button9'
          }],
          [{
            text: `4. ${curyear}: Аналізів (${ GetTrigerObject[query.message.chat.id].arrayyearcount[3]}) `,   
            callback_data: 'button10'
          }],
          [{
            text: `5. Усі роки: Аналізів (${ GetTrigerObject[query.message.chat.id].arrayyearcount.sumArray( GetTrigerObject[query.message.chat.id].arrayyearcount)}) `,
            callback_data: 'button13'
          }]

        ],remove_keyboard: false

      }
});
bot.sendMessage(query.message.chat.id,'В разі потреби скорегуйте свою дату народження та номер телефону через кнопки клавіатури , що внизу.Також, якщо Ви реєстрували дослідження своєї дитини на свій номер, то введіть дату народження Вашої дитини чи окремих дітей і отримайте їхні результати досліджень.',GetKeyboradBurnandPhone(userphones[query.message.chat.id],userburns[query.message.chat.id] )
// 



).then(GetTrigerObject[query.message.chat.id].PhoneTriger =false);
} else {
   
   bot.sendMessage(query.message.chat.id, 'Введіть свою дату народження в форматі ДД/ММ/РРРР - для унікальної ідентифікації вас в базі данних лабораторії MTS Clinic', {
     reply_markup: {
       remove_keyboard: true
     }
   });

}

  });
      
      
      
      requestdataCount(query.message.chat.id, curyear, curyear, userphones[query.message.chat.id], userburns[query.message.chat.id])
  .then(res => {
 
    return Promise.resolve(res.length); // Вернуть промис для обеспечения порядка выполнения
  })
  .catch(err => {console.log('Виникла помилка при зверненні на підрахунок кількості аналізів'+ err);});
 
   

    

        

        





        
      
      
  
       

       break;
     case 'button3':
       bot.sendMessage(query.message.chat.id, 'Адреса медичного центру MTS Clinic. м.Пісочин, Набережна 11/1').then(() => {
         bot.sendMessage(query.message.chat.id, `Мобільний телефон: \n 0932962501\n0960414004\nПослуги: забір аналізів, \nПункт вакцинації від COVID-19.\n`, {
           parse_mode: 'Markdown'
         });
         bot.sendLocation(query.message.chat.id, 49.962673, 36.09681, {
           reply_markup: {
             remove_keyboard: true
           }
         });





       });



       break;
     case 'button4':

       bot.sendMessage(query.message.chat.id, '➡ Виберіть потрібну філію:', {
         reply_markup: {
           inline_keyboard: [
             [{
               text: '🔹Пісочин',
               callback_data: 'PointFence1'
             }, {
               text: '🔹Холодна Гора',
               callback_data: 'PointFence7'
             }],
             [{
               text: '🔹Баварія',
               callback_data: 'PointFence2'
             }, {
               text: '🔹Люботин',
               callback_data: 'PointFence8'
             }],
             [{
               text: "❗Аеропорт (працює)",
               callback_data: 'PointFence3'
             }, {
               text: "🔹Холодна Гора, пункт №2 ",
               callback_data: 'PointFence9'
             }],
             [{
               text: "🔹Південний вокзал",
               callback_data: 'PointFence4'
             }, {
               text: "🔹Комунальний ринок",
               callback_data: 'PointFence10'
             }],
             [{
               text: "🔹Рогань",
               callback_data: 'PointFence5'
             }, {
               text: "🔹ХТЗ",
               callback_data: 'PointFence11'
             }],
             [{
               text: "❗Салтівка (працює)",
               callback_data: 'PointFence6'
             }],

           ],

         }
       });


       break;
     case 'button5':

       bot.sendMessage(query.message.chat.id, '💻 Завантажую актуальний прайс', {
         reply_markup: {
           remove_keyboard: true
         }
       });

       bot.sendDocument(query.message.chat.id, `C:\\Milamed request analyze\\actualpricemts.xlsx`, {
         caption: 'Актуальний прайс лабораторії Mtsclinic'

       });
       break;
     case 'button6':
       fetch('https://www.mtsclinic.com/_files/ugd/fd4680_7ac7380d6eac480e806fc558e5d80fb9.pdf')
         .then(res => res.arrayBuffer())
         .then(buffer => {
           const fileBuffer = Buffer.from(buffer);
           console.log(fileBuffer);

           bot.sendDocument(chatId, fileBuffer, {
             caption: '📋Актуальний прайс медичного центру Mtsclinic'

           }, {
             filename: 'Price.pdf',
             contentType: 'application/pdf'
           });
         });

       break;
     case 'button8':
       bot.sendDocument(query.message.chat.id, `C:\\Telegram\\Priceclinicmilamed.xlsx`, {
         caption: '📋Актуальний прайс медичного центру Mtsclinic'

       });

       break;
     case 'button9':
       if (query.message.chat.id == undefined) {} else {
         requestdata(query.message.chat.id, (curyear-1),(curyear-1),userphones[query.message.chat.id],userburns[query.message.chat.id]);
       }

       break;
     case 'button10':
       if (query.message.chat.id == undefined) {} else {
         requestdata(query.message.chat.id, curyear,curyear,userphones[query.message.chat.id],userburns[query.message.chat.id]);
       }


       break;
     case 'button11':
       if (query.message.chat.id == undefined) {} else {
         requestdata(query.message.chat.id, (curyear - 2),(curyear - 2),userphones[query.message.chat.id],userburns[query.message.chat.id]);
       }


       break;
     case 'button12':
       if (query.message.chat.id == undefined) {} else {
         requestdata(query.message.chat.id, (curyear - 3),(curyear - 3),userphones[query.message.chat.id],userburns[query.message.chat.id]);
       }


       break;
     case 'button13':
       if (query.message.chat.id == undefined) {} else {
         requestdata(query.message.chat.id, curyear, 2010,userphones[query.message.chat.id],userburns[query.message.chat.id]);
       }


       break;

     case 'PointFence1':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Пісочин.</u></b>` + 'тел.:(0932962501,0960414004)(Viber,Telegram)\nПункт вакцинації від COVID-19\nАдреса: Набережна, 11/1\nПн-Пт с 08:00-17:00,\n Сб с 08:00-16:00, \nНд с 08:00-14:00', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });
       break;

     case 'PointFence2':

       bot.sendMessage(query.message.chat.id, `🕐<b><u>Баварія.</u></b>` + 'тел.: (0932962507)(Viber)\nАдреса: проспект Ново-Баварський, 70\nПн-Сб с 08:00-12:00, Нд (вихідний)', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });
       break;
     case 'PointFence3':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Аеропорт.</u></b>` + ' тел.:(0932962509)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Проспект Гагарина, 316Б\nПн-Пт с 07:30-12:00, Нд (вихідний)', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });


       break;

     case 'PointFence4':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Південний вокзал.</u></b>` + ' тел.:(0932962504)(Viber,Telegram)\nАдреса: Котляра, 12\nПн-Сб с 07:30-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;
     case 'PointFence5':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Рогань. </u></b>` + 'тел.:(0932962505)(Viber)\nАдреса: Сергія Грицевця, 9\nПн-Сб с 07:30-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;

     case 'PointFence6':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Салтівка. </u></b>` + 'тел.:(0932962506)(Viber) (ЗНОВУ ПРАЦЮЄ)\nАдреса: Тракторобудівників, 160В\nПн-Сб с 07:30-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;

     case 'PointFence7':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Холодна Гора. </u></b>` + 'тел.:(0932962502)(Viber)\nАдреса: Полтавський шлях, 152 (Дитяча поліклініка №19 кабінет №8)\nПн-Сб с 08:00-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;
     case 'PointFence8':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Люботин. </u></b>` + 'тел.:(0932962508)(Viber)\nАдреса: Шевченка, 15 (каб. 2) (Міська поліклініка)\nПн-Сб с 08:00-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;
     case 'PointFence9':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Холодна Гора. </u></b>` + ' тел.:(0637078733)(Viber)\nАдреса: Дудинської, 1а\nПн-Сб с 07:30-12:00, Нд (вихідний)​​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;
     case 'PointFence10':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>Комунальний ринок. </u></b>` + 'тел.:(0932962513)(Viber)\nАдреса: Льва Ландау, 8\n(працює за індивідуальним графіком)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       });

       break;
     case 'PointFence11':
       bot.sendMessage(query.message.chat.id, `🕐<b><u>ХТЗ. </u></b>` + ' тел.:(932962510)(Viber)\nАдреса: пр-т. Олександрівський, 124\nПн-Сб с 07:30-12:00, Нд (вихідний)​', {
         reply_markup: {
           remove_keyboard: true
         },
         parse_mode: "HTML"
       })

       break;
     case 'PointFence12':
       bot.sendMessage(query.message.chat.id, "Мобільний телефон:\n0961912392\nПослуги: забір аналізів,\nГрафік роботи: понеділок-п’ятниця 08:30-15:00\nсубота, неділя-вихідний\n    \nПослуги :УЗД.\nМобільний телефон: 0964721455\nГрафік роботи: понеділок-п’ятниця 08:00-16:00\nсубота, неділя-вихідний\n", {
         parse_mode: 'HTML'
       });

       break;

     case 'homeorder':
     
       const now = new Date();
       let day = now.getDay();
       if (day != 0 && day != 6) {
         getWorkperiodstatus = isWorkingTime('8:00', '17:00'); //17:00
       } else if (day == 6) {
         getWorkperiodstatus = isWorkingTime('8:00', '16:00'); //16
       } else {
         getWorkperiodstatus = false;
       }


       if (getWorkperiodstatus) { 
        QuestionPhoneTriger = false;

         bot.sendMessage(query.message.chat.id, `💳 Вартість послуги в межах м.Пісочин 150 грн.\n За межі міста - ціна індивідульна в залежності від кінцевої вартості послуг таксі.\n      \n 📝 Будь-ласка, заповніть коротку анкету і наш оператор зателефонує Вам для уточнення інформації щодо місця й часу забору та кінцевої вартості даної послуги.`);

         setTimeout(() => {


           bot.sendMessage(query.message.chat.id, '❓ Ваше Ім\'я', {
               reply_markup: {
                 force_reply: true
               }
             })
             .then((sent) => {
             
               bot.onReplyToMessage(query.message.chat.id, sent.message_id, (reply) => {
                 namer = reply.text;
                 console.log(namer);

                 bot.sendMessage(query.message.chat.id, `📱Ваш телефон. Приклад: 0501234567`, {
                   reply_markup: {
                     force_reply: true // Запитуємо відповідь користувача
                   }
                 }).then((sent) => {
                 
                   bot.onReplyToMessage(query.message.chat.id, sent.message_id, (reply) => {
                     orderphone = reply.text;
                     if (orderphone.length == 10){
                     console.log(orderphone);
                     bot.sendMessage(query.message.chat.id, '💁‍♀️Де Вам зручно отримати послугу. Напишіть адресу в форматі (місто/вулиця/номер будинку/квартири)', {
                       reply_markup: {
                         force_reply: true
                       }
                     }).then((sent) => {
                

                       bot.onReplyToMessage(query.message.chat.id, sent.message_id, (reply) => {
                         homeadress = reply.text;
                         console.log(homeadress);

                         bot.sendMessage(query.message.chat.id, '🙏Коли Вам зручно отримати послугу. Напишіть бажану дату виклику і час в форматі (ДД.ММ.РРРР-ГГ.ХХ)', {
                           reply_markup: {
                             force_reply: true
                           }
                         }).then((sent) => {
                
                          
                           bot.onReplyToMessage(query.message.chat.id, sent.message_id, (reply) => {
                            QuestionPhoneTriger = false;
                             const ordertime = reply.text;
                            
                             let todayfile = new Date();
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



                             if (orderphone.length == 10) {

                               GetNameDB(query.message.chat.id).then(telegram => {
                              
                                     bot.sendMessage(query.message.chat.id, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: 0${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay}`);


                                     bot.sendMessage(query.message.chat.id, `${ordernum}\nДякую, ${telegram.FullName}. Ваше звернення збережено і передано відповідальному працівнику.\n Через деякий час з Вами звяжуться щодо уточнення деталей. `)
                                       .then(




                                         fs.appendFile('./bot_logmts.txt', `[${todayfile}]\nНадійшло звернення від кліента на забір крові на дому\n${ordernum}\nІм\'я: ${namer}\nТелефон:  ${orderphone}\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\nВказане ім\'я користувача в анкеті: ${namer}\nЗнайдене повне Ім\'я в базі даних:  ${telegram.FullName}`, (err) => {
                                           if (err) throw err;
                                           bot.sendMessage(-954144335, `Надійшло звернення від кліента на забір крові на дому\n<b>${ordernum}</b>\n     \nІм\'я: ${namer}\nТелефон: <b> ${orderphone}</b>\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\nВказане ім\'я користувача в анкеті: ${namer}\nЗнайдене повне Ім\'я в базі даних:  ${telegram.FullName}\n       \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `, {
                                             parse_mode: 'HTML'
                                           }).then(QuestionPhoneTriger = false);
                                           console.log('Дані були успішно дописані в кінець файлу');
                                         })


                                       );



                                   }



                                 )

                                 .catch(err => {
                                   trimmedStr = 'Шановний кліент, що обираєте нас.';
                                   bot.sendMessage(query.message.chat.id, `${ordernum}\nДякую, ${trimmedStr}. Ваше звернення збережено і передано відповідальному працівнику.\n Через деякий час з Вами звяжуться щодо уточнення деталей. `)

                                   bot.sendMessage(-954144335, `Надійшло звернення від кліента на забір крові на дому\n<b>${ordernum}</b>\n     \nІм\'я: ${namer}\nТелефон: <b> ${orderphone}</b>\nАдреса виклику: ${homeadress}\nБажана дата та час: ${ordertime}\n       \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `, {
                                     parse_mode: 'HTML'
                                   });

                                 });
                             } else {
                               bot.sendMessage(query.message.chat.id, 'Номер мобільного введено не вірно. Довжина номеру повинна бути 10 цифр. \n Почніть заповнення анкети замовлення спочатку - через головне меню. Дякуємо за порозуміння');
                             }






                           });



                         });   


                       });


                     }); }  else {
                      
                      bot.sendMessage(query.message.chat.id,'Помилка: Внесено некоректний номер телефону. Почніть заповнення анкети спочатку з головного меню бота, через кнопку Menu - /start ')
                      
                      console.log('Total Fuck');}


                   });


                 });


               });

             });




         }, 1000);





       } else {
         bot.sendMessage(query.message.chat.id, '😪 Ми, наразі зачинені. Звернення обробляються лише в робочий час.');
       };


       break;

     case 'monitor':
      QuestionPhoneTriger = false;
     GetTrigerObject = {
        [query.message.chat.id]: {
          SelectTriger: false,
          BurnTriger: false,
          PhoneTriger: true,
          StartScan: true
        }
      };
      // BurnTriger = false;
       //PhoneTriger = true;
  
       

       GetNameDB(query.message.chat.id)
     
         .then(telegram => {  
         // ArrayCheckAnalyze = [];
           outputdate = telegram._doc.BirthDay;
           bot.sendMessage(query.message.chat.id, `Вітаю Вас, ${telegram.FullName}\nВаш номер телефону: 0${telegram._doc.Phone}\nВаша дата народження: ${telegram._doc.BirthDay} `)
             .then(bot.sendMessage(query.message.chat.id, 'Запускаю систему моніторингу актуальних замовлень в лабораторії. Сканування змін статусу виконання існуючих досліджень проходить що 15 хв.', {
                 reply_markup: {
                   keyboard: [
                     [{
                       text: 'Зупинити моніторинг',
                       request_contact: false,



                     }, ]
                   ],
                   resize_keyboard: false

                 }
               })
               .then(data => {

                 if ((query.message.chat.id in intervals) == false) {


                   intervalId = setInterval(() => {


                     const currentTime = new Date();

                     // Встановлення бажаного часу
                     const desiredTime = new Date();
                     desiredTime.setHours(23);
                     desiredTime.setMinutes(50);

                     // Порівняння годин
                     if (currentTime <= desiredTime) {
                       console.log('Час менший або дорівнює 23:50');
                       GetPackResults(telegram._doc.BirthDay, telegram._doc.Phone, GetPeriodBack(1000), GetCurDay())
                         .then(response => {

                           if (response.ok) {
                             response.json()
                               .then(data => {
                                 console.log(data);

                                 if (data.length == 0) {
                                   bot.sendMessage(query.message.chat.id, 'У Вас не знайдено аналізів до виконання в поточному періоді.');
                                   stopInterval(query.message.chat.id);
                                 }
                                 if (ArrayCheckAnalyze.length < data.length){
                                 for (let i = 0; i < data.length; i++) {
                                   const resarray = data[i];
                                   isAlreadySent = false;
                                   for (let j = 0; j < ArrayCheckAnalyze.length; j++) {
                                     if (resarray.Docstatus == 'скасовано') {
                                       continue;
                                     }
                                     const item = ArrayCheckAnalyze[j];
                                     if (resarray.WebCode == item) {
                                       console.log(`Ці дані я вже передав: ${resarray.WebCode}`);
                                       isAlreadySent = true;
                                       //break;
                                     }
                                   }
                                   if (!isAlreadySent) {
                                     if (resarray.Docstatus == 'перевірено') {
                                       if (ArrayCheckAnalyze.length >= 0) {
                                         bot.sendMessage(query.message.chat.id, `Знайдено дослідження в статусі: ${resarray.Docstatus}. Надсилаю його Вам`)
                                           .then(ArrayCheckAnalyze.push(resarray.WebCode));
                                       }


                                       GetPdfCode(query.message.chat.id, resarray.WebCode, data.length);
                                     } else {
                                       if (ii == true) {




                                         setTimeout(() => {
                                           if (resarray.Docstatus != 'скасовано') {
                                             bot.sendMessage(query.message.chat.id, `Також знайдено  дослідження в статусі: ${resarray.Docstatus}. Очікуйте виконання`, {
                                               reply_markup: {
                                                 remove_keyboard: false
                                               }
                                             });
                                           }
                                         }, 6000);
                                         ii = false;




                                       }
                                     }

                                   }
                                 }} else {
                                  stopInterval(query.message.chat.id);}






                               });
                           }
                         });

                     } else {
                       stopInterval(query.message.chat.id);
                       console.log('Час більший за 23:59');
                       bot.sendMessage(query.message.chat.id, 'Зупинка моніторингу по завершенню календарної доби. Для продовження моніторингу перезапустіть послугу в новій календарній добі.');
                     }


                     // telegram._doc.BirthDay,telegram._doc.Phone,'01-01-2023','12-21.2023'
                   }, timepause);
                   intervals[query.message.chat.id] = intervalId;



                 } else {
                   bot.sendMessage(query.message.chat.id, `⚠	Моніторинг результатів вже запущено. ⚠	`);
                 }
               })







             );

         })
         .catch(err => {
           bot.sendMessage(query.message.chat.id, 'У мене відсутні дані про Вас. Для запуску відстеження готовності виконанння дослідженнь, потрібно отримати від Вас, дату народження і Ваш номер мобільного телефону, який Ви реєстрували в лабораторії', GetKeybNull);



         });









       break;



     case 'question':

     GetTrigerObject = {
      [query.message.chat.id]: {
        SelectTriger: true,
        BurnTriger: true,
        PhoneTriger:  true,
        StartScan: false
      }};


      QuestionPhoneTriger = true ;
       const nowq = new Date();
       let dayq = nowq.getDay();
       if (dayq != 0 && dayq != 6) {
         getWorkperiodstatus = isWorkingTime('08:00', '17:00'); //18:00
       } else if (dayq == 6) {
         getWorkperiodstatus = isWorkingTime('08:00', '16:00');
       } else {
         getWorkperiodstatus = false;
       }


       if (getWorkperiodstatus) {

       
           

             if ( userphones[query.message.chat.id]== undefined) {
              QuestionPhoneTriger = false ;
               bot.sendMessage(query.message.chat.id, `Для користування данною функцією, надайте дозвіл на отримання Вашого номера телефону, через кнопку клавіатури [Надіслати номер телефону] і потім повторно запустити з головного меню пункт 10. `, {
                 reply_markup: {
                   keyboard: [
                     [{
                       text: 'Надіслати номер телефону',
                       request_contact: true,




                       // Вмикаємо запит на надсилання контакту
                     }]


                   ],

                   resize_keyboard: false

                   // Вмикаємо автоматичне зменшення клавіатури
                 }
               });






             } else {

              bot.sendMessage(query.message.chat.id, `Вітаю Вас, поставте нам запитання або озвучте проблему з якою Ви зіткнулись в нашій лабораторії. І ми в найкоротший час звяжемося з Вами`, {
                reply_markup: {
                  force_reply: true
                }
              }).then(sent=>{
               bot.onReplyToMessage(query.message.chat.id, sent.message_id, (reply) => {
                                 if (reply.text == '/start' || reply.text == undefined || reply.text.length ==0){bot.sendMessage(query.message.chat.id,'Введено некоректний текст');}else{
                 bot.sendMessage(query.message.chat.id, `Ваше запитання відправлено оператору. Очікуйте відповідь.`);
                 //  bot.sendMessage(chatId,namer).then((sent)=>{ bot.forwardMessage(-813260675, chatId, sent.message_id); } );

                 bot.sendMessage(-954144335, `Надійшло запитання від користувача Телеграм-бота ${sent.chat.first_name}\n     \nТекст запитання:\n ${reply.text}\n Номер телефону: ${userphones[query.message.chat.id]}    \n<b>Нагадую про необхідність терміново передзвонити кліенту для опрацювання звернення.</b> `, {
                   parse_mode: 'HTML'
                 }).then(QuestionPhoneTriger = false);
               }});});
             }
          

       } else {
         bot.sendMessage(query.message.chat.id, '😪 Ми, наразі зачинені. Звернення обробляються лише в робочий час.');
       }


       break;













     default:
       break;
   }
 });