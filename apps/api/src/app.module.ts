import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BathroomModule } from './bathroom/bathroom.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'), // <-- path to the static files
    }),
    AuthModule,
    UserModule,
    BathroomModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
