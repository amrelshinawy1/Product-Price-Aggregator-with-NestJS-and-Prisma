// src/mockApis.ts
import { faker } from '@faker-js/faker';

export const generateProduct = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  currency: 'USD',
  availability: faker.datatype.boolean(),
  lastUpdated: new Date(),
});

export const fetchMockData = (count = 10) => {
  return Array.from({ length: count }, () => generateProduct());
};
