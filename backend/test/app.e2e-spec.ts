import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { CreateBookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';
import { editUserDto, ChangePasswordDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser: AuthDto = {
    email: 'test@saifabdelrazek.com',
    password: 'justTesting$3',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

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
    const dto = testUser;

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
      it('should signup', async () => {
        await pactum
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
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: testUser.password })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: testUser.email })
          .expectStatus(400);
      });
      it('should throw if email invalid', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'invalidEmail', password: testUser.password })
          .expectStatus(400);
      });
      it(`should throw if user doesn't exist`, () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: 'nonexistent@user.com',
            password: testUser.password,
          })
          .expectStatus(403);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(testUser)
          .expectStatus(201)
          .stores('userAT', 'access_token');
      });
    });

    describe('Signout', () => {
      it('should signout', () => {
        return pactum
          .spec()
          .post('/auth/signout')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });

    describe('Email Verification', () => {
      it('should send verification email', () => {
        return pactum
          .spec()
          .patch('/auth/verification/send')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ email: testUser.email })
          .expectStatus(200);
      });
      it('should verify email (invalid token)', () => {
        return pactum
          .spec()
          .patch('/auth/verification')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ email: testUser.email, token: 'invalidtoken' })
          .expectStatus(400);
      });
    });

    describe('Password Reset', () => {
      it('should send reset password email', () => {
        return pactum
          .spec()
          .patch('/auth/password/reset/send')
          .withBody({ email: testUser.email })
          .expectStatus(200);
      });
      it('should reset password (invalid token)', () => {
        return pactum
          .spec()
          .patch('/auth/password/reset')
          .withBody({
            email: testUser.email,
            newPassword: 'newPassword$1',
            token: 'invalidtoken',
          })
          .expectStatus(400);
      });
    });
  });

  // Make the user admin after signup and signin
  describe('Make test user admin', () => {
    it('should make the test user admin', async () => {
      const user = await prisma.user.findFirst({
        where: { emails: { some: { email: testUser.email } } },
      });
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isAdmin: true },
        });
      }
    });
  });

  describe('User', () => {
    const dto: editUserDto = {
      firstName: 'TestUpdated',
      lastName: 'UserlastUpdated',
      email: 'testupdated@saifabdelrazek.com',
    };
    const passwordDto: ChangePasswordDto = {
      currentPassword: 'justTesting$3',
      newPassword: 'newPassword$1',
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

    describe('Change Password', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withBody(passwordDto)
          .expectStatus(401);
      });
      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody(passwordDto)
          .expectStatus(401);
      });
      it('should throw if current password is wrong', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ ...passwordDto, currentPassword: 'wrongPassword' })
          .expectStatus(403);
      });
      it('should change password', () => {
        return pactum
          .spec()
          .patch('/users/password')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(passwordDto)
          .expectStatus(200);
      });
    });

    describe('Delete User', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withBody({ password: passwordDto.newPassword })
          .expectStatus(401);
      });
      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody({ password: passwordDto.newPassword })
          .expectStatus(401);
      });
      it('should throw if password is wrong', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ password: 'wrongPassword' })
          .expectStatus(403);
      });
      it('should delete user', () => {
        return pactum
          .spec()
          .delete('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ password: passwordDto.newPassword })
          .expectStatus(200);
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

    let bookmarkId: string;

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

      it('should create a bookmark', async () => {
        const res = await pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(bookmarkDto)
          .expectStatus(201);
        bookmarkId = res.body.bookmark.id;
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
        return pactum.spec().get(`/bookmarks/${bookmarkId}`).expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .get(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .expectStatus(401);
      });

      it('should get bookmark by ID', () => {
        return pactum
          .spec()
          .get(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLike({
            bookmark: {
              id: bookmarkId,
              title: bookmarkDto.title,
              url: bookmarkDto.url,
            },
          });
      });
    });

    describe('Update Bookmark', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/${bookmarkId}`)
          .withBody(updatedBookmarkDto)
          .expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .withBody(updatedBookmarkDto)
          .expectStatus(401);
      });

      it('should update the bookmark', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody(updatedBookmarkDto)
          .expectStatus(200)
          .expectJsonLike({
            bookmark: {
              id: bookmarkId,
              title: updatedBookmarkDto.title,
              url: updatedBookmarkDto.url,
            },
          });
      });
    });

    describe('Delete Bookmark', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/${bookmarkId}`)
          .expectStatus(401);
      });

      it('should throw if invalid token', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer invalidToken` })
          .expectStatus(401);
      });

      it('should delete the bookmark', () => {
        return pactum
          .spec()
          .delete(`/bookmarks/${bookmarkId}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });
  });

  describe('ShortUrls', () => {
    let shortUrlId: string;
    let shortUrlCode: string;
    const fullUrl = 'https://github.com/saifabdelrazek';
    const customShort = 'saifgit';

    describe('Create ShortUrl', () => {
      it('should throw if not authenticated', () => {
        return pactum
          .spec()
          .post('/shorturl')
          .withBody({ fullUrl })
          .expectStatus(401);
      });

      it('should create a short url', async () => {
        const res = await pactum
          .spec()
          .post('/shorturl')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ fullUrl, shortUrl: customShort })
          .expectStatus(201);
        expect(res.body.shortUrl).toContain(customShort);
        shortUrlCode = customShort;
      });
    });

    describe('Get My ShortUrls', () => {
      it('should get my short urls', () => {
        return pactum
          .spec()
          .get('/shorturl/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .stores('shortUrlId', 'shortUrls[0].id');
      });
    });

    describe('Get ShortUrl by ID', () => {
      it('should get short url by id', () => {
        return pactum
          .spec()
          .get('/shorturl/$S{shortUrlId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLike({
            shortUrl: {
              id: '$S{shortUrlId}',
              fullUrl,
              shortUrl: customShort,
            },
          });
      });
    });

    describe('Get ShortUrl Info by Code', () => {
      it('should get short url info by code', () => {
        return pactum
          .spec()
          .get(`/shorturl/info/${customShort}`)
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLike({
            shortUrl: {
              shortUrl: customShort,
              fullUrl,
            },
          });
      });
    });

    describe('Use ShortUrl (redirect)', () => {
      it('should redirect to the full url', async () => {
        const res = await pactum
          .spec()
          .get(`/shorturl/use/${customShort}`)
          .expectStatus(302);
        expect(res.headers.location).toBe(fullUrl);
      });
    });

    describe('Update ShortUrl', () => {
      it('should update the short url', () => {
        return pactum
          .spec()
          .patch('/shorturl/$S{shortUrlId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .withBody({ fullUrl: 'https://updated.com', shortUrl: 'updatedgit' })
          .expectStatus(200)
          .expectJsonLike({
            shortUrl: {
              fullUrl: 'https://updated.com',
              shortUrl: 'updatedgit',
            },
          });
      });
    });

    describe('Delete ShortUrl', () => {
      it('should delete the short url', () => {
        return pactum
          .spec()
          .delete('/shorturl/$S{shortUrlId}')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200);
      });
    });
    describe('Get My ShortUrls after deletion', () => {
      it('should return empty list after deletion', () => {
        return pactum
          .spec()
          .get('/shorturl/me')
          .withHeaders({ Authorization: `Bearer $S{userAT}` })
          .expectStatus(200)
          .expectJsonLike({
            shortUrls: [],
          });
      });
    });
  });
  describe('Error Handling', () => {
    it('should handle invalid short URL code', () => {
      return pactum
        .spec()
        .get('/shorturl/info/invalidCode')
        .withHeaders({ Authorization: `Bearer $S{userAT}` })
        .expectStatus(404);
    });

    it('should handle non-existent short URL ID', () => {
      return pactum
        .spec()
        .get('/shorturl/nonExistentId')
        .withHeaders({ Authorization: `Bearer $S{userAT}` })
        .expectStatus(404);
    });
  });
});

jest.setTimeout(60000);
