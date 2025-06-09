import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSalarioDto } from './dto/create-salario.dto';
import { FilterSalarioDto } from './dto/filter-salario.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  createSalario(@Body() createSalarioDto: CreateSalarioDto) {
    return this.appService.createSalario(createSalarioDto);
  }

  @Get('registros')
  findAllSalarios(@Query() filter: FilterSalarioDto) {
    return this.appService.findAllSalarios(filter);
  }

  @Get('registros/:id')
  findSalarioById(@Param('id') id: string) {
    return this.appService.findSalarioById(id);
  }
}
