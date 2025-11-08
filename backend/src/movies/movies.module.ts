import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './entities/movie.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [ConfigModule.forRoot(), MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }],)]

})
export class MoviesModule { }
