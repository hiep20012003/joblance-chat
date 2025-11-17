import path from 'path';

import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({
  path: path.resolve(
    process.cwd(),
    `.env.${process.env.NODE_ENV || 'development'}`
  ),
});

class Config {
  // Application
  public NODE_ENV: string = process.env.NODE_ENV || 'development';
  public PORT: number = parseInt(process.env.PORT || '4006', 10);

  // Gateway
  public API_GATEWAY_URL: string = process.env.API_GATEWAY_URL || 'http://localhost:4000';
  public CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';

  // Database (MongoDB)
  public DATABASE_URL: string =
    process.env.DATABASE_URL || '';

  // Messaging / RabbitMQ
  public RABBITMQ_URL: string =
    process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

  public REDIS_URL: string =
    process.env.REDIS_URL || 'amqp://guest:guest@localhost:5672';

  // Gateway secret for internal JWT
  public GATEWAY_SECRET_KEY: string = process.env.GATEWAY_SECRET_KEY || '';

  // Cloudinary
  public CLOUDINARY_CLOUD_NAME: string = process.env.CLOUD_NAME || '';
  public CLOUDINARY_API_KEY: string = process.env.CLOUD_API_KEY || '';
  public CLOUDINARY_API_SECRET: string = process.env.CLOUD_API_SECRET || '';

  // APM
  public ENABLE_APM: boolean = process.env.ENABLE_APM === '1';
  public ELASTIC_APM_SERVER_URL: string = process.env.ELASTIC_APM_SERVER_URL || '';
  public ELASTIC_APM_SECRET_TOKEN: string = process.env.ELASTIC_APM_SECRET_TOKEN || '';

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_CLOUD_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET,
      secure: true
    });
  }
}

export const config = new Config();
