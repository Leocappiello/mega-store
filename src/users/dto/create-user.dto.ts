import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../role.enum';

export class CreateUserDTO {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password too short' })
  password: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  codeVerification?: string;
  @IsOptional()
  createdAt?: Date;
  @IsOptional()
  @IsString()
  twoFactorSecret?: string;
  @IsOptional()
  isTwoFactorAuthEnabled?: boolean;
  @IsOptional()
  recoverPassword: boolean;
  @IsOptional()
  codeRecover: string;
  @IsOptional()
  address: [];
  @IsOptional()
  active: boolean;
  @IsOptional()
  products: [];
  @IsOptional()
  logins: [];
  @IsOptional()
  dataChanges: [];
  //   role: string;
  //   codeVerification: string;
  //   createdAt: Date;
  //   active: boolean;
  //   address: [];
  //   logins: [];
  //   dataChanges: [];
  //   isTwoFactorAuthEnabled: boolean;
}
