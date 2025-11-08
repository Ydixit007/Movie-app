import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @UseGuards(AuthGuard)
  @Post("create")
  create(@Request() req, @Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create({ ...createMovieDto, createdBy: req.user.sub });
  }

  @UseGuards(AuthGuard)
  @Get("all")
  findAll(@Request() req) {
    return this.moviesService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.moviesService.update(id, dto, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  remove(@Request() req, @Param('id') id: string) {
    return this.moviesService.remove(id, req.user.sub);
  }
}
