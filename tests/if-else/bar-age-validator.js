// our code

/*
    Менше 18 -	Вхід заборонено
    Від 18 включно до 21 невключно	- Вхід дозволено, алкоголь не продають
    Від 21 включно	- Вхід і замовлення дозволені
*/

// if else statement

// true, false (1, 0)

// = assignment
// == comparison

// console.log(age == 19);

// > - більше
// < - менше
// <= - менше або дорівнює
// >= - менше або дорівнює
// && - обʼєдувати дві або більше умов

console.log('Start');

const age = 20;
// DRY

export function barAgeValidator(age) {
  const forbiddenMessage = 'Forbidden';
  const acceptMessage = 'You can go';

  // менше 14 - приходь з батьками
  if (age < 14) {
    console.log(`${forbiddenMessage} and come with you parents`);
  }

  // Менше 18 -	Вхід заборонено
  if (age < 18) {
    console.log(forbiddenMessage);
  }

  //  Від 18 включно до 21 невключно	- Вхід дозволено, алкоголь не продають
  if (age >= 18 && age < 21) {
    console.log(`${acceptMessage}, but you cant order alcohol`);
  }

  // Від 21 включно	- Вхід і замовлення дозволені
  if (age >= 21) {
    console.log(`${acceptMessage} and you can order alcohol`);
  }
}
