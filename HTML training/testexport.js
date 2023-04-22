module.exports = {
    weather: async function() {
     const response = await fetch('https://www.ncei.noaa.gov/access/homr/services/station/search?headersOnly=true&country=ukraine')
     const data = await response.json() ;
      
      return new Promise((resolve,reject)=>{

        resolve (data.stationCollection.stations);

      }); 
      
       
    },

    truncateTextAtComma: function (text) {
    const words = text.split(',');
    return words[0];
  }


  };