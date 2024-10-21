import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  // id: string;

  // @IsString()
  // @IsNotEmpty()
  // name: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(5)
  // username: string;

  // @IsString()
  // @IsNotEmpty()
  // @MinLength(8, { message: 'Password too short' })
  // password: string;

  // @IsEmail()
  // email: string;

  // @IsEnum(UserRole)
  // role?: UserRole;

  // @IsString()
  // @IsOptional()
  // phoneNumber: string;

  // @IsOptional()
  // @IsString()
  // codeVerification?: string;
  // @IsOptional()
  // createdAt?: Date;
  // @IsOptional()
  // @IsString()
  // twoFactorSecret?: string;
  // @IsOptional()
  // isTwoFactorAuthEnabled?: boolean;
  // @IsOptional()
  // recoverPassword: boolean;
  // @IsOptional()
  // codeRecover: string;
  // @IsOptional()
  // address: [];
  // @IsOptional()
  // active: boolean;
  // @IsOptional()
  // products: [];
  // @IsOptional()
  // logins: [];
  // @IsOptional()
  // dataChanges: [];
}
