import { IsInt, Min } from 'class-validator';

export class FindOrderDTO {
  @IsInt({ message: 'El parametro Skip debe ser un numero entero' })
  @Min(0, { message: 'El parametro Skip debe ser un numero positivo' })
  skip: number;

  @IsInt({ message: 'El parametro Take debe ser un numero entero' })
  @Min(1, { message: 'El parametro Take debe ser mayor a 1' })
  take: number;
}
