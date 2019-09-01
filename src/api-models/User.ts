import { IsNotEmpty, IsString, Length } from 'class-validator'
import { IUserAddApiModel } from '../models'

export class UserAddModel implements IUserAddApiModel {
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  password: string

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstname: string

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastname: string

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username: string
}


export function createUserAddModel(data: any): UserAddModel {
  const { firstname, lastname, password, username } = data

  const user = new UserAddModel()
  user.firstname = firstname
  user.lastname = lastname
  user.password = password
  user.username = username

  return user
}
