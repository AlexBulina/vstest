// const Person = {
//   name: 'Maxim',
//   Alet: function Alerta() {
//     console.log(`Тіду ${this.name}`);
//   }
// };

// // // Person.prototype.Test = function(){console.log(`Mumu`)};
// // Object.prototype.sayHello = function() {
// //   console.log(`Привіт, мене звуть ${this.name}`);
// // };

// var person = Object.create(Person);
// person.name = 'John';
// person.sayHello(); // Виводить: Привіт, мене звуть John

// const Lena = Object.create(Person);
// Lena.name = 'Lenasik';
// Lena.sayHello(); // Виводить: Привіт, мене звуть Lenasik
// Person.sayHello(); // Виводить: Привіт, мене звуть Maxim
// Lena.Alet(); // Виводить: Тіду Lenasik



// // Date.prototype.DateMod = function(userdate)

// //  {
  
  
  
// //   try {
// //     const parts = userdate.split('/');
// //   this.setFullYear(parts[2]);
// //   this.setMonth(parts[1]);
// //   this.setDate(parts[0]);
// //   const year = this.getFullYear().toString();
// //   const month = (this.getMonth()).toString().padStart(2, '0');
// //   const day = this.getDate().toString().padStart(2, '0');

// //   const outputdate = year + '-' + month + '-' + day;
// //   return outputdate;}
// //   catch(e){

// //     console.log(e + ' Помилка');
// //     return false;
// //   }
// // };

// // // Приклад використання
// // const date = new Date();

// // const modifiedDate = date.DateMod('06/08/1982');
// // console.log(modifiedDate);



// // const person = {
// //   name: 'John',
// //   sayHello: function() {
// //     console.log(`Hello, ${this.name}!`);
// //   }
// // };

// // const sayHello = person.sayHello.bind(person);
// // sayHello(); // Вывод: "Hello, John!"


// // Це функцыя конструктор
// function Car(make, model) {
//   this.make = make;
//   this.model = model;
// }
// //оглошуємо прототит функції і добавляємо метод
// Car.prototype.start = function() {
//   console.log(`Starting the ${this.make} ${this.model}`);
// };
// //створюємо норвий обєкт Car з аргументами
// const myCar = new Car('Toyota', 'Camry');


// const startCar = myCar.start.call(myCar);
// //startCar(); // Вывод: "Starting the Toyota Camry"


function GetPackResults(outputdate,phone,newaca,newac){ return new Promise((resolve, reject) => {
  fetch(`http://195.211.240.20:11998/KDG_SIMPLE_LAB_API/MedTech/custom/GetPatientExams?BurnDate=${outputdate}&PhoneNumber=${phone}&BegDate=${newaca}-01-01&EndDate=${newac}-31-12`,{
    headers: {
    
    'Authorization': 'Basic TWVkVGVjaHxNZWRUZWNoV2ViOk1lZFRlY2gxMjMh'
    }
    })

 .then(response => resolve(response))
    .catch(err => reject(err));

 
    
  
   

  });

  

}

GetPackResults('1982-08-06','506158601','2023','2023')
.then(response => response.json())
.then(data => console.log(data));



  