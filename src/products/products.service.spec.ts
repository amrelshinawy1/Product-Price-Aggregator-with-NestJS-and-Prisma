import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';
import { ExternalApisService } from '../external-apis/external.api.service';
import { PrismaServiceMock } from '../../test/mocks/prisma.service.mock';
import { ExternalApisServiceMock } from '../../test/mocks/external-apis.service.mock';

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;
  let externalApisService: ExternalApisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useClass: PrismaServiceMock },
        { provide: ExternalApisService, useClass: ExternalApisServiceMock },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    externalApisService = module.get<ExternalApisService>(ExternalApisService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('fetchAndAggregateData', () => {
    it('should fetch and aggregate data from external APIs and store in the database', async () => {
      const mockEbookData = [
        { name: 'Ebook 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];
      const mockSoftwareLicenseData = [
        { name: 'Software 1', description: 'Description 2', price: 100, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];
      const mockDigitalCourseData = [
        { name: 'Course 1', description: 'Description 3', price: 50, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];

      // Mocking the response from external APIs
      jest.spyOn(externalApisService, 'getEbookData').mockResolvedValue(mockEbookData);
      jest.spyOn(externalApisService, 'getSoftwareLicenseData').mockResolvedValue(mockSoftwareLicenseData);
      jest.spyOn(externalApisService, 'getDigitalCourseData').mockResolvedValue(mockDigitalCourseData);

      // Mocking Prisma upsert function
      const upsertMock = jest.fn();
      jest.spyOn(prismaService.product, 'upsert').mockImplementation(upsertMock);

      await productService.fetchAndAggregateData();

      // Verify that upsert was called 3 times (once for each product)
      expect(upsertMock).toHaveBeenCalledTimes(3);
      expect(upsertMock).toHaveBeenCalledWith({
        where: { name: 'Ebook 1' },
        update: mockEbookData[0],
        create: mockEbookData[0],
      });
      expect(upsertMock).toHaveBeenCalledWith({
        where: { name: 'Software 1' },
        update: mockSoftwareLicenseData[0],
        create: mockSoftwareLicenseData[0],
      });
      expect(upsertMock).toHaveBeenCalledWith({
        where: { name: 'Course 1' },
        update: mockDigitalCourseData[0],
        create: mockDigitalCourseData[0],
      });
    });
  });

  describe('getAllProducts', () => {
    it('should return a list of products with pagination, search, and sorting', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 20, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts);

      const products = await productService.getAllProducts(1, 10, '', 'name', 'asc');

      expect(products).toEqual(mockProducts);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: '', mode: 'insensitive' } },
            { description: { contains: '', mode: 'insensitive' } },
          ],
        },
        orderBy: { name: 'asc' },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('getProductById', () => {
    it('should return a single product by id', async () => {
      const mockProduct = { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() };

      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(mockProduct);

      const product = await productService.getProductById('1');

      expect(product).toEqual(mockProduct);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getChanges', () => {
    it('should return products that have been updated within the given timeframe', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts);

      const products = await productService.getChanges('60'); // Get changes from the last 60 minutes

      expect(products).toEqual(mockProducts);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { lastUpdated: { gte: expect.any(Date) } },
      });
    });
  });
});
