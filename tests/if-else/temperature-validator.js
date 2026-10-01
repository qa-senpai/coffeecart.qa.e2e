// = assignment
// == comparison

// console.log(age == 19);

// > - більше
// < - менше
// <= - менше або дорівнює
// >= - менше або дорівнює
// && - обʼєдувати дві або більше умов

// if(){}

// Менше 10 градусів — куртка.
// Більше 10 — светр.

const temperature = 10;
const mode = 'fun';

if (mode == 'fun') {
  if (temperature == 10) {
    console.log('Одягни помаранчеві труси у ромашку');
  }

  if (temperature < 10) {
    console.log('Одягни куртку');
  }

  if (temperature > 10) {
    console.log('Одягни светр');
  }
}

if (mode == 'serious') {
  if (temperature <= 10) {
    console.log('Одягни куртку');
  }

  if (temperature > 10) {
    console.log('Одягни светр');
  }
}

const obj1 = {};
const obj2 = {};

const arr1 = [];
const arr2 = [];

console.log(obj1 == obj2);
console.log(arr1 == arr2);

console.log(18 == '18'); // true
console.log(18 === '18'); // false

console.log(18 === 18); // true

// не дорівнює
console.log(18 !== 18); // false
console.log(18 !== '18'); // true
console.log(18 != '18'); // false

// 1 - true; 0 - false
console.log(0 == false); // true
console.log(0 === false); // false

console.log(1 == false); // false
console.log(1 !== false); // true

console.log(1 !== true); // true
console.log(1 != true); // false

console.log(1 == true); // true
console.log(1 === true); // false

const apiResponse1 = 121515;
const apiResponse2 = Number('fasfasfa'); // NaN

if (apiResponse1 === apiResponse2) {
  console.log('Вони рівні');
}
