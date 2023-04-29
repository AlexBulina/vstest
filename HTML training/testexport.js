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
}


  };