const PARENTS_REQUIRED_AGE = 14;
const ENTRY_AGE = 18;
const ALCOHOL_AGE = 21;

const forbiddenMessage = 'Forbidden';
const acceptMessage = 'You can go';

export function barAgeValidator(age) {
  if (age < PARENTS_REQUIRED_AGE) {
    return `${forbiddenMessage} and come with your parents`;
  }

  if (age < ENTRY_AGE) {
    return forbiddenMessage;
  }

  if (age < ALCOHOL_AGE) {
    return `${acceptMessage}, but you can't order alcohol`;
  }

  return `${acceptMessage} and you can order alcohol`;
}
