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
  Res
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Public } from '../common/decorators/public.decorator';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from '../common/decorators/protocols.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

// @UsePipes(ValidationPipe)
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {

  constructor(private readonly coffeeService: CoffeesService,
              @Inject(REQUEST) private readonly request: Request) {
    // console.log({request});
  }

  // @UsePipes(ValidationPipe)
  // @SetMetadata('isPublic', true)
  @Public()
  @Get()
  findAll(@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
    console.log({protocol});
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get('flavors')
  findAllFlavors(@Res() response) {
    return response.status(333).send('Returns all the coffee flavors');
  }

  // @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
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
  patch(
    @Param('id') id: string, @Body(/*ValidationPipe*/) updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.coffeeService.remove(id);
  }
}
