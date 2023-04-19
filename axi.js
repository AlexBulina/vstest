
const ExcelJS = require('excelj');
const request = require('request');
const fs = require('fs');
//const { count } = require('console');
let token ;
let analyze; 
let grouparray = [];
// создаем новый объект `Date`
var today = new Date();

 // получаем дату и время
var now = today.toLocaleDateString('uk-UA');
var sheetname = now + '  Прайс Міламед';
const workbook = new ExcelJS.Workbook();

const worksheet = workbook.addWorksheet(now + '  Прайс Міламед');

worksheet.columns = [
  { header: 'п/п', key: 'id', width: 8 },
  { header: 'Ціна', key: 'price', width: 16,style: {alignment: {horizontal: 'center' }} },
  { header: 'Аналіз', key: 'name', width: 70 },
  { header: 'Код', key: 'numcode', width: 15 },
  {header: 'Термін', key: 'term',width: 15,style: {alignment: {horizontal: 'center'}, bold: true} },
  { header: 'Група дослідження', key: 'value', width: 60 }
 
];

function get_tocken(){

  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const data = "grant_type=refresh_token&refresh_token=M.R3_BL2.-CWvDq!b5pIqVW27pwArBdIenpEY*qgsN3XwrIIfWytHO3UjD1cCvN2kB9whwU9!aE050DwuF29jyXLYQMFcDmTd8s!scWdinoWcSh1D4yT5NEUyp0ZQxYZ!w9*hHj899Npa7fW8OSIecK2b2tRDCKZ2Twmj6gQDimec0*uii7i2YmMLeWoX9uTxYSjEAfiOCmRO8sBvvsJB4ccZU!jmiMgo6VCJjOHAyU4DX663qbfhc6mjdTNr5Xgz2ABUx9tLcGNMq3lWf9cn73u!788qM9qsExu2r8oyU!1wwn4XPViSVwZxoxapfcv77yj4vImHZ7f3nkLc11VagzKpuZ!YTnK4%24&client_id=dd382b86-9133-4236-960f-ca2c2ca75484&client_secret=6Sv8Q~Auk_oiKoMrr8Z.snr9Ba-JQZXzOXXZmb4S&=";
  
   
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  })
  .then(response => {
    if (response.ok) {
      // Якщо відповідь успішна, отримуємо дані з відповіді
      return response.json();}
    })
      .then(data => {
    // Обробляємо дані, які повернув сервер
   const token1 =  data.access_token;
    token = token1;
  })
  .catch(error => {
    console.error('Помилка:', error);
  });





}
get_tocken();



  function uploadfiletoOndrive(){
  
 
   

const filename = "actualpricemilamed.xlsx";
const filePath = 'C:\\Milamed request analyze\\actualpricemilamed.xlsx';



fs.readFile(filePath, (err, data) => {
  if (err){  }

  const url = "https://graph.microsoft.com/v1.0/me/drive/root:/Documents/" + filename + ":/content";
  const headers = {
    "Authorization": "Bearer " + token,
    "Content-Type": "application/octet-stream"
  };

  const options = {
    method: "PUT",
    headers: headers,
    body: data
  };

  request(url, options, (error, response, body) => {
    if (error) throw error;

    console.log("File uploaded successfully (Ondrive folder over access token).");
  });
});  }



  function addDataToWorksheet(idrow,price,groups,codenum,period,codename,rbold = 0){
    if (rbold == 1){
   var row = worksheet.addRow({id: idrow,price: price, name: groups,numcode: codenum, term:period ,value: codename });
   row.font = { bold: true ,
                size: 13};

                row.fill = {

                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {argb: 'E0E0E0'}


                };
           
    }
      else if (rbold == 2){

        const row = worksheet.addRow({id: idrow,price: price, name: groups,numcode: codenum, term: period,value: codename});
        row.font = { bold: true ,
                     size: 13};
     
                     row.fill = {
     
                         type: 'pattern',
                         pattern: 'solid',
                         fgColor: {argb: 'C0C0C0'}
     
     
                     };
                   

      }

   else{
    const row = worksheet.addRow({id: idrow,price: price, name: groups,numcode: codenum, term: period,value: codename}); 
   
    
  
    
}

  }
  function getGroupStatus(activegroup){
    let i = 0;

 
analyze.forEach(function(item1) {

 

if ((activegroup.id == item1.groupId && item1.prices.main != null) && (activegroup.active) && (item1.active ))
 {
   i++;

} 
if (activegroup.parent == 0 && activegroup.active != false ){i++;}
}); 

if (i != 0 ){return true; } else {return false;}

  }


 downloadPdf();
  
  
  function downloadPdf() {
   let tokenlist = 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='; 
    //Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ==    //milamed 
    //Basic TWlsYW1lZHx3ZWJhaGFwaXQ6MjAyMw==    //Агапіт      


const url = 'http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed/dictionary/groups';
const urlanal = 'http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed/dictionary/analyzes';
const Packagelist = 'http://127.0.0.1:9998/KDG_SIMPLE_LAB_API/Milamed/dictionary/packages';
    



fetch(urlanal,{
headers: {
'Authorization': tokenlist
}
})
.then(response => response.json())
.then (data2 => {
analyze = data2;

} )  ;    
   
        
let codelink = url;
fetch(codelink,{
headers: {
'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
}
})
.then(response => response.json())
.then(data => {
const name = data;
const name2 = data[0].groups;
let i = 1;
// item1 - це обєкт аналізів

//item2 це обєкт груп

name2.forEach(function(item2){ let analyzergroup = 0;
  // тут  треба пропрацювати варіант коли група активна а аналізи в ній ні
    const statusGroup = getGroupStatus(item2);
if (item2.active && statusGroup == true){
  
    
  if (item2.id != 6892538 && item2.id != 6879318){ 

  //addDataToWorksheet(' ','',' ',' ',' ',0);
  addDataToWorksheet(' ',' ',item2.name,'',' ',' ',1);
  //-----------------------

  
 
analyze.forEach(function(item1) {

 

if ((item2.id == item1.groupId && item1.prices.main != null) && (item2.active) && (item1.active ))
 {

//console.log(item1.name + '   ' + item2.name);  
addDataToWorksheet(i,item1.prices.main + ' грн',item1.name,'код   ' +  item1.code,item1.term,item2.name,0); 
analyzergroup ++;
i++;
}

}); 

   
}}  //  тут закриваючі добавити



// кінець іф
// перевірка на підгрупи потрібна level 3
if (item2.groups != 0 ) {

  
  item2.groups.forEach(function(sub){ 
      // Виключення з пошуку певних панелей на стороні лабораторії 
      if (sub.id != 6892542 && sub.id != 6958245 && sub.id != 6892544 && sub.id != 6879318 && sub.id != 6892545 && sub.id != 6892539 && sub.id !=6892540 && sub.id !=6892543 && getGroupStatus(sub)){

    addDataToWorksheet(' ',' ' ,'    '+sub.name,'',' ',' ',1);
   
      analyze.forEach(function(sub1){

        if (sub1.groupId == sub.id && sub1.prices.main != null && sub1.prices.main != 0){

          
        addDataToWorksheet(i,sub1.prices.main + ' грн','     '+sub1.name,'код   '+ sub1.code,sub1.term,'',0); 
            i++;
            
//---------------------------------------- Перевірка на 3 рівень вкладеності----


          if (sub.groups != 0 && getGroupStatus(sub)){
              
              sub.groups.forEach(function(sub3){
                addDataToWorksheet(' ',' ','                            '+sub3.name,' ',' ',' ',1);
                  
                  analyze.forEach(function(subanal){

                      if (sub3.id == subanal.groupId && subanal.prices.main != null){
                        addDataToWorksheet(i,subanal.prices.main + ' грн','     '+subanal.name,'код   '+ subanal.code,subanal.term,'',0); 
                        i++;


                      }



                  });




              });

            



          }  



//--------------------------------------------3-------end



        }


      });

      }
// тут кінець іфа

  });
  
  
  
}   
    



 



});


 
 workbook.xlsx.writeFile('C:\\Milamed request analyze\\actualpricemilamed.xlsx')
.then(function() {
 console.log('File saved.' + grouparray);


}); 
    
 

//Get на пакети
 const panal = analyze;
fetch(Packagelist,{
  headers: {
  'Authorization': 'Basic TWlsYW1lZHx3ZWI6ZmRiNEshSTN5WQ=='
  }
  })
  .then(response => response.json())
  .then (data3 => {
  console.log(data3);
    data3.forEach(function(item3)
    {if (item3.active )
   {  
      if (item3.active){
        name2.forEach(function(packgroup){

           if(item3.groupId == packgroup.id && item3.prices.main != null) {

            addDataToWorksheet(i,item3.prices.main + ' грн',item3.name,'код '+item3.code,item3.term,packgroup.name,2);
            i++; //!!!!!!!!!!!!!!!!!!
               if (item3.analyzes != null){  
              item3.analyzes.forEach(function(last){
              console.log(last.code);
              
                
  


//тут прописуємо циклом привязку коду аналізів пакету до назви аналізу з Json
      

panal.forEach (function(item9){

  if (last.code == item9.code){

    addDataToWorksheet(' ',' ','                \u2022      ' +item9.name,item9.code,'','Аналізи в (' + item3.name+')',0);

  }});});  } 

        }
        
      else if (packgroup.groups != 0){
          
        packgroup.groups.forEach(function(levelg){

         
          if(item3.groupId == levelg.id && item3.prices.main != null){

            addDataToWorksheet(i,item3.prices.main + ' грн',item3.name,'код '+item3.code,item3.term,levelg.name,2);
            i++;
               if (item3.analyzes != null){  
              item3.analyzes.forEach(function(last){
              console.log(last.code);
              
                
  


//тут прописуємо циклом привязку коду аналізів пакету до назви аналізу з Json
      

panal.forEach (function(item9){

  if (last.code == item9.code){

    addDataToWorksheet(' ','  ','                \u2022      ' +item9.name,item9.code,'','Аналізи в (' + item3.name+')',0);

  }});});  } 

        }



        });





      }
      
        
      
      
      
      
      
      
      
      });
        
      
      }
            
           


  }
 });


  workbook.xlsx.writeFile('C:\\Milamed request analyze\\actualpricemilamed.xlsx')
  .then(function() {
   console.log('File saved.');
   
  });
  


    
 } ) ; 


});
// .catch(error => console.error(error));}

}















setTimeout(() => {
  uploadfiletoOndrive();
 }, 7000);






     