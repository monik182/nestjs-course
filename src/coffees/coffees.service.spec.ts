import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { COFFEE_BRANDS } from './coffee.constants';
import coffeesConfig from '../config/coffees.config';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

const createConfigService = <T = any>() => ({
  get: jest.fn()
});


describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  let configService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: Connection, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: createMockRepository() }, // 👈
        { provide: getRepositoryToken(Coffee), useValue: createMockRepository() }, // 👈
        { provide: COFFEE_BRANDS, useValue: [] }, // 👈
        { provide: ConfigService, useValue: createConfigService() }, // 👈
        { provide: coffeesConfig.KEY, useValue: {} }, // 👈
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = 1;
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const coffeeId = undefined;
        coffeeRepository.findOne.mockReturnValue(coffeeId);

        try {
          await service.findOne(coffeeId);
          done();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
// npm run test:watch -- coffees.service
