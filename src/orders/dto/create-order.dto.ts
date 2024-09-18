import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  products: string[];
}
