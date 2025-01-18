// test/mocks/prisma.service.mock.ts
export class PrismaServiceMock {
    product = {
      upsert: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    };
  }