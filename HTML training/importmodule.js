const { weather,truncateTextAtComma } = require('./testexport');

weather()
  .then(data => {
    
    for (let i = 0; i < data.length; i++) {
        console.log(truncateTextAtComma(data[i].header.preferredName));
    }
  })
  .catch(error => {
    console.error(error);
    
  });


