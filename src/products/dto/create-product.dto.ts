import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Min(0)
  @IsInt()
  quantity: number;

  @IsOptional()
  @IsString()
  subcategory: string;

  // @IsUUID()
  // ownerId: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}
