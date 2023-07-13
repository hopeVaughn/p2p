import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

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

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });
  // tear down logic
  afterAll(() => {
    app.close();
  });
  // test logic
  describe('Auth', () => {
    describe('Signup', () => {
      // do something
    });
    describe('Signin', () => {
      // do something
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
