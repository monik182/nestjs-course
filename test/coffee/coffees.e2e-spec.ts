import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from '../../src/coffees/dto/update-coffee.dto';
import { CreateCoffeeDto } from '../../src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees (e2e)', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
    // recommendations: 0,
    // description: null
  };
  const expectedPartialCoffee = jasmine.objectContaining({
    ...coffee,
    flavors: jasmine.arrayContaining(
      coffee.flavors.map(name => jasmine.objectContaining({ name })),
    ),
  });
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));
    await app.init();
    httpServer = app.getHttpServer();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.ACCEPTED)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(httpServer)
      .get('/coffees')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        console.log(body);
        expect(body.length).toBeGreaterThan(0);
        expect(body[1]).toEqual(expectedPartialCoffee);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(httpServer)
      .get('/coffees/2')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body).toEqual(expectedPartialCoffee);
      });
  });

  it('Update one [PATCH /:id]', () => {
    const updateCoffeeDto: UpdateCoffeeDto = {
      ...coffee,
      name: 'New and Improved Shipwreck Roast'
    };
    return request(httpServer)
      .patch('/coffees/3')
      .send(updateCoffeeDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        expect(body.name).toEqual(updateCoffeeDto.name);

        return request(httpServer)
          .get('/coffees/3')
          .then(({ body }) => {
            expect(body.name).toEqual(updateCoffeeDto.name);
          });
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(httpServer)
      .delete('/coffees/5')
      .expect(HttpStatus.OK)
      .then(() => {
        return request(httpServer)
          .get('/coffees/5')
          .expect(HttpStatus.NOT_FOUND);
      })
  });

  afterAll(async () => {
    await app.close();
  });
});

// npm run test:e2e -- coffees
