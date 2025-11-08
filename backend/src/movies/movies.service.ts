import { Injectable, NotFoundException, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Movie } from './entities/movie.entity';
import { Model, Types } from 'mongoose';
import { s3 } from 'src/config/s3.config';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private MovieModel: Model<Movie>) { }

  async uploadToS3(file: Express.Multer.File): Promise<string> {
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new BadRequestException('AWS S3 bucket name is not configured');
    }

    const uploadParams = {
      Bucket: bucketName,
      Key: `movies/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await s3.upload(uploadParams).promise();
    return result.Location;
  }

  async deleteFromS3(fileUrl: string): Promise<void> {
    if (!fileUrl) return;

    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    if (!bucketName) {
      throw new BadRequestException('AWS S3 bucket name is not configured');
    }

    try {
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1);
      const deleteParams = {
        Bucket: bucketName,
        Key: key,
      };

      await s3.deleteObject(deleteParams).promise();
    } catch (error) {
      console.error('Error deleting file from S3:', error);
    }
  }

  async create(createMovieDto: CreateMovieDto, file?: Express.Multer.File) {
    try {
      let coverUrl = '';
      if (file) {
        coverUrl = await this.uploadToS3(file);
      }

      const newMovie = new this.MovieModel({
        ...createMovieDto,
        cover: coverUrl,
      });

      return await newMovie.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Movie Already Exists');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return await this.MovieModel.find({ createdBy: userId });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string, file?: Express.Multer.File) {
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

    let coverUrl = movie.cover;
    if (file) {
      if (movie.cover) {
        await this.deleteFromS3(movie.cover);
      }

      coverUrl = await this.uploadToS3(file);
    }

    const updated = await this.MovieModel.findByIdAndUpdate(
      id,
      { ...updateMovieDto, cover: coverUrl },
      {
        new: true,
        runValidators: true,
      }
    );

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

    if (movie.cover) {
      await this.deleteFromS3(movie.cover);
    }

    await this.MovieModel.findByIdAndDelete(id);

    return { message: 'Movie deleted successfully', id };
  }
}