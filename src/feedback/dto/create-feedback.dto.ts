import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDTO {
  @IsString()
  @IsNotEmpty()
  description: string;
}
