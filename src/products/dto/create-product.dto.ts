import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
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

  @IsUUID()
  ownerId: string;

  
}
