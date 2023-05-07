const mongoose = require('mongoose');
const URI = 'mongodb+srv://Ashway:MxLANHy9Nza2cbhX@tbot.m2fi1tc.mongodb.net/MTSTEST?retryWrites=true&w=majority';
let nama;


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

 isdbName: async function isdbName(chatid,phonenumber,burndate){
console.log(typeof(phonenumber));


  const Schema = mongoose.Schema;
  mongoose.connect(URI).then((res) => {console.log(res);}
   
  )
  .catch((error) => console.log(error));
  const chatidSchema = new Schema ({
     "ChatId": Number,
     "FullName" : String,
     "Phone" : Number,
    "BirthDay": String});
  
  
  const sampleSchema = new Schema({
     "Повна назва": String,
     
      "Контактні дані:Тел": {
       "1": Number
     },
     "Дата народження": String, 
        "Стать": String,
    
    
    
   });
  

   //const Telegram = mongoose.model('telegrams',chatidSchema);
  const Post = mongoose.model('mtsbaseckient1',sampleSchema);


  try {
    const samples = await Post.find({"Контактні дані:Тел": {
      "1": phonenumber
    }}); // Шукаємо записи в бд по номеру 
  
    if (samples && samples.length > 0) {
      console.log(samples[0]["Повна назва"]); 
      const nameclient = samples[0]["Повна назва"];
     


      Telegram.findOne({ "ChatId": chatid}).then(function(telegram) {
        if (telegram) {
          console.log('Документ найден:', telegram);
        } else {
          console.log('Документ не найден');

          const newTelegram = {
                   ChatId: chatid,
                   FullName: nameclient,
                   Phone: phonenumber,
                   BirthDay : burndate
             };

          mongoose.connection.collection('telegrams').insertOne(newTelegram).then(console.log('Дані добавлено'));
          //mongoose.connection.close();
        }
      }).catch(function(error) {
        console.error('Ошибка при поиске документа:', error);
      });
    
                
      mongoose.connection.deleteModel('mtsbaseckient1');
      //mongoose.connection.close();
      return nameclient;
    } else {
      console.log('Запис не знайдено в базі даних');
      mongoose.connection.deleteModel('mtsbaseckient1');
      //mongoose.connection.close();
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }

 },



 url : 'http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech',
 token : '510200054:AAEEZ21fwwx8GPA06ATSw5fzzddqT1rYdiA',   //<-test token  //5949157258:AAENmhmwtyhoYjieQCWcZIAP3WYY6cn4_b4  MTS
 basicauth: 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh',
 savepath: './testexport.js',

 


 GetNameDB : function GetNameDB(chatId){
  
  return new Promise((resolve, reject) => {
    mongoose.connect(URI).then((res) => {
      console.log(res);

      Telegram.findOne({ "ChatId": chatId }).then(function(telegram) {
        if (telegram) {
          //console.log('Документ найден:', telegram.FullName);
          resolve(telegram);
          mongoose.connection.close();
          
        } else {
          //console.log('Документ не найден');
          mongoose.connection.close();
          reject('Документ не знайдено');
        }
      });
    });
  });
},

DateMod: function DateMod(origdate){

  const parts = origdate.split('/');
  var year = parts[2];
  var month = parts[1];
  var day = parts[0];
  
  
  let outputdate = year + '-' + month + '-' + day;
  return outputdate;


  
},
GetPackResults:function GetPackResults(outputdate,phone,newaca,newac){
  
  return new Promise((resolve, reject) => {
  fetch(`http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}-01-01&EndDate=${newac}-12-31`,{
    headers: {
    
    'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
    }
    })
    .then(response => resolve(response))
    .catch(err => reject(err));

  });

}













  };

  const Schema = mongoose.Schema;
  const chatidSchema = new Schema ({
    "ChatId": Number,
    "FullName" : String
  });
  

  const Telegram = mongoose.model('telegrams',chatidSchema);


  