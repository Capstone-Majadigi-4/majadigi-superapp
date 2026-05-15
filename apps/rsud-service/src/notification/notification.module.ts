import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { NotificationService } from './notification.service';

@Global()
@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    if (admin.apps.length > 0) return;

    const projectId = this.config.get<string>('FCM_PROJECT_ID');
    if (!projectId) return; // FCM tidak dikonfigurasi, skip init

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail: this.config.get<string>('FCM_CLIENT_EMAIL'),
        privateKey: this.config.get<string>('FCM_PRIVATE_KEY')?.replaceAll(/\\n/g, '\n'),
      }),
    });
  }
}
