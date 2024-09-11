import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ChangePassDTO {
  @IsNotEmpty()
  @IsString()
  @Min(8)
  password: string;
}
