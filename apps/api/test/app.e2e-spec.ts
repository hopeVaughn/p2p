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
  describe('Bathrooms', () => {
    let jwt: JwtService;
    let access_token: string;
    let userId: string;
    beforeAll(async () => {
      access_token = await pactum.spec().get('userAt');
      jwt = app.get(JwtService);
      const decodedToken = jwt.decode(access_token) as any;
      userId = decodedToken.id;
    });
    describe('Create Bathroom', () => {
      const dto: CreateBathroomDto = {
        createdBy: userId,
        gender: 'GENDERED',
        stallType: 'CONNECTED',
        wheelchairAccessible: true,
        stars: 2,
        keyRequirement: false,
        hoursOfOperation: '9 AM - 6 PM',
        latitude: 123.456,
        longitude: 789.012,
        address: '123 Main Street',
      };
      const url = '/bathroom/add_bathroom';
      it('Create a new bathroom', () => {
        return pactum
          .spec()
          .post(url)
          .withHeaders({
            Authorization: `Bearer ${access_token}`,
          })
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe('Get All Bathrooms', () => {
      it('Get All Bathrooms', () => {
        // do something
      });
    });
    it('Get Bathroom by ID', () => {
      // do something
    });
    it('Delete Bathroom', () => {
      // do something
    });
  });
  describe('Rating', () => {
    it('Add rating to a bathroom that does not exist', () => {
      // do something
    });
    it('Add Rating', () => {
      // do something
    });
    it('Edit Rating', () => {
      // do something
    });
  });
  describe('Verify', () => {
    it('Verify Own Bathroom', () => {
      // do something
    });
    it('Verify Another Users Bathroom', () => {
      // do something
    });
  });
});
