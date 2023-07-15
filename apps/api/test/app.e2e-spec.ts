import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { CreateBathroomDto } from '../src/bathroom/dto';
import { CreateRatingDto, UpdateRatingDto } from '../src/rating/dto';
import * as jwt from 'jsonwebtoken';
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
    let accessToken: string;
    let userUuid: string;

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
            .expectStatus(201);
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
        it('should sign in an existing user', async () => {
          const response = await pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200);

          accessToken = response.json.access_token;

          // Decode the token to get the userUuid
          const decodedToken = jwt.decode(accessToken);
          userUuid = decodedToken['sub'].toString();
        });
      });
    });
    describe('Bathroom', () => {
      let bathroomUuid: string;

      const dto: CreateBathroomDto = {
        createdBy: '',
        gender: 'GENDERED',
        stallType: 'SINGLE_STALL',
        wheelchairAccessible: true,
        stars: 4,
        keyRequirement: true,
        hoursOfOperation: '9 to 5',
        latitude: 48.4294,
        longitude: -123.3645,
        address: '2323 Blanshard St, Victoria, BC, Canada',
      };
      describe('Create Bathroom', () => {
        it('create a bathroom', async () => {
          const response = await pactum
            .spec()
            .post('/bathroom/add_bathroom')
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .withBody({
              ...dto,
              createdBy: userUuid,
            })
            .expectStatus(201)
            .inspect();

          bathroomUuid = response.json.id;
          console.log('bathroomUuid', bathroomUuid);
        });
        it('should fail to create a bathroom without a token', async () => {
          return pactum
            .spec()
            .post('/bathroom/add_bathroom')
            .withBody({
              ...dto,
              createdBy: userUuid,
            })
            .expectStatus(401); // Expecting Unauthorized
        });
        it('should fail to create a bathroom with invalid data', async () => {
          return pactum
            .spec()
            .post('/bathroom/add_bathroom')
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .withBody({
              ...dto,
              createdBy: userUuid,
              stars: 'invalid', // Invalid value for stars
            })
            .expectStatus(400); // Expecting Bad Request
        });
      });
      describe('Get All Bathrooms', () => {
        it('Get All Bathrooms', () => {
          return pactum
            .spec()
            .get('/bathroom/all_bathrooms')
            .expectStatus(200)
            .inspect();
        });
      });
      describe('Get Bathroom By Id', () => {
        it('Gets a bathroom by id', () => {
          return pactum
            .spec()
            .get(`/bathroom/${bathroomUuid}`)
            .expectStatus(200)
            .inspect();
        });
        it('should fail to get a bathroom by non-existent id', () => {
          return pactum
            .spec()
            .get(`/bathroom/non_existent_id`)
            .expectStatus(404); // Expecting Not Found
        });
      });
      describe('Edit Bathroom By Id', () => {
        it('Edits a bathroom by id', () => {
          return pactum
            .spec()
            .patch(`/bathroom/${bathroomUuid}`)
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .withBody({
              ...dto,
              stars: 1,
            })
            .expectStatus(200)
            .inspect();
        });
        it('should fail to edit a bathroom by non-existent id', () => {
          return pactum
            .spec()
            .patch(`/bathroom/non_existent_id`)
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .withBody({
              ...dto,
              stars: 1,
            })
            .expectStatus(404); // Expecting Not Found
        });

        it('should fail to edit a bathroom without a token', () => {
          return pactum
            .spec()
            .patch(`/bathroom/${bathroomUuid}`)
            .withBody({
              ...dto,
              stars: 1,
            })
            .expectStatus(401); // Expecting Unauthorized
        });
      });
      describe('Delete Bathroom By Id', () => {
        it('Deletes a bathroom by id', () => {
          return pactum
            .spec()
            .delete(`/bathroom/${bathroomUuid}`)
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .expectStatus(204)
            .inspect();
        });
        it('should fail to delete a bathroom by non-existent id', () => {
          return pactum
            .spec()
            .delete(`/bathroom/non_existent_id`)
            .withHeaders({
              Authorization: 'Bearer ' + accessToken,
            })
            .expectStatus(404); // Expecting Not Found
        });

        it('should fail to delete a bathroom without a token', () => {
          return pactum
            .spec()
            .delete(`/bathroom/${bathroomUuid}`)
            .expectStatus(401); // Expecting Unauthorized
        });
      });
    });
    describe('Verify', () => {
      let newUserUuid: string;
      let bathroomUuid: string;
      let newAccessToken: string;
      it("should verify a different user's bathroom", async () => {
        // Create a new user
        const newUserDto: AuthDto = {
          email: 'newuser@email.com',
          password: 'newuser123',
        };
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(newUserDto)
          .expectStatus(201);

        // Sign in as the new user
        const response = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(newUserDto)
          .expectStatus(200);

        newAccessToken = response.json.access_token;

        // Decode the new user's token to get the userUuid
        const decodedNewToken = jwt.decode(newAccessToken);
        newUserUuid = decodedNewToken['sub'].toString();

        // Create a bathroom using the previous user's bathroomUuid
        const createBathroomDto: CreateBathroomDto = {
          createdBy: '',
          gender: 'GENDERED',
          stallType: 'SINGLE_STALL',
          wheelchairAccessible: true,
          stars: 4,
          keyRequirement: true,
          hoursOfOperation: '9 to 5',
          latitude: 51.5074,
          longitude: -0.1278,
          address: '10 Downing Street, London, UK',
        };

        const createResponse = await pactum
          .spec()
          .post('/bathroom/add_bathroom')
          .withHeaders({
            Authorization: 'Bearer ' + newAccessToken,
          })
          .withBody({
            ...createBathroomDto,
            createdBy: newUserUuid,
          })
          .expectStatus(201)
          .inspect();

        bathroomUuid = createResponse.json.id;
        console.log('bathroomUuid', bathroomUuid);

        // Verify the original user's bathroom
        await pactum
          .spec()
          .post(`/verify/${bathroomUuid}`)
          .withHeaders({
            Authorization: 'Bearer ' + accessToken, // Use the original user's accessToken
          })
          .withBody({
            bathroomId: bathroomUuid,
            userId: userUuid,
          })
          .expectStatus(201);
      });
      it('should fail to verify a bathroom without a token', async () => {
        return pactum
          .spec()
          .post(`/verify/${bathroomUuid}`)
          .withBody({
            bathroomId: bathroomUuid,
            userId: userUuid,
          })
          .expectStatus(401); // Expecting Unauthorized
      });

      it('should fail to verify a non-existent bathroom', async () => {
        return pactum
          .spec()
          .post(`/verify/non_existent_id`)
          .withHeaders({
            Authorization: 'Bearer ' + accessToken, // Use the original user's accessToken
          })
          .withBody({
            bathroomId: 'non_existent_id',
            userId: userUuid,
          })
          .expectStatus(404); // Expecting Not Found
      });
    });
    describe('Rating', () => {
      let ratingId: string;
      let newUserUuid: string;
      let bathroomUuid: string;
      let newAccessToken: string;

      it("should rate a different user's bathroom", async () => {
        // Create a new user
        const newUserDto: AuthDto = {
          email: 'newuser2@email.com',
          password: 'newuser1234',
        };
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(newUserDto)
          .expectStatus(201);

        // Sign in as the new user
        const response = await pactum
          .spec()
          .post('/auth/signin')
          .withBody(newUserDto)
          .expectStatus(200);

        newAccessToken = response.json.access_token;

        // Decode the new user's token to get the userUuid
        const decodedNewToken = jwt.decode(newAccessToken);
        newUserUuid = decodedNewToken['sub'].toString();

        // Create a bathroom using the previous user's bathroomUuid
        const createBathroomDto: CreateBathroomDto = {
          createdBy: '',
          gender: 'GENDERED',
          stallType: 'SINGLE_STALL',
          wheelchairAccessible: true,
          stars: 4,
          keyRequirement: true,
          hoursOfOperation: '9 to 5',
          latitude: 51.5074,
          longitude: -0.1278,
          address: '10 Downing Street, London, UK',
        };

        const createResponse = await pactum
          .spec()
          .post('/bathroom/add_bathroom')
          .withHeaders({
            Authorization: 'Bearer ' + newAccessToken,
          })
          .withBody({
            ...createBathroomDto,
            createdBy: newUserUuid,
          })
          .expectStatus(201)
          .inspect();

        bathroomUuid = createResponse.json.id;

        // Rate the original user's bathroom
        const createRatingDto: CreateRatingDto = {
          bathroomId: bathroomUuid,
          ratedById: userUuid,
          stars: 3,
        };

        const ratingResponse = await pactum
          .spec()
          .post('/rating')
          .withHeaders({
            Authorization: 'Bearer ' + accessToken, // Use the original user's accessToken
          })
          .withBody(createRatingDto)
          .expectStatus(201)
          .inspect();

        ratingId = ratingResponse.json.id;

        // Update the rating
        const updateRatingDto: UpdateRatingDto = {
          bathroomId: bathroomUuid,
          ratedById: userUuid,
          stars: 5,
        };

        await pactum
          .spec()
          .patch(`/rating/${ratingId}`)
          .withHeaders({
            Authorization: 'Bearer ' + accessToken,
          })
          .withBody(updateRatingDto)
          .expectStatus(200);
      });
      it('should fail to rate a bathroom without a token', async () => {
        const createRatingDto: CreateRatingDto = {
          bathroomId: bathroomUuid,
          ratedById: userUuid,
          stars: 3,
        };

        return pactum
          .spec()
          .post('/rating')
          .withBody(createRatingDto)
          .expectStatus(401); // Expecting Unauthorized
      });

      it('should fail to rate a non-existent bathroom', async () => {
        const createRatingDto: CreateRatingDto = {
          bathroomId: 'b7f3f64b-cdb0-4caf-8f56-812c79529b78',
          ratedById: userUuid,
          stars: 3,
        };

        return pactum
          .spec()
          .post('/rating')
          .withHeaders({
            Authorization: 'Bearer ' + accessToken,
          })
          .withBody(createRatingDto)
          .expectStatus(404); // Expecting Not Found
      });
    });
  });
});
