import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { ApiKeyGuard } from '../auth/auth.api.key';
import { PrismaService } from '../prisma/prisma.service';
import { ExternalApisService } from '../external-apis/external.api.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        PrismaService,
        ExternalApisService,
      ],
    })
    .overrideGuard(ApiKeyGuard) // Mock the API key guard
    .useValue({
      canActivate: jest.fn().mockResolvedValue(true), // Always allow access in tests
    })
    .compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });




  describe('getAllProducts', () => {
    it('should return a paginated list of products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];
      jest.spyOn(productService, 'getAllProducts').mockResolvedValue(mockProducts);

      const result = await productController.getAllProducts(
        1,
        10,
        '',
        'name',
        'asc',
      );

      expect(result).toEqual(mockProducts);
    });
  });

  describe('getProductById', () => {
    it('should return a single product by ID', async () => {
      const mockProduct = { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() };
      jest.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct);

      const result = await productController.getProductById('1');

      expect(result).toEqual(mockProduct);
    });
  });

  describe('getChanges', () => {
    it('should return products that have been updated within a given timeframe', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];
      jest.spyOn(productService, 'getChanges').mockResolvedValue(mockProducts);

      const result = await productController.getChanges('60');

      expect(result).toEqual(mockProducts);
    });
  });

  describe('sync', () => {
    it('should trigger the sync process and return the aggregated products', async () => {
      const mockProducts = [
        { id: 1, name: 'Product 1', description: 'Description 1', price: 10, currency: 'USD', availability: true, lastUpdated: new Date() },
      ];
      jest.spyOn(productService, 'fetchAndAggregateData').mockResolvedValue(mockProducts);

      const result = await productController.sync();

      expect(result).toEqual(mockProducts);
    });
  });
});
