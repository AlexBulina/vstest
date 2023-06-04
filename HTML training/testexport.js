const mongoose = require('mongoose');
const URI = 'mongodb+srv://Ashway:MxLANHy9Nza2cbhX@tbot.m2fi1tc.mongodb.net/MTSTEST?retryWrites=true&w=majority';
let nama,FullNameGet;
const webappurl = 'https://www.mtsclinic.com/';
let newTelegram;
const intervals = {};

Array.prototype.sumArray = function sumArray(array) {
  let sum = 0;
  array.forEach((element) => {
    sum += element;
  });
  return sum;
};
Date.prototype.DateMod = function(userdate)

{
  
 try {
   const parts = userdate.split('/');
 this.setFullYear(parts[2]);
 this.setMonth(parts[1]);
 this.setDate(parts[0]);
 const year = this.getFullYear().toString();
 const month = (this.getMonth()).toString().padStart(2, '0');
 const day = this.getDate().toString().padStart(2, '0');

 const outputdate = year + '-' + month + '-' + day;
 return outputdate;}
 catch(e){

   console.log(e + ' Помилка');
   return false;
 }
};

function convertDatePoint(dateString) {
  const parts = dateString.split('-'); // Split the date string into parts
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  const convertedDate = `${day}.${month}.${year}`;
  
  return convertedDate;
}

