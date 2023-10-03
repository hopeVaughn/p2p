/**
 * The root module of the NestJS application.
 *
 * This module imports all the necessary modules for the application to run, including:
 * - ConfigModule: for loading configuration files
 * - ServeStaticModule: for serving static files
 * - AuthModule: for authentication
 * - UserModule: for user management
 * - BathroomModule: for bathroom management
 * - RatingModule: for rating management
 * - ReportModule: for report management
 * - RoleModule: for role management
 * - UserRoleModule: for user role management
 * - UserReportModule: for user report management
 * - VerifyModule: for user verification
 * - PrismaModule: for database management
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BathroomModule } from './bathroom/bathroom.module';
import { RatingModule } from './rating/rating.module';
import { ReportModule } from './report/report.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserReportModule } from './user-report/user-report.module';
import { VerifyModule } from './verify/verify.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard, RolesGuard } from './common/guards';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'), // <-- path to the static files
    }),
    AuthModule,
    UserModule,
    BathroomModule,
    RatingModule,
    ReportModule,
    UserRoleModule,
    UserReportModule,
    VerifyModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
