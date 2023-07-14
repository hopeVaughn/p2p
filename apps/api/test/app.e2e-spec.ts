import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateBathroomDto } from 'src/bathroom/dto';

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
    const dto: AuthDto = {
      email: 'hope@email.com',
      password: 'hope123',
    };
    describe('Signup', () => {
      describe('Signup', () => {
        it('should throw if the password field is left blank', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              email: '',
              password: dto.password,
            })
            .expectStatus(400);
        });
        it('should throw if the email field is left blank', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              email: dto.email,
              password: '',
            })
            .expectStatus(400);
        });
        it('should throw if there is no body', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody({
              email: '',
              password: '',
            })
            .expectStatus(400);
        });
        it('should create a new user', () => {
          return pactum
            .spec()
            .post('/auth/signup')
            .withBody(dto)
            .expectStatus(201)
            .inspect();
        });
      });
    });
    describe('Signin', () => {
      describe('Signin', () => {
        it('should throw if the email field is left blank', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: dto.email,
              password: '',
            })
            .expectStatus(400);
        });
        it('should throw if the password field is left blank', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: '',
              password: dto.password,
            })
            .expectStatus(400);
        });
        it('should throw if there is no body', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: '',
              password: '',
            })
            .expectStatus(400);
        });
        it('should sign in an existing user', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .inspect()
            .stores('userAt', 'access_token');
        });
      });
    });
  });
  describe('Bathroom', () => {
    describe('Get All Bathrooms', () => {
      it('Get All Bathrooms', () => {
        return pactum
          .spec()
          .get('/bathroom/all_bathrooms')
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Create Bathroom', () => {
      const dto: CreateBathroomDto = {
        createdBy: '$S{userAt.id}',
        gender: 'GENDERED',
        stallType: 'CONNECTED',
        wheelchairAccessible: true,
        stars: 2,
        keyRequirement: false,
        hoursOfOperation: '24/7',
        latitude: 122.22,
        longitude: 122.22,
        address: '1234 Main St',
      };
      it('create a bathroom', () => {
        return pactum
          .spec()
          .post('/bathroom/add_bathroom')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
  });
});
