import { IsDate, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  // @MinLength(8)
  password: string;

  // @IsNotEmpty()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_joined: Date;

  @IsNotEmpty()
  @IsInt()
  height: number;

  @IsNotEmpty()
  @IsInt()
  weight: number;
}