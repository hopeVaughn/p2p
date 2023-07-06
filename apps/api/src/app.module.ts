import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BathroomModule } from './bathroom/bathroom.module';
import { RatingModule } from './rating/rating.module';
import { ReportModule } from './report/report.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { UserReportModule } from './user-report/user-report.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'), // <-- path to the static files
    }),
    AuthModule,
    UserModule,
    BathroomModule,
    RatingModule,
    ReportModule,
    RoleModule,
    UserRoleModule,
    UserReportModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
