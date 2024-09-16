import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePassDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
