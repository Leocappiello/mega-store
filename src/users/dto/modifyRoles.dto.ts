import { ArrayNotEmpty, IsArray, IsEnum, IsString } from 'class-validator';

enum Permissions {
  'ADMIN_CREATE_USER',
  'ADMIN_DELETE_USER',
  'ADMIN_VIEW_USER',
  'ADMIN_UPDATE_USER',
  'USER_VIEW_USER',
  'USER_UPDATE_USER',
}

export class ModifyRolesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsEnum(Permissions, { each: true })
  roles: string[];
}
