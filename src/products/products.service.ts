// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import { ExternalApisService } from 'src/external-apis/external.api.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService, private readonly externalApisService: ExternalApisService) { }
  async fetchAndAggregateData(): Promise<Product[]> {
    try {
      const [ebookData, softwareLicenseData, digitalCourseData] = await Promise.all([
          this.externalApisService.getEbookData(),
          this.externalApisService.getSoftwareLicenseData(),
          this.externalApisService.getDigitalCourseData()
        ]);
      const products = [...ebookData, ...softwareLicenseData, ...digitalCourseData]
      // Combine all product data into one array
      for (const product of products) {
        const { name } = product; // Exclude id if it's causing the issue

        await this.prisma.product.upsert({
          where: { name }, // Ensure id is a number
          update: product,
          create: product,
        });
      }
      console.log('Data successfully aggregated and stored');

      return this.prisma.product.findMany()
    } catch (error) {
      console.error('Error while aggregating data:', error);
    }
  }

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<Product[]> {
    try {
      const skip = (page - 1) * limit; // Calculate pagination skip
      const products = await this.prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive', // Case-insensitive search
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive', // Case-insensitive search
              },
            },
          ],
        },
        orderBy: {
          [sortBy]: sortOrder, // Sorting based on the provided field and order
        },
        skip, // Skip for pagination
        take: Number(limit), // Limit the number of products
      });

      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Error fetching products');
    }
  }

  async getProductById(id: string): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id: Number(id) }, // Ensure id is a number
    });
  }

  async getChanges(timeframe: string): Promise<Product[]> {
    const recentChanges = await this.prisma.product.findMany({
      where: {
        lastUpdated: {
          gte: new Date(Date.now() - parseInt(timeframe) * 60 * 1000), // Changes within the timeframe
        },
      },
    });
    return recentChanges;
  }
}
