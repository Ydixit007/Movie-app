import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './entities/movie.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<Movie>) { }

  async create(createMovieDto: CreateMovieDto) {
    try {
      return await this.MovieModel.create(createMovieDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string) {
    return await this.MovieModel.find({ createdBy: userId });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid movie ID');
    }

    const movie = await this.MovieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to update this movie');
    }

    const updated = await this.MovieModel.findByIdAndUpdate(id, updateMovieDto, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  async remove(id: string, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid movie ID');
    }

    const movie = await this.MovieModel.findById(id);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    if (movie.createdBy.toString() !== userId) {
      throw new UnauthorizedException('You are not authorized to delete this movie');
    }

    await this.MovieModel.findByIdAndDelete(id);

    return { message: 'Movie deleted successfully', id };
  }
}
