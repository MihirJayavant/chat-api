import { IsNotEmpty, IsString, Length } from 'class-validator'


export class LoginModel {

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  username: string

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  password: string
}

export function createLoginModel(data: any): LoginModel {
  const { username, password } = data
  const model = new LoginModel()
  model.password = password
  model.username = username
  return model
}
