const { weather,randomize} = require('./testexport');
let globalgetweasher = {};
 weather('Ужгород')
  .then(data => {
    const getweasher = {
      latitude: data[0].lat,
      longitude: data[0].lon,
      city: data[0].local_names.uk,
      appid : '29ebfe90e8a43cfb861bd842ed6ca6f8'
    };
    globalgetweasher = getweasher;
   return getweasher; })
  .catch(error => {
    console.error(error);
    
  })
  .then (  getweasher =>  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${getweasher.latitude}&lon=${getweasher.longitude}&appid=${getweasher.appid}&units=metric&lang=ua`))
      .then(response => response.json())
      .then(data => {
         const now = new Date();
         const hours = now.getHours();
         const day = now.getDay();
         console.log(hours);
         
           switch (day) {

            case 0:
            
            console.log('Сьогодні неділя - медичний центр Міламед - зачинено')
            break;

            case 1:
            case 2:
            case 3:
            case 4:
            case 5:  
              if (hours <= 19 && hours >=8 ) {
            console.log('Зараз ' + Math.ceil(data.main.temp)+ ' °С в місті ' + globalgetweasher.city  + ' \nВідчувається як:  ' + Math.round(data.main.feels_like) + '\n' + ((data.weather[0].description).charAt(0).toUpperCase()+ (data.weather[0].description).slice(1) ));
              } else {    console.log('Ми наразі зачинені. Але, Ви можете скористатись нашими онлайн послугами.') ;         }
            break;

            



           }


        
      
      
           } );


    
      
         

   
  
  
 

