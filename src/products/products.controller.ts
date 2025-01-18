// src/product/product.controller.ts
import { Controller, Get, Post, Param, Query, Sse, Render, UseGuards } from '@nestjs/common';
import { ProductService } from './products.service';
import { Observable, interval, map } from 'rxjs';
import { ApiKeyGuard } from 'src/auth/auth.api.key';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Render('index') // Render the 'index.ejs' file
  async getAllProductsView() {
    const apiKey = process.env.API_KEY; // Fetch the API key from environment variables

    const products = await this.productService.getAllProducts();
    return { products, apiKey }; // Pass the products to the EJS template
  }
  @UseGuards(ApiKeyGuard)
  @Sse('stream')
  streamProducts(): Observable<any> {
    return interval(5000).pipe( // Fetch data every 5 seconds
      map(() => ({
        data: this.productService.getAllProducts()
      }))
    );
  }

  @UseGuards(ApiKeyGuard)
  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
    ) {
    return this.productService.getAllProducts(page, limit, search, sortBy, sortOrder);
  }
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }
  @UseGuards(ApiKeyGuard)
  @Get('changes')
  async getChanges(@Query('timeframe') timeframe: string) {
    return this.productService.getChanges(timeframe);
  }
  @UseGuards(ApiKeyGuard)
  @Post('sync')
  async sync() {
    return this.productService.fetchAndAggregateData();
  }

}
