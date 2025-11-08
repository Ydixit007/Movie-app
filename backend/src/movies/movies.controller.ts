import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @UseGuards(AuthGuard)
  @Post("create")
  @UseInterceptors(FileInterceptor('cover'))
  create(
    @Request() req,
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.moviesService.create({ ...createMovieDto, createdBy: req.user.sub }, file);
  }

  @UseGuards(AuthGuard)
  @Get("all")
  findAll(@Request() req) {
    return this.moviesService.findAll(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('cover'))
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateMovieDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.moviesService.update(id, dto, req.user.sub, file);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  remove(@Request() req, @Param('id') id: string) {
    return this.moviesService.remove(id, req.user.sub);
  }
}