module.exports = {
  
    weather: async function(cityname) {
      try {

 const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=5&appid=29ebfe90e8a43cfb861bd842ed6ca6f8`)
     const data = await response.json() ;
      
      return new Promise((resolve,reject)=>{

        resolve (data);

      }); 


      } catch(e){

        console.log(e + 'Помилка');
      }
    
      
       
    },

    truncateTextAtComma: function (text) {
    const words = text.split(',');
    return words[0];
  },
  
  randomize:  function randomize() {
  const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;
  return `Замовлення № ${randomNumber}`;
},
isWorkingTime: function isWorkingTime(start, end) {
  const now = new Date();
  const startTime = new Date(now.toDateString() + " " + start);
  const endTime = new Date(now.toDateString() + " " + end);

  if (endTime < startTime) {
    // If end time is before start time, assume it's for the next day
    endTime.setDate(endTime.getDate() + 1);
  }

  return now >= startTime && now <= endTime;
},

 isdbName: async function isdbName(chatid,phonenumber,burndate,startdate,finishdate){
//console.log(typeof(phonenumber));
return new Promise(async (resolve, reject) => {


   

 
  
  
  
  

   //const Telegram = mongoose.model('telegrams',chatidSchema);



  try {
    
  

    await mongoose.connect(URI); // Connect to MongoDB

    const Schema = mongoose.Schema;
    const chatidSchema = new Schema({
      ChatId: Number,
      FullName: String,
      Phone: Number,
      BirthDay: String
    });
    const samples = await Post.find({"Контактні дані:Тел": {
      "1": phonenumber
    },"Дата народження": convertDatePoint(burndate)}); // Шукаємо записи в бд по номеру 
  
 

    if (samples && samples.length > 0) {
      console.log(samples[0]["Повна назва"]); 
      const nameclient = samples[0]["Повна назва"];
     


      Telegram.findOne({ "ChatId": chatid}).then(function(telegram) {
        if (telegram) {
          console.log('Документ знайдено:', telegram);

        } else {
          console.log('Документ не знайдено chatid baza');

          const newTelegram = {
                   ChatId: chatid,
                   FullName: nameclient,
                   Phone: phonenumber,
                   BirthDay : burndate
             };

          mongoose.connection.collection('telegrams').insertOne(newTelegram).then(console.log('Дані добавлено') );
         // mongoose.connection.close();
          resolve(nameclient);
        }
      }).catch(function(error) {
        console.error('Ошибка при поиске документа:', error);
      });
    
                
      //mongoose.connection.deleteModel('mtsbaseckient1');
      //mongoose.connection.close();
     
    } else {
      console.log('Запис не знайдено в базі даних.Починаю пошук альтернативним шляхом'); 
     // mongoose.connection.deleteModel('mtsbaseckient1');
      fetch(`http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/custom/GetPatientExams?BurnDate=${burndate}&PhoneNumber=${phonenumber}&BegDate=${startdate}&EndDate=${finishdate}`,{
        headers: {
        
        'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
        }
        })
      .catch( err=> { console.log(`Невірний формат дати народження.${err}`);})     
      .then(response => response.json())
      .then(data => 
        { if (data.length != 0) { FullNameGet = data[0].FullName;} 
          Telegram.findOne({ "ChatId": chatid}).then(function(telegram) {
            if (telegram) {
              console.log('Документ знайдено:', telegram);
     
            } else {
              console.log('Документ не знайдено по chatid');
                  
              const newTelegram = {
                       ChatId: chatid,
                       FullName: FullNameGet,
                       Phone: phonenumber,
                       BirthDay : burndate
                 };
                
                       
               if (newTelegram.FullName == undefined || newTelegram.BirthDay == undefined || newTelegram.Phone==undefined){
                console.log('Запис в базу відмінено. Не всі дані в наявності');
              reject('Запис в базу відмінено.');
            }
               else{mongoose.connection.collection('telegrams').insertOne(newTelegram).then(console.log('Дані добавлено'));
         
              
         
               resolve(FullNameGet);}
         
                }}
        );});
  
        

     



      //mongoose.connection.close();
      
    }
  
  } catch (err) {
    console.error(err);
    
  }
});
 },



 url : 'http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech',
 
 token : '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA',   //<-test token  //5949157258:AAENmhmwtyhoYjieQCWcZIAP3WYY6cn4_b4  MTS
 basicauth: 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh',
 savepath: './testexport.js',
 InlineKB: {

  reply_markup: {  
    inline_keyboard: [
      [{ text: '1.⏳ Отримати результати аналізів по коду', callback_data: 'button1' }],
      [{ text: '2. 🔍 Запитати отримання всіх результатів за весь час', callback_data: 'button2' }],
      [{ text: '3. 🕵️‍♂️ Як,нас знайти', callback_data: 'button3' }],
      [{ text: '4. 🏨 Наші філії', callback_data: 'button4' }],
      [{ text: '5. 📋 Актуальний прайс-лист лабораторії MTS Clinic', callback_data: 'button5' }],
      [{ text: '6. 📋 Прайс-листи медичного центру MTS Clinic', callback_data: 'button6' }],
      [{text: '7.💻 Перейти на офіційний сайт', web_app:{url: webappurl,} }],
      [{text: '8.🚨 Виклик на дім (Забір крові)',callback_data: 'homeorder'}],
      [{text: '9.📡 Монітор виконання аналізу',callback_data: 'monitor'}],
      [{text: '10.❓ Поставити запитання лабораторії',callback_data: 'question'}]
    ],
  
    remove_keyboard:true}
},

ButtonStartMenu:{ reply_markup: {  
  keyboard: [
   [ {
    text: `Номер телефону добавлено`,
    request_contact: true}],
    
    
    
    
     // Вмикаємо запит на надсилання контакту
 [`Дата народження`]
    
    
  ],resize_keyboard:true

}},

GetKBMonitor: {reply_markup: {  
  keyboard: [
   [ {
    text: 'Номер телефону',
    request_contact: true,
    
    
    
    
     // Вмикаємо запит на надсилання контакту
}, `Дата народження` ]
    
    
  ],resize_keyboard:true

}},

 


 GetNameDB : function GetNameDB(chatId){
  
  return new Promise((resolve, reject) => {
    mongoose.connect(URI).then((res) => {
      //console.log(res);

      Telegram.findOne({ "ChatId": chatId }).then(function(telegram) {
        if (telegram) {
          console.log('Документ найден:', telegram.FullName);
          resolve(telegram);
         // mongoose.connection.close();
          
        } else {
          //console.log('Документ не найден');
         // mongoose.connection.close();
          reject(false);
        }
      });
    });
  });
},

GetPackCount: function GetPackCount(outputdate,phone,newaca,newac){







},
GetPackResults:function GetPackResults(outputdate,phone,newaca,newac){ return new Promise((resolve, reject) => {
  fetch(`http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}&EndDate=${newac}`,{
    headers: {
    
    'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
    }
    })

 .then(response => resolve(response))
    .catch(err => reject(err));

 
    
  
   

  });

  

},
GetCurDay: function GetCurDay(){


  let today = new Date();
  let year = today.getFullYear();
  let month = ('0' + (today.getMonth() + 1)).slice(-2);
  let day = ('0' + today.getDate()).slice(-2);
  let formattedDate =  year + '-' + month + '-' + day;
  
  //console.log(formattedDate);
  return formattedDate;

},


GetPeriodBack: function GetPeriodBack(dayback){

  let today = new Date();
  let pastDate = new Date(today);
  pastDate.setDate(today.getDate() - dayback);
  
  let year = pastDate.getFullYear();
  let month = ('0' + (pastDate.getMonth() + 1)).slice(-2);
  let day = ('0' + pastDate.getDate()).slice(-2);
  let formattedDate = year + '-' + month + '-' + day;
  
 //console.log(formattedDate);
  return  formattedDate;
  






}














  };

  const Schema = mongoose.Schema;
  const chatidSchema = new Schema ({
    "ChatId": Number,
    "FullName" : String
  });
  const sampleSchema = new Schema({
    "Повна назва": String,
    
     "Контактні дані:Тел": {
      "1": Number
    },
    "Дата народження": String, 
       "Стать": String,
   
   
   
  });
  const Post = mongoose.model('mtsbaseckient1',sampleSchema);
  const Telegram = mongoose.model('telegrams',chatidSchema);


  