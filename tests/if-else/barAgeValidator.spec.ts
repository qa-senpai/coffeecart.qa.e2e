import { test, expect } from '@playwright/test';
import { barAgeValidator } from './bar-age-validator-refactored';

test('age less than 14 - must come with parents', () => {
  const result = barAgeValidator(13);
  expect(result).toBe('Forbidden and come with your parents');
});

test('age 0 - must come with parents', () => {
  const result = barAgeValidator(0);
  expect(result).toBe('Forbidden and come with your parents');
});

test('age 14 and above but less than 18 - entry forbidden', () => {
  const result = barAgeValidator(14);
  expect(result).toBe('Forbidden');
});

test('age 17 - entry forbidden', () => {
  const result = barAgeValidator(17);
  expect(result).toBe('Forbidden');
});

test('age 18 - can enter but no alcohol', () => {
  const result = barAgeValidator(18);
  expect(result).toBe("You can go, but you can't order alcohol");
});

test('age 19 - can enter but no alcohol', () => {
  const result = barAgeValidator(19);
  expect(result).toBe("You can go, but you can't order alcohol");
});

test('age 20 - can enter but no alcohol', () => {
  const result = barAgeValidator(20);
  expect(result).toBe("You can go, but you can't order alcohol");
});

test('age 21 - can enter and order alcohol', () => {
  const result = barAgeValidator(21);
  expect(result).toBe('You can go and you can order alcohol');
});

test('age 25 - can enter and order alcohol', () => {
  const result = barAgeValidator(25);
  expect(result).toBe('You can go and you can order alcohol');
});

test('age 65 - can enter and order alcohol', () => {
  const result = barAgeValidator(65);
  expect(result).toBe('You can go and you can order alcohol');
});
