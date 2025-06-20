import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await moduleRef.createNestApplication();

    await app.init();
    await app.listen(9998);

    prisma = app.get<PrismaService>(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:9998');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@saifabdelrazek.com',
      password: 'justTesting$3',
    };

    describe('Signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if email invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'invalidEmail', password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password weak', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, password: 'weak' })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
      it('should throw if email already exists', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Signin', () => {
      let access_token: string;
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if email invalid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'invalidEmail', password: dto.password })
          .expectStatus(400);
      });
      it(`should throw if user doesn't exist`, () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'nonexistent@user.com', password: dto.password })
          .expectStatus(403);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('access_token', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      const access_token = pactum.spec();
      it('should get current user', () => {
        console.log('Access Token:', access_token);
        return pactum
          .spec()
          .get('/user/me')
          .withHeaders({ Authorization: `Bearer ${access_token}` })
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmark', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete bookmark', () => {});

    describe('Create bookmark', () => {});
  });
});
