import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';
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
      it('should throw if not authesnticated', () => {
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
    const bookmarkDto: CreateBookmarkDto = {
      title: 'Example Bookmark',
      url: 'https://example.com',
      description: 'This is the main bookmark',
    };

    const updatedBookmarkDto: UpdateBookmarkDto = {
      title: 'Updated Bookmark',
      url: 'https://updated.example.com',
      description: 'This is the updated bookmark',
    };

    describe('Create Bookmark', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withBody(bookmarkDto)
          .expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody(bookmarkDto)
          .expectStatus(401);
      });

      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(bookmarkDto)
          .expectStatus(201)
          .stores('bookmarkId', 'bookmark.id');
      });
    });

    describe('Get Bookmarks', () => {
      it('should throw if not authenticated', () => {
        return pactum.spec().get('/bookmarks').expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .expectStatus(401);
      });

      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });

    describe('Get bookmark by ID', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .get('/bookmarks/{bookmarkId}')
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .get('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should get bookmark by ID', () => {
        return pactum
          .spec()
          .get('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .expectStatus(200)
          .expectJsonLike({
            bookmark: {
              id: '$S{bookmarkId}',
              title: bookmarkDto.title,
              url: bookmarkDto.url,
            },
          })
          .stores('userBookmarkId', 'bookmark.userBookmarkId');
      });
    });

    describe('Update Bookmark', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{bookmarkId}')
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .withBody(updatedBookmarkDto)
          .expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody(updatedBookmarkDto)
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .expectStatus(401);
      });

      it('should throw if no field updated', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .withBody(updatedBookmarkDto)
          .expectStatus(403);
      });

      it('should update the url of the bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .withBody(updatedBookmarkDto.url)
          .expectStatus(200)
          .expectJsonLike({
            bookmark: {
              id: '$S{bookmarkId}',
              title: updatedBookmarkDto.title,
              url: bookmarkDto.url,
            },
          });
      });

      it('should update the title of bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{bookmarkId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withPathParams('bookmarkId', '$S{bookmarkId}')
          .withBody(updatedBookmarkDto.title)
          .expectStatus(200)
          .expectJsonLike({
            bookmark: {
              id: '$S{bookmarkId}',
              title: updatedBookmarkDto.title,
              url: updatedBookmarkDto.url,
            },
          });
      });
    });

    describe('Delete Bookmark', () => {});
  });
});

jest.setTimeout(50000);
