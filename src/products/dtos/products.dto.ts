import { IsString, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsBoolean()
  availability: boolean;

  @IsDate()
  lastUpdated: Date; // Add this field
}
