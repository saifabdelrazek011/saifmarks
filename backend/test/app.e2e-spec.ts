import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { BookmarkDto } from '../src/bookmark/dto';
import { editUserDto } from '../src/user/dto';

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
          .stores('userAT', 'access_token');
      });
    });
  });

  describe('User', () => {
    const dto: editUserDto = {
      firstName: 'TestUpdated',
      lastName: 'UserlastUpdated',
      email: 'test@example.com',
    };
    describe('Get me', () => {
      it('should throw if not authenticated', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .expectStatus(401);
      });
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withBody({ email: '' })
          .expectStatus(401);
      });
      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody({ email: '', password: 'newPassword' })
          .expectStatus(401);
      });
      it('should update user email', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ email: dto.email })
          .expectStatus(200)
          .expectBodyContains(dto.email);
      });
      it('should update user first name', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ firstName: dto.firstName })
          .expectStatus(200)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  describe('Bookmarks', () => {
    const bookmarkDto: BookmarkDto = {
      title: 'Example Bookmark',
      url: 'https://example.com',
    };

    describe('Create Bookmark', () => {});

    describe('Get Bookmarks', () => {});

    describe('Get bookmark by ID', () => {});

    describe('Update Bookmark', () => {});

    describe('Delete Bookmark', () => {});
  });
});

jest.setTimeout(50000);
