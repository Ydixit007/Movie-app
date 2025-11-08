import { IsString, IsNotEmpty, MinLength, IsDateString, IsMongoId, IsOptional } from 'class-validator';

export class CreateMovieDto {
    @IsString()
    @IsNotEmpty({ message: 'Movie name is required' })
    @MinLength(3, { message: 'Movie name must be at least 3 characters long' })
    movieName: string;

    @IsDateString({}, { message: 'Publish date must be a valid date string (e.g., 2024-07-16)' })
    publishDate: string;

    @IsOptional()
    @IsString()
    cover: string;

    createdBy: string;
}
