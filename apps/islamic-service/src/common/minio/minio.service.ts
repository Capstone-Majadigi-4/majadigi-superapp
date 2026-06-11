import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MetricsService } from '../../metrics/metrics.service';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly logger = new Logger(MinioService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly metrics: MetricsService, // ← tambah
  ) {
    this.bucket = this.config.getOrThrow('MINIO_BUCKET');
    this.client = new Client({
      endPoint: this.config.getOrThrow('MINIO_ENDPOINT'),
      port: Number.parseInt(this.config.getOrThrow('MINIO_PORT'), 10),
      useSSL: this.config.get('MINIO_USE_SSL') === 'true',
      accessKey: this.config.getOrThrow('MINIO_USER'),
      secretKey: this.config.getOrThrow('MINIO_PASSWORD'),
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
      this.logger.log(`Bucket '${this.bucket}' dibuat`);
    }
  }

  async uploadFile(
    filename: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<string> {
    try {
      await this.client.putObject(
        this.bucket,
        filename,
        buffer,
        buffer.length,
        {
          'Content-Type': mimetype,
        },
      );
      this.metrics.minioUploadTotal.inc({ status: 'success' }); // ← tambah
      const endpoint = this.config.getOrThrow('MINIO_ENDPOINT');
      const port = this.config.getOrThrow('MINIO_PORT');
      return `http://${endpoint}:${port}/${this.bucket}/${filename}`;
    } catch (err) {
      this.metrics.minioUploadTotal.inc({ status: 'error' }); // ← tambah
      throw err;
    }
  }

  async deleteFile(filename: string): Promise<void> {
    await this.client.removeObject(this.bucket, filename);
  }
}
