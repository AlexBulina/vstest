const ExcelJS = require('exceljs');
const request = require('request');
const fs = require('fs');
const url = ['http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/dictionary/groups',
'http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/dictionary/analyzes','http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/dictionary/packages'];
var today = new Date();
var now = today.toLocaleDateString('uk-UA');
var sheetname = now + '  Прайс MTS clinic';
const workbook = new ExcelJS.Workbook();

const worksheet = workbook.addWorksheet(now + '  Прайс MTS Clinic');

worksheet.columns = [
  { header: 'п/п', key: 'id', width: 8 },
  { header: 'Ціна', key: 'price', width: 16,style: {alignment: {horizontal: 'center' }} },
  { header: 'Аналіз', key: 'name', width: 70 },
  { header: 'Код', key: 'numcode', width: 15 },
  {header: 'Термін', key: 'term',width: 15,style: {alignment: {horizontal: 'center'}, bold: true} },
  { header: 'Група дослідження', key: 'value', width: 60 }
 
];
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

Promise.all(url.map(url => fetch(url,{ 

    headers: {
        'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
        }



}))) // виконуємо всі запити одночасно і повертаємо масив обіцянок
  .then(responses => Promise.all(responses.map(response => response.json()))) // обробляємо всі обіцянки відповідей, повертаючи обіцянки з JSON даними
  .then(data => {
    // обробка даних
    //console.log(data[0][0].groups);
   
     

    data[0][0].groups.forEach((item)=>{
    
       // console.log(item.name);
         data[1].forEach((item2)=>{
        if (item.id == item2.groupId){
          //console.log(item2.name);
        }
    
     });});

     data[2].forEach((item)=>{

      console.log('                      ' + item.name);
      item.analyzes.forEach((itempak)=>{
        //console.log(itempak.code); 
        data[1].forEach((item2)=>{
          if (itempak.code == item2.code && item2.code != null ){
            console.log(item2.name);
          }
      
        });
     });
    
    
    
  
  })
  .catch(error => console.log(error));
  
  });