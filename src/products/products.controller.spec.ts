import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            createProduct: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createProduct', async () => {
    const dto = { name: 'Test', description: 'Desc', price: 10, currency: 'USD', availability: true };
    const result = { id: '1', ...dto };

    jest.spyOn(service, 'createProduct').mockResolvedValue(result);

    const response = await controller.createProduct(dto);
    expect(response).toEqual(result);
    expect(service.createProduct).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', async () => {
    const result = [{ id: '1', name: 'Test' }];
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    const response = await controller.findAll({});
    expect(response).toEqual(result);
    expect(service.findAll).toHaveBeenCalled();
  });
});
