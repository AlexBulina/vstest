// Є залежність від бібліотеки fs (npm install fs).
// Для виконання цього скрипту треба Node.js не нище 18 версії (Використання нативного fetch підтримується тыльки з 18 версії)
// Цей скрип має виконуватись щоденно десь о 2 ночі. До цього часу йде оновлення файлу зі сторони лабораторії
const fs = require('fs');
let token ;



async function get_token() {
  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const data = "grant_type=refresh_token&refresh_token=M.R3_BL2.-CWvDq!b5pIqVW27pwArBdIenpEY*qgsN3XwrIIfWytHO3UjD1cCvN2kB9whwU9!aE050DwuF29jyXLYQMFcDmTd8s!scWdinoWcSh1D4yT5NEUyp0ZQxYZ!w9*hHj899Npa7fW8OSIecK2b2tRDCKZ2Twmj6gQDimec0*uii7i2YmMLeWoX9uTxYSjEAfiOCmRO8sBvvsJB4ccZU!jmiMgo6VCJjOHAyU4DX663qbfhc6mjdTNr5Xgz2ABUx9tLcGNMq3lWf9cn73u!788qM9qsExu2r8oyU!1wwn4XPViSVwZxoxapfcv77yj4vImHZ7f3nkLc11VagzKpuZ!YTnK4%24&client_id=dd382b86-9133-4236-960f-ca2c2ca75484&client_secret=6Sv8Q~Auk_oiKoMrr8Z.snr9Ba-JQZXzOXXZmb4S&=";
//  параметер body client_secret дійсний до 10.03.2025
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  });
  
  if (response.ok) {
    const data = await response.json();
    const token1 = data.access_token;
    token = token1;
    return token1;
  } else {
    console.error('Помилка:', response.statusText);
  }
}

get_token().then(() => {
    
  const fileName = "actualendoscope.docx"; // імя файлу
  const accessToken = token; // авторизаційний токен

  // Запит на сервер, щодо отримання id файлу по метаданним 
  const url = `https://graph.microsoft.com/v1.0/drive/root/search(q='${fileName}')`;
  
 
  fetch(url, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Помилка пошуку файлу");
    }
  })
  .then(data => {
    if (data.value.length > 0) {
      const fileId = data.value[0].id;
      console.log("Унікальний ідентифікатор файлу на сховищі Ondrive: ", fileId);
      const urldownload = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`;
      // запит на сервер. отримання бінарного файлу згвідно ID файлу отриманого раніше
      fetch(urldownload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Помилка завантаження файлу');
          }
          return response.arrayBuffer();
        })
        .then(arrayBuffer => {
          const buffer = Buffer.from(arrayBuffer);
          //тут прописуємо шлях до збереження файлу на локальному сервері
          fs.writeFileSync('C:\\Milamed request analyze\\actualpricemilamed.xlsx', buffer, 'binary'); // тип запису як binary
          console.log('Файл actualendoscope_ondrive.xlsx - успішно збережено!');
        })
        .catch(error => {
          console.error(error);
        });




    } else {
      console.log("Файл не знайдено");
    }
  })
  .catch(error => {
    console.log(error);
  });




 
});



