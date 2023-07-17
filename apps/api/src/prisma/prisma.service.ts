import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  /**
   * Creates an instance of PrismaService.
   * @param {ConfigService} config - The configuration service.
   * @memberof PrismaService
   */
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  /**
   * Deletes all data from the bathroom and user tables.
   * @returns {Promise<any[]>} A promise that resolves to an array of the deleted data.
   * @memberof PrismaService
   */
  cleanDb() {
    return this.$transaction([
      this.bathroom.deleteMany({}),
      this.user.deleteMany({}),
    ]);
  }
}
