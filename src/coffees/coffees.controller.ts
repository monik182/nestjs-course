import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query, Request,
  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';

@Controller('coffees')
export class CoffeesController {

  constructor(private readonly coffeeService: CoffeesService,
              @Inject(REQUEST) private readonly request: Request) {
    console.log({request});
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get('flavors')
  findAllFlavors(@Res() response) {
    return response.status(333).send('Returns all the coffee flavors');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeeService.findOne(id);
  }

  @Get('name/:name')
  findOneByName(@Param() params) {
    return `Returns the ${params.name} coffee`;
  }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
}
