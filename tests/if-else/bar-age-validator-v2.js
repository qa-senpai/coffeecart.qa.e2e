const age = 'NaN';

// if else if else

// else if()

// DRY
const forbiddenMessage = 'Forbidden';
const acceptMessage = 'You can go';

// менше 14 - приходь з батьками
if (age < 14) {
  console.log(`${rforbiddenMessage} and come with you parents`);
} else if (age < 18) {
  console.log(forbiddenMessage);
} else if (age >= 18 && age < 21) {
  console.log(`${acceptMessage}, but you cant order alcohol`);
} else if (age >= 21) {
  console.log(`${acceptMessage} and you can order alcohol`);
} else {
  console.log('pls provide valid document');
}

console.log('End');
