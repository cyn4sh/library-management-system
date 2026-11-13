import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author!: string;

  @IsString()
  @Matches(/^(\d{10}|\d{13})$/, { message: 'isbn must be 10 or 13 digits' })
  isbn!: string;

  @IsInt()
  @Min(1)
  totalCopies!: number;

  @IsInt()
  @Min(1)
  genreId!: number;

  @IsInt()
  @Min(1000)
  @Max(2100)
  publicationYear!: number;
}