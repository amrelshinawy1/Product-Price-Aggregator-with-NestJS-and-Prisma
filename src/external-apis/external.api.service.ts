import { Injectable } from '@nestjs/common';
import { fetchMockData } from './external.api.repository'; // Import the mock data fetching function
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExternalApisService {
  constructor(private prisma: PrismaService) {}

  async fetchAndAggregateData() {
    try {
      const products = fetchMockData(20); // Simulate fetching data from 3 external APIs
      for (const product of products) {
        const { name } = product; // Exclude id if it's causing the issue

        await this.prisma.product.upsert({
          where: { name }, // Ensure id is a number
          update: product,
          create: product,
        });
      }
      console.log('Data successfully aggregated and stored');
    } catch (error) {
      console.error('Error while aggregating data:', error);
    }
  }

  // Method to simulate fetching eBook product data
  async getEbookData(): Promise<any[]> {
    return fetchMockData(10); // Simulate fetching 10 products for eBooks
  }

  // Method to simulate fetching software license product data
  async getSoftwareLicenseData(): Promise<any[]> {
    return fetchMockData(10); // Simulate fetching 10 products for Software Licenses
  }

  // Method to simulate fetching digital course product data
  async getDigitalCourseData(): Promise<any[]> {
    return fetchMockData(10); // Simulate fetching 10 products for Digital Courses
  }
}
