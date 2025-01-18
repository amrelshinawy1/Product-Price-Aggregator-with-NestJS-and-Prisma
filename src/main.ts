import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Product Price Aggregator')
    .setDescription('API for aggregating product prices and availability')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Set the view engine to EJS and set the path for views
  app.setViewEngine('ejs');
  app.setBaseViewsDir(path.join(__dirname, '..', 'views')); // Point to the directory where your EJS templates are stored
  
  // Enable CORS
  app.enableCors({
    origin: '*', // Allows all origins (you can restrict this to specific domains)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  await app.listen(3000);
}
bootstrap();
