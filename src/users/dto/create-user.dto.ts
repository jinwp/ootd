import { IsDate, IsInt, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsDate()
  date_joined: Date;

  @IsNotEmpty()
  @IsInt()
  height: number;

  @IsNotEmpty()
  @IsInt()
  weight: number;
}