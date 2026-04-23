import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async send(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    if (!fcmToken) return;
    try {
      await admin.messaging().send({ token: fcmToken, notification: { title, body }, data });
    } catch (err: any) {
      this.logger.warn(`FCM gagal [${fcmToken.slice(0, 10)}...]: ${err.message}`);
    }
  }

  async sendMultiple(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const valid = tokens.filter(Boolean);
    if (valid.length === 0) return;
    try {
      await admin.messaging().sendEachForMulticast({ tokens: valid, notification: { title, body }, data });
    } catch (err: any) {
      this.logger.warn(`FCM multicast gagal: ${err.message}`);
    }
  }
}
