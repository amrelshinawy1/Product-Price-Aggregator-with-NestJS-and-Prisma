# Product Aggregator API

This project implements a product aggregator API using NestJS, Prisma, and basic API key authentication. The API fetches product data from multiple external providers, stores it in a PostgreSQL database using Prisma, and provides endpoints for managing and viewing products. 

Additionally, the API supports **basic authentication** via API keys and provides real-time updates using **Server-Sent Events (SSE)**.

## Features

- **Product Aggregation**: Periodically fetches data from multiple external APIs.
- **CRUD Operations**: Basic Create, Read, Update, and Delete operations for products.
- **Real-time Updates**: Real-time data streaming via SSE.
- **API Key Authentication**: Access to the API is secured with API keys.
- **Sorting and Filtering**: Sort products by name, price, or availability. Search and paginate products.

## Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) or any database compatible with Prisma
- [NestJS CLI](https://docs.nestjs.com/) (Optional)
- [Prisma](https://www.prisma.io/docs/orm/prisma-client)

## Setup
### 1. Clone the Repository

```bash
git clone https://github.com/amrelshinawy1/Product-Price-Aggregator-with-NestJS-and-Prisma.git

cd product-price-aggregator

npm install

npx prisma migrate dev

npx prisma generate


npm run start
