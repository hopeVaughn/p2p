import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  // starting logic
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        skipMissingProperties: true,
      }),
    );
    await app.init();
    app.setGlobalPrefix('/api');
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  // tear down logic
  afterAll(() => {
    app.close();
  });
  // test logic
  describe('Auth', () => {
    describe('Signup', () => {
      it('should create a new user', () => {
        const dto: AuthDto = {
          email: 'hope@email.com',
          password: 'hope123',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it.todo('should sign in an existing user');
    });
  });
  describe('User', () => {
    describe('Get User', () => {
      // do something
    });
    describe('Edit User', () => {
      // do something
    });
  });
  describe('Bathrooms', () => {
    describe('Get All Bathrooms', () => {
      // do something
    });
    describe('Get Bathroom by ID', () => {
      // do something
    });
    describe('Create Bathroom', () => {
      // do something
    });
    describe('Delete Bathroom', () => {
      // do something
    });
  });
  describe('Rating', () => {
    describe('Add Rating', () => {
      // do something
    });
    describe('Edit Rating', () => {
      // do something
    });
    describe('Create Bathroom', () => {
      // do something
    });
  });
  describe('Verify', () => {
    describe('Verify Another User Bathroom', () => {
      // do something
    });
    describe('Verify Own Bathroom', () => {
      // do something
    });
  });
});
